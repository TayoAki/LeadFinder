# Wk 7: DP-700 Full Course 2026 | Microsoft Fabric Data Engineer Associate (6 Hours)

- **Runtime target:** ~6 hours (long-form course) + a numbered series cut into 12 parts
- **Pillar:** 1, Cornerstone courses
- **Target keywords:** dp-700 (1,000/mo, 0.87×), dp-700 exam (110, 0.93×), microsoft fabric certification (880, 0.94×), fabric data engineer (170, 0.91×). Proven on YouTube: the top DP-700 full course has 174K views on a 42.8K-sub channel.
- **Title options:**
  1. DP-700 Full Course 2026 (6 Hours) | Microsoft Fabric Data Engineer Exam Prep
  2. Pass DP-700 in 2026: The Complete Fabric Data Engineer Course (Free)
  3. DP-700 Exam Prep: Every Skill on the 2026 Outline, With Demos
- **Thumbnail:** "DP-700 FULL COURSE" + "6 HRS 2026" badge; Fabric logo + exam badge on the right; host pointing at the badge.
- **Verify before recording:**
  - **Skills outline weights.** Last known: three areas, each ~30–35%. Check the "skills measured" PDF on the DP-700 exam page; Microsoft revises it every few months. Re-check every bullet heading in Modules 1–3 against the current outline.
  - **Exam logistics:** passing score 700/1000 (stable); question count (~40–60) and time (100 min). Microsoft Learn access during the exam: confirm it's still allowed and what's excluded. Price varies by country (USD $165 in the US last checked). Renewal: free online assessment yearly.
  - **Preview/GA status of:**
    - OneLake security (data access roles)
    - T-SQL `MERGE` in Fabric Warehouse
    - Warehouse result set caching and data clustering
    - Copilot in notebooks
    - Workspace monitoring
    - Variable libraries
    - Fabric SQL database
    - Python (non-Spark) notebooks
  - **UI names:** "Real-Time hub", "Activator" (formerly Data Activator / Reflex), "Monitor" hub (formerly Monitoring hub), "OneLake catalog" (formerly OneLake data hub), "Copy job", "Dataflow Gen2 (CI/CD)".
  - **DP-800:** community posts on r/MicrosoftFabric (2026) say a third Fabric exam now exists alongside DP-600 and DP-700. Before mentioning it on camera, confirm its full title, the audience it targets, whether it's GA or beta, and how it overlaps DP-700. We haven't verified any of this.
- **Free voucher drives:** community posts mention Microsoft campaigns such as "AI Skills Fest" and "Fabric Data Days" giving free or discounted exam vouchers. Confirm whether one is running, its dates and eligibility before you say it, or say "watch for" instead.
- **Spark runtime version** in your trial (Runtime 1.3, Spark 3.5 / Delta 3.2 last known) and whether the native execution engine is on by default.

---

## Hook (0:00–0:30)
"This is the whole DP-700 course, free, in one video. Every skill on the 2026 exam outline, in order, with a real demo for each one. That means lakehouses, pipelines, notebooks, eventstreams, KQL, security, deployment and performance tuning. I built it the way the exam asks questions: as scenarios where you have to pick the right tool. By the end you'll be able to build an end-to-end Fabric data platform and walk into the exam knowing which answer Microsoft wants. Timestamps are below. Let's start."

---

## Script

### 0:00:30 Course intro: the exam, how to use this course
[ON SCREEN: DP-700 exam page → "Skills measured" PDF]

"DP-700 is the Microsoft Certified: Fabric Data Engineer Associate exam. Here's what you're signing up for.

You need 700 out of 1,000 to pass. It's not a percentage, so don't try to count right answers. Expect somewhere around 40 to 60 questions in about 100 minutes, including at least one case study. A case study is a long scenario about a fictional company, followed by several questions that all refer back to it.

[ON SCREEN: three skill areas with weights]

The outline has three skill areas, and they're roughly equal. That means you can't skip one.

One: implement and manage an analytics solution. That's workspace settings, version control, deployment, security, and orchestration.

Two: ingest and transform data. Loading patterns, batch, streaming, and picking the right tool.

Three: monitor and optimize an analytics solution. Monitoring, fixing errors, and making things faster.

This course follows that order. Module 1 is area one, Module 2 is area two, Module 3 is area three. Then there's a practice section with ten scenario questions.

Two tips before we build anything.

First, get a Fabric trial or a capacity and follow along. This exam rewards people who've clicked the buttons. A lot of questions are 'which setting' or 'which item', and you only remember those if you've seen them.

Before you pay for it, check whether Microsoft is running a voucher drive. They've done campaigns like AI Skills Fest and Fabric Data Days where people got the exam free or heavily discounted. [ON SCREEN: verified current offer, or 'watch the Microsoft Learn events page'] And if you're wondering which Fabric exam to take: DP-600 is for analytics engineers coming from Power BI. DP-700 is this one, for data engineers. There's now a third, DP-800. [ON SCREEN: DP-800 one-line description, verified] I'll link a comparison.

Second, the exam loves the word 'minimize'. Minimize development effort. Minimize cost. Minimize latency. That one word usually decides between two answers that would both work. I'll flag those as we go."

### 0:04:00 Setup: the scenario we'll build
[ON SCREEN: architecture diagram: Sources (Azure SQL, CSV in ADLS, IoT events) → Bronze lakehouse → Silver lakehouse → Gold warehouse → Power BI; Eventstream → Eventhouse → Real-Time dashboard]

"Everything in this course is one project: a retail company called Contoso Outdoor. We'll ingest orders from a SQL database and product files from a storage account. We'll also take in live sensor events from store freezers. We'll land them in a bronze lakehouse, clean them into silver, and model gold in a warehouse. The streaming data goes into an eventhouse.

[DEMO: app.fabric.microsoft.com → Workspaces → New workspace → name `contoso-dp700-dev` → Advanced → License mode: Trial or Fabric capacity → Apply]

[DEMO: New item → Lakehouse → `lh_bronze`, tick 'Lakehouse schemas' if offered. Repeat for `lh_silver`. New item → Warehouse → `wh_gold`. New item → Eventhouse → `eh_telemetry`.]

That's the skeleton. Now let's go through the outline."

---

