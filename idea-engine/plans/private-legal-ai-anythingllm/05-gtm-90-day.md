# 05 · Go-to-market: first 90 days

**Constraint from the evidence:** search demand is tiny ("cocounsel pricing" about 140/mo, per the brief). Buyers talk in subreddits that ban vendor promotion (r/legaltech locks "self-promotion fest" threads; r/Lawyertalk is lawyers-only). So the motion is **outbound + partners + a useful lead magnet**, not SEO or Reddit posting.

**Nothing in this plan has been executed. No one has been contacted.**

## Channels and lead sourcing by segment

| Segment (03) | Primary channel | Secondary channel | Lead-sourcing method | Est. data cost per 500 verified contacts |
|---|---|---|---|---|
| S1 Mid-size firms, 11–50 lawyers (8,312) | Cold email to managing partner + firm administrator/IT, then phone | **Managed-IT providers (MSPs) that serve law firms** as resellers or referrers; ALA chapter talks | `treg.google.serp.maps` ("law firm" × top-50 metros) → filter websites with 15+ attorney bios via `treg.web.extract` → `treg.people.search` (domain + "Managing Partner", "Firm Administrator", "Director of IT", "COO") → `treg.people.email.find` → `treg.people.email.verify` → `treg.people.phone.find` (live check) | Maps about $0.00015/query; email find about $0.0005/hit; verify a fraction of a cent each. **About $5–$10 total (estimate; check `treg catalog get` before running)** |
| S2 Doc-heavy small litigation, 2–10 lawyers (37,233) | Cold email + call to the owner | State trial-lawyer association sponsorships later; case-management integration directories (Clio App Directory) | `treg.google.serp.maps` ("personal injury attorney", "medical malpractice lawyer", "tenant attorney" × metros) → domain → owner via `treg.people.search` → email find + verify; switchboard phone from Maps | about $5–$10 |
| S3 Insurance defense (count unknown) | Cold email to managing partner | DRI / CLM events | Carrier panel-counsel lists and DRI directory pages via `treg.web.extract` → domain → people search → email find + verify | about $5 |
| S4 In-house (~21,041, unverified) | Low-volume LinkedIn + email to GC | ACC chapter talks | `treg.companies.search` (US, 500–4,999 employees) → `treg.people.search` ("General Counsel", "Head of Legal") → email find + verify | about $5–$15 |
| S5 Transactional/estate | Email | State bar probate/real-property sections | Maps ("estate planning attorney") and state board-certified specialist lists via `treg.web.extract` | about $5 |
| S6 Solos | Self-serve page only (no outbound until S1/S2 pass) | Bar solo-section newsletters | State bar directories | — |

Rules for every list: verify every address before sending, never send to guessed addresses (e.g. `info@`), and treat a found phone number as unconfirmed.

## Lead magnet (works in all segments)

**"Private AI for Law Firms: an ABA 512 checklist + data-flow template" (PDF, 4 pages).**
- Contents: a plain-English map of Model Rules 1.1, 1.4, 1.5 and 1.6 from ABA Formal Opinion 512, the state opinion list (FL 24-1, TX 705, CA guidance), a vendor-questions checklist (data residency, retention, training, cross-matter isolation, audit log), and a one-page data-flow diagram template.
- Disclaimer: information, not legal advice.
- This mirrors the demand quote "asking vendors for a full ethics audit trail… filtered out most of the options pretty fast".

## Cold email + call opener: top 3 segments

### S1 · Mid-size firms (11–50 lawyers)

**Variant S1-a, privacy-led**
> **Subject:** AI your managing partner can actually sign off on
>
> Hi {first},
>
> Most {city} firms your size we talk to are stuck at the same spot: associates want AI, and the managing partner won't put client files into a shared cloud tool.
>
> We set up a private AI for {firm} inside *your own* Microsoft or AWS account (or on a server in your office). It is loaded with your forms, precedents and matter files. Each matter is walled off, with a per-matter audit log you can hand to a client.
>
> One flat $999/month for up to 20 users. No seat minimums, month-to-month after a 30-day pilot.
>
> Worth a 20-minute look with whoever runs IT for you?
>
> {sig}
> P.S. Happy to send our 4-page ABA 512 checklist either way.

**Variant S1-b, price/seat-minimum-led**
> **Subject:** 30-seat minimums, {firm} has {n} lawyers
>
> Hi {first},
>
> Harvey and Legora quote seat minimums of 30–40 users, and CoCounsel lists at roughly $640–$780 per user per month. For a {n}-lawyer firm that is $10k+/month before anyone uses it.
>
> We do the private version for a flat $999/month (up to 20 users). It runs in your own cloud tenant, uses the same frontier models (or local ones), and is trained on your templates and precedents. Cancel any month.
>
> Open to comparing it on one of your own memos?
>
> {sig}

