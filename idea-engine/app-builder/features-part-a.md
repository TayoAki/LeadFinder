# AI mobile app builders: feature breakdown (part A)

Checked 2026-11-10. Eight products are scored on every row of [feature-taxonomy.md](feature-taxonomy.md).

**How to read this**
- **✅** has it. **◐** partial or limited (the note says how). **❌** doesn't have it. **?** couldn't verify.
- "Docs" means the vendor's own docs or changelog, read today, usually as raw `.md` from Mintlify `llms.txt` indexes. JS-rendered pricing pages were rendered in a headless browser.
- **Reported** means the claim comes only from press or a third-party site.
- "Claim" means marketing copy on the vendor's own site that its docs don't confirm.

**Two identity fixes before the tables**
- **Natively is two products.** `natively.dev` now 301-redirects to `newly.app`; Newly's About page says "Newly — formerly Natively". The product still trading as **Natively** is **BuildNatively** (`buildnatively.com`). It is a website-to-app **WebView wrapper** with plugins, a $699 lifetime plan and a "100% app store release guarantee", and it matches the prior notes. The Natively column below is BuildNatively. Natively.dev's AI builder is the Newly column.
- **Bitrig changed shape.** It is now a **Mac app** (macOS 15+, Apple silicon) that runs *your own* Claude Code, Codex or other ACP agent on real Xcode projects, plus Bitrig Remote on iPhone. It is not a cloud builder anymore. Pro is $15/mo, not the ~$25 reported earlier.
- **Rork no longer makes Expo apps.** Docs: "You can no longer create Expo (React Native) projects in Rork." New apps are Swift/SwiftUI (iPhone), Kotlin/Compose (Android) or React (web).

---

## 1. Feature matrix

Columns: **Rork · Vibecode · Anything · a0.dev · Bitrig · Superapp · Newly · Natively (BuildNatively)**

### 1. Input

| Feature | Rork | Vibecode | Anything | a0.dev | Bitrig | Superapp | Newly | Natively |
|---|---|---|---|---|---|---|---|---|
| Text prompt | ✅ | ✅ | ✅ | ✅ | ✅ (your own agent) | ✅ | ✅ | ❌ URL + settings form, no AI |
| Image / screenshot to app | ✅ attach image as style or content reference; annotate sim screenshots | ✅ attach screenshots or mockups | ✅ image selector, drag-drop | ? | ? | ✅ "Bring assets and design references" doc | ✅ screenshots, files; video/PDF/zip since 5 Nov 2026 | ❌ |
| Figma import | ? | ? | ✅ docs/import/figma | ? | ✅ via Figma MCP, maps Apple UI Kit to real controls (23 Sep 2026) | ✅ Pro+ | ✅ "Project sources" (7 Oct 2026) | ❌ |
| Voice input | ✅ dictation (Rork Max iPhone app) | ? | ? | ? | ✅ dictation, steer mid-task | ? | ? | ❌ |
| Reference app / URL | ✅ import a website, Lovable, GitHub or another builder | ◐ web-to-mobile prompt guide | ◐ Mobbin references, Mocha import | ? | ◐ import existing Xcode repo | ✅ website to app, rebuild an existing app, Lovable/Replit as reference | ✅ "Lovable/GitHub to Mobile App" (24 Sep 2026) | ✅ the whole product: URL → app |
| Plan / spec step | ✅ Plan mode draws key screens + flow diagram; Design mode | ? | ✅ Plan mode | ? | ✅ `/plan`, `/goal` | ? | ✅ Plan mode; 4 free home-screen designs (4 Nov 2026) | ❌ |

### 2. Generation

| Feature | Rork | Vibecode | Anything | a0.dev | Bitrig | Superapp | Newly | Natively |
|---|---|---|---|---|---|---|---|---|
| Expo / React Native | ◐ legacy projects only, no new ones | ✅ "Mobile app" type | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| SwiftUI | ✅ | ✅ "iOS app" type, GA 10 Sep 2026 | ❌ | ❌ | ✅ full Xcode toolchain | ✅ iPhone, iPad, Watch, Mac | ❌ | ❌ |
| Kotlin | ✅ Jetpack Compose | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Flutter | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Webview | ❌ (web apps are separate React sites) | ❌ (separate web apps) | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ the whole product |
| Multi-screen (stated limit) | ✅ none stated | ✅ none stated | ✅ none stated | ✅ none stated | ✅ none stated | ✅ none stated | ✅ none stated | ◐ mirrors the website |
| Design system / theming | ✅ picture-based style questions, then Design mode | ? | ✅ "apps that look good out of the box" | ? | ◐ Apple HIG, Liquid Glass, SF Symbols | ? | ✅ 4 looks to pick from | ◐ brand colours, icon |
| Brand kit | ? | ? | ? | ? | ? | ? | ? | ◐ icon, colours, images |
| Iterating by chat | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Visual editor (click to edit) | ✅ Element Selection | ◐ "Pinch to Build" long-press menu (phone app) | ? | ? | ✅ "Select to Edit" | ? | ◐ homepage claims a "canvas that lets you tweak UI" | ❌ |
| Code view / edit in browser | ✅ read on all plans, edit on paid | ◐ `<>` code panel (editing unverified) | ✅ Code view + file search | ? | ✅ diff review + hand edits (Mac app) | ✅ Mac app works on local project | ? | ❌ |
| Code export | ✅ paid plans, via GitHub | ✅ Pro $50+ (Xcode / Expo / web project + SSH) | ✅ ZIP download | ✅ Pro ("Export your code") | ✅ free; it's your local Xcode project | ✅ Mac app keeps a local Xcode project; "no lock-in" | ✅ ZIP (27 Sep 2026) + CLI | ◐ binaries (IPA/APK/AAB) only |
| GitHub sync | ✅ two-way | ? | ❌ "coming soon" | ? | ✅ commits + PRs | ? | ✅ two-way (24 Sep 2026) | ❌ |
| Version history / rollback | ✅ every message is a version | ◐ deployment history + past native builds | ✅ version history, restore | ? | ✅ git history | ✅ "History and recovery" | ✅ Undo / Restore to here (free) | ❌ |
| Error auto-fix | ? (docs cover manual "error loop" escape only) | ✅ Agent testing, on for all (29 Sep 2026) | ✅ Max: browser agent tests and fixes | ? | ✅ "Simulator Use" taps through app, reads logs, fixes | ? | ✅ automatic fix turns on build fail or crash (costs credits) | ❌ |

