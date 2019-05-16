import Render from "../Render";
import Util from "../Util/Util";
import DOMUtil from "../Util/DOMUtil";

const EventHandler = {
    //鼠标是否按下
    isDown: false,
    //当前拖拽目标
    dragEl: null,

    /**
     * 设置拖拽元素
     * @param {Object} el
     */
    setDragEl(el) {
        this.dragEl = el;
    },

    /**
     * 鼠标按下
     *
     * @param {Event} evt
     */
    mouseDown(evt, target) {
        EventHandler.isDown = true;
        if (EventHandler.dragEl) {
            EventHandler.dragEl.originX = evt.clientX;
            EventHandler.dragEl.originY = evt.clientY;
        }
    },

    /**
     * 鼠标移动
     *
     * @param {Event} evt
     */
    mouseMove(evt) {
        if (EventHandler.isDown) {
            if (EventHandler.dragEl) {
                const target = EventHandler.dragEl;
                const $X = evt.clientX - target.originX;
                const $Y = evt.clientY - target.originY;

                if (target.type !== "END_POINT") {
                    target.rect.x += $X;
                    target.rect.y += $Y;

                    target.originX = evt.clientX;
                    target.originY = evt.clientY;

                    Render.updatePosition(target.element, target.rect.x, target.rect.y);
                }

                target.trigger("moved", { $X, $Y });
            }
        } else {
            let isFind = false;
            //优先从节点中找
            plumb.draggableEls.SOURCE.forEach(function(el) {
                if (!isFind) {
                    isFind = Util.isInRect(
                        { x: evt.clientX, y: evt.clientY },
                        el.getRect()
                    );
                    isFind && EventHandler.setDragEl(el);
                }
            });

            if (!isFind) {
                plumb.draggableEls.ENDPOINT.forEach(function(el) {
                    if (!isFind) {
                        isFind = Util.isInCircle(
                            { x: evt.clientX, y: evt.clientY },
                            el.getRect()
                        );
                        isFind && EventHandler.setDragEl(el);
                    }
                });
            }

            !isFind && EventHandler.setDragEl(null);

            //手势
            // DOMUtil.cursor(isFind);
        }
    },

    /**
     * 鼠标升起
     *
     * @param {Event} evt
     */
    mouseUp(evt) {
        EventHandler.isDown = false;
        EventHandler.dragEl &&
            EventHandler.dragEl.trigger("moveend", EventHandler.dragEl.type);
    },

    /**
     * 鼠标滚轮事件
     *
     * @param {Event} evt
     */
    mouseWheel(evt) {
        console.log(evt);
    }
};

export default EventHandler;
