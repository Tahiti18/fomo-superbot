import { Request, Response } from "express";
import pkg from "pg";

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function cryptoPayWebhook(req: Request, res: Response) {
  try {
    const update = req.body;

    // Confirm it’s a successful paid invoice
    if (update.update_type === "invoice_paid" && update.payload) {
      const payload = JSON.parse(update.payload);

      await pool.query(
        `INSERT INTO subscriptions (tg_user_id, plan, status, created_at)
         VALUES ($1, $2, 'active', now())`,
        [payload.tg_user, payload.plan]
      );

      console.log("✅ Saved subscription:", payload);
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Webhook error:", err);
    res.sendStatus(500);
  }
}
