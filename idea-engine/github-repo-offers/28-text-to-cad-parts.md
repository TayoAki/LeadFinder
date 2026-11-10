# Niche Scorecard: Text-to-CAD replacement parts from a photo (Gate 0)

Date 2026-11-10 · sources: GitHub page, Upwork/Fiverr/CADCrowd/Freelancer via web search, Reddit (treg: r/3Dprinting, r/Machinists), vendor pricing pages · windows: Reddit 2026-08-10 to 2026-11-10 (r/3Dprinting), 12 months (r/Machinists).

Offer: photo of a broken or discontinued machine part → CAD file ready to 3D print or machine, for equipment repair shops and small manufacturers; no load-bearing parts. $300 per part, fabrication at cost.

| Check | Result | Evidence |
|---|---|---|
| 1. Buyers asking (20+) | ❌ FAIL | Tight 0 from repair shops/manufacturers. Loose ~7, mostly hobbyists. |
| 2. Competitors with live prices | ⚠️ PASS but crowded | Fiverr gigs; pro shops $300-1,500/part; free AI photo-to-STL for rough shapes. |
| 3. Margin ≥50% | ❌ FAIL | ~0-40% at $300 once measuring and fit iterations are counted. |
| 4. Watering holes | ✅ PASS | r/Machinists, r/3Dprinting, Practical Machinist, local repair trade groups. |