### 3. Preview and testing

| Feature | Rork | Vibecode | Anything | a0.dev | Bitrig | Superapp | Newly | Natively |
|---|---|---|---|---|---|---|---|---|
| Web preview | ✅ cloud simulator in browser | ✅ cloud iOS Simulator streamed | ✅ web preview of mobile code | ✅ react-native-web | ❌ Mac app, local simulators | ✅ preview minutes 240 / 480 / 960 by plan | ✅ iOS + Android cloud sims (no credit cost) | ◐ your site itself |
| On-device preview | ✅ Rork Max iPhone app, Companion (USB), TestFlight | ✅ iPhone app; QR "Build and install" from web (15 Sep 2026) | ✅ Expo Go via QR (needs your own Expo account + token) | ✅ a0 iOS app / Expo Go v52 (Android) | ✅ install from Mac or Bitrig Remote (Pro, paid Apple account) | ✅ QR (web) or USB (Mac) | ✅ USB or QR install, TestFlight group with no beta review | ✅ real-device testing |
| iOS simulator | ✅ cloud sim, 0.2 credits/min | ✅ incl. iPhone Duo | ◐ none of its own (Vibecode's comparison says paid plans stream one; not on Anything's docs) | ❌ | ✅ photoreal 3D sims incl. iPhone Duo | ✅ | ✅ | ? |
| TestFlight builds | ✅ | ✅ | ✅ | ✅ | ✅ Pro | ✅ | ✅ public link + beta review (24 Sep 2026) | ✅ "automatic iOS app uploading" |
| Android APK | ✅ APK + AAB | ◐ RN projects only; no built-in Play step | ◐ AAB to Play internal (beta); APK not documented | ✅ APK | ❌ Apple only | ❌ Apple only | ✅ APK (QR download 24 Oct 2026) | ✅ APK/AAB |

### 4. Backend and data

| Feature | Rork | Vibecode | Anything | a0.dev | Bitrig | Superapp | Newly | Natively |
|---|---|---|---|---|---|---|---|---|
| Built-in database | ✅ Rork Cloud (Postgres, RLS, Edge Functions; free in beta) or your own Supabase / Firebase | ✅ Vibecode Cloud (SQLite + Prisma), $20/mo per live backend; Plus includes 1, Pro 3, Max 5 | ✅ built-in Postgres (dev/prod branches) | ✅ Convex or Supabase | ✅ CloudKit or Supabase (schema + migrations) | ✅ Superapp Cloud (billed in credits) or Supabase | ✅ Newly Backend (hosting costs no credits) or Supabase; Firebase not supported | ❌ uses your website |
| Auth (email / Apple / Google) | ✅ Rork Auth (Google + Apple); Supabase for email | ✅ email OTP + Google + Apple (Better Auth) | ◐ email + Google (+ Facebook, X); **Apple "coming soon"** | ? | ✅ Sign in with Apple + email/social/anon | ✅ Sign in with Apple first | ✅ email, Google, Apple | ◐ social login plugin (Google, Facebook, Apple, Microsoft, Kakao) |
| File storage | ✅ | ✅ | ✅ Uploads | ? | ◐ via Supabase / CloudKit | ✅ | ✅ | ❌ |
| Server functions / API routes | ✅ Edge Functions | ✅ | ✅ Functions + API routes | ✅ Convex actions | ✅ Supabase functions | ✅ | ✅ `backend/` + prod deploy | ❌ |
| Secrets handling | ✅ Secrets editor labels each key "Server-side only" / build-time / shipped | ✅ ENV tab ("never hardcode") | ✅ Saved Secrets | ? | ? | ✅ secure environment settings | ✅ secrets card; agent never sees value (25 Sep 2026) | n/a |
| Third-party APIs | ✅ | ✅ built-in AI/media/data APIs billed via credits | ✅ 100+ built in | ✅ built-in AI + image APIs | ✅ Swift packages | ✅ | ✅ | ◐ OneSignal, AppsFlyer, Branch, RevenueCat plugins |

### 5. Monetization

| Feature | Rork | Vibecode | Anything | a0.dev | Bitrig | Superapp | Newly | Natively |
|---|---|---|---|---|---|---|---|---|
| IAP / subscriptions (StoreKit / RevenueCat) | ✅ connect RevenueCat, then "Set up RevenueCat" in chat builds offerings | ✅ **Swift: one prompt creates ASC subscription group, prices, trial, IAP key, RC config, paywall, Restore; test-buys in sim** | ✅ RevenueCat (platform-level ASC + RC connect) | ✅ own system; "Sync Plan" creates products in App Store Connect | ✅ StoreKit or RevenueCat; creates and syncs ASC products | ✅ RevenueCat or StoreKit | ✅ Subscriptions tab creates ASC products, per-country prices, review screenshot (28 Sep 2026) | ✅ RevenueCat plugin |
| Paywall templates | ◐ agent-built, no gallery | ◐ agent-built | ? | ◐ paywall renders "offerings" | ◐ "native, localizable purchase screens" | ◐ agent-built | ◐ agent-built; motion skill for paywall art | ❌ |
| Stripe (web) | ◐ only as a server secret example | ✅ web apps | ✅ web apps | ✅ web | ? | ? | ◐ Stripe plugin builds pass TestFlight | ? |
| Ads (AdMob) | ? | ? | ✅ AdMob + AdSense, IDs kept in secrets | ◐ "ad networks" need a native build | ? | ? | ? | ? |
| Analytics | ✅ RevenueCat revenue, MRR, trials in Analytics tab | ❌ "Analytics (coming soon!)" | ✅ visitors, sources, revenue | ✅ users/subscriptions dashboard | ? | ✅ Max: advanced analytics; Selfdrive dashboard | ✅ users, revenue, App Store + Play page conversion (Oct 2026) | ✅ AppsFlyer / Facebook |

