# Wk 9: From Power BI Developer to Fabric Engineer: The 90-Day Roadmap (2026)

- **Runtime target:** ~20 minutes
- **Pillar:** 5, Power BI → Fabric bridge
- **Target keywords:** power bi (368,000/mo, the feeder audience), data engineer roadmap (880, 0.92×), microsoft fabric certification (880), dp-600 (1,000), dp-700 (1,000), power bi semantic model (1,600, **1.57×**, $34 CPC). Proven on YouTube: "Fabric for Power BI developers" (214K) and "From Power BI to Microsoft Fabric: ultimate transition guide" (73K) on a 42.8K-sub channel.
- **Title options:**
  1. How I Would Go From Power BI Developer to Fabric Engineer in 90 Days (2026)
  2. Power BI to Microsoft Fabric: The Complete Roadmap (Skills, Certs, Projects)
  3. Power BI Developers: Learn THESE 5 Skills to Become a Fabric Engineer
- **Thumbnail:** Power BI logo → arrow → Fabric logo; text "90 DAYS". Host in the foreground.
- **Verify before recording:**
  - Exam details:
    - DP-600 = Fabric Analytics Engineer Associate.
    - DP-700 = Fabric Data Engineer Associate.
    - DP-800: confirm the title and audience before mentioning it.
    - PL-300 is still the Power BI Data Analyst exam.
  - Whether Microsoft is running a free voucher campaign (e.g. Fabric Data Days / AI Skills Fest) on the recording date.
  - Fabric trial length and availability.
  - "Copy job" feature name and GA status. The community story in 3:10 credits copy jobs.
  - Python (non-Spark) notebooks GA status.
  - Don't quote salary numbers unless you cite a current source on screen.

---

## Hook (0:00–0:30)
"If you've built Power BI reports for a few years, you already have most of what it takes to become a Fabric engineer. You're missing about five skills. In this video I'll show you exactly which five, the order to learn them in, and a 90-day plan that ends with a portfolio project and two certifications. It's the same path people in the Fabric community are taking right now. Some of them had to learn it fast."

---

## Script

### 0:30 The story that made me make this video
[ON SCREEN: paraphrased post, no username, community logo blurred]

"Earlier this year, someone posted in the Microsoft Fabric community. I'll paraphrase. They'd been a Power BI developer, applied for a role, and said they knew Fabric. They didn't, really. They got the job. Now they had to deliver, and the post was basically: 'Help. Where do I start?'

The replies were kind, and they were practical. The common advice was this: you know more than you think, here's what you're missing, learn it in this order. That's this video. Whether you're in that spot or planning ahead, here's the roadmap."

### 1:30 What you already have
[ON SCREEN: checklist, green ticks]

"Let's start with what transfers, because it's a lot.

- **Power Query.** Dataflow Gen2 in Fabric *is* Power Query. Same editor, same M language. You can build ingestion on day one.
- **Data modeling.** Star schemas, relationships, facts and dimensions. That's exactly how you design the gold layer in Fabric.
- **DAX and semantic models.** Fabric semantic models are Power BI semantic models. Direct Lake is just a new storage mode for something you already know.
- **The business side.** You know what the numbers mean and what people actually ask for. Plenty of engineers never learn that.
- **The service.** Workspaces, capacities, sharing, refresh, gateways. Fabric runs on the same service.

Most Power BI developers I talk to are 40 to 50% of the way there before they open a notebook."

### 3:10 Proof it's closer than you think
[ON SCREEN: paraphrased post title: "I was wrong about Fabric"]

"Another community post stuck with me. Someone with more than eight years in Power BI had been skeptical of Fabric. Their post was titled, roughly, 'I was wrong about Fabric.' They moved an existing model and its data pipeline over in about eight hours, using copy jobs to bring the data in. Copy jobs are the simple 'copy this, keep it updated' feature in Fabric.

That's one person's experience, not a promise. But it shows the gap is skills you can learn in weeks, not years."

### 4:00 The five gaps
[ON SCREEN: five numbered cards]

"Here's what you're missing, in the order I'd learn it.

**One: SQL beyond SELECT.** Joins, CTEs, window functions, MERGE, creating tables and views. The Fabric warehouse is T-SQL. The lakehouse has a SQL endpoint. Spark has Spark SQL. Everything runs on SQL. If you only do one thing this month, do this.

**Two: the lakehouse and Delta tables.** Files versus tables. What a Delta table is: Parquet files plus a transaction log, which gives you updates, merges and time travel. The medallion pattern: bronze for raw, silver for cleaned, gold for business-ready. Searches for 'medallion architecture' are up about 30% in a year, so employers are asking about it.

