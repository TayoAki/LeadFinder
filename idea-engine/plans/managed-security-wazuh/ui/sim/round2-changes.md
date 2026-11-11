# Watchpost UI round 2: how each review defect was fixed

Source: `ui/sim/review-round1.json` (score 3/10). The page was rebuilt in `ui/src.html`. Every screen now renders from one `ORGS` object keyed by client, plus pricing constants, a framework catalog and a role table. All counts are computed by `D(clientId)`, `controls()` and `questions()`, so nothing is typed twice.

Automated walkthrough after the changes: **10/10**. That covers 13 personas, 54 task runs across desktop and phone, and every global check. I also ran my own checks for overflow, 24px targets, labels and AA contrast in light and dark mode, for every role and tab. They found nothing.

## Global defects

| Defect | Change |
|---|---|
| Right bar identical on every tab and client | `renderRight()` builds the bar per tab and per client. Overview: analyst now and next shift, the next-actions list, a 30-day chart and who gets alerts. Incidents: on-duty analysts, the selected incident and the response promise. Devices: agent install commands and reasons devices go silent. Accounts: offboarding checklist. Compliance: audit dates, BAA status, auditor and a read-only share link. Insurance: renewal checklist, timeline and broker. Billing: plan fit. Partner: partner billing, white-label settings, channel protection and integrations. Queue: shifts and integrations. The sim shows 7 distinct right bars for 7 tabs. |
| Only Overview was data-driven | Every panel, the sidebar, the context strip, the bottom bar, rail badges and pop-up panels render from `ORGS[S.org]`. `onSelect` re-renders all of them. |
| MSP console and business view merged | A "View as" switch (`#role`) offers 10 roles. Business views (owner, office, IT, employee) are locked to BrightSmile. They have no client list, no Partner tab, no margins and no wholesale price. MSP views (technician, account manager, owner) get the client list, the all-client queue, and (account manager and owner) the Partner tab. Shared read-only links (auditor, broker, counsel) are scoped to one client and limited tabs. Tabs are rebuilt per role, not hidden. |
| Numbers did not reconcile | Derived in code. Devices reporting = sum of location counts minus offline devices. Threats = incidents flagged as threats (the benign one is shown as "+1 alert checked and found safe"). Client OK and attention counts come from computed urgent actions. Badges = urgent actions (business) or open incidents (MSP). Questionnaire readiness = "yes" answers out of the 10 shown. "1 critical update on 2 machines" replaces "2 patches". Pricing is computed from tiers. |
| Phone drawers had no scrim, close or Escape | Uses kit round-2 `.tabbar`, `.drawer-close` in both drawers, the backdrop and Escape. I added a Tab-key focus trap. The role switch closes drawers on phone. The bottom bar is one line (30px). The active tab scrolls into view, and the kit's edge fade hints at more tabs. |
| Accessibility gaps | Tabs have `aria-controls`. Panels are `role=tabpanel` with `aria-labelledby`. Incident rows and control rows are buttons with `aria-expanded` and `aria-controls`. An `aria-live` region announces client, role and detail changes. Severity and status always carry text and a shape (▲ High, ◆ Medium, ● Low, ℹ Info, ✓ Met, ! Partly met, ✕ Gap). `--faint` is darkened to #5d6470 (AA on panel-2). Every select and input is labelled. Targets are at least 24px. Dark-mode logo and badge contrast are fixed. |
| Rail items mislabelled or dead | Home goes to the role's first tab. Search opens a real search panel (devices, accounts, incidents, log lines; the MSP can search all clients; quick chips). Notifications open a real panel (items needing action, recent incidents, escalation order). Compliance has its own document icon. Partner has its own icon. Billing has a card icon. Settings opens a settings panel (alert contacts, escalation order, channels, PSA/RMM integrations). |
| No notification or contact management | The Settings panel lists contacts per client with escalation order and channel checkboxes. The right bar shows "Alerts go to … · Change who gets alerts". |
| No chart (wireframe media block) | A 30-day SVG chart in the Overview right bar shows alerts reviewed against escalations. The totals are computed so they match the incident count. Each client in the MSP margin table has a 30-day health sparkline. |

