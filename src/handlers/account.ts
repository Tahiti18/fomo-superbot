// src/handlers/account.ts
import type { Context } from "grammy";
import { InlineKeyboard } from "grammy";
import { pool } from "../db.js";

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
    const tgId = ctx.from?.id;
    if (!tgId) throw new Error("No Telegram id");
    const q = `
      SELECT plan, expires_at, status
      FROM subscriptions
      WHERE tg_user_id = $1
      ORDER BY created_at DESC
      LIMIT 1
    `;
    const { rows } = await pool.query(q, [tgId]);
    let txt: string;
    if (!rows.length) {
      txt = "📊 *Subscription status*\n\n• Tier: _None_\n• Expires: _—_\n\nYou’re not premium yet.";
    } else {
      const r = rows[0];
      const expires = new Date(r.expires_at).toISOString().slice(0, 10);
      txt = `📊 *Subscription status*\n\n• Tier: *${String(r.plan).toUpperCase()}*\n• Expires: *${expires}*\n• Status: *${r.status}*`;
    }
    const kb = new InlineKeyboard()
      .text("💳 Upgrade", "acct:upgrade").row()
      .text("◀️ Back", "ui:back");

    await ctx.editMessageText(txt, { parse_mode: "Markdown", reply_markup: kb })
      .catch(async () => {
        await ctx.reply(txt, { parse_mode: "Markdown", reply_markup: kb });
      });
  } catch (e) {
    await ctx.reply("Status error.");
  }
}

export async function upgrade(ctx: Context) {
  await ctx.answerCallbackQuery().catch(() => {});
  await ctx.api.sendMessage(
    ctx.chat!.id,
    "Opening upgrade… use /buy starter USDT (or /buy pro USDT) to get Premium."
  );
}
