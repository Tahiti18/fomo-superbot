# FOMO Superbot – Railway-ready minimal server

This fixes Railway health checks by:
- Binding the server to `process.env.PORT` (required by Railway)
- Exposing a `/health` endpoint that returns `200 OK`
- Providing a root `/` route that returns text
- Deferring the Telegram bot load so the server boots even if `BOT_TOKEN` is missing

## Run locally
```bash
npm install
BOT_TOKEN=YOUR_TELEGRAM_BOT_TOKEN node server.js
# open http://localhost:8080/health
```
## Deploy on Railway
Set an environment variable:
- `BOT_TOKEN`: your Telegram bot token

### Set Telegram webhook
Replace `<TOKEN>` with your token:
```
https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://<your-railway-domain>/tg/webhook
```
Check:
```
https://api.telegram.org/bot<TOKEN>/getWebhookInfo
```