## The repo
- **earthtojake/text-to-cad** ([GitHub](https://github.com/earthtojake/text-to-cad)): MIT, page shows ~25.9k stars, 2.5k forks, 1,502 commits. Agent skills that write build123d/OpenCASCADE Python, export STEP/STL/3MF/DXF, PDF drawings, CalculiX stress checks.
- Input is **text** (you describe the part to the agent). The README does not mention photo input. "Photo to CAD" relies on the operator reading dimensions, not on the repo.
- No accuracy data in the README.

## The core problem: dimensions
- A photo has no scale or tolerance. Every vendor and seller asks for calipers measurements, a scan or the physical part ([CADmore](https://cadmore.com/blog/reverse-engineering-cost-to-cad): "an exact number requires the actual part or drawing"; Fiverr sellers: ["accuracy relies on the measurements you provide"](https://fiverr.com/olbaba/reverse-engineer-mechanical-parts-from-scan-data-stl-obj-mesh-and-images-to-cad)).
- Broken/worn samples hide the original geometry. Mating fits (bores, gears, snap-fits) usually need a test print and a second round.
- AI photo-to-STL tools work for "simple mechanical shapes", not exact fits ([3D AI Studio](https://www.3daistudio.com/convert/photo-to-stl), [Leo AI](https://www.getleo.ai/blog/sketch-to-cad-ai)).
- Liability: a machine part that fails can injure someone or stop a line. "No load-bearing" is hard to police on machines.

## 1. Buyers asking
- **Tight (repair shops / small manufacturers asking for this): 0 found.**
- **Loose (~7, last ~90 days unless noted):**
  - r/Machinists [paid project: reverse-engineer Porsche 991 seat lever and CNC it](https://www.reddit.com/r/Machinists/comments/1wyl9ag/paid_project_anyone_want_to_reverseengineer_my/) (2026-10-05, consumer).
  - r/3Dprinting [15-year-old needs a vintage VCR gear modeled](https://www.reddit.com/r/3Dprinting/comments/1xhi3xf/15yo_broke_student_needs_help_cad_modeling_a/) ("broke", has caliper measurements), [Acura front lip replacement](https://www.reddit.com/r/3Dprinting/comments/1x496a9/looking_for_advice_on_3d_printing_a_replacement/), [phone holder](https://www.reddit.com/r/3Dprinting/comments/1xj8308/has_anyone_reverse_engineered_and_modeled_this/), [CAD designer for airsoft AUG](https://www.reddit.com/r/3Dprinting/comments/1wtgot0/looking_for_a_mechanical_engineer_cad_designer/).
  - Upwork [CAD Designer for Automotive Trim](https://www.upwork.com/freelance-jobs/apply/CAD-Designer-for-Automotive-Trim_~022112704965487484953/) (US individual; scans, photos and measurements). Freelancer.de [Ersatzteil print file](https://www.freelancer.de/projects/3d-print-design/druckdatei-ersatzteil-erstellen).
- Budgets: not verified; hobbyist posts signal low budgets.

## 2. Competitors (prices)
- **Fiverr:** many "recreate broken part" gigs ([k_3dsolutions](https://fiverr.com/k_3dsolutions/recreate-broken-or-unavailable-replacement-parts-for-3d-printing), [danigr_3d](https://fiverr.com/danigr_3d/3d-model-your-broken-parts-for-3d-printing-or-cnc), [part + shipped replacement](https://fiverr.com/catalystlokijjm/reverse-engineer-your-broken-part-and-ship-you-a-replacement)). Gig prices: 403, not verified live. A hobby-tier vendor lists ~$45-90 simple parts, $90-200 moderate (per search summary of [roc-3d](https://roc-3d-website.pages.dev/blog/reverse-engineering), not verified live).
- **CADmore** ([pricing blog](https://cadmore.com/blog/reverse-engineering-cost-to-cad)): $300-800 per part for 3D-print targets, $800-1,500 for CNC/molding; scan from $260; $100 consultation; 8-10 business days.
- **Kavanagh Industries** (MI): scan $300-500; full RE with SOLIDWORKS model, drawing and GD&T $750-1,400 ([page](https://kavanaghind-com.pages.dev/reverse-engineering-michigan)).
- **RapidMade:** scans from $195, design $135/h ([page](https://david-shapiro-oes0.squarespace.com/reverse-engineering-3d-scanning)).
- **Remachined** (Toronto): scan-to-machined part $5k-15k incl. machining ([page](https://remachinedwebsitev01.pages.dev/reverse-engineering)).
- Read: $300 is the bottom of the pro range, but pros include a scan, drawing and the physical part in hand. Below it, Fiverr is crowded.

## 3. Margin (at $300 per part)
- Tools: Claude tokens ~$2-10 (not verified), repo free.
- Hours: intake and getting usable measurements from a non-technical client 0.5-1 h; modeling + checking the agent's geometry 1-2 h; test print/fit feedback and one revision 1-2 h; drawing/export 0.25 h = 2.75-5.25 h.
- Rate: competent CAD person $60/h → $165-315.
- Margin: (300 − 10 − 165)/300 = **42%** best; (300 − 10 − 315)/300 = **-8%** worst. Fails 50% in every realistic case.
- "Fabrication at cost" adds coordination time with zero markup.

## 4. Watering holes
- r/Machinists, r/3Dprinting, r/functionalprint, r/AskEngineers; Practical Machinist forum; Printables "requests"; local equipment-repair groups; state manufacturing extension partnerships (MEP centers); CADCrowd and Upwork CAD categories.

## Attention (30-day)
- Course/AI hype: ["AI & Fusion to reverse engineer an STL"](https://www.reddit.com/r/3Dprinting/comments/1xb78gv/ai_fusion_to_reverse_engineer_an_stl_file_crazy/) (2026-10-20). Supply-side gigs are plentiful; business buyers are quiet online and buy locally.

## The video's claims vs the evidence
- "Photo → CAD": the repo is text-to-CAD; dimensions still come from a human with calipers or a scanner.
- "$300 per part": matches the bottom of the pro range, but pros get the part in hand and charge for drawings and GD&T.
- "Repair shops and small manufacturers": no online evidence of them asking; they buy from local scan/machine shops.

## Verdict: ❌ REJECT
Fails check 1 (tight 0) and check 3 (margin below 50% at $300).
**Better angle:** a local "obsolete part recovery" service for one equipment vertical (e.g. commercial kitchen, packaging, or textile machinery), part shipped in, calipers/scan, drawing + STEP + first article, priced $600-1,200 like CADmore/Kavanagh. That is a scan bureau business, not an AI arbitrage, and needs its own Gate 0.
