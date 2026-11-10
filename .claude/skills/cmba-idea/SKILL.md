---
name: cmba-idea
description: "Generate and score business ideas using the Creator MBA framework — four idea sources (practical experience, learned obsession, what people ask you for, problems you solved), the three profitable markets (health/wealth/relationships), the six outcomes, and the six-lens scorecard. Use when someone needs a business idea, is deciding between ideas, or has an existing business that may not be aligned to a profitable market. Triggers on: what business should I start, help me pick an idea, is this a good business idea, validate my niche, score my business ideas."
---

# CMBA — Business Idea & Market Fit

Produces 5–7 candidate ideas, each mapped to a profitable market and an outcome, scored through
six lenses, with one recommendation and the reasoning that beat the runner-up.

## When to use

- Someone has skills/experience but no business
- Someone has a business that isn't gaining traction and the idea itself may be the problem
- Someone is choosing between two or more directions
- You are auditing a real company and want to know whether its premise sits in a paying market

## Inputs

Required: background (work history, obsessions, what people ask them for, problems they solved).
For a company audit: the site, what they sell, who they say it's for.

If run against a real company, gather the facts from the public footprint first — do not ask
the user to summarize a company you can read yourself.

## Process

### 0. Applicability + entity switch (run first)

Four preconditions — identifiable operator or brand · direct channel · content-led acquisition
plausible · one operator can package and price the offer. Verdict: `APPLIES` / `PARTIAL` /
`DOES NOT APPLY`. On PARTIAL, name which downstream CMBA skills must not run.

Then branch on **subject type**, because the harvest sources below are person-shaped and produce
nothing for an organization:

**Person** → use the four personal sources in step 1.
**Organization** → substitute the four organizational sources:

| Source | Question |
|---|---|
| Proven capability | What does this org demonstrably do better than its category? |
| Underused asset | What do they already own — data, network, tooling, channel, content — that isn't monetized? |
| Repeated inbound request | What do customers keep asking for that isn't in the catalog? |
| Solved-internally | What problem did they build a solution to for themselves? |

The overlap rule applies identically across whichever four sources are in play.

### 1. Harvest from four sources
For each source, produce 2–3 raw candidates. Do not merge sources yet — overlap between sources
is itself the signal.

| Source | Question |
|---|---|
| Practical experience | What did you do at work, and do well? |
| Learned obsession | What can't you stop reading/watching/learning about? |
| Inbound advice | What do friends, peers, colleagues come to you for? |
| Solved-for-self | What problem did you fix in your own life? |

**Overlap rule:** if the same answer appears in 2+ sources, flag it. Same answer in 3+ sources is
the default recommendation unless a lens score kills it.

**Degenerate-harvest stop:** if fewer than two sources produce candidates, the overlap rule — the
only mechanism that picks a winner — is unavailable. Say so and stop. Do not proceed to score a set
the framework cannot discriminate between; the scorecard will flatten and produce a false
recommendation. Observed on Swagelok v1: four of five candidates came from one source, scores
spanned 2 points across five candidates, and every idea landed in Wealth.

### 2. Force market alignment
Every candidate must attach to one of three markets and at least one of six outcomes. A candidate
that cannot attach is cut, not softened.

Markets: **Health · Wealth · Relationships**

Outcomes: make money · save money · save time · become fitter/healthier ·
become more attractive/dateable · feel approval or peace of mind

Write the chain explicitly: `skill → mechanism → outcome → market`.
Example: `better landing pages → higher conversion → customers make more money → Wealth`.

Two-market candidates (e.g. wardrobe → attractive → Relationships *and* Health) get a note, not
bonus points. Breadth here is a tiebreaker only.

### 3. Persistence check
Five questions. Any "no" is recorded, not fatal, except Q1.

1. Do I actually like doing this? *(a "no" cuts the candidate)*
2. Am I interested in learning more about it?
3. Will I still like it 6–12 months from now?
4. Is there natural expansion into adjacent areas? (name two)
5. What's my unique angle — why me?

### 4. Six-lens scorecard
Score each surviving candidate 1–5 per lens. Show the table.

