# Niche Scorecard: "Bid radar" on changedetection.io (Gate 0)

2026-11-10 · Offer: watch 30-100 public procurement portals and send a daily digest of bids matching the client's trade. Buyers: commercial contractors, janitorial, landscaping, IT integrators. Price in the video: $500 setup + $350/mo ("a lowball").
Sources: LinkedIn jobs via treg (US, posted in the last month, page-capped samples), Google index of Upwork job pages via treg (past year, 3 queries, ~6 pages), Reddit search via treg (past year, 2 queries, 50 posts), live vendor pricing pages, third-party pricing round-ups where the vendor page blocked us.

| Check | Result | Evidence |
|---|---|---|
| 1. Buyers asking (20+) | ❌ FAIL | Tight: ~5 Upwork posts in a year, ~6 Reddit asks in a year. Loose: ~10 "bid coordinator" job titles in a 60-row 30-day LinkedIn sample, but those roles write proposals too. |
| 2. Competitors with live prices | ⚠️ PASS, but they cap the price | HigherGov $500/yr with state and local alerts; BidNet Direct $599/yr per state; ConstructConnect $129/mo. 10+ aggregators exist. |
| 3. Margin ≥50% at $350/mo | ⚠️ BORDERLINE | 53% at 3 h/mo upkeep, 25% at 5 h/mo. Hours are estimates. |
| 4. Named watering holes | ✅ PASS | See section 4. |

