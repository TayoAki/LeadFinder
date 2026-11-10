---
name: cmba-eval
description: "Grade the output of any CMBA skill against its rubric, run it against real companies, compare to the company's actual live assets as a control, log results to the ledger, and propose a specific patch to the SKILL.md. This is the feedback loop that improves the suite. Use after running any cmba-* skill, when setting up a test batch against real companies, or when a skill's output feels generic. Triggers on: grade this output, evaluate the skill, test against real companies, score this, improve the skill, run the eval loop, why is this output generic."
---

# CMBA — Evaluator

Skills without a grader drift toward plausible-sounding mush. This skill is the counterweight.
It is adversarial by design: its job is to find the failure, not to certify the work.

## The three-part test

A CMBA artifact is only "good" if it passes all three:

1. **Rubric score** — ≥15/20, no dimension below 2, kill check clear
2. **Control comparison** — measurably better or more specific than what the real company
   already has live. Equal-but-prettier is a fail.
3. **Substitution test** — swap the company name for a competitor's. If the artifact still reads
   as true, it is generic and fails regardless of score. This catches the single most common
   failure mode in the whole suite.

## Grading protocol

### Precondition: was the footprint fetched?

Before grading anything, confirm the artifact was generated **after** a real fetch of the company's
public footprint. If it wasn't, stop — score 0, kill check fired, no further grading.

You cannot detect fabrication by reading. A negative control (batch 04) produced a UVP with the
wrong company name, a price wrong by 3.7×, and an invented proof statistic; it read as a solid
17/20 artifact. The only reliable signal is provenance, not prose.

### Blind first
Grade the artifact *before* re-reading the company research. Verify factual claims only in a
second pass. Grading with the brief in hand inflates dimension 4 (non-genericity) because you
mentally supply context the artifact never earned.

### Score the five dimensions
Every CMBA skill uses the same shape:
1. **Faithfulness** — did it run the transcript's actual framework, in order, with the cuts?
2. Skill-specific
3. Skill-specific
4. Skill-specific
5. **Falsifiability** — could a real person disprove or act on this today?

Score 0/1/2/3/4 per dimension. Write the *reason* for each score in one sentence, and quote the
line from the artifact that drove it. Unquoted scores are not admissible.

### Run the kill check
Each skill defines its own. Most are variants of "fabricated fact presented as known." When a
kill check fires, the run scores 0 and the ledger entry records the exact fabricated claim.

### Verify the facts
Every quantitative claim about the real company gets one of three tags:
- `VERIFIED` — found in the public footprint, with the source
- `INFERRED` — reasoned from evidence, reasoning shown
- `FABRICATED` — no basis. Any single instance fires the kill check.

## Real-company testing

### Choosing subjects
Test companies must have: a public site, visible pricing or a visible offer, an active social
presence, and enough footprint to check claims against. See `cmba/eval/companies.md`.

Mix deliberately:
- 1 solo creator (the course's native case)
- 1 small service business (services-first path)
- 1 product/SaaS business (offer-ladder stress test)
- 1 deliberately awkward fit (a company the framework arguably shouldn't apply to)

That last one matters most. A framework that produces confident output for every input isn't
producing analysis.

### Batch procedure
1. Gather the public footprint first — site, pricing, socials, lead magnet if any. Record sources.
2. Run the skill.
3. Grade blind, then verify.
4. Pull the control: their real hero copy / real offer / real opt-in / real welcome email.
5. Diff. Record which is more specific, and on what axis.
6. Log one entry per (skill × company) to `cmba/eval/results/`.

## Ledger entry format

```markdown
## [skill] × [company] — [date]
Footprint sources: [urls / where checked]
Scores: F[_] D2[_] D3[_] D4[_] D5[_] = [_]/20
Kill check: clear | FIRED — [claim]
Substitution test: pass | FAIL — [artifact reads true for [competitor]]
Control: [what they have live] vs [what the skill produced] → [which is sharper, on what axis]
Weakest dimension: [n] — [one-sentence reason + quote]
PATCH: [one specific change to the SKILL.md, written as the actual edit]
Re-run result: [score after patch, or "pending"]
```

## The improvement loop

The loop only counts when a patch produces a measured delta on the *same* company:

```
run → grade → identify weakest dimension → write ONE patch → re-run same company → compare
```

Rules that keep the loop honest:
- **One patch per cycle.** Multiple simultaneous edits make the delta unattributable — the same
  discipline `cmba-metrics` enforces on business tests.
- **Patch the instruction, not the example.** Adding a good example to a SKILL.md teaches
  imitation; adding a constraint teaches the behaviour. Prefer constraints and required output
  fields over sample text.
- **Regression check.** After patching, re-run one *previously passing* company. A patch that
  fixes company A and breaks company B is a net loss.
- **Escalation rule.** If the same dimension fails across three different companies, the problem
  is the skill's process section, not its output format. Rewrite the process step.
- **Retirement rule.** If a failure mode disappears across two full batches, delete it from the
  skill's "failure modes" list. Stale warnings dilute the ones that matter.

## Scoring the evaluator itself

Bias checks to run periodically:
- **Score distribution** — if mean scores rise every batch, the grader is drifting lenient, not
  the skills improving. Re-grade an old artifact and compare to its original score.
- **Kill-check rate** — should be non-zero. A grader that never fires a kill check isn't reading
  for fabrication.
- **Verdict spread** — `cmba-validate` returning GREEN every time means the framework is
  rubber-stamping. Same for offers that always recommend the same rung.

## Output format

```markdown
# Evaluation — [skill] × [company]

## Blind grade
| Dim | Score | Reason | Quote from artifact |

## Fact verification
| Claim | VERIFIED / INFERRED / FABRICATED | Source |

## Kill check: [clear | FIRED]
## Substitution test: [pass | fail]
## Control comparison
| Axis | Company's live version | Skill output | Sharper |

## Verdict: PASS / FAIL  ([_]/20)
## Weakest dimension and why
## PATCH (one, specific)
```
