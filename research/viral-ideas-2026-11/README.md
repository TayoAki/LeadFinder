# Viral business ideas: switchers × cult-brand fans (November 2026)

**What this is:** 1,000 business ideas built from real public evidence and scored by rules. The top 3 were run through Keepwatch and simulated buyer panels.

- **Evidence:** real public posts, with links.
- **Scores:** rules applied to that evidence. They are not sales forecasts.
- **Buyer panels:** SIMULATED. They rank ideas and find objections; they do not prove demand.

## The process

1. **Switching demand.** Four research agents found companies people are angry at for a decision **and** are asking "what do I buy instead?", across food/CPG, tech, lifestyle and services.
   - Result: 35 company entries (34 after merging Garmin, which two agents both found) and 216 quotes, each with its URL.
   - Reddit, Trustpilot and Sam's Club blocked automated access, so the evidence is thinner than a scraper would give.
2. **Cult-brand overlap.** One agent mapped what fans of 23 cult brands (Labubu, Stanley, Crumbl, Liquid Death, Owala and others) also love. The source was 108 documented collabs, which gave 12 business types.
   - The most common: apparel/sneaker capsules (11 brands), flavoured drinks (10), limited-drop collectibles (10) and beauty crossovers (8).
3. **Keyword validation.** Free Google, YouTube and Amazon autocomplete (`scripts/kwcheck.mjs`). Autocomplete shows a search exists, not how often it is searched.
   - Scores are relative across companies: 2 to 39 distinct "switching" searches each.
   - Paid volumes (DataForSEO via `treg`) were not available in this environment.
4. **1,000 ideas** (`scripts/ideas.mjs`). Each one combines:
   - a switching hotspot;
   - what people say they want instead;
   - a business model;
   - a launch move (Keepwatch Borrow / Switchers mechanisms);
   - the best-matching cult collab lane.

   Each idea is scored out of 120:

   | Part | Points |
   |---|---|
   | Switching demand | 35 |
   | Search demand | 20 |
   | Cult overlap | 25 |
   | Virality of the launch move | 20 |
   | Ease of launch | 10 |
   | Specificity | 10 |

   Licence-gated ideas such as music streaming, banking and airlines are marked very hard to launch.
5. **The shortlist rule.** An idea must pass **both** signals: switching demand ≥ 12/35 **and** cult overlap ≥ 10/25.
   - 827 of the 1,000 pass.
   - `top-30.md` lists the best 30, at most 3 per company.
6. **Top 3.** I checked the quotes against their pages. All 11 I could re-open matched word for word. The other 8 are on sites that block re-checks and are marked as such in `data/verified.json`.
7. **Keepwatch run.** I saved the evidence into the Switchers module.
   - Keepwatch rates all three **"thin"**: only 6–8 posts each, below its bar for switching demand.
   - I ran the stance swap test (all three pass) and the Borrow moves.
8. **Simulated panels.** 100 personas per idea, built from the real quotes, split into five segments:
   - already switched;
   - angry and looking;
   - annoyed but staying;
   - general buyers;
   - cult-collab fans.

   Each persona saw one of two landing pages and decided: buy now, waitlist, or no.

## Results (SIMULATED)

| Idea | Buy | Waitlist | No | Winning page | Best segment |
|---|---|---|---|---|---|
| **Made By Hand**: verified human-made marketplace (Etsy switchers) | **9** | 35 | 56 | B, plain terms (6 buys vs 3) | Angry Etsy sellers looking: 5 buy / 16 waitlist of 30 |
| **Hold Fast**: full-coverage foundation that doesn't oxidise (Double Wear switchers) | 7 | 19 | 74 | A, 8-hour photo (4 vs 3, noise) | Unhappy and searching: 5 / 8 of 30 |
| **Same Again**: meal shake with a no-surprise-recipe promise (Huel switchers) | 5 | 23 | 72 | A and B tied | Angry current Huel users: 3 / 11 of 30 |

### What the panels agree on

- **Only the "angry and still looking" segment buys.** People who already switched are nearly unwinnable (0–1 buys each). Aim at people mid-search, right now.
- **Cult-collab fans don't come for the base product.** They only engage once a collab drop exists, with 0–2 buys of 15 per idea. The collab is a second-stage growth lever, not the launch.
- **No reviews or proof is the top objection everywhere.** The fixes are a cheap sample (shake), customer 8-hour wear tests (foundation) and buyers first (marketplace).

### Per idea

- **Made By Hand.**
  - The chicken-and-egg problem (no buyers yet, raised 29 times) and "why not Fybe" (11) block sellers. Fybe already runs a human-made-only marketplace, opened August 2026 per reports.
  - The joke page ("no AI slop") lost to plain terms, and made some makers unsure whether they qualify.
  - The equity pool persuaded nobody.
  - Panel's way in: launch a **Collectible Closet** of scheduled handmade drops for Labubu, Sonny Angel and Jellycat fans to get buyers first. Then recruit angry Etsy sellers with real order numbers.
- **Hold Fast.**
  - All 7 buys were the $6 shade kit.
  - Objections: no independent wear tests, cheap drugstore dupes already found, 36 shades too few for deep skin, and price.
  - Fix: seed 20–50 customer half-face 8-hour tests and add a Double Wear shade converter.
  - The angriest group is in the UK, so UK shipping matters.
- **Same Again.**
  - Objections: unknown brand, the $29 upfront trial and taste risk.
  - A white-label "we won't change the recipe" promise needs teeth: a refund or credit if it's broken.
  - Fix: a ~$5 three-sachet sample, with protein, calories and sweetener on the page. Being sweetener-free may be a real edge.

## Recommendation

**Test Made By Hand first, as drops before it becomes a marketplace.** It scored highest on the evidence (92.5/120), passed both signals most strongly, and got the most buys and waitlists in simulation. It also has the clearest growth engine: collectible drops that need no inventory, since makers ship.

**Smoke test** (pre-registered; decide before posting, then don't move the numbers):
- **Pass:** 300 drop-alert sign-ups and 25 makers applying in 14 days.
- **Kill:** fewer than 75 sign-ups or fewer than 5 maker applications.

Hold Fast is the backup. It's the easiest to make (private label), but needs proof assets before any traffic.

## What was not measured

- Real search volumes or CPC (needs DataForSEO via `treg`).
- Reddit threads (blocked for all agents).
- Rival ad libraries for these three categories (Keepwatch ad collection is off).
- Price elasticity.
- Any real buyer.

## Files

- `top-30.md`: the shortlist.
- `data/ideas.json`: all 1,000 ideas with their score breakdowns.
- `data/switchers-*.json`: the switching evidence, with quotes and URLs.
- `data/cult-overlap.json`: cult brands, collabs and business types.
- `data/keywords.json`: the autocomplete evidence.
- `data/verified.json`: the quote checks.
- `data/sim-out-*.json`: every simulated persona, with their decision and reason.
- `scripts/`: the generator, keyword checker and verifier, to re-run with new evidence.
