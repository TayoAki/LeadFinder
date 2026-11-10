# Offer Architecture — ListingProof (working name)

Read first: [differentiators.md](differentiators.md), [uvp.md](uvp.md), [angles.md](angles.md), [voice.md](voice.md), [lead-magnet.md](lead-magnet.md) (drafted in parallel; stages 6 and 5 inform each other per cmba-run), the teardown and the SaaS deep-dive (§6 unit economics). **This file is the single source of truth for prices and plan terms.** Every other artifact quotes it.

## Position
Quadrant: **Small + niche.** Evidence: zero audience today (new brand, no followers, no list); topic is one niche (listing marketing for US agents). The CMBA quadrant says medium-ticket service fits small+niche. This is a software product, so we read it as: a **productized, fixed-price** offer (per listing, per team) with a done-for-you tier — not a course, not a cheap broad subscription. The cheap broad lane ($19–39/mo photo-to-video for every agent) is the one the SaaS deep-dive rejected: crowded, free in brokerages.
Route: **Southern** (narrow first). Next single rung to prove: the **$49 Listing Kit** off the free sample, then the **$199 Team plan**.

## Ladder inventory (what they already sell)
New business — nothing is sold yet.

| Rung | Offer | Price | CONFIRMED/INFERRED/UNKNOWN | Source |
|---|---|---|---|---|
| Free sample | — | — | CONFIRMED absent | New brand |
| Per listing | — | — | CONFIRMED absent | New brand |
| Team subscription | — | — | CONFIRMED absent | New brand |
| Done-for-you | — | — | CONFIRMED absent | New brand |
| Keepwatch (sister product, ad-tracking for brands) | Growth/Scale/Agency | $149/$299/$599 mo | CONFIRMED | keepwatch/README.md — a different buyer; not a rung of this ladder |

Absent rungs: all four. Recommendation targets: all four, launched in order (free → per listing → team → DFY). No INFERRED absences to confirm.

## Differentiation check (read from differentiators.md)
Competitors: https://videotour.ai/pricing, https://www.realestatecontent.ai/pricing-table/ (fetched 2026-11-10).

| Element | SHARED/OURS/THEIRS | Evidence |
|---|---|---|
| Free first output, no card | SHARED (VideoTour) | "Generate Your First Video for Free / No credit card required" |
| Monthly price shown, cancel online | SHARED (REC) | "$119 /month… Cancel any time, no contract" |
| Money-back guarantee | SHARED (REC, 14 days) | "14-day money-back guarantee" |
| Pay per listing | **OURS** | VideoTour: 10/40/200 videos a month + credits; REC: one plan |
| Kit modeled on local kept-running listing ads + Meta ad variants | **OURS (primary, POSITIONAL)** | Neither sells ads or models local winners |

`OURS` element: the kit's core mechanism *is* the differentiator — every kit's hooks and ad variants are modeled on listing ads agents in the buyer's metro kept running 30+ days. Pay-per-listing is the pricing expression. **Shelf life vs payback:** the differentiator's shelf life is ~12 months; the Listing Kit pays back on the first purchase (no CAC payback period beyond one sale at the CAC limits below), and the Team plan pays back in ~2–6 months at the CAC bands below. Both are well inside 12 months.

Substitution test: "VideoTour.ai sells a $49 per-listing kit of videos and Meta ads modeled on the listing ads agents in your metro kept running" → false. "RealEstateContent.ai…" → false. **Not a category offer.**

## The plan structure (canonical)

