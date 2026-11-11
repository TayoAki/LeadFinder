"""Confidence per row = how solid the evidence behind its score is (not how good the idea is).
Three parts, each 0-2, total 0-6: High 5-6, Medium 3-4, Low 0-2.
- revenue: 2 = filing/company-reported, same outcome, 2024+; 1 = third-party estimate, or older than 2024; 0 = missing, whole-company/bundle figure.
- buyers: 2 = Census count for the exact industry; 1 = Census employee-size band (generic SMB) or a sourced agent count; 0 = missing or rough proxy.
- licence: 2 = GitHub-detected OSI licence; 1 = licence read by hand (not re-verified this run is 0).
"""
import json, re
d = json.load(open('ranked.json'))
census = json.load(open('buyers_census.json'))
lic = json.load(open('licence_overrides.json'))
def yr(s):
    m = re.search(r'(20\d\d)', str(s or ''))
    return int(m.group(1)) if m else None
for part in ('ranked', 'excluded'):
    for r in d[part]:
        i = str(r['id'])
        rv = 0
        if r['revenue_musd'] and r['revenue_scope'] == 'same outcome':
            y = yr(r['revenue_year'])
            rv = 2 if r['revenue_basis'] in ('reported', 'filing') and y and y >= 2024 else 1
        if i in census:
            b = 1 if 'band' in census[i]['basis'] or 'employees (all industries)' in census[i]['basis'] else 2
        else:
            b = 1 if r['us_buyers'] and r.get('us_buyers_source') else 0
        if i in lic:
            l = 0 if ('unverified' in lic[i]['licence'] or 'not re-verified' in lic[i]['why'] or 'not verified' in lic[i]['why']) else 1
        else:
            l = 2
        t = rv + b + l
        r['conf_parts'] = {'revenue': rv, 'buyers': b, 'licence': l}
        r['confidence'] = 'High' if t >= 5 else 'Medium' if t >= 3 else 'Low'
json.dump(d, open('ranked.json', 'w'), indent=1)
from collections import Counter
print(Counter(r['confidence'] for r in d['ranked']))
