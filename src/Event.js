const Dispatch = {
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
        const newEvt = this.getSimulateEvent(evt, 0, 0);
        els.forEach(function(el) {
            const newEvt = me.getSimulateEvent(evt, 0, 0);
            el.dispatchEvent(newEvt);
        });
        /*let offsetLeft = -parseInt(map.div.offsetLeft),
            offsetTop = -parseInt(map.div.offsetTop),*/
        // let offsetX = type === "click" ? 0 : parseInt(map.layerContainerDiv.style.left),
        //     offsetY = type === "click" ? 0 : parseInt(map.layerContainerDiv.style.top);
        // for (let i = layers.length - 1; i >= 0; i--) {
        //     let layerObj = layers[i];
        //     //let isThemeLayer = layerObj.layerInf.layerType !== "VECTOR";
        //     //let newEvt = this.getSimulateEvent(evt, isThemeLayer ? offsetX : offsetLeft, isThemeLayer ? offsetY : offsetTop);
        //     if (layerObj.layer.visibility) {
        //         let newEvt = this.getSimulateEvent(evt, offsetX, offsetY);
        //         //为layer div绑定鼠标位置信息
        //         layerObj.layer.data = {
        //             layerX: evt.layerX,
        //             layerY: evt.layerY
        //         };
        //         //事件分发到各个图层上去，假如有一个图层选中了一个要素，则此要素就是this.selectedFeature
        //         layerObj.layer.div.dispatchEvent(newEvt);
        //     }
        // }
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

export default Dispatch;
