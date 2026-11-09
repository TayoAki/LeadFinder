# Backlog b11: dbt on Microsoft Fabric in Production: dbt Job vs dbt Core (2026)

## Evidence (r/MicrosoftFabric, mined 2026-11-09; paraphrased, no usernames)
| Thread | Score / comments | Date | What it tells us |
|---|---|---|---|
| "Are you using dbt with Microsoft Fabric in production? How is your experience?" | 35 / **68** | 2026-11 | Asks the exact three-way question: dbt Core locally, Fabric dbt Jobs, or dbt inside notebooks? Is Warehouse stable enough? |
| "dbt jobs are now native in Microsoft Fabric (Preview)" | 73 / 51 | 2026-01 | Launch post: tenant setting, Git + CI/CD, compiled SQL and lineage |
| "dbt Job is now generally available in Microsoft Fabric, and dbt Fusion private preview is open" | 23 / 47 | 2026-10 | GA: Lakehouse adapter via Livy, GitHub import, dbt Core 1.11 runtime, pipeline activity, Variable Library CI/CD, REST API. Roadmap: SPN/workspace identity, VS Code, Azure DevOps repos |
| "Lakehouse dbt Integration" | 19 / 45 | 2026-08 | "I already do silver→gold in a Spark SQL notebook. What does dbt add?" |
| "A lot has changed for dbt in Fabric since public preview" | 51 / 30 | 2026-08 | Microsoft says 33% of dbt job runs come from the pipeline activity |
| "OPINION: Seven months later, still not convinced by dbt Jobs" | 57 / 29 | 2026-08 | Most teams run dbt Core from elsewhere; UI-bound editing; confusing "many non-obvious ways" |
| "dbt-fabric v1.10.1: adapter moved from pyodbc to mssql-python" | 41 / 15 | 2026-08 | No more ODBC driver installs; Python 3.12 minimum; Python models unsupported on Warehouse; Purview lineage opt-in |

**Gap:** there are release posts and opinion threads, but nobody has shown the two production paths side by side with a recommendation. Search data: "dbt data build tool" outliers in creators research (13–14× views/subs).

---

# Wk B11: dbt on Microsoft Fabric in Production: dbt Job vs dbt Core (Honest 2026 Setup)
- **Runtime target:** 14–15 min
- **Pillar:** 4 (code-along) + 2 (decision)
- **Target keywords:** "dbt fabric", "dbt microsoft fabric", "dbt-fabric adapter", "fabric dbt job". No reliable Google volume measured. Support signal: 68-comment production thread plus the dbt-tutorial outliers (13–14× views/subs on small channels).
- **Title options:**
  1. dbt on Microsoft Fabric in Production: dbt Job vs dbt Core (2026)
  2. The ONLY dbt + Fabric Setup You Need (Warehouse & Lakehouse)
  3. Should You Use Fabric's dbt Job? I Set Up Both
- **Thumbnail:** "dbt JOB vs CORE?" with the dbt logo, the Fabric logo, and a split screen (Fabric UI | VS Code terminal)
- **Verify before recording:**
  - dbt Job GA status, the tenant setting name ("Users can create dbt job items"), and whether it still says "preview" anywhere in the UI.
  - Managed runtime version (community post says dbt Core 1.11).
  - Lakehouse support in dbt Job (via Livy/Spark) and its startup time.
  - dbt Job roadmap items (service principal / workspace identity, Azure DevOps repos, VS Code, multiple profiles, private packages). Say "on the roadmap" only if still true.
  - dbt Fusion private preview status and which targets it supports.
  - dbt-fabric adapter current version; whether `driver:` is still needed in profiles.yml after the mssql-python switch (v1.10.1); Python ≥3.12 requirement; exact `authentication` values (CLI, ServicePrincipal, ActiveDirectoryAccessToken).
  - Lakehouse adapter name for dbt Core (`dbt-fabricspark`) and its current auth options.
  - Pipeline "dbt job" activity name in the activity list.
  - Variable Library support for dbt Job CI/CD.

## Hook (0:00–0:30)
"There are at least three ways to run dbt on Microsoft Fabric, and the community can't agree which one is right. In the last month alone, a thread asking 'are you using dbt on Fabric in production?' got sixty-eight replies. So I set up both real options: Fabric's built-in dbt Job, and plain dbt Core with the dbt-fabric adapter running from GitHub Actions. In fifteen minutes you'll know which one to pick, you'll have a working profiles.yml, and you'll have a deployment setup you can copy."

## Script

### 0:30 Why dbt on Fabric at all
"First, the honest question from a forty-five-comment thread: 'I already transform silver to gold in a Spark SQL notebook. What does dbt add?'

