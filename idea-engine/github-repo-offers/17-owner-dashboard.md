# Niche Scorecard: Metabase "owner dashboard" (Gate 0)

Date 2026-11-10 · Offer: QuickBooks + CRM + ad accounts in one dashboard of 5-10 key numbers, plus a Monday email. For $2-20M businesses with 20-100 staff (contractors, multi-location clinics, distributors, manufacturers). Price: $2,500 setup + $400/mo.
Sources: LinkedIn jobs (treg, US, past week, first 40 results), Google SERP of Upwork job pages (treg, past year), Reddit search (treg, past month), live pricing pages, Metabase docs.

| Check | Result | Evidence |
|---|---|---|
| 1. Buyers asking (20+) | 🟡 | ~5 tight Upwork owner/KPI dashboard posts in one SERP page; Upwork shows a "941 KPI Reporting jobs" sample (undated). LinkedIn "reporting analyst" posts are almost all enterprises. |
| 2. Competitors priced | ✅ | Reach Reporting $149-550/mo. Databox $0-319/mo. Fathom $450/mo for 25 companies. LivePlan $20-40/mo. Fractional CFOs $2-5k/mo with a dashboard bundled. |
| 3. Margin ≥50% | 🟡 borderline | Setup ~10-25% on the first clients. Retainer ~30-60%. Year-one blended ~40%. |
| 4. Watering holes | ✅ | Vistage, EO, Nexstar Network, Service Roundtable, MGMA, CFMA. |

