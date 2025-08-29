
import { InlineKeyboard, Context } from 'grammy';
import { loadMenus } from '../menus.js';

export async function open_submenu(ctx: Context, submenu?: string) {
  const menus = loadMenus();
  // @ts-ignore
  const m = menus.submenus[submenu || 'safety'];
  const kb = new InlineKeyboard();
  for (const row of m.buttons) { for (const b of row) kb.text(b.text, b.cb); kb.row(); }
  await ctx.reply(`**${m.title}**`, { reply_markup: kb, parse_mode: 'Markdown' });
}

export async function open_member_menu(ctx: Context) {
  const menus = loadMenus(); const m = menus.member_menu;
  const kb = new InlineKeyboard();
  for (const row of m.buttons) { for (const b of row) kb.text(b.text, b.cb); kb.row(); }
  await ctx.reply(`**${m.title}**`, { reply_markup: kb, parse_mode: 'Markdown' });
}
