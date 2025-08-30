import express from "express";
import dotenv from "dotenv";
import { CFG } from "./config.js";
import { ensureSchema } from "./db.js";

dotenv.config();

const app = express();
app.use(express.json());

// Healthcheck (for Railway)
app.get("/health", (_req, res) => res.status(200).send("OK"));

// Telegram webhook (defer-load bot to avoid startup crashes)
app.post("/tg/webhook", async (req, res, next) => {
  try {
    const { webhook } = await import("./bot.js");
    // @ts-ignore grammy express handler
    return webhook(req, res, next);
  } catch (e) {
    console.error("Telegram webhook error:", e);
    return res.status(500).end();
  }
});

// Root
app.get("/", (_req, res) => res.send("FOMO Superbot API"));

// Boot
const PORT = CFG.PORT;
app.listen(PORT, async () => {
  try {
    if (CFG.AUTO_MIGRATE) await ensureSchema();
  } catch (e) {
    console.error("DB migration error:", e);
  }
  console.log(`FOMO Superbot listening on ${PORT}`);
});
