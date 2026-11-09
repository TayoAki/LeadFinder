# Wk 4: Code Along: Build an End-to-End Microsoft Fabric Data Platform in 1 Hour (Lakehouse + PySpark + Power BI)

- **Runtime target:** 58–62 min
- **Pillar:** 4. Code-along projects (jayzern / Thomas Hass format)
- **Target keywords:**
  - medallion architecture: 6,600/mo, 1.30×
  - delta lake: 12,100, 1.19×
  - fabric warehouse: 12,100, 1.16×
  - onelake: 8,100
  - fabric pipeline: 50, 1.33×
  - fabric end to end project: 10, 1.5×. Tiny on Google, but YouTube searches it.
  - The format is proven: jayzern's ELT code-along got 466K views on 23.5K subs.
- **Title options:**
  1. Code Along: Build an End-to-End Microsoft Fabric Data Platform in 1 Hour
  2. Microsoft Fabric End-to-End Project (2026): API → Lakehouse → Power BI in 60 Minutes
  3. Build a Medallion Lakehouse in Microsoft Fabric From Scratch (Full Project, 1 Hour)
- **Thumbnail:**
  - **Text:** "FULL PROJECT · 1 HOUR"
  - **Visual:** the flow API → Bronze → Silver → Gold → Power BI as five icons left to right, with a timer graphic.
- **Verify before recording:**
  - **Trial capacity:** length (60 days at last check) and that it still supports every item used here: notebooks, pipelines, Direct Lake.
  - **V-Order:** the Spark config name (`spark.sql.parquet.vorder.default` vs the older `spark.sql.parquet.vorder.enabled`), and whether new workspaces default V-Order off. Resource profiles changed this in 2025.
  - **"New semantic model" from a lakehouse:** whether it creates Direct Lake on SQL endpoint or Direct Lake on OneLake. Match the narration in 42:00 to what the UI does.
  - **Lakehouse "schemas" checkbox:** the script leaves it **off** so the `lh_bronze.weather_raw` cross-lakehouse reads work. Confirm the default and the cross-lakehouse syntax still hold.
  - **Pipeline UI names:** activity names ("Notebook", "Semantic model refresh") and the schedule UI. Fabric "Data pipelines" may be shown as "Pipelines".
  - **Direct Lake auto-update:** the setting "Keep your Direct Lake data up to date" still exists under the semantic model settings.
  - **Open-Meteo archive API:** still free with no key, still lags ~5 days, still returns the daily variable names used below.
  - **SQL endpoint metadata refresh:**
    - The REST route `POST /v1/workspaces/{ws}/sqlEndpoints/{id}/refreshMetadata`: GA status, request body, and whether it returns 202 (long-running) or 200.
    - That `sempy.fabric.FabricRestClient` is still preinstalled in Fabric notebooks.
    - Whether pipelines now have a native activity for it; if so, show it in 55:00 instead of the notebook cell.

## Hook (0:00–0:30)
> In the next hour, we're going to build a complete data platform in Microsoft Fabric, from nothing.
>
> We'll pull live data from a public API, land it raw in a lakehouse, clean it with PySpark, model it into a star schema, and put a Power BI report on top that updates itself every morning.
>
> No sample-data shortcuts. Every line of code is on screen and in the description.
>
> By the end, you'll have a real project you can put on your CV and explain in an interview. Let's build it.

## Script

### 0:30 What we're building
[ON SCREEN: architecture diagram. Open-Meteo API → Notebook → lh_bronze (Files + weather_raw) → Notebook → lh_silver (weather_daily) → Notebook → lh_gold (dim_city, dim_date, fact_weather_daily) → SQL analytics endpoint → Direct Lake semantic model → Power BI report. Pipeline box wrapped around the three notebooks, with a clock icon.]

