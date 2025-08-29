
import 'dotenv/config';

function must(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

export const CFG = {
  BOT_TOKEN: must('BOT_TOKEN'),
  BOT_SECRET: must('BOT_SECRET'),
  // Make public URL optional; required only for auto-webhook
  BOT_PUBLIC_URL: process.env.BOT_PUBLIC_URL || '',
  API_BASE_URL: process.env.API_BASE_URL || '',
  PORT: parseInt(process.env.PORT || '8080', 10),
};
