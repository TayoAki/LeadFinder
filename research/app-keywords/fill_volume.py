#!/usr/bin/env python3
"""Clean the keyword lists in app-keywords.json and fetch Google volume for them.
DataForSEO rejects a whole batch (status 40501) if any keyword has characters like & or '. Keyword ideas also bring
autocomplete junk ("closet app" -> "closest applebee's"), so a keyword must share a word with one of its app's seeds."""
import json, os, re, subprocess
H = os.path.dirname(os.path.abspath(__file__)); TREG = os.path.expanduser('~/.local/bin/treg')
d = json.load(open(f'{H}/app-keywords.json'))
import importlib.util
spec = importlib.util.spec_from_file_location('kw', f'{H}/kw_research.py')
src = open(f'{H}/kw_research.py').read(); APPS = eval(src[src.index('APPS = {') + 7: src.index('\n}\n', src.index('APPS = {')) + 2])
STOP = {'app', 'apps', 'the', 'a', 'to', 'for', 'of', 'free', 'best', 'that', 'you', 'makes', 'get', 'up', 'what', 'today', 'and'}
def clean(k): return re.sub(r"\s+", ' ', re.sub(r"[^a-z0-9\- ]", ' ', k.lower())).strip()
spent = 0; allk = set()
for app, a in d['apps'].items():
    seeds = APPS[app][1]; words = {w for s in seeds for w in clean(s).split() if w not in STOP}
    kept = []
    for k in a['keywords']:
        c = clean(k['keyword'])
        if c and len(c.split()) <= 10 and (set(c.split()) & words) and c not in [x['keyword'] for x in kept]: kept.append(dict(keyword=c))
    a['keywords'] = kept; allk |= {k['keyword'] for k in kept}
allk = sorted(allk); vol = {}
r = subprocess.run([TREG, '--json', 'call', 'treg.google.keywords.volume', '--method', 'POST', '--header', 'X-Treg-Route-Prefer: dataforseo', '--header', 'X-Treg-Route-Max-Cost: 0.2', '--data', json.dumps({'keywords': allk})], capture_output=True, text=True, timeout=300)
j = json.loads(r.stdout); res = j.get('result', j); spent += ((res.get('_treg') or {}).get('charged_micro') or 0) / 1e6
for row in (res.get('output') or {}).get('rows') or []:
    ms = sorted(row.get('monthly_searches') or [], key=lambda m: (m['year'], m['month']))
    early, late = [m['search_volume'] or 0 for m in ms[:3]], [m['search_volume'] or 0 for m in ms[-3:]]
    trend = round((sum(late) - sum(early)) / sum(early) * 100) if sum(early) > 0 and len(ms) >= 6 else None
    vol[row['keyword'].lower()] = dict(volume=row.get('search_volume') or 0, cpc=row.get('cpc'), competition=row.get('competition'), comp_index=row.get('competition_index'), trend_12m_pct=trend)
if not vol: print('no rows:', json.dumps(res.get('_treg'))[:400])
for a in d['apps'].values():
    a['keywords'] = sorted([dict(keyword=k['keyword'], **vol.get(k['keyword'], dict(volume=None, cpc=None, competition=None, comp_index=None, trend_12m_pct=None))) for k in a['keywords']], key=lambda k: -(k['volume'] or 0))
d['spend_usd'] = round(d['spend_usd'] + spent, 4); json.dump(d, open(f'{H}/app-keywords.json', 'w'), indent=1)
print(len(allk), 'keywords,', len(vol), 'with volume, +$%.3f' % spent)
