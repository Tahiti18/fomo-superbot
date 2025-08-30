// src/handlers/market.ts
import type { Context } from "grammy";
import { InlineKeyboard } from "grammy";

/**
 * Price & Alpha section
 * (simple, compile-safe stubs so the build passes and buttons work)
 */

export async function open_price_alpha(ctx: Context) {
  const kb = new InlineKeyboard()
    .text("📈 Alerts", "market:alerts").row()
    .text("🧭 Chart", "market:chart").row()
    .text("👥 Holders", "market:holders").row()
    .text("🔍 Audit", "market:audit").row()
    .text("◀️ Back", "ui:back");

  await ctx.reply("📊 *Price & Alpha*\n\nPick a tool:", {
    parse_mode: "Markdown",
    reply_markup: kb,
  });
}

export async function alerts(ctx: Context) {
  await ctx.answerCallbackQuery().catch(() => {});
  await ctx.reply("Usage: `/alerts <token symbol | contract address>`", {
    parse_mode: "Markdown",
  });
}

export async function chart(ctx: Context) {
  await ctx.answerCallbackQuery().catch(() => {});
  await ctx.reply("Usage: `/chart <symbol>`  or  `/chart <contract>`");
}

export async function holders(ctx: Context) {
  await ctx.answerCallbackQuery().catch(() => {});
  await ctx.reply("Usage: `/holders <contract>`");
}

export async function audit(ctx: Context) {
  await ctx.answerCallbackQuery().catch(() => {});
  await ctx.reply("Usage: `/audit <contract>`");
}

/**
 * If you later fetch JSON here, cast it explicitly to avoid TS “unknown”:
 *
 *   const res = await fetch(url);
 *   const data = (await res.json()) as any; // or a proper interface
 */
