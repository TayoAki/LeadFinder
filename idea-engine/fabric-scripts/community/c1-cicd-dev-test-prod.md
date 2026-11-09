# Community C1: Fabric CI/CD: Dev, Test and Prod, the Simple Real-World Setup

## Evidence: why this piece exists
From r/MicrosoftFabric (Nov 2025 – Nov 2026), the Fabric Community forum (Google-indexed threads from the last 12 months) and Stack Overflow (tag `microsoft-fabric`).

**Scale of the theme:**
- **Reddit:** 44 threads, ~940 comments.
- **Forum:** 30 threads.
- **Stack Overflow:** 8 questions, ~4.4K views.
- **Rank:** CI/CD is the #9 theme by comment volume. It has the most "how do I set this up" questions that aren't about cost or certification.

**Key Reddit threads:**
- **"How do you manage Dev, Test, and Prod environments with Microsoft Fabric Git integration?"** (37 comments).
  - The poster comes from Databricks Asset Bundles and asks for "the Fabric equivalent" of Dev/Test/Prod targets.
  - Asks where environment-specific values and connections live.
  - Asks for "a simple real-world setup".
- **"Getting the Entire Picture of CI/CD in Microsoft Fabric"** (41 comments). Two workspaces (cost), Azure DevOps instead of deployment pipelines, and a list of open decisions.
- **"Experienced data engineers: how are you actually deploying Fabric in centrally managed environments?"** (21 comments). Python CI/CD against the Fabric APIs; some API behavior feels unreliable.
- **"Fabric + GitHub CI/CD architecture for Git-inexperienced team"** (16) and **"Solo Data Engineer… Git strategy for core Medallion vs ~25 business workspaces"** (13).
- **"Fabric CI/CD Assistant: I built a tool to map Workspace IDs, Connection GUIDs, and Object Ownership"** (18 comments, 47 upvotes). The GUID-mapping pain is real.
- **fabric-cicd release threads:**
  - "Big news: fabric-cicd officially Microsoft supported" (114 upvotes).
  - v1.0.0 with breaking changes (62 upvotes); v1.2.0 bulk publish; v1.4.0.
- **"Service Principals are now Supported in Variable Libraries!"** (51 upvotes). Variable Library support in notebooks is GA.

**Forum threads:**
- "Deployment Pipeline does not rebind Direct Lake…"
- "Direct Lake semantic model still points to the DEV Lakehouse…"
- "Shortcuts not supported by deployment pipelines?"
- "Lakehouse deploys but ADLS Gen2 Shortcut fails"
- "Fabric Deployment Pipeline: Set Variable Library Active Value…"
- "Let Semantic Models use Variable Libraries"
- "CI/CD support for Fabric Environments in Deployment Pipelines"

**The gap:** people don't lack docs. They lack one opinionated, end-to-end picture that says what goes where.

---

# Wk C1: Fabric CI/CD Explained: Dev, Test and Prod (The Simple Setup That Works)
- **Runtime target:** 14–15 min.
- **Pillar:** Community ask (CI/CD). Bridges to pillar 4 (code-alongs).
- **Target keywords:**
  - "fabric ci/cd", "fabric deployment pipelines" (110/mo, 1.02×), "fabric git integration" (40/mo).
  - "fabric-cicd", "fabric dev test prod".
  - Google volume is small, but Reddit and forum demand is high. This video gets found through YouTube search and community links, not Google.
- **Title options:**
  1. Fabric CI/CD Explained: Dev, Test and Prod in 15 Minutes (2026)
  2. The ONLY Microsoft Fabric CI/CD Setup You Need (Git + fabric-cicd)
  3. Deployment Pipelines vs fabric-cicd: Which One Should You Use?
