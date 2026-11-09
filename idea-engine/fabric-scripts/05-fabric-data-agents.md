# Wk 5: Fabric Data Agents: Chat With Your Lakehouse and Semantic Model (Full Setup, 2026)

- **Runtime target:** 20–22 min
- **Pillar:** 3. Growing-concept explainers
- **Target keywords:**
  - fabric data agent: 720/mo, **2.27×**, the fastest-growing term in the set; $13 CPC
  - fabric copilot: 90
  - copilot in power bi: 320, 1.05×
  - semantic model: 3,600, 1.13×
  - Agents on semantic models are a frequent community ask.
- **Title options:**
  1. Fabric Data Agents: Chat With Your Lakehouse in Plain English (Full Setup 2026)
  2. Microsoft Fabric Data Agent Tutorial: Build, Test, Publish to Teams in 20 Minutes
  3. I Built an AI Data Agent in Microsoft Fabric (And How Not to Burn Your Capacity)
- **Thumbnail:**
  - **Text:** "ASK YOUR DATA"
  - **Visual:** chat bubble "Which city had the most rain days?" with an arrow to a SQL snippet and a small Fabric logo.
- **Verify before recording:**
  - **Preview or GA:** the status of data agents overall, and of each source type (lakehouse, warehouse, semantic model, KQL/Eventhouse, mirrored DB). Say "preview" on screen for anything still preview.
  - **Capacity requirement:**
    - Paid F2+ (or P1+), or still F64+?
    - Whether trial capacities are supported. They weren't at last check.
  - **Tenant settings, exact names (Admin portal):**
    - Data agent item creation
    - "Users can use Copilot and other features powered by Azure OpenAI"
    - The cross-geo processing and storage settings for Azure OpenAI
    - Any "Copilot capacity" setting
  - **Source limit per agent:** older docs said 5 sources; the community now reports up to 25 items. Check the current number and say it exactly.
  - **Eventhouse sources:** whether KQL functions and materialized views can be sources now (reported by the community).
  - **Example queries:** whether they're supported for semantic model sources yet (they weren't), and the max count per source.
  - **Semantic model sources:**
    - whether the agent respects the model's "Prep data for AI" settings (AI instructions, AI data schema, verified answers)
    - which permission users need (Build vs Read)
  - **Consumption options and their names:**
    - Copilot Studio (connected agent)
    - Microsoft 365 Copilot / Teams
    - Azure AI Foundry Agent Service
    - the Python SDK
  - **Billing:** how agent usage is billed and named in the Capacity Metrics app (Copilot/AI operations, CU per token). Whether surge protection and a separate "Fabric Copilot capacity" are available on your SKU.

## Hook (0:00–0:30)
> What if your sales manager could type "which region dropped the most last month?" and get the right answer, from your actual data, with the SQL to prove it?
>
> That's a Fabric data agent. In the next 20 minutes, I'll build one on a real lakehouse and a semantic model. I'll teach it our business rules, test it, and publish it to Teams.
>
> And I'll show you the cost guardrails, because people are burning real money testing these. Let's go.

## Script

### 0:30 What a data agent is (and isn't)
[ON SCREEN: diagram. User question → Data agent (instructions + examples) → picks a source → writes a query (SQL for lakehouse/warehouse, DAX for semantic model, KQL for Eventhouse) → runs it as the user → answer + the query.]

> A Fabric data agent is a chat interface over your Fabric data.
>
> You ask in plain English. The agent decides which source fits. It writes a query in that source's language:
> - SQL for a lakehouse or warehouse
> - DAX for a semantic model
> - KQL for an Eventhouse
>
> Then it runs the query and answers in words, showing you the query it used.
>
> Three things it is not:
> - **It's not a chatbot trained on your data.** Nothing gets trained. It writes a query every time, and the answer is only as good as that query.
> - **It doesn't write data.** It's read-only.
> - **It doesn't bypass security.** Queries run as the person asking. If they can't see a table, the agent can't either.
>
> That last point is the reason you can actually put this in front of a business.

