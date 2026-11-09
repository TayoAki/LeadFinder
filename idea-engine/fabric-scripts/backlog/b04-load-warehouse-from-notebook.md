# Backlog b04: Load a Fabric Warehouse from a Notebook

## Evidence
Stack Overflow `microsoft-fabric` tag:

| Views | Question | Answered |
|---|---|---|
| **8,509** | Load data to MS Fabric Warehouse from notebook | yes |
| **7,722** | Updating Fabric warehouse tables through a notebook | yes |
| 1,913 | Using System.Data.Sqlclient instead of Microsoft.Data.SqlClient when connecting to a Fabric datawarehouse | yes |
| 1,177 | Connection To Microsoft Fabric Warehouse using Nodejs | **no** |
| 653 | Can data transformations be done using python/SQL in Lakehouse/warehouse and vice versa? | yes |
| 572 | Getting Authentication failed error while connecting with MS Fabric data Warehouse Using Node js and Python | yes |
| 440 | Read tables from PBI semantic models and write data to Warehouse in Fabric | **no** |

That's about 21K views.

r/MicrosoftFabric:
- "Best Pattern for Incremental Ingestion into Fabric Warehouse: Dataflow Gen2 vs Stored Procedures?" (44 comments)
- "Connect to Fabric Warehouse From Python Notebook (mssql-python driver)"
- "Notebooks now failing when accessing a Fabric Datawarehouse in another workspace"
- "Spark vs. Warehouse ETL CU consumption: My test results" (79)

---

# 4 Ways to Load a Fabric Warehouse from a Notebook (and Which to Use)
- **Runtime target:** 10 min
- **Pillar:** search-driven how-to
- **Target keywords:** load fabric warehouse from notebook, fabric warehouse spark connector, synapsesql fabric, fabric warehouse pyodbc, update warehouse table notebook

**Title options**
1. 4 Ways to Load a Fabric Warehouse from a Notebook (and Which to Use)
2. Notebook → Fabric Warehouse: INSERT, UPDATE, MERGE the Right Way
3. Why You Can't Write to the SQL Endpoint (and What to Do Instead)

**Thumbnail:** notebook icon → arrow → warehouse icon, with a big "4 WAYS".

**Verify before recording**
- **Spark connector import paths and supported write modes.** `com.microsoft.spark.fabric` / `Constants`; `synapsesql()` write modes errorifexists/ignore/overwrite/append; cross-workspace support via `Constants.WorkspaceId`.
- **T-SQL notebooks and the `%%tsql` magic in Python notebooks:** current availability and GA status, and the `-artifact`/`-type` parameters.
- **Whether T-SQL `MERGE` is supported in Fabric Warehouse** (it was added in 2025). Confirm GA.
- **COPY INTO with OneLake as the source** (a newer feature). Confirm GA and the path syntax.
- **Token audience for pyodbc/mssql-python** against the warehouse SQL endpoint (`https://database.windows.net/.default`), and the notebookutils audience key that returns it.
- **Cross-workspace three-part names** from the warehouse to lakehouses in other workspaces.

## Hook (0:00–0:30)
"You built a DataFrame in a notebook and it needs to land in a Fabric Warehouse, not a lakehouse. Then someone asks you to update rows, and the SQL endpoint says it's read-only. Here are four ways to load a warehouse from a notebook, with code for each: Spark connector, T-SQL from Python, write-then-INSERT-SELECT, and COPY INTO. Then I'll tell you which one I use and why."

## Script

### 0:30 First: Warehouse vs SQL analytics endpoint
[ON SCREEN: Lakehouse → SQL analytics endpoint (read-only) | Warehouse (read/write T-SQL)]

"Half the confusion comes from this. Every lakehouse has a SQL analytics endpoint, and it's read-only. You can't INSERT or UPDATE there. A Warehouse is a separate item where T-SQL can write. If your connection string points at a lakehouse's endpoint, writes fail no matter what driver you use."

### 1:15 Way 1: the Spark connector (DataFrame → Warehouse)
[DEMO: PySpark notebook]

```python
import com.microsoft.spark.fabric
from com.microsoft.spark.fabric.Constants import Constants

df = spark.read.format("delta").load(
    "abfss://Sales_Dev@onelake.dfs.fabric.microsoft.com/lh_silver.Lakehouse/Tables/orders")

(df.write
   .mode("overwrite")                 # or "append"
   .synapsesql("wh_gold.dbo.orders")) # <warehouse>.<schema>.<table>
```

"Reading works the same way:"
```python
wh = spark.read.synapsesql("wh_gold.dbo.orders")
```

"Warehouse in another workspace? Pass its workspace ID:"
```python
(df.write.option(Constants.WorkspaceId, "<workspace-guid>")
   .mode("append").synapsesql("wh_gold.dbo.orders"))
```

"Good for full loads and appends. What it can't do is UPDATE or MERGE. For that you need T-SQL."

### 2:45 Way 2: write to the lakehouse, then INSERT…SELECT (my default)
"In the same workspace, a Warehouse can query any lakehouse's tables with three-part names. So land data as Delta in a lakehouse (Spark is great at that), then run one T-SQL statement:"

