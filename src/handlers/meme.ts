
import type { Context } from 'grammy';
export async function prompt_generate(ctx: Context){ await ctx.reply('Use /meme <prompt>'); }
export async function generate(ctx: Context){ await ctx.reply('Generated meme (stub).'); }
export async function start_stickerpack(ctx: Context){ await ctx.reply('Sticker pack (stub).'); }
export async function prompt_voice(ctx: Context){ await ctx.reply('Use /voice <text>'); }
export async function voice(ctx: Context){ await ctx.reply('Voice meme (stub).'); }
export async function daily_hype(ctx: Context){ await ctx.reply('Hype poster (stub).'); }
