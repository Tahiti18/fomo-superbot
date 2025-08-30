// /src/payments/cryptoPay.ts
import type { Request, Response } from "express";
import crypto from "crypto";
import { pool } from "../db.js";

/** ---------- Create Invoice (CryptoBot / Crypto Pay) ---------- */
export type CreateInvoiceParams = {
  amount: string;
  asset?: "USDT" | "TON" | "BTC" | "ETH" | "BNB" | "TRX" | "LTC" | "USDC";
  description?: string;
  payload?: string;     // we'll JSON.stringify useful info into this
  expires_in?: number;  // seconds (default 15m)
};

export async function createInvoice(p: CreateInvoiceParams) {
  const token = process.env.CRYPTO_PAY_API_KEY;
  if (!token) throw new Error("CRYPTO_PAY_API_KEY missing");

  const body = {
    asset: p.asset || "USDT",
    amount: p.amount,
    description: p.description || "FOMO Superbot Premium",
    payload: p.payload || "",
    expires_in: p.expires_in ?? 900,
    allow_comments: false,
    allow_anonymous: false,
  };

  const r = await fetch("https://pay.crypt.bot/api/createInvoice", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Crypto-Pay-API-Token": token,
    },
    body: JSON.stringify(body),
  });

  const j = await r.json();
  if (!j.ok) throw new Error(`CryptoPay error: ${JSON.stringify(j)}`);
  return j.result; // has pay_url / invoice_url
}

/** ---------- Webhook (CryptoBot / Crypto Pay) ---------- */
export async function cryptoPayWebhook(req: Request, res: Response) {
  try {
    const secret = process.env.CRYPTO_PAY_API_KEY || "";
    if (!secret) return res.status(500).send("Missing CRYPTO_PAY_API_KEY");

    // Verify signature (HMAC SHA-256 of the raw JSON body)
    const raw = JSON.stringify(req.body ?? {});
    const expected = crypto.createHmac("sha256", secret).update(raw).digest("hex");
    const got = String(req.header("Crypto-Pay-Api-Signature") || "").toLowerCase();
    if (!got || got !== expected) {
      console.warn("CryptoPay webhook: signature mismatch");
      return res.status(403).end();
    }

    // Normalize invoice object
    const inv: any = req.body?.invoice || req.body?.result || req.body || {};
    const status = (inv.status || "").toLowerCase();
    const payloadStr = String(inv.payload || "");

    console.log("🔔 CryptoPay webhook:", status, inv.invoice_id || inv.id);

    if (status === "paid") {
      // We expect payload JSON from billing.ts: { plan, asset, amount, tg_user, tg_chat, ts }
      let payload: any = {};
      try { payload = JSON.parse(payloadStr || "{}"); } catch {}

      const tgUserId = Number(payload.tg_user) || null;
      const plan = String(payload.plan || "pro");
      const now = new Date();

      // Compute expiry: 30 days for starter/pro, NULL for lifetime
      let expiresAt: Date | null = null;
      if (plan !== "lifetime") {
        const days = plan === "starter" ? 30 : 30;
        expiresAt = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
      }

      // Upsert into subscriptions table
      // schema (what you told me earlier):
      // id serial PK, tg_user_id bigint not null, plan text not null,
      // expires_at timestamp null, status text default 'active', created_at timestamp default now()
      const client = await pool.connect();
      try {
        await client.query("BEGIN");

        // See if user already has a row
        const { rows } = await client.query(
          `SELECT id, plan, status, expires_at
             FROM subscriptions
            WHERE tg_user_id = $1
            ORDER BY id DESC
            LIMIT 1`,
          [tgUserId]
        );

        if (rows.length === 0) {
          // INSERT new
          await client.query(
            `INSERT INTO subscriptions (tg_user_id, plan, expires_at, status)
             VALUES ($1, $2, $3, 'active')`,
            [tgUserId, plan, expiresAt]
          );
        } else {
          // UPDATE latest row (simple approach)
          await client.query(
            `UPDATE subscriptions
                SET plan = $2,
                    expires_at = $3,
                    status = 'active'
              WHERE id = $1`,
            [rows[0].id, plan, expiresAt]
          );
        }

        await client.query("COMMIT");
        console.log("✅ Marked premium:", { tgUserId, plan, expiresAt });
      } catch (e) {
        await client.query("ROLLBACK");
        console.error("DB upsert error:", e);
      } finally {
        client.release();
      }
    }

    return res.status(200).end();
  } catch (e) {
    console.error("CryptoPay webhook error:", e);
    return res.status(500).end();
  }
}
