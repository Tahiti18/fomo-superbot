// src/handlers/account.ts
import type { Context } from "grammy";
import { InlineKeyboard } from "grammy";
import * as ui from "./ui.js";

export async function open_account(ctx: Context) {
  const kb = new InlineKeyboard()
    .text("📊 Subscription status", "acct:status").row()
    .text("💳 Upgrade", "acct:upgrade").row()
    .text("◀️ Back", "ui:back");
  await ctx.reply("👤 *Account*", {
    parse_mode: "Markdown",
    reply_markup: kb,
  });
}

export async function status(ctx: Context) {
  const txt =
    "📊 *Subscription status*\n\n" +
    "• Tier: _None_\n" +
    "• Expires: _—_\n\n" +
    "You’re not premium yet.";
  const kb = new InlineKeyboard()
    .text("💳 Upgrade", "acct:upgrade").row()
    .text("◀️ Back", "ui:back");

  // Try to edit if this came from a button; otherwise send a new message
  await ctx.editMessageText(txt, {
    parse_mode: "Markdown",
    reply_markup: kb,
  }).catch(async () => {
    await ctx.reply(txt, { parse_mode: "Markdown", reply_markup: kb });
  });
}

export async function upgrade(ctx: Context) {
  await ctx.answerCallbackQuery().catch(() => {});
  await ctx.api.sendMessage(
    ctx.chat!.id,
    "Opening upgrade… use /buy starter USDT (or /buy pro USDT) to get Premium."
  );
}
