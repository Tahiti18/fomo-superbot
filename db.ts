import { Client } from "pg";

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

client.connect().catch((err) => {
  console.error("Failed to connect to Postgres:", err);
});

export default client;
