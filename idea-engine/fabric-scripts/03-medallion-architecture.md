# Wk 3: Medallion Architecture in Microsoft Fabric, Explained + Built (Bronze → Silver → Gold)

- **Runtime target:** 20–23 min
- **Pillar:** 3, Growing-concept explainer (with build)
- **Target keywords:** medallion architecture (6,600/mo, 1.30×) · delta lake (12,100, 1.19×) · fabric lakehouse (390, 1.04×) · fabric notebook (260, 1.15×) · fabric mirroring (1,000, 1.03×)
- **Title options:**
  1. Medallion Architecture in Microsoft Fabric, Explained + Built (2026)
  2. Bronze, Silver, Gold in Fabric: Build a Medallion Lakehouse in 20 Minutes
  3. The ONLY Medallion Architecture Tutorial You Need (Microsoft Fabric)
- **Thumbnail:** "BRONZE → GOLD" · three stacked bars in bronze, silver and gold colours, the Fabric logo, and a taxi icon on the bronze bar.
- **Verify before recording:**
  - **Lakehouse schemas:** GA status, and that `CREATE SCHEMA` plus `schema.table` names work in Spark on a schema-enabled lakehouse.
  - **Materialized lake views:** preview/GA status, exact `CREATE MATERIALIZED LAKE VIEW` syntax (including `CONSTRAINT … CHECK … ON MISMATCH DROP`), and the current state of incremental vs full refresh (community reports said full refreshes ran where incremental was expected).
  - **Mirroring:** the list of supported sources, and whether mirrored tables expose any change history (the script assumes they show current state only).
  - `notebookutils.notebook.runMultiple` name and DAG format.
  - NYC TLC URLs still resolve, and the 2024 yellow schema column names (`Airport_fee` casing differs by year, which the code handles).
  - **Fabric Runtime version:** Spark 3.5 / Delta 3.x assumed for `unionByName(allowMissingColumns=True)` and `CREATE OR REPLACE TABLE`.

## Hook (0:00–0:30)
"Medallion architecture is three words, bronze, silver and gold, and somehow most explanations still leave you unsure what goes where. In the next twenty minutes I'll define each layer in one sentence. Then we build all three in Microsoft Fabric on three months of real New York taxi data, about nine million rows, with notebooks you can copy. You'll leave knowing what belongs in each layer, how to rerun it safely, whether mirroring replaces bronze, and when materialized lake views are worth using."

## Script

### 0:30 The three layers in one sentence each
[ON SCREEN: BRONZE = as it arrived · SILVER = clean and conformed · GOLD = shaped for a question]

**Bronze is the data exactly as it arrived,** plus a note of where and when it came from. You don't fix anything here. If the source sends garbage, bronze keeps the garbage, because one day you'll need to prove what the source sent, or reprocess it with better rules.

**Silver is the data cleaned and made consistent.** That means:
- Proper types and readable column names.
- Duplicates removed.
- Obviously bad rows filtered out.
- Codes turned into labels.

Silver is the layer data scientists and analysts should trust for detail.

**Gold is data shaped to answer business questions:**
- Aggregates.
- Star-schema facts and dimensions.
- The tables your Power BI model reads.

[ON SCREEN: "Bronze protects you. Silver is the truth. Gold is the answer."]

Why bother with three layers instead of one notebook that does everything?
- **Reprocessing.** If your cleaning logic changes, you rebuild silver from bronze. You don't re-download from the source.
- **Debugging.** When a number looks wrong in a report, you trace it back one layer at a time.
- **Reuse.** Five gold tables can share one silver table, so the cleaning rules live in one place.

### 2:30 Where the layers live in Fabric
[ON SCREEN: Option A: 1 lakehouse, 3 schemas · Option B: 3 lakehouses · Option C: 3 workspaces]

Three common setups:
- **Option A:** one lakehouse with schemas named bronze, silver and gold. Simplest. It's what we'll build today.
- **Option B:** a lakehouse per layer. Easier to give different people different access.
- **Option C:** a workspace per layer. Bigger teams do this so each layer has its own permissions and capacity, and use shortcuts to read across.

