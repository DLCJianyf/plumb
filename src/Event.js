const Event = {
    /**
     * 分发事件
     *
     * @param {Object} parent
     * @param {Object} evt
     * @param {String} type
     */
    dispatchEvent(parent, evt, type) {
        const me = this;
        const els = Array.prototype.slice.call(parent.children);
        const length = els.length;
        const newEvt = this.getSimulateEvent(evt, 0, 0);
        els.forEach(function(el, index) {
            if (el.localName === "svg" && index !== length - 1) {
                const newEvt = me.getSimulateEvent(evt, 0, 0);
                el.firstChild && el.firstChild.dispatchEvent(newEvt);
            }
        });
    },

    /**
     * 模拟事件对象,
     *
     * @param {Object} evt
     * @param {Number} offsetX
     * @param {Number} offsetY
     */
    getSimulateEvent(evt, offsetX, offsetY) {
        let mouseEvt,
            evtType = evt.type,
            x = evt.x + offsetX,
            y = evt.y + offsetY,
            clientX = evt.clientX + offsetX,
            clientY = evt.clientY + offsetY;
        if (window.MouseEvent) {
            try {
                mouseEvt = new window.MouseEvent(evtType, {
                    bubbles: false,
                    cancelable: true,
                    view: window,
                    screenX: evt.screenX,
                    screenY: evt.screenY,
                    clientX: clientX,
                    clientY: clientY,
                    x: x,
                    y: y
                });
            } catch (error) {
                mouseEvt = document.createEvent("MouseEvents");
                mouseEvt.initMouseEvent(
                    evtType,
                    false,
                    true,
                    window,
                    0,
                    evt.screenX,
                    evt.screenY,
                    clientX,
                    clientY,
                    evt.ctrlKey,
                    evt.altKey,
                    evt.shiftKey,
                    evt.metaKey,
                    evt.button,
                    evt.relatedTarget
                );
                //mouseEvt.x = x;
                // mouseEvt.y = y;
            }
        } else {
            mouseEvt = document.createEvent("MouseEvents");
            mouseEvt.initMouseEvent(
                evtType,
                false,
                true,
                window,
                0,
                evt.screenX,
                evt.screenY,
                clientX,
                clientY,
                evt.ctrlKey,
                evt.altKey,
                evt.shiftKey,
                evt.metaKey,
                evt.button,
                evt.relatedTarget
            );
            //mouseEvt.x = x;
            //mouseEvt.y = y;
        }
        return mouseEvt;
    },

    mousedown(evt) {},

    mouseover(evt) {}
};

export default Event;
