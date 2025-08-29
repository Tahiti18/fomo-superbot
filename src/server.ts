
import express from 'express';
import { CFG } from './config.js';
import { webhook } from './bot.js';

const app = express();
app.use(express.json());
app.get('/health', (_req, res) => res.json({ ok: true }));
app.post('/tg/webhook', webhook);

app.listen(CFG.PORT, async () => {
  console.log('Listening on', CFG.PORT);
  try {
    const url = `${CFG.BOT_PUBLIC_URL}/tg/webhook`;
    await fetch(`https://api.telegram.org/bot${CFG.BOT_TOKEN}/setWebhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Telegram-Bot-Api-Secret-Token': CFG.BOT_SECRET },
      body: JSON.stringify({ url })
    });
    console.log('Webhook set:', url);
  } catch (e) { console.error('Webhook set failed', e); }
});
