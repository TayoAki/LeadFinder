# Validation: indie and subscription app makers (App Builder)

Date: 2026-11-10. Skill: `cmba-validate`. Built from existing research. New data: one small gap check (subreddit activity via treg, 7 calls, about $0.013). Nobody was contacted.

Reads: [idea.md](idea.md), [demand-keywords.md](demand-keywords.md), [competitors-and-rules.md](competitors-and-rules.md), [differentiators.md](differentiators.md).

## Falsifiable claim

> Indie founders who build subscription apps with AI tools currently lose days to months getting those apps through App Store review, paywall compliance and a findable listing, badly enough that they already spend money on it: paid builder tiers, ASO and screenshot tools, and freelancers on Upwork.

## Quantitative signals

| Signal | Source | Raw finding |
|---|---|---|
| Non-brand search intent, clusters C + D | DataForSEO via treg, US, Oct 2024 – Sep 2026 | ~7,200/mo (screenshots ~1,730, ASO ~1,740, publishing ~800, subscription app 880, onboarding ~510, paywall ~400) |
| "revenuecat" brand | same | 18,100/mo, +147% YoY; 90,500 global |
| "app store screenshot(s) generator" | same | 590/mo, +69%; 3,600 global (+84%) |
| "how to publish an app on app store" | same | 590/mo, +103%, CPC $19.73 |
| "ai mobile app builder" | same | 320/mo, **−49%** (evidence against the generic builder) |
| Upwork tight posts, ~55 days | Google-indexed sample | ~49: ASO 17, publishing/review ~12, vibe-coded → store 9, screenshots 8, paywall/onboarding 3. Lower bound. Budgets **not verified** (pages returned 403). |
| New subscription apps | RevenueCat State of Subscription Apps 2026 (secondary coverage) | ~14,700/month in Jan 2026, up from ~2,000 in Jan 2022 |
| App Store submissions | Sensor Tower via 9to5Mac | 235,800 in Q1 2026, +84% YoY |
| Revenue concentration | RevenueCat via ppc.land | Apps launched 2025+ earn 3% of revenue; 17% of the 2025 cohort passed $1K MRR (evidence against: most makers earn little) |

### Community volume (new gap check, treg `scrapecreators` subreddit details, 10 Nov 2026)

| Subreddit | Weekly active users | Weekly contributions | Self-promo rule (from sub rules) |
|---|---:|---:|---|
| r/vibecoding | 361,585 | 7,243 | "No low effort posts" |
| r/iOSProgramming | 82,265 | 934 | "Be civil" (check full rules before posting) |
| r/AppBusiness | 35,375 | 2,339 | Must be relevant to app business |
| r/reactnative | 27,779 | 545 | **"No self promotion"** |
| r/AppStoreOptimization | 11,262 | 685 | On-topic ASO only |
| r/indiehackers | 9,950 | 1,654 | Self-promote once, in the self-promotion slot |
| r/expo | 7,392 | 217 | Expo community guidelines |

Member totals were not returned. Weekly active users is the field the endpoint gave.

### Competitors and prices (existing spend)

| Product | Price | Status |
|---|---|---|
| Rork | Free (35 credits/mo, no publish), Pro $20/mo for 100 credits, Max $200–1,800/mo; AI App Store Reviewer needs a paid plan | Verified in docs and on rork.com/ai-reviewer, 10 Nov 2026 |
| Vibecode | Plus $20, Pro $50, Max $200/mo | Verified in docs |
| Anything | Pro $19/mo, Max $199/mo | Verified on pricing page |
| Superapp | Pro $25 (50 credits), Business $50 (110), Max $100 (230) | Fetched superapp.dev, 10 Nov 2026 |
| Newly | From $25/mo for 100 credits | Fetched newly.app, 10 Nov 2026 |
| Expo Launch | Free beta; price not stated | Fetched Expo blog |
| Upwork ASO / screenshot / publishing freelancers | Budgets not verified | ~49 posts |

Someone is already paying. That is the strongest single signal.

### Search-intent questions (from the keyword set)
1. How to publish an app on the App Store?
2. How to publish an app to the App Store with Expo?
3. Why did Apple reject my app?
4. What is guideline 4.3 spam?
5. How to make App Store screenshots?
6. What size are App Store screenshots?
7. Hard paywall or freemium?
8. How to price a subscription app?
9. How to add a paywall with RevenueCat?
10. How to get a Lovable or Replit app into the App Store?
11. How to make money with apps?
12. What App Store keywords should I use?

