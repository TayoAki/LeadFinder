# FlatDesk UI: round 2 changes

Every defect from `review-round1.json` is listed here with what changed. Automated score after the rebuild: **10/10**. There are now 15 personas and 60 tasks, run on desktop (1440x900) and phone (390x844).

## One story, one data object

All screens are rendered from a single `D` object in `src.html`. Counts, badges, SLA lists, savings, workload, seat use and forecasts are computed from it with the functions `P()`, `billingMonth()`, `viewList()`, `openCount()` and `forecast()`.

- **Story.** Northbrew Coffee kicked off on Mon Oct 26 and went live on FlatDesk on Sun Nov 1 (day 7 of 7). Today is Thu Nov 19, 2026. Zendesk is read-only and can be rolled back to until its cancellation takes effect on Nov 30. Black Friday is Fri Nov 27.
- **Periods.**
  - Reports and AI agent share one period selector: month to date (Nov 1–19) or last 7 days (Nov 13–19). Every KPI label names its period.
  - Billing always uses the billing month (November) and says so.
- **Built from daily arrays.** Period figures come from daily data for Nov 1–19: conversations, AI resolutions, CSAT (AI and human, with n), reopens, first-response time, cancel requests and saves, and SLA met/replied.

## Global defects

| Defect | Change |
|---|---|
| Right bar never changes with the tab | `renderRight()` is contextual. Conversation: customer, order, macros, history, privacy. AI: selected gap, samples, suggested article (or the QA rubric, or stale/translation gaps). Migration: named contact, next 3 actions with owners, rollback, timeline. Reports: period, live-queue filters, SLA-at-risk list with Reassign, definitions, board export. Billing: plan, next invoice, budget vs actual, contact, terms. Admin: security posture, documents, audit log. Sim check: 6 distinct right bars out of 6. |
| Sidebar always shows conversations | `renderSide()` changes per tab. Inbox: views and conversations. AI: gaps, QA review, knowledge. Migration: summary and the 7 dated steps. Reports: overview, SLA & workload, contact reasons, fulfilment. Billing: bill, invoices, plans. Admin: security, users, rules, data, trust. |
| Rail and tabs out of sync; Search/Notifications only toast | `syncRail()` runs on every tab change. Search opens a panel that searches conversations, orders, imported Zendesk history and articles; results open the conversation. Notifications opens a panel listing breached and at-risk tickets (each opens that ticket) plus gap and peak notices. The Escape key, an outside click and ✕ all close both panels. |
| Data inconsistencies | One object, one story and one period selector (see above). The bell badge equals the SLA-at-risk view count. Maya's open count is the same in "Mine", the workload table and the picker. Workload totals match the human CSAT on Overview. Persona tasks check these links (for example, after a reassign the workload row changes). |
| Accessibility | `--faint` is darkened in the app CSS to #555d69. A contrast audit of every visible text node passed on all 19 tab/sub-view screens in light desktop, light phone and dark mode. Dark mode needed overrides for primary buttons, the logo and the badge. Risk always has text and an icon (⚠ Breached / ⏱ Due in). Toggles are outside `role=tablist`. Tabs have `id`/`aria-controls`, panels have `role=tabpanel` + `aria-labelledby`. Every control has a label. Targets are at least 24px (checkboxes are 22px inside labels at least 26px tall). |
| Phone drawers can't close; Customer toggle off-screen | Uses the kit's `.tabbar` with toggles outside the scrolling tabs, `.drawer-close` in both drawers, backdrop, and global Escape. Sim: "drawers open and close" and "toggles on screen" both pass. |
| Phone chrome too tall | The bottom bar on phone is one line (35px): "● Live" plus the role switch. The side toggle reads "☰ Inbox" (or "☰ Sections"). The right toggle is an ⓘ icon with an aria-label. Tabs keep the kit's fade mask. |
| No role-based views | Added `#role` "View as" with Owner, Support ops admin, Lead, Agent, Sales, Finance and IT. Each role hides its restricted tabs and rail buttons, has its own default tab and view, and shows "Signed in as … · Hidden for this role: …". `.tabs[data-visible-tabs]` records which tabs are visible. |
| "AI on" pill ambiguous | Now reads "AI agent answering: email, chat, WhatsApp" and links to the AI agent tab. |
| Bottom bar savings: no period, not marked as an estimate | Now reads "Est. saved vs Zendesk, Nov: ~$2,047–2,929". It links to Billing and is hidden for roles without Billing. |

