# FOMO Superbot (Cleaned Rebuild)

- Express + grammY (Telegram) + optional Postgres
- Webhook: /tg/webhook  (use ?secret=YOUR_SECRET if set)
- Health:  /health

Env vars to set on Railway:
- BOT_TOKEN
- WEBHOOK_SECRET (optional but recommended)
- DATABASE_URL (optional)

After deploy, set the webhook:
https://api.telegram.org/bot<YOUR_TOKEN>/setWebhook?url=https://<your-domain>/tg/webhook&secret_token=<WEBHOOK_SECRET>