| Rung | What you get | Price | Billing |
|---|---|---|---|
| **0. Free Sample Kit** | One listing, up to 25 of your photos → 1 tour reel (30–45 s, 9:16) + 1 hook reel (15 s) + 3 Meta ad variants (image, primary text, headline) modeled on a kept-running local listing ad. Original photo shown beside every clip. Unbranded MLS cut. **Unlimited re-renders and photo swaps for 14 days.** No watermark | **$0** | **No card.** Email needed to deliver. One per agent |
| **1. Listing Kit** (pay per listing) | One listing, up to 40 photos → tour reel + hook reel + square cut + unbranded 16:9 MLS cut; **6** Meta ad variants modeled on local kept-running listing ads; simulated buyer panel ranks the top 3 (labelled simulated); compliance pass (BUILD); free re-cuts for status changes (open house, price change, under contract, sold) for 90 days; unlimited re-renders | **$49 per listing** | One-time charge. No subscription, no credits |
| **2. Team** | **6 Listing Kits a month** (unused kits roll over one month), up to 15 agent brand kits under one team brand, a shared local-winners feed for your metro refreshed weekly, extra kits $29 each | **$199 / month** | Monthly only at launch. Renewal reminder email 3 days before each charge. Renewal date and amount shown on the billing page. Cancel in one click; access runs to the end of the paid month |
| **3. Done-for-you** (add-on to any kit) | A person on our team reviews every frame against your originals, picks and edits the 3 ads, writes the captions, and sets up the campaign in **your** Meta ad account under the Housing special ad category, ready for you to press publish. 2 business days | **$149 per listing** (includes the kit) | One-time charge |

**Billing promises (apply to every rung, shown on the pricing page):**
1. The price shown is the price charged (plus sales tax where it applies). Monthly is the only Team billing at launch; if an annual option is added later, monthly stays the default view and annual is shown as the total charged per year.
2. Renewal reminder email 3 days before every Team charge.
3. One-click cancel on the billing page. No call, no "pause" instead of cancel.
4. **30-day money-back guarantee on your first payment** (first Listing Kit, first DFY, or first Team month). Email us; we refund. No questions.
5. **Accuracy promise, any time:** if a video shows something that isn't in your photos, we redo it free or refund that kit.
6. No charge for failed renders. No credits. No setup fees. No "lifetime" discount sales.

**Same-listing upgrade (test only):** upgrading a free kit's own listing to a full Listing Kit for $49 is shown **only** in the test arm of [metrics.md](metrics.md) T3 (2027-02-13 → 03-14). No other page or email offers it until T3 decides.

**New-customer offer (email 5 only, real deadline):** your first paid Listing Kit is **$29 instead of $49** with a one-time code issued in email 5 of the nurture sequence. The code is tied to the subscriber's email, works once, and expires **7 days after it is issued**, on the date printed in the email. Not advertised anywhere else; not a seasonal sale.

## Unit economics

Compute costs from [real-estate-video-saas.md](../deep-dives/real-estate-video-saas.md) §6 (treg catalog aggregator prices, 2026-11-10): Seedance 1 Lite $0.018–0.072/s; Seedance 2.5 $0.103–0.462/s; Kling 3.0 Std $0.084–0.126/s. A 30 s **truthful-motion** reel (ffmpeg motion + optional 2×5 s generative hero clips) is **$0.27–3.47** with 1.5× retries; a full listing kit (3 videos, ~20 generative seconds, ~10 ad images, LLM + panel) is **about $2–10**, mid **$5**. Image and LLM cost per kit (~$1–2) is **not verified**. Our default kit uses **motion mode** (ffmpeg only, near-zero compute) for the tour reel, so the mid estimate is conservative.

Other COGS (assumptions): hosting/storage/support ≈ $2 per kit for per-listing buyers, $16/mo per team; Stripe ≈ 2.9% + $0.30 per charge (US card list rate; **verify**). Human time for DFY: 1 hour at $40.

