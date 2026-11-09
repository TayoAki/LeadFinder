# Backlog b09: Materialized Lake Views: When They Refresh Incrementally (and When They Don't)

## Evidence (why this piece)
- **r/MicrosoftFabric, "Materialized lake views: it was too good to be true...": 41 comments, 73 upvotes.**
  - A team chose MLVs for a large, dependency-heavy project because MLVs need no orchestration.
  - Then they found every refresh was a **full** refresh, even though ingestion used CDF-enabled copy jobs.
  - The docs say incremental refresh needs append-only source changes. Their sources have updates and deletes, so MLVs were unusable at their volume.
- **r/MicrosoftFabric, "Feedback opportunity: materialized lake views in Fabric": 83 comments.** The product team asked for feedback; the demand is clearly there.
- **r/MicrosoftFabric, "Fabric gold lakehouse vs gold warehouse": 34 comments.** A team uses MLVs up to silver and asks whether to use them for gold too.
- **Fabric Community forum:** "Exposing lakehouse materialized views to applications", "Data agent now supports Eventhouse functions, materialized views".

**Gap:** announcement posts exist. A clear "will my MLV refresh incrementally?" guide, plus what to do when it won't, does not.

---

# Video: Materialized Lake Views in Fabric: Will Yours Refresh Incrementally?

- **Runtime target:** 13 min
- **Pillar:** 3 (concept) + 4 (build)
- **Target keywords:** materialized lake views fabric, medallion architecture (6,600, 1.30×), delta lake (12,100, 1.19×), fabric lakehouse (390)
- **Title options:**
  1. Materialized Lake Views: The Refresh Trap Nobody Mentions
  2. Fabric Materialized Lake Views Explained (Incremental vs Full Refresh)
  3. Build Silver + Gold With Materialized Lake Views in 12 Minutes
- **Thumbnail:** "FULL REFRESH?!". A lakehouse with a big red circular-arrow icon.
- **Verify before recording** (all MLV specifics; this feature changes fast):
  - GA vs preview status of MLVs and of "optimal refresh".
  - Exact `CREATE MATERIALIZED LAKE VIEW` syntax, including `IF NOT EXISTS`, `PARTITIONED BY`, `COMMENT`, `TBLPROPERTIES`, and data quality constraints (`CONSTRAINT … CHECK (…) ON MISMATCH DROP | FAIL`).
  - Whether a schema-enabled lakehouse is required.
  - Exact incremental refresh conditions:
    - Change data feed (`delta.enableChangeDataFeed = true`) on all sources.
    - Append-only changes in sources: the community thread and the docs screenshot say updates/deletes force a full refresh.
    - Which SQL constructs support incremental refresh (e.g. projections, filters, inner joins, aggregates?) vs which force full refresh (e.g. window functions, outer joins, non-deterministic functions?).
  - Whether refresh is "skipped" when sources haven't changed.
  - Refresh syntax: `REFRESH MATERIALIZED LAKE VIEW <name> [FULL]`, plus scheduling from the lineage view.
  - Whether Spark SQL `SELECT` in MLVs supports PySpark-defined UDFs (likely not).

## Hook (0:00–0:30)
"Materialized lake views sound perfect. Write a SELECT, and Fabric keeps the table up to date, tracks dependencies, no orchestration. One team built a whole project on them and then saw the capacity bill. Every refresh was a full refresh. In the next 12 minutes I'll show you how MLVs work, the exact conditions for an incremental refresh, how to check which one you got, and what to use instead when your data has updates and deletes."

## Script

### 0:30 What a materialized lake view is
"A materialized lake view is a Delta table that Fabric builds from a SQL query and keeps refreshed. [ON SCREEN: source tables → MLV → MLV]

You write it in Spark SQL in a notebook. Fabric stores the result as a real table in your lakehouse, works out the dependencies between views, and draws a lineage graph you can schedule from.

That's why people use it for medallion layers: bronze tables in, silver and gold views out, no pipeline wiring."

### 1:30 Build one
"[DEMO: schema-enabled lakehouse with bronze.orders and bronze.customers; new notebook, language Spark SQL]

First, turn on change data feed on the source tables. We'll see why in a minute."

```sql
ALTER TABLE bronze.orders    SET TBLPROPERTIES (delta.enableChangeDataFeed = true);
ALTER TABLE bronze.customers SET TBLPROPERTIES (delta.enableChangeDataFeed = true);
```

"Now a silver view with a data quality rule:"

```sql
CREATE SCHEMA IF NOT EXISTS silver;

CREATE MATERIALIZED LAKE VIEW IF NOT EXISTS silver.orders_clean
(
  CONSTRAINT valid_amount CHECK (amount >= 0) ON MISMATCH DROP
)
COMMENT "Cleaned orders"
AS
SELECT order_id,
       customer_id,
       CAST(order_ts AS DATE) AS order_date,
       amount
FROM bronze.orders
WHERE order_id IS NOT NULL;
```

