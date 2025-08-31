import type { Context } from 'grammy';

export async function exampleHandler(ctx: Context) {
  await ctx.reply('Example handler OK');
}
