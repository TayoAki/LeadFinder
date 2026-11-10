# Funnel teardown: VideoTour.ai and RealEstateContent.ai

Date: 2026-11-10. Purpose: learn where and why these two convert, so our competitor can copy what works and beat what doesn't.

Inputs: `competitor-ads.json` (Keepwatch: 130 VideoTour ads, 80 RealEstateContent.ai ads), live pages fetched today (raw HTML and JS bundles), the VideoTour help center and terms, the RealEstateContent.ai (REC) terms, public YouTube channel pages, Similarweb's free page, and the two background deep-dives ([real-estate-video-saas.md](../deep-dives/real-estate-video-saas.md), [realtor-video-tools-reviews.md](../deep-dives/realtor-video-tools-reviews.md)).

Rules used here: "days" = days the ad has run. Long-running is a proxy for profit, not proof. Anything not seen directly is marked **(unverified)** or **(inferred)**. treg was not used: balance $7.58 before and after, **$0.00 spent**.

---

## 0. The two funnels in one line each

| | Funnel |
|---|---|
| **VideoTour.ai** | Meta video ad, "Try it for Free with your Photos" → product or feature page that repeats the promise → `/create` upload form → sign-up with email, password, phone → confirm email → 1 free video + 50 AI credits, no card → paywall at video #2 → pricing page that **defaults to the annual toggle** ($29 shown; monthly is really $39) → card, auto-renew, **no refunds**. |
| **RealEstateContent.ai** | Meta ad (mostly one line: "Join thousands of agents using AI to put social media on autopilot") → straight to `/pricing-table/?code=FB1150` → one plan, $119/mo or $999/yr → Stripe checkout. Safety nets: **14-day money-back guarantee** from the co-founder, a 3-second / exit-intent lead-magnet popup into Klaviyo, and "Book call" via GoHighLevel. No free trial, no free sample. |

---

## 1. Ad layer

### 1.1 Volume, cadence, survival

| | VideoTour.ai | RealEstateContent.ai |
|---|---|---|
| Ads collected / running now | 130 / 80 | 80 / 76 |
| Format mix | 99 video, 29 image, 2 carousel | 47 DCO (dynamic creative), 25 video, 8 image |
| Median days by format | Video 43; image 3 (sale images) or 9.5 (non-sale) | DCO 407; video 122; image 122 |
| Running 90+ days | 36 | 69 |
| Distinct body copies | 63 | 4 (73 ads share one line) |
| Landing URLs | 7 paths, all `?via=` tagged (94 to `/real-estate-video-tour`) | 77 to `/pricing-table/?type=monthly&code=FB1150`; 3 to `app.../checkout?type=yearly&code=TRUST200` |
| New ads in last 60 days | 42 | 7 |
| Kill rate | High. 50 of 130 stopped, most within days | Very low. 4 of 80 stopped (the 3 TRUST200 checkout ads and 1 image) |

**Launch pattern.**
- VideoTour launches in bursts, then kills fast: 17 in Dec 2025, 15 in Jan 2026 (none survive), 22 in Oct 2026, 12 in Nov 1–9 2026 (all running). It is a **testing machine**.
- REC launches batches and leaves them on: Jul–Sep 2025 (26 ads, all still running), Apr–May 2026 (15), Jul 2026 (27), Oct 2026 (7). Copy barely changes. Meta's dynamic creative does the optimising. This looks like **set-and-forget evergreen** (inferred).

**Geo.** VideoTour's `via` tags show UK (8), AU (3), CA (3) variants. Copy swaps "vendors", "estate agents", "Rightmove", "REALTOR.ca". REC shows no geo variants.

**Seasonality.**
- VideoTour ran **Black Friday 2025** (25 image ads, 24 Nov–2 Dec, "40% OFF for LIFE", "$209/year (normally $368)"), a **Spring Sale** (23 Mar 2026, "20% OFF Team Plans… $566/year (normally $708)", code SPRING26), a **Christmas staging** ad (20 Dec), and a **Thanksgiving / "pumpkins on the porch"** ad (6 Nov 2026). All sale ads ran 0–7 days. Expect a **Black Friday 2026 push around 24 Nov**.
- REC tested **"$200 OFF TODAY"** straight to yearly checkout (code TRUST200, 9 Apr 2026). It was killed in 0–2 days.

### 1.2 VideoTour.ai: angle clusters (my clustering of all 130 ads)