### 6. Native capabilities

| Feature | Rork | Vibecode | Anything | a0.dev | Bitrig | Superapp | Newly | Natively |
|---|---|---|---|---|---|---|---|---|
| Camera | ✅ | ✅ | ✅ expo-camera | ? | ✅ (Continuity Camera into sim) | ✅ | ? | ? |
| Push notifications | ✅ via backend | ✅ Expo Push (RN) | ◐ docs table still says "Coming Q1 2026" | ✅ APNs + FCM from Convex | ✅ end to end incl. APNs keys (18 Aug 2026) | ◐ in vertical pages ("push reminders") | ✅ OneSignal, managed or own | ✅ OneSignal |
| Location | ? | ✅ Apple Maps integration | ✅ expo-location | ? | ✅ | ? | ✅ (sim location picker 6 Nov 2026) | ✅ background + foreground |
| HealthKit | ? | ? | ❌ not in capability table | ? | ◐ full SDK; not featured | ✅ fitness-builder page | ◐ entitlement supported at signing | ? |
| Widgets | ◐ Rork Max only | ? | ? | ? | ✅ + Live Activities, Controls | ? | ✅ TestFlight ships widget extensions | ? |
| Haptics | ? | ✅ | ✅ | ? | ✅ Core Haptics | ? | ? | ? |
| Offline storage | ✅ local storage | ? | ◐ AsyncStorage; "offline mode" on roadmap | ? | ◐ CloudKit / SDK | ✅ local storage option | ? | ? |
| AI/LLM inside the app | ✅ Rork AI Cloud, paid from credits | ✅ APIs tab, paid from credits | ✅ integrations, paid from credits | ✅ built-in AI inference | ✅ Apple Foundation Models (on-device) | ? | ? | ❌ |

### 7. Publishing (the last mile)

| Feature | Rork | Vibecode | Anything | a0.dev | Bitrig | Superapp | Newly | Natively |
|---|---|---|---|---|---|---|---|---|
| Cloud build | ✅ own Macs | ✅ cloud Macs (Swift); Expo Launch (RN) | ✅ Expo Launch | ✅ | ◐ archives on *your* Mac | ✅ | ✅ | ✅ |
| Code signing handled | ✅ | ✅ (creates the ASC API key for you, Sep 2026) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Upload to App Store Connect | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Submission to App Review | ◐ you finish product page and submit in ASC | ✅ **Swift apps: Vibecode submits**; ◐ RN: you submit | ◐ you submit in ASC | ❌ stops at TestFlight | ✅ "submit for review from Bitrig" (claim) | ◐ marketing says "submits for review on your behalf"; docs say "Finish in App Store Connect"; Selfdrive can submit a build as a task | ❌ "Newly doesn't submit your app for review" | ◐ only via $600+ done-for-you service |
| Google Play upload | ✅ signed AAB to internal track; you promote | ❌ "not a built-in step" | ◐ beta, AAB to internal testing | ? homepage claims Play; no docs | ❌ | ❌ | ✅ internal, then **promote to production** from Deploy tab (23 Sep 2026) | ✅ (claim) |
| ASO metadata (title, keywords, description) | ◐ reported: "Max Publishing" drafts text + keywords (Mar 2026); docs say finish listing in ASC | ✅ agent writes description, keywords, category at publish | ❌ manual checklist in ASC | ◐ creates the ASC app record | ✅ listing lives in project; one-click push to ASC | ✅ AI drafts description/subtitle/keywords; Max adds **Selfdrive ASO** (keyword ranks, drafts updates) | ✅ Deploy tab listing editor saves to ASC; agent drafts copy | ◐ done-for-you service |
| Screenshot generation | ✅ **Screenshot Studio**: headlines, backgrounds, frames, 1284×2778, free beta; iPhone only | ◐ 3 raw simulator screenshots; agent draws iPad shot | ✅ wizard: captions, 5 variations, remix, iPhone + iPad | ❌ | ◐ captures across devices + localizations (raw) | ◐ claim: "generates screenshots"; docs describe an upload step | ✅ **designed screenshots, captioned in every listing language, App Store + Play** (17 Oct 2026) | ◐ service creates "store assets" |
| Privacy labels / policy | ◐ guide to write policy, terms, EULA | ✅ writes and hosts privacy policy + support page, links it in-app; you confirm App Privacy | ◐ points you to Termly | ? | ? | ◐ claim: fills privacy declarations; docs: you prepare policies | ◐ readiness check flags missing policy URL; App Privacy set in ASC | ? |
| Pre-flight vs guidelines | ✅ **AI App Store Reviewer**: guideline areas 1.x–5.x with evidence + fix; paid sub required | ✅ **Preflight** (`/appstore-preflight`): 5.1, 3.1.1, 2.1/4.2, 4.1/4.3; fixes what it can | ✅ "App Store Review" compliance check in Publish | ◐ static checklist doc | ? | ◐ checklist doc | ✅ readiness checklist; "store review safeguards built in" | ◐ "approval support", release guarantee |
| Rejection help | ◐ docs on common rejections; agent replies to *user reviews* | ? | ? | ? | ? | ◐ App Review doc + founder help | ✅ **reads Apple's rejection and starts the fix** (29 Sep 2026); writes Review Notes; uploads review screen recording | ✅ "100% app store release guarantee" |
| OTA updates | ? | ? | ? | ✅ OTA to all platforms | ❌ native Swift | ❌ native Swift | ? | ✅ website changes sync automatically |

### 8. Platform and workflow

