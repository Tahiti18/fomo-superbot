import type { Context } from "grammy";
import { InlineKeyboard } from "grammy";

export async function open_panel(ctx: Context) {
  const kb = new InlineKeyboard()
    .text("🔍 Scan Contract", "safe:scan").row()
    .text("🍯 Honeypot Check", "safe:hp").row()
    .text("🚩 Report Scam", "safe:rep").row()
    .text("◀️ Back", "ui:back");
  await ctx.reply("🛡️ Safety tools:", { reply_markup: kb });
}
export async function scan_prompt(ctx: Context) {
  await ctx.reply("Send /scan <contract> to scan a token.");
}
export async function honeypot_prompt(ctx: Context) {
  await ctx.reply("Send /honeypot <contract> to check honeypot.");
}
export async function report_prompt(ctx: Context) {
  await ctx.reply("Describe the scam and we’ll log it. (stub)");
}
