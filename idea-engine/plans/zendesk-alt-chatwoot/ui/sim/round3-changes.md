# FlatDesk UI: round 3 changes

This round answers every defect in `review-round2.json`.

The automated score is **10/10**: 19 personas and 86 tasks, run on desktop (1440x900) and phone (390x844), plus the global checks.

A separate scan of all 27 tab and sub-page screens also passed in four modes: light desktop, light phone, dark desktop and dark phone. It checked:
- text contrast against AA;
- that no target is smaller than 24px;
- that nothing scrolls sideways;
- that there are no JavaScript errors.

The persona list is now final: the 15 from before plus procurement, integrations_engineer, product_manager and workforce_planner.

The script still comes from one data object, `D`. What is new this round is that all derived state is recalculated from the current data on every render, after any action. That covers the policy check, the WhatsApp window, privacy redaction, gap counts, seats, approvals and notifications. Nothing is cached text any more.

## Global defects

| Defect | Change |
|---|---|
| 8 personas had no role | **"View as" now has 19 roles, one per persona.** Each role scopes four things: its tabs, its sub-pages (`subs`), the conversations it can see (`scope`: all / support / sales / WhatsApp+Spanish / Overflow) and its permissions (reply, approve, privacy, rules, articles, billing, admin, integrations, qa). Each role also has its own start page and its own notifications. Role labels are short ("Agent · Maya"), so the select is no longer cut off. |
| Savings measured against a hypothetical Zendesk + AI | **The baseline is now what Northbrew actually paid Zendesk**: the average 2026 invoice is $836, so FlatDesk saves $237/mo from December. The second line is savings against Zendesk's renewal quote: 8 seats × $135 = $1,080, so $481/mo saved. The Zendesk + AI figure only appears in a box titled "Hypothetical, for context only", which says "Not a saving you had". The bottom bar, Reports and Billing all use the same `savings()` function. |
| Reports right bar was the same on every sub-page | Each sub-page now has its own right bar: <ul><li>Overview: a period comparison table, definitions and the export.</li><li>SLA: live-queue filters, the at-risk list and the business-hours clock, or 1:1 coaching samples.</li><li>Reasons: drill-down, saved customers and definitions.</li><li>Fulfilment: a digest preview, recipients and CSV export.</li><li>Product: SKU detail and the flag action.</li><li>Staffing: assumptions and shifts.</li></ul> |
| Macros padded with unrelated items | Only macros matching the ticket's intent are shown, and a "Browse all macros" link appears when fewer than 3 match. New sales macros: Send samples and Book a call. |
| Phone tab strip looked covered by the drawer button | The tab strip now fades at both edges, and the active tab scrolls into view on every tab change. The drawer button sits outside the strip and is labelled "☰ Inbox" or "☰ Pages". |
| Toasts persisted across tabs and covered the phone bars | Toasts are dismissed on every tab change. On phone they sit 112px from the bottom, above the bottom bar and the bottom nav. |
| Selects cut off at 1440px | View options are shortened (e.g. "WhatsApp (2)"), with the channel stats shown as chips below. Role labels are short, and the bottom-bar text is trimmed. |
| Channel counts didn't reconcile | Unread and waiting counts are calculated from the same list as the view: for example, "2 open conversations · 1 unread · 1 of 2 waiting >1h". |
| Policy and window text went stale | <ul><li>The policy check is recalculated against the current limit. After the change to $150 it reads "Under the current $150 limit … handed off under the earlier $100 rule, any agent can now send it". The handoff note itself still records the rule in force at the time.</li><li>The WhatsApp window runs only from `lastInMin`, the customer's last inbound message. Our replies never restart it.</li><li>A deleted customer is redacted in the list, the thread, the right bar and search.</li></ul> |
| Disabled buttons looked like primary buttons in dark mode | Disabled buttons now have a dashed border, 50% opacity, a not-allowed cursor and no fill, and they show a text reason where they appear. "Draft article" is no longer shown disabled; its status shows instead. I removed my own dark-mode workaround because the kit's `--on-accent` and `--on-bad` tokens now cover it. |

## agent

