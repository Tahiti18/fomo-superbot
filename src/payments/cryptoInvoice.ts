// src/payments/cryptoInvoice.ts
import fetch from "node-fetch";

const BASE_URL = "https://pay.crypt.bot/api";
const API_KEY = process.env.CRYPTO_PAY_API_KEY || "";

if (!API_KEY) {
  throw new Error("Missing CRYPTO_PAY_API_KEY in env");
}

/**
 * Create a USDT invoice for the Starter plan.
 * Returns { invoice_id, pay_url, status, ... }
 */
export async function createInvoiceUSDtStarter() {
  const r = await fetch(`${BASE_URL}/createInvoice`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Crypto-Pay-API-Token": API_KEY,
    },
    body: JSON.stringify({
      asset: "USDT",
      amount: 29,                 // Starter price
      description: "FOMO Starter 30d",
      payload: "starter-plan",    // comes back in webhook
      allow_comments: false,
      allow_anonymous: false,
      expires_in: 900
    }),
  });

  const j = await r.json();
  if (!j.ok) throw new Error(`CryptoPay error: ${JSON.stringify(j)}`);
  return j.result;
}
