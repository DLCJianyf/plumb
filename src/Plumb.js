//组件
import Grid from "./components/Grid";
import Anchor from "./components/Anchor";
import Source from "./components/Source";
import EndPoint from "./components/EndPoint";
import Connector from "./components/Connector";
import GuideLine from "./components/GuideLine";

//能力
import Util from "./Util/Util";
import Link from "./Util/Link";
import Render from "./Render";
import DOMUtil from "./Util/DOMUtil";
import EleResize from "./EleResize";
import Observable from "./event/Observable";
import EventHandler from "./event/EventHandler";

//参数
import Options from "./config/Options";

/**
 * 主入口，承上（组件）启下（能力）
 */
class Plumb extends Observable {
    constructor(targets, config) {
        super();

        this.flag = 1;
        this.config = Object.assign({}, Options.default, config, { scale: 1 });

        this.sources = [];
        this.endPoints = [];
        this.connectors = [];

        //可拖拽元素
        this.draggableEls = {
            SOURCE: [],
            ENDPOINT: []
        };

        this.tolerant = 2;
        this.guidLineH = null;
        this.guidLineV = null;

        this.wrapper = DOMUtil.find("class", "jtk-demo-main");

        if (!this.wrapper) {
            console.log("Can not find container!");
            return;
        }

        this.init(targets);
        this.initEvents();
        this.initResizeEvent();

        const { useGuideLine, useGrid, useScale } = this.config;
        if (useGrid) this.initGrid();
        if (useScale) this.initScale();
        if (useGuideLine) this.initGuideLine();
    }

    /**
     * 初始化
     *
     * @param {Array} targets
     */
    init(targets) {
        if (!targets) return;
        if (targets.length === undefined) targets = [targets];
        Array.prototype.slice.call(targets).forEach(function(target) {
            let source = new Source(target);

            this.draggable(source, "SOURCE");
            this.sources.push(source);
        }, this);
    }

    /**
     * 初始化全局事件
     */
    initEvents() {
        this.bind(document, "mousedown", EventHandler.mouseDown);
        this.bind(document, "mousemove", EventHandler.mouseMove);
        this.bind(document, "mouseup", EventHandler.mouseUp);
    }

    /**
     * 初始化resize事件
     */
    initResizeEvent() {
        EleResize.on(this.wrapper, this.handleResize.bind(this));
    }

    /**
     * 初始化缩放
     */
    initScale() {
        const me = this;
        Number.prototype.toScale = function() {
            return this * me.config.scale;
        };
        Number.prototype.restoreScale = function() {
            return this / me.config.scale;
        };

        this.bind(this.wrapper, "wheel", EventHandler.mouseWheel);
    }

    /**
     * 初始化辅助线
     */
    initGuideLine() {
        this.guidLineH = new GuideLine("horizontal");
        this.guidLineV = new GuideLine("vertical");
        DOMUtil.appendToNode(this.guidLineH.element, this.wrapper);
        DOMUtil.appendToNode(this.guidLineV.element, this.wrapper);
    }

    /**
     * 初始化背景网格
     */
    initGrid() {
        this.grid = new Grid(this.config.padding);
        DOMUtil.insertBefore(this.grid.element, this.wrapper.firstChild);
    }

    /**
     * dom元素大小变化
     */
    handleResize() {
        this.grid.trigger("resize");
    }

    /**
     * 为目标元素添加拖拽能力
     *
     * @param {Object} target
     * @param {String} type
     */
    draggable(target, type) {
        this.draggableEls[type].push(target);
    }

    /**
     * 移除目标元素拖拽能力
     *
     * @param {Object} target
     * @param {String} type
     */
    unDraggable(target, type) {
        target.off("moved");
        target.off("moveend");

        let els = this.draggableEls[type];
        for (let i = 0; i < els.length; i++) {
            if (els[i].uuid === target.uuid && els[i].type === target.type) {
                els.splice(i, 1);
                break;
            }
        }
    }

    /**
     * 添加锚点
     */
    addEndPoint(source, opts) {
        let pX = 0,
            pY = 0;
        let rect = source.getRect();
        switch (opts.anchor) {
            case "top":
                pX = rect.x + rect.w / 2 - opts.size / 2;
                pY = rect.y - opts.size / 2;
                break;
            case "bottom":
                pX = rect.x + rect.w / 2 - opts.size / 2;
                pY = rect.y + rect.h - opts.size / 2;
                break;
            case "left":
                pX = rect.x - opts.size / 2;
                pY = rect.y + rect.h / 2 - opts.size / 2;
                break;
            case "right":
                pX = rect.x + rect.w - opts.size / 2;
                pY = rect.y + rect.h / 2 - opts.size / 2;
                break;
            default:
                pX = rect.x + rect.w / 2 - opts.size / 2;
                pY = rect.y + rect.h - opts.size / 2;
                break;
        }

        let endPoint = new EndPoint(
            opts,
            pX,
            pY,
            opts.lineType || this.config.lineType,
            opts.lineDashType || this.config.lineDashType,
            opts.lineColor || this.config.lineColor,
            opts.textColor || this.config.textColor
        );
        endPoint.element = Render.assembleEndPoint(endPoint);
        DOMUtil.appendToNode(endPoint.element, DOMUtil.find("class", "jtk-demo-canvas"));

        //事件绑定
        this.bind(endPoint.element, "mouseover", endPoint.onmouseover.bind(endPoint));
        this.bind(endPoint.element, "mouseout", endPoint.onmouseout.bind(endPoint));

        source.addEndPoint(endPoint);
        //全局中保存一份
        this.endPoints.push(endPoint);
        this.draggable(endPoint, "ENDPOINT");
    }

