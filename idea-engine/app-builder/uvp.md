# UVP: App Builder (Tayo)

Date: 2026-11-10. Skill: `cmba-uvp`. Reads [idea.md](idea.md), [validation.md](validation.md), [differentiators.md](differentiators.md), [angles.md](angles.md).

## Step 0: Applicability

| Precondition | Holds? | Evidence |
|---|---|---|
| Identifiable operator or brand | Yes | Tayo, founder; also ships Weight Class on the App Store |
| Direct channel | Yes | Web sign-up, free credits |
| Content-led acquisition plausible | Yes | Free-tool and how-to search intent is growing (+69%, +103%) |
| One operator can package and price it | Yes | Credit tiers plus a launch service |

**Verdict: APPLIES (4/4).** First-person founder voice is allowed. Use it on the About page, in Tayo's posts and on the launch service. Use product voice on the homepage.

## Step 1: Value statement

> I help solo founders who build subscription apps with AI get them through App Store review and found in search, so they can start earning from the app instead of fixing rejections.

**Self-exclusion test: passes.** These people read it and correctly walk away:
- Shopify store owners who want a store app (not a subscription app; they need catalog sync)
- Teams building internal or field-service apps
- Founders who want a web app only
- Game developers
- Agencies shipping apps for clients (served later, if at all)
- App-factory operators who want 20 near-identical apps (the product refuses look-alikes once the 4.3 check ships)

## Step 2: Objections and aspirations

Objections are **hypotheses** drawn from public threads, not interviews. They are paraphrased from the quotes in [validation.md](validation.md).

| # | Objection (their voice) | Source |
|---|---|---|
| O1 | "Every builder says 'publish to the App Store'. I still got rejected." | r/vibecoding rejection threads |
| O2 | "AI builders fall apart after a few screens and burn my credits on fixes." | "Rork works great. until you try to ship"; Vibecode Trustpilot |
| O3 | "Apple might flag my app as spam and I'll never know why." | r/iOSProgramming 4.3 threads |
| O4 | "Even if it's approved, nobody will find it." | "nobody uses your vibecoded apps" (519 upvotes) |
| O5 | "I already built it in Rork / Replit. I'm not starting over." | inferred from the competitor set |
| O6 | "Another tool vendor who has never shipped an app." | r/Semaglutide and r/Biohacking distrust of new apps (Weight Class research) |

| Aspiration (short, their words where possible) |
|---|
| "Approved first time" |
| "It just went through" |
| "People actually found it" |
| "The paywall worked on day one" |

## Step 3: Levels deeper

| # | Question | Answer | Rank |
|---|---|---|---|
| 1 | Who, more specifically? | Solo founders shipping a **subscription** app with an AI tool, at or near first submission | 1 |
| 2 | Demographic? | Mostly individual developer accounts; budgets at $20–200/mo builder tiers. Age and gender: N/A | 4 (cut) |
| 3 | What kind of solution? | Fast and self-serve, with a person to ask when review goes wrong | 2 |
| 4 | Psychographics? | Builders who want an app business, not a hobby; wary of hype; proud of one app that's clearly theirs | 3 |
| 5 | Geography? | N/A (global App Store; US search used for sizing) | 5 (cut) |

Kept: **subscription-app solo founders · self-serve with a human backstop · want a real app business, wary of hype.**
Cut: demographics (no evidence, adds nothing) and geography (online, global).

## Step 3b: Differentiation check (read from differentiators.md)

Competitors: rork.com, vibecodeapp.com, anything.com, superapp.dev, newly.app, Expo Launch (fetched 10 Nov 2026).

| Element | SHARED / OURS / THEIRS | Evidence |
|---|---|---|
| Build from a prompt, native output | SHARED | every fetched homepage |
| Screenshots and listing | SHARED | Rork "App Store screenshots in one click"; Newly; Superapp |
| Rejection checks | THEIRS (Rork, Superapp, Newly) / DEFICIT today | Rork "Catch App Store rejections early" |
| Paywall / subscriptions | SHARED | Superapp "ready to charge from day one" |
| Check against your own other apps for 4.3 look-alikes | **OURS once shipped** (POSITIONAL, 6–9 months) | absent on every fetched page |
| Founder runs a live subscription app | OURS (proof asset) | Weight Class |

