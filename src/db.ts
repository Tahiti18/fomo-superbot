// src/db.ts
// Centralized Postgres connection that is ALWAYS defined when accessed.
// ESM-friendly, works with Node16 module + moduleResolution.

import { Pool } from 'pg'

let _pool: Pool | null = null

export function getPool(): Pool {
  if (_pool) return _pool
  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error('DATABASE_URL is not set')
  }
  _pool = new Pool({
    connectionString: url,
    ssl: process.env.PGSSLMODE ? { rejectUnauthorized: false } : undefined
  })
  return _pool
}

// kept for compatibility with existing imports: server/src may import { pingDb } from '../db.js'
export async function pingDb(): Promise<void> {
  const pool = getPool()
  await pool.query('SELECT 1')
}
