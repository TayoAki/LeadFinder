# Real-estate AI video/content/ads SaaS ("Keepwatch for agents"): Gate 0

Date: 2026-11-10. Method: [METHOD.md](../github-repo-offers/METHOD.md) (Gate 0), adapted for software.
Builds on: [real-estate-ai-agents-brokerages.md](real-estate-ai-agents-brokerages.md). That run found agents pay for video, content and ads, not for "AI".
The idea: listing photos in; listing videos, reels, market updates and Meta ad variants out, modeled on what top local agents already run. Keepwatch already does ad tracking, winner detection, brand remakes, a simulated buyer panel and 9:16 shot-for-shot video (Seedance + ffmpeg captions + end cards).

## Verdict: 🟡 Narrow build only. ❌ for a general "AI video SaaS for agents".

- **Photo-to-video is crowded and cheap.** At least 8 SaaS tools sell it for $19 to $99 a month. Unit prices run from about $0.49 to $18 a video. At least 8 new App Store apps launched in 2026 with 1 to 4 ratings each.
- **Big brokerages and CRMs now give it away.** KW Command auto-generates listing videos for 150,000+ agents. Lofty includes 3 AI listing videos a month with its Social Agent. Compass has had Video Studio since 2021. RE/MAX has Hustle video templates. eXp agents report "just the free Canva subscription".
- **Generative video carries a trust problem in this market.** On r/realtors, an AI listing-video post from yesterday got mostly ridicule. Commenters pointed to "a non-existent 2nd refrigerator and an extra wall" and kids who "spawn from thin air". Another said an agent "can be sued and/or censured for knowingly communicating false information".
- **The open gap is ads, not video.** No self-serve tool combines (1) what local winners run, (2) creative for listing and seller ads, and (3) the compliance checks agents can't do themselves: brokerage name, Housing Special Ad Category, AB 723 disclosure and no invented features. That gap matches what Keepwatch already does.
- **Deciding reason:** SaaS demand for generic video is real but already met at $29 a month or for free. Demand for paid ads is real ($500 to $2,000 a month in spend and service fees). But no self-serve product exists for it yet, so a 30-day paid pilot must prove the demand before a full build.

## Sources and sample sizes

- **Live pricing pages** fetched today: AutoReel, VideoTour.ai, RealEstateContent.ai, Coffee & Contracts, Keeping Current Matters, Rejig, ListingAI, BoxBrownie, HeyGen, Synthesia, Revid, Pictory, OpusClip. Canva returned 403, so its price is not verified.
- **Reddit:** `crawl4ai.reddit.search.posts` ran 12 searches in r/realtors over the past year, about 190 posts. `crawl4ai.reddit.post.comments` read 7 threads (about 140 comments).
- **Meta Ad Library:** `scrapecreators` keyword search ran 7 queries (US, active), returning 208 ads. These were grouped by advertiser.
- **App Store:** `crawl4ai.app-store.search.apps` ran 5 queries.
- **Video generation prices** come from the treg catalog (aggregator prices, today).
- **treg spend this run: $0.028.** That is the sum of `charged_micro` on my 31 calls. The team balance went from $8.35 to $8.18, but other sessions share that balance, so not all of the drop is mine.

## 1. Competitor map

Prices were verified live on 2026-11-10 unless marked otherwise.

