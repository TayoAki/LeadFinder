# Group 5: Motion and polish in apps made with AI mobile app builders

**Theme focus:** T6 (motion and polish), with T5 (design quality) where it overlaps.
**Collected:** 2026-11-12. **Snippets:** 110 from about 100 separate authors (`group5-motion-polish.jsonl`). 83 are from the last 12 months and 27 are marked `older`.
**Sources:** Reddit (62), X (33), YouTube comments (6), Hacker News (5), App Store reviews (4). 86 Reddit searches covered posts and comments, 12 Reddit threads were read in full, 30 X searches were run, comments on 13 YouTube videos were read, 8 HN comment searches were run, and 4 companion apps had 3 pages of App Store reviews each.
**treg spend:** about $0.23 (180 billed calls, summed from the per-call `charged` lines).

## Headline findings

1. **Users rarely talk about motion as a builder feature. They talk about it as the thing that is missing.** Motion comes up mainly in two kinds of posts. In the first, someone shows off an app they built and lists animations or haptics as a point of pride. In the second, someone says an app "looks vibe coded", "feels cheap", "feels static" or "feels like a website". No builder has a reputation for motion in its own right. The posts that credit one name a specific result, such as "haptics on actions" (Vibecode) or "animations" (Rork), and never a motion system.
2. **The "vibe-coded look" is now a known pattern, and it costs the app users.** Commenters list its signs: purple gradients, glassy cards, emoji icons, default fonts and "animated arrows". Some say outright that they will not use or pay for an app that has the look. “In its current state I'm not touching your app because vibecoded look=lazy slop” ([reddit, 2026-10-25](https://www.reddit.com/r/webdesign/comments/1xeor1e/wondering_what_people_think_of_my_landing_page/19rm1suij1bpe/)) “Also, yes, it makes it feel cheap and this is a growing sentiment across the Internet, similarly with how AI art feels cheap.” ([reddit, 2026-07-12](https://www.reddit.com/r/vibecoding/comments/1uu8r51/does_vibecoded_make_an_app_feel_cheap/ox1wxm8/))
3. **The fixes users report all happen outside the builder:**
   - prompting with a reference ("screen record an app you like");
   - adding Reanimated, Lottie or haptics by hand or through a coding agent;
   - exporting from Lovable to Capacitor and adding a haptics plugin;
   - testing on a real device rather than a simulator.
