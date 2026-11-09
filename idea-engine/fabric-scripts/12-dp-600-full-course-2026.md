# Wk 12: DP-600 Full Course 2026: Microsoft Fabric Analytics Engineer (Pass on Your First Try)

- **Runtime target:** ~6 hours.
  - Recorded as one long upload, then cut into a 12-part numbered series (see the cut list at the end).
- **Pillar:** 1 — Cornerstone courses.
- **Target keywords:**
  - dp-600: 1,000/mo, 0.92×, $10.90 CPC.
  - dp-600 exam: 90/mo.
  - microsoft fabric certification: 880/mo.
  - microsoft fabric course: 70/mo.
  - power bi semantic model: 1,600/mo, 1.57×.
  - semantic model: 3,600/mo, 1.13×.
- **Proven format:** the channel we model:
  - DP-600 full course (6+ hours): 254K views.
  - "Video 1 of 12" in its series: 95K views.
  - Those videos are about 2 years old, and the exam outline has changed since.
- **Title options:**
  1. DP-600 Full Course 2026 (6 Hours): Microsoft Fabric Analytics Engineer
  2. Pass DP-600 in 2026: The Complete Fabric Analytics Engineer Course
  3. DP-600 Exam Prep 2026: Everything on the Skills Outline, With Demos
- **Thumbnail:** "DP-600 2026" in huge text, a certification badge, and "FULL COURSE · 6 HRS" in a banner.
- **Verify before recording** (open the official "Study guide for Exam DP-600" on Microsoft Learn and match it line by line):
  - **Skill-area weights.** At last check:
    - Maintain a data analytics solution: 25–30%
    - Prepare data: 45–50%
    - Implement and manage semantic models: 25–30%
  - **Exam logistics:**
    - passing score 700/1000;
    - ~100 minutes;
    - question count (often 40–60);
    - case studies;
    - access to Microsoft Learn during the exam;
    - free annual renewal assessment;
    - exam price for your region.
  - **Any "skills measured" change date** listed on the study guide. If the outline changed after recording, pin a comment.
  - **Feature status:**
    - OneLake security / data access roles (preview vs GA);
    - Direct Lake on OneLake vs Direct Lake on SQL endpoints;
    - `DirectLakeBehavior` options;
    - T-SQL `MERGE` in Fabric Warehouse (GA?);
    - calculation groups and visual calculations in Desktop;
    - the "Master data" endorsement;
    - workspace monitoring;
    - the OneLake catalog name (formerly OneLake data hub).
  - **Direct Lake guardrails per SKU** (rows per table, model size). Don't quote numbers on camera; point to the Learn page.
  - **Deployment pipelines:** max stages (up to 10 at last check) and which item types are supported.
  - **Git integration:** supported providers (Azure DevOps, GitHub) and supported item types.
  - **Large semantic model storage format:** default on/off for new models.

---

## Hook (0:00–0:30)
"This is the complete DP-600 course for 2026. Six hours, every item on the current skills outline, with real demos in T-SQL, PySpark, DAX and KQL. I'll show you what the exam actually tests, the traps that cost people points, and ten practice questions at the end. Watch it straight through, or use the chapters to jump to what you're weakest on. By the end, you'll be ready to book the exam."

## Script

### 0:30 — Course intro: what DP-600 is and how it's scored
"DP-600 is the exam for the Microsoft Certified: Fabric Analytics Engineer Associate. It's for people who design, build and deploy analytics in Fabric: lakehouses and warehouses on one side, semantic models and Power BI on the other.

[ON SCREEN: Exam DP-600 · Passing score 700 · ~100 minutes · Multiple choice, drag-and-drop, case studies · Microsoft Learn available during the exam]

The passing score is 700 out of 1000. You get about 100 minutes. Expect multiple choice, drag-and-drop ordering, and usually a case study, where you read about a fictional company and answer several questions about it. And you can open Microsoft Learn during the exam. That's real, but it's slow. Treat it as a safety net for one or two questions, not a strategy.

The exam covers three skill areas.

[ON SCREEN: Maintain a data analytics solution: 25–30% · Prepare data: 45–50% · Implement and manage semantic models: 25–30%]

Maintaining a data analytics solution: security, governance and the development lifecycle. About a quarter to a third.

Preparing data: getting it in, transforming it, querying it. That's the biggest, close to half the exam.

And implementing and managing semantic models: modeling, DAX and performance. Another quarter to a third.

This course follows that outline in order. Each module maps to a section of the official study guide, which is linked in the description. Download it now and tick things off as we go.

What you need: a Fabric trial or capacity, Power BI Desktop, and ideally DAX Studio and Tabular Editor. All the code is in the description.

Let's go."

---

### MODULE 1 (0:08) — Fabric in 15 minutes: the mental model
**Verbatim opening:**
"Before we touch the outline, you need one picture in your head, because half of the exam questions are really asking 'where does this live?' Fabric is one platform with one storage layer, OneLake, and several engines that read and write it. Get this picture right and a lot of questions answer themselves."

**Talking points:**
- **OneLake.** One per tenant, "the OneDrive for data." Tables are stored as Delta Parquet.
- **Workspaces sit on a capacity.** Items live in workspaces.
- **The three stores:**
  - **Lakehouse:** Spark-first, files plus Delta tables; a read-only SQL analytics endpoint is created automatically.
  - **Warehouse:** T-SQL-first, full read/write DML, multi-table transactions.
  - **Eventhouse:** KQL databases, built for streaming, time series and logs.
- **Semantic models** sit on top: Import, DirectQuery, Direct Lake.
- **One copy of data, many engines:** that's the point of Fabric and of the exam.

