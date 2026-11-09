# Backlog b12: Fabric Workspace Strategy for a Solo Data Engineer (or Small Team)

## Evidence (r/MicrosoftFabric, mined 2026-11-09; paraphrased, no usernames)
| Thread | Score / comments | Date | What it tells us |
|---|---|---|---|
| "Fabric Architecture Plan" | 57 / 37 | 2026-03 | New Fabric org; one ERP source; wants to skip silver and give some coworkers self-service on gold |
| "Workspace list is growing long and hard to navigate" | 35 / 25 | 2026-10 | Good practice means many workspaces and long names, and the UI handles both badly |
| "Designed a full Fabric end-to-end architecture for small teams, looking for feedback" | 40 / 22 | 2026-04 | 3 repos, Dev+Prod only, workspace pairs per layer, shortcuts as a bridge because the Warehouse can't read cross-workspace natively |
| "Workspace strategy" | 18 / 22 | 2026-02 | Team split: 3 env workspaces vs per-layer vs one per project. "What is best practice?" |
| "Experienced data engineers: how are you deploying Fabric in centrally managed environments?" | 32 / 21 | 2026-05 | Centralized platform teams; API deployments sometimes don't stick |
| "Building a Data Platform with Fabric as a Sole Data Engineer" | 48 / 21 | 2026-07 | Solo greenfield write-up: metadata-driven ingestion, incremental loads |
| "Solo Data Engineer: Git strategy for core medallion vs ~25 business workspaces with non-technical users" | 42 / 13 | 2026-09 | Only engineer who knows Git; 25 departmental workspaces; how much to govern? |
| "Struggling with cross-workspace warehouse limitations" | 13 / 31 | 2026-06 | Cross-workspace access is a recurring blocker |
| "Notebooks now failing when accessing a Fabric warehouse in another workspace" | 11 / 9 | 2026-09 | Same, from the engineering-vs-storage workspace split |

**Gap:** every thread asks "how many workspaces, split by what?" There's no simple, opinionated answer with naming conventions.

---

# Wk B12: Fabric Workspace Strategy: The Simple Setup for Solo Engineers and Small Teams
- **Runtime target:** 13–14 min
- **Pillar:** 6 (architecture) / 2 (decision)
- **Target keywords:** "fabric workspace strategy", "microsoft fabric workspace best practices", "fabric medallion workspaces". Small search volume; demand shown by 7+ threads with 20–37 comments each.
- **Title options:**
  1. Fabric Workspace Strategy: How Many Workspaces Do You Actually Need?
  2. The Simple Microsoft Fabric Workspace Setup for Small Teams (2026)
  3. Solo Data Engineer on Fabric? Use This Workspace Layout
- **Thumbnail:** "HOW MANY WORKSPACES?" over a grid of 6 workspace tiles, 3 with green checks
- **Verify before recording:**
  - Current cross-workspace rules: can a Warehouse query a Lakehouse/Warehouse in another workspace by three-part name? (Threads say no, use shortcuts; check the 2026 docs.)
  - Shortcut support in deployment pipelines and Git.
  - Workspace roles (Admin, Member, Contributor, Viewer) and item-level sharing behavior.
  - Domains / subdomains UI and whether workspace folders exist.
  - Workspace identity GA status.
  - Whether a workspace can be assigned to a different capacity per environment, and the trial/F-SKU rules for Dev.
  - Git integration item support list (Warehouse, semantic models, dataflows Gen2).

## Hook (0:00–0:30)
"How many Fabric workspaces should you have? One? Three? One per project? I read every workspace-strategy thread on the Fabric subreddit this year, and most of them end with 'it depends.' So here's an answer that doesn't. One layout for a solo engineer or a small team. Exact workspace names, who gets access to what, how data crosses workspaces, and when to split further. You can set it up this afternoon."

## Script

### 0:30 The three ways people split workspaces
"There are only three axes you can split on.

By environment: Dev, Test, Prod.

By layer: ingestion, transformation, reporting.

By audience or project: Finance, Sales, a workspace per project.

