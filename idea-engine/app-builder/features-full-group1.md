# Full feature lists: Rork, Vibecode, Anything, a0.dev, Bitrig, Superapp, Newly, Cabano

Checked 2026-11-10. This file extends [features-catalog.md](features-catalog.md), [features-part-a.md](features-part-a.md) and [features-part-b.md](features-part-b.md). Those files were built against a fixed checklist. This one lists every feature each product's own docs describe.

## How this was built

Every documentation index was downloaded in full and read page by page. Spot checks were not used.

| Product | Index read | Pages |
|---|---|---|
| Rork | [docs.rork.com/llms.txt](https://docs.rork.com/llms.txt) + `llms-full.txt`, [rork.com/changelog](https://rork.com/changelog), [sitemap](https://rork.com/sitemap.xml) | 81 doc pages + changelog |
| Vibecode | [llms.txt](https://www.vibecodeapp.com/llms.txt), [docs/llms.txt](https://www.vibecodeapp.com/docs/llms.txt), [llms-full.txt](https://www.vibecodeapp.com/llms-full.txt), [pricing](https://www.vibecodeapp.com/pricing), [refund policy](https://www.vibecodeapp.com/refund-policy), [security](https://www.vibecodeapp.com/security), [templates](https://www.vibecodeapp.com/templates) | 113 pages + 4 site pages |
| Anything | [docs/llms.txt](https://www.anything.com/docs/llms.txt) + `llms-full.txt`, [pricing](https://www.anything.com/pricing), [blog sitemap](https://www.anything.com/blog/sitemap.xml), [affiliates](https://partners.dub.co/anything) | 164 doc pages, incl. 51 API-reference pages |
| a0.dev | [docs.a0.dev/llms.txt](https://docs.a0.dev/llms.txt) + `llms-full.txt`, [blog](https://a0.dev/blog), [sitemap](https://a0.dev/sitemap.xml), pricing JS bundle | 25 doc pages |
| Bitrig | [sitemap](https://bitrig.com/sitemap.xml): all 61 blog posts with publish dates, [pricing](https://bitrig.com/pricing). There are no docs: docs.bitrig.com is a Mintlify login page. | 61 posts |
| Superapp | [llms.txt](https://superapp.dev/llms.txt), [docs/llms.txt](https://superapp.dev/docs/llms.txt) + [docs/llms-full.txt](https://superapp.dev/docs/llms-full.txt), [sitemap](https://superapp.dev/sitemap.xml), `.md` pages ([pricing](https://superapp.dev/pricing.md), [features](https://superapp.dev/features.md), [faq](https://superapp.dev/faq.md), [teams](https://superapp.dev/teams.md), [partners](https://superapp.dev/partners.md), [impactmakers](https://superapp.dev/impactmakers.md), [selfdrive](https://superapp.dev/selfdrive.md)) | 73 doc pages + 7 site pages |
| Newly | [docs.newly.app/llms.txt](https://docs.newly.app/llms.txt) + `llms-full.txt` (includes the full [changelog](https://docs.newly.app/changelog)) | 45 pages |
| Cabano | [llms.txt](https://cabano.app/llms.txt), [llms-full.txt](https://cabano.app/llms-full.txt), [sitemap](https://cabano.app/sitemap.xml) | 24 doc pages + 12 posts |

Cabano's doc pages render with JavaScript. Their text was read from the site's own JS bundle, as in part B.

**Labels used below**
- **(claimed):** marketing copy only; no doc page confirms it.
- **(bundle):** the string appears in the product's shipped JS but on no page.
- Dates come from changelogs or blog posts.

---

## 1. Rork

Native SwiftUI, Kotlin/Compose and React web. Expo is legacy only.

### Input and import
- Text prompt.
- Image attachments as style or content reference.
- **Element Selection:** point at any element in the iOS, Android or web preview and describe the change. ([doc](https://docs.rork.com/features/element-selection))
- In the Rork Max iPhone app ([doc](https://docs.rork.com/rork-max/rork-max-app)):
  - Voice dictation.
  - Screenshot-and-draw annotations.
  - File uploads from the Files app (specs, CSVs, designs).
- **Imports:**
  - Website → native app. ([doc](https://docs.rork.com/import/website-to-mobile-app))
  - Lovable → native, keeping the Supabase backend. ([doc](https://docs.rork.com/import/lovable-to-mobile-app))
  - Any GitHub repo, through the Rork GitHub App with two-way sync. ([doc](https://docs.rork.com/import/import-from-github))
  - Bolt, v0, Replit, FlutterFlow, Bubble, Glide, Softr and Base44, via GitHub export, with per-builder steps. ([doc](https://docs.rork.com/import/import-from-any-app-builder))
- **Convert between platforms:** Android↔iOS, and React Native → Swift + Kotlin, in one project with one shared chat and context. ([doc](https://docs.rork.com/import/convert-between-platforms))
- **Figma:** no direct connection. You paste Figma screens as images. ([FAQ](https://docs.rork.com/faq/integrations))
- Idea-validation guide. ([doc](https://docs.rork.com/elements-of-a-good-idea/how-to-tell-if-your-idea-is-good))

### Agent, modes and models
- **Three exclusive modes** ([doc](https://docs.rork.com/features/agent-modes)):
  - **Design:** asks style questions, then draws 3–4 screens. You choose from four designs. Decisions are saved to `.rork/DESIGN.md`. ([doc](https://docs.rork.com/features/design-mode))
  - **Plan:** written plan, plus key screens and a flow diagram for new apps. ([doc](https://docs.rork.com/features/plan-mode))
  - **Build.**
- **Model picker with effort levels.** The model list on the plans page refreshes daily. ([plans](https://docs.rork.com/introduction/subscriptions))
  - GPT-6 Astra: 7 Sep 2026.
  - Claude Opus 5.5 and GPT-6 Sol: 22 Sep.
  - Claude Sonnet 5.5, with five effort levels: 28 Sep.
  - GPT-6.1 Sol: 29 Sep.
  - ([changelog](https://rork.com/changelog))
- Auto model option in the Max app.
- Message queue in the Max app.
- Stop a message mid-run and pay only for work done.
- Per-message cost shown in the ⋯ menu. ([credits](https://docs.rork.com/billing/credits))
- **Undo/Revert** to any earlier answer, free. You can review the files each message changed. ([doc](https://docs.rork.com/features/undo-and-history))
- Error-loop escape guide. ([doc](https://docs.rork.com/introduction/introduction/agent-loops))

### Platforms and app types
- iPhone (SwiftUI): Pro. ([doc](https://docs.rork.com/iphone/rork-iphone))
- Android (Kotlin + Jetpack Compose, Material You): Pro. ([doc](https://docs.rork.com/android/rork-android))
- Web (Vite + React), hosted on `rork.app`: Pro. ([doc](https://docs.rork.com/web/rork-web))
- **Max only:** iPad, Apple Watch, Vision Pro, native games and iOS widgets. ([plans](https://docs.rork.com/introduction/subscriptions))
- Docs name Live Activities, HealthKit and ARKit as Swift-only capabilities. ([doc](https://docs.rork.com/introduction/build-your-first-app), [FAQ](https://docs.rork.com/faq/technical))
- **Rork Games** (15 Jun 2026; [doc](https://docs.rork.com/games/build-a-game)):
  - iPhone: SpriteKit for 2D, RealityKit for 3D.
  - Browser: three.js + React Three Fiber + Rapier.
  - Generated 3D models and animations.
  - Multiplayer.
  - Free in-game voice chat over Rork-hosted TURN servers.

### Design and assets
- **Assets tab** with Images, 3D Models, Videos, Audio and Other. Each asset has "Use in Chat". ([doc](https://docs.rork.com/features/assets))
- **Images:** square, portrait or landscape. **App icon generation**, written for iPhone, Android and web.
- **Video generation:** from text, an image or a reference clip, or by editing an earlier video.
- **Audio generation:** music, sound effects, voice, and multi-speaker dialogue.
- **3D model generation:** on all plans since 15 Jun 2026, with texture compression.
- NanoBanana image-app tutorial. ([doc](https://docs.rork.com/quick-start-examples/nano-banana-image-app))

### Preview and testing
- **Cloud simulators** ([doc](https://docs.rork.com/features/simulator)):
  - iOS at 0.2 credits/min; Android emulator at 0.1 credits/min.
  - **Screenshot** and **Record** buttons, with captures attachable to chat.
  - The agent can start the simulator itself to test or take screenshots.
- **Code and Logs panel:** read on all plans, edit on paid plans. ([doc](https://docs.rork.com/features/code-and-logs))
- **Rork Max iPhone app:** runs your native Swift apps on the phone "replacing Xcode and TestFlight", and can install or publish from the phone. ([doc](https://docs.rork.com/rork-max/rork-max-app))
- **Rork Companion:** free Windows/Mac app that installs your app on an iPhone over USB. ([doc](https://docs.rork.com/rork-max-swift))
- TestFlight upload with a beta invite link. ([doc](https://docs.rork.com/store-guides/testflight-beta-testers))
- Android APK for device testing. ([doc](https://docs.rork.com/submitting-to-play-store/apk-file))
- Open in Xcode via GitHub. ([doc](https://docs.rork.com/how-to-set-up-xcode/how-to-set-up-xcoe))

### Backend, data and auth
- **Rork Cloud** ([doc](https://docs.rork.com/backend/rork-cloud)):
  - Free in beta; data kept even if the subscription ends.
  - Postgres, RLS and Edge Functions, with a Database panel to browse tables.
  - One-prompt transfer to your own Supabase.
- **Bring your own Supabase** (15 Jun 2026; [doc](https://docs.rork.com/backend/supabase)) or **Firebase** ([doc](https://docs.rork.com/backend/firebase)).
- **Auth** ([doc](https://docs.rork.com/integrations/backend/how-to-set-up-oauth)):
  - **Rork Auth:** Google and Apple, no backend needed.
  - **Supabase Auth:** email/password, magic links and phone codes.
  - A project uses one model or the other, not both.
- **Secrets editor:** each key is labelled server-side, build-time or shipped. ([doc](https://docs.rork.com/features/secrets))
- **Rork AI Cloud** ([credits](https://docs.rork.com/billing/credits)):
  - AI, search, images and voice in your apps, with no provider keys.
  - Billed at cost: $1 = 5 credits.
  - On/off switch, a monthly limit for your apps' AI, and Cloud Usage broken down by model and project.
  - Merged into one credit balance on 30 Oct 2026.
- **Push:** APNs on iOS, FCM on Android; Rork Cloud also offers push. ([FAQ](https://docs.rork.com/faq/integrations))
- Any third-party API (Google Sheets, Airtable, Notion and others) by asking. ([FAQ](https://docs.rork.com/faq/integrations), [doc](https://docs.rork.com/features-apis/apis/how-to-connect-an-api-to-your-project))

### Monetization
- RevenueCat from the Monetization panel. Superwall, Adapty and Stripe questions are answered with "use RevenueCat". ([doc](https://docs.rork.com/payment-guides/revenuecat-copied-1))
- Free-trial guide. ([doc](https://docs.rork.com/make-your-app-profitable/paywalls/how-to-add-a-free-trial))
- Privacy policy / Terms / EULA guide. ([doc](https://docs.rork.com/make-your-app-profitable/paywalls/how-to-set-up-your-policies))
- **Analytics tab** ([doc](https://docs.rork.com/features/analytics)):
  - Your own build-activity heatmap.
  - RevenueCat revenue, MRR, subscriptions, trials and conversion.
- **Playbook docs:**
  - Onboarding into a paywall and price testing. ([doc](https://docs.rork.com/rork-playbook/untitled-page-3))
  - Influencer creatives and negotiation.
  - Organic content.
  - "Scale to $50k/month". ([doc](https://docs.rork.com/rork-playbook/scale-to-50k-month))

### Publishing
- App Store via Apple sign-in plus verification code. ([doc](https://docs.rork.com/store-guides/publish-app-store), [short](https://docs.rork.com/publishing))
- **AI App Store Reviewer:** checks guideline areas 1.x–5.x with evidence and a fix; needs a paid plan. ([doc](https://docs.rork.com/ai-app-store-reviewer))
- **Screenshot Studio** ([doc](https://docs.rork.com/store-guides/screenshot-studio)):
  - Free beta, no account needed.
  - Source: an App Store URL or a GitHub repo.
  - Up to 6 screens, style presets or a free-text style.
  - Output: 1284×2778 PNGs, with per-slide retry.
- **App Store reviews inside the project.** Rork notifies you of new reviews; the agent drafts a reply and posts it after you approve. ([doc](https://docs.rork.com/store-guides/app-store-reviews))
- **Google Play** ([doc](https://docs.rork.com/submitting-to-play-store/creating-the-aab-file), [account](https://docs.rork.com/store-guides/google-play-developer-account)):
  - Signed AAB to the internal track.
  - Covers the 12-tester / 14-day closed-test rule.
- **Web custom domains** ([doc](https://docs.rork.com/web/custom-domains)):
  - Connect a domain or buy one.
  - DNS and HTTPS set up automatically.
  - Covers Cloudflare DNS and CAA records.
- Checklist, submission-error and rejection-reason guides, including expedited review. ([checklist](https://docs.rork.com/submitting-to-app-store/apple/app-store-checklist), [review guide](https://docs.rork.com/appstore-submission-checklist/app-review-guide))

### Collaboration
- Invite by email (expires in 7 days) or by link (lasts 1 year).
- **Editor/Viewer** roles.
- Presence avatars.
- **Comments panel.**
- **Clone project.**
- Collaborators spend the owner's credits.
- ([doc](https://docs.rork.com/collaborate/share-a-project))

### Pricing, support and programs
- **Plans:**
  - Free: 35 design credits a month, 5 a day; 5 a month outside major markets.
  - Pro: $20, 100 credits.
  - Max: $200 / 1,000 credits, with 2,500, 5,000 and 10,000 tiers.
  - **Rork Start (India):** ₹649/mo, 40 credits.
  - ([plans](https://docs.rork.com/introduction/subscriptions), [billing FAQ](https://docs.rork.com/faq/billing))
- Top-ups at $0.22/credit, plus **auto top-up**.
- Paid plans reset on the purchase anniversary; Free resets on the 1st of the month.
- Private projects on every plan.
- "Dev mode" on paid plans.
- **Support:** none on Free, email on Pro, **priority chat on Max**. ([FAQ](https://docs.rork.com/faq/support))
- **Affiliates:** link in the site footer to `affilates.rork.com`. Terms not readable. ([changelog footer](https://rork.com/changelog))
- [Founders](https://rork.com/founders) showcase.
- [Request documentation](https://docs.rork.com/request-documentation) page.
- Discord.

---

## 2. Vibecode

Swift iOS apps, React Native/Expo, and web.

### Input
- Text prompt and screenshots.
- **Mic dictation on the web.** ([doc](https://www.vibecodeapp.com/docs/getting-started/web-app))
- **Pinch to Build** long-press menu in the iPhone app. ([doc](https://www.vibecodeapp.com/docs/getting-started/pinch-to-build))
- Website-to-app guide. ([doc](https://www.vibecodeapp.com/docs/getting-started/web-to-mobile))
- **166 remixable templates**, mostly iOS clones (Instagram, Airbnb, TikTok…), in 10 categories. ([templates](https://www.vibecodeapp.com/templates))
- **"Can I vibe code it?" checker:** verdicts on 250+ famous apps. ([page](https://www.vibecodeapp.com/can-i-vibe-code-it))
- App Idea Generator custom GPT. ([doc](https://www.vibecodeapp.com/docs/custom-gpt))

### Agent and models
- Runs **Claude Code** in a cloud sandbox. ([llms-full](https://www.vibecodeapp.com/llms-full.txt))
- **Per-message model picker** ([changelog](https://www.vibecodeapp.com/docs/updates)):
  - Claude Opus 5.5: default for new apps since 22–25 Sep 2026.
  - GPT-6.1 Sol: default for follow-ups since 29–30 Sep.
  - Sonnet 5.5, Fable 5.1, GPT-6 Astra and Luna, Gemini, Meta Muse.
  - GLM 5.3 added 15–19 Sep, when Kimi was removed.
- **Agent testing** on every Web and Mobile project: after a change, the agent opens the app, clicks through what it built and fixes what it finds. Since 29–30 Sep. ([doc](https://www.vibecodeapp.com/docs/features/agent-testing))
- Subagent activity shown in chat (5–17 Aug).
- Queued prompts survive a refresh (28 Sep).
- Browser notification when the app is ready (28 Sep).
- Restore earlier versions, including via MCP. ([MCP doc](https://www.vibecodeapp.com/docs/guides/vibecode-mcp))

### Project types and platforms
- **iOS app (Swift/SwiftUI):** iPhone and iPad. GA 10 Sep 2026. ([doc](https://www.vibecodeapp.com/docs/getting-started/native-ios-apps))
- **Mobile app:** React Native/Expo for iOS and Android.
- **Web app:** `*.vibecode.run` or a custom domain. ([doc](https://www.vibecodeapp.com/docs/getting-started/web-app), [domain](https://www.vibecodeapp.com/docs/deploying/custom-domain))
- **Built on iPhone:** the iPhone app writes, builds and tests Swift apps (28 Sep 2026).

### Design and assets
- **Image generation:** GPT Image 2, Nano Banana 2 / 2 Lite (28–31 Aug). ([doc](https://www.vibecodeapp.com/docs/features/image-generation))
- **Sound generation.** ([doc](https://www.vibecodeapp.com/docs/features/sound-generation))
- **Media tab video:** animate an image into a clip (8–11 Sep).
- Haptics guide. ([doc](https://www.vibecodeapp.com/docs/features/haptics))
- **Native iOS UI prompt library:** large titles, Zeego context menu, Liquid Glass tabs, bottom sheets and more. ([doc](https://www.vibecodeapp.com/docs/getting-started/native-ui-components))

### Preview and testing
- Cloud iOS Simulator streamed to the browser or phone.
- **iPhone Duo** preview (29–30 Sep).
- Idle pause after 1 hour.
- Hard reset.
- Install on iPhone from the web via QR (15–19 Sep).
- Re-install past builds (22–25 Sep).
- Share React Native apps through the **Appsmith – Vibecode Apps** viewer app. ([doc](https://www.vibecodeapp.com/docs/getting-started/sharing-app))

### Backend, data and secrets
- **Vibecode Cloud** ([doc](https://www.vibecodeapp.com/docs/features/vibecode-cloud)):
  - Better Auth: email OTP, Google, Apple.
  - SQLite + Prisma.
  - File storage.
  - **$20/mo per live backend.** Plus includes 1, Pro 3, Max 5.
- Supabase or Firebase. ([doc](https://www.vibecodeapp.com/docs/features/backend-auth))
- Google Sign-In guide. ([doc](https://www.vibecodeapp.com/docs/google-login/setup))
- ENV tab.
- **AI keys never enter the sandbox:** a proxy adds them.
- **`.env` cleared when someone remixes your project.** ([security](https://www.vibecodeapp.com/security))
- Install checks whether the backend is deployed (29–30 Sep).

### Integrations: APIs tab, no keys, billed from credits
- LLMs: GPT-6 family, Claude, Gemini, Grok 4.7, GLM.
- GPT-4o transcription.
- ElevenLabs TTS, sound effects, music and voice changer.
- Image models: GPT Image, Nano Banana, Ideogram.
- Video: **Sora 2/Pro, Seedance 2.0/2.5.**
- Data: **Apple Maps**, TMDB, OpenWeather, stocks/crypto (Alpha Vantage), Channel3 product search.
- **Resend email.**
- **Expo push.**
- Claude Agent SDK.
- ([index](https://www.vibecodeapp.com/docs/integrations/index))

### Monetization
- RevenueCat: set up by the agent for Swift; a Payment tab for React Native.
- Stripe for web.
- ([doc](https://www.vibecodeapp.com/docs/monetization/revenuecat-setup), [Stripe](https://www.vibecodeapp.com/docs/monetization/stripe-setup))

### Publishing
- **App Store panel on the web** (15–19 Sep): prepare → upload → processing → update listing → **submit for review**.
- **Sign in with Apple ID and Vibecode creates the ASC API key** (29–30 Sep), or you enter a key manually.
- ([doc](https://www.vibecodeapp.com/docs/getting-started/native-ios-apps))
- `/appstore-preflight` checks 5.1, 3.1.1 (Restore Purchases, pricing), 2.1/4.2 and 4.1/4.3.
- Optional accessibility declarations.
- Privacy policy and support page.
- ([doc](https://www.vibecodeapp.com/docs/getting-started/deploy-app-store))
- React Native apps go through Expo Launch.
- No built-in Google Play.
- Guides: TestFlight, review times, review guidelines, publishing without a Mac. ([docs index](https://www.vibecodeapp.com/docs/llms.txt))

### Workflow
- **MCP** for ChatGPT, Claude, Codex, Cursor and Gemini CLI. Free plan: 50 commands a week. Paid: 20-minute commands and live-server access. ([doc](https://www.vibecodeapp.com/docs/guides/vibecode-mcp))
- **MCP replaced SSH**, which is no longer available. ([doc](https://www.vibecodeapp.com/docs/getting-started/work-from-ai-tools))
- **Vibecode CLI:** gives your own agent the sandbox, databases, auth, APIs and hosting. ([doc](https://www.vibecodeapp.com/docs/vibecode-cli))
- Code download on Pro+. ([doc](https://www.vibecodeapp.com/docs/getting-started/download-code))
- **Usage tab** by model and app (5–17 Aug).
- **Feedback page** (8–11 Sep).
- Banner when a payment fails, before deployments go offline (15–19 Sep).
- No team or collaboration docs found.

### Pricing, support, refunds and programs
- **Plans** ([plans](https://www.vibecodeapp.com/docs/getting-started/plans-and-credits)):
  - Free: first build only.
  - Plus: $20 ($200/yr), with **human Intercom chat**.
  - Pro: $50, $55 of credits, priority technical support.
  - Max: $200, $220 of credits, **24/7 priority support with a 1-minute response** and **1 live coding session**.
- Credits roll over "while your plan is active". ([pricing](https://www.vibecodeapp.com/pricing))
- Buy $20–$500 of credits (at most $500 a day).
- **Auto-reload:** minimum $20, triggers below $5.
- Promo codes.
- **Free credits for social posts:** reviewed by Vibecode, on X, IG, YT, TikTok, LinkedIn, FB, Reddit or Threads.
- **Referral program** (28 Sep 2026):
  - $1 each for the first 5 referrals.
  - Then a plan bonus for both people: $10 / $20 / $50.
  - ([page](https://www.vibecodeapp.com/referral))
- **Launch Pass:** $149 one-time on the web. **Full refund if your app isn't live on the App Store within 30 days**, if you approve v1 and connect Apple within 14 days. Found only in the [refund policy](https://www.vibecodeapp.com/refund-policy), updated 6 Nov 2026.
- Subscriptions and credits are non-refundable unless law requires or support approves.
- Hosting is billed separately at $20 per deployment and **keeps billing after you cancel your plan**. ([FAQ](https://www.vibecodeapp.com/docs/faqs))
- **Security page:** Clerk auth, Stripe, isolated sandboxes, vulnerability reporting with a 3-business-day acknowledgement. ([page](https://www.vibecodeapp.com/security))
- Public [App Store status](https://www.vibecodeapp.com/app-store-status) page.
- Discord.
- Contests: Holiday Challenge, 49 entries. ([case study](https://www.vibecodeapp.com/blog/app-case-study-daily-grid))

---

## 3. Anything

Expo React Native and Next.js web.

### Input and import
- Text and images.
- **Figma** ([doc](https://www.anything.com/docs/import/figma)), **Mobbin** ([doc](https://www.anything.com/docs/import/mobbin)), **Mocha** ([doc](https://www.anything.com/docs/import/mocha)).
- **Sleek** design-tool export via "Build with Anything". ([doc](https://www.anything.com/docs/import/sleek))
- **Template marketplace:** free or paid templates, ratings and reviews. **Creators sell templates** and track earnings in a seller dashboard; review takes 1–2 days. ([doc](https://www.anything.com/docs/apps/templates))

### Agent modes and models
- **Modes:**
  - Thinking (default).
  - **Fast:** cheaper.
  - **Discussion:** no code changes.
  - Plan.
  - **Max:** autonomous build, test in a real browser, fix.
  - "Auto" on some accounts.
  - ([doc](https://www.anything.com/docs/builder/agent))
- **Max features** ([doc](https://www.anything.com/docs/builder/max), [pricing](https://www.anything.com/pricing)):
  - Parallel agents.
  - Computer-use visual QA.
  - Extended 1M context.
  - Automated tests.
  - Errors explained in plain language.
- Opt-in **v2 project architecture**, which copies the project. ([doc](https://www.anything.com/docs/builder/upgrade-to-v2))

### Design
- Built-in design reasoning and pre-installed UI components. ([doc](https://www.anything.com/docs/apps/design))
- **Custom fonts** (expo-font), **splash screen** (expo-splash-screen), status bar, blur, gradients, Reanimated, Skia. ([capabilities](https://www.anything.com/docs/apps/mobile/device-capabilities))

### Device capabilities
- Documented in a 50-row table ([doc](https://www.anything.com/docs/apps/mobile/device-capabilities)):
  - Camera, photo picker, location, **maps**, haptics, audio, **text-to-speech**, video.
  - **Contacts, device calendar**, sensors and pedometer.
  - Document picker, file system, in-app browser, web views, secure store, local storage, clipboard.
  - Charts, 3D (expo-gl / expo-three).
  - **Deep links (expo-linking).**
- **Status table on the same page:**
  - Push notifications: "Coming Q1 2026".
  - Deep linking: Q2 2026.
  - Background services: Q4 2026.
  - Offline: "in development".
- **Contradiction:** the Expo Go page lists push notifications and **HealthKit** as available device features. ([doc](https://www.anything.com/docs/builder/ios-app))

### Backend and data
- Postgres databases. ([doc](https://www.anything.com/docs/apps/databases))
- Functions. ([doc](https://www.anything.com/docs/apps/backend))
- Uploads. ([doc](https://www.anything.com/docs/apps/uploads))
- **Auth** ([doc](https://www.anything.com/docs/apps/auth)):
  - Email, Google, Facebook, X.
  - Apple: "coming".
  - **Facebook SSO is blocked from iOS builds until Sign in with Apple ships.** ([doc](https://www.anything.com/docs/auth/facebook))
- **In-app roles and permissions.**
- Saved secrets.
- **100+ named integrations**, including:
  - Perplexity, Exa, Firecrawl.
  - HeyGen, Tavus, Luma, ElevenLabs, Spotify, Slack, Discord.
  - Yelp, Ticketmaster, Airtable, Resend.
  - ([list](https://www.anything.com/docs/apps/integrations))

### Monetization
- RevenueCat. ([doc](https://www.anything.com/docs/payments/revenuecat))
- Stripe. ([doc](https://www.anything.com/docs/payments/stripe))
- **AdMob + AdSense.** ([doc](https://www.anything.com/docs/ads))

### Launch
- Web publish. ([doc](https://www.anything.com/docs/launch/publish))
- **Custom domains, buyable in the dashboard.** ([doc](https://www.anything.com/docs/launch/domains))
- **Domain-email guide** (MX/SPF/DKIM). ([doc](https://www.anything.com/docs/launch/domain-email))
- **Branding & SEO:** OG tags, per-page metadata. ([doc](https://www.anything.com/docs/launch/branding-seo))
- **Analytics:** opt-in; visitors, page views, bounce rate, sources, Stripe revenue. ([doc](https://www.anything.com/docs/launch/analytics))
- App Store via Expo, with an "App Store Review" compliance check. ([doc](https://www.anything.com/docs/launch/app-store))
- Play Store: beta. ([doc](https://www.anything.com/docs/apps/mobile/publishing-android))
- **TestFlight crash-log guide.** ([doc](https://www.anything.com/docs/apps/mobile/testflight-logs))
- **Embed the app as an iframe** (WordPress). ([doc](https://www.anything.com/docs/share/embed))

### Developer access
- **REST API** ([reference](https://www.anything.com/docs/llms.txt)) covering:
  - Projects (create, duplicate, restore deleted, publish, unpublish).
  - "Request a change" (generation).
  - Deployments, including **rollback**.
  - Domains.
  - Databases: query, connection string, reset dev.
  - Secrets.
  - **Organization members and roles.**
  - App Store submission and Play setup.
  - Logs, messages, files, assets.
- **CLI.** ([doc](https://www.anything.com/docs/builder/cli))
- API keys with expiry. ([doc](https://www.anything.com/docs/account/api-keys))

### Collaboration
- Real-time team workspaces with live cursors. ([doc](https://www.anything.com/docs/share/teams))
- Members can't be removed in the UI; you email support.
- **Teams plan: custom pricing.** ([pricing](https://www.anything.com/pricing))

### Pricing, support and programs
- **Plans** ([doc](https://www.anything.com/docs/account/subscriptions)):
  - Pro 20k: $19/yr-billed, $24 monthly.
  - Max: 200k–900k credits, $199–$1,079, with **+10% volume bonus credits**.
- Top-offs from $12 per 10k credits, never expiring.
- Annual billing: 2 months free.
- **Remove Anything branding** on Pro.
- **Storage: 50 GB on Pro, 150 GB on Max.** ([pricing](https://www.anything.com/pricing))
- **Support:** premium email for paid plans, priority on Max.
- **Instant one-click credit refunds** for failed generations; no subscription refunds. ([credits](https://www.anything.com/docs/account/credits))
- **Affiliate program:** 30% per sale for 1 year via Dub; referred users get 20% off their first purchase. ([partners](https://partners.dub.co/anything))
- **Experts network on Contra:** paid 1:1 help from verified builders. ([doc](https://www.anything.com/docs/support/product-experts))
- Discord and X community. ([doc](https://www.anything.com/docs/share/community))
- **Anything Max hackathon:** guidelines posted 10 Nov 2026. ([blog sitemap](https://www.anything.com/blog/sitemap.xml))

---

## 4. a0.dev

Expo SDK 54. The docs are thin: 25 pages.

### Agent
- Prompting guides: "three principles" and writing prompts. ([doc](https://docs.a0.dev/agent-guide/three-principles))
- **New Chat** resets history but keeps the app. ([doc](https://docs.a0.dev/agent-guide/new-chat-explained))
- Project upgrades move the Expo runtime; SDK 54 as of 18 Nov 2025. ([doc](https://docs.a0.dev/advanced/upgrading-your-project))

### Capabilities
- **Deep links:** schemes declared in `.a0/build.yaml`, written to Info.plist and AndroidManifest. ([doc](https://docs.a0.dev/development/deep-links))
- **Push:** sent from the Convex backend over APNs and FCM; Android FCM setup guide. ([doc](https://docs.a0.dev/development/push-notifications), [FCM](https://docs.a0.dev/development/android-fcm-setup))

### Monetization
- `monetization.yaml`: features (entitlements), plans and offerings, synced to providers by the agent.
- Stripe for web, Apple for iOS.
- **Android payments not supported.**
- ([setup](https://docs.a0.dev/development/monetization/payment-setup), [implementation](https://docs.a0.dev/development/monetization/payment-implementation))

### Testing
- Four paths ([overview](https://docs.a0.dev/development/testing/overview)):
  - Web preview.
  - **a0 iOS app** (no payments).
  - Expo Go for Android.
  - Native IPA/APK builds.
- iOS device registration. ([doc](https://docs.a0.dev/development/testing/device-registration))

### Publishing
- **Automatic App Store Connect setup** with a Team API key (needs admin rights). ([doc](https://docs.a0.dev/publishing/ios/app-store-connect/automatic-setup))
- Manual key setup.
- Deploy flow. ([doc](https://docs.a0.dev/publishing/ios/deploying-on-a0))
- Pre-submission checklist. ([doc](https://docs.a0.dev/publishing/ios/submission-checklist))
- **OTA updates to all platforms.** ([doc](https://docs.a0.dev/publishing/ota-updates/overview))

### Found only in the app bundle (pricing page renders client-side)
These come from `a0.dev/_next/static/chunks/8329-…js` and `5651-…js`:
- **Paid "AI icon credits"**, suggesting AI app-icon generation.
- Credit auto-refill below 10 credits.
- **Bonus credits for social posts**, up to 500.
- **Bonus credits for submitting to the Showcase.**
- "30 free credits".
- "Unlimited app builds".
- "Unlimited support calls".

### Marketing
- 15 use-case landing pages: Google Sheets to app, church, festival, HOA, PTA and others. ([sitemap](https://a0.dev/sitemap.xml))
- [Showcase](https://a0.dev).
- Discord and Reddit.
- Last blog post: "Phase 1", 3 Jul 2025. ([blog](https://a0.dev/blog))

---

## 5. Bitrig

A Mac app that drives your own Claude Code, Codex or other ACP agent on real Xcode projects. The blog is the changelog.

### Agent
- **Bring your own agent:**
  - Claude Code and Codex, signed in to your existing subscription.
  - Any Agent Client Protocol agent: OpenCode, Cursor, Grok Build.
  - Agents run "fully loaded" with your MCP servers, skills and conversations.
  - Dates: 13 May and 26 Aug 2026. ([post](https://bitrig.com/blog/bring-your-own-coding-agents), [pricing FAQ](https://bitrig.com/pricing))
- **Composer upgrade (10 Sep 2026)** ([post](https://bitrig.com/blog/plan-steer-and-dictate)):
  - Plan mode.
  - `/goal` for long-running work.
  - Steer mid-task.
  - Queue the next task with ⌘↵.
  - **Dictation** with OpenAI transcription.
  - **Reusable skills, importable from GitHub.**
  - Prompt history.
  - Draft stash (⌃S).
- **Parallel agents** with a push notification when one finishes (3 Sep). ([post](https://bitrig.com/blog/run-parallel-agents))
- Diff review and hand edits (30 Jun). ([post](https://bitrig.com/blog/review-diffs-and-edit-your-code))
- **Simulator Use:** the agent taps through the app, reads logs and fixes (17 Jun). ([post](https://bitrig.com/blog/bitrig-simulator-use))
  - Extended 28 Sep with **iPhone Duo pose/hinge control, Code Mode and accessibility-tree diffs**. ([post](https://bitrig.com/blog/simulator-use-can-now-test-iphone-duo))

### Platforms, each with its own launch post
- Mac apps: 1 Apr. ([post](https://bitrig.com/blog/bitrig-builds-mac-apps))
- iPad, including Apple Pencil and multiple windows: 14 Apr. ([post](https://bitrig.com/blog/bitrig-builds-ipad-apps))
- **Apple Watch:** 22 Apr. ([post](https://bitrig.com/blog/bitrig-builds-apple-watch-apps))
- **Widgets:** 29 Apr. ([post](https://bitrig.com/blog/bitrig-builds-widgets))
- **Shortcuts, App Intents, Siri, Spotlight:** 27 May. ([post](https://bitrig.com/blog/bitrig-builds-shortcuts-and-app-intents))
- **Apple TV and Vision Pro:** 8 Jul. ([post](https://bitrig.com/blog/bitrig-builds-apple-tv-and-vision-pro-apps))
- **iPhone Duo:** 18 Sep. ([post](https://bitrig.com/blog/bitrig-builds-iphone-duo-apps))
- **iPhone Duo camera apps**, streaming the Mac camera into the 3D simulator: 8 Oct. ([post](https://bitrig.com/blog/build-iphone-duo-camera-apps))
- **CarPlay apps**, testable in a built-in CarPlay simulator without an entitlement: 27 Oct 2026. ([post](https://bitrig.com/blog/bitrig-builds-carplay-apps))
- **Apple betas:** builds with the beta Xcode and SDKs (9 Jun). ([post](https://bitrig.com/blog/build-with-apple-betas))

### Design input
- **Figma via MCP** → native Swift (23 Sep). ([post](https://bitrig.com/blog/turn-figma-designs-into-native-swift))
- Select-to-Edit in the simulator (2 Jun). ([post](https://bitrig.com/blog/select-to-edit-in-the-simulator))
- Design guides (education content, not features):
  - [System fonts](https://bitrig.com/blog/apple-system-fonts)
  - [SF Symbols](https://bitrig.com/blog/sf-symbols)
  - [Liquid Glass](https://bitrig.com/blog/liquid-glass-best-practices)
  - [Liquid Glass app icon](https://bitrig.com/blog/liquid-glass-app-icon)

### Preview
- **Photoreal 3D simulators** (29 Jul). ([post](https://bitrig.com/blog/take-bitrigs-3d-simulators-for-a-spin))
- **Record 3D app demos:** spin, fold and pose the device (4 Nov). ([post](https://bitrig.com/blog/record-3d-app-demos))
- **Bitrig Remote:**
  - iPhone: 7 Apr. ([post](https://bitrig.com/blog/meet-bitrig-remote))
  - **iPad:** 20 May. ([post](https://bitrig.com/blog/meet-bitrig-remote-for-ipad))
  - Install to the Home Screen and push to TestFlight from the phone: 23 Jun. ([post](https://bitrig.com/blog/bitrig-remote-install-and-distribute-apps))
  - iPhone Duo version: 21 Oct. ([post](https://bitrig.com/blog/meet-bitrig-remote-for-iphone-duo))

### Backend
- GitHub import with commits and pushes (6 May). ([post](https://bitrig.com/blog/bitrig-works-with-xcode-projects-from-github))
- **CloudKit:** 5 Aug. ([post](https://bitrig.com/blog/bitrig-builds-apps-with-cloudkit))
- **Supabase**, including server functions: 12 Aug. ([post](https://bitrig.com/blog/bitrig-builds-apps-with-supabase))
- **Push notifications**, with setup automated from Xcode to the backend: 18 Aug. ([post](https://bitrig.com/blog/add-push-notifications))

### Monetization
- App Store Connect subscription and IAP automation plus RevenueCat (22 Jul). ([post](https://bitrig.com/blog/adds-subscription-iap-and-revenuecat))

### Publishing (16 Jul; [post](https://bitrig.com/blog/bitrig-publishes-to-the-app-store))
- **Creates the App Store Connect app record.**
- Archive and upload with signing.
- Listing metadata kept in the project, with one-click push.
- **Screenshots captured across device sizes and localizations.**
- **Submit for review from Bitrig**, documented, including from Remote.
- **App Store listing preview** (14 Oct) ([post](https://bitrig.com/blog/preview-your-app-store-listing)):
  - Edit the listing per platform and per language.
  - **Conflict detection** against changes made in App Store Connect.
  - Live product-page and search-result preview in **light/dark** and any language.
  - App preview videos.

### Pricing and programs ([pricing](https://bitrig.com/pricing))
- **Free:**
  - 10 messages a day with your own AI subscription, or 60 credits a month.
  - Bitrig Remote.
  - Code export.
- **Pro $15:**
  - Unlimited messages.
  - TestFlight and App Store distribution.
  - Install from Remote.
  - **Priority support and feature requests.**
- **Teams & Enterprise:** shared billing, seat management, priority support; contact sales.
- **Education discount** for students and teachers.
- Free tier doubled temporarily for Apple's 50th anniversary (1 Apr). ([post](https://bitrig.com/blog/bitrig-builds-mac-apps))
- **WWDC26 hackathon** (5 Jun). ([post](https://bitrig.com/blog/join-us-at-wwdc26))
- App showcases. ([post](https://bitrig.com/blog/app-showcase-black-lens))
- Beginner guide library ([guides](https://bitrig.com/blog/guides)), including:
  - [Apple Ads](https://bitrig.com/blog/apple-ads-beginners-guide)
  - [ASO](https://bitrig.com/blog/app-store-optimization)
  - [Pre-orders](https://bitrig.com/blog/app-store-pre-orders)
  - [Small Business Program](https://bitrig.com/blog/app-store-small-business-program)

---

## 6. Superapp

Native Swift for iPhone, iPad, Watch, Mac and Vision Pro. Web app and Mac app.

### Input and import ([docs index](https://superapp.dev/docs/llms.txt))
- **Figma → SwiftUI** on Pro+. ([doc](https://superapp.dev/docs/figma-to-swiftui))
- Website → iOS. ([doc](https://superapp.dev/docs/website-to-ios-app))
- **Rebuild an existing app.** ([doc](https://superapp.dev/docs/rebuild-existing-app))
- **React Native/Expo → Swift.** ([doc](https://superapp.dev/docs/react-native-to-swift))
- **Move from another AI builder.** ([doc](https://superapp.dev/docs/move-from-ai-builder))
- **Keep your existing Supabase.** ([doc](https://superapp.dev/docs/preserve-supabase))
- ZIP import, on paid plans. ([MCP doc](https://superapp.dev/docs/mcp-server))
- Idea-evaluation guide. ([doc](https://superapp.dev/docs/validate-your-idea))
- Clone and template landing pages ([clones](https://superapp.dev/clones), [app-templates](https://superapp.dev/app-templates)). These are marketing pages; no gallery is documented.

### Agent
- **Smart and Genius modes.** Genius Mode is on Pro. ([plans](https://superapp.dev/docs/plans-and-subscriptions), [credits](https://superapp.dev/docs/credits))
- Plan approval: build status can read "waiting for plan approval". ([MCP doc](https://superapp.dev/docs/mcp-server))
- **Edit history and Revert**, which triggers an automatic rebuild. ([doc](https://superapp.dev/docs/history-and-recovery))
- Error-recovery playbooks:
  - [Agent error loops](https://superapp.dev/docs/agent-error-loops)
  - [Build errors](https://superapp.dev/docs/build-errors)
  - [Signing and entitlement errors](https://superapp.dev/docs/signing-entitlement-errors)
  - [Support diagnostics](https://superapp.dev/docs/support-diagnostics)
- **Mac app works with local Claude Code, Codex or Xcode** on the same folder. ([doc](https://superapp.dev/docs/local-coding-agents), [web vs Mac](https://superapp.dev/docs/web-or-mac))

### Capabilities
- Documented ([doc](https://superapp.dev/docs/native-capabilities)):
  - Camera, location and maps, **HealthKit**, **widgets**, notifications, **Apple Pay**, Sign in with Apple, AR and sensors, Watch apps.
- Claimed on the features page ([features](https://superapp.dev/features.md)):
  - Live Activities and Dynamic Island.
  - SiriKit and App Intents.
  - HomeKit.
  - SceneKit, SpriteKit and ARKit games.
  - "AI features with the provider you choose".
  - Built-in design system with customizable typography and colour.

### Backend
- **Superapp Cloud:** auth, database with sync, storage, access rules, server-side work. Usage is billed in credits per project. ([doc](https://superapp.dev/docs/superapp-cloud))
- Supabase. ([doc](https://superapp.dev/docs/connect-supabase))
- Sign-in flows. ([doc](https://superapp.dev/docs/accounts-and-sign-in))
- Keys-and-secrets guide. ([doc](https://superapp.dev/docs/keys-and-secrets))
- Project settings for secrets and environment values. ([doc](https://superapp.dev/docs/project-settings))

### Monetization
- RevenueCat vs StoreKit guide. ([doc](https://superapp.dev/docs/revenuecat-vs-storekit))
- **Native StoreKit paywalls.** ([doc](https://superapp.dev/docs/storekit-paywalls))
- Trials. ([doc](https://superapp.dev/docs/subscription-trials))
- **Test and restore purchases.** ([doc](https://superapp.dev/docs/test-and-restore-purchases))
- Onboarding-and-paywall guide. ([doc](https://superapp.dev/docs/onboarding-and-paywalls))

### Testing
- **QR device connect on the web, USB on the Mac.** ([doc](https://superapp.dev/docs/test-on-your-device))
- TestFlight with external testers. ([doc](https://superapp.dev/docs/testflight))
- Preview minutes: 240, 480 or 960 by plan. ([pricing](https://superapp.dev/pricing.md))

### Publishing
- Publish. ([doc](https://superapp.dev/docs/publish-app-store))
- **Generate an app website** with /privacy and /support pages; the **privacy policy is drafted from the app's code**. Web only; "coming to Desktop". ([website](https://superapp.dev/docs/app-website), [privacy](https://superapp.dev/docs/privacy-terms-and-eula))
- **Release updates:** phased, manual or automatic release; What's New notes. ([doc](https://superapp.dev/docs/release-updates))
- "Build, metadata, screenshots, privacy declarations, ASO and submission, roughly two clicks" (claimed). ([features](https://superapp.dev/features.md))

### Growth: Selfdrive (beta; creator campaigns in alpha)
- **Nightly runs** with a morning email report. ([doc](https://superapp.dev/docs/selfdrive), [report](https://superapp.dev/docs/nightly-run-and-daily-report))
- Tasks wait for your approval and stay within your budget. ([doc](https://superapp.dev/docs/selfdrive-tasks-and-approvals))
- Apple Ads. ([doc](https://superapp.dev/docs/selfdrive-apple-ads))
- ASO. ([doc](https://superapp.dev/docs/selfdrive-aso))
- **Website, SEO and GEO** ([doc](https://superapp.dev/docs/selfdrive-seo-and-geo)):
  - Runs 40–50 ChatGPT prompts.
  - Reports the cited pages.
  - Builds an article plan from them.
- **Creator campaigns** ([doc](https://superapp.dev/docs/selfdrive-creator-campaigns)):
  - "Canvas" mode: creators open new TikTok and IG accounts dedicated to your app.
  - "Classic" mode: creators post on their own accounts.
  - Runs through the "Viral" platform.
- **Works for apps not built in Superapp.**

### Integrations and workflow
- **MCP server, live now** at `mcp.superapp.dev/mcp` ([doc](https://superapp.dev/docs/mcp-server)). From Claude, ChatGPT or Claude Code you can:
  - Build apps.
  - Read code.
  - **Check App Store name availability.**
  - Run Selfdrive.
- ChatGPT app page. ([page](https://superapp.dev/chatgpt-app))

### Teams, pricing and programs
- **Teams plan**, waitlist only ([teams](https://superapp.dev/teams.md)):
  - **Unlimited free collaborators.**
  - Owner, Editor and Viewer roles, including control over who can publish.
  - Edit history showing who changed what.
  - Shared credit pool.
  - Agency, studio and enterprise positioning.
- **Plans** ([pricing](https://superapp.dev/pricing.md)):
  - Free: daily credits that expire at midnight UTC; not available in some regions.
  - Pro: $25, 50 credits.
  - Business: $50, 110 credits.
  - Max: $100, 230 credits.
- Top-up: $18 for 30 credits, valid 12 months.
- Web search costs 0.03 credits per request. ([credits](https://superapp.dev/docs/credits))
- **Support:** email on Pro, priority on Business; "hands-on help from the founder team".
- Fees are non-refundable. ([doc](https://superapp.dev/docs/invoices-and-refunds))
- Account deletion controls. ([doc](https://superapp.dev/docs/account-and-data))
- **Affiliate program:** 30% recurring for 12 months, 60-day cookie, capped at $150 per customer, $50 minimum payout, run on Dub. ([partners](https://superapp.dev/partners.md))
- **"AI Impact Makers" ambassador program:** 47 members in 12 countries; free credits or revenue share. ([page](https://superapp.dev/impactmakers.md))
- Free SEO tools:
  - [App development cost calculator](https://superapp.dev/app-development-cost-calculator)
  - [Publishing cost calculator](https://superapp.dev/app-publishing-cost-calculator)
  - 80+ "app like X" cost pages ([sitemap](https://superapp.dev/sitemap.xml))

---

## 7. Newly (formerly Natively.dev)

Expo; iOS and Android. It has a daily changelog.

### Input
- Screenshots and files.
- **Videos (read as frames), PDFs and zip archives** since 5 Nov 2026.
- **5 GB attachments.** ([doc](https://docs.newly.app/build/attachments-and-voice))
- The agent can open files from earlier chats.
- **Project sources:** Figma and GitHub repos attached to the project for every chat (7 Oct).
- **Use a GitHub repo** to build in, or as a reference (20 Oct).
- Branch picker on import (21 Oct).
- **Start from Lovable/GitHub** (24 Sep). ([doc](https://docs.newly.app/get-started/start-from-your-app))
- **Free designs** (4 Nov): 4 home-screen looks, or upload your own design. Removed on 6 Nov for accounts that ever had a plan.

### Agent
- **Build, Plan and Ask modes** (15 Sep). ([doc](https://docs.newly.app/build/modes))
- **Skills** ([doc](https://docs.newly.app/build/skills)):
  - Project skills and personal skills.
  - Import from GitHub.
  - `/` menu (24 Sep).
  - Built-in skills in the `/` menu, e.g. a motion skill for paywall and onboarding art (22 Oct).
- **Project memory**, plus an account-wide "What Newly should remember" note (8 Oct).
- **Scheduled sessions:** prompts can run on a schedule at most hourly (20 Oct).
- Parked chats after 15 minutes idle; **3-hour turn limit**. ([doc](https://docs.newly.app/build/sleep-and-limits))
- Undo and "Restore to here". ([doc](https://docs.newly.app/code/undo-and-restore))
- **Live preview while the agent works** (5 Nov).
- Developer mode. ([doc](https://docs.newly.app/account/settings))
- CLI (`newly`), with secrets, backups and pull.

### Preview
- Cloud iOS and Android simulators (15 Sep). ([doc](https://docs.newly.app/preview/simulators))
- **Simulator GPS location** from a map or from the agent (6 Nov).
- **Webcam injection into the simulator camera.**
- **Screen recording to MP4** (3 Nov).
- Second simulator.
- **Try on my device:** install over USB from Chrome or by QR (22 Oct).
- **APK by QR** (24 Oct).
- Builds page with downloadable past IPAs and APKs (7 Oct).

### Design
- **App icons:** generated for 0.25 credits, or uploaded; free for new apps; tailored icons since 3 Nov. ([identity](https://docs.newly.app/publish/app-identity))
- Your own logo as the icon, free (30 Sep).
- **Generated product and food photos** (30 Sep).
- Alternate app icons supported (fixed 5 Nov).

### Backend
- **Newly Backend.** ([doc](https://docs.newly.app/backend/overview))
- **dev/prod environments**, with "Deploy backend to prod" (12 Oct) and "Promote dev to main". ([doc](https://docs.newly.app/backend/production-and-secrets))
- **Database tab:** spreadsheet view, edit dev data, prod read-only (9 Nov).
- **Database backups and restore via CLI** (9 Oct). ([doc](https://docs.newly.app/backend/database-backups))
- Secrets card: the agent never sees the value (25 Sep).
- **App sign-in** with email/password, Google and Apple (bring your own credentials). ([doc](https://docs.newly.app/backend/app-sign-in))
- Supabase with Edge Functions and migrations (16 Oct).
- Firebase not supported. ([integrations](https://docs.newly.app/backend/integrations))
- **Push via OneSignal:** managed for you (23 Sep), or **your own OneSignal account** (3 Nov).
- **Newly Email** ([doc](https://docs.newly.app/backend/email)):
  - Transactional app emails.
  - **Campaigns to subscribers**, with contacts.
  - From your own domain, with automatic DNS for domains Newly runs.
- **In-app customer support** (rolling out; [doc](https://docs.newly.app/backend/customer-support)):
  - A help chat the agent adds to your app.
  - **AI answers from a knowledge base.**
  - Inbox and Feedback tabs.
- Production App AI (mentioned in the 5 Nov changelog).

### Monetization
- RevenueCat paywall card with an optional free trial (23 Sep).
- **Subscriptions tab** (28 Sep):
  - Create products in App Store Connect.
  - **Prices per country.**
  - **Languages.**
  - Review screenshot.
- Use an existing RevenueCat project (15 Oct).
- **Apple Pay, iCloud, WeatherKit and Time-Sensitive Notifications on TestFlight** (13 Oct). ([doc](https://docs.newly.app/publish/connect-apple))
- Entitlements read from `app.json`: HealthKit, NFC, Siri and others.

### Publishing
- TestFlight from chat (15 Sep). ([doc](https://docs.newly.app/publish/testflight))
- **Public TestFlight link** (24 Sep).
- Deploy tab with Google Play to production (23 Sep). ([doc](https://docs.newly.app/publish/app-store-and-google-play))
- **Google Play upload-key management** (17 Oct).
- Designed screenshots in every listing language (17 Oct).
- Review notes (7 Oct).
- Review recording and contact (8 Oct, 20 Oct).
- **Reads Apple's rejection and starts the fix** (29 Sep).
- "Write & set up my listing" (1 Nov).
- **Store reviews inbox with drafted replies and AI summary** (14 Oct).
- **Custom domains: connect, or buy .com/.uk/.ca/.us/.ai** (21 Oct, 9 Nov). ([doc](https://docs.newly.app/publish/custom-domain))

### Growth: "Marketing & analytics"
- Active users, revenue, social performance (9 Oct).
- **Store page analytics** for App Store and Google Play (14 Oct).
- **Marketing videos** (2 Oct).
- **AI presenters and voice cloning** (20 credits) (4 Nov).
- **Clay-style animated ads**; creator videos with a generated app demo (27 Oct).
- Text-wall and meme formats (20 Oct).
- **Posting to social accounts you bought** (9 Oct).
- **UGC creator hiring** (20 Oct).
- **Apple Search Ads** (24 Oct).
- **App website builder** (27 Oct).
- **User-interview "studies" (Interviews tab)**, mentioned once in the 5 Nov changelog; no doc page.

### Teams
- **Team workspaces** with Admin, Editor and Viewer roles (14 Oct). ([doc](https://docs.newly.app/account/workspaces))
- Per-project sharing. ([doc](https://docs.newly.app/code/sharing-projects))
- Organization owner/admin gates for publishing, keys and billing.
- Request access to a synced GitHub repo (4 Nov).

### Pricing and support
- **Plans** ([doc](https://docs.newly.app/billing/plans-and-top-ups)):
  - $25 / $50 / $100 / $200 / $400 / $800 / $1,600, at 4 credits per $.
  - No free plan.
  - Annual billing: −20%.
  - Plan credits expire monthly.
- **Buying credits without a plan was removed** for workspaces created from 8 Nov.
- **In-app support tickets:** synced across devices (30 Oct); "Ask support" card from the agent (7 Nov). ([doc](https://docs.newly.app/help/getting-help))
- Account deletion is recoverable for 30 days. ([doc](https://docs.newly.app/account/delete))
- Status banners for incidents (16 Oct).
- Newly for Mac exists (mentioned in the 7 Nov changelog).

---

## 8. Cabano

Native SwiftUI (iOS 27). Expo is optional.

### Input and channels
- Attachments: up to 8 files of 10 MB each.
  - **A CSV or JSON file to seed app data.**
  - An example API response to type models against.
  - ([llms-full](https://cabano.app/llms-full.txt), bundle docs "Build From Screenshots & Files")
- Plan mode. (doc "Plan Mode")
- Voice input: "Listening" state in the composer. (bundle)
- **ChatGPT app**, US only (6 Nov 2026). ([post](https://cabano.app/blog/build-iphone-apps-in-chatgpt/))
- **Slack app:** each DM thread is one app. ([slack](https://cabano.app/slack))
- **Shopify app:** builds a native storefront free (catalog, cart, Checkout Kit), then you subscribe through Shopify. Abandoned-cart push delay settings appear in the bundle. ([post](https://cabano.app/blog/mobile-app-builder-for-shopify/))

### Generation
- **SwiftUI Xcode project (XcodeGen).** Data is stored on the device by default with **SwiftData, offline**.
- **Expo/React Native also offered** ([llms-full](https://cabano.app/llms-full.txt)). The "How builds work" doc says "no React Native, no Expo", so this conflicts.
- **App icon and project name generated from the first prompt.** You can upload your own icon: square, ≥1000 px.
- **Apple Intelligence on-device:** Foundation Models for text and photos, **Image Playground**, **Writing Tools**. (bundle docs "Native iOS Apps")
- **Games on every plan, including Free:**
  - SceneKit for 3D.
  - A custom **Metal 3** 2D renderer.
  - GameplayKit AI.
  - No SpriteKit.
  - (doc "Native iOS Games")
- iPad by asking for an adaptive layout.
- Android: declined.
- **Bundle hint:** code contains an "Android Emulator" validation target, which suggests something in progress. Unconfirmed.

### Preview and repair
- **Real iOS Simulator streamed**, one device per project.
- Session torn down after about 1 hour idle.
- **Free automatic repairs:** up to 3 compile-fix attempts. A failed revision never overwrites a working one.
- **Numbered revision history.**
- (docs "Live iPhone Preview", "When a Build Fails")

### Device and backend
- **USB dev install via a macOS helper:** a private development build signed with your Apple account. (doc "Run Your App on Your iPhone")
- TestFlight internal lane.
- **Supabase:** connect your own project, or **Cabano provisions one** (name, org, region). The agent writes REST + RLS code and the SQL migrations.
- Push: you supply an APNs key, since Cabano can't create one. Simulator caveats: push, Face ID and Apple Pay.

### Monetization and publishing
- RevenueCat paywall from chat. ([post](https://cabano.app/blog/add-subscriptions-to-ios-app-no-code/))
- ASC API key: **one key covers every app on your team**; encrypted.
- Gives you exact values to paste when creating the app record.
- Publish guides, listing guide, App Review guide. ([publish](https://cabano.app/docs/publish-to-the-app-store), [listing](https://cabano.app/docs/app-store-listing), [review](https://cabano.app/docs/app-review))

### Pricing, support and legal
- **Plans** ([llms-full](https://cabano.app/llms-full.txt)):
  - Free: 100 credits, community support.
  - Pro: $20, 100 credits, email support.
  - Max: $100, 1,000 credits, **priority queue and support**.
- Credits:
  - A 10-credit reservation per turn, then actual cost.
  - **Credit packs never expire** and cost less than pay-as-you-go.
  - Repairs are free.
  - Credits and fees are non-refundable.
- **Privacy policy:** your content is not used to train models. ([privacy](https://cabano.app/privacy))
- A [security page](https://cabano.app/security) exists; JS-rendered, not readable.
- No teams.

---

## 9. Newly found vs the old catalog

These items were absent from [features-catalog.md](features-catalog.md), or listed there as "?" or "none".

| Product | Additions |
|---|---|
| Rork | - Rork Games: multiplayer and **free voice chat via TURN**, 15 Jun<br>- Video, music, voice and dialogue generation<br>- App icon generation<br>- Android emulator (0.1 cr/min)<br>- Simulator recording<br>- Rork Companion USB installer (Win/Mac)<br>- Comments, clone, Editor/Viewer roles, 7-day and 1-year invites<br>- Model effort levels<br>- Rork AI Cloud monthly cap and usage, merged into credits 30 Oct<br>- Rork Start India plan ₹649<br>- Priority chat on Max<br>- Affiliates link<br>- Converting React Native code to Swift + Kotlin<br>- Import guides for 8 builders<br>- Web custom domains: buy one, auto HTTPS |
| Vibecode | - **Launch Pass $149 with a 30-day App Store guarantee** (6 Nov)<br>- **Referral program**, 28 Sep<br>- Credits for social posts<br>- 166 templates with remix<br>- Remix wipes `.env`<br>- Mic dictation<br>- Sora/Seedance video APIs, ElevenLabs, Apple Maps, Resend, Expo push<br>- Media tab video<br>- Usage tab<br>- Feedback page<br>- MCP replaced SSH<br>- Max: 1-min support response and a live coding session<br>- Hosting keeps billing after you cancel<br>- Security page<br>- Appsmith viewer app |
| Anything | - **Fast, Discussion and Auto modes**<br>- Sleek import<br>- **Template creators sell templates for earnings**<br>- **Contra experts network**<br>- **Affiliate 30% for 1 year**<br>- Remove branding<br>- 50/150 GB storage<br>- Teams plan<br>- Full REST API with deployment rollback and org-role management<br>- Iframe embed<br>- Buying domains, domain-email guide, SEO/OG metadata<br>- Contacts, calendar, TTS, splash and fonts in the capability table<br>- App-level roles/permissions<br>- Facebook SSO blocked on iOS until Apple sign-in ships<br>- Max hackathon |
| a0.dev | - **Deep-link schemes** in `build.yaml`<br>- Push via Convex APNs + FCM<br>- `monetization.yaml` entitlements, plans and offerings<br>- Android payments unsupported<br>- New Chat<br>- 4 test paths<br>- Automatic ASC setup<br>- Bundle-only: paid AI icon credits, social-post and showcase bonus credits, auto-refill<br>- 15 use-case landing pages |
| Bitrig | - **CarPlay apps**, 27 Oct<br>- **Apple TV**, 8 Jul<br>- **Shortcuts, App Intents and Siri**, 27 May<br>- Mac, iPad and Watch apps<br>- **Listing preview**: per-language, light/dark, conflict detection, 14 Oct<br>- **Submit for review** (documented, not just claimed)<br>- Creates the app record<br>- Localized screenshot capture<br>- **Skills, /goal, steer, queue, dictation**, 10 Sep<br>- ACP agents (OpenCode, Cursor, Grok Build)<br>- Remote for iPad<br>- Mac camera into the simulator<br>- Apple beta SDKs<br>- **Education discount**<br>- **Teams & Enterprise**<br>- WWDC hackathon |
| Superapp | - **MCP server live**, with App Store name checking<br>- **App website + code-derived privacy policy**<br>- Release updates with phased release<br>- Native StoreKit paywalls<br>- Restore-purchase testing<br>- QR and USB device testing<br>- Smart/Genius modes<br>- RN→Swift and other-builder migration<br>- Local Claude Code/Codex workflow on the Mac<br>- **Teams: unlimited free collaborators, Owner/Editor/Viewer, shared pool** (waitlist)<br>- **Affiliate 30% for 12 months**<br>- **AI Impact Makers ambassador program**<br>- Selfdrive GEO via ChatGPT prompt research<br>- Canvas vs Classic UGC<br>- Vision Pro and Mac targets<br>- Cost-calculator SEO pages |
| Newly | - **Newly Email** with campaigns and contacts<br>- **In-app AI customer support** with a knowledge base<br>- **Skills**<br>- **Project memory**<br>- **Scheduled agent sessions**<br>- dev/prod environments<br>- DB backups and Database tab<br>- Own OneSignal account<br>- Simulator GPS, webcam injection, screen recording<br>- Try on my device (USB/QR)<br>- Public TestFlight link<br>- Play upload-key management<br>- Store reviews inbox<br>- **AI presenters and voice cloning**<br>- Clay ads<br>- Posting to bought social accounts<br>- **Store page analytics** for both stores<br>- Interviews tab<br>- Buying domains<br>- Team workspaces with roles<br>- In-app support tickets<br>- 3-hour turn limit<br>- 5 GB attachments<br>- Video/PDF/zip input |
| Cabano | - **Slack app**<br>- **Apple Intelligence: Image Playground, Writing Tools**<br>- **CSV/JSON data seeding**<br>- USB dev install via macOS helper<br>- App icon generated from the first prompt, or uploaded<br>- SwiftData offline by default<br>- Supabase provisioning<br>- Free 3-attempt auto-repair<br>- Non-expiring credit packs<br>- Optional Expo (contradicts another doc)<br>- Android-emulator code hint |

### Resolved "?" cells from features-part-a.md (and Cabano in part B)

| Cell | Answer | Source |
|---|---|---|
| Rork · Figma | ❌ No direct link; paste images | [FAQ](https://docs.rork.com/faq/integrations) |
| Rork · Error auto-fix | ◐ The agent runs checks and builds, and can start the simulator to test. No auto-fix loop is documented. | [agent modes](https://docs.rork.com/features/agent-modes), [credits](https://docs.rork.com/billing/credits) |
| Rork · Location / HealthKit / Widgets | ✅ Named as Swift capabilities. Widgets are Max only. | [first app](https://docs.rork.com/introduction/build-your-first-app), [plans](https://docs.rork.com/introduction/subscriptions) |
| Rork · Templates | ❌ None documented (Screenshot Studio has layout presets only) | — |
| Rork · Refund | ◐ The Purchases page lists "refunds" entries. No policy found. | [credits](https://docs.rork.com/billing/credits) |
| Vibecode · Voice | ✅ Mic dictation on the web | [doc](https://www.vibecodeapp.com/docs/getting-started/web-app) |
| Vibecode · Templates | ✅ 166 | [templates](https://www.vibecodeapp.com/templates) |
| Vibecode · Refund | ✅ Policy read: non-refundable, plus the Launch Pass guarantee | [policy](https://www.vibecodeapp.com/refund-policy) |
| Vibecode · Widgets | ❌ The "widgets" doc is about Vibecode's own app, not your app | [doc](https://www.vibecodeapp.com/docs/getting-started/home-screen-widgets) |
| Vibecode · Version history | ✅ Restore an earlier version, including via MCP | [MCP](https://www.vibecodeapp.com/docs/guides/vibecode-mcp) |
| Vibecode · Team collaboration | ❌ No docs | — |
| Vibecode · Rejection help | ◐ Rejections checklist guide only | [guide](https://www.vibecodeapp.com/docs/guides/app-store-review-guidelines) |
| Anything · HealthKit | ◐ Listed on the Expo Go page; absent from the capability table | [doc](https://www.anything.com/docs/builder/ios-app) |
| Anything · Limits | ✅ Storage 50 / 150 GB; unlimited projects and messages | [pricing](https://www.anything.com/pricing) |
| Anything · Paywall templates | ❌ None documented | — |
| a0 · Deep links | ✅ | [doc](https://docs.a0.dev/development/deep-links) |
| a0 · Camera / location | ◐ In the Expo runtime's core modules; no feature doc | [doc](https://docs.a0.dev/advanced/upgrading-your-project) |
| a0 · Version history / GitHub / Figma / voice / plan | ❌ Not documented | [docs index](https://docs.a0.dev/llms.txt) |
| Bitrig · Plan / voice / image | ✅ Plan, dictation, Figma MCP, select-to-edit | [post](https://bitrig.com/blog/plan-steer-and-dictate) |
| Bitrig · Templates / Stripe / AdMob / Analytics | ❌ Not mentioned in any of 61 posts | — |
| Bitrig · Rejection help / privacy | ❌ Not documented | — |
| Bitrig · Annual / refund | ❌ Not offered on the pricing page; cancel any time | [pricing](https://bitrig.com/pricing) |
| Superapp · Plan step | ✅ Plan approval state | [MCP](https://superapp.dev/docs/mcp-server) |
| Superapp · Location / HealthKit / widgets | ✅ | [doc](https://superapp.dev/docs/native-capabilities) |
| Superapp · AI in app | ◐ Claimed: "AI provider you choose" | [features](https://superapp.dev/features.md) |
| Superapp · Privacy | ✅ Generates the policy from the code, plus support pages | [doc](https://superapp.dev/docs/privacy-terms-and-eula) |
| Superapp · Annual | ❌ None shown; "Save 10%/50%" labels only | [pricing](https://superapp.dev/pricing.md) |
| Superapp · Teams | ◐ Waitlist | [teams](https://superapp.dev/teams.md) |
| Newly · Camera | ✅ Webcam injection in the simulator | [doc](https://docs.newly.app/preview/simulators) |
| Newly · Offline / haptics / widgets | ❌ Not documented | — |
| Newly · AI in app | ◐ "App AI" in the changelog only | [changelog](https://docs.newly.app/changelog) |
| Newly · Templates | ❌ Free designs only | — |
| Cabano · Image input | ✅ 8 files of 10 MB | [llms-full](https://cabano.app/llms-full.txt) |
| Cabano · Code export | ◐ "Real SwiftUI Xcode project you own… can export". The method is in a docs FAQ heading; the text wasn't readable. | [llms-full](https://cabano.app/llms-full.txt) |
| Cabano · Team collaboration | ❌ None | — |

---

## 10. Still unknown

- **a0.dev:**
  - Actual plan prices and credit amounts. The pricing page renders client-side, and the bundle has no prices.
  - Whether Google Play upload, GitHub sync, code view or a team plan exist.
  - Whether a refund policy exists.
- **Rork:**
  - Affiliate terms: `affilates.rork.com` was not reachable through WebFetch.
  - Annual pricing.
  - Refund policy.
  - Whether OTA updates or templates exist.
  - Rork.com/pricing renders client-side.
- **Vibecode:**
  - How the Launch Pass is bought; it appears only in the refund policy.
  - Team or collaborator features.
  - OTA updates.
- **Anything:**
  - Whether the push-notification and HealthKit status is live or "coming". The two doc pages conflict.
  - Sign in with Apple ship date.
  - No product changelog exists; `anything.com/changelog` returns 404 or 429.
- **Bitrig:** analytics, crash reporting, localization tooling beyond screenshots and listing, and the education discount size.
- **Superapp:**
  - Launch dates. No changelog found.
  - Teams plan price.
  - Whether "two-click" submission and privacy declarations are automated, versus guided.
  - Whether the ChatGPT app is live; the page renders client-side.
- **Newly:**
  - Interviews tab details.
  - App AI pricing.
  - The Newly for Mac feature set.
  - Offline support, widgets, haptics.
- **Cabano:**
  - Whether Expo builds are really offered; the two docs contradict each other.
  - The Android code path.
  - Security page contents.
  - Export method.
  - Slack app launch date.
- **All eight:**
  - Accessibility tooling beyond checklists.
  - In-app localization or i18n generation. Only listing languages (Newly, Bitrig) and Rork's "localize skill" were seen.
  - Paywall A/B testing. Nobody documents it; Rork's playbook only advises price testing.
  - SSO/SAML and SOC 2: none found for any of the eight.
  - White-label.
