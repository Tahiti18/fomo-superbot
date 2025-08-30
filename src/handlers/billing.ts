import type { Context } from "grammy";

export async function upgrade(ctx: Context) {
  return ctx.reply("💳 Billing upgrade (stub)");
}