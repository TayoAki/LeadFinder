# Checkpoint 1: 3 open-source repos, 1 offer each

Date: 2026-11-11.

**Why restaurants:** all three offers target **independent restaurants**, for three reasons:
1. The UGC avatar is *latina-kitchen*. A woman in a kitchen talking to restaurant owners is credible; the same avatar pitching SaaS to accountants is not.
2. Restaurants publish a phone number and usually an email, so the treg lead pull can deliver both.
3. Restaurants already pay a lot for these outcomes. The proof is below.

Repo data comes from treg `crawl4ai.github.repo.profile` on 2026-11-11. Search data is DataForSEO US monthly volume (`scan/evidence.json`, spend 0.09 dollars). Competitor prices come from third-party pricing pages; they're flagged where sources disagree.

## Summary

| | Offer 1 ⭐ recommended | Offer 2 | Offer 3 |
|---|---|---|---|
| **Repo** | [tastyigniter/TastyIgniter](https://github.com/tastyigniter/TastyIgniter): MIT, 3,841★, last push 9 Nov 2026, v4.5.0 | [pipecat-ai/pipecat](https://github.com/pipecat-ai/pipecat): BSD-2, 17,201★, last push 11 Nov 2026, v1.15.0 | [HiEventsDev/Hi.Events](https://github.com/HiEventsDev/Hi.Events): AGPL-3.0 plus extra terms, 4,169★, last push 9 Nov 2026 |
| **Offer** | **"Keep the 30%"**: your own commission-free ordering site and app, live in 7 days | **"Never miss a call"**: a bilingual (English/Spanish) AI phone host | **"Sell out the table"**: ticketed cooking classes, supper clubs and wine dinners with no per-ticket fees |
| **Price** | **497 dollars setup + 199 dollars/mo**, month to month, 0% commission | **297 dollars setup + 249 dollars/mo** per location (includes 1,000 call-minutes) | **297 dollars setup + 79 dollars/mo** |
| **What it undercuts** | Owner.com 249–499 dollars/mo plus fees; ChowNow 229–449 dollars/mo plus a 119–499 dollar setup fee | Slang.ai about 399 dollars/location/mo, with bilingual sold as an add-on | Eventbrite fees on every ticket |
| **Money proof** | **Strongest.** Owner.com is about 100M dollars ARR (Sacra estimate, Jul 2026), valued at **2.3B dollars** (Aug 2026). "owner.com" 2,900/mo, **+46%**. "chownow" 14,800/mo. Ad clicks cost **44–46 dollars** ("online ordering system for restaurants", "restaurant website builder"). | Strong. "loman ai" 1,600/mo, **+96%**; "slang ai" 1,300/mo; "ai receptionist for restaurants" 90/mo, **+471%**. Clicks cost **84–137 dollars** for "phone answering" terms. | **Weak.** "eventbrite fees" 1,000/mo (−43%), "eventbrite alternative" 480 (CPC 27 dollars). Restaurant-ticketing terms are near zero. |
| **Gross margin** | About 80% | About 45–55% (voice minutes are the cost) | About 75% |
| **Biggest risk** | Toast, Square and Clover all include online ordering. The pitch must win on *done-for-you plus marketing*, not the software. | Crowded. Earlier research found AI-receptionist sellers outnumber buyers 4–10 to 1. The bilingual angle is the wedge. | Small market. A white-label commercial licence is needed (about 499 dollars, unverified). |
| **Avatar fit** | ✅ Natural: she talks owner to owner about delivery-app fees | ✅ Natural, and she can switch to Spanish mid-script | ✅ Very natural (cooking classes), but a weak market |

---

## Offer 1 ⭐ Keep the 30%: commission-free ordering, live in 7 days (TastyIgniter)

**The promise:** "Your own online ordering site and Google ordering button, with 0% commission, live in 7 days. Move your regulars off DoorDash and keep the 15–30% you're paying them."

**What we build on TastyIgniter** (MIT licence, so we may host it for clients and rebrand it freely):
1. **Branded ordering site** on the restaurant's domain: menu import from their DoorDash/Uber Eats menu, pickup and own-driver delivery, Stripe payouts straight to the restaurant.
2. **Google "Order online" button.** We connect the Google Business Profile ordering link to their site instead of the delivery apps.
3. **"Order direct, save" kit:** printed bag inserts and a QR table tent, plus SMS/email to past customers giving 10% off the first direct order.
4. **Monthly win-back text** to lapsed customers, and a monthly report: direct orders, commission saved, top items.

**Price:** 497 dollars setup + 199 dollars/mo, cancel anytime, 0% commission (the diner pays standard card processing).
- **Guarantee:** if the restaurant doesn't save at least 199 dollars in commission in the first 60 days, month 3 is free.
- **Logic:** a restaurant doing 15k dollars/mo through DoorDash at 25% pays about **3,750 dollars/mo** in commission. Moving just 10% of that volume direct saves about 375 dollars/mo, which is about 2× our fee.

**Unit economics:**

| Item | Cost per client per month |
|---|---|
| Hosting (shared VPS) | ~8 dollars |
| SMS | ~15 dollars |
| Support and report | 1.5 h × 25 dollars = 37.50 dollars |
| **Total** | **~60 dollars of 199 dollars → ~70% margin** |

Setup takes about 6 hours, and is templated after client 3. Margin approaches 80% at volume.

**Competitors (prices from third-party roundups, Aug 2026):**

| Competitor | Price |
|---|---|
| Owner.com | 249 dollars/mo + 5% per order, or 499 dollars/mo flat; plus a 5% guest fee |
| ChowNow | 229–449 dollars/mo + 119–499 dollar setup |
| Toast / Square online ordering | Bundled with their POS |

**Our gaps to fill:** price (199 dollars is below everyone), month-to-month terms, a person who sets it up, and a menu copied from their delivery app in a day.

## Offer 2: Never miss a call, bilingual AI phone host (Pipecat)

**The promise:** "An AI host that answers every call in English or Spanish: hours, menu questions, reservations and catering leads. It texts the caller your ordering link, so the rush never costs you an order again."

**What we build on Pipecat** (BSD-2, free for commercial use):
- A voice agent on a Twilio number that the restaurant forwards to when busy or after hours.
- It knows the menu, hours, allergens and parking.
- It takes reservations into the restaurant's existing book (or by SMS to the manager).
- It captures catering and large-party leads.
- It texts the online-ordering link to the caller.

**Price:** 297 dollars setup + 249 dollars/mo per location, including 1,000 minutes.

**Unit economics:**
- 900 minutes at about 0.12 dollars/min (telephony + speech-to-text + LLM + text-to-speech) ≈ 108 dollars.
- Plus 1 hour of tuning a month (25 dollars).
- So **~135 dollars of 249 dollars → ~46% margin.** That's below the 50% bar unless call volume is lower or the price is 299 dollars.

**Competitors:**
- Slang.ai: about 399 dollars/location/mo Core, 599 dollars Premium; bilingual is an add-on (sources vary).
- Loman: moved to contact-us pricing in Jun 2026; third-party sites list 249–299 dollars, unverified.
- Others: Maple, Hostie, SoundHound.

## Offer 3: Sell out the table, fee-free ticketing (Hi.Events)

**The promise:** "Sell tickets for cooking classes, supper clubs and wine dinners from your own branded page. No per-ticket fees, deposits up front, automatic reminders, and a waitlist when you sell out."

**What we build on Hi.Events:** a branded event page and checkout, Stripe payouts to the restaurant, reminder emails and SMS, waitlists, and capacity per seating.

**Price:** 297 dollars setup + 79 dollars/mo.

**Licence:** AGPL-3.0 with additional terms. Free use requires a visible "Powered by Hi.Events" link. Removing it needs a commercial licence; one third-party page says a single domain costs about 499 dollars, unverified.

**Why it's third:** search demand is near zero for restaurant ticketing, and Eventbrite or Tock already serve the restaurants that run events.

---

## Recommendation

**Go with Offer 1.** It has the clearest money trail:
- one company in this exact space is estimated at about 100M dollars ARR;
- advertisers pay 44–46 dollars a click;
- the buyer's pain is a number they see on every DoorDash statement.

**Offer 2 as an upsell later:** it's a natural month-3 add-on ("we also answer your phone") rather than the lead offer.

Sources:
- Owner.com: [Sacra](https://sacra.com/c/owner), [Series D coverage](https://runtimewire.com/article/adam-guild-owner-240m-series-d-ai-restaurants), [G2 pricing](https://www.g2.com/products/owner-com/pricing), [CostBench](https://costbench.com/software/food-delivery-platform/owner-com/)
- ChowNow: [Sauce on ChowNow pricing](https://www.getsauce.com/post/chownow-pricing-and-fees), [Capterra](https://www.capterra.com/p/229841/ChowNow/pricing/)
- Slang.ai: [PricingSaaS Slang](https://pricingsaas.com/companies/slangai), [Synthflow on Slang pricing](https://synthflow.ai/blog/slang-ai-pricing)
- Loman: [PricingSaaS Loman](https://pricingsaas.com/companies/loman), [CloudTalk on Loman pricing](https://www.cloudtalk.io/blog/loman-ai-pricing/)
- Hi.Events: [Hi.Events licensing](https://hi.events/licensing), [Chobble comparison](https://tickets.chobble.com/compared-to/hi-events/)
