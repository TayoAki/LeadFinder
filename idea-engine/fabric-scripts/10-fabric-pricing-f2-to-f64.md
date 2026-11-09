# Wk 10: Microsoft Fabric Pricing Explained: F2 to F64, On-Demand, and What You'll Really Pay (2026)

- **Runtime target:** ~23 min
- **Pillar:** 6 — Cost and architecture for decision-makers
- **Target keywords:** microsoft fabric pricing (720/mo, 0.76×, $50 CPC) · fabric f64 (70/mo, $119 CPC) · fabric capacity (390/mo, 0.94×) · fabric trial (90/mo) · microsoft fabric (22,200/mo)
- **Title options:**
  1. Microsoft Fabric Pricing Explained: F2 to F64, What You'll Really Pay (2026)
  2. Fabric Capacity vs On-Demand: Which Should You Pick? (2026 Pricing Guide)
  3. How Much Does Microsoft Fabric Cost? F8 → F16 or PPU, Worked Out
- **Thumbnail:** "F64 or ON-DEMAND?" in big text, a price tag icon, and a capacity gauge needle in the red.
- **Verify before recording:**
  - **Pay-as-you-go prices.** Check the Azure pricing page for your region. Mid-2026 figures for US regions:
    - F2 ≈ $0.36/hr (≈ $263/mo at 730 h)
    - F8 ≈ $1.44/hr (≈ $1,051/mo)
    - F64 ≈ $11.52/hr (≈ $8,410/mo)
  - **Reservation discount:** about 41% for 1-year at last check. Confirm the current %.
  - **On-demand (pay-per-use) billing,** announced at FabCon Barcelona, Sep 2026, per r/MicrosoftFabric. Confirm on Microsoft's own pages (Fabric blog, pricing page, Learn):
    - GA or preview, and which regions;
    - the unit and price;
    - which workloads it covers;
    - whether it can be mixed with capacities;
    - whether F64-style free-viewer Power BI licensing applies (likely not; confirm);
    - Microsoft's quoted example: $3,533 on an F64 vs $759 on-demand for the same workload. Use their exact wording and the workload they described.
  - **Capacity overage billing:** reported in the community as overages charged at 3× the normal CU rate. Confirm:
    - the multiplier;
    - opt-in vs default;
    - any cap;
    - how it shows on the Azure bill.
  - **OneLake billing change from Oct 1, 2026:** OneLake transactions from Spark's system-initiated calls are now billed (reported as previously underreported). Confirm on the Fabric blog / Learn "OneLake consumption" page, including which operations count.
  - **"Find expensive queries" in the Capacity Metrics app is GA** (reported). Confirm its name and location in the app.
  - **The Metrics app keeps 30 days of history** (the top community complaint). Confirm, and check whether an export option (e.g., to a lakehouse / workspace monitoring) exists for longer trends.
  - **OneLake storage price per GB per month,** and the BCDR (disaster recovery) storage rate.
  - **Power BI Pro and PPU per-user prices.** Pro was raised to $14 and PPU to $24 in April 2025; confirm.
  - **The F64 threshold:** free-license viewers can consume Power BI content in workspaces on F64 and above. Confirm the wording on Microsoft Learn ("Microsoft Fabric licenses").
  - **Trial:** 60 days, capacity equivalent to F64. Confirm length and whether extensions are still offered.
  - **Throttling stages and smoothing windows:**
    - interactive ops smoothed over at least 5 minutes, background over 24 hours;
    - interactive delay after 10 min of future capacity used;
    - interactive rejection after 60 min;
    - background rejection after 24 h.
  - **New CU-consuming items:**
    - Fabric Apps (codename "Rayfin" in community threads) and Fabric Plan: confirm official names and status, and how they bill.
    - The community report of about 100K CU-seconds/day while authoring a Plan is anecdotal; say so.
    - Data agent cost: anecdotal reports of high CU use when testing agents across many sources. Confirm how data agent usage is billed (capacity CUs, which operation names).
  - **Surge protection and "autoscale billing for Spark":** status (preview vs GA) and current names.
  - **Mirroring:** free compute for replication, plus free mirroring storage of 1 TB per CU of the SKU. Confirm.
  - **The r/MicrosoftFabric F8→F16 vs PPU thread** (break-even ≈ 93 users): re-read it for its exact assumptions before citing it. Don't name the poster.

## Hook (0:00–0:30)
"Microsoft Fabric pricing just changed. There's now an on-demand option, and Microsoft's own example showed the same workload costing about 3,500 dollars on an F64 capacity and about 760 on-demand. So which one is right for you? In the next 20 minutes I'll show you exactly what you pay for, when capacity beats on-demand, what overages and throttling really cost, and I'll work through a real decision from the community: upgrade from F8 to F16, or move users to Premium Per User. You'll leave with a number you can defend."

