# Wk 10: Microsoft Fabric Pricing Explained: F2 to F64, What You'll Really Pay (2026)

- **Runtime target:** ~20 min
- **Pillar:** 6 — Cost and architecture for decision-makers
- **Target keywords:** microsoft fabric pricing (720/mo, 0.76×, $50 CPC) · fabric f64 (70/mo, $119 CPC) · fabric capacity (390/mo, 0.94×) · fabric trial (90/mo) · microsoft fabric (22,200/mo)
- **Title options:**
  1. Microsoft Fabric Pricing Explained: F2 to F64, What You'll Really Pay (2026)
  2. Fabric Capacity Pricing in 20 Minutes: CUs, SKUs and the F64 Line
  3. How Much Does Microsoft Fabric Cost? Sizing a Real Small Team (2026)
- **Thumbnail:** "F2 → F64?" in big text, a price tag icon, and a capacity gauge needle in the red.
- **Verify before recording:**
  - **Pay-as-you-go prices.** Check the Azure pricing page for your region. Mid-2026 figures for US regions: F2 ≈ $0.36/hr (≈ $263/mo at 730 h); F64 ≈ $11.52/hr (≈ $8,410/mo).
  - **Reservation discount:** about 41% for 1-year at last check. Confirm the current %.
  - **OneLake storage price per GB per month,** and the BCDR (disaster recovery) storage rate.
  - **Power BI Pro and PPU per-user prices.** Pro was raised to $14 and PPU to $24 in April 2025; confirm.
  - **The F64 threshold:** free-license viewers can consume Power BI content in workspaces on F64 and above. Confirm the wording on Microsoft Learn ("Microsoft Fabric licenses").
  - **Trial:** 60 days, capacity equivalent to F64. Confirm length and whether extensions are still offered.
  - **Throttling stages and smoothing windows:**
    - interactive ops smoothed over at least 5 minutes, background over 24 hours;
    - interactive delay after 10 min of future capacity used;
    - interactive rejection after 60 min;
    - background rejection after 24 h.
  - **Surge protection and "autoscale billing for Spark":** status (preview vs GA) and current names.
  - **Mirroring:** free compute for replication, plus free mirroring storage of 1 TB per CU of the SKU. Confirm.
  - **Capacity Metrics app:** check the current name and whether the in-portal capacity reporting has replaced any of it.

## Hook (0:00–0:30)
"Microsoft Fabric pricing looks simple. Pick a size, pay by the hour. Then the bill comes, or worse, your reports slow to a crawl at 9 a.m. and nobody knows why. In the next 20 minutes I'll show you exactly what you pay for: capacity units, storage, and Power BI licenses. I'll show you the one size where licensing changes completely. And I'll size a real small team, start to finish, so you can walk into a budget meeting with a number you can defend."

## Script

### 0:30 — The three things you actually pay for
"Every Fabric bill has three parts. Hold on to these, because everything else in this video hangs off them.

[ON SCREEN: three boxes: 1. Capacity (compute) 2. OneLake storage 3. Power BI licenses]

One: capacity. That's your compute. Every Spark job, every pipeline, every report query burns it.

Two: OneLake storage. The data you keep. That's billed separately, per gigabyte per month.

Three: Power BI licenses. Per person. Whether the people *viewing* reports need one depends on your capacity size. We'll get to that line, because it's the biggest decision in this whole video."

### 1:30 — Capacity units and F-SKUs
"Compute is measured in capacity units, or CUs. The SKU name tells you how many. An F2 has 2 CUs. An F64 has 64. It doubles all the way up.

[ON SCREEN: F2 · F4 · F8 · F16 · F32 · F64 · F128 · F256 · F512 · F1024 · F2048, with the CU count under each]

So F2, F4, F8, F16, F32, F64, then 128, 256, 512, 1024 and 2048.

Price scales linearly. An F4 costs twice an F2. An F64 costs 32 times an F2. There's no volume discount built into the bigger sizes. The discount comes from how you buy, which is next.

At time of recording, pay-as-you-go in US regions is about 36 cents an hour for an F2. Run it all month, that's about 263 dollars. An F64 is about eleven fifty an hour, roughly 8,400 dollars a month. Prices vary by region, so check yours. Link in the description."

### 3:00 — Pay-as-you-go vs reservation
"There are two ways to buy.

