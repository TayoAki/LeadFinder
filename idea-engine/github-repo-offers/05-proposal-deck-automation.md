# Niche Scorecard: Branded proposal-deck automation on Presenton (Gate 0)

**Offer under test:** Turn a company's brand deck into a Presenton template. A rep fills a short form (or pipes in a call recording) and gets a branded, editable PowerPoint proposal the same day. Target: sales teams sending 20+ custom proposals a month (contractors, agencies, staffing, events, commercial real estate; 20-200 staff; buyer VP Sales / Sales Ops). Price: $2,500 setup + $200/month. Source: Corey's YouTube video (AI-services course seller).

**Date:** 2026-11-10

**Data sources, samples and windows**
- LinkedIn job index via treg (`anyapi.linkedin.search.jobs`), US, posted in the last month. 6 queries, up to 3 pages each, plus 6 single-page probes. **165 unique postings** pulled; **59 unique proposal/pursuit/bid roles at 54 companies**. 4 postings opened and read in full.
- Reddit search via treg (`anyapi.reddit.search`), timeframe = month, 12 queries (about 250 posts scanned; most were marriage proposals and Upwork bidding noise). Bodies of 8 relevant posts read.
- Upwork: web search with `site:upwork.com/freelance-jobs` for 4 phrasings, plus one extended search; direct fetch of Upwork search returned HTTP 403; treg has no Upwork endpoint. **Zero Upwork client job posts verified.**
- Live pricing pages fetched: PandaDoc, Proposify, Qwilr, Better Proposals, Beautiful.ai, Plus AI, Pitch, Claude API. Gamma's page returned 403 to both WebFetch and curl, so Gamma prices come from two third-party captures.
- Presenton: GitHub repo page, commit log, raw LICENSE and NOTICE files, official docs.
- treg spend: balance $9.37 before, $9.17 after = **$0.20** (under the $0.75 cap; the per-call prices listed add up to about $0.03, so the rest may be other usage on the shared team wallet).

---

## Gate 0 checklist

### 1. 20+ purchase-intent signals, consistent buyer/pain/deliverable: ❌ FAIL

