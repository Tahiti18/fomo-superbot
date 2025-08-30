// src/handlers/meme.ts
import type { Context } from "grammy";
import { InlineKeyboard } from "grammy";

export async function open_menu(ctx: Context) {
  const kb = new InlineKeyboard()
    .text("🖼️ Create token stickers", "meme:stickers").row()
    .text("◀️ Back", "ui:back");
  await ctx.reply("🎭 *Meme & Stickers:*", { parse_mode: "Markdown", reply_markup: kb });
}

export async function stickers(ctx: Context) {
  await ctx.reply("Send `/meme <prompt>` to create a meme (stub). Stickers feature coming.", { parse_mode: "Markdown" });
}
