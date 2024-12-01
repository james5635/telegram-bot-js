# Run
npx vercel dev \
npx ngrok http 3000 \
curl -X POST https://api.telegram.org/bot\<TOKEN\>/setWebhook -H "Content-type: application/json" -d '{"url": "\<WEBHOOK-DOMAIN\>/api/webhook"}' 