| Signal type | TIGHT (matches buyer + pain + PPT sales-proposal deliverable) | LOOSE (adjacent) | Budget seen |
|---|---|---|---|
| Upwork client posts | 0 verified | 0 verified | Only seller gigs found, e.g. [HubSpot quote template gig $250-750](https://www.upwork.com/services/product/development-it-a-custom-quote-template-in-hubspot-1909324205322376460) |
| LinkedIn proposal roles (30 days) | 0 | 59 roles / 54 companies | Proposal coordinator pay about $66k/yr ([Payscale](https://www.payscale.com/research/US/Job=Proposal_Coordinator/Salary)); Kidder Mathews CRE marketing coordinator $35.09-37.50/hr ([posting](https://www.linkedin.com/jobs/view/marketing-coordinator-at-kidder-mathews-4455571897)) |
| LinkedIn CRE marketing coordinators (30 days) | 0 | 30 (Colliers, CBRE, Transwestern, Kidder Mathews, Marcus & Millichap, Cresa...) | not verified |
| LinkedIn event/hotel sales coordinators (30 days) | 0 | 30 | $24.04/hr at Crescent Hotels (from title) |
| Reddit buyer questions (30 days) | 1 | 5 | none stated |

**What the job posts actually show.** The "proposal coordinator / writer" lead source does not point at the buyer in the video:
- About 33 of the 59 proposal roles are at architecture, engineering and construction firms (Jacobs, Walsh, Kimley-Horn, HNTB, SOCOTEC, STO Building Group, Layton, Rycon, Garver, Hays Electrical, and others). Several are far above 200 staff.
- The 4 postings read in full are all **RFP/RFQ/qualifications responses for public or owner bids, not sales proposals**, and 3 of 4 require **Adobe InDesign**: [Rycon](https://www.linkedin.com/jobs/view/jr182-proposal-coordinator-at-rycon-construction-4484766285) (InDesign required; "proposals, qualifications, presentations, bid forms"), [Jamail & Smith](https://www.linkedin.com/jobs/view/proposals-marketing-coordinator-at-jamail-smith-construction-lp-4486790721) (InDesign required; RFQ/RFP/CSP and interview responses), [Hays Electrical](https://www.linkedin.com/jobs/view/proposal-specialist-at-hays-electrical-services-4486812480) (Word/PowerPoint required, InDesign preferred, Unanet/Cosential CRM; RFP/RFQ and prequal packages), [Kidder Mathews](https://www.linkedin.com/jobs/view/marketing-coordinator-at-kidder-mathews-4455571897) (InDesign for proposal layout).
- PowerPoint shows up for **shortlist interview presentations**, not the main proposal. That is a narrow slice.
- The "staffing proposal" query returned 30 recruiter and business-development jobs and **no** proposal roles. The staffing vertical showed no hiring signal for proposal production.
- These are cost signals (a $50-87k salary the offer could partly offset), not buyers asking for a deck generator.

**Reddit, last 30 days (relevant posts only):**
- TIGHT (1): r/automation, 2026-11-08, ["Getting carrier quotes into a proposal deck: where to start?"](https://www.reddit.com/r/automation/comments/1xqz7p9/) (22 comments). Insurance broker: 6-8 carrier quotes per client get retyped into a PowerPoint with one slide per policy type; Copilot is not reliable enough. This is a real PPT proposal pain, but the vertical (insurance/benefits broker) is not on the video's list.
- LOOSE (5):
  - r/AiAutomations, 2026-11-06, ["Is there an AI tool that can create proposals using my existing design/template?"](https://www.reddit.com/r/AiAutomations/comments/1xp5blf/). A freelance web developer who wants PDF output. Wrong size of buyer.
  - r/smallbusinessuk, 2026-11-03, ["What are we using for quotation/proposal software?"](https://www.reddit.com/r/smallbusinessuk/comments/1xmodv9/) (28 comments). A B2B firm that wants free or cheap quote software.
  - r/AI_Agents, 2026-10-28, ["Any slide generators that output normal powerpoint files?"](https://www.reddit.com/r/AI_Agents/comments/1xhjhem/) (22 comments). Gamma and Beautiful.ai PPTX exports break formatting. This supports the "editable PPTX" angle.
  - r/SalesOps, 2026-10-14, ["AI quoting tools look great in demo..."](https://www.reddit.com/r/SalesOps/comments/1x5scut/) (17 comments). The pain is CPQ pricing exceptions, not deck design.
  - r/PipedriveConsultant, 2026-11-02, Pipedrive + PandaDoc stage question. Shows teams already on PandaDoc.
- r/Construction, r/agency and r/sales: **zero** posts in 30 days about speeding up proposals.

**Verdict on gate 1:** 1 TIGHT signal against a bar of 20. Buyer, pain and deliverable are not consistent across sources.

### 2. 3-5 competitors with public, verified pricing: ✅ PASS (but the field is crowded and cheap)

| Tool | Format | Live price (USD unless noted) | Source |
|---|---|---|---|
| PandaDoc | Web doc + e-sign | Starter $19, Business $49/seat/mo (billed annually); CRM only on Business | [pandadoc.com/pricing](https://www.pandadoc.com/pricing/) |
| Proposify | Web doc + e-sign | Build $49/user/mo monthly or $39 annual; Grow $65; Scale $12,800/yr incl. 10 users | [proposify.com/pricing](https://www.proposify.com/pricing) |
| Qwilr | Web page proposals | Starter $35 (annual) / $49 (monthly); Growth $55 (5-seat min); Scale $75 (10-seat min) | [qwilr.com/pricing](https://qwilr.com/pricing/) |
| Better Proposals | Web doc | $13 / $21 / $42 per user/mo annual | [betterproposals.io/pricing](https://www.betterproposals.io/pricing) |
| Plus AI | Native PowerPoint/Slides | Team $30/user/mo annual ($40 monthly), with custom branding and templates; Enterprise builds templates from your masters | [plusai.com/pricing](https://plusai.com/pricing) |
| Beautiful.ai | Slides + PPTX export | Team $40/user/mo annual ($50 monthly), custom brand themes, editable PPTX export | [beautiful.ai/pricing](https://www.beautiful.ai/pricing) |
| Pitch | Slides | Team €15, Business €20 per month (annual; per-seat is implied, not stated) | [pitch.com/pricing](https://pitch.com/pricing) |
| Gamma | Slides/docs | Business about €35/seat/mo annual (capture dated 14 Oct 2026); about $40/seat with a 10-seat minimum per another capture | [dupple capture](https://dupple.com/pricing/gamma), [eesel](https://www.eesel.ai/en/blog/gamma-pricing). Live page 403: **not verified directly** |
| Loopio / QorusDocs | RFP response | Not public | [loopio.com/pricing](https://www.loopio.com/pricing/) (no prices); [QorusDocs](https://www.capterra.com/p/126738/Qorus-for-proposal-management/) (quote only) |

**"Gamma costs $400/mo for 10 seats":** roughly right if the eesel figure holds ($40/seat Business, 10-seat minimum, billed annually = $4,800/yr). The only dated capture shows €35/seat. Directionally correct, but not verified on the live page.

**Price floor for a 10-rep team:** Better Proposals Premium about $210/mo. Plus AI Team $300/mo. Gamma about $400/mo. PandaDoc Business $490/mo. The offer's year one is $2,500 + $2,400 = **$4,900**. That is the same as Gamma and above Plus AI ($3,600/yr), and it brings no e-sign, tracking or CRM sync.

**Does "web docs, not PowerPoint" undercut the offer?** Yes, for most of the named verticals. Agencies, staffing firms and most SMB sales teams send PandaDoc, Proposify or Qwilr links because they need e-signature, view tracking and pricing tables. A PPTX deck does none of that, so the offer adds a tool rather than replacing one. PowerPoint still matters in three places: CRE pitch books, AEC shortlist interview decks, and insurance/benefits renewal decks (the Reddit carrier-quotes post). The video's general "sales team" framing misses this.

### 3. ≥50% gross margin at the stated price: ❌ FAIL at realistic labor rates (passes only in the best case)

Assumptions. Only the model price was checked live; everything else is labeled.
- Model cost: Claude Sonnet 5.5 is $2 / $10 per million input/output tokens ([claude.com/pricing](https://claude.com/pricing)). One 10-15 slide deck at about 60k input + 15k output tokens costs about $0.12 + $0.15 = **about $0.27** (token counts are my estimate). Stock images come from Pexels/Pixabay at no charge. At 50 decks/month that is **about $15-25/mo**.
- Hosting: one Docker container (Presenton + Postgres) on a small VM. **Estimate $20-40/mo** for a single-tenant box; not verified against a host price list. Multi-tenant hosting could cut this to about $10/client.
- Call-recording input: assumes the client's existing recorder (Gong, Fathom, etc.) supplies the transcript. Transcription cost not verified.
- Setup hours: brand template conversion. Presenton's docs say you must upload a *filled* deck with an example of every layout, fix fonts first, check the field schema and test long and short text ([docs](https://docs.presenton.ai/user-guide/branding-and-design/templates)). Estimate 6-10 h for that, 6-10 h for the form or CRM intake plus API plus delivery, 4-6 h for QA and revisions, and 2-3 h for discovery. **18-29 h.**
- Support: template fixes, model or provider breakage, and Presenton upgrades (the repo merged commits on Nov 5-6 2026, so it moves fast). **1-2 h/month.**

| | Low cost (18 h, $60/h, multi-tenant, 1 h support) | Mid (22 h, $80/h, $30 host, 1.5 h) | High (29 h, $100/h, $40 host, 2 h) |
|---|---|---|---|
| Setup cost vs $2,500 | $1,080 → **57%** | $1,760 → **30%** | $2,900 → **-16%** |
| Monthly cost vs $200 | $10 + $15 + $60 = $85 → **58%** | $30 + $20 + $120 = $170 → **15%** | $40 + $25 + $200 = $265 → **-33%** |
| Year 1 blended ($4,900 revenue) | $2,100 → **57%** | $3,800 → **22%** | $6,080 → **-24%** |

The $200/month line is the problem. One to two hours of template fixes plus hosting eats most of it. Margin clears 50% only if the operator values their time at about $60/h and keeps support under 1 h/month across a shared server.

### 4. Named watering holes for the buyer: ✅ PASS (they exist, but they are mostly generic sales communities, not vertical buyers)

| Place | Who is there | How to reach | Size/cost |
|---|---|---|---|
| [RevGenius](https://prospeo.io/s/sales-clubs) (Slack) | Sales, RevOps, Sales Ops practitioners | Free to join; #tools / #revops channels; no cold pitching | 50K+ members (vendor listicle, not verified) |
| [Pavilion](https://pricingsaas.com/companies/joinpavilion) | VP Sales, CROs (mostly SaaS) | Paid membership; sponsorships | Executive $2,700/yr, Associate $1,375/yr before Aug 2026 (tracker; now behind a selector) |
| r/SalesOps, r/sales, r/automation | Sales Ops, reps, automation buyers | Answer threads like the carrier-quote post | r/SalesOps had 1 relevant thread in 30 days |
| [SMPS](https://smpsny.org/about) (Society for Marketing Professional Services) | AEC marketing and proposal leads: the people in the job posts | 58 chapters; chapter events, sponsorships, "The Shortlist" podcast | 7,400-7,500+ members (chapter pages; not verified nationally) |
| APMP (Association of Proposal Management Professionals) | Proposal/bid managers (RFP side) | Chapters, conferences | Size not verified |
| CREW Network, NAIOP, SIOR | CRE brokers and marketing teams | Local chapter events | Size not verified |
| American Staffing Association | Staffing owners / sales leaders | Events, vendor directory | Size not verified |
| MPI, ILEA, Catersource | Event and catering sales | Conferences, chapters | Size not verified |

Reach is real, but the communities that host the people who actually produce proposals (SMPS, APMP) are RFP/InDesign shops, not PowerPoint sales teams.

---

## Attention signal (30-day)

- **Buyers asking:** 6 relevant Reddit posts (1 tight, 5 loose). Zero in r/sales, r/Construction or r/agency about speeding up proposals.
- **Sellers pitching:** at least 7 in the same window:
  - "How I automated custom proposal and e-sign generation using Gemini (giving it away free to 3 agencies)", cross-posted 3 times to [r/webdesign](https://www.reddit.com/r/webdesign/comments/1x6hkse/) and [r/marketingagency](https://www.reddit.com/r/marketingagency/comments/1x6sppz/).
  - ["Selling Propeant, an AI-powered proposal creation SaaS"](https://www.reddit.com/r/micro_saas/comments/1xf02zq/) (a SaaS being sold off).
  - ["Everyone automates sending the proposal..."](https://www.reddit.com/r/AiAutomations/comments/1xrlwua/) (thought-leadership pitch).
  - ["I used Codex and Devin to build an alternative to Gamma"](https://www.reddit.com/r/SaaS/comments/1x3vosm/).
  - ["Free open-source tool to remove Gamma branding from PowerPoint exports"](https://www.reddit.com/r/SideProject/comments/1xp63rc/).
- **Ratio:** about 1 buyer to 1+ seller overall, and **1 tight buyer to 7 sellers**. Sellers are giving the same workflow away for free to get case studies, which is a bad sign for a $2,500 setup fee.
- On Upwork, the visible activity is freelancers *selling* proposal templates (HubSpot quote templates at $250-750; Fiverr PandaDoc/Proposify template gigs), not clients posting jobs.

## What the video gets right / wrong

| Claim | Evidence | Call |
|---|---|---|
| Presenton is a real open-source Gamma alternative with an API | [github.com/presenton/presenton](https://github.com/presenton/presenton): 11.8k stars, 1.8k forks, REST API + MCP server, editable PPTX/PDF export, many LLM providers, active (commits merged Nov 5-6 2026) | ✅ Right |
| You can turn a company's brand deck into a template | Docs confirm PPTX-to-template generation, with caveats: you need filled example slides for every layout, the right fonts, and schema tuning ([docs](https://docs.presenton.ai/user-guide/branding-and-design/templates)) | ✅ Right, but it is real setup work, not a one-click step |
| Legal to host it as a paid service | Core is Apache-2.0 (raw LICENSE checked). The NOTICE lists permissive, LGPL and MPL dependencies, and no AGPL dependency was found. Hosting for clients is allowed with attribution kept. Note: Presenton sells its own Cloud and Enterprise (SSO, admin, custom templates), so the maintainer competes with you directly. | ✅ Right, with a competing first party |
| "Gamma costs $400/mo for 10 seats" | About $40/seat Business, 10-seat minimum per a third-party capture; €35/seat in the dated capture. Live page blocked. | 🟡 Roughly right, not verified live |
| Sales teams sending 20+ proposals want a PowerPoint generator | Most SMB sales teams use PandaDoc/Proposify/Qwilr web docs with e-sign. No staffing or agency demand found. | ❌ Wrong for most named verticals |
| Lead source: "proposal writer / sales coordinator" job posts | The 59 proposal roles found are mostly AEC RFP responders using InDesign and Unanet/Cosential, often at firms over 200 staff. Sales coordinator posts are hotel/event admin roles. | ❌ The lead source points at a different buyer and deliverable |
| $2,500 + $200/mo is a good business | Year-1 price matches Gamma; margin is 22% at mid assumptions; sellers are giving similar builds away | ❌ Weak |

## Verdict: ❌ REJECT

**Deciding reason:** Gate 1 fails badly. There is 1 tight buyer signal in 30 days against a bar of 20, and zero verified Upwork client posts. The suggested lead source (proposal-writer job posts) points to AEC RFP teams who build in InDesign, not to sales teams who want PowerPoint. Gate 3 also fails at realistic labor rates: the $200/month retainer does not cover template upkeep.

**A better-angled version exists, but it is a 🟡 research slot, not a pick:**
1. **Insurance / employee-benefits broker renewal decks.** This is the one tight signal: carrier quotes turned into a fixed-format PowerPoint, one slide per policy type. USI Insurance has 2 open "proposal & marketing specialist" roles in the sample. The deliverable is structured data → branded PPTX, which plays to Presenton's template + API strengths and has a clear before/after (hours of retyping). Next step: count benefits-broker proposal/marketing roles and r/InsuranceAgent and r/employeebenefits threads before building anything.
2. **CRE broker pitch books / BOVs.** PowerPoint and InDesign are both used, and there are 30 CRE marketing-coordinator posts in 30 days. Each brokerage has a fixed brand and repeats the same deck structure. Not verified whether these teams would accept AI-generated layout.
3. **AEC shortlist interview decks.** This is the PowerPoint slice of the AEC proposal workload, and SMPS is a reachable watering hole. The volume per firm is small, though (a few interviews a month), so a retainer is hard to justify.

**Pricing if pursued:** charge setup at $3,500-5,000 so it covers 25-35 hours at $100-140/hr. Make the monthly fee $400+, or drop it and let the client self-host. At $200/mo the support line runs at a loss.
