// src/config.ts
import dotenv from "dotenv";
dotenv.config();
export const CFG = {
  BOT_TOKEN: process.env.BOT_TOKEN || "",
  BOT_SECRET: process.env.BOT_SECRET || "fomo-secret-123",
  BOT_PUBLIC_URL: process.env.BOT_PUBLIC_URL || "",
  PORT: Number(process.env.PORT || 8080),
};