## owner (Executive)

| Defect | Change |
|---|---|
| Lands on MSP console, sees other clients and margins | Defaults to "Business owner (BrightSmile)". The sidebar shows their locations and Watchpost team, with no client list. No Partner tab. Persona expectations check `.tabs:not(:has([data-tab='partner']))` and `.app:not(:has([data-select='harbor']))`. |
| "Nothing needs your attention" while there are open actions | The hero is derived. With urgent actions it reads "Protected · 3 things need your team" and lists them, with a "Show me what to do" link. With only paperwork left it reads "Protected · nothing urgent". It says "nothing needs your attention" only when the action list is empty. |
| KPI jargon | Labels are now "Threats stopped", "Computers protected 60 of 64", "Security updates still needed", "How fast we stopped threats … we promise 30 min". Technical terms are in `abbr` tooltips. |
| Threat count did not reconcile | 2 threats, matching the 2 threat bullets in the summary and the 2 threat incidents. The benign admin-account check is shown separately. |
| No link to insurance or HIPAA outcomes | An outcome row of three cards: insurance renewal with answers ready and days left, HIPAA controls met, and computers reporting. Each links to its tab. |
| Duplicate, undated report buttons | One CTA card: "Download October 2026 report (PDF)". The summary is labelled "Last 30 days (Oct 12 – Nov 11, 2026)". |
| Emoji shield did not change with state | The SVG shield switches between a check and an exclamation, and the text label stays. |

## office_mgr (Operations)

| Defect | Change |
|---|---|
| The incident she needed was not opened by default; detail far away | Incidents are sorted with "Action needed" first and the first one auto-expanded. Detail is an inline accordion under the clicked row (`aria-expanded`) and scrolls to the top of the row on phone. |
| Contradictory wording on the reset | One story everywhere: "We blocked every attempt and reset the password". Her task is "Give the new reception@ password to the front-desk team (2 minutes)". The incident, Overview summary, right bar and notifications all use the same text. |
| No mark-done, ask-analyst or 24/7 cover | "Mark done" updates the incident, badge, hero, notifications and next actions. "Ask an analyst about this" is added. The right bar shows "Now: Rosa K. 10–18", "Next: Sam T. 18–02", the overnight desk and the 24/7 hotline. |
| Tip sheet had no link | "Download the tip sheet (PDF)" sits inside the box. |
| Severity by colour only; cryptic mailbox name | Text severity badges. The full address reception@brightsmiledental.com is shown. |
| Phone title cut off; hidden tabs | `scrollIntoView({block:'start'})` on the expanded row. The active tab is centred, and the kit's fade signals more tabs. |

## it_mgr (IT)

| Defect | Change |
|---|---|
| Devices hard-coded to BrightSmile; Harbor said "4 not reporting" | Devices render from the selected client and the not-reporting count is computed. Harbor shows 3, Sunrise 3, BrightSmile 4. |
| 3 rows, no filters or export | Location and status filters, "Showing N of 64 · the other N are protected", CSV export, and risk shown with icon and text. The sidebar location items also filter Devices. |
| Not sorted by impact; no reason | Silent devices are sorted by business impact, so NAS-BACKUP (tagged "Backup server: ransomware risk") comes first. Each shows the likely reason and last user / IP. |
| "Send reinstall link to IT" shown to IT | IT and MSP roles get "Copy agent install command" and "Deploy via Intune / GPO" (MSP: RMM). Only non-IT roles see "Send reinstall link to IT". The right bar has Windows, macOS and Linux install commands. |
| "Schedule patch tonight" implied Watchpost patches | Now "Create ticket for IT" (MSP: "Push to RMM"), with "Watchpost finds missing updates and confirms the fix; it does not reboot your servers". |
| Patch counted wrong; wrong KB | "1 critical update missing on 2 machines" with a "KB50xxxxx placeholder" Server 2022 update. |
| Alert fatigue not addressed | An "Alert noise" card on Incidents ("1,240 alerts reviewed → 3 escalated (2 real threats, 1 confirmed safe)"), plus "Tune this rule" on the confirmed-OK incident for IT and MSP roles. |
| Search was only a toast | A real search panel with result types, highlighting and quick chips. |

