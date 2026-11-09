# Wk 6: Power BI Semantic Models + Direct Lake: The Complete Guide (Fallback, Guardrails, Performance)

- **Runtime target:** 25–27 min
- **Pillar:** 3 and 5. Concept explainer + Power BI → Fabric bridge
- **Target keywords:**
  - power bi semantic model: 1,600/mo, **1.57×**, **$34 CPC**
  - semantic model: 3,600, 1.13×
  - direct lake: 90, 1.25×
  - delta lake: 12,100, 1.19×
  - power bi dax: 2,400
  - Top LinkedIn post in our research: semantic model, 5,634 reactions.
  - Community demand: the r/MicrosoftFabric thread "Why aren't more people using Direct Lake?" (58 comments).
- **Title options:**
  1. Power BI Semantic Models + Direct Lake: The Complete Guide (2026)
  2. Direct Lake vs Import vs DirectQuery: Which Should You Use in Microsoft Fabric?
  3. Why Your Direct Lake Model Is Slow (Fallback, Guardrails and How to Fix It)
- **Thumbnail:**
  - **Text:** "DIRECT LAKE, EXPLAINED"
  - **Visual:** three lanes labelled Import / DirectQuery / Direct Lake, with Direct Lake highlighted and a ⚠ "fallback" sign on a side road.
- **Verify before recording:**
  - **Direct Lake on OneLake:** reported GA by the community in 2026. Confirm GA, and whether it's now the default when you create a model from a lakehouse.
  - **Direct Lake on SQL endpoint:** still available, and still falls back to DirectQuery. The `DirectLakeBehavior` property values: Automatic / DirectLakeOnly / DirectQueryOnly.
  - **Guardrails table per SKU:** files, row groups, rows per table, max model size, max memory. Re-check every number shown at 13:30 against the current Microsoft docs.
  - **Calculated columns and tables on Direct Lake tables:** what's supported now for each flavour. Also composite models (Direct Lake on OneLake + Import tables).
  - **Semantic Link Labs:** function names and signatures:
    - `warm_direct_lake_cache_isresident`
    - `warm_direct_lake_cache_perspective`
    - `check_fallback_reason`
    - `get_direct_lake_guardrails`
    - `update_direct_lake_model_lakehouse_connection`
    - `pip install semantic-link-labs` still needed.
  - **Deployment pipelines:** whether deployment rules can now rebind Direct Lake models to the target stage's lakehouse; whether Variable Libraries help. If yes, show that first and keep the Semantic Link Labs rebind as the fallback.
  - **V-Order:** default on/off for new workspaces (resource profiles), and the Spark config name.
  - **The "Keep your Direct Lake data up to date" setting:** still exists and still named that.

## Hook (0:00–0:30)
> Direct Lake is supposed to give you import speed with no import refresh. So why do so many teams say DirectQuery was more reliable? There's a whole Reddit thread about it, and a conference talk said exactly that.
>
> In this video, I'll show you how to build a semantic model properly. Then I'll cover the three storage modes. Then the real reasons Direct Lake gets slow or falls back, and how to fix each one: guardrails, file layout, cold cache, stale data and deployment.
>
> By the end you'll know which mode to pick, and how to make Direct Lake behave.

## Script

### 0:30 Star schema in three minutes
[ON SCREEN: star diagram. fact_weather_daily in the center; dim_date and dim_city around it; arrows from dims to fact; "1 → *".]

> Every good semantic model starts with the same shape: a star.
>
> - **Facts** are events or measurements, with numbers. Sales lines, sensor readings. Ours is one row per city per day.
> - **Dimensions** describe the facts: date, city, product, customer. They're what you slice by.
>
> Why a star and not one wide table? Three reasons:
> - **Compression.** Power BI's engine stores columns. A city name repeated 2 million times in a fact compresses worse than an integer key plus a tiny dimension.
> - **Simple DAX.** Filters flow one way, from dimension to fact. Your measures stay short.
> - **Reuse.** One date dimension serves every fact.
>
> And why not a snowflake, with dimensions hanging off dimensions? It works, but every extra hop is another relationship to filter through. Flatten dimensions where you can.
>
> I'm using the weather model from my one-hour code-along. Same ideas apply to any data.

### 3:30 Build the model right: relationships, date table, measures
[DEMO: open sm_weather → Open data model (web modeling).]

