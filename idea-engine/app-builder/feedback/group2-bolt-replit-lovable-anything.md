# Group 2 feedback: Bolt, Replit, Lovable, Anything (mobile focus)

Pulled 2026-11-12 with treg (spend about $0.21). Snippets: `group2-bolt-replit-lovable-anything.jsonl` (402 verbatim quotes, each checked against the fetched text by script).

These four are general AI builders. Snippets are kept only when they are about mobile apps or about themes that apply to both web and mobile (credits, reliability, iteration, support, export, backend). The `notes` field says "web" when a snippet is clearly about a web project. Staff replies were dropped. Bolt and Replit staff (u/ReplitSupport-style accounts, Bolt community managers who write "we") are active in their subreddits and were filtered out.

## At a glance

| | Bolt | Replit | Lovable | Anything |
|---|---|---|---|---|
| Active? | Yes | Yes | Yes | Yes, but the iOS app was pulled from the App Store |
| Native mobile output | Expo, chosen in the first prompt | Expo / React Native "Mobile app" project type | None: web only, users wrap with Capacitor, Despia, median or a PWA | Expo (web + mobile) |
| Snippets (distinct authors) | 102 (95) | 135 (116) | 108 (95) | 57 (50) |
| #1 complaint (users) | Tokens burned on its own errors (T4: 42 users) | Billing surprises and charges (T4: 49 users) | Credits drain (T4: 28 users) | Credits drained by failed fixes (T4: 19 users) |
| #1 love (users) | Speed to a running app (T1: 22) | Expo Go + guided App Store publish (T1: 35, T11 love: 10) | Easy, good-looking web UI (T1: 31) | Web + mobile in one, store tooling (T1: 22) |
| Motion / polish (T6 users) | 2 (thin, web only) | 7 | 13 (mostly about Capacitor's "web wrapper feel") | 2 (thin) |
| THIN flag | No | No | No | No overall (57 snippets), but most themes have under 5 users and 18 snippets are X posts, some incentivised |


## Bolt

**Active:** yes. The newest Trustpilot review is from 2026-11-11, and r/boltnewbuilders has posts and staff replies up to 2026-11-11. Bolt has no companion app in the US App Store or Google Play (store search, 2026-11-12). Mobile = Expo projects; per a six-builder test, you must say "Expo app" in the first prompt because "web projects don't convert cleanly later".

**Sample:** Trustpilot 60 newest reviews (2026-03-05 → 2026-11-11; 216 total, 2.1★ per earlier research; one ride-hailing review excluded; an Oct 22–23 burst of 5★ reviews is likely solicited and flagged in notes). Reddit: about 25 threads with comments (r/boltnewbuilders, r/nocode, r/vibecoding, r/expo). Product Hunt reviews page (47 reviews, 4.4). X, HN. G2 shows 95 reviews, but the text is behind a login, so no G2 snippets.

**Mobile-specific evidence is thin.** About 15 snippets are about Expo/React Native. They are mostly negative: "Bolt should just give up on the React Native part", the browser preview doesn't work for RN, and APKs need Metro to run. One user picked Bolt for mobile after trying Rork, Nowa, Dreamflow and Blink.


**Snippets:** 102 from 95 distinct authors (7 older than 12 months). By source: reddit 58, trustpilot 27, producthunt 8, x 5, hn 4.

| Theme | Users | Love | Complaint | Request/neutral | Deal-breakers | Summary |
|---|---|---|---|---|---|---|
| T1 What users love | 22 | 18 | 0 | 4 | 0 | Speed from prompt to a running app, one browser tab, easy hosting/DB; a few long-term users have a stable workflow (often scripting Bolt prompts with Claude Code). |
| T2 Complaints / deal breakers | 17 | 0 | 16 | 1 | 13 | Quits are driven by token burn plus errors on anything past a landing page or MVP; several switched to Claude Code, Cursor, Antigravity or Google AI Studio. |
| T3 Feature requests | 2 (thin) | 0 | 0 | 2 | 0 | Very few requests: per-project notes; refund tokens on undo. |
| T4 Pricing and credits | 42 | 2 | 35 | 5 | 19 | The dominant theme. Tokens spent on the AI fixing its own errors, 1M+ tokens per prompt on grown projects, tokens that expire after two months, top-ups removed. |
| T5 Design quality | 11 | 3 | 6 | 2 | 0 | Mixed: a minority love the visual/interactive quality; others call output cramped or template-like ("looks exactly like a bolt.new or lovable template"). |
| T6 Motion and polish | 2 (thin) | 2 | 0 | 0 | 0 | Thin. Two users praise animations (one older X post, one Reddit post about "visual / interactive elements"); all about web output, none about mobile. |
| T7 Reliability | 31 | 0 | 29 | 2 | 11 | Crashes losing work, "maximum numbers of turns reached", code wiped on refresh, endless fix loops. |
| T8 Real-device preview/testing | 8 | 1 | 5 | 2 | 1 | Mobile: the browser preview does not work for React Native/Expo; users test via APK builds; Expo APKs that need Metro to run. |
| T9 Backend, auth, data | 6 | 2 | 4 | 0 | 2 | RLS/database permission breakage, failing sign-up flows, auth that is not secure for production. |
| T10 IAP / subscriptions | 0 (none found) | 0 | 0 | 0 | 0 | No snippets found. |
| T11 Publishing to stores | 7 | 2 | 3 | 2 | 0 | A few shipped Bolt/Expo apps (mostly older posts); others say Bolt leaves you "high and dry" at App Store time and AI-slop rejections. |
| T12 Code ownership / export | 10 | 2 | 4 | 4 | 3 | GitHub sync loops and preview-vs-export mismatches; export does work well enough that several moved out (Antigravity, StackBlitz + Cursor). |
| T13 Iterating after first build | 10 | 1 | 9 | 0 | 1 | Regressions on 15k+ LOC projects; fixes reintroduce old bugs; features disappear a week later. |
| T14 Support and docs | 16 | 2 | 13 | 1 | 7 | Slow (weeks to a month) or no replies; a minority report fast token refunds. |

**T1 What users love**
- "my current and largest one I'm building has 33 tables, edge functions, user Auth, file storage, AI. It's a mobile app that has support for ios, Android, tablet and full web all at once." ([reddit, 2025-12-01](https://www.reddit.com/r/boltnewbuilders/comments/1pabqt5/i_started_using_boltnew_a_week_ago_and_almost/nrnury3/)) (mobile)
- "Bolt is the one I picked to build my mobile app after trying out a bunch of other ones (Rork, Nowa, Dreamflow, Blink). … Token limit on the free plan is a joke." ([reddit, 2025-11-15](https://www.reddit.com/r/boltnewbuilders/comments/1oxlgwp/can_i_build_mobile_app_on_boltnew/noznx9l/)) (mobile)
- "Protect your tokens with version control. Bolt provides generous token usage, but you should still leverage the rollback tab function and GitHub branches." ([trustpilot, 2026-10-22](https://www.trustpilot.com/reviews/6ada837310f2b51e85c8d8e4)) (part of Oct 22-23 5-star burst; possibly solicited)

**T2 Complaints / deal breakers**
- "None of their React Native app have ever worked for me, they fail to load, the libraries are always broken and outdated and good luck seeing the preview until you export and solve a thousand bugs." ([reddit, 2025-12-17](https://www.reddit.com/r/boltnewbuilders/comments/1poz1qp/bolt_should_just_give_up_on_the_react_native_part/)) (mobile; regrets subscription)
- "I spent approximately $800 in about four days trying to build a fully functional 3D video game. … Then things got even worse. My game disappeared." ([trustpilot, 2026-11-11](https://www.trustpilot.com/reviews/6af3e0fcdab5716ce958255e)) (web game)
- "I also just can't justify going back to someone that I was paying that had such a poor response time and broken product." ([reddit, 2026-11-11](https://www.reddit.com/r/boltnewbuilders/comments/1vepq7z/stopped_using_bolt/19sgsr2p66hk0/)) (replied to staff win-back)

**T3 Feature requests**
- "It would be great to have a notes section for each project, where you can save ideas, reminders, important details, or prompts related to that specific project." ([reddit, 2026-10-14](https://www.reddit.com/r/boltnewbuilders/comments/1x5qma9/feature_suggestion_notes_for_each_project_in/)) (enjoys platform, built several apps)
- "I wonder if the "undo" aspect should also undo the tokens used?" ([producthunt, unknown](https://www.producthunt.com/products/bolt-new/reviews)) (PH)

**T4 Pricing and credits**
- "I bought a Bolt subscription mainly for React Native development and heavily regret it now." ([reddit, 2025-12-17](https://www.reddit.com/r/boltnewbuilders/comments/1poz1qp/bolt_should_just_give_up_on_the_react_native_part/)) (mobile)
- "I spent approximately $800 in about four days trying to build a fully functional 3D video game. … Then things got even worse. My game disappeared." ([trustpilot, 2026-11-11](https://www.trustpilot.com/reviews/6af3e0fcdab5716ce958255e)) (web game)
- "If you have a backend API server, the system is not able to connect to it. So I wasted my tokens for the month just arguing with the agent … No refunds, no help." ([trustpilot, 2026-09-25](https://www.trustpilot.com/reviews/6ab666f66b2a17392d08f563)) (web)

**T5 Design quality**
- "alot of the apps lately being uploaded to the appstore are AI Slop - and thus alot are being rejeccted for spam and minimum fucntionality - anybody has any expirience on how to make your bolt app's look better" ([reddit, 2026-02-19](https://www.reddit.com/r/boltnewbuilders/comments/1r8w64i/ios_app_builders/)) (mobile)
- "The one thing I really like about bolt and the thing that is really important to my product vision is the quality of visual / interactive elements of the platform." ([reddit, 2026-08-27](https://www.reddit.com/r/vibecoding/comments/1w08v66/thoughts_on_boltnew_should_i_go_a_new_route/)) (web SaaS)
- "I was focused on the designs and behaviors more than the code details, which was awesome." ([reddit, 2026-08-27](https://www.reddit.com/r/vibecoding/comments/1w08v66/thoughts_on_boltnew_should_i_go_a_new_route/p6ba62d/)) (engineer; web UI)

**T6 Motion and polish**
- "The one thing I really like about bolt and the thing that is really important to my product vision is the quality of visual / interactive elements of the platform." ([reddit, 2026-08-27](https://www.reddit.com/r/vibecoding/comments/1w08v66/thoughts_on_boltnew_should_i_go_a_new_route/)) (web SaaS)
- "Made a simple app "Digital Mood Ring". Pretty impressive to see the animations, background images and other cool stuff!" ([x, 2025-04-24](https://x.com/sergiogonai/status/1915413697201086732)) (older (2025-04); new Bolt design)

**T7 Reliability**
- "None of their React Native app have ever worked for me, they fail to load, the libraries are always broken and outdated and good luck seeing the preview until you export and solve a thousand bugs." ([reddit, 2025-12-17](https://www.reddit.com/r/boltnewbuilders/comments/1poz1qp/bolt_should_just_give_up_on_the_react_native_part/)) (mobile; regrets subscription)
- "I spent approximately $800 in about four days trying to build a fully functional 3D video game. … Then things got even worse. My game disappeared." ([trustpilot, 2026-11-11](https://www.trustpilot.com/reviews/6af3e0fcdab5716ce958255e)) (web game)
- "One can't commit to GitHub, it a eternal loop of asking to connect." ([trustpilot, 2026-08-26](https://www.trustpilot.com/reviews/6a8e421f62766ec53897e7fe))

**T8 Real-device preview/testing**
- "None of their React Native app have ever worked for me, they fail to load, the libraries are always broken and outdated and good luck seeing the preview until you export and solve a thousand bugs." ([reddit, 2025-12-17](https://www.reddit.com/r/boltnewbuilders/comments/1poz1qp/bolt_should_just_give_up_on_the_react_native_part/)) (mobile; regrets subscription)
- "have you ever had the "app preview" in the browser fail/not work for you? It's been a persistent problem for me … I can still build an APK with my code and test it that way" ([reddit, 2026-04-10](https://www.reddit.com/r/boltnewbuilders/comments/1shxobq/boltnew_keeps_breaking_for_people_in_the_same_5/ofg8pi3/)) (mobile React Native/Expo)
- "Expo projects created in Bolt generate Android APKs that silently depend on Metro bundler being active, causing apps to crash with "Unable to load script" errors when launched standalone." ([reddit, 2025-12-12](https://www.reddit.com/r/boltnewbuilders/comments/1pkjyf3/critical_ux_issue_default_expo_android_apk_builds/)) (mobile)

**T9 Backend, auth, data**
- "If you have a backend API server, the system is not able to connect to it. So I wasted my tokens for the month just arguing with the agent … No refunds, no help." ([trustpilot, 2026-09-25](https://www.trustpilot.com/reviews/6ab666f66b2a17392d08f563)) (web)
- "Spend you life trying to get basic stuff working as it constantly stuffs up RLS database permissions" ([trustpilot, 2026-05-15](https://www.trustpilot.com/reviews/6a066e7fd7cc1af04477a7f6))
- "my current and largest one I'm building has 33 tables, edge functions, user Auth, file storage, AI. It's a mobile app that has support for ios, Android, tablet and full web all at once." ([reddit, 2025-12-01](https://www.reddit.com/r/boltnewbuilders/comments/1pabqt5/i_started_using_boltnew_a_week_ago_and_almost/nrnury3/)) (mobile)

**T11 Publishing to stores**
- "I used bolt but then found that my project was too large. So I opened my project in StackBlitz … 16 months on, I’ve got 2 apps on Apple and Android app store" ([reddit, 2026-08-04](https://www.reddit.com/r/boltnewbuilders/comments/1vepq7z/stopped_using_bolt/p1mh78a/)) (mobile; finished outside Bolt)
- "alot of the apps lately being uploaded to the appstore are AI Slop - and thus alot are being rejeccted for spam and minimum fucntionality - anybody has any expirience on how to make your bolt app's look better" ([reddit, 2026-02-19](https://www.reddit.com/r/boltnewbuilders/comments/1r8w64i/ios_app_builders/)) (mobile)
- "Expo projects created in Bolt generate Android APKs that silently depend on Metro bundler being active, causing apps to crash with "Unable to load script" errors when launched standalone." ([reddit, 2025-12-12](https://www.reddit.com/r/boltnewbuilders/comments/1pkjyf3/critical_ux_issue_default_expo_android_apk_builds/)) (mobile)

**T12 Code ownership / export**
- "One can't commit to GitHub, it a eternal loop of asking to connect." ([trustpilot, 2026-08-26](https://www.trustpilot.com/reviews/6a8e421f62766ec53897e7fe))
- "They didn't even allow me to download my files, and when asked to refund my money no one answers anymore." ([trustpilot, 2026-07-06](https://www.trustpilot.com/reviews/6a4b48ee9fbd86dbb3995d5d)) (banned after 700 EUR)
- "I downloaded my project and moved to Antigravity and the nice thing is that the Bolt Supabase and Netifly configs translate over quite nicely." ([reddit, 2026-01-02](https://www.reddit.com/r/boltnewbuilders/comments/1q23777/good_job_guys_amazing_quality_oops_there_goes_5/nxadqfj/)) (switched; export worked)

**T13 Iterating after first build**
- "Useless since the changed from selecting your own model. I’m out this month. Repeated errors, regressive deploys." ([reddit, 2026-06-20](https://www.reddit.com/r/boltnewbuilders/comments/1u8v4fo/bolt_has_proven_itself_worthless_to_me/osu1dzh/))
- "Arreglas una cosa, se rompen dos más y, antes de darte cuenta, ya te has gastado otro montón de créditos." ([reddit, 2026-07-24](https://www.reddit.com/r/boltnewbuilders/comments/1v2vsvn/anyone_else_seeing_regressions_in_larger_bolt/oze9039/)) (Spanish; same user as regression post)
- "Wiped all code from files that have been saved and published." ([reddit, 2026-07-23](https://www.reddit.com/r/boltnewbuilders/comments/1v2vsvn/anyone_else_seeing_regressions_in_larger_bolt/ozc8uz4/))

**T14 Support and docs**
- "I also just can't justify going back to someone that I was paying that had such a poor response time and broken product." ([reddit, 2026-11-11](https://www.reddit.com/r/boltnewbuilders/comments/1vepq7z/stopped_using_bolt/19sgsr2p66hk0/)) (replied to staff win-back)
- "If you have a backend API server, the system is not able to connect to it. So I wasted my tokens for the month just arguing with the agent … No refunds, no help." ([trustpilot, 2026-09-25](https://www.trustpilot.com/reviews/6ab666f66b2a17392d08f563)) (web)
- "They didn't even allow me to download my files, and when asked to refund my money no one answers anymore." ([trustpilot, 2026-07-06](https://www.trustpilot.com/reviews/6a4b48ee9fbd86dbb3995d5d)) (banned after 700 EUR)


## Replit

**Active:** yes, and very active on mobile. The companion app has 21,660 ratings (4.72★ overall), but the 100 newest reviews average 3.35★ (2026-07-27 → 2026-11-08, version 2.203.2). The 132 newest Google Play reviews (com.replit.app) average 4.0★ (2026-10-18 → 2026-11-10). "Mobile Apps on Replit" (Expo) launched in Jan 2026, and Agent 4 in Mar 2026. In-app publishing moved out of the phone app to replit.com around May 2026, after Apple's 2.5.2 crackdown. r/replit has a post from 2026-11-11 about Expo Go SDK 58 support.

**Sample:** App Store 99 reviews, Google Play 132, Trustpilot 60 newest (2026-07-07 → 2026-11-10). Reddit: about 35 threads with comments in r/replit, r/vibecoding and r/appdev. X (Replit + Expo), YouTube comments, HN. G2: 4.4/5 from 420 reviews (text not accessible).


**Snippets:** 135 from 116 distinct authors (0 older than 12 months). By source: reddit 69, app_store 26, trustpilot 22, google_play 8, x 7, youtube 2, hn 1.

| Theme | Users | Love | Complaint | Request/neutral | Deal-breakers | Summary |
|---|---|---|---|---|---|---|
| T1 What users love | 35 | 28 | 1 | 7 | 1 | Best mobile story in this group: native Expo output, Expo Go on the phone, guided TestFlight/App Store publish; several first-time builders shipped iOS apps (fishing, meditation, IAP trip app). |
| T2 Complaints / deal breakers | 8 | 0 | 8 | 0 | 6 | Quits are about cost and support; users move to Claude Code + GitHub + Railway/Render. |
| T3 Feature requests | 8 | 0 | 0 | 8 | 0 | Convert an existing web project to mobile; Google Play publishing; built-in emulator; RevenueCat support. |
| T4 Pricing and credits | 49 | 4 | 41 | 5 | 14 | Largest theme: effort-based billing surprises ($250/day, $9,600 in two months), unauthorized or post-cancel charges, auto top-ups, paying for the agent's own mistakes, even credits to preview your own app in the companion app. |
| T5 Design quality | 11 | 2 | 7 | 2 | 1 | Wins a one-prompt mobile design test (native navigation, light/dark) but others call output "bland" or "plain white". |
| T6 Motion and polish | 7 | 4 | 1 | 2 | 0 | Best-positioned here: native swipe gestures and iOS 26 Liquid Glass navigation out of one prompt; one user says it "felt like an app" and was "smooth". But opening animations had to be re-prompted and still disappointed one user; a user asks how to add smooth animations. |
| T7 Reliability | 27 | 1 | 26 | 0 | 9 | Agent loops, regressions, "Agent ran into an error", projects deleted, companion app disconnects. |
| T8 Real-device preview/testing | 14 | 4 | 9 | 1 | 1 | Expo Go connection drops (EAS auth state), black screen after publish, SDK 58 mismatch (Nov 2026), invalid TestFlight links in the companion app. |
| T9 Backend, auth, data | 6 | 1 | 5 | 0 | 3 | Login failures in production, paused databases, exposed user lists. |
| T10 IAP / subscriptions | 4 | 1 | 2 | 1 | 1 | IAP placeholder modal caused an App Store rejection; RevenueCat not supported out of the box; one user praises Apple IAP setup. |
| T11 Publishing to stores | 24 | 10 | 14 | 4 | 4 | Both the biggest win (guided App Store flow "saved my life") and the biggest blocker (publish button hangs, "unexpected error", 500 MB bundle cap, iOS only; Play Store manual). |
| T12 Code ownership / export | 9 | 0 | 4 | 5 | 2 | Mostly about leaving: push to GitHub and use Claude Code; editor duplicates code. |
| T13 Iterating after first build | 11 | 0 | 9 | 2 | 2 | Agent changes unrelated functionality; 57 files changed to make buttons more visible. |
| T14 Support and docs | 23 | 0 | 22 | 1 | 9 | Weeks-long tickets blocking launches; support only for some plans; staff are active on r/replit but users still report no resolution. |

**T1 What users love**
- "I do love the visual with replit for sure, but I've spent way too much money lately and the agent seems to be getting stupider with every change so.... claude code for me it is" ([reddit, 2026-08-31](https://www.reddit.com/r/replit/comments/1w3ilm3/ive_spent_thousands_building_on_replit_since_may/p72f5y6/))
- "I made Captions Translation in replit using react native. Just approved for Google Play." ([reddit, 2026-09-27](https://www.reddit.com/r/replit/comments/1wreutk/has_anyone_built_a_real_iosandroid_app_with/pcdgtxi/)) (mobile)
- "Replit came out looking least like a web app, and more like a native app. … had native iOS and android navigation built in, light and dark theme, and proper formatting." ([reddit, 2026-04-16](https://www.reddit.com/r/boltnewbuilders/comments/1snh2gk/i_tested_boltnew_vs_other_ai_builders_for_mobile/)) (one-prompt mobile design test with screenshots)

**T2 Complaints / deal breakers**
- "I was able to open my projects directly in the app or in ExpoGo. Now it’s so convoluted … the links to try on TestFlight come up invalid. I deleted all apps involved." ([app_store, 2026-09-21](https://apps.apple.com/us/app/id1614022293)) (mobile preview broke after update)
- "the code turned out to be poor, synthetic, and totally unusable. I have had to transfer everything to Claude" ([trustpilot, 2026-10-07](https://www.trustpilot.com/reviews/6ac69d68feae5b022bee1ee4))
- "Muchos aquí lo hemos hecho, pero por tema de costos terminamos frustrados, siempre.  Puedes ahorrarte unos miles de dólares si simplemente usas Claude Code." ([reddit, 2026-09-28](https://www.reddit.com/r/replit/comments/1wreutk/has_anyone_built_a_real_iosandroid_app_with/pcnrpte/)) (Spanish)

**T3 Feature requests**
- "the platform's limitations should be structured in a way that allows users to derive genuine utility from it, rather than forcing them to pay just to test whether it actually works." ([google_play, 2026-11-07](https://play.google.com/store/apps/details?id=com.replit.app))
- "Can we get one on turning a fully built Web app Replit  project into a mobile application?" ([youtube, 2026-10-22](https://www.youtube.com/watch?v=lclwLsZgOeo&lc=Ugx5e-9_KIpreBQNiSh4AaABAg)) (date approx from "3 weeks ago")
- "I’m building a mobile app in Replit using React Native/Expo, and I want to add smooth animations to the UI." ([reddit, 2026-09-26](https://www.reddit.com/r/replit/comments/1wqmse1/how_do_i_add_animations_to_my_app_in_replit/)) (asks how; staff reply suggested prompting for specific animation)

**T4 Pricing and credits**
- "on free plan you cant even retrieve your data. you have to pay to unlock data so you can transfer it somewhere else." ([trustpilot, 2026-11-06](https://www.trustpilot.com/reviews/6aee1bfbe9f293113edbedb6))
- "it bills you for mistakes it makes and to fix those mistakes." ([google_play, 2026-11-03](https://play.google.com/store/apps/details?id=com.replit.app))
- "i had auto renew on, and it shut down all my apps, and i cant get them back online. complete devastation for no reason." ([reddit, 2026-10-16](https://www.reddit.com/r/replit/comments/1x77j0k/my_credit_has_been_eaten_by_replit_and_app_stoped/ph39wom/))

**T5 Design quality**
- "It cannot design anything. It changes functionality, core functionality to do with my product without being told to." ([trustpilot, 2026-07-18](https://www.trustpilot.com/reviews/6a5bd1225711a45ebd79a151))
- "Actually has native swipe gestures youd expect from an app" ([reddit, 2026-04-20](https://www.reddit.com/r/lovable/comments/1snh0e7/i_tested_lovable_vs_other_ai_builders_for_mobile/oh9ieu7/)) (one-prompt mobile test)
- "The first app was plain white. Like aggressively white. … So I tightened the prompt for the second one. More colour, opening animations. … And neither was good enough." ([x, 2026-04-14](https://x.com/Kk_Tzs/status/2044056230402855073)) (X thread, mobile app)

**T6 Motion and polish**
- "Actually has native swipe gestures youd expect from an app" ([reddit, 2026-04-20](https://www.reddit.com/r/lovable/comments/1snh0e7/i_tested_lovable_vs_other_ai_builders_for_mobile/oh9ieu7/)) (one-prompt mobile test)
- "Had it on my phone in like an hour. And not a crappy webview. It actually felt like an app. I was mass confused at how smooth it was." ([reddit, 2026-04-14](https://www.reddit.com/r/replit/comments/1slj4nc/10_years_building_web_apps_never_once_touched/)) (10-yr web dev; mobile)
- "The first app was plain white. Like aggressively white. … So I tightened the prompt for the second one. More colour, opening animations. … And neither was good enough." ([x, 2026-04-14](https://x.com/Kk_Tzs/status/2044056230402855073)) (X thread, mobile app)

**T7 Reliability**
- "Replit deleted 3 weeks worth of my work!!!!" ([trustpilot, 2026-11-05](https://www.trustpilot.com/reviews/6aecb42193d8ddb171c79633))
- "i had auto renew on, and it shut down all my apps, and i cant get them back online. complete devastation for no reason." ([reddit, 2026-10-16](https://www.reddit.com/r/replit/comments/1x77j0k/my_credit_has_been_eaten_by_replit_and_app_stoped/ph39wom/))
- "You’ll spend hundreds of building a worthless site and eventually when things crash and fall apart you won’t be able to publish your site to the world. Their support is absolutely useless" ([app_store, 2026-09-22](https://apps.apple.com/us/app/id1614022293)) (web)

**T8 Real-device preview/testing**
- "I was able to open my projects directly in the app or in ExpoGo. Now it’s so convoluted … the links to try on TestFlight come up invalid. I deleted all apps involved." ([app_store, 2026-09-21](https://apps.apple.com/us/app/id1614022293)) (mobile preview broke after update)
- "I’ve now spent over $8K with Replit & my favorite part of the app is having to spend credits on an AI agent just to preview the app." ([app_store, 2026-11-07](https://apps.apple.com/us/app/id1614022293)) (mobile companion app preview)
- "Had it on my phone in like an hour. And not a crappy webview. It actually felt like an app. I was mass confused at how smooth it was." ([reddit, 2026-04-14](https://www.reddit.com/r/replit/comments/1slj4nc/10_years_building_web_apps_never_once_touched/)) (10-yr web dev; mobile)

**T9 Backend, auth, data**
- "on free plan you cant even retrieve your data. you have to pay to unlock data so you can transfer it somewhere else." ([trustpilot, 2026-11-06](https://www.trustpilot.com/reviews/6aee1bfbe9f293113edbedb6))
- "you hit a problem putting into production. Users can't log in. AI gets into a failure loop. You contact support. Who are slow." ([trustpilot, 2026-10-17](https://www.trustpilot.com/reviews/6ad3bd1d146373fb1f43c6a3))
- "friend vibe coded absolute slop with Replit starting late 2024 (!!). Absolute trash code. Hacked multiple times because his login code exposed the full user list on the FE" ([hn, 2026-05-25](https://news.ycombinator.com/item?id=48271054))

**T10 IAP / subscriptions**
- "I've had hundreds of people try to sign up for my app, but the subscription doest work... so they delete my app." ([trustpilot, 2026-08-08](https://www.trustpilot.com/reviews/6a76dd9dadbbd290d7431ddf)) (subscriptions broken; chargeback)
- "Replit made it fairly straightforward handling the payments but it took some time to get it all right. It was one of the trickiest parts of the build." ([reddit, 2026-02-24](https://www.reddit.com/r/replit/comments/1rayxg6/my_first_app_just_got_approved_on_the_app_store/o73wz7p/)) (Apple IAP / StoreKit)
- "can iOS apps built on Replit integrate RevenueCat's SDK for in-app subscriptions?" ([reddit, 2026-01-26](https://www.reddit.com/r/replit/comments/1qdw71d/introducing_mobile_apps_on_replit/o1s0zz1/))

**T11 Publishing to stores**
- "I was able to open my projects directly in the app or in ExpoGo. Now it’s so convoluted … the links to try on TestFlight come up invalid. I deleted all apps involved." ([app_store, 2026-09-21](https://apps.apple.com/us/app/id1614022293)) (mobile preview broke after update)
- "the button to publish to the App Store hangs up and doesn’t push out the black expo popup menu to input your Apple credentials. I haven’t published to the App Store in weeks" ([reddit, 2026-09-29](https://www.reddit.com/r/replit/comments/1wtinzr/replit_cant_publish_to_app_store/))
- "You’ll spend hundreds of building a worthless site and eventually when things crash and fall apart you won’t be able to publish your site to the world. Their support is absolutely useless" ([app_store, 2026-09-22](https://apps.apple.com/us/app/id1614022293)) (web)

**T12 Code ownership / export**
- "the code turned out to be poor, synthetic, and totally unusable. I have had to transfer everything to Claude" ([trustpilot, 2026-10-07](https://www.trustpilot.com/reviews/6ac69d68feae5b022bee1ee4))
- "I went from spending 1-4k a month on replit to a single $200 20x subscription with claude." ([reddit, 2026-08-31](https://www.reddit.com/r/replit/comments/1w3ilm3/ive_spent_thousands_building_on_replit_since_may/p71t8pq/))
- "The editor keeps duplicating my code, the entire file gets a second copy pasted right under the original" ([app_store, 2026-09-19](https://apps.apple.com/us/app/id1614022293))

**T13 Iterating after first build**
- "i would not use this app again to build websites and ESPECIALLY apps because it will crash every single day WITHOUT reason" ([app_store, 2026-07-27](https://apps.apple.com/us/app/id1614022293))
- "It cannot design anything. It changes functionality, core functionality to do with my product without being told to." ([trustpilot, 2026-07-18](https://www.trustpilot.com/reviews/6a5bd1225711a45ebd79a151))
- "Replit is genuinely capable. … Unfortunately, using it requires far too much supervision." ([trustpilot, 2026-09-18](https://www.trustpilot.com/reviews/6aac87d0f081790f56771f84))

**T14 Support and docs**
- "Replit deleted 3 weeks worth of my work!!!!" ([trustpilot, 2026-11-05](https://www.trustpilot.com/reviews/6aecb42193d8ddb171c79633))
- "you hit a problem putting into production. Users can't log in. AI gets into a failure loop. You contact support. Who are slow." ([trustpilot, 2026-10-17](https://www.trustpilot.com/reviews/6ad3bd1d146373fb1f43c6a3))
- "the button to publish to the App Store hangs up and doesn’t push out the black expo popup menu to input your Apple credentials. I haven’t published to the App Store in weeks" ([reddit, 2026-09-29](https://www.reddit.com/r/replit/comments/1wtinzr/replit_cant_publish_to_app_store/))


## Lovable

**Active:** yes. The iOS companion app has 2,977 ratings (4.84★). Its 100 newest reviews average 4.11★ (2026-06-27 → 2026-11-09). Trustpilot newest is 2026-10-30. r/lovable has posts to 2026-11-08. HN: "Lovable raises $400M Series C" (Aug 2026). G2: 4.6/5 from 493 reviews (text behind login). Lovable invites Trustpilot reviews (60 newest fall in a two-week window), so Trustpilot praise is weighted down.

**Mobile:** Lovable does not build native apps. Users confirm "Lovable only seems to be able to build websites" and "lovable doesn't make native apps, it's web only". When asked for mobile, it "build[s] a web app and instructs you to use #capacitor". At least 20 r/lovable threads in the last year ask how to get to the stores. Routes used: Capacitor (+ Capawesome or Codemagic), Despia, median, PWA, or a rebuild in Expo. Several users shipped this way, and many were rejected under 4.2.

**Sample:** App Store 100, Trustpilot 60, Reddit about 25 threads with comments (r/lovable, r/capacitor, r/vibecoding, r/framer, r/webdesign), X, HN, YouTube comments. Google Play: the companion app's package id was not found (dev.lovable.app returned 0), so there are no Play snippets.


**Snippets:** 108 from 95 distinct authors (3 older than 12 months). By source: reddit 64, app_store 20, trustpilot 14, x 6, hn 3, youtube 1.

| Theme | Users | Love | Complaint | Request/neutral | Deal-breakers | Summary |
|---|---|---|---|---|---|---|
| T1 What users love | 31 | 29 | 0 | 2 | 0 | Ease and good-looking web UI ("best app for designing websites and SaaS"), built-in Supabase/auth, fast preview. |
| T2 Complaints / deal breakers | 12 | 0 | 10 | 2 | 7 | Credit burn and slowness push users to Claude Code; for mobile, "Lovable only seems to be able to build websites". |
| T3 Feature requests | 4 | 0 | 2 | 2 | 0 | Native mobile output (React Native/Expo) and store deployment without Capacitor. |
| T4 Pricing and credits | 28 | 2 | 25 | 1 | 6 | Credits run out in a day or a few prompts; opaque credit counts; double IAP charges; expiring credits; GBP billing fees. |
| T5 Design quality | 19 | 9 | 7 | 3 | 0 | Polarised: loved for web UI, but on mobile the output is "very web like", "basic shadcn card layout", purple-gradient "AI-built" look. |
| T6 Motion and polish | 13 | 2 | 5 | 6 | 1 | Strong evidence of the problem: Capacitor wraps "feel like a mobile website"; heavy animation will "feel like a wrapped site"; a wrap with haptics, Face ID and push was still rejected under 4.2. CSS hero animations on web are praised. |
| T7 Reliability | 9 | 0 | 9 | 0 | 2 | Companion app freezes and white screens; content-policy false positives that block work. |
| T8 Real-device preview/testing | 2 (thin) | 0 | 1 | 1 | 0 | Works in preview/emulator, breaks on a real phone after the Capacitor wrap. |
| T9 Backend, auth, data | 11 | 4 | 4 | 3 | 0 | Supabase lock-in when leaving Lovable Cloud (forced password resets), security holes, Sign in with Apple when wrapping. |
| T10 IAP / subscriptions | 2 (thin) | 1 | 1 | 0 | 0 | RevenueCat webhooks failing after Capacitor wrap. |
| T11 Publishing to stores | 31 | 11 | 9 | 13 | 3 | Lovable has no store publishing. Users go via Capacitor, Despia, median, Codemagic, PWA; many rejections (4.2 minimum functionality, account deletion, Sign in with Apple), but several did ship. |
| T12 Code ownership / export | 3 | 1 | 2 | 0 | 0 | Cannot import an existing repo; GitHub creates a fresh repo each time. |
| T13 Iterating after first build | 4 | 1 | 3 | 0 | 1 | Unrequested changes; it takes 10 changes to follow directions. |
| T14 Support and docs | 9 | 0 | 9 | 0 | 1 | Support only for paid plans, slow email, "you will talk to robot". |

**T1 What users love**
- "I built this using Lovable on top of React&#x2F;Capacitor and Supabase." ([hn, 2026-09-01](https://news.ycombinator.com/item?id=49519965)) (shipped mobile app via Capacitor)
- "I built with Lovable and recently got Water Signal Tracker into the App Store. Seeing it listed was a whole moment" ([reddit, 2026-11-03](https://www.reddit.com/r/lovable/comments/1xmfwtr/who_here_is_taking_their_lovable_app_to_the_app/)) (used GitHub + Codemagic, no Mac)
- "Me. Just launched on App Store" ([reddit, 2026-11-03](https://www.reddit.com/r/lovable/comments/1xmfwtr/who_here_is_taking_their_lovable_app_to_the_app/19s37xrxkrps0/))

**T2 Complaints / deal breakers**
- "seems i realised only too late that lovable was terrible." ([reddit, 2026-07-17](https://www.reddit.com/r/vibecoding/comments/1uz3a0h/tried_shipping_my_lovable_app_to_the_app_store/oy49v50/)) (same user as Capacitor post)
- "They went from a solid product to my last resort." ([reddit, 2026-10-30](https://www.reddit.com/r/lovable/comments/1xim1n0/what_happened/19rvvwvkw5t9h/))
- "rebuilt it as a native react native / expo app. tried capacitor first and got 4.2'd since it was basically still the website." ([reddit, 2026-10-20](https://www.reddit.com/r/lovable/comments/1xauudp/got_rejected_by_apple_a_few_times_trying_to/19re79ly4a9pg/)) (Guideline 4.2 rejection; poster works at app-conversion service)

**T3 Feature requests**
- "I found out that Lovable only seems to be able to build websites at the moment. Does anyone know if Lovable has considered offering building mobile apps aswell?" ([reddit, 2026-09-25](https://www.reddit.com/r/lovable/comments/1wq7ev0/why_cant_i_create_react_nativeexpo_mobile_apps_in/)) (no native mobile)
- "being able to see the supabase we are connected when we use Lovable Cloud and AI. … mobile store deployments without the need of Ca" ([x, 2026-02-11](https://x.com/POVPatrickSun/status/2021716507386917157)) (truncated)
- "AI told me to use capacitor but i dont know how it works and honestly it dosent sound so simple" ([reddit, 2026-10-18](https://www.reddit.com/r/lovable/comments/1x90t19/how_to_turn_my_lovable_project_into_an_app/)) (mobile via Capacitor)

**T4 Pricing and credits**
- "every single instruction I provide is then sent off to a black hole of interpretation … I am going to spend my entire day today exporting everything I have" ([reddit, 2026-10-29](https://www.reddit.com/r/lovable/comments/1xim1n0/what_happened/))
- "What I ended up with was an unfinished page full of placeholders and a build error. The credits ran out before I had a working result" ([trustpilot, 2026-10-29](https://www.trustpilot.com/reviews/6ae2a2109b77f2e4fc24949f))
- "I'm moving to another platform because there are so many good vibe coding platforms the customer service and high cost for what it actually is aren't worth it." ([trustpilot, 2026-10-15](https://www.trustpilot.com/reviews/6ad00b5375aef95f729e8247)) (switching)

**T5 Design quality**
- "App is looking extremely basic, and very "web" like. You can tell lovable is meant to make websites and not mobile apps." ([reddit, 2026-04-16](https://www.reddit.com/r/boltnewbuilders/comments/1snh2gk/i_tested_boltnew_vs_other_ai_builders_for_mobile/)) (one-prompt mobile design test with screenshots)
- "I’ve made several beautiful websites and a fully operational app that is just gorgeous." ([app_store, 2026-11-01](https://apps.apple.com/us/app/id6757471107))
- "In less than an hour, I created a beautiful, unique, and professional website for my flooring business that honestly looks like a $20,000 website — and I spent only about $30 USD!" ([app_store, 2026-10-17](https://apps.apple.com/us/app/id6757471107)) (web)

**T6 Motion and polish**
- "The app is a Capacitor wrap of my React web app. Submitted to the App Store and got rejected twice now on Guideline 2.1.0 and 4.2.0 (App Completeness, Minimum Functionality)." ([reddit, 2026-04-18](https://www.reddit.com/r/capacitor/comments/1soxc7l/lovable_app_keeps_being_rejected_im_in_need_of/)) (had added Face ID, push, haptics, share sheet; still rejected)
- "Add a few native touches: native tab bar, haptics, splash screen, local notifications, no tap-highlight or zoom on inputs. It has to *feel* like an app." ([reddit, 2026-10-27](https://www.reddit.com/r/lovable/comments/1xauudp/got_rejected_by_apple_a_few_times_trying_to/19rqtm9jbco0z/)) (how a Capacitor app passed 4.2)
- "anything that needs true native performance (heavy animation, real-time graphics) or deep platform UI will feel like a wrapped site." ([reddit, 2026-08-20](https://www.reddit.com/r/lovable/comments/1vtl5i5/has_anyone_built_a_native_app_with_lovable_yet/p4uv5w1/)) (Capacitor route)

**T7 Reliability**
- "every single instruction I provide is then sent off to a black hole of interpretation … I am going to spend my entire day today exporting everything I have" ([reddit, 2026-10-29](https://www.reddit.com/r/lovable/comments/1xim1n0/what_happened/))
- "What I ended up with was an unfinished page full of placeholders and a build error. The credits ran out before I had a working result" ([trustpilot, 2026-10-29](https://www.trustpilot.com/reviews/6ae2a2109b77f2e4fc24949f))
- "I asked for credit estimates for each build step, it told me about 0.8 credits and then it took 4 credits to build. Can’t trust it." ([app_store, 2026-11-03](https://apps.apple.com/us/app/id6757471107))

**T8 Real-device preview/testing**
- "Working out 1 workflow that was broken to work with capacitor took hours if not days. … Push notifications were a NIGHTMARE! 2 months of this, and I have a fully functioning mobile app" ([reddit, 2026-07-18](https://www.reddit.com/r/vibecoding/comments/1uz3a0h/tried_shipping_my_lovable_app_to_the_app_store/oybmtcq/)) (Capacitor iOS + Android)
- "The moment I wrapped it in Capacitor, things that worked perfectly in the browser started failing in ways that made no sense to me. RevenueCat webhooks silently failing with a 100% error rate" ([reddit, 2026-07-17](https://www.reddit.com/r/vibecoding/comments/1uz3a0h/tried_shipping_my_lovable_app_to_the_app_store/)) (Capacitor + RevenueCat)

**T9 Backend, auth, data**
- "No delete account option. If people can sign up, Apple wants a way to delete the account from inside the app. … This was my first rejection." ([reddit, 2026-10-20](https://www.reddit.com/r/lovable/comments/1xauudp/got_rejected_by_apple_a_few_times_trying_to/)) (Capacitor wrap; poster later disclosed working at an app-conversion service)
- "Working out 1 workflow that was broken to work with capacitor took hours if not days. … Push notifications were a NIGHTMARE! 2 months of this, and I have a fully functioning mobile app" ([reddit, 2026-07-18](https://www.reddit.com/r/vibecoding/comments/1uz3a0h/tried_shipping_my_lovable_app_to_the_app_store/oybmtcq/)) (Capacitor iOS + Android)
- "if you have sign in with Google, Apple wants "Sign in with Apple" too." ([reddit, 2026-10-20](https://www.reddit.com/r/lovable/comments/1xauudp/got_rejected_by_apple_a_few_times_trying_to/19rener82j3q9/))

**T10 IAP / subscriptions**
- "The moment I wrapped it in Capacitor, things that worked perfectly in the browser started failing in ways that made no sense to me. RevenueCat webhooks silently failing with a 100% error rate" ([reddit, 2026-07-17](https://www.reddit.com/r/vibecoding/comments/1uz3a0h/tried_shipping_my_lovable_app_to_the_app_store/)) (Capacitor + RevenueCat)
- "It integrates and configures payment gateways, gives you marketing tips, sets up promotional campaigns, integrates user login systems... it does everything and rarely makes a mistake." ([trustpilot, 2026-10-19](https://www.trustpilot.com/reviews/6ad5ead11da16fd7cc2a0167)) (TP solicited window)

**T11 Publishing to stores**
- "rebuilt it as a native react native / expo app. tried capacitor first and got 4.2'd since it was basically still the website." ([reddit, 2026-10-20](https://www.reddit.com/r/lovable/comments/1xauudp/got_rejected_by_apple_a_few_times_trying_to/19re79ly4a9pg/)) (Guideline 4.2 rejection; poster works at app-conversion service)
- "The app is a Capacitor wrap of my React web app. Submitted to the App Store and got rejected twice now on Guideline 2.1.0 and 4.2.0 (App Completeness, Minimum Functionality)." ([reddit, 2026-04-18](https://www.reddit.com/r/capacitor/comments/1soxc7l/lovable_app_keeps_being_rejected_im_in_need_of/)) (had added Face ID, push, haptics, share sheet; still rejected)
- "Started in lovable but moved to windsurf since lovable is far too expensive for long term building." ([x, 2025-11-04](https://x.com/ghstbabel/status/1985855719321841671)) (older)

**T12 Code ownership / export**
- "I personally with no coding skillset, built 80% of it in less than an hour … And it works. And at scale, we own the code" ([trustpilot, 2026-10-14](https://www.trustpilot.com/reviews/6acf5f0affc6bff52fc950e7))
- "Leaving Lovable Cloud means manually migrating auth providers, secrets, table data, stored files, and forcing user password resets" ([reddit, 2026-08-09](https://www.reddit.com/r/vibecoding/comments/1vjrpsm/i_tested_emergent_lovable_bolt_replit_v0_and/)) (six-builder test)
- "Isn't it a pain in the ass to get your Supabase back end after leaving Lovable?" ([reddit, 2026-02-15](https://www.reddit.com/r/lovable/comments/1r2u2cp/i_stopped_using_lovable/o5iv8og/))

**T13 Iterating after first build**
- "the app will build enough bugs into your code with each change that it will drain your credits beyond belief. … Find another place to build and host." ([app_store, 2026-09-29](https://apps.apple.com/us/app/id6757471107))
- "Think you were too harsh on Lovable, one broken feature after three prompts isn't the end of the world" ([youtube, 2026-10-15](https://www.youtube.com/watch?v=qxED97f4i7A&lc=UgzZRidvPegDxtrXvXN4AaABAg)) (date approx)
- "I press the stop button to stop the chat from initiating a build sequence, but it then resumes … It also throws in ridiculous changes to my project that I did not request" ([app_store, 2026-08-05](https://apps.apple.com/us/app/id6757471107))

**T14 Support and docs**
- "I'm moving to another platform because there are so many good vibe coding platforms the customer service and high cost for what it actually is aren't worth it." ([trustpilot, 2026-10-15](https://www.trustpilot.com/reviews/6ad00b5375aef95f729e8247)) (switching)
- "cant even contact a real customer service representative to help you out if you are not on a paid plan." ([app_store, 2026-11-01](https://apps.apple.com/us/app/id6757471107))
- "They say they’ll reply within 24 hours if you send them an email but it’s been a week now" ([trustpilot, 2026-10-30](https://www.trustpilot.com/reviews/6ae4388c65a158e1ad42f09c))


## Anything

**Active:** yes, as a web product (anything.com, formerly create.xyz / createanything.com; it bought the anything.com domain in Dec 2025). **Its iOS app was pulled by Apple on 2026-03-31 under guideline 2.5.2** ([r/apple](https://www.reddit.com/r/apple/comments/1s8fhjp/apple_pulls_vibe_coding_app_anything_from_app/), [r/iOSProgramming](https://www.reddit.com/r/iOSProgramming/comments/1s8gij4/apple_steps_up_crackdown_on_vibe_coding_apps/)). X users in April 2026 talk about it coming back ("App Store ban couldn't stop you"), but the old id 6751247034 returns 404 and an App Store search on 2026-11-12 does not find it. Newer releases mentioned by users: App Store screenshot generator (Apr 2026), Play Store publishing (May 2026), agents ("Skydive", Oct 2026). It took in migrating users when Mocha wound down (May 2026). The newest Trustpilot review is 2026-10-25, and X mentions run to 2026-11-08. The founder held an AMA in r/vibecoding (Apr 2026), and its user comments are used here; the founder's own answers were excluded.

**Sample:** Trustpilot 20 reviews, all of them (2025-12-20 → 2026-10-25; 2.2★, 75% 1★ per earlier research). Reddit: 5 threads (the founder AMA comments, "Anything.com alternative?", "Has anyone tried Anything"). X: about 110 posts, but most are credit giveaways or hackathon posts; only 18 were kept, and incentivised ones are marked. Product Hunt: 12 reviews (4.0), all about a year old. There is no own subreddit, almost no YouTube review content, and no App Store reviews any more.

**Evidence caveat:** Anything clears 40 snippets, but many themes have only 2–5 users. Treat its theme counts as directional.


**Snippets:** 57 from 50 distinct authors (6 older than 12 months). By source: trustpilot 20, x 18, reddit 14, producthunt 5.

| Theme | Users | Love | Complaint | Request/neutral | Deal-breakers | Summary |
|---|---|---|---|---|---|---|
| T1 What users love | 22 | 17 | 0 | 5 | 1 | Mobile + web from one prompt, built-in DB, App Store screenshot generator and Play Store publishing (2026), clean non-"AI-made" look (Product Hunt launch, older). |
| T2 Complaints / deal breakers | 3 | 0 | 3 | 0 | 2 | Support absence and credit drain make teams switch. |
| T3 Feature requests | 4 | 0 | 2 | 3 | 0 | Separate credits for AI-fault fixes; store-acceptance pre-check; widgets, tester sharing, versioning. |
| T4 Pricing and credits | 19 | 1 | 16 | 3 | 11 | Credits wiped by the agent fixing its own errors (23k and 32k credits), subscriptions that kept billing, refunds refused, chargebacks. |
| T5 Design quality | 6 | 6 | 0 | 0 | 0 | Only positive mentions (incl. hackathon participants and launch-day PH reviews, so weigh lightly). |
| T6 Motion and polish | 2 (thin) | 2 | 0 | 0 | 0 | Thin: "crisp animations" on a landing page; "flows are smooth" (PH, older). |
| T7 Reliability | 11 | 1 | 10 | 1 | 5 | Loops, "prompt takes me in circles", site down for a weekend. |
| T8 Real-device preview/testing | 2 (thin) | 0 | 2 | 0 | 0 | Preview differs from the build submitted to the App Store; paywall broken in production iOS. |
| T9 Backend, auth, data | 5 | 1 | 4 | 0 | 2 | Dev vs prod database split confuses the agent; locked DATABASE_URL; sign-in errors. |
| T10 IAP / subscriptions | 2 (thin) | 0 | 1 | 1 | 1 | Paywall broken in prod (older X post). |
| T11 Publishing to stores | 12 | 6 | 3 | 3 | 1 | Store screenshot generator and Play Store publishing praised; "can't push anything to app store" around Apple's removal of the Anything iOS app (Mar 2026). |
| T12 Code ownership / export | 3 | 2 | 2 | 0 | 1 | Code export works (React Router + Vite + Hono) and is a reason to choose it. |
| T13 Iterating after first build | 2 (thin) | 0 | 2 | 0 | 1 | New feature "destroys three working components". |
| T14 Support and docs | 11 | 1 | 10 | 0 | 7 | AI-only email support, slow or no replies even on Max plan. |

**T1 What users love**
- "I'm building a mobile app with it for https://t.co/kiuZ7QXLzb and it's working great." ([x, 2026-06-12](https://x.com/Scobleizer/status/2065533216803663980)) (mobile)
- "The main reason we picked Anything.com to begin with is that you can export the whole codebase at any time to easily switch vendors." ([reddit, 2026-08-18](https://www.reddit.com/r/vibecoding/comments/1vr2zuj/anythingcom_alternative/p4f4n4w/)) (React Router + Vite + Hono export)
- "I am happy with the overall quality of the app I have built and considering I am not a technical person the overall outcome is genuinely incredible." ([trustpilot, 2026-07-30](https://www.trustpilot.com/reviews/6a6b869c69205fd0d9520055)) (names support agents; likely post-ticket solicited)

**T2 Complaints / deal breakers**
- "It was great for a while, but their lack of support leaves us with no option but to switch, since I can't actually see the errors it's running into on the backend." ([reddit, 2026-08-17](https://www.reddit.com/r/vibecoding/comments/1vr2zuj/anythingcom_alternative/p4aeajf/))
- "A simple task—something that should have been straightforward—ended up consuming around 23,000 credits, and the system still failed to properly resolve the issue." ([trustpilot, 2026-04-10](https://www.trustpilot.com/reviews/69d88a54097af784d573da60)) (compares Emergent, Base44, Rork favourably; requested refund)
- "Two words: expensive and useless" ([reddit, 2026-02-12](https://www.reddit.com/r/vibecoding/comments/1pojese/has_anyone_tried_anything_the_app_builder/o4ybcd1/))

**T3 Feature requests**
- "Does it take care of app store descriptions, screenshots etc. ?" ([x, 2026-05-21](https://x.com/watt_cell/status/2057253902806823328))
- "If you spin out the base tech that allows app builders to test whether their apps would get accepted into play store and IOS store and give it a diagnosis of what needs to be fixed/change" ([x, 2026-05-21](https://x.com/Shonik/status/2057398838932164944))
- "I feel like there should be separate credits for when it's the website's fault, versus credits used for any additions or non error-related changes I want done with my app." ([reddit, 2026-05-20](https://www.reddit.com/r/vibecoding/comments/1stuh5t/ama_im_dhruv_founder_of_anything_ask_me_anything/omwb2ww/))

**T4 Pricing and credits**
- "I selected the built-in “Fix AI Error with Agent” feature while trying to repair my existing app, and my entire balance of 32,000 credits was consumed." ([trustpilot, 2026-10-25](https://www.trustpilot.com/reviews/6ade1dba7daa34e263c34cb3))
- "Mi ha fatto partire un abbonamento a mia insaputa che mi ha tolto 7 mensilità prima di accorgermi dei pagamenti" ([trustpilot, 2026-10-18](https://www.trustpilot.com/reviews/6ad4d1215078eee077120224)) (Italian; refund refused)
- "while the AI builds a new feature, it destroys three working components at the same time." ([trustpilot, 2026-08-10](https://www.trustpilot.com/reviews/6a79dd23d2873bf261b5c16d)) (spent ~€1,350; chargeback (same story as another review, counted once))

**T5 Design quality**
- "App Store用のスクショまで自動生成してくれる" ([x, 2026-04-26](https://x.com/fefnii/status/2048219669216247932)) (Japanese: it even auto-generates App Store screenshots)
- "Clean layout, crisp animations, tighter copy, mobile-first, lightning-fast load speed. - Everything flows perfectly into onboarding and the in-app preview." ([x, 2025-12-09](https://x.com/alexcooldev/status/1998406252377018529)) (landing page built with Anything for a shipped app)
- "Great minimal UI | @Contra x Anything hackathon" ([x, 2025-12-02](https://x.com/MuhammadN_orani/status/1995728148147634471)) (hackathon participant (incentivized))

**T6 Motion and polish**
- "Clean layout, crisp animations, tighter copy, mobile-first, lightning-fast load speed. - Everything flows perfectly into onboarding and the in-app preview." ([x, 2025-12-09](https://x.com/alexcooldev/status/1998406252377018529)) (landing page built with Anything for a shipped app)
- "UI feels clean, flows are smooth, and I didn’t feel like I was using some generic AI template." ([producthunt, unknown](https://www.producthunt.com/products/anything-2/reviews)) (PH, 1yr ago; launch-day review)

**T7 Reliability**
- "I selected the built-in “Fix AI Error with Agent” feature while trying to repair my existing app, and my entire balance of 32,000 credits was consumed." ([trustpilot, 2026-10-25](https://www.trustpilot.com/reviews/6ade1dba7daa34e263c34cb3))
- "our prompts have just been getting stuck in an infinite loop for any simple task. I tried emailing their support (which turns out to be just AI)" ([reddit, 2026-08-17](https://www.reddit.com/r/vibecoding/comments/1vr2zuj/anythingcom_alternative/)) (web; small non-profit team)
- "I'VE LITERALLY SPENT $10,000 BUILDING AN APP WITH YOUR SYSTEM. IT IS NOW BROKEN, NOT WORKING!! THE PROMPT TAKES ME IN CIRCLES AND NOBODY IS RESPONDING TO EMAILS." ([reddit, 2026-06-18](https://www.reddit.com/r/vibecoding/comments/1stuh5t/ama_im_dhruv_founder_of_anything_ask_me_anything/osb53eo/))

**T8 Real-device preview/testing**
- "the app crashes or doesn't show what I see as a preview on the website, when I submit to the app store. My credits keep running out" ([reddit, 2026-05-20](https://www.reddit.com/r/vibecoding/comments/1stuh5t/ama_im_dhruv_founder_of_anything_ask_me_anything/omwb2ww/)) (mobile; asks for separate credits for AI-fault fixes)
- "your paywall is broken in prod ios  also we need home screen widgets … and a way to share it with testers … and the undo button is a nuclear bomb rn" ([x, 2025-11-26](https://x.com/luke_pighetti/status/1993685081890722186)) (X reply to company)

**T9 Backend, auth, data**
- "the builder's database tools read development, while your live app reads production. … the AI agent can't see your published app and will report things about it confidently that aren't true." ([trustpilot, 2026-09-01](https://www.trustpilot.com/reviews/6a96c84abcb78dec77229885)) (migrated from Mocha; praises code export)
- "So far I've bought 70k credits and burned through 60,000 of them with no luck on completing what I started. It seems really cool at building pages but back end dashboards and infrastructure is a whole different animal." ([producthunt, unknown](https://www.producthunt.com/products/anything-2/reviews)) (PH, shown as 1yr ago)
- "The Builder connects to the correct database, while the Published environment continues using an old locked DATABASE_URL. … I have been waiting more than 20 days without a resolution." ([trustpilot, 2026-07-17](https://www.trustpilot.com/reviews/6a5a08911ece0ad61d57b317))

**T10 IAP / subscriptions**
- "puedes hacer 200 aplicaciones por el mismo precio que haces media app con anything. Me gusta la conexión con stripe y las stores." ([trustpilot, 2026-01-20](https://www.trustpilot.com/reviews/696f724e159a0100df7a029e)) (Spanish; prefers Cursor; likes Stripe + store connection)
- "your paywall is broken in prod ios  also we need home screen widgets … and a way to share it with testers … and the undo button is a nuclear bomb rn" ([x, 2025-11-26](https://x.com/luke_pighetti/status/1993685081890722186)) (X reply to company)

**T11 Publishing to stores**
- "the app crashes or doesn't show what I see as a preview on the website, when I submit to the app store. My credits keep running out" ([reddit, 2026-05-20](https://www.reddit.com/r/vibecoding/comments/1stuh5t/ama_im_dhruv_founder_of_anything_ask_me_anything/omwb2ww/)) (mobile; asks for separate credits for AI-fault fixes)
- "Finally a vibe coding app that made shipping to play store easier" ([x, 2026-05-21](https://x.com/EndrewBiz/status/2057338611536744466)) (Play Store publishing launch, May 2026)
- "Does it take care of app store descriptions, screenshots etc. ?" ([x, 2026-05-21](https://x.com/watt_cell/status/2057253902806823328))

**T12 Code ownership / export**
- "the builder's database tools read development, while your live app reads production. … the AI agent can't see your published app and will report things about it confidently that aren't true." ([trustpilot, 2026-09-01](https://www.trustpilot.com/reviews/6a96c84abcb78dec77229885)) (migrated from Mocha; praises code export)
- "The main reason we picked Anything.com to begin with is that you can export the whole codebase at any time to easily switch vendors." ([reddit, 2026-08-18](https://www.reddit.com/r/vibecoding/comments/1vr2zuj/anythingcom_alternative/p4f4n4w/)) (React Router + Vite + Hono export)
- "sounds great until you need to debug something. then you're stuck." ([x, 2026-04-07](https://x.com/agent_zane/status/2041454059152908627)) (about anything.com)

**T13 Iterating after first build**
- "while the AI builds a new feature, it destroys three working components at the same time." ([trustpilot, 2026-08-10](https://www.trustpilot.com/reviews/6a79dd23d2873bf261b5c16d)) (spent ~€1,350; chargeback (same story as another review, counted once))
- "your paywall is broken in prod ios  also we need home screen widgets … and a way to share it with testers … and the undo button is a nuclear bomb rn" ([x, 2025-11-26](https://x.com/luke_pighetti/status/1993685081890722186)) (X reply to company)

**T14 Support and docs**
- "I selected the built-in “Fix AI Error with Agent” feature while trying to repair my existing app, and my entire balance of 32,000 credits was consumed." ([trustpilot, 2026-10-25](https://www.trustpilot.com/reviews/6ade1dba7daa34e263c34cb3))
- "Mi ha fatto partire un abbonamento a mia insaputa che mi ha tolto 7 mensilità prima di accorgermi dei pagamenti" ([trustpilot, 2026-10-18](https://www.trustpilot.com/reviews/6ad4d1215078eee077120224)) (Italian; refund refused)
- "the builder's database tools read development, while your live app reads production. … the AI agent can't see your published app and will report things about it confidently that aren't true." ([trustpilot, 2026-09-01](https://www.trustpilot.com/reviews/6a96c84abcb78dec77229885)) (migrated from Mocha; praises code export)


## T6 Motion and polish: findings across the group

**Bottom line:** none of the four builders is praised by users for animation or motion in *mobile* apps. Motion is either unmentioned or a known gap. The few positives are web landing pages, or come from users who added motion with outside tools.

- **Replit gets closest on mobile feel. It does this through native structure, not animation.** In a one-prompt test of five builders ([r/boltnewbuilders, 2026-04-16](https://www.reddit.com/r/boltnewbuilders/comments/1snh2gk/i_tested_boltnew_vs_other_ai_builders_for_mobile/), with Imgur screenshots in the post), the tester found that Replit "Actually has native swipe gestures youd expect from an app" and "iOS uses the new ios 26 Liquid Glass navigation" ([comment](https://www.reddit.com/r/lovable/comments/1snh0e7/i_tested_lovable_vs_other_ai_builders_for_mobile/oh9ieu7/)). A 10-year web developer said "It actually felt like an app. I was mass confused at how smooth it was" ([r/replit](https://www.reddit.com/r/replit/comments/1slj4nc/)). It is not perfect: one user asked for "More colour, opening animations" and "neither was good enough" ([X thread with video](https://x.com/Kk_Tzs/status/2044056230402855073)). Another asks how to "add smooth animations to the UI" of an Expo app ([r/replit](https://www.reddit.com/r/replit/comments/1wqmse1/how_do_i_add_animations_to_my_app_in_replit/)). One shipped iOS app got its Easter-egg animation from RunwayML through MCP, not from Replit ([r/replit](https://www.reddit.com/r/replit/comments/1tusjnx/replit_animation_is_fireee_especially_with/), App Store: Dino Initiative).
- **Lovable is the clearest case of "feels like a website".** Capacitor users ask whether the wrap passes "the 'vibes test' for a native iOS user, or do the interactions still feel like a mobile website?" ([r/lovable](https://www.reddit.com/r/lovable/comments/1qdj00n/)). Another says "heavy animation, real-time graphics … will feel like a wrapped site" ([r/lovable](https://www.reddit.com/r/lovable/comments/1vtl5i5/)). One founder's wrap had Face ID, push, a native share sheet **and haptics**, and was still rejected twice under 4.2 ([r/capacitor](https://www.reddit.com/r/capacitor/comments/1soxc7l/)). The advice that worked for one consultant was to add "native tab bar, haptics, splash screen … It has to *feel* like an app" ([r/lovable](https://www.reddit.com/r/lovable/comments/1xauudp/)). On the web, CSS hero animations work well ([r/lovable](https://www.reddit.com/r/lovable/comments/1qwumei/lovable_for_animations/)), and one user built a full animated product demo in Lovable ([r/lovable](https://www.reddit.com/r/lovable/comments/1ufv4kb/), live at conviapro.lovable.app). Users still benchmark against Framer for "micro-interactions, animations" ([r/lovable](https://www.reddit.com/r/lovable/comments/1q7cgcn/)).
- **Bolt:** only web motion praise. "Pretty impressive to see the animations" (X, 2025, older), and one user loves "the quality of visual / interactive elements" ([r/vibecoding](https://www.reddit.com/r/vibecoding/comments/1w08v66/)). Bolt's own template marketplace promises "the animations, the polish". That is marketing and was not counted. No mobile motion feedback was found.
- **Anything:** "crisp animations … Everything flows perfectly into onboarding" (X, Dec 2025), about a landing page. Product Hunt launch reviews say "flows are smooth" and the output doesn't look "AI-made" (older; launch-day, likely friendly).
- **What's missing everywhere:** no user mentions Lottie, Rive, Reanimated, gesture-driven transitions, animated onboarding or animated paywalls produced by these builders. Where those appear in the data (Reanimated + Skia games, animated launch screens), they are hand-built in Expo outside these tools. Demand is visible ("custom app launch/loading animations… smoothly fading in, scaling up", [r/reactnative](https://www.reddit.com/r/reactnative/comments/1x22bfe/)). **This is an open gap: no tool in this group owns "polished, animated native feel".**

## Newer AI mobile app builders found (mentioned by users in this data)

| Tool | URL | Evidence it is real and active | User feedback |
|---|---|---|---|
| Expo Agent | agent.expo.dev | Expo announced it in r/expo, 2026-03-10 (waitlist), and says it builds React, SwiftUI and Jetpack Compose apps from a prompt ([post](https://www.reddit.com/r/expo/comments/1rq1y7t/)). Expo also launched an "Exact" runtime in Nov 2026 (X, 2026-11-09/11). | 30 comments on the announcement (not mined). |
| Superapp | superapp (no URL given) | Recommended in r/lovable, 2026-01 ("basically same lovable but for iOS") and r/vibecoding, 2026-03 | "handles backend + easier to ship" |
| Modaal | modaal (via X @modaalbuilder) | Founder-disclosed comment, 2026-09-08: generates Swift/SwiftUI + Kotlin/Compose, uses the user's own Claude/ChatGPT subscription, no per-request credits | Founder only; no independent feedback |
| Corenna | corenna.dev | Founder posts, 2026-10/11: signed Android/iOS builds from a GitHub repo with no Mac; 1 free Android build, then $2.99/mo | Founder only |
| VibeView | vibeview | Co-founder reply in r/lovable, 2026-11-03; one user is using it to build and get to TestFlight for a Lovable app | "covered testing and building in one place for me" (user, 2026-11-03) |
| bilt.me | bilt.me | Employee comment in r/lovable, 2026-10-01 ("a mobile app builder") | None |
| Natively | natively.dev | Staff comment, 2025-11: mobile only, App Store compliance pipeline | None |
| iSwift.dev | iswift.dev | Commenter, 2025-11 / 2026-03: "does native SwiftUI code" | Single advocate |
| OnSpace AI | App Store id 6746471538 | Listed in the US App Store (31 ratings, 3.16★) | Not mined |
| AI App Builder Architect | App Store id 6770260745 | Listed in the US App Store (932 ratings, 4.79★) | Not mined |
| Blanks – AI App Builder | App Store id 6744576554 | Listed in the US App Store (Polsia Inc) | Not mined |
| Wrapper and publish services (not builders) | Despia, median.co, Capawesome Cloud, Codemagic, BDK Native, letsdeploy.it, publishd.app | Many r/lovable users use them to get web apps into stores. BDK Native user: "Our app now has 600+ five-star reviews" (r/lovable, 2026-11-07) | Shows the demand for a "web app → store" path |

## Method and caveats
- Sources: App Store (litescrape), Google Play (Replit), Trustpilot (crawl4ai; 60 newest for Bolt, Replit and Lovable, all 20 for Anything), Reddit search (about 45 queries) plus comments on about 90 threads, X (about 25 queries), HN comments (8 queries), YouTube (11 searches, comments on 18 videos; mostly empty or promo), Product Hunt (Bolt, Anything), G2 (ratings only; review text behind login). Capterra's Replit page returned 404.
- Author keys are the first 8 hex characters of the SHA-1 of the handle. Product Hunt reviewers are anonymous in the fetch, so their keys hash the quote.
- YouTube dates are approximate (from "3 weeks ago"). Product Hunt dates are "unknown" (shown only as "1yr/6mo ago"). Snippets shown as 1yr+ are marked `older: true`.
- Solicited-review flags: Lovable Trustpilot (invites reviews), the Bolt Trustpilot 5★ burst (Oct 22–23), Anything Trustpilot 5★ reviews that name support agents, and Anything X hackathon posts. All are marked in notes.
- Same story, two reviews: two near-identical Anything €1,350 Trustpilot complaints. Only one was kept.
