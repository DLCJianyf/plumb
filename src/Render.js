import Link from "./Link";
import Util from "./Util";
import DOMUtil from "./DOMUtil";

/**
 * 渲染类，根据构建好的参数进行dom神马的创建，更新
 */
class Render {
    /**
     * 更新dom元素位置
     *
     * @param {HTMLDocument} el
     * @param {Number} x
     * @param {Number} y
     */
    static updatePosition(el, x, y) {
        DOMUtil.setPosition(el, { left: x, top: y });
    }

    /**
     * 创建div
     *
     * @param {String} id
     * @param {String} className
     * @param {Object} style
     */
    static createDiv(id, className, style) {
        style = Object.assign({}, style, { position: "absolute", zIndex: 1 });

        return DOMUtil.createElement("div", style, className, { id: id });
    }

    /**
     * 创建SVG
     *
     * @param {Number} width
     * @param {Number} height
     * @param {Object} style
     */
    static createSVG(width, height, style) {
        style = Object.assign({}, style, { position: "absolute" });

        return DOMUtil.createElementNS(DOMUtil.ns, "svg", style, null, {
            version: "1.1",
            position: "absolute",
            width: width,
            height: height
        });
    }

    /**
     * 创建SVG圆
     *
     * @param {Number} x
     * @param {Number} y
     * @param {Number} r
     */
    static createCircle(x, y, r) {
        return DOMUtil.createElementNS(DOMUtil.ns, "circle", {}, null, {
            id: Util.guid(),
            cx: x,
            cy: y,
            r: r,
            version: "1.1",
            fill: "gray",
            stroke: "none"
        });
    }

    /**
     * 创建箭头
     *
     * @param {Number} x
     * @param {Number} y
     * @param {Number} r
     */
    static createArrow(x, y, r) {
        const w = 2 * r;
        const h = 2 * r;

        return DOMUtil.createElementNS(DOMUtil.ns, "path", {}, null, {
            d: `M0,0 L${w},${r} L0,${h} L${r},${r} L0,0`,
            fill: "gray",
            stroke: "white"
        });
    }

    /**
     * 创建SVG路径
     *
     * @param {Number} strokeWidth
     */
    static createPath(strokeWidth) {
        return DOMUtil.createElementNS(DOMUtil.ns, "path", {}, null, {
            fill: "none",
            stroke: "gray",
            "stroke-width": strokeWidth || 2,
            "pointer-events": "auto"
        });
    }

    /**
     * 更新路径
     *
     * @param {HTMLSVGElement} path
     * @param {Array}          pointArr
     * @param {String}         lineType
     * @param {String}         lineDashType
     */
    static updatePath(path, pointArr, lineType, lineDashType) {
        if (!pointArr.length) return;

        let p1 = pointArr[0];
        let d = `M${p1[0]},${p1[1]}`;

        for (let i = 1; i < pointArr.length; i++) {
            let p = pointArr[i];

            d += " ";
            if (i === 1) d += Util.getPathCMD(lineType);
            d += `${p[0]},${p[1]}`;
        }

        let strokeDasharray = Util.getDashStyle(lineDashType, plumb.config.strokeWidth).toString();

        DOMUtil.setAttributes(path, {
            d: d,
            "stroke-dasharray": strokeDasharray
        });
    }

    /**
     * 添加endPoint
     *
     * @param {EndPoint} endPoint
     */
    static assembleEndPoint(endPoint) {
        //if (!endPoint.element) {
        let rect = endPoint.getRect();
        let div = Render.createDiv(endPoint.uuid, "endpoint", {
            left: `${rect.x}px`,
            top: `${rect.y}px`,
            width: `${rect.w}px`,
            height: `${rect.h}px`
        });
        let svg = Render.createSVG(rect.w, rect.h, {
            left: "0px",
            top: "0px",
            opacity: 0.8
        });
        let circle = Render.createCircle(rect.w / 2, rect.w / 2, rect.w / 2);

        DOMUtil.appendToNode(circle, svg);
        DOMUtil.appendToNode(svg, div);
        return div;
        //}
    }