Most teams mix two of them. The mistake is mixing all three on day one, because then you have twenty-seven workspaces and one person. That's exactly what the 'workspace list is too long' thread was about."

[ON SCREEN: 3 axes as arrows; 3×3×3 = 27 cube crossed out]

### 1:30 The rule: split on what has different access or a different release cycle
"Here's the rule I use. You only create a workspace boundary when one of two things differs.

One: who can see it. Workspaces are the main security boundary in Fabric. If Finance shouldn't see raw HR data, they're in different workspaces.

Two: how it's released. If one set of items deploys together through Dev and Prod, it belongs in the same workspace.

Splitting for tidiness isn't a reason. Use folders and naming for that."

[ON SCREEN: 'New workspace only if: different ACCESS or different RELEASE cycle']

### 2:30 The solo / small-team layout
"Here's the layout. Two layers, two environments, plus business workspaces.

[ON SCREEN: diagram]
```
PLATFORM (you own; Git; Dev → Prod)
  plat-data-dev     ← lakehouses bronze/silver/gold, notebooks, pipelines
  plat-data-prod
  plat-model-dev    ← gold warehouse (optional), certified semantic models
  plat-model-prod

BUSINESS (they own; no Git required)
  bi-finance
  bi-sales
  bi-operations
  ...
```

Platform data: everything that moves and shapes data. Bronze, silver and gold lakehouses, notebooks, pipelines, dbt. Only you, or your engineers, have Contributor here.

Platform model: the certified semantic models built on gold, and a Warehouse if you serve gold through one. Splitting this from data means report builders can get Build permission on models without ever seeing raw bronze.

Business workspaces: where departments build their own reports on top of your certified models. They don't copy data. They connect to the shared model.

Why only Dev and Prod, no Test? For one person, a third environment is overhead you'll stop maintaining. Add Test when someone other than you signs off on releases.

Can you go even smaller? Yes. If you're truly alone and nobody else builds reports, merge data and model into one pair: `plat-dev` and `plat-prod`. Split later when report builders arrive."

### 4:45 Naming convention
"Names do a lot of work when the workspace list gets long. Pattern:

`<area>-<purpose>-<env>`

- area: `plat` for the platform you own, `bi` for business, or a domain like `fin`
- purpose: `data`, `model`, `ingest`, `sandbox`
- env: `dev`, `test`, `prod`; leave it off business workspaces that have no environments

Examples:
```
plat-data-dev        plat-data-prod
plat-model-dev       plat-model-prod
bi-finance           bi-sales
sbx-yourname         ← personal sandbox, never shared
```

And name items inside them the same way, by layer:
```
lh_bronze  lh_silver  lh_gold   wh_gold
nb_ingest_erp   nb_silver_orders   pl_nightly
sm_sales (semantic model)
```

Short, sortable, and a search for `prod` finds every production workspace."

[DEMO: workspace list filtered by 'plat-' then 'prod']

### 6:15 Access: who gets what role
"Roles per workspace:

[ON SCREEN: table]
| Workspace | Admin | Member | Contributor | Viewer |
|---|---|---|---|---|
| plat-data-* | you (+ backup admin) | none | engineers (dev only) | none |
| plat-model-prod | you | none | none | (use item Build permission instead) |
| bi-* | you (+ dept lead) | dept lead | report builders | consumers, or use an app |

Three rules.

One: always add a second admin. A thread this month asked what happens to a lakehouse when its owner's password expires. Don't find out in production.

Two: report builders don't need any role in the platform workspaces. Give them Build permission on the semantic model. That's item-level, so they can build reports in their own workspace without seeing your lakehouses.

[DEMO: Semantic model → Manage permissions → Add user → check 'Build']

Three: run production items under something that isn't a person, so ownership doesn't break when people leave. Workspace identity or a service principal for connections, where the item supports it."

### 8:00 Moving data across workspaces
"This is where people hit walls. Two threads with thirty-plus comments are about cross-workspace limits.

The pattern that works: shortcuts. In the model workspace, or in a business workspace that genuinely needs tables, create a lakehouse and add OneLake shortcuts pointing at the gold tables in `plat-data-prod`. No copy. One source of truth.

