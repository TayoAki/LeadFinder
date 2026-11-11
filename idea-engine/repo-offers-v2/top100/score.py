"""Score and rank the repo-based offers.

Inputs (same folder): candidates.tsv, repos_verified.json, market_[A-D].json, kwscan/evidence.json, licence_overrides.json
Output: ranked.json, ranked.tsv

Score = proof (0-3) + ceiling (0-3) + demand (0-3), with gates:
- licence must allow hosting the software for paying clients;
- repo not archived, pushed in the last 12 months;
- the "$100M test" passes only if a named incumbent earns >= 100M USD/yr for the same outcome.
"""
import csv, json, re, math, datetime, os

here = os.path.dirname(os.path.abspath(__file__))
P = lambda f: os.path.join(here, f)

cands = list(csv.DictReader(open(P('candidates.tsv')), delimiter='\t'))
repos = {str(r['id']): r for r in json.load(open(P('repos_verified.json')))}
market = {}
for part in 'ABCD':
    f = P(f'market_{part}.json')
    if os.path.exists(f):
        for m in json.load(open(f)):
            market[str(m['id'])] = m
kw = {k['keyword']: k for k in json.load(open(P('kwscan/evidence.json')))['keywords']}
census = json.load(open(P('buyers_census.json'))) if os.path.exists(P('buyers_census.json')) else {}
# Revenue figures that are a whole company, a bundle or bookings, not the offer's own slice: proof capped at 1.
WHOLE = {'16','119','85','87','100','113','74','68','27','45'}
# Row 1: use Owner.com (same product) instead of Toast's whole-company revenue.
REV_FIX = {'1': {'incumbent_company': 'Owner.com', 'revenue_musd': 100, 'revenue_year': '2026 (Jul)', 'revenue_basis': 'estimate', 'revenue_source': 'https://sacra.com/c/owner'}}
judg = json.load(open(P('judgement.json'))) if os.path.exists(P('judgement.json')) else {}
lic_over = json.load(open(P('licence_overrides.json'))) if os.path.exists(P('licence_overrides.json')) else {}

OK_LIC = {'MIT', 'Apache-2.0', 'BSD-2-Clause', 'BSD-3-Clause', 'AGPL-3.0', 'GPL-3.0', 'GPL-2.0', 'LGPL-3.0', 'MPL-2.0', 'ISC'}
today = datetime.date(2026, 11, 11)

def proof_score(rev):
    if rev is None: return 0
    if rev >= 1000: return 3
    if rev >= 300: return 2.5
    if rev >= 100: return 2
    if rev >= 30: return 1
    return 0.5

def ceiling(buyers, price):
    if not buyers: return None
    return buyers * price * 12 / 1e6  # USD millions if every US buyer paid

def ceiling_score(c):
    if c is None: return 0
    share = 100 / c  # share of US buyers needed for 100M/yr
    if share <= 0.05: return 3
    if share <= 0.10: return 2
    if share <= 0.25: return 1
    return 0

# One-word brands whose searches are mostly about something else; excluded from demand.
AMBIG = {'harvey','make','keeper','weave','apollo','front','box','square','class','circle','whale','motive','sanity','orion','rev','fathom','granular','primer','courier','harvest','toast','bonsai','boulevard','katana','monarch','buffer','guru','mews','notion','looker','slack','zoom','canvas medical','oclc','follett','datto','jira','figma','okta','rippling','gusto'} - {'notion','slack','zoom','jira','figma','okta','rippling','gusto','datto','looker'}
def demand(row):
    tot, cpcs, terms = 0, [], []
    for inc in row['incumbents'].split(';'):
        inc = re.sub(r'\s*\(.*?\)', '', inc).strip().lower()
        if inc in AMBIG: continue
        for t in (f'{inc} alternative', f'{inc} pricing'):
            k = kw.get(t)
            if k and k.get('volume'):
                tot += k['volume']; terms.append((t, k['volume'], k.get('cpc')))
                if k.get('cpc'): cpcs.append(k['cpc'])
    return tot, (max(cpcs) if cpcs else None), terms

