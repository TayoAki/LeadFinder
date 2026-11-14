# Viral research: multi-seller marketplace app

Working doc, researched 2026-11-14. Every figure below links to a page that was opened and read. Anything from memory is marked *approximate*. Many numbers are company-reported (Shopify, Branch, Whatnot, Poshmark), so treat them as directional, not audited.

## 1. Summary

Commerce apps that spread do not rely on one viral trick. They stack several loops: **sellers market their own shops and bring their buyers with them** (Etsy, Poshmark, Depop, TikTok Shop creators, Whatnot hosts). **Every product, shop and purchase becomes a shareable card** that deep-links to the exact item. A **two-sided reward** pays both the inviter and the new user. **Time-boxed events** (drops, parties, later live shows) give people a reason to come back now. Non-commerce hits add three lessons. Show value before asking for anything (Cal AI, Baymard). Make the shared artifact spoiler-free and recognisable at a glance (Wordle, Locket). Build habit through streaks and leaderboards, but rate-limit notifications (Duolingo, 4.5x DAU). Growth also follows a constrained launch. Start with one niche, seed supply yourself if you have to (Whatnot's founders sold their own Funko Pops), then widen. For our app, this means a guest-browsable feed of real shops within seconds, one cart across sellers, a seller mode whose main job is getting sellers to share their shop link, a "give £X, get £X" referral that the deep link applies automatically, and scheduled shop "drops" that turn into live shopping in phase 2. Measure k-factor by cohort and find a buyer "aha" threshold (e.g. N shops followed in the first week) before scaling spend.

## 2. Viral principles

### P1. One job, said in the name and on the first screen
**Evidence:** Apple's guidance is a name that is "simple, memorable … easy to spell and hints at what your app does", with the subtitle used "to explain the value of your app in greater detail" ([Apple](https://developer.apple.com/app-store/product-page/)). Cal AI did one thing, photo calorie counting. It reached 20–30k downloads a day, and the founders dropped other app ideas because it "deserved all of our attention" ([Latka](https://getlatka.com/companies/calai.app/interviews/cal-ai-zach-yadegari-2025)).
**Apply:** The pitch is "Shop independent sellers. One cart." It appears in the App Store subtitle, the splash screen and the empty-cart state. Avoid a generic "everything store" home screen and lead with shops and makers.

### P2. Value before signup; one cart, one fast checkout
**Evidence:** 18% of shoppers abandon checkout when forced to create an account. Baymard recommends making "Continue as guest" the most prominent option and delaying account creation until the confirmation step ([Baymard](https://baymard.com/blog/reduce-cart-abandonment)). At Cal AI, moving sign-in to the end of onboarding was the biggest single drop-off fix ([Latka](https://getlatka.com/companies/calai.app/interviews/cal-ai-zach-yadegari-2025)). Shopify reports that Shop Pay orders have 15% higher AOV and that buyers have a 77% likelihood of repurchasing with it within 12 months (company data) ([Shopify/Everlane](https://www.shopify.com/case-studies/everlane)); Etsy's app drove 42% of 2024 GMS ([Etsy](https://investors.etsy.com/news-events/press-releases/detail/13/etsy-inc-reports-fourth-quarter-and-full-year-2024-results)). Shopping apps retain only about 18% of users on day 1 and about 5% on day 30 (*approximate*, from an Adjust snippet whose page rate-limited us), so the first session has to deliver value.
**Apply:** The app opens straight into a product feed with no auth wall. Wishlist, cart and follow work as a guest. Use Apple Pay / Google Pay and one checkout across sellers. Show per-seller shipping in the cart so it is not a surprise later (extra costs are the #1 abandonment reason at 40%, per Baymard). Account creation is a one-tap passkey/Apple sign-in after payment.

### P3. Start narrow and seed supply yourself
**Evidence:** Whatnot started with the founders' own Funko Pop collection. Their first livestream sold out in about 2.5 hours for about $5k ([Fortune](https://fortune.com/2026/08/07/how-whatnots-founders-turned-100-investor-rejections-into-an-20-billion-live-shopping-rocket-ship/)). They also listed items they didn't own yet and bought them on eBay when they sold ([YC](https://www.ycombinator.com/blog/first-five-launches-with-whatnot)). Today Whatnot has 1B orders, 250+ categories and 20M new users this year (Fortune). Lenny's marketplace research says early marketplaces were constrained "by geo or by category" ([Lenny](https://www.lennysnewsletter.com/p/how-to-kickstart-and-scale-a-marketplace-2e5)). Etsy recruited sellers at craft fairs ([Lenny](https://www.lennysnewsletter.com/p/how-the-biggest-consumer-apps-got)). Gas launched school by school and passed 500k downloads while live in only 12 states ([The Hustle](https://thehustle.co/10-18-22-gas-app)).
**Apply:** Launch with one vertical, such as handmade/vintage or a single city's makers, with 50–100 hand-onboarded shops. Use a curated "Featured makers" rail so the feed never looks empty. Seller onboarding should be concierge (we import their Etsy/Shopify/IG listings).

### P4. Sellers bring their buyers (supply drives demand)
**Evidence:** Supply driving demand was an effective lever for more than 40% of marketplaces Lenny studied. Word of mouth was the top channel for more than half of them ([Lenny](https://www.lennysnewsletter.com/p/how-to-kickstart-and-scale-a-marketplace-2e5)). At Poshmark, about 100k new sellers join each month and more than 75% of sales come from repeat shoppers ([Retail Dive](https://www.retaildive.com/news/how-poshmark-made-1b-off-the-social-mall/529343)). Depop lets sellers share their stores to Instagram and Stories ([Glossy](https://www.glossy.co/fashion/how-depop-is-catering-to-gen-z-and-millennials-to-get-an-edge-over-resale-competitors)). Influencers generated US$5.4B, or 60%, of TikTok Shop US GMV in 2024 (*search snippet of Momentum report; page 403*). Vinted's CEO: "We needed to support the sellers first to attract buyers". Removing seller fees drove its turnaround ([TNW](https://thenextweb.com/news/vinted-ceo-thomas-plagenta-interview-second-hand-fashion)).
**Apply:** Seller mode puts "Share your shop" first. That means a link, a QR poster, an IG Story template and a "new drop" post generator. Sellers can track "buyers you brought" in their dashboard and get a fee discount or boost credits for buyers they refer. Optional later step: an affiliate/creator commission on shared product links.

### P5. Every object is a shareable, recognisable artifact
**Evidence:** Wordle grew from about 90 to about 2M daily users. 1.2M emoji-grid tweets were sent in 13 days, and the grid was spoiler-free and instantly recognisable ([BuzzFeed News](https://www.buzzfeednews.com/article/stefficao/how-wordle-went-viral-strategy)). Locket hit #1 on the US App Store with more than 2M sign-ups within days. One user's TikTok demo got more than 5M views in a day, with no paid ads ([TechCrunch](https://techcrunch.com/2022/01/11/locket-an-app-for-sharing-photos-to-friends-homescreens-hits-the-top-of-the-app-store)). Shein "haul" videos on TikTok are user content made from purchases ([WTOP/CNN](https://wtop.com/social-media/2021/08/the-mysterious-chinese-fashion-app-thats-as-popular-as-amazon/)).
**Apply:** Product, shop, wishlist and order ("my haul") each get a share button. Each one generates a branded image card with photo, price, shop name, app word-mark and a short link (OG tags for iMessage/WhatsApp previews). Add a post-purchase "Share your haul" card that hides the prices if the user wants.

### P6. Two-sided referral reward at high-intent moments
**Evidence:** Dropbox gave 500MB to both sides. Referrals were 35% of daily signups, and growth went from about 100k to about 4M users. The ask appeared in the welcome email, the onboarding checklist, the upgrade screen and thank-you emails, and rewards were applied automatically ([Referral Rock](https://referralrock.com/blog/dropbox-referral-program/)). Uber said about 30% of early trips came from referrals ([Lenny](https://www.lennysnewsletter.com/p/how-to-kickstart-and-scale-a-marketplace-2e5)). Temu pays cash for referrals and runs an affiliate program worth up to $100k/month ([Kolsquare](https://www.kolsquare.com/en/blog/temu-the-marketing-strategy-that-outperformed-amazon)). Whatnot Drop gave raffle tickets for sharing referral codes ([YC](https://www.ycombinator.com/blog/first-five-launches-with-whatnot)).
**Apply:** Use a reward like "Give £5, get £5" on the first order over £X. Show it on the order confirmation, the profile tab, the share sheet and the empty-cart/wallet screen. Credits apply automatically through the deep link, with no codes to type. Avoid Temu-style "invite to unlock" walls. They work, but they can damage trust (*approximate*; teardown page 403).

### P7. Deep links carry context (and the reward) through install
**Evidence:** With deferred deep linking, Jora saw 80% more installs, and new users landed on the exact listing they had tapped ([Branch](https://www.branch.io/resources/blog/how-jora-increased-app-installs-by-80/)). Andrew Chen notes that about half of a product's viral factor comes from the first session ([Chen](https://andrewchen.substack.com/p/braindump-on-viral-loops)). A shared link that dumps a new user on a generic home screen wastes that session.
**Apply:** Universal/App Links plus a deferred deep-link provider (e.g. Branch or Expo Linking with a server-side attribution fallback). A shared product link opens that product, even straight after install. It shows "Sam sent you £5", with the credit already in the wallet. Every shared link also has a web fallback page so non-installers can still see the product.

### P8. Visible, verified social proof
**Evidence:** A product with 5 reviews has a 270% higher purchase likelihood than one with none. A verified-buyer badge adds 15%. Purchase likelihood peaks at 4.0–4.7 stars ([Spiegel/Northwestern](https://spiegel.medill.northwestern.edu/How-Online-Reviews-Influence-Sales)). Poshmark sellers build relationships that drive repeat buying ([Retail Dive](https://www.retaildive.com/news/how-poshmark-made-1b-off-the-social-mall/529343)).
**Apply:** Product cards show stars and review count. Shop headers show rating, items sold, followers and "ships in X days". Add a "Verified buyer" badge on reviews. Prompt for a review, with an optional photo, after delivery. New shops get a "New maker" badge rather than empty stars.

### P9. Time-boxed events and honest scarcity
**Evidence:** Posh Parties are themed, timed sales, described as "tupperware meets Facebook Live meets a Gilt flash sale" ([Retail Dive](https://www.retaildive.com/news/how-poshmark-made-1b-off-the-social-mall/529343)). BeReal's daily 2-minute window helped it reach about 15M DAU in Oct 2022, but DAU fell to about 6M by spring 2023 ([Wikipedia](https://en.wikipedia.org/wiki/BeReal)), so novelty fades. Shein added up to 500 new items a day and became the most-installed US shopping app in May 2021 ([WTOP/CNN](https://wtop.com/social-media/2021/08/the-mysterious-chinese-fashion-app-thats-as-popular-as-amazon/)).
**Apply:** Sellers schedule "Drops" with a countdown and a "Remind me" button. Shops can join themed weekly "Markets" (e.g. "Sunday Vintage Market"). Show real "Only 2 left" stock counts. In phase 2, a Drop becomes a live show and its reminder becomes "Going live". Never fake timers or stock.

### P10. Habit loops: follow, streaks, points
**Evidence:** Duolingo grew DAU 4.5x in four years. Streak features nearly tripled the share of DAU on 7+ day streaks, and leaderboards raised learning time by 17% ([Lenny/Duolingo](https://www.lennysnewsletter.com/p/how-duolingo-reignited-user-growth)). Shein users earn points for opening the app and watching streams, and describe it as "pretty addictive" ([WTOP/CNN](https://wtop.com/social-media/2021/08/the-mysterious-chinese-fashion-app-thats-as-popular-as-amazon/)). Poshmark users open the app 7–9 times a day ([Retail Dive](https://www.retaildive.com/news/how-poshmark-made-1b-off-the-social-mall/529343)).
**Apply:** Follow shops and get a "New from shops you follow" feed. Wishlist items trigger price-drop and back-in-stock alerts. A light reward, such as a "Collector" level for supporting N independent shops, is better than coin-farming games. Sellers get a selling streak (listed or shipped this week) plus "Top shop this week" badges.

### P11. Notifications are earned and rate-limited
**Evidence:** Airship found that opted-in users had 2.9x higher D30 activation at one airline, and that onboarding campaigns lifted opt-in up to 40% above category average. iOS Retail opt-in sits at 18.1% at the 10th percentile, and generic promo blasts drive opt-outs ([Airship](https://www.airship.com/mobile-app-push-notification-benchmarks-for-2026/)). At Duolingo, adding notifications required CEO approval ([Lenny/Duolingo](https://www.lennysnewsletter.com/p/how-duolingo-reignited-user-growth)).
**Apply:** Don't ask for push permission at launch. Show a soft prompt in context, such as tapping "Remind me" on a Drop, following a shop, or after an order ("Get delivery updates?"). Add a per-type preference centre. Every push must name a shop or item the user chose.

### P12. Buyers become sellers (demand drives supply)
**Evidence:** At Square, about 1% of buyers became merchants. 34% of Eventbrite creators first heard of it by attending other creators' events. Eventbrite more than tripled demand-to-supply conversion with CTAs on high-traffic pages such as post-purchase screens and navigation. Typical conversion is 0.5–5% ([Lenny](https://www.lennysnewsletter.com/p/demand-driving-supply-marketplaces)).
**Apply:** Put "Sell on [App]" in the profile tab and in the post-purchase screen ("Got things to sell? Open a shop in 2 minutes"). Seller mode is a toggle in the same account, with no new signup.

**Measure the loops.** Chen: track k-factor as a cohort ratio and aim for more than 0.5, because "Everything underneath that number almost isn't worth it" ([Chen](https://andrewchen.substack.com/p/braindump-on-viral-loops)). Find a buyer aha threshold by correlating early actions with 28-day retention, then confirm it with an A/B test, the way Facebook found "7 friends in 10 days" ([Andrew Chen](https://andrewchen.com/my-quora-answer-to-how-do-you-find-insights-like-facebooks-7-friends-in-10-days-to-grow-your-product-faster/)). Candidate thresholds: 3 shops followed in 7 days, or a first order within 14 days.

## 3. Naming and logo

**Rules**
1. **Length:** 1–2 syllable words, 5–9 letters, easy to spell aloud. The App Store name can be up to 30 characters ([Apple](https://developer.apple.com/app-store/product-page/)), so use the name plus a short keyword: "Stalls: Indie Shops" fits.
2. **Says what it does:** Use the name or its first word to point at *independent sellers* or the *market/cart*. Put the full promise in the 30-char subtitle, e.g. "Shop small sellers, one cart" (28). Fill the 100-char keyword field with terms not already used, skip plurals and "app", and don't use competitor names (Apple's rules).
3. **Icon:** Apple says "simple and recognizable" and to avoid unnecessary detail. Use a single bold glyph, such as a letter or awning/stall shape, rather than the full word-mark, because a word-mark is unreadable at 60px. Put the word-mark on the splash screen, the share cards and the web page so the name is seen everywhere the icon isn't. Test recognisability with 5-second recall tests on 2–3 icon options.
4. **Distinct:** Avoid generic terms and names similar to existing apps (Apple). Check exact-match App Store and Play search, the .com/.app domain, @handles on IG and TikTok, and USPTO/UKIPO/EUIPO for Classes 35 (retail marketplace services) and 9 (software). **None of the checks below are legal clearance.** Get a trademark search done before committing.
5. **Extends to live:** The name should still work for "going live at your ___" in phase 2.

**Candidates** (quick web/App Store search only, not a legal check)
| Name | Rationale | Quick-check result |
|---|---|---|
| **Stalls** | Market stalls of independent sellers. "Go live at your stall" fits phase 2. Short, iconic awning glyph. | No exact-name app found. Similar small apps exist ("UrbanStall", "LocalStalls") ([search](https://apps.apple.com/tt/app/urbanstall/id1357209470)). "Stall" also means delay, a minor risk. |
| **IndieCart** | Literally "independent sellers, one cart", the core differentiator. | Only a hobby GitHub project found, no major app. "Indie" can read as games/music. |
| **Stallfront** | Stall + storefront, so each seller has a front. | Nothing major found (not deeply checked). |
| **Indiemart** | Indie + mart, which is clear for a marketplace. | Not checked in depth. "-mart" feels discount-y. |
| **Marketsquare** | Town-square market of many sellers, suits live events. | Generic phrase, so hard to trademark. Many local businesses use it (*approximate*). |
| **Smallcart** | Small sellers, one cart. | No app found in the quick search. Closeness to Amex's "Shop Small" is a risk. |
| **Shopsy** | Catchy. | **Taken**: Flipkart's Shopsy, 330M+ downloads ([Flipkart](https://stories.flipkart.com/announcement/shopsy-evolves-into-an-ai-native-engagement-led-commerce-platform-built-for-gen-z-and-bharat-s-next-100-million-shoppers)). Avoid. |
| **OneCart** | Says "one cart". | **Taken**: "OneCart: Shopping On Demand", a South African multi-retailer marketplace app ([App Store](https://apps.apple.com/app/id1438395604)). Avoid. |
| **Haul** | Gen-Z "haul" culture, shareable. | **Taken**: Amazon Haul ([Amazon](https://aboutamazon.com/news/retail/affordable-products-amazon-20-dollars-and-under)). Avoid. |
| **Shop Small** | Says exactly what it does. | **Registered trademark of American Express** ([Amex](https://www.americanexpress.com/content/dam/amex/us/merchant/images/SSRH/ShopSmall_MarketingGuide.pdf)). Avoid. |

**Recommendation:** **Stalls**, with "Stalls: Indie Shops" as the store name and "Shop small sellers, one cart" as the subtitle. It is short and pictorial (awning icon), it suits live selling in phase 2, and it shows no major conflict in a quick search. Runner-up: **IndieCart**, the most literal option, with a weaker icon.

## 4. Scoring rubric (100 points)

Score each criterion 0–10 using the anchors, multiply by the weight, and divide by 10. Score from screen recordings of a fresh install on a clean device.

| # | Criterion (weight) | 0 | 5 | 10 |
|---|---|---|---|---|
| 1 | **Clarity of job** (10): store name+subtitle, splash and first screen say "independent sellers, one cart" | Generic name/tagline, and the first screen doesn't show shops | Subtitle explains it, but the in-app first screen is generic | Name hints at it, subtitle states it, and the first screen shows real shops/makers with a one-line promise. A stranger can say what the app does after 5s |
| 2 | **Time to first product, no signup** (10) | Auth wall before any product | Products shown after 1–2 skippable screens, or in 5–10s | Product feed in under 5s from cold start, and wishlist, follow and add-to-cart all work as a guest |
| 3 | **One-cart checkout** (10) | Separate checkout per seller, or forced account before paying | Single cart, but no wallet pay or a forced account | Single cart across sellers with per-seller shipping shown up front, Apple/Google Pay, guest pay, and the account created after payment |
| 4 | **Shareable cards** (10) | No share action, or plain URL only | Share on product only, with a basic OG preview | Product, shop, wishlist and order/haul each have a share button that produces a branded image card (photo, price, shop, word-mark) plus a rich link preview |
| 5 | **Two-sided referral** (10) | None | Referral exists, but in one place only, one-sided, or code-based | "Give X, get X" visible in ≥3 places (order confirmation, profile, share sheet or wallet), applied automatically through the link, with progress shown |
| 6 | **Seller brings buyers kit** (10) | Seller mode has no sharing tools | Shop link only | Seller home leads with share tools (link, QR, story template, drop post) plus "buyers you brought" stats and a seller referral reward |
| 7 | **Deep-link continuity** (8) | Links open the store or home screen | Links open the right screen only if the app is already installed | Link opens the exact item after a fresh install, with the referral credit shown, and non-installers get a web fallback page |
| 8 | **Social proof** (8) | No ratings shown | Ratings on product page only | Stars and count on cards, shop header with rating/sold/followers, verified-buyer badges, photo reviews, a post-delivery review prompt, and a "New maker" badge for new shops instead of zero stars |
| 9 | **Events and honest scarcity** (7) | Static catalogue | Countdown or low-stock labels, but no scheduling | Sellers can schedule Drops with a countdown and "Remind me", real stock counts, and a themed Markets/events surface that is ready to become live in phase 2 |
| 10 | **Habit loop** (6) | No reason to return | Follow shops OR wishlist alerts | Followed-shops feed, price-drop/back-in-stock alerts, and a light streak/level for buyers and sellers |
| 11 | **Notification permission** (5) | OS prompt on first launch | Prompt after onboarding without context | Soft prompt only at an intent moment (Remind me, follow, post-order), plus a per-type preference centre |
| 12 | **Buyer to seller conversion** (6) | Selling requires a separate app/signup | "Sell" buried in settings | "Sell on [App]" in profile and post-purchase, and seller mode is a same-account toggle with a first listing live in under 2 min |

Weights: 10+10+10+10+10+10+8+8+7+6+5+6 = **100**.

## 5. Sources (opened)

- Apple, App Store product page guidance: https://developer.apple.com/app-store/product-page/
- Lenny's Newsletter, How Duolingo reignited user growth: https://www.lennysnewsletter.com/p/how-duolingo-reignited-user-growth
- Lenny's Newsletter, Demand driving supply: https://www.lennysnewsletter.com/p/demand-driving-supply-marketplaces
- Lenny's Newsletter, Kickstart and scale a marketplace (pt 4): https://www.lennysnewsletter.com/p/how-to-kickstart-and-scale-a-marketplace-2e5
- Lenny's Newsletter, How consumer apps got first 1,000 users: https://www.lennysnewsletter.com/p/how-the-biggest-consumer-apps-got
- Andrew Chen, Braindump on viral loops: https://andrewchen.substack.com/p/braindump-on-viral-loops
- Andrew Chen, Finding "7 friends in 10 days": https://andrewchen.com/my-quora-answer-to-how-do-you-find-insights-like-facebooks-7-friends-in-10-days-to-grow-your-product-faster/
- Retail Dive, Poshmark: https://www.retaildive.com/news/how-poshmark-made-1b-off-the-social-mall/529343
- Glossy, Depop: https://www.glossy.co/fashion/how-depop-is-catering-to-gen-z-and-millennials-to-get-an-edge-over-resale-competitors
- The Next Web, Vinted CEO interview: https://thenextweb.com/news/vinted-ceo-thomas-plagenta-interview-second-hand-fashion
- Fortune, Whatnot (Aug 2026): https://fortune.com/2026/08/07/how-whatnots-founders-turned-100-investor-rejections-into-an-20-billion-live-shopping-rocket-ship/
- Y Combinator, First five launches with Whatnot: https://www.ycombinator.com/blog/first-five-launches-with-whatnot
- Referral Rock, Dropbox referral program: https://referralrock.com/blog/dropbox-referral-program/
- Kolsquare, Temu marketing strategy: https://www.kolsquare.com/en/blog/temu-the-marketing-strategy-that-outperformed-amazon
- WTOP/CNN, Shein: https://wtop.com/social-media/2021/08/the-mysterious-chinese-fashion-app-thats-as-popular-as-amazon/
- BuzzFeed News, How Wordle went viral: https://www.buzzfeednews.com/article/stefficao/how-wordle-went-viral-strategy
- TechCrunch, Locket: https://techcrunch.com/2022/01/11/locket-an-app-for-sharing-photos-to-friends-homescreens-hits-the-top-of-the-app-store
- The Hustle, Gas: https://thehustle.co/10-18-22-gas-app
- Wikipedia, BeReal: https://en.wikipedia.org/wiki/BeReal
- Latka, Cal AI founder interview: https://getlatka.com/companies/calai.app/interviews/cal-ai-zach-yadegari-2025
- Baymard, Reduce cart abandonment: https://baymard.com/blog/reduce-cart-abandonment
- Spiegel Research Center, How online reviews influence sales: https://spiegel.medill.northwestern.edu/How-Online-Reviews-Influence-Sales
- Airship, Push benchmarks 2026: https://www.airship.com/mobile-app-push-notification-benchmarks-for-2026/
- Shopify, Everlane / Shop Pay case study: https://www.shopify.com/case-studies/everlane
- Branch, Jora deferred deep linking: https://www.branch.io/resources/blog/how-jora-increased-app-installs-by-80/
- Etsy Q4/FY2024 results (app = 42% of GMS): https://investors.etsy.com/news-events/press-releases/detail/13/etsy-inc-reports-fourth-quarter-and-full-year-2024-results

Name checks were search-result level only (not opened in full): Flipkart Shopsy, App Store OneCart / UrbanStall listings, Amazon Haul, Amex Shop Small marketing guide. Some figures (TikTok Shop 60% creator GMV, Adjust retention, Temu "invite to unlock") came from search snippets of pages that returned 403/429 and are marked *approximate* above.
