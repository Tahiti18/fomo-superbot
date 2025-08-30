import { Bot, webhookCallback } from "grammy";
import { CFG } from "./config.js";
import * as H from "./handlers/index.js";

export const bot = new Bot(CFG.BOT_TOKEN);

// === Commands ===
bot.command("start", async (ctx) => {
  await ctx.reply("Welcome to FOMO Superbot. Use /menu to open the menu.");
  return H.ui.open_member_menu(ctx);
});

bot.command("menu", H.ui.open_member_menu);
bot.command("help", async (ctx) => ctx.reply("Use /menu to open the FOMO Superbot menu."));

// Account
bot.command("status", H.account.status);
bot.command("buy", H.billing.upgrade);

// Safety
bot.command("scan", H.safety.scan);
bot.command("honeypot", H.safety.honeypot);

// Market
bot.command("price", H.market.price);

// Meme
bot.command("meme", H.meme.generate);

// Rewards
bot.command("tip", H.rewards.tip);
bot.command("rain", H.rewards.rain);

// Raids
bot.command("raid", H.mktg.open_raid);

// Callbacks
bot.on("callback_query:data", H.ui.on_callback);

export const webhook = webhookCallback(bot, "express", { secretToken: CFG.BOT_SECRET });