### 2:30 Prerequisites: capacity and tenant settings
[ON SCREEN: checklist. ☐ Paid Fabric capacity ☐ Data agent tenant setting ☐ Copilot / Azure OpenAI tenant setting ☐ Cross-geo setting (if outside US/EU) ☐ Read access to the data.]

> Before you start, check four things. This is where most first attempts fail.
>
> **One: capacity.** Data agents need a paid Fabric capacity. Check the exact minimum SKU on screen now, and note that trial capacities have not been supported.

[DEMO: Admin portal → Tenant settings → search "data agent" → show the setting enabled for a security group.]

> **Two: the data agent tenant setting.** Your Fabric admin turns it on in the Admin portal. Best practice is a security group, not the whole organization, while you pilot.

[DEMO: search "Copilot" → show "Users can use Copilot and other features powered by Azure OpenAI" → enabled.]

> **Three: the Copilot and Azure OpenAI setting.** The agent uses Azure OpenAI under the hood, so this has to be on.

[DEMO: show the cross-geo processing setting.]

> **Four: if your capacity isn't in a region where Azure OpenAI runs**, there's a setting that allows data to be processed in another geography. Your admin and your compliance team should make that call together. Don't just flip it.
>
> And finally, you need read access to the data you plan to use. Nothing special there.

### 5:00 Create the agent and add sources
[DEMO: workspace fabric_weather_e2e (from the Week 4 code-along) → + New item → Data agent → name `da_weather` → Create.]

> I'm using the weather platform we built in the one-hour code-along: the gold lakehouse and the `sm_weather` semantic model. If you haven't built it, any lakehouse works.
>
> New item, Data agent. I'll call it `da_weather`.

[DEMO: Add data source → OneLake catalog → lh_gold → select tables dim_city, dim_date, fact_weather_daily (untick anything else).]

> Add a data source: `lh_gold`.
>
> Now tick only the tables the agent needs. This matters more than anything else you'll do today. Every table you include is something the model has to reason about.
>
> - **Fewer, cleaner tables:** better queries, and cheaper ones.
> - **Every staging table in the lakehouse:** confused answers and higher cost.
>
> That's why we built a clean gold layer.

[DEMO: Add data source → sm_weather (semantic model).]

> Second source: the semantic model. This is the one people ask about most, and for good reason. A semantic model already has your measures, so "Rain Day %" means exactly what your reports say it means.
>
> For a semantic model source, the agent writes DAX against your measures instead of raw SQL.
>
> You can mix lakehouses, warehouses, semantic models and KQL databases in one agent, up to a limit. Check the current number on screen.
>
> But don't add sources just because you can. Two good sources beat ten overlapping ones. I'll show you why in the cost section.

### 8:00 Teach it your business: agent and source instructions
[DEMO: Agent instructions panel → paste.]

> Now the part that turns a demo into something useful: instructions.
>
> There are two levels:
> - **Agent instructions** apply to everything: tone, routing, definitions.
> - **Data source instructions** are specific to one source: how its tables join, what columns mean.

[ON SCREEN: agent instructions]
```text
You answer questions about daily weather for 5 cities (London, New York, Sydney, Tokyo, Lagos).

Routing:
- For questions that use business metrics (rain day %, average max temperature, hottest day,
  totals by month or city) use the semantic model sm_weather. Prefer its measures.
- For row-level questions (list specific days, find exact dates, raw values) use the lakehouse lh_gold.

Definitions:
- A "rain day" is a day with 1.0 mm of precipitation or more (column is_rain_day = 1).
- Temperatures are in °C, precipitation in mm, wind in km/h.
- "Last month" means the most recent complete calendar month in dim_date.

Answer style:
- Lead with the number, then one sentence of context.
- Always state the date range you used.
- If the question is ambiguous (e.g. "hottest" could mean max or average), say which you used.
```

