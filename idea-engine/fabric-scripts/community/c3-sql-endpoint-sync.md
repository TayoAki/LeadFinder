# Community C3: SQL Analytics Endpoint Not Showing Your Data? Why, and 3 Fixes

## Evidence: why this piece exists
**Scale of the theme:**
- **Reddit:** 13 threads, ~500 comments.
- **Forum:** 13 threads.
- **The #1 recurring single bug complaint.** It also shows up inside other threads: a Dataflow Gen2 reliability post blames "the 'sql endpoint' bug that won't reflect changes after hours have passed."

**Key Reddit threads:**
- **"Lakehouse SQL Endpoint Rant"** (68 comments, 61 upvotes). An hour spent debugging a working notebook; the real issue was that the endpoint hadn't refreshed. The poster's refresh-API cell "mostly just errors".
- **"LH metadata refresh - what was the thinking?"** (55 comments). Claims ~90% of lakehouse users need a workaround; the docs say "seconds or minutes."
- **"Best way to refresh SQL Endpoint of Lakehouse?"** (44 comments).
  - Lists the options: the old long notebook, `POST …/sqlEndpoints/{id}/refreshMetadata`, and `REFRESH TABLE`, which **does not** update the endpoint.
  - The poster later measured ~17 seconds average lag.
- **"New metadata sync in SQL Analytics Endpoint (Preview)"** (43 comments). An on-demand sync where queries check freshness.
- **"More Fabric Bullshit: SQL Endpoint Analytics Endpoint Never Syncs"** (20).
- **New releases:**
  - "Metadata Sync Improvements…" (18 comments, 44 upvotes): a new pipeline activity, **Refresh SQL endpoint**.
  - "Refresh SQL Endpoint and lakehouse maintenance pipeline activity" (41 upvotes): also a native **Lakehouse maintenance** activity for OPTIMIZE/VACUUM.
  - "Dataflow Gen2: Lakehouse data is now immediately queryable through the SQL analytics endpoint after refresh" (45 upvotes). Dataflow Gen2 now syncs the endpoint as part of refresh, with an opt-out under Advanced options.

**Forum threads:**
- "Lakehouse do not see data from last few days (in SQL…"
- "Programmatically Refresh & Sync SQL Analytics Endpoint"
- "Intermittent error in the Refresh SQL analytics endpoint activity"
- "Direct Lake Semantic Model not showing latest data"
- "How to delete an orphaned Fabric SQL Analytics Endpoint"

**Stack Overflow:** "Refreshing Lakehouse data during a notebook session" (1.4K views); "Tables are going to files folder instead of tables" (2K views).

---

# Wk C3: SQL Analytics Endpoint Not Showing Your Data? Here's Why (and 3 Fixes)
- **Runtime target:** 10–11 min.
- **Pillar:** Community ask (troubleshooting). Pairs with videos 2, 3 and 4.
- **Target keywords:**
  - "sql analytics endpoint", "fabric sql endpoint not updating", "refresh sql endpoint", "lakehouse sql endpoint", "fabric lakehouse" (390/mo).
  - "fabric warehouse" (12.1K/mo, 1.16×) is adjacent traffic.
  - Problem-phrased searches: people find this when stuck.
- **Title options:**
  1. SQL Analytics Endpoint Not Showing Your Data? Here's Why (and 3 Fixes)
  2. Your Fabric Lakehouse Isn't Broken. The SQL Endpoint Is Just Behind.
  3. Fix Stale Data in Microsoft Fabric in 10 Minutes (Refresh SQL Endpoint)
- **Thumbnail:** "STALE DATA?", showing a notebook "✓ 10,000 rows" next to a SQL query "0 rows" with a clock icon.
- **Verify before recording:**
  - The new on-demand metadata sync in the SQL analytics endpoint: preview or GA? How do you enable it, and does it add query latency?
  - The **Refresh SQL endpoint** pipeline activity (community, 2026): exact name, GA status, and the "intermittent error" forum reports.
  - The REST API:
    - Path `POST /v1/workspaces/{workspaceId}/sqlEndpoints/{sqlEndpointId}/refreshMetadata`.
    - Whether `?preview=true` is still needed.
    - Whether it is long-running (202 + polling), and its response shape (per-table status).
  - sempy's `FabricRestClient` (whether `post` supports `lro_wait`), and whether semantic-link-labs has a `refresh_sql_endpoint_metadata` helper.
  - That Dataflow Gen2's auto-sync has rolled out to all regions, and the opt-out setting's name ("Synchronize SQL Analytics Endpoint metadata").
  - Whether Direct Lake on OneLake depends on SQL endpoint metadata. It is expected not to, since it reads Delta directly; Direct Lake on SQL endpoint does.
  - The Lakehouse maintenance pipeline activity (OPTIMIZE/VACUUM) status.
  - That `spark.sql("REFRESH TABLE …")` still doesn't sync the endpoint (community claim).

