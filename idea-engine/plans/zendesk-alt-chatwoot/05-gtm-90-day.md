# 05 — Go-to-market, first 90 days

**Rules:** nothing in this plan has been sent, posted or signed up for. All outbound is CAN-SPAM compliant (real sender, physical address, one-click opt-out, suppression list), and every address is verified before sending.

## Channels per segment

| Segment | Primary channel | Secondary | Not now |
|---|---|---|---|
| S3 Zendesk renewal-trapped | Outbound email to identified Zendesk companies, timed to renewal; cold call follow-up | SEO page "Zendesk alternative with no per-resolution fees" (1,600 US searches/mo, +225% YoY, CPC ~119 USD per DECISION.md) | Paid search (~5,300 USD per customer per ACQUISITION_MATH.md) |
| S1 Shopify/DTC | Outbound email to brands with Zendesk/Gorgias help centres | Shopify agency/freelancer referral (10% recurring, assumed); "Gorgias alternative" page | Shopify App Store listing (needs an app build) |
| S2 B2B SaaS | Outbound email + LinkedIn connection (manual, ≤20 per day) | "AI resolution cost calculator" page; useful answers in r/SaaS / Support Driven (disclosed affiliation, no links unless asked) | Conferences |
| S5 Consumer apps | Outbound email with an "AI bill audit" offer | Calculator page | — |
| S4 Help Scout/Freshdesk repriced | Comparison pages ("Help Scout pricing change", "Freshdesk alternative": 880 US searches/mo per DECISION.md) | Small outbound batch after US count is pulled | — |
| S6 WhatsApp-first | Feature page only | — | Dedicated outbound until evidence grows |

## Lead sourcing per segment (treg endpoints and costs)

| Segment | Step 1: companies | Step 2: people | Step 3: contact | Est. cost per 500 verified contacts |
|---|---|---|---|---|
| S3 | `theirstack.companies.search` with `{"company_country_code_or":["US"],"company_technology_slug_or":["zendesk"],"min_employee_count":10,"max_employee_count":500,"limit":100,"page":n}` at **0.06 USD per company** (8,864 available). Add `treg.google.serp.organic` with `site:zendesk.com/hc/en-us <industry word>` (~0.0003 USD per call). | `treg.people.search` by domain plus title list (CX/Support/Ops); `exa.people.search` as backup | `treg.people.email.find` + `X-Treg-Route-Verify: true`; `treg.people.phone.find` (live check) | ~700 companies × 0.06 = 42 USD, plus ~10–20 USD for people/email/phone ≈ **55–65 USD** |
| S1 | SERP: `site:zendesk.com "where is my order"`, `site:zendesk.com "return policy"`, `site:gorgias.help` (a test returned brand help centres, `data/raw/techno/serp_zendesk_hc_wismo.json`); `theirstack.companies.search` with `gorgias`, US (1,120) | same | same; switchboard via `treg.google.serp.maps` | ~10–30 USD (mostly SERP-sourced) |
| S2 | `theirstack.companies.search` with `zendesk`/`intercom` + `industry_id_or:[4]` (Software Development), US, 10–500 staff (1,485) | same | same | ~45–55 USD |
| S5 | SERP: `site:zendesk.com/hc "cancel my subscription"`, `site:intercom.help "cancel subscription"` | same | same | ~10–20 USD |
| S4 | `theirstack.companies.search` with `help-scout`/`freshdesk`, US (count not yet pulled) | same | same | ~40 USD |

**Order of work:**
1. Pull 100 companies.
2. Hand-check 20 (is it external customer support? is it US? is the company in 10–500?).
3. Only then page through the rest.

The technographic lists are lower bounds, and some detections are stale.

---

## Cold email + cold call per top-3 segment

Personalise `{first_name}`, `{company}` and `{help_centre_url}`. Plain text, one link at most, no attachments.

### S3 Zendesk renewal-trapped

**Email 1 (variant B, renewal escape)**

> Subject: your Zendesk renewal
>
> Hi {first_name},
>
> Quick one. When does {company}'s Zendesk contract renew?
>
> I ask because Zendesk needs 30 days' written notice to change seats or cancel, and a lot of teams only find that out after the auto-renewal.
>
> We move teams off Zendesk in 7 business days (tickets, macros, help centre at {help_centre_url}, redirects) onto an open-source helpdesk we run for you. It's month-to-month: reduce seats any day, cancel by email. AI agent included, no per-resolution fees.
>
> If the renewal is within 90 days, worth a 15-minute look?
>
> {sender}
> {company address} · reply "no" and I won't email again

**Email 2 (variant A, price cap)**

