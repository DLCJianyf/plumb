import Util from "./Util";
import Render from "./Render";
import Observable from "./Observable";

/**
 * 锚点
 */
class EndPoint extends Observable {
    constructor(opt, x, y) {
        super();

        this.type = "END_POINT";

        this.uuid = opt.uuid;
        this.anchor = opt.anchor;
        this.originX = this.originY = 0;
        this.rect = [x, y, opt.size, opt.size];
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
        this.rect[0] += $X;
        this.rect[1] += $Y;

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
                this.rect.slice(),
                this.uuid,
                this.originX,
                this.originY
            );
            Render.appendAnchor(plumb.floatingEndPoint);
            plumb.draggable(plumb.floatingEndPoint);
        }
    }
}

export default EndPoint;
