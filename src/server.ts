import express from "express";
import { webhook } from "./bot.js";
import { CFG } from "./config.js";

const app = express();

// Required by Railway healthcheck
app.get("/health", (_req, res) => {
  res.status(200).send("OK");
});

// Telegram webhook endpoint
app.use(express.json());
app.post("/tg/webhook", webhook);

// Optional: manual webhook setter (kept from earlier design)
app.post("/tg/setwebhook", async (_req, res) => {
  try {
    if (!CFG.BOT_PUBLIC_URL) return res.status(400).json({ error: "BOT_PUBLIC_URL not set" });
    const url = `${CFG.BOT_PUBLIC_URL}/tg/webhook`;
    const r = await fetch(`https://api.telegram.org/bot${CFG.BOT_TOKEN}/setWebhook`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Telegram-Bot-Api-Secret-Token": CFG.BOT_SECRET },
      body: JSON.stringify({ url })
    });
    const j = await r.json();
    return res.json({ ok: true, url, telegram: j });
  } catch (e:any) {
    return res.status(500).json({ error: e?.message || "failed" });
  }
});

const PORT = Number(process.env.PORT || CFG.PORT || 8080);
app.listen(PORT, () => {
  console.log(`FOMO Superbot listening on ${PORT}`);
});