- **Thumbnail:** "DEV → TEST → PROD", with three workspace tiles and a Git logo; a red "✗" over a tangled arrow on the left.
- **Verify before recording:**
  - fabric-cicd's current version, and that it's still "officially Microsoft supported" (community post). Check the v1.x breaking changes (explicit `token_credential`, keyword-only args) against the current docs.
  - fabric-cicd's current list of supported item types (Notebook, DataPipeline, Environment, Lakehouse, SemanticModel, Report, VariableLibrary, Warehouse, etc.).
  - `parameter.yml` syntax (`find_replace`, `key_value_replace`, dynamic `$items.<type>.<name>.$id` references) against the current docs.
  - Which items Fabric Git integration supports today, and which are still preview or unsupported.
  - Deployment pipelines:
    - Whether they now rebind Direct Lake semantic models automatically.
    - Whether they support shortcuts and Environments.
    - Forum threads in 2026 said they didn't.
  - Variable libraries:
    - Service principal support (community, 2026).
    - Notebook support (GA per the blog cited on Reddit).
    - Whether semantic models can consume them yet (a forum feature request).
  - The `notebookutils.variableLibrary` method names.
  - Git providers: Azure DevOps and GitHub, plus GitHub Enterprise Cloud with data residency (ghe.com, community 2026).
  - Lakehouse data and schedules:
    - Lakehouse table data never moves with Git or deployment. Only item definitions do.
    - Whether pipeline schedules now travel with the item. There's a fabric-cicd "Schedules param replacement" PSA (Nov 2026).
  - Warehouse CI/CD: the DacFx/SQL project changes (community, 2026).

## Hook (0:00–0:30)
"Every week someone asks the same question: how do I do Dev, Test and Prod in Microsoft Fabric? Databricks has bundles. What's Fabric's answer? Here it is, in one diagram. Three workspaces, one Git repo, one deploy script and one config file for the values that change per environment. By the end of this video you'll know exactly where each piece lives, which tool to use to promote changes, and the three things that still don't deploy cleanly, so they don't surprise you in production."

## Script

### 0:30 – The one-diagram answer
[ON SCREEN: diagram. Feature workspaces → Git `main` → DEV workspace. Pipeline → TEST workspace → approval → PROD workspace. A small box labelled "parameter.yml + Variable Library".]

"Here's the whole setup. I'll walk through it once, then build it.

There is one workspace per environment: DEV, TEST and PROD. Workspaces are your environments. That's the Fabric equivalent of a bundle target.

Only one of them is connected to Git, and that's DEV. TEST and PROD are never edited by hand. They only receive deployments.

Developers don't work in DEV directly either. Each person branches out to their own feature workspace, makes changes and opens a pull request into `main`.

When `main` changes, DEV syncs, and a pipeline deploys the same item definitions to TEST. After an approval, it deploys them to PROD.

The values that differ per environment, like lakehouse IDs, connection IDs and server names, live in two places. One is a parameter file the deploy tool reads. The other is a Variable Library that your notebooks and pipelines read at run time.

That's it. Everything else is detail."

### 2:00 – Why workspaces are environments
[ON SCREEN: three workspace cards with capacity labels. DEV on F2/trial; TEST and PROD on the production capacity.]

"Why three workspaces and not three folders? In Fabric, almost everything is scoped to a workspace: permissions, capacity assignment, Spark settings, Git connection and item IDs. Separate workspaces give you separate permissions and a separate blast radius.

On a tight budget, two workspaces, DEV and PROD, is a valid start. Plenty of teams do that. Add TEST when someone other than the developer needs to sign off.

One tip. Put DEV on a smaller capacity than PROD, so a runaway dev notebook can't throttle your production reports."

### 3:00 – Connect DEV to Git
[DEMO: Workspace settings → Git integration → choose Azure DevOps or GitHub → organization, repo, branch `main`, Git folder `/workspace` → Connect and sync.]

"In the DEV workspace, open Workspace settings, then Git integration. Pick your provider: Azure DevOps or GitHub both work. Choose the repo, the branch, which is `main`, and a folder. I use `/workspace` so the repo can also hold the deploy scripts and the parameter file next to it.

Connect, and Fabric writes every supported item into the repo as plain files. A notebook becomes a folder with a `.py` file in it. A semantic model becomes TMDL files. A pipeline becomes JSON. You can review all of it in a pull request."

[ON SCREEN: repo tree]
```
repo/
├─ workspace/
│  ├─ nb_bronze_ingest.Notebook/
│  ├─ nb_silver_transform.Notebook/
│  ├─ pl_daily_load.DataPipeline/
│  ├─ lh_sales.Lakehouse/
│  ├─ vl_config.VariableLibrary/
│  ├─ sm_sales.SemanticModel/
│  └─ rpt_sales.Report/
├─ parameter.yml
└─ deploy/deploy.py
```

"One thing Git does not hold is data. A lakehouse in Git is the empty shell: its definition, not its tables. Your tables get created in each environment by running your notebooks or pipelines there. Keep that in mind; it's the first surprise people hit."

### 4:30 – Branching: feature workspaces
[DEMO: Source control panel → Branch out to new workspace → name `feat-add-customer-dim` → creates workspace and branch.]

