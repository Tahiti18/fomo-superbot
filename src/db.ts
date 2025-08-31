/**
 * src/db.ts
 * Centralized Postgres pool for the app.
 * Exports: `pool` and `pingDb()`
 */
import { Pool } from "pg";

// Prefer DATABASE_URL (Railway / Heroku style). Fallback to discrete vars.
const {
  DATABASE_URL,
  PGHOST,
  PGPORT,
  PGUSER,
  PGPASSWORD,
  PGDATABASE,
} = process.env as Record<string, string | undefined>;

const pool = new Pool(
  DATABASE_URL
    ? {
        connectionString: DATABASE_URL,
        // Railway PG often requires SSL. Allow env override with PGSSL=false.
        ssl:
          process.env.PGSSL === "false"
            ? false
            : { rejectUnauthorized: false },
      }
    : {
        host: PGHOST || "localhost",
        port: Number(PGPORT || 5432),
        user: PGUSER,
        password: PGPASSWORD,
        database: PGDATABASE,
        ssl:
          process.env.PGSSL === "false"
            ? false
            : { rejectUnauthorized: false },
      }
);

/** Simple connectivity test used by healthchecks or startup. */
export async function pingDb(): Promise<boolean> {
  try {
    const res = await pool.query("SELECT 1 as ok");
    return res.rows?.[0]?.ok === 1;
  } catch (_err) {
    return false;
  }
}

export { pool };
