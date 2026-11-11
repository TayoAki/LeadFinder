# Watchpost UI round 4: fixes for review-round3.json

**Automated walkthrough: 10/10.** The persona list stays at 17. Tasks were tightened and 6 tasks added to prove the new behaviour.

My own checks for all 14 roles, every tab, on desktop and phone, in light and dark:
- no page-level horizontal scroll;
- every control at least 24px and labelled;
- AA text contrast;
- arrow, Home and End keys move between tabs after every role switch.

All passed. I also checked desktop and phone screenshots in light and dark: trial overview and devices, office incidents, client-safe Partner, auditor compliance, Trust page (dark), IT incidents (dark), group scorecard (phone) and Partner (phone, dark).

## The 16 material items

| # | Item | Change |
|---|---|---|
| 1 | Trial customer (Maple) | Devices has a "Not yet installed (7)" card from the Microsoft 365/Intune inventory (OP-1…FRONT-TABLET), with an install-link button. "Not reporting" no longer says every device reports; it points to the 7. The Overview period is "Since Nov 2, 2026 (trial day 10 of 14)". The summary opens with "31 of 38 devices covered; 7 still to install". The report is the week-1 report (Nov 2–8), not October. A price card reads "After the trial: Small office $599/mo, 38 devices", and the go-live review (Nov 13) now comes before the first invoice (Nov 16). The trial role also gets the Compliance tab, so every to-do and outcome card links somewhere. The right-bar chart is replaced by "since the trial started". |
| 2 | Incident evidence | Each incident carries its own evidence list, built from its own data sources. M365 incidents cite Entra sign-in, mailbox audit and message trace. Endpoint incidents cite the process tree. Harbor cites the dealer portal and M365 audit. Ridgeline cites USB events and the drawings share. Sunrise cites core banking and Entra. The dental template is gone. |
| 3 | Status rules | One rule: any open incident needing client action means "Action needed" (red), ahead of "Partly protected". Incidents declare which controls they affect: Sunrise s1 → MFA and access, Harbor h1 → access and notify, BrightSmile bs4 → EDR and access. Those controls drop to "Partly met" with the incident named. NCUA now includes a patching element, so Sunrise's missing update shows there too. |
| 4 | Compliance evidence source | Every control row shows where its evidence comes from, with a date: "Collected by Watchpost · Nov 11, 2026", "Customer document · Mar 2, 2026" (risk analysis, training, IR plan, backup report), "Company attestation · Joe Ridge · Sep 14, 2026" (CMMC PE/MP, FTC encryption), "Signed agreement", or "Watchpost process". FTC 314.4(j) shows "Process in place · notification decision due Nov 13" while Harbor's case is open. Headings say "tracked controls", not "evidenced". |
| 5 | 6-year archive | On by default for HIPAA customers (BrightSmile, Lakeside, Maple), matching Billing. Each incident record shows its retention (e.g. "Record kept until Nov 4, 2032"). |
| 6 | m.reyes | One story: Mia Reyes left Oct 7. Her cloud account is unused, and her local admin account `mreyes-local` on FRONTDESK-05 removed the agent on Nov 9. The incident is now High, open, owned by IT, and linked both ways to the overdue leaver record. The action is "disable both accounts now, then reinstall". Counsel sees "Patient data accessed: Unknown since Nov 9, 16:12 (no telemetry)", an open 4-factor assessment and a decision date. |
| 7 | Counsel 4-factor | "Unauthorized person" is the real answer on every row (e.g. "Unknown external actor, IP range 102.89.x.x (Nigeria)", "Former employee Mia Reyes or someone using mreyes-local"). |
| 8 | Client-safe Partner | Shows only the selected client: devices, its price, renewal, alerts per day, and its QBR. The sidebar hides every other client (with an exit button). The right bar, context line and bottom bar are client-only. No risk notes, costs or margins. |
| 9 | QBR | "Q4 2026 to date: Oct 1 – Nov 11 (42 days, partial quarter)" compared with the same 42 days of Q3 (Jul 1 – Aug 11). Coverage reads "▲ vs Q3 period (98%)". Upsells are priced plainly, e.g. "CMMC Level 2 readiness assessment: one-off $2,400". |
| 10 | Vendor-risk Trust | Separate cards for where data is stored (US only, AWS us-east-2/us-west-2) and where it is accessed from (US and Pune via a US-hosted VDI, with a US-only option). The India affiliate is listed as a subprocessor with its controls. The contracting party is Northwind IT, with Watchpost as Northwind's subprocessor and flow-down terms. New rows: Watchpost breach notice within 24 h (supports NCUA 72 h), BC/DR (RTO 4 h, RPO 15 min, tested Jun 2026), and staff background checks. |
| 11 | Group COO and Maple insurance | With no policy, Maple shows "Join by Jan 1" instead of a renewal date. The timeline is relative and in order: send answers 31 days before, underwriter questions 10 days before, then join/renew. The breach-cost card no longer shows "retention (—)". The group scorecard adds a "Security cost / mo" column (direct plan, MSP price, or trial price from date), a group total per month and year, and "Download board pack (PDF)". The first-30-days checklist follows the newly acquired entity, not the weakest. |
| 12 | Office manager | A "Your tasks (N)" strip tops her Overview. Her items are tagged "You". Her incident is ordered first in her view. The legal block collapses to "No patient data exposed. Nothing to report.", with "Details for counsel" behind it. |
| 13 | IT manager | Incidents shows a "Top 5 alert sources and what analysts tuned" table (counts sum to 1,240) for IT and MSP roles. |
| 14 | Tamper wording | Escalations read "2 threats stopped · 1 open (agent removed on FRONTDESK-05) · 1 false alarm (svc-backup admin account)", on Incidents and in the Overview KPI. The headline says "reconnect the other 3 silent devices". |
| 15 | Harbor detection delay | The incident head reads "active 37 h before detection · contained 18 min after detection". A "Detection delay" box explains why, and what analysts added. The timeline labels the 19:02 rule as "not alerted". |
| 16 | Smaller items | Sparklines show "77/day" next to each. "Renews in N days" is separate from "At risk", which now only flags open highs or no QBR in 120 days. The broker gets a per-year history (expandable, one line per event) and the attestation statement text. HR gets a training roster table (person, course, completion date, certificate status) with CSV export. Billing gets a "Cost vs value" card (annual cost, premium change from the broker's indication, retention per incident, 24/7 staffing comparison) and a payment-summary export; the "vs cyber premium" line is gone. The practice manager gets "Escalate to the owner" on overdue leavers, a dated "Access removed … confirmed by Marco Diaz" record (seeded for Owen Burke; a mockup confirm button for others), and the employee verdict adds "We checked your PC: clean". |

## Also fixed from the review's optional items

- The queue has "Waiting on" (client contact) and "Age" columns.
- MSP clients' to-dos are tagged with the client's real contact or Northwind IT, not "Office manager".
- Question threads say "usually answered within 15 minutes" (separate from the alert promise).
- Ridgeline shows the next SPRS affirmation (Apr 2, 2027) separately from the prime's Dec 8 supplier review.
- On phone, the context line's client or entity name opens the switcher drawer.
- "1 joiners" grammar fixed.
- The Trust page uses the Watchpost logo.
- The client list sits inside `.side`, so the simulator opens the drawer for msp_tech phone tasks.

## Not done

- The review's three suggested personas (MSP NOC lead, board member, internal SOC analyst) were not added, because the persona list is frozen at 17.
- "Mockup: IT confirms removal" is a button, because the walkthrough can't wait for a real confirmation.
