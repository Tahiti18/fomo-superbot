# FOMO Superbot – DB exports fix (ESM, Railway)

This drop-in patch fixes build errors:

- `TS18048: 'pool' is possibly 'undefined'`
- `TS2305: Module '../db.js' has no exported member 'pool'`
- `TS2305: Module '../db.js' has no exported member 'pingDb'`

## What changed
- `src/db.ts` now **exports**:
  - `getPool(): Pool` — lazily creates and returns a singleton Pool (never undefined).
  - `pingDb(): Promise<void>` — simple connectivity check (kept for compatibility).

## How to use
1) Place `src/db.ts` into your repo (replace existing file if present).
2) Update any files that import `pool`:

   **Before**
   ```ts
   import { pool } from '../db.js'
   const res = await pool.query('SELECT 1')
   ```

   **After**
   ```ts
   import { getPool } from '../db.js'
   const res = await getPool().query('SELECT 1')
   ```

   > Keep the `.js` extension in import specifiers — this is required by Node16 ESM resolution.

3) If you import `pingDb`, keep it as:
   ```ts
   import { pingDb } from '../db.js'
   ```

## Env on Railway
- `DATABASE_URL` must be set (from your Railway Postgres).
- Optional: `PGSSLMODE=require` if your PG requires SSL. The code already enables SSL if this var is present.

## TypeScript (confirm)
In `tsconfig.json`:
```json
{
  "compilerOptions": {
    "module": "Node16",
    "moduleResolution": "Node16",
    "target": "ES2022",
    "esModuleInterop": true,
    "strict": true
  }
}
```

## Done
Commit, push, and redeploy on Railway.
