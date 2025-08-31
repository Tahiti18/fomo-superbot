// server.ts

import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Health check
app.get("/", (req: Request, res: Response) => {
  res.json({ status: "ok", message: "Server is running ✅" });
});

// Example Telegram webhook endpoint
app.post("/tg/webhook", (req: Request, res: Response) => {
  console.log("Incoming Telegram update:", req.body);
  res.sendStatus(200);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