## msp_tech (MSP)

| Defect | Change |
|---|---|
| Switching client changed only 4 numbers | Every tab, the right bar, the bottom bar ("Harbor Auto: 85 of 88 devices reporting"), the rail badge, notifications, search scope and the context strip ("Client: Harbor Auto Group · FTC Safeguards + PCI DSS · 88 devices") follow the selection. Persona tasks check the Devices and Compliance content after selecting Harbor. |
| 5 of 25 shown, "+20" dead, counts wrong | The full client list (6 MSP clients) with a search box and an All / Needs attention filter. Counts are computed: "4 OK · 2 need attention · 2 open incidents". |
| No cross-client view | The "All clients" sidebar entry opens the All-client queue tab. It has an incident queue (client, severity, status, PSA ticket, Open button) and a cross-client not-reporting list. "Open" jumps to that client's incident, already expanded. |
| No PSA/RMM tie-in | PSA ticket numbers appear on every incident and in the queue, with a "Push update to PSA" button. Settings lists ConnectWise PSA and NinjaOne RMM. |
| Phone drawer had no scrim or close | Kit round-2 backdrop, close button and Escape, plus my focus trap. The drawer closes after a pick. |
| No shift handover | Now and next analyst, the overnight desk and a 24/7 hotline in the right bar, sidebar and bottom bar. |

## msp_owner (MSP leadership)

| Defect | Change |
|---|---|
| Totals only | A per-client margin table: devices, direct price for reference, wholesale, your price, profit, margin %, a 30-day health sparkline and a QBR button, with a totals row. |
| Conflicting pricing models | One pricing model in code. Direct tiers by device count: Starter ≤25 $349, Small office ≤50 $599, Practice ≤100 $999, Multi-site ≤200 $1,799. Over 200 is $1,799 + $8 per extra device, so Vega at 210 devices = $1,879. MSP wholesale is $6 per device. Resale = min(rate × devices, direct price), flagged "capped at direct". Business views only see their own direct plan. MSP views never show it outside the reference column. Channel protection is stated. |
| Margin % and $ under one label | Split into "Gross profit / month" with "Margin %", plus "Annual recurring profit". |
| White-label was a static pill | Brand name, logo (replace), portal domain with "DNS verified", alert sender with SPF/DKIM, and a brand-colour select. "Preview as client" renders the client's overview with the MSP brand and no Watchpost name. The MSP brand colour also drives the rail logo and context chips in MSP views. |
| Settings icon opened Partner | Partner has its own icon. Settings opens the settings panel. |
| Nothing on retention | QBR generator (branded preview, PDF and slides), health sparklines and per-client attention status. |

## compliance

| Defect | Change |
|---|---|
| Dropdown did not swap controls | `FW` catalog with real citations per framework. HIPAA: 13 controls (§164.308 to §164.316). FTC Safeguards: 11 (314.4(a) to (j)). CMMC L1: 15 (AC.L1-b.1.i to SI.L1-b.1.xv). PCI DSS v4.0: 11 (Req. 1.2 to 12.10.1). NCUA/GLBA: 8. The list, score and bar change with the framework. |
| Only 5 of 20 listed | All controls are listed. Each expands to show the evidence source, the collected date-time, owner, and a "Download evidence" button. |
| "Logs kept 1 year" marked Met for HIPAA | §164.316(b)(2)(i) "Documentation kept 6 years" shows Partly met until "Turn on 6-year archive" is clicked. The right bar shows retention per framework. PCI 10.5.1 is Met at 12 months. |
| No BAA status | A BAA card at the top of the HIPAA view ("Signed Mar 2, 2026 · Download BAA"), a BAA control row, and BAA status in the right bar. Lakeside Pediatrics shows "Not signed yet". |
| Framework list ignored the org | NCUA/GLBA added. The default is the client's first in-scope framework. The dropdown groups "In scope for X" and "Other frameworks (mapping only)", with a note when viewing an out-of-scope one. |
| Export was only a toast | The export panel has framework, period and format, "Create export", and export history ("Last exported Oct 2"). The right bar has "Share read-only link with auditor (expires Dec 11)". |
| Training upload missing in both tabs | One "Upload training certificates" action (in Compliance and Insurance). It updates the HIPAA control, the insurance answer, readiness and next actions together. |