## MODULE 1: Implement and manage an analytics solution (~1h50)

### Lesson 1.1 (0:09:00): Workspace settings
**Opening (verbatim):** "Before you build anything, the workspace settings decide how your Spark jobs start, who can see what, and where your data lives. The exam tests four groups: Spark settings, domain settings, OneLake settings, and data workflow settings. Let's open each one."

**Talking points:**
- **Spark settings** (Workspace settings → Data Engineering/Science → Spark settings)
  - **Starter pool:** pre-warmed; sessions start in seconds; medium nodes.
  - **Custom pools:** you pick node size, autoscale min/max and dynamic executor allocation. Use them when the starter pool is too small or you need a specific size.
  - **Environments:** an item that holds the runtime version, libraries and Spark properties. You can set a workspace default environment.
  - **High concurrency mode:** multiple notebooks share one Spark session. That saves start-up time and capacity. Pipelines can use it for notebook activities too.
  - Session timeout and job admission settings.
- **Domains:** group workspaces by business area (Sales, Finance) for governance and discovery. Domain admins and contributors can assign workspaces. Set at the tenant or domain level, not inside a workspace.
- **OneLake settings:** in the tenant/workspace, for example whether users can access data via apps outside Fabric (OneLake File Explorer, ADLS APIs). Also the cache for shortcuts to external sources.
- **Data workflow settings:** the Apache Airflow job item's runtime/pool settings.

**Demo:**
1. Workspace settings → Data Engineering/Science → Spark settings → Pool tab → New pool `pool-medium-autoscale`, node size Medium, autoscale 1–4, dynamic allocation on.
2. Environment tab → New environment `env-contoso` → Public libraries → add `great-expectations` (or any PyPI package) → Publish → set as workspace default.
3. Turn on high concurrency for notebooks and for pipeline-run notebooks.

**Exam traps:**
- "Reduce session start time for many short interactive notebooks" → **starter pool + high concurrency**, not a bigger custom pool.
- A library needed by every notebook in the workspace → **environment set as the workspace default**, not `%pip install` in every notebook.
- Domains are about organizing and governing workspaces. They don't grant data access.

### Lesson 1.2 (0:24:00): Lifecycle management: Git, database projects, deployment pipelines
**Opening (verbatim):** "Fabric gives you two ways to move work from dev to prod, and the exam wants you to know when to use each. Git integration is source control: history, branches, pull requests. Deployment pipelines promote content between stages: dev, test, prod. Most real teams use both."

**Talking points:**
- **Git integration**
  - Workspace settings → Git integration; Azure DevOps or GitHub.
  - One workspace connects to one branch and one folder.
  - Commit (workspace → Git) and Update (Git → workspace).
  - Supported items include notebooks, pipelines, lakehouses (metadata, not data), warehouses, semantic models, reports, environments and Dataflow Gen2 (CI/CD). Check the docs list for the current set.
- **Branching patterns:** each developer branches out to a feature workspace (the "Branch out to new workspace" option) and opens a PR into `main`.
- **Database projects:** the warehouse schema as code (`.sqlproj`). Build and deploy with VS Code or SqlPackage; it gives you schema compare. This is how warehouse DDL lives in source control.
- **Deployment pipelines**
  - 2–10 stages (dev, test, prod by default).
  - Compare stages, then deploy selected items.
  - **Deployment rules** change data source connections and parameters per stage (e.g. the prod lakehouse ID).
- **Variable libraries** (if GA): one place for per-stage values used by pipelines and notebooks.

**Demo:**
1. Connect `contoso-dp700-dev` to a GitHub repo, branch `main`, folder `/fabric`. Commit all.
2. Edit a notebook, then show the "uncommitted" indicator → commit with message.
3. Create deployment pipeline `contoso-pipeline` → assign dev workspace → create test stage workspace → Deploy.
4. Add a deployment rule on the semantic model so test points at the test lakehouse.

**Exam traps:**
- "Track changes and roll back notebook code" → **Git integration**. "Promote content between environments with different connections" → **deployment pipeline + deployment rules**.
- Git stores item definitions, **not the data** in lakehouse tables or warehouse rows.
- To change a connection per stage without editing the item → **deployment rules / parameters**, not separate copies.

### Lesson 1.3 (0:44:00): Security and governance
**Opening (verbatim):** "Security questions are where most people lose points on DP-700. That's because Fabric has security at four levels: workspace, item, inside the data, and labels. The trick is to pick the narrowest control that does the job."

**Talking points:**
- **Workspace roles:**
  - Admin: everything, including managing access.
  - Member: can share and add Contributors and Viewers.
  - Contributor: create and edit items.
  - Viewer: read only. Viewers can query the SQL analytics endpoint; Spark reads are governed by item permissions.
- **Item-level sharing:** share one lakehouse or warehouse without workspace access.
  - Read: connect only.
  - ReadData: read via SQL.
  - ReadAll: read files and tables via Spark/OneLake.
  - Build: build reports on a semantic model.
- **Granular data security in the warehouse / SQL analytics endpoint:**
  - Object-level: `GRANT`/`DENY` on tables and views.
  - Column-level: `GRANT SELECT` on a column list.
  - Row-level: a security policy plus a predicate function.
  - Dynamic data masking.
- **OneLake security (data access roles):** folder/table-level roles enforced across engines. Check its status.
- **Sensitivity labels** (Microsoft Purview Information Protection): applied to items and inherited downstream.
- **Endorsement:** Promoted and Certified (Certified needs a tenant setting and authorized users). Master data is another endorsement type.
- **Logging and auditing:** Purview audit logs; workspace monitoring (an eventhouse of workspace logs).