| Rung | Price | Compute (mid) | Other COGS | Payment fee | Gross profit | GM |
|---|---|---|---|---|---|---|
| Free Sample Kit | $0 | $1–4 (3 ad images + 2 reels, mostly motion; re-renders included) | $1 | $0 | –$2 to –$5 | n/a (acquisition cost) |
| Listing Kit | $49 | $5 | $2 | $1.72 | **$40.28** | **82%** |
| Listing Kit, $29 first-kit offer | $29 | $5 | $2 | $1.14 | $20.86 | 72% |
| Team (6 kits) | $199/mo | $30 | $16 | $6.07 | **$146.93** | **74%** |
| Team extra kit | $29 | $5 | $1 | $1.14 | $21.86 | 75% |
| Done-for-you (incl. kit) | $149 | $5 | $2 + $40 labour | $4.62 | **$97.38** | **65%** |

Worst case (customers push fully generative Seedance 2.5 everywhere, kit ≈ $15–25): Listing Kit GM falls to ~45–65%, Team to ~25–45%. **Control:** generative seconds are capped per kit (20 s) and off by default; the tour reel is motion-only.

**Free-sample cost per paying customer:** at 10% free→paid (**UNSOURCED** — the SaaS deep-dive's illustration uses 10–20% trial→paid), 10 free kits × $3 ≈ **$30** of compute per new payer, before ad spend.

**LTV and CAC ceilings (scenario math, inputs UNSOURCED unless noted):**

| Model | Assumption | GM LTV | Max CAC at LTV:CAC 3:1 |
|---|---|---|---|
| Per-listing agent | 8 paid kits/yr for 2 years (UNSOURCED) → 16 × $40.28 | $644 | **$215** |
| Team | 4% monthly churn (SaaS deep-dive assumption, 3–5% for teams) → 25 months × $146.93 | $3,673 | **$1,224** |
| Team + 2 DFY listings/mo | 25 × ($146.93 + 2 × $97.38) | $8,542 | $2,847 |

The SaaS deep-dive's illustrative paid CAC is $50–300 (at $10–30 per trial and 10–20% trial→paid, **assumption**). Per-listing works only at the low end of that band; teams have room. That is why the team plan is the money rung and per-listing is the entry rung.

## Ladder model (12-month scenario, UNSOURCED volumes — the first thing to test)

| Rung | Offer | Price | Volume (month 6–12 avg, assumption) | Monthly | Annualized | Effort |
|---|---|---|---|---|---|---|
| 0 | Free Sample Kit | $0 | 400 free kits/mo | –$1,200 compute | –$14,400 | Automated |
| 1 | Listing Kit | $49 | 40 paying agents × 1.2 kits | $2,352 | $28,224 | Automated + support |
| 2 | Team | $199 | 15 teams | $2,985 | $35,820 | Light onboarding call (optional) |
| 2b | Team extra kits | $29 | 15 teams × 2 | $870 | $10,440 | Automated |
| 3 | Done-for-you | $149 | 20 listings/mo | $2,980 | $35,760 | 20 h/mo human QA + setup |
| **Total revenue** | | | | **$9,187/mo** | **$110,244/yr** | |

Gross profit ≈ $2,352×0.82 + $2,985×0.74 + $870×0.75 + $2,980×0.65 − $1,200 ≈ **$5,580/mo**.
Outsourcing move: DFY QA to a trained contractor at $40/h (already in COGS) → founder time on DFY drops from ~20 h/mo to ~3 h/mo of spot checks. Net hours saved ≈ 17 h/mo, reinvested in ad creative testing (the acquisition engine).
**Break-even:** fixed costs ≈ $1,000/mo (tools, hosting base, email, review profile; assumption) + ad spend. At $3,000/mo ad spend, break-even needs ≈ $4,000/mo gross profit — about **11 teams + 40 Listing Kits + 10 DFY** a month. Volume (not price) is the assumption to test first; see [metrics.md](metrics.md).

## The offer (built): the Listing Kit
1. **Achievement statement:** Upload one listing's photos today and, within about 10 minutes of processing, have a tour reel, a hook reel, an MLS-safe unbranded cut and 6 Meta ads — each modeled on a listing ad an agent in your market has kept running 30+ days — ready to post or launch before the listing goes live. *(Processing time is a design target, BUILD; measure before stating it publicly.)*
2. **Likelihood:**
   - Outcome statement: "Right now your new listing goes up with the same template every agent uses, or a video that costs $300+ and a week. With the kit, it goes up the same day, looking like the listing ads that have lasted in your town — and every clip matches the house."
   - **Testimonial required (spec — none exists yet):** a named, licensed agent (full name, brokerage, city, with written consent) describing *one specific listing*: what they uploaded, how long it took, what they posted, and one observable thing that followed (a seller's reaction, a listing-appointment use, or their own ad metric with a screenshot). Must be about the kit, not general praise. Must not claim a sales outcome we can't verify. Placeholder in copy: **[CUSTOMER QUOTE, to collect]**.
   - Guarantee: 30-day money-back on your first payment + the accuracy promise (redo or refund if anything appears that isn't in your photos). We can honour both: compute cost per kit is $2–10, so refunds cost us little; the reputational value is high.
3. **Accelerants (effort reducers, not more content):**
   - Upload straight from the photographer's download link or a phone (BUILD); no re-sizing.
   - Brand kit saved once (logo, headshot, brokerage name) and applied to every kit (EXISTS for brands).
   - Status re-cuts for 90 days (open house, price change, sold) in one tap.
   - A one-page "launch it in Ads Manager" sheet for the Housing special ad category (written once, reused).
4. **Fascinations (2 only):**
   - "The one shot almost every long-running listing ad in a market opens with — and why most templates skip it."
   - "Why the ads that last in your town are usually plainer than the ones that don't."

Price reasoning: $49 sits inside the deep-dive's $49–149 per-listing band, below a $300–750 videographer, above the "$10 per listing" Reddit ceiling for plain video because it includes ads and local modeling. Product pricing off survey: Q1 of the post-download survey (listings per year) tells us whether per-listing or Team is the right first pitch per person.

## Landing page skeleton
Hero (Angle 1 headline + upload box + "First kit free, no card") / How it works (3 steps) / Proof (sample kit with originals side by side; source ad run length; [CUSTOMER QUOTE, to collect]) / Pricing (four rungs, monthly shown, billing promises) / Guarantee (founder note) / FAQ / bold CTA. Full copy: [landing-and-ads.md](landing-and-ads.md).

## Right-person outreach template (to survey respondents only — people who opted in)
Manual under 100 subscribers, automated above. Bold segments vary by survey answer.

> Subject: For your **{next listing / team's next listings}**
>
> You told us you list about **{Q1 answer}** homes a year and that **{Q2 answer, e.g. "AI changing the house"}** is the hard part.
>
> **{Segment paragraph:}**
> - *2–5 listings/yr:* Pay per listing fits you. $49 when you have one, nothing when you don't.
> - *6–15:* Most months you'll have one. $49 each still beats any plan until you're past four a month.
> - *16+ or a team:* The Team plan is $199/month for 6 kits, with your metro's local-winners feed refreshed weekly.
>
> Your free kit is still here: **{free kit link}**. Reply with any question; a person reads it.
>
> — Tayo, ListingProof

## Assumptions & Unknowns
- All volumes in the ladder model are UNSOURCED scenarios. The first thing to test is free-kit → paid conversion and the CAC per free kit.
- Compute costs are aggregator list prices on 2026-11-10; image/LLM costs per kit unverified.
- Stripe fee is the US list rate; verify on the account.
- Churn (4% teams) is the SaaS deep-dive's assumption from secondary benchmarks, not verified.
- BUILD before launch: listing-photo upload, metro discovery, originals side-by-side, auto label, compliance pass, billing page with renewal date, reminder email, one-click cancel. None of these claims go live before the feature does.
- DFY sets up campaigns in the customer's own ad account; we never hold their ad spend. Requires partner access to their Business Manager.
- "One per agent" free kit enforcement (email + brokerage name) is weak; abuse risk accepted at ~$3 per kit.
