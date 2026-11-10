---
name: cmba-journey
description: "Map the 5-stage modern customer journey (problem unaware, problem aware, solution aware, product aware, most aware) and produce a daisy-chained asset set — top-of-funnel social posts, a supporting article, a narrow lead magnet, and the 6-email sequence including the Goodwill Hunting email and the five-inch/five-mile benefits email. Use when content isn't converting, when there's no funnel, or when assets exist but don't connect. Triggers on: build my funnel, customer journey, email sequence after lead magnet, my content doesn't convert, nurture sequence, awareness stages."
---

# CMBA — Modern Customer Journey

Four rules the transcript builds on:
1. You can't sell to someone who doesn't think they have a problem
2. Knowing they have a problem isn't enough — they must believe solutions exist
3. Knowing solutions exist isn't enough — they must know *yours* exists
4. Knowing yours exists isn't enough — they must know why it's the best fit *for them*

The five stages exist to fix those four gaps in order. Assets must **chain**: every asset at
stage N sets up the asset at stage N+1.

## Process

### Stage map
| Stage | Position | Prospect's internal sentence | Asset | Goal sentence you want them to say next |
|---|---|---|---|---|
| Problem unaware | TOFU | "Everything's fine" | daily social content | "Wait — I might have a problem" |
| Problem aware | TOFU | "I have a problem" | daily social content | "There are ways to fix this, let me look" |
| Solution aware | MOFU | "Which solution?" | **lead magnet** (narrow problem) | "That was great — now I have a bigger problem" |
| Product aware | BOFU | "Could theirs work for me?" | 4-email series | "I want *their* solution" |
| Most aware | BOFU | "I'm in, what's the deal?" | emails 5–6 | "I have to buy today" |

### The 6-email sequence
1. **Introduction** — deliver the lead magnet, introduce the brand, give one helpful thing, and
   *ask what they want* (this doubles as data capture / segmentation)
2. **Highlight the problem** — widen from the narrow problem the magnet solved to the expensive
   one; reveal that you have a solution (not just that solutions exist)
3. **Goodwill Hunting** — "it's not your fault." Deploy the movement/enemy statement from the UVP.
   Relieve guilt, then present the opportunity
4. **Five-inch / five-mile** — immediate benefits and long-term benefits, in that order
5. **Urgency** — expiring discount, closing cart, one-time offer, countdown. The transcript is
   blunt: discounts work; a Black Friday sale ran 5× normal daily volume
6. **Final reminder** — short. Restate the deadline + one best testimonial. Most buyers convert here

### Daisy chain
Assets must be *the same idea* travelling down the funnel:
`problem-unaware post → problem-aware post → supporting article → narrow lead magnet → 6 emails`

Test the chain by reading the set top to bottom as one argument. If any link introduces a new
topic, the chain is broken.

### Conversion reality
Single-digit conversion from magnet to sale is normal and good. 90%+ won't buy in emails 1–4;
stage 5 exists for them. Do not design as if email 2 will close.

## Output format

```markdown
# Customer Journey — [company]

## Stage map
[table above, filled with this company's actual customer sentences]

## Daisy chain (one idea, five assets)
Core idea:
1. Problem-unaware post: [full copy]
2. Problem-aware post: [full copy]
3. Supporting article: [title + outline]
4. Lead magnet: [title + narrow problem it solves + wide problem it exposes]
5. Emails 1–6: [full copy each, with subject lines]

## Chain integrity check
Read top to bottom — does asset N set up asset N+1? [yes/no per link]

## Assumptions & Unknowns
```

## Evaluation

**Rubric (0–4 each, 20 total). Pass ≥15, no dimension <2.**

| # | Dimension | 0 | 2 | 4 |
|---|---|---|---|---|
| 1 | **Faithfulness** | Generic funnel | Stages named, emails generic | All 5 stages with prospect sentences; all 6 emails including Goodwill Hunting and five-inch/five-mile by name and function |
| 2 | **Chain integrity** | Assets are unrelated | Loose thematic link | Every asset provably sets up the next; the narrow→wide problem gap is explicit and correct |
| 3 | **Stage discipline** | Pitches the product at problem-aware | Some bleed | No selling above solution-aware; magnet solves narrow only; product introduced exactly at email 2 |
| 4 | **Copy quality** | Placeholder-level | Usable | Subject lines earn opens, emails are the real length, Goodwill Hunting actually names the enemy from the UVP |
| 5 | **Falsifiability** | No metrics | "Track opens" | Per-stage expected metric and the number that would say the stage is broken (e.g. <1% magnet→sale = email 2 problem) |

**Kill check:** an offer pitched to problem-unaware or problem-aware audiences, or a lead magnet
that solves the wide problem (leaving nothing to sell). Either zeroes the run — both are the
specific mistakes the chapter exists to prevent.

**Control comparison:** subscribe to the real company's actual lead magnet funnel where one
exists, and diff. If they have no funnel, note the gap in revenue terms.

## Failure modes seen in testing

- Six emails that are six versions of "buy now"
- Email 3 written as an apology rather than a redirection of blame to the enemy
- Lead magnet too generous — solves the whole problem, kills the offer
- No urgency mechanism in email 5 because it "feels salesy" (the transcript's counter: it works)
