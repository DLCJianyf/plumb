import Util from "./Util";
import Render from "./Render";
import Observable from "./Observable";
import Connector from "./Connector";

class Anchor extends Observable {
    constructor(rect, uuid, originX, originY, anchorType) {
        super();

        this.type = "ANCHOR";
        this.rect = rect;
        this.uuid = uuid;
        this.originX = originX;
        this.originY = originY;

        this.on("moved", this.moved, this);
        this.on("moveend", this.moveend, this);
    }

    getRect() {
        return this.rect;
    }

    /**
     * 移动
     *
     * @param {Object} args
     */
    moved(args) {
        let connectorUUID = plumb.addConnector(this);
        if (connectorUUID && plumb.config.marker) {
            plumb.addMarker(connectorUUID, this.rect.slice(), plumb.config.marker);
        }
        plumb.updateConnector(this.uuid);
    }

    /**
     * 移动结束
     */
    moveend() {
        if (!plumb.floatingEndPoint) return;

        //移除拖拽功能
        plumb.unDraggable(plumb.floatingEndPoint, "ENDPOINT");
        //删除锚点
        Render.deleteAnchor(plumb.floatingEndPoint);
        //删除连接线
        plumb.deleteConnector(plumb.floatingEndPoint, null);

        let rect1 = plumb.floatingEndPoint.getRect();
        for (let source of plumb.sources) {
            for (let endPoint of source.endPoints) {
                let rect = endPoint.getRect();
                let isTwoPointIntersect = Util.isCircleIntersect(
                    {
                        x: rect[0],
                        y: rect[1],
                        r: rect[2] / 2.0
                    },
                    {
                        x: rect1[0],
                        y: rect1[1],
                        r: rect1[2] / 2.0
                    }
                );
                if (isTwoPointIntersect) {
                    plumb.deleteConnector(endPoint, plumb.floatingEndPoint);
                    let connectorUUID = plumb.addConnector(endPoint, plumb.floatingEndPoint.uuid);
                    if (connectorUUID && plumb.config.marker) {
                        plumb.addMarker(connectorUUID, this.rect.slice(), plumb.config.marker);
                    }
                    plumb.trigger("connected", {
                        sourceID: plumb.floatingEndPoint.uuid,
                        targetID: endPoint.uuid
                    });
                }
            }
        }

        delete plumb.floatingEndPoint;
    }
}

export default Anchor;
