import express from "express";
import dotenv from "dotenv";
import { webhookCallback } from "grammy";
import { bot } from "./bot.js";

dotenv.config();

const app = express();
app.use(express.json());

// Health for Railway
app.get("/health", (_req, res) => res.status(200).send("OK"));

// Root
app.get("/", (_req, res) => res.send("FOMO Superbot API"));

// Telegram webhook
app.use("/tg/webhook", webhookCallback(bot, "express"));

// Start server
const PORT = Number(process.env.PORT || 8080);
app.listen(PORT, () => {
  console.log(`FOMO Superbot listening on ${PORT}`);
});
