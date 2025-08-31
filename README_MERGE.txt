How to use these core-fix files:

1) Add/replace these in your repo root:
   - Dockerfile
   - package.json
   - tsconfig.json
   - src/db.ts  (NEW)

2) Make sure your server imports and uses the shared DB pool, e.g.
   import { pool, pingDb } from "./db.js";   // after build it compiles to dist/db.js
   // optional: use `await pingDb()` during startup

3) Commit & push, then redeploy on Railway.

Notes:
- TypeScript is compiled with module=Node16 + moduleResolution=Node16 to match Node ESM.
- `pg` is installed and typings provided.
- Docker build installs dev deps in the build stage so `tsc` is available, then
  runtime image installs only prod deps for a smaller container.
