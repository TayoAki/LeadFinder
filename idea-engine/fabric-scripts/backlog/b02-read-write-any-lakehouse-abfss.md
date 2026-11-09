# Backlog b02: Read and Write Any Lakehouse from a Notebook (Not Just the Default)

## Evidence
Stack Overflow `microsoft-fabric` tag:

| Views | Question | Answered |
|---|---|---|
| **10,468** | Get the list of tables from fabric workspace using abfss path | yes |
| **9,229** | MS Fabric - Notebook data load from a lakehouse that's NOT default? | yes |
| 3,054 | Save spark dataframe as table using abfs path | yes |
| 2,060 | Tables are going to files folder instead of tables in fabric lakehouse | yes |
| 1,895 | Microsoft Fabric Lakehouse size and table sizes | **no** |
| 1,831 | How can I write to my Fabric Lakehouse via external app? | yes |
| 1,746 | Can't read files from OneLake shortcut to ADLS in Microsoft Fabric | yes |

That's about 30K views, which makes it the biggest single how-to cluster in the tag.

On Reddit:
- "Notebooks now failing when accessing a Fabric Datawarehouse in another workspace"
- "Struggling with cross-workspace warehouse limitations" (31 comments)

Forum: "Data Lakehouse and Notebook are no longer accessible", and threads on the default-lakehouse pin.

---

# Read & Write ANY Lakehouse in Fabric Notebooks (abfss Paths Explained)
- **Runtime target:** 9 min
- **Pillar:** search-driven how-to
- **Target keywords:** fabric abfss path, fabric notebook read another lakehouse, onelake abfss, fabric lakehouse not default, list tables lakehouse

**Title options**
1. Read & Write ANY Lakehouse in Fabric Notebooks (abfss Paths Explained)
2. Stop Pinning Default Lakehouses: The abfss Pattern for Fabric
3. Why Your Fabric Table Landed in "Files" (and How to Fix It)

**Thumbnail:** "NOT DEFAULT?" over two lakehouse icons connected by an arrow.

**Verify before recording**
- **Schema-enabled lakehouses (GA per community, Dec 2025):** the path is `Tables/<schema>/<table>`, and 3-part/4-part Spark SQL names (`workspace.lakehouse.schema.table`) are supported. Check current cross-workspace Spark SQL support.
- **The Lakehouse "List tables" REST API** is documented as not supporting schema-enabled lakehouses. Check whether that's still true.
- **`notebookutils` vs `mssparkutils`:** both work; `notebookutils` is the current name.
- **`notebookutils.fs.mount` / `getMountPath`** behavior in Spark vs pure Python notebooks.
- **Names with spaces or special characters in abfss paths:** use IDs. Confirm the current rules.

## Hook (0:00–0:30)
"Your notebook only reads the default lakehouse. You need data from another lakehouse, maybe in another workspace, and the table you wrote just landed in a folder called Unidentified. In nine minutes I'll show you one path format that reads and writes any lakehouse from any notebook, how to list every table in it, and why your tables end up in Files."

## Script

### 0:30 The one path you need
[ON SCREEN, large:]
```
abfss://<workspace>@onelake.dfs.fabric.microsoft.com/<lakehouse>.Lakehouse/Tables/<table>
```
"Every lakehouse lives in OneLake. OneLake speaks the same protocol as Azure Data Lake Storage, so every table has a full address. Workspace before the @, the lakehouse name plus `.Lakehouse`, then `Tables` or `Files`.

You can use names or IDs. Names are readable. IDs survive renames and don't break on spaces. In production I use IDs."

[DEMO: Lakehouse explorer → right-click a table → Properties → copy ABFS path. Show both forms.]

"You don't have to build these by hand. Right-click any table, Properties, and copy the ABFS path."

### 1:30 Read a table from a lakehouse that isn't the default
[DEMO: new notebook, no default lakehouse attached]

```python
ws = "Sales_Dev"                 # or the workspace GUID
lh = "lh_silver"                 # or the lakehouse GUID
base = f"abfss://{ws}@onelake.dfs.fabric.microsoft.com/{lh}.Lakehouse"

orders = spark.read.format("delta").load(f"{base}/Tables/orders")
display(orders.limit(10))
```

"No default lakehouse attached, and it still works. The default lakehouse only matters for two things: relative paths like `Tables/orders`, and short Spark SQL names like `SELECT * FROM orders`."

"Schema-enabled lakehouse? Add the schema to the path:"
```python
orders = spark.read.format("delta").load(f"{base}/Tables/sales/orders")
```

