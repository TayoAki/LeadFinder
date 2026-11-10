# Deep dive: Permit tracker for multi-city contractors

2026-11-10 · Follows the first-pass scorecard [20-permit-tracker.md](../github-repo-offers/20-permit-tracker.md) (🟡 research slot) and uses [METHOD.md](../github-repo-offers/METHOD.md) for Gate 0.

**Verdict: 🟡 RESEARCH SLOT. It is close to a pick, and one paid pilot would make it one.** Hiring demand is large and verified. What is not verified is that anyone pays for status-watching on its own. Buyers pay for the whole coordinator job. The version worth testing is a narrow done-for-you "permit watch desk" for multi-jurisdiction home-services and remodel firms in one Florida metro. It is priced per active permit, with an upsell to human inspection scheduling.

**Data and spend.** Job data came from treg `blitzapi.jobs.search` (a LinkedIn job index, last 60 days, US, 12 permit job titles) and treg `crawl4ai.indeed.search.jobs` (Indeed, first result page per query across 20 states). Pain posts came from treg `crawl4ai.reddit.search.posts` (past year). Everything else came from web search and vendor pages. My calls cost about **$0.31**, summed from each call's `charged_micro`. The team balance went from $9.11 to $8.38, but other sessions were spending from the same balance at the same time, so that $0.73 drop is not all mine.

---

## 1. Demand size

### Job count (60 days, US)
| Cut | Postings | Companies |
|---|---|---|
| All permit-titled jobs on the LinkedIn index (12 titles) | **985** | not deduped |
| Government Administration employers | 217 | – |
| Oil & gas, utilities, environmental, civil/engineering, consulting, architecture employers | 251 | – |
| **What remains (pulled in full and deduped)** | **531** | **217** |

I classified the 217 remaining companies by hand from company name and job title:

| Segment | Posts | Companies | Examples |
|---|---|---|---|
| Remodel/replacement (windows, baths, roofing, foundation) | 48 | 19 | Groundworks + Mount Valley (28 "Centralized Permit Coordinator" posts), West Shore Home, Window Nation, Renewal by Andersen dealers (4), Advanced Hurricane Technology, Crown Roofing, Bartlett Roofing |
| HVAC/plumbing/electrical/generators/fire | 29 | 21 | American Residential Services, Wrench Group, Cool Today, Baker Brothers, Dilling, Blaze, Eanes, Generator Supercenter |
| Production/home builders | 24 | 13 | D.R. Horton, Lennar, Stanley Martin, NVR, Dream Finders, Century Complete, Mungo |
| Commercial GC / multi-site retail build-outs | 21 | 12 | rand* construction, Parkway, Raising Cane's, Mavis Tire |
| Solar | 7 | 5 | Qcells (EPC and New Homes), Sunrun, Spartan X |
| Signage | 3 | 3 | Signarama, Arizona Commercial Signs |
| Pools | 2 | 1 | Neal Communities / Waterscapes Pools & Spa |
| Telecom/fiber (adjacent: right-of-way and pole permits) | 62 | 21 | Ledcor, Pike, Metronet, Ezee Fiber, Zayo, MasTec |
| Permit service firms (competitors) | 41 | 6 | **Pulley (30 permitting PM posts)**, GreenLite, Milrose, Inspected |
| Other (environmental, data-center land, trucking oversize, staffing, noise) | 294 | 116 | WSP alone posted 81 |

- **Tight ICP (builders, remodel, HVAC, solar, pools, signage, commercial GC): 74 companies on LinkedIn in 60 days.**
- **Indeed added 12 more ICP companies** not on the LinkedIn list: All Phase Roofing, DSW Homes, Be Limitless Contractors, GCB Solar, Volt Home Pros, Master Foundation & Crawl Space Repair, Aurora Sign, Arrow Sign, Rogers Electric, Island Pump and Tank, Sovereign, SARGENTI. This is a floor, not a full count, because Indeed pagination failed and only page 1 per query was read.
- **Total: about 86 ICP companies hiring for the role in 60 days.** Adding telecom/fiber gives about 107.
- **Read on the count:** this clears the 20+ bar about 4x. Hiring is concentrated: Groundworks/Mount Valley posted 28 and Pulley 30. **Florida's Gulf Coast is the densest cluster**: Advanced Hurricane, Crown Roofing, Cool Today, Wrench Group, Neal Waterscapes, Lennar Fort Myers, West Shore Tampa, Window Nation Tampa, Stevens Construction, DSW Homes and All Phase Roofing.