## Script

### 0:30 — The three things you actually pay for
"Every Fabric bill has three parts. Hold on to these, because everything else in this video hangs off them.

[ON SCREEN: three boxes: 1. Compute (capacity or on-demand) 2. OneLake storage and transactions 3. Power BI licenses]

One: compute. Every Spark job, every pipeline, every report query burns it. Until recently that always meant a capacity. Now there's also on-demand, and we'll compare them.

Two: OneLake. The data you keep, billed per gigabyte per month, plus some transaction costs that just changed.

Three: Power BI licenses. Per person. Whether the people *viewing* reports need one depends on your capacity size. That line is one of the biggest decisions in this video."

### 1:30 — Capacity units and F-SKUs
"Compute is measured in capacity units, or CUs. The SKU name tells you how many. An F2 has 2 CUs. An F64 has 64. It doubles all the way up.

[ON SCREEN: F2 · F4 · F8 · F16 · F32 · F64 · F128 · F256 · F512 · F1024 · F2048, with the CU count under each]

So F2, F4, F8, F16, F32, F64, then 128, 256, 512, 1024 and 2048.

Price scales linearly. An F4 costs twice an F2. Going up one size always doubles the price. There's no volume discount built into the bigger sizes.

At time of recording, pay-as-you-go in US regions is about 36 cents an hour for an F2. Run it all month, that's about 263 dollars. An F8 is about 1,050 a month. An F64 is about eleven fifty an hour, roughly 8,400 a month. Prices vary by region, so check yours. Link in the description."

### 3:00 — Pay-as-you-go vs reservation
"There are two ways to buy a capacity.

[ON SCREEN: split screen. Left: Pay-as-you-go: per second, pause anytime. Right: Reservation: 1 year, ~41% off, always billed]

Pay-as-you-go is billed by the second while the capacity is running. Pause it and you stop paying for compute.

A reservation is a one-year commitment. At time of recording it's about 41 percent cheaper. But you pay whether you use it or not.

Rule of thumb: if the capacity is on more than about 59 percent of the hours in a month, reserve it.

[ON SCREEN: Break-even ≈ on 59% of hours → reserve]

A dev capacity you only run during work hours is about a quarter of the month. Pay-as-you-go and pause it."

### 4:30 — Pause and resume
"Pausing is one button.

[DEMO: Azure portal → search "Microsoft Fabric" → Fabric capacities → select your capacity → Pause. Then Resume.]

You can automate it with an Azure Automation runbook or a Logic App on a schedule.

One catch. If your capacity has borrowed from the future, which I'll explain next, pausing settles that debt immediately. You'll see it as a one-time charge. And while it's paused, everything on it is unavailable, so don't pause the capacity your CFO's dashboard lives on."

### 5:30 — Bursting and smoothing
"This is the part almost everyone gets wrong, so slow down with me.

Fabric lets a job use more compute than your SKU size for a short time. That's bursting.

[ON SCREEN: a spike chart going well above a dotted "SKU line"]

Then Fabric spreads that usage out. That's smoothing. Interactive operations, like report clicks, are smoothed over at least five minutes. Background operations, like refreshes, pipelines and Spark jobs, are smoothed over 24 hours.

[ON SCREEN: the same spike flattened into a long low band across 24 hours]

So on a capacity, you size for your *average* load, not your peak. The flip side: a big nightly job is using up tomorrow's capacity. Which brings us to throttling."

### 7:30 — Throttling: what happens when you go over
"Keep using more than your capacity provides and you're borrowing from the future. Fabric lets you borrow a little for free. Past that, it pushes back, in stages.

[ON SCREEN: a staircase:
- Up to 10 min of future capacity used → no impact
- 10–60 min → interactive delay
- 60 min–24 h → interactive rejection (reports fail)
- Over 24 h → background rejection (refreshes and jobs fail too)]

First your users feel it, then your pipelines break.

Until recently you had three ways out: wait for it to burn down, scale up the SKU, or pause and resume and pay off the debt. Now there's a fourth."

### 9:00 — Overage billing: pay 3×, get throttled, or double your SKU
"Fabric now has a capacity overage option. Instead of throttling you, it lets you run over and bills the extra. At time of recording, the community reports overages are charged at three times the normal CU rate. Check the current multiplier, link below.

Three times sounds terrible. But compare it to the alternatives.

[ON SCREEN: three options for a spike:
1. Get throttled → free, but reports fail
2. Overage → extra CUs at ~3× rate
3. Next SKU up → 2× the whole bill, every hour]

