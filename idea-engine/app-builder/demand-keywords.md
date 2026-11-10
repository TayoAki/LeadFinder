# App Builder: where is the proven demand?

Date: 2026-11-10. Product: "App Builder". You type a prompt, it plans the screens, then you edit on a canvas. It outputs Expo/React Native apps for iOS and Android, with onboarding, a paywall, App Store metadata and App Store screenshots built in. "Start free with 100 credits."

Hypothesis to test: **focus on e-commerce, so stores get instant iOS apps.**

Method: the [keyword-research skill](../../.claude/skills/keyword-research/SKILL.md) (seed, 6 circles, cluster, pillar validation, prioritize), plus the Gate 0 evidence rules in [METHOD.md](../github-repo-offers/METHOD.md). Paid intent beats attention.

**Short answer.** The strongest proven demand is **indie and subscription app makers**: people who want to ship an app, monetize it and get it through the App Store. That niche is growing. It has the most paid job posts, and it matches the features App Builder already has. **E-commerce is the weakest of the three main niches.** Search volume is small and falling. Fewer than 0.1% of Shopify stores have an app-builder installed. An AI "Shopify store to iOS app" product already exists (Cabano) and has no reviews yet.

---

## 0. Data sources and costs

| Source | What it gave | Cost |
|---|---|---|
| DataForSEO Google Ads search volume via treg (`dataforseo.google.keywords.volume`) | 237 US keywords in 2 calls, plus 50 global keywords. Volume, CPC, competition, 24 months of monthly data (Oct 2024 to Sep 2026) | $0.27 |
| DataForSEO Google Trends explore via treg | 2 comparisons of 5 terms each, US, Nov 2024 to Nov 2026 | $0.022 |
| Google SERP via treg (`anyapi.google.serp.organic`) | Upwork job posts (`site:upwork.com/freelance-jobs/apply`), Reddit threads, top-10 results | about $0.03 |
| WebSearch / WebFetch | Market-size anchors, Shopify App Store listings | free |

**treg balance: $7.46 before, $7.06 after. Total spend was about $0.39, under the $0.75 cap.**

Raw data: [us.tsv](us.tsv) and [global.tsv](global.tsv).

### How to read the numbers

- **Volume** is US monthly Google searches (Google Ads data).
- **YoY** compares the average for Apr–Sep 2026 with Apr–Sep 2025.
- **CPC** is the average advertiser bid in USD. It is a proxy for buying intent.
- **Close variants are merged.** Google Ads folds close variants together, so keywords with identical numbers are one bucket. For example, "no code app builder" = "app builder no code" = 12,100. Each bucket is counted once in the totals.
- **"Natively app builder" (49,500) is not trusted.** Its series jumps from 790 to 100,907 to 1,300 between quarters. That is a data artifact, and it is excluded.
- **Google Trends looks unreliable at the edges.** Every series drops in the last six weeks (partial data), and "restaurant app" swings in a way the Google Ads data does not show. Trend direction below therefore comes from the Google Ads monthly series. Trends is only a cross-check.
- **Upwork counts are samples, not totals.** Google only indexes part of Upwork and returns at most 10–20 results per query. Treat every count as a lower bound.
  - **Recency:** Upwork job IDs grow with time. ID ~02219917… was posted 21 Nov 2025 and ~022108172… was posted 8 Oct 2026. Every sampled ID is ≥ 0221000…, which is about mid-Sep to 10 Nov 2026 (roughly 55 days). This estimate is derived from two dated posts, so it is approximate.
  - **The filter works:** every result was an `upwork.com/freelance-jobs/apply/` URL.
  - **Budgets:** Upwork job pages returned 403, so most budgets are **not verified**.

---

## 1. Seeds and the 6 Circles expansion

| Circle | Keywords tested (sample) |
|---|---|
| 1. What you sell | ai app builder, ai mobile app builder, ai iphone/ios/android app builder, build/make/create an app with ai, ai app maker, ai app generator, mobile app builder, app creator |
| 2. Problems you solve | make an app without coding, how to make an app, how to publish an app on app store, mobile app development cost, hire app developer, convert website to app, (Reddit) vibe-coded app rejected by Apple |
| 3. Outcomes | how to make money with apps, app ideas that make money, subscription app, app paywall, app store screenshots, aso tool, app onboarding |
| 4. Positioning | vibe code ios app, expo ai, react native ai, lovable mobile app, no code mobile app builder, paywall template, app store screenshot generator |
| 5. Adjacent niches | shopify mobile app, tapcart alternative, woocommerce mobile app, restaurant/salon/church/gym app, coaching/community/membership app, field service/inventory/employee app |
| 6. Entities | Rork, Vibecode, a0.dev, Anything, Bitrig, Lovable, Bolt, Base44, Replit, FlutterFlow, Adalo, Expo, RevenueCat, Superwall, Adapty, Tapcart, Shopney, Vajro, MobiLoud, Subsplash, Skool, Mighty Networks |

---

## 2. Keyword evidence by niche (US)

