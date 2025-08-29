
import type { Context } from 'grammy';
export async function prompt_pair(ctx: Context){ await ctx.reply('Send symbol or contract for price/chart.'); }
export async function prompt_alert(ctx: Context){ await ctx.reply('Format: /alert TOKEN/USDT pct_24h>=10'); }
export async function create_alert(ctx: Context){ await ctx.reply('Alert saved (stub).'); }
export async function prompt_whales(ctx: Context){ await ctx.reply('Whales: /whales on|off'); }
export async function toggle_whales(ctx: Context){ await ctx.reply('Whale alerts toggled (stub).'); }
export async function get_gas(ctx: Context){ await ctx.reply('Gas: 12 gwei (stub).'); }
