# 02 — Offer spec (rebuilt from the pains in 01)

## The offer, revised

> **"Leave Zendesk at your next renewal without the migration project.** We move your tickets, macros and help centre in 7 days, then run your helpdesk and AI agent for one flat monthly price. Month-to-month, change seats any time, cancel by email. No per-resolution fees."

**What changed from the draft, and why:**

| Draft | Revised | Evidence (01) |
|---|---|---|
| "Switch from Zendesk in 7 days" | Kept, now tied to the **renewal date** | Pain #2 (renewal traps, 23 tight) is as big as pain #1 (seat price, 24 tight). Pain #8: people stay "stuck with it for at least another year" because migrating is work. |
| "One flat monthly price with the AI agent included" | Kept, plus **contract terms** as part of the price: month-to-month, seats down any time, unlimited free light/collaborator seats | "Zendesk won't let me reduce seats"; "No flexibility on removing of at least 20 unused seats"; "we need light agents... minimum of $89 per user per month" |
| "No per-resolution fees" | Kept, with a **published fair-use number** and a soft upgrade path (never an automatic bill) | Pain #5: "the unpredictable nature of usage-based billing". Help Scout buyers left over moving to per-interaction pricing. |
| One tier (599 USD, 10 agents) | **Three tiers** (5 / 10 / 25 agents) | Most tight buyers are 2–5 agent teams ("2 full-time agents plus me", "3-person support team"), so a 10-agent minimum overprices them. |
| AI "resolutions included" | AI **resolution reporting** with a monthly true resolution rate; no claims beyond FAQ, order status and account lookups at launch | Pain #7: native AI "keeps replying but never actually finishes the job". |

## Pain → feature / guarantee / price element