"Now, how do two people work without overwriting each other? Branch out. From the Source control panel, choose Branch out to new workspace. Fabric creates a new branch and a new workspace connected to it. You build and test there, commit, and open a pull request into `main` in DevOps or GitHub.

Merge the PR, and the DEV workspace shows 'updates available'. Update it, or automate that with the Git APIs.

Keep the branching simple: short-lived feature branches into `main`. You don't need a release branch per environment. The environments are workspaces, not branches.

If most of your contributors are business users who build in the UI, like in the 'solo data engineer with 25 business workspaces' thread on Reddit, don't force Git on everyone. Put your core medallion workspaces under Git and CI/CD. Let report-only workspaces use deployment pipelines."

### 6:00 – Promote: deployment pipelines vs fabric-cicd
[ON SCREEN: two-column table]

| | Deployment pipelines | fabric-cicd (Python) |
|---|---|---|
| Where it runs | Fabric UI | Your CI (Azure DevOps, GitHub Actions) |
| Setup | Minutes | An hour |
| Per-environment values | Deployment rules | `parameter.yml` |
| Approvals, audit | Basic | Your CI's approvals |
| Best for | Report teams, small setups | Engineering teams, many workspaces |

"There are two ways to move items from DEV to TEST to PROD.

**Deployment pipelines** are built into Fabric. You assign DEV, TEST and PROD to stages, press Deploy, and set deployment rules for things like a semantic model's data source. They're great for Power BI teams and simple setups.

**fabric-cicd** is a Python library. It's open source and now officially supported by Microsoft, according to the team's announcement in 2026. It reads item definitions straight from your repo and publishes them into a target workspace, replacing environment-specific values on the way. It runs in whatever CI you already use, so you get real approvals, logs and repeatability. For engineering teams, this is the one I'd pick.

You can mix them, but don't promote the same items with both. Pick one path per item."

### 7:30 – Build it: the deploy script
[DEMO: open `deploy/deploy.py`]

"Here's the whole deploy script."

```python
# deploy/deploy.py
import os
from azure.identity import ClientSecretCredential
from fabric_cicd import FabricWorkspace, publish_all_items, unpublish_all_orphan_items

credential = ClientSecretCredential(
    tenant_id=os.environ["AZURE_TENANT_ID"],
    client_id=os.environ["AZURE_CLIENT_ID"],
    client_secret=os.environ["AZURE_CLIENT_SECRET"],
)

workspace = FabricWorkspace(
    workspace_id=os.environ["FABRIC_WORKSPACE_ID"],  # TEST or PROD workspace
    environment=os.environ["TARGET_ENV"],            # "TEST" or "PROD": matches parameter.yml
    repository_directory="workspace",
    item_type_in_scope=[
        "Lakehouse", "Environment", "Notebook", "DataPipeline",
        "VariableLibrary", "SemanticModel", "Report",
    ],
    token_credential=credential,
)

publish_all_items(workspace)           # create or update everything in scope
unpublish_all_orphan_items(workspace)  # delete items you removed from the repo
```

"Three things to notice.

First, the credential is explicit. Since v1.0, fabric-cicd requires you to pass a token credential, and the arguments are keyword-only. If you copied an older example, that's why it breaks.

Second, `environment` is just a label. It tells the library which column of the parameter file to use.

Third, `unpublish_all_orphan_items` deletes anything in the target that's no longer in the repo. That's what keeps PROD identical to `main`. If that makes you nervous, leave it out for the first few deployments."

### 9:00 – Per-environment values: parameter.yml
[DEMO: open `parameter.yml`]

"Your DEV notebook is attached to the DEV lakehouse, so its definition contains the DEV lakehouse's ID. In PROD that ID has to be the PROD lakehouse. That's what the parameter file is for."

```yaml
find_replace:
  # DEV lakehouse ID → the lakehouse with the same name in the target workspace
  - find_value: "aaaaaaaa-1111-2222-3333-dev000000001"   # DEV lh_sales ID
    replace_value:
      TEST: "$items.Lakehouse.lh_sales.$id"
      PROD: "$items.Lakehouse.lh_sales.$id"
    item_type: "Notebook"

  # DEV workspace ID used in notebook metadata
  - find_value: "bbbbbbbb-1111-2222-3333-devworkspace1"
    replace_value:
      TEST: "$workspace.$id"
      PROD: "$workspace.$id"

  # A SQL connection that differs per environment
  - find_value: "cccccccc-1111-2222-3333-devconnection1"
    replace_value:
      TEST: "dddddddd-1111-2222-3333-testconnectn1"
      PROD: "eeeeeeee-1111-2222-3333-prodconnectn1"
    item_type: "DataPipeline"
```

