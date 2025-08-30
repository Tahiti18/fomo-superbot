import type { Context } from "grammy";
import { InlineKeyboard } from "grammy";

export async function open_panel(ctx: Context) {
  const kb = new InlineKeyboard()
    .text("📈 Alerts", "price:alerts").row()
    .text("📊 Chart", "price:chart").row()
    .text("◀️ Back", "ui:back");
  await ctx.reply("📈 Price & Alpha (stubs). Use /chart <symbol> or /alerts <symbol>.", { reply_markup: kb });
}
