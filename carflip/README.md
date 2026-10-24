# CarFlip

Find underpriced private-seller cars, check them, negotiate and plan the resale. It runs as a web app or headless over MCP.

| Step | What it does | Tool |
|---|---|---|
| 1. Find | Scrapes private-seller Facebook Marketplace car listings within N miles of a city (Apify) and filters out dealers, bikes, ATVs and new-car listings | `find_cars` |
| 2. Value | Looks up KBB fair purchase prices (Apify), picks the closest trim, adjusts for mileage and ranks by discount | `value_cars`, `ranked_cars` |
| 3. Inspect | Reviews the top 10's photos and descriptions with AI vision if `OPENROUTER_API_KEY` is set, otherwise with rules (English and Spanish). Shortlists 4 | `inspect_top`, `get_car`, `record_inspection` |
| 4. Buy | Drafts low opening offers with a walk-away price, then drafts each counter as sellers reply. **Drafts only: nothing is sent automatically** | `draft_offers`, `log_seller_reply`, `offer_thread` |
| 5. Sell | Enhances listing photos (exposure, colour and crop only), lists repairs to do first, writes ad copy and calculates hypothetical profit after Georgia tax and fees | `enhance_photos`, `plan_resale` |

## Run

```bash
cp .env.example .env      # set APIFY_TOKEN (and optionally OPENROUTER_API_KEY)
npm install
npm run dev               # http://localhost:3100
npm test
```

CLI, with the same tools as MCP:

```bash
npm run cli -- find_cars '{"city":"atlanta","radiusMiles":60,"target":40}'
npm run cli -- value_cars
npm run cli -- inspect_top '{"top":10,"keep":4}'
npm run cli -- draft_offers
npm run cli -- plan_resale '{"id":"fb:123"}'
```

## Use headless over MCP

```json
{
  "mcpServers": {
    "carflip": {
      "command": "node",
      "args": ["--experimental-strip-types", "/path/to/carflip/bin/mcp.ts"],
      "env": { "APIFY_TOKEN": "...", "CARFLIP_DB": "/path/to/carflip.db" }
    }
  }
}
```

An agent can call `get_car` to see every photo URL, review them itself and save its verdict with `record_inspection`.

## Limits worth knowing

- **Private sellers** are detected by rules (financing language, "$X down", stock numbers, new-car listings). Facebook doesn't label dealers, so some may slip through.
- **KBB values** are base fair purchase prices for year, make, model and trim, not a full condition-based appraisal. The mileage adjustment ($0.05/mile against 12k miles/year, capped at ±25%) is CarFlip's own estimate. KBB doesn't cover pre-1990 cars, so classics are reported separately.
- **Auction sites** aren't wired in yet. Apify has scrapers for Bring a Trailer, Collecting Cars and Copart UK, but none covers US local auctions, so add one as another source in `find.ts` once its output is checked.
- **Resale profit** is hypothetical: list at value, sell about 5% below, minus Georgia 7% TAVT, title and tag, reconditioning and detailing.
- **Costs** run about $0.03 per Marketplace listing with details, and about $0.20 per KBB run.