Verdict read: **NONE today → POSITIONAL target.** So:
- The **full UVP** below carries the 4.3 / own-portfolio clause as its load-bearing `OURS` element. It is **not for publication until the pre-flight ships**.
- The **today version** contains no differentiator claim. It runs on audience narrowness, the enemy and founder proof, as the skill requires for NONE.

## Step 4: Movement / enemy statement

> AI app builders sell the dream of an app that makes thousands a month, then stop at "publish." That means you learn what Apple wants one rejection at a time, and since June 2026 a run of look-alike apps can cost you your developer account. Until now.

The enemy is the "ship it and hope" default of the builder industry, not a named company and not the founder.

## Step 5: Assembled UVP

### Full version (publish only after pre-flight and the 4.3 check ship)

**[MOVEMENT]** AI app builders sell the dream of an app that makes thousands a month, then stop at "publish," so you learn what Apple wants one rejection at a time. Since June 2026, a run of look-alike apps can cost you your developer account.
**[ASPIRATION + DEEP-DIVE]** App Builder is for solo founders shipping a subscription app who want it approved and found, not just built.
**[VALUE, twisted]** It plans every screen before it writes code, builds onboarding and a paywall into a real Expo app, and makes your App Store screenshots and keywords from the app's own screens. **[OURS]** Before you submit, it checks the app against the review rules that cause most rejections, and against your own other apps, so a look-alike or a missing paywall term is caught on your screen, not in App Review. (O1, O3)
**[PROOF]** I built it while shipping Weight Class, my own calorie and GLP-1 tracker on the App Store. It uses the same paywall, the same listing kit and the same checks. (O6)
**[OBJECTIONS]** Bring an app from Rork or Replit and the screenshot and keyword kit is free (O5). You edit on a canvas instead of re-prompting the whole app (O2, mechanism only; no quality claim). Your listing goes in with keywords chosen for search, not guesses (O4). You submit from your own Apple account, and if you'd rather not do it alone, I'll do it with you.

### Today version (true now; use until pre-flight ships)

AI app builders sell the dream, then stop at "publish." App Builder is for solo founders shipping a subscription app who want it live and found, not just built. It plans every screen first, builds onboarding and a paywall into a real Expo app for iOS and Android, and makes your App Store screenshots and keywords from your real screens. The screenshot and keyword kit is free, even for apps built somewhere else. I built it while shipping my own subscription app, Weight Class. A rejection pre-flight is next.

### Objection trace

| Objection | Answered in full version by |
|---|---|
| O1 rejected anyway | rule checks before submission |
| O2 falls apart / burns credits | screens planned first; canvas edits (mechanism only, unproven for quality; see Assumptions) |
| O3 spam flag | own-portfolio look-alike check |
| O4 nobody finds it | keywords chosen for search |
| O5 already built elsewhere | free kit for any app |
| O6 vendor never shipped | Weight Class proof |

## Derivatives
- **LinkedIn / X tagline (≤220 chars):** "Building App Builder: AI that builds subscription apps with the onboarding, paywall, App Store screenshots and keywords done. I also ship Weight Class, a calorie + GLP-1 tracker on the App Store."
- **Site hero (today):** "Build your subscription app. Get it found." / Subhead: "AI that plans your screens, builds onboarding and a paywall into a real Expo app, and makes your App Store screenshots and keywords. Start free with 100 credits."
- **Site hero (after pre-flight ships):** "Check your app against Apple's rules before Apple does." / Subhead: "AI-built subscription apps with the paywall, listing and review checks already done, including a look-alike check against your own apps."
- **One-line intro for DMs and podcasts:** "I'm Tayo. I ship a subscription app, and I build App Builder so other solo founders can get theirs through review and found."

## Assumptions and Unknowns
- Objections and aspirations are hypotheses from public threads. To confirm, ask in 30-for-30 calls: "What almost stopped you from submitting?" and "What would a perfect first submission feel like?"
- "Plans every screen first" helping quality past ~5 screens is **unproven**. Do not claim better quality until it is measured (for example, credits spent per fix on 10-screen apps).
- No user counts, approval rates or Weight Class figures are claimed.
- The differentiator is POSITIONAL with a 6–9 month shelf life, so the movement statement rests on the enemy (the "ship and hope" default), not on the feature.
