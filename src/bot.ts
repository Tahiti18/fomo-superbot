// src/bot.ts
import { Bot, webhookCallback } from 'grammy';
import { CFG } from './config.js';
import * as H from './handlers/index.js';
import { loadCallbackRouter, matchPattern } from './router.js';

export const bot = new Bot(CFG.BOT_TOKEN);

// === Commands ===
bot.command('start', async (ctx) => {
  await ctx.reply(
    'Welcome to FOMO Superbot.\n\nUse /menu to open the main menu.\nUse /buy starter USDT to upgrade.'
  );
  return H.ui.open_member_menu(ctx);
});

bot.command('menu', H.ui.open_member_menu);
bot.command('admin', H.admin.open_section);
bot.command('help', async (ctx) => ctx.reply('Use /menu to open the FOMO Superbot menu.'));

// Safety / Market quick commands
bot.command('scan', async (ctx) => {
  const ca = (ctx.match as string || '').trim();
  if (!ca) return ctx.reply('Usage: /scan <contract>');
  await ctx.reply(`Scanning: ${ca}`);
});
bot.command('honeypot', async (ctx) => {
  const ca = (ctx.match as string || '').trim();
  if (!ca) return ctx.reply('Usage: /honeypot <contract>');
  await ctx.reply(`Honeypot test: ${ca}`);
});
bot.command('meme', async (ctx) => {
  const p = (ctx.match as string || '').trim();
  if (!p) return ctx.reply('Usage: /meme <prompt>');
  await ctx.reply(`Meme: ${p} (stub)`);
});

// 💳 Payments
bot.command('buy', H.billing.upgrade); // e.g. /buy pro USDT

bot.command('tip', async (ctx) => ctx.reply('Tip (stub)'));
bot.command('rain', async (ctx) => ctx.reply('Rain (stub)'));
bot.command('raid', H.mktg.open_raid);

// === Callback routing ===
const router = loadCallbackRouter();
bot.on('callback_query:data', async (ctx) => {
  const data = ctx.callbackQuery!.data!;
  for (const r of router.patterns) {
    if (matchPattern(r.pattern, data)) {
      const [ns, act] = (r.handler || '').split('.');
      // @ts-ignore
      const mod = H[ns];
      if (!mod || !mod[act]) {
        return ctx.answerCallbackQuery({ text: 'Handler not found', show_alert: true });
      }
      await mod[act](ctx);
      return;
    }
  }
  await ctx.answerCallbackQuery({ text: 'No route' });
});

export const webhook = webhookCallback(bot, 'express', { secretToken: CFG.BOT_SECRET });