**Demo (T-SQL in `wh_gold`):**
```sql
-- Row-level security: each rep sees only their rows
CREATE SCHEMA Security;
GO
CREATE FUNCTION Security.fn_rep_filter(@SalesRepEmail AS varchar(256))
RETURNS TABLE
WITH SCHEMABINDING
AS
RETURN SELECT 1 AS allowed
WHERE @SalesRepEmail = USER_NAME()
   OR IS_ROLEMEMBER('SalesManagers') = 1;
GO
CREATE SECURITY POLICY Security.SalesFilter
ADD FILTER PREDICATE Security.fn_rep_filter(SalesRepEmail) ON dbo.FactSales
WITH (STATE = ON);
GO

-- Column-level security: analysts can't see cost
GRANT SELECT ON dbo.DimProduct (ProductKey, ProductName, Category, ListPrice) TO [analyst@contoso.com];

-- Dynamic data masking
ALTER TABLE dbo.DimCustomer
ALTER COLUMN Email ADD MASKED WITH (FUNCTION = 'email()');
ALTER TABLE dbo.DimCustomer
ALTER COLUMN Phone ADD MASKED WITH (FUNCTION = 'partial(0,"XXX-XXX-",4)');
GRANT UNMASK TO [support-leads@contoso.com];
```
[DEMO: share `lh_silver` with a user → tick "Read all SQL endpoint data" only → show they can query via SQL but not open in a notebook.]
[DEMO: apply the "Confidential" sensitivity label to `wh_gold` → show it flow to a semantic model built from it.]

**Exam traps:**
- Users must query via SQL but must **not** read files with Spark → grant **ReadData**, not ReadAll, and not a workspace role.
- Dynamic data masking is **not** encryption. Users with UNMASK or admin rights see real values, and it doesn't stop inference attacks. If the question says "prevent access", use column-level security instead.
- RLS defined in the **warehouse** applies to SQL queries. For a Direct Lake semantic model, know whether the model falls back to DirectQuery to enforce it, or define RLS in the model. Read the scenario.
- Narrowest control wins: one table for one group → object-level GRANT, not a separate workspace.

### Lesson 1.4 (1:12:00): Orchestrate processes
**Opening (verbatim):** "The exam asks one question in a dozen disguises: should this be a Dataflow Gen2, a pipeline, or a notebook? Here's my rule. Dataflow for low-code transforms. Pipeline to orchestrate and copy. Notebook for code-heavy transforms at scale. Then you add schedules, event triggers and parameters on top."

**Talking points:**
- **Dataflow Gen2:** Power Query (M), 300+ connectors, low-code, output destinations (lakehouse, warehouse, etc.). Good for analysts and small-to-medium volume.
- **Data pipeline:**
  - Orchestration: Copy activity, Notebook activity, Dataflow activity, Stored procedure, If Condition, ForEach, Until, Wait, Web, Fail, Invoke pipeline, Set variable.
  - Copy activity for high-volume movement with no transformation.
- **Copy job:** simplified copy with built-in incremental (watermark/CDC) options.
- **Notebook:** PySpark/Spark SQL/Scala/SparkR, plus Python notebooks for light jobs. Most flexible; best at big data scale.
- **Apache Airflow job:** when the team already writes DAGs in Python.
- **Schedules:**
  - Item schedules on pipelines, notebooks and dataflows.
  - Multiple schedules per item where supported.
- **Event-based triggers:**
  - Pipelines can be triggered from Real-Time hub events, e.g. **OneLake** or **Azure Blob Storage** file created/deleted.
  - Activator rules can start a pipeline or notebook.
- **Parameters and dynamic expressions:**
  - Pipeline parameters, variables and the expression language: `@pipeline().parameters.x`, `@utcNow()`, `@formatDateTime()`, `@activity('Lookup').output.firstRow.x`, `@concat()`.
  - Notebook parameters come from a cell toggled as "parameter cell".

**Demo:**
1. Pipeline `pl_ingest_orders`:
   - Lookup activity (reads the last watermark from the warehouse table `etl.Watermark`)
   - Copy activity (Azure SQL → `lh_bronze` Files, query below)
   - Notebook activity (passes `run_date`)
   - Stored procedure (updates the watermark)
2. Copy source query (dynamic content):
```
@concat('SELECT * FROM Sales.Orders WHERE ModifiedDate > ''',
        activity('LookupWatermark').output.firstRow.LastModified,
        ''' AND ModifiedDate <= ''', pipeline().TriggerTime, '''')
```
3. Sink file path: `@concat('orders/', formatDateTime(utcNow(),'yyyy/MM/dd'), '/orders.parquet')`
4. In notebook `nb_bronze_to_silver`, toggle the first cell as a parameter cell:
```python
run_date = "2026-01-01"   # overridden by the pipeline
```
   In the pipeline Notebook activity → Base parameters → `run_date` = `@formatDateTime(pipeline().TriggerTime,'yyyy-MM-dd')`.
5. Add a schedule (daily 02:00). Add a trigger: Add trigger → OneLake events → File created in `lh_bronze/Files/products/`.

**Exam traps:**
- "Minimize development effort, business analyst, 50 connectors" → **Dataflow Gen2**.
- "Copy 2 TB nightly, no transformation, fastest" → **pipeline Copy activity** (or Copy job), not a dataflow or a notebook.
- "Run when a file lands in storage" → **storage/OneLake event trigger**, not a schedule that polls every 5 minutes.
- A notebook only receives pipeline values if a cell is marked as the **parameter cell**.

---

## MODULE 2: Ingest and transform data (~2h15)

### Lesson 2.1 (1:42:00): Design loading patterns
**Opening (verbatim):** "Every loading question comes down to three choices. Full load or incremental. Batch or streaming. Overwrite, append, or merge. Get those right and the tool choice usually follows."

**Talking points:**
- **Full load:** simple; fine for small dimensions; overwrite.
- **Incremental:**
  - Watermark column (ModifiedDate, an increasing ID).
  - CDC (change data capture) from the source.
  - Mirroring, which does it for you continuously.
  - Copy job incremental mode.
- **Preparing data for a dimensional model:**
  - Surrogate keys and conformed dimensions.
  - **SCD Type 1** (overwrite) vs **Type 2** (new row with valid_from/valid_to/is_current).
  - Facts load after dimensions.
- **Streaming loading pattern:** Eventstream → Eventhouse (KQL) or → Lakehouse (Delta), or Spark Structured Streaming. The **medallion architecture**: bronze (raw), silver (cleaned, conformed), gold (business-ready model).

**Demo:** draw the Contoso medallion flow on screen, then mark each hop with its pattern:
- Orders: incremental watermark.
- Products: full overwrite.
- Customers: SCD2 merge.
- Telemetry: streaming.

**Exam traps:**
- Need history of a customer's address changes → **SCD Type 2**. Type 1 loses history.
- A source with no reliable modified-date column and you need changes → CDC or mirroring, not a watermark.

