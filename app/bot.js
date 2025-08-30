import { Bot, InlineKeyboard } from "grammy";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.BOT_TOKEN) {
  throw new Error("BOT_TOKEN is missing in environment");
}

export const bot = new Bot(process.env.BOT_TOKEN);

// --- Commands ---
bot.command("start", async (ctx) => {
  const kb = new InlineKeyboard()
    .text("🛡️ Safety", "safety").row()
    .text("📈 Price & Alpha", "price").row()
    .text("👤 Account", "account");

  await ctx.reply(
    "Welcome to FOMO Superbot.\nUse /menu to open the main menu.",
    { reply_markup: kb }
  );
});

bot.command("menu", async (ctx) => {
  const kb = new InlineKeyboard()
    .text("🛡️ Safety", "safety").row()
    .text("📈 Price & Alpha", "price").row()
    .text("👤 Account", "account");

  await ctx.reply("Open menu with the buttons below:", { reply_markup: kb });
});

// --- Callback handlers ---
bot.callbackQuery("safety", (ctx) => ctx.answerCallbackQuery({ text: "Safety coming soon!" }));
bot.callbackQuery("price", (ctx) => ctx.answerCallbackQuery({ text: "Price & Alpha coming soon!" }));
bot.callbackQuery("account", (ctx) => ctx.answerCallbackQuery({ text: "Account coming soon!" }));

// Fallback
bot.on("message", (ctx) => ctx.reply("Try /start or /menu"));
