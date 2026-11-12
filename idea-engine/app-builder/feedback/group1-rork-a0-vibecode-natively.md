# Group 1: Rork, a0.dev, Vibecode, Natively/Newly — user feedback

Collected 2026-11-12. Data file: [group1-rork-a0-vibecode-natively.jsonl](group1-rork-a0-vibecode-natively.jsonl). It holds 289 snippets.

How to read this:
- Every quote was checked by a script against the raw text that was fetched. Quotes are 40 words or fewer.
- Counts are **separate users**, not posts. Users are keyed by a salted hash of their handle.
- Posts by staff, founders and obvious ads were dropped. Those included Rork's own staff, the a0 founder's "1000 users" post, the Natively/Newly founders on X, and founders of Modaal, Macaly and Bilt.
- Borderline sources (listicles, people who keep promoting one tool) are kept, but the `notes` field says so.
- Coverage limits:
  - Hacker News comment search came back mostly as noise. Only launch threads were usable.
  - G2 has 0 reviews for Rork. Product Hunt has 0 written reviews for a0.dev, and no Vibecode or Natively pages were found.
  - Two YouTube "Rork review" videos returned no comments.
  - Capterra was not reached.

## Snippets by competitor and source

| Competitor | Reddit | App Store | Google Play | Trustpilot | X | YouTube | HN | Product Hunt | Total | Older than 12 mo | Users |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Rork | 46 | 0 (app delisted) | 0 | 42 | 22 | 0 | 2 | 5 | **117** | 9 | 110 |
| Vibecode | 11 | 50 | 11 | 5 | 3 | 1 | 0 | 0 | **81** | 0 | 79 |
| a0.dev | 3 | 0 (not in US store) | 13 | 0 (page 502) | 0 | 0 | 12 | 0 | **28** | 12 | 28 |
| Natively / Newly | 14 | 1 | 0 | 13 | 1 | 0 | 0 | 0 | **29** | 0 | 25 |
| General (motion and design, cross-tool) | 15 | – | – | – | 6 | 5 | – | – | 26 | 0 | 26 |
| Newer builders (Superapp 4, Bitrig 1, Nativeline 1, Macaly 1, Blink 1) | 8 | | | | | | | | 8 | 0 | |

**Below the 40-snippet target:**
- **a0.dev** has 28 snippets, but only 16 are from the last 12 months. The recent Play reviews are mostly short and low-detail. Treat a0 as **thin on substance**, though it is not formally under 10.
- **Natively/Newly** has 29 snippets, which is moderate. None of the four is under 10, so none is flagged THIN.

---

## Rork (rork.com, Rork Max)

