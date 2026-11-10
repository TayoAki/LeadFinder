---
name: cmba-email
description: "Build the email engine using the Creator MBA email marketing chapter — list growth tactics, a two-email welcome series with expectation setting and deliverability asks, segmentation from reader-collected survey data, shadow newsletters that solve a subscriber's stated problem for their first 5-10 issues, and the metric set (open rate, CTR, conversion, bounce, unsubscribe) with what each one diagnoses. Use when someone has a list but poor engagement, needs a welcome sequence, or wants to personalize at scale. Triggers on: welcome email series, newsletter setup, email segmentation, my open rates are low, grow my newsletter, shadow newsletter, email metrics."
---

# CMBA — Email Engine

Distinct from `cmba-journey`: that skill builds the *sales* sequence after a lead magnet. This one
builds the *relationship* infrastructure — welcome, segmentation, ongoing newsletter, diagnostics.

Principle: email is where you **own** the audience instead of renting it from an algorithm.

## Process

### 0. Should this business do email — and in what form?

Do not assume a newsletter. The chapter this skill is built from assumes email converts an audience
you built on social; that is one business shape, not all of them.

| Question | If no |
|---|---|
| Is there an audience, or a path to one, that isn't already transacting? | there's no newsletter audience to build |
| Do buyers discover this business by following it, or by searching at a moment of need? | intent-led — email is retention, not acquisition |
| Can they honour a stated publishing cadence indefinitely? | a broken frequency promise costs more than no email |
| Is there something to say every week that the buyer wants? | reduce frequency until there is |

**Three verdicts:**
- **FULL ENGINE** — audience-led, list is the asset. Welcome series, segmentation, shadow
  newsletters, the whole chapter
- **LIFECYCLE ONLY** — intent-led or transactional. Same machinery, different job: capture at
  purchase, triggered and seasonal sends, reactivation and recurring-contract pitches. **No
  newsletter.** State this plainly rather than shipping a cadence they'll abandon by week three
- **NOT YET** — no list, no customers, no offer. Email is not the constraint; say what is

Validated both directions: a local service business with no list and intent-led demand returned
LIFECYCLE ONLY; a 63,353-subscriber creator business whose newsletter *is* the product returned
FULL ENGINE. A gate that only ever says no is as useless as no gate.

### 1. List growth
Pick **2–3 tactics maximum** and execute them well — the transcript is explicit that running seven
at once makes attribution impossible. Options: social media CTAs and profile links, lead magnets,
giveaways, viral loops/referrals, cross-promotion. State which two, why those two for this
business, and how each will be tracked (UTM per source).

### 2. Welcome series (keep it short)
Two emails is enough to beat 80% of operators.

**Email 1 (immediate)**
- Who you are, what you help with
- **Expectations**: what day, what time, how long to read. ("Every Saturday, 8:15am ET, under
  four minutes.") Unset expectations are the root of most unsubscribes.
- Story / UVP in one paragraph
- Two deliverability asks: reply "yes", and drag to primary inbox
- One question or a link to the survey

**Email 2 (day ~7)**
- The 3–5 most useful things you've made, linked
- Optional soft product mention

### 3. Segmentation
Two data sources:
- **Provider data** (free): city/country, acquisition campaign, open frequency, products purchased
- **Reader-collected data** (much stronger): the post-signup survey

*(Tooling note: the source material names **ConvertKit** — rebranded to **Kit** `[verified:
2026-07-28]`. Verify any named tool before it reaches output.)*

Uses:
1. **Personas** — bucket by answers to 1–3 questions
2. **Sale targeting** — send each cohort the product they *don't* own (this also prevents the
   "I just paid full price" backlash)
3. **Personalized launches** — same email, swapped paragraphs per business type / stage / platform

### 4. Shadow newsletters
If a subscriber tells you their biggest challenge, don't drop them into the general newsletter.
Route them into a 5–10 issue track that solves *their* stated problem, then merge them into the
main list. Build one track per top challenge from the survey (typically 4–5 tracks).

### 5. Metrics — what each one diagnoses
| Metric | Diagnoses | Lever |
|---|---|---|
| Open rate | subject line, preview text, send day/time | rewrite subject, test send window |
| CTR | relevance, engagement, CTA clarity, personalization | clearer link context, tighter segment |
| Conversion | offer/segment match, email↔landing page alignment, urgency | align page to email, add urgency |
| Bounce | list hygiene, oversized email/attachments | scrub, remove attachments |
| Unsubscribe | expectations mismatch, irrelevance, poor design | re-set expectations, segment harder |

## Output format

```markdown
# Email Engine — [company]

## Growth: 2–3 tactics
| Tactic | Why this one | How tracked (UTM) | Target |

## Welcome series
### Email 1 [subject + preview + full body]
### Email 2 (day 7) [subject + preview + full body]

## Segmentation plan
| Segment | Defined by | What they get differently |

## Shadow newsletter tracks
| Track (challenge) | Issues | Titles 1–N | Merge point |

## Metrics baseline & targets
| Metric | Current | Target | If it moves wrong, check |

## Assumptions & Unknowns
```

## Evaluation

**Rubric (0–4 each, 20 total). Pass ≥15, no dimension <2.**

| # | Dimension | 0 | 2 | 4 |
|---|---|---|---|---|
| 1 | **Faithfulness** | Generic email advice | Welcome series only | 2–3 growth tactics (not 7), 2-email welcome with expectations + deliverability asks, segmentation, shadow tracks, metric diagnostics |
| 2 | **Expectation setting** | No cadence stated | Vague ("weekly-ish") | Exact day, time, and read length committed to in email 1 |
| 3 | **Segmentation logic** | Demographics only | Personas defined | Segments derive from survey answers and each has a *different action*, not just a different label |
| 4 | **Restraint** | Seven growth tactics, five-email welcome | Some bloat | Explicitly limits to 2–3 tactics and 2 welcome emails, with the reason |
| 5 | **Falsifiability** | No numbers | Targets stated | Each metric has a target band and the diagnostic to run when it moves the wrong way |

**Kill check:** invented current metrics for a real company (open rates, list size). State
`UNKNOWN — needs owner input` instead. Zero the run for fabricated baselines.

**Control comparison:** actually sign up for the company's list where one exists. Time the first
email, check whether expectations are set, check whether a survey follows. Report what arrived
versus what should have.

## Failure modes seen in testing

- Five-email welcome series (over-engineering the exact thing the lesson says to keep simple)
- Segments that exist but never change what anyone receives
- Shadow newsletter tracks with no merge point back to the main list
- Listing metrics without their diagnostic meaning, which is the only part that's actionable
