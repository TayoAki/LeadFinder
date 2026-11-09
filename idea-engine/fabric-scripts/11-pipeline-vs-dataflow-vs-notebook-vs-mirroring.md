# Wk 11: Pipeline vs Dataflow Gen2 vs Notebook vs Mirroring: When to Use Each in Microsoft Fabric

- **Runtime target:** ~20 min
- **Pillar:** 2 — Decision videos ("X vs Y")
- **Target keywords:** dataflow gen2 (140/mo, 1.25×) · fabric mirroring (1,000/mo, 1.03×) · fabric data factory (210/mo, 1.30×) · fabric pipeline (50/mo, 1.33×) · fabric notebook (260/mo, 1.15×) · fabric shortcuts (70/mo)
- **Proven format:** the "pipeline vs dataflow vs shortcut vs notebook" video by the channel we model got 56K views.
- **Title options:**
  1. Pipeline vs Dataflow Gen2 vs Notebook vs Mirroring: When to Use Each (2026)
  2. 4 Ways to Load Data into Microsoft Fabric (Same Task, Compared)
  3. Stop Using the Wrong Fabric Tool: The 1-Minute Decision Flowchart
- **Thumbnail:** four tool icons in a row with a "?" over them, plus "WHICH ONE?" as text.
- **Verify before recording:**
  - **Mirroring sources:**
    - Which are GA vs preview: Azure SQL DB, Azure SQL MI, SQL Server, Azure Cosmos DB, Snowflake, Azure Databricks catalog, Azure Database for PostgreSQL, open mirroring, others added since.
    - Whether a primary key is still required for Azure SQL tables.
  - **Mirroring cost:** replication compute is free, and storage is free up to 1 TB per CU of the SKU. Confirm.
  - **Copy job:** GA status and current features (incremental copy, CDC, upsert).
  - **Python notebooks (single-node, non-Spark):**
    - GA status.
    - The `/lakehouse/default/` mount path.
    - Whether `deltalake` is preinstalled.
  - **UI labels:**
    - "Data pipeline" vs "Pipeline".
    - "Data destination" in Dataflow Gen2.
    - The "Dataflow Gen2 (CI/CD)" item type.
  - **CU figures:** do NOT quote anyone else's. Record the real CU(s) from your own four runs (see the 14:30 segment).

## Hook (0:00–0:30)
"Fabric gives you at least four ways to get data in: pipelines, Dataflow Gen2, notebooks and mirroring. Plus shortcuts and copy job. Pick the wrong one and you pay for it twice: once in capacity, once in maintenance. So I did the same small job four ways, measured what each one cost, and turned it into a one-minute flowchart. By the end, you'll know which tool to reach for, and why."

## Script

### 0:30 — The job we'll do four times
"Here's the task. We have an orders file. It has duplicate rows, which is realistic. We want a clean Delta table called `orders_clean`: one row per order, plus an `order_year` column.

[ON SCREEN: orders.csv → remove duplicate order_id → add order_year → orders_clean (Delta table)]

Columns are `order_id`, `customer_id`, `order_date` and `amount`. It's sitting in a lakehouse under `Files/raw/orders.csv`. For the mirroring version, the same table lives in an Azure SQL database.

Small job. That's on purpose. Most of your work is small jobs, and the wrong tool on a small job is where waste hides."

### 1:30 — The tools in one sentence each
"Before we build, one sentence each.

[ON SCREEN: each line appears as I say it]

A pipeline orchestrates. It moves data with the Copy activity and runs other things in order: notebooks, dataflows, stored procedures, with retries and alerts.

Dataflow Gen2 is Power Query in Fabric. Low-code transforms, hundreds of connectors, and it writes to a destination.

A notebook is code. Spark with PySpark or Spark SQL for big data, or a single-node Python notebook for small data.

Mirroring keeps a near real-time copy of an operational database in OneLake as Delta tables. No pipelines to build.

And two honorable mentions. A shortcut doesn't copy anything; it points at data where it already lives. And copy job is the simplest way to move data on a schedule, including incremental loads, without building a pipeline."

### 3:00 — Way 1: Dataflow Gen2
"Let's start low-code.

