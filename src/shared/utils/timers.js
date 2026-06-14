/**
 * 全局定时器：被 welcome / brand / emotion / interlude / direction /
 * draw / reading / archive / end 等全部页面模块共用
 */
(function (G) {
    G.timers = [];
    G.clearHooks = [];

    G.registerClearHook = function (fn) {
        G.clearHooks.push(fn);
    };

    G.addT = function (fn, ms) {
        const id = setTimeout(fn, ms);
        G.timers.push(id);
        return id;
    };

    G.clearTimers = function () {
        G.timers.forEach(clearTimeout);
        G.timers.length = 0;
        G.clearHooks.forEach(function (hook) { hook(); });
        if (G.TextRevealController) G.TextRevealController.abort();
    };
})(window.Guanji = window.Guanji || {});
