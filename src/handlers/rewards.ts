
import type { Context } from 'grammy';
export async function prompt_tip(ctx: Context){ await ctx.reply('Format: /tip @user 1000'); }
export async function prompt_rain(ctx: Context){ await ctx.reply('Format: /rain 50000'); }
export async function airdrop(ctx: Context){ await ctx.reply('Airdrop (stub).'); }
export async function trivia(ctx: Context){ await ctx.reply('Trivia (stub).'); }
export async function games_menu(ctx: Context){ await ctx.reply('Games: dice|flip|wheel (stub).'); }