*Price sources: the seat minimums are buyer-reported on r/legaltech; the CoCounsel figure is an aggregator estimate (02). Re-check both before sending.*

**Cold call opener (S1)**
> "Hi {name}, it's {me}. I'll be quick: I help firms of 15 to 50 lawyers get AI working on their own documents without sending client files to a shared cloud. Is AI something your partners have actually approved yet, or is it stuck on the confidentiality question?"
> *(If stuck → "That's the exact problem we solve. Could I show your IT person the data-flow in 20 minutes?" If approved → "What did you go with, and is it working on your own forms and precedents?")*

### S2 · Document-heavy small litigation (2–10 lawyers)

**Variant S2-a, medical-records workload**
> **Subject:** 6,000 pages of med records, without uploading to ChatGPT
>
> Hi {first},
>
> PI and med-mal firms keep telling us the same thing: the records stack is where the hours go, and pasting it into ChatGPT is not an option.
>
> We install a private AI for {firm} that reads your medical records, depositions and file. It gives chronologies and answers with page cites, and the data stays in your own account or office.
>
> $499/month for up to 5 users, no per-case fees, no annual contract. Free 30-day trial on one redacted file of your choice.
>
> Want me to run it on one of your files?
>
> {sig}

**Variant S2-b, per-case cost comparison**
> **Subject:** per-case AI fees vs one flat price
>
> Hi {first},
>
> If you're paying $250–$750 a demand or chronology to an AI vendor, a few cases a month already costs more than running your own private AI.
>
> We set one up for {firm}: it reads your medical records and files, drafts in your templates, and nothing leaves your control. Flat $499/month for up to 5 users (or $999 for up to 20). Cancel monthly.
>
> Worth a 15-minute call to run the numbers on your caseload?
>
> {sig}

*Note: the S2-b test must also check $999 pricing for S2 (see the smoke test). The $250/$350/$750 per-case figures are buyer-reported on r/LawFirm.*

**Cold call opener (S2)**
> "Hi {name}, {me} here. Quick question, then I'll let you go: when a big medical records production comes in, who summarises it today: a paralegal, an outside vendor, or you?"
> *(Then: "We set up a private AI that does the first-pass chronology with page cites, inside your own system. Could I run it on one redacted file for you, free?")*

### S3 · Insurance defense

**Variant S3-a, carrier flat-fee pressure**
> **Subject:** carriers pushing flat fees, {firm}'s summaries
>
> Hi {first},
>
> Carriers are cutting what they'll pay for record reviews, summaries and reporting because "AI can do it". The firms keeping margin are the ones doing that work faster in-house.
>
> We set up a private AI for defense firms: it runs in your own tenant, is walled off per claim file, and is loaded with your report templates. It drafts the first pass of med-record summaries and status reports. Flat $999/month for up to 20 users, month-to-month.
>
> Would a 20-minute look be useful before your next carrier review?
>
> {sig}

**Variant S3-b, tool frustration**
> **Subject:** if CoCounsel is slowing your paralegals down
>
> Hi {first},
>
> We keep hearing from defense-side paralegals that the mandated AI tool takes twice as long as doing it by hand: splitting PDFs into 100-page chunks, then fixing the output.
>
> We build private AI for defense firms that works on the whole file and your own templates, inside your systems. One flat monthly price, no seats.
>
> Open to a side-by-side on one closed file?
>
> {sig}

**Cold call opener (S3)**
> "Hi {name}, {me}. I work with insurance defense firms on one thing: getting medical summaries and carrier reports done faster without breaking the carrier's data rules. Are your carriers asking you to use AI yet, or just cutting the hours they'll pay for?"

## Landing page outline

1. **Hero:** "Your firm's own private AI. Your files never leave your control." Sub-line: "Loaded with your templates, precedents and matters. Flat monthly price, no seat minimums, cancel any month." CTA: **Book a 30-day pilot** · secondary: *Get the ABA 512 checklist*.
2. **The problem in their words:** 3 anonymised quotes from 01 (seat minimums, "can't upload client data", lock-in).
3. **How it works** (diagram): your tenant or office server → your documents → matter walls → the model you choose (Claude/GPT via your cloud, or local) → cited answers + audit log.
4. **What it does:** medical-record chronologies with page cites, drafting from your forms, cited Q&A over a matter, cite-existence checker.
5. **What it doesn't do:** "We don't replace Westlaw or Lexis. We don't claim zero hallucinations. Lawyers review everything."
6. **Pricing table:** Small $499 / Firm $999 / On-Prem $1,490 / Pilot $750 credited. Comparison line against per-seat incumbents, with sources.
7. **Ethics & security:** single-tenant, no training, ZDR endpoints, audit log, export guarantee, MIT-licensed core (no lock-in).
8. **FAQ:** "Is this ethical under ABA 512?" (we give you the evidence; you decide), "What if you go out of business?" (MIT + export), "Can we bring our own Claude/OpenAI contract?" (yes).
9. **CTA repeated** plus a calendar embed.

