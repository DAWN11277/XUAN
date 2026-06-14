const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_MODEL = process.env.DEEPSEEK_MODEL || 'deepseek-chat';
const DEEPSEEK_URL = 'https://api.deepseek.com/chat/completions';

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, '..')));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

/**
 * POST /api/chat
 * Body: { "message": "用户输入" }
 * 或:   { "messages": [{ "role": "user", "content": "..." }] }
 */
app.post('/api/chat', async (req, res) => {
  try {
    if (!DEEPSEEK_API_KEY) {
      return res.status(500).json({ error: '未配置 DEEPSEEK_API_KEY' });
    }

    const { message, messages } = req.body || {};

    let chatMessages;

    if (Array.isArray(messages) && messages.length > 0) {
      chatMessages = messages;
    } else if (typeof message === 'string' && message.trim()) {
      chatMessages = [{ role: 'user', content: message.trim() }];
    } else {
      return res.status(400).json({ error: '请提供 message 或 messages' });
    }

    const response = await fetch(DEEPSEEK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: DEEPSEEK_MODEL,
        messages: chatMessages,
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || 'DeepSeek 请求失败',
      });
    }

    const reply = data.choices?.[0]?.message?.content ?? '';

    res.json({
      reply,
      model: data.model,
      usage: data.usage,
    });
  } catch (err) {
    res.status(500).json({ error: err.message || '服务器错误' });
  }
});

app.listen(PORT, () => {
  console.log(`API: http://localhost:${PORT}`);
  console.log(`POST http://localhost:${PORT}/api/chat`);
});
