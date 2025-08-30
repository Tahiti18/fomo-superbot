// src/handlers/ui.ts
import type { Context } from "grammy";
import { InlineKeyboard } from "grammy";
import * as account from "./account.js";
import * as mktg from "./mktg.js";

export async function open_member_menu(ctx: Context) {
  const kb = new InlineKeyboard()
    .text("🛡️ Safety", "ui:safety")
    .text("📊 Price & Alpha", "ui:price").row()
    .text("🎨 Memes & Stickers", "ui:meme")
    .text("🎁 Tips & Airdrops", "ui:tips").row()
    .text("🚀 Marketing & Raids", "ui:mktg")
    .text("👤 Account", "ui:account").row()
    .text("💳 Upgrade", "ui:upgrade");
  await ctx.reply("*FOMO Superbot — Main Menu*", { parse_mode: "Markdown", reply_markup: kb });
}

export async function back(ctx: Context) {
  return open_member_menu(ctx);
}

export async function on_callback(ctx: Context) {
  const data = ctx.callbackQuery?.data || "";
  try {
    if (data === "ui:back") return back(ctx);
    if (data === "ui:safety") return open_safety(ctx);
    if (data === "ui:price") return open_price(ctx);
    if (data === "ui:meme") return open_meme(ctx);
    if (data === "ui:tips") return open_tips(ctx);
    if (data === "ui:mktg") return open_mktg(ctx);
    if (data === "ui:account") return account.open_account(ctx);
    if (data === "ui:upgrade") return account.upgrade(ctx);
    if (data === "noop") {
      return ctx.answerCallbackQuery({
        text: "Use /chart <symbol>, /holders <CA>, /alerts <symbol>, /audit <CA>",
        show_alert: true
      });
    }
    if (data === "mktg:raid") return mktg.open_raid(ctx);
    return ctx.answerCallbackQuery({ text: "Unknown", show_alert: false });
  } catch (e) {
    return ctx.answerCallbackQuery({ text: "Error", show_alert: true });
  }
}

export async function open_safety(ctx: Context) {
  const kb = new InlineKeyboard()
    .text("🔍 Scan contract", "noop")
    .text("🍯 Honeypot check", "noop").row()
    .text("🧾 Audit (CA)", "noop")
    .text("◀️ Back", "ui:back");
  await ctx.reply("*Safety*", { parse_mode: "Markdown", reply_markup: kb });
}

export async function open_price(ctx: Context) {
  const kb = new InlineKeyboard()
    .text("📈 Chart", "noop")
    .text("👥 Holders", "noop").row()
    .text("🔔 Alerts", "noop")
    .text("◀️ Back", "ui:back");
  await ctx.reply("*Price & Alpha*", { parse_mode: "Markdown", reply_markup: kb });
}

export async function open_meme(ctx: Context) {
  const kb = new InlineKeyboard()
    .text("🎨 Generate Meme (stub)", "noop").row()
    .text("◀️ Back", "ui:back");
  await ctx.reply("*Memes & Stickers*", { parse_mode: "Markdown", reply_markup: kb });
}

export async function open_tips(ctx: Context) {
  const kb = new InlineKeyboard()
    .text("🎁 Tip (stub)", "noop")
    .text("🌧️ Rain (stub)", "noop").row()
    .text("◀️ Back", "ui:back");
  await ctx.reply("*Tips & Airdrops*", { parse_mode: "Markdown", reply_markup: kb });
}

export async function open_mktg(ctx: Context) {
  const kb = new InlineKeyboard()
    .text("🚀 Start Raid", "mktg:raid").row()
    .text("◀️ Back", "ui:back");
  await ctx.reply("*Marketing & Raids*", { parse_mode: "Markdown", reply_markup: kb });
}
