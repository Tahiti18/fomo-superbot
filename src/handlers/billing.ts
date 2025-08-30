import type { Context } from "grammy";
export async function upgrade(ctx: Context) {
  await ctx.reply("💳 Invoice (stub). Use /buy starter USDT or /buy pro USDT.");
}