Here's what it adds. Four things.

One: a dependency graph. You write `ref('stg_orders')` instead of hard-coding table names, and dbt figures out run order. No more orchestrating twenty notebooks by hand.

Two: tests that run every time. Not-null, unique, accepted values, relationships. They're one line of YAML each.

Three: docs and lineage, generated from your code.

Four: everything is SQL files in Git. Reviewable. Diffable.

What it doesn't add: speed. dbt doesn't make Spark or the Warehouse faster. It's a way to organize transformations, not an engine.

If you have three notebooks and one person, a notebook is fine. If you have fifty models and a team, dbt pays for itself."

[ON SCREEN: two columns. "Notebook: fine for <10 transforms, 1 person" | "dbt: graph, tests, docs, Git, team-scale"]

### 1:45 The three ways people run dbt on Fabric
"Here are your options.

Option A: Fabric dbt Job. A Fabric item. Fabric hosts dbt Core for you, runs it on your capacity, and stores logs in OneLake.

Option B: dbt Core, run from outside. Your laptop for development, and GitHub Actions or Azure DevOps for production. It uses the dbt-fabric adapter for the Warehouse, or dbt-fabricspark for a Lakehouse.

Option C: dbt Core inside a Fabric notebook. You pip install dbt in a notebook and run it there. It works, but you're building your own scheduler and log handling on top of a notebook. I'll mention it once and move on. Most teams who started there have moved to A or B."

[ON SCREEN: three cards A / B / C, with C greyed out]

### 2:45 The project we'll deploy
"Same tiny project for both. Two staging models, one mart, and tests.

[DEMO: VS Code, project tree]
```
fabric_dbt/
├── dbt_project.yml
├── packages.yml
├── models/
│   ├── staging/
│   │   ├── _sources.yml
│   │   ├── stg_orders.sql
│   │   └── stg_customers.sql
│   └── marts/
│       ├── fct_orders.sql
│       └── _marts.yml
```

`dbt_project.yml`:
```yaml
name: fabric_dbt
version: "1.0.0"
profile: fabric_dbt
model-paths: ["models"]
models:
  fabric_dbt:
    staging:
      +materialized: view
      +schema: staging
    marts:
      +materialized: table
      +schema: marts
```

Sources point at our silver lakehouse tables. The Warehouse can read lakehouse tables in the same workspace with three-part names, so the source database is the lakehouse:
```yaml
# models/staging/_sources.yml
version: 2
sources:
  - name: silver
    database: lh_silver        # lakehouse name
    schema: dbo
    tables:
      - name: orders
      - name: customers
```

```sql
-- models/staging/stg_orders.sql
select
    cast(order_id as bigint)        as order_id,
    cast(customer_id as bigint)     as customer_id,
    cast(order_ts as datetime2(6))  as order_ts,
    cast(amount as decimal(18,2))   as amount,
    lower(status)                   as status
from {{ source('silver', 'orders') }}
where order_id is not null
```

```sql
-- models/marts/fct_orders.sql
select
    o.order_id,
    o.customer_id,
    c.region,
    cast(o.order_ts as date) as order_date,
    o.amount,
    o.status
from {{ ref('stg_orders') }} o
left join {{ ref('stg_customers') }} c
  on o.customer_id = c.customer_id
```

```yaml
# models/marts/_marts.yml
version: 2
models:
  - name: fct_orders
    columns:
      - name: order_id
        tests: [not_null, unique]
      - name: status
        tests:
          - accepted_values:
              values: ['placed','shipped','returned','cancelled']
```
That's it. Now let's run it two ways."

### 4:15 Option A: Fabric dbt Job, step by step
"First, a tenant admin turns on dbt jobs.

[DEMO: Admin portal → Tenant settings → search 'dbt' → enable 'Users can create dbt job items' for a security group → Apply]

Now, in the workspace where your Warehouse lives:

[DEMO: + New item → dbt job → name it `dbt_fct_orders`]

You can start empty, but we already have a project in GitHub, so we import it.

[DEMO: Import from GitHub → pick repo and branch → select the project folder]

Next, the connection. You pick the target: our Warehouse `wh_gold`. There's no profiles.yml to write here; Fabric builds the profile from the item you pick. That's the main convenience.

[DEMO: Settings → Target → Warehouse → wh_gold → schema dbo]

Commands. You get the familiar ones: build, run, test, seed, snapshot, compile, docs generate. I'll use `build` with a selector so it runs and tests only the marts plus whatever they depend on.

[DEMO: Command: `build` · Select: `+fct_orders` → Run]