| # | Angle | Ads | Running | Median days | Max days | 90+ days |
|---|---|---|---|---|---|---|
| 1 | Core "photos → cinematic video in 2 min, first one free" | 27 | 18 | **137** | **479** | **17** |
| 4 | Feature / effect showcase (lifestyle, 3D text, transitions, reel maker; before/after) | 21 | 17 | 52 | 266 | 9 |
| 3 | Avatar / "never on camera" | 14 | 11 | 48 | 254 | 5 |
| 7 | Geo URL import ("Drop your REALTOR.ca / Rightmove listing URL") | 2 | 1 | 143 | 243 | 1 |
| 2 | "You're doing it wrong" list (videographer vs CapCut vs AI) | 28 | 28 | 20 | 125 | 2 |
| 8 | Testimonial stack (3 named five-star quotes) | 1 | 1 | 42 | 42 | 0 |
| 5 | Win-the-listing / market-shift argument (sellers, stats) | 9 | 3 | 27 | 197 | 2 |
| 9 | Seasonal AI staging (Christmas, snow, Thanksgiving) | 3 | 1 | 4 | 16 | 0 |
| 6 | Sale / discount (Black Friday, Spring) | 25 | 0 | 2 | 7 | 0 |

What survives:
- **The plain mechanism ad wins.** Short body, arrows, "Try it for FREE", video creative showing the output. Four ads have run 405–479 days.
- **Feature pages plus feature ads work as a second tier** (190–266 days): reel maker, lifestyle, 3D text, transitions, avatar.
- **Long "argument" copy dies.** The Jan 2026 batch of six long-form seller/stat ads (`start-free1`…`start-free6`) ran about 25–27 days and was killed.
- **Discount images die by design.** They are timed promos, not evergreen.
- **The current scale bet** is cluster 2: 28 copies of the same "you're doing it wrong" body, launched Jul–Nov 2026, mostly CTA "See details". It is too young to judge (median 20 days).

CTA: "Learn more" on 72 ads (median 54 days), "See details" on 20, "Sign up" on 13. "Get offer" was used only on sale ads (25, all dead).

Creative style (from transcripts and copy; thumbnails not reviewed frame by frame):
- **Demo screen recording with voiceover** (transcribed ads). Output-first before/after: empty room → lifestyle; noon → twilight.
- **First-person UGC-style copy** ("I make 20 property videos a week. I have never been on camera once.").
- No visible founder or talking-head testimonial videos.

