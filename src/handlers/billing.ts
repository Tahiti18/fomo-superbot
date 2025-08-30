// src/handlers/billing.ts
import type { Context } from "grammy";
import { createInvoice } from "./cryptopay";
import { InlineKeyboard } from "grammy";

type Plan = "starter" | "pro" | "lifetime";

function priceFor(plan: Plan) {
  switch (plan) {
    case "starter":
      return { amount: "29", desc: "FOMO Starter 30d" };
    case "pro":
      return { amount: "99", desc: "FOMO Pro 30d" };
    case "lifetime":
      return { amount: "499", desc: "FOMO Lifetime" };
  }
}

export async function upgrade(ctx: Context) {
  // Command usage: /buy [plan] [asset]
  // Examples: /buy, /buy pro, /buy pro USDT, /buy starter TON
  const raw = (ctx.match as string | undefined)?.trim() || "";
  const [p1, p2] = raw.split(/\s+/).filter(Boolean);

  const plan = (
    ["starter", "pro", "lifetime"].includes((p1 || "").toLowerCase())
      ? p1!.toLowerCase()
      : "pro"
  ) as Plan;

  const asset = ((p2 || "USDT").toUpperCase()) as
    | "USDT"
    | "TON"
    | "BTC"
    | "ETH"
    | "BNB"
    | "TRX"
    | "LTC"
    | "USDC";

  const { amount, desc } = priceFor(plan);

  // Build payload so we know who/what this payment is for when webhook fires
  const payload = JSON.stringify({
    plan,
    asset,
    amount,
    tg_user: ctx.from?.id,
    tg_chat: ctx.chat?.id,
    ts: Date.now(),
  });

  try {
    const inv = await createInvoice({
      amount,
      asset,
      description: desc,
      payload,
      expires_in: 900,
    });

    const url = (inv.pay_url || inv.invoice_url) as string;

    const kb = new InlineKeyboard().url("🔒 Pay Securely (CryptoBot)", url);
    await ctx.reply(
      `✅ Invoice created\n\nPlan: *${plan.toUpperCase()}*\nAsset: *${asset}*\nAmount: *${amount}*\n\nClick to pay and unlock Premium.`,
      { parse_mode: "Markdown", reply_markup: kb }
    );
  } catch (e: any) {
    await ctx.reply(`❌ Payment error: ${e?.message || e}`);
  }
}