[ON SCREEN: run log streaming: deps → compile → model results → tests]

Look at the output. Each model, its status, the compiled SQL, and the logs all land in OneLake, so you can query or keep them.

Now orchestrate it. Open your pipeline. After the copy activity that lands silver, add the dbt job activity.

[DEMO: Pipeline → Activities → dbt job → pick `dbt_fct_orders` → parameter `select` = `marts` → on success → Semantic model refresh]

So the flow is: ingest, then dbt build, then refresh the model. One pipeline, one alert if it fails.

Deploying to test and prod: the dbt Job uses a Variable Library, so the target warehouse can differ per stage when you promote with a deployment pipeline.

[DEMO: Variable library `vl_dbt` → variable `target_warehouse` → value sets: Dev = wh_gold_dev, Prod = wh_gold → reference it in the dbt job's target]

What I like: no infrastructure, no secrets in GitHub, runs on capacity you already pay for, lineage and logs in OneLake.

What to know before you commit:
- It runs on your Fabric capacity, so its CU usage counts against everything else.
- At the time I'm recording, it runs as a user identity. Service principal and workspace identity support are listed as roadmap. That matters if the job owner leaves.
- Day-to-day editing happens in the Fabric UI. If your team lives in VS Code, that's friction. Native VS Code support is also on the roadmap."

### 8:15 Option B: dbt Core + dbt-fabric from GitHub Actions
"Option B. Same project, run by dbt Core.

Install the adapter. In 2026 the Warehouse adapter switched its driver to Microsoft's mssql-python, which bundles its own driver binaries. No more ODBC installs in your Docker image. It needs Python 3.12 or newer.

[DEMO: terminal]
```bash
python -m venv .venv && source .venv/bin/activate
pip install dbt-fabric
dbt --version
```

profiles.yml. Two targets: `dev` uses your own Azure CLI login, and `prod` uses a service principal pulled from environment variables.

```yaml
# ~/.dbt/profiles.yml   (never commit secrets)
fabric_dbt:
  target: dev
  outputs:
    dev:
      type: fabric
      server: "{{ env_var('FABRIC_SQL_ENDPOINT') }}"   # xxxx.datawarehouse.fabric.microsoft.com
      port: 1433
      database: wh_gold_dev
      schema: dbo
      authentication: CLI          # uses `az login`
      threads: 4
    prod:
      type: fabric
      server: "{{ env_var('FABRIC_SQL_ENDPOINT') }}"
      port: 1433
      database: wh_gold
      schema: dbo
      authentication: ServicePrincipal
      tenant_id: "{{ env_var('AZURE_TENANT_ID') }}"
      client_id: "{{ env_var('AZURE_CLIENT_ID') }}"
      client_secret: "{{ env_var('AZURE_CLIENT_SECRET') }}"
      threads: 8
```
Where do you find the server? In the Warehouse, go to Settings, then SQL endpoint, and copy the connection string.

[DEMO: Warehouse → Settings → SQL endpoint → copy]

The service principal needs to be allowed to use Fabric APIs by your tenant admin, and it needs at least Contributor on the workspace.

Run it locally:
```bash
az login
dbt debug          # checks the connection
dbt build --select +fct_orders
```

[ON SCREEN: green PASS lines]

Now production. A GitHub Actions workflow that runs on merge to main and every night at 5 a.m. UTC:

```yaml
# .github/workflows/dbt-prod.yml
name: dbt-prod
on:
  push:
    branches: [main]
  schedule:
    - cron: "0 5 * * *"
jobs:
  build:
    runs-on: ubuntu-latest
    environment: prod          # add required reviewers here
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: "3.12" }
      - run: pip install dbt-fabric
      - run: dbt deps
      - run: dbt build --target prod
        env:
          DBT_PROFILES_DIR: ./ci
          FABRIC_SQL_ENDPOINT: ${{ secrets.FABRIC_SQL_ENDPOINT }}
          AZURE_TENANT_ID: ${{ secrets.AZURE_TENANT_ID }}
          AZURE_CLIENT_ID: ${{ secrets.AZURE_CLIENT_ID }}
          AZURE_CLIENT_SECRET: ${{ secrets.AZURE_CLIENT_SECRET }}
```
Put a copy of profiles.yml without secrets in `ci/profiles.yml`. Secrets live in GitHub.

Going to a Lakehouse instead of the Warehouse? That's a different adapter, dbt-fabricspark, which talks to Spark through the Livy API. Same project structure, different profile. I'll put a sample in the description.

Two adapter gotchas to know:
- Python models aren't supported against the Warehouse. There's no Python runtime there. If you need Python models, target Spark.
- Old versions defaulted strings to varchar(8000), which could silently truncate. Upgrade."

### 11:15 Which one should you pick?
"Decision time.

[ON SCREEN: decision table]

| If… | Pick |
|---|---|
| Small team, lives in Fabric, wants zero infra | **dbt Job** |
| You need pipeline orchestration: ingest → dbt → refresh | **dbt Job** (native activity) or **Core** called from a pipeline via API |
| Team develops in VS Code, wants PR checks and local runs | **dbt Core + GitHub Actions** |
| You must run as a service principal today | **dbt Core** (check if dbt Job has caught up) |
| You already run dbt Core elsewhere and it works | **Stay**. Don't migrate for the sake of it |
| Lakehouse-only shop | Either: dbt Job's Lakehouse adapter, or dbt-fabricspark |

My recommendation: if you're starting fresh and you're not a VS Code-first team, start with the dbt Job. It's the shortest path, and it's GA now. If you're a code-first team, especially if you came from Databricks or Snowflake, run dbt Core from GitHub Actions. You keep local runs, PR checks, and identity control.

And whatever you pick, pick one. The loudest complaint in that seven-month opinion thread wasn't about dbt. It was about Fabric having many non-obvious ways to do the same thing. Write your choice down in your team's README so nobody builds the third way."

### 13:00 Production checklist
"Five things before you call it production:
1. Tests on every mart's primary key: `not_null` and `unique`.
2. `dbt build`, not `dbt run`. Build runs tests in dependency order and stops downstream models on failure.
3. Source freshness checks before the run, so you don't build gold on stale silver.
4. Alerts: a pipeline failure email or Teams message, or a GitHub Actions failure notification.
5. Watch CU usage in the Capacity Metrics app for the first week. dbt can generate a lot of small queries.

Link to the sample project is in the description. If you want the full CI/CD story with Dev, Test and Prod workspaces, that's the next video."

[ON SCREEN: end screen → c1 CI/CD video]

## Chapters
```
0:00 Three ways to run dbt on Fabric
0:30 What dbt adds over notebooks
1:45 dbt Job vs dbt Core vs notebook
2:45 The sample project
4:15 Option A: Fabric dbt Job (setup, pipeline, Variable Library)
8:15 Option B: dbt Core + dbt-fabric + GitHub Actions
11:15 Which one should you pick?
13:00 Production checklist
```

## Description + tags
dbt on Microsoft Fabric in production: Fabric's dbt Job vs dbt Core with the dbt-fabric adapter, set up side by side on a Fabric Warehouse.
Includes profiles.yml for CLI and service principal auth, a GitHub Actions workflow, the pipeline dbt activity, and a decision table.

Sample project: [link] · Chapters below.

Tags: dbt fabric, dbt microsoft fabric, fabric dbt job, dbt-fabric adapter, dbt core, fabric warehouse dbt, dbt lakehouse fabric, microsoft fabric tutorial, analytics engineering, data build tool

## Shorts
**Short 1: "What dbt adds over a notebook" (40s)**
"You already transform data in a Fabric notebook. Why dbt? [TEXT: 4 things] One, a dependency graph: write ref, and dbt figures out run order. Two, tests in one line of YAML: not null, unique. Three, docs and lineage for free. Four, everything is SQL in Git. What it doesn't do? [TEXT: NOT faster] Make your queries faster. It organizes; it doesn't accelerate. Under ten transforms and one person? A notebook's fine."

**Short 2: "dbt Job or dbt Core on Fabric?" (40s)**
"dbt on Fabric. Two real options. [TEXT: dbt Job] Fabric's dbt Job: no infra, runs on your capacity, plugs into pipelines. [TEXT: dbt Core] dbt Core from GitHub Actions: local runs, PR checks, service principal today. My rule: [TEXT: Fabric-first → Job · VS Code-first → Core] Fabric-first team, use the Job. VS Code-first team, use Core. And pick one. Write it in the README."

## LinkedIn post
dbt on Microsoft Fabric has three paths, and that's the problem.

1. Fabric dbt Job (GA): no infra, pipeline activity, Variable Library CI/CD.
2. dbt Core + dbt-fabric from GitHub Actions: local dev, PR checks, service principal auth.
3. dbt inside a notebook: works, but you build the scheduler yourself.

My take after setting up both:
→ Fabric-first team, no VS Code habit: start with the dbt Job.
→ Code-first team (ex-Databricks/Snowflake): dbt Core + Actions.
→ Already running dbt Core and it works: don't migrate.

The real risk isn't picking the "wrong" one. It's a team running two of them.

Which are you running in production?

[Diagram: Silver Lakehouse → (dbt Job | dbt Core) → Gold Warehouse → Direct Lake model]

---

## Blog version (~800 words)

# dbt on Microsoft Fabric in Production: dbt Job vs dbt Core (2026)

If you search "dbt on Fabric" you'll find several answers, and that's the first problem. In 2026 there are two production-grade ways to run dbt against Microsoft Fabric, plus one workaround. Here's how they compare and how to set up each.

## Why use dbt on Fabric at all?
If you already transform silver to gold in a Spark SQL notebook, dbt adds four things:
- **A dependency graph.** `ref()` replaces hard-coded table names, and dbt works out run order.
- **Tests that run every build.** `not_null`, `unique`, `accepted_values` and `relationships`, one line of YAML each.
- **Docs and lineage** generated from your code.
- **Everything as SQL files in Git,** reviewable in pull requests.

It doesn't make queries faster. With fewer than about ten transformations and one engineer, a notebook is fine.

## Option 1: Fabric dbt Job
The dbt Job is a Fabric item that hosts dbt Core for you. Microsoft announced general availability in October 2026 (verify current status).
- **Setup:** a tenant admin enables dbt job items. Create a dbt Job in the workspace, import your project from GitHub, and pick a Warehouse (or Lakehouse) as the target. Fabric builds the profile for you.
- **Commands:** build, run, test, seed, snapshot, compile and docs generate, with selectors.
- **Orchestration:** a native dbt activity in pipelines, so ingest → dbt build → semantic model refresh lives in one pipeline.
- **Deployment:** use a Variable Library so the same job targets different warehouses in Dev and Prod.
- **Logs:** model results, compiled SQL and lineage are saved to OneLake.

**Watch-outs:**
- It uses your Fabric capacity.
- Service principal and workspace identity support were still roadmap items when this was written.
- Editing happens mostly in the Fabric UI.

## Option 2: dbt Core + dbt-fabric (or dbt-fabricspark)
Run dbt Core yourself: locally for development, from GitHub Actions or Azure DevOps for production.
- **Adapter:** `dbt-fabric` targets the Warehouse. Since v1.10.1 it uses Microsoft's `mssql-python` driver (no ODBC install) and requires Python 3.12+.
- **Lakehouse:** use `dbt-fabricspark`, which runs through Spark/Livy.
- **Auth:** `CLI` for development (`az login`), `ServicePrincipal` for production.

A minimal profiles.yml:
```yaml
fabric_dbt:
  target: dev
  outputs:
    dev:
      type: fabric
      server: "{{ env_var('FABRIC_SQL_ENDPOINT') }}"
      port: 1433
      database: wh_gold_dev
      schema: dbo
      authentication: CLI
      threads: 4
    prod:
      type: fabric
      server: "{{ env_var('FABRIC_SQL_ENDPOINT') }}"
      port: 1433
      database: wh_gold
      schema: dbo
      authentication: ServicePrincipal
      tenant_id: "{{ env_var('AZURE_TENANT_ID') }}"
      client_id: "{{ env_var('AZURE_CLIENT_ID') }}"
      client_secret: "{{ env_var('AZURE_CLIENT_SECRET') }}"
      threads: 8
```
Then schedule `dbt build --target prod` in GitHub Actions, with secrets in the repository's environment settings.

**Gotchas:**
- Python models aren't supported on the Warehouse.
- Older adapter versions could truncate strings at varchar(8000), so upgrade.

## Option 3: dbt inside a notebook
`pip install dbt-fabric` in a notebook and run it there. It works, but you end up building your own logging, retries and scheduling. Most teams that start here move to option 1 or 2.

## Which should you choose?
| Situation | Choice |
|---|---|
| Small, Fabric-first team, wants zero infrastructure | dbt Job |
| One pipeline for ingest → transform → refresh | dbt Job (native activity) |
| VS Code-first team, PR checks, local runs | dbt Core + CI |
| Must run as a service principal now | dbt Core |
| Already running dbt Core successfully | Stay where you are |

Whichever you pick, document it. The most common complaint about dbt on Fabric isn't dbt; it's teams running several patterns at once.

## Production checklist
1. Test every mart's primary key (`not_null`, `unique`).
2. Use `dbt build`, not `dbt run`, so failing tests stop downstream models.
3. Add source freshness checks before runs.
4. Alert on failure (pipeline alerts or CI notifications).
5. Watch CU usage in the Capacity Metrics app during the first week.

*Feature status reflects community and Microsoft posts through November 2026; confirm in Microsoft Learn before you build.*
