# Grid Zero: are the five pain points worth paying for?

Checked 2026-11-12. Sources: `pain-evidence.md` (47 Reddit threads, 864 comments, 218 hand-labelled snippets, every quote script-checked against its source), `scan/` (DataForSEO US search volume and CPC), and competitor pricing from third-party pages (links in the chat summary). treg spend about 0.20 USD.

"Tight" means the writer has the problem in their own work. WTP = a snippet showing willingness to pay or current spend.

| # | Pain | Complaints (tight) | Counter-evidence (tight) | WTP | Search signal | Verdict |
|---|---|---|---|---|---|---|
| 5 | One report, each client sees only their rows | 33 (28); about 17 are the exact claim (RLS, embedding, white-label) | 26 (21): AgencyAnalytics, Looker Studio template per client, AI-written PDFs | **23** | "embedded analytics" CPC **113 USD**; "power bi embedded pricing" CPC **135 USD** | **Worth paying for, narrowed** to sharing with external viewers (SaaS customer portals, agencies with data in a warehouse). Proven spend: Metabase gates RLS at Pro ~575 USD/mo; a ~200k USD/yr Metabase quote; Power BI Embedded ~292–730 USD/mo; Sigma ~1,000 USD/creator/yr. |
| 1 | I don't trust the AI's number | 35 (20) | 15 (12): "use a semantic layer", Genie/Omni/Fabric agents work | 2 | "ai dashboard" 3,600/mo **+277%**; surveys: 71% worry about wrong AI numbers (dbt), 51% trust AI insights (insightsoftware) | **Real and growing, but not yet a reason to pay us.** The market answer is "ground the AI in a semantic layer". Claude Data (announced 2026-11-10 per an r/claude thread, not independently verified) ships certified metrics. "Re-tested answers" is new, but **no user asked for it** in our sample. It needs a test before it becomes a headline. |
| 3 | Spreadsheet and dashboard disagree | 31 (26); 15 Excel-specific | 13 (6): all-in-one tools "do nothing well"; mismatches are a definitions problem | 2 | "sigma computing" 9,900 (−39%); "row zero" 1,600 (+29%) | **Real, in a different form:** users drag everything back to Excel ("Spent 3 weeks building a fully automated dashboard, only to be asked for an Export to Excel button", score 193). Make the Excel round-trip a must-have, not the headline. |
| 2 | Data model takes weeks and an analyst | 21 (14) | 10 (9): "The technology is the easy part"; agreeing definitions is the bottleneck | 2 | "semantic layer" 3,600 **+84%**; "dbt semantic layer" **+119%** | **Weak as a headline.** The pain is real for data teams, but buyers blame people and process, not tooling. Auto-inferred modelling supports P1 and P5 rather than selling on its own. |
| 4 | Is this number stale, and what's it based on? | 26 (20) | 5 (3) | **0** | "dashboard data freshness": no searches; "data observability" −46% | **A real annoyance with no budget.** The top answer is a "last refreshed" card. Ship it as polish, not as a selling point. |

## What changes in the positioning

- **Agency buyer:** lead with 5, as proposed, but **not with 2**. Agencies didn't complain about modelling; they complained about time spent on reports and the cost of per-client views. Lead with 5 + time saved, and expect "we already use AgencyAnalytics / Looker Studio" as the main objection.
- **Strongest buyer for 5 is probably not agencies but SaaS teams embedding customer-facing analytics.** That's where the 113–135 USD CPCs and the Metabase/Power BI price complaints are. One 2026 thread describes teams leaving **Metabase signed iframes** over multi-tenant permissions, slow loads and warehouse bills. Grid Zero is built on Metabase, so it must show it fixes exactly that.
- **Data-team buyer:** 1 is the right headline for this audience, but it is unproven. Run a test that measures it: the same 20 questions asked before and after a definition change, showing which answers broke.

## Thin or missing evidence

- No thread where anyone asked for re-testing an AI analyst. That doesn't prove nobody wants it.
- "Filters that silently don't apply" (part of 4): almost no direct evidence.
- WTP is from Reddit comments quoting prices, not from buyers we spoke to.
- Competitor products weren't re-checked today.
