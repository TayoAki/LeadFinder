# C5: Fabric Apps (Rayfin) Explained: What It Is, What It Costs, and Should Power BI Devs Care?

## Sources (every claim below is tagged with one)
- **[LEARN-OV]** Microsoft Learn, "What is Fabric Apps (Preview)?" (learn.microsoft.com/en-us/fabric/apps/overview), fetched 2026-11-09.
- **[LEARN-PR]** Microsoft Learn, "Pricing and capacity usage for Fabric Apps" (learn.microsoft.com/en-us/fabric/apps/pricing), last updated 2026-09-29, fetched 2026-11-09.
- **[TE]** Tabular Editor blog, "Fabric Apps explained: Visualization as code in a data app dashboard", published 2026-06-03, updated 2026-10-19.
- **[R-COST]** r/MicrosoftFabric, "Fabric Apps: what it actually costs". A user's own measurements on an F4 trial (74 upvotes / 21 comments).
- **[R-AMA]** r/MicrosoftFabric, "We're the Rayfin team, ask us anything" (Microsoft team AMA, June 17, 2026; 121 comments).
- **[R-HANDS]** r/MicrosoftFabric, "Fabric Apps after a hands-on build: promising, but not a Power BI or Power Apps replacement" (27 comments).
- **[R-PORT]** r/MicrosoftFabric, "RayFin Experience": porting a Power App (12 comments).
- **[R-SWITCH]** r/MicrosoftFabric, "Anyone else moved from Power BI to Fabric apps? I've basically stopped using Power BI" (77 comments).
- **[R-LIC]** r/MicrosoftFabric, "Why is nobody talking about the Rayfin/F2 licensing implications on Power BI" (60 comments). **An open question, not a fact.**
- **[R-STORE]** r/MicrosoftFabric, "Fabric App added server side storage token" (24 comments).

## Evidence: why this piece exists
- **How big the theme is:** the new 2026 items (Fabric Apps, Rayfin, Plan, IQ, Ontology) drew 26 Reddit threads and 926 comments in five months. That makes it the fastest-arriving theme in the dataset.
- **Rayfin and Fabric Apps alone:**

  | Thread | Comments |
  |---|---|
  | AMA [R-AMA] | 121 |
  | "Fabric Apps explained" | 63 |
  | Licensing question [R-LIC] | 60 |
  | "Introducing Rayfin" | 68 |
  | "I've basically stopped using Power BI" [R-SWITCH] | 77 |
  | Cost measurement [R-COST] | 21 |

- **No search volume yet:** the feature launched at Build 2026. The bet is to rank before the "fabric apps" search term exists. Nobody on YouTube has covered the cost and licensing questions.

## Video script

- **Runtime target:** 13–15 min
- **Pillar:** 3 (growing-concept explainer) + 5 (Power BI → Fabric bridge)
- **Target keywords:** fabric apps, rayfin, fabric data app, power bi data app, fabric apps pricing. None had measurable Google volume at the time of the plan; this is a new feature and an early-mover bet.
- **Title options:**
  1. Fabric Apps (Rayfin) Explained: What It Is, What It Costs, Should Power BI Devs Care?
  2. Is This the End of Power BI Reports? Fabric Apps, Honestly Explained
  3. I Measured What Fabric Apps Actually Cost (Rayfin, 2026)
- **Thumbnail:** "POWER BI 2.0?" A Power BI report on the left, a code-built React dashboard on the right, with an arrow and a "?".

### Verify before recording
- **Preview status:** Fabric Apps is in preview [LEARN-OV]. Check whether it has gone GA, and whether the tenant setting is still called "Fabric Apps (preview)".
- **Regions:** not available in all regions [LEARN-OV]. Check the region list for your demo tenant.
- **Pricing meters** [LEARN-PR, updated 2026-09-29]:
  - SQL database CUs; 1 CU = 0.383 SQL vCores.
  - GraphQL: 10 CU per hour of request/response processing time.
  - User Data Functions.
  - OneLake storage, read and write.
  - "Hosting service, authentication and deployment have no separate CU charge **at this time**." Re-check this wording.
