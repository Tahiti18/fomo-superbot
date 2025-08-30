import { Bot, webhookCallback } from "grammy";

const token = process.env.BOT_TOKEN;
let webhook = null;

if (token) {
  const bot = new Bot(token);

  bot.command("start", ctx => ctx.reply("Welcome to FOMO Superbot. Use /menu to open the menu."));
  bot.command("menu", ctx => ctx.reply("Menu: Safety | Price & Alpha | Account"));

  // Export the express-compatible webhook handler
  webhook = webhookCallback(bot, "express");
} else {
  console.warn("BOT_TOKEN not set. Telegram webhook will return 500 until configured.");
}

// Export for server.js to import lazily
export { webhook };
