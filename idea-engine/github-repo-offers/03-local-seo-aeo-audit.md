# Niche Scorecard: $499 local SEO + AI-search audit, then $199/mo "visibility scorecard", for local service businesses, built on OpenSEO (Gate 0)

**Date:** 2026-11-10
**Offer as pitched (Corey's video):** use OpenSEO to sell dentists, law firms, HVAC and med spas (5–30 staff, metro, already paying for SEO or ads) a $499 SEO + AEO/GEO audit. Then sell a $199/mo 2-page report: 30 keyword rankings, Google clicks, top 3 competitors, Google Business Profile (GBP) audit, AI-search mentions, 3 fixes. Sold by cold email showing the 3 worst findings. Called "the most beginner-friendly offer".

**Sources and samples:**
- Reddit (treg `anyapi.reddit.subreddit_search` and `anyapi.reddit.search`): 17 searches, about 300 post titles and bodies read. Subreddits: r/LawFirm, r/Dentists, r/hvacadvice, r/HVAC, r/MedSpa, r/smallbusiness, r/localseo. Window: 2026-09-10 to 2026-11-10. Older posts are noted as such. r/Dentistry and r/sweatystartup returned "not found" from the API.
- Upwork: category pages scraped live via treg `anyapi.web.scrape` (SEO Audit, Local SEO, SEO, Google My Business, SEO Reports). Each shows the ~10 newest jobs (1–5 days old). Older single job pages expired or returned 403. Those came from web search snippets, and their dates are not verified.
- Fiverr: 3 search pages scraped live ("local seo audit", "ai visibility audit", "dental seo audit"). About 120 gig cards were parsed for price and review count.
- Google US keyword volume (treg `serpstat.google.keywords.volume`): 18 keywords.
- YouTube (treg `crawl4ai.youtube.search.videos`): 5 searches, 100 videos.
- Live pricing pages: BrightLocal, Local Falcon, Whitespark, AgencyAnalytics, Otterly, OpenSEO, plus two productized audit sites. The OpenSEO GitHub repo was also read.
- Web search: about 12 queries.
- **Gaps:** Reddit and Upwork job pages cannot be opened directly, so comment threads were not read. Profound and Semrush Local show no public price on the pages fetched.
- **treg spend:** $0.036 across 42 calls (summed from each call's `charged_micro`). The team balance went from $9.37 to $9.16, but other agents share it, so the balance change overstates this run's spend. Cap was $0.75.

| Check | Result | One-line evidence |
|---|---|---|
| 1. 20+ buyers asking | ❌ | Tight ≈ **6**, loose ≈ **22** in 60 days. **Zero** owners asked for a paid monthly third-party SEO report. |
| 2. 3–5 competitors with public pricing | ✅ (hurts the price) | 7 verified. Tools run **$10–$41/mo** and BrightLocal's $41 tier already includes AI-visibility tracking. Productized audits sell for **$45–$300**. |
| 3. ≥50% gross margin | 🟡 conditional | Audit is 56% at 4 hr and 36% at 6 hr. Scorecard is 55% at 1.5 hr/mo with volume tool pricing, and 16% at 2.5 hr/mo with a $41 single-location tool. |
| 4. Named watering holes | ✅ | r/LawFirm, r/Dentists, Dentaltown, Dental Nachos (FB), r/MedSpa, r/smallbusiness, plus trade associations. |

## Gate 0 checklist

### 1. Buyers asking: ❌ FAIL (tight ≈6, loose ≈22; target 20+)

**Tight (a local service owner, the "is my SEO working / audit me" pain, roughly in the window):**
1. r/LawFirm, 2026-09-30: ["Am I wasting my time paying an SEO company? I can't get past 10th page on Google and I am competing in a major city."](https://www.reddit.com/r/LawFirm/comments/1wtsdw3/am_i_wasting_my_time_paying_an_seo_company_i_cant/) 40 comments. This is exactly the pitched pain.
2. r/Dentists, 2026-10-28: ["Dental Marketing Companies"](https://www.reddit.com/r/Dentists/comments/1xhf44o/dental_marketing_companies/). The owner bought a practice and is 6 months in with an agency doing SEO and ads. "My Google SEO looks the same as when I started." The ask is for a better agency, not a report.
3. r/hvacadvice, 2026-09-14: ["What is the simplest SEO tool to improve SEO and AEO for my HVAC Business?"](https://www.reddit.com/r/hvacadvice/comments/1wfvi4r/what_is_the_simplest_seo_tool_to_improve_seo_and/) The owner names ChatGPT and Gemini. This is AEO, but they want a **tool** (DIY).
4. Upwork, posted ~2026-11-08: "AI SEO / AEO / GEO Specialist for Local Dental Practice". **$96 fixed.** Seen live on the [Local SEO jobs page](https://www.upwork.com/freelance-jobs/local-seo/).
5. Upwork: ["SEO Audit for Local Business Website"](https://www.upwork.com/freelance-jobs/apply/SEO-Audit-for-Local-Business-Website_~022065856547179045006/). A search snippet says "posted 4 weeks ago" by a US client with $3.3K spent. Date and budget not verified (page 403).
6. Upwork: ["SEO/AEO Audit for Home Services"](https://www.upwork.com/freelance-jobs/apply/SEO-AEO-Audit-for-Home-Services_~022082202059685512663/). The snippet says "comprehensive SEO/AEO audit for our local, consumer-focused home services company". Date and budget not verified. The job ID is older than the live ones, so it is probably outside 30 days.

**Loose (local SEO/GBP/AEO work wanted, but the deliverable is implementation, or the buyer or vertical is off):**
- Upwork, live on category pages and 1–5 days old: "SEO & AI Search Optimization Expert Needed for U.S. Immigration Law Firm" (hourly); "Experienced SEO Expert Needed to Diagnose Declining Google Rankings" (hourly); "SEO and Google Ads competitor analysis for our company website" (**$50**); "Local SEO & GBP Expert for Bend, Oregon Landscaping" (**$350**); "SEO, AEO & GEO Specialist to Rank Us on Google and AI Search" (**$250**); "Local SEO Expert – Google Maps Top 3 for Pest Control" (hourly); "SEO | Local SEO & GBP Expert | GEO/AEO" (hourly); "GBP Specialist — Miami" (**$200** paid trial); "Google My Business Optimization for 34 Locations" (hourly); "Local Search Ranking Improvement" (**$10**); "SEO for Google Business Profiles" (**$25**); "SEO for Tow Truck Business" (hourly); "AEO/GEO/SEO Expert Required" (**$1,500**); "LLM Organic Ranking Expert" (hourly). Sources: Upwork [SEO Audit](https://www.upwork.com/freelance-jobs/seo-audit/), [Local SEO](https://www.upwork.com/freelance-jobs/local-seo/), [Google My Business](https://www.upwork.com/freelance-jobs/google-my-business/), [SEO Reports](https://www.upwork.com/freelance-jobs/seo-reports/) and [SEO](https://www.upwork.com/freelance-jobs/seo/) pages.
- Upwork, 2026-10-09: [Website + GBP + Local SEO for Painting company, $1,000](https://www.upwork.com/freelance-jobs/apply/Website-Google-Business-Profile-Local-SEO-for-Painting-Home-Services-Company_~022108600018707942780/) (search snippet).
- r/LawFirm, 2026-09-25: ["Is SEO Fake?"](https://www.reddit.com/r/LawFirm/comments/1wpzdui/is_seo_fake/). A PI firm owner is evaluating whether to spend on SEO at all. 85 comments.
- r/Dentists: ["Looking for new marketing firm"](https://www.reddit.com/r/Dentists/comments/1wootke/looking_for_new_marketing_firm/) (09-24, says "75pct of market is garbage"); ["Marketing companies suggestions [new practice owner]"](https://www.reddit.com/r/Dentists/comments/1x7nm5p/marketing_companies_suggestions_new_practice_owner/) (10-16, "No soliciting please").
- r/smallbusiness: ["How to be on the first page - Google"](https://www.reddit.com/r/smallbusiness/comments/1xpp8yb/how_to_be_on_the_first_page_google/) (11-06); ["Google Ads is impossible"](https://www.reddit.com/r/smallbusiness/comments/1xps31g/google_ads_is_impossible/) (11-06, 97 comments); ["Genuine question about agencies"](https://www.reddit.com/r/smallbusiness/comments/1xr1v8w/genuine_question_about_agencies/) (11-08, asks why dental/HVAC pay ad-agency retainers).

**Counter-signal worth weighing.** r/localseo, 2026-11-08: a Calgary implant-clinic owner is [hiring an independent SEO](https://www.reddit.com/r/localseo/comments/1xqkx72/clinic_owner_hiring_an_independent_seo_remote/) at $1k–2k CAD/mo. He wants someone to earn links and make decisions "**without selling me another audit first**". Owners in this segment are already audit-fatigued.

**AEO/GEO vs classic split.** Classic local SEO/GBP: ≈18 of the signals. AEO/GEO named by the buyer: ≈8 (HVAC tool ask, dental $96 job, home-services audit, immigration law firm, 4 generic Upwork GEO jobs). AEO buyers mostly want implementation ("rank us in ChatGPT"), not an audit. Older posts show the same pattern: r/LawFirm ["Is AI search optimization actually worth it"](https://www.reddit.com/r/LawFirm/comments/1six9n0/is_ai_search_optimization_actually_worth_it/) (2026-04, out of window).

**Monthly reporting demand: none found.** No owner in the window asked to pay a third party for a monthly SEO scorecard. The closest is out of window: r/MedSpa, 2026-03, a CMO wrote ["Agency reports were useless, so I built a 5-system attribution report myself"](https://www.reddit.com/r/MedSpa/comments/1rsa7q0/im_the_cmo_of_a_med_spa_doing_350kmonth_agency/). So the pain exists, but that owner solved it in-house.

**Search volume (Google US, Serpstat):** "seo audit" 4,400; "seo audit service" 1,600; "ai search optimization" 1,300; "dental seo" 1,300; "hvac seo" 720; "chatgpt seo" 390; "local seo report" 320; "local seo audit" 260; "aeo audit" 140; "ai seo audit" 110; "ai visibility audit" 70; "law firm seo audit" ~0. "seo audit for dentists", "dental seo audit" and "geo audit" returned no data. Most of these searchers are likely marketers, not owners.

**Fiverr (demand and saturation).** "local seo audit" returns **38,000+** gigs, with 5,300 in Local SEO and 1,800 in the Generative Engine Optimization category. "ai visibility audit" returns **52,000+** gigs. Review counts show that buyers do purchase:
- [complete SEO audit with AI search](https://www.fiverr.com/miranda_davis/website-seo-audit-report-keyword-research-and-competitor-analysis): $185, 162 reviews.
- "aeo and ai visibility SEO to rank you in chatgpt": $100, 598 reviews.
- "build ai visibility score…GEO aeo": $150, 373 reviews.
- "local SEO audit and google maps ranking action plan": $45, 1 review.
- "comprehensive local SEO audit and action plan": $50, 9 reviews.
- "dental SEO audit and on-page optimization": $75, 1 review.

Buyers buy at $45–$185, mostly website owners and agencies, not $499 dentists.

### 2. Competitors with public pricing: ✅ (7 verified). They set a low ceiling.

| Competitor | Verified price (live page) | What it covers |
|---|---|---|
| [BrightLocal](https://www.brightlocal.com/pricing/) | Track **$41/mo** for 1 location ($31/mo annual). Managed SEO from $499/mo. | 100 keywords, 4 competitors, GBP audit, and a **Local AI Visibility Tracker** included |
| [Local Falcon](https://www.localfalcon.com/pricing) | Starter **$24.99/mo** (7,500 credits), up to $199.99/mo | Geo-grid map rank scans. Lists "AI Visibility Tracking" (per-plan detail not shown) |
| [Whitespark](https://whitespark.ca/pricing/) | Local Rank Tracker **$14–$200/mo**. SEO services $499–$1,999/mo | Local rank tracking, citations, reviews ($79/mo/location) |
| [AgencyAnalytics](https://agencyanalytics.com/pricing) | **$20/client/mo** (annual). Rank tracker +$41.67/mo per 500 kw. AI Tracker +$20.83/mo | White-label client reporting dashboards |
| [Otterly.AI](https://otterly.ai/pricing) | Lite **$29/mo** (15 prompts). Standard $189/mo (100 prompts) | AI-search mention tracking |
| [OpenSEO hosted](https://openseo.so/pricing) | **$10/mo** (includes $10 usage). Pro $30, Agency $100 | Keywords, rank checks (≤1.5¢/kw), AI prompt checks (~$0.002 each), site audit |
| Productized: [tariqmkhan Local SEO Audit](https://tariqmkhan-com.pages.dev/services/local-seo-audit) | **$300** one-time + **$200/mo** management | GBP 20-point audit, NAP on 15 directories, top-3 competitor gap, PDF and call |
| Productized: [Local Growth Insights (dental)](https://localgrowthinsights-website.pages.dev/services.html) | **$147** audit. $247 GBP fix. $297/mo reviews. $1,497/mo full | Dental GBP scorecard + **AI visibility score** + top-5 competitors |

Not verified: Profound and Semrush Local (no price on the pages fetched). An Upwork "Dental SEO Agency Audit" at $150/$250/$350 appears only in a search snippet.

**What the $199/mo scorecard competes with:**
1. **Free.** GBP Performance insights and Search Console already show calls, clicks and queries.
2. **The client's own agency report.** They already pay for it, and the owner would have to pay twice.
3. **$41/mo BrightLocal**, which bundles rankings, competitors, GBP audit and AI visibility.

The only thing $199 buys over these is a human reading the data and naming 3 fixes. The $499 audit is 3–10× the Fiverr and productized market ($45–$300).

### 3. Gross margin ≥50%: 🟡 CONDITIONAL

Assumptions: $50/hr loaded labor (midpoint of $40–60). Data costs are from OpenSEO's published rates. OpenSEO has **no GBP or local map-grid feature** (see section 5), so I add BrightLocal Track at $41/mo for the local pieces.

**$499 audit (one time):**
- Data: 30 keyword lookups × $0.05 = $1.50. 30 rank checks × $0.015 = $0.45. 40 AI prompt checks × $0.002 = $0.08. Backlink overview $0.08. Site audit: not priced on the page, assume ≤$1. **≈ $3.**
- Tool share (OpenSEO $10 + BrightLocal $41 spread over ~3 audits/mo): **≈ $17.**
- Labor: 4 hr (crawl review, GBP check, competitor check, AI prompts, write-up, call) = $200. At 6 hr = $300.
- **GM at 4 hr: (499 − 3 − 17 − 200) / 499 = 56%.** At 6 hr: (499 − 320) / 499 = **36%**.
- Not counted: the free "3 worst findings" mini-audit in every cold email. At 15 min each and a 1% close rate, that is ~25 hr ($1,250) of pre-sale work per closed audit. That is acquisition cost, not COGS, but it wipes out the audit's profit.

**$199/mo scorecard (per client):**
- Data: 30 kw × 4 weekly checks × $0.015 = $1.80. 10 prompts × 4 engines × 4 weeks × $0.002 = $0.32. **≈ $2.**
- Tools per client (BrightLocal Track $41 for 1 location, or ~$11/loc on the 6–10 location tier, plus an OpenSEO share): **$12–$41.**
- Labor: 1.5 hr (pull data, 2-page report, 3 fixes, email) = $75. At 2.5 hr = $125.
- **GM at 1.5 hr and $12 tools: (199 − 2 − 12 − 75) / 199 = 55%.** At 2.5 hr and $41 tools: (199 − 168) / 199 = **16%**. For 50%, labor must stay under ~1.7 hr/mo with tools at volume pricing.

Passes only if the report is templated and automated. That is possible, but not on day one for a beginner.

### 4. Watering holes: ✅

- **Reddit:** [r/LawFirm](https://www.reddit.com/r/LawFirm/) (owners debate SEO vendors monthly: "Should I fire my SEO team?" 2026-02, "Is SEO Fake?" 2026-09). [r/Dentists](https://www.reddit.com/r/Dentists/) (several "marketing company" threads per month). [r/MedSpa](https://www.reddit.com/r/MedSpa/). [r/smallbusiness](https://www.reddit.com/r/smallbusiness/). [r/hvacadvice](https://www.reddit.com/r/hvacadvice/) is mostly homeowners, and r/HVAC is technicians, so neither is a good HVAC-owner channel. [r/localseo](https://www.reddit.com/r/localseo/) is mostly sellers.
- **Dental:** [Dentaltown](https://www.dentaltown.com/), which runs its own posts on ChatGPT visibility for practices. **Dental Nachos** Facebook group ([~35k–67k members per sources](https://us.dental-tribune.com/news/benco-dental-and-dental-nachos-create-innovative-network-of-c-e-resources/); current count not verified). State dental societies and the AGD (membership not verified).
- **Law:** ABA Law Practice Division, state-bar solo/small-firm sections, and Lawyerist's community (known, not verified live this session).
- **HVAC:** ACCA, PHCC, and Service Nation Alliance (known, not verified live).
- **Med spa:** American Med Spa Association (AmSpa) (known, not verified live).
- r/Dentists posters explicitly write "No soliciting please" and "don't DM". These are places to listen, not to pitch.

## Attention signal (30-day)

**Sellers far outnumber buyers.**
- **YouTube, last ~30 days:** "How to sell AI visibility audits and turn them into recurring revenue" (My Web Audit, 3 weeks), "How I use Claude Opus 5.5 to Sell AI SEO To Local Businesses" (2 weeks), "AI GEO Audit Service — Client Gig" (9 days), "Get Found in ChatGPT: Sell GEO Services for $350–$1,500/mo" (3 weeks), "How to Make Money Selling SEO Services to Local Businesses with AI" (11 days), "This Free Google Audit Wins Local SEO Clients" (1 day), and "Workbench SEO" live AI SEO audits (2 weeks).
- **Older but big:** Jason Wardrop's "Sell AI Automation to Local Businesses" (314k views), Chris Koerner's "Easiest Way to Sell AI to Businesses" (84k), Pavlo's "Build This Once → Sell It to Every Local Business ($297/mo)" (7k, 3 months).
- **Counter-voice:** Nick Saraev's "Why I Don't Sell AI to Local Businesses" (109k views).
- **OpenSEO itself is trending with builders.** About 15 videos in 4 months ("OpenSEO - Open Source Semrush Alternative", 20k views; Julian Goldie; "I Cancelled My $455/Month Semrush"). The official channel is posting weekly.
- **Vendors now sell white-label AI-visibility audits to agencies:** HiBot, White Label IQ, Visiblie and My Web Audit. Many free AI-visibility checkers exist ([Insites](https://insites.com/resources/free-ai-visibility-audit/), [Digital Success](https://www.digitalsuccess.us/aio-geo-audit-ai-citation-checker-free-tool.html)).
- **Copycat sites:** Web search turned up multiple fresh `*.pages.dev` local-audit storefronts ([rankpulse](https://rankpulse.pages.dev/), [localgrowthinsights](https://localgrowthinsights-website.pages.dev/), [tariqmkhan](https://tariqmkhan-com.pages.dev/services/local-seo-audit), [sas-landing-pages](https://sas-landing-pages.pages.dev/) with a "$497 value, yours free" report). These are the signature of course students running this exact play.
- **Buyers, by contrast:** ~6 tight posts in 60 days across four verticals. On r/localseo, most "audit" threads in the window are sellers sharing prospecting checklists ("My quick GBP audit checklist for prospecting local businesses", 2026-11-09).

**Read:** the owner's inbox already gets "here are 3 problems with your site" emails. A free audit is the market's default lead magnet, so a paid $499 one is swimming against it.

## What the video gets right / wrong

| Claim | Evidence | Verdict |
|---|---|---|
| OpenSEO is a real, cheap Semrush alternative | Real. [github.com/every-app/open-seo](https://github.com/every-app/open-seo) has **27.1k stars and 3.7k forks**, MIT license. It does keyword research, rank tracking, backlinks, site audits and AI visibility (prompt tracking), with an MCP server. Hosted plan is [$10/mo](https://openseo.so/pricing), or self-host with a DataForSEO key. | ✅ Right |
| OpenSEO can produce the full scorecard | OpenSEO's README and pricing page list **no GBP audit, no local map-pack/geo-grid tracking and no review data**. Those are half the deliverable. You need BrightLocal or Local Falcon, or manual checks. Google clicks need the client's Search Console access. | ❌ Overstated |
| Local owners already pay for SEO and are unhappy with reporting | Supported. r/LawFirm "Am I wasting my time paying an SEO company?", r/Dentists "6 months in… SEO looks the same", r/MedSpa "agency reports were useless". | ✅ Right (pain is real) |
| They will pay $199/mo for a separate report | No buyer asked for this in 60 days. BrightLocal at $41/mo includes AI tracking. The owner's fix is to switch agencies or hire an implementer, not to buy a second report. | ❌ Not supported |
| $499 is a fair front-end audit price | The market sells audits at $45–$185 (Fiverr, hundreds of reviews) and $147–$300 (productized). Upwork local-audit budgets seen live run **$50–$350**. A 2026 [pricing guide](https://www.gtm8020.com/blog/geo-audit-cost.md) puts automated GEO scans at $99–$499. | ❌ High for a commodity |
| AEO/GEO is a hook buyers ask for | Some. Owners ask "should I bother?" (r/LawFirm) and "simplest tool for AEO?" (HVAC). An Upwork dental AEO job pays **$96**. Real curiosity, low willingness to pay. | 🟡 Partly |
| Most beginner-friendly offer | Easy to deliver, so it is also crowded: 38k–52k Fiverr gigs and many course students. Beginners lack the proof to sell $499 cold to a dentist who is "not accepting DMs". | ❌ Easy to start, hard to sell |

## Verdict: ❌ REJECT (as pitched)

**Deciding reason:** Gate 1 fails. There are ~6 tight buyer signals in 60 days, not 20, and **zero** for the $199/mo report itself. Meanwhile the deliverable is sold for $45–$300 by thousands of Fiverr sellers and fresh course-student storefronts, and BrightLocal sells the scorecard's data, AI tracking included, for $41/mo. Margins work only if the report is automated. The free "3 worst findings" cold-email audit is what everyone already sends.

**A better-angled version (🟡 research slot, not validated):** an **"SEO agency accountability review" for dental practices paying an agency $1.5k+/mo.**
- **Buyer:** the owner in r/Dentists "Dental Marketing Companies" and r/LawFirm "Am I wasting my time".
- **Deliverable:** a one-time, independent second opinion. What the agency was paid, what it actually shipped (pages, links, GBP changes), rank/map-grid and AI-mention movement since signing, and a keep/fix/fire recommendation with a contract-question checklist.
- **Price:** $300–$500 one-time, with a no-upsell promise. That removes the "audit is a sales trick" objection the Calgary clinic owner raised.
- **Back end:** a $247–$497 GBP fix pack or referral fees, not a $199 report.
- **Channel:** Dentaltown and Dental Nachos content, not cold email.
- **To validate first:** find 20+ "is my agency doing anything" posts from dentists or law firms over 90 days. Then test 10 conversations before building anything.
