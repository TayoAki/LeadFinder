# 03 · ICP canvas: managed detection & fix (Wazuh-based)

**US counts.** Unless stated otherwise, counts come from Census County Business Patterns 2022 (`cbp22us.txt`, lfo = all, establishment counts by employee-size band). CBP counts **establishments, not firms**, so multi-site companies are counted once per site. Treat every count as an upper bound on reachable buyers. The size bands were chosen so the endpoint count lands near the tiers in 02: 10–19 employees fits Micro, and 20–249 fits Core or Compliance+.

**Evidence strength** refers to the tight snippets in 01 (155 total; r/msp 70, r/sysadmin 48, r/cybersecurity 27, r/CMMC 4, r/smallbusiness 1, plus a few others).
- Strong: 20 or more snippets come from this buyer.
- Medium: there are specific threads, but few of them.
- Weak: the case rests on regulation alone.

---

## Segment 1 · MSPs without their own SOC (channel, white-label)

- **Who:** Owners and technical leads (vCIO, security lead) at MSPs with 3–50 staff who manage 300–5,000 endpoints, sell security in per-seat bundles, and have no 24/7 staff.
- **Firmographics:** NAICS 541512, 541513 and 541519 with 10–249 employees. Typical stack: Huntress, SentinelOne or Defender; an RMM (NinjaOne, Datto, ConnectWise); a PSA (Halo, ConnectWise, Autotask); buys through Pax8.
- **US count:** **12,032 establishments.** That is 541512 = 8,927, 541513 = 1,476 and 541519 = 1,629 in the 10–249 employee bands (CBP 2022). It is an upper bound because these codes also include custom dev shops and consultancies.
- **Pain (their words):**
  - "The human backed 24/7 SOC model is completely broken" ([r/msp](https://www.reddit.com/r/msp/comments/1nd6v5k/comment/ndgc0l0/))
  - "all MDR vendors require the MSP to be involved with remediation" ([r/msp](https://www.reddit.com/r/msp/comments/1jmr23e/really_completely_managed_handsoff_mdr_endpoint/))
  - "pricing is like death by a thousand cuts" ([r/msp](https://www.reddit.com/r/msp/comments/1tph26w/comment/oo9d607/))
  - "We can't justify Blumira's new US $500/month minimum" ([r/msp](https://www.reddit.com/r/msp/comments/1qsegm7/postblumira_free_tier_life_what_would_you/))
  - "Most MDR/EDR solutions seem to be priced or designed for MSPs managing 100+ endpoints minimum" ([r/msp](https://www.reddit.com/r/msp/comments/1l453ug/comment/mwu61rn/))
- **Trigger events (detectable):**
  - A vendor changes price or minimums (Blumira's free edition ended on 2026-01-31; Huntress introduced per-product 50-unit minimums).
  - A client hits an insurance renewal, the FTC Safeguards Rule or CMMC.
  - The MSP posts a "Huntress alternatives" or "MDR Solutions" thread on r/msp.
  - The MSP posts a job for a "SOC analyst" or "security engineer" (LinkedIn jobs).
  - The MSP lands its first regulated client (a dealership or CPA firm).
- **Watering holes:** r/msp (the largest source in 01), MSPGeek Slack/Discord, Pax8 marketplace and Pax8 Beyond, ConnectWise IT Nation, Kaseya DattoCon, ASCII Group, CompTIA ISAO, the MSP subreddit's vendor AMA threads, and the Huntress community (Tradecraft Tuesday audience).
- **Budget behaviour:** Pays per endpoint per month and marks it up into a bundle (anecdotes: "$150/month/endpoint" bundles, $70–$300 per seat). Wants month-to-month billing through Pax8 or direct, with no minimums. Watches margin closely.
- **Objections → counters:**
  - "Huntress already does this." → We sit beside Huntress EDR. We add SIEM, firewall and identity coverage plus compliance evidence. Huntress SIEM is called "a compliance checkbox" by its own users.
  - "Liability if your SOC misses something." → Written playbook, published SLAs, insurer attestation letter, and our E&O certificate.
  - "Another console." → PSA tickets plus a white-label portal, and the MSP never has to log in for routine work.
- **Disqualify if:** The MSP already runs its own 24/7 SOC (an MSSP), is fully on Arctic Wolf or Falcon Complete with a multi-year contract, or has fewer than 100 managed endpoints in total.
- **How to find email + phone:**
  - Google Maps "managed IT services" by metro via `treg.google.serp.maps` ($0.00015/hit), which gives phone and website.
  - Owner email via `treg.people.email.find` (from ~$0.0005/hit) using name + domain. Get the owner's name from `anyapi.linkedin.company.people` or the site's About page.
  - Named lists: Pax8 and Huntress partner locators, the Channel Futures MSP 501, the CompTIA member directory.
- **Evidence strength:** **Strong.** 70 tight snippets come from r/msp.

## Segment 2 · Lean in-house IT teams (1–3 IT staff) at 100–500 employee companies at MDR or EDR renewal

- **Who:** IT managers and sysadmins who are "my own SOC" at mid-size companies in any industry. They are renewing Arctic Wolf, ESET, Carbon Black or Falcon Complete, or are replacing a SIEM nobody tunes.
- **Firmographics:** 100–499 employees, Microsoft 365 E3/E5 or Business Premium, 100–600 endpoints, hybrid on-prem and cloud.
- **US count:** **172,157 establishments** with 100–499 employees, all industries (CBP 2022: 134,687 at 100–249 and 37,470 at 250–499). This overcounts heavily because many are branches of larger firms.
- **Pain (their words):**
  - "Running EDR in-house while also owning everything else is a massive lift" ([r/sysadmin](https://www.reddit.com/r/sysadmin/comments/1q8g8a4/comment/nz5bvn4/))
  - "starting to feel a bit like a bait and switch" (Arctic Wolf renewal, [r/sysadmin](https://www.reddit.com/r/sysadmin/comments/1sx9sc8/deciding_whether_to_renew_arctic_wolf_or_cut/))
  - "Anyone else feel like their SIEM is just expensive log storage?" ([r/sysadmin](https://www.reddit.com/r/sysadmin/comments/1mqy2um/anyone_else_feel_like_their_siem_is_just/))
  - "I am my own SOC so its even harder" ([r/sysadmin](https://www.reddit.com/r/sysadmin/comments/1sx9sc8/))
- **Trigger events:**
  - An EDR or MDR renewal is 60–120 days out (people post "approaching renewal" threads).
  - The security person leaves.
  - A ransomware incident hits a peer in the same industry.
  - The insurer adds a 24/7 monitoring question.
  - A job post for "Security Analyst" at a company with fewer than 500 employees (`anyapi.linkedin.search.jobs`).
- **Watering holes:** r/sysadmin, r/ITManagers, r/cybersecurity, Spiceworks Community, local ISSA and InfraGard chapters, SpiceWorld.
- **Budget behaviour:** $20k–$100k a year for MDR. Arctic Wolf deal data puts the median at ~$96k ([underdefense](https://underdefense.com/blog/arctic-wolf-pricing-guide), *unverified*). Annual budget cycle; a CFO signs off; wants three quotes.
- **Objections → counters:**
  - "Open-source SIEM = cheap and flaky." → We operate it, and a published SLA covers it.
  - "Arctic Wolf has network sensors." → Firewall syslog + Wazuh agents; Suricata optional.
  - "AI triage is marketing." → A 30-day side-by-side run against their current MDR.
- **Disqualify if:** More than 1,000 endpoints, an in-house SOC already, or they need FedRAMP or a hosted SIEM for CUI.
- **How to find email + phone:**
  - Search LinkedIn jobs for "security analyst" or "sysadmin" posts at companies with 100–500 employees (`anyapi.linkedin.search.jobs`, $0.0005/hit).
  - Find the IT manager via `enrichlayer.company.employees.search` (title "IT Manager", "Director of IT").
  - Get the work email via `treg.people.email.find`. Get the phone from Google Maps (`treg.google.serp.maps`) for the main line.
- **Evidence strength:** **Strong.** 48 tight snippets come from r/sysadmin, plus r/ITManagers.

## Segment 3 · Franchised auto dealerships (FTC Safeguards Rule)

- **Who:** Dealer principals, controllers and IT managers (often one person) at single- and multi-rooftop franchised dealers. They are usually served by an MSP.
- **Firmographics:** NAICS 441110, 20–249 employees, a DMS (CDK, Reynolds), handles consumer financing data, and is therefore a "financial institution" under 16 CFR 314.
- **US count:** **16,744 establishments.** That is new car dealers (441110) at 15,461 plus used car dealers (441120) at 1,283, both in the 20–249 employee bands (CBP 2022).
- **Pain (their words):**
  - "what anyone is doing regarding the FTC Safeguards amendments… specifically when it comes to automotive dealerships" ([r/msp](https://www.reddit.com/r/msp/comments/ycfdc5/ftc_safeguards_for_auto_dealerships/))
  - "what MDR are you using for the safeguards rule?" ([r/msp](https://www.reddit.com/r/msp/comments/10k9dpb/ftc_safeguards_rule_mdr_auto_dealerships/))
  - "the formality of it all is a lot" ([r/msp](https://www.reddit.com/r/msp/comments/ycfdc5/comment/iuh2ck9/))
- **Regulatory hook:** §314.4(d)(2) requires *either* continuous monitoring *or* annual penetration tests plus vulnerability assessments every 6 months ([16 CFR 314.4 via Cornell LII](https://www.law.cornell.edu/cfr/text/16/314.4%29)). Institutions with fewer than 5,000 consumers are exempt from parts of the rule ([hsfkramer](https://www.hsfkramer.com/notes/data/2021-11/us-federal-trade-commission-updates-safeguards-rule-for-consumer-financial-information)).
- **Trigger events:** Dealer group acquisitions (new rooftops), an insurance renewal, an annual Safeguards report to the board, an FTC enforcement headline, or a DMS outage or ransomware story (dealers were hit by the 2024 CDK outage *(unverified for this segment's buying)*).
- **Watering holes:** NADA Show, state dealer associations, DealerRefresh forum, 20 Groups (NCM), Automotive News, the MSPs that serve dealers.
- **Budget behaviour:** Compliance spend is approved when framed as a Safeguards requirement. Prefers one vendor and a monthly fee. Low tolerance for complexity.
- **Objections → counters:**
  - "Our DMS vendor handles security." → The DMS covers the DMS, not your endpoints, email or firewall.
  - "We did a pen test." → Continuous monitoring replaces the 6-month vulnerability assessment cycle and produces evidence every month.
- **Disqualify if:** The dealer is part of a large group with corporate IT and a SOC, or has under 10 employees (Micro tier only).
- **How to find email + phone:**
  - Google Maps "car dealer" + brand by state via `treg.google.serp.maps` (phone + site).
  - Controller or GM email via `treg.people.email.find`.
  - Named lists: OEM dealer locators (Ford, Toyota and others) and state dealer association member lists.
- **Evidence strength:** **Medium.** 2 specific r/msp threads plus 1 compliance thread. The volume is from MSPs, not dealers. Best sold *through* Segment 1.

## Segment 4 · Accounting and tax firms (FTC Safeguards + IRS WISP)

- **Who:** Managing partners and office managers at CPA and tax firms with 10–249 staff.
- **Firmographics:** NAICS 541211, 541213 and 541219. They are covered by the FTC Safeguards Rule as tax preparers, and the IRS expects a written information security plan (WISP).
- **US count:** **15,453 establishments.** That is CPA offices (541211) at 8,713, tax preparation (541213) at 2,901 and other accounting (541219) at 3,839, all in the 10–249 employee bands (CBP 2022).
- **Pain (their words):**
  - "One of new CPA clients… need to have a written information security plan (WISP) as a part of the FTC safeguards rule" ([r/msp](https://www.reddit.com/r/msp/comments/zs1dxu/new_cpa_client_written_information_security_plan/))
  - "Running a real 24/7 soc in house is very expensive. I'm just not sure which vendors actually check the box" (MSP on FTC Safeguards, [r/msp](https://www.reddit.com/r/msp/comments/1qrgqm2/comment/o2prgjc/))
- **Trigger events:** The off-season (May–December) is when firms have time to buy. Other triggers: PTIN renewal, insurance renewal, a client data incident at a peer firm, new e-file security guidance.
- **Watering holes:** AICPA ENGAGE, state CPA societies, r/taxpros, r/Accounting, Intuit ProConnect and Drake user communities, CPA.com.
- **Budget behaviour:** Price-sensitive. Micro ($399) fits 10–25 seat firms, and Compliance+ fits 50+. Annual billing is fine if it is paid outside tax season.
- **Objections → counters:**
  - "We're too small to be targeted." → Tax firms hold SSNs and bank data, and the carrier questionnaire already asks about this.
  - "Our MSP does it." → Then sell through the MSP (Segment 1).
- **Disqualify if:** A sole practitioner (no endpoints to monitor), or the Big-4 or top-100 firm network.
- **How to find email + phone:**
  - State CPA society "find a CPA" directories.
  - Google Maps "CPA firm" / "tax preparation" by metro via `treg.google.serp.maps`.
  - Partner email via `treg.people.email.find`.
- **Evidence strength:** **Medium-weak.** 2 threads, both MSP-voiced.

## Segment 5 · Defense-industrial-base small manufacturers and engineering firms (CMMC Level 2)

- **Who:** The IT lead and the compliance or FSO owner at DoD subcontractors that handle CUI.
- **Firmographics:** 20–500 employees, machine shops, electronics, aerospace parts, engineering services. Often on M365 GCC High.
- **US count:**
  - DoD estimated **8,350** medium and large entities needing a Level 2 C3PAO assessment, and 182,105 Level 2 C3PAO assessments over 10 years, in the CMMC program rule ([Federal Register 2024-22905](https://www.federalregister.gov/documents/2024/10/15/2024-22905/cybersecurity-maturity-model-certification-cmmc-program)).
  - The 2025 acquisition rule estimated **337,968** affected contractors, of which ~229,818 are small businesses (summarised in [Protiviti](https://blog.protiviti.com/2025/09/11/cmmc-final-rule-published-what-it-means-for-the-defense-industrial-base/)).
  - CBP proxy: transportation equipment, computer and electronic manufacturing, engineering services and physical/engineering R&D establishments with 20–249 employees total **21,570** (4,305 + 3,839 + 11,012 + 2,414).
  - Use the 8,350 figure for planning.
- **Pain (their words):**
  - "Small business SIEM" (61-comment thread, [r/CMMC](https://www.reddit.com/r/CMMC/comments/1cys11o/small_business_siem/))
  - "If you are required to be CMMC compliant… your options for a cloud-hosted SIEM are limited. You need one that is FedRAMP" ([r/CMMC](https://www.reddit.com/r/CMMC/comments/sbe5zy/comment/hv1ihsl/))
  - "Must be FedRAMP and only FedRAMP moderate is sufficient. Eliminate 95% of all MDR offerings" ([r/CMMC](https://www.reddit.com/r/CMMC/comments/194cnss/comment/khfja7o/))
  - "Does CMMC actually require a SIEM?" ([r/CMMC](https://www.reddit.com/r/CMMC/comments/1lfbucy/does_cmmc_actually_require_a_siem/))
- **Trigger events:** A DFARS 252.204-7021 clause appears in solicitations; the phased rollout per DoD runs from Nov 2025, with C3PAO requirements expanding in later phases. Other triggers: a prime flows down the requirement, a SPRS score submission, or a C3PAO assessment is scheduled.
- **Watering holes:** r/CMMC, the Cyber AB marketplace (RPs and RPOs), NDIA chapters, APEX Accelerators (formerly PTACs), CMMC Day, Summit 7 webinars.
- **Budget behaviour:** Spend is driven by certification deadlines. Pays for compliance evidence and a CRM/SSP mapping. Will pay a premium for "in your enclave" deployment.
- **Objections → counters:**
  - "FedRAMP." → Deploy inside the customer's GCC High or Azure Government tenant. Needs C3PAO confirmation (*unverified*).
  - "Foreign SOC staff (ITAR)." → US-person analysts only for this tier.
- **Disqualify if:** They need a FedRAMP-authorised *hosted* service, or have fewer than 10 endpoints in the CUI enclave (the CRM work costs more than they would pay).
- **How to find email + phone:**
  - The SAM.gov entity registration public extract (POCs, NAICS, CAGE).
  - The DoD prime subcontract lists that USAspending.gov publishes.
  - Google Maps "machine shop" / "precision manufacturing" via `treg.google.serp.maps`.
  - Email via `treg.people.email.find`.
- **Evidence strength:** **Medium.** 4 tight r/CMMC snippets plus 3 large threads. The delivery model (in-enclave) is a real constraint and has to be validated first.

## Segment 6 · Small manufacturers (non-defense) facing cyber-insurance renewals

- **Who:** The IT manager or controller at plants with 20–249 employees, OT-adjacent networks and thin IT.
- **Firmographics:** NAICS 31–33, 20–249 employees.
- **US count:** **80,250 establishments** (CBP 2022: 42,130 at 20–49, 21,313 at 50–99 and 16,807 at 100–249). Fabricated metal (332) alone accounts for 14,896.
- **Pain (their words):**
  - "We implemented Arctic Wolf across the platform" after acquisitions ([r/cybersecurity](https://www.reddit.com/r/cybersecurity/comments/1al5h4t/comment/kpcmead/), manufacturing acquirer). This is praise, but it shows the buying pattern.
  - "your cyber security budget is going to increase based on the questions they ask" ([r/msp](https://www.reddit.com/r/msp/comments/1ou4g6z/comment/noakumf/))
  - "cyber insurance companies are the ones requiring it" ([r/sysadmin](https://www.reddit.com/r/sysadmin/comments/1e7wolk/edr_and_cyber_insurance/))
- **Insurance context:** Vendor blogs report that carriers expect EDR on all endpoints plus 24/7 monitoring via MDR, with evidence rather than attestation ([Consilien 2026 checklist](https://consilien.com/news/cyber-insurance-requirements-2026-checklist), [Cyber Advisors](https://blog.cyberadvisors.com/cyber-insurance-in-2026-the-controls-underwriters-expect-and-how-to-prove-them)). These sources are vendors, so treat them as *unverified* until we see a carrier application.
- **Trigger events:** An insurance renewal (60–90 days before), a ransomware story in the local trade press, an ERP migration, or an acquisition.
- **Watering holes:** NIST MEP centers, state manufacturers' associations, r/manufacturing, r/sysadmin, the local MSPs that serve industrial clients.
- **Budget behaviour:** Driven by capex and insurance. Insurance renewal is the forcing date. Compares against Arctic Wolf quotes.
- **Objections → counters:**
  - "OT can't take agents." → Firewall and syslog monitoring for the OT side, agents on the IT side.
  - "Insurer recommended X." → Our attestation letter plus SLA meets the same questionnaire line.
- **Disqualify if:** OT-only security needs (Dragos/Claroty territory), or the plant belongs to a large enterprise with corporate IT.
- **How to find email + phone:**
  - Google Maps by industry keyword and county via `treg.google.serp.maps`.
  - Plant or IT manager via `enrichlayer.company.employees.search`.
  - Email via `treg.people.email.find`.
  - State manufacturing directories (e.g., MNI / Harris directories, which may be paid).
- **Evidence strength:** **Medium-weak.** The insurance pain is strong in general (16 snippets), but manufacturer-specific quotes are thin.

## Segment 7 · Medical and dental practices (HIPAA)

- **Who:** Practice administrators and office managers. Often served by an MSP.
- **Firmographics:** Physician offices (621111) with 20–249 employees and dental offices (621210) with 10–249 employees.
- **US count:** **62,614 establishments.** Physicians 26,710 (19,388 + 4,991 + 2,331) plus dentists 35,904 (29,252 + 6,118 + 449 + 85), CBP 2022.
- **Pain (their words):** Only indirect evidence. One example: "This pricing was for a medical office… [AW] SOC came down to like $30/endpoint/month" ([r/msp](https://www.reddit.com/r/msp/comments/12w5sjn/comment/jhe2xf5/)). There were no first-person practice-owner complaints in the corpus.
- **Trigger events:** An HHS OCR breach-portal listing at a peer practice, an EHR migration, an insurance renewal, a merger into a DSO or MSO.
- **Watering holes:** MGMA, state dental associations, Dental Economics, r/Dentistry, healthcare-focused MSPs.
- **Budget behaviour:** Very price-sensitive, and buys through the IT provider.
- **Objections → counters:**
  - "Our EHR is cloud." → Endpoints and email are still the breach path.
  - "HIPAA risk assessment already done." → We add continuous evidence.
- **Disqualify if:** Owned by a hospital system or DSO with central IT.
- **How to find email + phone:**
  - The free CMS NPPES NPI Registry API (practice name, address, phone).
  - The website from Google Maps (`treg.google.serp.maps`).
  - Email via `treg.people.email.find`.
- **Evidence strength:** **Weak.** Regulation only, so test it cheaply through MSPs (Segment 1).

## Segment 8 · Law firms (10–249 staff)

- **Who:** The managing partner or firm administrator.
- **Firmographics:** NAICS 541110, 10–249 employees.
- **US count:** **21,315 establishments** (12,140 at 10–19 plus 9,175 at 20–249, CBP 2022).
- **Pain (their words):** None found in the corpus. The only adjacent signal is an MSP/insurance owner building "a 4th [policy] that is for small law firms" ([r/msp](https://www.reddit.com/r/msp/comments/1ou4g6z/comment/noagn5c/)), which shows carriers target the segment.
- **Trigger events:** Client outside-counsel security questionnaires (banks and insurers ask firms), wire-fraud incidents, insurance renewal.
- **Watering holes:** ILTA, ABA TECHSHOW, r/LawFirm, state bar practice-management advisors.
- **Budget behaviour:** Pays when a client questionnaire demands it.
- **Disqualify if:** Solo practice, or AmLaw 200.
- **How to find email + phone:** State bar directories, Google Maps "law firm" via `treg.google.serp.maps`, `treg.people.email.find`.
- **Evidence strength:** **Weak.** Park it unless the smoke test shows replies.

## Parked: not supported by the evidence

| Segment | US count | Why parked |
|---|---|---|
| Credit unions | 2,361 establishments with 20–249 employees (NAICS 522130, CBP 2022; includes branches) | No snippets. NCUA supervision and core-processor vendors already bundle monitoring *(unverified)*. Long procurement. |
| K-12 schools | 12,546 independent school districts ([Census of Governments 2022 via St. Louis Fed](https://www.stlouisfed.org/publications/regional-economist/2024/march/local-governments-us-number-type)); 12,300 private K-12 establishments with 20–249 employees (CBP 611110) | No snippets. RFP and E-Rate procurement cycles. |
| Local government | 90,837 local governments ([Census 2022](https://www.census.gov/library/publications/2026/econ/govtorg2225.html)) | No snippets. RFPs, often covered by state or CIS MS-ISAC programs *(unverified)*. |

## Priority order and why

1. **MSPs without a SOC (Segment 1).** Strongest evidence (70 snippets), a reachable list of ~12k, and one MSP brings 300–5,000 endpoints. It is also the cheapest path into Segments 3, 4 and 7, because those buyers already rely on an MSP. The partner tier with no minimum speaks directly to the minimums and price pains.
2. **Lean IT teams at MDR or EDR renewal (Segment 2).** Strong evidence (48 snippets), a large pool, the highest contract value ($999–$4,000/mo), and a detectable trigger (renewal threads, security job posts).
3. **Auto dealerships (Segment 3).** A clear regulatory hook (§314.4 continuous monitoring), dense firmographics (15k+ in a narrow size band), and a single buyer. Sell Compliance+ direct and also through dealer-focused MSPs.
4. **Defense-industrial-base contractors (Segment 5).** Urgent, deadline-driven and pays a premium, but **blocked until the in-enclave delivery model is confirmed** with a CMMC RP or C3PAO.
5. **Accounting and tax firms (Segment 4).** Same hook as dealers. Seasonal, with the window from May to December.
6. **Manufacturers (Segment 6).** Large, but the evidence is generic. Test the insurance-renewal message.
7–8. **Medical/dental and law firms.** Test only through MSP partners until direct evidence appears.