## agent

| Defect | Change |
|---|---|
| Hardcoded customer stats and history | Stats come from the customer's orders. Daniel: since Feb 2024 · 3 orders · $206. Ben shows "Prospect · no orders" and has no refund or replacement buttons. Previous conversations come from the conversation list plus imported Zendesk history. |
| Daniel's draft promises a replacement nobody made | A policy-check box above the draft shows the result: eligible, but needs approval because $112 is over $100. The draft's action button "Create replacement #4021-R ($112) and send" creates the order and then sends. Every send path runs the action, so a draft that says "I've created" is never sent without it. |
| Handoff rule ≠ guardrail wording | Both use `ruleText()`: "Refunds or replacements over $100 go to a human". The AI tab and Admin › Rules use the same text. |
| Order card lacks tracking and dates | The order card shows ordered, shipped, carrier, a tracking link, delivered or expected date, and any replacement, claim or refund created. |
| Refund/replacement fire instantly | Each opens a confirm form in place. Refund asks for full/partial amount, a reason and a note; Replacement asks for a reason; Claim confirms. The result appears in the thread as an event. |
| Send only toasts | Send adds the message to the thread, clears the draft and sets the status chosen in "After sending set Pending/Resolved". "Send and next" opens the next ticket in the view. |
| "Mine" contains a resolved ticket; 3 vs 14 | Open views exclude resolved conversations. Maya has 3 open everywhere. |
| No wait time or sort; bare "AI" | Every row shows time since the customer's message and is sorted by SLA time left. Status chips have text ("✓ Resolved by AI", "Needs human", "Pending"), plus the assignee. |
| Composer lacks note, attach, regenerate, sources | Added a Reply / Internal note toggle, Attach, Regenerate, Shorten, and a "Sources:" line under the AI label. |
| Macros identical and not clickable | Macros are ranked by the ticket's intent ("for 'cancel sub'"). Clicking one replaces the draft, offers "Restore AI draft", and switches to a plain Send so no action is implied. |

## lead

| Defect | Change |
|---|---|
| SLA counts inconsistent, at-risk undefined | At risk means less than 45 min left or already breached. The rule is stated in the view header and applied to every ticket. View count, bell badge, Reports right-bar list and workload "at risk" column are all computed from it. |
| Reassign has no choice or result | The picker shows each agent's open count and status, with the lowest-load online agent preselected (Priya for Omar's ticket). On confirm the header, the list row and the workload update, and a thread event is added. |
| No assignee shown | The assignee is on every row and in the thread subtitle. |
| Static timers, no breached state or summary | Countdowns update every 30s. "⚠ Breached 4m ago" is shown in red with text. The SLA view header shows today's met % and the number of breaches today. |
| Workload read-only, colour-only risk, no totals or n | "Open queue" opens that agent's view, which has "Reassign all N…". Risk shows as "⚠ N at risk". Added a totals row, and CSAT now shows (n). |
| 14 vs 3 | Reconciled (computed from one list). |
| Bell only toasts | Opens the notifications panel (see global). |
| Right bar irrelevant | The Reports right bar has filters, the SLA-at-risk list with Reassign, definitions and export. |

## head_cx

| Defect | Change |
|---|---|
| Mixed periods | One selector shared by Reports and AI. Every KPI names its period. |
| "Cost per ticket" misleading; estimate shown as fact | Renamed "Software cost per conversation", with "Zendesk estimate $1.17–1.47 · excludes agent time". |
| No trend | Added a daily AI-rate line since go-live, 12-week volume bars with CSAT (Zendesk weeks imported, FlatDesk weeks computed), and a cancel-request trend. |
| CSAT not split | CSAT is split into AI vs Human with n, plus the AI reopen rate within 7 days (Reports and AI tab). |
| "Resolved by AI" undefined | Defined in the Reports right bar: the customer confirmed, or didn't write again within 72h; a reopen within 7 days doesn't count. |
| Savings not on Reports; no board export | Added an "Est. savings vs staying on Zendesk" KPI and "Export board summary (PDF)". |
| Nothing for peak staffing | Added "Agent hours saved by AI", an 8-week forecast with people needed, and a ⚠ flag where the forecast is above current staff (Black Friday week). |
| Right bar irrelevant | Filters, definitions, export. |

## finance