### Niche 1: General AI app builder / vibe coding (mobile)

| Keyword | US vol | CPC | YoY | Note |
|---|---:|---:|---:|---|
| ai app builder | 12,100 | $34.62 | +75% | 40,500 global |
| ai app maker | 4,400 | $20.17 | +317% | |
| best ai app builder | 1,300 | $28.64 | +24% | |
| ai app builder free | 1,300 | $26.63 | +145% | |
| ai app generator | 1,300 | $20.55 | −8% | |
| app builder ai | 1,000 | $29.30 | +110% | |
| build an app with ai | 390 | $38.58 | −11% | |
| make an app with ai | 210 | $34.93 | +19% | |
| how to make an app with ai | 210 | $23.54 | +67% | |
| **ai mobile app builder** | **320** | $27.17 | **−49%** | |
| ai ios / android / iphone app builder | 90 / 90 / 30 | $26–36 | −21 to −53% | |
| vibe coding mobile app / vibe code ios app | 110 / 90 | ~$16 | −56% / −34% | |
| expo ai / react native ai | 140 / 90 | $11 / $8 | −25% / −58% | |
| lovable mobile app / lovable for mobile | 170 / 10 | $6 / $3 | | |
| rork / rork ai (brand) | 9,900 / 6,600 | $7 / $13 | −9% / +16% | 60,500 / 33,100 global |
| vibecode / vibecode app (brand) | 4,400 / 590 | $14 / $18 | +11% / +24% | |
| no code app builder | 12,100 | $34.50 | **−48%** | Peaked Q4'25 at 18.8k; 5.9k in Q3'26 |
| how to make an app | 8,100 | $16.25 | −13% | |

**Totals.** Generic "build an app with AI" intent is about **22,900/mo**, with CPC around $20–39 and growing. Mobile-specific AI terms without a brand are only about **1,000/mo** and falling. Searchers say "AI app builder", not "AI mobile app builder". Brand searches for mobile AI builders (Rork, Vibecode, a0, Bitrig, Anything) add about **22,500/mo**.

**Trend (US quarterly average, Google Ads).** Every series rose through 2025. "ai app builder" and "rork" are now falling from their peaks.

| Keyword | Q4'24 | Q2'25 | Q4'25 | Q1'26 | Q2'26 | Q3'26 |
|---|---:|---:|---:|---:|---:|---:|
| ai app builder | 5.1k | 5.9k | 11.4k | 13.9k | **14.3k (peak)** | 9.3k |
| rork | 0.5k | 8.8k | 8.7k | **14.1k (peak)** | 9.3k | 7.1k |

Google Trends (US) agrees with the direction: "ai app builder" rose from index 1 in Q4'24 to 27 in Q3'26. Over the same period "shopify mobile app" stayed at 0–2.

**Service searches are collapsing.** The searches App Builder would replace are falling hard:

| Keyword | US vol | CPC | YoY |
|---|---:|---:|---:|
| hire app developer | 1,600 | $98 | −75% |
| app development company | 4,400 | $74 | −72% |
| custom mobile app development | 880 | $84 | −76% |
| mobile app development cost | 1,600 | $26 | −45% |

### Niche 2: E-commerce (the hypothesis)

| Keyword | US vol | CPC | YoY | Note |
|---|---:|---:|---:|---|
| shopify mobile app | 480 | $3.83 | +18% | **Mostly navigational.** All top-5 results are Shopify's own admin app ([shopify.com/mobile](https://www.shopify.com/mobile)). 1,600 global |
| shopify app builder | 140 | $10.55 | −63% | |
| shopify mobile app builder | 140 | $19.53 | −54% | |
| shopify store to app | 110 | $2.53 | −30% | |
| convert shopify store to app | 20 | n/a | −20% | |
| shopify ios app | 20 | $1.91 | +8% | |
| mobile app for shopify store / tapcart alternative / mobile app for online store | 10 each | | | |
| ecommerce (mobile) app | 590 | $55.49 | −49% | |
| ecommerce (mobile) app builder | 50 | n/a | −79% | |
| woocommerce mobile app | 210 | $28.49 | −25% | |
| online store app | 90 | $15.97 | −54% | |
| tapcart (brand) | 880 | $16.59 | −33% | 2,400 global, −29%; 1.3k in Q4'24 → 0.77k in Q3'26 |
| mobiloud / shopney / vajro / plobal (brands) | 260 / 90 / 70 / 40 | | mostly down | |
| website to app / turn website into app / convert website to app | 590 / 390 / 320 | $9–14 | −16 to −46% | |

**Totals.** The e-commerce cluster is about **3,500/mo**, brands included. Without brands and the navigational "shopify mobile app", **store-app builder intent is about 600–800/mo**. Most of these terms fell 25–79% year over year. The one exception is "shopify mobile app" (+18%, +44% global), and its results are Shopify's own admin app.

### Niche 3: Subscription / indie app makers ("app factory")