**Demo:**
1. Create the workspace `DP600-Course` on your trial capacity.
2. New item → Lakehouse `lh_sales`.
3. New item → Warehouse `wh_sales`.
4. New item → Eventhouse `eh_telemetry`.
5. Open the lakehouse and show the SQL analytics endpoint switcher in the top right.

**Exam traps:**
- **The lakehouse SQL analytics endpoint is read-only for data.** You can create views, functions and security, but you can't `INSERT` into lakehouse tables through it. Writes go through Spark (or pipelines and dataflows).
- **Need multi-table transactions or T-SQL DML?** → Warehouse.

---

### MODULE 2 (0:25) — Workspaces, capacities and admin settings
*Skill area: Maintain a data analytics solution*

**Verbatim opening:**
"The exam expects you to know who can do what, and where that's controlled. There are three layers: the tenant, the capacity and the workspace. Most questions are about the workspace layer, so that's where we'll spend our time."

**Talking points:**
- **Tenant settings** (admin portal) turn features on or off, often per security group. Examples: who can create Fabric items, XMLA read-write, export, Git integration.
- **Capacity settings:**
  - assign workspaces;
  - capacity admins;
  - the XMLA endpoint (read or read-write);
  - delegated tenant settings.
- **Domains:** group workspaces by business area for governance and the OneLake catalog.
- **Workspace settings:**
  - license mode / capacity;
  - Git integration;
  - Spark settings (pools, environments);
  - workspace identity.

