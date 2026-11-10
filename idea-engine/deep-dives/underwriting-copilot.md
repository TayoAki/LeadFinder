# Niche Scorecard: Underwriting copilot that fills the buyer's own Excel model (Gate 0)

Date: 2026-11-10. Method: [METHOD.md](../github-repo-offers/METHOD.md). Follows up [real-estate-ai-pm-investors.md](real-estate-ai-pm-investors.md) (cluster #2, 🟡).

**The offer tested:** fill the buyer's own Excel underwriting model from the OM, rent roll, T12 (and sometimes leases), flag inconsistencies, and draft a one-page deal summary. $3,500 build + $300/month, or $175 per deal. Buyers: small multifamily acquisitions teams, syndicators, small CRE investors, small lenders.

## Bottom line

- **Verdict: ❌ REJECT as framed.** It fails check 1 (buyers asking) and the "your own model" wedge is already sold for $99/month.
- **Paid asks are thin.** In about 90 days on Upwork I found **11 tight posts for human underwriting** and **1 post that asks for an AI build**. That one is really a market-data bot plus an Excel dashboard, not OM-to-model filling. Reddit and BiggerPockets had **0 paid asks** in 90 days.
- **The wedge is taken.** [QuickData.ai](https://www.quickdata.ai/) sells an Excel add-in that puts rent roll and T12 data "in your own Excel model, whatever its layout" for **$99/month** (live page). A.CRE gives away a Claude skill that fills its model from an OM, rent roll and T12 ("pay what you're able", from $0).
- **Buyers are doing it themselves.** Small-shop operators on Reddit describe building their own Claude skills that map documents into their own model ("95% of my UW now is done in 11 mins through Claude"). Claude for Excel comes with a $20/month Pro plan.
- **Better angle (🟡 at most):** a short fixed-fee "Claude skill for your model" setup ($1,000 to $1,500, no retainer), or credit-memo spreading for small private lenders and debt funds. Both need their own test. Demand for either is unproven.

## Scorecard

| Check | Result | Evidence |
|---|---|---|
| 1. Buyers asking (20+ tight in 30–60 days) | ❌ Fail | Upwork: 11 tight human-underwriting posts and 1 AI-build post in ~90 days. Reddit/BP: 0 paid asks. |
| 2. 3–5 competitors with public prices | ✅ Pass, but the floor is low | QuickData $99/mo (own model); RentRollAPI $1.50/doc; Cactus $25–75 per deal; Fiverr $50–250 per deal; Claude Pro $20/mo; A.CRE skill free. |
| 3. ≥50% gross margin at the offer price | 🟡 Mixed | $175/deal: ~60–70%. $3,500 build: ~14–49% depending on hours. $300/mo: ~27–43%. |
| 4. Named watering holes | ✅ Pass | A.CRE, BiggerPockets Real Estate Technology (forum 80) and Multifamily (forum 432), r/CommercialRealEstate, Upwork Financial Planning, small-firm LinkedIn posts. |

## Sources and spend

- **Upwork:** 56 Google searches through treg (`crawl4ai.google.serp.organic`), 28 queries run twice (no time filter and "past month"). Then I read 20 job pages with `crawl4ai.web.scrape`. Dates come from Google and from job-ID order (IDs from `~02210…` are about mid-September 2026 or later; `~02209…` is about August).
- **Site filter check:** `site:upwork.com/freelance-jobs/apply …` returned **no results** and the routed endpoint fell through to SerpAPI, costing $0.031 for nothing. `site:upwork.com …` works only partly (mixed in non-Upwork pages). So I used plain "upwork freelance job …" queries and kept only `/freelance-jobs/apply/` URLs.
- **Reddit:** 14 subreddit searches (`anyapi.reddit.subreddit_search`, past year, newest first) in r/CommercialRealEstate, r/multifamily, r/realestateinvesting, r/RealEstateTechnology. I read comments on 7 threads (`crawl4ai.reddit.post.comments`).
- **LinkedIn:** 4 job searches (`anyapi.linkedin.search.jobs`, US, ~30 cards each): 92 unique posts.
- **Competitors:** live pricing pages via WebFetch where they publish prices. Others are marked "not verified".
- **treg spend:** about **$0.07** by per-call receipts ($0.062 in saved responses + $0.008 LinkedIn). That includes the wasted $0.031 SerpAPI fall-through. The team balance went from $8.35 to $8.03, but other sessions were spending at the same time. Under the $0.60 cap.

## 1. Demand

### Upwork (about 60–90 days)

Tight = clearly asks for deal underwriting / rent roll / T12 work for a property buyer or lender.

| # | Post | Buyer | Budget | Notes |
|---|---|---|---|---|
| 1 | [Claude Automation for Real Estate Underwriting](https://www.upwork.com/freelance-jobs/apply/Claude-Automation-for-Real-Estate-Underwriting_~022118423797728242821/) | Acquisitions team, US, joined Sep 2026 | **$75–125/hr**, 30+ hrs/wk, 3–6 months | The only AI ask. Scope: scrape market/leasing data, rent comps, enrolment trends, new supply; output an executive Excel dashboard. **Not** OM-to-model. 50+ proposals, 17 interviewing. |
| 2 | [Financial Analyst / RE Underwriter](https://www.upwork.com/freelance-jobs/apply/Financial-Analyst-Real-Estate-Underwriter_~022115456704016354909/) | Buyer of a 59-unit SFR portfolio (Phoenix) | $8–15/hr | Has its own model; wants a person to pressure-test it on video. |
| 3 | [Real estate development underwriter](https://www.upwork.com/freelance-jobs/apply/Real-estate-development-underwriter_~022117449046256795687/) | 162-unit ground-up MF (Philadelphia) | $50–70/hr listed; text says "approximately $500" | One-off model + PDF summary. |
| 4 | [Argus CRE Modelling](https://www.upwork.com/freelance-jobs/apply/Argus-CRE-Modelling_~022118475607300229333/) | Office broker/BOV shop | $25–50/hr | Build Argus, "drop that into our Excel model"; presentation rent rolls. Closest to "their own model". |
| 5 | [Senior Commercial Credit Analyst](https://www.upwork.com/freelance-jobs/apply/Senior-Commercial-Credit-Analyst-with-financial-modeling-acquisition-underwriting-experience_~022119074230088947196/) | CRE capital advisory (lender side) | not shown | Pre-underwriting, credit memos. |
| 6 | [Expert Hospitality CRE Underwriter](https://www.upwork.com/freelance-jobs/apply/Expert-Hospitality-CRE-Underwriter-Pacific-Time_~022116690660556667332/) | California family office, 1031 | $50–110/hr | Client has $3.5K spent, 11 hires. |
| 7 | [Real Estate Financial Analyst, full-time](https://www.upwork.com/freelance-jobs/apply/Real-Estate-Financial-Analyst-Full-Time-Remote_~022116207650656302667/) | LIHTC developer (CA/NV), via recruiter | **$5–7/hr** | Build and maintain Excel UW models; "use AI tools to speed up … data extraction, then verify every figure". Works beside an existing Philippines analyst. |
| 8 | [Part-Time Wholesale Underwriter / Deal Analyst](https://www.upwork.com/freelance-jobs/apply/Part-Time-Real-Estate-Wholesale-Underwriter-Deal-Analyst_~022113018493825706082/) | Ontario wholesaler | not shown | 20 hrs/week; comps and offers, not OM/T12. |
| 9 | [Financial Underwriter for LIHTC](https://www.upwork.com/freelance-jobs/apply/Financial-Underwriter-for-Affordable-Housing-Projects-LIHTC_~022110140873552277998/) | Affordable housing | $60–100/hr | Hiring 2. |
| 10 | [RE Financial Analyst / Underwriter, residential](https://www.upwork.com/freelance-jobs/apply/Real-Estate-Financial-Analyst-Underwriter-for-Residential-Properties_~022097037020136289332/) | Buy-and-hold 1–4 units | not shown | Client $2.3K spent. ~Aug/Sep. |
| 11 | [Commercial Credit Underwriter / Deal Coordinator](https://www.upwork.com/freelance-jobs/apply/Commercial-Credit-Underwriter-Deal-Coordinator_~022118150097562339563/) | Inventory/PO finance lender | $16–56/hr | Lender, but not real estate. Counted loosely. |

Loose (related, not this deliverable): 2 × [Expert RE Financial Modeler](https://www.upwork.com/freelance-jobs/apply/Expert-Real-Estate-Financial-Modeler_~022118490032558967043/) (development/JV waterfall builds), [CCIM DCF workbook expansion](https://www.upwork.com/freelance-jobs/apply/Commercial-Real-Estate-Excel-Model-CapEx-Interest-Only-Debt-Waterfalls-Deal-Comparison_~022118091190719711736/) (a broker who wants his own model extended), [Private credit & RE lending analyst](https://www.upwork.com/freelance-jobs/apply/Fractional-Consulting-Analyst-Private-Credit-Real-Estate-Lending-Fintech_~022115470962269875953/) ($1,500 fixed), [Credit asset management analyst](https://www.upwork.com/freelance-jobs/apply/Investment-Fund-Credit-Asset-Management-Analyst_~022103134590619191437/) ($30–40/hr; "take newly closed borrowers from underwriting materials through to a fully integrated model"), [RE Analyst (Remote)](https://www.upwork.com/freelance-jobs/apply/Real-Estate-Analyst-Remote_~022104921454778941501/), [Fix & flip acquisition manager](https://www.upwork.com/freelance-jobs/apply/Real-Estate-Fix-Flip-Expert-Acquisition-Project-Manager_~022118405948739799253/), and 2 expired posts.

**Count:** tight 10 (excluding #11), loose ~19, tight AI-build 1 (and it is off-target). Rent roll / T12 / OM extraction asked for by name: **0** posts. Budgets cluster at $5–15/hr offshore or $50–125/hr for experts. Nobody stated a deal volume per month.

### Reddit and BiggerPockets

- **0 paid asks** in 90 days across r/CommercialRealEstate, r/multifamily, r/realestateinvesting, r/RealEstateTechnology. r/multifamily returned nothing for "underwriting" or "rent roll T12".
- In-window posts are discussion: [Rent Roll Frustrations](https://www.reddit.com/r/CommercialRealEstate/comments/1xcl50e/) (Oct 22; a PM venting about lease quirks, no tool ask) and [What's the biggest assumption you refuse to make when underwriting](https://www.reddit.com/r/CommercialRealEstate/comments/1w8urgd/) (Sep 6, 86 comments).
- BiggerPockets: [Using Claude Cowork to Underwrite a Deal in 10 mins](https://www.biggerpockets.com/forums/80/topics/1281269-using-claude-cowork-to-underwrite-a-deal-in-10-mins) (~7 months old). A small investor ran an OM + T12 + rent roll for a 47-unit property through Claude himself. It caught management fees booked in only 5 of 12 months. Replies were about repeatability and vendors pitching. No one asked to pay.
- r/CommercialRealEstate is hostile to vendors. A mod-adjacent reply says AI posts "are usually removed because they invite vibecoders to … spam us" ([thread](https://www.reddit.com/r/CommercialRealEstate/comments/1ttuuat/)).

### LinkedIn (US job posts, ~90 days)

- 89 posts at 75 companies across "multifamily underwriting analyst", "real estate underwriting analyst", "CRE credit analyst debt fund", "multifamily acquisitions analyst".
- By firm type (my classification from names; **sizes not verified**): ~10 recruiter posts; ~16 small firms (e.g. PRG Real Estate, Fifteen Group Capital, Hackberry Lane, HallKeen Management, Friendwell Group, Highpoint Capital Group, Oak Wood Ventures, SNI Financial, ASA Properties, Lendyx, Fort Partners, Shin Yen Retail Property Management, The Horizon Group); ~9 mid-size (Dwight Capital, Trez Capital, Peachtree Group, FPA Multifamily, Cityview, NRP Group, Maymont Homes, WNC); the rest large or institutional (Berkadia, CBRE, Northmarq, Bank of America, Welltower, AIR Communities, insurers).
- This shows analyst budgets exist. A full-time analyst costs about $70–105K/year all-in ([vendor blog](https://www.theaiconsultingnetwork.com/blog/ai-underwriting-software-cost-multifamily-investors-2026), not verified). But these firms are hiring people, not buying a $300/month copilot.

### Deal volume

No buyer post stated deals per month. Third-party benchmarks only: an in-house analyst handles "around 5–7 full financial models per month" (vendor claim, not verified). Practitioners say most of the time goes to screening OMs that never get bid. Rent roll reconciliation happens only after award, takes "an hour for an initial scrub", and "is not a meaningful percentage of the day to day" ([thread](https://www.reddit.com/r/CommercialRealEstate/comments/1pezkja/)).

## 2. Competitors (live prices checked 2026-11-10)

| Name | What it does | Price | Target buyer | Your own model? / gaps |
|---|---|---|---|---|
| [QuickData.ai](https://www.quickdata.ai/) | Excel add-in that extracts rent rolls and T12s; free deal screener; API | First 10 docs free, then **$99/mo**; API $99/mo for 100 docs then $1 each. **Live.** | MF investors, lenders, brokers | **Yes**: "land in your own Excel model, whatever its layout". Windows only. Also sells AI consulting. This is the offer's wedge. |
| [A.CRE AI Skill + Apartment Acquisition Model](https://www.adventuresincre.com/ai-skill-apartment-acquisition-model/) | Claude skill that stages OM/T12/rent roll inputs into A.CRE's model; works in Claude in Excel | **Pay what you're able ($0 minimum)**. **Live.** | Small investors, analysts | Fills A.CRE's model, not yours. But the pattern is public and copyable. Published May 18, 2026. |
| [Claude](https://claude.com/pricing) (Claude for Microsoft 365 / Excel) | General AI inside Excel | Pro $20/mo ($17 annual); Max $100/mo; Team $25/seat. **Live.** | Anyone | Works in your own workbook. Users report it "hardcod[es] values and quietly alter[s] unrelated formulas" ([thread](https://www.reddit.com/r/CommercialRealEstate/comments/1ttuuat/)). The service gap is reliability and QA. |
| [Microsoft 365 Copilot](https://www.microsoft.com/en-us/microsoft-365-copilot/pricing) | Copilot in Excel | Copilot Business add-on $18/user/mo (promo; $21 list); Business Standard with Copilot $23.50. **Live.** | M365 businesses | Generic. No CRE logic. |
| [RentRollAPI](https://rentrollapi.com/) | Rent roll and T12 to Excel/CSV/JSON; reconciles totals; MCP server | **$1.50/doc**; $49/mo for 50; $199/mo for 300. **Live.** | Developers, agents | Gives structured data, not your model. A cheap engine for a builder. |
| [Cactus](https://www.trycactus.com/pricing) | AI CRE screening and underwriting | Screen 1 credit, Deep Dive 3 credits; credits $25–35 (pay-as-you-go from $35; 10 credits $250/mo). So **$25–105 per deal**. **Live.** | Investors, lenders | Its own output. Page does not mention Excel export. |
| [Clik.ai](https://www.clik.ai/) | Spreads T12s/rent rolls, fills Fannie/Freddie workbooks, custom Excel models | Demo only. "~$150/mo starting" per a [consultant blog](https://www.theaiconsultingnetwork.com/blog/ai-underwriting-software-cost-multifamily-investors-2026), **not verified**. | Lenders, servicers, brokerages (Newmark, Colliers, Northmarq) | Builds "bespoke Excel-based models"; enterprise focus. |
| [PRODA](https://www.proda.ai/) | Any rent roll / op statement to standardized, error-checked data; Excel add-in | Not published. | Asset managers, banks (Blackstone, Hines, PIMCO) | Enterprise. Recommended by a Reddit user as "work well". |
| [Docsumo](https://www.docsumo.com/pricing) | Generic document extraction | Free trial 1,000 pages / 14 days; Business and Enterprise by quote. **Live.** | Ops teams | Generic; needs setup. |
| [Rossum](https://rossum.ai/pricing/) | Generic document extraction | Starter **from $18,000/yr**. **Live.** | Mid-market and enterprise AP | Far above a small syndicator's budget. |
| [V7 Go](https://www.v7labs.com/pricing) | Document agents (used by a lender on Reddit for compliance-approved UW) | Custom annual quote. **Live.** | Institutions | Enterprise. |
| Archer, Dealpath, redIQ, Valuate, Cherre, Leni | Underwriting / pipeline / data platforms | No public prices found. Archer "$200–400/mo" per the same blog, **not verified**; a SourceForge page lists $1,800/mo near redIQ, **not verified** | Mid to large owners | Platforms with their own templates or charts of accounts. |
| Enodo (Walker & Dunlop) | MF automated underwriting | Not sold as a product in 2026 as far as I could find ([HelloData](https://www.hellodata.ai/help-articles/what-is-enodo-multifamily-underwriting-software)) | n/a | n/a |
| Northspyre | Development budgeting | Not an underwriting extractor. | Developers | n/a |
| Human: Fiverr | Deal underwriting / pro forma gigs | [$50](https://www.fiverr.com/arifulislam546/perform-real-estate-valuation-underwriting-and-property-analysis), [$125](https://www.fiverr.com/gabe_goudreau/create-a-pro-forma-for-multifamily-real-estate-investments), [$185](https://www.fiverr.com/mitchellmonroe/build-you-a-real-estate-multifamily-financial-model), [$250](https://www.fiverr.com/ttennoi/prepare-financial-reports-so-you-can-obtain-financing) starting prices (from search snippets; **not verified live**) | Small investors | Usually the seller's own model. 1–4 day turnaround. |
| Human: Upwork offshore | Hourly analysts | $5–15/hr in the posts above | Small sponsors, LIHTC developers | Works in your model, slowly. |
| Human: SitusAMC, Evalueserve | Outsourced lender underwriting | Not published | Banks, CMBS lenders | Enterprise. |

**Price floor:** $1.50 per document (RentRollAPI) for raw extraction; **$99/month for extraction into your own model** (QuickData); $20/month for DIY with Claude for Excel; $0 for A.CRE's skill. Humans: ~$50–250 per deal on Fiverr; $5–15/hr offshore on Upwork.

## 3. Is "fills your own model" a real wedge?

**The need is real. The wedge is not exclusive.**

For it:
- "Everyone builds their own model." "I've worked at 3 shops and each has had their own." "Each firm has its own model." ([thread](https://www.reddit.com/r/CommercialRealEstate/comments/1q90em8/))
- "Standardized tools are built around the average deal, so you're always bending your assumptions to fit the model" ([thread](https://www.reddit.com/r/CommercialRealEstate/comments/1tklaap/)).
- A regional bank lender: "we end up having to convert brokers' Argus models to Excel to underwrite our own proformas" (same thread).
- Formats vary. PRODA lists MRI, Yardi, Argus, RealPage and SAP sources; rent rolls carry concessions, mid-month escalations and RSF discrepancies ([vent thread](https://www.reddit.com/r/CommercialRealEstate/comments/1xcl50e/)).

Against it:
- QuickData already markets exactly this ("works in the model you already use instead of making you switch to a new template") for $99/month.
- Buyers build it themselves: "I used an existing model … Then built specific skills to map documents into the model" ([thread](https://www.reddit.com/r/CommercialRealEstate/comments/1ufyphp/)); "We upload OMs to a saved project that has the skill running … color code flags" ([thread](https://www.reddit.com/r/CommercialRealEstate/comments/1tklaap/)). That operator says Claude Max ($100/mo) saves "~$1000–1500/month on less 3rd party analyst reliance". So the analyst budget is moving to a $100 tool, not to a $300/month service.
- Rent roll work is called minor: "I can go through a rent roll in like 15 min"; "rent rolls are easy for ai to handle" ([thread](https://www.reddit.com/r/CommercialRealEstate/comments/1pezkja/)).
- Lenders: compliance blocks sending borrower files to outside AI ("borrower financials are where it dies for everyone") ([thread](https://www.reddit.com/r/CommercialRealEstate/comments/1ufyphp/)).
- How often models change: no hard data. Comments say models grow by small additions ("you just add things as you go"). So mapping drifts slowly. That makes ongoing maintenance small, which also weakens the case for a $300 retainer.

## 4. Technical feasibility with Claude

- **Feasible.** Public proof: A.CRE's skill, the BiggerPockets Cowork run, and Reddit users' own skills. Claude reads PDFs and Excel, and Claude for Excel edits the live workbook.
- **Design:** (1) extract OM / rent roll / T12 into a fixed JSON schema (unit mix, in-place rents, concessions, T12 line items); (2) reconcile: rent roll total vs T12 GPR, occupancy vs units, missing months (e.g. management fee in 5 of 12 months), expense ratio outside range; (3) write values into a named input sheet or input registry, never into formulas; (4) diff the workbook before and after; (5) one-page summary.
- **Known failure modes:** hardcoded values and changed formulas when the model edits the sheet directly (reported above); misses in narrative OM sections; scanned PDFs; multi-property packets. Mitigate with a staging sheet, cell whitelist, totals checks and a human sign-off.
- **Build hours per client (my estimate, not measured):** discovery and model mapping 4h; collect 3–5 past deal packets 1h; extraction schema and mapping skill 8–12h for the first clients (4–6h once reused); validation rules 3h; QA on 3 past deals with the client's numbers 5h; training and handover 2h; fixes after the first live deals 3h. **Total ~26–30h for early clients, ~18h later.**
- **Maintenance:** ~1–2h/month (new PM software formats, model tab changes, Claude/Excel updates).
- **Compute per deal (API list prices from Anthropic's model table, cached 2026-11-03):** a 40-page OM + 200-unit rent roll + T12 is roughly 100–150K input tokens. With 2–3 passes and ~30K output: Sonnet 5.5 ($2/$10 per M) about **$0.60–1.20**; Opus 5.5 ($4/$20) about **$1.20–2.40**. Call it **$1–3 per deal** with retries. If the client runs it in their own Claude seat, compute is $0 to us.

## 5. Margin math

Loaded labor assumption: $75–100/hr (owner time).

**$3,500 build:**
- Early client: 28h × $100 = $2,800 → (3,500 − 2,800) / 3,500 = **20%**. At $75/hr: $2,100 → **40%**.
- Reused pipeline: 18h × $100 = $1,800 → **49%**. At $75/hr: $1,350 → **61%**.
- Passes 50% only after the template is reused and at the lower rate.

**$300/month:**
- 1.5h × $100 + 10 deals × $2 = $170 → (300 − 170) / 300 = **43%**.
- 2h × $100 + $20 = $220 → **27%**.
- Fails 50% unless maintenance stays under ~1.3h/month.

**$175 per deal (done-for-you, I run it and QA it):**
- 40 min QA × $100 = $67 + $3 compute = $70 → (175 − 70) / 175 = **60%**.
- 30 min at $75/hr = $38 + $3 → **77%**.

**Deals per client per month:** $300/mo equals $175/deal at ~1.7 deals. A syndicator screening 10 OMs/month at $175 would pay $1,750/month. That is more than a $5–15/hr offshore analyst costs for the same screens.

**Offshore comparison:** Upwork offshore analysts bid $5–15/hr. At 2–4 hours per deal (my estimate), that is **~$10–60 per deal**. Fiverr gigs start at $50–250 per deal. Cactus is $25–105 per deal. So **$175/deal is 3–15× a human offshore analyst** and above every software price found. The price only holds if the buyer values "in my model, QA'd, same day" very highly. No post showed that.

## 6. Best form, segment, price, first 10 clients, 30-day test

**If pursued at all:**
- **Form:** a one-time setup service, not a retainer. Deliver a Claude skill (or Claude for Excel workflow) mapped to the client's model, with validation checks and a diff step. The client runs it on their own Claude seat. That also helps with data-privacy objections.
- **Segment:** syndicators and small private lenders/debt funds that screen 10+ deals a month and already use Claude or are hiring an analyst. Not institutions (they buy Clik/PRODA/V7) and not 1–4 unit investors (Fiverr and free tools).
- **Price:** $1,500 fixed setup (3 test deals included), optional $150/month "format fixes" plan. Anchor against an analyst's month ($5,800+ all-in per the vendor blog, not verified) and against QuickData ($99/mo, which extracts but does not validate or summarize).

**Watering holes for the first 10:**
1. A.CRE (adventuresincre.com): users of its free Claude skill are pre-sold on the method and need it on their own model.
2. BiggerPockets [Real Estate Technology forum (80)](https://www.biggerpockets.com/forums/80) and Multifamily forum (432).
3. Upwork Financial Planning jobs that mention "underwriting model" or "Claude" (bid only on real posts like the ones above).
4. Small firms hiring acquisitions or credit analysts on LinkedIn (PRG Real Estate, Fifteen Group Capital, Hackberry Lane, HallKeen, Highpoint Capital Group, Oak Wood Ventures, Peachtree Group, Lendyx). Pitch "AI pre-work for your new analyst", not replacement.
5. Syndicator platforms' audiences (e.g. Cashflow Portal runs an "AI for CRE" page: [link](https://outreach.cashflowportal.com/leads/ai-for-cre); audience size not verified).
6. r/CommercialRealEstate: read only. Vendor posts get removed.

**30-day test (no build before a yes):**
- Week 1: build a demo on A.CRE's free model and 3 public listing packets (Crexi/LoopNet). Record a 3-minute video showing the extraction, the reconciliation flags and the cell diff.
- Weeks 2–3: offer a $750 paid pilot ("we map your model and run your next 3 deals") to 40 targets from the list above and to every matching Upwork post.
- Week 4: decide.
- **Pass:** 3 paid pilots and at least 1 buyer who says they would pay monthly. **Kill:** fewer than 2 paid pilots, or buyers say "QuickData / my own Claude does this".

## The offer's claims vs the evidence

| Claim | Evidence |
|---|---|
| ~6 tight posts in ~60 days (first pass) | Fuller count: 10 tight human posts in ~90 days; 1 AI post, and it is off-target. |
| "1 post explicitly asks for Claude to automate an Excel underwriting model" | True by title. The scope is market-data scraping and a dashboard, $75–125/hr, 50+ proposals. Not OM/rent roll/T12 filling. |
| "Uses YOUR model" is the differentiator | QuickData sells this for $99/mo. A.CRE gives a Claude skill away. Users build their own. |
| $175/deal | 3–15× an offshore analyst per deal; above every software price found. |

## Verdict

**❌ REJECT (check 1 failed; the wedge is already sold cheaply).**

- **Deciding reason:** almost nobody is paying freelancers to put OM/rent roll/T12 data into their model, and those who want it can buy QuickData for $99/month or build a Claude skill for $20–100/month.
- **Biggest risk if pursued anyway:** the buyer learns to do it in Claude for Excel after the setup, so the $300/month retainer churns within a few months. For lenders, compliance blocks sending borrower files to an outside AI.
- **Better-angled version:** a fixed-fee "Claude skill for your model" setup at ~$1,500 for syndicators who already use Claude, run as the 30-day test above. A lender credit-memo spreading variant is possible but needs a compliance-friendly deployment and its own demand check.
