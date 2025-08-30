// src/handlers/ui.ts
import type { Context } from "grammy";
import { InlineKeyboard } from "grammy";

// Central dispatcher for inline callback data
export async function on_callback(ctx: Context) {
  const data = ctx.callbackQuery?.data || "";
  try {
    if (data === "ui:main") return open_member_menu(ctx);
    if (data === "ui:back") return open_member_menu(ctx);

    if (data === "ui:safety") return open_safety(ctx);
    if (data === "ui:market") return open_market(ctx);
    if (data === "ui:rewards") return open_rewards(ctx);
    if (data === "ui:account") return open_account_shortcut(ctx);
    if (data === "ui:alerts") return open_alerts(ctx);

    await ctx.answerCallbackQuery({ text: "Unknown action" });
  } catch (e) {
    await ctx.answerCallbackQuery({ text: "Oops, failed", show_alert: false }).catch(() => {});
  }
}

// ===== MAIN MEMBER MENU (force this layout) =====
export async function open_member_menu(ctx: Context) {
  const txt =
    "Welcome to FOMO Superbot.\n\n" +
    "Use /menu to open the main menu.\n" +
    "Use /buy starter USDT to upgrade.\n\n" +
    "Pick a section:";

  const kb = new InlineKeyboard()
    .text("🛡️ Safety", "ui:safety").text("📈 Price & Alpha", "ui:market").row()
    .text("🎭 Meme & Stickers", "ui:rewards").text("🎁 Tips · Airdrops · Games", "ui:alerts").row()
    .text("📣 Marketing & Raids", "mktg:open").row()
    .text("👤 Account", "ui:account");

  // Prefer edit if this is a button flow; otherwise send new message
  await ctx.editMessageText(txt, { reply_markup: kb }).catch(async () => {
    await ctx.reply(txt, { reply_markup: kb });
  });
}

// ===== SECTIONS (placeholders wired to real handlers you already have) =====
export async function open_safety(ctx: Context) {
  const kb = new InlineKeyboard()
    .text("🔍 Scan Contract", "safety:scan").row()
    .text("🍯 Honeypot Check", "safety:honeypot").row()
    .text("🚩 Report Scam", "safety:report").row()
    .text("◀️ Back", "ui:back");

  await ctx.editMessageText("🛡️ *Safety tools:*", {
    parse_mode: "Markdown",
    reply_markup: kb,
  }).catch(async () => {
    await ctx.reply("🛡️ *Safety tools:*", { parse_mode: "Markdown", reply_markup: kb });
  });
}

export async function open_market(ctx: Context) {
  const kb = new InlineKeyboard()
    .text("📉 Quick token chart", "market:chart").row()
    .text("👥 Holder scan", "market:holders").row()
    .text("📢 Price/whale alerts", "market:alerts").row()
    .text("◀️ Back", "ui:back");

  await ctx.editMessageText("📈 *Price & Alpha:*", {
    parse_mode: "Markdown",
    reply_markup: kb,
  }).catch(async () => {
    await ctx.reply("📈 *Price & Alpha:*", { parse_mode: "Markdown", reply_markup: kb });
  });
}

export async function open_rewards(ctx: Context) {
  const kb = new InlineKeyboard()
    .text("🖼️ Create token stickers", "meme:stickers").row()
    .text("🧠 Meme generator", "meme:gen").row()
    .text("◀️ Back", "ui:back");

  await ctx.editMessageText("🎭 *Memes & Stickers:*", {
    parse_mode: "Markdown",
    reply_markup: kb,
  }).catch(async () => {
    await ctx.reply("🎭 *Memes & Stickers:*", { parse_mode: "Markdown", reply_markup: kb });
  });
}

export async function open_alerts(ctx: Context) {
  const kb = new InlineKeyboard()
    .text("🔔 Set price alerts", "market:alerts").row()
    .text("🎁 Airdrops hub", "rewards:airdrops").row()
    .text("🎮 Mini games", "rewards:games").row()
    .text("◀️ Back", "ui:back");

  await ctx.editMessageText("🎁 *Tips · Airdrops · Games:*", {
    parse_mode: "Markdown",
    reply_markup: kb,
  }).catch(async () => {
    await ctx.reply("🎁 *Tips · Airdrops · Games:*", { parse_mode: "Markdown", reply_markup: kb });
  });
}

// Keep “Account” button in the same flow (small shortcut)
async function open_account_shortcut(ctx: Context) {
  // If you already have H.account.open_account wired elsewhere, you can just:
  // return H.account.open_account(ctx)
  const kb = new InlineKeyboard()
    .text("📊 Subscription status", "acct:status").row()
    .text("💳 Upgrade", "acct:upgrade").row()
    .text("◀️ Back", "ui:back");

  await ctx.editMessageText("👤 *Account*", {
    parse_mode: "Markdown",
    reply_markup: kb,
  }).catch(async () => {
    await ctx.reply("👤 *Account*", { parse_mode: "Markdown", reply_markup: kb });
  });
}
