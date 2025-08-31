// src/db.ts
// Robust Postgres pool initializer for Railway & ESM.
// Guarantees a non-undefined Pool or throws at startup (so TS won't complain).

import { Pool } from 'pg'

type GlobalWithPool = typeof globalThis & { __pgPool?: Pool }

// Build connection options, supporting Railway's self-signed cert
function makePool(): Pool {
  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error('DATABASE_URL is not set')
  }

  const ssl =
    process.env.PGSSLMODE === 'disable'
      ? false
      : { rejectUnauthorized: false } as any

  return new Pool({ connectionString: url, ssl })
}

/**
 * Returns a singleton Pool. Never undefined.
 * If it cannot be created, throws immediately so the process fails fast.
 */
export function getPool(): Pool {
  const g = globalThis as GlobalWithPool
  if (!g.__pgPool) {
    g.__pgPool = makePool()
  }
  return g.__pgPool
}

// Optional utility for graceful shutdown
export async function closePool(): Promise<void> {
  const g = globalThis as GlobalWithPool
  if (g.__pgPool) {
    await g.__pgPool.end()
    delete g.__pgPool
  }
}