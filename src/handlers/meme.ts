import type { Context } from "grammy";

export async function generate(ctx: Context) {
  const p = (ctx.match as string || "").trim();
  if (!p) return ctx.reply("Usage: /meme <prompt>");
  return ctx.reply(`🎭 Meme generated for: ${p}`);
}