> Look at what's in there:
> - **Routing:** metrics go to the semantic model, row-level questions go to the lakehouse.
> - **Definitions** of anything the business argues about.
> - **An answer style.**
>
> "Always state the date range" alone prevents half the "that number is wrong" complaints.

[DEMO: select lh_gold source → Data source instructions → paste.]
```text
Tables:
- fact_weather_daily: one row per city per day. Join to dim_city on city_id and to dim_date on date_key.
- dim_date.date_key is an integer yyyymmdd. Filter dates using dim_date.date, not date_key arithmetic.
- temp_avg_c is pre-computed; do not recompute from max/min.
Never use SELECT *. Return at most 50 rows unless asked.
```

> For the lakehouse: how the tables join, the gotchas, and a row limit. Those last two lines also keep queries cheap.

### 11:00 Example queries
[DEMO: lh_gold source → Example queries → add 3.]

> Example queries are question and answer pairs you write by hand. They're the strongest signal you can give the agent: "when someone asks something like this, the right query looks like this."
>
> Write them for the questions people will actually ask.

[ON SCREEN: example 1. Question: "Which city had the most rain days last month?"]
```sql
SELECT TOP 1 c.city, SUM(CAST(f.is_rain_day AS int)) AS rain_days
FROM dbo.fact_weather_daily f
JOIN dbo.dim_city c ON f.city_id = c.city_id
JOIN dbo.dim_date d ON f.date_key = d.date_key
WHERE d.year_month = (
    SELECT MAX(year_month) FROM dbo.dim_date
    WHERE date < DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1))
GROUP BY c.city
ORDER BY rain_days DESC;
```

[ON SCREEN: example 2. Question: "What were the 5 hottest days in Tokyo?"]
```sql
SELECT TOP 5 d.date, f.temp_max_c
FROM dbo.fact_weather_daily f
JOIN dbo.dim_city c ON f.city_id = c.city_id
JOIN dbo.dim_date d ON f.date_key = d.date_key
WHERE c.city = 'Tokyo'
ORDER BY f.temp_max_c DESC;
```

[ON SCREEN: example 3. Question: "Average max temperature by month for London"]
```sql
SELECT d.year_month, ROUND(AVG(f.temp_max_c), 1) AS avg_max_c
FROM dbo.fact_weather_daily f
JOIN dbo.dim_city c ON f.city_id = c.city_id
JOIN dbo.dim_date d ON f.date_key = d.date_key
WHERE c.city = 'London'
GROUP BY d.year_month
ORDER BY d.year_month;
```

> Notice the first one bakes in our "last month" definition. That's the point: examples carry business logic the model would otherwise guess at.
>
> For the semantic model source, the main lever is the model itself:
> - clear measure names
> - descriptions on measures and columns
> - hidden technical columns
> - Power BI's "Prep data for AI" settings, if your tenant has them
>
> Check on screen whether example queries are supported for semantic model sources yet. When I last checked, they weren't.

### 13:00 Test it, and read the query every time
[DEMO: chat pane. Ask: "Which city had the most rain days last month?" → answer. Expand the steps → show the generated SQL.]

> Now test. First question: which city had the most rain days last month?
>
> It answers with the number, the city, and the date range, as instructed. Expand the steps and you see the exact SQL it ran. Always check this while you're testing. A right-looking number from the wrong query is the dangerous case.

[DEMO: ask "What's the rain day percentage for Sydney this year?" → routed to semantic model → show DAX.]
```dax
EVALUATE
SUMMARIZECOLUMNS (
    TREATAS ( { "Sydney" }, dim_city[city] ),
    TREATAS ( { 2026 }, dim_date[year] ),
    "Rain Day %", [Rain Day %]
)
```

> Second question uses a business metric, so it went to the semantic model and used our `Rain Day %` measure. That's the same number as the report. That's why routing to the model for metrics matters.