```sql
-- run in the warehouse (SQL editor, T-SQL notebook, or a pipeline Script activity)
INSERT INTO dbo.orders (order_id, customer_id, amount, order_date)
SELECT order_id, customer_id, amount, order_date
FROM lh_silver.dbo.orders_staging;
```

"And the update people ask about:"
```sql
UPDATE w
SET    w.amount = s.amount
FROM   dbo.orders AS w
JOIN   lh_silver.dbo.orders_staging AS s ON s.order_id = w.order_id;
```

"Or MERGE, if your warehouse supports it:"
```sql
MERGE dbo.orders AS t
USING lh_silver.dbo.orders_staging AS s
  ON t.order_id = s.order_id
WHEN MATCHED THEN UPDATE SET t.amount = s.amount
WHEN NOT MATCHED THEN INSERT (order_id, customer_id, amount, order_date)
     VALUES (s.order_id, s.customer_id, s.amount, s.order_date);
```

"One caveat from the community's top complaint: the lakehouse SQL endpoint can lag behind the Delta files. If you write staging and immediately run the INSERT, refresh the endpoint's metadata first. I have a whole video on that; link on screen."

### 4:30 Way 3: run T-SQL from a Python notebook
"You want the whole thing in one notebook: transform, then run the T-SQL. Two options.

Option A: a T-SQL notebook, or the T-SQL magic in a Python notebook, connected to the warehouse:"

```python
%%tsql -artifact wh_gold -type Warehouse
UPDATE dbo.orders SET status = 'shipped' WHERE ship_date IS NOT NULL;
```

"Option B: a driver with a token. Use this for anything outside Fabric, or when you need parameters and loops:"

```python
import struct, pyodbc

server = "<guid>.datawarehouse.fabric.microsoft.com"   # Warehouse → Settings → SQL connection string
db = "wh_gold"
token = notebookutils.credentials.getToken("https://database.windows.net/")
tb = token.encode("utf-16-le")
attrs = {1256: struct.pack(f"<I{len(tb)}s", len(tb), tb)}   # SQL_COPT_SS_ACCESS_TOKEN

conn = pyodbc.connect(
    f"Driver={{ODBC Driver 18 for SQL Server}};Server={server},1433;Database={db};Encrypt=yes;",
    attrs_before=attrs)
cur = conn.cursor()
cur.execute("UPDATE dbo.orders SET status = ? WHERE order_id = ?", "shipped", 1001)
conn.commit()
```

"The newer mssql-python driver works the same way with less boilerplate. The community has posted working examples; link in the description. Outside Fabric, get the token from azure-identity with the scope `https://database.windows.net/.default`, using a service principal that has a role on the workspace."

"Don't use pyodbc `executemany` for large loads. Row-by-row inserts into a warehouse are slow. Use it for control statements like UPDATE, MERGE and stored procedure calls, and move bulk data with Way 1, 2 or 4."

### 6:30 Way 4: COPY INTO
"Bulk-loading files, Parquet or CSV, straight into the warehouse:"

```sql
COPY INTO dbo.orders
FROM 'https://<storageaccount>.blob.core.windows.net/landing/orders/*.parquet'
WITH (FILE_TYPE = 'PARQUET');
```

"COPY INTO is the fastest way to load files into a warehouse. Newer releases also accept OneLake paths as the source. Check that on your tenant; it's in the description notes."

### 7:15 Which one should you use?
[ON SCREEN: decision table]

| Need | Use |
|---|---|
| DataFrame → table, full load or append | Spark connector `synapsesql` |
| Incremental UPDATE/MERGE | Lakehouse staging → T-SQL MERGE/UPDATE |
| Control from Python (params, loops) | pyodbc / mssql-python with a token |
| Bulk files | COPY INTO |

"My default is Way 2. Spark does the heavy transform into a lakehouse staging table, and one T-SQL MERGE moves it into the warehouse. Each engine does what it's good at. A community test comparing Spark and Warehouse ETL found the capacity cost fairly close, so pick on fit, not price."

### 8:30 The errors you'll hit
[ON SCREEN:]
- "Authentication failed": wrong token audience. It must be the database audience, not the Fabric API.
- "Cannot write to read-only…": you're connected to a lakehouse SQL endpoint, not the warehouse.
- "Invalid object name lh_silver.dbo…": the lakehouse is in another workspace, or the endpoint hasn't synced.
- "Notebook worked yesterday, fails cross-workspace": check the identity's role in the other workspace.

### 9:15 Wrap
"Warehouse is read/write T-SQL, the endpoint is read-only. Spark connector for DataFrames, staging plus MERGE for updates, a driver with a token for control, and COPY INTO for files. Code's below. Next: keeping secrets out of your notebooks with Key Vault."

## Chapters
0:00 Notebook → Warehouse
0:30 Warehouse vs SQL endpoint
1:15 Way 1: Spark connector
2:45 Way 2: lakehouse staging + INSERT/UPDATE/MERGE
4:30 Way 3: T-SQL from Python (magic, pyodbc)
6:30 Way 4: COPY INTO
7:15 Which to use
8:30 Common errors
9:15 Wrap

