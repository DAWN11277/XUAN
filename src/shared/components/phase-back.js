/**
 * 阶段返回按钮交互：被 reading / archive / end 三个模块共用
 */
(function (G) {
    G.wirePhaseBackTouch = function () {
        ['reading-back-btn', 'archive-back-btn', 'end-back-btn'].forEach(function (id) {
            const btn = document.getElementById(id);
            if (!btn || btn.dataset.backTouchWired) return;
            btn.dataset.backTouchWired = '1';
            btn.addEventListener('touchstart', function () {
                btn.classList.add('phase-back-lit');
            }, { passive: true });
            btn.addEventListener('touchend', function () {
                btn.classList.remove('phase-back-lit');
            }, { passive: true });
            btn.addEventListener('touchcancel', function () {
                btn.classList.remove('phase-back-lit');
            }, { passive: true });
        });
    };
})(window.Guanji);
