import Anchor from "./Anchor";
import Source from "./Source";
import EndPoint from "./EndPoint";
import Connector from "./Connector";

import Drag from "./Drag";
import Util from "./Util";
import Render from "./Render";
import Observable from "./Observable";

class Plumb extends Observable {
    constructor(targets, config) {
        super();

        this.config = config;

        this.sources = [];
        this.endPoints = [];
        this.connectors = [];
        this.init(targets);
    }

    init(targets) {
        if (!targets) return;
        if (targets.length === undefined) targets = [targets];
        Array.prototype.slice.call(targets).forEach(function(target) {
            let source = new Source(target);

            this.draggable(source);
            this.sources.push(source);
        }, this);
    }

    /**
     * 为目标元素绑定拖动事件
     *
     * @param {Object} target
     */
    draggable(target) {
        this.bind(target.element, "mousedown", Drag.dragStart, target);
        this.bind(document, "mousemove", Drag.dragging, target);
        this.bind(document, "mouseup", Drag.dragEnd, target);
    }

    /**
     * 接触目标元素拖动事件
     *
     * @param {Object} target
     */
    unDraggable(target) {
        this.unbind(target.element, "mousedown");
        this.unbind(document, "mousemove");
        this.unbind(document, "mouseup");
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
            default:
                pX = rect[0] + rect[2] / 2.0 - opts.size / 2.0;
                pY = rect[1] + rect[3] - opts.size / 2.0;
        }

        let endPoint = new EndPoint(opts, pX, pY);
        source.addEndPoint(endPoint);
        Render.appendEndPoint(endPoint);
        this.draggable(endPoint);
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
                    let uuid = `${endPoint.uuid}---${targetEndPoint.uuid}`;
                    if (!plumb.connectors[uuid]) {
                        let connector = new Connector(endPoint, targetEndPoint);
                        plumb.connectors[uuid] = connector;
                        Render.appendConnector(connector);
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
     */
    deleteConnector(point) {
        let isBreak = false;
        let sourceID = point.uuid;

        for (let uuid in plumb.connectors) {
            let connector = plumb.connectors[uuid];
            let ids = connector.uuid.split("---");
            if (ids[0] === sourceID || ids[1] === sourceID) {
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
                let bound = connector.getBound();
                let size = connector.getPointSize();
                let width = Util.distance(bound.minX, bound.maxX);
                let height = Util.distance(bound.minY, bound.maxY);
                Render.updateConnector(connector, width, height, bound, size);
            }
        }
    }

    addMarker(connectorUUID, rect, markerType) {
        let connector = plumb.connectors[connectorUUID];
        let parentWrapper = connector.element;
        Render.addMarker(parentWrapper, rect, markerType);
    }

    /**
     * 获取可拖动窗体集合
     */
    getSources() {
        return this.sources;
    }
}

export default Plumb;
