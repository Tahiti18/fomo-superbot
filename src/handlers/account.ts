// src/handlers/account.ts
import type { Context } from "grammy";
import { InlineKeyboard } from "grammy";
import { pool } from "../db.js";

// Helpers
function fmtDate(d: Date | null): string {
  if (!d) return "—";
  // Show as YYYY-MM-DD
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

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
  // Default UI (in case of error or no user)
  const baseKb = new InlineKeyboard()
    .text("💳 Upgrade", "acct:upgrade").row()
    .text("◀️ Back", "ui:back");

  try {
    const tgId = ctx.from?.id;
    if (!tgId) {
      const txt = "📊 *Subscription status*\n\n• Tier: _—_\n• Expires: _—_\n\nI can’t detect your Telegram ID.";
      await safeEditOrReply(ctx, txt, baseKb);
      return;
    }

    // Read most recent active subscription for this user
    const q = `
      SELECT plan, expires_at, status
      FROM subscriptions
      WHERE tg_user_id = $1
      ORDER BY created_at DESC
      LIMIT 1
    `;
    const { rows } = await pool.query(q, [String(tgId)]);

    let tier = "—";
    let exp: Date | null = null;
    let note = "You’re not premium yet.";

    if (rows.length) {
      const row = rows[0] as { plan?: string; expires_at?: string | Date; status?: string };
      tier = (row.plan || "—").toString();
      const expiresAt =
        row.expires_at instanceof Date ? row.expires_at : row.expires_at ? new Date(row.expires_at) : null;
      exp = expiresAt;

      // If status is active and not expired, show premium note
      const now = new Date();
      if (row.status === "active" && expiresAt && expiresAt.getTime() > now.getTime()) {
        note = "✅ You have Premium.";
      } else {
        note = "You’re not premium right now.";
      }
    }

    const txt =
      "📊 *Subscription status*\n\n" +
      `• Tier: _${tier}_\n` +
      `• Expires: _${fmtDate(exp)}_\n\n` +
      note;

    await safeEditOrReply(ctx, txt, baseKb);
  } catch (err) {
    const txt =
      "📊 *Subscription status*\n\n" +
      "• Tier: _—_\n" +
      "• Expires: _—_\n\n" +
      "Couldn’t read the database.";
    await safeEditOrReply(ctx, txt, baseKb);
  }
}

export async function upgrade(ctx: Context) {
  await ctx.answerCallbackQuery().catch(() => {});
  await ctx.api.sendMessage(
    ctx.chat!.id,
    "Opening upgrade… use /buy starter USDT (or /buy pro USDT) to get Premium."
  );
}

// Try to edit if this came from a button; otherwise send a new message
async function safeEditOrReply(ctx: Context, txt: string, kb: InlineKeyboard) {
  await ctx
    .editMessageText(txt, { parse_mode: "Markdown", reply_markup: kb })
    .catch(async () => {
      await ctx.reply(txt, { parse_mode: "Markdown", reply_markup: kb });
    });
}
