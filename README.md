# FOMO Superbot (Express + grammy)

Minimal, production-ready Telegram bot with webhook for Railway.

## Env
Copy `.env.example` to `.env` and set:
- `BOT_TOKEN=123456:ABC...`
- `PORT=8080` (Railway sets this automatically)

## Local (optional)
```bash
npm ci
cp .env.example .env  # then edit BOT_TOKEN
npm start
```

## Railway
- Add a new **Service** from this repo/zip.
- Set Variables:
  - `BOT_TOKEN` = your bot token
- Deploy. You should see `FOMO Superbot listening on 8080` in logs.

## Telegram webhook
Replace <TOKEN> and <APP_URL>.
- Set webhook:
  https://api.telegram.org/bot<TOKEN>/setWebhook?url=<APP_URL>/tg/webhook
- Check:
  https://api.telegram.org/bot<TOKEN>/getWebhookInfo
- Delete (if needed):
  https://api.telegram.org/bot<TOKEN>/deleteWebhook
- Bot info:
  https://api.telegram.org/bot<TOKEN>/getMe
