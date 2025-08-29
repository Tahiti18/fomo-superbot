// src/handlers/cryptowebhook.ts
import type { Request, Response } from "express";
import crypto from "crypto";

/**
 * Telegram Crypto Pay webhook handler.
 * - Verifies HMAC-SHA256 signature in `Crypto-Pay-Api-Signature`
 * - Logs the invoice payload when status === "paid"
 * - Always 200s (CryptoBot expects 2xx), but warns on bad signature
 */
export function cryptoPayWebhook(req: Request, res: Response) {
  try {
    const secret = process.env.CRYPTO_PAY_API_KEY || "";
    const sigHeader = String(req.header("Crypto-Pay-Api-Signature") || "");

    // If there is a secret configured, verify the signature
    if (secret) {
      const raw = JSON.stringify(req.body ?? {});
      const expected = crypto.createHmac("sha256", secret).update(raw).digest("hex");
      if (!sigHeader || sigHeader.toLowerCase() !== expected) {
        console.warn("⚠️ CryptoPay signature mismatch");
        return res.status(200).end(); // still 200 to avoid retries
      }
    } else {
      console.warn("⚠️ CRYPTO_PAY_API_KEY missing; skipping signature check");
    }

    const inv = (req.body?.invoice || req.body?.result || req.body) as any;

    if (inv?.status === "paid") {
      console.log("✅ CryptoPay paid:", {
        invoice_id: inv.invoice_id || inv.id,
        amount: inv.amount,
        asset: inv.asset,
        payload: inv.payload,
      });
      // TODO: upsert into subscriptions table using payload (next step)
    } else {
      console.log("ℹ️ CryptoPay event:", inv?.status ?? "unknown");
    }

    return res.status(200).end();
  } catch (err) {
    console.error("CryptoPay webhook error:", err);
    return res.status(200).end(); // keep 2xx for CryptoBot
  }
}
