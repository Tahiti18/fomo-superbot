# FOMO Superbot (ESM, Railway-ready)

## Local
1) `cp .env.example .env` and put your bot token.
2) `npm install`
3) `npm start`

## Railway
- Set env var `BOT_TOKEN` in Railway.
- Exposes `/health` for healthcheck and `/tg/webhook` for Telegram webhook.

## Telegram webhook helper
Use the following with your token (replace <TOKEN> if not already set in .env):

- Set: `https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://YOUR_APP/tg/webhook`
- Info: `https://api.telegram.org/bot<TOKEN>/getWebhookInfo`
- Delete: `https://api.telegram.org/bot<TOKEN>/deleteWebhook`
- Me: `https://api.telegram.org/bot<TOKEN>/getMe`