> Here's the plan.
>
> Our source is Open-Meteo. It's a free weather API, no key, no sign-up. We'll pull a year of daily weather for five cities.
>
> We use the medallion pattern, with three layers:
> - **Bronze** is the data exactly as it arrived. If anything goes wrong later, we can always rebuild from bronze.
> - **Silver** is cleaned and de-duplicated. One row per city per day.
> - **Gold** is shaped for reporting: a star schema with a fact table and dimensions.
>
> Each layer is its own lakehouse. That keeps permissions and responsibilities clean. In a real team, analysts might only get access to gold.
>
> Three notebooks move data between layers. A pipeline runs them in order every morning. On top of gold, we'll build a Direct Lake semantic model. That means Power BI reads the Delta tables straight from OneLake, with no import and no copy.
>
> Why weather? It's free, it changes every day, and it has real data problems: nested JSON, arrays, nulls. The pattern is exactly what you'd do with sales or IoT data.
>
> What you need: a Fabric workspace on a capacity. A trial works. That's it.

### 3:00 Workspace and three lakehouses
[DEMO: app.fabric.microsoft.com → Workspaces → New workspace → name `fabric_weather_e2e` → Advanced → License mode: Trial (or your Fabric capacity) → Apply.]

> First, a workspace. I'm calling it `fabric_weather_e2e`. Underscores, no spaces. It makes paths easier later.
>
> Under Advanced, make sure it's on a capacity. Trial or a paid F SKU both work.

[DEMO: + New item → Lakehouse → name `lh_bronze` → leave "Lakehouse schemas" unchecked → Create. Repeat for `lh_silver` and `lh_gold`.]

> Now three lakehouses: `lh_bronze`, `lh_silver`, `lh_gold`.
>
> Leave the schemas option unticked for this project. It keeps the table names simple and lets us read across lakehouses with a two-part name.
>
> Every lakehouse has two areas:
> - **Files** is a plain folder. Anything goes: JSON, CSV, images.
> - **Tables** is Delta tables only. That's what SQL and Power BI can see.
>
> Bronze will use both. Silver and gold use Tables.
>
> And every lakehouse automatically gets a SQL analytics endpoint. We'll use that later.

### 6:00 Bronze: ingest the API with a notebook
[DEMO: open lh_bronze → Open notebook → New notebook → rename `nb_01_bronze_ingest`. The lakehouse panel shows lh_bronze as default (pin icon).]

> Open `lh_bronze`, then New notebook. Rename it `nb_01_bronze_ingest`.
>
> Notice the lakehouse on the left has a pin. It's the default lakehouse for this notebook. Relative paths and table names go there.

> Cell one: our settings. Five cities, with latitude and longitude, and a date range.
>
> Open-Meteo's archive runs about five days behind, so we stop seven days ago to be safe.

[DEMO: cell 1]
```python
import json, os, requests
from datetime import date, timedelta

CITIES = [
    {"city": "London",   "lat": 51.51, "lon": -0.13},
    {"city": "New York", "lat": 40.71, "lon": -74.01},
    {"city": "Sydney",   "lat": -33.87, "lon": 151.21},
    {"city": "Tokyo",    "lat": 35.68, "lon": 139.69},
    {"city": "Lagos",    "lat": 6.52,  "lon": 3.38},
]

END_DATE   = date.today() - timedelta(days=7)
START_DATE = END_DATE - timedelta(days=365)
RUN_DATE   = date.today().isoformat()

DAILY_VARS = "temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max"
BASE_URL   = "https://archive-api.open-meteo.com/v1/archive"
```

> Cell two: call the API once per city, and write each response as a JSON file.
>
> I'm writing to `/lakehouse/default/Files`. That's the default lakehouse mounted like a normal folder, so plain Python `open` works.
>
> Notice the folder name has `run_date=` in it. Every run gets its own folder, so we never overwrite raw data. That's the point of bronze.

[DEMO: cell 2]
```python
folder = f"/lakehouse/default/Files/raw/weather/run_date={RUN_DATE}"
os.makedirs(folder, exist_ok=True)

for c in CITIES:
    params = {
        "latitude": c["lat"],
        "longitude": c["lon"],
        "start_date": START_DATE.isoformat(),
        "end_date": END_DATE.isoformat(),
        "daily": DAILY_VARS,
        "timezone": "UTC",
    }
    r = requests.get(BASE_URL, params=params, timeout=60)
    r.raise_for_status()
    payload = r.json()
    payload["city"] = c["city"]          # the API doesn't echo a name, so we add it
    slug = c["city"].lower().replace(" ", "_")
    with open(f"{folder}/{slug}.json", "w") as f:
        json.dump(payload, f)
    print(c["city"], len(payload["daily"]["time"]), "days")
```