| Pain (01 rank) | What answers it | Type |
|---|---|---|
| 1. Seat price too high, paying for unused features | Flat tier price for up to N agents. Light/collaborator seats free and unlimited. A slim build: we migrate only the triggers, macros and views actually used in the last 90 days. | Price + service |
| 2. Renewal traps, hikes, can't reduce seats or cancel | **Month-to-month** after go-live. Seats can go down any day. Cancel by email with no notice period. **24-month price lock** on the tier price. Renewal-timed onboarding: we start 3–4 weeks before their Zendesk renewal so they give notice in time (Zendesk needs 30 days' written notice, per [MSA quotes in r/Zendesk](https://www.reddit.com/r/Zendesk/comments/1eaky6d/zendesk_renewal_experience/)). | Contract terms |
| 3. Too complex for a small team | We do the setup. Chatwoot's agent UI is a shared inbox with macros, labels and automation rules, without Zendesk's admin surface. Includes a 60-minute agent training session. | Service |
| 4. Vendor support / sales behaviour | Named engineer. Shared Slack/WhatsApp channel. 1-business-day response target. No outbound upsell sequences to the client's executives. | Service promise |
| 5. Usage-based AI / ticket billing | AI agent included up to a published fair use (1,000 / 3,000 / 8,000 resolved conversations a month). Exceeding it two months in a row → we talk about the next tier with 30 days' notice. **Never an automatic overage charge.** Order-tracking notifications don't count as tickets (the Gorgias complaint). | Price |
| 6. Reliability / email not delivered | We set up email-channel DNS (SPF/DKIM/DMARC), a forwarding check and an outbound delivery test as part of migration. Daily backups. 99.5% monthly uptime target with a service credit. | Guarantee |
| 7. Native AI doesn't resolve | AI scoped to intents we can verify in the pilot week (FAQ from the help centre, order status via Shopify, account lookups via API). Draft-first mode for the rest. Monthly report: conversations, AI-resolved, handed-off, reopened within 72h. | Feature + reporting |
| 8. Migration fear / export lock-in | **7-day migration guarantee:** live in 7 business days from receiving admin access, or the first month is free. We run in parallel until cut-over. Ticket history, users, organisations, macros, help-centre articles and redirects all move. On exit, we hand over a full Postgres dump plus CSV/JSON export (Chatwoot is open source, so the data model is public). | Guarantee |
| 9. Channel sprawl (WhatsApp, IG, FB) | WhatsApp Cloud API, Instagram, Facebook, SMS (Twilio), email and live chat in one inbox, set up by us. Meta/Twilio message fees pass through at cost. | Feature |
| 10. Paywalled API/webhooks (Chatwoot Cloud) | Self-managed MIT edition: API and webhooks included on every tier. | Feature |

## Must-have parity (checked against the Chatwoot repo, 11 Nov 2026)

The core is MIT. The `enterprise/` folder is under a separate commercial licence. The MIT-only images are the `-ce` tags (confirmed in the [r/selfhosted write-up](https://www.reddit.com/r/selfhosted/comments/1wtywcn/moved_our_support_chat_off_chatwoot_cloud_after/) and the repo `LICENSE`).

| Capability | In MIT core? | Plan |
|---|---|---|
| Email, live chat widget, WhatsApp, Instagram, Facebook, SMS, Telegram, Line, TikTok, API channel | Yes (`app/models/channel/*`) | Use |
| Macros, canned responses, labels, automation rules, teams, assignment | Yes (`app/models/macro.rb`, `automation_rule.rb`) | Use |
| Help centre (portals, articles) | Yes (`portal.rb`, `article.rb`) | Use; migrate Zendesk Guide articles and set up 301 redirects |
| CSAT surveys, reports | Yes (`csat_survey_response.rb`, `reporting_event*.rb`) | Use |
| **SLA policies** | **No**: `enterprise/app/models/sla_policy.rb` | Either (a) buy a Chatwoot Enterprise licence for SLA clients (price unknown, **unverified**), or (b) build SLA timers on automation rules plus our own reporting job. Decide in build week 1. Until then, don't put "SLAs" on the landing page. |
| **AI agent (Captain)** | **No**: `enterprise/app/models/captain/*` | Our own AI agent through Chatwoot's Agent Bot / webhook API (MIT). This is our product layer. |
| Custom roles, SAML SSO, audit logs | No (enterprise) | Out of scope for the first 90 days. Disqualify buyers who need SSO/audit on day one. |
| Voice / phone | Voice calls live in `enterprise/` | Not offered. Integrate Aircall/Twilio via webhook only if asked. |
| Shopify order lookup | Via app/integration + our AI tools | Build in weeks 1–3 (needed for segment S1) |

## What we deliberately won't do

- **No per-resolution or per-ticket billing.** Ever, including on the top tier.
- **No annual lock-in by default.** An annual prepay option exists (2 months free), but it isn't required.
- **No phone/contact-centre product,** no workforce management, no QA scoring suite (Zendesk's add-ons).
- **No HIPAA / BAA work** in the first 90 days (see 03, healthcare-adjacent is disqualified).
- **No promise of a resolution rate** before the pilot measures it. We publish what we measured.
- **No reselling Chatwoot Cloud.** We run the open-source edition. The client is not a Chatwoot Inc customer.
- **No IT service-desk/PSA features** (RMM, time-to-invoice) for MSPs: the r/msp evidence shows they need those.

## Pricing tiers

| Tier | Agents | AI resolved conversations / mo (fair use) | Monthly (month-to-month) | Migration (one-off) | Annual prepay |
|---|---|---|---|---|---|
| **Switch 5** | up to 5 | 1,000 | **349 USD** | 750 USD | 10× monthly, migration included |
| **Switch 10** | up to 10 | 3,000 | **599 USD** | 1,500 USD | 10× monthly, migration included |
| **Switch 25** | up to 25 | 8,000 | **1,290 USD** | 2,900 USD | 10× monthly, migration included |

All tiers include:
- unlimited light/collaborator seats
- all channels
- help centre
- API/webhooks
- daily backups
- named engineer

Over 25 agents is quoted, but it's not a focus segment.

### Arithmetic against incumbents (monthly, list prices, annual billing)

**Assumptions:**
- **Zendesk:**
  - Seats: Suite Team 55 USD and Suite Professional 115 USD per agent/month on annual billing ([zendesk.com/pricing](https://www.zendesk.com/pricing/), read 11 Nov 2026, saved at `data/raw/pages/pricing_zendesk.md`).
  - Automated resolutions: about **1.50 USD committed / 2.00 USD pay-as-you-go**. That figure is **unverified**: Zendesk publishes no rate. It comes from a buyer's post ([r/SaaS, May 2026](https://www.reddit.com/r/SaaS/comments/1tadxgf/migrating_from_zendesk_intercom_anyone_using_ai/)) and the third-party sources in `repo-offers-v2/top100/DECISION.md`.
  - Included allowance: assumed **5 per agent** (**unverified**, from [r/Zendesk, Nov 2026](https://www.reddit.com/r/Zendesk/comments/1xtbmgf/anyone_ever_switched_because_of_perresolution/)). Zendesk's site only says "Each account includes an allowance... based on their plan".
- **Intercom:**
  - Seats: Advanced 85 USD per seat ([intercom.com/pricing](https://www.intercom.com/pricing), `pricing_intercom.md`).
  - Fin: 0.99 USD "per outcome", from the same page.
- **Freshdesk:**
  - Seats: Pro 55 USD per agent ([freshworks.com/freshdesk/pricing](https://www.freshworks.com/freshdesk/pricing/), `pricing_freshdesk.md`).
  - Freddy AI Agent: first 500 sessions included, then 49 USD per 100 sessions. Note that **sessions are not resolutions**, so Freshdesk is understated here.
- **Help Scout:** Plus 45 USD per user, plus AI Answers at 0.75 USD per resolution ([helpscout.com/pricing](https://www.helpscout.com/pricing/), `pricing_helpscout.md`).
- **Gorgias:**
  - Its pricing page returned no numbers to the extractor.
  - Third-party figures: helpdesk priced by ticket volume (Starter 10 USD for 50 tickets up to Advanced about 750 USD on annual billing), AI Agent 0.90–1.00 USD per resolution, and **each AI resolution also counts as a billable ticket**. All **unverified**: [eesel](https://www.eesel.ai/blog/gorgias-automate-pricing-per-resolution-2026), [dragapp](https://www.dragapp.com/blog/gorgias-pricing/), [ringly](https://www.ringly.io/blog/gorgias-starter-plan-price).
  - Not modelled in the table below.
- **Chatwoot Cloud:** Business 39 USD per agent, including 500 Captain AI credits ([chatwoot.com/pricing](https://www.chatwoot.com/pricing), `pricing_chatwoot.md`).

| Scenario | Zendesk Suite Pro | Zendesk Suite Team | Intercom Advanced + Fin | Help Scout Plus + AI | Freshdesk Pro + Freddy | Chatwoot Cloud Business (DIY) | **Ours** |
|---|---|---|---|---|---|---|---|
| 5 agents, 500 AI resolutions | 1,288 | 988 | 920 | 600 | 275 | 195 | **349** |
| 10 agents, 1,000 AI resolutions | 2,575 | 1,975 | 1,840 | 1,200 | 795 | 390 | **599** |
| 10 agents, 3,000 AI resolutions | 5,575 | 4,975 | 3,820 | 2,700 | 1,775 | 390 + extra credits | **599** |
| 20 agents, 6,000 AI resolutions | 11,150 | 9,950 | 7,640 | 5,400 | 3,795 | 780 + extra credits | **1,290** |

Formula: seats × seat price + (AI resolutions − allowance) × unit price. With Zendesk pay-as-you-go at 2.00 USD, the 10/3,000 case is 7,050 USD.

**What the arithmetic says:**
- **Against Zendesk and Intercom we are 70–90% cheaper** once AI volume is real. With 10 agents and 1,000 AI resolutions, a Zendesk Suite Pro customer saves about **1,976 USD/month, about 23.7k USD/year**. The 1,500 USD migration pays back in under a month.
- **Against Freshdesk, Help Scout and Chatwoot Cloud we are *not* the cheapest at low AI volume.** Freshdesk Pro with 5 agents is 275 USD versus our 349.
  - The pitch to those users is contract terms, done-for-you migration and AI included, not price.
  - Don't lead with price against Freshdesk.
  - Chatwoot Cloud DIY is always cheaper on paper. Our wedge there is "we do the migration, the AI agent and the running", which matters to teams that "got too busy to spend the needed time to move platforms".

## Unit economics (planning assumptions, not measured)

| Item | Switch 10 at ~1,000 AI resolutions | Basis |
|---|---|---|
| Hosting (VM + managed Postgres with pgvector + Redis + backups + email relay) | 60–120 USD | Typical cloud list prices for a 4 vCPU / 8 GB VM plus a small managed DB. **Not quoted.** |
| LLM cost per AI-handled conversation | 0.01–0.04 USD → 10–40 USD (30–120 at the 3,000 fair-use cap) | Assumed small/mid model, about 5–15k tokens per conversation. **Assumption, to be measured in pilot.** |
| Engineer / CSM time | 1–2 h × 40 USD = 40–80 USD | Assumption |
| **COGS** | ~110–240 USD | |
| **Gross margin** | **~60–80% (use 65% in models)** | 599 minus COGS |
| Migration | 1,500 USD for about 12–20 engineer hours using scripted Zendesk API export → Chatwoot API import | Assumption. First migrations will run longer. |