### Lesson 2.2 (1:55:00): Choose the store and ingest batch data: shortcuts, mirroring, pipelines
**Opening (verbatim):** "Fabric gives you three ways to get data in without writing a single transform: shortcuts, mirroring and copying. They're not interchangeable. Shortcuts don't move data. Mirroring keeps a replica in sync. Copying makes a one-time or scheduled copy. Pick by asking: does the data need to move, and how fresh does it need to be?"

**Talking points:**
- **Choosing a store:**
  - **Lakehouse:** files and Delta tables; Spark-first; read-only SQL analytics endpoint; semi-structured and unstructured data.
  - **Warehouse:** T-SQL read/write, multi-table transactions, SQL-first teams.
  - **Eventhouse/KQL database:** time-series, logs, telemetry; near-real-time queries.
  - **SQL database in Fabric:** OLTP-style app data, auto-mirrored to OneLake.
- **Shortcuts:**
  - Internal (other lakehouses/warehouses/KQL DBs).
  - External (ADLS Gen2, Amazon S3, S3-compatible, Google Cloud Storage, Dataverse, and others).
  - No data copy; permissions pass through or use the shortcut's connection.
  - Shortcuts in the Tables folder must point at Delta (or virtualized Iceberg) tables.
- **Mirroring:**
  - Continuous, near-real-time replication into OneLake as Delta.
  - Sources include Azure SQL DB, Azure SQL MI, Azure Cosmos DB, Snowflake, Azure Databricks Unity Catalog (metadata mirroring), PostgreSQL and others. Check the current list.
  - Mirroring compute/storage is largely free up to a capacity-based limit; check the current terms.
- **Pipelines:** Copy activity for when you need a physical copy with a schedule.
- **Choosing a transform engine:**
  - Dataflow Gen2: low-code.
  - Notebook (PySpark/Spark SQL): scale, complex logic.
  - T-SQL (warehouse stored procedures): SQL teams, gold modeling.
  - KQL (update policies, materialized views): streaming and time-series.

**Demo:**
1. `lh_bronze` → Get data → New shortcut → ADLS Gen2 → container `products` → place under Files.
2. Create a Mirrored Azure SQL Database → pick tables `Sales.Customers`, `Sales.Orders` → show replicated Delta tables + SQL endpoint.
3. In `lh_silver`, create an internal shortcut to the mirrored `Customers` table (Tables folder).

**Exam traps:**
- "Avoid data duplication / minimize storage cost, data in S3" → **shortcut**.
- "Near-real-time replica of an Azure SQL DB with minimal setup" → **mirroring**, not a pipeline polling every 15 minutes.
- You can't write to a lakehouse with T-SQL. The SQL analytics endpoint is **read-only**. To write with T-SQL, use the **warehouse**.

### Lesson 2.3 (2:20:00): Transform batch data with PySpark and SQL
**Opening (verbatim):** "Now the part that's most of the job: turning raw data into clean, modeled tables. I'll do the same transformations in PySpark and in T-SQL. The exam will show you either one and ask what's missing."

**Talking points:**
- Read from Files, clean, dedupe, handle nulls, conform types, write Delta.
- `MERGE` for upserts and SCD.
- Denormalize (join dimensions onto facts for gold or for wide tables).
- Group and aggregate.
- Late-arriving data:
  - Facts that arrive before their dimension → "inferred member" / unknown key (-1), then fix later.
  - Late events → watermark windows.

**Demo code (notebook `nb_bronze_to_silver`, default lakehouse `lh_silver`, `lh_bronze` added):**
```python
from pyspark.sql import functions as F, Window
from delta.tables import DeltaTable

# 1. Read raw orders landed by the pipeline
raw = spark.read.parquet(f"abfss://contoso-dp700-dev@onelake.dfs.fabric.microsoft.com/lh_bronze.Lakehouse/Files/orders/{run_date.replace('-','/')}/")

# 2. Clean: types, trims, nulls, bad rows
clean = (raw
    .withColumn("OrderDate", F.to_date("OrderDate"))
    .withColumn("CustomerEmail", F.lower(F.trim("CustomerEmail")))
    .withColumn("Quantity", F.coalesce(F.col("Quantity").cast("int"), F.lit(0)))
    .filter(F.col("OrderID").isNotNull()))

# 3. Deduplicate: keep the latest version of each order
w = Window.partitionBy("OrderID").orderBy(F.col("ModifiedDate").desc())
dedup = (clean.withColumn("rn", F.row_number().over(w))
              .filter("rn = 1").drop("rn"))

# 4. Upsert into silver
if spark.catalog.tableExists("silver_orders"):
    tgt = DeltaTable.forName(spark, "silver_orders")
    (tgt.alias("t")
        .merge(dedup.alias("s"), "t.OrderID = s.OrderID")
        .whenMatchedUpdateAll(condition="s.ModifiedDate > t.ModifiedDate")
        .whenNotMatchedInsertAll()
        .execute())
else:
    dedup.write.format("delta").saveAsTable("silver_orders")
```
**SCD Type 2 for customers (Spark SQL cell):**
```sql
%%sql
-- 1. Close out current rows whose tracked attributes changed
MERGE INTO silver_dim_customer AS t
USING bronze_customers AS s
ON t.CustomerID = s.CustomerID AND t.IsCurrent = true
WHEN MATCHED AND (t.City <> s.City OR t.Segment <> s.Segment) THEN
  UPDATE SET t.IsCurrent = false, t.ValidTo = current_timestamp();

-- 2. Insert new versions and brand-new customers
INSERT INTO silver_dim_customer
SELECT s.CustomerID, s.Name, s.City, s.Segment,
       current_timestamp() AS ValidFrom, CAST(NULL AS TIMESTAMP) AS ValidTo, true AS IsCurrent
FROM bronze_customers s
LEFT JOIN silver_dim_customer t
  ON t.CustomerID = s.CustomerID AND t.IsCurrent = true
WHERE t.CustomerID IS NULL;
```
**Gold in the warehouse (T-SQL, cross-database query into the lakehouse):**
```sql
CREATE TABLE dbo.FactSales AS
SELECT  o.OrderID,
        ISNULL(c.CustomerKey, -1)          AS CustomerKey,   -- late-arriving dimension → unknown member
        CAST(FORMAT(o.OrderDate,'yyyyMMdd') AS int) AS DateKey,
        o.ProductID,
        o.Quantity,
        o.Quantity * o.UnitPrice           AS SalesAmount
FROM    lh_silver.dbo.silver_orders o
LEFT JOIN dbo.DimCustomer c
       ON c.CustomerID = o.CustomerID AND c.IsCurrent = 1;

-- Aggregate for a summary table
CREATE TABLE dbo.AggDailySales AS
SELECT DateKey, SUM(SalesAmount) AS Sales, COUNT(DISTINCT OrderID) AS Orders
FROM dbo.FactSales
GROUP BY DateKey;
```
**Exam traps:**
- Duplicates after rerunning a load → you used `append` where you needed **MERGE** (or overwrite with a partition filter).
- Cross-database queries work from the warehouse into a lakehouse's SQL endpoint in the **same workspace** using three-part names.
- `whenMatchedUpdateAll()` with no condition overwrites newer rows with older ones if data arrives out of order. Add the ModifiedDate condition.
- `saveAsTable` writes to the notebook's **default lakehouse**. Know how the default lakehouse is set.