**Three: pipelines and orchestration.** Data pipelines schedule and chain things together: copy this, then run that notebook, then refresh the model. You'll also need incremental loads, meaning only bringing in what changed.

**Four: PySpark, just enough.** You don't need to become a Spark expert. You need to read a file, clean it, deduplicate it, merge it into a Delta table, and write it out. About twenty functions cover most of the work.

**Five: Git and deployment.** Workspaces connected to Git, branches, deployment pipelines from dev to test to prod. This is the one Power BI developers skip most often, and it's the one that makes you look like an engineer in an interview."

### 7:30 The 90-day plan
[ON SCREEN: three-phase timeline]

"Here's how I'd schedule it. Assume five to seven hours a week.

**Days 1–30: foundations, and DP-600.**
- Weeks 1–2: SQL. Window functions, CTEs, MERGE. Practice in a Fabric warehouse with the free trial.
- Week 3: lakehouse basics. Upload files, load them to Delta tables, query them from the SQL endpoint. Build a Direct Lake semantic model on top.
- Week 4: Dataflow Gen2 into a lakehouse, and a pipeline that runs it on a schedule.
- Book DP-600 for around day 40. DP-600 is the Fabric Analytics Engineer exam, and it's built for people like you: modeling, semantic models, SQL, some Spark. It's the natural first step.

**Days 31–60: engineering skills.**
- Weeks 5–6: PySpark. Read, clean, dedupe, merge. Learn the MERGE pattern until you can write it from memory.
- Week 7: incremental loads with a watermark, and slowly changing dimensions Type 2.
- Week 8: Git integration and a deployment pipeline: dev to test.
- Sit DP-600 in this window.

**Days 61–90: the portfolio project and DP-700.**
- Weeks 9–11: build the project I'm about to describe.
- Week 12: DP-700 prep. That's the Fabric Data Engineer exam. Spend extra time on KQL and real-time, because Power BI people skip it and the exam doesn't. My full DP-700 course is linked on screen.
- If Microsoft is running a voucher campaign, use it. They've done free exam drives before. [ON SCREEN: current offer, if verified]"

### 11:30 The portfolio project
[ON SCREEN: architecture diagram]

"One project that shows every skill, using public data so you can share it.

1. **Source:** a public dataset that updates, like a city's open data API or public transport data.
2. **Bronze:** a pipeline pulls it daily into lakehouse Files, with a copy activity or a copy job.
3. **Silver:** a notebook cleans it, removes duplicates and merges it into Delta tables incrementally.
4. **Gold:** a star schema in a warehouse, built with T-SQL.
5. **Semantic model:** Direct Lake, with proper measures. This is where you shine.
6. **Report:** a polished Power BI report, your strongest skill, on top of an engineering-grade platform.
7. **Git:** the whole workspace connected to a GitHub repo, with a README and an architecture diagram.
8. **Deployment:** a dev and a prod workspace with a deployment pipeline.

Put the GitHub link and a two-minute video walkthrough on your CV and LinkedIn. Most candidates show a dashboard. You'll show the whole platform behind it."

### 14:00 Job titles to search for
[ON SCREEN: list]

"When you start applying, search beyond 'Power BI developer'. Look for:
- **Analytics Engineer:** the closest match to where you'll be after DP-600.
- **Fabric Developer** or **Fabric Engineer.**
- **BI Engineer.**
- **Data Engineer**, especially Microsoft-stack or Azure roles that now mention Fabric.
- **Data Platform Engineer**, once you've done DP-700 and the project.

In interviews, lead with the project. And be honest about what you know. Remember the person from the start of the video? Saying you know Fabric when you don't works until the first week on the job. Saying 'I've built this end to end, here's the repo' works for the whole career."

### 15:30 Common mistakes
[ON SCREEN: four ✗ items]

"Four mistakes I see Power BI developers make:
- **Starting with Spark.** Start with SQL. It's used in more places in Fabric, and it's closer to how you already think.
- **Collecting certificates without building.** People report passing practice tests and failing the real exam. The real exam asks scenario questions you can only answer if you've built things.
- **Skipping Git.** It feels like overhead. It's the thing that separates an engineer from an analyst in an interview.
- **Ignoring real-time.** Eventstreams and KQL feel niche until they show up all over DP-700 and on the first ticket at your new job."

### 17:00 Your first week, starting today
[ON SCREEN: 5 checkboxes]

"If you want to start tonight:
1. Start a Fabric trial.
2. Create a workspace and a lakehouse.
3. Upload one CSV and load it to a table.
4. Query it with the SQL endpoint.
5. Build a Direct Lake report on it.

