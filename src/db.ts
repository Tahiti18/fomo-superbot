import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // In Railway, SSL often needs to be allowed but not verified
  ssl: process.env.NODE_ENV === "production" ? ({ rejectUnauthorized: false } as any) : false
});

export type SubRow = {
  id: number;
  tg_user_id: string;
  plan: string | null;
  expires_at: string | null;
  status: string | null;
  created_at: string | null;
};
