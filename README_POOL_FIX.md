
# FOMO Superbot – Pool/ESM Fix Pack

This pack fixes the build error `TS18048: 'pool' is possibly 'undefined'` and
the earlier TypeScript/ESM issues on Railway.

## What's inside
- `src/db.ts` — Singleton `getPool()` that **never returns undefined**. If `DATABASE_URL`
  is missing it throws on startup, which is safer and satisfies TypeScript.
- `tsconfig.json` — Node16 ESM settings (`"module": "Node16"`, `"moduleResolution": "Node16"`).

## How to apply
1. **Add the files**
   - Copy `src/db.ts` into your repo (replace any existing `db.ts`). Keep the path `src/db.ts`.
   - If your project doesn't have these ESM settings, replace/merge `tsconfig.json` with the one in this pack.

2. **Update handlers that use the DB**
   Anywhere you previously used a possibly-undefined `pool`, change to the guaranteed getter:

   ```ts
   // BEFORE
   // import { pool } from '../db'
   // const res = await pool?.query('SELECT 1')

   // AFTER
   import { getPool } from '../db'
   const pool = getPool()
   const res = await pool.query('SELECT 1')
   ```

   Example for `src/handlers/account.ts`:

   ```ts
   import { getPool } from '../db'

   export async function getAccount(ctx: any) {
     const pool = getPool()
     const { rows } = await pool.query('SELECT * FROM accounts WHERE id = $1', [ctx.from?.id])
     // ...use rows
   }
   ```

3. **Ensure env vars on Railway**
   - `DATABASE_URL` (from your Railway Postgres plugin)
   - `PGSSLMODE` = `require` (or leave unset; SSL will be enabled with `rejectUnauthorized:false`)
   - `TELEGRAM_TOKEN` for your bot

4. **Rebuild and deploy**
   - Commit the changes and trigger a deploy, or redeploy from Railway.

## Notes
- The pool is cached on `globalThis` to avoid creating multiple connections in serverless-style environments.
- `closePool()` is provided if you want to dispose on shutdown (`SIGTERM`).
