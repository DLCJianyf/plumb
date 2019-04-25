import Observable from "./Observable";
import Util from "./Util";
import DOMUtil from "./DOMUtil";

/**
 * 背景网格
 */
class Grid extends Observable {
    constructor(padding) {
        super();

        this.id = "design_grid";
        this.gridSize = 15;
        this.padding = padding;
        this.element = this.create();

        this.on("resize", this.resize.bind(this));
    }

    /**
     * 元素创建
     */
    create() {
        const canvas = DOMUtil.createElement(
            "canvas",
            { position: "absolute", left: "0", top: "0" },
            "",
            {
                id: this.id
            }
        );
        this.paint(canvas, this.padding, this.gridSize);
        return canvas;
    }

    /**
     * 绘制网格
     *
     * @param {HTMLElement} canvas
     * @param {Number}      padding
     * @param {Number}      gridSize
     */
    paint(canvas, padding, gridSize) {
        const wrapper = DOMUtil.find("class", "jtk-demo-main");
        const rect = Util.getElementRectInfo(wrapper);
        const innerRect = {
            x: padding,
            y: padding,
            w: rect.w - 2 * padding,
            h: rect.h - 2 * padding
        };

        canvas.width = rect.w;
        canvas.height = rect.h;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, rect.w, rect.h);
        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.beginPath();
        ctx.rect(innerRect.x, innerRect.y, innerRect.w, innerRect.h);
        ctx.fill();

        ctx.translate(padding, padding);
        ctx.lineWidth = 1;
        ctx.save();

        let x = 0.5;
        let gap = 0;
        while (x <= innerRect.h) {
            ctx.restore();
            if (gap % 4 === 0) {
                ctx.strokeStyle = "rgb(229, 229, 229)";
            } else {
                ctx.strokeStyle = "rgb(242, 242, 242)";
            }
            ctx.beginPath();
            ctx.moveTo(0, x);
            ctx.lineTo(innerRect.w, x);
            x += gridSize;
            gap++;
            ctx.stroke();
        }

        x = 0.5;
        gap = 0;
        while (x <= innerRect.w) {
            ctx.restore();
            if (gap % 4 === 0) {
                ctx.strokeStyle = "rgb(229, 229, 229)";
            } else {
                ctx.strokeStyle = "rgb(242, 242, 242)";
            }
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, innerRect.h);
            x += gridSize;
            gap++;
            ctx.stroke();
        }
    }

    /**
     * resize监听
     */
    resize() {
        this.paint(this.element, this.padding, this.gridSize);
    }
}

export default Grid;
