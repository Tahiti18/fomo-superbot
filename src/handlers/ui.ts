import type { Context } from "grammy";
import { InlineKeyboard } from "grammy";

export async function open_member_menu(ctx: Context) {
  const kb = new InlineKeyboard()
    .text("👤 Account", "ui:account").row()
    .text("❌ Close", "ui:close");
  await ctx.reply("📋 *Main Menu*", { parse_mode: "Markdown", reply_markup: kb });
}

export async function on_callback(ctx: Context) {
  const data = ctx.callbackQuery?.data;
  if (!data) return;
  if (data === "ui:account") return import("./account.js").then(m => m.open_account(ctx));
  if (data.startsWith("acct:")) {
    const m = await import("./account.js");
    if (data === "acct:status") return m.status(ctx);
    if (data === "acct:upgrade") return m.upgrade(ctx);
  }
  if (data === "ui:close") return ctx.deleteMessage().catch(() => {});
}
