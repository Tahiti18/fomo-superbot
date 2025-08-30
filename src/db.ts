import pkg from "pg";
import { CFG } from "./config.js";
const { Pool } = pkg;

export const pool = new Pool({
  connectionString: CFG.DB_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

export async function ensureSchema() {
  const sql = `
  CREATE TABLE IF NOT EXISTS subscriptions (
    id SERIAL PRIMARY KEY,
    tg_user_id BIGINT NOT NULL UNIQUE,
    plan TEXT NOT NULL DEFAULT 'none',
    status TEXT NOT NULL DEFAULT 'inactive',
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );`;
  await pool.query(sql);
}
