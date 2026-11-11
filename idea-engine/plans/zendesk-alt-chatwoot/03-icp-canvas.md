# 03 — ICP canvas

## Sources and conventions

**Counting sources:**
- **CBP:** US Census County Business Patterns 2022, all legal forms (`lfo='-'`), US total, read from `cbp22us.txt`.
  - These are **establishments, not firms**. Size bands are employees per establishment.
- **TheirStack:** technographic company counts inferred from job postings. Calls are saved in `data/raw/techno/`:
  - `ts_us_zendesk_10_500.json`
  - `ts_us_zendesk_software.json`
  - `ts_us_zendesk_retail.json`
  - `ts_us_gorgias.json`
  - `ts_kw_*.json`
  - **These are lower bounds:** a company appears only if it has posted a job mentioning the tool.
- **DataForSEO:** domains where the Zendesk script/widget is detected, saved in `data/raw/techno/summary_Zendesk.json`:
  - US 2,194 domains (also a lower bound)
  - Gorgias returned 1 US domain, so DataForSEO's Gorgias detection is unusable.

**Pain quotes** come from `01-pain-points.md` / `data/complaints_labelled.json` and are verbatim.

**Standard contact recipe** (all segments; treg endpoints, nothing sent):
1. **Company list:** see the segment.
2. **Decision maker:**
   - `treg.people.search` on the company domain with titles such as Head/Director of Customer Experience, Customer Support Manager, Head of Support, VP Customer Success, COO (≤50 staff: Founder/Owner).
   - Merge with `exa.people.search`.
3. **Email:** `treg.people.email.find` with `X-Treg-Route-Verify: true`. Send only to `valid`. `catch_all` is risky, so cap it at 10% of a batch.
4. **Phone:**
   - Direct line: `treg.people.phone.find` with the live-line check. A "live" result is not proof the number is that person's.
   - Switchboard: `treg.google.serp.maps` / the website contact page.
5. **Before any send:** suppression list, unsubscribe link and a physical address (CAN-SPAM).

---

## S1. Shopify/DTC brands with 2–15 support agents on Gorgias or Zendesk

- **Who:**
  - Founder, COO or CX lead at a DTC brand doing roughly 2–50M USD a year.
  - Support covers order status, returns, product questions.
  - Channels: email, chat, Instagram/Facebook DMs, sometimes WhatsApp.
- **Firmographics:**
  - Shopify (or Woo/BigCommerce), 10–200 staff, 2–15 agents (often an outsourced CSA).
  - 1,000–10,000 tickets a month, seasonal peaks.
