# Every feature competitors offer (AI mobile app builders, 2026-11-10)

Compiled from [features-part-a.md](features-part-a.md) and [features-part-b.md](features-part-b.md); source links are there. "Claimed" means the marketing page says it but the docs don't confirm it.

## 1. Input: how you start an app
- **Text prompt / chat:** all AI builders.
- **Voice prompt:** Lovable (phone app).
- **Image or screenshot input:** FlutterFlow (images to the agent), plus several others via chat attachments.
- **Figma import:**
  - Bitrig (Sep 23).
  - Superapp.
  - Newly (Figma sources, Oct 7).
  - Replit Design (Jul 29).
  - Bolt (Figma frames in chat).
  - FlutterFlow (theme).
- **Build from a spreadsheet** (Google Sheets / Excel / Airtable): Adalo SheetBridge.
- **Build from a website URL** (wrapper): BuildNatively ("Lovable/Base44/Replit app → mobile").
- **Build from a Shopify store:** Cabano Shopify app (native storefront with Checkout Kit).
- **Plan / spec step before building:**
  - Anything (Plan Mode).
  - FlutterFlow (agent plans, Oct 20).
  - Lovable (plan mode).
- **Templates / design inspiration:**
  - Anything (template marketplace).
  - Replit Design (Mobbin templates, design systems).
  - Bolt (design systems).
  - Newly (free designs, Nov 4).
- **Build from your phone:**
  - Vibecode ("Built on iPhone", Sep 28).
  - Rork Max iPhone app.
  - Lovable companion app.
  - a0 app.
  - Bitrig Remote (iPhone).
- **Build inside ChatGPT:** Cabano ChatGPT app (Nov 6); Superapp (coming soon).
- **Build from Slack:** Cabano.

## 2. Generation: what it builds
- **Output stacks:**
  - Expo / React Native: Anything, a0, Newly, Vibecode, Replit, Bolt, Draftbit.
  - Native SwiftUI: Rork, Vibecode (since Sep 10), Bitrig, Superapp, Cabano.
  - Native Kotlin (Android): Rork only.
  - Flutter: FlutterFlow only.
  - Proprietary runtime: Adalo, Thunkable.
  - WebView wrapper: BuildNatively.
  - Web only (no mobile): Lovable.
- **More Apple platforms:**
  - iPad, Watch, Vision Pro, widgets and games: Rork Max.
  - Widgets, Live Activities, Controls, App Intents, Siri and Watch complications: Bitrig.
  - Metal/SceneKit games: Cabano.
- **On-device AI:**
  - Apple Foundation Models: Bitrig, Cabano (no API key needed).
  - LLM calls inside the app: Replit (OpenAI), Anything (integrations).
- **Visual / click-to-edit editor:**
  - FlutterFlow Studio, Draftbit, Adalo, Thunkable.
  - Lovable and Bolt (web).
- **Code view and edit:** most builders; Bitrig works on real Xcode projects.
- **Code export:**
  - Free / included: Anything, a0 (Pro), Bitrig (Free), Superapp, Newly, Replit, Bolt, FlutterFlow (Basic+), Draftbit (Standard+).
  - Paywalled: Vibecode ($50 Pro), Rork (paid plans).
  - Paid service: Adalo.
  - Ask support: Cabano.
  - None: Thunkable, BuildNatively.
- **GitHub sync:**
  - Two-way: Newly (Sep 24).
  - One-way: Draftbit.
  - Org app: Bolt.
  - Pull requests: Bitrig.
  - Paid plans only: Rork Pro, FlutterFlow Pro.
  - Coming soon: Anything.
- **Bring your own AI:**
  - Your own Claude/ChatGPT subscription: Bitrig, Draftbit (Claude Code or Codex in the sandbox).
  - Agent plugins: FlutterFlow (MCP / Claude Code / Codex).