## The repo
[dgtlmoon/changedetection.io](https://github.com/dgtlmoon/changedetection.io): real, 35.7k stars, Apache-2.0. It watches pages, can run "Browser Steps" (log in, click) before a check, and sends alerts through apprise (email, Slack, etc.). The hosted version is [$8.99/mo for up to 5,000 watches](https://changedetection.io/). It detects page changes. It does not parse bids, judge fit, or read addenda. That part is your labor or an LLM step.

## 1. Buyers asking
**Upwork (Google index, past year; posting dates not verified, job IDs are in the recent range).** Tight, meaning "find bids for us":
- [Government Bid Researcher & Procurement Analyst](https://www.upwork.com/freelance-jobs/apply/Government-Bid-Researcher-Procurement-Analyst_~022117633514157796313/): "source, summarize, and track federal, state, and local contract opportunities daily". This is the exact deliverable.
- Vendor Registration & Bid Specialist (Upwork job ID 022118092819) for Royal Service Cleaning, a janitorial company: "help us find commercial and government contracts". This is a pilot; "ongoing monitoring [is] not included".
- Government RFP & BID Coordinator (ID 022117669013): research opportunities, then write the bids.
- Procurement Portal & RFP Specialist (ID 022117431748): "monitor the status of all active bids".
- Bid Support Specialist, IT sector (ID 022112117045): "identify tender opportunities".

Loose: SAM.gov bid assistant, an RFP proposal lead, a consulting tender business-development role, and a cleaning-company cold caller. **Tight ≈5 and loose ≈10 in a year. That is far below 20 in 60 days.** Most of these buyers want a person who finds the bid and then writes it. Finding alone is the cheap half.

**Job boards (LinkedIn, US, last 30 days, via treg).** A "bid coordinator" search hit its 6-page cap at 60 rows. About 10 had "bid" in the title (Trane, Key Construction, IES Mission Critical, LMC, Generac…), and 17 were "Proposal Coordinator". A "construction estimator" search hit its cap at 40 rows. Estimators price jobs; they do not mainly find bids. So the video's lead source (estimator job posts) is aimed at the wrong role. The role whose job includes finding bids is the bid or proposal coordinator, and it is mid-size and large firms that hire one.

**Reddit (past year).** Asks: [Losing my mind checking state and local bid listings](https://www.reddit.com/r/GovernmentContracting/comments/1s3m54x/), [Best sites for bidding on commercial cleaning contracts?](https://www.reddit.com/r/cleaningbusiness/comments/1vnilgv/), [Apps for Gov Contracts?](https://www.reddit.com/r/smallbusiness/comments/1x7rxw0/), [Are bids this difficult to find anywhere else?](https://www.reddit.com/r/Contractor/comments/1wsf59m/), [IT services vendors: how do you find tenders?](https://www.reddit.com/r/procurement/comments/1x448m1/), and [AI tools for finding federal construction contracts?](https://www.reddit.com/r/govcon/comments/1sq90xz/). Answers in these threads point people to software. Two posts are from builders already selling the exact "daily bid alert" ([r/cleaningbusiness](https://www.reddit.com/r/cleaningbusiness/comments/1vivkb9/), [r/landscaping](https://www.reddit.com/r/landscaping/comments/1vivnqp/)).

**Budgets.** No budget amounts were visible in the snippets (not verified).

## 2. Competitors (live prices)
- **HigherGov**: [Starter $500/yr, Standard $2,500/yr](https://www.highergov.com/pricing/), with "State and Local Opportunities" and unlimited alerts. That works out to about $42/mo.
- **BidNet Direct**: $599/yr for one state, $1,199 for three, $1,999 nationwide, and a free tier for member-agency bids. The live page returned 403; prices come from [Civic IQ, captured 2026-08-26](https://civiciq.com/blog/civic-iq-bidnet-direct-pricing).
- **ConstructConnect Project Intelligence**: [$129/mo per market, month to month](https://www.constructconnect.com/pricing); Professional is about $199/mo on an annual contract.
- **BidPrime**: $4,600-9,500/yr from its plan PDF, per [Gov Contract Finder](https://govcontractfinder.com/tools/government-contracting-software-pricing-guide). GovWin IQ, GovSpend and SamSearch quote on request. Periscope S2G, GovDirections, Bid Control and BidHits also exist. **More than 10 aggregators means the market is saturated.**
- **DIY**: Visualping and Pagecrawl watch single tender pages. An [Apify SLED bid actor](https://apify.com/talcoe/us-government-bids-rfps) charges per result.

The cheapest aggregator covers thousands of agencies for about $42-50/mo. A $350/mo service that watches 30-100 portals has to justify a 7-8x premium. The only defensible gap is portals the aggregators miss (small towns, school districts, utilities, private GCs' plan rooms) plus human fit-screening.

## 3. Margin at $350/mo (hours are estimates, not measured)
- Tools: changedetection hosted $8.99 + LLM filtering ~$5 (estimate) ≈ $14.
- Upkeep: portals redesign, captchas appear, logins expire. Many portals (Bonfire, PlanetBids, OpenGov) need vendor registration and logins per client. Add digest QA and one client call.
- At 3 h/mo × $50 loaded: (350 − 14 − 150) / 350 = **53%**.
- At 5 h/mo: (350 − 14 − 250) / 350 = **25%**.
- Setup: $500 for 30-100 portals. At 10-20 h × $50 = $500-1,000, so setup is break-even or a loss.

It passes only if upkeep stays under about 3.3 h/mo per client.

## 4. Watering holes
r/GovernmentContracting, r/cleaningbusiness, r/landscaping, r/Contractor, r/estimators; ISSA (janitorial trade body); NALP (landscape pros); APEX Accelerators (formerly PTACs), which run free govcon training for small firms; NIGP and agency "vendor outreach" days. Public vendor lists: the SAM.gov entity registry and state DBE/MBE/HUB directories, filtered by NAICS 561720 (janitorial) or 561730 (landscaping). Companies currently posting "bid coordinator" or "proposal coordinator" jobs.

## Attention (30-day)
Reddit has a steady stream of founders posting "I built a daily bid alert". Vendors such as SamSearch, ConstructionBids.ai and GovDirections publish SEO content for janitorial and landscaping bids. Seller attention is high and buyer asks are low.

## The video's claims vs the evidence
- "$350/mo is a lowball": **not supported.** Software covering every state sells for $42-166/mo.
- "Lead: estimator job posts": **the wrong role.** Estimators price jobs; bid or proposal coordinators find bids, and they also write proposals.
- The repo is real and can log in and watch pages. But "monitor 100 portals" with changedetection means maintaining 100 brittle watches, each needing parsing and filtering.

## Verdict: ❌ REJECT (fails check 1; check 2 caps the price)
The tight demand count is about 5 a year on Upwork. Buyers who search for this find $500-600/yr aggregators. Margin passes only with very low upkeep.

**Better angle:** sell bid-finding plus a bid/no-bid summary to one trade in one metro. Example: janitorial firms in one state, covering the school-district, housing-authority and utility portals the aggregators miss, priced at $150-200/mo next to their BidNet subscription. Or bolt it onto proposal writing, which is the half buyers actually post for. Validate first with 10 calls to janitorial owners on r/cleaningbusiness or in ISSA groups.
