// src/server.ts
import express from "express";
import { CFG } from "./config.js";

const app = express();
app.use(express.json());

// Health
app.get("/health", (_req, res) => res.status(200).send("OK"));

// Telegram webhook
app.post("/tg/webhook", async (req, res, next) => {
  try {
    const { webhook } = await import("./bot.js");
    // @ts-ignore
    return webhook(req, res, next);
  } catch (e) {
    console.error("Telegram webhook error:", e);
    return res.status(500).end();
  }
});

// Root
app.get("/", (_req, res) => res.send("FOMO Superbot API"));

// Start
app.listen(CFG.PORT, () => console.log(`FOMO Superbot listening on ${CFG.PORT}`));
