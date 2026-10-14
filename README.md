# LeadFinder

From your website and one sentence to verified decision makers, for about a cent of data per lead.
Every outside data call goes through [Treg](https://treg.to). The full spec is in [PRODUCT.md](PRODUCT.md).

## Run locally

```bash
cp .env.example .env.local   # add TREG_TOKEN and OPENROUTER_API_KEY (or ANTHROPIC_API_KEY)
npm install
npm run dev                  # http://localhost:3000
npm test                     # ledger, holds, auth and Treg client tests
```

The first account you create is the admin. Every account gets 50 welcome credits.

## Deploy (Railway)

1. Create a service from this repo (branch `claude/awesome-curie-zb2v1p` or `main` once merged).
2. Add a volume mounted at `/data`. Keep one replica: the database is a SQLite file on that volume.
3. Set variables: `DATABASE_PATH=/data/leadfinder.db`, `TREG_TOKEN`, `OPENROUTER_API_KEY`, `APP_URL` (the public URL),
   `LEADFINDER_CREDIT_USD`, and for card payments `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET`.
4. Generate a domain. `railway.json` sets the build, start command and the `/api/health` check.
5. In Stripe, add a webhook to `https://<your domain>/api/stripe/webhook` for `checkout.session.completed` and
   `checkout.session.async_payment_succeeded`, and copy its signing secret into `STRIPE_WEBHOOK_SECRET`.
6. Sign up first: the first account becomes the admin.

## Status

Done: all 12 phases (Treg integration, foundation, Treg client with receipts, auth and credits, onboarding and site read, ICP with free counts, the waterfall engine, and the full leads table with filters, search, sort, bulk delete, CSV export and a lead side panel, cleaning an uploaded list, billing receipts plus the admin margin page, the provider lab, and Stripe credit packs, security headers, health check and Railway config). Verified live against Treg and OpenRouter on 14 Oct 2026: onboarding, a 5-lead run (5/5 emails, 4 verified, about $0.0066 of Treg cost per lead) and a provider lab test.
Next: deploy to Railway and switch on Stripe.

AI: set `OPENROUTER_API_KEY` to use OpenRouter (default models `anthropic/claude-opus-5.5` for the ICP, `anthropic/claude-haiku-5.5` for opening lines), or `ANTHROPIC_API_KEY` to call Anthropic directly. Override with `LEADFINDER_ICP_MODEL` / `LEADFINDER_LINE_MODEL`.
