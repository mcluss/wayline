# Wayline + Privy wallets

1. `cp .env.example .env.local` and paste your Privy App ID.
2. `npm install` then `npm run dev`, and open http://localhost:3000/wallet
3. In the Privy dashboard, enable Email login and add http://localhost:3000 (and your Vercel domain) to Allowed origins.
4. Deploy: push to GitHub, import the repo in Vercel, add NEXT_PUBLIC_PRIVY_APP_ID under Environment Variables.

"/" serves public/landing.html (the marketing page). "/wallet" is the Privy sign-in and wallet page.
