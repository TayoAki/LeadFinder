# Persona walkthrough: Briefcase: private AI for law firms, working on the firm's own documents (built on AnythingLLM)

**Automated score: 6.3/10** (persona tasks on desktop and phone + global checks)

| Persona | Department | Tasks passed | Score |
|---|---|---|---|
| partner | Firm leadership | 3/8 | 3.8/10 |
| associate | Litigation | 5/10 | 5/10 |
| paralegal | Litigation support | 3/10 | 3/10 |
| intake | Front office | 6/8 | 7.5/10 |
| billing | Billing / finance | 8/8 | 10/10 |
| it_ops | IT / legal operations | 8/8 | 10/10 |
| solo_immigration | Solo practice (immigration) | 1/10 | 1/10 |
| in_house | In-house legal | 2/10 | 2/10 |
| firm_administrator | Operations | 8/8 | 10/10 |
| ethics_gc | Risk management | 3/8 | 3.8/10 |
| docketing | Docketing / calendaring | 8/8 | 10/10 |
| km_librarian | Knowledge management | 6/6 | 10/10 |
| legal_secretary | Attorney support | 4/8 | 5/10 |
| estate_planning | Transactional practice | 0/8 | 0/10 |
| lit_support | Litigation support / e-discovery | 4/8 | 5/10 |

## Global checks

- ✅ desktop: wireframe region visible: .rail
- ✅ desktop: wireframe region visible: .side
- ✅ desktop: wireframe region visible: .tabs
- ✅ desktop: wireframe region visible: .content
- ✅ desktop: wireframe region visible: .right
- ✅ desktop: wireframe region visible: .bottombar
- ✅ desktop: no horizontal page scroll
- ✅ desktop: every tab (4) opens a filled panel
- ✅ desktop: tabs work from the keyboard
- ✅ desktop: tab list contains only tabs
- ✅ desktop: right side bar changes with the tab (4 distinct of 4)
- ✅ desktop: every visible button has a label
- ✅ desktop: no JavaScript errors
- ✅ phone: wireframe region visible: .rail
- ✅ phone: wireframe region visible: .tabs
- ✅ phone: wireframe region visible: .content
- ✅ phone: wireframe region visible: .bottombar
- ✅ phone: no horizontal page scroll
- ✅ phone: every tab (4) opens a filled panel
- ✅ phone: tabs work from the keyboard
- ✅ phone: tab list contains only tabs
- ✅ phone: right side bar changes with the tab (4 distinct of 4)
- ✅ phone: phone drawers open and close (button + Escape)
- ✅ phone: drawer toggles are on screen
- ✅ phone: bottom bar is one line on phone (38px)
- ✅ phone: every visible button has a label
- ✅ phone: no JavaScript errors

## Failures

