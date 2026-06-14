/**
 * AI 解读 API：被 draw / reading / archive / end 模块共用
 */
(function (G) {
    G.fetchChatReply = async function (message) {
        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: message }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || '请求失败');
        return data.reply;
    };

    G.buildInterpretationMessage = function (selectedDirection, drawSeq) {
        const cards = drawSeq.map(function (d, i) {
            return '牌' + (i + 1) + '：' + d.name + '（' + d.sym + '）';
        }).join('\n');
        return (
            '用户咨询方向：' + selectedDirection + '\n' +
            '抽到的牌：\n' + cards + '\n\n' +
            '请生成温暖、克制的中文塔罗解读。严格只返回 JSON，不要 markdown 代码块。字段：' +
            'read1（长度为3的字符串数组，每张牌一条，格式如「牌1解读——隐者：...」）、' +
            'read2Body（字符串）、read3Paras（长度为4的字符串数组）、' +
            'namingLabel、namingP2a、namingP2b、namingP3、endTip'
        );
    };

    G.parseInterpretationReply = function (reply) {
        try {
            const match = reply.match(/\{[\s\S]*\}/);
            if (!match) return null;
            const parsed = JSON.parse(match[0]);
            if (!Array.isArray(parsed.read1) || parsed.read1.length < 3) return null;
            return parsed;
        } catch (e) {
            return null;
        }
    };

    G.mergePackFromReply = function (parsed, fallback) {
        return {
            read1: parsed.read1.slice(0, 3),
            read2Body: parsed.read2Body || fallback.read2Body,
            read3Paras: (parsed.read3Paras || fallback.read3Paras).slice(0, 4),
            namingLabel: parsed.namingLabel || fallback.namingLabel,
            namingP2a: parsed.namingP2a || fallback.namingP2a,
            namingP2b: parsed.namingP2b || fallback.namingP2b,
            namingP3: parsed.namingP3 || fallback.namingP3,
            endTip: parsed.endTip || parsed.namingLabel || fallback.endTip,
        };
    };
})(window.Guanji);
