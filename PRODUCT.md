# LeadFinder — Product Requirements (capability contract)

Format: ECC `product-capability` template. Source: Olly Rosewell's video "I Cloned a $1B B2B SaaS With
Claude Code" (13 Oct 2026, the "Cascade" build), with endpoint ids and prices checked against the live
Treg catalog (`treg catalog`) on 14 Oct 2026. Where the video is silent, decisions are marked
**[assumed]** or listed under Open Questions — nothing here is invented product truth.

## Capability

- **Capability name:** LeadFinder — ICP-to-verified-leads waterfall enrichment
- **Source:** video transcript (founder walkthrough) + Treg catalog
- **Primary actor:** a B2B seller (agency, SaaS founder, SDR) who needs contactable decision makers
- **Outcome after ship:** from one website + one sentence, the user gets a list of matching companies,
  one decision maker at each, a verified work email (and optionally a mobile), and an opening line —
  for roughly 1 cent of data cost per lead, with a receipt for every call.
- **Success signal:** a 50-lead run completes end to end; ≥50% of found people get a `verified` email;
  Treg cost per delivered lead ≤ $0.02; charged credits never exceed the quoted hold.

## Product Intent

Tell us your business → we write your ideal customer profile (ICP) → we show free counts of matching
companies and decision makers → you press **Find N leads** → each lead drops through a "waterfall" of
email providers, cheapest first, paying only for hits → every email is verified → you get a live
table, CSV export and a receipt. The operator (admin) sees the real Treg cost behind every credit and
the margin.

## Constraints

### Business rules
- **One data pipe.** Every outside data call goes through Treg (`https://treg.to`, one token,
  `TREG_TOKEN`). No provider API keys in the codebase.
- **Cheapest first, pay on hit.** Email finding uses Treg's routed waterfall `treg.people.email.find`
  (23 providers, ordered by price: quickenrich $0.0048 → trykitt $0.005 → aiark → tomba → … →
  contactout $0.15). Per-success providers bill nothing on a miss.
- **Free before paid.** Company/people counts and searches use free endpoints so the user sees the
  size of the market before spending (`dropleads.companies.search.count`, `treg.companies.search`,
  `treg.people.search` — all free).
- **Verify everything.** Every found email goes through `treg.people.email.verify` (free, routed).
  Statuses: `verified`, `catch_all` (own badge — providers disagree on these), `risky`, `invalid`.
  `invalid` emails are never delivered as results.
- **Two kinds of money, never mixed.**
  - *Credits* — what the customer spends inside LeadFinder.
  - *Treg cost (USD)* — what the operator pays Treg, read from Treg's cost header on every call.
- **Holds, not charges.** Starting a run places a hold for the maximum it could cost. Each result is
  paid from the hold; the remainder is refunded when the run ends. The user can never pay more than the
  quoted maximum.
- **Welcome grant:** 50 free credits per new account. First account created = admin; everyone after =
  customer.
- **Credit price list [assumed, tunable in config]:** company+person found = 1 credit, verified email
  = 4 credits, mobile = 10 credits; ICP generation and counts are free to the customer (paid by the
  operator). Target gross margin ≥ 70% on Treg cost.

### Invariants
- Every Treg call writes exactly one `treg_calls` row: endpoint id, served-by provider, request hash,
  idempotency key, USD cost, latency, status. A retried call reuses its idempotency key and is never
  paid twice.
- `sum(ledger) == balance` for every account, always. Ledger rows are append-only.
- A run's charged credits ≤ its hold. Hold − charged is refunded exactly once.
- Per-call spend cap: email waterfall calls send `X-Treg-Route-Max-Cost` (default $0.05) so one lead
  cannot run up the full 23-provider ladder.

### Compliance
- Sign-up requires accepting "I'll use LeadFinder for B2B outreach and respect opt-outs."
- Passwords hashed with bcrypt; sessions are 30-day httpOnly cookies.
- API keys (`TREG_TOKEN`, `ANTHROPIC_API_KEY`) live in env only, never in the client bundle or DB.

## Actors and Surfaces

- **Actors:** customer, admin/operator, background worker, Treg, Anthropic API.
- **UI surfaces:**
  - Landing page (waterfall animation, how it works, pricing, FAQ) — clean, enterprise look; Geist
    font, no monospace UI text.
  - Sign up / log in.
  - Onboarding card: website → what you sell → price point → who buys → where → company size →
    how many leads (+ "find phone numbers" toggle) → live ticks while the site is read → ICP summary
    types itself out.
  - **ICP page:** editable summary, industries, titles, geography, size, exclusions; live free
    counts that update as filters change; **Find N leads** button showing estimate and max hold.
  - **Leads table:** virtualised; rows update live; each row shows company, person, title, LinkedIn,
    email + status pill, mobile, cost, provider that served; a droplet animates down the provider
    ladder; counters (found / verified / catch-all / credits spent); waterfall bar (hits per
    provider); sort, search, status filter; bulk delete; CSV export; per-lead drawer with attempt
    history and an AI opening line.
  - **Clean a list:** upload CSV (name + domain or LinkedIn) → same waterfall + verify.
  - **Provider lab:** run one provider vs the full waterfall on the same sample; hit rate, cost per
    hit, speed per provider.
  - **Billing:** balance, ledger, top-up (Stripe later).
  - **Admin margin page:** per-run and total credits charged vs Treg USD cost.
  - **Settings:** profile, sign-out.
