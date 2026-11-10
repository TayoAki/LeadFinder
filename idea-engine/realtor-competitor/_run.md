# Run — ListingProof (working name; direct competitor to VideoTour.ai and RealEstateContent.ai) — 2026-11-10

Mode: **Full build (partial pipeline)**, following cmba-run gates, with the user's uploaded skills (positioning-angles, brand-voice, keyword-research, seo-content) slotted in. Workspace: this folder (`idea-engine/realtor-competitor/`), not `cmba-workspace/<slug>/`, as instructed.
Every stage read all existing artifacts in the folder before writing (prevention rule).

Upstream inputs used in place of `idea.md` / `validation.md` (none exist here; declared, not invented): [real-estate-video-saas.md](../deep-dives/real-estate-video-saas.md), [realtor-video-tools-reviews.md](../deep-dives/realtor-video-tools-reviews.md), [real-estate-ai-agents-brokerages.md](../deep-dives/real-estate-ai-agents-brokerages.md), [daily-demand-niches.md](../deep-dives/daily-demand-niches.md), [funnel-teardown.md](funnel-teardown.md), [competitor-ads.json](competitor-ads.json). `ai-native-crms.md` is **not present**; CRM integration (FUB/Lofty) is out of scope for the MVP and not claimed anywhere.

| # | Stage | Skill | Score /20 | Gate | Notes |
|---|---|---|---|---|---|
| 0 | Applicability | cmba-uvp Step 0 | n/a | **APPLIES (3/4, gap named)** | Gap: acquisition is paid-Meta-led; content is support. Discovery decision below |
| 1 | Idea | (cmba-idea not run) | n/a | **PASS on upstream** | SaaS deep-dive gives a recommendation chained to a market (US listing agents/teams) and outcome (listing marketing). Not re-scored |
| 2 | Validation | (cmba-validate not run) | n/a | **AMBER with stated pivot** | SaaS deep-dive verdict: "🟡 Narrow build only. ❌ for a general AI video SaaS for agents." A head-on "cheaper VideoTour" would be RED. Pivot applied everywhere: listing-heavy agents + small teams, per-listing kits with Meta ads modeled on local winners, no $29 plan tier |
| 3a | Differentiate | cmba-differentiate | 16 | **PASS** — POSITIONAL | Local-winners engine; ~12-month shelf life; substitution test passes vs both; 6 deficits listed. Nothing STRUCTURAL (stated honestly) |
| 3b | Angles | positioning-angles | n/a (no rubric) | **PASS** (5 angles, 5-point test, recommendation) | Market Stage 3→4. Lead Angle 1 Local Proof; challenger Angle 2 Nothing Invented |
| 3c | UVP | cmba-uvp | 16 | **PASS** — self-exclusion: buyers' agents, lifestyle/avatar seekers, posting-cadence buyers, brokerages wanting white-label, non-US | `OURS` element in assembly; proof clause omitted (no customers) |
| 4 | Voice + name | brand-voice (Build) | n/a | **PASS** (recognizable/actionable/differentiated/authentic/consistent) | Name: **ListingProof (placeholder; availability not checked)**; alternates TrueFrame, Kept |
| — | Profiles + site | cmba-profile | — | **SKIPPED** | Not requested; site copy is in landing-and-ads.md |
| — | Content (90-day social) | cmba-content | — | **SKIPPED (partially covered)** | Not requested as a stage. Its teaching rules were applied to journey posts (trailer/meat/summary/CTC). The 90-day calendar here is the SEO one in keywords.md |
| 5 | Offer | cmba-offer | 16 | **PASS** — model matches quadrant (small + niche → productized fixed-price offer + DFY, not a broad cheap sub) | Free → $49/listing → $199/mo Team → $149/listing DFY. Unit economics from treg compute prices. Volumes UNSOURCED |
| 6 | Lead magnet | cmba-leadmagnet | 15 | **PASS** — narrow/wide explicit; format top-left (personalized report/toolkit) | Two-field form (email + city) justified because city is used. Depends on BUILD metro discovery |
| 7 | Keywords | keyword-research | n/a | **PASS** (start-here, priority matrix, 90-day calendar, pillar validation with real volumes) | 83 keywords priced via treg (DataForSEO + Serpstat), 4 SERPs. 1 pillar demoted (compliance, ~160/mo) |
| 8 | Article | seo-content | n/a | **PASS** (checklists run) | Comparison, ~3,000 words, all competitor prices quoted with 2026-11-10 date and source links; disclosure; fair notes in their favor |
| 9a | Journey | cmba-journey | 16 | **PASS** — chain integrity yes on all 5 links | Emails single-sourced in email.md |
| 9b | Email | cmba-email | 16 | **PASS** — 3 growth tactics (≤3) | FULL ENGINE at monthly cadence; welcome 2 moved to day 17 to avoid colliding with the sequence |
| — | Discovery | cmba-discovery | — | **SKIPPED** | Service tier in scope (DFY $149/listing) but it is fixed-scope, fixed-price and bought at checkout with no sales call. Re-run discovery if team/brokerage deals start needing calls |
| 10 | Landing + ads | (task-specific) | n/a | **PASS with claims gate** | 7 page sections + 8 ad concepts (+A6b stand-in); every claim mapped EXISTS/BUILD |
| 11 | Metrics | cmba-metrics | 17 | **PASS** — instrumentation precondition, then 3 sequential dated tests with numeric keep/kill and a traffic check | All baselines UNKNOWN (pre-launch) |
| 12 | Coherence audit | cmba-run | n/a | **PASS** — 0 unresolved high-severity | 11 seam findings, all fixed (table below) |

