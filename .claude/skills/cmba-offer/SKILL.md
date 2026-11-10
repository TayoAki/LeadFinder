---
name: cmba-offer
description: "Design offers and an offer ladder using the Creator MBA stacked-offer framework — the size x niche axis to pick the right business model, the northern vs southern route, and the four-part offer construction (specific achievement, likelihood via outcome statement + relevant testimonial + guarantee, accelerants, fascinations). Use when someone needs to price or package a service or product, has an audience but no revenue, or wants to add a second revenue stream. Triggers on: build my offer, what should I sell, pricing, package my service, offer ladder, monetize my audience, I have followers but no revenue, create a course."
---

# CMBA — Offer Architect

Two jobs: pick the **right business model for where you actually are**, then build **one offer**
properly. The transcript's core correction: large audiences don't guarantee revenue — mismatched
business models are why 300k-follower accounts get stuck at $5k/month.

## Process

### 1. Plot on the size × niche axis
Axes: small ↔ large audience, broad ↔ niche topic.

| Quadrant | Viable models |
|---|---|
| Small + broad | inexpensive courses ($25-ish) |
| Small/mid + **niche** | **medium-ticket service**, freelance, paid workshops, 1:1 and cohort coaching |
| Large + broad | books, newsletter sponsorships, holding co / partnerships (creative, slow) |
| Large + **niche** | flagship courses ($150–$1,000), high-value sponsorships, subscription email, coaching |

State the current quadrant with evidence (follower count, topical breadth of last 20 posts).

### 1b. Ladder inventory (required, before any recommendation)

Enumerate every rung the subject **already operates**, with a price and a confidence tag. You
cannot recommend a next rung without knowing which rungs are occupied — and "I didn't see it on
the homepage" is not the same as "it doesn't exist."

| Rung | Offer | Price | `CONFIRMED` / `INFERRED` / `UNKNOWN` | Source |

Rules:
- The recommendation must be a rung tagged **absent**
- If "absent" rests on `INFERRED` (i.e. you inferred it from a homepage), then the **first action
  is confirming it**, not building it. Say so explicitly.
- Never recommend a rung the subject already runs. Improving an existing rung is a valid output —
  but it must be labelled as improvement, not as a new revenue stream.

### 1c. Differentiation (read, do not derive)

**Read `cmba-workspace/<slug>/differentiators.md`.** If it doesn't exist, run `cmba-differentiate`
first. Do not run a competitor analysis inside this skill — the answer must match the one every
other artifact is using.

The offer must **express** the differentiator, not restate the category:

| Verdict | What the offer does |
|---|---|
| **STRUCTURAL** | The offer's core mechanism *is* the differentiator, or is only possible because of it |
| **POSITIONAL** | Build it, and note the shelf life against the offer's payback period. An offer that takes 12 months to pay back on a differentiator with a 6-month life is a bad trade |
| **NONE** | Compete on execution and proof, not positioning. Price and guarantee become the levers, and the offer must be honest that the market cannot tell providers apart |

An offer that survives being reassigned to a competitor unchanged is a category offer.

### 2. Choose the route
- **Northern route** (get big, stay broad) — big ceiling, but a long revenue gap in the middle
- **Southern route** (get big *and* narrower) — recommended default: medium-ticket service →
  coaching/workshops → high-ticket service → flagship course → subscription MRR → sponsorships

Recommend one and name the next single rung, not the whole staircase.

### 3. Model the ladder in revenue
Do the arithmetic the transcript does. Example shape:
workshop $400 × 10/mo = $48k → + course $150 × 5/wk (+$19 upsell) ≈ $40k → + newsletter
sponsorship $1k/issue = $52k → + subscription $29/mo × 200 = $70k.

Then model **effort reduction**: what gets outsourced at what cost, and what the freed time gets
reinvested into. Net revenue and net hours both stated.

### 4. Build ONE offer — four parts
1. **Exactly what they will achieve** — specific, time-bound, measurable.
   *"At the end of our 90-minute workshop you'll be able to confidently book your first family
   vacation to Europe at a five-star hotel for 40% less than list."*