### Lesson 2.4 (2:58:00): Ingest and transform streaming data
**Opening (verbatim):** "Streaming on DP-700 is about three engines: Eventstreams, Spark Structured Streaming and KQL in an eventhouse. Eventstream is the no-code pipe. KQL is where you query streams fast. Spark streaming is for when you need code and Delta tables. And all three use windows."

**Talking points:**
- **Eventstream**
  - Sources: Azure Event Hubs, IoT Hub, custom endpoint, CDC from databases, sample data, Fabric events.
  - Transformations: filter, manage fields, aggregate, group by with windows, union, join, expand.
  - Destinations: eventhouse, lakehouse, Activator, custom endpoint, derived stream.
- **Windowing:**
  - **Tumbling:** fixed, non-overlapping.
  - **Hopping:** fixed size, overlapping, hop interval.
  - **Sliding:** emits when the content changes.
  - **Session:** gaps of inactivity.
  - **Snapshot:** groups events with the same timestamp.
- **Eventhouse/KQL DB tables:**
  - Native tables (ingested).
  - **Shortcuts** (query OneLake Delta without ingesting).
  - **OneLake availability** (expose KQL tables as Delta in OneLake).
- KQL **update policies** transform on ingest; **materialized views** pre-aggregate.
- **Spark Structured Streaming:** `readStream` / `writeStream`, checkpoint location, trigger intervals.

**Demo:**
1. New Eventstream `es_freezers` → Source: sample data "Bicycles", or a custom endpoint fed by a Python sender script.
2. Add Group by transform:
   - Window: tumbling 1 minute.
   - Average of `Temperature`, grouped by `DeviceId`.
3. Destination → Eventhouse `eh_telemetry` → table `FreezerTemps1m`.
4. KQL queryset:
```kql
// Last hour, 5-minute tumbling averages per device
FreezerRaw
| where Timestamp > ago(1h)
| summarize AvgTemp = avg(Temperature), MaxTemp = max(Temperature)
          by DeviceId, bin(Timestamp, 5m)
| order by Timestamp desc

// Devices above threshold in the last 15 minutes
FreezerRaw
| where Timestamp > ago(15m) and Temperature > -15
| summarize Breaches = count() by DeviceId
```
5. Update policy (transform on ingest):
```kql
.create function ParseFreezer() {
    FreezerLanding
    | extend d = parse_json(Payload)
    | project Timestamp = todatetime(d.ts), DeviceId = tostring(d.device), Temperature = todouble(d.temp)
}
.alter table FreezerRaw policy update
@'[{"IsEnabled": true, "Source": "FreezerLanding", "Query": "ParseFreezer()", "IsTransactional": false}]'
```
6. Spark Structured Streaming from bronze to silver:
```python
stream = (spark.readStream.table("bronze_freezer_events")
    .withWatermark("EventTime", "10 minutes")
    .groupBy(F.window("EventTime", "5 minutes"), "DeviceId")
    .agg(F.avg("Temperature").alias("AvgTemp")))

(stream.writeStream
    .format("delta")
    .outputMode("append")
    .option("checkpointLocation", "Files/checkpoints/silver_freezer_5m")
    .trigger(processingTime="1 minute")
    .toTable("silver_freezer_5m"))
```

**Exam traps:**
- "No-code, route the same stream to an eventhouse and an alert" → **Eventstream** with two destinations (eventhouse + Activator).
- "Query Delta tables from KQL without duplicating data" → **OneLake shortcut** in the KQL database.
- Overlapping windows ("every 1 minute, look at the last 5 minutes") → **hopping**. Non-overlapping → **tumbling**.
- A streaming write with no checkpoint location can't recover exactly-once. The exam expects `checkpointLocation`.
- `withWatermark` is what lets late events be dropped and aggregation state be cleared. Without it, append mode on aggregations fails.

---

## MODULE 3: Monitor and optimize an analytics solution (~1h30)

### Lesson 3.1 (3:58:00): Monitor Fabric items
**Opening (verbatim):** "When something fails at 2am, where do you look? This lesson is about knowing which screen answers which question: the Monitor hub, the capacity metrics app, workspace monitoring, and alerts."

**Talking points:**
- **Monitor hub:** runs of pipelines, notebooks, Spark jobs, dataflows and semantic model refreshes. Filter by status and drill into a run.
- **Pipeline run details:** activity-level input/output, duration, and the error message.
- **Spark:** the Spark application view, Spark UI, Spark History Server and the monitoring "run series" to compare runs.
- **Semantic model refresh history** (settings → refresh history).
- **Microsoft Fabric Capacity Metrics app:**
  - CU usage by item.
  - Throttling and smoothing.
  - Interactive vs background operations.
- **Workspace monitoring:** logs into an eventhouse you can query with KQL.
- **Alerts:**
  - **Activator** rules on eventstreams, Real-Time dashboards and Power BI visuals.
  - Pipeline **Office 365 Outlook / Teams** activities on failure paths.
  - Fabric job/workspace item events in the Real-Time hub.

