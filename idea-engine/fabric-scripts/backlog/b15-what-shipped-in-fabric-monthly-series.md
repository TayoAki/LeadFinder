# Backlog b15: "What Shipped in Fabric": Monthly Series (Template + November 2026 Episode)

## Evidence (r/MicrosoftFabric, mined 2026-11-09; paraphrased, no usernames)
| Thread | Score / comments | Date | What it tells us |
|---|---|---|---|
| "How do you guys keep track of everything that ships?" | 22 / 26 | 2026-06 | The direct ask |
| "'Learn Fabric' they said. 'How long could it take?'" | 46 / 30 | 2025-11 | Pace of change is a meme |
| "Microsoft Fabric Roadmap: Weekly Diff Analysis" / "Fabric Roadmap Weekly Diff, 2026-03-30" | 50 / 20 and 31 / 21 | 2026-03 | Community builds roadmap diff trackers by hand |
| "Fabric GPS: Microsoft Fabric Roadmap Tracker" | 39 / 21 | 2026-03 | Another community tracker |
| "FabCon Atlanta 2026: every announcement mapped with previous state, current state, persona impact" | 41 / 18 | 2026-04 | "What changed, and for whom" is the valued format |
| "Fabric January 2026 Feature Summary" | 41 / 25 | 2026-01 | The official monthly summary gets discussion |
| "Fabric Blog moved?!" | 45 / 55 | 2026-05 | People rely on the blog and noticed when it moved |
| "Do you use Preview features in Production?" | 13 / 41 | 2026-07 | Viewers need preview vs GA called out |

**Gap:** the official summary is long and lists everything. Community trackers diff the roadmap but don't explain impact. A 10–12 minute monthly video that says what shipped, who it's for, preview or GA, and whether to care is missing. As a recurring format it builds a habit and is cheap to produce.

---

## Part 1: Series template (repeat monthly)

### Format
- **Title pattern:** `What Shipped in Microsoft Fabric: <Month YYYY> (What Actually Matters)`
- **Publish:** within 5 days of the official monthly feature summary blog post.
- **Length:** 10–12 min. Max 10 items; anything else goes in a pinned comment list.
- **Fixed segments (same every month, so viewers know where to jump):**
  1. Cold open: the single biggest change, 20 seconds
  2. "The one you should try this week"
  3. Engineering: pipelines, Spark, notebooks, dbt, CI/CD
  4. Warehouse & SQL
  5. Power BI / semantic models / Direct Lake
  6. AI: Copilot, data agents, Apps, MCP
  7. Cost & admin: billing, capacity, monitoring
  8. "Heads up": breaking changes, price changes, deprecations
  9. Community tool of the month
  10. Certification / events
- **Every item gets the same four tags on screen:**
  - `GA` / `PREVIEW` / `ANNOUNCED`
  - Persona: `ENG` / `ANALYST` / `ADMIN` / `DEV`
  - Impact: `TRY IT` / `KNOW IT` / `SKIP`
  - A source link in the description

### Sources to check each month (in this order)
1. **Microsoft Fabric Blog:** the monthly "Feature Summary" post (official, complete). Note where the blog lives; it moved in 2026.
2. **Fabric Updates Blog** on community.fabric.microsoft.com: individual GA/preview announcements.
3. **Microsoft Fabric roadmap** (learn.microsoft.com, "What's new" and the release plan): planned vs shipped.
4. **Power BI monthly feature summary:** semantic model and report changes.
5. **GitHub releases:**
   - microsoft/fabric-cicd changelog
   - microsoft/dbt-fabric
   - Fabric CLI
   - semantic-link-labs
6. **r/MicrosoftFabric:**
   - Microsoft PM release posts and AMAs (what the product team stresses).
   - Top posts of the month (what users actually react to, including pain from changes).
7. **Community roadmap trackers:** weekly roadmap diffs and Fabric GPS-style trackers, to catch quiet changes.
8. **Microsoft Learn docs change logs** for billing and pricing pages. Billing changes have shown up as quiet doc edits.

