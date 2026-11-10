# 10 app ideas, ranked by real demand

Scanned 2026-11-10 with the demand-finder skill. Assumption: consumer subscription apps a solo founder can ship with the App Builder (Expo/React Native), tested Papermark-style. The best target is an incumbent that recently got worse, plus measured demand.

**Method.** Three DataForSEO volume pulls (254 keywords, US, monthly volume, CPC, and YoY = last 6 months vs the same months a year before). One X and Reddit pull for the shortlist. Web checks on each incumbent. Total treg spend: about **0.29 dollars** (scan1 0.09, scan2 0.09, scan3 0.10). Raw data is in `scan1/`, `scan2/`, `scan3/`.

**Honest ceiling.** Every idea below sits on rungs 2–3 of the evidence ladder (search pull, complaints, CPC). **None is BUILD.** Each needs the smoke test in its section before any code.

Caveats: volumes under ~100/mo are noisy, and YoY on small numbers swings a lot. CPC is Google Ads advertiser bids, which are a buying signal but not proof that app users pay.

## The ranking

| # | Idea | Strongest number | Incumbent got worse? | Verdict |
|---|---|---|---|---|
| 1 | Bill splitter with no daily cap (Splitwise alternative) | "bill splitting app" 4,400/mo, **+44%**, CPC 5.81 | **Yes.** Daily expense cap on free since late 2023, plus ads | **TEST** |
| 2 | Subscription tracker without a bank login (Rocket Money alternative) | "subscription tracker app" 1,600/mo, **+87%**, CPC **16.08** | Partly. Upsell and cancel complaints, bank-link worries | **TEST** |
| 3 | AI food and ingredient scanner (Yuka alternative) | "food scanner app" 8,100/mo, **+121%**; "yuka alternative" CPC **29.34** | Not verified | **TEST** |
| 4 | Quit-vaping coach | "quit vaping app" 1,300/mo, **+215%**, CPC 7.10 | No single incumbent; field crowded with clones | **TEST** (crowded) |
| 5 | AI Bible study for small groups | "bible app" 90,500/mo, **+109%**; "bible study app" 8,100, +40% | No. YouVersion is free and huge, so the angle must be study, not reading | **TEST** |
| 6 | Read-later app for ex-Pocket users | "read it later app" 3,600/mo, **+29%**, CPC 9.07 | **Yes.** Pocket shut down July 2025; Omnivore shut down late 2024 | **TEST** (timing risk) |
| 7 | Simple migraine tracker | "migraine tracker app" 590/mo, **+56%** | Partly. Migraine Buddy's paid tier is 69.99 dollars/yr | **TEST** (small) |
| 8 | Book tracker for book clubs (Goodreads alternative) | "book tracker app" 1,000/mo, **+59%** | **Yes** (stagnant under Amazon), but StoryGraph already took the "better Goodreads" slot | **PIVOT** → book-club angle |
| 9 | Free offline hiking maps (AllTrails alternative) | "hiking app" 5,400/mo, +19%; "free hiking app" 590, +28% | **Yes.** Peak tier at 79.99 dollars/yr since May 2025 | **PIVOT** → regional or offline-only |
| 10 | Workout log with an AI coach | "workout tracker app" 5,400/mo, **+77%**; "gym log app" 260, +167% | **No.** Hevy and Strong are healthy and still sell lifetime plans | **PIVOT** → a narrow buyer |

**Cut from the list:**
- "ai photo editor" (201,000, +101%): too crowded and capital-heavy.
- "ai girlfriend/companion" (+93% / +47%): content and App Store review risk.
- "pet care app" (1,000, +78%, CPC 6.59): a close 11th; see near misses.

---

## 1. Bill splitter with no daily cap

**Test sentence:** "A free, ad-free Splitwise alternative with no daily expense limit, for roommates and group trips."

**Incumbent check:**
- Splitwise added a daily cap on free expenses in late 2023. Sources disagree on the number (3–5 per day) and Splitwise hasn't published it.
- Pro costs about 4.99 dollars/mo or 39.99 dollars/yr.
- No source reports the cap being loosened.
- This is the textbook Papermark opening: an incumbent that made its free plan worse.

