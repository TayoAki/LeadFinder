# Experiment log

How it works:
- **Assignment:** stable per shopper (`src/lib/experiments.ts`). Every event carries `exp_<key>`, and an `experiment_exposure` event fires when a variant changes what the shopper sees.
- **Reading a test:** Admin → Analytics → Funnels → "Break down by" → the test.
- **Rules:** see `conversion-plan.md` §5.3. One variable per test, full weeks, the sample size worked out before starting, RPI and margin as guardrails.

| ID | Hypothesis | Variants | Primary metric (funnel) | Guardrails | Sample needed* | Status |
|---|---|---|---|---|---|---|
| E3 | Pre-selecting the saved size raises fashion add-to-cart | preselect / none | product_view → add_to_cart (fashion) | Size returns | ~6,700 views per arm | Running, waiting for traffic |
| E7 | A niche bundle on the PDP raises order value | on / off | AOV; product_view → add_to_cart | PDP add rate | Depends on order-value variance; ~6,700 views per arm for the add-to-cart guardrail | Running, waiting for traffic |
| E8 | Real proof next to the price lifts add-to-cart | near / below | product_view → add_to_cart | None | ~6,700 views per arm | Running, waiting for traffic |
| E16 | The campaign hook on landing lifts link conversion | matched / generic | campaign_landing → order_placed | None | Depends on campaign volume | Running, waiting for traffic |
| E18 | A "Find your match" quiz on Home raises purchases | show / hide (Home card; the quiz stays reachable for everyone) | app_open → order_placed (30 d); quiz_start → quiz_complete → order_placed by `icp` | AOV, refunds | ~6,700 shoppers per arm for a 20% relative lift on a ~3% base | Running, waiting for traffic |
| Holdout | True lift from discounts | 5% holdout / eligible | RPI₃₀ | n/a | Permanent | Live |
| Holdout | True lift from push | 5% holdout / eligible | Repeat orders (60 d) | n/a | Permanent | Live |

\*Indicative, for a 10% baseline and a +15% relative lift at 80% power and α = 0.05 (two-sided). Recompute from the measured baseline in week 1.

## Results

Nothing has concluded yet. Record each result here when its test ends: the dates, n per arm, the effect with its confidence interval, the decision, and what we learned.