### Production checklist (≈1 day/month)
- [ ] Pull the sources above into a sheet: item, date, status, persona, source URL.
- [ ] Score each 1–3 on reach (how many users) × impact. Keep the top 10.
- [ ] Verify status (GA vs preview) on the official page for every item.
- [ ] Demo the "try this week" item for real (30–60 s screen recording).
- [ ] Script it in the fixed segments, about 60 s per item.
- [ ] Thumbnail: month name + biggest item + "GA" badge.
- [ ] Pinned comment: the full list with links, including items that didn't make the video.
- [ ] Cut 2 Shorts: the biggest item and the "heads up" item.

### Recurring hook template
"Microsoft shipped <N> things to Fabric this month. You need to know about <K> of them. Here's what changed, who it's for, and whether it's ready for production, in about ten minutes."

---

## Part 2: November 2026 episode (example, filled in)

**Scope:** items that appeared in the r/MicrosoftFabric data mined on 2026-11-09, covering roughly late September to early November 2026. **Every item is from community posts and must be checked against the official Microsoft source before recording.** This episode was built only from the mined data, not the official November summary.

# Wk B15 (Nov 2026): What Shipped in Microsoft Fabric: November 2026 (What Actually Matters)
- **Runtime target:** 11–12 min
- **Pillar:** 3 (explainers) + recurring series
- **Target keywords:** "microsoft fabric updates", "fabric november 2026", "what's new in microsoft fabric", plus feature names (fabric dbt job, fabric-cicd, capacity metrics expensive queries)
- **Title options:**
  1. What Shipped in Microsoft Fabric: November 2026 (What Actually Matters)
  2. Fabric's Biggest Changes This Month: dbt GA, New Billing, Pipeline Retries
  3. 10 Fabric Updates in 11 Minutes (Nov 2026)
- **Thumbnail:** "NOV 2026" plus "dbt GA" and "NEW BILLING" badges
- **Verify before recording (every item):**
  1. Find expensive queries from Capacity Metrics: **GA** (community post 2026-11-04 links the Fabric Updates blog).
  2. dbt Job: **GA**; dbt Fusion **private preview**, Warehouse and Snowflake targets first (post 2026-10-05).
  3. Five Data Factory pipeline features from FabCon Barcelona (post 2026-10-02): Pipeline Dependencies (run conditions/dimensions), Conditional Retries with exponential backoff (docs say **preview**), Business Actions (Logic Apps connectors), Fabric Actions (call Fabric REST APIs), improved ADF upgrade tool. Check each one's status.
  4. On-demand billing model (FabCon Barcelona, post 2026-09-29): Microsoft's example of $3,533 on F64 vs $759 on-demand for the same workload. Check availability, regions and pricing page.
  5. OneLake consumption from Spark system-initiated calls billed from **Oct 1, 2026** (doc change reported 2026-09-02).
  6. fabric-cicd **v1.4.0** (2026-10-07): dynamic replacement variables (`$workspace`, `$items`) in bulk publish, dependency batches, Python 3.14 support.
  7. Fabric Apps: server-side storage token for OneLake access (community post 2026-10-02). Check the feature name and status.
  8. Fabric Data Engineering VS Code extension: Codex / Claude Code integration in the **pre-release** version (post 2026-09-22).
  9. New Monitoring view with saved custom views (community appreciation post 2026-09-27).
  10. Fabric Runtime 2.0 (GA Aug 2026). The community reports removed Python packages and one metadata-framework workload running ~60% slower after upgrading (post 2026-10-06). Present as one user's report.
  11. Community tools: **Weaver** (open-source data engineering framework, 2026-10-26) and **FabriBuddy** (open-source lineage, runs as a Fabric App, 2026-10-27). Check licenses and repo links.
  12. Data Days: AI@Work, starting Nov 2, 2026, with exam vouchers and study groups (post 2026-10-30). The community says the DP-700 English exam was updated in October 2026; check the study guide change log.

## Hook (0:00–0:30)
"This was a big month for Fabric, mostly because of FabCon Barcelona. dbt is now generally available inside Fabric. There's a new way to pay. Pipelines finally got smart retries. And the Capacity Metrics app can now tell you which warehouse query blew up your bill. Here are the ones that matter, who they're for, and which are ready for production, in about eleven minutes."

