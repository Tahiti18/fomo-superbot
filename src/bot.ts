import { Bot, webhookCallback } from "grammy";
import { CFG } from "./config.js";
import * as H from "./handlers/index.js";

export const bot = new Bot(CFG.BOT_TOKEN);

// Register slash commands shown in Telegram menu
await bot.api.setMyCommands([
  { command: "start", description: "Open main menu" },
  { command: "menu",  description: "Open main menu" },
  { command: "status", description: "Subscription status" },
  { command: "buy", description: "Upgrade plans" },
  { command: "help", description: "Usage help" },
]);

// Commands
bot.command("start", async (ctx) => {
  await ctx.reply("Welcome to FOMO Superbot. Use /menu to open the menu.");
  return H.ui.open_member_menu(ctx);
});

bot.command("menu", H.ui.open_member_menu);
bot.command("status", H.account.status);
bot.command("help", (ctx) => ctx.reply("Use /menu to open the FOMO Superbot menu."));

// stubs
bot.command("buy", (ctx) => ctx.reply("Invoice stub — use CryptoBot/Stars here."));
bot.command("scan", (ctx) => ctx.reply("Usage: /scan <contract> (stub)"));
bot.command("honeypot", (ctx) => ctx.reply("Usage: /honeypot <contract> (stub)"));
bot.command("alerts", (ctx) => ctx.reply("Usage: /alerts <symbol|CA> (stub)"));

// Centralized callback handling
bot.on("callback_query:data", async (ctx) => {
  const data = ctx.callbackQuery?.data || "";
  if (data.startsWith("ui:")) return H.ui.on_callback(ctx);
  if (data.startsWith("acct:")) return H.account.on_callback(ctx);
  if (data.startsWith("safe:")) return H.safety.on_callback(ctx);
  if (data.startsWith("mkt:")) return H.market.on_callback(ctx);
  return ctx.answerCallbackQuery({ text: "No route" });
});

export const webhook = webhookCallback(bot, "express", { secretToken: CFG.BOT_SECRET });
