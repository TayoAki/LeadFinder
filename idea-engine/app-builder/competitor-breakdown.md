# AI mobile app builders: features and what users say (2026-11-10)

This file merges three studies. The details and every source link are in:
- [features-part-a.md](features-part-a.md): Rork, Vibecode, Anything, a0.dev, Bitrig, Superapp, Newly, BuildNatively. Every [checklist](feature-taxonomy.md) row is filled in.
- [features-part-b.md](features-part-b.md): Replit, Bolt, Lovable, FlutterFlow, Draftbit, Adalo, Thunkable, Cabano. Every [checklist](feature-taxonomy.md) row is filled in.
- [reviews.md](reviews.md): 474 written App Store and Trustpilot reviews plus about 600 Reddit posts and comments, coded by theme.

## The one-line answer

Users love the first hour (fast, pretty, no code) and hate the next hundred: credit burn, fix loops, billing traps, lost projects, and rejections on the way to the App Store. Vibecode and Newly are racing to close the store gap. Nobody protects founders from Apple's spam rule (4.3) across their own apps, and nobody refunds the AI's own mistakes.

## Who does what (last-mile focus)

Legend: ✅ has it · ◐ partial · ❌ no · ? unverified.

| | Output | Code export | On-device preview | Paywall / IAP setup | Store listing + keywords | Screenshots | Pre-flight check | Submits for review | Google Play | Price (entry → top) |
|---|---|---|---|---|---|---|---|---|---|---|
| **Vibecode** | Swift (since Sep 10) + Expo | ◐ ($50/mo) | ✅ | ✅ creates products, IAP key, RevenueCat, test-buys | ✅ at publish | ◐ capture | ✅ Preflight (Expo) | ✅ (Swift) | ❌ | $20 → $200 |
| **Newly** | Expo | ✅ | ✅ | ✅ creates products | ✅ editor writes to ASC | ✅ designed, all languages | ◐ checklist + rejection-fix agent | ❌ (you press) | ✅ to production | ? |
| **Superapp** | Swift | ✅ | ? | ✅ RevenueCat | ✅ Selfdrive ASO (beta) | ? | ? | ◐ claims; docs say finish in ASC | ❌ | → $100 Max |
| **Rork** | Swift + Kotlin (no more Expo) | ◐ (paywalled) | ✅ | ◐ | ◐ | ✅ Screenshot Studio (free, iPhone) | ✅ AI App Store Reviewer (paid) | ❌ (TestFlight/ASC upload) | ◐ hard (per reviews) | $20 → $200+ |
| **Anything** | Expo | ✅ | ✅ | ? | ◐ | ✅ generator | ◐ checklist | ❌ | ? | $19 → $199 |
| **Bitrig** | Swift (Mac app, your own Claude/ChatGPT) | ✅ | ✅ | ✅ creates products | ? | ◐ capture | ? | ◐ claims | ❌ | $15 Pro |
| **a0.dev** | Expo | ✅ | ✅ | ? | ? | ? | ? | ❌ | ? | ? (no launches since Jul 2025) |
| **Replit** | Expo | ✅ | ✅ | ✅ RevenueCat syncs into ASC | ◐ | ✅ AI framed screenshots | ? | ◐ upload via Expo Launch; you press | ❌ | credits/usage |
| **Cabano** | SwiftUI (iOS only) | ? | ✅ simulator in browser | ✅ RevenueCat by chat | ❌ manual | ❌ manual | ? | ◐ TestFlight auto | ❌ | 100 free credits → $20 / $100 ($0.30/credit) |
| **FlutterFlow** | Flutter (new AI builder Nov 4) | ✅ | ✅ | ✅ RevenueCat actions (Sep 24) | ❌ | ❌ | ? | ◐ deploys to both stores | ✅ | $39 → $150 + seats |
| **Draftbit** | Expo | ✅ | ✅ | ◐ RevenueCat via MCP | ❌ | ❌ | ? | ✅ one-click, both stores | ✅ | $15 → $30 |
| **Thunkable** | own | ❌ | ✅ | ✅ RevenueCat blocks | ❌ | ❌ | ? | ✅ via store APIs | ✅ | $59 (1 live app) → $189 |
| **Adalo** | own | ◐ paid service | ✅ | ◐ IAPHUB | ❌ | ❌ | ? | ✅ | ✅ | $65 (2 apps) → $200 |
| **Bolt** | Expo (download) | ✅ | ◐ | ❌ | ❌ | ❌ | ❌ | ❌ you run EAS yourself | ❌ | credits |
| **Lovable** | web only (no React Native) | ✅ | ❌ (PWA / Capacitor yourself) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | credits |
| **BuildNatively** | website wrapper, no AI | ❌ | ◐ | ◐ | ❌ | ❌ | ❌ | ◐ | ✅ | ? |

**Last-mile ranking:** Vibecode (to Apple review and paywalls) > Newly (after review: rejection fixes, screenshots, Google Play) > Superapp (ASO and growth) > Replit > Cabano > Bitrig > Rork > Draftbit and Thunkable (simple publishing) > FlutterFlow > Anything > Adalo > a0 > Bolt > Lovable.