## Script

### 0:30 Cold open: the one you should try this week
"Try this one this week: find expensive queries from the Capacity Metrics app. It's GA.

[ON SCREEN: GA · ADMIN/ENG · TRY IT]

Here's the problem it solves. You see a spike in the Capacity Metrics app, and until now you had to guess which warehouse query caused it. Now you can drill from the capacity spike to the expensive warehouse queries behind it.

[DEMO: Capacity Metrics app → select spike timepoint → drill to warehouse → expensive queries list]

If cost has ever been a surprise for you, and on the subreddit it's the top complaint, this is fifteen minutes well spent."

### 1:30 Engineering: dbt Job is GA
"Engineering. dbt Job is generally available.

[ON SCREEN: GA · ENG · TRY IT]

You bring a dbt project, and Fabric runs it on your capacity. What's in GA:
- A Lakehouse adapter, so models land as Delta tables in OneLake
- Import from GitHub
- A managed dbt Core 1.11 runtime with public packages
- A pipeline activity
- Variable Library for Dev-to-Prod
- Logs and lineage in OneLake
- A REST API

There's also a private preview of the dbt Fusion engine, starting with Warehouse and Snowflake targets.

Who should care: anyone transforming with SQL. Who can skip it: teams already running dbt Core happily elsewhere. Service principal support was listed as roadmap at announcement. I compared dbt Job and dbt Core in a full video."

### 2:45 Engineering: five pipeline features from FabCon
"Five Data Factory pipeline features landed at FabCon Barcelona.

[ON SCREEN: list with tags]
1. **Pipeline Dependencies.** Run conditions that must be true before a pipeline runs: data arrived, an upstream pipeline succeeded, or a custom rule. That's less glue code.
2. **Conditional Retries with exponential backoff.** Retry on a 429 rate limit, but fail fast on an auth error. Each retry waits longer. PREVIEW at announcement. TRY IT in Dev.
3. **Business Actions.** Call enterprise app actions through Logic Apps connectors. For example, notify the ops team when a data-quality check fails.
4. **Fabric Actions.** Call Fabric REST APIs from a pipeline without hand-writing the request.
5. **Improved ADF upgrade tool.** Moving from Azure Data Factory? The migration tool can now set up a trial capacity and workspace for you.

The retries one is the quiet winner. Most flaky pipelines are rate limits."

### 4:15 Engineering: fabric-cicd 1.4.0 and the VS Code extension
"Two developer updates.

fabric-cicd version 1.4.0. Dynamic replacement variables, like `$workspace` and `$items`, now work in bulk publish. It publishes in dependency batches, so an item that references another item gets the real ID. Plus Python 3.14 support.

[ON SCREEN: KNOW IT · ENG]

And the Fabric Data Engineering VS Code extension now works with Codex and Claude Code, not just GitHub Copilot, for building notebooks. It's in the pre-release version, so opt in if you want it.

[ON SCREEN: PREVIEW/PRE-RELEASE · ENG · TRY IT]"

### 5:15 Monitoring: the new Monitoring view
"Not brand-new this month, but it earned the most thank-you posts recently: the new Monitoring view. Reviewing and retrying failures is easier, and you can save custom views. If you still check runs item by item, set up a saved view for 'failed in the last 24 hours.'

[DEMO: Monitor → filter status Failed, last 24h → Save view]"

### 6:00 AI & Apps: Fabric Apps get a storage token
"AI and Apps. Fabric Apps, the 'visualization as code' web apps announced at Build, can now get a server-side storage token for OneLake. In practice, an app can render things beyond data visuals, like images and maps, straight from OneLake. A community member rebuilt a report this way.

[ON SCREEN: KNOW IT · DEV]

If you build custom front ends, have a look. If you're a Power BI report builder, you can skip this for now."

### 6:45 Cost & admin: the new on-demand billing model
"Cost. This one got eighty-eight comments.

At FabCon, Microsoft presented an on-demand billing model, paying for what you use instead of reserving a capacity. Their own example: the same workload at about $3,533 on an F64 capacity versus about $759 on-demand. Those are Microsoft's example numbers, not yours.

