# Buyer check: the small or new Shopify store owner who wants a mobile app

Date: 2026-11-10. Buyer: "I started a Shopify store, now I want a mobile app." Offer under test: the user's AI app builder (Expo/React Native), tailored so these owners get a branded iOS app fast and cheap.

Read with: [competitors-and-rules.md](competitors-and-rules.md) (prices, Apple/Google rules) and the Gate 0 rules in `../github-repo-offers/METHOD.md`.

Labels: **Verified** = I read it on the primary page today. **Reported** = third-party page, not checked at the source. **Unverified** = weak or conflicting source. **GAP** = I could not get it; a human should.

---

## Falsifiable claim (cmba-validate step 1)

> Small or new Shopify store owners (under ~$1M/yr) want a branded iOS app badly enough that 20+ of them ask for one in public every 30–60 days, and they already pay (or try to pay) $50–150/mo for it.

**Result: the claim fails.** I found 5 tight asks in 12 months on Reddit, none in the last 90 days, and most replies tell small stores *not* to build an app. Details below.

---

## 1. Who these owners are, and how many

| Signal | Number | Source | Status |
|---|---|---|---|
| Live Shopify stores | **3,245,947** (Nov 6 2026). 2026 Q2 2,867,778 → Q3 3,108,808 → Q4-to-date 3,245,949 | [StoreLeads Shopify report](https://storeleads.app/reports/shopify) | Verified |
| Net growth | +15% YoY in Q3 2026; about +241k net stores Q2→Q3 | same | Verified (net, not gross new stores) |
| Gross new-store creation rate | Not published by StoreLeads | — | GAP |
| Shopify Plus domains | 83,160 | same | Verified |
| Share of stores by revenue | Under $100K ≈ 90%; $100K–$999K ≈ 6–7%; $1M+ ≈ 3% | [Popupsmart community post](https://community.popupsmart.com/t/shopify-statistics-global-shopify-snapshot-2025/332), likely from BuiltWith revenue tiers (Jan 2025) | Unverified (BuiltWith blocked my fetch) |
| Implied count | ~2.9M stores under $100K; ~200K stores at $100K–$1M; ~100K at $1M+ | my arithmetic on the two rows above | Estimate |
| Shopify GMV 2025 | $378.4B, +29% | [Shopify 10-K FY2025](https://www.sec.gov/Archives/edgar/data/1594805/000159480526000007/shop-20251231.htm) (search snippet) | Reported |

**How many already have an app** (StoreLeads detection, updated Nov 6 2026; detection undercounts, e.g. OneMobile has 366 reviews but only 320 detected installs):

| Builder | Stores detected | Trend | Most common store size (by product count) | Source |
|---|---|---|---|---|
| Tapcart | **2,302** | — | 250–999 products (710 stores) | [StoreLeads](https://storeleads.app/reports/shopify/app/shopify-mobile-apps) |
| Shopney | **696** | — | 250–999 (29%) and 1,000–4,999 (29%) | [StoreLeads](https://storeleads.app/reports/shopify/app/shopney-mobile-app) |
| OneMobile | **320** | +471% YoY | 250–999 (92 stores) | [StoreLeads](https://storeleads.app/reports/shopify/app/onemobile) |
| Plobal | **235** | −19% YoY | 100–249 (23%) | [StoreLeads](https://storeleads.app/reports/shopify/app/plobalapps-mobile-application) |

What this says:
- Even summed, the four biggest builders show up on **~3,500 stores, about 0.1%** of 3.2M. Apps are a big-catalog, established-brand thing today.
- Their users skew to **250+ products**. That is not the "I just started a store" profile.
- "Shop with [brand]" App Store pattern count: not done. GAP (needs an App Store search tool; treg's App Store listing endpoint costs $0.60/call, over budget for this).

**Who the small buyer is in practice:** ~200K stores at $100K–$1M/yr. The ~2.9M under $100K are mostly side hustles and dropshippers with one-time buyers. They are the "new store owner" in the prompt, and they are the wrong buyer.

---

## 2. Do small or new owners actually ask for an app?

Method: 14 Reddit searches via treg (`anyapi.reddit.search`, past year, relevance) and the comments on 9 key threads (`crawl4ai.reddit.post.comments`). 271 unique posts; 105 mentioned apps; I read every one that might be an owner asking.

### Count

| Type | Count (12 months) | Count (last 90 days) |
|---|---|---|
| **Tight** (owner wants an app for their own store) | **5** | **0** |
| Loose (general "is it worth it?", researcher or vendor posts, non-Shopify) | ~10 | ~1 |
| Anti-ask (owner with an app thinking of dropping it) | 1 | 0 |

Gate 0 needs 20+ tight asks in 30–60 days. This is about **1 every 2–3 months**.

### The tight asks

| Date | Post | Owner / size | What they want | Budget |
|---|---|---|---|---|
| 2026-01-06 | [Best app to convert shopify store to mobile app?](https://www.reddit.com/r/shopify/comments/1q5bw1x/) (86 comments) | "community based and social first company". Revenue not stated. | Basics now, custom features later. No templates, no agency. | **"Budget is around $1000/month."** Chose Appbrew. |
| 2026-01-28 | [Looking for shopify mobile app builder recommendations](https://www.reddit.com/r/shopify/comments/1qpngj1/) (42 comments) | "DTC brand (physical products, decent repeat rate)" | Retention: post-purchase, push, loyalty | Not stated. Considering Appbrew and Tapcart. |
| 2026-04-04 | [Which Shopify app builders is the best value for money?](https://www.reddit.com/r/shopify_growth/comments/1sce8kt/) | "for my own brand and other purposes" | Value comparison of Tapcart, MobiLoud, Shopney, Appbrew | Not stated |
| 2026-06-10 | [turning my Shopify store into a mobile app what's actually worth it?](https://www.reddit.com/r/nocode/comments/1u27bel/) (35 comments) | **Small clothing brand, "one person operation with a part time VA"** | Better mobile checkout, less cart abandonment | Builders at "$200-400/mo which adds up"; $40–50k custom "completely out of the question" |
| 2026-06-28 | [Apple Store commission fees on sales?](https://www.reddit.com/r/shopify/comments/1uhpvrh/) | Store owner, size not stated | Wants to use a Shopify app builder; worried Apple takes 15–30% | Not stated |

Anti-ask: [App or no app?](https://www.reddit.com/r/shopify/comments/1r45jlg/) (2026-02-14): "We use Tapcart for our app and its fine and makes money but it feels like one extra thing I need to update. Thinking of getting rid of it."

Loose and seeded posts I excluded from the tight count: [1ra39p8](https://www.reddit.com/r/shopify/comments/1ra39p8/) (vendor promoting Wrapply), [1qq5gqn](https://www.reddit.com/r/shopify/comments/1qq5gqn/) (founder-style "have you thought about an app"), [1ur1gpf](https://www.reddit.com/r/shopify_growth/comments/1ur1gpf/) (reads like Appbrew seeding), [1rnyxp9](https://www.reddit.com/r/shopify_growth/comments/1rnyxp9/), [1rropyo](https://www.reddit.com/r/shopify_growth/comments/1rropyo/), [1qkk0vc](https://www.reddit.com/r/ShopifyWebsites/comments/1qkk0vc/) (researchers), [1sl7wru](https://www.reddit.com/r/AskReddit/comments/1sl7wru/) (no body text). Note: many threads are full of builder founders (Vegacart, Napps, OneMobile fans, "$99/mo" offers). **More sellers than buyers show up in these threads.**

### Motivations (owners' own words)

| Motivation | Quote |
|---|---|
| Retention / repeat buyers | "thinking about building an app mainly for retention, things like better post-purchase experience, push notifications, loyalty" ([1qpngj1](https://www.reddit.com/r/shopify/comments/1qpngj1/)) |
| Push as a hedge vs email | "I've always thought the push notifications were a good way to hedge your bets vs email only." ([1r45jlg](https://www.reddit.com/r/shopify/comments/1r45jlg/)) |
| Email getting crowded | "I thought about getting an app mainly for retention as my email was getting crowded… the customers who downloaded it did buy more often." ([1qkk0vc](https://www.reddit.com/r/ShopifyWebsites/comments/1qkk0vc/), commenter later identified as a Vegacart founder, so biased) |
| Mobile checkout pain | "half our traffic is mobile and the cart abandonment rate is painful to look at" ([1u27bel](https://www.reddit.com/r/nocode/comments/1u27bel/)) |
| Looking legit | Not found from owners. A builder founder warned against it: "only build an app when your customers are demanding it, not because it looks legit." ([1rropyo](https://www.reddit.com/r/shopify_growth/comments/1rropyo/)) |
| App-only drops | Only from vendors ("offer app-only discounts or early access to drops", [1ra39p8](https://www.reddit.com/r/shopify/comments/1ra39p8/)) |
| Lower ad costs | Only from vendors ("your ad budget is constantly challenged by Meta", [1u27bel](https://www.reddit.com/r/nocode/comments/1u27bel/)) |

### Objections (much louder than the motivations)

| Objection | Quote |
|---|---|
| Nobody will download it | "No, you don't need an app. Only large, household name websites have them. Virtually no one is going to download your app." ([1r45jlg](https://www.reddit.com/r/shopify/comments/1r45jlg/)) |
| Funnel math | "It's one thing to get a customer to shop, another to get them to shop more than once, another to get them to download app, and yet another to get them to use it enough to justify it." ([1r45jlg](https://www.reddit.com/r/shopify/comments/1r45jlg/)) |
| Customers hate store apps | "Speaking as a customer, I absolutely HATE when I have to install an app… If they offered a discount I might download it, make the one purchase, then offload or uninstall it." ([1ra39p8](https://www.reddit.com/r/shopify/comments/1ra39p8/)) |
| Too early for ad-driven, one-time-buyer stores | "Most of my sales were coming from paid ads and one time buyers, so an app felt a bit premature." ([1qkk0vc](https://www.reddit.com/r/ShopifyWebsites/comments/1qkk0vc/)) |
| Cost | "$200-400/mo which adds up" ([1u27bel](https://www.reddit.com/r/nocode/comments/1u27bel/)); "The biggest blocker was cost and I wasn't sure it would pay off" ([1qkk0vc](https://www.reddit.com/r/ShopifyWebsites/comments/1qkk0vc/)) |
| Traffic threshold | "Do you have 30k visitors per day for the app to worth the costs?" ([1q5bw1x](https://www.reddit.com/r/shopify/comments/1q5bw1x/)) |
| Maintenance | "feels like one extra thing I need to update" ([1r45jlg](https://www.reddit.com/r/shopify/comments/1r45jlg/)) |
| Apple fee fear | "does that mean we have to pay Apple / Google commission for each sale made through the app?" ([1uhpvrh](https://www.reddit.com/r/shopify/comments/1uhpvrh/)). Answered in-thread: physical goods use Shopify checkout, no Apple cut. |
| Apple account hassle | Not raised by owners in these threads. The OneMobile reply to a reviewer notes the $99/yr Apple and $25 Google fees. |
| Consumer backlash | "Not every store needs an app." r/PetPeeves, 107 upvotes ([1soifn9](https://www.reddit.com/r/PetPeeves/comments/1soifn9/)); [Why Does Every Store Have An App?](https://www.reddit.com/r/NoStupidQuestions/comments/1vpc0as/) |

### Not covered (GAPs)
- **Shopify Community forums:** search found only older threads ([2023 "Who can help create an iOS app"](https://community.shopify.com/t/who-can-help-create-an-ios-app-for-my-online-store/265938/1), [older "Can we develop a mobile app"](https://community.shopify.com/t/can-we-develop-a-mobile-app-for-our-online-store/127780)). A human should search the "Shopify Apps" board for 2026 posts.
- **Facebook groups and X:** not reachable with my tools. GAP.
- My Reddit tool returns about 25 posts per query by relevance, so it can miss posts. Even doubling the count does not get close to 20 per month.

---

## 3. Willingness to pay

| Signal | Evidence |
|---|---|
| What a small owner says | $200–400/mo "adds up" for a one-person brand ([1u27bel](https://www.reddit.com/r/nocode/comments/1u27bel/)). A dev offered "$200. One time fee" in the same thread. |
| What a funded DTC brand says | "Budget is around $1000/month" (bought Appbrew) ([1q5bw1x](https://www.reddit.com/r/shopify/comments/1q5bw1x/)) |
| What a large brand paid | "cost about 13k so far. total app sales are just under 100k in app… we did it once we got to 40m a year in sales" ([1rnyxp9](https://www.reddit.com/r/shopify_growth/comments/1rnyxp9/)). App sales = ~0.25% of revenue. |
| Fee model preference | "the revenue share can get pretty painful once your sales start picking up. A fixed monthly fee is easier to plan for." ([1u27bel](https://www.reddit.com/r/nocode/comments/1u27bel/)) |
| Cheapest real offers today | OneMobile free / $99 + 2.9% above $2K app revenue; Plobal free + 3%; Hulk $79; Shopney $149; MageNative "from $49" (reported, [roundup](https://shopcircle.co/blogs/top-apps/top-5-mobile-app-builder-apps-for-shopify-in-2026)). |

**Complaints on the cheap tiers** (Shopify App Store, lowest-rated reviews, read today):

OneMobile, 4.8 (366): 6 one-star, 1 two-star ([reviews](https://apps.shopify.com/onemobile/reviews?ratings%5B%5D=1&ratings%5B%5D=2)):
- Mini Paperclip (Kuwait, Aug 2026): "Going from 29$ to 99$ monthly with fees per every order AND infrastructure fee is crazy."
- Crystals & Coffee (US, Jun 2026): "they raised my MONTHLY rate from $29 to $99!"
- JaipurFabric (India, Feb 2026): "clicking it secretly upgraded my plan from $25 to $99/month."
- Ohhseauxcute (US, Apr 2026): "Over priced and consistent billing issues."
- RetailXcess (US, 2024): "You must sign up for their subscription package in order to be able to submit your app for approval." (The free plan has no native app.)

Plobal, 4.8 (148) ([reviews](https://apps.shopify.com/plobalapps-mobile-application/reviews?ratings%5B%5D=1&ratings%5B%5D=2)): one merchant said Plobal declined them: "we only work with sellers with +2.5 million of revenue per year" (2022). Another: "Even our friends refused to install the APP" (2017).

Shopney, 5.0 (775) ([reviews](https://apps.shopify.com/shopney-mobile-app/reviews?ratings%5B%5D=1&ratings%5B%5D=2&ratings%5B%5D=3)): few complaints. One about margin: "WE ARE MAKING LESS PROFTI AS WE ARE GIVING CLIENTS DISCOUNST TO PLACE ORDERS THROUGHT THE APP" (UK, Nov 2025). One "Haven't published an app yet" after 8 months.

Vajro/Superfans: listing is no longer on the Shopify App Store (see competitors file).

**Read:** the cheap end is where the anger is: price jumps from $25–29 to $99, % fees, and upsells. The ceiling a small owner tolerates looks like **~$29–99/mo flat**. Above $99, only stores with real repeat revenue stay.

---

## 4. When an app is worth it for a small store

No independent study found. The best evidence is practitioners in threads (some are vendors; marked).

| Rule of thumb | Source |
|---|---|
| "apps work when repeat rate is already above 20%, the top 10% of buyers drive 40%+ of revenue, the category has natural cadence (fashion drops, jewelry restocks, beauty replenishment, sneaker launches), and the founder is willing to push 2+ times a week for six months — if not, don't build. Apps flop when it's a single-SKU or low-frequency category" | [1qkk0vc](https://www.reddit.com/r/ShopifyWebsites/comments/1qkk0vc/), says they "work with a bunch of brands running apps" |
| "below 2-3k repeat customers/month it gets tricky… you just don't get enough installs to see meaningful data" | [1ra39p8](https://www.reddit.com/r/shopify/comments/1ra39p8/), a studio building in this space (biased) |
| "your customers login at least 3-4 times at week into your shop? If not, don't even bother." | [1rnyxp9](https://www.reddit.com/r/shopify_growth/comments/1rnyxp9/) |
| "For small stores, they're often more hassle than value unless you already have a loyal audience." | [1qkk0vc](https://www.reddit.com/r/ShopifyWebsites/comments/1qkk0vc/) |

**Push vs email/SMS economics:**
- Push to app users is close to free per message (Apple/Google push). Email: Klaviyo is about **$20/mo for 500 contacts**; SMS from about $15/mo more ([reported](https://www.firstpier.com/resources/sms-klaviyo-pricing)). Postscript Starter: $0 plan, **$49/mo minimum**, ~$0.009/SMS plus carrier fees ([Postscript pricing](https://postscript.io/pricing), reported).
- Push opt-in: iOS ~56% (Batch 2025, [reported](https://www.pushwoosh.com/blog/push-notification-benchmarks/)); Airship 2021 median iOS 51% (29–73% by vertical). Unverified.
- **App download rate from a store's customers:** no benchmark found. GAP.
- Worked example (assumptions, not data): a store with 2,000 customers a year. If 10% install (assumed) and 55% allow push, that's ~110 reachable people. 110 SMS cost ~$1.50 per send. An app at $49–99/mo only pays if it lifts repeat orders, not because push is cheaper.

**Honest read:** most small and all new stores should not have an app yet. The case starts at roughly **$250K+/yr, 20%+ repeat rate, and a cadence category** (beauty refills, supplements, coffee, pet food, apparel drops, jewelry restocks). The ~2.9M stores under $100K are mostly not that.

---

## 5. Friction for a new owner

| Step | Fact | Source | Can a builder smooth it? |
|---|---|---|---|
| Apple account, individual | $99/yr. Legal name, 2FA, no P.O. box. **Your legal name shows as the seller.** | [Apple enroll](https://developer.apple.com/programs/enroll/) (Verified) | Partly: a checklist and walkthrough. The owner must enroll and pay. Many brands won't want their personal name on the listing. |
| Apple account, organization | Legal entity (no DBAs or trade names), domain email, a functional public website, **D-U-N-S number** | [Apple enroll](https://developer.apple.com/programs/enroll/) (Verified) | Partly: guided D-U-N-S lookup and request, and pre-checks (domain email, website). Cannot form the LLC or speed up D&B. |
| D-U-N-S timing | Free. "Allow up to 5 business days" from D&B, then "up to 2 business days" for Apple. Expediting does not help. | [Apple D-U-N-S](https://developer.apple.com/support/D-U-N-S/) (Verified) | No. ~1–2 weeks before enrollment can even start, plus Apple's own verification. |
| 4.2.6 | The brand must submit under its own account. The builder cannot publish for them. | Apple guidelines (see competitors file) | Yes: App Store Connect API key or team invite, so the builder uploads builds into the brand's account. |
| App review | "at least 50% of submissions in less than 24 hours and 90% in less than 48 hours" | [Apple App Review](https://developer.apple.com/distribute/app-review/) (Verified) | Partly: pre-flight checks (no crash, demo login, account deletion, privacy links, real screenshots). Cannot promise approval. |
| 4.2 minimum functionality | A pure webview risks rejection | Apple guidelines | Yes: ship native cart, wishlist, push, account, order tracking, app-only offers by default. |
| Google Play, personal account | New personal accounts (after 13 Nov 2023) need "a minimum of 12 testers who have been opted in continuously for at least 14 days" | [Play help](https://support.google.com/googleplay/android-developer/answer/14151465) (Verified) | Partly: steer to organization accounts (D-U-N-S again), or launch iOS first. Builders must not supply fake testers. |
| Store listing | Screenshots, description, keywords | — | Yes: the user's builder already generates these. A Tapcart reviewer had to "make my own screenshots." |
| Ongoing upkeep | "one extra thing I need to update" | [1r45jlg](https://www.reddit.com/r/shopify/comments/1r45jlg/) | Yes: auto-sync catalog, OTA updates (Expo), yearly renewal reminders. |

**Net:** "instant" is not possible for a new owner. Real time to live is about **1–3 weeks** for an organization (D-U-N-S + enrollment + review), or a few days for an individual who accepts their own name as seller. "Live in 7 days" is a fair promise only for the individual path or for brands that already have a D-U-N-S number.

---

## 6. Keyword signals (US, Serpstat via treg, Nov 2026)

| Keyword | Volume/mo | CPC | Comment |
|---|---|---|---|
| shopify mobile app | 480 | $141.57 | CPC looks like an outlier (Serpstat). Intent is mixed: many want Shopify's own admin app. |
| shopify mobile app builder | 210 | $5.32 | Clearest buyer keyword |
| shopify app builder | 170 | $11.63 | Mixed with developers building Shopify apps |
| tapcart | 880 | $8.88 | Brand search; the category leader's demand |
| tapcart pricing | 20 | $12.06 | |
| mobile app for shopify store | 30 | $3.18 | |
| plobal apps | 30 | $7.15 | |
| convert shopify store to app | 20 | $3.66 | |
| shopify ios app | 20 | — | |
| shopify app maker | 20 | — | |
| turn shopify store into app / create app for shopify store / shopify app for my store | 10 each | — | |
| free shopify mobile app, cheap shopify app, mobile app for my shopify store, shopney, shopify mobile app builder free | no data (below threshold) | — | **Nobody searches "cheap" or "free" versions.** |
| shopify store app (14,800), shopify to app (8,100) | — | — | Navigational: people looking for Shopify's own app. Excluded. |

Total clear buyer intent: **roughly 300–500 searches/month in the US**, plus ~900 for "tapcart". That is small. The "cheap/free" angle has no search demand.

`demand-keywords.md` (the parallel keyword agent's file) did not exist when I finished, so there is nothing to reconcile.

---

## 7. Verdict (Gate 0)

| Check | Result | Evidence |
|---|---|---|
| 1. Buyers asking (20+ in 30–60 days) | ❌ **Fail** | 5 tight asks in 12 months, 0 in the last 90 days. Replies mostly say "don't." Keywords for cheap/free: none. |
| 2. Competitors with public prices | ⚠️ Pass, but saturated | 111 apps in the category. Cheap tier already exists: OneMobile free/$99, Plobal free + 3%, Hulk $79, MageNative from $49 (reported). |
| 3. Margin ≥50% | ✅ Pass at $49–99/mo with a setup fee (see math) | |
| 4. Named watering holes | ✅ Pass | See the plan below |

**Verdict for "small or new Shopify store owner": ❌ REJECT** on Check 1. The buyer as described (new store, wants an app) mostly should not buy one, rarely asks, and is already served by free/cheap tiers with % fees.

**Better angle: 🟡 RESEARCH SLOT** for a narrower buyer where the money signal is real (people already pay $99–1,000/mo, and cheap-tier users are angry at price jumps and % fees).

### The sharpest version

**Sub-segment:** Shopify stores at **$250K–$2M/yr** with **20%+ repeat rate** and **1,000+ repeat customers**, in cadence categories: **beauty and skincare refills, supplements, coffee, pet food, apparel and jewelry drops**. Best first targets: stores **already on OneMobile, Plobal, Shopney or Hulk** who are hit by price jumps or % fees (switchers already believe in apps; you don't have to sell the category).

**Promise:** "Your own branded iOS app, built from your store in an hour, live in the App Store in about 7 days. $79/mo flat. No % of sales. We walk you through Apple." (Say "about 7 days if you already have a D-U-N-S number; 2–3 weeks if not.")

**Price:** **$79/mo flat** (annual $790), plus an optional **$199 "launch" fee** that covers guided Apple enrollment and the first submission. Cheaper than Shopney ($149), Appbrew ($199), Tapcart ($500), and no fee like OneMobile (+2.9%) or Plobal (+3%). Above the $49 MageNative floor, justified by done-with-you launch and AI generation.

**Margin math (assumptions, not data):**
- Revenue per customer, year 1: $199 + 12 × $79 = $1,147.
- Costs: onboarding 3 h × $50 = $150; ongoing support 0.5 h/mo × $50 × 12 = $300; builds, push, hosting ~$5/mo × 12 = $60 (EAS/Expo push costs unverified). Total $510.
- Gross margin year 1 ≈ (1,147 − 510) / 1,147 ≈ **56%**. Without the setup fee: (948 − 510) / 948 ≈ 46%. So keep the setup fee or push to annual plans.

**What's native so it passes 4.2:** native product pages and cart (Shopify Storefront API), Shopify checkout (no Apple cut under 3.1.3(e)), push (back-in-stock, drop alerts, abandoned cart), wishlist, **one-tap reorder** for refills, order tracking and account, **app-only drops/early access and app-only discount codes**, loyalty points display (Smile/Yotpo hooks). No pure webview.

**How AI makes it fast:** read the store's theme colors, fonts, logo, collections and best sellers, then generate the home screen, tab bar and collection layouts. Generate push templates for their actual products ("Your [product] is back"). Generate the App Store listing: name, subtitle, keywords, description and screenshots from real catalog images (the builder already does metadata and screenshots).

**Onboarding that handles Apple:** a step-by-step wizard. It asks: entity or individual? Do you have a D-U-N-S number? (Lookup link.) Is your email on your domain? Is your website live? It warns that an individual account shows the owner's legal name. Then: connect App Store Connect with an API key; TestFlight build to the owner's phone the same day; pre-flight checks (crash-free, demo login, privacy and account deletion, real screenshots); one-click submit from the owner's account (4.2.6). Android second, with an organization account to avoid the 12-tester rule.

**Install-rate kit (the real blocker):** QR code and banner on the site, "app-only 10% off first app order," and an email/SMS flow to existing repeat buyers via Klaviyo. Without this, small-store apps fail on downloads.

### First 50 customers
1. **Switchers from cheap tiers.** StoreLeads lists stores with OneMobile (320), Plobal (235), Shopney (696), Hulk installs. Public 1–2 star reviewers on the [OneMobile](https://apps.shopify.com/onemobile/reviews?ratings%5B%5D=1&ratings%5B%5D=2) listing describe exactly this pain (e.g. Mini Paperclip, Crystals & Coffee, Ohhseauxcute). Offer migration of the existing app listing.
2. **Shopify App Store listing** in the [Mobile app builder category](https://apps.shopify.com/categories/store-design-storefronts-mobile-app-builder/all). This is where merchants shop; keyword volume is small, so this listing matters more than SEO.
3. **Reddit threads where owners ask:** r/shopify, r/shopify_growth, r/ShopifyeCommerce, r/ecommerce, r/nocode. Answer honestly ("you probably don't need an app unless…"). Note: r/shopify's AutoModerator bans soliciting, so be helpful, not salesy.
4. **Shopify Community** "Shopify Apps" board. GAP: check activity first.
5. **Category partners:** Klaviyo, Smile/Yotpo loyalty and Recharge subscription users (the cadence categories). Agencies in the Shopify Partners directory for white-label.
6. Facebook groups for Shopify owners: not verified. GAP.

**30-for-30 targets** (public posters; do not contact without the user's go-ahead):

| Poster | Where | Opener |
|---|---|---|
| Poster of | [r/nocode 1u27bel](https://www.reddit.com/r/nocode/comments/1u27bel/) | "Did you end up launching an app for the clothing brand, and what would a fair flat price be?" |
| Poster of | [r/shopify 1qpngj1](https://www.reddit.com/r/shopify/comments/1qpngj1/) | "What retention numbers would make an app worth it for you?" |
| Poster of | [r/shopify 1r45jlg](https://www.reddit.com/r/shopify/comments/1r45jlg/) | "What would make keeping the app worth it vs dropping Tapcart?" |
| Poster of | [r/shopify 1uhpvrh](https://www.reddit.com/r/shopify/comments/1uhpvrh/) | "Did the Apple-fee answer settle it, or what still stops you?" |
| Poster of | [r/ShopifyWebsites 1qkk0vc](https://www.reddit.com/r/ShopifyWebsites/comments/1qkk0vc/) | "You said you now see the appeal with more repeat buyers. What would you pay?" |
| Poster of | [r/shopify_growth 1rnyxp9](https://www.reddit.com/r/shopify_growth/comments/1rnyxp9/) | "What share of repeat buyers installed, and what moved them?" |

**Cheapest next test:** a landing page for the sub-segment ("$79/mo flat, no % of sales, switch from OneMobile/Plobal in a week") plus a Shopify App Store listing. Kill if fewer than 10 qualified stores ($250K+/yr, repeat category) book a call within 30 days.

### Main risks
- **Demand is thin and the advice is "don't."** Most small stores lack the repeat base; even a perfect product gets few installs per store, and churn follows ("Thinking of getting rid of it").
- **Saturated category** (111 apps), with cheap and free tiers already, and Tapcart/Appbrew already selling "AI."
- **Shopify's Shop app** (free) and **Shop Minis** cover "be on the phone" for small stores.
- **Apple friction is real and outside your control:** D-U-N-S wait, seller-name issue, rejections. Support load lands on you.
- **Proof problem:** app-vs-web lift claims are vendor numbers and self-selected. One owner reported app sales of ~$100K on $40M/yr.
- **Margin depends on low support hours.** Onboarding new owners through Apple can easily take more than 3 hours.

---

## Method and spend
- Read: competitors-and-rules.md, METHOD.md, cmba-validate SKILL.md.
- treg: 14 Reddit searches (`anyapi.reddit.search`), 9 comment pulls (`crawl4ai.reddit.post.comments`), 1 batch keyword call (20 keywords, `serpstat.google.keywords.volume`). Estimated spend about **$0.03**. Team balance went from $7.09 to $7.06 (shared with other concurrent jobs).
- Web: StoreLeads reports, Shopify App Store review pages, Apple and Google policy pages, third-party pricing roundups.
- Nothing was posted, no one was contacted, nothing was signed up for.
