(function (i) {
    if (!("console"in i))i.console = {error: function () {
    }, warn: function () {
    }, log: function () {
    }}
})(window);
(function (i, l, Ja) {
    function G() {
        var b = "", j = i.location.host.split(".");
        2 < j.length && (b = j[0]);
        return b
    }

    function H() {
        var b = i.location.pathname;
        0 != b.indexOf("/") && (b = "/" + b);
        return b
    }

    function na() {
        var b = "http";
        "https:" == i.location.protocol && (b += "s");
        return b
    }

    function Ka() {
        var b = "ws";
        "https:" == i.location.protocol && (b += "s");
        return b
    }

    var u = "battleship-game.org", La = G(), O = function () {
        var b = G(), j = l.documentElement.getAttribute("lang");
        2 == b.length ? j = b : "https:" == i.location.protocol && (b = H().split("/"), 2 <= b.length &&
            2 == b[1].length && (j = b[1]));
        return j
    }(), Ma = "/services/";
    if (i.MozWebSocket)i.WebSocket = i.MozWebSocket;
    var A = !!("WebSocket"in i && 2 == WebSocket.CLOSING), j = {reachGoal: function (b, i) {
        try {
            yaCounter20587900.reachGoal(b, i)
        } catch (j) {
        }
    }};
    jQuery(function (b) {
        var G, oa, aa, P, Q, R;

        function pa() {
            var a, c = [], g = [];
            r = [];
            S.find(".battlefield-table-placeholder").html("");
            for (var d = 0; d < Q; d++, g = []) {
                B[d] = [];
                ba[d] = [];
                w[d] = [];
                for (var e = 0; e < R; e++)a = "&#160;", 0 === e && (a += '<div class="marker marker__row">' + (d + 1) + "</div>"), 0 === d && (a +=
                    '<div class="marker marker__col">' + Na[e] + "</div>"), g.push('<td class="battlefield-cell battlefield-cell__empty"><div class="battlefield-cell-content" data-y="' + d + '" data-x="' + e + '" >' + a + "</div></td>"), B[d][e] = aa, ba[d][e] = n.INITIALIZED, w[d][e] = n.INITIALIZED;
                c.push('<tr class="battlefield-row">' + g.join("") + "</tr>")
            }
            a = b('<table class="battlefield-table">' + c.join("") + "</table>");
            S.find(".battlefield-table-placeholder").append(a)
        }

        function qa(a) {
            for (var c = [], b = 0; b < r.length; b++)if (r[b].id != a)c.push(r[b]);
            else for (var d = r[b].coords, e = 0, f; e < d.length; e++)f = d[e], B[f.y][f.x] = aa;
            r = c
        }

        function v(a, c, b, d, e, f, k) {
            for (var d = "h" == d ? "h" : "v", I, i = 0, k = k || Oa, h = {id: f || ca(), state: oa, y: a, x: c, len: b, pos: d, coords: []}, m = 0; m < b; m++)"h" == d ? (f = a, I = c + m) : (f = a + m, I = c), e && k(f, I) && i++, e || (B[f][I] = P, h.coords.push({y: f, x: I, state: G}));
            if (!e)return r.push(h), h.id;
            if (e)return i === b
        }

        function da(a) {
            var a = parseInt(a, 10), c = T(0, Q - 1), b = T(0, R - 1), d = 0 === T(0, 1) ? "h" : "v";
            v(c, b, a, d, !0) ? (v(c, b, a, d), C.length && da(C.shift())) : da(a)
        }

        function ea() {
            C = [];
            for (var a =
                0; a < s.length; a++)for (var c = s[a], b = 0; b < c.count; b++)C.push(c.size);
            C.length && da(C.shift())
        }

        function fa(a, c) {
            return 0 <= a && a < Q && 0 <= c && c < R ? !0 : !1
        }

        function Oa(a, c) {
            var b;
            if (b = fa(a, c))if (b = fa(a, c) && !!B[a][c] != P) {
                var d;
                a:{
                    var e;
                    for (d in D)if (b = a + D[d][0], e = c + D[d][1], fa(b, e) && !!B[b][e] == P) {
                        d = !0;
                        break a
                    }
                    d = !1
                }
                b = !d
            }
            return b
        }

        function sa(a, c, b, d) {
            if (ta(E.shoothint)) {
                a = b.find("tr:nth-child(" + (a + 1) + ") td:nth-child(" + (c + 1) + ")");
                return a.length && a.is(".battlefield-cell__empty") ? (a.removeClass("battlefield-cell__empty").addClass("battlefield-cell__miss"),
                    d && a.addClass("battlefield-cell__miss__auto"), a.find(".battlefield-cell-content").unbind("click", ga), !0) : !1
            }
        }

        function ua(a, c, g) {
            var d = 1, e = a, f = 0, k = a - 1;
            "h" == c && (d = a, e = 1, f = a - 1, k = 0);
            return b('<div data-id="' + (g || "") + '" data-length="' + a + '" data-position="' + c + '" class="ship-box ship-box__' + c + '" style="width: ' + 2 * d + "em; height: " + 2 * e + "em; padding-right: " + f + "px; padding-bottom: " + k + 'px;" />')
        }

        function va(a, c, b, d, e, f) {
            b = ua(b, d, f);
            e.find("tr:nth-child(" + (a + 1) + ") td:nth-child(" + (c + 1) + ")").find(".battlefield-cell-content").append(b);
            return b
        }

        function wa(a) {
            var c, b, d = [], e;
            for (e in a) {
                c = a[e];
                b = c.coords;
                c = [];
                for (var f = 0; f < b.length; f++)c.push({y: b[f].y, x: b[f].x});
                d.push(c)
            }
            return d
        }

        function xa(a) {
            var c = RegExp("^" + U + "[a-zA-Z0-9]{12}$"), b = /^[a-zA-Z0-9]{12}$/, d = "", a = a || "", d = a.match(c) ? a : a.match(b) ? U + a : U + ca();
            return i.name = d
        }

        function ga() {
            var a = b(this), c = a.attr("data-x"), g = a.attr("data-y");
            p.hasClass("battlefield__processed") || Pa(g, c, a)
        }

        function Qa(a) {
            p.hasClass("battlefield__processed") || (p.addClass("battlefield__processed"), a.closest(".battlefield-cell").addClass("battlefield-cell__processed"))
        }

        function V() {
            p.removeClass("battlefield__processed");
            p.find(".battlefield-cell__processed").removeClass("battlefield-cell__processed")
        }

        function Pa(a, c, b) {
            a = parseInt(a, 10);
            c = parseInt(c, 10);
            if ("undefined" != typeof w[a] && "undefined" != w[a][c] && w[a][c] === n.INITIALIZED)w[a][c] = n.PROCESSED, Qa(b);
            o({command: "register-shoot", shoot: {y: a, x: c}}, !0, function (a) {
                V();
                x(a)
            }, function (a) {
                V();
                y(a)
            })
        }

        function ha(a) {
            var c = b(".chat-state__typing");
            a ? c.addClass("chat-state__invisible") : c.removeClass("chat-state__invisible")
        }

        function W() {
            t = !0;
            b(".body").addClass("body__game_over")
        }

        function Ra() {
            p.find(".battlefield-cell-content").bind("click", ga);
            var a = wa(r);
            ya(a);
            "off" == b.cookie("websocket") && (A = !1, j.reachGoal("websocketOff"));
            A && j.reachGoal("supportWebSocket");
            var c = H().replace(/^\/[a-z]{2}\//, "/"), c = 0 === c.toLowerCase().indexOf("/id") ? c.substr(3) : "";
            o({command: "create", connect: c, ships: a, type: X ? "classic" : "default"}, !0, function (a) {
                J = a.id;
                xa(J);
                Sa();
                Ta();
                x(a)
            }, y)
        }

        function ya(a) {
            a = a || wa(r);
            if ("undefined" != typeof localStorage)try {
                localStorage["ships__" +
                    (X ? "classic" : "default")] = JSON.stringify(a)
            } catch (c) {
            }
        }

        function za() {
            clearTimeout(Aa);
            if (!t) {
                var a = 15E3;
                "undefined" != typeof navigator.onLine && !navigator.onLine && (a = 1E3);
                Aa = setTimeout(function () {
                    o({command: "ping"}, !0, x, y);
                    za()
                }, a)
            }
        }

        function Ba() {
            "undefined" != typeof F && o(F.obj, F.async, F.callback, F.fallback)
        }

        function o(a, c, g, d) {
            if (!t) {
                var e = xa(i.name).substr(U.length);
                F = {obj: a, async: c, callback: g, fallback: d};
                var f = JSON.stringify(a);
                if (A) {
                    a = Ka();
                    c = u;
                    "ws" == a && (c = (La || O) + "." + c);
                    e = a + "://" + c + "/ws/" + e;
                    if (h &&
                        h.socket && h.socket.readyState === WebSocket.OPEN) {
                        if (h.socket.url === e) {
                            h.ajax.callback = g;
                            h.ajax.fallback = d;
                            h.socket.send(f);
                            return
                        }
                        try {
                            h.socket.onclose = null, h.socket.onerror = null, h.socket && h.socket.readyState === WebSocket.OPEN && h.socket.close()
                        } catch (k) {
                        }
                    }
                    h = {ajax: new ia(g, d), socket: new WebSocket(e)};
                    h.socket.onopen = function () {
                        h.socket.send(f)
                    };
                    h.socket.onclose = function (a) {
                        "undefined" != typeof a.code && 1E3 != a.code && ("undefined" != typeof navigator.onLine && !navigator.onLine ? this.ajax.fallback.call(i, {status: 0}) :
                            (this.ajax.fallback.call(i, {status: 502}), Ca++, Ca >= Ua && (A = !1, b.cookie("websocket", "off", {expires: 7, path: "/", domain: "." + u}), j.reachGoal("fromWebSocketToLongPolling")), j.reachGoal("webSocketClose", {code: "" + a.code})))
                    }.bind(h);
                    h.socket.onerror = function () {
                        h.socket && h.socket.readyState && h.socket.readyState === WebSocket.OPEN && h.socket.close();
                        j.reachGoal("webSocketError")
                    }.bind(h);
                    h.socket.onmessage = function (a) {
                        a = JSON.parse(a.data);
                        za();
                        200 != a.status ? this.ajax.fallback.call(i, a) : this.ajax.callback.call(i,
                            a)
                    }.bind(h)
                } else c = "undefined" == typeof c || c ? !0 : !1, h && 4 != h.readyState && h.abort && h.abort(), h = b.ajax({cache: !1, type: "post", dataType: "json", contentType: "application/json", url: Ma + e, data: f, async: c, error: d, success: g})
            }
        }

        function x(a) {
            var c = !1;
            a.events && (a.events.sort(function (a, c) {
                return a.id - c.id
            }), a = a.events.shift(), Va(a), Y(a), c = !0);
            c || Y()
        }

        function Y(a) {
            if (J && !t) {
                var c = {command: "waiting-for-event"};
                if ("undefined" != typeof a)c.reid = a.id;
                o(c, !0, x, y)
            }
        }

        function y(a) {
            if (!t)switch (a.status) {
                case 0:
                    setTimeout(function () {
                        if (!A &&
                            0 === h.readyState || A && h.socket && h.socket.readyState == h.socket.CLOSED)j.reachGoal("reconnect"), Ba()
                    }, 1E3);
                    break;
                case 501:
                    j.reachGoal("gameError");
                    conn_to_server("game-error");
                    W();
                    break;
                case 502:
                    clearTimeout(Da);
                    Ea < Wa ? Da = setTimeout(function () {
                        Ea++;
                        Ba()
                    }, 500) : (j.reachGoal("serverError"), conn_to_server("server-error"), W());
                    break;
                case 408:
                case 504:
                    Y();
                    break;
                default:
                    Y()
            }
        }

        function Xa() {
            function a() {
                l.title = K.replace(/\s/g, "\u00a0");
                setTimeout(function () {
                    l.title = K
                }, 250)
            }

            (function g() {
                clearTimeout(Fa);
                if (L)a(); else {
                    if (ja)l.title = l.title ==
                        K ? "..." : K;
                    Fa = setTimeout(g, 1E3)
                }
            })()
        }

        function Va(a) {
            var c = a.name + "," + a.id;
            if ("undefined" == typeof ka[c] && (ka[c] = !1, Xa(), !t)) {
                b(".body__game_over").removeClass("body__game_over");
                var g = a.name, a = a.payload;
                switch (g) {
                    case "rival-leave":
                        j.reachGoal("rivalLeave");
                        W();
                        break;
                    case "waiting-for-rival":
                        b(".leave").removeClass("none");
                        b(".battlefield-start-hint").removeClass("none");
                        z.addClass("battlefield__wait");
                        break;
                    case "chat-message-typing":
                        ha();
                        break;
                    case "chat-message-stop-typing":
                        ha(!0);
                        break;
                    case "chat-message":
                        "rival" ==
                            a.owner && (ha(!0), M("chat"));
                        var d = b(".chat-message__holder"), e = ("" + new Date(a.date)).match(/\d\d:\d\d:\d\d/);
                        b('<li class="chat-message chat-message__' + a.owner + '"><span class="chat-message-time">' + e + '</span> <span class="chat-message-text">' + b("<div />").text(a.message).html() + "</span></li>").insertAfter(d);
                        b(i).trigger("resize");
                        break;
                    case "game-started-move-off":
                    case "game-started-move-on":
                        M("game_started");
                        b(".chat-gap").removeClass("none");
                        b(".leave").removeClass("none");
                        b(".battlefield-start").addClass("none");
                        b(".battlefield-stat").removeClass("none");
                        p.removeClass("none");
                        ja = !0;
                        t = !1;
                        /-on$/.test(g) ? (p.removeClass("battlefield__wait"), z.addClass("battlefield__wait")) : (p.addClass("battlefield__wait"), z.removeClass("battlefield__wait"));
                        a = [];
                        for (d = 0; d < s.length; d++) {
                            for (var e = s[d], f = [], k = 0; k < e.count; k++) {
                                for (var h = [], ra = 0; ra < e.size; ra++)h.push('<span class="ship-part"></span>');
                                f.push('<span class="ship">' + h.join("") + "</span>")
                            }
                            a.push('<div class="ship-type ship-type__len_' + e.size + '">' + f.join("") + "</div>")
                        }
                        b(".battlefield-stat").html('<div class="ship-types">' +
                            a.join("") + "</div>").removeClass("none");
                        break;
                    case "move-on":
                        V();
                        p.removeClass("battlefield__wait");
                        z.addClass("battlefield__wait");
                        la(a);
                        break;
                    case "move-off":
                        p.addClass("battlefield__wait");
                        z.removeClass("battlefield__wait");
                        la(a);
                        break;
                    case "game-over-win":
                    case "game-over-lose":
                        M(g.replace(/game-over-/, ""));
                        la(a);
                        a = a.undiscovered;
                        if ("undefined" != typeof a)for (d = 0; d < a.length; d++)e = a[d].y, f = a[d].x, p.find("tr:nth-child(" + (e + 1) + ") td:nth-child(" + (f + 1) + ")").addClass("battlefield-cell__undiscovered");
                        j.reachGoal("gameOver");
                        W()
                }
                conn_to_server(g);
                ka[c] = !0
            }
        }

        function conn_to_server(a, c) {
            if (b(".notification__" + a).length || c)b(".notification").addClass("none"), b(".notification__" + a).removeClass("none")
        }

        function la(a) {
            if ("undefined" != typeof a) {
                var c = !1, g = z, d = ba, e = a["register-self-shoot"] || a["register-rival-shoot"], f = "battlefield-cell__miss";
                "undefined" != typeof a["register-self-shoot"] && (c = !0);
                if (e && "undefined" != e.state && (e.state >= n.WOUNDED && (f = "battlefield-cell__hit"), e.state === n.KILLED && (f += " battlefield-cell__done"), c ? (g = p,
                    d = w) : (b(".battlefield-cell__last").removeClass("battlefield-cell__last"), f += " battlefield-cell__last"), !(d[e.y][e.x] >= n.MISSED))) {
                    d[e.y][e.x] = e.state;
                    a = g.find("tr:nth-child(" + (e.y + 1) + ") td:nth-child(" + (e.x + 1) + ")");
                    a.removeClass("battlefield-cell__empty").addClass(f);
                    c && (a.find(".battlefield-cell-content").unbind("click", ga), V());
                    if (e.state === n.KILLED) {
                        var c = e.y, f = e.x, k = [];
                        if (d[c][f] === n.KILLED) {
                            k.push({y: c, x: f});
                            if ("undefined" != typeof d[c][f - 1] && d[c][f - 1] > n.MISSED || "undefined" != typeof d[c][f + 1] &&
                                d[c][f + 1] > n.MISSED)for (var a = -1, h = 1, i, j = !1; !j; h++)i = f + a * h, "undefined" != d[c][i] && d[c][i] > n.MISSED ? k.push({y: c, x: i}) : 0 > a ? (a = 1, h = 0) : j = !0; else if ("undefined" != typeof d[c - 1] && "undefined" != typeof d[c - 1][f] && d[c - 1][f] > n.MISSED || "undefined" != typeof d[c + 1] && "undefined" != typeof d[c + 1][f] && d[c + 1][f] > n.MISSED) {
                                a = -1;
                                h = 1;
                                for (j = !1; !j; h++)i = c + a * h, "undefined" != typeof d[i] && "undefined" != d[i][f] && d[i][f] > n.MISSED ? k.push({y: i, x: f}) : 0 > a ? (a = 1, h = 0) : j = !0
                            }
                            for (c = 0; c < k.length; c++)f = k[c], g.find("tr:nth-child(" + (f.y + 1) + ") td:nth-child(" +
                                (f.x + 1) + ")").addClass("battlefield-cell__done");
                            if (g.is(".battlefield__rival")) {
                                for (var m, q, f = c = 0; f < k.length; f++) {
                                    d = k[f];
                                    if ("undefined" == typeof m && "undefined" == typeof q)m = d.y, q = d.x;
                                    if (m > d.y)m = d.y;
                                    if (q > d.x)q = d.x;
                                    c += d.y
                                }
                                f = k.length;
                                va(m, q, f, c / f === m ? "h" : "v", g)
                            }
                            for (c = 0; c < k.length; c++) {
                                var f = k[c], l;
                                for (l in D)q = f.y + D[l][0], m = f.x + D[l][1], sa(q, m, g, !0)
                            }
                            l = k.length;
                            q = [];
                            for (m = 0; m < l; m++)q.push(k[m].y + "," + k[m].x);
                            k = q.join(";");
                            g.find(".battlefield-stat .ship[data-coords='" + k + "']").length || g.find(".battlefield-stat .ship-type__len_" +
                                l + " .ship").filter(":not(.ship__killed)").last().attr("data-coords", k).addClass("ship__killed")
                        }
                    } else if (e.state === n.WOUNDED)for (k in l = e.y, q = e.x, ma)m = l + ma[k][0], c = q + ma[k][1], sa(m, c, g, !0);
                    a:{
                        for (var o in n)if (e.state === n[o]) {
                            e = o;
                            break a
                        }
                        e = !1
                    }
                    M("shoot_" + e.toLowerCase())
                }
            }
        }

        function Ya() {
            if ("undefined" == typeof Audio)return!1;
            for (var a = new Audio, c = ["ogg", "mp3"], b, d = 0; d < c.length; d++)if (a.canPlayType("audio/" + c[d])) {
                b = c[d];
                break
            }
            return"undefined" != typeof b ? b : !1
        }

        function M(a) {
            if (ta(E.sound))try {
                var c, g,
                    d = b(".sound__" + a);
                c = "game_started" == a || "chat" == a ? d : g = d.clone();
                /(ipad|iphone)/i.test(i.navigator.userAgent) ? d.get(0).play() : c.get(0).play()
            } catch (e) {
            }
        }

        function Sa() {
            b(i).bind("beforeunload", function () {
                if (J && !t)if ($)o({command: "leave"}, !1); else return b(".leave").attr("data-confirm")
            });
            b(i).unload(function () {
                J && (ja ? t || (o({command: "leave"}, !1), j.reachGoal("leaveWhilePlaying", {exit: $ ? "click" : "close"})) : j.reachGoal("leaveWithoutPlaying", {exit: $ ? "click" : "close"}))
            })
        }

        function Ta() {
            b(i).bind("online", function () {
                j.reachGoal("online");
                b(".body").removeClass("body__offline")
            });
            b(i).bind("offline", function () {
                b(".body").addClass("body__offline")
            })
        }

        function Za() {
            var a = b(".battlefield-cell-content").last();
            return{height: a.height(), width: a.width()}
        }

        function $a() {
            var a = b(this);
            if (!a.closest(".port").length) {
                var c = a.css("height"), g = a.css("width");
                if (c !== g) {
                    var d = a.closest(".battlefield-cell-content"), e = parseInt(d.attr("data-y"), 10), f = parseInt(d.attr("data-x"), 10), i = parseInt(a.attr("data-length"), 10), h = a.attr("data-position"), j = "v" == h ?
                        "h" : "v", d = a.attr("data-id");
                    qa(d);
                    if (v(e, f, i, j, !0)) {
                        var h = a.css("padding-right"), l = a.css("padding-bottom");
                        a.css("height", g);
                        a.css("width", c);
                        a.css("padding-right", l);
                        a.css("padding-bottom", h);
                        h = "v";
                        parseInt(c) > parseInt(g) && (h = "h");
                        a.removeClass("ship-box__h ship-box__v").addClass("ship-box__" + h);
                        a.attr("data-position", h);
                        v(e, f, i, j, !1, d)
                    } else v(e, f, i, h, !1, d), c = {duration: 250}, a = b(".ship-box[data-id=" + d + "]"), a.addClass("ship-box__placeholder_error"), clearTimeout(Ga), a.stop(!0).shake(c), Ga = setTimeout(function () {
                            a.removeClass("ship-box__placeholder_error")
                        },
                        c.duration)
                }
            }
        }

        function Ha() {
            function a(a) {
                var b = a.closest(".battlefield-cell-content");
                if (b.length) {
                    var d = parseInt(b.attr("data-y"), 10), b = parseInt(b.attr("data-x"), 10), e = a.attr("data-id"), f = parseInt(a.attr("data-length"), 10), a = a.attr("data-position");
                    v(d, b, f, a, !1, e)
                }
            }

            b(".ship-box:not(.ship-box__draggable)").draggable({create: function () {
                b(this).addClass("ship-box__draggable");
                b(this).bind("click", $a)
            }, start: function (a, b) {
                qa(b.helper.attr("data-id"))
            }, stop: function (c, g) {
                var d = g.helper;
                d.removeClass("ship-box__transparent");
                b(".ship-box__placeholder").length ? (b(".ship-box__placeholder").before(d), b(".ship-box__placeholder").remove(), a(d), b(".placeships-variant__hands_inactive").removeClass("placeships-variant__hands_inactive"), setTimeout(function () {
                    b(".port .ship-box").length || (b(".battlefields").removeClass("battlefields__handly"), b(".battlefield-start").removeClass("none"))
                }, 500)) : a(d);
                d.css({left: 0, top: 0, margin: "-2px"})
            }, drag: function (a, g) {
                var d = b(this), e = d.clone(!1);
                e.removeClass("ui-draggable ui-draggable-dragging ship-box__transparent").addClass("ship-box__placeholder").css({left: 0,
                    top: 0, margin: "-2px"});
                b(".battlefield__self .battlefield-cell-content").find(".ship-box__placeholder").remove();
                var f = Za(), h = g.offset.top + f.height / 2, i = g.offset.left + f.width / 2;
                d.removeClass("ship-box__transparent");
                b(".battlefield__self .battlefield-cell-content").each(function () {
                    var a = b(this), c = a.offset(), f = a.width(), g = a.height();
                    if (i >= c.left && i <= c.left + f && h >= c.top && h <= c.top + g) {
                        var c = parseInt(a.attr("data-y"), 10), f = parseInt(a.attr("data-x"), 10), g = parseInt(d.attr("data-length"), 10), j = d.attr("data-position");
                        v(c, f, g, j, !0, Ja) && (a.append(e), d.addClass("ship-box__transparent"));
                        return!1
                    }
                })
            }})
        }

        function ta(a) {
            return!/^(off|false|undefined|null|0)?$/i.test(a + "")
        }

        function T(a, c) {
            return Math.floor((c - a + 1) * Math.random() + a)
        }

        function ca() {
            for (var a = "", c = 0, b; 12 > c; c++)b = Math.floor(62 * Math.random()), a += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".substring(b, b + 1);
            return a
        }

        function ia(a, b) {
            this.callback = a;
            this.fallback = b
        }

        var U = "battleship__", E = {}, h, F, Ea = 0, Wa = 10, Da, Ca = 0, Ua = 5, J, ka = {}, Aa, N = !1, Ia, L =
            !0, Fa, K, ja = !1, t = !1, $ = !1, S = b(".battlefield"), z = S.filter(".battlefield__self"), p = S.filter(".battlefield__rival");
        Q = 10;
        R = 10;
        aa = 0;
        P = 1;
        var X = -1 != location.pathname.indexOf("/classic"), s = [
            {size: 4, count: 1},
            {size: 3, count: 2},
            {size: 2, count: 3},
            {size: 1, count: 4}
        ];
        X && (s = [
            {size: 5, count: 1},
            {size: 4, count: 1},
            {size: 3, count: 2},
            {size: 2, count: 1}
        ]);
        var C = [];
        oa = -1;
        var n = {INITIALIZED: -3, PROCESSED: -2, MISSED: -1, WOUNDED: 0, KILLED: 1};
        G = 0;
        var D = [
            [-1, 0],
            [-1, 1],
            [0, 1],
            [1, 1],
            [1, 0],
            [1, -1],
            [0, -1],
            [-1, -1]
        ], ma = [
            [-1, 1],
            [1, 1],
            [1, -1],
            [-1,
                -1]
        ], Na = i.letters || "\u0410,\u0411,\u0412,\u0413,\u0414,\u0415,\u0416,\u0417,\u0418,\u041a".split(","), ba = [], w = [], r = [], B = [], Ga = 0;
        ia.prototype.done = function (a) {
            this.callback = a || function () {
            };
            return this
        };
        ia.prototype.fail = function (a) {
            this.fallback = a || function () {
            };
            return this
        };
        (function () {
            2 == O.length && b.cookie("lang", O, {expires: 365, path: "/", domain: "." + u});
            (function () {
                (function () {
                    var a = "";
                    "https" == na() && (a = "/" + O);
                    var c = H().replace(/^\/[a-z]{2}\//, "/");
                    b(".battlefield-start-choose_rival-variant-link").attr("href",
                        a + "/");
                    var g = b(".battlefield-start-choose_rival-variant-link__connect");
                    g.attr("href");
                    0 === c.toLowerCase().indexOf("/id") ? g.attr("href", a + c) : g.attr("href", a + "/id" + T(1E7, 99999999))
                })();
                b(".battlefield-start-choose_rival-variant-link").click(function () {
                    ya()
                });
                (function () {
                    b(".battlefield-start-choose_rival-variant").removeClass("battlefield-start-choose_rival-variant__active");
                    b(".battlefield-start-choose_rival-variant-link").each(function () {
                        if (b(this).attr("href") == H() && (b(this).closest(".battlefield-start-choose_rival-variant").addClass("battlefield-start-choose_rival-variant__active"),
                            b(this).is(".battlefield-start-choose_rival-variant-link__connect"))) {
                            var a = b(this).closest(".battlefield-start-choose_rival-variant").find(".battlefield-start-choose_rival-variant-url-input");
                            a.val(location.href).attr("data-value", location.href);
                            a.on("click",function () {
                                b(this).trigger("select")
                            }).on("keydown keyup", function (a) {
                                (a.ctrlKey || a.metaKey) && 67 == a.keyCode || a.preventDefault()
                            })
                        }
                    })
                })();
                (function () {
                    var a = H();
                    0 == a.replace(/^\/[a-z]{2}\//, "/").toLowerCase().indexOf("/id") && (a = a.replace(/\/$/,
                        ""), b(".battlefield-start-ships_types-gap").removeClass("none"), -1 != a.indexOf("/classic") ? (b(".battlefield-start-ships_type__classic").addClass("battlefield-start-ships_type__active"), b(".battlefield-start-ships_type-link").attr("href", a), b(".battlefield-start-ships_type__default .battlefield-start-ships_type-link").attr("href", a.replace(/\/classic\/?/, ""))) : (b(".battlefield-start-ships_type__default").addClass("battlefield-start-ships_type__active"), b(".battlefield-start-ships_type-link").attr("href",
                        a), b(".battlefield-start-ships_type__classic .battlefield-start-ships_type-link").attr("href", a + "/classic")))
                })()
            })();
            (function () {
                Ya() && b(".setting__sound").removeClass("none");
                b(".setting").each(function () {
                    var a = b(this).attr("data-name"), c = "setting__" + a, g = b("#" + c);
                    b.cookie(c) && g.attr("checked", "on" == b.cookie(c) ? !0 : !1);
                    g.click(function () {
                        E[a] = b(this).is(":checked") ? "on" : "off";
                        b.cookie(c, E[a], {expires: 365, path: "/", domain: "." + u});
                        "sound" == a && "on" == E[a] && M("click")
                    });
                    E[a] = g.is(":checked")
                })
            })();
            (function () {
                function a(a) {
                    pa();
                    if (a)ea(); else if (a = "ships__" + (X ? "classic" : "default"), "undefined" != typeof localStorage && "undefined" != typeof localStorage[a] && "" != localStorage[a]) {
                        var a = JSON.parse(localStorage[a]), g;
                        a:{
                            for (var d = {}, e = 0; e < s.length; e++) {
                                var f = s[e];
                                d[f.size] = f.count
                            }
                            for (e = 0; e < a.length; e++)d[a[e].length]--;
                            for (g in d)if (0 != d[g]) {
                                g = !1;
                                break a
                            }
                            g = !0
                        }
                        if (g) {
                            g = 0;
                            for (var h, i; g < a.length; g++)i = a[g], d = i[0].y, e = i[0].x, f = i.length, h = "h", 1 < f && i[0].x === i[1].x && (h = "v"), v(d, e, f, h)
                        } else ea()
                    } else ea();
                    a = r;
                    g = z;
                    for (var j in a) {
                        d = a[j].coords;
                        for (f = 0; f < d.length; f++)e = d[f], 0 === f && va(e.y, e.x, a[j].len, a[j].pos, g, a[j].id), g.find("tr:nth-child(" + (e.y + 1) + ") td:nth-child(" + (e.x + 1) + ")").removeClass("battlefield-cell__empty").addClass("battlefield-cell__busy")
                    }
                    Ha();
                    b(".battlefields").removeClass("battlefields__handly");
                    b(".battlefield-start").removeClass("none")
                }

                b(".placeships-variant__hands").click(function () {
                    pa();
                    b(".battlefields").addClass("battlefields__handly");
                    b(".battlefield-start").addClass("none");
                    var a = b(".port-lines");
                    a.html("");
                    for (var g =
                        0; g < s.length; g++) {
                        for (var d = s[g], e = b('<div class="port-line clearfix" />'), f = 0; f < d.count; f++) {
                            var h = b('<div class="port-ship" />'), i = ua(d.size, "h", ca());
                            h.attr("style", i.attr("style")).append(i);
                            e.append(h)
                        }
                        a.append(e)
                    }
                    Ha();
                    b(this).addClass("placeships-variant__hands_inactive")
                });
                b(".placeships-variant__randomly").click(function () {
                    a(!0);
                    b(".placeships-variant__hands_inactive").removeClass("placeships-variant__hands_inactive")
                });
                a();
                b(".battlefield-start-button").attr("disabled", null).click(function () {
                    b(this).attr("disabled",
                        "disabled");
                    b(".placeships").addClass("none");
                    var a = b(".ship-box__draggable");
                    a.draggable("destroy");
                    a.unbind("click");
                    a.removeClass("ship-box__draggable");
                    conn_to_server("connect-to-server");
                    Ra()
                })
            })();
            (function () {
                var a = b(".chat-teletype");
                a.bind("keydown", function (a) {
                    13 == a.keyCode ? (a = b(".chat-teletype").val(), a = b.trim(a), "" != a ? (j.reachGoal("chatMessage"), N = !1, o({command: "chat-message", message: a}, !0, x, y), a = !0) : a = !1, a && b(".chat-teletype").val("")) : N || (N = !0, o({command: "chat-message-typing"}, !0, x, y))
                });
                a.bind("keyup blur",
                    function (a) {
                        if (N) {
                            var b = "blur" == a.type ? 0 : 3E3;
                            13 != a.keyCode && (clearTimeout(Ia), Ia = setTimeout(function () {
                                N = !1;
                                o({command: "chat-message-stop-typing"}, !0, x, y)
                            }, b))
                        }
                    })
            })();
            (function () {
                K = l.title;
                l.onfocusin = function (a) {
                    "undefined" == typeof a && null == event.toElement && (L = !0)
                };
                l.onfocusout = function (a) {
                    "undefined" == typeof a && null == event.toElement && (L = !1)
                };
                b(i).focus(function () {
                    L = !0
                }).blur(function () {
                    L = !1
                })
            })();
            (function () {
                b(".restart").click(function () {
                    location.reload(!0)
                });
                b(".leave-link").attr("href", location.href).on("click",
                    function (a) {
                        function b() {
                            location.reload(!0)
                        }

                        a.preventDefault();
                        $ = !0;
                        o({command: "leave"}, !1, b, b)
                    })
            })()
        })();
        (function () {
            b(".lang-link").each(function () {
                var a = b(this).attr("href");
                if ("https" == na()) {
                    var a = b(this).attr("href").replace("http://", "").substr(0, 2), c = location.pathname.replace(/^\/[a-z]{2}\//, "/");
                    b(this).attr("href", "https://" + u + "/" + a + c)
                } else b(this).attr("href", a.replace(/\/$/, "") + location.pathname)
            })
        })();
        (function () {
            try {
                var a = !1, c = b(".sda");
                if (c.length) {
                    var g = c.find(".sda-block"), d = c.height(),
                        e = parseInt(g.css("padding-top"), 10), g = function () {
                            c.removeClass("sda__fixed");
                            var f = c.offset().top + d + e;
                            b(i).height() > f && c.addClass("sda__fixed");
                            a || (b(".sda__vh").removeClass("sda__vh"), a = !0)
                        };
                    b(i).resize(g);
                    g()
                }
            } catch (f) {
            }
        })();
        (function () {
            if (/(ipad|iphone)/i.test(i.navigator.userAgent)) {
                var a = function () {
                    var c = b(".sound:not([data-inited])").first();
                    c.length ? (c.on("canplay", function () {
                        b(this).attr("data-inited", "yes")
                    }), c.get(0).play(), c.get(0).pause()) : b(l).off("touchstart", a)
                };
                b(l).on("touchstart",
                    a)
            }
        })();
        i.chrome && i.chrome.webstore && b(".copyright-link__chrome").removeClass("none");
        "https:" == i.location.protocol && b(".body").addClass("body__ssl");
        (function () {
            b(".body-iframe a[href^='mailto:']").on("click", function () {
                i.top.location = b(this).attr("href");
                return!1
            })
        })();
        (function () {
            function a() {
                var a = b(".langs__opened");
                a.length && a.removeClass("langs__opened").attr("style", "")
            }

            b(".langs");
            b(".lang__selected .lang-link").on("click", function (c) {
                var d = b(c.target);
                c.preventDefault();
                d.closest(".langs__opened").length ?
                    a() : (c = b(".langs"), c.is(".langs__opened") || c.addClass("langs__opened"))
            });
            var c = (b("html").attr("data-accept-language") || "").split(",");
            if (c.length && c[0].length)for (var g = 0; g < c.length; g++) {
                var d = b(".lang__" + c[g]);
                d.length && d.addClass("lang__priority")
            }
            b(l).click(function (c) {
                b(c.target).closest(".langs").length || a()
            });
            b(l).keyup(function (b) {
                27 == b.keyCode && a()
            })
        })();
        (function () {
            function a(a) {
                a = parseFloat(a, 10);
                return isNaN(a) ? 0 : a
            }

            function c(c) {
                var e = 3650;
                "cancel" == c && (e = a(b.cookie("review-cancel-count")) +
                    1, b.cookie("review-cancel-count", e, {expires: 3650, path: "/", domain: "." + u}), e *= 7);
                b.cookie("review", c, {expires: e, path: "/", domain: "." + u})
            }

            var g = a(b.cookie("visit"));
            b.cookie("visit", g + 1, {expires: 3650, path: "/", domain: "." + u});
            i.chrome && i.chrome.webstore && !b(".body-iframe").length && 50 < a(b.cookie("visit")) && "undefined" == typeof b.cookie("review") && (b(".notification__cws .notification-submit__accept").click(function () {
                c("accept");
                var a = b(this).attr("data-target");
                location.href = a
            }), b(".notification__cws .notification-submit__cancel").click(function () {
                c("cancel");
                b(".body").removeClass("body__game_over");
                b(".notification__init").removeClass("none");
                b(".notification__cws").addClass("none")
            }), b(".body").addClass("body__game_over"), b(".notification__init").addClass("none"), b(".notification__cws").removeClass("none"))
        })()
    })
})(window, document);
