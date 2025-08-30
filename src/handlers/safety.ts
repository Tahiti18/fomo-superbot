// src/handlers/safety.ts
import type { Context } from "grammy";
import { InlineKeyboard } from "grammy";

export async function audit(ctx: Context) {
  const q = (ctx.match as string || "").trim();
  if (!q) {
    return ctx.reply(
      "Usage: `/audit <contract address>`\n\nTip: paste an EVM CA (0x...).",
      { parse_mode: "Markdown" }
    );
  }

  let verdict = "unknown";
  let buyTax: number | undefined;
  let sellTax: number | undefined;

  try {
    const url = `https://api.honeypot.is/v2/IsHoneypot?address=${encodeURIComponent(q)}`;
    const r = await fetch(url);
    if (r.ok) {
      const j = await r.json();
      // @ts-ignore
      verdict = j?.isHoneypot ?? j?.honeypotResult?.isHoneypot ?? j?.IsHoneypot ?? "unknown";
      // @ts-ignore
      buyTax  = j?.simulationResult?.buyTax  ?? j?.buyTax;
      // @ts-ignore
      sellTax = j?.simulationResult?.sellTax ?? j?.sellTax;
    }
  } catch {}

  const kb = new InlineKeyboard()
    .url("🔎 Honeypot viewer", `https://honeypot.is/?address=${encodeURIComponent(q)}`)
    .url("📊 DexScreener search", `https://dexscreener.com/search?q=${encodeURIComponent(q)}`);

  const txt =
    "🛡️ *Basic contract checks*\n\n" +
    `Honeypot: *${String(verdict)}*\n` +
    `Buy tax: ${buyTax === undefined ? "—" : `${buyTax}%`}  •  Sell tax: ${sellTax === undefined ? "—" : `${sellTax}%`}\n\n` +
    "Always verify contract and ownership before buying.";

  await ctx.reply(txt, { parse_mode: "Markdown", reply_markup: kb });
}
