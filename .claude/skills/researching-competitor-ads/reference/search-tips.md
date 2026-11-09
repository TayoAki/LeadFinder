# Search tips

## Contents
- Phrasing the query
- Filters
- Paging
- When a search is empty

## Phrasing the query
- Brand questions: use the brand or domain with `search_advertisers` first. Plain keywords in `search_ads` match ad text and can return other brands that mention the name.
- Offer or hook questions: put the offer words in `query` ("shipping included", "30 day trial") and keep the product category in `industry_slug` when you know it.
- Audience questions: use `buyer` (`business_owners`, `consumers`, `professionals`) and `audience` (a short label such as "restaurant owners").

## Filters
- `format`: `static` or `video`.
- `has_spoken_hook`: `true` for video ads that open with speech.
- `min_run_days`: 30 for "lately proven", 60-90 for "durable", 180+ for "evergreen".
- `brand_id`: the user's own brand. It labels their tracked rivals and does not narrow the library.
- `tracked_rivals_only` with `brand_id`: only the user's tracked competitors.
- Use filter values exactly as the tool returned them (for example hook and angle values from earlier results). Do not invent values.

## Paging
- Reuse `next_cursor` with the same query and filters. A page can be empty while more pages exist; try the next one once.
- Two pages per question is enough. Do not page until the end.

## When a search is empty
Widen once (drop `format` or lower `min_run_days`), then say plainly that nothing matched. Do not fill the gap with ads from memory.
