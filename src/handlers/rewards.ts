// src/handlers/rewards.ts
import type { Context } from "grammy";
import { InlineKeyboard } from "grammy";

export async function open_menu(ctx: Context) {
  const kb = new InlineKeyboard()
    .text("💸 Tip", "rewards:tip").row()
    .text("🌧️ Airdrop", "rewards:airdrop").row()
    .text("🎮 Games", "rewards:games").row()
    .text("◀️ Back", "ui:back");
  await ctx.reply("🎁 *Tips · Airdrops · Games:*", { parse_mode: "Markdown", reply_markup: kb });
}

export async function tip(ctx: Context)   { await ctx.reply("Tip (stub)."); }
export async function airdrop(ctx: Context){ await ctx.reply("Airdrop (stub)."); }
export async function games(ctx: Context) { await ctx.reply("Games (stub)."); }