**Top VideoTour hooks (verbatim)**
1. "🔥 Real Estate Videos Made Easy with VideoTour.AI → Turn up to 20 photos into a cinematic listing video in just 2 minutes" — 479 days ([ad](https://www.facebook.com/ads/library/?id=4240123692877099)), 459 days ([ad](https://www.facebook.com/ads/library/?id=2638555559819755)), 430 days ([ad](https://www.facebook.com/ads/library/?id=624925417111414))
2. "🎬⚡️ Real Estate Pros: Turn your listings photos into AI Property Videos with just a click!" — 405 days ([ad](https://www.facebook.com/ads/library/?id=649455761264190))
3. "Spending hours filming and editing property videos? Or avoiding video altogether because it's too complicated?" — 393 days, UK ([ad](https://www.facebook.com/ads/library/?id=1379696520440021))
4. "Too busy to create videos? Let AI turn 30 photos into a professional-looking home tour in just 2 minutes!" — 359 days ([ad](https://www.facebook.com/ads/library/?id=2626178674417997))
5. "Ditch the "cold" empty rooms 🥶 🏠 … for as low as $0.50 per video." — 266 days ([ad](https://www.facebook.com/ads/library/?id=912196857856246))
6. "Real estate pros, stop wasting hours filming or editing! Upload one photo of yourself + your listing photos" — 254 days, avatar ([ad](https://www.facebook.com/ads/library/?id=1404066217587561))
7. "Drop your REALTOR.ca listing URL here and watch the magic happen ✨" — 243 days ([ad](https://www.facebook.com/ads/library/?id=1039400002589506))
8. "I make 20 property videos a week. I have never been on camera once." — 140 days ([ad](https://www.facebook.com/ads/library/?id=989064060548457))

**Script structure of the two longest transcribed videos** ([459 d](https://www.facebook.com/ads/library/?id=2638555559819755), [430 d](https://www.facebook.com/ads/library/?id=624925417111414)):

| Step | Content |
|---|---|
| Hook (question) | "Do you need property videos created fast…?" / "Are you still skipping videos for your listings? Do you think it's too complicated, expensive, or time consuming?" |
| Mechanism | "Just upload up to 20 photos and our AI does the rest." "No cameras needed, no editing software required, no learning curve." |
| Proof | Light. Social momentum ("More and more agents are using AI… selling properties faster than ever"). Distribution list (MLS, Zillow, Instagram, TikTok, YouTube). No numbers, no names. |
| Price anchor | "All for under five dollars." |
| Payoff | "make you the name people remember when they're scrambling to find an agent" |
| CTA | "click the button below to get your first video free." |

Offers stated in VideoTour ads:
- "first video free" / "First one is FREE" in most ads.
- "no credit card required" in several.
- Per-video prices: "$2.90 per video", "as low as $0.50 per video", "under five dollars".
- Monthly prices: "$39/month" (Jan 2026 ad), and a testimonial saying "$79/mo for 40 videos". Note that **$39 and $79 are the real monthly prices** (see §3).

### 1.3 RealEstateContent.ai: angle clusters

REC is almost a single-message advertiser:

| Copy | Ads | Running | Days |
|---|---|---|---|
| Title "The fastest growing social media tool for real estate" + body "Join thousands of agents using AI to put social media on autopilot🚀" | 73 (+3 with URL) | 73 | 23–485 (median about 164) |
| "For just $99, you'll get: 🤖 AI-powered posting across Facebook, Instagram, X, and LinkedIn…" (title "Get started today!", CTA Sign up) | 2 | 2 | 481 ([ad](https://www.facebook.com/ads/library/?id=1198179202115071)), 122 |
| "Say goodbye to expensive social media managers. Get top-notch content at a fraction of the price." (title "10x the Value at a Fraction of the Cost"; link text "for less than a cup of coffee a day") | 2 | 1 | **552** ([ad](https://www.facebook.com/ads/library/?id=1342596553467083)) |
| "$200 OFF TODAY" → yearly checkout | 3 | 0 | 0–2 |

Because the copy is fixed, **the creative carries the angle**. The two transcribed videos ([483 d](https://www.facebook.com/ads/library/?id=1296065705854629), [465 d](https://www.facebook.com/ads/library/?id=636517222283736)) are **UGC agent testimonials** (first person, B-roll of sold homes):

| Step | Content |
|---|---|
| Hook (result claim) | "Last year I sold 20 properties like this one, this one, and this one. And it was all thanks to the leads I got off social media." (Variant opens: "I used to run expensive billboard ads and cold call people…") |
| Enemy | "instead of cold calling, door knocking, or chasing FSBOs" |
| Reframe | "you haven't built authority or position yourself as the go-to agent in your zip. The fastest way to do that is by posting content." |
| Objection kill | "you don't need fancy cameras, tons of followers, or any social media experience" |
| Demo in words | "write who your ideal client is… in under one minute, boom! You get 30 ready-to-use content ideas… Pick one, choose the day… Your whole month of content is done" |
| CTA | "Stop chasing leads and start getting listing from social media using realestatecontent.ai." |

Notes:
- Price is in the copy of only 2 ads ("For just $99"). Most ads do **not** state a price, but **every ad lands on a pricing page**. The price is one click from the ad.
- Video and DCO creative cover AI Twin, listing posts and similar. Thumbnails were not reviewed (unverified).

**Top REC hooks (verbatim)**
1. "Say goodbye to expensive social media managers." — 552 days
2. "Join thousands of agents using AI to put social media on autopilot🚀" — 485 days (and 70+ copies)
3. "For just $99, you'll get: 🤖 AI-powered posting across Facebook, Instagram, X, and LinkedIn." — 481 days
4. "Last year I sold 20 properties like this one, this one, and this one." — video, 483 days
5. "I used to run expensive billboard ads and cold call people to get leads." — video, 465 days
6. "Imagine setting up your entire month of social media in 15 minutes." — inside the $99 ad, 481 days
7. "Start saving time with AI, for less than a cup of coffee a day" — link description, 552 days

---

## 2. Landing layer

### 2.1 VideoTour `/real-estate-video-tour` (94 ads)

URL: https://videotour.ai/real-estate-video-tour. It is a Next.js page.

| Order | Block | Copy / detail |
|---|---|---|
| 1 | Nav | Feature menu with 11 feature pages. CTA "Try for Free / Generate your first video for free" |
| 2 | **H1** | "Turn Listing Photos into Stunning Video Tours in Just Minutes" |
| 3 | Subhead | "No filming. No editing. No hassle." Ticks: "Use existing photos · Ready in minutes · Unlimited revisions · Custom branding" |
| 4 | **Primary CTA** | "⚡ Generate Your First Video for Free" + "No credit card required" + "+2M views on our real estate videos !" |
| 5 | Benefit trio | Save time / Boost reputation / "Videos proven to sell homes 2x quicker." |
| 6 | Proof | "Trusted by 10,000+ Real Estate Professionals 🏆". Five first-name testimonials (Michael, Chris, Sarah, Jessica, James) |
| 7 | Demo | "From 60 Static Photos to an Outstanding Video in One Click". Before/after sliders |
| 8 | Comparison | "Pro Video Quality. No Crew. No Big Bill." DIY ❌ vs VideoTour ✅ |
| 9 | How it works | 3 steps: "Add up to 60 photos. Paste a Zillow link…", "Wait a few minutes", "Impress and Sell". CTA repeated |
| 10 | Stats | "410% More Inquiries", "75% Buyers Decide Faster", "2x Faster Sales". No sources |
| 11 | Social | "Seen by 20M+ on Social". Links to IG, TikTok, YouTube |
| 12 | Price math | "90% Cost Reduction… $300–$750 a listing… for $2.90 a video on the annual plan." Footnote: "*Independent plan billed annually; $3.90 on monthly billing." |
| 13 | Feature tabs | Walkthroughs, Reels, Voice+Avatar, 3D captions, Lifestyle, Transitions, Staging, Drone, Logo |
| 14 | Trust/tech | "Cinematic Spatial Reconstruction™ — AI moves the camera. AI never touches the room." "100% MLS Compliant" |
| 15 | FAQ | 10 Qs, including "Can I try videotour.ai for free? … one video at no cost" |
| 16 | Final CTA | "Create My First Free Video →". Trust row: "100% MLS Compliant · No Credit Card · First Video Free · Cancel Anytime" |
| Footer | | Free tools (8), "Affiliate Program: Earn 20%" |

**Primary CTA and what happens next:**
1. `/create` opens a 3-step builder: choose industry, add photos (60 max), video settings. The visitor **starts building before any account wall**.
2. The help center ([create account](https://videotour.ai/help-center/articles/create-account-and-sign-in)) then has the user enter name, contact details, email and password, plus a "how did you hear" field.
3. The user confirms the email, then gets 1 video + 50 AI credits, once ([free account](https://videotour.ai/help-center/articles/free-account)).
4. Terms show phone numbers are collected for automated SMS ([terms](https://videotour.ai/terms-of-service)).
5. The video is delivered "via email in minutes". Email is a re-engagement touch.

**Message match: strong.** Ad "Try it for Free with your Photos" → H1 about photos → CTA "Generate Your First Video for Free / No credit card required". Feature ads land on matching feature pages:

| Feature page | H1 | Below fold |
|---|---|---|
| [avatar](https://videotour.ai/ai-avatar-real-estate-video) | "Show up in every listing video without filming" | Each feature page repeats "First video free · No credit card", "★★★★★ 4.8/5 · Used by 10,000+", a price block, 10–20 testimonials and an FAQ |
| [transitions](https://videotour.ai/ai-transition-videos-real-estate) | "Make your listing stand out on social with AI videos" | same |
| [3D text](https://videotour.ai/ai-3d-text-real-estate-photos) | "Make your listing stand out with 3D text animations" | same |
| [lifestyle](https://videotour.ai/ai-real-estate-lifestyle-videos) | "Turn listing photos into AI lifestyle videos" | same |
| [reel maker](https://videotour.ai/real-estate-reel-maker) | "Turn your listing photos into scroll-stopping AI Reels" | same |
| [advertorial](https://videotour.ai/how-agents-turn-listing-photos-into-video-tours) (180 d ad) | "Real Estate Agents Are Turning Listing Photos Into Cinematic Video Tours In About 2 Minutes" | Long-form objection handling: "But I'm Not Tech-Savvy…", "But Will AI Make The Property Look Fake?", "Do I Still Need A Videographer?", "Your $400,000 Seller Still Expects Serious Marketing", plus an "Honest Comparison" table |

Tracking on VideoTour, found in page HTML and JS bundles:
- **Meta Pixel** (`fbq('init'…)` with `track` events)
- **Google Ads** `AW-17483811887` with a `signup` conversion label
- **GA4** `G-TX8TGND15M`
- **Hotjar**
- **Tolt** affiliate script (`data-tolt`)
- Referrer classification for TikTok, Reddit and Pinterest

They optimise ads on sign-up events and run Google Ads too.

### 2.2 REC `/pricing-table/` (77 ads)

URL: https://www.realestatecontent.ai/pricing-table/. It is an Astro page.

| Order | Block | Copy / detail |
|---|---|---|
| 1 | Nav | Features mega-menu (8 features), "How to use it" (8 guides). **"Book call"** CTA in header (GoHighLevel/LeadConnector booking) |
| 2 | **H1** | "One plan, everything included, and you pick how you pay." |
| 3 | Subhead | "No tiers to decode and no add-ons to chase. Every agent gets the whole product from day one. The only choice is monthly or annual." "2,500+ agents are already posting with us every week." |
| 4 | **Pricing** | Monthly "$119 /month… Cancel any time, no contract." Annual "★ BEST VALUE · SAVE 30% $999 /year ~~$1,428~~… nearly four months free", with onboarding + weekly live training. CTAs "Get started" / "Get started and save $429" → `app.realestatecontent.ai/checkout` |
| 5 | Guarantee | "14-day money-back guarantee. If it is not for you, we refund you, no questions asked." |
| 6 | Included | Unlimited posts, image-to-video, templates, topic suggestions, listing-to-social, calendar, market reports, blog posts |
| 7 | Teams | "Request a quote" |
| 8 | More tools | AI assistant, branding, Canva integration, video scripts |
| 9 | Founder letter | "Give it a try for 14 days. If it does not save you time… I will personally issue a full refund. No questions asked." — Kyle Raineri, Co-founder |
| 10 | FAQ | "Is there really only one plan?", "Is there a contract?" ("cancel from your account in a couple of clicks, without a phone call"), "What happens if it is not for me?", "Do you charge extra…?" ("no credits to top up") |
| 11 | Reviews | Senja widget ("See what agents say after month one") |
| 12 | Email capture | "Get Free Weekly Tips". Plus a **sitewide popup** after 3 s or on exit intent, A/B tested, offering one of: "FREE Marketing Guide (valued at $197!)", "The Ultimate 2026 Guide to Getting Leads With Social Media", "Steal Our 30-Day Social Media Plan". All go to Klaviyo |

**What happens next:** Stripe checkout (live key in the app bundle). The checkout code has a `promo_code` field and a `free_trial` flag that defaults to false. No free trial is offered publicly. The 14-day refund is the risk reversal.

**Message match: mixed.**
- Ad title "The fastest growing social media tool for real estate" + "autopilot" → page H1 about "one plan". The promise is not repeated above the fold.
- **The price does not match.** The $99 ads land on a page showing **$119**. Every ad URL carries `code=FB1150`, but the static page HTML has no code handling, and its "Get started" links drop the code. Whether FB1150 discounts to $99 at checkout is **unverified** (inferred: $20 off).

The homepage is a different funnel: H1 "We make social media easy for real estate agents", primary CTA "Talk to a social media specialist" (book a call). It claims "2,500+ Active agents", "90% See results in 30 days", "4x More weekly posts", "10 hrs Saved per month". Tags: GTM-WZ85NRV, Klaviyo, LeadConnector, Senja. No Meta pixel is in the static HTML; it is likely loaded via GTM **(unverified)**.

---

## 3. Offer and pricing

| | VideoTour.ai | RealEstateContent.ai |
|---|---|---|
| Free entry | 1 video + 50 AI credits, once, after email confirmation. No card. No watermark | None. 14-day money-back instead |
| Plans | Independent / Agency / Enterprise: 10 / 40 / 200 videos per month, 1 / 2 / 5 users | One plan, unlimited. Teams on quote |
| **Real monthly price** | **$39 / $79 / $159** per the [help center plan table](https://videotour.ai/help-center/articles/manage-your-plan) and the page's JSON-LD | $119 |
| Advertised price | **$29 / $59 / $99**. The [pricing page](https://videotour.ai/pricing) loads with the **Annual (-30%) toggle pressed**. Help center: "Independent Annual displays the equivalent of $29 per month, but charges $348 for the year." | "$99" in 2 ads; $119 on page |
| Annual | $348 / $708 / $1,188, paid upfront | $999 (vs $1,428), rate locked, onboarding + training |
| Per-unit anchor | "$2.90 per video", "$0.49 per video" | "less than a cup of coffee a day" |
| Credits / upsells | AI credit packs: $5 / $9 / $29 / $99 (100–3,500 credits). Credits pay for avatar, lifestyle, 3D text, transitions and logo animation. Re-generations cost credits again. Credits never expire; unused videos don't roll over | None. "no credits to top up and no per-post fees" |
| Free-plan limits | Can't add or replace photos after creating the free tour. Deleting it doesn't restore the allowance | n/a |
| Refunds | "**Payments for subscriptions and credit packs are not refundable once made**, including for a completed video you are not satisfied with." Annual remainder not refunded ([terms](https://videotour.ai/terms-of-service)) | "14-day money-back guarantee" on the first term ([terms](https://www.realestatecontent.ai/terms/)) |
| Cancellation | Self-serve in My profile, effective at end of period. **No renewal-date field** in the profile | "cancel from your account in a couple of clicks, without a phone call" |
| Promos | Lifetime-discount sales (BF 40%, Spring 20%), 0–7 days each | FB1150 code on all ads; TRUST200 $200 off yearly (killed) |
| Referral | In-app "Invite & earn credits", plus a 20% affiliate program on Tolt | No affiliate program found |
| Checkout friction | Low to start (no card), but a sign-up form with phone and email confirmation | One click from ad to price, then a card. High intent required |

**The two models compared**
- **VideoTour = product-led.** The ad sells the outcome, the free video proves it, and the paywall hits at video #2, when the agent has the next listing. Weak point: a $29 "anchor" that is really an annual commitment, plus no refunds. That is exactly the billing-trap pattern agents complain about most (71 of 623 low-star reviews across 9 products, per [realtor-video-tools-reviews.md](../deep-dives/realtor-video-tools-reviews.md)).
- **REC = sales-led self-serve.** Price-first landing for people already sold on "I should post more". It reduces risk with a money-back guarantee and a founder promise instead of a trial. It catches non-buyers with lead magnets and a booked call. Evergreen ads mean CAC must be acceptable at $119+ (inferred from 552-day survival).

---

## 4. Other channels

| Channel | VideoTour.ai | RealEstateContent.ai |
|---|---|---|
| SEO / programmatic | [Sitemap](https://videotour.ai/sitemap.xml): 199 URLs. 15 feature/industry pages (incl. hotel, Airbnb, MLS, drone), 75 blog posts (broad: "video aspect ratios", "best voice cloning app"), **9 free tools** (hook generator, script generator, virtual staging, headshot generator…), 90 help articles. Updated daily (lastmod 4–9 Nov 2026). robots.txt explicitly allows GPTBot, ClaudeBot, PerplexityBot | [Sitemap](https://www.realestatecontent.ai/sitemap-0.xml): 305 URLs. **256 `/ai-blog/` posts** (generic, with duplicates such as "-2" / "-1" slugs), 8 feature pages, 8 how-to pages, about 10 long-form guides, and pages for "ChatGPT", "Grokbot", "Muse", "MCP" integrations. robots.txt allows AI bots |
| YouTube | [@VideoTourAI](https://www.youtube.com/@VideoTourAI): 867 subscribers, 24 videos. Recent views 173–3K | [@realestatecontentai](https://www.youtube.com/@realestatecontentai): 862 subscribers, 349 videos. Recent views **5–25**. Volume without reach |
| Affiliate / referral | "Affiliate Program: Earn 20%" ([portal](https://affiliates.videotour.ai/), terms not public) + in-app referral credits | None found |
| Partner / "realtor" pages | Earlier Ad Library check: 16 ads linking to videotour.ai from pages styled as realtors or reviewers ("Top AI Tools for Realtors", "Allison Carter, Realtor"…). Owner **unverified** ([real-estate-video-saas.md](../deep-dives/real-estate-video-saas.md)) | None seen |
| Brokerage partnerships | None public. Ads name-drop "REDFIN, Century 21", "RE/MAX, Keller Williams, and eXp" as users (unverified) | Teams/brokerage plan "Request a quote". No named partners |
| Email / lead magnets | No newsletter. Email and SMS captured at sign-up; video delivered by email | Klaviyo popup (3 s / exit intent, A/B), 3 lead magnets, weekly tips, booked call |
| Retargeting signals | Meta Pixel + Google Ads sign-up conversion + GA4 + Hotjar | GTM container (pixel likely inside, unverified) + Klaviyo |
| Reviews used | First-name quotes, "4.8/5", a /reviews page citing "Google review". No Trustpilot/G2 profile found | Senja widget, /testimonials page. G2: 0 reviews (per reviews deep-dive) |
| Social-proof counts | "10,000+", "+2M views", "Seen by 20M+ on Social" | "2,500+ agents", "thousands of agents", "fastest growing" |
| Traffic (Similarweb free page, **unverified**) | Oct 2026: "36K" (3-month total label), −16.8% MoM; desktop 41% direct, then organic, then **paid social**; US 61%, UK 7%, AU 4% ([source](https://www.similarweb.com/website/videotour.ai/)) | Oct 2026: "13.6K", **−63.6% MoM**; desktop 51% direct, then referrals, then display ([source](https://www.similarweb.com/website/realestatecontent.ai/)) |

Both sites are small. Paid Meta is the engine for both. VideoTour adds SEO tools and affiliates. REC adds email.

---

## 5. Where they convert: the mechanisms

| # | Mechanism | Who | Evidence |
|---|---|---|---|
| 1 | **Free first video, no card, using your own listing** | VideoTour | Every surviving VideoTour ad ends on it. LP repeats "No credit card required" 4×. The 479-day ad's title is "Try it for Free with your Photos 👉". Sign-up is the Google Ads conversion event |
| 2 | **Show the output, not the argument** | VideoTour | The plain mechanism cluster has a 137-day median (17 ads past 90 days). The long seller-argument batch died at about 27 days. Before/after feature ads survive 190–266 days |
| 3 | **One landing page per feature, with matching hook** | VideoTour | 6 feature URLs in ads; avatar ad → "Show up in every listing video without filming". Each page carries its own FAQ, testimonials and price block. They double as SEO pages |
| 4 | **Paste a listing URL (Zillow / Realtor.ca / Rightmove)** | VideoTour | It removes the upload step. Geo ads survive (Realtor.ca: 243 days). Import supports 9 portals ([help](https://videotour.ai/help-center/articles/create-your-first-video)) |
| 5 | **Price on the click, plus a strong risk reversal** | REC | 77 of 80 ads go to the pricing page. One plan, no tiers. 14-day money-back plus a signed founder letter. Evergreen ads (69 past 90 days) imply this converts at acceptable CAC |
| 6 | **UGC "agent who sold 20 homes" testimonial selling an outcome (listings), not a tool** | REC | Both transcribed videos, 465 and 483 days. The hook is a result ("sold 20 properties"), not a feature |
| 7 | **Low per-unit anchors and "replace the videographer" math** | Both | "$2.90 per video" / "under five dollars" vs "$300–$750 a listing". REC: "Say goodbye to expensive social media managers" (552 days, the oldest ad in the set) |
| (+) | Fast test-and-kill plus geo variants (VideoTour); capture of non-buyers via popup and booked call (REC) | | 42 new VideoTour ads in 60 days; REC Klaviyo popup A/B |

---

## 6. Where they are weak

**Trust gaps (billing)**
- VideoTour's pricing page loads on the annual toggle showing $29, but monthly is $39. The help center admits "Independent Annual displays the equivalent of $29 per month, but charges $348 for the year."
- VideoTour does not refund ("not refundable once made"). It auto-renews, and the profile shows no renewal date.
- VideoTour's ads quote inconsistent prices ($39, $79, $2.90, $0.50, "$209/year (normally $368)" — but annual Independent is $348).
- This is the #1 category complaint, waiting to happen to them.
- REC: the ad says "$99", the page says "$119". If the code doesn't apply, that is a bait-and-switch feeling at checkout (unverified).

**Quality and "fake" gaps**
- VideoTour's LP promises "AI never touches the room… 100% MLS Compliant". Yet it sells AI lifestyle people, virtual staging, "Helicopter Reveal", and "drone" shots.
- Its own help pages say "That can produce an extra door, furniture, a changed window" and that drone-style output "should not be presented as authentic drone footage". It also notes "A watermark-free export is not automatically an MLS-compliant video."
- Compliance is pushed onto the agent. There is no auto disclosure label and no originals-side-by-side output. Compare California's AB 723 and the MLS fines in the [background research](../deep-dives/real-estate-video-saas.md).

**Proof gaps**
- Stats are unsourced and drift between ads and pages ("403%" vs "410% more inquiries", "73% of homeowners" vs "73% of vendors", "31% faster for $8,200 more").
- Testimonials are first-name only. There is no third-party review profile for either company.
- REC's "fastest growing" and "90% See results in 30 days" have no definition.

**No results measurement**
- Neither company tracks views, leads or showings per listing video or post.
- VideoTour testimonials claim "reach went up 182%". The product doesn't show it.
- Reviews across the category say nobody measures results.

**Message gaps**
- VideoTour sells "video" and "time saved". It rarely sells winning the listing; that angle was tested in Jan 2026 with long copy and killed. It may be the copy, not the angle.
- Its FAQ pitches hotels, museums and store owners on a realtor landing page.
- REC's ad copy is one line on 73 ads. Creative fatigue risk.

**Free-trial mechanics**
- VideoTour's free tour can't be fixed by adding or replacing photos. One bad AI render on the free video can lose the user.
- Re-generations burn credits.

**Channels they under-use**
- Neither runs brokerage or team partnerships publicly. Neither has a seller-facing asset (a listing page the seller sees).
- REC's YouTube gets almost no views. Neither does Google search ads at visible scale (VideoTour has a Google Ads tag, so it may).
- Neither offers pay-per-listing.

**Seasonality**
- Nov–Feb is slow for listings. VideoTour fills it with Black Friday "40% off for life", which trains discount-waiting and locks in low lifetime prices.

---

## 7. Recommendations for our funnel

**Ad angles to test first (in this order)**
1. **Output-first mechanism ad (copy VideoTour's winner).** 15–30 s screen recording: paste a Zillow link → finished video. Hook: "Paste your listing link. Get the video before the photographer's invoice." End on the free offer.
2. **"No fake rooms" trust angle (their gap).** "Your sellers' house, not an AI's guess. Every frame from real photos, AI edits labelled, originals side by side." Aim it at Reddit's "fake" fear and MLS fines.
3. **Honest-billing angle (their gap).** "Pay per listing. No annual trap. Cancel in one click. Refund if the video's wrong." Run it against VideoTour's Black Friday push (from about 24 Nov).
4. **UGC result testimonial (copy REC's winner).** A real agent: "This listing got X showings in the first weekend." Only with real, consented numbers.
5. **Win-the-listing angle, short version.** "Show the seller their video at the listing appointment." VideoTour killed only a long-copy version. Test a short demo-led one.
6. Geo variants (CA/UK/AU portal names) once the US ad works.

**Landing page structure**
1. H1 that repeats the ad hook. One CTA: "Paste your listing link — free video". No card.
2. Paste-URL box **above the fold**, so the page is the product.
3. Before/after with "nothing invented" overlay, plus the original photo next to each enhanced clip.
4. Proof with real attribution: full names, brokerage, city, link to a third-party review profile (start a Trustpilot/G2 profile on day 1). Every statistic gets a source or gets cut.
5. Results block: "Every video ships with a tracked link: views, watch time, leads." (Nobody has this.)
6. Pricing in plain monthly numbers, monthly toggle as default, with the renewal date shown in the app.
7. FAQ: disclosure/MLS, refunds, cancellation, what happens after the free video.
8. One page per use case (Reels, avatar, twilight, staging) only once each has an ad pointing to it.

**Offer mechanics**
- **Free first listing video, no card**, with "fix it free": unlimited re-renders on the free video, including adding or swapping photos. This beats VideoTour's locked free tour.
- **Pay-per-listing** (e.g. a listing pack with all formats), plus a monthly plan for volume agents and teams. Per-listing pricing matches listing-driven, seasonal demand (background research suggests about $49–149 per listing for a full kit; test lower for the video alone).
- **Risk reversal like REC**: a 14-day or "first paid listing" money-back guarantee, written by a founder.
- **Billing honesty as a feature**: monthly default, renewal reminder email, one-click cancel, no charge for failed or inaccurate renders.
- **Built-in compliance**: auto "AI-enhanced / virtually staged" label, originals link, MLS-unbranded export that also strips spoken contact details.
- **Lead capture for non-starters**: exit-intent offer (REC-style) such as "listing launch checklist + 5 hooks", into email. Add a booked demo for teams and brokerages.
- **Referral credits + affiliate** (VideoTour has 20%). Add brokerage and team plans as the B2B channel neither competitor runs publicly.

**What NOT to copy**
- Annual-default price display, $29 "per month" that is really $348 upfront, and a no-refund policy.
- "Lifetime" discount sales that teach agents to wait for Black Friday.
- Unsourced statistics and first-name-only testimonials.
- Claims like "100% MLS Compliant" / "AI never touches the room" sitting next to features that add people and furniture.
- Realtor-styled pages running ads for the product (owner unverified for VideoTour; reputational and policy risk).
- REC's ad-to-page price mismatch ($99 vs $119), and blog or YouTube volume with no reach (256 generic posts; videos with 5–25 views).
- Positioning for hotels, museums and shops on a realtor page. Stay single-niche.

---

## Open items (unverified)
- Whether REC code FB1150 discounts to $99 at checkout. Confirming it needs a checkout session; not done by policy.
- REC video/DCO creative visuals. Only 2 transcripts were available; thumbnails were not reviewed.
- VideoTour affiliate terms (the portal is JS-only).
- Similarweb numbers (free-page snippets).
- Who runs the realtor-styled pages advertising VideoTour.
- Whether VideoTour's "10,000+", "+2M views" and "20M+" are real counts.
