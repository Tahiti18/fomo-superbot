// src/handlers/cryptoWebhook.ts
import type { Request, Response } from "express";
import crypto from "crypto";

export function cryptoPayWebhook(req: Request, res: Response) {
  try {
    const secret = process.env.CRYPTO_PAY_API_KEY || "";
    if (!secret) return res.status(500).send("Missing CRYPTO_PAY_API_KEY");

    // Verify signature (HMAC SHA-256 of raw JSON body)
    const raw = JSON.stringify(req.body || {});
    const expected = crypto.createHmac("sha256", secret).update(raw).digest("hex");
    const got = String(req.header("Crypto-Pay-Api-Signature") || "").toLowerCase();

    if (!got || got !== expected) {
      console.warn("CryptoPay signature mismatch");
      return res.status(403).end();
    }

    // Pull the invoice safely
    const inv = (req.body?.invoice || req.body?.result || req.body) as any;

    if (inv?.status === "paid") {
      console.log("✅ CryptoPay PAID:", {
        invoice_id: inv.invoice_id || inv.id,
        amount: inv.amount,
        asset: inv.asset,
        payload: inv.payload,
      });
      // TODO: write to DB using payload
    } else {
      console.log("CryptoPay webhook:", inv?.status || "unknown");
    }

    return res.status(200).end();
  } catch (e) {
    console.error("CryptoPay webhook error:", e);
    return res.status(500).end();
  }
}
