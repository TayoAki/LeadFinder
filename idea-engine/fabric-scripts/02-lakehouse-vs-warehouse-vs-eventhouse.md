# Wk 2: Lakehouse vs Warehouse vs Eventhouse in Microsoft Fabric: Which One? (2026)

- **Runtime target:** 23–26 min
- **Pillar:** 2, Decision video
- **Target keywords:** fabric warehouse (12,100/mo, 1.16×) · lakehouse vs warehouse (140, 1.43×) · fabric lakehouse (390, 1.04×) · eventhouse (480, 0.89×) · kql (2,900, 1.08×) · delta lake (12,100, 1.19×)
- **Title options:**
  1. Lakehouse vs Warehouse vs Eventhouse in Fabric: Which One? (2026)
  2. Fabric Lakehouse vs Warehouse: Stop Picking the Wrong One
  3. Lakehouse, Warehouse or Eventhouse? The Microsoft Fabric Decision in 20 Minutes
- **Thumbnail:** "WHICH ONE?" · three item icons side by side (Lakehouse, Warehouse, Eventhouse) with a ✅ over one and ❌ over two, host with a puzzled face.
- **Verify before recording:**
  - Warehouse T-SQL surface: IDENTITY columns, MERGE, `nvarchar` support and `ALTER TABLE` scope change often.
  - Lakehouse schemas GA status.
  - Whether "OneLake availability" on Eventhouse is still the name of the toggle that exposes KQL tables as Delta.
  - Eventstream sample sources (script uses **Bicycles**; confirm its field names: `BikepointID`, `Street`, `Neighbourhood`, `No_Bikes`, `No_Empty_Docks`).
  - SQL database in Fabric: GA status.
  - Whether the warehouse can still query lakehouse tables via three-part names across workspaces, or only within the same workspace.
  - **SQL analytics endpoint metadata sync:** the current name of the manual refresh button and of the REST API, and whether Microsoft has since cut the lag.
  - **Materialized lake views:** preview/GA status, the exact `CREATE MATERIALIZED LAKE VIEW` syntax, and whether incremental refresh now works as documented (community reports said it ran full refreshes).
  - Re-read the three r/MicrosoftFabric threads named on screen so the paraphrase matches. Show thread titles only, no usernames.

## Hook (0:00–0:30)
"Fabric gives you three places to store analytical data: a lakehouse, a warehouse and an eventhouse. Pick wrong and you'll rebuild in six months. In this video I'll answer the same business question in all three, in Spark, in T-SQL and in KQL, so you can see the difference instead of reading a feature table. By the end you'll have a four-question test that picks the right one in under a minute, and you'll know when the answer is 'use two of them'."

## Script

### 0:30 The one thing they have in common
[ON SCREEN: three icons above one OneLake bar]

First, the part that makes this less scary. All three store their tables in OneLake. Lakehouse and warehouse tables are Delta Parquet. Eventhouse tables can be exposed to OneLake as Delta too, with one toggle.

So this isn't like choosing between three separate databases that can't talk to each other. You can read across all three, and you can switch your mind later without copying everything.

The real differences are four things:
- [ON SCREEN: 1. Language] Which language you write in.
- [ON SCREEN: 2. Who writes] Who writes the data and how.
- [ON SCREEN: 3. Data shape] What shape the data is.
- [ON SCREEN: 4. Freshness] How fresh it needs to be.

Let's take each one.

### 2:00 Lakehouse in plain English
[ON SCREEN: Lakehouse = Files + Tables · Spark writes · SQL endpoint reads]

A lakehouse is a data lake with tables on top. You get two areas:
- **Files**, for anything: CSVs, JSON, images, Parquet dumps.
- **Tables**, for managed Delta tables.

You write to it with Spark (PySpark, Spark SQL, Scala or R), with Dataflow Gen2, or with pipelines.

Every lakehouse comes with a SQL analytics endpoint. It lets anyone query the tables with T-SQL. They can create views and functions on top, but it's read-only for data. You can't INSERT into a lakehouse table from T-SQL. Writes go through Spark or the other ingestion tools.

**Choose a lakehouse when:**
- Your team is comfortable in Python.
- You have semi-structured or messy data: JSON, nested fields, files you want to keep raw.
- You do data science or ML on the same data.
- You want the raw layer of a medallion architecture.

### 4:00 Warehouse in plain English
[ON SCREEN: Warehouse = full T-SQL · read AND write · multi-table transactions]

