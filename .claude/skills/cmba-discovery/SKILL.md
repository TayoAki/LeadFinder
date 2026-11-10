---
name: cmba-discovery
description: "Run the Creator MBA service-business sales motion — a qualifying discovery form, a call script built on the five questions and the rule of two, cost quantification and annualization, and the post-call proposal email with ROI math and a customer-set deadline. Use when someone needs to sell services, is on calls that don't close, needs a proposal template, or is scoping a first client engagement. Triggers on: discovery call, sales call script, qualify leads, write a proposal, how do I price this project, my calls don't convert, intake form."
---

# CMBA — Discovery Call & Proposal

The service business comes first in this system because *you get paid to learn* — and what you
learn on these calls becomes the standardized offer and later the product.

Governing rule: **you are learning, not solving.** Consultants who solve the whole problem free
on the call don't sign contracts.

## Process

### 0b. Channel check — does form-first intake actually fit this category?

The form-before-calendar rule comes from B2B consulting, where prospects research before they
contact you. **It does not transfer unexamined.** In categories where response speed and phone
conversion dominate, form friction can cost more leads than qualification saves.

Check before prescribing a form:
- How do buyers in this category actually make contact — form, phone, or messaging?
- Does the category reward speed of response over quality of qualification?
- What share of deals close *on the first call* rather than after a proposal?

Home services benchmark: **78% of customers hire whoever responds first**, and **37% of phone leads
convert during the call.** In that shape of business, qualification belongs in the **first 60
seconds of the call** — the same five questions, asked live — not in eight form fields that a
competitor's faster callback beats anyway.

Prescribe form-first only where the buyer already self-educates before contacting. Otherwise, keep
the form to contact details plus one or two routing fields, and move qualification into the call.

### 1. Qualifying form (before any calendar link)
Never send prospects straight to a calendar. Route through a form that lets you *disqualify*.

**The form is also the contact-capture instrument.** Always include name, email and phone — a
qualification form that omits them breaks every downstream skill that assumes a contactable lead.
This is not optional and has been missed in testing.

Fields must let you answer "good fit?" without a conversation. For a service business, typically:
current revenue/stage · size of the thing being fixed · what they've already tried · timeline ·
budget band · the problem in their own words.

Include the polite decline template for bad fits.

### 2. The call — five answers to leave with
1. What is the problem **specifically**? (not generically)
2. What have they tried, and how did it work?
3. What is it costing them / their business?
4. How high a priority is it — what's ahead of it?
5. When do they want it fixed by / start by?

### 3. Tactics
- **Open with rapport, in their words.** Do the research, then still ask them to describe the
  business themselves.
- **Rule of two** — when you get a vague answer, don't ask "can you clarify". Offer two
  specific readings: *"When you say not working, that usually means either (a) … or (b) … —
  which is it?"* They pick, or correct you with (c). Either way you get specificity.
- **Quantify, then annualize.** "Down 1%" → "~10 sales/month" → "$3,000/month" → **"so we're
  looking at roughly a $36,000 annual problem."** Annualizing multiplies perceived urgency 12×.

  **When there is no measurable revenue leak** — which is most service businesses — do not force
  the ladder. Asking a property manager what a dirty loading dock costs them yields "nothing" or an
  invented number, and an invented number in a proposal is worse than a small real one.
  Use **cost-of-inaction proxies**: figures the prospect already tracks.

  | Proxy | Question that surfaces it | Why it's real money |
  |---|---|---|
  | Internal labour | "Who handles this now, how many hours, at what loaded rate?" | payroll, not opinion |
  | Deferred capital | "When was it last replaced and what did it cost?" | pulls a capex line forward |
  | Compliance / liability | "Has an inspector, insurer or the franchise side ever flagged it?" | fines and claims are invoiced |
  | Churn / turnover | "How many turned over last year, and what does one cost you?" | tracked precisely by property and subscription businesses |
  | Reputation | "What do your last 20 reviews say about it?" | traceable to bookings and leasing |

  Ladder shape is preserved — unit → monthly → annual — the *unit* just isn't revenue.
  **Every proxy must resolve to a number the prospect said out loud. Blanks stay blank.**
- **Capture time cost too.** What they've tried = hours burned. Time is a currency.
- **Never force priority.** If a bigger project is ahead of you, ask when it ends and whether
  that's a better time to pick this up.
- **Don't price on the call.** "I'll take this back and put together a simple proposal."

### 4. The proposal email — four jobs
1. **Recap** everything you heard, and invite correction ("does that all sound right?")
2. **Approach** — how you'd tackle it, and explicitly what you'd *avoid* doing (cheaper, faster)
3. **The math** — cost of the problem vs. cost of you, with recaptured value stated in dollars
   (e.g. a $36k/yr problem, fixed in 3 months → $27,000 recaptured; your fee $6,000)
4. **Scope, price, and their deadline** — use the date *they* gave you to set the start date, then
   paint the future picture ("once we've fixed this, I'd love to talk about driving more traffic
   to the improved pages")

### 5. Standardization (after 10–20 calls)
Look for commonalities → collapse custom quotes into one standard offer. Record: what recurred,
what worked, what to drop, where the friction was, and what the standard scope/price should be.

## Output format

```markdown
# Discovery System — [company]

## Qualifying form
| Field | Type | What it disqualifies |
Decline email template:

## Call script
Opening:
Q1 (+2 rule-of-two variants prepared for the likely vague answers)
Q2 / Q3 (with the quantification ladder for this business) / Q4 / Q5
Close: [no pricing on call]

## Quantification worksheet
[the specific arithmetic path for this business type: unit → monthly → annual]

## Proposal email template
[full text with the four jobs marked]

## Standardization tracker
| Project | Problem | Scope | Hours | Price | Recurring? |

## Assumptions & Unknowns
```

## Evaluation

**Rubric (0–4 each, 20 total). Pass ≥15, no dimension <2.**

| # | Dimension | 0 | 2 | 4 |
|---|---|---|---|---|
| 1 | **Faithfulness** | Generic sales script | Five questions present | Form-before-calendar, five questions, rule of two, annualization, no-pricing-on-call, four-job proposal |
| 2 | **Specificity extraction** | Asks "what's your biggest challenge" and stops | Some probing | Pre-written rule-of-two pairs for this industry's actual vague answers |
| 3 | **Money math** | No numbers, or invented ones | Cost mentioned | Full ladder unit → monthly → annual — using revenue where a leak exists, or cost-of-inaction proxies where it doesn't — and a proposal where fee is visibly small vs. recaptured value |
| 4 | **Disqualification** | Form collects contact info only | Some screening | Every field states what it disqualifies; decline template included |
| 5 | **Falsifiability** | No close logic | Deadline mentioned | Deadline derived from the *customer's* stated date, with the follow-up trigger and date arithmetic shown |

**Kill check:** a proposal that prices on the call, or invents ROI numbers not derived from what
the prospect said. Zero the run.

**Control comparison:** run the script against the real company's actual sales page/intake form.
Count how many of the five answers their current process captures. Most capture 1–2; that gap is
the finding.

## Failure modes seen in testing

- Rule of two written as an abstract instruction instead of pre-built pairs
- Monthly framing left un-annualized, halving urgency
- Proposal that leads with credentials instead of the recap
- Forcing urgency when the prospect named a bigger competing priority
