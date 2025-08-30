import type { Context } from "grammy";

export async function tip(ctx: Context) {
  return ctx.reply("💸 Tip sent (stub)");
}

export async function rain(ctx: Context) {
  return ctx.reply("🌧 Rain distributed (stub)");
}