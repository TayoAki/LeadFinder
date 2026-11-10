---
name: cmba-run
description: "Orchestrate the full Creator MBA pipeline end to end for a person or company — runs idea, validate, uvp, profile, content, journey, leadmagnet, discovery, offer, email and metrics in dependency order with gates between stages, writing artifacts to a shared workspace. Use when someone wants the whole system built, a full business audit, or a complete go-to-market from scratch. Triggers on: build my whole business, run the full CMBA, complete audit, do everything, full go to market, start from scratch."
---

# CMBA — Pipeline Orchestrator

Runs the eleven worker skills in dependency order. The gates are the point: each stage can halt
the pipeline, because the course's failure mode is people skipping the fundamentals to get to the
fun parts (content, funnels, courses).

## Workspace

All artifacts to `./cmba-workspace/<company-slug>/`:

```
idea.md  validation.md  uvp.md  profile.md  content.md
journey.md  lead-magnet.md  discovery.md  offer.md  email.md  metrics.md
_run.md          ← the run log: stage, score, gate result, timestamp
```

## Order and gates

| # | Stage | Skill | Gate to proceed |
|---|---|---|---|
| 0 | **Applicability** | `cmba-uvp` Step 0 | Four preconditions: identifiable operator/brand · direct channel · content-led acquisition plausible · one operator can package and price the offer. **DOES NOT APPLY (≤1/4) halts the run.** **PARTIAL** requires naming which stages below are skipped, and skipping them. |
| 1 | Idea | `cmba-idea` | A recommendation exists with a chain to a market + outcome, scoring ≥15 |
| 2 | Validation | `cmba-validate` | Verdict is GREEN or AMBER-with-stated-pivot. **RED halts the pipeline.** |
| 3 | UVP | `cmba-uvp` | Self-exclusion test passes — a named group correctly walks away |
| 4 | Profiles + site | `cmba-profile` | Copy is shippable and traceable to UVP clauses |
| 5 | Content | `cmba-content` | 90-day calendar + 3–5 fully written posts exist |
| 6 | Journey | `cmba-journey` | Chain integrity check passes on all four links |
| 7 | Lead magnet | `cmba-leadmagnet` | Narrow/wide gap is explicit; format is from the top half of the quadrant |
| 8 | Discovery | `cmba-discovery` | Only if a service is in scope. Skip for product-only. |
| 9 | Offer | `cmba-offer` | Model matches the plotted quadrant |
| 10 | Email | `cmba-email` | 2–3 growth tactics, not more |
| 11 | Metrics | `cmba-metrics` | Sequential test calendar with keep/kill thresholds |

Dependencies worth respecting: 3 needs 1; 5 needs 3; 6 needs 3 and 7's magnet concept; 7 needs 3
and a sense of the offer; 9 needs 7's survey design and (if services) 8's call data; 10 needs 7;
11 needs anything live.

Stages 7 and 9 are mutually informing — draft the magnet, sketch the offer, then finalize the
magnet so the narrow/wide gap actually lands.

## Prevention before detection

**Every skill's first action is reading every existing artifact in the workspace.** Measured result:
the set where a skill read its predecessors had **0 high-severity** contradictions; the set where
none did had **6 (3 high)**. The audit below catches **1 in 5** on held-out sets.

Prevention is cheap and works. The audit is a backstop for what prevention missed, not the
mechanism.

**Derive differentiation once.** Write the `OURS` element to `differentiators.md` and have every
skill read it. Two skills that each run their own differentiation check will produce two different
answers for the same company — observed on Swagelok, where the UVP claimed single-domain focus and
the idea skill claimed the tested-assembly warranty. A company gets one primary differentiator.

## Coherence audit (backstop — required whenever two or more artifacts exist)

Run this **after any two artifacts exist**, not at the end of a full pipeline — partial runs are the
normal case now that skills are invoked individually.

Every contradiction found in testing sat at a **seam between two skills** and was invisible from
inside either artifact. Both documents were internally consistent and would pass their own rubrics.
Check the seams, not the documents.

