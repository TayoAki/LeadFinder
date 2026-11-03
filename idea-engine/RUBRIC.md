# Idea Engine — Pre-registered Rubric

Written 2026-11-03 **before** any data was pulled. Not edited after seeing results.

## Pipeline
1. **Mine** Reddit for explicit "I want a solution" posts from the last 12 months, using fixed intent phrases:
   "is there an app", "is there a tool", "is there a software", "i would pay for", "i'd pay for",
   "does anyone know an app", "app that can", "how do you keep track of", "i use a spreadsheet",
   "tired of manually", "there has to be a better way", "wish there was an app".
2. **Extract** one problem per post: who has it, the job, what they use today.
3. **Cluster** posts into problems; keep problems with ≥3 independent posts.
4. **Search-test** each problem with 3 keywords (problem, workaround, solution), chosen before seeing volumes.
5. **SERP-test** the top problems: who ranks for the solution keyword.
6. **Score** with the bands below, then rank. Competition is reported, not scored.
7. **Controls:** three known 2023–2025 winners go through steps 4–6 under the same rules:
   AI calorie photo logging (Cal AI), AI meeting notes (Granola/Otter), AI headshots (Aragon).
   If the rubric doesn't rank them in the top third, the rubric is wrong. Say so.

## Signals (1–5 each, total /25)
- **Forum pain:** independent posts in the cluster: ≥10 = 5 · 6–9 = 4 · 4–5 = 3 · 3 = 2 · <3 = 1
- **Search demand:** summed monthly US volume of the 3 keywords: ≥10k = 5 · 3k–10k = 4 · 1k–3k = 3 · 300–1k = 2 · <300 = 1
- **Growth:** last-12-months ÷ prior-12-months volume: ≥1.5 = 5 · 1.2–1.5 = 4 · 0.95–1.2 = 3 · 0.75–0.95 = 2 · <0.75 = 1
- **Willingness to pay:** highest CPC among the 3 keywords: ≥$5 = 5 · $3–5 = 4 · $1.5–3 = 3 · $0.5–1.5 = 2 · <$0.5 = 1
- **SERP gap:** forums/Reddit/Quora/Facebook in the top 5 for the solution keyword: ≥3 = 5 · 2 = 4 · 1 = 3 · 0, but top result older than 2 years = 2 · 0 = 1

## Verdict
- ≥20: validate now (landing page + pre-sell)
- 16–19: watch list
- <16: drop

## Control keywords (fixed 2026-11-03, before data)
| Control | Problem | Workaround | Solution |
|---|---|---|---|
| AI calorie photo logging | counting calories is tedious | calorie tracking spreadsheet | calorie counter by photo |
| AI meeting notes | taking notes during meetings | meeting notes template | ai meeting notes |
| AI headshots | need professional headshot | headshot photographer | ai headshot generator |

Control forum pain is counted with the same intent phrases plus the topic word ("is there an app" + calories, etc.), last 12 months.

**Known limit:** controls are measured today, after they won. Their search demand partly reflects their own success, so this checks that the rubric *recognizes* a winner. It doesn't prove the rubric *predicted* one.

---
# v1 result (2026-11-03): FAILED the control test
Controls ranked: AI meeting notes #2 (19/25), AI calorie photo logging #6 (14), AI headshots #10 (13), out of 15.
Two of three fell outside the top third.
**Cause:** demand and growth were measured on 3 hand-picked long-tail phrases ("calorie counter by photo" = 20/mo), which miss the category's real search volume.

# v2 change (one change only, declared before re-running)
- **Demand, growth and willingness to pay** now come from the **category seed**: the solution keyword's core 2–3 word noun phrase, with "free", audience qualifiers and "app/software/generator" dropped. Sources:
  - DataForSEO keyword suggestions: the top 20 keywords containing the seed, by volume.
  - Demand = their summed volume. Growth = volume-weighted 12-month ratio. WTP = median CPC of the top 20.
- Bands unchanged.
- Forum pain and SERP gap are unchanged.
- **Holdout controls,** never used to design v2: AI resume builder; AI interior design. Same forum-pain method as the other controls.
- v2 passes only if **all 5 controls** rank in the top third.

Seeds (fixed before data): budget tracker · rental property management · home maintenance · adhd planner · closet inventory · construction estimating · expense tracker · portfolio tracker · inventory management · behavior tracking · photo organizer · collection tracker · calorie counter · meeting notes · ai headshot · ai resume builder · ai interior design

# v2 result (2026-11-03): ALSO FAILED
Category-seed demand gave every problem a 5 (all over 10k), so demand stopped separating ideas. Growth came back 0 for every row: Labs returns 12 months, not 24 (a bug in this run).
Even ignoring growth, controls ranked: meeting notes #5, calorie #9, resume #12, headshots #14, interior design #15 of 17.

# Conclusion
Forum "is there an app" mining finds real, recurring **workflow pains**. Top: personal budgeting (14 posts), small landlords (7), home maintenance (6).
It does **not** recognize the 2023–25 AI consumer hits. Those had little forum asking ahead of time; they rode a capability shift plus a viral trend.
So it isn't a proven way to find winners. Treat it as a source of B2B / workflow ideas, then validate with pre-sales.
For trend-driven bets, use a different test: search growth + paid-ad competition + revenue signals.
