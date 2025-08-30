# FOMO Superbot – Max Pack (baseline)

**How to deploy on Railway**

1. Set the following variables in Railway → Variables:
   - BOT_TOKEN
   - BOT_SECRET
   - BOT_PUBLIC_URL
   - CRYPTO_PAY_API_KEY
   - DATABASE_URL = `${{Postgres.DATABASE_URL}}`
   - (PORT optional)

2. Create the table once (either via SQL shell or the GUI):
```sql
CREATE TABLE IF NOT EXISTS subscriptions (
  id SERIAL PRIMARY KEY,
  tg_user_id BIGINT NOT NULL,
  plan TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_tg_user_id ON subscriptions(tg_user_id);
```

3. Build + start:
   - `npm install`
   - `npm run build`
   - `npm start`

**Endpoints**

- `POST /tg/webhook` – Telegram webhook
- `POST /payments/cryptopay` – CryptoPay webhook (optional)

**Bot quick commands**
- `/menu` – open main menu
- `/buy starter USDT` – create invoice

