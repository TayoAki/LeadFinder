# What Microsoft Fabric Users Are Asking For (Community Mining)

2026-11-09.

## Sources (via treg)
- **r/MicrosoftFabric: 304 unique posts.** Top and most-commented of the last year (5 pages each), the newest month, and 10 question searches ("how do I", "struggling", "cost", "capacity", "CI/CD", "help", "should I use", "certification", "migration", "best practice").
- **Stack Overflow `microsoft-fabric` tag: 158 questions,** by votes and by activity. 72 are still unanswered.
- **Fabric Community forum** (community.fabric.microsoft.com): **194 threads from the last 12 months.** The forum's browse pages require sign-in, so I found these through Google site-search on 20 topics.
  - Forum counts reflect the topics searched. Use them as examples, not as volumes.

## Demand by theme
Comments = total comments on matching r/MicrosoftFabric posts, the best measure of how much people care. SO views = total views on matching Stack Overflow questions, a measure of how-to search demand.

| Theme | Reddit posts | Reddit comments | SO Qs | SO views | What people actually ask |
|---|---|---|---|---|---|
| **Ingestion: pipeline vs Dataflow Gen2 vs copy job vs mirroring** | 57 | 1,781 | 31 | 18,933 | "Pipeline vs notebook for ingestion?", "Is ADF dead?" (79 comments), "Dataflow Gen2 uses 20× more CUs than Gen1", "Is metadata-driven orchestration overkill with Copy Job?", incremental loads into Warehouse |
| **Cost, capacity, CUs, throttling** | 48 | 1,636 | 7 | 6,514 | "Cost management is a real problem" (Metrics app keeps 30 days), "3× cost on overages?", new on-demand billing ($3,533 on F64 vs $759 for the same workload), "F8 or PPU? Break-even ~93 users", warehouse CU spikes from the system user, OneLake billing change Oct 1 |
| **Notebook dev experience** | 50 | 1,561 | 22 | **41,566** | VS Code setup, local dev, "code reuse/modularity is a mess", read a non-default lakehouse, write polars/pandas to Delta, mssparkutils/notebookutils, slow session start |
| **AI: data agents, Copilot, MCP** | 38 | 1,498 | 0 | 0 | Agent costs ("burned a lot of money"), agents on semantic models, Claude/Copilot + Fabric MCP, AGENTS.md setups |
| **Is Fabric worth it / vs Databricks, Snowflake, Synapse** | 38 | 1,374 | 1 | 460 | "Would you choose Fabric today?" (90), "Does Fabric have a future?" (78), "Fabric vs Databricks cost-wise" (57), "I was wrong about Fabric" (81) |
| **Certification (DP-600/700/800)** | 48 | 1,074 | 1 | 600 | Dozens of "passed" posts, free voucher threads (401 comments), "failed despite 90%+ on practice tests", DP-600 vs 700 vs 800 |
| **Security, permissions, identity** | 36 | 968 | 25 | **28,855** | Service principal tokens for the REST API, OneLake security/RLS, workspace roles, workspace identity, ownership when the owner leaves |
| **CI/CD, Git, Dev/Test/Prod** | 44 | 943 | 8 | 4,373 | "How do you manage Dev/Test/Prod?", fabric-cicd, variable libraries, Direct Lake models not rebinding on deploy, Git with non-technical teams |
| **New in 2026: Fabric Apps (Rayfin), Plan, IQ, Ontology** | 26 | 926 | 0 | 0 | What it is, what it costs, "moved from Power BI to Fabric apps", licensing on F2, "Fabric Plan is expensive" |
| **Direct Lake & semantic models** | 23 | 681 | 6 | 9,558 | "Why aren't more people using Direct Lake?" (58), "DQ proved more reliable than DL", slow first loads, not showing latest data, Import vs DL CU cost |
| **Reliability, outages, support** | 19 | 580 | 24 | 13,065 | Service outages (143 comments), "support has been atrocious", gateway upgrade breakages |
| **dbt / code-first / Terraform** | 13 | 565 | 1 | 802 | dbt jobs native (GA), "using dbt in production?" (68) |
| **Lakehouse vs Warehouse for gold / medallion** | 19 | 516 | 2 | 448 | "Lakehouse or Warehouse for your Gold layer?" (52), materialized lake views doing full refreshes, star schema from D365 |
| **SQL analytics endpoint sync** | 13 | 497 | 1 | 879 | "Lakehouse SQL Endpoint Rant" (68), "never syncs", "best way to refresh the SQL endpoint?" (44) |
| **Real-time (Eventhouse/KQL)** | 9 | 150 | 2 | 581 | Eventstream vs Eventhouse, monitoring pipelines with Eventhouse |