[DEMO: Workspace → New item → Dataflow Gen2 → Get data → Lakehouse → pick the lakehouse → Files → raw → orders.csv → Transform data]

Promote headers if it didn't already. Set the types: `order_date` as Date, `amount` as Decimal.

[DEMO: select order_id column → right-click → Remove duplicates]

Remove duplicates on `order_id`.

[DEMO: Add column → Date → Year → Year, on order_date. Rename to order_year]

Add the year.

Here's what that looks like in M, if you open the advanced editor:

```
Deduped  = Table.Distinct(Typed, {"order_id"}),
WithYear = Table.AddColumn(Deduped, "order_year", each Date.Year([order_date]), Int64.Type)
```

[DEMO: Data destination (bottom right) → Lakehouse → new table orders_clean → Update method: Replace → Save settings → Save & run]

Set the destination to the lakehouse, a new table, replace. Save and run.

Who's this for? Anyone who knows Power Query from Power BI or Excel. That's a huge number of people, and it's the main reason Dataflow Gen2 exists.

Watch-outs. On big data, it's usually not the cheapest option in CUs. Measure it. And complex logic gets hard to read in the UI after twenty steps."

### 6:00 — Way 2: Notebook
"Now code.

[DEMO: Workspace → New item → Notebook → Add data items → attach the lakehouse as default]

Here's the whole thing in PySpark:

```python
from pyspark.sql import functions as F

df = (spark.read
      .option("header", True)
      .option("inferSchema", True)
      .csv("Files/raw/orders.csv"))

clean = (df.dropDuplicates(["order_id"])
           .withColumn("order_year", F.year("order_date")))

clean.write.mode("overwrite").format("delta").saveAsTable("orders_clean")
```

Read the CSV. Drop duplicates on `order_id`. Add the year. Write a Delta table. Four steps, same as the dataflow.

[DEMO: Run all → open Tables → orders_clean → preview]

Now, for a file this size, Spark is overkill. Starting a Spark session takes time and compute. Fabric also has Python notebooks: one node, no Spark. Same job:

```python
import pandas as pd
from deltalake import write_deltalake

df = pd.read_csv("/lakehouse/default/Files/raw/orders.csv",
                 parse_dates=["order_date"])

clean = df.drop_duplicates(subset="order_id").copy()
clean["order_year"] = clean["order_date"].dt.year

write_deltalake("/lakehouse/default/Tables/orders_clean", clean, mode="overwrite")
```

[DEMO: New notebook → change language/environment to Python → attach lakehouse → run]

Who's this for? Anyone comfortable with Python or SQL. It's the most flexible tool, it's easy to put in Git, and for heavy transformations it's often the most efficient. The trade-off: someone on your team has to read code."

### 8:30 — Way 3: Pipeline
"Pipelines don't really transform. They move and they orchestrate. So here's the honest version of this job in a pipeline.

[DEMO: New item → Data pipeline → Copy data activity
Source: Lakehouse → Files/raw/orders.csv, DelimitedText, first row as header
Destination: Warehouse → table dbo.orders_raw → auto-create table]

Step one, a Copy activity loads the raw file into a warehouse table.

[DEMO: add a Script activity after Copy (on success) → connection: the warehouse → paste the SQL]

Step two, a Script activity runs T-SQL to build the clean table:

```sql
DROP TABLE IF EXISTS dbo.orders_clean;

CREATE TABLE dbo.orders_clean AS
SELECT order_id, customer_id, order_date, amount,
       YEAR(order_date) AS order_year
FROM (
    SELECT *,
           ROW_NUMBER() OVER (PARTITION BY order_id ORDER BY order_date DESC) AS rn
    FROM dbo.orders_raw
) AS t
WHERE rn = 1;
```

[DEMO: Validate → Run → Output tab shows both activities succeeded]

Notice what the pipeline is really doing: running step one, then step two, and stopping if step one fails. That's its job. In real life you'd usually have a pipeline call your notebook or your dataflow, on a schedule, with an alert on failure.

Who's this for? Anyone who's used Azure Data Factory or SSIS. It'll feel familiar. Use it as the conductor, not the orchestra."

