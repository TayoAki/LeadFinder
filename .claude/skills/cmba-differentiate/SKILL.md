---
name: cmba-differentiate
description: "Find the one thing that is true of this business and false of its nearest competitors — the structural differentiator — and write it once to a shared artifact every other CMBA skill reads. Classifies claims SHARED/OURS/THEIRS against fetched competitor copy, then generates candidates from six sources of structural difference when everything obvious is shared, tiers them by what it would cost a rival to copy, and returns an honest NONE when no differentiator exists. Use before any positioning, offer, content or funnel work. Triggers on: what makes us different, differentiation, we sound like everyone else, competitive positioning, why would someone pick us, our UVP could be anyone's, competitor comparison."
---

# CMBA — Differentiate

Derives the differentiator **once**, for the whole suite. Every other skill reads
`differentiators.md`; none re-derives it.

That rule exists because of an observed failure: `cmba-uvp` and `cmba-idea` each ran their own
differentiation check on the same company and produced **two different answers** — single-domain
focus vs. a tested-assembly warranty. Both defensible, neither aware of the other. A company gets
one primary differentiator; whichever artifact the operator reads first wins.

## Why this is a skill and not a step

It has its own input contract (a fetched competitor set), its own artifact, and its own failure
mode (everything comes back SHARED). It also has a legitimate null result, which is the mark of a
real analysis rather than a generator.

## Inputs

- The subject's fetched footprint (per `PROTOCOL.md` — never generate from priors)
- **2–3 competitors, named by URL and fetched.** Not from memory. Not "the industry."

**Choosing the set:** the nearest competitor is *who the buyer actually compares you to*, not who
you would like to be compared to. Aspirational comparison sets are the most common way this
analysis goes wrong — comparing a $400 local service to a national brand makes anyone look
differentiated and tells you nothing.

## Process

### 1. Claim inventory
Tabulate every claim the subject makes and every claim each competitor makes, in **their own
words**, from live copy.

| Claim | Subject | Comp A | Comp B | Verdict |
|---|---|---|---|---|

- `SHARED` — two or more make it
- `OURS` — true of the subject, verifiably false of every competitor in the set
- `THEIRS` — a competitor's, not available to claim
- `DEFICIT` — a competitor claims it and the subject cannot. **Record these.** A deficit is more
  actionable than a weak advantage and is routinely skipped

### 2. If nothing is `OURS` — generate, don't settle

Classification alone fails in the common case, because if the subject already had an obvious
differentiator you would not be running this. Generate candidates from the **six sources of
structural difference.** Each asks what the competitor *cannot* or *will not* do.

| # | Source | Question |
|---|---|---|
| 1 | **Constraint refused** | What constraint have rivals accepted that this business hasn't? (tiered pricing, minimum contracts, seat limits) |
| 2 | **Asset only they have** | What do they own that can't be bought — a list, a dataset, a footprint, a licence, a relationship? |
| 3 | **Cost they'll bear** | What expensive thing do they do that a rival's model can't absorb? (testing every unit, in-house crews, original research) |
| 4 | **Customer they'll refuse** | Who do they turn away? Exclusion is differentiation; breadth is its opposite |
| 5 | **Promise they can honour** | What guarantee would be ruinous for a rival with a different cost structure? |
| 6 | **Method genuinely theirs** | A real proprietary sequence — **not** a renamed commonplace. Naming a generic process is branding, not difference |

### 3. The copy-cost test (this is the load-bearing step)

For every candidate ask: **"What would it cost this specific competitor to copy this, and why
haven't they?"** The answer assigns the tier.

| Answer | Tier | Meaning |
|---|---|---|
| "Nothing — they just haven't" | **COSMETIC** | Not a differentiator. Do not build positioning on it |
| "Something, but they could" | **POSITIONAL** | Real but decaying. **State a shelf life.** |
| "It would break their model" | **STRUCTURAL** | Durable. Build on this |