Going up one SKU doubles your whole bill, every hour, whether you need it or not. Overage only charges you for the extra.

Here's the break-even. If the extra usage over a month is less than about a third of what your capacity provides in that month, overage is cheaper than going up a size. Paying three times for something smaller than a third still costs less than paying for a whole second capacity.

[ON SCREEN: Overage cheaper if extra CU usage < ~⅓ of your capacity's monthly CUs (at 3×)]

So: occasional month-end spikes, use overage. Over a third of your capacity, every month, it's time for the next size, or for on-demand. Which is next."

### 10:00 — Capacity vs on-demand: which should you pick?
"In September 2026, at FabCon in Barcelona, Microsoft announced an on-demand, pay-per-use billing model. Instead of renting a fixed size, you pay for what you actually consume.

Microsoft's own example: a workload that cost about 3,533 dollars on an F64 capacity cost about 759 dollars on-demand.

[ON SCREEN: Microsoft example: F64 capacity ≈ $3,533 vs on-demand ≈ $759 · same workload]

When that was posted, the reaction on the Fabric subreddit was pretty blunt. A lot of people read it as Microsoft admitting that capacities overcharge spiky workloads. And that's the key word: spiky.

Here's how to think about it.

[ON SCREEN: two charts. Left: flat usage near the SKU line → capacity. Right: tall spikes, mostly idle → on-demand]

A capacity is a fixed rent. You pay for every CU, every hour, used or not. If your usage is steady and high, you use most of what you pay for. With a reservation discount on top, a capacity is hard to beat.

On-demand is a meter. You pay only for what runs. If your workload is spiky, a big load once a day and quiet the rest of the time, most of a capacity sits idle. That idle time is what you stop paying for.

So the question is utilization. Open the Capacity Metrics app and look at your smoothed CU percentage over a month.

[ON SCREEN: decision rule:
- High and steady (most hours near the SKU line) → capacity, probably reserved
- Low average with spikes → price on-demand
- In between → run both prices on your real usage]

[RECORDING NOTE: once on-demand pricing is published, add the actual break-even utilization here, e.g. "below about X percent average utilization, on-demand wins." Don't guess it.]

Two things to check before you switch. First, licensing. The F64 rule that lets free users view reports is a capacity feature. Check whether it applies to on-demand at all. If you have hundreds of viewers, that alone can decide it. Second, predictability. A capacity is a fixed bill your finance team can plan around. A meter isn't. Some teams will happily pay more for a number that doesn't move."

### 12:30 — The Capacity Metrics app (and its 30-day problem)
"You can't make any of these decisions without data. Install the Fabric Capacity Metrics app.

[DEMO: Fabric → Apps → Get apps → search "Microsoft Fabric Capacity Metrics" → Install → connect with your capacity ID (Admin portal → Capacity settings → select capacity → copy ID).]

Four things to look at.

[DEMO: Compute page → CU % over time chart]

One: CU percentage over time. Near 100 percent smoothed, you're undersized. Low with spikes, look at on-demand.

[DEMO: Throttling tab]

Two: throttling. Any red here means users felt it.

[DEMO: Items table sorted by CU(s) descending]

Three: the items table, sorted by CU seconds. Usually one item is eating most of your capacity.

[DEMO: the "Find expensive queries" view]

Four: 'Find expensive queries', now generally available. It takes you from 'this semantic model is expensive' to 'this query is the problem'. That's where the real fixes are.

Now the catch, and it's the top complaint about this app: it only keeps about 30 days. So you can't trend month over month, which is exactly what you need for a reservation or on-demand decision.

[ON SCREEN: "Metrics app: ~30 days only → export monthly"]

Workaround: export or snapshot the numbers every month. Even a screenshot of the monthly CU chart into a shared folder beats nothing. If your tenant has a way to land this data in a lakehouse, use it."

### 14:00 — OneLake: storage, and a billing change from October 2026
"Second line on the bill: OneLake. Storage is billed per gigabyte per month, separate from compute, priced like Azure Data Lake storage.

There's also a change you need to know about. From October 1st, 2026, OneLake consumption from Spark's system-initiated calls is billed. Those are calls Spark makes on its own, not lines of code you wrote. The community's read is that this usage used to be underreported. So if your Spark-heavy workspaces show higher OneLake costs from October, that's probably why. Check the official note, link below.

[ON SCREEN: From Oct 1, 2026: Spark system-initiated OneLake calls are billed]

What keeps OneLake costs down:

Shortcuts. Point at data in ADLS, S3 or Google Cloud Storage instead of copying it.

Mirroring. Replication compute is free, and mirrored storage is free up to a limit tied to your capacity size, one terabyte per CU at time of recording.

And cleanup. Old Delta versions take space until you VACUUM them. Small files make Spark do more calls, so OPTIMIZE your big tables."

### 15:00 — Power BI licensing and the F64 line
"Now licensing.

Anyone who *creates* or *publishes* Power BI content needs Pro or Premium Per User, on any capacity size.

The question is the *viewers*.

[ON SCREEN: a line drawn at F64.
Below F64 (F2–F32): every viewer needs Pro.
F64 and above: viewers with a free license can view.]

Below F64, every viewer needs Pro. At F64 and above, free-license viewers can view reports on that capacity.

At time of recording, Pro is about 14 dollars per user per month in the US. 400 viewers is about 5,600 dollars a month in Pro, the same ballpark as an F64 reservation. Under about a hundred viewers, F64 is almost never worth it on licensing alone. That's why 'F64' has the highest ad price in this whole niche. It's a real budget decision."

### 16:30 — The trial
"If you haven't started yet, the trial gives you an F64-equivalent capacity for 60 days.

[DEMO: app.fabric.microsoft.com → account manager (top right) → Start trial]

Use it to measure. Build your real pipelines and reports on it, then read the Metrics app. And export those numbers before the 30 days roll off."

### 17:00 — New things that burn CUs
"Three newer items to watch, because people are getting surprised by them.

[ON SCREEN: Fabric Apps · Fabric Plan · Data agents]

Fabric Apps and Fabric Plan both run on your capacity. One user on the Fabric subreddit reported about 100,000 CU-seconds a day just authoring a Plan. That's one person's report, not a benchmark, but it shows that building things costs CUs too, not just running them.

And data agents. Another user described burning through a lot of capacity while testing agents connected to many data sources at once. Every question an agent answers can fan out into queries across every source it's connected to.

So the advice is the same for all three. Try new items on a separate dev capacity or on-demand, not on the capacity your production reports share. Then check the items table in the Metrics app before you roll them out."

### 18:30 — Worked example: upgrade F8 to F16, or move users to PPU?
"Let's do a real one. This came up on the Fabric subreddit: a team on an F8 is running hot. Should they upgrade to an F16, or move their Power BI users to Premium Per User?

[ON SCREEN: The situation:
- F8 capacity, smoothed CU often near 100%
- Power BI semantic models are a big share of CU use
- Viewers already have Pro (required below F64)]

Option A: upgrade to F16. Going up one size doubles the price. So the extra cost is one more F8. About 1,050 dollars a month pay-as-you-go at time of recording, or less if reserved.

Option B: move the Power BI workloads to PPU workspaces. Those semantic models stop using the F8's CUs. But everyone who uses that content needs PPU instead of Pro. They already pay for Pro, so the extra cost is the difference: about 24 minus 14, 10 dollars per user per month.

[ON SCREEN: Break-even users = (F16 − F8 monthly cost) ÷ (PPU − Pro per user)]

So the break-even is the extra cost of the F16 divided by 10 dollars. At pay-as-you-go prices, that's about 105 users. With a reservation it's lower. The thread worked it out at about 93 users with their own prices.

[ON SCREEN: ≈ 93–105 users · fewer users → PPU · more users → F16]

Fewer users than that, PPU is cheaper. More, upgrade the capacity.

Three things the simple math misses. One: PPU only takes the Power BI load off the capacity. If it's actually Spark or pipelines running hot, PPU doesn't help. Check the items table first. Two: managing two places, PPU workspaces and a capacity, is more admin. Three: now there's a third option. If the load is spiky, price the F8 plus overage, or on-demand, before you double anything.

[RECORDING NOTE: re-read the thread for its exact assumptions and say them. Don't name the poster.]"

### 21:30 — Five ways to cut your bill
"Quick list before we wrap.

[ON SCREEN: numbered as I say them]

One. Use 'Find expensive queries' and fix the top item before you scale up.
Two. Separate dev and prod. Pause dev, or put it on-demand.
Three. Use Direct Lake instead of frequent import refreshes where it fits.
Four. Use shortcuts and mirroring instead of copying data.
Five. For small data, use a Python notebook instead of Spark."

### 22:30 — Recap
"So. You pay for compute, OneLake and licenses. On a capacity, size for your smoothed average; reserve it if it's on most of the month. Steady load, capacity. Spiky load, price on-demand. Occasional spikes, overage at three times can still beat doubling your SKU. Watch the October OneLake change, export your Metrics data before 30 days roll off, and keep the F64 line in mind for viewers.

Next, I'm comparing pipelines, dataflows, notebooks and mirroring, including which one burns the most CUs for the same job. That's here."

## Chapters
0:00 Fabric pricing changed: capacity vs on-demand
0:30 The three things you pay for
1:30 Capacity units and F-SKUs (F2 to F2048)
3:00 Pay-as-you-go vs reservation
4:30 Pause and resume
5:30 Bursting and smoothing
7:30 Throttling: what happens when you go over
9:00 Overage billing: 3× vs throttling vs next SKU
10:00 Capacity vs on-demand: which should you pick?
12:30 Capacity Metrics app + "Find expensive queries" + the 30-day limit
14:00 OneLake costs and the Oct 2026 Spark billing change
15:00 Power BI licensing and the F64 line
16:30 The 60-day trial
17:00 New things that burn CUs: Apps, Plan, data agents
18:30 Worked example: F8 → F16 or move users to PPU?
21:30 Five ways to cut your bill
22:30 Recap

## Description + tags
Microsoft Fabric pricing explained for 2026: F-SKUs from F2 to F64, the new on-demand billing model, overage billing, reservations, and the F64 Power BI licensing line.
Plus a real worked example: upgrade an F8 to F16, or move users to Premium Per User?

Covered: capacity units, bursting and smoothing, throttling, overage at ~3×, capacity vs on-demand, the Capacity Metrics app ("Find expensive queries" and the 30-day limit), the Oct 2026 OneLake billing change for Spark, Fabric Apps, Plan and data agent costs, and the 60-day trial.

Prices quoted are approximate US-region figures at time of recording. Check current pricing: [link to Azure Fabric pricing page] · On-demand announcement: [link] · OneLake consumption: [link]

Tags: microsoft fabric pricing, fabric capacity, fabric on demand, fabric pay as you go, fabric f64, fabric f8, fabric sku, capacity units, fabric overage, fabric trial, power bi ppu, power bi pro license, fabric capacity metrics app, onelake cost, microsoft fabric 2026

## Shorts cutdowns

**Short 1: "Capacity or on-demand?" (≈40s)**
[ON SCREEN: "Fabric: capacity or on-demand?"]
"Microsoft's own example: same workload, about 3,500 dollars on an F64 capacity, about 760 on-demand. So is a capacity a ripoff? Not always. A capacity is rent. You pay every hour, used or not. On-demand is a meter. If your usage is steady and high, the rent wins, especially reserved. If it's spiky and idle most of the day, the meter wins. Open the Capacity Metrics app, look at your average, and price both."
[ON SCREEN: "Steady → capacity · Spiky → on-demand"]

**Short 2: "The F64 line" (≈40s)**
[ON SCREEN: "Do your report viewers need Power BI Pro?"]
"Do your report viewers need a Power BI Pro license? It depends on one number. Below an F64 capacity, yes. Every single person who opens a report needs Pro. At F64 and above, viewers with a free license can open reports on that capacity. A few hundred viewers on Pro can cost as much as the F64 itself. Under about a hundred, stay small and buy Pro."
[ON SCREEN: "< F64: viewers need Pro · ≥ F64: free viewers OK"]

**Short 3: "F8 to F16, or PPU?" (≈40s)**
[ON SCREEN: "F8 maxed out. Upgrade or PPU?"]
"Your F8 is maxed out. Upgrade to F16, or move your Power BI users to Premium Per User? Upgrading doubles the bill: one extra F8. PPU costs about 10 dollars more per user than Pro. Divide one by the other. Around 100 users is the break-even. Fewer, PPU. More, F16. But check first: if Spark is the thing running hot, PPU won't help at all."
[ON SCREEN: "Break-even = extra F8 cost ÷ $10/user"]

## LinkedIn post
[Diagram: two usage charts side by side. Left: a flat line near the SKU limit, labelled "Capacity". Right: tall spikes over a mostly empty chart, labelled "On-demand". Between them: Microsoft's example, "$3,533 vs $759, same workload".]

Fabric's new on-demand billing isn't a discount. It's a question about your usage shape.

A capacity is rent: you pay every hour, used or not. On-demand is a meter.

Microsoft's own example showed one workload at ~$3,533 on an F64 and ~$759 on-demand. That gap is idle time.

How I'd decide:
→ Steady, high utilization: capacity, reserved.
→ Spiky, mostly idle: price on-demand.
→ Occasional spikes: overage (~3× rate) can still beat doubling your SKU.

But get the data first. The Capacity Metrics app keeps ~30 days, so export it monthly or you'll be guessing.

Full breakdown, including F8→F16 vs PPU, in my latest video.
