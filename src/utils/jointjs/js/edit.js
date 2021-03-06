svgedit = {
  NS: {
    HTML: "http://www.w3.org/1999/xhtml",
    MATH: "http://www.w3.org/1998/Math/MathML",
    SE: "http://svg-edit.googlecode.com",
    SVG: "http://www.w3.org/2000/svg",
    XLINK: "http://www.w3.org/1999/xlink",
    XML: "http://www.w3.org/XML/1998/namespace",
    XMLNS: "http://www.w3.org/2000/xmlns/"
  }
};
svgedit.getReverseNS = function() {
  var a = {};
  $.each(this.NS, function(t, j) {
    a[j] = t.toLowerCase()
  });
  return a
};
(function() {
  var a = jQuery.fn.attr;
  jQuery.fn.attr = function(t, j) {
    var c, d = this.length;
    if (!d) return a.apply(this, arguments);
    for (c = 0; c < d; ++c) {
      var l = this[c];
      if (l.namespaceURI === "http://www.w3.org/2000/svg") {
        if (j !== undefined) l.setAttribute(t, j);
        else if ($.isArray(t)) {
          d = t.length;
          for (var h = {}; d--;) {
            var o = t[d];
            if ((c = l.getAttribute(o)) || c === "0") c = isNaN(c) ? c : c - 0;
            h[o] = c
          }
          return h
        }
        if (typeof t === "object") for (h in t) l.setAttribute(h, t[h]);
        else {
          if ((c = l.getAttribute(t)) || c === "0") c = isNaN(c) ? c : c - 0;
          return c
        }
      } else return a.apply(this, arguments)
    }
    return this
  }
})();
jQuery &&
function() {
  var a = $(window),
    t = $(document);
  $.extend($.fn, {
    contextMenu: function(j, c) {
      if (j.menu == undefined) return false;
      if (j.inSpeed == undefined) j.inSpeed = 150;
      if (j.outSpeed == undefined) j.outSpeed = 75;
      if (j.inSpeed == 0) j.inSpeed = -1;
      if (j.outSpeed == 0) j.outSpeed = -1;
      $(this).each(function() {
        var d = $(this),
          l = $(d).offset(),
          h = $("#" + j.menu);
        h.addClass("contextMenu");
        $(this).bind("mousedown", function(o) {
          $(this).mouseup(function(m) {
            var z = $(this);
            z.unbind("mouseup");
            if (o.button === 2 || j.allowLeft || o.ctrlKey && svgedit.browser.isMac()) {
              m.stopPropagation();
              $(".contextMenu").hide();
              if (d.hasClass("disabled")) return false;
              var s = m.pageX,
                F = m.pageY;
              m = a.width() - h.width();
              var A = a.height() - h.height();
              if (s > m - 15) s = m - 15;
              if (F > A - 30) F = A - 30;
              t.unbind("click");
              h.css({
                top: F,
                left: s
              }).fadeIn(j.inSpeed);
              h.find("A").mouseover(function() {
                h.find("LI.hover").removeClass("hover");
                $(this).parent().addClass("hover")
              }).mouseout(function() {
                h.find("LI.hover").removeClass("hover")
              });
              t.keypress(function(i) {
                switch (i.keyCode) {
                  case 38:
                    if (h.find("LI.hover").length) {
                      h.find("LI.hover").removeClass("hover").prevAll("LI:not(.disabled)").eq(0).addClass("hover");
                      h.find("LI.hover").length || h.find("LI:last").addClass("hover")
                    } else h.find("LI:last").addClass("hover");
                    break;
                  case 40:
                    if (h.find("LI.hover").length == 0) h.find("LI:first").addClass("hover");
                    else {
                      h.find("LI.hover").removeClass("hover").nextAll("LI:not(.disabled)").eq(0).addClass("hover");
                      h.find("LI.hover").length || h.find("LI:first").addClass("hover")
                    }
                    break;
                  case 13:
                    h.find("LI.hover A").trigger("click");
                    break;
                  case 27:
                    t.trigger("click")
                }
              });
              h.find("A").unbind("mouseup");
              h.find("LI:not(.disabled) A").mouseup(function() {
                t.unbind("click").unbind("keypress");
                $(".contextMenu").hide();
                c && c($(this).attr("href").substr(1), $(z), {
                  x: s - l.left,
                  y: F - l.top,
                  docX: s,
                  docY: F
                });
                return false
              });
              setTimeout(function() {
                t.click(function() {
                  t.unbind("click").unbind("keypress");
                  h.fadeOut(j.outSpeed);
                  return false
                })
              }, 0)
            }
          })
        });
        if ($.browser.mozilla) $("#" + j.menu).each(function() {
          $(this).css({
            MozUserSelect: "none"
          })
        });
        else $.browser.msie ? $("#" + j.menu).each(function() {
          $(this).bind("selectstart.disableTextSelect", function() {
            return false
          })
        }) : $("#" + j.menu).each(function() {
          $(this).bind("mousedown.disableTextSelect", function() {
            return false
          })
        });
        $(d).add($("UL.contextMenu")).bind("contextmenu", function() {
          return false
        })
      });
      return $(this)
    },
    disableContextMenuItems: function(j) {
      if (j == undefined) {
        $(this).find("LI").addClass("disabled");
        return $(this)
      }
      $(this).each(function() {
        if (j != undefined) for (var c = j.split(","), d = 0; d < c.length; d++) $(this).find('A[href="' + c[d] + '"]').parent().addClass("disabled")
      });
      return $(this)
    },
    enableContextMenuItems: function(j) {
      if (j == undefined) {
        $(this).find("LI.disabled").removeClass("disabled");
        return $(this)
      }
      $(this).each(function() {
        if (j != undefined) for (var c = j.split(","), d = 0; d < c.length; d++) $(this).find('A[href="' + c[d] + '"]').parent().removeClass("disabled")
      });
      return $(this)
    },
    disableContextMenu: function() {
      $(this).each(function() {
        $(this).addClass("disabled")
      });
      return $(this)
    },
    enableContextMenu: function() {
      $(this).each(function() {
        $(this).removeClass("disabled")
      });
      return $(this)
    },
    destroyContextMenu: function() {
      $(this).each(function() {
        $(this).unbind("mousedown").unbind("mouseup")
      });
      return $(this)
    }
  })
}(jQuery);
(function() {
  if (!window.SVGPathSeg) {
    window.SVGPathSeg = function(a, t, j) {
      this.pathSegType = a;
      this.pathSegTypeAsLetter = t;
      this._owningPathSegList = j
    };
    SVGPathSeg.PATHSEG_UNKNOWN = 0;
    SVGPathSeg.PATHSEG_CLOSEPATH = 1;
    SVGPathSeg.PATHSEG_MOVETO_ABS = 2;
    SVGPathSeg.PATHSEG_MOVETO_REL = 3;
    SVGPathSeg.PATHSEG_LINETO_ABS = 4;
    SVGPathSeg.PATHSEG_LINETO_REL = 5;
    SVGPathSeg.PATHSEG_CURVETO_CUBIC_ABS = 6;
    SVGPathSeg.PATHSEG_CURVETO_CUBIC_REL = 7;
    SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_ABS = 8;
    SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_REL = 9;
    SVGPathSeg.PATHSEG_ARC_ABS = 10;
    SVGPathSeg.PATHSEG_ARC_REL = 11;
    SVGPathSeg.PATHSEG_LINETO_HORIZONTAL_ABS = 12;
    SVGPathSeg.PATHSEG_LINETO_HORIZONTAL_REL = 13;
    SVGPathSeg.PATHSEG_LINETO_VERTICAL_ABS = 14;
    SVGPathSeg.PATHSEG_LINETO_VERTICAL_REL = 15;
    SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_ABS = 16;
    SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_REL = 17;
    SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_SMOOTH_ABS = 18;
    SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_SMOOTH_REL = 19;
    SVGPathSeg.prototype._segmentChanged = function() {
      this._owningPathSegList && this._owningPathSegList.segmentChanged(this)
    };
    window.SVGPathSegClosePath = function(a) {
      SVGPathSeg.call(this, SVGPathSeg.PATHSEG_CLOSEPATH, "z", a)
    };
    SVGPathSegClosePath.prototype = Object.create(SVGPathSeg.prototype);
    SVGPathSegClosePath.prototype.toString = function() {
      return "[object SVGPathSegClosePath]"
    };
    SVGPathSegClosePath.prototype._asPathString = function() {
      return this.pathSegTypeAsLetter
    };
    SVGPathSegClosePath.prototype.clone = function() {
      return new SVGPathSegClosePath(undefined)
    };
    window.SVGPathSegMovetoAbs = function(a, t, j) {
      SVGPathSeg.call(this, SVGPathSeg.PATHSEG_MOVETO_ABS, "M", a);
      this._x = t;
      this._y = j
    };
    SVGPathSegMovetoAbs.prototype = Object.create(SVGPathSeg.prototype);
    SVGPathSegMovetoAbs.prototype.toString = function() {
      return "[object SVGPathSegMovetoAbs]"
    };
    SVGPathSegMovetoAbs.prototype._asPathString = function() {
      return this.pathSegTypeAsLetter + " " + this._x + " " + this._y
    };
    SVGPathSegMovetoAbs.prototype.clone = function() {
      return new SVGPathSegMovetoAbs(undefined, this._x, this._y)
    };
    Object.defineProperty(SVGPathSegMovetoAbs.prototype, "x", {
      get: function() {
        return this._x
      },
      set: function(a) {
        this._x = a;
        this._segmentChanged()
      },
      enumerable: true
    });
    Object.defineProperty(SVGPathSegMovetoAbs.prototype, "y", {
      get: function() {
        return this._y
      },
      set: function(a) {
        this._y = a;
        this._segmentChanged()
      },
      enumerable: true
    });
    window.SVGPathSegMovetoRel = function(a, t, j) {
      SVGPathSeg.call(this, SVGPathSeg.PATHSEG_MOVETO_REL, "m", a);
      this._x = t;
      this._y = j
    };
    SVGPathSegMovetoRel.prototype = Object.create(SVGPathSeg.prototype);
    SVGPathSegMovetoRel.prototype.toString = function() {
      return "[object SVGPathSegMovetoRel]"
    };
    SVGPathSegMovetoRel.prototype._asPathString = function() {
      return this.pathSegTypeAsLetter + " " + this._x + " " + this._y
    };
    SVGPathSegMovetoRel.prototype.clone = function() {
      return new SVGPathSegMovetoRel(undefined, this._x, this._y)
    };
    Object.defineProperty(SVGPathSegMovetoRel.prototype, "x", {
      get: function() {
        return this._x
      },
      set: function(a) {
        this._x = a;
        this._segmentChanged()
      },
      enumerable: true
    });
    Object.defineProperty(SVGPathSegMovetoRel.prototype, "y", {
      get: function() {
        return this._y
      },
      set: function(a) {
        this._y = a;
        this._segmentChanged()
      },
      enumerable: true
    });
    window.SVGPathSegLinetoAbs = function(a, t, j) {
      SVGPathSeg.call(this, SVGPathSeg.PATHSEG_LINETO_ABS, "L", a);
      this._x = t;
      this._y = j
    };
    SVGPathSegLinetoAbs.prototype = Object.create(SVGPathSeg.prototype);
    SVGPathSegLinetoAbs.prototype.toString = function() {
      return "[object SVGPathSegLinetoAbs]"
    };
    SVGPathSegLinetoAbs.prototype._asPathString = function() {
      return this.pathSegTypeAsLetter + " " + this._x + " " + this._y
    };
    SVGPathSegLinetoAbs.prototype.clone = function() {
      return new SVGPathSegLinetoAbs(undefined, this._x, this._y)
    };
    Object.defineProperty(SVGPathSegLinetoAbs.prototype, "x", {
      get: function() {
        return this._x
      },
      set: function(a) {
        this._x = a;
        this._segmentChanged()
      },
      enumerable: true
    });
    Object.defineProperty(SVGPathSegLinetoAbs.prototype, "y", {
      get: function() {
        return this._y
      },
      set: function(a) {
        this._y = a;
        this._segmentChanged()
      },
      enumerable: true
    });
    window.SVGPathSegLinetoRel = function(a, t, j) {
      SVGPathSeg.call(this, SVGPathSeg.PATHSEG_LINETO_REL, "l", a);
      this._x = t;
      this._y = j
    };
    SVGPathSegLinetoRel.prototype = Object.create(SVGPathSeg.prototype);
    SVGPathSegLinetoRel.prototype.toString = function() {
      return "[object SVGPathSegLinetoRel]"
    };
    SVGPathSegLinetoRel.prototype._asPathString = function() {
      return this.pathSegTypeAsLetter + " " + this._x + " " + this._y
    };
    SVGPathSegLinetoRel.prototype.clone = function() {
      return new SVGPathSegLinetoRel(undefined, this._x, this._y)
    };
    Object.defineProperty(SVGPathSegLinetoRel.prototype, "x", {
      get: function() {
        return this._x
      },
      set: function(a) {
        this._x = a;
        this._segmentChanged()
      },
      enumerable: true
    });
    Object.defineProperty(SVGPathSegLinetoRel.prototype, "y", {
      get: function() {
        return this._y
      },
      set: function(a) {
        this._y = a;
        this._segmentChanged()
      },
      enumerable: true
    });
    window.SVGPathSegCurvetoCubicAbs = function(a, t, j, c, d, l, h) {
      SVGPathSeg.call(this, SVGPathSeg.PATHSEG_CURVETO_CUBIC_ABS, "C", a);
      this._x = t;
      this._y = j;
      this._x1 = c;
      this._y1 = d;
      this._x2 = l;
      this._y2 = h
    };
    SVGPathSegCurvetoCubicAbs.prototype = Object.create(SVGPathSeg.prototype);
    SVGPathSegCurvetoCubicAbs.prototype.toString = function() {
      return "[object SVGPathSegCurvetoCubicAbs]"
    };
    SVGPathSegCurvetoCubicAbs.prototype._asPathString = function() {
      return this.pathSegTypeAsLetter + " " + this._x1 + " " + this._y1 + " " + this._x2 + " " + this._y2 + " " + this._x + " " + this._y
    };
    SVGPathSegCurvetoCubicAbs.prototype.clone = function() {
      return new SVGPathSegCurvetoCubicAbs(undefined, this._x, this._y, this._x1, this._y1, this._x2, this._y2)
    };
    Object.defineProperty(SVGPathSegCurvetoCubicAbs.prototype, "x", {
      get: function() {
        return this._x
      },
      set: function(a) {
        this._x = a;
        this._segmentChanged()
      },
      enumerable: true
    });
    Object.defineProperty(SVGPathSegCurvetoCubicAbs.prototype, "y", {
      get: function() {
        return this._y
      },
      set: function(a) {
        this._y = a;
        this._segmentChanged()
      },
      enumerable: true
    });
    Object.defineProperty(SVGPathSegCurvetoCubicAbs.prototype, "x1", {
      get: function() {
        return this._x1
      },
      set: function(a) {
        this._x1 = a;
        this._segmentChanged()
      },
      enumerable: true
    });
    Object.defineProperty(SVGPathSegCurvetoCubicAbs.prototype, "y1", {
      get: function() {
        return this._y1
      },
      set: function(a) {
        this._y1 = a;
        this._segmentChanged()
      },
      enumerable: true
    });
    Object.defineProperty(SVGPathSegCurvetoCubicAbs.prototype, "x2", {
      get: function() {
        return this._x2
      },
      set: function(a) {
        this._x2 = a;
        this._segmentChanged()
      },
      enumerable: true
    });
    Object.defineProperty(SVGPathSegCurvetoCubicAbs.prototype, "y2", {
      get: function() {
        return this._y2
      },
      set: function(a) {
        this._y2 = a;
        this._segmentChanged()
      },
      enumerable: true
    });
    window.SVGPathSegCurvetoCubicRel = function(a, t, j, c, d, l, h) {
      SVGPathSeg.call(this, SVGPathSeg.PATHSEG_CURVETO_CUBIC_REL, "c", a);
      this._x = t;
      this._y = j;
      this._x1 = c;
      this._y1 = d;
      this._x2 = l;
      this._y2 = h
    };
    SVGPathSegCurvetoCubicRel.prototype = Object.create(SVGPathSeg.prototype);
    SVGPathSegCurvetoCubicRel.prototype.toString = function() {
      return "[object SVGPathSegCurvetoCubicRel]"
    };
    SVGPathSegCurvetoCubicRel.prototype._asPathString = function() {
      return this.pathSegTypeAsLetter + " " + this._x1 + " " + this._y1 + " " + this._x2 + " " + this._y2 + " " + this._x + " " + this._y
    };
    SVGPathSegCurvetoCubicRel.prototype.clone = function() {
      return new SVGPathSegCurvetoCubicRel(undefined, this._x, this._y, this._x1, this._y1, this._x2, this._y2)
    };
    Object.defineProperty(SVGPathSegCurvetoCubicRel.prototype, "x", {
      get: function() {
        return this._x
      },
      set: function(a) {
        this._x = a;
        this._segmentChanged()
      },
      enumerable: true
    });
    Object.defineProperty(SVGPathSegCurvetoCubicRel.prototype, "y", {
      get: function() {
        return this._y
      },
      set: function(a) {
        this._y = a;
        this._segmentChanged()
      },
      enumerable: true
    });
    Object.defineProperty(SVGPathSegCurvetoCubicRel.prototype, "x1", {
      get: function() {
        return this._x1
      },
      set: function(a) {
        this._x1 = a;
        this._segmentChanged()
      },
      enumerable: true
    });
    Object.defineProperty(SVGPathSegCurvetoCubicRel.prototype, "y1", {
      get: function() {
        return this._y1
      },
      set: function(a) {
        this._y1 = a;
        this._segmentChanged()
      },
      enumerable: true
    });
    Object.defineProperty(SVGPathSegCurvetoCubicRel.prototype, "x2", {
      get: function() {
        return this._x2
      },
      set: function(a) {
        this._x2 = a;
        this._segmentChanged()
      },
      enumerable: true
    });
    Object.defineProperty(SVGPathSegCurvetoCubicRel.prototype, "y2", {
      get: function() {
        return this._y2
      },
      set: function(a) {
        this._y2 = a;
        this._segmentChanged()
      },
      enumerable: true
    });
    window.SVGPathSegCurvetoQuadraticAbs = function(a, t, j, c, d) {
      SVGPathSeg.call(this, SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_ABS, "Q", a);
      this._x = t;
      this._y = j;
      this._x1 = c;
      this._y1 = d
    };
    SVGPathSegCurvetoQuadraticAbs.prototype = Object.create(SVGPathSeg.prototype);
    SVGPathSegCurvetoQuadraticAbs.prototype.toString = function() {
      return "[object SVGPathSegCurvetoQuadraticAbs]"
    };
    SVGPathSegCurvetoQuadraticAbs.prototype._asPathString = function() {
      return this.pathSegTypeAsLetter + " " + this._x1 + " " + this._y1 + " " + this._x + " " + this._y
    };
    SVGPathSegCurvetoQuadraticAbs.prototype.clone = function() {
      return new SVGPathSegCurvetoQuadraticAbs(undefined, this._x, this._y, this._x1, this._y1)
    };
    Object.defineProperty(SVGPathSegCurvetoQuadraticAbs.prototype, "x", {
      get: function() {
        return this._x
      },
      set: function(a) {
        this._x = a;
        this._segmentChanged()
      },
      enumerable: true
    });
    Object.defineProperty(SVGPathSegCurvetoQuadraticAbs.prototype, "y", {
      get: function() {
        return this._y
      },
      set: function(a) {
        this._y = a;
        this._segmentChanged()
      },
      enumerable: true
    });
    Object.defineProperty(SVGPathSegCurvetoQuadraticAbs.prototype, "x1", {
      get: function() {
        return this._x1
      },
      set: function(a) {
        this._x1 = a;
        this._segmentChanged()
      },
      enumerable: true
    });
    Object.defineProperty(SVGPathSegCurvetoQuadraticAbs.prototype, "y1", {
      get: function() {
        return this._y1
      },
      set: function(a) {
        this._y1 = a;
        this._segmentChanged()
      },
      enumerable: true
    });
    window.SVGPathSegCurvetoQuadraticRel = function(a, t, j, c, d) {
      SVGPathSeg.call(this, SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_REL, "q", a);
      this._x = t;
      this._y = j;
      this._x1 = c;
      this._y1 = d
    };
    SVGPathSegCurvetoQuadraticRel.prototype = Object.create(SVGPathSeg.prototype);
    SVGPathSegCurvetoQuadraticRel.prototype.toString = function() {
      return "[object SVGPathSegCurvetoQuadraticRel]"
    };
    SVGPathSegCurvetoQuadraticRel.prototype._asPathString = function() {
      return this.pathSegTypeAsLetter + " " + this._x1 + " " + this._y1 + " " + this._x + " " + this._y
    };
    SVGPathSegCurvetoQuadraticRel.prototype.clone = function() {
      return new SVGPathSegCurvetoQuadraticRel(undefined, this._x, this._y, this._x1, this._y1)
    };
    Object.defineProperty(SVGPathSegCurvetoQuadraticRel.prototype, "x", {
      get: function() {
        return this._x
      },
      set: function(a) {
        this._x = a;
        this._segmentChanged()
      },
      enumerable: true
    });
    Object.defineProperty(SVGPathSegCurvetoQuadraticRel.prototype, "y", {
      get: function() {
        return this._y
      },
      set: function(a) {
        this._y = a;
        this._segmentChanged()
      },
      enumerable: true
    });
    Object.defineProperty(SVGPathSegCurvetoQuadraticRel.prototype, "x1", {
      get: function() {
        return this._x1
      },
      set: function(a) {
        this._x1 = a;
        this._segmentChanged()
      },
      enumerable: true
    });
    Object.defineProperty(SVGPathSegCurvetoQuadraticRel.prototype, "y1", {
      get: function() {
        return this._y1
      },
      set: function(a) {
        this._y1 = a;
        this._segmentChanged()
      },
      enumerable: true
    });
    window.SVGPathSegArcAbs = function(a, t, j, c, d, l, h, o) {
      SVGPathSeg.call(this, SVGPathSeg.PATHSEG_ARC_ABS, "A", a);
      this._x = t;
      this._y = j;
      this._r1 = c;
      this._r2 = d;
      this._angle = l;
      this._largeArcFlag = h;
      this._sweepFlag = o
    };
    SVGPathSegArcAbs.prototype = Object.create(SVGPathSeg.prototype);
    SVGPathSegArcAbs.prototype.toString = function() {
      return "[object SVGPathSegArcAbs]"
    };
    SVGPathSegArcAbs.prototype._asPathString = function() {
      return this.pathSegTypeAsLetter + " " + this._r1 + " " + this._r2 + " " + this._angle + " " + (this._largeArcFlag ? "1" : "0") + " " + (this._sweepFlag ? "1" : "0") + " " + this._x + " " + this._y
    };
    SVGPathSegArcAbs.prototype.clone = function() {
      return new SVGPathSegArcAbs(undefined, this._x, this._y, this._r1, this._r2, this._angle, this._largeArcFlag, this._sweepFlag)
    };
    Object.defineProperty(SVGPathSegArcAbs.prototype, "x", {
      get: function() {
        return this._x
      },
      set: function(a) {
        this._x = a;
        this._segmentChanged()
      },
      enumerable: true
    });
    Object.defineProperty(SVGPathSegArcAbs.prototype, "y", {
      get: function() {
        return this._y
      },
      set: function(a) {
        this._y = a;
        this._segmentChanged()
      },
      enumerable: true
    });
    Object.defineProperty(SVGPathSegArcAbs.prototype, "r1", {
      get: function() {
        return this._r1
      },
      set: function(a) {
        this._r1 = a;
        this._segmentChanged()
      },
      enumerable: true
    });
    Object.defineProperty(SVGPathSegArcAbs.prototype, "r2", {
      get: function() {
        return this._r2
      },
      set: function(a) {
        this._r2 = a;
        this._segmentChanged()
      },
      enumerable: true
    });
    Object.defineProperty(SVGPathSegArcAbs.prototype, "angle", {
      get: function() {
        return this._angle
      },
      set: function(a) {
        this._angle = a;
        this._segmentChanged()
      },
      enumerable: true
    });
    Object.defineProperty(SVGPathSegArcAbs.prototype, "largeArcFlag", {
      get: function() {
        return this._largeArcFlag
      },
      set: function(a) {
        this._largeArcFlag = a;
        this._segmentChanged()
      },
      enumerable: true
    });
    Object.defineProperty(SVGPathSegArcAbs.prototype, "sweepFlag", {
      get: function() {
        return this._sweepFlag
      },
      set: function(a) {
        this._sweepFlag = a;
        this._segmentChanged()
      },
      enumerable: true
    });
    window.SVGPathSegArcRel = function(a, t, j, c, d, l, h, o) {
      SVGPathSeg.call(this, SVGPathSeg.PATHSEG_ARC_REL, "a", a);
      this._x = t;
      this._y = j;
      this._r1 = c;
      this._r2 = d;
      this._angle = l;
      this._largeArcFlag = h;
      this._sweepFlag = o
    };
    SVGPathSegArcRel.prototype = Object.create(SVGPathSeg.prototype);
    SVGPathSegArcRel.prototype.toString = function() {
      return "[object SVGPathSegArcRel]"
    };
    SVGPathSegArcRel.prototype._asPathString = function() {
      return this.pathSegTypeAsLetter + " " + this._r1 + " " + this._r2 + " " + this._angle + " " + (this._largeArcFlag ? "1" : "0") + " " + (this._sweepFlag ? "1" : "0") + " " + this._x + " " + this._y
    };
    SVGPathSegArcRel.prototype.clone = function() {
      return new SVGPathSegArcRel(undefined, this._x, this._y, this._r1, this._r2, this._angle, this._largeArcFlag, this._sweepFlag)
    };
    Object.defineProperty(SVGPathSegArcRel.prototype, "x", {
      get: function() {
        return this._x
      },
      set: function(a) {
        this._x = a;
        this._segmentChanged()
      },
      enumerable: true
    });
    Object.defineProperty(SVGPathSegArcRel.prototype, "y", {
      get: function() {
        return this._y
      },
      set: function(a) {
        this._y = a;
        this._segmentChanged()
      },
      enumerable: true
    });
    Object.defineProperty(SVGPathSegArcRel.prototype, "r1", {
      get: function() {
        return this._r1
      },
      set: function(a) {
        this._r1 = a;
        this._segmentChanged()
      },
      enumerable: true
    });
    Object.defineProperty(SVGPathSegArcRel.prototype, "r2", {
      get: function() {
        return this._r2
      },
      set: function(a) {
        this._r2 = a;
        this._segmentChanged()
      },
      enumerable: true
    });
    Object.defineProperty(SVGPathSegArcRel.prototype, "angle", {
      get: function() {
        return this._angle
      },
      set: function(a) {
        this._angle = a;
        this._segmentChanged()
      },
      enumerable: true
    });
    Object.defineProperty(SVGPathSegArcRel.prototype, "largeArcFlag", {
      get: function() {
        return this._largeArcFlag
      },
      set: function(a) {
        this._largeArcFlag = a;
        this._segmentChanged()
      },
      enumerable: true
    });
    Object.defineProperty(SVGPathSegArcRel.prototype, "sweepFlag", {
      get: function() {
        return this._sweepFlag
      },
      set: function(a) {
        this._sweepFlag = a;
        this._segmentChanged()
      },
      enumerable: true
    });
    window.SVGPathSegLinetoHorizontalAbs = function(a, t) {
      SVGPathSeg.call(this, SVGPathSeg.PATHSEG_LINETO_HORIZONTAL_ABS, "H", a);
      this._x = t
    };
    SVGPathSegLinetoHorizontalAbs.prototype = Object.create(SVGPathSeg.prototype);
    SVGPathSegLinetoHorizontalAbs.prototype.toString = function() {
      return "[object SVGPathSegLinetoHorizontalAbs]"
    };
    SVGPathSegLinetoHorizontalAbs.prototype._asPathString = function() {
      return this.pathSegTypeAsLetter + " " + this._x
    };
    SVGPathSegLinetoHorizontalAbs.prototype.clone = function() {
      return new SVGPathSegLinetoHorizontalAbs(undefined, this._x)
    };
    Object.defineProperty(SVGPathSegLinetoHorizontalAbs.prototype, "x", {
      get: function() {
        return this._x
      },
      set: function(a) {
        this._x = a;
        this._segmentChanged()
      },
      enumerable: true
    });
    window.SVGPathSegLinetoHorizontalRel = function(a, t) {
      SVGPathSeg.call(this, SVGPathSeg.PATHSEG_LINETO_HORIZONTAL_REL, "h", a);
      this._x = t
    };
    SVGPathSegLinetoHorizontalRel.prototype = Object.create(SVGPathSeg.prototype);
    SVGPathSegLinetoHorizontalRel.prototype.toString = function() {
      return "[object SVGPathSegLinetoHorizontalRel]"
    };
    SVGPathSegLinetoHorizontalRel.prototype._asPathString = function() {
      return this.pathSegTypeAsLetter + " " + this._x
    };
    SVGPathSegLinetoHorizontalRel.prototype.clone = function() {
      return new SVGPathSegLinetoHorizontalRel(undefined, this._x)
    };
    Object.defineProperty(SVGPathSegLinetoHorizontalRel.prototype, "x", {
      get: function() {
        return this._x
      },
      set: function(a) {
        this._x = a;
        this._segmentChanged()
      },
      enumerable: true
    });
    window.SVGPathSegLinetoVerticalAbs = function(a, t) {
      SVGPathSeg.call(this, SVGPathSeg.PATHSEG_LINETO_VERTICAL_ABS, "V", a);
      this._y = t
    };
    SVGPathSegLinetoVerticalAbs.prototype = Object.create(SVGPathSeg.prototype);
    SVGPathSegLinetoVerticalAbs.prototype.toString = function() {
      return "[object SVGPathSegLinetoVerticalAbs]"
    };
    SVGPathSegLinetoVerticalAbs.prototype._asPathString = function() {
      return this.pathSegTypeAsLetter + " " + this._y
    };
    SVGPathSegLinetoVerticalAbs.prototype.clone = function() {
      return new SVGPathSegLinetoVerticalAbs(undefined, this._y)
    };
    Object.defineProperty(SVGPathSegLinetoVerticalAbs.prototype, "y", {
      get: function() {
        return this._y
      },
      set: function(a) {
        this._y = a;
        this._segmentChanged()
      },
      enumerable: true
    });
    window.SVGPathSegLinetoVerticalRel = function(a, t) {
      SVGPathSeg.call(this, SVGPathSeg.PATHSEG_LINETO_VERTICAL_REL, "v", a);
      this._y = t
    };
    SVGPathSegLinetoVerticalRel.prototype = Object.create(SVGPathSeg.prototype);
    SVGPathSegLinetoVerticalRel.prototype.toString = function() {
      return "[object SVGPathSegLinetoVerticalRel]"
    };
    SVGPathSegLinetoVerticalRel.prototype._asPathString = function() {
      return this.pathSegTypeAsLetter + " " + this._y
    };
    SVGPathSegLinetoVerticalRel.prototype.clone = function() {
      return new SVGPathSegLinetoVerticalRel(undefined, this._y)
    };
    Object.defineProperty(SVGPathSegLinetoVerticalRel.prototype, "y", {
      get: function() {
        return this._y
      },
      set: function(a) {
        this._y = a;
        this._segmentChanged()
      },
      enumerable: true
    });
    window.SVGPathSegCurvetoCubicSmoothAbs = function(a, t, j, c, d) {
      SVGPathSeg.call(this, SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_ABS, "S", a);
      this._x = t;
      this._y = j;
      this._x2 = c;
      this._y2 = d
    };
    SVGPathSegCurvetoCubicSmoothAbs.prototype = Object.create(SVGPathSeg.prototype);
    SVGPathSegCurvetoCubicSmoothAbs.prototype.toString = function() {
      return "[object SVGPathSegCurvetoCubicSmoothAbs]"
    };
    SVGPathSegCurvetoCubicSmoothAbs.prototype._asPathString = function() {
      return this.pathSegTypeAsLetter + " " + this._x2 + " " + this._y2 + " " + this._x + " " + this._y
    };
    SVGPathSegCurvetoCubicSmoothAbs.prototype.clone = function() {
      return new SVGPathSegCurvetoCubicSmoothAbs(undefined, this._x, this._y, this._x2, this._y2)
    };
    Object.defineProperty(SVGPathSegCurvetoCubicSmoothAbs.prototype, "x", {
      get: function() {
        return this._x
      },
      set: function(a) {
        this._x = a;
        this._segmentChanged()
      },
      enumerable: true
    });
    Object.defineProperty(SVGPathSegCurvetoCubicSmoothAbs.prototype, "y", {
      get: function() {
        return this._y
      },
      set: function(a) {
        this._y = a;
        this._segmentChanged()
      },
      enumerable: true
    });
    Object.defineProperty(SVGPathSegCurvetoCubicSmoothAbs.prototype, "x2", {
      get: function() {
        return this._x2
      },
      set: function(a) {
        this._x2 = a;
        this._segmentChanged()
      },
      enumerable: true
    });
    Object.defineProperty(SVGPathSegCurvetoCubicSmoothAbs.prototype, "y2", {
      get: function() {
        return this._y2
      },
      set: function(a) {
        this._y2 = a;
        this._segmentChanged()
      },
      enumerable: true
    });
    window.SVGPathSegCurvetoCubicSmoothRel = function(a, t, j, c, d) {
      SVGPathSeg.call(this, SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_REL, "s", a);
      this._x = t;
      this._y = j;
      this._x2 = c;
      this._y2 = d
    };
    SVGPathSegCurvetoCubicSmoothRel.prototype = Object.create(SVGPathSeg.prototype);
    SVGPathSegCurvetoCubicSmoothRel.prototype.toString = function() {
      return "[object SVGPathSegCurvetoCubicSmoothRel]"
    };
    SVGPathSegCurvetoCubicSmoothRel.prototype._asPathString = function() {
      return this.pathSegTypeAsLetter + " " + this._x2 + " " + this._y2 + " " + this._x + " " + this._y
    };
    SVGPathSegCurvetoCubicSmoothRel.prototype.clone = function() {
      return new SVGPathSegCurvetoCubicSmoothRel(undefined, this._x, this._y, this._x2, this._y2)
    };
    Object.defineProperty(SVGPathSegCurvetoCubicSmoothRel.prototype, "x", {
      get: function() {
        return this._x
      },
      set: function(a) {
        this._x = a;
        this._segmentChanged()
      },
      enumerable: true
    });
    Object.defineProperty(SVGPathSegCurvetoCubicSmoothRel.prototype, "y", {
      get: function() {
        return this._y
      },
      set: function(a) {
        this._y = a;
        this._segmentChanged()
      },
      enumerable: true
    });
    Object.defineProperty(SVGPathSegCurvetoCubicSmoothRel.prototype, "x2", {
      get: function() {
        return this._x2
      },
      set: function(a) {
        this._x2 = a;
        this._segmentChanged()
      },
      enumerable: true
    });
    Object.defineProperty(SVGPathSegCurvetoCubicSmoothRel.prototype, "y2", {
      get: function() {
        return this._y2
      },
      set: function(a) {
        this._y2 = a;
        this._segmentChanged()
      },
      enumerable: true
    });
    window.SVGPathSegCurvetoQuadraticSmoothAbs = function(a, t, j) {
      SVGPathSeg.call(this, SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_SMOOTH_ABS, "T", a);
      this._x = t;
      this._y = j
    };
    SVGPathSegCurvetoQuadraticSmoothAbs.prototype = Object.create(SVGPathSeg.prototype);
    SVGPathSegCurvetoQuadraticSmoothAbs.prototype.toString = function() {
      return "[object SVGPathSegCurvetoQuadraticSmoothAbs]"
    };
    SVGPathSegCurvetoQuadraticSmoothAbs.prototype._asPathString = function() {
      return this.pathSegTypeAsLetter + " " + this._x + " " + this._y
    };
    SVGPathSegCurvetoQuadraticSmoothAbs.prototype.clone = function() {
      return new SVGPathSegCurvetoQuadraticSmoothAbs(undefined, this._x, this._y)
    };
    Object.defineProperty(SVGPathSegCurvetoQuadraticSmoothAbs.prototype, "x", {
      get: function() {
        return this._x
      },
      set: function(a) {
        this._x = a;
        this._segmentChanged()
      },
      enumerable: true
    });
    Object.defineProperty(SVGPathSegCurvetoQuadraticSmoothAbs.prototype, "y", {
      get: function() {
        return this._y
      },
      set: function(a) {
        this._y = a;
        this._segmentChanged()
      },
      enumerable: true
    });
    window.SVGPathSegCurvetoQuadraticSmoothRel = function(a, t, j) {
      SVGPathSeg.call(this, SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_SMOOTH_REL, "t", a);
      this._x = t;
      this._y = j
    };
    SVGPathSegCurvetoQuadraticSmoothRel.prototype = Object.create(SVGPathSeg.prototype);
    SVGPathSegCurvetoQuadraticSmoothRel.prototype.toString = function() {
      return "[object SVGPathSegCurvetoQuadraticSmoothRel]"
    };
    SVGPathSegCurvetoQuadraticSmoothRel.prototype._asPathString = function() {
      return this.pathSegTypeAsLetter + " " + this._x + " " + this._y
    };
    SVGPathSegCurvetoQuadraticSmoothRel.prototype.clone = function() {
      return new SVGPathSegCurvetoQuadraticSmoothRel(undefined, this._x, this._y)
    };
    Object.defineProperty(SVGPathSegCurvetoQuadraticSmoothRel.prototype, "x", {
      get: function() {
        return this._x
      },
      set: function(a) {
        this._x = a;
        this._segmentChanged()
      },
      enumerable: true
    });
    Object.defineProperty(SVGPathSegCurvetoQuadraticSmoothRel.prototype, "y", {
      get: function() {
        return this._y
      },
      set: function(a) {
        this._y = a;
        this._segmentChanged()
      },
      enumerable: true
    });
    SVGPathElement.prototype.createSVGPathSegClosePath = function() {
      return new SVGPathSegClosePath(undefined)
    };
    SVGPathElement.prototype.createSVGPathSegMovetoAbs = function(a, t) {
      return new SVGPathSegMovetoAbs(undefined, a, t)
    };
    SVGPathElement.prototype.createSVGPathSegMovetoRel = function(a, t) {
      return new SVGPathSegMovetoRel(undefined, a, t)
    };
    SVGPathElement.prototype.createSVGPathSegLinetoAbs = function(a, t) {
      return new SVGPathSegLinetoAbs(undefined, a, t)
    };
    SVGPathElement.prototype.createSVGPathSegLinetoRel = function(a, t) {
      return new SVGPathSegLinetoRel(undefined, a, t)
    };
    SVGPathElement.prototype.createSVGPathSegCurvetoCubicAbs = function(a, t, j, c, d, l) {
      return new SVGPathSegCurvetoCubicAbs(undefined, a, t, j, c, d, l)
    };
    SVGPathElement.prototype.createSVGPathSegCurvetoCubicRel = function(a, t, j, c, d, l) {
      return new SVGPathSegCurvetoCubicRel(undefined, a, t, j, c, d, l)
    };
    SVGPathElement.prototype.createSVGPathSegCurvetoQuadraticAbs = function(a, t, j, c) {
      return new SVGPathSegCurvetoQuadraticAbs(undefined, a, t, j, c)
    };
    SVGPathElement.prototype.createSVGPathSegCurvetoQuadraticRel = function(a, t, j, c) {
      return new SVGPathSegCurvetoQuadraticRel(undefined, a, t, j, c)
    };
    SVGPathElement.prototype.createSVGPathSegArcAbs = function(a, t, j, c, d, l, h) {
      return new SVGPathSegArcAbs(undefined, a, t, j, c, d, l, h)
    };
    SVGPathElement.prototype.createSVGPathSegArcRel = function(a, t, j, c, d, l, h) {
      return new SVGPathSegArcRel(undefined, a, t, j, c, d, l, h)
    };
    SVGPathElement.prototype.createSVGPathSegLinetoHorizontalAbs = function(a) {
      return new SVGPathSegLinetoHorizontalAbs(undefined, a)
    };
    SVGPathElement.prototype.createSVGPathSegLinetoHorizontalRel = function(a) {
      return new SVGPathSegLinetoHorizontalRel(undefined, a)
    };
    SVGPathElement.prototype.createSVGPathSegLinetoVerticalAbs = function(a) {
      return new SVGPathSegLinetoVerticalAbs(undefined, a)
    };
    SVGPathElement.prototype.createSVGPathSegLinetoVerticalRel = function(a) {
      return new SVGPathSegLinetoVerticalRel(undefined, a)
    };
    SVGPathElement.prototype.createSVGPathSegCurvetoCubicSmoothAbs = function(a, t, j, c) {
      return new SVGPathSegCurvetoCubicSmoothAbs(undefined, a, t, j, c)
    };
    SVGPathElement.prototype.createSVGPathSegCurvetoCubicSmoothRel = function(a, t, j, c) {
      return new SVGPathSegCurvetoCubicSmoothRel(undefined, a, t, j, c)
    };
    SVGPathElement.prototype.createSVGPathSegCurvetoQuadraticSmoothAbs = function(a, t) {
      return new SVGPathSegCurvetoQuadraticSmoothAbs(undefined, a, t)
    };
    SVGPathElement.prototype.createSVGPathSegCurvetoQuadraticSmoothRel = function(a, t) {
      return new SVGPathSegCurvetoQuadraticSmoothRel(undefined, a, t)
    }
  }
  if (!window.SVGPathSegList) {
    window.SVGPathSegList = function(a) {
      this._pathElement = a;
      this._list = this._parsePath(this._pathElement.getAttribute("d"));
      this._mutationObserverConfig = {
        attributes: true,
        attributeFilter: ["d"]
      };
      this._pathElementMutationObserver = new MutationObserver(this._updateListFromPathMutations.bind(this));
      this._pathElementMutationObserver.observe(this._pathElement, this._mutationObserverConfig)
    };
    Object.defineProperty(SVGPathSegList.prototype, "numberOfItems", {
      get: function() {
        this._checkPathSynchronizedToList();
        return this._list.length
      }
    });
    SVGPathSegList.prototype._checkPathSynchronizedToList = function() {
      this._updateListFromPathMutations(this._pathElementMutationObserver.takeRecords())
    };
    SVGPathSegList.prototype._updateListFromPathMutations = function(a) {
      if (this._pathElement) {
        var t = false;
        a.forEach(function(j) {
          if (j.attributeName == "d") t = true
        });
        if (t) this._list = this._parsePath(this._pathElement.getAttribute("d"))
      }
    };
    SVGPathSegList.prototype._writeListToPath = function() {
      this._pathElementMutationObserver.disconnect();
      this._pathElement.setAttribute("d", SVGPathSegList._pathSegArrayAsString(this._list));
      this._pathElementMutationObserver.observe(this._pathElement, this._mutationObserverConfig)
    };
    SVGPathSegList.prototype.segmentChanged = function() {
      this._writeListToPath()
    };
    SVGPathSegList.prototype.clear = function() {
      this._checkPathSynchronizedToList();
      this._list.forEach(function(a) {
        a._owningPathSegList = null
      });
      this._list = [];
      this._writeListToPath()
    };
    SVGPathSegList.prototype.initialize = function(a) {
      this._checkPathSynchronizedToList();
      this._list = [a];
      a._owningPathSegList = this;
      this._writeListToPath();
      return a
    };
    SVGPathSegList.prototype._checkValidIndex = function(a) {
      if (isNaN(a) || a < 0 || a >= this.numberOfItems) throw "INDEX_SIZE_ERR";
    };
    SVGPathSegList.prototype.getItem = function(a) {
      this._checkPathSynchronizedToList();
      this._checkValidIndex(a);
      return this._list[a]
    };
    SVGPathSegList.prototype.insertItemBefore = function(a, t) {
      this._checkPathSynchronizedToList();
      if (t > this.numberOfItems) t = this.numberOfItems;
      if (a._owningPathSegList) a = a.clone();
      this._list.splice(t, 0, a);
      a._owningPathSegList = this;
      this._writeListToPath();
      return a
    };
    SVGPathSegList.prototype.replaceItem = function(a, t) {
      this._checkPathSynchronizedToList();
      if (a._owningPathSegList) a = a.clone();
      this._checkValidIndex(t);
      this._list[t] = a;
      a._owningPathSegList = this;
      this._writeListToPath();
      return a
    };
    SVGPathSegList.prototype.removeItem = function(a) {
      this._checkPathSynchronizedToList();
      this._checkValidIndex(a);
      var t = this._list[a];
      this._list.splice(a, 1);
      this._writeListToPath();
      return t
    };
    SVGPathSegList.prototype.appendItem = function(a) {
      this._checkPathSynchronizedToList();
      if (a._owningPathSegList) a = a.clone();
      this._list.push(a);
      a._owningPathSegList = this;
      this._writeListToPath();
      return a
    };
    SVGPathSegList._pathSegArrayAsString = function(a) {
      var t = "",
        j = true;
      a.forEach(function(c) {
        if (j) {
          j = false;
          t += c._asPathString()
        } else t += " " + c._asPathString()
      });
      return t
    };
    SVGPathSegList.prototype._parsePath = function(a) {
      if (!a || a.length == 0) return [];
      var t = this,
        j = function() {
          this.pathSegList = []
        };
      j.prototype.appendSegment = function(d) {
        this.pathSegList.push(d)
      };
      var c = function(d) {
        this._string = d;
        this._currentIndex = 0;
        this._endIndex = this._string.length;
        this._previousCommand = SVGPathSeg.PATHSEG_UNKNOWN;
        this._skipOptionalSpaces()
      };
      c.prototype._isCurrentSpace = function() {
        var d = this._string[this._currentIndex];
        return d <= " " && (d == " " || d == "\n" || d == "\t" || d == "\r" || d == "\u000c")
      };
      c.prototype._skipOptionalSpaces = function() {
        for (; this._currentIndex < this._endIndex && this._isCurrentSpace();) this._currentIndex++;
        return this._currentIndex < this._endIndex
      };
      c.prototype._skipOptionalSpacesOrDelimiter = function() {
        if (this._currentIndex < this._endIndex && !this._isCurrentSpace() && this._string.charAt(this._currentIndex) != ",") return false;
        if (this._skipOptionalSpaces()) if (this._currentIndex < this._endIndex && this._string.charAt(this._currentIndex) == ",") {
          this._currentIndex++;
          this._skipOptionalSpaces()
        }
        return this._currentIndex < this._endIndex
      };
      c.prototype.hasMoreData = function() {
        return this._currentIndex < this._endIndex
      };
      c.prototype.peekSegmentType = function() {
        return this._pathSegTypeFromChar(this._string[this._currentIndex])
      };
      c.prototype._pathSegTypeFromChar = function(d) {
        switch (d) {
          case "Z":
          case "z":
            return SVGPathSeg.PATHSEG_CLOSEPATH;
          case "M":
            return SVGPathSeg.PATHSEG_MOVETO_ABS;
          case "m":
            return SVGPathSeg.PATHSEG_MOVETO_REL;
          case "L":
            return SVGPathSeg.PATHSEG_LINETO_ABS;
          case "l":
            return SVGPathSeg.PATHSEG_LINETO_REL;
          case "C":
            return SVGPathSeg.PATHSEG_CURVETO_CUBIC_ABS;
          case "c":
            return SVGPathSeg.PATHSEG_CURVETO_CUBIC_REL;
          case "Q":
            return SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_ABS;
          case "q":
            return SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_REL;
          case "A":
            return SVGPathSeg.PATHSEG_ARC_ABS;
          case "a":
            return SVGPathSeg.PATHSEG_ARC_REL;
          case "H":
            return SVGPathSeg.PATHSEG_LINETO_HORIZONTAL_ABS;
          case "h":
            return SVGPathSeg.PATHSEG_LINETO_HORIZONTAL_REL;
          case "V":
            return SVGPathSeg.PATHSEG_LINETO_VERTICAL_ABS;
          case "v":
            return SVGPathSeg.PATHSEG_LINETO_VERTICAL_REL;
          case "S":
            return SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_ABS;
          case "s":
            return SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_REL;
          case "T":
            return SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_SMOOTH_ABS;
          case "t":
            return SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_SMOOTH_REL;
          default:
            return SVGPathSeg.PATHSEG_UNKNOWN
        }
      };
      c.prototype._nextCommandHelper = function(d, l) {
        if ((d == "+" || d == "-" || d == "." || d >= "0" && d <= "9") && l != SVGPathSeg.PATHSEG_CLOSEPATH) {
          if (l == SVGPathSeg.PATHSEG_MOVETO_ABS) return SVGPathSeg.PATHSEG_LINETO_ABS;
          if (l == SVGPathSeg.PATHSEG_MOVETO_REL) return SVGPathSeg.PATHSEG_LINETO_REL;
          return l
        }
        return SVGPathSeg.PATHSEG_UNKNOWN
      };
      c.prototype.initialCommandIsMoveTo = function() {
        if (!this.hasMoreData()) return true;
        var d = this.peekSegmentType();
        return d == SVGPathSeg.PATHSEG_MOVETO_ABS || d == SVGPathSeg.PATHSEG_MOVETO_REL
      };
      c.prototype._parseNumber = function() {
        var d = 0,
          l = 0,
          h = 1,
          o = 0,
          m = 1,
          z = 1,
          s = this._currentIndex;
        this._skipOptionalSpaces();
        if (this._currentIndex < this._endIndex && this._string.charAt(this._currentIndex) == "+") this._currentIndex++;
        else if (this._currentIndex < this._endIndex && this._string.charAt(this._currentIndex) == "-") {
          this._currentIndex++;
          m = -1
        }
        if (!(this._currentIndex == this._endIndex || (this._string.charAt(this._currentIndex) < "0" || this._string.charAt(this._currentIndex) > "9") && this._string.charAt(this._currentIndex) != ".")) {
          for (var F = this._currentIndex; this._currentIndex < this._endIndex && this._string.charAt(this._currentIndex) >= "0" && this._string.charAt(this._currentIndex) <= "9";) this._currentIndex++;
          if (this._currentIndex != F) for (var A = this._currentIndex - 1, i = 1; A >= F;) {
            l += i * (this._string.charAt(A--) - "0");
            i *= 10
          }
          if (this._currentIndex < this._endIndex && this._string.charAt(this._currentIndex) == ".") {
            this._currentIndex++;
            if (this._currentIndex >= this._endIndex || this._string.charAt(this._currentIndex) < "0" || this._string.charAt(this._currentIndex) > "9") return;
            for (; this._currentIndex < this._endIndex && this._string.charAt(this._currentIndex) >= "0" && this._string.charAt(this._currentIndex) <= "9";) o += (this._string.charAt(this._currentIndex++) - "0") * (h *= 0.1)
          }
          if (this._currentIndex != s && this._currentIndex + 1 < this._endIndex && (this._string.charAt(this._currentIndex) == "e" || this._string.charAt(this._currentIndex) == "E") && this._string.charAt(this._currentIndex + 1) != "x" && this._string.charAt(this._currentIndex + 1) != "m") {
            this._currentIndex++;
            if (this._string.charAt(this._currentIndex) == "+") this._currentIndex++;
            else if (this._string.charAt(this._currentIndex) == "-") {
              this._currentIndex++;
              z = -1
            }
            if (this._currentIndex >= this._endIndex || this._string.charAt(this._currentIndex) < "0" || this._string.charAt(this._currentIndex) > "9") return;
            for (; this._currentIndex < this._endIndex && this._string.charAt(this._currentIndex) >= "0" && this._string.charAt(this._currentIndex) <= "9";) {
              d *= 10;
              d += this._string.charAt(this._currentIndex) - "0";
              this._currentIndex++
            }
          }
          l = l + o;
          l *= m;
          if (d) l *= Math.pow(10, z * d);
          if (s != this._currentIndex) {
            this._skipOptionalSpacesOrDelimiter();
            return l
          }
        }
      };
      c.prototype._parseArcFlag = function() {
        if (!(this._currentIndex >= this._endIndex)) {
          var d = false;
          d = this._string.charAt(this._currentIndex++);
          if (d == "0") d = false;
          else if (d == "1") d = true;
          else return;
          this._skipOptionalSpacesOrDelimiter();
          return d
        }
      };
      c.prototype.parseSegment = function() {
        var d = this._string[this._currentIndex],
          l = this._pathSegTypeFromChar(d);
        if (l == SVGPathSeg.PATHSEG_UNKNOWN) {
          if (this._previousCommand == SVGPathSeg.PATHSEG_UNKNOWN) return null;
          l = this._nextCommandHelper(d, this._previousCommand);
          if (l == SVGPathSeg.PATHSEG_UNKNOWN) return null
        } else this._currentIndex++;
        this._previousCommand = l;
        switch (l) {
          case SVGPathSeg.PATHSEG_MOVETO_REL:
            return new SVGPathSegMovetoRel(t, this._parseNumber(), this._parseNumber());
          case SVGPathSeg.PATHSEG_MOVETO_ABS:
            return new SVGPathSegMovetoAbs(t, this._parseNumber(), this._parseNumber());
          case SVGPathSeg.PATHSEG_LINETO_REL:
            return new SVGPathSegLinetoRel(t, this._parseNumber(), this._parseNumber());
          case SVGPathSeg.PATHSEG_LINETO_ABS:
            return new SVGPathSegLinetoAbs(t, this._parseNumber(), this._parseNumber());
          case SVGPathSeg.PATHSEG_LINETO_HORIZONTAL_REL:
            return new SVGPathSegLinetoHorizontalRel(t, this._parseNumber());
          case SVGPathSeg.PATHSEG_LINETO_HORIZONTAL_ABS:
            return new SVGPathSegLinetoHorizontalAbs(t, this._parseNumber());
          case SVGPathSeg.PATHSEG_LINETO_VERTICAL_REL:
            return new SVGPathSegLinetoVerticalRel(t, this._parseNumber());
          case SVGPathSeg.PATHSEG_LINETO_VERTICAL_ABS:
            return new SVGPathSegLinetoVerticalAbs(t, this._parseNumber());
          case SVGPathSeg.PATHSEG_CLOSEPATH:
            this._skipOptionalSpaces();
            return new SVGPathSegClosePath(t);
          case SVGPathSeg.PATHSEG_CURVETO_CUBIC_REL:
            d = {
              x1: this._parseNumber(),
              y1: this._parseNumber(),
              x2: this._parseNumber(),
              y2: this._parseNumber(),
              x: this._parseNumber(),
              y: this._parseNumber()
            };
            return new SVGPathSegCurvetoCubicRel(t, d.x, d.y, d.x1, d.y1, d.x2, d.y2);
          case SVGPathSeg.PATHSEG_CURVETO_CUBIC_ABS:
            d = {
              x1: this._parseNumber(),
              y1: this._parseNumber(),
              x2: this._parseNumber(),
              y2: this._parseNumber(),
              x: this._parseNumber(),
              y: this._parseNumber()
            };
            return new SVGPathSegCurvetoCubicAbs(t, d.x, d.y, d.x1, d.y1, d.x2, d.y2);
          case SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_REL:
            d = {
              x2: this._parseNumber(),
              y2: this._parseNumber(),
              x: this._parseNumber(),
              y: this._parseNumber()
            };
            return new SVGPathSegCurvetoCubicSmoothRel(t, d.x, d.y, d.x2, d.y2);
          case SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_ABS:
            d = {
              x2: this._parseNumber(),
              y2: this._parseNumber(),
              x: this._parseNumber(),
              y: this._parseNumber()
            };
            return new SVGPathSegCurvetoCubicSmoothAbs(t, d.x, d.y, d.x2, d.y2);
          case SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_REL:
            d = {
              x1: this._parseNumber(),
              y1: this._parseNumber(),
              x: this._parseNumber(),
              y: this._parseNumber()
            };
            return new SVGPathSegCurvetoQuadraticRel(t, d.x, d.y, d.x1, d.y1);
          case SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_ABS:
            d = {
              x1: this._parseNumber(),
              y1: this._parseNumber(),
              x: this._parseNumber(),
              y: this._parseNumber()
            };
            return new SVGPathSegCurvetoQuadraticAbs(t, d.x, d.y, d.x1, d.y1);
          case SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_SMOOTH_REL:
            return new SVGPathSegCurvetoQuadraticSmoothRel(t, this._parseNumber(), this._parseNumber());
          case SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_SMOOTH_ABS:
            return new SVGPathSegCurvetoQuadraticSmoothAbs(t, this._parseNumber(), this._parseNumber());
          case SVGPathSeg.PATHSEG_ARC_REL:
            d = {
              x1: this._parseNumber(),
              y1: this._parseNumber(),
              arcAngle: this._parseNumber(),
              arcLarge: this._parseArcFlag(),
              arcSweep: this._parseArcFlag(),
              x: this._parseNumber(),
              y: this._parseNumber()
            };
            return new SVGPathSegArcRel(t, d.x, d.y, d.x1, d.y1, d.arcAngle, d.arcLarge, d.arcSweep);
          case SVGPathSeg.PATHSEG_ARC_ABS:
            d = {
              x1: this._parseNumber(),
              y1: this._parseNumber(),
              arcAngle: this._parseNumber(),
              arcLarge: this._parseArcFlag(),
              arcSweep: this._parseArcFlag(),
              x: this._parseNumber(),
              y: this._parseNumber()
            };
            return new SVGPathSegArcAbs(t, d.x, d.y, d.x1, d.y1, d.arcAngle, d.arcLarge, d.arcSweep);
          default:
            throw "Unknown path seg type.";
        }
      };
      j = new j;
      a = new c(a);
      if (!a.initialCommandIsMoveTo()) return [];
      for (; a.hasMoreData();) {
        c = a.parseSegment();
        if (!c) return [];
        j.appendSegment(c)
      }
      return j.pathSegList
    };
    Object.defineProperty(SVGPathElement.prototype, "pathSegList", {
      get: function() {
        if (!this._pathSegList) this._pathSegList = new SVGPathSegList(this);
        return this._pathSegList
      },
      enumerable: true
    });
    Object.defineProperty(SVGPathElement.prototype, "normalizedPathSegList", {
      get: function() {
        return this.pathSegList
      },
      enumerable: true
    });
    Object.defineProperty(SVGPathElement.prototype, "animatedPathSegList", {
      get: function() {
        return this.pathSegList
      },
      enumerable: true
    });
    Object.defineProperty(SVGPathElement.prototype, "animatedNormalizedPathSegList", {
      get: function() {
        return this.pathSegList
      },
      enumerable: true
    })
  }
})();
(function() {
  if (!svgedit.browser) svgedit.browser = {};
  var a = svgedit.NS,
    t = !! document.createElementNS && !! document.createElementNS(a.SVG, "svg").createSVGRect;
  svgedit.browser.supportsSvg = function() {
    return t
  };
  if (svgedit.browser.supportsSvg()) {
    var j = navigator.userAgent,
      c = document.createElementNS(a.SVG, "svg"),
      d = !! window.opera,
      l = j.indexOf("AppleWebKit") >= 0,
      h = j.indexOf("Gecko/") >= 0,
      o = j.indexOf("MSIE") >= 0,
      m = j.indexOf("Chrome/") >= 0,
      z = j.indexOf("Windows") >= 0,
      s = j.indexOf("Macintosh") >= 0,
      F = "ontouchstart" in window,
      A = !! c.querySelector,
      i = !! document.evaluate,
      B = function() {
        var ba = document.createElementNS(a.SVG, "path");
        ba.setAttribute("d", "M0,0 10,10");
        var ia = ba.pathSegList;
        ba = ba.createSVGPathSegLinetoAbs(5, 5);
        try {
          ia.replaceItem(ba, 0);
          return true
        } catch (Pa) {}
        return false
      }(),
      u = function() {
        var ba = document.createElementNS(a.SVG, "path");
        ba.setAttribute("d", "M0,0 10,10");
        var ia = ba.pathSegList;
        ba = ba.createSVGPathSegLinetoAbs(5, 5);
        try {
          ia.insertItemBefore(ba, 0);
          return true
        } catch (Pa) {}
        return false
      }(),
      v = function() {
        var ba = document.createElementNS(a.SVG, "svg"),
          ia = document.createElementNS(a.SVG, "svg");
        document.documentElement.appendChild(ba);
        ia.setAttribute("x", 5);
        ba.appendChild(ia);
        var Pa = document.createElementNS(a.SVG, "text");
        Pa.textContent = "a";
        ia.appendChild(Pa);
        ia = Pa.getStartPositionOfChar(0).x;
        document.documentElement.removeChild(ba);
        return ia === 0
      }(),
      r = function() {
        var ba = document.createElementNS(a.SVG, "svg");
        document.documentElement.appendChild(ba);
        var ia = document.createElementNS(a.SVG, "path");
        ia.setAttribute("d", "M0,0 C0,0 10,10 10,0");
        ba.appendChild(ia);
        ia = ia.getBBox();
        document.documentElement.removeChild(ba);
        return ia.height > 4 && ia.height < 5
      }(),
      O = function() {
        var ba = document.createElementNS(a.SVG, "svg");
        document.documentElement.appendChild(ba);
        var ia = document.createElementNS(a.SVG, "path");
        ia.setAttribute("d", "M0,0 10,0");
        var Pa = document.createElementNS(a.SVG, "path");
        Pa.setAttribute("d", "M5,0 15,0");
        var Ca = document.createElementNS(a.SVG, "g");
        Ca.appendChild(ia);
        Ca.appendChild(Pa);
        ba.appendChild(Ca);
        ia = Ca.getBBox();
        document.documentElement.removeChild(ba);
        return ia.width == 15
      }(),
      Z = function() {
        var ba = document.createElementNS(a.SVG, "rect");
        ba.setAttribute("x", 0.1);
        (ba = ba.cloneNode(false).getAttribute("x").indexOf(",") == -1) || $.alert('NOTE: This version of Opera is known to contain bugs in SVG-edit.\nPlease upgrade to the <a href="http://opera.com">latest version</a> in which the problems have been fixed.');
        return ba
      }(),
      ka = function() {
        var ba = document.createElementNS(a.SVG, "rect");
        ba.setAttribute("style", "vector-effect:non-scaling-stroke");
        return ba.style.vectorEffect === "non-scaling-stroke"
      }(),
      ea = function() {
        var ba = document.createElementNS(a.SVG, "rect").transform.baseVal,
          ia = c.createSVGTransform();
        ba.appendItem(ia);
        return ba.getItem(0) == ia
      }();
    svgedit.browser.isOpera = function() {
      return d
    };
    svgedit.browser.isWebkit = function() {
      return l
    };
    svgedit.browser.isGecko = function() {
      return h
    };
    svgedit.browser.isIE = function() {
      return o
    };
    svgedit.browser.isChrome = function() {
      return m
    };
    svgedit.browser.isWindows = function() {
      return z
    };
    svgedit.browser.isMac = function() {
      return s
    };
    svgedit.browser.isTouch = function() {
      return F
    };
    svgedit.browser.supportsSelectors = function() {
      return A
    };
    svgedit.browser.supportsXpath = function() {
      return i
    };
    svgedit.browser.supportsPathReplaceItem = function() {
      return B
    };
    svgedit.browser.supportsPathInsertItemBefore = function() {
      return u
    };
    svgedit.browser.supportsPathBBox = function() {
      return r
    };
    svgedit.browser.supportsHVLineContainerBBox = function() {
      return O
    };
    svgedit.browser.supportsGoodTextCharPos = function() {
      return v
    };
    svgedit.browser.supportsEditableText = function() {
      return d
    };
    svgedit.browser.supportsGoodDecimals = function() {
      return Z
    };
    svgedit.browser.supportsNonScalingStroke = function() {
      return ka
    };
    svgedit.browser.supportsNativeTransformLists = function() {
      return ea
    }
  } else window.location = "browser-not-supported.html"
})();
(function() {
  if (!svgedit.transformlist) svgedit.transformlist = {};
  var a = document.createElementNS(svgedit.NS.SVG, "svg"),
    t = {};
  svgedit.transformlist.SVGTransformList = function(j) {
    this._elem = j || null;
    this._xforms = [];
    this._update = function() {
      var c = "";
      a.createSVGMatrix();
      var d;
      for (d = 0; d < this.numberOfItems; ++d) {
        var l = this._list.getItem(d);
        c = c;
        l = l;
        var h = l.matrix,
          o = "";
        switch (l.type) {
          case 1:
            o = "matrix(" + [h.a, h.b, h.c, h.d, h.e, h.f].join(",") + ")";
            break;
          case 2:
            o = "translate(" + h.e + "," + h.f + ")";
            break;
          case 3:
            o = h.a == h.d ? "scale(" + h.a + ")" : "scale(" + h.a + "," + h.d + ")";
            break;
          case 4:
            var m = 0;
            o = 0;
            if (l.angle != 0) {
              m = 1 - h.a;
              o = (m * h.f + h.b * h.e) / (m * m + h.b * h.b);
              m = (h.e - h.b * o) / m
            }
            o = "rotate(" + l.angle + " " + m + "," + o + ")"
        }
        c = c + (o + " ")
      }
      this._elem.setAttribute("transform", c)
    };
    this._list = this;
    this._init = function() {
      var c = this._elem.getAttribute("transform");
      if (c) for (var d = /\s*((scale|matrix|rotate|translate)\s*\(.*?\))\s*,?\s*/, l = true; l;) {
        l = c.match(d);
        c = c.replace(d, "");
        if (l && l[1]) {
          var h = l[1].split(/\s*\(/),
            o = h[0];
          h = h[1].match(/\s*(.*?)\s*\)/);
          h[1] = h[1].replace(/(\d)-/g, "$1 -");
          var m = h[1].split(/[, ]+/),
            z = "abcdef".split(""),
            s = a.createSVGMatrix();
          $.each(m, function(i, B) {
            m[i] = parseFloat(B);
            if (o == "matrix") s[z[i]] = m[i]
          });
          h = a.createSVGTransform();
          var F = "set" + o.charAt(0).toUpperCase() + o.slice(1),
            A = o == "matrix" ? [s] : m;
          if (o == "scale" && A.length == 1) A.push(A[0]);
          else if (o == "translate" && A.length == 1) A.push(0);
          else o == "rotate" && A.length == 1 && A.push(0, 0);
          h[F].apply(h, A);
          this._list.appendItem(h)
        }
      }
    };
    this._removeFromOtherLists = function(c) {
      if (c) {
        var d = false,
          l;
        for (l in t) {
          var h = t[l],
            o, m;
          o = 0;
          for (m = h._xforms.length; o < m; ++o) if (h._xforms[o] == c) {
            d = true;
            h.removeItem(o);
            break
          }
          if (d) break
        }
      }
    };
    this.numberOfItems = 0;
    this.clear = function() {
      this.numberOfItems = 0;
      this._xforms = []
    };
    this.initialize = function(c) {
      this.numberOfItems = 1;
      this._removeFromOtherLists(c);
      this._xforms = [c]
    };
    this.getItem = function(c) {
      if (c < this.numberOfItems && c >= 0) return this._xforms[c];
      throw {
        code: 1
      };
    };
    this.insertItemBefore = function(c, d) {
      var l = null;
      if (d >= 0) if (d < this.numberOfItems) {
        this._removeFromOtherLists(c);
        l = Array(this.numberOfItems + 1);
        var h;
        for (h = 0; h < d; ++h) l[h] = this._xforms[h];
        l[h] = c;
        var o;
        for (o = h + 1; h < this.numberOfItems; ++o, ++h) l[o] = this._xforms[h];
        this.numberOfItems++;
        this._xforms = l;
        l = c;
        this._list._update()
      } else l = this._list.appendItem(c);
      return l
    };
    this.replaceItem = function(c, d) {
      var l = null;
      if (d < this.numberOfItems && d >= 0) {
        this._removeFromOtherLists(c);
        l = this._xforms[d] = c;
        this._list._update()
      }
      return l
    };
    this.removeItem = function(c) {
      if (c < this.numberOfItems && c >= 0) {
        var d = this._xforms[c],
          l = Array(this.numberOfItems - 1),
          h;
        for (h = 0; h < c; ++h) l[h] = this._xforms[h];
        for (c = h; c < this.numberOfItems - 1; ++c, ++h) l[c] = this._xforms[h + 1];
        this.numberOfItems--;
        this._xforms = l;
        this._list._update();
        return d
      }
      throw {
        code: 1
      };
    };
    this.appendItem = function(c) {
      this._removeFromOtherLists(c);
      this._xforms.push(c);
      this.numberOfItems++;
      this._list._update();
      return c
    }
  };
  svgedit.transformlist.resetListMap = function() {
    t = {}
  };
  svgedit.transformlist.removeElementFromListMap = function(j) {
    j.id && t[j.id] && delete t[j.id]
  };
  svgedit.transformlist.getTransformList = function(j) {
    if (!svgedit.browser.supportsNativeTransformLists()) {
      var c = j.id || "temp",
        d = t[c];
      if (!d || c === "temp") {
        t[c] = new svgedit.transformlist.SVGTransformList(j);
        t[c]._init();
        d = t[c]
      }
      return d
    }
    if (j.transform) return j.transform.baseVal;
    if (j.gradientTransform) return j.gradientTransform.baseVal;
    if (j.patternTransform) return j.patternTransform.baseVal;
    return null
  }
})();
(function() {
  if (!svgedit.math) svgedit.math = {};
  var a = document.createElementNS(svgedit.NS.SVG, "svg");
  svgedit.math.transformPoint = function(t, j, c) {
    return {
      x: c.a * t + c.c * j + c.e,
      y: c.b * t + c.d * j + c.f
    }
  };
  svgedit.math.isIdentity = function(t) {
    return t.a === 1 && t.b === 0 && t.c === 0 && t.d === 1 && t.e === 0 && t.f === 0
  };
  svgedit.math.matrixMultiply = function() {
    for (var t = arguments, j = t.length, c = t[j - 1]; j-- > 1;) c = t[j - 1].multiply(c);
    if (Math.abs(c.a) < 1.0E-14) c.a = 0;
    if (Math.abs(c.b) < 1.0E-14) c.b = 0;
    if (Math.abs(c.c) < 1.0E-14) c.c = 0;
    if (Math.abs(c.d) < 1.0E-14) c.d = 0;
    if (Math.abs(c.e) < 1.0E-14) c.e = 0;
    if (Math.abs(c.f) < 1.0E-14) c.f = 0;
    return c
  };
  svgedit.math.hasMatrixTransform = function(t) {
    if (!t) return false;
    for (var j = t.numberOfItems; j--;) {
      var c = t.getItem(j);
      if (c.type == 1 && !svgedit.math.isIdentity(c.matrix)) return true
    }
    return false
  };
  svgedit.math.transformBox = function(t, j, c, d, l) {
    var h = svgedit.math.transformPoint,
      o = h(t, j, l),
      m = h(t + c, j, l),
      z = h(t, j + d, l);
    t = h(t + c, j + d, l);
    j = Math.min(o.x, m.x, z.x, t.x);
    c = Math.min(o.y, m.y, z.y, t.y);
    return {
      tl: o,
      tr: m,
      bl: z,
      br: t,
      aabox: {
        x: j,
        y: c,
        width: Math.max(o.x, m.x, z.x, t.x) - j,
        height: Math.max(o.y, m.y, z.y, t.y) - c
      }
    }
  };
  svgedit.math.transformListToTransform = function(t, j, c) {
    if (t == null) return a.createSVGTransformFromMatrix(a.createSVGMatrix());
    j = j || 0;
    c = c || t.numberOfItems - 1;
    j = parseInt(j, 10);
    c = parseInt(c, 10);
    if (j > c) {
      var d = c;
      c = j;
      j = d
    }
    d = a.createSVGMatrix();
    for (j = j; j <= c; ++j) {
      var l = j >= 0 && j < t.numberOfItems ? t.getItem(j).matrix : a.createSVGMatrix();
      d = svgedit.math.matrixMultiply(d, l)
    }
    return a.createSVGTransformFromMatrix(d)
  };
  svgedit.math.getMatrix = function(t) {
    t = svgedit.transformlist.getTransformList(t);
    return svgedit.math.transformListToTransform(t).matrix
  };
  svgedit.math.snapToAngle = function(t, j, c, d) {
    var l = Math.PI / 4;
    c = c - t;
    var h = d - j;
    d = Math.sqrt(c * c + h * h);
    l = Math.round(Math.atan2(h, c) / l) * l;
    return {
      x: t + d * Math.cos(l),
      y: j + d * Math.sin(l),
      a: l
    }
  };
  svgedit.math.rectsIntersect = function(t, j) {
    return j.x < t.x + t.width && j.x + j.width > t.x && j.y < t.y + t.height && j.y + j.height > t.y
  }
})();
(function() {
  if (!svgedit.units) svgedit.units = {};
  var a = svgedit.NS,
    t = ["x", "x1", "cx", "rx", "width"],
    j = ["y", "y1", "cy", "ry", "height"],
    c = ["r", "radius"].concat(t, j),
    d, l = {};
  svgedit.units.init = function(o) {
    d = o;
    o = document.createElementNS(a.SVG, "svg");
    document.body.appendChild(o);
    var m = document.createElementNS(a.SVG, "rect");
    m.setAttribute("width", "1em");
    m.setAttribute("height", "1ex");
    m.setAttribute("x", "1in");
    o.appendChild(m);
    m = m.getBBox();
    document.body.removeChild(o);
    o = m.x;
    l = {
      em: m.width,
      ex: m.height,
      "in": o,
      cm: o / 2.54,
      mm: o / 25.4,
      pt: o / 72,
      pc: o / 6,
      px: 1,
      "%": 0
    }
  };
  svgedit.units.getTypeMap = function() {
    return l
  };
  svgedit.units.shortFloat = function(o) {
    var m = d.getRoundDigits();
    if (!isNaN(o)) return +(+o).toFixed(m);
    if ($.isArray(o)) return svgedit.units.shortFloat(o[0]) + "," + svgedit.units.shortFloat(o[1]);
    return parseFloat(o).toFixed(m) - 0
  };
  svgedit.units.convertUnit = function(o, m) {
    m = m || d.getBaseUnit();
    return svgedit.units.shortFloat(o / l[m])
  };
  svgedit.units.setUnitAttr = function(o, m, z) {
    o.setAttribute(m, z)
  };
  var h = {
    line: ["x1", "x2", "y1", "y2"],
    circle: ["cx", "cy", "r"],
    ellipse: ["cx", "cy", "rx", "ry"],
    foreignObject: ["x", "y", "width", "height"],
    rect: ["x", "y", "width", "height"],
    image: ["x", "y", "width", "height"],
    use: ["x", "y", "width", "height"],
    text: ["x", "y"]
  };
  svgedit.units.convertAttrs = function(o) {
    var m = o.tagName,
      z = d.getBaseUnit();
    if (m = h[m]) {
      var s = m.length,
        F;
      for (F = 0; F < s; F++) {
        var A = m[F],
          i = o.getAttribute(A);
        if (i) isNaN(i) || o.setAttribute(A, i / l[z] + z)
      }
    }
  };
  svgedit.units.convertToNum = function(o, m) {
    if (!isNaN(m)) return m - 0;
    var z;
    if (m.substr(-1) === "%") {
      z = m.substr(0, m.length - 1) / 100;
      var s = d.getWidth(),
        F = d.getHeight();
      if (t.indexOf(o) >= 0) return z * s;
      if (j.indexOf(o) >= 0) return z * F;
      return z * Math.sqrt(s * s + F * F) / Math.sqrt(2)
    }
    s = m.substr(-2);
    z = m.substr(0, m.length - 2);
    return z * l[s]
  };
  svgedit.units.isValidUnit = function(o, m, z) {
    var s = false;
    if (c.indexOf(o) >= 0) if (isNaN(m)) {
      m = m.toLowerCase();
      $.each(l, function(i) {
        if (!s) if (RegExp("^-?[\\d\\.]+" + i + "$").test(m)) s = true
      })
    } else s = true;
    else if (o == "id") {
      o = false;
      try {
        var F = d.getElement(m);
        o = F == null || F === z
      } catch (A) {}
      return o
    }
    return s = true
  }
})();
(function(a) {
  function t(m) {
    if (svgedit.browser.supportsHVLineContainerBBox()) try {
      return m.getBBox()
    } catch (z) {}
    var s = $.data(m, "ref"),
      F = null,
      A;
    if (s) {
      A = $(s).children().clone().attr("visibility", "hidden");
      $(o).append(A);
      F = A.filter("line, path")
    } else F = $(m).find("line, path");
    var i = false;
    if (F.length) {
      F.each(function() {
        var B = this.getBBox();
        if (!B.width || !B.height) i = true
      });
      if (i) {
        m = s ? A : $(m).children();
        m = getStrokedBBox(m)
      } else m = m.getBBox()
    } else m = m.getBBox();
    s && A.remove();
    return m
  }
  if (!svgedit.utilities) svgedit.utilities = {};
  var j = svgedit.NS,
    c = "a,circle,ellipse,foreignObject,g,image,line,path,polygon,polyline,rect,svg,text,tspan,use".split(","),
    d = null,
    l = null,
    h = null,
    o = null;
  svgedit.utilities.init = function(m) {
    d = m;
    l = m.getDOMDocument();
    h = m.getDOMContainer();
    o = m.getSVGRoot()
  };
  svgedit.utilities.toXml = function(m) {
    return m.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/, "&#x27;")
  };
  svgedit.utilities.fromXml = function(m) {
    return $("<p/>").html(m).text()
  };
  svgedit.utilities.encode64 = function(m) {
    m = svgedit.utilities.encodeUTF8(m);
    if (window.btoa) return window.btoa(m);
    var z = [];
    z.length = Math.floor((m.length + 2) / 3) * 4;
    var s, F, A, i, B, u, v = 0,
      r = 0;
    do {
      s = m.charCodeAt(v++);
      F = m.charCodeAt(v++);
      A = m.charCodeAt(v++);
      i = s >> 2;
      s = (s & 3) << 4 | F >> 4;
      B = (F & 15) << 2 | A >> 6;
      u = A & 63;
      if (isNaN(F)) B = u = 64;
      else if (isNaN(A)) u = 64;
      z[r++] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(i);
      z[r++] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(s);
      z[r++] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(B);
      z[r++] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(u)
    } while (v < m.length);
    return z.join("")
  };
  svgedit.utilities.decode64 = function(m) {
    if (window.atob) return svgedit.utilities.decodeUTF8(window.atob(m));
    var z = "",
      s, F, A = "",
      i, B = "",
      u = 0;
    m = m.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    do {
      s = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(m.charAt(u++));
      F = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(m.charAt(u++));
      i = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(m.charAt(u++));
      B = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(m.charAt(u++));
      s = s << 2 | F >> 4;
      F = (F & 15) << 4 | i >> 2;
      A = (i & 3) << 6 | B;
      z += String.fromCharCode(s);
      if (i != 64) z += String.fromCharCode(F);
      if (B != 64) z += String.fromCharCode(A)
    } while (u < m.length);
    return svgedit.utilities.decodeUTF8(z)
  };
  svgedit.utilities.decodeUTF8 = function(m) {
    return decodeURIComponent(escape(m))
  };
  svgedit.utilities.encodeUTF8 = function(m) {
    return unescape(encodeURIComponent(m))
  };
  svgedit.utilities.convertToXMLReferences = function(m) {
    var z, s = "";
    for (z = 0; z < m.length; z++) {
      var F = m.charCodeAt(z);
      if (F < 128) s += m[z];
      else if (F > 127) s += "&#" + F + ";"
    }
    return s
  };
  svgedit.utilities.text2xml = function(m) {
    if (m.indexOf("<svg:svg") >= 0) m = m.replace(/<(\/?)svg:/g, "<$1").replace("xmlns:svg", "xmlns");
    var z, s;
    try {
      s = window.DOMParser ? new DOMParser : new ActiveXObject("Microsoft.XMLDOM");
      s.async = false
    } catch (F) {
      throw Error("XML Parser could not be instantiated");
    }
    try {
      z = s.loadXML ? s.loadXML(m) ? s : false : s.parseFromString(m, "text/xml")
    } catch (A) {
      throw Error("Error parsing XML string");
    }
    return z
  };
  svgedit.utilities.bboxToObj = function(m) {
    return {
      x: m.x,
      y: m.y,
      width: m.width,
      height: m.height
    }
  };
  svgedit.utilities.walkTree = function(m, z) {
    if (m && m.nodeType == 1) {
      z(m);
      for (var s = m.childNodes.length; s--;) svgedit.utilities.walkTree(m.childNodes.item(s), z)
    }
  };
  svgedit.utilities.walkTreePost = function(m, z) {
    if (m && m.nodeType == 1) {
      for (var s = m.childNodes.length; s--;) svgedit.utilities.walkTree(m.childNodes.item(s), z);
      z(m)
    }
  };
  svgedit.utilities.getUrlFromAttr = function(m) {
    if (m) {
      if (m.indexOf('url("') === 0) return m.substring(5, m.indexOf('"', 6));
      if (m.indexOf("url('") === 0) return m.substring(5, m.indexOf("'", 6));
      if (m.indexOf("url(") === 0) return m.substring(4, m.indexOf(")"))
    }
    return null
  };
  svgedit.utilities.getHref = function(m) {
    return m.getAttributeNS(j.XLINK, "href")
  };
  svgedit.utilities.setHref = function(m, z) {
    m.setAttributeNS(j.XLINK, "xlink:href", z)
  };
  svgedit.utilities.findDefs = function() {
    var m = d.getSVGContent(),
      z = m.getElementsByTagNameNS(j.SVG, "defs");
    if (z.length > 0) z = z[0];
    else {
      z = m.ownerDocument.createElementNS(j.SVG, "defs");
      m.firstChild ? m.insertBefore(z, m.firstChild.nextSibling) : m.appendChild(z)
    }
    return z
  };
  svgedit.utilities.getPathBBox = function(m) {
    var z = m.pathSegList,
      s = z.numberOfItems;
    m = [
      [],
      []
    ];
    var F = z.getItem(0),
      A = [F.x, F.y];
    for (F = 0; F < s; F++) {
      var i = z.getItem(F);
      if (i.x !== a) {
        m[0].push(A[0]);
        m[1].push(A[1]);
        if (i.x1) {
          var B = [i.x1, i.y1],
            u = [i.x2, i.y2],
            v = [i.x, i.y],
            r;
          for (r = 0; r < 2; r++) {
            i = function(ba) {
              return Math.pow(1 - ba, 3) * A[r] + 3 * Math.pow(1 - ba, 2) * ba * B[r] + 3 * (1 - ba) * Math.pow(ba, 2) * u[r] + Math.pow(ba, 3) * v[r]
            };
            var O = 6 * A[r] - 12 * B[r] + 6 * u[r],
              Z = -3 * A[r] + 9 * B[r] - 9 * u[r] + 3 * v[r],
              ka = 3 * B[r] - 3 * A[r];
            if (Z == 0) {
              if (O != 0) {
                O = -ka / O;
                0 < O && O < 1 && m[r].push(i(O))
              }
            } else {
              ka = Math.pow(O, 2) - 4 * ka * Z;
              if (!(ka < 0)) {
                var ea = (-O + Math.sqrt(ka)) / (2 * Z);
                0 < ea && ea < 1 && m[r].push(i(ea));
                O = (-O - Math.sqrt(ka)) / (2 * Z);
                0 < O && O < 1 && m[r].push(i(O))
              }
            }
          }
          A = v
        } else {
          m[0].push(i.x);
          m[1].push(i.y)
        }
      }
    }
    z = Math.min.apply(null, m[0]);
    s = Math.max.apply(null, m[0]) - z;
    F = Math.min.apply(null, m[1]);
    m = Math.max.apply(null, m[1]) - F;
    return {
      x: z,
      y: F,
      width: s,
      height: m
    }
  };
  svgedit.utilities.getBBox = function(m) {
    var z = m || d.geSelectedElements()[0];
    if (m.nodeType != 1) return null;
    m = null;
    var s = z.nodeName;
    switch (s) {
      case "text":
        if (z.textContent === "") {
          z.textContent = "a";
          m = z.getBBox();
          z.textContent = ""
        } else try {
          m = z.getBBox()
        } catch (F) {}
        break;
      case "path":
        if (svgedit.browser.supportsPathBBox()) try {
          m = z.getBBox()
        } catch (A) {} else m = svgedit.utilities.getPathBBox(z);
        break;
      case "g":
      case "a":
        m = t(z);
        break;
      default:
        if (s === "use") m = t(z, true);
        if (s === "use" || s === "foreignObject" && svgedit.browser.isWebkit()) {
          m || (m = z.getBBox());
          s = {};
          s.width = m.width;
          s.height = m.height;
          s.x = m.x + parseFloat(z.getAttribute("x") || 0);
          s.y = m.y + parseFloat(z.getAttribute("y") || 0);
          m = s
        } else if (~c.indexOf(s)) try {
          m = z.getBBox()
        } catch (i) {
          z = $(z).closest("foreignObject");
          if (z.length) try {
            m = z[0].getBBox()
          } catch (B) {
            m = null
          } else m = null
        }
    }
    if (m) m = svgedit.utilities.bboxToObj(m);
    return m
  };
  svgedit.utilities.getRotationAngle = function(m, z) {
    var s = m || d.getSelectedElements()[0];
    s = svgedit.transformlist.getTransformList(s);
    if (!s) return 0;
    var F = s.numberOfItems,
      A;
    for (A = 0; A < F; ++A) {
      var i = s.getItem(A);
      if (i.type == 4) return z ? i.angle * Math.PI / 180 : i.angle
    }
    return 0
  };
  svgedit.utilities.getRefElem = function(m) {
    return svgedit.utilities.getElem(svgedit.utilities.getUrlFromAttr(m).substr(1))
  };
  svgedit.utilities.getElem = svgedit.browser.supportsSelectors() ?
    function(m) {
      return o.querySelector("#" + m)
    } : svgedit.browser.supportsXpath() ?
      function(m) {
        return l.evaluate('svg:svg[@id="svgroot"]//svg:*[@id="' + m + '"]', h, function() {
          return svgedit.NS.SVG
        }, 9, null).singleNodeValue
      } : function(m) {
        return $(o).find("[id=" + m + "]")[0]
      };
  svgedit.utilities.assignAttributes = function(m, z, s, F) {
    s || (s = 0);
    svgedit.browser.isOpera() || o.suspendRedraw(s);
    for (var A in z) if (s = A.substr(0, 4) === "xml:" ? j.XML : A.substr(0, 6) === "xlink:" ? j.XLINK : null) m.setAttributeNS(s, A, z[A]);
    else F ? svgedit.units.setUnitAttr(m, A, z[A]) : m.setAttribute(A, z[A]);
    svgedit.browser.isOpera() || o.unsuspendRedraw(null)
  };
  svgedit.utilities.cleanupElement = function(m) {
    var z = o.suspendRedraw(60),
      s = {
        "fill-opacity": 1,
        "stop-opacity": 1,
        opacity: 1,
        stroke: "none",
        "stroke-dasharray": "none",
        "stroke-linejoin": "miter",
        "stroke-linecap": "butt",
        "stroke-opacity": 1,
        "stroke-width": 1,
        rx: 0,
        ry: 0
      },
      F;
    for (F in s) {
      var A = s[F];
      m.getAttribute(F) == A && m.removeAttribute(F)
    }
    o.unsuspendRedraw(z)
  };
  svgedit.utilities.snapToGrid = function(m) {
    var z = d.getSnappingStep(),
      s = d.getBaseUnit();
    if (s !== "px") z *= svgedit.units.getTypeMap()[s];
    return m = Math.round(m / z) * z
  };
  svgedit.utilities.preg_quote = function(m, z) {
    return String(m).replace(RegExp("[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\" + (z || "") + "-]", "g"), "\\$&")
  };
  svgedit.utilities.executeAfterLoads = function(m, z, s) {
    return function() {
      function F() {
        s.apply(null, A)
      }
      var A = arguments;
      window[m] ? F() : z.reduceRight(function(i, B) {
        return function() {
          $.getScript(B, i)
        }
      }, F)()
    }
  };
  svgedit.utilities.buildCanvgCallback = function(m) {
    return svgedit.utilities.executeAfterLoads("canvg", ["canvg/rgbcolor.js", "canvg/canvg.js"], m)
  };
  svgedit.utilities.buildJSPDFCallback = function(m) {
    return svgedit.utilities.executeAfterLoads("RGBColor", ["canvg/rgbcolor.js"], function() {
      var z = [];
      if (!RGBColor || RGBColor.ok === a) z.push("canvg/rgbcolor.js");
      svgedit.utilities.executeAfterLoads("jsPDF", z.concat("jspdf/underscore-min.js", "jspdf/jspdf.min.js", "jspdf/jspdf.plugin.svgToPdf.js"), m)()
    })
  }
})();
(function() {
  if (!svgedit.sanitize) svgedit.sanitize = {};
  var a = svgedit.NS,
    t = svgedit.getReverseNS(),
    j = {
      a: ["class", "clip-path", "clip-rule", "fill", "fill-opacity", "fill-rule", "filter", "id", "mask", "opacity", "stroke", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-width", "style", "systemLanguage", "transform", "xlink:href", "xlink:title"],
      circle: ["class", "clip-path", "clip-rule", "cx", "cy", "fill", "fill-opacity", "fill-rule", "filter", "id", "mask", "opacity", "r", "requiredFeatures", "stroke", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-width", "style", "systemLanguage", "transform"],
      clipPath: ["class", "clipPathUnits", "id"],
      defs: [],
      style: ["type"],
      desc: [],
      ellipse: ["class", "clip-path", "clip-rule", "cx", "cy", "fill", "fill-opacity", "fill-rule", "filter", "id", "mask", "opacity", "requiredFeatures", "rx", "ry", "stroke", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-width", "style", "systemLanguage", "transform"],
      feGaussianBlur: ["class", "color-interpolation-filters", "id", "requiredFeatures", "stdDeviation"],
      filter: ["class", "color-interpolation-filters", "filterRes", "filterUnits", "height", "id", "primitiveUnits", "requiredFeatures", "width", "x", "xlink:href", "y"],
      foreignObject: ["class", "font-size", "height", "id", "opacity", "requiredFeatures", "style", "transform", "width", "x", "y"],
      g: ["class", "clip-path", "clip-rule", "id", "display", "fill", "fill-opacity", "fill-rule", "filter", "mask", "opacity", "requiredFeatures", "stroke", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-width", "style", "systemLanguage", "transform", "font-family", "font-size", "font-style", "font-weight", "text-anchor"],
      image: ["class", "clip-path", "clip-rule", "filter", "height", "id", "mask", "opacity", "requiredFeatures", "style", "systemLanguage", "transform", "width", "x", "xlink:href", "xlink:title", "y"],
      line: ["class", "clip-path", "clip-rule", "fill", "fill-opacity", "fill-rule", "filter", "id", "marker-end", "marker-mid", "marker-start", "mask", "opacity", "requiredFeatures", "stroke", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-width", "style", "systemLanguage", "transform", "x1", "x2", "y1", "y2"],
      linearGradient: ["class", "id", "gradientTransform", "gradientUnits", "requiredFeatures", "spreadMethod", "systemLanguage", "x1", "x2", "xlink:href", "y1", "y2"],
      marker: ["id", "class", "markerHeight", "markerUnits", "markerWidth", "orient", "preserveAspectRatio", "refX", "refY", "systemLanguage", "viewBox"],
      mask: ["class", "height", "id", "maskContentUnits", "maskUnits", "width", "x", "y"],
      metadata: ["class", "id"],
      path: ["class", "clip-path", "clip-rule", "d", "fill", "fill-opacity", "fill-rule", "filter", "id", "marker-end", "marker-mid", "marker-start", "mask", "opacity", "requiredFeatures", "stroke", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-width", "style", "systemLanguage", "transform"],
      pattern: ["class", "height", "id", "patternContentUnits", "patternTransform", "patternUnits", "requiredFeatures", "style", "systemLanguage", "viewBox", "width", "x", "xlink:href", "y"],
      polygon: ["class", "clip-path", "clip-rule", "id", "fill", "fill-opacity", "fill-rule", "filter", "id", "class", "marker-end", "marker-mid", "marker-start", "mask", "opacity", "points", "requiredFeatures", "stroke", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-width", "style", "systemLanguage", "transform"],
      polyline: ["class", "clip-path", "clip-rule", "id", "fill", "fill-opacity", "fill-rule", "filter", "marker-end", "marker-mid", "marker-start", "mask", "opacity", "points", "requiredFeatures", "stroke", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-width", "style", "systemLanguage", "transform"],
      radialGradient: ["class", "cx", "cy", "fx", "fy", "gradientTransform", "gradientUnits", "id", "r", "requiredFeatures", "spreadMethod", "systemLanguage", "xlink:href"],
      rect: ["class", "clip-path", "clip-rule", "fill", "fill-opacity", "fill-rule", "filter", "height", "id", "mask", "opacity", "requiredFeatures", "rx", "ry", "stroke", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-width", "style", "systemLanguage", "transform", "width", "x", "y"],
      stop: ["class", "id", "offset", "requiredFeatures", "stop-color", "stop-opacity", "style", "systemLanguage"],
      svg: ["class", "clip-path", "clip-rule", "filter", "id", "height", "mask", "preserveAspectRatio", "requiredFeatures", "style", "systemLanguage", "viewBox", "width", "x", "xmlns", "xmlns:se", "xmlns:xlink", "y"],
      "switch": ["class", "id", "requiredFeatures", "systemLanguage"],
      symbol: ["class", "fill", "fill-opacity", "fill-rule", "filter", "font-family", "font-size", "font-style", "font-weight", "id", "opacity", "preserveAspectRatio", "requiredFeatures", "stroke", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-width", "style", "systemLanguage", "transform", "viewBox"],
      text: ["class", "clip-path", "clip-rule", "fill", "fill-opacity", "fill-rule", "filter", "font-family", "font-size", "font-style", "font-weight", "id", "mask", "opacity", "requiredFeatures", "stroke", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-width", "style", "systemLanguage", "text-anchor", "transform", "x", "xml:space", "y"],
      textPath: ["class", "id", "method", "requiredFeatures", "spacing", "startOffset", "style", "systemLanguage", "transform", "xlink:href"],
      title: [],
      tspan: ["class", "clip-path", "clip-rule", "dx", "dy", "fill", "fill-opacity", "fill-rule", "filter", "font-family", "font-size", "font-style", "font-weight", "id", "mask", "opacity", "requiredFeatures", "rotate", "stroke", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-width", "style", "systemLanguage", "text-anchor", "textLength", "transform", "x", "xml:space", "y"],
      use: ["class", "clip-path", "clip-rule", "fill", "fill-opacity", "fill-rule", "filter", "height", "id", "mask", "stroke", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-width", "style", "transform", "width", "x", "xlink:href", "y"],
      annotation: ["encoding"],
      "annotation-xml": ["encoding"],
      maction: ["actiontype", "other", "selection"],
      math: ["class", "id", "display", "xmlns"],
      menclose: ["notation"],
      merror: [],
      mfrac: ["linethickness"],
      mi: ["mathvariant"],
      mmultiscripts: [],
      mn: [],
      mo: ["fence", "lspace", "maxsize", "minsize", "rspace", "stretchy"],
      mover: [],
      mpadded: ["lspace", "width", "height", "depth", "voffset"],
      mphantom: [],
      mprescripts: [],
      mroot: [],
      mrow: ["xlink:href", "xlink:type", "xmlns:xlink"],
      mspace: ["depth", "height", "width"],
      msqrt: [],
      mstyle: ["displaystyle", "mathbackground", "mathcolor", "mathvariant", "scriptlevel"],
      msub: [],
      msubsup: [],
      msup: [],
      mtable: ["align", "columnalign", "columnlines", "columnspacing", "displaystyle", "equalcolumns", "equalrows", "frame", "rowalign", "rowlines", "rowspacing", "width"],
      mtd: ["columnalign", "columnspan", "rowalign", "rowspan"],
      mtext: [],
      mtr: ["columnalign", "rowalign"],
      munder: [],
      munderover: [],
      none: [],
      semantics: []
    },
    c = {};
  $.each(j, function(d, l) {
    var h = {};
    $.each(l, function(o, m) {
      if (m.indexOf(":") >= 0) {
        var z = m.split(":");
        h[z[1]] = a[z[0].toUpperCase()]
      } else h[m] = m == "xmlns" ? a.XMLNS : null
    });
    c[d] = h
  });
  svgedit.sanitize.sanitizeSvg = function(d) {
    if (d.nodeType == 3) {
      d.nodeValue = d.nodeValue.replace(/^\s+|\s+$/g, "");
      d.nodeValue.length === 0 && d.parentNode.removeChild(d)
    }
    if (d.nodeType == 1) {
      var l = d.parentNode;
      if (d.ownerDocument && l) {
        var h = j[d.nodeName],
          o = c[d.nodeName],
          m;
        if (typeof h !== "undefined") {
          var z = [];
          for (m = d.attributes.length; m--;) {
            var s = d.attributes.item(m),
              F = s.nodeName,
              A = s.localName,
              i = s.namespaceURI;
            if (!(o.hasOwnProperty(A) && i == o[A] && i != a.XMLNS) && !(i == a.XMLNS && t[s.value])) {
              F.indexOf("se:") === 0 && z.push([F, s.value]);
              d.removeAttributeNS(i, A)
            }
            if (svgedit.browser.isGecko()) switch (F) {
              case "transform":
              case "gradientTransform":
              case "patternTransform":
                A = s.value.replace(/(\d)-/g, "$1 -");
                d.setAttribute(F, A)
            }
            if (F == "style") {
              s = s.value.split(";");
              for (F = s.length; F--;) {
                i = s[F].split(":");
                A = $.trim(i[0]);
                i = $.trim(i[1]);
                h.indexOf(A) >= 0 && d.setAttribute(A, i)
              }
              d.removeAttribute("style")
            }
          }
          $.each(z, function(B, u) {
            d.setAttributeNS(a.SE, u[0], u[1])
          });
          if ((m = svgedit.utilities.getHref(d)) && ["filter", "linearGradient", "pattern", "radialGradient", "textPath", "use"].indexOf(d.nodeName) >= 0) if (m[0] != "#") {
            svgedit.utilities.setHref(d, "");
            d.removeAttributeNS(a.XLINK, "href")
          }
          if (d.nodeName == "use" && !svgedit.utilities.getHref(d)) l.removeChild(d);
          else {
            $.each(["clip-path", "fill", "filter", "marker-end", "marker-mid", "marker-start", "mask", "stroke"], function(B, u) {
              var v = d.getAttribute(u);
              if (v) if ((v = svgedit.utilities.getUrlFromAttr(v)) && v[0] !== "#") {
                d.setAttribute(u, "");
                d.removeAttribute(u)
              }
            });
            for (m = d.childNodes.length; m--;) svgedit.sanitize.sanitizeSvg(d.childNodes.item(m))
          }
        } else {
          for (h = []; d.hasChildNodes();) h.push(l.insertBefore(d.firstChild, d));
          l.removeChild(d);
          for (m = h.length; m--;) svgedit.sanitize.sanitizeSvg(h[m])
        }
      }
    }
  }
})();
(function() {
  if (!svgedit.history) svgedit.history = {};
  svgedit.history.HistoryEventTypes = {
    BEFORE_APPLY: "before_apply",
    AFTER_APPLY: "after_apply",
    BEFORE_UNAPPLY: "before_unapply",
    AFTER_UNAPPLY: "after_unapply"
  };
  svgedit.history.MoveElementCommand = function(a, t, j, c) {
    this.elem = a;
    this.text = c ? "Move " + a.tagName + " to " + c : "Move " + a.tagName;
    this.oldNextSibling = t;
    this.oldParent = j;
    this.newNextSibling = a.nextSibling;
    this.newParent = a.parentNode
  };
  svgedit.history.MoveElementCommand.type = function() {
    return "svgedit.history.MoveElementCommand"
  };
  svgedit.history.MoveElementCommand.prototype.type = svgedit.history.MoveElementCommand.type;
  svgedit.history.MoveElementCommand.prototype.getText = function() {
    return this.text
  };
  svgedit.history.MoveElementCommand.prototype.apply = function(a) {
    a && a.handleHistoryEvent(svgedit.history.HistoryEventTypes.BEFORE_APPLY, this);
    this.elem = this.newParent.insertBefore(this.elem, this.newNextSibling);
    a && a.handleHistoryEvent(svgedit.history.HistoryEventTypes.AFTER_APPLY, this)
  };
  svgedit.history.MoveElementCommand.prototype.unapply = function(a) {
    a && a.handleHistoryEvent(svgedit.history.HistoryEventTypes.BEFORE_UNAPPLY, this);
    this.elem = this.oldParent.insertBefore(this.elem, this.oldNextSibling);
    a && a.handleHistoryEvent(svgedit.history.HistoryEventTypes.AFTER_UNAPPLY, this)
  };
  svgedit.history.MoveElementCommand.prototype.elements = function() {
    return [this.elem]
  };
  svgedit.history.InsertElementCommand = function(a, t) {
    this.elem = a;
    this.text = t || "Create " + a.tagName;
    this.parent = a.parentNode;
    this.nextSibling = this.elem.nextSibling
  };
  svgedit.history.InsertElementCommand.type = function() {
    return "svgedit.history.InsertElementCommand"
  };
  svgedit.history.InsertElementCommand.prototype.type = svgedit.history.InsertElementCommand.type;
  svgedit.history.InsertElementCommand.prototype.getText = function() {
    return this.text
  };
  svgedit.history.InsertElementCommand.prototype.apply = function(a) {
    a && a.handleHistoryEvent(svgedit.history.HistoryEventTypes.BEFORE_APPLY, this);
    this.elem = this.parent.insertBefore(this.elem, this.nextSibling);
    a && a.handleHistoryEvent(svgedit.history.HistoryEventTypes.AFTER_APPLY, this)
  };
  svgedit.history.InsertElementCommand.prototype.unapply = function(a) {
    a && a.handleHistoryEvent(svgedit.history.HistoryEventTypes.BEFORE_UNAPPLY, this);
    this.parent = this.elem.parentNode;
    this.elem = this.elem.parentNode.removeChild(this.elem);
    a && a.handleHistoryEvent(svgedit.history.HistoryEventTypes.AFTER_UNAPPLY, this)
  };
  svgedit.history.InsertElementCommand.prototype.elements = function() {
    return [this.elem]
  };
  svgedit.history.RemoveElementCommand = function(a, t, j, c) {
    this.elem = a;
    this.text = c || "Delete " + a.tagName;
    this.nextSibling = t;
    this.parent = j;
    svgedit.transformlist.removeElementFromListMap(a)
  };
  svgedit.history.RemoveElementCommand.type = function() {
    return "svgedit.history.RemoveElementCommand"
  };
  svgedit.history.RemoveElementCommand.prototype.type = svgedit.history.RemoveElementCommand.type;
  svgedit.history.RemoveElementCommand.prototype.getText = function() {
    return this.text
  };
  svgedit.history.RemoveElementCommand.prototype.apply = function(a) {
    a && a.handleHistoryEvent(svgedit.history.HistoryEventTypes.BEFORE_APPLY, this);
    svgedit.transformlist.removeElementFromListMap(this.elem);
    this.parent = this.elem.parentNode;
    this.elem = this.parent.removeChild(this.elem);
    a && a.handleHistoryEvent(svgedit.history.HistoryEventTypes.AFTER_APPLY, this)
  };
  svgedit.history.RemoveElementCommand.prototype.unapply = function(a) {
    a && a.handleHistoryEvent(svgedit.history.HistoryEventTypes.BEFORE_UNAPPLY, this);
    svgedit.transformlist.removeElementFromListMap(this.elem);
    this.nextSibling == null && window.console && console.log("Error: reference element was lost");
    this.parent.insertBefore(this.elem, this.nextSibling);
    a && a.handleHistoryEvent(svgedit.history.HistoryEventTypes.AFTER_UNAPPLY, this)
  };
  svgedit.history.RemoveElementCommand.prototype.elements = function() {
    return [this.elem]
  };
  svgedit.history.ChangeElementCommand = function(a, t, j) {
    this.elem = a;
    this.text = j ? "Change " + a.tagName + " " + j : "Change " + a.tagName;
    this.newValues = {};
    this.oldValues = t;
    for (var c in t) this.newValues[c] = c == "#text" ? a.textContent : c == "#href" ? svgedit.utilities.getHref(a) : a.getAttribute(c)
  };
  svgedit.history.ChangeElementCommand.type = function() {
    return "svgedit.history.ChangeElementCommand"
  };
  svgedit.history.ChangeElementCommand.prototype.type = svgedit.history.ChangeElementCommand.type;
  svgedit.history.ChangeElementCommand.prototype.getText = function() {
    return this.text
  };
  svgedit.history.ChangeElementCommand.prototype.apply = function(a) {
    a && a.handleHistoryEvent(svgedit.history.HistoryEventTypes.BEFORE_APPLY, this);
    var t = false,
      j;
    for (j in this.newValues) {
      if (this.newValues[j]) if (j == "#text") this.elem.textContent = this.newValues[j];
      else j == "#href" ? svgedit.utilities.setHref(this.elem, this.newValues[j]) : this.elem.setAttribute(j, this.newValues[j]);
      else if (j == "#text") this.elem.textContent = "";
      else {
        this.elem.setAttribute(j, "");
        this.elem.removeAttribute(j)
      }
      if (j == "transform") t = true
    }
    if (!t) if (t = svgedit.utilities.getRotationAngle(this.elem)) {
      j = elem.getBBox();
      t = ["rotate(", t, " ", j.x + j.width / 2, ",", j.y + j.height / 2, ")"].join("");
      t != elem.getAttribute("transform") && elem.setAttribute("transform", t)
    }
    a && a.handleHistoryEvent(svgedit.history.HistoryEventTypes.AFTER_APPLY, this);
    return true
  };
  svgedit.history.ChangeElementCommand.prototype.unapply = function(a) {
    a && a.handleHistoryEvent(svgedit.history.HistoryEventTypes.BEFORE_UNAPPLY, this);
    var t = false,
      j;
    for (j in this.oldValues) {
      if (this.oldValues[j]) if (j == "#text") this.elem.textContent = this.oldValues[j];
      else j == "#href" ? svgedit.utilities.setHref(this.elem, this.oldValues[j]) : this.elem.setAttribute(j, this.oldValues[j]);
      else if (j == "#text") this.elem.textContent = "";
      else this.elem.removeAttribute(j);
      if (j == "transform") t = true
    }
    if (!t) if (t = svgedit.utilities.getRotationAngle(this.elem)) {
      j = elem.getBBox();
      t = ["rotate(", t, " ", j.x + j.width / 2, ",", j.y + j.height / 2, ")"].join("");
      t != elem.getAttribute("transform") && elem.setAttribute("transform", t)
    }
    svgedit.transformlist.removeElementFromListMap(this.elem);
    a && a.handleHistoryEvent(svgedit.history.HistoryEventTypes.AFTER_UNAPPLY, this);
    return true
  };
  svgedit.history.ChangeElementCommand.prototype.elements = function() {
    return [this.elem]
  };
  svgedit.history.BatchCommand = function(a) {
    this.text = a || "Batch Command";
    this.stack = []
  };
  svgedit.history.BatchCommand.type = function() {
    return "svgedit.history.BatchCommand"
  };
  svgedit.history.BatchCommand.prototype.type = svgedit.history.BatchCommand.type;
  svgedit.history.BatchCommand.prototype.getText = function() {
    return this.text
  };
  svgedit.history.BatchCommand.prototype.apply = function(a) {
    a && a.handleHistoryEvent(svgedit.history.HistoryEventTypes.BEFORE_APPLY, this);
    var t, j = this.stack.length;
    for (t = 0; t < j; ++t) this.stack[t].apply(a);
    a && a.handleHistoryEvent(svgedit.history.HistoryEventTypes.AFTER_APPLY, this)
  };
  svgedit.history.BatchCommand.prototype.unapply = function(a) {
    a && a.handleHistoryEvent(svgedit.history.HistoryEventTypes.BEFORE_UNAPPLY, this);
    var t;
    for (t = this.stack.length - 1; t >= 0; t--) this.stack[t].unapply(a);
    a && a.handleHistoryEvent(svgedit.history.HistoryEventTypes.AFTER_UNAPPLY, this)
  };
  svgedit.history.BatchCommand.prototype.elements = function() {
    for (var a = [], t = this.stack.length; t--;) for (var j = this.stack[t].elements(), c = j.length; c--;) a.indexOf(j[c]) == -1 && a.push(j[c]);
    return a
  };
  svgedit.history.BatchCommand.prototype.addSubCommand = function(a) {
    this.stack.push(a)
  };
  svgedit.history.BatchCommand.prototype.isEmpty = function() {
    return this.stack.length === 0
  };
  svgedit.history.UndoManager = function(a) {
    this.handler_ = a || null;
    this.undoStackPointer = 0;
    this.undoStack = [];
    this.undoChangeStackPointer = -1;
    this.undoableChangeStack = []
  };
  svgedit.history.UndoManager.prototype.resetUndoStack = function() {
    this.undoStack = [];
    this.undoStackPointer = 0
  };
  svgedit.history.UndoManager.prototype.getUndoStackSize = function() {
    return this.undoStackPointer
  };
  svgedit.history.UndoManager.prototype.getRedoStackSize = function() {
    return this.undoStack.length - this.undoStackPointer
  };
  svgedit.history.UndoManager.prototype.getNextUndoCommandText = function() {
    return this.undoStackPointer > 0 ? this.undoStack[this.undoStackPointer - 1].getText() : ""
  };
  svgedit.history.UndoManager.prototype.getNextRedoCommandText = function() {
    return this.undoStackPointer < this.undoStack.length ? this.undoStack[this.undoStackPointer].getText() : ""
  };
  svgedit.history.UndoManager.prototype.undo = function() {
    this.undoStackPointer > 0 && this.undoStack[--this.undoStackPointer].unapply(this.handler_)
  };
  svgedit.history.UndoManager.prototype.redo = function() {
    this.undoStackPointer < this.undoStack.length && this.undoStack.length > 0 && this.undoStack[this.undoStackPointer++].apply(this.handler_)
  };
  svgedit.history.UndoManager.prototype.addCommandToHistory = function(a) {
    if (this.undoStackPointer < this.undoStack.length && this.undoStack.length > 0) this.undoStack = this.undoStack.splice(0, this.undoStackPointer);
    this.undoStack.push(a);
    this.undoStackPointer = this.undoStack.length
  };
  svgedit.history.UndoManager.prototype.beginUndoableChange = function(a, t) {
    for (var j = ++this.undoChangeStackPointer, c = t.length, d = Array(c), l = Array(c); c--;) {
      var h = t[c];
      if (h != null) {
        l[c] = h;
        d[c] = h.getAttribute(a)
      }
    }
    this.undoableChangeStack[j] = {
      attrName: a,
      oldValues: d,
      elements: l
    }
  };
  svgedit.history.UndoManager.prototype.finishUndoableChange = function() {
    for (var a = this.undoChangeStackPointer--, t = this.undoableChangeStack[a], j = t.elements.length, c = t.attrName, d = new svgedit.history.BatchCommand("Change " + c); j--;) {
      var l = t.elements[j];
      if (l != null) {
        var h = {};
        h[c] = t.oldValues[j];
        h[c] != l.getAttribute(c) && d.addSubCommand(new svgedit.history.ChangeElementCommand(l, h, c))
      }
    }
    this.undoableChangeStack[a] = null;
    return d
  }
})();
var svgedit = svgedit || {};
(function() {
  if (!svgedit.coords) svgedit.coords = {};
  var a = [0, "z", "M", "m", "L", "l", "C", "c", "Q", "q", "A", "a", "H", "h", "V", "v", "S", "s", "T", "t"],
    t = null;
  svgedit.coords.init = function(j) {
    t = j
  };
  svgedit.coords.remapElement = function(j, c, d) {
    var l, h, o = function(B, u) {
        return svgedit.math.transformPoint(B, u, d)
      },
      m = t.getGridSnapping() && j.parentNode.parentNode.localName === "svg",
      z = function() {
        var B;
        if (m) for (B in c) c[B] = svgedit.utilities.snapToGrid(c[B]);
        svgedit.utilities.assignAttributes(j, c, 1E3, true)
      },
      s = svgedit.utilities.getBBox(j);
    for (l = 0; l < 2; l++) {
      h = l === 0 ? "fill" : "stroke";
      var F = j.getAttribute(h);
      if (F && F.indexOf("url(") === 0) if (d.a < 0 || d.d < 0) {
        F = svgedit.utilities.getRefElem(F).cloneNode(true);
        if (d.a < 0) {
          var A = F.getAttribute("x1"),
            i = F.getAttribute("x2");
          F.setAttribute("x1", -(A - 1));
          F.setAttribute("x2", -(i - 1))
        }
        if (d.d < 0) {
          A = F.getAttribute("y1");
          i = F.getAttribute("y2");
          F.setAttribute("y1", -(A - 1));
          F.setAttribute("y2", -(i - 1))
        }
        F.id = t.getDrawing().getNextId();
        svgedit.utilities.findDefs().appendChild(F);
        j.setAttribute(h, "url(#" + F.id + ")")
      }
    }
    l = j.tagName;
    if (l === "g" || l === "text" || l == "tspan" || l === "use") if (d.a == 1 && d.b == 0 && d.c == 0 && d.d == 1 && (d.e != 0 || d.f != 0)) {
      h = svgedit.math.transformListToTransform(j).matrix;
      h = svgedit.math.matrixMultiply(h.inverse(), d, h);
      c.x = parseFloat(c.x) + h.e;
      c.y = parseFloat(c.y) + h.f
    } else {
      h = svgedit.transformlist.getTransformList(j);
      F = svgroot.createSVGTransform();
      F.setMatrix(svgedit.math.matrixMultiply(svgedit.math.transformListToTransform(h).matrix, d));
      h.clear();
      h.appendItem(F)
    }
    switch (l) {
      case "foreignObject":
      case "rect":
      case "image":
        if (l === "image" && (d.a < 0 || d.d < 0)) {
          h = svgedit.transformlist.getTransformList(j);
          F = svgroot.createSVGTransform();
          F.setMatrix(svgedit.math.matrixMultiply(svgedit.math.transformListToTransform(h).matrix, d));
          h.clear();
          h.appendItem(F)
        } else {
          F = o(c.x, c.y);
          c.width = d.a * c.width;
          c.height = d.d * c.height;
          c.x = F.x + Math.min(0, c.width);
          c.y = F.y + Math.min(0, c.height);
          c.width = Math.abs(c.width);
          c.height = Math.abs(c.height)
        }
        z();
        break;
      case "ellipse":
        o = o(c.cx, c.cy);
        c.cx = o.x;
        c.cy = o.y;
        c.rx = d.a * c.rx;
        c.ry = d.d * c.ry;
        c.rx = Math.abs(c.rx);
        c.ry = Math.abs(c.ry);
        z();
        break;
      case "circle":
        o = o(c.cx, c.cy);
        c.cx = o.x;
        c.cy = o.y;
        o = svgedit.math.transformBox(s.x, s.y, s.width, s.height, d);
        c.r = Math.min((o.tr.x - o.tl.x) / 2, (o.bl.y - o.tl.y) / 2);
        if (c.r) c.r = Math.abs(c.r);
        z();
        break;
      case "line":
        F = o(c.x1, c.y1);
        A = o(c.x2, c.y2);
        c.x1 = F.x;
        c.y1 = F.y;
        c.x2 = A.x;
        c.y2 = A.y;
      case "text":
      case "tspan":
      case "use":
        z();
        break;
      case "g":
        (o = $(j).data("gsvg")) && svgedit.utilities.assignAttributes(o, c, 1E3, true);
        break;
      case "polyline":
      case "polygon":
        z = c.points.length;
        for (l = 0; l < z; ++l) {
          h = c.points[l];
          h = o(h.x, h.y);
          c.points[l].x = h.x;
          c.points[l].y = h.y
        }
        z = c.points.length;
        o = "";
        for (l = 0; l < z; ++l) {
          h = c.points[l];
          o += h.x + "," + h.y + " "
        }
        j.setAttribute("points", o);
        break;
      case "path":
        h = j.pathSegList;
        z = h.numberOfItems;
        c.d = [];
        for (l = 0; l < z; ++l) {
          s = h.getItem(l);
          c.d[l] = {
            type: s.pathSegType,
            x: s.x,
            y: s.y,
            x1: s.x1,
            y1: s.y1,
            x2: s.x2,
            y2: s.y2,
            r1: s.r1,
            r2: s.r2,
            angle: s.angle,
            largeArcFlag: s.largeArcFlag,
            sweepFlag: s.sweepFlag
          }
        }
        z = c.d.length;
        l = c.d[0];
        i = o(l.x, l.y);
        c.d[0].x = i.x;
        c.d[0].y = i.y;
        for (l = 1; l < z; ++l) {
          s = c.d[l];
          h = s.type;
          if (h % 2 == 0) {
            h = o(s.x != undefined ? s.x : i.x, s.y != undefined ? s.y : i.y);
            F = o(s.x1, s.y1);
            A = o(s.x2, s.y2);
            s.x = h.x;
            s.y = h.y;
            s.x1 = F.x;
            s.y1 = F.y;
            s.x2 = A.x;
            s.y2 = A.y
          } else {
            s.x = d.a * s.x;
            s.y = d.d * s.y;
            s.x1 = d.a * s.x1;
            s.y1 = d.d * s.y1;
            s.x2 = d.a * s.x2;
            s.y2 = d.d * s.y2
          }
          s.r1 = d.a * s.r1;
          s.r2 = d.d * s.r2
        }
        o = "";
        z = c.d.length;
        for (l = 0; l < z; ++l) {
          s = c.d[l];
          h = s.type;
          o += a[h];
          switch (h) {
            case 13:
            case 12:
              o += s.x + " ";
              break;
            case 15:
            case 14:
              o += s.y + " ";
              break;
            case 3:
            case 5:
            case 19:
            case 2:
            case 4:
            case 18:
              o += s.x + "," + s.y + " ";
              break;
            case 7:
            case 6:
              o += s.x1 + "," + s.y1 + " " + s.x2 + "," + s.y2 + " " + s.x + "," + s.y + " ";
              break;
            case 9:
            case 8:
              o += s.x1 + "," + s.y1 + " " + s.x + "," + s.y + " ";
              break;
            case 11:
            case 10:
              o += s.r1 + "," + s.r2 + " " + s.angle + " " + +s.largeArcFlag + " " + +s.sweepFlag + " " + s.x + "," + s.y + " ";
              break;
            case 17:
            case 16:
              o += s.x2 + "," + s.y2 + " " + s.x + "," + s.y + " "
          }
        }
        j.setAttribute("d", o)
    }
  }
})();
svgedit = svgedit || {};
(function() {
  if (!svgedit.recalculate) svgedit.recalculate = {};
  var a = svgedit.NS,
    t;
  svgedit.recalculate.init = function(j) {
    t = j
  };
  svgedit.recalculate.updateClipPath = function(j, c, d) {
    j = getRefElem(j).firstChild;
    var l = svgedit.transformlist.getTransformList(j),
      h = t.getSVGRoot().createSVGTransform();
    h.setTranslate(c, d);
    l.appendItem(h);
    svgedit.recalculate.recalculateDimensions(j)
  };
  svgedit.recalculate.recalculateDimensions = function(j) {
    if (j == null) return null;
    if (j.nodeName == "svg" && navigator.userAgent.indexOf("Firefox/20") >= 0) return null;
    var c = t.getSVGRoot(),
      d = svgedit.transformlist.getTransformList(j),
      l;
    if (d && d.numberOfItems > 0) {
      for (l = d.numberOfItems; l--;) {
        var h = d.getItem(l);
        if (h.type === 0) d.removeItem(l);
        else if (h.type === 1) svgedit.math.isIdentity(h.matrix) && d.removeItem(l);
        else h.type === 4 && h.angle === 0 && d.removeItem(l)
      }
      if (d.numberOfItems === 1 && svgedit.utilities.getRotationAngle(j)) return null
    }
    if (!d || d.numberOfItems == 0) {
      j.setAttribute("transform", "");
      j.removeAttribute("transform");
      return null
    }
    if (d) {
      l = d.numberOfItems;
      for (var o = []; l--;) {
        h = d.getItem(l);
        if (h.type === 1) o.push([h.matrix, l]);
        else if (o.length) o = []
      }
      if (o.length === 2) {
        l = c.createSVGTransformFromMatrix(svgedit.math.matrixMultiply(o[1][0], o[0][0]));
        d.removeItem(o[0][1]);
        d.removeItem(o[1][1]);
        d.insertItemBefore(l, o[1][1])
      }
      l = d.numberOfItems;
      if (l >= 2 && d.getItem(l - 2).type === 1 && d.getItem(l - 1).type === 2) {
        o = c.createSVGTransform();
        h = svgedit.math.matrixMultiply(d.getItem(l - 2).matrix, d.getItem(l - 1).matrix);
        o.setMatrix(h);
        d.removeItem(l - 2);
        d.removeItem(l - 2);
        d.appendItem(o)
      }
    }
    switch (j.tagName) {
      case "line":
      case "polyline":
      case "polygon":
      case "path":
        break;
      default:
        if (d.numberOfItems === 1 && d.getItem(0).type === 1 || d.numberOfItems === 2 && d.getItem(0).type === 1 && d.getItem(0).type === 4) return null
    }
    var m = $(j).data("gsvg");
    l = new svgedit.history.BatchCommand("Transform");
    var z = {},
      s = null;
    h = [];
    switch (j.tagName) {
      case "line":
        h = ["x1", "y1", "x2", "y2"];
        break;
      case "circle":
        h = ["cx", "cy", "r"];
        break;
      case "ellipse":
        h = ["cx", "cy", "rx", "ry"];
        break;
      case "foreignObject":
      case "rect":
      case "image":
        h = ["width", "height", "x", "y"];
        break;
      case "use":
      case "text":
      case "tspan":
        h = ["x", "y"];
        break;
      case "polygon":
      case "polyline":
        s = {};
        s.points = j.getAttribute("points");
        o = j.points;
        var F = o.numberOfItems;
        z.points = Array(F);
        var A;
        for (A = 0; A < F; ++A) {
          var i = o.getItem(A);
          z.points[A] = {
            x: i.x,
            y: i.y
          }
        }
        break;
      case "path":
        s = {};
        s.d = j.getAttribute("d");
        z.d = j.getAttribute("d")
    }
    if (h.length) {
      z = $(j).attr(h);
      $.each(z, function(db, ua) {
        z[db] = svgedit.units.convertToNum(db, ua)
      })
    } else if (m) z = {
      x: $(m).attr("x") || 0,
      y: $(m).attr("y") || 0
    };
    if (s == null) {
      s = $.extend(true, {}, z);
      $.each(s, function(db, ua) {
        s[db] = svgedit.units.convertToNum(db, ua)
      })
    }
    s.transform = t.getStartTransform() || "";
    if (j.tagName == "g" && !m || j.tagName == "a") {
      o = svgedit.utilities.getBBox(j);
      var B = {
          x: o.x + o.width / 2,
          y: o.y + o.height / 2
        },
        u = svgedit.math.transformPoint(o.x + o.width / 2, o.y + o.height / 2, svgedit.math.transformListToTransform(d).matrix);
      h = c.createSVGMatrix();
      if (o = svgedit.utilities.getRotationAngle(j)) {
        A = o * Math.PI / 180;
        F = Math.abs(A) > 1.0E-10 ? Math.sin(A) / (1 - Math.cos(A)) : 2 / A;
        for (A = 0; A < d.numberOfItems; ++A) {
          h = d.getItem(A);
          if (h.type == 4) {
            h = h.matrix;
            B.y = (F * h.e + h.f) / 2;
            B.x = (h.e - F * h.f) / 2;
            d.removeItem(A);
            break
          }
        }
      }
      A = h = m = 0;
      var v = d.numberOfItems;
      if (v) var r = d.getItem(0).matrix;
      if (v >= 3 && d.getItem(v - 2).type == 3 && d.getItem(v - 3).type == 2 && d.getItem(v - 1).type == 2) {
        A = 3;
        var O = d.getItem(v - 3).matrix,
          Z = d.getItem(v - 2).matrix,
          ka = d.getItem(v - 1).matrix;
        F = j.childNodes;
        for (i = F.length; i--;) {
          var ea = F.item(i);
          h = m = 0;
          if (ea.nodeType == 1) {
            var ba = svgedit.transformlist.getTransformList(ea);
            if (ba) {
              h = svgedit.math.transformListToTransform(ba).matrix;
              m = svgedit.utilities.getRotationAngle(ea);
              var ia = t.getStartTransform(),
                Pa = [];
              t.setStartTransform(ea.getAttribute("transform"));
              if (m || svgedit.math.hasMatrixTransform(ba)) {
                var Ca = c.createSVGTransform();
                Ca.setMatrix(svgedit.math.matrixMultiply(O, Z, ka, h));
                ba.clear();
                ba.appendItem(Ca);
                Pa.push(Ca)
              } else {
                m = svgedit.math.matrixMultiply(h.inverse(), ka, h);
                Ca = c.createSVGMatrix();
                Ca.e = -m.e;
                Ca.f = -m.f;
                h = svgedit.math.matrixMultiply(Ca.inverse(), h.inverse(), O, Z, ka, h, m.inverse());
                var eb = c.createSVGTransform(),
                  Hb = c.createSVGTransform(),
                  mb = c.createSVGTransform();
                eb.setTranslate(m.e, m.f);
                Hb.setScale(h.a, h.d);
                mb.setTranslate(Ca.e, Ca.f);
                ba.appendItem(mb);
                ba.appendItem(Hb);
                ba.appendItem(eb);
                Pa.push(mb);
                Pa.push(Hb);
                Pa.push(eb)
              }
              l.addSubCommand(svgedit.recalculate.recalculateDimensions(ea));
              t.setStartTransform(ia)
            }
          }
        }
        d.removeItem(v - 1);
        d.removeItem(v - 2);
        d.removeItem(v - 3)
      } else if (v >= 3 && d.getItem(v - 1).type == 1) {
        A = 3;
        h = svgedit.math.transformListToTransform(d).matrix;
        Ca = c.createSVGTransform();
        Ca.setMatrix(h);
        d.clear();
        d.appendItem(Ca)
      } else if ((v == 1 || v > 1 && d.getItem(1).type != 3) && d.getItem(0).type == 2) {
        A = 2;
        m = svgedit.math.transformListToTransform(d).matrix;
        d.removeItem(0);
        h = svgedit.math.transformListToTransform(d).matrix.inverse();
        h = svgedit.math.matrixMultiply(h, m);
        m = h.e;
        h = h.f;
        if (m != 0 || h != 0) {
          F = j.childNodes;
          i = F.length;
          for (v = []; i--;) {
            ea = F.item(i);
            if (ea.nodeType == 1) {
              if (ea.getAttribute("clip-path")) {
                ia = ea.getAttribute("clip-path");
                if (v.indexOf(ia) === -1) {
                  svgedit.recalculate.updateClipPath(ia, m, h);
                  v.push(ia)
                }
              }
              ia = t.getStartTransform();
              t.setStartTransform(ea.getAttribute("transform"));
              if (ba = svgedit.transformlist.getTransformList(ea)) {
                O = c.createSVGTransform();
                O.setTranslate(m, h);
                ba.numberOfItems ? ba.insertItemBefore(O, 0) : ba.appendItem(O);
                l.addSubCommand(svgedit.recalculate.recalculateDimensions(ea));
                ba = j.getElementsByTagNameNS(a.SVG, "use");
                ea = "#" + ea.id;
                for (O = ba.length; O--;) {
                  Z = ba.item(O);
                  if (ea == svgedit.utilities.getHref(Z)) {
                    ka = c.createSVGTransform();
                    ka.setTranslate(-m, -h);
                    svgedit.transformlist.getTransformList(Z).insertItemBefore(ka, 0);
                    l.addSubCommand(svgedit.recalculate.recalculateDimensions(Z))
                  }
                }
                t.setStartTransform(ia)
              }
            }
          }
          v = [];
          t.setStartTransform(ia)
        }
      } else if (v == 1 && d.getItem(0).type == 1 && !o) {
        A = 1;
        h = d.getItem(0).matrix;
        F = j.childNodes;
        for (i = F.length; i--;) {
          ea = F.item(i);
          if (ea.nodeType == 1) {
            ia = t.getStartTransform();
            t.setStartTransform(ea.getAttribute("transform"));
            if (ba = svgedit.transformlist.getTransformList(ea)) {
              m = svgedit.math.matrixMultiply(h, svgedit.math.transformListToTransform(ba).matrix);
              v = c.createSVGTransform();
              v.setMatrix(m);
              ba.clear();
              ba.appendItem(v, 0);
              l.addSubCommand(svgedit.recalculate.recalculateDimensions(ea));
              t.setStartTransform(ia);
              ia = ea.getAttribute("stroke-width");
              ea.getAttribute("stroke") !== "none" && !isNaN(ia) && ea.setAttribute("stroke-width", ia * ((Math.abs(m.a) + Math.abs(m.d)) / 2))
            }
          }
        }
        d.clear()
      } else {
        if (o) {
          c = c.createSVGTransform();
          c.setRotate(o, u.x, u.y);
          d.numberOfItems ? d.insertItemBefore(c, 0) : d.appendItem(c)
        }
        d.numberOfItems == 0 && j.removeAttribute("transform");
        return null
      }
      if (A == 2) {
        if (o) {
          u = {
            x: B.x + r.e,
            y: B.y + r.f
          };
          c = c.createSVGTransform();
          c.setRotate(o, u.x, u.y);
          d.numberOfItems ? d.insertItemBefore(c, 0) : d.appendItem(c)
        }
      } else if (A == 3) {
        h = svgedit.math.transformListToTransform(d).matrix;
        r = c.createSVGTransform();
        r.setRotate(o, B.x, B.y);
        r = r.matrix;
        B = c.createSVGTransform();
        B.setRotate(o, u.x, u.y);
        u = B.matrix.inverse();
        ia = h.inverse();
        u = svgedit.math.matrixMultiply(ia, u, r, h);
        m = u.e;
        h = u.f;
        if (m != 0 || h != 0) {
          F = j.childNodes;
          for (i = F.length; i--;) {
            ea = F.item(i);
            if (ea.nodeType == 1) {
              ia = t.getStartTransform();
              t.setStartTransform(ea.getAttribute("transform"));
              ba = svgedit.transformlist.getTransformList(ea);
              O = c.createSVGTransform();
              O.setTranslate(m, h);
              ba.numberOfItems ? ba.insertItemBefore(O, 0) : ba.appendItem(O);
              l.addSubCommand(svgedit.recalculate.recalculateDimensions(ea));
              t.setStartTransform(ia)
            }
          }
        }
        if (o) d.numberOfItems ? d.insertItemBefore(B, 0) : d.appendItem(B)
      }
    } else {
      o = svgedit.utilities.getBBox(j);
      if (!o && j.tagName != "path") return null;
      h = c.createSVGMatrix();
      if (m = svgedit.utilities.getRotationAngle(j)) {
        B = {
          x: o.x + o.width / 2,
          y: o.y + o.height / 2
        };
        u = svgedit.math.transformPoint(o.x + o.width / 2, o.y + o.height / 2, svgedit.math.transformListToTransform(d).matrix);
        A = m * Math.PI / 180;
        F = Math.abs(A) > 1.0E-10 ? Math.sin(A) / (1 - Math.cos(A)) : 2 / A;
        for (A = 0; A < d.numberOfItems; ++A) {
          h = d.getItem(A);
          if (h.type == 4) {
            h = h.matrix;
            B.y = (F * h.e + h.f) / 2;
            B.x = (h.e - F * h.f) / 2;
            d.removeItem(A);
            break
          }
        }
      }
      A = 0;
      v = d.numberOfItems;
      if (!svgedit.browser.isWebkit()) if ((r = j.getAttribute("fill")) && r.indexOf("url(") === 0) {
        r = getRefElem(r);
        ia = "pattern";
        if (r.tagName !== ia) ia = "gradient";
        if (r.getAttribute(ia + "Units") === "userSpaceOnUse") {
          h = svgedit.math.transformListToTransform(d).matrix;
          o = svgedit.transformlist.getTransformList(r);
          o = svgedit.math.transformListToTransform(o).matrix;
          h = svgedit.math.matrixMultiply(h, o);
          o = "matrix(" + [h.a, h.b, h.c, h.d, h.e, h.f].join(",") + ")";
          r.setAttribute(ia + "Transform", o)
        }
      }
      if (v >= 3 && d.getItem(v - 2).type == 3 && d.getItem(v - 3).type == 2 && d.getItem(v - 1).type == 2) {
        A = 3;
        h = svgedit.math.transformListToTransform(d, v - 3, v - 1).matrix;
        d.removeItem(v - 1);
        d.removeItem(v - 2);
        d.removeItem(v - 3)
      } else if (v == 4 && d.getItem(v - 1).type == 1) {
        A = 3;
        h = svgedit.math.transformListToTransform(d).matrix;
        Ca = c.createSVGTransform();
        Ca.setMatrix(h);
        d.clear();
        d.appendItem(Ca);
        h = c.createSVGMatrix()
      } else if ((v == 1 || v > 1 && d.getItem(1).type != 3) && d.getItem(0).type == 2) {
        A = 2;
        r = d.getItem(0).matrix;
        ia = svgedit.math.transformListToTransform(d, 1).matrix;
        o = ia.inverse();
        h = svgedit.math.matrixMultiply(o, r, ia);
        d.removeItem(0)
      } else if (v == 1 && d.getItem(0).type == 1 && !m) {
        h = svgedit.math.transformListToTransform(d).matrix;
        switch (j.tagName) {
          case "line":
            z = $(j).attr(["x1", "y1", "x2", "y2"]);
          case "polyline":
          case "polygon":
            z.points = j.getAttribute("points");
            if (z.points) {
              o = j.points;
              F = o.numberOfItems;
              z.points = Array(F);
              for (A = 0; A < F; ++A) {
                i = o.getItem(A);
                z.points[A] = {
                  x: i.x,
                  y: i.y
                }
              }
            }
          case "path":
            z.d = j.getAttribute("d");
            A = 1;
            d.clear()
        }
      } else {
        A = 4;
        if (m) {
          c = c.createSVGTransform();
          c.setRotate(m, u.x, u.y);
          d.numberOfItems ? d.insertItemBefore(c, 0) : d.appendItem(c)
        }
        d.numberOfItems == 0 && j.removeAttribute("transform");
        return null
      }
      if (A == 1 || A == 2 || A == 3) svgedit.coords.remapElement(j, z, h);
      if (A == 2) {
        if (m) {
          svgedit.math.hasMatrixTransform(d) || (u = {
            x: B.x + h.e,
            y: B.y + h.f
          });
          c = c.createSVGTransform();
          c.setRotate(m, u.x, u.y);
          d.numberOfItems ? d.insertItemBefore(c, 0) : d.appendItem(c)
        }
        if (j.tagName == "text") {
          F = j.childNodes;
          for (i = F.length; i--;) {
            ea = F.item(i);
            if (ea.tagName == "tspan") {
              c = {
                x: $(ea).attr("x") || 0,
                y: $(ea).attr("y") || 0
              };
              svgedit.coords.remapElement(ea, c, h)
            }
          }
        }
      } else if (A == 3 && m) {
        h = svgedit.math.transformListToTransform(d).matrix;
        r = c.createSVGTransform();
        r.setRotate(m, B.x, B.y);
        r = r.matrix;
        B = c.createSVGTransform();
        B.setRotate(m, u.x, u.y);
        u = B.matrix.inverse();
        ia = h.inverse();
        u = svgedit.math.matrixMultiply(ia, u, r, h);
        svgedit.coords.remapElement(j, z, u);
        if (m) d.numberOfItems ? d.insertItemBefore(B, 0) : d.appendItem(B)
      }
    }
    d.numberOfItems == 0 && j.removeAttribute("transform");
    l.addSubCommand(new svgedit.history.ChangeElementCommand(j, s));
    return l
  }
})();
(function() {
  if (!svgedit.select) svgedit.select = {};
  var a, t, j, c = svgedit.browser.isTouch() ? 10 : 4;
  svgedit.select.Selector = function(d, l) {
    this.id = d;
    this.selectedElement = l;
    this.locked = true;
    this.selectorGroup = a.createSVGElement({
      element: "g",
      attr: {
        id: "selectorGroup" + this.id
      }
    });
    this.selectorRect = this.selectorGroup.appendChild(a.createSVGElement({
      element: "path",
      attr: {
        id: "selectedBox" + this.id,
        fill: "none",
        stroke: "#22C",
        "stroke-width": "1",
        "stroke-dasharray": "5,5",
        style: "pointer-events:none"
      }
    }));
    this.gripCoords = {
      nw: null,
      n: null,
      ne: null,
      e: null,
      se: null,
      s: null,
      sw: null,
      w: null
    };
    this.reset(this.selectedElement)
  };
  svgedit.select.Selector.prototype.reset = function(d) {
    this.locked = true;
    this.selectedElement = d;
    this.resize();
    this.selectorGroup.setAttribute("display", "inline")
  };
  svgedit.select.Selector.prototype.updateGripCursors = function(d) {
    var l, h = [];
    d = Math.round(d / 45);
    if (d < 0) d += 8;
    for (l in j.selectorGrips) h.push(l);
    for (; d > 0;) {
      h.push(h.shift());
      d--
    }
    d = 0;
    for (l in j.selectorGrips) {
      j.selectorGrips[l].setAttribute("style", "cursor:" + h[d] + "-resize");
      d++
    }
  };
  svgedit.select.Selector.prototype.showGrips = function(d) {
    j.selectorGripsGroup.setAttribute("display", d ? "inline" : "none");
    var l = this.selectedElement;
    this.hasGrips = d;
    if (l && d) {
      this.selectorGroup.appendChild(j.selectorGripsGroup);
      this.updateGripCursors(svgedit.utilities.getRotationAngle(l))
    }
  };
  svgedit.select.Selector.prototype.resize = function() {
    var d = this.selectorRect,
      l = j,
      h = l.selectorGrips,
      o = this.selectedElement,
      m = o.getAttribute("stroke-width"),
      z = a.currentZoom(),
      s = 1 / z;
    if (o.getAttribute("stroke") !== "none" && !isNaN(m)) s += m / 2;
    var F = o.tagName;
    if (F === "text") s += 2 / z;
    m = svgedit.transformlist.getTransformList(o);
    m = svgedit.math.transformListToTransform(m).matrix;
    m.e *= z;
    m.f *= z;
    var A = svgedit.utilities.getBBox(o);
    if (F === "g" && !$.data(o, "gsvg")) if (F = a.getStrokedBBox(o.childNodes)) A = F;
    F = A.x; // x
    var i = A.y, // y
      B = A.width; // 宽
    A = A.height; // 高
    s *= z;
    z = svgedit.math.transformBox(F * z, i * z, B * z, A * z, m);
    m = z.aabox;
    F = m.x - s;
    i = m.y - s;
    B = m.width + s * 2;
    var u = m.height + s * 2;
    m = F + B / 2;
    A = i + u / 2;
    if (o = svgedit.utilities.getRotationAngle(o)) {
      F = a.svgRoot().createSVGTransform();
      F.setRotate(-o, m, A);
      F = F.matrix;
      z.tl = svgedit.math.transformPoint(z.tl.x, z.tl.y, F);
      z.tr = svgedit.math.transformPoint(z.tr.x, z.tr.y, F);
      z.bl = svgedit.math.transformPoint(z.bl.x, z.bl.y, F);
      z.br = svgedit.math.transformPoint(z.br.x, z.br.y, F);
      F = z.tl;
      B = F.x;
      u = F.y;
      var v = F.x,
        r = F.y;
      F = Math.min;
      i = Math.max;
      B = F(B, F(z.tr.x, F(z.bl.x, z.br.x))) - s;
      u = F(u, F(z.tr.y, F(z.bl.y, z.br.y))) - s;
      v = i(v, i(z.tr.x, i(z.bl.x, z.br.x))) + s;
      r = i(r, i(z.tr.y, i(z.bl.y, z.br.y))) + s;
      F = B;
      i = u;
      B = v - B;
      u = r - u
    }
    s = a.svgRoot().suspendRedraw(100);
    d.setAttribute("d", "M" + F + "," + i + " L" + (F + B) + "," + i + " " + (F + B) + "," + (i + u) + " " + F + "," + (i + u) + "z");
    this.selectorGroup.setAttribute("transform", o ? "rotate(" + [o, m, A].join(",") + ")" : "");
    this.gripCoords = {
      nw: [F, i],
      ne: [F + B, i],
      sw: [F, i + u],
      se: [F + B, i + u],
      n: [F + B / 2, i],
      w: [F, i + u / 2],
      e: [F + B, i + u / 2],
      s: [F + B / 2, i + u]
    };
    for (var O in this.gripCoords) {
      d = this.gripCoords[O];
      h[O].setAttribute("cx", d[0]);
      h[O].setAttribute("cy", d[1])
    }
    l.rotateGripConnector.setAttribute("x1", F + B / 2);
    l.rotateGripConnector.setAttribute("y1", i);
    l.rotateGripConnector.setAttribute("x2", F + B / 2);
    l.rotateGripConnector.setAttribute("y2", i - c * 5);
    l.rotateGrip.setAttribute("cx", F + B / 2);
    l.rotateGrip.setAttribute("cy", i - c * 5);
    a.svgRoot().unsuspendRedraw(s)
  };
  svgedit.select.SelectorManager = function() {
    this.rubberBandBox = this.selectorParentGroup = null;
    this.selectors = [];
    this.selectorMap = {};
    this.selectorGrips = {
      nw: null,
      n: null,
      ne: null,
      e: null,
      se: null,
      s: null,
      sw: null,
      w: null
    };
    this.rotateGrip = this.rotateGripConnector = this.selectorGripsGroup = null;
    this.initGroup()
  };
  svgedit.select.SelectorManager.prototype.initGroup = function() {
    this.selectorParentGroup && this.selectorParentGroup.parentNode && this.selectorParentGroup.parentNode.removeChild(this.selectorParentGroup);
    this.selectorParentGroup = a.createSVGElement({
      element: "g",
      attr: {
        id: "selectorParentGroup"
      }
    });
    this.selectorGripsGroup = a.createSVGElement({
      element: "g",
      attr: {
        display: "none"
      }
    });
    this.selectorParentGroup.appendChild(this.selectorGripsGroup);
    a.svgRoot().appendChild(this.selectorParentGroup);
    this.selectorMap = {};
    this.selectors = [];
    this.rubberBandBox = null;
    for (var d in this.selectorGrips) {
      var l = a.createSVGElement({
        element: "circle",
        attr: {
          id: "selectorGrip_resize_" + d,
          fill: "#22C",
          r: c,
          style: "cursor:" + d + "-resize",
          "stroke-width": 2,
          "pointer-events": "all"
        }
      });
      $.data(l, "dir", d);
      $.data(l, "type", "resize");
      this.selectorGrips[d] = this.selectorGripsGroup.appendChild(l)
    }
    this.rotateGripConnector = this.selectorGripsGroup.appendChild(a.createSVGElement({
      element: "line",
      attr: {
        id: "selectorGrip_rotateconnector",
        stroke: "#22C",
        "stroke-width": "1"
      }
    }));
    this.rotateGrip = this.selectorGripsGroup.appendChild(a.createSVGElement({
      element: "circle",
      attr: {
        id: "selectorGrip_rotate",
        fill: "lime",
        r: c,
        stroke: "#22C",
        "stroke-width": 2,
        style: "cursor:url(" + t.imgPath + "rotate.png) 12 12, auto;"
      }
    }));
    $.data(this.rotateGrip, "type", "rotate");
    if (!$("#canvasBackground").length) {
      d = t.dimensions;
      d = a.createSVGElement({
        element: "svg",
        attr: {
          id: "canvasBackground",
          width: d[0],
          height: d[1],
          x: 0,
          y: 0,
          overflow: svgedit.browser.isWebkit() ? "none" : "visible",
          style: "pointer-events:none"
        }
      });
      l = a.createSVGElement({
        element: "rect",
        attr: {
          width: "100%",
          height: "100%",
          x: 0,
          y: 0,
          "stroke-width": 1,
          stroke: "#000",
          fill: "#FFF",
          style: "pointer-events:none"
        }
      });
      d.appendChild(l);
      a.svgRoot().insertBefore(d, a.svgContent())
    }
  };
  svgedit.select.SelectorManager.prototype.requestSelector = function(d) {
    if (d == null) return null;
    var l, h = this.selectors.length;
    if (typeof this.selectorMap[d.id] == "object") {
      this.selectorMap[d.id].locked = true;
      return this.selectorMap[d.id]
    }
    for (l = 0; l < h; ++l) if (this.selectors[l] && !this.selectors[l].locked) {
      this.selectors[l].locked = true;
      this.selectors[l].reset(d);
      this.selectorMap[d.id] = this.selectors[l];
      return this.selectors[l]
    }
    this.selectors[h] = new svgedit.select.Selector(h, d);
    this.selectorParentGroup.appendChild(this.selectors[h].selectorGroup);
    this.selectorMap[d.id] = this.selectors[h];
    return this.selectors[h]
  };
  svgedit.select.SelectorManager.prototype.releaseSelector = function(d) {
    if (d != null) {
      var l, h = this.selectors.length,
        o = this.selectorMap[d.id];
      for (l = 0; l < h; ++l) if (this.selectors[l] && this.selectors[l] == o) {
        o.locked == false && console.log("WARNING! selector was released but was already unlocked");
        delete this.selectorMap[d.id];
        o.locked = false;
        o.selectedElement = null;
        o.showGrips(false);
        try {
          o.selectorGroup.setAttribute("display", "none")
        } catch (m) {}
        break
      }
    }
  };
  svgedit.select.SelectorManager.prototype.getRubberBandBox = function() {
    if (!this.rubberBandBox) this.rubberBandBox = this.selectorParentGroup.appendChild(a.createSVGElement({
      element: "rect",
      attr: {
        id: "selectorRubberBand",
        fill: "#22C",
        "fill-opacity": 0.15,
        stroke: "#22C",
        "stroke-width": 0.5,
        display: "none",
        style: "pointer-events:none"
      }
    }));
    return this.rubberBandBox
  };
  svgedit.select.init = function(d, l) {
    t = d;
    a = l;
    j = new svgedit.select.SelectorManager
  };
  svgedit.select.getSelectorManager = function() {
    return j
  }
})();
(function() {
  if (!svgedit.draw) svgedit.draw = {};
  var a = svgedit.NS,
    t = "a,circle,ellipse,foreignObject,g,image,line,path,polygon,polyline,rect,svg,text,tspan,use".split(","),
    j = {
      LET_DOCUMENT_DECIDE: 0,
      ALWAYS_RANDOMIZE: 1,
      NEVER_RANDOMIZE: 2
    },
    c = j.LET_DOCUMENT_DECIDE;
  svgedit.draw.Layer = function(d, l) {
    this.name_ = d;
    this.group_ = l
  };
  svgedit.draw.Layer.prototype.getName = function() {
    return this.name_
  };
  svgedit.draw.Layer.prototype.getGroup = function() {
    return this.group_
  };
  svgedit.draw.randomizeIds = function(d, l) {
    c = d === false ? j.NEVER_RANDOMIZE : j.ALWAYS_RANDOMIZE;
    if (c == j.ALWAYS_RANDOMIZE && !l.getNonce()) l.setNonce(Math.floor(Math.random() * 100001));
    else c == j.NEVER_RANDOMIZE && l.getNonce() && l.clearNonce()
  };
  svgedit.draw.Drawing = function(d, l) {
    if (!d || !d.tagName || !d.namespaceURI || d.tagName != "svg" || d.namespaceURI != a.SVG) throw "Error: svgedit.draw.Drawing instance initialized without a <svg> element";
    this.svgElem_ = d;
    this.obj_num = 0;
    this.idPrefix = l || "svg_";
    this.releasedNums = [];
    this.all_layers = [];
    this.current_layer = null;
    this.nonce_ = "";
    var h = this.svgElem_.getAttributeNS(a.SE, "nonce");
    if (h && c != j.NEVER_RANDOMIZE) this.nonce_ = h;
    else c == j.ALWAYS_RANDOMIZE && this.setNonce(Math.floor(Math.random() * 100001))
  };
  svgedit.draw.Drawing.prototype.getElem_ = function(d) {
    if (this.svgElem_.querySelector) return this.svgElem_.querySelector("#" + d);
    return $(this.svgElem_).find("[id=" + d + "]")[0]
  };
  svgedit.draw.Drawing.prototype.getSvgElem = function() {
    return this.svgElem_
  };
  svgedit.draw.Drawing.prototype.getNonce = function() {
    return this.nonce_
  };
  svgedit.draw.Drawing.prototype.setNonce = function(d) {
    this.svgElem_.setAttributeNS(a.XMLNS, "xmlns:se", a.SE);
    this.svgElem_.setAttributeNS(a.SE, "se:nonce", d);
    this.nonce_ = d
  };
  svgedit.draw.Drawing.prototype.clearNonce = function() {
    this.nonce_ = ""
  };
  svgedit.draw.Drawing.prototype.getId = function() {
    return this.nonce_ ? this.idPrefix + this.nonce_ + "_" + this.obj_num : this.idPrefix + this.obj_num
  };
  svgedit.draw.Drawing.prototype.getNextId = function() {
    var d = this.obj_num,
      l = false;
    if (this.releasedNums.length > 0) {
      this.obj_num = this.releasedNums.pop();
      l = true
    } else this.obj_num++;
    for (var h = this.getId(); this.getElem_(h);) {
      if (l) {
        this.obj_num = d;
        l = false
      }
      this.obj_num++;
      h = this.getId()
    }
    if (l) this.obj_num = d;
    return h
  };
  svgedit.draw.Drawing.prototype.releaseId = function(d) {
    var l = this.idPrefix + (this.nonce_ ? this.nonce_ + "_" : "");
    if (typeof d !== "string" || d.indexOf(l) !== 0) return false;
    d = parseInt(d.substr(l.length), 10);
    if (typeof d !== "number" || d <= 0 || this.releasedNums.indexOf(d) != -1) return false;
    this.releasedNums.push(d);
    return true
  };
  svgedit.draw.Drawing.prototype.getNumLayers = function() {
    return this.all_layers.length
  };
  svgedit.draw.Drawing.prototype.hasLayer = function(d) {
    var l;
    for (l = 0; l < this.getNumLayers(); l++) if (this.all_layers[l][0] == d) return true;
    return false
  };
  svgedit.draw.Drawing.prototype.getLayerName = function(d) {
    if (d >= 0 && d < this.getNumLayers()) return this.all_layers[d][0];
    return ""
  };
  svgedit.draw.Drawing.prototype.getCurrentLayer = function() {
    return this.current_layer
  };
  svgedit.draw.Drawing.prototype.getCurrentLayerName = function() {
    var d;
    for (d = 0; d < this.getNumLayers(); ++d) if (this.all_layers[d][1] == this.current_layer) return this.getLayerName(d);
    return ""
  };
  svgedit.draw.Drawing.prototype.setCurrentLayer = function(d) {
    var l;
    for (l = 0; l < this.getNumLayers(); ++l) if (d == this.getLayerName(l)) {
      if (this.current_layer != this.all_layers[l][1]) {
        this.current_layer.setAttribute("style", "pointer-events:none");
        this.current_layer = this.all_layers[l][1];
        this.current_layer.setAttribute("style", "pointer-events:all")
      }
      return true
    }
    return false
  };
  svgedit.draw.Drawing.prototype.deleteCurrentLayer = function() {
    if (this.current_layer && this.getNumLayers() > 1) {
      var d = this.current_layer.parentNode.removeChild(this.current_layer);
      this.identifyLayers();
      return d
    }
    return null
  };
  svgedit.draw.Drawing.prototype.identifyLayers = function() {
    this.all_layers = [];
    var d = this.svgElem_.childNodes.length,
      l = [],
      h = [],
      o = null,
      m = false,
      z;
    for (z = 0; z < d; ++z) {
      var s = this.svgElem_.childNodes.item(z);
      if (s && s.nodeType == 1) if (s.tagName == "g") {
        m = true;
        var F = $("title", s).text();
        if (!F && svgedit.browser.isOpera() && s.querySelectorAll) F = $(s.querySelectorAll("title")).text();
        if (F) {
          h.push(F);
          this.all_layers.push([F, s]);
          o = s;
          svgedit.utilities.walkTree(s, function(A) {
            A.setAttribute("style", "pointer-events:inherit")
          });
          o.setAttribute("style", "pointer-events:none")
        } else l.push(s)
      } else if (~t.indexOf(s.nodeName)) {
        svgedit.utilities.getBBox(s);
        l.push(s)
      }
    }
    d = this.svgElem_.ownerDocument;
    if (l.length > 0 || !m) {
      for (z = 1; h.indexOf("Layer " + z) >= 0;) z++;
      h = "Layer " + z;
      o = d.createElementNS(a.SVG, "g");
      m = d.createElementNS(a.SVG, "title");
      m.textContent = h;
      o.appendChild(m);
      for (m = 0; m < l.length; ++m) o.appendChild(l[m]);
      this.svgElem_.appendChild(o);
      this.all_layers.push([h, o])
    }
    svgedit.utilities.walkTree(o, function(A) {
      A.setAttribute("style", "pointer-events:inherit")
    });
    this.current_layer = o;
    this.current_layer.setAttribute("style", "pointer-events:all")
  };
  svgedit.draw.Drawing.prototype.createLayer = function(d) {
    var l = this.svgElem_.ownerDocument,
      h = l.createElementNS(a.SVG, "g");
    l = l.createElementNS(a.SVG, "title");
    l.textContent = d;
    h.appendChild(l);
    this.svgElem_.appendChild(h);
    this.identifyLayers();
    return h
  };
  svgedit.draw.Drawing.prototype.getLayerVisibility = function(d) {
    var l = null,
      h;
    for (h = 0; h < this.getNumLayers(); ++h) if (this.getLayerName(h) == d) {
      l = this.all_layers[h][1];
      break
    }
    if (!l) return false;
    return l.getAttribute("display") !== "none"
  };
  svgedit.draw.Drawing.prototype.setLayerVisibility = function(d, l) {
    if (typeof l !== "boolean") return null;
    var h = null,
      o;
    for (o = 0; o < this.getNumLayers(); ++o) if (this.getLayerName(o) == d) {
      h = this.all_layers[o][1];
      break
    }
    if (!h) return null;
    h.getAttribute("display");
    h.setAttribute("display", l ? "inline" : "none");
    return h
  };
  svgedit.draw.Drawing.prototype.getLayerOpacity = function(d) {
    var l;
    for (l = 0; l < this.getNumLayers(); ++l) if (this.getLayerName(l) == d) {
      (d = this.all_layers[l][1].getAttribute("opacity")) || (d = "1.0");
      return parseFloat(d)
    }
    return null
  };
  svgedit.draw.Drawing.prototype.setLayerOpacity = function(d, l) {
    if (!(typeof l !== "number" || l < 0 || l > 1)) {
      var h;
      for (h = 0; h < this.getNumLayers(); ++h) if (this.getLayerName(h) == d) {
        this.all_layers[h][1].setAttribute("opacity", l);
        break
      }
    }
  }
})();
(function() {
  if (!svgedit.path) svgedit.path = {};
  var a = svgedit.NS,
    t = {
      pathNodeTooltip: "Drag node to move it. Double-click node to change segment type",
      pathCtrlPtTooltip: "Drag control point to adjust curve properties"
    },
    j = {
      2: ["x", "y"],
      4: ["x", "y"],
      6: ["x", "y", "x1", "y1", "x2", "y2"],
      8: ["x", "y", "x1", "y1"],
      10: ["x", "y", "r1", "r2", "angle", "largeArcFlag", "sweepFlag"],
      12: ["x"],
      14: ["y"],
      16: ["x", "y", "x2", "y2"],
      18: ["x", "y"]
    },
    c = [],
    d = true,
    l = {};
  svgedit.path.setLinkControlPoints = function(i) {
    d = i
  };
  var h = svgedit.path.path = null;
  svgedit.path.init = function(i) {
    h = i;
    c = [0, "ClosePath"];
    $.each(["Moveto", "Lineto", "CurvetoCubic", "CurvetoQuadratic", "Arc", "LinetoHorizontal", "LinetoVertical", "CurvetoCubicSmooth", "CurvetoQuadraticSmooth"], function(B, u) {
      c.push(u + "Abs");
      c.push(u + "Rel")
    })
  };
  svgedit.path.insertItemBefore = function(i, B, u) {
    i = i.pathSegList;
    if (svgedit.browser.supportsPathInsertItemBefore()) i.insertItemBefore(B, u);
    else {
      var v = i.numberOfItems,
        r = [],
        O;
      for (O = 0; O < v; O++) {
        var Z = i.getItem(O);
        r.push(Z)
      }
      i.clear();
      for (O = 0; O < v; O++) {
        O == u && i.appendItem(B);
        i.appendItem(r[O])
      }
    }
  };
  svgedit.path.ptObjToArr = function(i, B) {
    var u = j[i],
      v = u.length,
      r, O = [];
    for (r = 0; r < v; r++) O[r] = B[u[r]];
    return O
  };
  svgedit.path.getGripPt = function(i, B) {
    var u = {
        x: B ? B.x : i.item.x,
        y: B ? B.y : i.item.y
      },
      v = i.path;
    if (v.matrix) u = svgedit.math.transformPoint(u.x, u.y, v.matrix);
    u.x *= h.getCurrentZoom();
    u.y *= h.getCurrentZoom();
    return u
  };
  svgedit.path.getPointFromGrip = function(i, B) {
    var u = {
      x: i.x,
      y: i.y
    };
    if (B.matrix) {
      i = svgedit.math.transformPoint(u.x, u.y, B.imatrix);
      u.x = i.x;
      u.y = i.y
    }
    u.x /= h.getCurrentZoom();
    u.y /= h.getCurrentZoom();
    return u
  };
  svgedit.path.addPointGrip = function(i, B, u) {
    var v = svgedit.path.getGripContainer(),
      r = svgedit.utilities.getElem("pathpointgrip_" + i);
    if (!r) {
      r = document.createElementNS(a.SVG, "circle");
      svgedit.utilities.assignAttributes(r, {
        id: "pathpointgrip_" + i,
        display: "none",
        r: 4,
        fill: "#0FF",
        stroke: "#00F",
        "stroke-width": 2,
        cursor: "move",
        style: "pointer-events:all",
        "xlink:title": t.pathNodeTooltip
      });
      r = v.appendChild(r);
      $("#pathpointgrip_" + i).dblclick(function() {
        svgedit.path.path && svgedit.path.path.setSegType()
      })
    }
    B && u && svgedit.utilities.assignAttributes(r, {
      cx: B,
      cy: u,
      display: "inline"
    });
    return r
  };
  svgedit.path.getGripContainer = function() {
    var i = svgedit.utilities.getElem("pathpointgrip_container");
    if (!i) {
      i = svgedit.utilities.getElem("selectorParentGroup").appendChild(document.createElementNS(a.SVG, "g"));
      i.id = "pathpointgrip_container"
    }
    return i
  };
  svgedit.path.addCtrlGrip = function(i) {
    var B = svgedit.utilities.getElem("ctrlpointgrip_" + i);
    if (B) return B;
    B = document.createElementNS(a.SVG, "circle");
    svgedit.utilities.assignAttributes(B, {
      id: "ctrlpointgrip_" + i,
      display: "none",
      r: 4,
      fill: "#0FF",
      stroke: "#55F",
      "stroke-width": 1,
      cursor: "move",
      style: "pointer-events:all",
      "xlink:title": t.pathCtrlPtTooltip
    });
    svgedit.path.getGripContainer().appendChild(B);
    return B
  };
  svgedit.path.getCtrlLine = function(i) {
    var B = svgedit.utilities.getElem("ctrlLine_" + i);
    if (B) return B;
    B = document.createElementNS(a.SVG, "line");
    svgedit.utilities.assignAttributes(B, {
      id: "ctrlLine_" + i,
      stroke: "#555",
      "stroke-width": 1,
      style: "pointer-events:none"
    });
    svgedit.path.getGripContainer().appendChild(B);
    return B
  };
  svgedit.path.getPointGrip = function(i, B) {
    var u = svgedit.path.addPointGrip(i.index);
    if (B) {
      var v = svgedit.path.getGripPt(i);
      svgedit.utilities.assignAttributes(u, {
        cx: v.x,
        cy: v.y,
        display: "inline"
      })
    }
    return u
  };
  svgedit.path.getControlPoints = function(i) {
    var B = i.item,
      u = i.index;
    if (!("x1" in B) || !("x2" in B)) return null;
    var v = {};
    svgedit.path.getGripContainer();
    var r = [svgedit.path.path.segs[u - 1].item, B],
      O;
    for (O = 1; O < 3; O++) {
      var Z = u + "c" + O,
        ka = v["c" + O + "_line"] = svgedit.path.getCtrlLine(Z),
        ea = svgedit.path.getGripPt(i, {
          x: B["x" + O],
          y: B["y" + O]
        }),
        ba = svgedit.path.getGripPt(i, {
          x: r[O - 1].x,
          y: r[O - 1].y
        });
      svgedit.utilities.assignAttributes(ka, {
        x1: ea.x,
        y1: ea.y,
        x2: ba.x,
        y2: ba.y,
        display: "inline"
      });
      v["c" + O + "_line"] = ka;
      Z = v["c" + O] = svgedit.path.addCtrlGrip(Z);
      svgedit.utilities.assignAttributes(Z, {
        cx: ea.x,
        cy: ea.y,
        display: "inline"
      });
      v["c" + O] = Z
    }
    return v
  };
  svgedit.path.replacePathSeg = function(i, B, u, v) {
    v = v || svgedit.path.path.elem;
    i = v["createSVGPathSeg" + c[i]].apply(v, u);
    if (svgedit.browser.supportsPathReplaceItem()) v.pathSegList.replaceItem(i, B);
    else {
      u = v.pathSegList;
      v = u.numberOfItems;
      var r = [],
        O;
      for (O = 0; O < v; O++) {
        var Z = u.getItem(O);
        r.push(Z)
      }
      u.clear();
      for (O = 0; O < v; O++) O == B ? u.appendItem(i) : u.appendItem(r[O])
    }
  };
  svgedit.path.getSegSelector = function(i, B) {
    var u = i.index,
      v = svgedit.utilities.getElem("segline_" + u);
    if (!v) {
      var r = svgedit.path.getGripContainer();
      v = document.createElementNS(a.SVG, "path");
      svgedit.utilities.assignAttributes(v, {
        id: "segline_" + u,
        display: "none",
        fill: "none",
        stroke: "#0FF",
        "stroke-width": 2,
        style: "pointer-events:none",
        d: "M0,0 0,0"
      });
      r.appendChild(v)
    }
    if (B) {
      u = i.prev;
      if (!u) {
        v.setAttribute("display", "none");
        return v
      }
      u = svgedit.path.getGripPt(u);
      svgedit.path.replacePathSeg(2, 0, [u.x, u.y], v);
      r = svgedit.path.ptObjToArr(i.type, i.item, true);
      var O;
      for (O = 0; O < r.length; O += 2) {
        u = svgedit.path.getGripPt(i, {
          x: r[O],
          y: r[O + 1]
        });
        r[O] = u.x;
        r[O + 1] = u.y
      }
      svgedit.path.replacePathSeg(i.type, 1, r, v)
    }
    return v
  };
  svgedit.path.smoothControlPoints = function(i, B, u) {
    var v = i.x - u.x,
      r = i.y - u.y,
      O = B.x - u.x,
      Z = B.y - u.y;
    if ((v != 0 || r != 0) && (O != 0 || Z != 0)) {
      i = Math.atan2(r, v);
      B = Math.atan2(Z, O);
      v = Math.sqrt(v * v + r * r);
      O = Math.sqrt(O * O + Z * Z);
      r = h.getSVGRoot().createSVGPoint();
      Z = h.getSVGRoot().createSVGPoint();
      if (i < 0) i += 2 * Math.PI;
      if (B < 0) B += 2 * Math.PI;
      var ka = Math.abs(i - B),
        ea = Math.abs(Math.PI - ka) / 2;
      if (i - B > 0) {
        i = ka < Math.PI ? i + ea : i - ea;
        B = ka < Math.PI ? B - ea : B + ea
      } else {
        i = ka < Math.PI ? i - ea : i + ea;
        B = ka < Math.PI ? B + ea : B - ea
      }
      r.x = v * Math.cos(i) + u.x;
      r.y = v * Math.sin(i) + u.y;
      Z.x = O * Math.cos(B) + u.x;
      Z.y = O * Math.sin(B) + u.y;
      return [r, Z]
    }
  };
  svgedit.path.Segment = function(i, B) {
    this.selected = false;
    this.index = i;
    this.item = B;
    this.type = B.pathSegType;
    this.ctrlpts = [];
    this.segsel = this.ptgrip = null
  };
  svgedit.path.Segment.prototype.showCtrlPts = function(i) {
    for (var B in this.ctrlpts) if (this.ctrlpts.hasOwnProperty(B)) this.ctrlpts[B].setAttribute("display", i ? "inline" : "none")
  };
  svgedit.path.Segment.prototype.selectCtrls = function(i) {
    $("#ctrlpointgrip_" + this.index + "c1, #ctrlpointgrip_" + this.index + "c2").attr("fill", i ? "#0FF" : "#EEE")
  };
  svgedit.path.Segment.prototype.show = function(i) {
    if (this.ptgrip) {
      this.ptgrip.setAttribute("display", i ? "inline" : "none");
      this.segsel.setAttribute("display", i ? "inline" : "none");
      this.showCtrlPts(i)
    }
  };
  svgedit.path.Segment.prototype.select = function(i) {
    if (this.ptgrip) {
      this.ptgrip.setAttribute("stroke", i ? "#0FF" : "#00F");
      this.segsel.setAttribute("display", i ? "inline" : "none");
      this.ctrlpts && this.selectCtrls(i);
      this.selected = i
    }
  };
  svgedit.path.Segment.prototype.addGrip = function() {
    this.ptgrip = svgedit.path.getPointGrip(this, true);
    this.ctrlpts = svgedit.path.getControlPoints(this, true);
    this.segsel = svgedit.path.getSegSelector(this, true)
  };
  svgedit.path.Segment.prototype.update = function(i) {
    if (this.ptgrip) {
      var B = svgedit.path.getGripPt(this);
      svgedit.utilities.assignAttributes(this.ptgrip, {
        cx: B.x,
        cy: B.y
      });
      svgedit.path.getSegSelector(this, true);
      if (this.ctrlpts) {
        if (i) {
          this.item = svgedit.path.path.elem.pathSegList.getItem(this.index);
          this.type = this.item.pathSegType
        }
        svgedit.path.getControlPoints(this)
      }
    }
  };
  svgedit.path.Segment.prototype.move = function(i, B) {
    var u;
    u = this.item;
    u = $.extend({}, u);
    u = this.ctrlpts ? [u.x += i, u.y += B, u.x1, u.y1, u.x2 += i, u.y2 += B] : [u.x += i, u.y += B];
    svgedit.path.replacePathSeg(this.type, this.index, u);
    if (this.next && this.next.ctrlpts) {
      u = this.next.item;
      u = [u.x, u.y, u.x1 += i, u.y1 += B, u.x2, u.y2];
      svgedit.path.replacePathSeg(this.next.type, this.next.index, u)
    }
    if (this.mate) {
      u = this.mate.item;
      u = [u.x += i, u.y += B];
      svgedit.path.replacePathSeg(this.mate.type, this.mate.index, u)
    }
    this.update(true);
    this.next && this.next.update(true)
  };
  svgedit.path.Segment.prototype.setLinked = function(i) {
    var B, u, v;
    if (i == 2) {
      u = 1;
      B = this.next;
      if (!B) return;
      v = this.item
    } else {
      u = 2;
      B = this.prev;
      if (!B) return;
      v = B.item
    }
    var r = $.extend({}, B.item);
    r["x" + u] = v.x + (v.x - this.item["x" + i]);
    r["y" + u] = v.y + (v.y - this.item["y" + i]);
    svgedit.path.replacePathSeg(B.type, B.index, [r.x, r.y, r.x1, r.y1, r.x2, r.y2]);
    B.update(true)
  };
  svgedit.path.Segment.prototype.moveCtrl = function(i, B, u) {
    var v = $.extend({}, this.item);
    v["x" + i] += B;
    v["y" + i] += u;
    svgedit.path.replacePathSeg(this.type, this.index, [v.x, v.y, v.x1, v.y1, v.x2, v.y2]);
    this.update(true)
  };
  svgedit.path.Segment.prototype.setType = function(i, B) {
    svgedit.path.replacePathSeg(i, this.index, B);
    this.type = i;
    this.item = svgedit.path.path.elem.pathSegList.getItem(this.index);
    this.showCtrlPts(i === 6);
    this.ctrlpts = svgedit.path.getControlPoints(this);
    this.update(true)
  };
  svgedit.path.Path = function(i) {
    if (!i || i.tagName !== "path") throw "svgedit.path.Path constructed without a <path> element";
    this.elem = i;
    this.segs = [];
    this.selected_pts = [];
    svgedit.path.path = this;
    this.init()
  };
  svgedit.path.Path.prototype.init = function() {
    $(svgedit.path.getGripContainer()).find("*").each(function() {
      $(this).attr("display", "none")
    });
    var i = this.elem.pathSegList,
      B = i.numberOfItems;
    this.segs = [];
    this.selected_pts = [];
    this.first_seg = null;
    var u;
    for (u = 0; u < B; u++) {
      var v = i.getItem(u);
      v = new svgedit.path.Segment(u, v);
      v.path = this;
      this.segs.push(v)
    }
    i = this.segs;
    v = null;
    for (u = 0; u < B; u++) {
      var r = i[u],
        O = u + 1 >= B ? null : i[u + 1],
        Z = u - 1 < 0 ? null : i[u - 1];
      if (r.type === 2) {
        if (Z && Z.type !== 1) {
          O = i[v];
          O.next = i[v + 1];
          O.next.prev = O;
          O.addGrip()
        }
        v = u
      } else if (O && O.type === 1) {
        r.next = i[v + 1];
        r.next.prev = r;
        r.mate = i[v];
        r.addGrip();
        if (this.first_seg == null) this.first_seg = r
      } else if (O) {
        if (r.type !== 1) {
          r.addGrip();
          if (O && O.type !== 2) {
            r.next = O;
            r.next.prev = r
          }
        }
      } else if (r.type !== 1) {
        O = i[v];
        O.next = i[v + 1];
        O.next.prev = O;
        O.addGrip();
        r.addGrip();
        if (!this.first_seg) this.first_seg = i[v]
      }
    }
    return this
  };
  svgedit.path.Path.prototype.eachSeg = function(i) {
    var B, u = this.segs.length;
    for (B = 0; B < u; B++) if (i.call(this.segs[B], B) === false) break
  };
  svgedit.path.Path.prototype.addSeg = function(i) {
    var B = this.segs[i];
    if (B.prev) {
      var u = B.prev,
        v, r, O;
      switch (B.item.pathSegType) {
        case 4:
          r = (B.item.x + u.item.x) / 2;
          O = (B.item.y + u.item.y) / 2;
          v = this.elem.createSVGPathSegLinetoAbs(r, O);
          break;
        case 6:
          v = (u.item.x + B.item.x1) / 2;
          var Z = (B.item.x1 + B.item.x2) / 2,
            ka = (B.item.x2 + B.item.x) / 2,
            ea = (v + Z) / 2;
          Z = (Z + ka) / 2;
          r = (ea + Z) / 2;
          var ba = (u.item.y + B.item.y1) / 2,
            ia = (B.item.y1 + B.item.y2) / 2;
          u = (B.item.y2 + B.item.y) / 2;
          var Pa = (ba + ia) / 2;
          ia = (ia + u) / 2;
          O = (Pa + ia) / 2;
          v = this.elem.createSVGPathSegCurvetoCubicAbs(r, O, v, ba, ea, Pa);
          svgedit.path.replacePathSeg(B.type, i, [B.item.x, B.item.y, Z, ia, ka, u])
      }
      svgedit.path.insertItemBefore(this.elem, v, i)
    }
  };
  svgedit.path.Path.prototype.deleteSeg = function(i) {
    var B = this.segs[i],
      u = this.elem.pathSegList;
    B.show(false);
    var v = B.next,
      r;
    if (B.mate) {
      r = [v.item.x, v.item.y];
      svgedit.path.replacePathSeg(2, v.index, r);
      svgedit.path.replacePathSeg(4, B.index, r);
      u.removeItem(B.mate.index)
    } else {
      if (!B.prev) {
        r = [v.item.x, v.item.y];
        svgedit.path.replacePathSeg(2, B.next.index, r)
      }
      u.removeItem(i)
    }
  };
  svgedit.path.Path.prototype.subpathIsClosed = function(i) {
    var B = false;
    svgedit.path.path.eachSeg(function(u) {
      if (u <= i) return true;
      if (this.type === 2) return false;
      if (this.type === 1) {
        B = true;
        return false
      }
    });
    return B
  };
  svgedit.path.Path.prototype.removePtFromSelection = function(i) {
    var B = this.selected_pts.indexOf(i);
    if (B != -1) {
      this.segs[i].select(false);
      this.selected_pts.splice(B, 1)
    }
  };
  svgedit.path.Path.prototype.clearSelection = function() {
    this.eachSeg(function() {
      this.select(false)
    });
    this.selected_pts = []
  };
  svgedit.path.Path.prototype.storeD = function() {
    this.last_d = this.elem.getAttribute("d")
  };
  svgedit.path.Path.prototype.show = function(i) {
    this.eachSeg(function() {
      this.show(i)
    });
    i && this.selectPt(this.first_seg.index);
    return this
  };
  svgedit.path.Path.prototype.movePts = function(i, B) {
    for (var u = this.selected_pts.length; u--;) this.segs[this.selected_pts[u]].move(i, B)
  };
  svgedit.path.Path.prototype.moveCtrl = function(i, B) {
    var u = this.segs[this.selected_pts[0]];
    u.moveCtrl(this.dragctrl, i, B);
    d && u.setLinked(this.dragctrl)
  };
  svgedit.path.Path.prototype.setSegType = function(i) {
    this.storeD();
    for (var B = this.selected_pts.length, u; B--;) {
      var v = this.segs[this.selected_pts[B]],
        r = v.prev;
      if (r) {
        if (!i) {
          u = "Toggle Path Segment Type";
          i = v.type == 6 ? 4 : 6
        }
        i = Number(i);
        var O = v.item.x,
          Z = v.item.y,
          ka = r.item.x;
        r = r.item.y;
        var ea;
        switch (i) {
          case 6:
            if (v.olditem) {
              ka = v.olditem;
              ea = [O, Z, ka.x1, ka.y1, ka.x2, ka.y2]
            } else {
              ea = O - ka;
              var ba = Z - r;
              ea = [O, Z, ka + ea / 3, r + ba / 3, O - ea / 3, Z - ba / 3]
            }
            break;
          case 4:
            ea = [O, Z];
            v.olditem = v.item
        }
        v.setType(i, ea)
      }
    }
    svgedit.path.path.endChanges(u)
  };
  svgedit.path.Path.prototype.selectPt = function(i, B) {
    this.clearSelection();
    i == null && this.eachSeg(function(u) {
      if (this.prev) i = u
    });
    this.addPtsToSelection(i);
    if (B) {
      this.dragctrl = B;
      d && this.segs[i].setLinked(B)
    }
  };
  svgedit.path.Path.prototype.update = function() {
    var i = this.elem;
    if (svgedit.utilities.getRotationAngle(i)) {
      this.matrix = svgedit.math.getMatrix(i);
      this.imatrix = this.matrix.inverse()
    } else this.imatrix = this.matrix = null;
    this.eachSeg(function(B) {
      this.item = i.pathSegList.getItem(B);
      this.update()
    });
    return this
  };
  svgedit.path.getPath_ = function(i) {
    var B = l[i.id];
    B || (B = l[i.id] = new svgedit.path.Path(i));
    return B
  };
  svgedit.path.removePath_ = function(i) {
    i in l && delete l[i]
  };
  var o, m, z, s, F, A = function(i, B) {
    var u = i - z,
      v = B - s,
      r = Math.sqrt(u * u + v * v);
    v = Math.atan2(v, u) + F;
    u = r * Math.cos(v) + z;
    v = r * Math.sin(v) + s;
    u -= o;
    v -= m;
    r = Math.sqrt(u * u + v * v);
    v = Math.atan2(v, u) - F;
    return {
      x: r * Math.cos(v) + o,
      y: r * Math.sin(v) + m
    }
  };
  svgedit.path.recalcRotatedPath = function() {
    var i = svgedit.path.path.elem;
    if (F = svgedit.utilities.getRotationAngle(i, true)) {
      var B = svgedit.utilities.getBBox(i),
        u = svgedit.path.path.oldbbox;
      z = u.x + u.width / 2;
      s = u.y + u.height / 2;
      o = B.x + B.width / 2;
      m = B.y + B.height / 2;
      u = o - z;
      var v = m - s;
      B = Math.sqrt(u * u + v * v);
      u = Math.atan2(v, u) + F;
      o = B * Math.cos(u) + z;
      m = B * Math.sin(u) + s;
      B = i.pathSegList;
      for (u = B.numberOfItems; u;) {
        u -= 1;
        var r = B.getItem(u);
        v = r.pathSegType;
        if (v != 1) {
          var O = A(r.x, r.y);
          O = [O.x, O.y];
          if (r.x1 != null && r.x2 != null) {
            var Z = A(r.x1, r.y1);
            r = A(r.x2, r.y2);
            O.splice(O.length, 0, Z.x, Z.y, r.x, r.y)
          }
          svgedit.path.replacePathSeg(v, u, O)
        }
      }
      svgedit.utilities.getBBox(i);
      B = svgroot.createSVGTransform();
      i = svgedit.transformlist.getTransformList(i);
      B.setRotate(F * 180 / Math.PI, o, m);
      i.replaceItem(B, 0)
    }
  };
  svgedit.path.clearData = function() {
    l = {}
  }
})();
(function() {
  if (!window.console) {
    window.console = {};
    window.console.log = function() {};
    window.console.dir = function() {}
  }
  if (window.opera) {
    window.console.log = function(a) {
      opera.postError(a)
    };
    window.console.dir = function() {}
  }
})();
$.SvgCanvas = function(a, t) {
  function j() {
    xa();
    var b = [],
      f = {
        feGaussianBlur: qb.exportNoBlur,
        foreignObject: qb.exportNoforeignObject,
        "[stroke-dasharray]": qb.exportNoDashArray
      },
      e = $(s);
    if (!("font" in $("<canvas>")[0].getContext("2d"))) f.text = qb.exportNoText;
    $.each(f, function(q, k) {
      e.find(q).length && b.push(k)
    });
    return b
  }
  function c(b, f) {
    var e, q = svgedit.utilities.getBBox(b);
    for (e = 0; e < 2; e++) {
      var k = e === 0 ? "fill" : "stroke",
        D = b.getAttribute(k);
      if (D && D.indexOf("url(") === 0) {
        D = svgedit.utilities.getRefElem(D);
        if (D.tagName === "linearGradient") {
          var p = D.getAttribute("x1") || 0,
            w = D.getAttribute("y1") || 0,
            C = D.getAttribute("x2") || 1,
            I = D.getAttribute("y2") || 0;
          p = q.width * p + q.x;
          w = q.height * w + q.y;
          C = q.width * C + q.x;
          I = q.height * I + q.y;
          p = svgedit.math.transformPoint(p, w, f);
          I = svgedit.math.transformPoint(C, I, f);
          C = {};
          C.x1 = (p.x - q.x) / q.width;
          C.y1 = (p.y - q.y) / q.height;
          C.x2 = (I.x - q.x) / q.width;
          C.y2 = (I.y - q.y) / q.height;
          D = D.cloneNode(true);
          $(D).attr(C);
          D.id = Ha();
          svgedit.utilities.findDefs().appendChild(D);
          b.setAttribute(k, "url(#" + D.id + ")")
        }
      }
    }
  }
  var d = svgedit.NS,
    l = {
      show_outside_canvas: true,
      selectNew: true,
      dimensions: [640, 480]
    };
  t && $.extend(l, t);
  var h = l.dimensions,
    o = this,
    m = a.ownerDocument,
    z = m.importNode(svgedit.utilities.text2xml('<svg id="svgroot" xmlns="' + d.SVG + '" xlinkns="' + d.XLINK + '" width="' + h[0] + '" height="' + h[1] + '" x="' + h[0] + '" y="' + h[1] + '" overflow="visible"><defs><filter id="canvashadow" filterUnits="objectBoundingBox"><feGaussianBlur in="SourceAlpha" stdDeviation="4" result="blur"/><feOffset in="blur" dx="5" dy="5" result="offsetBlur"/><feMerge><feMergeNode in="offsetBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs></svg>').documentElement, true);
  a.appendChild(z);
  var s = m.createElementNS(d.SVG, "svg");
  (o.clearSvgContentElement = function() {
    for (; s.firstChild;) s.removeChild(s.firstChild);
    $(s).attr({
      id: "svgcontent",
      width: h[0],
      height: h[1],
      x: h[0],
      y: h[1],
      overflow: l.show_outside_canvas ? "visible" : "hidden",
      xmlns: d.SVG,
      "xmlns:se": d.SE,
      "xmlns:xlink": d.XLINK
    }).appendTo(z);
    var b = m.createComment(" Created with SVG-edit - http://svg-edit.googlecode.com/ ");
    s.appendChild(b)
  })();
  var F = "svg_";
  o.setIdPrefix = function(b) {
    F = b
  };
  o.current_drawing_ = new svgedit.draw.Drawing(s, F);
  var A = o.getCurrentDrawing = function() {
      return o.current_drawing_
    },
    i = 1,
    B = null,
    u = {
      shape: {
        fill: (l.initFill.color == "none" ? "" : "#") + l.initFill.color,
        fill_paint: null,
        fill_opacity: l.initFill.opacity,
        stroke: "#" + l.initStroke.color,
        stroke_paint: null,
        stroke_opacity: l.initStroke.opacity,
        stroke_width: l.initStroke.width,
        stroke_dasharray: "none",
        stroke_linejoin: "miter",
        stroke_linecap: "butt",
        opacity: l.initOpacity
      }
    };
  u.text = $.extend(true, {}, u.shape);
  $.extend(u.text, {
    fill: "#000000",
    stroke_width: 0,
    font_size: 24,
    font_family: "serif"
  });
  var v = u.shape,
    r = Array(1),
    O = this.addSvgElementFromJson = function(b) {
      var f = svgedit.utilities.getElem(b.attr.id),
        e = A().getCurrentLayer();
      if (f && b.element != f.tagName) {
        e.removeChild(f);
        f = null
      }
      if (!f) {
        f = m.createElementNS(d.SVG, b.element);
        if (e)(B || e).appendChild(f)
      }
      b.curStyles && svgedit.utilities.assignAttributes(f, {
        fill: v.fill,
        stroke: v.stroke,
        "stroke-width": v.stroke_width,
        "stroke-dasharray": v.stroke_dasharray,
        "stroke-linejoin": v.stroke_linejoin,
        "stroke-linecap": v.stroke_linecap,
        "stroke-opacity": v.stroke_opacity,
        "fill-opacity": v.fill_opacity,
        opacity: v.opacity / 2,
        style: "pointer-events:inherit"
      }, 100);
      svgedit.utilities.assignAttributes(f, b.attr, 100);
      svgedit.utilities.cleanupElement(f);
      return f
    };
  o.getTransformList = svgedit.transformlist.getTransformList;
  var Z = svgedit.math.transformPoint,
    ka = o.matrixMultiply = svgedit.math.matrixMultiply,
    ea = o.hasMatrixTransform = svgedit.math.hasMatrixTransform,
    ba = o.transformListToTransform = svgedit.math.transformListToTransform;
  svgedit.units.init({
    getBaseUnit: function() {
      return l.baseUnit
    },
    getElement: svgedit.utilities.getElem,
    getHeight: function() {
      return s.getAttribute("height") / i
    },
    getWidth: function() {
      return s.getAttribute("width") / i
    },
    getRoundDigits: function() {
      return Xa.round_digits
    }
  });
  o.convertToNum = svgedit.units.convertToNum;
  svgedit.utilities.init({
    getDOMDocument: function() {
      return m
    },
    getDOMContainer: function() {
      return a
    },
    getSVGRoot: function() {
      return z
    },
    getSelectedElements: function() {
      return r
    },
    getSVGContent: function() {
      return s
    },
    getBaseUnit: function() {
      return l.baseUnit
    },
    getSnappingStep: function() {
      return l.snappingStep
    }
  });
  var ia = o.findDefs = svgedit.utilities.findDefs,
    Pa = o.getUrlFromAttr = svgedit.utilities.getUrlFromAttr,
    Ca = o.getHref = svgedit.utilities.getHref,
    eb = o.setHref = svgedit.utilities.setHref,
    Hb = svgedit.utilities.getPathBBox;
  o.getBBox = svgedit.utilities.getBBox;
  o.getRotationAngle = svgedit.utilities.getRotationAngle;
  var mb = o.getElem = svgedit.utilities.getElem;
  o.getRefElem = svgedit.utilities.getRefElem;
  var db = o.assignAttributes = svgedit.utilities.assignAttributes,
    ua = this.cleanupElement = svgedit.utilities.cleanupElement;
  svgedit.coords.init({
    getDrawing: function() {
      return A()
    },
    getGridSnapping: function() {
      return l.gridSnapping
    }
  });
  var Sb = this.remapElement = svgedit.coords.remapElement;
  svgedit.recalculate.init({
    getSVGRoot: function() {
      return z
    },
    getStartTransform: function() {
      return nb
    },
    setStartTransform: function(b) {
      nb = b
    }
  });
  var Ib = this.recalculateDimensions = svgedit.recalculate.recalculateDimensions,
    bb = svgedit.getReverseNS(),
    Jb = o.sanitizeSvg = svgedit.sanitize.sanitizeSvg,
    yb = svgedit.history.MoveElementCommand,
    cb = svgedit.history.InsertElementCommand,
    Ua = svgedit.history.RemoveElementCommand,
    ib = svgedit.history.ChangeElementCommand,
    Xb = svgedit.history.BatchCommand,
    W;
  o.undoMgr = new svgedit.history.UndoManager({
    handleHistoryEvent: function(b, f) {
      var e = svgedit.history.HistoryEventTypes;
      if (b == e.BEFORE_UNAPPLY || b == e.BEFORE_APPLY) o.clearSelection();
      else if (b == e.AFTER_APPLY || b == e.AFTER_UNAPPLY) {
        var q = f.elements();
        o.pathActions.clear();
        W("changed", q);
        q = f.type();
        e = b == e.AFTER_APPLY;
        if (q == yb.type())(e ? f.newParent : f.oldParent) == s && o.identifyLayers();
        else if (q == cb.type() || q == Ua.type()) {
          f.parent == s && o.identifyLayers();
          if (q == cb.type()) e && Na(f.elem);
          else e || Na(f.elem);
          f.elem.tagName === "use" && zb(f.elem)
        } else if (q == ib.type()) {
          f.elem.tagName == "title" && f.elem.parentNode.parentNode == s && o.identifyLayers();
          e = e ? f.newValues : f.oldValues;
          e.stdDeviation && o.setBlurOffsets(f.elem.parentNode, e.stdDeviation)
        }
      }
    }
  });
  var pa = function(b) {
    o.undoMgr.addCommandToHistory(b)
  };
  svgedit.select.init(l, {
    createSVGElement: function(b) {
      return o.addSvgElementFromJson(b)
    },
    svgRoot: function() {
      return z
    },
    svgContent: function() {
      return s
    },
    currentZoom: function() {
      return i
    },
    getStrokedBBox: function(b) {
      return o.getStrokedBBox([b])
    }
  });
  var qa = this.selectorManager = svgedit.select.getSelectorManager();
  svgedit.path.init({
    getCurrentZoom: function() {
      return i
    },
    getSVGRoot: function() {
      return z
    }
  });
  var qb = {
      exportNoBlur: "Blurred elements will appear as un-blurred",
      exportNoforeignObject: "foreignObject elements will not appear",
      exportNoDashArray: "Strokes will appear filled",
      exportNoText: "Text may not appear as expected"
    },
    Tb = ["clip-path", "fill", "filter", "marker-end", "marker-mid", "marker-start", "mask", "stroke"],
    rb = $.data,
    Ab = document.createElementNS(d.SVG, "animate");
  $(Ab).attr({
    attributeName: "opacity",
    begin: "indefinite",
    dur: 1,
    fill: "freeze"
  }).appendTo(z);
  var Na = function(b) {
      var f, e = $(b).attr(Tb);
      for (f in e) {
        var q = e[f];
        if (q && q.indexOf("url(") === 0) {
          q = svgedit.utilities.getUrlFromAttr(q).substr(1);
          if (!mb(q)) {
            svgedit.utilities.findDefs().appendChild(Bb[q]);
            delete Bb[q]
          }
        }
      }
      e = b.getElementsByTagName("*");
      if (e.length) {
        b = 0;
        for (f = e.length; b < f; b++) Na(e[b])
      }
    },
    jb = {},
    na = l.imgPath + "logo.png",
    Qa = [],
    Xa = {
      round_digits: 5
    },
    Ba = false,
    nb = null,
    va = "select",
    kb = "none",
    lb = {},
    Va = u.text,
    ya = v,
    Kb = null,
    Da = null,
    hb = [],
    La = {},
    Cb = null,
    Bb = {};
  o.clipBoard = [];
  var tb = this.runExtensions = function(b, f, e) {
    var q = e ? [] : false;
    $.each(La, function(k, D) {
      if (D && b in D) if (e) q.push(D[b](f));
      else q = D[b](f)
    });
    return q
  };
  this.addExtension = function(b, f) {
    var e;
    if (b in La) console.log('Cannot add extension "' + b + '", an extension by that name already exists.');
    else {
      e = $.isFunction(f) ? f($.extend(o.getPrivateMethods(), {
        svgroot: z,
        svgcontent: s,
        nonce: A().getNonce(),
        selectorManager: qa
      })) : f;
      La[b] = e;
      W("extension_added", e)
    }
  };
  var Ya = this.round = function(b) {
      return parseInt(b * i, 10) / i
    },
    ub = this.getIntersectionList = function(b) {
      if (Da == null) return null;
      var f = B || A().getCurrentLayer();
      hb.length || (hb = Ub(f));
      var e = null;
      try {
        e = f.getIntersectionList(b, null)
      } catch (q) {}
      if (e == null || typeof e.item != "function") {
        e = [];
        if (b) b = b;
        else {
          b = Da.getBBox();
          var k;
          f = {};
          for (k in b) f[k] = b[k] / i;
          b = f
        }
        for (k = hb.length; k--;) b.width && svgedit.math.rectsIntersect(b, hb[k].bbox) && e.push(hb[k].elem)
      }
      return e
    };
  getStrokedBBox = this.getStrokedBBox = function(b) {
    b || (b = Ta());
    if (!b.length) return false;
    var f = function(I) {
        try {
          var K = svgedit.utilities.getBBox(I),
            E = svgedit.utilities.getRotationAngle(I);
          if (E && E % 90 || svgedit.math.hasMatrixTransform(svgedit.transformlist.getTransformList(I))) {
            E = false;
            if (["ellipse", "path", "line", "polyline", "polygon"].indexOf(I.tagName) >= 0) K = E = o.convertToPath(I, true);
            else if (I.tagName == "rect") {
              var N = I.getAttribute("rx"),
                S = I.getAttribute("ry");
              if (N || S) K = E = o.convertToPath(I, true)
            }
            if (!E) {
              var U = I.cloneNode(true),
                X = document.createElementNS(d.SVG, "g"),
                da = I.parentNode;
              da.appendChild(X);
              X.appendChild(U);
              K = svgedit.utilities.bboxToObj(X.getBBox());
              da.removeChild(X)
            }
          }
          return K
        } catch (R) {
          console.log(I, R);
          return null
        }
      },
      e;
    $.each(b, function() {
      if (!e) if (this.parentNode) e = f(this)
    });
    if (e == null) return null;
    var q = e.x + e.width,
      k = e.y + e.height,
      D = e.x,
      p = e.y,
      w = function(I) {
        var K = I.getAttribute("stroke-width"),
          E = 0;
        if (I.getAttribute("stroke") != "none" && !isNaN(K)) E += K / 2;
        return E
      },
      C = [];
    $.each(b, function(I, K) {
      var E = f(K);
      if (E) {
        var N = w(K);
        D = Math.min(D, E.x - N);
        p = Math.min(p, E.y - N);
        C.push(E)
      }
    });
    e.x = D;
    e.y = p;
    $.each(b, function(I, K) {
      var E = C[I];
      if (E && K.nodeType == 1) {
        var N = w(K);
        q = Math.max(q, E.x + E.width + N);
        k = Math.max(k, E.y + E.height + N)
      }
    });
    e.width = q - D;
    e.height = k - p;
    return e
  };
  var Ta = this.getVisibleElements = function(b) {
      b || (b = $(s).children());
      var f = [];
      $(b).children().each(function(e, q) {
        try {
          q.getBBox() && f.push(q)
        } catch (k) {}
      });
      return f.reverse()
    },
    Ub = this.getVisibleElementsAndBBoxes = function(b) {
      b || (b = $(s).children());
      var f = [];
      $(b).children().each(function(e, q) {
        try {
          q.getBBox() && f.push({
            elem: q,
            bbox: getStrokedBBox([q])
          })
        } catch (k) {}
      });
      return f.reverse()
    },
    Lb = this.groupSvgElem = function(b) {
      var f = document.createElementNS(d.SVG, "g");
      b.parentNode.replaceChild(f, b);
      $(f).append(b).data("gsvg", b)[0].id = Ha()
    },
    ob = function(b) {
      var f = document.createElementNS(b.namespaceURI, b.nodeName);
      $.each(b.attributes, function(q, k) {
        k.localName != "-moz-math-font-style" && f.setAttributeNS(k.namespaceURI, k.nodeName, k.value)
      });
      f.removeAttribute("id");
      f.id = Ha();
      if (svgedit.browser.isWebkit() && b.nodeName == "path") {
        var e = ra.convertPath(b);
        f.setAttribute("d", e)
      }
      $.each(b.childNodes, function(q, k) {
        switch (k.nodeType) {
          case 1:
            f.appendChild(ob(k));
            break;
          case 3:
            f.textContent = k.nodeValue
        }
      });
      if ($(b).data("gsvg")) $(f).data("gsvg", f.firstChild);
      else if ($(b).data("symbol")) {
        b = $(b).data("symbol");
        $(f).data("ref", b).data("symbol", b)
      } else f.tagName == "image" && vb(f);
      return f
    },
    Za, Ha, Ka, ra;
  (function(b) {
    var f = {};
    Za = b.getId = function() {
      return A().getId()
    };
    Ha = b.getNextId = function() {
      return A().getNextId()
    };
    W = b.call = function(e, q) {
      if (f[e]) return f[e](this, q)
    };
    b.bind = function(e, q) {
      var k = f[e];
      f[e] = q;
      return k
    }
  })(o);
  this.prepareSvg = function(b) {
    this.sanitizeSvg(b.documentElement);
    var f, e, q = b.getElementsByTagNameNS(d.SVG, "path");
    b = 0;
    for (e = q.length; b < e; ++b) {
      f = q[b];
      f.setAttribute("d", ra.convertPath(f));
      ra.fixEnd(f)
    }
  };
  var Db = function(b) {
    if (!svgedit.browser.isGecko()) return b;
    var f = b.cloneNode(true);
    b.parentNode.insertBefore(f, b);
    b.parentNode.removeChild(b);
    qa.releaseSelector(b);
    r[0] = f;
    qa.requestSelector(f).showGrips(true);
    return f
  };
  this.setRotationAngle = function(b, f) {
    b = parseFloat(b);
    var e = r[0],
      q = e.getAttribute("transform"),
      k = svgedit.utilities.getBBox(e),
      D = k.x + k.width / 2,
      p = k.y + k.height / 2;
    k = svgedit.transformlist.getTransformList(e);
    k.numberOfItems > 0 && k.getItem(0).type == 4 && k.removeItem(0);
    if (b != 0) {
      D = svgedit.math.transformPoint(D, p, svgedit.math.transformListToTransform(k).matrix);
      p = z.createSVGTransform();
      p.setRotate(b, D.x, D.y);
      k.numberOfItems ? k.insertItemBefore(p, 0) : k.appendItem(p)
    } else k.numberOfItems == 0 && e.removeAttribute("transform");
    if (!f) {
      k = e.getAttribute("transform");
      e.setAttribute("transform", q);
      Ma("transform", k, r);
      W("changed", r)
    }
    svgedit.utilities.getElem("pathpointgrip_container");
    e = qa.requestSelector(r[0]);
    e.resize();
    e.updateGripCursors(b)
  };
  var Mb = this.recalculateAllSelectedDimensions = function() {
      for (var b = new svgedit.history.BatchCommand(kb == "none" ? "position" : "size"), f = r.length; f--;) {
        var e = svgedit.recalculate.recalculateDimensions(r[f]);
        e && b.addSubCommand(e)
      }
      if (!b.isEmpty()) {
        pa(b);
        W("changed", r)
      }
    },
    gc = [0, "z", "M", "m", "L", "l", "C", "c", "Q", "q", "A", "a", "H", "h", "V", "v", "S", "s", "T", "t"],
    Yb = function(b) {
      console.log([b.a, b.b, b.c, b.d, b.e, b.f])
    },
    fb = null,
    xa = this.clearSelection = function(b) {
      if (r[0] != null) {
        var f, e, q = r.length;
        for (f = 0; f < q; ++f) {
          e = r[f];
          if (e == null) break;
          qa.releaseSelector(e);
          r[f] = null
        }
      }
      b || W("selected", r)
    },
    gb = this.addToSelection = function(b, f) {
      if (b.length != 0) {
        for (var e = 0; e < r.length;) {
          if (r[e] == null) break;
          ++e
        }
        for (var q = b.length; q--;) {
          var k = b[q];
          if (k && svgedit.utilities.getBBox(k)) {
            if (k.tagName === "a" && k.childNodes.length === 1) k = k.firstChild;
            if (r.indexOf(k) == -1) {
              r[e] = k;
              e++;
              k = qa.requestSelector(k);
              r.length > 1 && k.showGrips(false)
            }
          }
        }
        W("selected", r);
        f || r.length == 1 ? qa.requestSelector(r[0]).showGrips(true) : qa.requestSelector(r[0]).showGrips(false);
        for (r.sort(function(D, p) {
          if (D && p && D.compareDocumentPosition) return 3 - (p.compareDocumentPosition(D) & 6);
          if (D == null) return 1
        }); r[0] == null;) r.shift(0)
      }
    },
    $a = this.selectOnly = function(b, f) {
      xa(true);
      gb(b, f)
    };
  this.removeFromSelection = function(b) {
    if (r[0] != null) if (b.length != 0) {
      var f, e = 0,
        q = [],
        k = r.length;
      q.length = k;
      for (f = 0; f < k; ++f) {
        var D = r[f];
        if (D) if (b.indexOf(D) == -1) {
          q[e] = D;
          e++
        } else qa.releaseSelector(D)
      }
      r = q
    }
  };
  this.selectAllInCurrentLayer = function() {
    var b = A().getCurrentLayer();
    if (b) {
      va = "select";
      $a($(B || b).children())
    }
  };
  var Eb = this.getMouseTarget = function(b) {
    if (b == null) return null;
    b = b.target;
    if (b.correspondingUseElement) b = b.correspondingUseElement;
    if ([d.MATH, d.HTML].indexOf(b.namespaceURI) >= 0 && b.id != "svgcanvas") for (; b.nodeName != "foreignObject";) {
      b = b.parentNode;
      if (!b) return z
    }
    var f = A().getCurrentLayer();
    if ([z, a, s, f].indexOf(b) >= 0) return z;
    if ($(b).closest("#selectorParentGroup").length) return qa.selectorParentGroup;
    for (; b.parentNode !== (B || f);) b = b.parentNode;
    return b
  };
  (function() {
    var b = null,
      f = null,
      e = null,
      q = null,
      k = null,
      D = {},
      p = {
        minx: null,
        miny: null,
        maxx: null,
        maxy: null
      },
      w = 0,
      C = {
        x: 0,
        y: 0
      },
      I = {
        x: 0,
        y: 0
      },
      K = {
        x: 0,
        y: 0
      },
      E = {
        x: 0,
        y: 0
      },
      N, S, U = {
        x: 0,
        y: 0
      },
      X = {
        x: 0,
        y: 0
      },
      da = function(R) {
        var L = {
            x: 0,
            y: 0
          },
          J = C,
          M = I,
          Q = K,
          aa = E,
          ga = 1 / 6,
          oa = R * R,
          za = oa * R,
          ca = [
            [-1, 3, -3, 1],
            [3, -6, 3, 0],
            [-3, 0, 3, 0],
            [1, 4, 1, 0]
          ];
        L.x = ga * ((J.x * ca[0][0] + M.x * ca[0][1] + Q.x * ca[0][2] + aa.x * ca[0][3]) * za + (J.x * ca[1][0] + M.x * ca[1][1] + Q.x * ca[1][2] + aa.x * ca[1][3]) * oa + (J.x * ca[2][0] + M.x * ca[2][1] + Q.x * ca[2][2] + aa.x * ca[2][3]) * R + (J.x * ca[3][0] + M.x * ca[3][1] + Q.x * ca[3][2] + aa.x * ca[3][3]));
        L.y = ga * ((J.y * ca[0][0] + M.y * ca[0][1] + Q.y * ca[0][2] + aa.y * ca[0][3]) * za + (J.y * ca[1][0] + M.y * ca[1][1] + Q.y * ca[1][2] + aa.y * ca[1][3]) * oa + (J.y * ca[2][0] + M.y * ca[2][1] + Q.y * ca[2][2] + aa.y * ca[2][3]) * R + (J.y * ca[3][0] + M.y * ca[3][1] + Q.y * ca[3][2] + aa.y * ca[3][3]));
        return {
          x: L.x,
          y: L.y
        }
      };
    $(a).mousedown(function(R) {
      if (!(o.spaceKey || R.button === 1)) {
        var L = R.button === 2;
        R.altKey && svgCanvas.cloneSelectedElements(0, 0);
        fb = $("#svgcontent g")[0].getScreenCTM().inverse();
        var J = svgedit.math.transformPoint(R.pageX, R.pageY, fb),
          M = J.x * i,
          Q = J.y * i;
        R.preventDefault();
        if (L) {
          va = "select";
          Cb = J
        }
        J = M / i;
        Q = Q / i;
        var aa = Eb(R);
        if (aa.tagName === "a" && aa.childNodes.length === 1) aa = aa.firstChild;
        q = f = M = J;
        var ga = Q;
        k = e = Q;
        if (l.gridSnapping) {
          J = svgedit.utilities.snapToGrid(J);
          Q = svgedit.utilities.snapToGrid(Q);
          f = svgedit.utilities.snapToGrid(f);
          e = svgedit.utilities.snapToGrid(e)
        }
        if (aa == qa.selectorParentGroup && r[0] != null) {
          aa = R.target;
          var oa = rb(aa, "type");
          if (oa == "rotate") va = "rotate";
          else if (oa == "resize") {
            va = "resize";
            kb = rb(aa, "dir")
          }
          aa = r[0]
        }
        nb = aa.getAttribute("transform");
        var za;
        oa = svgedit.transformlist.getTransformList(aa);
        switch (va) {
          case "select":
            Ba = true;
            kb = "none";
            if (L) Ba = false;
            if (aa != z) {
              if (r.indexOf(aa) == -1) {
                R.shiftKey || xa(true);
                gb([aa]);
                Kb = aa;
                ra.clear()
              }
              if (!L) for (L = 0; L < r.length; ++L) if (r[L] != null) {
                za = svgedit.transformlist.getTransformList(r[L]);
                za.numberOfItems ? za.insertItemBefore(z.createSVGTransform(), 0) : za.appendItem(z.createSVGTransform())
              }
            } else if (!L) {
              xa();
              va = "multiselect";
              if (Da == null) Da = qa.getRubberBandBox();
              q *= i;
              k *= i;
              svgedit.utilities.assignAttributes(Da, {
                x: q,
                y: k,
                width: 0,
                height: 0,
                display: "inline"
              }, 100)
            }
            break;
          case "zoom":
            Ba = true;
            if (Da == null) Da = qa.getRubberBandBox();
            svgedit.utilities.assignAttributes(Da, {
              x: M * i,
              y: M * i,
              width: 0,
              height: 0,
              display: "inline"
            }, 100);
            break;
          case "resize":
            Ba = true;
            f = J;
            e = Q;
            D = svgedit.utilities.getBBox($("#selectedBox0")[0]);
            var ca = {};
            $.each(D, function(ta, Aa) {
              ca[ta] = Aa / i
            });
            D = ca;
            L = svgedit.utilities.getRotationAngle(aa) ? 1 : 0;
            if (svgedit.math.hasMatrixTransform(oa)) {
              oa.insertItemBefore(z.createSVGTransform(), L);
              oa.insertItemBefore(z.createSVGTransform(), L);
              oa.insertItemBefore(z.createSVGTransform(), L)
            } else {
              oa.appendItem(z.createSVGTransform());
              oa.appendItem(z.createSVGTransform());
              oa.appendItem(z.createSVGTransform());
              if (svgedit.browser.supportsNonScalingStroke()) {
                if (J = svgedit.browser.isWebkit()) za = function(ta) {
                  var Aa = ta.getAttributeNS(null, "stroke");
                  ta.removeAttributeNS(null, "stroke");
                  setTimeout(function() {
                    ta.setAttributeNS(null, "stroke", Aa)
                  }, 0)
                };
                aa.style.vectorEffect = "non-scaling-stroke";
                J && za(aa);
                Q = aa.getElementsByTagName("*");
                M = Q.length;
                for (L = 0; L < M; L++) {
                  Q[L].style.vectorEffect = "non-scaling-stroke";
                  J && za(Q[L])
                }
              }
            }
            break;
          case "fhellipse":
          case "fhrect":
          case "fhpath":
            K.x = M;
            K.y = ga;
            Ba = true;
            b = M + "," + ga + " ";
            za = v.stroke_width == 0 ? 1 : v.stroke_width;
            O({
              element: "polyline",
              curStyles: true,
              attr: {
                points: b,
                id: Ha(),
                fill: "none",
                opacity: v.opacity / 2,
                "stroke-linecap": "round",
                style: "pointer-events:none"
              }
            });
            p.minx = M;
            p.maxx = M;
            p.miny = ga;
            p.maxy = ga;
            break;
          case "image":
            Ba = true;
            za = O({
              element: "image",
              attr: {
                x: J,
                y: Q,
                width: 0,
                height: 0,
                id: Ha(),
                opacity: v.opacity / 2,
                style: "pointer-events:inherit"
              }
            });
            eb(za, na);
            vb(za);
            break;
          case "square":
          case "rect":
            Ba = true;
            f = J;
            e = Q;
            O({
              element: "rect",
              curStyles: true,
              attr: {
                x: J,
                y: Q,
                width: 0,
                height: 0,
                id: Ha(),
                opacity: v.opacity / 2
              }
            });
            break;
          case "line":
            Ba = true;
            za = v.stroke_width == 0 ? 1 : v.stroke_width;
            O({
              element: "line",
              curStyles: true,
              attr: {
                x1: J,
                y1: Q,
                x2: J,
                y2: Q,
                id: Ha(),
                stroke: v.stroke,
                "stroke-width": za,
                "stroke-dasharray": v.stroke_dasharray,
                "stroke-linejoin": v.stroke_linejoin,
                "stroke-linecap": v.stroke_linecap,
                "stroke-opacity": v.stroke_opacity,
                fill: "none",
                opacity: v.opacity / 2,
                style: "pointer-events:none"
              }
            });
            break;
          case "circle":
            Ba = true;
            O({
              element: "circle",
              curStyles: true,
              attr: {
                cx: J,
                cy: Q,
                r: 0,
                id: Ha(),
                opacity: v.opacity / 2
              }
            });
            break;
          case "ellipse":
            Ba = true;
            O({
              element: "ellipse",
              curStyles: true,
              attr: {
                cx: J,
                cy: Q,
                rx: 0,
                ry: 0,
                id: Ha(),
                opacity: v.opacity / 2
              }
            });
            break;
          case "text":
            Ba = true;
            O({
              element: "text",
              curStyles: true,
              attr: {
                x: J,
                y: Q,
                id: Ha(),
                fill: Va.fill,
                "stroke-width": Va.stroke_width,
                "font-size": Va.font_size,
                "font-family": Va.font_family,
                "text-anchor": "middle",
                "xml:space": "preserve",
                opacity: v.opacity
              }
            });
            break;
          case "path":
          case "pathedit":
            f *= i;
            e *= i;
            ra.mouseDown(R, aa, f, e);
            Ba = true;
            break;
          case "textedit":
            f *= i;
            e *= i;
            Ka.mouseDown(R, aa, f, e);
            Ba = true;
            break;
          case "rotate":
            Ba = true;
            o.undoMgr.beginUndoableChange("transform", r)
        }
        R = tb("mouseDown", {
          event: R,
          start_x: f,
          start_y: e,
          selectedElements: r
        }, true);
        $.each(R, function(ta, Aa) {
          if (Aa && Aa.started) Ba = true
        })
      }
    }).mousemove(function(R) {
      if (Ba) if (!(R.button === 1 || o.spaceKey)) {
        var L, J, M, Q, aa, ga = r[0],
          oa = svgedit.math.transformPoint(R.pageX, R.pageY, fb),
          za = oa.x * i;
        oa = oa.y * i;
        var ca = svgedit.utilities.getElem(Za());
        x = J = za / i;
        y = Q = oa / i;
        if (l.gridSnapping) {
          x = svgedit.utilities.snapToGrid(x);
          y = svgedit.utilities.snapToGrid(y)
        }
        R.preventDefault();
        switch (va) {
          case "select":
            if (r[0] !== null) {
              J = x - f;
              M = y - e;
              if (l.gridSnapping) {
                J = svgedit.utilities.snapToGrid(J);
                M = svgedit.utilities.snapToGrid(M)
              }
              if (R.shiftKey) {
                L = svgedit.math.snapToAngle(f, e, x, y);
                x = L.x;
                y = L.y
              }
              if (J != 0 || M != 0) {
                Q = r.length;
                for (L = 0; L < Q; ++L) {
                  ga = r[L];
                  if (ga == null) break;
                  var ta = z.createSVGTransform();
                  ca = svgedit.transformlist.getTransformList(ga);
                  ta.setTranslate(J, M);
                  ca.numberOfItems ? ca.replaceItem(ta, 0) : ca.appendItem(ta);
                  qa.requestSelector(ga).resize()
                }
                W("transition", r)
              }
            }
            break;
          case "multiselect":
            J *= i;
            Q *= i;
            svgedit.utilities.assignAttributes(Da, {
              x: Math.min(q, J),
              y: Math.min(k, Q),
              width: Math.abs(J - q),
              height: Math.abs(Q - k)
            }, 100);
            ca = [];
            J = [];
            ta = ub();
            Q = r.length;
            for (L = 0; L < Q; ++L) {
              M = ta.indexOf(r[L]);
              if (M == -1) ca.push(r[L]);
              else ta[M] = null
            }
            Q = ta.length;
            for (L = 0; L < Q; ++L) ta[L] && J.push(ta[L]);
            ca.length > 0 && o.removeFromSelection(ca);
            J.length > 0 && gb(J);
            break;
          case "resize":
            ca = svgedit.transformlist.getTransformList(ga);
            M = (L = svgedit.math.hasMatrixTransform(ca)) ? D : svgedit.utilities.getBBox(ga);
            Q = M.x;
            ta = M.y;
            var Aa = M.width,
              ab = M.height;
            J = x - f;
            M = y - e;
            if (l.gridSnapping) {
              J = svgedit.utilities.snapToGrid(J);
              M = svgedit.utilities.snapToGrid(M);
              ab = svgedit.utilities.snapToGrid(ab);
              Aa = svgedit.utilities.snapToGrid(Aa)
            }
            if (aa = svgedit.utilities.getRotationAngle(ga)) {
              var pb = Math.sqrt(J * J + M * M);
              M = Math.atan2(M, J) - aa * Math.PI / 180;
              J = pb * Math.cos(M);
              M = pb * Math.sin(M)
            }
            if (kb.indexOf("n") == -1 && kb.indexOf("s") == -1) M = 0;
            if (kb.indexOf("e") == -1 && kb.indexOf("w") == -1) J = 0;
            var Fb = pb = 0,
              Nb = ab ? (ab + M) / ab : 1,
              Gb = Aa ? (Aa + J) / Aa : 1;
            if (kb.indexOf("n") >= 0) {
              Nb = ab ? (ab - M) / ab : 1;
              Fb = ab
            }
            if (kb.indexOf("w") >= 0) {
              Gb = Aa ? (Aa - J) / Aa : 1;
              pb = Aa
            }
            J = z.createSVGTransform();
            M = z.createSVGTransform();
            Aa = z.createSVGTransform();
            if (l.gridSnapping) {
              Q = svgedit.utilities.snapToGrid(Q);
              pb = svgedit.utilities.snapToGrid(pb);
              ta = svgedit.utilities.snapToGrid(ta);
              Fb = svgedit.utilities.snapToGrid(Fb)
            }
            J.setTranslate(-(Q + pb), -(ta + Fb));
            if (R.shiftKey) if (Gb == 1) Gb = Nb;
            else Nb = Gb;
            M.setScale(Gb, Nb);
            Aa.setTranslate(Q + pb, ta + Fb);
            if (L) {
              L = aa ? 1 : 0;
              ca.replaceItem(J, 2 + L);
              ca.replaceItem(M, 1 + L);
              ca.replaceItem(Aa, Number(L))
            } else {
              L = ca.numberOfItems;
              ca.replaceItem(Aa, L - 3);
              ca.replaceItem(M, L - 2);
              ca.replaceItem(J, L - 1)
            }
            qa.requestSelector(ga).resize();
            W("transition", r);
            break;
          case "zoom":
            J *= i;
            Q *= i;
            svgedit.utilities.assignAttributes(Da, {
              x: Math.min(q * i, J),
              y: Math.min(k * i, Q),
              width: Math.abs(J - q * i),
              height: Math.abs(Q - k * i)
            }, 100);
            break;
          case "text":
            svgedit.utilities.assignAttributes(ca, {
              x: x,
              y: y
            }, 1E3);
            break;
          case "line":
            Q = null;
            window.opera || z.suspendRedraw(1E3);
            if (l.gridSnapping) {
              x = svgedit.utilities.snapToGrid(x);
              y = svgedit.utilities.snapToGrid(y)
            }
            J = x;
            L = y;
            if (R.shiftKey) {
              L = svgedit.math.snapToAngle(f, e, J, L);
              J = L.x;
              L = L.y
            }
            ca.setAttributeNS(null, "x2", J);
            ca.setAttributeNS(null, "y2", L);
            window.opera || z.unsuspendRedraw(Q);
            break;
          case "foreignObject":
          case "square":
          case "rect":
          case "image":
            J = Math.abs(x - f);
            L = Math.abs(y - e);
            if (va == "square" || R.shiftKey) {
              J = L = Math.max(J, L);
              Q = f < x ? f : f - J;
              ta = e < y ? e : e - L
            } else {
              Q = Math.min(f, x);
              ta = Math.min(e, y)
            }
            if (l.gridSnapping) {
              J = svgedit.utilities.snapToGrid(J);
              L = svgedit.utilities.snapToGrid(L);
              Q = svgedit.utilities.snapToGrid(Q);
              ta = svgedit.utilities.snapToGrid(ta)
            }
            svgedit.utilities.assignAttributes(ca, {
              width: J,
              height: L,
              x: Q,
              y: ta
            }, 1E3);
            break;
          case "circle":
            L = $(ca).attr(["cx", "cy"]);
            J = L.cx;
            L = L.cy;
            J = Math.sqrt((x - J) * (x - J) + (y - L) * (y - L));
            if (l.gridSnapping) J = svgedit.utilities.snapToGrid(J);
            ca.setAttributeNS(null, "r", J);
            break;
          case "ellipse":
            L = $(ca).attr(["cx", "cy"]);
            J = L.cx;
            L = L.cy;
            Q = null;
            window.opera || z.suspendRedraw(1E3);
            if (l.gridSnapping) {
              x = svgedit.utilities.snapToGrid(x);
              J = svgedit.utilities.snapToGrid(J);
              y = svgedit.utilities.snapToGrid(y);
              L = svgedit.utilities.snapToGrid(L)
            }
            ca.setAttributeNS(null, "rx", Math.abs(x - J));
            ca.setAttributeNS(null, "ry", Math.abs(R.shiftKey ? x - J : y - L));
            window.opera || z.unsuspendRedraw(Q);
            break;
          case "fhellipse":
          case "fhrect":
            p.minx = Math.min(J, p.minx);
            p.maxx = Math.max(J, p.maxx);
            p.miny = Math.min(Q, p.miny);
            p.maxy = Math.max(Q, p.maxy);
          case "fhpath":
            E.x = J;
            E.y = Q;
            if (C.x && C.y) for (L = 0; L < 9; L++) {
              N = L / 10;
              S = (L + 1) / 10;
              X = U = da(S);
              U = da(N);
              w += Math.sqrt((X.x - U.x) * (X.x - U.x) + (X.y - U.y) * (X.y - U.y));
              if (w > 0.8) {
                b += +U.x + "," + U.y + " ";
                ca.setAttributeNS(null, "points", b);
                w -= 0.8
              }
            }
            C = {
              x: I.x,
              y: I.y
            };
            I = {
              x: K.x,
              y: K.y
            };
            K = {
              x: E.x,
              y: E.y
            };
            break;
          case "path":
          case "pathedit":
            x *= i;
            y *= i;
            if (l.gridSnapping) {
              x = svgedit.utilities.snapToGrid(x);
              y = svgedit.utilities.snapToGrid(y);
              f = svgedit.utilities.snapToGrid(f);
              e = svgedit.utilities.snapToGrid(e)
            }
            if (R.shiftKey) {
              if (L = svgedit.path.path) {
                ca = L.dragging ? L.dragging[0] : f;
                L = L.dragging ? L.dragging[1] : e
              } else {
                ca = f;
                L = e
              }
              L = svgedit.math.snapToAngle(ca, L, x, y);
              x = L.x;
              y = L.y
            }
            if (Da && Da.getAttribute("display") !== "none") {
              J *= i;
              Q *= i;
              svgedit.utilities.assignAttributes(Da, {
                x: Math.min(q * i, J),
                y: Math.min(k * i, Q),
                width: Math.abs(J - q * i),
                height: Math.abs(Q - k * i)
              }, 100)
            }
            ra.mouseMove(x, y);
            break;
          case "textedit":
            x *= i;
            y *= i;
            Ka.mouseMove(za, oa);
            break;
          case "rotate":
            M = svgedit.utilities.getBBox(ga);
            J = M.x + M.width / 2;
            L = M.y + M.height / 2;
            ca = svgedit.math.getMatrix(ga);
            ca = svgedit.math.transformPoint(J, L, ca);
            J = ca.x;
            L = ca.y;
            aa = (Math.atan2(L - y, J - x) * (180 / Math.PI) - 90) % 360;
            if (l.gridSnapping) aa = svgedit.utilities.snapToGrid(aa);
            if (R.shiftKey) aa = Math.round(aa / 45) * 45;
            o.setRotationAngle(aa < -180 ? 360 + aa : aa, true);
            W("transition", r)
        }
        tb("mouseMove", {
          event: R,
          mouse_x: za,
          mouse_y: oa,
          selected: ga
        })
      }
    }).click(function(R) {
      R.preventDefault();
      return false
    }).dblclick(function(R) {
      var L = R.target.parentNode;
      if (L !== B) {
        var J = Eb(R),
          M = J.tagName;
        if (M === "text" && va !== "textedit") {
          R = svgedit.math.transformPoint(R.pageX, R.pageY, fb);
          Ka.select(J, R.x, R.y)
        }
        if ((M === "g" || M === "a") && svgedit.utilities.getRotationAngle(J)) {
          Vb(J);
          J = r[0];
          xa(true)
        }
        B && Ob();
        L.tagName !== "g" && L.tagName !== "a" || L === A().getCurrentLayer() || J === qa.selectorParentGroup || hc(J)
      }
    }).mouseup(function(R) {
      if (R.button !== 2) {
        var L = Kb;
        Kb = null;
        if (Ba) {
          var J = svgedit.math.transformPoint(R.pageX, R.pageY, fb),
            M = J.x * i;
          J = J.y * i;
          var Q = M / i,
            aa = J / i,
            ga = svgedit.utilities.getElem(Za()),
            oa = false;
          Ba = false;
          switch (va) {
            case "resize":
            case "multiselect":
              if (Da != null) {
                Da.setAttribute("display", "none");
                hb = []
              }
              va = "select";
            case "select":
              if (r[0] != null) {
                if (r[1] == null) {
                  M = r[0];
                  switch (M.tagName) {
                    case "g":
                    case "use":
                    case "image":
                    case "foreignObject":
                      break;
                    default:
                      ya.fill = M.getAttribute("fill");
                      ya.fill_opacity = M.getAttribute("fill-opacity");
                      ya.stroke = M.getAttribute("stroke");
                      ya.stroke_opacity = M.getAttribute("stroke-opacity");
                      ya.stroke_width = M.getAttribute("stroke-width");
                      ya.stroke_dasharray = M.getAttribute("stroke-dasharray");
                      ya.stroke_linejoin = M.getAttribute("stroke-linejoin");
                      ya.stroke_linecap = M.getAttribute("stroke-linecap")
                  }
                  if (M.tagName == "text") {
                    Va.font_size = M.getAttribute("font-size");
                    Va.font_family = M.getAttribute("font-family")
                  }
                  qa.requestSelector(M).showGrips(true)
                }
                Mb();
                if (Q != q || aa != k) {
                  M = r.length;
                  for (R = 0; R < M; ++R) {
                    if (r[R] == null) break;
                    r[R].firstChild || qa.requestSelector(r[R]).resize()
                  }
                } else {
                  M = R.target;
                  if (r[0].nodeName === "path" && r[1] == null) ra.select(r[0]);
                  else R.shiftKey && L != M && o.removeFromSelection([M])
                }
                if (svgedit.browser.supportsNonScalingStroke()) if (R = r[0]) {
                  R.removeAttribute("style");
                  svgedit.utilities.walkTree(R, function(ta) {
                    ta.removeAttribute("style")
                  })
                }
              }
              return;
            case "zoom":
              Da != null && Da.setAttribute("display", "none");
              W("zoomed", {
                x: Math.min(q, Q),
                y: Math.min(k, aa),
                width: Math.abs(Q - q),
                height: Math.abs(aa - k),
                factor: R.shiftKey ? 0.5 : 2
              });
              return;
            case "fhpath":
              w = 0;
              C = {
                x: 0,
                y: 0
              };
              I = {
                x: 0,
                y: 0
              };
              K = {
                x: 0,
                y: 0
              };
              E = {
                x: 0,
                y: 0
              };
              L = ga.getAttribute("points");
              Q = L.indexOf(",");
              if (oa = Q >= 0 ? L.indexOf(",", Q + 1) >= 0 : L.indexOf(" ", L.indexOf(" ") + 1) >= 0) ga = ra.smoothPolylineIntoPath(ga);
              break;
            case "line":
              L = $(ga).attr(["x1", "x2", "y1", "y2"]);
              oa = L.x1 != L.x2 || L.y1 != L.y2;
              break;
            case "foreignObject":
            case "square":
            case "rect":
            case "image":
              L = $(ga).attr(["width", "height"]);
              oa = L.width != 0 || L.height != 0 || va === "image";
              break;
            case "circle":
              oa = ga.getAttribute("r") != 0;
              break;
            case "ellipse":
              L = $(ga).attr(["rx", "ry"]);
              oa = L.rx != null || L.ry != null;
              break;
            case "fhellipse":
              if (p.maxx - p.minx > 0 && p.maxy - p.miny > 0) {
                ga = O({
                  element: "ellipse",
                  curStyles: true,
                  attr: {
                    cx: (p.minx + p.maxx) / 2,
                    cy: (p.miny + p.maxy) / 2,
                    rx: (p.maxx - p.minx) / 2,
                    ry: (p.maxy - p.miny) / 2,
                    id: Za()
                  }
                });
                W("changed", [ga]);
                oa = true
              }
              break;
            case "fhrect":
              if (p.maxx - p.minx > 0 && p.maxy - p.miny > 0) {
                ga = O({
                  element: "rect",
                  curStyles: true,
                  attr: {
                    x: p.minx,
                    y: p.miny,
                    width: p.maxx - p.minx,
                    height: p.maxy - p.miny,
                    id: Za()
                  }
                });
                W("changed", [ga]);
                oa = true
              }
              break;
            case "text":
              oa = true;
              $a([ga]);
              Ka.start(ga);
              break;
            case "path":
              ga = null;
              Ba = true;
              L = ra.mouseUp(R, ga, M, J);
              ga = L.element;
              oa = L.keep;
              break;
            case "pathedit":
              oa = true;
              ga = null;
              ra.mouseUp(R);
              break;
            case "textedit":
              oa = false;
              ga = null;
              Ka.mouseUp(R, M, J);
              break;
            case "rotate":
              oa = true;
              ga = null;
              va = "select";
              L = o.undoMgr.finishUndoableChange();
              L.isEmpty() || pa(L);
              Mb();
              W("changed", r)
          }
          M = tb("mouseUp", {
            event: R,
            mouse_x: M,
            mouse_y: J
          }, true);
          $.each(M, function(ta, Aa) {
            if (Aa) {
              oa = Aa.keep || oa;
              ga = Aa.element;
              Ba = Aa.started || Ba
            }
          });
          if (!oa && ga != null) {
            A().releaseId(Za());
            ga.parentNode.removeChild(ga);
            ga = null;
            for (M = R.target; M.parentNode.parentNode.tagName == "g";) M = M.parentNode;
            if ((va != "path" || !drawn_path) && M.parentNode.id != "selectorParentGroup" && M.id != "svgcanvas" && M.id != "svgroot") {
              o.setMode("select");
              $a([M], true)
            }
          } else if (ga != null) {
            o.addedNew = true;
            R = 0.2;
            var za;
            if (Ab.beginElement && ga.getAttribute("opacity") != v.opacity) {
              za = $(Ab).clone().attr({
                to: v.opacity,
                dur: R
              }).appendTo(ga);
              try {
                za[0].beginElement()
              } catch (ca) {}
            } else R = 0;
            setTimeout(function() {
              za && za.remove();
              ga.setAttribute("opacity", v.opacity);
              ga.setAttribute("style", "pointer-events:inherit");
              ua(ga);
              if (va === "path") ra.toEditMode(ga);
              else l.selectNew && $a([ga], true);
              pa(new svgedit.history.InsertElementCommand(ga));
              W("changed", [ga])
            }, R * 1E3)
          }
          nb = null
        }
      }
    });
    $(a).bind("mousewheel DOMMouseScroll", function(R) {
      R.preventDefault();
      R = R.originalEvent;
      fb = $("#svgcontent g")[0].getScreenCTM().inverse();
      var L = svgedit.math.transformPoint(R.pageX, R.pageY, fb);
      L = {
        x: L.x,
        y: L.y,
        width: 0,
        height: 0
      };
      if (R = R.wheelDelta ? R.wheelDelta : R.detail ? -R.detail : 0) {
        L.factor = Math.max(0.75, Math.min(4 / 3, R));
        W("zoomed", L)
      }
    })
  })();
  var vb = function(b) {
    $(b).click(function(f) {
      f.preventDefault()
    })
  };
  Ka = o.textActions = function() {
    function b(J) {
      var M = I.value === "";
      $(I).focus();
      if (!arguments.length) if (M) J = 0;
      else {
        if (I.selectionEnd !== I.selectionStart) return;
        J = I.selectionEnd
      }
      var Q;
      Q = S[J];
      M || I.setSelectionRange(J, J);
      K = svgedit.utilities.getElem("text_cursor");
      if (!K) {
        K = document.createElementNS(d.SVG, "line");
        svgedit.utilities.assignAttributes(K, {
          id: "text_cursor",
          stroke: "#333",
          "stroke-width": 1
        });
        K = svgedit.utilities.getElem("selectorParentGroup").appendChild(K)
      }
      N || (N = setInterval(function() {
        var aa = K.getAttribute("display") === "none";
        K.setAttribute("display", aa ? "inline" : "none")
      }, 600));
      M = D(Q.x, U.y);
      Q = D(Q.x, U.y + U.height);
      svgedit.utilities.assignAttributes(K, {
        x1: M.x,
        y1: M.y,
        x2: Q.x,
        y2: Q.y,
        visibility: "visible",
        display: "inline"
      });
      E && E.setAttribute("d", "")
    }
    function f(J, M, Q) {
      if (J === M) b(M);
      else {
        Q || I.setSelectionRange(J, M);
        E = svgedit.utilities.getElem("text_selectblock");
        if (!E) {
          E = document.createElementNS(d.SVG, "path");
          svgedit.utilities.assignAttributes(E, {
            id: "text_selectblock",
            fill: "green",
            opacity: 0.5,
            style: "pointer-events:none"
          });
          svgedit.utilities.getElem("selectorParentGroup").appendChild(E)
        }
        J = S[J];
        var aa = S[M];
        K.setAttribute("visibility", "hidden");
        M = D(J.x, U.y);
        Q = D(J.x + (aa.x - J.x), U.y);
        var ga = D(J.x, U.y + U.height);
        J = D(J.x + (aa.x - J.x), U.y + U.height);
        svgedit.utilities.assignAttributes(E, {
          d: "M" + M.x + "," + M.y + " L" + Q.x + "," + Q.y + " " + J.x + "," + J.y + " " + ga.x + "," + ga.y + "z",
          display: "inline"
        })
      }
    }
    function e(J, M) {
      var Q = z.createSVGPoint();
      Q.x = J;
      Q.y = M;
      if (S.length == 1) return 0;
      Q = C.getCharNumAtPosition(Q);
      if (Q < 0) {
        Q = S.length - 2;
        if (J <= S[0].x) Q = 0
      } else if (Q >= S.length - 2) Q = S.length - 2;
      var aa = S[Q];
      J > aa.x + aa.width / 2 && Q++;
      return Q
    }
    function q(J, M, Q) {
      var aa = I.selectionStart;
      J = e(J, M);
      f(Math.min(aa, J), Math.max(aa, J), !Q)
    }
    function k(J, M) {
      var Q = {
        x: J,
        y: M
      };
      Q.x /= i;
      Q.y /= i;
      if (X) {
        var aa = svgedit.math.transformPoint(Q.x, Q.y, X.inverse());
        Q.x = aa.x;
        Q.y = aa.y
      }
      return Q
    }

    function D(J, M) {
      var Q = {
        x: J,
        y: M
      };
      if (X) {
        var aa = svgedit.math.transformPoint(Q.x, Q.y, X);
        Q.x = aa.x;
        Q.y = aa.y
      }
      Q.x *= i;
      Q.y *= i;
      return Q
    }
    function p(J) {
      f(0, C.textContent.length);
      $(this).unbind(J)
    }
    function w(J) {
      if (L && C) {
        var M = svgedit.math.transformPoint(J.pageX, J.pageY, fb);
        M = k(M.x * i, M.y * i);
        M = e(M.x, M.y);
        var Q = C.textContent,
          aa = Q.substr(0, M).replace(/[a-z0-9]+$/i, "").length;
        Q = Q.substr(M).match(/^[a-z0-9]+/i);
        f(aa, (Q ? Q[0].length : 0) + M);
        $(J.target).click(p);
        setTimeout(function() {
          $(J.target).unbind("click", p)
        }, 300)
      }
    }
    var C, I, K, E, N, S = [],
      U, X, da, R, L;
    return {
      select: function(J, M, Q) {
        C = J;
        Ka.toEditMode(M, Q)
      },
      start: function(J) {
        C = J;
        Ka.toEditMode()
      },
      mouseDown: function(J, M, Q, aa) {
        J = k(Q, aa);
        I.focus();
        b(e(J.x, J.y));
        da = Q;
        R = aa
      },
      mouseMove: function(J, M) {
        var Q = k(J, M);
        q(Q.x, Q.y)
      },
      mouseUp: function(J, M, Q) {
        var aa = k(M, Q);
        q(aa.x, aa.y, true);
        J.target !== C && M < da + 2 && M > da - 2 && Q < R + 2 && Q > R - 2 && Ka.toSelectMode(true)
      },
      setCursor: b,
      toEditMode: function(J, M) {
        L = false;
        va = "textedit";
        qa.requestSelector(C).showGrips(false);
        qa.requestSelector(C);
        Ka.init();
        $(C).css("cursor", "text");
        if (arguments.length) {
          var Q = k(J, M);
          b(e(Q.x, Q.y))
        } else b();
        setTimeout(function() {
          L = true
        }, 300)
      },
      toSelectMode: function(J) {
        va = "select";
        clearInterval(N);
        N = null;
        E && $(E).attr("display", "none");
        K && $(K).attr("visibility", "hidden");
        $(C).css("cursor", "move");
        if (J) {
          xa();
          $(C).css("cursor", "move");
          W("selected", [C]);
          gb([C], true)
        }
        C && !C.textContent.length && o.deleteSelectedElements();
        $(I).blur();
        C = false
      },
      setInputElem: function(J) {
        I = J
      },
      clear: function() {
        va == "textedit" && Ka.toSelectMode()
      },
      init: function() {
        if (C) {
          var J, M;
          if (!C.parentNode) {
            C = r[0];
            qa.requestSelector(C).showGrips(false)
          }
          var Q = C.textContent.length;
          J = C.getAttribute("transform");
          U = svgedit.utilities.getBBox(C);
          X = J ? svgedit.math.getMatrix(C) : null;
          S = [];
          S.length = Q;
          I.focus();
          $(C).unbind("dblclick", w).dblclick(w);
          Q || (M = {
            x: U.x + U.width / 2,
            width: 0
          });
          for (J = 0; J < Q; J++) {
            var aa = C.getStartPositionOfChar(J);
            M = C.getEndPositionOfChar(J);
            if (!svgedit.browser.supportsGoodTextCharPos()) {
              var ga = o.contentW * i;
              aa.x -= ga;
              M.x -= ga;
              aa.x /= i;
              M.x /= i
            }
            S[J] = {
              x: aa.x,
              y: U.y,
              width: M.x - aa.x,
              height: U.height
            }
          }
          S.push({
            x: M.x,
            width: 0
          });
          f(I.selectionStart, I.selectionEnd, true)
        }
      }
    }
  }();
  ra = o.pathActions = function() {
    var b = false,
      f, e, q;
    svgedit.path.Path.prototype.endChanges = function(p) {
      if (svgedit.browser.isWebkit()) {
        var w = this.elem;
        w.setAttribute("d", ra.convertPath(w))
      }
      p = new svgedit.history.ChangeElementCommand(this.elem, {
        d: this.last_d
      }, p);
      pa(p);
      W("changed", [this.elem])
    };
    svgedit.path.Path.prototype.addPtsToSelection = function(p) {
      var w, C;
      $.isArray(p) || (p = [p]);
      for (w = 0; w < p.length; w++) {
        var I = p[w];
        C = this.segs[I];
        C.ptgrip && this.selected_pts.indexOf(I) == -1 && I >= 0 && this.selected_pts.push(I)
      }
      this.selected_pts.sort();
      w = this.selected_pts.length;
      p = [];
      for (p.length = w; w--;) {
        C = this.segs[this.selected_pts[w]];
        C.select(true);
        p[w] = C.ptgrip
      }
      ra.canDeleteNodes = true;
      ra.closed_subpath = this.subpathIsClosed(this.selected_pts[0]);
      W("selected", p)
    };
    var k = f = null,
      D = false;
    return {
      mouseDown: function(p, w, C, I) {
        var K;
        if (va === "path") {
          mouse_x = C;
          mouse_y = I;
          I = mouse_x / i;
          w = mouse_y / i;
          C = svgedit.utilities.getElem("path_stretch_line");
          e = [I, w];
          if (l.gridSnapping) {
            I = svgedit.utilities.snapToGrid(I);
            w = svgedit.utilities.snapToGrid(w);
            mouse_x = svgedit.utilities.snapToGrid(mouse_x);
            mouse_y = svgedit.utilities.snapToGrid(mouse_y)
          }
          if (!C) {
            C = document.createElementNS(d.SVG, "path");
            svgedit.utilities.assignAttributes(C, {
              id: "path_stretch_line",
              stroke: "#22C",
              "stroke-width": "0.5",
              fill: "none"
            });
            C = svgedit.utilities.getElem("selectorParentGroup").appendChild(C)
          }
          C.setAttribute("display", "inline");
          var E = null;
          if (k) {
            E = k.pathSegList;
            var N = E.numberOfItems;
            K = 6 / i;
            for (var S = false; N;) {
              N--;
              var U = E.getItem(N),
                X = U.x;
              U = U.y;
              if (I >= X - K && I <= X + K && w >= U - K && w <= U + K) {
                S = true;
                break
              }
            }
            K = Za();
            svgedit.path.removePath_(K);
            K = svgedit.utilities.getElem(K);
            X = E.numberOfItems;
            if (S) {
              if (N <= 1 && X >= 2) {
                I = E.getItem(0).x;
                w = E.getItem(0).y;
                p = C.pathSegList.getItem(1);
                p = p.pathSegType === 4 ? k.createSVGPathSegLinetoAbs(I, w) : k.createSVGPathSegCurvetoCubicAbs(I, w, p.x1 / i, p.y1 / i, I, w);
                I = k.createSVGPathSegClosePath();
                E.appendItem(p);
                E.appendItem(I)
              } else if (X < 3) return E = false;
              $(C).remove();
              element = K;
              k = null;
              Ba = false;
              if (b) {
                svgedit.path.path.matrix && svgedit.coords.remapElement(K, {}, svgedit.path.path.matrix.inverse());
                C = K.getAttribute("d");
                p = $(svgedit.path.path.elem).attr("d");
                $(svgedit.path.path.elem).attr("d", p + C);
                $(K).remove();
                svgedit.path.path.matrix && svgedit.path.recalcRotatedPath();
                svgedit.path.path.init();
                ra.toEditMode(svgedit.path.path.elem);
                svgedit.path.path.selectPt();
                return false
              }
            } else {
              if (!$.contains(a, Eb(p))) {
                console.log("Clicked outside canvas");
                return false
              }
              E = k.pathSegList.numberOfItems;
              N = k.pathSegList.getItem(E - 1);
              K = N.x;
              N = N.y;
              if (p.shiftKey) {
                p = svgedit.math.snapToAngle(K, N, I, w);
                I = p.x;
                w = p.y
              }
              p = C.pathSegList.getItem(1);
              p = p.pathSegType === 4 ? k.createSVGPathSegLinetoAbs(Ya(I), Ya(w)) : k.createSVGPathSegCurvetoCubicAbs(Ya(I), Ya(w), p.x1 / i, p.y1 / i, p.x2 / i, p.y2 / i);
              k.pathSegList.appendItem(p);
              I *= i;
              w *= i;
              C.setAttribute("d", ["M", I, w, I, w].join(" "));
              C = E;
              if (b) C += svgedit.path.path.segs.length;
              svgedit.path.addPointGrip(C, I, w)
            }
          } else {
            d_attr = "M" + I + "," + w + " ";
            k = O({
              element: "path",
              curStyles: true,
              attr: {
                d: d_attr,
                id: Ha(),
                opacity: v.opacity / 2
              }
            });
            C.setAttribute("d", ["M", mouse_x, mouse_y, mouse_x, mouse_y].join(" "));
            C = b ? svgedit.path.path.segs.length : 0;
            svgedit.path.addPointGrip(C, mouse_x, mouse_y)
          }
        } else if (svgedit.path.path) {
          svgedit.path.path.storeD();
          K = p.target.id;
          if (K.substr(0, 14) == "pathpointgrip_") {
            w = svgedit.path.path.cur_pt = parseInt(K.substr(14));
            svgedit.path.path.dragging = [C, I];
            E = svgedit.path.path.segs[w];
            if (p.shiftKey) E.selected ? svgedit.path.path.removePtFromSelection(w) : svgedit.path.path.addPtsToSelection(w);
            else {
              if (svgedit.path.path.selected_pts.length <= 1 || !E.selected) svgedit.path.path.clearSelection();
              svgedit.path.path.addPtsToSelection(w)
            }
          } else if (K.indexOf("ctrlpointgrip_") == 0) {
            svgedit.path.path.dragging = [C, I];
            p = K.split("_")[1].split("c");
            w = Number(p[0]);
            svgedit.path.path.selectPt(w, Number(p[1]))
          }
          if (!svgedit.path.path.dragging) {
            if (Da == null) Da = qa.getRubberBandBox();
            svgedit.utilities.assignAttributes(Da, {
              x: C * i,
              y: I * i,
              width: 0,
              height: 0,
              display: "inline"
            }, 100)
          }
        }
      },
      mouseMove: function(p, w) {
        D = true;
        if (va === "path") {
          if (k) {
            var C = k.pathSegList,
              I = C.numberOfItems - 1;
            if (e) {
              var K = svgedit.path.addCtrlGrip("1c1"),
                E = svgedit.path.addCtrlGrip("0c2");
              K.setAttribute("cx", p);
              K.setAttribute("cy", w);
              K.setAttribute("display", "inline");
              K = e[0];
              var N = e[1];
              C.getItem(I);
              var S = K + (K - p / i),
                U = N + (N - w / i);
              E.setAttribute("cx", S * i);
              E.setAttribute("cy", U * i);
              E.setAttribute("display", "inline");
              E = svgedit.path.getCtrlLine(1);
              svgedit.utilities.assignAttributes(E, {
                x1: p,
                y1: w,
                x2: S * i,
                y2: U * i,
                display: "inline"
              });
              if (I === 0) q = [p, w];
              else {
                C = C.getItem(I - 1);
                E = C.x;
                var X = C.y;
                if (C.pathSegType === 6) {
                  E += E - C.x2;
                  X += X - C.y2
                } else if (q) {
                  E = q[0] / i;
                  X = q[1] / i
                }
                svgedit.path.replacePathSeg(6, I, [K, N, E, X, S, U], k)
              }
            } else if (K = svgedit.utilities.getElem("path_stretch_line")) {
              I = C.getItem(I);
              if (I.pathSegType === 6) svgedit.path.replacePathSeg(6, 1, [p, w, (I.x + (I.x - I.x2)) * i, (I.y + (I.y - I.y2)) * i, p, w], K);
              else q ? svgedit.path.replacePathSeg(6, 1, [p, w, q[0], q[1], p, w], K) : svgedit.path.replacePathSeg(4, 1, [p, w], K)
            }
          }
        } else if (svgedit.path.path.dragging) {
          K = svgedit.path.getPointFromGrip({
            x: svgedit.path.path.dragging[0],
            y: svgedit.path.path.dragging[1]
          }, svgedit.path.path);
          N = svgedit.path.getPointFromGrip({
            x: p,
            y: w
          }, svgedit.path.path);
          I = N.x - K.x;
          K = N.y - K.y;
          svgedit.path.path.dragging = [p, w];
          svgedit.path.path.dragctrl ? svgedit.path.path.moveCtrl(I, K) : svgedit.path.path.movePts(I, K)
        } else {
          svgedit.path.path.selected_pts = [];
          svgedit.path.path.eachSeg(function() {
            if (this.next || this.prev) {
              var da = Da.getBBox(),
                R = svgedit.path.getGripPt(this);
              da = svgedit.math.rectsIntersect(da, {
                x: R.x,
                y: R.y,
                width: 0,
                height: 0
              });
              this.select(da);
              da && svgedit.path.path.selected_pts.push(this.index)
            }
          })
        }
      },
      mouseUp: function(p, w) {
        if (va === "path") {
          e = null;
          if (!k) {
            w = svgedit.utilities.getElem(Za());
            Ba = false;
            q = null
          }
          return {
            keep: true,
            element: w
          }
        }
        if (svgedit.path.path.dragging) {
          var C = svgedit.path.path.cur_pt;
          svgedit.path.path.dragging = false;
          svgedit.path.path.dragctrl = false;
          svgedit.path.path.update();
          D && svgedit.path.path.endChanges("Move path point(s)");
          !p.shiftKey && !D && svgedit.path.path.selectPt(C)
        } else if (Da && Da.getAttribute("display") != "none") {
          Da.setAttribute("display", "none");
          Da.getAttribute("width") <= 2 && Da.getAttribute("height") <= 2 && ra.toSelectMode(p.target)
        } else ra.toSelectMode(p.target);
        D = false
      },
      toEditMode: function(p) {
        svgedit.path.path = svgedit.path.getPath_(p);
        va = "pathedit";
        xa();
        svgedit.path.path.show(true).update();
        svgedit.path.path.oldbbox = svgedit.utilities.getBBox(svgedit.path.path.elem);
        b = false
      },
      toSelectMode: function(p) {
        var w = p == svgedit.path.path.elem;
        va = "select";
        svgedit.path.path.show(false);
        f = false;
        xa();
        svgedit.path.path.matrix && svgedit.path.recalcRotatedPath();
        if (w) {
          W("selected", [p]);
          gb([p], true)
        }
      },
      addSubPath: function(p) {
        if (p) {
          va = "path";
          b = true
        } else {
          ra.clear(true);
          ra.toEditMode(svgedit.path.path.elem)
        }
      },
      select: function(p) {
        if (f === p) {
          ra.toEditMode(p);
          va = "pathedit"
        } else f = p
      },
      reorient: function() {
        var p = r[0];
        if (p) if (svgedit.utilities.getRotationAngle(p) != 0) {
          var w = new svgedit.history.BatchCommand("Reorient path"),
            C = {
              d: p.getAttribute("d"),
              transform: p.getAttribute("transform")
            };
          w.addSubCommand(new svgedit.history.ChangeElementCommand(p, C));
          xa();
          this.resetOrientation(p);
          pa(w);
          svgedit.path.getPath_(p).show(false).matrix = null;
          this.clear();
          gb([p], true);
          W("changed", r)
        }
      },
      clear: function() {
        f = null;
        if (k) {
          var p = svgedit.utilities.getElem(Za());
          $(svgedit.utilities.getElem("path_stretch_line")).remove();
          $(p).remove();
          $(svgedit.utilities.getElem("pathpointgrip_container")).find("*").attr("display", "none");
          k = q = null;
          Ba = false
        } else va == "pathedit" && this.toSelectMode();
        svgedit.path.path && svgedit.path.path.init().show(false)
      },
      resetOrientation: function(p) {
        if (p == null || p.nodeName != "path") return false;
        var w = svgedit.transformlist.getTransformList(p),
          C = svgedit.math.transformListToTransform(w).matrix;
        w.clear();
        p.removeAttribute("transform");
        w = p.pathSegList;
        var I = w.numberOfItems,
          K;
        for (K = 0; K < I; ++K) {
          var E = w.getItem(K),
            N = E.pathSegType;
          if (N != 1) {
            var S = [];
            $.each(["", 1, 2], function(U, X) {
              var da = E["x" + X],
                R = E["y" + X];
              if (da !== undefined && R !== undefined) {
                da = svgedit.math.transformPoint(da, R, C);
                S.splice(S.length, 0, da.x, da.y)
              }
            });
            svgedit.path.replacePathSeg(N, K, S, p)
          }
        }
        c(p, C)
      },
      zoomChange: function() {
        va == "pathedit" && svgedit.path.path.update()
      },
      getNodePoint: function() {
        var p = svgedit.path.path.segs[svgedit.path.path.selected_pts.length ? svgedit.path.path.selected_pts[0] : 1];
        return {
          x: p.item.x,
          y: p.item.y,
          type: p.type
        }
      },
      linkControlPoints: function(p) {
        svgedit.path.setLinkControlPoints(p)
      },
      clonePathNode: function() {
        svgedit.path.path.storeD();
        for (var p = svgedit.path.path.selected_pts, w = p.length, C = []; w--;) {
          var I = p[w];
          svgedit.path.path.addSeg(I);
          C.push(I + w);
          C.push(I + w + 1)
        }
        svgedit.path.path.init().addPtsToSelection(C);
        svgedit.path.path.endChanges("Clone path node(s)")
      },
      opencloseSubPath: function() {
        var p = svgedit.path.path.selected_pts;
        if (p.length === 1) {
          var w = svgedit.path.path.elem,
            C = w.pathSegList,
            I = p[0],
            K = null,
            E = null;
          svgedit.path.path.eachSeg(function(X) {
            if (this.type === 2 && X <= I) E = this.item;
            if (X <= I) return true;
            if (this.type === 2) {
              K = X;
              return false
            }
            if (this.type === 1) return K = false
          });
          if (K == null) K = svgedit.path.path.segs.length - 1;
          if (K !== false) {
            var N = w.createSVGPathSegLinetoAbs(E.x, E.y),
              S = w.createSVGPathSegClosePath();
            if (K == svgedit.path.path.segs.length - 1) {
              C.appendItem(N);
              C.appendItem(S)
            } else {
              svgedit.path.insertItemBefore(w, S, K);
              svgedit.path.insertItemBefore(w, N, K)
            }
            svgedit.path.path.init().selectPt(K + 1)
          } else if (svgedit.path.path.segs[I].mate) {
            C.removeItem(I);
            C.removeItem(I);
            svgedit.path.path.init().selectPt(I - 1)
          } else {
            for (p = 0; p < C.numberOfItems; p++) {
              var U = C.getItem(p);
              if (U.pathSegType === 2) N = p;
              else if (p === I) C.removeItem(N);
              else if (U.pathSegType === 1 && I < p) {
                S = p - 1;
                C.removeItem(p);
                break
              }
            }
            for (p = I - N - 1; p--;) svgedit.path.insertItemBefore(w, C.getItem(N), S);
            w = C.getItem(N);
            svgedit.path.replacePathSeg(2, N, [w.x, w.y]);
            p = I;
            svgedit.path.path.init().selectPt(0)
          }
        }
      },
      deletePathNode: function() {
        if (ra.canDeleteNodes) {
          svgedit.path.path.storeD();
          for (var p = svgedit.path.path.selected_pts, w = p.length; w--;) svgedit.path.path.deleteSeg(p[w]);
          var C = function() {
            var I = svgedit.path.path.elem.pathSegList,
              K = I.numberOfItems,
              E = function(U, X) {
                for (; X--;) I.removeItem(U)
              };
            if (K <= 1) return true;
            for (; K--;) {
              var N = I.getItem(K);
              if (N.pathSegType === 1) {
                N = I.getItem(K - 1);
                var S = I.getItem(K - 2);
                if (N.pathSegType === 2) {
                  E(K - 1, 2);
                  C();
                  break
                } else if (S.pathSegType === 2) {
                  E(K - 2, 3);
                  C();
                  break
                }
              } else if (N.pathSegType === 2) if (K > 0) {
                N = I.getItem(K - 1).pathSegType;
                if (N === 2) {
                  E(K - 1, 1);
                  C();
                  break
                } else if (N === 1 && I.numberOfItems - 1 === K) {
                  E(K, 1);
                  C();
                  break
                }
              }
            }
            return false
          };
          C();
          if (svgedit.path.path.elem.pathSegList.numberOfItems <= 1) {
            ra.toSelectMode(svgedit.path.path.elem);
            o.deleteSelectedElements()
          } else {
            svgedit.path.path.init();
            svgedit.path.path.clearSelection();
            if (window.opera) {
              p = $(svgedit.path.path.elem);
              p.attr("d", p.attr("d"))
            }
            svgedit.path.path.endChanges("Delete path node(s)")
          }
        }
      },
      smoothPolylineIntoPath: function(p) {
        var w = p.points,
          C = w.numberOfItems;
        if (C >= 4) {
          var I = w.getItem(0),
            K = null,
            E = [];
          E.push(["M", I.x, ",", I.y, " C"].join(""));
          for (p = 1; p <= C - 4; p += 3) {
            var N = w.getItem(p),
              S = w.getItem(p + 1),
              U = w.getItem(p + 2);
            if (K) if ((I = svgedit.path.smoothControlPoints(K, N, I)) && I.length == 2) {
              N = E[E.length - 1].split(",");
              N[2] = I[0].x;
              N[3] = I[0].y;
              E[E.length - 1] = N.join(",");
              N = I[1]
            }
            E.push([N.x, N.y, S.x, S.y, U.x, U.y].join(","));
            I = U;
            K = S
          }
          for (E.push("L"); p < C;) {
            S = w.getItem(p);
            E.push([S.x, S.y].join(","));
            p++
          }
          E = E.join(" ");
          p = O({
            element: "path",
            curStyles: true,
            attr: {
              id: Za(),
              d: E,
              fill: "none"
            }
          })
        }
        return p
      },
      setSegType: function(p) {
        svgedit.path.path.setSegType(p)
      },
      moveNode: function(p, w) {
        var C = svgedit.path.path.selected_pts;
        if (C.length) {
          svgedit.path.path.storeD();
          C = svgedit.path.path.segs[C[0]];
          var I = {
            x: 0,
            y: 0
          };
          I[p] = w - C.item[p];
          C.move(I.x, I.y);
          svgedit.path.path.endChanges("Move path point")
        }
      },
      fixEnd: function(p) {
        var w = p.pathSegList,
          C = w.numberOfItems,
          I, K;
        for (I = 0; I < C; ++I) {
          var E = w.getItem(I);
          if (E.pathSegType === 2) K = E;
          if (E.pathSegType === 1) {
            E = w.getItem(I - 1);
            if (E.x != K.x || E.y != K.y) {
              w = p.createSVGPathSegLinetoAbs(K.x, K.y);
              svgedit.path.insertItemBefore(p, w, I);
              ra.fixEnd(p);
              break
            }
          }
        }
        svgedit.browser.isWebkit() && p.setAttribute("d", ra.convertPath(p))
      },
      convertPath: function(p, w) {
        var C, I = p.pathSegList,
          K = I.numberOfItems,
          E = 0,
          N = 0,
          S = "",
          U = null;
        for (C = 0; C < K; ++C) {
          var X = I.getItem(C),
            da = X.x || 0,
            R = X.y || 0,
            L = X.x1 || 0,
            J = X.y1 || 0,
            M = X.x2 || 0,
            Q = X.y2 || 0,
            aa = X.pathSegType,
            ga = gc[aa]["to" + (w ? "Lower" : "Upper") + "Case"](),
            oa = function(za, ca, ta) {
              ca = ca ? " " + ca.join(" ") : "";
              ta = ta ? " " + svgedit.units.shortFloat(ta) : "";
              $.each(za, function(Aa, ab) {
                za[Aa] = svgedit.units.shortFloat(ab)
              });
              S += ga + za.join(" ") + ca + ta
            };
          switch (aa) {
            case 1:
              S += "z";
              break;
            case 12:
              da -= E;
            case 13:
              if (w) {
                E += da;
                ga = "l"
              } else {
                da += E;
                E = da;
                ga = "L"
              }
              oa([
                [da, N]
              ]);
              break;
            case 14:
              R -= N;
            case 15:
              if (w) {
                N += R;
                ga = "l"
              } else {
                R += N;
                N = R;
                ga = "L"
              }
              oa([
                [E, R]
              ]);
              break;
            case 2:
            case 4:
            case 18:
              da -= E;
              R -= N;
            case 5:
            case 3:
              if (U && I.getItem(C - 1).pathSegType === 1 && !w) {
                E = U[0];
                N = U[1]
              }
            case 19:
              if (w) {
                E += da;
                N += R
              } else {
                da += E;
                R += N;
                E = da;
                N = R
              }
              if (aa === 3) U = [E, N];
              oa([
                [da, R]
              ]);
              break;
            case 6:
              da -= E;
              L -= E;
              M -= E;
              R -= N;
              J -= N;
              Q -= N;
            case 7:
              if (w) {
                E += da;
                N += R
              } else {
                da += E;
                L += E;
                M += E;
                R += N;
                J += N;
                Q += N;
                E = da;
                N = R
              }
              oa([
                [L, J],
                [M, Q],
                [da, R]
              ]);
              break;
            case 8:
              da -= E;
              L -= E;
              R -= N;
              J -= N;
            case 9:
              if (w) {
                E += da;
                N += R
              } else {
                da += E;
                L += E;
                R += N;
                J += N;
                E = da;
                N = R
              }
              oa([
                [L, J],
                [da, R]
              ]);
              break;
            case 10:
              da -= E;
              R -= N;
            case 11:
              if (w) {
                E += da;
                N += R
              } else {
                da += E;
                R += N;
                E = da;
                N = R
              }
              oa([
                [X.r1, X.r2]
              ], [X.angle, X.largeArcFlag ? 1 : 0, X.sweepFlag ? 1 : 0], [da, R]);
              break;
            case 16:
              da -= E;
              M -= E;
              R -= N;
              Q -= N;
            case 17:
              if (w) {
                E += da;
                N += R
              } else {
                da += E;
                M += E;
                R += N;
                Q += N;
                E = da;
                N = R
              }
              oa([
                [M, Q],
                [da, R]
              ])
          }
        }
        return S
      }
    }
  }();
  var Pb = this.removeUnusedDefElems = function() {
    var b = s.getElementsByTagNameNS(d.SVG, "defs");
    if (!b || !b.length) return 0;
    var f = [],
      e = 0,
      q = ["fill", "stroke", "filter", "marker-start", "marker-mid", "marker-end"],
      k = q.length,
      D = s.getElementsByTagNameNS(d.SVG, "*"),
      p = D.length,
      w, C;
    for (w = 0; w < p; w++) {
      var I = D[w];
      for (C = 0; C < k; C++) {
        var K = svgedit.utilities.getUrlFromAttr(I.getAttribute(q[C]));
        K && f.push(K.substr(1))
      }(C = Ca(I)) && C.indexOf("#") === 0 && f.push(C.substr(1))
    }
    b = $(b).find("linearGradient, radialGradient, filter, marker, svg, symbol");
    for (w = b.length; w--;) {
      q = b[w];
      k = q.id;
      if (f.indexOf(k) < 0) {
        Bb[k] = q;
        q.parentNode.removeChild(q);
        e++
      }
    }
    return e
  };
  this.svgCanvasToString = function() {
    for (; Pb() > 0;);
    ra.clear(true);
    $.each(s.childNodes, function(e, q) {
      e && q.nodeType === 8 && q.data.indexOf("Created with") >= 0 && s.insertBefore(q, s.firstChild)
    });
    if (B) {
      Ob();
      $a([B])
    }
    var b = [];
    $(s).find("g:data(gsvg)").each(function() {
      var e = this.attributes,
        q = e.length,
        k;
      for (k = 0; k < q; k++) if (e[k].nodeName == "id" || e[k].nodeName == "style") q--;
      if (q <= 0) {
        e = this.firstChild;
        b.push(e);
        $(this).replaceWith(e)
      }
    });
    var f = this.svgToString(s, 0);
    b.length && $(b).each(function() {
      Lb(this)
    });
    return f
  };
  this.svgToString = function(b, f) {
    var e = [],
      q = svgedit.utilities.toXml,
      k = l.baseUnit,
      D = RegExp("^-?[\\d\\.]+" + k + "$");
    if (b) {
      ua(b);
      var p = b.attributes,
        w, C, I = b.childNodes;
      for (C = 0; C < f; C++) e.push(" ");
      e.push("<");
      e.push(b.nodeName);
      if (b.id === "svgcontent") {
        C = sb();
        if (k !== "px") {
          C.w = svgedit.units.convertUnit(C.w, k) + k;
          C.h = svgedit.units.convertUnit(C.h, k) + k
        }
        e.push(' width="' + C.w + '" height="' + C.h + '" xmlns="' + d.SVG + '"');
        var K = {};
        $(b).find("*").andSelf().each(function() {
          var U = this.namespaceURI;
          if (U && !K[U] && bb[U] && bb[U] !== "xmlns" && bb[U] !== "xml") {
            K[U] = true;
            e.push(" xmlns:" + bb[U] + '="' + U + '"')
          }
          $.each(this.attributes, function(X, da) {
            var R = da.namespaceURI;
            if (R && !K[R] && bb[R] !== "xmlns" && bb[R] !== "xml") {
              K[R] = true;
              e.push(" xmlns:" + bb[R] + '="' + R + '"')
            }
          })
        });
        C = p.length;
        for (k = ["width", "height", "xmlns", "x", "y", "viewBox", "id", "overflow"]; C--;) {
          w = p.item(C);
          var E = q(w.value);
          if (w.nodeName.indexOf("xmlns:") !== 0) if (E != "" && k.indexOf(w.localName) == -1) if (!w.namespaceURI || bb[w.namespaceURI]) {
            e.push(" ");
            e.push(w.nodeName);
            e.push('="');
            e.push(E);
            e.push('"')
          }
        }
      } else {
        if (b.nodeName === "defs" && !b.firstChild) return;
        var N = ["-moz-math-font-style", "_moz-math-font-style"];
        for (C = p.length - 1; C >= 0; C--) {
          w = p.item(C);
          E = q(w.value);
          if (!(N.indexOf(w.localName) >= 0)) if (E != "") if (E.indexOf("pointer-events") !== 0) if (!(w.localName === "class" && E.indexOf("se_") === 0)) {
            e.push(" ");
            if (w.localName === "d") E = ra.convertPath(b, true);
            if (isNaN(E)) {
              if (D.test(E)) E = svgedit.units.shortFloat(E) + k
            } else E = svgedit.units.shortFloat(E);
            if (Xa.apply && b.nodeName === "image" && w.localName === "href" && Xa.images && Xa.images === "embed") {
              var S = jb[E];
              if (S) E = S
            }
            if (!w.namespaceURI || w.namespaceURI == d.SVG || bb[w.namespaceURI]) {
              e.push(w.nodeName);
              e.push('="');
              e.push(E);
              e.push('"')
            }
          }
        }
      }
      if (b.hasChildNodes()) {
        e.push(">");
        f++;
        p = false;
        for (C = 0; C < I.length; C++) {
          k = I.item(C);
          switch (k.nodeType) {
            case 1:
              e.push("\n");
              e.push(this.svgToString(I.item(C), f));
              break;
            case 3:
              k = k.nodeValue.replace(/^\s+|\s+$/g, "");
              if (k != "") {
                p = true;
                e.push(String(q(k)))
              }
              break;
            case 4:
              e.push("\n");
              e.push(Array(f + 1).join(" "));
              e.push("<![CDATA[");
              e.push(k.nodeValue);
              e.push("]]\>");
              break;
            case 8:
              e.push("\n");
              e.push(Array(f + 1).join(" "));
              e.push("<!--");
              e.push(k.data);
              e.push("--\>")
          }
        }
        f--;
        if (!p) {
          e.push("\n");
          for (C = 0; C < f; C++) e.push(" ")
        }
        e.push("</");
        e.push(b.nodeName);
        e.push(">")
      } else e.push("/>")
    }
    return e.join("")
  };
  this.embedImage = function(b, f) {
    $(new Image).load(function() {
      var e = document.createElement("canvas");
      e.width = this.width;
      e.height = this.height;
      e.getContext("2d").drawImage(this, 0, 0);
      try {
        var q = ";svgedit_url=" + encodeURIComponent(b);
        q = e.toDataURL().replace(";base64", q + ";base64");
        jb[b] = q
      } catch (k) {
        jb[b] = false
      }
      na = b;
      f && f(jb[b])
    }).attr("src", b)
  };
  this.setGoodImage = function(b) {
    na = b
  };
  this.open = function() {};
  this.save = function(b) {
    xa();
    b && $.extend(Xa, b);
    Xa.apply = true;
    b = this.svgCanvasToString();
    W("saved", b)
  };
  this.rasterExport = function(b, f, e) {
    var q = "image/" + b.toLowerCase(),
      k = j(),
      D = this.svgCanvasToString();
    svgedit.utilities.buildCanvgCallback(function() {
      var p = b || "PNG";
      $("#export_canvas").length || $("<canvas>", {
        id: "export_canvas"
      }).hide().appendTo("body");
      var w = $("#export_canvas")[0];
      w.width = svgCanvas.contentW;
      w.height = svgCanvas.contentH;
      canvg(w, D, {
        renderCallback: function() {
          var C = (p === "ICO" ? "BMP" : p).toLowerCase();
          C = f ? w.toDataURL("image/" + C, f) : w.toDataURL("image/" + C);
          W("exported", {
            datauri: C,
            svg: D,
            issues: k,
            type: b,
            mimeType: q,
            quality: f,
            exportWindowName: e
          })
        }
      })
    })()
  };
  this.exportPDF = function(b, f) {
    var e = this;
    svgedit.utilities.buildJSPDFCallback(function() {
      var q = sb();
      q = jsPDF({
        orientation: q.w > q.h ? "landscape" : "portrait",
        unit: "pt",
        format: [q.w, q.h]
      });
      var k = ic();
      q.setProperties({
        title: k
      });
      k = j();
      var D = e.svgCanvasToString();
      q.addSVG(D, 0, 0);
      k = {
        svg: D,
        issues: k,
        exportWindowName: b
      };
      D = f || "dataurlstring";
      k[D] = q.output(D);
      W("exportedPDF", k)
    })()
  };
  this.getSvgString = function() {
    Xa.apply = false;
    return this.svgCanvasToString()
  };
  this.randomizeIds = function(b) {
    arguments.length > 0 && b == false ? svgedit.draw.randomizeIds(false, A()) : svgedit.draw.randomizeIds(true, A())
  };
  var Qb = this.uniquifyElems = function(b) {
      var f = {},
        e = ["filter", "linearGradient", "pattern", "radialGradient", "symbol", "textPath", "use"];
      svgedit.utilities.walkTree(b, function(w) {
        if (w.nodeType == 1) {
          if (w.id) {
            w.id in f || (f[w.id] = {
              elem: null,
              attrs: [],
              hrefs: []
            });
            f[w.id].elem = w
          }
          $.each(Tb, function(I, K) {
            var E = w.getAttributeNode(K);
            if (E) {
              var N = svgedit.utilities.getUrlFromAttr(E.value);
              if (N = N ? N.substr(1) : null) {
                N in f || (f[N] = {
                  elem: null,
                  attrs: [],
                  hrefs: []
                });
                f[N].attrs.push(E)
              }
            }
          });
          var C = svgedit.utilities.getHref(w);
          if (C && e.indexOf(w.nodeName) >= 0) if (C = C.substr(1)) {
            C in f || (f[C] = {
              elem: null,
              attrs: [],
              hrefs: []
            });
            f[C].hrefs.push(w)
          }
        }
      });
      for (var q in f) if (q) {
        var k = f[q].elem;
        if (k) {
          b = Ha();
          k.id = b;
          k = f[q].attrs;
          for (var D = k.length; D--;) {
            var p = k[D];
            p.ownerElement.setAttribute(p.name, "url(#" + b + ")")
          }
          k = f[q].hrefs;
          for (D = k.length; D--;) svgedit.utilities.setHref(k[D], "#" + b)
        }
      }
    },
    zb = this.setUseData = function(b) {
      var f = $(b);
      if (b.tagName !== "use") f = f.find("use");
      f.each(function() {
        var e = Ca(this).substr(1);
        if (e = svgedit.utilities.getElem(e)) {
          $(this).data("ref", e);
          if (e.tagName == "symbol" || e.tagName == "svg") $(this).data("symbol", e).data("ref", e)
        }
      })
    },
    Wb = this.convertGradients = function(b) {
      var f = $(b).find("linearGradient, radialGradient");
      if (!f.length && svgedit.browser.isWebkit()) f = $(b).find("*").filter(function() {
        return this.tagName.indexOf("Gradient") >= 0
      });
      f.each(function() {
        if ($(this).attr("gradientUnits") === "userSpaceOnUse") {
          var e = $(s).find('[fill="url(#' + this.id + ')"],[stroke="url(#' + this.id + ')"]');
          if (e.length) if (e = svgedit.utilities.getBBox(e[0])) if (this.tagName === "linearGradient") {
            var q = $(this).attr(["x1", "y1", "x2", "y2"]),
              k = this.gradientTransform.baseVal;
            if (k && k.numberOfItems > 0) {
              var D = svgedit.math.transformListToTransform(k).matrix;
              k = svgedit.math.transformPoint(q.x1, q.y1, D);
              D = svgedit.math.transformPoint(q.x2, q.y2, D);
              q.x1 = k.x;
              q.y1 = k.y;
              q.x2 = D.x;
              q.y2 = D.y;
              this.removeAttribute("gradientTransform")
            }
            $(this).attr({
              x1: (q.x1 - e.x) / e.width,
              y1: (q.y1 - e.y) / e.height,
              x2: (q.x2 - e.x) / e.width,
              y2: (q.y2 - e.y) / e.height
            });
            this.removeAttribute("gradientUnits")
          }
        }
      })
    },
    Zb = this.convertToGroup = function(b) {
      b || (b = r[0]);
      var f = $(b),
        e = new svgedit.history.BatchCommand,
        q;
      if (f.data("gsvg")) {
        e = $(b.firstChild).attr(["x", "y"]);
        $(b.firstChild.firstChild).unwrap();
        $(b).removeData("gsvg");
        q = svgedit.transformlist.getTransformList(b);
        var k = z.createSVGTransform();
        k.setTranslate(e.x, e.y);
        q.appendItem(k);
        svgedit.recalculate.recalculateDimensions(b);
        W("selected", [b])
      } else if (f.data("symbol")) {
        b = f.data("symbol");
        q = f.attr("transform");
        k = f.attr(["x", "y"]);
        var D = b.getAttribute("viewBox");
        if (D) {
          D = D.split(" ");
          k.x -= +D[0];
          k.y -= +D[1]
        }
        q += " translate(" + (k.x || 0) + "," + (k.y || 0) + ")";
        k = f.prev();
        e.addSubCommand(new svgedit.history.RemoveElementCommand(f[0], f[0].nextSibling, f[0].parentNode));
        f.remove();
        D = $(s).find("use:data(symbol)").length;
        f = m.createElementNS(d.SVG, "g");
        var p = b.childNodes,
          w;
        for (w = 0; w < p.length; w++) f.appendChild(p[w].cloneNode(true));
        if (svgedit.browser.isGecko()) {
          p = $(svgedit.utilities.findDefs()).children("linearGradient,radialGradient,pattern").clone();
          $(f).append(p)
        }
        q && f.setAttribute("transform", q);
        q = b.parentNode;
        Qb(f);
        svgedit.browser.isGecko() && $(ia()).append($(f).find("linearGradient,radialGradient,pattern"));
        f.id = Ha();
        k.after(f);
        if (q) {
          if (!D) {
            k = b.nextSibling;
            q.removeChild(b);
            e.addSubCommand(new svgedit.history.RemoveElementCommand(b, k, q))
          }
          e.addSubCommand(new svgedit.history.InsertElementCommand(f))
        }
        zb(f);
        svgedit.browser.isGecko() ? Wb(svgedit.utilities.findDefs()) : Wb(f);
        svgedit.utilities.walkTreePost(f, function(C) {
          try {
            svgedit.recalculate.recalculateDimensions(C)
          } catch (I) {
            console.log(I)
          }
        });
        $(f).find("a,circle,ellipse,foreignObject,g,image,line,path,polygon,polyline,rect,svg,text,tspan,use").each(function() {
          if (!this.id) this.id = Ha()
        });
        $a([f]);
        (b = Vb(f, true)) && e.addSubCommand(b);
        pa(e)
      } else console.log("Unexpected element to ungroup:", b)
    };
  this.setSvgString = function(b) {
    try {
      var f = svgedit.utilities.text2xml(b);
      this.prepareSvg(f);
      var e = new svgedit.history.BatchCommand("Change Source"),
        q = s.nextSibling,
        k = z.removeChild(s);
      e.addSubCommand(new svgedit.history.RemoveElementCommand(k, q, z));
      s = m.adoptNode ? m.adoptNode(f.documentElement) : m.importNode(f.documentElement, true);
      z.appendChild(s);
      var D = $(s);
      o.current_drawing_ = new svgedit.draw.Drawing(s, F);
      var p = A().getNonce();
      p ? W("setnonce", p) : W("unsetnonce");
      D.find("image").each(function() {
        var S = this;
        vb(S);
        var U = Ca(this);
        if (U) {
          if (U.indexOf("data:") === 0) {
            var X = U.match(/svgedit_url=(.*?);/);
            if (X) {
              var da = decodeURIComponent(X[1]);
              $(new Image).load(function() {
                S.setAttributeNS(d.XLINK, "xlink:href", da)
              }).attr("src", da)
            }
          }
          o.embedImage(U)
        }
      });
      D.find("svg").each(function() {
        if (!$(this).closest("defs").length) {
          Qb(this);
          var S = this.parentNode;
          if (S.childNodes.length === 1 && S.nodeName === "g") {
            $(S).data("gsvg", this);
            S.id = S.id || Ha()
          } else Lb(this)
        }
      });
      svgedit.browser.isGecko() && D.find("linearGradient, radialGradient, pattern").appendTo(svgedit.utilities.findDefs());
      zb(D);
      Wb(D[0]);
      svgedit.utilities.walkTreePost(s, function(S) {
        try {
          svgedit.recalculate.recalculateDimensions(S)
        } catch (U) {
          console.log(U)
        }
      });
      var w = {
          id: "svgcontent",
          overflow: l.show_outside_canvas ? "visible" : "hidden"
        },
        C = false;
      if (D.attr("viewBox")) {
        var I = D.attr("viewBox").split(" ");
        w.width = I[2];
        w.height = I[3]
      } else $.each(["width", "height"], function(S, U) {
        var X = D.attr(U);
        X || (X = "100%");
        if (String(X).substr(-1) === "%") C = true;
        else w[U] = svgedit.units.convertToNum(U, X)
      });
      wb();
      D.children().find("a,circle,ellipse,foreignObject,g,image,line,path,polygon,polyline,rect,svg,text,tspan,use").each(function() {
        if (!this.id) this.id = Ha()
      });
      if (C) {
        var K = getStrokedBBox();
        w.width = K.width + K.x;
        w.height = K.height + K.y
      }
      if (w.width <= 0) w.width = 100;
      if (w.height <= 0) w.height = 100;
      D.attr(w);
      this.contentW = w.width;
      this.contentH = w.height;
      e.addSubCommand(new svgedit.history.InsertElementCommand(s));
      var E = D.attr(["width", "height"]);
      e.addSubCommand(new svgedit.history.ChangeElementCommand(z, E));
      i = 1;
      svgedit.transformlist.resetListMap();
      xa();
      svgedit.path.clearData();
      z.appendChild(qa.selectorParentGroup);
      pa(e);
      W("changed", [s])
    } catch (N) {
      console.log(N);
      return false
    }
    return true
  };
  this.importSvgString = function(b) {
    var f, e;
    try {
      var q = svgedit.utilities.encode64(b.length + b).substr(0, 32),
        k = false;
      if (lb[q]) if ($(lb[q].symbol).parents("#svgroot").length) k = true;
      var D = new svgedit.history.BatchCommand("Import Image"),
        p;
      if (k) {
        p = lb[q].symbol;
        e = lb[q].xform
      } else {
        var w = svgedit.utilities.text2xml(b);
        this.prepareSvg(w);
        var C;
        C = m.adoptNode ? m.adoptNode(w.documentElement) : m.importNode(w.documentElement, true);
        Qb(C);
        var I = svgedit.units.convertToNum("width", C.getAttribute("width")),
          K = svgedit.units.convertToNum("height", C.getAttribute("height")),
          E = C.getAttribute("viewBox"),
          N = E ? E.split(" ") : [0, 0, I, K];
        for (f = 0; f < 4; ++f) N[f] = +N[f];
        s.getAttribute("width");
        var S = +s.getAttribute("height");
        e = K > I ? "scale(" + S / 3 / N[3] + ")" : "scale(" + S / 3 / N[2] + ")";
        e = "translate(0) " + e + " translate(0)";
        p = m.createElementNS(d.SVG, "symbol");
        var U = svgedit.utilities.findDefs();
        for (svgedit.browser.isGecko() && $(C).find("linearGradient, radialGradient, pattern").appendTo(U); C.firstChild;) p.appendChild(C.firstChild);
        var X = C.attributes,
          da;
        for (da = 0; da < X.length; da++) {
          var R = X[da];
          p.setAttribute(R.nodeName, R.value)
        }
        p.id = Ha();
        lb[q] = {
          symbol: p,
          xform: e
        };
        svgedit.utilities.findDefs().appendChild(p);
        D.addSubCommand(new svgedit.history.InsertElementCommand(p))
      }
      var L = m.createElementNS(d.SVG, "use");
      L.id = Ha();
      eb(L, "#" + p.id);
      (B || A().getCurrentLayer()).appendChild(L);
      D.addSubCommand(new svgedit.history.InsertElementCommand(L));
      xa();
      L.setAttribute("transform", e);
      svgedit.recalculate.recalculateDimensions(L);
      $(L).data("symbol", p).data("ref", p);
      gb([L]);
      pa(D);
      W("changed", [s])
    } catch (J) {
      console.log(J);
      return false
    }
    return true
  };
  var wb = o.identifyLayers = function() {
    Ob();
    A().identifyLayers()
  };
  this.createLayer = function(b) {
    var f = new svgedit.history.BatchCommand("Create Layer");
    b = A().createLayer(b);
    f.addSubCommand(new svgedit.history.InsertElementCommand(b));
    pa(f);
    xa();
    W("changed", [b])
  };
  this.cloneLayer = function(b) {
    var f = new svgedit.history.BatchCommand("Duplicate Layer"),
      e = m.createElementNS(d.SVG, "g"),
      q = m.createElementNS(d.SVG, "title");
    q.textContent = b;
    e.appendChild(q);
    q = A().getCurrentLayer();
    $(q).after(e);
    q = q.childNodes;
    var k;
    for (k = 0; k < q.length; k++) {
      var D = q[k];
      D.localName != "title" && e.appendChild(ob(D))
    }
    xa();
    wb();
    f.addSubCommand(new svgedit.history.InsertElementCommand(e));
    pa(f);
    o.setCurrentLayer(b);
    W("changed", [e])
  };
  this.deleteCurrentLayer = function() {
    var b = A().getCurrentLayer(),
      f = b.nextSibling,
      e = b.parentNode;
    if (b = A().deleteCurrentLayer()) {
      var q = new svgedit.history.BatchCommand("Delete Layer");
      q.addSubCommand(new svgedit.history.RemoveElementCommand(b, f, e));
      pa(q);
      xa();
      W("changed", [e]);
      return true
    }
    return false
  };
  this.setCurrentLayer = function(b) {
    (b = A().setCurrentLayer(svgedit.utilities.toXml(b))) && xa();
    return b
  };
  this.renameCurrentLayer = function(b) {
    var f, e = A();
    if (e.current_layer) {
      var q = e.current_layer;
      if (!o.setCurrentLayer(b)) {
        var k = new svgedit.history.BatchCommand("Rename Layer");
        for (f = 0; f < e.getNumLayers(); ++f) if (e.all_layers[f][1] == q) break;
        var D = e.getLayerName(f);
        e.all_layers[f][0] = svgedit.utilities.toXml(b);
        var p = q.childNodes.length;
        for (f = 0; f < p; ++f) {
          var w = q.childNodes.item(f);
          if (w && w.tagName == "title") {
            for (; w.firstChild;) w.removeChild(w.firstChild);
            w.textContent = b;
            k.addSubCommand(new svgedit.history.ChangeElementCommand(w, {
              "#text": D
            }));
            pa(k);
            W("changed", [q]);
            return true
          }
        }
      }
      e.current_layer = q
    }
    return false
  };
  this.setCurrentLayerPosition = function(b) {
    var f, e = A();
    if (e.current_layer && b >= 0 && b < e.getNumLayers()) {
      for (f = 0; f < e.getNumLayers(); ++f) if (e.all_layers[f][1] == e.current_layer) break;
      if (f == e.getNumLayers()) return false;
      if (f != b) {
        var q = null,
          k = e.current_layer.nextSibling;
        if (b > f) {
          if (b < e.getNumLayers() - 1) q = e.all_layers[b + 1][1]
        } else q = e.all_layers[b][1];
        s.insertBefore(e.current_layer, q);
        pa(new svgedit.history.MoveElementCommand(e.current_layer, k, s));
        wb();
        o.setCurrentLayer(e.getLayerName(b));
        return true
      }
    }
    return false
  };
  this.setLayerVisibility = function(b, f) {
    var e = A(),
      q = e.getLayerVisibility(b),
      k = e.setLayerVisibility(b, f);
    if (k) pa(new svgedit.history.ChangeElementCommand(k, {
      display: q ? "inline" : "none"
    }, "Layer Visibility"));
    else return false;
    if (k == e.getCurrentLayer()) {
      xa();
      ra.clear()
    }
    return true
  };
  this.moveSelectedToLayer = function(b) {
    var f, e = null,
      q = A();
    for (f = 0; f < q.getNumLayers(); ++f) if (q.getLayerName(f) == b) {
      e = q.all_layers[f][1];
      break
    }
    if (!e) return false;
    b = new svgedit.history.BatchCommand("Move Elements to Layer");
    q = r;
    for (f = q.length; f--;) {
      var k = q[f];
      if (k) {
        var D = k.nextSibling,
          p = k.parentNode;
        e.appendChild(k);
        b.addSubCommand(new svgedit.history.MoveElementCommand(k, D, p))
      }
    }
    pa(b);
    return true
  };
  this.mergeLayer = function(b) {
    var f = new svgedit.history.BatchCommand("Merge Layer"),
      e = A(),
      q = $(e.current_layer).prev()[0];
    if (q) {
      for (f.addSubCommand(new svgedit.history.RemoveElementCommand(e.current_layer, e.current_layer.nextSibling, s)); e.current_layer.firstChild;) {
        var k = e.current_layer.firstChild;
        if (k.localName == "title") {
          f.addSubCommand(new svgedit.history.RemoveElementCommand(k, k.nextSibling, e.current_layer));
          e.current_layer.removeChild(k)
        } else {
          var D = k.nextSibling;
          q.appendChild(k);
          f.addSubCommand(new svgedit.history.MoveElementCommand(k, D, e.current_layer))
        }
      }
      s.removeChild(e.current_layer);
      if (!b) {
        xa();
        wb();
        W("changed", [s]);
        pa(f)
      }
      e.current_layer = q;
      return f
    }
  };
  this.mergeAllLayers = function() {
    var b = new svgedit.history.BatchCommand("Merge all Layers"),
      f = A();
    for (f.current_layer = f.all_layers[f.getNumLayers() - 1][1]; $(s).children("g").length > 1;) b.addSubCommand(o.mergeLayer(true));
    xa();
    wb();
    W("changed", [s]);
    pa(b)
  };
  var Ob = this.leaveContext = function() {
      var b, f = Qa.length;
      if (f) {
        for (b = 0; b < f; b++) {
          var e = Qa[b],
            q = rb(e, "orig_opac");
          q !== 1 ? e.setAttribute("opacity", q) : e.removeAttribute("opacity");
          e.setAttribute("style", "pointer-events: inherit")
        }
        Qa = [];
        xa(true);
        W("contextset", null)
      }
      B = null
    },
    hc = this.setContext = function(b) {
      Ob();
      if (typeof b === "string") b = svgedit.utilities.getElem(b);
      B = b;
      $(b).parentsUntil("#svgcontent").andSelf().siblings().each(function() {
        var f = this.getAttribute("opacity") || 1;
        rb(this, "orig_opac", f);
        this.setAttribute("opacity", f * 0.33);
        this.setAttribute("style", "pointer-events: none");
        Qa.push(this)
      });
      xa();
      W("contextset", B)
    };
  this.clear = function() {
    ra.clear();
    xa();
    o.clearSvgContentElement();
    o.current_drawing_ = new svgedit.draw.Drawing(s);
    o.createLayer("Layer 1");
    o.undoMgr.resetUndoStack();
    qa.initGroup();
    Da = qa.getRubberBandBox();
    W("cleared")
  };
  this.linkControlPoints = ra.linkControlPoints;
  this.getContentElem = function() {
    return s
  };
  this.getRootElem = function() {
    return z
  };
  this.getSelectedElems = function() {
    return r
  };
  var sb = this.getResolution = function() {
    var b = s.getAttribute("width") / i,
      f = s.getAttribute("height") / i;
    return {
      w: b,
      h: f,
      zoom: i
    }
  };
  this.getZoom = function() {
    return i
  };
  this.getVersion = function() {
    return "svgcanvas.js ($Rev$)"
  };
  this.setUiStrings = function(b) {
    $.extend(qb, b.notification)
  };
  this.setConfig = function(b) {
    $.extend(l, b)
  };
  this.getTitle = function(b) {
    if (b = b || r[0]) {
      b = $(b).data("gsvg") || $(b).data("symbol") || b;
      var f = b.childNodes;
      for (b = 0; b < f.length; b++) if (f[b].nodeName == "title") return f[b].textContent;
      return ""
    }
  };
  this.setGroupTitle = function(b) {
    var f = r[0];
    f = $(f).data("gsvg") || f;
    var e = $(f).children("title"),
      q = new svgedit.history.BatchCommand("Set Label");
    if (b.length) if (e.length) {
      e = e[0];
      q.addSubCommand(new svgedit.history.ChangeElementCommand(e, {
        "#text": e.textContent
      }));
      e.textContent = b
    } else {
      e = m.createElementNS(d.SVG, "title");
      e.textContent = b;
      $(f).prepend(e);
      q.addSubCommand(new svgedit.history.InsertElementCommand(e))
    } else {
      q.addSubCommand(new svgedit.history.RemoveElementCommand(e[0], e.nextSibling, f));
      e.remove()
    }
    pa(q)
  };
  var ic = this.getDocumentTitle = function() {
    return o.getTitle(s)
  };
  this.setDocumentTitle = function(b) {
    var f, e = s.childNodes,
      q = false,
      k = "",
      D = new svgedit.history.BatchCommand("Change Image Title");
    for (f = 0; f < e.length; f++) if (e[f].nodeName == "title") {
      q = e[f];
      k = q.textContent;
      break
    }
    if (!q) {
      q = m.createElementNS(d.SVG, "title");
      s.insertBefore(q, s.firstChild)
    }
    if (b.length) q.textContent = b;
    else q.parentNode.removeChild(q);
    D.addSubCommand(new svgedit.history.ChangeElementCommand(q, {
      "#text": k
    }));
    pa(D)
  };
  this.getEditorNS = function(b) {
    b && s.setAttribute("xmlns:se", d.SE);
    return d.SE
  };
  this.setResolution = function(b, f) {
    var e = sb(),
      q = e.w;
    e = e.h;
    var k;
    if (b == "fit") {
      var D = getStrokedBBox();
      if (D) {
        k = new svgedit.history.BatchCommand("Fit Canvas to Content");
        var p = Ta();
        gb(p);
        var w = [],
          C = [];
        $.each(p, function() {
          w.push(D.x * -1);
          C.push(D.y * -1)
        });
        p = o.moveSelectedElements(w, C, true);
        k.addSubCommand(p);
        xa();
        b = Math.round(D.width);
        f = Math.round(D.height)
      } else return false
    }
    if (b != q || f != e) {
      p = z.suspendRedraw(1E3);
      k || (k = new svgedit.history.BatchCommand("Change Image Dimensions"));
      b = svgedit.units.convertToNum("width", b);
      f = svgedit.units.convertToNum("height", f);
      s.setAttribute("width", b);
      s.setAttribute("height", f);
      this.contentW = b;
      this.contentH = f;
      k.addSubCommand(new svgedit.history.ChangeElementCommand(s, {
        width: q,
        height: e
      }));
      s.setAttribute("viewBox", [0, 0, b / i, f / i].join(" "));
      k.addSubCommand(new svgedit.history.ChangeElementCommand(s, {
        viewBox: ["0 0", q, e].join(" ")
      }));
      pa(k);
      z.unsuspendRedraw(p);
      W("changed", [s])
    }
    return true
  };
  this.getOffset = function() {
    return $(s).attr(["x", "y"])
  };
  this.setBBoxZoom = function(b, f, e) {
    var q = 0.85,
      k = function(D) {
        if (!D) return false;
        var p = Math.min(Math.round(f / D.width * 100 * q) / 100, Math.round(e / D.height * 100 * q) / 100);
        o.setZoom(p);
        return {
          zoom: p,
          bbox: D
        }
      };
    if (typeof b == "object") {
      b = b;
      if (b.width == 0 || b.height == 0) {
        o.setZoom(b.zoom ? b.zoom : i * b.factor);
        return {
          zoom: i,
          bbox: b
        }
      }
      return k(b)
    }
    switch (b) {
      case "selection":
        if (!r[0]) return;
        b = $.map(r, function(D) {
          if (D) return D
        });
        b = getStrokedBBox(b);
        break;
      case "canvas":
        b = sb();
        q = 0.95;
        b = {
          width: b.w,
          height: b.h,
          x: 0,
          y: 0
        };
        break;
      case "content":
        b = getStrokedBBox();
        break;
      case "layer":
        b = getStrokedBBox(Ta(A().getCurrentLayer()));
        break;
      default:
        return
    }
    return k(b)
  };
  this.setZoom = function(b) {
    var f = sb();
    s.setAttribute("viewBox", "0 0 " + f.w / b + " " + f.h / b);
    i = b;
    $.each(r, function(e, q) {
      q && qa.requestSelector(q).resize()
    });
    ra.zoomChange();
    tb("zoomChanged", b)
  };
  this.getMode = function() {
    return va
  };
  this.setMode = function(b) {
    ra.clear(true);
    Ka.clear();
    ya = r[0] && r[0].nodeName == "text" ? Va : v;
    va = b
  };
  this.getColor = function(b) {
    return ya[b]
  };
  this.setColor = function(b, f, e) {
    function q(w) {
      w.nodeName != "g" && k.push(w)
    }
    v[b] = f;
    ya[b + "_paint"] = {
      type: "solidColor"
    };
    for (var k = [], D = r.length; D--;) {
      var p = r[D];
      if (p) if (p.tagName == "g") svgedit.utilities.walkTree(p, q);
      else if (b == "fill") p.tagName != "polyline" && p.tagName != "line" && k.push(p);
      else k.push(p)
    }
    if (k.length > 0) if (e) xb(b, f, k);
    else {
      Ma(b, f, k);
      W("changed", k)
    }
  };
  var ac = this.setGradient = function(b) {
      if (!(!ya[b + "_paint"] || ya[b + "_paint"].type == "solidColor")) {
        var f = o[b + "Grad"],
          e = $b(f),
          q = svgedit.utilities.findDefs();
        if (e) f = e;
        else {
          f = q.appendChild(m.importNode(f, true));
          f.id = Ha()
        }
        o.setColor(b, "url(#" + f.id + ")")
      }
    },
    $b = function(b) {
      var f = svgedit.utilities.findDefs();
      f = $(f).find("linearGradient, radialGradient");
      for (var e = f.length, q = ["r", "cx", "cy", "fx", "fy"]; e--;) {
        var k = f[e];
        if (b.tagName == "linearGradient") {
          if (b.getAttribute("x1") != k.getAttribute("x1") || b.getAttribute("y1") != k.getAttribute("y1") || b.getAttribute("x2") != k.getAttribute("x2") || b.getAttribute("y2") != k.getAttribute("y2")) continue
        } else {
          var D = $(b).attr(q),
            p = $(k).attr(q),
            w = false;
          $.each(q, function(S, U) {
            if (D[U] != p[U]) w = true
          });
          if (w) continue
        }
        var C = b.getElementsByTagNameNS(d.SVG, "stop"),
          I = k.getElementsByTagNameNS(d.SVG, "stop");
        if (C.length == I.length) {
          for (var K = C.length; K--;) {
            var E = C[K],
              N = I[K];
            if (E.getAttribute("offset") != N.getAttribute("offset") || E.getAttribute("stop-opacity") != N.getAttribute("stop-opacity") || E.getAttribute("stop-color") != N.getAttribute("stop-color")) break
          }
          if (K == -1) return k
        }
      }
      return null
    };
  this.setPaint = function(b, f) {
    var e = new $.jGraduate.Paint(f);
    this.setPaintOpacity(b, e.alpha / 100, true);
    ya[b + "_paint"] = e;
    switch (e.type) {
      case "solidColor":
        this.setColor(b, e.solidColor != "none" ? "#" + e.solidColor : "none");
        break;
      case "linearGradient":
      case "radialGradient":
        o[b + "Grad"] = e[e.type];
        ac(b)
    }
  };
  this.setStrokePaint = function(b) {
    this.setPaint("stroke", b)
  };
  this.setFillPaint = function(b) {
    this.setPaint("fill", b)
  };
  this.getStrokeWidth = function() {
    return ya.stroke_width
  };
  this.setStrokeWidth = function(b) {
    function f(D) {
      D.nodeName != "g" && e.push(D)
    }
    if (b == 0 && ["line", "path"].indexOf(va) >= 0) o.setStrokeWidth(1);
    else {
      ya.stroke_width = b;
      for (var e = [], q = r.length; q--;) {
        var k = r[q];
        if (k) k.tagName == "g" ? svgedit.utilities.walkTree(k, f) : e.push(k)
      }
      if (e.length > 0) {
        Ma("stroke-width", b, e);
        W("changed", r)
      }
    }
  };
  this.setStrokeAttr = function(b, f) {
    v[b.replace("-", "_")] = f;
    for (var e = [], q = r.length; q--;) {
      var k = r[q];
      if (k) k.tagName == "g" ? svgedit.utilities.walkTree(k, function(D) {
        D.nodeName != "g" && e.push(D)
      }) : e.push(k)
    }
    if (e.length > 0) {
      Ma(b, f, e);
      W("changed", r)
    }
  };
  this.getStyle = function() {
    return v
  };
  this.getOpacity = function() {
    return v.opacity
  };
  this.setOpacity = function(b) {
    v.opacity = b;
    Ma("opacity", b)
  };
  this.getFillOpacity = function() {
    return v.fill_opacity
  };
  this.getStrokeOpacity = function() {
    return v.stroke_opacity
  };
  this.setPaintOpacity = function(b, f, e) {
    v[b + "_opacity"] = f;
    e ? xb(b + "-opacity", f) : Ma(b + "-opacity", f)
  };
  this.getPaintOpacity = function(b) {
    return b === "fill" ? this.getFillOpacity() : this.getStrokeOpacity()
  };
  this.getBlur = function(b) {
    var f = 0;
    if (b) if (b.getAttribute("filter")) if (b = svgedit.utilities.getElem(b.id + "_blur")) f = b.firstChild.getAttribute("stdDeviation");
    return f
  };
  (function() {
    function b() {
      var k = o.undoMgr.finishUndoableChange();
      f.addSubCommand(k);
      pa(f);
      e = f = null
    }
    var f = null,
      e = null,
      q = false;
    o.setBlurNoUndo = function(k) {
      if (e) if (k === 0) {
        xb("filter", "");
        q = true
      } else {
        var D = r[0];
        q && xb("filter", "url(#" + D.id + "_blur)");
        if (svgedit.browser.isWebkit()) {
          console.log("e", D);
          D.removeAttribute("filter");
          D.setAttribute("filter", "url(#" + D.id + "_blur)")
        }
        xb("stdDeviation", k, [e.firstChild]);
        o.setBlurOffsets(e, k)
      } else o.setBlur(k)
    };
    o.setBlurOffsets = function(k, D) {
      if (D > 3) svgedit.utilities.assignAttributes(k, {
        x: "-50%",
        y: "-50%",
        width: "200%",
        height: "200%"
      }, 100);
      else if (!svgedit.browser.isWebkit()) {
        k.removeAttribute("x");
        k.removeAttribute("y");
        k.removeAttribute("width");
        k.removeAttribute("height")
      }
    };
    o.setBlur = function(k, D) {
      if (f) b();
      else {
        var p = r[0],
          w = p.id;
        e = svgedit.utilities.getElem(w + "_blur");
        k -= 0;
        var C = new svgedit.history.BatchCommand;
        if (e) {
          if (k === 0) e = null
        } else {
          var I = O({
            element: "feGaussianBlur",
            attr: {
              "in": "SourceGraphic",
              stdDeviation: k
            }
          });
          e = O({
            element: "filter",
            attr: {
              id: w + "_blur"
            }
          });
          e.appendChild(I);
          svgedit.utilities.findDefs().appendChild(e);
          C.addSubCommand(new svgedit.history.InsertElementCommand(e))
        }
        I = {
          filter: p.getAttribute("filter")
        };
        if (k === 0) {
          p.removeAttribute("filter");
          C.addSubCommand(new svgedit.history.ChangeElementCommand(p, I))
        } else {
          Ma("filter", "url(#" + w + "_blur)");
          C.addSubCommand(new svgedit.history.ChangeElementCommand(p, I));
          o.setBlurOffsets(e, k);
          f = C;
          o.undoMgr.beginUndoableChange("stdDeviation", [e ? e.firstChild : null]);
          if (D) {
            o.setBlurNoUndo(k);
            b()
          }
        }
      }
    }
  })();
  this.getBold = function() {
    var b = r[0];
    if (b != null && b.tagName == "text" && r[1] == null) return b.getAttribute("font-weight") == "bold";
    return false
  };
  this.setBold = function(b) {
    var f = r[0];
    if (f != null && f.tagName == "text" && r[1] == null) Ma("font-weight", b ? "bold" : "normal");
    r[0].textContent || Ka.setCursor()
  };
  this.getItalic = function() {
    var b = r[0];
    if (b != null && b.tagName == "text" && r[1] == null) return b.getAttribute("font-style") == "italic";
    return false
  };
  this.setItalic = function(b) {
    var f = r[0];
    if (f != null && f.tagName == "text" && r[1] == null) Ma("font-style", b ? "italic" : "normal");
    r[0].textContent || Ka.setCursor()
  };
  this.getFontFamily = function() {
    return Va.font_family
  };
  this.setFontFamily = function(b) {
    Va.font_family = b;
    Ma("font-family", b);
    r[0] && !r[0].textContent && Ka.setCursor()
  };
  this.setFontColor = function(b) {
    Va.fill = b;
    Ma("fill", b)
  };
  this.getFontColor = function() {
    return Va.fill
  };
  this.getFontSize = function() {
    return Va.font_size
  };
  this.setFontSize = function(b) {
    Va.font_size = b;
    Ma("font-size", b);
    r[0].textContent || Ka.setCursor()
  };
  this.getText = function() {
    var b = r[0];
    if (b == null) return "";
    return b.textContent
  };
  this.setTextContent = function(b) {
    Ma("#text", b);
    Ka.init(b);
    Ka.setCursor()
  };
  this.setImageURL = function(b) {
    var f = r[0];
    if (f) {
      var e = $(f).attr(["width", "height"]);
      e = !e.width || !e.height;
      var q = Ca(f);
      if (q !== b) e = true;
      else if (!e) return;
      var k = new svgedit.history.BatchCommand("Change Image URL");
      eb(f, b);
      k.addSubCommand(new svgedit.history.ChangeElementCommand(f, {
        "#href": q
      }));
      e ? $(new Image).load(function() {
        var D = $(f).attr(["width", "height"]);
        $(f).attr({
          width: this.width,
          height: this.height
        });
        qa.requestSelector(f).resize();
        k.addSubCommand(new svgedit.history.ChangeElementCommand(f, D));
        pa(k);
        W("changed", [f])
      }).attr("src", b) : pa(k)
    }
  };
  this.setLinkURL = function(b) {
    var f = r[0];
    if (f) {
      if (f.tagName !== "a") {
        f = $(f).parents("a");
        if (f.length) f = f[0];
        else return
      }
      var e = Ca(f);
      if (e !== b) {
        var q = new svgedit.history.BatchCommand("Change Link URL");
        eb(f, b);
        q.addSubCommand(new svgedit.history.ChangeElementCommand(f, {
          "#href": e
        }));
        pa(q)
      }
    }
  };
  this.setRectRadius = function(b) {
    var f = r[0];
    if (f != null && f.tagName == "rect") {
      var e = f.getAttribute("rx");
      if (e != b) {
        f.setAttribute("rx", b);
        f.setAttribute("ry", b);
        pa(new svgedit.history.ChangeElementCommand(f, {
          rx: e,
          ry: e
        }, "Radius"));
        W("changed", [f])
      }
    }
  };
  this.makeHyperlink = function(b) {
    o.groupSelectedElements("a", b)
  };
  this.removeHyperlink = function() {
    o.ungroupSelectedElement()
  };
  this.setSegType = function(b) {
    ra.setSegType(b)
  };
  this.convertToPath = function(b, f) {
    if (b == null) $.each(r, function(R, L) {
      L && o.convertToPath(L)
    });
    else {
      if (!f) var e = new svgedit.history.BatchCommand("Convert element to Path");
      var q = f ? {} : {
        fill: v.fill,
        "fill-opacity": v.fill_opacity,
        stroke: v.stroke,
        "stroke-width": v.stroke_width,
        "stroke-dasharray": v.stroke_dasharray,
        "stroke-linejoin": v.stroke_linejoin,
        "stroke-linecap": v.stroke_linecap,
        "stroke-opacity": v.stroke_opacity,
        opacity: v.opacity,
        visibility: "hidden"
      };
      $.each(["marker-start", "marker-end", "marker-mid", "filter", "clip-path"], function() {
        if (b.getAttribute(this)) q[this] = b.getAttribute(this)
      });
      var k = O({
          element: "path",
          attr: q
        }),
        D = b.getAttribute("transform");
      D && k.setAttribute("transform", D);
      var p = b.id,
        w = b.parentNode;
      b.nextSibling ? w.insertBefore(k, b) : w.appendChild(k);
      var C = "",
        I = function(R) {
          $.each(R, function(L, J) {
            var M, Q = J[1];
            C += J[0];
            for (M = 0; M < Q.length; M += 2) C += Q[M] + "," + Q[M + 1] + " "
          })
        },
        K = 1.81,
        E, N;
      switch (b.tagName) {
        case "ellipse":
        case "circle":
          E = $(b).attr(["rx", "ry", "cx", "cy"]);
          var S = E.cx,
            U = E.cy;
          N = E.rx;
          ry = E.ry;
          if (b.tagName == "circle") N = ry = $(b).attr("r");
          I([
            ["M", [S - N, U]],
            ["C", [S - N, U - ry / K, S - N / K, U - ry, S, U - ry]],
            ["C", [S + N / K, U - ry, S + N, U - ry / K, S + N, U]],
            ["C", [S + N, U + ry / K, S + N / K, U + ry, S, U + ry]],
            ["C", [S - N / K, U + ry, S - N, U + ry / K, S - N, U]],
            ["Z", []]
          ]);
          break;
        case "path":
          C = b.getAttribute("d");
          break;
        case "line":
          E = $(b).attr(["x1", "y1", "x2", "y2"]);
          C = "M" + E.x1 + "," + E.y1 + "L" + E.x2 + "," + E.y2;
          break;
        case "polyline":
        case "polygon":
          C = "M" + b.getAttribute("points");
          break;
        case "rect":
          E = $(b).attr(["rx", "ry"]);
          N = E.rx;
          ry = E.ry;
          var X = b.getBBox();
          E = X.x;
          S = X.y;
          U = X.width;
          X = X.height;
          K = 4 - K;
          !N && !ry ? I([
            ["M", [E, S]],
            ["L", [E + U, S]],
            ["L", [E + U, S + X]],
            ["L", [E, S + X]],
            ["L", [E, S]],
            ["Z", []]
          ]) : I([
            ["M", [E, S + ry]],
            ["C", [E, S + ry / K, E + N / K, S, E + N, S]],
            ["L", [E + U - N, S]],
            ["C", [E + U - N / K, S, E + U, S + ry / K, E + U, S + ry]],
            ["L", [E + U, S + X - ry]],
            ["C", [E + U, S + X - ry / K, E + U - N / K, S + X, E + U - N, S + X]],
            ["L", [E + N, S + X]],
            ["C", [E + N / K, S + X, E, S + X - ry / K, E, S + X - ry]],
            ["L", [E, S + ry]],
            ["Z", []]
          ]);
          break;
        default:
          k.parentNode.removeChild(k)
      }
      C && k.setAttribute("d", C);
      if (f) {
        ra.resetOrientation(k);
        e = false;
        try {
          e = k.getBBox()
        } catch (da) {}
        k.parentNode.removeChild(k);
        return e
      } else {
        if (D) {
          D = svgedit.transformlist.getTransformList(k);
          svgedit.math.hasMatrixTransform(D) && ra.resetOrientation(k)
        }
        e.addSubCommand(new svgedit.history.RemoveElementCommand(b, b.nextSibling, w));
        e.addSubCommand(new svgedit.history.InsertElementCommand(k));
        xa();
        b.parentNode.removeChild(b);
        k.setAttribute("id", p);
        k.removeAttribute("visibility");
        gb([k], true);
        pa(e)
      }
    }
  };
  var xb = function(b, f, e) {
      var q = z.suspendRedraw(1E3);
      va == "pathedit" && ra.moveNode(b, f);
      e = e || r;
      for (var k = e.length, D = ["g", "polyline", "path"], p = ["transform", "opacity", "filter"]; k--;) {
        var w = e[k];
        if (w != null) if ((b === "x" || b === "y") && D.indexOf(w.tagName) >= 0) {
          var C = getStrokedBBox([w]);
          o.moveSelectedElements((b === "x" ? f - C.x : 0) * i, (b === "y" ? f - C.y : 0) * i, true)
        } else {
          w.tagName === "g" && p.indexOf(b);
          C = b === "#text" ? w.textContent : w.getAttribute(b);
          if (C == null) C = "";
          if (C !== String(f)) {
            if (b == "#text") {
              svgedit.utilities.getBBox(w);
              w.textContent = f;
              if (/rotate/.test(w.getAttribute("transform"))) w = Db(w)
            } else b == "#href" ? eb(w, f) : w.setAttribute(b, f);
            va === "textedit" && b !== "#text" && w.textContent.length && Ka.toSelectMode(w);
            if (svgedit.browser.isGecko() && w.nodeName === "text" && /rotate/.test(w.getAttribute("transform"))) if (String(f).indexOf("url") === 0 || ["font-size", "font-family", "x", "y"].indexOf(b) >= 0 && w.textContent) w = Db(w);
            r.indexOf(w) >= 0 && setTimeout(function() {
              w.parentNode && qa.requestSelector(w).resize()
            }, 0);
            C = svgedit.utilities.getRotationAngle(w);
            if (C != 0 && b != "transform") for (var I = svgedit.transformlist.getTransformList(w), K = I.numberOfItems; K--;) if (I.getItem(K).type == 4) {
              I.removeItem(K);
              var E = svgedit.utilities.getBBox(w),
                N = svgedit.math.transformPoint(E.x + E.width / 2, E.y + E.height / 2, svgedit.math.transformListToTransform(I).matrix);
              E = N.x;
              N = N.y;
              var S = z.createSVGTransform();
              S.setRotate(C, E, N);
              I.insertItemBefore(S, K);
              break
            }
          }
        }
      }
      z.unsuspendRedraw(q)
    },
    Ma = this.changeSelectedAttribute = function(b, f, e) {
      e = e || r;
      o.undoMgr.beginUndoableChange(b, e);
      xb(b, f, e);
      b = o.undoMgr.finishUndoableChange();
      b.isEmpty() || pa(b)
    };
  this.deleteSelectedElements = function() {
    var b, f = new svgedit.history.BatchCommand("Delete Elements"),
      e = r.length,
      q = [];
    for (b = 0; b < e; ++b) {
      var k = r[b];
      if (k == null) break;
      var D = k.parentNode,
        p = k;
      qa.releaseSelector(p);
      svgedit.path.removePath_(p.id);
      if (D.tagName === "a" && D.childNodes.length === 1) {
        p = D;
        D = D.parentNode
      }
      var w = p.nextSibling;
      p = D.removeChild(p);
      q.push(k);
      r[b] = null;
      f.addSubCommand(new Ua(p, w, D))
    }
    f.isEmpty() || pa(f);
    W("changed", q);
    xa()
  };
  this.cutSelectedElements = function() {
    var b, f = new svgedit.history.BatchCommand("Cut Elements"),
      e = r.length,
      q = [];
    for (b = 0; b < e; ++b) {
      var k = r[b];
      if (k == null) break;
      var D = k.parentNode,
        p = k;
      qa.releaseSelector(p);
      svgedit.path.removePath_(p.id);
      var w = p.nextSibling;
      p = D.removeChild(p);
      q.push(k);
      r[b] = null;
      f.addSubCommand(new Ua(p, w, D))
    }
    f.isEmpty() || pa(f);
    W("changed", q);
    xa();
    o.clipBoard = q
  };
  this.copySelectedElements = function() {
    o.clipBoard = $.merge([], r)
  };
  this.pasteElements = function(b, f, e) {
    var q = o.clipBoard,
      k = q.length;
    if (k) {
      for (var D = [], p = new svgedit.history.BatchCommand("Paste elements"); k--;) {
        var w = q[k];
        if (w) {
          var C = ob(w);
          if (!svgedit.utilities.getElem(w.id)) C.id = w.id;
          D.push(C);
          (B || A().getCurrentLayer()).appendChild(C);
          p.addSubCommand(new svgedit.history.InsertElementCommand(C))
        }
      }
      $a(D);
      if (b !== "in_place") {
        var I, K;
        if (b) {
          if (b === "point") {
            I = f;
            K = e
          }
        } else {
          I = Cb.x;
          K = Cb.y
        }
        b = getStrokedBBox(D);
        var E = I - (b.x + b.width / 2),
          N = K - (b.y + b.height / 2),
          S = [],
          U = [];
        $.each(D, function() {
          S.push(E);
          U.push(N)
        });
        I = o.moveSelectedElements(S, U, false);
        p.addSubCommand(I)
      }
      pa(p);
      W("changed", D)
    }
  };
  this.groupSelectedElements = function(b, f) {
    b || (b = "g");
    var e = "";
    switch (b) {
      case "a":
        e = "Make hyperlink";
        var q = "";
        if (arguments.length > 1) q = f;
        break;
      default:
        b = "g";
        e = "Group Elements"
    }
    e = new svgedit.history.BatchCommand(e);
    var k = O({
      element: b,
      attr: {
        id: Ha()
      }
    });
    b === "a" && eb(k, q);
    e.addSubCommand(new svgedit.history.InsertElementCommand(k));
    for (q = r.length; q--;) {
      var D = r[q];
      if (D != null) {
        if (D.parentNode.tagName === "a" && D.parentNode.childNodes.length === 1) D = D.parentNode;
        var p = D.nextSibling,
          w = D.parentNode;
        k.appendChild(D);
        e.addSubCommand(new svgedit.history.MoveElementCommand(D, p, w))
      }
    }
    e.isEmpty() || pa(e);
    $a([k], true)
  };
  var Vb = this.pushGroupProperties = function(b, f) {
    var e = b.childNodes,
      q = e.length,
      k = b.getAttribute("transform"),
      D = svgedit.transformlist.getTransformList(b),
      p = svgedit.math.transformListToTransform(D).matrix,
      w = new svgedit.history.BatchCommand("Push group properties"),
      C = 0,
      I = svgedit.utilities.getRotationAngle(b),
      K = $(b).attr(["filter", "opacity"]),
      E, N, S;
    for (C = 0; C < q; C++) {
      var U = e[C];
      if (U.nodeType === 1) {
        if (K.opacity !== null && K.opacity !== 1) {
          U.getAttribute("opacity");
          var X = Math.round((U.getAttribute("opacity") || 1) * K.opacity * 100) / 100;
          Ma("opacity", X, [U])
        }
        if (K.filter) {
          S = X = this.getBlur(U);
          N || (N = this.getBlur(b));
          if (X) X = Number(N) + Number(X);
          else if (X === 0) X = N;
          if (S) E = svgedit.utilities.getRefElem(U.getAttribute("filter"));
          else if (E) {
            E = ob(E);
            svgedit.utilities.findDefs().appendChild(E)
          } else E = svgedit.utilities.getRefElem(K.filter);
          E.id = U.id + "_" + (E.firstChild.tagName === "feGaussianBlur" ? "blur" : "filter");
          Ma("filter", "url(#" + E.id + ")", [U]);
          if (X) {
            Ma("stdDeviation", X, [E.firstChild]);
            o.setBlurOffsets(E, X)
          }
        }
        X = svgedit.transformlist.getTransformList(U);
        if (~U.tagName.indexOf("Gradient")) X = null;
        if (X) if (U.tagName !== "defs") if (D.numberOfItems) {
          if (I && D.numberOfItems == 1) {
            var da = D.getItem(0).matrix,
              R = z.createSVGMatrix();
            if (S = svgedit.utilities.getRotationAngle(U)) R = X.getItem(0).matrix;
            var L = svgedit.utilities.getBBox(U),
              J = svgedit.math.transformListToTransform(X).matrix,
              M = svgedit.math.transformPoint(L.x + L.width / 2, L.y + L.height / 2, J);
            L = I + S;
            J = z.createSVGTransform();
            J.setRotate(L, M.x, M.y);
            da = svgedit.math.matrixMultiply(da, R, J.matrix.inverse());
            S && X.removeItem(0);
            if (L) X.numberOfItems ? X.insertItemBefore(J, 0) : X.appendItem(J);
            if (da.e || da.f) {
              S = z.createSVGTransform();
              S.setTranslate(da.e, da.f);
              X.numberOfItems ? X.insertItemBefore(S, 0) : X.appendItem(S)
            }
          } else {
            da = U.getAttribute("transform");
            S = {};
            S.transform = da || "";
            S = z.createSVGTransform();
            da = svgedit.math.transformListToTransform(X).matrix;
            R = da.inverse();
            da = svgedit.math.matrixMultiply(R, p, da);
            S.setMatrix(da);
            X.appendItem(S)
          }(U = svgedit.recalculate.recalculateDimensions(U)) && w.addSubCommand(U)
        }
      }
    }
    if (k) {
      S = {};
      S.transform = k;
      b.setAttribute("transform", "");
      b.removeAttribute("transform");
      w.addSubCommand(new svgedit.history.ChangeElementCommand(b, S))
    }
    if (f && !w.isEmpty()) return w
  };
  this.ungroupSelectedElement = function() {
    var b = r[0];
    if (b) if ($(b).data("gsvg") || $(b).data("symbol")) Zb(b);
    else if (b.tagName === "use") {
      var f = svgedit.utilities.getElem(Ca(b).substr(1));
      $(b).data("symbol", f).data("ref", f);
      Zb(b)
    } else {
      f = $(b).parents("a");
      if (f.length) b = f[0];
      if (b.tagName === "g" || b.tagName === "a") {
        f = new svgedit.history.BatchCommand("Ungroup Elements");
        var e = Vb(b, true);
        e && f.addSubCommand(e);
        e = b.parentNode;
        for (var q = b.nextSibling, k = Array(b.childNodes.length), D = 0; b.firstChild;) {
          var p = b.firstChild,
            w = p.nextSibling,
            C = p.parentNode;
          if (p.tagName === "title") {
            f.addSubCommand(new svgedit.history.RemoveElementCommand(p, p.nextSibling, C));
            C.removeChild(p)
          } else {
            k[D++] = p = e.insertBefore(p, q);
            f.addSubCommand(new svgedit.history.MoveElementCommand(p, w, C))
          }
        }
        xa();
        q = b.nextSibling;
        b = e.removeChild(b);
        f.addSubCommand(new svgedit.history.RemoveElementCommand(b, q, e));
        f.isEmpty() || pa(f);
        gb(k)
      }
    }
  };
  this.moveToTopSelectedElement = function() {
    var b = r[0];
    if (b != null) {
      b = b;
      var f = b.parentNode,
        e = b.nextSibling;
      b = b.parentNode.appendChild(b);
      if (e != b.nextSibling) {
        pa(new svgedit.history.MoveElementCommand(b, e, f, "top"));
        W("changed", [b])
      }
    }
  };
  this.moveToBottomSelectedElement = function() {
    var b = r[0];
    if (b != null) {
      b = b;
      var f = b.parentNode,
        e = b.nextSibling,
        q = b.parentNode.firstChild;
      if (q.tagName == "title") q = q.nextSibling;
      if (q.tagName == "defs") q = q.nextSibling;
      b = b.parentNode.insertBefore(b, q);
      if (e != b.nextSibling) {
        pa(new svgedit.history.MoveElementCommand(b, e, f, "bottom"));
        W("changed", [b])
      }
    }
  };
  this.moveUpDownSelected = function(b) {
    var f = r[0];
    if (f) {
      hb = [];
      var e, q, k = $(ub(getStrokedBBox([f]))).toArray();
      b == "Down" && k.reverse();
      $.each(k, function() {
        if (q) {
          e = this;
          return false
        } else if (this == f) q = true
      });
      if (e) {
        k = f.parentNode;
        var D = f.nextSibling;
        $(e)[b == "Down" ? "before" : "after"](f);
        if (D != f.nextSibling) {
          pa(new svgedit.history.MoveElementCommand(f, D, k, "Move " + b));
          W("changed", [f])
        }
      }
    }
  };
  this.moveSelectedElements = function(b, f, e) {
    if (b.constructor != Array) {
      b /= i;
      f /= i
    }
    e = e || true;
    for (var q = new svgedit.history.BatchCommand("position"), k = r.length; k--;) {
      var D = r[k];
      if (D != null) {
        var p = z.createSVGTransform(),
          w = svgedit.transformlist.getTransformList(D);
        b.constructor == Array ? p.setTranslate(b[k], f[k]) : p.setTranslate(b, f);
        w.numberOfItems ? w.insertItemBefore(p, 0) : w.appendItem(p);
        (p = svgedit.recalculate.recalculateDimensions(D)) && q.addSubCommand(p);
        qa.requestSelector(D).resize()
      }
    }
    if (!q.isEmpty()) {
      e && pa(q);
      W("changed", r);
      return q
    }
  };
  this.cloneSelectedElements = function(b, f) {
    var e, q, k = new svgedit.history.BatchCommand("Clone Elements"),
      D = r.length;
    r.sort(function(p, w) {
      return $(w).index() - $(p).index()
    });
    for (e = 0; e < D; ++e) {
      q = r[e];
      if (q == null) break
    }
    D = r.slice(0, e);
    this.clearSelection(true);
    for (e = D.length; e--;) {
      q = D[e] = ob(D[e]);
      (B || A().getCurrentLayer()).appendChild(q);
      k.addSubCommand(new svgedit.history.InsertElementCommand(q))
    }
    if (!k.isEmpty()) {
      gb(D.reverse());
      this.moveSelectedElements(b, f, false);
      pa(k)
    }
  };
  this.alignSelectedElements = function(b, f) {
    var e, q, k = [],
      D = Number.MAX_VALUE,
      p = Number.MIN_VALUE,
      w = Number.MAX_VALUE,
      C = Number.MIN_VALUE,
      I = Number.MIN_VALUE,
      K = Number.MIN_VALUE,
      E = r.length;
    if (E) {
      for (e = 0; e < E; ++e) {
        if (r[e] == null) break;
        q = r[e];
        k[e] = getStrokedBBox([q]);
        switch (f) {
          case "smallest":
            if ((b == "l" || b == "c" || b == "r") && (I == Number.MIN_VALUE || I > k[e].width) || (b == "t" || b == "m" || b == "b") && (K == Number.MIN_VALUE || K > k[e].height)) {
              D = k[e].x;
              w = k[e].y;
              p = k[e].x + k[e].width;
              C = k[e].y + k[e].height;
              I = k[e].width;
              K = k[e].height
            }
            break;
          case "largest":
            if ((b == "l" || b == "c" || b == "r") && (I == Number.MIN_VALUE || I < k[e].width) || (b == "t" || b == "m" || b == "b") && (K == Number.MIN_VALUE || K < k[e].height)) {
              D = k[e].x;
              w = k[e].y;
              p = k[e].x + k[e].width;
              C = k[e].y + k[e].height;
              I = k[e].width;
              K = k[e].height
            }
            break;
          default:
            if (k[e].x < D) D = k[e].x;
            if (k[e].y < w) w = k[e].y;
            if (k[e].x + k[e].width > p) p = k[e].x + k[e].width;
            if (k[e].y + k[e].height > C) C = k[e].y + k[e].height
        }
      }
      if (f == "page") {
        w = D = 0;
        p = o.contentW;
        C = o.contentH
      }
      q = Array(E);
      I = Array(E);
      for (e = 0; e < E; ++e) {
        if (r[e] == null) break;
        K = k[e];
        q[e] = 0;
        I[e] = 0;
        switch (b) {
          case "l":
            q[e] = D - K.x;
            break;
          case "c":
            q[e] = (D + p) / 2 - (K.x + K.width / 2);
            break;
          case "r":
            q[e] = p - (K.x + K.width);
            break;
          case "t":
            I[e] = w - K.y;
            break;
          case "m":
            I[e] = (w + C) / 2 - (K.y + K.height / 2);
            break;
          case "b":
            I[e] = C - (K.y + K.height)
        }
      }
      this.moveSelectedElements(q, I)
    }
  };
  this.contentW = sb().w;
  this.contentH = sb().h;
  this.updateCanvas = function(b, f) {
    z.setAttribute("width", b);
    z.setAttribute("height", f);
    var e = $("#canvasBackground")[0],
      q = s.getAttribute("x"),
      k = s.getAttribute("y"),
      D = b / 2 - this.contentW * i / 2,
      p = f / 2 - this.contentH * i / 2;
    svgedit.utilities.assignAttributes(s, {
      width: this.contentW * i,
      height: this.contentH * i,
      x: D,
      y: p,
      viewBox: "0 0 " + this.contentW + " " + this.contentH
    });
    svgedit.utilities.assignAttributes(e, {
      width: s.getAttribute("width"),
      height: s.getAttribute("height"),
      x: D,
      y: p
    });
    (e = svgedit.utilities.getElem("background_image")) && svgedit.utilities.assignAttributes(e, {
      width: "100%",
      height: "100%"
    });
    qa.selectorParentGroup.setAttribute("transform", "translate(" + D + "," + p + ")");
    tb("canvasUpdated", {
      new_x: D,
      new_y: p,
      old_x: q,
      old_y: k,
      d_x: D - q,
      d_y: p - k
    });
    return {
      x: D,
      y: p,
      old_x: q,
      old_y: k,
      d_x: D - q,
      d_y: p - k
    }
  };
  this.setBackground = function(b, f) {
    var e = svgedit.utilities.getElem("canvasBackground"),
      q = $(e).find("rect")[0],
      k = svgedit.utilities.getElem("background_image");
    q.setAttribute("fill", b);
    if (f) {
      if (!k) {
        k = m.createElementNS(d.SVG, "image");
        svgedit.utilities.assignAttributes(k, {
          id: "background_image",
          width: "100%",
          height: "100%",
          preserveAspectRatio: "xMinYMin",
          style: "pointer-events:none"
        })
      }
      eb(k, f);
      e.appendChild(k)
    } else k && k.parentNode.removeChild(k)
  };
  this.cycleElement = function(b) {
    var f = r[0],
      e = false,
      q = Ta(B || A().getCurrentLayer());
    if (q.length) {
      if (f == null) {
        b = b ? q.length - 1 : 0;
        e = q[b]
      } else for (var k = q.length; k--;) if (q[k] == f) {
        b = b ? k - 1 : k + 1;
        if (b >= q.length) b = 0;
        else if (b < 0) b = q.length - 1;
        e = q[b];
        break
      }
      $a([e], true);
      W("selected", r)
    }
  };
  this.clear();
  this.getPrivateMethods = function() {
    return {
      addCommandToHistory: pa,
      setGradient: ac,
      addSvgElementFromJson: O,
      assignAttributes: db,
      BatchCommand: Xb,
      call: W,
      ChangeElementCommand: ib,
      copyElem: ob,
      ffClone: Db,
      findDefs: ia,
      findDuplicateGradient: $b,
      getElem: mb,
      getId: Za,
      getIntersectionList: ub,
      getMouseTarget: Eb,
      getNextId: Ha,
      getPathBBox: Hb,
      getUrlFromAttr: Pa,
      hasMatrixTransform: ea,
      identifyLayers: wb,
      InsertElementCommand: cb,
      isIdentity: svgedit.math.isIdentity,
      logMatrix: Yb,
      matrixMultiply: ka,
      MoveElementCommand: yb,
      preventClickDefault: vb,
      recalculateAllSelectedDimensions: Mb,
      recalculateDimensions: Ib,
      remapElement: Sb,
      RemoveElementCommand: Ua,
      removeUnusedDefElems: Pb,
      round: Ya,
      runExtensions: tb,
      sanitizeSvg: Jb,
      SVGEditTransformList: svgedit.transformlist.SVGTransformList,
      toString: toString,
      transformBox: svgedit.math.transformBox,
      transformListToTransform: ba,
      transformPoint: Z,
      walkTree: svgedit.utilities.walkTree
    }
  }
};
(function() {
  if (!window.svgEditor) {
    window.svgEditor = function(a) {
      function t(v, r) {
        var O = c.setSvgString(v) !== false;
        r = r || a.noop;
        O ? r(true) : a.alert(u.notification.errorLoadingSVG, function() {
          r(false)
        })
      }
      var j = {};
      j.tool_scale = 1;
      j.exportWindowCt = 0;
      j.langChanged = false;
      j.showSaveWarning = false;
      j.storagePromptClosed = false;
      var c, d, l = svgedit.utilities,
        h = false,
        o = false,
        m = false,
        z = [],
        s = {
          lang: "",
          iconsize: "",
          bkgd_color: "#FFF",
          bkgd_url: "",
          img_save: "embed",
          save_notice_done: false,
          export_notice_done: false
        },
        F = {},
        A = {
          extensions: [],
          allowedOrigins: []
        },
        i = ["ext-overview_window.js", "ext-markers.js", "ext-connector.js", "ext-eyedropper.js", "ext-shapes.js", "ext-imagelib.js", "ext-grid.js", "ext-polygon.js", "ext-star.js", "ext-panning.js", "ext-storage.js"],
        B = {
          canvasName: "default",
          canvas_expansion: 3,
          initFill: {
            color: "FF0000",
            opacity: 1
          },
          initStroke: {
            width: 5,
            color: "000000",
            opacity: 1
          },
          initOpacity: 1,
          colorPickerCSS: null,
          initTool: "select",
          exportWindowType: "new",
          wireframe: false,
          showlayers: false,
          no_save_warning: false,
          imgPath: "images/",
          langPath: "locale/",
          extPath: "extensions/",
          jGraduatePath: "jgraduate/images/",
          dimensions: [640, 480],
          gridSnapping: false,
          gridColor: "#000",
          baseUnit: "px",
          snappingStep: 10,
          showRulers: true,
          preventAllURLConfig: false,
          preventURLContentLoading: false,
          lockExtensions: false,
          noDefaultExtensions: false,
          showGrid: false,
          noStorageOnLoad: false,
          forceStorage: false,
          emptyStorageOnDecline: false
        },
        u = j.uiStrings = {
          common: {
            ok: "OK",
            cancel: "Cancel",
            key_up: "Up",
            key_down: "Down",
            key_backspace: "Backspace",
            key_del: "Del"
          },
          layers: {
            layer: "Layer"
          },
          notification: {
            invalidAttrValGiven: "Invalid value given",
            noContentToFitTo: "No content to fit to",
            dupeLayerName: "There is already a layer named that!",
            enterUniqueLayerName: "Please enter a unique layer name",
            enterNewLayerName: "Please enter the new layer name",
            layerHasThatName: "Layer already has that name",
            QmoveElemsToLayer: "Move selected elements to layer '%s'?",
            QwantToClear: "Do you want to clear the drawing?\nThis will also erase your undo history!",
            QwantToOpen: "Do you want to open a new file?\nThis will also erase your undo history!",
            QerrorsRevertToSource: "There were parsing errors in your SVG source.\nRevert back to original SVG source?",
            QignoreSourceChanges: "Ignore changes made to SVG source?",
            featNotSupported: "Feature not supported",
            enterNewImgURL: "Enter the new image URL",
            defsFailOnSave: "NOTE: Due to a bug in your browser, this image may appear wrong (missing gradients or elements). It will however appear correct once actually saved.",
            loadingImage: "Loading image, please wait...",
            saveFromBrowser: "Select 'Save As...' in your browser to save this image as a %s file.",
            noteTheseIssues: "Also note the following issues: ",
            unsavedChanges: "There are unsaved changes.",
            enterNewLinkURL: "Enter the new hyperlink URL",
            errorLoadingSVG: "Error: Unable to load SVG data",
            URLloadFail: "Unable to load from URL",
            retrieving: "Retrieving '%s' ..."
          }
        };
      a.pref = function(v, r) {
        if (r) {
          F[v] = r;
          j.curPrefs = F
        } else return v in F ? F[v] : s[v]
      };
      j.loadContentAndPrefs = function() {
        if (!(!A.forceStorage && (A.noStorageOnLoad || !document.cookie.match(/(?:^|;\s*)store=(?:prefsAndContent|prefsOnly)/)))) {
          if (j.storage && (A.forceStorage || !A.noStorageOnLoad && document.cookie.match(/(?:^|;\s*)store=prefsAndContent/))) {
            var v = j.storage.getItem("svgedit-" + A.canvasName);
            v && j.loadFromString(v)
          }
          for (var r in s) if (s.hasOwnProperty(r)) {
            v = "svg-edit-" + r;
            if (j.storage) {
              if (v = j.storage.getItem(v)) s[r] = String(v)
            } else if (window.widget) s[r] = widget.preferenceForKey(v);
            else {
              v = document.cookie.match(RegExp("(?:^|;\\s*)" + l.preg_quote(encodeURIComponent(v)) + "=([^;]+)"));
              s[r] = v ? decodeURIComponent(v[1]) : ""
            }
          }
        }
      };
      j.setConfig = function(v, r) {
        function O(Z, ka, ea) {
          if (Z[ka] && typeof Z[ka] === "object") a.extend(true, Z[ka], ea);
          else Z[ka] = ea
        }
        r = r || {};
        a.each(v, function(Z, ka) {
          if (v.hasOwnProperty(Z)) if (s.hasOwnProperty(Z)) {
            if (!(r.overwrite === false && (A.preventAllURLConfig || F.hasOwnProperty(Z)))) if (r.allowInitialUserOverride === true) s[Z] = ka;
            else a.pref(Z, ka)
          } else if (["extensions", "allowedOrigins"].indexOf(Z) > -1) r.overwrite === false && (A.preventAllURLConfig || Z === "allowedOrigins" || Z === "extensions" && A.lockExtensions) || (A[Z] = A[Z].concat(ka));
          else if (B.hasOwnProperty(Z)) if (!(r.overwrite === false && (A.preventAllURLConfig || A.hasOwnProperty(Z)))) if (A.hasOwnProperty(Z)) r.overwrite !== false && O(A, Z, ka);
          else if (r.allowInitialUserOverride === true) O(B, Z, ka);
          else if (B[Z] && typeof B[Z] === "object") {
            A[Z] = {};
            a.extend(true, A[Z], ka)
          } else A[Z] = ka
        });
        j.curConfig = A
      };
      j.setCustomHandlers = function(v) {
        j.ready(function() {
          if (v.open) {
            a('#tool_open > input[type="file"]').remove();
            a("#tool_open").show();
            c.open = v.open
          }
          if (v.save) {
            j.showSaveWarning = false;
            c.bind("saved", v.save)
          }
          if (v.exportImage) {
            o = v.exportImage;
            c.bind("exported", o)
          }
          if (v.exportPDF) {
            m = v.exportPDF;
            c.bind("exportedPDF", m)
          }
        })
      };
      j.randomizeIds = function() {
        c.randomizeIds(arguments)
      };
      j.init = function() {
        function v() {
          A = a.extend(true, {}, B, A);
          if (!A.noDefaultExtensions) A.extensions = A.extensions.concat(i);
          a.each(["extensions", "allowedOrigins"], function(g, n) {
            A[n] = a.grep(A[n], function(G, H) {
              return H === A[n].indexOf(G)
            })
          });
          j.curConfig = A
        }
        function r(g, n) {
          var G = g.id,
            H = G.split("_"),
            P = H[0];
          H = H[1];
          n && c.setStrokeAttr("stroke-" + P, H);
          hb();
          db("#cur_" + P, G, 20);
          a(g).addClass("current").siblings().removeClass("current")
        }
        function O(g, n) {
          a.pref("bkgd_color", g);
          a.pref("bkgd_url", n);
          c.setBackground(g, n)
        }
        function Z() {
          var g = c.getHref(na);
          g = g.indexOf("data:") === 0 ? "" : g;
          a.prompt(u.notification.enterNewImgURL, g, function(n) {
            n && Bb(n)
          })
        }
        function ka(g, n) {
          n || (n = c.getZoom());
          g || (g = a("#svgcanvas"));
          var G, H, P = c.getContentElem(),
            T = svgedit.units.getTypeMap()[A.baseUnit];
          for (G = 0; G < 2; G++) {
            var Y = G === 0,
              fa = Y ? "x" : "y",
              ja = Y ? "width" : "height",
              la = Number(P.getAttribute(fa));
            fa = a("#ruler_" + fa + " canvas:first");
            var ha = fa.clone();
            fa.replaceWith(ha);
            var ma = ha[0];
            var sa = fa = g[ja]();
            ma.parentNode.style[ja] = sa + "px";
            var Ga = 0,
              V = ma.getContext("2d"),
              Ea, wa, Ia;
            V.fillStyle = "rgb(200,0,0)";
            V.fillRect(0, 0, ma.width, ma.height);
            ha.siblings().remove();
            if (fa >= 3E4) {
              Ia = parseInt(fa / 3E4, 10) + 1;
              Ea = [];
              Ea[0] = V;
              var Ra;
              for (H = 1; H < Ia; H++) {
                ma[ja] = 3E4;
                Ra = ma.cloneNode(true);
                ma.parentNode.appendChild(Ra);
                Ea[H] = Ra.getContext("2d")
              }
              Ra[ja] = fa % 3E4;
              fa = 3E4
            }
            ma[ja] = fa;
            ja = T * n;
            ma = 50 / ja;
            ha = 1;
            for (H = 0; H < lb.length; H++) {
              ha = wa = lb[H];
              if (ma <= wa) break
            }
            ma = ha * ja;
            V.font = "9px sans-serif";
            for (var Fa = la / ja % ha * ja, Sa = Fa - ma; Fa < sa;) {
              Sa += ma;
              H = Math.round(Fa) + 0.5;
              if (Y) {
                V.moveTo(H, 15);
                V.lineTo(H, 0)
              } else {
                V.moveTo(15, H);
                V.lineTo(0, H)
              }
              wa = (Sa - la) / ja;
              if (ha >= 1) H = Math.round(wa);
              else {
                H = String(ha).split(".")[1].length;
                H = wa.toFixed(H)
              }
              if (H !== 0 && H !== 1E3 && H % 1E3 === 0) H = H / 1E3 + "K";
              if (Y) V.fillText(H, Fa + 2, 8);
              else {
                wa = String(H).split("");
                for (H = 0; H < wa.length; H++) V.fillText(wa[H], 1, Fa + 9 + H * 9)
              }
              wa = ma / 10;
              for (H = 1; H < 10; H++) {
                var Oa = Math.round(Fa + wa * H) + 0.5;
                if (Ea && Oa > fa) {
                  Ga++;
                  V.stroke();
                  if (Ga >= Ia) {
                    H = 10;
                    Fa = sa;
                    continue
                  }
                  V = Ea[Ga];
                  Fa -= 3E4;
                  Oa = Math.round(Fa + wa * H) + 0.5
                }
                var Ja = H % 2 ? 12 : 10;
                if (Y) {
                  V.moveTo(Oa, 15);
                  V.lineTo(Oa, Ja)
                } else {
                  V.moveTo(15, Oa);
                  V.lineTo(Ja, Oa)
                }
              }
              Fa += ma
            }
            V.strokeStyle = "#000";
            V.stroke()
          }
        }
        function ea() {
          if (c.deleteCurrentLayer()) {
            Ta();
            ya();
            a("#layerlist tr.layer").removeClass("layersel");
            a("#layerlist tr.layer:first").addClass("layersel")
          }
        }
        function ba() {
          var g = c.getCurrentDrawing().getCurrentLayerName() + " copy";
          a.prompt(u.notification.enterUniqueLayerName, g, function(n) {
            if (n) if (c.getCurrentDrawing().hasLayer(n)) a.alert(u.notification.dupeLayerName);
            else {
              c.cloneLayer(n);
              Ta();
              ya()
            }
          })
        }
        function ia(g) {
          var n = a("#layerlist tr.layersel").index(),
            G = c.getCurrentDrawing().getNumLayers();
          if (n > 0 || n < G - 1) {
            n += g;
            c.setCurrentLayerPosition(G - n - 1);
            ya()
          }
        }
        function Pa(g) {
          g.stopPropagation();
          g.preventDefault()
        }
        function Ca(g) {
          g.stopPropagation();
          g.preventDefault()
        }
        function eb(g) {
          g.stopPropagation();
          g.preventDefault()
        }
        try {
          if ("localStorage" in window) j.storage = localStorage
        } catch (Hb) {}
        var mb = [];
        a("#lang_select option").each(function() {
          mb.push(this.value)
        });
        (function() {
          var g, n;
          d = a.deparam.querystring(true);
          if (a.isEmptyObject(d)) {
            v();
            j.loadContentAndPrefs()
          } else {
            if (d.dimensions) d.dimensions = d.dimensions.split(",");
            if (d.bkgd_color) d.bkgd_color = "#" + d.bkgd_color;
            if (d.extensions) d.extensions = d.extensions.match(/[:\/\\]/) ? "" : d.extensions.split(",");
            a.each(["extPath", "imgPath", "langPath", "jGraduatePath"], function(G) {
              d[G] && delete d[G]
            });
            j.setConfig(d, {
              overwrite: false
            });
            v();
            if (!A.preventURLContentLoading) {
              g = d.source;
              n = a.param.querystring();
              if (!g) if (n.indexOf("source=data:") >= 0) g = n.match(/source=(data:[^&]*)/)[1];
              if (g) {
                g.indexOf("data:") === 0 ? j.loadFromDataURI(g) : j.loadFromString(g);
                return
              }
              if (d.url) {
                j.loadFromURL(d.url);
                return
              }
            }
            if (!d.noStorageOnLoad || A.forceStorage) j.loadContentAndPrefs()
          }
          F = a.extend(true, {}, s, F);
          j.curPrefs = F
        })();
        (function() {
          var g, n = window.opener;
          if (n) try {
            g = n.document.createEvent("Event");
            g.initEvent("svgEditorReady", true, true);
            n.document.documentElement.dispatchEvent(g)
          } catch (G) {}
        })();
        var db = j.setIcon = function(g, n) {
            var G = typeof n === "string" ? a.getSvgIcon(n, true) : n.clone();
            G ? a(g).empty().append(G) : console.log("NOTE: Icon image missing: " + n)
          },
          ua = function() {
            a.each(A.extensions, function() {
              var g = this;
              g.match(/^ext-.*\.js/) && a.getScript(A.extPath + g, function(n) {
                if (!n) {
                  n = document.createElement("script");
                  n.src = A.extPath + g;
                  document.querySelector("head").appendChild(n)
                }
              })
            });
            j.putLocale(null, mb)
          };
        document.location.protocol === "file:" ? setTimeout(ua, 100) : ua();
        a.svgIcons(A.imgPath + "svg_edit_icons.svg", {
          w: 24,
          h: 24,
          id_match: false,
          no_img: !svgedit.browser.isWebkit(),
          fallback_path: A.imgPath,
          fallback: {
            new_image: "clear.png",
            save: "save.png",
            open: "open.png",
            source: "source.png",
            docprops: "document-properties.png",
            wireframe: "wireframe.png",
            undo: "undo.png",
            redo: "redo.png",
            select: "select.png",
            select_node: "select_node.png",
            pencil: "fhpath.png",
            pen: "line.png",
            square: "square.png",
            rect: "rect.png",
            fh_rect: "freehand-square.png",
            circle: "circle.png",
            ellipse: "ellipse.png",
            fh_ellipse: "freehand-circle.png",
            path: "path.png",
            text: "text.png",
            image: "image.png",
            zoom: "zoom.png",
            clone: "clone.png",
            node_clone: "node_clone.png",
            "delete": "delete.png",
            node_delete: "node_delete.png",
            group: "shape_group_elements.png",
            ungroup: "shape_ungroup.png",
            move_top: "move_top.png",
            move_bottom: "move_bottom.png",
            to_path: "to_path.png",
            link_controls: "link_controls.png",
            reorient: "reorient.png",
            align_left: "align-left.png",
            align_center: "align-center.png",
            align_right: "align-right.png",
            align_top: "align-top.png",
            align_middle: "align-middle.png",
            align_bottom: "align-bottom.png",
            go_up: "go-up.png",
            go_down: "go-down.png",
            ok: "save.png",
            cancel: "cancel.png",
            arrow_right: "flyouth.png",
            arrow_down: "dropdown.gif"
          },
          placement: {
            "#logo": "logo",
            "#tool_clear div,#layer_new": "new_image",
            "#tool_save div": "save",
            "#tool_export div": "export",
            "#tool_open div div": "open",
            "#tool_import div div": "import",
            "#tool_source": "source",
            "#tool_docprops > div": "docprops",
            "#tool_wireframe": "wireframe",
            "#tool_undo": "undo",
            "#tool_redo": "redo",
            "#tool_select": "select",
            "#tool_fhpath": "pencil",
            "#tool_line": "pen",
            "#tool_rect,#tools_rect_show": "rect",
            "#tool_square": "square",
            "#tool_fhrect": "fh_rect",
            "#tool_ellipse,#tools_ellipse_show": "ellipse",
            "#tool_circle": "circle",
            "#tool_fhellipse": "fh_ellipse",
            "#tool_path": "path",
            "#tool_text,#layer_rename": "text",
            "#tool_image": "image",
            "#tool_zoom": "zoom",
            "#tool_clone,#tool_clone_multi": "clone",
            "#tool_node_clone": "node_clone",
            "#layer_delete,#tool_delete,#tool_delete_multi": "delete",
            "#tool_node_delete": "node_delete",
            "#tool_add_subpath": "add_subpath",
            "#tool_openclose_path": "open_path",
            "#tool_move_top": "move_top",
            "#tool_move_bottom": "move_bottom",
            "#tool_topath": "to_path",
            "#tool_node_link": "link_controls",
            "#tool_reorient": "reorient",
            "#tool_group_elements": "group_elements",
            "#tool_ungroup": "ungroup",
            "#tool_unlink_use": "unlink_use",
            "#tool_alignleft, #tool_posleft": "align_left",
            "#tool_aligncenter, #tool_poscenter": "align_center",
            "#tool_alignright, #tool_posright": "align_right",
            "#tool_aligntop, #tool_postop": "align_top",
            "#tool_alignmiddle, #tool_posmiddle": "align_middle",
            "#tool_alignbottom, #tool_posbottom": "align_bottom",
            "#cur_position": "align",
            "#linecap_butt,#cur_linecap": "linecap_butt",
            "#linecap_round": "linecap_round",
            "#linecap_square": "linecap_square",
            "#linejoin_miter,#cur_linejoin": "linejoin_miter",
            "#linejoin_round": "linejoin_round",
            "#linejoin_bevel": "linejoin_bevel",
            "#url_notice": "warning",
            "#layer_up": "go_up",
            "#layer_down": "go_down",
            "#layer_moreopts": "context_menu",
            "#layerlist td.layervis": "eye",
            "#tool_source_save,#tool_docprops_save,#tool_prefs_save": "ok",
            "#tool_source_cancel,#tool_docprops_cancel,#tool_prefs_cancel": "cancel",
            "#rwidthLabel, #iwidthLabel": "width",
            "#rheightLabel, #iheightLabel": "height",
            "#cornerRadiusLabel span": "c_radius",
            "#angleLabel": "angle",
            "#linkLabel,#tool_make_link,#tool_make_link_multi": "globe_link",
            "#zoomLabel": "zoom",
            "#tool_fill label": "fill",
            "#tool_stroke .icon_label": "stroke",
            "#group_opacityLabel": "opacity",
            "#blurLabel": "blur",
            "#font_sizeLabel": "fontsize",
            ".flyout_arrow_horiz": "arrow_right",
            ".dropdown button, #main_button .dropdown": "arrow_down",
            "#palette .palette_item:first, #fill_bg, #stroke_bg": "no_color"
          },
          resize: {
            "#logo .svg_icon": 28,
            ".flyout_arrow_horiz .svg_icon": 5,
            ".layer_button .svg_icon, #layerlist td.layervis .svg_icon": 14,
            ".dropdown button .svg_icon": 7,
            "#main_button .dropdown .svg_icon": 9,
            ".palette_item:first .svg_icon": 15,
            "#fill_bg .svg_icon, #stroke_bg .svg_icon": 16,
            ".toolbar_button button .svg_icon": 16,
            ".stroke_tool div div .svg_icon": 20,
            "#tools_bottom label .svg_icon": 18
          },
          callback: function() {
            a(".toolbar_button button > svg, .toolbar_button button > img").each(function() {
              a(this).parent().prepend(this)
            });
            var g, n = a("#tools_left");
            if (n.length !== 0) g = n.offset().top + n.outerHeight();
            n = a.pref("iconsize");
            j.setIconSize(n || (a(window).height() < g ? "s" : "m"));
            a(".tools_flyout").each(function() {
              var G = a("#" + this.id + "_show"),
                H = G.attr("data-curopt");
              if (!G.children("svg, img").length) {
                H = a(H).children().clone();
                if (H.length) {
                  H[0].removeAttribute("style");
                  G.append(H)
                }
              }
            });
            j.runCallbacks();
            setTimeout(function() {
              a(".flyout_arrow_horiz:empty").each(function() {
                a(this).append(a.getSvgIcon("arrow_right").width(5).height(5))
              })
            }, 1)
          }
        });
        j.canvas = c = new a.SvgCanvas(document.getElementById("svgcanvas"), A);
        var Sb, Ib, bb, Jb, yb, cb = svgedit.browser.isMac() ? "meta+" : "ctrl+",
          Ua = c.pathActions,
          ib = c.undoMgr,
          Xb = A.imgPath + "logo.png",
          W = a("#workarea"),
          pa = a("#cmenu_canvas"),
          qa = null,
          qb = "crosshair",
          Tb = "crosshair",
          rb = "toolbars",
          Ab = "",
          Na = {
            fill: null,
            stroke: null
          };
        (function() {
          a("#dialog_container").draggable({
            cancel: "#dialog_content, #dialog_buttons *",
            containment: "window"
          });
          var g = a("#dialog_box"),
            n = a("#dialog_buttons"),
            G = a("#dialog_content"),
            H = function(P, T, Y, fa, ja, la, ha) {
              var ma, sa, Ga;
              G.html("<p>" + T.replace(/\n/g, "</p><p>") + "</p>").toggleClass("prompt", P == "prompt");
              n.empty();
              ma = a('<input type="button" value="' + u.common.ok + '">').appendTo(n);
              P !== "alert" && a('<input type="button" value="' + u.common.cancel + '">').appendTo(n).click(function() {
                g.hide();
                Y && Y(false)
              });
              if (P === "prompt") {
                sa = a('<input type="text">').prependTo(n);
                sa.val(fa || "");
                sa.bind("keydown", "return", function() {
                  ma.click()
                })
              } else if (P === "select") {
                T = a('<div style="text-align:center;">');
                sa = a("<select>").appendTo(T);
                if (ha) {
                  var V = a("<label>").text(ha.label);
                  Ga = a('<input type="checkbox">').appendTo(V);
                  Ga.val(ha.value);
                  ha.tooltip && V.attr("title", ha.tooltip);
                  Ga.prop("checked", !! ha.checked);
                  T.append(a("<div>").append(V))
                }
                a.each(ja || [], function(Ea, wa) {
                  typeof wa === "object" ? sa.append(a("<option>").val(wa.value).html(wa.text)) : sa.append(a("<option>").html(wa))
                });
                G.append(T);
                fa && sa.val(fa);
                la && sa.bind("change", "return", la);
                sa.bind("keydown", "return", function() {
                  ma.click()
                })
              } else P === "process" && ma.hide();
              g.show();
              ma.click(function() {
                g.hide();
                var Ea = P === "prompt" || P === "select" ? sa.val() : true;
                if (Y) Ga ? Y(Ea, Ga.prop("checked")) : Y(Ea)
              }).focus();
              if (P === "prompt" || P === "select") sa.focus()
            };
          a.alert = function(P, T) {
            H("alert", P, T)
          };
          a.confirm = function(P, T) {
            H("confirm", P, T)
          };
          a.process_cancel = function(P, T) {
            H("process", P, T)
          };
          a.prompt = function(P, T, Y) {
            H("prompt", P, Y, T)
          };
          a.select = function(P, T, Y, fa, ja, la) {
            H("select", P, Y, ja, T, fa, la)
          }
        })();
        var jb = function() {
            var g = a(".tool_button_current");
            if (g.length && g[0].id !== "tool_select") {
              g.removeClass("tool_button_current").addClass("tool_button");
              a("#tool_select").addClass("tool_button_current").removeClass("tool_button");
              a("#styleoverrides").text("#svgcanvas svg *{cursor:move;pointer-events:all} #svgcanvas svg{cursor:default}")
            }
            c.setMode("select");
            W.css("cursor", "auto")
          },
          na = null,
          Qa = false,
          Xa = false,
          Ba = false,
          nb = false,
          va = "",
          kb = a("title:first").text(),
          lb = [];
        for (ua = 0.1; ua < 1E5; ua *= 10) {
          lb.push(ua);
          lb.push(2 * ua);
          lb.push(5 * ua)
        }
        var Va = function(g) {
            var n, G = [],
              H = c.getCurrentDrawing().getNumLayers();
            for (n = 0; n < H; n++) G[n] = c.getCurrentDrawing().getLayerName(n);
            if (g) for (n = 0; n < H; ++n) G[n] != g && c.getCurrentDrawing().setLayerOpacity(G[n], 0.5);
            else for (n = 0; n < H; ++n) c.getCurrentDrawing().setLayerOpacity(G[n], 1)
          },
          ya = function() {
            c.clearSelection();
            for (var g = a("#layerlist tbody").empty(), n = a("#selLayerNames").empty(), G = c.getCurrentDrawing(), H = G.getCurrentLayerName(), P = c.getCurrentDrawing().getNumLayers(), T = a.getSvgIcon("eye"); P--;) {
              var Y = G.getLayerName(P),
                fa = a('<tr class="layer">').toggleClass("layersel", Y === H),
                ja = a('<td class="layervis">').toggleClass("layerinvis", !G.getLayerVisibility(Y)),
                la = a('<td class="layername">' + Y + "</td>");
              g.append(fa.append(ja, la));
              n.append('<option value="' + Y + '">' + Y + "</option>")
            }
            if (T !== undefined) {
              n = T.clone();
              a("td.layervis", g).append(n);
              a.resizeSvgIcons({
                "td.layervis .svg_icon": 14
              })
            }
            a("#layerlist td.layername").mouseup(function(ha) {
              a("#layerlist tr.layer").removeClass("layersel");
              a(this.parentNode).addClass("layersel");
              c.setCurrentLayer(this.textContent);
              ha.preventDefault()
            }).mouseover(function() {
              Va(this.textContent)
            }).mouseout(function() {
              Va()
            });
            a("#layerlist td.layervis").click(function() {
              var ha = a(this.parentNode).prevAll().length;
              ha = a("#layerlist tr.layer:eq(" + ha + ") td.layername").text();
              var ma = a(this).hasClass("layerinvis");
              c.setLayerVisibility(ha, ma);
              a(this).toggleClass("layerinvis")
            });
            for (n = 5 - a("#layerlist tr.layer").size(); n-- > 0;) g.append('<tr><td style="color:white">_</td><td/></tr>')
          },
          Kb = function(g, n) {
            if (!Xa) {
              Xa = true;
              Ab = c.getSvgString();
              a("#save_output_btns").toggle( !! n);
              a("#tool_source_back").toggle(!n);
              a("#svg_source_textarea").val(Ab);
              a("#svg_source_editor").fadeIn();
              a("#svg_source_textarea").focus()
            }
          },
          Da = function(g, n) {
            a("#path_node_panel").toggle(g);
            a("#tools_bottom_2,#tools_bottom_3").toggle(!g);
            if (g) {
              a(".tool_button_current").removeClass("tool_button_current").addClass("tool_button");
              a("#tool_select").addClass("tool_button_current").removeClass("tool_button");
              db("#tool_select", "select_node");
              Qa = false;
              if (n.length) na = n[0]
            } else setTimeout(function() {
              db("#tool_select", "select")
            }, 1E3)
          },
          hb = function() {
            window.opera && a("<p/>").hide().appendTo("body").remove()
          },
          La = j.toolButtonClick = function(g, n) {
            if (a(g).hasClass("disabled")) return false;
            if (a(g).parent().hasClass("tools_flyout")) return true;
            n || a(".tools_flyout").fadeOut("normal");
            a("#styleoverrides").text("");
            W.css("cursor", "auto");
            a(".tool_button_current").removeClass("tool_button_current").addClass("tool_button");
            a(g).addClass("tool_button_current").removeClass("tool_button");
            return true
          },
          Cb = j.clickSelect = function() {
            if (La("#tool_select")) {
              c.setMode("select");
              a("#styleoverrides").text("#svgcanvas svg *{cursor:move;pointer-events:all}, #svgcanvas svg{cursor:default}")
            }
          },
          Bb = j.setImageURL = function(g) {
            g || (g = Xb);
            c.setImageURL(g);
            a("#image_url").val(g);
            if (g.indexOf("data:") === 0) {
              a("#image_url").hide();
              a("#change_image_url").show()
            } else {
              c.embedImage(g, function(n) {
                a("#url_notice").toggle(!n);
                Xb = g
              });
              a("#image_url").show();
              a("#change_image_url").hide()
            }
          },
          tb = function(g) {
            var n = Math.min(Math.max(12 + g.value.length * 6, 50), 300);
            a(g).width(n)
          },
          Ya = j.updateCanvas = function(g, n) {
            var G = W.width(),
              H = W.height(),
              P = G,
              T = H,
              Y = c.getZoom(),
              fa = a("#svgcanvas"),
              ja = {
                x: W[0].scrollLeft + P / 2,
                y: W[0].scrollTop + T / 2
              },
              la = A.canvas_expansion;
            G = Math.max(P, c.contentW * Y * la);
            H = Math.max(T, c.contentH * Y * la);
            G == P && H == T ? W.css("overflow", "hidden") : W.css("overflow", "scroll");
            la = fa.height() / 2;
            var ha = fa.width() / 2;
            fa.width(G).height(H);
            var ma = H / 2,
              sa = G / 2,
              Ga = c.updateCanvas(G, H),
              V = sa / ha;
            G = G / 2 - P / 2;
            H = H / 2 - T / 2;
            if (n) {
              n.x += Ga.x;
              n.y += Ga.y
            } else n = {
              x: sa + (ja.x - ha) * V,
              y: ma + (ja.y - la) * V
            };
            if (g) if (c.contentW > W.width()) {
              W[0].scrollLeft = Ga.x - 10;
              W[0].scrollTop = Ga.y - 10
            } else {
              W[0].scrollLeft = G;
              W[0].scrollTop = H
            } else {
              W[0].scrollLeft = n.x - P / 2;
              W[0].scrollTop = n.y - T / 2
            }
            if (A.showRulers) {
              ka(fa, Y);
              W.scroll()
            }
            d.storagePrompt !== true && !j.storagePromptClosed && a("#dialog_box").hide()
          },
          ub = function() {
            var g, n, G = c.getColor("fill") == "none",
              H = c.getColor("stroke") == "none",
              P = ["#tool_fhpath", "#tool_line"],
              T = ["#tools_rect .tool_button", "#tools_ellipse .tool_button", "#tool_text", "#tool_path"];
            if (H) for (g in P) {
              n = P[g];
              a(n).hasClass("tool_button_current") && Cb();
              a(n).addClass("disabled")
            } else for (g in P) {
              n = P[g];
              a(n).removeClass("disabled")
            }
            if (H && G) for (g in T) {
              n = T[g];
              a(n).hasClass("tool_button_current") && Cb();
              a(n).addClass("disabled")
            } else for (g in T) {
              n = T[g];
              a(n).removeClass("disabled")
            }
            c.runExtensions("toolButtonStateUpdate", {
              nofill: G,
              nostroke: H
            });
            a(".tools_flyout").each(function() {
              var Y = a("#" + this.id + "_show"),
                fa = false;
              a(this).children().each(function() {
                a(this).hasClass("disabled") || (fa = true)
              });
              Y.toggleClass("disabled", !fa)
            });
            hb()
          },
          Ta = function() {
            var g = na;
            if (g != null && !g.parentNode) g = null;
            var n = c.getCurrentDrawing().getCurrentLayerName(),
              G = c.getMode(),
              H = A.baseUnit !== "px" ? A.baseUnit : null,
              P = G == "pathedit",
              T = a("#cmenu_canvas li");
            a("#selected_panel, #multiselected_panel, #g_panel, #rect_panel, #circle_panel,#ellipse_panel, #line_panel, #text_panel, #image_panel, #container_panel, #use_panel, #a_panel").hide();
            if (g != null) {
              var Y = g.nodeName,
                fa = c.getRotationAngle(g);
              a("#angle").val(fa);
              var ja = c.getBlur(g);
              a("#blur").val(ja);
              a("#blur_slider").slider("option", "value", ja);
              c.addedNew && Y === "image" && c.getHref(g).indexOf("data:") !== 0 && Z();
              if (!P && G != "pathedit") {
                a("#selected_panel").show();
                if (["line", "circle", "ellipse"].indexOf(Y) >= 0) a("#xy_panel").hide();
                else {
                  var la, ha;
                  if (["g", "polyline", "path"].indexOf(Y) >= 0) {
                    if (G = c.getStrokedBBox([g])) {
                      la = G.x;
                      ha = G.y
                    }
                  } else {
                    la = g.getAttribute("x");
                    ha = g.getAttribute("y")
                  }
                  if (H) {
                    la = svgedit.units.convertUnit(la);
                    ha = svgedit.units.convertUnit(ha)
                  }
                  a("#selected_x").val(la || 0);
                  a("#selected_y").val(ha || 0);
                  a("#xy_panel").show()
                }
                H = ["image", "text", "path", "g", "use"].indexOf(Y) == -1;
                a("#tool_topath").toggle(H);
                a("#tool_reorient").toggle(Y === "path");
                a("#tool_reorient").toggleClass("disabled", fa === 0)
              } else {
                n = Ua.getNodePoint();
                a("#tool_add_subpath").removeClass("push_button_pressed").addClass("tool_button");
                a("#tool_node_delete").toggleClass("disabled", !Ua.canDeleteNodes);
                db("#tool_openclose_path", Ua.closed_subpath ? "open_path" : "close_path");
                if (n) {
                  P = a("#seg_type");
                  if (H) {
                    n.x = svgedit.units.convertUnit(n.x);
                    n.y = svgedit.units.convertUnit(n.y)
                  }
                  a("#path_node_x").val(n.x);
                  a("#path_node_y").val(n.y);
                  n.type ? P.val(n.type).removeAttr("disabled") : P.val(4).attr("disabled", "disabled")
                }
                return
              }
              H = {
                g: [],
                a: [],
                rect: ["rx", "width", "height"],
                image: ["width", "height"],
                circle: ["cx", "cy", "r"],
                ellipse: ["cx", "cy", "rx", "ry"],
                line: ["x1", "y1", "x2", "y2"],
                text: [],
                use: []
              };
              var ma = g.tagName;
              Y = null;
              if (ma === "a") {
                Y = c.getHref(g);
                a("#g_panel").show()
              }
              if (g.parentNode.tagName === "a") if (!a(g).siblings().length) {
                a("#a_panel").show();
                Y = c.getHref(g.parentNode)
              }
              a("#tool_make_link, #tool_make_link").toggle(!Y);
              Y && a("#link_url").val(Y);
              if (H[ma]) {
                H = H[ma];
                a("#" + ma + "_panel").show();
                a.each(H, function(sa, Ga) {
                  var V = g.getAttribute(Ga);
                  if (A.baseUnit !== "px" && g[Ga]) V = svgedit.units.convertUnit(g[Ga].baseVal.value);
                  a("#" + ma + "_" + Ga).val(V || 0)
                });
                if (ma == "text") {
                  a("#text_panel").css("display", "inline");
                  c.getItalic() ? a("#tool_italic").addClass("push_button_pressed").removeClass("tool_button") : a("#tool_italic").removeClass("push_button_pressed").addClass("tool_button");
                  c.getBold() ? a("#tool_bold").addClass("push_button_pressed").removeClass("tool_button") : a("#tool_bold").removeClass("push_button_pressed").addClass("tool_button");
                  a("#font_family").val(g.getAttribute("font-family"));
                  a("#font_size").val(g.getAttribute("font-size"));
                  a("#text").val(g.textContent);
                  c.addedNew && setTimeout(function() {
                    a("#text").focus().select()
                  }, 100)
                } else if (ma == "image") Bb(c.getHref(g));
                else if (ma === "g" || ma === "use") {
                  a("#container_panel").show();
                  H = c.getTitle();
                  Y = a("#g_title")[0];
                  Y.value = H;
                  tb(Y);
                  a("#g_title").prop("disabled", ma == "use")
                }
              }
              T[(ma === "g" ? "en" : "dis") + "ableContextMenuItems"]("#ungroup");
              T[(ma === "g" || !Qa ? "dis" : "en") + "ableContextMenuItems"]("#group")
            } else if (Qa) {
              a("#multiselected_panel").show();
              T.enableContextMenuItems("#group").disableContextMenuItems("#ungroup")
            } else T.disableContextMenuItems("#delete,#cut,#copy,#group,#ungroup,#move_front,#move_up,#move_down,#move_back");
            a("#tool_undo").toggleClass("disabled", ib.getUndoStackSize() === 0);
            a("#tool_redo").toggleClass("disabled", ib.getRedoStackSize() === 0);
            c.addedNew = false;
            if (g && !P || Qa) {
              a("#selLayerNames").removeAttr("disabled").val(n);
              pa.enableContextMenuItems("#delete,#cut,#copy,#move_front,#move_up,#move_down,#move_back")
            } else a("#selLayerNames").attr("disabled", "disabled")
          },
          Ub = function() {
            if (!Sb) {
              var g = "#workarea.wireframe #svgcontent * { stroke-width: " + 1 / c.getZoom() + "px; }";
              a("#wireframe_rules").text(W.hasClass("wireframe") ? g : "")
            }
          },
          Lb = function(g) {
            g = g || c.getDocumentTitle();
            g = kb + (g ? ": " + g : "");
            a("title:first").text(g)
          },
          ob = c.zoomChanged = function(g, n, G) {
            if (n = c.setBBoxZoom(n, W.width() - 15, W.height() - 15)) {
              g = n.zoom;
              n = n.bbox;
              if (g < 0.001) bb({
                value: 0.1
              });
              else {
                a("#zoom").val((g * 100).toFixed(1));
                G ? Ya() : Ya(false, {
                  x: n.x * g + n.width * g / 2,
                  y: n.y * g + n.height * g / 2
                });
                c.getMode() == "zoom" && n.width && jb();
                Ub()
              }
            }
          };
        bb = function(g) {
          var n = g.value / 100;
          if (n < 0.001) g.value = 0.1;
          else {
            g = c.getZoom();
            ob(window, {
              width: 0,
              height: 0,
              x: (W[0].scrollLeft + W.width() / 2) / g,
              y: (W[0].scrollTop + W.height() / 2) / g,
              zoom: n
            }, true)
          }
        };
        a("#cur_context_panel").delegate("a", "click", function() {
          var g = a(this);
          g.attr("data-root") ? c.leaveContext() : c.setContext(g.text());
          c.clearSelection();
          return false
        });
        var Za = {},
          Ha = function() {
            a(".tools_flyout").each(function() {
              var g = a("#" + this.id + "_show");
              if (!g.data("isLibrary")) {
                var n = [];
                a(this).children().each(function() {
                  n.push(this.title)
                });
                g[0].title = n.join(" / ")
              }
            })
          },
          Ka = function() {
            a(".tools_flyout").each(function() {
              var g = a("#" + this.id + "_show"),
                n = g.offset();
              g = g.outerWidth();
              a(this).css({
                left: (n.left + g) * j.tool_scale,
                top: n.top
              })
            })
          },
          ra = function(g) {
            a.each(g, function(n, G) {
              var H = a(n).children(),
                P = n + "_show",
                T = a(P),
                Y = false;
              H.addClass("tool_button").unbind("click mousedown mouseup").each(function(la) {
                var ha = G[la];
                Za[ha.sel] = ha.fn;
                if (ha.isDefault) Y = la;
                la = function(ma) {
                  var sa = ha;
                  if (ma.type === "keydown") {
                    var Ga = a(sa.parent + "_show").hasClass("tool_button_current"),
                      V = a(sa.parent + "_show").attr("data-curopt");
                    a.each(g[ha.parent], function(wa, Ia) {
                      if (Ia.sel == V) sa = !ma.shiftKey || !Ga ? Ia : g[ha.parent][wa + 1] || g[ha.parent][0]
                    })
                  }
                  if (a(this).hasClass("disabled")) return false;
                  La(P) && sa.fn();
                  var Ea;
                  Ea = sa.icon ? a.getSvgIcon(sa.icon, true) : a(sa.sel).children().eq(0).clone();
                  Ea[0].setAttribute("width", T.width());
                  Ea[0].setAttribute("height", T.height());
                  T.children(":not(.flyout_arrow_horiz)").remove();
                  T.append(Ea).attr("data-curopt", sa.sel)
                };
                a(this).mouseup(la);
                ha.key && a(document).bind("keydown", ha.key[0] + " shift+" + ha.key[0], la)
              });
              if (Y) T.attr("data-curopt", G[Y].sel);
              else T.attr("data-curopt") || T.attr("data-curopt", G[0].sel);
              var fa, ja = a(P).position();
              T.mousedown(function(la) {
                if (T.hasClass("disabled")) return false;
                var ha = a(n),
                  ma = ja.left + 34,
                  sa = ha.width() * -1,
                  Ga = ha.data("shown_popop") ? 200 : 0;
                fa = setTimeout(function() {
                  T.data("isLibrary") ? ha.css("left", ma).show() : ha.css("left", sa).show().animate({
                    left: ma
                  }, 150);
                  ha.data("shown_popop", true)
                }, Ga);
                la.preventDefault()
              }).mouseup(function() {
                clearTimeout(fa);
                var la = a(this).attr("data-curopt");
                if (T.data("isLibrary") && a(P.replace("_show", "")).is(":visible")) La(P, true);
                else La(P) && Za[la] && Za[la]()
              })
            });
            Ha();
            Ka()
          },
          Db = function(g, n) {
            return a("<div>", {
              "class": "tools_flyout",
              id: g
            }).appendTo("#svg_editor").append(n)
          },
          Mb = function() {
            var g, n = /^(Moz|Webkit|Khtml|O|ms|Icab)(?=[A-Z])/,
              G = document.getElementsByTagName("script")[0];
            for (g in G.style) if (n.test(g)) return g.match(n)[0];
            if ("WebkitOpacity" in G.style) return "Webkit";
            if ("KhtmlOpacity" in G.style) return "Khtml";
            return ""
          }(),
          gc = function(g, n) {
            var G = ["top", "left", "bottom", "right"];
            g.each(function() {
              var H, P = a(this),
                T = P.outerWidth() * (n - 1),
                Y = P.outerHeight() * (n - 1);
              for (H = 0; H < 4; H++) {
                var fa = G[H],
                  ja = P.data("orig_margin-" + fa);
                if (ja == null) {
                  ja = parseInt(P.css("margin-" + fa), 10);
                  P.data("orig_margin-" + fa, ja)
                }
                ja = ja * n;
                if (fa === "right") ja += T;
                else if (fa === "bottom") ja += Y;
                P.css("margin-" + fa, ja)
              }
            })
          },
          Yb = j.setIconSize = function(g) {
            var n = a("#tools_top .toolset, #editor_panel > *, #history_panel > *,\t\t\t\t#main_button, #tools_left > *, #path_node_panel > *, #multiselected_panel > *,\t\t\t\t#g_panel > *, #tool_font_size > *, .tools_flyout"),
              G = 1;
            G = typeof g === "number" ? g : {
              s: 0.75,
              m: 1,
              l: 1.25,
              xl: 1.5
            }[g];
            j.tool_scale = G;
            Ka();
            var H = n.parents(":hidden");
            H.css("visibility", "hidden").show();
            gc(n, G);
            H.css("visibility", "visible").hide();
            a.pref("iconsize", g);
            a("#iconsize").val(g);
            H = {
              "#tools_top": {
                left: 50 + a("#main_button").width(),
                height: 72
              },
              "#tools_left": {
                width: 31,
                top: 74
              },
              "div#workarea": {
                left: 38,
                top: 74
              }
            };
            n = a("#tool_size_rules");
            if (n.length) n.empty();
            else n = a('<style id="tool_size_rules"></style>').appendTo("head");
            if (g !== "m") {
              var P = "";
              a.each(H, function(T, Y) {
                T = "#svg_editor " + T.replace(/,/g, ", #svg_editor");
                P += T + "{";
                a.each(Y, function(fa, ja) {
                  var la;
                  if (typeof ja === "number") la = ja * G + "px";
                  else if (ja[g] || ja.all) la = ja[g] || ja.all;
                  P += fa + ":" + la + ";"
                });
                P += "}"
              });
              H = "-" + Mb.toLowerCase() + "-";
              P += "#tools_top .toolset, #editor_panel > *, #history_panel > *,\t\t\t\t#main_button, #tools_left > *, #path_node_panel > *, #multiselected_panel > *,\t\t\t\t#g_panel > *, #tool_font_size > *, .tools_flyout{" + H + "transform: scale(" + G + ");} #svg_editor div.toolset .toolset {" + H + "transform: scale(1); margin: 1px !important;} #svg_editor .ui-slider {" + H + "transform: scale(" + 1 / G + ");}";
              n.text(P)
            }
            Ka()
          },
          fb = function(g, n, G, H) {
            var P = a(g);
            n = a(n);
            var T = false,
              Y = H.dropUp;
            Y && a(g).addClass("dropup");
            n.find("li").bind("mouseup", function() {
              if (H.seticon) {
                db("#cur_" + P[0].id, a(this).children());
                a(this).addClass("current").siblings().removeClass("current")
              }
              G.apply(this, arguments)
            });
            a(window).mouseup(function() {
              if (!T) {
                P.removeClass("down");
                n.hide();
                n.css({
                  top: 0,
                  left: 0
                })
              }
              T = false
            });
            P.bind("mousedown", function() {
              var fa = P.offset();
              if (Y) {
                fa.top -= n.height();
                fa.left += 8
              } else fa.top += P.height();
              n.offset(fa);
              if (P.hasClass("down")) {
                n.hide();
                n.css({
                  top: 0,
                  left: 0
                })
              } else {
                n.show();
                T = true
              }
              P.toggleClass("down")
            }).hover(function() {
              T = true
            }).mouseout(function() {
              T = false
            });
            H.multiclick && n.mousedown(function() {
              T = true
            })
          },
          xa = [],
          gb = function(g, n, G) {
            n = {
              alpha: n
            };
            if (g.indexOf("url(#") === 0) {
              g = (g = c.getRefElem(g)) ? g.cloneNode(true) : a("#" + G + "_color defs *")[0];
              n[g.tagName] = g
            } else n.solidColor = g.indexOf("#") === 0 ? g.substr(1) : "none";
            return new a.jGraduate.Paint(n)
          };
        a("#text").focus(function() {});
        a("#text").blur(function() {});
        c.bind("selected", function(g, n) {
          var G = c.getMode();
          G === "select" && jb();
          G = G == "pathedit";
          na = n.length === 1 || n[1] == null ? n[0] : null;
          Qa = n.length >= 2 && n[1] != null;
          if (na != null) if (!G) {
            var H, P;
            if (na != null) switch (na.tagName) {
              case "use":
              case "image":
              case "foreignObject":
                break;
              case "g":
              case "a":
                var T = null,
                  Y = na.getElementsByTagName("*");
                H = 0;
                for (P = Y.length; H < P; H++) {
                  var fa = Y[H].getAttribute("stroke-width");
                  if (H === 0) T = fa;
                  else if (T !== fa) T = null
                }
                a("#stroke_width").val(T === null ? "" : T);
                Na.fill.update(true);
                Na.stroke.update(true);
                break;
              default:
                Na.fill.update(true);
                Na.stroke.update(true);
                a("#stroke_width").val(na.getAttribute("stroke-width") || 1);
                a("#stroke_style").val(na.getAttribute("stroke-dasharray") || "none");
                H = na.getAttribute("stroke-linejoin") || "miter";
                a("#linejoin_" + H).length != 0 && r(a("#linejoin_" + H)[0]);
                H = na.getAttribute("stroke-linecap") || "butt";
                a("#linecap_" + H).length != 0 && r(a("#linecap_" + H)[0])
            }
            if (na != null) {
              H = (na.getAttribute("opacity") || 1) * 100;
              a("#group_opacity").val(H);
              a("#opac_slider").slider("option", "value", H);
              a("#elem_id").val(na.id);
              a("#elem_class").val(na.getAttribute("class"))
            }
            ub()
          }
          Da(G, n);
          Ta();
          c.runExtensions("selectedChanged", {
            elems: n,
            selectedElement: na,
            multiselected: Qa
          })
        });
        c.bind("transition", function(g, n) {
          var G = c.getMode(),
            H = n[0];
          if (H) {
            Qa = n.length >= 2 && n[1] != null;
            if (!Qa) switch (G) {
              case "rotate":
                G = c.getRotationAngle(H);
                a("#angle").val(G);
                a("#tool_reorient").toggleClass("disabled", G === 0)
            }
            c.runExtensions("elementTransition", {
              elems: n
            })
          }
        });
        c.bind("changed", function(g, n) {
          var G, H = c.getMode();
          H === "select" && jb();
          for (G = 0; G < n.length; ++G) {
            var P = n[G];
            if (P && P.tagName === "svg") {
              ya();
              Ya()
            } else if (P && na && na.parentNode == null) na = P
          }
          j.showSaveWarning = true;
          Ta();
          if (na && H === "select") {
            Na.fill.update();
            Na.stroke.update()
          }
          c.runExtensions("elementChanged", {
            elems: n
          })
        });
        c.bind("saved", function(g, n) {
          j.showSaveWarning = false;
          n = '<?xml version="1.0"?>\n' + n;
          if (svgedit.browser.isIE()) Kb(0, true);
          else {
            var G = g.open("data:image/svg+xml;base64," + l.encode64(n)),
              H = a.pref("save_notice_done");
            if (H !== "all") {
              var P = u.notification.saveFromBrowser.replace("%s", "SVG");
              if (svgedit.browser.isGecko()) if (n.indexOf("<defs") !== -1) {
                P += "\n\n" + u.notification.defsFailOnSave;
                a.pref("save_notice_done", "all");
                H = "all"
              } else a.pref("save_notice_done", "part");
              else a.pref("save_notice_done", "all");
              H !== "part" && G.alert(P)
            }
          }
        });
        c.bind("exported", function(g, n) {
          var G = n.issues,
            H = n.exportWindowName;
          if (H) qa = window.open("", H);
          qa.location.href = n.datauri;
          if (a.pref("export_notice_done") !== "all") {
            H = u.notification.saveFromBrowser.replace("%s", n.type);
            if (G.length) H += "\n\n" + u.notification.noteTheseIssues + "\n \u2022 " + G.join("\n \u2022 ");
            a.pref("export_notice_done", "all");
            qa.alert(H)
          }
        });
        c.bind("exportedPDF", function(g, n) {
          var G = n.exportWindowName;
          if (G) qa = window.open("", G);
          qa.location.href = n.dataurlstring
        });
        c.bind("zoomed", ob);
        c.bind("contextset", function(g, n) {
          var G = "";
          if (n) {
            var H = "";
            G = '<a href="#" data-root="y">' + c.getCurrentDrawing().getCurrentLayerName() + "</a>";
            a(n).parentsUntil("#svgcontent > g").andSelf().each(function() {
              if (this.id) {
                H += " > " + this.id;
                G += this !== n ? ' > <a href="#">' + this.id + "</a>" : " > " + this.id
              }
            });
            va = H
          } else va = null;
          a("#cur_context_panel").toggle( !! n).html(G);
          Lb()
        });
        c.bind("extension_added", function(g, n) {
          function G() {
            if (Ib) {
              clearTimeout(Ib);
              Ib = null
            }
            P || (Ib = setTimeout(function() {
              P = true;
              Yb(a.pref("iconsize"))
            }, 50))
          }
          if (n) {
            var H = false,
              P = false,
              T = true;
            if (n.langReady) if (j.langChanged) {
              var Y = a.pref("lang");
              n.langReady({
                lang: Y,
                uiStrings: u
              })
            } else xa.push(n);
            var fa = function() {
                if (n.callback && !H && T) {
                  H = true;
                  n.callback()
                }
              },
              ja = [];
            n.context_tools && a.each(n.context_tools, function(Ga, V) {
              var Ea, wa = V.container_id ? ' id="' + V.container_id + '"' : "",
                Ia = a("#" + V.panel);
              Ia.length || (Ia = a("<div>", {
                id: V.panel
              }).appendTo("#tools_top"));
              switch (V.type) {
                case "tool_button":
                  Ea = '<div class="tool_button">' + V.id + "</div>";
                  var Ra = a(Ea).appendTo(Ia);
                  V.events && a.each(V.events, function(Oa, Ja) {
                    a(Ra).bind(Oa, Ja)
                  });
                  break;
                case "select":
                  Ea = "<label" + wa + '><select id="' + V.id + '">';
                  a.each(V.options, function(Oa, Ja) {
                    Ea += '<option value="' + Oa + '"' + (Oa == V.defval ? " selected" : "") + ">" + Ja + "</option>"
                  });
                  Ea += "</select></label>";
                  var Fa = a(Ea).appendTo(Ia).find("select");
                  a.each(V.events, function(Oa, Ja) {
                    a(Fa).bind(Oa, Ja)
                  });
                  break;
                case "button-select":
                  Ea = '<div id="' + V.id + '" class="dropdown toolset" title="' + V.title + '"><div id="cur_' + V.id + '" class="icon_label"></div><button></button></div>';
                  wa = a('<ul id="' + V.id + '_opts"></ul>').appendTo("#option_lists");
                  V.colnum && wa.addClass("optcols" + V.colnum);
                  a(Ea).appendTo(Ia).children();
                  ja.push({
                    elem: "#" + V.id,
                    list: "#" + V.id + "_opts",
                    title: V.title,
                    callback: V.events.change,
                    cur: "#cur_" + V.id
                  });
                  break;
                case "input":
                  Ea = "<label" + wa + '><span id="' + V.id + '_label">' + V.label + ':</span><input id="' + V.id + '" title="' + V.title + '" size="' + (V.size || "4") + '" value="' + (V.defval || "") + '" type="text"/></label>';
                  var Sa = a(Ea).appendTo(Ia).find("input");
                  V.spindata && Sa.SpinButton(V.spindata);
                  V.events && a.each(V.events, function(Oa, Ja) {
                    Sa.bind(Oa, Ja)
                  })
              }
            });
            if (n.buttons) {
              var la = {},
                ha = {},
                ma = n.svgicons,
                sa = {};
              a.each(n.buttons, function(Ga, V) {
                var Ea, wa, Ia, Ra = V.id;
                for (wa = Ga; a("#" + Ra).length;) Ra = V.id + "_" + ++wa;
                if (ma) {
                  la[Ra] = V.icon;
                  wa = V.svgicon || V.id;
                  if (V.type == "app_menu") ha["#" + Ra + " > div"] = wa;
                  else ha["#" + Ra] = wa
                } else Ea = a('<img src="' + V.icon + '">');
                var Fa, Sa;
                switch (V.type) {
                  case "mode_flyout":
                  case "mode":
                    Fa = "tool_button";
                    Sa = "#tools_left";
                    break;
                  case "context":
                    Fa = "tool_button";
                    Sa = "#" + V.panel;
                    a(Sa).length || a("<div>", {
                      id: V.panel
                    }).appendTo("#tools_top");
                    break;
                  case "app_menu":
                    Fa = "";
                    Sa = "#main_menu ul"
                }
                var Oa, Ja, Wa = a(V.list || V.type == "app_menu" ? "<li/>" : "<div/>").attr("id", Ra).attr("title", V.title).addClass(Fa);
                if (!V.includeWith && !V.list) {
                  if ("position" in V) a(Sa).children().eq(V.position).length ? a(Sa).children().eq(V.position).before(Wa) : a(Sa).children().last().before(Wa);
                  else Wa.appendTo(Sa);
                  if (V.type == "mode_flyout") {
                    Ja = a(Wa);
                    Fa = Ja.parent();
                    if (!Ja.parent().hasClass("tools_flyout")) {
                      Ia = Ja[0].id.replace("tool_", "tools_");
                      wa = Ja.clone().attr("id", Ia + "_show").append(a("<div>", {
                        "class": "flyout_arrow_horiz"
                      }));
                      Ja.before(wa);
                      Fa = Db(Ia, Ja);
                      Fa.data("isLibrary", true);
                      wa.data("isLibrary", true)
                    }
                    ha["#" + Ia + "_show"] = V.id;
                    Ia = sa["#" + Fa[0].id] = [{
                      sel: "#" + Ra,
                      fn: V.events.click,
                      icon: V.id,
                      isDefault: true
                    },
                      Oa]
                  } else V.type == "app_menu" && Wa.append("<div>").append(V.title)
                } else if (V.list) {
                  Wa.addClass("push_button");
                  a("#" + V.list + "_opts").append(Wa);
                  if (V.isDefault) {
                    a("#cur_" + V.list).append(Wa.children().clone());
                    wa = V.svgicon || V.id;
                    ha["#cur_" + V.list] = wa
                  }
                } else if (V.includeWith) {
                  Sa = V.includeWith;
                  Ja = a(Sa.button);
                  Fa = Ja.parent();
                  if (!Ja.parent().hasClass("tools_flyout")) {
                    Ia = Ja[0].id.replace("tool_", "tools_");
                    wa = Ja.clone().attr("id", Ia + "_show").append(a("<div>", {
                      "class": "flyout_arrow_horiz"
                    }));
                    Ja.before(wa);
                    Fa = Db(Ia, Ja)
                  }
                  Oa = Jb.getButtonData(Sa.button);
                  if (Sa.isDefault) ha["#" + Ia + "_show"] = V.id;
                  Ia = sa["#" + Fa[0].id] = [{
                    sel: "#" + Ra,
                    fn: V.events.click,
                    icon: V.id,
                    key: V.key,
                    isDefault: V.includeWith ? V.includeWith.isDefault : 0
                  },
                    Oa];
                  Ra = "position" in Sa ? Sa.position : "last";
                  Oa = Fa.children().length;
                  if (!isNaN(Ra) && Ra >= 0 && Ra < Oa) Fa.children().eq(Ra).before(Wa);
                  else {
                    Fa.append(Wa);
                    Ia.reverse()
                  }
                }
                ma || Wa.append(Ea);
                V.list || a.each(V.events, function(bc, cc) {
                  if (bc == "click" && V.type == "mode") {
                    V.includeWith ? Wa.bind(bc, cc) : Wa.bind(bc, function() {
                      La(Wa) && cc()
                    });
                    if (V.key) {
                      a(document).bind("keydown", V.key, cc);
                      V.title && Wa.attr("title", V.title + " [" + V.key + "]")
                    }
                  } else Wa.bind(bc, cc)
                });
                ra(sa)
              });
              a.each(ja, function() {
                fb(this.elem, this.list, this.callback, {
                  seticon: true
                })
              });
              if (ma) T = false;
              a.svgIcons(ma, {
                w: 24,
                h: 24,
                id_match: false,
                no_img: !svgedit.browser.isWebkit(),
                fallback: la,
                placement: ha,
                callback: function() {
                  a.pref("iconsize") !== "m" && G();
                  T = true;
                  fa()
                }
              })
            }
            fa()
          }
        });
        c.textActions.setInputElem(a("#text")[0]);
        var $a = '<div class="palette_item" data-rgb="none"></div>';
        a.each(["#000000", "#3f3f3f", "#7f7f7f", "#bfbfbf", "#ffffff", "#ff0000", "#ff7f00", "#ffff00", "#7fff00", "#00ff00", "#00ff7f", "#00ffff", "#007fff", "#0000ff", "#7f00ff", "#ff00ff", "#ff007f", "#7f0000", "#7f3f00", "#7f7f00", "#3f7f00", "#007f00", "#007f3f", "#007f7f", "#003f7f", "#00007f", "#3f007f", "#7f007f", "#7f003f", "#ffaaaa", "#ffd4aa", "#ffffaa", "#d4ffaa", "#aaffaa", "#aaffd4", "#aaffff", "#aad4ff", "#aaaaff", "#d4aaff", "#ffaaff", "#ffaad4"], function(g, n) {
          $a += '<div class="palette_item" style="background-color: ' + n + ';" data-rgb="' + n + '"></div>'
        });
        a("#palette").append($a);
        $a = "";
        a.each(["#FFF", "#888", "#000"], function() {
          $a += '<div class="color_block" style="background-color:' + this + ';"></div>'
        });
        a("#bg_blocks").append($a);
        var Eb = a("#bg_blocks div");
        Eb.each(function() {
          a(this).click(function() {
            Eb.removeClass("cur_background");
            a(this).addClass("cur_background")
          })
        });
        O(a.pref("bkgd_color"), a.pref("bkgd_url"));
        a("#image_save_opts input").val([a.pref("img_save")]);
        var vb = function(g, n) {
            if (n == null) n = g.value;
            a("#group_opacity").val(n);
            if (!g || !g.handle) a("#opac_slider").slider("option", "value", n);
            c.setOpacity(n / 100)
          },
          Pb = function(g, n, G) {
            if (n == null) n = g.value;
            a("#blur").val(n);
            var H = false;
            if (!g || !g.handle) {
              a("#blur_slider").slider("option", "value", n);
              H = true
            }
            G ? c.setBlurNoUndo(n) : c.setBlur(n, H)
          };
        a("#stroke_style").change(function() {
          c.setStrokeAttr("stroke-dasharray", a(this).val());
          hb()
        });
        a("#stroke_linejoin").change(function() {
          c.setStrokeAttr("stroke-linejoin", a(this).val());
          hb()
        });
        a("select").change(function() {
          a(this).blur()
        });
        var Qb = false;
        a("#selLayerNames").change(function() {
          var g = this.options[this.selectedIndex].value,
            n = u.notification.QmoveElemsToLayer.replace("%s", g),
            G = function(H) {
              if (H) {
                Qb = true;
                c.moveSelectedToLayer(g);
                c.clearSelection();
                ya()
              }
            };
          if (g) Qb ? G(true) : a.confirm(n, G)
        });
        a("#font_family").change(function() {
          c.setFontFamily(this.value)
        });
        a("#seg_type").change(function() {
          c.setSegType(a(this).val())
        });
        a("#text").keyup(function() {
          c.setTextContent(this.value)
        });
        a("#image_url").change(function() {
          Bb(this.value)
        });
        a("#link_url").change(function() {
          this.value.length ? c.setLinkURL(this.value) : c.removeHyperlink()
        });
        a("#g_title").change(function() {
          c.setGroupTitle(this.value)
        });
        a(".attr_changer").change(function() {
          var g = this.getAttribute("data-attr"),
            n = this.value;
          if (!svgedit.units.isValidUnit(g, n, na)) {
            a.alert(u.notification.invalidAttrValGiven);
            this.value = na.getAttribute(g);
            return false
          }
          if (g !== "id" && g !== "class") if (isNaN(n)) n = c.convertToNum(g, n);
          else if (A.baseUnit !== "px") {
            var G = svgedit.units.getTypeMap();
            if (na[g] || c.getMode() === "pathedit" || g === "x" || g === "y") n *= G[A.baseUnit]
          }
          if (g === "id") {
            g = na;
            c.clearSelection();
            g.id = n;
            c.addToSelection([g], true)
          } else c.changeSelectedAttribute(g, n);
          this.blur()
        });
        a("#palette").mouseover(function() {
          var g = a('<input type="hidden">');
          a(this).append(g);
          g.focus().remove()
        });
        a(".palette_item").mousedown(function(g) {
          g = g.shiftKey || g.button === 2 ? "stroke" : "fill";
          var n = a(this).data("rgb"),
            G;
          if (n === "none" || n === "transparent" || n === "initial") {
            n = "none";
            G = new a.jGraduate.Paint
          } else G = new a.jGraduate.Paint({
            alpha: 100,
            solidColor: n.substr(1)
          });
          Na[g].setPaint(G);
          c.setColor(g, n);
          n !== "none" && c.getPaintOpacity(g) !== 1 && c.setPaintOpacity(g, 1);
          ub()
        }).bind("contextmenu", function(g) {
          g.preventDefault()
        });
        a("#toggle_stroke_tools").on("click", function() {
          a("#tools_bottom").toggleClass("expanded")
        });
        (function() {
          var g = null,
            n = null,
            G = W[0],
            H = false,
            P = false;
          a("#svgcanvas").bind("mousemove mouseup", function(T) {
            if (H !== false) {
              G.scrollLeft -= T.clientX - g;
              G.scrollTop -= T.clientY - n;
              g = T.clientX;
              n = T.clientY;
              if (T.type === "mouseup") H = false;
              return false
            }
          }).mousedown(function(T) {
            if (T.button === 1 || P === true) {
              H = true;
              g = T.clientX;
              n = T.clientY;
              return false
            }
          });
          a(window).mouseup(function() {
            H = false
          });
          a(document).bind("keydown", "space", function(T) {
            c.spaceKey = P = true;
            T.preventDefault()
          }).bind("keyup", "space", function(T) {
            T.preventDefault();
            c.spaceKey = P = false
          }).bind("keydown", "shift", function() {
            c.getMode() === "zoom" && W.css("cursor", Tb)
          }).bind("keyup", "shift", function() {
            c.getMode() === "zoom" && W.css("cursor", qb)
          });
          j.setPanning = function(T) {
            c.spaceKey = P = T
          }
        })();
        (function() {
          var g = a("#main_icon"),
            n = a("#main_icon span"),
            G = a("#main_menu"),
            H = false,
            P = 0,
            T = true,
            Y = false;
          a(window).mouseup(function(ja) {
            if (!H) {
              g.removeClass("buttondown");
              if (ja.target.tagName != "INPUT") G.fadeOut(200);
              else if (!Y) {
                Y = true;
                a(ja.target).click(function() {
                  G.css("margin-left", "-9999px").show()
                })
              }
            }
            H = false
          }).mousedown(function(ja) {
            a(ja.target).closest("div.tools_flyout, .contextMenu").length || a(".tools_flyout:visible,.contextMenu").fadeOut(250)
          });
          n.bind("mousedown", function() {
            if (g.hasClass("buttondown")) G.fadeOut(200);
            else {
              G.css("margin-left", 0).show();
              P || (P = G.height());
              G.css("height", 0).animate({
                height: P
              }, 200);
              H = true
            }
            g.toggleClass("buttondown buttonup")
          }).hover(function() {
            H = true
          }).mouseout(function() {
            H = false
          });
          var fa = a("#main_menu li");
          fa.mouseover(function() {
            T = a(this).css("background-color") == "rgba(0, 0, 0, 0)";
            fa.unbind("mouseover");
            T && fa.mouseover(function() {
              this.style.backgroundColor = "#FFC"
            }).mouseout(function() {
              this.style.backgroundColor = "transparent";
              return true
            })
          })
        })();
        j.addDropDown = function(g, n, G) {
          if (a(g).length != 0) {
            var H = a(g).find("button"),
              P = a(g).find("ul").attr("id", a(g)[0].id + "-list"),
              T = false;
            G ? a(g).addClass("dropup") : a("#option_lists").append(P);
            P.find("li").bind("mouseup", n);
            a(window).mouseup(function() {
              if (!T) {
                H.removeClass("down");
                P.hide()
              }
              T = false
            });
            H.bind("mousedown", function() {
              if (H.hasClass("down")) P.hide();
              else {
                if (!G) {
                  var Y = a(g).position();
                  P.css({
                    top: Y.top + 24,
                    left: Y.left - 10
                  })
                }
                P.show();
                T = true
              }
              H.toggleClass("down")
            }).hover(function() {
              T = true
            }).mouseout(function() {
              T = false
            })
          }
        };
        j.addDropDown("#font_family_dropdown", function() {
          a("#font_family").val(a(this).text()).change()
        });
        j.addDropDown("#opacity_dropdown", function() {
          if (!a(this).find("div").length) {
            var g = parseInt(a(this).text().split("%")[0], 10);
            vb(false, g)
          }
        }, true);
        a("#opac_slider").slider({
          start: function() {
            a("#opacity_dropdown li:not(.special)").hide()
          },
          stop: function() {
            a("#opacity_dropdown li").show();
            a(window).mouseup()
          },
          slide: function(g, n) {
            vb(n)
          }
        });
        j.addDropDown("#blur_dropdown", a.noop);
        var zb = false;
        a("#blur_slider").slider({
          max: 10,
          step: 0.1,
          stop: function(g, n) {
            zb = false;
            Pb(n);
            a("#blur_dropdown li").show();
            a(window).mouseup()
          },
          start: function() {
            zb = true
          },
          slide: function(g, n) {
            Pb(n, null, zb)
          }
        });
        j.addDropDown("#zoom_dropdown", function() {
          var g = a(this),
            n = g.data("val");
          n ? ob(window, n) : bb({
            value: parseFloat(g.text())
          })
        }, true);
        fb("#stroke_linecap", "#linecap_opts", function() {
          r(this, true)
        }, {
          dropUp: true
        });
        fb("#stroke_linejoin", "#linejoin_opts", function() {
          r(this, true)
        }, {
          dropUp: true
        });
        fb("#tool_position", "#position_opts", function() {
          var g = this.id.replace("tool_pos", "").charAt(0);
          c.alignSelectedElements(g, "page")
        }, {
          multiclick: true
        });
        (function() {
          var g, n = function() {
            a(g).blur()
          };
          a("#svg_editor").find("button, select, input:not(#text)").focus(function() {
            g = this;
            rb = "toolbars";
            W.mousedown(n)
          }).blur(function() {
            rb = "canvas";
            W.unbind("mousedown", n);
            c.getMode() == "textedit" && a("#text").focus()
          })
        })();
        var Wb = function() {
            La("#tool_fhpath") && c.setMode("fhpath")
          },
          Zb = function() {
            La("#tool_line") && c.setMode("line")
          },
          wb = function() {
            La("#tool_square") && c.setMode("square")
          },
          Ob = function() {
            La("#tool_rect") && c.setMode("rect")
          },
          hc = function() {
            La("#tool_fhrect") && c.setMode("fhrect")
          },
          sb = function() {
            La("#tool_circle") && c.setMode("circle")
          },
          ic = function() {
            La("#tool_ellipse") && c.setMode("ellipse")
          },
          ac = function() {
            La("#tool_fhellipse") && c.setMode("fhellipse")
          },
          $b = function() {
            La("#tool_image") && c.setMode("image")
          },
          xb = function() {
            if (La("#tool_zoom")) {
              c.setMode("zoom");
              W.css("cursor", qb)
            }
          },
          Ma = function(g) {
            var n = c.getResolution();
            g = g ? n.zoom * g : 1;
            a("#zoom").val(g * 100);
            c.setZoom(g);
            Ub();
            Ya(true)
          },
          Vb = function() {
            if (La("#tool_zoom")) {
              Ma();
              jb()
            }
          },
          b = function() {
            La("#tool_text") && c.setMode("text")
          },
          f = function() {
            La("#tool_path") && c.setMode("path")
          },
          e = function() {
            if (na != null || Qa) c.deleteSelectedElements()
          },
          q = function() {
            if (na != null || Qa) c.cutSelectedElements()
          },
          k = function() {
            if (na != null || Qa) c.copySelectedElements()
          },
          D = function() {
            var g = c.getZoom(),
              n = (W[0].scrollLeft + W.width() / 2) / g - c.contentW;
            g = (W[0].scrollTop + W.height() / 2) / g - c.contentH;
            c.pasteElements("point", n, g)
          },
          p = function() {
            na != null && c.moveToTopSelectedElement()
          },
          w = function() {
            na != null && c.moveToBottomSelectedElement()
          },
          C = function(g) {
            na != null && c.moveUpDownSelected(g)
          },
          I = function() {
            na != null && c.convertToPath()
          },
          K = function() {
            na != null && Ua.reorient()
          },
          E = function() {
            if (na != null || Qa) a.prompt(u.notification.enterNewLinkURL, "http://", function(g) {
              g && c.makeHyperlink(g)
            })
          },
          N = function(g, n) {
            if (na != null || Qa) {
              if (A.gridSnapping) {
                var G = c.getZoom() * A.snappingStep;
                g *= G;
                n *= G
              }
              c.moveSelectedElements(g, n)
            }
          },
          S = function() {
            a("#tool_node_link").toggleClass("push_button_pressed tool_button");
            var g = a("#tool_node_link").hasClass("push_button_pressed");
            Ua.linkControlPoints(g)
          },
          U = function() {
            Ua.getNodePoint() && Ua.clonePathNode()
          },
          X = function() {
            Ua.getNodePoint() && Ua.deletePathNode()
          },
          da = function() {
            var g = a("#tool_add_subpath"),
              n = !g.hasClass("push_button_pressed");
            g.toggleClass("push_button_pressed tool_button");
            Ua.addSubPath(n)
          },
          R = function() {
            Ua.opencloseSubPath()
          },
          L = function() {
            c.cycleElement(1)
          },
          J = function() {
            c.cycleElement(0)
          },
          M = function(g, n) {
            if (!(na == null || Qa)) {
              g || (n *= -1);
              var G = parseFloat(a("#angle").val()) + n;
              c.setRotationAngle(G);
              Ta()
            }
          },
          Q = function() {
            var g = A.dimensions;
            a.confirm(u.notification.QwantToClear, function(n) {
              if (n) {
                jb();
                c.clear();
                c.setResolution(g[0], g[1]);
                Ya(true);
                Ma();
                ya();
                Ta();
                Na.fill.prep();
                Na.stroke.prep();
                c.runExtensions("onNewDocument")
              }
            })
          },
          aa = function() {
            c.setBold(!c.getBold());
            Ta();
            return false
          },
          ga = function() {
            c.setItalic(!c.getItalic());
            Ta();
            return false
          },
          oa = function() {
            a.select("Select an image type for export: ", ["PNG", "JPEG", "BMP", "WEBP", "PDF"], function(g) {
              function n() {
                var P = u.notification.loadingImage;
                A.exportWindowType === "new" && j.exportWindowCt++;
                G = A.canvasName + j.exportWindowCt;
                qa = window.open("data:text/html;charset=utf-8," + encodeURIComponent("<title>" + P + "</title><h1>" + P + "</h1>"), G)
              }
              if (g) {
                var G;
                if (g === "PDF") {
                  m || n();
                  c.exportPDF(G)
                } else {
                  o || n();
                  var H = parseInt(a("#image-slider").val(), 10) / 100;
                  c.rasterExport(g, H, G)
                }
              }
            }, function() {
              var g = a(this);
              if (g.val() === "JPEG" || g.val() === "WEBP") a("#image-slider").length || a('<div><label>Quality: <input id="image-slider" type="range" min="1" max="100" value="92" /></label></div>').appendTo(g.parent());
              else a("#image-slider").parent().remove()
            })
          },
          za = function() {
            c.open()
          },
          ca = function() {},
          ta = function() {
            if (ib.getUndoStackSize() > 0) {
              ib.undo();
              ya()
            }
          },
          Aa = function() {
            if (ib.getRedoStackSize() > 0) {
              ib.redo();
              ya()
            }
          },
          ab = function() {
            if (Qa) c.groupSelectedElements();
            else na && c.ungroupSelectedElement()
          },
          pb = function() {
            c.cloneSelectedElements(20, 20)
          },
          Fb = function() {
            var g = this.id.replace("tool_align", "").charAt(0);
            c.alignSelectedElements(g, a("#align_relative_to").val())
          },
          Nb = function() {
            a("#tool_wireframe").toggleClass("push_button_pressed tool_button");
            W.toggleClass("wireframe");
            if (!Sb) {
              var g = a("#wireframe_rules");
              g.length ? g.empty() : a('<style id="wireframe_rules"></style>').appendTo("head");
              Ub()
            }
          };
        a("#svg_docprops_container, #svg_prefs_container").draggable({
          cancel: "button,fieldset",
          containment: "window"
        });
        var Gb = function() {
            if (!Ba) {
              Ba = true;
              a("#image_save_opts input").val([a.pref("img_save")]);
              var g = c.getResolution();
              if (A.baseUnit !== "px") {
                g.w = svgedit.units.convertUnit(g.w) + A.baseUnit;
                g.h = svgedit.units.convertUnit(g.h) + A.baseUnit
              }
              a("#canvas_width").val(g.w);
              a("#canvas_height").val(g.h);
              a("#canvas_title").val(c.getDocumentTitle());
              a("#svg_docprops").show()
            }
          },
          xc = function() {
            if (!nb) {
              nb = true;
              a("#main_menu").hide();
              var g = a("#bg_blocks div"),
                n = F.bkgd_color,
                G = a.pref("bkgd_url");
              g.each(function() {
                var H = a(this),
                  P = H.css("background-color") == n;
                H.toggleClass("cur_background", P);
                P && a("#canvas_bg_url").removeClass("cur_background")
              });
              n || g.eq(0).addClass("cur_background");
              G && a("#canvas_bg_url").val(G);
              a("#grid_snapping_on").prop("checked", A.gridSnapping);
              a("#grid_snapping_step").attr("value", A.snappingStep);
              a("#grid_color").attr("value", A.gridColor);
              a("#svg_prefs").show()
            }
          },
          jc = function() {
            a("#svg_source_editor").hide();
            Xa = false;
            a("#svg_source_textarea").blur()
          },
          oc = function() {
            if (Xa) {
              var g = function() {
                c.clearSelection();
                jc();
                Ma();
                ya();
                Lb();
                Na.fill.prep();
                Na.stroke.prep()
              };
              c.setSvgString(a("#svg_source_textarea").val()) ? g() : a.confirm(u.notification.QerrorsRevertToSource, function(n) {
                if (!n) return false;
                g()
              });
              jb()
            }
          },
          pc = function() {
            a("#svg_docprops").hide();
            a("#canvas_width,#canvas_height").removeAttr("disabled");
            a("#resolution")[0].selectedIndex = 0;
            a("#image_save_opts input").val([a.pref("img_save")]);
            Ba = false
          },
          qc = function() {
            a("#svg_prefs").hide();
            nb = false
          },
          yc = function() {
            var g = a("#canvas_title").val();
            Lb(g);
            c.setDocumentTitle(g);
            g = a("#canvas_width");
            var n = g.val(),
              G = a("#canvas_height"),
              H = G.val();
            if (n != "fit" && !svgedit.units.isValidUnit("width", n)) {
              a.alert(u.notification.invalidAttrValGiven);
              g.parent().addClass("error");
              return false
            }
            g.parent().removeClass("error");
            if (H != "fit" && !svgedit.units.isValidUnit("height", H)) {
              a.alert(u.notification.invalidAttrValGiven);
              G.parent().addClass("error");
              return false
            }
            G.parent().removeClass("error");
            if (!c.setResolution(n, H)) {
              a.alert(u.notification.noContentToFitTo);
              return false
            }
            a.pref("img_save", a("#image_save_opts :checked").val());
            Ya();
            pc()
          },
          zc = j.savePreferences = function() {
            var g = a("#bg_blocks div.cur_background").css("background-color") || "#FFF";
            O(g, a("#canvas_bg_url").val());
            g = a("#lang_select").val();
            g !== a.pref("lang") && j.putLocale(g, mb);
            Yb(a("#iconsize").val());
            A.gridSnapping = a("#grid_snapping_on")[0].checked;
            A.snappingStep = a("#grid_snapping_step").val();
            A.gridColor = a("#grid_color").val();
            A.showRulers = a("#show_rulers")[0].checked;
            a("#rulers").toggle(A.showRulers);
            A.showRulers && ka();
            A.baseUnit = a("#base_unit").val();
            c.setConfig(A);
            Ya();
            qc()
          },
          dc = a.noop,
          rc = function() {
            a("#dialog_box").hide();
            if (!Xa && !Ba && !nb) va && c.leaveContext();
            else {
              if (Xa) Ab !== a("#svg_source_textarea").val() ? a.confirm(u.notification.QignoreSourceChanges, function(g) {
                g && jc()
              }) : jc();
              else if (Ba) pc();
              else nb && qc();
              dc()
            }
          },
          sc = {
            width: a(window).width(),
            height: a(window).height()
          };
        svgedit.browser.isIE() &&
        function() {
          dc = function() {
            if (W[0].scrollLeft === 0 && W[0].scrollTop === 0) {
              W[0].scrollLeft = yb.left;
              W[0].scrollTop = yb.top
            }
          };
          yb = {
            left: W[0].scrollLeft,
            top: W[0].scrollTop
          };
          a(window).resize(dc);
          j.ready(function() {
            setTimeout(function() {
              dc()
            }, 500)
          });
          W.scroll(function() {
            yb = {
              left: W[0].scrollLeft,
              top: W[0].scrollTop
            }
          })
        }();
        a(window).resize(function() {
          a.each(sc, function(g, n) {
            var G = a(window)[g]();
            W[0]["scroll" + (g === "width" ? "Left" : "Top")] -= (G - n) / 2;
            sc[g] = G
          });
          Ka()
        });
        (function() {
          W.scroll(function() {
            if (a("#ruler_x").length != 0) a("#ruler_x")[0].scrollLeft = W[0].scrollLeft;
            if (a("#ruler_y").length != 0) a("#ruler_y")[0].scrollTop = W[0].scrollTop
          })
        })();
        a("#url_notice").click(function() {
          a.alert(this.title)
        });
        a("#change_image_url").click(Z);
        (function() {
          var g = "";
          a.each(["clear", "open", "save", "source", "delete", "delete_multi", "paste", "clone", "clone_multi", "move_top", "move_bottom"], function(n, G) {
            g += (n ? "," : "") + "#tool_" + G
          });
          a(g).mousedown(function() {
            a(this).addClass("tool_button_current")
          }).bind("mousedown mouseout", function() {
            a(this).removeClass("tool_button_current")
          });
          a("#tool_undo, #tool_redo").mousedown(function() {
            a(this).hasClass("disabled") || a(this).addClass("tool_button_current")
          }).bind("mousedown mouseout", function() {
            a(this).removeClass("tool_button_current")
          })
        })();
        if (svgedit.browser.isMac() && !window.opera) {
          var ec = ["tool_clear", "tool_save", "tool_source", "tool_undo", "tool_redo", "tool_clone"];
          for (ua = ec.length; ua--;) {
            var kc = document.getElementById(ec[ua]);
            if (kc) {
              var lc = kc.title,
                tc = lc.indexOf("Ctrl+");
              kc.title = [lc.substr(0, tc), "Cmd+", lc.substr(tc + 5)].join("")
            }
          }
        }
        var uc = function(g) {
          var n = g.attr("id") == "stroke_color" ? "stroke" : "fill",
            G = Na[n].paint,
            H = n == "stroke" ? "Pick a Stroke Paint and Opacity" : "Pick a Fill Paint and Opacity";
          g = g.offset();
          a("#color_picker").draggable({
            cancel: ".jGraduate_tabs, .jGraduate_colPick, .jGraduate_gradPick, .jPicker",
            containment: "window"
          }).css(A.colorPickerCSS || {
              left: g.left - 140,
              bottom: 40
            }).jGraduate({
            paint: G,
            window: {
              pickerTitle: H
            },
            images: {
              clientPath: A.jGraduatePath
            },
            newstop: "inverse"
          }, function(P) {
            G = new a.jGraduate.Paint(P);
            Na[n].setPaint(G);
            c.setPaint(n, G);
            a("#color_picker").hide()
          }, function() {
            a("#color_picker").hide()
          })
        };
        ua = function(g, n) {
          var G, H, P = A[n === "fill" ? "initFill" : "initStroke"],
            T = (new DOMParser).parseFromString('<svg xmlns="http://www.w3.org/2000/svg"><rect width="16.5" height="16.5"\t\t\t\t\tfill="#' + P.color + '" opacity="' + P.opacity + '"/>\t\t\t\t\t<defs><linearGradient id="gradbox_"/></defs></svg>', "text/xml").documentElement;
          T = a(g)[0].appendChild(document.importNode(T, true));
          T.setAttribute("width", 16.5);
          this.rect = T.firstChild;
          this.defs = T.getElementsByTagName("defs")[0];
          this.grad = this.defs.firstChild;
          this.paint = new a.jGraduate.Paint({
            solidColor: P.color
          });
          this.type = n;
          this.setPaint = function(Y, fa) {
            this.paint = Y;
            var ja = "none",
              la = Y.type,
              ha = Y.alpha / 100;
            switch (la) {
              case "solidColor":
                ja = Y[la] != "none" ? "#" + Y[la] : Y[la];
                break;
              case "linearGradient":
              case "radialGradient":
                this.defs.removeChild(this.grad);
                this.grad = this.defs.appendChild(Y[la]);
                ja = "url(#" + (this.grad.id = "gradbox_" + this.type) + ")"
            }
            this.rect.setAttribute("fill", ja);
            this.rect.setAttribute("opacity", ha);
            if (fa) {
              c.setColor(this.type, G, true);
              c.setPaintOpacity(this.type, H, true)
            }
          };
          this.update = function(Y) {
            if (na) {
              var fa, ja, la = this.type;
              switch (na.tagName) {
                case "use":
                case "image":
                case "foreignObject":
                  return;
                case "g":
                case "a":
                  var ha = null,
                    ma = na.getElementsByTagName("*");
                  fa = 0;
                  for (ja = ma.length; fa < ja; fa++) {
                    var sa = ma[fa].getAttribute(la);
                    if (fa === 0) ha = sa;
                    else if (ha !== sa) {
                      ha = null;
                      break
                    }
                  }
                  if (ha === null) {
                    G = null;
                    return
                  }
                  G = ha;
                  H = 1;
                  break;
                default:
                  H = parseFloat(na.getAttribute(la + "-opacity"));
                  if (isNaN(H)) H = 1;
                  fa = la === "fill" ? "black" : "none";
                  G = na.getAttribute(la) || fa
              }
              if (Y) {
                c.setColor(la, G, true);
                c.setPaintOpacity(la, H, true)
              }
              H *= 100;
              this.setPaint(gb(G, H, la))
            }
          };
          this.prep = function() {
            switch (this.paint.type) {
              case "linearGradient":
              case "radialGradient":
                var Y = new a.jGraduate.Paint({
                  copy: this.paint
                });
                c.setPaint(n, Y)
            }
          }
        };
        Na.fill = new ua("#fill_color", "fill");
        Na.stroke = new ua("#stroke_color", "stroke");
        a("#stroke_width").val(A.initStroke.width);
        a("#group_opacity").val(A.initOpacity * 100);
        ua = Na.fill.rect.cloneNode(false);
        ua.setAttribute("style", "vector-effect:non-scaling-stroke");
        Sb = ua.style.vectorEffect === "non-scaling-stroke";
        ua.removeAttribute("style");
        ua = Na.fill.rect.ownerDocument.createElementNS(svgedit.NS.SVG, "feGaussianBlur");
        ua.stdDeviationX === undefined && a("#tool_blur").hide();
        a(ua).remove();
        (function() {
          var g = "-" + Mb.toLowerCase() + "-zoom-",
            n = g + "in";
          W.css("cursor", n);
          if (W.css("cursor") === n) {
            qb = n;
            Tb = g + "out"
          }
          W.css("cursor", "auto")
        })();
        setTimeout(function() {
          c.embedImage("images/logo.png", function(g) {
            if (!g) {
              a("#image_save_opts [value=embed]").attr("disabled", "disabled");
              a("#image_save_opts input").val(["ref"]);
              a.pref("img_save", "ref");
              a("#image_opt_embed").css("color", "#666").attr("title", u.notification.featNotSupported)
            }
          })
        }, 1E3);
        a("#fill_color, #tool_fill .icon_label").click(function() {
          uc(a("#fill_color"));
          ub()
        });
        a("#stroke_color, #tool_stroke .icon_label").click(function() {
          uc(a("#stroke_color"));
          ub()
        });
        a("#group_opacityLabel").click(function() {
          a("#opacity_dropdown button").mousedown();
          a(window).mouseup()
        });
        a("#zoomLabel").click(function() {
          a("#zoom_dropdown button").mousedown();
          a(window).mouseup()
        });
        a("#tool_move_top").mousedown(function(g) {
          a("#tools_stacking").show();
          g.preventDefault()
        });
        a(".layer_button").mousedown(function() {
          a(this).addClass("layer_buttonpressed")
        }).mouseout(function() {
          a(this).removeClass("layer_buttonpressed")
        }).mouseup(function() {
          a(this).removeClass("layer_buttonpressed")
        });
        a(".push_button").mousedown(function() {
          a(this).hasClass("disabled") || a(this).addClass("push_button_pressed").removeClass("push_button")
        }).mouseout(function() {
          a(this).removeClass("push_button_pressed").addClass("push_button")
        }).mouseup(function() {
          a(this).removeClass("push_button_pressed").addClass("push_button")
        });
        a("#layer_new").click(function() {
          var g, n = c.getCurrentDrawing().getNumLayers();
          do g = u.layers.layer + " " + ++n;
          while (c.getCurrentDrawing().hasLayer(g));
          a.prompt(u.notification.enterUniqueLayerName, g, function(G) {
            if (G) if (c.getCurrentDrawing().hasLayer(G)) a.alert(u.notification.dupeLayerName);
            else {
              c.createLayer(G);
              Ta();
              ya()
            }
          })
        });
        a("#layer_delete").click(ea);
        a("#layer_up").click(function() {
          ia(-1)
        });
        a("#layer_down").click(function() {
          ia(1)
        });
        a("#layer_rename").click(function() {
          var g = a("#layerlist tr.layersel td.layername").text();
          a.prompt(u.notification.enterNewLayerName, "", function(n) {
            if (n) if (g == n || c.getCurrentDrawing().hasLayer(n)) a.alert(u.notification.layerHasThatName);
            else {
              c.renameCurrentLayer(n);
              ya()
            }
          })
        });
        var Rb = -1,
          fc = false,
          mc = false,
          vc = function(g) {
            var n = a("#ruler_x");
            a("#sidepanels").width("+=" + g);
            a("#layerpanel").width("+=" + g);
            n.css("right", parseInt(n.css("right"), 10) + g);
            W.css("right", parseInt(W.css("right"), 10) + g);
            c.runExtensions("workareaResized")
          },
          wc = function(g) {
            if (mc) if (Rb != -1) {
              fc = true;
              g = Rb - g.pageX;
              var n = a("#sidepanels").width();
              if (n + g > 300) g = 300 - n;
              else if (n + g < 2) g = 2 - n;
              if (g != 0) {
                Rb -= g;
                vc(g)
              }
            }
          },
          nc = function(g) {
            var n = a("#sidepanels").width();
            vc((n > 2 || g ? 2 : 150) - n)
          };
        a("#sidepanel_handle").mousedown(function(g) {
          Rb = g.pageX;
          a(window).mousemove(wc);
          mc = false;
          setTimeout(function() {
            mc = true
          }, 20)
        }).mouseup(function() {
          fc || nc();
          Rb = -1;
          fc = false
        });
        a(window).mouseup(function() {
          Rb = -1;
          fc = false;
          a("#svg_editor").unbind("mousemove", wc)
        });
        ya();
        a(window).bind("load resize", function() {
          W.css("line-height", W.height() + "px")
        });
        a("#resolution").change(function() {
          var g = a("#canvas_width,#canvas_height");
          if (this.selectedIndex) if (this.value == "content") g.val("fit").attr("disabled", "disabled");
          else {
            var n = this.value.split("x");
            a("#canvas_width").val(n[0]);
            a("#canvas_height").val(n[1]);
            g.removeAttr("disabled")
          } else a("#canvas_width").val() == "fit" && g.removeAttr("disabled").val(100)
        });
        a("input,select").attr("autocomplete", "off");
        Jb = function() {
          var g = [{
              sel: "#tool_select",
              fn: Cb,
              evt: "click",
              key: ["V", true]
            }, {
              sel: "#tool_fhpath",
              fn: Wb,
              evt: "click",
              key: ["Q", true]
            }, {
              sel: "#tool_line",
              fn: Zb,
              evt: "click",
              key: ["L", true]
            }, {
              sel: "#tool_rect",
              fn: Ob,
              evt: "mouseup",
              key: ["R", true],
              parent: "#tools_rect",
              icon: "rect"
            }, {
              sel: "#tool_square",
              fn: wb,
              evt: "mouseup",
              parent: "#tools_rect",
              icon: "square"
            }, {
              sel: "#tool_fhrect",
              fn: hc,
              evt: "mouseup",
              parent: "#tools_rect",
              icon: "fh_rect"
            }, {
              sel: "#tool_ellipse",
              fn: ic,
              evt: "mouseup",
              key: ["E", true],
              parent: "#tools_ellipse",
              icon: "ellipse"
            }, {
              sel: "#tool_circle",
              fn: sb,
              evt: "mouseup",
              parent: "#tools_ellipse",
              icon: "circle"
            }, {
              sel: "#tool_fhellipse",
              fn: ac,
              evt: "mouseup",
              parent: "#tools_ellipse",
              icon: "fh_ellipse"
            }, {
              sel: "#tool_path",
              fn: f,
              evt: "click",
              key: ["P", true]
            }, {
              sel: "#tool_text",
              fn: b,
              evt: "click",
              key: ["T", true]
            }, {
              sel: "#tool_image",
              fn: $b,
              evt: "mouseup"
            }, {
              sel: "#tool_zoom",
              fn: xb,
              evt: "mouseup",
              key: ["Z", true]
            }, {
              sel: "#tool_clear",
              fn: Q,
              evt: "mouseup",
              key: ["N", true]
            }, {
              sel: "#tool_save",
              fn: function() {
                if (Xa) oc();
                else {
                  var G = {
                    images: a.pref("img_save"),
                    round_digits: 6
                  };
                  c.save(G)
                }
              },
              evt: "mouseup",
              key: ["S", true]
            }, {
              sel: "#tool_export",
              fn: oa,
              evt: "mouseup"
            }, {
              sel: "#tool_open",
              fn: za,
              evt: "mouseup",
              key: ["O", true]
            }, {
              sel: "#tool_import",
              fn: ca,
              evt: "mouseup"
            }, {
              sel: "#tool_source",
              fn: Kb,
              evt: "click",
              key: ["U", true]
            }, {
              sel: "#tool_wireframe",
              fn: Nb,
              evt: "click",
              key: ["F", true]
            }, {
              sel: "#tool_source_cancel,.overlay,#tool_docprops_cancel,#tool_prefs_cancel",
              fn: rc,
              evt: "click",
              key: ["esc", false, false],
              hidekey: true
            }, {
              sel: "#tool_source_save",
              fn: oc,
              evt: "click"
            }, {
              sel: "#tool_docprops_save",
              fn: yc,
              evt: "click"
            }, {
              sel: "#tool_docprops",
              fn: Gb,
              evt: "mouseup"
            }, {
              sel: "#tool_prefs_save",
              fn: zc,
              evt: "click"
            }, {
              sel: "#tool_prefs_option",
              fn: function() {
                xc();
                return false
              },
              evt: "mouseup"
            }, {
              sel: "#tool_delete,#tool_delete_multi",
              fn: e,
              evt: "click",
              key: ["del/backspace", true]
            }, {
              sel: "#tool_reorient",
              fn: K,
              evt: "click"
            }, {
              sel: "#tool_node_link",
              fn: S,
              evt: "click"
            }, {
              sel: "#tool_node_clone",
              fn: U,
              evt: "click"
            }, {
              sel: "#tool_node_delete",
              fn: X,
              evt: "click"
            }, {
              sel: "#tool_openclose_path",
              fn: R,
              evt: "click"
            }, {
              sel: "#tool_add_subpath",
              fn: da,
              evt: "click"
            }, {
              sel: "#tool_move_top",
              fn: p,
              evt: "click",
              key: "ctrl+shift+]"
            }, {
              sel: "#tool_move_bottom",
              fn: w,
              evt: "click",
              key: "ctrl+shift+["
            }, {
              sel: "#tool_topath",
              fn: I,
              evt: "click"
            }, {
              sel: "#tool_make_link,#tool_make_link_multi",
              fn: E,
              evt: "click"
            }, {
              sel: "#tool_undo",
              fn: ta,
              evt: "click",
              key: ["Z", true]
            }, {
              sel: "#tool_redo",
              fn: Aa,
              evt: "click",
              key: ["Y", true]
            }, {
              sel: "#tool_clone,#tool_clone_multi",
              fn: pb,
              evt: "click",
              key: ["D", true]
            }, {
              sel: "#tool_group_elements",
              fn: ab,
              evt: "click",
              key: ["G", true]
            }, {
              sel: "#tool_ungroup",
              fn: ab,
              evt: "click"
            }, {
              sel: "#tool_unlink_use",
              fn: ab,
              evt: "click"
            }, {
              sel: "[id^=tool_align]",
              fn: Fb,
              evt: "click"
            }, {
              sel: "#tool_bold",
              fn: aa,
              evt: "mousedown"
            }, {
              sel: "#tool_italic",
              fn: ga,
              evt: "mousedown"
            }, {
              sel: "#sidepanel_handle",
              fn: nc,
              key: ["X"]
            }, {
              sel: "#copy_save_done",
              fn: rc,
              evt: "click"
            }, {
              key: "ctrl+left",
              fn: function() {
                M(0, 1)
              }
            }, {
              key: "ctrl+right",
              fn: function() {
                M(1, 1)
              }
            }, {
              key: "ctrl+shift+left",
              fn: function() {
                M(0, 5)
              }
            }, {
              key: "ctrl+shift+right",
              fn: function() {
                M(1, 5)
              }
            }, {
              key: "shift+O",
              fn: J
            }, {
              key: "shift+P",
              fn: L
            }, {
              key: [cb + "up", true],
              fn: function() {
                Ma(2)
              }
            }, {
              key: [cb + "down", true],
              fn: function() {
                Ma(0.5)
              }
            }, {
              key: [cb + "]", true],
              fn: function() {
                C("Up")
              }
            }, {
              key: [cb + "[", true],
              fn: function() {
                C("Down")
              }
            }, {
              key: ["up", true],
              fn: function() {
                N(0, -1)
              }
            }, {
              key: ["down", true],
              fn: function() {
                N(0, 1)
              }
            }, {
              key: ["left", true],
              fn: function() {
                N(-1, 0)
              }
            }, {
              key: ["right", true],
              fn: function() {
                N(1, 0)
              }
            }, {
              key: "shift+up",
              fn: function() {
                N(0, -10)
              }
            }, {
              key: "shift+down",
              fn: function() {
                N(0, 10)
              }
            }, {
              key: "shift+left",
              fn: function() {
                N(-10, 0)
              }
            }, {
              key: "shift+right",
              fn: function() {
                N(10, 0)
              }
            }, {
              key: ["alt+up", true],
              fn: function() {
                c.cloneSelectedElements(0, -1)
              }
            }, {
              key: ["alt+down", true],
              fn: function() {
                c.cloneSelectedElements(0, 1)
              }
            }, {
              key: ["alt+left", true],
              fn: function() {
                c.cloneSelectedElements(-1, 0)
              }
            }, {
              key: ["alt+right", true],
              fn: function() {
                c.cloneSelectedElements(1, 0)
              }
            }, {
              key: ["alt+shift+up", true],
              fn: function() {
                c.cloneSelectedElements(0, -10)
              }
            }, {
              key: ["alt+shift+down", true],
              fn: function() {
                c.cloneSelectedElements(0, 10)
              }
            }, {
              key: ["alt+shift+left", true],
              fn: function() {
                c.cloneSelectedElements(-10, 0)
              }
            }, {
              key: ["alt+shift+right", true],
              fn: function() {
                c.cloneSelectedElements(10, 0)
              }
            }, {
              key: "A",
              fn: function() {
                c.selectAllInCurrentLayer()
              }
            }, {
              key: cb + "z",
              fn: ta
            }, {
              key: cb + "shift+z",
              fn: Aa
            }, {
              key: cb + "y",
              fn: Aa
            }, {
              key: cb + "x",
              fn: q
            }, {
              key: cb + "c",
              fn: k
            }, {
              key: cb + "v",
              fn: D
            }],
            n = {
              "4/Shift+4": "#tools_rect_show",
              "5/Shift+5": "#tools_ellipse_show"
            };
          return {
            setAll: function() {
              var G = {};
              a.each(g, function(H, P) {
                var T;
                if (P.sel) {
                  T = a(P.sel);
                  if (T.length == 0) return true;
                  if (P.evt) {
                    if (svgedit.browser.isTouch() && P.evt === "click") P.evt = "mousedown";
                    T[P.evt](P.fn)
                  }
                  if (P.parent && a(P.parent + "_show").length != 0) {
                    var Y = a(P.parent);
                    Y.length || (Y = Db(P.parent.substr(1)));
                    Y.append(T);
                    a.isArray(G[P.parent]) || (G[P.parent] = []);
                    G[P.parent].push(P)
                  }
                }
                if (P.key) {
                  var fa = P.fn,
                    ja = false;
                  if (a.isArray(P.key)) {
                    Y = P.key[0];
                    if (P.key.length > 1) ja = P.key[1]
                  } else Y = P.key;
                  Y += "";
                  a.each(Y.split("/"), function(ha, ma) {
                    a(document).bind("keydown", ma, function(sa) {
                      fa();
                      ja && sa.preventDefault();
                      return false
                    })
                  });
                  if (P.sel && !P.hidekey && T.attr("title")) {
                    var la = T.attr("title").split("[")[0] + " (" + Y + ")";
                    n[Y] = P.sel;
                    T.parents("#main_menu").length || T.attr("title", la)
                  }
                }
              });
              ra(G);
              a(".attr_changer, #image_url").bind("keydown", "return", function(H) {
                a(this).change();
                H.preventDefault()
              });
              a(window).bind("keydown", "tab", function(H) {
                if (rb === "canvas") {
                  H.preventDefault();
                  L()
                }
              }).bind("keydown", "shift+tab", function(H) {
                if (rb === "canvas") {
                  H.preventDefault();
                  J()
                }
              });
              a("#tool_zoom").dblclick(Vb)
            },
            setTitles: function() {
              a.each(n, function(G, H) {
                var P = a(H).parents("#main_menu").length;
                a(H).each(function() {
                  var T;
                  T = P ? a(this).text().split(" [")[0] : this.title.split(" [")[0];
                  var Y = "";
                  a.each(G.split("/"), function(fa, ja) {
                    var la = ja.split("+"),
                      ha = "";
                    if (la.length > 1) {
                      ha = la[0] + "+";
                      ja = la[1]
                    }
                    Y += (fa ? "/" : "") + ha + (u["key_" + ja] || ja)
                  });
                  if (P) this.lastChild.textContent = T + " [" + Y + "]";
                  else this.title = T + " [" + Y + "]"
                })
              })
            },
            getButtonData: function(G) {
              var H;
              a.each(g, function(P, T) {
                if (T.sel === G) H = T
              });
              return H
            }
          }
        }();
        Jb.setAll();
        j.ready(function() {
          var g = A.initTool,
            n = a("#tools_left, #svg_editor .tools_flyout"),
            G = n.find("#tool_" + g);
          g = n.find("#" + g);
          (G.length ? G : g.length ? g : a("#tool_select")).click().mouseup();
          A.wireframe && a("#tool_wireframe").click();
          A.showlayers && nc();
          a("#rulers").toggle( !! A.showRulers);
          if (A.showRulers) a("#show_rulers")[0].checked = true;
          A.baseUnit && a("#base_unit").val(A.baseUnit);
          if (A.gridSnapping) a("#grid_snapping_on")[0].checked = true;
          A.snappingStep && a("#grid_snapping_step").val(A.snappingStep);
          A.gridColor && a("#grid_color").val(A.gridColor)
        });
        a("#rect_rx").SpinButton({
          min: 0,
          max: 1E3,
          callback: function(g) {
            c.setRectRadius(g.value)
          }
        });
        a("#stroke_width").SpinButton({
          min: 0,
          max: 99,
          smallStep: 0.1,
          callback: function(g) {
            var n = g.value;
            if (n == 0 && na && ["line", "polyline"].indexOf(na.nodeName) >= 0) n = g.value = 1;
            c.setStrokeWidth(n)
          }
        });
        a("#angle").SpinButton({
          min: -180,
          max: 180,
          step: 5,
          callback: function(g) {
            c.setRotationAngle(g.value);
            a("#tool_reorient").toggleClass("disabled", parseInt(g.value, 10) === 0)
          }
        });
        a("#font_size").SpinButton({
          min: 0.001,
          stepfunc: function(g, n) {
            var G = Number(g.value),
              H = G + n,
              P = H >= G;
            if (n === 0) return G;
            if (G >= 24) {
              if (P) return Math.round(G * 1.1);
              return Math.round(G / 1.1)
            }
            if (G <= 1) {
              if (P) return G * 2;
              return G / 2
            }
            return H
          },
          callback: function(g) {
            c.setFontSize(g.value)
          }
        });
        a("#group_opacity").SpinButton({
          min: 0,
          max: 100,
          step: 5,
          callback: vb
        });
        a("#blur").SpinButton({
          min: 0,
          max: 10,
          step: 0.1,
          callback: Pb
        });
        a("#zoom").SpinButton({
          min: 0.001,
          max: 1E4,
          step: 50,
          stepfunc: function(g, n) {
            var G = Number(g.value);
            if (G === 0) return 100;
            var H = G + n;
            if (n === 0) return G;
            if (G >= 100) return H;
            if (H >= G) return G * 2;
            return G / 2
          },
          callback: bb
        }).val(c.getZoom() * 100);
        a("#workarea").contextMenu({
          menu: "cmenu_canvas",
          inSpeed: 0
        }, function(g) {
          switch (g) {
            case "delete":
              e();
              break;
            case "cut":
              q();
              break;
            case "copy":
              k();
              break;
            case "paste":
              c.pasteElements();
              break;
            case "paste_in_place":
              c.pasteElements("in_place");
              break;
            case "group":
            case "group_elements":
              c.groupSelectedElements();
              break;
            case "ungroup":
              c.ungroupSelectedElement();
              break;
            case "move_front":
              p();
              break;
            case "move_up":
              C("Up");
              break;
            case "move_down":
              C("Down");
              break;
            case "move_back":
              w();
              break;
            default:
              svgedit.contextmenu && svgedit.contextmenu.hasCustomHandler(g) && svgedit.contextmenu.getCustomHandler(g).call()
          }
          c.clipBoard.length && pa.enableContextMenuItems("#paste,#paste_in_place")
        });
        ua = function(g) {
          switch (g) {
            case "dupe":
              ba();
              break;
            case "delete":
              ea();
              break;
            case "merge_down":
              if (a("#layerlist tr.layersel").index() != c.getCurrentDrawing().getNumLayers() - 1) {
                c.mergeLayer();
                Ta();
                ya()
              }
              break;
            case "merge_all":
              c.mergeAllLayers();
              Ta();
              ya()
          }
        };
        a("#layerlist").contextMenu({
          menu: "cmenu_layers",
          inSpeed: 0
        }, ua);
        a("#layer_moreopts").contextMenu({
          menu: "cmenu_layers",
          inSpeed: 0,
          allowLeft: true
        }, ua);
        a(".contextMenu li").mousedown(function(g) {
          g.preventDefault()
        });
        a("#cmenu_canvas li").disableContextMenu();
        pa.enableContextMenuItems("#delete,#cut,#copy");
        window.addEventListener("beforeunload", function(g) {
          if (ib.getUndoStackSize() === 0) j.showSaveWarning = false;
          if (!A.no_save_warning && j.showSaveWarning) return g.returnValue = u.notification.unsavedChanges
        }, false);
        j.openPrep = function(g) {
          a("#main_menu").hide();
          ib.getUndoStackSize() === 0 ? g(true) : a.confirm(u.notification.QwantToOpen, g)
        };
        if (window.FileReader) {
          ua = function(g) {
            a.process_cancel(u.notification.loadingImage);
            g.stopPropagation();
            g.preventDefault();
            a("#workarea").removeAttr("style");
            a("#main_menu").hide();
            if (g = g.type == "drop" ? g.dataTransfer.files[0] : this.files[0]) {
              if (g.type.indexOf("image") != -1) {
                var n;
                if (g.type.indexOf("svg") != -1) {
                  n = new FileReader;
                  n.onloadend = function(G) {
                    c.importSvgString(G.target.result, true);
                    c.ungroupSelectedElement();
                    c.ungroupSelectedElement();
                    c.groupSelectedElements();
                    c.alignSelectedElements("m", "page");
                    c.alignSelectedElements("c", "page");
                    a("#dialog_box").hide()
                  };
                  n.readAsText(g)
                } else {
                  n = new FileReader;
                  n.onloadend = function(G) {
                    var H = 100,
                      P = 100,
                      T = new Image;
                    T.src = G.target.result;
                    T.style.opacity = 0;
                    T.onload = function() {
                      H = T.offsetWidth;
                      P = T.offsetHeight;
                      var Y = c.addSvgElementFromJson({
                        element: "image",
                        attr: {
                          x: 0,
                          y: 0,
                          width: H,
                          height: P,
                          id: c.getNextId(),
                          style: "pointer-events:inherit"
                        }
                      });
                      c.setHref(Y, G.target.result);
                      c.selectOnly([Y]);
                      c.alignSelectedElements("m", "page");
                      c.alignSelectedElements("c", "page");
                      Ta();
                      a("#dialog_box").hide()
                    }
                  };
                  n.readAsDataURL(g)
                }
              }
            } else a("#dialog_box").hide()
          };
          W[0].addEventListener("dragenter", Pa, false);
          W[0].addEventListener("dragover", Ca, false);
          W[0].addEventListener("dragleave", eb, false);
          W[0].addEventListener("drop", ua, false);
          ec = a('<input type="file">').change(function() {
            var g = this;
            j.openPrep(function(n) {
              if (n) {
                c.clear();
                if (g.files.length === 1) {
                  a.process_cancel(u.notification.loadingImage);
                  n = new FileReader;
                  n.onloadend = function(G) {
                    t(G.target.result);
                    Ya()
                  };
                  n.readAsText(g.files[0])
                }
              }
            })
          });
          a("#tool_open").show().prepend(ec);
          ua = a('<input type="file">').change(ua);
          a("#tool_import").show().prepend(ua)
        }
        Ya(true);
        a(function() {
          window.svgCanvas = c;
          c.ready = j.ready
        });
        j.setLang = function(g, n) {
          j.langChanged = true;
          a.pref("lang", g);
          a("#lang_select").val(g);
          if (n) {
            var G = a("#layerlist tr.layersel td.layername").text() == u.common.layer + " 1";
            a.extend(u, n);
            c.setUiStrings(n);
            Jb.setTitles();
            if (G) {
              c.renameCurrentLayer(u.common.layer + " 1");
              ya()
            }
            if (xa.length) for (; xa.length;) xa.shift().langReady({
              lang: g,
              uiStrings: u
            });
            else c.runExtensions("langReady", {
              lang: g,
              uiStrings: u
            });
            c.runExtensions("langChanged", g);
            Ha();
            a.each({
              "#stroke_color": "#tool_stroke .icon_label, #tool_stroke .color_block",
              "#fill_color": "#tool_fill label, #tool_fill .color_block",
              "#linejoin_miter": "#cur_linejoin",
              "#linecap_butt": "#cur_linecap"
            }, function(H, P) {
              a(P).attr("title", a(H)[0].title)
            });
            a("#multiselected_panel div[id^=tool_align]").each(function() {
              a("#tool_pos" + this.id.substr(10))[0].title = this.title
            })
          }
        }
      };
      j.ready = function(v) {
        h ? v() : z.push(v)
      };
      j.runCallbacks = function() {
        a.each(z, function() {
          this()
        });
        h = true
      };
      j.loadFromString = function(v) {
        j.ready(function() {
          t(v)
        })
      };
      j.disableUI = function() {};
      j.loadFromURL = function(v, r) {
        r || (r = {});
        var O = r.cache,
          Z = r.callback;
        j.ready(function() {
          a.ajax({
            url: v,
            dataType: "text",
            cache: !! O,
            beforeSend: function() {
              a.process_cancel(u.notification.loadingImage)
            },
            success: function(ka) {
              t(ka, Z)
            },
            error: function(ka, ea, ba) {
              ka.status != 404 && ka.responseText ? t(ka.responseText, Z) : a.alert(u.notification.URLloadFail + ": \n" + ba, Z)
            },
            complete: function() {
              a("#dialog_box").hide()
            }
          })
        })
      };
      j.loadFromDataURI = function(v) {
        j.ready(function() {
          var r = false,
            O = v.match(/^data:image\/svg\+xml;base64,/);
          if (O) r = true;
          else O = v.match(/^data:image\/svg\+xml(?:;(?:utf8)?)?,/);
          if (O) O = O[0];
          O = v.slice(O.length);
          t(r ? l.decode64(O) : decodeURIComponent(O))
        })
      };
      j.addExtension = function() {
        var v = arguments;
        a(function() {
          c && c.addExtension.apply(this, v)
        })
      };
      return j
    }(jQuery);
    $(svgEditor.init)
  }
})();
var svgEditor = function(a, t) {
  function j(d, l, h) {
    var o, m, z, s, F, A = a("#svg_editor").parent();
    for (m in l) {
      (z = l[m]) || console.log(m);
      if (h) m = "#" + m;
      o = A.find(m);
      if (o.length) {
        s = A.find(m)[0];
        switch (d) {
          case "content":
            for (o = 0; o < s.childNodes.length; o++) {
              F = s.childNodes[o];
              if (F.nodeType === 3 && F.textContent.replace(/\s/g, "")) {
                F.textContent = z;
                break
              }
            }
            break;
          case "title":
            s.title = z
        }
      } else console.log("Missing: " + m)
    }
  }
  var c;
  t.readLang = function(d) {
    var l = t.canvas.runExtensions("addlangData", c, true);
    a.each(l, function(B, u) {
      if (u.data) d = a.merge(d, u.data)
    });
    if (d.tools) {
      var h = d.tools;
      l = d.properties;
      var o = d.config,
        m = d.layers,
        z = d.common,
        s = d.ui;
      j("content", {
        curve_segments: l.curve_segments,
        fitToContent: h.fitToContent,
        fit_to_all: h.fit_to_all,
        fit_to_canvas: h.fit_to_canvas,
        fit_to_layer_content: h.fit_to_layer_content,
        fit_to_sel: h.fit_to_sel,
        icon_large: o.icon_large,
        icon_medium: o.icon_medium,
        icon_small: o.icon_small,
        icon_xlarge: o.icon_xlarge,
        image_opt_embed: o.image_opt_embed,
        image_opt_ref: o.image_opt_ref,
        includedImages: o.included_images,
        largest_object: h.largest_object,
        layersLabel: m.layers,
        page: h.page,
        relativeToLabel: h.relativeTo,
        selLayerLabel: m.move_elems_to,
        selectedPredefined: o.select_predefined,
        selected_objects: h.selected_objects,
        smallest_object: h.smallest_object,
        straight_segments: l.straight_segments,
        svginfo_bg_url: o.editor_img_url + ":",
        svginfo_bg_note: o.editor_bg_note,
        svginfo_change_background: o.background,
        svginfo_dim: o.doc_dims,
        svginfo_editor_prefs: o.editor_prefs,
        svginfo_height: z.height,
        svginfo_icons: o.icon_size,
        svginfo_image_props: o.image_props,
        svginfo_lang: o.language,
        svginfo_title: o.doc_title,
        svginfo_width: z.width,
        tool_docprops_cancel: z.cancel,
        tool_docprops_save: z.ok,
        tool_source_cancel: z.cancel,
        tool_source_save: z.ok,
        tool_prefs_cancel: z.cancel,
        tool_prefs_save: z.ok,
        sidepanel_handle: m.layers.split("").join(" "),
        tool_clear: h.new_doc,
        tool_docprops: h.docprops,
        tool_export: h.export_img,
        tool_import: h.import_doc,
        tool_imagelib: h.imagelib,
        tool_open: h.open_doc,
        tool_save: h.save_doc,
        svginfo_units_rulers: o.units_and_rulers,
        svginfo_rulers_onoff: o.show_rulers,
        svginfo_unit: o.base_unit,
        svginfo_grid_settings: o.grid,
        svginfo_snap_onoff: o.snapping_onoff,
        svginfo_snap_step: o.snapping_stepsize,
        svginfo_grid_color: o.grid_color
      }, true);
      var F, A = {};
      for (F in d.shape_cats) A['#shape_cats [data-cat="' + F + '"]'] = d.shape_cats[F];
      setTimeout(function() {
        j("content", A)
      }, 2E3);
      var i = {};
      a.each(["cut", "copy", "paste", "paste_in_place", "delete", "group", "ungroup", "move_front", "move_up", "move_down", "move_back"], function() {
        i['#cmenu_canvas a[href="#' + this + '"]'] = h[this]
      });
      a.each(["dupe", "merge_down", "merge_all"], function() {
        i['#cmenu_layers a[href="#' + this + '"]'] = m[this]
      });
      i['#cmenu_layers a[href="#delete"]'] = m.del;
      j("content", i);
      j("title", {
        align_relative_to: h.align_relative_to,
        circle_cx: l.circle_cx,
        circle_cy: l.circle_cy,
        circle_r: l.circle_r,
        cornerRadiusLabel: l.corner_radius,
        ellipse_cx: l.ellipse_cx,
        ellipse_cy: l.ellipse_cy,
        ellipse_rx: l.ellipse_rx,
        ellipse_ry: l.ellipse_ry,
        fill_color: l.fill_color,
        font_family: l.font_family,
        idLabel: l.id,
        image_height: l.image_height,
        image_url: l.image_url,
        image_width: l.image_width,
        layer_delete: m.del,
        layer_down: m.move_down,
        layer_new: m["new"],
        layer_rename: m.rename,
        layer_moreopts: z.more_opts,
        layer_up: m.move_up,
        line_x1: l.line_x1,
        line_x2: l.line_x2,
        line_y1: l.line_y1,
        line_y2: l.line_y2,
        linecap_butt: l.linecap_butt,
        linecap_round: l.linecap_round,
        linecap_square: l.linecap_square,
        linejoin_bevel: l.linejoin_bevel,
        linejoin_miter: l.linejoin_miter,
        linejoin_round: l.linejoin_round,
        main_icon: h.main_menu,
        mode_connect: h.mode_connect,
        tools_shapelib_show: h.mode_shapelib,
        palette: s.palette_info,
        zoom_panel: s.zoom_level,
        path_node_x: l.node_x,
        path_node_y: l.node_y,
        rect_height_tool: l.rect_height,
        rect_width_tool: l.rect_width,
        seg_type: l.seg_type,
        selLayerNames: m.move_selected,
        selected_x: l.pos_x,
        selected_y: l.pos_y,
        stroke_color: l.stroke_color,
        stroke_style: l.stroke_style,
        stroke_width: l.stroke_width,
        svginfo_title: o.doc_title,
        text: l.text_contents,
        toggle_stroke_tools: s.toggle_stroke_tools,
        tool_add_subpath: h.add_subpath,
        tool_alignbottom: h.align_bottom,
        tool_aligncenter: h.align_center,
        tool_alignleft: h.align_left,
        tool_alignmiddle: h.align_middle,
        tool_alignright: h.align_right,
        tool_aligntop: h.align_top,
        tool_angle: l.angle,
        tool_blur: l.blur,
        tool_bold: l.bold,
        tool_circle: h.mode_circle,
        tool_clone: h.clone,
        tool_clone_multi: h.clone,
        tool_delete: h.del,
        tool_delete_multi: h.del,
        tool_ellipse: h.mode_ellipse,
        tool_eyedropper: h.mode_eyedropper,
        tool_fhellipse: h.mode_fhellipse,
        tool_fhpath: h.mode_fhpath,
        tool_fhrect: h.mode_fhrect,
        tool_font_size: l.font_size,
        tool_group_elements: h.group_elements,
        tool_make_link: h.make_link,
        tool_link_url: h.set_link_url,
        tool_image: h.mode_image,
        tool_italic: l.italic,
        tool_line: h.mode_line,
        tool_move_bottom: h.move_bottom,
        tool_move_top: h.move_top,
        tool_node_clone: h.node_clone,
        tool_node_delete: h.node_delete,
        tool_node_link: h.node_link,
        tool_opacity: l.opacity,
        tool_openclose_path: h.openclose_path,
        tool_path: h.mode_path,
        tool_position: h.align_to_page,
        tool_rect: h.mode_rect,
        tool_redo: h.redo,
        tool_reorient: h.reorient_path,
        tool_select: h.mode_select,
        tool_source: h.source_save,
        tool_square: h.mode_square,
        tool_text: h.mode_text,
        tool_topath: h.to_path,
        tool_undo: h.undo,
        tool_ungroup: h.ungroup,
        tool_wireframe: h.wireframe_mode,
        view_grid: h.toggle_grid,
        tool_zoom: h.mode_zoom,
        url_notice: h.no_embed
      }, true);
      t.setLang(c, d)
    }
  };
  t.putLocale = function(d, l) {
    if (d) c = d;
    else {
      c = a.pref("lang");
      if (!c) {
        if (navigator.userLanguage) c = navigator.userLanguage;
        else if (navigator.language) c = navigator.language;
        if (c == null) return
      }
      console.log("Lang: " + c);
      if (a.inArray(c, l) === -1 && c !== "test") c = "en"
    }
    var h = t.curConfig.langPath + "lang." + c + ".js";
    a.getScript(h, function(o) {
      if (!o) {
        o = document.createElement("script");
        o.src = h;
        document.querySelector("head").appendChild(o)
      }
    })
  };
  return t
}(jQuery, svgEditor);
svgedit = svgedit || {};
(function() {
  var a = this;
  if (!svgedit.contextmenu) svgedit.contextmenu = {};
  a.contextMenuExtensions = {};
  svgEditor.ready(function() {
    for (var t in contextMenuExtensions) {
      var j = contextMenuExtensions[t];
      Object.keys(a.contextMenuExtensions).length === 0 && $("#cmenu_canvas").append("<li class='separator'>");
      var c = j.shortcut || "";
      $("#cmenu_canvas").append("<li class='disabled'><a href='#" + j.id + "'>" + j.label + "<span class='shortcut'>" + c + "</span></a></li>")
    }
  });
  svgedit.contextmenu.resetCustomMenus = function() {
    a.contextMenuExtensions = {}
  };
  svgedit.contextmenu.add = function(t) {
    if (t && t.id && t.label && t.action && typeof t.action == "function") if (t.id in a.contextMenuExtensions) console.error('Cannot add extension "' + t.id + '", an extension by that name already exists"');
    else {
      console.log("Registed contextmenu item: {id:" + t.id + ", label:" + t.label + "}");
      a.contextMenuExtensions[t.id] = t
    } else console.error("Menu items must be defined and have at least properties: id, label, action, where action must be a function")
  };
  svgedit.contextmenu.hasCustomHandler = function(t) {
    return a.contextMenuExtensions[t] && true
  };
  svgedit.contextmenu.getCustomHandler = function(t) {
    return a.contextMenuExtensions[t].action
  }
})();