## Hook (0:00–0:30)
"Your notebook says it wrote ten thousand rows. You query the lakehouse's SQL endpoint, and the new rows aren't there. You start debugging code that isn't broken. This is one of the most complained-about things in Microsoft Fabric. In ten minutes you'll know why it happens, the three ways to fix it (in a pipeline, in a notebook and automatically), and the habits that make it happen less."

## Script

### 0:30 – Why this happens
[ON SCREEN: diagram. Spark/notebook → writes Delta files + `_delta_log` in OneLake. A separate box, "SQL analytics endpoint (SQL engine)", with its own "table metadata" cache. An arrow labelled "metadata sync (background)" between them.]

"Here's what's going on. Your lakehouse stores tables as Delta files in OneLake. When Spark writes, it adds Parquet files and a new entry in the Delta log. That's the source of truth, and it's correct the moment the write finishes.

The SQL analytics endpoint is a separate SQL engine sitting on top. It keeps its own picture of which tables exist and which version of each to read. A background process called metadata sync updates that picture by reading the Delta logs.

When the sync is behind, SQL reads an older version, or doesn't see a new table at all. Your data isn't lost. The SQL engine just hasn't been told yet.

Usually the lag is seconds. One community member measured about 17 seconds on average. But it gets worse with many tables, big Delta logs, lots of small writes, or a busy capacity. And when a pipeline writes and then immediately queries through SQL, even 17 seconds is enough to break it."

### 2:00 – How to spot it
[DEMO: Notebook cell → `spark.sql("SELECT COUNT(*) FROM lh_silver.customers")` → 10,000. SQL endpoint query → `SELECT COUNT(*) FROM dbo.customers` → 9,000.]

"Quick test: count the rows in the same table from Spark and from the SQL endpoint. If Spark is right and SQL is behind, it's sync, not your code.

Also check the Delta history to confirm the write happened:"

```python
display(spark.sql("DESCRIBE HISTORY lh_silver.customers").select("version", "timestamp", "operation").limit(5))
```

"If the newest version is there in Spark, stop debugging your ETL."

### 3:00 – A wrong fix people try
"First, a fix that doesn't work. `spark.sql('REFRESH TABLE customers')` refreshes Spark's own cache. It doesn't tell the SQL endpoint anything. The community has tested this. Skip it."

### 3:20 – Fix 1: refresh in your pipeline
[DEMO: Data pipeline canvas → Notebook activity `nb_silver_transform` → add activity **Refresh SQL endpoint** → choose workspace + lakehouse SQL endpoint → connect on success → then Semantic model refresh / downstream activity.]

"The cleanest fix, if you orchestrate with pipelines, is a dedicated activity. Data Factory added a **Refresh SQL endpoint** activity. Put it right after the step that writes the tables, and before anything that reads through SQL: a stored procedure, a semantic model refresh or a copy into the warehouse.

Write, then refresh the endpoint, then read. That one ordering rule fixes most cases.

While you're in there, there's also a new Lakehouse maintenance activity for OPTIMIZE and VACUUM. Hold that thought; it matters in a minute."

### 4:30 – Fix 2: refresh from a notebook (REST API)
[DEMO: last cell of the writing notebook]

"If your orchestration is notebooks, call the REST API at the end of the write. Here's a version using semantic link, which is built into Fabric notebooks, so you don't handle tokens yourself:"

```python
import time
import sempy.fabric as fabric

client = fabric.FabricRestClient()
workspace_id = fabric.get_workspace_id()
lakehouse_name = "lh_silver"

# 1. Find the lakehouse and its SQL endpoint ID
items = fabric.list_items(type="Lakehouse", workspace=workspace_id)
lakehouse_id = items.loc[items["Display Name"] == lakehouse_name, "Id"].iloc[0]
lh = client.get(f"/v1/workspaces/{workspace_id}/lakehouses/{lakehouse_id}").json()
sql_endpoint_id = lh["properties"]["sqlEndpointProperties"]["id"]

# 2. Ask the endpoint to sync its metadata
resp = client.post(f"/v1/workspaces/{workspace_id}/sqlEndpoints/{sql_endpoint_id}/refreshMetadata", json={})

# 3. It can run as a long-running operation: poll until done
if resp.status_code == 202:
    op_url = resp.headers["Location"]
    for _ in range(60):
        time.sleep(int(resp.headers.get("Retry-After", 5)))
        status = client.get(op_url).json()
        if status.get("status") in ("Succeeded", "Failed"):
            print(status.get("status"))
            break
else:
    print(resp.status_code, resp.text[:500])
```

