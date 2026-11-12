# Group 4 user feedback: Adalo, Thunkable, Bubble (native mobile)

Mined 2026-11-12 under `SPEC.md`. Data: `group4-adalo-thunkable-bubble.jsonl` (one verbatim snippet per line, ≤ 40 words, author keys are hashes). Counts below are **separate users**, not posts.

**Totals:** 309 snippets: Bubble 136, Adalo 88, Thunkable 85. 256 are from the last 12 months; the rest are flagged `older`. No competitor is THIN overall. THIN themes are marked inline.

**What is covered:** core builders plus their AI features: Adalo **Ada** (launched Oct 2026), **Thunkable AI** (Mar 2026) and the **Bubble AI** generator for mobile and web. Staff and vendor posts were excluded: Adalo CM/CEO/team, Thunkable Staff, Bubble PMs and engineers, plugin and component sellers promoting their own products, an SEO-spam account on the Thunkable forum, and Adalo/Thunkable/Bubble marketing on X and Reddit. Vendor facts appear only as context and are labelled.

**Caveats:**
- Hacker News returned nothing relevant.
- X is almost all vendor or partner promotion.
- G2 pages show ratings but no review text.
- Capterra wasn't found.
- YouTube comments are sparse.
- Independent reviewer videos had no comments, and transcripts weren't pulled.
- YouTube and Product Hunt dates are derived from relative ages ("5 months ago") and are approximate; their `notes` field says so.
- Many 5-star Adalo Trustpilot reviews thank agents by name, which suggests they were requested after a ticket.

## T6 Motion and polish: cross-product findings