"The dynamic references, `$items.Lakehouse.lh_sales.$id`, mean you don't have to hard-code PROD GUIDs. The library looks up the lakehouse with that name in the target workspace. That removes most of the GUID-mapping pain people post about.

Connections are the exception. A connection's ID is tenant-wide, not per workspace. Create one connection per environment once, and map the IDs here."

### 10:15 – Run-time values: the Variable Library
[DEMO: open `vl_config` → variables `source_schema`, `lakehouse_name`, `alert_email` → value sets DEV / TEST / PROD → set the active value set per workspace.]

"The parameter file fixes values at deploy time. A Variable Library holds values your code reads at run time. You define the variables once, add a value set per environment, and each workspace has an active value set.

In a notebook:"

```python
vl = notebookutils.variableLibrary.getLibrary("vl_config")
source_schema = vl.source_schema
alert_email = vl.alert_email
print(f"Loading from {source_schema}")
```

"Pipelines can reference the same variables in their settings. And a change shipped this year matters for CI/CD: service principals can now use variable libraries, so the identity running your deployment can work with them too. Before that, the library failed under a service principal, which annoyed a lot of people."

### 11:15 – The pipeline: GitHub Actions
[DEMO: `.github/workflows/deploy.yml`]

```yaml
name: deploy-fabric
on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    environment: test
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: "3.12" }
      - run: pip install fabric-cicd azure-identity
      - run: python deploy/deploy.py
        env:
          TARGET_ENV: TEST
          FABRIC_WORKSPACE_ID: ${{ vars.FABRIC_WORKSPACE_ID }}
          AZURE_TENANT_ID: ${{ secrets.AZURE_TENANT_ID }}
          AZURE_CLIENT_ID: ${{ secrets.AZURE_CLIENT_ID }}
          AZURE_CLIENT_SECRET: ${{ secrets.AZURE_CLIENT_SECRET }}

  prod:
    needs: test
    runs-on: ubuntu-latest
    environment: prod        # add "required reviewers" on this environment for the approval gate
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: "3.12" }
      - run: pip install fabric-cicd azure-identity
      - run: python deploy/deploy.py
        env:
          TARGET_ENV: PROD
          FABRIC_WORKSPACE_ID: ${{ vars.FABRIC_WORKSPACE_ID }}
          AZURE_TENANT_ID: ${{ secrets.AZURE_TENANT_ID }}
          AZURE_CLIENT_ID: ${{ secrets.AZURE_CLIENT_ID }}
          AZURE_CLIENT_SECRET: ${{ secrets.AZURE_CLIENT_SECRET }}
```

"A push to `main` deploys to TEST, and PROD waits for a reviewer. The service principal needs to be a Contributor or higher on the TEST and PROD workspaces. Your tenant admin also has to allow service principals to use Fabric APIs. That tenant setting is the number one reason the first run fails.

Azure DevOps is the same idea: two stages, with an approval check on the PROD environment."

### 12:15 – The three things that still bite
[ON SCREEN: three numbered cards.]

"Three things to know before you go live.

**One: Direct Lake semantic models that still point at DEV.** The forum is full of this. You deploy the model and it still reads the DEV lakehouse. The model's connection to the lakehouse is in its definition, so treat it like any other ID: add a `find_replace` for the DEV lakehouse or SQL endpoint ID in the semantic model's files. Check after the first deploy that PROD's model shows the PROD lakehouse as its source.

**Two: shortcuts and data.** Git and deployments move definitions, not data. Shortcuts, especially to ADLS or another workspace, have failed to deploy in some setups per 2026 forum threads. Create them with a setup notebook or the API in each environment, and keep that script in the repo.

**Three: not every item type is supported yet.** Check the supported-items list for Git and for fabric-cicd before you design around an item. Anything unsupported gets a manual or scripted step, written down in your runbook."

### 13:30 – The Databricks comparison, and recap
[ON SCREEN: mapping table]

| Databricks Asset Bundles | Fabric |
|---|---|
| `targets: dev / test / prod` | One workspace per environment |
| `databricks.yml` variables | `parameter.yml` + Variable Library |
| `databricks bundle deploy -t prod` | `python deploy.py` with TARGET_ENV=PROD |
| Jobs defined in YAML | Pipelines/notebooks as item definitions in Git |

