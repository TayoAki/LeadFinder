# PRD: Briefcase, private AI for law firms

**Version 1.0 · 11 Nov 2026.** Status: draft for build.

**Inputs:**
- `../private-legal-ai-anythingllm/01-pain-points.md`: 200 labelled complaints, 98 from buyers.
- `02-offer-spec.md`, `03-icp-canvas.md`, `../channels/CHANNELS.md`.
- The UI mockup and its 19 personas in `ui/`.
- `00-repo-assessment.md`.

## 1. Problem

Small and mid-size firms (2–50 lawyers) want AI on their own files but are shut out of the tools built for it:
- **Price:** Harvey quotes about 1,200 USD per seat with 30–40-seat minimums and "not scheduling demos for small firms".
- **Quality:** they don't trust the legal wrappers ("All legal wrappers are garbage imo").
- **Confidentiality:** they can't put client files into ChatGPT or Claude.

Search demand for the category is growing fast: "harvey ai" 40,500/mo, +95%; "ai for law firms" +129%.

## 2. Design principle: every P0 feature answers a counted pain

| Rank | Pain (buyer complaints) | In their words | P0 feature |
|---|---|---|---|
| 1 | **Per-seat price and seat minimums** (30) | "Harvey told us 40 minimum, Legora told us 30" | L1 Flat per-firm pricing, no minimums |
| 2 | **Legal tools no better than ChatGPT / Claude** (25) | "nowhere near as capable as directly accessing ChatGPT" | L2 Frontier models, firm's choice |
| 3 | **Confidentiality: can't upload client files** (20) | "I absolutely cannot upload any sensitive data to cloud tools like ChatGPT" | L3 Private-by-architecture instance |
| 4 | **Hallucinations / wrong citations** (14 + 5; 47 snippets in all) | CoCounsel depo summary: "all the page numbers were wrong" | L4 Verified, page-level citations |
| 5 | **Contract lock-in** (13) | "locked in a 4-year contract with Lexis Nexis… about to quadruple" | L5 Month-to-month and export guarantee |
| 6 | **No DMS integration, broken permissions** (9) | "download > upload into tool > do work > download work > upload" · "a Rule 1.6 nightmare" | L6 DMS connectors that mirror permissions |
| 8 | **Self-hosting too hard** (5) | "Setting it up will be a big learning curve for me" | L7 Done-for-you setup and operation |
| — | Ethics duties (ABA Op. 512: competence, confidentiality, communication, fees, supervision) | "asking vendors for a full ethics audit trail… a log of every AI action per matter" | L8 Human review, audit and ethics pack |

**Explicit non-claim.** "Doesn't know our documents" drew 1 complaint, so it's a payoff line, not the headline. We never claim to be smarter than ChatGPT or Claude. We claim to be **the same models, safe for client files, cited to the page**.

## 3. Goals and non-goals

**Goals (first 6 months)**
1. A 10-lawyer firm is live in **5 business days**, with its matters indexed and permissions mirrored.
2. **Zero cross-matter leakage** in automated tests and in every pilot.
3. **≥ 98% of citations are correct to the page** (manual audit), and no answer ships without a source.
4. Clear ROI for the firm: hours saved × blended rate is at least 4× the subscription.

