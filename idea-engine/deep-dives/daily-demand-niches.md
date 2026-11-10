# Niches where the demand is daily: AI video, content and ads (Gate 0 + daily-ness)

Date: 2026-11-10. Method: [METHOD.md](../github-repo-offers/METHOD.md) (Gate 0), plus a daily-ness score.
Builds on: [real-estate-video-saas.md](real-estate-video-saas.md) and [real-estate-ai-agents-brokerages.md](real-estate-ai-agents-brokerages.md).
Engine: Keepwatch. It tracks rivals' Meta ads, finds long-running winners, remakes them for a brand, and renders 9:16 shot-for-shot video (Seedance image-to-video, ffmpeg captions, end cards).

**Daily-ness score (1-5).** 5 = the buyer gets new raw material every day (new units, new prices) and stale creative costs money. 1 = the job happens a few times a year.

## Bottom line

- **Pick: used-car inventory video and ads, sold per rooftop to independent and small franchised dealers.** Units arrive, reprice and sell every day. Dealers already pay for per-vehicle media, hire in-house social staff, and vendors that sell to them keep Meta ads running for months.
- **Runner-up: mortgage loan officers' daily rate and market videos.** The job is daily, but LOs on Reddit doubt that social content pays off. Compliance review at most lenders blocks daily auto-posting.
- **Agents' social autopilot is daily in cadence but crowded and cheap.** RealEstateContent.ai and VideoTour.ai own the paid funnel. Brokerages give video away.
- **Apartments and brokerage-wide content: not now.** Content is per floor plan, not per unit. Buyers are enterprise. Vendors barely advertise on Meta.
- **Restaurants and e-commerce drops: not enough evidence.** I did not verify a daily-video budget.

## Ranked table