[DEMO: run → output shows 5 lines of "~366 days". Refresh Files in the lakehouse panel → raw/weather/run_date=…/ shows five JSON files. Open one file in preview.]

> Run it. Five cities, about 366 days each.
>
> Refresh Files and there they are. Open one and look at the shape:
> - `daily` is an object of arrays.
> - `time` is a list of dates, `temperature_2m_max` is a list of numbers, and so on.
>
> The values line up by position. That's awkward for analytics, and fixing it is silver's job.

> Cell three: we also want bronze as a table. That way we can query raw history with SQL and track what was loaded when.
>
> We read today's files with Spark, keep the nested structure as it is, and add two audit columns: when we loaded it, and which file it came from. Then we append. Never overwrite in bronze.

[DEMO: cell 3]
```python
from pyspark.sql import functions as F

raw = (spark.read
       .option("multiLine", True)
       .json(f"Files/raw/weather/run_date={RUN_DATE}/*.json")
       .withColumn("run_date", F.lit(RUN_DATE).cast("date"))
       .withColumn("_ingested_at", F.current_timestamp())
       .withColumn("_source_file", F.input_file_name()))

raw.write.format("delta").mode("append").saveAsTable("weather_raw")
display(spark.sql("SELECT city, run_date, _ingested_at FROM weather_raw"))
```

[DEMO: run → table shows 5 rows. Refresh Tables → weather_raw appears with triangle icon (Delta).]

> Five rows: one per city, each holding a year of arrays.
>
> Refresh Tables, and `weather_raw` is a Delta table. The little triangle means Delta.
>
> One thing before we leave bronze. If you run this twice on the same day, you'll get duplicate rows here. That's fine. Bronze is a log of what arrived. Silver will handle duplicates.
>
> Bronze done.

### 16:00 Silver: clean and merge with PySpark
[DEMO: open lh_silver → Open notebook → New notebook → rename `nb_02_silver_transform`. In the Explorer panel, + Lakehouses → Existing lakehouse → add lh_bronze. lh_silver keeps the pin.]

> New notebook, from `lh_silver` this time, so silver is the default. Call it `nb_02_silver_transform`.
>
> Now add `lh_bronze` as a second lakehouse, so we can read from it. Silver stays pinned as the default, because silver is where we write.
>
> Rule of thumb: **pin the layer you write to, and add the layer you read from.**

> Cell one: read bronze. Because the lakehouses are in the same workspace, the two-part name `lh_bronze.weather_raw` just works.
>
> We only want the latest run. Each run already contains the full year, so the latest run is the most complete picture.

[DEMO: cell 1]
```python
from pyspark.sql import functions as F
from delta.tables import DeltaTable

bronze = spark.read.table("lh_bronze.weather_raw")
latest_run = bronze.agg(F.max("run_date")).first()[0]
latest = bronze.filter(F.col("run_date") == latest_run)

latest.printSchema()
```

> Look at the schema: `daily` is a struct, and inside it every field is an array.
>
> Here's the key move. `arrays_zip` takes several arrays and zips them together by position: the first date with the first temperature, and so on. `explode` then turns that into one row per day.
>
> I flatten `daily.*` first so the zipped fields keep clean names.

[DEMO: cell 2]
```python
daily = (latest
    .select("city", "latitude", "longitude", "daily.*")
    .select("city", "latitude", "longitude",
            F.explode(F.arrays_zip("time",
                                   "temperature_2m_max",
                                   "temperature_2m_min",
                                   "precipitation_sum",
                                   "wind_speed_10m_max")).alias("d"))
    .select(
        "city", "latitude", "longitude",
        F.to_date("d.time").alias("date"),
        F.col("d.temperature_2m_max").cast("double").alias("temp_max_c"),
        F.col("d.temperature_2m_min").cast("double").alias("temp_min_c"),
        F.col("d.precipitation_sum").cast("double").alias("precipitation_mm"),
        F.col("d.wind_speed_10m_max").cast("double").alias("wind_max_kmh"),
    ))

display(daily.limit(10))
```

