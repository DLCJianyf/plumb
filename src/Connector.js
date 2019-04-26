import Textarea from "./Textarea";

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
        return this.getSource().getRect().w || 0;
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
        const me = this;
        let locked = false;
        let firstTab = false;
        let exeDbTap = false;

        return function() {
            //之前的是双击
            if (exeDbTap) {
                locked = false;
                firstTab = false;
                exeDbTap = false;
            }

            if (!firstTab) {
                firstTab = true;
                setTimeout(() => {
                    if (!locked) {
                        me.onSingleClick();
                        firstTab = false;
                    }
                }, 300);
            } else {
                locked = true;
                me.onDoubleClick();
                exeDbTap = true;
            }
        };
    }

    /**
     * 单击
     */
    onSingleClick() {
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
     * 双击
     */
    onDoubleClick() {
        const me = this;
        if (!me.textarea) {
            me.textarea = new Textarea();
            me.textarea.onblur = function() {
                const textLinker = DOMUtil.find("class", "text-linker", me.element);
                textLinker.innerHTML = me.textarea.element.innerHTML;
                DOMUtil.delete(me.textarea, me.element);
                delete me.textarea;
            };
            DOMUtil.appendToNode(me.textarea.element, me.element);
        }
    }

    /**
     * 鼠标hover时间
     *
     * @param {Object} evt
     */
    onmouseover(evt) {
        const paths = DOMUtil.find("tag", "path", this.element, true);
        DOMUtil.setAttributes(paths[0], {
            stroke: "orange",
            "stroke-width": plumb.config.strokeWidth + 2
        });
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
        DOMUtil.setAttributes(paths[0], {
            stroke: "gray",
            "stroke-width": plumb.config.strokeWidth
        });
        DOMUtil.setAttributes(paths[1], { fill: "gray" });

        this.uuid.split("^-^").forEach(function(id) {
            const p = Util.findItemByUUID(plumb.endPoints, id);
            const circle = DOMUtil.find("tag", "circle", p.element);
            DOMUtil.setAttributes(circle, { fill: "gray" });
        });
    }
}

export default Connector;