[ON SCREEN: ANNOUNCED · ADMIN · KNOW IT]

The community reaction was mixed. Some said it proves capacities overcharged spiky workloads. Practically: if your usage is spiky, with a big nightly batch and quiet days, look at on-demand when it's available in your region. If you run steady all day, a reserved capacity may still be cheaper. Run your own numbers from the Metrics app. I'll do a full comparison when pricing is final."

### 8:00 Heads up: billing and runtime changes
"Two heads-ups.

One: since October 1st, OneLake consumption from some system-initiated Spark calls, which Microsoft says were underreported, is now billed. If your Spark workspaces jumped in October, this may be why. Compare September and October in the Metrics app.

[ON SCREEN: HEADS UP · ADMIN]

Two: Runtime 2.0 upgrades. Runtime 2.0 went GA in August. Users upgrading now report removed Python packages, which you add back in your Environment, and one team saw a metadata-driven nightly run go from about five hours to eight. That's one report, not a benchmark. But upgrade Dev first and time your jobs before you switch Prod."

### 9:00 Community tools of the month
"Two open-source tools from the community.

**Weaver**: a data engineering framework for Fabric. Dependency graph, incremental loading, CI/CD and testing across lakehouses and warehouses, from people with a large government warehouse background.

**FabriBuddy**: open-source lineage that runs as a Fabric App in your tenant. It parses your notebooks, pipelines, Dataflows and procedures and shows which code writes each table, plus who can read it.

[ON SCREEN: COMMUNITY · links in description]

As always with community tools: read the code and the license before you point them at production."

### 10:00 Certification & events
"Data Days: AI@Work started November 2nd, with sessions, study groups, contests, and exam vouchers. If you're aiming for DP-700, note that the English exam was reportedly updated in October, so check the study guide's change log before you study old material. My DP-600 vs DP-700 vs DP-800 video helps you pick if you get a voucher."

### 10:45 Recap
"Recap:
- Try the expensive-queries drill-down this week.
- Check out dbt Job if you're SQL-first.
- Set up conditional retries in Dev.
- Check your October bill for the OneLake change.
- Upgrade runtimes carefully.

Full list with links is in the pinned comment. See you next month."

## Chapters
```
0:00 November 2026 in one minute
0:30 Try this week: find expensive queries (GA)
1:30 dbt Job GA + dbt Fusion preview
2:45 5 new pipeline features (FabCon)
4:15 fabric-cicd 1.4.0 + VS Code with Claude/Codex
5:15 New Monitoring view
6:00 Fabric Apps storage token
6:45 New on-demand billing model
8:00 Heads up: OneLake billing + Runtime 2.0
9:00 Community tools: Weaver, FabriBuddy
10:00 Data Days + exam updates
10:45 Recap
```

## Description + tags
What shipped in Microsoft Fabric for November 2026, and what actually matters: dbt Job GA, find expensive queries in Capacity Metrics (GA), five new pipeline features from FabCon Barcelona, fabric-cicd 1.4.0, the new on-demand billing model, the October OneLake billing change, Runtime 2.0 upgrade notes, and community tools.

Sources for every item: [pinned comment / links]

Tags: microsoft fabric updates, what's new in microsoft fabric, fabric november 2026, fabric dbt job, fabric-cicd, capacity metrics app, fabric billing, fabcon barcelona, fabric pipelines, microsoft fabric news

## Shorts
**Short 1: "Find what blew up your Fabric bill" (35s)**
"Your Fabric capacity spiked, and you don't know why. [TEXT: NEW · GA] The Capacity Metrics app can now drill from the spike straight to the expensive warehouse queries behind it. [TEXT: Spike → Warehouse → Query] Pick the time point, open the warehouse, see the queries. Fifteen minutes to set up. Do it before finance asks."

**Short 2: "Check your October Fabric bill" (35s)**
"Did your Fabric Spark usage jump in October? [TEXT: Oct 1, 2026] Microsoft started billing OneLake consumption from some system-initiated Spark calls that it says were underreported before. [TEXT: Compare Sep vs Oct] Open the Capacity Metrics app and compare September to October. Now you know why."

## LinkedIn post
What shipped in Microsoft Fabric this month, in one minute:

