# Niche Scorecard: Weekly competitor price & stock intelligence report for Shopify/DTC brands (Gate 0)

**Date:** 2026-11-10
**Offer as pitched:** scrape 5 rivals with Scrapling, write to a Google Sheet, alert on price drops and sell-outs. $500 setup + $300/month. Claimed cost about $40/month.
**Sources and samples:**
- Reddit (treg `crawl4ai.reddit.search.posts`): 10 searches, about 1,000 posts read. Searched r/shopify, r/ecommerce and r/FulfillmentByAmazon, plus site-wide searches. Window: 2026-09-10 to 2026-11-10, with older posts noted.
- LinkedIn jobs (treg `anyapi.linkedin.search.jobs`): 3 searches, 30 US postings from the past month.
- Google US keyword volume (treg `serpstat.google.keywords.volume`): 9 keywords.
- Web search: about 14 queries covering Upwork, Fiverr, Freelancer.com, Shopify App Store and managed services.
- Live pricing pages fetched: Prisync, Prisync's Shopify app, Particl, Visualping, PricePulse, Perch, Coffee Marketing and Price2Spy.
- **Gaps:** Upwork and Fiverr pages return 403, and treg has no Upwork endpoint. Upwork evidence therefore comes from search snippets, and their dates and budgets are mostly not verified. Reddit pages could not be opened, so I read titles and the first 300 characters only.
- **treg spend:** $9.3717 before, $9.2548 after, so **$0.117** spent (cap $0.75).

| Check | Result | One-line evidence |
|---|---|---|
| 1. 20+ buyers asking | ❌ | Tight count **about 2**, loose count **about 9** in 60 days. Sellers outnumber buyers. |
| 2. 3–5 competitors with public pricing | ✅ (fatal for price) | 7 verified. **$19–$49/mo** Shopify apps already do price and stock alerts at this exact scale. |
| 3. ≥50% gross margin at $300/mo | 🟡 conditional | 62% at 1.5 hr/mo, 37% at 3 hr/mo. Breakeven for 50% is 2.2 hr/mo. Setup is at or below cost. |
| 4. Named watering holes | ✅ | r/ecommerce, r/shopify, r/FulfillmentByAmazon, Shopify App Store, eCommerceFuel, Upwork/Fiverr. |

## Gate 0 checklist

### 1. Buyers asking: ❌ FAIL (tight ≈2, loose ≈9; target 20+)