**Forced-spread rule.** The scorecard exists to *separate* candidates. If it doesn't, it has told
you nothing and the recommendation is arbitrary.

- Every candidate must receive **at least one score of 1 or 2**. A candidate with no weakness has
  not been examined.
- **Totals must span at least 6 points** across the candidate set. If they don't, the lenses are
  not discriminating — go back and score against the *strongest* candidate rather than in the
  abstract. "Is this more scalable than idea 3?" beats "is this scalable?"
- If two candidates land within 2 points of each other, write the one sentence that separates them.
  If you can't, merge them — they are the same idea.

Observed on Swagelok v1: five candidates spanned 20–22, which made the recommendation a coin flip
dressed as analysis.

| Lens | Question |
|---|---|
| Clarity | Can a stranger understand what this is in one sentence? |
| Usability | Can a customer act on it without you present? |
| Stability | Does demand persist beyond a trend cycle? |
| Scalability | Can it grow without your hours growing 1:1? |
| Stickiness | Is there a reason to come back or stay subscribed? |
| Profitability | Will someone pay, and how much, today? |

### 5. Recommend
One pick. State: the chain, the score, the runner-up, and the single fact that would change the
recommendation if it turned out to be false.

**Read `cmba-workspace/<slug>/differentiators.md` before recommending.** Do not derive a
differentiator here — this skill and `cmba-uvp` once produced two different answers for the same
company. If the file exists, the recommendation should be the candidate the differentiator makes
*easier to defend*; if it points elsewhere, say why explicitly. If it doesn't exist, state that the
recommendation is un-differentiated and run `cmba-differentiate` next.

## Output format

```markdown
# Business Idea Analysis — [name/company]

## Step 0 — Applicability & entity
Verdict: APPLIES / PARTIAL / DOES NOT APPLY — [n]/4
Subject type: person | organization → sources used: [personal | organizational]
Sources that produced candidates: [n]/4 (fewer than 2 → stop)

## Candidates
### 1. [Idea]
- Source(s): practical experience, inbound advice  ← overlap: 2
- Chain: [skill] → [mechanism] → [outcome] → [Market]
- Angle: [why this person specifically]
[...5–7 total]

## Cut list
| Candidate | Why cut |

## Scorecard
| Idea | Clarity | Usability | Stability | Scalability | Stickiness | Profitability | Total |

## Recommendation
**[Idea]** — [2–3 sentences of reasoning]
Runner-up: [idea] — lost on [lens]
Kill condition: this recommendation is wrong if [specific falsifiable fact]

## Assumptions & Unknowns
- [what you inferred vs. what you verified]
```

## Evaluation

**Rubric (0–4 each, 20 total). Pass ≥15, no dimension <2.**

| # | Dimension | 0 | 2 | 4 |
|---|---|---|---|---|
| 1 | **Faithfulness** | Ideas listed with no framework | Markets/outcomes named but chains vague | All four sources harvested, every chain written `skill→mechanism→outcome→market`, six lenses scored |
| 2 | **Specificity** | "Help businesses grow" | Named audience, generic outcome | Audience specific enough that a non-member self-excludes; outcome quantified or concrete |
| 3 | **Discrimination** | All candidates score within 2 points | Some spread | Scorecard actually separates candidates; the cut list has real cuts with reasons |
| 4 | **Non-genericity** | Output would fit any person/company | Some personal detail | Ideas are unreachable without this person's specific history/assets |
| 5 | **Falsifiability** | No kill condition | Vague risk noted | A named, checkable fact that would overturn the recommendation |

**Kill check:** any invented fact about the subject (fake revenue, fake credentials, fake audience
size) presented as known. Also: proceeding to a scorecard when fewer than two sources produced
candidates. Zero the run.

**Control comparison:** for a real company, compare the recommendation against what the company
actually sells. If the skill "recommends" what they already do with no new angle, it scored on
description, not analysis — cap at 10.

## Failure modes seen in testing

- Collapsing all four sources into one blended paragraph, which hides the overlap signal
- Attaching every idea to Wealth because Wealth is easiest to argue — check whether Health or
  Relationships is the truer market
- Six-lens scores clustered at 3–4 (flattery). Force at least one 1 or 2 per candidate