That's maybe an hour. And you'll have touched the lakehouse, Delta, SQL and Direct Lake: four of the things on this roadmap."

### 18:00 Outro
"So: you already have Power Query, modeling, DAX and the business context. Add SQL, the lakehouse, pipelines, enough PySpark, and Git. Do DP-600, then DP-700, and build one project that shows the whole platform.

My full DP-700 course and the 40-minute Fabric crash course are both on screen. If you're making this switch right now, tell me in the comments where you're stuck. I'll use the answers for future videos."

---

## Chapters
```
0:00 Power BI → Fabric engineer in 90 days
0:30 "I got a Fabric job… and I don't know Fabric"
1:30 What you already have
3:10 "I was wrong about Fabric": migrating in 8 hours
4:00 The 5 skills you're missing
7:30 The 90-day plan (DP-600 → DP-700)
11:30 The portfolio project
14:00 Job titles to search for
15:30 4 common mistakes
17:00 Your first week, starting today
18:00 Summary
```

## Description + tags
**The roadmap from Power BI developer to Microsoft Fabric engineer: the 5 skills you're missing, a 90-day plan, DP-600 then DP-700, and a portfolio project.** Most Power BI developers already have Power Query, modeling and DAX. This shows what to add and in what order.

Includes community stories from Power BI developers making the switch in 2026, the job titles to search for, and a first-week checklist you can start tonight.

DP-700 full course: [link] · Fabric in 40 minutes: [link] · Portfolio project template: [link]

**Tags:** power bi to fabric, microsoft fabric roadmap, data engineer roadmap, power bi developer career, fabric engineer, analytics engineer, dp-600, dp-700, microsoft fabric certification, learn microsoft fabric, fabric for power bi developers, power bi semantic model, direct lake

## Shorts cutdowns
**Short 1: "You're already 50% there" (40s)**
[ON SCREEN: "Power BI dev → Fabric engineer?"]
"If you build Power BI reports, you're closer to Fabric engineer than you think.
[ON SCREEN: ✓ Power Query = Dataflow Gen2]
Power Query? That's Dataflow Gen2.
[ON SCREEN: ✓ Star schema = gold layer]
Star schemas? That's the gold layer.
[ON SCREEN: ✓ Semantic models = same thing]
Semantic models? Same thing, with a new mode called Direct Lake.
[ON SCREEN: Missing: SQL · Lakehouse · Pipelines · PySpark · Git]
You're missing five skills. Full roadmap on the channel."

**Short 2: "Got the job, don't know Fabric" (45s)**
[ON SCREEN: "Got a Fabric job. Don't know Fabric."]
"Someone posted in the Fabric community: they got a job saying they knew Fabric. They didn't. Where do they start?
[ON SCREEN: 1. SQL]
First, SQL beyond SELECT: window functions, MERGE.
[ON SCREEN: 2. Lakehouse + Delta]
Second, the lakehouse and Delta tables.
[ON SCREEN: 3. Pipelines]
Third, pipelines to schedule it.
[ON SCREEN: 4. PySpark 5. Git]
Then just enough PySpark, and Git.
Don't start with Spark. Start with SQL."

**Short 3: "The project that gets interviews" (40s)**
[ON SCREEN: "Every Power BI dev shows a dashboard."]
"Every Power BI developer shows a dashboard. Show the platform behind it.
[ON SCREEN: API → Bronze → Silver → Gold → Direct Lake → Report]
Pull public data with a pipeline. Clean it in a notebook. Model it in a warehouse. Direct Lake report on top.
[ON SCREEN: + GitHub + dev/prod]
Connect it to GitHub with dev and prod workspaces. Then put the repo on your CV."

## LinkedIn post
[IMAGE: two columns. "You already have": Power Query, star schemas, DAX, semantic models, the business context. "Add these 5": SQL, Lakehouse/Delta, Pipelines, PySpark (just enough), Git & deployment. Arrow underneath: DP-600 → project → DP-700.]

A Power BI developer with 8+ years of experience posted "I was wrong about Fabric" after moving a model and its pipeline over in about a day.

That matches what I see. Power BI developers are already halfway to Fabric engineer:
- Power Query = Dataflow Gen2.
- Your star schema = the gold layer.
- Semantic models are the same thing.

What's missing is five skills: SQL beyond SELECT, lakehouse/Delta, pipelines, just enough PySpark, and Git.

Learn them in that order. Take DP-600 first. Build one project end to end. Then DP-700.

Which of the five is your gap?

#MicrosoftFabric #PowerBI #DataEngineering #CareerChange
