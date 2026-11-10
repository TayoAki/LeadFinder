# Full feature lists, group 2: mobile app builders (checked 2026-11-10)

This file extends [features-catalog.md](features-catalog.md), [features-part-a.md](features-part-a.md) and [features-part-b.md](features-part-b.md). It covers:
- the 8 existing products in scope: Replit, Bolt, Lovable, FlutterFlow, Draftbit, Adalo, Thunkable and BuildNatively;
- the new competitors you named;
- AI mobile builders launched in 2025–2026 that I found along the way.

## How this was built

I didn't sample pages. For each product I pulled the vendor's full documentation index and went through every title. For the pages relevant to mobile, pricing or platform scope, I read the page itself, as `.md` where the vendor offers it.

| Product | Index read | Pages listed |
|---|---|---|
| Replit | `docs.replit.com/llms.txt`, `_llms/en/features.txt`, `_llms/other.txt` | ~370 English pages, incl. 44 changelogs for 2026 |
| Bolt | `support.bolt.new/llms.txt` | 108 pages, plus release notes |
| Lovable | `docs.lovable.dev/llms.txt` + `llms-full.txt` (4.5 MB, includes the dated changelog) | ~330 pages |
| FlutterFlow | **two** indexes: `docs.flutterflow.io/llms.txt` (Studio) and `docs.flutterflow.io/ffx/llms.txt` (the new prompt builder) | ~420 + 125 pages |
| Draftbit | `docs.draftbit.com/llms-full.txt` | 68 pages |
| Adalo | `help.adalo.com/llms.txt` | 985 entries, English and Japanese |
| Thunkable | `docs.thunkable.com/llms.txt` | ~330 pages |
| BuildNatively | `docs.buildnatively.com/llms.txt` + `buildnatively.com/sitemap.xml` | 95 pages |
| New competitors | `docs.base44.com/llms.txt`, `manual.bubble.io/llms.txt`, `glideapps.com/llms.txt`, `docs.expo.dev/llms.txt`, `launch.dev/llms-full.txt`, `help.emergent.sh` sitemap, `docs.getmocha.com/llms.txt`, `docs.same.new/llms.txt`, `docs.orchids.app/llms.txt`, `docs.momen.app/sitemap.xml`, `rapidnative.com/llms.txt`, `catdoes.com/llms.txt`, `onspace.ai/llms.txt` | |

Pricing pages were fetched live today. Where a pricing page renders with JavaScript and the fetch got nothing, I say so.

**Labels used below:**
- **Claimed** means the claim is on a marketing page only.
- **Reported** means it comes from a third party.
- **[NEW]** means the old catalog doesn't have it, or had it as "?" or wrong.

---

# Part 1. The 8 existing products

## 1. Replit (Agent + "Mobile app" artifact, Expo, Launch)

