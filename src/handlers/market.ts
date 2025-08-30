// src/handlers/market.ts
import type { Context } from "grammy";
import { InlineKeyboard } from "grammy";

export async function open_menu(ctx: Context) {
  const kb = new InlineKeyboard()
    .text("📊 Quick token chart", "market:chart").row()
    .text("📈 Price/Whale alerts", "market:alerts").row()
    .text("◀️ Back", "ui:back");
  await ctx.reply("📈 *Price & Alpha:*", { parse_mode: "Markdown", reply_markup: kb });
}

export async function chart(ctx: Context) {
  await ctx.reply("Usage: `/chart <symbol>` or `/chart <CA>`", { parse_mode: "Markdown" });
}

export async function alerts(ctx: Context) {
  await ctx.reply("Usage: `/alerts <symbol|CA>` — sets up basic price/whale alerts (stub).", { parse_mode: "Markdown" });
}
