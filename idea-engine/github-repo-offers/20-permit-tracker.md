# Niche Scorecard: "Permit tracker" on Browser Use (Gate 0)

2026-11-10 · Offer: a bot checks each city permit portal daily, updates a sheet, and texts the PM on any change. Buyers: home builders, remodelers, pool and solar installers with 20+ active permits across cities. Price in the video: $1,500 setup + $250/mo. Lead source: job posts for permit coordinators.
Sources: LinkedIn jobs via treg (US, "permit coordinator", posted in the last month, 10 pages = 100 rows, which hit the cap), Google index of Upwork job pages via treg (past year, 3 queries), Reddit search via treg (past year, 2 queries), vendor pages, city portal guides.

| Check | Result | Evidence |
|---|---|---|
| 1. Buyers asking (20+) | 🟡 MIXED | Loose: 81 permit-titled roles in a 100-row, 30-day LinkedIn sample (capped, so the true number is higher). Tight to the ICP: 18 of those (builders, remodelers, solar, home services). Upwork tight: about 4 a year. |
| 2. Competitors with live prices | ✅ PASS (low floor) | PermitFlag $19/mo (Accela portals only); Plotwise $49-399/mo (not verified live); PermitFlow quote-only; expediters charge $500-2,000+ per permit. |
| 3. Margin ≥50% at $250/mo | ⚠️ BORDERLINE | 52% at 2 h/mo upkeep, 12% at 4 h/mo. Hours are estimates. |
| 4. Named watering holes | ✅ PASS | See section 4. |

