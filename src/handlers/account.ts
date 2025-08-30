// src/handlers/account.ts
import type { Context } from "grammy";
import { InlineKeyboard } from "grammy";

let poolPromise: Promise<any> | null = null;
async function getPool() {
  if (poolPromise) return poolPromise;
  poolPromise = import("../db.js").then(m => (m as any).pool).catch(() => null);
  return poolPromise;
}

export async function open_account(ctx: Context) {
  const kb = new InlineKeyboard()
    .text("📊 Subscription status", "acct:status").row()
    .text("💳 Upgrade", "acct:upgrade").row()
    .text("◀️ Back", "ui:back");
  await ctx.reply("👤 *Account*", { parse_mode: "Markdown", reply_markup: kb });
}

export async function status(ctx: Context) {
  const kb = new InlineKeyboard()
    .text("💳 Upgrade", "acct:upgrade").row()
    .text("◀️ Back", "ui:back");

  try {
    const pool = await getPool();
    if (!pool) throw new Error("no-db");
    const uid = String(ctx.from?.id || "");
    const q = `SELECT plan, expires_at, status FROM subscriptions WHERE tg_user_id=$1 ORDER BY created_at DESC LIMIT 1`;
    const r = await pool.query(q, [uid]);
    if (!r.rows.length) {
      await ctx.reply("📊 *Subscription status*\n\n• Tier: _None_\n• Expires: _—_\n\nYou’re not premium yet.", { parse_mode: "Markdown", reply_markup: kb });
      return;
    }
    const row = r.rows[0];
    const tier = String(row.plan || "None").toUpperCase();
    const ex = row.expires_at ? new Date(row.expires_at).toISOString().slice(0,10) : "—";
    const status = row.status || "inactive";
    await ctx.reply(`📊 *Subscription status*\n\n• Tier: _${tier}_\n• Expires: _${ex}_\n• Status: _${status}_`, { parse_mode: "Markdown", reply_markup: kb });
  } catch {
    await ctx.reply("📊 *Subscription status*\n\n• Tier: _None_\n• Expires: _—_\n\nYou’re not premium yet.", { parse_mode: "Markdown", reply_markup: kb });
  }
}

export async function upgrade(ctx: Context) {
  await ctx.answerCallbackQuery().catch(() => {});
  await ctx.api.sendMessage(ctx.chat!.id, "Open /buy to create an invoice: `/buy starter USDT` or `/buy pro USDT`.", { parse_mode: "Markdown" });
}
