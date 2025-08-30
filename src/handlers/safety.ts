import type { Context } from "grammy";
import { InlineKeyboard } from "grammy";

export async function open_tools(ctx: Context) {
  const kb = new InlineKeyboard()
    .text("🔍 Scan Contract", "safe:scan").row()
    .text("🍯 Honeypot Check", "safe:honey").row()
    .text("🚨 Report Scam", "safe:report").row()
    .text("◀️ Back", "ui:back");
  await ctx.reply("🛡️ *Safety tools*", { parse_mode: "Markdown", reply_markup: kb });
}

export async function on_callback(ctx: Context) {
  const data = ctx.callbackQuery?.data || "";
  if (data === "safe:scan") return ctx.reply("Send /scan <contract> (stub).");
  if (data === "safe:honey") return ctx.reply("Send /honeypot <contract> (stub).");
  if (data === "safe:report") return ctx.reply("Report (stub).");
  return ctx.answerCallbackQuery();
}
