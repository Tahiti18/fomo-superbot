// src/handlers/webhook.ts
import type { Request, Response } from "express";
import crypto from "crypto";

export function cryptoPayWebhook(req: Request, res: Response) {
  try {
    const secret = process.env.CRYPTO_PAY_API_KEY || "";
    if (!secret) {
      console.error("Missing CRYPTO_PAY_API_KEY");
      return res.status(500).end();
    }

    const raw = JSON.stringify(req.body ?? {});
    const expected = crypto.createHmac("sha256", secret).update(raw).digest("hex");
    const got = String(req.header("Crypto-Pay-Api-Signature") || "").toLowerCase();

    if (!got || got !== expected) {
      console.warn("CryptoPay signature mismatch");
      return res.status(403).end();
    }

    const inv = (req.body?.invoice || req.body?.result || req.body) as any;
    console.log("🔔 CryptoPay webhook:", inv?.status, inv?.invoice_id || inv?.id);

    if (inv?.status === "paid") {
      console.log("✅ PAID:", {
        invoice_id: inv.invoice_id || inv.id,
        amount: inv.amount,
        asset: inv.asset,
        payload: inv.payload,
      });
    }
    return res.status(200).end();
  } catch (e) {
    console.error("CryptoPay webhook error:", e);
    return res.status(500).end();
  }
}
