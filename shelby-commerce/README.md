# Shelby Commerce: the marketplace backend (Mercur on Medusa v2)

Shelby's commerce engine is [Mercur](https://github.com/mercurjs/mercur) 2.4 (MIT), a multi-vendor layer on [Medusa](https://github.com/medusajs/medusa) 2.22. The Expo app in `../marketplace-app` is the storefront.

| Surface | Path | Who uses it |
|---|---|---|
| Store API | `/store/*` | The Shelby app (needs the publishable key) |
| Admin panel | `/dashboard` | Platform operators: approve sellers, review catalogue changes, set commissions, see all orders and payouts |
| Seller panel | `/seller` | Shop owners: register, list offers, manage stock, ship orders, onboard for payouts |

How Mercur models a marketplace:
- **Master products and offers.** There is one shared catalogue of products, and each seller sells against it with an offer that has its own SKU, price, stock and shipping.
- **Order groups.** One cart can hold items from many sellers. At checkout it becomes an order group with one order per seller, and commissions and payouts are worked out per order.
- **More detail:** see `AGENTS.md` and the bundled docs in `node_modules/@mercurjs/docs`.

## Run it locally

```bash
bun install --linker hoisted          # hoisted: the panels expect npm-style node_modules
cp packages/api/.env.template packages/api/.env   # set DATABASE_URL (Postgres 14+)
cd packages/api
bunx medusa db:migrate
SHELBY_SELLER_PASSWORD=choose-one bun run seed:shelby   # 10 shops, 88 products, 160 offers
# Optional SYNTHETIC demo data (marked metadata.demo / demo_details): a supplements + skincare
# shop with 14 products, and fit/fabric/skin-type/goal details on every sample product, so the
# app's niche filters, quiz and product pages can be tested. Images are served by the Shelby app.
DEMO_IMAGE_BASE=https://<shelby web host> bun run seed:demo-niches
# The script runs outside the server, so the store's index engine doesn't see the new offers:
# restart the API after a full reindex (local: UPDATE index_metadata SET status='pending', fields_hash='reindex').
bun run dev                           # http://localhost:9000 (/dashboard, /seller)
```

To create an operator, run `bunx medusa user -e you@example.com -p <password>`, or use `--invite` to get an invite link instead.

## Shelby-specific pieces

- **`packages/api/src/scripts/seed-shelby.ts`:** sets up the US store and region, the "Shelby app" publishable key and the categories. It then creates the sample shops as approved sellers, each with a studio location and standard shipping at the shop's price, and the sample products as master products with one offer per size. Shop and product extras such as tagline, rating, followers, sold and compare-at price go into `metadata`. It is idempotent.
- **`packages/api/src/scripts/data/shelby-catalog.json`:** the sample catalogue, copied from the app.
- **`Dockerfile` + `boot.sh`:** the production image. On every boot it migrates. With `SHELBY_SEED=true` it seeds, and with `ADMIN_INVITE_EMAIL` it prints an operator invite token to the logs. Then it starts the server.

## Deploy (Railway)

The Railway service `commerce` builds `shelby-commerce/Dockerfile`, with Postgres and Redis alongside it. Uploads go to a volume mounted at `/app/packages/api/.medusa/server/static`.

| Variable | Value |
|---|---|
| `DATABASE_URL`, `REDIS_URL` | References to the Postgres and Redis services |
| `JWT_SECRET`, `COOKIE_SECRET` | Long random strings |
| `MERCUR_BACKEND_URL` | The public origin, baked into the panels at build time |
| `FILE_BACKEND_URL` | `<origin>/static` |
| `STORE_CORS` | The app's web origin(s) |
| `ADMIN_CORS`, `VENDOR_CORS`, `AUTH_CORS` | The public origin |
| `SHELBY_SEED`, `ADMIN_INVITE_EMAIL`, `SHELBY_SELLER_PASSWORD` | One-off setup, used by `boot.sh` |

The app uses Mercur when its server has `MEDUSA_URL` and `MEDUSA_PUBLISHABLE_KEY` set (served at `/api/config`). Unset them to fall back to the old built-in backend.

## Payments: Stripe Connect (`@mercurjs/stripe-connector-plugin`)