All three work, because OneLake lets any layer read any other without copies. Start with A. Move to B or C when access rules force you to.

And gold doesn't have to be a lakehouse. If your BI team writes SQL, gold is often a warehouse. That's last week's video.

### 3:30 Setup
[DEMO: workspace → + New item → Lakehouse → "lh_taxi_medallion" → tick "Lakehouse schemas" → Create]
[DEMO: Open notebook → New notebook → rename "01_bronze"]

Create a lakehouse called `lh_taxi_medallion` with **Lakehouse schemas** ticked, then a notebook called `01_bronze`.

First cell creates the three schemas:

```sql
%%sql
CREATE SCHEMA IF NOT EXISTS bronze;
CREATE SCHEMA IF NOT EXISTS silver;
CREATE SCHEMA IF NOT EXISTS gold;
```

### 4:00 Bronze: land it, don't touch it
[ON SCREEN: Step 1: copy files to Files/landing · Step 2: load to bronze tables + metadata]

Step one: get the raw files into the lakehouse **Files** area. Three months of yellow taxi trips, plus the zone lookup.

```python
import os, requests

months = ["2024-01", "2024-02", "2024-03"]
land = "/lakehouse/default/Files/landing/yellow"
os.makedirs(land, exist_ok=True)

for m in months:
    path = f"{land}/yellow_tripdata_{m}.parquet"
    if os.path.exists(path):          # rerun-safe: skip files we already have
        continue
    url = f"https://d37ci6vzurychx.cloudfront.net/trip-data/yellow_tripdata_{m}.parquet"
    r = requests.get(url, timeout=600)
    r.raise_for_status()
    with open(path, "wb") as f:
        f.write(r.content)

r = requests.get("https://d37ci6vzurychx.cloudfront.net/misc/taxi_zone_lookup.csv", timeout=60)
r.raise_for_status()
with open("/lakehouse/default/Files/landing/taxi_zone_lookup.csv", "wb") as f:
    f.write(r.content)
```

Step two: turn those files into bronze tables.

Here's the first real-world problem. The source changes its schema between files. In this dataset, one month calls a column `Airport_fee`, another calls it `airport_fee`, and number types drift between integer and double. If you read all three files at once, Spark complains.

Bronze has to survive that, so we read each file on its own, normalize only the names and number types, and union them.

```python
import glob
from functools import reduce
from pyspark.sql import functions as F
from pyspark.sql.types import (TimestampType, TimestampNTZType, NumericType)

def normalize(df):
    cols = []
    for f in df.schema.fields:
        name = f.name.lower()
        if isinstance(f.dataType, (TimestampType, TimestampNTZType)):
            cols.append(F.col(f.name).cast("timestamp").alias(name))
        elif isinstance(f.dataType, NumericType):
            cols.append(F.col(f.name).cast("double").alias(name))
        else:
            cols.append(F.col(f.name).cast("string").alias(name))
    return df.select(cols)

frames = []
for p in sorted(glob.glob(f"{land}/*.parquet")):
    name = os.path.basename(p)
    df = spark.read.parquet(f"Files/landing/yellow/{name}")
    frames.append(
        normalize(df)
        .withColumn("_source_file", F.lit(name))
        .withColumn("_ingested_at", F.current_timestamp())
    )

bronze = reduce(lambda a, b: a.unionByName(b, allowMissingColumns=True), frames)

(bronze.write.mode("overwrite")
       .option("overwriteSchema", "true")
       .format("delta")
       .saveAsTable("bronze.yellow_trips"))

zones_raw = (spark.read.option("header", True)
                  .csv("Files/landing/taxi_zone_lookup.csv")
                  .withColumn("_ingested_at", F.current_timestamp()))
zones_raw.write.mode("overwrite").format("delta").saveAsTable("bronze.taxi_zones")

print(spark.table("bronze.yellow_trips").count())
```

[ON SCREEN: "Bronze rule: keep every row. Add _source_file + _ingested_at."]

Notice what we did not do. We didn't filter a single row, and we didn't rename anything beyond lower-casing. We added two columns: which file a row came from, and when we loaded it. That's what lets you answer "where did this number come from?" six months from now.

