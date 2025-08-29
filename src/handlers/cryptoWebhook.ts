// src/handlers/cryptoWebhook.ts
import type { Request, Response } from "express";

/**
 * Minimal, safe CryptoBot (Crypto Pay) webhook handler.
 */
export function cryptoWebhook(req: Request, res: Response) {
  try {
    const data: any =
      typeof req.body === "object" && req.body
        ? req.body
        : JSON.parse(String(req.body || "{}"));

    const inv = data?.invoice || data?.result || data;

    console.log("CryptoPay webhook hit:", {
      status: inv?.status,
      amount: inv?.amount,
      asset: inv?.asset,
      invoice_id: inv?.invoice_id || inv?.id,
      payload: inv?.payload,
    });

    if (inv?.status === "paid") {
      console.log("✅ Payment marked PAID (temporary log only). Payload:", inv?.payload);
    }

    return res.status(200).end();
  } catch (e) {
    console.error("CryptoPay webhook parse error:", e);
    return res.status(200).end(); // still 200 so CryptoBot doesn't retry forever
  }
}
