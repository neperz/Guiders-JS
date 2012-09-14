var DIALOG_SHOWN_CLASS = "dialog-shown",
    DISABLED_CLASS = "disabled",
    ERROR_CLASS = "error",
    EXPANDED_CLASS = "expanded",
    MENU_OVERLAY_CLASS = "menu-overlay",
    ORIGINAL_CLASS = "original",
    SELECTED_CLASS = "selected",
    SHOW_CLASS = "show",
    SUCCESS_CLASS = "success",
    UI_EFFECT_DURATION = 300,
    UI_EFFECT_DURATION_LONG = 800,
    UI_EFFECT_DURATION_SHORT = 100,
    UI_EFFECT_EASING_IN = "easeInExpo",
    UI_EFFECT_EASING_OUT = "easeOutExpo",
    fadingHtmlChange = function (a, b, c, d) {
        a.is(":animated") ? a.data("fadingHtmlChangeNewHtml", b) : a.html() !== b && (c = c || UI_EFFECT_DURATION,
        a.fadeOut(c, UI_EFFECT_EASING_OUT, function () {
            var e = a.data("fadingHtmlChangeNewHtml") || b;
            a.html(e).fadeIn(c, UI_EFFECT_EASING_OUT, d);
            a.removeData("fadingHtmlChangeNewHtml")
        }))
    }, getElementMidpoint = function (a) {
        var b = a.offset();
        return {
            x: b.left + Math.floor(a[0].offsetWidth / 2),
            y: b.top + Math.floor(a[0].offsetHeight / 2)
        }
    }, tempFadingHtmlChange = function (a, b, c, d, e) {
        var c = c || 3E3,
            f = a.data("tempFadingHtmlChangeTimeoutId"),
            g = a.data("tempFadingHtmlChangeOriginalHtml") || a.html();
        f && clearTimeout(f);
        fadingHtmlChange(a, b,
        d);
        f = setTimeout(function () {
            var b = a.data("tempFadingHtmlChangeOriginalHtml");
            b && (fadingHtmlChange(a, b, d, e), a.removeData("tempFadingHtmlChangeOriginalHtml"), a.removeData("tempFadingHtmlChangeTimeoutId"))
        }, c);
        a.data("tempFadingHtmlChangeOriginalHtml", g);
        a.data("tempFadingHtmlChangeTimeoutId", f)
    };

