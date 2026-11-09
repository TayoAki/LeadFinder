# Backlog b08: Dataflow Gen2 vs Copy Job vs Pipeline: A Real CU Cost Test

## Evidence (why this piece)
- **r/MicrosoftFabric, "Microsoft says Dataflow Gen2 is cheaper, but our workload uses 20× more CUs": 52 comments, 60 upvotes.** The setup: on-prem SQL Server through an enterprise gateway, simple SELECTs, query folding working. They moved to Copy job/pipelines instead. This is the community's claim.
- **Microsoft's claim:** Microsoft published Dataflow Gen2 cost/performance benchmarks showing Gen2 faster and cheaper than Gen1 (Learn: "dataflow-gen2-cost-performance-benchmarks").
- **r/MicrosoftFabric, "Spark vs. Warehouse ETL CU consumption: my test results": 79 comments.** The community wants measured numbers; one user's test found Warehouse slightly above Spark.
- **r/MicrosoftFabric, "Is metadata-driven orchestration overkill with Copy Job?": 42 comments.**
- **r/MicrosoftFabric, "Data pipeline vs notebook for ingestion: how do you pull data and why?": 40 comments.**
- **Cost is the #2 theme by discussion** (48 posts, 1,636 comments).

**Rule for this piece:** we publish only numbers we measure. The table below is a template until the test is run. No invented results.

---

# Video: I Ran the Same Load 5 Ways in Fabric. Here's What Each Cost in CUs.

- **Runtime target:** 15 min
- **Pillar:** 2 (decision) + 6 (cost)
- **Target keywords:** dataflow gen2 (140, 1.25×), copy job, fabric pipeline (50, 1.33×), fabric capacity (390), microsoft fabric pricing (720, $50 CPC)
- **Title options:**
  1. Dataflow Gen2 vs Copy Job vs Pipeline: I Measured the CU Cost
  2. The Cheapest Way to Load Data in Microsoft Fabric (Tested)
  3. Is Dataflow Gen2 Really 20× More Expensive? I Tested It
- **Thumbnail:** "20× MORE?". Three bars labelled Dataflow / Copy job / Pipeline, the tallest with a question mark.
- **Verify before recording:**
  - Current billing meters for: Dataflow Gen2 (standard compute, high-scale/staging compute, Fast Copy), the Copy activity (data movement), Copy job, Spark and Python notebooks. Meter names and rates change; take them from the Learn pricing pages on the day.
  - The Capacity Metrics app's current pages and table names, and how long data takes to appear (typically minutes, not instant).
  - Whether Fast Copy is on by default in Dataflow Gen2, and its row/size thresholds.
  - The Learn benchmark page URL and what exactly it claims (Gen1 vs Gen2, which scenarios).
  - Capacity SKU used for the test (record it; results scale with SKU only for duration, not CU(s)).

## Test design (do this before filming)
**Goal:** the same rows from the same source to the same destination. Measure CU(s) per method from the Capacity Metrics app.

**Source** (pick one and keep it for every run):
- **A. Cloud:** Azure SQL Database (serverless, fixed vCores during the test) with a table of **10,000,000 rows**. Generate it with the script below.
- **B. On-prem (the 20× scenario):** the same table on SQL Server, reached through an on-premises data gateway. Run this variant second.

**Destination:** a new lakehouse table, overwritten each run. A separate lakehouse per method keeps items distinct in the metrics.

