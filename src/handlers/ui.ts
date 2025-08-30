// src/handlers/ui.ts
import type { Context } from "grammy";
import { InlineKeyboard } from "grammy";
import * as H from "./index.js"; // gives H.ui, H.account, H.safety, H.market, etc.

// Main member menu
export async function open_member_menu(ctx: Context) {
  const kb = new InlineKeyboard()
    .text("🛡️ Safety", "safety:menu")
    .text("📈 Price & Alpha", "market:menu").row()
    .text("🎭 Meme & Stickers", "meme:menu")
    .text("🎁 Tips · Airdrops · Games", "rewards:menu").row()
    .text("📣 Marketing & Raids", "mktg:menu").row()
    .text("👤 Account", "acct:menu");

  await ctx.reply(
    "Welcome to FOMO Superbot.\n\nUse /menu to open the main menu.\nUse /buy starter USDT to upgrade.\n\nPick a section:",
    { reply_markup: kb }
  );
}

// Generic callback router (under grammy)
export async function on_callback(ctx: Context) {
  const data = ctx.callbackQuery?.data || "";
  const [ns, action] = data.split(":");

  // Basic sanity
  if (!ns || !action) {
    await ctx.answerCallbackQuery({ text: "Unknown", show_alert: false }).catch(() => {});
    return;
  }

  // UI-local actions
  if (ns === "ui" && action === "back") {
    await ctx.answerCallbackQuery().catch(() => {});
    await open_member_menu(ctx);
    return;
  }

  // Menu openings for top-level buttons
  if (ns === "acct" && action === "menu") {
    await ctx.answerCallbackQuery().catch(() => {});
    const kb = new InlineKeyboard()
      .text("📊 Subscription status", "acct:status").row()
      .text("💳 Upgrade", "acct:upgrade").row()
      .text("◀️ Back", "ui:back");
    await ctx.reply("👤 *Account*", { parse_mode: "Markdown", reply_markup: kb });
    return;
  }
  if (ns === "safety" && action === "menu") {
    await ctx.answerCallbackQuery().catch(() => {});
    const kb = new InlineKeyboard()
      .text("🔎 Scan Contract", "safety:scan").row()
      .text("🍯 Honeypot Check", "safety:honeypot").row()
      .text("🚩 Report Scam", "safety:report").row()
      .text("◀️ Back", "ui:back");
    await ctx.reply("🛡️ *Safety tools:*", { parse_mode: "Markdown", reply_markup: kb });
    return;
  }
  if (ns === "market" && action === "menu") {
    await ctx.answerCallbackQuery().catch(() => {});
    const kb = new InlineKeyboard()
      .text("📊 Quick token chart", "market:chart").row()
      .text("📈 Price/Whale alerts", "market:alerts").row()
      .text("◀️ Back", "ui:back");
    await ctx.reply("📈 *Price & Alpha:*", { parse_mode: "Markdown", reply_markup: kb });
    return;
  }
  if (ns === "meme" && action === "menu") {
    await ctx.answerCallbackQuery().catch(() => {});
    const kb = new InlineKeyboard()
      .text("🖼️ Create token stickers", "meme:stickers").row()
      .text("◀️ Back", "ui:back");
    await ctx.reply("🎭 *Meme & Stickers:*", { parse_mode: "Markdown", reply_markup: kb });
    return;
  }
  if (ns === "rewards" && action === "menu") {
    await ctx.answerCallbackQuery().catch(() => {});
    const kb = new InlineKeyboard()
      .text("💸 Tips", "rewards:tip").row()
      .text("🌧️ Airdrops", "rewards:airdrop").row()
      .text("🎮 Games", "rewards:games").row()
      .text("◀️ Back", "ui:back");
    await ctx.reply("🎁 *Tips · Airdrops · Games:*", { parse_mode: "Markdown", reply_markup: kb });
    return;
  }
  if (ns === "mktg" && action === "menu") {
    await ctx.answerCallbackQuery().catch(() => {});
    const kb = new InlineKeyboard()
      .text("🚀 Open raid", "mktg:raid").row()
      .text("◀️ Back", "ui:back");
    await ctx.reply("📣 *Marketing & Raids:*", { parse_mode: "Markdown", reply_markup: kb });
    return;
  }

  // Generic dynamic dispatch to any handler module exported in handlers/index.ts
  // e.g. "acct:status" -> H.account.status(ctx)
  //      "acct:upgrade" -> H.account.upgrade(ctx), etc.
  const mod: any = (H as any)[ns];
  const fn = mod?.[action];
  if (typeof fn === "function") {
    await ctx.answerCallbackQuery().catch(() => {});
    await fn(ctx);
    return;
  }

  // Fallback
  await ctx.answerCallbackQuery({ text: "Unknown", show_alert: false }).catch(() => {});
}