Track: visits by source and UTM, CTA clicks, checklist downloads, calls booked.

## Smoke test (pre-registered)

**Setup:** 1,500 verified contacts in total: S1 600, S2 600, S3 300. Each segment gets a 50/50 variant split and a 3-touch sequence over 10 business days. S2 is also split on price ($499 vs $999 in touch 1). Landing page live with UTM per variant.

| Metric (measured at day 30 from first send) | PASS | KILL |
|---|---|---|
| Positive reply rate (asks for price, demo, checklist or pilot) across ≥1,200 delivered | **≥ 2.0%** | **< 0.7%** |
| Discovery calls held | **≥ 8** | **< 3** |
| Paid pilots signed ($750) by day 45 | **≥ 2** | **0 after ≥10 calls held** |
| Landing page "Book a pilot" click-through (≥300 visits) | **≥ 3%** | **< 1%** |
| Per segment: positive reply rate after ≥300 delivered | keep if ≥ 1.5% | drop the segment if < 1.0% |
| Price test (S2): positive reply rate at $999 vs $499 | keep $999 if ≥ 60% of the $499 rate | otherwise lead S2 with $499 |

Between PASS and KILL → **iterate once** (new angle from the losing variant's objections), rerun on 600 fresh contacts, then decide. A KILL on all segments means stopping the offer, or pivoting to a pure on-prem appliance for S1 only.

## 90-day plan, week by week

| Week | Build | Sell | Decision / metric |
|---|---|---|---|
| 1 | AnythingLLM Docker template for Azure and AWS single-tenant; matter-workspace and permission defaults; audit-log export script | Write landing page and ABA 512 checklist; buy domain; set up sending domains and warm-up | Domains warming |
| 2 | Page-anchored chunking test on public deposition transcripts and synthetic medical records; cite-existence checker prototype (CourtListener API, to validate) | Build lists: S1 600, S2 600, S3 300 via treg; verify all | Lists ready; verified-rate ≥ 85% |
| 3 | Fix the top 3 accuracy bugs from week 2 | **Smoke test launch:** touch 1 to all segments; call S1 and S2 openers to non-responders with phone numbers | Deliverability ≥ 95% |
| 4 | Demo instance with a sample firm (synthetic data) | Touches 2–3; discovery calls | Calls booked |
| 5 | Pilot onboarding runbook | Discovery calls; pilot proposals ($750) | **Day-30 readout → PASS / ITERATE / KILL** |
| 6 | Pilot 1–2 install (watch-folder connector) | Follow-ups; MSP partner outreach (10 law-firm MSPs) | Pilots live |
| 7 | Clio Manage read-only connector (only if a pilot needs it) | Second wave: S4 in-house at low volume (200) | Pilot usage logs |
| 8 | Agent flows: medical chronology, discovery-response drafter, template filler | ALA chapter / bar section talk pitches | Hours saved per pilot (self-reported plus logs) |
| 9 | On-Prem appliance reference build (only if a C-variant buyer exists) | Case study draft from the best pilot (with permission) | A vs C preference recorded per S1 call |
| 10 | Hardening: backups, monitoring, update pipeline | Third wave: winning segment × winning variant, 1,000 contacts | Pilot → paid conversion |
| 11 | SSO via reverse proxy (if required) | MSP partner pilot (1 reseller) | Partner signed? |
| 12 | Price review: add a 21–50-user tier to A if ≥2 S1 calls asked | Convert pilots to monthly | MRR |
| 13 | Retro: support hours per client vs the 02 margin assumptions | Plan next quarter | **Target: ≥5 paying firms (≈$3.5k–$5k MRR). Below 2 → stop or pivot** |

## What to watch

- **Support hours per firm** vs the 1.5–4 h/mo assumed in 02. If over 2×, margins break.
- **Model spend per firm** vs the included $75/$150. The token-cost worry in 01 is real.
- **Objection frequency:** "we already have Copilot/ChatGPT Enterprise" (a disqualifier) vs "can't upload client data" (a fit).
