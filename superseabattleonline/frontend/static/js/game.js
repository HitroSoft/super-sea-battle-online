(function (i) {
    if (!("console"in i))i.console = {error: function () {
    }, warn: function () {
    }, log: function () {
    }}
})(window);
(function (window_obj, document_obj, Ja) {
    function get_site_localization_from_domain_name() {
        var b = "", j = window_obj.location.host.split(".");
        2 < j.length && (b = j[0]);
        //b = "battleship-game.org"
        //b = "";
        return b
    }

    function get_pathname_with_leading_slash() {
        var b = window_obj.location.pathname;
        0 != b.indexOf("/") && (b = "/" + b);
        //b  = "/D:/index.html";
        return b
    }

    function protocol_type_http_or_https() {
        var b = "http";
        "https:" == window_obj.location.protocol && (b += "s");
        return b
    }

    function protocol_type_ws_or_wss_if_https() {
        var b = "ws";
        "https:" == window_obj.location.protocol && (b += "s");
        return b
    }

    var u = "battleship-game.org", variable_with_localization_from_domain_name = get_site_localization_from_domain_name(), function_which_returns_localization_value = function () {
        var b = get_site_localization_from_domain_name(), localization_value = document_obj.documentElement.getAttribute("lang");
        2 == b.length ? localization_value = b : "https:" == window_obj.location.protocol && (b = get_pathname_with_leading_slash().split("/"), 2 <= b.length &&
            2 == b[1].length && (localization_value = b[1]));
        //localization_value = 'ru';
        return localization_value
    }(), path_for_post_to_service = "/services/";
    if (window_obj.MozWebSocket)window_obj.WebSocket = window_obj.MozWebSocket;
    var web_sockets_available_for_usage = false,//= !!("WebSocket"in window_obj && 2 == WebSocket.CLOSING),
        some_reach_goal_var_or_function = {reachGoal: function (b, i) {
        try {
            yaCounter20587900.reachGoal(b, i)
        } catch (j) {
        }
    }};
    jQuery(function (main_object) {
        var G, oa, aa, P, Q, R;

        function create_empty_battlefield() {
            var a, c = [], g = [];
            r = [];
            whole_battlefield_some_variable.find(".battlefield-table-placeholder").html("");
            for (var d = 0; d < Q; d++, g = []) {
                B[d] = [];
                ba[d] = [];
                w[d] = [];
                for (var e = 0; e < R; e++)a = "&#160;", 0 === e && (a += '<div class="marker marker__row">' + (d + 1) + "</div>"), 0 === d && (a +=
                    '<div class="marker marker__col">' + Na[e] + "</div>"), g.push('<td class="battlefield-cell battlefield-cell__empty"><div class="battlefield-cell-content" data-y="' + d + '" data-x="' + e + '" >' + a + "</div></td>"), B[d][e] = aa, ba[d][e] = ships_states.INITIALIZED, w[d][e] = ships_states.INITIALIZED;
                c.push('<tr class="battlefield-row">' + g.join("") + "</tr>")
            }
            a = main_object('<table class="battlefield-table">' + c.join("") + "</table>");
            whole_battlefield_some_variable.find(".battlefield-table-placeholder").append(a)
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
            return main_object('<div data-id="' + (g || "") + '" data-length="' + a + '" data-position="' + c + '" class="ship-box ship-box__' + c + '" style="width: ' + 2 * d + "em; height: " + 2 * e + "em; padding-right: " + f + "px; padding-bottom: " + k + 'px;" />')
        }

        function va(a, c, b, d, e, f) {
            b = ua(b, d, f);
            e.find("tr:nth-child(" + (a + 1) + ") td:nth-child(" + (c + 1) + ")").find(".battlefield-cell-content").append(b);
            return b
        }

        function convert_ships_object_list_to_array_of_ships_each_as_array_of_cells(ship_list) {
            var c, b, array_of_ships_each_as_array_of_cells = [], e;
            for (e in ship_list) {
                c = ship_list[e];
                b = c.coords;
                c = [];
                for (var f = 0; f < b.length; f++)c.push({y: b[f].y, x: b[f].x});
                array_of_ships_each_as_array_of_cells.push(c)
            }
            return array_of_ships_each_as_array_of_cells
        }

        function xa(a) {
            var c = RegExp("^" + U + "[a-zA-Z0-9]{12}$"), b = /^[a-zA-Z0-9]{12}$/, d = "", a = a || "", d = a.match(c) ? a : a.match(b) ? U + a : U + ca();
            return window_obj.name = d
        }

        function ga() {
            var a = main_object(this), c = a.attr("data-x"), g = a.attr("data-y");
            rival_battlefield_some_variable.hasClass("battlefield__processed") || Pa(g, c, a)
        }

        function Qa(a) {
            rival_battlefield_some_variable.hasClass("battlefield__processed") || (rival_battlefield_some_variable.addClass("battlefield__processed"), a.closest(".battlefield-cell").addClass("battlefield-cell__processed"))
        }

        function V() {
            rival_battlefield_some_variable.removeClass("battlefield__processed");
            rival_battlefield_some_variable.find(".battlefield-cell__processed").removeClass("battlefield-cell__processed")
        }

        function Pa(a, c, b) {
            a = parseInt(a, 10);
            c = parseInt(c, 10);
            if ("undefined" != typeof w[a] && "undefined" != w[a][c] && w[a][c] === ships_states.INITIALIZED)w[a][c] = ships_states.PROCESSED, Qa(b);
            low_level_connection_invoker({command: "register-shoot", shoot: {y: a, x: c}}, !0, function (a) {
                V();
                x(a)
            }, function (a) {
                V();
                http_error_handler_function(a)
            })
        }

        function ha(a) {
            var c = main_object(".chat-state__typing");
            a ? c.addClass("chat-state__invisible") : c.removeClass("chat-state__invisible")
        }

        function add_to_body_class_game_over() {
            t = !0;
            main_object(".body").addClass("body__game_over")
        }

        function send_data_with_ships() {
            rival_battlefield_some_variable.find(".battlefield-cell-content").bind("click", ga);
            var a = convert_ships_object_list_to_array_of_ships_each_as_array_of_cells(r);
            ya(a);
            "off" == main_object.cookie("websocket") && (web_sockets_available_for_usage = !1, some_reach_goal_var_or_function.reachGoal("websocketOff"));
            web_sockets_available_for_usage && some_reach_goal_var_or_function.reachGoal("supportWebSocket");
            var c = get_pathname_with_leading_slash().replace(/^\/[a-z]{2}\//, "/"), c = 0 === c.toLowerCase().indexOf("/id") ? c.substr(3) : "";
            low_level_connection_invoker({command: "create", connect: c, ships: a, type: X ? "classic" : "default"}, !0, function (a) {
                J = a.id;
                xa(J);
                Sa();
                Ta();
                x(a)
            }, http_error_handler_function)
        }

        function ya(a) {
            a = a || convert_ships_object_list_to_array_of_ships_each_as_array_of_cells(r);
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
                    low_level_connection_invoker({command: "ping"}, !0, x, http_error_handler_function);
                    za()
                }, a)
            }
        }

        function make_some_call() {
            "undefined" != typeof F && low_level_connection_invoker(F.obj, F.async, F.callback, F.fallback)
        }

        function low_level_connection_invoker(a, c, success_handler, error_handler) {
            if (!t) {
                var unknown_user_name_or_id = xa(window_obj.name).substr(U.length);
                F = {obj: a, async: c, callback: success_handler, fallback: error_handler};
                var f = JSON.stringify(a);
                //web_sockets_available_for_usage = false; //uncomment this line to force JS connect to targetip/services/ where we can catch requests
                if (web_sockets_available_for_usage) {
                    var a = protocol_type_ws_or_wss_if_https();
                    c = u;
                    "ws" == a && (c = (variable_with_localization_from_domain_name || function_which_returns_localization_value) + "." + c);
                    var web_service_uri = a + "://" + c + "/ws/" + unknown_user_name_or_id;
                    //e = "ws://battleship-game.org.battleship-game.org/ws/ucCsIoZYqz9d";
                    if (socket_object &&
                        socket_object.socket && socket_object.socket.readyState === WebSocket.OPEN) {
                        if (socket_object.socket.url === web_service_uri) {
                            socket_object.ajax.callback = success_handler;
                            socket_object.ajax.fallback = error_handler;
                            socket_object.socket.send(f);
                            return
                        }
                        try {
                            socket_object.socket.onclose = null, socket_object.socket.onerror = null, socket_object.socket && socket_object.socket.readyState === WebSocket.OPEN && socket_object.socket.close()
                        } catch (k) {
                        }
                    }
                    socket_object = {ajax: new ia(success_handler, error_handler), socket: new WebSocket(web_service_uri)};
                    socket_object.socket.onopen = function () {
                        socket_object.socket.send(f)
                    };
                    socket_object.socket.onclose = function (a) {
                        "undefined" != typeof a.code && 1E3 != a.code && ("undefined" != typeof navigator.onLine && !navigator.onLine ? this.ajax.fallback.call(window_obj, {status: 0}) :
                            (this.ajax.fallback.call(window_obj, {status: 502}), Ca++, Ca >= Ua && (web_sockets_available_for_usage = !1, main_object.cookie("websocket", "off", {expires: 7, path: "/", domain: "." + u}), some_reach_goal_var_or_function.reachGoal("fromWebSocketToLongPolling")), some_reach_goal_var_or_function.reachGoal("webSocketClose", {code: "" + a.code})))
                    }.bind(socket_object);
                    socket_object.socket.onerror = function () {
                        socket_object.socket && socket_object.socket.readyState && socket_object.socket.readyState === WebSocket.OPEN && socket_object.socket.close();
                        some_reach_goal_var_or_function.reachGoal("webSocketError")
                    }.bind(socket_object);
                    socket_object.socket.onmessage = function (a) {
                        a = JSON.parse(a.data);
                        za();
                        200 != a.status ? this.ajax.fallback.call(window_obj, a) : this.ajax.callback.call(window_obj,
                            a)
                    }.bind(socket_object)
                } else c = "undefined" == typeof c || c ? !0 : !1, socket_object && 4 != socket_object.readyState && socket_object.abort && socket_object.abort(), socket_object = main_object.ajax({cache: !1, type: "post", dataType: "json", contentType: "application/json", url: path_for_post_to_service + unknown_user_name_or_id, data: f, async: c, error: error_handler, success: success_handler})
            }
        }

        function x(a) {
            var c = !1;
            a.events && (a.events.sort(function (a, c) {
                return a.id - c.id
            }), a = a.events.shift(), game_event_handler(a), waiting_for_event_http_call(a), c = !0);
            c || waiting_for_event_http_call()
        }

        function waiting_for_event_http_call(a) {
            if (J && !t) {
                var c = {command: "waiting-for-event"};
                if ("undefined" != typeof a)c.reid = a.id;
                low_level_connection_invoker(c, !0, x, http_error_handler_function)
            }
        }

        function http_error_handler_function(responce_var) {
            if (!t)switch (responce_var.status) {
                case 0:
                    setTimeout(function () {
                        if (!web_sockets_available_for_usage &&
                            0 === socket_object.readyState || web_sockets_available_for_usage && socket_object.socket && socket_object.socket.readyState == socket_object.socket.CLOSED)some_reach_goal_var_or_function.reachGoal("reconnect"), make_some_call()
                    }, 1E3);
                    break;
                case 501:
                    some_reach_goal_var_or_function.reachGoal("gameError");
                    make_notification("game-error");
                    add_to_body_class_game_over();
                    break;
                case 502:
                    clearTimeout(timeout_id);
                    http_call_attempt_num < http_call_attempt_max ? timeout_id = setTimeout(function () {
                        http_call_attempt_num++;
                        make_some_call()
                    }, 500) : (some_reach_goal_var_or_function.reachGoal("serverError"), make_notification("server-error"), add_to_body_class_game_over());
                    break;
                case 408:
                case 504:
                    setTimeout(function () {waiting_for_event_http_call();}, 1E3);
//                    waiting_for_event_http_call();
                    break;
                default:
                    waiting_for_event_http_call()
            }
        }

        function Xa() {
            function a() {
                document_obj.title = document_title_var.replace(/\s/g, "\u00a0");
                setTimeout(function () {
                    document_obj.title = document_title_var
                }, 250)
            }

            (function g() {
                clearTimeout(Fa);
                if (L)a(); else {
                    if (ja)document_obj.title = document_obj.title ==
                        document_title_var ? "..." : document_title_var;
                    Fa = setTimeout(g, 1E3)
                }
            })()
        }

        function game_event_handler(game_event) {
            var c = game_event.name + "," + game_event.id;
            if ("undefined" == typeof ka[c] && (ka[c] = !1, Xa(), !t)) {
                main_object(".body__game_over").removeClass("body__game_over");
                var event_name = game_event.name, game_event_payload = game_event.payload;
                switch (event_name) {
                    case "rival-leave":
                        some_reach_goal_var_or_function.reachGoal("rivalLeave");
                        add_to_body_class_game_over();
                        break;
                    case "waiting-for-rival":
                        main_object(".leave").removeClass("none");
                        main_object(".battlefield-start-hint").removeClass("none");
                        own_battlefield_some_variable.addClass("battlefield__wait");
                        break;
                    case "chat-message-typing":
                        ha();
                        break;
                    case "chat-message-stop-typing":
                        ha(!0);
                        break;
                    case "chat-message":
                        "rival" ==
                            game_event_payload.owner && (ha(!0), play_sound("chat"));
                        var d = main_object(".chat-message__holder"), e = ("" + new Date(game_event_payload.date)).match(/\d\d:\d\d:\d\d/);
                        main_object('<li class="chat-message chat-message__' + game_event_payload.owner + '"><span class="chat-message-time">' + e + '</span> <span class="chat-message-text">' + main_object("<div />").text(game_event_payload.message).html() + "</span></li>").insertAfter(d);
                        main_object(window_obj).trigger("resize");
                        break;
                    case "game-started-move-off":
                    case "game-started-move-on":
                        play_sound("game_started");
                        main_object(".chat-gap").removeClass("none");
                        main_object(".leave").removeClass("none");
                        main_object(".battlefield-start").addClass("none");
                        main_object(".battlefield-stat").removeClass("none");
                        rival_battlefield_some_variable.removeClass("none");
                        ja = !0;
                        t = !1;
                        /-on$/.test(event_name) ? (rival_battlefield_some_variable.removeClass("battlefield__wait"), own_battlefield_some_variable.addClass("battlefield__wait"))
                            : (rival_battlefield_some_variable.addClass("battlefield__wait"), own_battlefield_some_variable.removeClass("battlefield__wait"));
                        var some_unknown_array = [];
                        //drawing stats
                        for (d = 0; d < s.length; d++) {
                            for (var e = s[d], f = [], k = 0; k < e.count; k++) {
                                for (var h = [], ra = 0; ra < e.size; ra++)h.push('<span class="ship-part"></span>');
                                f.push('<span class="ship">' + h.join("") + "</span>")
                            }
                            some_unknown_array.push('<div class="ship-type ship-type__len_' + e.size + '">' + f.join("") + "</div>")
                        }
                        main_object(".battlefield-stat").html('<div class="ship-types">' +
                            some_unknown_array.join("") + "</div>").removeClass("none");
                        break;
                    case "move-on":
                        V();
                        rival_battlefield_some_variable.removeClass("battlefield__wait");
                        own_battlefield_some_variable.addClass("battlefield__wait");
                        process_shoot_own_or_rival(game_event_payload);
                        break;
                    case "move-off":
                        rival_battlefield_some_variable.addClass("battlefield__wait");
                        own_battlefield_some_variable.removeClass("battlefield__wait");
                        process_shoot_own_or_rival(game_event_payload);
                        break;
                    case "game-over-win":
                    case "game-over-lose":
                        play_sound(event_name.replace(/game-over-/, ""));
                        process_shoot_own_or_rival(game_event_payload);
                        game_event_payload = game_event_payload.undiscovered;
                        if ("undefined" != typeof game_event_payload)for (d = 0; d < game_event_payload.length; d++)e = game_event_payload[d].y, f = game_event_payload[d].x, rival_battlefield_some_variable.find("tr:nth-child(" + (e + 1) + ") td:nth-child(" + (f + 1) + ")").addClass("battlefield-cell__undiscovered");
                        some_reach_goal_var_or_function.reachGoal("gameOver");
                        add_to_body_class_game_over()
                }
                make_notification(event_name);
                ka[c] = !0
            }
        }

        function make_notification(a, c) {
            if (main_object(".notification__" + a).length || c)main_object(".notification").addClass("none"), main_object(".notification__" + a).removeClass("none")
        }

        function process_shoot_own_or_rival(a) {
            if ("undefined" != typeof a) {
                var c = !1, g = own_battlefield_some_variable, d = ba, e = a["register-self-shoot"] || a["register-rival-shoot"], f = "battlefield-cell__miss";
                "undefined" != typeof a["register-self-shoot"] && (c = !0);
                if (e && "undefined" != e.state && (e.state >= ships_states.WOUNDED && (f = "battlefield-cell__hit"), e.state === ships_states.KILLED && (f += " battlefield-cell__done"), c ? (g = rival_battlefield_some_variable,
                    d = w) : (main_object(".battlefield-cell__last").removeClass("battlefield-cell__last"), f += " battlefield-cell__last"), !(d[e.y][e.x] >= ships_states.MISSED))) {
                    d[e.y][e.x] = e.state;
                    a = g.find("tr:nth-child(" + (e.y + 1) + ") td:nth-child(" + (e.x + 1) + ")");
                    a.removeClass("battlefield-cell__empty").addClass(f);
                    c && (a.find(".battlefield-cell-content").unbind("click", ga), V());
                    if (e.state === ships_states.KILLED) {
                        var c = e.y, f = e.x, k = [];
                        if (d[c][f] === ships_states.KILLED) {
                            k.push({y: c, x: f});
                            if ("undefined" != typeof d[c][f - 1] && d[c][f - 1] > ships_states.MISSED || "undefined" != typeof d[c][f + 1] &&
                                d[c][f + 1] > ships_states.MISSED)for (var a = -1, h = 1, i, j = !1; !j; h++)i = f + a * h, "undefined" != d[c][i] && d[c][i] > ships_states.MISSED ? k.push({y: c, x: i}) : 0 > a ? (a = 1, h = 0) : j = !0; else if ("undefined" != typeof d[c - 1] && "undefined" != typeof d[c - 1][f] && d[c - 1][f] > ships_states.MISSED || "undefined" != typeof d[c + 1] && "undefined" != typeof d[c + 1][f] && d[c + 1][f] > ships_states.MISSED) {
                                a = -1;
                                h = 1;
                                for (j = !1; !j; h++)i = c + a * h, "undefined" != typeof d[i] && "undefined" != d[i][f] && d[i][f] > ships_states.MISSED ? k.push({y: i, x: f}) : 0 > a ? (a = 1, h = 0) : j = !0
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
                    } else if (e.state === ships_states.WOUNDED)for (k in l = e.y, q = e.x, ma)m = l + ma[k][0], c = q + ma[k][1], sa(m, c, g, !0);
                    a:{
                        for (var o in ships_states)if (e.state === ships_states[o]) {
                            e = o;
                            break a
                        }
                        e = !1
                    }
                    play_sound("shoot_" + e.toLowerCase())
                }
            }
        }

        function which_soundfiles_available() {
            if ("undefined" == typeof Audio)return!1;
            for (var a = new Audio, c = ["ogg", "mp3"], b, d = 0; d < c.length; d++)if (a.canPlayType("audio/" + c[d])) {
                b = c[d];
                break
            }
            return"undefined" != typeof b ? b : !1
        }

        function play_sound(a) {
            if (ta(E.sound))try {
                var c, g,
                    d = main_object(".sound__" + a);
                c = "game_started" == a || "chat" == a ? d : g = d.clone();
                /(ipad|iphone)/i.test(window_obj.navigator.userAgent) ? d.get(0).play() : c.get(0).play()
            } catch (e) {
            }
        }

        function Sa() {
            main_object(window_obj).bind("beforeunload", function () {
                if (J && !t)if ($)low_level_connection_invoker({command: "leave"}, !1); else return main_object(".leave").attr("data-confirm")
            });
            main_object(window_obj).unload(function () {
                J && (ja ? t || (low_level_connection_invoker({command: "leave"}, !1), some_reach_goal_var_or_function.reachGoal("leaveWhilePlaying", {exit: $ ? "click" : "close"})) : some_reach_goal_var_or_function.reachGoal("leaveWithoutPlaying", {exit: $ ? "click" : "close"}))
            })
        }

        function Ta() {
            main_object(window_obj).bind("online", function () {
                some_reach_goal_var_or_function.reachGoal("online");
                main_object(".body").removeClass("body__offline")
            });
            main_object(window_obj).bind("offline", function () {
                main_object(".body").addClass("body__offline")
            })
        }

        function Za() {
            var a = main_object(".battlefield-cell-content").last();
            return{height: a.height(), width: a.width()}
        }

        function $a() {
            var a = main_object(this);
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
                    } else v(e, f, i, h, !1, d), c = {duration: 250}, a = main_object(".ship-box[data-id=" + d + "]"), a.addClass("ship-box__placeholder_error"), clearTimeout(Ga), a.stop(!0).shake(c), Ga = setTimeout(function () {
                            a.removeClass("ship-box__placeholder_error")
                        },
                        c.duration)
                }
            }
        }

        function placing_ships_manually_on_own_field() {
            function a(a) {
                var b = a.closest(".battlefield-cell-content");
                if (b.length) {
                    var d = parseInt(b.attr("data-y"), 10), b = parseInt(b.attr("data-x"), 10), e = a.attr("data-id"), f = parseInt(a.attr("data-length"), 10), a = a.attr("data-position");
                    v(d, b, f, a, !1, e)
                }
            }

            main_object(".ship-box:not(.ship-box__draggable)").draggable({create: function () {
                main_object(this).addClass("ship-box__draggable");
                main_object(this).bind("click", $a)
            }, start: function (a, b) {
                qa(b.helper.attr("data-id"))
            }, stop: function (c, g) {
                var d = g.helper;
                d.removeClass("ship-box__transparent");
                main_object(".ship-box__placeholder").length ? (main_object(".ship-box__placeholder").before(d), main_object(".ship-box__placeholder").remove(), a(d), main_object(".placeships-variant__hands_inactive").removeClass("placeships-variant__hands_inactive"), setTimeout(function () {
                    main_object(".port .ship-box").length || (main_object(".battlefields").removeClass("battlefields__handly"), main_object(".battlefield-start").removeClass("none"))
                }, 500)) : a(d);
                d.css({left: 0, top: 0, margin: "-2px"})
            }, drag: function (a, g) {
                var d = main_object(this), e = d.clone(!1);
                e.removeClass("ui-draggable ui-draggable-dragging ship-box__transparent").addClass("ship-box__placeholder").css({left: 0,
                    top: 0, margin: "-2px"});
                main_object(".battlefield__self .battlefield-cell-content").find(".ship-box__placeholder").remove();
                var f = Za(), h = g.offset.top + f.height / 2, i = g.offset.left + f.width / 2;
                d.removeClass("ship-box__transparent");
                main_object(".battlefield__self .battlefield-cell-content").each(function () {
                    var a = main_object(this), c = a.offset(), f = a.width(), g = a.height();
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

        var U = "battleship__", E = {}, socket_object, F, http_call_attempt_num = 0, http_call_attempt_max = 10, timeout_id, Ca = 0, Ua = 5, J, ka = {}, Aa, N = !1, Ia, L =
            !0, Fa, document_title_var, ja = !1, t = !1, $ = !1, whole_battlefield_some_variable = main_object(".battlefield"), own_battlefield_some_variable = whole_battlefield_some_variable.filter(".battlefield__self"), rival_battlefield_some_variable = whole_battlefield_some_variable.filter(".battlefield__rival");
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
        var ships_states = {INITIALIZED: -3, PROCESSED: -2, MISSED: -1, WOUNDED: 0, KILLED: 1};
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
        ], Na = window_obj.letters || "\u0410,\u0411,\u0412,\u0413,\u0414,\u0415,\u0416,\u0417,\u0418,\u041a".split(","), ba = [], w = [], r = [], B = [], Ga = 0;
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
            //adding localization cookie
            2 == function_which_returns_localization_value.length && main_object.cookie("lang", function_which_returns_localization_value, {expires: 365, path: "/", domain: "." + u});
            (function () {
                (function () {
                    var a = "";
                    "https" == protocol_type_http_or_https() && (a = "/" + function_which_returns_localization_value);
                    var c = get_pathname_with_leading_slash().replace(/^\/[a-z]{2}\//, "/");
                    main_object(".battlefield-start-choose_rival-variant-link").attr("href",
                        a + "/");
                    var g = main_object(".battlefield-start-choose_rival-variant-link__connect");
                    g.attr("href");
                    //if we entered via id link - play with this id. Otherwise play with same language player
                    0 === c.toLowerCase().indexOf("/id") ? g.attr("href", a + c) : g.attr("href", a + "/id" + T(1E7, 99999999))
                })();
                main_object(".battlefield-start-choose_rival-variant-link").click(function () {
                    ya()
                });
                (function () {
                    main_object(".battlefield-start-choose_rival-variant").removeClass("battlefield-start-choose_rival-variant__active");
                    main_object(".battlefield-start-choose_rival-variant-link").each(function () {
                        if (main_object(this).attr("href") == get_pathname_with_leading_slash() && (main_object(this).closest(".battlefield-start-choose_rival-variant").addClass("battlefield-start-choose_rival-variant__active"),
                            main_object(this).is(".battlefield-start-choose_rival-variant-link__connect"))) {
                            var a = main_object(this).closest(".battlefield-start-choose_rival-variant").find(".battlefield-start-choose_rival-variant-url-input");
                            a.val(location.href).attr("data-value", location.href);
                            a.on("click",function () {
                                main_object(this).trigger("select")
                            }).on("keydown keyup", function (a) {
                                (a.ctrlKey || a.metaKey) && 67 == a.keyCode || a.preventDefault()
                            })
                        }
                    })
                })();
                (function () {
                    var a = get_pathname_with_leading_slash();
                    0 == a.replace(/^\/[a-z]{2}\//, "/").toLowerCase().indexOf("/id") && (a = a.replace(/\/$/,
                        ""), main_object(".battlefield-start-ships_types-gap").removeClass("none"), -1 != a.indexOf("/classic") ? (main_object(".battlefield-start-ships_type__classic").addClass("battlefield-start-ships_type__active"), main_object(".battlefield-start-ships_type-link").attr("href", a), main_object(".battlefield-start-ships_type__default .battlefield-start-ships_type-link").attr("href", a.replace(/\/classic\/?/, ""))) : (main_object(".battlefield-start-ships_type__default").addClass("battlefield-start-ships_type__active"), main_object(".battlefield-start-ships_type-link").attr("href",
                        a), main_object(".battlefield-start-ships_type__classic .battlefield-start-ships_type-link").attr("href", a + "/classic")))
                })()
            })();
            //if sound-on clicked - store value and make clicksound
            (function () {
                which_soundfiles_available() && main_object(".setting__sound").removeClass("none");
                main_object(".setting").each(function () {
                    var a = main_object(this).attr("data-name"), c = "setting__" + a, g = main_object("#" + c);
                    main_object.cookie(c) && g.attr("checked", "on" == main_object.cookie(c) ? !0 : !1);
                    g.click(function () {
                        E[a] = main_object(this).is(":checked") ? "on" : "off";
                        main_object.cookie(c, E[a], {expires: 365, path: "/", domain: "." + u});
                        "sound" == a && "on" == E[a] && play_sound("click")
                    });
                    E[a] = g.is(":checked")
                })
            })();
            (function () {
                function create_random_ship_positions(a) {
                    create_empty_battlefield();
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
                    g = own_battlefield_some_variable;
                    for (var j in a) {
                        d = a[j].coords;
                        for (f = 0; f < d.length; f++)e = d[f], 0 === f && va(e.y, e.x, a[j].len, a[j].pos, g, a[j].id), g.find("tr:nth-child(" + (e.y + 1) + ") td:nth-child(" + (e.x + 1) + ")").removeClass("battlefield-cell__empty").addClass("battlefield-cell__busy")
                    }
                    placing_ships_manually_on_own_field();
                    main_object(".battlefields").removeClass("battlefields__handly");
                    main_object(".battlefield-start").removeClass("none")
                }

                //this is "place ships from clear sheet" ONCLICK EVENT
                main_object(".placeships-variant__hands").click(function () {
                    create_empty_battlefield();
                    main_object(".battlefields").addClass("battlefields__handly");
                    main_object(".battlefield-start").addClass("none");
                    var a = main_object(".port-lines");
                    a.html("");
                    for (var g =
                        0; g < s.length; g++) {
                        for (var d = s[g], e = main_object('<div class="port-line clearfix" />'), f = 0; f < d.count; f++) {
                            var h = main_object('<div class="port-ship" />'), i = ua(d.size, "h", ca());
                            h.attr("style", i.attr("style")).append(i);
                            e.append(h)
                        }
                        a.append(e)
                    }
                    placing_ships_manually_on_own_field();
                    main_object(this).addClass("placeships-variant__hands_inactive")
                });

                //this is "place ships randomly" ONCLICK EVENT
                main_object(".placeships-variant__randomly").click(function () {
                    create_random_ship_positions(!0);
                    main_object(".placeships-variant__hands_inactive").removeClass("placeships-variant__hands_inactive")
                });

                create_random_ship_positions();

                //this is start button ONCLICK EVENT
                main_object(".battlefield-start-button").attr("disabled", null).click(function () {
                    main_object(this).attr("disabled",
                        "disabled");
                    main_object(".placeships").addClass("none");
                    var a = main_object(".ship-box__draggable");
                    a.draggable("destroy");
                    a.unbind("click");
                    a.removeClass("ship-box__draggable");
                    make_notification("connect-to-server");
                    send_data_with_ships()
                })
            })();
            (function () {
                var a = main_object(".chat-teletype");
                a.bind("keydown", function (a) {
                    13 == a.keyCode ? (a = main_object(".chat-teletype").val(), a = main_object.trim(a), "" != a ? (some_reach_goal_var_or_function.reachGoal("chatMessage"), N = !1, low_level_connection_invoker({command: "chat-message", message: a}, !0, x, http_error_handler_function), a = !0) : a = !1, a && main_object(".chat-teletype").val("")) : N || (N = !0, low_level_connection_invoker({command: "chat-message-typing"}, !0, x, http_error_handler_function))
                });
                a.bind("keyup blur",
                    function (a) {
                        if (N) {
                            var b = "blur" == a.type ? 0 : 3E3;
                            13 != a.keyCode && (clearTimeout(Ia), Ia = setTimeout(function () {
                                N = !1;
                                low_level_connection_invoker({command: "chat-message-stop-typing"}, !0, x, http_error_handler_function)
                            }, b))
                        }
                    })
            })();
            (function () {
                document_title_var = document_obj.title;
                document_obj.onfocusin = function (a) {
                    "undefined" == typeof a && null == event.toElement && (L = !0)
                };
                document_obj.onfocusout = function (a) {
                    "undefined" == typeof a && null == event.toElement && (L = !1)
                };
                main_object(window_obj).focus(function () {
                    L = !0
                }).blur(function () {
                    L = !1
                })
            })();
            (function () {
                main_object(".restart").click(function () {
                    location.reload(!0)
                });
                main_object(".leave-link").attr("href", location.href).on("click",
                    function (a) {
                        function b() {
                            location.reload(!0)
                        }

                        a.preventDefault();
                        $ = !0;
                        low_level_connection_invoker({command: "leave"}, !1, b, b)
                    })
            })()
        })();

        //this function changes http link to https if page protocol is https
        (function () {
            main_object(".lang-link").each(function () {
                var a = main_object(this).attr("href");
                if ("https" == protocol_type_http_or_https()) {
                    var a = main_object(this).attr("href").replace("http://", "").substr(0, 2), c = location.pathname.replace(/^\/[a-z]{2}\//, "/");
                    main_object(this).attr("href", "https://" + u + "/" + a + c)
                } else main_object(this).attr("href", a.replace(/\/$/, "") + location.pathname)
            })
        })();
        (function () {
            try {
                var a = !1, c = main_object(".sda");
                if (c.length) {
                    var g = c.find(".sda-block"), d = c.height(),
                        e = parseInt(g.css("padding-top"), 10), g = function () {
                            c.removeClass("sda__fixed");
                            var f = c.offset().top + d + e;
                            main_object(window_obj).height() > f && c.addClass("sda__fixed");
                            a || (main_object(".sda__vh").removeClass("sda__vh"), a = !0)
                        };
                    main_object(window_obj).resize(g);
                    g()
                }
            } catch (f) {
            }
        })();
        (function () {
            if (/(ipad|iphone)/i.test(window_obj.navigator.userAgent)) {
                var a = function () {
                    var c = main_object(".sound:not([data-inited])").first();
                    c.length ? (c.on("canplay", function () {
                        main_object(this).attr("data-inited", "yes")
                    }), c.get(0).play(), c.get(0).pause()) : main_object(document_obj).off("touchstart", a)
                };
                main_object(document_obj).on("touchstart",
                    a)
            }
        })();
        //enabling link for Chrome
        window_obj.chrome && window_obj.chrome.webstore && main_object(".copyright-link__chrome").removeClass("none");
        "https:" == window_obj.location.protocol && main_object(".body").addClass("body__ssl");
        (function () {
            main_object(".body-iframe a[href^='mailto:']").on("click", function () {
                window_obj.top.location = main_object(this).attr("href");
                return!1
            })
        })();
        (function () {
            function a() {
                var a = main_object(".langs__opened");
                a.length && a.removeClass("langs__opened").attr("style", "")
            }

            main_object(".langs");
            main_object(".lang__selected .lang-link").on("click", function (c) {
                var d = main_object(c.target);
                c.preventDefault();
                d.closest(".langs__opened").length ?
                    a() : (c = main_object(".langs"), c.is(".langs__opened") || c.addClass("langs__opened"))
            });
            var c = (main_object("html").attr("data-accept-language") || "").split(",");
            if (c.length && c[0].length)for (var g = 0; g < c.length; g++) {
                var d = main_object(".lang__" + c[g]);
                d.length && d.addClass("lang__priority")
            }
            main_object(document_obj).click(function (c) {
                main_object(c.target).closest(".langs").length || a()
            });
            main_object(document_obj).keyup(function (b) {
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
                "cancel" == c && (e = a(main_object.cookie("review-cancel-count")) +
                    1, main_object.cookie("review-cancel-count", e, {expires: 3650, path: "/", domain: "." + u}), e *= 7);
                main_object.cookie("review", c, {expires: e, path: "/", domain: "." + u})
            }

            var g = a(main_object.cookie("visit"));
            main_object.cookie("visit", g + 1, {expires: 3650, path: "/", domain: "." + u});
            window_obj.chrome && window_obj.chrome.webstore && !main_object(".body-iframe").length && 50 < a(main_object.cookie("visit")) && "undefined" == typeof main_object.cookie("review") && (main_object(".notification__cws .notification-submit__accept").click(function () {
                c("accept");
                var a = main_object(this).attr("data-target");
                location.href = a
            }), main_object(".notification__cws .notification-submit__cancel").click(function () {
                c("cancel");
                main_object(".body").removeClass("body__game_over");
                main_object(".notification__init").removeClass("none");
                main_object(".notification__cws").addClass("none")
            }), main_object(".body").addClass("body__game_over"), main_object(".notification__init").addClass("none"), main_object(".notification__cws").removeClass("none"))
        })()
    })
})(window, document);