"If you're coming from Databricks, here's the map. A target is a workspace. Bundle variables become the parameter file plus the Variable Library. The deploy command is your fabric-cicd script.

To recap:
- Three workspaces.
- Only DEV is connected to Git.
- Feature work happens in branched-out workspaces.
- fabric-cicd promotes to TEST and PROD from your CI, with an approval gate.
- A parameter file handles IDs.
- A Variable Library handles run-time values.
- Watch for Direct Lake bindings, shortcuts and unsupported items.

The repo template from this video is linked below. Next, watch the end-to-end code-along, which builds the lakehouse this pipeline deploys."

## Chapters
```
0:00 The question everyone asks
0:30 The one-diagram answer
2:00 Why workspaces = environments
3:00 Connect DEV to Git
4:30 Branching with feature workspaces
6:00 Deployment pipelines vs fabric-cicd
7:30 The deploy script
9:00 parameter.yml for per-environment IDs
10:15 Variable Library for run-time values
11:15 GitHub Actions with an approval gate
12:15 3 things that still bite
13:30 Databricks Asset Bundles mapping + recap
```

## Description + tags
Microsoft Fabric CI/CD explained: how to set up Dev, Test and Prod with Git integration, fabric-cicd and Variable Libraries, step by step for 2026. The simple real-world setup, with the deploy script, parameter file and GitHub Actions workflow.

In this video:
- Workspaces as environments.
- Branching out to feature workspaces.
- Deployment pipelines vs fabric-cicd.
- Fixing Direct Lake models that still point to DEV.
- Mapping Databricks Asset Bundles to Fabric.

Repo template: [link]. fabric-cicd docs: [link].

Tags: microsoft fabric ci cd, fabric deployment pipelines, fabric git integration, fabric-cicd, fabric dev test prod, fabric variable library, fabric github actions, fabric azure devops, microsoft fabric tutorial, data engineering

## Shorts cutdowns

**Short 1: "Fabric's answer to Databricks bundles" (40s)**
[ON SCREEN TEXT: "Databricks bundles → Fabric = ?"]
"Coming from Databricks and wondering where bundles went in Fabric? Here's the map. A bundle target is a workspace. DEV, TEST and PROD are three workspaces. Bundle variables are a parameter file plus a Variable Library. The deploy command is a Python library called fabric-cicd that runs in your CI. Only DEV is connected to Git, and nobody edits PROD by hand. Full setup on the channel."
[ON SCREEN TEXT: "Target = Workspace · Variables = parameter.yml · Deploy = fabric-cicd"]

**Short 2: "Your PROD report is reading DEV data" (35s)**
[ON SCREEN TEXT: "PROD report… DEV data 😬"]
"You deployed your Direct Lake semantic model to PROD, and it's still reading the DEV lakehouse. That's because the lakehouse ID is stored inside the model's definition. Fix: in your deploy tool's parameter file, replace the DEV lakehouse ID with the PROD one, and then check the model's source after the first deploy. Thirty seconds of config saves a very bad Monday."
[ON SCREEN TEXT: "find_replace: DEV lakehouse ID → PROD"]

## LinkedIn post
**The Fabric CI/CD setup I'd use on day one:**

```
feature workspaces ──PR──▶ main ──▶ DEV (Git-connected)
                                 └─▶ CI: fabric-cicd ─▶ TEST ─approve─▶ PROD
values per env: parameter.yml (IDs) + Variable Library (run time)
```

Every week someone asks "what's the Fabric equivalent of Databricks bundles?" My answer: stop looking for one file. Workspaces are your targets.

- Only DEV is connected to Git.
- TEST and PROD are only ever deployed to.
- Use fabric-cicd if you have engineers, deployment pipelines if you don't. Never both for the same item.

The thing that still catches teams: Direct Lake models that quietly keep pointing at the DEV lakehouse after deployment. Parameterize that ID on day one.

What does your setup look like?

---

## Blog version (~800 words)

# Microsoft Fabric CI/CD: How to Set Up Dev, Test and Prod (2026 Guide)

If you've connected a Fabric workspace to Git and then wondered how anything gets to production, you're not alone. "How do you manage Dev, Test, and Prod in Fabric?" is one of the most asked questions in the Fabric community. Here's a simple, opinionated setup that works for most teams.

