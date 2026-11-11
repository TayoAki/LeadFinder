# PRD: FlatDesk, the helpdesk you can leave Zendesk for

**Version 1.0 · 11 Nov 2026.** Status: draft for build.

**Inputs:**
- `../zendesk-alt-chatwoot/01-pain-points.md`: 180 labelled complaints, 83 from buyers.
- `02-offer-spec.md` and `03-icp-canvas.md`.
- The UI mockup and its 19 personas in `ui/`.
- `00-repo-assessment.md`.

## 1. Problem

Small and mid-size support teams (2–25 agents) on Zendesk, Freshdesk, Intercom, Gorgias or Help Scout are not unhappy with the software. G2 ratings sit at 4.3–4.6. What they hate is **how they're charged and held**. They switch at a trigger: a renewal, a price hike, or an AI bill.

## 2. Design principle: every P0 feature answers a counted pain

| Rank | Pain (buyer complaints) | In their words | P0 feature that answers it |
|---|---|---|---|
| 1 | **Seat price too high / paying for unused features** (24) | "our Zendesk bill has climbed to around $5,000 per month" | F1 Flat plans sized to small teams |
| 2 | **Renewal traps, hikes, can't cut seats or cancel** (23) | "Zendesk won't let me reduce seats despite… 2+ months before my end date" | F2 Contract freedom built into the product |
| 6 | **Reliability, emails not delivered** (13) | "Our Emails NEVER reach our customers!" | F6 Deliverability guard |
| 4 | **Vendor behaviour: hostage-taking, aggressive sales** (12) | "They will hold you hostage" | F2 + F8 Self-serve everything, named human |
| 3 | **Too complex for a small team** (10) | "felt like i was building a space station" | F4 Small-team defaults, 15-minute setup |
| 5 | **Per-resolution / per-ticket AI billing** (10) | "Now its shot up to $9k" (Intercom Fin) | F1 AI included + F5 measured AI |
| 7 | **AI drafts but doesn't resolve** (7) | "my team's hours did not really go down" | F5 AI that acts, with approvals |
| 9 | **Channel sprawl / WhatsApp** (5) | "Whatsapp Business set up on my phone" | F7 One inbox, official WhatsApp |
| 8 | **Migration fear keeps them stuck** (4) | "stuck with it for at least another year" | F3 7-day done-for-you migration |

## 3. Goals and non-goals

**Goals (first 6 months)**
1. A team on Zendesk can be live on FlatDesk within **7 calendar days** of signing, with history, macros and help centre intact.
2. Customers can see the full bill at any time and **change seats or cancel themselves** without talking to anyone.
3. The AI agent **resolves**, not just drafts, the top 3 contact reasons of each customer, at a measured rate shown to the customer.
4. Email delivery at least **99%**, visible per message.

**Non-goals for v1:**
- Enterprise features (custom objects, multi-brand workforce management).
- Voice / call centre.
- An IT-helpdesk (ITSM) use case. The MSP segment is out of scope.
- HIPAA customers.
- Building a model of our own.

## 4. Users

These are the 19 personas in `../zendesk-alt-chatwoot/ui/personas.json`. The buyers who decide are:
- the **Head of CX / support lead** (champion);
- the **founder or COO** (approves);
- the **controller** (signs, cares about F1/F2).

Daily users are agents, the team lead, the QA coach and knowledge managers. Admins are IT, support ops and privacy.

## 5. Requirements

### F1 Flat plans with AI included (pains 1, 5) · P0

| Plan | Agents | Price/mo | AI resolutions included (fair use) |
|---|---|---|---|
| Small | up to 5 | 349 USD | 1,500 |
| Team | up to 10 | 599 USD | 3,000 |
| Growth | up to 25 | 1,290 USD | 7,500 |

**Plan rules:**
- Light seats (view, internal notes, approvals) are unlimited and free.
- **No per-resolution or per-ticket charge, ever.**
- Above fair use: the customer is told at 80% and 100%. Nothing is charged and nothing is throttled without the customer's OK. The next plan is offered, never forced.
- Migration costs a one-off 1,500 USD. It is free for annual prepay.

**Acceptance:**
- The Billing page shows: this month's bill, next invoice date, usage vs fair use, and "what you paid your old vendor" (from the customer's uploaded invoice). The Zendesk-with-AI comparison is shown only as a labelled hypothetical.
- The price list is public, and the same numbers appear in-app.

