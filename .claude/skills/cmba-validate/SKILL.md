---
name: cmba-validate
description: "Validate a business idea with real external evidence using the Creator MBA techniques — private communities, the 30-for-30 exchange, social listening (Google Alerts / X search / Reddit), and structured market surveys. Produces an evidence pack that can kill the idea, not just support it. Use when someone has an idea but no proof, when demand is assumed, or before building an offer. Triggers on: validate this idea, is there demand for, do people actually want this, market research, prove there's a market, before I build this."
---

# CMBA — Market Validation

The transcript's warning is the spine of this skill: *you can never 100% validate an idea, you can
only collect indicators.* So the deliverable is an **evidence pack with a verdict**, not a pitch.
This skill must be able to return "no signal — do not build."

## Inputs

The idea (ideally `cmba-workspace/<slug>/idea.md`), the target customer, and the claimed problem.

## Process

### 1. Write the falsifiable claim
Before any searching, state the claim in a form that can fail:

> *[Specific audience] currently experiences [specific problem] badly enough that they are
> already spending [money / time / effort] trying to fix it.*

Everything below either supports or breaks this one sentence.

### 2. Quantitative signals (data)
Run actual searches. Record queries and raw findings, not summaries.

- **Search-intent scrape**: questions people type — AnswerSocrates / AnswerThePublic style
  question sets, Google autocomplete stems, YouTube "most popular" on channels in the niche
- **Community volume**: Reddit / Discord / Slack / Facebook / Circle groups where the audience
  lives. Record subreddit names, member counts, and 3+ real threads with upvote/comment counts
- **Existing spend**: are there competitors, and at what price? Someone already charging is the
  strongest single signal. Record names and prices.
- **Social listening setup**: the exact Google Alerts strings and saved-search queries to leave
  running (combine a problem word + a niche word, e.g. `"challenges" + "solopreneur"`)

  ⚠ **Cost note.** The source material teaches this with TweetDeck and presents it as free.
  TweetDeck is now **X Pro and is no longer free** — it sits behind X Premium+ at **$40/month**
  (~$480/yr) `[verified: 2026-07-28]`. Do not describe column-based monitoring as a free tactic.
  Free alternatives that preserve the mechanism: Google Alerts, native platform saved searches
  checked on a schedule, RSS on subreddit/forum search URLs, and YouTube/blog comment monitoring.
  Name the real cost or the real substitute — never inherit the premise.

### 3. Qualitative signals (words)
- Pull **verbatim quotes** — 5–10 minimum — from real threads, reviews, comments. Verbatim
  matters: this language becomes UVP aspirations, landing page copy, and email subject lines.
- Identify the **30-for-30 targets**: 5–10 named, reachable people or accounts who have publicly
  described this problem. Include where they said it and a one-line opener.
  The exchange: *30 minutes learning their challenges, 30 minutes of your time solving them free.*

### 4. Survey instrument
Draft the survey they should run. Rules from the transcript:
- Multiple choice first (people finish those), free text last
- The single most important question is **biggest challenge**, with 4–5 pre-written options that
  prove you understand them, plus "Other"
- Also ask: where are they on the journey, what have they tried, what format do they prefer
  (course / coaching / service / cohort)
- One open-ended question at the end — this is where the unexpected product ideas live

### 4b. When a source is unreachable

Community sources are frequently inaccessible — blocked crawlers, login walls, private Slacks.
Do not paraphrase around the gap and do not invent. Work down this ladder:

`community forums → X / LinkedIn threads → YouTube comments → review sites (G2, Trustpilot, app
stores) → the operator's own support and sales transcripts`

If none yield, declare a named **`GAP`** and assign it as a human task, stating exactly what to
collect and where. A declared gap is a valid deliverable; a filled-in guess is not.

Observed: Reddit was unreachable in one environment, producing zero verbatim quotes and zero
30-for-30 targets. The run was still useful — because it said so.

### 5. Verdict
One of three, with the evidence that drove it:

**Hard rule — a verdict may not be GREEN on quantitative evidence alone.** Competitor pricing and
community volume prove a *market* exists. Only customer language proves the *pain is felt*, and
those are different claims. Quant-only evidence caps the verdict at AMBER, no matter how strong.

- **GREEN** — problem is stated in the audience's own words, someone is already paying to fix it,
  and ≥5 reachable people to talk to
- **AMBER** — problem exists but no evidence of spend, or the preferred solution format differs
  from what's planned (e.g. they want coaching, you're building a course). State the pivot.
- **RED** — no discoverable community, no verbatim complaints, no competitor. Do not build.

## Output format

```markdown
# Validation — [idea]

## Falsifiable claim
> ...

## Quantitative signals
| Signal | Source | Raw finding |
Competitors & prices:
Search-intent questions (10+):
Alerts to leave running:

## Qualitative signals
### Verbatim quotes
> "..." — r/subreddit, 641 upvotes, [date]
### 30-for-30 targets
| Person/account | Where they said it | Opener |

## Survey instrument
[full draft, multiple choice + one open]

## Verdict: GREEN / AMBER / RED
Evidence for:
Evidence against:
The single cheapest next test:

## Assumptions & Unknowns
```

## Evaluation

**Rubric (0–4 each, 20 total). Pass ≥15, no dimension <2.**

| # | Dimension | 0 | 2 | 4 |
|---|---|---|---|---|
| 1 | **Faithfulness** | Generic "do market research" advice | Some techniques used | Claim stated first; quant + qual + survey + 30-for-30 all present; verdict rendered |
| 2 | **Evidence realness** | No sources, or invented quotes | Named sources, paraphrased | Verbatim quotes with locatable attribution (subreddit/thread/date/engagement), named competitors with real prices |
| 3 | **Disconfirmation** | Only supporting evidence | Risks mentioned | Actively searched for and reported evidence *against* the claim |
| 4 | **Actionability** | "Talk to customers" | Some targets | 5+ named reachable targets with openers; survey is copy-paste ready |
| 5 | **Falsifiability** | Verdict unjustified | Verdict stated | Verdict tied to explicit thresholds, plus the cheapest single test that would flip it |

**Kill check:** fabricated quotes, fabricated subreddits, invented engagement numbers, or
competitor prices that aren't real. This is the highest-risk skill for hallucination — every
quantitative claim must be traceable or explicitly labelled `UNVERIFIED`. Zero the run otherwise.

**Control comparison:** if the verdict is GREEN for every idea it's ever run on, the skill is
broken. Track the GREEN/AMBER/RED distribution across the test set; a healthy skill returns
non-GREEN at least a third of the time.

## Failure modes seen in testing

- Confusing *interest* with *spend*. Upvotes are interest. A competitor's pricing page is spend.
- Summarizing quotes into marketing language, destroying the verbatim value
- Skipping the "evidence against" section entirely
- Recommending a survey without writing it
