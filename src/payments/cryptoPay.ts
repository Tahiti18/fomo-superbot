// src/payments/cryptoPay.ts

export type CreateInvoiceParams = {
  amount: string;                  // e.g. "29"
  asset?: "USDT" | "TON" | "BTC" | "ETH" | "BNB" | "TRX" | "LTC" | "USDC";
  description?: string;            // shown on invoice
  payload?: string;                // your order id / user id / chat id
  expires_in?: number;             // seconds (e.g. 900 = 15min)
};

export async function createInvoice(p: CreateInvoiceParams) {
  const token = process.env.CRYPTO_PAY_API_KEY;
  if (!token) throw new Error("CRYPTO_PAY_API_KEY missing");

  const body = {
    asset: p.asset || "USDT",
    amount: p.amount,
    description: p.description || "FOMO Superbot Premium",
    payload: p.payload || "",
    expires_in: p.expires_in || 900,
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
  return j.result; // { invoice_id, invoice_url/pay_url, status, ... }
}