"And a gold view on top of it:"

```sql
CREATE SCHEMA IF NOT EXISTS gold;

CREATE MATERIALIZED LAKE VIEW IF NOT EXISTS gold.daily_sales AS
SELECT o.order_date,
       c.region,
       SUM(o.amount) AS revenue,
       COUNT(*)      AS orders
FROM silver.orders_clean o
JOIN bronze.customers c ON o.customer_id = c.customer_id
GROUP BY o.order_date, c.region;
```

"[DEMO: Lakehouse → Manage materialized lake views → lineage shows bronze → silver → gold → schedule every hour]"

### 3:30 Three kinds of refresh
"When the schedule runs, Fabric decides one of three things per view. [ON SCREEN: three boxes]

Skip: nothing changed in the sources, so do nothing. Cheapest.
Incremental: process only the new rows.
Full: recompute the whole view from scratch. On big tables, this is where the CUs go."

### 4:30 When do you get incremental?
"Here's the part the community learned the hard way. [ON SCREEN: checklist, marked 'per docs at recording, check link']

One. Change data feed has to be on for the source tables. No CDF, no way to know what changed, so it's full.

Two. The changes in the source have to be appends. New rows only. If a source table had an update or a delete since the last refresh, Fabric does a full refresh.

Three. The query has to use constructs that support incremental refresh. Simple selects, filters, and certain joins and aggregations qualify. Some constructs force full every time. The exact list is in the docs; I've linked it."

"Read point two again. The team in that thread used CDF-enabled copy jobs and still got full refreshes, because their source systems update and delete rows. Most real business systems do. Orders get cancelled, customers change address."

### 6:30 How to check what actually happened
"Don't guess. [DEMO: Manage MLVs → Run history → select a run → each node shows refresh type: Skipped / Incremental / Full]

Then confirm the cost. Capacity Metrics app, find the lakehouse item, look at the Spark operations for that run. If the time and CUs are close to a full rebuild every hour, you have your answer."

"You can also force one:"

```sql
REFRESH MATERIALIZED LAKE VIEW gold.daily_sales;        -- let Fabric choose
REFRESH MATERIALIZED LAKE VIEW gold.daily_sales FULL;   -- force full
```

### 7:30 Make your sources append-only (when you can)
"If you control ingestion, design bronze as append-only. Instead of updating a row, append a new version with a timestamp:"

```sql
-- bronze keeps every version; silver picks the latest
CREATE MATERIALIZED LAKE VIEW silver.customers_current AS
SELECT customer_id, region, name, updated_at
FROM (
  SELECT *, ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY updated_at DESC) AS rn
  FROM bronze.customers_history
) t
WHERE rn = 1;
```

"Careful: a window function like this may itself force a full refresh of that view. Check its run history. It's often still worth it. One full refresh on a small dimension is cheap; full refreshes on a billion-row fact table are not."

### 9:00 When your data has updates and deletes: the alternative
"If your sources really update and delete, and they're big, use a notebook with MERGE driven by the change data feed. You handle the changes yourself:"

```python
from delta.tables import DeltaTable
from pyspark.sql import functions as F
from pyspark.sql.window import Window

last = spark.sql("SELECT COALESCE(MAX(version),-1) v FROM ops.watermarks WHERE tbl='bronze.orders'").first().v
cur  = DeltaTable.forName(spark, "bronze.orders").history(1).first()["version"]

if cur > last:
    changes = (spark.read.format("delta")
               .option("readChangeFeed", "true")
               .option("startingVersion", last + 1)
               .table("bronze.orders")
               .filter("_change_type IN ('insert','update_postimage','delete')"))
    # keep the latest change per key
    w = Window.partitionBy("order_id").orderBy(F.col("_commit_version").desc())
    latest = (changes.withColumn("rn", F.row_number().over(w))
              .filter("rn = 1")
              .drop("rn", "_commit_version", "_commit_timestamp"))
    tgt = DeltaTable.forName(spark, "silver.orders_clean_nb")
    (tgt.alias("t").merge(latest.alias("s"), "t.order_id = s.order_id")
        .whenMatchedDelete(condition="s._change_type = 'delete'")
        .whenMatchedUpdateAll(condition="s._change_type != 'delete'")
        .whenNotMatchedInsertAll(condition="s._change_type != 'delete'")
        .execute())
    spark.sql(f"INSERT INTO ops.watermarks VALUES ('bronze.orders', {cur}, current_timestamp())")
```

"[ON SCREEN: the watermark table DDL in the description] It's more code, but you pay only for what changed."

### 10:30 Mixed approach: the practical answer
"You don't have to choose one for everything. [ON SCREEN: diagram]

Big facts with updates and deletes: a notebook MERGE into silver.
Dimensions and append-only event tables: MLVs.
Gold aggregates over silver: MLVs. If silver is maintained by MERGE, gold will often full-refresh, but gold aggregates are usually small, so that's fine.

