
import 'dotenv/config';
function required(n:string){ const v=process.env[n]; if(!v) throw new Error(`Missing env: ${n}`); return v; }
export const CFG={ BOT_TOKEN: required('BOT_TOKEN'), BOT_SECRET: required('BOT_SECRET'), BOT_PUBLIC_URL: required('BOT_PUBLIC_URL'), API_BASE_URL: process.env.API_BASE_URL||'', PORT: parseInt(process.env.PORT||'8080',10) };