**Demo:**
1. Admin portal → Tenant settings → search "XMLA" → explain.
2. Capacity settings → your capacity → Power BI workloads → XMLA Endpoint = Read Write.
3. Workspace → Workspace settings → License info, Spark settings, Git integration (preview the screen; we'll use it in Module 4).
4. Admin portal → Domains → create domain "Sales" → assign the workspace.

**Exam traps:**
- **XMLA read-write is set at the capacity level** (and must be allowed in tenant settings). If a question says "can't deploy a model from Tabular Editor," check this setting.
- **Workspace settings vs admin portal.** Know which is which: Spark pools in workspace settings vs the tenant switch that allows Fabric items at all.

---

### MODULE 3 (0:50) — Security and governance
*Skill area: Maintain a data analytics solution*

**Verbatim opening:**
"Security in Fabric works in layers, from wide to narrow: the workspace, then the item, then rows, columns and objects inside the item. The exam loves questions where three answers would work and only one follows least privilege. So for every layer, I'll tell you the narrowest tool that does the job."

**Talking points: workspace roles**

| Role | Can do |
|---|---|
| Admin | Everything, incl. manage the workspace and all roles |
| Member | Add members/contributors/viewers, share, publish |
| Contributor | Create/edit/delete items; can't manage access |
| Viewer | View and read; reads data via the SQL endpoint; no Spark/OneLake read by default |

**Talking points: item permissions** (share a single item without workspace access)
- **Read:** see the item/metadata.
- **ReadData:** query via the SQL endpoint.
- **ReadAll:** read the underlying files via Spark/OneLake.
- **Build** (semantic models): make new reports on the model.
- **Reshare, Write.**

**Talking points: inside the data**
- **Warehouse / SQL endpoint:**
  - object-level `GRANT`/`DENY`;
  - column-level security (`GRANT SELECT` on specific columns);
  - row-level security (a security policy plus a predicate function);
  - dynamic data masking.
- **Semantic model:**
  - RLS roles (DAX filters);
  - object-level security (hide tables/columns, set via Tabular Editor);
  - test with "View as".
- **OneLake security / data access roles:** folder- and table-level access for lakehouse data read through OneLake/Spark. Check the current status.
- **Sensitivity labels** (Microsoft Purview) are inherited downstream.
- **Endorsement:**
  - Promoted: anyone with write access can set it.
  - Certified: only authorized reviewers, and must be enabled by an admin.
  - Master data: where available.
- **Logging and lineage:** lineage view, impact analysis, workspace monitoring, Purview audit logs.

**Demo (T-SQL in `wh_sales`):**
```sql
-- Sample tables
CREATE TABLE dbo.Customer (
    CustomerID int, Name varchar(100), Email varchar(200), Region varchar(50));
CREATE TABLE dbo.Sales (
    SaleID int, CustomerID int, SalesRep varchar(128), Amount decimal(18,2), SaleDate date);

-- Column-level security: this user can see only these two columns
GRANT SELECT ON dbo.Customer (CustomerID, Name) TO [analyst@contoso.com];

-- Dynamic data masking
ALTER TABLE dbo.Customer
ALTER COLUMN Email ADD MASKED WITH (FUNCTION = 'email()');
-- Let a specific user see unmasked values
GRANT UNMASK TO [support.lead@contoso.com];

-- Row-level security: reps see only their own sales
CREATE SCHEMA Security;
GO
CREATE FUNCTION Security.fn_rep_filter(@SalesRep AS varchar(128))
RETURNS TABLE
WITH SCHEMABINDING
AS
RETURN SELECT 1 AS allowed
       WHERE @SalesRep = USER_NAME();
GO
CREATE SECURITY POLICY Security.SalesRepPolicy
ADD FILTER PREDICATE Security.fn_rep_filter(SalesRep) ON dbo.Sales
WITH (STATE = ON);
```

**Demo (semantic model RLS):**
1. Power BI Desktop → Modeling → Manage roles → New role `Rep`.
2. On the Sales table, the DAX filter: `[SalesRep] = USERPRINCIPALNAME()`.
3. Modeling → View as → Rep, with another user.
4. Publish → semantic model → Security → add members to the role.

**Demo (governance):**
1. Item → Settings → Endorsement → Promoted.
2. Show the Certified option greyed out (needs admin setup).
3. Apply a sensitivity label.
4. Workspace → Lineage view → select the lakehouse → Impact analysis.

**Exam traps:**
- **Hide specific columns from some users, everything else visible** → column-level security, not a whole new view or a separate workspace.
- **Data masking is not security** against users who can run arbitrary queries. It's obfuscation. If the question says "must not be able to infer the value," masking alone is wrong.
- **RLS in the warehouse doesn't protect data read through Spark/OneLake.** Users with ReadAll bypass SQL-level RLS. Least privilege: give ReadData, not ReadAll.
- **Semantic model RLS only applies to viewers.** It doesn't restrict workspace Admins, Members or Contributors.
- **Certified requires admin enablement.** "Any author marks it certified" is wrong.

---

### MODULE 4 (1:25) — The development lifecycle: Git, deployment pipelines, PBIP, XMLA
*Skill area: Maintain a data analytics solution*

**Verbatim opening:**
"This module is about change: how a model or a notebook gets from your laptop to production without breaking anything. The exam tests four tools: Git integration for version control, deployment pipelines for promotion, Power BI Project files so models are diffable text, and the XMLA endpoint for enterprise tooling. You need to know which tool solves which problem."

**Talking points:**
- **Git integration:**
  - connect a workspace to an Azure DevOps or GitHub repo and branch;
  - commit and update from the Source control pane;
  - one workspace per branch is the common pattern;
  - feature workspaces branch out.
- **Power BI Project (.pbip):**
  - saves a report/model as folders of text (TMDL for the model, PBIR for the report);
  - diffable and mergeable;
  - `.pbix` is a binary file.
- **Deployment pipelines:**
  - stages (Dev → Test → Prod; up to 10);
  - compare, deploy all or selected items;
  - **deployment rules** swap data sources/parameters per stage;
  - backward deployment is possible.
- **XMLA endpoint:**
  - read-only lets tools query and inspect;
  - read-write lets Tabular Editor / ALM Toolkit / scripts deploy and change models;
  - needed for things like partition management and some OLS work.
- **Reusable assets:**
  - `.pbit` templates (report + model without data);
  - `.pbids` (a connection file);
  - shared semantic models (one model, many thin reports);
  - Build permission.
- **Impact analysis** before changing shared items.

**Demo:**
1. Workspace settings → Git integration → connect to a repo, branch `main`, folder `/fabric` → Connect and sync.
2. Edit a notebook → Source control → commit "add dedupe step."
3. Power BI Desktop → File → Options → Preview features → enable Power BI Project (.pbip) save option, if needed → Save as `.pbip`.
   - Open the folder.
   - Show the `definition/tables/*.tmdl` file.
4. Create a deployment pipeline → assign workspaces to Dev/Test/Prod → Deploy Dev → Test.
   - Deployment rules → semantic model → Parameter rule: `ServerName` = test server.
5. Tabular Editor → connect via the workspace's XMLA connection string (Workspace settings → License info → Connection link) → change a measure → Save to model.

**Exam traps:**
- **"Track changes and merge across developers"** → Git integration + `.pbip`, not deployment pipelines.
- **"Promote the same content to prod with a different data source"** → deployment pipeline + deployment rules.
- **"Deploy from Tabular Editor fails"** → XMLA read-write not enabled.
- **"Many reports, one source of truth"** → shared semantic model + Build permission, not copying the `.pbix`.

---

### MODULE 5 (2:00) — Get data: choosing a store and bringing data in
*Skill area: Prepare data*

**Verbatim opening:**
"Prepare data is nearly half the exam, so slow down here. It starts with two decisions: where should the data land, and how should it get there. If you can answer those two questions for any scenario, you'll pick up a lot of easy points."

**Talking points: where it should land**
- **Lakehouse:**
  - Spark/data engineering;
  - semi-structured or unstructured files plus Delta tables;
  - Python/Scala skills.
- **Warehouse:**
  - T-SQL skills;
  - structured data;
  - full DML;
  - multi-table transactions;
  - stored procedures.
- **Eventhouse (KQL):**
  - streaming/telemetry/logs;
  - time-series;
  - near real-time queries.

**Talking points: how it gets there**
- **Shortcuts:** no copy (ADLS Gen2, S3, GCS, Dataverse, other OneLake items).
- **Mirroring:** a near real-time replica of supported databases.
- **Copy job:** simple scheduled/incremental copy.
- **Pipelines:** orchestration plus the Copy activity.
- **Dataflow Gen2:** Power Query, low-code.
- **Notebooks:** code, any scale.
- **Eventstreams / Real-Time hub:** streaming.

**Talking points: discovery and integration**
- The **OneLake catalog** to discover data.
- **OneLake integration for eventhouse** (KQL tables made available as Delta in OneLake).
- **OneLake integration for semantic models** (import tables written to OneLake).

**Demo:**
1. Lakehouse → Get data → Upload files → `Files/raw/orders.csv`.
2. Lakehouse → New shortcut → ADLS Gen2 (or another lakehouse) → show it appear under Tables.
3. New item → Copy job → source Azure SQL → destination `wh_sales` → incremental.
4. Eventhouse → KQL database → OneLake availability = On.
5. OneLake catalog → filter by domain "Sales."

**Exam traps:**
- **"Avoid duplicating data that's already in ADLS"** → shortcut.
- **"Team only knows T-SQL and needs updates/deletes"** → warehouse, not lakehouse.
- **"Telemetry with sub-minute queries"** → eventhouse + eventstream.
- **"Near real-time copy of an Azure SQL DB with minimal development"** → mirroring.

---

### MODULE 6 (2:30) — Transform data: star schemas, SCDs, duplicates, nulls and types
*Skill area: Prepare data*

**Verbatim opening:**
"This is the hands-on heart of the exam. You'll be asked to pick the right transformation, put steps in order, or spot what's wrong with code. We'll do the same patterns in T-SQL, PySpark and Power Query, because the exam can show you any of the three. Patterns first, syntax second."

**Talking points:**
- **Star schema:** facts (events, numbers, foreign keys) and dimensions (descriptive attributes, surrogate keys).
- **Denormalize snowflaked dimensions** into one dimension (e.g., Product + Subcategory + Category).
- **Slowly changing dimensions:**
  - Type 1 overwrites.
  - Type 2 keeps history with `ValidFrom` / `ValidTo` / `IsCurrent` and a new surrogate key per version.
- **Data quality:**
  - duplicates (ROW_NUMBER / dropDuplicates / Remove duplicates);
  - nulls (COALESCE / fillna / Replace values);
  - types (CAST / cast / Change type).
- **Enrich:** add columns or tables (a date dimension).
- **Aggregate:** pre-aggregated tables for performance.
- **Merge/join:** know your join types, especially left anti joins to find missing keys.
- **Reusable SQL objects:** views, functions, stored procedures.
- **Medallion** (bronze/silver/gold) as an organizing pattern.

**Demo A: PySpark (lakehouse notebook)**
```python
from pyspark.sql import functions as F

# Bronze → Silver: types, duplicates, nulls
raw = spark.read.option("header", True).csv("Files/raw/orders.csv")

silver = (raw
    .withColumn("order_id",    F.col("order_id").cast("int"))
    .withColumn("customer_id", F.col("customer_id").cast("int"))
    .withColumn("order_date",  F.to_date("order_date"))
    .withColumn("amount",      F.col("amount").cast("decimal(18,2)"))
    .dropDuplicates(["order_id"])
    .fillna({"amount": 0})
    .filter(F.col("order_date").isNotNull()))

silver.write.mode("overwrite").format("delta").saveAsTable("silver_orders")

# Date dimension
dates = (spark.sql("SELECT explode(sequence(to_date('2020-01-01'), to_date('2030-12-31'))) AS Date")
    .withColumn("DateKey", F.date_format("Date", "yyyyMMdd").cast("int"))
    .withColumn("Year",    F.year("Date"))
    .withColumn("Month",   F.month("Date"))
    .withColumn("MonthName", F.date_format("Date", "MMMM")))
dates.write.mode("overwrite").format("delta").saveAsTable("dim_date")

# Gold fact with a date key
fact = (spark.table("silver_orders")
    .withColumn("DateKey", F.date_format("order_date", "yyyyMMdd").cast("int"))
    .select("order_id", "customer_id", "DateKey", "amount"))
fact.write.mode("overwrite").format("delta").saveAsTable("fact_sales")
```

**Demo B: SCD Type 1 with Delta MERGE (Spark SQL)**
```sql
%%sql
MERGE INTO dim_customer AS t
USING silver_customer AS s
  ON t.customer_id = s.customer_id
WHEN MATCHED THEN UPDATE SET t.name = s.name, t.region = s.region
WHEN NOT MATCHED THEN INSERT (customer_id, name, region) VALUES (s.customer_id, s.name, s.region);
```

**Demo C: SCD Type 2 in the warehouse (T-SQL)**
```sql
-- dbo.DimCustomer: CustomerSK (int), CustomerID, Name, Region, ValidFrom, ValidTo, IsCurrent
-- stg.Customer:   CustomerID, Name, Region   (today's snapshot)

-- 1) Expire current rows whose tracked attributes changed
UPDATE d
SET    ValidTo = CAST(GETDATE() AS date), IsCurrent = 0
FROM   dbo.DimCustomer AS d
JOIN   stg.Customer    AS s ON s.CustomerID = d.CustomerID
WHERE  d.IsCurrent = 1
  AND (d.Region <> s.Region OR d.Name <> s.Name);

-- 2) Insert new versions (changed customers) and brand-new customers
INSERT INTO dbo.DimCustomer (CustomerSK, CustomerID, Name, Region, ValidFrom, ValidTo, IsCurrent)
SELECT (SELECT COALESCE(MAX(CustomerSK), 0) FROM dbo.DimCustomer)
         + ROW_NUMBER() OVER (ORDER BY s.CustomerID),
       s.CustomerID, s.Name, s.Region,
       CAST(GETDATE() AS date), NULL, 1
FROM   stg.Customer AS s
LEFT JOIN dbo.DimCustomer AS d
       ON d.CustomerID = s.CustomerID AND d.IsCurrent = 1
WHERE  d.CustomerID IS NULL;
```
"Notice the order. Expire first, then insert anything that no longer has a current row. That covers both changed and brand-new customers in one insert. The surrogate key is generated with `MAX` plus `ROW_NUMBER`, a common Fabric Warehouse pattern."
- [RECORDING NOTE: if T-SQL `MERGE` is GA in Fabric Warehouse when you record, show the MERGE version too and say so.]

**Demo D: views, functions and procedures (warehouse)**
```sql
CREATE VIEW gold.vSalesByRegion AS
SELECT c.Region, d.Year, SUM(f.amount) AS TotalSales
FROM dbo.fact_sales f
JOIN dbo.DimCustomer c ON c.CustomerID = f.customer_id AND c.IsCurrent = 1
JOIN dbo.dim_date d    ON d.DateKey = f.DateKey
GROUP BY c.Region, d.Year;
GO
CREATE PROCEDURE etl.usp_LoadDaily AS
BEGIN
    -- call the SCD steps above, then rebuild aggregates
    DELETE FROM gold.SalesAgg;
    INSERT INTO gold.SalesAgg SELECT * FROM gold.vSalesByRegion;
END;
```

**Demo E: Power Query (Dataflow Gen2)**
1. Remove duplicates on the key.
2. Replace values null → 0.
3. Change type.
4. Merge queries (Left anti) to find orders with no customer.
5. Group by.
6. Set the data destination.

**Exam traps:**
- **"Keep history of changes to a customer's region"** → SCD Type 2, not Type 1.
- **Find fact rows with no matching dimension row** → left anti join (or `LEFT JOIN … WHERE d.key IS NULL`).
- **Order-of-steps questions:**
  - type conversion before dedupe if keys arrive as strings with spaces;
  - dedupe before aggregating.
- **Snowflaked product → subcategory → category** → denormalize into one dimension for a star schema.
- **Lakehouse tables are written by Spark,** not by `UPDATE` through the SQL analytics endpoint.

---

### MODULE 7 (3:25) — Query and analyze: SQL, visual query, KQL and DAX
*Skill area: Prepare data*

**Verbatim opening:**
"The outline says you need to select, filter and aggregate data four ways: the visual query editor, SQL, KQL and DAX. You don't need to be an expert in all four. You need to read a short query in each and know what it returns. Let's do the same question in each language: total sales by region for the last year."

**Demo: SQL**
```sql
SELECT c.Region, SUM(f.amount) AS TotalSales
FROM dbo.fact_sales f
JOIN dbo.DimCustomer c ON c.CustomerID = f.customer_id AND c.IsCurrent = 1
JOIN dbo.dim_date d    ON d.DateKey = f.DateKey
WHERE d.Date >= DATEADD(year, -1, CAST(GETDATE() AS date))
GROUP BY c.Region
ORDER BY TotalSales DESC;
```

**Demo: visual query editor.**
1. Warehouse → New visual query.
2. Drag in fact_sales and DimCustomer.
3. Merge.
4. Filter the date.
5. Group by Region.
6. Show the generated SQL.

**Demo: KQL (eventhouse)**
```kusto
Sales
| where Timestamp > ago(365d)
| summarize TotalSales = sum(Amount) by Region
| order by TotalSales desc
```
And a time-series example:
```kusto
Telemetry
| where Timestamp > ago(1d)
| summarize AvgTemp = avg(Temperature) by bin(Timestamp, 1h), DeviceId
| render timechart
```
"KQL reads top to bottom. Each pipe passes the result to the next step. `where` filters, `summarize` aggregates, `bin` buckets time, `project` picks columns, `extend` adds columns, `take` gives you a sample."

**Demo: DAX query view** (Power BI Desktop or web modeling)
```dax
EVALUATE
SUMMARIZECOLUMNS(
    DimCustomer[Region],
    FILTER(ALL('dim_date'[Date]), 'dim_date'[Date] >= TODAY() - 365),
    "Total Sales", SUM(fact_sales[amount])
)
ORDER BY [Total Sales] DESC
```
Also show:
```dax
EVALUATE INFO.TABLES()
```

**Exam traps:**
- **KQL `summarize … by` is the GROUP BY.** `project` is SELECT; `extend` adds a calculated column.
- **DAX queries start with `EVALUATE`** and return a table. A measure definition alone isn't a query.
- **The visual query editor generates SQL** (it's still a SQL query underneath).

---

### MODULE 8 (3:50) — Design and build semantic models
*Skill area: Implement and manage semantic models*

**Verbatim opening:**
"Now the semantic model: the part your business users actually touch. The exam tests design choices more than clicks. Which storage mode, which relationship, which DAX pattern, and when to use calculation groups or field parameters. For each one, I'll tell you the scenario the exam pairs it with."

**Talking points: storage modes**

| Mode | What it is | Pair it with |
|---|---|---|
| Import | Data copied into the model; fastest queries; needs refresh | Small/medium data, complex DAX, offline sources |
| DirectQuery | Queries the source live | Real-time from a SQL source, data that can't be copied |
| Direct Lake | Reads Delta tables in OneLake directly; no import refresh | Large Fabric lakehouse/warehouse data, near-import speed |
| Dual | Acts as Import or DirectQuery as needed | Dimension tables in composite models |
| Composite | Mix of modes in one model | Import aggregates + DirectQuery detail, or extending a shared model |

- **Direct Lake flavors** (verify current names):
  - **Direct Lake on SQL endpoints** can fall back to DirectQuery.
  - **Direct Lake on OneLake** reads Delta directly and doesn't fall back.

**Talking points: relationships**
- One-to-many, single-direction filtering by default.
- **Many-to-many** through a bridge table (e.g., Customer ↔ Account).
- **Bidirectional filtering:** only when needed; it can cause ambiguity and slow queries.
- **Role-playing dates:** inactive relationships + `USERELATIONSHIP`.

**Talking points: DAX the exam expects**
- variables;
- iterators (`SUMX`, `AVERAGEX`);
- table filtering (`CALCULATE`, `FILTER`, `ALL`, `KEEPFILTERS`, `REMOVEFILTERS`);
- windowing (`WINDOW`, `OFFSET`, `INDEX`);
- information functions (`ISINSCOPE`, `HASONEVALUE`, `SELECTEDVALUE`).

**Talking points: other modeling features**
- calculation groups;
- dynamic format strings;
- field parameters;
- large semantic model storage format;
- composite models.

**Demo: measures**
```dax
Total Sales = SUM ( fact_sales[amount] )

Sales Margin % =
VAR Sales = [Total Sales]
VAR Cost  = SUMX ( fact_sales, fact_sales[quantity] * RELATED ( DimProduct[UnitCost] ) )
RETURN DIVIDE ( Sales - Cost, Sales )

Sales (Ship Date) =
CALCULATE ( [Total Sales], USERELATIONSHIP ( fact_sales[ShipDateKey], dim_date[DateKey] ) )

Sales Prev Month =
CALCULATE (
    [Total Sales],
    OFFSET ( -1, ALLSELECTED ( dim_date[Year], dim_date[Month] ), ORDERBY ( dim_date[Year], ASC, dim_date[Month], ASC ) )
)

% of Region =
DIVIDE ( [Total Sales], CALCULATE ( [Total Sales], REMOVEFILTERS ( DimCustomer[Region] ) ) )
```

**Demo: calculation group** (Desktop → Model view → Calculation group, or Tabular Editor)
```dax
-- Calculation group: Time Intelligence, column: Period
Current = SELECTEDMEASURE ()
YTD     = CALCULATE ( SELECTEDMEASURE (), DATESYTD ( dim_date[Date] ) )
PY      = CALCULATE ( SELECTEDMEASURE (), SAMEPERIODLASTYEAR ( dim_date[Date] ) )
YoY %   =
VAR Cur = SELECTEDMEASURE ()
VAR Prev = CALCULATE ( SELECTEDMEASURE (), SAMEPERIODLASTYEAR ( dim_date[Date] ) )
RETURN DIVIDE ( Cur - Prev, Prev )
```
- The dynamic format string on `YoY %`: `"0.0%"`. Every other item keeps the measure's format via `SELECTEDMEASUREFORMATSTRING()`.
- "One calculation group replaces three time-intelligence measures for every base measure. That's the scenario the exam pairs with calculation groups: lots of repeated measures."

**Demo: field parameter.**
1. Modeling → New parameter → Fields.
2. Add Region, Product Category and Year.
3. Use it as a slicer and the axis.
4. "Field parameters let users swap the dimension or measure on a visual."

**Demo: bridge table.**
1. DimCustomer 1→* BridgeCustomerAccount *←1 DimAccount.
2. Set the filter direction so customer filters flow to accounts.

**Exam traps:**
- **"Users pick which measure a chart shows"** → field parameters, not calculation groups. **"The same time logic on many measures"** → calculation groups.
- **Many-to-many with a clean dimension on each side** → bridge table, not a direct many-to-many between two fact tables.
- **"Real-time from an Azure SQL source, can't copy data"** → DirectQuery. **"Billions of rows already in a Fabric lakehouse, near-import speed"** → Direct Lake.
- **Composite model dimensions** used with both Import and DirectQuery tables → Dual.
- **`USERELATIONSHIP` only works on an existing inactive relationship.**

---

### MODULE 9 (4:50) — Optimize enterprise-scale semantic models
*Skill area: Implement and manage semantic models*

**Verbatim opening:**
"Last technical module: making models fast and keeping them fast at scale. The exam asks you to diagnose slow reports, fix DAX, understand Direct Lake's behavior, and set up incremental refresh. The skill is knowing which tool tells you what's wrong, so let's start with the tools."

**Talking points:**
- **Performance analyzer** (Desktop) splits each visual's time into DAX query, visual display and other. Copy the query into DAX Studio.
- **DAX Studio:**
  - server timings (formula engine vs storage engine);
  - query plans;
  - VertiPaq Analyzer (column sizes, cardinality).
- **Tabular Editor Best Practice Analyzer** and **Semantic Link** (`sempy`) in notebooks to scan models.
- **Common fixes:**
  - reduce cardinality (split datetime into date and time, drop unused columns);
  - star schema over flat tables;
  - avoid bidirectional filters;
  - use variables;
  - avoid `FILTER` over whole tables when a column filter works.
- **Direct Lake behavior:**
  - **Framing:** a "refresh" just points the model at the latest Delta version. It's fast, metadata only.
  - **Automatic updates** option.
  - **Fallback to DirectQuery** (on SQL endpoints): triggered by views, SQL-endpoint RLS, or exceeding SKU guardrails.
  - The **`DirectLakeBehavior` property:** Automatic / DirectLakeOnly / DirectQueryOnly.
- **Delta table health for Direct Lake:** V-Order, `OPTIMIZE` for small files, sensible row-group sizes.
- **Incremental refresh** (Import):
  - `RangeStart` / `RangeEnd` DateTime parameters;
  - the policy (store N years, refresh last N days);
  - optional real-time DirectQuery partition;
  - "detect data changes."
- **Large semantic model storage format:** needed for big models; enables faster XMLA write operations. Check the current defaults.
- **Aggregations** in composite models.

**Demo:**
1. Performance analyzer → Start recording → Refresh visuals → expand the slow visual → Copy query.
2. DAX Studio → paste → Server Timings on → run → compare FE vs SE time.
3. Rewrite:
```dax
-- Slow: iterates the whole table
Big Orders = CALCULATE ( [Total Sales], FILTER ( fact_sales, fact_sales[amount] > 1000 ) )
-- Better: filter a column
Big Orders = CALCULATE ( [Total Sales], KEEPFILTERS ( fact_sales[amount] > 1000 ) )
```
4. VertiPaq Analyzer → find the highest-cardinality column (often a datetime or GUID) → fix upstream.
5. Lakehouse notebook:
```sql
%%sql
OPTIMIZE fact_sales VORDER;
```
6. Direct Lake model → Settings → refresh/automatic updates; Tabular Editor → model property `DirectLakeBehavior` = `DirectLakeOnly`, to see a failure instead of silent fallback while testing.
7. Incremental refresh:
   - Power Query → Manage parameters → `RangeStart` / `RangeEnd` (DateTime).
   - Filter `OrderDate >= RangeStart and < RangeEnd`.
   - Table → Incremental refresh: archive 5 years, refresh 10 days.

**Exam traps:**
- **"Report got slow after adding a view to a Direct Lake model"** → it's falling back to DirectQuery (Direct Lake on SQL endpoint). Fix: use tables, not views, or materialize the view.
- **Incremental refresh parameters must be named `RangeStart` and `RangeEnd`** and typed DateTime.
- **Mostly storage-engine time** → model or data problem (size, cardinality). **Mostly formula-engine time** → DAX problem.
- **Direct Lake "refresh" doesn't copy data.** It's framing, and it's fast.

---

### PRACTICE QUESTIONS (5:30)
**Verbatim:**
"Ten practice questions. Pause after each one, answer it, then play to see the explanation. These are original questions written in the style of the exam, not real exam content."

1. **Q:** Your team writes T-SQL only and needs multi-table transactions with `UPDATE` and `DELETE`. Which item should store the data?
   A) Lakehouse B) Warehouse C) Eventhouse D) Lakehouse SQL analytics endpoint
   **Answer: B.** The lakehouse SQL analytics endpoint is read-only for data. A warehouse supports full T-SQL DML and transactions.
