// src/handlers/ui.ts
import type { Context } from "grammy";
import { InlineKeyboard } from "grammy";
import * as H from "./index.js";

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

export async function on_callback(ctx: Context) {
  const data = ctx.callbackQuery?.data || "";
  const [ns, action] = data.split(":");

  if (!ns || !action) {
    await ctx.answerCallbackQuery({ text: "Unknown" }).catch(() => {});
    return;
  }

  if (ns === "ui" && action === "back") {
    await ctx.answerCallbackQuery().catch(() => {});
    await open_member_menu(ctx);
    return;
  }

  // Open section menus
  if (ns === "acct" && action === "menu") return H.account.open_account(ctx);
  if (ns === "safety" && action === "menu") return H.safety.open_menu(ctx);
  if (ns === "market" && action === "menu") return H.market.open_menu(ctx);
  if (ns === "meme" && action === "menu") return H.meme.open_menu(ctx);
  if (ns === "rewards" && action === "menu") return H.rewards.open_menu(ctx);
  if (ns === "mktg" && action === "menu") return H.mktg.open_menu(ctx);

  // Dynamic dispatch for ns:action
  const mod: any = (H as any)[ns];
  const fn = mod?.[action];
  if (typeof fn === "function") {
    await ctx.answerCallbackQuery().catch(() => {});
    await fn(ctx);
    return;
  }
  await ctx.answerCallbackQuery({ text: "Unknown" }).catch(() => {});
}