| Defect | Change |
|---|---|
| An agent could approve their own over-limit replacement | **There is now a real approval flow.** When the amount is over the limit and the user can't approve, the primary button reads "Request approval from Jordan P.". The ticket then shows "⏳ Waiting for Jordan P." and a thread event. The lead gets a notification and a sidebar chip ("Approvals waiting: n"), and sees "Approve: … and send" or "Decline". Approving creates #4021-R, sends the reply as Maya with "approved by Jordan P.", and logs the approval in the thread. The Refund and Replacement forms send the same request when over the limit. |
| "Send replacement" still offered after #4021-R existed | The button is replaced by "Replacement #4021-R already created". The refund button becomes "Refund instead…", and its form warns that a replacement already exists. |
| Agent and Sales could delete customer data | Only Owner, Admin and Privacy see "Export or delete…". Agent and Sales see "Request deletion (sent to the privacy owner, Pat D.)", which creates a register entry marked "Awaiting identity check". |
| Unrelated macros | Intent-matched only (see global). |
| Grace Park: "2 orders · $58" | Subscription shipments are now calculated from the subscription start (Jan 2025 to Nov 2026). Grace shows "23 orders · $667 lifetime · 23 shipments". |
| Handled ticket stayed in "Needs a human" | That view now shows only open tickets with no reply sent yet. Pending tickets drop out and the count updates. |

## lead

| Defect | Change |
|---|---|
| SLA arithmetic | Now reads "47 of 50 first replies on time (94%). 3 missed + 1 open breach = 4 breaches today." |
| Opening from notifications lost the working view | The current view is kept when it contains the ticket. Otherwise a "← Back to … view" chip appears. |
| No coaching data | SLA, workload & coaching now shows, per agent: QA pass (n), reopen %, median first reply and a "1:1 samples" button. The button opens that agent's sample conversations in the right bar. |
| Approvals not routed | Approvals now appear in notifications, in the sidebar chip and in an "Approvals waiting" view. |
| Email "4 · 5 waiting" | The counts now come from the same list (see global). |

## head_cx

| Defect | Change |
|---|---|
| Savings against a hypothetical | The KPI now reads "Savings vs what you paid Zendesk · per month: $237", with the renewal comparison and the labelled hypothetical underneath. |
| Weekly chart had no volume axis and sparse CSAT | Added a y-axis (0–1.2k), a volume value on every bar, and CSAT drawn as a line with a label every week. The chart is now full width. |
| No Head of CX role | Added Dana W.: Reports, AI agent, Migration, and a read-only Billing summary. |
| Board page showed operational SLA noise | The Overview right bar is now a period comparison, definitions and the export. |
| No comparison with a previous period | AI rate, CSAT, first response, cost per conversation and repeat orders now show a delta. Month to date is compared with "Oct 1–19 (on Zendesk)" and the last 7 days with Nov 6–12. A "What changed" card explains that cost per conversation is higher because the flat fee includes the AI. |

## finance

| Defect | Change |
|---|---|
| Projection inflated | The 12-month table now has five lines: FlatDesk (headline), FlatDesk if the team grows, Zendesk at its actual run rate (about $10,036), Zendesk at the renewal quote ($12,960), and the hypothetical Zendesk + AI shown greyed. The headline is calculated against the actual run rate and the quote only. |
| Soft fair-use rule | Contract §4.2 now reads: "Above 3,000 for 3 consecutive months you choose: (a) stay on Flat 10 with the AI capped at 100 resolutions a day … or (b) move to Flat 25. No back-billing, ever." The same text appears on Billing, Terms and Contract. |
| Price after the lock ends | The price is locked until Oct 31, 2027, then rises at most 5% a year. Nov 2027 is projected at the capped $629. |
| Transition month used list price | It now uses the actual Zendesk November invoice ($805), and the same number appears in Budget vs actual. |
| No seat-tier warning | Billing shows "Seats 9/10. Agent 11 moves you to Flat 25 (+$400/mo)". Finance, Owner and Admin get a notification at 9 or 10 seats. Invoices show seats included vs used. |

## founder

| Defect | Change |
|---|---|
| Proof numbers hidden | The summary's "Proof history arrived" card now shows 48,210 of 48,210 tickets, 112,904 attachments, customers and articles, next to the spot-check. |
| Revenue was a single number | Added "Orders within 7 days of a support reply" (count and revenue, with a delta) and "Revenue kept". Revenue kept adds up the real prices of pause saves plus replacement values, alongside revenue at stake in open tickets. |
| Bottom bar used the hypothetical | It now reads "From Dec: $237/mo less than your Zendesk bill", for roles that have Billing. |
| "Status: complete" alongside an open to-do | Now reads "Migration complete · 1 peak item open". This updates when the second Overflow agent is added. |

## it_admin

