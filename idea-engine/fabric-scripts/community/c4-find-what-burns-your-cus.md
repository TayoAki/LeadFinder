# C4: Fabric Cost Control: Find What's Burning Your CUs (2026)

**What this covers:** operational FinOps: finding and stopping the workloads that eat your capacity. It does **not** cover list prices or picking a SKU; that's the week-10 pricing video. Link the two to each other.

## Evidence: why this piece exists
Mined from r/MicrosoftFabric (304 posts, Nov 2025–Nov 2026), the Fabric Community forum (194 threads found via Google) and Stack Overflow (158 questions). Threads are paraphrased, with no usernames.

- **How big the theme is:** cost, capacity, CU and throttling came up in 48 Reddit threads with 1,636 comments. That's the #3 theme by discussion, behind learning paths and ingestion choice, and 20 forum threads match.

| Thread (paraphrased) | Comments | What it tells us |
|---|---|---|
| "Increased data warehouse CU usage by system user": 8× jump overnight, can't see which queries | 91 | People can't attribute CU spikes |
| "Increased CU consumption warehouse queries": same queries now billed 2–3×, several tenants over 100% | 78 | Spikes the team didn't cause |
| "Spark vs. Warehouse ETL CU consumption: my test results" | 79 | People want measured comparisons, not marketing |
| "Microsoft says Dataflow Gen2 is cheaper; our workload uses 20× more CUs" | 52 | Gen2 billing per query execution time surprises people |
| "3X cost on capacity overages, really??" | 49 | Overage pricing confusion |
| "Fabric Plan is expensive?": ~100K CU-seconds/day for one author | 46 | New items with unclear costs |
| "Materialized Lake Views: it was too good to be true": full refreshes only | 41 | Silent full-refresh costs |
| "Fabric's new on-demand billing model is a confession": $3,533 on F64 vs $759 on-demand for the same workload (Microsoft's FabCon example) | 88 | The billing model itself is changing |
| "Cost Management in Fabric is a real problem": ~30-day retention, no API for activity-level CU, no per-pipeline attribution | 28 | The tooling gap |
| "Why is monitoring Microsoft Fabric so expensive?": monitoring Fabric costs Fabric CUs | 18 | Monitoring has its own bill |
| "Lesson: how I burned a lot of money with data agents": a graph cache storage line grew to tens of TB; about $9K bill | 16 | Preview features plus no guardrails |
| "Extreme system usage CU for Warehouse": the portal's table "Object Overview" pane fired an expensive lookup query per click | 8 | Hidden system queries |
| "Find expensive queries from Capacity Metrics is now GA" (Nov 2026) | 12 | The new tool to show |
| Forum: "Idle Spark executor consuming all CUs for a full day"; "Spark session charges on allocated resources" | – | Idle Spark sessions |

## Video script

- **Runtime target:** 14–15 min
- **Pillar:** 6 (cost and architecture for decision-makers), plus 3 (explainers)
- **Target keywords:**
  - microsoft fabric pricing: 720/mo, 0.76×, $50 CPC
  - fabric capacity: 390/mo, 0.94×, $8.76 CPC
  - fabric f64: 70/mo, $119 CPC
  - Long-tail from the threads: "fabric capacity throttling", "capacity metrics app", "fabric cu consumption"
- **Title options:**
  1. Fabric Cost Control: Find What's Burning Your CUs (2026)
  2. Your Fabric Capacity Is Throttled. Here's How to Find the Culprit in 10 Minutes
  3. 7 Hidden CU Burners in Microsoft Fabric (and How to Stop Each One)
- **Thumbnail:** "WHO ATE MY CUs?" A capacity chart spiking red past 100%, with a magnifying glass on one bar.

### Verify before recording
- **"Find expensive queries" in Capacity Metrics:** GA announced Nov 2026. Confirm the exact UI path and which item types it covers (Warehouse only, or also the SQL endpoint).
- **Capacity Metrics app retention:** the community says ~30 days. Confirm the current figure and whether any export/API option shipped.
- **Throttling stages and windows:**
  - Overage protection: up to 10 min of future use.
  - Interactive delay: 10–60 min.
  - Interactive rejection: 60 min–24 h.
  - Background rejection: >24 h.
  - Smoothing: interactive ≥5 min, background 24 h.
  - Confirm these haven't changed.
- **Surge protection:** capacity-level background rejection threshold, plus workspace-level controls (preview, Jan 2026): max % per workspace over a rolling 24 h, with a mission-critical exemption. Confirm the status and names.
- **Capacity overage feature:** billed at 3× the PAYG rate per the community reading of docs. Confirm the multiplier, how to enable it and any caps.
- **On-demand billing model** (FabCon Barcelona, Sep 2026):
  - Confirm its name, availability (preview/GA, regions), which workloads it covers, and its rates.
  - The $3,533 vs $759 figure is Microsoft's own example as reported by a user. Say "Microsoft's example".
- **Dataflow Gen2 (CI/CD) billing,** as quoted by a user:
  - 12 CU per second of each query's execution for its first 10 min.
  - 1.5 CU/s after that.
  - Fast Copy: 1.5 CU/s.
  - Confirm on the Dataflow Gen2 pricing page.
- **OneLake consumption from Spark system-initiated calls:** billed from Oct 1, 2026. Confirm the wording.
- **Spark:**
  - Default session timeout (20 min).
  - `notebookutils.session.stop()`.
  - Autoscale Billing for Spark (serverless pay-as-you-go Spark off the capacity). Confirm GA status and name.
- **Materialized lake views:** confirm the current incremental-refresh conditions. A user read that only append-only sources refresh incrementally; check whether this was expanded.
- **Fabric Plan:** confirm its pricing model. A user describes a per-user fee tied to the role, lasting 30 days.
- **Warehouse "ObjectOverviewActivityLookup":** confirm whether Microsoft has fixed it. If yes, present it as a "this happened" case study.
- **queryinsights column names:** check `allocated_cpu_time_ms`, `total_elapsed_time_ms`, `label`, `command`, `login_name` and `start_time` in `queryinsights.exec_requests_history`.

### Hook (0:00–0:30)
"Your capacity hit 100% overnight. Reports are slow, refreshes are getting rejected, and nobody on the team changed anything. I've seen this exact story come up in the Fabric community again and again this year. In this video I'll show you how to find the item, the operation and even the exact query burning your CUs. Then I'll go through seven burners people keep hitting, and the fix for each one. By the end you'll have a 15-minute routine you can run every week."

### Script

**[0:30] Chapter 1: How Fabric bills you, in 90 seconds**

[ON SCREEN: "CU = capacity unit. F2 = 2 CU. F64 = 64 CU."]

"Quick foundation, because everything else depends on it. A Fabric capacity gives you a number of capacity units every second. An F2 gives you two. An F64 gives you sixty-four. Every item in every workspace on that capacity draws from the same pool.

Fabric doesn't charge a spike all at once. It smooths it out. Interactive work, like someone clicking a report, is spread over at least five minutes. Background work, like a pipeline or a notebook, is spread over twenty-four hours.

That's why a single heavy job at 2 AM can still be hurting you at 4 PM. You're paying it back all day.

When the smoothed usage goes over 100%, you build up what people call capacity debt. Then throttling starts in stages."

[ON SCREEN: a staircase graphic]
- Up to 10 min of future use: nothing happens (overage protection)
- 10–60 min: interactive delay
- 60 min–24 h: interactive rejection
- More than 24 h: background rejection

"So when someone says 'Fabric is down', it's often not down. The capacity is throttled, and the cause was a job that ran hours ago. Let's find it."

**[2:00] Chapter 2: The Capacity Metrics app, the right way**

[DEMO: Open the Microsoft Fabric Capacity Metrics app → Compute page → select the capacity.]

"Open the Capacity Metrics app and go to the Compute page. The top-left chart is CU usage over time. The line is your limit. Look for where the bars cross it."

[DEMO: Click "Throttling" tab on the chart → show Interactive delay % and Background rejection %.]

"Switch the chart to the Throttling tab. If the interactive delay line is above 100%, users are waiting. If background rejection is above 100%, your jobs are being refused.

Now the important part. Don't start from the chart. Start from the item table underneath."

[DEMO: Sort the "Items" matrix by CU (s) descending. Expand the top item to show operations.]

"Sort by CU seconds. Over a 14-day view, the top three items are almost always more than half your bill. Expand one, and you'll see the operation names: Warehouse Query, Dataflow Gen2 Refresh, Notebook Run, Spark session, Dataset Query, and so on. Write these down. This is your burn list."

[DEMO: Click a spike → "Explore" (timepoint drill-through) → sort Background operations by "Total CU (s)" → show User and Operation ID columns.]

"For a specific spike, drill into that timepoint. You get every operation that's being smoothed into that moment. You also get who ran it, which can be a user, a service principal or 'System'. Remember 'System'. We'll come back to it."

**[4:00] Chapter 3: Find expensive queries (new, GA)**

[ON SCREEN: "New: Find expensive queries from Capacity Metrics (GA, Nov 2026)"]

"New this month: you can now go from a capacity spike straight to the expensive warehouse queries behind it. Before this you had to guess.

[DEMO: From a Warehouse item in the Compute page, use the new expensive-queries drill-through → land on the query list.]

If you want to go deeper, or your setup doesn't show it yet, the warehouse keeps its own history. Run this in the warehouse SQL editor:"

[DEMO: SQL editor]
```sql
-- Top 20 queries by CPU in the last 7 days
SELECT TOP 20
    login_name,
    label,
    COUNT(*)                                   AS runs,
    SUM(allocated_cpu_time_ms) / 1000.0        AS cpu_seconds,
    MAX(total_elapsed_time_ms) / 60000.0       AS longest_minutes,
    LEFT(MAX(command), 200)                    AS sample_command
FROM queryinsights.exec_requests_history
WHERE start_time >= DATEADD(day, -7, GETUTCDATE())
GROUP BY login_name, label
ORDER BY cpu_seconds DESC;
```

"Group by label as well as user. Some system queries carry a label. One team this year found that clicking a table in the warehouse explorer fired a system lookup query. That query scanned a month of query history. It had become most of their warehouse CPU, and in Capacity Metrics it only showed as 'System'. This label check is how they caught it:"

```sql
SELECT CAST(start_time AS date) AS day,
       COUNT(*) AS runs,
       SUM(allocated_cpu_time_ms) / 1000.0 AS cpu_seconds
FROM queryinsights.exec_requests_history
WHERE label LIKE 'ObjectOverview%'
GROUP BY CAST(start_time AS date)
ORDER BY day DESC;
```

"If that returns rows and big numbers, the fix is boring. Stop clicking around tables in the explorer on a busy production warehouse, and report it to Microsoft support with these numbers."

**[6:00] Chapter 4: The seven burners**

"Here are the seven CU burners that came up most in community threads this year."

[ON SCREEN: numbered list builds as each is covered]

"**One. Dataflow Gen2 doing simple ingestion.** One team moved from Gen1 to Gen2 and saw roughly twenty times the CUs, for plain SQL-to-lakehouse loads with query folding working. The reason is how it's billed. Gen2 bills each query's execution time, at a higher rate for the first ten minutes of every query. So a dataflow with many short queries running in parallel racks up billed time much faster than the wall clock suggests.

The fix: if it's straight copying, use a Copy job or a pipeline Copy activity. Keep Dataflow Gen2 for real Power Query transformations. Then compare the two in Capacity Metrics. Don't trust a benchmark, including mine. Measure your own workload."

"**Two. Warehouse 'System' spikes.** We just covered it: use queryinsights, group by label, and check after every big portal update. If the same queries suddenly cost two or three times more and you changed nothing, open a support ticket with the before-and-after numbers. Several tenants reported exactly that this year."

"**Three. Idle Spark sessions.** A notebook finishes, but the session stays up until the timeout, and you're billed for allocated cores, not used cores. Put this as the last cell of every scheduled notebook:"

```python
# Last cell: release the session as soon as the work is done
notebookutils.session.stop()
```

"Also:
- Use high-concurrency mode so several notebooks share one session in pipelines.
- Keep the starter pool small for light work.
- Look at Autoscale Billing for Spark if your Spark is spiky. It moves Spark off the shared capacity and bills it per use. Check the current status on screen."

"**Four. Data agents and other preview items.** One user testing data agents across ontologies, graphs and semantic models watched a cache storage line jump to tens of terabytes. The bill came to around nine thousand dollars. Another team on an F2 hit the capacity limit after three rounds of ten test questions.

The fix:
- Test preview features on a separate small capacity, not production.
- Check Capacity Metrics and the Azure cost view daily for the first two weeks.
- Set an Azure budget alert on the capacity's resource group."

"**Five. Materialized lake views doing full refreshes.** They look like free orchestration. But at the time of these threads, MLVs only refreshed incrementally for append-only sources. Updates and deletes forced a full rebuild, and on big tables that's a lot of CUs. Check the current docs on screen. If your sources have updates or deletes, test refresh cost on a copy before you commit."

"**Six. New per-user items like Fabric Plan.** One user saw about a hundred thousand CU seconds a day as the only author. Before you roll out anything new, run it for a week on a test capacity. Divide the CU seconds by the number of users, then multiply by thirty."

"**Seven. Monitoring that costs more than it saves.** Running an Eventstream 24/7 or an Eventhouse per workspace just to watch CUs can be a real share of a small capacity. Start with Capacity Metrics plus one central monitoring setup. Not one per workspace."

**[11:00] Chapter 5: Guardrails**

[DEMO: Admin portal → Capacity settings → Surge protection.]

"Now let's stop it happening again. Surge protection has two parts.
- The original one sets a background-rejection threshold for the whole capacity. Once usage passes it, new background jobs are refused instead of pushing everyone into throttling.
- The newer one, in preview, is workspace-level. You set a rule like 'no workspace can use more than 30% of the capacity over 24 hours', then mark your critical workspaces as exempt.

One honest limit: the workspace rule looks at a 24-hour window. It's good at stopping a runaway background workspace. It won't stop a burst of report users in one workspace from slowing down another. For that, put the heavy interactive workspaces on their own capacity."

[ON SCREEN: "Capacity A: ETL / background · Capacity B: Reports / interactive"]

"Splitting background and interactive work across two smaller capacities is the single most common fix I see from admins running big Fabric estates."

**[12:30] Chapter 6: Bigger SKU, overage or on-demand?**

[ON SCREEN: three-column comparison]

"When you keep going over, you have three options.
- **Scale up one SKU.** That doubles the price, all day, every day. It makes sense when you're over most days.
- **Turn on capacity overage.** You pay for the excess instead of being throttled, but per the docs it's billed at about three times the normal rate. It makes sense when you're over a few days a month.
- **The new on-demand billing model** announced at FabCon. In Microsoft's own example, a workload cost about thirty-five hundred dollars on an F64 and about seven hundred sixty on-demand. That's a big claim. The pattern makes sense for spiky workloads that sit idle most of the day. Run your own Capacity Metrics numbers through it before you switch.

Here's the rule of thumb. Count the days per month you went over 100% smoothed usage.
- 0–3 days: fix the burners and add surge protection.
- 4–10 days: consider overage, or split capacities.
- More than 10: scale up, or price out on-demand."

**[13:45] Chapter 7: Your weekly 15-minute routine**

[ON SCREEN: checklist]
1. Capacity Metrics → top 5 items by CU(s), last 7 days. Anything new?
2. Throttling tab → any day over 100%?
3. Warehouse: run the queryinsights top-20 query.
4. Spark: any notebook without `session.stop()`?
5. Any preview item added this week? Check its line.
6. Export this week's numbers. The app only keeps about 30 days, so keep your own history.

"Microsoft doesn't give you a long-term cost history out of the box yet. So export it weekly and you'll have one when someone asks why the bill went up.

Next, watch the pricing video. It shows how to size the capacity in the first place. See you there."

### Chapters
```
0:00 Your capacity hit 100%: now what?
0:30 How Fabric bills you (smoothing & throttling)
2:00 Capacity Metrics app, the right way
4:00 Find expensive queries (new, GA)
6:00 The 7 hidden CU burners
11:00 Guardrails: surge protection & splitting capacities
12:30 Bigger SKU vs overage vs on-demand billing
13:45 Your weekly 15-minute cost routine
```

### Description and tags
Microsoft Fabric cost control: find exactly which item, operation and query is burning your capacity units (CUs), and stop it. Uses the Capacity Metrics app, the new "find expensive queries" feature and queryinsights SQL.

Covers:
- Throttling and smoothing explained.
- 7 common CU burners: Dataflow Gen2, warehouse system queries, idle Spark sessions, data agents, materialized lake views, Fabric Plan, monitoring.
- Surge protection, including workspace-level controls.
- When to scale up, use overage or try on-demand billing.

SQL from the video is in the pinned comment.

Tags: microsoft fabric pricing, fabric capacity, fabric capacity metrics app, fabric throttling, fabric cu consumption, fabric cost optimization, fabric f64, surge protection fabric, dataflow gen2 cost, fabric warehouse queryinsights

### Shorts cutdowns

**Short 1: "Fabric isn't down. It's throttled." (~40 s)**
[ON SCREEN: "Fabric isn't down. It's throttled."]
"Your Fabric reports are slow and refreshes fail, so everyone says Fabric is down. Usually it isn't. Fabric spreads background jobs over twenty-four hours, so a heavy job at 2 AM can still be slowing you down at 4 PM. Open the Capacity Metrics app, go to the Throttling tab, and look for days over 100%. Then sort items by CU seconds. Your culprit is almost always in the top three. Full routine on the channel."

**Short 2: "One line that cuts Spark costs" (~30 s)**
[ON SCREEN: `notebookutils.session.stop()`]
"If your scheduled Fabric notebooks don't end with this line, you're paying for idle Spark. The notebook finishes, but the session stays up until it times out, and you're billed for the cores it holds. Add `notebookutils.session.stop()` as the last cell. One line."

**Short 3: "Dataflow Gen2 cost trap" (~40 s)**
[ON SCREEN: "Dataflow Gen2 = 20× more CUs?"]
"One team moved from Dataflow Gen1 to Gen2 and saw about twenty times the capacity use, for simple SQL copies. The reason: Gen2 bills each query's execution time, and many short queries in parallel add up fast. If you're just copying data, use a Copy job or a pipeline Copy activity. Save Dataflow Gen2 for real transformations. And measure both in Capacity Metrics before you decide."

### LinkedIn post
**Fabric cost problems are mostly attribution problems.**

I went through a year of Fabric community threads about capacity. The pattern is clear. Teams rarely overspend on purpose. They can't see what's spending.

The 7 burners that keep coming up:
1. Dataflow Gen2 used for simple copies
2. Warehouse "System" queries nobody ran
3. Idle Spark sessions
4. Data agents tested on production capacity
5. Materialized lake views silently doing full refreshes
6. New per-user items (Plan)
7. Monitoring that costs CUs itself

[Diagram: capacity pool → 7 pipes, sized by how often each came up]

The fix isn't a bigger SKU. It's a weekly 15-minute routine:
- top items by CU
- throttling days
- queryinsights top 20
- `session.stop()` audit
- export your numbers, because the Metrics app forgets after about a month

Which burner bit you first?

## Blog version (~800 words)

# Fabric Cost Control: How to Find What's Burning Your CUs

If you run Microsoft Fabric long enough, you'll have this morning: the capacity is red, reports crawl, a refresh got rejected, and nobody changed anything. In a year of community discussion, capacity and cost was among the most-discussed topics. The most common complaint wasn't the price. It was that people **couldn't tell what was spending the money**. This guide fixes that.

## First, understand smoothing
**How Fabric bills:**
- A capacity gives you a fixed number of capacity units (CUs) every second: 2 on an F2, 64 on an F64.
- Fabric smooths usage instead of charging spikes instantly. Interactive work is spread over at least five minutes; background work, like pipelines, notebooks and refreshes, over 24 hours.
- When smoothed usage passes 100%, throttling starts in stages: interactive delay, then interactive rejection, then background rejection.

That's why a heavy 2 AM job can slow your afternoon reports. **Throttled isn't the same as down,** and the cause is usually hours old.

## Step 1: Use Capacity Metrics from the bottom up
1. Open the Capacity Metrics app's Compute page.
2. Ignore the chart at first and sort the item table by CU seconds. Over two weeks, the top three items are usually most of your usage.
3. Expand each one to see its operations: Warehouse Query, Dataflow Gen2 Refresh, Notebook Run, Dataset Query.
4. For a specific spike, drill into the timepoint. You'll see every operation smoothed into that moment and who ran it, including "System".

## Step 2: Go from spike to query
Capacity Metrics can now (generally available as of November 2026) link a warehouse spike to the expensive queries behind it. You can also query the warehouse's own history:

```sql
SELECT TOP 20 login_name, label, COUNT(*) AS runs,
       SUM(allocated_cpu_time_ms)/1000.0 AS cpu_seconds
FROM queryinsights.exec_requests_history
WHERE start_time >= DATEADD(day,-7,GETUTCDATE())
GROUP BY login_name, label
ORDER BY cpu_seconds DESC;
```

Group by `label`, not just by user. One team found a portal feature firing an expensive system query every time someone clicked a table in the warehouse explorer. In the metrics app it showed only as "System".

## Step 3: Check the seven usual suspects
1. **Dataflow Gen2 for plain copying.** Gen2 bills each query's execution time, at a higher rate for the first ten minutes. Many short parallel queries add up. One team measured about 20× the CUs of Gen1. For straight copies, use a Copy job or a pipeline Copy activity.
2. **Warehouse "System" queries.** Check `queryinsights` after big portal updates. If the same queries suddenly cost 2–3× more and you changed nothing, open a ticket with before-and-after numbers.
3. **Idle Spark sessions.** You pay for allocated cores until the session times out. End scheduled notebooks with `notebookutils.session.stop()` and use high-concurrency sessions in pipelines.
4. **Data agents and other previews.** One tester's cache storage ballooned into a bill of about $9,000. Test previews on a separate small capacity and set Azure budget alerts.
5. **Materialized lake views.** Check whether your sources qualify for incremental refresh. Updates and deletes have forced full rebuilds.
6. **New per-user items like Fabric Plan.** Measure a week on a test capacity before rollout.
7. **Monitoring itself.** A 24/7 Eventstream or an Eventhouse per workspace has its own cost. Centralize it.

## Step 4: Add guardrails
- **Surge protection.** Set a background-rejection threshold so runaway jobs are refused before everyone is throttled. The newer workspace-level rules (preview) cap any workspace's share over a rolling 24 hours, and you can exempt mission-critical workspaces.
- **Split interactive and background work** into separate capacities if report users and ETL keep colliding. The 24-hour workspace rule won't stop short interactive bursts.

## Step 5: Choose the right way to pay for overruns
Count the days per month you exceed 100%:
- **0–3 days:** fix the burners and add surge protection.
- **4–10 days:** consider capacity overage, billed at a premium (about 3× per current docs), or split capacities.
- **10+ days:** scale up, or price out the new on-demand billing model Microsoft announced at FabCon. In Microsoft's example, the same workload cost about a fifth of an F64. Test it with your own numbers.

## Make it a weekly habit
Fifteen minutes every week:
- top items
- throttling days
- the queryinsights top 20
- a `session.stop()` audit
- a check on any new preview items
- **export the numbers.** The metrics app keeps only about a month of history, and you'll want a trend the next time finance asks why the bill went up.
