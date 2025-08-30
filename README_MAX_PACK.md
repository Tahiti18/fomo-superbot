# FOMO Superbot — Max Pack (ESM)

## What’s inside
- ESM TypeScript project (NodeNext), Express server, grammy Telegram bot.
- Centralized UI with inline buttons.
- Postgres pool + auto `subscriptions` table.
- Account → Subscription status reads from DB.
- Dockerfile for Railway.
- Healthcheck at `/health`.

## Deploy (Railway)
1. Set env vars (see `.env.example`).
2. Deploy. Logs should show: `FOMO Superbot listening on 8080`.
3. Set webhook once (replace BOT_TOKEN and your Railway domain):
   https://api.telegram.org/bot<BOT_TOKEN>/setWebhook?url=https://<your-app>.railway.app/tg/webhook&secret_token=fomo-secret-123
4. DM the bot: `/start`.

## DB: subscriptions test row
INSERT INTO subscriptions (tg_user_id, plan, status, expires_at)
VALUES (111111111, 'starter', 'active', '2030-01-01T00:00:00Z')
ON CONFLICT (tg_user_id) DO UPDATE SET plan=excluded.plan, status=excluded.status, expires_at=excluded.expires_at;
