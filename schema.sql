-- Auto-created tables
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  tg_id BIGINT UNIQUE NOT NULL,
  username TEXT,
  tier TEXT DEFAULT 'None',
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(tg_id),
  plan TEXT,
  amount NUMERIC,
  tx_hash TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS memes (
  id SERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(tg_id),
  prompt TEXT,
  url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS raids (
  id SERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(tg_id),
  target TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
