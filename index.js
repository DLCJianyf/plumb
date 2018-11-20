import Plumb from "./src/Plumb";

let sources = document.getElementsByClassName("window");

window.plumb = new Plumb(sources, {
    marker: "ARROW",
    lineDashType: "DASHDOT",
    strokeWidth: 2
});

plumb.getSources().forEach(function(source) {
    plumb.addEndPoint(source, {
        uuid: `${source.getElement().id}-bottom`,
        anchor: "bottom",
        size: 18
    });

    plumb.addEndPoint(source, {
        uuid: `${source.getElement().id}-top`,
        anchor: "top",
        size: 18
    });
}, this);