**Bubble native mobile gets the most right, mostly through the platform and plugins.**
- **What it gets right:**
  - Real native views and transitions: a certified developer says "Native views and transitions give a good native feel" ([forum](https://forum.bubble.io/t/mobile-tab-bar-padding/395230)).
  - Sheets with built-in open/close animation ([X tip with demo video](https://x.com/i/web/status/1949998495064060342), older).
  - List snapping, shipped Jul 2026 and welcomed ([forum](https://forum.bubble.io/t/new-feature-list-snapping-for-horizontal-and-vertical-mobile-lists/398579)).
  - The Feb 2026 React Native new-architecture upgrade, after which users noticed "a clear improvement in both animations and interactions on iOS" ([forum](https://forum.bubble.io/t/bubble-mobile-apps-now-run-on-react-natives-new-architecture/391588)).
  - One builder said the native builder "save more time, in the animations, navigations and user exeprience" ([Reddit](https://www.reddit.com/r/Bubbleio/comments/1p8ncoz/)).
- **What it gets wrong:**
  - No first-party animation actions on mobile. Users have asked for fades, pop-ins, swipe and bounce transitions from 2024 through Oct 2026 ([1](https://forum.bubble.io/t/plans-for-animation/348426), [2](https://forum.bubble.io/t/animations-on-bubble-native-mobile/401065), [3](https://forum.bubble.io/t/creating-a-sliding-pill-effect/401237), where the user posted screenshots of a hand-built pill toggle).
  - No official Lottie/Rive ([1](https://forum.bubble.io/t/lottie-rive-animation-in-bubble-mobile/381607), [2](https://forum.bubble.io/t/lottiefiles-in-mobile-native/372981), [3](https://forum.bubble.io/t/header-visuals-html-to-bubble-mobile/390160)).
  - No haptics ([request](https://forum.bubble.io/t/suggestion-haptic-feedbacks/363027); a third-party haptics plugin appeared Nov 2026).
  - The plugin gesture handler supported only presses, not drag ([forum](https://forum.bubble.io/t/mobile-expo-sdk-57-upgrade-smoother-mobile-apps-plus-a-heads-up-for-plugin-authors/399999)).
  - White flashes between pages in BubbleGo ([forum](https://forum.bubble.io/t/transition-between-each-app-page/382792)).
  - Slow or janky lists.
  - "No matter how much I tried I could never make it feel native" ([Reddit](https://www.reddit.com/r/Bubbleio/comments/1x0y0d6/)).
  - Product Hunt reviewer: "sluggish … especially on mobile."
- **How users fill the gap:** a paid plugin market (32-animation pack, skeleton shimmer loaders, animated icons, Tinder swipe cards, snap-point bottom sheets). These are vendor posts, so they show demand but are not counted as feedback.

**Adalo:**
- **Classic is static by default.** Motion means the Lottie component.
  - Users have asked since 2020 for swipe and transition animations, on-tap animations and loading states ([1](https://forum.adalo.com/t/animation/65253), [2](https://forum.adalo.com/t/onclick-lottie-action/64942), [3](https://forum.adalo.com/t/data-loading-animation/64731)).
  - In Apr 2026 they still called navigation "very basic" and wanted "Transition animations, liquid glass" ([forum](https://forum.adalo.com/t/new-component-pin-input-now-on-the-marketplace/66210)) and frosted-glass blur (user attached a photo; [forum](https://forum.adalo.com/t/feature-request-transparent-background-blur-frosted-glass-effect-for-components/67211)).
  - iOS apps show "laggy and choppy navigation glitches during screen transitions" ([forum](https://forum.adalo.com/t/app-still-slow-and-glitchy-on-ios-after-removing-problematic-components-and-optimizing-screens/66352)).
  - An animated chart works in preview but not on device ([forum](https://forum.adalo.com/t/animated-line-graph-shows-only-dots-in-live-app-but-works-in-preview-mode/66691)).
  - Lottie files render offset ([forum, screenshot](https://forum.adalo.com/t/solved-lottie-files-keep-being-missalign-an-argentine-solution/44946)).
  - The logo-only loading screen "cheapen[s] the look" ([forum](https://forum.adalo.com/t/being-able-to-edit-the-ask-mobile-users-to-add-to-home-screen-function-to-our-liking/64171)).
- **The best-received animated Adalo app was built with custom code components.** A car-collector game ([forum](https://forum.adalo.com/t/car-gatcha-collector-game/65983)) was called "One of the coolest apps I've seen on adalo." Its author sells components, so this is not counted.
- **Ada (new, React Native code generation):** one live-app owner moving from Classic says "Things that felt heavy in my Classic app, like animations" are what she's excited about ([forum](https://forum.adalo.com/t/meet-ada-the-next-chapter-of-adalo/70442)).
  - The CPU side-by-side video is vendor content ([Reddit](https://www.reddit.com/r/Adalo/comments/1xi39tu/)), as are staff demos on Product Hunt describing "calm motion" and animated splash screens.
  - No independent user has yet shown Ada motion.

**Thunkable is THIN on motion; nobody praised it.**
- A freelancer reported that after v530 "transitions were almost instant, but now … take 1-2 seconds" ([forum](https://community.thunkable.com/t/performance-slowdown-after-updating-to-thunkable-live-v530/4108013)).
- Thunkable AI couldn't build a long-press drag gesture after 2 hours of tokens ([forum](https://community.thunkable.com/t/i-m-wasting-tokens-on-a-function/4108850)).
- Older requests for an onboarding "welcome screen … with guides and beautiful animation" ([forum](https://community.thunkable.com/t/beautiful-welcome-page-and-guide/2909594)) and a one-shot slide-in logo animation ([forum](https://community.thunkable.com/t/how-to-call-an-animation/3752364)).
- A Lottie component arrived only in v573, Oct 2026 (vendor release notes, [forum](https://community.thunkable.com/t/v572-573-574-release-notes/4108989)).

**No evidence found in any of the three products** for animated paywalls, animated onboarding generated by AI, or "looks generic" complaints about AI output beyond Bubble AI screens lacking "toggles, floating elements" and Adalo's CEO acknowledging "generic app screens".

**Implication for us:** motion is a real, unmet request at every builder in this group. Users want built-in:
- transitions between screens;
- skeleton or loading states instead of blank lists;
- gestures (swipe cards, drag, snap);
- Lottie/Rive;
- haptics;
- glass and blur effects.

Today they buy plugins or write custom components to get them. Users also judge "native feel" mostly on list performance and transition speed, not on decoration.


## Adalo

**Status: active.** Latest user feedback 2026-11-08 (Reddit), forum 2026-11-07, Trustpilot 2026-11-05. New CEO (Oct 2026), new AI builder **Ada** launched late Oct 2026 (Product Hunt 2026-11-05, 3.3/5 from 22 mostly older reviews), pricing plans changed with Ada (Nov 2026). Ada generates React Native code and adds code export and over-the-air updates (vendor claims). Adalo has **no companion/preview app** on the App Store or Google Play, so there are no store reviews. G2 page lists only 7 reviews, with no review text reachable; Capterra page not found.

**Sample:** 88 snippets from 69 separate users; 69 snippets from the last 12 months. By source: forum 44 (36 recent), Trustpilot 16 (14 recent), Reddit 15 (13 recent), Product Hunt 5 (1 recent), YouTube 5 (2 recent), X 3 (3 recent).

**Top complaints:** (1) reliability: outages, slow lists, failed builds, regressions after the React Native switch (26 users, 19 recent); (2) hitting the "Adalo wall" and slow progress, so people quit or switch (16 users; 12 dealbreakers across themes); (3) pricing and billing: price rises, charges after cancelling, published app stops working if the subscription lapses, AI help behind a paywall (11 users). **Top loves:** (1) quick human support from named agents (7 users; many 5-star Trustpilot reviews thank agents by name, likely prompted after a ticket); (2) easy for non-technical beginners (5); (3) Ada AI builder: faster and nicer than Classic (5 users, all Oct–Nov 2026, early and partly from community regulars).

| Theme | Users | Complaint | Love | Request |
|---|---|---|---|---|
| T1 What users love | 17 | 2 | 15 | 1 |
| T2 Complaints and deal breakers | 18 | 16 | 0 | 0 |
| T3 Feature requests | 9 | 2 | 0 | 8 |
| T4 Pricing and credits | 11 | 11 | 0 | 0 |
| T5 Design quality | 5 | 1 | 1 | 3 |
| T6 Motion and polish | 12 | 6 | 2 | 5 |
| T7 Reliability | 27 | 26 | 1 | 0 |
| T8 Real-device preview | 2 | 2 | 0 | 0 |
| T9 Backend, accounts, sign-in | 5 | 5 | 0 | 0 |
| T10 In-app purchases | 3 | 2 | 0 | 1 |
| T11 Publishing | 5 | 4 | 1 | 0 |
| T12 Code ownership and export | 2 | 1 | 1 | 0 |
| T13 Iterating after the first build | 5 | 3 | 1 | 0 |
| T14 Support and docs | 10 | 3 | 7 | 0 |

### T1 What users love (17 users)

Ease for non-coders and human support are the main loves. Early Ada feedback is positive but comes from a few enthusiasts.

- "As a first time, no-code builder who launched Pour Recall at 61 with no coding background, I can honestly say Adalo’s support system is the reason I didn’t give up." ([forum, 2026-10-13](https://forum.adalo.com/t/adalos-back-and-better-than-ever-before/70331))
- "Pretty solid feature, especially at no extra cost. iPhone exports, great. Android, not great." ([forum, 2026-07-11](https://forum.adalo.com/t/your-app-rejected-again-theres-a-better-way/68688))
- "Ada is very good, you guys did an amazing job." ([forum, 2026-10-28](https://forum.adalo.com/t/classic-adalo-vs-ada-a-performance-comparison/70537))

### T2 Complaints and deal breakers (18 users)

Users quit when apps grow ("Adalo wall") and after years of slow updates. Billing disputes and outages are the other reasons people leave.

- "Tried the app for 3 days, only to be met with needing upgrades to do anything." ([Trustpilot, 2026-09-02](https://www.trustpilot.com/reviews/6a97745d5d45c116ea320c20))
- "I'm certain I cancelled our subscription but 6 months later, they took over £600 from my card. There were no emails and no advance notice." ([Trustpilot, 2026-08-12](https://www.trustpilot.com/reviews/6a7c19bdf9faa8029c553ef6))
- "I hit the same Adalo wall after about a month, and switching to Glide for the data side plus a simple Firebase backend" ([Reddit, 2026-08-31](https://www.reddit.com/r/nocode/comments/1w1lp45/how_are_beginners_building_apps_with_nocode_tools/p70dsck/))

### T3 Feature requests (9 users)

Requests for modern UI: transitions, liquid glass and blur, better nav bar, layout grid and guides, dark mode in the builder, IAP in Ada.

- "I wish that the sizing, positioning, and layering of elements was easier to use for consistency." ([forum, 2026-07-30](https://forum.adalo.com/t/why-your-no-code-app-doesnt-have-to-look-like-a-no-code-app/69411))
- "It seems we can now create apps using an interactive AI interface called “Ada,” and I’m really envious that it comes with dark mode by default." ([forum, 2026-10-22](https://forum.adalo.com/t/please-id-really-like-to-be-able-to-use-dark-mode/70454))
- "I’m also curious about how in-app subscriptions and digital purchases will work in Ada. So far, I can only see the Stripe integration" ([forum, 2026-10-30](https://forum.adalo.com/t/meet-ada-the-next-chapter-of-adalo/70442))

### T4 Pricing and credits (11 users)

Complaints about price rises ("jack up the price"), charges after cancelling (£600), AI help limited on free plan, apps that stop working when the plan lapses, paid components that waste money.

- "Tried the app for 3 days, only to be met with needing upgrades to do anything." ([Trustpilot, 2026-09-02](https://www.trustpilot.com/reviews/6a97745d5d45c116ea320c20))
- "I'm certain I cancelled our subscription but 6 months later, they took over £600 from my card. There were no emails and no advance notice." ([Trustpilot, 2026-08-12](https://www.trustpilot.com/reviews/6a7c19bdf9faa8029c553ef6))
- "if you publish the app to the Apple App Store or Google Play Store and later cancel your subscription, the app stops working. In effect, it becomes unusable as a real product." ([Trustpilot, 2026-07-13](https://www.trustpilot.com/reviews/6a54105176a980630b8988e1))

### T5 Design quality (5 users)

Dated components (nav bar shadow, fixed icon set), weak form styling, and the loading screen is only a logo. The CEO admitted on Reddit that Ada had "generic app screens" and promised better visual output (vendor, not counted).

- "the nav bar is barely customizable in adalo. It doesn’t allow for imported icons and only uses Adalo’s antiquated choices. In addition, it stays shadowed, which is unfortunate, because that is also an antiquated style" ([forum, 2026-06-08](https://forum.adalo.com/t/new-component-tabbed-list-now-on-the-marketplace/66745))
- "I wish that the sizing, positioning, and layering of elements was easier to use for consistency." ([forum, 2026-07-30](https://forum.adalo.com/t/why-your-no-code-app-doesnt-have-to-look-like-a-no-code-app/69411))
- "My frustration is often needing a bit more functionality and better design for form inputs." ([forum, 2026-06-11](https://forum.adalo.com/t/form-button-custom-forms/67148))

### T6 Motion and polish (12 users)

See the motion section. Classic Adalo relies on the Lottie component. Users have asked for transitions and swipe animations since 2020 and still did in 2026. Screen transitions are choppy on iOS. Ada is said to make animations lighter (one user, vendor CPU claims).

- "I configured everything correctly and the graph works perfectly in Preview Mode, showing proper connected animated lines." ([forum, 2026-05-27](https://forum.adalo.com/t/animated-line-graph-shows-only-dots-in-live-app-but-works-in-preview-mode/66691))
- "Current problems: slow list loading laggy and choppy navigation glitches during screen transitions overall very" ([forum, 2026-04-20](https://forum.adalo.com/t/app-still-slow-and-glitchy-on-ios-after-removing-problematic-components-and-optimizing-screens/66352))
- "Transition animations, liquid glass, etc. The current version is very basic." ([forum, 2026-04-08](https://forum.adalo.com/t/new-component-pin-input-now-on-the-marketplace/66210))

### T7 Reliability (27 users)

The largest theme. Platform-wide slowdowns (Nov 2025, Feb 2026), builds failing after the React Native upgrade, crashes in published apps, Ada generation taking 46 minutes for a first prompt.

- "N'utiliser jamais adalo, une honte d'avoir mis un outil en ligne qui bug autant" ([Trustpilot, 2026-06-07](https://www.trustpilot.com/reviews/6a255fdf0a7900cdd7652a3c))
- "it takes quite a long time to build an app and edit screens. The first app I asked it to do took 46min for the first prompt." ([forum, 2026-10-28](https://forum.adalo.com/t/classic-adalo-vs-ada-a-performance-comparison/70537))
- "I have repeatedly encountered server-data warnings, unreliable building processes, inconsistent functionality, and significant delays when trying to complete tasks that should be straightforward." ([Trustpilot, 2026-11-05](https://www.trustpilot.com/reviews/6aec785a09615754a6290a20))

### T8 Real-device preview (2 users, THIN)

Preview vs device mismatch (animated chart works in preview, not on the phone). No companion app, so testing means TestFlight or the PWA.

- "I configured everything correctly and the graph works perfectly in Preview Mode, showing proper connected animated lines." ([forum, 2026-05-27](https://forum.adalo.com/t/animated-line-graph-shows-only-dots-in-live-app-but-works-in-preview-mode/66691))
- "I have recorded one video of my adalo preview (what it should do) and my iphone (what it actually does)." ([forum, 2025-12-21](https://forum.adalo.com/t/slow-app-performance-twa-many-records-in-my-tables/59866))

### T9 Backend, accounts, sign-in (5 users)

Login outages with live users, Zapier/Make and API errors, users unable to sign up during an outage.

- "if you publish the app to the Apple App Store or Google Play Store and later cancel your subscription, the app stops working. In effect, it becomes unusable as a real product." ([Trustpilot, 2026-07-13](https://www.trustpilot.com/reviews/6a54105176a980630b8988e1))
- "I’ve had issues with Make and Zapier sending emails for new orders, to the point where we abandoned the feature." ([forum, 2026-02-16](https://forum.adalo.com/t/enable-countdown-timer-to-handle-mass-updates/65672))
- "“Adalo’s API is experiencing technical issues … failed, reason: read ECONNRESET.” Major problem!!!" ([forum, 2026-02-20](https://forum.adalo.com/t/the-connection-between-zapier-and-the-adalo-api-is-interrupted-by-the-adalo-server-during-the-request/65764))

### T10 In-app purchases (3 users)

IAP goes through IAPHUB. Users report IAP start failures and an Apple rejection because the purchase button didn't respond. Ada launched with Stripe and users asked about IAP.

- "Apple rejected build 1.0 (407) under Guideline 2.1(b), stating the in-app purchase products exhibited a bug: tapping “Unlock Full Access” produced no response during App Review." ([forum, 2026-07-23](https://forum.adalo.com/t/digital-purchase-component-unresponsive-causing-app-store-rejection-guideline-2-1-b/69348))
- "Unfortunately, the issue is still the same: the IAPHUB Start component spins for about 10 seconds and then triggers my fallback error screen." ([forum, 2026-05-28](https://forum.adalo.com/t/iaphub-start-fails-on-production-build-certified-international-device-unsupported-billing-api-version-23/66677))
- "I’m also curious about how in-app subscriptions and digital purchases will work in Ada. So far, I can only see the Stripe integration" ([forum, 2026-10-30](https://forum.adalo.com/t/meet-ada-the-next-chapter-of-adalo/70442))

### T11 Publishing (5 users)

Google Play 16 KB page-size and versionCode rejections, iOS build failures. The free Publishing Studio screenshot tool was praised but crops Android screenshots.

- "Apple rejected build 1.0 (407) under Guideline 2.1(b), stating the in-app purchase products exhibited a bug: tapping “Unlock Full Access” produced no response during App Review." ([forum, 2026-07-23](https://forum.adalo.com/t/digital-purchase-component-unresponsive-causing-app-store-rejection-guideline-2-1-b/69348))
- "I’m being blocked by a new requirement. Google Play Console is stating that the app must support 16 KB memory pages for Android 15+" ([forum, 2026-05-13](https://forum.adalo.com/t/urgent-app-rejected-due-to-16kb-page-size-compatibility-android-15/66547))
- "Google Play is rejecting our new Android AAB with “version code already used.”" ([forum, 2026-01-11](https://forum.adalo.com/t/google-play-rejects-adalo-responsive-android-build-due-to-versioncode-already-used/60066))

### T12 Code ownership and export (2 users, THIN)

No code access was a long-standing complaint (Product Hunt). Ada adds code export (vendor claim); one launch-day comment welcomed it. THIN.

- "Ada seems to be thinking beyond the prototype stage. Native iOS and Android apps, built-in databases, authentication, API integrations, payments and even code export, wow!" ([Product Hunt, 2026-11-05](https://www.producthunt.com/products/adalo/launches/ada-by-adalo))
- "its pricing system and the lack of access to the underlying code significantly hinder its potential for more serious," ([Product Hunt, 2024-11-12](https://www.producthunt.com/products/adalo/reviews)) *(older)*

### T13 Iterating after the first build (5 users)

Edits break other screens (components vanish), image picker crashed after a platform toggle, Ada does not reliably follow instructions.

- "One of my biggest frustrations is that Ada does not consistently execute instructions correctly. Features that should work either fail, require repeated attempts, or do not function as expected." ([Trustpilot, 2026-11-05](https://www.trustpilot.com/reviews/6aec785a09615754a6290a20))
- "After making changes to another Products list, the components on Sellers Details disappeared." ([Reddit, 2026-10-06](https://www.reddit.com/r/Adalo/comments/1r1d8tu/ceo_of_adalo_saying_hi/pe9kk0x/))
- "days ago the form was working correctly and letting users upload any image but now both on android and iOS native it is crashing the app" ([forum, 2025-11-21](https://forum.adalo.com/t/image-picker-crashing-my-ios-native-app-when-used/59565))

### T14 Support and docs (10 users)

Split: named agents (Dilon, Shipra, Gabriel) get strong praise, but users locked out or billed wrongly say support is slow. The Academy is too slow to use in Asia.

- "Now day two of not can login on the Adalo website to work on my app." ([Trustpilot, 2026-05-28](https://www.trustpilot.com/reviews/6a1861c6ee0636fdcc7e256a))
- "slowly (in Asia). Too slow to use." ([forum, 2026-09-01](https://forum.adalo.com/t/adalo-academy-loads/69765))
- "As a first time, no-code builder who launched Pour Recall at 61 with no coding background, I can honestly say Adalo’s support system is the reason I didn’t give up." ([forum, 2026-10-13](https://forum.adalo.com/t/adalos-back-and-better-than-ever-before/70331))


## Thunkable

**Status: active.** Thunkable Live iOS updated 2026-11-10 (id1223262700, 4.07 from 326 ratings); latest Google Play review 2026-11-10; forum release notes up to v579 (Nov 2026). Thunkable AI (chat-to-app) launched 2026-03-31, Lottie component added in v573 (Oct 2026), AI store-listing helper added 2026-11-03 (vendor/third-party posts). Trustpilot: 9 reviews, mostly 1★. G2 4.4/5 (40 reviews, text not reachable). Product Hunt 3.0 (3 reviews). Reddit and X carry almost no recent user feedback. A user notes the community has "declined in community activity".

**Sample:** 85 snippets from 69 separate users; 63 snippets from the last 12 months. By source: forum 35 (31 recent), Google Play 24 (19 recent), App Store 11 (6 recent), Trustpilot 7 (4 recent), Reddit 5 (1 recent), Product Hunt 2 (1 recent), YouTube 1 (1 recent).

**Top complaints:** (1) reliability and regressions after platform updates: layouts broke with no edits, transitions slowed, crashes, lost work (28 users, 22 recent); (2) AI tokens and billing: tokens burned in fix loops, small free allowance, charges after failed cancellations, published app disabled when the plan lapses (21 users); (3) the Thunkable Live companion app is broken for new users or doesn't match the web preview (12 users). **Top loves (thin):** (1) instant on-device live preview (4 users, mostly older); (2) easy blocks and drag-and-drop for beginners and education (4); (3) the AI builds the app for you (1 recent, then ran out of tokens).

| Theme | Users | Complaint | Love | Request |
|---|---|---|---|---|
| T1 What users love | 10 | 2 | 8 | 0 |
| T2 Complaints and deal breakers | 12 | 12 | 0 | 0 |
| T3 Feature requests | 7 | 3 | 0 | 4 |
| T4 Pricing and credits | 22 | 21 | 0 | 0 |
| T5 Design quality | 7 | 7 | 0 | 0 |
| T6 Motion and polish | 5 | 2 | 0 | 2 |
| T7 Reliability | 28 | 28 | 0 | 0 |
| T8 Real-device preview | 17 | 12 | 4 | 1 |
| T9 Backend, accounts, sign-in | 1 | 1 | 0 | 0 |
| T10 In-app purchases | 2 | 2 | 0 | 0 |
| T11 Publishing | 7 | 4 | 1 | 1 |
| T12 Code ownership and export | 0 | 0 | 0 | 0 |
| T13 Iterating after the first build | 10 | 10 | 0 | 0 |
| T14 Support and docs | 10 | 8 | 2 | 0 |

### T1 What users love (10 users)

Loves are few and mostly older: instant live testing, block coding for students. One recent user liked that the AI builds the app before tokens ran out.

- "The drag-and-drop interface is easy to understand, and it makes the process of turning an idea into a working app much more accessible." ([Product Hunt, 2026-09-12](https://www.producthunt.com/products/thunkable/reviews))
- "This app is really good. I can test my app ideas on my phone right away" ([Google Play, 2026-08-23](https://play.google.com/store/apps/details?id=com.thunkable.live))
- "Useful for when I need to test apps, nice!" ([Google Play, 2025-12-01](https://play.google.com/store/apps/details?id=com.thunkable.live))

### T2 Complaints and deal breakers (12 users)

Deal breakers: lost work (whole screens disappeared, no undo), paid but couldn't ship, AI that loops, misleading marketing for non-coders.

- "I’m very disappointed with Thunkable. I switched to the FREE version and my app stopped working." ([forum, 2026-10-04](https://community.thunkable.com/t/im-very-disappointed-with-thunkable/4108997))
- "Took $499 from my account that I did not allow them to take." ([Trustpilot, 2026-05-26](https://www.trustpilot.com/reviews/6a15cbc63d839d56b1305a0a))
- "The AI troubleshooting system repeatedly sent me through circular fixes that consumed my paid credits without resolving the underlying problems." ([Trustpilot, 2026-05-15](https://www.trustpilot.com/reviews/6a06ac5008796266be8cc329))

### T3 Feature requests (7 users)

Requests to build on the phone itself, a store download option, and BLE testing on iPhone.

- "This app uses bluetooth that will connect to an arduino, so using the live test does not work for real life testing." ([forum, 2026-06-07](https://community.thunkable.com/t/download-ios-app-for-personal-testing/4108695))
- "ive tried adding images of the ski trails, but i cant seem to find a way to use the editor mode there." ([YouTube, 2026-03-12](https://www.youtube.com/watch?v=Q07PWJTnwhU))
- "I didn't found any download option in thunkable to add my game in play store." ([Google Play, 2026-05-19](https://play.google.com/store/apps/details?id=com.thunkable.live))

### T4 Pricing and credits (22 users)

The strongest Thunkable theme after reliability. Users say AI tokens run out fast (2k in 15 minutes, 20k in one night), auto-fix rewrites the whole app for 1,000 tokens, a yearly Pro plan lost its 'unlimited web apps', charges of $189 and $499 came after failed cancellations, and published apps stop working when the plan lapses.

- "I’m very disappointed with Thunkable. I switched to the FREE version and my app stopped working." ([forum, 2026-10-04](https://community.thunkable.com/t/im-very-disappointed-with-thunkable/4108997))
- "you will need to get approval from thunkable team that takes forever your subscription will end before you get the approval, and they will request 25% of your app revenue above the thunkable monthly subscription" ([Google Play, 2026-06-29](https://play.google.com/store/apps/details?id=com.thunkable.live))
- "Took $499 from my account that I did not allow them to take." ([Trustpilot, 2026-05-26](https://www.trustpilot.com/reviews/6a15cbc63d839d56b1305a0a))

### T5 Design quality (7 users)

AI-generated output was shallow (one page with a button). Layouts were squashed or cut off on devices. Complaints that the UI is hard to use.

- "their AI coding is not that good, I had to get a separate Claude subscription to fix the code and actually have the app do what I wanted it to do." ([App Store, 2026-09-28](https://apps.apple.com/us/app/id1223262700))
- "Design : some elements display well on Thunkable Web Preview, but absolutely not on devices" ([forum, 2025-12-13](https://community.thunkable.com/t/list-of-bugs-thunkable-v531-1/4108067))
- "now they put their branding every time you open the app you made. and to remove it, the pricing is INSANE." ([Trustpilot, 2022-09-30](https://www.trustpilot.com/reviews/633766b13d107cfdfccfbd6a)) *(older)*

### T6 Motion and polish (5 users)

THIN. One freelancer reported screen transitions slowing to 1–2 s after v530. The AI couldn't build a long-press drag gesture. Older requests for onboarding animation. Lottie added in v573 (vendor). No praise for motion found.

- "I’d like to be able to long press the dose and move it to a different day of the week. I’ve tried everything. Cannot get it to work. Prob spent 2 hrs wasting token" ([forum, 2026-08-10](https://community.thunkable.com/t/i-m-wasting-tokens-on-a-function/4108850))
- "Since the update, all of my apps have experienced a noticeable slowdown - particularly with screen transitions. Previously, transitions were almost instant, but now its not uncommon for transitions to take 1-2 seconds to load." ([forum, 2025-12-02](https://community.thunkable.com/t/performance-slowdown-after-updating-to-thunkable-live-v530/4108013))
- "I made an animation and want to figure out how to call it. I dont want it to be looped or anything like that. Its bassicly just a logo sliding up on the screen." ([forum, 2025-04-18](https://community.thunkable.com/t/how-to-call-an-animation/3752364)) *(older)*

### T7 Reliability (28 users)

Regressions after updates dominate (v530 slowdown, v531 button text, layouts changing with no edits, audio stops after 39 plays, BLE crashes, live app crashing on presentation day).

- "when I click step-by-step tutorials nothing happens. I click my projects. Nothing happens. I click settings. It goes to log out." ([App Store, 2026-08-09](https://apps.apple.com/us/app/id1223262700))
- "Absolutely nothing works just a screen with project and tutorial but u can’t even access them absolute trash" ([App Store, 2026-08-05](https://apps.apple.com/us/app/id1223262700))
- "shi fumbles on presentation day and crashes on the latest update" ([Google Play, 2026-11-10](https://play.google.com/store/apps/details?id=com.thunkable.live))

### T8 Real-device preview (17 users)

The Thunkable Live companion opens to a dead screen for many new users (iOS and Android, Aug–Dec 2026). The web preview differs from the device. The instant preview was loved when it worked.

- "when I click step-by-step tutorials nothing happens. I click my projects. Nothing happens. I click settings. It goes to log out." ([App Store, 2026-08-09](https://apps.apple.com/us/app/id1223262700))
- "Absolutely nothing works just a screen with project and tutorial but u can’t even access them absolute trash" ([App Store, 2026-08-05](https://apps.apple.com/us/app/id1223262700))
- "I couldn’t find the Thunkable app to code so I couldn’t use Thunkable Live" ([App Store, 2026-11-01](https://apps.apple.com/us/app/id1223262700))

### T9 Backend, accounts, sign-in (1 users, THIN)

Little evidence: AI can't load local or static data, Supabase setup questions.

- "I’m at wits end (and bottom of the tokens bucket) trying to bring tables of static data into an A.I. app." ([forum, 2026-06-16](https://community.thunkable.com/t/trying-to-bring-in-a-table-of-static-data/4108701))

### T10 In-app purchases (2 users, THIN)

RevenueCat IAP blocks missing in Drag & Drop (Mar 2026). Older complaint that IAP is 'insanely bugged'.

- "I am currently publishing to the App Store and my in-app purchase (monthly subscription) is not working." ([forum, 2026-03-17](https://community.thunkable.com/t/urgent-revenuecat-iap-blocks-missing-in-drag-drop/4108464))
- "they say they have IAP purchase as a feature but it is not true because it is insanely bugged." ([Trustpilot, 2023-01-22](https://www.trustpilot.com/reviews/63cd80639b64b1bdaf3fc471)) *(older)*

### T11 Publishing (7 users)

iOS build failures, App Unavailable error after a plan lapse, a Play reviewer says publishing approval and a revenue share request blocked them.

- "you will need to get approval from thunkable team that takes forever your subscription will end before you get the approval, and they will request 25% of your app revenue above the thunkable monthly subscription" ([Google Play, 2026-06-29](https://play.google.com/store/apps/details?id=com.thunkable.live))
- "Creating a simple demo was easy enough, but once I tried to actually make the app functional and deployable, I ran into repeated coding and deployment issues that required technical knowledge to solve." ([Trustpilot, 2026-05-15](https://www.trustpilot.com/reviews/6a06ac5008796266be8cc329))
- "it seems that my previous ERR-665275 “App Unavailable” issue was related to my Builder subscription having expired and then being reactivated." ([forum, 2026-09-16](https://community.thunkable.com/t/app-unavailable-error-in-testflight-after-adding-multi-language-suppo/4108936))

### T12 Code ownership and export (0 users, THIN)

No evidence found. THIN.


### T13 Iterating after the first build (10 users)

Edits and updates break working apps. AI auto-fix regenerates everything. Users roll back versions and lose work.

- "shi fumbles on presentation day and crashes on the latest update" ([Google Play, 2026-11-10](https://play.google.com/store/apps/details?id=com.thunkable.live))
- "After working for a full month on my app, suddenly 3 out of 4 screens disappeared and only one screen remained. All my work was gone with no warning and no way to recover it." ([Google Play, 2026-03-25](https://play.google.com/store/apps/details?id=com.thunkable.live))
- "In this case the auto-fix caused the bot to regenerate practically the entire code base, taking seven minutes to run, and burning a thousand tokens. (But it did work.)" ([forum, 2026-06-20](https://community.thunkable.com/t/to-fix-or-version-back/4108725))

### T14 Support and docs (10 users)

Engineering doesn't respond to long-running bugs. 'Customer service is non-existent' (App Store). Staff are praised as kind but slow.

- "My AI token balance has been stuck at 0% for two months. I am trying to continue building my app, SocialHub, but I cannot use the Thunkable AI tools." ([forum, 2026-10-15](https://community.thunkable.com/t/ai-tokens-stuck-at-0-for-two-months/4109026))
- "their AI coding is not that good, I had to get a separate Claude subscription to fix the code and actually have the app do what I wanted it to do." ([App Store, 2026-09-28](https://apps.apple.com/us/app/id1223262700))
- "We’re now on Day 5 of this slowdown issue, and we still haven’t received an update from engineering. This regression continues to block active client work, testing, and publishing." ([forum, 2025-12-06](https://community.thunkable.com/t/performance-slowdown-after-updating-to-thunkable-live-v530/4108013))


## Bubble

**Status: active, native mobile still described by users as beta.** Latest forum activity 2026-11-11, Trustpilot 2026-11-06. Releases in the last year (from Bubble's own posts, context only): RN new architecture (Feb 2026), IAP subscriptions beta (Feb 2026), list snapping (Jul 2026), Sign in with Apple and universal links (Aug 2026), Expo SDK 57 (Sep 2026), mobile plugin editor public beta and **BubbleGo preview app deprecated (Sep 2026)**, because Apple no longer allows preview apps, replaced by dev builds. BubbleGo is no longer in the App Store search, so there are no store reviews. Bubble AI generates mobile or web apps (Claude Sonnet 4.6 since Feb 2026), MCP/agent (Oct 2026). Product Hunt 4.8 (71 reviews), G2 166 reviews (text not reachable). Note: about a fifth of Bubble snippets are about core Bubble (pricing, AI agent, migrations), not the mobile builder specifically.

**Sample:** 136 snippets from 114 separate users; 124 snippets from the last 12 months. By source: forum 74 (65 recent), Reddit 37 (36 recent), Trustpilot 10 (10 recent), YouTube 8 (8 recent), Product Hunt 4 (4 recent), X 3 (1 recent).

**Top complaints:** (1) native-mobile reliability and performance: slow or janky lists, crashes, live-app outages, BubbleGo crashes (36 users, 34 recent); (2) missing native features: IAP (absent until Feb 2026, then buggy), plugins, dropdowns, pagination, third-party libraries, animations (30 users); (3) cost at scale (workload units, $400+/month) and leaving for AI-coded stacks (14 on cost; 7 left Bubble). **Top loves:** (1) power, control and speed of the visual builder (25 users); (2) native builder feels better than wrappers, with native transitions and smoother after the RN upgrade (9); (3) newly shipped native features welcomed (Sign in with Apple, IAP plan, list snapping, dev builds, about 5 users).

| Theme | Users | Complaint | Love | Request |
|---|---|---|---|---|
| T1 What users love | 27 | 1 | 25 | 1 |
| T2 Complaints and deal breakers | 26 | 25 | 0 | 0 |
| T3 Feature requests | 23 | 6 | 0 | 17 |
| T4 Pricing and credits | 15 | 14 | 1 | 0 |
| T5 Design quality | 15 | 13 | 0 | 1 |
| T6 Motion and polish | 28 | 14 | 9 | 8 |
| T7 Reliability | 36 | 36 | 1 | 0 |
| T8 Real-device preview | 16 | 11 | 4 | 0 |
| T9 Backend, accounts, sign-in | 4 | 3 | 1 | 1 |
| T10 In-app purchases | 11 | 8 | 1 | 3 |
| T11 Publishing | 4 | 3 | 0 | 0 |
| T12 Code ownership and export | 3 | 1 | 0 | 2 |
| T13 Iterating after the first build | 4 | 2 | 0 | 1 |
| T14 Support and docs | 12 | 10 | 2 | 0 |

### T1 What users love (27 users)

Long-time users value the control and the visual workflow. Mobile users say native feels better than BDK/Natively wrappers. The new MCP/agent excited one veteran.

- "Wow, Nick. Thanks for the update. I believe this was an update we were all eagerly awaiting." ([forum, 2026-07-23](https://forum.bubble.io/t/new-feature-list-snapping-for-horizontal-and-vertical-mobile-lists/398579))
- "Great to see Sign in with Apple land! This is one I’ve been hoping for since native mobile launched." ([forum, 2026-08-13](https://forum.bubble.io/t/mobile-update-universal-links-and-a-new-sign-in-with-apple-button/399350))
- "I also like the move to dev builds for real-device testing, since testing native features on an actual device should catch issues that a browser preview can" ([forum, 2026-09-28](https://forum.bubble.io/t/now-in-public-beta-mobile-plugin-editor-plus-important-bubblego-update/400849))

### T2 Complaints and deal breakers (26 users)

Users leave for Claude Code, Cursor, Codex or Lovable because of cost, limits and native complexity. Several say they could never make the app feel native.

- "I posted this 8 months ago, and I've since completely abandoned Bubble." ([Reddit, 2026-10-14](https://www.reddit.com/r/Bubbleio/comments/1r1rguf/bubble_vs_vibe_coding/pgrvvbq/))
- "I love Bubble I built my first app that is still running on there just fine, but I gotta be honest bubbles AI sucks." ([Reddit, 2026-09-17](https://www.reddit.com/r/Bubbleio/comments/1wj3djx/))
- "We'd launched four or five production apps on Bubble and invested a ton of time learning it over the past five years." ([Reddit, 2026-09-18](https://www.reddit.com/r/Bubbleio/comments/1wj3djx/bubble_is_not_the_future/pam3p05/))

### T3 Feature requests (23 users)

IAP, deep links, image upload, plugins and the plugin editor, dropdowns, pagination, custom libraries, Lottie/Rive, haptics, animations, liquid glass. Many users say 'we don't care about AI, give us mobile features'.

- "The third-party libraries would be a must for me to build using Bubble for native mobile." ([forum, 2026-08-25](https://forum.bubble.io/t/are-custom-libraries-supported-for-mobile-native/399661))
- "The one thing stopping me from the mobile native version is the complete lack of plugin editor, and the near total lack of documentation." ([forum, 2025-12-03](https://forum.bubble.io/t/monthly-community-update-december-2025/386640))
- "I’m becoming pessimistic about the current state of mobile features. I understand that AI has become a top priority, but essential components like dropdowns and other fundamental elements are still missing." ([forum, 2025-12-04](https://forum.bubble.io/t/monthly-community-update-december-2025/386640))

### T4 Pricing and credits (15 users)

Workload units make apps unaffordable at scale (one 300k-user app '20x more expensive'). AI credits run out. One user paid a $1,500 consultant to learn the platform.

- "I've built a fairly complex mobile app with bubble and grew it to over 300k users. Eventually got to sold it partially because hit all kinds of bubble limitations that prevented further growth." ([Reddit, 2026-02-11](https://www.reddit.com/r/Bubbleio/comments/1r1rguf/bubble_vs_vibe_coding/o4t5n9q/))
- "now that I’m paying $400+ per month and my app has been stable for the last several weeks, I decided to start to migrate to code" ([Reddit, 2026-02-18](https://www.reddit.com/r/Bubbleio/comments/1r82ut8/))
- "memnun değilim verdiğiniz Al yapay zeka kredisi hemen bitiyor işlerimi halletmiyor." ([Trustpilot, 2026-11-06](https://www.trustpilot.com/reviews/6aeddd8ccbf6c6ec4c91db69))

### T5 Design quality (15 users)

AI-generated screens lack modern patterns (toggles, floating elements). Tab bar and layout can't be customised, and Apple rejects iPad layouts. One user who moved to code said the UI looks '10X nicer'.

- "I love Bubble I built my first app that is still running on there just fine, but I gotta be honest bubbles AI sucks." ([Reddit, 2026-09-17](https://www.reddit.com/r/Bubbleio/comments/1wj3djx/))
- "we switched over and were able to convert our bubble app (not that complex yet) that we had spent a year on, in a week. The UI looks 10X nicer" ([Reddit, 2026-02-14](https://www.reddit.com/r/Bubbleio/comments/1r1rguf/bubble_vs_vibe_coding/o5a9m4l/))
- "memnun değilim verdiğiniz Al yapay zeka kredisi hemen bitiyor işlerimi halletmiyor." ([Trustpilot, 2026-11-06](https://www.trustpilot.com/reviews/6aeddd8ccbf6c6ec4c91db69))

### T6 Motion and polish (28 users)

Bubble has the most motion feedback in this group. See the motion section.

- "It functioned and was pretty buggy back then but had come a long way. No matter how much I tried I could never make it feel native." ([Reddit, 2026-10-09](https://www.reddit.com/r/Bubbleio/comments/1x0y0d6/have_you_launcheddeployed_your_mobile_app/pewyt4h/))
- "Am I the only one noticing that published Bubble mobile apps are very slow compared to other apps?" ([forum, 2026-11-02](https://forum.bubble.io/t/why-are-bubble-native-mobile-apps-so-slow/402452))
- "specifically when transitioning it from hidden to visible, where it takes up to 30 seconds to load the list. The list is only 50 items (US States)" ([forum, 2026-01-13](https://forum.bubble.io/t/selectable-list-load-times/389035))

### T7 Reliability (36 users)

Slow lists (30 s for 50 items), crashes when scrolling fast, plugin crashes after platform updates, multi-day outages of live App Store apps, Android cold start slower after the RN upgrade.

- "2 times, in two week. Same its unnacceptable, when we load the app it stay on the loading page and show us that we are offline… my client are pretty disappointed" ([forum, 2026-07-20](https://forum.bubble.io/t/curring-issue-native-app-down-again-2nd-time-affects-both-ios-and-android-including-live-app-store-build-bubblego-works-fine-this-time/398454))
- "Am I the only one noticing that published Bubble mobile apps are very slow compared to other apps?" ([forum, 2026-11-02](https://forum.bubble.io/t/why-are-bubble-native-mobile-apps-so-slow/402452))
- "I’ve been dealing with a rendering bug for almost 2 weeks now and wanted to see if anyone else has run into this or found a workaround." ([forum, 2026-09-17](https://forum.bubble.io/t/floating-groups-shifting-breaking-layout-in-bubblego-testflight-after-tab-navigation/400633))

### T8 Real-device preview (16 users)

BubbleGo crashed on Android and differed from live builds (glitched elements, login failures, white flashes). It was deprecated in Sep 2026. Dev builds were welcomed.

- "I’ve been dealing with a rendering bug for almost 2 weeks now and wanted to see if anyone else has run into this or found a workaround." ([forum, 2026-09-17](https://forum.bubble.io/t/floating-groups-shifting-breaking-layout-in-bubblego-testflight-after-tab-navigation/400633))
- "I'm running into road block after road block on mobile. The webviewer works well, but the BubbleGo previewer is horrible." ([Reddit, 2026-09-22](https://www.reddit.com/r/Bubbleio/comments/1wno0hb/))
- "I swear the bubble go app feels amazing, but then my live app is quite buggy. Its crashing everytime a new piece of data is loading in a vertical list." ([forum, 2026-02-20](https://forum.bubble.io/t/bubble-mobile-apps-now-run-on-react-natives-new-architecture/391588))

### T9 Backend, accounts, sign-in (4 users)

Sign in with Apple was praised. Gaps: account-link state, social login deep links, privacy rules that make it easy to expose data.

- "I couldn’t log out or log back in to my app and nothing was loading correctly in the app just empty states. My users have been reaching out to say they can’t use the app on mobile" ([forum, 2026-07-13](https://forum.bubble.io/t/app-completely-unusable-since-thursday-temporary-bug-alert-on-login-intermittent-offline-state-native-app-bubblego-only-editor-preview-works-fine/398204))
- "Login with a Web Browser doesn’t work for me on Bubble Go on Android, is this normal ? After logging in, the app either crashes, or redirects me to BubbleGo home screen." ([forum, 2026-02-23](https://forum.bubble.io/t/login-with-web-browser-not-working-on-bubblego-on-android/391911))
- "bubble makes it extremely easy to accidentally expose your data." ([Reddit, 2025-12-06](https://www.reddit.com/r/Bubbleio/comments/1pfj0sa/bubble_is_going_to_be_in_trouble/nsm2bxp/))

### T10 In-app purchases (11 users)

IAP was the top blocker in late 2025 (apps shipped free). The Feb 2026 beta arrived with missing restore actions, purchases not updating the user, and buggy backend events.

- "we started it on Bubble and finished with custom code" ([X, 2026-08-21](https://x.com/i/web/status/2090800795478561219))
- "I need in-app payment methods, and I do not care about AI in the slightest." ([forum, 2025-11-19](https://forum.bubble.io/t/timeline-native-mobile/385718))
- "DON’T care about AI. Give me IAP so I actually can go live with my app/company…" ([forum, 2025-11-24](https://forum.bubble.io/t/timeline-native-mobile/385718))

### T11 Publishing (4 users)

Apple rejections for the iPad layout and a two-month rejection loop that ended in a platform switch. Play Console setup is complex.

- "I submitted mine to Apple and after two months of rejection I moved to a different platform and got apps published within couple days" ([Reddit, 2026-10-11](https://www.reddit.com/r/Bubbleio/comments/1x0y0d6/have_you_launcheddeployed_your_mobile_app/pf5jp16/))
- ""Sheets" for Lists were problematic and crashed the App - had to remove and replace before deployment. The launch process in Google Play Console was.. complex, to say the least." ([Reddit, 2026-10-17](https://www.reddit.com/r/Bubbleio/comments/1x0y0d6/have_you_launcheddeployed_your_mobile_app/phaam4p/))
- "when Apple reviews the app, they also test it on iPadOS 26 , and the layout becomes stretched, crowded, or broken. Because of that, Apple rejects the app" ([forum, 2025-11-29](https://forum.bubble.io/t/how-can-i-force-my-bubble-mobile-app-to-display-in-iphone-layout-on-ipados-26/386370))

### T12 Code ownership and export (3 users)

Requests for custom code and third-party libraries in native. Users migrating out rebuild from scratch.

- "I moved to a custom build. Took 4 weeks to migrate and a few hundred users." ([Reddit, 2026-10-10](https://www.reddit.com/r/Bubbleio/comments/1x0y0d6/have_you_launcheddeployed_your_mobile_app/pf16m3d/))
- "The third-party libraries would be a must for me to build using Bubble for native mobile." ([forum, 2026-08-25](https://forum.bubble.io/t/are-custom-libraries-supported-for-mobile-native/399661))
- "fast, easy, enjoyable development of web&mobile app. However the service needs more plugins for functional freedom - e.g. you can't enable your own code inside native mobile app." ([Trustpilot, 2026-10-21](https://www.trustpilot.com/reviews/6ad87025b594de16964ebe5d))

### T13 Iterating after the first build (4 users)

SDK upgrades and platform updates break working apps. The AI agent can't edit existing apps.

- "since then I’ve been experiencing several rendering/UI issues that were not happening with the previou" ([forum, 2026-09-05](https://forum.bubble.io/t/mobile-expo-sdk-57-upgrade-smoother-mobile-apps-plus-a-heads-up-for-plugin-authors/399999))
- "This behavior is happening again. App’s crash 100% of the time if I open a sheet with a plugin element." ([forum, 2025-12-22](https://forum.bubble.io/t/unexpected-plugin-crashes-in-bubblego-after-latest-update/387161))
- "The value of the AI Agent doesn’t register if you can’t use it on an existing app." ([forum, 2026-08-05](https://forum.bubble.io/t/monthly-community-update-august-2026/399015))

### T14 Support and docs (12 users)

Support is slow on mobile bugs ('our team is small') and outages. Some praise reaching a real human within hours.

- "We’ve recently experienced repeated production outages that left our employees unable to use our app, with little urgency from support." ([Trustpilot, 2026-10-15](https://www.trustpilot.com/reviews/6ad10a79b672597af16d0a9c))
- "Expensive for what it is. Support doesn't respond within an adequate time frame. noone to get support from and BUGGY." ([Trustpilot, 2026-10-14](https://www.trustpilot.com/reviews/6acf192c64c5e83c6a405144))
- "The one thing stopping me from the mobile native version is the complete lack of plugin editor, and the near total lack of documentation." ([forum, 2025-12-03](https://forum.bubble.io/t/monthly-community-update-december-2025/386640))


## Newer AI mobile app builders found

These were mentioned by users in this group's threads. **None were verified as active beyond the mention**, because no extra fetches were spent on them.
- **Raydian** (raydian.dev): Reddit user in r/Bubbleio, Feb 2026: "Moved to Raydian.dev and it's way better than Bubble ever was or will be." ([Reddit](https://www.reddit.com/r/Bubbleio/comments/1r82ut8/)).
- **Floot**: recommended in r/nocode, Nov 2026 as "Claude/ChatGPT + Floot whcih does both websites and mobile apps" ([Reddit](https://www.reddit.com/r/nocode/comments/1xq4mr2/)).
- **Buildprint**: AI agent that builds inside Bubble. Users say "you can fully 'vibe code' a bubble app", but one questions its pricing ([Reddit](https://www.reddit.com/r/Bubbleio/comments/1wj3djx/)).
- **Vibecode**: its team member posted a disclosed reply in a beginner thread ([Reddit](https://www.reddit.com/r/nocode/comments/1xhyd6k/)). This is vendor content, not feedback.
- **AI App Publishing Academy**: compared against Adalo and FlutterFlow in r/AiAutomations, Oct 2026 (thread title only).
- **RapidNative** (rapidnative.com): has a "Bubble → App Store + Play Store" page (search result only).
- Users leaving Bubble name **Claude Code, Cursor, Codex, Lovable and Kiro** as replacements, which is the bigger competitive signal ([Reddit](https://www.reddit.com/r/Bubbleio/comments/1r1rguf/), [Reddit](https://www.reddit.com/r/Bubbleio/comments/1wj3djx/)).

## Method and spend

- **Sources:**
  - Discourse JSON search on forum.adalo.com, community.thunkable.com and forum.bubble.io (about 330 topics, free).
  - treg calls:
    - App Store and Google Play reviews (Thunkable Live; BubbleGo is delisted; Adalo has no app).
    - Reddit search and comments (24 threads).
    - Trustpilot.
    - X search.
    - YouTube search and comments (16 videos).
    - HN search.
    - Product Hunt and G2 page fetches.
- **WebSearch:** 1 call.
- **Verification:** every quote was checked by script as a verbatim substring of the fetched source text (whitespace-normalized), and forum authors were checked against staff flags.
- **treg spend:** about $0.082 (sum of `charged_micro` across 112 saved responses = $0.080, plus about $0.002 for overwritten probe calls). The cap was $0.50.
