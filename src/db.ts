import pkg from "pg";
import { CFG } from "./config.js";

const { Pool } = pkg;
export const pool = new Pool({
  connectionString: CFG.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

// Ensure table exists
export async function initDB() {
  await pool.query(`CREATE TABLE IF NOT EXISTS subscriptions (
    id SERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    tier TEXT NOT NULL,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
  );`);
}
