export default {
    default: {
        marker: "ARROW", //连接线端点形状，目前只支持箭头
        lineDashType: "SOLID", //连接线形状，支持SOLID,DOT,DASH,DASHDOT,LONGDASH,LONGDASHDOT
        lineType: "BEZIER", //连接线类型，支持STRAIGHT,FLOW,BEZIER,CURVE
        lineColor: "gray", //连接线颜色
        textColor: "gray", //连接线文本颜色
        strokeWidth: 2, //连接线大小
        padding: 20, //背景网格距离容器间距
        useGuideLine: false, //是否使用辅助线
        useGrid: false, //是否使用背景网格
        useScale: false //是否使用容器缩放
    }
};
