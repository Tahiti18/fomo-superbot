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
  const kb = new InlineKeyboard()
    .text("💳 Upgrade", "acct:upgrade").row()
    .text("◀️ Back", "ui:back");

  const tgId = ctx.from?.id ? String(ctx.from.id) : null;
  if (!tgId) {
    await safeReply(ctx, "Could not determine your Telegram ID.", kb);
    return;
  }

  try {
    const q =
      `SELECT plan, expires_at, status
         FROM subscriptions
        WHERE tg_user_id = $1
        ORDER BY id DESC
        LIMIT 1`;
    const { rows } = await pool.query(q, [tgId]);
    const sub = (rows?.[0] ?? null) as
      | { plan: string | null; expires_at: string | Date | null; status: string | null }
      | null;

    const tier = sub?.plan ? sub.plan.toUpperCase() : "None";
    const expires =
      sub?.expires_at
        ? new Date(sub.expires_at as any).toISOString().replace("T", " ").replace(".000Z", " UTC")
        : "—";
    const stat = sub?.status ?? "inactive";

    const txt =
      "📊 *Subscription status*\n\n" +
      `• Tier: _${tier}_\n` +
      `• Expires: _${expires}_\n` +
      `• Status: _${stat}_\n\n` +
      (tier === "None"
        ? "You’re not premium yet."
        : "Thanks for supporting FOMO Superbot!");

    await safeEditOrReply(ctx, txt, kb);
  } catch (e: any) {
    await safeReply(ctx, `DB error: ${e?.message || e}`, kb);
  }
}

export async function upgrade(ctx: Context) {
  await ctx.answerCallbackQuery().catch(() => {});
  await ctx.api.sendMessage(
    ctx.chat!.id,
    "Opening upgrade… use /buy starter USDT (or /buy pro USDT) to get Premium."
  );
}

/* ---------- helpers ---------- */

async function safeEditOrReply(ctx: Context, text: string, kb: InlineKeyboard) {
  await ctx
    .editMessageText(text, { parse_mode: "Markdown", reply_markup: kb })
    .catch(async () => {
      await ctx.reply(text, { parse_mode: "Markdown", reply_markup: kb });
    });
}

async function safeReply(ctx: Context, text: string, kb: InlineKeyboard) {
  await ctx.reply(text, { parse_mode: "Markdown", reply_markup: kb });
}
