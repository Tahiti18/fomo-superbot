import express from "express";
import { webhook } from "./bot.js";
import { CFG } from "./config.js";
import { initDB } from "./db.js";

const app = express();
app.use(express.json());

app.use(`/${CFG.BOT_SECRET}`, webhook);

app.get("/", (req, res) => res.send("FOMO Superbot running"));

initDB().then(() => {
  app.listen(CFG.PORT, () => console.log("Server started on", CFG.PORT));
});
