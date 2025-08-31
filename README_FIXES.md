# Railway + TypeScript (ESM) Fix Pack

Fixes these errors:
- `ReferenceError: require is not defined`
- `TS2307: Cannot find module 'pg'` / missing types
- Healthcheck failures
- Dev-only types not installed in runtime

## Apply
1) Replace `Dockerfile` with the one here.
2) Merge `package.json.MERGE_ME.json` into your existing `package.json`.
3) Replace `tsconfig.json` with the one here (or make it equivalent).
4) Ensure your entry is `src/server.ts`, listens on `process.env.PORT || 8080`, and serves `GET /health`.

### Example `src/server.ts`
```ts
import 'dotenv/config';
import express from 'express';
import { Bot, Context } from 'grammy';

const app = express();
app.use(express.json());

app.get('/health', (_, res) => res.status(200).send('OK'));

const botToken = process.env.BOT_TOKEN || '';
if (botToken) {
  const bot = new Bot<Context>(botToken);
  app.post('/tg/webhook', async (req, res) => {
    await bot.handleUpdate(req.body);
    res.sendStatus(200);
  });
}

const PORT = Number(process.env.PORT) || 8080;
app.listen(PORT, () => console.log(`FOMO Superbot listening on ${PORT}`));
```

### Example `src/db.ts`
```ts
import { Pool } from 'pg';
export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const query = (text: string, params?: any[]) => pool.query(text, params);
```

### Note on implicit any
Add explicit types, e.g. `(ctx: Context)` for grammy handlers to silence TS7006.
```ts
import { Context } from 'grammy';
bot.command('start', (ctx: Context) => ctx.reply('Hi'));
```