| Feature | Rork | Vibecode | Anything | a0.dev | Bitrig | Superapp | Newly | Natively |
|---|---|---|---|---|---|---|---|---|
| Web app | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ |
| Desktop app | ◐ Companion (install to phone only) | ❌ | ◐ desktop companion announced Apr 2026 (reported) | ❌ | ✅ Mac (the product) | ✅ Superapp for Mac | ✅ Newly for Mac | ❌ |
| Mobile app (build from phone) | ✅ Rork Max iPhone app (rolling out to "selected accounts") | ✅ iPhone (since Jun 2025) + Android apps; "Built on iPhone" Swift (28 Sep 2026) | ◐ iOS app pulled twice in Mar–Apr 2026 under 2.5.2; current status unclear | ✅ iOS + Android | ✅ Bitrig Remote (needs your Mac) | ❌ | ◐ web app works on iPhone | ❌ |
| Team collaboration | ✅ view/edit sharing, comments, presence | ? | ✅ real-time team invites | ? | ◐ Teams plan on request | ✅ unlimited collaborators, shared credits | ✅ workspaces + roles | ◐ Enterprise |
| Templates gallery | ? | ◐ remixable examples (e.g. Pixgram) | ✅ marketplace (free + paid templates) | ? | ? | ? | ? | ❌ |
| Docs and tutorials | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Community | ✅ Discord | ✅ Discord | ✅ X community | ✅ Discord, Reddit | ◐ hackathons, X | ✅ | ✅ Discord | ✅ Discord |
| Support | ✅ email; Max priority chat | ✅ Intercom chat; Max 24/7, "1-minute response" | ✅ premium email (paid) | ✅ Max: unlimited support calls | ✅ Pro priority | ✅ email/priority + founder help | ✅ human chat; "Ask support" card (7 Nov 2026) | ✅ chat, email, Discord |

### 9. Pricing

| Feature | Rork | Vibecode | Anything | a0.dev | Bitrig | Superapp | Newly | Natively |
|---|---|---|---|---|---|---|---|---|
| Free tier | ◐ 35 design credits/mo (5/day), **no build or publish** | ◐ first app build only | ❌ "building requires a paid plan" | ? only Pro/Max on pricing page | ✅ 10 msgs/day with your own AI sub, or 60 credits/mo | ✅ free daily credits (most countries) | ❌ no free plan (free designs only) | ✅ free, but no builds or publishing |
| Entry → top price | Pro $20 (100 cr) → Max $200–$1,800 (1k–10k cr) | Plus $20 ($20 cr), Pro $50 ($55), Max $200 ($220) | Pro $24 mo / $19 yr (20k cr) → Max $239–$1,079 mo (220k–990k cr) | Pro $20 (100 cr) → Max $200 (1,250 cr) | Pro $15 + your AI subscription | Pro $25 (50 cr), Business $50 (110), Max $100 (230; "was $200") | $25 (100 cr) → $1,600 (6,400 cr) | Essential from $12, Unlimited from $32 (annual-rate prices), Lifetime $699 |
| Overage | $0.22/credit top-up | buy $20–$500 (max $500/day); auto-reload | $12 per 10k cr (top-ups never expire) | ? | credits if no AI sub (price ?) | $18 for 30 cr (12-month validity) | top-ups +16% over plan rate (12-month validity) | $9 per extra build (Essential) |
| What costs a credit | each message by work done; builds add to it; simulator 0.2/min; in-app AI Cloud | prompts (~$0.50–2 new app, $0.10–0.50 per change); **native iOS builds billed per build-minute, failed ones too**; in-app APIs | messages (by mode); in-app AI integrations; paid templates | ? ("messaging limits") | messages only if no AI sub | model cost × 3; Superapp Cloud usage | every agent step incl. auto-fix turns; **sims, builds, TestFlight uploads, hosting are free** | n/a (build count) |
| Annual discount | ? none stated | ✅ ~17% (2 months free) | ✅ 2 months free | ? | ? | ? (no annual shown) | ✅ 20% | ✅ 35% |
| Refund policy | ? | ◐ policy page exists (not read) | ◐ no subscription refunds; **one-click credit refund for failed generations** | ? | ? | ❌ non-refundable | ◐ no refund button; contact support | ? |
| Limits | Free 5 credits/day; credits don't roll over; reviewer 6 runs per chat turn; Max-only iPad, Watch, widgets | backends 1/3/5 by plan; credits **roll over, never expire** | ? | Pro "unlimited app builds" | Free 10 msgs/day | 240/480/960 preview minutes; 1x rollover on Pro | plan credits expire monthly | Essential: 4 rebuilds |

### 10. Company

| Feature | Rork | Vibecode | Anything | a0.dev | Bitrig | Superapp | Newly | Natively |
|---|---|---|---|---|---|---|---|---|
| Funding | ~$17.8M ($2.8M + $15M seed, Apr 2026), reported | $9.4M seed (Aug 2025), reported | $8.5M seed + $11M A at $100M (Sep 2025), reported | "Backed by Y Combinator" (homepage) | YC S25, amount conflicting, reported | $1.6M pre-seed (Mar 2026), reported | >$2M (Mar 2026), reported; Stockholm | ? |
| Launch | 2025; Rork Max Feb 2026 (Product Hunt) | iPhone app 17 Jun 2025 | Create.xyz → Anything rename (date ?) | "Phase 1" launch 3 Jul 2025 | 2025 (YC S25) | Product Hunt 11 Jan 2026 | founded 2025; current app changelog from 15 Sep 2026 | ? |
| Claims (claimed) | Wrestle AI "journey to a million dollars" | App Store 4.6★ from 3,324 ratings | 700K users, $2M ARR in 2 weeks (press) | 200k+ users, 300k+ apps | — | — | case studies ("500+ users in 3 weeks") | 9,500+ apps |
| Meta ads (10 Nov 2026) | 0 active; 547 ads in Library history; last batch 16 Sep–29 Oct 2026 (EN + ES "Turn Your Idea Into an App") | 1 active (started 10 Nov, "Build an App in Minutes", `utm_campaign=restart_v1`) | no matching advertiser page | none found | none found | **4 active since 26 Oct 2026** (~15 days; "I tested the AI app builders…") | 0 active; 158 in history; burst 19–27 Oct 2026 ("from $25/month, 20% off") | 0 active |

---

## 2. Product profiles

