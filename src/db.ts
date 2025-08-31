import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;
export const pool = connectionString
  ? new Pool({ connectionString, ssl: (/amazonaws|railway/).test(connectionString) ? { rejectUnauthorized: false } : undefined })
  : undefined;

export async function pingDb(): Promise<boolean> {
  if (!pool) return false;
  try {
    const res = await pool.query('SELECT 1 as ok');
    return res.rows?.[0]?.ok === 1;
  } catch {
    return false;
  }
}