> Here's my checklist for every model.
>
> **Relationships:**
> - Many-to-one.
> - Single direction, dimension filters fact.
> - Integer keys.
>
> Bidirectional filtering is a last resort. It causes ambiguity and slow queries.

[DEMO: show both relationships' properties.]

> **Date table:** a proper one, every day with no gaps, marked as the date table. Without it, time intelligence functions lie.

[DEMO: dim_date → Mark as date table.]

> **Hygiene:**
> - Hide foreign keys and technical columns.
> - Sort month names by month number.
> - Add descriptions. Copilot and data agents read them, so this matters more every year.
> - Put measures in display folders.

> **Measures, not columns.** Never let people drag a raw numeric column into a visual. Write explicit measures. Here's a starter set with time intelligence.

[DEMO: new measures]
```dax
Total Rain (mm) = SUM ( fact_weather_daily[precipitation_mm] )

Total Rain YTD (mm) =
TOTALYTD ( [Total Rain (mm)], dim_date[date] )

Total Rain PY (mm) =
CALCULATE ( [Total Rain (mm)], SAMEPERIODLASTYEAR ( dim_date[date] ) )

Rain vs PY % =
DIVIDE ( [Total Rain (mm)] - [Total Rain PY (mm)], [Total Rain PY (mm)] )

Avg Max Temp 7-Day (°C) =
AVERAGEX (
    DATESINPERIOD ( dim_date[date], MAX ( dim_date[date] ), -7, DAY ),
    CALCULATE ( AVERAGE ( fact_weather_daily[temp_max_c] ) )
)

City Rank by Rain =
RANKX ( ALL ( dim_city[city] ), [Total Rain (mm)], , DESC, DENSE )
```

> Quick read-through:
> - **`TOTALYTD`:** year to date. Needs the marked date table.
> - **`SAMEPERIODLASTYEAR`:** shifts the filter back one year, so you can compare.
> - **`DIVIDE`:** handles the divide-by-zero when last year is blank.
> - **The 7-day measure:** a rolling average. `DATESINPERIOD` builds the last seven days from whatever date you're on.
> - **`RANKX` over `ALL` cities:** ranks every city, even when the visual is filtered.
>
> One thing about this dataset: we only have a year, so the PY measures will be blank until next year. That's expected.
>
> If a calculation is a fixed property of a row, like "is this a rain day", put it in the gold table, not in DAX. Measures are for aggregations.

[DEMO: DAX query view → run]
```dax
EVALUATE
SUMMARIZECOLUMNS (
    dim_city[city],
    "Rain (mm)", [Total Rain (mm)],
    "Rank", [City Rank by Rain]
)
ORDER BY [Rank]
```

> Test measures in the DAX query view before they go near a report. Much faster than building visuals to check.

### 8:00 Import vs DirectQuery vs Direct Lake
[ON SCREEN: 3 columns. Import: copy into model · refresh to update · fastest · size limits · stale between refreshes. DirectQuery: no copy · queries the source live · always current · slowest, source must be fast. Direct Lake: reads Delta from OneLake into memory on demand · "refresh" = reframe (seconds) · near-import speed · guardrails.]

> Every table in a model has a storage mode. Three options.
>
> **Import** copies the data into the model's own compressed format. It's the fastest to query. But you schedule refreshes, and a big refresh takes time and capacity. Between refreshes, the data is stale.
>
> **DirectQuery** copies nothing. Every visual sends a query to the source. Always current, but only as fast as that source. Some DAX gets limited or slow.
>
> **Direct Lake** is Fabric's middle path. The data stays as Delta Parquet in OneLake. When a query needs a column, the engine loads that column from the files straight into memory, in the same format Import uses. So once loaded, it's import speed.
>
> And "refresh" doesn't copy data. It's called framing: the model just points at the newest version of the Delta tables. That takes seconds, not hours.
>
> On paper, it's the best of both. So why the skepticism? Four reasons, and we'll take them one by one. But first, there are actually two kinds of Direct Lake.

### 11:00 Direct Lake on SQL endpoint vs Direct Lake on OneLake
[ON SCREEN: two rows. DL on SQL endpoint: one lakehouse/warehouse · uses the SQL endpoint for metadata/security · CAN fall back to DirectQuery (views, SQL security, guardrails). DL on OneLake: reads Delta directly from OneLake · tables from multiple items · no DirectQuery fallback · OneLake security · can mix with Import tables.]

> **Direct Lake on SQL endpoint** was the original:
> - The model goes through one lakehouse or warehouse's SQL analytics endpoint.
> - When it can't do something in Direct Lake mode, it quietly falls back to DirectQuery through that endpoint. That happens when a table is really a view, when SQL-level security is involved, or when you exceed a guardrail.
>
> **Direct Lake on OneLake** is the newer flavour:
> - It reads Delta tables straight from OneLake, and can combine tables from several lakehouses and warehouses.
> - It doesn't fall back to DirectQuery. If something isn't supported, the query errors instead of going slow.
> - You can combine it with Import tables in the same model.
>
> Check on screen which one your tenant creates by default, and its current status.
>
> My recommendation for new models: Direct Lake on OneLake, built on clean gold tables. A query that fails loudly is easier to fix than one that gets slow quietly.

### 13:30 Fallback and guardrails: the reliability problem
[ON SCREEN: guardrails table, excerpt. Verify all numbers.]

| SKU | Max files / table | Max row groups / table | Max rows / table | Max memory |
|---|---|---|---|---|
| F2–F8 | 1,000 | 1,000 | 300M | 3 GB |
| F16 | 1,000 | 1,000 | 300M | 5 GB |
| F32 | 1,000 | 1,000 | 300M | 10 GB |
| F64 | 5,000 | 5,000 | 1.5B | 25 GB |
| F128 | 5,000 | 5,000 | 3B | 50 GB |

> Here's the main reason people find DirectQuery more reliable.
>
> Direct Lake has guardrails per capacity size: a maximum number of Parquet files per table, row groups per table, rows per table, and memory.
>
> Cross a guardrail and, on the SQL endpoint flavour, your queries silently fall back to DirectQuery. Your report goes from two seconds to twenty, and nothing told you why.
>
> The model didn't break. It switched modes behind your back. That's what people experience as "unreliable."
>
> Two fixes.
>
> **First, find out if it's happening.** Performance Analyzer in Power BI shows a DirectQuery line when a visual fell back. Or ask Semantic Link Labs directly from a notebook:

[DEMO: notebook]
```python
%pip install semantic-link-labs

import sempy_labs as labs
from sempy_labs import directlake

directlake.check_fallback_reason(dataset="sm_weather", workspace="fabric_weather_e2e")
directlake.get_direct_lake_guardrails()          # current guardrails by SKU
```

> **Second, decide what should happen.** On the SQL endpoint flavour, the model property `DirectLakeBehavior` controls fallback:
> - **Automatic** falls back silently.
> - **DirectLakeOnly** makes it error instead.
> - **DirectQueryOnly** forces DirectQuery.
>
> For production, I prefer DirectLakeOnly. A broken visual gets reported in an hour. A slow one gets tolerated for months.
>
> But the real fix is to stay under the guardrails. And for most teams, the thing pushing them over isn't rows. It's files.

### 16:30 Parquet layout: V-Order, row groups and OPTIMIZE
[ON SCREEN: two tables side by side. Left: "Daily appends: 2,400 small files, 2,400 row groups". Right: "After OPTIMIZE: 12 files, ~1M rows per row group".]

> Direct Lake reads Parquet files. So how your files are laid out decides how fast and stable it is.
>
> Picture a fact table that a pipeline appends to every 15 minutes. After a few months, it's thousands of tiny files. On an F32, that's past the 1,000-file guardrail. Fallback, or errors. Same data, same rows. Just badly packed.
>
> Three habits fix it.
>
> **One: V-Order.** It's a write-time optimization that sorts and compresses Parquet the way Power BI's engine likes to read it. Some newer workspaces default it off for write speed. Turn it on for gold tables that feed Direct Lake.
>
> **Two: big row groups, few files.** Aim for row groups around a million rows or more, not thousands.
>
> **Three: OPTIMIZE regularly.** It compacts small files into big ones.

[DEMO: notebook attached to lh_gold]
```python
spark.conf.set("spark.sql.parquet.vorder.default", "true")

spark.sql("OPTIMIZE fact_weather_daily VORDER")
spark.sql("VACUUM fact_weather_daily RETAIN 168 HOURS")   # remove old files after 7 days

spark.sql("DESCRIBE DETAIL fact_weather_daily").select("numFiles", "sizeInBytes").show()
```

[DEMO: or Lakehouse → table … → Maintenance → Optimize (V-Order) + Vacuum.]

> Same thing from the lakehouse UI: Maintenance on the table.
>
> `DESCRIBE DETAIL` shows your file count. Add the OPTIMIZE as a weekly step in your pipeline and file-count fallback mostly disappears.

### 18:30 Slow first load: framing, cold cache and warming
[ON SCREEN: timeline. Reframe → memory cleared for changed tables → first user: loads columns from OneLake (slow) → everyone after: in memory (fast).]

> The second complaint: "the first report open each morning is slow."
>
> That's the cold cache. After a reframe, or after the capacity evicts the model from memory, the columns have to be paged in from OneLake again. Whoever opens the report first pays that cost.
>
> The fix is to pay it yourself, right after your pipeline finishes. Semantic Link Labs can warm the cache. Either:
> - reload the columns that were in memory before the reframe, or
> - load the columns used by a perspective you define for your key reports.

[DEMO: notebook, run after the gold step]
```python
from sempy_labs import directlake

# Option A: reload whatever was resident before the reframe
directlake.warm_direct_lake_cache_isresident(dataset="sm_weather", workspace="fabric_weather_e2e")

# Option B: warm exactly the columns a perspective uses (define "Main Report" in the model first)
directlake.warm_direct_lake_cache_perspective(
    dataset="sm_weather", workspace="fabric_weather_e2e",
    perspective="Main Report", add_dependencies=True)
```

> Put that as the last notebook in your pipeline. The 6am run warms the model, and your 9am users get import speed.

### 20:30 "My model doesn't show the latest data" + deployment pipelines
[ON SCREEN: checklist. ☐ Auto-update on? ☐ SQL endpoint synced? ☐ Reframe succeeded? ☐ Pipeline order: write → sync → reframe → warm.]

> Third complaint: the report doesn't show today's data. Check four things in this order:
>
> 1. **Is "Keep your Direct Lake data up to date" on** in the model settings? If not, it only reframes when you refresh it.
> 2. **On the SQL endpoint flavour, has the endpoint synced?** It can lag behind your Delta writes. My code-along shows the API call that forces it after each load.
> 3. **Did the reframe fail?** Check the model's refresh history. A reframe fails if a table now breaks a guardrail.
> 4. **Pipeline order.** Write tables, sync the endpoint, reframe the model, warm the cache. If you reframe before the sync, you can frame yesterday's version.

[ON SCREEN: Dev workspace (lh_gold_dev) → deployment pipeline → Prod workspace. Model in Prod still pointing at lh_gold_dev ⚠]

> Fourth complaint, and it's a nasty one: deployment pipelines.
>
> You deploy your Direct Lake model from Dev to Prod, and in Prod it's still reading the Dev lakehouse. Your production report is showing development data.
>
> Check first whether deployment rules can now rebind Direct Lake models in your tenant. That's the clean way.
>
> If they can't, rebind after every deployment with one call:

[DEMO: notebook in Prod]
```python
from sempy_labs import directlake

directlake.update_direct_lake_model_lakehouse_connection(
    dataset="sm_weather",
    workspace="fabric_weather_prod",
    lakehouse="lh_gold",
    lakehouse_workspace="fabric_weather_prod")
```

> Make it a post-deployment step, and always verify with a query that only Prod data could answer.

### 22:30 Which mode should you pick?
[ON SCREEN: decision tree.
- Data already in Fabric as Delta, large or changing often? → Direct Lake (on OneLake), with guardrails + OPTIMIZE + warming.
- Small model (< a few GB), mixed sources, heavy calculated columns, refresh a few times a day is fine? → Import.
- Must be real-time on a source outside Fabric that's fast (e.g. a tuned SQL DB)? → DirectQuery.
- Mix? → Composite: Direct Lake on OneLake for big facts + Import for small reference tables.]

> So, which one?
>
> - **Import:** your data is small, from mixed sources, or needs lots of calculated columns, and a few refreshes a day is fine. It's simple and fast. Don't let anyone shame you out of it.
> - **DirectQuery:** you need real-time numbers from a fast source outside Fabric.
> - **Direct Lake:** your data already lives in Fabric as Delta, it's big or changes often, and you're willing to do the three habits:
>   - stay under the guardrails
>   - keep files compacted with V-Order
>   - warm the cache after loads
>
> Do those, and the "DirectQuery is more reliable" complaint mostly goes away. Skip them, and honestly, the complaint is fair.
>
> For many teams, the answer is a mix: big facts in Direct Lake, small reference tables imported.

### 24:00 Wrap-up
> Recap:
> - Build a star.
> - Write explicit measures.
> - Pick the storage mode on purpose.
> - For Direct Lake: check fallback, compact your files, warm the cache, get your pipeline order right, and rebind after deployment.
>
> All the code is in the description.
>
> Next up, I compare Fabric, Databricks and Snowflake honestly. And if you want to build this whole model from raw data, the one-hour code-along is right here.

## Chapters
```
0:00 Why people say Direct Lake is unreliable
0:30 Star schema in 3 minutes
3:30 Build the model: relationships, date table, DAX measures
8:00 Import vs DirectQuery vs Direct Lake
11:00 Direct Lake on SQL endpoint vs on OneLake
13:30 Fallback + guardrails by SKU
16:30 Parquet layout: V-Order, row groups, OPTIMIZE
18:30 Slow first load: warm the cache with Semantic Link Labs
20:30 Stale data + deployment pipelines rebinding
22:30 Which storage mode should you pick?
24:00 Recap
```

## Description + tags
**Power BI semantic models and Direct Lake in Microsoft Fabric, the complete 2026 guide:** star schema design, DAX measures, Import vs DirectQuery vs Direct Lake, and how to fix Direct Lake fallback, guardrails, slow first loads and stale data.

Why do some teams find DirectQuery more reliable than Direct Lake? This video shows the real causes and the fixes.

In this video:
- Star schema, relationships, the date table and model hygiene
- DAX: YTD, prior year, rolling 7-day average, RANKX
- Direct Lake on SQL endpoint vs Direct Lake on OneLake
- DirectQuery fallback, DirectLakeBehavior and the guardrails per F SKU
- V-Order, row groups, OPTIMIZE and VACUUM for Direct Lake performance
- Cache warming with Semantic Link Labs
- Fixing "model doesn't show the latest data"
- Rebinding Direct Lake models after deployment pipelines

📂 Code + DAX: [LINK]
▶ One-hour Fabric code-along: [LINK] · Fabric data agents: [LINK]

**Tags:** power bi semantic model, semantic model, direct lake, direct lake vs import, microsoft fabric, power bi dax, directquery fallback, direct lake guardrails, v-order, delta lake, semantic link labs, fabric deployment pipelines, star schema power bi

## Shorts cutdowns
**Short 1: "Why Direct Lake got slow" (≤45s)**
[ON SCREEN: "2s → 20s. Nothing changed?"]
> Your Direct Lake report went from two seconds to twenty, and nobody changed anything.
>
> Here's what probably happened. Your table crossed a guardrail, usually the file count from lots of small appends. Then Direct Lake quietly fell back to DirectQuery.
>
> Fix it in two steps:
> - Run OPTIMIZE with V-Order to compact the files.
> - Set DirectLakeBehavior to DirectLakeOnly, so next time it errors instead of going slow in silence.

**Short 2: "The slow first report of the morning" (≤40s)**
[ON SCREEN: "First open = slow. Why?"]
> First person to open the Power BI report every morning waits. Everyone after is fast.
>
> That's a cold Direct Lake cache. After a data refresh, columns have to be loaded from OneLake again.
>
> Fix: warm it yourself. One Semantic Link Labs call at the end of your pipeline loads the columns your reports use, before anyone logs in.

[ON SCREEN: `warm_direct_lake_cache_perspective(...)`]

**Short 3: "Your prod report is reading dev data" (≤40s)**
[ON SCREEN: "Prod report. Dev data. 😬"]
> Deployed a Direct Lake model from Dev to Prod with a deployment pipeline? Check where it's pointing. It can still be reading the Dev lakehouse.
>
> Use a deployment rule if your tenant supports it for Direct Lake. If not, one Semantic Link Labs call after every deploy rebinds it to the Prod lakehouse. Then test with a number only Prod could have.

## LinkedIn post
> **"DirectQuery is more reliable than Direct Lake." I get why people say it, but it's usually a file-layout problem.**
>
> [Diagram: Direct Lake failure modes → fix
> Guardrail exceeded (too many files) → OPTIMIZE + V-Order
> Silent fallback → DirectLakeBehavior = DirectLakeOnly
> Slow first load → warm cache (Semantic Link Labs)
> Stale data → write → sync → reframe → warm
> Prod reads Dev → rebind after deploy]
>
> Direct Lake rewards teams that treat their gold layer as a product: compacted files, a known pipeline order, and a warm cache.
>
> If you won't do those, Import is a perfectly good answer.
>
> Full guide on my channel. Which of these bit you first?
