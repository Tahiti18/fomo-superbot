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

// --- Crypto Pay webhook (safe + working) ---
app.post("/crypto/webhook", (req, res) => {
  try {
    const secret = process.env.CRYPTO_PAY_API_KEY || "";
    if (!secret) {
      console.error("❌ Missing CRYPTO_PAY_API_KEY");
      return res.sendStatus(500);
    }

    console.log("💰 Incoming CryptoPay webhook:", req.body);

    const inv = req.body?.invoice || req.body?.result || req.body;

    if (inv?.status === "paid") {
      console.log("✅ Payment confirmed:", {
        invoice_id: inv.invoice_id || inv.id,
        amount: inv.amount,
        asset: inv.asset,
        payload: inv.payload,
      });

      // TODO: later mark user premium in DB
    } else {
      console.log("ℹ️ Payment status:", inv?.status || "unknown");
    }

    res.sendStatus(200);
  } catch (e) {
    console.error("⚠️ CryptoPay webhook error:", e);
    res.sendStatus(500);
  }
});

// Root
app.get("/", (_req, res) => res.send("FOMO Superbot API"));

const PORT = Number(process.env.PORT || CFG.PORT || 8080);
app.listen(PORT, () => console.log(`FOMO Superbot listening on ${PORT}`));
