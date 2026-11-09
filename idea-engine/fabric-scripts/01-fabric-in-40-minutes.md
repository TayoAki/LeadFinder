# Wk 1: Microsoft Fabric in 40 Minutes (2026 Beginner Crash Course)

- **Runtime target:** 38–42 min
- **Pillar:** 1, Cornerstone course
- **Target keywords:** microsoft fabric (22,200/mo, 0.98×) · what is microsoft fabric (4,400, 1.15×) · onelake (8,100, 0.99×) · fabric warehouse (12,100, 1.16×) · microsoft fabric tutorial (110, YouTube demand much higher than Google shows)
- **Title options:**
  1. Microsoft Fabric in 40 Minutes (2026 Beginner Crash Course)
  2. Learn Microsoft Fabric From Zero: Full Beginner Course (2026)
  3. Microsoft Fabric Explained AND Built: Lakehouse to Power BI in 40 Minutes
- **Thumbnail:** "FABRIC IN 40 MIN" · Fabric logo, a stopwatch, and a 4-step strip: Lakehouse → Notebook → Warehouse → Power BI. Host face, pointing at the strip.
- **Verify before recording:**
  - Trial length and size (60 days, F64-equivalent at time of writing) and whether a work email is still required.
  - F2 and F64 pay-as-you-go prices in your region (about $263/month and $8,410/month in US regions at time of writing; reserved is cheaper).
  - The F64 threshold for free-licence Power BI viewers.
  - Whether new lakehouses still skip the auto-created default semantic model. The script assumes you click **New semantic model** yourself.
  - Lakehouse schemas: GA or preview, and the default schema name (script uses `dbo`).
  - Workload names in the left rail/Create hub (e.g. "Real-Time Intelligence", "Databases", "Fabric IQ") and the **Copy job** item name.
  - NYC TLC file URLs still resolve (`d37ci6vzurychx.cloudfront.net`).
  - Data agent and Copilot: GA status and which capacity sizes they need.

## Hook (0:00–0:30)
"In the next 40 minutes you'll go from never having opened Microsoft Fabric to a working data platform. Real taxi data lands in a lakehouse. A notebook cleans it. A warehouse queries it. A pipeline runs it every morning. And a Power BI report reads it without an import. I'll build every step on screen, in a free trial, and I'll explain the five ideas that make the rest of Fabric make sense. If you use Power BI, Azure Data Factory or Synapse today, this is the map of where all of that now lives."

## Script

### 0:30 What Fabric actually is
[ON SCREEN: "Fabric = one SaaS platform for data, analytics and BI"]

Let's start with the plain definition.

Microsoft Fabric is one software-as-a-service platform for the whole data job. That covers getting data in, storing it, transforming it, querying it, running real-time analytics, data science, and reporting.

Before Fabric, on Azure, you'd stitch that together yourself:
- Data Factory to move data.
- A storage account for files.
- Synapse or Databricks for Spark.
- A SQL pool for the warehouse.
- Power BI on top.

Each had its own security, its own billing and its own copy of the data.

Fabric puts all of that in one place, with three things shared:
- [ON SCREEN: 1. One storage layer: OneLake] One storage layer, called OneLake.
- [ON SCREEN: 2. One bill: a capacity] One way to pay, called a capacity.
- [ON SCREEN: 3. One place to work: workspaces] One place to organize work: workspaces, which are the same workspaces you know from Power BI.

If you've used Power BI in a browser, you've already been inside Fabric. Fabric grew out of the Power BI service. That's why it looks familiar.

What it isn't: a new database engine you install, or something you manage servers for. There are no clusters to size by hand and no storage accounts to create. You buy capacity, and everything inside runs on it.

### 3:00 The five ideas that explain everything
[ON SCREEN: Tenant → Capacity → Workspace → Item → OneLake]

If you understand these five words, the rest of Fabric is detail.

**One: tenant.** That's your organization's Microsoft account, the same one behind your company email. Fabric is turned on per tenant by an admin. Each tenant gets exactly one OneLake.

**Two: capacity.** This is what you pay for. A capacity is a pool of compute measured in capacity units, or CUs. The sizes go F2, F4, F8, all the way to F2048. The number is the CU count. An F64 has 64 CUs.

Every workload draws from that pool:
- Spark jobs
- Warehouse queries
- Power BI refreshes
- Pipelines

You don't pay per query. You pay for the size of the pool.