| Keyword | US vol | CPC | YoY | Note |
|---|---:|---:|---:|---|
| revenuecat (brand) | 18,100 | $1.45 | **+147%** | 90,500 global (+146%). US: 5.4k Q4'24 → 22.2k Q3'26 |
| superwall (brand) | 1,900 | $25.39 | −10% | 9,900 global (+18%) |
| adapty (brand) | 720 | $4.93 | −2% | |
| subscription app | 880 | $14.33 | −32% | |
| paywall design / examples / app paywall / template | 70 / 90 / 50 / 10 | $2–14 | +17 to +33% | |
| superwall paywall / revenuecat paywall | 70 / 110 | | +71% / −32% | |
| app store screenshot(s) generator | 590 | $3.45 | **+69%** | 3,600 global (+84%) |
| app store screenshots | 720 | $5.43 | +49% | |
| app screenshot generator / maker / template | 170 / 110 / 140 | $3–9 | +104% / +75% / +58% | |
| how to publish an app on app store | 590 | $19.73 | **+103%** | |
| publish app to app store | 210 | $23.52 | +37% | |
| aso tool / app store optimization | 720 / 880 | $29 / $43 | −53% / −34% | |
| app onboarding (+ screens / mobile / examples) | 210 + 170 + 90 + 40 | up to $49 | mixed | |
| make money with apps | 14,800 | $9.27 | −36% | 49,500 global |
| how to make money with apps | 1,000 | $12.37 | −29% | |
| app ideas / app ideas that make money | 3,600 / 260 | $5–6 | −8% / +28% | |
| expo go | 6,600 | $1.34 | +77% | A proxy for the number of Expo developers |

**Totals.** Non-brand tool intent is about **6,000/mo**:

| Bucket | US vol/mo |
|---|---:|
| Screenshots | ~1,730 |
| ASO | ~1,740 |
| Publishing | ~800 |
| Subscription app | 880 |
| Onboarding | ~510 |
| Paywall | ~400 |

On top of that, brand searches for paywall infrastructure add **~20,700/mo**, and "make money with apps" intent adds about 19,000. The screenshot and publishing terms are the fastest-growing non-brand terms in the whole study.

### Niche 4: Local businesses