A warehouse is a relational data warehouse you drive entirely with T-SQL. You can:
- Create tables.
- Insert, update, delete.
- Write stored procedures.
- Load with `COPY INTO`.
- Wrap changes to several tables in one transaction that either all commits or all rolls back.

Under the hood it still stores Delta Parquet in OneLake. There's no index tuning and no distribution keys to pick. It scales automatically.

**Choose a warehouse when:**
- Your team lives in SQL, especially if you're coming from SQL Server, Synapse dedicated pools or another SQL warehouse.
- You need multi-table transactions, for example loading a fact table and its dimensions together.
- You're building a classic star schema for reporting and want SQL-native tooling and security on it.

### 5:30 Eventhouse in plain English
[ON SCREEN: Eventhouse = KQL databases · streaming + time series · seconds-fresh]

An eventhouse is a container for KQL databases. KQL is Kusto Query Language, the same language behind Azure Data Explorer and Log Analytics.

It's built for data that arrives continuously and has a timestamp:
- Logs
- Telemetry
- IoT sensors
- Clickstreams
- Transactions as they happen

It ingests streams in seconds, indexes text and JSON automatically, and answers questions like "what happened in the last five minutes, by region" very fast, over billions of rows.

You feed it with an **eventstream**. Then you build real-time dashboards on it, or set up **Activator** to do something when a value crosses a threshold.

**Choose an eventhouse when:**
- Freshness is measured in seconds, not hours.
- The data is append-only events.
- People ask time-window questions.

### 7:00 Demo setup: one question, three engines
[ON SCREEN: "Which area has the most activity right now, and how is it trending?"]

Let's make this concrete. One question for all three: which area has the most activity, and how is it trending?

I'm using the London bike-share sample that Fabric ships with eventstreams. Each event says how many bikes are docked at a station, at a moment in time.

[DEMO: workspace → + New item → Eventhouse → "eh_bikes" → Create (creates KQL database "eh_bikes")]
[DEMO: + New item → Eventstream → "es_bikes" → Use sample data → Bicycles → Add destination → Eventhouse → database eh_bikes → new table "BikeEvents" → Publish]

1. Create an eventhouse called `eh_bikes`. That also creates a KQL database with the same name.
2. Create an eventstream, choose **Use sample data**, pick **Bicycles**, and add the eventhouse as the destination, into a new table called `BikeEvents`.
3. Publish.

Within a minute, rows are flowing.

[DEMO: eh_bikes → KQL database → OneLake → Availability: On]

One more toggle. On the KQL database, turn on **OneLake availability**. Now `BikeEvents` is also exposed as a Delta table in OneLake. Remember that; it's how we'll get this data into the lakehouse and warehouse without a pipeline.

### 9:00 Demo: the eventhouse answer in KQL
[DEMO: eh_bikes → New KQL queryset]
```kusto
// Which neighbourhoods have the most bikes docked right now?
BikeEvents
| where ingestion_time() > ago(10m)
| summarize arg_max(ingestion_time(), No_Bikes) by BikepointID, Neighbourhood
| summarize bikes_now = sum(toint(No_Bikes)) by Neighbourhood
| top 10 by bikes_now
```

```kusto
// How is it trending, in 5-minute buckets?
BikeEvents
| where ingestion_time() > ago(1h)
| summarize bikes = avg(toint(No_Bikes)) by bin(ingestion_time(), 5m), Neighbourhood
| where Neighbourhood in ("Hyde Park", "Kensington", "Westminster")
| render timechart
```

Look at how this reads: take the table, filter to the last hour, summarize by five-minute bucket, draw a chart.

