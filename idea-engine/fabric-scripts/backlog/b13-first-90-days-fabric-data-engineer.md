# Backlog b13: Your First 90 Days as a Data Engineer on a New Fabric Lakehouse

## Evidence (r/MicrosoftFabric, mined 2026-11-09; paraphrased, no usernames)
| Thread | Score / comments | Date | What it tells us |
|---|---|---|---|
| "Starting a Data Engineer role where the company is just beginning its Fabric Lakehouse: advice?" | 47 / **40** | 2026-10 | Literally asks: first 30/60/90 days, what to assess before architecture decisions, early mistakes, Fabric surprises (lakehouse vs warehouse, orchestration, security, Git, capacity cost) |
| "Got a job saying I know Fabric, which I don't... help" | 4 / 39 | 2026-04 | Power BI/DAX/SQL dev dropped into pipelines + notebooks |
| "Fabric learning worth it?" | 16 / 38 | 2026-03 | Mixed opinions; "needs 2 years to mature" fear |
| "'Learn Fabric' they said. 'How long could it take?'" | 46 / 30 | 2025-11 | Pace of change is the meme |
| "I wanted better accounting reports. Somehow I'm a data engineer now." | 66 / 23 | 2026-10 | Accidental engineers: ERP → monthly AR snapshots → historical reporting |
| "Building a Data Platform with Fabric as a Sole Data Engineer" | 48 / 21 | 2026-07 | Metadata-driven ingestion + incremental loading lessons |
| "6 months into a full Fabric migration: aha vs 'wait, why?' moments" | 82 / 32 | 2026-01 | Real lessons list |
| "What's been the most frustrating Fabric issue you've had to troubleshoot?" | 18 / 50 | 2026-08 | The surprise list |
| "Cost management in Fabric is a real problem" | 82 / 28 | 2026-03 | Capacity spend visibility should be set up early |
| "Lakehouse SQL Endpoint Rant" | 61 / 68 | 2026-02 | Top day-one gotcha |

**Gap:** high-engagement career threads, and no practical onboarding playbook exists.

---

# Wk B13: Your First 90 Days as a Fabric Data Engineer (What I'd Do, Week by Week)
- **Runtime target:** 14–15 min
- **Pillar:** 5 (career) / 6 (architecture)
- **Target keywords:** "microsoft fabric data engineer", "fabric data engineer roadmap", "data engineer first 90 days". "data engineer roadmap" 880/mo (0.92×); "fabric data engineer" 170/mo. Demand mainly from the career threads (63 posts, 1,865 comments; matcher is broad, so directional).
- **Title options:**
  1. Your First 90 Days as a Microsoft Fabric Data Engineer
  2. New Fabric Data Engineer? Do This Before You Build Anything
  3. How I'd Start Over on a Brand-New Fabric Lakehouse (30/60/90 Plan)
- **Thumbnail:** "30 · 60 · 90" in big numbers over a lakehouse icon and a calendar
- **Verify before recording:**
  - Capacity Metrics app features (find expensive queries GA Nov 2026; retention limit).
  - Surge protection options.
  - Workspace identity status.
  - Pipeline built-in failure alerts (announced 2026-03).
  - New Monitoring view (2026-09).
  - SQL analytics endpoint metadata sync behavior and the refresh API.
  - Lakehouse schemas GA (2025-12).
  - Fabric Runtime 2.0 package changes (community saw packages removed and some workloads slower after upgrading).
  - Free voucher programs currently running.

## Hook (0:00–0:30)
"You just started as a data engineer, and the company is 'just getting started with Fabric.' Maybe they bought a capacity, maybe there's one lakehouse with a table called test_final_v2. A thread asking exactly this got forty replies from people who've done it. I took their advice and my own mistakes and turned them into a ninety-day plan. Here's what to do in each month, what to check before you build anything, and the five Fabric gotchas that bite almost every new team."

## Script

### 0:30 The mindset: deliver one thing, build the platform behind it
"The biggest tension in that thread was this: the business wants dashboards next month, and you want a clean platform. The answer from people who've done it is to do both, but in a specific order. Pick one valuable use case, and build it on the platform you want to keep. Not a throwaway. Not a perfect framework nobody uses. One real pipeline, end to end, built the way all the future ones will be built.

