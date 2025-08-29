// src/handlers/cryptoWebhook.ts
import { Request, Response } from "express";
import crypto from "crypto";

const BOT_SECRET = process.env.BOT_SECRET || "fomo-secret-123";

/**
 * Handles incoming CryptoPay webhooks
 */
export const cryptoWebhook = (req: Request, res: Response) => {
  try {
    // 1. Verify Telegram CryptoPay signature
    const signature = req.headers["crypto-pay-api-signature"];
    const payload = JSON.stringify(req.body);
    const hmac = crypto
      .createHmac("sha256", BOT_SECRET)
      .update(payload)
      .digest("hex");

    if (signature !== hmac) {
      console.error("❌ Invalid CryptoPay signature");
      return res.status(403).json({ error: "Invalid signature" });
    }

    // 2. Process webhook payload
    const invoice = req.body;
    console.log("✅ Received CryptoPay webhook:", invoice);

    if (invoice.status === "paid") {
      // Example: mark user as premium
      console.log(
        `💰 Invoice ${invoice.invoice_id} paid by ${invoice.payload}, amount: ${invoice.amount} ${invoice.asset}`
      );
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("❌ CryptoPay webhook error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