- **API surfaces (Next.js route handlers):** `/api/auth/*`, `/api/onboarding`, `/api/icp/:id`,
  `/api/icp/:id/counts`, `/api/runs` (POST start, GET list), `/api/runs/:id` (status + rows, polled or
  SSE), `/api/leads/export.csv`, `/api/lists` (upload), `/api/lab`, `/api/billing`.

## States and Transitions

- **Run:** `quoted -> held -> running -> completed | failed | cancelled`. On any terminal state:
  `refund(hold − charged)` exactly once.
- **Lead row:** `queued -> company_found -> person_found -> finding_email -> verifying -> done`;
  side exits `no_person`, `no_email`, `error`. Mobile lookup (if requested) runs after `done`.
- **Email status:** `verified | catch_all | risky | invalid | not_found`.
- **Account:** `customer | admin`.

## Interface Contract

### Pipeline per run (worker, 5 rows concurrently)
1. **Read site (onboarding):** `anyapi.web.crawl` (~$0.0045, up to 10 pages; prefer home, pricing,
   about, customers) + `treg.companies.enrich` on the domain for the brand record.
2. **Write ICP:** Anthropic Messages API (Claude Opus for ICP quality) → structured JSON: summary,
   industries/keywords, titles, seniority, geos, size range, exclusions, opening-angle hint.
3. **Counts:** `dropleads.companies.search.count` + `treg.people.search` count mode — free.
4. **Companies:** `treg.companies.search` with the ICP filters; send
   `X-Treg-Route-Strict-Filters: 1` so providers that ignore filters are refused (unbilled) instead of
   returning off-target data. Dedupe by domain against the account's previous leads.
5. **Decision maker:** `treg.people.search` by company domain + ICP titles; take the best match.
6. **Email:** `treg.people.email.find` with everything known (domain, first/last/full name,
   linkedin_url); headers `X-Treg-Route-Max-Cost`. Record `_treg.served_by` and `_treg.tried` as the
   attempt history.
7. **Verify:** `treg.people.email.verify`.
8. **Mobile (optional):** `treg.people.phone.find`, then `hlrlookup.people.phone.validate` (free).
9. **Opening line:** short Claude (Haiku-class) call from ICP + company + title.

- **Outputs:** lead rows, run receipt (credits charged, refunded, Treg USD, hits per provider).
- **Failure states:** Treg 402 (operator balance empty) → pause run, admin alert; provider rate limit
  → waterfall moves on (Treg handles); Anthropic failure → retry ×2 then mark ICP `failed`.
- **Idempotency:** each step's Treg call is keyed `run:{runId}:lead:{leadId}:step:{n}`.

## Data Implications

SQLite (Drizzle ORM) locally, Postgres-ready. Tables: `users`, `sessions`, `accounts`, `ledger`,
`businesses` (onboarding answers + crawl), `icps`, `runs`, `holds`, `companies`, `people`, `leads`,
`lead_attempts`, `treg_calls`, `lists`, `lab_runs`, `price_list`. LeadFinder is the source of truth
for leads; Treg is the source of truth for cost. Users can delete leads; deleting an account deletes
its leads [assumed].

## Security and Policy

- Trust boundary: browser ↔ Next.js server. Treg/Anthropic called only server-side.
- Authorisation: every query scoped to the session's account; admin-only routes for margin, lab,
  manual credit grants.
- Abuse paths: credit-draining (holds cap it), CSV injection on export (escape `= + - @`), SSRF via the
  website field (only `http(s)`, crawl happens at Treg, not our server).

## Delivery Phases (mirrors the video)

1. Treg integration — CLI, catalog lookups, verified prices for every endpoint above.
2. Foundation — Next.js app, DB schema, price list, design system, app shell with credits meter.
3. Treg plumbing — one `tregCall()` client: cost header, idempotency key, `treg_calls` receipt.
4. Auth, credits, ledger, billing page.
5. Onboarding card + site read.
6. ICP generation + free counts.
7. Engine — holds, companies, people, email waterfall, verify, refunds, 5-row worker.
8. Leads table — live rows, attempt history, filters, CSV export.
9. Clean a list.
10. Billing + admin margin dashboards.
11. Provider lab.
12. Polish, Stripe top-ups, deploy (Vercel).

## Non-Goals

- Sending emails / sequencing (export only).
- Stripe and deployment in the first pass (phase 12).
- Our own data — all data comes from Treg.
- Personal (non-work) emails.

## Open Questions

1. Final credit prices and plan tiers (assumed list above).
2. Mobile numbers: UK/EU legal basis for direct mobiles — offer by default or opt-in per run?
3. Hosting target: Vercel needs a hosted DB and a separate worker for long runs — accept, or use a
   single long-running host (e.g. Railway)?
4. Brand name: "LeadFinder" (repo) vs "Cascade" (video).

## Handoff

- **Ready for implementation?** Yes for phases 1–8 behind env keys; real-data checks need
  `TREG_TOKEN` and `ANTHROPIC_API_KEY`.
- **Needs architecture review?** Only the hosting question (open question 3).
- **Needs product clarification?** Pricing and mobile policy before public launch.
- **Next ECC lane:** `orch-build-mvp` (thin vertical slices) → `verification-loop`.
