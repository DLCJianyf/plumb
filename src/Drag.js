import Render from "./Render";
import Util from "./Util";

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

        console.log(evt, 11111111);
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
                    target.rect[0] += $X;
                    target.rect[1] += $Y;

                    target.originX = evt.clientX;
                    target.originY = evt.clientY;

                    Render.updatePosition(target.element, target.rect[0], target.rect[1]);
                }

                target.trigger("moved", { $X, $Y });
            }
        } else {
            let isFind = false;
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

            // evt.path.forEach(function(p) {
            //     if (p.localName === "path") {
            //         console.log(evt);
            //     }
            // });

            //手势
            if (isFind) {
                //console.log(Drag.dragEl, 1111111);
                document.body.style.cursor = "pointer";
            } else {
                document.body.style.cursor = "default";
            }
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