For the demo I overwrite the whole table. In production you'd append only new files and keep the history.

### 7:30 Does mirroring replace bronze?
[ON SCREEN: Source DB → Mirroring → OneLake (Delta, kept in sync)]

This one comes up constantly in the community, so let's answer it.

If your source is an operational database, like Azure SQL, Snowflake or Cosmos DB, Fabric **mirroring** keeps a replica of its tables in OneLake as Delta, in near real time, with no pipeline. So do you still need bronze?

[ON SCREEN: Mirror = current state · Bronze = history]

Here's the distinction. A mirror shows the source **as it is now.** When a row is updated or deleted in the source, it's updated or deleted in the mirror. That's perfect for "give me the latest data". It is not a record of what the source sent over time. You can't replay last March, and you can't prove what a row said before it changed.

My answer:
- **Mirroring replaces your ingestion** for that source. Stop building copy pipelines for it.
- **Treat the mirror as bronze if** you only ever need current state and the source keeps its own history.
- **Keep a thin bronze if** you need audit, history or reprocessing. Add a small scheduled step that appends a snapshot, or just the changed rows, from the mirror into an append-only bronze table with a load timestamp.

Either way, silver should read from wherever your bronze is, and nothing downstream should read the mirror directly. That way, if you swap mirroring for something else later, only one step changes.

### 9:00 Silver: clean and conform
[DEMO: new notebook "02_silver"]

New notebook, `02_silver`. Silver is where the rules live. I'll put each rule on its own line so you can read them like a checklist.

```python
from pyspark.sql import functions as F
from delta.tables import DeltaTable

b = spark.read.table("bronze.yellow_trips")

payment_labels = F.create_map(
    F.lit(1), F.lit("Credit card"), F.lit(2), F.lit("Cash"),
    F.lit(3), F.lit("No charge"),   F.lit(4), F.lit("Dispute"),
    F.lit(5), F.lit("Unknown"),     F.lit(6), F.lit("Voided trip"),
)

typed = b.select(
    F.col("vendorid").cast("int").alias("vendor_id"),
    F.col("tpep_pickup_datetime").alias("pickup_ts"),
    F.col("tpep_dropoff_datetime").alias("dropoff_ts"),
    F.col("pulocationid").cast("int").alias("pickup_zone_id"),
    F.col("dolocationid").cast("int").alias("dropoff_zone_id"),
    F.col("passenger_count").cast("int").alias("passengers"),
    F.col("trip_distance").alias("distance_mi"),
    F.col("payment_type").cast("int").alias("payment_type_id"),
    F.col("fare_amount").alias("fare"),
    F.col("tip_amount").alias("tip"),
    F.col("total_amount").alias("total"),
    F.col("_source_file"),
)

silver = (typed
    .withColumn("payment_type", F.coalesce(payment_labels[F.col("payment_type_id")], F.lit("Unknown")))
    .withColumn("pickup_date", F.to_date("pickup_ts"))
    .withColumn("duration_min",
        (F.unix_timestamp("dropoff_ts") - F.unix_timestamp("pickup_ts")) / 60.0)
    # --- quality rules ---
    .where(F.col("pickup_ts") >= "2024-01-01")
    .where(F.col("pickup_ts") <  "2024-04-01")    # source files contain stray dates
    .where("distance_mi > 0 AND distance_mi < 200")
    .where("fare >= 0 AND total >= 0")
    .where("duration_min BETWEEN 1 AND 180")
    # --- stable key + dedupe ---
    .withColumn("trip_id", F.sha2(F.concat_ws("|",
        "vendor_id", "pickup_ts", "dropoff_ts", "pickup_zone_id",
        "dropoff_zone_id", "distance_mi", "total"), 256))
    .dropDuplicates(["trip_id"])
)
```

Then we write it with a **MERGE**, not an overwrite. That makes the notebook safe to rerun: run it twice and you don't get double the trips.

