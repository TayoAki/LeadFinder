# 05 · Go-to-market: first 90 days

**Positioning line:** "24/7 detection *and the fix*, with the compliance evidence your auditor and carrier ask for. One published price, no minimums."
**Motion:** The MSP partner channel goes first because it is the strongest evidence and has the largest endpoint leverage. Two direct regulated segments (dealers, then CPAs) test the V2 compliance angle. A renewal-triggered direct motion targets lean IT teams. CMMC is gated on the delivery-model opinion.
**Rules:** No posting or vendor-astroturfing on Reddit. r/msp is a research and listening source, not a sales channel. All outreach is CAN-SPAM compliant, with a physical address and an opt-out.

## Channels and lead sourcing per segment

| Segment | Channels (in order) | Lead-sourcing method (treg endpoint or named list) | Est. cost per 1,000 leads |
|---|---|---|---|
| S1 MSPs without a SOC | Cold email to owners; Pax8 marketplace listing; MSPGeek community (helpful answers only); webinar "Wazuh without the second job"; booth at a regional MSP event (month 3) | `treg.google.serp.maps` "managed IT services" × top 150 metros (phone, website) → owner name from site or `anyapi.linkedin.company.people` (use sparingly, $0.105/hit) → `treg.people.email.find`. Cross-check against the Channel Futures MSP 501 and Pax8 partner directory | ~$0.15 maps + ~$0.5–5 email finding (depends on provider hit rate) |
| S2 Lean IT at renewal | Cold email timed to triggers; LinkedIn connection to the IT manager; Spiceworks content | `anyapi.linkedin.search.jobs` for "security analyst" / "sysadmin" at companies with 100–500 employees ($0.0005/hit) → `enrichlayer.company.employees.search` (title: IT Manager / Director of IT) → `treg.people.email.find` | ~$5–15 |
| S3 Auto dealers | Cold email + cold call to controllers and GMs; dealer-focused MSPs (via S1); state dealer association sponsorship (later) | `treg.google.serp.maps` "Ford dealer", "Toyota dealer", etc. by state → website → `treg.people.email.find` for controller/GM; OEM dealer locators as a check | ~$2–6 |
| S4 CPA and tax firms | Cold email May–Dec only; state CPA society newsletter ad (test one state) | State CPA society directories + `treg.google.serp.maps` "CPA firm" by metro → `treg.people.email.find` | ~$2–6 |
| S5 CMMC (gated) | Cyber AB marketplace RPO partnerships; APEX Accelerator events | SAM.gov entity extract (POCs, NAICS) + USAspending subaward recipients | Free to ~$5 |
| S6 Manufacturers | Insurance-renewal email; NIST MEP center workshop | `treg.google.serp.maps` by industry keyword + county → `enrichlayer.company.employees.search` | ~$5–15 |
| S7/S8 Medical, dental, law | Through S1 partners only (co-branded one-pager) | NPPES NPI Registry (free) / state bar directories, *only if* an MSP partner asks for co-marketing | — |

## Cold email: top 3 segments

### S1 · MSPs, Variant A (V1: no minimums, flat)
**Subject:** Wazuh SIEM + 24/7 MDR for your clients, $3/endpoint, no minimum

> Hi {first},
>
> Quick one. Most MSPs we talk to are stuck between a SIEM nobody has time to tune and vendor minimums that don't fit 10-seat clients. Blumira moved to a $500/mo floor, and Huntress needs 50 units per product.
>
> We run the SIEM (Wazuh under the hood), triage every alert, and contain critical threats 24/7. You get the tickets in {PSA} under your brand. It's $3/endpoint co-managed or $6 fully managed. No minimum spend, month-to-month, and the first 25 endpoints are free for your own shop.
>
> Worth a 15-minute look at a sample ticket and report?
>
> {name}
> P.S. It sits next to Huntress or Defender. It doesn't replace your EDR.

### S1 · MSPs, Variant B (V3: we do the fix)
**Subject:** who remediates at 3am?

> Hi {first},
>
> Every MDR we've seen still hands the remediation back to the MSP. We don't. Our written playbook covers isolating the host, killing the session, revoking tokens, blocking the IP at the firewall and cleaning inbox rules. We do all of it ourselves 24/7, then ticket you the summary.
>
> White-label, $6/endpoint, no minimum. Want the playbook PDF?
>
> {name}

