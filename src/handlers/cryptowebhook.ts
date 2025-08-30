// src/handlers/cryptowebhook.ts
import { Request, Response } from "express";

export const cryptowebhook = async (req: Request, res: Response) => {
  try {
    const update = req.body;
    console.log("📩 Incoming CryptoPay webhook:", update);

    if (update.status === "paid") {
      console.log(`✅ Invoice ${update.invoice_id} confirmed for ${update.amount} ${update.asset}`);
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("❌ CryptoPay webhook error:", err);
    return res.status(500).json({ ok: false });
  }
};
