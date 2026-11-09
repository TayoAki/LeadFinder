# Community C2: Develop Fabric Notebooks in VS Code, the 2026 Setup

## Evidence: why this piece exists
**Scale of the theme:**
- **Reddit:** "Notebooks dev experience (VS Code, local, modularity)" is the #4 theme by comment volume: 50 threads, ~1,560 comments.
- **Stack Overflow:** 22 questions with ~41.6K views, the most-viewed theme there. Top questions: writing a polars DataFrame to a Lakehouse Delta table (9.8K views), loading from a non-default lakehouse (9.2K), notebook-to-Warehouse writes (8.5K + 7.7K), `mssparkutils.notebook.exit` with multiple values (2.3K).

**Key Reddit threads:**
- **"Why is code reuse/modularity still a mess in Fabric notebooks?"** (54 comments). Libraries mean slow Environment publishes and session starts; `%run` hides dependencies; "why can't we just import notebooks as .py files?"
- **"What's the point of the VS Code thing for Notebooks?"** (52 comments). VS Code (web) seemed to have fewer features; polars imports failed there.
- **"We built a full local dev environment for Microsoft Fabric notebooks"** (49 comments). The motivations: no debugging, no breakpoints, burning capacity on every test run.
- **"What does a serious VS Code setup for Microsoft Fabric look like? Core tools vs optional tools?"** (39 comments, 59 upvotes).
- **"Feature Request: Python Job"** (38 comments). Wants to run packaged, unit-tested Python outside notebooks.
- **"Local development in MS Fabric (sucks)"** (24); **"Which VSCode Extension?"** (20 comments, 60 upvotes); **"Developing Fabric Notebooks in VS Code - What's the current best setup?"** (19); **"Notebook development outside of Fabric portal"** (14; wants Claude Code).
- **"My AI setup for Fabric development: AGENTS.md, Microsoft Learn MCP and the Fabric CLI"** (15 comments).
- **Pure Python notebooks:**
  - "How do single node Python users actually write Delta tables using DuckDB…" (62 comments).
  - "How far Python alone can take you on Delta" (40).
  - "Fabric Performance Benchmarking - Spark versus Python Notebooks" (37).
  - "Pure Python notebook is finally with 3.12" (65 upvotes).
- **Product updates:**
  - "Some recent major experience update from Data Engineering VS Code extension" (58 upvotes): VFS mode, the FabricNotebook custom agent, setting the default lakehouse/Environment in VS Code.
  - "The Fabric Data Engineering VS Code ext now integrate the Codex/Claude Code VS Code ext."
  - Fabric CLI v1.5, which added `fab deploy`.

**Forum threads:**
- "Read Notebook cell string from another notebook"
- "Variable Library Support in Notebook (GA)"
- "Starting Session takes really slow"
- "Does the 2 VCores = 1 CU conversion also hold for Python…"
- "Copilot not working in notebooks"

**The gap:** the ask is "which tools, in what order, and how do I structure code so it's reusable and testable?"

---

# Wk C2: Develop Fabric Notebooks in VS Code: The Complete 2026 Setup
- **Runtime target:** 14–15 min.
- **Pillar:** Community ask (developer experience). Supports pillar 4.
- **Target keywords:** "fabric notebook vs code", "fabric vs code extension", "fabric cli", "fabric notebook library", "fabric python notebook", "spark notebook" (210/mo, 1.12×), "fabric notebook" (260/mo, 1.15×), "pyspark" (8.1K/mo, a feeder audience).
- **Title options:**
  1. Fabric Notebooks in VS Code: The Complete 2026 Setup (Step by Step)
  2. Stop Writing Fabric Code in the Browser: My VS Code + AI Setup
  3. Fabric Notebook Code Reuse, Finally Solved: %run vs notebook.run vs Libraries