### 2:30 Write a real table to any lakehouse
```python
gold = "abfss://Sales_Prod@onelake.dfs.fabric.microsoft.com/lh_gold.Lakehouse"

(orders.groupBy("customer_id").count()
       .write.format("delta")
       .mode("overwrite")
       .option("overwriteSchema", "true")
       .save(f"{gold}/Tables/customer_order_counts"))
```

[DEMO: refresh lh_gold → table appears under Tables]

"Two things make this show up as a table: the format is Delta, and the path is under `/Tables/`. The lakehouse discovers Delta folders there and registers them automatically."

### 3:30 Why your table landed in Files or "Unidentified"
[ON SCREEN: three causes]

"If you see your data in Files or in an Unidentified folder, it's one of these:

1. You wrote Parquet or CSV instead of Delta. Only Delta folders under Tables become tables.
2. You wrote to `/Files/...` instead of `/Tables/...`.
3. On a schema-enabled lakehouse, you wrote directly under `Tables/` without a schema folder, or nested one folder too deep."

```python
# ❌ shows up as Unidentified
df.write.mode("overwrite").parquet(f"{gold}/Tables/customers")
# ✅ real table
df.write.format("delta").mode("overwrite").save(f"{gold}/Tables/customers")
```

### 4:15 Spark SQL across lakehouses
"Prefer SQL? Lakehouses in the same workspace as your default lakehouse can be queried with two-part names:"

```python
spark.sql("""
  SELECT c.customer_id, COUNT(*) AS orders
  FROM lh_silver.orders o
  JOIN lh_silver.customers c ON o.customer_id = c.customer_id
  GROUP BY c.customer_id
""")
```

"Across workspaces, the reliable way is the abfss path, or register a temp view first:"

```python
spark.read.format("delta").load(f"{base}/Tables/orders").createOrReplaceTempView("orders_dev")
spark.sql("SELECT COUNT(*) FROM orders_dev").show()
```

"Or use shortcuts: a shortcut in your lakehouse that points at the other lakehouse's table. Then it looks local to everything, including the SQL endpoint and Power BI."

### 5:15 List every table in a lakehouse
"The question with ten thousand views: how do I list the tables from an abfss path?"

```python
tables = notebookutils.fs.ls(f"{base}/Tables")
for t in tables:
    print(t.name, t.path)
```

"On a schema-enabled lakehouse, go one level deeper:"
```python
for schema in notebookutils.fs.ls(f"{base}/Tables"):
    for t in notebookutils.fs.ls(schema.path):
        print(f"{schema.name}.{t.name}")
```

"Want row counts and sizes too? That's the unanswered question on Stack Overflow, so here it is:"

```python
from delta.tables import DeltaTable
for t in notebookutils.fs.ls(f"{base}/Tables"):
    d = DeltaTable.forPath(spark, t.path).detail().select("numFiles", "sizeInBytes").first()
    print(f"{t.name:30} files={d.numFiles:>6}  size={d.sizeInBytes/1e6:,.1f} MB")
```

"`DESCRIBE DETAIL` gives you file counts and bytes per table without scanning the data."

### 6:30 Pure Python notebooks (no Spark)
"In a Python notebook there's no `spark`. Use the deltalake library with a OneLake token:"

```python
from deltalake import DeltaTable
token = notebookutils.credentials.getToken("storage")
opts = {"bearer_token": token, "use_fabric_endpoint": "true"}
dt = DeltaTable(f"{base}/Tables/orders", storage_options=opts)
df = dt.to_pandas()
```

"That's also how an external app writes to a lakehouse, the 1,800-view question. Same path, same library, with a token from a service principal that has a role on the workspace."

### 7:30 Permissions: why it works for you and fails for the scheduled run
"Your notebook reads other lakehouses as whoever runs it. Interactively, that's you. In a scheduled pipeline, it's the identity the pipeline runs as. If the read works when you click Run but fails at 2 a.m., the scheduled identity doesn't have access to the other workspace. Give it a role there, or use a shortcut."

### 8:15 Wrap
"One path format: workspace at onelake, lakehouse dot Lakehouse, Tables, table. Write Delta under Tables. Use IDs in production and shortcuts when you want things to look local. The code is in the description. Next: writing pandas and polars to Delta without Spark."

## Chapters
0:00 The default-lakehouse trap
0:30 The abfss path format
1:30 Read a non-default lakehouse
2:30 Write a table to any lakehouse
3:30 Why tables land in Files / Unidentified
4:15 Spark SQL across lakehouses
5:15 List every table (+ sizes)
6:30 Pure Python notebooks
7:30 Why scheduled runs fail
8:15 Wrap

