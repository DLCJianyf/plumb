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
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
    }

    /**
     * 创建div
     *
     * @param {String} id
     * @param {String} className
     * @param {Object} style
     */
    static createDiv(id, className, style) {
        let div = document.createElement("div");
        Util.setAttribute(div, {
            id: id,
            class: className
        });

        style = Object.assign({}, style, { position: "absolute", zIndex: 1 });
        Util.setStyle(div, style);

        return div;
    }

    /**
     * 创建SVG
     *
     * @param {Number} width
     * @param {Number} height
     * @param {Object} style
     */
    static createSVG(width, height, style) {
        let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        Util.setAttribute(svg, {
            version: "1.1",
            position: "absolute",
            width: width,
            height: height
        });

        style = Object.assign({}, style, { position: "absolute" });
        Util.setStyle(svg, style);

        return svg;
    }

    /**
     * 创建SVG圆
     *
     * @param {Number} x
     * @param {Number} y
     * @param {Number} r
     */
    static createCircle(x, y, r) {
        let circle = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle"
        );
        Util.setAttribute(circle, {
            cx: x,
            cy: y,
            r: r,
            version: "1.1",
            fill: "gray",
            stroke: "none"
        });

        return circle;
    }

    static createArrow(x, y, r) {
        let w = 2 * r;
        let h = 2 * r;
        let defs = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "defs"
        );
        let marker = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "marker"
        );
        Util.setAttribute(marker, {
            id: "marker-achor",
            markerUnits: "userSpaceOnUse",
            markerWidth: w,
            markerHeight: h,
            viewBox: `0 0 ${w} ${h}`,
            refX: w,
            refY: r,
            orient: "auto"
        });

        let path = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path"
        );
        Util.setAttribute(path, {
            d: `M0,0 L${w},${r} L0,${h} L${r},${r} L0,0`,
            fill: "gray",
            stroke: "white"
        });

        marker.appendChild(path);
        defs.appendChild(marker);

        return defs;
    }

    /**
     * 创建SVG路径
     */
    static createPath() {
        let path = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path"
        );
        Util.setAttribute(path, {
            fill: "none",
            stroke: "gray",
            "stroke-width": 2
        });

        return path;
    }

    static updatePath(path, pointArr) {
        if (!pointArr.length) return;

        let p1 = pointArr[0];
        let d = `M${p1[0]},${p1[1]}`;

        for (let i = 1; i < pointArr.length; i++) {
            let p = pointArr[i];

            d += " ";
            if (i === 1) d += Util.getPathCMD(plumb.config.lineType);
            d += `${p[0]},${p[1]}`;
        }

        let strokeDasharray = Util.getDashStyle(
            plumb.config.lineDashType,
            plumb.config.strokeWidth
        ).toString();

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
            left: `${rect[0]}px`,
            top: `${rect[1]}px`,
            width: `${rect[2]}px`,
            height: `${rect[3]}px`
        });
        let svg = Render.createSVG(rect[2], rect[3], {
            left: "0px",
            top: "0px",
            opacity: 0.8
        });
        let circle = Render.createCircle(
            rect[2] / 2.0,
            rect[2] / 2.0,
            rect[2] / 2.0
        );

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
            left: `${rect[0]}px`,
            top: `${rect[1]}px`,
            width: `${rect[2]}px`,
            height: `${rect[3]}px`
        });
        let svg = Render.createSVG(rect[2], rect[3], {
            left: "0px",
            top: "0px",
            opacity: 0.8
        });
        let shape = Render.createCircle(
            rect[2] / 2.0,
            rect[2] / 2.0,
            rect[2] / 2.0
        );
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
        let parentWrapper = document.querySelector(".jtk-demo-canvas");
        parentWrapper.removeChild(anchor.element);
    }

    static assembleConnector(width, height, bound, size) {
        //if (!connector.element) {

        let svg = Render.createSVG(width, height, {
            left: `${bound.minX + size / 2.0}px`,
            top: `${bound.minY + size / 2.0}px`,
            overflow: "visible",
            "z-index": 10
        });
        let path = Render.createPath();
        svg.appendChild(path);
        return svg;
        //}
    }

    static updateConnector(connector, width, height, bound, size) {
        let x = bound.minX + size / 2.0;
        let y = bound.minY + size / 2.0;

        //Render.updateSVG(connector.element, width, height, x, y);
        DOMUtil.sizeElement(connector.element, x, y, width, height);

        let pointArr = connector.calcPathPointArr(width, height, bound, size);
        let path = connector.element.getElementsByTagName("path")[0];
        Render.updatePath(path, pointArr);
    }

    static deleteConnector(connector) {
        if (connector.element) {
            let parentWrapper = document.querySelector(".jtk-demo-canvas");
            parentWrapper.removeChild(connector.element);
        }
    }

    static assembleMarker(rect, markerType) {
        let shape;
        switch (markerType) {
            case "ARROW":
                shape = Render.createArrow(
                    rect[2] / 2.0,
                    rect[2] / 2.0,
                    rect[2] / 2.0
                );
                break;
            case "star":
                break;

            default:
                shape = Render.createArrow(
                    rect[2] / 2.0,
                    rect[2] / 2.0,
                    rect[2] / 2.0
                );
                break;
        }
        return shape;
    }
}

export default Render;