| Defect | Change |
|---|---|
| What happens above 3,000 | "Above 3,000 we never charge per resolution and the AI keeps answering; if you're above it 3 months in a row we'll talk about Flat 25. Nothing changes without your OK." Also a month-end forecast (~2,785). |
| Contradictory Zendesk rate wording | The same hedged wording is used everywhere: "~$1.50–2.00 per resolution, third-party estimates; Zendesk doesn't publish a single per-resolution rate", always shown as a range. |
| Overstated comparison title; fake upload | Retitled "Estimated Zendesk cost for the same volume". Added "inputs from your contract: none yet", a real file input "Upload a Zendesk invoice to replace the estimate", and the assumption that Zendesk's AI would resolve the same conversations. |
| No invoices, payment, terms or tax | Added an invoices table with PDF links and the next scheduled charge, the payment method, the tax line, "Month to month… 30 days' notice… price locked until Oct 31, 2027", and export availability after cancelling. |
| Overlap cost hidden | Added a "Transition month" table: FlatDesk $599 + Zendesk seats $805 until Nov 30 = $1,404, then $599/month, with a recommendation on the cancellation date. November savings are calculated after the overlap. |
| No plan ladder or projection | Added a plan ladder (Flat 10/25/50 with seats, AI fair use and price) and a 12-month projection with three scenarios. |
| Right bar irrelevant | Plan, next invoice, budget vs actual YTD, billing contact, terms. |

## founder

| Defect | Change |
|---|---|
| Contradictory story | Chose post-go-live. Migration shows complete with dates, and all channels have been live since Nov 1. |
| No reference dates | Shows kickoff Mon Oct 26, live Sun Nov 1 (06:00 ET), today Thu Nov 19, and a date on every step. |
| 86% without basis | Replaced with "Steps 7 of 7 done". |
| No proof, rollback or contact | Added "Spot-check 10 random old tickets" (10 of 10 match: messages and attachments). The rollback plan is in the right bar. Named contact: Elena G., with a Message button. |
| Peak risk ignored | Added a peak-readiness checklist (Black Friday in 8 days, freeze Nov 25–Dec 1). The open item links to Admin and turns ✓ when the Overflow group exists. |
| No revenue link | Added "Revenue in open conversations" and "Orders saved by replacements" to Reports. |
| "Send to IT" unclear | The DNS step shows recipient it@northbrew.example, who sent it and when, when Raj M. finished it, a preview of the 3 records, and a re-send button. |
| Right bar irrelevant | Contact, next 3 actions with owners, rollback, timeline. |

## it_admin

| Defect | Change |
|---|---|
| No users/roles; agent sees Billing/Admin | Added Users & roles (role, seat, SCIM) and a description of what each role sees. The role switch hides Billing and Admin for agents. |
| No compliance evidence | Added Trust & compliance: DPA, SOC 2 Type I (Type II in progress), CAIQ, subprocessors with a 30-day notice, retention. The audit log is in the right bar. |
| No AI data handling | Added an "AI data processing" card: Claude via AWS Bedrock in the same region, not used for training, 90-day logs, PII redaction toggle. |
| Region US only, no backups | US current, EU available with a "Request move to EU" button. Backups: nightly + PITR, RPO 5 min, RTO 4h. |
| SSO ambiguous | "Password login disabled; SSO enforced for all N users". IdP options listed (Okta, Entra ID, OneLogin, SAML 2.0), SCIM on. |
| Export lacks scope, schedule and API | Added scope checkboxes, a weekly S3 schedule with last run, Export now, and API docs. |
| Rail naming and icons | The gear is labelled "Admin" and Reports uses a chart icon. |
| Right bar irrelevant | Security posture, documents, audit log. |

## ops_whatsapp

| Defect | Change |
|---|---|
| No translation | "Show translation" under each foreign-language message and the draft, with a "Spanish (detected)" / "French (detected)" chip. |
| WhatsApp specifics missing | The header shows "24h window: Xh left" or "closed: templates only". A closed window switches the composer to an approved-template picker. The business number is shown in the WhatsApp view. Agent messages show read receipts (✓✓ Read) and sends show "✓ Delivered". |
| Channel status inconsistent | WhatsApp switched over Oct 31, before go-live, so the live inbox is consistent. |
| Draft claims a UPS claim that doesn't exist | The draft's button "Open UPS claim and send" opens UPS-CLM-88213, which then appears on the order card and as a thread event. |
| Phone drawer can't close | Kit round-2 drawer, close button, backdrop and Escape. |
| No unread or missed counts per channel | Each channel view option shows "(N · X unread · Y waiting >1h)". The selected channel view repeats the counts as chips. |
| Customer card lacks language/phone | The customer card shows a language chip and channel identifiers (WhatsApp number, Instagram handle, email, company). |

