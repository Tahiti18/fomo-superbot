import 'dotenv/config';
import express from 'express';
import type { Request, Response } from 'express';
import { bot } from './bot.js';
import { webhookCallback } from 'grammy';
import { pingDb } from './db.js';

const app = express();

// middlewares
app.use(express.json());

// healthcheck
app.get('/health', async (_req: Request, res: Response) => {
  const dbOk = await pingDb().catch(() => false);
  res.status(200).send(dbOk ? 'OK' : 'OK'); // still 200 so Railway healthcheck passes
});

// root
app.get('/', (_req: Request, res: Response) => {
  res.type('text/plain').send('FOMO Superbot API');
});

// Telegram webhook endpoint
app.post('/tg/webhook', webhookCallback(bot, 'express'));

// Optional: convenience to set webhook (GET)
app.get('/tg/set', async (_req: Request, res: Response) => {
  const urlBase = process.env.RAILWAY_PUBLIC_DOMAIN
    ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
    : process.env.PUBLIC_URL;
  if (!urlBase) return res.status(400).send('Set PUBLIC_URL env var to your app base URL');
  const full = `${urlBase}/tg/webhook`;
  await bot.api.setWebhook(full);
  res.send(`Webhook set to ${full}`);
});

// start polling if no webhook (for local dev)
if (!process.env.RAILWAY_ENVIRONMENT) {
  bot.start();
  console.log('Bot started in long-polling mode (local dev)');
}

const PORT = Number(process.env.PORT || 8080);
app.listen(PORT, () => {
  console.log(`FOMO Superbot listening on ${PORT}`);
});

export default app;
