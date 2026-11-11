# 02 · Offer specification: "Detect & Fix" managed security on Wazuh

## The offer in one line

**A flat, published monthly price for 24/7 threat detection *and* the fix, plus the compliance and insurance evidence your auditor or carrier asks for. It runs on top of the EDR you already have (Defender for Business, SentinelOne or CrowdStrike), with no minimums and month-to-month terms. It is sold direct to regulated SMBs and white-labelled to MSPs.**

Wazuh (GPL-2.0) is the engine and is never the headline. The evidence in 01 shows buyers do not want *a* SIEM. They want the job done, and DIY Wazuh is a "second full-time job" ([source](https://www.reddit.com/r/cybersecurity/comments/1oilve8/comment/o5gf2ld/)).

### Changes from the draft offer

| Draft | Changed to | Why (evidence) |
|---|---|---|
| $999/mo for ~100 endpoints, one price | Four tiers: micro tier at $399, Core at $999, Compliance+ at $1,499, and an MSP per-endpoint partner tier | Minimums lock out small shops (9 tight snippets). Compliance and insurance pressure is the buying trigger (16). MSPs are the largest voice in the corpus (70 of 155 snippets). |
| "Managed threat detection & response" | "Detection **and the fix**", with a published list of the actions we take ourselves | "all MDR vendors require the MSP to be involved with remediation" ([r/msp](https://www.reddit.com/r/msp/comments/1jmr23e/really_completely_managed_handsoff_mdr_endpoint/)) |
| Full 24/7 human SOC | Machine triage + pre-authorised automatic containment 24/7 + business-hours analysts + paid on-call senior for criticals | "The human backed 24/7 SOC model is completely broken" ([r/msp](https://www.reddit.com/r/msp/comments/1nd6v5k/comment/ndgc0l0/)); this is also the margin fix the brief asked for |
| Compete with Huntress on EDR | Sit **on top of** existing EDR; sell SIEM + identity + firewall + compliance coverage | Huntress EDR at $3.50–$8.99 per endpoint is a floor we can't undercut; buyers call Huntress SIEM "a compliance checkbox" and say "you can't really tune" it ([r/msp](https://www.reddit.com/r/msp/comments/1t82qfs/comment/okt5u6b/)) |

## Pain → feature, guarantee or price element

| Pain (01 rank, tight count) | What answers it | Guarantee or contract term |
|---|---|---|
| 1. Price too high, opaque, nickel-and-dimed (43) | One published price per tier that includes SIEM, endpoint log monitoring, M365/Google identity monitoring, firewall logs and vulnerability detection. No per-GB, per-source or per-identity charges. | Price on the website; no add-on SKUs in year 1; fair-use log cap of ~2 GB/day per 100 endpoints *(planning assumption, to be checked in pilots)* |
| 2. DIY SIEM is a second job (29) | We run the Wazuh stack: upgrades, index and storage management, parsers for common firewalls (FortiGate, SonicWall, UniFi, Meraki), rule tuning, agent profiles | **Exit kit:** customers own their data and get a full export plus the Wazuh rule set if they leave. This counters lock-in pain #8. |
| 3. Can't staff 24/7 (23) | (a) LLM-assisted triage of every Wazuh alert (enrich, de-duplicate, verdict draft); (b) pre-authorised **automatic containment** via Wazuh active response plus EDR and M365 APIs (isolate host, disable user and revoke sessions, block IP); (c) business-hours analysts review every escalation; (d) paid on-call senior analyst for critical alerts 24/7 | Critical alerts: automatic containment action within **15 min**; human acknowledgement within **30 min**, 24/7. High and medium: next business-hours review. Monthly published MTTA and MTTC. *(Targets to validate in pilots.)* |
| 4. Black box, can't tune (18) | Read-only customer or MSP access to the dashboard; every detection rule visible; monthly "what we saw, what we dismissed and why" report; tuning requests | Tuning requests done within 5 business days |
| 5. Noise and false positives (17) | Only actionable escalations: each one carries a verdict, evidence and the exact fix (or the fix we already applied). Low-value alerts are summarised weekly, not ticketed. | **Noise credit:** if more than 25% of escalations in a month are marked false positive by the customer, that month is credited 20% |
| 6. Compliance and insurance pressure (16) | Evidence pack mapped to the FTC Safeguards Rule §314.4, HIPAA Security Rule, PCI DSS, NIST 800-171/CMMC L2 and GDPR, built on Wazuh's compliance mappings; vulnerability scan report every 6 months; one-page "monitoring attestation and SLA" letter for the insurer; help with the technical sections of carrier questionnaires | We provide evidence and technical answers only. We give no legal or insurance advice and do not act as the FTC "Qualified Individual". |
| 7. Slow response, MSP left doing remediation (14) | "We fix it" playbook, included: isolate, kill process, quarantine file, disable account, revoke tokens, reset MFA, block IP or domain at firewall, remove malicious inbox rules, guide reimage. Includes 2 hours of remediation a month; more at $150/hr. | The playbook is written into the contract, so the customer knows exactly what we do at 3 a.m. without calling them. |
| 8. Sales, contracts, lock-in (12) | Month-to-month; 12-month term optional for a 10% discount; no auto-renewing multi-year terms; no hardware box | Cancel with 30 days' notice; exit kit included |
| 9. Minimums lock out small shops (9) | Micro tier from 1 endpoint; MSP partner tier with **no minimum spend** | Compare Huntress (50 units per product), Blumira MSP ($500/mo minimum), SentinelOne Vigilance (200 endpoints); sources below |
| 10. Coverage gaps (9) | Firewall syslog, M365 and Google Workspace audit logs, Windows, macOS and Linux agents, ingestion of alerts from Defender, SentinelOne and CrowdStrike | Supported-source list published |
| 11. Ingest and storage cost (7) | Flat price; 365-day retention included (90 days hot, the rest archive) | Matches Blumira's published "365-day log retention" |
| 12. Support getting worse (6) | Named analyst per account; shared Slack or Teams channel for the MSP tier | Response to non-incident tickets within 1 business day |
| 13. Agent slows machines (3) | Tuned agent profiles; light profile for domain controllers (limited FIM, no heavy syscollector schedule) | Performance issue fixed within 2 business days or the agent is rolled back |

## Must-have parity features (or we lose the bake-off)

- 24/7 handling of critical alerts with endpoint isolation (Huntress, Blackpoint, Arctic Wolf all have this)
- Identity monitoring for M365 (impossible travel, inbox rules, token theft); this is ITDR parity
- Vulnerability detection (Wazuh vulnerability detector) and CIS hardening checks (Wazuh SCA)
- 365-day log retention (Blumira parity)
- PSA ticket integration (ConnectWise Manage, HaloPSA, Autotask) for the MSP tier
- Monthly executive report plus incident reports
- Onboarding in under 5 business days with a scripted agent rollout through RMM or Intune

## What we deliberately will NOT do

- **Build or resell our own EDR.** We use Defender for Business (bundled in M365 Business Premium) or the customer's existing EDR.
- **Full incident response or forensics retainers.** We refer to an IR partner, and the customer's cyber insurer usually appoints the IR firm anyway.
- **Sell insurance or give insurance or legal advice.** The r/msp thread consensus is that MSPs should not sell policies ([source](https://www.reddit.com/r/msp/comments/1w66ayj/do_msps_ever_offer_cyber_insurance_to_clients/)).
- **Penetration testing.** Partner it.
- **Promise eyes-on-glass humans for low and medium alerts overnight.** Automation contains the criticals, and humans review the rest in business hours.
- **Host CUI-adjacent data in our own cloud for CMMC customers.** For the defense segment, the CMMC tier deploys Wazuh *inside the customer's own Azure Government / GCC High enclave*. r/CMMC posters say cloud security tools handling that data need FedRAMP Moderate ([source](https://www.reddit.com/r/CMMC/comments/194cnss/comment/khfeh6p/)). Whether our remote access makes us an in-scope "Security Protection" provider has to be confirmed with a CMMC RP or C3PAO before we sell to this segment *(unverified)*.
- **Accounts above about 1,000 endpoints.** Not in year 1.

## Pricing tiers

| Tier | Price | Included | Setup |
|---|---|---|---|
| **Micro** | **$399/mo** flat, up to 25 endpoints + 1 M365 or Google tenant + 1 firewall | Everything in Core except the dedicated named analyst | $0 |
| **Core** | **$999/mo** up to 100 endpoints, then $8 per extra endpoint | 24/7 critical containment, triage, "We fix it" playbook with 2 hrs/mo, SIEM with 365-day retention, identity and firewall monitoring, vulnerability detection, monthly report | $0 month-to-month (or 10% off with 12 months) |
| **Compliance+** | **$1,499/mo** up to 100 endpoints, then $10 per extra endpoint | Core + mapped evidence pack (FTC Safeguards, HIPAA, PCI, NIST 800-171) + semi-annual vulnerability assessment report + insurer attestation letter + questionnaire help + annual tabletop; in-tenant deployment option | $1,500 (waived on a 12-month term) |
| **MSP Partner (white-label)** | **$3/endpoint/mo** "Co-managed" (we triage, tune and run the stack; the MSP does business-hours remediation) or **$6/endpoint/mo** "Fully managed" (adds 24/7 containment + playbook remediation). **No minimum spend.** | Brandable reports and portal, PSA integration, free not-for-resale use of 25 endpoints for the MSP's own environment | $0 |

### Arithmetic against incumbents (100 endpoints or 100 employees, per month)

| Vendor | What's included | Price basis (source) | ≈ $/mo at 100 | Our comparable tier |
|---|---|---|---|---|
| Huntress Managed EDR | EDR + 24/7 SOC (SIEM and ITDR extra) | MSRP $8.99/endpoint/mo ([huntress.com/pricing/edr](https://www.huntress.com/pricing/edr)); third-party bands $7.99 at 100–249 *(unverified)*; partner cost ~$3.50/endpoint with 50 minimum per r/msp ([source](https://www.reddit.com/r/msp/comments/z0zw8q/)) | $799–$899 (EDR only) | Core $999 sits *on top of* Defender: SIEM, firewall, identity, remediation. We are not cheaper than Huntress EDR and do not claim to be. |
| Blumira | SIEM + detection (+ response at higher tier) | $12 / $16 / $21 per employee per month ([blumira.com/pricing](https://blumira.com/pricing), [go.blumira.com/siem-pricing](https://go.blumira.com/siem-pricing)); MSP minimum $500/mo ([Blumira staff on r/msp](https://www.reddit.com/r/msp/comments/1p5wwxo/blumira_siem_free_is_going_away/)) | $1,200–$2,100 | Core $999 (−17% to −52%); Compliance+ $1,499 |
| Arctic Wolf MDR | MDR + SIEM + concierge | No public price. Third-party estimate ~$44k/yr for 100 users ([underdefense.com](https://underdefense.com/blog/arctic-wolf-pricing-guide), *unverified*); r/msp anecdote ~$30/endpoint/mo ([source](https://www.reddit.com/r/msp/comments/12w5sjn/comment/jhe2xf5/)) | ~$3,000–$3,667 | Compliance+ $1,499 (−50% to −59%) |
| Sophos MDR Complete | EDR + MDR | Reseller listings ~$160–$285 per user per year ([CDW.ca listing](https://www.cdw.ca/product/sophos-central-managed-detection-and-response-complete-subscription-licen/7504142)); r/msp quote 226.64 CAD per user per year ([source](https://www.reddit.com/r/msp/comments/1k5brhq/sophos_quote_for_pricing_for_mdr_user_and_server/)) | ~$1,333–$2,375 | Core $999 + Defender (in M365 Business Premium) |
| Rapid7 Managed Threat Complete | MDR + SIEM | ~$17/asset/mo, third-party ([sourceforge listing](https://www.sourceforge.net/software/product/Rapid7-Managed-Threat-Complete), *unverified*); Rapid7 page is quote-only ([rapid7.com](https://www.rapid7.com/de/services/managed-detection-and-response-mdr/pricing/)) | ~$1,700 | Core $999 (−41%) |
| CrowdStrike Falcon Complete | EDR + MDR | Quote-only. Falcon Enterprise *without* MDR lists at $184.99/device/yr ([crowdstrike.com/pricing](https://www.crowdstrike.com/en-gb/pricing/)) | >$1,542 before MDR | Core $999 |
| In-house 24/7 SOC | — | "$500k+ minimum to run an internal SOC" (r/cybersecurity comment, [source](https://www.reddit.com/r/cybersecurity/comments/1uvlaj1/)) | >$41,000 | — |

**For MSPs.** A partner reselling Core-equivalent coverage at $6/endpoint, alongside Huntress EDR at about $3.50 partner cost, pays about $9.50 per endpoint. r/msp threads report MSPs charging "$150/month/endpoint" ([source](https://www.reddit.com/r/msp/comments/1cyz1c2/comment/l5f82vj/)) or bundling security into $70–$300 per seat packages ([source](https://www.reddit.com/r/msp/comments/1mf4y3b/what_do_you_charge_for_soc/)). That leaves the MSP a healthy markup. These are anecdotes, not a survey.

### Unit economics (planning assumptions, not measured)

| Line, per 100-endpoint Core client per month | Low | High | Basis |
|---|---|---|---|
| Wazuh hosting (multi-tenant cluster, 90-day hot / 365-day archive) | $40 | $90 | Assumes ~1–2 GB/day of logs per 100 endpoints on shared OpenSearch nodes; **must be measured in pilots** |
| LLM triage and enrichment | $15 | $40 | Assumes 1–3k alerts a month pre-filtered by rules; cost scales with model choice |
| Business-hours analyst share | $230 | $310 | One analyst at ~$110k fully loaded, covering 30–40 clients with AI triage *(assumption)* |
| On-call senior rotation + incident hours | $50 | $90 | Two-person rotation with stipend, shared across ~60 clients |
| Tools (threat intel, ticketing, backups) | $20 | $40 | — |
| **Total cost** | **$355** | **$570** | |
| **Gross margin at $999** | **64%** | **43%** | Midpoint ~55% |
| Gross margin at $1,499 (Compliance+, +$150 effort) | 66% | 52% | |
| MSP $6/endpoint (100 endpoints = $600) | cost ~$230–$330 → **45–62%** | | MSP handles L1 contact |

The margin fix compared with a pure 24/7 human SOC rests on three things: automation containing criticals overnight, AI triage cutting analyst minutes per alert, and on-call staff paid per rotation instead of three overnight shifts. If AI triage does not reach the 30–40 clients-per-analyst ratio, margin falls toward 40%, which is services-level. **The pilot must measure analyst minutes per client per month.**

## Licensing note

Wazuh is GPL-2.0. Running it as a hosted service does not trigger source distribution. If we ship *modified* agent binaries to customers, we must offer the source for those changes. Keep any proprietary value (triage prompts, playbooks, parsers we choose not to share) in separate services, not in patched Wazuh code. *(Get legal review before launch.)*
