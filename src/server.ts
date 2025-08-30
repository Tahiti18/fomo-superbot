// src/server.ts
import express from "express";
import { CFG } from "./config.js";
import crypto from "crypto";
import { pool } from "./db.js"; // uses your existing db.ts

const app = express();
app.use(express.json());

// Healthcheck (for Railway)
app.get("/health", (_req, res) => res.status(200).send("OK"));

// Telegram webhook (defer-load bot to avoid startup crashes)
app.post("/tg/webhook", async (req, res, next) => {
  try {
    const { webhook } = await import("./bot.js");
    // @ts-ignore grammy express handler
    return webhook(req, res, next);
  } catch (e) {
    console.error("Telegram webhook error:", e);
    return res.status(500).end();
  }
});

// --- CryptoPay webhook: verifies signature + marks user premium ---
app.post("/crypto/webhook", async (req, res) => {
  try {
    const secret = process.env.CRYPTO_PAY_API_KEY || "";
    if (!secret) return res.status(500).send("Missing CRYPTO_PAY_API_KEY");

    const raw = JSON.stringify(req.body ?? {});
    const expected = crypto.createHmac("sha256", secret).update(raw).digest("hex");
    const got = String(req.header("Crypto-Pay-Api-Signature") || "").toLowerCase();
    if (!got || got !== expected) return res.status(403).end();

    const inv = (req.body?.invoice || req.body?.result || req.body) as any;
    console.log("🔔 CryptoPay webhook:", inv?.status, inv?.invoice_id || inv?.id);

    if (inv?.status === "paid") {
      // payload came from billing.ts. Try to parse it.
      let meta: any = {};
      try { meta = JSON.parse(inv.payload || "{}"); } catch {}

      const tgUser = Number(meta.tg_user || 0) || null;
      const plan   = String(meta.plan || "");
      const asset  = String(inv.asset || meta.asset || "");
      const amount = String(inv.amount || meta.amount || "");
      const invoiceId = String(inv.invoice_id || inv.id || "");

      console.log("✅ PAID:", { tgUser, plan, asset, amount, invoiceId });

      // Soft-guard: only touch DB if we have a user id + plan
      if (tgUser && plan) {
        try {
          await pool.query(
            `
            INSERT INTO subscriptions (tg_user_id, plan, status, asset, amount, invoice_id, paid_at)
            VALUES ($1, $2, 'active', $3, $4, $5, NOW())
            ON CONFLICT (tg_user_id)
              DO UPDATE SET
                plan = EXCLUDED.plan,
                status = 'active',
                asset = EXCLUDED.asset,
                amount = EXCLUDED.amount,
                invoice_id = EXCLUDED.invoice_id,
                updated_at = NOW();
            `,
            [tgUser, plan, asset, amount, invoiceId]
          );
          console.log("💾 subscriptions updated for", tgUser);
        } catch (dbErr: any) {
          console.error("DB upsert failed (subscriptions). Check schema:", dbErr?.message || dbErr);
          // Don’t fail the webhook; acknowledge to CryptoBot
        }
      } else {
        console.warn("Missing tg_user/plan in payload; skipping DB write.");
      }
    }

    return res.status(200).end();
  } catch (e) {
    console.error("CryptoPay webhook error:", e);
    return res.status(500).end();
  }
});

// Root
app.get("/", (_req, res) => res.send("FOMO Superbot API"));

const PORT = Number(process.env.PORT || CFG.PORT || 8080);
app.listen(PORT, () => console.log(`FOMO Superbot listening on ${PORT}`));