- **Community cost figures** [R-COST] are one user's measurements on an F4 trial. Say "one community member measured".
  - SQL DB memory floor ≈ 1.74 CU while online (≈87% of an F2).
  - Autopause measured ~25 min vs 15 min documented.
  - Semantic-model data app ≈ 2–3 CU(s) per page load.
- **Licensing below F64** [R-LIC]: unverified. Do NOT say free users can view on F2. Present it as an open question and check Microsoft's licensing docs on the day. [TE] says Microsoft is bringing apps to Power BI Pro and PPU customers (announced preview). Check status.
- **Modern Report Builder** in Power BI Desktop: announced, "isn't available yet" per [TE] as of Oct 2026. Re-check.
- **Data app prerequisites** [TE]:
  - Build + Read on the semantic model.
  - Contributor on the workspace.
  - The tenant settings "Fabric Apps" and "Semantic Model Execute Queries REST API".
  - Check the exact names.
- **Scaffolding command:**
  - [TE] shows it with `bun create @microsoft/rayfin@latest -- "MyApp" --template dataapp --workspace "WorkspaceName"` and says npm/npx is what Microsoft suggests.
  - Confirm the npm form (`npm create @microsoft/rayfin@latest -- ...`) against the Rayfin CLI reference before showing it.
- **Roadmap items** from [R-AMA] (Postgres support, RBAC, more connectors, OneLake integration, self-hosted runtime) and [TE] (deployment pipelines, admin/security portal, app sharing "planned later in 2026"). Say "announced", not "available".
- **Server-side storage token / file storage:** [LEARN-OV] lists a `/storage` path. [R-STORE] says server-side storage tokens were added. Check what's GA.

### Hook (0:00–0:30)
"Microsoft just added a way to build full web apps inside Fabric. One Power BI developer in the community says they've basically stopped building Power BI reports because of it. Another built a working sales-order app in four and a half hours with Copilot writing the code. I read the docs and the pricing page, and went through every community thread with real measurements. By the end of this video you'll know what Fabric Apps is, what it really costs on your capacity, and whether you should care if you build Power BI reports."

### Script

**[0:30] Chapter 1: What Fabric Apps actually is**

[ON SCREEN: "Fabric Apps (Preview) = web apps hosted inside Fabric, built on the Rayfin SDK"]

"Fabric Apps is a new item type in your workspace. It's in preview. It's built on an open-source toolkit Microsoft calls Rayfin: an SDK plus a command-line tool.

Here's the idea:
- You describe your data model in TypeScript. You decorate classes with things like `@entity` and `@text`.
- Fabric then creates the database tables, a GraphQL API, sign-in and hosting for you.
- You write a normal web front end, and it gets served from Fabric.

That's straight from Microsoft's overview page."

[ON SCREEN: diagram]
`rayfin up` → **SQL database in Fabric** + **GraphQL API** + **Entra sign-in** + **Static hosting** → `https://<your-app>-app.rayfin.windows.net`

"When you deploy with `rayfin up`, Fabric creates child items under the app: a SQL database with your schema, an authentication service and static content hosting. Everything sits behind one URL, with paths for the API, auth and storage.

Two things to know up front:
- Sign-in after deployment is Microsoft Entra single sign-on only. No other identity providers.
- The database schema is read-only in the portal. You change it in code and redeploy."

**[2:30] Chapter 2: The two kinds of app**

[ON SCREEN: two columns, "App with its own database" | "Data app (on a semantic model)"]

"In practice, you'll see two flavors.

The first is an app with its own database. Think write-back: forms, approvals, a headcount plan, an order tracker. It's the kind of thing teams build in Power Apps today. In the community, one person ported an internal Power App to it to save on licensing. Another built a customers, products, inventory and orders app in about four and a half hours with GitHub Copilot.

The second is what Microsoft calls a data app. It's a template that connects to a published Power BI semantic model and queries it with DAX, like a report does. The front end is React with Vega-Lite charts, so you can draw any visual you can code. According to Tabular Editor's write-up, the queries run under the viewer's own Entra identity, so your model's security still applies, if you set it up properly.

That second one is why Power BI people are paying attention."

**[4:00] Chapter 3: Building a data app, the actual steps**