- desktop · partner · Matter switch rebinds the answer and matter card: not visible: [data-testid='matter-title']:has-text('Herrera I-130')
- desktop · associate · Switching to Estate of D. Liu replaces the Reyes answer: not visible: [data-testid='matter-title']:has-text('Estate of D. Liu')
- desktop · paralegal · Switching matter rebuilds the timeline: not visible: [data-testid='timeline-title']:has-text('Herrera I-130')
- desktop · paralegal · Clicking an event shows its source: TimeoutError: locator.click: Timeout 2500ms exceeded.
- desktop · intake · Next caller in the queue gets her own summary; decline path: not visible: [data-testid='intake-summary']:has-text('Bayview Apartments')
- desktop · solo_immigration · Draft is bound to the selected matter and needs review: not visible: [data-testid='draft-doc']:has-text('IOE0912345678')
- desktop · solo_immigration · Side-by-side Spanish is marked not yet reviewed: TimeoutError: locator.click: Timeout 2500ms exceeded.
- desktop · solo_immigration · Approve, review translation, send by WhatsApp: TimeoutError: locator.click: Timeout 2500ms exceeded.
- desktop · solo_immigration · Batch letters go to a review queue: TimeoutError: locator.click: Timeout 2500ms exceeded.
- desktop · in_house · In-house workspace with request header: not visible: [data-testid='workspace-name']:has-text('Northwind Robotics')
- desktop · in_house · Another request shows its own clauses: not visible: [data-testid='review-table']:has-text('Residuals')
- desktop · in_house · Loading state while a contract is indexing: not visible: [data-testid='indexing']:has-text('2 of 3 files')
- desktop · ethics_gc · AI is actually off inside the restricted matter: not visible: [data-testid='ai-off']:has-text('guidelines §12.3')
- desktop · ethics_gc · Draft and review are blocked there too: not visible: #panel-draft [data-testid='ai-off']
- desktop · estate_planning · Select Estate of D. Liu and get the cited inventory: not visible: [data-testid='matter-title']:has-text('Estate of D. Liu')
- desktop · estate_planning · Export the cited inventory: TimeoutError: locator.click: Timeout 2500ms exceeded.
- desktop · estate_planning · Probate deadline rolled to a business day, flagged to verify: not visible: [data-testid='timeline-title']:has-text('Estate of D. Liu')
- desktop · estate_planning · Right bar matter card is the estate's: not visible: .right [data-testid='matter-card']:has-text('Grace Liu, executor')
- phone · partner · Matter switch rebinds the answer and matter card: not visible: [data-testid='matter-title']:has-text('Herrera I-130')
- phone · partner · Money view, usage by person and AI policy: TimeoutError: locator.click: Timeout 2500ms exceeded.
- phone · partner · Filter the audit log by matter: TimeoutError: page.selectOption: Timeout 2500ms exceeded.
- phone · partner · Right bar shows period, open risks and exports on Firm: TimeoutError: locator.click: Timeout 2500ms exceeded.
- phone · associate · Switching to Estate of D. Liu replaces the Reyes answer: not visible: [data-testid='matter-title']:has-text('Estate of D. Liu')
- phone · associate · Search opens a real results panel: TimeoutError: locator.click: Timeout 2500ms exceeded.
- phone · associate · Associates cannot open Admin: TimeoutError: locator.click: Timeout 2500ms exceeded.
- phone · associate · Citation opens the exact page with Bates number: TimeoutError: locator.click: Timeout 2500ms exceeded.
- phone · paralegal · Reyes timeline with key dates and verified deadline: TimeoutError: locator.click: Timeout 2500ms exceeded.
- phone · paralegal · Filter to testimony and export: TimeoutError: locator.click: Timeout 2500ms exceeded.
- phone · paralegal · Bell badge equals the deadlines listed this week: TimeoutError: locator.click: Timeout 2500ms exceeded.
- phone · paralegal · Switching matter rebuilds the timeline: TimeoutError: locator.click: Timeout 2500ms exceeded.
- phone · paralegal · Clicking an event shows its source: TimeoutError: locator.click: Timeout 2500ms exceeded.
- phone · intake · Next caller in the queue gets her own summary; decline path: TimeoutError: locator.click: Timeout 2500ms exceeded.
- phone · solo_immigration · Draft is bound to the selected matter and needs review: TimeoutError: locator.click: Timeout 2500ms exceeded.
- phone · solo_immigration · Side-by-side Spanish is marked not yet reviewed: TimeoutError: locator.click: Timeout 2500ms exceeded.
- phone · solo_immigration · Approve, review translation, send by WhatsApp: TimeoutError: locator.click: Timeout 2500ms exceeded.
- phone · solo_immigration · Batch letters go to a review queue: TimeoutError: locator.click: Timeout 2500ms exceeded.
- phone · solo_immigration · Selecting Reyes switches the draft away from Herrera: TimeoutError: locator.click: Timeout 2500ms exceeded.
- phone · in_house · In-house workspace with request header: TimeoutError: locator.click: Timeout 2500ms exceeded.
- phone · in_house · Accept a row updates the redline button: TimeoutError: locator.click: Timeout 2500ms exceeded.
- phone · in_house · Another request shows its own clauses: TimeoutError: locator.click: Timeout 2500ms exceeded.
- phone · in_house · Loading state while a contract is indexing: not visible: [data-testid='indexing']:has-text('2 of 3 files')
- phone · in_house · Clause detail with fallback and approver in the right bar: TimeoutError: locator.click: Timeout 2500ms exceeded.
- phone · ethics_gc · AI is actually off inside the restricted matter: TimeoutError: locator.click: Timeout 2500ms exceeded.
- phone · ethics_gc · Draft and review are blocked there too: TimeoutError: locator.click: Timeout 2500ms exceeded.
- phone · ethics_gc · Open risks in the right bar: TimeoutError: locator.click: Timeout 2500ms exceeded.
- phone · legal_secretary · Generate a client update letter for Reyes: TimeoutError: locator.click: Timeout 2500ms exceeded.
- phone · legal_secretary · Send to the partner for review, then export on letterhead: TimeoutError: locator.click: Timeout 2500ms exceeded.
- phone · legal_secretary · Secretaries cannot approve or send to the client: not visible: button:has-text('Send and record in matter'):disabled
- phone · legal_secretary · Fields and sources in the right bar: TimeoutError: locator.click: Timeout 2500ms exceeded.
- phone · estate_planning · Select Estate of D. Liu and get the cited inventory: not visible: [data-testid='matter-title']:has-text('Estate of D. Liu')
- phone · estate_planning · Export the cited inventory: TimeoutError: locator.click: Timeout 2500ms exceeded.
- phone · estate_planning · Probate deadline rolled to a business day, flagged to verify: TimeoutError: locator.click: Timeout 2500ms exceeded.
- phone · estate_planning · Right bar matter card is the estate's: not visible: .right [data-testid='matter-card']:has-text('Grace Liu, executor')
- phone · lit_support · See productions and Bates ranges in scope: TimeoutError: locator.click: Timeout 2500ms exceeded.
- phone · lit_support · Load a new production volume: TimeoutError: locator.click: Timeout 2500ms exceeded.
- phone · lit_support · Exclude the privileged folder and check the Ask scope: TimeoutError: locator.click: Timeout 2500ms exceeded.
- phone · lit_support · Sources list Bates numbers: TimeoutError: locator.click: Timeout 2500ms exceeded.