    /**
     * 创建移动的锚点
     *
     * @param {EndPoint} endPoint
     */
    createFloatingEndPoint(rect, uuid, originX, originY) {
        let anchor = new Anchor(rect, uuid, originX, originY);
        anchor.isMouseDown = true;

        return anchor;
    }

    /**
     * 添加连接线
     *
     * @param {EndPoint} targetEndPoint
     * @param {String}   sourceID
     */
    addConnector(targetEndPoint, sourceID) {
        let isBreak = false;
        sourceID = sourceID || targetEndPoint.uuid;
        for (let source of plumb.sources) {
            for (let endPoint of source.endPoints) {
                if (endPoint.uuid === sourceID) {
                    let uuid = `${endPoint.uuid}^-^${targetEndPoint.uuid}`;
                    if (!plumb.connectors[uuid]) {
                        let connector = new Connector(endPoint, targetEndPoint);
                        plumb.connectors[uuid] = connector;

                        let { width, height, bound, size } = connector.getSizeAndBound();
                        connector.element = Render.assembleConnector(
                            width,
                            height,
                            bound,
                            size,
                            plumb.config.strokeWidth
                        );
                        DOMUtil.appendToNode(
                            connector.element,
                            DOMUtil.find("class", "jtk-demo-canvas")
                        );

                        //更新连接线
                        connector.trigger("update", {
                            width,
                            height,
                            bound,
                            size,
                            isCreate: true
                        });

                        return connector;
                    }

                    isBreak = true;
                    break;
                }
            }
            if (isBreak) break;
        }

        return false;
    }

    /**
     * 删除连接线
     *
     * @param {EndPoint} point
     * @param {EndPoint} point
     */
    deleteConnector(point, target) {
        let isBreak = false;
        let sourceID = point.uuid;
        let targetID = (target && target.uuid) || sourceID;

        for (let uuid in plumb.connectors) {
            let connector = plumb.connectors[uuid];
            let ids = connector.uuid.split("^-^");
            if (ids[0] === sourceID && ids[1] === targetID) {
                Render.deleteConnector(connector);
                delete plumb.connectors[uuid];
            }
        }
    }

    /**
     * 更新连接线
     *
     * @param {String} UUID
     */
    updateConnector(UUID) {
        for (let uuid in plumb.connectors) {
            let connector = plumb.connectors[uuid];
            if (
                UUID === connector.getSource().uuid ||
                UUID === connector.getTarget().uuid
            ) {
                connector.trigger("update");
            }
        }
    }

    /**
     * 更新所有的连接线
     */
    updateAllConnector() {}

    /**
     * 添加marker箭头，连接线使用
     *
     * @param {String} connectorUUID
     * @param {Array}  rect
     * @param {String} markerType
     * @param {String} markerId
     */
    addMarker(connectorUUID, rect, markerType, markerId) {
        let connector = plumb.connectors[connectorUUID];
        let parentWrapper = DOMUtil.find("tag", "svg", connector.element);
        let marker = Render.assembleMarker(
            rect,
            markerType,
            markerId,
            connector.lineColor
        );
        DOMUtil.appendToNode(marker, parentWrapper);

        const path = DOMUtil.find("tag", "path", parentWrapper);
        DOMUtil.setAttribute(path, "marker-end", `url(#${markerId})`);
    }

    /**
     * 显示辅助线
     *
     * @param {Array} infos
     */
    showGuide(infos) {
        const me = this;
        const length = infos.length;

        if (length === 2) {
            me.guidLineH.show(infos[0].x + "px", infos[0].y + "px");
            me.guidLineV.show(infos[1].x + "px", infos[1].y + "px");
        } else if (length === 1) {
            const inf = infos[0];
            if (inf.type === "horizontal") {
                me.guidLineH.show(inf.x + "px", inf.y + "px");
                me.guidLineV.hide();
            } else {
                me.guidLineV.show(inf.x + "px", inf.y + "px");
                me.guidLineH.hide();
            }
        } else if (length === 0) {
            me.hideGuide();
        }
    }

    /**
     * 隐藏辅助线
     */
    hideGuide() {
        this.guidLineH.hide();
        this.guidLineV.hide();
    }

    /**
     * 获取可拖动窗体集合
     */
    getSources() {
        return this.sources;
    }
}

// const plumb = (targets, config = {}) => new Plumb(targets, config);

// if (window) {
//     window.x = window.x || {};
//     window.x.plumb = plumb;
//     window.x.plumb.locale = (lang, message) => locale(lang, message);
// }

export { Plumb };
