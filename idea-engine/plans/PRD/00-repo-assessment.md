# CopilotKit repos: what we take, what we avoid

Reviewed 11 Nov 2026 from shallow clones, read-only (nothing was executed). Teardowns were done per repo; the file paths below are in each repo.

## Summary

| Repo | Licence | What it is | Maturity | Verdict |
|---|---|---|---|---|
| [CopilotKit/OpenBot](https://github.com/CopilotKit/OpenBot) | MIT (whole repo) | Self-hostable "AI coworker" workspace: Bun/Hono server + Postgres, React web, Tauri desktop, Expo mobile, per-person browser/shell containers, policy gateway, approvals, audit, SSO/SCIM, AG-UI agents, MCP tools | v1.0.1, 27 changelog entries in ~2 weeks, ~1,400 test files, good docs; upgrades can't roll back | **Parts bin, not platform.** Server refuses to start without CopilotKit Intelligence (paid, hosted, separately licensed); Helm chart says "OPENBOT DOES NOT RUN WITHOUT IT" |
| [CopilotKit/openmuse](https://github.com/CopilotKit/openmuse) | MIT | Single-owner personal agent: Gmail/Calendar, PDFs, browser, durable background tasks, mobile app | Alpha, ~475 tests, CI; Gmail never tested live | Take patterns: hash-bound approval reviews with receipts, durable tasks with leases, AES-GCM credential vault |
| [CopilotKit/OpenDots](https://github.com/CopilotKit/OpenDots) | MIT | Single-owner "Dots" specialist agents in Spaces with pages, MCP per agent, approve-and-run, page-review card | Alpha 0.1.0, ~311 tests; now a "skin" inside OpenBot, repo community-maintained | Take patterns: approve-on-write MCP gating, page-review card, hardened compose |
| [CopilotKit/open-research-ANA](https://github.com/CopilotKit/open-research-ANA) | **agent/: MIT (Tavily AI); frontend/ and root: no licence** | Research canvas: LangGraph agent searches the web, user approves an outline, agent writes a cited report | Demo quality, old pinned versions, no tests | Take the interrupt-to-approve pattern and UI state streaming **from the MIT CopilotKit monorepo copy** (`examples/showcases/research-canvas`), not from this repo. Its citations are unverified web footnotes, so rebuild them. |
| [CopilotKit/open-multi-agent-canvas](https://github.com/CopilotKit/open-multi-agent-canvas) | **agent/: MIT by metadata only; frontend/: none; README claims MIT but no LICENSE file** | Chat UI switching between several hosted agents; MCP agent | Demo, no tests; **requires Copilot Cloud**; browser-defined MCP stdio commands = remote code execution | Inspiration only. If needed, use the monorepo copy (`examples/showcases/multi-agent-canvas`). |

The CopilotKit monorepo ([CopilotKit/CopilotKit](https://github.com/CopilotKit/CopilotKit)) is MIT, 38.6k stars, v1.86.0, pushed 11 Nov 2026.

## The deciding finding: CopilotKit Intelligence

- **OpenBot, openmuse and OpenDots** all store conversation threads (and OpenBot's memory) in **CopilotKit Intelligence**:
  - Hosted at `api.intelligence.copilotkit.ai` by default.
  - Free for local use, a trial for evaluation, and a **paid production licence** after that.
  - The local licence renews online every 30 days.
- **open-multi-agent-canvas** needs **Copilot Cloud**.

That conflicts with the top buyer pains in both plans:

| Product | Pain (count from `01-pain-points.md`) | Why Intelligence breaks it |
|---|---|---|
| Helpdesk | Renewal traps and lock-in (23 tight) | Our cost base would carry a vendor licence we can't control, the exact trap we sell against |
| Helpdesk | Per-resolution fees (10 tight) | Adds a metered third-party dependency under a flat price |
| Legal AI | Confidentiality (20 tight) | Client conversations would sit on a third party's servers by default |
| Legal AI | Self-hosting too hard (5 tight) | Kubernetes + Intelligence + its own Postgres/Redis + Docker-socket supervisor |

**Decision:**
- Use the **MIT CopilotKit runtime and AG-UI protocol, self-hosted** (as ANA's `api/copilotkit/route.ts` does). Store threads in our own Postgres.
- **Do not deploy** OpenBot, openmuse or OpenDots as platforms; lift their MIT code and patterns.
- Disable by default: PostHog telemetry (`DO_NOT_TRACK=1`), Parallel/Exa web search, Composio hosted provisioning, OpenTag.

## What we take (MIT) and where it goes

| Pattern / code | Source | Helpdesk use | Legal AI use |
|---|---|---|---|
| **Policy gateway: deny-first CEL rules on tool, URL, file, command; read vs write split; "what-if" backtest** | OpenBot `server/src/approvals/policy.ts`, `/admin/what-if` | "What the AI may do" screen: refund ≤ $X, replacements, address changes | Which matters, folders and actions each role and agent may touch |
| **Approvals: allow once / this conversation / always / deny; web, mobile, chat cards** | OpenBot `docs/approvals.md`, `server/src/approvals/` | AI resolves, human approves only the risky step | Attorney approval before anything leaves the firm |
| **Hash-bound review receipts with expiry; no hidden retry after an uncertain write** | openmuse `apps/server/src/actions.ts` | Refunds and replacements never double-fire | Every approved draft has a receipt tying the approver to the exact text |
| **Audit log written before acting; rule-named refusals; secret redaction; retention window** | OpenBot `server/src/audit.ts`, `audit-retention.ts` | Admin audit, AI action log | Per-matter AI audit trail (the thing that "moved our partners") |
| **SSO (Google, Microsoft, Okta, SAML/OIDC by domain) + SCIM 2.0** | OpenBot `server/src/auth/` (Better Auth), `scim.ts` | Optional for larger teams | Firm SSO, deprovisioning when a lawyer leaves |
| **AG-UI agent wiring + small toolkit** | OpenBot `toolkit/`, `agent-*` samples; CopilotKit runtime (self-hosted) | AI agent outside Chatwoot, behind a standard protocol | Agents on top of AnythingLLM retrieval |
| **MCP tools with approve-on-write; unknown tools treated as writes; server-side allowlist only** | OpenDots `src/server/connection-tools.ts`; OpenBot `server/src/plugins/` | Shopify / Stripe / carrier tools | Clio, NetDocuments, iManage, SharePoint connectors |
| **Interrupt-to-approve a plan, then stream sections to the UI** | ANA (monorepo copy) `interrupt()`, `copilotkit_emit_state` | Multi-step resolutions shown live | Approve an outline, then draft section by section |
| **Durable tasks with SQL leases; pause / resume / cancel** | openmuse `apps/server/src/engine/` | Follow-ups, SLA nudges, scheduled sends | Long document ingestion, batch reviews |
| **AES-256-GCM credential vault** | openmuse `packages/integrations/src/vault.ts` | Store Shopify / carrier tokens | Store DMS OAuth tokens |
| **Hardened compose: internal networks, cap_drop ALL** | OpenDots `compose.yml` | Per-customer deploy template | Per-firm private instance template |
| **Page-review card (approve before save)** | OpenDots `src/server/page-review.ts`, `PageReviewCard.tsx` | Help-centre article drafts | Drafts and translations awaiting attorney review |

## What we avoid

| Item | Why |
|---|---|
| CopilotKit Intelligence, Copilot Cloud, OpenTag (Slack/Teams), hosted Composio provisioning | Paid or hosted third-party dependencies; data leaves the tenant; contradicts the no-lock-in and confidentiality promises |
| Per-person browser/shell computers and the Docker-socket supervisor | Large attack surface; nothing in either product's pains needs it |
| Browser-editable MCP config (multi-agent canvas) | Lets users run arbitrary commands on the server |
| ANA's web-search citations | Unverified footnotes to URLs: no page anchors, no quote check. This is the opposite of what lawyers need. |
| OpenBot's "Knowledge" bot | Not RAG: no vector store, no ingestion, no page cites. AnythingLLM supplies retrieval. |
| OpenBot's two-role model (admin/user) | Too coarse for law firms (ethical walls) and support teams (agent / lead / admin / finance) |
| Single-user defaults (everyone is admin) in OpenBot, openmuse, OpenDots | Unsafe for any multi-user deployment |

## Licence hygiene

- **Keep MIT notices** for OpenBot, openmuse, OpenDots and the Tavily agent code.
- **Copy nothing** from ANA's or the canvas's frontend/root folders; use the CopilotKit monorepo copies instead.
- **Chatwoot:** SLA timers and the Captain AI agent sit in its separately licensed `enterprise/` folder (found in the helpdesk plan). Build our own SLA engine and AI agent through Chatwoot's API, or buy a licence.