- **Thumbnail:** "LEAVE THE BROWSER", with the VS Code logo → Fabric logo and a crossed-out browser tab.
- **Verify before recording:**
  - Extension names and IDs:
    - "Fabric Data Engineering VS Code" (marketplace ID `SynapseVSCode.synapse`, per the community post).
    - The separate "Microsoft Fabric" extension.
    - Which one the docs recommend for which task.
  - VFS (virtual file system) mode, the FabricNotebook custom agent for Copilot, and integration with the Claude Code/Codex extensions (community 2026): GA or preview?
  - Fabric CLI:
    - Package name (`ms-fabric-cli`), command syntax (`fab auth login`, `fab ls`, `fab job run`, `fab import/export`).
    - Whether `fab deploy` exists (community: v1.5 added it).
  - Pure Python notebook runtime: Python 3.12, bundled DuckDB version (community: 1.4.4), deltalake/polars availability.
  - The `notebookutils` API names: `notebook.run`, `notebook.runMultiple`, `notebook.exit`, `credentials.getToken`, `variableLibrary.getLibrary`. Also the built-in resources folder path (`builtin/`) and whether `.py` files in it can be imported directly.
  - Environment custom library publish times; whether a "Python job" item type exists yet (a community feature request in 2026).
  - The Microsoft Learn MCP server endpoint URL.

## Hook (0:00–0:30)
"If you write Fabric notebooks in the browser, you've hit all of these: no breakpoints, copy-pasted helper functions in ten notebooks, a two-minute session start just to test one line, and every test run burning capacity. Here's the setup I use instead. VS Code, two tools, one way to share code that actually works, and an AI assistant that knows your project. By the end you'll have it installed, and you'll know exactly when to use Spark and when plain Python is cheaper."

## Script

### 0:30 – The setup at a glance
[ON SCREEN: stack diagram, top to bottom: "AI assistant + AGENTS.md + Learn MCP" / "VS Code + Fabric Data Engineering extension" / "Fabric CLI" / "Local Python: pytest, polars, duckdb, deltalake" / "Your code as a package (.whl) → Fabric Environment".]

"Here's the stack, bottom to top.

First, your logic lives in a normal Python package, with unit tests you run on your laptop for free.

Second, the Fabric Data Engineering extension for VS Code lets you open and run your actual Fabric notebooks from VS Code, on Fabric compute.

Third, the Fabric CLI scripts everything else: creating items, running jobs, deploying.

On top, an AI assistant that reads a project file, so it knows your conventions, and checks the official docs instead of guessing.

There are two VS Code extensions with Fabric in the name, and that confuses everyone. The 'Microsoft Fabric' extension is for browsing workspaces and items. The 'Fabric Data Engineering' extension is the one for notebooks, Spark jobs and lakehouses. For this video you want the Data Engineering one. Install both if you like; they don't conflict."

### 2:00 – Install and connect
[DEMO: VS Code → Extensions → search "Fabric Data Engineering" → Install → Fabric icon in the sidebar → Sign in → select workspace.]

"Install the extension and sign in with your Fabric account. Pick a workspace and you'll see your notebooks, lakehouses and Environments in the sidebar.

Open a notebook. With the newer virtual file system mode, you edit the notebook in place: no download and upload, and saves sync back to the workspace. You can also set the notebook's default lakehouse and Environment right here.

When you run a cell, choose the Fabric kernel. The code runs on Fabric Spark, not your laptop. That's important: VS Code is your editor here, not your compute. If a library works in the portal but not in VS Code, check you're on the Fabric kernel and the same Environment. That's the polars problem people hit."

### 3:30 – The Fabric CLI
[DEMO: terminal]

```bash
pip install ms-fabric-cli
fab auth login
fab ls                                           # list workspaces
fab ls "Sales-DEV.Workspace"                     # list items in a workspace
fab job run "Sales-DEV.Workspace/nb_silver_transform.Notebook"
fab export "Sales-DEV.Workspace/nb_silver_transform.Notebook" -o ./exports
```

