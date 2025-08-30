import { Bot, webhookCallback, Keyboard } from "grammy";

const token = process.env.BOT_TOKEN;
if (!token) {
  throw new Error("BOT_TOKEN is missing. Add it to your environment (.env on Railway).");
}

// Create bot
const bot = new Bot(token);

// --- UI helpers ---
const mainKeyboard = new Keyboard()
  .text("🛡️ Safety").text("📈 Price & Alpha").row()
  .text("🎭 Meme & Stickers").text("🎁 Tips · Airdrops · Games").row()
  .text("📣 Marketing & Raids").row()
  .text("👤 Account")
  .resized();

async function sendWelcome(ctx) {
  await ctx.reply(
    "Welcome to FOMO Superbot.\n\nUse /menu to open the main menu.\nUse /buy starter USDT to upgrade.\n\nPick a section:",
    { reply_markup: mainKeyboard }
  );
}

// Commands
bot.command("start", sendWelcome);
bot.command("menu", async (ctx) => {
  await ctx.reply("Open menu with the buttons below.", { reply_markup: mainKeyboard });
});

// Button handlers (simple echoes for now)
bot.hears("🛡️ Safety", (ctx) => ctx.reply("Safety module coming right up."));
bot.hears("📈 Price & Alpha", (ctx) => ctx.reply("Price & Alpha in progress."));
bot.hears("🎭 Meme & Stickers", (ctx) => ctx.reply("Meme & Stickers area."));
bot.hears("🎁 Tips · Airdrops · Games", (ctx) => ctx.reply("Tips · Airdrops · Games hub."));
bot.hears("📣 Marketing & Raids", (ctx) => ctx.reply("Marketing & Raids tools."));
bot.hears("👤 Account", (ctx) => ctx.reply("Account settings."));

// Export webhook handler for Express
export const webhook = webhookCallback(bot, "express");
