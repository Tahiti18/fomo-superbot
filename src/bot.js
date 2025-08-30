import { Bot, webhookCallback, InlineKeyboard } from "grammy";
import pg from "pg";

const bot = new Bot(process.env.BOT_TOKEN);

// Postgres client
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

// Menu
function mainMenu() {
  return new InlineKeyboard()
    .text("🛡 Safety", "safety").row()
    .text("📈 Price & Alpha", "alpha").row()
    .text("🎁 Rewards", "rewards").row()
    .text("👤 Account", "account");
}

// Start
bot.command("start", (ctx) =>
  ctx.reply("Welcome to FOMO Superbot. [MENU-V3]\nUse /menu anytime.", {
    reply_markup: mainMenu(),
  })
);

bot.command("menu", (ctx) =>
  ctx.reply("Open menu with the buttons below:", {
    reply_markup: mainMenu(),
  })
);

// Callbacks
bot.callbackQuery("safety", (ctx) =>
  ctx.answerCallbackQuery({ text: "Safety Center coming soon" })
);
bot.callbackQuery("alpha", (ctx) =>
  ctx.answerCallbackQuery({ text: "Alpha insights loading..." })
);
bot.callbackQuery("rewards", (ctx) =>
  ctx.answerCallbackQuery({ text: "Rewards center coming soon" })
);

bot.callbackQuery("account", async (ctx) => {
  const uid = String(ctx.from.id);
  try {
    const { rows } = await pool.query(
      "SELECT plan, expires_at, status FROM subscriptions WHERE tg_user_id=$1 LIMIT 1",
      [uid]
    );
    if (rows.length === 0) {
      await ctx.reply("No subscription found. Use /buy to get started.");
    } else {
      const sub = rows[0];
      await ctx.reply(
        `Subscription: ${sub.plan}\nStatus: ${sub.status}\nExpires: ${sub.expires_at}`
      );
    }
  } catch (err) {
    console.error(err);
    await ctx.reply("Error fetching account info.");
  }
});

export const webhook = webhookCallback(bot, "express");
