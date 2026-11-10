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

---

# Additions from the full documentation pass (2026-11-10)

The first catalog was built against a fixed checklist. A second pass read every vendor's full documentation index (llms.txt, docs sitemap, changelog, pricing tables). Full lists with a doc link on every bullet:
- [features-full-group1.md](features-full-group1.md): Rork, Vibecode, Anything, a0, Bitrig, Superapp, Newly, Cabano.
- [features-full-group2.md](features-full-group2.md): Replit, Bolt, Lovable, FlutterFlow, Draftbit, Adalo, Thunkable, BuildNatively, plus new competitors.

## New features found

**Guarantees, programs and pricing**
- **Launch Pass ($149 one-time, full refund if the app isn't live on the App Store within 30 days):** Vibecode (refund policy, 6 Nov).
- **Referral programs:** Vibecode (two-sided, 28 Sep).
- **Credits for social posts:** Vibecode.
- **Affiliates:**
  - Superapp: 30% for 12 months, up to $150 per customer, plus an ambassador program.
  - Anything: 30% for 1 year.
  - Rork: affiliate program (terms unread).
- **Experts network and template sellers:** Anything (Contra experts; creators sell templates).
- **Education discount and Teams/Enterprise plans:** Bitrig.

**Templates**
- **Remixable templates:** Vibecode (166).

**Store listing, readiness and publishing**
- **Store listing automation:**
  - Thunkable (4 Aug): AI store text and keywords, AI icon and feature graphic, hosted privacy policy, requirements checklist, automatic iOS permission strings.
  - Base44: guideline scan for both stores with a "Readiness Score" and AI fixes.
  - FlutterFlow's new builder: submits for review to both stores in-product, plus a flow for Apple change requests.
- **AI store assets:**
  - Replit: icon concepts, 5 framed screenshots, the Play feature graphic.
  - Thunkable: iOS 26 Liquid Glass tabs, dark-mode icons, splash screens.
- **App Store listing preview** (per language, light and dark mode, flags edits made in App Store Connect): Bitrig (14 Oct). Bitrig submission for review is now documented, not just claimed.
- **App website with a privacy policy drafted from the app's code:** Superapp. Its MCP server is live now.

**Marketing and post-launch**
- **Marketing inside the builder:**
  - Newly: AI-presenter videos with voice cloning, clay animated ads, posting to social accounts you buy, store analytics for both stores, an "Interviews" tab.
  - Superapp Selfdrive: ChatGPT prompt research for AI-search optimization (works for apps built elsewhere).
- **Post-launch services:** Newly Email (app emails and campaigns from your own domain); Newly AI support chat with a knowledge base inside your app (rolling out).

**Agent and workflow**
- **Skills:** Newly, Bitrig.
- **Project memory:** Newly.
- **Scheduled hourly agent runs:** Newly.
- **Agent modes:**
  - Rork: Design, Plan, Build.
  - Anything: Fast, Discussion, Plan, plus Max, which tests in a real browser.
  - Draftbit: Mockups (side-by-side design options) and Briefs (written plans and research).
- **Model choice per message:** Rork (with effort levels), Vibecode.
- **Bring your own AI subscription or key:**
  - Draftbit: Claude, ChatGPT, OpenAI, Anthropic or OpenRouter, even on Free.
  - Bitrig: your own Claude or ChatGPT.
  - Bolt Forge: cheaper open-source models.
- **Teams with roles:**
  - Rork: Editor/Viewer, comments, project cloning.
  - Newly: Admin/Editor/Viewer.
  - Anything: real-time workspaces, REST API for members and roles.
  - Superapp: unlimited free collaborators (waitlist).

**Platforms and capabilities**
- **More Apple platforms:** Bitrig CarPlay (27 Oct), Apple TV (8 Jul), Shortcuts/App Intents/Siri (27 May).
- **Media generation:**
  - Rork: video, music, voice, dialogue, 3D models, multiplayer voice chat in games.
  - Vibecode: Sora and Seedance video APIs.
  - Cabano: Apple Image Playground and Writing Tools.
- **Ways to start and test:**
  - Cabano: Slack app, seeding app data from CSV/JSON.
  - Install by USB or QR: Newly, Superapp, Cabano, Rork Companion.
  - Newly simulator: fake GPS location, webcam as the camera.
- **Over-the-air updates (documented):** Draftbit (Pro), Bubble, Adalo, Expo.
  - Every change needs a new store build at Bolt and Emergent.
  - Not available in FlutterFlow's new builder.
- **Web app installable to the home screen, with offline and push (no App Store path):** Lovable (Jun 2026).

## Corrections to the first catalog

**Confirmed gaps at the leaders**
- **Replit:** its docs say "Publishing to Google Play is not yet supported."
- **FlutterFlow's new builder (4 Nov):** no in-app purchases, no code export, no GitHub. Classic Studio keeps them.
- **Bolt:** mobile publishing is fully manual.

**Contradictions in the vendors' own docs**
- **Anything:** one page lists push and HealthKit as available; another says push is "coming Q1 2026".
- **Cabano:** one page offers Expo builds; another says there's no React Native/Expo. Its code also has a hidden Android emulator option.

## New competitors

| Competitor | What it is | Store publishing | Notes |
|---|---|---|---|
| **Emergent** | AI app builder | Builds and signs (creates the App Store Connect key itself); RevenueCat subscriptions | 30+ active Meta ads (earliest 4 Aug) |
| **Base44** (Wix) | Web app wrapped into store apps | Guideline scan + Readiness Score + AI fixes; push; fixed bundle ID `com.base<id>.app` | 30+ active Meta ads (earliest 26 Feb); wrapper risk under 4.2 |
| **Bubble** | Native mobile editor | App Store + Play in-app purchases; OTA updates; ~45-min build submission | Mobile plans $42/$169/$449 per month (yearly billing) |
| **Expo** (EAS + Launch v2.3) | Publishing infrastructure | Publishes a local project or public GitHub repo (incl. Flutter) to the App Store, Play, web, Meta VR | MCP server; agents that test on a cloud simulator. It's the plumbing many builders sit on |
| **RapidNative** | AI builder | Via sister service LetsDeployIt | Lightly verified |
| **CatDoes** | Lovable/Shopify site → mobile app | — | Lightly verified |
| **OnSpace** | AI builder | — | Lightly verified |
| **Appy Pie** | Agent builder | — | Launched 3 Nov 2026; lightly verified |

**Not real competitors**
- Mocha: shut down 1 Aug 2026.
- Same and Glide: web apps only (Glide's mobile option is add-to-home-screen).
- Orchids: mobile is only claimed, and its site showed "deployment paused".
- Momen: iOS only since Oct 2026.

## Updated: what nobody has (after both passes)

- **A check of a new app against the founder's own other apps** (Apple's 4.3 look-alike spam rule). Pre-flight and readiness scans exist (Rork, Vibecode, Anything, Newly, Thunkable, Base44), but none compares across your portfolio.
- **A mock Apple review run on the real release build** (walkthrough, demo login, sandbox purchase, account deletion, iPad).
- **Paywall A/B testing**, and a gallery of review-safe paywall templates.
- **Credits back when the AI's own fix breaks something.**
  - Anything and Cabano refund only failed generations or builds.
  - Vibecode's Launch Pass refunds only if the app isn't live within 30 days.
- **SSO / SOC 2, white-label, and generating in-app translations:** not documented anywhere.
- **HealthKit and home-screen widgets:** rare. Only BuildNatively documents HealthKit; widgets only at Rork Max and Bitrig.

## Still unknown

- a0.dev prices.
- Rork refund and affiliate terms.
- Superapp launch dates (no changelog).
- Thunkable's output stack.
- Lovable's live plan prices.
- Refund policies at Bolt, Thunkable and Draftbit.
- Anything visible only after signing up. That needs hands-on teardowns.
