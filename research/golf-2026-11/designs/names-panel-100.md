# Crew-name example panel (100 shoppers)

**SIMULATED, not demand evidence.** These are 100 made-up shoppers whose answers come from rules we wrote about each segment. Use the results to decide which names to test, not as proof that people will buy. Retro rope cap, Ivory, green script, $38, unknown brand, mid-November.

## Per-name results

| Rank | Name | 1st-choice | 1st+2nd | Most-disliked | Buy yes (of 1st-choosers) | Share yes (of 1st-choosers) |
|---|---|---|---|---|---|---|
| 1 | N3 Sunday Swing Club (EST. 2026) | 29 | 38 | 1 | 4 | 3 |
| 2 | N6 Slice Boys (MYRTLE BEACH · 2026) | 17 | 27 | 2 | 5 | 12 |
| 3 | N8 Dad Bod Golf Club (EST. 2026) | 16 | 35 | 3 | 9 | 9 |
| 4 | N4 Weekend Swing Club (EST. 2026) | 12 | 28 | 1 | 4 | 2 |
| 5 | N2 Golf Trip Boys (BANDON · 2026) | 10 | 26 | 3 | 6 | 5 |
| 6 | N7 Lip-Out Boys (PINEHURST · 2026) | 6 | 18 | 1 | 1 | 4 |
| 7 | N5 Range Day Club (EST. 2026) | 4 | 12 | 4 | 1 | 1 |
| 8 | N1 Tee Time Boys (SCOTTSDALE · 2026) | 3 | 8 | 2 | 2 | 1 |
| 9 | N9 Back Nine Babes (PALM SPRINGS · 2026) | 2 | 5 | 28 | 0 | 1 |
| 10 | N10 Chip Chicks (EST. 2026) | 1 | 3 | 55 | 0 | 1 |

Totals: buy yes 32/100, share yes 39/100.

## Winner per segment

| Segment | n | Winner (1st votes) | Runner-up | Most disliked | Buy yes | 1st-choice spread |
|---|---|---|---|---|---|---|
| Trip/crew organiser | 14 | N2 Golf Trip Boys (8) | N8 | N10 | 7 | N2:8, N8:2, N6:1, N1:1, N7:1, N4:1 |
| Gift buyer | 18 | N3 Sunday Swing Club (10) | N8 | N10 | 8 | N3:10, N8:7, N6:1 |
| Golf dad | 12 | N8 Dad Bod Golf Club (4) | N3 | N10 | 5 | N8:4, N3:3, N4:2, N6:1, N2:1, N1:1 |
| Style-led retro golfer | 14 | N3 Sunday Swing Club (10) | N7 | N10 | 0 | N3:10, N7:1, N4:1, N6:1, N2:1 |
| Muni/public-course golfer | 10 | N4 Weekend Swing Club (4) | N6 | N10 | 2 | N4:4, N6:3, N5:1, N7:1, N1:1 |
| Casual humour sharer | 14 | N6 Slice Boys (8) | N8 | N10 | 5 | N6:8, N7:3, N8:3 |
| Woman golfer | 10 | N3 Sunday Swing Club (5) | N4 | N8 | 1 | N3:5, N9:2, N4:2, N10:1 |
| League/member-guest captain | 4 | N6 Slice Boys (2) | N3 | N9 | 3 | N6:2, N3:1, N4:1 |
| Beginner | 4 | N5 Range Day Club (3) | N4 | N10 | 1 | N5:3, N4:1 |

## Reasons (top 3 and bottom 2 by first-choice votes)

**N3 Sunday Swing Club (EST. 2026)** (why chosen):
- 'Sunday Swing' has a nice ring to it (13)
- sounds like a real old-school club, fits the rope-cap look (10)

**N6 Slice Boys (MYRTLE BEACH · 2026)** (why chosen):
- instant group-chat bit, everyone tags the worst slicer (7)
- self-deprecating in a way every hacker gets (6)

**N8 Dad Bod Golf Club (EST. 2026)** (why chosen):
- it'd make him laugh, and it's true (7)
- owning the dad bod is the joke, we'd wear it proudly (6)

**N9 Back Nine Babes (PALM SPRINGS · 2026)** (why disliked):
- not our group at all and a bit cringe (26)
- 'Babes' feels dated and a bit cringe (2)

**N10 Chip Chicks (EST. 2026)** (why disliked):
- not our group at all and a bit cringe (30)
- novelty-merch energy, wouldn't wear it off the course (15)

## Caveats

- Most N9/N10 dislikes come from men and from people buying for men who were forced to name one least-liked name ("not our group"). That is a poor fit, not anger. Among the 10 women golfers, 2 picked Back Nine Babes or Chip Chicks first, 2 named Chip Chicks as most disliked and 3 named Dad Bod. Women split on these names; they did not all reject them.
- League captains (n=4) and beginners (n=4) are too few to call a winner. Their winners change with the random seed.
- Buy "yes" means the shopper said they would buy, at $38, from a brand they don't know. Treat it as a ceiling, not a conversion rate.

## Method

Seeded simulation (seed 20261116): segment base appeal per name + per-shopper noise, personal humour taste, gender/recipient fit, 'Babes'/'Chicks' split among women, non-golfer jargon penalty, mild primacy effect from a random presentation order. Buy/share probabilities by segment, scaled by fit.

Per-shopper rows (presentation order, choices, reasons) are in `names-panel-100.json`.
