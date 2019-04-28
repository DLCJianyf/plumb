//import Plumb from "../../src/Plumb";

let sources = document.getElementsByClassName("jtk-demo-canvas-window");

window.plumb = new Plumb(sources, {
    marker: "ARROW",
    lineDashType: "SOLID",
    lineType: "FLOW",
    strokeWidth: 2,
    padding: 20,
    useGuideLine: true,
    useGrid: true
});

plumb.getSources().forEach(function(source, index) {
    switch (index + 1) {
        case 1:
            plumb.addEndPoint(source, {
                uuid: `${source.getElement().id}-bottom`,
                anchor: "bottom",
                size: 18,
                lineDashType: "DASH",
                lineType: "STRAIGHT"
            });
            break;
        case 2:
            plumb.addEndPoint(source, {
                uuid: `${source.getElement().id}-bottom`,
                anchor: "bottom",
                size: 18,
                lineDashType: "DASH",
                lineType: "STRAIGHT"
            });
            break;
        case 3:
            plumb.addEndPoint(source, {
                uuid: `${source.getElement().id}-top`,
                anchor: "top",
                size: 18
            });
            plumb.addEndPoint(source, {
                uuid: `${source.getElement().id}-right`,
                anchor: "right",
                size: 18,
                lineDashType: "SOLID",
                lineType: "FLOW"
            });
            plumb.addEndPoint(source, {
                uuid: `${source.getElement().id}-bottom`,
                anchor: "bottom",
                size: 18,
                lineDashType: "DASH",
                lineType: "STRAIGHT"
            });
            break;
        case 4:
            plumb.addEndPoint(source, {
                uuid: `${source.getElement().id}-top`,
                anchor: "top",
                size: 18,
                lineDashType: "DASH",
                lineType: "FLOW"
            });
            plumb.addEndPoint(source, {
                uuid: `${source.getElement().id}-left`,
                anchor: "left",
                size: 18,
                lineDashType: "DASH",
                lineType: "FLOW"
            });
            plumb.addEndPoint(source, {
                uuid: `${source.getElement().id}-right`,
                anchor: "right",
                size: 18
            });
            plumb.addEndPoint(source, {
                uuid: `${source.getElement().id}-bottom`,
                anchor: "bottom",
                size: 18,
                lineDashType: "DASH",
                lineType: "STRAIGHT"
            });
            break;
        case 5:
            plumb.addEndPoint(source, {
                uuid: `${source.getElement().id}-top`,
                anchor: "top",
                size: 18
            });
            plumb.addEndPoint(source, {
                uuid: `${source.getElement().id}-bottom`,
                anchor: "bottom",
                size: 18,
                lineDashType: "DASH",
                lineType: "STRAIGHT"
            });
            break;
        case 6:
            plumb.addEndPoint(source, {
                uuid: `${source.getElement().id}-top`,
                anchor: "top",
                size: 18
            });
            plumb.addEndPoint(source, {
                uuid: `${source.getElement().id}-left`,
                anchor: "left",
                size: 18,
                lineDashType: "DASH",
                lineType: "FLOW"
            });
            break;
        case 7:
            plumb.addEndPoint(source, {
                uuid: `${source.getElement().id}-top`,
                anchor: "top",
                size: 18
            });
            plumb.addEndPoint(source, {
                uuid: `${source.getElement().id}-right`,
                anchor: "right",
                size: 18
            });
            break;
    }
}, this);

plumb.on("connected", function(evt) {
    console.log(evt);
});
