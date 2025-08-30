import type { Context } from "grammy";
import { InlineKeyboard } from "grammy";

export async function open_account(ctx: Context) {
  const kb = new InlineKeyboard()
    .text("📊 Subscription status", "acct:status").row()
    .text("💳 Upgrade", "acct:upgrade").row()
    .text("◀️ Back", "ui:back");
  await ctx.reply("👤 *Account*", { parse_mode: "Markdown", reply_markup: kb });
}

export async function status(ctx: Context) {
  const txt = "📊 *Subscription status*\n\n• Tier: _None_\n• Expires: _—_\n\nYou’re not premium yet.";
  await ctx.reply(txt, { parse_mode: "Markdown" });
}

export async function upgrade(ctx: Context) {
  await ctx.reply("Opening upgrade… use /buy starter USDT (or /buy pro USDT).");
}