"Three steps: find the SQL endpoint ID from the lakehouse, call `refreshMetadata`, and wait for it to finish. If it fails, print the response. It tells you which tables failed to sync, which often points to a broken table or a huge log.

If you'd rather not write this, the semantic-link-labs library has helpers for it. Check its docs for the current function name."

### 6:15 – Fix 3: let Fabric do it
[ON SCREEN: two cards. "Dataflow Gen2 → auto sync after refresh (default on)" and "SQL endpoint on-demand metadata sync (new)".]

"The third fix is to let Fabric handle it. Two changes landed this year.

**Dataflow Gen2** now syncs the SQL endpoint as part of its refresh when it writes to a lakehouse. When the refresh finishes, the data is queryable through SQL. It's on by default. There's an opt-out in the destination's advanced options, for huge lakehouses where the sync adds refresh time.

**The SQL analytics endpoint itself** has a new metadata sync mode that checks whether it's up to date when you query, and syncs on demand. If you can turn it on, it's the real fix: a query might take a little longer, but it returns current data. Check whether it's preview or GA in your region before you rely on it in production."

### 7:30 – Make it happen less
[ON SCREEN: checklist]

"Even with the fixes, these habits keep sync fast:

1. **Fewer, bigger writes.** Thousands of tiny appends mean thousands of log entries to process. Batch your writes.
2. **Keep tables healthy.** Run OPTIMIZE to compact small files and VACUUM to clean old ones, with the new Lakehouse maintenance activity or a scheduled notebook. One forum thread was literally about a huge `_delta_log` after repeated overwrites.
3. **Don't overwrite whole tables when you can merge.** Full overwrites on every run grow history fast.
4. **Write, sync, then read**, in that order, in every pipeline.
5. **Know which consumers care.** Direct Lake on OneLake reads Delta directly, and Spark reads Delta directly. The SQL endpoint, and anything built on it like Direct Lake on SQL endpoint, views and T-SQL clients, depends on the sync."

### 8:45 – A quick decision guide, and recap
[ON SCREEN: table]

| You orchestrate with… | Do this |
|---|---|
| Data pipelines | Add **Refresh SQL endpoint** after the write |
| Notebooks only | Call `refreshMetadata` in the last cell |
| Dataflow Gen2 | Nothing; auto-sync is on by default |
| Anything, if available | Enable on-demand metadata sync |

"Recap:
- Your data is fine. The SQL endpoint's view of it is behind.
- `REFRESH TABLE` won't help.
- Refresh the endpoint in your pipeline or notebook, or let Fabric's automatic sync handle it.
- Keep your tables compacted so sync stays fast.

If this saved you an hour of debugging, that's the video's job done. Next, watch Lakehouse vs Warehouse, since this sync behavior is one of the real differences between them."

## Chapters
```
0:00 "My data isn't there"
0:30 Why it happens: metadata sync
2:00 How to confirm it's sync, not your code
3:00 The fix that doesn't work (REFRESH TABLE)
3:20 Fix 1: Refresh SQL endpoint pipeline activity
4:30 Fix 2: refreshMetadata API from a notebook
6:15 Fix 3: automatic sync (Dataflow Gen2 + on-demand)
7:30 Habits that make it happen less
8:45 Decision guide + recap
```

## Description + tags
Microsoft Fabric SQL analytics endpoint not showing your latest lakehouse data? It's metadata sync lag. Here's why it happens and 3 fixes: the Refresh SQL endpoint pipeline activity, the refreshMetadata REST API from a notebook (code included), and automatic sync with Dataflow Gen2 and the new on-demand metadata sync.

Code: [link].

Tags: sql analytics endpoint, fabric sql endpoint not updating, refresh sql endpoint fabric, lakehouse sql endpoint, fabric metadata sync, microsoft fabric lakehouse, fabric stale data, refreshMetadata api, microsoft fabric tutorial

## Shorts cutdowns

**Short 1: "Your data isn't missing" (35s)**
[ON SCREEN TEXT: "Notebook: 10,000 rows · SQL: 9,000 rows"]
"Notebook says 10,000 rows, the SQL endpoint says 9,000. Your code is fine. Fabric's SQL analytics endpoint keeps its own copy of table metadata, and it syncs in the background. Until it syncs, SQL reads the older version. The fix: refresh the SQL endpoint right after you write, with the pipeline activity or the API, and then read."
[ON SCREEN TEXT: "Write → Refresh SQL endpoint → Read"]

**Short 2: "REFRESH TABLE won't save you" (30s)**
[ON SCREEN TEXT: "REFRESH TABLE ≠ SQL endpoint sync"]
"Stop running REFRESH TABLE to fix stale data in your Fabric SQL endpoint. It only refreshes Spark's cache. The SQL endpoint is a separate engine. Use the Refresh SQL endpoint pipeline activity, or the refreshMetadata API, or turn on the new on-demand sync if it's available to you."

