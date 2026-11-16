# Wave-1 feed panel: v1 drafts vs v2 native posts (SIMULATED, not demand evidence)

## How it was run
- **Panel:** 100 simulated TikTok users in the Open Tee Club ICP segment mix, run as 4 independent panels of 25.
- **Feed:** 14 anonymised photo posts (P01–P14), with nothing to show which were ours or real:
  - our 7 v1 drafts;
  - our 4 v2 posts;
  - 3 real outlier posts as anchors (R6 gift grid, R9 tips, R4 haul).
- **Order:** panels 1–2 saw one order; panels 3–4 saw it reversed.
- **Recorded per person and post:** stop (past slide 1), finish, save, share, comment, profile tap, "this is an ad", and cap interest (0–3).
- **Uncertainty:** 90% CIs bootstrap over personas.

Files:
- `panel-*.json`: raw reactions;
- `score.py` → `results.json`;
- `key.json`: post codes.

## Anchor check: FAILED for saves
The 3 real winners scored the **lowest** saves in the panel (1.7% pooled), although each really earned 29–40 saves per 1,000 plays.

The skip reasons explain why: "gift list for men, not shopping", "old men in plaid, not my world", "someone's boyfriend haul, scroll". The real posts were made for other audiences (girlfriends buying for boyfriends, traditional golf).

So this panel measures **fit with our ICP**, not how saveable a post is. **Don't use its save ranking to choose posts.**

## v1 vs v2 (pooled, v2 minus v1, 90% CI)

| Measure | v1 | v2 | Difference | Clear? |
|---|---|---|---|---|
| Thinks "this is an ad" | 26.0% | 1.8% | −24 pts [−27, −21] | **Yes** |
| Stops past slide 1 | 28.3% | 35.2% | +7 pts [+2, +12] | **Yes** |
| Reaches last slide | 14.6% | 22.3% | +8 pts [+4, +12] | **Yes** |
| Saves | 3.6% | 4.5% | +1 pt [−1, +3] | No (too few saves to tell) |
| Shares | 2.6% | 2.0% | −0.6 pt [−2, +1] | No |
| Cap interest (0–3) | 0.26 | 0.25 | ~0 | No: v2 shows the cap less but interest held |

**Reading.** The native rebuild did what the spec predicted. It stopped reading as an ad, and more people stopped on it and swiped to the end. Cap interest held even though the cap is now one item among many. The panel can't separate the two versions on saves.

## Per post (saves have wide CIs: 7 saves out of 100 is the maximum)

| Post | Stop | Finish | Save | Ad | Cap interest | Note |
|---|---|---|---|---|---|---|
| v2-4 matching caps (shot list) | **48%** | **27%** | 5% | 16% | **0.37** | Highest stop and cap interest. **Judged with placeholder frames**, so re-test with real photos. |
| v1-1 crew hat ideas | 37% | 21% | 7% | **40%** | 0.30 | Interest, but 4 in 10 flag it as an ad |
| v2-1 gift grid | 26% | 18% | 7% | 8% | 0.19 | **Order-unstable** (12% vs 2% saves by feed order) |
| v2-5 trip haul (shot list) | 37% | 24% | 2% | 8% | 0.20 | Placeholders |
| v2-3 tips | 30% | 20% | 4% | 0% | — | Same as the real R9 tips post (29%, 3%) |
| v1-5 blank to crew cap | 24% | 10% | 4% | **41%** | 0.24 | Read as an ad |
| v1-4 every golf group | 42% | 18% | **0%** | 28% | 0.17 | Stops people, but nobody saves it |
| v1-7 we mocked up your crews | 20% | 8% | **0%** | 26% | 0.16 | Weakest: confirms dropping it |

## What this changes
1. **Keep the v2 direction.** It is the clearest result here, and the real-winner research agrees.
2. **v2-4 "let's make matching caps"** is the best candidate to shoot first: it had the highest stop rate and cap interest. Do it once real caps exist.
3. **Drop v1-4 and v1-7.** They got zero saves in both feed orders.
4. **Use the real test to decide on saves.** Post 2–3 v2 posts and compare saves per 1,000 plays with the 6-per-1,000 median for golf outliers and the 30–50 of the references.
