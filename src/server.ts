// src/server.ts
import express from "express";
import { CFG } from "./config.js";
import crypto from "crypto";

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

// --- CryptoPay webhook ---
app.post("/crypto/webhook", (req, res) => {
  try {
    const secret = process.env.CRYPTO_PAY_API_KEY || "";
    if (!secret) return res.status(500).send("Missing CRYPTO_PAY_API_KEY");

    const raw = JSON.stringify(req.body ?? {});
    const expected = crypto.createHmac("sha256", secret).update(raw).digest("hex");
    const got = String(req.header("Crypto-Pay-Api-Signature") || "").toLowerCase();

    if (!got || got !== expected) return res.status(403).end();

    const inv = (req.body?.invoice || req.body?.result || req.body) as any;
    console.log("🔔 CryptoPay webhook:", inv?.status, inv?.invoice_id || inv?.id);

    if (inv?.status === "paid") {
      console.log("✅ PAID:", {
        invoice_id: inv.invoice_id || inv.id,
        amount: inv.amount,
        asset: inv.asset,
        payload: inv.payload,
      });
      // TODO: mark user premium in DB using inv.payload
    }

    return res.status(200).end();
  } catch (e) {
    console.error("CryptoPay webhook error:", e);
    return res.status(500).end();
  }
});

// Root
app.get("/", (_req, res) => res.send("FOMO Superbot API"));

const PORT = Number(process.env.PORT || CFG.PORT || 8080);
app.listen(PORT, () => console.log(`FOMO Superbot listening on ${PORT}`));