> Subject: Zendesk AI resolutions at {company}
>
> Hi {first_name},
>
> Since Zendesk started billing its AI agent per automated resolution, a 10-agent Suite Professional team resolving 1,000 conversations with AI pays roughly 2,500 USD a month (seats at list price, about 1.50 USD per resolution).
>
> We run the same job (email, chat, WhatsApp, help centre, macros, AI agent) for 599 USD a month flat, up to 10 agents. We also do the migration for you in 7 days.
>
> Want me to price {company}'s current setup side by side? It takes one reply with your agent count.
>
> {sender}
> {company address} · reply "no" to opt out

**Cold call opener**

> "Hi {first_name}, it's {sender}. This is a cold call; can I have 30 seconds and you tell me if it's worth more? ... We move support teams off Zendesk at renewal, in about a week, to a flat-price helpdesk with the AI included and no annual lock-in. The one thing I wanted to ask: when does your Zendesk renew, and are you happy with the seat count you're locked into?"

### S1 Shopify/DTC

**Email 1**

> Subject: shipping updates counted as tickets?
>
> Hi {first_name},
>
> Saw {company}'s help centre at {help_centre_url}. Are your order-tracking emails and AI replies being billed as tickets or resolutions?
>
> We run a Shopify-connected helpdesk (email, chat, Instagram, Facebook, WhatsApp in one inbox) with the AI agent for order status included. Flat price, from 349 USD a month, no per-ticket or per-resolution fees. We migrate you in 7 days and run it in parallel until you're happy.
>
> Before Q4, worth comparing against your last invoice?
>
> {sender} · {address} · reply "no" to opt out

**Email 2**

> Subject: {company} support inbox
>
> Hi {first_name}, one inbox for email, chat, IG/FB DMs and WhatsApp, with order lookup from Shopify and an AI agent that answers "where is my order": 349 USD a month for up to 5 agents. We do the setup.
>
> Is support headcount or the helpdesk bill the bigger headache right now?
>
> {sender} · {address} · reply "no" to opt out

**Cold call opener**

> "Hi {first_name}, {sender} here, quick cold call. We help Shopify brands stop paying per ticket for support; the AI agent for order status is included in a flat price. Are you on Gorgias or Zendesk today, and roughly how many tickets do you see in a peak month?"

### S2 B2B SaaS

**Email 1**

> Subject: AI deflection math at {company}
>
> Hi {first_name},
>
> If your AI resolves half of ~2,000 tickets a month at Zendesk's ~1.50 USD (or Fin's 0.99 USD) per resolution, that's 1,000–1,500 USD a month on top of seats.
>
> We run an open-source helpdesk with an AI agent built in for a flat 599 USD a month for up to 10 agents. Before you switch anything, we'll replay last month's tickets through it and show you the real resolution rate.
>
> Want the replay? We need read-only API access and nothing else.
>
> {sender} · {address} · reply "no" to opt out

**Email 2**

> Subject: Zendesk + Intercom → one inbox
>
> Hi {first_name}, lots of small SaaS support teams run Zendesk for tickets and Intercom for chat. We consolidate both into one helpdesk (tickets, chat widget, help centre, AI agent) for one flat price, migrate in 7 days, and publish your resolution rate monthly.
>
> Is consolidation on your list this year?
>
> {sender} · {address} · reply "no" to opt out

**Cold call opener**

> "Hi {first_name}, {sender}, this is a cold call. We replace Zendesk-plus-Intercom stacks for small SaaS support teams with one flat-priced helpdesk, AI included. Quick question: is your AI bill growing faster than your ticket volume?"

---

## Landing page outline

Page: `/zendesk-alternative`

1. **Hero:** "Leave Zendesk at your renewal. Live in 7 days." The subline: flat monthly price, AI agent included, no per-resolution fees, month-to-month. CTA: "Price my switch". The form asks for agent count, monthly tickets and renewal month.
2. **Calculator:** agents × seat price + AI resolutions × per-resolution fee, compared with our tier. Formulas and sources are visible (02 table).
3. **What moves:** tickets, users, organisations, macros, views/triggers that were used in the last 90 days, help-centre articles plus redirects. There is a 7-day guarantee (first month free if late).
4. **Contract terms box:** month-to-month, seats down any day, cancel by email, 24-month price lock, full data export on exit.
5. **Channels:** email, chat, WhatsApp, Instagram, Facebook, SMS, help centre.
6. **AI, honestly:** what it resolves at launch (FAQ, order status, account lookups), the monthly resolution report, and draft mode for everything else.
7. **Comparison table:** Zendesk / Intercom / Gorgias / Freshdesk / Help Scout, using list prices with dates and sources. State honestly that Freshdesk and Chatwoot Cloud are cheaper on seats alone.
8. **Who it's not for:** voice-heavy teams, more than 25 agents, SSO/audit-log requirements, HIPAA.
9. **Built on Chatwoot (MIT open source):** you're never locked in. We're an independent service provider, not affiliated with Chatwoot Inc. or Zendesk.
10. **FAQ + CTA.**

