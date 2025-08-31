import { Bot, Context } from 'grammy';

const token = process.env.BOT_TOKEN;
if (!token) throw new Error('BOT_TOKEN missing');

export const bot = new Bot<Context>(token);

// Simple commands
bot.command('start', async (ctx) => {
  await ctx.reply('FOMO Superbot is alive!');
});

bot.on('message:text', async (ctx) => {
  await ctx.reply(`You said: ${ctx.message.text}`);
});
