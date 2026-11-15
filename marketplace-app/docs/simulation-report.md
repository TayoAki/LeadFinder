# Shelby: 100-shopper simulation

- **Date:** 2026-11-15.
- **Tools:** `scripts/simulate-users.cjs` and `scripts/analyze-sim.cjs`.

**How it was run:**
- **Shoppers:** 100 synthetic shoppers, 10 at a time, drove the real web app UI (taps, scrolls, typing; no API shortcuts) in 390×844 iPhone-sized browsers.
- **Stack:** Shelby's web server plus Mercur's production build (Postgres and Redis), all on one local machine.
- **Personas:**

| Persona | Share | Tries to buy |
|---|---|---|
| Browser | 25% | Never |
| Onboarder | 20% | 30% |
| Searcher | 15% | 40% |
| Video shopper | 15% | 40% |
| Ask Shelby | 10% | 30% |
| Buyer (two shops) | 15% | 100% |

- **Two runs:**
  - **Run 1:** the app as built.
  - **Run 2:** after fixing what run 1 found. Stock was still depleted from run 1, which makes it a harder test.

## Results

| | Run 1 | Run 2 |
|---|---|---|
| Orders placed | 21 | **26** |
| Failed steps | 25 | **3** |
| Checkout failures | 4 | **0** |
| Video "Shop" failures | 9 | **0** |
| Browser errors / 5xx | 0 / 0 | 0 / 0 |
| Cold start (p50 / p95) | 1.8s / 5.0s | 1.7s / 4.8s |
| Pay → order confirmed (p50 / p95) | 3.8s / 9.3s | 4.8s / 12.4s |

## Bottlenecks, worst first

### 1. Checkout is slow: 4–5 s typical, 9–12 s at p95 (open)

When the shopper taps Pay, the app makes the whole Mercur cart from scratch in **8+ sequential calls**:
1. create the cart;
2. add each line item;
3. set the address;
4. fetch the shipping options;
5. add a shipping method for each seller;
6. create the payment collection;
7. create the payment session;
8. complete the order.

Under load:
- **Slowest calls (p95):** `shipping-methods` 2.4 s, `complete` 2.1 s, `carts/:id` 1.9 s, `line-items` 1.8 s.
- **Side effect:** every Pay attempt also leaves an orphan cart behind if it fails.

**Fix:** keep a live Mercur cart that grows as the shopper adds items (store its id on the device). Set the address and per-seller shipping when the cart screen opens. Then Pay only creates the payment session and completes, about 1 s. This also makes the cart survive app restarts.

### 2. The whole catalogue downloads before the first screen (open; won't scale)

- **What happens:** every app open makes 6 API calls (regions, payment providers, sellers, all products and all offers, in pages of 100) before anything renders.
- **Cost at 10 concurrent shoppers:** `/store/products` reaches 2 s at p95 and cold start 4.8 s at p95.
- **Why it matters:** it's fine at 88 products. At 5,000 products it becomes 50+ offer pages and megabytes on every launch.

**Fix:** load only what the first screen needs (Home rails, paged search on the server). Cache the catalogue with ETags or a CDN, and show skeleton screens instead of the splash.

### 3. Everyone was sent to the same few products, which sold out mid-run (fixed)

- **Why:** Home picks, the first video and the top of the grid all featured the same bestsellers, and several had only 2–3 units.
- **Effect in run 1:** five products dropped to ≤1 unit. Shoppers then hit:
  - **Disabled "Add" buttons:** 9 video-shop failures and 6 add-to-cart failures.
  - **Mercur's raw checkout error:** "Some inventory item linked to an offer does not have sufficient stock" (4 checkout failures).

**Fixed:**
- **Checkout recovers:** it refreshes live stock, removes what sold out and says so in plain words.
- **Sold-out states are honest:** a "Sold out" badge and button replace "Only 0 left".
- **Recommendations skip what can't be bought:** Shelby's picks never include sold-out items, and videos and search results put them last.

**Still worth doing:**
- spread merchandising across more products and shops;
- low-stock alerts for sellers;
- release reserved stock when unpaid carts expire.

### 4. Home flashes, then onboarding slides over it ~1.3 s later (open)

On every first visit, Home renders and then onboarding covers it 1.2–1.7 s later. The first impression is a screen the shopper can't use yet.

**Fix:** decide before the first render, with onboarding as the initial route for new shoppers.

### 5. Search failed on natural phrases (fixed)

- **Problem:** "gift for dad" returned 0 results, because every word had to match.
- **Fix:** search now ignores filler words and ranks sold-out items last. The empty state already offers "Ask Shelby about …", which is the right bridge for intent-style queries.

### 6. Fabricated social proof contradicts itself (open, needs your decision)

A sold-out product said "4 people have this in their cart right now". That count is generated from the product ID, not real.

**Fix:** use real counts from Shelby's own events, or remove it. (This is also in `docs/design-audit.md`.)

## Caveats

- **One machine:** everything ran locally, so production adds network round trips (roughly +50–150 ms per call from the US). It also runs Mercur as one shared server/worker process.
- **Synthetic shoppers:** they follow scripted personas with short think times. They find mechanical and capacity problems well, but say nothing about real preferences.
- **Conversion numbers reflect the personas' scripted buy rates,** not a forecast.
- **Test orders:** the runs placed 47 test orders in the local database only, not production.
