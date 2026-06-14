/**
 * 逐字显现动画：被 7+ 页面模块共用
 */
(function (G) {
    G.TextRevealController = {
        _token: 0,
        abort() { this._token++; },
        get token() { return this._token; }
    };

    G.textReveal = function (el, text, msPerChar, opts) {
        opts = opts || {};
        const myTok = G.TextRevealController.token;
        const extraClass = opts.extraCharClass ? (' ' + opts.extraCharClass) : '';
        const total = text.length;
        return new Promise(function (resolve) {
            if (!opts.append) el.innerHTML = '';
            let i = 0;
            function step() {
                if (G.TextRevealController.token !== myTok) return resolve();
                if (i >= text.length) {
                    if (opts.onDone) opts.onDone();
                    return resolve();
                }
                const ch = text[i++];
                if (ch === '\n') {
                    el.appendChild(document.createElement('br'));
                    return void G.addT(step, msPerChar);
                }
                const span = document.createElement('span');
                span.className = 'reveal-char' + (ch === ' ' && opts.useSpaceClass ? ' space' : '') + extraClass;
                span.textContent = ch;
                el.appendChild(span);
                if (opts.onChar) opts.onChar(i, total);
                G.addT(step, msPerChar);
            }
            step();
        });
    };
})(window.Guanji);