**Cold call opener (MSP owner):** "Hi {first}, it's {name}. I'll be quick. I'm calling MSPs who sell security but don't run their own overnight SOC. Who does remediation for your clients at 3 a.m. today? … [listen] … We do that part under your brand, per endpoint, no minimum. Can I send a sample incident ticket so you can judge the quality?"

### S2 · Lean IT, Variant A (V3)
**Subject:** before your {incumbent/EDR} renewal

> Hi {first},
>
> Saw {company} is hiring a {security role}. That usually means one person is the whole SOC.
>
> We run 24/7 detection on top of the EDR you already own. Critical threats are contained within 15 minutes, and then we do the remediation. Price is flat: $999/mo up to 100 endpoints, month-to-month. You keep read access to every rule and every log, so it isn't a black box.
>
> Open to a 30-day side-by-side run against your current tool before renewal?
>
> {name}

### S2 · Lean IT, Variant B (V1)
**Subject:** SIEM that isn't just expensive log storage

> Hi {first},
>
> If your SIEM has turned into a log warehouse nobody has time to tune, we take it over. We run the stack, write the parsers, tune the rules and triage every alert. It's one flat price with no per-GB charges and 365-day retention. You can export everything if you leave.
>
> Worth a quick call?
>
> {name}

**Cold call opener (IT manager):** "Hi {first}, {name} here. You're probably the person who gets the alert at 2 a.m. Is that right? … We contain the critical ones automatically and then fix them, with you able to see every rule. Is renewal season for your MDR or EDR coming up this year?"

### S3 · Auto dealers, Variant A (V2: compliance)
**Subject:** FTC Safeguards "continuous monitoring," done monthly with evidence

