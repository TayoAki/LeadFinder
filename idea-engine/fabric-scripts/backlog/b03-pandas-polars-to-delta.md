# Backlog b03: Write pandas or polars DataFrames to Delta Tables in Fabric (No Spark)

## Evidence
Stack Overflow `microsoft-fabric` tag:

| Views | Question | Answered |
|---|---|---|
| **9,765** | Writing a polars dataframe to a delta table in Microsoft Lakehouse | yes |
| 3,551 | Microsoft Fabric-Delta parquet format? | yes |
| 1,953 | How to optimize performance when writing Delta Table in Spark (Microsoft Fabric)? | **no** |
| 192 | Fabric Python Notebook error when trying to write Parquet File | **no** |
| 142 | Pandas converting string into a datetime error when writing to a Delta Lake | **no** |

r/MicrosoftFabric:
- "How do single node Python users actually write Delta tables using DuckDB for ETL when it can't actually write…" (62 comments)
- "How far Python alone can take you on Delta" (40)
- "Fine, NO MORE M. Convert it to PySpark, DuckDB, Polars, or Pandas instead." (23)
- "Fabric Performance Benchmarking - Spark versus Python Notebooks" (37)
- "Pure Python notebook is finally with 3.12" (65 upvotes)
- "Feature Request: Python Job" (38)

Single-node Python is clearly a rising topic, and the main friction is writing Delta.

---

# Write pandas & polars to Delta in Fabric: No Spark Needed
- **Runtime target:** 9 min
- **Pillar:** search-driven how-to
- **Target keywords:** polars delta fabric, pandas to delta table fabric, fabric python notebook delta, write_deltalake onelake, duckdb fabric

**Title options**
1. Write pandas & polars to Delta in Fabric: No Spark Needed
2. Fabric Python Notebooks: The Cheap Way to Write Delta Tables
3. DuckDB, polars, pandas → Fabric Lakehouse in 3 Lines

**Thumbnail:** pandas, polars and duck logos → Delta triangle, with the text "NO SPARK".

**Verify before recording**
- **Default packages in the Fabric Python notebook runtime** (deltalake, polars, duckdb versions). The community says the runtime is now on Python 3.12. If `deltalake` isn't preinstalled, `%pip install deltalake`.
- **`deltalake` storage_options keys for OneLake:** `bearer_token` and `use_fabric_endpoint`. Confirm against the delta-rs docs version in the runtime.
- **Whether delta-rs writes now apply V-Order.** As of mid-2026 they do not. Confirm, and see Direct Lake performance below.
- **Which table features / writer versions the SQL analytics endpoint reads** (e.g. deletion vectors, column mapping from delta-rs).
- **DuckDB native Delta write support** (the `delta` extension was read-only through 2025). Check whether it can write now.
- **`notebookutils.credentials.getToken("storage")` audience name.**

## Hook (0:00–0:30)
"Spinning up Spark to write 50,000 rows is like hiring a bus to drive one person. Fabric's Python notebooks start fast and use less capacity, but writing a Delta table from pandas or polars trips everyone up. In nine minutes: pandas to Delta, polars to Delta, DuckDB to Delta, the datetime error that breaks it, and when you should go back to Spark."

## Script

### 0:30 Why Python notebooks
[ON SCREEN: Spark notebook vs Python notebook: start time, cores, use case]

"A Spark notebook starts a cluster. A Python notebook is a single machine with pandas, polars and DuckDB ready to go. For small and medium data, which is most API pulls, files and reference tables, it's faster to start and cheaper on capacity. The catch is that Spark writes Delta natively and pandas doesn't. The `deltalake` library fills that gap."

### 1:15 Setup: attach a lakehouse
[DEMO: New item → Notebook → language dropdown → Python (not PySpark). Add lakehouse `lh_bronze` as default.]

"Attaching a default lakehouse mounts it at `/lakehouse/default`. That gives you a local path, which is the simplest way to write."

```python
import deltalake, polars as pl, pandas as pd, duckdb
print(deltalake.__version__, pl.__version__, duckdb.__version__)
```

### 2:00 pandas → Delta
```python
from deltalake import write_deltalake
import pandas as pd, requests

rows = requests.get("https://jsonplaceholder.typicode.com/posts").json()
pdf = pd.DataFrame(rows)

write_deltalake("/lakehouse/default/Tables/posts", pdf, mode="overwrite")
```

[DEMO: refresh lakehouse → `posts` appears under Tables → click it → preview]

"That's it: a real Delta table. Overwrite replaces it, append adds rows. If your columns change, add `schema_mode='overwrite'` for overwrites or `schema_mode='merge'` for appends."