**Methods** (one item each, named so they're easy to find in Metrics):

| ID | Item | Settings |
|---|---|---|
| M1 | `test_dfg2_default` | Dataflow Gen2, SQL source, lakehouse destination, Replace, default staging |
| M2 | `test_dfg2_fastcopy` | Same as M1 with Fast Copy explicitly on (if not default) |
| M3 | `test_copyjob_full` | Copy job, full copy, same table |
| M4 | `test_pipeline_copy` | Pipeline with one Copy activity, default throughput settings |
| M5 | `test_nb_python` | Python notebook (single node) reading via `mssql-python`/`pyodbc` → Delta |

**Protocol:**
1. **Use a dedicated workspace on a capacity with nothing else running.**
2. **Run each method 3 times,** 20 minutes apart. Discard nothing; report the median.
3. **Record from Run history:** start, end, rows written.
4. **After 30 minutes, read the Capacity Metrics app:** filter to the workspace, item, and operation. Note total CU(s) per run.
5. **Repeat everything for source B (gateway).**
6. **Keep screenshots of every Metrics reading** for the video.

**Generate the source table (Azure SQL / SQL Server):**
```sql
CREATE TABLE dbo.sales_test (
  id BIGINT NOT NULL PRIMARY KEY,
  order_date DATE NOT NULL,
  customer_id INT NOT NULL,
  product_id INT NOT NULL,
  qty INT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  note VARCHAR(50) NULL
);
WITH n AS (
  SELECT TOP (10000000) ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS i
  FROM sys.all_objects a CROSS JOIN sys.all_objects b CROSS JOIN sys.all_objects c
)
INSERT dbo.sales_test
SELECT i,
       DATEADD(DAY, i % 1460, '2022-01-01'),
       i % 50000,
       i % 2000,
       1 + i % 7,
       CAST((i % 10000) / 10.0 AS DECIMAL(12,2)),
       CONCAT('n', i % 100)
FROM n;
```

**M5 notebook (Python, single node):**
```python
import pyodbc, pandas as pd, deltalake as dl
conn = pyodbc.connect(
    "Driver={ODBC Driver 18 for SQL Server};Server=<server>.database.windows.net;"
    "Database=<db>;Encrypt=yes;UID=<user>;PWD=" + notebookutils.credentials.getSecret("<kv-url>", "sql-pwd"))
chunks = pd.read_sql("SELECT * FROM dbo.sales_test", conn, chunksize=1_000_000)
path = "/lakehouse/default/Tables/sales_test_nb"
first = True
for df in chunks:
    dl.write_deltalake(path, df, mode="overwrite" if first else "append")
    first = False
```

**Results table (fill in; do not publish until measured):**

| Method | Source | Median duration | Median CU(s) | CU(s) per 1M rows | Relative to cheapest |
|---|---|---|---|---|---|
| M1 Dataflow Gen2 default | Cloud | ___ | ___ | ___ | ___× |
| M2 Dataflow Gen2 Fast Copy | Cloud | ___ | ___ | ___ | ___× |
| M3 Copy job | Cloud | ___ | ___ | ___ | ___× |
| M4 Pipeline Copy | Cloud | ___ | ___ | ___ | ___× |
| M5 Python notebook | Cloud | ___ | ___ | ___ | ___× |
| M1 Dataflow Gen2 default | Gateway | ___ | ___ | ___ | ___× |
| M3 Copy job | Gateway | ___ | ___ | ___ | ___× |
| M4 Pipeline Copy | Gateway | ___ | ___ | ___ | ___× |

**Then convert CU(s) to money.** Show the formula on screen: `CU(s) ÷ 3600 × price per CU-hour (your region, pay-as-you-go)`. Read the price from the Azure pricing page on the day.

## Hook (0:00–0:30)
"Microsoft says Dataflow Gen2 is cheaper. A team on Reddit says their Dataflow Gen2 used twenty times more capacity than before. Somebody's numbers are wrong, or they're measuring different things. So I loaded the same ten million rows five different ways and read the bill for each from the Capacity Metrics app. By the end you'll know which tool to use for plain data movement, and how to run this test on your own data."

## Script

### 0:30 The two claims
"Claim one, from Microsoft's docs: benchmarks showing Dataflow Gen2 faster and cheaper than Gen1. [ON SCREEN: Learn page title]

Claim two, from the community: a plain SQL Server ingestion through a gateway, query folding working, about twenty times more CUs on Gen2. That thread had over 50 comments. [ON SCREEN: thread title, no username]

Both can be true. Benchmarks are specific scenarios, and your workload is a different scenario. So let's measure."

### 1:30 How Fabric bills each tool (in plain words)
"Every tool spends capacity units, CUs, but on different meters. [ON SCREEN: four boxes]

Dataflow Gen2 pays for how long the Power Query engine runs, plus staging and Fast Copy when they're used.
The Copy activity in a pipeline pays for data movement: throughput over time.
Copy job is built on the same movement engine.
Notebooks pay for the compute you hold while the session is alive, including idle time.

So 'which is cheapest' really means 'which finishes the job using the least engine time on its meter.' That's why we measure."

### 3:00 The setup
"Source: an Azure SQL database with a ten-million-row sales table. Here's the script that generates it. [ON SCREEN: SQL] Destination: a lakehouse table, overwritten each run.

Five methods, each a separate item so they're easy to find in the metrics app. [ON SCREEN: M1–M5 table]

Three runs each, median reported, nothing else running on the capacity. Then I repeat it through an on-prem gateway, because that's where the 20× report came from."

### 4:30 Building each one (fast)
"[DEMO: M1] Dataflow Gen2: Get data, Azure SQL, pick the table, no transforms, destination lakehouse, Replace. Publish, refresh.

[DEMO: M2] Same dataflow, Fast Copy setting confirmed on.

[DEMO: M3] Copy job: source, table, destination, full copy. Run.

[DEMO: M4] Pipeline, one Copy activity, defaults. Run.

[DEMO: M5] Python notebook. Read in chunks of one million rows, write Delta. [ON SCREEN: code]"

### 7:00 Reading the Capacity Metrics app
"Wait about 30 minutes; metrics aren't real time. Open the Capacity Metrics app. [DEMO: Compute page → filter workspace → Items table]

Each item shows CU(s): capacity-unit seconds. Drill into the time point to see each operation. Note the CU(s) for each run. That's the number we compare, not duration. A tool can be slower and still cheaper."

### 8:30 Results: cloud source
[ON SCREEN: results table, filled in from the test]
"[RECORDING NOTE: read the measured numbers here. Say which was cheapest per million rows and by how much. If Dataflow Gen2 lands close to the others, say so. If it's far off, say by how much.]"

### 10:00 Results: through the gateway
[ON SCREEN: gateway rows]
"[RECORDING NOTE: compare with the cloud runs. If Gen2 through the gateway jumps relative to Copy, that supports the community report. Name the likely reason only if the metrics show it, e.g. long engine time while the gateway streams rows.]"

### 11:30 What the numbers mean for you
"Here's the rule I'd take away, and you can check it against the table. [ON SCREEN: three rules]

For plain movement with no transforms, use the tool built for movement: Copy job or a Copy activity.
Use Dataflow Gen2 when you need Power Query transforms that people can maintain without code.
Use a notebook when you're already paying for a session or you need custom logic. Keep sessions short."

### 12:30 Run it on your own data
"Your source, your gateway and your capacity will give different numbers. Take the protocol from the description: one dedicated workspace, one item per method, three runs, median CU(s) from the metrics app. It takes an afternoon and it settles the argument for your team."

### 13:30 Outro
"If you run it, post your numbers in the comments with your source type and row count. I'll pin the best ones. Subscribe to [CHANNEL] for the next test."

## Chapters
0:00 Microsoft vs the community
0:30 The two claims
1:30 How each tool is billed
3:00 Test setup
4:30 Building the 5 methods
7:00 Reading Capacity Metrics
8:30 Results: cloud source
10:00 Results: through a gateway
11:30 Which tool to use
12:30 Run the test yourself
13:30 Outro

## Description + tags
Dataflow Gen2 vs Copy job vs Pipeline Copy vs notebook: the same 10M rows loaded 5 ways in Microsoft Fabric, with CU cost measured in the Capacity Metrics app. Includes the full test protocol and SQL to reproduce it.

Protocol + code: [link]
Tags: dataflow gen2, copy job, fabric pipeline, microsoft fabric cost, capacity units, capacity metrics app, fabric pricing, data factory, gateway

## Shorts
**Short 1: "CU(s), not minutes"** (35 s)
"Comparing Fabric tools by run time? Wrong number. [TEXT: Compare CU(s), not duration] Each tool bills a different meter. A slower Copy can cost less than a faster Dataflow. Open the Capacity Metrics app, find the item, read CU(s) per run. That's your real cost."

**Short 2: "Moving data, no transforms?"** (35 s)
"If you're just moving tables with no transformations, use the tool made for movement: Copy job or a Copy activity. [TEXT: Movement → Copy. Transforms → Dataflow.] Save Dataflow Gen2 for when you actually need Power Query. Test it on your data; full protocol on the channel."

## LinkedIn post
Microsoft: "Dataflow Gen2 is cheaper than Gen1."
Community: "Ours uses 20× more CUs."

Both can be true, because benchmarks aren't your workload.

So test it on your workload:
- 1 table, 10M rows, same source
- 5 methods: Dataflow Gen2, Dataflow + Fast Copy, Copy job, pipeline Copy, Python notebook
- 3 runs each, median CU(s) from Capacity Metrics
- Repeat through your gateway

It takes an afternoon, and the result ends the debate in your team.

Full protocol and SQL to generate the test table in the comments.

[diagram: 5 bars, labelled "your numbers here"]

---

# Blog: Dataflow Gen2 vs Copy Job vs Pipeline: How to Measure Real CU Cost in Fabric

Which Microsoft Fabric tool is cheapest for loading data? Microsoft has published benchmarks showing Dataflow Gen2 is faster and cheaper than Gen1. A widely discussed community thread reports the opposite for one workload: about 20× more capacity units for a simple SQL Server ingestion through a gateway. Rather than pick a side, measure your own workload. Here's a protocol you can run in an afternoon.

## Why the tools cost differently
All Fabric workloads consume capacity units (CUs), but on different meters:
- **Dataflow Gen2** is billed for Power Query engine time, plus staging and Fast Copy when used.
- **Pipeline Copy activity** is billed for data movement.
- **Copy job** uses the same movement engine.
- **Notebooks** are billed for compute held during the session, including idle time.

Duration alone doesn't tell you cost. Compare **CU(s)**, capacity-unit seconds, from the Capacity Metrics app.

## The test protocol
1. **Source:** one table of 10 million rows in Azure SQL Database. The generator script is in the video description.
2. **Destination:** a lakehouse table, overwritten each run.
3. **Methods, one item each:** Dataflow Gen2 (default), Dataflow Gen2 (Fast Copy), Copy job (full), pipeline Copy activity, and a Python notebook writing Delta.
4. **Isolation:** a dedicated workspace on a capacity with nothing else running.
5. **Runs:** three per method, 20 minutes apart; report the median.
6. **Measurement:** after ~30 minutes, read CU(s) per item and operation in the Capacity Metrics app. Screenshot every reading.
7. **Repeat** with the same table on-premises through a data gateway.

## Recording results
| Method | Source | Duration | CU(s) | CU(s)/1M rows | × cheapest |
|---|---|---|---|---|---|
| Dataflow Gen2 | Cloud | | | | |
| Dataflow Gen2 + Fast Copy | Cloud | | | | |
| Copy job | Cloud | | | | |
| Pipeline Copy | Cloud | | | | |
| Python notebook | Cloud | | | | |
| (repeat rows for gateway) | Gateway | | | | |

Convert to money with: `CU(s) ÷ 3600 × your region's price per CU-hour`.

## How to use the results
- **Plain movement, no transforms:** start with Copy job or a Copy activity. They're built for movement.
- **Business-maintained transforms:** Dataflow Gen2 is worth its cost when the Power Query logic is the point.
- **Custom logic:** notebooks, with short sessions so you don't pay for idle compute.

## Why your numbers will differ
Gateway throughput, source database speed, query folding, data types and capacity SKU all change results. That's why one team's 20× and Microsoft's benchmark can both be accurate. The only number that matters for your decision is the one from your own workload, measured the same way for every tool.

**Run the test, share the table with your team, and pick the tool on evidence.** If you publish your results, include row count, source type and whether a gateway was involved, so others can compare.
