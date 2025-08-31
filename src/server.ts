import "dotenv/config";
import express from "express";
import { Bot, webhookCallback } from "grammy";
import { pingDb } from "./db.js";

const TOKEN = process.env.BOT_TOKEN;
if (!TOKEN) {
  console.error("BOT_TOKEN is missing");
  process.exit(1);
}
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || "";

const bot = new Bot(TOKEN);
bot.command("start", (ctx) => ctx.reply("FOMO Superbot is alive ✅"));
bot.on("message:text", (ctx) => ctx.reply(`You said: ${ctx.message.text}`));

const app = express();
app.use(express.json());

app.get("/", (_req, res) => res.send("FOMO Superbot API"));
app.get("/health", async (_req, res) => {
  await pingDb().catch(() => {});
  res.type("text/plain").send("OK");
});

app.post("/tg/webhook", (req, res, next) => {
  if (WEBHOOK_SECRET && req.query.secret !== WEBHOOK_SECRET) {
    return res.status(401).send("Unauthorized");
  }
  next();
}, webhookCallback(bot, "express"));

const PORT = Number(process.env.PORT) || 8080;
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
