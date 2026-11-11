# Persona walkthrough: Briefcase: private AI for law firms, working on the firm's own documents (built on AnythingLLM)

**Automated score: 8.1/10** (persona tasks on desktop and phone + global checks)

| Persona | Department | Tasks passed | Score |
|---|---|---|---|
| partner | Firm leadership | 8/8 | 10/10 |
| associate | Litigation | 10/10 | 10/10 |
| paralegal | Litigation support | 10/10 | 10/10 |
| intake | Front office | 6/6 | 10/10 |
| billing | Billing / finance | 8/8 | 10/10 |
| it_ops | IT / legal operations | 8/8 | 10/10 |
| solo_immigration | Immigration practice | 10/10 | 10/10 |
| in_house | In-house legal | 2/10 | 2/10 |
| firm_administrator | Operations | 6/6 | 10/10 |
| ethics_gc | Risk management | 4/8 | 5/10 |
| docketing | Docketing / calendaring | 0/8 | 0/10 |
| km_librarian | Knowledge management | 0/6 | 0/10 |
| legal_secretary | Attorney support | 0/6 | 0/10 |
| estate_planning | Transactional practice | 6/6 | 10/10 |
| lit_support | Litigation support / e-discovery | 8/8 | 10/10 |
| conflicts_analyst | New business intake / conflicts | 6/6 | 10/10 |
| records_manager | Records and information governance | 6/6 | 10/10 |
| solo_general | Solo / small general practice | 6/6 | 10/10 |
| professional_development | Professional development / training | 6/6 | 10/10 |

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

- desktop · in_house · Separate customer workspace with in-house request fields: not visible: [data-testid='request-header']:has-text('Business owner')
- desktop · in_house · Accept a row updates the redline button: TimeoutError: locator.click: Timeout 2500ms exceeded.
- desktop · in_house · Capture a decision in the playbook: TimeoutError: locator.click: Timeout 2500ms exceeded.
- desktop · in_house · NDA request with its own SLA: not visible: [data-testid='review-table']:has-text('Residuals')
- desktop · ethics_gc · Register filtered to client-restricted matters and exported: TimeoutError: page.selectOption: Timeout 2500ms exceeded.
- desktop · ethics_gc · Carrier questionnaire answers: TimeoutError: locator.click: Timeout 2500ms exceeded.
- desktop · docketing · Queue with origin, derived deadline and holiday calendar: not visible: [data-testid='verify-queue']:has-text('Final pretrial conference')
- desktop · docketing · Verify, then post to the calendar: TimeoutError: locator.click: Timeout 2500ms exceeded.
- desktop · docketing · Correct a date with a reason: TimeoutError: locator.click: Timeout 2500ms exceeded.
- desktop · docketing · Reject an extraction: TimeoutError: locator.click: Timeout 2500ms exceeded.
- desktop · km_librarian · Lands on Knowledge with currency fields: not visible: [data-testid='tpl-t3']:has-text('Superseded by v4 (t1) on Thu, Nov 5, 2026')
- desktop · km_librarian · Retire with who and when, and undo: TimeoutError: locator.click: Timeout 2500ms exceeded.
- desktop · km_librarian · See which drafts used it: TimeoutError: locator.click: Timeout 2500ms exceeded.
- desktop · legal_secretary · Client update letter for Reyes with sequential cites: TimeoutError: page.selectOption: Timeout 2500ms exceeded.
- desktop · legal_secretary · Choose a partner as reviewer, then export on letterhead: TimeoutError: page.selectOption: Timeout 2500ms exceeded.
- desktop · legal_secretary · Cannot send to the client before approval: not visible: button:has-text('Send and record in matter'):disabled
- phone · in_house · Separate customer workspace with in-house request fields: not visible: [data-testid='request-header']:has-text('Business owner')
- phone · in_house · Accept a row updates the redline button: TimeoutError: locator.click: Timeout 2500ms exceeded.
- phone · in_house · Capture a decision in the playbook: TimeoutError: locator.click: Timeout 2500ms exceeded.
- phone · in_house · NDA request with its own SLA: not visible: [data-testid='review-table']:has-text('Residuals')
- phone · ethics_gc · Register filtered to client-restricted matters and exported: TimeoutError: page.selectOption: Timeout 2500ms exceeded.
- phone · ethics_gc · Carrier questionnaire answers: TimeoutError: locator.click: Timeout 2500ms exceeded.
- phone · docketing · Queue with origin, derived deadline and holiday calendar: not visible: [data-testid='verify-queue']:has-text('Final pretrial conference')
- phone · docketing · Verify, then post to the calendar: TimeoutError: locator.click: Timeout 2500ms exceeded.
- phone · docketing · Correct a date with a reason: TimeoutError: locator.click: Timeout 2500ms exceeded.
- phone · docketing · Reject an extraction: TimeoutError: locator.click: Timeout 2500ms exceeded.
- phone · km_librarian · Lands on Knowledge with currency fields: not visible: [data-testid='tpl-t3']:has-text('Superseded by v4 (t1) on Thu, Nov 5, 2026')
- phone · km_librarian · Retire with who and when, and undo: TimeoutError: locator.click: Timeout 2500ms exceeded.
- phone · km_librarian · See which drafts used it: TimeoutError: locator.click: Timeout 2500ms exceeded.
- phone · legal_secretary · Client update letter for Reyes with sequential cites: TimeoutError: page.selectOption: Timeout 2500ms exceeded.
- phone · legal_secretary · Choose a partner as reviewer, then export on letterhead: TimeoutError: page.selectOption: Timeout 2500ms exceeded.
- phone · legal_secretary · Cannot send to the client before approval: not visible: button:has-text('Send and record in matter'):disabled
