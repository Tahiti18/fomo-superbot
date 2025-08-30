// src/handlers/ui.ts
import type { Context } from "grammy";
import { InlineKeyboard } from "grammy";

// Central dispatcher for inline callback data
export async function on_callback(ctx: Context) {
  const data = ctx.callbackQuery?.data || "";
  try {
    if (data === "ui:main" || data === "ui:back") return open_member_menu(ctx);

    if (data === "ui:safety") return open_safety(ctx);
    if (data === "ui:market") return open_market(ctx);
    if (data === "ui:rewards") return open_rewards(ctx);
    if (data === "ui:alerts") return open_alerts(ctx);
    if (data === "ui:account") return open_account_shortcut(ctx);

    await ctx.answerCallbackQuery({ text: "Unknown action" });
  } catch {
    await ctx.answerCallbackQuery({ text: "Failed", show_alert: false }).catch(() => {});
  }
}

// ===== MAIN MEMBER MENU (force full grid) =====
export async function open_member_menu(ctx: Context) {
  const txt =
    "Welcome to FOMO Superbot. [MENU-V2]\n\n" + // ← version tag so we can see it's the new file
    "Use /menu to open the main menu.\n" +
    "Use /buy starter USDT to upgrade.\n\n" +
    "Pick a section:";

  const kb = new InlineKeyboard()
    .text("🛡️ Safety", "ui:safety").text("📈 Price & Alpha", "ui:market").row()
    .text("🎭 Meme & Stickers", "ui:rewards").text("🎁 Tips · Airdrops · Games", "ui:alerts").row()
    .text("📣 Marketing & Raids", "mktg:open").row()
    .text("👤 Account", "ui:account");

  await ctx.editMessageText(txt, { reply_markup: kb }).catch(async () => {
    await ctx.reply(txt, { reply_markup: kb });
  });
}

// ===== Sections =====
export async function open_safety(ctx: Context) {
  const kb = new InlineKeyboard()
    .text("🔍 Scan Contract", "safety:scan").row()
    .text("🍯 Honeypot Check", "safety:honeypot").row()
    .text("🚩 Report Scam", "safety:report").row()
    .text("◀️ Back", "ui:back");

  await ctx.editMessageText("🛡️ *Safety tools:*", {
    parse_mode: "Markdown",
    reply_markup: kb,
  }).catch(async () =>
    ctx.reply("🛡️ *Safety tools:*", { parse_mode: "Markdown", reply_markup: kb })
  );
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
  }).catch(async () =>
    ctx.reply("📈 *Price & Alpha:*", { parse_mode: "Markdown", reply_markup: kb })
  );
}

export async function open_rewards(ctx: Context) {
  const kb = new InlineKeyboard()
    .text("🖼️ Create token stickers", "meme:stickers").row()
    .text("🧠 Meme generator", "meme:gen").row()
    .text("◀️ Back", "ui:back");

  await ctx.editMessageText("🎭 *Memes & Stickers:*", {
    parse_mode: "Markdown",
    reply_markup: kb,
  }).catch(async () =>
    ctx.reply("🎭 *Memes & Stickers:*", { parse_mode: "Markdown", reply_markup: kb })
  );
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
  }).catch(async () =>
    ctx.reply("🎁 *Tips · Airdrops · Games:*", { parse_mode: "Markdown", reply_markup: kb })
  );
}

async function open_account_shortcut(ctx: Context) {
  const kb = new InlineKeyboard()
    .text("📊 Subscription status", "acct:status").row()
    .text("💳 Upgrade", "acct:upgrade").row()
    .text("◀️ Back", "ui:back");

  await ctx.editMessageText("👤 *Account*", {
    parse_mode: "Markdown",
    reply_markup: kb,
  }).catch(async () =>
    ctx.reply("👤 *Account*", { parse_mode: "Markdown", reply_markup: kb })
  );
}