| Defect | Change |
|---|---|
| Audit log too thin | Added an Admin › Audit log page: type and actor filters, CSV export, "Connect a SIEM (Splunk HEC or webhook)" and a stated retention (1 year, extendable to 7). |
| SOC 2 Type II had no date | The Type II audit window is Sep 2026–Feb 2027, with the report expected in Mar 2027. A bridge letter can be downloaded. |
| No network or session controls | Added an IP allowlist with ranges, including the ShiftCX VPN, and "Sign Sam T. out everywhere". Both are logged. |
| IT could edit AI rules | Rules are read-only for IT, with a stated reason. The guardrail select is disabled. |

## ops_whatsapp

| Defect | Change |
|---|---|
| Window reset on our reply | The window runs from the customer's last inbound message only. The header says so, and it still reads about 22h left after we send. |
| View select cut off | Fixed (see global). |
| Raw template placeholders | The template now shows a filled-in preview: "Hi Alex, here's an update on order #4020: shipped (no scan since nov 15)…". |
| No ops role | Added Rosa M.: WhatsApp, Spanish group, SLA and Mine views, plus Reports › SLA. |
| Alex's list time matched no message | Every row's time now comes from the last message in either direction, or "just now" after a send. |

## knowledge

| Defect | Change |
|---|---|
| Samples outside the period | Samples now carry a day and are filtered to the period. The right-bar header names the period. |
| Published gap stayed in the open count | Published gaps move to "Fixed this period". The open count drops in the table, the sidebar and notifications. |
| Self-serve rate was a vanity metric | Now defined as sessions that viewed an article and did not open a conversation within 24h, and the definition appears in the right bar. |
| No follow-up to the customer who asked | Added "Reply to 1 open conversation with this article". It sends to Tom Rivera through Sam's conversation and sets the ticket to pending. |
| No knowledge role | Added Kai L. (AI agent tab, article editing). |

## support_ops_admin

| Defect | Change |
|---|---|
| Auto-close marked "Mapped" | Now "Mapped with changes", with the solved→closed vs pending→resolved difference explained. Also flagged: the reopen-escalation trigger. |
| $112 ticket still said "over $100" after the change | Recalculated (see global). |
| View-as select cut off | Fixed. |
| SLA hours not business or calendar | Each policy now says "business hours". Shown alongside: business hours Mon–Sat 08:00–20:00 ET, the US holiday calendar, and the peak override Nov 27–30. |
| No object counts and no trigger testing | Added a table of migrated objects (Automations, Views, Macros, SLA policies, Triggers: mapped / changed / review), "Showing 8 of 24", and "Test on sample" on every trigger. |

## qa_coach

| Defect | Change |
|---|---|
| Scoring was a single Good / Needs fix | Each of the 4 criteria is now a checkbox. A reply's score is n/4, and it passes only at 4/4. Results roll up to an AI pass rate (n) and per-agent QA in Reports. |
| AI replies only | Added a Human replies sample. Feedback is saved to the agent's coaching notes and counts toward the agent's QA in the SLA table. |
| Mei Chen never told | Added "Reopen and send the corrected reply to Mei Chen". |
| No running totals | The AI QA pass rate for the period appears in the queue, the sidebar, the AI overview and the right bar, with per-agent rates. |
| No QA role | Added Quinn A. |

## privacy_legal

| Defect | Change |
|---|---|
| Deleted customer still visible | After confirmation:<ul><li>the customer becomes "Deleted customer · DSR-012";</li><li>messages, contact details and AI logs are removed;</li><li>open conversations are closed with that request ID;</li><li>pending approvals are cancelled;</li><li>the customer is excluded from search and from the open list;</li><li>the thread shows a redaction notice.</li></ul> |
| Conflicting wording | One state everywhere: "Deleted from FlatDesk Nov 19 · purged from backups by Dec 24". |
| No request register | Added Admin › Privacy requests: ID, type, requester (with jurisdiction and source), received date, identity check, due date (GDPR 30 / CCPA 45 days), status. Confirm stays disabled until an identity check is chosen. |
| Anyone could delete, with no warning | Delete is limited to Owner, Admin and Privacy, and it warns about open conversations and pending order activity. |
| No retention setting or transfer basis | Added a retention select (Never / 12 / 24 / 36 months, logged when changed). EU→US transfers rely on the EU-US Data Privacy Framework, with SCCs (Module 2) in DPA Annex III, shown on Privacy requests and on Trust. |
| "(mock)" toast and two names for the DPA | No "(mock)" text remains anywhere. The document is called "Data Processing Agreement (signed)" in every place. |

## wholesale_sales