## knowledge

| Defect | Change |
|---|---|
| Can't see underlying conversations | "Show conversations" puts the gap in the right bar with 3 samples, notes on what the AI did, the handoff reason and a link to any open conversation. |
| "Draft article" only toasts | Opens an editor in place with "Publish to help centre and AI" or "Save as draft for review". The status column shows "Draft in review" or "✓ Published · AI uses it now". |
| No deflection metrics | Added a Knowledge & deflection sub-view: self-serve rate, articles the AI used most, and a before → after gap count for an article published Nov 6. |
| Partial list, mixed periods | "5 of 18 gaps · sorted by asks", using the shared period (17 gaps in the last 7 days). |
| Mixed action column | Added a "Suggested action" column. Wholesale reads "Route to Sales (B2B lead, not an article)", and the reason column explains why. |
| No stale or translation flags | Right bar: 9 stale articles, and missing Spanish (38) and French (51) versions. |
| Right bar irrelevant | Selected gap details. |

## Missing personas (all 7 added to personas.json, with tasks)

| Persona | What the UI now offers | Tasks prove |
|---|---|---|
| support_ops_admin | Admin › Rules shows the Zendesk → FlatDesk trigger map (Mapped / Mapped with changes / Needs review) and the SLA policies. The guardrail limit can be edited, tested on sample ticket #4021 and saved. | After a test at $150 the result is "AI can handle". Saving adds "$100 → $150" to the audit log, and the AI tab then shows "over $150". |
| qa_coach | AI agent › Review AI replies: 5 AI-resolved samples, a scorecard rubric, Good / Needs fix, and a correction that feeds AI knowledge. | The counter goes from 0 to 5 of 5. The flagged reply becomes "correction sent". The sidebar and Knowledge show the count of reviewed corrections. |
| privacy_legal | Trust & compliance, plus "Export or delete this customer's data…" on the customer card, with a confirm step and an audit-log entry. | The deletion result names Daniel Kim (the selected customer) and appears in the Admin audit log. |
| wholesale_sales | Sales role: a Sales inbox with Ben's routed inquiry, a routing reason, the price list attached, and CRM sync on send. | The sales role sees only Conversation. The routed reason and attachment show, and the sent message is followed by "Lead synced to CRM". |
| retention_marketing | Reports › Contact reasons: per-period reasons, cancels saved by a pause offer with MRR kept, and a weekly trend. | Switching to the last 7 days updates both cards. |
| fulfillment_ops | Reports › Fulfilment issues: by SKU, carrier and type for the period, a table of issues, and Open links to conversations. | 8 issues in Nov 13–19. Opening one shows Omar's order with HOUSE-1KG. |
| bpo_manager | Admin › Users: seats 7/10, groups, and "Add outsourced agents…" (Overflow group: email only, 18:00–08:00, seat impact shown). | After creation the seats show 10/10, the group and the audit entry appear, and the Migration peak checklist item turns done. |

## Persona tasks tightened

The existing personas keep their fields. Their tasks now check that context follows what was selected:

- The right bar shows *that* customer and order.
- A role switch hides tabs.
- A reassign changes the header, the row and the workload.
- A period switch changes Reports and the AI tab.
- A send updates the thread, the status and the order card.

## Kit issues found (not edited; worked around in the app)

1. `shell.js` `selectTab()` sets `document.body.dataset.tab`. After that, every click matches `e.target.closest('[data-tab]')` on `<body>` and calls `selectTab(current)` → `onTab()` again. If `onTab` re-renders the sidebar, the clicked `.side .item` is detached before the kit looks it up, so `onSelect` never fires. Workaround: `onTab` returns early when the tab hasn't changed, and a `go()` helper forces a re-render. Suggested kit fix: use `body.dataset.activeTab` (or exclude `body` from the `[data-tab]` match).
2. Dark mode: white text on `--accent` #7c9bff (`.btn.primary`, `.rail .logo`) is 2.6:1, and on `--bad` #ff7a7f (`.rail .badge`) is 2.5:1. Overridden in the app with dark text. Suggested kit fix: a `--on-accent` token.
3. `--faint` #6b7280 is 4.25:1 on `--panel-2` and about 4.1:1 on `--accent-weak` (selected sidebar item meta). Overridden in the app to #555d69. Suggested kit fix: the same darker value.
