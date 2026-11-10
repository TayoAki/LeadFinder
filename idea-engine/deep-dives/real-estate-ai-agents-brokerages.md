# Real-estate AI services: what agents, teams and brokerages pay for (Gate 0)

Date: 2026-11-10. Method: [METHOD.md](../github-repo-offers/METHOD.md) (Gate 0).
Scope: US residential agents, teams and brokerages first. Commercial (CRE) and mortgage (LO) where relevant.

## Bottom line

- Buyers pay for **output**, not for "AI". The biggest cluster by far is **short-form video and content**: about 40 tight Upwork posts from agents, teams and LOs. Few of them say "AI". Several want a human editor.
- The second money signal is **paid lead generation** (Meta, Google, LSA). Upwork shows fewer posts (about 14 direct, plus 4 agencies hiring media buyers to serve agents). But agents report real spend on Reddit ($500/week LSA budgets, $2,200/month cold-calling stacks). Vendors charge $1,300 to $2,000 a month.
- Most "AI for realtors" products are saturated or bundled free: listing descriptions, virtual staging, AI text follow-up, AI CRM features. Follow Up Boss says it charges nothing extra for AI.
- AI voice ISA demand on Upwork comes from **wholesalers and investors**, not agents. Agents hire **human** ISAs at $5 to $15 an hour.
- Market: late 2026 is slow. Portal leads are thinning (Zillow Flex, Realtor.com changes). Agents are moving to sphere, organic content and owned channels. LOs report a hard market and layoffs. This favours content and owned-ads offers over lead-response tooling.

**Recommended:** (1) Listing Video Kit per listing for teams, $149 per listing. (2) Content retainer for producing agents and teams, $597 a month. (3) Seller and listing Meta ads with fresh creative for teams and brokerages, $1,000 a month plus ad spend (research slot: on-platform count is under 20).

## Sources and sample sizes

- **Upwork** (via Google results restricted to `upwork.com/freelance-jobs/apply`, 51 queries through `treg.google.serp.organic`): 283 unique job pages in batch 1, plus about 110 more in batch 2. About half show a date. Dated ones run from Sep to Nov 2026. Undated ones may be older, so counts are a ceiling for a 60-day window.
- **Reddit** (`crawl4ai.reddit.search.posts`, top of the past month): 23 searches across r/realtors, r/RealEstateTechnology, r/CommercialRealEstate, r/loanoriginators and r/RealEstate. I read comments on 7 threads.
- **LinkedIn jobs** (`anyapi.linkedin.search.jobs`, US, past month): 12 role searches. This endpoint returns only 30 cards per query, so these are samples, not totals.
- **Meta Ad Library** (`crawl4ai.meta-ads.library.search`, US, active): 5 keyword searches (about 170 ads) for an attention scan.
- **Live pricing pages** fetched for 14 vendors. Search-snippet prices are marked as such.
- **treg spend for this run:** about $0.076, from summing `charged_micro` on my own calls. The team balance went from $9.11 to $8.38 during the run, but the ledger shows another session spending on the same team (for example `crawl4ai.indeed.search.jobs`, which I did not call). So the balance drop is not mine alone.

## Ranked clusters

Counts are **tight**: the buyer is an agent, team, brokerage or LO, and the post clearly asks for this deliverable. Investor and wholesaler posts are counted separately and left out.

