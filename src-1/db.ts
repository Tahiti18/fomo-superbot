// src/db.ts
import { Pool } from 'pg';

// Lazy singleton, but also export an eager instance named `pool`
// so existing imports like `import { pool } from '../db.js'` keep working.
let _pool: Pool | null = null;

export function getPool(): Pool {
  if (_pool) return _pool;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set');
  }

  const useSSL = !!process.env.PGSSLMODE || process.env.NODE_ENV === 'production';

  _pool = new Pool({
    connectionString,
    ssl: useSSL ? { rejectUnauthorized: false } : undefined,
  });

  return _pool;
}

// Eager instance for places importing `{ pool }`.
export const pool: Pool = getPool();

// Simple health-check helper.
export async function pingDb(): Promise<void> {
  await getPool().query('SELECT 1');
}

export type { Pool as PgPool } from 'pg';
