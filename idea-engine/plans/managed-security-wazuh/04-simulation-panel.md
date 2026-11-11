# 04 · Simulation panel

> **SIMULATED — NOT DEMAND EVIDENCE.** The personas below are role-played by the model. Each one is anchored on real quotes from `01-pain-points.md` and `data/pain_snippets_classified.json`. Their picks are a structured way to stress-test the offer copy. They do **not** show that anyone will buy. Only the smoke test in 05 can do that.

## Variants shown

| ID | Angle | Direct price | MSP-partner version |
|---|---|---|---|
| **V1 · Flat & no-minimum** | "One published price. SIEM + 24/7 MDR + identity + firewall monitoring. No minimums, no per-GB or per-source fees, month-to-month." | Core $999/mo for 100 endpoints (Micro $399 for 25) | $3/endpoint co-managed, no minimum spend |
| **V2 · Compliance & insurance evidence** | "Monitoring that produces the evidence your auditor and your carrier ask for: FTC Safeguards, HIPAA, CMMC/NIST 800-171. Includes an insurer attestation letter." | Compliance+ $1,499/mo for 100 endpoints | $6/endpoint + white-label evidence packs |
| **V3 · We fix it, not just alert** | "Critical threats contained in 15 minutes, 24/7, and then we do the remediation from a written playbook. You aren't woken at 3 a.m." | Core + playbook framed at $1,299/mo for 100 endpoints | $6/endpoint fully managed, remediation included |

**Method.** Each persona saw all three variants in **order A (V1 → V2 → V3)** and in **order B (V3 → V2 → V1)**. A persona whose pick changed between orders is recorded as a **tie**.

## Personas and results

