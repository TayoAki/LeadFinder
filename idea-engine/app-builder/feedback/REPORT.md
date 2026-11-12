# What users say about AI mobile app builders (Nov 2026)

**Sample:** **1,351 verbatim snippets from 1,192 separate users**, mined 2026-11-12. 1,226 snippets (91%) are from the last 12 months; older ones are flagged in the data.

**Sources:**

| Source | Snippets |
|---|---|
| Reddit | 552 |
| Trustpilot | 211 |
| Community forums | 166 |
| App Store | 118 |
| X | 116 |
| YouTube | 68 |
| Google Play | 56 |
| Product Hunt | 35 |
| Hacker News | 29 |

**Method:**
- Five research agents worked from one spec (`SPEC.md`). Every quote was checked by script against the fetched text.
- Posts by companies, staff, founders and affiliates were dropped.
- A user counts once per theme (anonymous author key). Counts are in `counts.md`; the snippets are in `merged.json` and `group*.jsonl`.
- Total treg spend was about 0.95 USD.

**Coverage by competitor** (users):

| Competitor | Users | Activity status | Notes |
|---|---|---|---|
| FlutterFlow | 198 | Active | New AI-native builder launched around 2026-11-04; classic builder renamed "Studio" |
| Rork | 121 | Active | Rork Max launched Feb 2026. iOS companion app is gone from the US store. |
| Replit | 119 | Active | Expo "Mobile Apps" since Jan 2026 |
| Bubble (native mobile) | 114 | Active | Users still call it beta. Bubble says Apple ended preview apps, so BubbleGo was deprecated Sep 2026. |
| Lovable | 100 | Active | Doesn't build native apps; users wrap web apps with Capacitor or Despia |
| Bolt | 95 | Active | Expo must be chosen in the first prompt; no companion app |
| Vibecode | 85 | Active | Since Mar 2026, mobile projects open only on the web; Android app since Feb 2026 |
| Adalo | 69 | Active | "Ada" AI builder launched late Oct 2026; new CEO |
| Thunkable | 69 | Active | Thunkable AI launched Mar 2026; Lottie arrived Oct 2026 |
| Anything | 50 | Active on the web | Apple pulled its iOS app on 2026-03-31 |
| Draftbit | 36 | Active | **Rebuilt as an AI builder: mockups to compare, then Claude Code / Codex builds Expo + Supabase, with store publishing and GitHub export. The closest to our concept.** Most reviews are on Trustpilot and look incentivized. |
| a0.dev | 28 | Active but quiet | **THIN:** 16 recent snippets, mostly short Play reviews |
| Natively → Newly | 25 | Active | Rebranded around Mar 2026; reported 2M USD raise |

**Newer builders found:**
- **Native Swift:** Rork Max, Superapp, Bitrig, Nativeline, Modaal.
- **React Native / Expo:** RapidNative, bilt.me, OnSpace, Blink.new (disputed whether it builds mobile).
- **Flutter:** Darvin.dev, Dreamflow.
- **Others:** Macaly, Expo Agent.

User evidence for the newer builders is thin (1–4 users each), and most of their posts are by founders.

**The market is splitting.** The native-Swift builders get the "feels like iOS" praise, but most have no Android output and several need a Mac.

---

## A) Top 10 complaints and top 10 loved features

### Top 10 complaints (ranked by users, then severity)

| # | Complaint | Users | Quit or switched | Who it hits hardest |
|---|---|---|---|---|
| 1 | **Credits burned on the tool's own mistakes, fix loops and surprise charges** | 256 | **101** | Replit 41, Bolt 35, Rork 35, Lovable 25, Vibecode 23, FlutterFlow 21, Thunkable 21 |
| 2 | **Broken builds, crashes, lost work, regressions** | 253 | 62 | FlutterFlow 41, Bubble 36, Bolt 29, Thunkable 28, Replit 27, Adalo 26 |
| 3 | **Hit a wall once the app gets real, then left (often for Claude Code, Cursor or Codex)** | 136 | **75** | FlutterFlow 27, Bubble 25, Adalo 16, Bolt 16 |
| 4 | **Support is slow, AI-only or absent; billing disputes ignored** | 118 | 40 | FlutterFlow 23, Replit 22, Bolt 13, Anything 10 |
| 5 | **Doesn't feel native: static, laggy transitions, "feels like a website"** (plus 33 requests) | 100 | 3 | FlutterFlow 33, Bubble 14, Lovable 8 |
| 6 | **Generic "AI slop" look** | 82 | 10 | Bubble 13, Rork 11, Lovable 8, Replit 8 |
| 7 | **Edits break working features or redo the design** | 76 | 19 | FlutterFlow 17, Rork 10, Thunkable 10, Bolt 9, Replit 9 |
| 8 | **Real-device preview broken or locked away** (Expo Go, QR, companion apps pulled) | 75 | 12 | Rork 12, Thunkable 12, Bubble 11, Vibecode 10, Replit 9 |
| 9 | **App Store / Play publishing fails or gets rejected** (4.2 "just a website", 4.3 spam, IAP bugs in review) | 59 | 15 | Replit 14, Rork 12, Lovable 9 |
| 10 | **Backend, sign-in and data problems, and code lock-in** | 42 backend + 39 export | 12 + 18 | Backend: spread across 11 tools. Export: FlutterFlow 12, Rork 7, Vibecode 6. |

