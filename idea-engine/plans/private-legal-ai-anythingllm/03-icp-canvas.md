# 03 · ICP canvas

Segments are kept only where 01 has real buyer-side quotes. US counts use **US Census County Business Patterns 2022** (`data/census_cbp2022_legal.json`, computed from `cbp22us.txt`, lfo = all) unless stated otherwise.

**Caveat on counts:** CBP counts *establishments* (offices, not firms), banded by *paid employees* (lawyers plus staff), not by lawyers. So "5–19 employees" is a **proxy** for a 2–10-lawyer office. Lawyers with no employees (Census Nonemployer Statistics) are **not** included. I could not pull the NES 2022 figure because the API requires a key.

**NAICS 541110 Offices of lawyers, 2022:** 166,972 establishments and 1,078,148 employees.
By employee band: <5: 120,321 · 5–9: 25,093 · 10–19: 12,140 · 20–49: 6,471 · 50–99: 1,841 · 100–249: 863 · 250–499: 181 · 500–999: 48 · 1000+: 14.

Firm-size context:
- An ABA compilation cited in a 2017 ABA book puts solos at about 49% of private practitioners and solo plus 2–5-lawyer firms at about 63% ([vLex excerpt](https://law-journals-books.vlex.com/vid/chapter-4-your-chances-1037080474)). This is old data.
- Clio's 2025 Legal Trends for Solo and Small Firms reports AI use "in some capacity" by 72% of solos and 67% of small firms, but only 8% and 4% use it "widely or universally" ([Clio](https://www.clio.com/blog/solo-small-law-firms-highlights-2025-legal-trends/)).

---

## S1 · Mid-size firms, about 11–50 lawyers (multi-practice, with a managing partner or ops/IT lead)

- **Who:** the managing partner, firm administrator or COO, IT director, or a chair of the innovation/technology committee.
- **Firmographics:** 20–99 employees, 1–3 offices, Microsoft 365 shop. Often on iManage, NetDocuments, Clio or Filevine. Already pays Westlaw or Lexis.
- **US count:** **8,312** establishments with 20–99 employees (6,471 + 1,841), Census CBP 2022, NAICS 541110. This is a proxy for 11–50-lawyer offices and includes some branch offices of larger firms.
- **Pain (their words):**
  - "the managing partner is fearful of putting client data into any LLM… he wants ironclad proof that we aren't violating attorney-client privilege" (about 15 attorneys) ([r/LawFirm](https://www.reddit.com/r/LawFirm/comments/1v5rlfo/how_are_you_getting_past_the_confidentiality/))
  - "We have ~45 lawyers. Harvey told us 40 minimum, Legora told us 30." ([r/legaltech](https://www.reddit.com/r/legaltech/comments/1riw06u/harvey_legora_user_minimums/o8jvnff/))
  - "No native connection to our DMS… download > upload into tool > do work > download work > upload into our DMS." (about 30 attorneys) ([r/legaltech](https://www.reddit.com/r/legaltech/comments/1w2piu1/we_trialed_cocounsel_harvey_and_legora_here_is/))
  - "The thing that moved our partners was asking vendors for a full ethics audit trail" ([r/LawFirm](https://www.reddit.com/r/LawFirm/comments/1v5rlfo/how_are_you_getting_past_the_confidentiality/ozl7ui8/))
  - Survey: 56% of 10–49-attorney firms cite privacy and security as an AI concern, against 24% of solos (ABA 2024 TechReport via [LawNext](https://lawnext.com/2025/03/aba-tech-survey-finds-growing-adoption-of-ai-in-legal-practice-with-efficiency-gains-as-primary-driver.html), secondary).
- **Trigger events (detectable):** job post for "legal technology manager", "innovation", "knowledge management" or "IT director" at a law firm (job-board search); firm publishes an AI policy or an AI committee announcement on LinkedIn; a state bar issues new AI guidance; Clio announces a price increase ("Annual Complete plan will be updated to $1609.20 per user", [r/LawFirm](https://www.reddit.com/r/LawFirm/comments/1kxzxvy/clio_price_increase/)); firm merger or new office; a sanctions story in their state.
- **Watering holes:** r/legaltech, r/LawFirm; ILTA/ILTACON (IT leads); ABA TECHSHOW; Legalweek; ClioCon; state bar law-practice-management sections; Association of Legal Administrators (ALA) chapters; LinkedIn.
- **Budget behaviour:** they already pay Westlaw or Lexis per seat and are now being quoted $400–$1,600 per seat for AI. Committee buying with pilots ("We pilot, simple score, and eventually will roll out"). Annual budget cycle, but a flat $999/mo is under most partner sign-off limits (*assumption*).
- **Objections and counters:**
  - "We'll just use Copilot or Claude Enterprise." → Show matter-level walls and the audit export. Copilot's SharePoint inheritance is "a Rule 1.6 nightmare" (01). Keep Claude as the model inside Firm Vault.
  - "Our IT can build this." → Then they are not the buyer (disqualify), or offer On-Prem with their IT as co-owner.
  - "Is it as good as Harvey?" → Same frontier models. We don't claim more; the price is about 10× lower at 15 users.
- **Disqualify if:** fewer than 2 people use AI today and the partners have banned it with no appetite to revisit; an in-house engineering team already building; a firm-wide Harvey or Legora contract signed in the last 12 months.
- **How to find email + phone:** Google Maps (`treg.google.serp.maps`, query "law firm" + city, 50 largest metros) → website domain → `treg.people.search` (domain + titles "Managing Partner", "Firm Administrator", "Director of IT", "COO") → `treg.people.email.find` → `treg.people.email.verify` → `treg.people.phone.find` with live-line check. The main switchboard number comes from the Maps listing. Cross-check with state bar directory records (many list firm phone and email).

## S2 · Document-heavy small litigation firms, 2–10 lawyers (plaintiff PI, med-mal, housing/civil litigation)

- **Who:** owner or founding partner, often with 1–3 paralegals.
- **Firmographics:** 5–19 employees, Clio, Filevine, MyCase or CASEpeer. Thousands of pages of medical records per case. Already buys per-case AI (EvenUp, Supio, Eve).
- **US count:** **37,233** establishments with 5–19 employees (25,093 + 12,140), Census CBP 2022, NAICS 541110. Proxy, not litigation-only. Cross-check: IBISWorld counts 50,435 "Personal Injury Lawyers & Attorneys" businesses in 2025, including solos ([IBISWorld](https://ibisworld.com/united-states/number-of-businesses/personal-injury-lawyers-attorneys/4812)), *secondary*.
- **Pain (their words):**
  - "I just received 6000 pages of medical records… How can I do that while using reasonable efforts to maintain the confidentiality of my client?" (2 lawyers) ([r/legaltech](https://www.reddit.com/r/legaltech/comments/1tuyuhp/best_ai_for_small_law_firm_to_review_sensitive/))
  - "We use supio… ($250/case). I did a trial with eve… ($350/case)" ([r/LawFirm](https://www.reddit.com/r/LawFirm/comments/1mzu89i/personal_injury_demand_ai_software_service/))
  - "Filevine sold me their case management software too, and that has been a complete nightmare." ([r/LawFirm](https://www.reddit.com/r/LawFirm/comments/1mzu89i/personal_injury_demand_ai_software_service/))
  - "We use a provider that built and set up our AI server on premise. They maintain the AI and create new agents for new tasks." ([r/LawFirm](https://www.reddit.com/r/LawFirm/comments/1r5lht1/ai_for_pi_law_firm_owners/o5llx9r/))
  - "1 attorney, 1 paralegal, 2 remote admin staff… wondering if a 'simple'… local llm set up… could help" ([r/LocalLLM](https://www.reddit.com/r/LocalLLM/comments/1rj4hkj/small_law_firm_considering_local_llm_setup_for/))
- **Trigger events:** paralegal departure (the solo who "terminated my paralegal of 10 years"); job post for a paralegal or case manager; switch of case-management system; running Google Ads for "car accident lawyer" (a sign of case-volume growth); per-case AI spend becoming visible.
- **Watering holes:** r/LawFirm, r/Lawyertalk; AAJ conventions; state trial-lawyer associations (e.g. CAOC, FJA, TTLA); Max Law Con / PI marketing conferences (*unverified names*); CASEpeer/Filevine user groups; Facebook PI-owner groups.
- **Budget behaviour:** contingency-fee owners compare against per-case fees ($250–$750/case reported) and a paralegal salary. A flat $999/mo pays back at about 3–4 demand packages a month against Supio or Eve prices (arithmetic from the quoted per-case prices).
- **Objections and counters:**
  - "EvenUp has nurses reviewing." → We don't replace a reviewed demand. We make the medical chronology and record Q&A private and unlimited, so the firm can do first-pass work in-house.
  - "Will it get page cites right?" → Page-anchored chunks, demonstrated on their own file in the pilot (the known weakness from 01).
- **Disqualify if:** fewer than about 10 active document-heavy cases; fully outsourced demand writing that they are happy with; unwilling to put documents in a pilot.
- **How to find email + phone:** `treg.google.serp.maps` ("personal injury attorney", "medical malpractice lawyer" by city) gives phone and website. Then the domain → `treg.people.search` (owner/partner) → `treg.people.email.find` + verify. State trial-lawyer association public member directories where available.

## S3 · Insurance defense firms (panel counsel to carriers)

- **Who:** managing partner and practice-support manager.
- **Firmographics:** 10–100 lawyers, high-volume files, carrier billing guidelines, many paralegals.
- **US count:** **no public count found (unverified).** It is a subset of S1 and S2. Lead lists come from carrier panel-counsel pages and DRI (Defense Research Institute) membership. The DRI count was not checked.
- **Pain (their words):**
  - "Our firm is pushing us to use AI daily because our clients (insurance companies) are mandating its use for certain tasks… It takes me at least twice as long to get Co-Counsel to create an index of documents" ([r/paralegal](https://www.reddit.com/r/paralegal/comments/1q5qqt9/is_it_me_or_is_cocounsel_terrible/))
  - "I work insurance defense and this client has been pushing for billing purposes… They can have the AI trash at the AI .1" ([r/paralegal](https://www.reddit.com/r/paralegal/comments/1luuleq/anyone_else_hate_cocounsel/n2aoi4a/))
  - "There is no way carriers will allow firms to bill the same amount for medical record reviews, boilerplate/basic pleadings, reporting, summaries" ([r/Lawyertalk](https://www.reddit.com/r/Lawyertalk/comments/1xnyzjl/how_do_we_think_ai_will_change_insurance_defense/))
- **Trigger events:** a carrier changes billing guidelines or moves to flat fees; the firm announces AI adoption; paralegal turnover; new panel appointment.
- **Watering holes:** DRI annual meeting; CLM (Claims & Litigation Management Alliance); r/paralegal, r/Lawyertalk; state defense-counsel associations.
- **Budget behaviour:** margin squeezed by flat fees, so every hour saved on summaries or reporting is margin. Already forced into CoCounsel by carriers, and unhappy with it.
- **Objections and counters:** "The carrier mandates a specific tool" → position Firm Vault as the internal tool for the firm's own work product. Check whether the carrier allows it; this is the key question for the real test.
- **Disqualify if:** the carrier contract requires a named AI vendor for all file work.
- **How to find email + phone:** carrier panel-counsel lists and DRI directories (manual or `treg.web.extract`) → firm domain → `treg.people.search` → email find + verify; phone from `treg.google.serp.maps`.

## S4 · In-house legal teams at mid-size companies (500–4,999 employees)

- **Who:** General Counsel or Head of Legal with a 2–10-person team, sometimes legal ops.
- **Firmographics:** contracts-heavy (MSAs, NDAs, supplier agreements), M365, procurement and InfoSec review.
- **US count:** **21,041** US firms with 500+ employees (SUSB 2022, from a secondary analysis at [startbusinessbystate.com](https://startbusinessbystate.com/?p=15201)). **Unverified** against the Census table. Not every such firm has an in-house lawyer.
- **Pain (their words):**
  - "They've seen the demos… And then procurement stalls for six months and eventually quietly dies… It's about where the data goes." (vendor-side observation, loose) ([r/legaltech](https://www.reddit.com/r/legaltech/comments/1ta02wh/why_enterprise_legal_teams_quietly_wont_send/))
  - "We have 'safe' enterprise versions of ChatGPT and CoPilot. CoPilot sucks and is just clippy 2.0." ([r/Lawyertalk](https://www.reddit.com/r/Lawyertalk/comments/1r4mk7m/have_any_inhouse_counsel_found_practical_and/))
  - "Harvey and Legora are not for us either (they are expensive and only for law firms)" (a family office) ([r/legaltech](https://www.reddit.com/r/legaltech/comments/1wodjf7/legal_ai_for_a_family_office/))
- **Trigger events:** GC hire or promotion (LinkedIn); legal-ops job post; contract-lifecycle-management RFP; a company AI policy announcement.
- **Watering holes:** ACC (Association of Corporate Counsel) chapters; CLOC (legal ops); r/legaltech; LinkedIn.
- **Budget behaviour:** a department budget, but IT and InfoSec gate it. "Deploys in your own Azure/AWS tenant" shortens security review (*hypothesis to test*).
- **Objections and counters:** "We already have Copilot." → Contract-playbook workspaces plus an audit trail inside their own tenant. If Copilot already satisfies them, walk away.
- **Disqualify if:** a CLM with AI already deployed (Ironclad, etc.); no IT willingness to host in their tenant.
- **How to find email + phone:** `treg.companies.search` (US, 500–4,999 employees, non-legal industries) → `treg.people.search` (titles "General Counsel", "Head of Legal", "Legal Operations") → `treg.people.email.find` + verify → `treg.people.phone.find` (live-line check). A found phone number is never proof it is the person's.

## S5 · Template-driven transactional small firms (estate planning, real estate, business formation), 1–10 lawyers

- **Who:** owner-attorney.
- **US count:** **no clean count.** IBISWorld's estate-lawyers page returned no figure. This is a subset of the 37,233 (5–19 employees) plus 120,321 (<5 employees) CBP establishments.
- **Pain (their words):**
  - "On September 21, 2026, LexisNexis pushed out a mandatory new version of the product. From that day on, I could no longer trust what it produced." (solo estate planner, CA) ([Trustpilot](https://www.trustpilot.com/reviews/6ad29bc6386e1c5b08576382))
  - "We've used wealthcounsel for a long time… feel it's costly for what we're getting. My partner is also retiring and I don't need two licenses but that is the minimum required." ([r/Lawyertalk](https://www.reddit.com/r/Lawyertalk/comments/1ojkay0/estate_planning_software/))
  - "a 'vault' like Harvey but for a handful of users and maybe not as pricey" (small transactional firm) ([r/legaltech](https://www.reddit.com/r/legaltech/comments/1u1ata2/are_there_legal_ai_platforms_for_smaller/))
- **Trigger events:** a drafting-software renewal (WealthCounsel, Lexis templates); partner retirement; a vendor forcing a template update.
- **Watering holes:** r/EstatePlanning (practitioner threads), r/LawFirm; ACTEC, NAELA, WealthCounsel community (*member counts not checked*); state bar real-property and probate sections.
- **Budget behaviour:** already pays for drafting software with license minimums. Values *control of their own templates*.
- **Objections and counters:** "AI can't draft trusts safely." → We don't draft from the model's memory. It fills **their own** vetted templates and flags gaps.
- **Disqualify if:** happy with WealthCounsel or similar and not drafting outside it.
- **How to find email + phone:** `treg.google.serp.maps` ("estate planning attorney" + city) → domain → `treg.people.email.find` + verify. State bar certified-specialist lists (e.g. Florida and Texas board certification in wills, trusts and estates) via `treg.web.extract`.

## S6 · Privacy-first solo litigators and tech-curious solos

- **Who:** a solo who has already tried ChatGPT/Claude, is now limited by confidentiality, and is pricing hardware.
- **US count:** **120,321** CBP establishments with <5 employees (NAICS 541110, 2022). This is an upper bound: it includes small 2–3-lawyer offices and excludes nonemployer solos.
- **Pain (their words):**
  - "Our ethics rules and client confidentiality mean I absolutely cannot upload any sensitive data… The problem is, I am completely tech-challenged." ([r/Lawyertalk](https://www.reddit.com/r/Lawyertalk/comments/1uj3wfk/any_lawyers_here_using_local_ai_need_advice/))
  - "Right now I am using a pro Claude subscription but am quite limited by not being able to upload confidential documents" ([r/Lawyertalk](https://www.reddit.com/r/Lawyertalk/comments/1vyspbn/self_hosted_or_enterprise_ai/))
  - "I'm still hoping to find an LLM that offers Claude Enterprise-level security but that is designed and priced for smaller professional practices." ([r/Lawyertalk](https://www.reddit.com/r/Lawyertalk/comments/1romcn5/sole_practitioner_best_ai/o9fdw1q/))
  - "considering signing up for CoCounsel on a one-year contract… nearly a $400 per month commitment" (solo employment lawyer) ([r/LawFirm](https://www.reddit.com/r/LawFirm/comments/1nkcmis/thomson_reuters_cocounsel/))
- **Trigger events:** posts asking about self-hosting; a new firm opening (bar admission plus new LLC); a CoCounsel or Lexis renewal.
- **Watering holes:** r/Lawyertalk, r/LawFirm, r/LocalLLM; state bar solo and small-firm sections; Lawyerist community.
- **Budget behaviour:** very price-sensitive. Comparison points are a $20–$200/mo Claude plan and DIY hardware. Survey data says solos are *least* worried about privacy (24%), so this segment is **narrower than the raw count**.
- **Objections and counters:** "I can build it myself for $50/mo with AnythingLLM." → True; let them. Target the "tech-challenged" ones.
- **Disqualify if:** they enjoy tinkering (they will DIY), or are under $150k revenue (*assumption*).
- **How to find email + phone:** state bar directories (many list email and phone for each member), `treg.google.serp.maps`, then email verify. Volume is high, so test cost per lead first.

## S7 · Immigration law firms (low priority; evidence thin)

- **US count:** AILA reports **16,000+ attorney members** ([AILA 2025 media kit](https://aila.org/aila-files/88EFEDD8-8119-469B-B2B6-105835F39793/2025-AILA-Media-Kit_final.pdf)). That counts members, not firms.
- **Pain (their words):** "my firm uses ImmPro, which is what we have been using for 25 years… looking for a more integrated software program that doesn't keep giving user errors… and that can integrate with Clio" ([r/LawFirm](https://www.reddit.com/r/LawFirm/comments/1pw8r7c/immigration_software/)). This is about **forms software**, not AI. **No Spanish-language evidence was found.**
- **Trigger, watering holes, budget:** AILA chapters and conference; Docketwise and LawLogix user bases; forms-software renewal.
- **Disqualify if:** looking for forms automation (not our product).
- **How to find:** the AILA public "Search for a Lawyer" directory, then email find + verify.

## S8 · Legal aid and nonprofits (low priority; small count, low budget)

- **US count:** about **129–131 LSC grantees** (LSC 2023 "By the Numbers": 131 grantees, 909 offices) ([LSC 2023 By the Numbers PDF](https://www.lsmo.org/sites/lsmo.org/files/LSC%202023%20By%20The%20Numbers.pdf)), plus non-LSC legal nonprofits (not counted).
- **Pain (their words):** "Westlaw and Lexis seem way beyond reach for our newly established non-profit… Feeling overwhelmed with the lack of options." ([r/Lawyertalk](https://www.reddit.com/r/Lawyertalk/comments/1llrrea/nonprofit_and_legal_aid_folks_what_do_you_use_for/)) This is a research-cost pain, which we explicitly don't solve.
- **Budget:** grant-funded, so a long cycle. Possible fit later via the On-Prem tier funded by a technology grant (LSC TIG; *not verified for 2026*).
- **How to find:** LSC grantee list (lsc.gov) via `treg.web.extract` → executive director → email find + verify.

## Dropped (tested against the evidence, nothing supports them)

| Idea from the brief | Count | Why dropped |
|---|---|---|
| Court reporting / legal support businesses | 3,181 (CBP 2022, NAICS 561492) | 0 complaint snippets. Not searched deeply. No buyer evidence |
| Title / settlement offices | 9,762 (CBP 2022, NAICS 541191) | No evidence |
| Criminal defense / public defenders | n/a | The one PD thread has CoCounsel unused, and PDs buy through government procurement ([r/publicdefenders](https://www.reddit.com/r/publicdefenders/comments/1uobijw/what_are_you_using_westlaw_cocounsel_for/)) |
| Family law | IBISWorld 56,771 businesses ([IBISWorld](https://www.ibisworld.com/united-states/number-of-businesses/family-law-divorce-lawyers/4814/)) | Complaints are about *clients* using ChatGPT, not about firm tools |
| Spanish-language immigration | n/a | No evidence found; untested |
| IP/patent, employment | n/a | 1 patent thread (paralegals "mostly not affected by AI") and 1 employment solo (in S6). Too thin |

## Priority order and why

1. **S1 Mid-size firms (11–50 lawyers), 8,312.** They have the highest privacy concern (56% in the ABA survey), are priced out by seat minimums (30–40 seats), and buy by committee with pilots. The flat $999 price is 3–10× below the legal incumbents at 15 users. One deal is worth roughly 2 Small deals.
2. **S2 Doc-heavy small litigation (2–10 lawyers), 37,233.** They have concrete, monetisable workloads (medical records, depositions) and the clearest existence proof that the model sells (the on-prem provider PI quote). Owners decide quickly.
3. **S3 Insurance defense.** Carriers are forcing AI and flat fees, so the trigger is strong. Size is unknown, so test it as a sub-campaign of S1/S2.
4. **S4 In-house teams, about 21,041 (unverified).** Large count and a real data-residency pain, but long InfoSec cycles. Run it in parallel at low volume.
5. **S5 Transactional/estate small firms.** Template control matters to them, but the evidence is thinner.
6. **S6 Solos, ≤120,321.** Large but price-sensitive, DIY-prone and less privacy-anxious. Self-serve Small tier only, with no outbound spend until S1/S2 pass.
7. **S7 Immigration** and **S8 Legal aid.** Watch-list only.
