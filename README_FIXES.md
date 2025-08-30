# FOMO Superbot – Build Fix Pack

This zip contains the minimal fixes to stop TypeScript build failures on Railway:
- Proper ESM config (`tsconfig.json` with `NodeNext`)
- Typed Express handlers (no implicit `any`)
- Installed type packages for `express`, `pg`, `node`
- Clean `server.ts` and `db.ts`

## Files in this pack
- package.json
- tsconfig.json
- src/server.ts
- src/db.ts

## How to use
1. Unzip into your repo root (it will create/overwrite those files).
2. Commit & push to GitHub.
3. Railway will build with:
   ```
   npm ci
   npm run build
   npm start
   ```
4. Healthcheck: visit `/health` — you should see `OK`.