"The CLI treats Fabric like a file system. Workspaces and items are paths. You can list, create, export and run jobs from a terminal, which means you can script them, and an AI assistant can run them too. Recent versions added deployment commands as well. I still use fabric-cicd for promotions, which is in my CI/CD video, but the CLI is perfect for day-to-day work."

### 4:30 – The real problem: code reuse
[ON SCREEN: three options table]

| Option | How | Shares variables? | Good for |
|---|---|---|---|
| `%run nb_utils` | Inline another notebook | Yes, same session | Quick shared helpers |
| `notebookutils.notebook.run()` | Run as a child | No; returns an exit value | Orchestration, parameters |
| Wheel in an Environment | `import mylib` | N/A, a real package | Tested, versioned logic |

"Now the thread with 54 comments: why is code reuse such a mess? There are three options, and each has one job.

`%run` pulls another notebook into your session. Its functions and variables become yours. It's fast for small helpers, but there's no dependency graph and no tests.

`notebookutils.notebook.run` runs another notebook as a separate child, with parameters and a timeout, and hands back whatever the child passes to `exit`. That's for orchestration, not for sharing functions."

```python
# parent notebook
result = notebookutils.notebook.run("nb_load_customers", 900, {"load_date": "2026-11-01"})
print(result)   # whatever the child passed to notebookutils.notebook.exit(...)

# child notebook, last cell
import json
notebookutils.notebook.exit(json.dumps({"rows": 1532, "status": "ok"}))
```

"Notice I return JSON. `exit` returns a single string, so if you need several values, serialize them. That's a top Stack Overflow question.

And for many children, `runMultiple` takes a list or a small DAG and runs them in parallel."

```python
dag = {
    "activities": [
        {"name": "customers", "path": "nb_load_customers", "args": {"load_date": "2026-11-01"}},
        {"name": "orders",    "path": "nb_load_orders",    "args": {"load_date": "2026-11-01"}},
        {"name": "gold",      "path": "nb_build_gold",     "dependencies": ["customers", "orders"]},
    ]
}
notebookutils.notebook.runMultiple(dag)
```

"The third option, and the one I recommend for anything you'd copy twice, is a real Python package."

### 6:30 – Build the package
[DEMO: VS Code, local folder]

```
fabric_utils/
├─ pyproject.toml
├─ src/fabric_utils/
│  ├─ __init__.py
│  └─ cleaning.py
└─ tests/test_cleaning.py
```

```python
# src/fabric_utils/cleaning.py
import polars as pl

def standardise_customers(df: pl.DataFrame) -> pl.DataFrame:
    return (
        df.with_columns(
            pl.col("email").str.to_lowercase().str.strip_chars(),
            pl.col("country").fill_null("UNKNOWN"),
        )
        .unique(subset=["customer_id"], keep="last")
    )
```

```python
# tests/test_cleaning.py
import polars as pl
from fabric_utils.cleaning import standardise_customers

def test_dedupes_and_lowercases():
    df = pl.DataFrame({
        "customer_id": [1, 1, 2],
        "email": [" A@X.COM", "a@x.com", "b@y.com"],
        "country": ["US", "US", None],
    })
    out = standardise_customers(df)
    assert out.height == 2
    assert out.filter(pl.col("customer_id") == 1)["email"][0] == "a@x.com"
    assert out.filter(pl.col("customer_id") == 2)["country"][0] == "UNKNOWN"
```

```toml
# pyproject.toml
[project]
name = "fabric_utils"
version = "0.1.0"
dependencies = ["polars"]

[build-system]
requires = ["setuptools>=68", "wheel"]
build-backend = "setuptools.build_meta"
```

```bash
pip install -e . pytest && pytest -q        # free, on your laptop
python -m pip wheel . -w dist --no-deps     # builds dist/fabric_utils-0.1.0-py3-none-any.whl
```

"Tests run in a second on your laptop and cost nothing in capacity. That alone answers the 'burning capacity for every test run' complaint.

Then upload the wheel to an Environment, under Custom libraries, publish, and attach the Environment to your notebooks. Now it's `from fabric_utils.cleaning import standardise_customers`, the same everywhere.