[DEMO: Admin portal → Tenant settings → enable "Fabric Apps (preview)" for a security group; confirm "Semantic Model Execute Queries REST API" is on.]

"Prerequisites first:
- A Fabric admin has to switch on Fabric Apps in tenant settings.
- For a data app, they also need to allow the semantic model 'execute queries' REST API.
- You need Build and Read permission on the model and Contributor on the workspace.
- Today, the workspace needs a Fabric capacity."

[DEMO: terminal]
```bash
# Requires Node.js + npm. Check the current command in the Rayfin CLI docs.
npm create @microsoft/rayfin@latest -- "SalesApp" --template dataapp --workspace "Sales Analytics"
cd SalesApp
npm run dev        # local preview at http://localhost:5173
```

"This creates a project folder. It also adds instruction files for coding agents: an AGENTS.md and a set of skills. Microsoft expects you to build most of this with an AI agent, not line by line. You give it a link to your semantic model and describe the page you want."

[DEMO: open a generated `.dax` file]
```dax
// by-region.dax: one query per visual, and you can see and tune it
EVALUATE
SUMMARIZECOLUMNS(
    'Region'[Region],
    "Revenue", [Total Revenue],
    "Revenue PY", [Revenue PY]
)
```

"Here's something Power BI never gave you: each visual's DAX query is a file you can read and tune. In a normal report, those queries are generated for you.

[DEMO: `rayfin up` → show the app item and its child items in the workspace.]

When it looks right, `rayfin up` deploys it. One warning from someone who tried it: the template scaffolding ran a deploy earlier than they expected, so a real item showed up in the workspace. Use a sandbox workspace the first time."

**[6:30] Chapter 4: What it costs: the docs**

[ON SCREEN: Microsoft Learn pricing page, highlighted rows]

"Now money. This is the part nobody's covering. Per Microsoft's pricing page, a Fabric app uses your capacity in four places:
- **The SQL database:** compute and storage. One CU is about 0.383 SQL vCores.
- **The GraphQL API:** ten CUs per hour of request and response processing time.
- **User Data Functions,** if you use them.
- **OneLake:** storing and serving your front-end files.

The pricing page says the hosting service, authentication and deployment don't have a separate charge 'at this time'. Note the 'at this time'."

**[8:00] Chapter 5: What it costs: real measurements**

[ON SCREEN: "One community member's measurements (F4 trial)"]

"One community member measured all this in the Capacity Metrics app, and the results matter if you're on a small capacity.

For an app with its own database:
- Almost all the cost was the database.
- It bills a minimum memory floor while it's online, about 1.7 CUs sustained, no matter how many users there are. On an F2, that's around 87% of the capacity while the database is awake.
- Autopause is documented at 15 minutes. They measured about 25.
- So the number that matters is hours the database is on, not hours of use. Lots of short sessions cost more than one long one."

[ON SCREEN: table]

| DB online per day | Share of F2 | F8 | F64 |
|---|---|---|---|
| ~2.4 h | ~9% | ~2% | ~0.3% |
| 24 h | ~87% | ~22% | ~2.7% |

"For a data app on a semantic model there's no database. They measured about two to three CU seconds per page load from the DAX queries. That's the same meter a Power BI report uses. A thousand page loads a day came to under two percent of an F2.

So here's the takeaway:
- **A data app costs about what a report costs.**
- **An app with its own database on an F2 is a capacity hog** unless it sleeps most of the day.

These are one person's numbers on a trial. Measure your own."

**[10:00] Chapter 6: The licensing question nobody has answered**

[ON SCREEN: "Open question"]

"This thread got sixty comments. On capacities below F64, Power BI reports need every viewer to have a Pro or PPU license. Fabric Apps are not a Power BI item type. So could a data app on an F2 be shown to people without Pro licenses?

I'm not going to tell you yes. I haven't seen Microsoft confirm it, and I'd hate for you to budget around a loophole that gets closed. Here's what is confirmed: Microsoft has announced it's bringing apps to Power BI Pro and Premium Per User customers. If this matters to you, test it with a free-license account in your tenant and check the licensing docs. Tell me in the comments what you find."

