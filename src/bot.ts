// src/bot.ts
import { Bot, webhookCallback } from "grammy";
import { CFG } from "./config.js";
import * as H from "./handlers/index.js"; // H.ui, H.billing, H.mktg, H.account, H.admin

export const bot = new Bot(CFG.BOT_TOKEN);

// ---- Safe fallbacks for handlers that might not exist yet ----
const openMemberMenu =
  (H.ui && H.ui.open_member_menu) || (async (ctx: any) => ctx.reply("Menu (soon)"));
const onCallback =
  (H.ui && H.ui.on_callback) || (async (ctx: any) => ctx.answerCallbackQuery().catch(() => {}));
const adminOpen =
  (H.admin && H.admin.open_section) || (async (ctx: any) => ctx.reply("Admin (soon)"));
const raidOpen =
  (H.mktg && H.mktg.open_raid) || (async (ctx: any) => ctx.reply("Raid (soon)"));
const upgradeCmd =
  (H.billing && H.billing.upgrade) || (async (ctx: any) => ctx.reply("Payments (soon)"));

// === Commands ===
bot.command("start", async (ctx) => {
  await ctx.reply(
    "Welcome to FOMO Superbot.\n\nUse /menu to open the main menu.\nUse /buy starter USDT to upgrade."
  );
  return openMemberMenu(ctx);
});

bot.command("menu", openMemberMenu);
bot.command("help", (ctx) => ctx.reply("Use /menu to open the FOMO Superbot menu."));
bot.command("admin", adminOpen);

// Account: wire /status to Account → status
bot.command("status", H.account.status);

// Safety / Market quick commands (stubs)
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

bot.command("meme", async (ctx) => {
  const p = ((ctx.match as string) || "").trim();
  if (!p) return ctx.reply("Usage: /meme <prompt>");
  await ctx.reply(`Meme: ${p} (stub)`);
});

// 💳 Payments
bot.command("buy", upgradeCmd);

bot.command("tip", (ctx) => ctx.reply("Tip (stub)"));
bot.command("rain", (ctx) => ctx.reply("Rain (stub)"));
bot.command("raid", raidOpen);

// === CALLBACKS ===
// All inline-button clicks are handled centrally in ui.ts
bot.on("callback_query:data", onCallback);

export const webhook = webhookCallback(bot, "express", { secretToken: CFG.BOT_SECRET });
