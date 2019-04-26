import DOMUtil from "./DOMUtil";
import Observable from "./Observable";

/**
 * 文本域，目前用于连接线
 */
class Textarea extends Observable {
    constructor() {
        super();
        this.element = this.create();
    }

    /**
     * 失去焦点事件，由外部重写
     */
    onblur() {}

    /**
     * 创建dom元素
     */
    create() {
        const wrapper = DOMUtil.createElement("textarea", {}, "text-linker text-linker-textarea", {
            wrap: "off"
        });
        this.bind(wrapper, "blur", this.onblur);
        return wrapper;
    }
}

export default Textarea;
