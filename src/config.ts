export const CFG = {
  BOT_TOKEN: process.env.BOT_TOKEN || "",
  BOT_SECRET: process.env.BOT_SECRET || "fomo-secret-123",
  BOT_PUBLIC_URL: process.env.BOT_PUBLIC_URL || "",
  API_BASE_URL: process.env.API_BASE_URL || "https://api.coingecko.com/api/v3",
  PORT: Number(process.env.PORT || 8080),
};
