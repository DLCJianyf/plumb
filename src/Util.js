import DOMUtil from "./DOMUtil";

/**
 * 工具类，静态方法
 */
class Util {
    static min(a, b) {
        return a < b ? a : b;
    }

    static max(a, b) {
        return a > b ? a : b;
    }

    static distance(a, b) {
        return Math.abs(a - b);
    }

    static distanceLine(p1, p2) {
        let $x = p1.x - p2.x;
        let $y = p1.y - p2.y;

        return Math.sqrt($x * $x + $y * $y);
    }

    static getBoundByCircle(center, r) {
        return {
            minX: center.left - r,
            minY: center.top - r,
            maxX: center.left + r,
            maxY: center.top + r
        };
    }

    static getBoundByRect(rect1, rect2) {
        return {
            minX: Util.min(rect1[0], rect2[0]),
            minY: Util.min(rect1[1], rect2[1]),
            maxX: Util.max(rect1[0], rect2[0]),
            maxY: Util.max(rect1[1], rect2[1])
        };
    }

    static isBoundIntersect(rec1, rec2) {
        var minx = Util.min(rec1.minX, rec2.minX);
        var miny = Util.min(rec1.minY, rec2.minY);
        var maxx = Util.max(rec1.maxX, rec2.maxY);
        var maxy = Util.max(rec1.maxY, rec2.maxY);
        //如果兩個矩形相交，那麼計算得到的點對坐標必然滿足
        return !(minx > maxx || miny > maxy);
    }

    static isCircleIntersect(c1, c2) {
        let centerDistance = Math.sqrt(Math.pow(c1.x - c2.x, 2) + Math.pow(c1.y - c2.y, 2));

        return centerDistance <= c1.r * 2;
    }

    static isInRect(p, rect) {
        return p.x > rect[0] && p.x < rect[0] + rect[2] && p.y > rect[1] && p.y < rect[1] + rect[3];
    }

    static isInCircle(p, rect) {
        let dis = Util.distanceLine(p, { x: rect[0], y: rect[1] });

        return dis <= rect[2];
    }

    /**
     * 设置dom元素属性
     *
     * @param {HTMLElement} target
     * @param {Object} attributes
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
     * @param {Object} styles
     */
    static setStyle(target, styles) {
        for (let key in styles) {
            target.style[key] = styles[key];
        }
    }

    static getElementRectInfo(element) {
        return ["offsetLeft", "offsetTop", "offsetWidth", "offsetHeight"].map(function(attrName) {
            return element[attrName] || 0;
        });
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

    static getPathCMD(type) {
        if (type === "BEZIER") {
            return "C";
        }

        return "L";
    }

    static guid() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
            var r = (Math.random() * 16) | 0,
                v = c == "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }

    static findItemByUUID(arr, id) {
        for (let elem of arr) {
            if (elem.uuid === id) {
                return elem;
            }
        }
        return null;
    }
}

export default Util;