2. **Q:** Data already sits in ADLS Gen2 in Delta format. Analysts need it in a lakehouse with no duplicate storage. What should you do?
   A) Copy job B) Data pipeline Copy activity C) Shortcut D) Mirroring
   **Answer: C.** A shortcut references the data in place.
3. **Q:** Analysts must see every column of `dbo.Customer` except `Email` and `Phone`, with the least effort. What do you use?
   A) Dynamic data masking B) Column-level security with `GRANT SELECT` on the allowed columns C) A separate workspace D) Semantic model RLS
   **Answer: B.** Masking can still leak values to users who can run arbitrary queries; CLS removes access.
4. **Q:** You need to promote a semantic model from Test to Prod and point it at a production server automatically. What do you use?
   A) Git integration B) Deployment pipeline with a deployment rule C) `.pbit` template D) XMLA read-only
   **Answer: B.**
5. **Q:** You must keep the history of each customer's region changes for reporting. Which pattern?
   A) SCD Type 1 B) SCD Type 2 C) Append-only fact table D) Overwrite with `MERGE`
   **Answer: B.**
6. **Q:** In KQL, which operator groups rows and computes aggregates?
   A) `extend` B) `project` C) `summarize` D) `where`
   **Answer: C.**
7. **Q:** You have 30 base measures and need YTD, PY and YoY % for each. What minimizes maintenance?
   A) 90 new measures B) Field parameters C) A calculation group D) Bidirectional relationships
   **Answer: C.**
