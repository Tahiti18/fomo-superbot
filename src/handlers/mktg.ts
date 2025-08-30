import type { Context } from "grammy";
import { InlineKeyboard } from "grammy";
export async function open_panel(ctx: Context) {
  const kb = new InlineKeyboard()
    .text("🔔 Raid (soon)", "mktg:raid").row()
    .text("◀️ Back", "ui:back");
  await ctx.reply("📣 Marketing & Raids (soon)", { reply_markup: kb });
}