[DEMO: ask "Was it a cold summer?" → agent states its assumption (city? hemisphere?).]

> Now a vague one: "was it a cold summer?" Summer where? Compared to what?
>
> A good agent says what it assumed. If yours guesses silently, add an instruction: ask, or state assumptions.

[ON SCREEN: test sheet. 20 real questions | expected answer | agent answer | correct? | fix (instruction / example / model)]

> Build a test sheet: twenty real questions from real users, with the answer you expect. Run them after every change.
>
> When one fails, fix it in this order:
> 1. Clean the data or model.
> 2. Then add an instruction.
> 3. Then add an example.
>
> Don't paper over a bad model with prompts.

### 15:30 Publish, share and use it in Teams
[DEMO: Publish → add a description ("Answers questions about daily weather for 5 cities…") → Publish. Show published vs draft.]

> When the test sheet passes, publish. Write a real description. Other tools, like Copilot Studio, use it to decide when to call your agent.
>
> Publishing creates a stable version. You keep editing the draft without breaking what users see.

[DEMO: Share → user/group → permission. Note: users also need read access to lh_gold and sm_weather.]

> Share it like any Fabric item. Remember, users also need access to the underlying data. Sharing the agent alone isn't enough, and that's by design.

[DEMO: Copilot Studio → create/open agent → Add agent → Microsoft Fabric → select da_weather → publish to Teams channel. Ask the same question in Teams.]

> To get it in front of business users, the common route is Copilot Studio. Add your Fabric data agent as a connected agent, then publish that to Teams and Microsoft 365 Copilot.
>
> Same question, now in Teams. Same answer, same security.
>
> Developers can also call published agents from Azure AI Foundry agents or the Python SDK. Check the current options on screen.

### 17:30 Cost guardrails: don't burn your capacity
[ON SCREEN: "Every question = AI tokens + a query, billed to your capacity"]

> Now the part most tutorials skip. In the Fabric community, there's a well-known post from someone who burned a lot of money testing data agents with many sources.
>
> Here's why it happens. Every question:
> - uses AI tokens to plan
> - uses tokens to write the query, sometimes more than once
> - then runs the query on your capacity
>
> More sources and more tables mean bigger prompts. Bigger prompts mean more tokens on every single question. Then you run a hundred test questions in an afternoon.

[ON SCREEN: guardrails checklist]

> Six guardrails:
>
> 1. **Fewest sources, fewest tables.** Gold tables only. This is the biggest lever.
> 2. **Test on a small, separate capacity or workspace.** Not on the capacity your month-end reports run on.
> 3. **Watch the Capacity Metrics app.** Filter to the AI and Copilot operations after a test session. You'll see the cost of your testing in capacity units.
> 4. **Turn on surge protection** on the capacity, so background spikes get throttled before they take down interactive reports. If your tenant offers a dedicated Copilot capacity, use it to keep AI usage separate.
> 5. **Pause pay-as-you-go capacities when nobody's testing,** and set an Azure budget alert on the subscription.
> 6. **Cap row returns in your instructions,** like the "at most 50 rows" line. Smaller results, faster and cheaper.

