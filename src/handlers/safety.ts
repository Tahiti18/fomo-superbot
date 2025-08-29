
import type { Context } from 'grammy';
export async function prompt_scan(ctx: Context){ await ctx.reply('Paste contract (or /scan <ca>):'); }
export async function prompt_honeypot(ctx: Context){ await ctx.reply('Paste contract for honeypot check (or /honeypot <ca>):'); }
export async function scan_contract(ctx: Context){ const d=(ctx.callbackQuery?.data||'').split('ca=')[1]; await ctx.reply(`Scanning: \`${d}\``, { parse_mode:'Markdown' }); }
export async function honeypot(ctx: Context){ const d=(ctx.callbackQuery?.data||'').split('ca=')[1]; await ctx.reply(`Honeypot: \`${d}\``, { parse_mode:'Markdown' }); }
export async function report_item(ctx: Context){ await ctx.reply('Send URL/wallet/contract to report.'); }