8. **Q:** A Direct Lake report slows down after you add a SQL view to the model. Most likely cause?
   A) Framing failed B) The model fell back to DirectQuery C) V-Order was disabled D) Incremental refresh is misconfigured
   **Answer: B.** Views trigger DirectQuery fallback for Direct Lake on SQL endpoints.
9. **Q:** You configure incremental refresh but the option is unavailable. What is missing?
   A) DateTime parameters named `RangeStart` and `RangeEnd` used to filter the table B) XMLA read-write C) Large storage format D) A Direct Lake connection
   **Answer: A.**
10. **Q:** A workspace user must create and edit items but must not manage access. Least-privileged role?
    A) Admin B) Member C) Contributor D) Viewer
    **Answer: C.**

---

### EXAM DAY AND OUTRO (5:50)
**Verbatim:**
"Before you book it, three things.

One. Go back to the official study guide and tick every line. If you can't explain a line out loud in one sentence, rewatch that chapter.

Two. Do the free practice assessment on Microsoft Learn. If you're scoring well above passing a couple of times in a row, book it.

Three. On the day, read the last sentence of each question first. It tells you what they're actually asking: least privilege, least effort, lowest cost. That phrase usually decides between two answers that both work. Flag anything you're unsure of, keep moving, and come back. Don't spend your Learn lookups early.

