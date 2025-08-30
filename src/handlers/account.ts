// src/handlers/account.ts
import type { Context } from "grammy";
import { InlineKeyboard } from "grammy";
import { pool } from "../db.js";

/**
 * Opens the Account section (inline menu).
 * Exported as `open_account` so other modules can call H.account.open_account(...)
 */
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

/**
 * Shows subscription status by reading the `subscriptions` table.
 * Expects table with columns: tg_user_id BIGINT, plan TEXT, expires_at TIMESTAMPTZ, status TEXT, created_at TIMESTAMPTZ
 */
export async function status(ctx: Context) {
  const uid = ctx.from?.id;
  if (!uid) {
    return ctx.reply("Could not determine your Telegram ID.");
  }

  let tier = "None";
  let expires = "—";
  let state = "inactive";

  try {
    const q = await pool.query(
      `SELECT plan, expires_at, status
         FROM subscriptions
        WHERE tg_user_id = $1
        ORDER BY created_at DESC
        LIMIT 1`,
      [uid]
    );

    if (q.rows.length) {
      const r = q.rows[0];
      tier = String(r.plan ?? "None");
      if (r.expires_at) {
        const exp = new Date(r.expires_at);
        expires = exp.toISOString().replace(".000Z", "Z");
        state = exp.getTime() > Date.now() ? "active" : "expired";
      } else {
        // lifetime / no expiry
        expires = "∞";
        state = String(r.status ?? "active");
      }
    }
  } catch (e) {
    console.error("status query error:", e);
  }

  const txt =
    "📊 *Subscription status*\n\n" +
    `• Tier: _${tier}_\n` +
    `• Expires: _${expires}_\n` +
    `• Status: _${state}_\n\n` +
    (state === "active" ? "You’re Premium. ✅" : "You’re not premium yet.");

  const kb = new InlineKeyboard()
    .text("💳 Upgrade", "acct:upgrade").row()
    .text("◀️ Back", "ui:back");

  // Try edit-in-place if triggered from a button; fall back to a new message
  await ctx.editMessageText(txt, { parse_mode: "Markdown", reply_markup: kb })
    .catch(async () => {
      await ctx.reply(txt, { parse_mode: "Markdown", reply_markup: kb });
    });
}

/**
 * Upgrade CTA — points user to /buy flow for now.
 */
export async function upgrade(ctx: Context) {
  await ctx.answerCallbackQuery().catch(() => {});
  await ctx.api.sendMessage(
    ctx.chat!.id,
    "Use /buy starter USDT (or /buy pro USDT / /buy lifetime) to activate Premium."
  );
}