## The repo
[browser-use/browser-use](https://github.com/browser-use/browser-use): real, about 120k stars, MIT. It is an LLM-driven browser agent that needs a Browser Use cloud key or your own LLM key. Using an LLM agent to read a status field on the same pages every day is costly and non-deterministic. A plain Playwright scraper per portal type is cheaper and more reliable. Browser Use earns its place only on one-off, odd portals.

## 1. Buyers asking
**Job boards (strongest signal).** In the last 30 days, 81 of 100 sampled LinkedIn rows were permit-titled roles. 18 match the ICP exactly, including:
- Home builders: [D.R. Horton, Chicago](https://www.linkedin.com/jobs/view/permit-coordinator-at-d-r-horton-4467715719); [D.R. Horton, WA](https://www.linkedin.com/jobs/view/permit-coordinator-wa-at-d-r-horton-4479296461); [Stanley Martin Homes](https://www.linkedin.com/jobs/view/permit-coordinator-at-stanley-martin-homes-4482521833); [Mungo Homes](https://www.linkedin.com/jobs/view/permit-specialist-at-mungo-homes-4467909965); [Grand Canyon Development](https://www.linkedin.com/jobs/view/construction-permits-coordinator-at-grand-canyon-development-partners-4485680011).
- Remodelers and home services: [West Shore Home](https://www.linkedin.com/jobs/view/permitting-specialist-at-west-shore-home-4488434907) (2 posts); [Groundworks, "Centralized Permit Coordinator"](https://www.linkedin.com/jobs/view/centralized-permit-coordinator-at-groundworks-4472200299); [Baker Brothers](https://www.linkedin.com/jobs/view/permit-coordinator-at-baker-brothers-plumbing-air-electric-4469913329); [Dilling](https://www.linkedin.com/jobs/view/permitting-coordinator-at-dilling-heating-cooling-plumbing-electrical-4486470395); [Blaze](https://www.linkedin.com/jobs/view/permitting-coordinator-at-blaze-heating-cooling-electrical-plumbing-4476783995); [Hogan Roofing](https://www.linkedin.com/jobs/view/permit-coordinator-at-hogan-roofing-waterproofing-4482478820); [Advanced Hurricane Technology](https://www.linkedin.com/jobs/view/permit-coordinator-at-advanced-hurricane-technology-4487515402).
- Solar: [Qcells, Permit Specialist, New Homes](https://www.linkedin.com/jobs/view/permit-specialist-new-homes-at-qcells-north-america-4482588983).

The other ~63 are utilities, telecom, oil and gas, engineering firms and cities.

**Caveat:** these firms are hiring a person to submit, correct, schedule inspections and chase. Status-watching is maybe 10-20% of that job (not verified). A $250 bot does not replace the hire. At best it makes one coordinator cover more permits.

**Upwork (past year).** Tight: "Solar & Energy Storage Permit Specialist" ("submit permits… through their online portals and track them through approval", ID 022113665963); Illinois Residential Battery Storage Permitting & Utility coordinator (ID 022118772040); Solar Administrative & Operations Assistant ("prepare, submit, and track solar permit applications", ID 022118779339); Construction VA ("track… permit status, inspection results", ID 022115825742). That is **about 4.** Loose: about 15 permit-drawing and expediter jobs, which are not this deliverable.

**Reddit (past year).** Asks: [How do you track permits across multiple construction projects?](https://www.reddit.com/r/smallbusiness/comments/1twzr6n/how_do_you_track_permits_across_multiple/); [How are you all tracking permit portal updates?](https://www.reddit.com/r/construction_permit/comments/1ul0dx4/how_are_you_all_tracking_permit_portal_updates/); [Does Procore handle permit tracking well?](https://www.reddit.com/r/ConstructionMNGT/comments/1ttftl8/does_procore_actually_handle_permit_tracking_well/); [Contractors across multiple cities: how much time lost to permits?](https://www.reddit.com/r/hvacadvice/comments/1vrbkmj/contractors_who_work_across_multiple_cities_how/). Some of these read like founder validation posts (not verified). Roughly 4-6 genuine asks.

## 2. Competitors (live prices)
- **PermitFlag**: [Chrome extension, $19/mo or $149/yr](https://permitflag-web.pages.dev/). "Check All" across 300+ Accela city and county portals, with change flags and history. It covers the biggest portal vendor for about 1/13 of the video's price.
- **Plotwise**: $49-399/mo flat, with permit slots scaling by tier, per a search snippet of its [Capterra listing](https://www.capterra.com/p/10038054/Plotwise/). The page returned 403, so this is not verified live.
- **PermitFlow**: quote-only. One blog lists $350/mo ([Projul review](https://projul.com/blog/best-construction-permit-tracking-software/) says custom quotes; not verified).
- **Apify permit-status actor**: [$0.005 per status row](https://apify.com/curative_blanket/permit-status-tracker), Austin and SF only, 1 user.
- **Shovels.ai**: [$599-999/mo](https://www.shovels.ai/pricing). This is permit data for lead generation, with no per-permit status alerts.
- **Expediters**: $500-2,000+ per permit flat, or $75-150/h (vendor blog figures via [PermitFlow's blog](https://permitflow.com/blog/permit-expediter)).
- **Free option:** some Accela cities email status changes and inspection results to the registered contact ([San Mateo County](https://www.smcgov.org/media/156024/download), [Oregon City](https://orcity.org/DocumentCenter/View/13864)). Many do not; this varies by city.

## 3. Margin at $250/mo (hours are estimates)
- Tools: VPS ~$10. LLM calls if using Browser Use: 30 permits × 30 days = 900 runs at roughly $0.01-0.05 each = $9-45 (estimate). Twilio SMS ~$5.
- Upkeep: portals across 5-10 vendors (Accela, Tyler EnerGov, eTRAKiT, CityView, custom). Session logins expire, captchas appear, permits are added and closed weekly, and the PM asks questions.
- At 2 h × $50: (250 − 30 − 100) / 250 = **48-52%**.
- At 4 h: (250 − 30 − 200) / 250 = **8-12%**.
- Setup: $1,500 covers about 20-30 h of portal mapping, which is fine.

It passes only if most permits sit on 2-3 portal types and you use deterministic scrapers rather than an LLM agent.

**Legal and ToS:** many permit status pages need a login tied to the permit holder (e.g. [Santa Barbara ACA](https://santabarbaraca.gov/sites/default/files/2025-03/ACAUserGuide-Check%20Status.pdf)). You would store client credentials and automate logins. No permit-portal terms banning bots were found in a quick search, but other city portals do ban "scripts, bots, crawlers" (e.g. [Houston CSMART](https://HOUSTONTX.GOV/courts/csmart-useragreement.pdf)). Check each portal's terms, and get written client authorization to use their logins. The risk is low but not zero (account lockout).

## 4. Watering holes
r/construction_permit, r/Contractor, r/solar, r/ConstructionMNGT; NAHB and local Home Builders Associations; NARI (remodelers); PHTA (Pool & Hot Tub Alliance); SEIA and state solar associations (e.g. CALSSA, FlaSEIA); and companies posting "permit coordinator" roles (list above). Shovels.ai's free tier (500 credits) or city open-data portals can list contractors with 20+ open permits by city. That is a precise list-building source.

## Attention (30-day)
The seller side is active: Chrome extensions, Apify actors, and "I built a permit data tool" posts (r/SideProject, r/smallbusiness). Buyer asks on Reddit are few. Hiring is the real signal.

## The video's claims vs the evidence
- "Lead: permit coordinator job posts": **verified.** 18 tight ICP posts in a 30-day sample.
- "$1,500 + $250/mo": plausible against expediter pricing, but PermitFlag at $19/mo covers Accela cities, so the premium is only defensible for multi-vendor portals plus SMS and a sheet.
- "Browser Use" is overkill for daily status reads.

## Verdict: 🟡 RESEARCH SLOT
There is a strong money signal: firms are paying salaries for this role right now, and expediters charge per permit. The on-platform cluster for a tracking-only service is weak (about 4 on Upwork), and margin depends on keeping upkeep under about 2 h/mo.

**Better angle:** sell to the 18 companies hiring now as "your new coordinator covers 3x the permits". Price per active permit (for example $8-10 per permit per month, with a $250 floor), and add inspection-result and expiry alerts. Start with solar and pool installers in one metro whose permits sit on 2-3 portal types. Validate with 5 calls to companies from the LinkedIn list before building.