| # | Segment | Persona (anchored on) | Order A pick | Order B pick | Result | Main objection | What would make them reply |
|---|---|---|---|---|---|---|---|
| P1 | MSP (S1) | 8-person MSP owner, ~900 endpoints, Huntress EDR, annoyed by add-on pricing. Anchors: "death by a thousand cuts" ([link](https://www.reddit.com/r/msp/comments/1tph26w/comment/oo9d607/)), "can't justify Blumira's new US $500/month minimum" ([link](https://www.reddit.com/r/msp/comments/1qsegm7/postblumira_free_tier_life_what_would_you/)) | V1 | V1 | **V1** | "Another vendor to manage; will you still be here in 2 years?" | A Pax8 listing, a free not-for-resale allotment for 25 endpoints, and a PSA integration demo |
| P2 | MSP (S1) | 3-person MSP tech lead who wants truly hands-off remediation. Anchor: "all MDR vendors require the MSP to be involved with remediation" ([link](https://www.reddit.com/r/msp/comments/1jmr23e/really_completely_managed_handsoff_mdr_endpoint/)) | V3 | V3 | **V3** | "Liability: who's on the hook if your playbook breaks a client's server?" | A written playbook, an E&O certificate, and a sample incident ticket |
| P3 | Lean IT (S2) | IT manager, 300 employees, Arctic Wolf renewal. Anchors: "bait and switch" ([link](https://www.reddit.com/r/sysadmin/comments/1sx9sc8/deciding_whether_to_renew_arctic_wolf_or_cut/)), "I am my own SOC" | V3 | V3 | **V3** | "AI triage sounds like marketing; prove the 15/30-minute numbers" | A 30-day side-by-side run against the incumbent before the renewal date |
| P4 | Lean IT (S2) | Solo sysadmin with a self-run SIEM nobody tunes. Anchors: "just expensive log storage" ([link](https://www.reddit.com/r/sysadmin/comments/1mqy2um/anyone_else_feel_like_their_siem_is_just/)), "a second full-time job" ([link](https://www.reddit.com/r/cybersecurity/comments/1oilve8/comment/o5gf2ld/)) | V1 | V3 | **Tie (V1/V3)** | "Can I keep my logs and my rules if I leave?" | The exit-kit promise plus migration of their existing Wazuh or Graylog data |
| P5 | Dealers (S3) | Dealership controller who also owns IT. Anchors: "the formality of it all is a lot" ([link](https://www.reddit.com/r/msp/comments/ycfdc5/comment/iuh2ck9/)), the Safeguards Rule | V2 | V2 | **V2** | "$1,499 is more than our MSP charges for everything" | A sample FTC Safeguards evidence pack and a one-page "what the FTC asks for" checklist |
| P6 | Dealer-focused MSP (S3 via S1) | MSP serving several rooftops. Anchor: "what MDR are you using for the safeguards rule?" ([link](https://www.reddit.com/r/msp/comments/10k9dpb/ftc_safeguards_rule_mdr_auto_dealerships/)) | V2 | V2 | **V2** | "Can I brand the reports as mine?" | White-label PDF reports and per-rooftop pricing |
| P7 | Accounting (S4) | Managing partner, 18-person CPA firm. Anchor: the WISP requirement ([link](https://www.reddit.com/r/msp/comments/zs1dxu/new_cpa_client_written_information_security_plan/)) | V2 | V2 | **V2** | "Too expensive for 18 seats" (wants the Micro price) | Micro + evidence pack at about $499, timed outside tax season |
| P8 | CMMC (S5) | IT lead at a 60-person machine shop on GCC High. Anchors: "Must be FedRAMP… Eliminate 95% of all MDR offerings" ([link](https://www.reddit.com/r/CMMC/comments/194cnss/comment/khfja7o/)), "Small business SIEM" ([link](https://www.reddit.com/r/CMMC/comments/1cys11o/small_business_siem/)) | V2 | V2 | **V2** | "Your access makes you in-scope; show me the C3PAO's opinion" | A written opinion from a CMMC RP/C3PAO and US-person-only analysts |
| P9 | CMMC MSP (S5 via S1) | MSP making a 2-endpoint client CMMC L2. Anchor: "Is this even feasible?" ([link](https://www.reddit.com/r/CMMC/comments/1smijsf/is_this_even_feasible/)) | V2 | V3 | **Tie (V2/V3)** | "Two endpoints can't carry a $1,499 tier" | Per-endpoint enclave pricing |
| P10 | Manufacturer (S6) | Controller at a 120-person plant facing renewal. Anchors: "budget is going to increase based on the questions they ask" ([link](https://www.reddit.com/r/msp/comments/1ou4g6z/comment/noakumf/)), "insurance companies are the ones requiring it" | V2 | V3 | **Tie (V2/V3)** | "Will this lower my premium?" (we can't promise that) | An insurer attestation letter sample and a mapping to their carrier's questionnaire |
| P11 | Dental (S7) | Office manager at a 3-dentist practice (built from the MSP "medical office" pricing quote; **no first-person evidence**) | V1 | V1 | **V1** | "Our IT guy handles this" | An offer delivered through their MSP |
| P12 | Law (S8) | Firm administrator at a 30-lawyer firm (**no first-person evidence**; anchored on carriers building law-firm policies) | V2 | V1 | **Tie (V2/V1)** | "Our bank client's questionnaire is the only reason we'd buy" | Pre-filled answers to client security questionnaires |

## Summary (simulated)

| Variant | Firm picks | Shares a tie | Personas picking it in either order |
|---|---|---|---|
| **V2 · Compliance & insurance evidence** | 4 (P5, P6, P7, P8) | 3 (P9, P10, P12) | 7 of 12 |
| V3 · We fix it | 2 (P2, P3) | 3 (P4, P9, P10) | 5 of 12 |
| V1 · Flat & no-minimum | 2 (P1, P11) | 2 (P4, P12) | 4 of 12 |

- **Leading variant: V2 (Compliance & insurance evidence).** It held its position in both orders for every regulated persona (dealers, CPAs, CMMC). It is the only variant that gives the buyer a *reason to buy now*: an audit or a renewal.
- **The channel splits.** MSP owners chose V1 (price, no minimums) and MSP tech leads chose V3 (remediation). The partner page therefore needs both messages, with "no minimums" first and "we do the fix" second.
- **Lean IT teams (S2) leaned to V3.** Their pain is overnight coverage and a black box, not compliance.
- **Order sensitivity.** 4 of 12 personas flipped. Three of those four flips involved V3, which suggests "we fix it" gains from being seen first. The real test should not lead with it by default.
- **Price objections** came from small firms (P5, P7, P9). They support keeping the Micro tier and creating a Micro + evidence bundle at about $499 for 10–25 seat regulated firms.

## What the real test must check

1. **Angle.** Compare cold-email reply rates for V2 (compliance) and V1 (flat, no minimum) within dealers and CPAs. Compare V1 and V3 within MSPs. Hold the list source and sending week constant.
2. **Price.** Do MSPs accept $3 and $6 per endpoint? Do direct regulated buyers accept $1,499, or do they only respond to about $499 Micro + evidence? Ask both "what would you pay" and "what do you pay today" on calls.
3. **The CMMC delivery model.** Get one RP or C3PAO opinion on in-enclave deployment *before* spending on outreach to Segment 5.
4. **SLA feasibility.** In pilots, measure whether AI triage and automatic containment hit 15-minute containment and 30-minute acknowledgement, and how many analyst minutes each client takes per month. This decides whether gross margin is 55% or 40%.
5. **Owner voice.** None of the 12 personas for S7 and S8 is grounded in first-person complaints. Only replies from real practices or firms can promote those segments.
