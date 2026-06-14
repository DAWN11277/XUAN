/**
 * 页面路由：被全部 9 个页面模块共用
 */
(function (G) {
    G.currentId = 'page-welcome';
    G._onEnter = null;

    G.setPageEnterHandler = function (fn) {
        G._onEnter = fn;
    };

    G.goToPageBase = function (nextId, exitMode) {
        G.playNoiseTransition();
        G.clearTimers();
        G.TextRevealController.abort();

        const cur = document.getElementById(G.currentId);
        const next = document.getElementById(nextId);
        if (!next || cur === next) {
            next.classList.add('active');
            G.currentId = nextId;
            if (G._onEnter) G._onEnter(nextId);
            return;
        }

        cur.classList.remove('active');
        cur.classList.remove('exit-shrink', 'exit-split-l', 'exit-split-r', 'exit-split-both', 'exit-fade');
        if (exitMode === 'split') {
            cur.classList.add('exit-split-l');
        } else if (exitMode === 'fade') {
            cur.classList.add('exit-fade');
        } else {
            cur.classList.add('exit-shrink');
        }

        G.addT(function () {
            cur.classList.remove('exit-shrink', 'exit-split-l', 'exit-split-r', 'exit-split-both', 'exit-fade');
            next.classList.add('active');
            G.currentId = nextId;
            if (G._onEnter) G._onEnter(nextId);
        }, 780);
    };

    G.goToPage = function (nextId, exitMode) {
        if (nextId === 'page-direction' && G.currentId === 'page-interlude') {
            G.playNoiseTransition();
            G.clearTimers();
            G.TextRevealController.abort();
            const cur = document.getElementById(G.currentId);
            const next = document.getElementById(nextId);
            cur.classList.remove('active');
            cur.classList.remove('exit-shrink', 'exit-split-l', 'exit-split-r', 'exit-split-both', 'exit-fade');
            cur.classList.add('exit-split-both');
            G.addT(function () {
                cur.classList.remove('exit-shrink', 'exit-split-l', 'exit-split-r', 'exit-split-both', 'exit-fade');
                next.classList.add('active');
                G.currentId = nextId;
                if (G._onEnter) G._onEnter(nextId);
            }, 780);
            return;
        }
        G.goToPageBase(nextId, exitMode);
    };
})(window.Guanji);
