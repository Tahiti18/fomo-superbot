import { Context } from "grammy";
import { pool } from "../db.js";

export async function status(ctx: Context) {
  const tgUserId = ctx.from?.id;
  if (!tgUserId) return ctx.reply("No user id.");

  const res = await pool.query("SELECT plan, expires_at, status FROM subscriptions WHERE tg_user_id=$1", [tgUserId]);
  if (res.rows.length === 0) {
    return ctx.reply("You are not subscribed yet.\nUse /upgrade to activate a plan.");
  }
  const sub = res.rows[0];
  ctx.reply(`📊 Subscription status\nTier: ${sub.plan}\nExpires: ${sub.expires_at || "—"}\nStatus: ${sub.status}`);
}

export async function upgrade(ctx: Context) {
  await ctx.reply("Choose a plan:", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "Starter (30d)", callback_data: "acct:ug_starter" }],
        [{ text: "Pro (30d)", callback_data: "acct:ug_pro" }],
        [{ text: "Lifetime", callback_data: "acct:ug_life" }],
      ]
    }
  });
}

export async function ug_starter(ctx: Context) { return activate(ctx, "Starter", "30 days"); }
export async function ug_pro(ctx: Context) { return activate(ctx, "Pro", "30 days"); }
export async function ug_life(ctx: Context) { return activate(ctx, "Lifetime", null); }

async function activate(ctx: Context, plan: string, duration: string | null) {
  const tgUserId = ctx.from?.id;
  if (!tgUserId) return ctx.reply("No user id.");

  const expires = duration ? `NOW() + interval '${duration}'` : "NULL";
  await pool.query(
    `INSERT INTO subscriptions (tg_user_id, plan, expires_at, status)
     VALUES ($1, $2, ${expires}, 'active')
     ON CONFLICT (tg_user_id)
     DO UPDATE SET plan=$2, expires_at=${expires}, status='active'`,
    [tgUserId, plan]
  );
  ctx.reply(`✅ ${plan} activated.`);
  return status(ctx);
}