4. **Rork gets the most credit for motion**, nearly all of it from people posting on X about apps or games they built. It also gets the sharpest complaint: “Every Rork app has the same UI/animations/paywalls.” ([x, 2026-06-28](https://x.com/MaxHirsch13/status/2071257558417830083))
5. **Vibecode is credited for haptics in particular.** Users can pick haptics in its editor, and builders post about adding haptics to actions. No one complains about Vibecode's motion, but the evidence is thin.
6. **Users see wrapped web apps (Lovable/Capacitor, Replit web builds, WebView) as polish failures by default.** "It will feel like a website."
7. **Among React Native/Expo developers the bar is specific:**
   - Reanimated + Gesture Handler as the base;
   - native stack and native tabs;
   - shared-element transitions that you can interrupt with a back swipe;
   - haptics on key actions, though iOS and Android behave very differently;
   - animated onboarding (Lottie, Rive or Reanimated);
   - spring and ease timings of about 150–250 ms;
   - smoothness checked on a real device.

---

## Per competitor

### Rork (13 snippets, 11 users). Active.
- **Activity:** active. The latest user post in this set is from 2026-09 (approx.). Rork Max (native SwiftUI) launched around 2026-02 and is widely discussed on X.
- **Sample:** X 9, YouTube 3, Reddit 1.
- **T6 (10 users):** mostly positive.
  - Builders show off animations, Dynamic Island effects, game animations and "native UI".
  - Users say they add animations themselves to make an app "feel less vibe coded".
  - One builder saw laggy animations in the Rork simulator that were smooth on a real iPhone (T8).
  - One sharp critic says every Rork app has the same animations and paywalls.
  - One user asked whether Rork can do a "haptic pulse" (T3).
- **T1 (6 users):** "Loved this ui and Animations" and "Clean UI + animations".
- **T5 (4 users):** "looks way more polished" than Cursor output; "AI creates its own design" (T13).
- **Strongest quotes:**
  - “Every Rork app has the same UI/animations/paywalls.” ([x, 2026-06-28](https://x.com/MaxHirsch13/status/2071257558417830083))
  - “someone said the animations looked laggy 👀 Turns out… they were right but only on simulator. I’d been testing on Rork simulator + my own simulator the whole time → UI felt choppy.” ([x, 2026-04-23](https://x.com/alexcooldev/status/2047378078893294020))
  - “i added animations to make it feel less vibe coded (and visually better for shorts). 100% built with rork max.” ([x, 2026-04-02](https://x.com/simonecanciello/status/2039810854749647224))
  - “Loved this ui and Animations” ([x, 2026-03-21](https://x.com/Mr_Salio/status/2035333265800773982))
  - “The app i want to create needs a haptic pulse. Could Rork do this?” ([youtube, 2026-09-13](https://www.youtube.com/watch?v=ZFBpnV-1dXo&lc=UgzqIy0Cwu2lxRs9xWN4AaABAg))
- **Caveat:** several X posters are influencers. One post (`PrajwalTomar_`) may be sponsored, and some YouTube creators are Rork affiliates. Only viewer comments were coded from those videos.

### Vibecode (vibecodeapp / @v_computer) (7 snippets, 7 users). Active. THIN
- **Activity:** active. The latest App Store review in the pulled set is from 2026-10-17. The company posts daily on X, and those posts were excluded as staff content.
- **Sample:** X 4, App Store 3.
- **T6 (5 users):** the only builder users credit specifically for **haptics**. They add "haptics to actions", pick haptics in the editor, and one says AI "has come a long way from those shitty gradient designs and absurd animations… all the haptics".
- **T5 (4 users):** App Store reviewers say it "builds beautiful apps". Its App Store reviews are otherwise dominated by credit and reliability complaints, which other groups cover.
- **Strongest quotes:**
  - “has come a long way from those shitty gradient designs and absurd animations. this is me trying to one shot an app , this app has all the haptics and everything when tested.” ([x, 2026-01-12](https://x.com/AdvickB/status/2010580818822152340))
  - “added haptics to actions!” ([x, 2025-10-30](https://x.com/curious_product/status/1983857625000513678))
  - “I asked it to include haptics. And it works.” ([x, 2025-04-05](https://x.com/JonahBlake/status/1908522157623144771))
- **THIN:** 7 snippets.

### FlutterFlow (11 snippets, 11 users). Active.
- **Activity:** active. The latest user comment is from 2026-05-02. Most motion evidence is older (2023–2025).
- **Sample:** Reddit 10, X 1.
- **T6 (11 users):** mixed.
  - Users say it is good for "simple UI stuff… animations" and better than Glide "if you need fancy animations".
  - An App of the Year winner credits time spent on animations.
  - Complaints: laggy page transitions (later traced to data handling), looping animations breaking on navigation, null errors when animating hidden widgets, and animations laggy in web preview but fine on TestFlight.
  - Fix reported: custom widgets with pub.dev animation packages.
- **Strongest quotes:**
  - “If you’re doing simple UI stuff (show/hide sections, local form validation, animations, screen state), FlutterFlow is great.” ([reddit, 2026-05-02](https://www.reddit.com/r/FlutterFlow/comments/1sxv139/w18_for_experienced_flutterflow_users/ojftyvy/))
  - “I have an animation chain on "on page load" that is in a loop. When switching page and going back it get's all messed up (probably because it start 2 loops at the same time)” ([reddit, 2024-12-06](https://www.reddit.com/r/FlutterFlow/comments/1h83qfs/how_to_keep_animation_running_and_not_mess_up/))
  - “Testing using the online version was laggy for me but it’s fine using TestFlight on my phone.” ([reddit, 2025-03-23](https://www.reddit.com/r/FlutterFlow/comments/1jhuall/lagging_animations/mja7y9u/))
- **Note:** only 2 snippets fall in the last 12 months. Recent evidence is thin.

### Lovable (6 snippets, 6 users). Active. THIN
- **Activity:** active. The latest post is from 2026-10-27, and its App Store app is reviewed weekly.
- **Sample:** Reddit 5, X 1.
- **T6 (6 users):** almost all about **web-wrapper feel**.
  - Users say a Capacitor-wrapped Lovable app "will feel like a website" and that heavy animation "will feel like a wrapped site".
  - Fixes: add haptics, native tab bar and splash screen; or rebuild with native components "if animations really matter".
  - A Lovable app was rejected by Apple under guideline 4.2 for feeling like a website (T11).
- **Strongest quotes:**
  - “Add a few native touches: native tab bar, haptics, splash screen, local notifications, no tap-highlight or zoom on inputs. It has to *feel* like an app.” ([reddit, 2026-10-27](https://www.reddit.com/r/lovable/comments/1xauudp/got_rejected_by_apple_a_few_times_trying_to/19rqtm9jbco0z/))
  - “If you just need something in the stores fast, wrapping the web app with Capacitor works, but it will feel like a website.” ([reddit, 2026-09-28](https://www.reddit.com/r/lovable/comments/1wq7ev0/why_cant_i_create_react_nativeexpo_mobile_apps_in/pcj1z2y/))
  - “I then installed specific native features to make the app feel more native, such as haptics.” ([reddit, 2026-04-03](https://www.reddit.com/r/lovable/comments/1sbjgpf/built_website_using_lovable_converted_into_app/oe4hrq4/))
- **THIN.**

### Replit (mobile) (3 snippets). Active. THIN
- The agent keeps "forcing everything back into React web builds", which hurts visuals and animations.
- An App Store review calls its design "pretty bland".
- “Replit agent keeps trying to force everything back into React web builds. Super annoying. Seems like every app needs a different tech stack depending on what it does + the visuals/animations.” ([reddit, 2026-02-19](https://www.reddit.com/r/replit/comments/1qmte9h/just_submitted_my_first_ios_app_to_the_app_store/o66wdt1/))
- “Also, the design ability of this app is pretty bland.” ([app_store, 2026-09-14](https://apps.apple.com/us/app/id1614022293))

### Base44 (3 snippets). Active. THIN (included as an adjacent builder)
- Users praise animations and sounds in game entries.
- One user had to source animations from hover.dev because every entry's UI looked alike.
- “I found a lot of the animations on https://www.hover.dev/, … looking at all the other entries and how similar the UI was, it really pushed me to create something different.” ([reddit, 2026-03-04](https://www.reddit.com/r/Base44/comments/1riypfn/most_interesting_base44_app_youve_madecome_across/o8mi6el/))

### Draftbit (1), Bubble native mobile (1), Blink.new (1). THIN
- Draftbit: “So unless heavy animations and transitions are required where native is required most of the cases hybrid is suffice.” ([x, 2024-02-17](https://x.com/narayandreamer/status/1758869456673984644)) (older)
- Bubble: “Cant you do small detailed animations for user delight in bubble?” ([reddit, 2025-09-20](https://www.reddit.com/r/nocode/comments/1l5517z/leaving_bubbleio_after_building_an_mvp_for_15_year/nfb9izo/)) (older). This is a request from a user weighing a move from Lovable to Bubble.
- Blink.new: “it just gets the design part right. Clean UI, proper spacing, even animations.” ([reddit, 2025-10-12](https://www.reddit.com/r/vibecoding/comments/1my9r4x/how_do_you_make_your_app_look_beautiful_with_vibe/nj3a0fe/)). It reads like promotion, so it carries little weight.

### a0.dev, Bolt (Expo), Anything (Create.xyz), Thunkable, Adalo, Natively: no usable motion snippets. THIN
- Targeted searches on Reddit, X and YouTube found no user comments about motion, animation or haptics for these tools.
- Bolt, Adalo and Thunkable appear only in generic "best builder" threads, about reliability or cost.
- This silence is itself a finding: no one praises or blames these tools for motion.

### General: vibe-coded apps (32 snippets, 29 users)
- **T5/T6 (25 users for T6, 22 for T5):** the "vibe-coded look" is described as:
  - purple gradients, glassy cards, emoji icons, default fonts and generic layouts;
  - cheap feel;
  - static screens;
  - AI-generated onboarding that is "exhausting".
- **Fixes users report:**
  - design references and screen recordings;
  - design-system rules files;
  - design skills such as Impeccable or frontend-design;
  - Reanimated, Lottie and haptics;
  - section-by-section iteration.
- **Strongest quotes:**
  - “The feel matters as much as the visuals. Instant feedback on presses, haptics and small animations all help.” ([reddit, 2026-11-07](https://www.reddit.com/r/reactnative/comments/1xpm0by/how_do_i_prevent_my_ui_from_looking_like_ai_slop/19sai49m82dj7/))
  - “dont ask the AI for “nicer animations”, give it a reference. Screen record an app you like, describe exactly what happens (button scales a bit, haptic tick, confetti when you unlock something) and ask for exactly that.” ([reddit, 2026-10-18](https://www.reddit.com/r/ProductivityApps/comments/1x93op8/how_could_i_make_my_app_animationfeedback_better/philfvy/))
  - “In its current state I'm not touching your app because vibecoded look=lazy slop” ([reddit, 2026-10-25](https://www.reddit.com/r/webdesign/comments/1xeor1e/wondering_what_people_think_of_my_landing_page/19rm1suij1bpe/))
  - “Also, yes, it makes it feel cheap and this is a growing sentiment across the Internet, similarly with how AI art feels cheap.” ([reddit, 2026-07-12](https://www.reddit.com/r/vibecoding/comments/1uu8r51/does_vibecoded_make_an_app_feel_cheap/ox1wxm8/))
  - “if you write iOS apps, you ask it to do some animations. It will do it for you, but you are at it's mercy of writing complete custom code” ([hn, 2026-08-04](https://news.ycombinator.com/item?id=49171787))

### General: React Native / Expo community expectations (32 snippets, 28 users)
- **T6 (28 users):** what developers say makes an app feel polished:
  - Reanimated + Gesture Handler;
  - native stack and native tabs (Liquid Glass);
  - shared-element transitions, with the caveat that they are hard and need an interruptible back swipe;
  - haptics, good on iOS and messy on Android;
  - animated onboarding (Lottie, Rive or Reanimated);
  - testing smoothness on a real device;
  - avoiding the WebView feel.
- **Strongest quotes:**
  - “For motion: react-native-reanimated + react-native-gesture-handler is the backbone. Moti sits on top if you want simpler declarative animations” ([reddit, 2026-06-28](https://www.reddit.com/r/reactnative/comments/1uhtwrp/rn/oubv673/))
  - “Starting a transition is the easy bit to show; reversing it halfway through while keeping the shared element in place is where it starts to feel truly native.” ([x, 2026-11-11](https://x.com/Talljackcv/status/2120527220863275373))
  - “getting it smooth really does make the whole app feel way more premium.” ([reddit, 2025-11-20](https://www.reddit.com/r/reactnative/comments/1p1ah11/anyone_else_feel_like_animations_are_the_real/npuz8m5/))
  - “A great native app on an iPhone feels far superior to a mobile website. The gestures, the stack navigator, haptics, scrolling, native ui primitives, etc…” ([hn, 2025-09-16](https://news.ycombinator.com/item?id=45257477))

---

## Newer AI mobile app builders found

| Tool | URL | Evidence it is real and active | User feedback (motion and polish) |
|---|---|---|---|
| Rork Max | rork.com | Many X builder posts from 2026-02 to 2026-07 about native SwiftUI apps and games built with it | Credited for Dynamic Island and native animations: “I generated a fully native game with Dynamic Island animations from ONE prompt. Rork Max is insane.” ([x, 2026-04-04](https://x.com/PrajwalTomar_/status/2040437541862867383)) (may be sponsored) |
| Darvin.dev (Flutter vibe coding) | darvin.dev | Reddit r/FlutterDev comments from 2025-10-23 and 2025-12-28 recommending it; "a couple of apps on store already" ([link](https://www.reddit.com/r/FlutterDev/comments/1odtwk9/rork_ai_vs_flutterflow_vs_regular_coding/nkx50qn/)) | Claimed to beat React Native builders for "heavier animations" (possibly promotional) |
| Dreamflow (FlutterFlow's AI successor) | dreamflow.app | r/FlutterDev comment, 2025-10-24 ([link](https://www.reddit.com/r/FlutterDev/comments/1odtwk9/rork_ai_vs_flutterflow_vs_regular_coding/nl4ony4/)) | None on motion |
| OnSpace AI | apps.apple.com/us/app/id6746471538 | App Store app with 18 reviews; latest 2026-11-05 | Reviews are about credits and reliability; nothing on motion |
| Modaal (Lovable to native app) | — | Founder posts on r/lovable and r/nocode, 2026-10 (staff, so excluded from snippets) | Positions itself on "push that feels native, smooth scrolling" for users leaving wrappers |
| VibeCoder (native Swift and Kotlin) | — | Founder post on r/vibecoding, 2026-04-28 (staff, so excluded) | Claims "users feel native vs. wrapped" |
| Primio AI App Builder (Flutter) | youtube.com/watch?v=EoxKooB8qSA | YouTube demo with 34.7k views, about 3 weeks old (real-time 3D in Flutter Scene) | None yet |
| Hercules, HyperDev, Appy Pie AI, Dyad | YouTube reviews (Pak_aYg60To, RhZbpbfLT90, 7VVnmOQWImo); X post on Dyad (2099878285077586109) | Review videos from 2026-10 and 2026-11 | Web-first; nothing on motion |
| Related tooling users reach for to add motion | Lottie AI (LottieFiles), "reanimate" Claude Code skill, Impeccable or frontend-design skills, ExpoKit | X posts from 2026-11 with large reach; r/reactnative and r/vibecoding threads recommending Impeccable | Shows demand for motion that builders do not yet supply: users are adding motion with separate tools |

---

## What good looks like

Each item gives a concrete behaviour, why users care (a verbatim quote) and the builders users say do it well.

1. **Instant press feedback on every tappable element** (a scale-down or highlight plus a light haptic tick).
   - Why: “The feel matters as much as the visuals. Instant feedback on presses, haptics and small animations all help.” ([reddit, 2026-11-07](https://www.reddit.com/r/reactnative/comments/1xpm0by/how_do_i_prevent_my_ui_from_looking_like_ai_slop/19sai49m82dj7/))
   - Done well by: Vibecode (haptics can be picked in the builder). Most other builders get no credit; users add it themselves.
2. **Haptics on key actions only** (confirm, success, unlock, swipe-to-reply), with an Android fallback.
   - Why: “dont ask the AI for “nicer animations”, give it a reference. Screen record an app you like, describe exactly what happens (button scales a bit, haptic tick, confetti when you unlock something) and ask for exactly that.” ([reddit, 2026-10-18](https://www.reddit.com/r/ProductivityApps/comments/1x93op8/how_could_i_make_my_app_animationfeedback_better/philfvy/)) and “It truly made me feel the app and feel my achievements by making heavy use of sound effects and haptic feedback.” ([reddit, 2026-01-20](https://www.reddit.com/r/iOSProgramming/comments/1qigj1t/we_often_neglect_sound_and_haptics_in_our_apps/))
   - Done well by: Vibecode (“added haptics to actions!” ([x, 2025-10-30](https://x.com/curious_product/status/1983857625000513678))). Caveat for Android: “On iPhones haptics generally feel pretty good, but on Android they are a mess.” ([reddit, 2025-12-29](https://www.reddit.com/r/expo/comments/1py8w6r/why_big_social_apps_dont_use_haptics_in_their/nwgxas2/))
3. **Native navigation primitives instead of web or JS imitations** (native stack with large-title header, native tab bar, back swipe).
   - Why: “A great native app on an iPhone feels far superior to a mobile website. The gestures, the stack navigator, haptics, scrolling, native ui primitives, etc…” ([hn, 2025-09-16](https://news.ycombinator.com/item?id=45257477)) and “It’s just the native stack navigator header. You get this for free with expo router / react navigation if you configure headerLargeTitle.” ([reddit, 2025-07-25](https://www.reddit.com/r/reactnative/comments/1m8g4b4/can_this_animationtransition_be_easily_achieved/n50r21q/))
   - Done well by: Rork Max (native SwiftUI, “And honestly… it feels solid. Love Native UI.” ([x, 2026-02-23](https://x.com/alexcooldev/status/2025982606882615712))). Lovable and Replit wrappers fail here (“If you just need something in the stores fast, wrapping the web app with Capacitor works, but it will feel like a website.” ([reddit, 2026-09-28](https://www.reddit.com/r/lovable/comments/1wq7ev0/why_cant_i_create_react_nativeexpo_mobile_apps_in/pcj1z2y/))).
4. **Smooth tab and modal transitions with no jank, checked on a real device and not only the simulator.**
   - Why: “Animations feel smoother than my custom implementation (especially tab switches + modals).” ([reddit, 2025-11-21](https://www.reddit.com/r/expo/comments/1p322nx/is_expos_native_tabs_liquid_glass_ready_for/)) and “someone said the animations looked laggy 👀 Turns out… they were right but only on simulator. I’d been testing on Rork simulator + my own simulator the whole time → UI felt choppy.” ([x, 2026-04-23](https://x.com/alexcooldev/status/2047378078893294020))
   - Done well by: no builder gets credit. Users find out by testing on a device (Rork, FlutterFlow).
5. **Shared-element transitions you can interrupt** (a grid item expands into a detail hero, and a back swipe reverses it halfway).
   - Why: “Starting a transition is the easy bit to show; reversing it halfway through while keeping the shared element in place is where it starts to feel truly native.” ([x, 2026-11-11](https://x.com/Talljackcv/status/2120527220863275373))
   - Done well by: none. Expo Router v6 users praise it (“Shared Element Transitions in @expo Router v6 feel like pure magic! 🪄 Tried it out — smooth Transition and scale, no custom workarounds needed.” ([x, 2026-01-03](https://x.com/m090009/status/2007502429957546031))), but no builder ships it.
6. **Animated onboarding with a mascot or illustration** (Lottie, Rive or a Reanimated sequence), leading into the paywall.
   - Why: “built the onboarding for my app entirely in reanimated. no lottie, no video. one shared value drives the whole sequence and every element interpolates its position, rotation and scale off it across the scenes.” ([x, 2026-06-26](https://x.com/ankitsehgal94/status/2070545102918025320)) and “These small details make you feel more connected to the app. For the onboarding animations, I use Lottie.” ([x, 2025-10-21](https://x.com/Nishit_Dave_/status/1980625433587773662))
   - Done well by: no builder by default. A solo founder who builds with Rork re-prompted for it (“vibe-code the onboarding again: more animations, more mascot moments → better brand recognition.” ([x, 2025-12-29](https://x.com/alexcooldev/status/2005722343197528070))).
7. **Celebration and progress moments** (confetti or a burst on unlock, streak and combo animations, sound plus haptic).
   - Why: “It truly made me feel the app and feel my achievements by making heavy use of sound effects and haptic feedback.” ([reddit, 2026-01-20](https://www.reddit.com/r/iOSProgramming/comments/1qigj1t/we_often_neglect_sound_and_haptics_in_our_apps/))
   - Done well by: Rork (games: “Fable 5 + Rork generated: → fish that hunt and flee based on your size → an endless ocean → immersive underwater effects →smooth growth & evolution → touch controls + camera tracking →combo streak animations” ([x, 2026-07-09](https://x.com/KCodes7777/status/2075310143756030286))) and Base44 (game entries).
8. **Purposeful easing and springs in the 150–250 ms range, not default linear fades.**
   - Why: “one accent color used sparingly, and subtle motion (150-250ms ease) instead of flashy.” ([reddit, 2026-06-28](https://www.reddit.com/r/reactnative/comments/1uhtwrp/rn/oubv673/)) and “getting it smooth really does make the whole app feel way more premium.” ([reddit, 2025-11-20](https://www.reddit.com/r/reactnative/comments/1p1ah11/anyone_else_feel_like_animations_are_the_real/npuz8m5/))
   - Done well by: none named.
9. **Motion that does not look like an AI default** (no "animated arrows", glow, or gradient shimmer for its own sake).
   - Why: “25 reasons your app looks vibecoded 1. emojis … 14. animated arrows” ([x, 2026-11-05](https://x.com/0xCzyzu/status/2118409928238846051)) and “has come a long way from those shitty gradient designs and absurd animations. this is me trying to one shot an app , this app has all the haptics and everything when tested.” ([x, 2026-01-12](https://x.com/AdvickB/status/2010580818822152340))
   - Done well by: none consistently. Users warn: “Every Rork app has the same UI/animations/paywalls.” ([x, 2026-06-28](https://x.com/MaxHirsch13/status/2071257558417830083))
10. **Every state handled and still feeling good** (empty, long text, large font, loading), with skeleton loaders rather than spinners.
    - Why: “Pick the one action that matters on that screen and make it obvious in all three states. That tends to do more for the app's feel than swapping gradients” ([reddit, 2026-11-08](https://www.reddit.com/r/reactnative/comments/1xpm0by/how_do_i_prevent_my_ui_from_looking_like_ai_slop/19sc6di6w1gck/))
    - Done well by: FlutterFlow (old evidence: “It has some cool FlutterFlow built stuff in there: Glassmorphism Friends system Slide to confirm widget Pretty popovers Light/Dark mode Smooth skeleton loading animations” ([x, 2023-06-26](https://x.com/giftit_app/status/1673224309408448513))). No current builder is credited for skeleton loading.
11. **Animations that survive navigation and edits** (no doubled loops, no broken swap animation, no slowdown over time).
    - Why: “I have an animation chain on "on page load" that is in a loop. When switching page and going back it get's all messed up (probably because it start 2 loops at the same time)” ([reddit, 2024-12-06](https://www.reddit.com/r/FlutterFlow/comments/1h83qfs/how_to_keep_animation_running_and_not_mess_up/)), “Currency place swap button is not aligning correctly , i.e. the swap animation is bugged” ([reddit, 2026-03-25](https://www.reddit.com/r/expo/comments/1s3d7c8/i_vibecoded_a_full_react_native_unit_currency/ocetu7n/)) and “Screen navigation becomes noticeably slower. Animations and transitions start feeling less smooth.” ([reddit, 2026-08-03](https://www.reddit.com/r/expo/comments/1ve5xmj/react_native_expo_app_gets_slower_the_longer_i/))
    - Done well by: none. These are common complaints about FlutterFlow and vibe-coded React Native apps.
12. **A distinct visual and motion identity taken from a reference app**, not the median of the training data.
    - Why: “dont ask the AI for “nicer animations”, give it a reference. Screen record an app you like, describe exactly what happens (button scales a bit, haptic tick, confetti when you unlock something) and ask for exactly that.” ([reddit, 2026-10-18](https://www.reddit.com/r/ProductivityApps/comments/1x93op8/how_could_i_make_my_app_animationfeedback_better/philfvy/)) and “If you don't ask it to deviate from the mean, you will get the mean every time.” ([reddit, 2026-01-14](https://www.reddit.com/r/ProductManagement/comments/1qccb1g/all_vibecoded_apps_look_the_same/nzj81a1/))
    - Done well by: none by default. Users get there with reference-driven prompts, design skills or Mobbin.

### Which builders users credit for good motion
- **Rork:** the most credit (about 6 users praise its animations, native UI and game motion), mostly on X. It also gets the strongest "same animations and paywalls in every app" criticism.
- **Vibecode:** credited for haptics specifically (about 4 users), with thin evidence.
- **FlutterFlow:** credited for being capable of "fancy animations" (3 users), but all of that praise is from before 2025-11.
- **Base44:** credited for animations in game entries (2 users). It is not a mobile-first builder.
- **Lovable, Replit, Bolt, a0.dev, Anything, Adalo, Thunkable, Draftbit, Bubble, Natively:** no user credits any of them for good motion. Lovable and Replit are blamed for a web-wrapper feel.