2. **Why they're likely to achieve it** — three components:
   - **Outcome statement**: transformational copy, negative present → positive future
   - **Relevant testimonial**: must be about *this* offer, not general praise
   - **Guarantee** (optional): specific and honourable
3. **Accelerants** — resources that minimize effort and speed up time-to-achievement: workbook,
   checklist, toolkit, quarterly check-in calls. Bolt-ons under the umbrella offer.
4. **Fascinations** — curiosity language. "Curtain copy": what's behind the curtain is worth the
   price. *"Discover the two little-known secrets that…"* Use 1–2, not a wall of them.

### 5. Price it
For a service, price off the discovery-call math (fee visibly small vs. recaptured value).
For a product, price off the survey demographic — if 90% are pre-revenue, that's a $97 paint-by-
numbers course, not a $1,900 masterclass.

### 6. Right product, right person
Use the post-magnet survey data to introduce the offer personally. Template the email, vary the
bolded segments per persona. Manual at <100 subscribers, automated above.

## Output format

```markdown
# Offer Architecture — [company]

## Position
Quadrant: [x] — evidence: [followers, topical spread]
Route: [northern | southern] — next rung: [one model]

## Ladder inventory (what they already sell)
| Rung | Offer | Price | CONFIRMED/INFERRED/UNKNOWN | Source |
Absent rungs: | Recommendation targets: | If INFERRED, confirm first by:

## Differentiation check
Competitors: [url], [url]
| Element | SHARED/OURS/THEIRS | Evidence |
`OURS` element: [which]

## Ladder model
| Rung | Offer | Price | Volume | Annual | Effort |
Total: | Outsourcing move: | Net hours saved:

## The offer (built)
1. Achievement statement:
2. Likelihood:
   - Outcome statement:
   - Testimonial required (spec — what it must say, who must say it):
   - Guarantee:
3. Accelerants:
4. Fascinations (1–2):
Price: [+ reasoning]

## Landing page skeleton
Hero / benefits / proof / FAQ / bold CTA

## Right-person outreach template
[templated email with variable segments marked]

## Assumptions & Unknowns
```

## Evaluation

**Rubric (0–4 each, 20 total). Pass ≥15, no dimension <2.**

| # | Dimension | 0 | 2 | 4 |
|---|---|---|---|---|
| 1 | **Faithfulness** | Offer with a price | Some structure | Quadrant plotted with evidence, route chosen, ladder modelled with arithmetic, all four offer parts built |
| 2 | **Model fit** | Recommends a course to a 2k-follower account | Plausible | Model matches quadrant *and* price matches the survey/demographic evidence |
| 3 | **Achievement specificity** | "Grow your business" | Outcome named | Time-bound, measurable, and the operator could be held to it |
| 4 | **Proof honesty** | Invented testimonial | Placeholder | Testimonial written as a *spec* (what it must say, from whom) when none exists; guarantee is one they could actually honour |
| 5 | **Falsifiability** | No numbers | Revenue guessed | Ladder arithmetic shown; the volume assumption is stated as the thing to test first and the break-even named |

**Kill check:** a fabricated testimonial presented as real; a ladder that skips the operator's
current quadrant (e.g. flagship course recommended to a small broad account); or **a recommendation
of a rung the subject already operates**. Zero the run.

**Substitution test (hard fail):** reassign the built offer to the nearest competitor. If it still
reads as true and buildable by them, it's a category offer. Step 1c exists to prevent this —
observed on Why We Buy v1, where "monthly copy teardown subscription" transferred unchanged to
three named competitors.

**Control comparison:** compare against the company's real pricing page. Note where the generated
offer is *more* specific about achievement, and where the real one has proof the generated one
can't manufacture. Both directions are findings.

## Failure modes seen in testing

- Jumping to "build a course" because it's the most exciting rung
- Testimonials written in full as though real — always write them as a spec instead
- Accelerants that are just more of the same content instead of effort-reducers
- Fascination stacking (five curiosity lines) which reads as hype and kills trust