| Rank | Niche | Daily jobs (US) | Buyer and spend today | Competitors' Meta ads (active, 2026-11-10) | Daily-ness | Gate 0 |
|---|---|---|---|---|---|---|
| 1 | **Car dealers: inventory video + ads (per rooftop)** | About 56,000 used retail sales a day and about 44,000 new vehicles a day (my arithmetic from Cox and NADA, below). Each unit needs photos, video, a listing and ads. Prices change daily | Dealer GM or marketing manager. Dealer Image Pro: $12-22 per vehicle (live). RallyReel: $16-414/mo (live). Fullpath VIN ads: $299/mo add-on (OEM co-op sheet). In-house social hires (19 dealer roles on one LinkedIn page, last month) | Fullpath 40+ (35 run 30+ days, max 147d). Dealer Image Pro 40+ (28, max 208d). Dealers United 37+ (31, max 602d). RallyReel 26 (21, max 39d). Shiftly 30 (8, max 153d). Phyron ~0. Spyne 0. Dealer Teamwork 0 | **5** | **🟡→✅ PICK the narrow version** |
| 2 | Car salespeople: personal Marketplace and social posting (added) | Same units. Each salesperson posts store inventory daily | The salesperson, out of pocket. Shiftly $129/mo (+$369 start, third-party and a Reddit user). ListPilot $89/user (vendor page) | Shiftly 30 active. "For car salesmen" keyword: no tool vendors with long runs | **5** | 🟡 Research slot. High churn; legal grey zone on dealer photos |
| 3 | Mortgage LOs: daily rate and market videos | One rate move a day for about 221,000 producing LOs | The LO (sometimes the lender pays). KCM $59.95-99.95. Lender Crate $59-199 (live). MBS Highway Social Studio $29.95. Roomvu $89.99-399.99 (live). SocialCoach $250 (G2) | KCM 40+ (26 at 30+ days). myhomeIQ 40+ (32). Homebot 40+ (13). Roomvu 40+ (28, max 215d). MBS Highway 3 (max 467d). Lender Crate 10 (all under 30d). Total Expert, Lender Homepage, Loanzify: 0 | 4 | 🟡 Research slot |
| 4 | Real-estate agents: daily social autopilot | About 15,400 new listings a day (FRED, Jun 2026) across about 1.5M agents. Per agent: a few listings a year | The agent. $19-199/mo. Free inside KW, Compass, RE/MAX, eXp | RealEstateContent.ai 40+ (38 at 30+ days, max 552d). VideoTour.ai 30+ (29, max 480d). KCM 40+. Roomvu 40+ | 3 | 🟡 Narrow only (see the earlier file) |
| 5 | Brokerage-level just listed / sold / open house | The same ~15,400 listings a day, pooled by office | The brokerage. Long cycles. Free tools bundled | Not checked again. The earlier run found brokerages give video away | 4 at office level | ❌ for now (bundled free, enterprise sales) |
| 6 | Apartments: vacancy ads | About 45% of leases turn each year (55% retention, RealPage via LeaseLock). National unit count not verified | Property marketing team. Median spend $200/mo (<50 units) to $1,600/mo (100+ units) per property ([Apartments.com survey](https://www.apartments.com/grow/learning-center/advertising-strategy-under-50-units)) | EliseAI 15 (12 at 30+ days). Respage 2. Rentgrata, Digible, ApartmentGeofencing: 0 | 3 | ❌ for now (content is per floor plan; few paying funnels on Meta) |
| 7 | Restaurants' daily specials / e-commerce drops | Not verified | Owner.com and Popmenu sell websites and ordering, not daily video | Owner.com 40+ (30 at 30+ days, max 221d). Popmenu 20 (all under 30d) | 4 (claimed) | Not scored. Evidence too thin |

## Sources and sample sizes

- **Meta Ad Library** via treg `scrapecreators` endpoints (company search, company ads, keyword search). 33 company searches, 9 keyword searches (US, active) and about 46 pages of company ads. "30+ days" means the ad's start date is 30 or more days before 2026-11-10. "40+" means I stopped after 2 pages (30 or 40 ads) and more were left.
- **Reddit** via `crawl4ai.reddit.search.posts` (6 searches, past year) and `crawl4ai.reddit.post.comments` (8 threads).
- **Upwork** via Google results for `site:upwork.com/freelance-jobs/apply` (6 queries, 41 results). **LinkedIn jobs** via `crawl4ai.linkedin.search.jobs` (8 queries, US, past month).
- **Live pricing pages:** Dealer Image Pro, RallyReel, Lender Crate, Roomvu, plus the Fullpath Stellantis co-op PDF. Other prices are from third-party pages and are marked.
- **treg spend this run: about $0.19** (my own call count × list price: 88 scrapecreators calls at $0.00188 ≈ $0.165, plus Reddit, Google and LinkedIn calls ≈ $0.02-0.03). The team balance went from $7.97 to $7.59, but other sessions share it, so not all of that drop is mine.

---

## 1. Car dealers: inventory video and ads (rank 1)

### Daily volume
- Cox's December 2025 report projects 2026 retail used sales at 20.3M, down 0.7% from 2025. That implies about 20.4M in 2025 ([Cox, Dec 2025](https://www.coxautoinc.com/insights-hub/used-retail-vehicle-sales-december-2025/)). 20.4M / 365 ≈ **56,000 used retail sales a day.** Every sale is also a unit that had to be acquired, photographed and listed.
- NADA: 16,990 franchised dealers sold 16.2M light vehicles in 2025 ([NADA Data](https://www.nada.org/nadadata)). That is about **44,000 a day**, or about 2.6 new units per store per day (my arithmetic).
- Per-store used volume: not verified. NADA's page did not show used units per dealer.
- Prices change daily too. Phyron says its videos re-render when listing details change ([Phyron customer story](https://www.phyron.com/resources/phyron-wensink-customer-story)).
- Meta supports this format natively. Automotive Inventory Ads added video ("Product Level Video") in January 2024 and now sit under Advantage+ catalog ads ([Phyron on AIA](https://www.phyron.com/resources/meta-auto-inventory-ads), vendor source).

### Buyer and budget
- **Who pays:** the dealer principal, GM or marketing manager. Groups buy centrally. New-car stores also spend OEM co-op money, but only on certified vendors. Fullpath's Stellantis sheet says its products are "100% co-op (T3AC) eligible" and lists VIN-specific ads at **$299/mo**.
- **Per vehicle:** Dealer Image Pro says "most dealerships invest between **$12-22 per vehicle**", with a 50-vehicle monthly minimum, $999 setup and no long-term contract ([live page](https://dealerimagepro.com/pricing/)). Spyne 360: $8-12 per car alone, $4-6 bundled (a partner doc, [not verified](https://sites.google.com/spyne.ai/spin-360/spyne-spin-360)). Glo3D: $49 and $199/mo tiers ([third-party](https://www.spyne.ai/blogs/glo3d), not verified). Phyron: "less than the cost of a coffee per car" (vendor claim, [MarTech](https://martech.org/how-video-creative-platform-phyron-uses-ai-to-sell-cars/)).
- **Subscription:** RallyReel (one photo to a car reel or commercial): $16, $24, $107 and $414/mo billed yearly, up to 8,400 reels a year. Enterprise adds inventory feeds and scheduling ([live page](https://rallyreel.ai/)). This is the cheap-SaaS price cap for plain video.
- **People:** in one LinkedIn search ("dealership social media", US, past month), 19 of 60 results were dealer or dealer-group roles. Examples: Content Creator & Social Media Specialist at DeNooyer Chevrolet, Social Media & Content Specialist at Kocourek Automotive, Social Media Content Creator at Chapman Automotive Group, CONTENT CREATOR at Capitol Chevrolet, and two content roles at The CAR Group (Norm Reeves). A full-time hire costs far more than $300/mo, so the tool can be sold as that person's daily output engine. Salaries: not verified.
- **Retention signals:** Dealer Image Pro and Shiftly run month-to-month. Dealer tools are used every day, so the daily habit is built in. Dealer churn data: not found.

### Competitors and their Meta ads

| Vendor | What it sells | Price | Meta ads (active) |
|---|---|---|---|
| [Dealer Image Pro](https://dealerimagepro.com/pricing/) | iPhone app + AI/human editing: photos, video, 360 | $12-22/vehicle (live) | 40+; 28 at 30+ days; oldest 208d |
| Fullpath | AI search/social/display ads, VIN ads | $299/mo VIN add-on (OEM sheet); other tiers not public | 40+; 35 at 30+ days; oldest 147d |
| Dealers United | Marketplace listings, SEO, social for dealers | Not checked | 37+; 31 at 30+ days; oldest 602d |
| [RallyReel](https://rallyreel.ai/) | Photo → car reel or commercial | $16-414/mo (live) | 26; 21 at 30+ days; oldest 39d (new and scaling) |
| Shiftly | Facebook Marketplace auto-posting for dealers and reps | $129/mo + $369 start (third-party and Reddit) | 30; 8 at 30+ days; oldest 153d |
| BuyerBridge | Inventory ads for agencies (short-form video playbook) | Not public | 16; 8 at 30+ days |
| Boost My Dealer, DigiMark Dealer | Dealer marketing agencies | Not checked | 8 and 5 ads; oldest 147d and 105d |
| Vumo | Personalized vehicle videos for lead replies | Not checked | 11; all under 30 days |
| Covideo | Sales video email | Not checked | 6; all under 30 days |
| Phyron | Automated VIN videos, Meta AIA video | Not public ([pricing page](https://www.phyron.com/pricing) has none) | 0-1 (sells through partners) |
| Spyne, Flick Fusion, LESA, Glo3D, Impel, Dealer Teamwork | Studio photos, 360, VIN video | Not public | Spyne 0, Dealer Teamwork 0. Flick Fusion, LESA, Glo3D, Impel: no page found |
| Meta itself | Advantage+ catalog ads turn feed photos into slideshow video | Free with ad spend | n/a |

Read: dealer-facing vendors keep paying for Meta ads for months (Dealers United 602 days, Dealer Image Pro 208, Fullpath 147). The older video vendors (Phyron, Flick Fusion, LESA) sell through resellers, OEM programs and website platforms, not Meta.

### Demand signals
- **Reddit, r/askcarsales:** "Is Shiftly worth it?" (May 2026). "Anyone else posting inventory to Facebook Marketplace on their own?" (Feb 2026): the poster said tools are "expensive (Shiftly is $129/mo + $369 to start), dealership-level tools that need your manager involved, or Chrome extensions where you're still clicking through each car." A second rep: "I dont think 300 a month to still have to go in and do a bunch of clicking around is very f[air]". "Facebook marketplace tool to autopost" (Aug 2026): "They're all pretty trash" ([thread](https://www.reddit.com/r/askcarsales/comments/1vzdve0/facebook_marketplace_tool_to_autopost/)). Links: [1](https://www.reddit.com/r/askcarsales/comments/1tocn40/is_shiftly_worth_it/), [2](https://www.reddit.com/r/askcarsales/comments/1r6gs59/anyone_else_posting_inventory_to_facebook/).
- **Upwork:** thin. 3-5 relevant posts (for example "Content editor for car business", Oct 19). Dealers buy from vendors, not freelancers.
- **LinkedIn:** 19 dealer social/content roles in one page of results in a month (above). This is the strongest hiring signal of all the niches.

### Fit with Keepwatch
- **Strong.** VDP photos are the inputs. Keepwatch finds rival dealers' long-running Meta ads in the same metro and remakes them with this dealer's units. It then renders a 9:16 video per VIN with price, stock number, captions and an end card.
- **Wedge vs incumbents:** Phyron, Flick Fusion and Meta's catalog video make template slideshows. RallyReel makes cheap reels. None of them shows what the competing dealer down the road keeps running and rebuilds it with your units. Dealer Image Pro and Spyne are capture tools, not ad creative.
- **Compliance risks:**
  - Do not alter the car. Generative video that hides damage or adds features misrepresents the vehicle. Default to non-generative motion on the real photos; use generative motion only on backgrounds and transitions, with a frame check.
  - Price advertising: state rules on fees and disclaimers. The FTC CARS Rule was vacated in Jan 2025 (not re-verified here), but state rules still apply. Show stock number, price disclaimer and dealer name on every video.
  - Finance terms (payments, APR) trigger Reg Z/Reg M disclosures and Meta's financial-products ad category. Keep MVP videos to price only.
  - Photos: the dealer owns its photos. A salesperson posting them personally is a grey area (a Reddit commenter said exactly this).

### Gate 0
| Check | Result | Evidence |
|---|---|---|
| Buyers asking (20+) | 🟡 Loose pass | 19 dealer social/content hires on one LinkedIn page in a month, several Reddit tool asks, Upwork thin. Buyers buy from vendors |
| 3-5 priced competitors | ✅ | Dealer Image Pro, RallyReel, Fullpath, Shiftly, ListPilot, Glo3D (mixed live and third-party) |
| ≥50% margin | ✅ | About 73% at $299/rooftop (math below) |
| Watering holes | ✅ | Below |

---

## 2. Car salespeople: personal posting (added niche, rank 2)

- **Daily job:** reps post store inventory to Marketplace and their own social every day. The Reddit poster had done it "for a few months now — just grabbing cars off our dealer site".
- **Spend:** Shiftly $129/mo plus $369 to start; ListPilot $89 per user per month ([vendor page](https://listpilot.pages.dev/shiftly-auto-alternative)); Marketplace Pro £57/mo (UK). Not verified on the vendors' own sites.
- **Risks:** dealer IP (photos), manager approval, and high salesperson turnover (one r/askcarsales poster: "Should I leave the car business?"). Churn will be high.
- **Verdict:** 🟡 Research slot. It could be a cheap add-on seat inside the rooftop plan ($29/rep).

---

## 3. Mortgage loan officers: daily rate and market videos (rank 3)

### Daily volume
- 221,161 LOs originated at least one loan in 2025 (RETR preliminary, via [HousingWire](https://www.housingwire.com/articles/loan-officer-growth-2025/)).
- Rates move daily. But there is one rate story a day nationally, so the content is close to identical across LOs. Differentiation comes from the LO's face, local market and niche.

### Buyer and budget
- **Who pays:** the LO, or the lender's marketing team.
- **Prices:** [Lender Crate](https://www.lendercrate.com/): $59 (templates), $199 (3 branded posts a week), $149 (CRM), monthly, cancel anytime (live). [Roomvu](https://www.roomvu.com/pricing): $89.99 / $199.99 / $399.99, "auto-posted daily" (live; the page also says 5-7 posts a week). MBS Highway Social Studio $29.95/mo ([page](https://www2.highway.ai/addon/social-studio)). SocialCoach $250/user/mo ([G2](https://www.g2.com/products/socialcoach/pricing)). KCM $59.95-99.95 (earlier run). Homebot $125-300/mo ([pricing](https://homebot.ai/pricing)) is a client-retention tool, not content.

### Competitors' Meta ads
- KCM 40+ (26 at 30+ days, max 120d). myhomeIQ 40+ (32 at 30+ days, max 149d; sells a "production audit" to LOs). Homebot 40+ (13 at 30+ days). Roomvu 40+ (28 at 30+ days, max 215d; the sampled ad targeted insurance agents). MBS Highway 3 (one at 467d). The Solopreneur Loan Officer (a Skool community) 21 ads.
- Lender Crate 10 ads, all under 30 days (testing). SocialCoach 2 ads (7 days). Total Expert, Lender Homepage and Loanzify: 0.

### Demand signals
- r/loanoriginators threads ask who to use: "Who are you guys using for your LO website + social media?" (Sep 2026, answers: MLOBox, MLO Studio, "build your own with Claude"), "Who has the best social media content in the mortgage / LO world?" (Jun 2026).
- Skepticism is strong: "dont bother paying someone to create bland mass marketed content" ([thread](https://www.reddit.com/r/loanoriginators/comments/1ow94vo/social_media_worth_it_or_not/)); "Social media is for realtors. LO's network in person" ([thread](https://www.reddit.com/r/loanoriginators/comments/1u531a1/who_has_the_best_social_media_content_in_the/)); on SocialCoach: "you are better off calling on realtors or buying leads" ([thread](https://www.reddit.com/r/loanoriginators/comments/1wn9udu/social_coach/)).
- Upwork: a few posts (a mortgage copywriter, a static Meta ad designer for a mortgage broker, Nov 2). Thin.

### Fit and compliance
- Fit is medium. Keepwatch can track KCM, myhomeIQ and top LO pages and remake their winning formats. But the deliverable is a talking-head or avatar video. That needs the LO's likeness, not inventory photos.
- **Compliance is heavy.** Reg Z 12 CFR 1026.24: a stated rate needs the APR, at least as prominent ([BankersHub](https://www.bankershub.com/blogs/blog/social-media-marketing-reg-z-respa-udap-compliance)). NMLS IDs on profiles and posts; Texas requires company and originator names with NMLS IDs on social accounts ([Texas SML](https://www.sml.texas.gov/wp-content/uploads/2025/04/rmlo_social_media_requirements_and_best_practices_v3.pdf)). UDAAP and Fair Lending apply. Many retail lenders require marketing pre-approval, which breaks a daily auto-post loop. Brokers have more freedom.
- **Gate 0:** 🟡 Research slot. Priced competitors ✅, margin ✅, watering holes ✅ (r/loanoriginators, NAMB, Skool LO communities), but buyer asks are thin and buyers doubt the value.

---

## 4. Real-estate agents' daily autopilot (rank 4)

- About 15,400 new listings a day: FRED shows 463,480 new listings in June 2026 ([FRED NEWLISCOUUS](https://fred.stlouisfed.org/data/NEWLISCOUUS)). October new listings fell 7.5% year over year ([Realtor.com via Finviz](https://finviz.com/news/415117/active-inventory-grows-as-sellers-keep-homes-on-the-market-realtorcom-october-housing-report)).
- Per agent, listings are rare. The daily part is posting cadence, not new inventory. That is why RealEstateContent.ai sells "autopilot" and keeps 38 of 40 sampled ads running 30+ days (max 552d), and VideoTour.ai keeps 29 of 30 (max 480d).
- Verdict unchanged from [the earlier deep dive](real-estate-video-saas.md): 🟡, narrow team ad kits only.

## 5. Brokerage-level content (rank 5)

- The office pools listings, so volume is daily. But KW Command, Compass, RE/MAX and eXp already give video tools away, and sales cycles are long ([earlier run](real-estate-video-saas.md)). ❌ for now; white-label later.

## 6. Apartments (rank 6)

- Retention was 55.1% in Q1 2025 ([LeaseLock, RealPage data](https://leaselock.com/renter-retention-trend-march-2025)), so roughly 45% of units turn each year. The national count of professionally managed units was not verified, so I give no per-day figure.
- Content is per floor plan and per property, not per unit. Leasing specials change weekly or monthly. Daily-ness is 3, not 5.
- Spend: median $200/mo per property under 50 units and $1,600 for 100+ units ([Apartments.com survey](https://www.apartments.com/grow/learning-center/advertising-strategy-under-50-units)). ILS cost per lease runs about $600-1,000 (vendor studies, [Yardi Breeze](https://www.yardibreeze.com/?p=320249)).
- Meta: EliseAI 15 ads (AI leasing agent). Respage 2. Rentgrata, Digible and ApartmentGeofencing 0. The keyword "leasing specials video" returned 1 ad. There is no visible paid funnel for creative tools.
- Housing Special Ad Category and Fair Housing apply. ❌ for now.

## 7. Restaurants and e-commerce drops (not scored)

- Owner.com runs 40+ ads (30 at 30+ days, max 221d), but it sells websites, ordering and a "grader" lead magnet. Popmenu runs 20, all under 30 days. I found no vendor selling daily specials video with a visible budget. Not enough evidence to score.

---

## Recommendation: daily inventory video and competitor-modeled ads for car dealers

### Exact buyer
- **Independent used-car dealers and the used-car departments of single-point or small-group franchised stores** with 50-300 units in stock, already listing on Facebook Marketplace or running Meta ads. The decision maker is the owner, GM or used-car manager, or the in-house social media hire.
- Independents first: no OEM certification gate, one decision maker, and they list on Marketplace every day. Franchised groups come second, through co-op certification later.

### Deliverable (what is produced every day)
1. **A 9:16 video for every new VIN** (15-20 seconds) within an hour of the unit hitting the website feed. Real photos with ffmpeg motion, captions with year/make/model, price, stock number and dealer disclaimer, and an end card. Re-rendered when the price drops.
2. **A feed for Meta Advantage+ catalog (video) and Marketplace,** so videos go out without clicking through each car.
3. **Every week: 2 competitor-modeled ads.** Keepwatch finds the long-running Meta ads of 5-10 rival dealers in the metro and remakes the top structures with this dealer's units.
4. **A compliance pass:** dealer name, stock number, price disclaimer, no finance terms unless disclosed, and a check that the vehicle in the video matches the real photos.

### Price model: per rooftop, volume included
- **$299/mo per rooftop**, including up to 150 VIN videos a month (about 5 a day), 8 competitor-modeled ads a month and 10 tracked rival pages. Overage $1 per VIN video. Month-to-month, as Dealer Image Pro and Shiftly do.
- Add-on: $29/mo per salesperson for personal-brand versions of the same videos (tests rank 2).
- Why per rooftop: dealers budget per store, and Fullpath ($299/mo VIN add-on) anchors the price. Per-VIN pricing would invite comparison with RallyReel's cheap credits.

### Unit economics (compute prices from the treg catalog in the earlier run)

| Item | Assumption | Monthly cost |
|---|---|---|
| 150 VIN videos | Non-generative motion on real photos plus a 3-second Seedance 1 Lite hero clip at $0.018-0.072/sec ($0.05-0.22) × 1.5 retries, plus render and LLM caption ≈ $0.25 each (mid) | $37.50 |
| 8 competitor-modeled ads | 15 generative seconds each on Seedance 2.5 at the low provider price ($0.103/sec) × 1.5 retries ≈ $2.30 each | $18.50 |
| Ad Library tracking | 10 pages × weekly × 2 pages × $0.00188 | $0.20 |
| Hosting, storage, support, payment fees | Assumption, not verified | $25 |
| **Total COGS** | | **≈ $81** |
| **Gross margin at $299** | (299 − 81) / 299 | **≈ 73%** |

- **Bad case:** Seedance 2.5 at the high price ($0.462/sec) for the ads (≈ $83) and $0.54 per VIN video (≈ $81) gives COGS ≈ $189 and margin ≈ 37%. So cap generative seconds per plan, and keep VIN videos non-generative by default. That is also what the "do not alter the car" rule requires.

### Wedge vs incumbents
- Phyron, Flick Fusion, LESA and Meta's own catalog video make template slideshows. RallyReel makes cheap reels with no inventory feed below its $414 tier. Shiftly and ListPilot post listings but do not make creative.
- **Our edge:** "What the dealer across town keeps paying to run, rebuilt with your cars, every day." Nobody else reads the local Ad Library for dealers. Add the daily VIN video feed and the compliance pass on top.

### First 20 customers (preparation only; a human decides any outreach)
1. **Meta Ad Library, 3 metros:** list independent dealers that run inventory ads now, and dealers whose ads stopped. Build sample videos from 5 of each dealer's live VIN photos, kept private for the demo.
2. **LinkedIn jobs:** dealers hiring social or content staff right now, for example DeNooyer Chevrolet, Kocourek Automotive, Sterling Automotive Group, Chapman Automotive Group, Capitol Chevrolet, Vaden Automotive, Trust Automotive Group, Bayway Auto Group, Sames Auto Group and The CAR Group. Pitch it as the new hire's daily output engine.
3. **Facebook Marketplace itself:** dealers posting many units a day by hand are visible in any metro.
4. **DealerRefresh forum and vendor directory** ([forum.dealerrefresh.com](https://forum.dealerrefresh.com/vendors/localshift/)): read threads on Marketplace and video tools.
5. **r/askcarsales and r/CarSales:** read only. Reps there ask for posting tools and complain about Shiftly's price.
6. **NIADA and state independent dealer associations, DealerCenter users** (the DMS a Reddit dealer named): later channels.
7. **Later:** OEM co-op certification (Fullpath shows the path: "100% co-op eligible"), Digital Dealer conference and the NADA Show.

### The 30-day test
- **Setup:** build private sample packs (5 VIN videos + 1 competitor-modeled ad) for 40 dealers from the lists above. Offer $299/mo with month 1 at full price and no setup fee.
- **Pass (all four):**
  1. **6 or more paying rooftops** by day 30.
  2. **4 or more of them use it daily:** at least 3 VIN videos published a day on average in week 4.
  3. **Compute ≤ $0.40 per VIN video** and ≤ $3 per competitor-modeled ad, measured.
  4. **Zero vehicle-accuracy complaints** (no altered cars).
- **Kill or pivot:** fewer than 3 pay, or fewer than 2 use it daily by week 4. Then fall back to the salesperson seat ($29-49/rep) or to the LO niche.
- **Track:** time from a VIN appearing on the site to its video going live, Marketplace and catalog clicks per video against the dealer's own baseline, and week-4 daily-active rooftops.

## What was not verified
- Used units per dealer per day; the national count of professionally managed apartments; the October 2026 new-listing count.
- Prices for Phyron, Flick Fusion, LESA, Impel, Spyne (partner doc only), Glo3D (third-party), Shiftly and ListPilot (third-party or vendor blog), and Fullpath beyond the $299 VIN add-on.
- Car salesperson headcount and churn; dealer churn for media tools.
- Hosting and support cost per account ($25 is an assumption). Compute prices are aggregator list prices from the treg catalog.
- Who controls the pages behind the Meta ads counted here. Counts are active ads on 2026-11-10 and stop at 40 per page.
- Current status of the FTC CARS Rule and state dealer advertising rules (not re-checked in this run).
