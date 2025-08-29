
# FOMO Superbot — Railway Starter

## Deploy
1) Push to GitHub.
2) Create Railway service from the repo.
3) Add variables:
   - BOT_TOKEN
   - BOT_SECRET
   - (optional) BOT_PUBLIC_URL — add after Railway shows your public URL.
4) First deploy will pass healthcheck because server starts even without BOT_PUBLIC_URL.
5) When you have BOT_PUBLIC_URL, hit:
   POST https://<your-app>.up.railway.app/tg/setwebhook
   (or redeploy; server will auto-set the webhook on boot).

## Health
GET /health → 200 OK

## Telegram
- Add bot to your group, promote to admin.
- Run /menu.
