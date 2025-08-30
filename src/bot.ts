import { Bot, webhookCallback } from "grammy";
import { CFG } from "./config.js";
import * as H from "./handlers/index.js";

export const bot = new Bot(CFG.BOT_TOKEN);

bot.command("start", async (ctx) => {
  await ctx.reply("Welcome to FOMO Superbot. Use /menu to open the main menu. Use /buy starter to upgrade.");
  return H.ui.open_member_menu(ctx);
});

bot.command("menu", H.ui.open_member_menu);
bot.command("help", async (ctx) => ctx.reply("Use /menu to open the FOMO Superbot menu."));

bot.command("status", H.account.status);

// Buy stub — inserts premium directly
bot.command("buy", async (ctx) => {
  const parts = (ctx.match as string || "").trim().split(" ");
  const tier = parts[0] || "starter";
  const userId = ctx.from?.id;
  if (!userId) return ctx.reply("User not found.");

  const expiresAt = tier === "lifetime" ? null : new Date(Date.now() + 30*24*60*60*1000);
  await (await import("./db.js")).pool.query(
    "INSERT INTO subscriptions (user_id, tier, expires_at) VALUES ($1,$2,$3)",
    [userId, tier, expiresAt]
  );
  await ctx.reply(`✅ Upgraded to ${tier}!`);
});

bot.on("callback_query:data", H.ui.on_callback);

export const webhook = webhookCallback(bot, "express", { secretToken: CFG.BOT_SECRET });