## Description + tags
Read and write any Microsoft Fabric lakehouse from a notebook, not just the default one, using OneLake abfss paths. List all tables with sizes, fix tables landing in Files/Unidentified, and query across lakehouses and workspaces.
Code: [link]

Tags: fabric abfss path, onelake abfss, fabric notebook default lakehouse, read another lakehouse fabric, fabric list tables, fabric unidentified folder, notebookutils

## Shorts cutdowns
**Short 1: "Why your table is Unidentified" (40s)**
"Wrote a table in Fabric and it shows up as Unidentified? Two rules. It has to be Delta, not Parquet. And it has to be under Tables, not Files. Swap `.parquet()` for `.format('delta').save()`, refresh, done."
[ON SCREEN: ❌ .parquet → ✅ .format("delta")]

**Short 2: "You don't need a default lakehouse" (35s)**
"Fabric notebook, no default lakehouse, reading data anyway. Right-click any table, Properties, copy ABFS path. `spark.read.format('delta').load(path)`. Any lakehouse, any workspace."
[ON SCREEN: the abfss template]

## LinkedIn post
The most-viewed Fabric notebook question on Stack Overflow is some version of: "How do I read a lakehouse that isn't my default?"

Answer: you never needed the default.

`abfss://<workspace>@onelake.dfs.fabric.microsoft.com/<lakehouse>.Lakehouse/Tables/<table>`

• Read: `spark.read.format("delta").load(path)`
• Write: `.format("delta").save(path)`, under /Tables/ or it lands in Unidentified
• List: `notebookutils.fs.ls(".../Tables")`
• Production: use IDs, not names

The default lakehouse only matters for relative paths and short SQL names. I've stopped pinning one.

[Diagram: notebook → 3 lakehouses in 2 workspaces via abfss]

---

## Blog version

# Read and Write Any Lakehouse from a Fabric Notebook (abfss Paths)

A Fabric notebook doesn't need a default lakehouse to read or write data. Every lakehouse table has a full OneLake address, and Spark, Python and external apps can all use it.

## The OneLake abfss path format
```
abfss://<workspace>@onelake.dfs.fabric.microsoft.com/<lakehouse>.Lakehouse/Tables/<table>
```
- **Workspace and lakehouse:** you can use names or GUIDs. GUIDs survive renames and handle special characters.
- **Schema-enabled lakehouses** add a schema: `.../Tables/<schema>/<table>`.
- **To copy a path,** right-click a table in the Lakehouse explorer → Properties → ABFS path.

## Read a lakehouse that isn't the default
```python
base = "abfss://Sales_Dev@onelake.dfs.fabric.microsoft.com/lh_silver.Lakehouse"
orders = spark.read.format("delta").load(f"{base}/Tables/orders")
```
The default lakehouse is only needed for relative paths (`Tables/orders`) and short Spark SQL names.

## Write a Delta table to any lakehouse
```python
gold = "abfss://Sales_Prod@onelake.dfs.fabric.microsoft.com/lh_gold.Lakehouse"
df.write.format("delta").mode("overwrite").save(f"{gold}/Tables/customer_order_counts")
```
Fabric registers Delta folders under `/Tables/` as tables automatically.

## Why tables land in Files or "Unidentified"
- You wrote **Parquet/CSV instead of Delta**.
- You wrote under **/Files/** instead of **/Tables/**.
- On a **schema-enabled lakehouse**, the schema folder is missing or the nesting is wrong.

## List all tables in a lakehouse (with sizes)
```python
from delta.tables import DeltaTable
for t in notebookutils.fs.ls(f"{base}/Tables"):
    d = DeltaTable.forPath(spark, t.path).detail().select("numFiles","sizeInBytes").first()
    print(t.name, d.numFiles, round(d.sizeInBytes/1e6, 1), "MB")
```

## Query across lakehouses and workspaces
- **Same workspace:** `spark.sql("SELECT * FROM lh_silver.orders")`.
- **Other workspaces:** load by abfss path and `createOrReplaceTempView`, or create a **OneLake shortcut** so the table looks local to Spark, the SQL endpoint and Power BI.

## Pure Python notebooks and external apps
```python
from deltalake import DeltaTable
opts = {"bearer_token": notebookutils.credentials.getToken("storage"),
        "use_fabric_endpoint": "true"}
df = DeltaTable(f"{base}/Tables/orders", storage_options=opts).to_pandas()
```
External apps use the same path with a token from a service principal that has a role on the workspace.

## Scheduled runs fail but interactive runs work
Notebooks access other lakehouses as the identity running them. A scheduled pipeline may run as a different identity. Grant that identity a workspace role on the source workspace, or use a shortcut.
