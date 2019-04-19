import Anchor from "./Anchor";
import Source from "./Source";
import EndPoint from "./EndPoint";
import Connector from "./Connector";

import Drag from "./Drag";
import Util from "./Util";
import Render from "./Render";
import DOMUtil from "./DOMUtil";
import Event from "./Event";
import Observable from "./Observable";

class Plumb extends Observable {
    constructor(targets, config) {
        super();

        this.config = config;

        this.sources = [];
        this.endPoints = [];
        this.connectors = [];

        //可拖拽元素
        this.draggableEls = {
            SOURCE: [],
            ENDPOINT: []
        };
        this.init(targets);
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

        this.initEvents();
    }

    /**
     * 初始化全局事件
     */
    initEvents() {
        this.bind(document, "mousedown", Drag.dragStart);
        this.bind(document, "mousemove", Drag.dragging);
        this.bind(document, "mouseup", Drag.dragEnd);

        //事件分发
        const parent = document.querySelector(".jtk-demo-canvas");
        this.bind(parent, "mousedown", function(evt) {
            Event.dispatchEvent(parent, evt, "mousedown");
        });
        this.bind(parent, "mouseover", function(evt) {
            Event.dispatchEvent(parent, evt, "mouseover");
        });
        // this.bind(parent, "mousedown", function(evt) {

        // });
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
                pX = rect[0] + rect[2] / 2.0 - opts.size / 2.0;
                pY = rect[1] + -opts.size / 2.0;
                break;
            case "bottom":
                pX = rect[0] + rect[2] / 2.0 - opts.size / 2.0;
                pY = rect[1] + rect[3] - opts.size / 2.0;
                break;
            case "left":
                pX = rect[0] - opts.size / 2.0;
                pY = rect[1] + rect[3] / 2.0 - opts.size / 2.0;
                break;
            case "right":
                pX = rect[0] + rect[2] - opts.size / 2.0;
                pY = rect[1] + rect[3] / 2.0 - opts.size / 2.0;
                break;
            default:
                pX = rect[0] + rect[2] / 2.0 - opts.size / 2.0;
                pY = rect[1] + rect[3] - opts.size / 2.0;
                break;
        }

        let endPoint = new EndPoint(opts, pX, pY);
        endPoint.element = Render.assembleEndPoint(endPoint);
        DOMUtil.appendToNode(endPoint.element, document.querySelector(".jtk-demo-canvas"));

        source.addEndPoint(endPoint);
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
     * @param {String} sourceID
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
                        connector.element = Render.assembleConnector(width, height, bound, size);
                        DOMUtil.appendToNode(
                            connector.element,
                            document.querySelector(".jtk-demo-canvas")
                        );

                        Render.updatePath(
                            connector.element.getElementsByTagName("path")[0],
                            connector.calcPathPointArr(width, height, bound, size)
                        );

                        this.bind(
                            connector.element.getElementsByTagName("path")[0],
                            "mousedown",
                            function(evt) {
                                console.log(evt, 22222222222);
                            }
                        );

                        return uuid;
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
            if (UUID === connector.getSource().uuid || UUID === connector.getTarget().uuid) {
                let { width, height, bound, size } = connector.getSizeAndBound();
                Render.updateConnector(connector, width, height, bound, size);
            }
        }
    }

    /**
     * 添加marker箭头，连接线使用
     *
     * @param {String} connectorUUID
     * @param {Array}  rect
     * @param {String} markerType
     */
    addMarker(connectorUUID, rect, markerType) {
        let connector = plumb.connectors[connectorUUID];
        let parentWrapper = connector.element;
        let marker = Render.assembleMarker(rect, markerType);
        DOMUtil.appendToNode(marker, parentWrapper);

        let path = parentWrapper.getElementsByTagName("path")[0];
        DOMUtil.setAttribute(path, "marker-end", "url(#marker-achor)");
    }

    /**
     * 获取可拖动窗体集合
     */
    getSources() {
        return this.sources;
    }
}

export default Plumb;
