// src/server.ts
import express from "express";
import { CFG } from "./config.js";

const app = express();

// Healthcheck for Railway
app.get("/health", (_req, res) => res.status(200).send("OK"));

// Defer-import the bot so startup never crashes
app.use(express.json());
app.post("/tg/webhook", async (req, res, next) => {
  try {
    const { webhook } = await import("./bot.js");
    // grammy's express middleware signature
    // @ts-ignore
    return webhook(req, res, next);
  } catch (e) {
    console.error("Webhook handler load error:", e);
    return res.status(500).send("Webhook handler error");
  }
});

// optional: sanity route
app.get("/", (_req, res) => res.send("FOMO Superbot API"));

const PORT = Number(process.env.PORT || CFG.PORT || 8080);
app.listen(PORT, () => {
  console.log(`FOMO Superbot listening on ${PORT}`);
});