Here's the plan."

[ON SCREEN: timeline: Days 1–30 Listen & set up · 31–60 Ship one use case · 61–90 Make it repeatable]

### 1:15 Days 1–30: Listen, inventory, set the foundations
"Month one is mostly not building.

Week one: meet people. Ask every stakeholder three questions:
- What decision do you make that data should help with?
- Where does that data live today?
- What report do you not trust?

That last one finds your first use case fast.

Week two: inventory sources. A simple table:

[ON SCREEN: spreadsheet]
| Source | System | Access method | Volume | Change tracking? | Owner |
|---|---|---|---|---|---|
| Orders | ERP (SQL Server) | Gateway / mirroring | 40M rows | CDC on? | IT |
| Budgets | SharePoint Excel | Shortcut / pipeline | small | none | Finance |
| Web events | API | Notebook | 2M/day | timestamp | Marketing |

The 'change tracking' column decides your loading pattern later: full reload, watermark, or CDC. Ask about it now.

Week three: the Fabric tenant itself. Check four things:
1. Which capacity, which SKU, and who pays. Open the Capacity Metrics app; if nobody installed it, install it today.
2. Tenant settings: who can create workspaces and items. On a new tenant it's often 'everyone.'
3. Who the admins are. Make sure there are at least two.
4. Existing workspaces. Note what's there; don't delete anything yet.

Week four: write down your conventions before you create anything. Workspace names, lakehouse names, schemas, where code lives. One page. Then create the workspaces.

[ON SCREEN: conventions one-pager]
```
Workspaces: plat-data-dev / plat-data-prod / plat-model-dev / plat-model-prod
Lakehouses: lh_bronze, lh_silver, lh_gold (schemas enabled)
Code: Git repo 'data-platform', main = dev workspace
Loading: metadata table drives ingestion
Naming: nb_<layer>_<entity>, pl_<schedule>
```
If you want the reasoning for that layout, it's in my workspace strategy video."

### 4:30 Days 31–60: Ship one use case, end to end
"Month two: build the use case you found in week one. All the way through: source, bronze, silver, gold, semantic model, report, schedule, alert.

Build it with the patterns you'll reuse:

Ingestion is metadata-driven from day one. One control table, not one pipeline per table:
```sql
-- in lh_bronze (Spark SQL) or a small Fabric SQL database
CREATE TABLE IF NOT EXISTS meta.ingest_control (
  source_system   STRING,
  source_object   STRING,
  load_type       STRING,   -- full | watermark | cdc
  watermark_col   STRING,
  last_watermark  TIMESTAMP,
  target_table    STRING,
  is_active       BOOLEAN
);
```
A pipeline reads the active rows and loops over them with a ForEach. Adding a source becomes inserting a row, not building a pipeline.

The incremental load pattern for a watermark source, in the silver notebook:
```python
from delta.tables import DeltaTable
from pyspark.sql import functions as F

src = spark.read.table("lh_bronze.erp.orders")
last = spark.sql("SELECT max(updated_at) AS m FROM lh_silver.erp.orders").first()["m"]
if last is not None:
    src = src.filter(F.col("updated_at") > F.lit(last))

tgt = DeltaTable.forName(spark, "lh_silver.erp.orders")
(tgt.alias("t")
    .merge(src.alias("s"), "t.order_id = s.order_id")
    .whenMatchedUpdateAll()
    .whenNotMatchedInsertAll()
    .execute())
```
Rerun it twice. Same result both times. That property, that it's safe to rerun, saves you at 2 a.m.

Then: a Direct Lake semantic model on gold, one report the stakeholder actually opens, a nightly schedule, and a failure alert.

Show it to them in week eight. One trusted report beats a perfect architecture diagram."

### 7:30 The five Fabric gotchas that bite new teams
"While you build, you'll hit these. Better to hear them now.

