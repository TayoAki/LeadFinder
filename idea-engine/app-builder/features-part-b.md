# Feature breakdown, part B: Replit, Bolt, Lovable, FlutterFlow, Draftbit, Adalo, Thunkable, Cabano (mobile apps)

Checked 2026-11-10. Rows follow `feature-taxonomy.md` exactly. Ratings: **✅** has it · **◐** partial or limited (the note says how) · **❌** doesn't have it · **?** couldn't verify.

How to read it:
- Vendor docs, pricing pages, changelogs and Shopify listings count as verified. Press releases, aggregators and competitor blogs (vp0, Newly, RapidNative, CatDoes, Capgo, Median) count as **reported**.
- Several marketing and pricing pages render with JavaScript. For **Cabano**, I read its `llms.txt`, `llms-full.txt`, sitemap and the docs text inside its public JS bundle. That is the vendor's own copy, but it is not the rendered page.
- **Biggest surprise:** Cabano is not only a Shopify-to-iOS tool. Its main product (launched **9 Jul 2026**) is a general AI builder for native **SwiftUI** iOS apps. It includes RevenueCat paywalls, TestFlight and App Store upload, "100 credits to start" free, Pro at $20 and Max at $100, and it has run as a ChatGPT app since **6 Nov 2026**. The Shopify app (10 Aug 2026, $50–100/mo) is a side door into the same product.
- Meta ads: I checked each company's own Facebook Page in the Meta Ad Library through `treg` (ScrapeCreators) on 2026-11-10. The counts are active ads only.

---

## 1. Matrix

Abbreviations: RN = React Native; ASC = App Store Connect; RC = RevenueCat; DB = database.

### 1. Input

| Feature | Replit | Bolt | Lovable | FlutterFlow | Draftbit | Adalo | Thunkable | Cabano |
|---|---|---|---|---|---|---|---|---|
| Text prompt | ✅ Agent, "Mobile app" type | ✅ | ✅ (web only) | ✅ new agent builder (4 Nov 2026) and Studio agent | ✅ Claude Code / Codex agent | ✅ Ada (Mar 2026) | ✅ Thunkable AI (Feb/Mar 2026) | ✅ |
| Image/screenshot to app | ✅ Replit Design takes screenshots | ◐ file uploads (10 MB on Free); image-to-app not documented | ? | ✅ images to AI Agent (14 Oct 2026) | ? | ? | ? | ✅ attach wireframes and screenshots (8 files × 10 MB) |
| Figma import | ✅ via Replit Design (29 Jul 2026) | ✅ Figma frames into chat (Jan 2026) | ? | ✅ theme import on all plans; AI frame import on higher tiers only | ? | ? | ? | ❌ none; you attach screenshots instead |
| Voice input | ? | ? | ✅ in the Lovable phone app (Apr 2026) | ? | ? | ? | ? | ? |
| Reference app/URL ("like X") | ◐ Mobbin-powered templates in Design | ? | ? | ? | ? | ? | ? | ◐ "attach a screenshot of a design you like" |
| Plan/spec step | ✅ Plan mode | ? | ✅ Plan mode (1 credit/msg) | ✅ AI Agent shows its plan (20 Oct 2026) | ◐ agent asks when it needs a decision | ? | ◐ "Discuss Mode" | ✅ Plan mode (10 credits reserved) |

### 2. Generation

| Feature | Replit | Bolt | Lovable | FlutterFlow | Draftbit | Adalo | Thunkable | Cabano |
|---|---|---|---|---|---|---|---|---|
| Output: Expo / React Native | ✅ | ✅ (project must start as mobile) | ❌ "does not generate React Native projects" | ❌ | ✅ TypeScript, Expo RN | ? RN reported in earlier notes; not stated on the current pages | ? "fully native" claim; stack not named | ◐ marketing says "Expo/RN supported"; its docs FAQ says "no cross-platform output" (conflict) |
| Output: SwiftUI | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ SwiftUI Xcode project, iOS 27 baseline |
| Output: Kotlin | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ iOS only |
| Output: Flutter | ❌ | ❌ | ❌ | ✅ Dart/Flutter | ❌ | ❌ | ❌ | ❌ |
| Output: Webview | ❌ | ❌ | ◐ only a PWA, or you wrap it yourself with Capacitor outside Lovable | ❌ | ❌ | ❌ | ❌ (WebView is a component, not the output) | ❌ |
| Multi-screen (limit) | ✅ no limit stated | ✅ | n/a (web) | ✅ | ✅ | ✅ multi-screen from Ada | ✅ Free 5 screens/project, Accelerator 10, Builder+ unlimited | ✅ no limit stated |
| Design system/theming | ✅ design systems in Replit Design | ✅ design systems (Porsche, Cloudscape; Teams upload their own) since Mar–Apr 2026 | ? | ✅ theme module | ? | ? | ? | ◐ native iOS look by default; styled by prompt |
| Brand kit | ? | ◐ Teams can upload a design system | ? | ? | ? | ? | ◐ custom branding on Builder+ | ◐ generates the app icon and name automatically |
| Chat iteration | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Visual editor (click to edit) | ? | ✅ "visual edits" (desktop) | ? | ✅ Studio canvas | ✅ drag-and-drop | ✅ canvas | ✅ drag-and-drop | ❌ chat only |
| Code view/edit in browser | ✅ | ✅ code view (desktop) | ? | ✅ custom code; Studio code editing | ✅ | ◐ Builder plan sees a sample of Ada's code; Business sees all | ? | ◐ every file is viewable; editing not documented |
| Code export | ✅ reported (git/download) | ✅ download (required for store builds) | ◐ web code only, via GitHub (reported) | ✅ Basic+ | ✅ Standard+ (ZIP) | ◐ separate paid service through support | ? none found | ◐ "real Xcode project"; export "ask support" |
| GitHub sync | ✅ reported | ✅ incl. org-level app (Apr 2026) | ✅ reported | ✅ Pro+ | ◐ one-way push only | ? | ? | ? |
| Version history/rollback | ✅ checkpoints; DB rollback up to 28 days on Pro | ✅ clock menu; restore on mobile (Oct 2026) | ? | ✅ branches and backups (1 h on Free, 7 days on Max) | ? | ? | ✅ versions (Jul 2026) | ✅ revisions; a failed build never overwrites a working one |
| Error auto-fix | ? | ? | ? | ◐ Test Mode logs feed the agent; "Test Pilot" AI QA (7.0, Jun 2026) | ◐ agent "runs checks" | ? | ? | ✅ up to 3 automatic repairs, free; failed turns refunded |

