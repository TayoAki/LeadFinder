---
name: fan-overlap
description: "For any brand with physical locations, answer: 'fans of brand A probably also love brand B — and are people leaving B or looking to switch?' Uses public Google reviews: A's reviewers across many locations, their public review histories, chains merged into brands, lift vs popularity, then each B's newest reviews (leaving language, rating trend) and search demand for alternatives. treg first (Maps search, place reviews, keyword volume), Apify where treg can't. Checks the data (sample size, split-half stability, confidence), writes the answer and builds an explorable graph. Totals only; no reviewer data stored. Triggers on: fans of X also like, who else do my customers love, shared fans, reviewer overlap, collab partners, Crumbl playbook, which brands are my fans leaving, where's the opportunity, fan map, brand overlap graph."
---

# Fan overlap

**The question:** if someone loves brand A, which brand B do they probably love too? And of those, which are people leaving or looking to switch from? That's where the opportunity is:
- **B is not a rival:** collab with B while its fans still love it, or offer what B's leavers say is missing.
- **B is a rival:** its unhappy customers already overlap with yours. Go after them directly.

## Run it (any brand)

```bash
# once: treg login (cheap Maps data); APIFY_TOKEN for reviewer histories
node .claude/skills/fan-overlap/scripts/fan_overlap.mjs --brand "Crumbl Cookies" --city "Chicago, IL" --dry-run
node .claude/skills/fan-overlap/scripts/fan_overlap.mjs --brand "Crumbl Cookies" --city "Chicago, IL" --locations 12 --cap-usd 5 --out fan-overlap/crumbl-chicago
node .claude/skills/fan-overlap/scripts/graph.mjs fan-overlap/crumbl-chicago/overlap.json --out fan-overlap/crumbl-chicago/fan-map.html
# several brands in one map (shows which B's their fans share):
node .claude/skills/fan-overlap/scripts/graph.mjs fan-overlap/*/overlap.json --out fan-overlap/fan-map.html
```

Then:
1. Read `overlap.md` and check the **Data checks** section before you trust anything.
2. Publish `fan-map.html` as an artifact.
3. Answer the user in three lines, in this order:
   - fans of A probably love…;
   - of those, people are leaving / looking to switch from…;
   - so the opportunity is….

   Give the confidence level, and quote leavers' words, not reviewer names.

**Choosing the brand and city:**
- Pick a city where A has at least 8 locations.
- Use a dense metro: Chicago, Dallas, Phoenix, Salt Lake City, Atlanta.
- For a single-location business, use `--locations 1` with a bigger `--per-reviewer`, and expect weaker results.

## How it works (`scripts/fan_overlap.mjs`)

| Step | What | Source (cheapest first) |
|---|---|---|
| 1 | A's locations in the city | treg `google.serp.maps` (~$0.0002) → Apify `compass/crawler-google-places` |
| 2 | Newest 100 reviews per location; reviewer IDs in memory only | treg `google.maps.reviews` (~$0.00015 per 100) → Apify `compass/google-maps-reviews-scraper` |
| 3 | Each reviewer's public history (newest `--per-reviewer`, default 60), for reviewers with `--min-history` (5)+ reviews. Spend-aware: it stops at the cap and samples reviewers fairly (hash order). | treg `litescrape.google.maps.contributor_reviews` ($0.00015/reviewer), probed first → Apify `lexis-solutions/google-maps-contributor-reviews-scraper` (~$0.0015 per review row) |
| 4 | Distinct A reviewers per brand. Every location of a chain is one brand. Non-businesses (parks, landmarks, airports, hotels, doctors, banks…) are dropped. Rivals (same category words as A) are listed separately. | |
| 5 | **Lift** = shared ÷ √(B's total reviews), relative to the median (1.0 = typical). **Affinity** = lift × log2(1 + shared). | |
| 6a | **Leaving?** Newest 100 reviews of B's location that A's fans visit most: low-star reviews with leaving language, and the rating in the last 90 days vs before. *People are leaving* = 4+ such reviews or a drop of 0.4★+; *some* = 2+ or 0.2★+. | treg `google.maps.reviews` |
| 6b | **Looking to switch?** Monthly US searches for "B alternative(s)", "places like B", "B vs", "better than B", "B closing", plus what Google autocompletes after "B vs". | treg `google.keywords.volume` (one call), Google autocomplete (free) |
| 7 | **Opportunity** = affinity × (1 + leaving 0–2 + 0.5 × search 0–2) × confidence weight. | |
| 8 | **Data checks:** sample sizes, a split-half stability test (do the top 10 show up in both random halves of the reviewers?), confidence per brand (high = 8+ shared fans and 3+ in each half), and warnings. | |

Outputs: `overlap.json`, `overlap.md` (the answer), and `fan-map.html` via `graph.mjs`. The map has:
- dark hubs = A;
- circle size = shared fans; distance = lift;
- colour = leaving verdict;
- dashed ring = rival;
- filters for "only where people are leaving" and confidence;
- click a brand for its numbers, leaver quotes and switch searches.

**Cost** (12 locations, about 1,200 reviews):
- treg: about $0.10, mostly the one keyword-volume call.
- Reviewer histories: about $1.50 per 1,000 history rows on Apify while treg's contributor provider is down. It would be about $0.05 in total once treg is up.
- `--cap-usd` covers both. Always dry-run first and tell the user the estimate.

## Reading the result honestly

- **Under 60 histories, or stability under 5 of 10:** say "directional". Suggest more locations, a bigger city or a higher cap.
- **Big national chains** (Starbucks, Target, Costco) show up for every brand. Lift corrects for that; lead with lift, not raw shared counts.
- **Leaving verdicts** come from one location's newest 100 reviews. Say so. Check a second location before a big bet.
- **Switch-search volume is national and brand-level.** Local businesses usually show "low" or "unknown". That is normal and not evidence of zero demand.
- **"Probably love"** is an association in public reviews, not proof of purchase. Report the numbers; never invent them.

## Rules

- **Privacy:**
  - Never write reviewer IDs, names, photos or profile links anywhere: not to files, Keepwatch, chat or artifacts.
  - Totals per business only, and a business needs `--min-shared` (3)+ shared reviewers to appear.
  - Apify datasets are deleted after reading.
  - Leaver quotes are review text plus a review link, never the author.
- **Join within one platform only.** Google contributor IDs are not matched to Yelp or Trustpilot accounts. Other platforms (treg has Yelp, Tripadvisor and Trustpilot reviews) can feed the 6a leaving check for B, but not the overlap.
- **Keepwatch handoff (optional):**
  - B overlap goes to `add_collab_overlap` (source `reviews`, counts only).
  - Leaver quotes go to `add_switch_signals`.
- **Fit:** this works for businesses reviewed on Google Maps (food, drink, fitness, beauty, retail). For product-only brands (e.g. Liquid Death) use the Cult Fan Map's brand-affinity research.
- **Terms:** scraping review sites can break their terms of service. The user runs this on their own treg and Apify accounts and decides.
- **Keys:** keep keys out of the repo. Use `treg login` and the `APIFY_TOKEN` env var only.
