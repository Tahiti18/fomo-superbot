import express from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());

// Healthcheck for Railway
app.get("/health", (_req, res) => res.status(200).send("OK"));

// Root - sanity
app.get("/", (_req, res) => res.type("text/plain").send("FOMO Superbot API"));

// Lazy-import bot to avoid startup crashes when token missing
app.post("/tg/webhook", async (req, res, next) => {
  try {
    const { webhook } = await import("./src/bot.js");
    return webhook(req, res, next);
  } catch (err) {
    console.error("Webhook error:", err);
    return res.status(500).end();
  }
});

const PORT = Number(process.env.PORT || 8080);
app.listen(PORT, () => console.log(`FOMO Superbot listening on ${PORT}`));
