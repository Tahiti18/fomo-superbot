// src/handlers/account.ts
import type { Context } from "grammy";
import { InlineKeyboard } from "grammy";
import * as ui from "./ui.js";
import { pool } from "../db.js"; // assumes you have db.ts that exports a pg Pool

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
  try {
    const tgUserId = String(ctx.from?.id);

    const res = await pool.query(
      "SELECT plan, expires_at, status FROM subscriptions WHERE tg_user_id = $1 ORDER BY created_at DESC LIMIT 1",
      [tgUserId]
    );

    let txt: string;
    if (res.rowCount === 0) {
      txt =
        "📊 *Subscription status*\n\n" +
        "• Tier: _None_\n" +
        "• Expires: _—_\n\n" +
        "You’re not premium yet.";
    } else {
      const sub = res.rows[0];
      txt =
        "📊 *Subscription status*\n\n" +
        `• Tier: _${sub.plan}_\n` +
        `• Expires: _${sub.expires_at.toISOString().slice(0, 10)}_\n` +
        `• Status: _${sub.status}_`;
    }

    const kb = new InlineKeyboard()
      .text("💳 Upgrade", "acct:upgrade").row()
      .text("◀️ Back", "ui:back");

    await ctx.editMessageText(txt, {
      parse_mode: "Markdown",
      reply_markup: kb,
    }).catch(async () => {
      await ctx.reply(txt, { parse_mode: "Markdown", reply_markup: kb });
    });
  } catch (err) {
    console.error("status error:", err);
    await ctx.reply("⚠️ Error fetching subscription status.");
  }
}

export async function upgrade(ctx: Context) {
  await ctx.answerCallbackQuery().catch(() => {});
  await ctx.api.sendMessage(
    ctx.chat!.id,
    "Opening upgrade… use /buy starter USDT (or /buy pro USDT) to get Premium."
  );
}