Halted at: **completed** (no gate failed).
Total elapsed: one session, 2026-11-10.
Weakest artifact: **[lead-magnet.md](lead-magnet.md)** — its whole deliverable depends on an unbuilt metro-discovery pipeline, unverified per-metro data availability (thin metros), unknown data cost, and Meta's terms on automated Ad Library collection. Second weakest: **[offer.md](offer.md)** ladder volumes (all UNSOURCED). Per cmba-run, run `cmba-eval` on these two next (not run in this session).

## treg spend
Balance **$7.57 before → $7.46 after = $0.112** (cap $0.50).
- `treg.google.keywords.volume` (DataForSEO, 83 keywords): $0.09
- `serpstat.google.keywords.volume` (83 sent, 42 returned): $0.021
- `treg.google.serp.organic` × 4: ~$0.001
- `seranking.google.keywords.volume`: refused by provider (402), $0
Web pages re-fetched with curl (VideoTour LP, pricing toggle HTML, help center plan + AI-changes + MLS articles, terms; REC pricing, homepage, terms) to confirm quotes: $0.

## Coherence audit (seam table)

| # | Seam | Finding | Severity | Resolution |
|---|---|---|---|---|
| 1 | offer ↔ email (5) | Offer said the $29 code applies "within 7 days of your free kit", but email 5 goes to report subscribers who may never have made a free kit — the deadline couldn't be computed for them | **High** | Fixed in offer.md: code is issued in email 5, tied to the email, expires 7 days after issue (date printed). Email 5/6 already matched |
| 2 | uvp ↔ offer | UVP audience "small teams (3–30 agents)" vs Team plan "up to 15 agent brand kits" | Medium | uvp.md now "3–15 agents; larger teams by request" |
| 3 | email (welcome 1 ↔ welcome 2) | Email 1 promised "five emails over two weeks… then one a month… that's it", but Welcome 2 sends on day 17 | Medium | Email 1 expectations now name the day-17 round-up |
| 4 | keywords calendar ↔ landing/metrics launch date | Comparison article scheduled to publish Nov 16; its CTAs (/real-estate-video-maker, /local-ads) don't exist until launch Nov 24 | Medium | Article held and published on launch day with the tool page and /local-ads |
| 5 | metrics ↔ everything (temporal) | Keyword SERP check surfaced two more vendors (Avenue 510, Reeloft) not in the differentiation set | Medium | differentiators.md Assumptions: substitution test holds for the named set only; check both before any "nobody else" claim. No copy currently makes that claim |
| 6 | metrics ↔ lead-magnet | Hypothesis #5 described the popup baseline as exit-intent only; lead-magnet.md ships 20 s + exit-intent | Low | Hypothesis rewritten against the real baseline |
| 7 | metrics ↔ offer | T3 tests a same-listing $49 upgrade that offer.md didn't define — risk of it shipping site-wide and contaminating T3 | Medium | offer.md now states the upgrade exists only in T3's test arm until T3 decides |
| 8 | offer ↔ lead-magnet survey | Right-person template segment "1–5 listings/yr" didn't match survey options (0–1 buyers / 2–5 / 6–15 / 16+ / team) | Low | Template now "2–5" |
| 9 | email ↔ keywords calendar | Welcome 2 linked to guides that may not be published on its send date | Low | Send rule added: include a guide only if live |
| 10 | landing ads ↔ voice/honesty | A2's "extra door" beat could read as depicting a real competitor's output | Low | Labelled on screen as "Illustration", our own mock-up, no product/brand shown |
| 11 | all artifacts ↔ UNSOURCED rule | Placeholder observations in copy ("most of the ten open the same way", "214 days in Phoenix", "about five minutes", "three to five hours") | Low | Each is tagged in its artifact's Assumptions as to-verify-before-publishing; none presented as a finding |

Checked with no contradiction: prices ($0 / $49 / $199 / $149 / $29 extra kit) identical across offer, landing, emails, article and README; 30-day money-back identical everywhere; free kit contents (25 photos, 2 reels, 3 ads, 14-day re-renders) identical in offer and landing; Listing Kit (40 photos, 6 ads) identical in offer, landing, email 5 and article; T1 angle order matches angles.md and landing launch order; emails frozen during all test windows; the UVP enemy appears in email 3 (Goodwill Hunting) and the journey; audience (listing agents + small teams) consistent; buyers' agents excluded in survey routing; no competitor names in ad copy; no fabricated testimonials, counts or stats (placeholders only).

⚠ cmba-run warns this checklist catches about 1 in 3 contradictions. Treat as a floor. New row candidate for the checklist: **"offer ↔ email: does every time-bound offer's clock start from an event every recipient has actually had?"** (finding #1).
