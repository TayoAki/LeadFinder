# Shelby: the 7 store pages, and who edits what

Shelby is presented as **one store** (brand: orange `#FF7A1A` + navy `#16213E`, see `src/lib/theme.ts`).

## The 7 pages

| # | Page | Route | What it's for | Content comes from |
|---|---|---|---|---|
| 1 | Homepage | `/` | Quiz entry, categories, sets and guides, picks, videos | Catalogue + `src/data/pages.json` |
| 2 | Product page | `/product/<id>` | Buy box, niche details, size guide, reviews, bundles | Mercur product (title, price, photos, `metadata.details`) |
| 3 | Offer page | `/offer/<slug>` | One set, one decision: what's in it, guarantee, FAQ, "Add the set" | `pages.json` → `offers` |
| 4 | Listicle | `/list/<slug>` | "N things to know…": numbered points, each with its product | `pages.json` → `listicles` |
| 5 | Advertorial | `/story/<slug>` | Editorial story, labelled ADVERTISEMENT, leads to an offer | `pages.json` → `advertorials` |
| 6 | Quiz result | `/match/<segment>` | Segment (ICP), ranked picks, routine, matching offer and guides | Quiz answers (or the segment's preset when opened from an ad) |
| 7 | Cart / checkout | `/cart`, `/checkout` | One order, one shipping line, guest checkout | Live Mercur cart |

Live pages today: offers `evening-wind-down`, `barrier-repair-routine`, `summer-dress-edit`; listicles `magnesium-before-you-buy`, `skin-barrier-signs`, `summer-dresses-desk-to-dinner`; stories `why-we-simplified-skincare`, `evening-routine-that-stuck`; results `/match/skin_barrier`, `/match/wellness_calm`, … (all 10 segments in `src/lib/icp.ts`).

**Ads:** link each ad to the page that matches its angle (e.g. a "sensitive skin" ad → `/story/why-we-simplified-skincare` or `/match/skin_barrier`). Add `?utm_source=…&utm_campaign=…`; every event carries it.

**Measuring:** each page sends `page_view` (`page_type`, `slug`) and its CTA events (`page_cta`, `page_add`, `offer_add_set`, `quiz_result_add`). In Admin → Analytics → Funnels, break down by **Page type** or **Page** (e.g. `page_view → add_to_cart → order_placed`).

## Who edits what

| What | Where | Who |
|---|---|---|
| Products: titles, prices, photos, stock, descriptions, details (fit, ingredients, skin type, goal) | **Mercur operator panel**: `https://commerce-production-4c7b571b.up.railway.app/dashboard` | The store operator (you / your team) |
| Seller-side product editing (if you keep separate warehouses as "sellers") | Mercur vendor panel: `/seller` on the same host | Each seller login |
| Offer, listicle and story copy | `src/data/pages.json` (a code change + deploy) | Whoever owns marketing copy, via a developer for now |
| Analytics, funnels, experiments | Shelby admin: `https://web-production-444e2901.up.railway.app/seller` → Analytics | Admin account |

Product details that drive the niche pages, filters and quiz live in each product's **metadata → `details`** (keys: `fit`, `fabric`, `care`, `model`, `skin_type`, `concern`, `shades`, `key_ingredients`, `free_from`, `how_to_use`, `goal`, `dose`, `servings`, `ingredients`, `tested`, `not_for`, `dimensions`, `materials`, `weight`). Comma-separate multiple values (`"Dry, Sensitive"`).

## Demo content

Synthetic demo data (a supplements + skincare range, and details on every sample product) is on in production. To remove it: on Railway → `commerce` service → Variables, set `SHELBY_DEMO=remove` and redeploy. Pages whose products disappear hide themselves.

## Not done yet

- **Backend is still 10 sample "sellers".** The app shows one store and one shipping line, but an order can still arrive in several packages with per-warehouse shipping. Consolidating everything into a single Mercur seller is the next backend step.
- Page copy lives in code, not in the admin panel.
