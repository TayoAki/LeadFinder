# 04 — Simulation panel

> **SIMULATED — NOT DEMAND EVIDENCE.** These are personas I role-played from the real quotes in `01-pain-points.md`. Nobody was contacted. The picks below are my judgement of how each quoted buyer would react. Use this file only to choose what the real test measures first.

## Variants shown

| | Angle | Headline | Price |
|---|---|---|---|
| **A** | Price cap | "Your helpdesk and AI agent for one flat price. No per-resolution fees, ever." | 599 USD/mo (up to 10 agents, 3,000 AI resolutions fair use) + 1,500 USD migration |
| **B** | Renewal escape | "Leave Zendesk at your renewal. We migrate tickets, macros and help centre in 7 days. Month-to-month, cut seats any day, cancel by email." | 599 USD/mo + 1,500 USD migration, paid at cut-over |
| **C** | AI included, no setup fee | "An AI agent that answers your repetitive tickets, included, with migration free. You see the real resolution rate every month." | 799 USD/mo, no migration fee, 12-month term |

**Method:**
- Each persona saw the variants in two orders: **A → B → C** and **C → B → A**.
- A pick that changes with order counts as a **tie**.
- Persona facts are taken from the linked post. Anything I added is marked *(assumed)*.

## Personas and results

| # | Segment | Persona (source quote) | Order A-B-C pick | Order C-B-A pick | Result | Main objection | What would make them reply |
|---|---|---|---|---|---|---|---|
| P1 | S3 renewal-trapped | Ops lead who couldn't cut seats at renewal: "Zendesk won't let me reduce seats despite me starting account review conversations 2+ months before my end date" ([src](https://www.reddit.com/r/Zendesk/comments/1tqn39z/zendesk_is_a_scam/)) | B | B | **B** | "How do I know you won't do the same in a year?" | A written 24-month price lock and seat-down clause in the first email. A renewal-date calendar offer. |
| P2 | S3 renewal-trapped | Admin at a growing firm, "bill has climbed to around $5,000 per month", needs light agents at $89 ([src](https://www.reddit.com/r/Zendesk/comments/1gjckww/zendesk_is_becoming_too_expensive_for_our_company/)) | A | B | **Tie A/B** | "We'd lose features we currently use" (said in thread). With about 24 agents, the 10-agent price doesn't apply to them. | A feature-by-feature check of their used Zendesk features. A Switch 25 quote with "light agents free". |
| P3 | S1 DTC | Mid-size Shopify brand: "gorgias is charging us a fortune because their system counts basic automated order tracking emails as 'tickets'" ([src](https://www.reddit.com/r/ChoosingVendors/comments/1uzo1zv/gorgias_ticket_volume_pricing_is_killing_our/)) | A | A | **A** | "Does it pull Shopify order data like Gorgias?" | A screenshot of the Shopify order sidebar. "Shipping notifications are not tickets." |
| P4 | S1/S6 DTC + WhatsApp | Two-person store, 500 orders/month, WhatsApp on a phone: "with the amount of messages I manage it just becomes too financially inefficient" ([src](https://www.reddit.com/r/ecommerce/comments/1w7eiml/omnichannel_customer_service/)) | none | none | **No pick** | 599–799 USD is far above what a 2-person team spends *(assumed: their current spend is unknown)*. | Switch 5 at 349 USD, or less. WhatsApp + IG + email in one inbox, set up for them. |
| P5 | S2 SaaS | 2-agent B2B SaaS on Zendesk + Intercom, ~1,900 tickets/month, did the AI arithmetic ([src](https://www.reddit.com/r/SaaS/comments/1tadxgf/migrating_from_zendesk_intercom_anyone_using_ai/)) | A | C | **Tie A/C** | "Deflection rate on our B2C end-user tickets": they'll only believe a measured rate. | A free pilot on last month's tickets with a published resolution rate. |
| P6 | S2 SaaS | Lead of an 8-agent support team: "Zendesk AI keeps replying but never actually finishes the job" ([src](https://www.reddit.com/r/Zendesk/comments/1u8iz68/zendesk_ai_keeps_replying_but_never_actually/)) | C | C | **C** | "Will your AI also tag, update the CRM and summarise?" | AI that does the after-work (tags, CRM field, summary), shown on their ticket types. |
| P7 | S4 repriced | Help Scout customer, 2 support staff, plan going "from 1500 a year to over 7500 a year" ([src](https://www.trustpilot.com/reviews/6807d35d0cb51a0076082e5c)) | B | B | **B** | "Customers hate not talking to an actual person": they don't want AI pushed. | Switch 5 at 349 USD with AI off by default. Docs migration included. |
| P8 | S5 high-volume | Fin customer whose bill "roughly tripled as we have scaled"; "My CFO is breathing down my neck" ([src](https://www.reddit.com/r/intercom/comments/1u9xxgm/has_anyone_genuinely_cut_their_fin_bill_in_half/)) | C | C | **C** | "CSAT tanks in the reviews": quality loss, plus the fair-use cap is far below their volume. | A side-by-side CSAT/resolution trial and a custom flat quote at their volume. |

**S7 (BPO):** no persona, because no real quote exists in 01. Building one would be invention.

**S8 (MSP):** disqualified in 03.

## Summary

| Variant | Stable wins | Ties involved | Segments where it led |
|---|---|---|---|
| A, price cap | 1 (P3) | 2 (P2, P5) | S1 Gorgias DTC |
| **B, renewal escape** | **2 (P1, P7)** | 1 (P2) | **S3, S4** |
| C, AI included at 799 | 2 (P6, P8) | 1 (P5) | S2, S5 |
| No pick | 1 (P4) | | Small WhatsApp shops |

**Readout (simulated):**
- **Leading variant: B, the renewal escape, for the priority segment S3.** It is the only variant whose wins come from the largest identifiable pool (8,864 US Zendesk companies). It also matches the #2 tight pain (contract terms), which none of the competitors' "cheaper" pitches address.
- **A wins where usage billing per ticket bites** (Gorgias). Use A's line as the *second* sentence of B, not as a separate campaign.
- **C wins only where AI volume is already being paid for** (S2/S5). Even there, every persona's condition is a **measured pilot**. The 799 USD no-setup price isn't what drives it; the proof is.
- **The 10-agent, 599 USD price is wrong for 2–3 agent teams** (P4, P7 needed Switch 5). That supports the three-tier change in 02.

## What the real test must check

1. **Angle:** do B-angle emails (renewal/contract terms) get more positive replies than A-angle emails (flat price, no per-resolution fee) among S3 Zendesk users? Run a split cold-email test, about 250 sends per arm (see 05).
2. **Renewal-date answer rate:** what share of replies will tell us their renewal month? This is what makes S3's urgency usable.
3. **Price tolerance by team size:** what share of positive replies come from 2–5 agent teams, and do they balk at 349 USD?
4. **AI proof:** of S2/S5 replies, how many ask for a pilot, and what resolution rate does the pilot actually reach on their tickets?
5. **Feature blockers:** how often do SSO, SLAs or voice come up as must-haves? This decides whether we need a Chatwoot Enterprise licence (02).
