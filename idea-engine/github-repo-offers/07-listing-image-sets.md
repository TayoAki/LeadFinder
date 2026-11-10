# Niche Scorecard: ComfyUI "listing image sets" for Amazon/Shopify (Gate 0)

Date: 2026-11-10 · Offer: a 7-image listing set (lifestyle images and infographics) built around the real product photo, delivered in 48h, for $750 per set. Buyers: brands with 10+ products and weak images (fewer than 7 images, white background only).
Sources:
- Fiverr search "amazon listing images", one page read through treg `crawl4ai.web.scrape`, 30 gigs.
- Upwork job pages (search index, 2026).
- LinkedIn jobs (treg, US, past month, 10 rows).
- Live pricing pages: Bonnie Sorsby, AMZGraphic, Soona, Pebblely.
- An October 2026 price round-up (search snippet).

Limits: Upwork's job search returns 403, so Upwork counts are a sample. Further Fiverr scraping was blocked by a policy check, so only one Fiverr page was read.

| Check | Result | Evidence |
|---|---|---|
| 1. Buyers asking (20+) | Fail. ~2 tight posts in window, budgets $140 or $4–8/h | See 1 |
| 2. Competitors priced | Fail. Heavily saturated, and $750 sits at the agency ceiling | 16,995 Fiverr results. Median "from" price $46 |
| 3. Margin ≥50% | Borderline, ~35–45% at $50/h | See 3 |
| 4. Watering holes | Pass | See 4 |

## 1. Buyers asking
Tight posts on Upwork (listing images or infographics, with a date):
- [Graphic Designer: Amazon A+ content and listing images](https://www.upwork.com/freelance-jobs/apply/Graphic-Designer-Amazon-Content-Product-Listing-Images_~022112641239299533744/): **$7–$8/h**, contract-to-hire, 30+ h/week. Posted Oct 2026, judging by the job ID; exact date not verified.
- [A+ & Product Images Design for Amazon](https://www.upwork.com/freelance-jobs/apply/Product-Images-Design-for-Amazon_~022086029412845804854/): **$140 fixed**, posted Aug 8, 2026, which is outside the 60-day window.
- [Amazon Product Images Editor](https://www.upwork.com/freelance-jobs/apply/Amazon-Product-Images-Editor_~01eb2be86324e9de8b/): **$4–$5/h** for lifestyle shots made from ~100 white-background photos (perfume). Posting date not verified.
- [Graphics Designer for Amazon Listings](https://www.upwork.com/jobs/~022067192137254842042): budget and date not verified.

Tight count: **about 1–2 in the last 60 days**. Upwork buyers want hourly offshore staff or $140 sets, not $750 per set.

Loose (in-house roles on LinkedIn, past month): Westinghouse Outdoor Power "eCommerce Creative Specialist" (×2, Oct 30 and Nov 2), and "Sr. Associate, Digital Shelf" at Lume, Flamingo and Mammoth Brands (Nov 3). Brands with large catalogs hire this work in-house.

Buyers who don't post publicly: Amazon sellers do pay agencies. Bonnie Sorsby's $795 package exists. Nothing verifies how many buyers pay $750 or more in 30 days.

## 2. Competitors (live prices)
- [Fiverr "amazon listing images"](https://www.fiverr.com/search/gigs?query=amazon%20listing%20images): **16,995 results** (read Nov 10, 2026). Across 30 gigs, the "from" price ran $15–$317, **median $46**. Entry tiers often cover 1–3 images.
- [AMZGraphic](https://www.amzgraphic.com/): **$250 for 7 images**, 3-day delivery, unlimited revisions.
- [Bonnie Sorsby](https://bonniesorsby.com/amazon-listing-photography-design-pricing/): **$795 for 7 images** (Standard). $1,195 adds A+ content.
- [Soona](https://soona.co/pricing): real photography at $39/photo plus a $13–$49/mo membership. Pros shoot your actual product.
- [Pebblely](https://www.pebblely.com/pricing): AI product backgrounds at **$9–$39/mo** (30–500 images).
- Amazon's own AI image and listing tools are free in Seller Central (per [Rewarx round-up](https://www.rewarx.com/blogs/15-best-ai-tools-amazon-listings-2026), not verified first-hand).

Read: with 15+ identical offers, the market is saturated. The floor for a 7-image set is about **$120–$250**. $750 matches the top US boutique ($795), but that boutique sells a known name and portfolio, not 48h AI output.

## 3. Margin (at $750 per set)
- Tools: GPU rental for ComfyUI plus Photoshop or Figma, about **$15–$30** per set (estimate, not verified).
- Honest hours:
  - Product research and copy for the infographics: 1.5h
  - Lifestyle generation with the real product kept exact (masking, relighting, rerolls): 3–4h
  - Infographic layout, done by hand because diffusion models garble text: 2h
  - Amazon compliance check and export: 0.5h
  - One revision round and client communication: 1–1.5h
  - Total: about **8–9.5h**.
- At $50/h: (750 − 25 − 400…475) / 750 = **33–43%**. **Fail.**
- At $20/h offshore: (750 − 25 − 160…190) / 750 = **71–75%**. That passes, but it is the same labor pool behind the $46 Fiverr gigs.

## 4. Watering holes
- Lead sources: Keepa and SmartScout/Jungle Scout data to find brands whose ASINs have fewer than 7 images. Amazon storefronts and Shopify catalogs (Store Leads).
- r/FulfillmentByAmazon, r/AmazonSeller.
- Helium 10 and Jungle Scout user communities.
- Seller Central forums.
- Prosper Show and other Amazon seller conferences (dates not verified).
- Amazon-focused agencies that resell white-label design.

## Attention (30-day)
- The repo is real: [ComfyUI](https://github.com/comfyanonymous/ComfyUI) (also served at Comfy-Org/ComfyUI) has **146k stars** and is **GPL-3.0**. It is a node-based diffusion GUI and backend.
- It is a general image engine, not a listing tool. Infographic text and compliance are manual work.
- Seller side is extremely crowded. There are 16,995 Fiverr results, plus many [Upwork service listings](https://www.upwork.com/services/product/design-amazon-product-listing-images-lifestyle-images-and-infographic-designs-1852417386668556532) and [Dribbble services at $150](https://dribbble.com/saad-freelancer/services).
- Buyer-side 30-day chatter was not verified, because Reddit search returned noise.

## The video's claims vs the evidence
- "$750 per set": the market floor is $120–$250. The top boutique charges $795.
- "48h": competitors already offer 3-day delivery.
- "Built around the real photo": this is the right constraint, since Amazon requires a real-photo main image. It is also where most of the hours go.
- "Brands with 10+ products": the math implies $7,500 per brand for 10 sets. That is deal value, not verified demand. Brands this size in the sample hire in-house or pay $4–$8/h.

## Verdict: ❌ REJECT (fails check 1, few tight buyers with low budgets, and check 2, saturation with a $120–$250 price floor)
Better angle: a **catalog refresh priced per SKU** ($99–$149 per set at 10+ SKUs), using offshore QA and sold to brands found via Keepa where image count is below 7. Alternatively, sell **white-label to Amazon agencies**. Either way, it is a volume business, not a $750 premium play.
