# Backlog b07: Is Azure Data Factory Dead? Migrating ADF to Fabric Data Factory

## Evidence (why this piece)
- **r/MicrosoftFabric, "Is ADF dead?": 79 comments.** The poster sees Microsoft staff promoting ADF→Fabric Data Factory migration and asks whether their heavily ADF-based org should start evaluating other tools.
- **r/MicrosoftFabric, "Hi! We're the Data Factory team, ask us anything": 139 comments.**
- **r/MicrosoftFabric, "Synapse vs Fabric": 35 comments.** A large org on Synapse pools asks whether to move.
- **r/MicrosoftFabric, "6 months into a full Microsoft Fabric migration": 32 comments, 82 upvotes.** Synapse/Power BI background; "aha" vs "wait, why?" moments.
- **r/MicrosoftFabric, "Alert on thousands of Fabric pipelines with a monitoring Eventhouse".** The author is migrating a few hundred pipelines.
- **r/MicrosoftFabric, "Is metadata-driven orchestration becoming overkill with Fabric Copy Job?": 42 comments.**
- **Search data:** "azure data factory" 22,200/mo but 0.84× (shrinking); "synapse analytics" 0.60×; "fabric data factory" 1.30× (growing). Search is moving from ADF to Fabric.

---

# Video: Is Azure Data Factory Dead? What to Migrate to Fabric (and What Not To)

- **Runtime target:** 14 min
- **Pillar:** 2 (decision) + 6 (architecture/migration)
- **Target keywords:** azure data factory (22,200, 0.84×), fabric data factory (210, 1.30×), synapse analytics (210, 0.60×), adf to fabric migration
- **Title options:**
  1. Is Azure Data Factory Dead? (ADF vs Fabric Data Factory in 2026)
  2. ADF to Fabric Migration: What Breaks, What Doesn't
  3. Should You Move Your ADF Pipelines to Fabric? Honest Answer
- **Thumbnail:** "IS ADF DEAD?". ADF logo with a question-mark tombstone, Fabric logo beside it.
- **Verify before recording:**
  - Whether Microsoft has announced any ADF retirement date. As of our knowledge there is none; ADF is a supported, separate Azure service. Re-check before saying it on camera.
  - Status of "bring your ADF into Fabric" (mounting an existing ADF in a Fabric workspace) and of any ADF→Fabric pipeline upgrade tool (e.g. a PowerShell module). Names and status change.
  - Fabric support for: tumbling window triggers, storage event triggers (via Activator), mapping data flows (no direct equivalent as of our knowledge), SSIS (check "SSIS in Fabric" status), self-hosted IR replacement (on-premises data gateway / VNet data gateway).
  - The "Invoke pipeline" activity name and whether it supports cross-workspace calls and service principals (a forum thread reports an SPN issue).
  - Variable libraries as the replacement for global parameters.

## Hook (0:00–0:30)
"Microsoft keeps telling you to move from Azure Data Factory to Fabric. So is ADF dead? No, and nobody has announced it is. But the question is still the right one. Search for ADF is shrinking and search for Fabric Data Factory is growing. In the next 13 minutes: what moves to Fabric cleanly, the five things that don't, and a script that inventories your ADF so you know how much work you're looking at."

## Script

### 0:30 Is ADF dead?
"Short answer: ADF is a separate Azure service, it's supported, and at the time I'm recording there's no retirement date. [ON SCREEN: 'No announced retirement. Check the description for the latest.'] Your pipelines won't stop on Monday.

But two things are true at once. New Data Factory features land in Fabric first: Copy job, mirroring, Dataflow Gen2. And if your company already pays for a Fabric capacity, pipelines there don't add a separate per-run bill. They burn capacity you've already bought.

So the real question isn't 'is ADF dead'. It's 'which of my pipelines are cheaper and simpler in Fabric, and which ones should stay where they are?'"

### 2:00 What's the same
"Good news first. A Fabric pipeline will look very familiar. [DEMO: open a Fabric pipeline canvas side by side with ADF]

Same canvas. Copy, Lookup, ForEach, If, Until, Set variable, Web, Stored procedure, Notebook. Same expression language: `@pipeline().parameters.x`, `@activity('Lookup').output.value`. If you've built ADF pipelines, you can build these today."

### 3:00 What's different: the mapping table
[ON SCREEN: table]

| ADF | Fabric Data Factory |
|---|---|
| Linked services | Connections (managed per user or shared) |
| Datasets | Gone; source/destination defined inline in the activity |
| Self-hosted integration runtime | On-premises data gateway (or VNet data gateway) |
| Mapping data flows (Spark) | No direct equivalent: Dataflow Gen2 or notebooks |
| Global parameters | Variable libraries |
| Execute Pipeline | Invoke pipeline |
| Schedule trigger | Schedule (in the item) |
| Storage event trigger | Event triggers via Activator / Real-Time hub |
| Tumbling window trigger | Not equivalent; rebuild with schedule + watermark |
| ARM template CI/CD | Git integration + deployment pipelines / fabric-cicd |

