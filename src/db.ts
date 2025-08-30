import pkg from "pg";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const { Pool } = pkg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

// Auto-create tables on startup
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schemaPath = path.join(__dirname, "../schema.sql");
const schema = fs.readFileSync(schemaPath, "utf-8");

(async () => {
  const client = await pool.connect();
  try {
    await client.query(schema);
    console.log("✅ Database schema ensured");
  } finally {
    client.release();
  }
})();