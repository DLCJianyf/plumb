/**
 * 事件订阅，发布（DOM，对象）
 */
class Observable {
    constructor() {
        this.handlers = {};
    }

    /**
     * DOM事件绑定
     */
    bind(el, type, callback, scope, capture) {
        let me = this;
        if (window.addEventListener) {
            return (function(el, type, callback, scope, capture) {
                el.addEventListener(
                    type,
                    function f(evt) {
                        callback(evt, scope);
                        me.handlers[type] = me.handlers[type] || [];
                        me.handlers[type].push(f);
                    },
                    !!capture
                );
            })(el, type, callback, scope, capture);
        } else if (window.attachEvent) {
            return (function(el, type, callback, scope) {
                el.attachEvent("on" + type, function f(evt) {
                    callback(evt, scope);
                    me.handlers[type] = me.handlers[type] || [];
                    me.handlers[type].push(f);
                });
            })(el, type, callback, scope);
        } else {
            return (function(el, type, callback, scope) {
                el[on + "type"] = callback;
            })(el, type, callback, scope);
        }
    }

    /**
     * DOM事件移除
     */
    unbind(el, type) {
        let me = this;
        if (window.addEventListener) {
            return (function(el, type) {
                if (me.handlers[type]) {
                    let i = 0,
                        len = me.handlers[type].length;
                    for (; i < len; i++) {
                        el.removeEventListener(type, me.handlers[type]);
                    }
                    delete me.handlers[type];
                }
            })(el, type);
        } else if (window.attachEvent) {
            return (function(el, type) {
                if (me.handlers[type]) {
                    let i = 0,
                        len = me.handlers[type].length;
                    for (; i < len; i++) {
                        el.removeEventListener("on" + type, me.handlers[type]);
                    }
                    delete me.handlers[type];
                }
            })(el, type);
        } else {
            return (function(el, type) {
                el[on + "type"] = null;
            })(el, type);
        }
    }

    /**
     * 对象事件绑定
     */
    on(type, fn, ctx) {
        let me = this;
        if (!(fn instanceof Function)) return;

        if (!me.handlers[type]) me.handlers[type] = [];

        me.handlers[type].push({
            fn: fn,
            ctx: ctx || null
        });
    }

    /**
     * 对象事件触发
     */
    trigger(type, args) {
        let me = this;
        if (!me.handlers[type]) return;

        args =
            Object.prototype.toString(args) === "[Object, Array]"
                ? args
                : [args];

        me.handlers[type].forEach(item => {
            item.fn.apply(item.ctx, args);
        });
    }

    /**
     * 对象事件移除
     */
    off(type, fn) {
        let me = this;
        if (!me.handlers[type] || !me.handlers[type].length) return;

        if (!fn) {
            me.handlers[type] = [];
        } else {
            let fns = [];
            for (let i = 0; i < me.handlers[type].length; i++) {
                if (me.handlers[type][i].fn !== fn) {
                    fns.push(me.handlers[type][i]);
                }
            }
            me.handlers[type] = fns;
        }
    }
}

export default Observable;