**Evidence:**

| Signal | Number |
|---|---|
| "bill splitting app" | 4,400/mo, +44%, CPC 5.81 |
| "splitwise alternative" | 590/mo, −31%, CPC 9.91 |
| "splitwise pro" | 590/mo, +10% |
| "splitwise free limit" | 90/mo, +32% |
| X: "my splitwise alternative reco: tricount! it has no limit…" ([post](https://x.com/wonjakeist/status/2114993872732582222)) | 537 likes and 580 bookmarks from a 485-follower account (≈2,300 engagements per 1k followers, a huge outlier) |
| X: "You open Splitwise… Upgrade to Splitwise Pro to continue" ([post](https://x.com/heynavtoor/status/2053075628010987932)) | 24 likes, 27 bookmarks |
| Reddit r/roommates "Splitwise alternatives" ([thread](https://www.reddit.com/r/roommates/comments/1vez5sg/splitwise_alternatives/)) | 40 comments |
| Reddit r/indianstartups "6 months building a Splitwise alternative… 720 users" ([thread](https://www.reddit.com/r/indianstartups/comments/1thh5a0/6_months_building_a_splitwise_alternative_5k/)) | 103 upvotes, 97 comments |
| Reddit r/vadodara "Splitwise is basically unusable now with all the daily limits and aggressive paywalls" | 28 comments |

**Biggest risk:** the people who want this want it *free*. Tricount and many indie clones already give that away, so monetising is the hard part, not demand.

**Possible paid hook:** scan a receipt and split it by item, or trip-budget exports.

**App Builder fit:** high. It's CRUD, groups and a camera, the ideal one-week build.

## 2. Subscription tracker without a bank login

**Test sentence:** "Track and cancel subscriptions without linking your bank, a private Rocket Money alternative."

**Incumbent check:** Rocket Money charges a sliding 6–14 dollars/mo (sources vary). Complaint themes:
- 273 BBB complaints in 3 years;
- aggressive upselling and a hard-to-find cancel button;
- the bank-credential linking that many users dislike;
- a 35–60% bill-negotiation fee.

I found no evidence of a 2025 price hike.

**Evidence:**

| Signal | Number |
|---|---|
| "subscription tracker app" | 1,600/mo, **+87%**, CPC **16.08** (highest buyer-intent CPC on the list) |
| "cancel subscriptions app" | 1,900/mo, −52%, CPC 12.25 |
| "subscription cancel app" | 1,600/mo, −14%, CPC 11.38 |
| "rocket money alternative" | 720/mo, +14%, CPC 7.31 |
| "rocket money free alternative" | 110/mo, **+270%** (small base) |
| "app like rocket money" | 390/mo, CPC 11.02 |
| Reddit r/ProductivityApps "I'm looking for a better subscription tracker app" ([thread](https://www.reddit.com/r/ProductivityApps/comments/1u77ddl/im_looking_for_a_better_subscription_tracker_app/)) | 63 comments |
| Reddit r/povertyfinance "How do you track subscriptions?" ([thread](https://www.reddit.com/r/povertyfinance/comments/1tyhvrt/how_do_you_track_subscriptions/)) | 41 comments |
| X: a founder says he made 1,000 dollars from a subscription-tracker app "everyone said was useless" ([post](https://x.com/sudorevolt/status/1997202939249938690)) | self-reported, unverified |

**Biggest risk:** without a bank feed, users must add subscriptions themselves. The product has to make entry nearly free, for example by forwarding receipt emails or scanning App Store subscriptions. Otherwise people churn after a week.

**App Builder fit:** high, with notifications and a widget.

## 3. AI food and ingredient scanner

**Test sentence:** "Scan any food and see what's in it for *you*: allergies, GLP-1 diet, kids. A Yuka alternative that knows your profile."

**Incumbent check:** Yuka is big ("yuka app" 60,500/mo, though −26% YoY). I did **not** verify any recent pricing or product change, so this is not a "just got worse" opening. The pull is category growth.

**Evidence:**

| Signal | Number |
|---|---|
| "food scanner app" | 8,100/mo, **+121%** |
| "yuka alternative" | 50/mo but CPC **29.34** (the highest CPC in all three scans) |
| "app like yuka" | 390/mo |
| "yuka app" | 60,500/mo, −26% |

**Biggest risk:** data parity. A product database plus scoring is a real moat, and a wrong health claim is a liability. Use an open database (Open Food Facts) and avoid medical claims.

**App Builder fit:** medium. It needs a barcode scanner, an external database and an LLM call.

## 4. Quit-vaping coach

**Test sentence:** "Quit vaping with a coach that counts your puffs and tapers you down, no weekly subscription trap."

**Incumbent check:**
- No single leader.
- A crowded App Store of clones: PuffPal at 0.99 dollars/week after a trial; HabitHalo at a one-time 9.99 dollars, pitched *against* weekly subscriptions; QuitVape at 4.99 dollars/mo; many more.
- A free "no ads, no paywall" entrant posted on r/QuitVaping in Nov 2026.

**Evidence:**

| Signal | Number |
|---|---|
| "quit vaping app" | 1,300/mo, **+215%**, CPC 7.10 (biggest growth on a 1k+ term) |
| "quit vaping app free" | 40/mo, +33% |
| X: a founder says his quit-vaping app reached 44–45K dollars/month ([post 1](https://x.com/StevenCravotta/status/2117642960187929006), [post 2](https://x.com/StevenCravotta/status/2117280572070679035)) | self-reported, **unverified**, but it shows people pay in this category |
| Reddit r/stopsmoking "Anyone else dislike the apps?" ([thread](https://www.reddit.com/r/stopsmoking/comments/1tq50mn/anyone_else_dislike_the_apps/)) | 7 comments (complaints in users' own words) |

**Biggest risk:** saturation. Many clones are already fighting over the same keyword, so the edge must come from distribution (TikTok, creator UGC) rather than features. That plays to the UGC pipeline you already have.

**App Builder fit:** high. It's a counter, a streak, a widget and a paywall.

## 5. AI Bible study for small groups

**Test sentence:** "An AI Bible study guide that builds a weekly plan and discussion questions for your small group."

**Incumbent check:**
- YouVersion passed 1 billion installs in Nov 2025 and is free. Competing on *reading* is pointless.
- Hallow (Catholic prayer) made about 40M dollars net in 2025 (Appfigures estimate).
- Bible Chat (AI) had made about 6.3M dollars by April 2025 and was the top-grossing Bible app at the time (Appfigures, early-2025 data).

So paid AI study tools are proven, and the open space is *study and groups*.

**Evidence:**

| Signal | Number |
|---|---|
| "bible app" | 90,500/mo, **+109%** |
| "bible study app" | 8,100/mo, **+40%**, CPC 4.15 |
| "ai bible app" | 260/mo, −29%, CPC 7.35 |
| "prayer app" | 4,400/mo, −6% |

**Biggest risk:** trust. Doctrinal accuracy and denomination differences matter to these buyers. The test should name the tradition (e.g. non-denominational Protestant small groups) rather than "everyone".

**App Builder fit:** high.

## 6. Read-later app for ex-Pocket users

**Test sentence:** "A Pocket replacement that turns your saved articles into a 10-minute daily read (or listen)."

**Incumbent check:**
- Mozilla shut Pocket down on 8 July 2025; data exports ended 8 Oct 2025.
- Omnivore was acquired by ElevenLabs and shut down in late 2024.
- Remaining options: Instapaper, Readwise Reader, wallabag, Raindrop, mymind.

**Evidence:**

| Signal | Number |
|---|---|
| "read it later app" | 3,600/mo, **+29%**, CPC 9.07 |
| "pocket alternative" | 260/mo, CPC 12.29, **−86%** (the switching spike has passed) |
| Reddit r/ProductivityApps "I built a read-later app as an Omnivore replacement" ([thread](https://www.reddit.com/gallery/1xj9joz)) | 46 upvotes, 54 comments |
| Reddit r/firefox "Alternative to pocket" ([thread](https://www.reddit.com/r/firefox/comments/1qmedoz/alternative_to_pocket_for_good_readsarticles/)) | 11 comments |

**Biggest risk:** timing. The refugee wave was 2025, and people have already resettled. Growth in the generic term says the category is alive, but you are now beating Instapaper and Readwise, not catching refugees.

**App Builder fit:** medium. It needs a share-sheet extension and article parsing.

## 7. Simple migraine tracker

**Test sentence:** "One-tap migraine logging that finds your triggers, without the 70-dollar-a-year upsell."

**Incumbent check:** Migraine Buddy is well rated (4.8). Its MBplus annual plan is 69.99 dollars with no free trial. I found no complaint wave in 2025; the pull is "simple".

**Evidence:**

| Signal | Number |
|---|---|
| "migraine tracker app" | 590/mo, **+56%**, CPC 3.71 |
| "migraine app" | 320/mo, +18%, CPC 5.13 |
| "headache tracker app" | 260/mo, +4% |
| Reddit r/migraine "Simple Migraine Tracking (I beg)" ([thread](https://www.reddit.com/r/migraine/comments/1vg3p1r/simple_migraine_tracking_i_beg/)) | 40 upvotes, **68 comments**, a title that is the brief |
| Reddit r/migraine "Migraine Tracker Apps" / "go-to tracking app" / "Best Migraine Tracking App?" | 50 / 37 / 23 comments |

**Biggest risk:** a small market. Search is in the hundreds, so growth must come from r/migraine and creators, not SEO.

**App Builder fit:** high. It's logging, charts and Apple Health weather/sleep inputs.

## 8. Book tracker for book clubs → PIVOT

**Test sentence (pivoted):** "Run your book club in one app: pick the book, track everyone's progress, hold the discussion."

**Why pivot:**
- Goodreads *is* stagnant under Amazon: dated design, review-bombing complaints.
- But StoryGraph already owns "the better Goodreads". It grew from 2M to about 4M users in 2023–2025, and "storygraph" gets 90,500/mo searches.
- The generic clone slot is taken.

**Evidence:**

| Signal | Number |
|---|---|
| "book tracker app" | 1,000/mo, **+59%**, CPC 0.92 |
| "goodreads alternative" | 2,400/mo, −30%, CPC 0.51 |
| CPC | Below 1 dollar on every book term, so advertisers don't make money here |
| X: "is there a need for a goodreads alternative that has the option to also host book clubs…" ([post](https://x.com/_hiteshbandhu/status/2111975293250662704)) | shows the pivot angle |
| Reddit r/BuyFromEU "My Goodreads alternative is now live" ([thread](https://www.reddit.com/r/BuyFromEU/comments/1wydj6j/my_goodreads_alternative_is_now_live_as_requested/)) | 235 upvotes, 97 comments |
| Reddit r/ebooks "New open source Goodreads alternative" | 132 upvotes, 37 comments |

**Biggest risk:** readers love trackers but rarely pay. The low CPC says so. Book clubs, which have an organiser with a reason to pay, are the better buyer.

## 9. Free offline hiking maps → PIVOT

**Test sentence (pivoted):** "Free offline trail maps for [one region], with no subscription to download a map."

**Incumbent check:**
- AllTrails Plus costs 35.99 dollars/yr.
- The Peak tier (79.99 dollars/yr, May 2025) moved custom routes higher up.
- Offline maps (a safety feature) are paywalled, and that has angered users since at least 2023.
- An offline-maps crash bug was reported in July 2026.

**Evidence:**

| Signal | Number |
|---|---|
| "hiking app" | 5,400/mo, +19% |
| "free hiking app" | 590/mo, +28% |
| "alltrails free alternative" | 70/mo, +89% (small base) |
| Reddit r/PNWhiking "Alternatives to AllTrails" ([thread](https://www.reddit.com/r/PNWhiking/comments/1t35mqt/alternatives_to_alltrails/)) | 192 upvotes, **99 comments** |
| Reddit r/alltrails "AllTrails don't waste your money" | 36 comments |

**Why pivot:** trail data is a multi-year parity problem, the same trap the Papermark caveat warns about. A single region using OpenStreetMap data can reach parity in weeks.

## 10. Workout log with an AI coach → PIVOT

**Why pivot:** demand is real but the incumbents are healthy.
- "workout tracker app" gets 5,400/mo (+77%) and "gym log app" 260 (+167%).
- r/workout threads asking "what's the best app for tracking workouts?" draw 66–134 comments each.
- But Hevy and Strong still sell lifetime plans (Hevy about 74.99 dollars), and I found no complaint wave.
- "hevy alternative" and "strong app alternative" each get only 20/mo.

**Pivot options:** a narrow buyer the big apps ignore (e.g. over-50 strength, postpartum, or GLP-1 users protecting muscle), with an AI coach that reads the log and adjusts the next session.

**App Builder fit:** high.

---

## Near misses (measured, not ranked)

- **Pet care app:** 1,000/mo, +78%, CPC 6.59. "dog health app" is 50/mo but +43% with CPC 8.43. Rising, but there's no clear incumbent to beat. It's the next one to scan.
- **Finch-style self-care pet:** "finch app" gets 22,200/mo with CPC 11.03 (a big, monetisable brand), but −28% YoY. "finch alternative" is tiny (70/mo).
- **Huckleberry (baby sleep):** "huckleberry app" 5,400/mo, +4%; "huckleberry alternative" 70, +59%. Steady, not opening.
- **Homework helper / study app:** +63% / +32%, but Gauth and Photomath have that space locked down.

## What wasn't measured

- App Store keyword popularity and download/revenue estimates per competitor. That needs Appfigures or Sensor Tower, which I don't have.
- App Store review mining for ideas 2–7. Only the web summaries and Reddit were read.
- X returned little for most queries. The scan shows that X isn't where these buyers talk; Reddit and TikTok are.
- Meta Ad Library for long-running app ads. Running the shortlist through Keepwatch would show which competitors have funnels that pay.
- The "44K dollars/month" quit-vaping and "1,000 dollars" tracker figures are founders' own claims.

## The smoke test (use for any idea; pick 2 to run first)

**Recommended first two:**
- **#1 Bill splitter:** the incumbent clearly got worse, and an outlier X post shows people share alternatives.
- **#2 Subscription tracker:** the highest CPC with growth, and a clear "no bank login" angle.

**Posts** (draft only; you post them).

Bill splitter:
- r/roommates and X: "Splitwise caps free users at a few expenses a day. I'm building a bill splitter with no limit and no ads, plus snap-a-receipt to split by item. Reply 'in' and I'll send you the TestFlight."
- TikTok: hook "POV: dinner with 6 friends and Splitwise says 'upgrade to continue'" → 10s demo of a receipt split → "link in bio to get early access".

Subscription tracker:
- r/ProductivityApps and r/povertyfinance: "I don't want to give an app my bank login just to find my subscriptions. Building a tracker that works from your receipts and App Store purchases instead. Would you pay 2.99 dollars once for it? Waitlist in comments."

**Landing page:** one page per idea, with:
- the headline = test sentence;
- 3 screenshots (the App Builder can mock these);
- a waitlist email form;
- a "Reserve lifetime for 9.99 dollars" fake-door button that says "not charged yet; we'll email you at launch".

**Pre-registered thresholds** (write them in your notes before posting and don't move them):
- **PASS (build v1):**
  - the post gets ≥ 5× your median engagement;
  - ≥ 10 intent replies ("link?", "when?", "need this");
  - waitlist ≥ 50, or ≥ 10% of landing visitors;
  - ≥ 1 person clicks the lifetime button and leaves an email.
- **KILL:** ≤ 2× median engagement and < 3 intent replies after 72 h.
- **In between:** change one thing (channel *or* angle) and retest once.

**Timeline:**
- Posts and landing pages up by **Fri 13 Nov 2026**.
- Read results **Mon 16 Nov**.
- Weekend build of the winner **21–22 Nov**.

## Verdict

Run **TEST** on #1 and #2 this week. Hold #3–#7 as the next batch.

**Biggest single risk across the list:** the strongest pull is for *free* (Splitwise, AllTrails, Pocket). Each test must include a price or lifetime button. Otherwise it will "pass" on likes and fail on revenue, which is the trap the Papermark caveats describe.
