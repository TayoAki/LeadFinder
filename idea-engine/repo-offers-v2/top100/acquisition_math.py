"""Which finalist is easiest to win customers for? Same assumptions for every offer; only the market data changes.

Customers/month from SEARCH  = alt_searches * P_CLICK_ALT * LP_CONV * CLOSE + pricing_searches * P_CLICK_PRICE * LP_CONV * CLOSE
CAC from paid search         = avg CPC / (LP_CONV * CLOSE)
SWITCHING POOL / month       = incumbent customers * ANNUAL_CHURN / 12      (businesses leaving the incumbent each month)
Customers/month from OUTBOUND = OUTBOUND_CONTACTS * POS_REPLY * CLOSE_OUT    (same effort for every offer)
Months to 100 customers      = 100 / (search + outbound)
Payback months (search CAC)  = CAC / (price * gross margin)
"""
import json
P_CLICK_ALT, P_CLICK_PRICE = 0.20, 0.05   # share of searchers we can get to our page (paid + organic)
LP_CONV, CLOSE = 0.05, 0.25                # landing page -> demo/trial, demo -> paying
ANNUAL_CHURN = 0.20                        # SMB SaaS logo churn midpoint (published range 10-31%)
OUTBOUND_CONTACTS, POS_REPLY, CLOSE_OUT = 1000, 0.015, 0.20

F = [  # name, price/mo, margin, alt terms (vol, cpc), pricing terms (vol, cpc), incumbent base, base source, can we list current users?
 dict(name='Zendesk alternative, AI at a flat price (Chatwoot)', price=599, margin=0.57,
      alt=[(1600,118.95),(880,66.86)], pricing=[(1600,29.23),(590,26.63)],
      base=80000, base_note='Zendesk ~80k accounts (company figure via CX write-up; other estimates 170-183k)', listable='Yes: Zendesk shows in site code and help-centre subdomains (technographic lists)'),
 dict(name='Managed password vault (Vaultwarden)', price=99, margin=0.70,
      alt=[(480,12.41),(320,24.1)], pricing=[(3600,2.66),(880,3.06)],
      base=200000, base_note='1Password 200k+ business customers (company, Oct 2026)', listable='Partly: not visible on websites'),
 dict(name='Commission-free restaurant ordering (TastyIgniter)', price=199, margin=0.75,
      alt=[(20,None)], pricing=[(110,10.25),(70,22.65)],
      base=10000, base_note='Owner.com ~10k restaurants (profile site); real pool is restaurants on DoorDash/Uber Eats (606k US restaurants)', listable='Yes: Google Maps + delivery-app listings'),
 dict(name='Managed SOC for SMBs (Wazuh)', price=999, margin=0.35,
      alt=[], pricing=[(70,48.97),(320,28.86),(40,83.53)],
      base=300000, base_note='Huntress ~300k protected orgs (Channel Insider, Oct 2026), sold through MSPs', listable='No: security tools are not visible from outside'),
 dict(name='Zero-trust network (NetBird)', price=199, margin=0.70,
      alt=[(880,8.59),(140,59.03),(30,3.21)], pricing=[(1900,5.83),(260,28.6),(140,15.06)],
      base=40000, base_note='Tailscale ~40k paid business customers (BetaKit, Jul 2026)', listable='No'),
 dict(name='Private AI for law firms (AnythingLLM)', price=999, margin=0.60,
      alt=[], pricing=[(140,14.57)],
      base=1300, base_note='Harvey ~1,000-1,500 customers (Harvey blog / press, 2026)', listable='Yes: law firm directories (but Harvey customers are big firms, not our buyer)'),
]
rows=[]
for f in F:
    alt=sum(v for v,_ in f['alt']); pr=sum(v for v,_ in f['pricing'])
    cpcs=[(v,c) for v,c in f['alt']+f['pricing'] if c]
    cpc=sum(v*c for v,c in cpcs)/sum(v for v,_ in cpcs) if cpcs else None
    search_cust = alt*P_CLICK_ALT*LP_CONV*CLOSE + pr*P_CLICK_PRICE*LP_CONV*CLOSE
    out_cust = OUTBOUND_CONTACTS*POS_REPLY*CLOSE_OUT
    cac = cpc/(LP_CONV*CLOSE) if cpc else None
    payback = cac/(f['price']*f['margin']) if cac else None
    switchers = f['base']*ANNUAL_CHURN/12
    m100 = 100/(search_cust+out_cust)
    mrr100 = 100*f['price']
    rows.append(dict(name=f['name'], price=f['price'], alt=alt, pricing=pr, wcpc=round(cpc,1) if cpc else None, search_cust=round(search_cust,2),
        out_cust=round(out_cust,1), months_to_100=round(m100,1), cac=round(cac) if cac else None, payback_mo=round(payback,1) if payback else None,
        switchers_mo=round(switchers), base_note=f['base_note'], listable=f['listable'], mrr_at_100=mrr100,
        months_to_10k_mrr=round(10000/f['price']/(search_cust+out_cust),1)))
json.dump(rows, open('acquisition_math.json','w'), indent=1)
for r in rows: print(r)