[DEMO: plat-model-prod → New lakehouse `lh_gold_sc` → New shortcut → Microsoft OneLake → plat-data-prod / lh_gold / Tables → select fact_sales, dim_customer → Create]

Why a lakehouse of shortcuts and not a direct query? Because, as of when I'm recording, a Warehouse reads other items by three-part name only inside the same workspace. The shortcut lakehouse is the bridge. Check the docs; this is an area Microsoft keeps changing.

Semantic models: a Direct Lake model in `plat-model-prod` can sit on that shortcut lakehouse. Business workspaces then connect to the model. Nobody copies data."

[ON SCREEN: arrows plat-data-prod → (shortcut) → plat-model-prod → (live connection) → bi-finance]

### 9:30 Git: what to put under source control
"From the thread with twenty-five business workspaces: do you put all of them in Git?

No. Put the platform workspaces in Git, because that's where engineering rigor pays off. `plat-data-dev` and `plat-model-dev` connect to your repo's main branch, or to a feature branch while you work. Production is promoted from Dev with a deployment pipeline or fabric-cicd.

Business workspaces stay out of Git. People who build reports in the browser and have never used Git will fight sync conflicts all day. Govern them a different way:
- certified semantic models they must build on
- endorsement of their best reports
- a monthly look at the admin monitoring or usage report

Govern the data layer tightly. Govern the report layer loosely."

[ON SCREEN: 'Platform → Git + deployment · Business → certified models + endorsement']

### 10:45 Capacity per workspace
"One more lever: capacity assignment. Dev workspaces can sit on a smaller capacity than prod, so a runaway notebook in Dev doesn't throttle the CFO's dashboard. If you only have one capacity, at least use surge protection settings so background jobs can't starve interactive reports. Check what's available on your SKU."

### 11:30 When to split further
"Split again when:
- **A second team owns a data domain.** Give them `fin-data-dev/prod` with their own lakehouses, and share gold through shortcuts.
- **Releases start blocking each other.** Split ingestion from transformation.
- **Someone else approves releases.** Add `test`.
- **Sensitive data appears.** HR or health data gets its own workspace pair with tight roles.

Until then, four platform workspaces and a handful of business workspaces will carry you a long way."

### 12:30 Recap
"Recap. Split only on access or release cycle. Platform data and platform model, each Dev and Prod. Business workspaces on certified models, out of Git. Use the `area-purpose-env` naming. Add a backup admin. Cross workspaces with shortcuts. Next video: the full Dev-to-Prod CI/CD setup for those platform workspaces."

## Chapters
```
0:00 How many workspaces?
0:30 The three ways to split
1:30 The one rule
2:30 The solo / small-team layout
4:45 Naming convention
6:15 Roles and permissions
8:00 Cross-workspace data with shortcuts
9:30 What goes in Git
10:45 Capacity per workspace
11:30 When to split further
12:30 Recap
```

## Description + tags
Microsoft Fabric workspace strategy for solo data engineers and small teams: how many workspaces, how to name them, who gets which role, and how to share gold data across workspaces with OneLake shortcuts.

Layout diagram and naming cheat sheet: [link]

Tags: fabric workspace strategy, microsoft fabric workspaces, fabric best practices, fabric medallion architecture, onelake shortcuts, fabric permissions, fabric git integration, solo data engineer, microsoft fabric tutorial

## Shorts
**Short 1: "The only rule for Fabric workspaces" (35s)**
"How many Fabric workspaces do you need? [TEXT: ONE RULE] Only create a new one if one of two things is different. [TEXT: 1. Who can see it] Who can see it, because workspaces are the security boundary. [TEXT: 2. How it's released] Or how it's released, because things that deploy together live together. Tidiness isn't a reason. Use names for that."

**Short 2: "Name your workspaces like this" (35s)**
"Long Fabric workspace list? Use this pattern. [TEXT: area-purpose-env] Area, purpose, environment. [TEXT: plat-data-dev · plat-data-prod · bi-finance] Platform data dev. Platform data prod. B-I finance. Now search 'prod' and you see every production workspace. Search 'plat' and you see everything you own."