How it works:
- **Charging:** the shopper is charged once for the whole multi-seller cart. The card is authorized at checkout and captured once the sellers' orders are fulfilled.
- **Paying sellers:** each seller gets their order total minus commission as a Stripe transfer to their Express account. A nightly settlement then pays it out to their bank.

Switch it on with four variables. Until all four are set, checkout uses the system test provider:

| Where | Variable | From the Stripe Dashboard (test mode first) |
|---|---|---|
| `commerce` service | `STRIPE_SECRET_KEY` | Developers → API keys → Secret key (`sk_test_…`) |
| `commerce` service | `STRIPE_OPERATOR_WEBHOOK_SECRET` | Signing secret of the webhook endpoint for **Your account**: `<api>/hooks/payment/pp_stripe-connector_stripe`, with events `payment_intent.succeeded`, `payment_intent.amount_capturable_updated`, `payment_intent.payment_failed`, `payment_intent.canceled`, `charge.refunded` |
| `commerce` service | `STRIPE_SELLERS_WEBHOOK_SECRET` | Signing secret of the webhook endpoint for **Connected accounts**: `<api>/hooks/payout`, with events `account.updated`, `payout.paid`, `payout.failed`, `payout.canceled`, `payout.updated` |
| `web` service (the app) | `STRIPE_PUBLISHABLE_KEY` | Developers → API keys → Publishable key (`pk_test_…`) |

On boot, `sync-payment-providers` sets every region to Stripe only. The free system provider is never left enabled alongside Stripe, because then anyone could complete an order without paying. Connect must also be enabled in Stripe (Settings → Connect).

In the app:
- **Web:** checkout opens Stripe's Payment Element (`src/components/CardPayment.web.tsx`).
- **iOS and Android:** checkout opens Stripe's PaymentSheet (`CardPayment.tsx`, using `@stripe/stripe-react-native`; Apple Pay merchant `merchant.com.hireshelby.app`).

## Supplier: Printify (print on demand)

Printify products are sold under one supplier seller, **Shelby Studio**, and printed and shipped by Printify.

- **Publishing:** in Printify, open the "Medusa" API store (shop `29759065`) and click **Publish** on a product. Printify sends `product:publish:started` to `<api>/hooks/printify`; the product (with one offer per enabled variant, Printify's prices and mockups) is created or updated in Mercur, and Printify is told it succeeded. Deleting or unpublishing removes it.
- **Orders:** when an order group is placed, the Printify items are sent as a Printify order (`external_id` = the Mercur order id) by `src/subscribers/printify-order.ts`, depending on `PRINTIFY_ORDERS`:
  - `off` (default): nothing is sent; the order is marked `metadata.printify.skipped`.
  - `create`: the order is created in Printify; the store's approval setting decides when it is produced (keep it on **Manual** in Printify while testing).
  - `production`: created and sent to production at once (Printify charges the account).
  Test orders (an `@example.com` email) are never sent.
- **Tracking:** `order:updated`, `order:sent-to-production`, `order:shipment:created` and `order:shipment:delivered` write the status and tracking links to `metadata.printify` on the Mercur order.
- **Setup and re-sync:** `curl -X POST <api>/hooks/printify/sync -H "x-printify-secret: $PRINTIFY_WEBHOOK_SECRET"` registers the webhooks and imports every published product (add `?recreate=1` to rebuild them).

| Variable (`commerce`) | |
|---|---|
| `PRINTIFY_API_TOKEN` | Printify → My Profile → Connections (personal access token) |
| `PRINTIFY_SHOP_ID` | `29759065` (the "Medusa" API store) |
| `PRINTIFY_WEBHOOK_SECRET` | any random string (`openssl rand -hex 20`); signs Printify's webhooks |
| `PRINTIFY_ORDERS` | `off` / `create` / `production` |
| `PRINTIFY_FLAT_SHIPPING` | shipping shoppers pay for Studio items (default 6.99; Printify quoted 9.19 for a sweatshirt) |
| `PRINTIFY_BASE_URL` | only for Printful Enterprise: `https://enterprise.printful.com/api/pfy/public/v1` |

## Next steps

- **Referral credit:** move Shelby's referral credit and first-order discount to Medusa promotions. The Mercur checkout doesn't apply them yet.
- **Customer accounts:** sign in, so that order history comes from `/store/order-groups`.