Two more things to know about the pool:
- **Smoothing and bursting.** A heavy job can borrow more than your size for a moment, and the cost is spread over time. A daily refresh won't fail just because it spikes.
- **Throttling.** If you're over your size for long, Fabric starts to slow things down.

[ON SCREEN: "Capacity = how big. Smoothing = you can spike. Throttling = you spiked too long."]

**Three: workspace.** A workspace is a folder for a project or a team. It's where you set permissions and attach a capacity.

There are four roles:
- Admin
- Member
- Contributor
- Viewer

Most teams keep separate workspaces per stage, like dev, test and prod.

**Four: item.** Everything you create in a workspace is an item:
- A lakehouse
- A warehouse
- A notebook
- A pipeline
- A semantic model
- A report

When people say "Fabric has a lot of things", they mean a lot of item types.

**Five: OneLake.** This is the big one. [ON SCREEN: "OneLake = OneDrive for data"]

OneLake is a single data lake for your whole tenant. Every lakehouse, every warehouse and every real-time database writes its tables into OneLake, and they write them in one open format: Delta Parquet.

That has a huge consequence. The same table can be read by Spark, by T-SQL, by Power BI, and even by tools outside Microsoft, without copying it.

[ON SCREEN: one Delta table in the middle; Spark, SQL, Power BI and KQL arrows all pointing at it]

Two features build on that:
- **Shortcuts.** A shortcut is a pointer to data that lives somewhere else: another workspace, Azure Data Lake Storage, Amazon S3 or Google Cloud Storage. It shows up in your lakehouse like a normal folder or table, but nothing is copied.
- **Mirroring.** Mirroring keeps a near-real-time replica of an operational database in OneLake. That covers Azure SQL, Snowflake, Cosmos DB and others, and you don't build a pipeline.

So: tenant, capacity, workspace, item, OneLake. Keep those five in your head.

### 8:00 The workloads, in one minute each
[ON SCREEN: Create hub, grouped by workload]

When you click **Create** in Fabric, items are grouped by workload. Here's what each one is for, in plain words.

- **Data Factory.** Moving data:
  - **Pipelines** orchestrate steps: copy this, then run that notebook, then email me if it fails.
  - **Dataflow Gen2** is Power Query in the browser, so low-code transforms.
  - **Copy job** is the simplest way to copy data from A to B on a schedule.
- **Data Engineering.** Spark:
  - Lakehouses, notebooks and Spark job definitions.
  - Python, PySpark, Spark SQL, Scala and R.
- **Data Warehouse.** A full T-SQL warehouse:
  - You can insert, update, delete and run multi-table transactions.
  - If your team lives in SQL, this is home.
- **Real-Time Intelligence.** Streaming and logs:
  - Eventstreams bring events in.
  - Eventhouses store them in KQL databases, which are built for fast queries on time-stamped data.
  - Activator triggers actions when something happens.
- **Data Science.** Machine learning: notebooks, experiments and models, tracked with MLflow.
- **Databases.** SQL database in Fabric is an operational database for apps, and it automatically mirrors into OneLake for analytics.
- **Power BI.** Semantic models, reports, dashboards. The part most of you already know.

On top of all of that, there's Copilot, and there are data agents, which let people ask questions of your data in plain English. We'll touch on those near the end.

Today we'll use five of these: a lakehouse, a notebook, a warehouse, a pipeline and Power BI. That's the core path most teams start with.

### 12:00 Demo: start a trial and create a workspace
[DEMO: go to app.fabric.microsoft.com, sign in with a work account]

Go to app.fabric.microsoft.com and sign in with a work or school account. Personal Outlook or Gmail accounts don't work here.

[DEMO: top-right profile icon → "Free trial" / "Start trial" → confirm region]

Click your profile picture in the top right, then **Start trial**. The trial gives you a capacity to play with for a limited time. Check the description for the current length and size.

If you don't see the button, your admin has turned trials off. Send them this video.

[DEMO: left rail → Workspaces → + New workspace → name "Fabric 40 Min" → Advanced → License mode: Trial → Apply]

Now create a workspace:
1. Workspaces, then **New workspace**.
2. Call it "Fabric 40 Min".
3. Open **Advanced** and make sure the licence mode is **Trial**, or **Fabric capacity** if your company has one. This is the step people miss. If the workspace is on Pro licence mode, you won't see most Fabric items.

[ON SCREEN: "No lakehouse option? Your workspace isn't on a Fabric capacity."]

### 15:00 Demo: create a lakehouse and load your first file
[DEMO: workspace → + New item → Lakehouse → name "lh_taxi" → tick "Lakehouse schemas" if shown → Create]