## Description + tags
Load and update a Microsoft Fabric Warehouse from a notebook: the Spark connector (synapsesql), lakehouse staging with T-SQL MERGE/UPDATE, pyodbc/mssql-python with a token, and COPY INTO. Includes a decision table and fixes for common errors.
Code: [link]

Tags: fabric warehouse notebook, synapsesql fabric, fabric warehouse spark connector, fabric warehouse pyodbc, fabric warehouse merge, copy into fabric warehouse

## Shorts cutdowns
**Short 1: "Why your UPDATE fails in Fabric" (35s)**
"UPDATE fails against your Fabric lakehouse? That's the SQL analytics endpoint, and it's read-only. Writes go to a Warehouse. Land data in the lakehouse, then MERGE it into the warehouse with one T-SQL statement."
[ON SCREEN: Endpoint = read-only · Warehouse = read/write]

**Short 2: "DataFrame to Warehouse in one line" (30s)**
"Spark DataFrame to a Fabric Warehouse table: `df.write.mode('append').synapsesql('wh.dbo.orders')`. Import the Fabric Spark connector first. Updates? That's T-SQL. Full video on my channel."

## LinkedIn post
"Load data to Fabric Warehouse from notebook" and "Update warehouse tables through a notebook" have 16K Stack Overflow views between them.

The pattern I recommend:

1. Spark transforms → Delta staging table in a lakehouse
2. One T-SQL MERGE: `USING lh_silver.dbo.orders_staging`
3. Refresh the SQL endpoint metadata before step 2

Why not write straight from Spark? `synapsesql()` handles append/overwrite but not UPDATE or MERGE. Why not pyodbc for everything? Row-by-row inserts are slow.

Each engine does what it's good at.

[Diagram: Notebook (Spark) → Lakehouse staging → T-SQL MERGE → Warehouse]

---

## Blog version

# How to Load a Fabric Warehouse from a Notebook

Fabric Warehouses accept writes through T-SQL. A lakehouse's SQL analytics endpoint is read-only, which is the source of most "can't write" errors. Here are four ways to load or update a warehouse from a notebook.

## Fabric Warehouse vs SQL analytics endpoint
- **Lakehouse SQL analytics endpoint:** read-only T-SQL over Delta tables.
- **Warehouse:** read/write T-SQL with transactions.

Make sure your connection points at the warehouse.

## Load with the Fabric Spark connector (synapsesql)
```python
import com.microsoft.spark.fabric
from com.microsoft.spark.fabric.Constants import Constants
df.write.mode("append").synapsesql("wh_gold.dbo.orders")
spark.read.synapsesql("wh_gold.dbo.orders")          # read
```
For other workspaces, add `.option(Constants.WorkspaceId, "<guid>")`. The supported modes are append, overwrite, ignore and errorifexists. There's no UPDATE or MERGE.

## Update and MERGE via lakehouse staging (recommended)
Write a Delta staging table with Spark, then run T-SQL in the warehouse using three-part names:
```sql
MERGE dbo.orders AS t
USING lh_silver.dbo.orders_staging AS s ON t.order_id = s.order_id
WHEN MATCHED THEN UPDATE SET t.amount = s.amount
WHEN NOT MATCHED THEN INSERT (order_id, customer_id, amount, order_date)
VALUES (s.order_id, s.customer_id, s.amount, s.order_date);
```
Refresh the lakehouse SQL endpoint's metadata first, so the staging table is current.

## Run T-SQL from Python with pyodbc and a token
```python
import struct, pyodbc
token = notebookutils.credentials.getToken("https://database.windows.net/").encode("utf-16-le")
attrs = {1256: struct.pack(f"<I{len(token)}s", len(token), token)}
conn = pyodbc.connect("Driver={ODBC Driver 18 for SQL Server};"
                      "Server=<guid>.datawarehouse.fabric.microsoft.com,1433;"
                      "Database=wh_gold;Encrypt=yes;", attrs_before=attrs)
conn.execute("UPDATE dbo.orders SET status='shipped' WHERE ship_date IS NOT NULL"); conn.commit()
```
Outside Fabric, get the token with azure-identity and the scope `https://database.windows.net/.default`. Use this for control statements, not bulk loads.

## Bulk-load files with COPY INTO
```sql
COPY INTO dbo.orders
FROM 'https://<account>.blob.core.windows.net/landing/orders/*.parquet'
WITH (FILE_TYPE = 'PARQUET');
```

## Which method to choose
- **Full load or append from a DataFrame:** Spark connector.
- **Incremental updates:** staging + MERGE.
- **Parameterized control:** pyodbc / mssql-python.
- **Files:** COPY INTO.

## Common errors
- **Authentication failed:** the token audience must be the database audience.
- **Read-only errors:** you're connected to a SQL endpoint, not the warehouse.
- **Invalid object name:** the lakehouse is in another workspace, or the endpoint metadata is stale.