```python
target = "silver.trips"
if spark.catalog.tableExists(target):
    (DeltaTable.forName(spark, target).alias("t")
        .merge(silver.alias("s"), "t.trip_id = s.trip_id")
        .whenNotMatchedInsertAll()
        .execute())
else:
    silver.write.format("delta").saveAsTable(target)

zones = (spark.read.table("bronze.taxi_zones")
    .select(F.col("LocationID").cast("int").alias("location_id"),
            F.col("Borough").alias("borough"),
            F.col("Zone").alias("zone"),
            F.col("service_zone")))
zones.write.mode("overwrite").format("delta").saveAsTable("silver.taxi_zones")
```

Now the check I want you to always add: how many rows did the rules throw away?

```python
bronze_n = spark.table("bronze.yellow_trips").count()
silver_n = spark.table("silver.trips").count()
print(f"bronze {bronze_n:,} → silver {silver_n:,} ({1 - silver_n/bronze_n:.1%} removed)")
```

[ON SCREEN: show the printed result: a few percent removed]

A few percent removed is normal for this dataset. If that number jumps one day, your source changed, and you'll know before your CFO does. In production, write this to a small audit table every run.

### 13:00 Silver with materialized lake views (and the caveat)
[ON SCREEN: CREATE MATERIALIZED LAKE VIEW … CONSTRAINT … ON MISMATCH DROP]

Fabric has a newer way to do this: **materialized lake views**. Instead of a notebook that reads, transforms and writes, you declare the result as Spark SQL. Fabric stores it as a Delta table, works out the dependency order between views, and refreshes them on a schedule.

They also support data-quality constraints. Here's a cut-down silver as a view:

```sql
%%sql
CREATE MATERIALIZED LAKE VIEW IF NOT EXISTS silver.trips_mlv
(
    CONSTRAINT positive_distance CHECK (distance_mi > 0) ON MISMATCH DROP,
    CONSTRAINT valid_duration    CHECK (duration_min BETWEEN 1 AND 180) ON MISMATCH DROP
)
AS
SELECT
    CAST(vendorid AS INT)          AS vendor_id,
    tpep_pickup_datetime           AS pickup_ts,
    tpep_dropoff_datetime          AS dropoff_ts,
    CAST(pulocationid AS INT)      AS pickup_zone_id,
    CAST(dolocationid AS INT)      AS dropoff_zone_id,
    trip_distance                  AS distance_mi,
    fare_amount                    AS fare,
    tip_amount                     AS tip,
    total_amount                   AS total,
    TO_DATE(tpep_pickup_datetime)  AS pickup_date,
    (UNIX_TIMESTAMP(tpep_dropoff_datetime) - UNIX_TIMESTAMP(tpep_pickup_datetime)) / 60.0 AS duration_min
FROM bronze.yellow_trips
WHERE tpep_pickup_datetime >= '2024-01-01' AND tpep_pickup_datetime < '2024-04-01';
```

[DEMO: lakehouse → Manage materialized lake views → show the lineage graph bronze.yellow_trips → silver.trips_mlv, and the dropped-row counts per constraint]

The nice parts:
- You get a lineage view.
- You see how many rows each constraint dropped, which is the data-quality report we built by hand a minute ago.

The caveat, and this comes straight from people running them: refreshes they expected to be **incremental** were doing **full recomputes.** On nine million rows you won't notice. On billions you will, in time and in capacity units.

So use them for simpler silver and gold steps. Check the refresh mode after the first few runs before you rely on them for big tables. Keep the notebook-plus-MERGE pattern where you need control.

### 15:00 Gold: shape it for the question
[DEMO: new notebook "03_gold"]

Gold is where you stop thinking about data quality and start thinking about the report. Our report needs:
- Daily trips and revenue by borough.
- A zone dimension.
- A trip fact for drill-down.

