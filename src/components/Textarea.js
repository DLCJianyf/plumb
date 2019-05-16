import DOMUtil from "../Util/DOMUtil";
import Observable from "../event/Observable";

/**
 * 文本域，目前用于连接线
 */
class Textarea extends Observable {
    constructor(value) {
        super();
        this.value = value;
        this.element = this.create();
    }

    /**
     * 失去焦点事件
     */
    onblur() {
        this.trigger("text-blur");
    }

    /**
     * 创建dom元素
     */
    create() {
        const wrapper = DOMUtil.createElement(
            "textarea",
            {},
            "text-linker text-linker-textarea",
            {
                wrap: "off",
                autofocus: true
            }
        );
        wrapper.value = this.value;
        this.bind(wrapper, "blur", this.onblur.bind(this));
        return wrapper;
    }
}

export default Textarea;