**Not on the page until built:** SLA policies, Shopify refunds from inside the ticket, and resolution-rate numbers.

---

## Smoke test (pre-registered)

**Window:** days 1–30 after the first send.

**Volume:**
- 500 verified S3 contacts, split 250 on email 1 (B) and 250 on email 2 (A), with one follow-up each.
- 150 S1 contacts and 150 S2 contacts on their email 1.
- The landing page live, plus 2 SEO comparison pages (traffic is a bonus, not part of the test).

**Definitions:**
- **Positive reply:** asks for a price, a call or the replay, or gives their renewal month.
- **Qualified call:** 3–25 agents, external support, a decision maker on the call.

| Metric | PASS (continue + scale outbound to 1,000/mo) | ITERATE (change angle/segment once, retest 30 days) | KILL (stop this offer) |
|---|---|---|---|
| Positive reply rate, S3 (500 sends) | ≥ 2.0% (≥ 10) | 0.8–2.0% | < 0.8% (< 4) |
| Qualified discovery calls, all segments | ≥ 8 | 3–7 | ≤ 2 |
| Signed migration or paid deposit (≥ 500 USD) | ≥ 2 | 1 | 0 |
| Angle B vs A | B ≥ 1.5× A's positive replies → lead with B | within ±50% → combine | — |
| Feature blocker in ≥ 30% of calls (SSO, SLA, voice) | — | Fix or license before scaling | — |

**Decision rule:** PASS requires all three main rows to pass. KILL if any two main rows hit KILL.

**What gets logged** (spreadsheet + raw replies in `data/smoke/`): send, bounce, reply, positive, call, deposit, the angle, segment, agent count and renewal month.

---

## 90-day plan, week by week

| Week | Build | Sell | Measure |
|---|---|---|---|
| 1 | Stand up Chatwoot `-ce` (MIT) on a managed VM with pgvector Postgres, Redis, backups and an email relay. Decide SLA approach (own vs Enterprise licence). | Draft landing page + calculator. Write S3/S1/S2 emails (above). | — |
| 2 | Zendesk → Chatwoot migration script: tickets, users, orgs, macros, Guide articles via API. Test on a Zendesk trial account. | Pull 100 S3 companies (TheirStack), hand-check 20. Set up the sending domain + warm-up. | List quality: % with external support and US |
| 3 | AI agent v1 via Agent Bot webhook: help-centre retrieval, draft mode, handoff. | Pull the remaining S3 list to 500 verified contacts. Pull 150 S1 + 150 S2. | Verify rates |
| 4 | Shopify order sidebar + order-status intent. Resolution reporting job. | **Smoke test starts:** S3 email 1/2 split, S1, S2 email 1. | Daily: bounces < 3% |
| 5 | Migration dry-run on a second dataset; time it (target ≤ 16 h of work). | Follow-ups. Cold calls to S3 non-responders with phone numbers (≤ 20 per day). | Positive replies by angle |
| 6 | Fix migration gaps found in the dry-run. | Discovery calls. Offer the "replay last month's tickets" pilot to S2/S5. | Calls, blockers log |
| 7 | Pilot replays for 1–3 prospects (read-only API). | Proposals with a 7-day guarantee and month-to-month terms. | Measured resolution rate per pilot |
| 8 | — | **Smoke test readout (day 30):** PASS / ITERATE / KILL per the table. Publish the result in `data/smoke/readout.md`. | Decision |
| 9 | First paid migration (if PASS): parallel run. | If ITERATE, rewrite angle/segment (e.g. S1 only, or a Switch 5 offer to 2–5 agent teams). | 7-day clock |
| 10 | Cut-over #1. Onboarding checklist and 60-minute agent training. | Outbound to 1,000 contacts a month (PASS) or a 500-contact retest (ITERATE). | Migration hours, issues |
| 11 | Second migration. Harden backups, monitoring and the uptime credit process. | Ask client #1 for a quote or case study (with permission). | Client CSAT, AI resolution rate |
| 12 | Decide on the SLA/Enterprise licence based on blocker frequency. | Publish "Zendesk alternative" + "Gorgias alternative" pages with real (anonymised) numbers. | MRR, pipeline |
| 13 | Retro: unit economics vs the 02 assumptions (hosting, LLM cost per resolution, migration hours). | Set Q2 targets from measured reply/close rates (replace `data/icp.json` ranges). | Update icp.json with measured rates |

**90-day targets (if PASS):** 3–6 paying clients, about 1.8–3.6k USD MRR plus 4.5–9k USD in migration fees. These are planning targets, not forecasts.