> Hi {first},
>
> The Safeguards Rule (16 CFR 314.4(d)(2)) asks dealers for either continuous monitoring, or annual pen tests plus vulnerability assessments every six months. Most rooftops we see have neither in writing.
>
> We provide the monitoring 24/7 and send you a monthly evidence pack you can hand to your Qualified Individual, your board and your insurer. $1,499/mo per rooftop up to 100 devices, no long contract.
>
> Can I send a sample evidence pack?
>
> {name}
> (We aren't lawyers. This is technical evidence, not legal advice.)

### S3 · Auto dealers, Variant B (V1: flat price)
**Subject:** a flat monthly price for dealership cyber monitoring

> Hi {first}, one published price ($999/mo up to 100 devices) for 24/7 monitoring of your PCs, email and firewall. Critical threats are contained in 15 minutes, and you can cancel any month. Want the one-pager?

**Cold call opener (controller):** "Hi {first}, {name}. Calling dealers about the FTC Safeguards monitoring requirement. Quick question: if an auditor or your insurer asked tomorrow for proof of continuous monitoring, what would you show them? … We produce that every month. Can I email a sample?"

## Landing page outline (one page, with separate MSP and Direct tabs)

1. **Hero:** "24/7 threat detection *and the fix*, with the compliance evidence your auditor and insurer ask for." Sub-line: "One published price. No minimums. Runs on the EDR you already own." Call to action: "See a sample incident ticket" (email gate) plus "Get pricing" (no gate).
2. **Three pains, three answers:** price creep and minimums → flat price; black box and noise → see every rule, only actionable tickets; "you do the fix" → our written playbook.
3. **How it works:** agent + firewall + M365 → triage → 15-minute automatic containment → analyst remediation → monthly evidence pack (diagram).
4. **Pricing table:** Micro $399, Core $999, Compliance+ $1,499, Partner $3/$6, all published.
5. **Compliance mapping:** FTC Safeguards, HIPAA, PCI DSS, NIST 800-171/CMMC (in-enclave option, "contact us").
6. **Guarantees:** SLA numbers, noise credit, month-to-month, exit kit.
7. **Comparison table:** against Blumira, Huntress SIEM, Arctic Wolf, using only published or sourced prices.
8. **FAQ:** "Is this open source?" (yes, Wazuh, and we run it). "Do you replace my EDR?" (no). "Insurance advice?" (no).
9. **Proof (empty at launch):** pilot results with SLA metrics once they exist. No fake logos or testimonials.

## Smoke test, pre-registered (weeks 2–6)

**Setup:**
- S1 MSPs: 600 contacts, A and B emails split 50/50.
- S3 dealers: 400 contacts, A and B split 50/50.
- S2 lean IT: 300 contacts.
- Sequence: 3 touches over 10 days. The landing page goes live with UTM tracking.

| Metric | PASS (continue and scale) | KILL / pivot |
|---|---|---|
| Positive reply rate (any segment, best variant) | **≥ 2.0%** | < 0.7% across all segments after 1,300 sends |
| Discovery calls booked (all segments) | **≥ 12** by day 45 | ≤ 4 |
| MSPs agreeing to a free 25-endpoint pilot | **≥ 4** | 0–1 |
| Direct buyers agreeing to a paid pilot or LOI at ≥ $999/mo (or ≥ $399 Micro) | **≥ 2** | 0 |
| Landing page visitor → "get pricing" / "sample ticket" request | **≥ 4%** of ≥ 300 visitors | < 1.5% |
| Variant read | Declare the V2 vs V1 winner *only* if the reply-rate gap is ≥ 2× and the winner has ≥ 8 positive replies | Otherwise report it as a tie |

**Pivot rules:**
- If MSPs pass and direct buyers fail, go channel-only (white-label).
- If direct dealers or CPAs pass and MSPs fail, go vertical direct with the Compliance+ angle.
- If both fail, kill the offer or reposition it as "managed Wazuh for MSSPs" (infrastructure only).

**Delivery check during pilots (must pass before scaling sales):**
- Critical containment ≤ 15 minutes and acknowledgement ≤ 30 minutes on ≥ 90% of criticals.
- Analyst time ≤ 6 hours per 100-endpoint client per month. Above ~10 hours, margin falls below 45%.
- Customers mark < 25% of escalations as false positives.

## 90-day plan, week by week

| Week | Build / ops | Go-to-market | Exit criterion |
|---|---|---|---|
| 1 | Stand up a multi-tenant Wazuh cluster; agent profiles (light profile for domain controllers); M365 and firewall parsers (FortiGate, SonicWall, UniFi) | Write landing page, pricing, playbook PDF, sample ticket and sample evidence pack. Set up a sending domain and start warm-up | Page live; 3 sample artefacts done |
| 2 | LLM triage pipeline on alerts with a human review queue; active-response playbooks (isolate, disable user, block IP) | Pull leads: 600 MSPs, 400 dealers, 300 lean IT (budget ≤ $25 in treg) | Lists verified, bounce rate < 5% |
| 3 | Internal "dogfood" on our own and friendly environments; measure noise | Launch S1 A/B and S3 A/B sequences | Sends out |
| 4 | PSA connectors (Halo, ConnectWise) | Launch S2. Answer replies within 2 hours. Hold discovery calls | ≥ 4 calls booked |
| 5 | Evidence-pack generator (FTC Safeguards first) | Calls, then offer pilots. Ask for a CMMC RP or C3PAO opinion on in-enclave delivery | First pilot agreed |
| 6 | Onboard pilots 1–3 (scripted rollout through RMM or Intune) | **Smoke-test readout against the pre-registered thresholds** | PASS, PIVOT or KILL decision written down |
| 7 | Measure MTTA, MTTC and analyst minutes per client | Second wave to the winning segment and variant (+600 contacts) | — |
| 8 | Tune rules from pilot noise; write the on-call runbook | Pax8 marketplace application; MSPGeek / IT Nation listening | — |
| 9 | Exit-kit export tooling | First webinar: "Wazuh without the second full-time job" (MSP audience) | ≥ 40 registrants |
| 10 | Draft SOC 2 Type I readiness (MSPs will ask) | Turn pilots to paid (target 2 MSPs + 2 direct) | ≥ 2 paying |
| 11 | Compliance+ evidence packs for HIPAA and NIST 800-171 | If the CMMC opinion was positive, start Cyber AB RPO partnership outreach | — |
| 12 | Capacity plan (when to hire analyst #2) | Case study from pilot metrics (real numbers only) | — |
| 13 | Review unit economics against the assumptions in 02 | Day-90 review: MRR, pipeline, reply rates by variant, analyst hours per client | Go or no-go on the next quarter's hiring |

**Day-90 targets (planning):** 4–8 paying accounts. MRR of $4k–$10k, mostly from 2–3 MSP partners at 300–800 endpoints each plus 2–3 direct Core or Compliance+ accounts. Measured gross margin of 50% or more. These are targets, not forecasts.
