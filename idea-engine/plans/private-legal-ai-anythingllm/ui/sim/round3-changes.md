# Briefcase UI: round 3 changes

Maps every item in `review-round2.json` to the fix. Automated walkthrough: 10/10 on 19 personas (desktop and phone), all global checks pass. Screens were checked on desktop and phone, in light and dark mode.

## One "now" and one holiday calendar
- `TODAY = Wed, Nov 11, 2026` and `NOW_T = 11:40`. Every stamp the app writes (approvals, posts, sends, retire, holds, audit entries) uses NOW. The seeded audit log has nothing after 11:22. M. Vega's 10:05 "exported approved letter" entry became "10:54 revised client status letter (not yet approved)", which matches her 10:30–10:54 session. J. Patel's own approval is stamped 09:35, after his 08:40–09:28 work.
- `HOLIDAYS` holds the U.S. federal court holidays, including Veterans Day on Wed, Nov 11. It drives `nextBiz` and `addBiz`, the docket header ("Today is … Veterans Day; next: Thanksgiving …") and in-house SLA dates, which name any holiday they skip.
- Reminders are never dated before the deadline was entered, nor in the past. The Calder request email and verification are now both Thu, Nov 5 (matching Review's "received"), so its only reminder is Nov 11.

## Global
| Defect | Fix |
|---|---|
| Access line false for the viewer | `accessLine()` is viewer-aware: "You are on the matter team (N people)", "not on the team; access via Managing partner / Risk partner / Docketing firm-wide access (logged)", or "firm-open matter (no ethical wall); your access is logged". Matters are firm-open, team-only (Meridian) or walled (Harbor). The associate no longer sees Meridian; the side bar says "2 matters not shown (team-only or ethical wall)". |
| Citation numbering and counts | Citations are numbered per artifact in order of first use: each answer, each letter (EN and ES separately) and the timeline. "Answered from N sources" is computed from the citations actually rendered (Liu: 7). The right bar groups sources by answer, using the same numbers. |
| Matter tabs everywhere | On non-matter screens the tab row is replaced by a section title (`.crumb`). Roles without matter access never see matter tabs, and their side bar says matter documents are not part of the role. |
| Stale state | Chronology export state is kept per matter. Every answer is stamped with the scope it searched; when the scope changes it shows "Scope changed since this answer" with Re-run. The client channel preference is stored per matter. Switching matter resets filters and editors. A role switch lands on that role's home page. |
| Period selector inert | The selector moved into the Firm insights header and recomputes hours, value, margin, subscription, net return, realization, blocked answers and usage for 30 days or a quarter. |
| Badge on locked rail items | Badges are hidden on locked items (CSS `[hidden]` fix plus logic). |
| No single now; Veterans Day ignored | See above. |
| Phone navigation | Bottom rail items have labels. The ☰ button shows the current matter name. The Details button shows a count ("Sources 6"). Tabs are compacted; the kit fade stays as a scroll hint and is removed when the tabs fit. The bottom bar shortens to "Private · healthy". |

## Per persona
**partner**
- The net return is now 4.4× net, with the formula shown: (9,610 − 1,780) ÷ 1,780.
- The Period selector works.
- The Herrera access line is now true for the viewer.
- Harbor Health is "AI paused, not indexed" until the client replies: 0 AI uses, and its OCR deadline was entered by hand.
- "Unapproved drafts exported: N" is computed and lists each file.

**associate**
- Citations are numbered per answer.
- The Liu answer count is 7.
- The access path is explained.
- Answers are stamped with their scope and can be re-run.
- The empty thread chip is removed.

**paralegal**
- Export state is per matter.
- The Calder reminder date is fixed.
- Pin cites are per paragraph: p. 2 ¶3, p. 3 ¶5, p. 4 ¶8, used everywhere.
- The SOL card shows a check mark with "AI-calculated" as metadata.

**intake**
- Booking is locked until the conflict is cleared, with a Model Rule 1.18 warning.
- A declined caller shows "Declined: booking disabled".
- The Intake role has no matter list.
- Summary fields fit the case type (deposit, move-out, lease for landlord-tenant).

**billing**
- Billing prepares entries, requests approval and posts entries an attorney has approved. Only the responsible attorney (or a firm-wide partner) approves.
- Contingency time shows "$0 billed · lodestar $420"; flat-fee time shows "$0 billed · value".
- Stamps follow NOW.
- The KPI reads "Approved this week (Mon–Wed) vs 5.1 h same point last week".
- The right bar has WIP, lodestar and realization by matter.

**it_ops**
- The subprocessor list now includes the vendor (Briefcase Inc.) and Mintplex Labs, with the just-in-time support access and break-glass model.
- Connecting iManage is a flow: consent, libraries, ACL source, test sync, then Connecting… and Connected.
- One access matrix (`whoCan`) drives both the denial pages and Admin.
- A Security settings card covers SCIM, chat-log retention, SIEM export and the IP allowlist.

**solo_immigration** (now described as the firm's immigration partner; the true solo is the new solo_general persona)
- USCIS processing time is presented as a benchmark ("80% within 14 months… not a promised date").
- The batch leaves out the client just written to (22) and agrees with the supervision queue.
- Spanish dates have no comma.

**in_house**
- The "View as" option is labelled "In-house counsel (Northwind)" under "Separate customers", and the workspace is named in the header.
- The request card and matter card use in-house fields: requester, business owner, counterparty, deal value, approvers, company AI policy.
- SLA dates come from the holiday calendar.
- Edit playbook and Save to playbook create v5.1. An ignored clause pre-fills the fallback.

**firm_administrator**
- Plan and billing comes first.
- The right bar shows seats, cost, next invoice and renewal.
- Seat optimisation: remove 2 unused seats to save $178/mo.
- Contract and renewal dates are shown, with the notice deadline.
- The net return is 4.4×.
- There is no matter list.

**ethics_gc**
- Meridian is "Not indexed for AI: no embeddings" and is excluded from search.
- Harbor is paused, including deadline extraction.
- The New Jersey Supreme Court Preliminary Guidelines (Jan 2024) are listed next to ABA 512, marked "Citation to verify", with a jurisdiction selector.
- Carrier questionnaire answers can be exported.
- The GC's access to Meridian is explained.

**docketing**
- Calder dates are fixed.
- Deadlines can be edited (date and rule, with a reason) or rejected (not a deadline).
- The holiday calendar is shown.
- A derived deadline appears: the joint proposed final pretrial order is due Tue, Jan 5, 2027 (ECF 44 ¶2).
- Each deadline is tagged with its origin: AI-extracted, Entered by hand (AI off or paused), or Derived.

**km_librarian**
- Superseded and retired templates are blocked in Draft.
- The superseded date (Nov 5) explains the 3 earlier uses.
- New columns: last reviewed and next review (with "Due soon").
- The brief bank shows status and authority checks.
- Retiring shows who and when, with Undo.

**legal_secretary**
- "(client preference)" comes from each matter's own setting.
- A reviewer picker defaults to the responsible attorney and includes R. Hartwell and F. Webb.
- Letter citations are numbered 1–4 with paragraph pin cites.

**estate_planning**
- Citations are numbered from 1 and the count is 7.
- NJ inheritance tax now depends on beneficiary class: Class A pays no tax and files L-8/L-9 waivers; the return is due only for non-Class A beneficiaries. A federal Form 706 check was added.
- The casing is fixed.
- Documents without Bates numbers show their DMS number.

**lit_support**
- The privileged folder is excluded by default; including it is logged.
- Indexing shows progress, an OCR count and exceptions (2 password-protected files are not indexed, so 866 are).
- Answers are stamped with their scope and can be re-run.
- A production log shows the producing party, received date and a Bates gap/overlap check.

## Missing personas added (persona list now 19, frozen)
**conflicts_analyst**
- View as: Conflicts analyst (L. Moss).
- Clearance queue with the related-party tree (Swift Logistics Holdings → Swift Parcel LLC / Swift Parcel Inc.).
- A recorded decision per near match.
- Clear is enabled only after every near match is decided; clearing unlocks booking and "Open matter in Clio".
- A waiver request when a decision finds a conflict.

**records_manager**
- View as: Records manager (G. Wu).
- New Records rail area: retention covers documents, the AI index and threads.
- Closing a matter applies a 7-year purge date.
- A legal hold blocks purge.
- Purge certificates are listed.

**solo_general**
- View as: Solo attorney (Delgado Law), a separate customer tenant.
- One-seat plan at $119/mo.
- Guided setup with Connect Clio.
- A self-review checklist gates "Approve (self-review)" and records supervision.

**professional_development**
- View as: Training & PD manager (N. Shah).
- Training completion (16 of 18 active users; Lena Moss and Omar Diaz untrained), with Assign module.
- Blocked-answer patterns as teaching material.
- Export of the completion report for the risk partner; Firm insights shows the same numbers.

## Kit
I removed my round-2 workaround for the old body data-tab click bug, because the kit now fixes it. No other kit changes were needed.
