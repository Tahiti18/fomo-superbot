import express from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());

// Healthcheck for Railway (it pings this path)
app.get("/health", (_req, res) => res.status(200).send("OK"));

// Simple root to avoid 404 on '/'
app.get("/", (_req, res) => res.status(200).send("FOMO Superbot API"));

// Telegram webhook endpoint
app.post("/tg/webhook", async (req, res, next) => {
  try {
    // Defer import so server can boot even if grammy or token are misconfigured
    const mod = await import("./bot.js");
    if (mod && mod.webhook) {
      return mod.webhook(req, res, next);
    } else {
      return res.status(500).send("Webhook not available");
    }
  } catch (err) {
    console.error("Webhook error:", err);
    return res.status(500).send("Webhook error");
  }
});

// IMPORTANT: bind to Railway-assigned PORT
const PORT = Number(process.env.PORT || 8080);
app.listen(PORT, "0.0.0.0", () => {
  console.log(`FOMO Superbot listening on ${PORT}`);
});
