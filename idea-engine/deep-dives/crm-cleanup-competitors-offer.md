# Deep dive: "Vertical AI assistant for CRM cleanup" (supply side + offer)

Date 2026-11-10. Method: Gate 0 ([METHOD.md](../github-repo-offers/METHOD.md)), checks 2 (competitors) and 3 (margin) in depth. Demand (check 1) is reused from [hubspot-ai-services.md](hubspot-ai-services.md): 10 tight HubSpot cleanup/audit asks + 14 HubSpot+AI asks on Upwork in ~60 days.

**Sources and limits**
- Live pricing pages fetched today (linked inline). Where a vendor hides prices, I give third-party figures marked "not verified".
- Blocked today: koalify.com (DNS blocked by this session's network), fiverr.com (403), reddit.com (direct fetch blocked; read via treg search instead), Salesforce Help (page did not render). Figures from those sites come from search snippets or marketplace listings.
- treg: 4 Google SERP calls and 4 Reddit search calls, about $0.005–0.01 in total (3 more calls failed on bad arguments and were not billed). The team balance went from $8.38 to $8.26 during the session, but other sessions were spending at the same time (the ledger shows app-store calls that are not mine). Cap was $0.75.

---

## Bottom line

| Question | Answer |
|---|---|
| Is there room on the supply side? | **🟡 Yes for a service, no for a product.** Software that finds duplicates and scores a portal is crowded, cheap, and now partly free from HubSpot itself. Done-for-you cleanup that makes the judgment calls and fixes the *sources* of bad data still sells for $5,000–20,000. |
| Price floor | **$0.** HubSpot ships a free Data Model Health Check (all plans, Jul 2026), a free Agent CLI that plans property cleanup with dry-run (Sep 2026), and duplicate management on every Pro seat. Dedicated tools start at $0–40/mo (Koalify free under 10k records; Dedupely $32–40/mo). |
| Price ceiling | **Agencies $5,000–30,000 per cleanup project**: NoBounds $5k / $15k / $30k, WX from €5k, MergeYourData $12k–20k. Enterprise data tools run $20k+/yr (RingLead, not verified). |
| Crowded | Dedupe tools; "connect your portal, get a score" audit apps; enrichment; email validation; funded "AI data agent" startups (Sweep, Tofu, Cleanlist, Syncari). |
| Open | Judgment and change work: which record wins, lifecycle/stage logic, workflows that keep creating bad data, ownership rules, explaining it to leadership, keeping it clean after. Buyers pay humans for this and complain that cleanups "come back". |
| Recommended first offer | **HubSpot "Clean CRM Sprint"**: free read-only scan → **$6,000 fixed** cleanup (≤50k records, 1 Hub) with an approval queue and an undo log → optional **$750/mo "Hygiene Guard"** (weekly agent scan + human-approved fixes, 4 h cap). ~55% margin at honest hours. |
| What NOT to build first | A self-serve SaaS cleanup agent. A Salesforce version. A free scanner as a product. An auto-merge bot. |
| MVP build | Read-only HubSpot audit + scored 1-page report + merge/fix plan: **~45–60 h** with Claude Code. Adding "apply with undo log": **+20–25 h**. |
| Biggest risk | HubSpot keeps shipping free AI cleanup (it shipped three pieces in Jul–Sep 2026). The mechanical half of cleanup is going to $0. Only the judgment, change management and governance half stays billable. |

---

## 1. What already cleans CRMs, and for how much

### 1a. Built into the CRM (often free)

| Name | What it does | Price | Target buyer | What it does NOT do |
|---|---|---|---|---|
| HubSpot Manage Duplicates | Daily scan finds likely duplicate contacts/companies with a similarity score; review, reject, merge, bulk merge. | Included. Individual review needs any Pro/Ent Hub. Bulk merge, custom duplicate rules (2 per object, 9 properties) and audit log need **Data Hub Pro/Ent**. Pair caps: 10k without Data Hub, 30k Pro, 100k Ent. ([KB, updated Oct 23 2026](https://knowledge.hubspot.com/records/manage-duplicate-records)) | Every HubSpot Pro customer | "Merged records cannot be reverted." No judgment on which record wins beyond rules. Does not fix associations, lifecycle logic or the sources of duplicates. |
| HubSpot Data Model Health Check | Scans objects, properties, associations, pipelines, lifecycle stages. 16 issue types (low fill rate, inactive, similar/duplicate properties, too many stages, missing closed stage…). One-click archive with confirmation. | **Free, all plans** ([KB, Aug 21 2026](https://knowledge.hubspot.com/data-management/use-the-data-model-health-check)). Shipped July 2026 ([r/hubspot test](https://www.reddit.com/r/hubspot/comments/1vf4i89/what_does_hubspots_new_data_model_health_check/)). | Super Admins | Duplicate *properties* only, not duplicate records. Does not scan workflows or reports. No dismissing issues. |
| HubSpot Agent CLI | Lets Claude Code / Claude / ChatGPT agents find duplicate or deprecated properties, show where they are used (workflows, reports, views), preview a cleanup plan, apply with `--dry-run` first. | **Free, all plans** ([KB, Sep 29 2026](https://knowledge.hubspot.com/integrations/use-the-hubspot-agent-cli)) | Admins and partners who use AI coding agents | Warns "Some actions can delete or overwrite HubSpot data." Runs with the user's full permissions. No record-level merge judgment. |
| HubSpot Data Hub (ex-Operations Hub) | Data quality automation (formatting fixes, rules), Data Quality overview, duplicate management, Data Agent. | Free $0; Starter $7/seat (daily scans); **Pro $720/mo** (list $800, real-time, 5,000 credits); Ent $2,000/mo. Extra credits $0.01. ([pricing](https://www.hubspot.com/pricing/operations)) | Ops teams | Tier-by-tier availability of Data Agent not clear on the page. |
| Breeze Data Agent | Fills empty fields, standardizes formats, flags likely duplicates for review. | HubSpot Credits. ~10 credits ($0.10) per answer per third-party blogs ([resolve247](https://resolve247.ai/blog/?p=1721), [aiproductivity](https://aiproductivity.ai/guides/hubspot-breeze-data-agent-guide/)); **not verified** on a HubSpot page. | HubSpot Starter+ | Does not merge; "isn't designed to resolve structural data problems that span multiple systems" ([Vantage Point review, Oct 2026](https://vantagepoint.io/blog/hs/breeze-data-agent-review)). |
| Salesforce Duplicate & Matching Rules | Blocks or alerts on duplicates at create/edit; native merge. | Included in Sales Cloud (official page did not render today). | Salesforce admins | Rules fire only on create/edit, never re-scan old data; merge wizard handles **3 records at a time**; Duplicate Jobs only in Performance/Unlimited ([Tenth Revolution](https://blog.tenthrevolution.com/insights/salesforce-duplicate-management), [Traction Complete](https://tractioncomplete.com/articles/agentforce-implementation/)) — third-party, not verified. |
| Salesforce Data 360 (Data Cloud) / Agentforce | Identity resolution into unified profiles; agents act on CRM data. Agentforce Coworker is now generally available ([r/salesforce, Oct 21](https://www.reddit.com/r/salesforce/comments/1xbf2wf/now_that_agentforce_coworker_is_out_for_everyone/)). | Credit-metered. "Data Cloud Starter $108,000/yr for 1M credits" per [Redress Compliance](https://redresscompliance.com/salesforce-data-cloud-pricing) — **not verified**. | Enterprise | Unifies profiles for AI; does not clean the operational CRM records themselves. No native "duplicate agent" found; that role is filled by AppExchange apps. |
| GoHighLevel Manage Duplicates | Scans contacts for identical/near-identical records, merges up to 10 into a master, moves in-progress workflows. | Included ([HighLevel help](https://gohighlevelassist.freshdesk.com/support/solutions/articles/155000006647-contacts-manage-and-merge-duplicates)) | Agencies and SMBs on GHL | Not on mobile app. No property/pipeline audit. |
| Follow Up Boss | Auto-dedupes incoming leads; bulk "Merge People" up to 10 ([FUB help](https://help.followupboss.com/hc/en-us/articles/4402372112791)) | Included | Real-estate teams | No cleanup of tags, stages, stale leads. |
| Pipedrive Merge Duplicates | Lists likely duplicate people/orgs; merge one by one ([Pipedrive KB](https://support.pipedrive.com/en/article/merge-duplicates)) | Included (admin permission) | SMB sales teams | Users call it tedious at scale ("15k duplicates… merging manually", [Pipedrive community](https://community.pipedrive.com/discussion/17603/serious-lacks-in-the-merge-duplicates-function)). |

### 1b. Dedicated tools

| Name | What it does | Price (live page unless noted) | Target buyer | What it does NOT do |
|---|---|---|---|---|
| [Insycle](https://www.insycle.com/pricing/) | Bulk dedupe, cleanup, standardize, assign, associate across HubSpot, Salesforce, Pipedrive, Intercom, etc. Positions as "CRM context for… copilots, and agents". | At 100k records, billed annually: **$100 / $150 / $200 per mo** (1 / 2 / all modules); Ent custom; add-on $0.50–1 per 1k records; **partner onboarding $1,000** | RevOps at SMB/mid-market | You still decide rules and fix lifecycle/workflow logic yourself. |
| [Dedupely](https://dedupe.ly/pricing) | Dedupe for HubSpot, Pipedrive, Salesforce, Close; "Dedupely Intelligence" AI matching on yearly plans | **$40/mo**, or $32/mo yearly, up to 30k records; larger tiers via sales | SMB | Duplicates only. |
| Koalify | HubSpot merge & dedupe; workflow-action merges; custom rules; custom objects | **Free under 10k records**; Pro priced per 10k records (no $ shown); a review cites €900–1,100/mo at enterprise size. 4.9★, 128 ratings, ~5k installs ([HubSpot Marketplace](https://ecosystem.hubspot.com/marketplace/listing/koalify-io)) | HubSpot users | Duplicates only. Vendor site blocked today. |
| Cloudingo | Salesforce dedupe/cleanup | **$2,500 / $6,000 / $10,000 per yr** per [G2](https://www.g2.com/products/cloudingo/pricing) and others — **not verified** (live page did not render) | Salesforce admins | Salesforce only. |
| DemandTools (Validity) | Salesforce dedupe, mass update, import, monitoring, email validation; "clean and AI-ready" ([Validity](https://www.validity.com/demandtools/)) | Not public. ~$3k/yr Essentials per [datastackguide](https://datastackguide-com.pages.dev/pricing/demandtools-pricing/) — **not verified** | Salesforce admins | Salesforce only. Free [Account dupe check](https://validity.com/deduped) (up to 20k Accounts). |
| [Plauti](https://plauti.com/pricing) (Duplicate Check, now "Deduplicate") | Monitor / Clean / Prevent / Act plans; works with Agentforce & Copilot; "headless dedup from an AI chat" | Custom (by records + credits). $15–20/user/mo per third parties — **not verified** | Salesforce & Dynamics | No HubSpot. |
| DataGroomr | AI dedupe for Salesforce; agentic duplicate prevention on AgentExchange (Jul 2026) | Micro $199/yr (<10k records), plans from $995/yr, undo-merge add-on $1,500/yr ([datagroomr.com/pricing](https://datagroomr.com/pricing/) via search snippet; page not fetched — **not verified**); Vendr median $4,447/yr | Salesforce SMB | Salesforce only. |
| RingLead → ZoomInfo Operations | Dedupe, normalize, routing, enrichment | Custom. $20k–25k+/yr per third parties ([fullenrich](https://fullenrich.com/content/ringlead-pricing)) — **not verified** | Enterprise RevOps | Expensive; Salesforce-centric. |
| Openprise | RevOps data orchestration, dedupe, routing | Pricing page returned an error; **not verified** | Mid-market/enterprise | — |
| [Syncari](https://www.syncari.com/pricing/) | "Agentic master data", sync, merge/dedupe, MCP server | "One plan", contact sales | Mid-market/enterprise | No public price. |
| [Clay](https://www.clay.com/pricing) | Enrichment waterfalls (150+ providers), Claygent | Free; Launch from $54–60/mo; **CRM sync starts at Growth (from $185–205/mo)**; Ent custom | GTM teams | Not a cleanup tool; can overwrite good data if write rules are bad. |
| Apollo / ZoomInfo enrichment | Contact/company enrichment | Not checked today | Sales teams | Not cleanup. |
| [ZeroBounce](https://www.zerobounce.net/email-validation-pricing) | Email validation | Free 100/mo; **$39 for 2,000** (~$0.02/email); subscription from $99/mo (10k credits) | Marketing ops | Email only. NeverBounce page returned 403 (not verified). |
| [Hublead](https://www.hublead.io/pricing) | LinkedIn → HubSpot/Salesforce capture + enrichment | Free; $32 / $64 / $112 per seat/mo (yearly) | SDRs | Not cleanup. |
| [Import2](https://www.import2.com/pricing) | CRM migration | Free up to 500k records (vendor-approved); **1-click from $499**; services **from $5,000** | Migrating SMBs | Migrates the mess as is unless you clean first. |
| Trujay → SyncMatters | Migration/sync | trujay.com redirects to syncmatters.com; pricing page 404 — **not verified** | — | — |

### 1c. Services

| Seller | Offer | Price | Source |
|---|---|---|---|
| Fiverr gigs | HubSpot/CRM cleanup, dedupe, import prep | Google snippet of Fiverr's [hubspot-cleanup category](https://www.fiverr.com/gigs/hubspot-cleanup): "Starting at $50" (page 1) and "$25" (page 2). One search returned ~20 distinct HubSpot cleanup gigs (e.g. [1](https://fiverr.com/pablogonmo/clean-up-duplicates-properties-and-data-in-your-hubspot-crm), [2](https://fiverr.com/john_crm11/audit-and-clean-up-your-hubspot-crm-organize-remove-duplicates-setup-workflow)). **Total gig count and package prices not verified** (Fiverr returned 403). |
| DonorSnap (nonprofit CRM vendor) | Audit $150; audit + call $250; 2-hour cleanup $350+ (no merging) | [donorsnap.com](https://donorsnap.com/support/docs/datacleanup/) |
| Media Junction (HubSpot partner) | 70-point audit + scorecard + strategist review | **$500** | [mediajunction.com/hubspot-audit](https://mediajunction.com/hubspot-audit) |
| ARISE GTM | Portal audit, CRM + 1 Hub, diagnostic only | **from £500** | [arisegtm.com](https://arisegtm.com/hubspot-portal-audit) |
| Orange Marketing | Portal audit | **$975 / $1,975 / $2,975** by size; "Simple/Sophisticated" $3,975 / $5,975 | [orangemarketing.com](https://www.orangemarketing.com/pricing-hubspot-portal-audit) |
| Hive Strategy | Audit $3,000; data migration $3,500 | earlier deep dive, [hivestrategy.com/pricing](https://www.hivestrategy.com/pricing) |
| Contra freelancers (Salesforce) | Pipeline cleanup from $1,800 (2 wk); cleanup + speed pass from $1,499.99 | [contra](https://contra.com/s/bcYvol6O-salesforce-pipeline-cleanup-and-reporting-optimization), [contra](https://contra.com/s/bABRXvXO-salesforce-cleanup-speed-pass) (search snippets) |
| Sonoran Data Strategy | Salesforce pipeline cleanup from $2,500; health check from $375 | [helloskip](https://helloskip.com/b/sonoran-data-strategy/product/salesforce-pipeline-cleanup-reporting-from-2-500-okrm0l4fqkga) (snippet) |
| NoBounds Digital | HubSpot data cleanup tiers: **$5,000** (~2 wk, ≤100 unused properties, dup merge) / **$15,000** / **$30,000** | [noboundsdigital.com](https://noboundsdigital.com/hubspot-data-mobilization) |
| WX Agency | HubSpot Data Hygiene Sprint, **from €5,000**, 3–6 weeks | [wx.agency](https://www.wx.agency/hubspot-data-hygiene-sprint) |
| MergeYourData | 14-day HubSpot cleanup, **$12,000 / ~$16,000 / up to $20,000** by size; Pro/Ent only | [mergeyourdata.com](https://www.mergeyourdata.com/hubspot-cleanup) |
| COLDICP | Audit + safe merge plan + Clay enrichment + 30–60 day re-sweep | No public price ([coldicp.com](https://coldicp.com/hubspot-crm-data-cleanup-services/)) |
| SISTA AI | Done-for-you cleanup + AI agents (HubSpot, Pipedrive, Salesforce, Zoho) | No public price ([sista.ai](https://sista.ai/en/services/ai-crm-integration)) |
| Retainers (for reference) | RevOps/HubSpot retainers $2,500–27,000/mo (RevPartners, Denamico, Kiwi, On The Fly Ops) | compiled by [GenFlows, Sep 2026](https://www.genflows.com/blog/revops-agency-pricing-2026) — not re-verified by me |

**Read:** price bands are clear. Fiverr $25–50 for a task. Audits $500–6,000. Cleanup projects $1,500 (Salesforce freelancers) to $5,000–20,000 (HubSpot agencies). Software $0–200/mo for SMB.

---

## 2. AI agents for CRM data (2025–2026)

| Who | What | Price | Funding | Status |
|---|---|---|---|---|
| **HubSpot** | Data Model Health Check (Jul 2026), Agent CLI with cleanup plans + dry-run (Sep 2026), Breeze Data Agent, duplicate model with similarity scores, free Claude connector / remote MCP | Free / credits | Incumbent | **Shipping fast. This is the floor.** |
| **Salesforce** | Agentforce Coworker (GA, Oct 2026); Hosted MCP servers GA Apr 29 2026 for Enterprise+ with separate read / mutate / delete servers ([Stacksync](https://www.stacksync.com/blog/salesforce-mcp-server-endpoints-tools), [Cleanlist review](https://www.cleanlist.ai/blog/2026-10-05-salesforce-mcp-server-review)) — third-party, not verified on Salesforce docs (403) | Credits / per conversation | Incumbent | No native dedupe agent found; partners fill it. |
| **Sweep** | "Agentic workspace" watching Salesforce/HubSpot metadata | Custom | $22.5M Series B (May 2025, Insight Partners, Bessemer) ([Insight](https://www.insightpartners.com/ideas/sweep-raises-22-5m-in-series-b-funding-led-by-insight-partners-to-help-businesses-stay-ahead-with-an-agentic-workspace-for-gtm-systems/)); $46M total per simplify.jobs — not verified | Funded, enterprise |
| **Tofu** | Repositioned as "CRM data-quality platform powered by AI agents": audit agent, dedupe agent, decay-aware fields, chat agent; HubSpot + Salesforce | Custom quote ([tofuhq](https://www.tofuhq.com/post/tofu-vs-dedupely-hubspot-dedupe)) | ~$17M (seed $5M 2023, Series A $12M Feb 2025 incl. **HubSpot Ventures**) ([Clay dossier](https://www.clay.com/dossier/tofu-funding)) | Funded, publishing many SEO comparisons |
| **Cleanlist** | 12 agents incl. CRM duplicate cleanup (human approves groups), routing, enrichment; Salesforce + HubSpot | **$89/seat/mo**, 5 agents ([cleanlist.ai/agents](https://www.cleanlist.ai/agents)) | Not found | Live |
| **Syncari** | "Agentic master data", Master MCP Server | Contact sales | Not checked | Live |
| **Insycle** | Same tool, now marketed as "context for agents" | $100–200/mo | Not checked | Live |
| **DataGroomr** | Agentic duplicate prevention on AgentExchange (Jul 2026) | from $199–995/yr (not verified) | Not checked | Live |
| **OneMerge Data Quality Agent** | Merges from the Agentforce panel using your matching rules; asks before merging ([AppExchange PDF](https://appexchange.salesforce.com/image_host/3bc8e101-0aa7-4d3e-9cf2-7b3a98d5dce9.pdf)) | Not found | Not found | Vendor claim |
| **Plauti** | Headless dedupe from AI chat; Agentforce/Copilot | Custom | Not checked | Live |
| **Nex** (YC S2026) | Agents for prospecting, CRM hygiene, routing, forecasting ([YC](https://www.ycombinator.com/companies/industry/aiops)) | Not found | YC | Early |
| **Jeeva AI** | CRM admin agents; ~$9M seed Dec 2025 (search snippet, not verified) | — | — | — |
| **Free "AI audit" apps on HubSpot Marketplace** | [HubAudit AI](https://ecosystem.hubspot.com/marketplace/listing/hubaudit-ai) (score /100 + AI summary, free), [Troo Audit](https://ecosystem.hubspot.com/marketplace/listing/troo-audit) (7 areas, free), [Portal Checker](https://ecosystem.hubspot.com/marketplace/listing/portal-checker) ($99 for 5 audits), Bryant Works, Arissa | $0–99 | Indie | **Each shows fewer than 10 installs and 0 reviews.** |
| Product Hunt | Agine AI (CRM revenue-leak audit, Feb 2026), NORMLZ (HubSpot standardization), Firmified (one-time cleanup) ([PH](https://www.producthunt.com/products/agine-ai/launches/agine-ai)) | — | — | Small launches |

**Is it a crowded race? Yes, for software.** Two incumbents ship free agents. Funded startups (Sweep, Tofu with HubSpot Ventures money) sell to mid-market and enterprise. Cheap tools own SMB dedupe ($0–40/mo). Indie builders have already shipped the exact "connect and get a score" scanner and get almost no installs. A solo builder has no distribution edge here.

---

## 3. The gap: what tools leave undone

Evidence that buyers still need humans:
- Native dedupe "catches some obvious duplicates but misses a lot" with multi-source data ([r/hubspot, Jul 2026](https://www.reddit.com/r/hubspot/comments/1uzpblp/how_are_you_handling_hubspot_contact/)).
- "Most CRM cleanups come back… the routes that created the bad records were never touched" ([r/hubspot, Oct 17](https://www.reddit.com/r/hubspot/comments/1x88zgv/most_crm_cleanups_come_back_the_records_were/); same in [r/revops](https://www.reddit.com/r/revops/comments/1wyfd8z/why_crm_cleanups_dont_stick/)).
- "Don't start with duplicates… deciding which record wins a merge depends on…" field rules ([r/hubspot, Sep 23](https://www.reddit.com/r/hubspot/comments/1woaic0/if_you_only_get_one_crm_cleanup_before_january/)).
- "Don't delete a workflow just because it looks old" — check dependencies first ([r/hubspot, Sep 22](https://www.reddit.com/r/hubspot/comments/1wn2wna/one_hubspot_cleanup_rule_weve_learned_the_hard/)).
- Teams lose half a day fixing the pipeline before every forecast ([r/hubspot, Jul 21](https://www.reddit.com/r/hubspot/comments/1v2ekq3/how_much_time_are_you_actually_losing_to_crm/)).
- Junk contacts pushed a portal from 2k to 7k paid Marketing Contacts ([r/hubspot, Oct 11](https://i.redd.it/0ltbm5ou7tuh1.png)). This is a dollar figure a scan can show.
- Salesforce: "Who should actually own duplicate lead cleanup?" ([r/salesforce, Oct 27](https://www.reddit.com/r/salesforce/comments/1xgljp7/who_should_actually_own_duplicate_lead_cleanup/)); Agentforce on messy data ([Oct 21](https://www.reddit.com/r/salesforce/comments/1xbf2wf/now_that_agentforce_coworker_is_out_for_everyone/)).

| Job | Tools do it? | AI + human value per hour |
|---|---|---|
| Find exact/near duplicates | **Yes, free or cheap** | Low. Do not sell this alone. |
| Decide which record wins, which values survive, handle "same person, two companies" and partner/reseller cases | Partly (rules) | **High.** AI drafts the decision with reasons; human approves a sample; tool applies. |
| Associate contacts to companies, fix orphans, parent/child companies | Partly (Insycle Associate add-on) | **High.** AI matches on domain/email/name; human confirms edge cases. |
| Property sprawl (archive, merge, rename) | **Yes now** (Health Check, Agent CLI) | Medium. Fast with the free tools; the value is choosing the target data model. |
| Lifecycle stage and deal-stage logic | No | **Very high.** Needs talks with sales and marketing leads. AI drafts the stage definitions and the migration map. |
| Workflows and integrations that create bad data (the "source" fix) | No (Agent CLI shows usage only) | **Very high.** This is why cleanups "come back". |
| Owner / territory / routing rules | Partly (routing tools) | High. |
| Reporting rebuild after cleanup | No | Medium–high. |
| Explaining the mess to leadership in money terms | No | **High and cheap**: AI writes a 1-page before/after with $ figures (wasted Marketing Contacts, stalled pipeline value). |
| Ongoing governance (weekly checks, new-junk alerts, approvals) | Partly (Data Hub Pro automation at $720/mo; Koalify workflows) | Medium. Fine as a light subscription, not a big retainer. |

**Where AI + human earns the most per hour:** merge judgment at scale, association repair, the lifecycle/workflow "source" fix, and the leadership readout. The AI does the reading, matching and first drafts in minutes. The human spends hours only on decisions and on talking to the client.

---

## 4. Technical feasibility for a small builder (Claude Code)

### APIs and connectors
| Item | Fact | Source |
|---|---|---|
| HubSpot rate limits (private app) | Free/Starter 100 req/10 s, 250k/day; **Pro 190/10 s, 625k/day**; Ent 190/10 s, 1M/day. Public OAuth apps 110/10 s per account. Search API has its own limits. 429 on excess. | [developers.hubspot.com](https://developers.hubspot.com/docs/developer-tooling/platform/usage-guidelines) |
| What that means | A 50k-contact portal at 100 records per list call ≈ 500 calls for contacts, a few thousand calls for everything. A full read-only scan fits in minutes and far under daily limits. | arithmetic |
| HubSpot merge API | `POST /crm/v3/objects/contacts/merge` with `primaryObjectId`, `objectIdToMerge`; companies and custom objects too; newer versioned path `/crm/objects/2026-03/{objectType}/merge` | [HubSpot API ref](https://developers.hubspot.com/docs/api-reference/latest/crm/objects/contacts/merge-contacts) |
| HubSpot remote MCP / Claude connector | Free. Reads CRM objects, properties, pipelines; writes records (with user confirmation), pipelines, custom properties. Search: 5 filter groups, 200 results/page. No merge tool listed. Sensitive Data on → activities and conversations blocked from MCP (not from APIs). | [MCP docs](https://developers.hubspot.com/docs/apps/developer-platform/build-apps/integrate-with-the-remote-hubspot-mcp-server) |
| HubSpot Agent CLI | Free; property-usage lookups and cleanup previews; `--dry-run` | [KB](https://knowledge.hubspot.com/integrations/use-the-hubspot-agent-cli) |
| Salesforce limits | Enterprise: 100,000 + 1,000 per standard license per 24 h (e.g. 15 users → 115,000) | [Salesforce limits cheatsheet](https://developer.salesforce.com/docs/platform/salesforce-app-limits-cheatsheet/guide/salesforce-app-limits-platform-api.html) |
| Salesforce hosted MCP | Separate servers for reads, mutations, deletes; Enterprise+; admin enables each | third-party ([Stacksync](https://www.stacksync.com/blog/salesforce-mcp-server-endpoints-tools)); not verified |

**Recommendation: HubSpot first.** Free developer test accounts, a clean REST API, a free official connector, and an SMB buyer who cannot afford DemandTools-style stacks. Salesforce buyers already have mature cleanup tools and expect certified partners.

### What an agent can safely automate
Pattern: **read-only scan → proposed change set → human approves → apply in small batches → undo log.**

| Action | Reversible? | Automation level |
|---|---|---|
| Scan, score, report | n/a | Fully automatic (read-only scopes). |
| Fill blanks, standardize formats (state codes, phone, capitalization) | Yes (store old value) | Auto-apply after one batch approval. |
| Archive unused properties | Yes (HubSpot can restore archived properties) | Apply after approval; check workflow/report usage first. |
| Associate contacts to companies | Yes (remove association) | Apply after approval of the rule + a 20-record sample. |
| **Merge records** | **No.** "Merged records cannot be reverted." | Per-group approval for anything below high confidence. Before each merge, snapshot both records (all properties + associations + IDs) so they can be rebuilt by hand. Never auto-merge. |
| Delete records | Only within HubSpot's restore window (not checked today) | Avoid. Prefer a "to-delete" list the client deletes. |
| Edit workflows | Risky (can re-enroll or email people) | Human only. Agent proposes. |

### Risks
- **Destructive merges.** Irreversible; the wrong primary moves emails, deals and form history to the wrong person; it can change lifecycle stage and trigger workflows. Merges are also capped (records with 250+ merges cannot be merged).
- **Workflow side effects.** Bulk property updates can enroll thousands of contacts in a workflow that sends email.
- **Billing side effects.** Changing Marketing Contact status or importing can raise the HubSpot bill.
- **Permissions.** Ask for read-only scopes for the scan. Write scopes only during the sprint, via a private app the client owns and revokes after.
- **GDPR/privacy.** You become a processor of personal data. You need a DPA, data minimization (don't copy activities/emails unless needed), encrypted snapshots, a deletion date (e.g. 30 days after handover), and EU-hosted storage for EU clients. Sending CRM data to an LLM needs to be in the DPA and sub-processor list. Regulated portals (Sensitive Data on) block MCP access anyway.
- **Liability.** Put a change-approval clause and a liability cap in the SOW.

### MVP build estimate (HubSpot, read-only audit + scored report + merge/fix plan)
| Part | Hours |
|---|---|
| Private-app auth, paged pulls of contacts/companies/deals/owners/properties/pipelines/associations/workflows, local cache | 10–12 |
| Checks + scoring (dupe candidates with fuzzy matching on email/domain/name/phone; orphans; owner gaps; stale deals and past close dates; empty critical fields; property sprawl; marketing-contact waste; workflows writing the same property) | 12–16 |
| Claude pass: merge-group reasoning (primary pick + why), stage/lifecycle anomalies, 1-page leadership summary | 8–10 |
| Outputs: 1-page score (HTML/PDF), full plan as CSV/Sheet with approve column | 6–8 |
| Seeded test portals (HubSpot developer test accounts) + QA | 6–8 |
| Security basics (token storage, data deletion, logs) | 3–4 |
| **Total audit MVP** | **45–58 h** |
| Later: apply approved plan in batches, snapshots, undo log, rate-limit handling | +20–25 h |

---

## 5. Offer design

### The four hypothesis variants
| Variant | Verdict | Why |
|---|---|---|
| (a) Software agent the customer runs | ❌ not first | HubSpot gives the mechanical part away; Dedupely/Koalify/Insycle/Cleanlist cost $0–200/mo; Tofu and Sweep are funded; free indie scanners get <10 installs. |
| (b) Done-for-you service powered by AI | ✅ | Buyers pay $5k–20k to agencies for the same outcome. AI cuts our hours; the price stays set by agencies. |
| (c) Hybrid: audit + cleanup, then a hygiene agent on subscription | ✅ **recommended** | (b) plus a light recurring line. The "agent" is our internal tool, not a self-serve product. |
| "Vertical" = cleanup specialist | 🟡 necessary, not enough | Many agencies already sell cleanup sprints. Specializing is table stakes. |
| "Vertical" = one industry | 🟡 positioning test | Prior deep dive: real-estate services on HubSpot had ~5 asks in 60 days (thin). Nonprofits are a second candidate: CRM vendors there sell cleanup themselves (DonorSnap $150–350; Virtuous dedupe "from $8,600" per search snippet, **not verified**) and NPSP household merges are hard ([Trailblazer thread](https://trailhead.salesforce.com/es/trailblazer-community/groups/0F94S000000kHiBSAU)). Neither has proven volume yet. |

### Recommended first offer: "Clean CRM Sprint" for HubSpot Pro portals
- **Who:** 10–200-person B2B and services firms on HubSpot Pro (Sales or Marketing Hub) with 5k–50k contacts, who say "it's a mess", or who want AI/Breeze on the CRM. Lead positioning with real-estate services (from the earlier deep dive), but take any HubSpot Pro buyer.
- **Hook — free 1-page "CRM Health Score":** read-only private app, 15-minute connect. The page shows: score /100; duplicate rate; orphan contacts (no company); deals with past close dates and their $ value; records without owner; properties nobody fills; **Marketing Contacts you pay for but never email (estimated $/yr)**; top 3 fixes. It must show things HubSpot's free Health Check does not: record duplicates, associations, deals, $ waste.
- **Core — Clean CRM Sprint: $6,000 fixed, 2–3 weeks.** Cap: ≤50k contacts, 1 Hub + CRM, ≤2 pipelines. Deliverables: merge plan with per-group approvals and snapshots; association repair; property archive/merge; lifecycle and deal-stage definitions and migration; fix the top 5 sources of bad data (forms, imports, integrations, workflows); owner/routing rules; before/after leadership readout; written data rules. Guarantee: nothing is merged without written approval, and every change is logged.
- **Recurring — Hygiene Guard: $750/mo, month-to-month.** Weekly automated scan; a queue of proposed fixes the client approves; up to 4 h of human work; monthly 1-page score trend. Priced well under fractional admin retainers ($2,000+/mo) because tools at $40–200/mo cap what "monitoring" is worth.
- **Optional DIY entry — Cleanup Plan: $950,** credited to the Sprint within 30 days (full scan + plan + 45-min readout). Sits inside the $500–1,975 audit band.

### Margin math (loaded rate $75/h, same as earlier deep dives)
- **Free scan:** 10 min automated + 20 min human check + LLM ~$2 → about **$27 per scan**. 40 scans/month ≈ $1,080 of cost. Needs ≥1 Sprint per ~15 scans to pay off (assumption, not verified).
- **Cleanup Plan $950:** connect + scan review 1 h, plan edits 2 h, write-up 1.5 h, readout 1 h, admin 0.5 h = 6 h → $450 + $5 tools. **Margin 52%.**
- **Sprint $6,000:**
  - kickoff + access 1.5 h
  - scan review 2 h
  - merge-plan judgment and sample approvals 5 h
  - apply merges/associations + snapshots 3 h
  - properties 2 h
  - lifecycle/deal-stage design + migration 5 h
  - source fixes (forms, imports, integrations, workflows) 6 h
  - owner/routing 2 h
  - QA 3 h
  - leadership readout + docs 3 h
  - client calls/Slack 3 h
  - Total **35.5 h → $2,663**. Tools ~$150 (one month of Insycle or Dedupely if needed, ZeroBounce credits, LLM). **Margin 53%.**
  - At 45 h (messier portal): $3,375 + $150 → **41%.** The record and pipeline caps protect margin.
- **Hygiene Guard $750/mo:** 3 h approvals/fixes + 1 h report/call = 4 h → $300 + $30 infra/LLM. **Margin 56%.**
- **Year 1 per client** (Sprint + 9 months Guard): revenue $6,000 + $6,750 = $12,750; cost $2,813 + $2,970 = $5,783. **Margin 55%.**

### What NOT to build first
1. A self-serve SaaS "cleanup agent". No distribution edge against free HubSpot features and $0–200/mo tools.
2. A Salesforce version. Different buyer, mature paid tools (DemandTools, Plauti, DataGroomr), longer sales cycles.
3. A public free scanner as a product (Marketplace listing). Five already exist with <10 installs each. Use the scan as a sales tool you run for prospects.
4. Any auto-merge without approvals. One bad merge kills the business.
5. Enrichment as a core feature. Clay owns it and it is a credit cost, not margin.
6. GoHighLevel / Follow Up Boss first. Their buyers pay Fiverr prices; FUB already auto-dedupes.

---

## 6. Verdict (supply side)

### 🟡 Room for a service, not for a product

| Check | Result | Evidence |
|---|---|---|
| Competitors with live prices | ✅ (many) | Insycle $100–200/mo, Dedupely $32–40/mo, Koalify free <10k, Clay $54+/mo, ZeroBounce $39/2k, Import2 $499/$5,000, Cleanlist $89/seat; services Media Junction $500, Orange $975–5,975, NoBounds $5k–30k, WX €5k, MergeYourData $12k–20k. |
| Saturation | ❌ for software, 🟡 for services | 2 incumbents shipping free AI cleanup; funded startups; 5+ free audit apps. Services: many partners sell cleanup, but most price at $5k–20k with manual hours. |
| Margin ≥50% | ✅ | Sprint 53% at 35.5 h; Guard 56%; year-1 55%. Falls to 41% at 45 h. |
| Demand (reused) | ✅ for HubSpot cleanup + AI, 🟡 for any single industry | 10 tight cleanup + 14 AI asks in ~60 days on Upwork (earlier deep dive). |

- **Deciding reason:** the paid market for CRM cleanup is set by agencies at $5,000–20,000 and is still made of human judgment. Tools and free agents only cover finding problems. An AI-assisted operator can deliver the agency outcome in ~35 hours at $6,000 and keep the client on a light monitoring plan.
- **Biggest risk: incumbents make cleanup "free" in the buyer's mind.** HubSpot shipped the Health Check (Jul), Agent CLI cleanup (Sep), and the Data Agent within months, and HubSpot Ventures backs Tofu. If a buyer believes Breeze will clean the CRM, they won't pay $6,000. **Mitigation:** sell the parts HubSpot won't do (merge judgment, lifecycle/workflow source fixes, leadership readout), show the $ waste on the free scan, and re-check HubSpot's release notes monthly.
- **Second risk:** price compression from Fiverr ($25–50) and Upwork ($20–65/h), and a senior HubSpot developer saying ["AI has killed all contract work"](https://www.reddit.com/r/hubspot/comments/1xkec7z/ai_has_killed_all_contract_work_i_havent_had_a/). Fixed price + scope caps + an approval/undo guarantee are the defence.
- **Better angle than the original hypothesis:** not "an AI assistant that cleans CRMs" (a product), but "a cleanup that stays clean": AI-run scan and plan, human-approved changes, source fixes, then a cheap weekly guard.
- **Next validation:** run the free scan on 20 prospects' portals (with consent) and close 2 Sprints at $6,000 within 45 days. If none closes, drop to the $950 Plan as the main offer and re-test.

### Not verified
- Cloudingo, DemandTools, Plauti, DataGroomr, RingLead/ZoomInfo Operations, Openprise, NeverBounce, SyncMatters prices.
- Koalify Pro prices (site blocked; Marketplace shows none).
- Breeze Data Agent credit price.
- Salesforce hosted MCP details, duplicate-jobs edition limits, 3-record merge limit (official pages did not load).
- Fiverr gig count and package prices (403).
- Virtuous dedupe price; Jeeva AI funding; Sweep total funding.
- Free-scan conversion rate (assumption).
