import express, { type Request, type Response, type NextFunction } from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());

// Healthcheck (for Railway)
app.get("/health", (_req: Request, res: Response) => res.status(200).send("OK"));

// Telegram webhook (defer-load bot to avoid startup crashes)
app.post("/tg/webhook", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { webhook } = await import("./bot.js");
    // @ts-ignore grammy express handler signature
    return webhook(req, res, next);
  } catch (e) {
    console.error("Telegram webhook error:", e);
    return res.status(500).end();
  }
});

// Root
app.get("/", (_req: Request, res: Response) => res.send("FOMO Superbot API"));

const PORT = Number(process.env.PORT || 8080);
app.listen(PORT, () => console.log(`FOMO Superbot listening on ${PORT}`));