## 1. Buyers asking
- **Upwork, tight (an owner wants a KPI or owner dashboard over finance plus operations data).** From one SERP page of `upwork.com/freelance-jobs/apply` "QuickBooks KPI dashboard":
  - [Clinic Management Reporting & Profitability Dashboard (Excel + QuickBooks, hourly)](https://www.upwork.com/freelance-jobs/apply/Clinic-Management-Reporting-Profitability-Dashboard-Excel-QuickBooks-Hourly_~022118331929771556609/): revenue per visit, provider utilization, gross margin, EBITDA. This is exactly the ICP.
  - [Multi-Tenant KPI Dashboard & Data Pipeline](https://www.upwork.com/freelance-jobs/apply/Full-Stack-Developer-Multi-Tenant-KPI-Dashboard-Data-Pipeline-Audit-First_~022119229758487358597/): sales, average ticket, labor %.
  - [Google Sheets + Looker Studio daily owner dashboard](https://www.upwork.com/freelance-jobs/apply/Google-Sheets-Looker-Studio-Daily-Dashboard-Builder_~022118843431947968244/)
  - [Building Odoo / Metabase Dashboards](https://www.upwork.com/freelance-jobs/apply/Building-Odoo-Metabase-Dashboards_~022109264629973438526/)
  - [Senior Data Analyst (Claude expert), metrics dictionary](https://www.upwork.com/freelance-jobs/apply/Senior-Data-Analyst-Analytics-Engineer-Claude-Expert_~022115672764985021380/): $35-8x/h (rate partly cut off in the snippet).
  - **Tight: ~5 on one page. A 30-60 day total is not verified**, because Upwork search pages return 403 to fetches.
- **Upwork, loose:** the [KPI Reporting category](https://www.upwork.com/en-gb/freelance-jobs/kpis/) cites "941 KPI Reporting jobs"; the window and posting dates are not verified. One sample is a fixed-price $300 budget tracker, so freelance budgets skew low.
- **LinkedIn "reporting analyst", US, past 7 days:** 40 posts, nearly all enterprise or government (EchoStar, Chubb, Fidelity, state agencies). **0 clearly at $2-20M firms.** The "lead = reporting analyst job post" idea does not fit the ICP: firms of 20-100 staff rarely hire a reporting analyst.
- **Reddit, past month:** r/smallbusiness "dashboard KPI QuickBooks" returned 1 post, not a buyer request.

## 2. Competitors (live prices)
- **Reach Reporting** ([pricing](https://www.reachreporting.com/pricing)): $149/mo for 1 connection, $290 for 10, $550 for 25. Sources are QBO, QB Desktop, Xero, Gusto and Sheets; no CRM or ads.
- **Databox** ([pricing](https://databox.com/pricing)): Free (3 sources), Analyst $71, Team Core $199, Team Scale $319 per month (annual). HubSpot and Facebook Ads connectors on all plans. Done-for-you setup only on the quote-only Custom plan.
- **Fathom** ([pricing](https://www.fathomhq.com/pricing)): Pro $450/mo for 25 companies (~$18 each). It is sold to accounting firms, who resell reporting. Accounting data only.
- **LivePlan:** $20 / $40 per month; dashboards on Premium ([Capterra](https://www.capterra.com/p/142049/LivePlan/pricing/), third-party).
- **Fractional CFO retainers:** ~$2-5k/mo for small businesses, with a KPI dashboard as a standard deliverable ([beancount.io](https://beancount.io/blog/2026/08/12/fractional-cfo-services-small-business-guide), [eightx](https://eightx.co/blog/average-fractional-cfo-engagement-size-by-stage)). These are vendor benchmarks.
- **Saturation:** Upwork and Fiverr carry many identical "QuickBooks → Power BI executive dashboard" gigs ([example](https://www.upwork.com/services/product/development-it-automated-financial-dashboards-quickbooks-online-power-bi-specialist-1938345936902049583)), well over 15. Generic positioning is saturated; niche down.
- **Free in the stack:** QBO has built-in reports, and Databox's free tier covers 3 sources. Neither joins QBO with CRM and ad spend into "cost per job won", which is the gap he sells.

## 3. Margin (at $2,500 + $400/mo; $75/h loaded)
- **Setup (first clients):** ETL for QBO + CRM + 2 ad accounts. Metabase has **no native QuickBooks connector**; it needs Airbyte (QBO connector is alpha; refresh tokens expire after 100 idle days) or Fivetran into Postgres ([Metabase docs](https://www.metabase.com/integrations/quickbooks)). Then metric definitions with the owner and controller, 5-10 cards, the Monday email and QA: ~25-30 h = $1,875-2,250. **10-25%.** With templates after 3-5 clients in one vertical, ~15 h → **55%**.
- **Monthly:** Metabase + Postgres hosting $25-50, ETL (self-hosted Airbyte on the same box, or Fivetran; Fivetran price not verified) $0-100, LLM for the Monday email ~$5, pipeline breakage and connector re-auth 1.5-2 h, monthly review call 0.5-1 h → $175-325. **~20-56%.**
- **Year one:** revenue $7,300; cost ~$4,000-5,000 → **~32-45%.** Passes only once the setup is templated and the vertical is narrow.
- **Obligations:** read-only finance and ad data, but still OAuth tokens for QBO, CRM and ads held centrally. Metabase OSS is AGPL, which is fine for hosting unmodified. Embedding or white-labelling needs Metabase's commercial license ([repo](https://github.com/metabase/metabase)).

## 4. Watering holes
- Vistage and EO (Entrepreneurs' Organization) chapters: $2-20M owners
- Nexstar Network, Service Roundtable, ACCA, PHCC: home-service contractors
- MGMA: multi-location medical groups and clinics
- CFMA and AGC chapters: construction controllers
- Upwork KPI/dashboard job feed (posts with clinic or contractor context)

## Attention (30-day)
Buyer asks are steady but small and scattered. Seller supply is large (Power BI and Looker gigs, Databox and Reach partners, fractional CFOs). How many course sellers pitch "Metabase dashboards": not verified.

## The video's claims vs the evidence
- **Repo is real:** [metabase/metabase](https://github.com/metabase/metabase), ~50.3k stars, AGPL-3.0 plus commercial editions. It is a BI front end only; "QuickBooks + CRM + ads" requires a separate ETL layer that he does not mention.
- "Reporting analyst job posts = leads" is false for this ICP. The posters are enterprises.

## Verdict: 🟡 RESEARCH SLOT
Demand exists, with ICP-fit Upwork posts (clinic profitability dashboard) and a money signal from fractional CFO retainers of $2-5k/mo that include dashboards. It is under 20 tight on what we could verify, and margin passes only after templating.

**Better angle:** one vertical, one template. Example: "Owner scorecard for HVAC/plumbing shops on ServiceTitan + QBO" or "Multi-location clinic profitability dashboard". Same price, sold through Nexstar, Service Roundtable or MGMA. Or sell it white-label to fractional CFO and bookkeeping firms, who already charge for the dashboard.
