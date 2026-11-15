# Shelby app: native design audit (Impeccable method)

- **Date:** 2026-11-15.
- **Method:** Impeccable's `audit.native` (5 dimensions, each scored 0–4), plus its `craft-floor` and `polish` passes.
- **References:** [Impeccable](https://impeccable.style/) by Paul Bakaus (Apache 2.0). Its launcher couldn't run in this environment, so I followed the skill's "launcher unavailable" path and applied the references by hand.
- **Evidence:** the source code plus the web build at 390×844. The iOS reference asks for Simulator screenshots, which this Linux environment can't produce. Native-only checks (Dynamic Type at large sizes, Dark Mode, swipe-back) are scored from source and still need a device pass.

## Audit health score

| # | Dimension | Before | After | Key finding |
|---|---|---|---|---|
| 1 | Accessibility | 2 | 3 | Controls are labelled and tap targets are mostly 44pt+ (via `hitSlop`). There are 97 fixed `fontSize` values, Reduce Motion is not honoured, and the toast now announces itself. |
| 2 | Performance | 2 | 2 | Home and Search render up to 88 product cards in a `ScrollView` (not virtualised). There are 28 `ScrollView`s and 1 `FlatList`. `react-native` `Image` has no caching. Startup loads the whole catalogue before the first screen (see the simulation report). |
| 3 | Appearance and theming | 1 | 1 | There are 136 hard-coded colours and no dark appearance. The tokens in `theme.ts` exist but aren't used everywhere. |
| 4 | Platform conformance | 3 | 3 | It uses the tab bar, stack navigation and sheets correctly. Icons are consistently Ionicons, not SF Symbols. The onboarding tap that escaped the flow is fixed. |
| 5 | Adaptivity | 2 | 2 | It's a phone-only layout; tablets get a stretched phone UI. |
| **Total** | | **10/20** | **11/20** | **Acceptable.** The biggest remaining risks are performance and theming. |

## Fixed in this pass

| Priority | Issue | Fix |
|---|---|---|
| P0 | **Onboarding could not be finished by tapping a pick.** Tapping a product opened the product page and left the full-screen onboarding. | In onboarding, tapping a pick saves it (a filled heart and an accent ring), so "See my feed" unlocks. |
| P1 | **No haptic or visual confirmation for actions.** | Added `src/lib/feedback.tsx`. It gives haptics on every shared button, chip and tab (light tick or selection), a medium thump on add-to-cart and saves, a success pattern on order and an error pattern on payment failure. One toast confirms the action, with "View cart" or "View". |
| P1 | **Two toasts stacked after add-to-cart, covering the action bar.** | There is now one global toast, carrying the product page's free-shipping progress line. It sits at the top so it never covers a bottom CTA. |
| P1 | **Cards stacked two or three badges** ("412 sold", "20% off", "Only 2 left"), and the price, compare-at, rating and count collided on 150px cards. | One badge per card, in priority order: low stock, then discount, then popularity. The card shows the rating without the review count (the product page still has both). |
| P2 | **Uppercase tracked eyebrows** ("SHELBY SETUP · STEP 3 OF 3", "TRENDING SEARCHES"). The craft floor bans eyebrow labels. | Replaced with sentence-case labels. |
| P2 | **"Yes, watch prices" wrapped onto two lines** on the button. | Shortened to "Watch prices". |

## Open findings (recommended next)

- **[P1, ask before changing] Fabricated social proof.**
  - "14 people have this in their cart right now" is computed from the product ID. The "Maya in Austin just bought…" ticker is invented.
  - On a live store these are false claims (deceptive-pattern and consumer-protection risk).
  - Recommendation: replace them with real counts from Shelby's own events (`add_to_cart` in the last 24 hours), or remove them.
- **[P1] Virtualise product grids.** Use `FlatList` with `numColumns=2` (or FlashList) on Home and Search. Use `expo-image` for caching and placeholder blur.
- **[P1] Dark appearance and semantic tokens.** Move the 136 literal colours onto `theme.ts` roles and add a dark palette, as the iOS reference requires.
- **[P2] Dynamic Type.** Build a text-style scale (`T.*`) and use it in place of the 97 literal font sizes, then test at the largest accessibility size.
- **[P2] Reduce Motion.** Respect `AccessibilityInfo.isReduceMotionEnabled` for the Shelby mascot's bob, sparkle and sheet springs.
- **[P2] Tablet layout.** Use 3–4 product columns and a max content width on wide windows.
