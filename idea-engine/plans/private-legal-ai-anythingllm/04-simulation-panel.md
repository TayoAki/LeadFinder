# 04 · Simulation panel

> **SIMULATED — not demand evidence.** I wrote these personas and played their reactions, grounding each one in real quotes from 01. No real person was contacted. The panel is a way to sharpen the real test, not to replace it.

## Variants shown

| ID | Angle | Price | Pitch line shown to persona |
|---|---|---|---|
| **A · Private & flat** | Privacy + flat fee + your precedents | $999/mo, up to 20 users, setup $3,500, month-to-month | "Your firm's own private AI, deployed in your own Microsoft/AWS tenant, loaded with your templates and matter files. One flat price, no seat minimums, cancel monthly." |
| **B · Small-firm vault** | "Harvey's vault, for a handful of users" | $499/mo, up to 5 users, setup $1,500 | "A private document vault and AI assistant for small firms: upload matters and precedents, get cited answers and drafts in your style. No annual contract." |
| **C · Zero-cloud appliance** | Nothing leaves the building | $1,490/mo + hardware at cost, up to 50 users, setup $7,500 | "An AI server in your office running local models. Client files never touch the cloud. We install, update and monitor it." |

Each persona saw the variants in **order 1: A→B→C** and **order 2: C→B→A**. A pick that changes with order is recorded as a **tie**.

## Personas and reactions

| # | Segment | Persona (grounding quote in 01/03) | Pick, order 1 | Pick, order 2 | Result | Main objection | What would make them reply |
|---|---|---|---|---|---|---|---|
| 1 | S1 mid-size | Managing partner, about 15 attorneys, "fearful of putting client data into any LLM… wants ironclad proof" | C | C | **C** | Hardware cost; "will local models be good enough?" | A one-page data-flow diagram, plus a 30-min call with their IT present |
| 2 | S1 mid-size | Innovation-committee lawyer, about 45 lawyers, "Harvey told us 40 minimum, Legora told us 30" | A | C | **tie A/C** | 20-user cap on A; on C, "local models are weaker than Claude" | A price for 45 users in the email; side-by-side output vs Harvey on their own memo |
| 3 | S2 small litigation | 2-lawyer firm with "6000 pages of medical records… reasonable efforts to maintain the confidentiality" | B | B | **B** | "Are the page cites right?"; "is a cloud tenant 'reasonable efforts'?" | A free chronology of one redacted record set during the pilot |
| 4 | S2 small litigation | PI solo who uses Supio/Eve per case ($250–$350/case) and lost a paralegal | B | B | **B** | "Does it write demand letters like EvenUp?" | Cost per case compared with $250–$750 per demand |
| 5 | S3 insurance defense | Paralegal: "clients (insurance companies) are mandating its use… CoCounsel… twice as long" (influencer, not buyer) | A | C | **tie A/C** | "Carrier says we must use CoCounsel" | A one-pager they can forward to the managing partner |
| 6 | S3 insurance defense | Partner squeezed by carrier flat fees ("no way carriers will allow firms to bill the same amount") | A | A | **A** | Whether carriers allow a non-approved tool | Proof of hours saved on medical-record summaries per file |
| 7 | S4 in-house | GC: "We have 'safe' enterprise versions of ChatGPT and CoPilot. CoPilot sucks" | A | A | **A** | InfoSec review time; "why not just Copilot?" | "Deploys inside your Azure tenant": a security questionnaire answered up front |
| 8 | S4 in-house (edge) | Family-office manager: Harvey and Legora "expensive and only for law firms" | B | B | **B** | Needs drafting of LPAs and SHAs from scratch, not just retrieval over its own documents | Sample LPA draft from their precedent set |
| 9 | S5 estate planning | Estate attorney: WealthCounsel "costly… I don't need two licenses but that is the minimum" | B | B | **B** | "Will it break my templates like Lexis did?" | "Your templates, version-pinned; we never push mandatory updates" |
| 10 | S5 estate planning | Solo hit by the Lexis mandatory template update ("could no longer trust what it produced") | B | B | **B** | Trust after being burned; wants control | Month-to-month terms plus export guarantee |
| 11 | S6 solo | Tech-challenged solo: "absolutely cannot upload any sensitive data… completely tech-challenged" | B | C | **tie B/C** | C costs too much for a solo; B "is still cloud" | A plain-English explainer of where data lives in B |
| 12 | S6 solo (DIY) | Solo who built a 4090 PC to self-host | none | none | **none** | "I can run AnythingLLM myself for $50" | Nothing; disqualify |

## Tally

| Variant | Stable first picks | Ties | Personas where it is first or tied |
|---|---|---|---|
| A · Private & flat ($999) | 2 (#6, #7) | 2 (#2, #5) | 4 |
| B · Small vault ($499) | **5** (#3, #4, #8, #9, #10) | 1 (#11) | **6** |
| C · Zero-cloud ($1,490) | 1 (#1) | 3 (#2, #5, #11) | 4 |
| none | 1 (#12) | — | 1 |

**Revenue-weighted view** (stable pick = full price, tie = half):
- A: 2×999 + 2×0.5×999 = **$2,997/mo**
- B: 5×499 + 0.5×499 = **$2,745/mo**
- C: 1,490 + 3×0.5×1,490 = **$3,725/mo**

## Summary

- **Leading variant by persona count: B (small-firm vault, $499).** It wins most of the small-firm personas because the "Harvey vault but for a handful of users and not as pricey" wish is concrete and the price sits near what solos already pay (CoCounsel ~$400/mo).
- **For the priority segment S1 (mid-size firms), the panel splits between A and C.** The most privacy-anxious buyers prefer **zero-cloud (C)** over "your own tenant" (A). Revenue-weighted, C comes out ahead. The 20-user cap on A is an objection for firms of about 45 lawyers. Add a 21–50-user price point for A ($1,490) or let C absorb that tier.
- **A is the safest second choice.** It was never rejected outright, and insurance defense and in-house buyers prefer it because it fits their existing Microsoft/AWS security review.
- **Strongest segment on this panel: S2 small litigation.** Picks were stable in both orders, it has a monetisable workload (medical records), and there is a clear payback comparison against per-case vendors. S1 is the strongest on revenue per deal.
- **Disqualifier confirmed:** DIY-minded solos will not pay $499–$999 when Mintplex hosts AnythingLLM for $50–$99.

## What the real test must check

1. **A vs C in S1:** when 11–50-lawyer firms are shown both, which one books a call? Does "your own cloud tenant" satisfy the managing partner, or only "on-prem"?
2. **Willingness to pay $499 vs $999 in S2:** does the flat $999 survive when a 2–5-lawyer firm compares it with per-case AI fees?
3. **Page-cite accuracy on real medical records and depositions:** this is the most common objection that could kill a pilot.
4. **Insurance defense carrier rules:** can panel counsel use a non-carrier tool on file work?
5. **Price ceiling for 21–50 users** (persona #2), to decide whether to add an A+ tier.
6. **Whether "month-to-month + export" moves replies.** Lock-in pain was strongest among Lexis and Westlaw research buyers; it is unclear whether it carries over to AI buyers.
