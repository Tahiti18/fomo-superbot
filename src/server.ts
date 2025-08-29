
import express from 'express';
import { CFG } from './config.js';
import { webhook } from './bot.js';

const app = express();
app.use(express.json());

// Healthcheck for Railway
app.get('/health', (_req, res) => res.status(200).send('OK'));

// Telegram webhook endpoint
app.post('/tg/webhook', webhook);

// Optional manual endpoint to set webhook after first deploy
app.post('/tg/setwebhook', async (_req, res) => {
  try {
    if (!CFG.BOT_PUBLIC_URL) {
      return res.status(400).json({ error: 'BOT_PUBLIC_URL not set' });
    }
    const url = `${CFG.BOT_PUBLIC_URL}/tg/webhook`;
    const r = await fetch(`https://api.telegram.org/bot${CFG.BOT_TOKEN}/setWebhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Telegram-Bot-Api-Secret-Token': CFG.BOT_SECRET },
      body: JSON.stringify({ url })
    });
    const j = await r.json();
    return res.json({ ok: true, url, telegram: j });
  } catch (e:any) {
    return res.status(500).json({ error: e?.message || 'failed' });
  }
});

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : CFG.PORT;

app.listen(PORT, async () => {
  console.log('FOMO Superbot listening on', PORT);

  // Try to set webhook if BOT_PUBLIC_URL is present; otherwise skip silently
  if (CFG.BOT_PUBLIC_URL) {
    try {
      const url = `${CFG.BOT_PUBLIC_URL}/tg/webhook`;
      const r = await fetch(`https://api.telegram.org/bot${CFG.BOT_TOKEN}/setWebhook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Telegram-Bot-Api-Secret-Token': CFG.BOT_SECRET },
        body: JSON.stringify({ url })
      });
      const j = await r.json();
      console.log('Webhook set response:', j);
    } catch (e) {
      console.error('Webhook set failed (non-fatal):', e);
    }
  } else {
    console.log('BOT_PUBLIC_URL not set; skipping auto-webhook.');
  }
});