```sql
%%sql
CREATE OR REPLACE TABLE gold.dim_zone USING DELTA AS
SELECT location_id, borough, zone, service_zone
FROM silver.taxi_zones;

CREATE OR REPLACE TABLE gold.fact_trips USING DELTA AS
SELECT trip_id, pickup_date, pickup_zone_id, dropoff_zone_id, payment_type,
       passengers, distance_mi, duration_min, fare, tip, total
FROM silver.trips;

CREATE OR REPLACE TABLE gold.daily_borough USING DELTA AS
SELECT t.pickup_date,
       z.borough,
       COUNT(*)                                        AS trips,
       ROUND(SUM(t.total), 2)                          AS revenue,
       ROUND(AVG(t.duration_min), 1)                   AS avg_duration_min,
       ROUND(100 * SUM(t.tip) / NULLIF(SUM(t.fare), 0), 1) AS tip_pct
FROM silver.trips t
JOIN silver.taxi_zones z ON t.pickup_zone_id = z.location_id
GROUP BY t.pickup_date, z.borough;
```

[ON SCREEN: gold = star schema (fact_trips + dim_zone) + one pre-aggregated table]

Two kinds of gold here:
- **A small star schema:** a fact and a dimension. That's what Power BI likes.
- **One pre-aggregated table,** for a dashboard that needs to be fast and simple.

Quick look:

```sql
%%sql
SELECT borough, SUM(trips) AS trips, ROUND(SUM(revenue)) AS revenue, ROUND(AVG(tip_pct),1) AS avg_tip_pct
FROM gold.daily_borough
GROUP BY borough
ORDER BY revenue DESC;
```

Manhattan dominates trips. JFK and LaGuardia sit under Queens, so Queens punches above its weight on revenue per trip. That's the kind of thing gold should make obvious.

### 17:30 Run it in order, every day
[DEMO: new notebook "00_run_all"]

Three notebooks need to run in order. Two ways to do it.

The pipeline way, from week one: a pipeline with three Notebook activities chained by **on success**, on a schedule.

Or from one driver notebook, using `notebookutils`:

```python
dag = {
    "activities": [
        {"name": "bronze", "path": "01_bronze"},
        {"name": "silver", "path": "02_silver", "dependencies": ["bronze"]},
        {"name": "gold",   "path": "03_gold",   "dependencies": ["silver"]},
    ]
}
notebookutils.notebook.runMultiple(dag)
```

[ON SCREEN: Pipeline = alerts, retries, mixed activities · runMultiple = fast, Spark-only, one session]

Use the pipeline if you want failure alerts and retries, or steps that aren't notebooks. Use `runMultiple` when it's all Spark and you want it to share one session and start faster.

### 18:30 Gold into Power BI
[DEMO: lakehouse → New semantic model → "sm_taxi_gold" → select gold.fact_trips, gold.dim_zone, gold.daily_borough → relationship fact_trips[pickup_zone_id] → dim_zone[location_id]]

From the lakehouse, **New semantic model**. Pick only the gold tables. Silver and bronze never go into a report model. Relate the fact to the zone dimension, and this is a Direct Lake model reading gold straight from OneLake.

```DAX
Trips   = COUNTROWS ( fact_trips )
Revenue = SUM ( fact_trips[total] )
Tip %   = DIVIDE ( SUM ( fact_trips[tip] ), SUM ( fact_trips[fare] ) )
```

[ON SCREEN: "Reports read gold. Only gold."]

### 19:30 The rules on one screen
[ON SCREEN: checklist]

- **Bronze:** keep every row, add the source and load time, never edit.
- **Mirroring:** replaces ingestion. Keep a thin append-only bronze if you need history.
- **Silver:** types, names, rules, dedupe, MERGE so reruns are safe. Count what you drop.
- **Materialized lake views:** good for simple layers. Check incremental vs full refresh before you scale.
- **Gold:** shaped for the report, as a star schema plus a few aggregates.
- **Reports read gold. Only gold.**

### 20:30 Outro
That's medallion in Fabric, explained and built. Next week is a full one-hour code-along: we take this exact pattern and build an end-to-end Fabric platform, with ingestion, orchestration, a warehouse gold layer and a report. Subscribe on [CHANNEL] so you don't miss it. If you want the notebooks, they're linked in the description.