## LinkedIn post
Fabric workspace strategy for a team of one (or five):

PLATFORM (you own, in Git)
• plat-data-dev / prod: lakehouses, notebooks, pipelines
• plat-model-dev / prod: certified semantic models

BUSINESS (they own, not in Git)
• bi-finance, bi-sales…: reports on your certified models

The rule: only add a workspace boundary when access or release cycle differs.
Cross workspaces with OneLake shortcuts, not copies.
Govern data tightly, reports loosely.

I see teams with 27 workspaces and one engineer. Start with four.

How many do you run?

---

## Blog version (~800 words)

# Microsoft Fabric Workspace Strategy for Solo Engineers and Small Teams

"How many workspaces should we have?" comes up again and again on the Fabric community forums. The answer is usually "it depends." Here is an opinionated default for one engineer or a small team.

## The three ways to split
You can split workspaces by **environment** (Dev/Test/Prod), by **layer** (ingest, transform, report), or by **audience** (Finance, Sales, projects). Splitting on all three at once multiplies fast: three environments × three layers × three departments is 27 workspaces. That is how teams end up with an unmanageable workspace list.

## The one rule
Create a new workspace only when **access** or **release cycle** differs:
- **Access:** workspaces are Fabric's main security boundary. If one group must not see another's data, separate them.
- **Release cycle:** items that are developed and deployed together belong together.

Use naming and folders for tidiness, not new workspaces.

## The default layout
**Platform (owned by engineering, in Git, Dev → Prod):**
- `plat-data-dev`, `plat-data-prod`: bronze/silver/gold lakehouses, notebooks, pipelines, dbt.
- `plat-model-dev`, `plat-model-prod`: certified semantic models and an optional gold warehouse.

**Business (owned by departments, not in Git):**
- `bi-finance`, `bi-sales`, `bi-operations`: reports built on the certified models.

Truly alone with no other report builders? Collapse to `plat-dev` and `plat-prod`, and split later. Add a `test` environment when someone else approves releases.

## Naming
Use `<area>-<purpose>-<env>`, such as `plat-data-prod`, `bi-finance` or `sbx-alex` (sandbox). Name items by layer and type: `lh_bronze`, `lh_gold`, `wh_gold`, `nb_silver_orders`, `pl_nightly`, `sm_sales`. Searching "prod" then finds every production workspace.

## Roles
- **Platform workspaces:** you as Admin, plus a **second admin**. Engineers are Contributors in Dev only.
- **Report builders get no role in platform workspaces.** Give them **Build** permission on the semantic model so they can create reports in their own workspace without seeing raw data.
- Run production connections under a non-person identity (workspace identity or a service principal) where supported, so nothing breaks when someone leaves.

## Crossing workspaces
Cross-workspace access is a frequent pain point. The reliable pattern is **OneLake shortcuts**: in the consuming workspace, create a lakehouse whose tables are shortcuts to the gold tables in `plat-data-prod`. There is no copy and one source of truth. Build Direct Lake semantic models on that lakehouse, and let business workspaces connect to the model. Check the current docs, because cross-workspace query support has been changing.

## What goes in Git
Put the **platform** workspaces in Git and promote Dev → Prod with deployment pipelines or fabric-cicd. Keep **business** workspaces out of Git: browser-only report builders and Git sync don't mix well. Govern them with certified models, endorsement and usage monitoring. Govern data tightly and reports loosely.

## Capacity
If you can, put Dev on a smaller capacity than Prod so experiments can't throttle executive dashboards. With a single capacity, use surge protection to protect interactive workloads.

## When to split further
- A second team owns a domain: give it its own `*-data-*` pair and share via shortcuts.
- Releases block each other: split ingestion from transformation.
- Someone else approves releases: add `test`.
- Sensitive data arrives: give it its own tightly controlled pair.

Until then, four platform workspaces plus a few business workspaces is enough for most small teams.

*Cross-workspace and Git support change often; confirm against Microsoft Learn before you build.*
