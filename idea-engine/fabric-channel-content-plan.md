# Microsoft Fabric Channel: Content Plan

2026-11-09. Built from:
- **Creator outlier research:** data-engineering-creators.md.
- **US Google volumes for 55 Fabric keywords** (DataForSEO).
  - × = last 12 months vs the prior 12.
  - CPC = what advertisers pay per click, a proxy for buyer value.
- **The full upload list of the channel to model** (below).

Google volume undercounts YouTube demand for tutorials. Use it to rank topics against each other, not as YouTube views.

## The creator to model: Will, "Learn Microsoft Fabric with Will" (@FabricFrontiers)
**Why him, on the numbers:**
- **Only Fabric-native outlier in the dataset:** 521K views on a 42.8K-sub channel (12×). Guy in a Cube is bigger (562K subs), but its Fabric videos run 0.0–0.6× subs. That's an established brand, not a repeatable format.
- **Not a one-hit:** his top four videos are all 4–12× subs:

  | Views | Video |
  |---|---|
  | 521K | Fabric fundamentals in 38 min |
  | 254K | DP-600 full course, 6 h |
  | 214K | Fabric for Power BI developers, 3.5 h |
  | 174K | DP-700 full course, 6 h |

- **A small creator can copy his formula:**
  - Time-boxed fundamentals.
  - Full certification courses, plus the same course cut into a numbered series (DP-600 "Video 1 of 12" = 95K).
  - "X vs Y vs Z" decision videos (pipeline vs dataflow vs notebook = 56K; warehouse vs lakehouse vs KQL = 53K).
  - A Power BI → Fabric bridge.
- **The opening:** his hits are 1–3 years old. His newest video ("Building a Fabric data platform in 2026") has 18.7K views. Fabric has shipped a lot since (data agents, mirroring, SQL database, Copilot), and nobody has refreshed the cornerstone courses for 2026.

**Learn from him:** the formats and the exam-series structure.
**Do better on:**
- 2026 freshness.
- Topics growing in search that he hasn't covered (data agents, medallion, pricing).
- Short-form, which he barely does and where Fabric is nearly empty.

**Secondary model for titles: jayzern.** Two 20× videos on a 23.5K channel. Steal two formats:
- "Code along: build X in 1 hour."
- "How I would learn X if I started over."

## What people search (US Google, monthly)
| Topic | Volume | × | CPC | Read |
|---|---|---|---|---|
| power bi | 368,000 | 0.95 | $10 | The feeder audience. Bridge content wins |
| microsoft fabric | 22,200 | 0.98 | $12 | Head term, stable |
| fabric warehouse | 12,100 | **1.16** | $1 | Growing |
| delta lake | 12,100 | **1.19** | $11 | Growing; core concept |
| onelake | 8,100 | 0.99 | $3 | |
| medallion architecture | 6,600 | **1.30** | $13 | Growing fast at real volume |
| what is microsoft fabric | 4,400 | **1.15** | $6 | |
| semantic model | 3,600 | 1.13 | $12 | |
| power bi semantic model | 1,600 | **1.57** | **$34** | Growing + high value; also the top LinkedIn post (5.6K reactions) |
| kql | 2,900 | 1.08 | $3 | |
| dp-600 / dp-700 | 1,000 each | 0.9 | $7–11 | Steady exam demand; proven on YouTube (254K / 174K) |
| fabric mirroring | 1,000 | 1.03 | $1 | Newer feature |
| fabric data agent | 720 | **2.27** | $13 | **Fastest-growing term in the set** |
| microsoft fabric pricing | 720 | 0.76 | **$50** | Buyer intent (consulting leads) |
| fabric vs databricks | 170 | 1.32 | $37 | Comparison; buyer intent |
| fabric vs snowflake | 90 | 1.43 | **$93** | Small but very high value |
| lakehouse vs warehouse | 140 | 1.43 | – | Proven on YouTube (53K) |
| dataflow gen2 | 140 | 1.25 | $11 | |
| fabric f64 | 70 | 0.9 | **$119** | Capacity buyers |

**Shrinking (avoid as headline topics):**
- pyspark 0.68×, azure data factory 0.84×, synapse 0.60×
- power bi tutorial 0.59×, azure data engineer 0.41×

These old Azure stack terms are moving to Fabric, which is the story to tell: "Synapse/ADF → Fabric."

