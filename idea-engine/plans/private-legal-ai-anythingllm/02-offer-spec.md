# 02 · Offer spec: private AI for small and mid-size law firms

**Working name:** *Firm Vault* (placeholder; check trademarks before use).
**One line:** your firm's own private AI, running in your cloud tenant or on a box in your office. It is loaded with your templates, precedents and matter files. You pay one flat price per firm, with no seat minimums and no annual lock-in.
**Built on:** Mintplex-Labs/anything-llm. It is MIT-licensed (confirmed in the repo footer, `data/pages/gh_anythingllm.md`) and has 68.2k GitHub stars as of fetch on 2026-11-11. It supports document chat with RAG, agents and no-code agent flows, multi-user permissions (Docker build), any LLM including local ones (Ollama, a built-in engine), and a developer API.

## What changed from the draft, and why

| Draft | Rebuilt | Evidence (01) |
|---|---|---|
| "AI assistant for law firms on your documents" | Lead with **privacy + flat price + done-for-you**. "Knows your documents" becomes the payoff line, not the headline. | Price 57 snippets, confidentiality 40, value gap 43. "Doesn't know our documents" had 1 snippet. |
| $999/mo per firm, one tier | **3 tiers** (Small $499, Firm $999, On-Prem $1,490) and a paid 30-day pilot | Solos are least concerned about privacy (24% in the ABA TechReport) and very price-sensitive. 10–49-attorney firms are the most concerned (56%). |
| Implied "better legal AI" | **Bring-your-own model**: frontier through a zero-retention endpoint in the firm's tenant, or local. No "hallucination-free" claim. | Value gap: "nowhere near as capable as directly accessing ChatGPT", "the model it calls on is watered down". |
| Contract terms unspecified | **Month-to-month after the pilot, plus a full export guarantee** | Lock-in: 18 snippets, 13 tight, including Lexis 4-year terms and Westlaw auto-renewals. |
| Mintplex's own hosted AnythingLLM costs $50/$99/mo | We are **not** selling software hosting. We sell legal setup, connectors, an ethics pack and support. | `data/pages/price_anythingllm.md`: Basic $50/mo, Pro $99/mo, "Just bring an LLM API Key". |

## Pain → feature, guarantee or price element

