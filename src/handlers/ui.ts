import type { Context } from "grammy";
import { InlineKeyboard } from "grammy";

export async function open_member_menu(ctx: Context) {
  const kb = new InlineKeyboard()
    .text("🛡 Safety", "ui:safety").row()
    .text("📈 Price & Alpha", "ui:market").row()
    .text("🎭 Memes & Stickers", "ui:meme").row()
    .text("🎁 Tips & Airdrops", "ui:rewards").row()
    .text("🚀 Marketing & Raids", "ui:raids").row()
    .text("👤 Account", "ui:account").row();
  await ctx.reply("📍 *Main Menu*", { parse_mode: "Markdown", reply_markup: kb });
}

export async function on_callback(ctx: Context) {
  const d = ctx.callbackQuery?.data;
  await ctx.answerCallbackQuery().catch(() => {});
  if (!d) return;
  if (d.startsWith("ui:account")) return import("./account.js").then(m => m.open_account(ctx));
  if (d.startsWith("ui:safety")) return ctx.reply("Safety menu (stub)");
  if (d.startsWith("ui:market")) return ctx.reply("Market menu (stub)");
  if (d.startsWith("ui:meme")) return ctx.reply("Meme menu (stub)");
  if (d.startsWith("ui:rewards")) return ctx.reply("Rewards menu (stub)");
  if (d.startsWith("ui:raids")) return ctx.reply("Raids menu (stub)");
}