# Checkpoint 1b: wider sweep, 20 repos checked

Date: 2026-11-11. The same buyer (independent restaurants and other food businesses) and the same evidence bar as `01-three-repos-three-offers.md`:
- Repo facts come from treg `crawl4ai.github.repo.profile`.
- Search data is DataForSEO US (`scan2/evidence.json`, 45 keywords, 0.09 dollars).
- Competitor prices come from third-party pricing pages, and sources often disagree. Treat them as ranges.

**What makes an offer pass:**
1. The licence lets us host it for paying clients.
2. Restaurants already pay a named competitor for the outcome.
3. Gross margin is at least 50%.
4. The latina-kitchen avatar can pitch it believably.

## Ranked shortlist (8 that pass or nearly pass)

| Rank | Repo | Offer | Our price | Who they pay today | Demand data | Margin | Verdict |
|---|---|---|---|---|---|---|---|
| **1** | [TastyIgniter](https://github.com/tastyigniter/TastyIgniter) · MIT · 3.8k★ | **Keep the 30%**: a commission-free ordering site, live in 7 days | 497 dollars + 199 dollars/mo | Owner.com 249–499 dollars/mo (about 100M dollars ARR, 2.3B dollar valuation); ChowNow 229–449 dollars/mo | "owner.com" 2,900/mo **+46%**; clicks cost 44–46 dollars | ~70–80% | ✅ **Best** |
| **2** 🆕 | [ComfyUI](https://github.com/Comfy-Org/ComfyUI) · GPL-3.0 · 146k★ | **Menu Photo Makeover**: phone snaps turned into pro-looking photos for every menu item, for DoorDash, Uber Eats, Google and their own menu | **297 dollars one-time** (up to 40 items) + 49 dollars/mo for new items | Photographers at 50–150 euros a dish (3–6k dollars for a shoot) | "ai food photography" 170 **+141%**; "menu photos" 320 +22% | ~85% | ✅ Cheapest yes; a door-opener for #1 |
| **3** | [Pipecat](https://github.com/pipecat-ai/pipecat) · BSD-2 · 17k★ | **Never miss a call**: bilingual AI phone host | 297 dollars + 249 dollars/mo | Slang.ai about 399 dollars/location/mo; Loman by quote | "loman ai" 1,600 **+96%**; "ai receptionist for restaurants" **+471%** | ~46% | 🟡 Crowded; margin below the bar |
| **4** 🆕 | [Tandoor Recipes](https://github.com/TandoorRecipes/recipes) · AGPL-3.0 · 8.7k★ | **Food Cost Fix**: every recipe costed and a repricing plan for the 10 dishes losing money; we re-cost monthly when supplier prices move | 1,200 dollars one-time + 99 dollars/mo | MarketMan 199–339 dollars/location/mo (+500 dollar setup); meez | "meez" 12,100/mo; "food cost calculator" 1,900 (CPC 8 dollars); "recipe costing software" CPC **51 dollars** | ~55% (entering recipes is 10–15 h) | 🟡 Real pain, labour-heavy |
| **5** 🆕 | [DocuSeal](https://github.com/docusealco/docuseal) (AGPL, 19k★) + [Cal.diy](https://github.com/calcom/cal.diy) (MIT, 50k★) | **Catering Desk**: inquiry form → quote → e-signed contract → deposit → reminders, so catering leads stop dying in DMs | 497 dollars + 149 dollars/mo | Tripleseat about 375 dollars/venue/mo; Total Party Planner 65–365 dollars/mo | "catering software" 390 (CPC **55 dollars**); "catering contract template" 880 | ~75% | 🟡 Good margin, but HoneyBook (19–79 dollars/mo) caps the price |
| **6** 🆕 | [Formbricks](https://github.com/formbricks/formbricks) · AGPL core · 13k★ | **5-Star Engine**: a text after every order asking *everyone* for a review (no gating), private feedback, AI-drafted replies | 149 dollars/mo | Podium 399–599 dollars/mo; Birdeye 299–449 dollars/mo; NiceJob 75 dollars/mo | "get more google reviews" 390 **+25%** (CPC 33 dollars) | ~80% | 🟡 Proven spend, but earlier research found review sellers saturated and the repo adds little |
| **7** | [Hi.Events](https://github.com/HiEventsDev/Hi.Events) · AGPL + extra terms · 4.2k★ | **Sell out the table**: fee-free tickets for classes and supper clubs | 297 dollars + 79 dollars/mo | Eventbrite fees; Tock | Restaurant-ticketing terms near zero | ~75% | 🟡 Small market; white-label needs a paid licence |
| **8** 🆕 | [Evolution API](https://github.com/evolution-foundation/evolution-api) · Apache-2.0 + conditions · 10k★ | **WhatsApp ordering** for Latino restaurants | 297 dollars + 99 dollars/mo | WATI and similar | "whatsapp ordering system" 10/mo (CPC 49 dollars) | ~70% | ⚠️ Risky. It uses the unofficial WhatsApp Web route, so numbers can be banned. Since v2.4 it reportedly needs activation against the vendor's licence server. |

## Rejected (and why)

| Repo | Idea | Why not |
|---|---|---|
| [Typebot](https://github.com/baptisteArno/typebot.io) (10.6k★) | Restaurant chatbot | **Licence:** the Functional Source License forbids selling it as a competing service. |
| [Postiz](https://github.com/gitroomhq/postiz-app) (41k★) | Social posting for restaurants | Saturated sellers. It schedules posts but doesn't write them (see the earlier 29-offer research). |
| [Odoo](https://github.com/odoo/odoo) (56k★) | POS switch | Restaurants already have Toast or Square. A POS migration means weeks of support per client. |
| [Medusa](https://github.com/medusajs/medusa) (37k★) / [Saleor](https://github.com/saleor/saleor) (24k★) | Shop for packaged food brands | Shopify is cheap and already owned. |
| [listmonk](https://github.com/knadh/listmonk) (24k★) | Email/SMS win-back | Toast Marketing costs about 75 dollars/mo. It's already a component of #1. |
| [Chatwoot](https://github.com/chatwoot/chatwoot) (40k★) | One inbox for DMs | No restaurant budget line for it. It fits better as a piece of #5. |
| [Twenty](https://github.com/twentyhq/twenty) (61k★) | Catering CRM | Overlaps #5 with a heavier tool. |
| [Activepieces](https://github.com/activepieces/activepieces) (25k★) | Automations | No specific outcome to sell. |
| [IC-Light](https://github.com/lllyasviel/IC-Light) (8.6k★) | Food photo relighting | No commits since Feb 2025; ComfyUI covers it. |

## What changed in the recommendation

**Still #1: Keep the 30% (TastyIgniter).** It has the strongest money trail by far.

**New #2: Menu Photo Makeover (ComfyUI).** It's worth knowing for two reasons:
- **It's an easy first yes.** A 297 dollar one-time fee against a 3–6k dollar photographer is cheap enough to close on a cold call.
- **It feeds #1.** The new photos go straight into the ordering site, so it works as the front door: "fix your photos for 297 dollars → keep the 30% for 199 dollars a month".

**Risks to check before selling #2:**
- Delivery apps may offer their own photo programs or AI tools for free (not verified).
- The output must look like the real dish. Enhancing a photo is fine; generating a dish that doesn't exist misleads diners and may break platform rules.
- The 44% sales-lift figure is attributed to DoorDash in a vendor blog and **not verified** from DoorDash itself.

Sources:
- Podium and Birdeye: [CostBench](https://www.costbench.com/compare/birdeye-vs-podium/), [NiceJob comparison](https://www.truereview.co/post/birdeye-vs-podium-vs-nicejob-vs-truereview-an-honest-comparison)
- MarketMan: [Capterra](https://www.capterra.com/p/136439/Marketman-Restaurant-Inventory/pricing/), [The Restaurant HQ](https://www.therestauranthq.com/technology/marketman-review/)
- Tripleseat: [Ticket Fairy](https://www.ticketfairy.com/compare/event-management/ticket-fairy-vs-tripleseat)
- Total Party Planner: [Software Advice](https://www.softwareadvice.com/retail/total-party-planner-profile/)
- Food photography: [Snappr menu article](https://www.snappr.com/blog/how-to-create-a-restaurant-menu), [KitchenNmbrs](https://kitchennmbrs.app/en/knowledge-base/menu-psychology-menu-engineering/whats-the-effect-of-a-photo-of-a-dish-on-your-menu-on-sales), [Canadian Pizza Magazine](https://www.canadianpizzamag.com/best-photo-forward-3593/)
- Typebot licence: [Typebot docs](https://docs.typebot.com/self-hosting), [Typebot fair-source post](https://typebot.io/blog/typebot-is-now-fair-source)
- Evolution API licence: [README](https://raw.githubusercontent.com/evolution-foundation/evolution-api/main/README.md), [Pillitteri](https://pasqualepillitteri.it/en/news/12969/integrate-whatsapp-evolution-api-vs-cloud-api)
