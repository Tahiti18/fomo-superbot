import pkg from "pg";
const { Pool } = pkg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

export async function ensureSchema() {
  const sql = `
  create table if not exists subscriptions (
    id serial primary key,
    tg_user_id bigint not null,
    plan text not null,
    status text not null default 'inactive',
    expires_at timestamptz,
    created_at timestamptz not null default now()
  );
  `;
  await pool.query(sql);
}