[ON SCREEN: split screen. Left: Pay-as-you-go: per second, pause anytime. Right: Reservation: 1 year, ~41% off, always billed]

Pay-as-you-go is billed by the second while the capacity is running. You can pause it, and while it's paused, you don't pay for compute.

A reservation is a one-year commitment. At time of recording it's about 41 percent cheaper. But you pay whether you use it or not. Pausing doesn't save you anything.

So here's the rule of thumb. If your capacity needs to be on most of the day, every day, reserve it. Do the math: a reservation that's 41 percent cheaper beats pay-as-you-go once you'd run it more than about 59 percent of the hours in the month.

[ON SCREEN: Break-even ≈ on 59% of hours → reserve]

If it's a dev capacity you only run during work hours, pay-as-you-go and pause it at night. Eight hours a day, five days a week, is about a quarter of the month. Pay-as-you-go wins easily."

### 4:30 — Pause and resume
"Let me show you pause.

[DEMO: Azure portal → search "Microsoft Fabric" → Fabric capacities → select your capacity → Pause. Then Resume.]

That's it. One button. You can also automate it. An Azure Automation runbook or a Logic App on a schedule works fine.

One catch. If your capacity has borrowed from the future, which I'll explain in a second, pausing settles that debt immediately. You'll see it on the bill as a one-time charge. That's expected, not a bug.

And when it's paused, everything on it is unavailable. Reports, pipelines, notebooks. So don't pause the capacity your CFO's dashboard lives on."

### 5:30 — Bursting and smoothing
"This is the part almost everyone gets wrong, so slow down with me.

Fabric lets a job use more compute than your SKU size for a short time. That's bursting. A Spark job on an F2 can run much faster than 2 CUs would suggest.

[ON SCREEN: a spike chart going well above a dotted "SKU line"]

Then Fabric spreads that usage out over time. That's smoothing. Interactive operations, like someone clicking on a report, are smoothed over at least five minutes. Background operations, like refreshes, pipelines and Spark jobs, are smoothed over 24 hours.

[ON SCREEN: the same spike flattened into a long low band across 24 hours]

Why does that matter? Because it means you size for your *average* load, not your peak. A big nightly job doesn't need a big capacity. It just gets spread across the day.

The flip side: that nightly job is still using up tomorrow's capacity. Which brings us to throttling."

### 7:30 — Throttling: what happens when you go over
"If you keep using more than your capacity provides, you're borrowing from the future. Fabric lets you borrow a little for free. Past that, it starts pushing back, in stages.

[ON SCREEN: a staircase:
- Up to 10 min of future capacity used → no impact
- 10–60 min → interactive delay (reports wait ~20 seconds)
- 60 min–24 h → interactive rejection (reports fail)
- Over 24 h → background rejection (refreshes and jobs fail too)]

Up to ten minutes of future capacity: no impact. Ten minutes to an hour: interactive requests get delayed. People notice reports are slow. One hour to 24 hours: interactive requests get rejected. Reports fail to load. Past 24 hours: background jobs get rejected too.

So the order is: first your users feel it, then your pipelines break.

How do you get out? Three ways. Wait, and it burns down. Scale up the SKU for a while. Or pause and resume, which clears the debt but charges you for it, like we said."

### 9:00 — The Capacity Metrics app
"You can't manage what you can't see. Install the Fabric Capacity Metrics app.

[DEMO: Fabric → Apps → Get apps → search "Microsoft Fabric Capacity Metrics" → Install → connect with your capacity ID (from Admin portal → Capacity settings → select capacity → copy ID).]

Three things to look at.

[DEMO: Compute page → CU % over time chart]

One: the CU percentage over time. If your smoothed line sits near 100 percent, you're undersized.

[DEMO: Throttling tab]

Two: throttling. Any red here means users felt it.

[DEMO: Items table, sorted by CU(s) descending]

Three: the items table. Sort by CU seconds. Nine times out of ten, one item is eating most of your capacity. Usually a refresh or a dataflow. Fix that one thing before you buy a bigger SKU."

### 10:30 — OneLake storage
"Storage is the second line on the bill. OneLake is billed per gigabyte per month, separate from capacity. It's priced like Azure Data Lake storage. Check the current rate for your region.

[ON SCREEN: OneLake storage: billed per GB/month · Shortcuts: no copy, no OneLake storage · Mirroring: free storage up to a limit per CU]

