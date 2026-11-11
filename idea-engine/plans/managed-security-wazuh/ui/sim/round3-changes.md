# Watchpost UI round 3: how each review defect was fixed

Source: `ui/sim/review-round2.json` (5/10). Result: automated walkthrough **10/10**. That covers 17 personas, 72 task runs across desktop and phone, and every global check.

I also ran my own checks for all 14 roles on every tab, on desktop and phone, in light and dark:
- no page-level horizontal scroll;
- every control at least 24px and labelled;
- AA text contrast;
- arrow, Home and End keys move between tabs after every role switch.

All passed. The kit fixes (body `data-tab` click and `.sr` offsets) are in, so I removed my round-2 workarounds: the same-tab `onTab` guard, the deferred re-render and the `.sr` override.

## Structural changes behind most fixes

- **Per-client state.** Each client's UI state lives under `P(clientId)`: exports, the downloads log, open incident, disable requests, MFA nudges, filters, framework, expanded controls, share link, question threads, password request, leavers and joiners, and price override. Nothing per-client is global any more.
- **One roster and one promise.** `SHIFTS` covers Priya N. 02–10, Rosa K. 10–18 and Sam T. 18–02. "Now" and "next" are computed from the current time. Timeline rows written as `{A}` and text written as `{A@hh:mm}` resolve to the analyst on shift at that time. `SLA` (review 15 min, contain 30 min, high-severity malware auto-isolated and then analyst-confirmed) is rendered from one string everywhere.
- **Computed status.**
  - Open High incident: "Action needed" (red).
  - Silent device with impact ≥ 75: "Partly protected" (amber), naming the devices.
  - Other silent devices: "Protected on X of Y devices".
  - Onboarding: "Onboarding".

  The headline appends "· N urgent". The same function drives the hero, the sidebar dots, the group scorecard and the white-label preview.
- **Action labels.** The hero says "N urgent", the badge shows the urgent count, and the right bar is split into "Urgent (N)" and "This month (N)". Each action carries an owner tag (Office manager, IT: Marco Diaz, Owner).
- **Role-scoped rails.** Read-only roles (reviewer, broker, counsel, vendor risk) get only Home plus their scope tabs: no bell, search or settings. HR and employee get no internal tools.
- **Phone card rows.** Every wide table (`table.cards`) becomes labelled card rows below 760px: queue, devices, accounts, leavers, joiners, partner, group, subprocessors and price list. A "›" button appears on the tab strip whenever more tabs are off-screen to the right, on top of the kit fade.

## Global defects

| Defect | Change |
|---|---|
| Export history global (cross-tenant leak) | Exports and downloads are stored per client. Harbor and Ridgeline show "No exports yet". |
| Read-only roles saw the bell and internal tasks | Rails are built from the role scope. Read-only roles have no bell, search or settings, and no internal phone tree. |
| SLA 15 vs 30 min; auto vs analyst isolation | One SLA string. The timeline says "isolated automatically by Watchpost", then "Isolation confirmed by Priya N." at 9:51, the overnight shift per the roster. |
| Analyst names did not match the roster | Every analyst name in timelines and in "what we did" is computed from the roster at the event time. |
| "Protected" despite open highs or silent devices | Computed status (above). BrightSmile shows "Partly protected · 4 urgent", Harbor "Action needed", Maple "Onboarding". |
| Stale context on portfolio tabs | On the All-client queue and Partner tabs, the context line reads "Northwind IT · all 6 clients" and the bottom bar shows "6 clients · 493 of 499 devices reporting". The group scorecard shows group totals. |
| Arrow keys | Tabs are rebuilt with `role=tab`, `data-tab` and `tabindex`. Checked by script for all 14 roles: ArrowRight and End move selection and focus. |
| Phone tables clipped; no tab scroll hint | Card rows and the "›" tab-strip button. |
| Placeholder strings | Realistic identifiers: KB5068861 / CVE-2026-41132 (Server 2022), firewall firmware 7.4.8 / CVE-2026-24470, KB5066835 / CVE-2026-38810 (Windows 11). The CVE opens an advisory (mock). |

## Per persona

**owner.**
- The headline is qualified, amber and names the silent devices.
- The duplicate coverage tile is gone. One "Devices reporting" KPI, with a tooltip defining "reporting".
- Action groups are labelled Urgent and This month.
- The promise reads "review 15 min · contain 30 min" everywhere.

**office_mgr.**
- "Ask Marco for the password" sends a request and shows "Requested from Marco Diaz at 14:20".
- The notifications panel defaults to "Mine", with owner tags on every item.
- "Ask an analyst" opens an inline thread showing the analyst on duty and "reply due by 14:35".

**it_mgr.**
- Fix first is filtered by location. If nothing applies, it says "Nothing critical here" and lists the company-wide item.
- Real KB and CVE identifiers.
- FRONTDESK-05's agent removal is now incident bs4 (agent tamper alert), linked from the device row.
- Silent devices are rated by data held: PHI means at least Medium, and a silent device is never green.
- "Devices with an issue" lists only devices with an issue; healthy ones go to the CSV.

**msp_tech.**
- Exports are per client.
- Portfolio bottom bar on the queue.
- The queue button is "View", and the status column says "Open: action needed" or "Closed: contained".
- The Sunrise timeline includes "06:50 MFA push approved" and the task references it.
- Phone queue uses card rows.
- Fix-first wording follows the device type ("does not change or restart your firewall").