## finance

| Defect | Change |
|---|---|
| "9 of 10" with 4 shown | All 10 questions are shown ("All 10 questions shown"). Readiness is computed from them: 6 of 10 now, 7 of 10 after the training upload. |
| MFA gap shown green | "! Partly: 39 of 41 users; 2 without MFA (billing@, m.reyes@)" in amber. Users and devices are counted separately throughout. |
| Placeholder carrier | Carrier, policy number, limit, premium, and broker name, firm and email. "Email pack to broker", "Download evidence pack" and "Download signed attestation". |
| No cost view | A Plan & billing tab for the owner role: plan, device count against the cap, next invoice, price locked until date, the direct price list, and invoices. The bottom bar shows the plan for the owner. |
| No business-case numbers | "Controls that usually lower premiums" and a breach-cost note citing the IBM Cost of a Data Breach Report 2024. |
| Right bar irrelevant on Insurance | The Insurance right bar shows the renewal checklist (derived from answers), a timeline and the broker. |

## Missing personas (all 6 added to personas.json with tasks)

| Persona | How the UI serves it |
|---|---|
| msp_account_mgr | "MSP account manager" role. Partner, then "Generate QBR for <selected client>", gives a branded QBR preview (threats stopped, coverage, compliance score, recommendations) with PDF and slides. |
| practice_manager_regulated | Accounts tab with "Unused 30+ days" and "No MFA" filters. "Request disable" leads to "Disable requested · IT notified", and the to-do and compliance counts update. |
| external_auditor | "Auditor (read-only, Ridgeline)" role on a time-limited link. Framework items in the sidebar. Expanding a control shows "Collected Nov 11, 2026 06:00 ET" and a download that records SHA-256. No write actions. |
| insurance_broker | "Insurance broker (BrightSmile pack)" role. Read-only insurance pack with dated evidence per answer and a signed attestation download. No "Email pack to broker" button. |
| general_counsel | "Privacy counsel" role. Every incident has a Breach assessment ("Patient data accessed: No …", "Notification clock: Not started … HIPAA 60 days") and an ET timeline. FTC 30-day, NCUA 72-hour and DFARS 72-hour notes appear where relevant. |
| security_champion_employee | "Employee" role with a single "Report an email" tab (phone-friendly form, "what did you do?"). The analyst verdict adapts to what they did (password reset if they clicked) and stresses that they won't be blamed. Their view has no security dashboards. |

## Persona tasks

All 13 personas have tasks whose first step selects their role, and whose expectations prove context binding. Examples:
- Harbor's devices appear after selecting Harbor, and NAS-BACKUP does not.
- The owner view has no Partner tab or client list.
- PCI controls replace the §164 citations.
- Marking done changes the badge from 3 to 2.
- A queue "Open" lands on Sunrise's incident.
- The auditor link has no write buttons.

Tasks are written to be order-independent, because the walkthrough reuses one page per persona.

## Shared-kit issues found (not edited, per instructions)

1. In `shell.js`, the click handler runs `e.target.closest('[data-tab]')`, which matches `<body data-tab="…">` because the shell sets `document.body.dataset.tab`. So every click anywhere calls `selectTab(currentTab)` and fires `onTab`. If `onTab` re-renders the rail or sidebar, the clicked element is detached before the rail and sidebar branches run, and `onRail` and `onSelect` silently don't fire. I worked around it with an `onTab` that ignores same-tab calls and defers rail and sidebar re-renders. Suggested kit fix: use `closest('[role="tab"][data-tab]')`, or store the tab as `body.dataset.currentTab`.
2. `.sr` has no `left`/`top`, so a visually hidden span inside a horizontally scrolling table escapes the scroller and causes page-level horizontal scroll on phone. I worked around it with `.sr{left:0;top:0}` and `.tw{position:relative}`. Suggest adding `left:0;top:0` (or `margin:-1px`) to the kit's `.sr`.
3. The simulator runs a persona's tasks in one page without resetting state. Task authors should know this, or the kit could reload between tasks.
