"use strict";
const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
app.use(express.json());
app.get("/health", (_req, res) => res.status(200).send("OK"));
app.post("/tg/webhook", async (req, res, next) => {
  try {
    const mod = await import("../dist/bot.js");
    return mod.webhook(req, res, next);
  } catch (e) {
    console.error("Telegram webhook error:", e);
    return res.status(500).end();
  }
});
app.get("/", (_req, res) => res.send("FOMO Superbot API"));
const PORT = Number(process.env.PORT || 8080);
app.listen(PORT, () => console.log(`FOMO Superbot listening on ${PORT}`));