[DEMO: run → tidy table, one row per city per date.]

> That's the shape we want. One row, one city, one day.

> Cell three: data quality. Three rules:
> - no row without a date or city
> - no duplicates on city plus date
> - min temperature can't be above max
>
> If the API ever sends that, we drop the row and count it. In a real project you'd write the bad rows to a quarantine table. I'll leave that as homework.

[DEMO: cell 3]
```python
clean = (daily
    .filter(F.col("date").isNotNull() & F.col("city").isNotNull())
    .filter(F.col("temp_min_c") <= F.col("temp_max_c"))
    .dropDuplicates(["city", "date"])
    .withColumn("_updated_at", F.current_timestamp()))

print("rows in:", daily.count(), "rows clean:", clean.count())
```

> Cell four: write to silver with a MERGE, not an overwrite.
>
> MERGE means: if city plus date already exists, update it. If it's new, insert it. So you can run this every day and silver grows, never duplicates.
>
> First run, the table doesn't exist yet, so we just create it.

[DEMO: cell 4]
```python
TARGET = "weather_daily"

if spark.catalog.tableExists(TARGET):
    (DeltaTable.forName(spark, TARGET).alias("t")
        .merge(clean.alias("s"), "t.city = s.city AND t.date = s.date")
        .whenMatchedUpdateAll()
        .whenNotMatchedInsertAll()
        .execute())
else:
    clean.write.format("delta").saveAsTable(TARGET)

display(spark.sql("""
    SELECT city, COUNT(*) AS days, MIN(date) AS first_day, MAX(date) AS last_day
    FROM weather_daily GROUP BY city ORDER BY city"""))
```

[DEMO: run → 5 cities, ~366 days each. Run cell 4 again → same counts.]

> Five cities, about 366 days each.
>
> Now watch: I'll run the merge again. Same counts. That's idempotent. You can rerun it safely, which matters a lot when a pipeline retries at 3am.
>
> Silver done.

### 27:00 Gold: the star schema
[DEMO: open lh_gold → New notebook → rename `nb_03_gold_model`. Add lh_silver as a second lakehouse. lh_gold pinned.]

> Same pattern: notebook from `lh_gold`, add `lh_silver` to read from. Call it `nb_03_gold_model`.
>
> Gold is a star schema:
> - **one fact table:** a row per city per day, with the numbers
> - **two dimensions:** city and date
>
> Power BI is built for exactly this shape. It makes the model faster and the DAX simpler. Video six is all about why.

> First line matters for Power BI. V-Order is a write-time optimization that makes Parquet files much faster for Direct Lake to read. Some workspaces have it off by default now, so for gold, we switch it on.

[DEMO: cell 1]
```python
from pyspark.sql import functions as F

spark.conf.set("spark.sql.parquet.vorder.default", "true")   # faster reads for Direct Lake

silver = spark.read.table("lh_silver.weather_daily")
```

> Dimension one: city. Each city gets an integer key.
>
> I use a hash of the name so the key stays the same every run. With a row number, the keys could shift, and that would break history.

[DEMO: cell 2]
```python
dim_city = (silver
    .select("city", "latitude", "longitude").distinct()
    .withColumn("city_id", F.abs(F.xxhash64("city")))
    .withColumn("hemisphere", F.when(F.col("latitude") >= 0, "North").otherwise("South"))
    .select("city_id", "city", "latitude", "longitude", "hemisphere"))

(dim_city.write.format("delta").mode("overwrite")
    .option("overwriteSchema", "true").saveAsTable("dim_city"))
```

> Dimension two: date. Never build the date table from the fact rows. You'd get gaps on days with no data, and time intelligence breaks.
>
> We generate every day between the first and last date with `sequence`. Then we add the columns people actually slice by: year, month, month name, weekday, weekend flag.
>
> The key is the date as an integer, like 20260315. Readable, and fast to join.

