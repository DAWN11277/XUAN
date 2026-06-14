/**
 * 页面转场音效：被路由与各页面切换动画共用
 */
(function (G) {
    G.audioCtx = null;

    G.playNoiseTransition = function () {
        try {
            if (!G.audioCtx) G.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const dur = 0.5;
            const bufferSize = G.audioCtx.sampleRate * dur;
            const buffer = G.audioCtx.createBuffer(1, bufferSize, G.audioCtx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.35;
            const src = G.audioCtx.createBufferSource();
            src.buffer = buffer;
            const gain = G.audioCtx.createGain();
            const now = G.audioCtx.currentTime;
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.12, now + 0.08);
            gain.gain.linearRampToValueAtTime(0.12, now + dur * 0.55);
            gain.gain.linearRampToValueAtTime(0, now + dur);
            src.connect(gain);
            gain.connect(G.audioCtx.destination);
            src.start(now);
            src.stop(now + dur + 0.02);
        } catch (e) { /* ignore */ }
    };
})(window.Guanji);
