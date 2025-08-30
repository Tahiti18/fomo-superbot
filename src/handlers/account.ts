import type { Context } from "grammy";
import { InlineKeyboard } from "grammy";
import { pool } from "../db.js";

export async function open_account(ctx: Context) {
  const kb = new InlineKeyboard()
    .text("📊 Subscription status", "acct:status").row()
    .text("💳 Upgrade", "acct:upgrade").row()
    .text("◀️ Back", "ui:back");
  await ctx.reply("👤 Account", { reply_markup: kb });
}

export async function status(ctx: Context) {
  const userId = ctx.from?.id || 0;
  let tier = "None", expires = "—", status = "inactive";
  try {
    const { rows } = await pool.query(
      "SELECT plan, status, expires_at FROM subscriptions WHERE tg_user_id = $1",
      [userId]
    );
    if (rows.length) {
      tier = rows[0].plan || "None";
      status = rows[0].status || "inactive";
      expires = rows[0].expires_at ? new Date(rows[0].expires_at).toISOString() : "—";
    }
  } catch (e) {
    console.error("status query error", e);
  }
  const txt = `📊 Subscription status\n\n• Tier: ${tier}\n• Expires: ${expires}\n• Status: ${status}\n`;
  const kb = new InlineKeyboard().text("💳 Upgrade", "acct:upgrade").row().text("◀️ Back", "ui:back");
  await ctx.reply(txt, { reply_markup: kb });
}