**msp_owner.**
- Portfolio context line and bottom bar on Partner.
- Sparkline column is titled "Alerts/day, 30d", with a tooltip and an aria-label.
- The white-label preview uses the computed status (Harbor: "Action needed").
- Per-client price override select, a renewal date column, and "At risk" flags (open high, no QBR in 120+ days, renewal within 60 days).
- The table is compacted so it fits at desktop width.

**compliance.**
- "X of 13 evidenced controls met", with a scope note listing the HIPAA standards outside the service.
- §164.316(b)(2)(i) is reworded as documentation retention (policies, risk analyses, incident records) for 6 years, separate from 12-month raw logs.
- PCI DSS is "Not yet scoped: do you take card payments?" with Yes/No buttons.
- Data backup plan is "Partly met" while NAS-BACKUP is silent, linked to the device.
- The duplicate "Collected" label is fixed. Exports are per client and carry SHA-256.

**finance.**
- EDR is described as "Wazuh agent with active response (isolate host, kill process)", with a flag to confirm the carrier's EDR definition.
- The backup answer reflects the silent NAS.
- Policy retention ($25,000), last year's premium, and the broker's estimate ($6,100–$6,400) if the open answers are fixed.
- Annual cost $11,988. Cancellation terms. ACH ending 7319 instead of the 4242 test card.

**msp_account_mgr.**
- The QBR shows "vs Q3" arrows, the contract renewal date and a priced upsell (for example "CMMC Level 2 readiness assessment, $2/device/mo ($82/mo)").
- A "Client-safe view" toggle hides direct price, wholesale, profit, margin, KPI cards, partner billing and white-label.
- The duplicate QBR card is removed: per-row buttons only, plus a list of last QBR dates.

**practice_manager_regulated.**
- The filter note follows the filter ("2 accounts match 'Unused 30+ days'").
- A disable request replaces the Unused pill with "Pending IT · due Nov 12".
- A leavers list (from payroll) shows an overdue flag per leaver, and a joiners list shows day-one due dates.

**external_auditor.**
- Per-client log: a read-only "Exports and downloads log" with SHA-256, recording the reviewer's own downloads.
- No export, bell or settings.
- Third-person copy ("Control owner: Ridgeline staff", "What the client needs to do", "escalated to the client").
- The role is now "Prime-contractor supplier reviewer", and the scope note says Level 1 is a self-assessment entered in SPRS.
- Only in-scope frameworks appear in the sidebar and dropdown.

**insurance_broker.**
- No bell.
- "Incident history (36 months)" with counts by severity, notifiable breaches and claims.
- The timeline says "pack shared with you Nov 11".
- The breach-cost sales card is hidden.
- An attestation summary (signer, date, scope, valid until) is shown before download.

**general_counsel.**
- Roster-consistent timeline with automatic isolation and analyst confirmation.
- Discovery date and time.
- Latest notice dates: HIPAA 60 days, strictest state law 30 days, plus NCUA and FTC where relevant.
- The HIPAA 4-factor assessment with who assessed it, and the list of evidence behind the conclusion.
- "Download incident record (PDF)". No bell.

**security_champion_employee.**
- The sidebar shows "Your reports" and tips; the context line shows the company name only. No device counts anywhere in this view.
- The form validates (sender and subject, or a pasted email).
- After sending, a read-only summary keeps what was submitted ("I clicked a link"), then a "Sent · an analyst is checking" state, then the verdict ("Checked by Rosa K. at 14:23").
- The double period is fixed.

## Missing personas added (personas.json now has 17)

| Persona | Role in the View-as switch | What proves it |
|---|---|---|
| procurement_vendor_risk | Vendor-risk reviewer (Sunrise CU) | Trust tab: SOC 2 Type II (period, issued, exceptions), pen test, subprocessors, data location (US only), retention and deletion on exit with a certificate of destruction, SIG Lite / CAIQ / GLBA addendum. Read-only, with no bell. |
| hr_people_ops | HR / people ops (BrightSmile) | Joiners & leavers tab. "Add a leaver (last day today)" shows "Disable due today · request sent to IT automatically". The training roster shows "38 of 41 staff completed" and feeds Compliance and Insurance. |
| multi_entity_operator | Group COO (Keystone Health Partners) | Group scorecard compares BrightSmile (direct), Lakeside (via Northwind IT) and Maple (new acquisition) on devices reporting, open highs, compliance and insurance readiness. Flags the weakest and shows its first-30-days checklist. Drill-down into each entity. |
| trial_evaluator | New customer in trial (Maple Dental) | Onboarding tab: "31 of 38 agents installed", Microsoft 365 and firewall status, day 10 of 14, first invoice and go-live dates, week-1 findings, and the rollout checklist. Overview status is "Onboarding". |

Every persona's tasks start by selecting its role and assert context binding. Examples:
- Harbor's devices and exports, and not BrightSmile's.
- The portfolio context on the queue and Partner tabs.
- No bell for read-only links.
- The reviewer's log containing no HIPAA entries.
- The employee view containing no device counts.

## Not done / notes

- The employee verdict needs a "Mockup: show the analyst's reply" button, because the walkthrough can't wait for a timer.
- KB and CVE identifiers are realistic but fictional, as this is mock data dated November 2026.
- Shared kit: I needed no further changes. In dark mode the kit now sets a dark text colour on `.rail .logo`, which is wrong on the MSP brand-blue background. I override it in my page for branded logos (`.rail .logo[style]`). The kit may want to scope that rule to the default logo only.