A structural claim must name the *mechanism* of the conflict — "Plausible cannot offer flat pricing
across unlimited sites without abandoning per-site tiering" — not merely assert difficulty.

### 4. Substitution test
Write the differentiator as one sentence, then put the competitor's name in it. **If it stays true,
it fails.** (This is the same instrument as the Competitor's Website Test used in sales-messaging
work — arrived at independently here, which is mild evidence it's the right test.)

### 5. Verdict — and the null result is a real answer

- **STRUCTURAL** — name it, name the mechanism, build everything on it
- **POSITIONAL** — name it and its shelf life; use it now, plan the structural one
- **NONE** — no differentiator survives. Say so. Then name what the business is *actually*
  competing on: execution, distribution, price, or proximity. **List the deficits.**

A differentiation skill that always finds a differentiator is a rubber stamp, exactly like a
validation skill that always returns GREEN. NONE is a common and useful answer — most businesses
in commoditized local categories genuinely have none, and knowing that redirects effort to
execution and proof instead of a positioning exercise that cannot work.

## Output — `cmba-workspace/<slug>/differentiators.md`

```markdown
# Differentiators — [company]
Competitor set: [url] [url] — fetched [date]. Chosen because the buyer compares against them for [reason].

## Claim inventory
| Claim | Subject | Comp A | Comp B | Verdict |

## Deficits (competitor claims the subject cannot make)

## Candidates and copy-cost
| Candidate | Source (1–6) | What would it cost Comp A to copy? | Tier |

## VERDICT: STRUCTURAL | POSITIONAL | NONE
**The differentiator:** [one sentence]
Mechanism (why a rival can't follow):
Shelf life (positional only):
Substitution test: [sentence with competitor's name] → passes / fails

## If NONE
Actually competing on: [execution | distribution | price | proximity]
Deficits to close first:

## Assumptions & Unknowns
```

## Consumers

Every skill reads this and **does not re-derive**: `cmba-uvp` (step 3b), `cmba-offer` (step 1c),
`cmba-idea`, `cmba-content`, `cmba-journey`, `cmba-leadmagnet`, `cmba-email`.

If `differentiators.md` is missing, a consuming skill runs this one first or states explicitly that
it is proceeding without a differentiator — it never invents one inline.

## Evaluation

**Rubric (0–4 each, 20 total). Pass ≥15, no dimension <2.**

| # | Dimension | 0 | 2 | 4 |
|---|---|---|---|---|
| 1 | **Faithfulness** | Asserted differentiator | Inventory done | Inventory + generation + copy-cost tiering + substitution test + verdict |
| 2 | **Competitor realness** | Unnamed or from memory | Named, paraphrased | 2–3 fetched by URL, verbatim claims, set justified as who the buyer actually compares |
| 3 | **Structural depth** | Tier asserted | Tier stated | Copy-cost answered per competitor; STRUCTURAL claims name the mechanism of the conflict |
| 4 | **Honest null** | Manufactures an advantage | Hedges | Returns NONE where true, names what they actually compete on, and lists deficits |
| 5 | **Falsifiability** | Unverifiable claim | Checkable | Claim is checkable against live copy; positional claims carry a shelf life |

**Kill check (two):**
1. A differentiator asserted without a fetched competitor claim to contrast against
2. A **COSMETIC** claim promoted to STRUCTURAL — i.e. the copy-cost answer is "nothing, they just
   haven't" and it was built on anyway

**Control:** run the substitution test in front of a reader who knows the category. If they can name
a competitor the sentence also describes, it fails regardless of internal reasoning.

## Failure modes

- **Aspirational comparison set.** Comparing a local operator to a national brand manufactures a
  false advantage. Compare to who the buyer actually calls second.
- **Branding a commonplace.** Naming your process "The Clarity Method" is not source 6.
- **Skipping deficits.** Observed: a subject's two candidate differentiators were both matched by a
  competitor who *also* had more reviews and a stronger guarantee. The deficit was the finding.
- **Refusing NONE.** The pressure to produce an answer is exactly what produces category positioning.