- **Parallel agents / background tasks:**
  - Bitrig (Sep 3).
  - Draftbit (up to 5 on Pro).
  - FlutterFlow (Nov 4).
  - Anything (background agents).
- **Self-healing:**
  - Free automatic build repairs: Cabano.
  - Max-mode browser agent that tests and fixes: Anything.
  - AI QA: FlutterFlow (Test Pilot).
  - Agent testing on all projects: Vibecode.
- **MCP server / CLI / API for agents:**
  - Vibecode (MCP + CLI).
  - Anything (API + CLI + OpenAPI).
  - FlutterFlow (MCP).
  - Superapp (MCP coming).
  - Rork (App Store Connect CLI, open source).
- **Next-screen mockups:** Draftbit.

## 3. Preview and testing
- **Cloud iOS simulator in the browser:**
  - Rork (0.2 credits/min).
  - Cabano (streamed).
  - Replit (Core+).
  - Draftbit (Pro).
  - Superapp (preview minutes capped by plan).
- **Expo Go / QR on device:**
  - Bolt, Anything (your own Expo token), a0, Replit.
  - Thunkable Live QR.
  - Vibecode (install from web via QR).
- **iPhone Duo previews:** Vibecode, Bitrig.
- **Simulator per agent:** Bitrig.
- **TestFlight:**
  - Automatic internal group: Cabano.
  - Beta invite links: Rork.
  - Most others upload to TestFlight.
- **Android APK / internal testing track:** Rork, a0, Newly, Draftbit, FlutterFlow, Anything (beta), BuildNatively.
- **Payments testable in preview:** Vibecode (test-buys in the simulator). Expo Go can't do this (a0, Replit, Bolt).
- **3D app demo recording:** Bitrig (Nov 4).

## 4. Backend and data
- **Built-in database:**
  - Postgres: Anything, Replit.
  - Convex: a0.
  - Own backend: Bolt Cloud, Lovable Cloud, Rork Cloud, Vibecode Cloud ($20/mo per live backend).
  - Database tab: Newly (Nov 9).
  - Supabase cloud DB: Thunkable.
  - Built-in DB: Adalo, FlutterFlow (Nov 4 builder).