### F2 Contract freedom in the product (pains 2, 4) · P0

- **Month-to-month by default.** Annual is optional, gets a discount, and never auto-renews into a longer term.
- **Seats:** add or remove any day, self-serve, prorated to the day.
- **Cancel:** in-app in 2 clicks, or by email. Data export starts automatically. The account stays readable for 30 days.
- **24-month price lock** for existing plans. Any price change is shown in-app 90 days ahead.
- **Acceptance:** a test account can go from 10 to 3 seats and cancel without contacting anyone. The audit log shows each change.

### F3 7-day done-for-you migration (pain 8) · P0

- **Importers (Zendesk API first, then Freshdesk, Help Scout, Gorgias, Intercom):**
  - tickets with full history, attachments, tags and custom fields;
  - users, orgs and groups;
  - macros, triggers and automations (mapped, or flagged as "changed" when there is no 1:1 equivalent);
  - help centre articles with **301 redirects**;
  - CSAT history.
- **Parallel run.** The old helpdesk stays read-only. Cut-over is scheduled off-peak. **Rollback is available until the old contract ends.**
- **Spot-check.** The customer reviews 20 random migrated tickets side by side before go-live.
- **Guarantee.** Not live in 7 days means the first month is free. The migration timeline and named contact are on the Migration tab.
- **Acceptance:** the importer's own counts match Zendesk's export counts; a mismatch blocks go-live.

### F4 Small-team defaults (pain 3) · P0

- Setup wizard in 15 minutes: connect email, chat, WhatsApp; import or create macros; pick SLA targets; turn AI on.
- Sensible default views (Mine, Unassigned, SLA at risk, Needs a human) and no empty configuration screens.
- **SLA engine built by us.** Chatwoot's SLA timers are in its separately licensed enterprise folder. Supports business hours and holidays.

### F5 AI agent that resolves, with guardrails (pains 5, 7) · P0

**Architecture**
- The agent runs **outside Chatwoot** as an AG-UI agent, wired through the self-hosted CopilotKit runtime (MIT).
- It connects through Chatwoot's Agent Bot API and webhooks.
- Threads and memory live in our Postgres. **No CopilotKit Intelligence.**

**Knowledge**
- Retrieval over the help centre, macros, policies and past resolved tickets.
- Each answer shows which article or ticket it used.

**Actions** are MCP tools on a server-side allowlist (pattern from OpenDots `connection-tools.ts`):
- Shopify order lookup;
- tracking from the carrier;
- address change before fulfilment;
- replacement;
- refund;
- subscription pause.

**Policy and approvals.** These use OpenBot's deny-first CEL policy and approval model:
- The admin sets limits, e.g. refunds ≤ 100 USD run automatically; above that, the action becomes an approval request to the lead.
- Approvals have hash-bound receipts (openmuse `actions.ts`), so an action never double-fires after an uncertain write.

**Handoff.** When the AI can't finish, the human gets a draft plus the actions already taken.

**Measurement**
- "Resolved by AI" = closed without human reply and not reopened in 7 days.
- The rate is reported per contact reason.
- CSAT is reported separately for AI and human handling.

**Gaps loop.** Questions the AI handed off are grouped, and one click drafts an article. Articles are approved before publishing (pattern from OpenDots `page-review.ts`).

**Acceptance**
- On a pilot customer's last 1,000 tickets (replayed offline), the AI resolves ≥ 40% of order-status and FAQ tickets with ≤ 2% wrong-action rate.
- Every action is in the audit log.

### F6 Deliverability guard (pain 6) · P0

- Setup checks SPF, DKIM and DMARC, with exact DNS records to paste. Go-live is blocked until they pass.
- Per-message delivery status: sent, delivered, bounced, spam-complaint.
- Bounce and complaint alerts.
- Suppression list.
- **Acceptance:** ≥ 99% delivered over 30 days for customers with passing DNS.

### F7 One inbox for every channel (pain 9) · P0

- Email, live chat, **WhatsApp (official Cloud API, not unofficial WhatsApp Web)**, Instagram, Facebook, SMS. Chatwoot supports all of these natively.
- WhatsApp 24-hour window shown and enforced; templates outside it.
- AI replies in the customer's language, with an English gloss for the agent.