### 3. Preview and testing

| Feature | Replit | Bolt | Lovable | FlutterFlow | Draftbit | Adalo | Thunkable | Cabano |
|---|---|---|---|---|---|---|---|---|
| Web preview | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ◐ no web render; a real simulator streams into the browser instead |
| On-device preview | ✅ Expo Go QR | ✅ Expo Go QR | ◐ companion app shows the *web* app | ◐ "Device Previews" (Oct 2026) and Dreamflow mobile preview | ✅ Draftbit Preview app via QR | ◐ previewer app plus native test builds (forum) | ✅ Thunkable Live via QR (Aug 2026) | ◐ only through TestFlight ("Run on your device", minutes); no instant companion app |
| iOS simulator | ✅ streamed (Core+; not on Firefox) | ❌ | ❌ | ? | ✅ Pro+ (in-browser) | ❌ | ◐ device frames in preview | ✅ real iOS simulator on Cabano's Macs |
| TestFlight builds | ✅ automatic, via Launch | ◐ you run `eas build --auto-submit` locally | ❌ | ◐ uploads to ASC; TestFlight not described | ✅ "staging publish" | ✅ guided (help docs) | ◐ ASC API publishing (Mar 2026) | ✅ creates an internal tester group automatically |
| Android APK | ◐ builds; no Play publishing | ◐ via EAS on your machine | ❌ | ✅ Basic+ | ✅ | ✅ | ✅ "Download Android" | ❌ |

### 4. Backend and data

| Feature | Replit | Bolt | Lovable | FlutterFlow | Draftbit | Adalo | Thunkable | Cabano |
|---|---|---|---|---|---|---|---|---|
| Built-in database | ✅ PostgreSQL (Starter 1 GiB prod) | ✅ Bolt Cloud DB | ✅ Lovable Cloud | ✅ Firebase/Supabase; new builder adds a built-in data layer | ◐ provisions Supabase (open beta) | ✅ built-in (Free: 500 records/app) | ✅ Supabase-backed Cloud DB (May 2026) | ◐ SwiftData on the device; your own Supabase over REST (tables only) |
| Auth (email/Apple/Google) | ? | ✅ auth in DB settings | ✅ (reported) | ✅ email, Google, Apple | ✅ Supabase auth | ? | ✅ Supabase auth | ❌ deliberately no Supabase Auth or user accounts |
| File storage | ✅ Object Storage | ✅ | ✅ Cloud file storage | ? | ? | ? | ? | ❌ no Supabase Storage |
| Server functions/API routes | ✅ server side runs on Replit | ✅ server functions | ✅ Cloud compute | ◐ "functions" in the 4 Nov builder (press only) | ◐ through Supabase/Xano | ◐ custom actions; Collections API (Business) | ? | ❌ no backend hosting; no Edge Functions |
| Secrets (no keys in client) | ✅ reported (Secrets) | ✅ secrets in DB settings | ? | ◐ "secrets" claimed for the new builder (press) | ✅ sensitive values encrypted and kept out of the build | ? | ◐ API-key support (Apr 2026); server-side not stated | ◐ refuses secret keys; anon key + RLS only; ASC key stored encrypted |
| 3rd-party API integrations | ✅ Connectors | ✅ | ✅ connectors (billed) | ✅ API calls, Swagger import | ✅ 100+ integrations/MCPs | ✅ | ✅ | ◐ writes client code against your API; no keys in app |

### 5. Monetization