**Demo:**
1. Break the Copy activity (wrong table name) → run → Monitor hub → open failed run → read the error.
2. Add an "On failure" path → Teams activity posting `@activity('CopyOrders').error.message`.
3. Activator rule: when `FreezerTemps1m.AvgTemp > -15` for a device → email the store manager.

**Exam traps:**
- "Which item consumed the most capacity yesterday" → **Capacity Metrics app**, not the Monitor hub.
- Alert on a data condition in a stream → **Activator**. Alert on a pipeline failure → pipeline failure path or job events.

### Lesson 3.2 (4:15:00): Identify and resolve errors
**Opening (verbatim):** "The exam shows you an error and asks for the fix. Six item types: pipelines, dataflows, notebooks, eventhouses, eventstreams and T-SQL. Let's break each one on purpose."

**Talking points + broken demos:**

| Item | Common error | Fix |
|---|---|---|
| Pipeline | Copy fails: source schema changed / type conversion | Fix mapping; enable fault tolerance (skip incompatible rows) with a log path |
| Pipeline | Lookup returns >5,000 rows or >4 MB | Use a pipeline ForEach over a narrower query, or move logic into a notebook |
| Dataflow Gen2 | Refresh fails at destination: column type mismatch | Set the type in the last step; check the destination column mapping |
| Dataflow Gen2 | Slow / gateway timeout | Check query folding; stage data; on-premises sources need an on-premises data gateway |
| Notebook | `AnalysisException: Table or view not found` | No default lakehouse attached, or wrong schema; attach the lakehouse or use a full path |
| Notebook | Out of memory / executor lost | Bigger node size or custom pool; avoid `collect()`/`toPandas()` on big data; repartition |
| Notebook | Delta concurrent write conflict | Serialize writers or partition-scoped writes; retry |
| Eventstream | Destination shows no data | Schema/format mismatch (JSON vs CSV); check the data preview and errors on the node |
| Eventhouse | Ingestion failures | `.show ingestion failures`; mapping mismatch; update policy errors |
| T-SQL | Unsupported feature/data type in Warehouse | Check the T-SQL surface area (e.g. some types and features aren't supported); rewrite |

**Demo KQL:**
```kql
.show ingestion failures
| where FailedOn > ago(1d)
| project FailedOn, Table, Details, ErrorCode
```

**Exam traps:**
- `Table not found` in a notebook that worked yesterday → the **default lakehouse** changed or was removed (common after deployment).
- A dataflow that's slow on a SQL source → check **query folding** first.

### Lesson 3.3 (4:35:00): Optimize performance
**Opening (verbatim):** "Last module. Optimization on DP-700 is mostly about Delta table health, Spark configuration, and knowing which warehouse features help. Small files are the number one cause of slow lakehouses, so we'll start there."

**Talking points:**
- **Lakehouse tables:**
  - **V-Order** (read-optimized Parquet layout that Power BI and the SQL endpoint like).
  - **OPTIMIZE** (bin-compaction of small files).
  - **Z-ORDER** (co-locate rows by a frequently filtered column).
  - **VACUUM** (remove old unreferenced files; default retention 7 days).
  - Partition only on low-cardinality columns with large data.
  - Table maintenance from the lakehouse UI ("Maintenance").
- **Optimized write:** fewer, larger files at write time.
- **Spark:**
  - Pool sizing and autoscale.
  - Dynamic allocation.
  - **Native execution engine** (vectorized, runs on the Spark runtime).
  - Caching.
  - Avoiding UDFs where built-ins exist.
  - Broadcast joins for small dimensions.
  - Resource profiles (e.g. writeHeavy vs readHeavy, if available in your runtime).
- **Pipelines:**
  - Copy activity parallelism and "intelligent throughput".
  - Staging.
  - Partitioned source reads.
- **Warehouse:**
  - Automatic statistics; create statistics manually on join/filter columns if needed.
  - Right-size data types (no `varchar(8000)`).
  - Result set caching / clustering if available.
  - Query insights views for slow queries.
- **Eventstreams/Eventhouses:**
  - Update policies vs materialized views.
  - Caching policy (hot cache window).
  - Retention policy.
  - Ingestion batching.
- **Queries:**
  - Filter early.
  - Select only the columns you need.
  - Use partition and Z-order columns in filters.

**Demo:**
```sql
%%sql
-- Check file count before
DESCRIBE DETAIL silver_orders;

-- Compact + V-Order + Z-Order on the common filter column
OPTIMIZE silver_orders ZORDER BY (OrderDate) VORDER;

-- Remove files older than 7 days that aren't referenced
VACUUM silver_orders RETAIN 168 HOURS;

DESCRIBE DETAIL silver_orders;   -- fewer, bigger files
```
```python
# Session-level: optimized write + V-Order on writes (check defaults in your runtime)
spark.conf.set("spark.microsoft.delta.optimizeWrite.enabled", "true")
spark.conf.set("spark.sql.parquet.vorder.default", "true")

# Broadcast the small dimension
from pyspark.sql.functions import broadcast
fact.join(broadcast(dim_product), "ProductID")
```
```sql
-- Warehouse: find slow queries
SELECT TOP 20 command, total_elapsed_time_ms, start_time
FROM queryinsights.exec_requests_history
ORDER BY total_elapsed_time_ms DESC;

SELECT * FROM queryinsights.long_running_queries;
SELECT * FROM queryinsights.frequently_run_queries;

-- Manual statistics on a join column
CREATE STATISTICS stats_FactSales_CustomerKey ON dbo.FactSales (CustomerKey);
```
```kql
// Eventhouse: keep 30 days hot, 365 days total
.alter table FreezerRaw policy caching hot = 30d
.alter-merge table FreezerRaw policy retention softdelete = 365d
// Pre-aggregate for dashboards
.create materialized-view FreezerHourly on table FreezerRaw {
    FreezerRaw | summarize avg(Temperature) by DeviceId, bin(Timestamp, 1h)
}
```

**Exam traps:**
- "Many small Parquet files, slow reads" → **OPTIMIZE** (plus optimized write going forward). Not VACUUM: VACUUM deletes old files, it doesn't compact.
- VACUUM with retention under 7 days breaks **time travel** to older versions (and is blocked by default).
- Power BI Direct Lake reading slowly → **V-Order** and fewer files.
- Dashboard querying the same aggregate every 30 seconds in KQL → **materialized view**.
- Warehouse query slow after a big load → **statistics** are stale; update/create them.

---

## WHY PEOPLE FAIL EVEN AFTER ACING PRACTICE TESTS (5:08:00)
**Source:** the r/MicrosoftFabric community in 2026 has dozens of "passed DP-700" and "failed DP-700" posts. The lesson they repeat: the free Microsoft Learn practice assessment is much easier than the real exam. One post title says it plainly: "Failed DP-700 despite 90%+ on every practice test." Paraphrase on camera; don't show usernames.

**Verbatim:** "If you read the Fabric community, there's a pattern. Someone scores 90% on every practice test, books the exam, and fails. That's not because they didn't study. The practice assessment is mostly short, single-fact questions. The real exam isn't. Here are the three gaps people keep reporting.

[ON SCREEN: 1. KQL & real-time]
One: KQL and real-time. People coming from SQL or Power BI skip the eventhouse module because it feels niche. Then they get several questions where they have to read or complete a KQL query, or pick between an eventstream, an eventhouse and Spark streaming. If you can't write `summarize ... by bin(Timestamp, 5m)` from memory, go back to Lesson 2.4.

[ON SCREEN: 2. Case studies]
Two: case studies. A case study is a long page about a company: its current setup, requirements and constraints. Then you get several questions about it. The answer is almost always hidden in one requirement line, like 'minimize administrative effort' or 'data must not leave the region'. Read the requirements section first, then the questions, then go back to the details.

[ON SCREEN: 3. Time]
Three: time. The case study eats your clock. People say they spent 20 minutes on one scenario and rushed the end. Here's what I'd do. Do a first pass and answer what you know. Flag anything over two minutes. Then come back. Also, Microsoft Learn is available during the exam, but searching for answers is slow. Use it to check one syntax detail, not to learn a topic.

So treat the practice assessment as a floor, not a signal you're ready. The real test is this: can you rebuild the Contoso project without the video? Can you explain why each tool was chosen?"

---

## PRACTICE QUESTIONS (5:20:00)
**Opening (verbatim):** "Ten scenario questions, the way the exam writes them. Pause after each one, pick your answer, then I'll explain why."

**Q1.** Contoso keeps 3 TB of Parquet files in an Amazon S3 bucket. Analysts need to query them from a Fabric lakehouse. You must minimize storage cost and data movement. What do you create?
A) Pipeline with Copy activity B) Dataflow Gen2 C) OneLake shortcut D) Mirrored database
**Answer: C.** A shortcut reads the data where it is, with no copy. A and B duplicate storage. Mirroring doesn't support S3 as a database source.

