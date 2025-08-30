# FOMO Superbot — Max Pack

This bundle gives you a working Telegram bot with:
- Express server + healthcheck (`/health`)
- Grammy bot with `/start`, `/menu`, `/status`, `/help`, `/buy` (stub)
- Inline-button UI (Safety, Price & Alpha, Account)
- Postgres wiring + auto-migration for `subscriptions` table
- Account status card reading from DB

## Quick start (Railway)
1) Create (or keep) a Node service.
2) Set env vars (or use `.env` locally). Minimum:
   - `BOT_TOKEN`
   - `BOT_SECRET`
   - `BOT_PUBLIC_URL` (your Railway URL)
   - `DATABASE_URL` (Railway Postgres variable)
   - `AUTO_MIGRATE=true`
3) Deploy. You should see `FOMO Superbot listening on 8080` in logs.
4) Set Telegram webhook (once):
   `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=<BOT_PUBLIC_URL>/tg/webhook&secret_token=<BOT_SECRET>`
5) DM your bot `/start`.

## DB
On boot, the server creates `subscriptions` if it doesn't exist.
To fake-premium for your account, insert a row like:
```sql
insert into subscriptions (tg_user_id, plan, status, expires_at)
values (<your_telegram_id>, 'starter', 'active', '2030-01-01T00:00:00Z');
```

