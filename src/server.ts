// src/server.ts
import express from "express";
import { CFG } from "./config.js";

const app = express();

// Healthcheck (for Railway)
app.get("/health", (_req, res) => res.status(200).send("OK"));

// Telegram webhook (defer-load bot to avoid startup crashes)
app.use(express.json());
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

const PORT = Number(process.env.PORT || CFG.PORT || 8080);
app.listen(PORT, () => console.log(`FOMO Superbot listening on ${PORT}`));
