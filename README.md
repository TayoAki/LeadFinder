# LeadFinder

From your website and one sentence to verified decision makers, for about a cent of data per lead.
Every outside data call goes through [Treg](https://treg.to). The full spec is in [PRODUCT.md](PRODUCT.md).

## Run locally

```bash
cp .env.example .env.local   # add TREG_TOKEN and ANTHROPIC_API_KEY
npm install
npm run dev                  # http://localhost:3000
npm test                     # ledger, holds, auth and Treg client tests
```

The first account you create is the admin. Every account gets 50 welcome credits.

## Deploy (Railway)

Create a service from this repo, add a volume mounted at `/data`, and set `DATABASE_PATH=/data/leadfinder.db`,
`TREG_TOKEN` and `ANTHROPIC_API_KEY`. `railway.json` holds the build and start commands.

## Status

Done: phases 1–4 (Treg integration, foundation, Treg client with per-call receipts, auth, credits ledger and holds).
Next: onboarding and site read, ICP generation with free counts, then the waterfall engine.
