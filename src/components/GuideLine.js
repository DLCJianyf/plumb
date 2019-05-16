import DOMUtil from "../Util/DOMUtil";
import Observable from "../event/Observable";

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
            left: "0",
            top: "0",
            width: "100%",
            height: "1px",
            margin: "0",
            padding: "0",
            background: "rgb(110, 177, 234)",
            "pointer-events": "none",
            zIndex: "100",
            transform: "translate(0, 0)",
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
        DOMUtil.setStyle(this.element, {
            visibility: "visible",
            transform: `translate(${x}, ${y})`
        });
    }

    /**
     * 隐藏
     */
    hide() {
        DOMUtil.setStyle(this.element, {
            visibility: "hidden",
            transform: "translate(0, 0)"
        });
    }
}

export default GuideLine;
