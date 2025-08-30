// src/bot.ts
import { Bot, webhookCallback, InlineKeyboard } from "grammy";
import { CFG } from "./config.js";
import * as H from "./handlers/index.js";
import { loadCallbackRouter, matchPattern } from "./router.js";

export const bot = new Bot(CFG.BOT_TOKEN);

// Show these in Telegram's "/" menu
void bot.api.setMyCommands([
  { command: "start",   description: "Open main menu" },
  { command: "status",  description: "Subscription status" },
  { command: "buy",     description: "Upgrade plans" },
  { command: "tools",   description: "Open feature hub" },
  { command: "stickers",description: "Create token stickers" },
  { command: "alerts",  description: "Price/whale alerts" },
  { command: "chart",   description: "Quick token chart" },
  { command: "holders", description: "Holder scan" },
  { command: "audit",   description: "Basic contract checks" },
  { command: "help",    description: "Usage help" },
]);

// ===== Emoji-standardized submenus =====
function kbSafety() {
  return new InlineKeyboard()
    .text("🔎 Scan Contract", "safety:scan").row()
    .text("🍯 Honeypot Check", "safety:honeypot").row()
    .text("🚨 Report Scam", "safety:report");
}
function kbAlpha() {
  return new InlineKeyboard()
    .text("📈 Price Check", "alpha:price").row()
    .text("🧠 Alpha Feed", "alpha:feed").row()
    .text("📉 Market Sentiment", "alpha:sentiment");
}
function kbMeme() {
  return new InlineKeyboard()
    .text("🎭 Meme Generator", "meme:make").row()
    .text("🖼 Sticker Packs", "meme:stickers");
}
function kbTips() {
  return new InlineKeyboard()
    .text("💸 Send a Tip", "tips:tip").row()
    .text("🎁 Join Airdrop", "tips:airdrop");
}
function kbMarketing() {
  return new InlineKeyboard()
    .text("⚡ Start Raid", "mktg:raid").row()
    .text("📢 Promote Project", "mktg:promote");
}
function kbAccount() {
  return new InlineKeyboard()
    .text("👤 My Profile", "acct:profile").row()
    .text("💳 Upgrade Plan", "acct:upgrade").row()
    .text("⏳ Subscription Status", "acct:status");
}

// ===== Commands =====
bot.command("start", async (ctx) => {
  await ctx.reply(
    "Welcome to FOMO Superbot.\n\nUse /menu to open the main menu.\nUse /buy starter USDT to upgrade."
  );
  return H.ui.open_member_menu(ctx);
});

bot.command("menu", H.ui.open_member_menu);
bot.command("admin", H.admin.open_section);
bot.command("help", async (ctx) =>
  ctx.reply("Use /menu to open the FOMO Superbot menu.")
);

// Safety / Market quick commands (kept as-is)
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
bot.command("buy", H.billing.upgrade); // e.g. /buy pro USDT
bot.command("tip", async (ctx) => ctx.reply("Tip (stub)"));
bot.command("rain", async (ctx) => ctx.reply("Rain (stub)"));
bot.command("raid", H.mktg.open_raid);

// ===== Section slash-commands (each opens its own submenu) =====
bot.command("safety", async (ctx) =>
  ctx.reply("🛡 Safety Tools", { reply_markup: kbSafety() })
);
bot.command("alpha", async (ctx) =>
  ctx.reply("📊 Price & Alpha", { reply_markup: kbAlpha() })
);
bot.command("stickers", async (ctx) =>
  ctx.reply("🎟 Meme & Stickers", { reply_markup: kbMeme() })
);
bot.command("tips", async (ctx) =>
  ctx.reply("💰 Tips & Airdrops", { reply_markup: kbTips() })
);
bot.command("marketing", async (ctx) =>
  ctx.reply("📣 Marketing & Raids", { reply_markup: kbMarketing() })
);
bot.command("account", async (ctx) =>
  ctx.reply("👤 Account", { reply_markup: kbAccount() })
);

// ===== Text triggers (if your reply keyboard sends plain text) =====
bot.hears(/^\/?\s*safety\s*$/i, async (ctx) =>
  ctx.reply("🛡 Safety Tools", { reply_markup: kbSafety() })
);
bot.hears(/alpha/i, async (ctx) =>
  ctx.reply("📊 Price & Alpha", { reply_markup: kbAlpha() })
);
bot.hears(/meme|sticker/i, async (ctx) =>
  ctx.reply("🎟 Meme & Stickers", { reply_markup: kbMeme() })
);
bot.hears(/tip|airdrop|rain/i, async (ctx) =>
  ctx.reply("💰 Tips & Airdrops", { reply_markup: kbTips() })
);
bot.hears(/marketing|raid/i, async (ctx) =>
  ctx.reply("📣 Marketing & Raids", { reply_markup: kbMarketing() })
);
bot.hears(/account|status/i, async (ctx) =>
  ctx.reply("👤 Account", { reply_markup: kbAccount() })
);

// ===== Callback routing (kept) =====
const router = loadCallbackRouter();
bot.on("callback_query:data", async (ctx) => {
  const data = ctx.callbackQuery!.data!;
  for (const r of router.patterns) {
    if (matchPattern(r.pattern, data)) {
      const [ns, act] = (r.handler || "").split(".");
      // @ts-ignore
      const mod = H[ns];
      if (!mod || !mod[act]) {
        return ctx.answerCallbackQuery({
          text: "Handler not found",
          show_alert: true,
        });
      }
      await mod[act](ctx);
      return;
    }
  }
  await ctx.answerCallbackQuery({ text: "No route" });
});

export const webhook = webhookCallback(bot, "express", {
  secretToken: CFG.BOT_SECRET,
});
