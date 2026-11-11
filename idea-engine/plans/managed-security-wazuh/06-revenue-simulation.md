# Revenue simulation (Monte Carlo)

**5,000 simulated runs per segment, 24 months.** Every rate comes from `data/icp.json` as a range and is drawn at random in each run, so the results are ranges, not forecasts. These are planning assumptions until the smoke test replaces them with measured numbers.

**Settings:**
- **Per-segment comparison:** 1,000 new outbound contacts per month into each segment, at 1.00 USD per contact all-in (data, enrichment, sending tools and SDR time).
- **Combined plan:** 3,000 contacts per month split across the top 3 segments.
- **P10 / P50 / P90:** the pessimistic, middle and optimistic outcomes; 80% of runs fall between P10 and P90.

## Per segment (1,000 contacts a month each)

| Segment | Price/mo | MRR at month 6 (P50) | MRR at month 12 (P10 / P50 / P90) | Customers at month 12 (P50) | MRR at month 24 (P50) | Cost per customer (P50) | Chance of 10k MRR by month 6 | Chance of 100k MRR by month 24 | US share needed for 100M ARR |
|---|---|---|---|---|---|---|---|---|---|
| MSPs without in-house SOC (white-label partner) | 1,800 | 46k | 64k / **103k** / 160k | 57 | 98k | 167 | 100% | 67% | 38.5% |
| Defense contractors needing CMMC Level 2 (gated on in-enclave delivery opinion) | 2,200 | 13k | 30k / **53k** / 89k | 24 | 53k | 304 | 61% | 8% | 45.4% |
| Franchised auto dealerships (FTC Safeguards) | 1,499 | 20k | 30k / **50k** / 80k | 33 | 77k | 283 | 95% | 30% | 33.2% |
| Lean in-house IT teams (100-499 employees) at MDR/EDR renewal | 1,600 | 13k | 21k / **38k** / 65k | 24 | 82k | 421 | 72% | 33% | 3.0% |
| Accounting and tax firms (FTC Safeguards / WISP) | 700 | 6k | 8k / **15k** / 25k | 21 | 20k | 439 | 12% | 0% | 77.0% |
| Small manufacturers (non-defense) at cyber-insurance renewal | 1,100 | 5k | 8k / **14k** / 22k | 12 | 30k | 787 | 3% | 0% | 9.4% |
| Law firms (10-249 staff) - via MSP partners only | 800 | 2k | 3k / **6k** / 10k | 7 | 12k | 1k | 0% | 0% | 48.9% |
| Medical and dental practices (HIPAA) - via MSP partners only | 450 | 1k | 2k / **3k** / 6k | 7 | 7k | 1k | 0% | 0% | 29.6% |

## Combined plan: top 3 segments (MSPs without in-house SOC (white-label partner), Defense contractors needing CMMC Level 2 (gated on in-enclave delivery opinion), Franchised auto dealerships (FTC Safeguards))

| Metric | P10 | P50 | P90 |
|---|---|---|---|
| MRR at month 6 | 58k | 83k | 115k |
| MRR at month 12 | 158k | 214k | 281k |
| MRR at month 24 | 176k | 237k | 307k |
| Customers at month 12 | 88 | 119 | 156 |
| Customers at month 24 | 100 | 135 | 175 |
| Setup fees collected over 24 months | 161k | 233k | 328k |
| Cost per customer | 175 | 227 | 306 |

Chance the combined plan reaches 10k USD MRR by month 6: **100%**.

## How to read this

- The simulation ranks segments by how quickly the *same outbound effort* turns into recurring revenue, given each segment's price, reply and close ranges, sales cycle and churn.
- **"US share needed for 100M ARR"** shows whether a segment alone could ever carry a 100M-dollar business. Above ~10% means the segment is a beachhead, not the whole company.
- **Replace the assumed ranges** in `data/icp.json` with the smoke test's measured reply and close rates, then re-run `python3 ../simulate_revenue.py .`.
