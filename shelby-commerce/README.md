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

## Next steps

- **Stripe Connect:** add `@mercurjs/stripe-connector-plugin` for real card payments and seller payouts. Checkout uses the system payment provider until then.
- **Referral credit:** move Shelby's referral credit and first-order discount to Medusa promotions. The Mercur checkout doesn't apply them yet.
- **Customer accounts:** sign in, so that order history comes from `/store/order-groups`.
