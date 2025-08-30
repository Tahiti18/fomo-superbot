import type { Context } from "grammy";
import { InlineKeyboard } from "grammy";
import { pool } from "../db.js";

export async function open_account(ctx: Context) {
  const kb = new InlineKeyboard()
    .text("📊 Subscription status", "acct:status").row()
    .text("💳 Upgrade", "acct:upgrade").row()
    .text("◀️ Back", "ui:back");
  await ctx.reply("👤 *Account*", { parse_mode: "Markdown", reply_markup: kb });
}

export async function status(ctx: Context) {
  const userId = ctx.from?.id;
  if (!userId) return ctx.reply("User not found.");

  const res = await pool.query("SELECT tier, expires_at FROM subscriptions WHERE user_id=$1 ORDER BY id DESC LIMIT 1", [userId]);
  let txt;
  if (res.rows.length) {
    const row = res.rows[0];
    txt = `📊 *Subscription status*\n\n• Tier: _${row.tier}_\n• Expires: _${row.expires_at || "—"}_`;
  } else {
    txt = "📊 *Subscription status*\n\n• Tier: _None_\n• Expires: _—_\n\nYou’re not premium yet.";
  }

  const kb = new InlineKeyboard()
    .text("💳 Upgrade", "acct:upgrade").row()
    .text("◀️ Back", "ui:back");

  await ctx.editMessageText(txt, { parse_mode: "Markdown", reply_markup: kb })
    .catch(() => ctx.reply(txt, { parse_mode: "Markdown", reply_markup: kb }));
}

export async function upgrade(ctx: Context) {
  await ctx.answerCallbackQuery().catch(() => {});
  await ctx.api.sendMessage(ctx.chat!.id, "Opening upgrade… use /buy starter (or /buy pro, /buy lifetime) to activate Premium.");
}
