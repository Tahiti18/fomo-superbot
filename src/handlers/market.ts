import type { Context } from "grammy";
import { InlineKeyboard } from "grammy";

export async function open_tools(ctx: Context) {
  const kb = new InlineKeyboard()
    .text("📈 Chart", "mkt:chart").row()
    .text("🔔 Alerts", "mkt:alerts").row()
    .text("◀️ Back", "ui:back");
  await ctx.reply("📈 *Price & Alpha*", { parse_mode: "Markdown", reply_markup: kb });
}

export async function on_callback(ctx: Context) {
  const data = ctx.callbackQuery?.data || "";
  if (data === "mkt:chart") return ctx.reply("Use /chart <symbol|CA> (stub).");
  if (data === "mkt:alerts") return ctx.reply("Use /alerts <symbol|CA> (stub).");
  return ctx.answerCallbackQuery();
}
