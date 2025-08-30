-- Minimal schema for user subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
  id SERIAL PRIMARY KEY,
  tg_user_id BIGINT NOT NULL UNIQUE,
  plan TEXT NOT NULL DEFAULT 'none',
  status TEXT NOT NULL DEFAULT 'inactive',
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
