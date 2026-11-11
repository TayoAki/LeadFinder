# Revenue simulation (Monte Carlo)

**5,000 simulated runs per segment, 24 months.** Every rate comes from `data/icp.json` as a range and is drawn at random in each run, so the results are ranges, not forecasts. These are planning assumptions until the smoke test replaces them with measured numbers.

**Settings:**
- **Per-segment comparison:** 1,000 new outbound contacts per month into each segment, at 1.00 USD per contact all-in (data, enrichment, sending tools and SDR time).
- **Combined plan:** 3,000 contacts per month split across the top 3 segments.
- **P10 / P50 / P90:** the pessimistic, middle and optimistic outcomes; 80% of runs fall between P10 and P90.

## Per segment (1,000 contacts a month each)

| Segment | Price/mo | MRR at month 6 (P50) | MRR at month 12 (P10 / P50 / P90) | Customers at month 12 (P50) | MRR at month 24 (P50) | Cost per customer (P50) | Chance of 10k MRR by month 6 | Chance of 100k MRR by month 24 | US share needed for 100M ARR |
|---|---|---|---|---|---|---|---|---|---|
| S1 Mid-size law firms, ~11-50 lawyers | 999 | 13k | 19k / **32k** / 51k | 32 | 25k | 230 | 72% | 0% | 100.4% (exceeds the US market) |
| S2 Document-heavy small litigation firms, 2-10 lawyers (PI, med-mal, civil lit) | 499 | 14k | 16k / **29k** / 45k | 57 | 50k | 173 | 77% | 0% | 44.9% |
| S3 Insurance defense firms | 999 | 9k | 15k / **24k** / 39k | 24 | 49k | 394 | 38% | 1% | — |
| S5 Template-driven transactional small firms (estate planning, real estate, formation), 1-10 lawyers | 499 | 7k | 9k / **14k** / 21k | 28 | 25k | 348 | 11% | 0% | — |
| S4 In-house legal teams at companies with 500-4,999 employees | 999 | 2k | 5k / **9k** / 16k | 9 | 22k | 836 | 0% | 0% | 39.6% |
| S7 Immigration firms | 499 | 2k | 3k / **6k** / 10k | 12 | 7k | 755 | 0% | 0% | 104.4% (exceeds the US market) |
| S6 Privacy-first solos | 499 | 2k | 2k / **4k** / 7k | 8 | 7k | 1k | 0% | 0% | 13.9% |
| S8 Legal aid / nonprofits | 999 | 0 | 93 / **221** / 394 | 0 | 195 | 538 | 0% | 0% | 6367.7% (exceeds the US market) |

## Combined plan: top 3 segments (S1 Mid-size law firms, ~11-50 lawyers, S2 Document-heavy small litigation firms, 2-10 lawyers (PI, med-mal, civil lit), S3 Insurance defense firms)

| Metric | P10 | P50 | P90 |
|---|---|---|---|
| MRR at month 6 | 27k | 38k | 50k |
| MRR at month 12 | 65k | 88k | 113k |
| MRR at month 24 | 94k | 128k | 167k |
| Customers at month 12 | 85 | 117 | 153 |
| Customers at month 24 | 127 | 179 | 239 |
| Setup fees collected over 24 months | 422k | 566k | 733k |
| Cost per customer | 174 | 234 | 330 |

Chance the combined plan reaches 10k USD MRR by month 6: **96%**.

## How to read this

- The simulation ranks segments by how quickly the *same outbound effort* turns into recurring revenue, given each segment's price, reply and close ranges, sales cycle and churn.
- **"US share needed for 100M ARR"** shows whether a segment alone could ever carry a 100M-dollar business. Above ~10% means the segment is a beachhead, not the whole company.
- **Replace the assumed ranges** in `data/icp.json` with the smoke test's measured reply and close rates, then re-run `python3 ../simulate_revenue.py .`.