**Credit models worth copying or beating:**
- Newly charges no credits for builds or simulators.
- Anything refunds failed generations.
- Vibecode credits never expire.
- Vibecode bills failed builds by the minute.
- Rork charges simulator minutes.

**Acquisition (active Meta ads today):**
- Lovable: 537
- Replit: 18, growing
- Bolt: 6
- Superapp: 4
- Vibecode: 1
- Rork: 0 now, but 547 historically
- Newly: 0 now, but 158 historically
- All others: 0

## What users like (top praise)

1. **Speed and ease for non-coders** (68 reviews, 10 products): "Easy for beginners", about 20 minutes to TestFlight (Vibecode).
2. **Support,** when it exists (48 positive reviews). This is the biggest swing factor between 1★ and 5★.
3. **Native output without a Mac** (Rork) and output that **doesn't look AI-made** (Anything).
4. **Visual control, code export, and both stores from one project** (FlutterFlow).

## What users dislike (1–2★ reviews, then number of products)

| # | Theme | Reviews | Products |
|---|---|---|---|
| 1 | Credit burn and pricing surprises (paying for the AI's own mistakes) | 100 | 9 |
| 2 | Poor or no support | 53 | 8 |
| 3 | Bug loops and regressions ("fix one, break another") | 52 | 9 |
| 4 | Billing traps: unauthorized charges ($99–1,400 on Replit; a $320 auto top-up on Rork), hard cancel, no refunds | 48 | 7 |
| 5 | Crashes and slowness | 37 | 7 |
| 6 | Publishing pain: 9–10+ rejections, months in review, works in preview but not in TestFlight | 30 (+~60 Reddit posts) | 7 |
| 7 | Lost or locked projects (Vibecode's March update locked mobile projects) | 29 | 8 |
| 8 | Backend and login break in production | 26 | 7 |
| 9 | Falls apart as the app grows | 21 | 7 |

**Store stars hide recent sentiment:**
- Vibecode shows 4.65★, but its last 75 written reviews average 3.0.
- Replit iOS shows 4.72★, but its last 100 average 3.37, and its newest 20 on Trustpilot average 1.45.

**Where unhappy users go:** general coding agents (Claude Code, Codex, Cursor), not another builder.

## Why apps get rejected

From an Expo developer who is paid to finish these apps, plus the review data. The same list repeats:
- The release build crashes when the preview didn't.
- Secret keys are left in the app.
- No account deletion.
- Google login without Sign in with Apple.
- The paywall is missing restore, price or terms.
- No demo login for the reviewer.
- A broken iPad layout.
- Spam rejections (4.3) for template-heavy apps. One Rork user got 1 of 20 apps approved; the other 19 were rejected as spam. Fixes that worked: withdraw other pending apps, then appeal.

No review praised any builder's store-listing tools.

## Must-haves (table stakes)

1. A fast, good-looking first app for non-coders.
2. An on-device preview that matches the shipped build.
3. Predictable pricing with no charge for the AI's own errors.
4. Honest billing: easy cancel, no auto top-up without opt-in, clear refunds.
5. Login, database and keys that work in production.
6. GitHub and code export on every paid plan.
7. Fast human support.
8. Versioning and rollback, so no project is ever lost.

## Unmet needs to own

1. **An approval check that catches the common rejections before Apple does,** then guided submission. Rork, Vibecode, Anything and Newly have partial checks, and none covers the full list above.
2. **Protection against spam (4.3) rejections:** a uniqueness check against the founder's own apps and the category, less template sameness, one-at-a-time submission advice, and appeal help. Nobody does this.
3. **A paywall and in-app purchase setup that passes review the first time:** restore, price and terms built in, plus a gallery of paywall templates. Nobody has a gallery.
4. **A cap on what fixes cost:** credits back when the AI's own change fails or breaks something. Only Anything refunds failed generations.
5. **Google Play publishing for non-coders.** Vibecode, Superapp, Bitrig and Replit don't do it.
6. **Store listing and launch help** (screenshots, preview video, keywords). Newly and Superapp are moving here fast.

## What this means for App Builder

- The angle "Check before Apple does" is confirmed. Add **"and never pay for our mistakes"**: the biggest complaint category (100 reviews) is something no rival fully fixes.
- **Build first:**
  - the full pre-flight list above, with the 4.3 portfolio check;
  - a paywall template gallery that passes Apple's purchase rules;
  - parity between preview and the release build;
  - honest billing (no auto top-up, failed fixes refunded).
- **Watch Newly and Vibecode.** They will likely ship deeper pre-flight checks within months, so speed matters.

## Limits

- **Thin reviews:** a0.dev, Bitrig, Superapp and Cabano have too few independent reviews to analyze.
- **Not mined:** X, YouTube and Discord.
- **G2 and Capterra** ratings come from search snippets only.
- **Suspect reviews:**
  - Draftbit's Trustpilot score looks like reviews traded for credits, so it was excluded.
  - Bolt got a burst of 10 five-star reviews in two days.
  - Rork and Lovable invite their Trustpilot reviews, so both skew positive.
  - Newly's "4.9 from 847" is its own claim.
- **Some feature rows are unverified (?),** often because pricing pages render only with JavaScript. See each part file.
