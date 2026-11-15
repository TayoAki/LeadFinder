# Shelby: multi-seller marketplace app frontend with an AI shopping helper

This is the Expo (React Native) frontend for the v1 marketplace described in the PRD: one cart for many independent shops, a seller mode in the same app, and live shopping later.

- **Backend:** Shelby Commerce (Mercur on Medusa v2) for products, sellers, carts and orders; see below.
- **Simulated:** payments, push notifications and sharing.
- **How it scores:** see `../idea-engine/marketplace/SCORECARD.md` for the score against the viral rubric and `../idea-engine/marketplace/viral-research.md` for the research behind it.

## Run it

```bash
npm install
npx expo start          # scan the QR code with Expo Go, or press w for web
npx expo start --web    # web preview at phone size
npx tsc --noEmit        # typecheck
```

## Where things are

| Path | What |
|---|---|
| `src/app/(tabs)/` | Home, Search, Drops, Cart, You |
| `src/app/product/[id].tsx`, `src/app/shop/[id].tsx` | Product and shop pages |
| `src/app/checkout.tsx`, `src/app/order-success.tsx`, `src/app/orders/` | Guest-friendly checkout split by seller, success screen, per-seller tracking |
| `src/app/share.tsx`, `src/app/invite.tsx` | Share cards and the two-sided referral |
| `src/app/p`, `s`, `d`, `w` | Deep-link routes that apply `?ref=` |
| `src/app/seller/` | Seller mode: dashboard, apply, products, new product, orders, payouts, grow kit |
| `src/lib/brand.ts` | App name, tagline, domain and rewards; change the name here |
| `src/app/onboarding.tsx` | Onboarding: welcome, then 3 honest steps, ending with saving a real pick |
| `src/app/ask.tsx`, `src/lib/shelby.ts` | Ask Shelby chat and the transparent pick logic (swap in an LLM later) |
| `src/components/Shelby.tsx`, `assets/brand/` | The animated mascot and the supplied logo files |
| `src/lib/store.tsx` | In-memory state for cart, wishlist, follows, orders, referral and seller |
| `src/data/catalog.json` | Sample catalogue, rebuilt by `scripts/make-catalog.py` from DummyJSON |

## Commerce backend: Mercur on Medusa (`../shelby-commerce`)

Products, sellers, carts and orders live in **Shelby Commerce** ([Mercur](https://github.com/mercurjs/mercur) on [Medusa v2](https://github.com/medusajs/medusa)).
- **How the app connects:** `src/lib/commerce.ts` loads the catalogue from Mercur's Store API into the app's `Shop`/`Product` shapes. At checkout it builds one Mercur cart across sellers, and completing it creates an order group with one order per seller.
- **Switching it on:** the app uses Mercur when this server's `/api/config` returns a `commerce` block, which happens when `MEDUSA_URL` and `MEDUSA_PUBLISHABLE_KEY` are set. Without them it falls back to the legacy built-in backend below.
- **Seller dashboard:** sellers use Mercur's seller panel at `<MEDUSA_URL>/seller`, and operators use `<MEDUSA_URL>/dashboard`.

## Legacy backend and Shelby web server (`server/`)

The same Node process serves three things:
- `/api/*`: the JSON API.
- `/seller`: Shelby for Sellers, where shop owners sign up, set up their shop, upload products with photos, sizes and stock, and ship orders. Platform admins approve shops there too.
- `/`: the Expo web build.

Data lives in SQLite under `DATA_DIR` (a Railway volume at `/data`), and photos in `DATA_DIR/uploads`.

```bash
npm run build:web                       # builds dist/
ADMIN_SETUP_CODE=choose-a-code npm run serve   # http://localhost:3200 and /seller
```

The first seller account created with the `ADMIN_SETUP_CODE` (under "Platform admin?" on sign-up) becomes a platform admin. On first boot the database is seeded with the 10 sample shops so the app is never empty. Suspend them from the Admin tab once real sellers are live.

For a native build, set `EXPO_PUBLIC_API_URL` to the deployed URL.

## Analytics (`src/lib/analytics.ts`, `server/analytics.mjs`)

Every action in the app and the seller dashboard is sent to `/api/events` on our own server. The server does three things with it:
- stores the event in SQLite, which feeds the **Analytics** tab for platform admins at `/seller#/analytics`;
- forwards it to **Umami**, which handles traffic, pages, referrers and countries;
- forwards it to **PostHog**, which handles funnels, retention, paths and per-shopper timelines.

What is tracked:
- **Automatically:**
  - every screen view, with `ref` and `utm_*`;
  - every tap on a shared `Button`, `IconButton` or `Chip` (by its label);
  - every seller-dashboard click;
  - every successful seller write.
- **Named events:**
  - `app_open`, `product_view`, `shop_view`;
  - `search`, `ask_shelby`;
  - `add_to_cart`, `cart_qty_change`, `remove_from_cart`;
  - `wishlist_toggle`, `follow_toggle`, `drop_reminder_toggle`;
  - `checkout_start`, `checkout_submit`, `checkout_error`, `order_placed`, plus the server-side `order_confirmed`;
  - `onboarding_step`, `onboarding_complete`, `onboarding_skip`;
  - `share`, `invite_sent`, `deep_link`;
  - `notification_permission`, `sign_in`, `sign_out`.

No personal data is sent. Emails are dropped server-side, and typed form values are never captured.

Server environment variables (either service can be left unset):

| Variable | Meaning |
|---|---|
| `UMAMI_URL`, `UMAMI_WEBSITE_ID` | Your Umami instance and the website id to record against |
| `POSTHOG_KEY`, `POSTHOG_HOST` | PostHog project API key (`phc_…`). Host defaults to `https://us.i.posthog.com`; use `https://eu.i.posthog.com` for EU projects or your own host |

Use `track('event_name', { ... })` anywhere in the app to add an event.
