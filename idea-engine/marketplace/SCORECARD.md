# Stalls frontend: scored against the viral rubric

Date: 2026-11-14. The rubric is section 4 of `viral-research.md` (12 criteria, 100 points). The app is in `marketplace-app/`, and screenshots are in `screens/`.

**Score: 88 / 100.** The first pass scored 80. One fix round then added:
- the promise line on Home;
- review counts on product cards and a "New maker" badge;
- a notification preference centre;
- a supporter level;
- the web fallback banner.

The 12 points still missing all need a backend or a third-party service. They are listed at the end.

**How it was scored:**
- I ran the app on Expo web at phone size (390×844) and drove it with Playwright.
- The flows were real clicks, not mock-ups: a referral deep link, add to cart from two shops, guest checkout with Apple Pay, order placed, and per-shop tracking.
- I scored my own build, so read the numbers as a self-assessment, not an independent review.

| # | Criterion (weight) | Score | Points | Evidence in the app | Gap to 10 |
|---|---|---|---|---|---|
| 1 | Clarity of job (10) | 10 | 10.0 | The name "Stalls" plus an awning mark on the word-mark. Home opens with "Shop small sellers, one cart." and a row of shop avatars. The store name is "Stalls: Indie Shops". | None |
| 2 | First product, no signup (10) | 9 | 9.0 | The Home feed and today's drop show with no account. The deep link opened the product in 0.8 s on web. Wishlist, follow and add to cart all work as a guest. Onboarding is an optional inline card, not a wall. | Cold start not yet measured on a real phone |
| 3 | One-cart checkout (10) | 9 | 9.0 | One cart grouped by shop, with per-shop shipping and a free-shipping progress bar. Apple Pay is the default. Guest checkout asks only for an email, and the account is created after payment. | Google Pay button on Android; real Stripe Payment Sheet |
| 4 | Shareable cards (10) | 7 | 7.0 | Product, shop, drop, wishlist ("gift list") and order ("my haul") each open a share sheet. It shows a branded card (photo, price, shop, word-mark, "$10 off") and a link carrying the referral code. "Ask a friend" adds a yes/no poll. | Server-made OG images, so links preview richly in iMessage, WhatsApp and X |
| 5 | Two-sided referral (10) | 10 | 10.0 | "Give $10, get $10" appears in 7 places: Home, Profile, Invite, share sheet, order success, order detail, product page. A `?ref=` link applies the credit automatically (checkout showed −$10). The invite screen has a progress bar and a 5-friend goal. | None |
| 6 | Seller brings buyers (10) | 9 | 9.0 | Seller home shows "Bring your followers" right after orders to ship, with "2 of your last 5 orders came from your shop link". The Grow screen has an Instagram story template, shop link, QR for markets, follower-only codes and drop planning. Makers who invite other makers get 30 days at 0%. Orders are tagged by source. | Make the share tools the very first card on seller home |
| 7 | Deep-link continuity (8) | 7 | 5.6 | `/p/:id`, `/s/:id`, `/d/:id` and `/w/:code` land on the exact screen and apply `ref`. Universal links and Android app links are configured in `app.json`. On web, the same routes act as the fallback shop, with a "Get app, your $10 comes with you" banner. | Deferred deep linking after a fresh install (Branch, AppsFlyer or Adjust) |
| 8 | Social proof (8) | 9 | 7.2 | Product cards show stars plus review count, plus "sold" and "only N left". The shop header shows rating, followers and sold count. Reviews carry verified-purchase labels and photos. Product pages show "N people have this in their cart" and a live "Maya in Austin bought…" ticker. New shops get a "New maker" badge instead of zero stars. | An automatic review request after delivery (today it is only a button) |
| 9 | Events and honest scarcity (7) | 9 | 6.3 | A Drops tab with countdowns, Remind me, quantities and reminder counts. Sellers can set "Release as a timed drop". Stock counts are real. A "Live, coming soon" early-access card prepares phase 2. | A date and time picker for scheduling drops |
| 10 | Habit loop (6) | 8 | 4.8 | Followed shops show as a ring row with NEW markers and their own feed. Notifications cover price drops and new items. Profile has a "Small-shop supporter" level with a progress bar. | A daily or weekly streak; a seller-side level |
| 11 | Notification permission (5) | 10 | 5.0 | There is no prompt at launch. A soft prompt appears only after Remind me or on the order-placed screen. A preference centre has 6 types, with marketing off by default. | None |
| 12 | Buyer to seller (6) | 9 | 5.4 | "Sell here" appears on Home, Profile and order success. Seller mode is a toggle on the same account. Applying takes 3 steps (shop, Stripe, first product), with Shopify and Etsy import noted for v1.1. | Time a first listing on a phone (target under 2 minutes) |
| | **Total** | | **88.3** | | |

## What it takes to reach 100

All of these need backend or third-party work. None of it is UI:
1. **Rich link previews (+3):** an image service that renders the share card as an OG image for each `/p`, `/s`, `/d` and `/w` URL.
2. **Deferred deep links (+2.4):** Branch, AppsFlyer or Adjust on the same paths, so a fresh install still opens the shared item with the credit applied.
3. **Real payments (+1):** the Stripe Payment Sheet with Apple Pay and Google Pay, as the PRD specifies.
4. **Automatic review request after delivery (+0.8):** a push the day after "Delivered", sent by the order system.
5. **Smaller items (+2.5 in total):**
   - a measured cold start on a real phone;
   - share tools as the first card on seller home;
   - a drop date picker;
   - a weekly streak;
   - a timed first listing.

## Caveats

- **Sample data:**
  - Product photos and names come from the DummyJSON sample catalogue; items named after real brands were removed.
  - Shop names, reviews, the "bought" ticker and seller numbers are made up for the demo.
- **Frontend only:** all state lives in memory, and payments, notifications and sharing are simulated.
- **"Stalls" is a working name:** it came from a quick search, not a trademark check.
