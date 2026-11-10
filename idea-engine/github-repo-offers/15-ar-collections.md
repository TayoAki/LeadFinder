# Niche Scorecard: Invoice Ninja "AR collections" (Gate 0)

Date 2026-11-10 · Offer: invoices with payment links, reminders at 3/7/14/30 days, Claude-drafted escalation emails, a weekly who-owes-you report. For contractors, B2B services, manufacturers and distributors with $50k+ more than 30 days late. Price: $1,000 setup + $300/mo.
Sources: LinkedIn jobs (treg, US, past week, first 40 results), Google SERP of Upwork job pages (treg, past year), Reddit search (treg, past month), live pricing pages, the Invoice Ninja LICENSE file.

| Check | Result | Evidence |
|---|---|---|
| 1. Buyers asking (20+) | 🟡 for human collectors; ❌ for this software | ~10 Upwork AR/collections posts, all wanting a person who calls and emails. "Billing coordinator" posts are mostly law firms on Elite/Aderant. |
| 2. Competitors priced | ✅ but the floor is $0 | QBO automatic reminders are built in. Invoice Ninja hosted is $14/mo. Chaser from $259/mo. Kolleno from $650/mo. |
| 3. Margin ≥50% | ❌ | Setup ~10-25%. Monthly ~0-35%. |
| 4. Watering holes | ✅ | NACM, CFMA, AGC/ABC chapters, r/smallbusiness. |
| Legal | ⚠️ | Invoice Ninja's Elastic License bars running it as a hosted or managed service for third parties. |

