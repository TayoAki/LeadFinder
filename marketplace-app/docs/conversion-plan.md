# Shelby (single-store mode): conversion plan, scoring rubric and experiment backlog

**Assumption for this plan:** the app sells for **one store** with several niches: fashion, supplements, beauty, and more to come. The only goal is to **maximise the number of people who buy, how much they spend and how often they come back**.

**Sources reviewed:**
- **A. "From Customer Insight to Conversion"** (essay outline on Jeffrey Park / Daydreamers Studio's Shopify DTC landing-page method). It covers customer evidence, page-to-awareness fit, offers, AI-drafted copy, visuals, a working purchase path, and measured testing.
- **B. Alex Slater's "App Blueprint"** (6-hour transcript, author of Quitter, Rift and Reset). It covers ARPU as the north star, "the onboarding and paywall are the product", pricing as the big lever, exit offers, one-variable testing, creators and UGC, App Store search, and retention.

Section 1 says what carries over and what deliberately doesn't. Every number quoted from a source is labelled as the source's claim. Every target I set is a **starting target to recalibrate after four weeks of real data**, not a benchmark.

---

## 1. What the sources say, and what applies to a shopping app

| Principle | Source | Applies here as |
|---|---|---|
| Start from customer evidence (reviews, frustrations, desired outcomes, objections), not from a template | A | Mine reviews, returns reasons, support tickets and search queries **per niche** before designing any screen or offer. |
| Match the page to what the visitor already knows (cold, warm or hot; homepage vs PDP vs offer page vs quiz result) | A | Route each traffic source to the right in-app screen: a creator link goes to the exact product with the creator's angle, a cold install goes to a quiz, a returning buyer goes to "buy again". |
| Ad-to-page continuity: the promise that brought them must be the first thing they see | A | Every deep link lands on the promised product, offer or bundle, and the creative's angle repeats in the first screen. |
| The offer is product + price + terms + reassurance (bundles, guarantees, anchoring, honest urgency) | A | Offers designed **per niche** (see §3), with the guarantee and the delivery/returns promise next to the price. |
| AI drafts are a starting point; proof must be real | A | Use AI for copy variants. Use reviews, ratings, UGC and "bought" counts only from real data. |
| Build, launch, measure; keep a control | A, B | An experiment programme (§5) with a permanent holdout for push and discounts. |
| **Revenue per user beats conversion rate as the north star** | B ("ARPU per download is the main metric") | **Revenue per install over 30 days (RPI₃₀)** is the north star. A test that raises conversion but lowers order value or margin loses. |
| Pricing and offers are the big levers ("pricing could be 20 30 50 100% gains" vs "5 10%" for small levers) | B (speaker's claim) | Test offer structure (bundles, subscribe-and-save, thresholds) before colours and copy. |
| "Make it extremely easy to pay… no point making it more difficult to purchase" (Rift) | B | Guest checkout, Apple/Google Pay, a cart that persists, no account wall before purchase. |
| Optimistic UI: show the result instantly, do the backend work in the background | B | Add to cart is instant. Build the order in the background (fixes the 4–5 s checkout found in the simulation). |
| A recovery offer to very high-intent people who balked at the price (the exit paywall) | B | Cart and checkout abandonment flows, but honest: a real expiry, and only for people who genuinely stalled at price. |
| Change one variable at a time; don't call a winner on one viral day; re-test as culture shifts | B | The test rules in §5.3. |
| Creators: show the product in the first 10–15 s, name visible, "do not oversell"; pay on CPM with caps | B | Creator and UGC video in the app (shoppable video, already built) and in acquisition, with per-creator links and codes for attribution. |
| App Store listing: screenshots walking the core flow, keywords including category terms | B | App Store Optimisation for each niche's search terms (e.g. "women's linen dress", "magnesium glycinate"). |
| Retention through habit and membership (Uber One / DashPass: "because you are subscribed… you have an inclination to book more") | B | A paid or earned membership (free shipping plus member prices) and replenishment for supplements and beauty. |

**Deliberately not carried over (wrong model, or dishonest):**
- **No hard paywall or long sunk-cost onboarding.** A store wins by showing products fast. Onboarding is optional, ≤3 questions, and must end with real products.
- **No fake "analysis…" screens, fake "one-time" offers, fake bought or in-cart counters, or AI-written testimonials.** Source B's author regrets the first two. Source A warns that "generated endorsements are not customer evidence".
- **No App Store rating prompt before the person has used the app.** Ask after a delivered order instead.
- **Supplement and beauty claims stay within the rules for their category** (e.g. FTC and FDA structure/function rules in the US, the ASA/CAP code in the UK). A design pattern does not make a claim true (source A).

---

## 2. North star and metric tree

```
RPI₃₀ = revenue per install, first 30 days, net of discounts and refunds   ← north star
  = first-purchase rate (installs that buy within 30 days)
  × average first order value (AOV)
  × (1 + repeat orders per buyer within 30 days)
Guardrails: gross margin per order, refund/return rate, unsubscribe and opt-out rate, crash-free sessions
```

**Diagnostic funnel**, using the events the app already sends (`src/lib/analytics.ts`), read in **Admin → Analytics → Funnels**:

`app_open → product_view → add_to_cart → checkout_start → order_placed`, broken down by niche, platform and campaign source (first-touch `utm_source`/`ref` is attached to every event).

**Starting targets** (to recalibrate after four weeks of real data):

| Metric | Week-1 baseline | 90-day target |
|---|---|---|
| Install → first purchase (30 d) | measure | +30% relative |
| Product view → add to cart | measure | +20% relative |
| Checkout start → order | measure | ≥ 70% |
| AOV | measure | +15% |
| Repeat purchase within 60 d (supplements, beauty) | measure | ≥ 25% of buyers |
| Push opt-in | measure | ≥ 50% of buyers (asked after the first order) |
| Tap to order confirmed (p95) | 12.4 s (simulation) | ≤ 3 s |
| Cold start (p95) | 4.8 s (simulation) | ≤ 2 s |

---

## 3. Niche playbooks: one store, three ways of buying

Each niche has a different reason people don't buy, so each gets its own proof, offer and retention loop on the same app shell.

| | Fashion | Supplements | Beauty |
|---|---|---|---|
| **Main hesitation** | "Will it fit and look like that on me?" | "Will it work, and is it safe?" | "Is this my shade or skin type, and will it irritate?" |
| **Proof on the PDP** | Fit notes from reviews ("runs small"), model height and size, on-body UGC video, a size guide in the size picker | Ingredients and doses table, third-party test badges (only if real), what to expect when, honest reviews, a "who it's not for" note | A shade finder or swatches on several skin tones, a skin-type tag on each review, ingredient flags (fragrance-free and so on) |
| **Offer** | Complete-the-look bundle, free returns, a free-shipping threshold | **Subscribe & save** (with the discount shown against a one-time purchase), a 30-day guarantee, and a quantity bundle where a 3-month supply anchors the price | Routine bundles (cleanser + serum + SPF), a free mini or sample, an easy shade exchange |
| **Onboarding question** | Style plus size (saved for one-tap size selection) | Goal (sleep, energy, gut…) plus sensitivities | Skin type plus concern plus shade range |
| **Retention loop** | New drops and restocks of saved items in their size, a weekly "new in" for their style | Replenishment reminder timed to the pack size, a subscription with skip, pause and swap | Replenishment, routine completion ("you have the cleanser, add the serum") |
| **Cross-sell** | Accessories, beauty for the look | Pairs (magnesium + sleep), beauty from within | Supplements (hair, skin, nails), fashion for the season |

---

## 4. The plan: what to change in the app

### Phase 0 (week 1): measure before changing
1. **Instrument:** confirm every funnel event fires with `niche` (category), `price`, `variant`, `source` and `ref`. Add `size_selected`, `subscribe_toggle`, `bundle_view`, `bundle_add`, `promo_applied`, `push_optin`, `review_photo_view`, `size_guide_open`.
2. **Baseline:** run one week with no changes. Record the metric tree per niche and per traffic source.
3. **Customer evidence pass (source A):** for each niche, write the top five objections and desired outcomes from reviews, returns and support, in customers' own words. Every PDP section and offer answers one of them.

### Phase 1 (weeks 2–4): remove friction, the cheapest wins
1. **Make checkout instant:**
   - keep a live cart on the server that grows as items are added;
   - default to Apple Pay or Google Pay, with guest checkout;
   - autofill the address;
   - Pay = authorise and confirm (target p95 ≤ 3 s).
2. **First screen in under 2 s:**
   - load only the Home rails;
   - search runs on the server;
   - cached catalogue with skeleton screens;
   - onboarding is the first route for new users (no Home flash).
3. **One-tap size:** the saved size from onboarding pre-selects in the picker, and "Pick a size" is shown inline, never as an error.
4. **Honest stock and social proof:** real counts only ("1,240 bought this month" from orders), a "Sold out" state, and a back-in-stock alert. Remove the fabricated in-cart counter and the fake purchase ticker.
5. **Deep-link continuity (source A):** every creator, ad and email link opens the promised product or offer, and the creative's angle repeats in the first screen.

### Phase 2 (weeks 4–8): offers and order value, the big levers
1. **Subscribe & save** on supplements and replenishable beauty, the default for supplements, tested in E4.
2. **Bundles** per niche (complete the look, routines, stacks), on the PDP and the cart.
3. **Free-shipping threshold** with a progress bar in the cart (already built), with the threshold tested in E6.
4. **First-order offer:** test a percentage off vs free shipping vs a free gift (E5), always against a no-offer holdout.
5. **Checkout recovery (source B's exit offer, done honestly):** a cart reminder push or email after 1 h and 24 h. An incentive only in the 24 h message and only above the AOV floor, with a real expiry that the system enforces.

### Phase 3 (weeks 6–12): retention and the app advantage
1. **Push opt-in after the first order** ("Want a ping when it ships?"), not at launch.
2. **Replenishment:** a reminder at (pack size ÷ daily dose − 5 days), with a one-tap reorder.
3. **Membership (source B's Uber One logic):** for example free shipping plus member prices plus early drops. Test it as a paid tier vs an earned tier (after the second order).
4. **Shoppable video (built):** creator and customer clips per niche, each tagged with a product. Video is where fashion and beauty proof lives.
5. **Reviews with photos, requested after delivery,** plus the App Store rating prompt after a delivered order (never before use).

### Phase 4 (ongoing): distribution feeding the funnel
- **Creators (source B):**
  - per-creator links and codes for attribution;
  - the product shown in the first 10–15 s;
  - capped CPM deals;
  - the same creatives reused as in-app shoppable video.
- **App Store Optimisation:** screenshots walk the core flow (discover → product → one-tap buy), with niche keywords in the title and subtitle, and category terms such as "linen dress" and "magnesium".
- **Website → app:** a smart banner with the reason to switch (app-only member prices or free shipping), carrying the cart over.

---

## 5. Experiment backlog

### 5.1 Prioritised tests

Priority = (Impact × Confidence × Ease) ÷ 10. Each factor is scored 1–5.

| # | Hypothesis | Change (one variable) | Primary metric | Guardrails | Niche | I | C | E | Priority |
|---|---|---|---|---|---|---|---|---|---|
| E1 | Instant checkout removes the biggest drop-off | Live server cart, so Pay = confirm only | Checkout start → order | Payment errors, p95 latency | All | 5 | 5 | 3 | 7.5 |
| E2 | Showing real products before any question raises activation | Onboarding: 3 questions then picks, vs skip straight to a personalised Home | Install → product view in session 1 | Install → first purchase (30 d) | All | 4 | 3 | 4 | 4.8 |
| E3 | A saved size removes fashion hesitation | Pre-select the saved size plus a fit note from reviews | Fashion PDP → add to cart | Return rate (size) | Fashion | 4 | 4 | 4 | 6.4 |
| E4 | A subscribe-first default raises lifetime revenue | Subscribe & save pre-selected vs one-time pre-selected | RPI₉₀ (not conversion) | Subscription cancellations in month 1, refunds | Supplements | 5 | 3 | 4 | 6.0 |
| E5 | The right first-order offer raises RPI, not just conversion | 15% off vs free shipping vs free gift vs **no offer** (holdout) | RPI₃₀ | Margin per order | All | 5 | 3 | 4 | 6.0 |
| E6 | A threshold just above AOV lifts AOV without hurting conversion | Free-shipping threshold at AOV × 1.2 vs × 1.5 | AOV × conversion (revenue per checkout start) | Conversion | All | 4 | 4 | 5 | 8.0 |
| E7 | Bundles on the PDP raise AOV | "Complete the look" / routine / stack module, on vs off | AOV | PDP → add-to-cart rate | Per niche | 4 | 3 | 4 | 4.8 |
| E8 | Real social proof near the price lifts conversion | "1,240 bought this month" plus star summary next to the price, vs below the fold | PDP → add to cart | None | All | 3 | 4 | 5 | 6.0 |
| E9 | Video proof converts better than photos for fashion and beauty | First gallery item = UGC video vs photo | PDP → add to cart | PDP load time | Fashion, beauty | 4 | 3 | 3 | 3.6 |
| E10 | A cart reminder recovers stalled buyers | Push at 1 h (no incentive) vs none (holdout) | Cart → order within 72 h | Push opt-outs | All | 4 | 4 | 4 | 6.4 |
| E11 | An incentive only at 24 h recovers price-stallers without training discounting | 24 h reminder with a free-shipping code vs without | Cart → order (72 h), margin | Discount share of orders | All | 3 | 3 | 4 | 3.6 |
| E12 | Asking for push after the first order lifts opt-in and repeat | Ask after the order vs at launch | Push opt-in and repeat (60 d) | Uninstalls | All | 4 | 4 | 5 | 8.0 |
| E13 | A replenishment reminder at the right day drives reorders | Reminder at depletion −5 d vs none (holdout) | Reorder rate (60 d) | Opt-outs | Supplements, beauty | 5 | 4 | 4 | 8.0 |
| E14 | A membership increases order frequency | Paid membership offer vs an earned tier vs none | Orders per buyer (90 d), net of fee | Margin | All | 5 | 2 | 2 | 2.0 |
| E15 | Cross-niche picks increase basket breadth | "Goes with" across niches (supplement + beauty) vs same-niche only | Items per order, AOV | Add-to-cart rate | Cross | 3 | 2 | 4 | 2.4 |
| E16 | Matching the creative angle on landing lifts deep-link conversion (source A) | Creator link lands on the product with the creator's clip + hook vs a generic PDP | Link open → order | None | All | 4 | 3 | 3 | 3.6 |
| E17 | App Store screenshots showing the buy flow lift install conversion (source B) | Flow screenshots vs lifestyle screenshots | Product-page view → install | None | All | 3 | 3 | 4 | 3.6 |

**Run first** (highest priority, and they don't interfere with each other): E6, E12, E13, E3, then E1 (it's an engineering project, so ship it behind a flag and test it as a rollout).

### 5.2 What a good experiment record contains (source A: "record the audience, claim, offer, structure, conditions, result")
- **Before the test:** hypothesis, change, audience and segment, primary metric with its denominator, guardrails, minimum detectable effect, the sample size it needs, start date and planned end date.
- **After:** the result with a confidence interval, the decision (ship, kill or iterate), and what we learned for other niches.

### 5.3 Rules
1. **One variable per test** (source B). Bundle changes only when testing a whole flow against a flow.
2. **Judge on revenue, not clicks.** The primary metric is per-user revenue or the step's conversion, and **RPI and margin are always guardrails** (source B's free-trial lesson: higher conversion, less money).
3. **Run full weeks** (a minimum of 7 days, two weekly cycles where traffic allows). Don't stop early on a good day (source B's viral-day warning).
4. **Size the test first.** Work out the sample from the baseline rate and the smallest effect worth shipping. If the test can't reach it within four weeks, test a bolder change or a higher-traffic step.
5. **Permanent holdouts:** 5–10% of users get no discounts and 5–10% get no marketing push, so incremental revenue is measured, not assumed.
6. **Segment the read** by niche, new vs returning, and traffic source. A win in supplements may be a loss in fashion.
7. **Re-test winners every quarter.** Audiences and seasons shift (source B: "culture shifts").
8. **No dark patterns in variants.** Fake scarcity, fake timers and fabricated proof are not testable options.

---

## 6. Rubric: score how well the app is built to convert

Score each criterion 0–4 against the evidence described, multiply by its weight, and total out of 100. Score per niche where it says so. Re-score monthly. The score shows **where** to work; the metric tree (§2) shows **whether** it worked.

**Levels:** 0 = missing · 1 = present but broken or generic · 2 = works, not tailored · 3 = tailored and measured · 4 = tailored, measured, and improved by at least one experiment.

| # | Dimension | Weight | What a 4 looks like (evidence to check) |
|---|---|---|---|
| R1 | **Speed to first product** | 8 | A new user sees real, relevant products in ≤ 2 s (p95 cold start) and in ≤ 3 taps. Onboarding is skippable and ends on real products. |
| R2 | **Traffic and promise continuity** | 6 | Every campaign or creator link lands on the promised product or offer, and the angle repeats on the first screen. Measured by source. |
| R3 | **Discovery and search** | 6 | Natural-language and misspelled queries return results, filters fit each niche (size, goal, skin type), and zero-result rate < 3% with a fallback (Ask). |
| R4 | **Product page proof, per niche** | 12 | Each niche's top three hesitations (§3) are answered above the fold: fit (fashion), ingredients and testing (supplements), shade and skin type (beauty). Reviews are real, with photos. |
| R5 | **Offer clarity** | 10 | The price, savings vs one-time purchase, bundle value, delivery date, returns and guarantee are visible next to the buy button. No unclear or contradictory terms. |
| R6 | **Variant selection** | 6 | Size, shade or flavour is pre-selected from the user's profile where known, unavailable variants are clearly marked, and a missing selection is handled inline. |
| R7 | **Add to cart and cart** | 6 | Instant optimistic add with haptic and toast feedback, a cart that persists across sessions and devices, threshold progress, and bundle upsell. |
| R8 | **Checkout** | 12 | Guest checkout, Apple Pay or Google Pay first, autofill, ≤ 2 screens, p95 tap-to-confirm ≤ 3 s, plain-language errors with recovery (e.g. sold out), and no surprise fees. |
| R9 | **Order value** | 8 | Bundles, routines or stacks, subscribe & save, and a threshold calibrated to AOV, each with a measured AOV effect. |
| R10 | **Retention loops** | 10 | Post-purchase push opt-in, a replenishment timer, back-in-stock and drop alerts, a membership, and reorder in one tap. Repeat rate is measured per niche. |
| R11 | **Trust and honesty** | 8 | Real counts only, real reviews, accurate stock, compliant claims (supplements, beauty), a visible returns policy, secure-payment cues. **Any fabricated proof caps this at 1.** |
| R12 | **Measurement and experimentation** | 8 | Funnel events are complete, dashboards run by niche and source, holdouts are in place, there's a written experiment log, and at least two tests are concluded per month. |
| | **Total** | **100** | **Bands:** 85–100 excellent · 70–84 good · 50–69 fix the weak dimensions · under 50 rebuild the flow |

### Current score (Shelby app as of 2026-11-15, honestly applied)

| # | Score (0–4) | Weighted | Why |
|---|---|---|---|
| R1 | 2 | 4.0 | Cold start p95 is 4.8 s and Home flashes before onboarding. Onboarding does end on real products. |
| R2 | 2 | 3.0 | Deep links (`/p`, `/s`, `/d`, `/w`) and attribution exist, but there are no per-campaign landing variants. |
| R3 | 2 | 3.0 | Natural-phrase search is fixed and there's an Ask fallback. Search runs on the device and isn't tailored to niches. |
| R4 | 1 | 3.0 | Generic PDP for every niche. Reviews are placeholder text. |
| R5 | 2 | 5.0 | Compare-at prices, shipping time and a free-shipping bar are shown. No guarantee or returns line at the buy button. |
| R6 | 2 | 3.0 | Inline "Pick a size" works. Sizes aren't remembered. |
| R7 | 3 | 4.5 | Instant add with haptics and toast, plus threshold progress. The cart is on the device only. |
| R8 | 2 | 6.0 | Guest checkout and Stripe sheet are ready, and sold-out recovery works. p95 is 12.4 s. |
| R9 | 1 | 2.0 | Only the free-shipping threshold. No bundles or subscribe & save. |
| R10 | 1 | 2.5 | Wishlist, follows and drop reminders exist. No replenishment, push or membership. |
| R11 | 1 | 2.0 | **Capped by the fabricated in-cart counter and purchase ticker.** |
| R12 | 3 | 6.0 | Full event pipeline, a funnel, retention and per-shopper timelines, Umami, and a simulator. No holdouts or experiment log yet. |
| **Total** | | **44 / 100** | **Under 50, so rebuild the flow.** Biggest gaps by weighted points: checkout speed (R8), niche PDP proof (R4), retention (R10), order value (R9), honesty (R11). |

Phases 1–3 above target, in order, the dimensions that lose the most points. Doing all of Phase 1 and Phase 2 should move the app into the 65–75 range, by rubric math, before any experiment wins.

---

## 7. Ninety-day timeline

| Weeks | Ship | Tests running | Rubric dimensions moved |
|---|---|---|---|
| 1 | Instrumentation gaps, baseline, objection lists per niche | none (baseline) | R12 |
| 2–4 | Live server cart and fast checkout (flagged), cold-start fix, saved size, honest proof (remove fakes), deep-link continuity | E1 rollout, E3, E8, E6 | R1, R2, R6, R8, R11 |
| 4–8 | Subscribe & save, bundles per niche, first-order offer with holdout, cart recovery | E4, E5, E7, E10 | R5, R9 |
| 6–12 | Post-purchase push, replenishment, shoppable video per niche, review requests, membership test | E12, E13, E9, E14 | R4, R10 |
| Ongoing | Creator programme with codes, ASO per niche, website → app banner | E16, E17 | R2 |

**Review cadence:**
- **Weekly:** the funnel by niche and source, plus the experiment readouts.
- **Monthly:** re-score the rubric, re-prioritise the backlog, and re-test one past winner.