### Alerts to leave running (free)
- Google Alerts: `"app store" "rejected" "vibe coded"`, `"guideline 4.3" spam app`, `"app store screenshots" generator`, `"revenuecat" paywall rejected`.
- Reddit search RSS (sort=new) on r/vibecoding, r/iOSProgramming, r/AppBusiness for: `rejected`, `4.3`, `screenshots`, `paywall`, `App Store Connect`.
- X: the native saved search for `"app store" rejected (rork OR vibecode OR replit OR lovable)`, checked weekly. Do not buy X Pro ($40/mo).

## Qualitative signals

### Verbatim quotes (copied from the research files; links there)
> "I get hired to finish vibe-coded apps. They almost always break in the same places right before the App Store" — r/AppBusiness, 297 upvotes, 6 Nov 2026

> "Vibe coding got me a working app in weeks. Apple review took 3 months and 10+ rejections" — r/vibecoding

> "After 4 months of vibecoding and 9 rejections…" — r/vibecoding

> "Got rejected multiple times. Here's the dumb stuff" — r/vibecoding, 102 upvotes

> "context degrades fast once the app grows beyond a handful of screens… failed after spending ~$500… App Store submission… completely unaddressed." — r/AskVibecoders ("Rork works great. until you try to ship an actual app")

> "Rejected ~48 hours later" — r/vibecoding

> "nobody uses your vibecoded apps" — r/vibecoding, 519 upvotes, 363 comments

> "60+ paid credits forfeited" — r/reactnative (about Rork)

> Lovable, Bolt and similar tools "produce mobile friendly web apps, not iOS apps submitted to the store" — r/vibecoding

Paywall threads exist (r/AppBusiness: "Hard paywall or freemium for my app", "Pricing a consumer subscription app for the first time"), but no strong verbatim pain line was captured. Paywall pain is **weaker** than review pain.

### 30-for-30 targets (do NOT contact without Tayo's go-ahead)

The exchange: 30 minutes learning their launch problems, then 30 minutes running a free pre-flight and listing review on their app.