var optly = { Cleanse: {} };
optly.guider = {};
var guider = function () {
    var a = {
        _defaultSettings: {
            attachTo: null,
            buttons: [],
            buttonCustomHTML: "",
            description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            overlay: false,
            position: 0,
            title: "Sample title goes here",
            width: 400
        },
        _htmlSkeleton: "<div class='guider'> <div class='guider_content'> <h1 class='guider_title'></h1> <p class='guider_description'></p> <div class='guider_buttons'> </div> </div> <div class='guider_arrow'> </div></div>",
        _arrowSize: 42,
        _guiders: {},
        _currentGuiderID: null,
        _lastCreatedGuiderID: null,
        _addButtons: function (b) {
            for (var c = b.buttons.length - 1; 0 <= c; c--) {
                var d = b.buttons[c],
                    e = "<a class='guider_button";
                "undefined" !== typeof d.classString && null !== d.classString && (e = e + " " + d.classString);
                e = e + "'>" + d.name + "</a>";
                e = $(e);
                b.elem.find(".guider_buttons").append(e);
                if (d.onclick) {
                    e.on("click", d.onclick);
                } else if (!d.onclick && "close" === d.name.toLowerCase()) {
                    e.on("click", function () {
                        a.hideAll();
                    });
                } else if (!d.onclick && "next" === d.name.toLowerCase()) {
                    e.on("click", function () {
                        a.next();
                    });
                }
            }
            "" !== b.buttonCustomHTML && (c = $(b.buttonCustomHTML), b.elem.find(".guider_buttons").append(c));
        },
        _attach: function (b) {
            if (!("undefined" === typeof b.attachTo || null === b)) {
                var c = b.elem.innerHeight(),
                    d = b.elem.innerWidth();
                b.attachToElem = $(b.attachTo);
                if (0 === b.attachToElem.length || 0 === b.position) {
                    b.elem.css("position", "absolute"), b.elem.css("top", ($(window).height() - c) / 3.2 + $(window).scrollTop() + "px"), b.elem.css("left", ($(window).width() - d) / 2 + $(window).scrollLeft() + "px");
                } else {
                    var e = b.attachToElem.offset(),
                        g = b.attachToElem.innerHeight(),
                        i = b.attachToElem.innerWidth(),
                        h = e.top,
                        e = e.left,
                        j = 0.9 * a._arrowSize;
                    offset = {
                        1: [-j - c, i - d],
                        2: [0, j + i],
                        3: [g / 2 - c / 2, j + i],
                        4: [g - c, j + i],
                        5: [j + g, i - d],
                        6: [j + g, i / 2 - d / 2],
                        7: [j + g, 0],
                        8: [g - c, -d - j],
                        9: [g / 2 - c / 2, -d - j],
                        10: [0, -d - j],
                        11: [-j - c, 0],
                        12: [-j - c, i / 2 - d / 2]
                    }[b.position];
                    h += offset[0];
                    e += offset[1];
                    b.elem.css({
                        position: "absolute",
                        top: h,
                        left: e
                    });
                }
            }
        },
        _guiderById: function (b) {
            if ("undefined" === typeof a._guiders[b]) {
                throw "Cannot find guider with id " + b;
            }
            return a._guiders[b];
        },
        _showOverlay: function () {
            $("#guider_overlay").fadeIn(UI_EFFECT_DURATION);
        },
        _hideOverlay: function () {
            $("#guider_overlay").fadeOut(UI_EFFECT_DURATION);
        },
        _initializeOverlay: function () {
            0 === $("#guider_overlay").length && $("<div id=\"guider_overlay\"></div>").hide().appendTo("body");
        },
        _styleArrow: function (b) {
            var c = b.position || 0;
            if (c) {
                var d = $(b.elem.find(".guider_arrow"));
                d.addClass({
                    1: "guider_arrow_down",
                    2: "guider_arrow_left",
                    3: "guider_arrow_left",
                    4: "guider_arrow_left",
                    5: "guider_arrow_up",
                    6: "guider_arrow_up",
                    7: "guider_arrow_up",
                    8: "guider_arrow_right",
                    9: "guider_arrow_right",
                    10: "guider_arrow_right",
                    11: "guider_arrow_down",
                    12: "guider_arrow_down"
                }[c]);
                var c = b.elem.innerHeight(),
                    e = b.elem.innerWidth(),
                    g = a._arrowSize / 2,
                    c = {
                        1: ["right", g],
                        2: ["top", g],
                        3: ["top", c / 2 - g],
                        4: ["bottom", g],
                        5: ["right", g],
                        6: ["left", e / 2 - g],
                        7: ["left", g],
                        8: ["bottom", g],
                        9: ["top", c / 2 - g],
                        10: ["top", g],
                        11: ["left", g],
                        12: ["left", e / 2 - g]
                    }[b.position];
                d.css(c[0], c[1] + "px");
            }
        },
        next: function () {
            var b = a._guiders[a._currentGuiderID];
            if ("undefined" !== typeof b && (b = b.next || null, null !== b && "" !== b)) {
                var c = a._guiderById(b).overlay ? true : false;
                a.hideAll(c);
                a.show(b);
            }
        },
        createGuider: function (b) {
            "object" !== $.type(b) && (b = {});
            myGuider = $.extend(true, {}, a._defaultSettings, b);
            myGuider.id = myGuider.id || String(Math.floor(1000 * Math.random()));
            b = $(a._htmlSkeleton);
            myGuider.elem = b;
            myGuider.elem.css("width", myGuider.width + "px");
            b.find("h1.guider_title").html(myGuider.title);
            b.find("p.guider_description").html(myGuider.description);
            a._addButtons(myGuider);
            b.hide();
            b.appendTo("body");
            "undefined" !== typeof myGuider.attachTo && null !== myGuider && (a._attach(myGuider), a._styleArrow(myGuider));
            a._initializeOverlay();
            a._guiders[myGuider.id] = myGuider;
            a._lastCreatedGuiderID = myGuider.id;
            return a;
        },
        hideAll: function (b) {
            $(".guider").fadeOut("fast");
            "undefined" !== typeof b && true === b || a._hideOverlay();
            return a;
        },
        show: function (b) {
            !b && a._lastCreatedGuiderID && (b = a._lastCreatedGuiderID);
            var c = a._guiderById(b);
            c.overlay && a._showOverlay();
            a._attach(c);
            c.elem.fadeIn("fast");
            a._currentGuiderID = b;
            return a;
        }
    };
    return a;
} .call(this);