"Two of those will cost you real time. Datasets disappearing means every activity gets rewritten with inline source and destination. Mapping data flows don't migrate at all; they become Dataflow Gen2 or, for anything heavy, a notebook."

### 5:00 The five things that don't move cleanly
"One. **Mapping data flows.** Rebuild them. If the logic is joins and aggregations, a PySpark notebook is usually smaller and cheaper than the dataflow was.

Two. **Tumbling window triggers** with dependencies and backfill. Fabric doesn't have the same thing. Rebuild with a schedule plus a watermark table.

Three. **SSIS packages.** If you run the SSIS integration runtime in ADF, check the current state of SSIS support in Fabric before you promise anything.

Four. **Self-hosted IR quirks.** The gateway replaces it, but test throughput, proxy settings and drivers. A copy that was fine on SHIR can be slower through a gateway.

Five. **Identity.** In ADF you had a managed identity per factory. In Fabric, connections have owners, and scheduled pipelines run as a person unless you set it up otherwise. The community complains about this a lot. Plan for service principals or workspace identity before you migrate, not after."

### 7:00 Inventory your ADF first
"Before deciding, count what you have. This script lists every pipeline, its activity types, and every trigger type. [DEMO: run in Cloud Shell or locally]"

```python
# pip install azure-identity azure-mgmt-datafactory
from azure.identity import DefaultAzureCredential
from azure.mgmt.datafactory import DataFactoryManagementClient
from collections import Counter

SUB, RG, DF = "<subscription-id>", "<resource-group>", "<factory-name>"
c = DataFactoryManagementClient(DefaultAzureCredential(), SUB)

acts, risky = Counter(), []
def walk(activities, pipe):
    for a in activities or []:
        t = a.type
        acts[t] += 1
        if t in ("ExecuteDataFlow", "ExecuteSSISPackage"):
            risky.append((pipe, a.name, t))
        # nested containers
        for attr in ("activities", "if_true_activities", "if_false_activities"):
            walk(getattr(a, attr, None), pipe)
        for case in getattr(a, "cases", None) or []:
            walk(case.activities, pipe)

pipes = list(c.pipelines.list_by_factory(RG, DF))
for p in pipes:
    walk(p.activities, p.name)

trig = Counter(t.properties.type for t in c.triggers.list_by_factory(RG, DF))
flows = list(c.data_flows.list_by_factory(RG, DF))

print(f"{len(pipes)} pipelines, {len(flows)} mapping data flows")
print("Activities:", acts.most_common())
print("Triggers:", trig)
print("Needs rebuild:", *risky[:50], sep="\n  ")
```

"[ON SCREEN: sample output] You get a number. Say 240 pipelines, 18 mapping data flows, 6 tumbling window triggers. That's your migration estimate: the plain copy-and-orchestrate pipelines are quick, the flows and tumbling windows are the project."

### 9:00 Should you move? The decision
[ON SCREEN: decision table]

| Stay on ADF (for now) | Move to Fabric |
|---|---|
| Heavy mapping data flows or SSIS | Mostly Copy + orchestration |
| Destinations outside Fabric (Snowflake, Databricks, Azure SQL as the warehouse) | Destination is a lakehouse/warehouse in Fabric |
| Tumbling windows with complex dependencies | Simple schedules |
| Per-run ADF bill is small and predictable | You already pay for a capacity with headroom |
| No Fabric capacity yet | Power BI already on Fabric capacity |

"And a middle path. Many teams leave ADF running and build only new pipelines in Fabric. Some point ADF at OneLake as a destination. Nothing forces a big-bang migration."

### 10:30 Should you also drop the metadata framework?
"A popular community thread asks: with Copy job getting so good, is a metadata-driven framework overkill now? My take: if you're moving 30 tables from three databases, a Copy job with incremental copy covers it, and you can delete a lot of framework code. If you're moving 900 tables from 40 sources with per-table rules, keep the metadata table. Just drive Copy jobs or pipelines from it. Migration is a good moment to ask which one you actually are."

### 11:30 A safe migration order
[ON SCREEN: numbered]
"One: inventory with the script. Two: set up connections, gateway and identity in Fabric. Three: migrate the simplest copy pipelines and run them in parallel with ADF for a week. Compare row counts. Four: rebuild data flows as notebooks. Five: rebuild triggers. Six: switch off the ADF versions one by one. Keep ADF for anything on the 'stay' list."

### 12:30 Outro
"So: ADF isn't dead, but the new work is happening in Fabric. Move what's simple, rebuild what's worth rebuilding, leave the rest. Next I'll measure what Dataflow Gen2, Copy job and pipelines cost on the same data. Subscribe to [CHANNEL]."

## Chapters
0:00 Is ADF dead?
0:30 The short answer
2:00 What's the same
3:00 ADF → Fabric mapping table
5:00 5 things that don't migrate cleanly
7:00 Inventory script
9:00 Stay or move: decision table
10:30 Do you still need a metadata framework?
11:30 Safe migration order
12:30 Outro

