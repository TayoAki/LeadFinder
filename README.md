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

Create a service from this repo, add a volume mounted at `/data`, and set `DATABASE_PATH=/data/leadfinder.db`,
`TREG_TOKEN` and `OPENROUTER_API_KEY`. `railway.json` holds the build and start commands.

## Status

Done: phases 1–8 (Treg integration, foundation, Treg client with receipts, auth and credits, onboarding and site read, ICP with free counts, the waterfall engine, and the full leads table with filters, search, sort, bulk delete, CSV export and a lead side panel).
Next: a first live run with real keys, then phase 9 (clean an uploaded list).

AI: set `OPENROUTER_API_KEY` to use OpenRouter (default models `anthropic/claude-opus-5.5` for the ICP, `anthropic/claude-haiku-5.5` for opening lines), or `ANTHROPIC_API_KEY` to call Anthropic directly. Override with `LEADFINDER_ICP_MODEL` / `LEADFINDER_LINE_MODEL`.