### 3:00 polars → Delta (the 9,700-view question)
```python
df = pl.read_csv("https://raw.githubusercontent.com/datasets/airport-codes/main/data/airport-codes.csv")
df.write_delta("/lakehouse/default/Tables/airports", mode="overwrite")
```

"polars calls the same deltalake library under the hood. To write somewhere that isn't the default lakehouse, use the full OneLake path and pass a token:"

```python
token = notebookutils.credentials.getToken("storage")
opts = {"bearer_token": token, "use_fabric_endpoint": "true"}
path = "abfss://Sales_Dev@onelake.dfs.fabric.microsoft.com/lh_silver.Lakehouse/Tables/airports"

df.write_delta(path, mode="overwrite", storage_options=opts)
# pandas equivalent:
# write_deltalake(path, pdf, mode="overwrite", storage_options=opts)
```

"Use the local path when you can, and the abfss path plus token when you can't."

### 4:00 DuckDB → Delta
"DuckDB is great for SQL over files. Its Delta extension has been read-only, so it can't write Delta directly. The trick is to hand the result to deltalake as Arrow, with no copy in pandas."

```python
con = duckdb.connect()
result = con.sql("""
    SELECT type, iso_country, COUNT(*) AS airports
    FROM read_csv_auto('https://raw.githubusercontent.com/datasets/airport-codes/main/data/airport-codes.csv')
    GROUP BY ALL
""").arrow()

write_deltalake("/lakehouse/default/Tables/airports_by_country", result, mode="overwrite")
```

"And DuckDB reads Delta tables back fine:"
```python
con.sql("SELECT * FROM delta_scan('/lakehouse/default/Tables/airports_by_country') LIMIT 5")
```

### 5:00 The datetime error (and two more gotchas)
[ON SCREEN: "Gotcha 1: timestamps"]

"pandas stores timestamps in nanoseconds. Delta and the SQL endpoint expect microseconds. Depending on library versions you'll get a write error, or a table the SQL endpoint shows wrong. Fix it before writing:"

```python
pdf["created_at"] = pd.to_datetime(pdf["created_at"], utc=True).astype("datetime64[us, UTC]")
# polars:
df = df.with_columns(pl.col("created_at").str.to_datetime(time_zone="UTC").dt.cast_time_unit("us"))
```

"Gotcha 2: strings that are sometimes numbers. pandas makes them `object` columns, and the write fails or picks the wrong type. Cast explicitly: `pdf['zip'] = pdf['zip'].astype('string')`.

Gotcha 3: column names. Spaces and special characters work in Delta, but they cause pain in the SQL endpoint and Power BI. Clean them once:"
```python
pdf.columns = [c.strip().lower().replace(" ", "_") for c in pdf.columns]
```

### 6:15 Small files and Direct Lake
"Two things delta-rs doesn't do like Spark does.

First, every append writes new small files. Run maintenance now and then:"

```python
from deltalake import DeltaTable
dt = DeltaTable("/lakehouse/default/Tables/posts")
dt.optimize.compact()
dt.vacuum(retention_hours=168, dry_run=False)
```

"Second, V-Order, the Fabric-specific file layout that makes Direct Lake and the SQL endpoint faster. Spark in Fabric applies it. delta-rs doesn't, as far as I know. If a gold table feeds a big Direct Lake model, write that final table with Spark, or run a Spark `OPTIMIZE ... VORDER` on it. Bronze and silver from Python are fine."

### 7:15 When to go back to Spark
[ON SCREEN: decision list]

"Stay in Python when the data fits comfortably in one machine's memory, the job is mostly I/O like API calls and files, or you want fast starts.

Use Spark when the data is bigger than memory, when you need MERGE across large tables, when it's a gold table feeding Direct Lake, or when the rest of your platform is already Spark.

You can mix them: Python notebooks for ingestion, Spark for the heavy joins."

### 8:15 Wrap
"So: `write_deltalake` or `write_delta` to `/lakehouse/default/Tables`, a token for other lakehouses, DuckDB via Arrow, fix nanosecond timestamps, and compact now and then. Code's in the description. Next up: loading a Fabric Warehouse from a notebook."

## Chapters
0:00 Spark is overkill for small data
0:30 Why Python notebooks
1:15 Setup
2:00 pandas → Delta
3:00 polars → Delta (+ other lakehouses)
4:00 DuckDB → Delta
5:00 The datetime error + 2 gotchas
6:15 Small files and V-Order
7:15 When to go back to Spark
8:15 Wrap

