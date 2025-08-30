// src/payments/cryptoPay.ts
export type CreateInvoiceParams = {
  amount: string;
  asset?: "USDT" | "TON" | "BTC" | "ETH" | "BNB" | "TRX" | "LTC" | "USDC";
  description?: string;
  payload?: string;
  expires_in?: number;
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
  return j.result; // invoice_url/invoice_id/status/etc
}