**Non-goals for v1:**
- Case-law research (Westlaw/Lexis territory).
- E-discovery processing at TB scale.
- Court e-filing.
- Billing system replacement (we send time to Clio, we don't replace it).
- Consumer or pro se users.

## 4. Users

There are 19 personas in `../private-legal-ai-anythingllm/ui/personas.json`.
- **Decision makers:** managing partner and firm administrator, the actual buyers at small firms; the ethics/risk partner holds a veto.
- **Daily users:** associates, paralegals, legal secretaries, intake, docketing, KM.
- **Admins:** IT / legal ops, records and information governance.

## 5. Requirements

### L1 Flat per-firm pricing (pain 1) · P0

| Plan | Users | Price/mo | Notes |
|---|---|---|---|
| Small firm | up to 5 | 499 USD | No seat minimum |
| Firm | up to 20 | 999 USD | Most mid-size firms |
| On-prem | up to 20 | 1,490 USD + hardware | Nothing leaves the building |
| Pilot | — | 750 USD, 30 days | Credited to setup |

- Light users (view or approve only) are free.
- Model usage is included at fair use. If the firm brings its own model account (L2), usage is billed to them at cost.
- **Acceptance:** the price page and in-app plan page match, and the bill never has per-question charges.

### L2 Frontier models, the firm's choice (pain 2) · P0

- **Models:** Claude, GPT or Gemini through the **firm's own cloud account** (AWS Bedrock, Azure OpenAI, Google Vertex) under zero data retention, or our account under the same terms. An **open-weight model inside the instance** is an option for On-prem.
- **Model card in Admin:** vendor, model, region and retention terms. The model is switchable without re-indexing.
- **Positioning in product copy:** "the same model you'd use in ChatGPT, safe for client files". No "legal-grade AI" claims.

### L3 Private by architecture (pain 3) · P0

- **One instance per firm.** Dedicated database, vector index and storage, in the firm's chosen region or on-prem.
- **Data flow statement, shown identically everywhere:** "Documents stay in your firm's instance. Only your question and the relevant excerpts are sent to [model] under zero data retention, never used for training."
- **No third-party brokers by default:**
  - no web search;
  - no Composio;
  - no CopilotKit Intelligence or Copilot Cloud (see `00-repo-assessment.md`);
  - telemetry off.
- **Ethical walls.** Matter-level access mirrors the DMS and practice-management permissions (L6). Privileged folders are excluded from Ask by default. Matters where the client has refused AI are not indexed, and pending-consent matters can't use AI.
- **Acceptance:** a red-team test suite (prompt injection, cross-matter retrieval, permission changes) must pass before each release with **0 leaks**.

### L4 Verified, page-level citations (pains 4 and 7) · P0

- **Ingestion:** OCR plus layout parsing. Each chunk stores document ID, page, line or paragraph range, Bates number, and transcript page:line for depositions.
- **Answer pipeline:** retrieve, then generate with citation IDs, then **verify** every quoted span and every claim-to-source link. Verification is an exact or near-exact match of the quote against the cited chunk, plus an entailment check for the claim.
- **Failure handling:** a failed check removes the sentence or marks it "no source found". **An answer with no verified source is blocked.**
- **Citation display:** numbered 1, 2, 3 in order of first use. Clicking opens the document at the exact page with the passage highlighted.
- **Answer footer:** "Answered from N documents in this matter" reflects the documents actually cited.
- **Long-document flows:** medical-record chronologies and deposition summaries keep page:line citations for every entry.
- **Draft flows:** the agent proposes an outline, the attorney approves it, then sections are drafted. Uses the interrupt-to-approve pattern from the CopilotKit monorepo's research-canvas showcase (MIT), not ANA's web-footnote citations.
- **Acceptance:** on a 500-question gold set across 10 real-style matters, ≥ 98% of citations point to the correct page and 0 fabricated quotes.

### L5 No lock-in (pain 5) · P0

- Month-to-month after the pilot. Annual is optional and never auto-renews into a multi-year term.
- **Export guarantee:** full export of chats, drafts, the audit log and index metadata at any time, in open formats.
- The software is open source (AnythingLLM, MIT), so the firm can keep running its instance without us.

### L6 DMS and practice-management connectors that mirror permissions (pain 6) · P0 for Clio and SharePoint, P1 for others

- **Connectors:** Clio (matters, contacts, documents, time entries), SharePoint/OneDrive, NetDocuments, iManage.
- **How they're built:** MCP tools on a **server-side allowlist** (OpenDots `connection-tools.ts` pattern). Writes need approval. Tokens are encrypted with AES-256-GCM (openmuse `vault.ts`).
- **Permission mirroring:** a user only retrieves what the DMS lets them open. Permission changes propagate within 15 minutes. SharePoint inheritance is respected, which answers the Copilot "Rule 1.6 nightmare".
- **Write-back:** approved drafts and time entries save back into the matter in the DMS, ending download, upload, download, upload.

### L7 Done-for-you setup and operation (pain 8) · P0

- **We deploy and run the instance:** a cloud tenant, or an on-prem box shipped pre-configured.
- **Deployment template:** hardened compose (OpenDots `compose.yml` pattern), backups, upgrades with rollback, uptime monitoring.
- **Onboarding in 5 business days:** connect the DMS, index matters, set ethical walls, train staff (1 hour), issue the ethics pack.

### L8 Human review, audit and ethics pack (ABA Op. 512) · P0

- **Every AI output needs human review before it leaves the firm:** drafts, translations, extracted deadlines, conflict results, time entries.
- **How review works:**
  - Approval cards follow OpenBot's approval model.
  - **Hash-bound receipts** (openmuse `actions.ts`) tie the approver to the exact text.
  - Approval history is visible per document.
- **Per-matter audit log, written before acting:** who asked what, which sources were used, what was approved and exported. Rule-named refusals and secret redaction follow OpenBot's `audit.ts` pattern.
  - The log is exportable for clients, malpractice carriers and bar inquiries.
- **Time capture is honest:**
  - Suggested entries come only from the lawyer's own measured time, with timekeeper, UTBMS code, rate and amount.
  - The attorney approves.
  - We never bill AI work as lawyer time. Contingency matters carry no dollar amounts.
- **Ethics pack:**
  - An ABA 512 checklist.
  - Engagement-letter AI disclosure language.
  - A client-consent register per matter.
  - Links to state guidance (Florida 24-1, Texas 705, California COPRAC, plus the firm's state; exact citations to be confirmed per state before launch).
- **SSO and SCIM** (OpenBot Better Auth + SCIM pattern): Microsoft Entra / Google, MFA required, deprovisioning when a lawyer leaves.

### P1 (after launch)

- Contract review against a firm or in-house playbook: per-clause risk, suggested language, accept/reject, redline to Word.
- Intake summaries and conflict checks:
  - near-match conflicts are sent to the conflicts analyst;
  - consults can't be booked until the conflict is cleared (Model Rule 1.18).
- Docketing: deadlines extracted with the rule cited and a "verified by" status before they reach the calendar.
- Firm insights: hours saved × blended rate, usage by lawyer, realization.
- Records governance: retention, legal holds, deletion of AI indexes and chat history per matter.
- Bilingual client letters (Spanish first), always attorney-reviewed.

## 6. Architecture

```
Firm users ─ web / desktop (SSO) ─▶ Briefcase app (per-firm instance: cloud tenant or on-prem box)
                                     ├─ AnythingLLM (MIT): workspaces = matters, ingestion, vector index
                                     ├─ Citation verifier (ours): chunk anchors (page/line/Bates), quote match, entailment check
                                     ├─ Agent layer: AG-UI agents on the self-hosted CopilotKit runtime (MIT); threads in our Postgres
                                     ├─ Policy + approvals + receipts  ← OpenBot / openmuse patterns
                                     ├─ Audit log (per matter, write-before-act)  ← OpenBot pattern
                                     ├─ Connectors via MCP (server-side allowlist): Clio, SharePoint, NetDocuments, iManage
                                     └─ Model gateway: firm's Bedrock / Azure / Vertex account (zero retention) or in-instance open-weight model
No outbound calls except the chosen model endpoint and the firm's DMS. Telemetry off.
```

## 7. Success metrics

| Pain | Metric | Target |
|---|---|---|
| 1 Price | Firms under 20 lawyers among paying customers | ≥ 70% |
| 2 Quality | Weekly active lawyers / licensed users at day 60 | ≥ 60% |
| 3 Confidentiality | Cross-matter leaks in red-team suite and in production | 0 |
| 4 Citations | Correct-to-page citations (monthly manual audit of 200 answers) | ≥ 98%; fabricated quotes 0 |
| 5 Lock-in | Customers on month-to-month | majority; churn ≤ 2%/mo |
| 6 DMS | Drafts saved back to the DMS without manual upload | ≥ 80% |
| 8 Setup | Business days from signature to live | ≤ 5 |
| ROI | Hours saved × blended rate ÷ subscription | ≥ 4× |

## 8. Release plan

| Phase | Weeks | Scope |
|---|---|---|
| Alpha (3 pilot firms, PI / insurance defense / estate) | 0–8 | L1, L2, L3, L4 (Ask + chronology + depo summary), L5, L6 Clio + SharePoint, L7 cloud tenant, L8 approvals + audit + ethics pack |
| Beta (15 firms) | 9–16 | Drafting from firm templates with outline approval; NetDocuments; SSO/SCIM; time capture to Clio; on-prem box |
| GA | 17–24 | iManage; contract review playbooks; intake and conflicts; docketing; firm insights; records governance |

## 9. Risks and open questions

| Risk | Mitigation |
|---|---|
| Lawyers say plain ChatGPT/Claude is as good as legal tools | Use those exact models; win on confidentiality, citations to the page, DMS integration and flat price |
| Mintplex hosts AnythingLLM itself for 50–99 USD/mo | Sell setup, connectors, the citation verifier, the ethics pack and operation, not hosting |
| Citation verification misses subtle misstatements | Entailment check + "no source" blocking + monthly human audit; show confidence, never hide uncertainty |
| A CopilotKit Intelligence or Copilot Cloud dependency slips in through copied code | Dependency allowlist and a CI check for `CPK_INTELLIGENCE_*` / Copilot Cloud keys; self-hosted runtime only |
| ANA and canvas frontends have no licence | Copy patterns only from the MIT CopilotKit monorepo copies |
| Bar guidance differs by state and changes | Ethics pack per state, reviewed by a licensed attorney before launch and quarterly |

**Open questions:**
1. Ship On-prem at Beta or GA? It depends on pilot demand (the simulated panel split between cloud-account and zero-cloud).
2. Is the first practice-area template personal injury (Eve Legal is buying that audience) or insurance defense?
3. Do we need a SOC 2 Type I before Beta for mid-size firms' procurement?