**Q2.** A business analyst needs to combine 12 SaaS sources with light cleansing and load them into a warehouse. You must minimize development effort. What do you use?
**Answer: Dataflow Gen2.** It's low-code with Power Query and has hundreds of connectors. A notebook would work but takes more effort.

**Q3.** Users in the Finance group must read lakehouse tables using SQL. They must not read files in the lakehouse via Spark. They must not see other items in the workspace. What do you do?
**Answer:** Share the lakehouse item with Finance and grant **Read all SQL endpoint data (ReadData)** only. A workspace role would expose other items; ReadAll would allow Spark.

**Q4.** A nightly notebook appends orders to `silver_orders`. After a rerun, totals are doubled. What change fixes it with the least rework?
**Answer:** Replace the append with a **Delta MERGE** on `OrderID` (upsert). Then reruns are idempotent.

**Q5.** You need a 5-minute average temperature per device, recalculated every minute. Which window?
**Answer: Hopping** (size 5 min, hop 1 min). Tumbling would only emit every 5 minutes with no overlap.

**Q6.** A pipeline must start as soon as a CSV file arrives in an Azure Blob Storage container. What do you configure?
**Answer:** A **storage event trigger** on the pipeline (Azure Blob Storage events via the Real-Time hub). Not a frequent schedule.

**Q7.** A lakehouse table has 40,000 small files. Direct Lake reports are slow. What two actions help most?
**Answer:**
- Run **OPTIMIZE** (with V-Order) to compact the files.
- Enable **optimized write** for future loads.

VACUUM alone won't compact.

**Q8.** You must promote notebooks and a semantic model from dev to test to prod. In each stage, the semantic model must point to that stage's lakehouse. What do you use?
**Answer:** A **deployment pipeline with deployment rules** (data source/parameter rules) for the semantic model. Git alone doesn't change connections per stage.

**Q9.** Support staff must see customers' emails as `aXXX@XXXX.com` in the warehouse. Support leads must see the full value. What do you configure?
**Answer:**
- **Dynamic data masking** with `email()` on the column.
- `GRANT UNMASK` to support leads.

**Q10.** A KQL dashboard runs the same hourly aggregate over 2 billion rows every 30 seconds, and capacity usage is high. What do you create?
**Answer:** A **materialized view** for the hourly aggregate, then point the dashboard at it.

---

## Outro (5:52:00), verbatim
"That's the full DP-700 outline. We covered:
- Workspace settings, Git and deployment pipelines.
- Every level of security.
- Pipelines, dataflows and notebooks.
- Batch and streaming loads with real merge and window code.
- Monitoring, fixing errors, and tuning Delta, Spark, the warehouse and KQL.

Before you book the exam, do three things:
1. Rebuild the Contoso project yourself without watching.
2. Take the free practice assessment on the Microsoft Learn exam page, but remember it's easier than the real thing. Aim to rebuild the project without the video, not just to score 90% on the practice test.
3. Read the 'skills measured' PDF one more time, because Microsoft updates it.

If you're coming from Power BI, DP-600 is the other Fabric exam, and I've got a full course for that too. It's linked on screen. If this helped you pass, tell me in the comments. I read every one. Good luck."

---