One: the SQL analytics endpoint lags. You write to a lakehouse table in Spark, query it through the SQL endpoint or a Direct Lake model, and the new rows aren't there yet. The endpoint's metadata sync is asynchronous. In pipelines, refresh the endpoint metadata after writes, then refresh the model. This was the top rant on the subreddit this year.

Two: capacity is shared. Your Dev notebook and the CEO's dashboard can share one pool of compute. A heavy job can throttle reports. Watch the Capacity Metrics app weekly, and keep Dev on separate capacity if you can.

Three: ownership. Items and connections often run as the person who created them. When that person leaves or their password changes, schedules fail. Use a second admin, and use workspace identity or a service principal where the item supports it.

Four: preview features. Fabric ships monthly, and a lot is in preview. Before you build a production path on a feature, check whether it's GA. If it isn't, know your fallback.

Five: runtime upgrades. When the Spark runtime changes version, packages you relied on can disappear, and performance can shift. One team saw a nightly run go from five hours to eight after an upgrade. Upgrade Dev first, time it, then Prod."

[ON SCREEN: 5 gotchas checklist]

### 10:15 Days 61–90: Make it repeatable
"Month three turns one success into a platform.

Git and deployment: connect the Dev workspace to your repo. Promote to Prod with deployment pipelines or fabric-cicd. No more editing in Prod.

Data quality: add checks on the things that broke in month two. Row counts, null keys, freshness.

Monitoring: a single place to see failures. The Monitor hub, pipeline failure alerts, and a weekly look at capacity.

Documentation: a README per layer: what's in bronze, how silver is cleaned, what each gold table means. Short is fine.

Onboard use case two by adding rows to the control table. If that takes days instead of weeks, your platform works.

And present a one-page roadmap: what's live, what's next, what it costs per month in capacity."

### 12:15 Mistakes to avoid
"Things the thread said they'd never do again:
- Building twenty pipelines by hand before a pattern existed.
- Letting everyone create workspaces.
- Skipping Git 'until later.' Later never comes.
- No cost visibility until finance asks why the bill doubled.
- Promising real-time when the business needed daily."

### 13:15 Learning while you work
"If you came from Power BI, your gaps are usually SQL depth, PySpark, Delta and Git. Learn them on the job you're doing, not in a separate course you'll never finish. And if your company will pay, DP-700 lines up closely with this ninety-day plan. I've got a full course on it.

Recap: Month one, listen and set conventions. Month two, ship one use case on real patterns. Month three, make it repeatable. Good luck in the new role."

## Chapters
```
0:00 New Fabric data engineer?
0:30 Deliver one thing, build the platform behind it
1:15 Days 1–30: listen, inventory, foundations
4:30 Days 31–60: ship one use case end to end
7:30 Five Fabric gotchas
10:15 Days 61–90: make it repeatable
12:15 Mistakes to avoid
13:15 Learning on the job + recap
```

## Description + tags
A 30/60/90-day plan for a new data engineer on a Microsoft Fabric lakehouse: stakeholder questions, a source inventory template, workspace conventions, metadata-driven ingestion, incremental MERGE, the five Fabric gotchas, and how to make it repeatable.

Templates (source inventory, conventions one-pager, control table): [link]

Tags: microsoft fabric data engineer, fabric data engineer roadmap, data engineer first 90 days, fabric lakehouse, medallion architecture, metadata driven pipeline, fabric best practices, new data engineer, microsoft fabric tutorial

## Shorts
**Short 1: "Ask stakeholders these 3 questions" (35s)**
"New data engineering job? Week one, ask every stakeholder three things. [TEXT: 1] What decision should data help you make? [TEXT: 2] Where does that data live today? [TEXT: 3] What report don't you trust? That third one is your first project. Fix the report they don't trust, and you've earned the time to build properly."

**Short 2: "Fabric gotcha #1" (35s)**
"You wrote new rows to your Fabric lakehouse. [TEXT: SQL endpoint: 0 new rows] The SQL endpoint doesn't show them. Your code is fine. [TEXT: metadata sync is async] The endpoint syncs metadata on its own schedule. In pipelines, refresh the endpoint metadata after writes, then refresh your model. Write, sync, refresh. In that order."

