# Quick fix: add missing pg/express types

This zip contains an updated `package.json` that adds the missing `@types/pg` (and also `@types/express` + `@types/node`),
plus `express` in dependencies (many of your files import it).

## How to apply
1) In GitHub, open your repo and click **Add file → Upload files**.
2) Drag **only `package.json`** from this zip into the root of your repo and commit to `main`.
3) Railway will auto-redeploy. The TS7016 errors should disappear.
4) If your Dockerfile runs a build, you're good. If not, use the scripts:
   - `npm run build` → compiles TypeScript to `dist/`
   - `npm start` → runs `node dist/server.js`