And when you pass, renewal is a free online assessment once a year. Don't let it lapse.

If this helped, the DP-700 course for the data engineer side is linked here, and every module of this course is also on the channel as a separate video if you want to study in smaller pieces. Good luck. Come back and tell me your score."

---

## Chapters
0:00 DP-600 course intro (2026)
0:30 Exam format, passing score and skill areas
0:08:00 Module 1: Fabric mental model (OneLake, lakehouse, warehouse, eventhouse)
0:25:00 Module 2: Workspaces, capacities and admin settings
0:50:00 Module 3: Security and governance (roles, RLS, CLS, masking, labels, endorsement)
1:25:00 Module 4: Git, deployment pipelines, PBIP and XMLA
2:00:00 Module 5: Get data (choosing a store, shortcuts, mirroring, copy job)
2:30:00 Module 6: Transform data (star schema, SCD Type 2, duplicates, nulls)
3:25:00 Module 7: Query with SQL, visual query, KQL and DAX
3:50:00 Module 8: Semantic models (storage modes, relationships, DAX, calculation groups)
4:50:00 Module 9: Optimize (DAX Studio, Direct Lake fallback, incremental refresh)
5:30:00 10 practice questions
5:50:00 Exam day tips and outro

## Description + tags
DP-600 full course 2026: everything you need to pass the Microsoft Fabric Analytics Engineer Associate exam, following the current skills outline.
Six hours of demos in T-SQL, PySpark, DAX and KQL, the exam traps that cost people points, and 10 original practice questions.

