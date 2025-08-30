# FOMO Superbot — Max Pack (Drop-in)

**What you get**
- `/src` TypeScript sources
- `/dist/server.js` prebuilt to satisfy Railway healthcheck
- `Dockerfile`, `package.json`, `tsconfig.json`
- `.env.example` to copy to `.env`

**Deploy (Railway)**
1. Upload repo contents.
2. In Railway Variables, add your secrets (from `.env.example`).
3. Deploy — healthcheck lives at `/health`.

**Routes**
- `GET /health` → `OK`
- `POST /tg/webhook` → Telegram webhook (loads the bot lazily).

**Notes**
- You can run without building because `dist/server.js` is included.
- Later, run `npm run build` to compile `/src`.