Two things keep it down.

Shortcuts. A shortcut points at data that already lives in ADLS, S3 or Google Cloud Storage. Fabric reads it in place. You don't store a second copy in OneLake. You still pay the other cloud for storage and any egress.

And mirroring. At time of recording, mirrored data gets free storage up to a limit tied to your capacity size, one terabyte per CU. So an F64 covers 64 terabytes of mirrored data. Check that on the pricing page, but it's a real saving.

One more: deleted data and old Delta versions still take space until they're cleaned up. Run VACUUM on your big lakehouse tables."

### 11:30 — Power BI licensing and the F64 line
"Now the big one.

Anyone who *creates* or *publishes* Power BI content needs a Pro or Premium Per User license. That's true on every capacity size.

The question is the *viewers*. The people who just open the report.

[ON SCREEN: a line drawn at F64.
Below F64 (F2–F32): every viewer needs Pro.
F64 and above: viewers with a free license can view.]

Below F64, every viewer needs a Pro license. At F64 and above, viewers with a free license can view reports in workspaces on that capacity.

So do the math. At time of recording, Pro is about 14 dollars per user per month in the US. If you have 400 report viewers, that's about 5,600 dollars a month in Pro licenses. An F64 reservation is in the same ballpark. Past a few hundred viewers, F64 often costs less overall than a small capacity plus Pro for everyone.

[ON SCREEN: viewers × Pro price vs F64 price, with a crossover point]

Under about a hundred viewers, it's almost never worth it on licensing alone. In between, run your own numbers. That's why the F64 search term has the highest ad price in this whole niche. It's a real budget decision."

### 13:00 — The trial
"If you haven't started yet, use the trial. It gives you a capacity equivalent to an F64 for 60 days.

[DEMO: app.fabric.microsoft.com → account manager (top right) → Start trial]

Use those 60 days to measure, not just to play. Build your real pipelines and real reports on it. Then open the Capacity Metrics app and see how many CUs you actually burn. That's how you pick a SKU based on data instead of guessing."

### 14:00 — Worked example: sizing a small team
"Let's size a real one.

[ON SCREEN: The team:
- 3 data engineers
- 2 Power BI developers
- 60 report viewers
- Nightly load: ~20 GB from Azure SQL plus a few CSV feeds
- 15 reports, refreshed hourly during business hours]

Step one. Ingestion. Azure SQL is a source we can mirror. Mirroring compute is free and the storage is within the free allowance. So that part costs almost nothing in CUs.

Step two. Transformation. A nightly Spark notebook builds silver and gold tables from the mirrored data and the CSVs. That's background work, smoothed over 24 hours. [RECORDING NOTE: run this on the trial first and say the real number from the Metrics app here, e.g. "it averaged X percent of an F8".] Your numbers will differ; this is why you measure.

Step three. Reports. Fifteen Direct Lake reports. Direct Lake reads Delta tables directly, so there's no import refresh burning CUs every hour. That's a big saving over hourly import refreshes.

Step four. Pick the SKU. Say the smoothed average sits around 50 to 60 percent of an F8, with business-hours peaks. [RECORDING NOTE: replace with your measured figure.] So F8, with room to grow. If the average were over about 80 percent, I'd go to F16.

Step five. Licenses. 60 viewers is way under the F64 line. So everyone who opens a report needs Pro. That's 65 Pro licenses: 60 viewers, 3 engineers, 2 developers. Some of them may already have Pro through Microsoft 365 E5. Check that before you buy.

[ON SCREEN: Total = F8 (reserve if on 24/7, or pay-as-you-go + pause) + OneLake storage + 65 × Pro]

Step six. Buy. This capacity runs pipelines overnight and reports all day. It's on most of the month, so reserve it. If you also want a dev capacity, make that a pay-as-you-go F2 and pause it at night.

Plug in the current prices from the description and you've got a defensible number."

### 17:30 — Five ways to cut your bill
"Quick list before we wrap.

[ON SCREEN: numbered as I say them]

One. Fix the top item in the Metrics app before you scale up.
Two. Separate dev and prod capacities. Pause dev.
Three. Use Direct Lake instead of frequent import refreshes where it fits.
Four. Use shortcuts and mirroring instead of copying data.
Five. For small data, use a Python notebook instead of a Spark notebook. A single node is cheaper than spinning up a Spark cluster for a 50-megabyte file."