**Positioning.** A general AI workspace (chats, routines, projects). "Mobile app" is one artifact type, built in React Native + Expo. ([Native Mobile Apps](https://docs.replit.com/features/artifact-types/building-mobile-apps.md))

### Input and agent
- Prompt with the **Mobile app** type picked on the home screen.
- Upload files, images, screenshots and SVGs (SVG since 8 May 2026). ([upload](https://docs.replit.com/chat/upload-and-use-files.md))
- **[NEW] Voice Mode**, 19 Jun 2026: speak your request instead of typing. The mobile app added voice prompting on 24 Jul. ([voice](https://docs.replit.com/chat/voice-mode.md), [changelog 07-24](https://docs.replit.com/updates/2026/07/24/changelog.md))
- Figma, website and Claude-design import into Replit Design (Design live 31 Jul 2026). Design templates and inspiration. Design systems and `DESIGN.md`. ([Figma](https://docs.replit.com/design/import-figma-designs-into-replit-design.md), [website](https://docs.replit.com/design/import-a-website-into-replit-design.md), [Claude designs](https://docs.replit.com/design/import-claude-designs-into-replit-design.md))
- **[NEW] Agent modes**: Free Mode (intelligent routing, daily or plan cap), Power and Max.
  - Model picker under "Primary model". Effort runs from Low to Max.
  - Lite, Economy and Power tiers (31 Jul).
  - Intelligent routing (28 Aug). ([modes](https://docs.replit.com/chat/agent-modes.md), [model selector](https://docs.replit.com/chat/model-selector.md))
- Plan mode needs Core. Other agent tools:
  - task board with Draft, Active, Ready and Done;
  - parallel tasks per teammate, each in its own isolated copy;
  - steer or queue messages while the agent works. ([invite team](https://docs.replit.com/build/mobile-invite-team.md), [plan vs build](https://docs.replit.com/learn/plan-vs-build-mode.md))
- Agent customization:
  - Skills and a skills directory, with import from GitHub (21 Aug);
  - Memories and custom instructions;
  - workspace instructions (12 Jun). ([skills](https://docs.replit.com/chat/agent-skills.md))
- MCP: connect MCP servers, use Replit through MCP (14 Aug), and use it from Claude, ChatGPT, Slack and Muse. ([MCP](https://docs.replit.com/build/connect-via-mcp.md))
- **[NEW] Routines**: scheduled agent runs (21 Aug). **Monitoring Agent** (23 Oct). **Get support from Agent** (6 Nov 2026). ([routines](https://docs.replit.com/chat/routines.md), [changelog 11-06](https://docs.replit.com/updates/2026/11/06/changelog.md))

### Mobile-specific build guides (the "PixelGames" track)
Each item is its own doc page.
- **[NEW] App icon generation**: 3 concepts at 1024², Design mode. ([icon](https://docs.replit.com/build/mobile-app-icon.md))
- **[NEW] App Store screenshot generation**: 5 marketing shots at 1284×2778, with headlines and color themes, plus a 1024×500 Google Play feature graphic. ([screenshots](https://docs.replit.com/build/mobile-store-screenshots.md))
- Design mode for screens: 5 variations, suggestions, "send" to build. ([design](https://docs.replit.com/build/mobile-design.md))
- **[NEW] Native iOS components**: alerts, action sheets, native switches, SF Symbols and the share sheet. ([native components](https://docs.replit.com/build/mobile-native-components.md))
- Haptics: the iOS impact and notification styles; the closest equivalent on Android. ([haptics](https://docs.replit.com/build/mobile-haptics.md))
- Camera and photo library, with iOS/Android permission handling. ([camera](https://docs.replit.com/build/mobile-camera.md))
- **[NEW] Contacts**: the system contact picker, used to match friends. ([contacts](https://docs.replit.com/build/mobile-contacts.md))
- **[NEW] Native in-app review prompt**: StoreKit / Play In-App Review. ([reviews](https://docs.replit.com/build/mobile-collect-reviews.md))
- Push notifications: a token per signed-in user. iOS needs TestFlight. ([push](https://docs.replit.com/build/mobile-push-notifications.md))
- Login: Clerk with email and Google. **[NEW] Sign in with Apple shown on iOS only**. Providers are switched on under Users & Auth → SSO providers. ([login](https://docs.replit.com/build/mobile-login.md))
- Image storage in App Storage, linked to the user. ([store images](https://docs.replit.com/build/mobile-store-images.md))
- RevenueCat subscriptions:
  - the agent creates the RevenueCat project, product and entitlement over OAuth;
  - test-mode purchases work in Expo Go. ([payments](https://docs.replit.com/build/mobile-payments.md), [RevenueCat Subscriptions](https://docs.replit.com/features/monetization/revenuecat-subscriptions.md))
- Other monetization: Stripe (app install, May 2026), **[NEW] Whop payments** (3 Jul 2026) and **[NEW] Stripe Atlas** (23 Oct). ([monetization](https://docs.replit.com/features/monetization/overview.md))

### Preview and testing
- **Streamed iOS Simulator *and* Android Emulator** in the preview, with hot reload and a full-screen tab.
  - Core, Pro or Enterprise only.
  - Not on Firefox.
  - Agent-run "App Testing" exists. ([Native Mobile Apps](https://docs.replit.com/features/artifact-types/building-mobile-apps.md), [App Testing](https://docs.replit.com/features/agent/app-testing.md))
- Expo Go by QR is needed for haptics, camera, push and GPS. ([preview on phone](https://docs.replit.com/build/mobile-preview-testing.md))
- TestFlight external tester groups are documented; builds expire after 90 days. ([TestFlight](https://docs.replit.com/build/mobile-testflight.md))

### Publishing
- **Launch wizard** in the Publishing tab. You publish the web backend first. Then the wizard:
  1. picks the Expo project;
  2. signs in with Apple;
  3. picks the app or bundle ID;
  4. creates or reuses the distribution certificate and profile automatically;
  5. builds on Expo's servers;
  6. uploads to App Store Connect, which takes up to 45 min.

  You get a push notification from the Replit app when it's done, then a TestFlight invite. ([upload](https://docs.replit.com/build/mobile-upload-ios.md))
- Submit-for-review guide with a checklist:
  - account deletion and UGC rules;
  - privacy policy and support URL;
  - the agent can draft the privacy and terms pages;
  - **[NEW] Agent security scan before you ship**. ([submit](https://docs.replit.com/build/mobile-publish-ios.md), [security scans](https://docs.replit.com/features/security/agent-security-scans.md))
- **Google Play: the docs say "Publishing to Google Play is not yet supported by Replit."** Android is build and preview only. This contradicts press claims, so the docs win. ([Native Mobile Apps § Considerations](https://docs.replit.com/features/artifact-types/building-mobile-apps.md))
- Native changes (icons, permissions) need a new store build. **Over-the-air updates aren't documented.**
- Mobile troubleshooting page: Metro cache, `expo-doctor`. ([troubleshooting](https://docs.replit.com/features/troubleshooting/mobile-app.md))

### Platform
- Builder apps:
  - Desktop app, redesigned 3 Jul, with a Windows preview on 9 Oct;
  - iOS and Android apps with a refreshed home screen, voice and Live Activities (24 Jul). **Native mobile building works in the Android app; on iOS you must use the web**;
  - ChatGPT and Claude apps;
  - Slack.
- Collaboration: workspace roles (Member, Guest, Viewer) and viewer seats. Pro covers up to 15 builders.
- Enterprise: SAML SSO, SCIM, audit logs, the Compliance API, the Admin API (beta) and groups. **BYOC / image export** is early access (16 Oct). ([teams](https://docs.replit.com/teams/identity-and-access-management/saml.md), [BYOC](https://docs.replit.com/teams/bring-your-own-cloud.md))
- Security:
  - Workspace Security Center 2.0;
  - Package Firewall (12 Jun);
  - black-box pen tests (21 Aug);
  - workspace region (14 Aug).
- Production tools:
  - Project Analytics (4 Sep);
  - scheduled DB backups (4 Sep);
  - database rollback up to 28 days on Pro.
- Domains: custom domains, plus **[NEW] buy a domain in Replit** (10 Jul). Domain fees aren't refundable.
- Growth:
  - **[NEW] SEO Agent** (5 Jun);
  - Growth Skills (28 Aug);
  - TikTok Ads creation (9 Oct);
  - "Made with Replit" badge with your referral link (Starter);
  - Solutions Partner directory (16 Oct).

### Pricing (live, replit.com/pricing)

| Plan | Price | What you get |
|---|---|---|
| Starter | Free | Daily Agent credits; Free Mode capped |
| Core | $20/mo, or $18/mo yearly | $20 credits; 5 collaboration seats |
| Pro | $100/mo, or $90/mo yearly | Higher tiers at $215, $425, $825 and $2,000/mo; up to 15 builders; credits roll over for 2 months |
| Enterprise | Custom | |

- Credit packs are available.
- **Refunds:** "Agent and AI usage charges are non-refundable." Subscription refunds are handled case by case by support. ([billing & refunds](https://docs.replit.com/help/billing-and-refunds.md))

## 2. Bolt (bolt.new)

**Positioning.** An AI web and mobile builder. **Mobile = an Expo project that you build and publish yourself with the EAS CLI on your own computer.** ([Expo for mobile apps](https://support.bolt.new/integrations/expo.md))

### Mobile
- The first prompt must say "mobile app"; a web project doesn't switch over cleanly.
- Device Preview gives a QR code for Expo Go. **[NEW] There's a preview theme toggle**, and Device Preview stays in mobile projects. ([release notes](https://support.bolt.new/release-notes.md))
- Publishing:
  1. download the code;
  2. `eas build --platform ios --auto-submit` sends it to TestFlight;
  3. finish in App Store Connect;
  4. build for Android and upload to Play internal, then production, yourself;
  5. or `eas deploy` for the web.
- **Every mobile update means: download again, then rebuild and resubmit.** OTA isn't documented. ([Expo](https://support.bolt.new/integrations/expo.md))
- No documented camera, push, IAP or native-capability pages. RevenueCat isn't documented.

### Agent and build
- **[NEW] Agents:** Standard (the only one on Free) and Max.
- **[NEW] Bolt Forge**, a third agent on open-source models:
  - models: GLM 5.3, GLM 5.3 Flash, Kimi K3, DeepSeek v4 Pro;
  - "up to 50× more usage" than Standard;
  - Pro and Lite plans;
  - research preview 14 Sep–14 Oct 2026. ([agents](https://support.bolt.new/building/agents.md), [Forge](https://support.bolt.new/account/bolt-forge.md))
- Plan mode, saved prompts and skills. Voice dictation. Visual edits in the preview.
- Prompt queue. Image upload, edit and generation.
- **Comments on a project that you can send to Bolt.** ([release notes](https://support.bolt.new/release-notes.md))
- Design systems: add, sync, attach or detach; Teams can upload their own. Google Stitch and Figma import. Import from Lovable.
- **[NEW] Security audit**:
  - covers the code and database: auth, keys, RLS;
  - auto-fixes what it can;
  - **doesn't use tokens**;
  - paid plans only. ([security](https://support.bolt.new/building/security.md))

### Backend and data (Bolt Cloud)
- Database tables, auth settings and user management.
- File storage, secrets, server functions and **email sending**.
- DB logs, DB restart and leaked-password protection.
- Tables are private by default (latest release).

### Hosting
- Publish to `bolt.host`. Custom domains; buy domains in Bolt.
- Hosting analytics: visits, page views and referrers.
- Free tier: 10 GB bandwidth and 333K requests/month, then the site goes offline.

### Collaboration
- Real-time multiplayer.
- Viewer, editor and co-owner roles; role-based publishing.
- Teams: seats, org GitHub app, team templates and data export.

### Platform
- **[NEW] Bolt on a phone** (latest release): preview card, publish and unpublish, restore versions, install to home screen. No code view, visual edits or DB on mobile. ([supported tech](https://support.bolt.new/reference/supported-technologies.md))
- Safari is supported.
- **[NEW] Model-training opt-out** for content from 7 Oct 2026.
- **[NEW] Local-currency billing, and Link (Stripe) billing from 1 Nov 2026.**

### Pricing (live, bolt.new/pricing)

| Plan | Price | Tokens | Notes |
|---|---|---|---|
| Free | $0 | 1M/mo, 300K/day | Bolt badge; Supabase not included (needs Pro) |
| Pro | from $25/mo | from 10M | Rollover for 2 months; custom domain; no badge |
| Teams | $30/member | | |
| Enterprise | Custom | | SSO, audit logs |

- Yearly billing is "up to 28%" off.
- **[NEW] Referral:** your friend gets 20% off; you earn 15% of what they pay, capped at $50 per referral, paid through Cello. ([referral](https://support.bolt.new/account/referral-program.md))
- No refund policy is documented.

## 3. Lovable

**Positioning.** An AI full-stack *web* builder. Its `llms.txt` now says "web and mobile apps", but **every mobile-app page in the docs is either a PWA or Lovable's own phone app. No native, Expo or App Store path is documented.**

### Mobile-relevant
- **[NEW] "Smarter PWA support"** (3 Jun 2026): installable, offline, and push notifications. The agent picks the setup the request needs. (`docs.lovable.dev` changelog, Jun 3 2026)
- **[NEW] Firebase Cloud Messaging connector** for push (Aug 2026). WhatsApp Business and SMS (GatewayAPI) connectors. ([llms.txt](https://docs.lovable.dev/llms.txt))
- Lovable mobile app for iOS and Android, to build from your phone. ([mobile app](https://docs.lovable.dev/integrations/lovable-mobile-app.md))

### Build
- Modes: Chat, Plan (with version compare and restore), Build, Goal (set a goal), and **subagents**.
- "Works up to 10 hours on a single message".
- Drafts (explore changes); Instructions (formerly Knowledge); Memory; Skills.
- Cross-project referencing.
- Design: edit from the preview, design templates and design systems (a default per group), **custom fonts**, 21st.dev components and Figma plugin import.
- Import a project from Replit, Bolt, v0 or Base44. **[NEW] Import a website from a URL.**
- Testing: **[NEW] Lovable writes and runs tests for the rules you change**, and signs in to test pages behind login. ([features](https://docs.lovable.dev/llms.txt))

### Backend (Lovable Cloud)
- Database with daily backups, export and restore, and Drizzle migrations.
- Auth: email, **phone**, Google, Apple, Microsoft, SAML, OIDC and Sign in with Lovable.
- Storage, secrets, jobs, edge functions and logs.
- **AI features in your app:** chat, image, video, music, TTS, transcription and voice assistants, using GPT, Gemini, Claude, Seedream, Seedance and Lyria models.

### Growth and publishing
- Hosting and custom domains; buy and transfer domains; workspace-wide domains.
- SEO/AEO tools, analytics and **Advertise your app** ("Growth tools", Oct 2026).
- Branded emails, payments, and **publish your app as an MCP server**.

### Security and compliance
- **SOC 2 Type II, ISO 27001:2022, AIUC-1. Not HIPAA.** (trust center docs)
- Deep scan, SBOM download, sensitive-data scanning and workspace policies (publish approval).
- EU inference.
- SSO, SCIM, audit-log export to S3, GCS, Azure and Splunk. 2FA.

### Platform
- Desktop app (macOS).
- Telegram, Slack, ChatGPT app; Lovable MCP server; public API.
- **[NEW] Partner/agency directory and affiliate program; referral earns credits.**

### Pricing (live page; numbers didn't render)
- Free: 5 build credits/day, max 30/month, plus 20 Cloud credits.
- Pro, Business and Enterprise: monthly credits, with unlimited members.
- Student discount.
- **Refunds: "Credits aren't refundable."** Plan credits expire after 2 months; top-ups last 12 months.

## 4. FlutterFlow: now TWO products

**Biggest structural change.** FlutterFlow split in two:
1. **FlutterFlow**, a *new* prompt-only builder ("ffx"; press launch 4 Nov 2026). It has its own docs.
2. **FlutterFlow Studio**, the classic visual builder.

They share one plan.

### 4a. FlutterFlow (prompt builder)

Docs: [ffx index](https://docs.flutterflow.io/ffx/llms.txt).

**What it builds.** Flutter/Dart apps for iPhone and Android, plus the web via share link.
- **iPhone only, no iPad.** No desktop builds.
- First version is up to **8 screens**. ([platforms](https://docs.flutterflow.io/ffx/platforms), [limits](https://docs.flutterflow.io/ffx/limits))

**Agent**
- **Threads**: each works on its own copy of the app, and a "push" merges it. Unlimited parallel threads; 1 push per app at a time; conflict prompts.
- Agent questions as "Choice" cards. Steer or stop.
- "Rate this thread". Turn summary per screen and table (8 Oct). ([threads](https://docs.flutterflow.io/ffx/threads), [what's new](https://docs.flutterflow.io/ffx/whats-new))
- Attachments: up to 6 files and 4 MB. Images, documents and TTF/OTF fonts are accepted; code files aren't.

**Design**
- Colors, fonts and style by prompt; **light and dark themes**.
- **[NEW] Design directions**: compare contrasting designs.
- Logo, photos and fonts from attachments.
- **[NEW] App icon drawer**: AI-drawn symbol (14 Oct 2026); styles, motifs and letters; your own 1024² PNG; 5 draws a day.
- **[NEW] App name and launch-screen colors.**
- **[NEW] Screens tab**: light and dark pictures of every screen, marked New, Changed or Removed (6 Oct). ([icon](https://docs.flutterflow.io/ffx/app-icon), [look](https://docs.flutterflow.io/ffx/change-the-look), [screens](https://docs.flutterflow.io/ffx/screens))

**Backend (FlutterFlow Cloud, 2 Oct 2026)**
- Tables and records, with **thread data and starter data** (12 Oct).
- People, claims (roles), files and secrets.
- Activity log; usage (reads, writes, live updates).
- Custom password-reset email.
- Limits: 100 tables, 100 fields, 25 devices per user.

**Connections**
- Stripe (checkout and subscriptions), AdMob, OpenAI, Anthropic and Gemini (your own key), Resend, Airtable, Notion, Discord and Telegram.
- Agent tools in chat: ClickUp, Granola, Jotform, Linear, Miro, monday.com, Notion, Stripe. ([services](https://docs.flutterflow.io/ffx/services))

**Releases**
- **The full store pipeline in the product:**
  - connect App Store Connect (team key) and Google Play (service account);
  - App details and listing language;
  - "Finish console setup" guidance (age rating, App Privacy, Data safety);
  - send to TestFlight and Google closed test;
  - **submit for review to both stores**, with a Google Play rollout percentage;
  - Apple change-requests flow (fix with the agent);
  - release status per store;
  - download .apk, .aab and .ipa;
  - rebuild an earlier version. ([launch checklist](https://docs.flutterflow.io/ffx/launch-checklist), [submit](https://docs.flutterflow.io/ffx/submit-for-review))
- **[NEW] "Road to launch" checklist.**

**Team**
- Roles: Owner, Developer, Billing, Viewer.
- **[NEW] "Client work" setup**: the client keeps the app and store accounts while you build on your own allowance. ([client work](https://docs.flutterflow.io/ffx/client-work))

**NOT available** ([not-available](https://docs.flutterflow.io/ffx/not-available))
- **No in-app purchases or subscriptions through App Store or Google Play.** Stripe only.
- **No source-code export and no GitHub.**
- No visual canvas, no code editor, no desktop builds.
- No CSV import or export.
- Studio projects can't be opened.

**Pricing** ([plans](https://docs.flutterflow.io/ffx/plans-and-allowance))

| Plan | Price | Allowance | Includes Studio plan |
|---|---|---|---|
| Free | $0 | Resets weekly; one free build | Free |
| Basic | $39/mo | Monthly | Basic |
| Pro | $80/mo | 2.5× Basic; refills | Growth |
| Max | $150/mo | 5× Basic; refills | Business |

Prices vary by country.

### 4b. FlutterFlow Studio (visual builder)

Index: [llms.txt](https://docs.flutterflow.io/llms.txt).

**Resolved from the index:**
- **Localization** with Google Translate. ([localization](https://docs.flutterflow.io/concepts/localization))
- **Accessibility** page.
- **Deep and dynamic links.**
- Push: OneSignal and FCM. Firebase Crashlytics, Performance Monitoring, Remote Config, App Check and Google Analytics.
- **SQLite (local/offline DB).** AdMob, RevenueCat, Stripe, Braintree, Razorpay.
- Haptic feedback, Google Maps and Place Picker, Lottie, Rive and Shaders.
- Desktop and web builds.
- **Automated tests** and **Test Pilot (AI QA)**.
- Branching. Development environments. Codemagic deploys to the App Store and Google Play. Deploy from GitHub. Pre-checks before publishing.
- AI Agent via the Studio desktop app, Claude Code plugin, Codex plugin, FlutterFlow CLI and MCP.
- **FlutterFlow Designer**, a separate design tool that exports to Studio.
- **Marketplace** (with creator program).
- "Hire FlutterFlow Developer."

**Still missing from the Studio index:** HealthKit and home-screen widgets.

**Refunds:** "there are no refunds for cancellation." ([refunds](https://docs.flutterflow.io/accounts-billing/subscriptions/refunds))

**Referral program discontinued** with the retirement of the old Pro plan. ([referral](https://docs.flutterflow.io/accounts-billing/referral-program))

## 5. Draftbit

**Positioning.** An AI agent builder (Claude Code or Codex) that makes Expo/React Native mobile apps, React web apps, Astro websites, Hono APIs and a Supabase backend, all in one "project". Docs: [llms-full.txt](https://docs.draftbit.com/llms-full.txt).

### Agent
- **[NEW] Claude Code or Codex.**
  - Defaults: Claude Opus 5.5 and GPT-6.1 Sol.
  - Also runs DeepSeek, Gemini, GLM, Grok, Kimi, MiMo, MiniMax, Muse Spark and Qwen through OpenRouter.
- Reasoning effort per model.
- `CLAUDE.md` and `AGENTS.md` instructions; saved prompts.
- **[NEW] BYO subscription or key on every plan**: Claude or ChatGPT subscription, or an OpenAI, Anthropic or OpenRouter key. These don't use Draftbit credits. Free: 20 runs/week.
- Agents running at once: 1 (Free, Standard), 5 (Pro), unlimited (Enterprise).
- **[NEW] Security Review** thread.
- Tasks and Sandboxes.

### Design
- **[NEW] Mockups**:
  - the agent designs several options, shown side by side and interactive;
  - phone, tablet or Android sizes, with rotate;
  - "Use this mockup";
  - limits apply.
- **[NEW] Briefs**: the agent writes a Plan, Research, Strategy, Spec or Report of up to 30 pages, downloadable as HTML. (`/features/briefs`)
- Themes with light and **dark theme**. Accessibility props in the editor. Visual editor.
- App config:
  - **URL scheme for deep linking**;
  - **Locales (localization JSON)**;
  - app icon and splash. (Themes & Design and App Configuration pages)

### Preview
- In-browser preview with a light/dark toggle.
- **Draftbit Preview app** by QR.
- **Simulators** (Pro+):
  - real iOS and Android simulators built from your native packages;
  - Saved and Unsaved builds;
  - each counts as 2 builds. (`/features/simulators`)

### Publishing
- One-click iOS (Standard+) and Android, cloud or local.
- Signing credentials; comparing builds.
- **Monthly native builds:** 15 per seat on Standard, 30 per seat on Pro. Each extra build costs 500 credits. Failed builds are free.
- **[NEW] Over-the-air updates** (Pro+, Expo):
  - Production or Staging channels;
  - blocks updates that need a new binary;
  - not counted as builds;
  - "your apps depend on Draftbit for updates". (`/features/publishing/over-the-air-updates`)
- App Store submission assistance on Pro.

### Integrations
- REST, GraphQL and OpenAPI import.
- **MCP catalog**: Supabase, Xano, Directus, Canva, Linear, **RevenueCat (OAuth)**, custom MCP.
- Supabase Backend (open beta).
- Push setup guides for iOS and Android (Expo, FCM v1). Custom SMTP for auth emails.
- Import from GitHub or ZIP (Next.js and Express with reduced features). Migrate from Draftbit Classic.
- Version history, backups, logs and environment variables.

### Pricing

| Plan | Price | Extra seats | Projects | Apps per project |
|---|---|---|---|---|
| Free | $0 | Not available | 3 | 3 |
| Standard | $15/mo, or $12/mo yearly | $10 | Unlimited | 5 |
| Pro | $30/mo, or $24/mo yearly | $20 | Unlimited | 10 |
| Enterprise | Custom | Unlimited seats included | Unlimited | Unlimited |

- **Base plans include no credits.** Credit packages run from $5 for 5K credits to $1,000 for 1.15M. Free gets a one-time 3,000 credits. Credits expire after 1 year.
- Support: chat (Free), email (Standard), priority + training (Pro), dedicated manager + SLA (Enterprise).
- Known limits: no desktop-native apps; Safari isn't officially supported.

## 6. Adalo

**Positioning.** A no-code visual builder for native iOS, Android and web, with **Ada AI (beta)** inside the builder.

### Ada AI (beta)
Ada edits by prompt ([Ada](https://help.adalo.com/master/ada-ai-beta.md)):
- screens: create, rename, duplicate, delete, summarize;
- **role-based screen protection**;
- components, lists, forms and text styling.

Ada is "in beta and may not yet be available in your Builder." On Free, 5 prompts/month.

### Mobile and native
- Publish to the Apple App Store, Google Play and the web (custom domain or Adalo subdomain). TestFlight guides.
- **[NEW] Deep linking**: setup, with data, redirection and fallbacks, and a share action.
- **[NEW] Scheduled push notifications**, plus push via API.
- Location: precision options, Maps, and navigation to Google Maps, Apple Maps or Waze.
- In-app purchases: the IAPHUB component and **Digital Purchases** (single-use IAP).
- Fonts, design versions and **Feature Templates** (whole features with DB and screens).
- **[NEW] Adalo X-Ray** (Jul 2025), a free performance audit: nested lists, screen complexity, orphaned screens, DB tables and cache hits, Lottie. ([X-Ray](https://help.adalo.com/performance/adalo-x-ray.md))
- **[NEW] SheetBridge** (Google Sheets CRUD), Xano and the Collections API (Business).

### Pricing (live)

| Plan | Price | Published apps | Editors | Instant updates |
|---|---|---|---|---|
| Free | $0 | | | 500 records/app |
| Builder | $65/mo (first month $30), or $624/yr | 2 | 5 | 1 per month |
| Business | $200/mo, or $1,920/yr | 5 | 10 | Unlimited |

- **[NEW] Analytics, crash monitoring and localization:** paid add-ons on Builder, included on Business.
- Code: Builder sees a sample of Ada's code; Business sees all of it.
- Add-ons: $25 per extra published app, $15 per extra editor.
- 14-day trial (no store publishing).
- **No refunds on cancellation.** Downgrade credit is non-refundable. ([pricing FAQ](https://help.adalo.com/resources/adalo-pricing-faqs.md))
- **Affiliate:** 20% for 12 months via Rewardful. Adalo Experts and freelancer program. ([affiliate](https://help.adalo.com/resources/adalo-affiliate-program.md))

## 7. Thunkable (Thunkable AI)

**Positioning.** "Vibe coding mobile app development". The AI generator plus a drag-and-drop editor make native iOS, Android and web apps. Dated release notes: [ai/release-notes](https://docs.thunkable.com/ai/release-notes.md).

### 2026 releases (newest first)
- **20 Oct**:
  - **iOS 26 Liquid Glass native bottom tabs**;
  - iOS-style switches and sliders;
  - **background audio / lock-screen playback**;
  - per-app "Who can sign in" by role;
  - Retry and Auto-fix pause after 3 failures.
- 6 Oct: Charts integration.
- 29 Sep: Android and iOS device frames in the preview.
- 21 Sep: Lottie.
- **14 Sep: splash screen customization.**
- 31 Aug: in-app dark mode in the Live app; **Thinking effort**.
- **24 Aug**:
  - "Capture current preview" screenshots;
  - QR to the Live app;
  - **dark-themed app icons and dark splash**.
- 17 Aug: PDF viewer and PDF assets.
- 11 Aug: Android signing keystore; Keep Awake.
- **4 Aug**:
  - **Store listing** (see below);
  - **AI model selection**;
  - Cloud DB in the creation flow;
  - fix for Apple purpose-string rejections.
- 27 Jul: **image input**; Light/Dark/System mode; versions on mobile; more color-theme options.
- 20 Jul: **voice input**; device types in preview; share-project link.
- 29 Jun: Project settings, status-bar color, @mention screens in chat.
- 22 Jun: Native Functionality panel with suggested integrations.
- **8 Jun: AdMob, OneSignal push, in-app purchases** for AI projects.
- 1 Jun: **NFC**.
- 27 May: **Supabase Cloud DB and auth**.
- 26 May: video, **biometrics**, **custom fonts**.
- 11 May: WebView; **Google Play API automated publishing**.
- 6 May: **Bluetooth**, sound and speech, drawer navigator.
- 27 Apr: maps; Android download for mobile users; remixable example projects.
- 13 Apr: share-file features; API keys.
- **30 Mar: iOS publishing via the App Store Connect API.**
- 25 Mar: device sensors, share, drag-and-drop on AI projects.
- 17 Mar: click-to-edit without AI; follow-up questions before generation.

### [NEW] Store Listing workflow (4 Aug 2026)
Separate App Store and Google Play tabs, with a checklist of requirements still open. ([store listing](https://docs.thunkable.com/ai/publishing/store-listing.md))

**Thunkable checks or fills automatically:**
- bundle ID or package name, version;
- App Store Connect API credentials or Play service account;
- **iOS permission descriptions**;
- app secrets, AdMob requirements;
- icon, privacy policy URL, screenshots;
- title, description, **keywords**, category, support URL, App Review contact and reviewer login;
- the Play feature graphic and short description.

**AI generation:**
- icon or feature graphic: 400 tokens per run;
- all store text: 800 tokens, or 100 per field.

**Other:**
- **A hosted privacy policy** you can edit.
- Data-safety guidance.
- Lists what stays manual: App Privacy questionnaire, age rating, pricing, content rights; on Play, Data Safety, IARC and category.
- "Publish my app" works from chat.

### Other features
- Plan mode, Discuss mode, private projects and templates.
- Cloud DB: local, Supabase, or a linked external DB.
- Block-based logic, Firebase, Airtable, Google Sheets and Webflow data sources.
- Sensors: accelerometer, gyroscope, magnetometer. Barcode scanner. Speech recognizer, TTS, image recognizer.
- Gaming and sprites. JavaScript web bridge.
- Organizations, custom domains for web publishing, and a Thunkable Academy for education.

### Pricing (live)

| Plan | Price | AI tokens | Notes |
|---|---|---|---|
| Free | $0 | 2,000 one-time | |
| Accelerator | $19/mo, or $18 yearly | 20K/mo | |
| Builder | $59/mo, or $37 yearly | 50K/mo | 1 live published app; custom branding |
| Advanced | $189/mo, or $99 yearly | 100K/mo | Unlimited live apps |
| Enterprise / Education | Custom | | |

- Test downloads expire after 72 h.
- No refund policy is shown.

## 8. BuildNatively (Natively)

**Positioning.** A **WebView wrapper** that turns any site into an app: Bubble, Lovable, Base44, Replit, Webflow, WordPress, Shopify. It adds native features through a JS SDK or Bubble plugin. Docs: [llms.txt](https://docs.buildnatively.com/llms.txt).

### Native features documented
**[NEW] relative to the catalog unless noted:**
- AdMob.
- Analytics: AppsFlyer, Facebook, custom events (Nov 2025).
- Bottom bar, calendars, camera, contacts.
- **Deep links / Universal Links / Branch.io.**
- Geolocation; **HealthKit**.
- iOS back button. In-app purchases with **five Google Play proration modes** (Jan 2026). Microphone. **NFC**.
- Push: OneSignal (custom sound; permission at launch) and Firebase.
- Photo library. **Service worker caching / offline** (Dec 2025).
- Social auth: Google and Sign in with Apple.
- SDK guides:
  - **Apple ATT** (Mar 2026);
  - app storage, **audio player with background playback** (Apr 2026), audio recorder;
  - **biometrics and credentials**, clipboard, date picker, debug console, device info;
  - haptic feedback, safe-area insets, loading screen;
  - **localization with AI auto-translated permission strings** (17 Apr 2026);
  - open external URL, app or settings; PDF viewer;
  - **request user's review**;
  - QR/barcode scanner, share, SMS/email, toast/banner.

### Appearance
App icon, loading screen, iOS launch screen, custom error screen and style (Android status bar).

### Publishing
- Builds for iOS and Android; direct upload to TestFlight and Play.
- Certificates are managed and renewed automatically.
- Web changes go live without a rebuild; native setting changes need a rebuild.
- **Paid release assistance**: a human reviews metadata, descriptions and screenshots against store policy. Hourly integration experts.
- **Migrate an existing store app** to Natively. ([FAQ](https://docs.buildnatively.com/getting-started/faq.md))

### Pricing (live)

| Plan | Price | Builds |
|---|---|---|
| Free (Preview) | $0 | **Max 2 preview apps; deleted after 30 days of inactivity from 1 Dec 2026** |
| Essential | $19/mo, or $12/mo yearly | 4 rebuilds, then $9/build (the page also says "unlimited", which conflicts) |
| Unlimited | $49/mo, or $32/mo yearly | Unlimited |
| Lifetime | $699 | Unlimited |

- Trial length conflicts: 3 or 14 days.
- **Affiliate:** 30% monthly for up to 12 months, or 10% once on yearly or lifetime. Paid in Natively credits from $200, or cash from $500. ([affiliate](https://docs.buildnatively.com/guides/partner-program.md))

---

# Part 2. "?" cells in features-part-b.md resolved

| Row | Product | Was | Now (source) |
|---|---|---|---|
| Voice input | Replit | ? | ✅ Voice Mode (19 Jun 2026) and voice in the mobile app ([voice](https://docs.replit.com/chat/voice-mode.md)) |
| Voice input | Bolt | ? | ✅ voice dictation ([release notes](https://support.bolt.new/release-notes.md)) |
| Voice input | Thunkable | ? | ✅ 20 Jul 2026 ([release notes](https://docs.thunkable.com/ai/release-notes.md)) |
| Image to app | Thunkable | ? | ✅ image input, 27 Jul 2026 |
| Image to app | Draftbit | ? | ◐ attachments go to the agent; Mockups |
| Plan step | Bolt | ? | ✅ Plan Mode ([llms](https://support.bolt.new/llms.txt)) |
| Plan step | Thunkable | ◐ | ✅ Plan mode toggle plus follow-up questions ([what is Thunkable AI](https://docs.thunkable.com/ai/getting-started/what-is-thunkable-ai.md)) |
| Output stack | Thunkable | ? | Still not named in the docs. "Native mobile apps" with Liquid Glass native tabs suggests native components |
| Design system | Thunkable | ? | ✅ color schema/themes, Light/Dark/System, custom fonts |
| Design system | Lovable | ? | ✅ design systems, templates, custom fonts |
| Design system | Draftbit | ? | ✅ Themes & Design, with a dark theme |
| Visual editor | Replit | ? | ✅ Visual Editor with layout controls (22 May 2026) |
| Visual editor | Lovable | ? | ✅ edit from the preview, inline text edits |
| Code export | Thunkable | ? | ❌ none documented |
| GitHub | Adalo / Thunkable | ? | ❌ none documented |
| Version history | Lovable | ? | ✅ version history and drafts |
| Version history | Draftbit | ? | ✅ Version History and Backups |
| Version history | Adalo | ? | ✅ Design Versions (paid) |
| Error auto-fix | Thunkable | ? | ✅ Retry/Auto-fix, pauses after 3 tries (20 Oct 2026) |
| Error auto-fix | Replit | ? | ✅ App Testing agent and Monitoring Agent (23 Oct) |
| Error auto-fix | Bolt | ? | ◐ security audit auto-fixes; no build self-heal documented |
| iOS simulator | FlutterFlow | ? | ◐ new builder: iPhone-frame web preview; Studio: Run/Local Run |
| iOS simulator | Replit | ✅ | Also streams an **Android Emulator** |
| Auth | Replit | ? | ✅ Clerk: email, Google, Apple (iOS only) |
| Auth | Adalo | ? | ✅ built-in users; Ada screen protection by role |
| File storage | FlutterFlow | ? | ✅ new builder Backend › Files; Studio Firebase Storage |
| File storage | Draftbit | ? | ✅ Supabase storage |
| Server functions | Thunkable | ? | ◐ Supabase only |
| Secrets | Lovable | ? | ✅ secrets, build secrets, secrets overview |
| Secrets | FlutterFlow | ◐ | ✅ Backend › Secrets (new builder) |
| Paywall templates | Draftbit | ? | ◐ RevenueCat via MCP; no templates |
| Paywall templates | Thunkable | ? | ◐ IAP blocks with RevenueCat; no templates |
| Stripe | Bolt | ? | ✅ Stripe integration ([llms](https://support.bolt.new/llms.txt)) |
| Stripe | Thunkable | ? | Not documented for AI projects |
| AdMob | Thunkable | ✅ | Confirmed 8 Jun 2026 |
| AdMob | Replit / Bolt / Draftbit / Adalo | ? | Not documented |
| Analytics | Replit | ? | ✅ Project Analytics (4 Sep), web-level |
| Analytics | Lovable | ? | ✅ Analytics and Insights |
| Analytics | Adalo | ◐ | ✅ add-on or Business, plus crash monitoring |
| Camera | FlutterFlow | ? | ✅ Studio media and upload actions |
| Camera | Adalo | ? | ✅ image picker / camera |
| Push | Bolt | ? | Not documented |
| Push | Lovable | ❌ | ◐ PWA push (Jun 2026), FCM connector |
| Push | Draftbit | ? | ✅ iOS and Android push guides |
| Location | FlutterFlow | ? | ✅ Studio maps and places |
| HealthKit | BuildNatively | (part A) | ✅ |
| HealthKit | Replit, Bolt, FF, Draftbit, Adalo, Thunkable | ? | Not documented anywhere |
| Widgets | all 8 | ? | Not documented anywhere (Replit's "Feedback Widget" is a web feedback form) |
| Haptics | FlutterFlow | ? | ✅ Haptic Feedback action |
| Haptics | BuildNatively | | ✅ |
| Haptics | Thunkable | ? | Not documented |
| Offline | Lovable | ? | ◐ PWA offline (Jun 2026) |
| Offline | FlutterFlow Studio | ? | ✅ SQLite |
| Offline | Thunkable | ? | ✅ local DB / local table |
| Offline | BuildNatively | | ✅ service worker (Dec 2025) |
| In-app LLM | Bolt | ? | Not documented |
| In-app LLM | FlutterFlow | ? | ✅ AI services (OpenAI, Anthropic, Gemini, own key); Studio AI Agents |
| In-app LLM | Thunkable | ? | ✅ OpenAI blocks and AI text/image |
| ASO / metadata | Thunkable | ◐ | ✅ **AI store text incl. keywords**, checklist, hosted privacy policy |
| ASO / metadata | FlutterFlow | ❌ | ◐ new builder: App details listing and language; no AI copy |
| Screenshots | Thunkable | ◐ | ◐ capture preview and how-to; no AI generation |
| Screenshots | FlutterFlow | ? | ◐ Screens tab images, light and dark; not store-sized |
| Privacy help | Replit | ? | ◐ the agent drafts privacy and terms pages; checklist |
| Privacy help | Thunkable | ◐ | ✅ hosted policy plus auto iOS purpose strings |
| Pre-flight check | Thunkable | ? | ✅ Store Listing requirements checklist |
| Rejection help | FlutterFlow | ◐ | ✅ "Apple change requests" flow (fix with the agent) |
| OTA | Replit | ? | Not documented |
| OTA | Bolt | ? | Not documented; every update is a rebuild |
| OTA | FlutterFlow | ? | ❌ new builder: no store-free updates; Studio: not in the index |
| OTA | Thunkable | ? | Not documented |
| OTA | Draftbit | ✅ | Confirmed: Pro+, with Production/Staging channels |
| Desktop app | Replit | ? | ✅ Desktop app (macOS; Windows preview Oct 2026) |
| Desktop app | Lovable | ? | ✅ macOS |
| Desktop app | Bolt | ? | ❌ none documented (installs as a PWA on phones) |
| Build from phone | Bolt | ◐ | Expanded (latest release); still no code, visual edits or DB |
| Build from phone | FlutterFlow | ? | ◐ phone browser ([use on a phone](https://docs.flutterflow.io/ffx/phone-browser)) |
| Build from phone | Thunkable | ◐ | Versions and Android download on mobile |
| Team | Thunkable | ? | ✅ Organizations and project collaboration |
| Templates | Bolt | ? | ✅ marketplace templates and team templates |
| Templates | Lovable | ? | ✅ templates gallery |
| Templates | Adalo | ? | ✅ Feature Templates |
| Community | Bolt | ? | ✅ (help center links) |
| Community | Draftbit | ? | Not found |
| Overage | Thunkable | ? | Not shown |
| Refunds | Replit | ? | AI usage non-refundable; subscriptions case by case |
| Refunds | Lovable | ? | Credits non-refundable |
| Refunds | FlutterFlow | ? | No refunds |
| Refunds | Adalo | ? | No refunds |
| Refunds | Bolt / Thunkable / Draftbit | ? | Still unknown |

---

# Part 3. Newly found vs the old catalog: the features that matter most

1. **Store-listing / ASO automation now exists at the "big" builders, not just the startups.**
   - Thunkable: AI keywords and descriptions, a hosted privacy policy, a requirements checklist and auto iOS purpose strings (Aug 2026).
   - Base44: a store-guideline scan with a **Readiness Score** plus "Apply with AI" fixes, and AI logo generation.
   - FlutterFlow (new builder): an end-to-end release center with **submit for review to both stores**, an Apple change-request flow and rollout control.
2. **AI store assets.** Replit generates icon concepts, five framed store screenshots and a Play feature graphic. Thunkable and Base44 generate icons and feature graphics by AI.
3. **Liquid Glass / iOS 26 native components** (Thunkable, 20 Oct 2026). Replit has native iOS components and SF Symbols. CatDoes advertises "Liquid Glass" (claimed).
4. **OTA updates** are confirmed only at Draftbit (Pro), Bubble (all mobile plans), Adalo ("instant updates") and Expo itself. Replit, Bolt, FlutterFlow and Emergent say every change is a new build.
5. **Parallel agents / threads.**
   - Replit: per-teammate tasks in isolated copies.
   - FlutterFlow: unlimited threads, one push at a time.
   - Draftbit: 5 concurrent on Pro.
   - Bolt: comments sent to the agent.
6. **BYO model subscription.**
   - Draftbit: Claude or ChatGPT subscription, or an OpenAI, Anthropic or OpenRouter key, on Free too.
   - Orchids: ChatGPT, Claude Code, Gemini or Copilot subscriptions.
   - Bolt Forge: cheap open models.
7. **Design-option pickers.** Draftbit Mockups and FlutterFlow Design directions. Replit Design mode shows 5 variations.
8. **Dark-mode assets.** Thunkable has dark icons and dark splash. FlutterFlow has light/dark screen pictures.
9. **Localization.** BuildNatively auto-translates permission strings. Base44 ships iOS purpose strings in 25 languages. FlutterFlow Studio has localization; Draftbit has locales. Adalo charges localization as an add-on.
10. **Gaps confirmed at the leaders:**
    - Replit: **no Google Play publishing**.
    - FlutterFlow (new): **no IAP and no code export**.
    - Bolt: **mobile publishing is fully manual through the EAS CLI**.
    - Lovable: **PWA only**.
    - Nobody among the 8 documents **HealthKit** (except BuildNatively) or **home-screen widgets**.
11. **Partner and referral programs:**
    - Bolt: 15% up to $50 per referral.
    - Adalo: 20% for 12 months.
    - BuildNatively: 30% for up to 12 months.
    - Lovable: referral credits plus a partner directory.
    - Replit: Solutions Partners and badge referrals.
    - FlutterFlow: discontinued.
12. **Agency / client handoff.** FlutterFlow "Client work" lets the client own the store accounts. Bubble has an Agency plan. Adalo positions Team/Business plans for agencies.

---

# Part 4. New competitors

## Summary table

| Product | Ships to the stores? | How | Live price | Ads (Meta, active today) |
|---|---|---|---|---|
| **Base44** (Wix) | ✅ iOS + Android files | **WebView wrapper** of the published web app in the documented store flow. The agent skill docs also describe "native mobile app (Expo, React Native, NativeWind)" projects, so both exist | Free; $16 / $40 / $80 / $160 per mo (yearly) | **30+ ads** (paginated), running since 26 Feb 2026 |
| **Bubble** | ✅ | Native mobile editor (React Native under the hood, *reported*), with native IAP and OTA | Mobile only $42 / $169 / $449; Web+Mobile $59 / $209 / $549 (yearly) | 4 ads |
| **Glide** | ❌ | Business PWA (add to home screen); "Glide for iPhone" is the *builder* app | $25 / $50 / $125 per mo | none found |
| **Emergent** | ✅ | Expo/EAS managed by Emergent; .ipa auto to TestFlight; .aab you upload | Free 10 credits; $20 (100 cr); $200 (750 cr) | **30+ ads** since 4 Aug 2026 |
| **Mocha** | ❌ | Web only; **shut down 1 Aug 2026** (own FAQ) | n/a | n/a |
| **Same (same.new)** | ❌ | Web only | Free 500K tokens; plans to 20M tokens; no refunds | n/a |
| **Orchids** | Claimed ("any stack… mobile") | No mobile docs; marketing site returned "DEPLOYMENT_PAUSED" today | $25 / $50 / $99 / $200 per mo | none found |
| **Momen** | ✅ iOS only (since v3.1, Oct 2026) | Builds, signs and uploads to App Store Connect and submits; method not stated | Wallet / AI points; 200K free points a day | not identifiable |
| **Expo** (Launch / EAS / MCP) | ✅ | The infrastructure the others use; Launch is a browser wizard | Free; $19 / $199 per mo + usage | n/a |
| **RapidNative** (2025–26) | ✅ | Expo/RN; publishing via the sister service LetsDeployIt | Free 20 credits; from $20/mo; deploy priced separately | Page exists, 0 active ads |
| **CatDoes** | ✅ | Expo/RN; agent ships to App Store / Play / TestFlight | Free 25 credits; from $20/mo; 16% off yearly | none found |
| **OnSpace.AI** | ✅ (claimed) | React Native + Expo; one-click store deploy | Not captured | none found |
| **Appy Pie "Agentic AI App Builder"** | ✅ (press) | 4 agents; React Native code; launched 3 Nov 2026 | Not captured | none found under that name |

Ad counts come from ScrapeCreators through `treg`; active ads only, first page of 30. Searches for Glide, Orchids, Momen, CatDoes, OnSpace and Appy Pie returned no matching advertiser page.

## Base44 (acquired by Wix, Jun 2025)

**Store flow** ([Submitting to app stores](https://docs.base44.com/documentation/building-your-app/uploading-to-app-stores.md)): Publish → Mobile app tab.
1. **Run App Scan against App Store or Google Play guidelines.** You get a **Readiness Score** (pass / partial / fail) plus "Apply with AI" or "Copy Fix Prompt".
2. **Build store files**:
   - an .ipa built with your App Store Connect API key (.p8);
   - an .aab signed with Base44's own upload key (not downloadable);
   - AI logo generation;
   - a toggle for **push notifications** (APNs .p8 or Firebase).
3. You upload and submit yourself.

**Store-flow constraints and extras:**
- **The bundle ID is fixed** at `com.base[app-id].app`.
- Digital goods can't be sold in the app: the docs give a digital-vs-physical rules table. **No IAP / RevenueCat path is documented.**
- Google SHA fingerprints for Google login.
- **Permissions are re-scanned on each new file build** (4 Nov 2026).
- **iOS purpose strings auto-generated and localized to 25 languages.**
- Web content updates reach the wrapper app without resubmission.

**Platform features:**
- Builder apps for iOS, Android and Mac.
- Superagents (autonomous agents with a native mobile UI).
- Model picker (incl. GPT-6.1 Terra). Private branches. Security scan of code.
- Presentations (PPTX, Google Slides, PDF). Email designer.
- Base44 Payments (Wix) with payouts, plus PayPal (10 Nov 2026). Analytics.
- GitHub two-way sync (Builder plan and up). Source ZIP export via the API.
- CLI and SDK for coding agents. React Native (Expo) backend quickstart.
- Enterprise: SSO, security center, backups (28 days).

**Pricing (yearly):**

| Plan | Price | Message / integration credits |
|---|---|---|
| Free | $0 | 25 / 100, 5 apps |
| Starter | $16/mo | 100 / 2K |
| Builder | $40/mo | 250 / 10K, GitHub |
| Pro | $80/mo | 500 / 20K |
| Elite | $160/mo | 1,200 / 50K |

Yearly saves 20%. No refund policy on the page.

## Bubble (native mobile)

([manual](https://manual.bubble.io/help-guides/getting-started/building-for.../native-ios-and-android.md))
- **Separate mobile editor** with native elements: View, app bar, tab bar, section lists, swipe actions, sheets, floating groups.
- Mobile and web share a backend and database.
- Previewing:
  - preview mode with device choice and "Preview as user";
  - simulated device and dev builds;
  - **BubbleGo deprecated**.
- Native mobile debugger.
- Native IAP for Apple and Android, with subscriptions, production checklists and IAP events/actions. Camera and photo library, location services.
- Publishing: you upload the .p8 and IDs. Bubble **builds, uploads to TestFlight and submits for review in about 45 min**; the Google Play guide is separate.
- Multiple live mobile versions. **OTA updates for content and logic**; native shell changes (icon, splash, plugins) need a rebuild. ([pricing manual](https://manual.bubble.io/account-and-marketplace/account-and-billing/pricing-plans.md))
- **Bubble AI Agent**: generates apps from a blueprint, edits, reads data (permission-scoped). AI credits per plan.
- **Agency plan** for client work.

**Pricing:**

| Plan | Web only | Mobile only | Web + Mobile |
|---|---|---|---|
| Starter | $32 | $42 | $59 |
| Growth | $119 | $169 | $209 |
| Team | $349 | $449 | $549 |

Yearly prices shown; monthly is $39 / $49 / $69 and up. 14-day Starter trial.

## Glide (GlideOS)

- **Positioning:** governed AI apps for business teams.
- **Distribution:** published apps open by QR or link and install via "Add to Home Screen". **No App Store / Play publishing on any page.** ([publishing](https://www.glideapps.com/docs/os/publishing-and-sharing))
- Glide for iPhone is a *builder* app (App Store "early November 2026").
- Features: 1,000+ integrations, workflows, MCP server and bring-your-own-agent (Claude Code, Cursor, ChatGPT, Copilot), SSO, Trust Center.
- **Not a store competitor.**

## Emergent (Bengaluru; $1.5B valuation, 2026, claimed)

([help center sitemap](https://help.emergent.sh/api/seo/sitemap.xml))

**Store publishing** ([publishing to the stores](https://help.emergent.sh/publishing-to-the-stores)):
- Emergent-managed Expo/EAS, so no Expo account is needed. Paid plan required.
- iOS signing is fully managed, including an **auto-created App Store Connect API key**; the build is pushed to TestFlight.
- Android: Emergent generates and holds the keystore; you upload the .aab.
- **A "build for a pre-existing Play Store app" path** (upload-key reset).
- **No OTA.**

**Monetization:**
- **IAP via RevenueCat**, with sandbox testing docs and optional RevenueCat Paywalls for A/B tests.
- **Stripe is hidden in Expo projects.** Razorpay and PayPal remain for physical goods. ([IAP](https://help.emergent.sh/monetisation-in-app-purchases-subscriptions))

**Agents:**
- E-1 (default), E-2 (integration), E-3 (autonomous orchestrator).
- **Maxx** deep-reasoning mode on Pro.
- Wingman agent. Custom agents. Universal LLM key.
- Channels: web, Telegram, WhatsApp, iMessage, Slack.
- Pre-publish health check.

**Pricing:**

| Plan | Price | Credits | Notes |
|---|---|---|---|
| Free | $0 | 10/mo | |
| Standard | $20/mo, or $17 yearly | 100/mo | GitHub, fork |
| Pro | $200/mo, or $167 yearly | 750/mo | 1M context, custom agents, priority support |
| Business / Enterprise | Custom | | SSO, RBAC, audit, VPC |

Refund page exists (`cancellation-refunds`) but wasn't readable.

## Mocha, Same, Orchids
- **Mocha:** web apps only. Its own FAQ says "**Mocha is shutting down on August 1, 2026**". **Drop it from the competitor set.** ([FAQ](https://docs.getmocha.com/getting-started/faq.md))
- **Same:** web apps only (GitHub, Neon, Supabase, Clerk).
  - Free 500K tokens; Basic 2M, Pro 5M, Max 10M, Ultra 20M tokens.
  - **No refunds; compensation is given as token credits.** ([pricing](https://docs.same.new/usage/pricing.md), [refunds](https://docs.same.new/usage/refunds.md))
- **Orchids:**
  - "any app, any stack: web, mobile…" is **claimed** only;
  - BYO subscriptions or keys, VS Code IDE and terminal, Claude Code inside, RevenueCat listed as a payment option;
  - $25 / $50 / $99 / $200 per month ($21 / $42 / $83 / $168 yearly);
  - the changelog is thin (last entry Sonnet 4.6);
  - **orchids.app returned 503 "DEPLOYMENT_PAUSED" today.** ([docs](https://docs.orchids.app/llms.txt))

## Momen

- v3.1 (Oct 2026) added an **iOS mobile client**. The editor takes Bundle ID, Team ID, Issuer ID and the .p8, then signs, packages and uploads to App Store Connect. Certificates are managed automatically.
- "Preview" builds a TestFlight build in about 30 min. **Publish submits for review.**
- **Android isn't supported** ("iOS only for now").
- AI Copilot is GA (v3.0, Sep 2026), with skills and agent memory files (v3.1).
- Models: Claude Opus/Sonnet 5.5, GPT-6.x, Gemini.
- Payments: Stripe and Airwallex. MCP and coding-agent plugin.
- ([mobile app](https://docs.momen.app/docs/production/app_deployment/mobile_app/), [2026 changelog](https://docs.momen.app/changelog/year-2026/))

## Expo's own tools (the infrastructure layer)

- **Expo Launch** (launch.dev, v2.3.0, 3 Sep 2026; beta):
  - a browser wizard that publishes a **local project or a public GitHub repo** to the App Store/TestFlight, Google Play (release track), the web (`*.expo.app`) and **the Meta VR store**;
  - supports **Expo, React Native and Flutter**;
  - agent/headless CLI: `npx create-launch --json`;
  - no private repos, no auto-redeploy, no OTA (that's EAS Update);
  - pricing follows the EAS free tier. ([launch.dev/llms-full.txt](https://launch.dev/llms-full.txt))
- **"EAS" is now called "Expo Services"**: Expo Build, Submit, Update, Workflows (CI/CD), Hosting (with API routes), **Observe** (performance and errors, Observe-data-with-AI) and **Metadata** (`store.config.json`, push the store listing with `eas metadata:push`, with validation) and Insights. ([llms.txt](https://docs.expo.dev/llms.txt), [Metadata](https://docs.expo.dev/eas/metadata/index.md))
- **Expo AI offering:**
  - **Expo MCP Server** (simulator interaction, DevTools);
  - **Expo Skills**;
  - official Claude Code and Codex plugins;
  - **Agentic workflows**: an agent tests PRs on a **cloud simulator**, turns an issue into a PR, triages bugs and runs a QA swarm. **Expo Simulators is a limited-access preview.** ([agents](https://docs.expo.dev/agents.md), [agentic workflows](https://docs.expo.dev/agentic-workflows/introduction.md))
- **Pricing** ([expo.dev/pricing](https://expo.dev/pricing)):

| Plan | Price | Included |
|---|---|---|
| Free | $0 | 15 iOS + 15 Android builds, 1K update MAU |
| Starter | $19/mo | $45 build credit, 3K MAU |
| Production | $199/mo | $225 credit, 50K MAU, **SOC 2 Type 2**, SSO |
| Enterprise | Custom | |

  - Builds: $1–4 each.
  - **Simulator minutes $0.10/min (beta)**; paid plans include 60 min/month until 2027.

## Other AI mobile builders found (launched or active 2025–2026)
- **RapidNative:**
  - Expo/RN; image, Figma or sketch to app; QR preview; code download; RevenueCat, Google Maps and AI SDK; enterprise SSO;
  - "365,000+ prompts by Oct 2026" (claimed);
  - store publishing through the **LetsDeployIt** done-for-you service: icons, screenshots, metadata, privacy policies, signing; "approved or your money back"; **3–4 weeks to live**;
  - LetsDeployIt also publishes Lovable apps. ([llms.txt](https://www.rapidnative.com/llms.txt))
- **CatDoes:**
  - an autonomous agent that builds Expo/RN mobile apps and Vite/Next.js sites;
  - CatDoes Cloud (DB, auth, storage, edge functions);
  - **"Turn any website (Lovable, WordPress, Shopify) into a native mobile app"**;
  - App Store, TestFlight and Play release by chat;
  - "Liquid Glass" changelog item (claimed);
  - free 25 credits, from $20/mo, GitHub and export on Plus. ([llms.txt](https://catdoes.com/llms.txt))
- **OnSpace.AI:** screenshot-to-app, React Native + Expo, "one-click deployment to iOS App Store and Google Play… store optimization" (claimed), GitHub export. ([llms.txt](https://www.onspace.ai/llms.txt))
- **Appy Pie Agentic AI App Builder** (PR Newswire, 3 Nov 2026): planning, design, build and test agents; React Native output; backend, DB and accounts. **Reported.**
- **AppX**: React Native from prompts; only reported (similarlabs, trustmrr). Not verified.

---

# Part 5. Still unknown

- **Thunkable:** the output stack (native vs RN vs other) is never named. OTA, Stripe for AI projects, haptics and refund policy are undocumented.
- **Bolt:** native capabilities (push, camera, IAP), OTA and refund policy. Annual prices aren't on the live page.
- **Replit:** OTA; Google Play timeline. The Pro tier contents above $100 aren't on the page.
- **Lovable:** live plan prices (the page didn't render numbers); whether any native wrapper is planned.
- **FlutterFlow (new builder):** whether IAP or code export is on the roadmap. Studio: HealthKit, widgets and OTA aren't in the index.
- **Draftbit:** refund policy; community channel; HealthKit and widgets.
- **Adalo:** whether Ada is GA; widgets, HealthKit and offline.
- **BuildNatively:** the Essential plan's build limit (4 vs unlimited conflict); trial length (3 vs 14 days).
- **Base44:** whether "native mobile (Expo)" apps can go through the same store-files flow or only the wrapper. No IAP path is documented.
- **Bubble:** the exact build-submission count per mobile plan (not on the live page). The rendering stack isn't stated in the docs.
- **Emergent:** credit cost per build; refund policy (page not readable). Ads show heavy spend, but per-ad mobile messaging wasn't analysed.
- **Momen:** pricing per plan; whether it's a wrapper or native; the Android timeline.
- **Orchids:** whether the product is still operating (marketing deployment paused) and whether mobile output exists.
- **OnSpace, CatDoes, Appy Pie, AppX:** full docs not read (only `llms.txt` and press). Pricing beyond entry tiers and actual store automation depth are unverified.
- **No product's docs mention:** home-screen widgets (outside Bitrig/Rork in part A); App Store paywall/onboarding **A/B tests** (only Emergent mentions RevenueCat Paywalls A/B, and only as an option); **in-app localization of the app UI by AI** (only permission strings: BuildNatively, Base44).