| Seam | Question |
|---|---|
| discovery ↔ email | Does the form actually capture the contact details the email engine assumes? |
| metrics ↔ everything | Is any other artifact shipping a change that metrics scheduled as an isolated test? Two skills touching one asset breaks attribution |
| metrics ↔ email/content | Is an intervention scheduled twice, on different timelines? Whichever ships first contaminates the other's measurement |
| content ↔ metrics | Do the priority rankings agree? One skill's asset #1 must not be another's rejected hypothesis |
| any downstream ↔ uvp/idea | Is the audience asserted downstream actually established upstream, or invented and inherited? |
| all artifacts | Is every performance band sourced or tagged `UNSOURCED`? |
| **validate ↔ any earlier artifact** | Did a validation run refute a number an earlier artifact still asserts? |
| **any run ↔ everything before it** | Has anything produced since invalidated a claim in an existing artifact? |

**Lateral vs. temporal.** The first six rows check whether artifacts agree *now*. The last two check
whether something written later **invalidated** something written earlier — a different failure, and
the one the checklist originally missed.

When a run refutes a claim in an existing artifact, **stamp that claim `SUPERSEDED` in place** with
a pointer to what refuted it. Do not leave it readable as current. Observed: an offer artifact kept
asserting a price and a member projection that a later validation had refuted on both price and
retention, while a third artifact had already routed around it.

⚠ **This checklist is derived from observed failures and is therefore incomplete by construction.**
It was tested on a held-out set and caught **1 of 3** contradictions. Treat it as a floor, not a
sufficient test, and add a row whenever a new seam failure is found.

Output a contradiction table with severity and a resolution per row. **An unresolved high-severity
contradiction blocks the run** — eleven excellent, mutually contradictory documents are worse than
three consistent ones.

Observed on ATX Clean: four artifacts, four skills, **six contradictions**, including an email
engine whose first tactic depended on a form field the discovery skill never included.

## Modes

- **Full build** — new business, run 1→11
- **Audit** — existing real company: run 1–3 and 6–9 against their public footprint, produce a gap
  report rather than a build
- **Partial** — start from any stage, but read all upstream artifacts first and state which
  upstream inputs were missing

## Run log format

```markdown
# Run — [company] — [date]
| # | Stage | Score /20 | Gate | Notes |
Halted at: [stage or "completed"]
Total elapsed:
Weakest artifact: [and why]
```

## Rules

- Never silently invent an upstream artifact. Missing input is declared in the downstream output's
  Assumptions block.
- A failed gate stops the run. Do not "continue anyway" — the whole thesis of the course is that
  skipping foundations is why businesses stall.
- **Gate 0 is not optional.** Every skill in this suite will produce fluent, confident output for
  a business the framework does not fit — distributor-led manufacturers, regulated monopolies,
  enterprise field-sales orgs. Fluency is not fit. Run Gate 0 before stage 1, always.
- After a full run, invoke `cmba-eval` on the two weakest artifacts.

## Evaluation

Pipeline-level rubric (0–4 each):

| # | Dimension | 4 |
|---|---|---|
| 1 | **Order fidelity** | Ran in dependency order; no stage used an artifact that didn't exist yet |
| 2 | **Gate enforcement** | At least one gate was genuinely evaluated and could have halted; halts actually halt |
| 3 | **Artifact coherence** | The UVP's enemy appears in the journey emails; the magnet's wide problem is the offer's problem; content themes match the UVP audience |
| 4 | **Assumption propagation** | Assumptions declared upstream are still visible downstream, not laundered into fact |
| 5 | **Run log honesty** | Weakest artifact identified accurately, matching independent evaluation |

**Kill check:** any downstream artifact that contradicts an upstream one (different audience,
different price tier, different problem). Coherence failure zeroes the run — a pipeline that
produces eleven good-looking but mutually inconsistent documents is worse than three consistent ones.
