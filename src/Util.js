import DOMUtil from "./DOMUtil";

/**
 * 工具类，静态方法
 */
class Util {
    /**
     * 最小值
     */
    static min() {
        const args = Array.prototype.slice.call(arguments);
        if (args.length === 1) return args[0];

        return args.reduce(function(prev, cur) {
            return prev <= cur ? prev : cur;
        });
        // return a < b ? a : b;
    }

    /**
     * 最大值
     */
    static max() {
        const args = Array.prototype.slice.call(arguments);
        if (args.length === 1) return args[0];

        return args.reduce(function(prev, cur) {
            return prev >= cur ? prev : cur;
        });
        //return a > b ? a : b;
    }

    /**
     * 绝对值
     *
     * @param {Number} a
     * @param {Number} b
     */
    static distance(a, b) {
        return Math.abs(a - b);
    }

    /**
     * 计算两点之间的距离
     *
     * @param {Object} p1
     * @param {Object} p2
     */
    static distanceLine(p1, p2) {
        let $x = p1.x - p2.x;
        let $y = p1.y - p2.y;

        return Math.sqrt($x * $x + $y * $y);
    }

    /**
     * 获取圆的外接矩形
     *
     * @param {Object} center
     * @param {Number} r
     */
    static getBoundByCircle(center, r) {
        return {
            minX: center.left - r,
            minY: center.top - r,
            maxX: center.left + r,
            maxY: center.top + r
        };
    }

    /**
     * 获取两个矩形之间的bound区域
     *
     * @param {Object} rect1
     * @param {Object} rect2
     */
    static getBoundByRect(rect1, rect2) {
        return {
            minX: Util.min(rect1.x, rect2.x),
            minY: Util.min(rect1.y, rect2.y),
            maxX: Util.max(rect1.x, rect2.x),
            maxY: Util.max(rect1.y, rect2.y)
        };
    }

    /**
     * 两个矩形是否相较
     *
     * @param {Object} rect1
     * @param {Object} rect2
     */
    static isBoundIntersect(rect1, rect2) {
        var minx = Util.min(rect1.minX, rect2.minX);
        var miny = Util.min(rect1.minY, rect2.minY);
        var maxx = Util.max(rect1.maxX, rect2.maxY);
        var maxy = Util.max(rect1.maxY, rect2.maxY);
        //如果兩個矩形相交，那麼計算得到的點對坐標必然滿足
        return !(minx > maxx || miny > maxy);
    }

    /**
     * 两个圆是否相较
     *
     * @param {Object} c1
     * @param {Object} c2
     */
    static isCircleIntersect(c1, c2) {
        let centerDistance = Math.sqrt(Math.pow(c1.x - c2.x, 2) + Math.pow(c1.y - c2.y, 2));

        return centerDistance <= c1.r * 2;
    }

    /**
     * 点是否在矩形中
     *
     * @param {Object} p
     * @param {Object} rect
     */
    static isInRect(p, rect) {
        return p.x > rect.x && p.x < rect.x + rect.w && p.y > rect.y && p.y < rect.y + rect.h;
    }

    /**
     * 点是否在圆中
     *
     * @param {Object} p
     * @param {Object} rect
     */
    static isInCircle(p, rect) {
        let dis = Util.distanceLine(p, { x: rect.x, y: rect.y });

        return dis <= rect.w;
    }

    /**
     * 设置dom元素属性
     *
     * @param {HTMLElement} target
     * @param {Object}      attributes
     */
    static setAttribute(target, attributes) {
        try {
            for (let key in attributes) {
                target.setAttribute(key, attributes[key]);
            }
        } catch (evt) {
            debugger;
        }
    }

    /**
     * 设置dom元素样式
     *
     * @param {HTMLElement} target
     * @param {Object}      styles
     */
    static setStyle(target, styles) {
        for (let key in styles) {
            target.style[key] = styles[key];
        }
    }

    /**
     * 获取元素位置，大小信息
     *
     * @param {HTMLElement} element
     */
    static getElementRectInfo(element) {
        const info = ["offsetLeft", "offsetTop", "offsetWidth", "offsetHeight"].map(function(
            attrName
        ) {
            return element[attrName] || 0;
        });

        return {
            x: info[0],
            y: info[1],
            w: info[2],
            h: info[3]
        };
    }

    /**
     * 获取线样式
     *
     * @param {String} type
     * @param {Number} w
     */
    static getDashStyle(type, w) {
        switch (type) {
            case "SOLID":
                return [];
            case "DOT":
                return [1, 4 * w];
            case "DASH":
                return [4 * w, 4 * w];
            case "DASHDOT":
                return [4 * w, 4 * w, 1, 4 * w];
            case "LONGDASH":
                return [8 * w, 4 * w];
            case "LONGDASHDOT":
                return [8 * w, 4 * w, 1, 4 * w];
            default:
                return [];
        }
    }

    /**
     * 根据连接线类型获取SVG指令
     *
     * @param {String} type
     */
    static getPathCMD(type) {
        if (type === "BEZIER") {
            return "C";
        }

        return "L";
    }

    /**
     * 生成唯一标识
     */
    static guid() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
            var r = (Math.random() * 16) | 0,
                v = c == "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }

    /**
     * 在数组中找到指定id的目标
     *
     * @param {Array}  arr
     * @param {String} id
     */
    static findItemByUUID(arr, id) {
        for (let elem of arr) {
            if (elem.uuid === id) {
                return elem;
            }
        }
        return null;
    }

    /**
     * 根据锚点找到对应的source
     *
     * @param {Array}  sous
     * @param {Object} achor
     */
    static findSourceByAchor(sous, achor) {
        for (let sou of sous) {
            for (let ach of sou.endPoints) {
                if (ach.uuid === achor.uuid) {
                    return sou;
                }
            }
        }
        return null;
    }
}

export default Util;