### 18:30 — Recap
"So. You pay for three things: capacity, storage, and licenses. Capacity is measured in CUs; size for your smoothed average, not your peak. Throttling hits users first, then jobs. Reserve if it's on most of the month; pay-as-you-go and pause if it isn't. And the F64 line decides whether viewers need Pro.

Next, I'm comparing pipelines, dataflows, notebooks and mirroring, including which one burns the most CUs for the same job. That's here. See you there."

## Chapters
0:00 What Fabric really costs
0:30 The three things you pay for
1:30 Capacity units and F-SKUs (F2 to F2048)
3:00 Pay-as-you-go vs reservation
4:30 Pause and resume
5:30 Bursting and smoothing
7:30 Throttling: what happens when you go over
9:00 The Capacity Metrics app
10:30 OneLake storage costs
11:30 Power BI licensing and the F64 line
13:00 The 60-day trial
14:00 Worked example: sizing a small team
17:30 Five ways to cut your bill
18:30 Recap

## Description + tags
Microsoft Fabric pricing explained for 2026: capacity units, F-SKUs from F2 to F64 and up, pay-as-you-go vs reservations, and the F64 Power BI licensing line.
I size a real small team step by step, so you can pick a Fabric capacity based on data, not guesses.

Covered: CUs, bursting and smoothing, throttling stages, pause/resume, OneLake storage, shortcuts and mirroring costs, Power BI Pro vs free viewers, the 60-day trial, and the Capacity Metrics app.

Prices quoted are approximate US-region pay-as-you-go at time of recording. Check current pricing: [link to Azure Fabric pricing page]

Tags: microsoft fabric pricing, fabric capacity, fabric f64, fabric f2, fabric sku, capacity units, fabric trial, power bi pro license, power bi premium, fabric capacity metrics app, fabric throttling, onelake storage cost, microsoft fabric 2026

## Shorts cutdowns

**Short 1: "The F64 line" (≈40s)**
[ON SCREEN: "Do your report viewers need Power BI Pro?"]
"Do your report viewers need a Power BI Pro license? It depends on one number. Below an F64 capacity, yes. Every single person who opens a report needs Pro. At F64 and above, viewers with a free license can open reports in that capacity. So if you have a few hundred viewers, Pro for everyone can cost as much as the F64 itself. Under about a hundred viewers, stay small and buy Pro. In between, do the math. Full breakdown on my channel."
[ON SCREEN: "< F64: viewers need Pro · ≥ F64: free viewers OK"]

**Short 2: "Why your reports are slow at 9 a.m." (≈40s)**
[ON SCREEN: "Reports slow every morning?"]
"Fabric reports slow every morning? You might be throttled. Fabric lets you borrow compute from the future. Big overnight jobs borrow a lot. Go more than ten minutes over, and reports get delayed. Over an hour, they get rejected. Over a day, your pipelines fail too. Open the Capacity Metrics app, sort items by CU seconds, and fix the top one. It's usually one refresh."
[ON SCREEN: "10 min → delay · 1 h → reject reports · 24 h → reject jobs"]

**Short 3: "Reserve or pay-as-you-go?" (≈30s)**
[ON SCREEN: "Reserve or pay as you go?"]
"Fabric reservation or pay-as-you-go? A one-year reservation is about 41 percent cheaper at time of recording. But you pay even when it's paused. So if your capacity runs more than about 60 percent of the hours in a month, reserve it. If it's a dev capacity that runs office hours, pay as you go and pause it at night."
[ON SCREEN: "On > ~60% of hours → reserve"]

## LinkedIn post
[Diagram: a horizontal bar from F2 to F2048 with a red line at F64. Left: "Viewers need Pro". Right: "Free viewers OK".]

Most Fabric pricing debates are the wrong debate.

Teams argue about F8 vs F16. The bigger number on the bill is usually licenses.

Below F64, every report viewer needs Power BI Pro. At F64 and above, free-license viewers can open reports on that capacity.

So the real sizing question isn't "how much compute do we need?" It's "how many people read our reports?"

My rule:
→ Under ~100 viewers: stay small, buy Pro.
→ A few hundred or more: price an F64 reservation against Pro for everyone.
→ Either way: run the 60-day trial, install the Capacity Metrics app, and size from your smoothed average, not your peak.

Measure first. Then buy.

Full walkthrough with a worked example in my latest video.