[DEMO: Capacity Metrics app → filter item/operation → show the agent's usage after the test session.]

> Here's my test session in the metrics app. Look at this before you roll out to 500 users, not after.

### 19:30 Limits, governance, wrap-up
[ON SCREEN: limits list. Read-only · Max sources per agent · Quality depends on model and naming · Runs as the user · Check preview status per source]

> Quick limits so you set expectations:
> - **It's read-only.**
> - **There's a cap on sources per agent.**
> - **Answers are only as good as your tables, names and instructions.**
> - **Some source types may still be in preview,** so check before you promise them to a business.
>
> For governance:
> - Pilot with a security group.
> - Keep the test sheet as your quality gate.
> - Treat instructions like code: review changes before you publish.
>
> If your data is a mess, an agent won't fix it. It will just answer the mess faster.
>
> So build the gold layer first. My one-hour code-along shows how, and my semantic model video shows how to make the model agent-ready. See you there.

## Chapters
```
0:00 Ask your data in plain English
0:30 What a Fabric data agent is (and isn't)
2:30 Prerequisites: capacity + tenant settings
5:00 Create the agent + add lakehouse & semantic model
8:00 Agent and data source instructions
11:00 Example queries
13:00 Testing: read the SQL and DAX every time
15:30 Publish, share, use in Teams via Copilot Studio
17:30 Cost guardrails: don't burn your capacity
19:30 Limits, governance, wrap-up
```

## Description + tags
**Fabric data agent tutorial (2026):** build an AI data agent in Microsoft Fabric that answers plain-English questions over a lakehouse and a Power BI semantic model, with the SQL and DAX it ran.

Full setup: tenant settings, data sources, agent instructions, example queries, testing, publishing to Teams through Copilot Studio, and the cost guardrails that stop you burning capacity units while testing.

In this video:
- What a data agent is and how it writes SQL, DAX and KQL
- Prerequisites: capacity and tenant settings
- Using a semantic model as a source so answers match your reports
- Instructions and example queries that carry business rules
- A test-sheet method for accuracy
- Publishing to Microsoft Teams / Microsoft 365 Copilot
- Cost guardrails and the Capacity Metrics app

📂 Instructions + example queries: [LINK]
▶ Build the lakehouse used here: [LINK] · Semantic models + Direct Lake: [LINK]

**Tags:** fabric data agent, microsoft fabric data agent, fabric ai skill, fabric copilot, copilot in power bi, chat with your data, microsoft fabric 2026, semantic model, copilot studio fabric, fabric lakehouse, natural language to sql, fabric capacity

## Shorts cutdowns
**Short 1: "Ask your lakehouse a question" (≤40s)**
[ON SCREEN: chat "Which city had the most rain days last month?"]
> This is a Fabric data agent. I typed a normal question. It picked the right table, wrote this SQL, ran it as me, and answered with the city and the date range. [Use the real result from your recording.]
>
> No training, no copying data. It writes a query every time, and it can only see what I can see.

[ON SCREEN: SQL expands.]
> Full 20-minute setup on my channel.

**Short 2: "How people burn money on data agents" (≤45s)**
[ON SCREEN: "Data agents cost capacity. Here's why."]
> People are burning real money testing Fabric data agents. Here's the mechanism.
>
> Every question costs AI tokens plus a query. The more sources and tables you attach, the bigger every prompt gets. Run a hundred test questions and it adds up.
>
> The fix:
> - gold tables only
> - test on a small separate capacity
> - check the Capacity Metrics app after every session
> - pause the capacity when you're done

**Short 3: "Point your agent at the semantic model" (≤35s)**
[ON SCREEN: "SQL vs DAX: same question, different answer?"]
> If your data agent only uses the lakehouse, it invents its own math for "rain day percent." Your report uses a DAX measure. Now you have two numbers.
>
> Add the semantic model as a source, and tell the agent to use it for business metrics. Same measure, same answer as the report.

## LinkedIn post
> **A Fabric data agent is only as good as the 3 things under it.**
>
> [Diagram: Question → Agent instructions → (Semantic model: metrics, DAX) / (Lakehouse gold: rows, SQL) → Answer + query. Underneath: "Clean gold layer · Clear measure names · Test sheet of 20 real questions"]
>
> My opinion after building one: the AI is the easy part.
> - **Route metrics to the semantic model,** so answers match your reports.
> - **Give it gold tables only.** Fewer tables = better and cheaper queries.
> - **Keep a 20-question test sheet and rerun it on every change.**
> - **Watch the Capacity Metrics app while testing.** People have burned real money here.
>
> If your data is messy, an agent just answers the mess faster.
>
> Full setup on my channel.
