# Slogans for the Denim Tears ICP (SIMULATED, not demand evidence)

ICP: `research/denim-tears/ICP.md`.

**Method**
1. Model run (`ICP=denimtears python3 slogan_sim.py`): 20,000 simulated shoppers, scoring the original 1,000 slogans plus 63 new ones (`slogans-denimtears.txt`).
2. Two blind LLM persona panels of 100 each (2 × 50 per round, in opposite orders), with nothing to show which slogans were new or old:
   - Round 1: 24 slogans (`dt-panel-results.json`).
   - Round 2: 12 new slogans plus round 1's top 6 (`dt-r2-panel-results.json`).

## What held up in BOTH rounds and BOTH orders

| Slogan | Round 1 weighted picks (A / B) | Round 2 weighted picks (A / B) | Try-hard flags (R1 / R2) | Borrowed flags | Verdict |
|---|---|---|---|---|---|
| **Night Range League** | 26 (16 / 10) | 35 (22 / 13) | 13 / 18 | 0 | **Most stable pick.** "reads like a crew name", "late-night energy" |
| **Long Way Round** (round 2) | — | 50 (27 / 23) | — / 0 | 0 | **Strongest new slogan**: stable in both orders, no flags. "could pass as anything" |
| **Still Learning** (round 2) | — | 38 (14 / 24) | — / 2 | 0 | Honest, beginner-true. "the only one that doesn't pose" |
| Walking Nine / Twilight Nine (round 2) | — | 22 / 18 | — / 2, 1 | 0 | Clean, quieter second tier |
| Members of Nothing | 38 (14 / 24) | 83 (20 / 63) | 0 / 40 | 12 / 0 | Most first picks, but **order-unstable** and split: "only one that reads like a brand" vs "a teenager's hat" |

## Unstable: don't rely on them
- **Good Walk Spoiled:** round 1 #1 (48 points, 6 try-hard) → round 2 near bottom (3 points, **99 try-hard**).
- **Sunday Muni:** 43 → 14 points.
- **Golf Is Hard:** 33 → 100 try-hard.

The comparison set moved these simulated panels a lot. Treat any single-round ranking as noise.

## Rejected every time
- **Place names**, from a brand not from the place: Uptown Range Club 60/100 borrowed, NYC Muni 44, Five Borough Muni 43 → 94. Dawn Patrol was also flagged (37 borrowed, read as surf or military).
- **Earlier Open Tee Club winners and slang:** Bogey. What About It?, Birdies in My Bag, Mind Your Bogeys and Who Said Fore? got 88–97 of 100 try-hard flags.
- **Jokes about golf:** Golf, Mostly (79 try-hard), Playing Through (37).
- **28–29 of 100** picked nothing in either round. This audience mostly doesn't want golf merch.

## Model vs panels
- The first model rewarded place names; the panel showed that reads as borrowed, so place is now a penalty.
- After that fix the model still under-ranks the quiet slogans the panels liked: Long Way Round #71, Still Learning #61. Use the model to screen out bad slogans, not to choose winners.

## Recommendation (to test for real)
1. **Shortlist:** Long Way Round, Night Range League, Still Learning. Optional: Members of Nothing as the polarising pick.
2. **Test format:** fit pics in NYC streetwear context, not golf content. One cap each, compared on real saves and clicks.
3. **Trademark-search** all of them before buying stock. None has been checked yet.