## Description + tags
Is Azure Data Factory dead? What moves to Fabric Data Factory, what doesn't (mapping data flows, tumbling windows, SSIS), plus a Python script that inventories your ADF before you migrate.

Script: [link]
Tags: azure data factory, adf, fabric data factory, adf to fabric migration, microsoft fabric pipelines, synapse to fabric, copy job, mapping data flows, data engineering

## Shorts
**Short 1: "Is ADF dead?"** (35 s)
"Is Azure Data Factory dead? [TEXT: No retirement date announced] No. But new features ship to Fabric first, and searches for ADF are falling while Fabric Data Factory grows. Move simple copy pipelines. Keep mapping data flows and SSIS where they are until you've planned the rebuild."

**Short 2: "What disappears"** (40 s)
"Moving ADF pipelines to Fabric? Three things disappear. [TEXT: Datasets · Linked services · Tumbling windows] Datasets become inline settings. Linked services become connections. Tumbling window triggers don't exist; rebuild with a schedule and a watermark. Count them before you promise a date."

## LinkedIn post
"Is ADF dead?" got 79 comments in r/MicrosoftFabric. My answer:

ADF: supported, no retirement date, fine for what it does.
Fabric Data Factory: where new features land, and it runs on capacity you may already pay for.

What migrates easily: Copy, Lookup, ForEach, Web, notebooks.
What becomes a project: mapping data flows, tumbling windows, SSIS, identity.

Run an inventory first. 240 pipelines with 18 data flows is a different plan from 240 pipelines with none.

Most teams I'd advise: new work in Fabric, old ADF stays until there's a reason to touch it.

[diagram: ADF → Fabric mapping table]

---

# Blog: Is Azure Data Factory Dead? ADF vs Fabric Data Factory in 2026

"Is ADF dead?" is one of the most-discussed questions in the Microsoft Fabric community, with nearly 80 comments on a single Reddit thread. Search data agrees something is shifting: US searches for "azure data factory" fell to 0.84× year over year, while "fabric data factory" grew 1.3×. Here's a plain answer and a migration plan.

## Is Azure Data Factory being retired?
At the time of writing, Microsoft has not announced a retirement date for Azure Data Factory. It remains a separate, supported Azure service. What has changed is where the investment goes. Copy job, mirroring and Dataflow Gen2 are Fabric features, and if your organization already pays for a Fabric capacity, pipelines there consume that capacity rather than adding a per-run bill.

## What's the same in Fabric Data Factory
Pipelines look and behave like ADF. They have the same canvas, the same core activities (Copy, Lookup, ForEach, If, Until, Web, Stored procedure, Notebook) and the same expression language. ADF developers are productive immediately.

## What's different
- **Linked services → connections.** Connections have owners and sharing settings.
- **Datasets → gone.** Source and destination are defined inline in each activity, so every activity is touched in a migration.
- **Self-hosted IR → on-premises data gateway** (or VNet data gateway).
- **Mapping data flows → no direct equivalent.** Rebuild as Dataflow Gen2 or a PySpark notebook.
- **Global parameters → variable libraries.**
- **Tumbling window triggers → no equivalent.** Use schedules plus a watermark table.
- **ARM-template CI/CD → Git integration, deployment pipelines or fabric-cicd.**

## Five migration risks
1. **Mapping data flows** need rebuilding.
2. **Tumbling windows** with dependencies and backfill need redesign.
3. **SSIS packages:** check current Fabric SSIS support first.
4. **Gateway throughput** may differ from the self-hosted IR; test it.
5. **Identity:** scheduled pipelines and connections tied to a person are a common Fabric pain point. Decide on service principals or workspace identity before migrating.

## Inventory before you decide
Use the Azure SDK (`azure-mgmt-datafactory`) to list every pipeline, count activity types including nested ones, flag `ExecuteDataFlow` and `ExecuteSSISPackage`, and count trigger types. The full script is in the video description. The output is your estimate: simple copy-and-orchestrate pipelines are fast; data flows, SSIS and tumbling windows are the real project.

## Stay or move?
| Stay on ADF for now | Move to Fabric |
|---|---|
| Heavy mapping data flows or SSIS | Mostly copy + orchestration |
| Destinations outside Fabric | Lakehouse/warehouse destinations |
| Complex tumbling windows | Simple schedules |
| No Fabric capacity | Existing capacity with headroom |

A hybrid is common and sensible: keep existing ADF pipelines running, build new ones in Fabric, and migrate when a pipeline needs changes anyway.

## Do you still need a metadata-driven framework?
With Copy job's incremental copy, small estates (tens of tables, a few sources) may not need a custom framework. Large estates with per-table rules still benefit from a metadata table, now driving Copy jobs or pipelines.

## A safe migration order
1. **Inventory.**
2. **Set up connections, gateways and identity.**
3. **Migrate simple copy pipelines.** Run them in parallel with ADF for a week and compare row counts.
4. **Rebuild data flows as notebooks.**
5. **Rebuild triggers.**
6. **Decommission ADF pipelines one at a time.**

**ADF isn't dead. It's just no longer where the new features ship.** Migrate deliberately, not because of a headline.
