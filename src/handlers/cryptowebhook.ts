// src/handlers/cryptowebhook.ts

import { Request, Response } from "express";

/**
 * CryptoPay webhook handler
 * This route receives payment notifications from the CryptoPay API.
 * In production, always verify the signature of the request if provided.
 */
export const cryptowebhook = async (req: Request, res: Response) => {
  try {
    const update = req.body;
    console.log("📩 Incoming CryptoPay webhook:", update);

    // Example structure of webhook (simplified)
    // {
    //   invoice_id: "12345",
    //   amount: "10.00",
    //   asset: "USDT",
    //   status: "paid",
    //   payload: "user-42"
    // }

    if (update.status === "paid") {
      // TODO: credit user account, unlock features, etc.
      console.log(`✅ Invoice ${update.invoice_id} confirmed for ${update.amount} ${update.asset}`);
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("❌ CryptoPay webhook error:", err);
    return res.status(500).json({ ok: false });
  }
};
