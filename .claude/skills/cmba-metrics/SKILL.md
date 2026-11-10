---
name: cmba-metrics
description: "Run the Creator MBA improvement loop — baseline the key business metrics (visitors, time on site, bounce, daily sales, conversion rate, revenue, ARPU, CAC, LTV, LTV:CAC, dollar-value-per-visit), form hypotheses, rank them 1-10 by expected impact, run only the top three one at a time for 30-60 days, plus the branched NPS survey and the incentive/affiliate trigger. Use when something isn't working and nobody knows why, when deciding what to fix next, or when setting up measurement. Triggers on: what should I fix, my conversion rate is low, analyze my business, set up metrics, NPS, what test should I run, my funnel is leaking."
---

# CMBA — Metrics & Improvement Loop

The only destructive skill in the suite — its job is to kill what isn't working. Two engines:
**data-driven decision making** (Ch09) and **feedback collection via NPS** (steps 13–14).

Guiding line from the transcript: *the default mode in entrepreneurship is reverse. If you're
doing nothing, you're getting worse.*

## Process

### 1. Baseline
| Metric | Definition | Direction |
|---|---|---|
| Daily visitors (site + per landing page) | and *where from* | ↑ |
| Total time on site / per page | | ↑ |
| Bounce rate | left without a second page | ↓ |
| Daily sales | | ↑ |
| Conversion rate per page | buyers ÷ visitors | ↑ |
| Revenue (day/week/month) | | ↑ |
| ARPU | revenue ÷ customers | ↑ (falls with discounts — expected) |
| CAC | spend ÷ customers won | ↓ |
| LTV | lifetime spend per customer | ↑ |
| **LTV : CAC** | the ratio that decides if paid works | ↑, never <1 |
| **$ per landing page visit** | revenue ÷ visitors | ↑ — the summary metric |

Missing data is recorded as `UNKNOWN`, never estimated.

### 2. Separate outcomes from levers
Sales and revenue are **outcomes** — you cannot act on them directly. Only act on levers:
traffic source, page copy, urgency, internal links, readability, offer/segment match.
Label every candidate as lever or outcome; discard outcome-level "fixes".

### 2b. Preconditions are not tests

If the baseline is mostly `UNKNOWN`, the first work is **instrumentation**, and instrumentation is
not an experiment — it has no hypothesis and no keep/kill criterion. Separate it explicitly.

**Hard stop:** if the highest-ranked hypothesis is effectively "start measuring," nothing below it
may be scheduled until instrumentation is live. Sequencing tests against numbers you cannot yet
read produces a calendar that looks rigorous and teaches nothing.

Typical precondition set: analytics installed · form submissions fired as events · calls tracked ·
traffic source attributed · close rate recorded somewhere other than memory.

Observed on ATX Clean: 11 of 12 baseline metrics were `UNKNOWN`. The only defensible first move was
a 30-day instrumentation window with no criterion attached.

### 3. Hypothesize and rank
For each lever write a hypothesis in the form:
*"If we [change], then [metric] moves [direction] because [mechanism]."*

Score expected impact 1–10. Then **keep only the top three.** The transcript's worked example
scored: urgency/discount banner 9, more traffic from LinkedIn 8, clearer outcome-driven messaging
7, internal links 3, readability + video 2 — and dropped the bottom two.

### 4. Sequence — one at a time
Run each change **alone for 30–60 days**, measure, keep or discard, then start the next. Running
three at once means you learn nothing about which one worked. This is the single most-violated
rule in the chapter and the most important.

Produce a dated test calendar, not a list.

### 5. NPS loop
"On a scale of 0–10, how likely are you to recommend this to a friend or colleague?" Then branch:

| Score | Branch question | Use |
|---|---|---|
| 10 | What did you love most? (free text) | testimonials + do more of this |
| 9 | What would make this a 10? | close the small gap |
| 7–8 (passive) | What specifically would make this a 9 or 10? | convert passives |
| 0–6 (detractor) | Where did I fail to deliver value? | fix, or stop serving that customer type |

Score = %promoters − %detractors (passives don't count). The absolute number is meaningless;
**the trend is the metric.** Track quarter over quarter.

Detractor analysis has two valid outcomes: fix the product, *or* find the commonality and stop
selling to that segment / set expectations earlier.

### 6. Incentive trigger
When NPS is trending up and promoter share is clearly growing, launch the referral/affiliate
program. Not before — incentivizing referrals into a mediocre product accelerates the wrong thing.

## Output format

```markdown
# Business Analysis — [company]

## Baseline
| Metric | Value | Source | UNKNOWN? |

## Levers vs outcomes
| Candidate change | Lever or outcome | Kept? |

## Hypotheses (ranked)
| # | Hypothesis (if/then/because) | Metric | Expected impact 1–10 | Keep? |
Top 3: ...

## Test calendar
| Window | Change | Metric watched | Keep/kill criterion |
(30–60 days each, sequential, dated)

## NPS instrument
[full branched survey]
Baseline run date: | Cadence: | Trend target:

## Incentive readiness
Trigger condition: | Current status:

## Assumptions & Unknowns
```

## Evaluation

**Rubric (0–4 each, 20 total). Pass ≥15, no dimension <2.**

| # | Dimension | 0 | 2 | 4 |
|---|---|---|---|---|
| 1 | **Faithfulness** | Generic analytics advice | Metrics listed | Full baseline incl. LTV:CAC and $/visit, lever-vs-outcome split, 1–10 ranking, top-3 cut, sequential calendar, branched NPS |
| 2 | **Sequencing discipline** | All changes at once | Some ordering | Explicitly one change per 30–60 day window with dates and a keep/kill criterion per window |
| 3 | **Lever discipline** | "Increase sales" listed as an action | Mixed | Every action is a lever; outcomes explicitly labelled and excluded |
| 4 | **Honest baseline** | Invented numbers | Some estimates | Every unavailable number marked `UNKNOWN` with how to obtain it |
| 5 | **Falsifiability** | No thresholds | Direction stated | Each test has a numeric keep/kill threshold decided *before* the test runs |

**Kill check:** fabricated baseline metrics for a real company, or a plan that runs multiple
changes concurrently. Either zeroes the run.

**Control comparison:** where public data exists (pricing, traffic estimates, page structure),
compare the hypotheses against what the company has visibly already tried. A hypothesis they've
clearly already implemented is a scoring penalty on dimension 1.

## Failure modes seen in testing

- Ranking everything 7–9 so nothing gets cut
- Proposing A/B tests without traffic volume to reach significance — check whether the visitor
  count can even resolve the effect size before recommending a split test
- Treating NPS as a number to hit rather than a trend to move
- Launching an affiliate program to fix weak demand
