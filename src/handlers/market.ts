// src/handlers/market.ts
import type { Context } from "grammy";
import { InlineKeyboard } from "grammy";

type DexPair = {
  chainId: string;
  url: string;
  baseToken: { address: string; symbol: string; name: string };
  priceUsd?: string;
  priceChange?: { h24?: number; h1?: number; h6?: number };
  liquidity?: { usd?: number };
  volume?: { h24?: number };
  fdv?: number;
};

async function dsSearch(q: string): Promise<DexPair[]> {
  const url = `https://api.dexscreener.com/latest/dex/search?q=${encodeURIComponent(q)}`;
  const r = await fetch(url);
  if (!r.ok) return [];
  const j = await r.json().catch(() => ({}));
  return (j?.pairs || []) as DexPair[];
}

function fmtUsd(n?: number | string) {
  if (n === undefined || n === null) return "—";
  const x = typeof n === "string" ? Number(n) : n;
  if (!isFinite(x)) return "—";
  if (x >= 1_000_000_000) return `$${(x / 1_000_000_000).toFixed(2)}B`;
  if (x >= 1_000_000) return `$${(x / 1_000_000).toFixed(2)}M`;
  if (x >= 1_000) return `$${(x / 1_000).toFixed(2)}K`;
  return `$${x.toFixed(6)}`;
}

function summarize(p: DexPair) {
  const price = p.priceUsd ? Number(p.priceUsd) : NaN;
  const ch24 = p.priceChange?.h24;
  const liq = p.liquidity?.usd;
  const vol = p.volume?.h24;
  const fdv = p.fdv;

  return (
    `📈 *${p.baseToken.symbol}* on *${p.chainId}*\n` +
    `Price: ${isFinite(price) ? `$${price.toFixed(price < 1 ? 6 : 4)}` : "—"}  ` +
    `(24h: ${ch24 !== undefined ? `${ch24.toFixed(2)}%` : "—"})\n` +
    `Liquidity: ${fmtUsd(liq)}  •  Vol 24h: ${fmtUsd(vol)}\n` +
    `FDV: ${fmtUsd(fdv)}`
  );
}

export async function chart(ctx: Context) {
  const q = (ctx.match as string || "").trim();
  if (!q) return ctx.reply("Usage: `/chart <token symbol | contract address>`", { parse_mode: "Markdown" });
  try {
    const pairs = await dsSearch(q);
    if (!pairs.length) return ctx.reply("No pairs found for that query.");
    const p = pairs[0];
    const txt = summarize(p);
    const kb = new InlineKeyboard().url("📊 Open chart", p.url);
    await ctx.reply(txt, { parse_mode: "Markdown", reply_markup: kb });
  } catch (e: any) {
    await ctx.reply(`Chart error: ${e?.message || e}`);
  }
}

export async function holders(ctx: Context) {
  const q = (ctx.match as string || "").trim();
  if (!q) return ctx.reply("Usage: `/holders <contract address | token symbol>`", { parse_mode: "Markdown" });
  try {
    const pairs = await dsSearch(q);
    if (!pairs.length) return ctx.reply("No token found.");
    const p = pairs[0];
    const addr = p.baseToken.address;
    const chain = p.chainId;
    let link = p.url;
    if (chain === "ethereum") link = `https://etherscan.io/token/${addr}#balances`;
    else if (chain === "bsc") link = `https://bscscan.com/token/${addr}#balances`;
    else if (chain === "base") link = `https://basescan.org/token/${addr}#balances`;
    else if (chain === "arbitrum") link = `https://arbiscan.io/token/${addr}#balances`;
    else if (chain === "polygon") link = `https://polygonscan.com/token/${addr}#balances`;
    const kb = new InlineKeyboard().url("👥 Open holders", link).url("📊 Chart", p.url);
    await ctx.reply(`🔍 Holders page for *${p.baseToken.symbol}* on *${p.chainId}*`, {
      parse_mode: "Markdown", reply_markup: kb
    });
  } catch (e: any) {
    await ctx.reply(`Holders error: ${e?.message || e}`);
  }
}

export async function alerts(ctx: Context) {
  const q = (ctx.match as string || "").trim();
  if (!q) return ctx.reply("Usage: `/alerts <token symbol | contract address>`", { parse_mode: "Markdown" });
  try {
    const pairs = await dsSearch(q);
    if (!pairs.length) return ctx.reply("No token found.");
    const p = pairs[0];
    const txt = summarize(p) + `\n\n🔔 Price alerts scheduling will be added next.`;
    const kb = new InlineKeyboard().url("📊 Open chart", p.url);
    await ctx.reply(txt, { parse_mode: "Markdown", reply_markup: kb });
  } catch (e: any) {
    await ctx.reply(`Alerts error: ${e?.message || e}`);
  }
}