- **Pain, in their words:**
  - "gorgias is charging us a fortune because their system counts basic automated order tracking emails as 'tickets'" ([r/ChoosingVendors](https://www.reddit.com/r/ChoosingVendors/comments/1uzo1zv/gorgias_ticket_volume_pricing_is_killing_our/))
  - "The pricing and complexity feels like it was designed for a company with a dedicated support ops team" ([r/helpdesk](https://www.reddit.com/r/helpdesk/comments/1sgbtvn/is_zendesk_alternative_territory_worth_exploring/))
  - "I have attempted to use gorgias, but with the amount of messages I manage it just becomes too financially inefficient" ([r/ecommerce](https://www.reddit.com/r/ecommerce/comments/1w7eiml/omnichannel_customer_service/))
  - "Zendesk vs Gorgias for e-commerce helpdesk (Shopify) — worth paying triple?" ([r/CRM](https://www.reddit.com/r/CRM/comments/1n721jr/zendesk_vs_gorgias_for_ecommerce_helpdesk_shopify/))
- **Trigger events (detectable):**
  - Gorgias/Zendesk help centre live (SERP `site:zendesk.com "where is my order"` or `site:gorgias.help`).
  - Hiring a "customer experience associate" with Zendesk/Gorgias in the posting (TheirStack jobs).
  - Q4 peak planning (Aug–Oct).
  - Turning on the Gorgias AI Agent (it counts as tickets plus resolutions).
- **Watering holes:**
  - Subreddits: r/shopify, r/ecommerce, r/ChoosingVendors, r/shopify_store_owners.
  - Communities: DTC Twitter/X, the 2PM newsletter, the Shopify Community forums, eCommerceFuel.
- **Budget behaviour:**
  - Monthly card payments, little procurement.
  - Watches cost per ticket against margin.
  - Will pay for a done-for-you setup if it lands before peak season.
- **Objections + counters:**
  - *"Gorgias does Shopify actions inside the ticket."* → We show Shopify order lookup and refund links in the sidebar, and AI order-status answers, in the pilot. Don't claim refunds-from-ticket until it's built.
  - *"Mid-season migration is risky."* → Parallel run, cut-over in a quiet week, 7-day guarantee.
  - *"Freshdesk/Chatwoot are cheaper."* → Correct at low volume. We include the AI agent, migration and running it.
- **Disqualify if:**
  - fewer than 300 tickets/month (they should use Shopify Inbox)
  - needs voice in the helpdesk
  - more than 25 agents
  - happy with Gorgias with no AI turned on
- **US count:**
  - CBP 454110 (electronic shopping) establishments with 10–499 employees: **7,645**. This undercounts DTC brands classed as manufacturers.
  - TheirStack US companies with Gorgias: **1,120**. US retail companies with Zendesk, 10–500 staff: **181**.
- **How to find email + phone:**
  - Domains from:
    - `treg.google.serp.organic` with `site:zendesk.com "where is my order"` / `"return policy"` and `site:gorgias.help`. A test call returned Zendesk-hosted brand help centres (Relax The Back, Bulova, Jigsaw), see `data/raw/techno/serp_zendesk_hc_wismo.json`.
    - `theirstack.companies.search` with `company_technology_slug_or:["gorgias"]`, `company_country_code_or:["US"]` (0.06 USD per company).
  - Then the standard recipe.

## S2. B2B SaaS with 2–10 support agents running Zendesk (often plus Intercom)

- **Who:** Head of Support / CS lead or COO at a SaaS company with 20–300 staff and a small support team.
- **Firmographics:**
  - 1,000–5,000 tickets a month, many repetitive "how do I".
  - Zendesk for tickets plus Intercom for chat/knowledge base is common.
- **Pain, in their words:**
  - "Zendesk AI charges ~$1.50 per automated resolution (committed) or $2.00 pay-as-you-go... that's ~$1,425–1,900/month just for AI on top of our existing plan" ([r/SaaS](https://www.reddit.com/r/SaaS/comments/1tadxgf/migrating_from_zendesk_intercom_anyone_using_ai/))
  - "They don't charge the 'per resolution' balloon that drove us off Intercom" ([r/SaaS](https://www.reddit.com/r/SaaS/comments/1tadxgf/migrating_from_zendesk_intercom_anyone_using_ai/otf91pm/))
  - "I run a support team of eight at mid sized Saas... my team's hours did not really go down" ([r/Zendesk](https://www.reddit.com/r/Zendesk/comments/1u8iz68/zendesk_ai_keeps_replying_but_never_actually/))
- **Trigger events:**
  - Zendesk/Intercom renewal (ask).
  - The AI pricing switch (Zendesk per-resolution since May 2026).
  - Posting a support-ops/Zendesk-admin job.
  - Funding round (support headcount grows).
  - Intercom-Salesforce ownership change (Jun 2026). An r/salesforce post with 44 comments links [the announcement](https://x.com/eoghan/status/2066491567452680202). The deal is reported, but it is **unverified** as a switching trigger.
- **Watering holes:**
  - r/SaaS, r/CustomerSuccess, r/Zendesk, r/intercom
  - Support Driven community, CX Accelerator, SaaStr, LinkedIn CS groups
- **Budget behaviour:**
  - The CFO watches the AI line item ("My CFO is breathing down my neck to bring the number down").
  - Annual contracts are common. Procurement is light under 20k USD a year.
- **Objections + counters:**
  - *"We need SSO/audit logs."* → Not in MIT core. Disqualify for now, or license Chatwoot Enterprise.
  - *"Our AI resolution rate will drop."* → Pilot on a copy of last month's tickets, then publish the measured rate before cut-over.
  - *"Integrations with Jira/Linear/Slack."* → Chatwoot has Slack and webhooks. Linear/Jira through the API, built by us.
- **Disqualify if:**
  - needs SOC 2 reports from the helpdesk vendor on day one
  - more than 25 agents
  - uses Zendesk Sunshine/custom objects heavily
- **US count:**
  - CBP 511210 (software publishers) establishments with 10–499 employees: **5,757**.
  - TheirStack US software-development companies with Zendesk, 10–500 staff: **1,485**.
- **How to find email + phone:** `theirstack.companies.search` with `company_technology_slug_or:["zendesk","intercom"]`, `industry_id_or:[4]`, US, 10–500 staff (0.06 USD per company), then the standard recipe.

## S3. Zendesk "renewal-trapped" SMB and mid-market (horizontal, 10–500 staff)

- **Who:** The owner of the Zendesk contract (ops manager, CX lead, IT/admin) at any company where Zendesk serves external customers.
- **Firmographics:**
  - 3–25 agents, Suite Team/Professional, often over-licensed.
  - Seasonal staffing ("CS staff that rises and falls").
- **Pain, in their words:**
  - "Zendesk won't let me reduce seats despite me starting account review conversations 2+ months before my end date" ([r/Zendesk](https://www.reddit.com/r/Zendesk/comments/1tqn39z/zendesk_is_a_scam/))
  - "We will complete the year and get off this gym membership style contract forever" ([r/Zendesk](https://www.reddit.com/r/Zendesk/comments/19dpvnh/zendesk_auto_renewed_us_into_a_3_year_locked_down/kj9wwne/))
  - "our Zendesk bill has climbed to around $5,000 per month (not including add-ons)" ([r/Zendesk](https://www.reddit.com/r/Zendesk/comments/1gjckww/zendesk_is_becoming_too_expensive_for_our_company/))
- **Trigger events:**
  - Renewal 30–90 days out. This isn't visible externally: ask in the first touch ("When does your Zendesk renew?").
  - New Zendesk job posts (TheirStack: 1,057 companies newly found in the last week, globally).
  - Layoffs or seat shrinkage.
- **Watering holes:**
  - r/Zendesk (where the renewal complaints live), r/sysadmin, r/ITManagers
  - LinkedIn (ops/CX titles), G2 "Zendesk alternatives" pages
- **Budget behaviour:**
  - Already budgets 1–10k USD a month.
  - The switch decision is timed to the renewal. Notice deadlines create urgency.
- **Objections + counters:**
  - *"We're locked in until X."* → We plan the migration to land the week before notice is due. Book a slot now and pay the migration on cut-over.
  - *"Zendesk will discount us."* → Good for you. Our price is public and locked for 24 months.
- **Disqualify if:**
  - uses Zendesk Talk/contact centre as core
  - multi-brand enterprise with more than 25 agents
  - Zendesk is an internal IT helpdesk (wrong product)
- **US count:** TheirStack US companies with Zendesk, 10–500 staff: **8,864**. DataForSEO US domains with the Zendesk script: 2,194.
- **How to find email + phone:**
  - `theirstack.companies.search` (US, Zendesk, 10–500).
  - `treg.google.serp.organic` with `site:zendesk.com/hc/en-us` plus industry words.
  - `dataforseo.x.domain-analytics-technologies-domains-by-technology-live` with `technologies:["Zendesk"]`, `country_iso_code = US` (billed per domain returned).
  - Then the standard recipe.

## S4. Small teams hit by a Help Scout or Freshdesk repricing

- **Who:** Owner or CS lead of a 2–10 agent team on Help Scout or Freshdesk who just got a new price.
- **Pain, in their words:**
  - "'upgrading' our plan from 1500 a year to over 7500 a year" ([Trustpilot, Help Scout](https://www.trustpilot.com/reviews/6807d35d0cb51a0076082e5c))
  - "you're now charged by customer interaction. It makes the costs unpredictable" ([r/SaaS](https://www.reddit.com/r/SaaS/comments/1jzznjb/helpscout_is_significantly_raising_its_prices_out/))
  - "the reseller has given us a 35% price increase" ([r/msp](https://www.reddit.com/r/msp/comments/1w6x622/freshdesk_35_price_increase/))
  - "I was charged 50% more than my 'Plans and Billing' rate" ([r/msp](https://www.reddit.com/r/msp/comments/1vt3e57/freshdesk_renewal_price_increase_with_no_prior/))
- **Trigger events:**
  - A vendor price-change announcement.
  - Removal of a free tier: "Freshdesk ticketing no longer free" ([r/sysadmin, Aug 2026](https://www.reddit.com/r/sysadmin/comments/1vrm0yv/freshdesk_ticketing_no_longer_free_alternatives/)).
- **Watering holes:** r/SaaS, r/msp, r/sysadmin, r/smallbusiness, Help Scout/Freshdesk community forums
- **Budget behaviour:** Price-sensitive (used to paying 300–1,500 USD a year). **Our 349 USD/month is a step up for some.**
- **Objections + counters:**
  - *"You cost more than we paid."* → True for some. Lead with migration, the AI included and no surprises.
  - Qualify on spend after the increase.
- **Disqualify if:**
  - pays under 2,000 USD a year after the increase
  - uses the tool as an internal IT desk
- **US count:**
  - **Not measured in US.** TheirStack global: Freshdesk 14,872 companies; Help Scout 1,376 (job-post detected, `ts_kw_*.json`).
  - A US filter costs one 0.06 USD call each: next step.
- **How to find:**
  - `theirstack.companies.search` with `company_technology_slug_or:["help-scout","freshdesk"]`, US.
  - Help Scout Docs sites via SERP `site:helpscoutdocs.com`.
  - Then the standard recipe.

## S5. Consumer apps, subscriptions and marketplaces with high-volume repetitive tickets

- **Who:** Head of Support/Ops at an app or marketplace with tens of thousands of end users, where most tickets are login, billing and cancellation.
- **Pain, in their words:**
  - "out of our ~1,900 tickets/month, roughly 1,700 are from our customers' end users (B2C side)... the deflection math is exactly what pushed us away from Zendesk AI and Intercom Fin" ([r/SaaS](https://www.reddit.com/r/SaaS/comments/1tadxgf/migrating_from_zendesk_intercom_anyone_using_ai/ollsjmf/))
  - "We tested it with the 20,000 tickets per month we currently receive, and it was expensive" ([r/Zendesk](https://www.reddit.com/r/Zendesk/comments/1t4g4xt/is_there_a_costeffective_ai_agent_for_zendesk/omzlllk/))
  - "the bill has roughly tripled as we have scaled" (Fin, [r/intercom](https://www.reddit.com/r/intercom/comments/1u9xxgm/has_anyone_genuinely_cut_their_fin_bill_in_half/))
  - Their end users complain on Trustpilot about Zendesk-run support (Brainbloom, PDC TV examples in `data/corpus_raw.json`).
- **Trigger events:**
  - AI bill growth; a new AI vendor RFP.
  - App-store review spikes about support.
  - Hiring support agents.
- **Watering holes:** r/Zendesk, r/intercom, r/AI_Customer_Support, Support Driven
- **Budget behaviour:** Already spends on AI per resolution. **Fair-use caps (3,000–8,000) are too low for 20k tickets a month:** quote custom.
- **Objections + counters:**
  - *"Our volume breaks your fair use."* → Custom flat tier priced on measured volume, still with no per-resolution billing.
- **Disqualify if:**
  - more than 20,000 AI conversations a month in year one (capacity)
  - regulated health data
- **US count:**
  - CBP 519130 (internet publishing & web portals) establishments with 10–499 employees: **1,806**. This is a partial proxy; apps sit across many NAICS codes.
- **How to find:**
  - SERP `site:zendesk.com/hc "cancel my subscription"` and `site:intercom.help "cancel subscription"`.
  - Then the standard recipe.

## S6. WhatsApp-first SMBs (overlay on S1/S5, often Spanish-speaking customers)

- **Who:** Owner-operated e-commerce or service businesses answering WhatsApp from a phone.
- **Pain, in their words:**
  - "Right now I have Whatsapp Business set up on my phone and one other person using linked devices... I do find myself missing messages" ([r/ecommerce](https://www.reddit.com/r/ecommerce/comments/1w7eiml/omnichannel_customer_service/))
  - "felt a bit clunky once most conversations shifted to chat and WhatsApp" ([r/SaaS](https://www.reddit.com/r/SaaS/comments/un60z6/which_alternatives_do_you_recommend_for_zendesk/o0mbxur/))
  - "Helpdesk team got whatsapp added as a channel..,how do you keep it from becoming chaos?" ([r/helpdesk, Oct 2026](https://www.reddit.com/r/helpdesk/comments/1xhjgs0/helpdesk_team_got_whatsapp_added_as_a_channelhow/), thread title only)
- **Trigger events:**
  - Adding the WhatsApp Business API.
  - Hiring Spanish-speaking support.
  - Using WATI or other WhatsApp-only inboxes (["Migrating from Wati to Chatwoot?", r/Chatwoot](https://www.reddit.com/r/Chatwoot/comments/1x9oozt/migrating_from_wati_to_chatwoot/)).
- **Watering holes:** r/WhatsappBusiness, r/Chatwoot, r/n8n (Chatwoot + n8n threads), Spanish-language e-commerce groups
- **Budget behaviour:** Smaller tickets. **They may sit below our Switch 5 price.**
- **Objections + counters:**
  - *"Meta fees?"* → Passed through at cost, shown on the invoice.
- **Disqualify if:** a single agent (Chatwoot Cloud free or WhatsApp Business app is enough).
- **US count:**
  - **Not measurable from Census.** DataForSEO: Zendesk sites with Spanish content 1,070 *globally* (`summary_Zendesk.json`).
  - **Evidence is thin (5 buyer snippets). Keep as a feature, not a segment, until outbound replies show otherwise.**
- **How to find:** WhatsApp click-to-chat links on Shopify stores, by SERP `"wa.me" "shopify"`, then the standard recipe.

## S7. Outsourced CX / BPO agencies (multi-brand) — hypothesis

- **Who:** Owner/ops director of a 20–300 seat outsourced support agency that runs client brands on the client's Zendesk or its own.
- **Pain:**
  - **No direct buyer quote in our sample.**
  - Indirect signals: TaskUs and Accenture are listed as featured Zendesk users on G2 (`data/raw/pages/g2_zendesk_low.json`).
  - The r/msp threads on outsourced helpdesk ([1](https://www.reddit.com/r/msp/comments/1lev0rw/how_was_your_experience_with_outsourced_helpdesk/), [2](https://www.reddit.com/r/msp/comments/1fi7966/client_pricing_for_outsourced_helpdesk/)) are about *IT* helpdesk outsourcing, not CX BPOs, so they are not evidence for this segment.
- **Why keep it:** Per-seat pricing multiplies across client brands. Multi-inbox Chatwoot fits them.
- **Disqualify if:** contracts require the client's own Zendesk.
- **US count:** CBP 561421 + 561422 (telephone answering + telemarketing/call centres) establishments with 10–499 employees: **532 + 1,599 = 2,131**.
- **How to find:**
  - SERP "customer support outsourcing" "Zendesk certified".
  - Clutch.co BPO lists via `treg.web.extract`.
  - Then the standard recipe.
- **Priority:** test only after S1–S3.

## S8. MSPs / IT service firms using Freshdesk or Zendesk — low fit

- **Who:** MSP owners hit by Freshdesk/Zendesk renewals.
- **Pain:** "Freshdesk Renewal Price Increase with no prior notification" ([r/msp](https://www.reddit.com/r/msp/comments/1vt3e57/freshdesk_renewal_price_increase_with_no_prior/)). This is strong pain evidence.
- **Why low fit:**
  - The r/msp threads show they want PSA features (RMM, billing, time tracking), which Chatwoot lacks.
  - Example: "Gorelo... has RMM, billing, etc, built-in".
- **US count:** CBP 541512 + 541513 + 541519 establishments with 10–499 employees: **9,233 + 1,526 + 1,686 = 12,445**.
- **Use:** Disqualify unless the helpdesk faces their *own* external customers rather than IT tickets.

## Parked (no complaint evidence found; not disproved)

| Idea | US count (CBP 2022, 10–499 emp.) | Why parked |
|---|---|---|
| Education / edtech | 8,286 (611710+611430+611691+611699+611420) | 0 snippets in sample. Test later with a dedicated Reddit/Trustpilot pull. |
| Travel / tour operators | 1,290 (561510+561520) | 0 snippets. Voice-heavy. |
| Healthcare-adjacent (home health, telehealth) | 20,995 for 621610 alone | **Disqualify:** HIPAA/BAA, plus audit logs and SSO are enterprise-only in Chatwoot. |

## Priority order

1. **S3 Zendesk renewal-trapped (8,864 US):**
   - Largest identifiable pool.
   - The pain matches the #2 tight theme exactly.
   - The renewal date gives a natural deadline.
   - Biggest savings per account.
2. **S1 Shopify/DTC on Gorgias/Zendesk (1,120 Gorgias + 181 Zendesk-retail identifiable; 7,645 CBP):**
   - Clearest usage-billing pain, fast decisions, card payments, strong communities.
   - Needs the Shopify sidebar built first.
3. **S2 B2B SaaS on Zendesk(+Intercom) (1,485 identifiable):**
   - Explicit AI-cost arithmetic in their own words; small teams.
   - Requires an honest AI pilot.
4. **S5 consumer apps/marketplaces:** big savings, but volumes may break fair use. Custom pricing.
5. **S4 Help Scout/Freshdesk repriced:** real pain, but price-sensitive. Our price is not lower for all of them.
6. **S6 WhatsApp-first:** thin evidence. Overlay only.
7. **S7 BPO:** hypothesis.
8. **S8 MSPs:** low fit.
