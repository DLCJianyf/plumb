import Render from "./Render";
import Util from "./Util";
import DOMUtil from "./DOMUtil";

const Drag = {
    isDown: false,
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
    dragStart(evt, target) {
        Drag.isDown = true;
        if (Drag.dragEl) {
            Drag.dragEl.originX = evt.clientX;
            Drag.dragEl.originY = evt.clientY;
        }
    },

    /**
     * 鼠标移动
     *
     * @param {Event} evt
     */
    dragging(evt) {
        if (Drag.isDown) {
            if (Drag.dragEl) {
                let target = Drag.dragEl;
                let $X = evt.clientX - target.originX;
                let $Y = evt.clientY - target.originY;

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
                    isFind = Util.isInRect({ x: evt.clientX, y: evt.clientY }, el.getRect());
                    isFind && Drag.setDragEl(el);
                }
            });

            if (!isFind) {
                plumb.draggableEls.ENDPOINT.forEach(function(el) {
                    if (!isFind) {
                        isFind = Util.isInCircle({ x: evt.clientX, y: evt.clientY }, el.getRect());
                        isFind && Drag.setDragEl(el);
                    }
                });
            }

            !isFind && Drag.setDragEl(null);

            //手势
            DOMUtil.cursor(isFind);
        }
    },

    /**
     * 鼠标升起
     *
     * @param {Event} evt
     */
    dragEnd(evt) {
        Drag.isDown = false;
        Drag.dragEl && Drag.dragEl.trigger("moveend", Drag.dragEl.type);
    }
};

export default Drag;
