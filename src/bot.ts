import { Bot, webhookCallback, InlineKeyboard } from "grammy";
import dotenv from "dotenv";
dotenv.config();

export const bot = new Bot(process.env.BOT_TOKEN!);

// Simple start/menu
bot.command("start", async (ctx) => {
  const kb = new InlineKeyboard()
    .text("Safety", "ui:safety").row()
    .text("Price & Alpha", "ui:market").row()
    .text("Account", "ui:account");
  await ctx.reply("Welcome to FOMO Superbot. Use /menu to open the menu.", { reply_markup: kb });
});
bot.command("menu", (ctx) => ctx.reply("Open menu with the buttons above."));

// Minimal callbacks (safe defaults)
bot.on("callback_query:data", async (ctx) => {
  const d = ctx.callbackQuery!.data;
  if (d === "ui:account") {
    const kb = new InlineKeyboard().text("Back", "ui:back");
    await ctx.editMessageText("👤 Account (stub)", { reply_markup: kb });
  } else if (d === "ui:safety") {
    const kb = new InlineKeyboard().text("Back", "ui:back");
    await ctx.editMessageText("🛡️ Safety tools (stub)", { reply_markup: kb });
  } else if (d === "ui:market") {
    const kb = new InlineKeyboard().text("Back", "ui:back");
    await ctx.editMessageText("📈 Market tools (stub)", { reply_markup: kb });
  } else if (d === "ui:back") {
    const kb = new InlineKeyboard()
      .text("Safety", "ui:safety").row()
      .text("Price & Alpha", "ui:market").row()
      .text("Account", "ui:account");
    await ctx.editMessageText("Welcome to FOMO Superbot. Use /menu to open the menu.", { reply_markup: kb });
  } else {
    await ctx.answerCallbackQuery({ text: "Unknown", show_alert: false });
  }
});

export const webhook = webhookCallback(bot, "express", { secretToken: process.env.BOT_SECRET! });