That gives you MLVs' lineage and scheduling where they're cheap, and control where they're not."

### 11:30 Outro
"Checklist: CDF on, append-only sources, check run history, watch Capacity Metrics. If MLVs fit, they save a lot of orchestration. If they don't, you'll know before the bill does. Subscribe to [CHANNEL]."

## Chapters
0:00 The MLV refresh trap
0:30 What a materialized lake view is
1:30 Build silver + gold MLVs
3:30 Skip vs incremental vs full
4:30 Conditions for incremental refresh
6:30 Check which refresh you got
7:30 Designing append-only sources
9:00 Updates & deletes: CDF + MERGE instead
10:30 The mixed approach
11:30 Outro

## Description + tags
How materialized lake views work in Microsoft Fabric, when they refresh incrementally vs fully, how to check, and what to do when your sources have updates and deletes (CDF + MERGE).

Code: [link]
Tags: materialized lake views, microsoft fabric, lakehouse, medallion architecture, delta lake, change data feed, spark sql, incremental refresh, fabric cost

## Shorts
**Short 1: "Why is my MLV doing full refreshes?"** (40 s)
"Your materialized lake views in Fabric doing full refreshes every time? Check two things. [TEXT: 1. CDF on? 2. Updates/deletes in source?] Incremental needs change data feed on the source and, per the docs, append-only changes. One update or delete, and it's a full rebuild. Check the run history to see which you got."

**Short 2: "MLV or MERGE?"** (35 s)
"Materialized lake view or a notebook MERGE? [TEXT: Appends → MLV. Updates/deletes at scale → MERGE.] Append-only tables and small gold aggregates: MLVs, no orchestration. Big facts that update and delete: MERGE from the change data feed. Use both."

## LinkedIn post
Materialized lake views in Fabric: great idea, one big condition.

Incremental refresh needs:
1. Change data feed on the sources
2. Append-only changes (per the docs)
3. Supported query constructs

Most ERP and CRM sources update and delete, so those views fall back to full refresh. On large tables, that's the CU bill.

My pattern:
- Big facts with updates and deletes → CDF + MERGE in a notebook
- Dimensions, events, gold aggregates → MLVs

Always check the run history for Skipped / Incremental / Full before trusting the design.

[diagram: bronze → (MERGE | MLV) → gold MLV]

---

# Blog: Materialized Lake Views in Fabric: Incremental vs Full Refresh Explained

Materialized lake views (MLVs) let you define a lakehouse table as a Spark SQL query. Fabric materializes it, tracks dependencies between views, and refreshes on a schedule, with no pipeline orchestration. That makes them attractive for medallion architectures. But a widely discussed community thread shows the catch: a team built a large project on MLVs and found every refresh was a full recompute, which consumed a lot of capacity.

## How to create a materialized lake view
In a notebook using Spark SQL on a schema-enabled lakehouse:

```sql
CREATE MATERIALIZED LAKE VIEW IF NOT EXISTS silver.orders_clean
( CONSTRAINT valid_amount CHECK (amount >= 0) ON MISMATCH DROP )
AS SELECT order_id, customer_id, CAST(order_ts AS DATE) AS order_date, amount
FROM bronze.orders WHERE order_id IS NOT NULL;
```

Views can build on other views. Fabric shows the lineage and lets you schedule the whole graph from "Manage materialized lake views".

## Skip, incremental or full
At each scheduled run, Fabric decides per view:
- **Skip:** sources unchanged.
- **Incremental:** process only new data.
- **Full:** recompute everything.

## When you get incremental refresh
Check the current documentation, but the conditions reported by the docs and the community are:
1. **Change data feed is enabled** on the source Delta tables (`delta.enableChangeDataFeed = true`).
2. **Source changes are append-only.** Updates or deletes in a source since the last refresh trigger a full refresh.
3. **The query uses supported constructs.** Some operations always force a full refresh.

Condition 2 is the trap. Business systems update and delete rows constantly. The community team used CDF-enabled ingestion and still got full refreshes for exactly this reason.

## How to check
Open the MLV run history. Each node shows whether it was skipped, incremental or full. Then confirm the cost in the Capacity Metrics app for the lakehouse's Spark operations. You can also run `REFRESH MATERIALIZED LAKE VIEW name` or add `FULL` to force a full rebuild.

## What to do when sources update and delete
For large tables, write a notebook that reads the **change data feed** from the last processed version and **MERGEs** inserts, updates and deletes into the silver table, keeping a watermark of the last version. You only pay for what changed.

## A practical design
- **Large facts with updates/deletes:** CDF + MERGE in notebooks.
- **Append-only events and dimensions:** MLVs.
- **Gold aggregates:** MLVs. Even when they full-refresh, aggregates are usually small.

MLVs remove a lot of orchestration when the data fits their model. Check the refresh type on day one, not on the day the capacity starts throttling.
