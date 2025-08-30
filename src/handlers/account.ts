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
  const tgId = ctx.from?.id;
  let lineTier = "None", lineStatus = "inactive", lineExpires = "—";
  if (tgId) {
    const q = "select plan, status, expires_at from subscriptions where tg_user_id = $1 order by id desc limit 1";
    const r = await pool.query(q, [tgId]);
    if (r.rows.length) {
      const row = r.rows[0];
      lineTier = row.plan || "None";
      lineStatus = row.status || "inactive";
      if (row.expires_at) {
        lineExpires = new Date(row.expires_at).toISOString().replace("T"," ").replace("Z"," UTC");
      }
    }
  }

  const txt =
`🧾 *Subscription status*
• Tier: *${lineTier}*
• Status: *${lineStatus}*
• Expires: *${lineExpires}*

You’re ${lineStatus === "active" ? "premium ✅" : "not premium yet."}`;

  const kb = new InlineKeyboard()
    .text("💳 Upgrade", "acct:upgrade").row()
    .text("◀️ Back", "ui:back");

  await ctx.editMessageText(txt, { parse_mode: "Markdown", reply_markup: kb })
    .catch(() => ctx.reply(txt, { parse_mode: "Markdown", reply_markup: kb }));
}

export async function upgrade(ctx: Context) {
  await ctx.answerCallbackQuery().catch(() => {});
  await ctx.reply("Opening upgrade… use /buy starter USDT (or /buy pro USDT).");
}

// Local router for account:*
export async function on_callback(ctx: Context) {
  const data = ctx.callbackQuery?.data || "";
  if (data === "acct:status") return status(ctx);
  if (data === "acct:upgrade") return upgrade(ctx);
  return ctx.answerCallbackQuery();
}
