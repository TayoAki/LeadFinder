# Business Analysis — ListingProof (working name)

Read first: every artifact in this folder, especially [offer.md](offer.md) (prices, unit economics), [landing-and-ads.md](landing-and-ads.md) (ads A1–A8), [email.md](email.md) (sequence timing), [lead-magnet.md](lead-magnet.md) and [journey.md](journey.md) (expected bands).

Nothing is live. **Every current value is UNKNOWN.** Targets carry a source or the tag **UNSOURCED**.

## Baseline
| Metric | Value | Source / target band | UNKNOWN? | How to obtain |
|---|---|---|---|---|
| Daily visitors (site, `/real-estate-video-maker`, `/local-ads`, `/pricing`) and source | — | UNSOURCED: driven by ad spend | UNKNOWN | GA4/Plausible + UTMs on every ad and email link |
| Time on page (landing) | — | UNSOURCED | UNKNOWN | Analytics |
| Bounce rate (landing) | — | UNSOURCED | UNKNOWN | Analytics |
| Free-kit starts / day | — | UNSOURCED | UNKNOWN | Server event `kit_started` (photos uploaded) |
| Free-kit completions (kit delivered) | — | Target ≥80% of starts (UNSOURCED) | UNKNOWN | `kit_delivered` |
| Daily sales (Listing Kits, Team starts, DFY) | — | UNSOURCED | UNKNOWN | Stripe webhooks |
| Conversion: landing visit → free-kit start | — | UNSOURCED target 8–15% | UNKNOWN | Events |
| Conversion: free kit → paid within 14 days | — | **10–20%** (the SaaS deep-dive's trial→paid illustration; assumption, not measured) | UNKNOWN | Stripe + kit ID |
| Conversion: report subscriber → paid by day 15 | — | 2–5% UNSOURCED (journey.md) | UNKNOWN | Email tool + Stripe |
| Revenue (day/week/month) | — | Break-even ≈ $4,000 gross profit/mo at $3,000 ad spend (offer.md) | UNKNOWN | Stripe |
| ARPU | — | Per-listing ≈ $49 × kits; Team $199 | UNKNOWN | Stripe |
| CAC | — | Ceilings from offer.md: **≤ $215** per-listing payer, **≤ $1,224** team (3:1) | UNKNOWN | Ad spend ÷ new payers, by campaign |
| LTV (gross margin) | — | Scenario: $644 per-listing, $3,673 team (offer.md; churn and kit frequency UNSOURCED) | UNKNOWN | Cohorts after 90 days |
| **LTV : CAC** | — | ≥ 3:1 target; never < 1 | UNKNOWN | Above |
| **$ per landing page visit** | — | UNSOURCED | UNKNOWN | Revenue ÷ landing visits, by source |
| Cost per free-kit start (paid) | — | $10–30 (SaaS deep-dive assumption for cost per trial) | UNKNOWN | Meta Ads Manager custom conversion `kit_started` |
| Compute cost per kit | — | $2–10, mid $5 (treg catalog prices, 2026-11-10) | Estimated | Log per-render cost |
| Refund rate (30-day guarantee + accuracy promise) | — | UNSOURCED; watch for >10% | UNKNOWN | Stripe refunds tagged by reason |

## Precondition (not a test): instrumentation window
Baseline is 100% UNKNOWN, so per cmba-metrics 2b nothing is scheduled until these are live and have run for 3 weeks:
- Analytics on all pages; UTMs on all ads and emails
- Server events: `kit_started`, `kit_delivered`, `rerender`, `checkout_started`, `purchase`, `refund` (with reason)
- Meta pixel + Conversions API firing `kit_started` and `purchase`
- Email tool events (open, click, unsub) joined to Stripe customer by email
- Compute cost logged per kit
- Refund reasons recorded (accuracy / not for me / billing)

**Window: launch day (target 2026-11-24) → 2026-12-14.** During it: ads A1 (output-first demo) and A8 (local report) run with fixed budgets; A4 runs only in its dated Black Friday window (Nov 24 – Dec 2). No copy, price or page changes. This window produces the baseline numbers the tests are judged against.

## Levers vs outcomes
| Candidate change | Lever or outcome | Kept? |
|---|---|---|
| "Get more sales" | Outcome | Discard |
| "Increase revenue per customer" | Outcome | Discard |
| Ad angle: mechanism (A1) vs truth (A2) | Lever | Yes |
| Price line in the ad ("$49 a listing. First one free.") | Lever | Yes |
| Same-listing upgrade offer on the free-kit delivery page | Lever | Yes |
| Report popup trigger (20 s + exit-intent baseline) | Lever | Yes |
| Upload box above the fold vs CTA button to a separate page | Lever | Yes |
| Team-plan setup call offer for survey Q1 = 16+/team | Lever | Yes |
| Win-the-listing ad (A7) | Lever | Yes |
| Email 5 discount size ($29 vs $39) | Lever | Yes |
| "Improve NPS" | Outcome | Discard |
| More SEO articles | Lever (slow) | Yes, but not testable in a 30-day window |

## Hypotheses (ranked)
| # | Hypothesis (if / then / because) | Metric | Impact 1–10 | Keep? |
|---|---|---|---|---|
| 1 | If the lead ad uses the **truth angle (A2)** instead of the **mechanism angle (A1)**, cost per free-kit start falls, because AI-accuracy fear is the louder pain in the evidence (7 Reddit threads, MLS fines) | Cost per `kit_started` | **9** | **Top 3** |
| 2 | If the winning ad adds the **price line** "$49 a listing. First one free.", free-kit → paid rises, because price-on-click pre-qualifies (REC sends 77 of 80 ads to its pricing page) | Free kit → paid within 14 days; cost per payer | **8** | **Top 3** |
| 3 | If the free-kit delivery page offers **"Upgrade this listing to the full kit — $49"** (3 more ads, square + MLS cuts, 90-day re-cuts), free kit → paid rises, because intent peaks on the listing they're marketing now, not the next one | Free kit → paid within 14 days | **8** | **Top 3** |
| 4 | If team-sized respondents get a 15-minute setup call offer, Team starts rise | Team starts / Q1=16+ respondents | 6 | No (volume too low to read in 30 days) |
| 5 | If the popup drops its 20 s trigger and fires on exit-intent only, free-kit starts rise because fewer visitors are interrupted before uploading (baseline per lead-magnet.md fires on both) | Kit starts; popup conversions | 5 | No |
| 6 | If A7 (win the listing) replaces A1 in January, cost per start falls (seller season) | Cost per start | 5 | No (run after T2 if T1/T2 inconclusive) |
| 7 | If email 5's code is $39 instead of $29, revenue per subscriber holds and margin rises | Revenue per report subscriber | 4 | No |
| 8 | If the upload box sits above the fold (vs a button), kit starts rise | Visit → kit start | 4 | No (already the launch design; VideoTour evidence) |
| 9 | More SEO articles lift sign-ups | Organic sign-ups | 3 | No (not a 30-day test) |

Top 3: **#1, #2, #3.** Bottom six dropped.

**Traffic check (cmba-metrics failure mode):** each test needs enough events to see a large effect, not a small one. At the assumed $10–30 per free-kit start (UNSOURCED), 60 starts per arm costs $1,200–3,600 per arm. With ~60 per arm we can only detect differences of roughly 35% or more. Smaller differences are called **inconclusive → keep the control**, not a win. If spend can't reach 60 starts per arm in 30 days, extend the window to 60 days rather than lower the bar.

## Test calendar (sequential, one change per window)
| Window | Change (only this changes) | Metric watched | Keep / kill criterion (set before start) |
|---|---|---|---|
| 2026-11-24 → 12-14 | **Instrumentation only.** No test | All baseline rows | Proceed only when every event in the precondition list fires and reconciles with Stripe within 2% |
| **T1:** 2026-12-15 → 2027-01-13 | Meta A/B (Experiments tool, equal budget): **A1 mechanism vs A2 truth**. Same landing page, same offer | Cost per `kit_started`; secondary: kit → paid by day 14 | **Keep A2** if its cost per start is ≥ 30% lower with ≥ 60 starts per arm **and** its kit→paid is not lower by more than 3 points. **Keep A1** if A2 is not ≥ 30% better. Anything between = inconclusive → keep A1 (the differentiator angle). *Note: holiday weeks depress listing activity; compare arms to each other, not to December baseline* |
| **T2:** 2027-01-14 → 02-12 | Winner of T1 **with vs without** the price line "$49 a listing. First one free." | Cost per paying customer; free kit → paid within 14 days | **Keep the price line** if cost per paying customer is ≥ 20% lower with ≥ 15 payers per arm. **Kill** if kit starts drop > 40% and payers don't rise. Otherwise inconclusive → no price line |
| **T3:** 2027-02-13 → 03-14 | Delivery page **with vs without** "Upgrade this listing to the full kit — $49" (50/50 by account) | Free kit → paid within 14 days | **Keep** if free→paid rises by ≥ 5 percentage points (e.g., 10% → 15%) with ≥ 150 delivered kits per arm, **and** refund rate in the upgrade arm stays < 10%. **Kill** if the lift is < 2 points or refunds ≥ 10% |

Frozen during every window: email copy and timing (emails 1–6, welcome 2, shadow tracks), prices and the email 5 code, landing page copy, guarantee wording. Content can publish (SEO articles), but article traffic is excluded from test cohorts by UTM.

## NPS instrument
Sent 30 days after a customer's first paid kit (and quarterly to Team accounts), by email, one question plus one branch.

> **On a scale of 0–10, how likely are you to recommend ListingProof to another agent?**
>
> - **10:** What did you love most? *(free text — with permission, this becomes a testimonial; ask for full name, brokerage, city and written consent separately)*
> - **9:** What would make it a 10?
> - **7–8:** What specifically would make this a 9 or 10 for you?
> - **0–6:** Where did we fail to deliver what you expected?

Score = % promoters (9–10) − % detractors (0–6). The trend is the metric, not the number.
Baseline run date: **2027-01-15** (first cohort of December buyers at 30 days). Cadence: monthly cohorts, reported quarterly. Trend target: up quarter over quarter.
Detractor analysis: tag every 0–6 answer (accuracy, output quality, billing, local data thin, other). Two valid moves: fix it, or stop selling to that segment (e.g., if thin-metro agents are most detractors, stop targeting small metros).

## Incentive readiness
Trigger condition: NPS up two quarters in a row **and** promoters ≥ 50% of respondents **and** ≥ 30 responses. Then launch referral credit (e.g., a free Listing Kit for both sides) — not before.
Current status: **not met** (no customers). Do not launch an affiliate program to fix weak demand.

## Assumptions & Unknowns
- Launch on 2026-11-24 assumes the BUILD items in landing-and-ads.md ship in two weeks. If launch slips, every window shifts by the slip; A4 (Black Friday) is skipped this year rather than run before instrumentation.
- Cost per start, trial→paid, refund rate and all bands are UNSOURCED until the instrumentation window ends.
- Meta's A/B tool splits audiences; T3 splits by account on our side.
- Holiday seasonality (Nov–Feb slow listing period, per the SaaS deep-dive) makes absolute numbers from T1 a poor guide for spring. Re-baseline in March.