    /**
     *  添加移动锚点
     *
     * @param {Anchor} anchor
     */
    static assembleAnchor(anchor) {
        //if (!anchor.element) {
        let rect = anchor.getRect();
        let div = Render.createDiv(anchor.uuid, "anchor", {
            left: `${rect.x}px`,
            top: `${rect.y}px`,
            width: `${rect.w}px`,
            height: `${rect.h}px`
        });
        let svg = Render.createSVG(rect.w, rect.h, {
            left: "0px",
            top: "0px",
            opacity: 0.8
        });
        let shape = Render.createCircle(rect.w / 2, rect.h / 2, rect.w / 2);
        // switch (anchor.shape) {
        //     case "ARROW":
        //         shape = Render.createArrow(
        //             rect[2] / 2.0,
        //             rect[2] / 2.0,
        //             rect[2] / 2.0
        //         );
        //         break;
        //     case "CIRCLE":
        //         shape = Render.createCircle(
        //             rect[2] / 2.0,
        //             rect[2] / 2.0,
        //             rect[2] / 2.0
        //         );
        //         break;

        //     default:
        //         shape = Render.createCircle(
        //             rect[2] / 2.0,
        //             rect[2] / 2.0,
        //             rect[2] / 2.0
        //         );
        //         break;
        // }

        DOMUtil.appendToNode(shape, svg);
        DOMUtil.appendToNode(svg, div);
        return div;
        //}
    }

    /**
     *  删除移动锚点
     *
     * @param {Anchor} anchor
     */
    static deleteAnchor(anchor) {
        let parentWrapper = DOMUtil.find("class", "jtk-demo-canvas");
        DOMUtil.delete(anchor.element, parentWrapper);
        // parentWrapper.removeChild(anchor.element);
    }

    /**
     * 创建连接线svg
     *
     * @param {Number} width
     * @param {Number} height
     * @param {Object} bound
     * @param {Number} size
     * @param {Number} strokeWidth
     */
    static assembleConnector(width, height, bound, size, strokeWidth) {
        //if (!connector.element) {
        const left = bound.minX + size / 2 + "px";
        const top = bound.minY + size / 2 + "px";

        const wrapper = DOMUtil.createElement("div", {
            position: "absolute",
            left: left,
            top: top,
            width: width + "px",
            height: height + "px",
            "pointer-events": "none",
            overflow: "visible"
        });
        const svg = Render.createSVG("100%", "100%", {
            left: 0,
            top: 0,
            "pointer-events": "none",
            overflow: "visible",
            "z-index": 10
        });
        // const svg = Render.createSVG(width, height, {
        //     left: `${bound.minX + size / 2}px`,
        //     top: `${bound.minY + size / 2}px`,
        //     "pointer-events": "none",
        //     overflow: "visible",
        //     "z-index": 10
        // });
        const path = Render.createPath(strokeWidth);
        const textWrapper = DOMUtil.createElement(
            "div",
            {
                display: "none"
            },
            "text-linker"
        );

        //svg.appendChild(path);
        DOMUtil.appendToNode(path, svg);
        DOMUtil.appendToNode(svg, wrapper);
        DOMUtil.appendToNode(textWrapper, wrapper);

        return wrapper;
        //return svg;
        //}
    }

    /**
     * 更新连接线
     *
     * @param {Object} connector
     * @param {Number} width
     * @param {Number} height
     * @param {Object} bound
     * @param {Number} size
     * @param {Array}  data
     * @param {String} lineType
     * @param {String} lineDashType
     */
    static updateConnector(connector, width, height, bound, size, data, lineType, lineDashType) {
        let x = bound.minX + size / 2;
        let y = bound.minY + size / 2;

        DOMUtil.sizeElement(connector.element, x, y, width, height);

        let path = DOMUtil.find("tag", "path", connector.element);
        Render.updatePath(path, data, lineType, lineDashType);
    }

    /**
     * 删除链接线
     *
     * @param {Object} connector
     */
    static deleteConnector(connector) {
        if (connector.element) {
            let parentWrapper = DOMUtil.find("class", "jtk-demo-canvas");
            DOMUtil.delete(connector.element, parentWrapper);
            //parentWrapper.removeChild(connector.element);
        }
    }

    /**
     * 创建marker
     *
     * @param {Array}  rect
     * @param {String} markerType
     * @param {String} markerId
     */
    static assembleMarker(rect, markerType, markerId) {
        const size = rect.w;
        const r = size / 2;
        const x = r;
        const y = r;
        const w = size;
        const h = size;

        const defs = DOMUtil.createElementNS(DOMUtil.ns, "defs");
        const marker = DOMUtil.createElementNS(DOMUtil.ns, "marker", {}, null, {
            id: markerId,
            markerUnits: "userSpaceOnUse",
            markerWidth: w,
            markerHeight: h,
            viewBox: `0 0 ${w} ${h}`,
            refX: w,
            refY: r,
            orient: "auto"
        });

        let shape;
        switch (markerType) {
            case "ARROW":
                shape = Render.createArrow(x, y, r);
                break;
            case "star":
                break;

            default:
                shape = Render.createArrow(x, y, r);
                break;
        }

        DOMUtil.appendToNode(shape, marker);
        DOMUtil.appendToNode(marker, defs);

        return defs;
    }
}

export default Render;
