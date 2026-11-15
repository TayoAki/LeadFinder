---
name: fan-overlap
description: "Answer 'if someone loves brand A, they probably love brand B, and are people leaving B?' from public reviews. Pulls brand A's recent Google Maps reviews, each reviewer's public review history (Apify), counts which other businesses they also review (weighted for popularity, competitors removed), then checks each brand B's recent reviews for falling ratings and 'leaving' language. Totals per business only; no reviewer data is stored. Triggers on: who else do my customers love, shared reviewers, fans of X also like, collab partners from reviews, reviewer overlap, Crumbl playbook, find brands my fans love that people are leaving."
---

# Fan overlap

**The question:** if someone loves brand A, which brand B do they probably love too? And are people leaving B?

## How it works (`scripts/fan_overlap.mjs`)

1. **Find brand A on Google Maps.** Uses `compass/crawler-google-places` to get the place ID, category, total reviews and rating.
2. **Pull A's newest reviews (default 200)** with `compass/google-maps-reviews-scraper`. Reviewer IDs exist in memory only.
3. **Pull each reviewer's public review history.** Only reviewers with at least 3 reviews are checked, since one-review accounts can't show an overlap.
   - **Through treg:** `litescrape.google.maps.contributor_reviews`, about $0.00015 per reviewer for up to 200 reviews. Used when the `treg` CLI is signed in.
   - **Otherwise:** the Apify actor `johnvc/google-maps-contributor-reviews-api`. It is much pricier, and free Apify accounts get only $1 a month on it.
4. **Count, for every other business, how many different A reviewers reviewed it.**
   - A business needs at least 3 shared reviewers to appear (`--min-shared`).
   - Competitors (same category words as A) are removed.
   - **Lift** scores B's share of A's fans against how popular B is overall (its total review count), relative to the median candidate. A lift of 2.0 means A's fans review it twice as much as its popularity explains.
5. **Check whether people are leaving B.** Pull 60 of B's newest reviews (without personal data) and check:
   - average rating in the last 90 days vs before;
   - low-star reviews with leaving language ("used to love", "not the same", "went downhill", "switched to", "won't be back", "overpriced").

   Verdict: *people are leaving* (4+ such reviews or a rating drop of 0.4+), *some leaving*, or *steady*.

Outputs: `fan-overlap/<slug>/overlap.json` and `overlap.md`.

## Run

```bash
# keys: APIFY_TOKEN (or a network secret for api.apify.com), and `treg login` for the cheap reviewer histories
node .claude/skills/fan-overlap/scripts/fan_overlap.mjs --place "Crumbl Wicker Park Chicago" --dry-run   # shows each step + estimated cost
node .claude/skills/fan-overlap/scripts/fan_overlap.mjs --place "Crumbl Wicker Park Chicago" --cap-usd 5
```

Options:
- `--reviews 500`: how many of A's reviews to read.
- `--per-reviewer 200`: how much of each reviewer's history to read.
- `--min-history 3`: the fewest reviews a reviewer needs to be checked.
- `--top 15`: how many brand B results to check for leavers.
- `--cap-usd 30`: the run stops before any step that would pass the cap.
- `--min-shared 3`: the minimum shared reviewers for a business to appear.
- A Google Maps URL works in place of a name.

**Cost:**
- A's reviews: about $0.20 per 500 (Apify).
- Reviewer histories: about $0.05 for 300 reviewers (treg).
- Place details and B checks: about $0.70 (Apify).

That is roughly $1 per location with treg. Without treg it can be $15 or more.

Always dry-run first and tell the user the estimate.

## Rules

- **Privacy:**
  - Never write reviewer IDs, names, photos or profile links anywhere: not to files, Keepwatch, chat or artifacts.
  - Share totals only.
  - Apify datasets are deleted after reading.
  - Do not use the histories for anything except counting businesses.
- **Join within one platform only.** Google contributor IDs are not matched to Yelp, Amazon or Trustpilot accounts. Other platforms are separate runs with separate results.
- **Claims:** "probably love" is an association in public reviews, not proof of purchase. Report shared counts and lift; never invent numbers.
- **Keepwatch handoff (optional):**
  - B overlap counts go to `add_collab_overlap` (source `reviews`, counts only).
  - B's leaving quotes go to `add_switch_signals`: review text and review URL, never the author.
- **Fit:** this works for businesses reviewed on Google Maps (cafes, restaurants, gyms, shops). For product-only brands (e.g. Liquid Death) use the Cult Fan Map's brand-affinity research instead.
- **Terms:** scraping review sites can break their terms of service. The user runs it on their own Apify account and decides.
