# FOMO Superbot — ESM + Railway-ready (TypeScript)

- Uses **ESM** everywhere (`type: module`).
- `tsconfig.json` targets **ES2022** and uses **node16** module resolution.
- Dockerfile compiles TS in a build stage and runs `node dist/server.js` in runtime.
- Fixes the previous errors:
  - `require is not defined in ES module scope` ➜ replaced with ESM imports.
  - `TS2307: Cannot find module 'pg'` ➜ installed `pg` + `@types/pg` and added minimal `db.ts`.
  - `grammy` types are built-in; strict ctx typing demonstrated in `handlers/example.ts`.
  - Healthcheck served at `/health` returning **200 OK**.

## Deploy (Railway)
1. Set env var `BOT_TOKEN` (required).
2. (Optional) Set `DATABASE_URL` if you have Postgres.
3. (Recommended) Set `PUBLIC_URL` (your app base URL) so `/tg/set` can set the webhook.
4. Deploy. The service listens on `$PORT` (defaults to **8080**).

## Set webhook manually
```
https://api.telegram.org/bot<YOUR_TOKEN>/setWebhook?url=https://<your-domain>/tg/webhook
```