### Rork
- **Positioning:** chat-to-*native* builder (Swift + Kotlin + web from one project) for "App Store entrepreneurs".
- **Best at:** true native output on both platforms. It is the only one with Kotlin. It also runs a cloud iOS simulator in the browser and builds and uploads on its own Macs. It carries the widest set of last-mile side tools: AI App Store Reviewer, Screenshot Studio, review replies, and a Google Play AAB upload.
- **Recent launches (last 6 months):**
  - Expo dropped for new projects (date ?).
  - Rork Max iPhone app ("Rork App is back", rolling out).
  - Screenshot Studio (free beta).
  - AI App Store Reviewer.
  - App Store review replies.
  - Rork Android in Kotlin.

  Exact dates are not on the pages. Blog posts are dated 25 Feb to 25 May 2026; the publishing video is filed under 2026-09. A reported "Max Publishing" (metadata, keywords, localization, screenshots) was dated 27 Mar 2026 by Toolquestor. Rork also open-sourced an App Store Connect CLI (`rorkai/app-store-connect-cli`, with metadata-sync and localize skills), which suggests deeper metadata automation is coming.
- **Pricing:**
  - Free: 35 design credits/mo, Design mode only.
  - Pro: $20 for 100 credits. Includes Swift, Kotlin, web, Dev mode and GitHub.
  - Max: $200 / $500 / $900 / $1,800 for 1k / 2.5k / 5k / 10k credits. Adds iPad, Watch, Vision Pro, widgets and games.
  - India: Rork Start, ₹649 for 40 credits.
  - Top-ups: $0.22/credit, which never reset.
  - The reviewer needs a paid subscription. Credits alone don't unlock it.
- **Limits:** plan credits don't roll over. The simulator costs 0.2 credits/min. The reviewer runs at most 6 times per chat turn. Each Apple platform is submitted separately.
- **Publishing flow:**
  1. Publish → App Store, and enter App Info: icon, name (≤30 characters), version, bundle ID.
  2. Enter your Apple Developer email and password.
  3. Press Start Submission and enter Apple's 2FA code.
  4. Rork builds on its own Macs, signs and uploads to App Store Connect, and the build shows as "Available on TestFlight". You get a beta invite link.
  5. **You** finish the product page, pricing and screenshots in App Store Connect and press submit. Docs: "You finish the store listing (product page, pricing, screenshots) in App Store Connect." The marketing page says "Two clicks to App Store."
  6. Optional: run the AI Reviewer before submitting, and use Screenshot Studio for the screenshots.
  7. Google Play: Rork signs an AAB and sends it to the internal track. You create the app record and promote it in Play Console.