**[11:00] Chapter 7: Should Power BI developers care?**

[ON SCREEN: two lists]

"Here's my honest take, using what people who've built these say.

**Where Fabric Apps wins:**
- Any visual you can code, with no paid custom visuals.
- Write-back and workflows, which reports were never built for.
- Faster iteration with an AI agent. Tabular Editor's author estimated about 80% less time for a custom-designed dashboard.
- Report-specific logic stays out of your semantic model.

**Where Power BI reports still win:**
- Every report gets the same cross-filtering, accessibility and governance for free. A data app only has what its code implements.
- Business logic stays in one model. Agents love to put calculations in the app, which brings back the inconsistent numbers semantic models exist to prevent.
- Maturity. Deployment pipelines and a proper admin and security story were still listed as coming later in 2026. And one tester found a real bug, the wrong salesperson on an order, in AI-generated code that looked fine.

AI-generated code is still code. Someone has to review it.

So:
- **If you build standard reports for many viewers,** keep building them in Power BI. Learn Fabric Apps on the side.
- **If you keep hacking SVG measures or HTML visuals,** or your users want write-back, this is worth a prototype now.
- **Either way, your semantic model matters more, not less.** It's the thing every app queries."

**[12:45] Chapter 8: Try it safely**

[ON SCREEN: checklist]
1. Sandbox workspace on a trial or test capacity
2. Data app first (no database = predictable cost)
3. Review every DAX file the agent writes
4. Keep business logic in the model
5. Watch the app's line in Capacity Metrics for a week

"If you want to understand the model these apps query, watch my semantic models and Direct Lake video next."

### Chapters
```
0:00 Fabric Apps in one minute
0:30 What Fabric Apps (Rayfin) actually is
2:30 Two kinds of app: own database vs data app
4:00 Building a data app: the real steps
6:30 What it costs: the official meters
8:00 What it costs: real measurements
10:00 The licensing question nobody has answered
11:00 Should Power BI developers care?
12:45 How to try it safely
```

### Description and tags
Fabric Apps (Rayfin) explained: what Microsoft's new app item in Fabric is, how a data app queries your Power BI semantic model with DAX, what it really costs on your capacity, and whether Power BI developers should switch.

Includes:
- The official pricing meters.
- Community cost measurements.
- The open licensing question for capacities below F64.
- A safe way to try it.

Fabric Apps is in preview; details may change.

Tags: fabric apps, rayfin, microsoft fabric apps, fabric data app, power bi data app, fabric apps pricing, rayfin sdk, power bi vs fabric apps, microsoft fabric 2026, semantic model dax

### Shorts cutdowns

**Short 1: "Fabric Apps in 40 seconds" (~40 s)**
[ON SCREEN: "Power BI devs: Fabric just got web apps"]
"Fabric now has an app item. You describe your data in TypeScript, and Fabric builds the database, the API, sign-in and hosting. There's also a data app template. It queries your Power BI semantic model with DAX and draws any chart you can code. No custom visuals and no SVG hacks. It's in preview, and Microsoft expects you to build it with an AI agent. Full breakdown, including what it costs, on the channel."

**Short 2: "The Fabric Apps cost trap" (~35 s)**
[ON SCREEN: "87% of an F2"]
"Before you build a Fabric App with its own database on a small capacity: one community member measured the database's minimum memory floor at about 87% of an F2 while it's awake. Autopause kicked in after about 25 minutes, not 15. A data app on a semantic model costs about the same as a report. Pick the right kind."

### LinkedIn post
**Fabric Apps won't replace Power BI reports. It will change what a semantic model is for.**

Microsoft's new Fabric Apps (built on the Rayfin SDK, in preview) let you build web apps inside Fabric. The "data app" template queries your semantic model with DAX and renders anything you can code.

What I found going through the docs and community tests:
- Cost: a data app ≈ a report (same DAX meter). An app with its own SQL DB has a memory floor; one tester measured ~87% of an F2 while awake.
- Speed: much faster with a coding agent.
- Risk: no built-in baseline for accessibility, interactions or governance, and agents put business logic in the app.

