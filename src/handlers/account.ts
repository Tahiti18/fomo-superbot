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
  const uid = ctx.from?.id;
  if (!uid) return ctx.reply("No Telegram user id.");
  let tier = "None";
  let expiresTxt = "—";
  let statusTxt = "inactive";
  try {
    const q = `
      select plan, expires_at, status
      from subscriptions
      where tg_user_id = $1
      order by created_at desc
      limit 1
    `;
    const r = await pool.query(q, [ String(uid) ]);
    if (r.rows?.length) {
      const row = r.rows[0];
      tier = (row.plan || "None").toUpperCase();
      const ex = row.expires_at ? new Date(row.expires_at) : null;
      if (ex && !isNaN(ex.getTime())) expiresTxt = ex.toISOString().slice(0, 10);
      statusTxt = row.status || statusTxt;
    }
  } catch {}
  const txt =
    "📊 *Subscription status*\n\n" +
    `• Tier: _${tier}_\n` +
    `• Expires: _${expiresTxt}_\n` +
    `• Status: _${statusTxt}_`;
  const kb = new InlineKeyboard()
    .text("💳 Upgrade", "acct:upgrade").row()
    .text("◀️ Back", "ui:back");
  await ctx.editMessageText(txt, { parse_mode: "Markdown", reply_markup: kb })
    .catch(async () => {
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
