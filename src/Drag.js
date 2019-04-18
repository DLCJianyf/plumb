import Render from "./Render";

const Drag = {
    curTargetID: null,

    /**
     * 鼠标按下
     *
     * @param {Event} evt
     */
    dragStart(evt, target) {
        let id = target.element.id;
        let isTarget = evt.target.id === id;
        if (!isTarget && evt.target.localName === "circle") {
            let parent = evt.target.parentNode.parentNode;
            isTarget = parent.id === id;
        }

        if (isTarget) {
            target.originX = evt.pageX;
            target.originY = evt.pageY;

            target.isMouseDown = true;

            Drag.curTargetID = id;
        }
    },

    /**
     * 鼠标移动
     *
     * @param {Event} evt
     */
    dragging(evt, target) {
        if (!target.isMouseDown || Drag.curTargetID !== target.element.id) return;

        let $X = evt.pageX - target.originX;
        let $Y = evt.pageY - target.originY;

        if (target.type !== "END_POINT") {
            target.rect[0] += $X;
            target.rect[1] += $Y;

            target.originX = evt.pageX;
            target.originY = evt.pageY;

            Render.updatePosition(target.element, target.rect[0], target.rect[1]);
        }

        target.trigger("moved", { $X, $Y });
    },

    /**
     * 鼠标升起
     *
     * @param {Event} evt
     */
    dragEnd(evt, target) {
        target.isMouseDown = false;
        target.trigger("moveend", target.type);

        Drag.curTarget = null;
    }
};

export default Drag;
