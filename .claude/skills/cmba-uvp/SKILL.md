---
name: cmba-uvp
description: "Build a differentiated unique value proposition using the Creator MBA 5-step process — value statement, objections and aspirations, levels-deeper demographics/psychographics, movement and enemy statement, then assembly. Use when positioning is vague, when someone sounds like everyone else in their niche, when writing a tagline/about section/hero copy, or when auditing a real company's positioning. Triggers on: write my UVP, fix my positioning, why do I sound generic, differentiate my brand, value proposition, what makes me different."
---

# CMBA — Unique Value Proposition

Turns a business idea into positioning that makes the operator the obvious choice for one
specific person. Five steps, run in order. The assembled UVP is a paragraph, not a tagline —
it is the source text everything else (profiles, site, content, offers) is cut from.

## Inputs

Reads `cmba-workspace/<slug>/idea.md` if present. Otherwise needs: who they help, what they help
them do, what outcome results, and any real credential/experience.

## Process

### Step 0 — Applicability check (run before anything else)

This framework assumes a specific shape of business. Check it before generating, because the
process will produce fluent, confident, plausible positioning for a business it does not fit —
and a fluent wrong answer is worse than a refusal.

| Precondition | Holds? |
|---|---|
| There is an identifiable operator or brand the buyer forms a relationship with | |
| The channel is direct — seller to buyer, without an intermediary owning the relationship | |
| Content/audience-led acquisition is plausible for this buyer | |
| The offer can be packaged and priced by one operator | |

**Verdict — required output, one of:**
- **APPLIES** (4/4, or 3/4 with the gap named) — proceed
- **PARTIAL** — proceed, but you must state (a) which parts transfer, (b) which downstream CMBA
  skills must *not* be run and why, and (c) what the real constraint on this business actually is
- **DOES NOT APPLY** (≤1/4) — **refuse to generate the UVP.** Say what framework would fit instead

On PARTIAL, strip the first-person creator voice. "I help…" is wrong for a business whose buyer
never meets the operator; the same positioning becomes third-person enablement copy.

### Step 1 — Value statement
`I help [WHO] do [WHAT] so they can [OUTCOME].`

The bar: a person outside the target must be able to **self-exclude** from this sentence.
- Fail: "I help people book vacations so they can spend time together."
- Pass: "I help families find an easy way to book discounted luxury travel deals so they can
  spend quality time with their kids."

Test every noun. "People" → who exactly. "Businesses" → what size, what stage, what pain.

### Step 2 — Objections and aspirations
**Objections** (4–6): what the ideal customer says to say *no*. Fears, worries, disbelief,
prior bad experience. Written in their voice, first person.

**Aspirations** (3–5): what a 10/10 sounds like — about the *process* ("that was so easy") and
about the *outcome* ("it was actually affordable", "it was truly luxurious"). Single words or
short phrases; these become adjectives in the final assembly.

Best source is real customer language. If none exists, mark these as hypotheses in the
Assumptions block — do not present them as findings.

### Step 3 — Go levels deeper
Five questions, then rank 1–5 by importance and keep the top three.

1. Who, more specifically? (families → families with kids who want to travel *with* their kids)
2. Demographic? (age, gender, income, education, stage — or N/A)
3. What kind of solution does that demographic require? (affordable / bespoke / high-end / fast)
4. Psychographics? (shared values, attitudes, identity)
5. Does geography matter? (usually N/A online)

Show the ranking and the cut. Keeping all five is a failure — the discipline is the point.

### Step 3b — Differentiation (read, do not derive)

Step 3 narrows the audience. This step narrows against a *named rival* — without it the process
reliably produces category positioning that is equally true of every competitor.

**Read `cmba-workspace/<slug>/differentiators.md`.** Do not run your own competitor analysis here;
two skills independently answering "what makes this company different" produce two different
answers for the same company, and whichever artifact gets read first wins.

If the file does not exist, **run `cmba-differentiate` first.**

Then act on its verdict:

| Verdict | What the UVP does |
|---|---|
| **STRUCTURAL** | The differentiator becomes a load-bearing clause in the assembly. Everything else supports it |
| **POSITIONAL** | Use it, and state the shelf life in the Assumptions block. Do not build the movement statement on something with an expiry date |
| **NONE** | **Do not manufacture one.** Build the UVP on audience narrowness, the enemy, and proof instead — and say plainly in the output that positioning is not this business's lever. Name the deficits from `differentiators.md`; closing those beats any wording change |

**An assembly that asserts a differentiator not present in `differentiators.md` does not pass.**

### Step 4 — Movement / enemy statement
Shine a light on the problem and give the customer something to fight that **is not them and is
not a person**. The enemy is an industry, an ethos, a default way of doing things.