| Pain (count from 01) | What answers it | Proof we can show in a demo |
|---|---|---|
| **1. Price, per-seat cost, seat minimums** (57; 30 tight) | Flat **per-firm** price, published on the site. No seat minimum. A 5-lawyer firm and a 20-lawyer firm both pay $999. A paid 30-day pilot ($750, credited to setup) instead of "no demos for small firms". | Price table on the landing page. Side-by-side cost calculator (see the arithmetic below). |
| **2. Value gap / wrapper scepticism** (43; 25 tight) | **Bring your own model.** Claude or GPT through the firm's own Azure OpenAI / AWS Bedrock deployment with zero data retention, or a local open-weights model on the appliance. Switch models any time. No proprietary "watered-down" model. The value we add is the private setup, the firm's knowledge base, matter permissions, workflows and support, not a secret model. | Run the same prompt on the same file in the firm's ChatGPT/Claude and in Firm Vault. Show that Firm Vault answers from the firm's own precedent with a pinned source. |
| **3. Confidentiality / training / can't upload** (40; 20 tight) | (a) A **single-tenant** instance in the firm's own cloud subscription, or **on-prem**. Data never sits in a shared multi-tenant SaaS. (b) Model endpoints configured for no training and zero retention where the provider offers it. (c) **Matter-level workspaces with per-user access**, so documents from client A cannot be retrieved in client B's matter. This addresses ABA Op. 512's cross-client concern and the Copilot "SharePoint inheritance… Rule 1.6 nightmare" quote. (d) A per-matter **audit log** export, which answers the "ethics audit trail" demand quote. (e) An **ethics due-diligence pack**: architecture diagram, data-flow statement, vendor questionnaire answers, a template client-disclosure paragraph, and links to ABA 512 and the firm's state opinion. This is information, not legal advice. | Live: create two matters, show user A cannot query matter B, and export the audit log. |
| **4. Hallucinations** (35; 14 tight) | Answers are **pinned to source passages** in the firm's documents, with click-through. Every answer drawn from firm documents shows its sources, and an answer with no source is labelled "general model knowledge — verify". We never claim to be hallucination-free. | Show a source-pinned answer, then show the "no source found" behaviour. |
| **5. Contract lock-in** (18; 13 tight) | **Month-to-month after the 30-day pilot.** 30-day cancellation. The **export guarantee** covers documents, vector index, prompts, agent flows and the configuration. Because the core software is MIT, the firm can keep running it without us. | Contract is 2 pages and the export runbook is published. |
| **6. DMS / practice-management integration** (18; 9 tight) | v1 connectors: **watch-folder** (network drive or OneDrive/SharePoint folder sync) and the **Clio Manage API** for read-only matter documents (Clio publishes an API; one r/clio firm built an MCP server on it). v2, on demand, scoped and quoted separately: NetDocuments, iManage, Filevine. *Unverified: API access terms for iManage and NetDocuments partners.* | Demo: drop a file into the matter folder and it is searchable in about a minute. |
| **7. Citation accuracy** (16; 5 tight) | A **citation-existence check**. Each case citation in a draft is looked up against a public case-law index (CourtListener's free API, to be validated in the build). Not-found cites are flagged in red. This checks *existence*, not *good law*. The firm keeps Westlaw, Lexis or its bar's free Fastcase/vLex for Shepardizing or KeyCiting. | Paste the real fabricated "Shupe v. Nelson" cite from 01 and watch it get flagged. |
| **8. Self-hosting is too hard** (12; 5 tight) | **Done-for-you.** We size the hardware or cloud, install, update, monitor and back up. Monthly model and version updates are included. | Named engineer and a response SLA. |
| Wish: "a vault like Harvey but for a handful of users" (demand signal) | A **template and precedent workspace** with a "draft in our house style" agent and a "fill this template from the intake notes" agent. | Draft an engagement letter from the firm's own form. |

## Must-have parity features (or we lose on the demo)

| Feature | Status with AnythingLLM | Note |
|---|---|---|
| Chat with documents, with cited sources | Built in | RAG with source citations |
| Multi-user, roles, per-workspace permissions | Built in (Docker build) | Map one workspace per matter or practice group |
| Any LLM, cloud or local | Built in | Ollama, built-in local engine, Azure OpenAI, Bedrock and others |
| Agents and scheduled tasks | Built in | No-code agent flows, cron tasks |
| Long-document summaries (depositions, medical records) with **page** cites | Needs work: chunk metadata must carry PDF page and transcript page | The page-number complaint in 01 is specific; test against real transcripts before selling |
| Table extraction across many documents (dates, parties, clauses) | Needs an agent flow | Harvey's "table tool" is cited as a reason firms chose Harvey |
| Word add-in | **Not in v1** | A gap compared with Harvey and Spellbook. Mitigate with copy/paste and .docx output. Revisit if the pilots ask for it |
| SSO | Listed under Mintplex **Enterprise** ("SSO, RBAC") | *Unverified whether OSS supports SAML/OIDC.* Use a reverse-proxy SSO (e.g. an OIDC proxy) if not |
| Backups, uptime monitoring, updates | Our service layer | Part of the monthly fee |

## What we will deliberately NOT do

- **No case-law research database.** We do not compete with Westlaw, Lexis, vLex or Fastcase on primary law. Firms keep those; many state bars give Fastcase/vLex free. 01 shows firms will not drop Westlaw ("We can't replace Westlaw research").
- **No per-seat pricing, no seat minimums, no annual or multi-year contracts.**
- **No "hallucination-free" or "ethics-compliant" claims.** We supply evidence and controls. The lawyer remains responsible (ABA 512, Florida 24-1, Texas 705).
- **No proprietary legal model and no "AI lawyer" for consumers or pro se litigants.**
- **No practice management or billing.** We integrate with Clio and others; we do not replace them.
- **No Spanish-language or immigration-specific product in v1.** There was no evidence in the mining; test it only if pilots ask.
- **No custom DMS integration before a paying firm needs it.**

## Pricing tiers

| Tier | Who | Monthly | Setup (one-time) | Includes |
|---|---|---|---|---|
| **Small** | 1–5 users | **$499** | $1,500 | Single-tenant cloud instance, BYO model or included model usage up to $75/mo at cost, 5 matter workspaces + 1 template library, watch-folder connector, email support (2 business days) |
| **Firm** (core) | up to 20 users | **$999** | $3,500 | Everything in Small, plus unlimited matter workspaces, Clio connector, 2 custom agent flows (e.g. medical chronology, discovery-response drafter), per-matter audit export, ethics pack, included model usage up to $150/mo at cost, 1-business-day SLA, quarterly review |
| **On-Prem** | up to 50 users, "no cloud ever" | **$1,490** | $7,500 + hardware at cost (*hardware price unverified; size per firm*) | Appliance in the firm's office running local models only, plus remote management, updates and monitoring. Optional ZDR frontier fallback is off by default |
| **Pilot** | any | $750 for 30 days | credited to setup | 1 practice group, 1 workflow, success criteria agreed in writing |

**Model usage** above the included amount is billed at provider cost plus 10%, shown monthly. Firms do worry about token cost: "We're currently spending over €600 a month on LLM APIs" ([r/LocalLLM](https://www.reddit.com/r/LocalLLM/comments/1x39les/hardware_choice_for_my_lawfirm_local_llm_setup/)) and "Legal AI has a growing token price problem?" ([r/legaltech](https://www.reddit.com/r/legaltech/comments/1twz4k7/legal_ai_has_a_growing_token_price_problem/)).

### Gross margin (planning estimate)

| Tier | Price | Infra | Included model | Support labour | COGS | GM |
|---|---|---|---|---|---|---|
| Small | $499 | ~$40 (small VM + storage) | ≤$75 | ~1.5 h × $60 = $90 | ~$205 | ~59% |
| Firm | $999 | ~$100 | ≤$150 | ~3 h × $60 = $180 | ~$430 | ~57% (higher when the firm brings its own model) |
| On-Prem | $1,490 | ~$30 monitoring | $0 | ~4 h × $60 = $240 | ~$270 | ~82% |

The infra and labour figures are my assumptions, not quotes. Validate them during the pilots. The blended planning range is **55–70%**.

## Arithmetic against incumbents (monthly, list or reported prices)

| Product | Price basis | Source / status | 5 users | 15 users |
|---|---|---|---|---|
| **Firm Vault Firm** | $999 flat (≤20 users) | this spec | **$999** | **$999** |
| Firm Vault Small | $499 flat (≤5 users) | this spec | $499 | n/a |
| Harvey | $1,200/seat quoted; ~$399/seat lower tier; 30–40 seat minimum | Reddit, buyer-reported ([pricing thread](https://www.reddit.com/r/legaltech/comments/1qvwswa/pricing_harvey_v_claude_v_legora_v_cocounsel_from/), [minimums](https://www.reddit.com/r/legaltech/comments/1riw06u/harvey_legora_user_minimums/o8jvnff/)) | **not sold** (minimum 30–40 seats). At the 30-seat minimum: $11,970–$36,000 | not sold under the minimum |
| Legora | ~$400/seat | Reddit, buyer-reported ([thread](https://www.reddit.com/r/legaltech/comments/1u6tb6i/whats_your_pricing_on_harvey_or_legora/)) | $2,000 | $6,000 |
| CoCounsel Legal | $784/user monthly billing; $686 2-yr; $637 3-yr | Aggregator ([CostBench](https://costbench.com/software/ai-legal-tools/cocounsel/)), **unverified** | $3,185–$3,920 | $9,555–$11,760 |
| Westlaw Precision + CoCounsel | ~$2,000/mo for a 4-lawyer firm | Reddit ([thread](https://www.reddit.com/r/legaltech/comments/1pdtkme/im_about_to_tell_westlaw_to_shove_it/)) | ~$2,500 (scaled) | — |
| Lexis+ with Protégé | ~$250–$525/seat all-in | Aggregators ([vaquill](https://www.vaquill.ai/blog/lexis-plus-ai-pricing)), **unverified** | $1,250–$2,625 | $3,750–$7,875 |
| Clio Work | ~$199–$200+/user (plus Clio Manage from $49/user) | r/clio user ("$200+ per user price tag") and an aggregator; Clio publishes no list price | ~$995 + Manage | ~$2,985 + Manage |
| Paxton | $499/user monthly, or $2,999/user/yr | Paxton pricing page (`data/pages/price_paxton.md`) | $2,495 (or $1,250 on annual) | $7,485 (or $3,750) |
| Spellbook | ~$89–$350/user | Aggregators, **unverified** | $445–$1,750 | $1,335–$5,250 |
| Microsoft 365 Copilot | $30/user/mo (enterprise add-on); Copilot Business $21 ($18 promo) | Microsoft page (`data/pages/price_m365copilot.md`) and resellers | $105–$150 | $315–$450 |
| AnythingLLM hosted (DIY) | $50 / $99 per instance + your API key | Mintplex pricing page | $50–$99 + tokens | $99 + tokens |

**Reading the table honestly:**
- Against the legal-specific incumbents (CoCounsel, Lexis, Legora, Paxton), Firm Vault Firm is 2–10× cheaper at 5–15 users. At 15 users it is cheaper than every legal incumbent listed, including Clio Work.
- Against **Copilot and ChatGPT/Claude Team**, we are **more expensive**. We have to win on: (1) matter-level walls and an audit trail, which Copilot's SharePoint-inheritance problem lacks; (2) single-tenant or on-prem hosting; (3) done-for-you knowledge base and workflows. If a firm is happy with ChatGPT Enterprise, it is **not** our buyer.
- Against **DIY AnythingLLM at $50–$99**, the premium (~$900/mo) buys setup, connectors, the ethics pack, updates and a named engineer. The pilot must prove the firm would not do this itself. 01 has a 30-attorney firm with an in-house engineer that built its own tool; such firms are a disqualifier.

## Risks to the offer

1. **Commoditisation:** Microsoft (Copilot + Claude), Anthropic ("Claude for Legal") and OpenAI (r/LawCanada mentions an OpenAI legal product, *unverified*) are moving down-market fast.
2. **Search demand is tiny** ("cocounsel pricing" 140/mo, per the brief), so acquisition must be outbound and community-led, not SEO.
3. **Local-model quality:** firms that go fully on-prem get weaker models. This is stated in 01 ("it still probably won't be as good"). Set expectations in writing.
4. **Mintplex hosting at $50/mo** anchors the price low for technical buyers.
