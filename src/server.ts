// src/server.ts
import express from "express";
import { CFG } from "./config.js";
import { cryptoPayWebhook } from "./handlers/cryptoPay.js";
import { markUserPremium } from "./db/users.js"; // assumes you have this DB helper

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

// CryptoPay webhook
app.post("/crypto/webhook", async (req, res) => {
  try {
    const result = await cryptoPayWebhook(req, res);

    // if webhook verified and invoice paid
    const inv = (req.body?.invoice || req.body?.result || req.body) as any;
    if (inv?.status === "paid" && inv?.payload) {
      try {
        const payload = JSON.parse(inv.payload);
        if (payload?.tg_user) {
          await markUserPremium(payload.tg_user, payload.plan);
          console.log(`⭐ User ${payload.tg_user} upgraded to ${payload.plan.toUpperCase()}`);
        }
      } catch (e) {
        console.error("Failed to parse payload or mark premium:", e);
      }
    }

    return result;
  } catch (e) {
    console.error("CryptoPay webhook handler error:", e);
    return res.status(500).end();
  }
});

// Root
app.get("/", (_req, res) => res.send("FOMO Superbot API"));

const PORT = Number(process.env.PORT || CFG.PORT || 8080);
app.listen(PORT, () => console.log(`FOMO Superbot listening on ${PORT}`));
