import Util from "../Util/Util";
import EventHandler from "../event/EventHandler";
import Render from "../Render";
import DOMUtil from "../Util/DOMUtil";
import Observable from "../event/Observable";

/**
 * 锚点
 */
class EndPoint extends Observable {
    constructor(opt, x, y, lineType, lineDashType, lineColor, textColor) {
        super();

        this.type = "END_POINT";

        this.uuid = opt.uuid;
        this.anchor = opt.anchor;
        this.originX = this.originY = 0;
        this.rect = { x: x, y: y, w: opt.size, h: opt.size };
        //this.rect = [x, y, opt.size, opt.size];
        this.lineType = lineType;
        this.lineDashType = lineDashType;
        this.lineColor = lineColor;
        this.textColor = textColor;
        this.isMouseDown = false;

        this.on("moved", this.moved, this);
    }

    /**
     * 获取位置，大小信息
     */
    getRect() {
        return this.rect;
    }

    /**
     * 更新位置信息
     *
     * @param {Number} $X
     * @param {Number} $Y
     */
    updatePosition($X, $Y) {
        this.rect.x += $X;
        this.rect.y += $Y;

        plumb.updateConnector(this.uuid);
    }

    /**
     * 自身移动
     *
     * @param {Object} args
     */
    moved(args) {
        if (!plumb.floatingEndPoint) {
            plumb.floatingEndPoint = plumb.createFloatingEndPoint(
                Object.assign({}, this.rect),
                this.uuid,
                this.originX,
                this.originY
            );
            plumb.floatingEndPoint.element = Render.assembleAnchor(
                plumb.floatingEndPoint
            );
            DOMUtil.appendToNode(
                plumb.floatingEndPoint.element,
                document.querySelector(".jtk-demo-canvas")
            );
            plumb.draggable(plumb.floatingEndPoint, "ENDPOINT");

            //更改拖拽目标
            EventHandler.setDragEl(plumb.floatingEndPoint);
        }
    }

    /**
     * 鼠标hover时间
     *
     * @param {Object} evt
     */
    onmouseover(evt) {
        const path = DOMUtil.find("tag", "circle", this.element);
        DOMUtil.setAttributes(path, { fill: "orange" });
    }

    /**
     * 鼠标移出
     *
     * @param {Object} evt
     */
    onmouseout(evt) {
        const path = DOMUtil.find("tag", "circle", this.element);
        DOMUtil.setAttributes(path, { fill: "gray" });
    }
}

export default EndPoint;
