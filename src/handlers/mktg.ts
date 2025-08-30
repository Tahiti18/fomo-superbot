// src/handlers/mktg.ts
import type { Context } from "grammy";
import { InlineKeyboard } from "grammy";

export async function open_menu(ctx: Context) {
  const kb = new InlineKeyboard()
    .text("🚀 Open raid", "mktg:raid").row()
    .text("◀️ Back", "ui:back");
  await ctx.reply("📣 *Marketing & Raids:*", { parse_mode: "Markdown", reply_markup: kb });
}

export async function raid(ctx: Context) {
  await ctx.reply("Raid tool (stub). Post the tweet link to coordinate.");
}
