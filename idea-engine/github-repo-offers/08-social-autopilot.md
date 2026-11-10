# Niche Scorecard: Postiz "social autopilot" for local businesses (Gate 0)

Date: 2026-11-10 · Offer: 12–16 posts a month in the client's voice, scheduled, plus a monthly report, for med spas, gyms, realtors and restaurants whose last post was 60+ days ago. $250 setup + $500/mo.

Sources:
- Upwork job pages from the web search index (Oct 2026).
- LinkedIn jobs via treg "med spa social media", US, past month, 4 pages / 40 rows.
- Live pricing pages: Buffer, Ocoya, Boomp.
- Webtonic agency round-up.
- Search snippets for agency packages.

Limits: Upwork job search returns 403, so counts are a sample. Reddit search via treg returned off-topic posts.

| Check | Result | Evidence |
|---|---|---|
| 1. Buyers asking (20+) | Fail on freelance sites (~3 tight, $100–$200 budgets). Med spas hire in-house instead | See 1 |
| 2. Competitors priced | Fail. Saturated, and AI done-for-you at $39–$275/mo caps the price | See 2 |
| 3. Margin ≥50% | Fail at $50/h (~5–25%). Passes at $20/h | See 3 |
| 4. Watering holes | Pass | See 4 |

## 1. Buyers asking
Tight (local business, social retainer, Upwork, Oct 2026):
- [Social media and marketing management](https://www.upwork.com/freelance-jobs/apply/Social-media-and-marketing-management_~022110711584418268426/): a restaurant marketing company pays **$150/mo per restaurant**. Posted Oct 15.
- [Social Media Manager](https://www.upwork.com/freelance-jobs/apply/Social-Media-Manager_~022109689408043370448/): restaurant and lifestyle brands, ongoing, includes monthly reports. Posted Oct 12. Budget not verified.
- [Website Developer & Digital Marketing Specialist](https://www.upwork.com/freelance-jobs/apply/Website-Developer-Digital-Marketing-Specialist_~022112273941738814496/): prefers med spa experience. **$100 fixed**. Posted Oct 19.
- "Social Media Manager Needed – Med Clinic Experience", **$200 fixed**, seen on an [Upwork category page](https://www.upwork.com/job/~01459151823c16c3fd/). Date not verified.

Tight count: **~3–4 in 30 days**, with budgets of $100–$200.

Loose (LinkedIn, in-house, past month) at aesthetics practices:
- Peace Love Med (Boca Raton, Nov 3). The title says **"No Agencies, must be in house"**.
- Marietta Plastic Surgery (Nov 5).
- Mia Aesthetics (two roles).
- Milan Laser Hair Removal.
- United Aesthetics Alliance.

The other ~34 rows were beauty brands, not local businesses.

Twine also lists med spa social media manager projects ([Glowlight Med Spa](https://www.twine.net/projects/b8ro90-glowlight-med-spa-social-media-manager-social-media-manager-in-bellevue-united-states-job), [NuImage Medspa](https://www.twine.net/projects/b8adu0)). Their dates were not verified.

Trigger problem: the lead source is businesses that have not posted in 60+ days. These are the owners who have shown they do not value social. Every buyer found above was already active and hiring.

## 2. Competitors (live prices)
- [Boomp](https://boomp.net/pricing): AI writes and posts for you, including to Google Business Profile. **$39/mo for 22 posts**, $79 for 28. A human-approved done-for-you tier is **$275/mo**. It runs city landing pages aimed at exactly "social media management for med spas" ([Austin](https://boomp.net/local/social-media-management-med-spas-austin), Dallas, Denver and more).
- [Buffer](https://buffer.com/pricing): **$5–$10/channel/mo**, with an AI assistant on every plan.
- [Ocoya](https://www.ocoya.com/pricing): **$29–$199/mo**, AI copy plus scheduling.
- Wowbix med spa packages: **from $499/mo** for 12–15 posts on IG and FB ([search snippet](https://healthcare.wowbix.com/?p=21087); live page not verified).
- [BizIQ](https://biziq.com/pricing/social-media/): **$899/mo**, 12 posts, plus $1,398 setup (search snippet; not verified live).
- [Contra listing](https://contra.com/s/7BZqBmgP-12-posts-per-month-do-it-for-you-social-media-content): 12 posts/mo **from $375**.
- [Webtonic's list of 20 med spa social agencies](https://www.webtonic.io/blog/best-social-media-management-agencies-for-medical-spa-aesthetics): 19 publish no price. One ("The Social 99") starts **from $99/mo**.
- Fiverr monthly social media manager gigs start **from $45** ([example](https://www.fiverr.com/nikstell/be-your-social-media-manager)). Fiverr's own guide puts typical gigs at $30–$162 ([Fiverr](https://fiverr.com/resources/guides/costs/social-media-marketing)).

Read: this is one of the most saturated agency offers there is. An AI done-for-you product at $39–$275/mo does the same job as "AI posts plus scheduling", so $500 has to be justified by something else: real photos, a human voice, engagement.

## 3. Margin (at $500/mo)
- Tools: Postiz self-hosted on a VPS (~$10), LLM API (~$5), Canva (~$15), so about **$30/mo** (estimate).
- Honest hours per month:
  - Collecting real photos and offers from the owner: 1–2h
  - Writing and designing 12–16 posts: 3–5h
  - Approvals and edits: 1h
  - Scheduling, fixing broken tokens and reconnects: 0.5–1h
  - Monthly report and call: 1–1.5h
  - Total: about **7–10h**.
- At $50/h: (500 − 30 − 350…500) / 500 = **−6% to 24%**. **Fail.**
- At $20/h (VA): (500 − 30 − 140…200) / 500 = **54–66%**. Passes, but churn risk is high with dormant-account buyers.
- The $250 setup fee is excluded.

## 4. Watering holes
- American Med Spa Association (AmSpa) and its Medical Spa Show.
- Health & Fitness Association (formerly IHRSA) for gyms.
- National Association of Realtors and local realtor boards.
- State restaurant associations.
- Local Chambers of Commerce and BNI chapters.
- r/smallbusiness, r/restaurateur, r/realtors.
- Lead data: Google Maps listings joined with each business's last Instagram or Facebook post date.

## Attention (30-day)
- The repo is real: [gitroomhq/postiz-app](https://github.com/gitroomhq/postiz-app) has **41.2k stars** and is **AGPL-3.0**. It describes itself as "the ultimate agentic social media scheduling tool". It schedules posts and does not write them in a voice by itself.
- Seller side: "AI social media management agency" is a mainstream make-money-online pitch, for example [aibusiness.vc "Earn $1,200–$5,000/Month Per Client"](https://aibusiness.vc/solo/ai-social-media-management). A 30-day count of course sellers was not verified.

## The video's claims vs the evidence
- "Dormant accounts are leads": weak. Buyers seen are active hirers, and one med spa says "no agencies".
- "$500/mo": above the AI done-for-you options ($39–$275) and inside the human-agency band ($375–$899). That band assumes human creative and real photos.
- "Postiz does the work": it is the scheduler. Writing, photos and the report are still labor.

## Verdict: ❌ REJECT (fails check 1, few tight buyers at $100–$200; check 2, saturated and capped by $39–$275 AI done-for-you; and check 3 at an honest rate)
Better angle: drop "posts". Sell **Google Business Profile plus review-response management for med spas**, which feeds local search and bookings. Or sell **on-site content capture**: a monthly shoot day plus editing, which AI tools cannot copy. Both need their own Gate 0 run.