New item, Lakehouse. Call it `lh_taxi`. If you see a tick box for lakehouse schemas, turn it on. It lets you group tables, like `dbo` or `sales`, the same way a database does.

[ON SCREEN: Lakehouse explorer, "Tables" and "Files"]

A lakehouse has two areas:
- **Tables:** managed Delta tables. These show up for SQL and Power BI.
- **Files:** anything else, like CSVs, JSON, images, raw dumps. Files are just files until you turn them into tables.

Let's do it the no-code way first.

[DEMO: download taxi_zone_lookup.csv from https://d37ci6vzurychx.cloudfront.net/misc/taxi_zone_lookup.csv to your desktop]

I've downloaded the New York taxi zone lookup. It's a small public CSV that maps a zone ID to a borough and a zone name.

[DEMO: Files → … → Upload → Upload files → select taxi_zone_lookup.csv → Upload]

Under **Files**, click the three dots, Upload, Upload files, and pick the CSV.

[DEMO: right-click the file → Load to Tables → New table → name "dim_zone" → header: on → Load]

Now right-click the file, **Load to Tables**, **New table**. Call it `dim_zone`. First row is the header. Load.

[DEMO: expand Tables → dbo → dim_zone → table preview]

And there it is: a Delta table, under Tables. You can preview it right here.

Behind the scenes, Fabric wrote Parquet files plus a `_delta_log` folder into OneLake. That folder is what makes it a table and not just a pile of files. It records every change, which gives you ACID transactions and time travel.

[DEMO: dim_zone → … → Properties → show ABFS path]

If you open the table's properties, you'll see a path that starts with `abfss://` and ends in `onelake.dfs.fabric.microsoft.com`. That's the OneLake address. Any tool that can read Azure Data Lake Storage can read this table.

### 21:00 Demo: a notebook that loads and cleans a month of trips
[DEMO: lakehouse ribbon → Open notebook → New notebook → rename "nb_load_trips"]

Clicking is fine for one file. For real pipelines you want code you can rerun. From the lakehouse, open a new notebook. Because we opened it from here, `lh_taxi` is attached as the default lakehouse. You'll see it on the left.

First cell. We'll pull one month of yellow taxi trips from the public NYC TLC site straight into the Files area.

[DEMO: cell 1]
```python
import os, requests

month = "2024-01"
url = f"https://d37ci6vzurychx.cloudfront.net/trip-data/yellow_tripdata_{month}.parquet"
target_dir = "/lakehouse/default/Files/landing/yellow"
os.makedirs(target_dir, exist_ok=True)

r = requests.get(url, timeout=300)
r.raise_for_status()
with open(f"{target_dir}/yellow_{month}.parquet", "wb") as f:
    f.write(r.content)
print("saved", len(r.content) // 1_000_000, "MB")
```

`/lakehouse/default/` is a local path the notebook mounts for your default lakehouse. Anything you write there lands in OneLake.

Run it. That's about 50 megabytes and roughly three million trips.

Cell two. Read it with Spark, clean it, and write a table.

[DEMO: cell 2]
```python
from pyspark.sql import functions as F

raw = spark.read.parquet("Files/landing/yellow/")

trips = (
    raw
    .select(
        F.col("tpep_pickup_datetime").alias("pickup_ts"),
        F.col("tpep_dropoff_datetime").alias("dropoff_ts"),
        F.col("PULocationID").cast("int").alias("pickup_zone_id"),
        F.col("DOLocationID").cast("int").alias("dropoff_zone_id"),
        F.col("passenger_count").cast("int").alias("passengers"),
        F.col("trip_distance").cast("double").alias("distance_mi"),
        F.col("fare_amount").cast("double").alias("fare"),
        F.col("tip_amount").cast("double").alias("tip"),
        F.col("total_amount").cast("double").alias("total"),
    )
    .where("distance_mi > 0 AND fare >= 0 AND dropoff_ts > pickup_ts")
    .where(F.col("pickup_ts") >= "2024-01-01")
    .where(F.col("pickup_ts") < "2024-02-01")
    .withColumn("pickup_date", F.to_date("pickup_ts"))
    .withColumn("duration_min",
        (F.unix_timestamp("dropoff_ts") - F.unix_timestamp("pickup_ts")) / 60)
)

trips.write.mode("overwrite").format("delta").saveAsTable("trips")
print(trips.count())
```

What's happening:
- We rename the columns to something humans can read.
- We fix the types.
- We throw out the obvious junk: zero-distance trips, negative fares, and trips that end before they start.
- The source file also has a few pickups dated in other months, so we keep January only.
- Then `saveAsTable` writes a managed Delta table called `trips`.

[ON SCREEN: "saveAsTable → shows under Tables. .save('Files/…') → just files."]

Refresh Tables on the left, and `trips` is there next to `dim_zone`.

One quick Spark SQL check, to show you can mix languages in one notebook:

[DEMO: cell 3]
```sql
%%sql
SELECT z.Borough, COUNT(*) AS trips, ROUND(AVG(t.fare), 2) AS avg_fare
FROM trips t
JOIN dim_zone z ON t.pickup_zone_id = z.LocationID
GROUP BY z.Borough
ORDER BY trips DESC
```

Manhattan wins, no surprise. The point is that this is the same table we'll now hit from T-SQL and Power BI, with no copy.

### 26:00 Demo: the SQL analytics endpoint and a warehouse
[DEMO: workspace → click "lh_taxi" SQL analytics endpoint item (same name, type "SQL analytics endpoint")]

Back in the workspace, look at the items. Next to the lakehouse there's a second item with the same name, of type **SQL analytics endpoint**. Every lakehouse gets one automatically.

It lets you query the lakehouse tables with T-SQL. It's read-only: you can create views and run SELECTs, but you can't INSERT or UPDATE through it. Writes to a lakehouse go through Spark.

[DEMO: New SQL query]
```sql
SELECT TOP 10 pickup_date, COUNT(*) AS trips, SUM(total) AS revenue
FROM dbo.trips
GROUP BY pickup_date
ORDER BY revenue DESC;
```

Now, when do you want a warehouse instead? When your team wants to write with SQL: inserts, updates, merges, stored procedures, and transactions that cover several tables at once.

[DEMO: + New item → Warehouse → name "wh_taxi" → Create → New SQL query]

Let's create one, `wh_taxi`, and build a summary table in it by reading straight from the lakehouse. Inside the same workspace, you can use three-part names: item, schema, table.

```sql
CREATE TABLE dbo.daily_borough
AS
SELECT
    t.pickup_date,
    z.Borough          AS borough,
    COUNT(*)           AS trip_count,
    SUM(t.total)       AS revenue,
    AVG(t.duration_min) AS avg_duration_min
FROM lh_taxi.dbo.trips    AS t
JOIN lh_taxi.dbo.dim_zone AS z
  ON t.pickup_zone_id = z.LocationID
GROUP BY t.pickup_date, z.Borough;

SELECT TOP 20 * FROM dbo.daily_borough ORDER BY revenue DESC;
```

That `CREATE TABLE AS SELECT` read from the lakehouse and wrote into the warehouse. Both store their data in OneLake as Delta, so this is just one engine reading another's files.

[ON SCREEN: "Lakehouse = Spark writes, SQL reads. Warehouse = SQL reads AND writes."]

We'll go much deeper on lakehouse versus warehouse in next week's video. For now: if your team writes Python, start with a lakehouse. If they write T-SQL, start with a warehouse. You can use both.

### 29:00 Demo: schedule it with a pipeline
[DEMO: + New item → Data pipeline → name "pl_daily_taxi" → Create]

Right now this only runs when I click. Let's make it run every morning.

Create a **Data pipeline** called `pl_daily_taxi`.

[DEMO: Activities tab → Notebook → Settings → Workspace: "Fabric 40 Min", Notebook: "nb_load_trips"]

Add a **Notebook** activity and point it at `nb_load_trips`.

[DEMO: Activities → Script (or Stored procedure) → Connection: wh_taxi → script: TRUNCATE TABLE dbo.daily_borough; INSERT INTO dbo.daily_borough SELECT …]

Then add a **Script** activity on the warehouse that rebuilds the summary:

```sql
TRUNCATE TABLE dbo.daily_borough;

INSERT INTO dbo.daily_borough (pickup_date, borough, trip_count, revenue, avg_duration_min)
SELECT t.pickup_date, z.Borough, COUNT(*), SUM(t.total), AVG(t.duration_min)
FROM lh_taxi.dbo.trips AS t
JOIN lh_taxi.dbo.dim_zone AS z ON t.pickup_zone_id = z.LocationID
GROUP BY t.pickup_date, z.Borough;
```

[DEMO: drag the green "on success" handle from Notebook to Script]

Connect them with the green **on success** arrow, so the SQL only runs if the notebook worked.

[DEMO: Home → Schedule → On → Daily at 06:00 → time zone → Apply. Then Run.]

Then Schedule, daily at 6 a.m., and Apply. Click **Run** once to test.

[DEMO: Output pane showing both activities "Succeeded"]

Both green. That's orchestration done. In a real project you'd parameterize the month and add a failure path that sends a Teams message or an email. Pipelines have activities for both.

### 32:00 Demo: Power BI on Direct Lake
[DEMO: open lh_taxi → ribbon → New semantic model → name "sm_taxi" → select trips, dim_zone → Confirm]

Now the payoff. From the lakehouse, click **New semantic model**. Call it `sm_taxi` and pick the `trips` and `dim_zone` tables.

This model uses a storage mode called **Direct Lake**. Here's why it matters:
- **Import mode** copies data into Power BI and needs refreshing.
- **DirectQuery** sends every visual's query to the source, which can be slow.
- **Direct Lake** has Power BI read the Delta files in OneLake directly into memory. It's close to import speed, with no scheduled data copy. When the table changes, the model picks up the new data.

[ON SCREEN: Import = copy + refresh · DirectQuery = live but slower · Direct Lake = reads OneLake Delta files directly]

[DEMO: model view → drag dim_zone[LocationID] onto trips[pickup_zone_id] → many-to-one]

In the model view, drag `LocationID` from `dim_zone` onto `pickup_zone_id` in `trips` to create the relationship.

[DEMO: trips table → New measure]

Add three measures:

```DAX
Trips = COUNTROWS ( trips )

Revenue = SUM ( trips[total] )

Avg Fare per Trip = DIVIDE ( [Revenue], [Trips] )
```

[DEMO: New report → card with Trips, line chart pickup_date × Revenue, bar chart dim_zone[Borough] × Trips, slicer on Borough → Save as "rpt_taxi"]

New report:
- A card for trips.
- Revenue by day as a line.
- Trips by borough as a bar.
- A borough slicer.

Save it.

That report is reading the same Delta table the notebook wrote. One copy of the data, from raw file to chart.

### 36:00 Security, Copilot and data agents, briefly
[ON SCREEN: Workspace roles · Item sharing · OneLake security · Sensitivity labels]

Three things before you take this to work.

**Security** has layers:
- Workspace roles decide who can build.
- Item sharing lets you give someone one report without the whole workspace.
- Inside the data, you can restrict rows, columns and folders. In OneLake that's OneLake security; in SQL it's normal row- and column-level security.
- Sensitivity labels from Microsoft Purview follow the data into exports.

**Governance.** Group workspaces into **domains** by business area, and use the OneLake catalog to find and endorse trusted items.

**AI.** Copilot can write notebook code, SQL and DAX for you, and build report pages. A **data agent** sits on top of a lakehouse, warehouse or semantic model and answers plain-English questions, like "What was revenue in Queens last week?", by writing the query itself. Search for data agents is growing faster than anything else in Fabric right now. I've got a full video on it in a few weeks.

### 38:00 Pricing in one minute, and what to learn next
[ON SCREEN: F2 … F64 … F2048 · pay-as-you-go vs reserved]

**Pricing in one minute.** You pay for capacity size, by the hour if pay-as-you-go, or less with a one-year reservation. Storage in OneLake is billed separately and is cheap compared to compute.

The smallest, an F2, costs a few hundred dollars a month if you leave it on all month. You can pause a pay-as-you-go capacity when you're not using it.

F64 is the line that matters for Power BI. At F64 and above, people with a free licence can view reports. Below it, viewers still need Power BI Pro.

Check the description for current prices in your region.

[ON SCREEN: what we built: CSV → Lakehouse table · URL → Notebook → Delta · Lakehouse → Warehouse (CTAS) · Pipeline schedule · Direct Lake report]

**What we built:**
- A lakehouse with two Delta tables.
- A notebook that loads and cleans data.
- A warehouse summary built with T-SQL.
- A pipeline that runs both every morning.
- A Direct Lake report.

That's the backbone of most Fabric projects.

**Where to go next:**
- Next week: lakehouse versus warehouse versus eventhouse, so you pick the right one the first time.
- After that: medallion architecture, where we turn today's single notebook into bronze, silver and gold layers that scale.

### 39:30 Outro
If this saved you a week of clicking around, subscribe, because this whole channel is Fabric, updated for 2026. Drop a comment with the thing in Fabric that confuses you most. That's how I pick the next video. See you next week on [CHANNEL].

## Chapters
```
0:00 What you'll build in 40 minutes
0:30 What Microsoft Fabric actually is
3:00 The 5 ideas: tenant, capacity, workspace, item, OneLake
8:00 Every workload in one minute
12:00 Start a trial + create a workspace
15:00 Create a lakehouse + load a CSV to a table
21:00 Notebook: load and clean 3M taxi trips (PySpark)
26:00 SQL analytics endpoint + Warehouse (T-SQL CTAS)
29:00 Schedule it with a Data pipeline
32:00 Power BI on Direct Lake + DAX measures
36:00 Security, Copilot and data agents
38:00 Pricing in 60 seconds + what to learn next
39:30 Outro
```

## Description + tags
**Microsoft Fabric in 40 minutes: a 2026 beginner crash course.** Learn what Microsoft Fabric is, how OneLake, capacities and workspaces fit together, then build a lakehouse, notebook, warehouse, pipeline and Direct Lake Power BI report from scratch on real NYC taxi data.

What you'll learn:
- The 5 core ideas: tenant, capacity, workspace, item, OneLake
- Every Fabric workload in plain English
- Lakehouse vs SQL analytics endpoint vs Warehouse
- PySpark + Spark SQL in a Fabric notebook
- Scheduling with Data pipelines
- Direct Lake semantic models and DAX measures

Data: NYC TLC Trip Record Data (public). Code: [link to repo/gist]. Prices change; check the Azure Fabric pricing page for your region.

**Tags:** microsoft fabric, microsoft fabric tutorial, what is microsoft fabric, fabric for beginners, microsoft fabric 2026, onelake, fabric lakehouse, fabric warehouse, direct lake, power bi fabric, fabric data pipeline, fabric notebook, pyspark fabric, dp-600, dp-700

## Shorts cutdowns

**Short 1: "Fabric in 5 words" (≈40s)**
[ON SCREEN: "Microsoft Fabric in 5 words"]
"Microsoft Fabric makes sense once you know five words.
[ON SCREEN: TENANT] Tenant: your company. One per org.
[ON SCREEN: CAPACITY] Capacity: what you pay for. A pool of compute, F2 up to F2048.
[ON SCREEN: WORKSPACE] Workspace: a folder for a team, with permissions.
[ON SCREEN: ITEM] Item: anything you build. Lakehouse, notebook, report.
[ON SCREEN: ONELAKE] OneLake: one data lake for the whole company, in Delta format, so Spark, SQL and Power BI all read the same copy.
Full 40-minute course on the channel."

**Short 2: "Why Direct Lake matters" (≈35s)**
[ON SCREEN: "Import vs DirectQuery vs Direct Lake"]
"Power BI used to make you choose.
[ON SCREEN: IMPORT = fast, but copies + refreshes] Import: fast, but it copies your data and you schedule refreshes.
[ON SCREEN: DIRECTQUERY = live, but slow] DirectQuery: live, but every click hits the source.
[ON SCREEN: DIRECT LAKE = reads OneLake files directly] In Fabric, Direct Lake reads the Delta files in OneLake straight into memory. Near-import speed, no scheduled copy.
If your data's already in a Fabric lakehouse, this is the default to try first."

**Short 3: "No Lakehouse button?" (≈25s)**
[ON SCREEN: "Can't create a Lakehouse in Fabric?"]
"Can't find the Lakehouse option in Fabric? Ninety percent of the time it's this.
[DEMO: Workspace settings → License info] Open workspace settings, then License info.
[ON SCREEN: Pro ❌ → Trial / Fabric capacity ✅] If it says Pro, you only get Power BI items. Switch it to Trial or Fabric capacity. Every item type appears.
Save this for the next time someone in Teams asks."

## LinkedIn post
**Diagram:** one Delta table in the centre labelled "OneLake (1 copy)". Four arrows in: Spark notebook, T-SQL warehouse, Power BI Direct Lake, KQL.

> Most Microsoft Fabric explainers start with the workloads. I think that's backwards.
>
> Start with OneLake. Every lakehouse, warehouse and eventhouse writes Delta Parquet into one lake per tenant. So:
> → a notebook writes a table
> → T-SQL reads it with a three-part name
> → Power BI reads the same files on Direct Lake
>
> No copies, no refresh to keep in sync.
>
> Once that clicks, "lakehouse or warehouse?" stops being a platform decision. It's a language decision. Python team → lakehouse. T-SQL team → warehouse. Both can read each other.
>
> I built the whole path (CSV → notebook → warehouse → pipeline → Direct Lake report) in a 40-minute beginner course. Link in comments.
>
> What confused you most when you first opened Fabric?