| # | Cluster | Tight asks (Upwork) | Buyer type | Budgets seen | Price floor (live pages) | Gate 0 verdict |
|---|---|---|---|---|---|---|
| 1 | Short-form video: reels, listing videos, YouTube editing | ~40 (plus ~3 LO) | Solo producers, teams, a few brokerages | $50/video fixed; $30–50/hr; $200 paid trial | AutoReel $30–82/mo; VideoTour.ai $29–99/mo; freelancers ~$25/video | ✅ PICKED (as per-listing kit and retainer) |
| 2 | Social media management and content | ~22 | Solo agents, teams, brokerages | low hourly; mostly not stated | RealEstateContent.ai $119/mo self-serve | 🟡 Merge into #1. Weak alone |
| 3 | Human ISA and cold calling | ~22 agent-side, 2 mortgage (+8 investor) | Teams | $5–15/hr | MyOutDesk from $1,988/mo | ❌ REJECT for an AI operator. Real demand, but for cheap humans |
| 4 | Paid ads: Meta, Google, LSA | ~14 direct + 4 agencies hiring media buyers | Teams, brokerages, LOs | $300 fixed (LSA fix); $10–25/hr | Curaytor $1,300/mo; Lofty 20% ad fee; seller-lead service $2,000/mo (snippet) | 🟡 RESEARCH SLOT. Under 20 asks, strong money elsewhere |
| 5 | AI automation and "AI agents" for teams | ~11 | Teams, a few brokerages | hourly, 3–6 month coaching | none comparable | 🟡 RESEARCH SLOT |
| 6 | CRM setup (FUB, Lofty, BoldTrail, GHL) | ~11 | Solo agents, teams | $150–$350 fixed | FUB AI included free; Lofty AI bundled | ❌ REJECT alone. Bundle only |
| 7 | Transaction coordination | ~8 (+ LinkedIn roles at Compass, HomeServices, Long & Foster) | Teams, brokerages | not stated | $300–600 per file (snippets) | ❌ REJECT. Human, licensed, crowded |
| 8 | Virtual staging and photo editing | ~8, mostly photographers and media firms | Photographers | bulk 1,000–3,000 photos/mo | VSAI $16–79/mo; BoxBrownie $30/image | ❌ REJECT. Cheap SaaS caps price |
| 9 | Commercial: OM design, CRE marketing | ~7 | CRE brokerages, CRE marketing studios | not stated | OM studio $1,750/mo (snippet) | 🟡 RESEARCH SLOT. Small but bigger tickets |
| 10 | Mortgage LO marketing (video, ads, copy) | ~8 | LOs, small mortgage brokers | not stated | Homebot $125–300/mo | 🟡 Later. Market is weak now |
| 11 | Listing descriptions | 0 standalone (~4 listing coordinator roles) | Teams | $8–15/hr coordinator | ListingAI free to $36/mo; Write.Homes $25/mo | ❌ REJECT. Free in ChatGPT and CRMs |
| 12 | Brokerage recruiting | ~3 | Brokerages | not stated | not verified | 🟡 Not enough data |
| 13 | AI voice ISA for agents | ~1 agent-side (4 investor) | Investors, not agents | not stated | Structurely usage from $0.07/min; Ylopo and Lofty bundle AI | ❌ REJECT for agents |
| 14 | "Rank me in ChatGPT" / AI visibility | 1 | Solo agent | not stated | several advertisers | ❌ REJECT for now. More sellers than buyers |

## 1. Buyers asking (detail)