- **Bring your own backend:**
  - Supabase: Cabano (run SQL by hand), FlutterFlow, Draftbit (beta).
  - Firebase: FlutterFlow (Newly doesn't support it).
  - CloudKit: Bitrig.
- **Auth:**
  - Email, Google, Apple: most builders.
  - Sign in with Apple: Bitrig, Vibecode (also creates the App Store Connect API key), BuildNatively.
  - Sign in with Apple missing: Anything ("coming soon").
- **File storage:** Anything, Replit, Bolt, Lovable.
- **Server functions:** Bolt, Replit, Lovable.
- **Secrets kept out of the app:** Rork (Secrets), Draftbit (encrypted), Replit, Bolt.
- **Integration libraries:**
  - 100+ integrations: Anything.
  - Deep integrations list: FlutterFlow.
  - AI gateway: Lovable.
- **Database rollback:** Replit Pro (28 days).
- **Spreadsheets as a data source:** Adalo.

## 5. Monetization
- **RevenueCat subscriptions:**
  - Rork, Vibecode, Anything, Superapp, Bitrig, Cabano (by chat).
  - Replit, FlutterFlow (Sep 24), Draftbit (MCP), Thunkable, BuildNatively.
- **Creates App Store Connect subscription products for you:**
  - Vibecode (products + in-app purchase key + RevenueCat config + test buy).
  - Newly (Subscriptions tab, prices per country).
  - Bitrig.
  - Replit (sync RevenueCat to App Store Connect).
  - a0 (YAML config sync).
- **StoreKit directly:** Bitrig, Superapp.
- **IAPHUB:** Adalo.
- **Stripe (web):** Anything, Adalo, FlutterFlow.
- **Ads:**
  - AdMob: Anything (plus AdSense), FlutterFlow, Thunkable.
- **Analytics:**
  - In-app analytics: Rork, Adalo (Business), FlutterFlow (Nov 4).
  - Marketing attribution (AppsFlyer, Facebook): BuildNatively.
  - Store-page conversion analytics: Newly.

## 6. Native capabilities
- **Push notifications:**
  - Bitrig (Aug 18).
  - a0 (APNs + FCM).
  - Thunkable, Adalo, FlutterFlow.
  - BuildNatively (OneSignal).
  - Cabano Shopify (abandoned-bag reminders).
  - Coming: Anything ("Q1 2026").
- **Camera, NFC, Bluetooth, biometrics:** Thunkable. Camera apps: Bitrig (iPhone Duo).
- **Location:** BuildNatively plugin, Thunkable.
- **Background audio:** Thunkable (Oct 20).
- **Charts:** Thunkable (Oct 6).
- **Deep links:** BuildNatively (Branch).
- **Localization:** Adalo Business, Newly (screenshots in every language), Rork (localize skill).

## 7. Publishing: the last mile
- **Cloud build + signing + upload to App Store Connect:**
  - On builder-run Macs: Rork, Cabano, Vibecode.
  - Via Expo Launch: Anything, Replit.
  - Others: a0, Newly, FlutterFlow, Draftbit, Thunkable (App Store Connect API), Adalo, Superapp.
  - From your own Mac: Bitrig.
  - In your own terminal: Bolt (EAS).
- **Apple connection method:**
  - Apple ID + 2FA: Rork, Anything, Replit.
  - App Store Connect API key: Cabano, FlutterFlow, Thunkable, Newly.
  - Sign in with Apple, then the key is created for you: Vibecode.
- **Creates the App Store record for you:** Bitrig. Cabano gives you values to paste. a0 and FlutterFlow make you create it yourself.
- **Writes the App Store listing** (description, keywords, category):
  - Vibecode (at publish).
  - Newly (writes straight to App Store Connect, plus promo text and URLs).
  - Superapp (ASO-optimized, claimed).
  - Bitrig (listing in the project, one-click push).
  - Rork (reported Max Publishing).
- **Store screenshots:**
  - Designed, captioned, every language, both stores: Newly (Oct 17).
  - Screenshot Studio (free beta, iPhone): Rork.
  - Generator with AI captions: Anything.
  - AI framed screenshots: Replit.
  - Captures across devices and languages: Bitrig.
  - 3 captured shots: Vibecode.
  - Manual, captured from the simulator: Cabano.
- **Privacy policy and support pages written and hosted:** Vibecode. Termly suggested: Anything.
- **Privacy answers filled in:** Superapp (claimed). Newly and Cabano leave this to you.
- **App Review notes, contact and demo account:** Newly (Oct 7). A reviewer phone number is asked for by Vibecode.
- **Review screen recording / simulator walkthrough:** Newly.
- **Pre-flight / compliance check:**
  - AI App Store Reviewer (paid): Rork.
  - Preflight for Expo apps: Vibecode.
  - "App Store Review" check: Anything.
  - Readiness checklist: Newly.
  - Store-listing and purpose-string rejection fixes: Thunkable (Aug 4).
- **Submits for review for you:**
  - Vibecode (Swift apps; documented).
  - Bitrig and Superapp (claimed).
  - Everyone else: you press submit.
- **Fixes after a rejection:**
  - Reads Apple's rejection and starts the fix: Newly (Sep 29).
  - "Passing App Review" guide: Cabano.
- **Google Play:**
  - All the way to production: Newly (Sep 23).
  - One-click: FlutterFlow, Draftbit, Thunkable (Play API), Adalo.
  - AAB to the internal track: Rork, Anything (beta).
  - Builds files only: BuildNatively.
  - Not supported: Vibecode (built-in), Replit, Superapp, Bitrig, Cabano, Lovable.
- **Over-the-air updates:** a0, Draftbit, Adalo (instant updates, capped on Builder). BuildNatively syncs site changes without a rebuild.
- **Human publishing help:**
  - Experts + App Store Assistance on Pro: Draftbit.
  - $600 publishing service and "100% release guarantee": BuildNatively.
  - Unlimited support calls on Max: a0.

## 8. Growth after launch
- **ASO keyword ranking tracking:** Superapp Selfdrive (top 50, autocomplete popularity).
- **Apple Search Ads management:** Superapp, Newly (Oct 24).
- **UGC creator hiring / campaigns:** Newly (Oct 20), Superapp.
- **AI marketing videos with voice-cloned narration:** Newly (Oct 2).
- **App website plus SEO/GEO:** Superapp.
- **Replies to App Store and Play reviews:** Rork, Newly.
- **Daily growth email report:** Superapp.
- **Growth tools that work for apps built elsewhere:** Superapp Selfdrive.

## 9. Platform and workflow
- **Web app:** most builders.
- **Mac app:** Bitrig (required), Superapp, Anything (desktop companion).
- **iPhone app:** Vibecode, Rork Max, Lovable, a0.
- **Teams and collaboration:**
  - Replit Pro (15 collaborators).
  - FlutterFlow (seats).
  - Draftbit (seats).
  - Adalo (5–10 editors).
  - Bolt Teams.
  - None found: Cabano.
- **Version history and rollback:**
  - Version restore: Bolt (Oct).
  - Checkpoints: Replit.
  - Branches: FlutterFlow Pro.
- **Usage / credit dashboard:** Vibecode (Usage tab).
- **Community and contests:** Replit ($15K Mobile Buildathon, $50K Designathon).

## 10. Pricing mechanics
- **Free tier:**
  - With building:
    - Rork: 35 design credits/mo.
    - Cabano: 100 credits, reset every 30 days.
    - Bolt: 1M tokens/mo.
    - Lovable: 5 credits a day.
    - Draftbit: 3,000 one-time credits.
    - Thunkable: 2,000 tokens.
    - Adalo: 5 prompts/mo.
    - FlutterFlow: 2 projects.
    - Superapp: daily credits.
  - First build only: Vibecode.
  - No free plan: Newly.
  - Paid plan needed to build: Anything.
- **Entry paid price:**

| Builder | Entry price |
|---|---|
| Bitrig Pro | $15 |
| Draftbit | $15 |
| Anything | $19 (yearly) |
| Rork, Vibecode, a0, Cabano, Replit | $20 |
| Lovable, Bolt, Newly, Superapp | $25 |
| FlutterFlow | $39 |
| Thunkable Builder | $59 |
| Adalo | $65 |

- **Top plans:** Rork $1,800 · Newly $1,600 · Lovable $2,250 · Anything $1,079 · Vibecode $200 · a0 $200 · Thunkable $189 · Adalo $200 · FlutterFlow $150 · Superapp $100 · Cabano $100.
- **Credit rules worth noting:**
  - Credits that never expire: Vibecode.
  - No credits for previews, builds, TestFlight or hosting: Newly.
  - Refunds for failed generations: Anything.
  - Free repairs, failed builds refunded: Cabano.
  - Charges failed builds by the minute: Vibecode.
  - Charges simulator minutes: Rork.
  - 3× model-cost markup: Superapp.
  - Each generation reserves 10 credits, then charges actual cost: Cabano.
  - Top-ups expire after 12 months: Newly, Lovable, Superapp.
  - Top-ups never reset: Rork.
- **Plan limits by app count:** Thunkable Builder (1 live app), Adalo (2 or 5 apps).
- **Apps stop working if you stop paying:** Thunkable.
- **Lifetime deal:** BuildNatively ($699).
- **Refunds:** none on subscriptions (Anything, Superapp, Vibecode per reviews). Only Anything and Cabano refund failures.
