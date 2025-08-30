// src/server.ts
import express from "express";
import { CFG } from "./config.js";
import { cryptoPayWebhook } from "./payments/cryptoPay.js";

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

// CryptoPay webhook (safe — won’t crash app if it fails)
app.post("/crypto/webhook", async (req, res) => {
  try {
    await cryptoPayWebhook(req, res);
  } catch (e) {
    console.error("CryptoPay webhook error:", e);
    res.status(500).end();
  }
});

// Root
app.get("/", (_req, res) => res.send("FOMO Superbot API"));

const PORT = Number(process.env.PORT || CFG.PORT || 8080);
app.listen(PORT, () => console.log(`FOMO Superbot listening on ${PORT}`));