KQL is a pipe language: each line takes the result of the last. Things that need window functions in SQL, like "latest value per station" (that's `arg_max`) or time bucketing (`bin`), are one word here. And the data is seconds old.

[ON SCREEN: arg_max = latest row per key · bin = time bucket · render = instant chart]

Note: if your sample's field names differ slightly, adjust them. The pattern is the same.

### 12:00 Demo: the lakehouse answer in PySpark
[DEMO: workspace → lh_bikes (new lakehouse) → Tables → … → New shortcut → Microsoft OneLake → eh_bikes → BikeEvents → Create]

Now the lakehouse. Create one called `lh_bikes`. Instead of copying the events, I'll add a **shortcut**: New shortcut, Microsoft OneLake, pick the eventhouse, pick `BikeEvents`.

[ON SCREEN: Shortcut = a pointer. No copy, no pipeline.]

It shows up under Tables like any other Delta table, but it's the eventhouse's data, read in place.

[DEMO: Open notebook → New notebook]
```python
from pyspark.sql import functions as F, Window

ev = spark.read.table("BikeEvents")

# Latest reading per station
w = Window.partitionBy("BikepointID").orderBy(F.col("EventProcessedUtcTime").desc())
latest = (ev.withColumn("rn", F.row_number().over(w))
            .where("rn = 1")
            .drop("rn"))

by_area = (latest
           .groupBy("Neighbourhood")
           .agg(F.sum(F.col("No_Bikes").cast("int")).alias("bikes_now"))
           .orderBy(F.desc("bikes_now")))

display(by_area.limit(10))

# Persist a curated snapshot for reporting
by_area.write.mode("overwrite").format("delta").saveAsTable("area_snapshot")
```

[ON SCREEN: timestamp column name may differ: use whichever event time column your table has]

Same answer, more code. "Latest per station" needs a window function.

But look at the last line. In a lakehouse, it's natural to clean, reshape and save a curated table, and to do that over files, JSON, ML features, whatever. That's the lakehouse's job: transformation at scale, in Python.

### 15:00 Demo: the warehouse answer in T-SQL
[DEMO: + New item → Warehouse → "wh_bikes" → New SQL query]

Now the warehouse. Inside the same workspace I can read the lakehouse table with a three-part name, and that includes the shortcut.

```sql
-- A dimension the business owns and edits in SQL
CREATE TABLE dbo.dim_area (
    neighbourhood VARCHAR(100) NOT NULL,
    region        VARCHAR(50)  NOT NULL,
    manager       VARCHAR(100) NULL
);

INSERT INTO dbo.dim_area (neighbourhood, region, manager) VALUES
('Hyde Park', 'West', 'A. Patel'),
('Kensington', 'West', 'A. Patel'),
('Westminster', 'Central', 'J. Okafor');

-- Join warehouse dimension to lakehouse snapshot
SELECT a.region, a.manager, s.Neighbourhood, s.bikes_now
FROM lh_bikes.dbo.area_snapshot AS s
JOIN dbo.dim_area AS a
  ON a.neighbourhood = s.Neighbourhood
ORDER BY s.bikes_now DESC;
```

Now the thing only the warehouse does: a transaction across two tables.

```sql
CREATE TABLE dbo.area_moves (
    moved_at      DATETIME2(3),
    neighbourhood VARCHAR(100),
    old_region    VARCHAR(50),
    new_region    VARCHAR(50)
);

BEGIN TRANSACTION;

    INSERT INTO dbo.area_moves (moved_at, neighbourhood, old_region, new_region)
    SELECT SYSUTCDATETIME(), neighbourhood, region, 'Central'
    FROM dbo.dim_area WHERE neighbourhood = 'Kensington';

    UPDATE dbo.dim_area
    SET region = 'Central'
    WHERE neighbourhood = 'Kensington';

COMMIT TRANSACTION;
```

[ON SCREEN: "Both changes, or neither."]

The audit row and the update land together, or not at all. If the second statement fails, the first rolls back.

That's the warehouse's job: governed, SQL-written tables where correctness across tables matters. Think finance facts, a conformed star schema, or anything a SQL team maintains by hand.

[ON SCREEN: note: Fabric Warehouse uses VARCHAR with a UTF-8 collation; avoid NVARCHAR]

One gotcha for SQL Server people: use `VARCHAR`, not `NVARCHAR`. The warehouse stores text as UTF-8, so `VARCHAR` already handles international characters.

### 18:00 The side-by-side
[ON SCREEN: table]

| | Lakehouse | Warehouse | Eventhouse |
|---|---|---|---|
| Write with | Spark, Dataflow Gen2, pipelines | T-SQL (plus pipelines, Dataflow Gen2) | Eventstreams, KQL ingestion, pipelines |
| Read with | Spark, T-SQL (read-only endpoint), Power BI | T-SQL, Power BI | KQL, T-SQL (limited), Power BI, Real-time dashboards |
| Data shape | Any: files + tables | Structured tables | Time-stamped events, logs, JSON |
| Freshness sweet spot | Minutes to hours (batch) | Minutes to hours (batch) | Seconds (streaming) |
| Multi-table transactions | No | Yes | No |
| Best for | Raw/curated layers, data science, big transforms | Star schemas, SQL teams, governed marts | Telemetry, monitoring, real-time alerts |

### 19:00 What people actually argue about: the gold layer
[ON SCREEN: r/MicrosoftFabric thread titles: "Are you using Lakehouse or Warehouse for your Gold layer?" · "Fabric Gold Lakehouse vs Gold Warehouse" · "Why choose a Data Warehouse for Gold"]

If you read the Fabric community, the real fight isn't bronze or silver. Almost everyone puts those in a lakehouse. The fight is the gold layer, the report-ready tables. One thread on exactly that question has over fifty comments. Here's what comes up again and again.

**Cost isn't the tiebreaker.** One community member ran the same ETL in Spark and in the warehouse and compared capacity units. They came out close, with the warehouse slightly higher in that test. That's one test, not a benchmark, so measure your own workload in the Capacity Metrics app. But don't pick gold based on someone telling you one engine is "way cheaper".

**The number-one complaint: SQL analytics endpoint sync lag.**
[ON SCREEN: Spark writes table → (metadata sync) → SQL endpoint sees it]

Here's the issue. When Spark writes to a lakehouse table, the SQL analytics endpoint doesn't see the change instantly. A background metadata sync has to catch up first.

Usually that's quick. But people hit cases where a pipeline writes in Spark, the next step queries through SQL, and it reads stale data. That's the most repeated rant in the community.

[DEMO: lh_bikes SQL analytics endpoint → ribbon → Refresh (metadata sync)]

Two fixes:
- If a downstream step reads through the SQL endpoint right after a Spark write, trigger a metadata refresh first. There's a refresh button here, and an API you can call from a pipeline.
- Or put gold in a warehouse. When the warehouse writes its own tables, SQL readers see the commit immediately, because there's no sync in between.

That's honestly one of the strongest practical reasons people give for a warehouse gold layer.

**A third option: materialized lake views.**
[ON SCREEN: CREATE MATERIALIZED LAKE VIEW … AS SELECT …]

Fabric added materialized lake views to lakehouses. You declare a gold table as a Spark SQL query, and Fabric manages the refresh and the dependency order for you. It's great for "gold is just an aggregate of silver".

The caveat from people using them: refreshes they expected to be incremental were doing full recomputes. So check the refresh mode on your views before you count on the time and CU savings. On big tables, test it.

[ON SCREEN: Gold options: Lakehouse tables · Warehouse tables · Materialized lake views]

My take:
- **Warehouse for gold** if SQL people own the gold tables, or if downstream SQL reads must never be stale.
- **Lakehouse for gold** if Python people own it end to end and nothing reads through the SQL endpoint mid-pipeline.
- **Materialized lake views** for simple aggregates, once you've confirmed how they refresh.

### 21:00 The four-question test
[ON SCREEN: decision tree]

Here's the test. Ask these in order:

**Question one: does it need to be seconds-fresh, and is it a stream of events?** Yes → eventhouse. Done.

**Question two: will people write the data with T-SQL, or need transactions across tables?** Yes → warehouse.

**Question three: is it files, semi-structured data, or will you use Python or ML on it?** Yes → lakehouse.

**Question four: still unsure? Ask who's on the team.** Python people → lakehouse. SQL people → warehouse.

[ON SCREEN: "Most real projects: Lakehouse (bronze/silver) → Warehouse or Lakehouse (gold) → Power BI. Eventhouse beside it for anything live."]

And here's the honest answer for most companies: you'll use two.

The common pattern:
- A lakehouse for raw and cleaned data, the bronze and silver layers.
- Then either more lakehouse tables or a warehouse for the gold, report-ready layer, depending on whether your BI team writes SQL.
- An eventhouse next to it if anything is live.

Because everything is in OneLake, those layers read each other without copies.

One more item you might see in the Create menu: **SQL database**. That one's for applications, the operational database your app writes to. It's not for analytics, but it mirrors into OneLake automatically, so your app data is ready to join with the rest.

### 23:30 Outro
Next week we build that pattern properly: medallion architecture, bronze to silver to gold, in notebooks, on real data. If you've got a "we picked the wrong one" story, put it in the comments. I read all of them. Subscribe if you want the rest of the series on [CHANNEL].

## Chapters
```
0:00 Lakehouse, Warehouse or Eventhouse?
0:30 What all three have in common (OneLake)
2:00 Lakehouse in plain English
4:00 Warehouse in plain English
5:30 Eventhouse in plain English
7:00 Demo setup: one question, three engines
9:00 Eventhouse answer (KQL)
12:00 Lakehouse answer (PySpark + shortcut)
15:00 Warehouse answer (T-SQL + transactions)
18:00 Side-by-side comparison
19:00 Gold layer: Lakehouse vs Warehouse (sync lag, CU, materialized lake views)
21:00 The 4-question decision test
23:30 What's next
```

## Description + tags
**Lakehouse vs Warehouse vs Eventhouse in Microsoft Fabric: which should you use in 2026?** I answer the same question in PySpark, T-SQL and KQL, then give you a 4-question test to pick the right Fabric item every time.

Covered:
- Lakehouse (Delta + Spark, read-only SQL analytics endpoint)
- Warehouse (full T-SQL, multi-table transactions)
- Eventhouse (KQL databases, real-time)
- OneLake shortcuts and OneLake availability, so you can read across all three without copies
- The gold-layer debate: SQL endpoint sync lag, CU cost, materialized lake views
- When to use two together

Sample data: Fabric eventstream "Bicycles" sample. Feature support changes often; check Microsoft Learn for the current T-SQL surface area.

**Tags:** fabric lakehouse vs warehouse, lakehouse vs warehouse, microsoft fabric warehouse, fabric lakehouse, fabric eventhouse, kql database, kql tutorial, microsoft fabric 2026, onelake shortcut, delta lake, fabric real time intelligence, dp-600, dp-700

## Shorts cutdowns

**Short 1: "Pick in 4 questions" (≈40s)**
[ON SCREEN: "Lakehouse, Warehouse or Eventhouse?"]
"Fabric gives you three places to put data. Here's how to pick in four questions.
[ON SCREEN: 1. Seconds-fresh events? → EVENTHOUSE] Is it a live stream that needs to be seconds-fresh? Eventhouse.
[ON SCREEN: 2. T-SQL writes or transactions? → WAREHOUSE] Will people write it with T-SQL, or need transactions across tables? Warehouse.
[ON SCREEN: 3. Files, JSON, Python, ML? → LAKEHOUSE] Files, messy JSON, Python, machine learning? Lakehouse.
[ON SCREEN: 4. Still stuck? → Ask who's on the team] Still stuck? Python team, lakehouse. SQL team, warehouse.
They all sit on OneLake, so you can read across them later."

**Short 2: "The lakehouse SQL trap" (≈30s)**
[ON SCREEN: "Why won't my INSERT work?"]
"You open your Fabric lakehouse in SQL, write an INSERT, and it fails.
[ON SCREEN: SQL analytics endpoint = READ-ONLY] That's because the lakehouse SQL endpoint is read-only. Great for SELECTs and views, but writes go through Spark, pipelines or dataflows.
[ON SCREEN: Need SQL writes? → Warehouse] If your team needs to write with T-SQL, that's what the Fabric Warehouse is for. Same OneLake storage, full read and write."

**Short 3: "One KQL line SQL can't match" (≈30s)**
[ON SCREEN: "Latest value per device: SQL vs KQL"]
"Latest reading per device. In SQL that's a window function, a ROW_NUMBER, a subquery…
[ON SCREEN: KQL: | summarize arg_max(Timestamp, *) by DeviceId] In KQL, it's one line: summarize arg_max of timestamp by device.
That's why Fabric's eventhouse is the place for logs and telemetry. Time questions are the language's native shape."

## LinkedIn post
**Diagram:** a 3-column lane: Eventhouse (live) | Lakehouse (bronze/silver) | Warehouse (gold) → Power BI, with OneLake underneath all three.

> "Lakehouse or warehouse?" is the most-asked Fabric question I see, and it's usually the wrong question.
>
> All three of Fabric's stores (lakehouse, warehouse, eventhouse) write to OneLake. So the choice isn't about where data lives. It's about:
> → Language: Spark vs T-SQL vs KQL
> → Writes: does anyone need multi-table transactions? (only the warehouse)
> → Freshness: seconds (eventhouse) vs batch
>
> My default for most teams: lakehouse for bronze/silver, warehouse for gold if the BI team writes SQL, eventhouse beside it for anything live.
>
> The gold layer is where it gets real. The #1 complaint I see: SQL analytics endpoint sync lag after Spark writes. That alone pushes many teams to a warehouse gold.

I answered one business question in all three engines on video. Link in comments.
>
> Which did your team pick first, and would you pick it again?