📄 Official DP-600 study guide: [link]
💻 All code from the course: [link]
🧪 Free Microsoft Fabric trial: [link]
▶️ The same course as a 12-part series: [playlist link]

Tags: dp-600, dp-600 exam, dp-600 full course, microsoft fabric certification, fabric analytics engineer, microsoft fabric course, power bi semantic model, semantic model, direct lake, fabric lakehouse, fabric warehouse, kql, dax, microsoft fabric 2026, dp-600 practice questions

## Shorts cutdowns

**Short 1: "Lakehouse or warehouse? DP-600 answer" (≈40s)**
[ON SCREEN: "DP-600: Lakehouse or Warehouse?"]
"The DP-600 exam asks this a lot: lakehouse or warehouse? Here's the shortcut. If the team writes T-SQL and needs updates, deletes or multi-table transactions, it's the warehouse. The lakehouse SQL endpoint is read-only for data. If they use Spark, Python or have files that aren't tables, it's the lakehouse. Streaming and logs? Eventhouse."
[ON SCREEN: "T-SQL + DML → Warehouse · Spark/files → Lakehouse · Streaming → Eventhouse"]

**Short 2: "The Direct Lake trap" (≈40s)**
[ON SCREEN: "Why did my Direct Lake report get slow?"]
"Classic DP-600 trap. Your Direct Lake report was fast. You add a SQL view to the model. Now it's slow. Why? Direct Lake on the SQL endpoint can't read views directly, so it falls back to DirectQuery. Fix it by using tables, or materializing the view. And while testing, set the model's Direct Lake behavior to Direct Lake only, so you see the failure instead of a silent fallback."
[ON SCREEN: "View in model → DirectQuery fallback"]

