import Util from "./Util";
import Render from "./Render";
import Observable from "./Observable";

/**
 * 可拖动窗体
 */
class Source extends Observable {
    constructor(element) {
        super();

        this.type === "SOURCE";

        this.endPoints = [];
        this.element = element;

        this.prev = null;
        this.next = null;

        this.originX = this.originY = 0;
        this.isMouseDown = false;
        this.rect = Util.getElementRectInfo(element);

        this.on("moved", this.moved, this);
    }

    /**
     * 获取位置，大小信息
     */
    getRect() {
        return this.rect;
    }

    /**
     * 获取窗体dom元素
     */
    getElement() {
        return this.element;
    }

    /**
     * 添加锚点
     *
     * @param {EndPoint} endPoint
     */
    addEndPoint(endPoint) {
        this.endPoints.push(endPoint);
    }

    /**
     * 自身移动
     *
     * @param {Object} args
     */
    moved(args) {
        this.endPoints.forEach(item => {
            item.updatePosition(args.$X, args.$Y);
            Render.updatePosition(item.element, item.rect[0], item.rect[1]);
        });
    }
}

export default Source;
