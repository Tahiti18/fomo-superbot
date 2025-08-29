// src/server.ts
import express from 'express';
import { webhook } from './bot.js';
import { CFG } from './config.js';

const app = express();

// Healthcheck for Railway
app.get('/health', (_, res) => {
  res.status(200).send('OK');
});

// Telegram webhook
app.use(express.json());
app.use(webhook, (req, res) => {
  res.status(200).end();
});

app.listen(CFG.PORT, () => {
  console.log(`FOMO Superbot listening on ${CFG.PORT}`);
});
