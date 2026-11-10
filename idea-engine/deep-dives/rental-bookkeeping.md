# Rental bookkeeping + monthly owner packet (deep dive)

Date: 2026-11-10. Method: [METHOD.md](../github-repo-offers/METHOD.md) (Gate 0). First pass: [real-estate-ai-pm-investors.md](real-estate-ai-pm-investors.md).

**The offer tested:** AI-assisted rental bookkeeping plus a monthly owner packet (owner statement, rent roll, delinquency, maintenance spend, plain-English summary). Buyers: self-managing investors with 5–50 units and small PM shops. Price: $1,500 cleanup, then $450–800/month. AI drafts; a human reviews.

## Verdict: 🟡 RESEARCH SLOT, leaning go (run the 30-day test)

- **Deciding reason:** demand is real and steady (27 genuine tight Upwork posts in ~60 days, plus fresh BiggerPockets threads). But buyers anchor low. Most Upwork budgets are $4–20/h. A 9-unit owner on BiggerPockets called $300–500/mo quotes "a big hit". So $450–800/mo works for some buyers, not most.
- **What passes:** demand count, priced competitors, watering holes. Margin passes at 5–20 units with AI help. It **fails at 50 units for $800/mo** with US labour.
- **Biggest risk:** price compression. Offshore bookkeepers ($5–20/h) and free or $15–80/mo software (Stessa, Baselane, REI Hub) set the buyer's anchor. AI categorization is already inside that software. AI is your margin tool, not your selling point.
- **Better angle:** sell **owner-side "PM statement audit + books"** to investors with 5–30 doors who use one or more third-party PMs. No trust accounts, read-only access, a one-page "exceptions first" report. That is the deliverable the best-paying buyer in the sample asked for in their own words.

---

## Sources, sample sizes, spend

- **Upwork:** 43 Google searches through treg, restricted with `site:upwork.com/freelance-jobs/apply` (I tested the filter first; it returns only job pages). 140 unique job pages. 135 had job IDs from about mid-September 2026 onward. I then scraped **59 job pages** to read budgets and client history.
- **Reddit:** 20 searches (crawl4ai, sorted by new) in r/realestateinvesting, r/PropertyManagement, r/Bookkeeping, r/Landlord, r/smallbusiness, r/tax, r/AirBnB. 110 posts dated 2026-09-10 or later. Search quality on r/realestateinvesting was poor (0 recent hits for "bookkeeping").
- **BiggerPockets:** 8 Google searches; 4 in-window threads read in full.
- **Competitors:** live pricing pages fetched on 2026-11-10 where published.
- **Prior pass raw data** in `scratchpad/rePM/` was re-read and its bookkeeping hits merged.
- **treg spend: $0.123** across 146 calls (sum of per-call receipts). One Google call fell through to an expensive provider ($0.071); I capped later calls. Team balance went $8.35 → $7.98, but other sessions were spending at the same time. Under the $0.60 cap.

**Dating caveat.** Upwork dates come from Google snippets and job-ID order. They are approximate.

