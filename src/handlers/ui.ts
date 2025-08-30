// src/handlers/ui.ts
import type { Context } from "grammy";
import { InlineKeyboard } from "grammy";

/** === MAIN MENU === */
export async function open_member_menu(ctx: Context) {
  const kb = new InlineKeyboard()
    .text("🛡️ Safety", "ui:safety").row()
    .text("📈 Price & Alpha", "ui:price").row()
    .text("🎭 Meme & Stickers", "ui:memes").row()
    .text("🎁 Tips • Airdrops • Games", "ui:tips").row()
    .text("📣 Marketing & Raids", "ui:mktg").row()
    .text("👤 Account", "ui:account");

  return ctx.reply(
    "Welcome to FOMO Superbot.\n\nPick a section:",
    { reply_markup: kb }
  );
}

/** === SUBMENUS (each has its own callback key) === */
export async function open_safety(ctx: Context) {
  const kb = new InlineKeyboard()
    .text("🔍 Scan Contract", "safety:scan").row()
    .text("🍯 Honeypot Check", "safety:honeypot").row()
    .text("🚨 Report Scam", "safety:report").row()
    .text("⬅️ Back", "ui:menu");

  return ctx.editMessageText("🛡️ Safety tools:", { reply_markup: kb }).catch(async () =>
    ctx.reply("🛡️ Safety tools:", { reply_markup: kb })
  );
}

export async function open_price(ctx: Context) {
  const kb = new InlineKeyboard()
    .text("🔔 Price/Whale Alerts", "price:alerts").row()
    .text("📊 Quick Token Chart", "price:chart").row()
    .text("⬅️ Back", "ui:menu");

  return ctx.editMessageText("📈 Price & Alpha:", { reply_markup: kb }).catch(async () =>
    ctx.reply("📈 Price & Alpha:", { reply_markup: kb })
  );
}

export async function open_memes(ctx: Context) {
  const kb = new InlineKeyboard()
    .text("🎨 Create Token Stickers", "memes:stickers").row()
    .text("🖼️ Meme Generator", "memes:meme").row()
    .text("⬅️ Back", "ui:menu");

  return ctx.editMessageText("🎭 Meme & Stickers:", { reply_markup: kb }).catch(async () =>
    ctx.reply("🎭 Meme & Stickers:", { reply_markup: kb })
  );
}

export async function open_tips(ctx: Context) {
  const kb = new InlineKeyboard()
    .text("💸 Tip", "tips:tip").row()
    .text("🌧️ Rain", "tips:rain").row()
    .text("🎮 Games (soon)", "tips:games").row()
    .text("⬅️ Back", "ui:menu");

  return ctx.editMessageText("🎁 Tips • Airdrops • Games:", { reply_markup: kb }).catch(async () =>
    ctx.reply("🎁 Tips • Airdrops • Games:", { reply_markup: kb })
  );
}

export async function open_mktg(ctx: Context) {
  const kb = new InlineKeyboard()
    .text("⚔️ Start Raid", "mktg:raid").row()
    .text("📣 Promo Tools (soon)", "mktg:promo").row()
    .text("⬅️ Back", "ui:menu");

  return ctx.editMessageText("📣 Marketing & Raids:", { reply_markup: kb }).catch(async () =>
    ctx.reply("📣 Marketing & Raids:", { reply_markup: kb })
  );
}

export async function open_account(ctx: Context) {
  const kb = new InlineKeyboard()
    .text("🔐 Subscription Status", "acct:status").row()
    .text("💳 Upgrade", "acct:upgrade").row()
    .text("⬅️ Back", "ui:menu");

  return ctx.editMessageText("👤 Account:", { reply_markup: kb }).catch(async () =>
    ctx.reply("👤 Account:", { reply_markup: kb })
  );
}

/** === SIMPLE NAV HANDLES so router can map === */
export const routes = [
  { pattern: /^ui:menu$/, handler: "ui.open_member_menu" },
  { pattern: /^ui:safety$/, handler: "ui.open_safety" },
  { pattern: /^ui:price$/, handler: "ui.open_price" },
  { pattern: /^ui:memes$/, handler: "ui.open_memes" },
  { pattern: /^ui:tips$/, handler: "ui.open_tips" },
  { pattern: /^ui:mktg$/, handler: "ui.open_mktg" },
  { pattern: /^ui:account$/, handler: "ui.open_account" },
];
