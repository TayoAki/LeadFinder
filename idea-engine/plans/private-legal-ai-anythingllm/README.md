# Briefcase: private AI for law firms on their own documents (built on AnythingLLM)

A private AI workspace per firm: answers cited to the firm's own documents, nothing used for training, a flat price per firm instead of per-seat minimums, and a human-review step on every AI output.

## What's in this zip

| File | What it is |
|---|---|
| `01-pain-points.md` | Real complaints about the incumbents (Reddit, Trustpilot, review sites), hand-labelled and tallied, with links |
| `02-offer-spec.md` | The offer rebuilt around those pains: pricing tiers, guarantees, what we won't do |
| `03-icp-canvas.md` | ICP segments with US counts, pain in buyers' own words, triggers, watering holes, objections, how to find email + phone |
| `04-simulation-panel.md` | **SIMULATED** buyer panel (not demand evidence) used to pick which variant to test first |
| `05-gtm-90-day.md` | Channels, lead sourcing, cold emails and call openers, landing page, smoke test with pre-registered PASS/KILL thresholds, 90-day plan |
| `06-revenue-simulation.md` | Monte Carlo revenue model per segment and for the top 3 combined |
| `ui/index.html` | Clickable front-end mockup (open in a browser; mock data, no backend), following the wireframe: left rail, sidebar, tabs, main, right side bar, bottom bar |
| `ui/personas.json` | Buyer personas by department: what they care about, how they spend time, what they struggle with, how the product helps, and the tasks used to test the UI |
| `ui/sim/` | Browser walkthrough report and screenshots; independent reviews (`review-round*.json`) and change logs |
| `data/` | Raw evidence and the machine-readable ICP file (`icp.json`) |
| `shared/COMPARISON.md` | The three plans side by side |
| `shared/CHANNELS.md` | Market trends and proven acquisition channels for all three |
| `shared/ui-kit/` + `shared/simulate_revenue.py` | Tools to rebuild the UI and re-run the walkthrough and revenue model |

## Headline numbers (simulated; rates are planning assumptions until the smoke test)

Top 3 segments: S1 Mid-size law firms, ~11-50 lawyers, S2 Document-heavy small litigation firms, 2-10 lawyers (PI, med-mal, civil lit), S3 Insurance defense firms.
- MRR at month 12: P10 65,327 · **P50 87,687** · P90 113,402 USD
- Paying customers at month 12 (P50): 117; at month 24: 179

## UI status at the time of this zip

**Automated score: 6.3/10** (persona tasks on desktop and phone + global checks)

Round 2 of the UI is still being rebuilt after the first independent review (which scored round 1 at 3/10). An updated zip follows once round 2 passes an independent review.

## How to rebuild

```
python3 shared/ui-kit/build.py .          # from the folder above this one, see build.py
node shared/ui-kit/simulate.js <plan dir> # persona walkthrough
python3 shared/simulate_revenue.py <plan dir>
```