**Data-quality caveat (important).** 7 of the most detailed "perfect fit" posts look like **test or AI-training tasks, not real buyers**: $5–20 fixed price for weeks of work, clients with 41–340 hires but only $2.9K–15K spent, and unrelated industries (e.g. "Agriculture & Forestry", "Health & Fitness"). Examples: [35-unit AppFolio/QBO trust rec, $20](https://www.upwork.com/freelance-jobs/apply/Real-Estate-Bookkeeper-for-AppFolio-and-Buildium-Accounting-Trust-Reconciliation_~022119852810336669519/), [140-unit multifamily cleanup, $20](https://www.upwork.com/freelance-jobs/apply/Multifamily-Rental-Portfolio-Bookkeeper-QuickBooks-Cleanup-and-Monthly-Month-End-Close_~022119841950008965076/), [AppFolio→QBO cleanup, $20](https://www.upwork.com/freelance-jobs/apply/Property-Management-Bookkeeper-Needed-AppFolio-QuickBooks-Cleanup-Rental-Reconciliation_~022119817407558749992/) (this one was in the first pass's count), [8 STRs payout rec](https://www.upwork.com/freelance-jobs/apply/Airbnb-VRBO-Short-Term-Rental-Owner-Payout-Reconciliation-QuickBooks-Cleanup_~022119849306215955222/), [PM QBO cleanup, $5](https://www.upwork.com/freelance-jobs/apply/QuickBooks-Cleanup-Specialist-Books-Cleanup-for-Multi-Property-Management-Accounting_~022104629037270578042/). Four more come from two new UAE-based accounts (e.g. [AppFolio cleanup, $30](https://www.upwork.com/freelance-jobs/apply/Appfolio-Data-Cleanup-and-Reconciliation_~022118036109186168298/)), likely resellers. **I excluded all 11.** Their wording is still useful as buyer language.

---

## 1. Demand (~60 days, Sept 11 – Nov 10, 2026)

### Count by segment

| Source | Investors / owners (tight) | PM companies (tight) | Loose (related) | Excluded |
|---|---|---|---|---|
| Upwork (genuine) | **16** | **11** | ~20 (VA+bookkeeping, tax/CPA, development, brokerages) | 11 test/reseller posts; 2 competitor hiring posts |
| BiggerPockets | 3 (9 units; 1 LTR; Chicago investor wanting a contract bookkeeper) | 0 | 1 AI-ops thread | many vendor replies |
| Reddit | 2 weak (18-home landlord shopping for software; NYC 3-family wanting a PM with "strong accounting") | 2 weak (new PM accountant asking how to review owner financials; owner-packet thread) | 3 (Detroit owner owed $5K in distributions; Lark+CO trust discipline; Schedule E spreadsheet thread) | job-seeker posts by PM accountants (supply) |
| **Total tight** | **~19** | **~11** | | |

About 3 tight Upwork posts a week. The first pass found 14 tight; the fuller search roughly doubles it after removing fake posts.

**Asks for AI:** 3 of ~47 tight+loose posts. One is tight: the [SC PM's trust-reconciliation project](https://www.upwork.com/freelance-jobs/apply/Trust-Accounting-Expert-Month-End-Reconciliation-Process-Train-Our-Team_~022113364519741051794/) says "incorporate AI and automation… where it reduces manual work". The others: a [build-to-rent "AI accounting agent"](https://www.upwork.com/freelance-jobs/apply/Build-Rent-Development-and-Ownership-Accounting-Agent_~022119242089390631314/) ($300 total client spend) and an [investor wanting ChatGPT/Gemini workflows around Buildium](https://www.upwork.com/freelance-jobs/apply/Expert-for-Set-Integration-ChatGPT-Gemini-Similar-Tools_~022112311466195626566/).

### Investors / owners (Upwork, genuine, sorted by budget)

| Post | Budget |
|---|---|
| [7 SFRs (OH/IN/CA), 2 PMs + self-managed](https://www.upwork.com/freelance-jobs/apply/Bookkeeping-Obligations-Monitoring-for-Rental-Portfolio_~022119295707702377238/) | $30–50/h; 4–6 h/mo trial, then fixed monthly fee |
| [2 LLCs, 4 rentals (RI)](https://www.upwork.com/freelance-jobs/apply/Part-Time-Bookkeeper-Real-Estate-LLCs-Remote_~022109683952417264974/) | $30–45/h; wants a fixed monthly rate |
| [Several entities, Yardi (AK)](https://www.upwork.com/freelance-jobs/apply/Yardi-Expert-Needed-for-Monthly-Bookkeeping_~022118143721578805542/) | $20–32/h |
| [Retail centres, several states (Stessa/RentRedi, CAM)](https://www.upwork.com/freelance-jobs/apply/Commercial-Real-Estate-Bookkeeper-Property-Management-Stessa-RentRedi-CAM-Reconciliation_~022119873587639389992/) | $15–25/h |
| [LTR + Airbnb portfolio (UK-based client)](https://www.upwork.com/freelance-jobs/apply/Real-Estate-Bookkeeper-needed-Airbnb-Tenant-Vendor-Payments_~022104923869386449952/) | $15–25/h |
| [Rentals + new builds, REI Hub, 75–125 txns/mo](https://www.upwork.com/freelance-jobs/apply/Bookkeeper-for-Real-Estate-Investor-who-familiar-with-REI-Hub-like-software_~022116208684929155626/) | $5–15/h; 4–6 h/mo |
| [One 72-unit property, AppFolio setup](https://www.upwork.com/freelance-jobs/apply/AppFolio-accounting-setup-one-unit-residential-property-fixed-price_~022115542656618869499/) | $10–20/h |
| [Personal + 4 rentals](https://www.upwork.com/freelance-jobs/apply/Bookkeeper-for-Personal-and-Rental-Accounting_~022117683362850044773/) | $5–20/h |
| [STR portfolio, Airbnb/VRBO](https://www.upwork.com/freelance-jobs/apply/Bookkeeper-for-Short-Term-Rentals-QuickBooks-Airbnb-VRBO_~022109719617051848536/) | $6–10/h |
| [~15 rentals + flips](https://www.upwork.com/freelance-jobs/apply/Real-Estate-Bookkeeper-Accounts-Payable-Specialist_~022119604916060306521/) | $5–6/h |
| [100+ units + flips, Buildium/QBO](https://www.upwork.com/freelance-jobs/apply/Remote-Property-Bookkeeper_~022119947485642374233/) | $4–8/h |
| [Rental business](https://www.upwork.com/freelance-jobs/apply/Bookkeeper-for-Rental-Real-Estate_~022117341204137585270/) | $4.50/h |
| [1 SFR LLC managed by Mynd; book PM owner statements gross](https://www.upwork.com/freelance-jobs/apply/QuickBooks-Online-Setup-for-Rental-Property-LLC-Texas-One-Time-Project_~022114743124999806813/) | $120 fixed |
| [Duplex; review 2 years of PM statements](https://www.upwork.com/freelance-jobs/apply/One-Time-Real-Estate-Bookkeeping-Financial-Review-Project_~022118125816622580180/) | $100 fixed |
| [Commercial portfolio; cleanup + monthly](https://www.upwork.com/freelance-jobs/apply/Commercial-Real-Estate-Bookkeeper_~022108779886711972373/) | not shown |
| [Stessa bookkeeper for rental units](https://www.upwork.com/freelance-jobs/apply/Stessa-Bookkeeper-for-Rental-Units_~022117757889224468492/) | page not readable |

Unit counts seen: 1, 2, 4, 4, 7, ~15, 72, 100+ (and commercial). The 5–50 unit band is well represented.

**The best buyer in the sample** is the [7-SFR owner](https://www.upwork.com/freelance-jobs/apply/Bookkeeping-Obligations-Monitoring-for-Rental-Portfolio_~022119295707702377238/). They want: reconcile PM owner statements to distributions, audit PM charges against management agreements, a "one-page monthly report, exceptions first", read-only access, and a fixed monthly fee after a paid trial. At 4–6 h × $30–50/h, their implied budget is **$120–300/month**.

### PM companies (Upwork, genuine)

| Post | Budget |
|---|---|
| [PM on Buildium; ledger errors breaking owner payouts](https://www.upwork.com/freelance-jobs/apply/Buildium-Ledger-Correction-Specialist_~022108235276957681915/) | $25–75/h |
| [SC PM, 200+ doors → 500; DoorLoop; three-way trust rec SOP; wants AI in it](https://www.upwork.com/freelance-jobs/apply/Trust-Accounting-Expert-Month-End-Reconciliation-Process-Train-Our-Team_~022113364519741051794/) | $20–60/h; client spent $144K |
| [PM, AppFolio account reconciliation, US only](https://www.upwork.com/freelance-jobs/apply/Accountant-Bookkeeper-Experienced-with-AppFolio-for-Account-Reconciliation_~022106479458748126981/) | $14–35/h; client spent $79K |
| [SoCal PM, 35 doors; CA DRE three-way rec; 4–7 h/mo](https://www.upwork.com/freelance-jobs/apply/AppFolio-Bookkeeper-Trust-Accountant-Residential-Units-Scaling-Portfolio_~022101667750847445347/) | $15+/h (snippet) |
| [Vulcan Properties, 300+ units, AppFolio](https://www.upwork.com/freelance-jobs/apply/AppFolio-Property-Accounting-Specialist_~022115004420761655002/) | $12–20/h |
| [PM catch-up, Rent Manager, years of history](https://www.upwork.com/freelance-jobs/apply/Bookkeeper-with-Rent-Manager-Experience_~022109841372706260944/) | $5–20/h |
| [Growing RE + PM company (New Orleans)](https://www.upwork.com/freelance-jobs/apply/Bookkeeper-Reconciliation-Financial-Reporting-Cash-Flow-Property-Management_~022118840967042828547/) | $5–7/h; client spent $192K |
| [PM admin + accounting, AppFolio/QBO](https://www.upwork.com/freelance-jobs/apply/Accounting-and-Bookkeeping-Support_~022117141062030991507/) | $3–4/h |
| [Small PM for 3rd-party owners + STR, Xero](https://www.upwork.com/freelance-jobs/apply/Real-Estate-Airbnb-Bookkeeper_~022107697552395065193/) | not shown |
| [PM choosing AppFolio or Yardi, chart of accounts](https://www.upwork.com/freelance-jobs/apply/Bookkeeper-Accountant-for-Property-Management-Port-Lucie-Marin-County-Area_~022107593265172655956/) | not shown |
| [Canadian PM + Airbnb catch-up](https://www.upwork.com/freelance-jobs/apply/Canadian-Airbnb-and-Property-Management-Bookkeeper-GST-HST-and-CPA-Ready-Books_~022119827036838131668/) | $25 fixed |

PM shops either want cheap ongoing labour ($3–20/h) or a specialist for a hard problem (trust rec, ledger repair) at $20–75/h. The SoCal 35-door PM wants CA DRE three-way rec in **4–7 hours a month**, capped.

### Competitors hiring on Upwork (supply-side signal)

- [A bookkeeping firm serving rental PM companies](https://www.upwork.com/freelance-jobs/apply/Bookkeeper-Permanent-WFH_~022118433132403453061/) hires full-time contractors at **$5/h** ($293K spent on Upwork).
- [Rock Real Estate Services](https://www.upwork.com/freelance-jobs/apply/Appfolio-Expert-Monthly-Accounting-and-Migrations_~022103134105314742943/) hires a senior AppFolio bookkeeper, including "monthly owner packages… variance explanations", at **$10–20/h**.

So the exact owner-packet deliverable is already sold by firms using offshore labour.

### BiggerPockets and Reddit

- [Bookkeeping for 9 units](https://www.biggerpockets.com/forums/48/topics/1319003-bookkeeping-for-9-units) (Nov 5). 2 multifamily properties, 1 LLC, Stessa free, books messy after a bad PM. He was quoted **$300–500/mo** and called it a big hit. Replies split: "$300–500 a month is $33–55 a door, every month??" vs "$400 is about right when it buys you a real monthly close". At least 6 of ~15 repliers were vendors.
- [Looking for Real Estate Book keeper](https://www.biggerpockets.com/forums/517/topics/1318065-looking-for-real-estate-book-keeper) (Oct 29). One LTR in San Antonio; her real-estate bookkeeper closed. No budget stated. 10 replies, mostly vendors.
- [Chicago investor seeking CPA, attorney, contract bookkeeper](https://www.biggerpockets.com/forums/517/topics/1316499-in-search-of-recommendations-for-rei-cpa-re-legal-and-contract-bookkeeper) (Oct 14). One vendor quoted "contract bookkeeping starting at $400 per month". About 9 vendors replied.
- r/PropertyManagement: [How long does your owner packet take?](https://www.reddit.com/r/PropertyManagement/comments/1wq9cny/) (Sept 25; covered in the first pass) and [Reviewing Owner Financials](https://www.reddit.com/r/PropertyManagement/comments/1xggmsz/reviewing_owner_financials/) (Oct 27, a new PM accountant asking how to review owner statements).
- r/Landlord: [Detroit PM hasn't paid ~$5,000 in owner distributions since June](https://www.reddit.com/r/Landlord/comments/1xb6nlw/landlord_usmi_what_should_i_do_if_my_detroit/) (Oct 20; posted twice). This is the pain behind "owner-side PM audit". Also a [Schedule E spreadsheet thread](https://www.reddit.com/r/Landlord/comments/1wiikdn/landlord_us_small_landlords_are_you_still/) (Sept 17), which reads like a vendor probe.
- r/Bookkeeping: [Landlord with 18 homes and condos](https://www.reddit.com/r/Bookkeeping/comments/1wq08b3/i_am_a_landlord_i_need_to_get_software/) wants **software** (looking at Stessa) because QuickBooks Enterprise is too expensive.

**Reading:** forums show a few buyers per month and many sellers. Upwork is the volume channel, but it is price-anchored.

---

## 2. Competitors and price norms (live pages, 2026-11-10)

### Done-for-you bookkeeping

| Firm | Price (source) | Per unit |
|---|---|---|
| [Steph's Books](https://stephsbooks.com/industries-served/rental-property-bookkeeping) (rental-only) | Starter 1–5 units **$400/mo**; Growth 6–15 **$750/mo**; Portfolio 16+ **$1,200+/mo**. PM-software reconciliation only in Portfolio. Year-end Schedule E package, not returns. Cleanup not priced. **Live.** | $80–400 → $50–125 → ≤$75 |
| [ProAxis CPA](https://proaxiscpa.com/business-services/bookkeeping/real-estate-investors/) | Solo investor (3–5 SFRs, 1 LLC) **$400–700/mo**; multi-entity 15+ doors **$1,000–2,500/mo**. "Published ranges, not an offer." **Live.** | ~$80–230; ~$65–165 |
| [Bench](https://www.bench.co/pricing) (generic, not rental-specific) | Light **$199/mo**; Bookkeeping + software **$399/mo**; + tax **$649/mo**; fractional bookkeeper **$55/h** + $1,200 onboarding. **Live.** | n/a |
| [RemoteBooksOnline](https://www.remotebooksonline.com/bookkeeping-for-real-estate-investors) | "From **$150/month**", software included. **Live.** Their [blog](https://www.remotebooksonline.com/blog/how-much-do-bookkeeping-services-cost-for-real-estate-businesses) says $300–500 (1–3 properties), $500–800 (4–10). Blog figures **not verified** as prices. | — |
| [WCG](https://wcginc.com/business-services/property-management-bookkeeping-services/) (PM bookkeeping) | Monthly accounting from **$525/mo**; bi-monthly from $350; trust reconciliation "scoped per engagement"; owner 1099s $30 each. **Live.** | — |
| RemoteBooksOnline PM tiers | ≤100 doors $400–900; 100–400 doors $800–1,600 ([blog](https://www.remotebooksonline.com/blog/property-management-hoa-bookkeeping-software-pricing)). **Not verified.** | ~$4–9/door at 100 |
| [Proper](https://www.proper.ai/llms.txt) (AI + human PM accounting) | Per-unit, month-to-month, no onboarding fee; serves 250–50,000+ doors. No rate published. A vendor blog cites "$7.99 per door" ([Proper blog](https://proper.ai/blog/the-cost-of-property-accounting)), **not verified**. | ~$8/door (not verified) |
| BiggerPockets vendors (thread replies) | "Contract bookkeeping starting at $400 per month"; "$400 is about right" for a monthly close. Forum claims, **not verified**. | — |
| Offshore accountants | India $8–14/h entry, $18–28 senior; Philippines $10–16 / $20–30 ([vendor blog](https://madrasaccountancy.com/blog-posts/offshore-accountant-cost-india-philippines-us-comparison)). **Not verified.** Upwork PM bookkeeping posts: $3–20/h (above). | — |

### Software that already does categorization and reports

| Product | Price (live page) | Relevant features |
|---|---|---|
| [Stessa](https://www.stessa.com/pricing/) | Essentials free; Manage $12/mo (annual); Pro $28/mo (annual) | Bank feeds, Schedule E (Manage+), advanced reports (Pro). No DFY bookkeeping. |
| [Baselane](https://www.baselane.com/pricing) | Core $0; Smart $20/mo (annual) | Property-level tracking, Schedule E, rent roll, tenant ledger (Core). **"AI auto-tag assistant"** and receipt matching (Smart). |
| [REI Hub](https://www.reihub.net/pricing) | Free; Professional $9–48/mo annual ($15–80 monthly) by units (3/10/20/unlimited) | Schedule E on all plans; bank feeds and rules on Professional. |
| [Landlord Studio](https://www.landlordstudio.com/pricing) | Go free (3 units); Pro $15/mo; Pro Plus $35/mo; +$1.20/unit after 3 | **"AI-assisted bookkeeping"**, bank feeds, Schedule E. |
| [Holdings](https://getholdings.com/bookkeeping) | Accounting software $25/mo | Auto-categorization, bank rec. A separate "professional bookkeepers" service is mentioned but **not priced**. |
| AppFolio / Buildium (first pass) | AppFolio from $1.49/unit (50-unit min); Buildium from $65/mo | Owner statements built in. |

### Price norms (per unit / door per month)

- **Software:** $0–5 per unit. AI categorization is included in Baselane Smart ($20/mo total) and Landlord Studio Pro.
- **DFY for small investors (1–15 units):** $150–750/mo flat. Per unit that is **~$30–100+ at 5–10 units**, falling to **~$25–50 at 15–20**.
- **DFY at 16–50 units:** $1,000–2,500/mo (ProAxis, Steph's) → **~$20–75/unit**.
- **PM company accounting at 100+ doors:** **~$4–9/door** (not verified; quote-only market).
- **Buyer pushback point:** $33–55/door for 9 units drew pushback on BiggerPockets.

Your $450 (5 units) = $90/unit: at the top of the market, matched only by Steph's ($400). Your $800 (50 units) = $16/unit: cheaper than the published 16+ unit tiers.

---

## 3. Margin

**Assumptions.** Tools $25 per client per month (LLM API, parsing, storage, E&O share; the client pays for QBO/Stessa/AppFolio). Hours include review, one exceptions list, packet narrative, client questions, and fixing breakage. Hours are my estimates, anchored by buyer posts: 7 SFRs = 4–6 h/mo; 75–125 txns = 4–6 h/mo; 35-door PM incl. trust rec = 4–7 h/mo. Trust rec for 80–120 doors = 8–12 h/mo ([vendor source](https://enterprisedna.co/resources/insights/real-estate-automate-trust-reconciliation-cost), not verified).

| Size | Hours/mo without AI | Hours/mo with AI | Price |
|---|---|---|---|
| 5 units (1–2 entities, ~60 txns, 1–2 PM statements) | 4 | 2.5 | $450 |
| 20 units (2–4 entities, ~200 txns) | 8 | 5 | $650 |
| 50 units (4–6 entities, ~450 txns, rent roll, delinquency) | 14 | 9 | $800 |

Gross margin = (price − tools − hours × rate) / price:

| Size / price | US $35/h, AI | US $60/h, AI | US $60/h, no AI | Offshore $15/h + 1 h US review @ $60, AI |
|---|---|---|---|---|
| 5 units / $450 | (450−25−88)/450 = **75%** | (450−25−150)/450 = **61%** | (450−25−240)/450 = 41% | (450−25−23−60)/450 = 76% |
| 20 units / $650 | (650−25−175)/650 = **69%** | (650−25−300)/650 = **50%** | (650−25−480)/650 = 22% | (650−25−60−60)/650 = 78% |
| 50 units / $800 | (800−25−315)/800 = **58%** | (800−25−540)/800 = **29%** ❌ | negative ❌ | (800−25−120−60)/800 = 74% |
| 50 units / $1,200 | 72% | (1,200−25−540)/1,200 = **53%** | 25% | 83% |

**Cleanup ($1,500):** 12 months, ≤10 units, ≤2 entities. With AI that is about 14–18 h; at $50/h: (1,500 − 20 − 800) / 1,500 = **45%**. It reaches 50%+ only at ≤14 h or with offshore prep. Price cleanup by months and entities (benchmark: a 6-month CPA catch-up at $1,500–3,500 per a [CPA blog](https://catalyst-cpa.com/real-estate-investor-bookkeeping-setup-2026/), not verified).

**Answers:**
- With AI and US labour, $450–800 holds ≥50% **at 5–20 units only**.
- 50 units needs **~$1,100–1,200** with US labour, or an offshore preparer with you as the reviewer.
- Without AI, only the 5-unit tier at $35/h clears 50%. AI is what makes the US-reviewer model work.
- First 1–2 months per client run at lower margin (setup, rules, questions).

---

## 4. Risks and requirements

| Area | What applies | What to do |
|---|---|---|
| **Trust accounting (PM companies)** | The broker stays liable. California: monthly reconciliation of trust records ([Reg. 2831.2 per DRE materials](https://www.dre.ca.gov/files/pdf/commonviolationsfoundinaudits.pdf)); unlicensed signers only if the broker is bonded (Reg. 2834); reconciliation failures are among common audit findings. Florida: monthly reconciliation an accountant may prepare, but the broker must review, sign and date it ([Florida Realtors](https://floridarealtors.org/law-ethics/library/florida-escrow-laws-rules); rule text 61J2-14.012 **not verified**). Texas: monthly reconciliation under 22 TAC §535.146 (secondary sources, **not verified**). Rules differ by state ([WCG](https://wcginc.com/business-services/property-management-bookkeeping-services/) lists CA/FL/NV/NC differences). The SC buyer explicitly requires SC Real Estate Commission compliance. | Year 1: do not run trust books. If you do PM work later: prepare only, broker signs, never be a signatory, never move money, one state at a time. |
| **Licensing to do the books** | I found no rule requiring a licence to keep books for a PM; the PM's broker licence covers the trust account. **Not verified state by state.** "CPA" and "accountant" titles are regulated. | Call yourself a bookkeeper. Do not say "CPA" unless you are one. |
| **Tax-prep boundary** | Anyone paid to prepare or help prepare federal returns needs a PTIN ([IRS](https://www.irs.gov/tax-professionals/ptin-requirements-for-tax-return-preparers)). Schedule E is part of the 1040. Several Schedule E asks in the sample were for CPAs/EAs ([example](https://www.upwork.com/freelance-jobs/apply/Real-Estate-Tax-CPA-Prior-Year-Returns-Tax-Strategy_~022103930031498201653/), $750 for 3 returns). | Deliver a "CPA-ready Schedule E workpaper" and year-end package only. Partner with 2–3 RE CPAs for the return. |
| **E&O insurance** | Bookkeeper E&O about $300–550/yr for $500K–1M limits ([Insureon](https://insureon.com/finance-accounting-business-insurance/bookkeepers/cost), [Zensurance](https://www.zensurance.com/bookkeeper-insurance); broker figures, **not verified**). | Buy before client #1. Engagement letter with scope, a client-review step, and a liability cap. |
| **Data access** | Bank feeds, QBO, Stessa/REI Hub, AppFolio/Buildium owner portals. Buyers already ask for read-only ("you do not move money", 7-SFR post; "disbursement… remains exclusively with" the PM, 35-door post). | Use accountant/user seats, never shared passwords. Read-only by default. Keep tenant SSNs and screening reports out of the AI pipeline. Use an LLM API with no training on your data. |
| **Errors** | A wrong owner distribution or missed tax bill costs the client real money. | AI drafts; a human reviews every reconciliation. Exceptions list every month. |

**Safest segment to start:** owner-side books for **investors with 5–30 doors** who self-manage or use a third-party PM. No trust funds, no money movement, no tax returns. PM-company trust work is the bigger budget but carries the broker-liability and state-rule load; add it after 6+ months, one state at a time.

---

## 5. What AI adds, and whether buyers care

**What it adds (real):**
- **Speed:** parsing PM owner statements (PDF) into gross-up journal entries, matching lump-sum STR payouts, first-pass categorization. Roughly 35–40% fewer hours in my estimate (table above).
- **The exceptions report:** comparing PM charges to the management agreement, flagging missed autopays and tax bills, month-over-month expense spikes. A BiggerPockets reply suggests exactly this: AI "match[ing] PM statements against bank exports" to produce exceptions ([9-unit thread](https://www.biggerpockets.com/forums/48/topics/1319003-bookkeeping-for-9-units)).
- **The narrative:** a plain-English one-page summary per owner. The 7-SFR buyer wants "exceptions first", and [Rock Real Estate Services' job post](https://www.upwork.com/freelance-jobs/apply/Appfolio-Expert-Monthly-Accounting-and-Migrations_~022103134105314742943/) lists "variance explanations" in owner packages.

**Do buyers care about "AI"? Mostly no.**
- 1 of ~30 tight buyer posts asks for AI.
- Software already sells AI categorization for $0–35/mo (Baselane Smart, Landlord Studio Pro).
- The BiggerPockets [AI operations thread](https://www.biggerpockets.com/forums/899/topics/1319338-utilizing-ai-for-day-to-day-operations) (Nov 7) agrees: AI "organizes and flags", people decide; "a flawed process gets faster with AI, not better".
- An operator in the first pass said "nobody wants to pay for a custom build" for owner packets.

So: **sell the outcome (clean books + exceptions-first owner packet + PM oversight) and a lower price than CPA firms. Use AI to protect margin.** Do not put "AI" in the headline.

---

## 6. Recommended offer, price, first 10 clients, 30-day test

### Offer: "Owner-side books + PM check" for investors with 5–30 doors

- **Who:** out-of-state or busy investors with 5–30 doors, 1–3 PMs or self-managed, on QBO, Stessa, REI Hub or Baselane.
- **Setup / cleanup:** $950 for up to 12 months, 2 entities and 10 doors; +$75 per extra entity-month block. Includes chart of accounts by property, PM-statement gross-up method, and an obligations register (taxes, insurance, registrations).
- **Monthly (close by the 10th):** reconcile banks and cards, gross-up PM statements, check PM fees and repairs against the management agreement, rent roll and delinquency from the PM or rent tool, plus a one-page **exceptions-first owner packet**. Year-end CPA package (Schedule E workpaper, 1099 list).
- **Price:**

| Doors | Monthly | Per door |
|---|---|---|
| up to 10 | $395 | $40–80 |
| 11–25 | $650 | $26–59 |
| 26–50 | $1,050 | $21–40 |

  These sit inside the published market (Steph's $400/$750/$1,200; ProAxis $400–700 for 3–5 SFRs). The 5-door tier is cheaper than $450 to clear the "$300–500 is a big hit" objection. The 50-door tier is priced to keep margin ≥50% with a US reviewer.
- **Guarantee:** first month's fee refunded if the first packet isn't delivered by the 10th business day.
- **Not included:** tax returns, trust accounts, paying bills, tenant contact.

### First 10 clients (named watering holes)

1. **Upwork:** bid only on rental bookkeeping posts with ≥$25/h or a "fixed monthly fee" ask (about 1 a week in this sample, e.g. the [7-SFR](https://www.upwork.com/freelance-jobs/apply/Bookkeeping-Obligations-Monitoring-for-Rental-Portfolio_~022119295707702377238/) and [RI 4-rental](https://www.upwork.com/freelance-jobs/apply/Part-Time-Bookkeeper-Real-Estate-LLCs-Remote_~022109683952417264974/) posts). Skip $4–15/h and $20-fixed posts.
2. **BiggerPockets forums:** answer "bookkeeping for X units" and "PM statements" threads with a worked example, not a pitch. Relevant forums seen: General Real Estate Investing (forum 48), Tax/legal/professionals (517), Landlording & Rental Properties (52), Property Management (899, 80). Expect vendor crowding (6–9 vendor replies per thread).
3. **RE-focused CPAs and EAs:** ask for overflow and cleanup referrals. Names active in BiggerPockets threads include Brick House CPAs, Investor Friendly CPA and WEMBO CPA (company listings seen; not contacted). A CPA's [r/tax post](https://www.reddit.com/r/tax/comments/1xb4yhv/what_would_you_charge_for_a_pain_in_the_behind_client_like_this/) complains about Schedule E clients who "hand in incomplete books". That is your referral pitch.
4. **Local REIAs:** find chapters through National REIA (nationalreia.org; directory not checked). Offer a 20-minute "read your PM statement" talk.
5. **Later, for PM shops:** NARPM chapter affiliate membership; NARPM Discussion Group and Property Management Mastermind on Facebook (sizes not verified; from first pass).
6. **Software communities:** Stessa, REI Hub and Baselane user threads on BiggerPockets ([example](https://www.biggerpockets.com/forums/899/topics/1169274-rei-hub-bookkeeper): "We use REI Hub to manage 12 units… recommendations for a quality bookkeeper"; older thread).

### 30-day test

| Days | Do | Measure |
|---|---|---|
| 1–5 | Build the pipeline on synthetic data: PM statement PDF + bank CSV → categorized entries + exceptions list + one-page packet. Write a sample packet and a 1-page offer. Buy E&O. Draft an engagement letter (no tax prep, read-only). | Time to produce a 10-door packet from raw files (target ≤2.5 h). |
| 6–20 | Send 20 targeted Upwork proposals (≥$25/h or monthly-fee posts only). Post 8 helpful BiggerPockets replies. Ask 10 RE CPAs/EAs for referral calls. Attend 1 REIA meeting. Offer a **$350 paid pilot**: last 3 months' PM statements reconciled + 1 owner packet. | Replies, calls booked, pilots paid. |
| 21–30 | Deliver pilots; log real hours per client. Convert pilots to monthly. | Hours per 10 doors; conversion rate. |

- **Go:** ≥3 paid pilots, ≥2 converted to monthly at ≥$395, and measured review time ≤3 h/mo per 10 doors.
- **Kill or pivot:** fewer than 2 paid pilots after 20 proposals and 10 CPA conversations, or buyers accept only ≤$200/mo. Pivot option: sell the pipeline as a white-label "PM statement → books" tool to existing rental bookkeepers.

---

## 7. Gate 0 scorecard

| Check | Result | Evidence |
|---|---|---|
| 1. Buyers asking (20+ in ~60 days) | ✅ (barely) 27 genuine tight on Upwork (16 investor, 11 PM) + 3 BP + ~4 Reddit; ⚠️ only ~6 at $25+/h; 1 asks for AI | Tables above; 11 likely-fake posts removed |
| 2. Priced competitors (3–5) | ✅ Steph's, ProAxis, Bench, WCG, RemoteBooksOnline live; plus $0–80/mo software. ⚠️ Near-saturated: BP threads draw 6–9 vendor replies; offshore firms sell owner packages at $5–20/h labour | §2 |
| 3. Margin ≥50% at $450–800 | ⚠️ Yes at 5–20 units with AI (50–75%); ❌ 50 units at $800 with US labour (29%) | §3 |
| 4. Named watering holes | ✅ Upwork, BiggerPockets forums 48/52/517/899, RE CPAs, National REIA chapters, NARPM | §6 |

**Verdict: 🟡 RESEARCH SLOT, leaning go.**
- **Deciding reason:** the count now clears 20, but willingness to pay at $450–800 is thin. The evidence supports ~$300–650 for 5–25 doors, with offshore and software anchors below that.
- **Biggest risk:** price compression from offshore bookkeepers and free AI-categorizing software. Second: liability creep into trust accounts and tax prep.
- **Better angle:** owner-side "books + PM check" for 5–30 door investors with third-party PMs, priced $395/$650/$1,050, AI hidden in delivery.
