// src/handlers/ui.ts
import type { Context } from "grammy";
import { InlineKeyboard } from "grammy";

/** Helpers */
async function safeEdit(ctx: Context, text: string, kb: InlineKeyboard) {
  try {
    if (ctx.update.callback_query) {
      await ctx.editMessageText(text, { reply_markup: kb, parse_mode: "Markdown" });
    } else {
      await ctx.reply(text, { reply_markup: kb, parse_mode: "Markdown" });
    }
  } catch {
    await ctx.reply(text, { reply_markup: kb, parse_mode: "Markdown" });
  }
}

/** Main menu */
export async function open_member_menu(ctx: Context) {
  const kb = new InlineKeyboard()
    .text("🛡️  Safety", "ui:safety")
    .text("📈  Price & Alpha", "ui:price")
    .row()
    .text("🎭  Meme & Stickers", "ui:meme")
    .text("🎁  Tips · Airdrops · Games", "ui:tips")
    .row()
    .text("📣  Marketing & Raids", "ui:marketing")
    .row()
    .text("👤  Account", "ui:account");

  const msg =
    "Welcome to FOMO Superbot.\n\n" +
    "Use /menu to open the main menu.\nUse /buy starter USDT to upgrade.\n\n" +
    "*Pick a section:*";

  await safeEdit(ctx, msg, kb);
}

/** Safety submenu */
export async function open_safety(ctx: Context) {
  const kb = new InlineKeyboard()
    .text("🔍 Scan Contract", "ui:scan")
    .row()
    .text("🍯 Honeypot Check", "ui:hp")
    .row()
    .text("🚨 Report Scam", "ui:report")
    .row()
    .text("🔙 Back", "ui:back");
  await safeEdit(ctx, "🛡️ *Safety tools:*", kb);
}

/** Price & Alpha submenu (distinct from Safety) */
export async function open_price(ctx: Context) {
  const kb = new InlineKeyboard()
    .text("📊 Quick token chart", "ui:chart")
    .row()
    .text("🐳 Price/Whale alerts", "ui:alerts")
    .row()
    .text("🔙 Back", "ui:back");
  await safeEdit(ctx, "📈 *Price & Alpha:*", kb);
}

/** Meme & Stickers submenu */
export async function open_meme(ctx: Context) {
  const kb = new InlineKeyboard()
    .text("🎨 Create token stickers", "ui:stickers")
    .row()
    .text("🖼️ Meme generator", "ui:meme_gen")
    .row()
    .text("🔙 Back", "ui:back");
  await safeEdit(ctx, "🎭 *Memes & Stickers:*", kb);
}

/** Tips / Airdrops / Games submenu */
export async function open_tips(ctx: Context) {
  const kb = new InlineKeyboard()
    .text("💸 Tip a user", "ui:tip")
    .row()
    .text("🎁 Airdrop to chat", "ui:airdrop")
    .row()
    .text("🕹️ Mini-games (soon)", "ui:games")
    .row()
    .text("🔙 Back", "ui:back");
  await safeEdit(ctx, "🎁 *Tips · Airdrops · Games:*", kb);
}

/** Marketing & Raids submenu */
export async function open_marketing(ctx: Context) {
  const kb = new InlineKeyboard()
    .text("🚀 Start a raid", "ui:raid")
    .row()
    .text("📣 Shill tools (soon)", "ui:shill")
    .row()
    .text("🔙 Back", "ui:back");
  await safeEdit(ctx, "📣 *Marketing & Raids:*", kb);
}

/** Account submenu */
export async function open_account(ctx: Context) {
  const kb = new InlineKeyboard()
    .text("⭐ Subscription status", "ui:status")
    .row()
    .text("💳 Upgrade", "ui:upgrade")
    .row()
    .text("🔙 Back", "ui:back");
  await safeEdit(ctx, "👤 *Account:*", kb);
}

/** Callback router entry points (all buttons land here) */
export async function on_callback(ctx: Context) {
  const data = ctx.callbackQuery?.data || "";
  switch (data) {
    case "ui:safety":    return open_safety(ctx);
    case "ui:price":     return open_price(ctx);
    case "ui:meme":      return open_meme(ctx);
    case "ui:tips":      return open_tips(ctx);
    case "ui:marketing": return open_marketing(ctx);
    case "ui:account":   return open_account(ctx);

    case "ui:scan":      return ctx.answerCallbackQuery({ text: "Scan: send /scan <contract>" });
    case "ui:hp":        return ctx.answerCallbackQuery({ text: "Honeypot: send /honeypot <contract>" });
    case "ui:report":    return ctx.answerCallbackQuery({ text: "Report: coming soon" });

    case "ui:chart":     return ctx.answerCallbackQuery({ text: "Chart: coming soon" });
    case "ui:alerts":    return ctx.answerCallbackQuery({ text: "Alerts: coming soon" });

    case "ui:stickers":  return ctx.answerCallbackQuery({ text: "Stickers: coming soon" });
    case "ui:meme_gen":  return ctx.answerCallbackQuery({ text: "Meme gen: send /meme <prompt>" });

    case "ui:tip":       return ctx.answerCallbackQuery({ text: "Tip: coming soon" });
    case "ui:airdrop":   return ctx.answerCallbackQuery({ text: "Airdrop: coming soon" });
    case "ui:games":     return ctx.answerCallbackQuery({ text: "Games: coming soon" });

    case "ui:raid":      return ctx.answerCallbackQuery({ text: "Raid: use Marketing & Raids" });
    case "ui:shill":     return ctx.answerCallbackQuery({ text: "Shill tools: coming soon" });

    case "ui:status":    return ctx.answerCallbackQuery({ text: "Status: coming soon" });
    case "ui:upgrade":   return ctx.answerCallbackQuery({ text: "Use /buy starter USDT" });

    case "ui:back":      return open_member_menu(ctx);
    default:
      return ctx.answerCallbackQuery({ text: "Unknown action" });
  }
}