Blair Warren's line is the engine: *people will do anything for those who encourage their dreams,
justify their failures, allay their fears, confirm their suspicions, and help them throw rocks at
their enemies.*

Format: `[Enemy] does [harmful thing]. That means [consequence for your customer]. Until now.`

### Step 5 — Assemble
Order matters. Assemble in this sequence:

1. **Movement statement** (enemy first — it earns attention)
2. **Aspirations + one deep-dive element** ("But I've created an easy way to book truly luxurious
   vacations you can take with your kids at a price you can actually afford")
3. **Value statement, twisted** — restated with more texture
4. **Life experience / proof** (optional — omit entirely if none exists; never fabricate)
5. **Objection-crushing close** — the final sentence answers the objections from step 2

Colour-code or label each clause in the output so the lineage back to the five steps is visible.

## Output format

```markdown
# UVP — [company/person]

## Step 0 — Applicability
| Precondition | Holds? | Evidence |
**Verdict:** APPLIES / PARTIAL / DOES NOT APPLY — [n]/4
(if PARTIAL) Transfers: | Does not transfer: | Real constraint on this business:

## Step 1 — Value statement
> I help ___ do ___ so they can ___.
Self-exclusion test: who reads this and correctly walks away?

## Step 2 — Objections / Aspirations
| Objection (their voice) | Aspiration |

## Step 3 — Levels deeper
| # | Question | Answer | Rank |
Kept: 1, 2, 3 → [three elements]  Cut: [two] and why

## Step 3b — Differentiation check
Competitors checked: [url], [url]
| Element | SHARED / OURS / THEIRS | Evidence from their live copy |
`OURS` element carried into the assembly: [which one]

## Step 4 — Movement statement
> [Enemy] ... Until now.

## Step 5 — Assembled UVP
[full paragraph, with each clause labelled: MOVEMENT / ASPIRATION / VALUE / PROOF / OBJECTIONS]

## Derivatives
- LinkedIn tagline (max 220 char):
- Site hero (headline + subhead):
- One-line intro for podcasts/DMs:

## Assumptions & Unknowns
```

## Evaluation

**Rubric (0–4 each, 20 total). Pass ≥15, no dimension <2.**

| # | Dimension | 0 | 2 | 4 |
|---|---|---|---|---|
| 1 | **Faithfulness** | Skipped steps, or no Step 0 applicability verdict | All steps present, assembly loose | Step 0 verdict rendered with evidence, 5 steps + 3b run in order, top-3 ranking enforced with visible cuts, assembly labelled by clause |
| 2 | **Self-exclusion** | Anyone could be the customer | Audience named but broad | A named non-customer group would read it and correctly walk away |
| 3 | **Enemy + differentiation** | No enemy, or the customer is blamed | Valid enemy but every claim is `SHARED` with the named competitors | Enemy is specific, non-human, harm stated as a consequence the customer has felt — **and** at least one `OURS` element survives into the assembled paragraph |
| 4 | **Objection coverage** | Closing line ignores objections | Some overlap | Every step-2 objection is answered somewhere in the assembled paragraph — traceable |
| 5 | **Falsifiability** | Aspirations/objections presented as fact with no source | Hedged | Clearly marked which are evidence-based vs. hypothesis, with the exact question to ask a real customer to confirm |

**Kill check (two):**
1. Fabricated proof — invented years of experience, client counts, results. Zero the run. Absence
   of proof is handled by omitting clause 4, never by inventing it.
2. A UVP generated with no Step 0 verdict, or generated in first-person creator voice for a
   business scoring PARTIAL or below. Observed on Swagelok v1: scored 15/20 and was still the
   wrong deliverable. Zero the run.

**Control comparison:** put the generated UVP beside the company's current homepage hero. If a
reader can't tell which is which, or the generated one is *less* specific, cap at 10.

**Substitution test (hard fail):** replace the company name with its nearest competitor's and
re-read. If the paragraph is still true, the output is category positioning and fails regardless
of score. Step 3b exists to prevent this.

## Failure modes seen in testing

- **Category positioning** — every claim is shared with the nearest competitor. Observed on
  Fathom Analytics v1: all five positioning elements were also true of Plausible. The
  differentiator (flat price across unlimited sites, forever retention) was sitting on their own
  pricing page and the process never asked for it. This is why Step 3b is mandatory.
- Producing a tagline instead of a paragraph, losing the objection-crushing close
- Enemy = "other agencies" (a person/competitor) instead of an ethos or industry default
- Keeping all five deep-dive elements, which re-broadens what step 1 narrowed
- Aspirations written as marketing adjectives ("premium", "world-class") instead of customer
  speech ("wow that was easy", "it was actually affordable")
- Objections listed in Step 2 that never get answered in the assembly — trace each one
