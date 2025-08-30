-- Creates subscriptions table if missing
CREATE TABLE IF NOT EXISTS subscriptions (
  id          SERIAL PRIMARY KEY,
  tg_user_id  BIGINT UNIQUE NOT NULL,
  plan        TEXT NOT NULL,
  expires_at  TIMESTAMPTZ NULL,
  status      TEXT NOT NULL DEFAULT 'active',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_subscriptions_tg_user_id ON subscriptions(tg_user_id);
