import { Bot, webhookCallback } from "grammy";
import { CFG } from "./config.js";
import * as H from "./handlers/index.js";

export const bot = new Bot(CFG.BOT_TOKEN);

// === Commands ===
bot.command("start", async (ctx) => {
  await ctx.reply(
    "Welcome to FOMO Superbot.\n\nUse /menu to open the main menu.\nUse /buy starter USDT to upgrade."
  );
  return H.ui.open_member_menu(ctx);
});

bot.command("menu", H.ui.open_member_menu);
bot.command("help", async (ctx) => ctx.reply("Use /menu to open the FOMO Superbot menu."));

// Safety quick commands (stubs)
bot.command("scan", async (ctx) => {
  const ca = (ctx.match as string || "").trim();
  if (!ca) return ctx.reply("Usage: /scan <contract>");
  await ctx.reply(`Scanning: ${ca}`);
});
bot.command("honeypot", async (ctx) => {
  const ca = (ctx.match as string || "").trim();
  if (!ca) return ctx.reply("Usage: /honeypot <contract>");
  await ctx.reply(`Honeypot test: ${ca}`);
});

// Payments (stub)
bot.command("buy", H.billing.upgrade);

// === Callback routing === (centralized in ui.ts)
bot.on("callback_query:data", H.ui.on_callback);

export const webhook = webhookCallback(bot, "express", { secretToken: CFG.BOT_SECRET });