| Name | What it makes | Price | Users / reviews (public) | Funding | What it does NOT do |
|---|---|---|---|---|---|
| [AutoReel](https://www.autoreelapp.com/pricing) | Photo-to-video reels, staging, photo edits | Free tier; $30–41/mo (20 videos/yr) to $82–108/mo (100/yr); $10–25 per video; seat limits of 4, 6 and 10 | Claims "85,000+ real estate professionals" and Trustpilot 4.9 from 380+ reviews ([reviews page](https://www.autoreelapp.com/reviews)). [G2](https://www.g2.com/products/autoreel/reviews) has 1 review | None found ([press](https://www.barchart.com/story/news/32618477/autoreel-is-leading-the-ai-video-boom-in-real-estate-and-its-just-getting-started); founder is ex-Facebook/Snap) | No brand kit described, no ads, no MLS link, no compliance tooling |
| [VideoTour.ai](https://videotour.ai/pricing) | Photo-to-video, captions, logo intro, avatar and voice add-ons | Free (1 video); $29 (10/mo), $59 (40/mo), $99 (200/mo, $0.49 per video) | Not public | Not found | No ads; 720p/1080p; voice and avatar sold as credits |
| [RealEstateContent.ai](https://www.realestatecontent.ai/pricing) | Social autopilot: posts, image-to-video, "AI Twin", market report posts | $119/mo or $999/yr; teams on quote | Claims "2,500+ agents posting weekly" | Not found | No paid ads |
| [Coffee & Contracts](https://coffeecontracts.com/join/) | 1,000+ Canva templates, monthly listing reel, "Beans" AI strategist, lead pages | $74/mo until Nov 24; then $99, $139 and $199 | 6,400+ agents ([relaunch, Nov 5](https://nowbam.com/coffee-contracts-adds-ai-landing-pages-and-lead-capture-in-major-relaunch/)) | Bootstrapped (a [Starter Story](https://www.starterstory.com/stories/i-created-a-1m-year-subscription-based-toolkit-for-real-estate-professionals) piece says $1M/yr; not verified) | No real video generation; no ads |
| [Keeping Current Matters](https://www.keepingcurrentmatters.com/pricing/) | Market-update content, "RealTalk" video scripts + teleprompter | $59.95/mo or $99.95/mo (annual $49.95 / $83.29) | Claims 20,000+ agents | Not found | The agent must film; no listing video; no ads |
| [Rejig](https://rejig.ai/) | Auto posts when a listing hits the MLS, AI walkthrough video, monthly market reports, scheduler | $100/mo or $150/mo + $250 setup; voice clone and avatar are add-ons | KW-specific offer; brokerage logos shown | Not found | No paid ads |
| [ListingAI](https://www.listingai.co/pricing) | Descriptions, unlimited motion videos, "cinematic AI scenes" | Free; $19, $36, $150/mo | Not public | Not found | No ads |
| [Lofty Social Agent](https://help.lofty.com/hc/en-us/articles/53135211487387) | 3 AI listing videos/mo from MLS photos; 15-second auto video | Add-on; price not public ([Lofty pricing](https://lofty.com/pricing) is "request pricing") | Lofty CRM customers | Lofty is VC-backed (amount not checked) | Ads only through its managed service (20% fee, per the earlier run) |
| [KW Command](https://www.housingwire.com/winner-profile/2026-tech-trendsetter-chris-cox/) | "Automatically generated listing videos", AI ad copy | Free to KW agents (inside the split) | 150,000+ agents | Brokerage | Generic; no model of what local winners run |
| [Compass Video Studio](https://investors.compass.com/news/news-details/2021/Compass-Launches-AI-Powered-Video-Studio/default.aspx) | Template listing videos by address; push to Compass digital ads | Free to Compass agents (not verified for 2026) | Compass agents | Brokerage | Template-based |
| RE/MAX MAX/Tech + Hustle ([RISMedia](https://www.rismedia.com/2025/08/26/re-max-launches-new-marketing-platform-to-network-of-145000-agents/)) | BoldTrail CRM, video templates, Realforce "Marketing as a Service" | Included for affiliates (not verified) | About 145,000 agents | Brokerage | Template-based |
| eXp + Canva ([third-party](https://buildingbetteragents.com/canva-at-exp-realty-explained/)) | Canva Pro and an eXp listings app inside Canva | Free to agents (third-party claim, not verified) | eXp agents | Brokerage | Manual design; "basic" video |
| [Rechat / Lucy](https://www.housingwire.com/articles/rechat-launches-lucy-an-ai-agent-assistant/) | AI Marketing Center: social, email, listing sites | Sold to brokerages by demo; no list price | Brokerage seats | Not checked | Not a video generator |
| [Luxury Presence](https://www.businesswire.com/news/home/20260527265173/en/) | Websites, CRM, "Autonomous AI Marketing Team" (SEO, paid ads) | Not public | $100M ARR (May 2026) | $37M round in Jan 2026 ($22M Series C + $15M debt) ([Built In](https://builtin.com/articles/luxury-presence-37m-series-c-20260114)) | Premium, top-agent focus; not a creative tool |
| [HeyGen](https://www.heygen.com/pricing) | Avatars, voice clones | Free; $29; $49; $149 + $20 per seat | Not RE-specific | VC-backed | No listing logic, no RE compliance |
| [Synthesia](https://www.synthesia.io/pricing) | Avatars | $19 or $89/mo (yearly $14 / $59) | Not RE-specific | VC-backed | Same as HeyGen |
| [Revid](https://www.revid.ai/pricing) | Generic AI short video | $39–199/mo | Trustpilot about 4.0 from about 301 reviews; complaints that credits burn on failed renders and refunds are refused ([Trustpilot](https://www.trustpilot.com/review/revid.ai?page=4)) | Not checked | Not RE-specific |
| [Pictory](https://pictory.ai/pricing) / [OpusClip](https://www.opus.pro/pricing) | Text-to-video / clip repurposing | Pictory $29–199; Opus $15–29 | General | VC-backed | Not RE-specific |
| CapCut / Canva templates | DIY editing and templates | CapCut Pro and Canva Pro prices not verified (Canva page 403) | Agents on Reddit: "I literally just use my iPhone and CapCut" | n/a | Manual |
| [Zillow Showcase](https://www.zillow.com/news/zillow-showcase-spring-update-new-agent-features/) | Premium listing display, 3D tour, AI virtual staging | About $400/mo + per-listing fees ([third-party](https://sofabrain.com/learn/zillow-showcase-cost), not verified) | Zillow agents | Public company | Media production is the agent's cost |
| [BoxBrownie](https://www.boxbrownie.com/pricing) | Human-QA'd staging and edits | Staging $30/image; no video product on the pricing page | n/a | n/a | No video |
| Localsocialpro (Meta ad) | "30 branded AI videos and reels" + website | $49/mo (ad copy, not verified) | n/a | n/a | n/a |
| CloudPano / PhotoAIVideo (Meta ads) | AI photo-to-video **sold to photographers** to resell ("Add $200+ profit per listing") | Not verified | n/a | n/a | Not sold to agents directly |

**What agents already get free or bundled:** listing videos in KW Command, Compass Video Studio, Lofty (3 a month with Social Agent), RE/MAX Hustle templates, and Canva at eXp. AI copy is in every major CRM. In NAR's 2025 survey, 67% of agents said their brokerage gives them all the tech they need (via [search result](https://www.nar.realtor/newsroom/realtors-adopt-technology-to-save-time-and-improve-the-client-experience-nar-report-finds); not re-verified for 2026). A Reddit eXp agent said: "it's definitely just the free Canva subscription" ([thread](https://www.reddit.com/r/realtors/comments/1p8tsrm/is_your_brokerage_actually_helping_you_with/)). Others say brokerage support is "a folder of Canva templates". So templates are free. **Done output is not.**

**Crowded vs open:**

| Area | Status |
|---|---|
| Photo-to-listing video | **Crowded.** 8+ SaaS at $19–99, free in brokerages, 8+ new 2026 apps ([Editora](https://apps.apple.com/us/app/editora-real-estate-video-ai/id6737219863), [ListingWiz](https://apps.apple.com/us/app/listingwiz-real-estate-reels/id6757203233), [ReelEstate](https://apps.apple.com/us/app/reelestate-reels-meet-homes/id6749325123), Haus, AgntFlow, Reptov, EstateCam, DroneEstate, each with 1–4 ratings). The incumbent app [Momenzo](https://apps.apple.com/us/app/momenzo-real-estate-videos/id1465399598) has 1,448 ratings since 2019 |
| Social content subscription | **Crowded.** Coffee & Contracts (6,400+), KCM (20,000+), RealEstateContent.ai (2,500+), Rejig, Localsocialpro |
| Market-update video | **Crowded for scripts** (KCM, Rejig reports). Automated video from local MLS data is thinner, but it needs MLS/IDX data licences |
| Avatars | **Generic tools** (HeyGen, Synthesia) plus add-ons in VideoTour, Rejig and RealEstateContent.ai |
| Listing and seller **ad creative**, modeled on local winners, with compliance checks | **Open for self-serve.** Today it is sold as managed services: Home ASAP $99.98/mo ([page](https://about.homeasap.com/lead-generation/advantage-ads/)), ReminderMedia from $499.99/mo (search snippet), Curaytor $1,300/mo, Lofty's 20% fee. No creative tool found that reads the local Ad Library |

## 2. Demand for software, not done-for-you

**Signals that agents pay for software:**
- AutoReel claims 85,000+ users and 380+ Trustpilot reviews. Coffee & Contracts has 6,400+ paying agents, KCM 20,000+ and RealEstateContent.ai 2,500+ (all self-reported).
- NAR 2026 Technology Report ([NAR](https://www.nar.realtor/news/real-estate-news/technology/the-tech-real-estate-agents-rely-on-most-in-2026), Sep 22, n≈1,200): 56% of AI-using agents use it for social posts. 48% use drone photo/video. Monthly tech spend: 18% under $50, about half $50–500, 22% over $500.
- Paid acquisition is heavy, so the vendors expect payback. In 7 Ad Library searches, VideoTour.ai ran **21 unique active ads** under its own page (the earliest from Jul 2025). Another **16 ads** linked to videotour.ai from pages styled as realtors or reviewers ("Top AI Tools for Realtors": 8; "Allison Carter, Realtor": 4; "Sarah Taylor, Realtor": 3; "Alexander Montclair, Realtor": 1). Who runs those pages is not verified. RealEstateContent.ai had 6 ads, CloudPano 7, KCM 4, and AutoReel, Coffee & Contracts and Localsocialpro 1 each.

**Signals of weak or fragile demand:**
- Reviews are thin outside Trustpilot. AutoReel has 1 G2 review on an unclaimed profile. Tour Estate AI has 0 on [Capterra](https://www.capterra.com/p/10040933/Tour-Estate-AI/). No VideoTour.ai review pages were found.
- Searches for "AutoReel", "HeyGen" and "reels app" in r/realtors over the past year returned **0 posts**. "VideoTour" returned 3 and "Coffee and Contracts" 2. Agents don't discuss these tools much. Vendors do the posting, and mods remove them under Rule #1.
- Agents doubt video works by itself: "Nobody buys houses on social media… It's supplemental" ([thread](https://www.reddit.com/r/realtors/comments/1sy4h8o/is_posting_listing_flyers_and_videos_on_social/)). "A slow room-by-room video with music is often just a worse version of the photo gallery" ([thread](https://www.reddit.com/r/realtors/comments/1rxqhu8/are_real_estate_walkthrough_videos_actually_worth/)). Another: "my broker keeps pushing everyone to post a video for every listing and i'm skeptical. hired a videographer twice at $400 a pop" ([thread](https://www.reddit.com/r/realtors/comments/1xsghua/do_listing_videos_actually_get_you_more_showings/)).
- The agents who post well do it themselves or hire a human. "I literally just use my iPhone and CapCut." One agent who sells 50 homes a year edits their own content "until i can afford to hire a video editor". Another has a full-time VA in the Philippines.
- On price, when an AI-video seller asked for business, an agent answered "If you venmo me $10 per listing you can do this to my listings" ([thread](https://www.reddit.com/r/realtors/comments/1xs2up1/i_turn_real_estate_listing_photos_into_short/), Nov 9).

**Churn:** No public churn figure exists for agent content tools. Proxies:
- General SMB SaaS benchmarks put monthly churn at 3–7% ([Vena via Orb](https://www.withorb.com/blog/saas-churn-statistics)), about 6.2% in 2026 ([Visionary cohort study](https://visionary-marketing.co.uk/blog/saas-churn-benchmarks-2026)) and 6.4% ([Focus Digital](https://focus-digital.co/?p=6073)). These are secondary sources, not verified at the primary.
- A PropTech blog estimates 3–5% a month for agent-facing tools ([Qubit](https://qubit.capital/blog/proptech-saas-kpi-benchmarks), not verified).
- Structural churn drivers are visible. Credit packs and rollover rules (AutoReel credits roll over 1 year; VideoTour videos don't roll over) suggest bursty, listing-driven use. Annual discounts of 28–31% (AutoReel), 30% (VideoTour, RealEstateContent.ai) and "2 free months" (Coffee & Contracts) all push buyers to prepay. Agents also rely on brokerage tools and switch brokerages often (144,000 moves in 12 months, per [Inman](https://inman.com/2024/08/05/agent-churn-at-10-in-past-year-as-industry-sees-144k-moves)).
- **Assumption for the math below: 6–10% monthly churn for solo agents, 3–5% for teams.** Not verified.

## 3. Willingness to pay by segment

| Segment | Evidence | Fits |
|---|---|---|
| Solo agent (most agents) | 18% spend under $50/mo on all tech, and half spend $50–500. Free brokerage tools. "$10 per listing" | $19–49/mo self-serve. Already served by VideoTour, AutoReel, ListingAI and brokerage tools. **Don't target** |
| Producing agent / listing-heavy (22% spend $500+) | Pays $74–199 (Coffee & Contracts), $100–150 (Rejig), $400 videographers, $500+/mo in ad spend ([earlier run](real-estate-ai-agents-brokerages.md)) | $99–149/mo or per listing |
| Teams (5–30 agents) | Hire content creators and videographers (LinkedIn roles in the earlier run). Pay $1,000–2,000/mo for managed ads. Upwork: about 40 video asks and 14 ads asks | **$149–399/mo team plan + per-listing overage**; done-for-you upsell |
| Real-estate photographers / media companies | AutoReel's testimonials are mostly photographers and media firms. CloudPano advertises "Add $200+ profit per listing" to photo pros. Photographers own the photo copyright | Wholesale per video or listing. **Strong channel**, but they don't buy ads |
| Brokerages | Already bundle video (KW, Compass, RE/MAX, Lofty). Rechat sells by demo. Long cycles | White-label later. **Don't lead** |

**SaaS vs pay-per-use vs seats:**
- $29–99/mo SaaS works only for high-volume, low-touch photo-to-video, and that is taken.
- About $49–149 per listing pay-per-use fits listing-driven, seasonal demand (VideoTour's $0.49 vs AutoReel's $10–25 shows the price spread; agents paid $400 for a videographer).
- Brokerage seats need a sales team and compete with free tools.

## 4. The gap: which candidate has evidence

| Candidate | Evidence for | Evidence against | Call |
|---|---|---|---|
| (a) Model what's already working: remake top local agents' best ads and reels | Keepwatch does this today. Coffee & Contracts just added "shows what's performing" (own account only). A commenter who tracks "tens of thousands of real estate social media accounts" says videos that pop "have a viral element" | No buyer asks this by name. Copying another agent's video raises copyright/ToS risk, so copy the structure, not the footage | **Use as the engine, not the pitch** |
| (b) Listing photo-to-video with brand kit + MLS-compliant captions | Strongest raw demand (about 40 Upwork asks; 85,000 users claimed by AutoReel) | The most crowded and commoditized area; free in brokerages; AI artifact backlash | **Table stakes only** |
| (c) Market-update videos from MLS/zip data | KCM 20,000+ agents; Reddit agents credit weekly zip data and "hyper local news" green-screen videos | KCM and Rejig already exist; MLS data licensing; the agent's face sells it, not AI | **Later** |
| (d) Seller-lead Meta ads with Special Ad Category compliance built in | Money is proven: $500/wk LSA, $1,000–2,000/mo services; vendor-reported seller CPLs of $8–25 ([Luxury Presence case](https://www.luxurypresence.com/case-studies/seller-leads-at-24-50-cpl-in-san-francisco), vendor-reported). Housing SAC rules (no age/gender/zip targeting, no lookalikes in the US; 15-mile radius per agency blogs, not verified at Meta) make **creative** the main lever left | Upwork asks under 20 (earlier run); seller-lead quality complaints | **Best wedge, with (a) as engine** |
| (e) Brokerage white-label | Brokerages buy (Rechat, Rejig KW offer) | They already have free video; enterprise sales cycles | **No for now** |

**The gap worth building:** a "Listing & Seller Ad Kit" for teams. Per listing it produces 2–3 vertical videos plus 6–10 Meta ad variants, built on the hooks and structures of long-running local listing and seller ads from the Ad Library. A compliance pass checks the brokerage name on the first frame and in the caption, Housing SAC campaign setup, an AB 723 "enhanced" label with a link to the originals where relevant, and a "truthful motion" mode with no invented objects. A buyer-panel score picks the 3 ads to launch.

## 5. Risks

| Risk | Evidence | Mitigation |
|---|---|---|
| AI-video quality backlash | Ridicule of hallucinated fridge, walls and kids ([thread](https://www.reddit.com/r/realtors/comments/1xs2up1/i_turn_real_estate_listing_photos_into_short/)); "catfishing the listing" ([thread](https://www.reddit.com/r/realtors/comments/1skfv6c/ai_edited_listing_photos_are_becoming_a_trust/)); Upwork "no AI edits" (earlier run). Revid users complain credits burn on failed renders | Default to non-generative motion (pan/zoom/parallax via ffmpeg) on real photos. Use generative only for short hero clips. Run automatic frame diff + human QA. Never add objects |
| Photo copyright/licensing | Photographers usually license photos for marketing the active listing only; VHT v. Zillow ([CRMLS](https://blog.crmls.org/updates/what-photography-lawsuits-can-teach-listing-brokers-about-copyright-in-the-mls/), [NAR](https://www.nar.realtor/law-and-ethics/who-owns-your-property-photos)) | Only process the customer's own listings. Require an upload-time attestation. Never ingest other agents' photos or footage, and copy structure only. Photographer channel solves ownership |
| Fair housing / Meta Housing SAC | Category declaration required ([Meta docs](https://developers.facebook.com/documentation/ads-commerce/marketing-api/audiences/special-ad-category)); targeting limits | Make SAC a hard-coded campaign default. Copy linter for steering language ("perfect for young families", "safe neighbourhood") |
| Brokerage-name advertising rules | State rules: name required in video/social, sometimes more prominent than the agent's ([Nebraska](https://www.nrec.nebraska.gov/pdf/Social%20Media%20Compliance2021.pdf), [TREC](https://www.trec.texas.gov/sites/default/files/pdf-forms/Social%20Media%20and%20Advertising.pdf), [Rhode Island](https://www.rirealtors.org/social-media-advertising)) | Brand kit requires the brokerage name and logo; checked on the end card and first frame |
| Avatars / voice likeness | Avatars and voice clones are add-ons everywhere (HeyGen, Rejig, VideoTour) | Leave avatars out of the MVP. If added later, get recorded consent from the agent only |
| AB 723 (CA) and MLS edit rules | Original photo must sit next to the enhanced one ([The Real Deal](https://therealdeal.com/san-francisco/2026/01/26/ab-723-takes-effect-cracking-down-on-fake-listing-photos)); MLS takedowns in the Reddit thread | Auto disclosure overlay + originals link |
| Seasonality | Nov–Feb slow; listing volume picks up from about Feb | Sell seller-lead creative now (spring sellers decide Jan–Mar); per-listing pricing absorbs slow months |
| Price race to $29 | VideoTour $0.49/video at $99/mo; ListingAI unlimited motion video at $19 | Don't sell video. Sell ad kits plus compliance; price by listing or team |
| Brokerages bundle more | KW opened Command to third-party apps (Feb 2026) | Also a channel: list on KW MarketPlace later |

## 6. Business-model math

**Compute cost per video.** Treg catalog aggregator prices on 2026-11-10:

| Model | $/second |
|---|---|
| Seedance 1 Lite (480p–1080p) | $0.018–0.072 |
| Seedance 2.5 | $0.103–0.462 (by provider) |
| Kling 3.0 Std | $0.084–0.126 |

| Video | Generative seconds | Lite cost | Seedance 2.5 / Kling cost | With 1.5x retries |
|---|---|---|---|---|
| 30s fully generative reel | 30 | $0.54–2.16 | $2.52–6.93 | $0.81–10.40 |
| 30s "truthful motion" reel (ffmpeg motion + 2 × 5s hero clips) | 10 | $0.18–0.72 | $0.84–2.31 | $0.27–3.47 |
| Listing kit: 3 videos (75s total, 20 generative seconds) + 10 ad images + LLM/panel | 20 | about $1–3 | about $3–8 | **about $2–10 per listing** (image and LLM costs estimated at about $1–2, not verified) |

Competitors charge $0.49 to $25 per video, so fully generative video can't hit SaaS margins at the low end. VideoTour's $0.49 per video is only possible with mostly non-generative motion. Its "AI photo animations" are sold as separate credits.

**Price for ≥70% gross margin.** COGS = compute + about $8/mo per account for hosting, storage, support and payment fees (assumption).

| Plan | Included | COGS (mid-range) | Price for 70% GM | Proposed |
|---|---|---|---|---|
| Agent | 2 listing kits/mo | 2 × $5 + $8 = $18 | ≥ $60 | $79/mo (77%) |
| Team | 6 kits/mo + seller-ad refresh every 2 weeks | 6 × $5 + $6 + $10 = $46 | ≥ $153 | **$199/mo (77%)** |
| Pay-per-listing | 1 kit | $5 + $2 | ≥ $23 | $49 per listing (86%) |
| Done-for-you upsell (human QA + launch) | 1 kit + 1h at $40 | $47 | n/a (service, 50% target) | $149 per listing (68%) |

If customers demand fully generative Seedance 2.5 everywhere, kit cost rises to about $15–25. The Team plan then falls to about 45–55% GM. Cap generative seconds per plan.

**CAC vs LTV** (scenario math; CAC inputs not verified):

| Model | ARPU | GM | Monthly churn | Lifetime | GM LTV | Max CAC at LTV:CAC 3:1 |
|---|---|---|---|---|---|---|
| Solo agent SaaS | $79 | 77% | 8% | 12.5 mo | $760 | $253 |
| Solo agent SaaS (bad case) | $49 | 70% | 10% | 10 mo | $343 | $114 |
| Team plan | $199 | 77% | 4% | 25 mo | $3,831 | $1,277 |
| Hybrid team: $199 + avg 2 DFY listings/mo ($298 at 68%) | $497 | 71% | 4% | 25 mo | $8,822 | $2,940 |
| Brokerage licence: 100 seats × $8 | $800 | 75% | 1.5% | 67 mo | $40,200 | $13,400 (but 6–12 month sales cycles and free incumbents) |

- **Paid CAC for $29–99 agent tools:** the inputs are not verified. VideoTour runs 37+ active ads, including realtor-styled pages, which signals it pays for each signup.
- **Illustration:** at a $10–30 cost per trial (assumption) and 10–20% trial-to-paid, CAC is $50–300. That is fine for teams and marginal for $49 solo plans.
- **Conclusion:** solo-agent SaaS at $29–49 needs CAC under about $115. That is hard against VideoTour and AutoReel ad budgets and free brokerage tools. Team plus hybrid is the only model with room for outbound sales.

## 7. Recommendation

**Build? 🟡 Yes, but only the narrow version, and only after the 30-day test passes.** Do not build a general "AI video for agents" app.

**For whom:** teams of 5–30 agents and listing-heavy producing agents (5+ listings a month) who already spend on Meta ads or have spent and stopped. Secondary test: real-estate photographers and media companies as a wholesale channel. They own the photos and sell video upsells.

**MVP (5 features, mapped to Keepwatch):**
1. **Local winners feed.** Long-running "just listed", "coming soon" and "home value" ads in the team's metro from the Ad Library, ranked by run length. *Keepwatch: competitor tracking + longest-running winners.*
2. **Listing Ad Kit.** Listing photos in. Out: a 15s hook reel, a 30–45s tour reel and 6–10 Meta ad variants, using winner hook structures, the brand kit and burned captions. *Keepwatch: remake for your brand + 9:16 shot-for-shot video + ffmpeg captions + end cards.*
3. **Truthful-motion mode.** Non-generative motion by default, short generative hero clips with a frame-diff check, and no added objects. *New, small: ffmpeg pipeline exists.*
4. **Compliance pass.** Brokerage name on the first frame and end card, Housing SAC flag, fair-housing copy linter, AB 723 label and originals link. *New: rules plus an LLM linter.*
5. **Buyer-panel pick.** Simulated seller and buyer panel ranks the variants and picks 3 to launch. *Keepwatch: simulated buyer panel.*

Leave out of the MVP: avatars, MLS data feeds, scheduling, direct ad buying, brokerage admin.

**Price:**
- Team $199/mo (6 listing kits + seller-ad creative refresh every 2 weeks).
- Pay-per-listing $49.
- Done-for-you launch $149 per listing.
- No $29 tier.

**First 20 customers, by watering hole:**
1. **Meta Ad Library** in 5 metros: teams running "just listed" or "what's your home worth" ads. Teams whose ads stopped tried and quit. Build a sample kit from one of their live listings. This is preparation only; a human decides any outreach.
2. **Upwork:** the about 40 agent video and 14 ads job posts (earlier run). Apply with a free kit built from the poster's own public listing.
3. **RealTrends Verified** team rankings by state (public list).
4. **LinkedIn jobs:** teams hiring a content creator, videographer or marketing coordinator. Pitch the kit as a stopgap or tool for that hire.
5. **Real-estate photographers:** local photographer directories and the photographers named in AutoReel and CloudPano marketing (companies only). Offer wholesale kits.
6. **Later:** KW MarketPlace listing (Command opened to third parties in Feb 2026), Inman Connect, Tom Ferry events.
7. **Read only, do not pitch:** r/realtors (strict Rule #1).

**The single 30-day test:**
- Build sample kits from the live listings of 60 teams found in the Ad Library and on Upwork, and offer the $199 Team plan with month 1 at full price.
- **Pass:** at least 8 paying teams, and at least 5 of them launch kit ads with their own ad spend within 30 days.
- **Kill or pivot to done-for-you only:** fewer than 4 pay, or payers won't run the ads.
- **Track:** cost per lead against their previous ads. If kit ads don't beat their old creative on CPL, the product has no edge over the $29 tools.

## What was not verified

- Canva, CapCut and Captions prices; Lofty, Rechat, Ylopo and Compass add-on prices (not public).
- AutoReel, VideoTour and Coffee & Contracts user counts (self-reported); funding for AutoReel, VideoTour and Rejig (none found).
- Meta's 15-mile radius minimum (agency blogs only).
- Churn and CAC for agent content tools (no public data; benchmarks are secondary).
- Image-generation and LLM cost per kit (estimated at about $1–2).
- Who controls the realtor-styled pages that advertise VideoTour.ai.