| Feature | Replit | Bolt | Lovable | FlutterFlow | Draftbit | Adalo | Thunkable | Cabano |
|---|---|---|---|---|---|---|---|---|
| IAP/subscriptions (StoreKit/RC) | ✅ RC built in; agent creates products and entitlements; **syncs RC → ASC** | ◐ docs only link to a RevenueCat guide | ❌ | ✅ RC actions incl. paywall (24 Sep 2026) | ✅ RC through MCP | ✅ IAPHUB components | ✅ RC blocks; IAP for AI projects (8 Jun 2026) | ✅ RC by chat; subscriptions and one-time purchases |
| Paywall templates | ◐ RC remote paywall, edited in RC | ❌ | ❌ | ◐ RC paywall action | ? | ✅ IAPHUB Paywall component | ? | ◐ AI-built paywall; no template gallery found |
| Stripe (web) | ✅ (Jan 2026 changelog) | ? | ✅ (reported) | ✅ | ◐ Square MCP | ✅ Stripe component | ? | ? |
| Ads (AdMob) | ? | ? | ❌ | ✅ | ? | ? | ✅ (Jun 2026) | ? |
| Analytics | ? | ◐ expo.dev monitoring | ? | ✅ built-in analytics (new builder) | ? | ◐ Business plan, or paid add-on on Builder | ? | ? |

### 6. Native capabilities

| Feature | Replit | Bolt | Lovable | FlutterFlow | Draftbit | Adalo | Thunkable | Cabano |
|---|---|---|---|---|---|---|---|---|
| Camera | ✅ (Expo Go) | ? | ◐ browser APIs | ? | ? | ? | ✅ (Mar 2026) | ✅ (on device) |
| Push notifications | ✅ in store builds | ? | ❌ | ✅ paid plans | ? | ✅ Builder+ | ✅ OneSignal (Jun 2026) | ✅ APNs (Shopify flows are built in) |
| Location | ✅ GPS | ? | ◐ browser | ? | ? | ◐ Maps on Builder | ✅ (Mar 2026) | ✅ |
| HealthKit | ? | ? | ❌ | ? | ? | ? | ? | ✅ "anything Apple exposes" |
| Widgets | ? | ? | ❌ | ? | ? | ? | ? | ? |
| Haptics | ✅ (named in docs) | ? | ❌ | ? | ? | ? | ? | ✅ (named in docs) |
| Offline storage | ? | ? | ? | ? | ? | ? | ? | ✅ SwiftData by default |
| AI/LLM calls inside the app | ✅ OpenAI integration | ? | ✅ AI gateway (metered in credits) | ? | ? | ? | ? | ✅ Apple on-device Foundation Models (no key, no per-call cost) |

### 7. Publishing (the last mile)

| Feature | Replit | Bolt | Lovable | FlutterFlow | Draftbit | Adalo | Thunkable | Cabano |
|---|---|---|---|---|---|---|---|---|
| Cloud build | ✅ Expo servers, through the Launch wizard (EAS CLI not supported in Replit) | ◐ EAS, run from your own terminal | ❌ | ✅ | ✅ (Standard: 15 builds/seat/mo; Pro: 30) | ✅ | ✅ | ✅ Cabano's macOS machines |
| Code signing handled | ✅ creates certificates and profiles | ◐ EAS can guide you | ❌ | ◐ via ASC API key; certificates not described | ✅ "builds, signs, uploads" | ◐ Apple app-specific password flow | ◐ ASC API method | ✅ creates or reuses certificates and profiles |
| Upload to ASC | ✅ | ◐ you run it | ❌ | ✅ "Deploy To App Store" | ✅ | ✅ | ✅ | ✅ (5–15 min processing) |
| Submission to App Store review | ❌ you finish it in ASC ("Add for Review") | ❌ | ❌ | ◐ docs: manual in ASC; new homepage claims "a single action sends it for review" | ◐ Pro "App Store Assistance"; Experts can manage it | ◐ guided, done in ASC | ◐ claims to automate "from submission to updates" | ◐ manual in ASC; the API can submit but the docs have you do it there |
| Google Play upload | ❌ not supported (manual) | ◐ manual in Play Console | ❌ | ✅ | ✅ | ✅ | ✅ Google Play API (May 2026) | ❌ |
| ASO/metadata help | ◐ creates the ASC listing; no copy generation | ❌ | ❌ | ❌ none found | ◐ Pro "App Store Assistance" | ? | ◐ "Store listing" (Aug 2026), details unclear | ◐ docs guidance only (description, keywords, promo text) |
| Screenshot generation | ✅ AI-made, framed, captioned set of 5 (+ Play feature graphic) | ❌ | ❌ | ? | ? | ◐ how-to guide | ◐ "Capture current preview" button | ◐ capture the simulator yourself; guide |
| Privacy labels/policy help | ? | ❌ | ❌ | ◐ Privacy Manifest settings | ? | ◐ privacy/ATT guide | ◐ fixed purpose-string rejections (Aug 2026) | ◐ docs guidance |
| Pre-flight guideline check | ❌ none found | ❌ | ❌ | ◐ AI QA (Test Pilot), not guideline-based | ? | ? | ? | ◐ written checklist only |
| Rejection help | ? | ❌ | ❌ | ◐ FAQ (ITMS-91053, icon) | ◐ paid Experts | ◐ troubleshooting docs | ? | ◐ "Passing App Review" doc |
| Over-the-air updates | ? | ? | n/a | ? | ✅ OTA updates (homepage) | ◐ "instant updates": 1/mo on Builder, unlimited on Business | ? | ❌ every update is a new store build |

