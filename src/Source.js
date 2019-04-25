import Util from "./Util";
import Render from "./Render";
import Observable from "./Observable";
import Drag from "./Drag";

/**
 * 可拖动窗体
 */
class Source extends Observable {
    constructor(element) {
        super();

        this.type === "SOURCE";

        this.endPoints = [];
        this.element = element;
        this.uuid = this.element.id;

        this.prev = null;
        this.next = null;

        this.originX = this.originY = 0;
        this.isMouseDown = false;
        this.rect = Util.getElementRectInfo(element);

        this.on("moved", this.moved, this);
        this.on("moveend", this.moveend, this);
    }

    /**
     * 获取位置，大小信息
     */
    getRect() {
        return this.rect;
    }

    /**
     * 获取窗体dom元素
     */
    getElement() {
        return this.element;
    }

    /**
     * 添加锚点
     *
     * @param {EndPoint} endPoint
     */
    addEndPoint(endPoint) {
        this.endPoints.push(endPoint);
    }

    /**
     * 自身移动
     *
     * @param {Object} args
     */
    moved(args) {
        this.endPoints.forEach(item => {
            item.updatePosition(args.$X, args.$Y);
            Render.updatePosition(item.element, item.rect.x, item.rect.y);
        });

        if (plumb.config.useGuideLine && Drag.dragEl) this.calGuideLine();
    }

    /**
     * 辅助线相关计算
     */
    calGuideLine() {
        const me = this;

        let infos = [];
        let v = {
            t: {
                abs: 9999
            },
            tm: {
                abs: 9999
            },
            b: {
                abs: 9999
            }
        };
        let h = {
            l: {
                abs: 9999
            },
            lm: {
                abs: 9999
            },
            r: {
                abs: 9999
            }
        };

        const merect = me.getRect();
        const tolerant = plumb.tolerant;

        plumb.sources.forEach(function(sou) {
            if (sou.uuid !== me.uuid) {
                const rect = sou.getRect();

                const t = rect.y;
                const tm = rect.y + rect.h / 2;
                const b = rect.y + rect.h;
                const met = me.getMinDistance(merect.y, t, tm, b);
                const metm = me.getMinDistance(merect.y + merect.h / 2, t, tm, b);
                const meb = me.getMinDistance(merect.y + merect.h, t, tm, b);

                if (met.abs <= tolerant && met.abs < v.t.abs) v.t = met;
                if (metm.abs <= tolerant && metm.abs < v.tm.abs) v.tm = metm;
                if (meb.abs <= tolerant && meb.abs < v.b.abs) v.b = meb;

                const l = rect.x;
                const lm = rect.x + rect.w / 2;
                const r = rect.x + rect.w;
                const mel = me.getMinDistance(merect.x, l, lm, r);
                const melm = me.getMinDistance(merect.x + merect.w / 2, l, lm, r);
                const mer = me.getMinDistance(merect.x + merect.w, l, lm, r);

                if (mel.abs <= tolerant && mel.abs < h.l.abs) h.l = mel;
                if (melm.abs <= tolerant && melm.abs < h.lm.abs) h.lm = melm;
                if (mer.abs <= tolerant && mer.abs < h.r.abs) h.r = mer;
            }
        });

        //console.log(v, h);

        const minV = Util.min(v.t.abs, v.tm.abs, v.b.abs);
        if (minV <= tolerant) {
            let y = 0;
            if (minV === v.t.abs) {
                y = v.t.p;
            } else if (minV === v.tm.abs) {
                y = v.tm.p;
            } else {
                y = v.b.p;
            }
            infos.push({ type: "horizontal", x: 0, y: parseInt(y) });
        }

        const minH = Util.min(h.l.abs, h.lm.abs, h.r.abs);
        if (minH <= tolerant) {
            let x = 0;
            if (minH === h.l.abs) {
                x = h.l.p;
            } else if (minH === h.lm.abs) {
                x = h.lm.p;
            } else {
                x = h.r.p;
            }
            infos.push({ type: "vertical", x: parseInt(x), y: 0 });
        }

        plumb.showGuide(infos);
    }

    /**
     * 计算最小差值
     *
     * @param {Number} v1
     * @param {Number} v2
     * @param {Number} v3
     * @param {Number} v4
     */
    getMinDistance(v1, v2, v3, v4) {
        const dis1 = v1 - v2;
        const dis2 = v1 - v3;
        const dis3 = v1 - v4;

        const posDis1 = Math.abs(dis1);
        const posDis2 = Math.abs(dis2);
        const posDis3 = Math.abs(dis3);

        const min = Util.min(posDis1, posDis2, posDis3);

        if (min === posDis1) {
            return {
                dis: dis1,
                abs: posDis1,
                p: v2
            };
        } else if (min === posDis2) {
            return {
                dis: dis2,
                abs: posDis2,
                p: v3
            };
        } else {
            return {
                dis: dis3,
                abs: posDis3,
                p: v4
            };
        }
    }

    /**
     * 移动结束
     */
    moveend() {
        plumb.hideGuide();
    }
}

export default Source;