**Short 3: "Calculation groups vs field parameters" (≈35s)**
[ON SCREEN: "Calc groups or field parameters?"]
"Calculation groups or field parameters? On DP-600, it comes down to one question. Do you want the same logic, like YTD or prior year, applied to many measures? Calculation group. Do you want users to pick which field or measure a visual shows? Field parameter. Same logic everywhere, or user picks: that's the whole difference."
[ON SCREEN: "Same logic on many measures → Calc group · User chooses the field → Field parameter"]

## LinkedIn post
[Diagram: three stacked bars for the DP-600 skill areas, with "Prepare data" visibly the largest at 45–50% (verify), and the other two at 25–30%.]

Most people study for DP-600 backwards.

They spend weeks on DAX and Power BI visuals. But "Prepare data" (lakehouses, warehouses, T-SQL, PySpark, SCDs, KQL) is close to half the exam on the current outline.

If you come from Power BI, flip your plan:
→ Learn when to pick lakehouse vs warehouse vs eventhouse.
→ Write one SCD Type 2 load in T-SQL by hand.
→ Read 10 short KQL queries.
→ Then go back to semantic models and Direct Lake.

The exam rewards knowing *where* things live in Fabric more than memorizing clicks.

I put the full 6-hour DP-600 course for 2026 on the channel, following the outline module by module.

---

## Numbered-series cut list (publish after the full course, 1–2 per week)
| # | Title | Source chapter | Approx length |
|---|---|---|---|
| 1 of 12 | DP-600 EXAM PREP 2026, Video 1 of 12: Introduction and How the Exam Works | Hook + course intro + Module 1 | ~25 min |
| 2 of 12 | Workspaces, Capacities and Admin Settings in Microsoft Fabric (DP-600 2 of 12) | Module 2 | ~25 min |
| 3 of 12 | Fabric Security: Roles, RLS, Column Security and Masking (DP-600 3 of 12) | Module 3, first half | ~20 min |
| 4 of 12 | Governance: Sensitivity Labels, Endorsement and Lineage (DP-600 4 of 12) | Module 3, second half | ~15 min |
| 5 of 12 | Git Integration, Deployment Pipelines, PBIP and XMLA (DP-600 5 of 12) | Module 4 | ~35 min |
| 6 of 12 | Lakehouse vs Warehouse vs Eventhouse + Getting Data In (DP-600 6 of 12) | Module 5 | ~30 min |
| 7 of 12 | Star Schemas, Duplicates, Nulls and Types in Fabric (DP-600 7 of 12) | Module 6, Demos A, D, E | ~30 min |
| 8 of 12 | Slowly Changing Dimensions (Type 1 and 2) in Fabric (DP-600 8 of 12) | Module 6, Demos B, C | ~25 min |
| 9 of 12 | Query Fabric Data with SQL, KQL and DAX (DP-600 9 of 12) | Module 7 | ~25 min |
| 10 of 12 | Semantic Model Design: Storage Modes and Relationships (DP-600 10 of 12) | Module 8, first half | ~30 min |
| 11 of 12 | DAX, Calculation Groups and Field Parameters for DP-600 (11 of 12) | Module 8, second half | ~30 min |
| 12 of 12 | Optimize Semantic Models + Direct Lake + Practice Questions (DP-600 12 of 12) | Module 9 + practice questions + outro | ~50 min |

**Notes for the series:**
- Each part opens with a 20-second recap and ends with "next: video N+1."
- Use one playlist, and pin it in the full course's description.
- Video 1 matters most: the model channel's "Video 1 of 12" got almost twice the views of video 2, so spend the most time on its title and thumbnail.
