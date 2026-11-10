# App Builder: competitors and store rules

Date: 2026-11-10. Prepared for the "App Builder" idea: prompt → planned screens → canvas → Expo/React Native app for iOS and Android, with onboarding, a paywall, App Store metadata and screenshots built in. "Start free with 100 credits." Also covers the option of tailoring it to e-commerce stores ("instant iOS apps").

How to read this:
- **Verified** means I saw it on the vendor's own page, the Shopify App Store, Apple's or Google's policy page, or the Meta Ad Library today.
- **Reported** means it comes from press or a third-party site, and I did not check the primary source.
- **Unverified** means the sources conflict or there is only one weak source.
- Many "AI app builder" blog posts come from competitors (vp0, RapidNative, Newly, CatDoes, Superapp, Adalo), so I treat their claims about rivals as biased.
- Several pricing pages (rork.com, a0.dev, anything.com) render with JavaScript, so in places I used each vendor's docs instead.

---

## Part A. AI mobile app builders

### A1. Summary table

| Builder | Funding | Live price (entry → top) | Output | App Store help | Payments / paywall | Target user |
|---|---|---|---|---|---|---|
| **Rork** | $2.8M seed in 2025 (a16z speedrun), then [$15M seed in Apr 2026](https://pulse2.com/rork-15-million-raised-for-ai-mobile-app-creation-platform) led by Left Lane, with Peak XV and True. About $17.8M total. Reported. | **Verified in [docs](https://docs.rork.com/introduction/subscriptions):** Free (design mode only, 35 credits/mo, no build or publish). Pro $20/mo for 100 credits. Max from $200/mo (1,000 credits) up to $1,800/mo (10,000 credits). Top-ups cost $0.22 per credit. | Native SwiftUI for iPhone and Kotlin/Compose for Android, per the docs. Earlier versions were React Native/Expo. | Rork Max claims ["one-click" App Store and TestFlight submission](https://rork.com/max) using cloud Macs. Its FAQ says "two-click." It also has an ["AI reviewer"](https://rork.com/ai-reviewer) page aimed at App Store approval. I saw no screenshot or ASO tooling. | Has a [RevenueCat gift program](https://rork.com/revenuecat-gift): connect RevenueCat to earn up to 1,000 free credits based on app revenue. | Solo "App Store entrepreneurs." Its 2026 ads now pitch to small businesses (see A3). |
| **Vibecode** | [$9.4M seed in Aug 2025](https://finder.techleap.nl/news/feed/neo-joins-vibecode-s-9-4m-seed-round) led by Seven Seven Six. Reported. | **Verified in [docs](https://www.vibecodeapp.com/docs/getting-started/plans-and-credits):** Plus $20, Pro $50, Max $200 per month, with credits roughly equal to the price. The free plan has no App Store submission and no code download. | Mobile and web apps. It is built inside an iPhone app, with an Expo-style flow (the docs mention Expo tokens for submission). The site also mentions native Swift. | Publishes to the App Store. The docs blame failed submissions mostly on expired Expo tokens. | A tutorial says the agent creates the IAP products. Unverified. | Consumers and non-coders on iPhone. Its iOS app shows 4.6★ from 3,324 ratings ([site](https://www.vibecodeapp.com/), Oct 2026). |
| **Anything** (formerly Create.xyz) | [$8.5M seed](https://www.pymnts.com/?p=2924353), then an [$11M Series A at a $100M valuation](https://dataconomy.com/2025/09/30/anything-raises-11m-for-ai-app-building-platform) in Sep 2025. Reported. | **Verified ([pricing](https://www.anything.com/pricing)):** Free tier, Pro $19/mo (20K credits), Max $199/mo, and Teams on request. | Web and mobile (Expo/React Native, per press). | The plan table has a "Submit to App Store" row. Its own iOS app was [removed from the App Store twice](https://techcrunch.com/2026/04/14/how-vibe-coding-app-anything-is-rebuilding-after-getting-booted-from-the-app-store-twice/) in March–April 2026 under 2.5.2. | It is a RevenueCat partner ([page](https://www.revenuecat.com/partners/technology/partner/anything)). | Non-coders. Press reported "$2M ARR in 2 weeks" and "700K users." Unverified. |
| **a0.dev** | Not found. | Unverified: free plan with 1 project, Pro around $20/mo, top tier around $800/mo ([vp0, a competitor](https://vp0.com/blogs/a0-dev-pricing-2026-explained)). | React Native/Expo. | Store publishing on Pro is claimed. Unverified. | Not found. | Hobbyists and game prototypers (r/a0dev). |
| **Bolt (bolt.new)** | StackBlitz raised $105.5M Series B in Jan 2025. From memory, not re-checked. | Starts around $25/mo with token billing. Unverified. | Web-first. Mobile output comes through the [Expo integration](https://expo.dev/blog/bolt-expo-integration-announcement). | None built in. You export and then use EAS build/submit yourself ([Median guide](https://median.co/blog/bolt-new-how-to-publish-app)). | None built in. | Web builders who also want a mobile app. |
| **Lovable** | Raised $200M at a $1.8B valuation in Jul 2025. From memory, not re-checked. | From about $25/mo. | **Web only.** It launched its own iOS/Android *companion* app on [27 Apr 2026](https://ecommercenews.com.au/story/lovable-launches-mobile-app-for-building-websites-on-the-go), but output is still React web. Native apps require Capacitor or Despia wrappers. | None. | Stripe for web. | Web founders. |
| **Replit** | Raised $250M at a $3B valuation in Sep 2025. From memory. | Core about $20–25/mo plus usage. Unverified. | Expo/React Native ([docs](https://docs.replit.com/replitai/building-mobile-apps)). | Since [Jan 2026](https://www.vktr.com/ai-news/replit-launches-mobile-app-builder-with-direct-app-store-path/) it has a guided TestFlight and App Store path through **Expo Launch**. Play Store publishing was limited at launch. | Not built in. | Prosumers and devs. Its iOS app had updates blocked by Apple in [Mar 2026](https://macrumors.com/2026/03/18/apple-blocks-updates-for-vibe-coding-apps). |
| **FlutterFlow / DreamFlow** | Raised $25.5M Series A in 2024. From memory. | Basic $39, Growth about $80 for the first seat, Business about $150. Sources conflict ([PricingSaaS](https://pricingsaas.com/companies/flutterflow)). DreamFlow (the AI product) runs $0, $20 and $90/mo. Unverified. | Real Flutter/Dart code with export. | One-click deploy on paid plans. | RevenueCat and Stripe integrations. | Agencies and semi-technical builders. |
| **Draftbit** | Not checked. | About $20/mo Standard after a 2025–26 relaunch as an "AI agent sandbox" ([Adalo review, a competitor](https://www.adalo.com/posts/draftbit-review/)). Unverified. | React Native with code export. | iOS and Android publishing claimed. | Not found. | Devs and agencies. |
| **Natively** | Not found. | About $49/mo, or $699 lifetime ([vp0](https://vp0.com/blogs/natively-pricing-plans-2026/)). Unverified. Possibly a different product from natively.dev. | Website-to-app wrapper, per vp0. | Store publishing claimed. | Not found. | SMB websites. |
| **Bitrig** (YC S25) | $125K–$500K (YC). Sources conflict. | Free plus Pro at about $25/mo. Unverified ([Toolify](https://www.toolify.ai/tool/bitrig)). | Native Swift/SwiftUI with a full Xcode project. Runs as a Mac and iPhone app. | Ships to the App Store, per the vendor. | It is a [RevenueCat partner](https://www.revenuecat.com/partners/technology/partner/bitrig). | iPhone-first hobbyists. |
| **Superapp** (2025 entrant) | [$1.6M pre-seed, Mar 2026](https://raising.fi/news/superapp-pre-seed-march-2026). Reported. | Free (5 credits/day), Pro $25, Business $50, Max $100 ([pricing](https://www.superappp.com/pricing.md)). | Native Swift for iOS and macOS. | Built-in App Store submission. It **drafts the App Store listing**. | **Connects a RevenueCat paywall**, per its own roundup. | Non-coders targeting iOS. |
| **Newly** (2025–26 entrant) | Not found. | Starter $25/mo with 50 credits. Unverified ([aiidelist](https://aiidelist.com/ide/newly)). | React Native/Expo plus an iOS builder. Compiles a signed .ipa on a remote Mac. | Submits to App Store Connect. Publishes many SEO guides on 4.3 and the Google 12-tester rule. | It is a [RevenueCat partner](https://www.revenuecat.com/partners/technology/partner/newly). | Non-coders. |
| **Other new builders** | — | vp0, RapidNative (free, from $20), CatDoes (from $17), Modaal (from €9, Swift+Kotlin), Nativeline (from $25), Famous.ai, Base44 (web, Wix-owned). See [Reddit list of 19 tools](https://www.reddit.com/r/vibecoding/comments/1wav34n/what_the_best_ai_mobile_builder_there_are_19_of/). | Mixed. | Mixed. | — | — |
| **Adalo** | Not checked. | Flat pricing: Starter $36, Pro $52, Team $160 (annual). Reported. | Native React Native per Adalo. | Publishing on paid plans. | IAP component. | No-code SMB builders. |
| **Thunkable** | Not checked. | Free (no publishing), Builder $59/mo (1 live app), Advanced $189/mo ([Adalo review](https://www.adalo.com/posts/thunkable-review/)). Unverified. | React Native based. | Publishing on paid plans. | Has IAP. | Education and SMB. |
| **Bubble mobile** | Not checked. | Separate Mobile and Web+Mobile plan tracks since Oct 2025. Starter $59/mo ([pricing](https://bubble.io/pricing)). Mobile prices not confirmed. | React Native ([Bubble blog](https://bubble.io/blog/native-mobile-beta/)). Was in public beta in 2025. | Publishes directly to both stores from the editor. | Bubble plugins. | Existing Bubble web users. |

Supporting tools that compete with parts of the pitch:
- [**Expo Launch**](https://expo.dev/blog/introducing-expo-launch) gets an Expo or React Native app to the App Store "without configuration or a terminal." It is also what Replit uses.
- **RevenueCat Paywalls AI Editor** ([App Growth Annual 2026](https://www.revenuecat.com/blog/company/everything-we-announced-at-app-growth-annual-2026.md)) builds a paywall from a prompt.
- **Screenshot and ASO tools** include AppScreenshotStudio (launched May 2026), Stora, and Push My App.

Each piece of the "last mile" exists as a separate tool. Few builders bundle all of it.

### A2. What users complain about (Reddit, 2026)

| Complaint | Evidence |
|---|---|
| **The last mile to the App Store is the biggest pain** | An Expo dev with 50+ apps shipped wrote ["I get hired to finish vibe-coded apps. They almost always break in the same places right before the App Store"](https://www.reddit.com/r/AppBusiness/comments/1xpj41x/i_get_hired_to_finish_vibecoded_apps_they_almost/) (297 upvotes, 6 Nov 2026). The list: crash in the EAS build but not in Expo Go (rejected under 2.1), secret keys in the bundle, no in-app account deletion (5.1.1), Google login without Sign in with Apple (4.8), paywall missing restore/price/terms (3.1.1/3.1.2), no demo login for the reviewer, iPad layout broken when `supportsTablet` is on, and Google's 12-tester rule. |
| **Many rounds of rejection** | ["Vibe coding got me a working app in weeks. Apple review took 3 months and 10+ rejections"](https://www.reddit.com/r/vibecoding/comments/1vpf5sp/vibe_coding_got_me_a_working_app_in_weeks_apple/). Causes included asking for a name after Sign in with Apple, an IAP stuck on a rejected build, and privacy links missing from the description. Also ["After 4 months of vibecoding and 9 rejections…"](https://www.reddit.com/r/vibecoding/comments/1u6natt/after_4_months_of_vibecoding_and_9_rejections_my/) and ["Got rejected multiple times. Here's the dumb stuff"](https://www.reddit.com/r/vibecoding/comments/1q7q67h/got_rejected_by_the_app_store_multiple_times/) (102 upvotes). |
| **Quality falls apart past a few screens; credits burn** | ["Rork works great. until you try to ship an actual app"](https://www.reddit.com/r/AskVibecoders/comments/1rstlou/rork_works_great_until_you_try_to_ship_an_actual/): "context degrades fast once the app grows beyond a handful of screens… failed after spending ~$500… App Store submission… completely unaddressed." A [Vibecode Trustpilot review](https://ca.trustpilot.com/review/vibecodeapp.com) says most credits went to bug fixing. Also ["Never build prototype in Rork"](https://www.reddit.com/r/AppBusiness/comments/1r4cykl/never_build_prototype_in_rork/) and ["Rork is not worth the hype"](https://www.reddit.com/r/vibecoding/comments/1qobuqz/rork_is_not_worth_the_hype/). |
| **4.3 spam rejections are opaque** | [A 4.3(a) rejection after adding RevenueCat remote paywall + Meta SDK + expo-updates](https://www.reddit.com/r/iOSProgramming/comments/1w9ojf7/existing_app_repeatedly_rejected_under_43a_after/) was overturned on appeal. Also ["Apple rejected my app for spam"](https://www.reddit.com/r/iOSProgramming/comments/1q4rljp/apple_rejected_my_app_for_spam/). Apple does not say *what* looks similar. |
| **Nobody uses the apps** | ["nobody uses your vibecoded apps"](https://www.reddit.com/r/vibecoding/comments/1tyhu3e/nobody_uses_your_vibecoded_apps/) (519 upvotes, 363 comments) cites an [NBER paper](https://www.nber.org/system/files/working_papers/w35275/w35275.pdf): new iOS apps spiked, but early usage did not grow. So distribution (ASO) is the real scarcity. |
| **"Native" claims** | Every tool says "native." Only the code export shows what you actually get ([Reddit table](https://www.reddit.com/r/vibecoding/comments/1wav34n/)). |
| **Platform risk for on-phone builders** | Apple blocked updates to Replit and Vibecode and removed Anything under **2.5.2** (running code that changes the app) ([MacRumors](https://www.macrumors.com/2026/03/30/apple-pulls-vibe-coding-app/), [9to5Mac](https://9to5mac.com/2026/03/18/apple-pushing-back-on-vibe-coding-iphone-apps-developers-say/)). Rork's iOS app was reportedly [off the App Store for weeks](https://www.reddit.com/r/vibecoding/comments/1qhwvuc/rork_removed_from_the_app_store_for_weeks_now/) in Jan 2026. A web-based builder (like App Builder) avoids this risk. |

Ranking of complaints by how often they appear in what I read:
1. App Store submission and rejections (signing, review, metadata, policy).
2. Quality and context loss on bigger apps, which burns credits.
3. Backend and security (keys in the client, Supabase RLS).
4. Payments and paywall compliance.
5. Design sameness. This is mentioned less often, but it feeds 4.3 risk.

### A3. Who advertises (Meta Ad Library, US, checked today through treg)

| Advertiser | What I saw |
|---|---|
| **Vibecode** | 10 ads, all started 6 Nov 2026 and active. Hooks are about revenue: "One app built with Vibecode now makes about $45K a month", "$1,500 a day", "on pace for $500K a year". Also "Real iPhone apps, built on iPhone… Publish to the App Store." So its iOS app is live and advertising again. |
| **Rork** | 30 ads in the archive, none active today. Runs were Sep–Dec 2025 ("Stop waiting for developers… native app in seconds") and Jul–Oct 2026, aimed at small business: "Your business is unique. Your app should be too." Typical run length was 6–10 weeks. |
| **Anything, a0.dev, Newly** | No branded Meta ads found. The keyword searches returned noise. |
| **Tapcart** | 9 active ads, started 2–7 Nov 2026 (the BFCM push). "Unlock 63% higher CVR, 82% higher revenue per session, and 12% higher AOV than web." "YoungLA – $60M+ in App Revenue", "New Era – 42% of Revenue from App". |
| **Appbrew** | 5 active ads, started 6–10 Nov 2026. "3x conversions and 6x customer lifetime value on app than Shopify website during BFCM. Launch your mobile app for free." |
| **MobiLoud, Shopney** | No ads found. |

What this shows: the consumer AI builders sell a **"get-rich app" dream** (revenue screenshots). The e-commerce builders sell **app vs. web conversion lift** around BFCM.

---

## Part B. E-commerce app builders (Shopify)

The Shopify "Mobile app builder" category has **111 apps** ([category page](https://apps.shopify.com/categories/store-design-storefronts-mobile-app-builder/all)). This is a crowded category.

| Builder | Live price | Shopify rating (reviews) | Fee on app sales | Minimum store size | Features | Claimed results |
|---|---|---|---|---|---|---|
| **Tapcart** ([listing](https://apps.shopify.com/shopify-mobile-apps), [pricing](https://tapcart.com/pricing)) | Growth $500/mo, Scale $1,250/mo, Enterprise+ from $2,850/mo. AI add-on $250/mo. Verified. | **4.7 (339)**. 12 one-star reviews. | Not on the listing. Third parties claim about 2.5%. Unverified. | None stated. At $500/mo it suits brands doing roughly $1M+/yr (my inference). | Push (abandoned cart, back in stock, AI 1:1), App Studio drag-and-drop, A/B tests, segments, integrations (Klaviyo, Rebuy, Recharge, Yotpo). | Ads claim +63% CVR, +82% revenue per session, +12% AOV vs web. Case studies: BÉIS +67% conversion, LSKD 40% of BFCM sales. A visible 1★ review says they "uploaded the app with issues and old screenshots," so the merchant had to "make my own screenshots." |
| **Superfans** (formerly Vajro) | About $149 to about $1,000/mo. Unverified. | The old listing at apps.shopify.com/vajro now shows **"not currently available on the Shopify App Store."** It previously had about 870–909 reviews at 4.9 ([yespress](https://yespress.io/superfans-io.md)). | — | — | Repositioned around loyalty and retention. Claims 5,000+ brands. | — |
| **Shopney** ([listing](https://apps.shopify.com/shopney-mobile-app)) | Silver $149, Gold $299, Platinum $599, Enterprise $1,299. 30-day trial. Verified. | **5.0 (775)** | None listed. | None. | Push (segmented, abandoned cart, back in stock), drag-and-drop, in-app chat, Klaviyo/Rebuy/Nosto/Yotpo. | "Generate more sales and decrease ad spend." No numbers. |
| **Plobal** ([listing](https://apps.shopify.com/plobalapps-mobile-application)) | Starter free + **3% of in-app sales**. Growth $199, Essential $499, Enterprise $1,199 + 1%. Verified. | **4.8 (148)**. 5 one-star reviews. | 3% on the free plan, 1% on Enterprise. | None. | Push (abandoned cart, rich, scheduled), Apple Pay, segments. | Shopify's summary says it "often pays for itself quickly." |
| **MobiLoud** ([pricing](https://mobiloud.com/pricing)) | Growth $799/mo (≤5K MAU), Business $1,499/mo (≤10K MAU), plus setup fees ($850–$2,500, reported). Reported, because the site blocked my fetch. | Only its push add-on is on Shopify ([5.0, 2 reviews](https://apps.shopify.com/mobile-push-notifications)). | — | Priced for brands with real traffic. | **WebView of your existing site** plus native tab bar and push ([MobiLoud](https://www.mobiloud.com/use-cases/wrapper-apps/)). It is done-for-you. | Offers a **store-approval guarantee or refund**, and handles both submissions ([MobiLoud](https://www.mobiloud.com/blog/app-store-review-guidelines-webview-wrapper)). |
| **Appmaker** ([listing](https://apps.shopify.com/appmaker)) | Pro $1,000/mo, Plus $2,000/mo, + **1% of in-app sales**. Verified. | **4.5 (34)** | 1% | Mid-market and up. | "John AI" assistant, drag-and-drop, push, personalization through tags and metafields. | No numbers. One review complains that support became unreachable after a price change. |
| **AppMySite** ([listing](https://apps.shopify.com/mobile-app-builder-appmysite)) | Free to install. Paid plans billed on its own site. | **0 reviews** on Shopify (it is mostly a WooCommerce/WordPress product). | — | — | Product sync, push, publishing. | — |
| **OneMobile** (FireGroup) ([listing](https://apps.shopify.com/onemobile)) | Free; $99 (+2.9% above $2K/mo of app revenue); $299 (+1.9% above $10K); $990 (+1.2% above $100K). Verified. | **4.8 (366)** | Yes, tiered. | Free tier works for tiny stores. | Push with AI, loyalty integrations, video shopping. | An Aug 2026 review complains about a price jump from about $29 to $99 plus fees. |
| **Appbrew** ([listing](https://apps.shopify.com/mobile-app-builder-appbrew)) | Free trial; Starter $199, Pro $599 (+ performance charges); Enterprise from $1,099. Verified. | **5.0 (76)** | "Charges based on app performance." Not specified. | — | **"Milo" AI growth assistant** drafts screens, campaigns and push. App-only offers. | Ads claim 3x conversions and 6x LTV vs web. Mixology 6x LTV. |
| **Apptile** | From $599/mo | 4.9 (136) | — | — | — | — |
| **MageNative** | Trial | 4.8 (334) | — | — | — | — |
| **Reactiv** ([listing](https://apps.shopify.com/reactiv-mobile-app-builder)) | From $1,500/mo | 5.0 (7) | — | Enterprise | "Reactiv AI" | Merchants say they switched to it from Tapcart ([Reddit](https://www.reddit.com/r/ShopifyeCommerce/comments/1v99g8p/mobile_app_reactiv_tapcart/)). |
| **Tapday** (AI) | Trial | 5.0 (17) | — | — | AI builder | — |
| **Hulk Mobile App Builder** | $79, $149, $249 | 4.7 (75) | — | — | Push, app-only offers | A visible 1★ review says the app "could not be published" and they kept getting charged. |
| **Fueled and other agencies** | Custom builds. Typical small-brand quotes are $40–50K ([Reddit](https://www.reddit.com/r/nocode/comments/1u27bel/turning_my_shopify_store_into_a_mobile_app_whats/)). | n/a | n/a | Larger brands | Fully custom | — |
| **Shopify Shop app (free option)** | Free to merchants. The Shop app lists the store and handles tracking and Shop Pay. [**Shop Minis**](https://shop.app/minis/docs/getting-started/introduction) are React Native mini-apps inside Shop, in early access. | n/a | None reported | None | Discovery, order tracking, Shop Pay, followers | Shopify gives no lift numbers. It is free, but the brand does not own the app or the push channel. |

Demand signals and complaints:
- **Small merchants feel the price.** A Shopify clothing brand owner wrote that the Shopify-specific builders "seem easy but they're subscription based, like $200-400/mo which adds up," and asked if an app is "worth it for a small e-commerce store" ([r/nocode, 35 comments](https://www.reddit.com/r/nocode/comments/1u27bel/turning_my_shopify_store_into_a_mobile_app_whats/)).
- **Price hikes and fee confusion** appear in reviews for OneMobile and Appmaker. Publishing failures appear for Hulk. The screenshot and store-listing quality complaint appears for Tapcart.
- **App vs web conversion.** The common claim is "2–3x." I could not trace it to a primary source; secondary sites cite Criteo or App Annie ([roundup](https://mobiloud.com/blog/mobile-commerce-statistics)). Tapcart's own claim is +63% CVR. App users self-select (they are repeat buyers), so the lift is overstated.

---

## Part C. Apple and Google rules

All Apple text below is quoted from the [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/), fetched today.

**2.1 App Completeness (a):** "Submissions to App Review … should be final versions with all necessary metadata and fully functional URLs included; placeholder text, empty websites, and other temporary content should be scrubbed before submission… include demo account info (and turn on your back-end service!) if your app includes a login… We will reject incomplete app bundles and binaries that crash or exhibit obvious technical problems."

**3.1.1 In-App Purchase:** "If you want to unlock features or functionality within your app, (by way of example: subscriptions, in-game currencies, game levels, access to premium content, or unlocking a full version), you must use in-app purchase."

**3.1.3(e) Goods and Services Outside of the App:** "If your app enables people to purchase physical goods or services that will be consumed outside of the app, you must use purchase methods other than in-app purchase to collect those payments, such as Apple Pay or traditional credit card entry."

**4.2 Minimum Functionality:** "Your app should include features, content, and UI that elevate it beyond a repackaged website. If your app is not particularly useful, unique, or 'app-like,' it doesn't belong on the App Store."

**4.2.2:** "Other than catalogs, apps shouldn't primarily be marketing materials, advertisements, web clippings, content aggregators, or a collection of links."

**4.2.6 (the template / app-generation rule):** "Apps created from a commercialized template or app generation service will be rejected unless they are submitted directly by the provider of the app's content. These services should not submit apps on behalf of their clients and should offer tools that let their clients create customized, innovative apps that provide unique customer experiences. Another acceptable option for template providers is to create a single binary to host all client content in an aggregated or 'picker' model…"

**4.3 Spam:**
- (a) "Don't create multiple Bundle IDs of the same app…"
- (b) "Don't submit apps that are indistinguishable from what's already widely available. Opportunistically creating variants of existing app categories or popular apps degrades App Store discovery… Certain kinds of apps, such as dating, flashlight, sound effects, wallpaper, simple timers, and fortune telling, are well established… we will not accept new submissions unless they offer a meaningfully different or improved experience. We may remove these apps from the App Store going forward if they are not updated, improved, or do not attract customers… Repeated submissions of this kind may lead to removal from the Apple Developer Program."
- The "may remove… do not attract customers" and "removal from the Apple Developer Program" text was tightened on 9 Jun 2026 ([MacRumors](https://macrumors.com/2026/06/09/app-store-guidelines-low-quality-apps/)).

**2.5.2 (for builder apps that run on the phone):** Apple used this rule to block updates to Replit and Vibecode and to remove Anything in Mar–Apr 2026 ([MacRumors](https://www.macrumors.com/2026/03/30/apple-pulls-vibe-coding-app/)). It does not hit a **web** builder that outputs a normal reviewed binary.

**Google Play:**
- [Spam policy](https://support.google.com/googleplay/android-developer/answer/9899034): "We don't allow apps whose primary purpose is to drive affiliate traffic to a website or provide a webview of a website without permission from the website owner or administrator." Also: "We don't allow apps that merely provide the same experience as other apps already on Google Play."
- [Minimum functionality](https://support.google.com/googleplay/android-developer/answer/9898783): "We do not allow apps that only have limited functionality and content."
- Google's 2018 rule on apps "built using automated tools or wizard services, or based on templates" allowed them only when "published by an individually registered developer account belonging to the user of the automated tool" ([TechCrunch 2018](https://techcrunch.com/2018/07/27/google-follows-in-apples-footsteps-by-cleaning-up-its-play-store)). I could not find this exact wording on today's policy pages, so treat its current form as unverified.
- New **personal** Play accounts (created after Nov 2023) must run a closed test with **12 testers for 14 days** before going to production ([Play help](https://support.google.com/googleplay/android-developer/answer/14151465)). Secondary sources confirm it.

### What the rules mean

**(a) An e-commerce "instant app" product**
- **4.2.6 decides the business model.** Each brand must submit from **its own** Apple Developer account ($99/yr). You cannot publish 500 store apps from your account. Tapcart, Shopney and the others all work this way: the merchant owns the account and the vendor builds and uploads under the merchant's team. So "instant" really means "instant build, then the merchant's account plus Apple review (about 1–2 days, often longer)." The other legal path is a single "picker" app hosting many stores, which is basically what Shop does.
- **4.2 / 4.2.2 kill pure webviews.** A Shopify storefront in a WebView risks "repackaged website" and "web clippings." Passing apps add native cart and checkout, push, app-only offers, wishlist, loyalty and account features. MobiLoud handles this with a refund guarantee and hand-holding. A cheap AI builder would need to bake native features in by default.
- **4.2.2 has a "catalogs" carve-out.** Shopping catalogs are not treated as "marketing materials," which helps e-commerce apps.
- **3.1.3(e) works in your favor.** Physical goods must **not** use IAP, so Shopify checkout or Shop Pay is fine and there is no Apple 15–30% cut. Digital add-ons (paid memberships that unlock app content) would need IAP.
- **4.3 risk is low per brand** (each brand is a unique catalog). It rises if every app looks identical and has thin content.
- **Google:** a webview of a site you don't own is banned. The brand owns its own site, so that part is fine. The 12-tester rule applies only if the brand opens a *personal* account, so steer brands to organization accounts (which need a D-U-N-S number).

**(b) An AI builder used by "app factory" founders shipping many similar subscription apps**
- **4.3(a)/(b) is the main risk.** Many near-identical apps (same onboarding, same paywall, same template, saturated categories like timers, wallpapers or fortune telling) under one or more accounts is exactly what 4.3 targets. Since Jun 2026, "Repeated submissions… may lead to removal from the Apple Developer Program." One rejection can spread to a founder's whole account.
- **4.2.6 applies to the builder itself.** You are an "app generation service." You must **not** submit on clients' behalf from your own account. Each founder submits from their own account. Building submission automation that uses *the founder's* App Store Connect API key is consistent with the rule.
- **3.1.1 / 3.1.2:** subscriptions must use IAP (RevenueCat or StoreKit). Paywalls need clear price and period, restore purchases, and terms and privacy links. These are common rejection causes and a builder can **check them automatically**.
- **2.1:** the binary must not crash, needs a working backend and a demo login, and must not have placeholder text. The [Expo dev's list](https://www.reddit.com/r/AppBusiness/comments/1xpj41x/) maps almost one-to-one to automatable pre-flight checks.
- **Implication:** "pump out 20 clone subscription apps" is a feature Apple is actively fighting. "Make each app distinct and compliant" is a feature Apple's rules reward. A **4.3 similarity checker** could be part of the product: it would compare your app's screens, metadata and icons against your own other apps and the category's top apps. That is a defensible angle for the product, but compliance tooling must not become spam tooling.

---

## Part D. Analysis

### Crowded vs open

| Segment | Status | Why |
|---|---|---|
| "Prompt → mobile app" for hobbyists and consumers | **Very crowded** | Rork ($17.8M), Vibecode ($9.4M), Anything ($100M valuation), a0, Bolt, Replit, Superapp, Newly, RapidNative, CatDoes, Modaal, Bitrig, and more. Reddit counts 19. Price points cluster at $20–25/mo. |
| Shopify "turn your store into an app" | **Crowded and saturated** | 111 apps on the Shopify App Store. Leaders charge $150–$2,850/mo plus 1–3% of app sales. Tapcart and Appbrew already advertise "AI." |
| "Last mile" for AI-built apps: submission, compliance pre-flight, paywall compliance, ASO metadata, screenshots | **Open but fragmented** | Every builder claims "publish," but users still hit 2.1, 3.1, 4.8, 5.1.1 and 4.3 rejections. ASO and screenshots are sold as separate tools (Stora, AppScreenshotStudio). Few products bundle monetization (RevenueCat), ASO and a review pre-flight with the build. Superapp, Newly and Rork are moving here. |
| Small Shopify stores under about $500K/yr | **Under-served on price** | Real offers are $149–$500/mo or 3% fees. The free option is Shop, where the brand does not own the app. |
| Agencies building apps for clients | **Somewhat open** | 4.2.6 forces client-owned accounts, and agencies need multi-client workspaces, white-label and handoff. Few AI builders target agencies. FlutterFlow does somewhat. |
| Local businesses (restaurants, gyms, salons) | **Hard** | 4.2/4.3 risk is high (thin apps), willingness to pay is low, and the "picker" model or existing booking apps already serve them. |
| Creators (courses, communities) | **Mixed** | Needs IAP for digital content (Apple takes 15–30%). Incumbents like Passion.io and Kajabi apps exist (not researched here). |

### Under-served buyers, in order
1. **Indie subscription-app makers** who can build with AI but lose weeks to review, paywalls and ASO. The evidence is the strongest Reddit pain (297- and 519-upvote threads). They already pay: Rork Max is $200/mo and RevenueCat is paid.
2. **Small and mid Shopify brands** priced out of Tapcart ($500/mo). Evidence: the r/nocode thread and OneMobile price-hike reviews.
3. **Agencies and freelancers** shipping client apps under 4.2.6 rules.
4. Local businesses and creators are weaker fits for now.

### Candidate edges

**1. "App-Store-ready subscription apps": the last mile as the product**
- What it is: build in Expo, then a **rejection pre-flight**:
  - crash-free production build (2.1)
  - demo login present
  - account deletion (5.1.1)
  - Sign in with Apple (4.8)
  - paywall checks: price, period, restore, terms (3.1.2)
  - privacy links in place
  - iPad layout or `supportsTablet` off
  - no secret keys in the bundle
- Plus RevenueCat paywall and onboarding, ASO keywords, description and screenshots, and submission through the user's own App Store Connect API key.
- Evidence: the top Reddit pain list maps to checks. Rork users say submission is "completely unaddressed." The Tapcart reviewer had to "make my own screenshots." Vibecode's ads prove the "app makes money" dream sells.
- Risks: Rork, Superapp and Newly are moving the same way. Expo Launch makes basic submission free. Apple can change rules. You cannot promise approval.

**2. "Distinct-by-design" for app factories: a 4.3 similarity guard**
- What it is: for founders who ship many apps, generate a **unique** design system, onboarding and paywall per app. Score similarity against the user's other apps and the category's top apps before submission. Flag saturated categories named in 4.3(b).
- Evidence: 4.3 rejections are opaque (Reddit threads, Apple forums). Apple tightened 4.3 in Jun 2026, with account bans for repeat offenders.
- Risks: it could be seen as helping spam evade review, so position it as quality, not evasion. The similarity signal is a guess (Apple's checks are private).

**3. "Shopify brand app in a day, native enough to pass 4.2", priced for small stores**
- What it is: an AI-generated Expo app from the Shopify Storefront API with:
  - native PDP, cart and checkout through Shopify checkout
  - push and app-only discount codes
  - wishlist and loyalty hooks
  - auto-generated App Store screenshots and metadata from the catalog
- Submitted from the merchant's own account (4.2.6). Flat $49–99/mo with no revenue share.
- Evidence: 111 competitors, but the leaders charge $150–$2,850/mo plus 1–3%. Small merchants call $200–400/mo too much. Price hikes anger OneMobile users. 3.1.3(e) means no Apple cut.
- Risks: a crowded, low-differentiation category. Small stores may not get enough app installs to justify any price. Shop and Shop Minis are free. Support load (Apple accounts, D-U-N-S numbers, rejections) is high. App vs web lift is overstated by self-selection.

**4. Agency/white-label workspace**
- What it is: multi-client projects, client-owned Apple and Google accounts (4.2.6), handoff, and "built by" credit.
- Evidence: 4.2.6 forces this setup. Agencies charge $3.5K–$50K per app ([Bubble forum $3,500 offer](https://forum.bubble.io/t/need-a-native-mobile-app-for-your-bubble-project-3-500-ios-android-store-submission-included/390288), Reddit $40–50K quotes). Few AI builders target agencies.
- Risks: a smaller market. Agencies want code export and control, so you would compete with FlutterFlow and Cursor/Claude Code.

**5. ASO and screenshots as the wedge**
- What it is: a cheap standalone "App Store listing kit": keywords, description, screenshot sets for all device sizes, and localization. Sell it to *any* builder's users (Rork, Vibecode, Replit), then upsell the builder.
- Evidence: the NBER-cited "nobody uses your vibecoded apps" thread (519 upvotes) shows distribution is the bottleneck. Screenshot tools are launching on Product Hunt, which shows demand.
- Risks: a low price ceiling. Crowded with small tools. ASO quality is hard to prove.

**Suggested focus:** Edge 1, with Edge 2 as a built-in feature, fits App Builder's current pitch (onboarding, paywall, metadata, screenshots) best. It is also the one where the evidence of pain is strongest. Treat e-commerce (Edge 3) as a template or vertical inside it, not as the main bet. The Shopify category is saturated, and 4.2.6 removes the "instant" part, because every brand still needs its own Apple account and a review.

---

## Method and spend
- Sources: WebSearch and WebFetch (Apple guidelines, Shopify App Store listings, vendor docs, press), plus treg.
- treg calls: Reddit search (8), Reddit post detail (8), Meta Ad Library keyword search (10), company search (5), and company ads (2). That is about **$0.05** of treg spend, well under the $0.50 cap.
- The team balance went from $7.46 to $7.11 during this session. Most of that came from other concurrent jobs on the same team (Google SERP calls in the ledger), not this research.
- Nothing was posted, no one was contacted, and I signed up for nothing.
