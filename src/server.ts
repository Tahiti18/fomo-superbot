import express from "express";

const app = express();
const PORT = process.env.PORT || 8080;

app.get("/", (_req, res) => {
  res.send("✅ Railway + TypeScript + Express is running!");
});

app.get("/health", (_req, res) => {
  res.status(200).send("OK");
});

app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