## Fabric dev, test, prod: use one workspace per environment
In Fabric, permissions, capacity, Spark settings, Git connections and item IDs are all scoped to a workspace. So the cleanest model is one workspace per environment: **DEV, TEST, PROD**.
- On a tight budget, start with DEV and PROD.
- Put DEV on a smaller capacity, so a runaway notebook can't throttle production reports.
- **Only DEV is connected to Git.** TEST and PROD are never edited by hand; they only receive deployments.

## Fabric Git integration: what goes in the repo
Connect DEV to Azure DevOps or GitHub (Workspace settings → Git integration), on branch `main`, with a folder like `/workspace`.
- Fabric writes each supported item as files: notebooks as `.py`, semantic models as TMDL, pipelines as JSON.
- Keep your deploy script and parameter file in the same repo.
- **Git stores definitions, not data.** A lakehouse in Git is an empty shell. Tables are created in each environment by running your notebooks or pipelines there.

## Branching strategy for Fabric
Use **Branch out to new workspace**. Each developer gets a feature branch and a matching feature workspace, then opens a pull request into `main`.
- Keep branches short-lived.
- Don't create a branch per environment. Environments are workspaces.
- If most contributors are business users building reports in the UI, put only the core engineering workspaces under Git, and let report workspaces use deployment pipelines.

## Fabric deployment pipelines vs fabric-cicd
- **Deployment pipelines** (built into Fabric) are quick to set up, use deployment rules for per-stage values, and suit Power BI-centric teams.
- **fabric-cicd** is an open-source Python library, now officially supported by Microsoft per the team's 2026 announcement. It publishes item definitions from your repo into a target workspace, from any CI system, with real approvals and logs. It suits engineering teams and many workspaces.
- Pick one path per item. Don't promote the same item with both.

A minimal fabric-cicd deploy script:

```python
import os
from azure.identity import ClientSecretCredential
from fabric_cicd import FabricWorkspace, publish_all_items, unpublish_all_orphan_items

cred = ClientSecretCredential(
    tenant_id=os.environ["AZURE_TENANT_ID"],
    client_id=os.environ["AZURE_CLIENT_ID"],
    client_secret=os.environ["AZURE_CLIENT_SECRET"],
)
ws = FabricWorkspace(
    workspace_id=os.environ["FABRIC_WORKSPACE_ID"],
    environment=os.environ["TARGET_ENV"],
    repository_directory="workspace",
    item_type_in_scope=["Lakehouse", "Notebook", "DataPipeline", "VariableLibrary", "SemanticModel", "Report"],
    token_credential=cred,
)
publish_all_items(ws)
unpublish_all_orphan_items(ws)
```

Since v1.0, the token credential must be passed explicitly and arguments are keyword-only, so older examples break.

## Per-environment values: parameter.yml and Variable Libraries
**Deploy-time IDs go in `parameter.yml`:**
- Use `find_replace` entries to swap the DEV lakehouse ID, workspace ID or connection ID for the target environment's.
- Dynamic references like `$items.Lakehouse.lh_sales.$id` look up the target workspace's lakehouse by name, so you don't hard-code production GUIDs.
- Connections are tenant-wide, so create one per environment and map their IDs.

**Run-time values go in a Variable Library:**
- Define the variables once, with a value set per environment, and set each workspace's active value set.
- Notebooks read them with `notebookutils.variableLibrary.getLibrary("vl_config")`.
- Service principals are now supported in variable libraries, which unblocks CI/CD identities.

## The approval gate: GitHub Actions or Azure DevOps
A push to `main` deploys to TEST automatically, and PROD waits for a required reviewer.
- The service principal needs Contributor (or higher) on the target workspaces.
- Your admin must enable the tenant setting that lets service principals call Fabric APIs. It's the most common first-run failure.

## Common Fabric CI/CD problems
1. **Direct Lake models still pointing to DEV.** The lakehouse binding lives in the model definition. Parameterize it, and check the source after the first deploy.
2. **Shortcuts and data.** Create shortcuts and seed data with a setup script per environment, kept in the repo.
3. **Unsupported item types.** Check the Git and fabric-cicd supported-items lists, and write manual steps into a runbook.

## Coming from Databricks Asset Bundles?
- Bundle **targets** = Fabric **workspaces**.
- Bundle **variables** = `parameter.yml` + **Variable Library**.
- `bundle deploy -t prod` = your **fabric-cicd** script with `TARGET_ENV=PROD`.

Start with two workspaces and one deploy script, and add TEST and approvals when a second person needs to sign off.
