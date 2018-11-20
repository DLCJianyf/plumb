import Util from "./Util";

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
            fill: "black",
            stroke: "black"
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

    /**
     * 更新贝塞尔曲线
     *
     * @param {HTMLSVGElement} path
     * @param {Object} bezierArr
     */
    static updateBezier(path, bezierArr) {
        let { p1, p2, p3, p4 } = bezierArr;
        // Util.setAttribute(path, {
        //     d: `M${p1[0]},${p1[1]} C${p2[0]},${p2[1]} ${p3[0]},${p3[1]} ${
        //         p4[0]
        //     },${p4[1]}`
        // });
        Util.setAttribute(path, {
            d: `M${p1[0]},${p1[1]} Q${p2[0]},${p2[1]} ${p3[0]},${p3[1]} T${
                p4[0]
            },${p4[1]}`,
            "stroke-dasharray": Util.getDashStyle(
                plumb.config.lineDashType,
                plumb.config.strokeWidth
            ).toString()
        });
    }

    /**
     * 更新SVG
     *
     * @param {HTMLSVGElement} svg
     * @param {Number} width
     * @param {Number} height
     * @param {Number} x
     * @param {Number} y
     */
    static updateSVG(svg, width, height, x, y) {
        Util.setAttribute(svg, {
            width: width,
            height: height
        });

        Util.setStyle(svg, {
            left: `${x}px`,
            top: `${y}px`
        });
    }

    /**
     * 添加endPoint
     *
     * @param {EndPoint} endPoint
     */
    static appendEndPoint(endPoint) {
        if (!endPoint.element) {
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
            svg.appendChild(circle);
            div.appendChild(svg);

            endPoint.element = div;
        }
        let parentWrapper = document.querySelector(".jtk-demo-canvas");
        parentWrapper.appendChild(endPoint.element);
    }

    /**
     *  添加移动锚点
     *
     * @param {Anchor} anchor
     */
    static appendAnchor(anchor) {
        if (!anchor.element) {
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

            svg.appendChild(shape);
            div.appendChild(svg);
            anchor.element = div;
        }
        let parentWrapper = document.querySelector(".jtk-demo-canvas");
        parentWrapper.appendChild(anchor.element);
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

    static appendConnector(connector) {
        if (!connector.element) {
            let bound = connector.getBound();
            let size = connector.getPointSize();
            let width = Util.distance(bound.minX, bound.maxX);
            let height = Util.distance(bound.minY, bound.maxY);

            let svg = Render.createSVG(width, height, {
                left: `${bound.minX + size / 2.0}px`,
                top: `${bound.minY + size / 2.0}px`,
                overflow: "visible"
            });
            let path = Render.createPath();
            svg.appendChild(path);
            connector.element = svg;

            let parentWrapper = document.querySelector(".jtk-demo-canvas");
            parentWrapper.appendChild(connector.element);

            let bezierArr = connector.calcBezier(width, height, bound, size);
            //let path = connector.element.getElementsByTagName("path")[0];
            Render.updateBezier(path, bezierArr);
        }
    }

    static updateConnector(connector, width, height, bound, size) {
        let x = bound.minX + size / 2.0;
        let y = bound.minY + size / 2.0;
        let bezierArr = connector.calcBezier(width, height, bound, size);

        Render.updateSVG(connector.element, width, height, x, y);

        let path = connector.element.getElementsByTagName("path")[0];
        Render.updateBezier(path, bezierArr);
    }

    static deleteConnector(connector) {
        if (connector.element) {
            let parentWrapper = document.querySelector(".jtk-demo-canvas");
            parentWrapper.removeChild(connector.element);
        }
    }

    static addMarker(parentWrapper, rect, markerType) {
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

        let path = parentWrapper.getElementsByTagName("path")[0];
        Util.setAttribute(path, {
            "marker-end": "url(#marker-achor)"
        });
        parentWrapper.appendChild(shape);
    }
}

export default Render;