### Video and content (clusters 1 and 2), about 40 + 22
Examples, all from agent or team buyers:
- A luxury team in Scottsdale wants someone to turn listing photos into short videos: [post](https://www.upwork.com/freelance-jobs/apply/Video-Editor-Needed-Turn-realestate-photos-into-short-listing-videos_~022114458188079315961/) (Oct 25, 2026).
- Ongoing listing and social video editing, $30–50/hr, 30+ hrs/week: [post](https://www.upwork.com/freelance-jobs/apply/Edit-Real-Estate-listing-social-videos_~022113500684678270587/) (Oct 7).
- Property tour reels at $50 fixed: [post](https://www.upwork.com/freelance-jobs/apply/Video-Editor-for-Dynamic-Real-Estate-Reels-Ongoing-Freelance_~022107689369345939689/) (Oct 6).
- About 4 reels per month for a brokerage brand: [post](https://www.upwork.com/freelance-jobs/apply/Instagram-Real-Estate-Reels-Editor_~022112124093868626667/) (Oct 19).
- 3–5 short videos per week: [post](https://www.upwork.com/freelance-jobs/apply/Short-Form-Video-Editor-for-Real-Estate_~022111290990457302921/) (Oct 16).
- Videos made from property images for agents: [post](https://www.upwork.com/freelance-jobs/apply/Real-Estate-Video-Editor-for-Property-Images_~022118306418129084930/).
- An Ohio realtor's YouTube editor with a $200 paid trial: [post](https://www.upwork.com/freelance-jobs/apply/YouTube-Video-Editor-SEO-Specialist_~022114252571187348279/) (Oct 25).
- At least 8 more agent YouTube editor posts (Chicago, Las Vegas, San Francisco, Sarasota, Charlotte, MD/DC).
- Mortgage: 12 short videos a month for a mortgage team: [post](https://www.upwork.com/freelance-jobs/apply/Video-Editor-for-Mortgage-Team-Short-Form-Videos-Per-Month-Ongoing_~022107800110631059801/). A bilingual LO and broker in Dallas: [post](https://www.upwork.com/freelance-jobs/apply/Bilingual-English-Spanish-Short-Form-Video-Editor-for-Real-Estate-Content-Videos-Week_~022119629111773326469/).

Caution: at least 2 posts say "No AI edits" or "real UGC only, no AI actors". Sell the result, not the AI.

Reddit evidence:
- An agent reports paying a videographer **$400** twice and asks whether listing videos work ([thread](https://www.reddit.com/r/realtors/comments/1xsghua/do_listing_videos_actually_get_you_more_showings/), Nov 10).
- "What's working in 2026" answers are mostly sphere, referrals, open houses and social. One SoCal agent credits "home tours videos + automation". Another posts weekly zip-level price-cut data drafted with AI ([thread](https://www.reddit.com/r/realtors/comments/1xhvgkh/realtors_whats_working_for_you_in_2026/)).

LinkedIn shows teams hiring W-2 content creators and videographers. Examples: Utah Life Real Estate Group, Mission Realty (brokered by REAL), Tahoe Luxury Properties, DeLeon Realty. That role costs a full salary and is what a retainer replaces. (Sample of 30 per query.)

### Paid ads (cluster 4), about 14 direct + 4 agencies
- An agent in Columbus, IN wants Meta ads run: [post](https://www.upwork.com/freelance-jobs/apply/Meta-Ads-Specialist-for-Real-Estate_~022119897351936741199/).
- Residential buyer and seller leads: [post](https://www.upwork.com/freelance-jobs/apply/Facebook-Instagram-Ads-Expert-Needed-Generate-Residential-Real-Estate-Buyer-Seller-Leads_~022114961941663447279/).
- A 25-agent team wants high-intent leads: [post](https://www.upwork.com/freelance-jobs/apply/High-Intent-Real-Estate-Lead-Generation_~022115155050846170257/) (Nov 4).
- Google LSA fix for a team, $300 fixed: [post](https://www.upwork.com/freelance-jobs/apply/Fix-Google-Local-Services-Ads-for-real-estate-team-verified-live-zero-leads_~022113342958782927762/).
- A brokerage wants Meta ads to recruit agents: [post](https://www.upwork.com/freelance-jobs/apply/Meta-Ads-Specialist-Recruit-Real-Estate-Agents-Our-Brokerage_~022118801621758400185/).
- Mortgage LO lead gen: [post](https://www.upwork.com/freelance-jobs/apply/Facebook-Ads-Specialist-Media-Buyer-Mortgage-Housing-Niche_~022110061630587688575/).
- Agencies that serve agents are hiring media buyers ([1](https://www.upwork.com/freelance-jobs/apply/Media-Buyer-Position-Residential-Real-Estate-Agents_~022115317593272028765/), [2](https://www.upwork.com/freelance-jobs/apply/Remote-Meta-Ads-Manager-Realtor-Lead-Generation_~022106469746704518989/)). This proves a resale market exists.
- Reddit "Lead Programs Drying Up" ([thread](https://www.reddit.com/r/realtors/comments/1x53oeu/lead_programs_drying_up/), 58 comments): one agent sets an $800/week LSA budget and spends about $500/month. Another gets 15 leads a week from Google Ads at $1.14 CPC. Another spends $2,200/month on cold calling (data, dialer, VA). Agents say Zillow and Realtor.com lead quality has dropped and costs have risen.

### AI automation for teams (cluster 5), about 11
Examples: an AI agent and bot systems coach for a team, 30+ hrs/week for 3–6 months ([post](https://www.upwork.com/freelance-jobs/apply/Agent-Bot-Systems-Coach-for-Real-Estate-Team-Prompts-Workflow-Agent-Orchestration_~022118170465349946864/)). A CRM and AI automation specialist for an Austin agent ([post](https://www.upwork.com/freelance-jobs/apply/Real-Estate-CRM-Automation-Specialist_~022118780528688076218/)). A Claude Skills coach for a CRE brokerage ([post](https://www.upwork.com/freelance-jobs/apply/Claude-Skills-Coach-for-Commercial-Real-Estate-Brokerage_~022111198270864158037/)). Also an AI trainer who builds custom GPTs for a team, and an AI and workflow engineer for a team.

### CRM (cluster 6), about 11
Budgets are small: a BoldTrail website and CRM for $350 ([post](https://www.upwork.com/freelance-jobs/apply/Kvcore-boldtrail-website-designer-and-crm-specialist_~022118481825175019252/)), a Boldtrail email and CRM job for $150, and a FUB, Dotloop, GHL and BoldTrail integration for $160. Others: a Lofty CRM setup ([post](https://www.upwork.com/freelance-jobs/apply/Lofty-CRM-Specialist-for-Real-Estate-Setup_~022115891606672773079/)) and a FUB + Mailchimp + Zapier newsletter pilot ([post](https://www.upwork.com/freelance-jobs/apply/Follow-Boss-Mailchimp-Zapier-Expert-Luxury-Real-Estate-Newsletter-Automation-Pilot_~022110372900122678439/)).

### ISA (cluster 3), about 22 agent-side
Teams want human ISAs, mostly offshore at $5–15/hr. Examples: an FUB lead-backstop ISA for a Wilmington, NC team ([post](https://www.upwork.com/freelance-jobs/apply/Real-Estate-ISA-Follow-Boss-Lead-Backstop_~022108493268802279360/)), plus expired and FSBO callers. The AI voice requests come from wholesalers ([example](https://www.upwork.com/freelance-jobs/apply/Voice-Agent-for-Real-Estate-Business_~022113473734883169170/)).

### Spending reality
- NAR's 2026 Technology Report (via [The Close](https://theclose.com/stats-trends/news-real-estate-tech-spending/) and [NAR](https://www.nar.realtor/news/real-estate-news/technology/the-tech-real-estate-agents-rely-on-most-in-2026)) shows monthly tech spend: 18% of agents spend under $50, 36% spend $50–250, 19% spend $251–500 and 22% spend over $500. Most solo agents will not pay $500+ a month for a tool. The top 22% will.
- A Reddit commenter says most small and part-time agents use brokerage-provided tech and only "performers" run their own stack ([thread](https://www.reddit.com/r/realtors/comments/1xqkveh/how_much_is_your_monthly_ongoing_cost_on_crm/)). Target producing agents and teams, not new agents.
- LOs (r/loanoriginators): "extreme downturn", layoffs, and a bleak Fannie Mae 2027 forecast. LOs also raise compliance concerns about pasting borrower data into ChatGPT or Claude under the FTC Safeguards Rule ([thread](https://www.reddit.com/r/loanoriginators/comments/1xmcavh/los_be_honest_is_ai_actually_saving_you_time_yet/)).
- Rates above 7% (7.40% per a Realtor.com figure cited in an [Admiral Markets preview](https://admiralmarkets.com/analytics/traders-blog/us-existing-home-sales-september-2026)). Not verified against a primary source.

## 2. Competitors (live pricing pages unless marked)

| Vendor | What | Price (verified live 2026-11-10) |
|---|---|---|
| [Follow Up Boss](https://www.followupboss.com/pricing) | CRM | Grow $69/user/mo; Pro $499/mo (10 users); Platform $1,000/mo. **"No additional charge for AI features."** Calling add-on $39/user on Grow |
| [Lofty](https://lofty.com/pricing) | CRM + AI agents | All plans "Request Pricing". AI Sales, Social and Homeowner Agents are add-ons, price not shown. **20% ad management fee**; $70/mo home evaluation page |
| [Ylopo](https://www.ylopo.com/pricing) | Ads + AI text/voice | No prices shown ("scales to your market"). AI text in Solo; AI voice from Growing Team |
| [Structurely](https://www.structurely.com/pricing) | AI ISA voice/SMS | Usage only: voice from $0.07/min, SMS $0.02, email $0.02. Platform fee not shown. Third-party sites say $499/mo + $1,500 setup (not verified) |
| [Curaytor](https://www.curaytor.com/pricing) | Done-for-you marketing | $1,300/mo (the page also shows $1,299 and $1,399) |
| [MyOutDesk](https://www.myoutdesk.com/pricing/) | Human VAs / ISAs | From $1,988/mo managed; from $2,500/mo specialized |
| [Virtual Staging AI](https://www.virtualstagingai.app/prices) | AI staging | $16/mo (6 photos) to $79/mo (150 photos); $0.53–2.67 per photo |
| [BoxBrownie](https://www.boxbrownie.com/pricing) | Human-QA'd editing | Staging $30/image; enhancement $2; day-to-dusk $5; floor plans $30–40 |
| [ListingAI](https://www.listingai.co/pricing) | Descriptions, videos, CMA, staging | Free; $19, $36, $150/mo. Includes listing descriptions, social, motion videos, CMA |
| [Write.Homes](https://write.homes/pricing) | AI copy | $25/mo agent; $250/mo team; $1,500/mo brokerage |
| [AutoReel](https://www.autoreelapp.com/pricing) | Photo-to-video | $30/mo (20 videos/yr) to $82/mo (100/yr); $10–18/video |
| [VideoTour.ai](https://videotour.ai/pricing) | Photo-to-video | Free (1 video); $29/mo (10); $59/mo (40); $99/mo (200) |
| [RealEstateContent.ai](https://www.realestatecontent.ai/pricing) | Social autopilot (self-serve) | $119/mo or $999/yr. Includes AI Twin video and image-to-video |
| [Homebot](https://homebot.ai/pricing) | LO/agent nurture | LO $125, $225, $300/mo + $100 setup |

Search-snippet prices (not verified on the vendor page): TC $300–600 per file ([Paperless Pipeline](https://www.paperlesspipeline.com/blog/?p=5043), [ListedKit](https://www.listedkit.com/transaction-coordinator-cost-calculator)). ZipISA AI $69–149/mo ([source](https://completeaitraining.com/news/zipisa-launches-ai-inside-sales-agent-for-real-estate/)). Real Geeks Geek AI text $49/mo on a $399/mo platform. A "Social Content Hub" with 4 edited reels for $147/mo ([stan.store](https://stan.store/racheladamslee/p/social-content-hub?lang=en)). Seller-lead ad management at $2,000/mo.

**What is bundled free or near-free:** AI text and follow-up (FUB, Lofty, Ylopo, Real Geeks). Listing descriptions (ListingAI free tier, ChatGPT). Photo-to-video ($29/mo). Most brokerages provide a CRM and website. Any service that is only "AI does X" competes with $0–$36 a month.

## 3. Margin (honest hours, $40/hr loaded)

| Offer | Price | Tools/mo | Hours | Cost | Gross margin |
|---|---|---|---|---|---|
| Listing Video Kit (3 verticals + 5 ad variants + captions + AB 723 disclosure) | $149/listing | ~$10 (video gen credits, Claude) | 1.25h (build 0.5, QA 0.5, revisions and comms 0.25) | $60 | **60%** |
| Content retainer (8 vertical videos/mo + captions + calendar) | $597/mo | ~$60 | 5.5h (plan 1, edit/QA 3, client 1.5) | $280 | **53%** ($497 would give 47%, which fails) |
| Seller and listing Meta ads + creative (client pays spend) | $1,000/mo, 3-month minimum | ~$50 | Month 1: 10h. Ongoing: 5h (2 creative, 1.5 optimise, 1.5 report/call) | $450 / $250 | **55%** month 1; **75%** ongoing |
| AI ops sprint for teams (FUB/Lofty workflows + Claude skills) | $2,500 setup + $300/mo | ~$30 | 30h setup; 3h/mo | $1,230 / $150 | 51% setup; 50% ongoing |

## 4. Watering holes (named)

- **Upwork** job feed: the ~40 video posts and ~14 ads posts above. Many are long-term.
- **Meta Ad Library**: search "just listed", "home value" and "sold" by state to find teams already paying for ads. Long-running ads mark committed spenders. Our ad tool already reads this.
- **LinkedIn jobs**: teams hiring a content creator, marketing coordinator or videographer (e.g. Keller Williams Houston Preferred, HomeServices of America offices, Utah Life Real Estate Group, Mission Realty). These are budget holders for a salary-sized role.
- **Reddit** r/realtors (strict no-promotion Rule 1; read only, do not pitch), r/RealEstateTechnology, r/loanoriginators.
- **Industry events and lists** (not verified this run): RealTrends Verified team rankings (public list of top teams), Inman Connect, Tom Ferry and Keller Williams events, local Realtor association and MLS meetings, and the Lab Coat Agents Facebook group (size not verified).
- **CRE**: Colliers, SRS and Newmark hiring marketing and brokerage coordinators on LinkedIn. OM designer posts on Upwork.

## Attention scan (30 days): sellers vs buyers

Meta Ad Library (US, active) for "AI for realtors" and similar terms shows many **sellers**: Top AI Tools for Realtors, VideoTour.AI, AutoReel, LoanOfficer.ai, RealEstateContent.ai, School of Content (20 ads), MoshBari (14), Tony Cruz (coaching), agents selling "AI infrastructure" to other agents, and two vendors selling "rank in ChatGPT" for agents. Several Upwork posts come from **AI tool vendors hiring UGC creators or sales reps** to sell to agents (Propshift, Regent). These are seller signals, not buyer demand. Reddit r/realtors and r/RealEstate both have rules against AI-generated posts. Agents complain about AI-altered listing photos.

## Offers to avoid

1. **AI listing description writer.** Zero standalone asks. Free in ChatGPT; ListingAI $0–19; Write.Homes $25.
2. **AI virtual staging resale.** $0.53–2.67 per photo SaaS. Demand comes from photographers who already use the tools. California AB 723 (effective Jan 1, 2026) requires disclosure plus a link to originals ([The Real Deal](https://therealdeal.com/san-francisco/2026/01/26/ab-723-takes-effect-cracking-down-on-fake-listing-photos)). Agents on Reddit mock over-staged photos.
3. **AI voice/text ISA for agents.** Bundled in Ylopo, Lofty, FUB and Real Geeks. Upwork asks come from wholesalers. Agents hire human ISAs at $5–15/hr and voice distrust of bot calls ("Do you like getting AI bot calls?"). Outbound AI calling also carries TCPA and consent risk (not researched in depth here).
4. **"AI for realtors" courses and coaching.** Heavily advertised (School of Content, coaches) with no buyer asks. Selling the course is attention, not demand.
5. **Website chatbots, "rank me in ChatGPT" (AEO) for agents.** One ask vs several advertisers.
6. **Standalone CRM setup.** $150–350 budgets.
7. **Mortgage-first offers right now.** LO market is down, and borrower-data compliance adds friction.

## Recommended offers

### Offer A (✅): Listing Video Kit, per listing, for teams
- **Buyer:** Residential teams and listing-heavy agents (5+ listings a month), luxury especially. The Scottsdale team post is the archetype.
- **Deliverable (48-hour turnaround):** From MLS photos plus any clips, 3 vertical videos: a 15-second hook, a 30–45 second tour and a "why this neighbourhood" piece. Plus 5 Meta ad variants modelled on long-running listing ads from the Ad Library. Plus captions, on-screen text and an AB 723 disclosure overlay where needed. No filming required.
- **Price:** $149 per listing. Bundle of 5 for $599. This sits above $29/mo self-serve tools and far below the $400 videographer.
- **Margin:** 60% (table above).
- **First 10 clients:** (1) Apply to the ~40 Upwork video posts with a free sample made from the poster's own public listing. (2) Meta Ad Library: find teams running "just listed" ads in 3 metros. Build an unsolicited sample from one of their live listings (prepare only; contact is a human decision). (3) LinkedIn: teams with an open content-creator or videographer role; position the kit as covering listing video while they hire. (4) RealTrends top-team lists by state.
- **Biggest risk:** Price pressure from $29/mo tools and $25/video freelancers. Some buyers reject AI-looking video. Mitigate with real clips when available and human QA, and sell the ad variants plus speed, not "AI".

### Offer B (✅): Content retainer for producing agents and teams
- **Buyer:** Agents in the top 22% tech-spend band (over $500 a month) and teams of 3–15. Agents who post their own YouTube or reels and want them edited (about 10 such posts).
- **Deliverable:** 8 vertical videos a month. A mix of listing kits, a weekly zip-code market update (price cuts and sold-to-list data, the format a Reddit agent says drives referrals) and edits of the agent's own talking-head clips. Plus captions, a content calendar and one monthly ad-ready cut.
- **Price:** $597/mo, 3-month minimum. Add-on: YouTube long-form edit at $150 each.
- **Margin:** 53%.
- **First 10 clients:** Upwork long-term editor posts (several are 30+ hrs/week or ongoing). Convert 2–3 Offer A clients. Teams hiring marketing coordinators.
- **Biggest risk:** Churn in the slow season (Nov–Feb) and commission-driven budgets. Mitigate: sell in January for spring listing season and tie content to listing wins.

### Offer C (🟡 research slot): Seller and listing Meta ads with fresh creative, for teams and brokerages
- **Buyer:** Teams and brokerages losing portal leads (Zillow Flex, Realtor.com changes). Brokerages recruiting agents.
- **Deliverable:** Home-value and seller campaigns plus "just listed" campaigns. A new creative batch every 2 weeks from our Ad Library remix tool. Lead routing into FUB or Lofty with an instant text (FUB AI is free; we configure it, we do not resell it). Monthly report.
- **Price:** $1,000/mo plus ad spend (client pays Meta directly). 3-month minimum. Below Curaytor ($1,300) and a $2,000 seller-lead service; no 20% fee as at Lofty.
- **Margin:** 55% in month 1, 75% ongoing.
- **First 10 clients:** The ~14 Upwork ads posts. Meta Ad Library teams with ads that stopped (they tried and quit). Reddit LSA and Google threads show agents already spend $500+/month; read only. Upsell Offer A clients.
- **Biggest risk:** Meta's Housing special ad category limits targeting (no zip, age or gender targeting; minimum radius). Seller-lead quality is poor, and agents blame the vendor. Fair-housing compliance applies. Upwork demand is under 20, so validate with 3 paid pilots before scaling.

### Not recommended now, but watch
- **AI ops sprint for teams of 10+** ($2,500 + $300/mo): about 11 asks. Strong fit for Claude Code skills (listing prep, CMA drafts, FUB workflows), but budgets are thin and CRMs keep bundling AI.
- **CRE OM and marketing automation** for small CRE brokerages: bigger tickets (an OM studio charges about $1,750/mo, per snippet), but only about 7 asks.

## Seasonality

Late 2026 is the slow season. Agents on Reddit say "this time of year slows up". Listing volume drops until about February. Sell Offer A and B in December and January ahead of spring listings. Push Offer C hardest from January to April. Weak portal leads and high rates push agents toward sphere and owned channels, which favours content and owned ads over lead-response tools.

## What was not verified

- Exact 60-day totals (Google does not reliably date Upwork pages).
- Ylopo, Lofty and Structurely platform prices (not public).
- TC and ad-agency prices beyond search snippets.
- Facebook group sizes.
- LinkedIn totals (the endpoint returns 30 cards per query).
- Rates and the October 2026 NAR sales data (the release is due Nov 12, 2026).
