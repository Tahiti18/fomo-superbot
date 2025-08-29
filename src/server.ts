// src/server.ts
import express from "express";
import { CFG } from "./config.js";

const app = express();
app.use(express.json());

// Healthcheck
app.get("/health", (_req, res) => res.status(200).send("OK"));

// Telegram webhook
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

// --- Simulated CryptoPay test route ---
app.get("/crypto/test", (_req, res) => {
  const fakeInvoice = {
    invoice_id: "test123",
    amount: "10.00",
    asset: "USDT",
    status: "paid",
    payload: "demo-user-1"
  };
  console.log("✅ Simulated CryptoPay webhook:", fakeInvoice);
  return res.json(fakeInvoice);
});

// Root
app.get("/", (_req, res) => res.send("FOMO Superbot API"));

const PORT = Number(process.env.PORT || CFG.PORT || 8080);
app.listen(PORT, () => console.log(`FOMO Superbot listening on ${PORT}`));