### 11:00 — Way 4: Mirroring
"Last one. Here the orders live in an Azure SQL database, because that's where they're created.

[DEMO: Workspace → New item → Mirrored Azure SQL Database → new connection (server, database, auth) → select dbo.orders → Mirror database]

That's the setup. Fabric takes an initial snapshot, then keeps the copy in sync as rows change. It lands as Delta tables in OneLake, and you get a SQL analytics endpoint for free.

[DEMO: Monitor replication → rows replicated, status Running]

But mirroring doesn't transform. It's a copy. So where does the dedupe happen? Downstream. The lightest option is a view on the SQL analytics endpoint:

```sql
CREATE VIEW dbo.orders_clean AS
SELECT order_id, customer_id, order_date, amount,
       YEAR(order_date) AS order_year
FROM (
    SELECT *,
           ROW_NUMBER() OVER (PARTITION BY order_id ORDER BY order_date DESC) AS rn
    FROM dbo.orders
) AS t
WHERE rn = 1;
```

To be fair, in a real source system `order_id` is usually the primary key, so there wouldn't be duplicates to begin with. Mirroring gives you exactly what the source has.

Who's this for? When your source is a supported database and you want fresh data without building or maintaining any pipeline. At time of recording, the replication compute is free and mirrored storage is free up to a limit tied to your capacity size. That makes it the cheapest way in, when it fits."

### 13:00 — Honorable mentions: shortcuts and copy job
"Two more you should know.

[ON SCREEN: Shortcut = a pointer, no copy · Copy job = scheduled copy, incremental, no pipeline]

Shortcuts. If the data is already in ADLS, S3, Google Cloud Storage or another lakehouse, and it's already usable, don't copy it. Create a shortcut.

[DEMO: Lakehouse → Tables or Files → New shortcut → Azure Data Lake Storage Gen2 → pick folder]

It shows up like it's local. No pipeline, no copy, no OneLake storage for it.

Copy job. If you just need to move tables from A to B on a schedule, especially with incremental loads, copy job does it without building a pipeline.

[DEMO: New item → Copy job → source → destination → choose incremental copy → schedule]

It's the 'I just want the data over there' button."

### 14:30 — What each run cost
"Now the part you came for. I ran each version, then opened the Capacity Metrics app.

[DEMO: Capacity Metrics app → Compute → Items table → filter to today → CU(s) column]