def demand_score(v):
    if v >= 5000: return 3
    if v >= 1000: return 2
    if v >= 200: return 1
    return 0

rows = []
for c in cands:
    i = c['id']; r = repos.get(i, {}); m = dict(market.get(i, {})); m.update(REV_FIX.get(i, {}))
    lic = lic_over.get(i, {}).get('licence') or r.get('license')
    lic_ok = lic_over.get(i, {}).get('ok')
    if lic_ok is None:
        lic_ok = lic in OK_LIC
    pushed = r.get('pushed')
    stale = True
    if pushed:
        stale = (today - datetime.date.fromisoformat(pushed)).days > 365
    rev = m.get('revenue_musd')
    cen = census.get(i)
    buyers = cen['count'] if cen else m.get('us_buyers')
    buyers_basis = cen['basis'] if cen else ('agent: ' + str(m.get('us_buyers_note') or m.get('us_buyers_source') or 'none'))
    price = float(c['price_mo'])
    ceil = ceiling(buyers, price)
    vol, cpc, terms = demand(c)
    s_p, s_c, s_d = proof_score(rev), ceiling_score(ceil), demand_score(vol)
    if i in WHOLE: s_p = min(s_p, 1)
    j = judg.get(i, {'adj': 0, 'why': ''})
    gates = []
    if not lic_ok: gates.append(f'licence ({lic})')
    if r.get('archived'): gates.append('archived')
    elif stale: gates.append('stale repo')
    if 'error' in r: gates.append('repo not found')
    rows.append({
        'id': int(i), 'repo': r.get('name') or c['repo'], 'stars': r.get('stars'), 'licence': lic, 'pushed': pushed,
        'industry': c['industry'], 'offer': c['offer'], 'buyer': c['buyer'], 'price_mo': price,
        'incumbent': m.get('incumbent_company'), 'revenue_musd': rev, 'revenue_year': m.get('revenue_year'),
        'revenue_basis': m.get('revenue_basis'), 'revenue_source': m.get('revenue_source'),
        'us_buyers': buyers, 'us_buyers_basis': buyers_basis, 'us_buyers_source': None if cen else m.get('us_buyers_source'), 'revenue_scope': 'whole company/bundle' if i in WHOLE else 'same outcome',
        'ceiling_musd': round(ceil, 1) if ceil else None,
        'share_needed_pct': round(100 * 100 / ceil, 1) if ceil else None,
        'search_volume': vol, 'max_cpc': cpc, 'terms': terms,
        'passes_100m': bool(rev and rev >= 100 and i not in WHOLE and ceil and ceil >= 100),
        'score': s_p + s_c + s_d + j['adj'], 'adj': j['adj'], 'adj_why': j['why'], 'proof': s_p, 'ceil_s': s_c, 'demand_s': s_d,
        'gates': gates, 'note': (m.get('note') or '') + (' ' + lic_over.get(i, {}).get('why', '') if i in lic_over else ''),
    })

alive = [r for r in rows if not r['gates']]
dead = [r for r in rows if r['gates']]
alive.sort(key=lambda r: (-r['score'], -r['passes_100m'], -(r['search_volume'] or 0)))
for n, r in enumerate(alive, 1): r['rank'] = n
json.dump({'ranked': alive, 'excluded': dead}, open(P('ranked.json'), 'w'), indent=1)
with open(P('ranked.tsv'), 'w') as f:
    cols = ['rank', 'id', 'repo', 'stars', 'licence', 'industry', 'offer', 'buyer', 'price_mo', 'incumbent', 'revenue_musd', 'revenue_year', 'revenue_basis', 'us_buyers', 'ceiling_musd', 'share_needed_pct', 'search_volume', 'max_cpc', 'passes_100m', 'adj', 'score']
    f.write('\t'.join(cols) + '\n')
    for r in alive:
        f.write('\t'.join(str(r.get(c, '')) for c in cols) + '\n')
print(f'alive {len(alive)}, excluded {len(dead)}, pass 100M test {sum(r["passes_100m"] for r in alive)}')
