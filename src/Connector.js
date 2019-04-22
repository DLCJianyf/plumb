import Util from "./Util";
import DOMUtil from "./DOMUtil";

/**
 * 连接线，SVG
 */
class Connector {
    constructor(sourceEndPoint, targetEndPoint) {
        this.sourceEndPoint = sourceEndPoint;
        this.targetEndPoint = targetEndPoint;
        this.uuid = `${sourceEndPoint.uuid}^-^${targetEndPoint.uuid}`;
        this.markerId = `marker-achor-${plumb.flag++}`;
    }

    /**
     * 获取起始点
     */
    getSource() {
        return this.sourceEndPoint;
    }

    /**
     * 获取终止点
     */
    getTarget() {
        return this.targetEndPoint;
    }

    /**
     * 获取外接矩形
     */
    getBound() {
        let rect1 = this.getSource().getRect();
        let rect2 = this.getTarget().getRect();

        return Util.getBoundByRect(rect1, rect2);
    }

    /**
     * 获取锚点大小
     */
    getPointSize() {
        return this.getSource().getRect()[2] || 0;
    }

    /**
     * 获取连接线大小及外界矩形
     */
    getSizeAndBound() {
        let bound = this.getBound();
        let size = this.getPointSize();
        let width = Util.distance(bound.minX, bound.maxX);
        let height = Util.distance(bound.minY, bound.maxY);

        return {
            size,
            width,
            height,
            bound
        };
    }

    /**
     * 点击
     *
     * @param {Object} evt
     */
    onclick(evt) {
        if (window.confirm("是否删除连接线?")) {
            let uuid = this.uuid;
            delete plumb.connectors[uuid];
            DOMUtil.delete(this.element);

            this.uuid.split("^-^").forEach(function(id) {
                const p = Util.findItemByUUID(plumb.endPoints, id);
                const circle = DOMUtil.find("tag", "circle", p.element);
                DOMUtil.setAttributes(circle, { fill: "gray" });
            });
        }
    }

    /**
     * 鼠标hover时间
     *
     * @param {Object} evt
     */
    onmouseover(evt) {
        const paths = DOMUtil.find("tag", "path", this.element, true);
        DOMUtil.setAttributes(paths[0], { stroke: "orange", "stroke-width": 4 });
        DOMUtil.setAttributes(paths[1], { fill: "orange" });

        this.uuid.split("^-^").forEach(function(id) {
            const p = Util.findItemByUUID(plumb.endPoints, id);
            const circle = DOMUtil.find("tag", "circle", p.element);
            DOMUtil.setAttributes(circle, { fill: "orange" });
        });
    }

    /**
     * 鼠标移出
     *
     * @param {Object} evt
     */
    onmouseout(evt) {
        const paths = DOMUtil.find("tag", "path", this.element, true);
        DOMUtil.setAttributes(paths[0], { stroke: "gray", "stroke-width": 2 });
        DOMUtil.setAttributes(paths[1], { fill: "gray" });

        this.uuid.split("^-^").forEach(function(id) {
            const p = Util.findItemByUUID(plumb.endPoints, id);
            const circle = DOMUtil.find("tag", "circle", p.element);
            DOMUtil.setAttributes(circle, { fill: "gray" });
        });
    }

    /**
     * 计算SVG Path属性点
     *
     * @param {Number} width
     * @param {Number} height
     * @param {Number} bound
     * @param {Number} size
     */
    calcPathPointArr(width, height, bound, size) {
        switch (plumb.config.lineType) {
            case "BEZIER":
                return this.calcBezier(width, height, bound, size);
            case "STRAIGHT":
                return this.calcStraight(width, height, bound, size);
            case "FLOW":
                return this.calcFlow(width, height, bound, size);
            default:
                return this.calcBezier(width, height, bound, size);
        }
    }

    /**
     * 计算贝塞尔曲线参数
     *
     * @param {Number} width
     * @param {Number} height
     * @param {Number} bound
     * @param {Number} size
     */
    calcBezier(width, height, bound, size) {
        let p1 = [];
        let p2 = [];
        let p3 = [];
        let p4 = [];

        let maxX = bound.maxX - bound.minX;
        let maxY = bound.maxY - bound.minY;
        let minX = 0;
        let minY = 0;

        let thresoldX = 200;
        let thresoldY = 0;
        let sourceP = this.getSource();
        let rect1 = sourceP.getRect();
        let rect2 = this.getTarget().getRect();

        if (sourceP.anchor === "right" || sourceP.anchor === "bottom") {
            if (rect1[0] < rect2[0]) {
                p1.push(minX);
                p2.push(minX + thresoldX);
                p3.push(maxX - thresoldX);
                p4.push(maxX);
            } else {
                p1.push(maxX);
                p2.push(maxX + thresoldX);
                p3.push(minX - thresoldX);
                p4.push(minX);
            }
        } else {
            if (rect1[0] > rect2[0]) {
                p1.push(maxX);
                p2.push(maxX - thresoldX);
                p3.push(minX + thresoldX);
                p4.push(minX);
            } else {
                p1.push(minX);
                p2.push(minX - thresoldX);
                p3.push(maxX + thresoldX);
                p4.push(maxX);
            }
        }

        if (rect1[1] === bound.minY) {
            p1.push(minY);
            p2.push(minY + thresoldY);
            p3.push(maxY - thresoldY);
            p4.push(maxY);
        } else {
            p1.push(maxY);
            p2.push(maxY - thresoldY);
            p3.push(minY + thresoldY);
            p4.push(minY);
        }
        //p3.push(maxY / 2);

        return [p1, p2, p3, p4];
    }

    /**
     * 计算直线参数
     *
     * @param {Number} width
     * @param {Number} height
     * @param {Number} bound
     * @param {Number} size
     */
    calcStraight(width, height, bound, size) {
        let p1 = [];
        let p2 = [];

        let maxX = bound.maxX - bound.minX;
        let maxY = bound.maxY - bound.minY;
        let minX = 0;
        let minY = 0;

        let rect = this.getSource().getRect();

        if (rect[0] === bound.minX) {
            p1.push(minX);
            p2.push(maxX);
        } else {
            p1.push(maxX);
            p2.push(minX);
        }

        if (rect[1] === bound.minY) {
            p1.push(minY);
            p2.push(maxY);
        } else {
            p1.push(maxY);
            p2.push(minY);
        }

        return [p1, p2];
    }

    /**
     * 计算流程线参数
     *
     * @param {Number} width
     * @param {Number} height
     * @param {Number} bound
     * @param {Number} size
     */
    calcFlow(width, height, bound, size) {
        let p1 = [];
        let p2 = [];
        let p3 = [];

        let maxX = bound.maxX - bound.minX;
        let maxY = bound.maxY - bound.minY;
        let minX = 0;
        let minY = 0;

        let sourceP = this.getSource();
        let rect1 = sourceP.getRect();
        let rect2 = this.getTarget().getRect();

        switch (sourceP.anchor) {
            case "left":
                break;
            case "right":
                break;
            case "top":
                break;
            case "bottom":
                break;
            default:
                break;
        }

        if (rect1[0] === bound.minX) {
            p1.push(minX);
            p2.push(minX);
            p3.push(maxX);
        } else {
            p1.push(maxX);
            p2.push(maxX);
            p3.push(minX);
        }

        if (rect1[1] === bound.minY) {
            p1.push(minY);
            p2.push(maxY);
            p3.push(maxY);
        } else {
            p1.push(maxY);
            p2.push(minY);
            p3.push(minY);
        }

        return [p1, p2, p3];
    }
}

export default Connector;