| Keyword | US vol | CPC | YoY |
|---|---:|---:|---:|
| restaurant app | 2,900 | $9.91 | −18% (9.5k in Q4'24 → 2.4k in Q3'26) |
| online ordering system for restaurants | 480 | $46.58 | −70% |
| restaurant loyalty app | 320 | $35.03 | +4% |
| restaurant ordering app / mobile app / app builder | 140 / 110 / 50 | $20 / $92 / $24 | −17% / −43% / −58% |
| salon booking app / salon app / salon booking software | 480 / 170 / 720 | $58 / $53 / $90 | −22 to −36% |
| church app / church app builder / subsplash (brand) | 2,900 / 90 / 22,200 | $5 / $18 / $6 | 0% / −47% / +15% |
| gym app / gym member app / fitness studio app / fitness app builder | 1,300 / 70 / 50 / 20 | $2–18 | mostly down |
| club app / youth sports app | 590 / 2,400 | $10 / $10 | −23% / spiky (3.9k–4.9k in Q1–Q2'26, then 313) |

**Totals.** The cluster is about 9,800/mo, but most of it is consumer intent: people looking for a restaurant's or gym's app. **"[Vertical] app builder" intent is about 170/mo in total.** CPCs are high where software is being bought (salon, restaurant ordering, fitness studio software at $164). That money goes to vertical SaaS (booking, POS, giving), not to app builders.

### Niche 5: Creators / coaches / communities

| Keyword | US vol | CPC | YoY |
|---|---:|---:|---:|
| community app / coaching app | 2,400 / 2,400 | $13 / $6 | +7% / −7% |
| membership app / course app | 140 / 110 | $14 / $13 | −10% / −13% |
| community/coaching/membership app builder | 10 each | | |
| community platform | 480 | $36 | −46% |
| skool / mighty networks / circle community / kajabi app (brands) | 165,000 / 12,100 / 3,600 / 1,300 | $1–8 | +39% / −26% / +3% / 0% |

**Totals.** Builder intent is about **30/mo**. Demand goes to platforms (Skool, Mighty Networks, Circle), not to standalone apps.

### Niche 6: Internal / business tools on mobile

| Keyword | US vol | CPC | YoY |
|---|---:|---:|---:|
| employee app | 6,600 | $5.52 | −39% |
| inventory app / inventory management app | 1,300 / 720 | $28 / $40 | −29% / −55% |
| field service app / field service management app | 880 / 880 | $54 / **$104** | −28% / −56% |
| app for small business | 590 | $47 | −57% |
| business app builder / create app for my business | 210 / 110 | $49 / $81 | +1% / −52% |
| internal app builder | 10 | $15 | |

**Totals.** About 11,000/mo with the **highest CPCs in the study**. But these buyers want data, backends and integrations. App Builder's paywall, App Store screenshots and ASO features are irrelevant to them. Trends are falling.

---

## 3. Paid intent: Upwork job posts

Window: roughly mid-Sep to 10 Nov 2026. Google-indexed sample, so lower bounds. Links go to example posts.

| Niche | Tight (this deliverable) | Loose | Examples |
|---|---:|---:|---|
| E-commerce store → iOS/Android app | **4** (Shopify-specific) | 12 | [Native-feel iOS & Android Shopify Shopping App](https://www.upwork.com/freelance-jobs/apply/Native-feel-iOS-Android-Shopify-Shopping-App-Storefront-API-Push-Notifications_~022109311784766949328/), [Custom iOS + Android App for Shopify Comic Store](https://www.upwork.com/freelance-jobs/apply/Custom-iOS-Android-App-for-Shopify-Comic-Store_~022115506714701721329/), [Shopify Small Team for D2C Store + iOS/Android App](https://www.upwork.com/freelance-jobs/apply/Shopify-Small-Team-for-D2C-Ecommerce-Store-iOS-Android-App-multiple-API-integrations_~022119882016084889384/). WooCommerce: 0 app builds found. Budgets not verified (403). Gig listings sell Shopify-to-app at $120 (webview) to $1,500 ([example](https://www.upwork.com/services/product/development-it-a-native-ios-swiftui-mobile-app-for-your-shopify-store-1787690176115933070)). |
| Web / vibe-coded app → native app and store | **9** | 10 | [Convert my app from loveable into the App Store](https://www.upwork.com/freelance-jobs/apply/Convert-app-from-loveable-into-the-App-Store-and-android-store_~022118713641664891093/), [Wrap my Lovable web app into an iPhone app](https://www.upwork.com/freelance-jobs/apply/Wrap-Lovable-web-app-into-iPhone-app-and-get-the-App-Store_~022109000924708801844/), [Convert Existing Replit Web App to iOS/Android](https://www.upwork.com/freelance-jobs/apply/Convert-Existing-Replit-Web-App-iOS-Android-Using-Capacitor-App-Store-Deployment_~022116990000959594643/) |
| App Store publishing / review rescue | **~12** | 12 | "Publish App on Apple iOS", "Apple App Store Review Specialist", two "Pre-Submission Audit" posts, "Upload My iOS & Android Apps" |
| ASO (keywords, metadata) | **17** | 20 | "App Store Optimization (ASO) Specialist iOS & Android", "U.S.-Based iOS App Store Optimization", "iOS App Launch Specialist" |
| App Store screenshots | **8** | 10 | [App Store Screenshot Designer for a Friendship App](https://www.upwork.com/freelance-jobs/apply/App-Store-Screenshot-Designer-for-Friendship-App-iOS-and-Google-Play_~022112669412612235289/), "App Store Screenshot Designer & A/B Testing Specialist" |
| Paywall / onboarding / subscription | **3** | 5 | [Mobile App UI/UX Designer (Onboarding, Paywalls, App Store Screens)](https://www.upwork.com/freelance-jobs/apply/Mobile-App-Designer-Onboarding-Paywalls-App-Store-Screens-etc_~022090105992247421744), "iOS UX designer to optimize onboarding", "Head of Product (Activation & Conversion) for Subscription…" |
| Expo / React Native MVP builds | **~7** | 10 | "React Native Developer – Health App MVP (iOS & Android)", "React Native (Expo) + Supabase: finish & test AI…", "Vibe Coding Mobile App Developer" |
| Restaurant app | **~8** | 20 | [Mobile App for Restaurant Loyalty System](https://www.upwork.com/freelance-jobs/apply/Mobile-App-for-Restaurant-Loyalty-System_~022118606306882797313/), [Restaurant Mobile App Development ($400 fixed, 8 Oct 2026)](https://www.upwork.com/freelance-jobs/apply/Restaurant-Mobile-App-Development_~022108172145965114488/). An older post had a [$10,000 fixed budget for a React Native/Expo ordering app (Nov 2025)](https://www.upwork.com/freelance-jobs/apply/React-Native-Mobile-App-Development-for-Restaurant-Ordering_~021991796187478663806/) |
| Salon / gym / fitness studio | 2 / 0 / 1 | noisy | [Flutter Developer for Salon Booking App MVP](https://www.upwork.com/freelance-jobs/apply/Flutter-Developer-Needed-for-Salon-Booking-App-MVP_~022113269127682687112/) |
| Church | 0 found | – | The query returned no indexed job posts |
| Coach / community / membership | 2–3 | 10 | Most hits are "test our app" gigs, not builds |
| Field service / inventory | 5 / 2 | 19 / 10 | [Field Service Management App Development](https://www.upwork.com/freelance-jobs/apply/Field-Service-Management-App-Development_~022116479185558015070/) |

**Gate 0 check (20+ tight requests in the window).**

- **Indie / subscription "ship it" cluster: about 49 tight.** That is ASO 17 + screenshots 8 + paywall/onboarding 3 + publishing ~12 + vibe-to-native 9. **It passes.**
- **E-commerce: 4 tight / 12 loose. It fails.**
- **Restaurant: ~8. It fails**, and the budget seen was $400.

---

## 4. Community asks (Reddit, sampled via Google)

**E-commerce: merchants doubt they need an app.**
- r/shopify: ["Mobile apps are a waste of money unless they are solving a problem that web applications cannot solve"](https://www.reddit.com/r/shopify/comments/1hykfol/thoughts_on_a_mobile_app_for_your_shopify_store).
- ["Mobile apps work best for larger or fast-growing stores"](https://www.reddit.com/r/shopify/comments/1metolt/is_appbrew_the_best_shopify_mobile_app_builder).
- ["We use Tapcart… it's fine and makes money but it feels like one extra thing I need to update"](https://www.reddit.com/r/shopify/comments/1r45jlg/app_or_no_app/).
- A consumer view: ["I personally… don't download company apps often"](https://www.reddit.com/r/shopify/comments/1m7qc6w/1m_shopify_brands_why_do_you_feel_the_need_to).
- Price is a complaint: Tapcart is ["a tad expensive"](https://www.reddit.com/r/ecommerce/comments/xeohy9/tapcart_has_anyone_tried_it/). A Shopify Plus brand is [looking for Tapcart alternatives over performance](https://www.reddit.com/r/shopify/comments/1idketd/best_shopify_mobile_app_builder_tool/).

**Indie / vibe coders: the pain is shipping and getting approved.**
- ["I get hired to finish vibe-coded apps… Google login but no Sign in with Apple… a layout that breaks on iPad is a rejection"](https://www.reddit.com/r/AppBusiness/comments/1xpj41x/i_get_hired_to_finish_vibecoded_apps_they_almost/).
- ["Apple review took 3 months and 10+ rejections"](https://www.reddit.com/r/vibecoding/comments/1vpf5sp/vibe_coding_got_me_a_working_app_in_weeks_apple/).
- ["Rejected ~48 hours later"](https://www.reddit.com/r/vibecoding/comments/1srukox/apple_rejected_my_first_app_store_submission/).
- Lovable, Bolt and similar tools ["produce mobile friendly web apps, not iOS apps submitted to the store"](https://www.reddit.com/r/vibecoding/comments/1rjx91m/rorkmax_looks_quite_compelling_as_best_ios_native/).
- Rork pain: ["60+ paid credits forfeited"](https://www.reddit.com/r/reactnative/comments/1ooa4t8/rork_app_promises_aipowered_app_building_and/).

**Indie / vibe coders: paywall strategy is a live topic.**
- [Hard paywall vs freemium](https://www.reddit.com/r/AppBusiness/comments/1swqhpn/hard_paywall_or_freemium_for_my_app/).
- [Pricing a subscription app for the first time](https://www.reddit.com/r/AppBusiness/comments/1x93ywo/pricing_a_consumer_subscription_app_for_the_first/).
- [Paywalls look the same across top apps](https://www.reddit.com/r/AppBusiness/comments/1xmshi4/anyone_else_notice_how_similar_paywalls_look/).

**Indie / vibe coders: makers are building screenshot tools for themselves.** Examples: [r/AppStoreOptimization](https://www.reddit.com/r/AppStoreOptimization/comments/1s2fs49/im_building_an_ai_tool_that_generates_app_store) and [r/iosdev](https://www.reddit.com/r/iosdev/comments/1s0yd6r/i_built_an_ai_that_copies_any_apps_app_store).

**Small business: the "paid someone to build my app with AI" story has started.** See [r/smallbusiness](https://www.reddit.com/r/smallbusiness/comments/1vj21cd/paid_to_have_an_app_built_with_ai_now_im_not_sure/).

**Restaurants: owners advise against their own app.** Examples: ["DO NOT build your own app"; use ChowNow](https://www.reddit.com/r/restaurateur/comments/76sd1i/uber_eats_what_percentage_you_paying_em_anyone), and ["unless you have thousands of very regular customers, a custom app would not be worth it"](https://www.reddit.com/r/restaurateur/comments/6nzj78/does_your_restaurant_has_its_own_branded_app).

**Churches: the market is served by all-in-one platforms.** Subsplash, Planning Center and Tithely dominate. The complaint is price ([r/churchtech](https://www.reddit.com/r/churchtech/comments/1x0jykt/chms_options_subsplash_tithely_planning_center/)), not a missing app builder.

---

## 5. Market-size anchors

### E-commerce

| Anchor | Figure | Source |
|---|---|---|
| Live Shopify stores | about 2.4M–2.9M. StoreCensus tracks 2,440,592; StoreLeads reports 2,898,351 (Q2 2026) | [StoreCensus](https://www.storecensus.com/stats/app/shopify-mobile-apps), [ecomm.design summary](https://ecomm.design/how-many-shopify-stores-are-there/) |
| Stores with Tapcart installed | **883** (0.036%), per StoreCensus on 10 Nov 2026. A July 2026 StoreCensus figure quoted in search results was 2,401. Bootleads: 1,440. **The figures conflict; all are lower bounds.** | [StoreCensus](https://www.storecensus.com/stats/app/shopify-mobile-apps), [Bootleads](https://bootleads.com/stores/shopify/app/shopify-mobile-apps) |
| Superfans (formerly Vajro) installs | 8,825 per StoreCensus, but the app is "not currently available on the Shopify App Store" | [Shopify listing](https://apps.shopify.com/vajro) |
| Tapcart | 339 reviews, 4.7★, listed since 2017. Growth plan $500/mo, Scale $1,250/mo | [Shopify App Store](https://apps.shopify.com/shopify-mobile-apps) |
| Shopney | 775 reviews, 5.0★, from $149/mo | [Shopify App Store](https://apps.shopify.com/shopney-mobile-app) |
| Appbrew | 76 reviews, from $199/mo | [Shopify App Store](https://apps.shopify.com/mobile-app-builder-appbrew) |
| **Cabano**: AI chat → native iOS app from a Shopify store. This is the e-commerce hypothesis, already shipped | Launched 10 Aug 2026. **0 reviews** after 3 months. Free / $50 / $100 per month | [Shopify App Store](https://apps.shopify.com/cabano) |

**What this means.** All the mobile-app-builder installs together reach well under 1% of Shopify stores. Paying buyers are mid-market brands spending $150–$1,250/mo. An AI-native entrant (Cabano) has no visible traction yet.

### Indie / subscription apps

| Anchor | Figure | Source |
|---|---|---|
| RevenueCat State of Subscription Apps 2026 | 115k+ apps, $16B+ revenue. Monthly new subscription-app launches went from ~2,000 (Jan 2022) to **14,700 (Jan 2026)**. The App Store has ~77% of new launches. Apps launched in 2025 or later (the "vibecoding era") earn only 3% of revenue. 17% of the 2025 cohort passed $1k MRR | [RevenueCat](https://www.revenuecat.com/state-of-subscription-apps-2026/), [ppc.land](https://ppc.land/the-app-middle-class-is-dying-and-revenuecats-data-shows-exactly-how-fast/) (secondary coverage; full report not read) |
| App Store submissions | 235,800 new submissions in Q1 2026, **+84% YoY**. About 560k in H1 2026 (Sensor Tower, via press). Appfigures: Q1 2026 iOS launches +80% | [9to5Mac](https://9to5mac.com/2026/04/06/app-store-sees-84-surge-in-new-apps-as-ai-coding-tools-take-off/), [TechCrunch](https://techcrunch.com/2026/04/18/the-app-store-is-booming-again-and-ai-may-be-why/) |
| Apple's stance | Blocked updates for, or pulled, Replit, Vibecode and Anything, because they run generated code inside an installed app. An app builder that *exports* a normal Expo binary is not affected; one that runs code in-app is | [r/apple thread](https://www.reddit.com/r/apple/comments/1rx53n0/apple_quietly_blocks_updates_for_popular_vibe/), [TechSpot](https://www.techspot.com/news/113213-apple-app-store-inundated-low-quality-vibecoded-apps.html) |

### General AI app builders

| Anchor | Figure | Source |
|---|---|---|
| Rork | $15M seed, Apr 2026 (Left Lane, Peak XV, a16z Speedrun). The founder says "on track to hit 8 figures ARR" (**not verified**) | [Pulse 2.0](https://pulse2.com/rork-15-million-raised-for-ai-mobile-app-creation-platform/) |
| Top 10 for "ai app builder" | Base44, Choicely, Replit, Anything, Figma, OnSpace… (high-authority domains) | treg SERP, 10 Nov 2026 |

---

## 6. Clusters

| Cluster | Core keywords | US vol/mo (deduped) | Intent | Trend |
|---|---|---:|---|---|
| A. AI app builder (generic) | ai app builder, ai app maker, app builder ai, best/free ai app builder, build/make an app with ai | ~22,900 | Commercial | Up YoY, past peak (Q2'26) |
| B. Mobile-native AI builder | ai mobile/ios/android app builder, vibe code ios app, expo ai, lovable mobile app | ~1,000 (+ ~22,500 brand) | Commercial | Down |
| C. Monetize: paywall & subscription | subscription app, paywall design/examples/template, superwall paywall, app onboarding, how to make money with apps | ~2,900 (+ ~20,700 brand) | Commercial / informational | Mixed; RevenueCat brand +147% |
| D. App Store launch kit | app store screenshot(s) generator/maker/template, how to publish an app on app store, aso tool, app store optimization, app store keywords | ~4,300 | Commercial / how-to | **Up** (screenshots +49–104%, publishing +37–103%) |
| E. Web / vibe-coded app → native | website to app, convert website to app, turn website into app, (Upwork) Lovable/Replit → App Store | ~1,300 | Transactional | Down in search, but strong on Upwork |
| F. Shopify / e-commerce store app | shopify app builder, shopify store to app, ecommerce app builder, woocommerce mobile app, tapcart | ~600–800 non-brand (~3,500 total) | Commercial | **Down** |
| G. Local business app builders | restaurant/salon/church/fitness app builder | ~170 builder intent | Commercial | Down |
| H. Creator/community apps | coaching/community/membership app builder | ~30 builder intent | Commercial | Flat |
| I. Internal business apps | field service/inventory/employee app | ~11,000 (high CPC) | Software purchase | Down |
| J. Replace the agency | hire app developer, app development company, mobile app development cost | ~8,500 | Transactional ($74–98 CPC) | **Down 45–76%**: this demand is moving to AI tools |

---

## 7. Pillar validation (skill Phase 3)

```
Pillar: Ship & monetize a subscription app (Clusters C + J angle)
Search volume test: PASS — ~2,900/mo non-brand, plus 20.7k brand (RevenueCat +147%)
Market-centric test: PASS — "subscription app", "paywall examples", "how to make money with apps" are market terms
Competitive test: PASS — the "superwall alternative" top 10 is Product Hunt, Reddit, vendor blogs and small sites
Proprietary advantage: YES — onboarding + paywall are generated into the app, not bolted on  ⟵ SUPERSEDED 2026-11-10: Superapp claims "Subscriptions and in-app purchases, ready to charge from day one." Paywall is SHARED; generated onboarding is COSMETIC. See differentiators.md.
VERDICT: VALID PILLAR
```

```
Pillar: App Store launch kit (Cluster D)
Search volume test: PASS — ~4,300/mo, the fastest-growing non-brand cluster
Market-centric test: PASS — "app store screenshot generator", "how to publish an app on app store"
Competitive test: PASS — the top 10 is Figma community files, small tools (AppScreens, AppLaunchpad), Reddit, small blogs
Proprietary advantage: YES — screenshots + keywords/description generated from the app's own screens  ⟵ SUPERSEDED 2026-11-10: Rork ("App Store screenshots in one click"), Newly and Superapp now claim this on their homepages. It is SHARED, not proprietary. See differentiators.md.
VERDICT: VALID PILLAR (quick win)
```

```
Pillar: AI mobile app builder (Clusters A + B)
Search volume test: PASS — ~22,900/mo generic; mobile-specific only ~1,000
Market-centric test: PASS — "ai app builder"
Competitive test: FAIL — Base44, Replit, Figma and Anything hold the top results; Rork has $15M
Proprietary advantage: PARTIAL — real Expo binaries (survive Apple's crackdown on in-app code) + built-in monetization
VERDICT: VALID PILLAR (long play), entered through the "AI app builder for iOS/subscription apps" angle
```

```
Pillar: Web / vibe-coded app → App Store (Cluster E)
Search volume test: PASS — ~1,300/mo + strong Upwork demand (9 tight)
Market-centric test: PASS
Competitive test: PASS/MIXED — MobiLoud, Median-type wrappers
Proprietary advantage: PARTIAL
VERDICT: DEMOTE TO CLUSTER under "App Store launch kit" (wrapper apps also risk Apple's minimum-functionality rejections; not verified here)
```

```
Pillar: Shopify store → iOS app (Cluster F)
Search volume test: FAIL — ~600–800 non-brand; most terms down 25–79% YoY; "shopify mobile app" is navigational to Shopify's own admin app
Market-centric test: PASS
Competitive test: FAIL — Tapcart/Shopney/Appbrew entrenched; Cabano already does AI chat → iOS app
Proprietary advantage: NO — paywall/onboarding/ASO features are irrelevant to stores; a store needs catalog sync, cart, checkout, push
VERDICT: DEMOTE TO CLUSTER (one use-case page), not a pillar
```

```
Pillar: Local business apps (Cluster G)
Search volume test: FAIL — ~170/mo builder intent
Market-centric test: PASS
Competitive test: FAIL — vertical SaaS (ChowNow, Lunchbox, Subsplash) bundles the app
Proprietary advantage: NO
VERDICT: REMOVE (restaurant loyalty at most one use-case page)
```

```
Pillar: Creator/community apps (Cluster H)
Search volume test: FAIL (~30/mo)    Competitive test: FAIL (Skool 165k, Mighty Networks 12k)
VERDICT: REMOVE
```

```
Pillar: Internal business apps (Cluster I)
Search volume test: PASS     Market-centric: PASS     Competitive: FAIL (FSM/inventory SaaS)
Proprietary advantage: NO (needs backends, not paywalls/App Store assets)
VERDICT: REMOVE for this product
```

---

## 8. Niche × evidence scorecard

Demand score is 0–10. It weighs builder-intent volume, trend, CPC, tight paid posts, market anchor, and fit with App Builder's features.

| Niche | Builder-intent US vol/mo | Avg CPC | Trend | Upwork tight (~55 days) | Market anchor | Fit with features | **Demand score** |
|---|---:|---:|---|---:|---|---|---:|
| **3. Indie / subscription app makers** | ~7,200 (C + D), plus 20.7k brand | $3–29 (Superwall $25) | **Up**: RevenueCat +147%, screenshots +49–104%, publishing +37–103% | **~49** (ASO 17, publishing 12, vibe→native 9, screenshots 8, paywall 3) | 14,700 new subscription apps/month (Jan 2026); App Store submissions +84% | **Full**: paywall, onboarding, screenshots, ASO | **8.5** |
| 1. General AI app builder | ~22,900 generic; ~1,000 mobile-specific | $20–39 | Up YoY, past peak | ~7 Expo/RN MVPs + the vibe→native posts above | Rork $15M seed; agency searches −45 to −76% | Good, but crowded | **7** |
| 6. Internal / business tools | ~330 builder intent (11k total) | $28–104 | Down | ~7 | FSM/inventory SaaS market | Poor | **3.5** |
| 4. Local business (restaurant best) | ~170 builder intent | $10–92 | Down (church flat) | ~8 restaurant, 2 salon, 0–1 gym/church | Served by vertical SaaS | Poor | **3** |
| **2. E-commerce (hypothesis)** | ~600–800 non-brand | $3–55 (thin) | **Down**: Tapcart −40% in 2 years | **4** Shopify (12 loose) | Under 0.1% of ~2.4–2.9M Shopify stores; Tapcart 339 reviews in 9 years; Cabano 0 reviews | Weak: needs commerce sync, not paywalls | **3** |
| 5. Creators / coaches / community | ~30 | $6–14 | Flat | 2–3 | Skool, Mighty Networks dominate | Weak | **2** |

**Verdict on the e-commerce hypothesis: not supported.**

- **Little demand, and it is shrinking.** Builder-intent search is about 700/mo and falling, and the tight paid posts (4) are far below the Gate 0 threshold of 20.
- **Merchants doubt they need an app**, so the buyer is mainly mid-market brands already paying Tapcart or Shopney $150–$1,250/mo.
- **An AI-native version already exists.** Cabano shipped in Aug 2026 and has no reviews yet.
- **App Builder's differentiators do not apply.** Stores do not need a subscription paywall, onboarding or ASO.

If you still want e-commerce, the better angle is a **template inside the indie product**, not a vertical: for example, a "store app" or "DTC subscription box" template. It should not be a Shopify-first company.

---

## 9. Prioritized plan (skill Phase 4–5)

| Priority | Cluster | Value | Opportunity | Speed | Content |
|---|---|---|---|---|---|
| **DO FIRST** | D. App Store screenshot generator + "how to publish an app on the App Store" | High | High (growing, weak SERP) | Fast | A free screenshot-generator tool page, plus a how-to guide (2,500 words) |
| **DO SECOND** | C. Paywall & subscription: "paywall examples", "hard paywall vs freemium", "subscription app" | High | High | Medium | Pillar guide with real paywall templates; Superwall/RevenueCat comparison |
| **DO THIRD** | E. "Lovable/Replit app to App Store" + "why Apple rejected my vibe-coded app" | High | High (Upwork shows the pain) | Fast | Tutorial + rejection checklist (Sign in with Apple, iPad layout, guideline 4.2) |
| **LONG PLAY** | A/B. "AI app builder for iOS", "ai mobile app builder", "rork alternative" | High | Medium (crowded) | Long | Comparison pages |
| **BACKLOG** | F. "Shopify store to iOS app" | Low/Medium | Low | – | One use-case page only |
| **REMOVE** | G, H, I | Low | Low | – | – |

### Start here

Build a **free App Store screenshot + ASO metadata generator** as a lead magnet. Use it to feed "Start free with 100 credits".

- **Volume:** ~1,730/mo US and 3,600 global for screenshots, growing 49–104%.
- **Paid intent:** 25 recent Upwork posts (ASO plus screenshot jobs).
- **Competition:** a weak SERP.
- **Fit:** it is a feature App Builder already has.
- **Funnel:** it attracts exactly the indie and subscription makers who then need the full builder.

### 90 days

- **Month 1:** the screenshot generator page; "How to publish an app on the App Store (2026)"; "App Store rejection checklist for AI-built apps".
- **Month 2:** paywall pillar guide; paywall template gallery; "hard paywall vs freemium" (cite RevenueCat 2026); "Lovable → iOS App Store" tutorial.
- **Month 3:** "AI iOS app builder" comparison (Rork, Vibecode, a0, Anything); "how to make money with apps in 2026" built on RevenueCat cohort data; one e-commerce use-case page to test the hypothesis cheaply.

---

## Not verified / caveats

- Upwork budgets (job pages returned 403), except the $400 and $10,000 posts shown in search snippets.
- Tapcart install counts disagree across trackers (883 / 1,440 / 2,401).
- Rork ARR is a founder claim.
- RevenueCat figures come from secondary coverage of part 1 of the report.
- The Google Trends series has edge artifacts; the Google Ads monthly series is the primary trend source.
- "Natively app builder" (49.5k) is excluded as anomalous.