| Defect | Change |
|---|---|
| Badge counted support breaches | Notifications are scoped to the role's inboxes. Carla sees 1 (Ben), and after replying sees "Nothing needs you right now". |
| CRM event too vague | Now reads "HubSpot deal #48213 created · Carter's Corner Café · est. $540/mo (15 kg × $36/kg Café tier) · stage: New lead", with an "Open in HubSpot" link. |
| Support macros on a lead | Only sales macros show. |
| "1 conversations"; seat counters shown to Sales | Singular and plural are handled. Seat and AI counters only show to Billing, Admin and Head of CX. |

## retention_marketing

| Defect | Change |
|---|---|
| No trend | The reasons table has a "vs previous" column (in points, plus the previous count) and a 12-week sparkline per reason. |
| No drill-down | Clicking a reason (or pressing Enter on it) lists its conversations in the right bar, with "Export N customers to the email/SMS tool (CSV)". |
| Every save valued at $29 | Each saved customer is valued at their own plan price ($18, $29 or $36). Mei is $18. |
| Irrelevant right bar | The right bar now shows the drill-down, saved customers and definitions. |
| Grace's draft paused without asking | The draft now offers pause or cancel and asks her to choose. There is no automatic action. |
| No sentiment | Added a tone-by-channel card with Instagram examples. |

## fulfillment_ops

| Defect | Change |
|---|---|
| Raw counts only | Issues are shown per 1,000 orders shipped, by SKU and by carrier, against the previous period. Shipped volumes come from daily data and SKU/carrier shares. |
| Warehouse and carrier faults mixed | Split into Warehouse (ShipFast 3PL) mis-picks and Carrier damage, with "Send N to the 3PL" and "File N carrier claims" buttons. |
| Irrelevant right bar | Shows the weekly digest preview, recipients and an export. |
| No role and no way back | Added Felix O. (Reports › Fulfilment and Product, conversations read-only). Opening an issue shows a "← Back to Fulfilment issues" chip. |

## bpo_manager

| Defect | Change |
|---|---|
| No Overflow reporting | Reports › SLA has a group filter and an Overflow card: volume, % within 4 business hours against the contracted 90%, CSAT (n). It has a "Share vendor SLA report" button. |
| No seat-tier warning | The form shows "9 → 10 of 10. You'll be at 10/10: agent 11 moves you to Flat 25 ($999, +$400/mo)". |
| No vendor role | Added Vic N. (ShiftCX): only the Overflow queue and its SLA report. No Billing, Admin or internal workload. |
| Hours were free text | Replaced with a schedule picker: time zone, shift start and end, and holiday overrides (Thanksgiving all day; Black Friday and Cyber Monday from 14:00). The group's schedule is stored with its time zone. |

## Missing personas (now added, with tasks)

| Persona | What was built | Tasks prove |
|---|---|---|
| procurement | Billing › Contract & SLA:<ul><li>signed order form;</li><li>month-to-month term;</li><li>price lock and a 5% cap ($629 from Nov 2027);</li><li>uptime SLA with a credit table and history;</li><li>status page;</li><li>exit and data return;</li><li>the §4.2 fair-use clause;</li><li>"Remind me 30 days before the price lock ends".</li></ul> | Setting the reminder adds it to procurement's notifications. Trust documents are reachable from Admin. |
| integrations_engineer | Admin › Integrations & API: app health, a webhook builder with a sample payload, test delivery, a delivery log (including a 503 with retry), API keys with scopes and rate limits. | Testing then saving the Slack webhook adds a log entry and turns the Rules trigger t8 into "Webhook… Mapped with changes"; its trigger test passes. |
| product_manager | Reports › Product feedback: questions by SKU with deltas, defects from fulfilment issues, returns, quotes, and a conflict flag. | Flagging the decaf page conflict is confirmed, and "Open the AI gap" jumps to the matching knowledge gap. |
| workforce_planner | Reports › Staffing: Black Friday week by hour after AI. Day and channel selectors, people needed vs scheduled (including Overflow), and uncovered hours highlighted with text. | The uncovered-hours summary changes with the day and channel. Overflow headcount feeds the evening cover. |

## Kit

The coordinator listed three kit changes. Two are in effect and the third changes nothing in the app:

- **Body data-tab click fix.** In effect. My early-return in `onTab` is kept only as a cheap guard against re-rendering an unchanged tab.
- **`--on-accent`, `--on-bad` and `--faint` tokens.** In effect; I removed my own dark-mode overrides.
- **Escape between phone tasks.** In effect in `simulate.js`. My tasks also close any right drawer they open.

I needed no further kit changes.