**Tight (clearly this deliverable, a store owner asking or paying, roughly in the window):**
1. Upwork job: [Product Data Scraping, Shopify & B2B Uploads, and Automated Competitor Price Monitoring](https://www.upwork.com/freelance-jobs/apply/Product-Data-Scraping-Shopify-B2B-Uploads-and-Automated-Competitor-Price-Monitoring_~022110171419430278689/). A search snippet says it asks for a *daily* report of "our price, competitor prices, source links, and recommended actions". It is bundled with supplier scraping and Shopify uploads. Posting date and budget are not verified (page returns 403).
2. r/ecommerce, 2026-09-01: ["how do you track competitor retail prices?"](https://www.reddit.com/r/ecommerce/comments/1w4le9t/redditors_of_recommerce_how_do_you_track/). The poster wants a recommendation for **a self-serve tool**, not a service. This is just outside 60 days.

**Loose (related pain, tool surveys, or a different buyer):**
- r/ecommerce, 2026-10-30: ["what are you using to track competitor prices, and is it actually worth what you pay?"](https://www.reddit.com/r/ecommerce/comments/1xj6tu6/what_are_you_using_to_track_competitor_prices_and/). The wording reads like a survey, probably market research by a builder. Comments not read.
- r/ecommerce, 2026-10-08: [competitor international pricing / checkout flows](https://www.reddit.com/r/ecommerce/comments/1x0pa27/trying_to_check_competitor_international_pricing/). This is a one-off research pain, not ongoing monitoring.
- r/FulfillmentByAmazon, 2026-10-12: [why an ASIN's sales dropped](https://www.reddit.com/r/FulfillmentByAmazon/comments/1x428zm/is_figuring_out_why_an_asins_sales_dropped_always/). It lists competitor price and stock among other checks. The buyer is an Amazon seller, not a Shopify DTC brand.
- r/FulfillmentByAmazon, 2026-10-19: [competitors not raising prices after fees](https://www.reddit.com/r/FulfillmentByAmazon/comments/1x9o1vf/is_no_one_raising_their_prices_after_fees_went_up/). Pain, but no request.
- Upwork: [Competitor pricing market research](https://www.upwork.com/freelance-jobs/apply/Competitor-pricing-market-research_~022085027837969420479/). The search snippet says it covers exchange rates and fees at **$6–$18/hr**. Not e-commerce, date not verified.
- Freelancer.com: [Price Scraping & Competitive Pricing Specialist (ongoing)](https://www.freelancer.com/projects/web-scraping/price-scraping-competitive-pricing). The snippet says bids average about **AUD 8/hr**. Date not verified.
- Freelancer.com: [Shopify Competitor Price Monitoring Tool](https://www.freelancer.com/projects/web-scraping/Shopify-Competitor-Price-Monitoring-Tool). Budget £250–750 with 154 bids. It was posted **about a year ago**, so it is outside the window and shown for budget context only.
- Outside the window: r/ecommerce threads from [2026-08-11](https://www.reddit.com/r/ecommerce/comments/1vlh071/how_are_you_keeping_track_of_competitor_prices/) and [2026-07-16](https://www.reddit.com/r/ecommerce/comments/1uydjf7/how_do_you_handle_competitor_price_monitoring_for/) (electronics/RAM retailer).

**Job boards:** the 30 LinkedIn pricing and competitive-intelligence postings from the past month are all enterprises. Examples are [Chewy Pricing Data Analyst](https://www.linkedin.com/jobs/view/pricing-data-analyst-at-chewy-4488433775), [Camping World](https://www.linkedin.com/jobs/view/senior-pricing-analyst-at-camping-world-4484372477), [Sally Beauty](https://www.linkedin.com/jobs/view/sr-pricing-analyst-at-sally-beauty-4486963904) and [PlanetArt Sr. E-commerce Pricing Analyst](https://www.linkedin.com/jobs/view/sr-e-commerce-pricing-analyst-at-planetart-4480573376). **None of the 30 fit the $1–10M DTC buyer.** Brands that small do not hire for this role.

**Search demand (Google US, monthly, Serpstat):**

| Keyword | Monthly searches |
|---|---|
| competitor price monitoring | 320 |
| prisync | 320 |
| competitor price tracker | 260 |
| price2spy | 260 |
| competitor price tracking | 170 |
| price monitoring software | 170 |
| track competitor prices | 140 |
| shopify competitor price tracker | ~1 |

"competitor price monitoring service" returned no data. The searches point toward software, not a service.

**Buyer quality:** the few visible buyers want a tool, or post freelance budgets of $6–18/hr. I found no request near $300/mo for this deliverable.

### 2. Competitors with public pricing: ✅ pass, and they cap the price

All prices below are verified from live pages on 2026-11-10 unless marked otherwise.

| Competitor | Type | Plan and price | Scope |
|---|---|---|---|
| [PricePulse](https://apps.shopify.com/pricepulse-3) | Shopify app | Free (10 products, 30 links) · $19/mo (100 products, 500 links, daily) · **$49/mo (500 products, 2,500 links, every 12h)** · $99/mo (2,000 products, every 6h) | Price and stock checks, email and Slack alerts. Launched 2026-10-09, 0 reviews. |
| [Perch](https://apps.shopify.com/perch) | Shopify app | Free (1 competitor) · **$19.99/mo (up to 5 competitors)** · $49.99/mo (20 competitors) | Daily price and stock checks, email alerts. 0 reviews. |
| [Prisync (Shopify app)](https://apps.shopify.com/prisync-for-shopify) | SaaS | **$49/mo (100 products)** · $199/mo (1,000) · $399/mo (5,000) | Unlimited competitors, price and stock 3x/day. **4.9★ from 244 reviews.** |
| [Prisync (own site)](https://prisync.com/pricing/) | SaaS | URL-based plans: $99/mo (100 products) · $199/mo (1,000) · $399/mo (5,000) | Unlimited competitors, stock monitoring, 3x/day, 14-day trial. |
| [Particl](https://www.particl.com/pricing) | SaaS (DTC competitor intel) | **$250/mo (5 competitors)** · $500/mo (10) · $1,000/mo | Pricing and discount data, scheduled email reports. Stock not mentioned. |
| [Visualping](https://visualping.io/pricing) | Generic page monitor | $14–$140/mo monthly billing (10–200 pages) | Page change alerts, not a structured price sheet. |
| [Coffee Marketing Price Monitor](https://coffeemarketing-static.pages.dev/services/price-monitor) | **Managed, done-for-you** (UK) | £49/mo (50 SKU-competitor pairs) · £99 (150) · **£179 (300)** · £299 (600) | Daily scrape, morning alert digest, dashboard, rolling monthly contract. |
| [Price2Spy](https://www.price2spy.com/pricing.html) | SaaS | Starter and Basic are no longer priced on the page. Premium is "price upon request". | Public price **not verified**. [TrustRadius](https://www.trustradius.com/products/price2spy) cites from $26.95/mo. |
| Competera | Enterprise | Not fetched, **not verified**. | |

**What this means:** the offer's own spec is 500 products × 5 competitors = 2,500 links. **PricePulse Growth covers exactly that for $49/mo**, with price and stock alerts every 12 hours. Perch covers 5 competitors for $19.99. Prisync, the trusted brand with 244 reviews, starts at $49. Even a *managed* service with a human account manager charges £49–£299/mo for comparable coverage. **$300/mo for a weekly sheet is 6x the self-serve floor** and above the managed comparable.

Saturation: there are at least 6 Shopify apps, at least 7 Fiverr gigs and at least 6 Apify actors for Shopify competitor price/stock monitoring (see Attention). That is past the 15-identical-offers line.

### 3. Gross margin ≥50% at $300/mo: 🟡 conditional pass

**Monthly cost per client.** The cash cost of about $40/mo is plausible: a $5–10 VPS plus $10–30 of proxies. Shopify rivals expose a public `/products.json` feed with price and `available`, so they often need no proxy. Labour is what decides the margin. Loaded rate: $50/hr.

| Scenario | Labour (scraper fixes, QA, weekly note, client email) | Cost | Gross margin |
|---|---|---|---|
| All rivals on Shopify, automated sheet | 1.5 hr → $75 | $75 + $40 = $115 | ($300 − $115) / $300 = **62%** |
| Mixed platforms, one breakage a month | 3 hr → $150 | $150 + $40 = $190 | ($300 − $190) / $300 = **37%** |
| Anti-bot sites, re-matching new SKUs | 5 hr → $250 | $250 + $40 = $290 | ($300 − $290) / $300 = **3%** |

- **Breakeven for 50%:** labour must stay at or below ($150 − $40) / $50 = **2.2 hr/month per client**.
- **Setup:** the $500 fee has to cover matching up to 500 of the client's SKUs to equivalents at 5 rivals, which is up to 2,500 matches. At an estimated 8–15 hours (my estimate, not measured), that is $400–$750 of labour. **Setup runs at breakeven or a loss.**
- **Not counted:** sales cost and churn.

**Result:** the margin passes only when rivals are Shopify stores and nothing breaks. That is the same case where a $19–49 app does the job equally well.

### 4. Named watering holes: ✅ pass (but they point buyers to apps)

- **Reddit:** [r/ecommerce](https://www.reddit.com/r/ecommerce/) has most of the relevant threads (4 in 4 months). Also [r/shopify](https://www.reddit.com/r/shopify/) and [r/FulfillmentByAmazon](https://www.reddit.com/r/FulfillmentByAmazon/). Subscriber counts not verified.
- **[Shopify App Store](https://apps.shopify.com/):** this is where the buyer actually shops for this, and it surfaces $19–49 apps first.
- **[eCommerceFuel](https://www.ecommercefuel.com/):** a paid community of 7- and 8-figure store owners. Membership terms not verified.
- **Freelance sites:** Upwork (web-scraping and competitive-analysis categories), Fiverr and Freelancer.com.
- **Brand lists:** Shopify store lists from BuiltWith or Store Leads to build cold lists of $1–10M brands. Not checked here.

## Attention signal (30-day)

- **Buyers:** almost silent. In 30 days I found one survey-style r/ecommerce post (2026-10-30) and no clear "I need this done for me" post.
- **Sellers and builders, last 30 days on Reddit alone:**
  - Founder or tool launches: [Recon AI competitor intel](https://www.reddit.com/r/buildinpublic/comments/1xsdstc/i_built_an_ai_competitorintelligence_tool_to_stop/) (11-10), [rivalize](https://www.reddit.com/r/startupaccelerator/comments/1xl9p2i/building_rivalize_why_one_screenshot_of_a/) (11-01), [Trynaro](https://www.reddit.com/r/SideProject/comments/1xnw197/trynaro_checking_whether_a_lower_competitor_price/) (11-04), [Price Radar Shopify app](https://www.reddit.com/r/ShopifyApps/comments/1xewvxy/price_radar_a_competitor_price_tracker_to_make/) (10-25), [Blinkit/Zepto price+stock tracker](https://www.reddit.com/r/StartUpIndia/comments/1xfsplf/building_a_tool_to_track_prices_and_stock_across/) (10-26), PriceBot (10-30).
  - Tutorials or content marketing: a [contextdev tutorial](https://www.reddit.com/r/contextdev/comments/1xraene/build_a_competitor_pricing_change_tracker_with/), [AmazonFBA "how I check competitor listings"](https://www.reddit.com/r/AmazonFBA/comments/1xgwqkt/how_i_check_a_competitors_listing_changes_without/), [ScrapingPlaybook tool roundup](https://www.reddit.com/r/ScrapingPlaybook/comments/1xfs2ej/price_monitoring_tools_broken_down_by_use_case/), and [two near-identical "keeping prices competitive" posts](https://www.reddit.com/r/StartupConversation/comments/1xp9zjg/how_do_online_stores_keep_up_with_competitor/) (11-06).
  - Two Shopify apps went live in the last month: PricePulse (2026-10-09) and Perch.
- **Scrapling hype:** more than 10 copy-paste "Scrapling: Effortless Web Scraping (91k stars)" posts on user profiles between 11-03 and 11-09. This is a course-driven wave of sellers, not buyers. The star count is from those posts and is not verified.
- **Marketplaces:**
  - Fiverr gigs: [dashwise "weekly competitor pricing intelligence for your Shopify store"](https://fiverr.com/dashwise/provide-weekly-competitor-pricing-intelligence-for-your-shopify-store) (nearly this exact offer), [prabhath_u](https://fiverr.com/prabhath_u/track-competitor-product-prices-and-send-daily-reports-bbb9), [claudio_fox](https://fiverr.com/claudio_fox/monitor-competitor-prices-with-ai-automation-and-real-time-api-alerts), [iftesamulohy](https://fiverr.com/iftesamulohy/create-a-shopify-product-scraper-and-price-tracking-tool), [haseebsaleem_](https://fiverr.com/haseebsaleem_/build-an-automated-competitor-pricing-analysis-system) and others. Gig prices not verified (403).
  - Upwork: the [ValenTech agency](https://www.upwork.com/agencies/~01689a0476ce07cf99/) at $50/hr.
  - Apify: at least 6 "Shopify competitor price & stock monitor" actors priced per 1,000 products.
  - n8n: [templates](https://n8n.io/workflows/21414-monitor-competitor-prices-and-stock-with-gemini-google-sheets-and-slack-alerts/) for "competitor price + stock → Google Sheets + Slack". That is the exact deliverable, free.
- **Ratio:** at least 20 visible sellers or builders for about 2 visible buyers.

## What the video gets right / wrong

| Claim | Evidence | Verdict |
|---|---|---|
| Brands care about rival prices and sell-outs | Real pain in r/ecommerce and r/FBA threads. Prisync has 244 reviews at 4.9★. | ✅ Right. A budget exists, but it is a software budget. |
| $300/mo is a fair price | Self-serve floor is $19–49/mo for the same 5 competitors × 500 products, with alerts. A managed UK comparable is £49–299/mo. | ❌ Wrong. It is 6x the floor, for a *weekly* cadence that is slower than the $19 apps (daily or 12h). |
| About $40/mo cost | Cash cost is plausible. Labour is ignored: 2.2 hr/mo of fixes and QA erases the 50% margin, and SKU matching makes the $500 setup a loss. | 🟡 Half right |
| Easy to build with Scrapling | For Shopify rivals, `/products.json` is trivial, so it is so easy that apps and free n8n templates already do it. For non-Shopify sites with anti-bot, it is not easy, and scrapers break. | 🟡 Easy only where it is worthless |
| Target: Shopify DTC brands with 50–500 products | DTC brands mostly sell **their own products**, so a rival has no identical SKU to compare. Price monitoring creates value where **the same SKU is sold by several stores** (resellers, electronics, supplements, Amazon). | ❌ Wrong buyer for the deliverable |
| Buyers are out there asking | About 2 tight signals in 60 days. Sellers outnumber buyers about 10:1. | ❌ Not supported |

## Verdict: ❌ REJECT

**Deciding reason:** check 1 fails badly, with about 2 tight buyer signals against a bar of 20. Check 2 caps the price: $19–$49/mo Shopify apps already deliver price and stock alerts for 5 competitors × 500 products, faster than weekly. A done-for-you sheet at $300/mo has no visible buyer and an obvious cheaper substitute. Supply, from course-driven sellers, apps and Fiverr gigs, is growing faster than demand.

**Better-angled versions** (hypotheses, not validated here; each needs its own Gate 0):
1. **MAP / reseller price-compliance monitoring for brands.** A brand with 20–200 authorized retailers or Amazon sellers wants to know who breaks minimum advertised price. The same SKU appears across many sellers, so the comparison is clean, and enforcement is worth real money. Price2Spy already sells "MAP monitoring" and screenshot evidence as a module, which suggests budget exists. Test price: $300–800/mo. Demand not verified.
2. **Multi-brand retailers in fast-moving categories** (PC components, supplements, tools, auto parts). Identical SKUs and frequent price moves fit here. Supporting signals: the r/ecommerce electronics/RAM post (2026-07-16), Trynaro targeting PC retailers, and an FBA supplement price scraper post. Price would have to sit near the managed comparable, roughly $100–200/mo, or come bundled with repricing actions.
3. **If keeping the DTC buyer:** do not sell monitoring. Sell a monthly **competitor teardown**: price moves, promotions, new launches, bundles and ad angles, with a recommendation. Particl at $250/mo for 5 competitors is the anchor. That is closer to strategy work than to scraping, and it needs its own demand test.