✅ dbt Job: GA (Lakehouse adapter, pipeline activity, Variable Library CI/CD)
✅ Find expensive queries from Capacity Metrics: GA
🧪 Pipelines: conditional retries with exponential backoff (preview), pipeline dependencies, Fabric Actions
📦 fabric-cicd 1.4.0: dynamic variables in bulk publish
💸 On-demand billing announced: Microsoft's example $3,533 (F64) vs $759
⚠️ OneLake billing for system-initiated Spark calls since Oct 1

Try first: the expensive-queries drill-down.

What did I miss?

---

## Blog version (~800 words)

# What Shipped in Microsoft Fabric: November 2026

Fabric ships every month, and the official summary lists everything. This roundup covers what matters, who it's for, and whether it's production-ready. *Items are drawn from Microsoft announcements and community posts from late September to early November 2026. Confirm status on the linked official pages.*

## Try this week: find expensive queries from Capacity Metrics (GA)
Cost visibility is the most common complaint in the Fabric community. The Capacity Metrics app can now link a capacity spike to the expensive Warehouse queries that drove it. If you run a Fabric Warehouse in production, set this up first.

## Engineering
**dbt Job is generally available.** Bring a dbt project and Fabric runs it on your capacity. GA includes:
- A Lakehouse adapter (models land as Delta tables in OneLake).
- GitHub import and a managed dbt Core 1.11 runtime with public packages.
- A pipeline activity, and Variable Library for promoting between environments.
- Logs and lineage in OneLake, plus a REST API.

The dbt Fusion engine is in private preview, starting with Warehouse and Snowflake. Teams already running dbt Core elsewhere don't need to switch.

**Five pipeline features from FabCon Barcelona:**
1. *Pipeline Dependencies:* run conditions (data available, upstream success, custom rules) gate a pipeline.
2. *Conditional Retries with exponential backoff:* retry only on matching errors such as HTTP 429, with growing waits. Preview at announcement.
3. *Business Actions:* invoke enterprise app actions through Logic Apps connectors.
4. *Fabric Actions:* call Fabric REST APIs from a pipeline with minimal setup.
5. *Improved ADF upgrade tool:* migration now sets up a trial capacity and workspace for you.

**fabric-cicd 1.4.0.** Dynamic replacement variables (`$workspace`, `$items`) now work in bulk publish, with dependency-ordered batches and Python 3.14 support.

**VS Code.** The Fabric Data Engineering extension's pre-release now works with Codex and Claude Code as well as GitHub Copilot for notebook development.

**Monitoring.** The new Monitoring view makes reviewing and retrying failures easier and supports saved custom views. Save a "failed in last 24h" view.

## Apps
Fabric Apps can use a server-side storage token to read from OneLake, so custom apps can render images, maps and other content stored there. This is relevant if you build custom front ends; most report builders can wait.

## Cost and billing
**On-demand billing (announced).** At FabCon, Microsoft presented a pay-for-what-you-use model. Its example put the same workload at about $3,533 on an F64 capacity versus about $759 on-demand. Spiky workloads stand to benefit most; steady 24/7 workloads may still favor reserved capacity. Model your own usage before switching.

**Heads up: OneLake billing change.** From October 1, 2026, OneLake consumption from certain system-initiated Spark calls, previously underreported according to Microsoft's docs, is billed. Compare September and October in the Metrics app.

## Runtime 2.0 upgrades
Runtime 2.0 went GA in August. Upgraders report some Python packages are no longer included (add them to your Environment), and one team running many small notebook tasks saw a nightly job slow from about 5 to 8 hours. Upgrade and benchmark Dev before Prod.

## Community tools
- **Weaver:** an open-source data engineering framework for Fabric (dependency graph, incremental loads, CI/CD, testing).
- **FabriBuddy:** open-source lineage that runs as a Fabric App, reverse-engineering lineage from notebooks, pipelines, Dataflows and procedures.

Review code and licenses before production use.

## Certification and events
Data Days: AI@Work started November 2 with sessions, study groups and exam vouchers. The DP-700 English exam was reportedly updated in October 2026; check the study guide change log.

*Next month: the December roundup.*