[Diagram: Semantic model in the center → Power BI report, Data app, Data agent, Excel all querying it]

The winners will be teams with a clean semantic model. Every new front end queries it.

Building one yet?

## Blog version (~800 words)

# Fabric Apps (Rayfin) Explained: What It Is, What It Costs, and Should Power BI Developers Care?

At Build 2026, Microsoft announced **Fabric Apps**, a preview item type for building web applications that run inside Microsoft Fabric. Within weeks, the Fabric community was arguing about it. One Power BI developer said they'd stopped building reports for new work. Another built an inventory-and-orders app in about four and a half hours with GitHub Copilot. And a 60-comment thread asked a licensing question that still has no official answer. Here's what's confirmed, what's measured and what's still open.

## What it is
Per Microsoft Learn:
- **The build model:** Fabric Apps is built on the **Rayfin SDK** and CLI. You define data models in TypeScript with decorators such as `@entity()` and `@text()`. Fabric generates the database schema and a GraphQL API, handles authentication and hosts your front end.
- **Deployment:** `rayfin up` creates child items under the app (a SQL database in Fabric, an authentication service and static content hosting), all behind one endpoint.
- **Sign-in:** after deployment, it's Microsoft Entra SSO only.
- **Requirements:** a tenant admin must enable Fabric Apps, the workspace needs Fabric capacity, and not every region is supported yet.

There are two common shapes:
1. **An app with its own database.** Forms, approvals, write-back and workflow, territory Power Apps covers today. One community member ported a Power App to cut licensing costs. They hit gaps like custom endpoints and file handling, which Microsoft has since started to address with storage support.
2. **A data app.** Microsoft's template connects to a published **Power BI semantic model** and queries it with **DAX**. The front end is React with Vega-Lite visuals. Tabular Editor's explainer notes that queries run under the viewer's own identity, so model security applies.

## What it costs
Microsoft's pricing page (updated September 2026) lists four places an app uses capacity:
- **SQL database:** compute and storage; 1 CU ≈ 0.383 SQL vCores.
- **GraphQL API:** 10 CU per hour of request/response processing time.
- **User Data Functions,** if used.
- **OneLake:** storage and reads/writes for your front-end files.

Hosting, authentication and deployment carry no separate charge "at this time".

A community member measured real usage on an F4 trial:
- **Apps with a database:** cost is dominated by the database's memory floor, about 1.7 CU sustained while online, regardless of users. On an F2 that's roughly 87% of the capacity while awake. Autopause took about 25 minutes, not the documented 15. What you pay for is hours the database is awake.
- **Data apps on a semantic model:** about 2–3 CU-seconds per page load, on the same meter as a Power BI report. A thousand loads a day came to under 2% of an F2.

**Takeaway:** a data app costs about what a report costs. A database-backed app on a tiny capacity needs to sleep most of the day.

## The licensing question
Below F64, Power BI report viewers need Pro or PPU. Fabric Apps aren't a Power BI item type, so people are asking whether an F2 data app could serve users without Pro. **Microsoft hasn't confirmed this.** Don't budget around it. Microsoft *has* announced it's bringing apps to Power BI Pro and PPU customers. Test it in your own tenant and check current licensing terms.

## Should Power BI developers care?
**Yes, but not because reports are dead.**

Where apps win:
- Unlimited visuals.
- Write-back.
- Fast iteration with coding agents (Tabular Editor estimated ~80% less time for a custom-designed dashboard).
- Each visual's DAX is visible and tunable.

Where reports still win:
- Built-in cross-filtering, accessibility and governance.
- One place for business logic.
- Maturity. Deployment pipelines and fuller admin tooling were still announced as coming later in 2026.
- And one hands-on tester found a real bug in AI-generated code that looked fine.

**The practical answer:**
- Keep standard, widely shared reporting in Power BI.
- Prototype a data app where you're fighting the report canvas or need write-back.
- Invest in your semantic model. Every new front end, whether a report, an app or an agent, queries it.

**Try it safely:**
- Use a sandbox workspace.
- Start with a data app.
- Review every DAX file an agent writes.
- Keep calculations in the model.
- Watch the app's line in Capacity Metrics for a week.
