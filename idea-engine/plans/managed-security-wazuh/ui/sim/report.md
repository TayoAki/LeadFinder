# Persona walkthrough: Watchpost: managed threat detection and response for small businesses (built on Wazuh)

**Automated score: 8.4/10** (persona tasks on desktop and phone + global checks)

| Persona | Department | Tasks passed | Score |
|---|---|---|---|
| owner | Executive | 4/4 | 10/10 |
| office_mgr | Operations | 4/6 | 6.7/10 |
| it_mgr | IT | 6/8 | 7.5/10 |
| msp_tech | IT services (MSP) | 5/8 | 6.3/10 |
| msp_owner | IT services (MSP leadership) | 4/4 | 10/10 |
| compliance | Compliance | 6/8 | 7.5/10 |
| finance | Finance | 2/4 | 5/10 |
| msp_account_mgr | IT services (MSP sales / account management) | 0/2 | 0/10 |
| practice_manager_regulated | Operations (multi-site) | 2/2 | 10/10 |
| external_auditor | External (audit / assessor) | 2/2 | 10/10 |
| insurance_broker | External (insurance) | 2/2 | 10/10 |
| general_counsel | Legal / privacy | 2/2 | 10/10 |
| security_champion_employee | All staff | 2/2 | 10/10 |

## Global checks

- ✅ desktop: wireframe region visible: .rail
- ✅ desktop: wireframe region visible: .side
- ✅ desktop: wireframe region visible: .tabs
- ✅ desktop: wireframe region visible: .content
- ✅ desktop: wireframe region visible: .right
- ✅ desktop: wireframe region visible: .bottombar
- ✅ desktop: no horizontal page scroll
- ✅ desktop: every tab (7) opens a filled panel
- ✅ desktop: tabs work from the keyboard
- ✅ desktop: tab list contains only tabs
- ✅ desktop: right side bar changes with the tab (7 distinct of 7)
- ✅ desktop: every visible button has a label
- ✅ desktop: no JavaScript errors
- ✅ phone: wireframe region visible: .rail
- ✅ phone: wireframe region visible: .tabs
- ✅ phone: wireframe region visible: .content
- ✅ phone: wireframe region visible: .bottombar
- ✅ phone: no horizontal page scroll
- ✅ phone: every tab (7) opens a filled panel
- ✅ phone: tabs work from the keyboard
- ✅ phone: tab list contains only tabs
- ✅ phone: right side bar changes with the tab (7 distinct of 7)
- ✅ phone: phone drawers open and close (button + Escape)
- ✅ phone: drawer toggles are on screen
- ✅ phone: bottom bar is one line on phone (30px)
- ✅ phone: every visible button has a label
- ✅ phone: no JavaScript errors

## Failures

- desktop · office_mgr · Notifications open a real panel: not visible: #pop [data-testid='notifications']:has-text('reception@')
- desktop · it_mgr · Search a host from the rail and see alert noise: TimeoutError: locator.click: Timeout 2500ms exceeded.
- desktop · compliance · Export evidence with history: not visible: [data-testid='export-history']:has-text('HIPAA · Last 12 months')
- desktop · finance · See plan and invoices: not visible: [data-testid='plan']:has-text('Practice')
- desktop · msp_account_mgr · Generate a white-labelled QBR for Ridgeline: not visible: [data-testid='qbr-preview']:has-text('Ridgeline Machining')
- phone · office_mgr · Notifications open a real panel: not visible: #pop [data-testid='notifications']:has-text('reception@')
- phone · it_mgr · Search a host from the rail and see alert noise: TimeoutError: locator.click: Timeout 2500ms exceeded.
- phone · msp_tech · Switch to Harbor Auto and every tab follows: TimeoutError: locator.click: Timeout 2500ms exceeded.
- phone · msp_tech · Harbor incidents, compliance and insurance are Harbor's: TimeoutError: locator.click: Timeout 2500ms exceeded.
- phone · msp_tech · Open a queue item lands on that client's incident: TimeoutError: locator.click: Timeout 2500ms exceeded.
- phone · compliance · Export evidence with history: not visible: [data-testid='export-history']:has-text('HIPAA · Last 12 months')
- phone · finance · See plan and invoices: not visible: [data-testid='plan']:has-text('Practice')
- phone · msp_account_mgr · Generate a white-labelled QBR for Ridgeline: TimeoutError: locator.click: Timeout 2500ms exceeded.
