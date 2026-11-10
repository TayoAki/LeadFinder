# Differentiators: App Builder

Date: 2026-11-10. Skill: `cmba-differentiate`. This file is the single source. Other artifacts read it and do not re-derive it.

**Competitor set (fetched 10 Nov 2026):**
- Rork: [rork.com](https://rork.com), [rork.com/ai-reviewer](https://rork.com/ai-reviewer), [rork.com/max](https://rork.com/max), plus [docs pricing](https://docs.rork.com/introduction/subscriptions) (from the research file)
- Vibecode: [vibecodeapp.com](https://www.vibecodeapp.com/)
- Anything: [anything.com](https://www.anything.com/)
- Superapp: [superapp.dev](https://superapp.dev/) (superappp.com redirects there)
- Newly: [newly.app](https://newly.app/)
- Replit + Expo Launch: [Expo Launch blog](https://expo.dev/blog/introducing-expo-launch); Replit details from [competitors-and-rules.md](competitors-and-rules.md)

**Why this set.** An indie maker searching for an AI way to build and ship a mobile subscription app compares these. They are mobile-first, credit-priced at $19–25 entry, and all promise "publish." Lovable and Bolt are web-first and not in the set.

**The subject's claims** come from the product brief. App Builder has no public site in the repo, so these are not fetched copy: prompt → planned screens → canvas; Expo/React Native for iOS and Android; onboarding and paywall built in; App Store keywords and description; App Store screenshot generation; "Start free with 100 credits"; a web builder that exports a normal Expo app.

## Claim inventory

Competitor wording is quoted from the live pages.

| Claim | App Builder | Rork | Vibecode | Anything | Superapp | Newly | Replit / Expo Launch | Verdict |
|---|---|---|---|---|---|---|---|---|
| Build an app from a prompt | yes | "create mobile apps by chatting with AI" | "Describe your idea, get a working app" | "Turn your words into mobile apps" | "AI that builds your iOS or web app" | "Idea To App Store In Minutes" | yes (Replit) | **SHARED** |
| Real native, not a webview | Expo / React Native | "Swift apps… Kotlin apps" | "native Swift apps" | "built with code" | "real native Swift instead of web wrappers" | "real native code, not webviews" | Expo | **SHARED** |
| iOS and Android | yes (one Expo project) | yes (Swift + Kotlin) | iOS (+ web) | mobile + web | iOS / Mac / Watch + web | "App Store & Play Store" | yes | **SHARED** |
| Submit to the App Store | **not in the brief** | "Two clicks to App Store" | "you can publish it to the App Store" | plan row "Submit to App Store" | "fully automated publishing" | "upload an iOS build to TestFlight from a chat" | Expo Launch "directly to the App Store" | **DEFICIT** |
| Rejection checks before review | **no** | "Catch App Store rejections early" (guidelines 1.x–5.x; paid plan) | — | — | "rejection rate close to zero" (unverified claim) | "Compliance Solved for you" | — | **DEFICIT** (THEIRS: Rork, Superapp, Newly) |
| App Store screenshots | yes | "App Store screenshots in one click" | — | — | "metadata, screenshots… ASO optimization" | "Generate… App Store and Play Store assets automatically" | — | **SHARED** |
| ASO keywords / description | yes | — | — | — | "ASO optimization", "Rank higher in App Store search" | assets only | — | **SHARED** (with Superapp) |
| Subscriptions / paywall | built into the app | RevenueCat gift program (docs) | IAP via agent (unverified) | RevenueCat partner | "Subscriptions and in-app purchases, ready to charge from day one" | RevenueCat partner | — | **SHARED** |
| Generated onboarding flow | yes | — | — | — | — | — | — | OURS on paper; COSMETIC (see below) |
| Plan screens first, then edit on a canvas | yes | — | — | — | — | — | — | OURS on paper; COSMETIC |
| Free start | 100 credits | 35 credits/mo, no publish | free plan, no submit | free tier | free credits | — | Expo Launch free beta | **SHARED** |
| Runs marketing for you | — | — | — | — | "runs your marketing while you sleep" | — | — | **THEIRS** (Superapp) |
| Checks a new app against the maker's own other apps (4.3 look-alikes) | not built | not on the page (reviewer lists 1.x–5.x but no 4.3) | — | — | — | — | — | **Nobody** today |
| Founder runs a live subscription app on the App Store | Tayo (Weight Class) | not stated | not stated | not stated | not stated | not stated | — | OURS (proof asset) |

## Deficits (competitor claims App Builder cannot make today)

1. **Submission from the builder.** Every rival claims it. Expo Launch does it free for any Expo app. Without it, "App-Store-ready" is not a claim App Builder can make.
2. **Pre-review rejection checks.** Rork sells a reviewer that covers trial/renewal disclosure, paywall terms, Sign in with Apple, account deletion and privacy declarations. Superapp and Newly claim compliance.
3. **Proof volume.** Vibecode shows 4.6★ from 3,324 ratings and advertises user revenue. Rork has $15M+ in funding. App Builder has no public proof yet.
4. **Distribution help.** Superapp says it runs App Store marketing.

The finding: the "App-Store-ready" idea in the research ([competitors-and-rules.md, Candidate edge 1](competitors-and-rules.md)) is now a **category claim**. Rork, Superapp and Newly make it on their homepages.

## Candidates and copy-cost

| # | Candidate | Source (1–6) | What would it cost the nearest rival (Rork) to copy, and why haven't they? | Tier |
|---|---|---|---|---|
| A | Onboarding + paywall + screenshots + keywords in one Expo app | — (bundle) | Nothing. Superapp already has most of it; Rork is one feature away. | **COSMETIC** |
| B | Plan screens first, then edit on a canvas | 6 (method) | Little. It is a UX choice, and the quality benefit is unproven. | **COSMETIC** |
| C | **Account-safe pre-flight with a 4.3 distinctness check.** Before submission, check the app against Apple's rules (2.1, 3.1.1/3.1.2, 4.2, 4.3, 4.8, 5.1.1, no keys in the bundle) **and** against the maker's own other apps and Apple's named saturated categories (dating, flashlight, sound effects, wallpaper, simple timers, fortune telling). Refuse to generate look-alike clones of the maker's own apps. | 4 (customer refused) + 6 (method) | Building the check costs Rork weeks. **Refusing clone volume costs revenue.** Credit builders earn per generation, and Vibecode's ads sell "$45K a month" app dreams. Turning away app-factory clones cuts credit use. They haven't done it because volume is their model. Apple's own similarity checks are private, so any check is a heuristic. | **POSITIONAL**, shelf life about 6–9 months |
| D | A free pre-flight and listing kit that works on Expo apps from **any** builder | 1 (constraint refused) | Rork gates its reviewer behind a paid plan and its own projects ("A paid Rork plan, any tier"). Opening it to rivals' users gives away a paid-plan hook. Possible, but against their model. | **POSITIONAL**, about 3–6 months |
| E | The founder runs a live subscription app; templates and checks are used on Weight Class's own releases | 2 (asset) | A rival can't buy a founder's live app. They could hire an indie developer or partner with one. It is proof, not product. | **POSITIONAL** (supporting proof only) |
| F | Done-with-you launch service, submitted from the maker's own account (4.2.6) | 3 (cost they'll bear) | Hours do not fit a $20 credit model. A funded rival could staff it, but it would cut margins. | **POSITIONAL** (offer element, not the differentiator) |

## VERDICT: NONE today → POSITIONAL target

**Today: NONE.** Every claim App Builder can make now is SHARED or COSMETIC, and two DEFICITS (submission, pre-review checks) block the "App-Store-ready" story. Today App Builder competes on **execution and price**: onboarding and paywall generated in, a free listing kit, and a founder who answers.

**Target (build next): POSITIONAL.**

**The differentiator:** *App Builder checks every app against Apple's review rules and against your own other apps before you submit, so a look-alike or a missing paywall term doesn't cost you a rejection or your developer account.*

Mechanism (why a rival will be slow to follow): rivals earn per generation, and the check deliberately refuses clone volume. Rork's paid reviewer does not cover 4.3 or a maker's portfolio. Apple tightened 4.3 on 9 Jun 2026: "Repeated submissions of this kind may lead to removal from the Apple Developer Program."

Shelf life: about 6–9 months. Any rival can add a 4.3 check. Plan the structural follow-on: a growing dataset of real rejection notes, mapped to fixes, collected from App Builder users with consent. A rival without that data can't match its accuracy. That is not built and not proven.

**Substitution test:** "Rork checks every app against Apple's review rules and against your own other apps before you submit." Rork's reviewer page lists guideline areas 1.x–5.x but says nothing about 4.3 or your other apps, so the sentence is **false for Rork today → passes**. The same holds for Superapp, Newly, Vibecode and Anything on their fetched pages. Re-run monthly.

**Rule for every other artifact:** do not publish this differentiator until (1) the pre-flight with the 4.3 check ships and (2) submission from the user's own account (App Store Connect API key) or a clean hand-off to Expo Launch exists. Until then, lead with what is true today: the free screenshot + keyword kit and the built-in paywall and onboarding.

## Deficits to close first (in order)
1. Submission from the user's own App Store Connect account (4.2.6). Fastest path: hand off to Expo Launch / EAS Submit.
2. Pre-flight v1 with checks mapped to guidelines 2.1, 3.1.1/3.1.2, 4.8, 5.1.1, iPad layout, keys in the bundle.
3. 4.3 distinctness check v1 (own portfolio + named saturated categories).
4. Public proof: Weight Class's own listing and paywall built or checked with App Builder, shown honestly.

## Assumptions and Unknowns
- App Builder's own claims come from the brief, not a live page.
- Pages fetched via a summariser. Quotes are short and verbatim as returned. Rork's pricing is from its docs (research file), because its homepage shows no prices.
- Superapp's "rejection rate close to zero" is its own claim and is unverified.
- Rivals may have features that are not on their homepages. Absence on a page is not proof of absence.
- The 4.3 check is a heuristic. Apple's similarity rules are private. Position it as quality and account safety, never as a way to "get past review."