[RECORDING NOTE: show the real CU(s) for each of your four runs, and the Spark vs Python notebook difference. Don't use outside figures. Say them as "on my capacity, for this file size".]

[ON SCREEN: a bar chart of CU seconds per method, from your own runs]

A few things hold in general, whatever your numbers show.

Mirroring's replication compute is free, so it's hard to beat when it fits.

A Spark session has a startup cost. On tiny data, a Python notebook avoids most of it.

Dataflow Gen2 is convenient, but it's often not the cheapest at volume. Check yours before you build fifty of them.

And a pipeline's cost is mostly whatever it calls, plus the Copy activity's data movement.

The point isn't my numbers. It's that you can measure this in ten minutes, so measure before you standardize."

### 16:30 — The decision flowchart
"Here's the flowchart. Screenshot this.

[ON SCREEN: flowchart, revealed one box at a time]

Question one: is the data already in cloud storage or another lakehouse, and usable as-is? Yes → shortcut. Don't copy it.

Question two: is the source a database that mirroring supports, and you want a fresh copy with no ETL? Yes → mirroring.

Question three: are you just moving data on a schedule, maybe incrementally, with no transformation? Yes → copy job.

Question four: you need to transform it. Who's building it? Power Query people and moderate data → Dataflow Gen2. Code people, big data or complex logic → notebook. Small data and code → Python notebook.

And on top of all of it: if you need steps in order, schedules, retries or alerts, wrap them in a pipeline.

[ON SCREEN: Shortcut → Mirroring → Copy job → Dataflow Gen2 / Notebook → wrapped in a Pipeline]"

### 18:30 — Mistakes I see
"Three mistakes, fast.

One: copying data that a shortcut could have pointed at. Now you pay to store it twice and keep it in sync.

Two: using a pipeline to do transformations with a long chain of activities. Put the logic in a notebook or a dataflow and let the pipeline call it.

Three: running Spark for a 10-megabyte file every fifteen minutes. That's what Python notebooks are for."

### 19:15 — Recap
"Shortcut if it's already there. Mirroring if it's a supported database. Copy job if you're just moving it. Dataflow Gen2 or a notebook when you need to transform it. A pipeline to run it all in order.

If you're still choosing where all this data should land, lakehouse, warehouse or eventhouse, I did a full video on that. It's right here."

## Chapters
0:00 Which Fabric tool should you use?
0:30 The job we'll do four times
1:30 Each tool in one sentence
3:00 Way 1: Dataflow Gen2
6:00 Way 2: Notebook (Spark and Python)
8:30 Way 3: Data pipeline
11:00 Way 4: Mirroring
13:00 Shortcuts and copy job
14:30 What each run cost (CU seconds)
16:30 The decision flowchart
18:30 Three common mistakes
19:15 Recap

## Description + tags
Pipeline vs Dataflow Gen2 vs Notebook vs Mirroring in Microsoft Fabric: when to use each, with the same task built four ways.
I measure the capacity (CU) cost of each in the Capacity Metrics app and give you a one-minute decision flowchart, plus where shortcuts and copy job fit.

Code from the video (PySpark, Python, T-SQL, Power Query M): [link]

Tags: dataflow gen2, fabric pipeline, fabric data factory, fabric notebook, fabric mirroring, microsoft fabric shortcuts, copy job fabric, pyspark fabric, python notebook fabric, microsoft fabric tutorial, fabric data engineering, fabric lakehouse, fabric capacity units

## Shorts cutdowns

**Short 1: "The 4-question flowchart" (≈45s)**
[ON SCREEN: "Which Fabric tool? 4 questions"]
"Which Fabric tool should you use to get data in? Four questions. Is the data already in cloud storage and usable? Shortcut. Don't copy it. Is it a supported database and you just want it fresh? Mirroring. Just moving it on a schedule? Copy job. Need to transform it? Power Query people use Dataflow Gen2; code people use a notebook. And if you need steps in order with retries and alerts, wrap it in a pipeline."
[ON SCREEN: "Shortcut → Mirroring → Copy job → Dataflow / Notebook → Pipeline"]

**Short 2: "Stop running Spark on tiny files" (≈35s)**
[ON SCREEN: "Spark for a 10 MB file?"]
"Running a Spark notebook on a 10-megabyte file every fifteen minutes? You're paying to start a Spark session every time. Fabric has Python notebooks: one node, no Spark. Pandas reads the file, drops duplicates, and writes a Delta table in a few lines. Save Spark for data that actually needs it."
[ON SCREEN: code snippet: pd.read_csv → drop_duplicates → write_deltalake]

**Short 3: "Mirroring doesn't transform" (≈35s)**
[ON SCREEN: "Mirroring ≠ ETL"]
"Fabric mirroring is great. It keeps a near real-time copy of your database in OneLake, and the replication compute is free. But it's a copy, not a transformation. You get exactly what the source has. So cleaning still happens downstream, in a view, a notebook or a dataflow. Mirror for freshness. Transform on top."
[ON SCREEN: "Source DB → Mirror (copy) → View / Notebook (clean)"]

## LinkedIn post
[Diagram: a flowchart. "Already in storage?" → Shortcut. "Supported DB?" → Mirroring. "Just moving it?" → Copy job. "Transform?" → Dataflow Gen2 / Notebook. A dashed box around everything labelled "Pipeline (orchestration)".]

The most expensive Fabric habit I see: copying data that didn't need to move.

Before you build a pipeline, ask in this order:
1. Is it already in ADLS, S3 or another lakehouse? → Shortcut.
2. Is it a database mirroring supports? → Mirror it.
3. Just moving it? → Copy job.
4. Need to transform? → Dataflow Gen2 or a notebook.

Pipelines are the conductor, not the orchestra. Put logic in notebooks or dataflows; let pipelines schedule, order and alert.

And measure. The Capacity Metrics app shows CU cost per item in minutes. I ran the same job four ways in my latest video, and the differences were worth checking before standardizing on anything.
