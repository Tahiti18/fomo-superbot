// src/handlers/ui.ts
import type { Context } from "grammy";
import { InlineKeyboard } from "grammy";

export async function open_member_menu(ctx: Context) {
  const kb = new InlineKeyboard()
    .text("🛡️ Safety", "ui:safety")
    .text("📈 Price & Alpha", "ui:alpha").row()
    .text("🎭 Meme & Stickers", "ui:meme")
    .text("🎁 Tips · Airdrops · Games", "ui:rewards").row()
    .text("📣 Marketing & Raids", "ui:mktg").row()
    .text("👤 Account", "ui:account");

  await ctx.reply(
    "Welcome to FOMO Superbot.\n\nUse /menu to open the main menu.\nUse /buy starter USDT to upgrade.",
    { reply_markup: kb }
  );
}

export async function on_callback(ctx: Context) {
  const data = ctx.callbackQuery!.data!;
  switch (data) {
    case "ui:account":
      return (await import("./account.js")).open_account(ctx);
    case "acct:status":
      return (await import("./account.js")).status(ctx);
    case "acct:upgrade":
      return (await import("./account.js")).upgrade(ctx);
    case "ui:safety":
      return ctx.reply("Safety tools:", {
        reply_markup: new InlineKeyboard()
          .text("🔍 Scan Contract", "safety:scan").row()
          .text("🍯 Honeypot Check", "safety:honeypot").row()
          .text("🚩 Report Scam", "safety:report").row()
          .text("◀️ Back", "ui:back")
      });
    case "ui:alpha":
      return ctx.reply("Price & Alpha panel (stub).", {
        reply_markup: new InlineKeyboard().text("◀️ Back", "ui:back")
      });
    case "ui:meme":
      return ctx.reply("Meme & Stickers (stub).", {
        reply_markup: new InlineKeyboard().text("◀️ Back", "ui:back")
      });
    case "ui:rewards":
      return ctx.reply("Tips · Airdrops · Games (stub).", {
        reply_markup: new InlineKeyboard().text("◀️ Back", "ui:back")
      });
    case "ui:mktg":
      return ctx.reply("Marketing & Raids (stub).", {
        reply_markup: new InlineKeyboard().text("◀️ Back", "ui:back")
      });
    case "ui:back":
      return open_member_menu(ctx);
    default:
      return ctx.answerCallbackQuery({ text: "Unknown", show_alert: false });
  }
}
