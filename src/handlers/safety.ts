import type { Context } from "grammy";

export async function scan(ctx: Context) {
  const ca = (ctx.match as string || "").trim();
  if (!ca) return ctx.reply("Usage: /scan <contract>");
  return ctx.reply(`🔍 Scanning contract: ${ca}`);
}

export async function honeypot(ctx: Context) {
  const ca = (ctx.match as string || "").trim();
  if (!ca) return ctx.reply("Usage: /honeypot <contract>");
  return ctx.reply(`🍯 Honeypot test: ${ca}`);
}