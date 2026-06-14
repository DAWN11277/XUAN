/**
 * 文案格式化：被 archive / end 等命名相关模块共用
 */
(function (G) {
    G.namingFormat = function (s) {
        if (s == null || s === '') return '';
        return String(s)
            .replace(/[，。、；：]/g, '\n')
            .replace(/,/g, '\n')
            .replace(/\./g, '\n')
            .replace(/\n{3,}/g, '\n\n')
            .trim();
    };
})(window.Guanji);