[DEMO: cell 3]
```python
bounds = silver.agg(F.min("date").alias("lo"), F.max("date").alias("hi")).first()

dim_date = (spark.sql(f"""
        SELECT explode(sequence(to_date('{bounds.lo}'), to_date('{bounds.hi}'), interval 1 day)) AS date""")
    .withColumn("date_key",     F.date_format("date", "yyyyMMdd").cast("int"))
    .withColumn("year",         F.year("date"))
    .withColumn("quarter",      F.concat(F.lit("Q"), F.quarter("date")))
    .withColumn("month_num",    F.month("date"))
    .withColumn("month_name",   F.date_format("date", "MMM"))
    .withColumn("year_month",   F.date_format("date", "yyyy-MM"))
    .withColumn("weekday_num",  F.dayofweek("date"))
    .withColumn("weekday_name", F.date_format("date", "EEE"))
    .withColumn("is_weekend",   F.dayofweek("date").isin(1, 7)))

(dim_date.write.format("delta").mode("overwrite")
    .option("overwriteSchema", "true").saveAsTable("dim_date"))
```

> Now the fact. Keys plus numbers. We also calculate two things here, once, in Spark, instead of in DAX later:
> - the average temperature
> - a rain-day flag: one millimetre or more counts as a rain day
>
> Business logic in gold means every report agrees on what a rain day is.

[DEMO: cell 4]
```python
fact = (silver
    .withColumn("city_id",  F.abs(F.xxhash64("city")))
    .withColumn("date_key", F.date_format("date", "yyyyMMdd").cast("int"))
    .withColumn("temp_avg_c", F.round((F.col("temp_max_c") + F.col("temp_min_c")) / 2, 2))
    .withColumn("is_rain_day", F.col("precipitation_mm") >= 1.0)
    .select("date_key", "city_id", "temp_max_c", "temp_min_c", "temp_avg_c",
            "precipitation_mm", "wind_max_kmh", "is_rain_day"))

(fact.write.format("delta").mode("overwrite")
    .option("overwriteSchema", "true").saveAsTable("fact_weather_daily"))

for t in ["dim_city", "dim_date", "fact_weather_daily"]:
    print(t, spark.read.table(t).count())
```

[DEMO: run → dim_city 5, dim_date ~366, fact ~1,830.]

> Five cities, about 366 dates, about 1,830 fact rows.
>
> Gold is small, so I overwrite it each run. That's simple and always consistent. When your fact gets to hundreds of millions of rows, you'd switch to a MERGE or a partition overwrite. Same idea as silver.

> One more cell, and it's the one people skip and then lose an afternoon over.
>
> The SQL analytics endpoint doesn't read your Delta log live. A background job syncs the endpoint's metadata from the lakehouse, and it can lag behind your writes. Sometimes it's seconds, sometimes longer.
>
> So your notebook finishes, you query in SQL, and you see yesterday's numbers, or a new table is missing. It's one of the most complained-about things in the Fabric community.
>
> The fix: after gold writes, tell the endpoint to sync now. There's a REST API for exactly that, and Semantic Link's `FabricRestClient` handles the auth for you inside the notebook.

[DEMO: cell 5]
```python
import sempy.fabric as fabric

client = fabric.FabricRestClient()
ws_id  = fabric.get_workspace_id()

# find the SQL analytics endpoint that belongs to lh_gold
endpoints = client.get(f"/v1/workspaces/{ws_id}/sqlEndpoints").json()["value"]
ep_id = next(e["id"] for e in endpoints if e["displayName"] == "lh_gold")

# force a metadata sync so SQL (and anything built on the endpoint) sees the new data
resp = client.post(f"/v1/workspaces/{ws_id}/sqlEndpoints/{ep_id}/refreshMetadata", json={})
print("refreshMetadata:", resp.status_code)
```

[DEMO: run → 200/202.]

> 200 or 202 means it's accepted.
>
> Because this sits at the end of the gold notebook, every pipeline run ends with the endpoint in sync. No more "why is SQL showing old data".
>
> Gold done.

