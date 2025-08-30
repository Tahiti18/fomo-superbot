import type { Context } from "grammy";
import { InlineKeyboard } from "grammy";
import * as account from "./account.js";
import * as safety from "./safety.js";
import * as market from "./market.js";
import * as mktg from "./mktg.js";
import * as billing from "./billing.js";

// Top-level member menu
export async function open_member_menu(ctx: Context) {
  const kb = new InlineKeyboard()
    .text("🛡️ Safety", "ui:safety").row()
    .text("📈 Price & Alpha", "ui:price").row()
    .text("🎭 Meme & Stickers", "ui:meme").row()
    .text("📣 Marketing & Raids", "ui:mktg").row()
    .text("👤 Account", "ui:account");
  const txt = "Welcome to FOMO Superbot. Use /menu to open the menu.";
  return ctx.reply(txt, { reply_markup: kb });
}

export async function on_callback(ctx: Context) {
  const data = ctx.callbackQuery?.data || "";
  if (data.startsWith("ui:")) {
    const x = data.slice(3);
    if (x === "safety") return safety.open_panel(ctx);
    if (x === "price") return market.open_panel(ctx);
    if (x === "meme") return ctx.reply("Meme studio (soon)");
    if (x === "mktg") return mktg.open_panel(ctx);
    if (x === "account") return account.open_account(ctx);
    if (x === "back") return open_member_menu(ctx);
  }
  if (data.startsWith("acct:")) {
    if (data === "acct:status") return account.status(ctx);
    if (data === "acct:upgrade") return billing.upgrade(ctx);
    if (data === "acct:back") return open_member_menu(ctx);
  }
  if (data.startsWith("safe:")) {
    if (data === "safe:scan") return safety.scan_prompt(ctx);
    if (data === "safe:hp")   return safety.honeypot_prompt(ctx);
    if (data === "safe:rep")  return safety.report_prompt(ctx);
    if (data === "safe:back") return open_member_menu(ctx);
  }
  return ctx.answerCallbackQuery({ text: "Unknown", show_alert: true }).catch(()=>{});
}
