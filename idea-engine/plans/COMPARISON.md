# The three plans side by side

Same model for all three: Monte Carlo, 3,000–5,000 runs, 24 months, 1,000 cold contacts a month into each plan's top 3 segments. Reply, close, cycle and churn rates are planning ranges from each plan's `data/icp.json`, not measurements. The helpdesk also gets 2–8 inbound customers a month from search, because it is the only offer with measurable search demand.

| | Helpdesk (Zendesk alternative, Chatwoot) | Managed security (Wazuh) | Private legal AI (AnythingLLM) |
|---|---|---|---|
| **Months to 10k MRR (P50; P10–P90)** | **3** (3–4) | **3** (2–3) | 4 (3–4) |
| Customers needed for 10k MRR | ~17–29 (349–599/mo) | ~5–7 (1,499–2,200/mo) | ~10–20 (499–999/mo) |
| Paying customers at month 12 (P50) | **~140** | ~120 | ~116 |
| Paying customers at month 24 (P50) | ~174 | ~134 | **~178** |
| MRR at month 12 (P50) | ~70k | **~214k** | ~88k |
| Setup fees over 24 months (P50) | ~298k | ~233k | **~566k** |
| Search demand to switch | **Yes** ("zendesk alternative" +225%) | Small and falling | Few switch searches, but the category is growing fastest ("harvey ai" 40,500/mo +95%; see channels/CHANNELS.md) |
| Tight complaints counted | 83 of 180 | 155 of 164 | 98 of 200 |
| #1 complaint | Seat price and unused features (24 tight) | Price opaque or too high (43) | Per-seat price and seat minimums (30) |
| Biggest risk | SLA timers and Chatwoot's AI agent sit under its enterprise licence; buyer pools measured are small | Margin depends on untested AI triage + auto-containment; MSP cycles 3–10 weeks | Lawyers say general ChatGPT/Claude is as good as legal tools; Mintplex hosts AnythingLLM itself for 50–99 USD/mo |

## Answer: fastest to 10k MRR and most users

- **Fastest to 10k MRR:** helpdesk and security tie at about month 3. Security needs the fewest deals (5–7 MSPs or dealers) but has longer sales cycles and the least-tested margin.
- **Most users:** at month 12 the helpdesk has the most paying customers (~140) and agent seats; by month 24 legal catches up (~178) because its smaller firms churn less in the assumptions.
- **Most revenue:** security, by far (~214k MRR at month 12), because each account pays 3–6× more.
- **Most measured demand:** helpdesk is the only one where real buyers are searching to switch right now.

All rates are assumptions until the smoke test in each `05-gtm-90-day.md` replaces them with measured reply and close rates.