**By company size** (the 531 remaining posts, using LinkedIn's company-size filter): 1-10: 17 · 11-50: 60 · 51-200: 88 · 201-500: 48 · 501-1,000: 42 · 1,001-5,000: 52 · 5,001-10,000: 60 · 10,001+: 164. The 10,001+ band is inflated by WSP. The ICP sweet spot is the 51-5,000 band: regional home-services platforms and remodel brands.

### Salaries (the cost we would save)
From Indeed postings that published pay, ICP employers only:

| Employer | Pay |
|---|---|
| [ARS / Rescue Rooter HVAC, Norcross GA](https://www.indeed.com/viewjob?jk=dda780066de7e3f4) | $19-21/h |
| [Dilling, Charlotte](https://www.indeed.com/viewjob?jk=eea6475f5b20c9ca) | $18-25/h |
| [Tri-State Water, Power & Air, Nashville](https://www.indeed.com/viewjob?jk=85023b91cc5c0c4e) | $18-20/h |
| [Generator Supercenter, IL](https://www.indeed.com/viewjob?jk=96b6a1c41b491770) | $18-25/h |
| [All Phase Roofing, FL](https://www.indeed.com/viewjob?jk=00d8f6a4419c64f8) | from $25/h |
| [Renewal by Andersen, Portland](https://www.indeed.com/viewjob?jk=cecb90c4b6e32968) | $22-25/h |
| [Master Foundation, Knoxville](https://www.indeed.com/viewjob?jk=011b4a20638ec416) | $16-18/h |
| [Groundworks, Charlotte](https://www.linkedin.com/jobs/view/centralized-permit-coordinator-at-groundworks-4472200299) | $21.50/h |
| [Volt Home Pros, IL](https://www.indeed.com/viewjob?jk=a4921d60167de289) | $48-55k |
| [Be Limitless Contractors, FL](https://www.indeed.com/viewjob?jk=202ac45e52477af4) | $40-60k |
| [GCB Solar, OR](https://www.indeed.com/viewjob?jk=84a8cb2eb05a6d73) | $50-60k |
| [rand* construction, Denver](https://www.indeed.com/viewjob?jk=1b46d816f77798ea) | $70-90k |
| [SARGENTI, NJ](https://www.indeed.com/viewjob?jk=28620d55ea74fc7d) | $70-90k |
| [Qcells New Homes, Irvine](https://www.indeed.com/viewjob?jk=cf10ef15537fed50) | $79.2-112.3k |

**Takeaway:** a home-services permit coordinator costs **$18-25/h, about $37-52k base**. With a 1.25-1.3x loading (estimate), that is roughly **$4-5.5k a month**. Builder and solar roles run $50-112k. A service priced at $500-1,000/mo is a small share of one hire.

### What the job actually is
The [Groundworks "Centralized Permit Coordinator" post](https://www.linkedin.com/jobs/view/centralized-permit-coordinator-at-groundworks-4472200299) lists 12 duties. Only about 3 of them are tracking and reporting: "tracking logs… status updates", "report permit status", and "flag aging or at-risk permits". The rest are submitting, revisions and "kickbacks", scheduling inspections, handling failed inspections, and closeout. The ARS post asks for "experience with permitting and permit tracking" ([Indeed](https://www.indeed.com/viewjob?jk=dda780066de7e3f4)). **Status-watching is a real but minority slice, roughly 20-30% by duty count.** That is my estimate from duty lists, not time studies.

### Buyer complaints and asks
These are thin. In a year of Reddit:
- [How are you all tracking permit portal updates?](https://www.reddit.com/r/construction_permit/comments/1ul0dx4/how_are_you_all_tracking_permit_portal_updates/)
- [How do you keep up with permit changes without going insane?](https://www.reddit.com/r/Construction/comments/1qcbdc9/how_do_you_keep_up_with_permit_changes_without/)
- [Anyone using monday.com to track building permits?](https://www.reddit.com/r/Construction/comments/1r1h2fw/anyone_using_mondaycom_to_track_building_permits/) and the [r/mondaydotcom twin](https://www.reddit.com/r/mondaydotcom/comments/1r1gxae/how_are_you_tracking_building_permits_in_mondaycom/)
- [Does Procore handle permit tracking well?](https://www.reddit.com/r/ConstructionMNGT/comments/1ttftl8/does_procore_actually_handle_permit_tracking_well/)
- [County holding up permits](https://www.reddit.com/r/solar/comments/1p9155j/county_holding_up_permits/) (r/solar)

That is about 6, and several look like founder-validation posts (not verified). Seller posts outnumber buyer asks: permit-data lead tools in [r/Roofing](https://www.reddit.com/r/Roofing/comments/1t58y2h/new_construction_permits_people_who_need_roofing/) and [r/smallbusiness](https://www.reddit.com/r/smallbusiness/comments/1tm8h9m/free_tool_i_built_for_contractors_and_trades_pull/), and [a teardown of a "permit approvals" plugin](https://www.reddit.com/r/SaaS/comments/1xdrco4/tore_down_a_chatgpt_plugin_human_back_end_for_hoa/). **The money signal is in hiring, not in public complaints.**

---

## 2. Which slice is automatable, and what buyers pay

| Slice | Automatable? | What people pay today |
|---|---|---|
| **Status tracking** (status, corrections issued, approvals, expiry) | **Yes, mostly.** Read-only and deterministic per platform. | $19/mo DIY ([PermitFlag](https://permitflag-web.pages.dev/)); $49-399/mo for 3-30 permit slots ([Plotwise via Capterra](https://www.capterra.com/p/10038054/Plotwise/), not verified live), which is **$13-16 per permit per month**. Inside the coordinator salary otherwise. |
| **Inspection results** | Yes, where the portal shows results. Same scrape. | Bundled with the above. |
| **Inspection scheduling** | Partly. Needs the contractor's login and booking actions; IVR in some cities. Riskier. | [PermitOps](https://permitops.pages.dev/) lists $199 per inspection watch and $1,495/mo for 5 watches. It is "early access", so treat as an asking price, not proven sales. |
| **Corrections/resubmittals** | No. Needs plan and engineering edits plus human judgment. | Expediters bill $100-500+ per application for corrections and follow-up ([guide figures, low quality](https://permitplace.com/permit-expediter-cost-guide/)). |
| **Full submission** | Partly (forms), with heavy human work. PermitFlow is building agents for it. | Runner: $50-150 per simple permit, or $35-100/h (guide figures). [Permit Place](https://permitplace.com/permit-expediter-cost-guide/): residential $500-2,500, new residential $1,500-5,000, commercial TI $2,000-10,000. Permit Place runner trip: $450-600 per transaction. Solar: [SolarAPP+ $35 per permit](https://help.gosolarapp.org/article/75-how-much-does-solarapp-cost-an-installer-to-use) (instant approval in participating AHJs); plan sets $150-2,000 (vendor figures). |

**Conclusion.** Tracking plus inspection results is the slice a bot does well. On its own it is anchored low ($13-16 per permit DIY, $19/mo for Accela only). Buyers' real spend is on people who submit, fix and book. **Lead with tracking, which proves value cheaply. Make money on the human add-on**: inspection booking plus chasing corrections.

---

## 3. Competitors

| Player | What it does | Price | Target | Gap for us |
|---|---|---|---|---|
| [PermitFlag](https://permitflag-web.pages.dev/) | Chrome extension. "Check All" reads saved Accela permits and flags changes. | **$19/mo or $149/yr** (live page) | Builders with 10-40 permits | Accela only. Manual click, runs in the browser. No email yet, no inspections, no team sync. |
| Plotwise ([Capterra](https://www.capterra.com/p/10038054/Plotwise/)) | Multi-jurisdiction permit monitoring with email/SMS alerts | $49 (3 slots) to $399 (30 slots)/mo. Third-party listing; vendor page not verified. | Small firms, agencies | Slot caps make 100+ permits costly. Coverage not verified. |
| PermitFlow ([Series B](https://permitflow.com/blog/permitflow-series-b); [home builders](https://www.permitflow.com/solutions/home-builders)) | AI agents for research, submission, coordination, issuance, inspections and closeout | **Quote only.** $54M Series B (Accel, Dec 2025), about $90M raised. | Top national builders (shows Lennar, Toll, Meritage, M/I, Brookfield logos) and big GCs | Enterprise sales motion. Small regional home-services firms are likely below its focus (inference). |
| [Pulley](https://www.withpulley.com/resources/guide-to-ev-permitting) | Software plus a done-for-you permitting team | Quote only (pricing page 404) | EV charging, solar, telecom | **Hiring 30 permitting PMs in 60 days.** That shows the service model sells. Not focused on home services. |
| [Permit Place](https://permitplace.com/permit-expediting-services/) | Commercial expediting | $4-7k per TI project; runner $450-600 per trip | Commercial / multi-site retail | Commercial only; no tracking product. |
| Green Light Expediting ([BBB/Brownstoner](https://www.brownstoner.com/services/business/d5398a3100910c/green-light-expediting-43-24-21st-street-suite-202-long-island-city-ny-11101)) | NYC DOB filing | Not public | NYC owners and GCs | Local expediter; not relevant beyond NYC. |
| [Shovels](https://www.shovels.ai/pricing) | Permit **data** (contractors, permits, properties) via API, CLI and Sheets | Free (500 credits), **$599/mo** (25k), **$999/mo** (50k) | Lead-gen, data teams | Pricing page mentions no status-change or inspection alerts. Freshness not stated. **Cannot replace daily status scraping** (not verified in API docs). Useful for building lead lists. |
| BuildZoom | Contractor and permit data, referrals | not verified | Homeowners, lenders | Not a status tool. |
| [Apify permit-status actor](https://apify.com/curative_blanket/permit-status-tracker) | Status rows | $0.005 per row | DIY | Austin and SF only. |
| City portals themselves | Some send status emails to the registered contact | Free | – | **Varies by city.** [Tampa's Accela](https://www.tampa.gov/sites/default/files/document/2026/accela-guide-find-permit-status-comments_ada.pdf) emails status updates to permit contacts. Many deployments do not, and nothing combines them across cities. This free option is the strongest "do nothing" competitor. |
| Gov platforms (Accela, Tyler EnerGov/Civic Access, OpenGov, CentralSquare eTRAKiT, Citizenserve) | The portals | Paid by cities ([Citizenserve from $2,400/mo](https://www.softwareadvice.com/permit/citizenserve-permitting-profile/)) | Cities | They serve one city each; no cross-city view for contractors. |

Count with public prices: PermitFlag (live), Plotwise (aggregator), Shovels (live), PermitOps (live, early access), Permit Place (live). That makes 5, so **check 2 passes**. The low anchor is $19/mo for Accela-only DIY.

---

## 4. Technical reality

- **Platform share.** No reliable national figure exists. Accela is cited at 300 to 900+ US agencies ([PermitFlag blog](https://permitflag-web.pages.dev/blog/what-is-accela); profile sites conflict). EnerGov is common in the Southeast, and OpenGov is growing in small cities. **Share of permit volume by platform: not verified.** In the target metro the mix is visible city by city: [Tampa runs Accela](https://www.tampa.gov/sites/default/files/document/2026/accela-guide-find-permit-status-comments_ada.pdf) and [Cape Coral runs EnerGov](https://cms4files.revize.com/capecoralfl/Comms%20&%20Marketing/EnerGov%20CSS%20User%20Manual%20(2).pdf). Lee, Sarasota and Hillsborough counties: not verified.
- **Logins.**
  - Accela: varies. [Alameda](https://www.alamedaca.gov/Departments/Planning-Building-and-Transportation/Permit-Center/How-to-Check-the-Status-of-your-Permit) needs no login for status; [Santa Barbara](https://santabarbaraca.gov/sites/default/files/2025-03/ACAUserGuide-Check%20Status.pdf) needs an account linked to the permit.
  - EnerGov Civic Access: has "search public records without logging in" ([Paducah guide](https://paducahky.gov/files/OSP-Search-Public-Records-without-Login.pdf), [Forsyth County](https://www.forsythco.com/Portals/0/Documents/CSS/CSS%20User%20Guide%20-%20How%20to%20Search%20for%20Information.pdf)).
  - eTRAKiT: public search without login; scheduling needs login ([Coral Springs](https://www.coralsprings.gov/Government/Departments/Building/Online-Permitting-eTrakit/Create-an-Online-Account)).
  - **Read-only status is often public. Inspection booking always needs the client's login.**
- **CAPTCHAs.** None documented for these platforms in this search (not verified either way). Expect some on custom portals.
- **Terms.** No Accela or EnerGov portal terms banning bots were found. Other government sites do ban robots ([Little Rock app terms](https://www.littlerock.gov/city-administration/city-departments/information-technology/cyber-security/citizens-connect-mobile-apps-terms-of-service), [Maryland SDAT](https://sdat.dat.maryland.gov/RealProperty), Houston CSMART per the first pass). Check each city's terms, poll gently (once a day), and get written client authorization for any login.
- **Open data (a real shortcut for big cities).** Checked live on 2026-11-10:
  - [Austin "Issued Construction Permits"](https://data.austintexas.gov/d/3syk-w9eu): has Status Current, Status Date and Expires Date; updated 2026-11-09.
  - [SF "Building Permits"](https://data.sf.gov/d/i98e-djp9): has Current Status and Current Status Date; updated 2026-11-09.
  - [NYC DOB NOW Build filings](https://data.cityofnewyork.us/d/w9ak-ipjd): has Filing Status and inspection requirement fields; updated 2026-11-09.
  - [Seattle Building Permits](https://data.seattle.gov/d/76t5-zqzr): has StatusCurrent; updated 2026-11-10.
  - Chicago and LA permit datasets update daily but expose no status column.
  - **Open data covers status for some big metros, but not corrections detail or inspection results.** Suburban and Florida jurisdictions mostly have no feed (not verified city by city). Accela has a [Construct API](https://developer.accela.com) that agencies must enable (per-agency availability not verified).
- **Is "one scraper per platform" realistic?** Only in part. Accela pages differ by agency setup (modules, field labels, login rules), so it is closer to "one scraper per platform plus a config per city". EnerGov Civic Access is an Angular app backed by JSON calls, so it is probably one adapter with config. OpenGov and Citizenserve: not checked.

**Hours (estimates, not measured):**

| Work | Hours |
|---|---|
| Accela adapter + 5 city configs | 20-30 |
| EnerGov adapter + 3 configs | 15-25 |
| eTRAKiT | 10-20 |
| Each odd or custom portal | 5-15 |
| Sheet/Slack/SMS pipeline, change detection, digest | 10-15 |
| **Total for one metro (about 3 platforms, 8-12 jurisdictions)** | **about 60-100** |
| Maintenance: about 1-2 h/mo per platform plus about 1 h per incident | **about 5-8 h/mo for one metro** |
| Client ops (onboarding new permits, questions) | about 1-2 h per client per month |

Browser Use (an LLM browser agent) is only for one-off odd portals. Daily reads should use deterministic HTTP or Playwright.

---

## 5. Offer design (recommended)

**Who.** Multi-jurisdiction **home-services and remodel firms** (HVAC, roofing, windows/doors, foundation, generators, pools) with **50-300 open permits** across **5-15 jurisdictions** in **one metro**. Start with **Southwest Florida / Tampa Bay**, where hiring is densest and hurricane-driven roof and window permits run high volume. Skip national builders (PermitFlow's turf) and telecom (Pulley and staffing firms).

**Deliverable: "Permit Watch Desk".**
1. A daily read of every open permit. The firm forwards permit numbers or a CSV, or we pull them by contractor license where the portal allows.
2. A shared Google Sheet, or a push into ServiceTitan/JobNimbus later. It shows status, last change, inspection results, days open and expiry date.
3. Same-day Slack, SMS or email alerts on: corrections requested, failed or passed inspection, issued, fee due, and expiry within 14 days.
4. A Monday "aging permits" digest per branch.

**Upsell (human tier).** We book inspections and chase reviewers by phone or email using the client's logins. Corrections stay with the client.

**Price.**
- **Watch:** $8 per active permit per month, **$500/mo minimum**, **$750 setup** (the setup covers mapping their jurisdictions).
- **Watch + Book:** $20 per active permit per month, $1,500 minimum.

Anchors:
- About 1/3 to 1/2 of Plotwise's effective $13-16 per permit, with nothing for the client to do.
- Under 1/5 of a $4-5.5k/mo loaded coordinator.
- Above PermitFlag's $19, which is justified by multi-platform, server-side, team-wide alerts and inspections.
- The pitch: "your coordinator handles 2-3x the permits" (an untested claim; the pilot measures it).

**Margin math (Watch, 100 permits on 3 platforms; loaded rate $50/h):**

| Item | Monthly |
|---|---|
| Revenue | 100 x $8 = **$800** |
| Infra (VPS, proxies, SMS) | about $40 |
| Platform upkeep share (6 h/mo spread over 3 clients = 2 h) | $100 |
| Client ops (1.5 h) | $75 |
| **Gross margin** | (800 - 215) / 800 = **73%** |
| At the $500 floor with 1 client carrying all 6 h upkeep | (500 - 40 - 300 - 75) / 500 = **17%** |

**Margin needs 3+ clients in the same metro** sharing scrapers. With 1 client it fails the 50% bar.

Watch + Book, 100 permits, about 60 inspections/mo at about 10 min each = 10 h: (2,000 - 40 - 100 - 500 - 75) / 2,000 = **64%**.

**30-day pilot (2-3 firms, same metro, $250 flat or free with a written conversion price):**
- **Baseline week:** the client's coordinator logs minutes spent checking portals per day, and we record each permit's status in their own tracker.
- **Measure:**
  1. Coverage: % of their open permits read automatically. Target ≥90%.
  2. Detection lag vs the portal: target under 24 h.
  3. Count of actionable events caught (corrections, failed inspections, expiries), and how many their team had not yet seen.
  4. Coordinator minutes saved per day.
  5. False and missed alerts.
  6. Our own upkeep hours. Kill the plan if over 3 h per platform per month.
  7. **Conversion at $8 per permit.**
- **Pass bar:** 2 of 3 firms agree to pay, at least 1 caught event worth at least a day of schedule, and at least 30 min per day saved.

---

## 6. Lead list sample (companies only)

| # | Company | Location (post) | Industry | Evidence |
|---|---|---|---|---|
| 1 | Groundworks (incl. Mount Valley Foundation Services) | Belmont NC, Richmond VA, Apopka FL + about 10 more | Foundation/waterproofing | [Centralized Permit Coordinator](https://www.linkedin.com/jobs/view/centralized-permit-coordinator-at-groundworks-4472200299) (28 posts in 60 days) |
| 2 | West Shore Home | Tampa FL; Myrtle Beach SC | Bath/window remodel | [Permitting Specialist](https://www.linkedin.com/jobs/view/permitting-specialist-at-west-shore-home-4488434907) |
| 3 | Window Nation (NewSouth Window) | Tampa FL | Windows | [Permit Coordinator - Tampa](https://www.linkedin.com/jobs/view/newsouth-window-permit-coordinator-tampa-at-window-nation-4473285504) |
| 4 | Advanced Hurricane Technology | Fort Myers FL | Impact windows/doors | [Permit Coordinator](https://www.linkedin.com/jobs/view/permit-coordinator-at-advanced-hurricane-technology-4487515402) |
| 5 | Crown Roofing & Waterproofing | Fort Myers FL | Roofing | [Submittal & Permit Manager](https://www.linkedin.com/jobs/view/submittal-permit-manager-at-crown-roofing-waterproofing-4475447811) |
| 6 | Cool Today | Sarasota FL | HVAC/plumbing/electrical | [Permit Coordinator - Sarasota](https://www.linkedin.com/jobs/view/permit-coordinator-sarasota-at-cool-today-cooling-plumbing-electrical-4475996605) |
| 7 | Wrench Group | Sarasota FL | Home services platform | [Permit Coordinator - Sarasota](https://www.linkedin.com/jobs/view/permit-coordinator-sarasota-at-wrench-group-4477183930) |
| 8 | Neal Communities / Waterscapes Pools & Spa | Sarasota and Bradenton FL | Pools / builder | [Permit & Start Coordinator](https://www.linkedin.com/jobs/view/permit-start-coordinator-waterscapes-pools-spa-at-neal-communities-of-southwest-florida-inc-4474419186) |
| 9 | American Residential Services (ARS/Rescue Rooter) | Norcross GA; Lake Como NJ | HVAC/plumbing | [Permit Coordinator / HVAC](https://www.linkedin.com/jobs/view/permit-coordinator-hvac-at-american-residential-services-4488175322) |
| 10 | Generator Supercenter | Pensacola FL, Tomball TX, Nashville TN, Wheeling IL | Standby generators | [Permitting and Scheduling Coordinator](https://www.linkedin.com/jobs/view/permitting-and-scheduling-coordinator-at-generator-supercenter-4463970567) |
| 11 | Baker Brothers Plumbing, Air & Electric | Mesquite TX | HVAC/plumbing | [Permit Coordinator](https://www.linkedin.com/jobs/view/permit-coordinator-at-baker-brothers-plumbing-air-electric-4469913329) |
| 12 | Stanley Martin Homes | Orlando FL; Mount Pleasant SC | Home builder | [Permit Coordinator](https://www.linkedin.com/jobs/view/permit-coordinator-at-stanley-martin-homes-4482521833) |
| 13 | Lennar | Fort Myers FL; Carmel IN | Home builder | [Permit Coordinator](https://www.linkedin.com/jobs/view/permit-coordinator-at-lennar-4471875467) |
| 14 | Century Complete | Panama City FL | Home builder | [Permit Coordinator](https://www.linkedin.com/jobs/view/permit-coordinator-at-century-complete-4470735957) |
| 15 | Qcells North America | Irvine CA | Solar (new homes) | [Permit Specialist, New Homes](https://www.linkedin.com/jobs/view/permit-specialist-new-homes-at-qcells-north-america-4482588983) |
| 16 | Arizona Commercial Signs | Mesa AZ | Signage | [Permit Expeditor / Coordinator](https://www.linkedin.com/jobs/view/permit-expeditor-permit-coordinator-at-arizona-commercial-signs-4477200270) |
| 17 | All Phase Roofing | Lake Park FL | Roofing | [Permit Coordinator (Indeed)](https://www.indeed.com/viewjob?jk=00d8f6a4419c64f8) |

Rows 2-8 form a Gulf Coast pilot cluster.

---

## 7. Verdict: 🟡 RESEARCH SLOT, close to a pick

| Check | Result |
|---|---|
| 1. Buyers asking | ✅ about 86 ICP companies hiring the role in 60 days (LinkedIn + partial Indeed); 985 permit-titled posts overall |
| 2. Competitors with prices | ✅ PermitFlag $19/mo; Plotwise $49-399/mo; Shovels $599-999/mo; PermitOps $199 per watch or $1,495/mo; Permit Place $450+ per runner trip |
| 3. Margin ≥50% | ⚠️ 73% at 100 permits with 3+ clients sharing scrapers in one metro; 17% for a lone client at the floor (hours estimated) |
| 4. Watering holes | ✅ the job-post list above; FL Home Builders Assn, NARI, ACCA/PHCC, PHTA, FRSA (Florida Roofing), r/construction_permit |

**Deciding reason.** Demand for the role is large and verified. But no evidence shows buyers paying for tracking alone above DIY prices ($19 to $16 per permit), and the role is mostly submission and corrections work. One paid pilot at $8 per permit settles it. Move to ✅ if 2 of 3 Gulf Coast firms convert.

**Biggest risk.** **Jurisdiction sprawl.** Each client brings new cities, platform configs and logins, so upkeep hours scale with jurisdictions rather than revenue. Margin holds only if clients cluster in one metro on 2-3 platforms. Close behind it: cities that already email status changes for free (Tampa does), which shrink the perceived value.
