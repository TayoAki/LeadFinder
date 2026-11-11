# Briefcase UI: round 2 changes

Mapping of every defect in `review-round1.json` to what changed. `src.html` was rewritten: all screens now render from one mock-data object `M` keyed by matter (plus `DL` deadlines, `INTAKE`, `TIME`, `TPL`, `P` people), and every number shown is computed in code. Weekdays are never typed by hand; `fmtD()` computes them from ISO dates. Today is Wed, Nov 11, 2026.

## Layout and kit (global)

| Defect | Change |
|---|---|
| Right side bar never changes; shows Reyes on every tab | `rightFor(tab)` builds context per screen: Ask = selected source with Bates, DMS no., page preview + thread sources + matter card + access; Draft = template version + fields filled with their sources + client language/channel; Review = playbook + clause quote with preferred/fallback/walk-away/approver; Timeline = source document + sources in timeline order; Search = scope; Deadlines = deadline source page + calendar sync; Intake = conflict search detail, call notes, checklist; Time = timekeeper summary; Knowledge = template usage; Firm = period, policy status, open risks, exports; Admin = instance health. |
| Selecting another matter only changes the title | `onSelect` rebinds answer, sources, timeline, draft, review, right bar and matter card. Hidden panels are cleared so no stale matter content stays in the DOM. Empty states for matters without data (no contract in Reyes; empty thread). |
| Privacy contradiction | One `DATAFLOW` sentence used on Ask, Firm, Admin and (short form) bottom bar: documents stay in the instance; only the question and relevant excerpts go to Claude Sonnet 4.5 (Anthropic) via Amazon Bedrock in AWS us-east-1 under zero data retention, never used for training. Admin explains the flow in 4 steps and offers an in-instance open-weight model with trade-offs. |
| 8 tabs; Sources toggle pushed off screen on phone | Tab row is 4 matter tools (Ask, Draft, Review, Timeline) inside `.tabbar`; toggles sit outside `.tabs`. Search, Deadlines, Intake, Time, Knowledge, Firm insights and Admin moved to the rail (`data-tab-target`). |
| No visible role/firm; associate sees Firm/Admin | Side bar top shows firm, user and role. "View as" select (15 roles) in the bottom bar drives permissions; restricted rail items show a lock and an aria-label "(no access for your role)"; opening them shows a "not available" card naming who can. |
| Settings icon looks like a sun; Search only toasts; bell goes to one matter's timeline | Standard gear icon. Search opens a results panel (query, scope select, results with Bates/DMS, ethical-wall and AI-restricted counts). Bell opens a cross-matter Deadlines panel; badge = deadlines listed under "This week" (computed). |
| Numbers do not reconcile | 214 active / 4,812 total matters; firm documents = sum of integration counts (410,000); matter doc counts = sum of indexed folders; hours saved = sum of per-person rows (146 h / 30 days = 34.1 h/week); "You: ≈3.7 h per week (30-day avg)" from the same row. Seats 20 = people listed; 18 active computed. |
| Dates lack years; Fri Nov 14 wrong | All dates show weekday + full date via code; the expert disclosure deadline is Fri, Nov 13, 2026. |
| Accessibility | `.cite` is a 24px-minimum button with an aria-label naming the source; SVG lock icon (aria-hidden) replaces emoji; colours checked for AA (accent #5534d6 = 7.4:1 on white, 6.3:1 on its tint; muted #5d6470 ≥ 5:1; dark-mode primary buttons use dark text); every status has text (High risk, Verified, Needs verification, Approved...); actions change persistent state (rows, banners, buttons), toasts are extra. All controls labelled. |
| Phone: bottom bar wraps; drawer has no close | Bottom bar on phone = "View as" + "Private instance · healthy" on one line. Both drawers have a ✕ close button; Escape and the backdrop close them (kit). Tables become cards on phone. |
| No human review on AI output | Drafts: "Needs attorney review" → "Sent to X for review" → "Approved by X"; translation has its own "not yet reviewed" → "reviewed" gate; sending is disabled until approved; exports before approval are marked DRAFT and counted in Firm insights. Conflicts: "No direct matches found — attorney must clear" + Clear / Request clearance. SOL: state, rule, "attorney must verify". Deadlines: rule, source page, "Needs verification" → "Verified by" → "Posted". Time: approve/reject/undo per row. Supervision queue in Firm insights. |
| No empty, loading or error states | Empty: "Not found in this matter's 1,284 documents", empty thread, "No agreement in this matter". Loading: Acme MSA indexing 2 of 3 files with progress bar. Error: Outlook sync errors, iManage not connected (Connect). Blocked: Meridian Bank matter with AI off by client OCG. |
| Kit: right bar / drawer-close / toggles | Adopted `.tabbar`, `.drawer-close`, `onTab/onSelect/onRole/onReady`, `.sr`, `#role.role-switch`. |

## Per persona

### partner
| Defect | Change |
|---|---|
| 146 vs 11.5 hours contradiction | "Firm hours saved, last 30 days: 146 h, ≈ 34.1 h per week"; bottom bar is labelled "You: ≈ h saved per week (30-day avg)". |
| No money view | KPI row: timekeeper hours × blended $310/h ($32,550, labelled capacity not revenue), flat-fee margin ($9,610), subscription ($1,780/mo, $12.19 per hour saved), net return 5.4×, realization 91% vs 88%; hours saved by practice chart. |
| No "who uses it" | Usage by person table (sessions, questions, drafts, hours saved, last active, status) with "Send invite" for the 2 not onboarded. |
| "2 not yet onboarded" in green | Shown as warn pill "Not onboarded"; listed as open risk. |
| Shadow AI not addressed | Firm AI policy card: version, accepted 17 of 18 (pending named), public AI blocked with IT web-filter signal, download/remind. |
| Unclear ABA 512 sentence | Card lists the 5 duties with status, "Client disclosure language (Download)" and "ABA 512 checklist (PDF)" buttons. |
| Audit log too thin | 10 rows, filter by matter/action, Export CSV/PDF, View full log. |
| Ethics risk invisible | Answers blocked (no source): 27; drafts exported without sign-off (live count); supervision queue with Mark reviewed. |
| Right bar shows Reyes | Firm right bar: period, policy status, open risks, exports. |

### associate
| Defect | Change |
|---|---|
| Herrera selection leaves Reyes Q&A | Each matter has its own threads; switching shows that matter's answer and sources (persona task checks Estate of D. Liu). |
| Matter card fixed to Reyes | `matterCard(id)` bound to selected matter. |
| Citation chips too small | 24px minimum. |
| One answer only; no not-found / conflict | Thread list per matter; second turn shows "Conflicting evidence" (ECM 63 mph vs police report 55); third turn "Not found in this matter's N documents" with closest document. |
| No page preview | Right bar shows a page preview with the passage highlighted; on phone an inline peek appears under the answer. |
| No Bates numbers | Each source shows Bates/ref, DMS number and production volume. |
| Composer without Send/scope | Send button, Enter hint, scope chip "Searching: this matter, 1,284 docs" that opens the folder/production scope. |
| Copy format unclear | Select: plain / Bates cites / Bluebook-style record cites + Copy. |

### paralegal
| Defect | Change |
|---|---|
| Fri Nov 14 | Fri, Nov 13, 2026 (computed weekday). |
| Badge 2 vs 1 deadline | Badge computed from "This week" list (2: Thu Nov 12 Calder, Fri Nov 13 Reyes). |
| Deadline lacks rule/verifier | Shows rule, source page, responsible, reminders (7/3/1 days, computed), "Verified by P. Nair" or "Needs verification". |
| Thin chronology | Filters (All/Documents/Testimony/Filings), Add event form, Export Word/Excel with status, "7 key events shown of 37 extracted from 1,284 documents". |
| No matter name in heading | "Timeline · <matter>" and rebuilt on switch. |
| Right bar not tied to event | Clicking an event selects its source in the right bar; sources listed in timeline order. |
| No SOL / key dates | Key dates: SOL (NJ, N.J.S.A. 2A:14-2, Wed, Mar 24, 2027, verified), close of fact discovery, trial. |

### intake
| Defect | Change |
|---|---|
| SOL without jurisdiction/rule | Incident date, state (assumed, confirm), rule, run-out date, "AI-calculated: attorney must verify" + Verify date (attorneys). |
| Definitive "Clear" | Lists every name searched, near matches (Swift Parcel Inc., adverse 2021; Ortiz Landscaping), "No direct matches found — attorney must clear", Request clearance / Clear conflict (attorney roles). |
| Summary missing fields | Contact, referral, call date/time, insurers, injuries/treatment, lost wages, fit for firm with reasons. |
| Book consult vague | Slots with attorney names; confirmation names the attorney. |
| No decline / Clio path | "Decline (send non-engagement letter)" and "Open matter in Clio" (enabled after clearance). |
| Right bar shows Reyes | Conflict search detail, call notes source, intake checklist. |
| One caller | Intake queue (3 callers) in the side bar on Intake. |

### billing
| Defect | Change |
|---|---|
| Billing AI work as lawyer time | Hours = measured active lawyer time ("Measured 1.4 h active (09:58–11:22) · AI processing 3 min excluded"); banner "Bill actual time only (ABA Formal Op. 512)"; flat-fee rows bill $0 extra. |
| No timekeeper | Date + timekeeper column. |
| No UTBMS/rate/amount | UTBMS task/activity codes, rate, amount (computed). |
| Approve only toasts | Row turns "✓ Approved · sent to Clio 11:04" with Undo; totals update. |
| No edit/approve all/reject/approver | Edit (hours + narrative), Save, Reject, Approve all, approver per row. |
| No client-matter number | Client-matter number per row. |
| No realization/captured KPI | Strip: suggested, approved x of y, rejected, captured this week vs last; realization on Firm insights. |
| Phone table squeezed | Rows render as cards on phone. |

### it_ops
| Defect | Change |
|---|---|
| "Never leaves" vs model API | Precise data-flow statement everywhere. |
| Model/vendor/region not named | Claude Sonnet 4.5 (Anthropic) via Amazon Bedrock, AWS us-east-1, zero retention, no training, change log. |
| No security evidence | Trust documents: SOC 2 Type II, ISO 27001, pen test, DPA, subprocessor list; BYOK keys, backups, deletion on exit. |
| Integration pills unclear | Table: status with text, last sync, docs indexed, notes/errors; iManage "Not connected" + Connect. |
| Permissions source unclear | "Document permissions from NetDocuments ACLs; ethical walls from Clio; both must allow." |
| No user/role management | Users and roles table with SSO group, last sign-in, MFA. |
| Associate sees Admin | Role-gated; associate sees "Admin is not available". |
| Sun icon | Gear icon. |
| Right bar shows Reyes | Instance health (version, uptime, backup, queue, tickets, sync errors). |

### solo_immigration
| Defect | Change |
|---|---|
| False "reviewed" attestation | Spanish shows "not yet reviewed"; the reviewed line is added only after "Mark translation reviewed". |
| No side-by-side | EN and ES side by side (stacked on phone); agency/form names kept in English are highlighted. |
| Facts not cited | Receipt number/date cite the I-797C; processing time cites the USCIS page. |
| Stale processing time | Expected decision computed: Thu, Nov 12, 2026; "we will check status on Mon, Nov 16, 2026". |
| Draft not tied to matter | Template list and content come from the selected matter; "Use in a draft" carries the Ask answer into a memo to file. |
| No template picker / send options | Template select; Send to client with channel (email, portal, WhatsApp, print), enabled after approval, recorded in matter. |
| Right bar shows Reyes | Template version + fields and their sources + client language/channel. |
| No batch | "Generate for all 23 pending I-130 clients" → review queue. |

### in_house
| Defect | Change |
|---|---|
| Only 4 clauses | "Checked 14 clauses · 8 need changes · 2 missing · 4 match" with OK rows collapsed and a Missing section. |
| No § refs/quotes | § reference and exact quoted text per row; clicking a row shows the clause on a page preview in the right bar. |
| Repeated "Suggested:"; no fallback/approver | Preferred in table; preferred/fallback/walk-away and deviation approver in right bar. |
| No per-row decision | Accept / Ignore / Undo per row; "Create redline (N accepted)". |
| Law-firm language | "View as: In-house counsel" switches to a Northwind Robotics workspace: "Contract requests", Intake/Time/Deadlines/Firm/Admin hidden. |
| No sales context | Request header: requester, deal value, received, due + SLA, paper, playbook, status. |
| Right bar litigation sources | Playbook + clause preview. |
| Phone table | Clause rows render as cards with risk first-class. |

## Missing personas added (7)
firm_administrator, ethics_gc, docketing, km_librarian, legal_secretary, estate_planning, lit_support, each with the 4 fields + role/department and tasks. Supporting screens: Plan and billing (Admin), AI-use register with filter/export and AI-off matter (Firm insights, Meridian Bank), cross-matter verify queue (Deadlines), Knowledge with retire + usage, secretary send-for-review/export on letterhead, Estate of D. Liu cited inventory with export and probate deadline, production loading/privileged exclusion in the Ask scope panel.

All 15 personas have tasks that prove context binding (matter switch changes answer/sources/timeline/draft/right bar; "View as" changes access). Right-bar expectations are placed in each persona's last task because an open phone drawer covers the page for later steps.

## Kit issue found (not changed; outside ui/)
`shell.js` sets `document.body.dataset.tab`, so `e.target.closest('[data-tab]')` matches `<body>` on every click and calls `selectTab(currentTab)` before the side-bar/rail handlers run. An app that re-renders in `onTab` detaches the clicked element and the selection is lost. Workaround in this app: `onTab` ignores re-selection of the current tab. Suggested kit fix: use `e.target.closest('[role="tab"][data-tab]')`, or store the current tab in another attribute (e.g. `data-current-tab`).
