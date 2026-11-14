# Stalls (working name): multi-seller marketplace app frontend

This is the Expo (React Native) frontend for the v1 marketplace described in the PRD: one cart for many independent shops, a seller mode in the same app, and live shopping later.

- **Frontend only:** data is sample data and state is in memory.
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
| `src/lib/store.tsx` | In-memory state for cart, wishlist, follows, orders, referral and seller |
| `src/data/catalog.json` | Sample catalogue, rebuilt by `scripts/make-catalog.py` from DummyJSON |

## Swap in the real backend

Replace `src/lib/data.ts` and `src/lib/store.tsx` with API calls that follow the PRD's data model:
- **Orders:** Purchase → SellerOrder → OrderItem.
- **Payments:** Stripe Connect, with the Payment Sheet for checkout.
- **Push:** Expo Notifications.
- **Deferred deep links:** a link service for the `p`, `s`, `d` and `w` paths.