The honest trade-off: publishing an Environment takes minutes, and custom libraries can slow session start. So I iterate locally, and only publish when a version is done. For quick experiments in between, put a `.py` file in the notebook's built-in resources folder and import it there. Then promote it to the package when it's stable."

### 9:00 – Spark or pure Python?
[ON SCREEN: decision line: "< a few GB per run → Python notebook · bigger, or many joins → Spark"]

"Before writing code, pick the engine. Fabric has two notebook types. Spark notebooks start a cluster, which is great for big data and overkill for a 50-megabyte API pull. Python notebooks run on a single node. They now run Python 3.12 with DuckDB and polars available, start fast, and use far less capacity.

My rule: if a run handles a few gigabytes or less, start with a Python notebook. Move to Spark when data or joins outgrow one machine. Benchmark both on your own workload, because the community benchmarks vary a lot.

The question everyone asks: DuckDB can't write Delta tables, so how do you save results? You hand the result to the `deltalake` library as Arrow:"

```python
import duckdb
from deltalake import write_deltalake

ws_id = notebookutils.runtime.context["currentWorkspaceId"]
lh_id = "<your-lakehouse-id>"   # or read it from a Variable Library
base = f"abfss://{ws_id}@onelake.dfs.fabric.microsoft.com/{lh_id}"
token = notebookutils.credentials.getToken("storage")
storage = {"bearer_token": token, "use_fabric_endpoint": "true"}

con = duckdb.connect()
result = con.sql("""
    SELECT customer_id, sum(amount) AS revenue
    FROM read_parquet('/lakehouse/default/Files/raw/orders/*.parquet')
    GROUP BY customer_id
""").arrow()

write_deltalake(f"{base}/Tables/customer_revenue", result, mode="overwrite", storage_options=storage)
```

"Query with DuckDB, convert to Arrow, and write with deltalake. The table appears in your lakehouse like any other. One more thing: after writes like this, check the SQL analytics endpoint has caught up before a report reads it. I cover that in its own video."

### 11:00 – The AI layer: AGENTS.md, Learn MCP, CLI
[DEMO: repo root → `AGENTS.md`]

```markdown
# AGENTS.md: Fabric project rules
## Architecture
- Medallion: lh_bronze (raw, append-only) → lh_silver (cleaned, Delta) → lh_gold (star schema).
- Notebooks: nb_<layer>_<entity> e.g. nb_silver_customers. Pipelines: pl_<purpose>.
## Code rules
- Shared logic lives in src/fabric_utils, with a pytest for every function. No copy-pasted helpers.
- Default to Python notebooks (polars/duckdb); Spark only for > few GB or wide joins.
- Read config with notebookutils.variableLibrary.getLibrary("vl_config"). Never hard-code IDs.
## Guardrails
- Never run anything against the PROD workspace. Use Sales-DEV.Workspace only.
- Check Microsoft Learn (via the MCP server) before using any Fabric API or notebookutils call.
```

"AI assistants are useful in Fabric once they stop starting from zero every session. Three pieces do that.

An `AGENTS.md` in the repo root holds your architecture, naming rules and guardrails. Most coding assistants read it automatically.

The Microsoft Learn MCP server lets the assistant look up current Fabric docs instead of inventing API calls, which matters on a product that ships monthly.

And the Fabric CLI lets the assistant act. It can create a lakehouse, run a notebook or export an item, inside the guardrails you wrote.

The Data Engineering extension also now includes a Fabric notebook agent for Copilot, and it works alongside other assistants like Claude Code. Check which is GA in your tenant.

The most important line is the guardrail. Give the assistant DEV only."

### 12:45 – My recommended order, and recap
[ON SCREEN: checklist]
1. Install Fabric Data Engineering extension → open notebooks in VS Code (VFS mode).
2. Install the Fabric CLI → `fab auth login`.
3. Move shared code into a package with tests → wheel → Environment.
4. Use `%run` for tiny helpers, `notebook.run`/`runMultiple` for orchestration.
5. Default to Python notebooks; Spark when data outgrows one node.
6. Add AGENTS.md + Learn MCP, DEV-only guardrails.