### 8. Platform and workflow

| Feature | Replit | Bolt | Lovable | FlutterFlow | Draftbit | Adalo | Thunkable | Cabano |
|---|---|---|---|---|---|---|---|---|
| Web app | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Desktop app | ? | ? | ? | ✅ FlutterFlow Desktop | ? | ? | ? | ❌ |
| Build from a phone | ◐ iOS app exists, but Apple blocked its updates in Mar 2026 (earlier notes); native builds and publishing need the web | ◐ mobile web (Oct 2026), no code view or DB | ✅ iOS/Android app (27 Apr 2026) | ? | ? | ? | ◐ "mobile users" features | ◐ through the ChatGPT app (US) and Slack; publishing stays in the web editor |
| Team collaboration | ✅ Pro up to 15 | ✅ Teams $30/member | ✅ unlimited members | ✅ seats (Pro 2, Max 5) | ✅ paid seats | ✅ 5 editors (Builder), 10 (Business) | ? | ❌ none found |
| Templates gallery | ✅ (Design: Mobbin templates) | ? | ? | ✅ | ✅ | ? | ✅ remixable examples | ❌ none found |
| Docs/tutorials | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Community | ✅ | ? | ✅ Discord | ✅ forum | ? | ✅ forum | ✅ forum | ◐ "community-supported" Free tier |
| Support channel | ✅ premium on Pro | ✅ | ✅ | ✅ | ✅ (+ paid Experts) | ✅ | ✅ Intercom → priority | ✅ email; engineers on Max |

### 9. Pricing (summary; details are in the profiles)

| Feature | Replit | Bolt | Lovable | FlutterFlow | Draftbit | Adalo | Thunkable | Cabano |
|---|---|---|---|---|---|---|---|---|
| Free tier | ✅ Starter (daily cap; hidden on the pricing page) | ✅ 1M tokens/mo, 300K/day | ✅ 5 credits/day (max 30/mo) | ✅ 2 projects, no publishing | ✅ 3,000 one-time credits, web only | ✅ 5 Ada prompts/mo | ✅ 2,000 tokens, 5 screens | ✅ 100 credits to start (≈10 turns), no publishing |
| Entry paid plan | Core $20 ($18/yr) | Pro $25 (Lite $9, Forge only) | Pro $25 / 100 credits | Basic $39 ($29/yr) | Standard $15 ($12/yr) | Builder $65 ($52/yr) | Accelerator $19, Builder $59 ($37/yr) | Pro $20 / 100 credits |
| Overage | credit packs; effort-based | top-ups not priced on page | top-ups (price not shown) | "refills" on Pro/Max | $1 per 1,000 credits | extra AI credits only | ? | $0.30/credit pay-as-you-go, or bundles |
| Annual discount | ✅ ~10% | ✅ "up to 28%" | ✅ ~17% | ✅ ~25% | ✅ 20% | ✅ 20% (10% quarterly) | ✅ up to ~48% | ✅ Shopify app 17%; web ? |
| Refund policy | ? | ? | ? | ? | ? | ? | ? | ◐ failed turns auto-refunded; subscriptions ? |
| Limits | sims on Core+; no Play publishing | slug is fixed after the first build | web only | projects/editors/branches by plan | builds/seat/mo | 2 apps (Builder), 5 (Business) | 1 live app (Builder) | iOS only; publishing on Pro+ |

### 10. Company

| Feature | Replit | Bolt | Lovable | FlutterFlow | Draftbit | Adalo | Thunkable | Cabano |
|---|---|---|---|---|---|---|---|---|
| Funding | $400M Series D at $9B, Mar 2026 (reported) | $105.5M Series B, Jan 2025 (earlier notes, not re-checked) | $400M Series C at $13.3B, Aug 2026 (reported) | $25.5M Series A, 2024 (earlier notes) | ? | ? | ? | ? (Decision Trees Inc, Vancouver) |
| Mobile launch date | Mobile apps 16 Jan 2026 | Expo integration Feb 2025 | iOS companion app 27 Apr 2026 (not an app builder) | AI-native builder 4 Nov 2026 | AI-agent relaunch 2025–26 (undated) | Ada 10 Mar 2026; "new Adalo" Oct 2026 | Thunkable AI 25 Feb / 31 Mar 2026 | 9 Jul 2026 (web), 10 Aug 2026 (Shopify), 6 Nov 2026 (ChatGPT) |
| Users/revenue claims | ~$150M annualized revenue in Sep 2025 (reported) | $40M ARR, 2025 (reported) | $500M ARR in Jun 2026 (reported) | 3.3M builders, 50k+ apps shipped (claimed) | 200k+ builders (claimed) | "a million makers" (claimed, older) | publishing attempts up 51% (claimed) | 0 Shopify reviews |
| Meta ads (active, 10 Nov 2026) | **18** active; oldest active start 6 Oct 2026; UGC "built it on my phone" and Replit Design | **6** active, 8 Oct–9 Nov 2026 ("If you can describe it, you can build it") | **537** active (many new on 10 Nov; Spanish creative seen) | 0 | 0 | 0 | 0 | 0 found (no Facebook Page; 2 keyword searches), but the site loads Meta and TikTok pixels |

---

