// src/bot.ts
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
bot.command("admin", H.admin?.open_section || ((ctx) => ctx.reply("Admin (soon)")));

// Account / Billing
bot.command("status", H.account.status);
bot.command("buy", H.billing.upgrade);

// Safety / quick tools
bot.command("scan", async (ctx) => {
  const ca = ((ctx.match as string) || "").trim();
  if (!ca) return ctx.reply("Usage: /scan <contract>");
  await ctx.reply(`Scanning: ${ca}`);
});
bot.command("honeypot", async (ctx) => {
  const ca = ((ctx.match as string) || "").trim();
  if (!ca) return ctx.reply("Usage: /honeypot <contract>");
  await ctx.reply(`Honeypot test: ${ca}`);
});
bot.command("audit", H.safety.audit);

// Market & info
bot.command("chart", H.market.chart);
bot.command("holders", H.market.holders);
bot.command("alerts", H.market.alerts);

// Fun (stubs kept)
bot.command("meme", async (ctx) => {
  const p = ((ctx.match as string) || "").trim();
  if (!p) return ctx.reply("Usage: /meme <prompt>");
  await ctx.reply(`Meme: ${p} (stub)`);
});
bot.command("tip", async (ctx) => ctx.reply("Tip (stub)"));
bot.command("rain", async (ctx) => ctx.reply("Rain (stub)"));
bot.command("raid", H.mktg?.open_raid || ((ctx) => ctx.reply("Raid (soon)")));

// === Callback routing ===
bot.on("callback_query:data", H.ui.on_callback);

export const webhook = webhookCallback(bot, "express", { secretToken: CFG.BOT_SECRET });
