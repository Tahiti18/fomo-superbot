import type { Context } from "grammy";
import { InlineKeyboard } from "grammy";
import * as account from "./account.js";
import * as safety from "./safety.js";
import * as market from "./market.js";

export async function open_member_menu(ctx: Context) {
  const kb = new InlineKeyboard()
    .text("🛡️ Safety", "ui:safety").text("📈 Price & Alpha", "ui:market").row()
    .text("👤 Account", "ui:account");
  await ctx.reply(
    "Welcome to FOMO Superbot. Use /menu to open the menu.",
    { reply_markup: kb }
  );
}

export async function on_callback(ctx: Context) {
  const data = ctx.callbackQuery?.data || "";
  if (data === "ui:safety") return safety.open_tools(ctx);
  if (data === "ui:market") return market.open_tools(ctx);
  if (data === "ui:account") return account.open_account(ctx);
  if (data === "ui:back") return open_member_menu(ctx);
  return ctx.answerCallbackQuery({ text: "Unknown action", show_alert: false });
}