### F8 Trust and exit (pains 2, 4) · P0

- **Full export any time**: JSON + CSV of conversations, contacts, articles and the audit log.
- Open-source core (Chatwoot, MIT). The customer can self-host the same software if they leave.
- A named human for migration and support. No sales calls to cancel.

### P1 (after launch)

- Roles and permissions beyond the built-in agent, lead and admin roles: QA, finance, privacy. Uses OpenBot's policy model for fine-grained capabilities.
- QA scorecards per criterion, with sampling of human and AI replies.
- Privacy tools: deletion requests with identity check, retention settings, DPA. EU data transfer basis stated.
- Workforce forecast by channel and hour.
- SSO / SCIM (OpenBot Better Auth + SCIM) for the Growth plan.

## 6. Architecture

```
Customers ─ email / chat / WhatsApp / IG / FB / SMS ─▶ Chatwoot (MIT core, per-customer instance or shard)
                                                        │  webhooks + Agent Bot API
                                                        ▼
                     FlatDesk AI service (AG-UI agent, TypeScript)
                       ├─ Self-hosted CopilotKit runtime (MIT); threads in our Postgres
                       ├─ Retrieval index (help centre, macros, resolved tickets)
                       ├─ MCP tools (allowlisted, server-side): Shopify, carriers, Stripe
                       ├─ Policy + approvals (CEL, deny-first; receipts)  ← OpenBot / openmuse patterns
                       └─ Audit log (write-before-act, redaction)          ← OpenBot pattern
FlatDesk control plane: billing (F1/F2), migration importers (F3), SLA engine (F4), deliverability (F6), export (F8)
```

- Models: Anthropic, OpenAI or any OpenAI-compatible endpoint. Our own API keys, flat cost absorbed in the plan price.
- Telemetry off by default.

## 7. Success metrics

| Pain | Metric | Target |
|---|---|---|
| 8 Migration fear | Days from signature to go-live (median) | ≤ 7 |
| 2 Renewal traps | Seat changes and cancellations done without contacting us | 100% |
| 1/5 Price | Customer's monthly cost vs their previous vendor invoice | ≥ 40% lower (median) |
| 7 AI doesn't resolve | AI resolution rate on the customer's top 3 contact reasons | ≥ 40% at day 30 |
| 7 Safety | Wrong AI actions (refund or replacement that shouldn't have happened) | ≤ 0.5% of AI actions |
| 6 Delivery | Email delivered | ≥ 99% |
| Business | Logo churn | ≤ 2% a month |
| Business | Gross margin | ≥ 55% |

## 8. Release plan

| Phase | Weeks | Scope |
|---|---|---|
| Alpha (1–3 design partners) | 0–6 | F1, F2 (manual billing ok), F3 Zendesk importer, F4, F6, F7 email + chat, F5 with 3 tools (order lookup, tracking, replacement) |
| Beta (10 customers) | 7–14 | Stripe billing with self-serve seats/cancel; WhatsApp; Freshdesk + Help Scout importers; refunds with approvals; gaps loop; export |
| GA | 15–20 | Gorgias + Intercom importers; QA scorecards; privacy tools; SSO for Growth |

## 9. Risks and open questions

| Risk | Mitigation |
|---|---|
| Chatwoot's SLA timers and Captain AI are under its enterprise licence | Build SLA (F4) and AI (F5) ourselves via the API; never copy `enterprise/` code |
| Chatwoot sells its own cloud for less on seats alone | Our value is migration + AI + contract freedom; price comparison is shown against what the customer actually paid |
| Fair-use AI cost blows up for high-volume B2C | Fair-use alerts; Growth plan; model routing to cheaper models for simple intents |
| Zendesk's per-resolution rate is unpublished | All comparisons are against the customer's own invoice; the AI case stays a labelled hypothetical |
| Copying CopilotKit Intelligence-dependent code by accident | Lint rule / dependency allowlist: no `@copilotkit/intelligence*`, no `CPK_INTELLIGENCE_*` env vars |

**Open questions:**
1. One Chatwoot instance per customer, or a shared multi-tenant cluster? Chatwoot supports accounts; cost vs isolation decides.
2. Do we offer self-hosting to customers at launch, or only the exit promise?
3. Which carrier APIs first (UPS, USPS, FedEx, DHL)?
