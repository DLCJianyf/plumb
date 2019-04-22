/**
 * DOM相关操作
 */
const DOMUtil = {
    ns: "http://www.w3.org/2000/svg",

    version: "1.1",

    /**
     * 创建element
     *
     * @param {String} tag
     * @param {Object} style
     * @param {String} clazz
     * @param {Object} atts
     */
    createElement: function(tag, style, clazz, atts) {
        return this.createElementNS(null, tag, style, clazz, atts);
    },

    /**
     * 创建带命名空间的element
     *
     * @param {String} ns
     * @param {String} tag
     * @param {Object} style
     * @param {String} clazz
     * @param {Object} atts
     */
    createElementNS: function(ns, tag, style, clazz, atts) {
        let e = ns === null ? document.createElement(tag) : document.createElementNS(ns, tag);

        let i;
        style = style || {};
        for (i in style) {
            e.style[i] = style[i];
        }

        if (clazz) e.className = clazz;

        atts = atts || {};
        for (i in atts) {
            e.setAttribute(i, `${atts[i]}`);
        }

        return e;
    },

    /**
     * 获取属性
     *
     * @param {HTMLElement} el
     * @param {String}      attName
     */
    getAttribute: function(el, attName) {
        return el.getAttribute != null ? el.getAttribute(attName) : null;
    },

    /**
     * 设置属性
     *
     * @param {HTMLElement} el
     * @param {String}      a
     * @param {String}      v
     */
    setAttribute: function(el, a, v) {
        if (el.setAttribute != null) {
            el.setAttribute(a, v);
        }
    },

    /**
     * 设置属性
     *
     * @param {HTMLElement} el
     * @param {Object}      atts
     */
    setAttributes: function(el, atts) {
        for (var i in atts) {
            if (atts.hasOwnProperty(i)) {
                el.setAttribute(i, atts[i]);
            }
        }
    },

    /**
     * 获取样式信息
     *
     * @param {HTMLElement} el
     * @param {String}      prop
     */
    getStyle: function(el, prop) {
        if (typeof window.getComputedStyle !== "undefined") {
            return getComputedStyle(el, null).getPropertyValue(prop);
        } else {
            return el.currentStyle[prop];
        }
    },

    /**
     * 设置元素位置信息
     *
     * @param {HTMLElement} el
     * @param {Object}      p
     */
    setPosition: function(el, p) {
        el.style.left = p.left + "px";
        el.style.top = p.top + "px";
    },

    /**
     * 添加到根节点
     *
     * @param {HTMLElement} node
     */
    appendToRoot: function(node) {
        DOMUtil.appendToNode(node, null);
    },

    /**
     * 添加到指定父节点
     *
     * @param {HTMLElement} node
     * @param {HTMLElement} parentNode
     */
    appendToNode: function(node, parentNode) {
        !parentNode ? document.body.appendChild(node) : parentNode.appendChild(node);
    },

    /**
     * 插入之前
     *
     * @param {Object} newelement
     * @param {Object} targetelement
     */
    insertBefore(newelement, targetelement) {
        var parentelement = targetelement.parentNode;
        parentelement.insertBefore(newelement, targetelement);
    },

    /**
     * 插入之后
     *
     * @param {Object} newelement
     * @param {Object} targetelement
     */
    insertAfter(newelement, targetelement) {
        var parentelement = targetelement.parentNode;
        if (parentelement.lastChild == targetelement) {
            parentelement.appendChild(newelement);
        } else {
            parentelement.insertBefore(newelement, targetelement.nextSilbing);
        }
    },

    /**
     * 删除
     *
     * @param {Object} elem
     */
    delete(elem) {
        elem.parentNode.removeChild(elem);
    },

    /**
     * 获取dom节点
     *
     * @param {String}  tag
     * @param {String}  name
     * @param {Object}  parent
     * @param {Boolean} all
     */
    find(tag, name, parent, all) {
        parent = parent || document;

        if (tag === "tag") {
            return all ? parent.getElementsByTagName(name) : parent.getElementsByTagName(name)[0];
        } else if (tag === "class") {
            return parent.getElementsByClassName(name)[0];
        } else {
            return parent.getElementById(name);
        }
    },

    /**
     * 鼠标手势
     *
     * @param {Boolean} isShow
     */
    cursor(isShow) {
        document.body.style.cursor = isShow ? "pointer" : "default";
    },

    /**
     * 获取element大小
     *
     * @param {HTMLElement} el
     */
    getSize: function(el) {
        return [el.offsetWidth, el.offsetHeight];
    },

    /**
     * 获取element宽度
     *
     * @param {HTMLElement} el
     */
    getWidth: function(el) {
        return el.offsetWidth;
    },

    /**
     * 获取element高度
     *
     * @param {HTMLElement} el
     */
    getHeight: function(el) {
        return el.offsetHeight;
    },

    /**
     * 设置元素大小和位置
     *
     * @param {HTMLElement} el
     * @param {Number}      x
     * @param {Number}      y
     * @param {Number}      w
     * @param {Number}      h
     */
    sizeElement: function(el, x, y, w, h) {
        if (el) {
            el.style.height = h + "px";
            //el.height = h;
            el.style.width = w + "px";
            //el.width = w;
            el.style.left = x + "px";
            el.style.top = y + "px";
        }
    },

    /**
     * 阻止事件
     *
     * @param {Event}   e
     * @param {Boolean} doNotPreventDefault
     */
    stopEvent: function(e, doNotPreventDefault) {
        if (e.stopPropagation) {
            e.stopPropagation();
        } else {
            e.returnValue = false;
        }

        if (!doNotPreventDefault && e.preventDefault) {
            e.preventDefault();
        }
    }
};

export default DOMUtil;
