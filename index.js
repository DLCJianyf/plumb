import Plumb from "./src/Plumb";

let sources = document.getElementsByClassName("jtk-demo-canvas-window");

window.plumb = new Plumb(sources, {
    marker: "ARROW",
    lineDashType: "SOLID",
    lineType: "BEZIER",
    strokeWidth: 2,
    padding: 20,
    useGuideLine: true,
    useGrid: true
});

plumb.getSources().forEach(function(source) {
    plumb.addEndPoint(source, {
        uuid: `${source.getElement().id}-left`,
        anchor: "left",
        lineType: "FLOW",
        lineDashType: "SOLID",
        size: 18
    });

    plumb.addEndPoint(source, {
        uuid: `${source.getElement().id}-right`,
        anchor: "right",
        lineType: "FLOW",
        lineDashType: "SOLID",
        size: 18
    });
}, this);

plumb.on("connected", function(evt) {
    console.log(evt);
});
