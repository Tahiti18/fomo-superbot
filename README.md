# FOMO Superbot [MENU-V3]

## Setup
1. Copy `.env.example` to `.env` and fill with real values.
2. Deploy to Railway (with Postgres plugin).
3. Run migrations:
   ```
   psql $DATABASE_URL -f db/schema.sql
   ```
4. Set Telegram webhook:
   ```
   https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=<BOT_PUBLIC_URL>/tg/webhook&secret_token=fomo-secret-123
   ```
5. In Telegram: `/start` or `/menu`.

## Notes
- Subscription check reads from `subscriptions` table.
- Logs will show [MENU-V3] if this version is active.
