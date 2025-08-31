import { Pool } from "pg";

export const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    })
  : undefined;

export async function pingDb(): Promise<boolean> {
  try {
    if (!pool) return false;
    const r = await pool.query("select 1 as ok");
    return r.rows?.[0]?.ok === 1;
  } catch {
    return false;
  }
}
