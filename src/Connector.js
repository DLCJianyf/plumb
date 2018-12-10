import Util from "./Util";

/**
 * 连接线，SVG
 */
class Connector {
    constructor(sourceEndPoint, targetEndPoint) {
        this.sourceEndPoint = sourceEndPoint;
        this.targetEndPoint = targetEndPoint;
        this.uuid = `${sourceEndPoint.uuid}^-^${targetEndPoint.uuid}`;
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

        let rect = this.getSource().getRect();

        if (rect[0] === bound.minX) {
            p1.push(minX);
            p2.push(minX + width / 10);
            p3.push(minX + (width * 9) / 10);
            //p2.push(minX);
            // p3.push(maxX);
            p4.push(maxX);
        } else {
            p1.push(maxX);
            p2.push(minX + (width * 9) / 10);
            p3.push(minX + width / 10);
            //p2.push(maxX);
            // p3.push(minX);
            p4.push(minX);
        }
        //p3.push(maxX / 2);

        if (rect[1] === bound.minY) {
            p1.push(minY);
            p2.push(maxY);
            p3.push(minY);
            p4.push(maxY);
        } else {
            p1.push(maxY);
            p2.push(minY);
            p3.push(maxY);
            p4.push(minY);
        }
        p3.push(maxY / 2);

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

        let rect = this.getSource().getRect();

        if (rect[0] === bound.minX) {
            p1.push(minX);
            p2.push(minX);
            p3.push(maxX);
        } else {
            p1.push(maxX);
            p2.push(maxX);
            p3.push(minX);
        }

        if (rect[1] === bound.minY) {
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