## Chapters
```
0:00 Medallion architecture in 20 minutes
0:30 Bronze, silver, gold in one sentence each
2:30 Where the layers live in Fabric (schemas vs lakehouses vs workspaces)
3:30 Setup: schema-enabled lakehouse
4:00 Bronze: land 9M taxi rows, handle schema drift
7:30 Does mirroring replace bronze?
9:00 Silver: types, rules, dedupe, MERGE
13:00 Materialized lake views (and the refresh caveat)
15:00 Gold: star schema + aggregates
17:30 Run it in order (pipeline vs runMultiple)
18:30 Gold into Power BI (Direct Lake)
19:30 The rules on one screen
20:30 What's next
```

## Description + tags
**Medallion architecture in Microsoft Fabric, explained and built.** Bronze, silver and gold layers in a schema-enabled lakehouse, with PySpark and Spark SQL notebooks on 3 months of NYC taxi data (about 9M rows), plus whether mirroring replaces bronze and when to use materialized lake views.

Covered:
- What belongs in bronze, silver and gold (and what doesn't)
- Handling schema drift in bronze
- Data-quality rules, dedupe and rerun-safe MERGE in silver
- Mirroring vs a bronze layer
- Materialized lake views with constraints, plus the full-vs-incremental refresh caveat
- Gold star schema + Direct Lake semantic model
- Orchestration with pipelines or notebookutils.runMultiple

Data: NYC TLC Trip Record Data (public). Notebooks: [link].

**Tags:** medallion architecture, medallion architecture fabric, bronze silver gold, microsoft fabric lakehouse, delta lake, fabric notebook, pyspark fabric, materialized lake views, fabric mirroring, data engineering fabric, microsoft fabric 2026, dp-700

## Shorts cutdowns

**Short 1: "Medallion in 30 seconds" (≈30s)**
[ON SCREEN: BRONZE / SILVER / GOLD]
"Medallion architecture in thirty seconds.
[ON SCREEN: BRONZE = as it arrived] Bronze: the data exactly as it arrived, plus where and when it came from. Never edit it.
[ON SCREEN: SILVER = clean + consistent] Silver: cleaned. Right types, readable names, no duplicates, bad rows out.
[ON SCREEN: GOLD = shaped for a question] Gold: shaped to answer a business question. Facts, dimensions, aggregates.
[ON SCREEN: Reports read GOLD only] And reports only ever read gold."

**Short 2: "Does mirroring replace bronze?" (≈40s)**
[ON SCREEN: "Mirroring = no more bronze?"]
"Fabric mirroring copies your database into OneLake in near real time. So do you still need a bronze layer?
[ON SCREEN: MIRROR = current state] A mirror shows the source as it is now. Update a row in the source, it updates in the mirror.
[ON SCREEN: BRONZE = history] Bronze is history: what the source sent, and when.
[ON SCREEN: Need audit or replay? → thin append-only bronze] So mirroring replaces your ingestion pipeline. But if you need audit or reprocessing, keep a thin bronze that appends snapshots from the mirror."

**Short 3: "The rerun bug" (≈35s)**
[ON SCREEN: "Ran your notebook twice? Check your row count."]
"Ran your Fabric notebook twice and suddenly revenue doubled? You're appending.
[ON SCREEN: mode('append') ❌] Appending the same rows twice doubles them.
[ON SCREEN: MERGE ON trip_id ✅] Give each row a stable key, like a hash of its columns, and MERGE on it. Insert only what isn't there yet.
Now your silver layer is safe to rerun as many times as you like."

## LinkedIn post
**Diagram:** Source DB → (Mirroring) → OneLake mirror → (append snapshot) → Bronze → Silver (rules, MERGE) → Gold (star + aggregates) → Power BI. A dotted box labelled "Materialized lake views?" around silver/gold.

> "We use mirroring now, so we don't need bronze." I hear this a lot. It's half right.
>
> Mirroring replaces your ingestion pipeline. But a mirror is current state: rows get updated and deleted. Bronze is history: what the source sent, and when.
>
> If you'll ever need to audit a number or reprocess with new rules, keep a thin bronze that appends snapshots from the mirror. It's one small notebook.
>
> Same energy for materialized lake views: great for simple silver/gold, but check whether your refreshes are actually incremental before you scale them.
>
> I built the full bronze → silver → gold pattern in Fabric on 9M taxi rows. Link in comments.
>
> Mirror-as-bronze: yes or no on your team?