## Content pillars
1. **Cornerstone courses (the outlier engine, ~20% of uploads, biggest views)**
   - Time-boxed, beginner, updated for 2026.
   - Long courses rank for years; Will's are 1–3 years old and still pulling.
2. **Decision videos, "X vs Y" (proven 50K+ on Fabric, highest CPC)**
   - Warehouse vs lakehouse, Fabric vs Databricks/Snowflake, pipeline vs dataflow vs notebook.
3. **Growing-concept explainers (catch rising search)**
   - Medallion architecture, delta lake, semantic models / Direct Lake, data agents, mirroring, OneLake.
4. **Code-along projects (the jayzern / Thomas Hass format)**
   - "Build an end-to-end Fabric platform in 1 hour", with the stack in the title.
5. **Power BI → Fabric bridge (the 368K-searches audience)**
   - Will's 3.5 h course for Power BI developers has 214K views.
6. **Cost and architecture for decision-makers (low views, high-value viewers)**
   - Pricing, F-SKU sizing, Synapse/ADF migration.
   - Bring in consulting or product leads.

## First 12 weeks: one long-form video a week
| Wk | Title | Pillar | Why |
|---|---|---|---|
| 1 | **Microsoft Fabric in 40 Minutes (2026 Beginner Crash Course)** | 1 | Will's 12× format; his version is 2 years old |
| 2 | Lakehouse vs Warehouse vs Eventhouse in Fabric: Which One? (2026) | 2 | 53K proven; "fabric warehouse" 12.1K, 1.16× |
| 3 | Medallion Architecture in Microsoft Fabric, Explained + Built | 3 | 6,600, 1.30× |
| 4 | **Code Along: Build an End-to-End Fabric Data Platform in 1 Hour** | 4 | jayzern 20× format; no current Fabric version |
| 5 | Fabric Data Agents: Chat With Your Lakehouse (Full Setup) | 3 | **2.27×**, fastest-growing |
| 6 | Power BI Semantic Models + Direct Lake: The Complete Guide | 3/5 | 1.57×, $34 CPC; top LinkedIn topic |
| 7 | **DP-700 Full Course 2026 (Fabric Data Engineer)**, also cut into a numbered series | 1 | 174K proven; exam outline has moved on since his version |
| 8 | Microsoft Fabric vs Databricks vs Snowflake (honest 2026 comparison) | 2 | $37–93 CPCs, growing |
| 9 | From Power BI Developer to Fabric Engineer: The Roadmap | 5 | 214K / 73K proven; also "data engineer roadmap" |
| 10 | Microsoft Fabric Pricing Explained: F2 to F64, What You'll Really Pay | 6 | $50 and $119 CPCs |
| 11 | Pipeline vs Dataflow Gen2 vs Notebook vs Mirroring: When to Use Each | 2 | 56K proven, plus mirroring and dataflow gen2 1.25× |
| 12 | **DP-600 Full Course 2026**, plus the series | 1 | 254K proven |

**Each long-form video is cut into:**
- **3 Shorts/TikToks/Reels.**
  - One concept in 45 seconds ("Lakehouse vs warehouse in 30 seconds"), or a "Fabric feature you didn't know" tip.
  - Fabric is almost absent on short-form (only @lifebygelique, 90K, in our results). Day-in-the-life and career angles get 1–2.6M views in the wider data niche.
- **2–3 LinkedIn posts:** a diagram plus an opinion.
  - Semantic models and Fabric architecture perform best there (5.6K and 570 reactions).

## Title and thumbnail rules (from the outliers)
- **One tool + a time limit + an audience:** "in 40 minutes", "for beginners", "2026".
- **The stack in the title for projects:** "Lakehouse + Pipelines + Power BI".
- **"Which one?" / "When to use each" for comparisons.** Show the 3 logos side by side.
- **Mark courses "FULL COURSE (6 hours)".** Long length is a feature for exam viewers.
- **Number series videos "Video 1 of 12".** Will's intro video in the series got 95K, almost twice the next video.

## What to measure (first 90 days)
- **Views ÷ subs per video.** The goal is to hit 5× on at least one cornerstone video by week 12.
- **Search traffic share in YouTube Studio.** Cornerstone and comparison videos should be >50% search.
- **Shorts → subscriber conversion.** It tells you whether short-form is the growth lever here like it is in the wider data niche.
- **Inbound from the pricing and comparison videos.** These have the highest buyer value.