### 37:00 SQL analytics endpoint: query it with T-SQL
[DEMO: workspace → lh_gold's SQL analytics endpoint (or the lakehouse top-right switcher "SQL analytics endpoint") → New SQL query.]

> Every lakehouse has a SQL analytics endpoint. It's a read-only T-SQL view over your Delta tables. Nothing to set up.
>
> If your analysts live in SQL, they never need to touch Spark.
>
> And because we forced the metadata sync at the end of the gold notebook, all three tables are already here. If you ever see a table missing in this list, that sync lag is the first thing to check.

[DEMO: query]
```sql
SELECT TOP 10
    c.city,
    d.date,
    f.temp_max_c,
    f.precipitation_mm
FROM dbo.fact_weather_daily AS f
JOIN dbo.dim_city AS c ON f.city_id  = c.city_id
JOIN dbo.dim_date AS d ON f.date_key = d.date_key
ORDER BY f.temp_max_c DESC;
```

> The ten hottest city-days in the year. Familiar SQL, running on the same Delta files Spark wrote.
>
> The endpoint is read-only for tables. But you can create views, and they're handy for analysts.

[DEMO: query → run → refresh Views folder]
```sql
CREATE VIEW dbo.vw_city_month AS
SELECT
    c.city,
    d.year_month,
    AVG(f.temp_avg_c)                    AS avg_temp_c,
    SUM(f.precipitation_mm)              AS rain_mm,
    SUM(CAST(f.is_rain_day AS int))      AS rain_days
FROM dbo.fact_weather_daily AS f
JOIN dbo.dim_city AS c ON f.city_id  = c.city_id
JOIN dbo.dim_date AS d ON f.date_key = d.date_key
GROUP BY c.city, d.year_month;
```

> One warning that trips people up. Don't build your Power BI model on views.
>
> Direct Lake reads Delta tables directly. A view isn't a Delta table. So on the SQL-endpoint flavour of Direct Lake, any query that touches a view falls back to DirectQuery, which is slower. The other flavour, Direct Lake on OneLake, can't see SQL views at all.
>
> Views for people, tables for the model.

### 42:00 Direct Lake semantic model + DAX measures
[DEMO: back to lh_gold → ribbon "New semantic model" → name `sm_weather` → select dim_city, dim_date, fact_weather_daily → Confirm. Model opens in the web modeling view.]

> From `lh_gold`: New semantic model. Name it `sm_weather`. Pick the three gold tables. Confirm.
>
> This is a Direct Lake model. Power BI doesn't copy the data. When someone opens a report, it loads just the columns it needs straight from the Delta files in OneLake into memory.
>
> You get import-like speed without a scheduled import.

> Relationships. Drag `fact_weather_daily[date_key]` onto `dim_date[date_key]`, then `fact_weather_daily[city_id]` onto `dim_city[city_id]`.

[DEMO: drag both. Check: many-to-one, single direction, Assume referential integrity on.]

> Check each one: many to one, and single direction, filtering from the dimension to the fact. That's the star.

[DEMO: select dim_date → Mark as date table → date column = date.]

> Mark `dim_date` as the date table, so time intelligence functions work properly.
>
> Then tidy up. Hide the key columns in the fact, since nobody should slice by `city_id`. And sort `month_name` by `month_num`, or your months come out alphabetical: April, August, December.

[DEMO: hide fact date_key, city_id; dim_date month_name → Sort by column → month_num; weekday_name → sort by weekday_num.]

> Now measures. I'm creating them on the fact table. Explicit measures always beat dragging raw columns in, because you control the logic and the format.

[DEMO: New measure ×6]
```dax
Avg Max Temp (°C) = AVERAGE ( fact_weather_daily[temp_max_c] )

Avg Min Temp (°C) = AVERAGE ( fact_weather_daily[temp_min_c] )

Total Rain (mm) = SUM ( fact_weather_daily[precipitation_mm] )

Rain Days =
CALCULATE (
    COUNTROWS ( fact_weather_daily ),
    fact_weather_daily[is_rain_day] = TRUE ()
)

Rain Day % =
DIVIDE ( [Rain Days], COUNTROWS ( fact_weather_daily ) )

Hottest Day (°C) = MAX ( fact_weather_daily[temp_max_c] )
```

> `Rain Days` uses `CALCULATE` to count only rows where our flag is true. `Rain Day %` uses `DIVIDE`, which handles divide-by-zero for you.
>
> Set formats: one decimal for temperatures, percentage for `Rain Day %`.

[DEMO: format strings set.]

### 50:00 Power BI report
[DEMO: ribbon → New report (from the model). Build: (1) slicer dim_city[city] as tiles; (2) 4 cards: Avg Max Temp, Total Rain, Rain Days, Rain Day %; (3) line chart: x = dim_date[year_month], y = Avg Max Temp, legend = dim_city[city]; (4) clustered column: x = dim_date[month_name], y = Total Rain; (5) table: city, Hottest Day, Rain Day %.]

> New report, straight from the model. All in the browser.
>
> - City slicer across the top.
> - Four cards for the headline numbers.
> - A line chart of average max temperature by month, one line per city. You can see Sydney's summer is everyone else's winter.
> - Rain by month in a column chart.
> - A table comparing cities.

[DEMO: click Lagos in slicer → visuals filter. Save report as `rpt_weather`.]

> Click Lagos and everything filters. That's the star schema doing its job.
>
> Save it as `rpt_weather`.

### 55:00 Pipeline + daily schedule
[DEMO: workspace → + New item → Data pipeline → name `pl_weather_daily`. Add Notebook activity → Settings → notebook nb_01_bronze_ingest. Add second Notebook activity → nb_02_silver_transform; drag the green "On success" arrow from activity 1 to 2. Third → nb_03_gold_model, On success from 2.]

> Last piece: automation. New data pipeline: `pl_weather_daily`.
>
> Three Notebook activities: bronze, silver, gold. Connect them with the green On success arrows. If bronze fails, silver never runs on half-loaded data.

[DEMO: optional fourth activity "Semantic model refresh" → sm_weather, On success from gold. Or open sm_weather settings → confirm "Keep your Direct Lake data up to date" is On.]

> Does the Power BI model need refreshing? With Direct Lake, a refresh doesn't reload data. It just points the model at the newest version of the Delta tables. That's called framing, and it takes seconds.
>
> Fabric can do this automatically. Check that "Keep your Direct Lake data up to date" is on in the model settings. If you want full control instead, add a Semantic model refresh activity at the end of the pipeline.
>
> The order matters:
> 1. Gold writes the tables.
> 2. The SQL endpoint syncs. That's the last cell of the gold notebook.
> 3. Then the model reframes.
>
> If the model reframes before the endpoint has synced, a SQL-endpoint Direct Lake model can still frame the old version. That's the classic "my report doesn't show the latest data" problem. Syncing first, then refreshing, removes it.

[DEMO: Run → watch three green ticks. Then Schedule → On → Daily → 06:00 → your time zone → Apply.]

> Run it once. Bronze, silver, gold: three green ticks.
>
> Then Schedule: daily, 6am. Done. Tomorrow morning your report has new data and you didn't touch anything.

### 59:00 Recap
[ON SCREEN: architecture diagram again, each box ticked.]

> So in one hour:
> - We pulled an API into a bronze lakehouse with an audit trail.
> - We flattened and merged it into silver, so reruns never duplicate.
> - We modeled a star schema in gold.
> - We forced the SQL endpoint to sync.
> - We queried it with T-SQL.
> - We built a Direct Lake model and a report.
> - We scheduled the whole thing.
>
> That's the same shape as most real Fabric projects. Only the source changes.
>
> All the code is linked below.
>
> Next, if the semantic model part went fast, watch my video on semantic models and Direct Lake. And if you want to ask this data questions in plain English, the Fabric data agents video uses this exact lakehouse. See you there.

## Chapters
```
0:00 What you'll build
0:30 Architecture: API → bronze → silver → gold → Power BI
3:00 Workspace + 3 lakehouses
6:00 Bronze: ingest an API with a notebook
16:00 Silver: flatten, clean and MERGE with PySpark
27:00 Gold: star schema (dim_city, dim_date, fact)
37:00 SQL analytics endpoint + views
42:00 Direct Lake semantic model + DAX measures
50:00 Power BI report
55:00 Pipeline + daily schedule
59:00 Recap
```

## Description + tags
**Build an end-to-end Microsoft Fabric data platform in one hour:** API ingestion, a medallion lakehouse (bronze, silver, gold), PySpark transforms, a star schema, the SQL analytics endpoint, a Direct Lake semantic model and a Power BI report, all scheduled with a pipeline.

A complete Microsoft Fabric project for 2026, with every line of code. No sample-data shortcuts.

What you'll learn:
- Calling a REST API from a Fabric notebook and landing raw JSON in OneLake
- Medallion architecture with three lakehouses
- Flattening nested JSON with arrays_zip + explode
- Idempotent Delta Lake MERGE
- Building dim and fact tables, and why V-Order matters for Direct Lake
- T-SQL on the SQL analytics endpoint
- Direct Lake semantic model, relationships and DAX measures
- Orchestrating notebooks in a data pipeline with a daily schedule

📂 Code: [LINK]
▶ Next: Semantic Models + Direct Lake: [LINK] · Fabric Data Agents: [LINK]

**Tags:** microsoft fabric, microsoft fabric end to end project, fabric tutorial 2026, medallion architecture, fabric lakehouse, delta lake, pyspark, onelake, direct lake, power bi, fabric data pipeline, data engineering project, sql analytics endpoint, star schema

## Shorts cutdowns
**Short 1: "Flatten nested JSON in one line" (≤40s)**
[ON SCREEN: "Your API returns arrays. Here's the fix."]
> Your API gives you JSON like this: dates in one list, temperatures in another, matched by position. Useless for Power BI.
>
> In a Fabric notebook, one move fixes it. `arrays_zip` glues the lists together by position. `explode` turns each pair into its own row.
>
> One city, one day, one row. Done.

[ON SCREEN: code `F.explode(F.arrays_zip("time","temperature_2m_max"))` → before/after table.]
> Full one-hour project on my channel.

**Short 2: "Why your pipeline makes duplicates" (≤40s)**
[ON SCREEN: "Rerun = duplicates?"]
> If rerunning your pipeline doubles your data, you're using append where you need merge.
>
> A Delta MERGE says: if this city and date already exist, update it. If not, insert it. Run it once or fifty times, same result.

[ON SCREEN: counts 1,830 → rerun → 1,830.]
> That's called idempotent, and it's what lets a 3am retry not wreck your reports.

**Short 3: "Don't build Power BI on views" (≤35s)**
[ON SCREEN: "Direct Lake + views = slow"]
> Quick Fabric tip. Direct Lake is fast because Power BI reads Delta tables straight from OneLake. A SQL view isn't a Delta table.
>
> Put a view in your Direct Lake model and those queries quietly fall back to DirectQuery, or don't work at all.
>
> Views are for people. Tables are for the model. Do the logic in your gold layer.

## LinkedIn post
> **A full Fabric data platform is 3 lakehouses, 3 notebooks and 1 pipeline.**
>
> [Diagram: API → Bronze (raw JSON + audit) → Silver (MERGE, 1 row per city/day) → Gold (star schema) → Direct Lake → Power BI. Pipeline box around the notebooks, clock icon.]
>
> I rebuilt one from scratch in an hour. My opinions after doing it:
> 1. **Pin the layer you write to, and add the layer you read from.** It removes most path confusion.
> 2. **Bronze appends, silver merges, gold overwrites** until it's too big to. Then partition.
> 3. **Put business rules (what counts as a "rain day") in gold, not DAX,** so every report agrees.
> 4. **Don't put views in a Direct Lake model.** Tables for the model, views for humans.
> 5. **End every write with a SQL endpoint metadata refresh.** The sync lag is the #1 "why is my data stale" cause.
>
> The full code-along is on my channel. What would you change?