## Chapters
```
0:00:00 What this DP-700 course covers
0:00:30 Exam format, scoring, skill areas
0:04:00 The project we'll build (setup)
0:09:00 1.1 Workspace settings (Spark, domains, OneLake)
0:24:00 1.2 Git, database projects, deployment pipelines
0:44:00 1.3 Security: roles, item permissions, RLS, CLS, masking, labels
1:12:00 1.4 Orchestration: dataflow vs pipeline vs notebook, triggers, parameters
1:42:00 2.1 Loading patterns: full, incremental, SCD, medallion
1:55:00 2.2 Shortcuts, mirroring, choosing a data store
2:20:00 2.3 Batch transforms in PySpark & T-SQL (MERGE, SCD2)
2:58:00 2.4 Streaming: eventstreams, KQL, Spark streaming, windows
3:58:00 3.1 Monitoring: Monitor hub, capacity metrics, Activator
4:15:00 3.2 Identify and resolve errors
4:35:00 3.3 Optimize: V-Order, OPTIMIZE, VACUUM, Spark, warehouse, KQL
5:08:00 Why people fail after acing practice tests
5:20:00 10 practice questions
5:52:00 How to book and pass
```

## Description + tags
**DP-700 full course for 2026: every skill on the Microsoft Fabric Data Engineer Associate exam, with hands-on demos.** Free and 6 hours long. It covers lakehouses, pipelines, notebooks, eventstreams, KQL, security, deployment pipelines and performance tuning, and ends with 10 practice questions.

We build one end-to-end project (bronze → silver → gold, plus real-time) and map every lesson to the official skills outline. Code from the course: [link]. Prefer smaller pieces? The numbered DP-700 series playlist: [link]. DP-600 full course: [link].

Chapters below.

**Tags:** dp-700, dp-700 exam, dp-700 course, microsoft fabric certification, fabric data engineer, microsoft fabric data engineer associate, microsoft fabric tutorial, fabric lakehouse, fabric pipeline, pyspark fabric, eventstream, kql, eventhouse, medallion architecture, delta lake, fabric exam prep

## Numbered series cut list (playlist: "DP-700 Exam Prep 2026")
1. DP-700 EXAM PREP 2026 | Video 1 of 12: Exam Format, Skills Outline & Study Plan
2. Workspace Settings in Microsoft Fabric (Spark Pools, Environments, Domains) | DP-700 2 of 12
3. Git Integration & Deployment Pipelines in Fabric | DP-700 3 of 12
4. Fabric Security: Roles, Item Permissions, RLS, CLS, Masking | DP-700 4 of 12
5. Dataflow vs Pipeline vs Notebook + Triggers & Parameters | DP-700 5 of 12
6. Loading Patterns: Incremental, SCD Type 2, Medallion | DP-700 6 of 12
7. Shortcuts vs Mirroring vs Copy (Choosing a Data Store) | DP-700 7 of 12
8. Batch Transforms in PySpark & T-SQL (MERGE, Dedup, Late Data) | DP-700 8 of 12
9. Streaming: Eventstreams, KQL & Spark Structured Streaming | DP-700 9 of 12
10. Monitoring & Fixing Errors in Fabric | DP-700 10 of 12
11. Optimize Fabric: V-Order, OPTIMIZE, VACUUM, Spark & Warehouse | DP-700 11 of 12
12. 10 DP-700 Practice Questions Explained + Why People Fail After Acing Practice Tests | DP-700 12 of 12

Spin-off (standalone, high-curiosity title): "I Got 90% on Every DP-700 Practice Test. Here's Why That Doesn't Mean You'll Pass", cut from the 5:08:00 segment.

Video 1 of the series should be a standalone 15–18 min version of the intro + study plan. In the reference data the series intro got almost twice the views of the next part.

## Shorts cutdowns
**Short 1: "Shortcut vs mirroring vs copy" (40s)**
[ON SCREEN: "3 ways to get data into Fabric"]
"Three ways to get data into Microsoft Fabric, and the exam wants you to know the difference.
[ON SCREEN: SHORTCUT = no copy]
A shortcut doesn't move the data. It points at S3, ADLS or another lakehouse and reads it in place.
[ON SCREEN: MIRRORING = live replica]
Mirroring keeps a near-real-time copy of a database, like Azure SQL or Snowflake, in OneLake.
[ON SCREEN: COPY = scheduled copy]
A pipeline copy makes a physical copy on a schedule.
So: no duplication? Shortcut. Live database? Mirroring. Batch file loads? Copy. Full DP-700 course on the channel."

**Short 2: "OPTIMIZE vs VACUUM" (35s)**
[ON SCREEN: "OPTIMIZE ≠ VACUUM"]
"Your Fabric lakehouse is slow because of small files. Which command fixes it?
[ON SCREEN: OPTIMIZE → compacts small files]
OPTIMIZE. It merges thousands of small files into fewer big ones. Add VORDER and Power BI reads them faster.
[ON SCREEN: VACUUM → deletes old files]
VACUUM doesn't compact anything. It deletes old files your table no longer uses. Run it under 7 days and you lose time travel.
This is a classic DP-700 trap."

**Short 3: "Tumbling vs hopping" (40s)**
[ON SCREEN: two timelines animating]
"Tumbling window versus hopping window, in 30 seconds.
[ON SCREEN: |--5m--|--5m--|--5m--|]
Tumbling: fixed blocks, no overlap. Every 5 minutes you get one number.
[ON SCREEN: overlapping 5-minute bars, shifted by 1 minute]
Hopping: same 5-minute size, but a new window starts every minute. So every minute you get 'the last 5 minutes'.
If the question says 'every minute, average of the last five', it's hopping. Save this for DP-700."

## LinkedIn post
[IMAGE: one-page diagram, "DP-700 in one picture". Three columns:
- **Manage:** settings → Git → deploy → security → orchestrate.
- **Ingest & transform:** shortcut / mirror / copy → bronze → silver → gold; stream → eventhouse.
- **Monitor & optimize:** Monitor hub, capacity metrics, OPTIMIZE / V-Order.]

Most people who fail DP-700 knew the tools. They lost points on choosing between them.

The exam keeps asking the same question in different words:
- Shortcut, mirroring, or copy?
- Dataflow, pipeline, or notebook?
- ReadData or ReadAll?
- Tumbling or hopping?
- OPTIMIZE or VACUUM?

The tie-breaker is almost always one word in the question: minimize effort, cost or latency.

I put the whole outline into one diagram, plus a free 6-hour course where every lesson ends with these traps.

Which choice trips you up most?

#MicrosoftFabric #DP700 #DataEngineering
