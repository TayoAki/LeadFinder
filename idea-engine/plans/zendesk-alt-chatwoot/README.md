# FlatDesk: Zendesk alternative with AI included at a flat price (built on Chatwoot)

Leave Zendesk at your next renewal without the migration project: tickets, macros and help centre moved in 7 days, then one flat monthly price with the AI agent included. Month to month, no per-resolution fees.

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

Top 3 segments: S3 Zendesk renewal-trapped SMB/mid-market (10-500 staff), S1 Shopify/DTC brands on Gorgias or Zendesk (2-15 agents), S4 Help Scout / Freshdesk repriced small teams.
- MRR at month 12: P10 57,794 · **P50 69,543** · P90 83,256 USD
- Paying customers at month 12 (P50): 140; at month 24: 175

## UI status at the time of this zip

**Automated score: 10/10** (persona tasks on desktop and phone + global checks)

Round 2 of the UI is still being rebuilt after the first independent review (which scored round 1 at 4/10). An updated zip follows once round 2 passes an independent review.

## How to rebuild

```
python3 shared/ui-kit/build.py .          # from the folder above this one, see build.py
node shared/ui-kit/simulate.js <plan dir> # persona walkthrough
python3 shared/simulate_revenue.py <plan dir>
```
