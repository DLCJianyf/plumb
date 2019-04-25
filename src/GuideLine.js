import DOMUtil from "./DOMUtil";
import Observable from "./Observable";

/**
 * 辅助线
 */
class GuideLine extends Observable {
    constructor(type) {
        super();
        this.type = type;

        this.rect = {
            x: 0,
            y: 0
        };
        this.element = this.create();
    }

    create() {
        const style = {
            position: "absolute",
            left: "0px",
            top: "0px",
            width: "100%",
            height: "1px",
            background: "rgb(110, 117, 234)",
            zIndex: "100",
            visibility: "hidden"
        };

        return DOMUtil.createElement(
            "div",
            Object.assign(
                {},
                style,
                this.type === "horizontal"
                    ? { width: "100%", height: "1px" }
                    : { width: "1px", height: "100%" }
            ),
            "guide-line-" + this.type,
            { id: "guide-line-" + this.type }
        );
    }

    /**
     * 显示
     *
     * @param {String} x
     * @param {String} y
     */
    show(x, y) {
        DOMUtil.setStyle(this.element, { visibility: "visible", left: x, top: y });
    }

    /**
     * 隐藏
     */
    hide() {
        DOMUtil.setStyle(this.element, { visibility: "hidden", left: 0, top: 0 });
    }
}

export default GuideLine;