Also high in this sample: **career and learning** (63 posts, 1,865 comments), e.g. "Got a job saying I know Fabric, which I don't... help", "Starting as a DE where the Lakehouse is new: 30/60/90?", "Fabric learning worth it?". That theme's matcher is broad, so treat the count as directional.

## What this means
1. **Ingestion choice, cost and notebook dev experience are where the pain is.** They have the most discussion and the most search views on Stack Overflow.
2. **How-to search demand sits in security and notebooks.** The top Stack Overflow questions (≈10K views each) are:
   - Listing tables via abfss.
   - Getting a REST API token with a service principal.
   - Writing polars to a Delta table.
   - Reading a non-default lakehouse.
   - Loading a warehouse from a notebook.

   That's evergreen "how do I" content. 72 of the 158 questions have no accepted answer.
3. **Cost is the emotional topic.** Posts about pricing changes get 50–90 comments. A creator who explains CU spend clearly earns trust. The new on-demand billing and 3× overage rules are fresh, and nobody has explained them well yet.
4. **New 2026 features have attention but no explainers:** Fabric Apps (Rayfin), data agents, Fabric Plan and IQ. Those posts get 60–300 comments, mostly from Microsoft AMAs, and almost no tutorials.
5. **Certification is a steady community engine.** "I passed" posts get 20–40 comments every week. The repeated lesson is that the official practice test is easier than the real exam.

## Content produced from this (idea-engine/fabric-scripts/community/)
| # | Piece | Answers |
|---|---|---|
| c1 | Fabric CI/CD: Dev/Test/Prod, the simple real-world setup | CI/CD theme; "How do you manage Dev, Test, Prod?" |
| c2 | Develop Fabric notebooks in VS Code: the 2026 setup | Notebook dev experience; modularity; AI setup |
| c3 | SQL analytics endpoint not showing your data? Why, and 3 fixes | Sync-lag rants; top recurring frustration |
| c4 | Fabric cost control: find what's burning your CUs | Cost theme; Dataflow Gen2 20×, warehouse spikes, agents |
| c5 | Fabric Apps (Rayfin) explained: what it is and what it costs | New-features theme |
| c6 | Is Microsoft Fabric worth it in 2026? What 300 threads say | "Would you choose Fabric today?" |

**The 12-week scripts were updated with this data:**
- Pricing (wk 10): on-demand billing, 3× overage, OneLake billing change.
- DP-700 (wk 7): why people fail after acing practice tests, DP-800.
- Data agents (wk 5): cost guardrails.
- Direct Lake (wk 6): the DQ vs DL reliability debate, cache warming.
- Lakehouse vs warehouse (wk 2) and medallion (wk 3): the gold-layer debate, materialized lake views.
- Code-along (wk 4): the SQL endpoint refresh step.
- Roadmap (wk 9): "hired to do Fabric and don't know it".

## Backlog: more pieces the data supports
**Short, search-driven how-tos (Stack Overflow demand):**
1. Get a Fabric REST API token with a service principal (Python + PowerShell).
2. Read and write any lakehouse from a notebook (not just the default one; abfss paths).
3. Write pandas or polars dataframes to Delta tables in Fabric (no Spark).
4. Load a Fabric Warehouse from a notebook (T-SQL magic, the Spark connector, mssql-python).
5. Store secrets in Fabric notebooks with Key Vault.
6. Ingest SharePoint files and lists into a lakehouse (shortcut vs pipeline vs mirroring).

**Explainers:**

7. Is ADF dead? Migrating ADF to Fabric Data Factory (79 comments).
8. Dataflow Gen2 vs Copy Job vs Pipeline: a real CU cost test on the same workload.
9. Materialized lake views: when they refresh incrementally and when they don't.
10. OneLake security and RLS explained, with workspace roles vs item permissions.
11. dbt on Fabric in production: dbt jobs (GA) vs dbt-fabric adapter.
12. Workspace strategy for a solo data engineer: medallion core + business workspaces.

**Career and community:**

13. Your first 30/60/90 days as a data engineer on a new Fabric lakehouse.
14. DP-600 vs DP-700 vs DP-800: which one to take with a free voucher.
15. Monthly "What shipped in Fabric": the community asks "how do you keep track of everything that ships?" (26 comments). This could be a recurring series.

## Caveats
- **r/MicrosoftFabric skews toward experienced practitioners and Microsoft staff** (AMAs, release posts). Beginner demand shows up more on Stack Overflow and Google (see fabric-channel-content-plan.md).
- **Theme matching is keyword-based.** A post can count under several themes.
- **Facts newer than my training** come only from community posts and are marked "Verify" in every script: on-demand billing figures, 3× overage, Fabric Apps/Rayfin, DP-800, the OneLake billing change and GA dates.
