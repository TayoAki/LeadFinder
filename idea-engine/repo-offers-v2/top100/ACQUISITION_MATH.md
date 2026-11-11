# Which offer is easiest to win customers for? (the math)

Same assumptions for every offer; only the market data changes. Script: `acquisition_math.py`.

## Assumptions (identical for all six)

| Step | Rate | Why |
|---|---|---|
| Searchers of "<competitor> **alternative**" who reach our page | 20% | Achievable with a top paid ad and/or a ranking comparison page |
| Searchers of "<competitor> **pricing**" who reach our page | 5% | Most are checking the incumbent, not shopping |
| Page visitor → demo or trial | 5% | Typical B2B landing page |
| Demo → paying customer | 25% | Typical SMB close rate |
| Outbound | 1,000 contacts/mo × 1.5% positive reply × 20% close = **3 customers/mo** | The same effort for every offer |
| Annual churn of the incumbent's customers | 20% | Midpoint of published SMB SaaS logo churn (10–31%) |

## Results

| Offer | Price/mo | "Alternative" searches/mo | "Pricing" searches/mo | Customers/mo from search | **Months to 100 customers** | **Months to 10k dollars MRR** | Paid-search cost per customer | Payback (months) | Businesses leaving the incumbent each month | Can we list the incumbent's users? |
|---|---|---|---|---|---|---|---|---|---|---|
| Zendesk alternative, AI at a flat price (Chatwoot) | 599 | 2,480 | 2,190 | 7.57 | **9.5** | **1.6** | $5,339 | 15.6 | 1,333 | Yes: Zendesk shows in site code and help-centre subdomains (technographic lists) |
| Managed SOC for SMBs (Wazuh) | 999 | 0 | 430 | 0.27 | **30.6** | **3.1** | $2,978 | 8.5 | 5,000 | No: security tools are not visible from outside |
| Private AI for law firms (AnythingLLM) | 999 | 0 | 140 | 0.09 | **32.4** | **3.2** | $1,166 | 1.9 | 22 | Yes: law firm directories (but Harvey customers are big firms, not our buyer) |
| Zero-trust network (NetBird) | 199 | 1,050 | 2,300 | 4.06 | **14.2** | **7.1** | $873 | 6.3 | 667 | No |
| Managed password vault (Vaultwarden) | 99 | 800 | 4,480 | 4.8 | **12.8** | **13.0** | $393 | 5.7 | 3,333 | Partly: not visible on websites |
| Commission-free restaurant ordering (TastyIgniter) | 199 | 20 | 180 | 0.16 | **31.6** | **15.9** | $1,206 | 8.1 | 167 | Yes: Google Maps + delivery-app listings |

Incumbent customer counts: Zendesk ~80k accounts (company figure via CX write-up; other estimates 170-183k); 1Password 200k+ business customers (company, Oct 2026); Owner.com ~10k restaurants (profile site); real pool is restaurants on DoorDash/Uber Eats (606k US restaurants); Huntress ~300k protected orgs (Channel Insider, Oct 2026), sold through MSPs; Tailscale ~40k paid business customers (BetaKit, Jul 2026); Harvey ~1,000-1,500 customers (Harvey blog / press, 2026).

## Sensitivity: tripling outbound to 3,000 contacts a month

| Offer | Months to 100 customers |
|---|---|
| Zendesk alternative, AI at a flat price (Chatwoot) | 6.0 |
| Managed password vault (Vaultwarden) | 7.2 |
| Zero-trust network (NetBird) | 7.7 |
| Managed SOC for SMBs (Wazuh) | 10.8 |
| Commission-free restaurant ordering (TastyIgniter) | 10.9 |
| Private AI for law firms (AnythingLLM) | 11.0 |

## What the math says

1. **The Zendesk alternative is easiest to win customers for.**
   - **Most switch-intent searches:** 2,480 a month for "alternative" terms, rising 225%.
   - **Largest flow of businesses leaving the incumbent:** ~1,300 a month among products whose users we can identify.
   - **Users are identifiable:** Zendesk shows in a site's code and help-centre address, so a lead list can be built from current users.
   - **Highest price:** it reaches 10k dollars MRR in about 2 months; the restaurant offer takes about 16.
2. **Paid search is expensive for that offer:** about 5,300 dollars per customer, a 16-month payback. Win the searches with a ranking "Zendesk alternative" comparison page and outbound to known Zendesk users rather than paid ads.
3. **Restaurant ordering and law-firm AI are outbound-only businesses.** Almost nobody searches for a switch, so growth equals outbound volume (about 32 months to 100 customers at 1,000 contacts a month). They're winnable, just slower and more manual.
4. **The password vault and zero-trust have cheap clicks and fast payback, but low prices.** They need many more customers, and you can't see from outside who uses 1Password or Tailscale.

**Caveat:** every conversion rate above is a planning assumption, not a measurement. The first real smoke test (a comparison page plus 500 outbound emails) will replace them with real numbers.
