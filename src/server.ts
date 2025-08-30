// src/server.ts
import express, { Request, Response, NextFunction } from "express";
import { CFG } from "./config.js";

const app = express();
app.use(express.json());

app.get("/health", (_req: Request, res: Response) => res.status(200).send("OK"));

app.post("/tg/webhook", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { webhook } = await import("./bot.js");
    // @ts-ignore grammy express handler
    return webhook(req, res, next);
  } catch (e) {
    console.error("Telegram webhook error:", e);
    return res.status(500).end();
  }
});

app.post("/payments/cryptopay", async (req: Request, res: Response) => {
  try {
    const { cryptoPayWebhook } = await import("./handlers/webhook.js");
    return cryptoPayWebhook(req, res);
  } catch (e) {
    console.error("CryptoPay webhook error:", e);
    return res.status(500).end();
  }
});

app.get("/", (_req: Request, res: Response) => res.send("FOMO Superbot API"));

const PORT = Number(process.env.PORT || CFG.PORT || 8080);
app.listen(PORT, () => console.log(`FOMO Superbot listening on ${PORT}`));