### Top 10 loved features

Counts are separate users whose praise matches each feature, grouped by keyword, so treat them as lower bounds. In total, 235 users praised something.

| # | Loved feature | Users | Who earns it |
|---|---|---|---|
| 1 | **Motion and visual "wow" when it lands** (animations, Dynamic Island, smooth overlays) | 46 (62 users praise motion overall) | Rork 11, FlutterFlow 9 |
| 2 | **It's a real native app, not a webview** | 37 | Replit 9, Bubble 7, Draftbit 6, Rork 4, Superapp |
| 3 | **Speed: idea to running app in minutes or hours** | 33 | Anything, Adalo, Bolt, FlutterFlow, Vibecode |
| 4 | **Guided publishing to TestFlight / App Store** (metadata filled in) | 28 (48 love publishing overall) | Replit, Lovable (via wrappers), Anything, Rork, Vibecode |
| 5 | **Non-coders can actually ship** | 25 (agents' per-tool tallies: 60+) | Vibecode, Rork, Lovable, Adalo, Newly |
| 6 | **Good-looking UI from a prompt** | 25 (43 love design overall) | Lovable, FlutterFlow, Rork, Vibecode, Anything |
| 7 | **Human support that actually fixes things** | 20 (25 overall) | Vibecode, Adalo, Draftbit |
| 8 | **Visual canvas: select and change precisely** | 16 | FlutterFlow (27 users in its own tally), Draftbit |
| 9 | **Testing on my own phone** | 14 (18 overall) | Replit (Expo Go), Vibecode (Android app), Bubble (dev builds) |
| 10 | **Backend, auth and payments set up for me; real code I own** | 14 + 12 | Lovable, Bolt, Replit, Draftbit (Supabase + code), Rork (GitHub + RevenueCat) |

---

## B) Theme tables

Severity reflects the most common outcome among users who raised the theme.

| Theme | Competitors affected (complaint users) | Users raising it (complaint / love / request) | Severity | Quotes |
|---|---|---|---|---|
| **Pricing and credits** | Replit 41, Bolt 35, Rork 35, Lovable 25, Vibecode 23, FlutterFlow 21, Thunkable 21, Anything 16, Bubble 14, Adalo 11 | 256 / 19 / 8 (101 quit) | **Deal breaker** | "The platform now burns through credits at an absurd rate, breaks previously working features when implementing new ones, then charges you more credits to fix the regressions it created." (Vibecode, [App Store](https://apps.apple.com/us/app/id6742912146), 2026-08-24) · "It just used 5 million tokens in 1 prompt, gave me the message "maximum numbers of turns reached" then reset and lost the entire work it did..." (Bolt, [Reddit](https://www.reddit.com/r/boltnewbuilders/comments/1q23777/good_job_guys_amazing_quality_oops_there_goes_5/), 2026-01-02) · "I noticed some basic issues (for example, there was no save button for creating a journal entry). I tried to fix it, but the platform prompted me to pay at that point, so I stopped there." (Rork, [Reddit](https://www.reddit.com/r/iOSProgramming/comments/1racv3n/comment/o6j0uzi/), 2026-02-21) |
| **Reliability** | FlutterFlow 41, Bubble 36, Bolt 29, Thunkable 28, Replit 27, Adalo 26, Rork 20, Vibecode 15 | 253 / 6 / – | **Deal breaker** | "After working for a full month on my app, suddenly 3 out of 4 screens disappeared and only one screen remained. All my work was gone with no warning and no way to recover it." (Thunkable, [Google Play](https://play.google.com/store/apps/details?id=com.thunkable.live), 2026-03-25) · "None of their React Native app have ever worked for me, they fail to load, the libraries are always broken and outdated…" (Bolt, [Reddit](https://www.reddit.com/r/boltnewbuilders/comments/1poz1qp/bolt_should_just_give_up_on_the_react_native_part/), 2025-12-17) · "2 times, in two week. Same its unnacceptable, when we load the app it stay on the loading page and show us that we are offline… my client are pretty disappointed" (Bubble, [forum](https://forum.bubble.io/t/curring-issue-native-app-down-again-2nd-time-affects-both-ios-and-android-including-live-app-store-build-bubblego-works-fine-this-time/398454), 2026-07-20) |
| **Deal breakers: hitting the wall and leaving** | FlutterFlow 27, Bubble 25, Adalo 16, Bolt 16, Thunkable 12, Lovable 10, Rork 9, Replit 8 | 136 / – / – (75 quit) | **Deal breaker** | "Creating a simple demo was easy enough, but once I tried to actually make the app functional and deployable, I ran into repeated coding and deployment issues that required technical knowledge to solve." (Thunkable, [Trustpilot](https://www.trustpilot.com/reviews/6a06ac5008796266be8cc329), 2026-05-15) · "I've spent way too much money lately and the agent seems to be getting stupider with every change so.... claude code for me it is" (Replit, [Reddit](https://www.reddit.com/r/replit/comments/1w3ilm3/ive_spent_thousands_building_on_replit_since_may/p72f5y6/), 2026-08-31) · "I've built a fairly complex mobile app with bubble and grew it to over 300k users. Eventually got to sold it partially because hit all kinds of bubble limitations that prevented further growth." (Bubble, [Reddit](https://www.reddit.com/r/Bubbleio/comments/1r1rguf/bubble_vs_vibe_coding/o4t5n9q/), 2026-02-11) |
| **Feature requests** | FlutterFlow 18, Bubble 17, Adalo 8, Replit 7 | 19 / 1 / 74 | Major | "I'm becoming pessimistic about the current state of mobile features. I understand that AI has become a top priority, but essential components like dropdowns and other fundamental elements are still missing." (Bubble, [forum](https://forum.bubble.io/t/monthly-community-update-december-2025/386640), 2025-12-04) · "your paywall is broken in prod ios also we need home screen widgets … and a way to share it with testers … and the undo button is a nuclear bomb rn" (Anything, [X](https://x.com/luke_pighetti/status/1993685081890722186), 2025-11-26) · "FlutterFlow with AI was something that users didn't ask for. Users wanted good UI builder." (FlutterFlow, [Reddit](https://www.reddit.com/r/FlutterFlow/comments/1u10iqj/honest_critique_of_flutterflow_in_2026_what_the/), 2026-06-09) |
| **Design quality** | Bubble 13, Rork 11, Lovable 8, Replit 8, Thunkable 7, Bolt 6, plus 20 general vibe-coded comments | 82 / 43 / 10 | Major | "In its current state I'm not touching your app because vibecoded look=lazy slop" ([Reddit](https://www.reddit.com/r/webdesign/comments/1xeor1e/wondering_what_people_think_of_my_landing_page/19rm1suij1bpe/), 2026-10-25) · "alot of the apps lately being uploaded to the appstore are AI Slop - and thus alot are being rejeccted for spam and minimum fucntionality - anybody has any expirience on how to make your bolt app's look better" (Bolt, [Reddit](https://www.reddit.com/r/boltnewbuilders/comments/1r8w64i/ios_app_builders/), 2026-02-19) · "In one weekend I completely recreated my app in Flutter code … The only issue I don't like with AI coding is it is hard to create a unique looking UI" (FlutterFlow, [Reddit](https://www.reddit.com/r/FlutterFlow/comments/1wiol33/hows_flutterflow_been_doing/), 2026-09-17) |
| **Motion and polish** | FlutterFlow 33, Bubble 14, Lovable 8, Adalo 6, Replit 4, Rork 3, plus 29 general RN/vibe-coded comments | 100 / 62 / 33 | Major | "No matter how much I tried I could never make it feel native." (Bubble, [Reddit](https://www.reddit.com/r/Bubbleio/comments/1x0y0d6/have_you_launcheddeployed_your_mobile_app/pewyt4h/), 2026-10-09) · "Since the update, all of my apps have experienced a noticeable slowdown - particularly with screen transitions." (Thunkable, [forum](https://community.thunkable.com/t/performance-slowdown-after-updating-to-thunkable-live-v530/4108013), 2025-12-02) · "when I want to implement the specific effects or motions I have in mind, I eventually hit the limits of FlutterFlow's built-in features. So I end up having to export the code" (FlutterFlow, [Reddit](https://www.reddit.com/r/FlutterFlow/comments/1rlaum5/i_want_to_level_up_from_flutterflow_whats_the/), 2026-03-05) |
| **Real-device preview** | Rork 12, Thunkable 12, Bubble 11, Vibecode 10, Replit 9, FlutterFlow 6 | 75 / 18 / – | Major | "The new update blocked my app I've spent $200 developing because "mobile projects can only be opened on the web" now - when it worked just fine in the app before." (Vibecode, [App Store](https://apps.apple.com/us/app/id6742912146), 2026-03-19) · "I was able to open my projects directly in the app or in ExpoGo. Now it's so convoluted … the links to try on TestFlight come up invalid. I deleted all apps involved." (Replit, [App Store](https://apps.apple.com/us/app/id1614022293), 2026-09-21) · "I paid used it a bit then the app stopped working, the demo in the app didn't work anymore, then the app was removed from the appstore." (Rork, [Trustpilot](https://www.trustpilot.com/reviews/6aeca9d8a3c4f1a4f121feca), 2026-11-05) |
| **Backend, auth, data** | Adalo 5, Replit 5, Rork 5, Vibecode 5, Anything 4, Bolt 4, FlutterFlow 4, Lovable 4 | 42 / 12 / – | Deal breaker when it hits | "I opened Rork yesterday and while the personal financial statement app is still there all the data is gone, including the accounts and the balances." (Rork, [Reddit](https://www.reddit.com/r/rorkstars/comments/1pqnf6d/built_an_app_data_all_went_away/), 2025-12-19) · "the builder's database tools read development, while your live app reads production. … the AI agent can't see your published app and will report things about it confidently that aren't true." (Anything, [Trustpilot](https://www.trustpilot.com/reviews/6a96c84abcb78dec77229885), 2026-09-01) · "you hit a problem putting into production. Users can't log in. AI gets into a failure loop. You contact support. Who are slow." (Replit, [Trustpilot](https://www.trustpilot.com/reviews/6ad3bd1d146373fb1f43c6a3), 2026-10-17) |
| **In-app purchases** | Bubble 8, Adalo 2, Replit 2, Rork 2, Thunkable 2 | 19 / 5 / 6 | Major (blocks revenue and review) | "I've had hundreds of people try to sign up for my app, but the subscription doest work... so they delete my app." (Replit, [Trustpilot](https://www.trustpilot.com/reviews/6a76dd9dadbbd290d7431ddf), 2026-08-08) · "Apple rejected build 1.0 (407) under Guideline 2.1(b), stating the in-app purchase products exhibited a bug: tapping "Unlock Full Access" produced no response during App Review." (Adalo, [forum](https://forum.adalo.com/t/digital-purchase-component-unresponsive-causing-app-store-rejection-guideline-2-1-b/69348), 2026-07-23) · "RevenueCat webhooks silently failing with a 100% error rate" (Lovable via Capacitor, [Reddit](https://www.reddit.com/r/vibecoding/comments/1uz3a0h/tried_shipping_my_lovable_app_to_the_app_store/), 2026-07-17) |
| **Publishing** | Replit 14, Rork 12, Lovable 9, Adalo 4, Thunkable 4, Vibecode 4 | 59 / 48 / – | **Deal breaker** | "The app is a Capacitor wrap of my React web app. Submitted to the App Store and got rejected twice now on Guideline 2.1.0 and 4.2.0" (Lovable, [Reddit](https://www.reddit.com/r/capacitor/comments/1soxc7l/lovable_app_keeps_being_rejected_im_in_need_of/), 2026-04-18) · "I submitted mine to Apple and after two months of rejection I moved to a different platform and got apps published within couple days" (Bubble, [Reddit](https://www.reddit.com/r/Bubbleio/comments/1x0y0d6/have_you_launcheddeployed_your_mobile_app/pf5jp16/), 2026-10-11) · "you will need to get approval from thunkable team that takes forever … and they will request 25% of your app revenue above the thunkable monthly subscription" (Thunkable, [Google Play](https://play.google.com/store/apps/details?id=com.thunkable.live), 2026-06-29) |
| **Code ownership / export** | FlutterFlow 12, Rork 7, Vibecode 6, Bolt 4, Replit 4 | 39 / 18 / 5 | Deal breaker (18 quit) | "Not only was 2 months of pro only enough for me to build half an app with Vibecode, I then was also told I had to pay $50 to download my code???" (Vibecode, [X](https://x.com/justBill_0/status/2024890442756563116), 2026-02-20) · "It was the combination of rapid credit consumption, inconsistent output quality, and what felt like deliberate platform lock-in." (Rork, [Trustpilot](https://www.trustpilot.com/reviews/6ae9cec4fd8443fb9b856ab2), 2026-11-03) · "the version control is the worst I had to face ever. Merging process takes literal hours and often it gets stuck." (FlutterFlow, [Trustpilot](https://www.trustpilot.com/reviews/6a302cfb45740838e3b67ec3), 2026-06-15) |
| **Iterating after the first build** | FlutterFlow 17, Rork 10, Thunkable 10, Bolt 9, Replit 9, Vibecode 6 | 76 / 9 / – | **Deal breaker** (19 quit) | "when I finally got a working version, one of my prompts completely remade the whole app from scratch all over again." (Rork, [Trustpilot](https://www.trustpilot.com/reviews/69b5e6ef521636143f10a0c0), 2026-03-15) · "the app will build enough bugs into your code with each change that it will drain your credits beyond belief." (Lovable, [App Store](https://apps.apple.com/us/app/id6757471107), 2026-09-29) · "Fix with AI just jumps back and forth, has no real memory of bug fixex" (Rork, [Trustpilot](https://www.trustpilot.com/reviews/699338c2c857b1f32ea86a87), 2026-02-16) |
| **Support and docs** | FlutterFlow 23, Replit 22, Bolt 13, Anything 10, Bubble 10 | 118 / 25 / – | Major (40 quit) | "I'VE LITERALLY SPENT $10,000 BUILDING AN APP WITH YOUR SYSTEM. IT IS NOW BROKEN, NOT WORKING!! THE PROMPT TAKES ME IN CIRCLES AND NOBODY IS RESPONDING TO EMAILS." (Anything, [Reddit](https://www.reddit.com/r/vibecoding/comments/1stuh5t/ama_im_dhruv_founder_of_anything_ask_me_anything/osb53eo/), 2026-06-18) · "I had cancelled the subscription before they charge me, but they charged me anyway and when I ask them to refund … they Ghosted me." (FlutterFlow, [Trustpilot](https://www.trustpilot.com/reviews/6a4fcb0d3f98abb60a8ce2a2), 2026-07-09) · Love: "Support didn't just send generic links … they actually jumped in, updated my packages, and fixed the issue." (Vibecode, [App Store](https://apps.apple.com/us/app/id6742912146), 2026-01-18) |
| **What users love** | — | 235 love users | — | "Had it on my phone in like an hour. And not a crappy webview. It actually felt like an app." (Replit, [Reddit](https://www.reddit.com/r/replit/comments/1slj4nc/10_years_building_web_apps_never_once_touched/), 2026-04-14) · "I love how the AI agents basically fill in all the metadata on the App Store Connect end and makes sure the app is within Apple's requirements." (Rork, [Trustpilot](https://www.trustpilot.com/reviews/6ae4992bddd91260189c002f), 2026-10-30) · "Engineering an app visually and maintaining pixel perfect precision as you iterate is something AI tools just haven't matched (yet)." (FlutterFlow, [Reddit](https://www.reddit.com/r/FlutterFlow/comments/1vaj54d/in_this_day_and_age_why_are_you_using_flutterflow/), 2026-07-31) |

---

## C) Motion and polish deep dive

**Headline:** users agree on what good motion looks like, but **no builder delivers it by default**.

**How users get there today:**
- prompting with a screen recording of a reference app;
- adding Reanimated, Lottie or haptics by hand, or through a coding agent;
- adding a haptics plugin after a Capacitor wrap;
- testing on a real phone instead of the simulator.

**Motion rarely appears in reviews.** About 20 of the 289 group-1 snippets mention it, and none of 300+ store and Trustpilot reviews do. Users judge first whether the app works and what it costs. Motion is how they judge whether it feels *real*, and the "vibe-coded look" makes people refuse to use or pay for an app.

### Who users credit

| Builder | Motion praise (users) | What works | What fails |
|---|---|---|---|
| **Rork / Rork Max** | 12 (most credited) | Native Swift output with the animation named in the prompt: [smooth scanning overlay](https://x.com/wisetechx/status/2025124114344939864), [3D character animation](https://x.com/MiruDaws/status/2116528364198801602), [combo streak animations in a game](https://x.com/KCodes7777/status/2075310143756030286) | "Every Rork app has the same UI/animations/paywalls"; choppy in the simulator, smooth on a real iPhone ([X](https://x.com/alexcooldev/status/2047378078893294020)); several posters look like affiliates |
| **FlutterFlow / Dreamflow** | 11 (benchmark, but mostly pre-Nov 2025) | Animation is a no-code setting on every widget (fade, slide, scale, shimmer, page transitions, hero), and Lottie and Rive are built-in widgets. "One of the easiest things in all honesty" ([X, video](https://x.com/i/web/status/1920838476653883680)). Dreamflow: "create animations simply by providing the before and after states" ([Product Hunt](https://www.producthunt.com/products/dreamflow/reviews)). Examples: [skeleton loaders and slide-to-confirm](https://x.com/i/web/status/1673224309408448513), [Lottie onboarding modals](https://x.com/i/web/status/1907840560708346221), [animated rating](https://x.com/i/web/status/1815394596211372113) | Default page transitions broke after an update (Feb 2026); animations in lists fire on every row; Lottie and Rive glitches (Rive vanishing on iOS); a ceiling on expressive motion: "I eventually hit the limits … So I end up having to export the code" |
| **Bubble native** | 9 | Native screen transitions, sheets that animate open and closed, list snapping; smoother after the Feb 2026 engine upgrade | No built-in animation actions, no Lottie or Rive, no haptics; gestures are tap-only; "could never make it feel native"; users pay for plugins (animation packs, skeleton loaders, swipe cards, haptics) |
| **Vibecode** | 5 (thin) | Haptics selectable in the editor: "this app has all the haptics and everything when tested" ([X](https://x.com/AdvickB/status/2010580818822152340)) | Pushback on heavy demo motion: "useless graphics cut scenes slowing down their booking process"; wants video as a motion reference |
| **Replit** | 4 | Native structure rather than animation: native navigation, swipe-back, Liquid Glass tab bar ([5-builder test with screenshots](https://www.reddit.com/r/boltnewbuilders/comments/1snh2gk/i_tested_boltnew_vs_other_ai_builders_for_mobile/)) | Re-prompted opening animations were "neither … good enough" |
| **Lovable** | 2 | Web CSS animations | "heavy animation… will feel like a wrapped site"; wrapped apps rejected under 4.2 even with haptics, Face ID and push |
| **Adalo, Thunkable** | 2 / 0 | Lottie only (Adalo); Lottie since Oct 2026 (Thunkable) | Adalo Classic is static, with "laggy and choppy navigation glitches during screen transitions"; a Thunkable update slowed transitions to 1–2 s |
| **Bolt, a0.dev, Anything, Draftbit, Newly** | 0 (mobile) | — | No user credits any of them with mobile motion |

### What "good" looks like, according to users

| # | Behaviour | Why users care (verbatim) | Who does it |
|---|---|---|---|
| 1 | **Instant press feedback on every tap** (scale or highlight plus a light haptic) | "The feel matters as much as the visuals. Instant feedback on presses, haptics and small animations all help." ([Reddit](https://www.reddit.com/r/reactnative/comments/1xpm0by/how_do_i_prevent_my_ui_from_looking_like_ai_slop/19sai49m82dj7/)) | Vibecode (haptics) |
| 2 | **Haptics on key moments, not everywhere** (with an Android fallback) | "It truly made me feel the app and feel my achievements by making heavy use of sound effects and haptic feedback." ([Reddit](https://www.reddit.com/r/iOSProgramming/comments/1qigj1t/we_often_neglect_sound_and_haptics_in_our_apps/)) · "On iPhones haptics generally feel pretty good, but on Android they are a mess." ([Reddit](https://www.reddit.com/r/expo/comments/1py8w6r/why_big_social_apps_dont_use_haptics_in_their/nwgxas2/)) | Vibecode |
| 3 | **Native navigation** (native stack, large titles, native tabs, back swipe) | "A great native app on an iPhone feels far superior to a mobile website. The gestures, the stack navigator, haptics, scrolling, native ui primitives, etc…" ([HN](https://news.ycombinator.com/item?id=45257477)) | Rork Max, Replit, Superapp |
| 4 | **Smooth transitions, verified on a real device** | "Turns out… they were right but only on simulator. … UI felt choppy." ([X](https://x.com/alexcooldev/status/2047378078893294020)) | None |
| 5 | **Interruptible shared-element transitions** (back swipe can reverse halfway) | "reversing it halfway through while keeping the shared element in place is where it starts to feel truly native." ([X](https://x.com/Talljackcv/status/2120527220863275373)) | None |
| 6 | **Animated onboarding before the paywall** (Lottie, Rive or Reanimated) | "These small details make you feel more connected to the app. For the onboarding animations, I use Lottie." ([X](https://x.com/Nishit_Dave_/status/1980625433587773662)) | None by default |
| 7 | **Celebration moments** (confetti, streaks, sound plus haptic) | See row 2 (the Duolingo quote) | Rork (games), Base44 |
| 8 | **Subtle, consistent easing (~150–250 ms springs), not flashy** | "one accent color used sparingly, and subtle motion (150-250ms ease) instead of flashy." ([Reddit](https://www.reddit.com/r/reactnative/comments/1uhtwrp/rn/oubv673/)) | None named |
| 9 | **No AI-default flourishes** (animated arrows, glows, emoji, purple gradients) | "25 reasons your app looks vibecoded 1. emojis … 14. animated arrows" ([X](https://x.com/0xCzyzu/status/2118409928238846051)) | None consistently |
| 10 | **Every state designed** (loading via skeletons, empty, error, long text, large fonts) | "Pick the one action that matters on that screen and make it obvious in all three states." ([Reddit](https://www.reddit.com/r/reactnative/comments/1xpm0by/how_do_i_prevent_my_ui_from_looking_like_ai_slop/19sc6di6w1gck/)) | FlutterFlow (older evidence) |
| 11 | **Motion that survives edits and navigation** (no doubled loops, broken swaps) | "the swap animation is bugged" ([Reddit](https://www.reddit.com/r/expo/comments/1s3d7c8/i_vibecoded_a_full_react_native_unit_currency/ocetu7n/)) | None |
| 12 | **A distinct identity taken from a reference app** | "If you don't ask it to deviate from the mean, you will get the mean every time." ([Reddit](https://www.reddit.com/r/ProductManagement/comments/1qccb1g/all_vibecoded_apps_look_the_same/nzj81a1/)) | None by default |

**React Native / Expo community bar:**
- Reanimated + Gesture Handler as the base, native stack and tabs, interruptible shared transitions, and haptics.
- Lottie for small illustrations; Skia or Rive for anything heavy ("big Lottie files slow the app").
- A pain point for developers too: "the moment i need smooth gesture-driven stuff, shared transitions, or anything beyond basic fades, everything turns into a rabbit hole of reanimated quirks, layout flashes, and testing on 3 different devices" ([Reddit](https://www.reddit.com/r/reactnative/comments/1p1ah11/anyone_else_feel_like_animations_are_the_real/)).

---

## D) Expectation checklist

| # | Expectation | Why users care (verbatim, linked) | Competitors that do it well | Our app (Yes / Partial / No / Unknown) |
|---|---|---|---|---|
| 1 | Never charge credits to fix the tool's own mistakes | "charges you more credits to fix the regressions it created" ([App Store](https://apps.apple.com/us/app/id6742912146)) | None | |
| 2 | Clear, predictable price; no surprise charges; easy cancel and refund | "they charged me anyway and when I ask them to refund … they Ghosted me" ([Trustpilot](https://www.trustpilot.com/reviews/6a4fcb0d3f98abb60a8ce2a2)) | Newly ("takes few credits") | |
| 3 | The first build actually runs (no broken libraries) | "None of their React Native app have ever worked for me" ([Reddit](https://www.reddit.com/r/boltnewbuilders/comments/1poz1qp/bolt_should_just_give_up_on_the_react_native_part/)) | Replit, Rork (when it works) | |
| 4 | Edits don't break working features or redo the design | "one of my prompts completely remade the whole app from scratch all over again" ([Trustpilot](https://www.trustpilot.com/reviews/69b5e6ef521636143f10a0c0)) | Draftbit ("followed my instructions closely when I told it what not to change"), Vibecode | |
| 5 | Never lose work: versions, rollback, undo | "All my work was gone with no warning and no way to recover it" ([Google Play](https://play.google.com/store/apps/details?id=com.thunkable.live)) | Bolt (rollback + GitHub branches) | |
| 6 | Real native feel, not a webview | "not a crappy webview. It actually felt like an app" ([Reddit](https://www.reddit.com/r/replit/comments/1slj4nc/10_years_building_web_apps_never_once_touched/)) | Replit, Rork Max, Superapp | |
| 7 | A distinct, non-generic design | "vibecoded look=lazy slop" ([Reddit](https://www.reddit.com/r/webdesign/comments/1xeor1e/wondering_what_people_think_of_my_landing_page/19rm1suij1bpe/)) | Partly Rork, Lovable (web) | |
| 8 | Motion by default: press feedback, transitions, skeletons | "Instant feedback on presses, haptics and small animations all help" ([Reddit](https://www.reddit.com/r/reactnative/comments/1xpm0by/how_do_i_prevent_my_ui_from_looking_like_ai_slop/19sai49m82dj7/)) | FlutterFlow (manual), Vibecode (haptics) | |
| 9 | Animated onboarding and paywall | "For the onboarding animations, I use Lottie" ([X](https://x.com/Nishit_Dave_/status/1980625433587773662)) | None | |
| 10 | Lottie / Rive support with states | Users asked for "Lottie or Rive instead of mp4" (group 1 data) | FlutterFlow (built-in widgets) | |
| 11 | Test on my own phone, reliably, even after updates | "The new update blocked my app I've spent $200 developing" ([App Store](https://apps.apple.com/us/app/id6742912146)) | Replit (Expo Go), Vibecode (Android), Bubble (dev builds) | |
| 12 | Backend, auth and password reset that work in production | "Users can't log in. AI gets into a failure loop." ([Trustpilot](https://www.trustpilot.com/reviews/6ad3bd1d146373fb1f43c6a3)) | Lovable, Bolt, Replit (Supabase/Express setup), Draftbit (Supabase) | |
| 13 | The data never disappears; dev vs production is clear | "all the data is gone, including the accounts and the balances" ([Reddit](https://www.reddit.com/r/rorkstars/comments/1pqnf6d/built_an_app_data_all_went_away/)) | None clearly | |
| 14 | In-app purchases that work in review and in production | "the subscription doest work... so they delete my app" ([Trustpilot](https://www.trustpilot.com/reviews/6a76dd9dadbbd290d7431ddf)) | Rork (auto-creates RevenueCat products) | |
| 15 | Store submission done for me, metadata included, and approved first time | "fill in all the metadata on the App Store Connect end" ([Trustpilot](https://www.trustpilot.com/reviews/6ae4992bddd91260189c002f)) | Rork, Replit, Anything (screenshots, Play publishing) | |
| 16 | No 4.2 / 4.3 rejections (not "just a website", not spam) | "rejected twice now on Guideline 2.1.0 and 4.2.0" ([Reddit](https://www.reddit.com/r/capacitor/comments/1soxc7l/lovable_app_keeps_being_rejected_im_in_need_of/)) | None reliably | |
| 17 | I own the code: export and GitHub included, no extra fee | "I had to pay $50 to download my code???" ([X](https://x.com/justBill_0/status/2024890442756563116)) | Draftbit, FlutterFlow (paid tier), Rork (GitHub) | |
| 18 | Precise visual edits without burning prompts | "Trying to use an AI agent to move a button uses more tokens and time than just typing in flutter flow" (FlutterFlow data) | FlutterFlow, Draftbit | |
| 19 | The AI can see the live app's errors | "the AI agent can't see your published app and will report things about it confidently that aren't true" ([Trustpilot](https://www.trustpilot.com/reviews/6a96c84abcb78dec77229885)) | None | |
| 20 | Human support that fixes things | "they actually jumped in, updated my packages, and fixed the issue" ([App Store](https://apps.apple.com/us/app/id6742912146)) | Vibecode, Adalo | |
| 21 | It keeps working when the app gets real (no wall) | "once I tried to actually make the app functional and deployable, I ran into repeated coding and deployment issues" ([Trustpilot](https://www.trustpilot.com/reviews/6a06ac5008796266be8cc329)) | Claude Code / Codex (where users go when they leave) | |
| 22 | iOS and Android (and web) from one project | "ships both web and mobile without looking like AI-generated stuff" ([Product Hunt](https://www.producthunt.com/products/anything-2/reviews)) | Anything, Replit, FlutterFlow; native-Swift tools are iOS-only | |

---

## E) Opportunities: complaints no competitor solves well

1. **"Never pay for our mistakes."**
   - The #1 complaint: 256 users, 101 quit. No competitor refunds credits for regressions it caused.
   - A pricing model that charges for *accepted* changes, or refunds failed or rolled-back builds, attacks the biggest churn driver directly.
2. **Regression-proof iteration.**
   - 76 users; 19 quit over "edits break or redo the app".
   - Your mockup-approval step can become a **design and behaviour lock**: approved screens are snapshotted, and each change is checked against them before it's applied, with one-click rollback. Draftbit is closest, but has thin evidence.
3. **Motion and native polish by default.**
   - No competitor generates press feedback, transitions, skeletons, haptics, and animated onboarding and paywalls out of the box.
   - Users currently add these by hand or with screen-recording prompts. Ship the 12 "what good looks like" behaviours as defaults (Reanimated, Gesture Handler, Lottie/Rive), restrained to 150–250 ms.
4. **A distinct design instead of "AI slop."**
   - Researching the idea plus approved mockups is a natural answer, *if* the mockups avoid the vibe-coded tells (purple gradients, emoji icons, glassy cards) and follow a reference style the user picks.
   - Apple is rejecting look-alike apps as spam (4.3), so this is also a publishing risk.
5. **"Approved first time" publishing.**
   - Guard against 4.2 (minimum functionality), 4.3 (spam) and 2.1 (broken IAP in review).
   - Run a pre-submission check that the paywall works in sandbox, metadata is complete, and screens are native.
   - 59 users complain about publishing; nobody reliably prevents rejection.
6. **Payments that work end to end.**
   - Only Rork gets credit (RevenueCat products created automatically). Subscriptions failing in production or review are a direct revenue killer.
   - Test purchase, restore and cancel flows on a real device before submission.
7. **Real-device testing that survives platform changes.**
   - Apple ended preview apps (per Bubble; Rork's, Anything's and BubbleGo's companion apps are gone), and Vibecode locked mobile projects to the web.
   - Dev builds / TestFlight automation that "just works" is now a gap, not table stakes.
8. **Production-safe backend.**
   - Data loss, login failures in production, and dev-vs-prod confusion cause deal breakers even with few users (42 complaints).
   - Clear environments, backups, and auth including password reset tested before launch.
9. **An AI that sees the live app.**
   - The agent should read production logs and crash reports instead of guessing. Nobody does this.
10. **No wall, no lock-in.**
    - 75 users quit when the app outgrew the tool, often for Claude Code, Cursor or Codex.
    - Offer free code export plus GitHub sync from day one, so the tool never traps the user.
11. **Support with a human and a time promise.**
    - 118 users complain. Vibecode and Adalo prove that responsive human support earns loyalty.

## Thin or missing evidence

- **Sparse sources:** a0.dev and Newly (and the newer builders) have little feedback. Draftbit's Trustpilot reviews look incentivized.
- **Unavailable sources:** G2 and Capterra review text was unavailable (login wall or 404), so only ratings were used.
- **Unreliable dates:** YouTube and Product Hunt dates are worked out from relative ages ("5 months ago").
- **Motion praise on X** comes partly from influencers or affiliates; these are flagged in the data.
- **Loved-feature counts** come from keyword grouping of praise snippets, so they are lower bounds.