## 2. Product profiles

### Replit (mobile via Expo, plus the Launch wizard)
- **Positioning:** a general AI app platform that has added native mobile apps. The Agent generates Expo/React Native apps, and Replit hosts the backend.
- **Best at:** the most complete subscription-app path of any general builder. It has RevenueCat built in, syncs RC products into ASC, signs and uploads automatically, and generates AI screenshots. It also has a real backend (Postgres, object storage, secrets, OpenAI).
- **Recent launches:** Mobile Apps, 16 Jan 2026 (with a $15K Mobile Buildathon). Agent 4 and the $400M round, Mar 2026. Replit Design, 29 Jul 2026 (Figma import, screenshots, design systems, Mobbin templates, $50K Designathon). Agent releases continued on 2 Oct and 16 Oct 2026 (aggregator).
- **Pricing:** Core is $20/mo ($18 billed yearly) and includes $20 of usage credits. Pro is $100/mo ($90 yearly) with $100 of credits, up to 15 collaborators, 28-day DB rollback and premium support. Enterprise is custom. Starter (free) still exists, with a daily cap on Agent use and Free Mode (reported). Agent billing is effort-based, one checkpoint per request (reported). Extra credit packs are sold on the billing page. The iOS simulator needs Core or above.
- **Limits:** Google Play publishing is not supported. The bundle ID is fixed after the first publish. The web app must be published first. A build takes up to 45 minutes. Expo Go can't show real purchases. EAS CLI isn't supported inside Replit.
- **Publishing flow:** (1) Publish the web/backend. (2) Publishing → "Start publishing to the App Store" opens the Launch wizard. (3) Confirm the Expo project and slug. (4) Sign in to the Apple Developer account (2FA; password not stored). (5) Choose or create the app and bundle ID. (6) Launch creates or reuses the distribution certificate and profile. (7) "Launch to App Store": Expo's servers build the app and upload it to ASC. (8) TestFlight invite email. (9) You finish metadata, privacy and screenshots in ASC (screenshots can be AI-generated in Replit) and press "Add for Review" yourself. IAP: connect RC, the Agent creates products, then Publishing → Manage → "Sync RevenueCat to App Store Connect" (needs 2 ASC API keys and a signed Paid Apps Agreement).
- **Evidence:** [mobile docs](https://docs.replit.com/replitai/building-mobile-apps) · [build & launch tutorial](https://docs.replit.com/tutorials/build-and-launch-a-mobile-app.md) · [iOS upload](https://docs.replit.com/build/mobile-upload-ios.md) · [payments/RevenueCat](https://docs.replit.com/build/mobile-payments.md) · [store screenshots](https://docs.replit.com/build/mobile-store-screenshots.md) · [Jan 2026 changelog](https://docs.replit.com/updates/2026/01/16/changelog) · [Jul 2026 changelog (Design)](https://docs.replit.com/updates/2026/07/31/changelog) · [pricing](https://replit.com/pricing) · [Series D (reported)](https://builtin.com/articles/replit-rasies-400m-series-d-9b-valuation-20260313)

### Bolt (bolt.new, Expo for mobile)
- **Positioning:** a browser builder that is web-first. Mobile works if you say "mobile app" in the first prompt, which produces an Expo project.
- **Best at:** fast prototypes with an Expo Go QR preview. Its own backend (Bolt Cloud: DB, auth, storage, functions, secrets) is integrated.
- **Recent launches (2026, from release notes):** Figma frames in chat (Jan). Design systems (Mar–Apr). Org-level GitHub app (Apr). Unified Database Settings with auth, storage, secrets and functions (May–Jun). Bolt Lite at $9 and the Bolt Forge preview (Sep). Phone web experience with publishing controls and version restore (12–18 Oct). Private-by-default tables (30 Oct). Link billing from 1 Nov 2026.
- **Pricing:** Free gives 1M tokens/mo with a 300K daily cap. Pro is $25/mo from 10M tokens. Teams is $30 per member. Enterprise is custom. Paid tokens roll over for 2 months. Yearly billing saves "up to 28%". Top-up prices are not on the page.
- **Limits:** no in-product store builds or submission. Web projects don't convert to mobile. The slug is fixed after the first build. RevenueCat needs a dev build (it doesn't work in Expo Go).
- **Publishing flow:** (1) Download the code. (2) Install Node, then `npm i -g eas-cli`, `eas login`, `npx expo-doctor`. (3) Set the name and slug in app.json, then `eas init` and `eas build:configure`. (4) iOS: `eas build --platform ios --auto-submit` uploads to TestFlight. Then fill metadata and submit in ASC by hand. (5) Android: `eas build`, then upload to the Play Console by hand. Everything runs in your own terminal.
- **Evidence:** [Expo help doc](https://support.bolt.new/integrations/expo) · [release notes](https://support.bolt.new/release-notes) · [pricing](https://bolt.new/pricing) · [Expo × Bolt (Expo blog)](https://expo.dev/blog/bolt-expo-integration-announcement)

### Lovable (web only; confirmed)
- **Positioning:** a full-stack web app builder. **Its own docs FAQ says it does not build native apps:** "does not generate React Native projects". The only mobile routes are a PWA, or wrapping the published URL with Capacitor *outside* Lovable.
- **Mobile path:** the Lovable iOS/Android app (launched 27 Apr 2026) is a **companion for building web apps from a phone**. It has voice or text prompts, queued background builds, notifications, and previews in a browser so it stays inside Apple's rules. Plans bought inside the iOS app are one month and don't renew.
- **Best at:** web apps with Lovable Cloud (DB, auth, storage, AI gateway), and growth (537 active Meta ads).
- **Pricing (docs):** Pro starts at $25/mo for 100 credits ($21/mo yearly) and runs to $2,250 for 10,000 credits. Business starts at $50 for 100 credits. Free gives 5 build credits a day (max 30/mo) plus 20 Cloud, 4 AI and 1 connector credits each month. Plan-mode messages cost 1 credit. Build-mode messages are priced by complexity (0.5–2 credits in the examples). Monthly credits expire after 2 months; top-ups last 12 months.
- **Publishing flow:** none to the App Store. You publish to the web, then use a third-party wrapper (Capacitor/Capgo, Median, Despia) and Apple review, where wrappers risk guideline 4.2.
- **Evidence:** [docs FAQ (mobile)](https://docs.lovable.dev/introduction/faq) · [plans](https://docs.lovable.dev/introduction/subscription-plans.md) · [credits](https://docs.lovable.dev/introduction/plans-and-credits) · [mobile app blog](https://lovable.dev/blog/mobile-app) · [launch coverage](https://ecommercenews.com.au/story/lovable-launches-mobile-app-for-building-websites-on-the-go) · [Series C (reported)](https://www.vktr.com/ai-platforms/lovable-raises-400-million-at-133-billion-valuation/)

### FlutterFlow (with AI features)
- **Positioning:** a visual Flutter builder that became AI-first on **4 Nov 2026** with a new conversational, agent-led builder ("Build an app by describing it"). The old canvas continues as **FlutterFlow Studio**. Both publish to the App Store and Play.
- **Best at:** real Flutter code with export, both stores, and the deepest integrations list: Firebase, Supabase, RevenueCat, Stripe, AdMob, push, Figma theme. MCP and Claude Code / Codex plugins let outside agents drive it.
- **AI timeline (changelog):** FlutterFlow MCP (7 May 2026). GenUI and page/component generation (18 May). FlutterFlow 7.0 with bring-your-own agent over MCP and Test Pilot AI QA (17 Jun). Native AI Agent and Claude Code/Codex plugins (27 Jul). RevenueCat paywall/customer/subscription actions (24 Sep). Device previews and images to the agent (14 Oct). Agent plans (20 Oct). New AI-native builder with built-in backend, analytics and parallel agent tasks (4 Nov, press). Dreamflow, the earlier separate AI product, is not mentioned on the new homepage.
- **Pricing (Studio page):** Free has 2 projects and no export or deploy. Basic is $39/mo ($29 yearly): unlimited projects, code and APK download, one-click store deploy. Pro is $80 ($60 yearly): GitHub, 2 branches, 2.5× AI, second seat $55. Max is $150 ($113 yearly): 5 editors at $85/seat, 5× AI. AI usage shows as "% left", with refills on Pro and Max. Per the press release, existing users get the new builder on their current plan "subject to usage limits".
- **Limits:** you build the ASC record and API key by hand. Submission happens in ASC. No ASO or screenshot tooling was found.
- **Publishing flow (docs):** (1) Create a bundle ID in the Apple portal. (2) Create the app in ASC. (3) Paste the Apple ID into FlutterFlow. (4) Create an ASC API key (App Manager) and upload the .p8 with the Issuer ID and Key ID. (5) "Deploy To App Store": FlutterFlow builds, bumps the build number and uploads. (6) In ASC: "Prepare for Submission", add assets and metadata, then "Add for Review". Google Play deploy is also one click.
- **Evidence:** [pricing](https://www.flutterflow.io/pricing) · [changelog](https://www.flutterflow.io/flutterflow-changelog) · [App Store deployment docs](https://docs.flutterflow.io/deployment/apple-app-store-deployment) · [integrations](https://docs.flutterflow.io/integrations) · [homepage](https://www.flutterflow.io/) · [4 Nov 2026 launch (press)](https://hackernoon.com/flutterflow-launches-ai-native-app-builder-for-ios-and-android)

### Draftbit
- **Positioning:** a visual builder relaunched as an "AI agent sandbox". Claude Code or OpenAI Codex runs inside your project and edits the same files the visual editor renders. You can use your own Claude or ChatGPT plan. Output is Expo React Native in TypeScript.
- **Best at:** cheap code-owning Expo builds with one-click signed store publishing, OTA updates, and paid human Experts for submission. It handles secrets properly: sensitive values are encrypted and kept out of the app.
- **Recent launches:** the agent relaunch (undated; FAQ reviewed 2 Sep 2026). "What's new": mockups of the next screen, and OTA updates.
- **Pricing:** Free is $0 with 3,000 one-time credits, web publishing only, and 20 agent runs a week with your own key. Standard is $15/mo ($12 yearly): iOS and Android with 15 builds per seat a month, ZIP/GitHub export, extra seats $8. Pro is $30 ($24 yearly): 30 builds per seat, simulators, testing builds, App Store Assistance, extra seats $16. Enterprise is custom. Credits cost $1 per 1,000 and expire after a year. Agents run one at a time on Free and Standard, up to 5 on Pro.
- **Limits:** GitHub sync is one-way. The Firebase MCP is "coming soon". Supabase provisioning is in beta.
- **Publishing flow:** you bring an Apple account ($99/yr) and a Play account ($25). Standard+ "one-click publishing builds, signs, and uploads" iOS and Android. A staging publish goes to TestFlight or the Play internal track. Pro adds App Store Assistance, and Experts can run the submission. Apple and Google still review.
- **Evidence:** [homepage](https://draftbit.com/) · [pricing](https://draftbit.com/pricing) · [FAQ](https://draftbit.com/faq) · [payments FAQ](https://draftbit.com/faq/can-i-add-payments-and-subscriptions)

### Adalo
- **Positioning:** a no-code native app builder rebuilt around the AI builder "Ada" ("describe your app to Ada, refine it visually"). It publishes iOS, Android and web.
- **Best at:** flat pricing for SMB and non-technical builders, with IAPHUB paywall components, Stripe, push, built-in database, and both stores.
- **Recent launches:** Ada (press release, 10 Mar 2026). SheetBridge, which builds apps from Google Sheets, Excel or Airtable (Mar 2026, press). The "new Adalo" post updated 21 Oct 2026. Adalo 3.0 (late 2025, vendor claim).
- **Pricing (live page, now different from the earlier $36/$52/$160):** Free is $0 with 5 Ada prompts a month and 500 records per app. Builder is $65/mo ($30 for the first month; $624/yr): 2 published apps, 5 editors, 1 instant update a month, AI with no prompt limit. Business is $200/mo ($1,920/yr): 5 apps, 10 editors, unlimited instant updates, analytics and localization. "No usage-based charges"; only extra AI credits cost more. Code export is a separately priced service.
- **Limits:** the app count is capped by plan. Code access is partial. IAPHUB has forum reports of products not showing, which led to rejections.
- **Publishing flow (help center outline):** Apple developer account → bundle ID → Adalo app-specific password → build in Adalo → add ASC team users → TestFlight → distribute the build to the App Store → choose release option, with guides on screenshots and on privacy/ATT.
- **Evidence:** [pricing](https://www.adalo.com/pricing) · ["the new Adalo"](https://www.adalo.com/posts/the-new-adalo/) · [iOS publishing help](https://help.adalo.com/publishing-apps/publishing-to-the-apple-app-store) · [IAPHUB](https://help.adalo.com/integrations/iaphub)

### Thunkable
- **Positioning:** a long-standing no-code mobile builder, now "Thunkable AI", a vibe-coding builder for "fully native" iOS and Android apps.
- **Best at:** publishing to both stores through APIs. It added the ASC API method (30 Mar 2026) and the Google Play API (11 May 2026). It has many device features (camera, NFC, Bluetooth, biometrics, AdMob, OneSignal push), RevenueCat IAP blocks, and the Thunkable Live QR preview.
- **Recent launches (release notes 2026):** AI full release on 25 Feb (press release 31 Mar). Supabase cloud DB and auth (27 May). IAP for AI projects (8 Jun). Store listing and purpose-string rejection fix (4 Aug). Live-app QR preview (24 Aug). Charts (6 Oct). Background audio (20 Oct).
- **Pricing:** Free has 2,000 AI tokens, 3 public projects and 5 screens. Accelerator is $19 ($18 yearly) with 20K tokens. Builder is $59 ($37 yearly) with 50K tokens and **1 live app**. Advanced is $189 ($99 yearly) with 100K tokens and unlimited live apps. A Black Friday 50% off was showing on 10 Nov 2026. If you lapse, published apps stop working for end users.
- **Limits:** one live app on Builder. No code export was found. Token overage is not stated.
- **Publishing flow:** connect an ASC API key and Play API credentials, and Thunkable builds, signs and uploads ("automates initial launches and updates"). Exactly how far submission goes is not documented in what I could read.
- **Evidence:** [pricing](https://thunkable.com/pricing) · [AI release notes](https://docs.thunkable.com/ai/release-notes) · [launch blog](https://thunkable.com/blog/from-idea-to-app-store-meet-thunkable-ai-the-fastest-way-to-build-and-launch-mobile-apps) · [RevenueCat IAP docs](https://docs.thunkable.com/ai/features/api/in-app-purchases-with-revenuecat.md)

### Cabano (cabano.app; Decision Trees Inc, Vancouver)
- **Positioning:** "Turn your idea into an App Store business." It is a no-code AI builder for **native SwiftUI** iOS apps and Metal/SceneKit games, with RevenueCat monetization built in. The Shopify app is a vertical version: a native storefront using Shopify Checkout Kit, push, and abandoned-bag reminders.
- **Best at:** the only product here that outputs native SwiftUI. It streams a real simulator into the browser, signs and uploads through an ASC API key (no Apple password), creates the TestFlight internal group automatically, adds RevenueCat paywalls by chat, and gives free automatic build repairs. On-device AI uses Apple Foundation Models with no API key.
- **Recent launches:** "Introducing Cabano" (9 Jul 2026). Shopify app "Mobile App Builder ‑ Cabano" (10 Aug 2026; still 0 reviews). Shopify blog post (3 Sep). Slack app (date ?). ChatGPT app, US listing (6 Nov 2026).
- **Pricing (web):** Free has 100 credits to start, reset every 30 days, and no publishing. Pro is $20/mo for 100 credits plus App Store publishing. Max is $100/mo for 1,000 credits with a priority queue. Each generation turn *reserves* 10 credits, and the final charge is 1 credit per $0.02 of agent cost. Repairs and failed builds are free or refunded. After a bundle, pay-as-you-go is $0.30/credit with a cap. Paid credits don't roll over. **Shopify app:** Free (first build plus 4 changes), Pro $50/mo or $500/yr, Max $100/mo or $1,000/yr. Extra generations there cost $0.25, capped at $200 per cycle, billed through Shopify.
- **Limits:** iOS only, with no Android. Docs contradict marketing on Expo support. No hosted backend, auth, storage or functions; you bring your own Supabase and run its SQL by hand. You create the ASC app record by hand (Apple has no API for it). Screenshots and metadata are manual. No team features or templates were found. Code export is "ask support".
- **Publishing flow:** (1) Enrol in the Apple Developer Program. (2) Create an ASC API key (App Manager) and add it to Cabano once; it's stored encrypted. (3) Cabano detects a missing app record and gives you values to paste: register the bundle ID and create the app in ASC. (4) Publish: Cabano generates the Xcode project on its Macs, creates or reuses the certificate and profile, builds, signs and uploads (5–15 min). (5) "Run on your device" goes to the internal TestFlight group with no review. (6) You finish screenshots (captured from the simulator), description, keywords, privacy policy, privacy questionnaire and export compliance in ASC, then submit. (7) Rejection: follow the "Passing App Review" doc, fix it in chat, bump the version and republish.
- **Acquisition:** I found no Facebook Page and no Meta ads for "Cabano app builder" or "cabano.app". The site does load the Meta Pixel (`fbq`) and the TikTok pixel, which suggests it is set up for paid ads. It also uses the ChatGPT and Shopify app stores as distribution.
- **Evidence:** [homepage](https://cabano.app/) · [llms.txt](https://cabano.app/llms.txt) · [llms-full.txt](https://cabano.app/llms-full.txt) · [introducing post (9 Jul 2026)](https://cabano.app/blog/introducing-cabano/) · [ChatGPT post (6 Nov 2026)](https://cabano.app/blog/build-iphone-apps-in-chatgpt/) · [Shopify listing](https://apps.shopify.com/cabano) · docs: [publish](https://cabano.app/docs/publish-to-the-app-store), [listing](https://cabano.app/docs/app-store-listing), [app review](https://cabano.app/docs/app-review), [credits](https://cabano.app/docs/credits) (JS-rendered; text read from the site bundle)

---

## 3. Which of these are real threats to an AI mobile builder focused on App-Store-ready subscription apps?

1. **Cabano is the closest threat.** It has nearly the same pitch ("idea → App Store business", subscriptions and paywalls from chat, "100 credits to start", $20 Pro). It is native SwiftUI with real simulator streaming and automatic TestFlight. It is early: launched Jul 2026, no Meta ads seen, 0 Shopify reviews. It has gaps: iOS only, no hosted backend or auth, and it doesn't do the "listing" work (no screenshot generation, no ASO copy, no metadata push, no pre-flight check). **Those gaps are the opening:** cross-platform, a built-in backend, and fully automated listing, screenshots and submission.
2. **Replit is the strongest well-funded threat.** It already has RC → ASC product sync, AI store screenshots, signing and upload via Launch, and a full backend, with $9B behind it and growing paid acquisition (18 Meta ads, mobile UGC angle). Its weak spots: no Google Play, no ASO copy or metadata push, a manual review submit, Android missing, unpredictable effort-based pricing, and it is a general tool rather than a subscription-app specialist.
3. **FlutterFlow is a medium threat, rising.** Its 4 Nov 2026 agent builder brings 3.3M builders, both stores, RevenueCat paywall actions and a built-in backend into prompt-to-app. It is pricier ($39–150), aimed at agencies and teams, and has no ASO or screenshot tooling.
4. **Thunkable and Draftbit are niche threats.** Both publish to both stores and support RevenueCat. Draftbit is cheap ($12–30) and owns its code; Thunkable has API publishing to both stores. They have little brand pull in "AI app builder" and no Meta ads.
5. **Adalo is a low threat.** It is no-code SMB-focused, $65+, with app caps, the IAPHUB route and limited code access.
6. **Bolt and Lovable are threats for attention, not features.** Bolt stops at code (you run EAS yourself). Lovable doesn't build native apps at all. Their users are an **acquisition pool** for a "take your Bolt or Lovable idea to the App Store, with a paywall" offer. Lovable alone runs 537 active Meta ads.

Gaps none of the eight cover end to end: generated **App Store metadata and ASO copy** pushed to ASC, **automated submission with a pre-flight check against the guidelines**, and **paywall templates plus RC/ASC product setup on both stores**. Replit comes nearest on the last one, and only for iOS.
