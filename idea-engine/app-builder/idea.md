# Business Idea Analysis: App Builder (Tayo)

Date: 2026-11-10. Skill: `cmba-idea`. Inputs: [demand-keywords.md](demand-keywords.md), [competitors-and-rules.md](competitors-and-rules.md), [small-shopify-stores.md](small-shopify-stores.md), [differentiators.md](differentiators.md), and `../../weight-class/` (Tayo's live app).

The product already exists. This run does not invent a new business. It decides **who App Builder is for**.

## Step 0: Applicability and entity

| Precondition | Holds? | Evidence |
|---|---|---|
| Identifiable operator or brand | Yes | Tayo, founder. Also runs Weight Class, a calorie and GLP-1 tracker live on the App Store. |
| Direct channel | Yes | Web sign-up, "Start free with 100 credits". No marketplace sits in between. |
| Content-led acquisition plausible | Yes | Growing how-to searches ("how to publish an app on app store" 590/mo, +103%) and a free-tool wedge with a weak SERP. |
| One operator can package and price it | Yes | Credit pricing, plus an optional done-with-you launch service. |

**Verdict: APPLIES (4/4).**
Subject type: person (a founder with a product). Personal sources used.
Sources that produced candidates: 4/4. Two are partly **INFERRED** (marked below).

## Step 1: Harvest

| Source | Candidates | Status |
|---|---|---|
| Practical experience | (a) shipping a subscription app with paywall, onboarding and App Store screenshots (Weight Class); (b) running App Store ads and ASO for that app (`weight-class/competitor-ads.md`, `ad-test-results.md`) | Verified from repo files |
| Learned obsession | (a) AI app builders and the App Store last mile; (b) ASO and keyword research | INFERRED from the research Tayo commissioned |
| Inbound advice | (a) "how did you get through review / make your screenshots?"; (b) agencies asking for client apps | **UNKNOWN.** No record of who asks Tayo for what. Ask Tayo. |
| Solved-for-self | (a) App Builder's built-in paywall, onboarding, keyword and screenshot generators exist because a subscription-app founder needs them; (b) a Shopify-store app template | INFERRED from the feature list |

**Overlap.** "Ship and monetize a subscription app on the App Store" appears in practical experience, learned obsession and solved-for-self (3 sources). That is the default pick unless a lens kills it.

## Step 2: Candidates and chains

### 1. Indie and subscription app makers (the builder, with launch help built in)
- Sources: practical experience, obsession, solved-for-self (overlap 3)
- Chain: AI build + paywall + listing kit → app reaches the store with a working paywall sooner → **makes money** → **Wealth**
- Angle: Tayo ships and runs a real subscription app in a crowded health category. He has hit the same review, paywall and listing work himself.

### 2. App Store launch kit as a wedge for users of ANY builder
- Sources: practical experience, solved-for-self (overlap 2)
- Chain: screenshots + keywords + pre-flight for an app built anywhere → fewer rejections, a findable listing → **saves time, makes money** → **Wealth**
- Angle: the same features, sold without requiring a rebuild in App Builder.

### 3. General AI mobile app builder ("build any app with AI")
- Sources: obsession (overlap 1)
- Chain: prompt → app → **saves money** (no developer) → **Wealth**
- Angle: weak. Nothing here is specific to Tayo.

### 4. Shopify switchers at $250K–2M/yr
- Sources: solved-for-self, as a template only (overlap 1)
- Chain: store → branded iOS app with push → repeat orders → **makes money** → **Wealth**
- Angle: weak. Tayo has no e-commerce history on record.

### 5. Agencies building client apps
- Sources: inbound advice (UNKNOWN) (overlap 0–1)
- Chain: faster builds under 4.2.6 client-owned accounts → agency margin → **makes money** → **Wealth**
- Angle: none on record.

All five land in Wealth. That is true here, not lazy: the buyer of an app builder wants a business outcome. Weight Class sits in Health, but its buyers are app users, not App Builder's buyers.

## Cut list

| Candidate | Why cut |
|---|---|
| Local business apps (restaurant, salon, church, gym) | ~170/mo builder intent, falling; vertical SaaS bundles the app; 4.2 thin-app risk ([demand-keywords.md §2, §7](demand-keywords.md)) |
| Creator / community apps | ~30/mo builder intent; Skool (165k/mo brand) owns the demand |
| Internal business tools | Buyers need backends and integrations; paywall, screenshots and ASO are irrelevant |
| New Shopify stores under $100K | Gate 0 REJECT: 5 tight asks in 12 months, 0 in the last 90 days ([small-shopify-stores.md §7](small-shopify-stores.md)) |

## Step 3: Persistence check (recommended candidate)

1. Like doing it? **ASSUMED yes.** He built the product and runs a subscription app. Confirm with Tayo.
2. Want to learn more? Yes (inferred from the research run).
3. Still like it in 6–12 months? Likely. It is the same work as running Weight Class.
4. Adjacent areas: (a) paywall and pricing experiments for live apps; (b) ASO tracking and localization.
5. Why me: he runs a live subscription app on the App Store and goes through the same review, paywall and listing steps. No revenue or user figures are claimed here; none are on record.

## Step 4: Six-lens scorecard

Scored against candidate 1 as the reference ("is this stickier than #1?").

| Idea | Clarity | Usability | Stability | Scalability | Stickiness | Profitability | Total /30 |
|---|---:|---:|---:|---:|---:|---:|---:|
| **1. Indie / subscription app makers** | 4 | 4 | 4 | 5 | **2** | 4 | **23** |
| 2. Launch kit for any builder's users | 5 | 5 | 3 | 5 | **1** | **2** | 21 |
| 3. General AI mobile builder | 4 | 4 | 3 | 4 | 3 | **1** | 19 |
| 5. Agencies building client apps | 3 | 3 | 3 | **2** | 4 | 3 | 18 |
| 4. Shopify switchers $250K–2M | 4 | **2** | **2** | **2** | 4 | 3 | 17 |

Spread: 23 − 17 = **6 points**. Every row has a 1 or 2.

Why the low scores:
- **#1 Stickiness 2.** Most makers ship one app and stop. Only 17% of the 2025 RevenueCat cohort passed $1K MRR. Apps launched in 2025 or later earn 3% of subscription revenue (secondary coverage, see [demand-keywords.md §5](demand-keywords.md)).
- **#2 Stickiness 1, Profitability 2.** A listing kit is used once per launch. Free and cheap screenshot tools already exist (AppScreenshotStudio, Stora, Rork Screenshot Studio).
- **#3 Profitability 1.** Mobile-specific search is ~1,000/mo and falling. Generic "ai app builder" CPC is $34.62 and the top 10 is Base44, Replit, Anything, Figma. Rork raised $15M. Prices cluster at $20–25/mo.
- **#4 Usability 2.** Each brand needs its own Apple account and often a D-U-N-S number (1–3 weeks). Stability 2: store-app terms fell 25–79% YoY. Scalability 2: support hours per store.
- **#5 Scalability 2.** A small market that wants code export and control, where FlutterFlow and Claude Code/Cursor compete.

**#1 vs #2 (2 points apart).** The separating sentence: a launch kit alone is bought once per app and has a low price ceiling, while the builder keeps the maker for the next app and the next fix. So #2 is not a separate business. It is **the free front door to #1**.

## Step 5: Recommendation

**Indie and subscription app makers who build with AI, entered through a free App Store launch kit.**

Chain: AI build with paywall and onboarding → plus pre-flight and listing kit → app gets through review and gets found → makes money → Wealth. Score 23/30.

Why:
- Strongest demand in the study: **8.5/10**. About **7,200 US searches/mo** non-brand (clusters C + D). "revenuecat" 18,100/mo (+147% YoY). "app store screenshot generator" 590 (+69%). "how to publish an app on app store" 590 (+103%).
- Paid intent: **~49 tight Upwork posts in ~55 days** (ASO 17, publishing ~12, vibe-coded → store 9, screenshots 8, paywall 3). Lower bound.
- Market growth: RevenueCat counts **14,700 new subscription apps per month** (Jan 2026). App Store submissions +84% YoY in Q1 2026.
- Full feature fit: paywall, onboarding, keywords and screenshots already exist in App Builder.
- Founder-market fit: Tayo runs a live subscription app.

Runner-up: **#2 launch kit**. It lost on stickiness and profitability. It is kept as the acquisition wedge.

E-commerce stays a **template inside the builder**, not the niche.

Differentiator: read from [differentiators.md](differentiators.md). Verdict there: **NONE today, POSITIONAL target** (account-safe pre-flight with a 4.3 distinctness check). That target protects an indie maker's developer account, so it makes candidate #1 easier to defend than #3 or #4.

**Kill condition.** This recommendation is wrong if, in the 30-day test, fewer than 100 people use the free screenshot + keyword generator **and** 2 or fewer of 10 makers interviewed name review, listing or paywall as a top-2 problem (see [validation.md](validation.md)).

## Assumptions and Unknowns
- Inbound-advice source is UNKNOWN. Ask Tayo who asks him for help, and with what.
- "Likes doing it" is assumed.
- Tayo's audience size (followers, email list) is UNKNOWN. It affects the offer quadrant.
- Weight Class revenue, downloads and ratings are not on record and are not used.
- All search figures: US, Google Ads data, Oct 2024 – Sep 2026, from [demand-keywords.md](demand-keywords.md).
