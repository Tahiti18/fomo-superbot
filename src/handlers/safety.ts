// src/handlers/safety.ts
import type { Context } from "grammy";
import { InlineKeyboard } from "grammy";

export async function open_menu(ctx: Context) {
  const kb = new InlineKeyboard()
    .text("🔎 Scan Contract", "safety:scan").row()
    .text("🍯 Honeypot Check", "safety:honeypot").row()
    .text("🚩 Report Scam", "safety:report").row()
    .text("◀️ Back", "ui:back");
  await ctx.reply("🛡️ *Safety tools:*", { parse_mode: "Markdown", reply_markup: kb });
}

export async function scan(ctx: Context) {
  await ctx.reply("Send a contract address to scan:\n`/scan <CA>`", { parse_mode: "Markdown" });
}
export async function honeypot(ctx: Context) {
  await ctx.reply("Send a contract address to honeypot test:\n`/honeypot <CA>`", { parse_mode: "Markdown" });
}
export async function report(ctx: Context) {
  await ctx.reply("Reply here with the scam details and a contract / link. An admin will review.", { parse_mode: "Markdown" });
}