"If you do just one thing this week, do number three. Moving shared logic into a tested package fixes more of the pain in those Reddit threads than any tool.

Code and templates are linked below. Next up: CI/CD, so this code gets to production the same way every time."

## Chapters
```
0:00 Why the browser hurts
0:30 The setup at a glance
2:00 Install + connect VS Code
3:30 The Fabric CLI
4:30 Code reuse: %run vs notebook.run vs libraries
6:30 Build a tested package (wheel → Environment)
9:00 Spark or pure Python? (+ DuckDB → Delta)
11:00 AI: AGENTS.md, Learn MCP, CLI
12:45 Recommended order + recap
```

## Description + tags
How to develop Microsoft Fabric notebooks in VS Code in 2026: the Fabric Data Engineering extension, Fabric CLI, reusable code with wheel packages and Environments, %run vs notebookutils.notebook.run, and when to use Python notebooks instead of Spark. Plus an AI setup with AGENTS.md and the Microsoft Learn MCP server.

Code: [link].

Tags: fabric notebook vs code, microsoft fabric vs code extension, fabric cli, fabric notebook library, fabric python notebook, notebookutils, fabric environment custom library, duckdb delta lake fabric, pyspark fabric, microsoft fabric tutorial

## Shorts cutdowns

**Short 1: "%run vs notebook.run" (40s)**
[ON SCREEN TEXT: "%run ≠ notebook.run"]
"Two ways to call one Fabric notebook from another, and they're not the same. `%run` pastes the other notebook into your session, so you get its functions and variables. `notebookutils.notebook.run` runs it as a separate child with parameters and gives you back one string. Sharing helpers? `%run`. Orchestrating steps? `notebook.run`, and return JSON if you need more than one value. Copying code a third time? Make it a package."
[ON SCREEN TEXT: "Helpers → %run · Orchestration → notebook.run · Reused 3× → package"]

**Short 2: "DuckDB can't write Delta. Do this." (35s)**
[ON SCREEN TEXT: "DuckDB → Delta in Fabric"]
"DuckDB can't write Delta tables, so how do Python notebooks save to a Fabric lakehouse? Query in DuckDB, call `.arrow()`, then `write_deltalake` from the deltalake library, with a storage token from notebookutils. Three lines, a single node, and a fraction of the capacity a Spark session would use for small data."
[ON SCREEN TEXT: "duckdb → .arrow() → write_deltalake()"]

## LinkedIn post
**The highest-leverage change to a Fabric dev setup isn't a tool. It's a package.**

```
copy-pasted helpers in 10 notebooks   ✗
        ↓
src/fabric_utils + pytest (laptop, free)
        ↓ wheel
Fabric Environment → import everywhere ✓
```

The most-discussed Fabric notebook complaint I see is code reuse. People reach for `%run` and end up with invisible dependencies and capacity burned on every test.

My setup:
- Logic lives in a tested Python package.
- VS Code with the Fabric Data Engineering extension is the editor.
- The Fabric CLI handles scripting.
- An AGENTS.md file holds the conventions, so any AI assistant follows them.
- Python notebooks are the default; Spark is for when data outgrows one node.

How are you sharing code across notebooks?

---

## Blog version (~800 words)

# How to Develop Microsoft Fabric Notebooks in VS Code (2026 Setup)

Writing Fabric notebooks in the browser works until it doesn't: no breakpoints, helper functions copy-pasted across notebooks, slow session starts and capacity burned on every test run. These are some of the most discussed complaints in the Fabric community. This guide covers the setup that fixes most of them.

## Which Fabric VS Code extension should you install?
There are two extensions with "Fabric" in the name.
- **Fabric Data Engineering** is for notebooks, Spark job definitions, lakehouses and Environments. This is the one for notebook development.
- **Microsoft Fabric** is for browsing workspaces and items.