## LinkedIn post
New data engineer on a brand-new Fabric lakehouse? My 90-day plan:

Days 1–30: listen. 3 questions per stakeholder, a source inventory, check capacity + admins, write conventions BEFORE creating workspaces.

Days 31–60: ship ONE use case end to end on patterns you'll keep: metadata-driven ingestion, rerunnable MERGE, Direct Lake model, alert.

Days 61–90: make it repeatable. Git, deployment, data quality checks, monitoring, use case #2 by adding a row.

The gotchas that bite: SQL endpoint sync lag, shared capacity, items owned by people, preview features, runtime upgrades.

What would you add?

---

## Blog version (~800 words)

# Your First 90 Days as a Data Engineer on a New Microsoft Fabric Lakehouse

Joining a company that's "just getting started with Fabric" is common, and the questions are always the same: what do I do first, what do I check before choosing an architecture, and what will surprise me? Here's a 30/60/90-day plan drawn from community experience.

## Principle: ship one thing, on the platform you'll keep
The business wants results quickly, and you want a solid foundation. Do both by picking one valuable use case and building it with the patterns every future pipeline will use. Don't build a throwaway, and don't build a framework with no users.

## Days 1–30: listen, inventory, set foundations
**Talk to stakeholders.** Ask each one:
1. What decision should data help you make?
2. Where does that data live?
3. Which report don't you trust?

The third answer usually reveals your first use case.

**Inventory sources** in a table: system, access method, volume, change tracking (CDC, timestamps or none) and owner. Change tracking decides whether you'll do full reloads, watermark loads or CDC.

**Audit the tenant:**
- Capacity SKU and who pays; install the Capacity Metrics app.
- Tenant settings for who can create workspaces.
- At least two admins.
- An inventory of existing workspaces.

**Write conventions before creating anything:** workspace names (`plat-data-dev`, `plat-data-prod`), lakehouses (`lh_bronze`, `lh_silver`, `lh_gold` with schemas), item naming, and Git repo structure.

## Days 31–60: ship one use case end to end
Build source → bronze → silver → gold → semantic model → report → schedule → alert, using reusable patterns:
- **Metadata-driven ingestion.** A control table lists source objects, load type and watermarks, and a pipeline loops over active rows. New sources become new rows.
- **Rerunnable incremental loads.** Filter on a watermark, then `MERGE` into silver with Delta so reruns give the same result.
- **Direct Lake semantic model** on gold, one report people actually use, a nightly schedule and failure alerts.

Demo it to stakeholders around week eight.

## Five Fabric gotchas to expect
1. **SQL analytics endpoint lag.** Lakehouse writes aren't instantly visible through the SQL endpoint. Refresh endpoint metadata after writes, then refresh models.
2. **Shared capacity.** Dev experiments can throttle production reports. Monitor capacity weekly and separate Dev capacity if possible.
3. **Ownership.** Items and connections tied to a person break when they leave. Add backup admins, and use workspace identity or service principals where supported.
4. **Preview features.** Check GA status before building production paths on new features.
5. **Runtime upgrades.** Spark runtime changes can remove packages or change performance. Upgrade and time Dev first.

## Days 61–90: make it repeatable
- **Git + deployment:** connect Dev to Git and promote with deployment pipelines or fabric-cicd.
- **Data quality:** row counts, null keys and freshness checks where month two broke.
- **Monitoring:** Monitor hub, pipeline failure alerts and a weekly capacity review.
- **Docs:** a short README per layer.
- **Use case #2** onboarded by adding control-table rows.
- **A one-page roadmap** with monthly capacity cost.

## Mistakes to avoid
- Building many pipelines by hand before a pattern exists.
- Letting everyone create workspaces.
- Postponing Git.
- No cost visibility until finance asks.
- Promising real-time when daily was enough.

## Learning on the job
Coming from Power BI, the usual gaps are SQL depth, PySpark, Delta Lake and Git. Learn them through the work in this plan. If your employer supports certification, the DP-700 exam covers much of the same ground.

*Feature behavior (endpoint sync, alerts, runtime versions) changes often; confirm against current Microsoft Learn docs.*