## LinkedIn post
**The Fabric bug that isn't a bug.**

```
Notebook ──writes──▶ Delta (OneLake) ✓ correct instantly
                        │
                 metadata sync (background)
                        ▼
              SQL analytics endpoint ⏳ sometimes behind
```

Few Fabric issues come up more often in the community: "my data isn't in the SQL endpoint." People lose hours debugging ETL that worked fine.

The rule I give every team: **write → refresh the SQL endpoint → read.** Use the new pipeline activity or the refreshMetadata API, never REFRESH TABLE, which only touches Spark's cache.

Dataflow Gen2 now syncs automatically, and an on-demand sync mode is arriving. Until it's everywhere, make the sync explicit.

Has this one cost you an afternoon?

---

## Blog version (~800 words)

# Fabric SQL Analytics Endpoint Not Showing Latest Data? Why It Happens and How to Fix It

You write data to a Microsoft Fabric lakehouse from a notebook. Spark shows the new rows, but a query through the lakehouse's SQL analytics endpoint doesn't. It's one of the most common Fabric complaints in the community, and the cause is almost never your code.

## Why the SQL analytics endpoint shows stale data
A Fabric lakehouse stores tables as Delta in OneLake. When Spark writes, it adds Parquet files and a new commit to the `_delta_log`. That data is correct immediately.

The **SQL analytics endpoint** is a separate SQL engine with its own table metadata: which tables exist and which version to read. A background **metadata sync** keeps it up to date. When the sync lags, SQL queries read an older version or miss new tables. The lag is often seconds, but it grows with:
- many tables,
- large Delta logs,
- frequent small writes,
- busy capacities.

Even a short lag breaks pipelines that write and then immediately read through SQL.

## How to confirm it's metadata sync
Count rows for the same table from Spark and from the SQL endpoint. Then check `DESCRIBE HISTORY` in Spark. If the latest write is there but SQL is behind, it's the sync.

**Don't use `REFRESH TABLE`.** It refreshes Spark's cache only, and community testing shows it doesn't update the SQL endpoint.

## Fix 1: Refresh SQL endpoint pipeline activity
Fabric Data Factory has a **Refresh SQL endpoint** activity. Place it after the activity that writes your tables, and before anything that reads through SQL (stored procedures, semantic model refreshes, copies into a warehouse). The rule: **write, refresh, read.**

## Fix 2: The refreshMetadata REST API from a notebook
If notebooks are your orchestrator, call the API in the last cell. Using semantic link (built into Fabric notebooks):

```python
import sempy.fabric as fabric
client = fabric.FabricRestClient()
ws = fabric.get_workspace_id()
items = fabric.list_items(type="Lakehouse", workspace=ws)
lh_id = items.loc[items["Display Name"] == "lh_silver", "Id"].iloc[0]
sql_id = client.get(f"/v1/workspaces/{ws}/lakehouses/{lh_id}").json()["properties"]["sqlEndpointProperties"]["id"]
resp = client.post(f"/v1/workspaces/{ws}/sqlEndpoints/{sql_id}/refreshMetadata", json={})
```

If the call returns `202 Accepted`, poll the `Location` header until the operation succeeds. The result lists per-table sync status, which helps you find broken tables.

## Fix 3: Automatic sync (Dataflow Gen2 and on-demand metadata sync)
- **Dataflow Gen2** now syncs the SQL endpoint as part of a refresh that writes to a lakehouse, so data is queryable as soon as the refresh completes. It's on by default, with an opt-out in the destination's advanced options.
- **On-demand metadata sync** is a newer SQL analytics endpoint mode that checks freshness at query time and syncs if needed. Check whether it's preview or GA in your region before relying on it.

## How to reduce SQL endpoint sync lag
- **Batch writes.** Fewer, larger commits mean less log to process.
- **Compact and clean.** Run OPTIMIZE and VACUUM regularly, with the Lakehouse maintenance pipeline activity or a scheduled notebook.
- **Prefer MERGE over full overwrites,** which grow table history quickly.
- **Order every pipeline as write → sync → read.**
- **Know your consumers.** Spark and Direct Lake on OneLake read Delta directly. The SQL endpoint, T-SQL views and Direct Lake on the SQL endpoint depend on the sync.

## Which fix should you use?
| Orchestration | Fix |
|---|---|
| Data pipelines | Refresh SQL endpoint activity |
| Notebooks only | refreshMetadata API in the last cell |
| Dataflow Gen2 | Automatic (default on) |
| Anywhere available | On-demand metadata sync |

Your lakehouse data was never missing; the SQL endpoint just hadn't caught up. Make the sync an explicit step and the problem goes away.