- **Evidence:** [plans](https://docs.rork.com/introduction/subscriptions) · [credits](https://docs.rork.com/billing/credits) · [iPhone](https://docs.rork.com/iphone/rork-iphone) · [publish](https://docs.rork.com/store-guides/publish-app-store) · [publishing FAQ](https://docs.rork.com/faq/publishing) · [reviewer](https://docs.rork.com/ai-app-store-reviewer) · [Screenshot Studio](https://docs.rork.com/store-guides/screenshot-studio) · [secrets](https://docs.rork.com/features/secrets) · [Rork Cloud](https://docs.rork.com/backend/rork-cloud) · [Expo removal](https://docs.rork.com/expo) · [RevenueCat](https://docs.rork.com/payment-guides/revenuecat-copied-1) · [analytics](https://docs.rork.com/features/analytics) · [code export](https://docs.rork.com/faq/code-export) · [rork.com/max](https://rork.com/max) · [Max Publishing (reported)](https://toolquestor.com/news/rork-launches-tool-that-writes-designs-and-submits-your-app-store-listing-using-ai)

### Vibecode
- **Positioning:** "real iPhone apps, built on iPhone". It is a consumer and founder builder with two engines: native Swift for iOS, and Expo for iOS plus Android.
- **Best at:** **the most complete App Store path in this set.** For Swift apps it builds, signs, uploads, writes the listing (description, keywords, category, 3 screenshots), writes and hosts the privacy policy and support pages, and **submits for review**. Vibecode's docs (29 Oct 2026) claim it is the only builder they checked that does the submit step. It also has the deepest paywall setup: one prompt creates the App Store Connect products, the IAP key and the RevenueCat config, then test-buys in the simulator.
- **Recent launches:**
  - Native Swift iOS apps GA (10 Sep 2026).
  - Install from web via QR, and an App Store panel (15–19 Sep).
  - "Built on iPhone" Swift builds from the phone (28 Sep).
  - Agent testing for all projects, iPhone Duo previews, and Apple sign-in that creates the ASC API key (29–30 Sep).
  - Usage tab (Aug).
  - Vibecode MCP and CLI.

  Apple approved its blocked update on 18 Mar 2026.
- **Pricing:**
  - Free: first app build only.
  - Plus: $20 for $20 credits.
  - Pro: $50 for $55 credits. Adds code download.
  - Max: $200 for $220 credits. Adds 24/7 support.
  - Annual = 10× monthly.
  - Credits **roll over and never expire.**
  - Top-ups $20–$500, plus auto-reload.
  - Each live backend costs $20/mo; Plus includes 1, Pro 3, Max 5.
  - Native iOS builds are billed per build-minute, including failed builds.
- **Limits:** Free has no database, App Store submission or code download. Google Play is not built in. RN apps go through Expo Launch, and you press submit yourself.
- **Publishing flow (Swift):**
  1. Publish → Publish to App Store.
  2. Connect Apple by Apple ID sign-in. Vibecode creates the App Store Connect API key, or you paste your own.
  3. Vibecode writes a publish request into chat, and you press Send.
  4. The agent writes and hosts the privacy and support pages and links them in the app (about 7 minutes).
  5. It takes screenshots and writes the description, keywords and category (about 6 minutes).
  6. You enter a phone number for the reviewer and sign in with your Apple ID on a new app's first release, so Apple can create the app record and confirm App Privacy.
  7. Vibecode makes the signed release build on a cloud Mac, uploads it, fills the rest of the listing and **submits for review**.
- **Publishing flow (RN/Expo):** optional Preflight → paste an Expo access token → confirm name and bundle ID → Expo Launch builds and uploads → **you** submit in App Store Connect.
- **Evidence:** [llms.txt](https://www.vibecodeapp.com/llms.txt) · [plans](https://www.vibecodeapp.com/docs/getting-started/plans-and-credits) · [App Store guide](https://www.vibecodeapp.com/docs/getting-started/deploy-app-store) · [RevenueCat](https://www.vibecodeapp.com/docs/monetization/revenuecat-setup) · [changelog](https://www.vibecodeapp.com/docs/updates) · [Cloud](https://www.vibecodeapp.com/docs/features/vibecode-cloud) · [download code](https://www.vibecodeapp.com/docs/getting-started/download-code) · [Pinch to Build](https://www.vibecodeapp.com/docs/getting-started/pinch-to-build)

### Anything (formerly Create.xyz)
- **Positioning:** "make money on the internet": an all-in-one Expo + web builder with built-in Postgres, a 100+ integration library and a template marketplace.
- **Best at:** breadth for non-coders. It has web and mobile in one place, built-in DB, auth and uploads, AdMob/AdSense, a Stripe and RevenueCat checkout, a decent screenshot generator, and a Max-mode browser agent that tests and fixes. It also has an API, a CLI and an OpenAPI spec for agents.
- **Recent launches:**
  - Google Play submission (beta, undated).
  - "App Store Review" compliance check.
  - Screenshot generator with AI captions.
  - Plan Mode and Background Agents (reported, undated).
  - Desktop companion announced mid-Apr 2026 after its iOS app was removed (26 Mar 2026, under 2.5.2).
- **Pricing:**
  - Pro 20k: $24/mo, or $19/mo billed annually ($228 upfront).
  - Max: 220k credits at $239/mo, up to 990k at $1,079/mo. Annual saves 2 months.
  - Top-ups: $12 for 10k credits, up to $240 for 200k.
  - No subscription refunds, but **one-click credit refunds for failed generations.**
  - Teams on request.
- **Limits:**
  - Building needs a paid plan.
  - Sign in with Apple is still "coming soon". This matters for guideline 4.8 when Google login is offered.
  - The push notifications row in the docs still reads "Coming Q1 2026".
  - GitHub sync is "coming soon".
  - Expo Go testing needs your own Expo account and token.
- **Publishing flow:**
  1. Publish → App Store Review (compliance check).
  2. Publish → Submit to App Store, then enter your Apple ID and 2FA.
  3. Anything builds through Expo Launch and uploads to App Store Connect in about 30 minutes or less.
  4. You install the build from TestFlight.
  5. **You** fill in screenshots (or generate them in Anything), contact details, keywords, category, age rating, privacy (Termly suggested) and pricing in App Store Connect.
  6. **You** submit for review.
  7. Google Play (beta): you create the app record and invite Anything's service account; Anything uploads an AAB to the internal track as a draft.
- **Evidence:** [subscriptions](https://www.anything.com/docs/account/subscriptions) · [credits](https://www.anything.com/docs/account/credits) · [App Store](https://www.anything.com/docs/launch/app-store) · [Play Store](https://www.anything.com/docs/apps/mobile/publishing-android) · [RevenueCat](https://www.anything.com/docs/payments/revenuecat) · [ads](https://www.anything.com/docs/ads) · [export](https://www.anything.com/docs/share/export) · [controls](https://www.anything.com/docs/builder/controls) · [testing](https://www.anything.com/docs/apps/mobile/testing) · [auth](https://www.anything.com/docs/apps/auth) · [device capabilities](https://www.anything.com/docs/apps/mobile/device-capabilities) · [MacRumors removal](https://www.macrumors.com/2026/03/30/apple-pulls-vibe-coding-app/)

### a0.dev
- **Positioning:** "Build mobile apps. Make money." A YC-backed Expo builder with its own phone app, pitched to hobbyists and game makers.
- **Best at:** a cheap path to TestFlight for both platforms. It builds IPA and APK, uploads to App Store Connect, syncs subscription products straight into App Store Connect from a YAML config (`.a0/monetization.yaml`), and pushes **OTA updates**. It has a Convex backend with built-in APNs and FCM push.
- **Recent launches:** none found in the last 6 months. The newest blog post is "Phase 1" from 3 Jul 2025. The docs mention Expo Go **v52** (old SDK).
- **Pricing (rendered today):**
  - Pro: $20/mo for 100 credits. Includes "unlimited app builds", code export, a custom domain and no branding.
  - Max: $200/mo for 1,250 credits (including 250 bonus). Adds top models and unlimited support calls.
  - Free tier, overage and annual pricing are not shown.
- **Limits:** payments don't work in the a0 app or Expo Go, so you need a native build. Android payments are not supported. iOS device installs need device registration.
- **Publishing flow:**
  1. Connect App Store Connect (automatic or manual setup).
  2. **You** create the bundle ID and app record in App Store Connect.
  3. Deployment → New Update → App Store → Create a Build → pick bundle and team → Generate & Submit.
  4. The build appears in App Store Connect and TestFlight within about 10 minutes.
  5. **You** fill metadata and submit. The homepage claims "create your App Store Connect listing", but the docs require you to create the record.
- **Evidence:** [a0.dev](https://a0.dev) · [pricing](https://a0.dev/pricing) · [deploy iOS](https://docs.a0.dev/publishing/ios/deploying-on-a0) · [payments](https://docs.a0.dev/development/monetization/payment-setup) · [device testing](https://docs.a0.dev/development/testing/mobile-app-testing) · [native builds](https://docs.a0.dev/development/testing/native-build-testing) · [OTA](https://docs.a0.dev/publishing/ota-updates/overview) · [push](https://docs.a0.dev/development/push-notifications) · [blog](https://a0.dev/blog)

### Bitrig
- **Positioning:** "From co-creators of SwiftUI": a pro-grade Mac IDE for AI-built Swift apps on every Apple platform, using **your own** Claude or ChatGPT subscription.
- **Best at:**
  - The deepest Apple-native coverage: widgets, Live Activities, Controls, App Intents, Siri, Watch complications, Foundation Models, Metal, iPhone Duo.
  - Real Xcode projects, GitHub PRs, and parallel agents each with its own simulator.
  - In-tool App Store work: create the app record, upload, manage the listing in the project with one-click push to App Store Connect, capture screenshots across devices and locales, and **submit for review**.
  - StoreKit or RevenueCat with the App Store Connect products created for you.
- **Recent launches:**
  - Push notifications (18 Aug 2026).
  - Parallel agents (3 Sep).
  - Figma import (23 Sep).
  - iPhone Duo camera apps (8 Oct).
  - Bitrig Remote for iPhone Duo (21 Oct).
  - 3D app demo recording (4 Nov).
  - CloudKit support.
  - "App Store Preview" of your product page.
- **Pricing:** Free gives 10 messages/day with your AI subscription, or up to 60 credits/mo, plus export. Pro is **$15/mo** for unlimited messages (as far as your AI subscription allows), TestFlight and App Store distribution, and device install. Teams and education pricing are separate.
- **Limits:** needs an Apple-silicon Mac (macOS 15+). No Android, no cloud build, no web builder, no OTA.
- **Publishing flow:**
  1. Connect your Apple Developer account.
  2. Bitrig creates the app record.
  3. It archives, signs and uploads from your Mac (or from your iPhone via Remote).
  4. It tracks Apple's processing.
  5. You edit the listing in the project and push it to App Store Connect, and capture screenshots.
  6. Submit for review from Bitrig (homepage claim; no public docs found).
- **Evidence:** [bitrig.com](https://bitrig.com) · [pricing](https://bitrig.com/pricing) · [blog](https://bitrig.com/blog)

### Superapp
- **Positioning:** "The only no-code AI app builder that gets you users": native Swift for every Apple platform, plus **Selfdrive**, an autonomous marketing agent.
- **Best at:** **after launch.** Selfdrive (Beta, Max plan) runs nightly with your approval:
  - **ASO**: keyword ranks in the top 50, Apple autocomplete popularity, listing drafts pushed to App Store Connect, and can submit a build for review.
  - **Apple Search Ads** within your budget.
  - App website plus SEO/GEO.
  - **UGC creator campaigns.**
  - A daily email report.

  It works for apps not built in Superapp too. It also has Figma import, a Mac app with a local Xcode project, and RevenueCat or StoreKit.
- **Recent launches:**
  - Selfdrive (Beta; date not found).
  - MCP server and ChatGPT app ("coming soon").
  - Max plan cut from $200 to $100.
  - Meta ads started 26 Oct 2026.
- **Pricing:**
  - Free: daily credits that expire at midnight UTC; not available in all countries.
  - Pro: $25 for 50 credits. Includes automated App Store publishing, Figma, and 240 preview minutes.
  - Business: $50 for 110 credits, 480 minutes.
  - Max: $100 for 230 credits (struck-through $200). Adds Marketing AI, Apple Ads, ASO, SEO, UGC and 960 minutes.
  - Top-up: $18 for 30 credits, valid 12 months.
  - Credit math: building credits = model/tool cost × 3.
  - Fees are non-refundable.
- **Limits:** Apple only (no Android). Preview minutes are capped by plan.
- **Publishing flow (docs):**
  1. Open Publish.
  2. Connect Apple and pick the team.
  3. Guided steps: app info, screenshots, privacy answers, build status.
  4. "Finish in App Store Connect": confirm the product page, territories and pricing, then send to Apple.

  The marketing page claims more: it "generates screenshots and ASO-optimized metadata, fills out the privacy declarations, and submits for review on your behalf… about two clicks." Treat full automation as **claimed**. The docs hedge.
- **Evidence:** [pricing](https://superapp.dev/pricing.md) · [publish](https://superapp.dev/docs/publish-app-store) · [listing](https://superapp.dev/docs/app-store-listing) · [App Store publishing (marketing)](https://superapp.dev/app-store-publishing) · [credits](https://superapp.dev/docs/credits) · [plans](https://superapp.dev/docs/plans-and-subscriptions) · [RevenueCat](https://superapp.dev/docs/revenuecat-paywalls) · [Selfdrive ASO](https://superapp.dev/docs/selfdrive-aso) · [Selfdrive](https://superapp.dev/selfdrive.md) · [device testing](https://superapp.dev/docs/test-on-your-device) · [refunds](https://superapp.dev/docs/invoices-and-refunds)

### Newly (formerly Natively, natively.dev)
- **Positioning:** "Idea to App Store in minutes": an Expo builder that ships fast (daily changelog) and is building a full **post-build operating system**.
- **Best at:** **App Store readiness plus Google Play to production plus growth.**
  - The Deploy tab has a readiness checklist that writes description, keywords, promo text, URLs and category **straight to App Store Connect**.
  - It writes App Review notes and stores the review contact and demo account.
  - It uploads a review screen recording, or its own simulator walkthrough.
  - It **reads Apple's rejection and starts the fix.**
  - It designs store screenshots captioned in every listing language, for both stores.
  - Its Subscriptions tab creates App Store Connect products with per-country prices.
  - It replies to App Store and Play reviews.
  - It shows store-page conversion analytics.
  - Since Oct 2026 it also has **Apple Search Ads** management, AI marketing videos, voice-cloned narration and **UGC creator hiring**.
  - Previews, native builds, TestFlight uploads and backend hosting cost no credits.
- **Recent launches (all Sep–Nov 2026, per changelog):**
  - Google Play publish (23 Sep).
  - GitHub two-way sync and Skills (24 Sep).
  - Subscriptions tab (28 Sep).
  - Rejection fix (29 Sep).
  - Marketing videos (2 Oct).
  - Figma sources and App Review notes (7 Oct).
  - Store analytics and reviews (14 Oct).
  - Designed localized screenshots (17 Oct).
  - UGC creators (20 Oct).
  - Apple Search Ads (24 Oct).
  - Free designs (4 Nov).
  - Database tab (9 Nov).
- **Pricing:**
  - No free plan.
  - $25 for 100 credits, $50 for 200, and so on up to $1,600 for 6,400. Always 4 credits per $1.
  - Annual is 20% off.
  - Top-ups cost 16% more than plan credits and last 12 months.
  - Plan credits expire monthly.
  - From 8 Nov 2026, new workspaces can't buy credits without a plan.
  - Apple, Play and domain fees are extra.
- **Limits:** **Newly does not press "Submit for Review"; you do.** Age rating and App Privacy are still set in App Store Connect. Firebase is not supported.
- **Publishing flow:**
  1. Connect Apple (Apple ID or App Store Connect key).
  2. Ship to TestFlight (cloud build, sign, upload).
  3. Deploy tab readiness checklist: listing, screenshots, review notes, contact and demo account, screen recording.
  4. **You** set age rating and privacy, then submit in App Store Connect.
  5. If rejected, Newly reads Apple's message and fixes the code.
  6. Google Play: connect your Play account; one press builds, signs and uploads to internal testing; promote to production from the Deploy tab.
- **Evidence:** [plans](https://docs.newly.app/billing/plans-and-top-ups) · [credits](https://docs.newly.app/billing/how-credits-work) · [TestFlight → App Store + Play](https://docs.newly.app/publish/app-store-and-google-play) · [integrations](https://docs.newly.app/backend/integrations) · [changelog](https://docs.newly.app/changelog) · [pricing](https://newly.app/pricing) · [about (formerly Natively)](https://newly.app/about)

### Natively (BuildNatively)
- **Positioning:** "Convert your website (or Lovable/Base44/Replit app) to a mobile app": a WebView wrapper with native plugins. It is **not an AI builder.**
- **Best at:**
  - Cheap, guaranteed store presence for an existing site.
  - Site changes sync with no rebuild.
  - Plugins: OneSignal push, RevenueCat IAP, social login (incl. Apple), location, AppsFlyer/Facebook analytics, Branch links.
  - A "100% app store release guarantee", plus done-for-you services: $600 publishing, $900+ assisted integration, $2,000+ custom development.
- **Recent launches:** none dated. It now markets "Lovable/Base44/Replit app → mobile".
- **Pricing:**
  - Free: no builds, no publishing.
  - Essential from $12/mo, includes 4 rebuilds, then $9/build.
  - Unlimited from $32/mo.
  - These are the annual-rate prices; 35% off annual, and the monthly rate was not captured.
  - Lifetime $699.
- **Limits:** WebView apps sit exactly where guidelines 4.2 and 4.2.2 bite ("repackaged website"). The guarantee and human review help are how it compensates.
- **Publishing flow:**
  1. Enter URL, name, icon and colours, and choose plugins.
  2. Test on a device.
  3. Build IPA, APK or AAB.
  4. Natively uploads to iOS automatically ("we support direct publishing to Apple App store").
  5. Store listing and submission are yours, or bought as the $600 service.
- **Evidence:** [buildnatively.com](https://www.buildnatively.com) · [pricing](https://www.buildnatively.com/pricing) · natively.dev → newly.app (HTTP 301, checked today)

---

## 3. Who's ahead on the last mile

Ranked by how far each gets an app from "built" to "approved and selling" without the user opening App Store Connect.

1. **Vibecode (Swift path).** It is the only one whose docs show it **pressing Submit for Review**. It also writes the listing (description, keywords, category, screenshots), hosts the privacy policy, and does the deepest IAP setup (App Store Connect products, IAP key, RevenueCat, paywall, test purchase). Weak spots: no Google Play, raw screenshots, analytics "coming soon", and the RN path stops at Expo Launch.
2. **Newly.** Everything up to the submit button, and the most **after** it: listing editor writing to App Store Connect, localized designed screenshots, review notes and recording, **rejection auto-fix**, Google Play to production, review replies, store analytics, Apple Search Ads and UGC hiring. It has shipped almost all of this since 23 Sep 2026.
3. **Superapp.** It claims full automation (metadata, screenshots, privacy, submit), and **Selfdrive ASO plus Apple Ads plus UGC** is the most ambitious growth layer. Its own docs still say "finish in App Store Connect". iOS only.
4. **Bitrig.** Listing-in-project with push to App Store Connect, screenshot capture across locales, ASC product creation, and submit from the app. It is Mac-only and needs your own AI subscription, so it targets pros.
5. **Rork.** Strong tools: the paid AI Reviewer covering guideline areas 1–5, free Screenshot Studio, review replies, and a Google Play AAB upload. The core flow still stops at TestFlight, and you finish the listing and press submit yourself. Metadata automation is only reported (Mar 2026) or hinted at by its open-source ASC CLI.
6. **Anything.** Upload, a compliance check, a good screenshot generator and Google Play beta. The listing, privacy and submit are manual, and **no Sign in with Apple yet**.
7. **a0.dev.** Upload to TestFlight, App Store Connect product sync and OTA. Everything else is manual, and there are no visible launches since mid-2025.
8. **Natively (BuildNatively).** Uploads automatically, but there is no AI or ASO. It compensates with humans: a release guarantee and $600 done-for-you publishing.

**By sub-area**
- **Paywalls / IAP:** Vibecode ≈ Newly ≈ Bitrig all create App Store Connect products from the tool. Vibecode adds the IAP key, RevenueCat config and an in-simulator test purchase. Nobody ships a real **paywall template gallery**; every paywall is agent-generated.
- **ASO / metadata:** Superapp (Selfdrive keyword ranking, if it delivers) > Newly (listing editor plus Apple Search Ads) > Vibecode (writes it once at publish) ≈ Bitrig.
- **Screenshots:** Newly (designed, localized, both stores) > Rork Screenshot Studio (designed, iPhone only, free) ≈ Anything (captions, 5 variations) > Vibecode and Bitrig (raw captures).
- **Pre-flight:** Rork AI Reviewer (paid) ≈ Vibecode Preflight (RN) > Anything compliance check ≈ Newly readiness check. **None checks guideline 4.3 against your own other apps** (this confirms differentiators.md).

---

## Method and spend
- Sources: vendor `llms.txt` doc indexes and `.md` pages fetched with curl. JS pricing and homepages were rendered with headless Chromium. Also used were the vendors' changelogs and blogs, plus WebSearch for funding and dates (marked reported).
- Meta Ad Library via `treg` ScrapeCreators: company search (11 calls) and company ads (14 calls, several charged $0). That comes to roughly **$0.04**, well under the $0.30 cap.
  - Team balance was $7.05 before and $6.90 after. The rest of the drop came from other jobs running at the same time on the shared team balance.
  - Vibecode showed 1 active ad today, while the earlier notes counted 10 started on 6 Nov. Those were probably paused or are under another page.
- I did not sign up, start trials or contact anyone.
