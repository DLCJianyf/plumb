import Util from "./Util";

/**
 * 连接线点数据计算，直线，曲线，贝塞尔，流程线
 */
const Link = {
    angle: {
        left: 0,
        top: 1.5707963267948966,
        right: 3.141592653589793,
        bottom: 4.71238898038469
    },

    /**
     * 根据角度获取锚点方向
     *
     * @param {Number} angle 角度
     */
    getAngleDir: function(angle) {
        let a = Math.PI;
        if (angle >= a / 4 && angle < (a / 4) * 3) {
            return 1;
        } else {
            if (angle >= (a / 4) * 3 && angle < (a / 4) * 5) {
                return 2;
            } else {
                if (angle >= (a / 4) * 5 && angle < (a / 4) * 7) {
                    return 3;
                } else {
                    return 4;
                }
            }
        }
    },

    /**
     * 计算SVG Path属性点
     *
     * @param {Number} width
     * @param {Number} height
     * @param {Object} bound
     * @param {Number} size
     */
    calcPathPointArr(width, height, bound, size, source, target, lineType) {
        switch (lineType) {
            case "BEZIER":
                return Link.calcBezier(width, height, bound, size, source, target);
            case "STRAIGHT":
                return Link.calcStraight(width, height, bound, size, source, target);
            case "FLOW":
                return Link.calcFlow(width, height, bound, size, source, target);
            case "CURVE":
                return Link.calcCurve(bound, source, target);
            default:
                return Link.calcBezier(width, height, bound, size, source, target);
        }
    },

    /**
     * 计算贝塞尔曲线参数
     *
     * @param {Number} width
     * @param {Number} height
     * @param {Object} bound
     * @param {Number} size
     */
    calcBezier(width, height, bound, size, source, target) {
        let p1 = [];
        let p2 = [];
        let p3 = [];
        let p4 = [];

        let maxX = bound.maxX - bound.minX;
        let maxY = bound.maxY - bound.minY;
        let minX = 0;
        let minY = 0;

        let thresoldX = 200;
        let thresoldY = 0;
        let sourceP = source;
        let rect1 = sourceP.getRect();
        let rect2 = target.getRect();

        if (sourceP.anchor !== "left") {
            if (rect1.x < rect2.x) {
                p1.push(minX);
                p2.push(minX + thresoldX);
                p3.push(maxX - thresoldX);
                p4.push(maxX);
            } else {
                p1.push(maxX);
                p2.push(maxX + thresoldX);
                p3.push(minX - thresoldX);
                p4.push(minX);
            }
        } else {
            if (rect1.x > rect2.x) {
                p1.push(maxX);
                p2.push(maxX - thresoldX);
                p3.push(minX + thresoldX);
                p4.push(minX);
            } else {
                p1.push(minX);
                p2.push(minX - thresoldX);
                p3.push(maxX + thresoldX);
                p4.push(maxX);
            }
        }

        if (rect1.y === bound.minY) {
            p1.push(minY);
            p2.push(minY + thresoldY);
            p3.push(maxY - thresoldY);
            p4.push(maxY);
        } else {
            p1.push(maxY);
            p2.push(maxY - thresoldY);
            p3.push(minY + thresoldY);
            p4.push(minY);
        }
        //p3.push(maxY / 2);

        return [p1, p2, p3, p4];
    },

    /**
     * 计算直线参数
     *
     * @param {Number} width
     * @param {Number} height
     * @param {Object} bound
     * @param {Number} size
     */
    calcStraight(width, height, bound, size, source, target) {
        let p1 = [];
        let p2 = [];

        let maxX = bound.maxX - bound.minX;
        let maxY = bound.maxY - bound.minY;
        let minX = 0;
        let minY = 0;

        let rect = source.getRect();

        if (rect.x === bound.minX) {
            p1.push(minX);
            p2.push(maxX);
        } else {
            p1.push(maxX);
            p2.push(minX);
        }

        if (rect.y === bound.minY) {
            p1.push(minY);
            p2.push(maxY);
        } else {
            p1.push(maxY);
            p2.push(minY);
        }

        return [p1, p2];
    },

    /**
     * 计算流程线参数
     *
     * @param {Number} width
     * @param {Number} height
     * @param {Object} bound
     * @param {Number} size
     */
    calcFlow(width, height, bound, size, source, target) {
        const { from, to } = this.getStartingPoint(bound, source, target);

        let sou = Util.findSourceByAchor(plumb.sources, source);
        let tar = Util.findSourceByAchor(plumb.sources, target);
        let r1 = sou.getRect();
        let r2 = tar.getRect();

        //参数转换以适配流程线的计算
        let link = {
            from: {
                id: source.type === "ANCHOR" ? null : source.uuid,
                x: from[0],
                y: from[1],
                w: r1.w,
                h: r1.h,
                type: source.type,
                anchor: source.anchor
            },

            to: {
                id: target.type === "ANCHOR" ? null : target.uuid,
                x: to[0],
                y: to[1],
                w: r2.w,
                h: r2.h,
                type: target.type,
                anchor: target.anchor
            }
        };

        let linkerPoints = Link.getFlowPoints(link);
        linkerPoints = linkerPoints.map(function(a) {
            return [a.x, a.y];
        });

        let results = [from];
        results = results.concat(linkerPoints);
        results.push(to);
        return results;
    },

    /**
     * 获得起始点
     *
     * @param {Number} bound
     */
    getStartingPoint(bound, source, target) {
        let p1 = [];
        //let p2 = [];
        let p3 = [];

        let maxX = bound.maxX - bound.minX;
        let maxY = bound.maxY - bound.minY;
        let minX = 0;
        let minY = 0;

        let souE = source;
        let tarE = target;
        let rect1 = souE.getRect();
        let rect2 = tarE.getRect();

        if (rect1.x === bound.minX) {
            p1.push(minX);
            // p2.push(minX);
            p3.push(maxX);
        } else {
            p1.push(maxX);
            //p2.push(maxX);
            p3.push(minX);
        }

        if (rect1.y === bound.minY) {
            p1.push(minY);
            //p2.push(maxY);
            p3.push(maxY);
        } else {
            p1.push(maxY);
            //p2.push(minY);
            p3.push(minY);
        }

        return {
            from: p1,
            to: p3
        };
    },

    /**
     * 获取连接线中间点
     *
     * @param {Array}  points
     * @param {String} lineType
     */
    getLinkerMidpoint: function(points, lineType) {
        let g = {};
        if (lineType == "CURVE") {
            let o = points[0];
            let m = points[1];
            let h = points[2];
            let f = points[3];
            g = {
                x: o[0] * 0.125 + m[0] * 0.375 + h[0] * 0.375 + f[0] * 0.125,
                y: o[1] * 0.125 + m[1] * 0.375 + h[1] * 0.375 + f[1] * 0.125
            };
        } else if (lineType === "FLOW") {
            let i = points;
            let l = 0;
            for (let b = 1; b < i.length; b++) {
                let m = i[b - 1];
                let h = i[b];
                let e = Util.distanceLine({ x: m[0], y: m[1] }, { x: h[0], y: h[1] });
                l += e;
            }
            let k = l / 2;
            let a = 0;
            for (let b = 1; b < i.length; b++) {
                let m = i[b - 1];
                let h = i[b];
                let e = Util.distanceLine({ x: m[0], y: m[1] }, { x: h[0], y: h[1] });
                let j = a + e;
                if (j >= k) {
                    let n = (k - a) / e;
                    g = {
                        x: (1 - n) * m[0] + n * h[0],
                        y: (1 - n) * m[1] + n * h[1]
                    };
                    break;
                }
                a = j;
            }
        }
        //}
        return g;
    },

    /**
     * 获取连接线中间过渡点
     *
     * @param {Object} link 连接线对象
     */
    getFlowPoints: function(link) {
        let points = [];

        let PI = Math.PI;
        // let souE = link.getSource();
        // let tarE = link.getTarget();
        // let ser = souE.getRect();
        // let ter = tarE.getRect();

        // let sou = Util.findSourceByAchor(plumb.sources, souE);
        // let tar = Util.findSourceByAchor(plumb.sources, tarE);

        // let from = Object.assign({}, sou.getRect());
        // let to = Object.assign({}, tar.getRect());
        let from = link.from;
        let to = link.to;

        from.angle = from.type === "ANCHOR" ? Link.angle["bottom"] : Link.angle[from.anchor];
        to.angle = to.type === "ANCHOR" ? Link.angle["bottom"] : Link.angle[to.anchor];
        // from.id = souE.type === "ANCHOR" ? null : sou.uuid;
        // to.id = tarE.type === "ANCHOR" ? null : tar.uuid;

        let width = Math.abs(to.x - from.x);
        let height = Math.abs(to.y - from.y);
        let r = 50;
        if (from.id != null && to.id != null) {
            let fromDir = this.getAngleDir(from.angle);
            let toDir = this.getAngleDir(to.angle);
            let g, i, reverse;
            if (fromDir == 1 && toDir == 1) {
                if (from.y < to.y) {
                    g = from;
                    i = to;
                    reverse = false;
                } else {
                    g = to;
                    i = from;
                    reverse = true;
                }
                // let h = Model.getShapeById(g.id).props;
                // let v = Model.getShapeById(i.id).props;
                let h = g;
                let v = i;
                if (i.x >= h.x - r && i.x <= h.x + h.from + r) {
                    let o;
                    if (i.x < h.x + h.from / 2) {
                        o = h.x - r;
                    } else {
                        o = h.x + h.from + r;
                    }
                    let n = g.y - r;
                    points.push({
                        x: g.x,
                        y: n
                    });
                    n = i.y - r;
                    points.push({
                        x: i.x,
                        y: n
                    });
                } else {
                    let n = g.y - r;
                    points.push({
                        x: g.x,
                        y: n
                    });
                    points.push({
                        x: i.x,
                        y: n
                    });
                }
            } else {
                if (fromDir == 3 && toDir == 3) {
                    if (from.y > to.y) {
                        g = from;
                        i = to;
                        reverse = false;
                    } else {
                        g = to;
                        i = from;
                        reverse = true;
                    }
                    // let h = Model.getShapeById(g.id).props;
                    // let v = Model.getShapeById(i.id).props;
                    let h = g;
                    let v = i;
                    if (i.x >= h.x - r && i.x <= h.x + h.from + r) {
                        let n = g.y + r;
                        let o;
                        if (i.x < h.x + h.from / 2) {
                            o = h.x - r;
                        } else {
                            o = h.x + h.from + r;
                        }
                        points.push({
                            x: g.x,
                            y: n
                        });
                        n = i.y + r;
                        points.push({
                            x: i.x,
                            y: n
                        });
                    } else {
                        let n = g.y + r;
                        points.push({
                            x: g.x,
                            y: n
                        });
                        points.push({
                            x: i.x,
                            y: n
                        });
                    }
                } else {
                    if (fromDir == 2 && toDir == 2) {
                        if (from.x > to.x) {
                            g = from;
                            i = to;
                            reverse = false;
                        } else {
                            g = to;
                            i = from;
                            reverse = true;
                        }
                        // let h = Model.getShapeById(g.id).props;
                        // let v = Model.getShapeById(i.id).props;
                        let h = g;
                        let v = i;
                        if (i.y >= h.y - r && i.y <= h.y + h.h + r) {
                            let o = g.x + r;
                            let n;
                            if (i.y < h.y + h.h / 2) {
                                n = h.y - r;
                            } else {
                                n = h.y + h.h + r;
                            }
                            points.push({
                                x: o,
                                y: g.y
                            });
                            o = i.x + r;
                            points.push({
                                x: o,
                                y: i.y
                            });
                        } else {
                            let o = g.x + r;
                            points.push({
                                x: o,
                                y: g.y
                            });
                            points.push({
                                x: o,
                                y: i.y
                            });
                        }
                    } else {
                        if (fromDir == 4 && toDir == 4) {
                            if (from.x < to.x) {
                                g = from;
                                i = to;
                                reverse = false;
                            } else {
                                g = to;
                                i = from;
                                reverse = true;
                            }
                            // let h = Model.getShapeById(g.id).props;
                            // let v = Model.getShapeById(i.id).props;
                            let h = g;
                            let v = i;
                            if (i.y >= h.y - r && i.y <= h.y + h.h + r) {
                                let o = g.x - r;
                                let n;
                                if (i.y < h.y + h.h / 2) {
                                    n = h.y - r;
                                } else {
                                    n = h.y + h.h + r;
                                }
                                points.push({
                                    x: o,
                                    y: g.y
                                });
                                o = i.x - r;
                                points.push({
                                    x: o,
                                    y: i.y
                                });
                            } else {
                                let o = g.x - r;
                                points.push({
                                    x: o,
                                    y: g.y
                                });
                                points.push({
                                    x: o,
                                    y: i.y
                                });
                            }
                        } else {
                            if ((fromDir == 1 && toDir == 3) || (fromDir == 3 && toDir == 1)) {
                                if (fromDir == 1) {
                                    g = from;
                                    i = to;
                                    reverse = false;
                                } else {
                                    g = to;
                                    i = from;
                                    reverse = true;
                                }
                                // let h = Model.getShapeById(g.id).props;
                                // let v = Model.getShapeById(i.id).props;
                                let h = g;
                                let v = i;
                                if (i.y <= g.y) {
                                    let n = g.y - height / 2;
                                    points.push({
                                        x: g.x,
                                        y: n
                                    });
                                    points.push({
                                        x: i.x,
                                        y: n
                                    });
                                } else {
                                    let a = h.x + h.from;
                                    let j = v.x + v.from;
                                    let n = g.y - r;
                                    let o;
                                    if (j >= h.x && v.x <= a) {
                                        let z = h.x + h.from / 2;
                                        if (i.x < z) {
                                            o = h.x < v.x ? h.x - r : v.x - r;
                                        } else {
                                            o = a > j ? a + r : j + r;
                                        }
                                        if (v.y < g.y) {
                                            n = v.y - r;
                                        }
                                    } else {
                                        if (i.x < g.x) {
                                            o = j + (h.x - j) / 2;
                                        } else {
                                            o = a + (v.x - a) / 2;
                                        }
                                    }
                                    points.push({
                                        x: g.x,
                                        y: n
                                    });
                                    points.push({
                                        x: o,
                                        y: n
                                    });
                                    n = i.y + r;
                                    points.push({
                                        x: o,
                                        y: n
                                    });
                                    points.push({
                                        x: i.x,
                                        y: n
                                    });
                                }
                            } else {
                                if ((fromDir == 2 && toDir == 4) || (fromDir == 4 && toDir == 2)) {
                                    if (fromDir == 2) {
                                        g = from;
                                        i = to;
                                        reverse = false;
                                    } else {
                                        g = to;
                                        i = from;
                                        reverse = true;
                                    }
                                    // let h = Model.getShapeById(g.id).props;
                                    // let v = Model.getShapeById(i.id).props;
                                    let h = g;
                                    let v = i;
                                    if (i.x > g.x) {
                                        let o = g.x + width / 2;
                                        points.push({
                                            x: o,
                                            y: g.y
                                        });
                                        points.push({
                                            x: o,
                                            y: i.y
                                        });
                                    } else {
                                        // let u = h.y + h.h;
                                        // let p = v.y + v.h;
                                        let u = h.y;
                                        let p = v.y;
                                        let o = g.x + r;
                                        let n;
                                        if (p >= h.y && v.y <= u) {
                                            let z = h.y + h.h / 2;
                                            if (i.y < z) {
                                                n = h.y < v.y ? h.y - r : v.y - r;
                                            } else {
                                                n = u > p ? u + r : p + r;
                                            }
                                            if (v.x + v.from > g.x) {
                                                o = v.x + v.from + r;
                                            }
                                        } else {
                                            if (i.y < g.y) {
                                                n = p + (h.y - p) / 2;
                                            } else {
                                                n = u + (v.y - u) / 2;
                                            }
                                        }
                                        points.push({
                                            x: o,
                                            y: g.y
                                        });
                                        points.push({
                                            x: o,
                                            y: n
                                        });
                                        o = i.x - r;
                                        points.push({
                                            x: o,
                                            y: n
                                        });
                                        points.push({
                                            x: o,
                                            y: i.y
                                        });
                                    }
                                } else {
                                    if (
                                        (fromDir == 1 && toDir == 2) ||
                                        (fromDir == 2 && toDir == 1)
                                    ) {
                                        if (fromDir == 2) {
                                            g = from;
                                            i = to;
                                            reverse = false;
                                        } else {
                                            g = to;
                                            i = from;
                                            reverse = true;
                                        }
                                        // let h = Model.getShapeById(g.id).props;
                                        // let v = Model.getShapeById(i.id).props;
                                        let h = g;
                                        let v = i;
                                        if (i.x > g.x && i.y > g.y) {
                                            points.push({
                                                x: i.x,
                                                y: g.y
                                            });
                                        } else {
                                            if (i.x > g.x && v.x > g.x) {
                                                let o;
                                                if (v.x - g.x < r * 2) {
                                                    o = g.x + (v.x - g.x) / 2;
                                                } else {
                                                    o = g.x + r;
                                                }
                                                let n = i.y - r;
                                                points.push({
                                                    x: o,
                                                    y: g.y
                                                });
                                                points.push({
                                                    x: o,
                                                    y: n
                                                });
                                                points.push({
                                                    x: i.x,
                                                    y: n
                                                });
                                            } else {
                                                if (i.x <= g.x && i.y > h.y + h.h) {
                                                    let u = h.y + h.h;
                                                    let o = g.x + r;
                                                    let n;
                                                    if (i.y - u < r * 2) {
                                                        n = u + (i.y - u) / 2;
                                                    } else {
                                                        n = i.y - r;
                                                    }
                                                    points.push({
                                                        x: o,
                                                        y: g.y
                                                    });
                                                    points.push({
                                                        x: o,
                                                        y: n
                                                    });
                                                    points.push({
                                                        x: i.x,
                                                        y: n
                                                    });
                                                } else {
                                                    let o;
                                                    let j = v.x + v.from;
                                                    if (j > g.x) {
                                                        o = j + r;
                                                    } else {
                                                        o = g.x + r;
                                                    }
                                                    let n;
                                                    if (i.y < h.y) {
                                                        n = i.y - r;
                                                    } else {
                                                        n = h.y - r;
                                                    }
                                                    points.push({
                                                        x: o,
                                                        y: g.y
                                                    });
                                                    points.push({
                                                        x: o,
                                                        y: n
                                                    });
                                                    points.push({
                                                        x: i.x,
                                                        y: n
                                                    });
                                                }
                                            }
                                        }
                                    } else {
                                        if (
                                            (fromDir == 1 && toDir == 4) ||
                                            (fromDir == 4 && toDir == 1)
                                        ) {
                                            if (fromDir == 4) {
                                                g = from;
                                                i = to;
                                                reverse = false;
                                            } else {
                                                g = to;
                                                i = from;
                                                reverse = true;
                                            }
                                            // let h = Model.getShapeById(g.id).props;
                                            // let v = Model.getShapeById(i.id).props;
                                            let h = g;
                                            let v = i;
                                            let j = v.x + v.from;
                                            if (i.x < g.x && i.y > g.y) {
                                                points.push({
                                                    x: i.x,
                                                    y: g.y
                                                });
                                            } else {
                                                if (i.x < g.x && j < g.x) {
                                                    let o;
                                                    if (g.x - j < r * 2) {
                                                        o = j + (g.x - j) / 2;
                                                    } else {
                                                        o = g.x - r;
                                                    }
                                                    let n = i.y - r;
                                                    points.push({
                                                        x: o,
                                                        y: g.y
                                                    });
                                                    points.push({
                                                        x: o,
                                                        y: n
                                                    });
                                                    points.push({
                                                        x: i.x,
                                                        y: n
                                                    });
                                                } else {
                                                    if (i.x >= g.x && i.y > h.y + h.h) {
                                                        let u = h.y + h.h;
                                                        let o = g.x - r;
                                                        let n;
                                                        if (i.y - u < r * 2) {
                                                            n = u + (i.y - u) / 2;
                                                        } else {
                                                            n = i.y - r;
                                                        }
                                                        points.push({
                                                            x: o,
                                                            y: g.y
                                                        });
                                                        points.push({
                                                            x: o,
                                                            y: n
                                                        });
                                                        points.push({
                                                            x: i.x,
                                                            y: n
                                                        });
                                                    } else {
                                                        let o;
                                                        if (v.x < g.x) {
                                                            o = v.x - r;
                                                        } else {
                                                            o = g.x - r;
                                                        }
                                                        let n;
                                                        if (i.y < h.y) {
                                                            n = i.y - r;
                                                        } else {
                                                            n = h.y - r;
                                                        }
                                                        points.push({
                                                            x: o,
                                                            y: g.y
                                                        });
                                                        points.push({
                                                            x: o,
                                                            y: n
                                                        });
                                                        points.push({
                                                            x: i.x,
                                                            y: n
                                                        });
                                                    }
                                                }
                                            }
                                        } else {
                                            if (
                                                (fromDir == 2 && toDir == 3) ||
                                                (fromDir == 3 && toDir == 2)
                                            ) {
                                                if (fromDir == 2) {
                                                    g = from;
                                                    i = to;
                                                    reverse = false;
                                                } else {
                                                    g = to;
                                                    i = from;
                                                    reverse = true;
                                                }
                                                // let h = Model.getShapeById(g.id).props;
                                                // let v = Model.getShapeById(i.id).props;
                                                let h = g;
                                                let v = i;
                                                if (i.x > g.x && i.y < g.y) {
                                                    points.push({
                                                        x: i.x,
                                                        y: g.y
                                                    });
                                                } else {
                                                    if (i.x > g.x && v.x > g.x) {
                                                        let o;
                                                        if (v.x - g.x < r * 2) {
                                                            o = g.x + (v.x - g.x) / 2;
                                                        } else {
                                                            o = g.x + r;
                                                        }
                                                        let n = i.y + r;
                                                        points.push({
                                                            x: o,
                                                            y: g.y
                                                        });
                                                        points.push({
                                                            x: o,
                                                            y: n
                                                        });
                                                        points.push({
                                                            x: i.x,
                                                            y: n
                                                        });
                                                    } else {
                                                        if (i.x <= g.x && i.y < h.y) {
                                                            let o = g.x + r;
                                                            let n;
                                                            if (h.y - i.y < r * 2) {
                                                                n = i.y + (h.y - i.y) / 2;
                                                            } else {
                                                                n = i.y + r;
                                                            }
                                                            points.push({
                                                                x: o,
                                                                y: g.y
                                                            });
                                                            points.push({
                                                                x: o,
                                                                y: n
                                                            });
                                                            points.push({
                                                                x: i.x,
                                                                y: n
                                                            });
                                                        } else {
                                                            let o;
                                                            let j = v.x + v.from;
                                                            if (j > g.x) {
                                                                o = j + r;
                                                            } else {
                                                                o = g.x + r;
                                                            }
                                                            let n;
                                                            if (i.y > h.y + h.h) {
                                                                n = i.y + r;
                                                            } else {
                                                                n = h.y + h.h + r;
                                                            }
                                                            points.push({
                                                                x: o,
                                                                y: g.y
                                                            });
                                                            points.push({
                                                                x: o,
                                                                y: n
                                                            });
                                                            points.push({
                                                                x: i.x,
                                                                y: n
                                                            });
                                                        }
                                                    }
                                                }
                                            } else {
                                                if (
                                                    (fromDir == 3 && toDir == 4) ||
                                                    (fromDir == 4 && toDir == 3)
                                                ) {
                                                    if (fromDir == 4) {
                                                        g = from;
                                                        i = to;
                                                        reverse = false;
                                                    } else {
                                                        g = to;
                                                        i = from;
                                                        reverse = true;
                                                    }
                                                    // let h = Model.getShapeById(g.id).props;
                                                    // let v = Model.getShapeById(i.id).props;
                                                    let h = g;
                                                    let v = i;
                                                    let j = v.x + v.from;
                                                    if (i.x < g.x && i.y < g.y) {
                                                        points.push({
                                                            x: i.x,
                                                            y: g.y
                                                        });
                                                    } else {
                                                        if (i.x < g.x && j < g.x) {
                                                            let o;
                                                            if (g.x - j < r * 2) {
                                                                o = j + (g.x - j) / 2;
                                                            } else {
                                                                o = g.x - r;
                                                            }
                                                            let n = i.y + r;
                                                            points.push({
                                                                x: o,
                                                                y: g.y
                                                            });
                                                            points.push({
                                                                x: o,
                                                                y: n
                                                            });
                                                            points.push({
                                                                x: i.x,
                                                                y: n
                                                            });
                                                        } else {
                                                            if (i.x >= g.x && i.y < h.y) {
                                                                let o = g.x - r;
                                                                let n;
                                                                if (h.y - i.y < r * 2) {
                                                                    n = i.y + (h.y - i.y) / 2;
                                                                } else {
                                                                    n = i.y + r;
                                                                }
                                                                points.push({
                                                                    x: o,
                                                                    y: g.y
                                                                });
                                                                points.push({
                                                                    x: o,
                                                                    y: n
                                                                });
                                                                points.push({
                                                                    x: i.x,
                                                                    y: n
                                                                });
                                                            } else {
                                                                let o;
                                                                if (v.x < g.x) {
                                                                    o = v.x - r;
                                                                } else {
                                                                    o = g.x - r;
                                                                }
                                                                let n;
                                                                if (i.y > h.y + h.h) {
                                                                    n = i.y + r;
                                                                } else {
                                                                    n = h.y + h.h + r;
                                                                }
                                                                points.push({
                                                                    x: o,
                                                                    y: g.y
                                                                });
                                                                points.push({
                                                                    x: o,
                                                                    y: n
                                                                });
                                                                points.push({
                                                                    x: i.x,
                                                                    y: n
                                                                });
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (reverse) {
                points.reverse();
            }
        } else {
            if (from.id != null || to.id != null) {
                let g, i, reverse, B;
                if (from.id != null) {
                    g = from;
                    i = to;
                    reverse = false;
                    B = from.angle;
                } else {
                    g = to;
                    i = from;
                    reverse = true;
                    B = to.angle;
                }
                // let e = Model.getShapeById(g.id).props;
                let e = from;
                if (B >= PI / 4 && B < (PI / 4) * 3) {
                    if (i.y < g.y) {
                        if (width >= height) {
                            points.push({
                                x: g.x,
                                y: i.y
                            });
                        } else {
                            let z = height / 2;
                            points.push({
                                x: g.x,
                                y: g.y - z
                            });
                            points.push({
                                x: i.x,
                                y: g.y - z
                            });
                        }
                    } else {
                        points.push({
                            x: g.x,
                            y: g.y - r
                        });
                        if (width >= height) {
                            if (i.x >= e.x - r && i.x <= e.x + e.from + r) {
                                let q = e.x + e.from / 2;
                                if (i.x < q) {
                                    points.push({
                                        x: e.x - r,
                                        y: g.y - r
                                    });
                                    points.push({
                                        x: e.x - r,
                                        y: i.y
                                    });
                                } else {
                                    points.push({
                                        x: e.x + e.from + r,
                                        y: g.y - r
                                    });
                                    points.push({
                                        x: e.x + e.from + r,
                                        y: i.y
                                    });
                                }
                            } else {
                                if (i.x < e.x) {
                                    points.push({
                                        x: i.x + r,
                                        y: g.y - r
                                    });
                                    points.push({
                                        x: i.x + r,
                                        y: i.y
                                    });
                                } else {
                                    points.push({
                                        x: i.x - r,
                                        y: g.y - r
                                    });
                                    points.push({
                                        x: i.x - r,
                                        y: i.y
                                    });
                                }
                            }
                        } else {
                            if (i.x >= e.x - r && i.x <= e.x + e.from + r) {
                                let q = e.x + e.from / 2;
                                if (i.x < q) {
                                    points.push({
                                        x: e.x - r,
                                        y: g.y - r
                                    });
                                    points.push({
                                        x: e.x - r,
                                        y: i.y - r
                                    });
                                    points.push({
                                        x: i.x,
                                        y: i.y - r
                                    });
                                } else {
                                    points.push({
                                        x: e.x + e.from + r,
                                        y: g.y - r
                                    });
                                    points.push({
                                        x: e.x + e.from + r,
                                        y: i.y - r
                                    });
                                    points.push({
                                        x: i.x,
                                        y: i.y - r
                                    });
                                }
                            } else {
                                points.push({
                                    x: i.x,
                                    y: g.y - r
                                });
                            }
                        }
                    }
                } else {
                    if (B >= (PI / 4) * 3 && B < (PI / 4) * 5) {
                        if (i.x > g.x) {
                            if (width >= height) {
                                let z = width / 2;
                                points.push({
                                    x: g.x + z,
                                    y: g.y
                                });
                                points.push({
                                    x: g.x + z,
                                    y: i.y
                                });
                            } else {
                                points.push({
                                    x: i.x,
                                    y: g.y
                                });
                            }
                        } else {
                            points.push({
                                x: g.x + r,
                                y: g.y
                            });
                            if (width >= height) {
                                if (i.y >= e.y - r && i.y <= e.y + e.h + r) {
                                    let q = e.y + e.h / 2;
                                    if (i.y < q) {
                                        points.push({
                                            x: g.x + r,
                                            y: e.y - r
                                        });
                                        points.push({
                                            x: i.x + r,
                                            y: e.y - r
                                        });
                                        points.push({
                                            x: i.x + r,
                                            y: i.y
                                        });
                                    } else {
                                        points.push({
                                            x: g.x + r,
                                            y: e.y + e.h + r
                                        });
                                        points.push({
                                            x: i.x + r,
                                            y: e.y + e.h + r
                                        });
                                        points.push({
                                            x: i.x + r,
                                            y: i.y
                                        });
                                    }
                                } else {
                                    points.push({
                                        x: g.x + r,
                                        y: i.y
                                    });
                                }
                            } else {
                                if (i.y >= e.y - r && i.y <= e.y + e.h + r) {
                                    let q = e.y + e.h / 2;
                                    if (i.y < q) {
                                        points.push({
                                            x: g.x + r,
                                            y: e.y - r
                                        });
                                        points.push({
                                            x: i.x,
                                            y: e.y - r
                                        });
                                    } else {
                                        points.push({
                                            x: g.x + r,
                                            y: e.y + e.h + r
                                        });
                                        points.push({
                                            x: i.x,
                                            y: e.y + e.h + r
                                        });
                                    }
                                } else {
                                    if (i.y < g.y) {
                                        points.push({
                                            x: g.x + r,
                                            y: i.y + r
                                        });
                                        points.push({
                                            x: i.x,
                                            y: i.y + r
                                        });
                                    } else {
                                        points.push({
                                            x: g.x + r,
                                            y: i.y - r
                                        });
                                        points.push({
                                            x: i.x,
                                            y: i.y - r
                                        });
                                    }
                                }
                            }
                        }
                    } else {
                        if (B >= (PI / 4) * 5 && B < (PI / 4) * 7) {
                            if (i.y > g.y) {
                                if (width >= height) {
                                    points.push({
                                        x: g.x,
                                        y: i.y
                                    });
                                } else {
                                    let z = height / 2;
                                    points.push({
                                        x: g.x,
                                        y: g.y + z
                                    });
                                    points.push({
                                        x: i.x,
                                        y: g.y + z
                                    });
                                }
                            } else {
                                points.push({
                                    x: g.x,
                                    y: g.y + r
                                });
                                if (width >= height) {
                                    if (i.x >= e.x - r && i.x <= e.x + e.from + r) {
                                        let q = e.x + e.from / 2;
                                        if (i.x < q) {
                                            points.push({
                                                x: e.x - r,
                                                y: g.y + r
                                            });
                                            points.push({
                                                x: e.x - r,
                                                y: i.y
                                            });
                                        } else {
                                            points.push({
                                                x: e.x + e.from + r,
                                                y: g.y + r
                                            });
                                            points.push({
                                                x: e.x + e.from + r,
                                                y: i.y
                                            });
                                        }
                                    } else {
                                        if (i.x < e.x) {
                                            points.push({
                                                x: i.x + r,
                                                y: g.y + r
                                            });
                                            points.push({
                                                x: i.x + r,
                                                y: i.y
                                            });
                                        } else {
                                            points.push({
                                                x: i.x - r,
                                                y: g.y + r
                                            });
                                            points.push({
                                                x: i.x - r,
                                                y: i.y
                                            });
                                        }
                                    }
                                } else {
                                    if (i.x >= e.x - r && i.x <= e.x + e.from + r) {
                                        let q = e.x + e.from / 2;
                                        if (i.x < q) {
                                            points.push({
                                                x: e.x - r,
                                                y: g.y + r
                                            });
                                            points.push({
                                                x: e.x - r,
                                                y: i.y + r
                                            });
                                            points.push({
                                                x: i.x,
                                                y: i.y + r
                                            });
                                        } else {
                                            points.push({
                                                x: e.x + e.from + r,
                                                y: g.y + r
                                            });
                                            points.push({
                                                x: e.x + e.from + r,
                                                y: i.y + r
                                            });
                                            points.push({
                                                x: i.x,
                                                y: i.y + r
                                            });
                                        }
                                    } else {
                                        points.push({
                                            x: i.x,
                                            y: g.y + r
                                        });
                                    }
                                }
                            }
                        } else {
                            if (i.x < g.x) {
                                if (width >= height) {
                                    let z = width / 2;
                                    points.push({
                                        x: g.x - z,
                                        y: g.y
                                    });
                                    points.push({
                                        x: g.x - z,
                                        y: i.y
                                    });
                                } else {
                                    points.push({
                                        x: i.x,
                                        y: g.y
                                    });
                                }
                            } else {
                                points.push({
                                    x: g.x - r,
                                    y: g.y
                                });
                                if (width >= height) {
                                    if (i.y >= e.y - r && i.y <= e.y + e.h + r) {
                                        let q = e.y + e.h / 2;
                                        if (i.y < q) {
                                            points.push({
                                                x: g.x - r,
                                                y: e.y - r
                                            });
                                            points.push({
                                                x: i.x - r,
                                                y: e.y - r
                                            });
                                            points.push({
                                                x: i.x - r,
                                                y: i.y
                                            });
                                        } else {
                                            points.push({
                                                x: g.x - r,
                                                y: e.y + e.h + r
                                            });
                                            points.push({
                                                x: i.x - r,
                                                y: e.y + e.h + r
                                            });
                                            points.push({
                                                x: i.x - r,
                                                y: i.y
                                            });
                                        }
                                    } else {
                                        points.push({
                                            x: g.x - r,
                                            y: i.y
                                        });
                                    }
                                } else {
                                    if (i.y >= e.y - r && i.y <= e.y + e.h + r) {
                                        let q = e.y + e.h / 2;
                                        if (i.y < q) {
                                            points.push({
                                                x: g.x - r,
                                                y: e.y - r
                                            });
                                            points.push({
                                                x: i.x,
                                                y: e.y - r
                                            });
                                        } else {
                                            points.push({
                                                x: g.x - r,
                                                y: e.y + e.h + r
                                            });
                                            points.push({
                                                x: i.x,
                                                y: e.y + e.h + r
                                            });
                                        }
                                    } else {
                                        if (i.y < g.y) {
                                            points.push({
                                                x: g.x - r,
                                                y: i.y + r
                                            });
                                            points.push({
                                                x: i.x,
                                                y: i.y + r
                                            });
                                        } else {
                                            points.push({
                                                x: g.x - r,
                                                y: i.y - r
                                            });
                                            points.push({
                                                x: i.x,
                                                y: i.y - r
                                            });
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                if (reverse) {
                    points.reverse();
                }
            } else {
                if (width >= height) {
                    let z = (to.x - from.x) / 2;
                    points.push({
                        x: from.x + z,
                        y: from.y
                    });
                    points.push({
                        x: from.x + z,
                        y: to.y
                    });
                } else {
                    let z = (to.y - from.y) / 2;
                    points.push({
                        x: from.x,
                        y: from.y + z
                    });
                    points.push({
                        x: to.x,
                        y: from.y + z
                    });
                }
            }
        }
        return points;
    },

    /**
     * 计算曲线参数
     *
     * @param {Object} bound
     */
    calcCurve(bound, source, target) {
        let points = [];
        let startingPoints = this.getStartingPoint(bound, source, target);
        let from = {
            x: startingPoints.from[0],
            y: startingPoints.from[1],
            type: source.type,
            angle: source.type === "ANCHOR" ? Link.angle["bottom"] : Link.angle[source.anchor]
        };
        let to = {
            x: startingPoints.to[0],
            y: startingPoints.to[1],
            type: target.type,
            angle: target.type === "ANCHOR" ? Link.angle["bottom"] : Link.angle[target.anchor]
        };

        let f = Util.distanceLine(from, to);
        let k = f * 0.4;
        function s(E, F) {
            if (E.type === "END_POINT") {
                return {
                    x: E.x - k * Math.cos(E.angle),
                    y: E.y - k * Math.sin(E.angle)
                };
            } else {
                let G = Math.abs(E.y - F.y);
                let y = Math.abs(E.x - F.x);
                let H = Math.atan(G / y);
                let x = {};
                if (E.x <= F.x) {
                    x.x = E.x + k * Math.cos(H);
                } else {
                    x.x = E.x - k * Math.cos(H);
                }
                if (E.y <= F.y) {
                    x.y = E.y + k * Math.sin(H);
                } else {
                    x.y = E.y - k * Math.sin(H);
                }
                return x;
            }
        }
        points.push(s(from, to));
        points.push(s(to, from));

        let linkerPoints = points.map(function(a) {
            return [a.x, a.y];
        });

        let results = [[from.x, from.y]];
        results = results.concat(linkerPoints);
        results.push([to.x, to.y]);

        return results;
    }
};

export default Link;
