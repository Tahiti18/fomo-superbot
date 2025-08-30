// src/handlers/payment.ts
import type { Request, Response } from "express";

/**
 * Handles CryptoBot payment webhook.
 * Expects JSON payload from CryptoBot with invoice status.
 * You must configure the webhook URL in your CryptoBot settings.
 */
export async function paymentWebhook(req: Request, res: Response) {
  try {
    const data = req.body;

    // Debug logging
    console.log("CryptoBot webhook received:", data);

    if (data?.update_type === "invoice_paid") {
      const payload = JSON.parse(data.payload || "{}");
      const tgUser = payload.tg_user;
      const plan = payload.plan;

      // TODO: update your DB to set the user as premium
      // Example:
      // await Users.markPremium(tgUser, plan);

      console.log(
        `✅ User ${tgUser} paid for ${plan}. Premium unlocked.`
      );
    }

    res.status(200).send("OK");
  } catch (e) {
    console.error("Payment webhook error:", e);
    res.status(500).end();
  }
}