## 1. Buyers asking
- **LinkedIn, "billing coordinator", US, past 7 days:** 40 posts on 4 pages (more existed). About 18 are law firms on Elite or Aderant billing (Kirkland & Ellis, Morgan Lewis, Alston & Bird, Quarles & Brady and others), which is the wrong buyer. About 6 are contractors or field service: Siemens, MSS Solutions, Primoris, TK Elevator, West Star Aviation, Inspected. Most of those are large firms with ERPs. **Tight (SMB on QBO): ~2.**
- **Upwork (loose → tight):** a SERP of `upwork.com/freelance-jobs/apply` returned ~10 AR/collections posts, e.g. [Collections Specialist, AR, QuickBooks](https://www.upwork.com/freelance-jobs/apply/Collections-Specialist-Quickbooks_~022110089079353814293/), [AR expert for ongoing work](https://www.upwork.com/freelance-jobs/apply/Accounts-receivable-expert-needed-for-ongoing-work_~022119819882821073686/), [AR Staff – Strong Cold-Calling](https://www.upwork.com/freelance-jobs/apply/Accounts-Receivable-Staff-Strong-Cold-Calling-Background-Required_~022117331239565994614/) and [AR/Billing & Collections CSR – LATAM](https://www.upwork.com/freelance-jobs/apply/Accounts-Receivable-Billing-Collections-CSR-LATAM_~022114936923503923508/). Every one wants a **human** to phone and chase. None asks for reminder software.
- **Budget seen:** [AR & Collections Specialist, $500-1K/mo part-time](https://www.upwork.com/freelance-jobs/apply/Accounts-Receivable-Collections-Specialist-Remote-500-Part-Time_~021985798019124083762). Buyers pay a person less than or about the same as his $300/mo plus setup.
- **Reddit, past month:** r/smallbusiness ["Can I just rant about customers not paying invoices on time?"](https://www.reddit.com/r/smallbusiness/comments/1x35q9i/can_i_just_rant_about_customers_not_paying/) shows the pain is real but is a vent, not a request. r/Bookkeeping "accounts receivable collections" returned 3 posts, none of them a buyer.
- **Tight count (an SMB asking for automated dunning to be set up): 0 found.** Upwork search pages return 403 to fetches, so a full count is not verified.

## 2. Competitors (live prices)
- **QuickBooks Online, built in:** automatic invoice reminders, up to 3 per invoice, scheduled up to 90 days before or after the due date ([Intuit help](https://quickbooks.intuit.com/learn-support/en-us/help-article/invoicing/send-invoice-reminders-automatically-manually/L84cQjpxo_US_en_US)). Payment links come with QB Payments. Intuit's Payments Agent "creates, sends, and follows up on customer invoices" ([Intuit](https://quickbooks.intuit.com/global/resources/product-update/intuit-ai-agents-quickbooks/)). **For a QBO shop the reminders and the aging report already exist at $0 extra.**
- **Invoice Ninja hosted** ([pricing](https://invoiceninja.com/pricing-plans/)): Pro $14/mo or Enterprise $18/mo, auto-reminders included.
- **Chaser** ([pricing](https://chaserhq.com/en-gb/pricing)): Compact $259/mo, Core $779/mo, Complete $1,169/mo, tiered by revenue.
- **Kolleno** ([pricing](https://www.kolleno.com/pricing)): $650/mo (≈$545 billed annually) and $1,245/mo.
- **Upflow** ([pricing](https://upflow.io/pricing)): quote only, tiered by invoiced revenue (Starter up to $10M). Payments add-on platform fee $390/mo.
- **Invoiced:** from ~$39/user/mo per third parties ([SelectHub](https://www.selecthub.com/p/invoice-software/invoiced/)); not verified live.
- **Human alternative:** offshore AR VAs at $500-1K/mo (Upwork, above).
- **Floor: $0 (QBO) / $14 (Invoice Ninja). The mid-market SaaS starts at $259.** His $300 sits at Chaser's price but without Chaser's product depth.

## 3. Margin (at $1,000 + $300/mo; $75/h loaded)
- **Setup:** Invoice Ninja deploy, gateway (Stripe) account, customer import, reminder templates, QBO sync (Invoice Ninja's native QBO sync: not verified; likely custom glue or double entry), escalation prompts, kickoff and training: ~10-12 h = $750-900. **10-25%.**
- **Monthly:** hosting $15-30 + LLM ~$5 + weekly report review 0.5 h/wk + reviewing escalation drafts before they go to the client's customers 1 h/wk + breakage and support 1 h = ~7 h ≈ $525. That is **negative**. Trimmed to 3 h, the cost is ~$260, a **~13%** margin.
- **Hidden cost:** moving invoicing out of QBO, ServiceTitan or Procore into Invoice Ninja creates double entry for the client's bookkeeper.
- **Fails 50%.**

## 4. Watering holes
- NACM (National Association of Credit Management) and its affiliates (credit managers at distributors and manufacturers)
- CFMA (construction controllers)
- AGC / ABC local chapters (contractors)
- r/smallbusiness and r/Construction
- Upwork AR/collections job feed (as a lead list of firms that pay for chasing)

## Attention (30-day)
The pain is constant (late payment rants). The tooling is saturated: QBO, Xero, Invoice Ninja, Chaser, Upflow, Kolleno, Invoiced, Versapay, Gaviti. How many course sellers pitch the same offer: not verified.

## The video's claims vs the evidence
- **Repo is real:** [invoiceninja/invoiceninja](https://github.com/invoiceninja/invoiceninja), ~10.5k stars. It is **source-available, not open source**. The [Elastic License](https://github.com/invoiceninja/invoiceninja/blob/v5-develop/LICENSE) says "You may not provide the software to third parties as a hosted or managed service…". Hosting it for paying clients is the exact use it forbids. The workaround (each client self-hosts it, or buys Invoice Ninja's own hosted plan and you configure it) removes the reason to pay $300/mo.
- "Billing coordinator posts = leads": in our sample they are mostly law firms on legal billing systems.

## Verdict: ❌ REJECT
Fails check 3 (margin) and check 2's price cap (built into QBO at $0). There is also a license problem.

**Better angle (research slot only):** sell **outcomes, not software**. A done-for-you collections desk for contractors on QBO: a human plus AI drafts, phone follow-up, lien-deadline tracking (preliminary notices and mechanic's liens). Price it on a retainer or a % of cash recovered over 60 days. Buyers already pay humans $500-1K/mo for this.
