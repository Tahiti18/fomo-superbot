import type { Context } from "grammy";
import fetch from "node-fetch";

export async function price(ctx: Context) {
  const coin = (ctx.match as string || "bitcoin").trim().toLowerCase();
  const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=usd`);
  const data = await res.json();
  if (!data[coin]) return ctx.reply("❌ Coin not found");
  return ctx.reply(`💰 ${coin}: $${data[coin].usd}`);
}