After signing in, open a notebook in VS Code. In the newer virtual file system mode, edits sync back to the workspace without download or upload. You can set the default lakehouse and Environment from VS Code. Run cells on the **Fabric kernel**: VS Code is the editor, Fabric is the compute. If a library works in the portal but not in VS Code, check the kernel and the Environment first.

## The Fabric CLI for scripting
Install it with `pip install ms-fabric-cli` and sign in with `fab auth login`. The CLI treats workspaces and items as paths. You can list (`fab ls`), export and run jobs (`fab job run "Sales-DEV.Workspace/nb_silver.Notebook"`) from a terminal, so routine tasks become scripts, and AI assistants can perform them too.

## Code reuse in Fabric notebooks: %run vs notebook.run vs libraries
- **`%run`** inlines another notebook into the current session. It's good for small shared helpers, but there's no dependency graph and no tests.
- **`notebookutils.notebook.run(path, timeout, params)`** runs a child notebook separately and returns one string from `notebookutils.notebook.exit()`. Return JSON for multiple values. Use **`runMultiple`** with a small DAG to run children in parallel. This is orchestration, not code sharing.
- **A wheel package in an Environment.** Put shared logic in `src/your_package`, test it with pytest locally, build a wheel, upload it to an Environment's custom libraries and attach the Environment. Every notebook then uses a normal `import`.

The trade-off is that Environment publishing takes minutes and custom libraries can slow session start. So iterate locally, and publish versions, not every edit. For quick experiments, a `.py` file in the notebook's built-in resources folder works as a stopgap.

## Test locally to stop burning capacity
Write transformations as pure functions over polars or pandas DataFrames, and test them with small inline datasets:

```python
def test_dedupes_and_lowercases():
    df = pl.DataFrame({"customer_id": [1, 1], "email": [" A@X.COM", "a@x.com"], "country": ["US", "US"]})
    assert standardise_customers(df).height == 1
```

Unit tests run in seconds on a laptop and use no Fabric capacity. Run integration tests in a DEV workspace only.

## Python notebooks vs Spark notebooks in Fabric
Fabric's pure **Python notebooks** run on a single node with Python 3.12, DuckDB and polars, and they start much faster and use less capacity than Spark for small and medium data. A practical rule:
- Use Python notebooks for runs of a few gigabytes or less.
- Use Spark when data or joins outgrow one machine.
- Benchmark on your own workload.

**Writing Delta from DuckDB:** DuckDB doesn't write Delta tables, so convert the result to Arrow and use the `deltalake` library:

```python
result = duckdb.sql("SELECT customer_id, sum(amount) AS revenue FROM read_parquet('/lakehouse/default/Files/raw/orders/*.parquet') GROUP BY 1").arrow()
write_deltalake(f"{base}/Tables/customer_revenue", result, mode="overwrite",
                storage_options={"bearer_token": notebookutils.credentials.getToken("storage"), "use_fabric_endpoint": "true"})
```

## AI-assisted Fabric development: AGENTS.md and the Learn MCP server
- An **AGENTS.md** file in the repo holds your architecture, naming conventions and guardrails, so assistants don't start from zero every session.
- The **Microsoft Learn MCP server** lets assistants check current Fabric documentation before writing API calls.
- The **Fabric CLI** lets them act.
- Always add the guardrail "DEV workspace only".
- The Data Engineering extension also ships a Fabric notebook agent for Copilot. Check its availability in your tenant.

## Recommended setup order
1. Install the Fabric Data Engineering extension and open notebooks in VS Code.
2. Install the Fabric CLI.
3. Move shared code into a tested package, then a wheel, then an Environment.
4. Use `%run` for tiny helpers and `notebook.run`/`runMultiple` for orchestration.
5. Default to Python notebooks; switch to Spark when needed.
6. Add AGENTS.md and the Learn MCP server, with DEV-only guardrails.

Step 3 fixes more day-to-day pain than any tool. Start there.