**Activity: active.**
- The newest user post is Trustpilot on 2026-11-09. X posts run through 2026-11-11.
- The founder posted on X in September 2026. Rork Max (Swift) launched in February 2026.
- Rork is sponsoring a conference in November 2026.
- The companion iOS app (id 6746410361) returns 404 in the US, GB, CA, AU and DE stores. One Reddit user says it was "removed from the app store for weeks" ([2026-01-20](https://www.reddit.com/r/vibecoding/comments/1qhwvuc/rork_removed_from_the_app_store_for_weeks_now/)).
- Caution: Trustpilot shows a burst of mostly 5-star reviews from Oct 30 to Nov 9, 2026, because Rork invites reviews. Rork-affiliated creators are also very active on X.

| Theme | Separate users | Summary |
|---|---|---|
| T1 Loves | 10 love | Ease for non-coders, App Store hand-off, and fix suggestions. Max "blew me away". |
| T2 Quit / deal breakers | 9 (6 dealbreakers) | Churned to Claude Code or Cursor, or migrated off. "Hype"/"wrapper" suspicion. |
| T3 Requests | 2 | Credit rollover, and a cheaper Max tier ($50–$100). |
| **T4 Pricing / credits** | **35 complaints (15 dealbreakers)** | The top issue. Credits are burned on fix loops and on changes that don't apply (one user "tracked about 756 credits lost"). Unused credits expire each month. The $200 Max plan is a barrier. Charges continue after cancelling. |
| T5 Design | 6 love, 9 complaint | Praised for "great UI defaults". Criticised for being "too minimalistic", "Outdated components", "identical crap", and 4.3 template spam. |
| T6 Motion | 6 love, 1 complaint | See the motion section. |
| T7 Reliability | 20 | Bugs, failed builds, dependency errors from the Rork toolkit, and app data lost. |
| T8 Device preview | 12 | The QR code / Expo Go preview breaks. Builds work in Expo Go but not in TestFlight. The simulator crashes, and now costs credits. |
| T9 Backend | 5 | Data lost overnight, OAuth error 400, "lack of backend functionality". |
| T10 IAP | 1 love, 2 other | The RevenueCat auto-setup is liked. Paywalls are "very limiting". Stale RevenueCat packages break builds. |
| T11 Publishing | 5 love, 12 complaint | iOS hand-off is praised (an "AppStore skill" fills in metadata). Google Play is "like pulling my own teeth", with no .aab download. There are 4.3 spam rejections and fastlane failures. |
| T12 Code ownership | 2 love, 7 complaint | GitHub sync and export sit behind a paywall ("Not paying 20$ just to connect the codebase to github"). "Not native" is called misleading marketing. |
| T13 Iteration | 9 | Context degrades past 4–5 screens. A prompt "completely remade the whole app from scratch". The original platform was left behind when Max launched. |
| T14 Support | 8 | Slow or no replies, a support email that bounced, and no refunds. Some 5-star reviews name support staff positively. |

**Strongest quotes:**
- T4: "used all of my 130 credits building it and it was missing the bottom digits." ([Reddit 2026-09-07](https://www.reddit.com/r/vibecoding/comments/1rc5vmq/comment/p8dxi8c/))
- T4: "Just canceled my @rork subscription. "You have 58 credits to spend today." I assume that means it will reset tomorrow. Wrong. $20 gone." ([X 2026-02-19](https://x.com/mdnlabs/status/2024495929139568664))
- T4/T7: "Charged me thousands of dollars for tiny fixes. No rhyme or reason for the charges. Failed builds over and over and over again." ([Trustpilot 2026-09-07](https://www.trustpilot.com/reviews/6a9e3f3cee609a441c9cc6b1))
- T8: "When run on Testflight none of the updates are there and the version is not the same as when I run on Expo Go simulator." ([r/expo 2026-04-21](https://www.reddit.com/r/expo/comments/1srzoy8/build_sent_to_testflight_doesnt_match_version_in/))
- T8: "the QR code doesn’t work, and I can’t even open my own projects in Expo Go" ([r/rorkstars 2026-04-08](https://www.reddit.com/r/rorkstars/comments/1sfet4f/comment/oexye31/))
- T11: "for 20 apps made only one pass review by Apple team , rest are classified are 4,3 spam, using templates as rork." ([Trustpilot 2026-11-06](https://www.trustpilot.com/reviews/6aedce59acc16da34c21e68a))
- T11 (love): "the AI agents basically fill in all the metadata on the App Store Connect end and makes sure the app is within Apple’s requirements." ([Trustpilot 2026-10-30](https://www.trustpilot.com/reviews/6ae4992bddd91260189c002f))
- T12: "Not paying 20$ just to connect the codebase to github." ([r/AppBusiness 2026-02-14](https://www.reddit.com/r/AppBusiness/comments/1r4cykl/never_build_prototype_in_rork/))
- T13: "one of my prompts completely remade the whole app from scratch all over again." ([Trustpilot 2026-03-15](https://www.trustpilot.com/reviews/69b5e6ef521636143f10a0c0))
- T1: "I made a very polished app with Rork Pro and have launched it on iOS". The same user notes that the design was done in Figma by professional designers ([Reddit 2026-03-05](https://www.reddit.com/r/iOSProgramming/comments/1racv3n/comment/o8qyitg/)).

**Top 3 complaints (users):**
1. Credits and price: 35 users, 15 of them dealbreakers.
2. Reliability: 20 users.
3. Device preview and publishing: 12 users each. This covers Expo Go/QR/TestFlight mismatches, and Google Play plus 4.3 rejections.

**Top 3 loves:**
1. Easy for non-coders, with suggestions on what to add: 10 users.
2. Good-looking UI from one prompt: 6 users.
3. App Store hand-off and metadata automation: 5 users.

---

## Vibecode (vibecodeapp.com, iOS id 6742912146, Android com.vibecodeapp.app)

**Activity: active.**
- The newest App Store review is 2026-10-17 and the newest Play review is 2026-11-02. Company X posts run daily through 2026-11-11.
- The Android app launched 2026-02-28, and its first-day reviews are mostly 1-star: the app was blank, showed only a login screen, or was "a weak Expo go".
- From March 2026, mobile projects in the iOS app open only on the web.
- Of 250 App Store reviews pulled (Oct 2025 to Oct 2026), 50 were coded.
- Caution: many 5-star App Store reviews name support agents. One reviewer says staff "try to make you give them a good review in exchange to help you". Reddit users call some posts disguised ads.

| Theme | Users | Summary |
|---|---|---|
| T1 Loves | 10 | Non-coders shipping apps, model choice, the agent improving the request itself |
| T2 Quit | 6 (5 dealbreakers) | Moved to Base44, Cursor, Claude, Superapp or FlutterFlow |
| T3 Requests | 4 | A live credit counter, seeing the AI code, picking a language, video as a reference |
| **T4 Credits** | **23 (8 dealbreakers)** | Paying to fix the agent's own regressions, $50 for a small bug, no refunds after features were removed, deployment charges |
| T5 Design | 2 love, 3 complaint | "builds beautiful fully ready apps" vs. "something completely different" from an uploaded image, and "webpage design inside mobile simulator" |
| T6 Motion | 2 | See below |
| T7 Reliability | 15 | 40–60 minutes per prompt with a 50% failure rate, freezes, apps wiped |
| **T8 Device preview** | **10 complaint (4 dealbreakers), 2 love** | The March 2026 update blocked on-phone preview. Works in Vibecode but not in TestFlight. Android app empty at launch. Liked: App Clip sharing. |
| T9 Backend | 5 | TestFlight builds reset login and wipe data, user accounts don't work, exposed keys |
| T10 IAP | 1 | "impossible to actually get the paywalls to work properly" |
| T11 Publishing | 6 love, 4 complaint | From prompt to TestFlight in 20 minutes ("Expo integration is super smart"). Problems: App Store rejections, no .aab for Google Play, iOS only. |
| T12 Code ownership | 6 complaint | Downloading code needs the $50/month plan, and the code can't be retrieved once the subscription lapses |
| T13 Iteration | 6 complaint, 2 love | Breaks working features as the app grows, and you must "clear the chat history" |
| T14 Support | 6 love, 7 complaint | The most polarised theme: named, fast human help vs. 5–6 hour replies and "gaslights you" |

**Strongest quotes:**
- T4/T13: "burns through credits at an absurd rate, breaks previously working features when implementing new ones, then charges you more credits to fix the regressions it created." ([App Store 2026-08-24](https://apps.apple.com/us/app/id6742912146))
- T7: "Basic prompts average 40 minutes to an hour to complete and fail 50% of the time." ([App Store 2026-10-17](https://apps.apple.com/us/app/id6742912146))
- T8: "The new update blocked my app I’ve spent $200 developing because “mobile projects can only be opened on the web”" ([App Store 2026-03-19](https://apps.apple.com/us/app/id6742912146))
- T8: "works well when I use it in vibecode, but I upload it and test it out in apple TestFlight and half the things don’t work anymore" ([App Store 2026-02-19](https://apps.apple.com/us/app/id6742912146))
- T10/T9: "impossible to actually get the paywalls to work properly and get user accounts to work." ([Trustpilot 2026-05-06](https://www.trustpilot.com/reviews/69fb605bb16d53437b9835c3))
- T12: "you wont be able to get the generated code eventhough it consumed your credits." ([Trustpilot 2026-09-08](https://www.trustpilot.com/reviews/6aa05769754074a96a8b97d0))
- T11 love: "One prompt, about 20mins of total time from start to app deployed to TestFlight." ([App Store 2026-02-19](https://apps.apple.com/us/app/id6742912146))
- T14 love: "Support didn't just send generic links … they actually jumped in, updated my packages, and fixed the issue." ([App Store 2026-01-18](https://apps.apple.com/us/app/id6742912146))

**Top 3 complaints:**
1. Credits: 23 users, 8 of them dealbreakers.
2. Reliability: 15 users.
3. Device preview locked or broken: 10 users, 4 of them dealbreakers.

**Top 3 loves:**
1. Non-coders can ship: 10 users.
2. Human support: 6 users.
3. Fast path to TestFlight and the App Store: 6 users.

---

## a0.dev (YC W25)

**Activity: active, but quiet.**
- The newest Google Play review is 2026-11-10 (Android app dev.a0.android.app, 50K+ downloads, rating 4.55). r/a0dev's last post is 2026-07-15.
- The iOS app is not findable in the US App Store. Trustpilot returned 502 and Product Hunt has no written reviews.
- The most-upvoted 2026 Reddit success story was posted by the a0 founder and called out as an ad.
- Recent Play reviews are short. Many say "haven't tried it yet" and give 4–5 stars, and one user says the app asks for a rating on first launch. Read them as low-signal.

| Theme | Users | Summary |
|---|---|---|
| T1 Loves | 7 | "easy", "worked more than the way I expected" (short Play reviews) |
| T4 Paywall | 5 | Can't build a single app before paying $20 |
| T7/T13 Reliability and iteration | 4 | Error loops and bugs when adding features (HN, 2025, **older**) |
| T8 Preview | 2 | The Expo Go QR code won't scan (HN, older) |
| T3 Requests | 3 | Per-use pricing, zip export, Figma import |
| T6 | 2 | Users liked the builder's own live code-edit animation (HN, older) |

Quotes:
- T4: "what the hell is the point of clicking the "X" button to the planned subscription, if I don't even get the chance to make even a singular app or game." ([Play 2026-10-09](https://play.google.com/store/apps/details?id=dev.a0.android.app))
- T7: "Was testing a0 and it kept getting stuck in endless loops of errors." ([HN 2025-02-11, older](https://news.ycombinator.com/item?id=43015267))
- T3: "want to add the design to A0.DEV" (from Figma) ([r/a0dev 2026-06-24](https://www.reddit.com/r/a0dev/comments/1ue92ld/help_please/))

**Top complaints:**
1. Paywall before the first app: 5 users.
2. Error loops and broken features after the first build: 4 users, older.
3. QR/Expo preview: 2 users, older.

**Top loves:**
1. Easy for non-coders: 7 users.
2. Support: 1 user.
3. The builder's own UI animation: 2 users, older.

---

## Natively → Newly (natively.dev → newly.app)

**Activity: active.**
- It rebranded from Natively to Newly in about March 2026. A user notes "Natively is rebranding as “Newly”". X reports a $2M raise in March 2026.
- The newest Trustpilot review on newly.app is 2026-11-11. r/Newlyapp has posts through 2026-10.
- Caution: there is a Trustpilot 5-star burst for newly.app (Oct–Nov 2026). r/Natively is mostly self-promotion, with some low-detail praise posts that may be seeded. One natively.dev Trustpilot review ("not gonna help you on the interview") is about a different product and was excluded.

| Theme | Users | Summary |
|---|---|---|
| T1 Loves | 10 | Easy for first-timers. It adds useful ideas. The "think/plan" step saves credits. The September 2026 version is "simply awesome". |
| T4 Credits | 5 complaint (2 dealbreakers), 4 love | Unused prompts are lost each month, credits go on fixes that don't work, and you can't cancel ("still charged me"). Others say credits go far (15–25 per app). |
| T7 Reliability | 5 (2 dealbreakers) | "completely ignores prompts", fails simple render errors 11 times, "Slow, sluggish" |
| T9 Accounts | 2 | Sign-up error code inside the generated app, Google Calendar sync stuck |
| T14 Support | 2 complaint, 1 love | Waited days for a .pem file. Helpful on Discord. |

Quotes:
- T4: "there's no way to cancel them. I tried removing my credit card and they still charged me!" ([Trustpilot 2026-11-11](https://www.trustpilot.com/reviews/6af4aa060565d52df0a8e25c))
- T4: "you are going to lose all the prompts you didn't use... makes you distrust a bit" ([Trustpilot 2026-02-23](https://www.trustpilot.com/reviews/699c95cc7f388ace15646469))
- T7: "It fails simple render errors (I have tried fixing those same errors about 11 times)!" ([Trustpilot 2026-06-14](https://www.trustpilot.com/reviews/6a2ecdc6f49b54d953e1bdf8))
- T1: "while it wasn't perfect, it was really close and even added in some things I hadn't thought of" ([r/Newlyapp 2026-07-30](https://www.reddit.com/r/Newlyapp/comments/1vb8k2m/))

**Top complaints:**
1. Credits and billing: 5 users.
2. Reliability and ignored prompts: 5 users.
3. Accounts/sign-in: 2 users, and support speed: 2 users.

**Top loves:**
1. Easy for first-time builders: 10 users.
2. Credits go far: 4 users.
3. Plan/think mode and ideas it adds: 2 users.

---

## T6 Motion and polish: findings (extra depth)

**1. Almost nobody reviews motion directly.** Across 289 snippets, only about 20 mention animation, haptics, transitions, Lottie or Rive.
- None of the 300+ store and Trustpilot reviews for these four products mentions animation.
- Users judge a builder by whether the app works and what it costs. Motion only comes up in builder showcases and in "why does my app look vibe-coded" threads.

**2. Where users say a product gets motion right, it is mostly Rork Max (native Swift).** All of the examples below are X video posts, and several posters look like affiliates.
- "That overlay scanning animation was buttery smooth and felt like real native iOS" ([X](https://x.com/wisetechx/status/2025124114344939864)). This is a low-follower reply to a Rork creator.
- A 3D map with an animated character: "Built with ⚫️Rork including the 3D assets and character animation" ([X video](https://x.com/MiruDaws/status/2116528364198801602)).
- A Pokemon-style evolution animation ([X video](https://x.com/jacobrodri_/status/1981373022230491256)).
- A keyboard toolbar load animation ([X video](https://x.com/cameronmaciel97/status/2037946104541835485)).
- RealityKit shooting and reloading ([X video](https://x.com/giorgio_julius/status/2065524909598523497)).
- How they get it right: native SwiftUI/RealityKit output on Max, with the animation asked for by name in the prompt.
- The counterpoint: "if you’re building something with more complex UI, heavier animations… a Flutter-based option… has been working noticeably better" (r/FlutterDev, from a commenter who promotes a rival tool).

**3. Vibecode demos lean on heavy motion, and users push back.**
- Co-founder demos show 3D and cut-scene flows. A user replied: "Airlines don't need useless graphics cut scenes slowing down their booking process" ([X](https://x.com/toxoplasmag00/status/2120146870450483224)).
- One user wants video as a motion reference: "Vibecode only takes images" ([X](https://x.com/Ferreirasworld/status/2120483821166731482)).
- Superapp users praise Swift output for following "common iOS / SwiftUI conventions (navigation, spacing, controls)" and call it "much more beautiful".

**4. Cross-tool consensus on what makes an app "feel vibe-coded"** (General, 26 users):
- **Inconsistency between screens.** "One screen can look polished on its own… the experience starts to feel disconnected" ([r/vibecoding](https://www.reddit.com/r/vibecoding/comments/1x4r2cf/)). The fixes users give are a design-system file, shared components, and screenshot diffs.
- **Generic visuals.** Generic icons and fonts, AI art, badges, and the hero → 4 steps → testimonials template.
- **Missing polish passes.** "The best app builders obsess over… the transitions, the fonts, the animations" ([X](https://x.com/brentbrookler/status/2057927589680099681)).
- **Haptics as the cheapest fix.** "If your UI is decent but your app still feels flat, experiment with adding haptics" ([X](https://x.com/teddyphntm/status/2118899927786901806)). Another user says "little animations" and nav-icon haptics are what separate slop from retention ([X with video](https://x.com/0xChemistt/status/2013347663991742859)).
- **Lottie vs Rive vs Skia vs mp4.**
  - RN developers say big Lottie JSON "tanks the JS thread". Suggested alternatives are Skottie or Skia shaders ([r/reactnative](https://www.reddit.com/r/reactnative/comments/1vp300v/)).
  - On a popular Claude Code animated-app tutorial, commenters asked why it used mp4 "rather than lightweight Lottie files or Rive" and recommended Rive state machines through the Rive CLI ([YouTube](https://www.youtube.com/watch?v=Rk6t9Uq1y9M)).
- **No user praised any builder for onboarding or paywall animation.** No user named any builder that does haptics by default.

**Implication for us:** this is an open gap.
- No group-1 builder is credited with motion or haptics as a default.
- A builder that ships a consistent design system plus defaults would be the first users could point to. Those defaults are haptics on primary actions, Reanimated screen transitions, and Lottie/Rive slots for onboarding and paywall.
- Motion only helps if it is restrained: users mock cut-scene overuse.

---

## Newer AI mobile app builders found

| Tool | URL | Evidence it is real and active | User feedback |
|---|---|---|---|
| **Superapp** | superappp.com | Launched on Product Hunt 2026-01-11. Swift Forums announcement. Reddit threads Jan–Sep 2026. Native Swift, needs a Mac app and Xcode. | "Nice UI, followed common iOS / SwiftUI conventions". One user switched from Vibecode ("native iOS is so much better"). Some posts are accused of shilling. |
| **Bitrig** (YC S25) | bitrig.app | Launch HN Aug 2025 (188 points). Mac app March 2026 ([9to5Mac](https://9to5mac.com/2026/03/06/ai-powered-coding-platform-bitrig-gets-a-mac-app-for-building-iphone-apps/)). "Bitrig Now Builds iPhone Duo Apps" (HN, Sep 2026). r/swift thread Oct 2026. iOS app id 6747835910 returns 404 to our US store scraper, but is listed on non-US storefronts. | Older HN feedback: "makes it look like Apple apps so the UI can never look shit". Also: puts all code in one file, and the model is "lazy". |
| **Nativeline** | nativeline (Mac app) | r/macapps launch March 2026 (74 comments). Listed in Sep 2026 comparisons. | "I just used this to create a better note-taking app specifically built for DnD." |
| **Modaal** | modaal.dev | Founders post often on r/vibecoding (Sep–Oct 2026). Swift and Kotlin output, bring-your-own Claude/ChatGPT. | Founder content only. No independent feedback. |
| **RapidNative** | rapidnative.com | Has its own subreddit (activity through Oct 2026). A founder-run speed test against Rork and Vibecode. | Founder content only |
| **Bilt** | bilt.me | Staff disclosure post (Oct 2026). React Native with GitHub sync. | None independent |
| **OnSpace AI** | onspace.ai | iOS app 6746471538 (31 ratings, 3.16 stars). Android 100K+ downloads, 2.98 stars. | Affiliate posts only |
| **Macaly** | macaly.com | Founder replied on Reddit Aug 2026 | "Have tried Macaly a few times, it is complete GARBAGE. Lovable is way better." (web-first) |
| **Blink** (blink.new) | blink.new | Sep 2026 press release says it builds Expo apps. A competitor says it is web-only. | "Blink.new was like bro relax I got the backend too and just worked." (Nov 2025) |
| **Orchids** | orchids.app | Has an "iOS app maker" page (Swift). Mentioned on Reddit Mar 2026. | No user feedback found |
| Others seen on App/Play Store | | Appifex (46 ratings, 4.83), Kiln, LastApp "Vibecode Apps IDE" (2,564 ratings, 4.66), Primio, Snapp AI (10K+), Omni Coder, App Prompter, FreeMilk/Milq, CatDoes, X1 App Builder, Cabano, LetsDeployIt | Not mined |
| Not found / not relevant | | No evidence of a mobile builder for Kiki, Lazy, CodeWords or Same. Codeplain raised €2.6M but is not mobile. Tempo is web-first and added Expo in V2 (per a competitor). Appy Pie has an AI App Maker on Play (5M+ downloads, 3.94), but it is a template builder. Vibe Studio (Walturn, Flutter) is a separate product from "VibeStudio: AI App Maker" on iOS. | |

**Key market shift:**
- Since Rork Max (Feb 2026), the newer entrants mostly sell **native Swift** (Superapp, Bitrig, Nativeline, Modaal, Rork Max) against React Native/Expo (Vibecode, a0, Newly, RapidNative, Bilt).
- The Swift tools win the "feels like iOS" design and motion praise. They lose Android, and several need a Mac.

## Spend

The treg spend was **$0.301** (301,380 micro-USD over 229 calls), under the $0.60 cap. Each call's charge was summed from `_treg.charged_micro`. I used 4 of the 15 shared WebSearch calls.
