import Textarea from "./Textarea";

import Util from "./Util";
import DOMUtil from "./DOMUtil";
import Link from "./Link";
import Render from "./Render";
import Observable from "./Observable";

/**
 * 连接线，SVG
 */
class Connector extends Observable {
    constructor(sourceEndPoint, targetEndPoint) {
        super();

        this.sourceEndPoint = sourceEndPoint;
        this.targetEndPoint = targetEndPoint;

        this.lineType = sourceEndPoint.lineType;
        this.lineDashType = sourceEndPoint.lineDashType;
        this.lineColor = sourceEndPoint.lineColor;
        this.textColor = sourceEndPoint.textColor;

        this.uuid = `${sourceEndPoint.uuid}^-^${targetEndPoint.uuid}`;
        this.markerId = `marker-achor-${plumb.flag++}`;

        this.showText = false;

        this.on("update", this.update.bind(this));
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
     * 连接线更新
     *
     * @param {Object} params
     */
    update(params) {
        const { width, height, bound, size } = params || this.getSizeAndBound();
        this.data = Link.calcPathPointArr(
            width,
            height,
            bound,
            size,
            this.getSource(),
            this.getTarget(),
            this.lineType
        );
        Render.updateConnector(
            this,
            width,
            height,
            bound,
            size,
            this.data,
            this.lineType,
            this.lineDashType,
            this.lineColor
        );

        if (params && params.isCreate) {
            //事件绑定
            const path = DOMUtil.find("tag", "path", this.element);
            this.bind(path, "click", this.onclick.bind(this)());
            this.bind(path, "mouseover", this.onmouseover.bind(this));
            this.bind(path, "mouseout", this.onmouseout.bind(this));
        }

        if (this.lineType === "FLOW" && this.showText) {
            const textLinker = DOMUtil.find("class", "text-linker", this.element);
            this.updateText(textLinker, this.data);
        }
    }

    /**
     * 更新连接线文本
     *
     * @param {HTMLElement} el
     * @param {Array}       data
     */
    updateText(el, data) {
        const rect = Util.getElementRectInfo(el);
        const midPoint = Link.getLinkerMidpoint(data.slice(), this.lineType);
        DOMUtil.setStyle(el, {
            left: midPoint.x - rect.w / 2 + "px",
            top: midPoint.y - rect.h / 2 + "px",
            transform: "translate(0, 0)"
        });
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
            //上一次是双击
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
     * 单击，删除连接线
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
     * 双击，添加，编辑文本
     */
    onDoubleClick() {
        const me = this;
        //const p = Promise.resolve();
        const { width, height, bound, size } = this.getSizeAndBound();
        const textLinker = DOMUtil.find("class", "text-linker", me.element);
        if (!me.textarea) {
            const textarea = new Textarea(textLinker.innerHTML);
            textarea.on(
                "text-blur",
                function() {
                    const value = textarea.element.value
                        .replace(/</g, "&lt;")
                        .replace(/>/g, "&gt;")
                        .replace(/\n/g, "<br/>")
                        .trim();
                    textLinker.innerHTML = value;
                    me.showText = value === "" ? false : true;
                    if (me.lineType === "FLOW") {
                        if (me.showText) {
                            //延迟，等待DOM更新完毕
                            setTimeout(function() {
                                DOMUtil.setStyle(textLinker, {
                                    display: me.showText ? "block" : "none"
                                });
                                me.updateText(textLinker, me.data);
                            });
                        }
                    } else {
                        DOMUtil.setStyle(textLinker, {
                            display: me.showText ? "block" : "none"
                        });
                    }
                    DOMUtil.setStyle(textLinker, { color: me.textColor });

                    //移除DOM，解除事件绑定
                    textarea.off("text-blur");
                    textarea.unbind(textarea.element, "blur");
                    DOMUtil.delete(textarea.element, me.element);
                    // delete me.textarea;
                },
                textarea
            );
            DOMUtil.appendToNode(textarea.element, me.element);
            DOMUtil.setStyle(textLinker, { display: "none" });
            //有文本内容时，autofocus自动聚焦失效
            textarea.element.focus();

            if (this.lineType === "FLOW") {
                this.updateText(textarea.element, this.data);
            }
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
            stroke: this.lineColor,
            "stroke-width": plumb.config.strokeWidth
        });
        DOMUtil.setAttributes(paths[1], { fill: this.lineColor });

        this.uuid.split("^-^").forEach(function(id) {
            const p = Util.findItemByUUID(plumb.endPoints, id);
            const circle = DOMUtil.find("tag", "circle", p.element);
            DOMUtil.setAttributes(circle, { fill: "gray" });
        });
    }
}

export default Connector;