| Person/account | Where they said it | Opener |
|---|---|---|
| Poster of "Apple review took 3 months and 10+ rejections" | [r/vibecoding 1vpf5sp](https://www.reddit.com/r/vibecoding/comments/1vpf5sp/) | "Which rejection cost you the most time, and what would have caught it earlier?" |
| Poster of "After 4 months… 9 rejections" | [r/vibecoding 1u6natt](https://www.reddit.com/r/vibecoding/comments/1u6natt/) | "If you could re-run one check before submitting, which would it be?" |
| Poster of "Got rejected multiple times. Here's the dumb stuff" | [r/vibecoding 1q7q67h](https://www.reddit.com/r/vibecoding/comments/1q7q67h/) | "Would a checklist tied to guideline numbers have saved a round?" |
| Poster of "Apple rejected my first App Store submission" | [r/vibecoding 1srukox](https://www.reddit.com/r/vibecoding/comments/1srukox/) | "What did the rejection note say, and how did you fix it?" |
| Poster of the 4.3(a) rejection after adding a RevenueCat remote paywall | [r/iOSProgramming 1w9ojf7](https://www.reddit.com/r/iOSProgramming/comments/1w9ojf7/) | "What did you change for the appeal to succeed?" |
| Poster of "Apple rejected my app for spam" | [r/iOSProgramming 1q4rljp](https://www.reddit.com/r/iOSProgramming/comments/1q4rljp/) | "Did Apple ever say what it looked similar to?" |
| Poster of "Rork works great. until you try to ship" | [r/AskVibecoders 1rstlou](https://www.reddit.com/r/AskVibecoders/comments/1rstlou/) | "Where did the ~$500 go: building, fixing, or shipping?" |
| Poster of "Pricing a consumer subscription app for the first time" | [r/AppBusiness 1x93ywo](https://www.reddit.com/r/AppBusiness/comments/1x93ywo/) | "Did you pick a hard paywall or freemium, and why?" |
| Expo dev who finishes vibe-coded apps (a possible **partner**, not a buyer) | [r/AppBusiness 1xpj41x](https://www.reddit.com/r/AppBusiness/comments/1xpj41x/) | "Which of your fixes could a tool catch before you're hired?" |

That is 8 reachable buyers plus 1 partner. Usernames were not recorded in the research files; open the thread to find them.

## Survey instrument (copy-paste; place after the free generator download)

1. Where is your app right now? ○ Idea ○ Building ○ Built, not submitted ○ Submitted / in review ○ Live, under $1K MRR ○ Live, $1K+ MRR
2. What did you build it with? ○ Rork ○ Vibecode ○ Replit ○ Lovable / Bolt + wrapper ○ Cursor / Claude Code ○ Xcode / by hand ○ Other
3. **What is your biggest challenge getting the app live and earning?** ○ Getting through App Store review ○ Setting up subscriptions / the paywall ○ Screenshots and the store listing ○ Getting anyone to find or download it ○ The app breaks as it grows ○ Other: ____
4. How many App Store rejections have you had on this app? ○ 0 ○ 1 ○ 2–3 ○ 4+ ○ Not submitted yet
5. How many apps do you plan to ship in the next 12 months? ○ 1 ○ 2–3 ○ 4–10 ○ 10+
6. What have you already paid for? (tick all) ○ AI builder plan ○ RevenueCat / Superwall ○ ASO or screenshot tool ○ Freelancer ○ Nothing yet
7. If you could get help, which would you pick? ○ A tool I run myself ○ A tool plus a 1-hour session ○ Someone submits it with me ○ A course
8. (Open) What is the one thing that would make you confident hitting "Submit for Review"?

## Verdict: AMBER (pivot stated)

Not GREEN, for one reason: the preferred **format** may differ from the plan. The strongest paid signal (~49 Upwork posts) is people hiring a **human** to publish, fix review and do ASO, not buying a tool. That matches the AMBER rule: "preferred solution format differs from what's planned."

**Stated pivot:** sell the tool **and** a small done-with-you launch service (see [offer.md](offer.md)). Use the service calls as the 30-for-30 research.

Evidence for:
- Pain in the audience's own words (quotes above, up to 519 upvotes).
- Existing spend: builders at $19–200+/mo, paid review checker at Rork, ~49 freelancer posts.
- 8+ reachable people, plus communities with 10K–360K weekly active users.
- Growing intent: publishing +103%, screenshots +69%, RevenueCat +147%.

Evidence against:
- Most new apps earn little: 2025+ apps take 3% of revenue; 17% of the 2025 cohort pass $1K MRR. Low willingness to pay and high churn are likely.
- Generic mobile-builder search is falling (−49%).
- Rork, Superapp and Newly already sell rejection checks, screenshots and listing help (see [differentiators.md](differentiators.md)). The pain is real, and so is the competition.
- Free Expo Launch makes basic submission free.
- No interview data yet. Upwork budgets are unverified.

### Thresholds for the 30-day test (set before running it)

| Metric | GREEN if | RED (kill / rethink) if |
|---|---|---|
| Free generator uses (screenshot + keyword) | ≥300 | <100 |
| Generator users who leave an email | ≥25% | <10% |
| Of those, who start an app in App Builder | ≥10% | <3% |
| 30-for-30 calls where review, listing or paywall is a top-2 pain | ≥6 of 10 | ≤2 of 10 |
| Paid launch-service bookings | ≥2 | 0 |
| Survey Q3 answers naming review or listing | ≥40% | <20% |

These thresholds are judgement calls, not benchmarks. No conversion benchmark for this exact funnel was found.

**The single cheapest next test:** ship the free App Store screenshot + keyword generator (both features already exist) with an email gate on download, and post it once in r/AppBusiness and r/indiehackers in their allowed slots.

## 30-day validation plan (Tayo runs it; nothing has been posted or sent)

| Week | Action | Cost |
|---|---|---|
| 1 | Publish the free screenshot + keyword generator page. Works on uploaded screens from any app. Email to download. Add the survey after download. Publish "App Store rejection checklist for AI-built apps" (2.1, 3.1.1/3.1.2, 4.2, 4.3, 4.8, 5.1.1) as a page. Set the alerts above. | Build time only |
| 2 | Tayo posts once, as himself, in r/AppBusiness and r/indiehackers (self-promo slot): what he learned shipping Weight Class's paywall and screenshots, with the free tool linked. No posting in r/reactnative (no self-promo). Answer rejection threads in r/vibecoding with the checklist, without links where rules forbid them. | $0 |
| 2–3 | 30-for-30: message the 8 posters above, if Tayo approves. Offer a free manual pre-flight and listing review. Record their words. | ~10 h |
| 3 | Put up a "Launch with me" page at the price in [offer.md](offer.md), with a booking link. Count bookings, not clicks. | $0 |
| 3–4 | Upwork-style ask check: re-run the `site:upwork.com/freelance-jobs/apply` queries for "App Store screenshots", "ASO", "publish app store" to see whether the ~49 posts hold. Read only; do not bid. | ~$0.03 treg |
| 4 | Score against the threshold table. Decide: keep, pivot to service-led, or stop. | — |

## Assumptions and Unknowns
- Upwork counts are a Google-indexed sample. Budgets are unverified.
- RevenueCat figures come from secondary coverage, not the full report.
- Subreddit figures are weekly active users from one provider on one day.
- The 30-for-30 targets are anonymous threads. Usernames are not recorded.
- GAP: Discord and Slack communities (Expo Discord, RevenueCat community) were not checked. Human task: note member counts and whether launch questions get asked weekly.