## Description + tags
Write pandas, polars and DuckDB results to Delta tables in a Microsoft Fabric lakehouse from a Python notebook, without Spark. Covers write_deltalake, polars write_delta, OneLake tokens for other lakehouses, the nanosecond timestamp error, compaction and V-Order.
Code: [link]

Tags: polars delta fabric, pandas delta table, fabric python notebook, write_deltalake onelake, duckdb fabric lakehouse, delta-rs fabric

## Shorts cutdowns
**Short 1: "polars to Fabric in one line" (30s)**
"polars DataFrame to a Fabric lakehouse table: `df.write_delta('/lakehouse/default/Tables/airports')`. One line. Python notebook, no Spark, real Delta table. Other lakehouse? Pass a token. It's in the full video."
[ON SCREEN: the one line]

**Short 2: "The pandas timestamp trap" (40s)**
"Writing pandas to Delta in Fabric and your timestamps break? pandas uses nanoseconds, Delta uses microseconds. One line before you write: `.astype('datetime64[us, UTC]')`. Fixed."
[ON SCREEN: ns → us]

## LinkedIn post
Unpopular opinion: most Fabric ingestion notebooks don't need Spark.

API pulls, CSVs, reference data, anything that fits in memory: a Python notebook with polars or DuckDB starts in seconds and uses a fraction of the capacity.

The friction was always writing Delta. It's solved:
• pandas → `write_deltalake("/lakehouse/default/Tables/x", df)`
• polars → `df.write_delta(...)`
• DuckDB → `.arrow()` → `write_deltalake`

Two caveats: convert ns timestamps to µs, and compact small files. For the gold tables behind big Direct Lake models, I still let Spark write them (V-Order).

[Diagram: Python notebook (bronze/silver) → Spark (gold) → Direct Lake]

Where do you draw the Spark line?

---

## Blog version

# How to Write pandas and polars DataFrames to Delta Tables in Microsoft Fabric

Fabric's Python notebooks run single-node Python with pandas, polars and DuckDB. For small and medium data they start faster and use less capacity than Spark. Here's how to write their output as Delta tables in a lakehouse.

## pandas to a Delta table in Fabric
Attach a default lakehouse (it mounts at `/lakehouse/default`), then:
```python
from deltalake import write_deltalake
write_deltalake("/lakehouse/default/Tables/posts", pdf, mode="overwrite")
```
Use `mode="append"` to add rows, and `schema_mode="merge"` (append) or `"overwrite"` (overwrite) when columns change.

## polars write_delta to a Fabric lakehouse
```python
df.write_delta("/lakehouse/default/Tables/airports", mode="overwrite")
```
To write to a lakehouse that isn't the default, use its OneLake path and a storage token:
```python
opts = {"bearer_token": notebookutils.credentials.getToken("storage"),
        "use_fabric_endpoint": "true"}
df.write_delta("abfss://<ws>@onelake.dfs.fabric.microsoft.com/<lh>.Lakehouse/Tables/airports",
               mode="overwrite", storage_options=opts)
```

## DuckDB to Delta in Fabric
DuckDB's Delta extension reads Delta but hasn't been able to write it. Convert the result to Arrow and write it with deltalake:
```python
result = duckdb.sql("SELECT ... FROM read_csv_auto('...')").arrow()
write_deltalake("/lakehouse/default/Tables/summary", result, mode="overwrite")
```
Read it back with `delta_scan('/lakehouse/default/Tables/summary')`.

## Fix the pandas datetime error when writing Delta
pandas timestamps are nanoseconds, and Delta expects microseconds. Convert before writing:
```python
pdf["created_at"] = pd.to_datetime(pdf["created_at"], utc=True).astype("datetime64[us, UTC]")
```
- **Cast mixed-type `object` columns explicitly**, e.g. `.astype("string")`.
- **Clean column names** (lowercase, underscores) so the SQL endpoint and Power BI behave.

## Compaction, vacuum and V-Order
Appends from delta-rs create small files. Compact and vacuum periodically:
```python
from deltalake import DeltaTable
dt = DeltaTable("/lakehouse/default/Tables/posts")
dt.optimize.compact(); dt.vacuum(retention_hours=168, dry_run=False)
```
Fabric Spark applies V-Order, a layout that speeds up Direct Lake and the SQL endpoint. delta-rs doesn't. Write gold tables behind large Direct Lake models with Spark, or optimize them with Spark.

## When to use Spark instead
- **Data larger than memory.**
- **Large MERGE operations.**
- **Gold tables feeding Direct Lake.**

Python notebooks for ingestion plus Spark for heavy transformation is a common, cost-effective split.
