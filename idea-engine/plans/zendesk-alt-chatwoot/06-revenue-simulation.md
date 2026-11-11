# Revenue simulation (Monte Carlo)

**5,000 simulated runs per segment, 24 months.** Every rate comes from `data/icp.json` as a range and is drawn at random in each run, so the results are ranges, not forecasts. These are planning assumptions until the smoke test replaces them with measured numbers.

**Settings:**
- **Per-segment comparison:** 1,000 new outbound contacts per month into each segment, at 1.00 USD per contact all-in (data, enrichment, sending tools and SDR time).
- **Combined plan:** 3,000 contacts per month split across the top 3 segments, plus inbound search customers of 2–8 a month.
- **P10 / P50 / P90:** the pessimistic, middle and optimistic outcomes; 80% of runs fall between P10 and P90.

## Per segment (1,000 contacts a month each)

| Segment | Price/mo | MRR at month 6 (P50) | MRR at month 12 (P10 / P50 / P90) | Customers at month 12 (P50) | MRR at month 24 (P50) | Cost per customer (P50) | Chance of 10k MRR by month 6 | Chance of 100k MRR by month 24 | US share needed for 100M ARR |
|---|---|---|---|---|---|---|---|---|---|
| S3 Zendesk renewal-trapped SMB/mid-market (10-500 staff) | 599 | 9k | 12k / **20k** / 32k | 34 | 16k | 230 | 38% | 0% | 157.0% (exceeds the US market) |
| S1 Shopify/DTC brands on Gorgias or Zendesk (2-15 agents) | 349 | 10k | 7k / **13k** / 21k | 38 | 9k | 166 | 50% | 0% | 312.3% (exceeds the US market) |
| S4 Help Scout / Freshdesk repriced small teams | 349 | 3k | 3k / **6k** / 9k | 17 | 10k | 584 | 0% | 0% | — |
| S5 Consumer apps / subscriptions / marketplaces (high-volume B2C) | 1,290 | 5k | 2k / **4k** / 7k | 3 | 3k | 495 | 2% | 0% | 357.7% (exceeds the US market) |
| S2 B2B SaaS small support teams on Zendesk(+Intercom) | 599 | 3k | 2k / **3k** / 4k | 4 | 2k | 293 | 0% | 0% | 936.8% (exceeds the US market) |
| S7 Outsourced CX / BPO agencies (hypothesis) | 1,290 | 2k | 1k / **2k** / 4k | 2 | 2k | 1k | 0% | 0% | 303.1% (exceeds the US market) |

## Combined plan: top 3 segments (S3 Zendesk renewal-trapped SMB/mid-market (10-500 staff), S1 Shopify/DTC brands on Gorgias or Zendesk (2-15 agents), S4 Help Scout / Freshdesk repriced small teams)

| Metric | P10 | P50 | P90 |
|---|---|---|---|
| MRR at month 6 | 29k | 36k | 45k |
| MRR at month 12 | 58k | 70k | 83k |
| MRR at month 24 | 79k | 91k | 104k |
| Customers at month 12 | 114 | 140 | 168 |
| Customers at month 24 | 150 | 175 | 204 |
| Setup fees collected over 24 months | 261k | 298k | 340k |
| Cost per customer | 143 | 167 | 195 |

Chance the combined plan reaches 10k USD MRR by month 6: **100%**.

## How to read this

- The simulation ranks segments by how quickly the *same outbound effort* turns into recurring revenue, given each segment's price, reply and close ranges, sales cycle and churn.
- **"US share needed for 100M ARR"** shows whether a segment alone could ever carry a 100M-dollar business. Above ~10% means the segment is a beachhead, not the whole company.
- **Replace the assumed ranges** in `data/icp.json` with the smoke test's measured reply and close rates, then re-run `python3 ../simulate_revenue.py .`.
