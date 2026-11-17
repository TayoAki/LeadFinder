#!/usr/bin/env python3
"""Across a set of brands' tag-overlap runs: which other accounts their fans tag in posts that DON'T tag the brand.
For each account: in how many brands' fan bases it shows up (>=3 people), total people, median lift, and how many
brands it is an outlier for. Excludes the input brands themselves and their own sub-accounts. Totals only.
    python3 also_likes.py <ig dir> <handle>... > ALSO-LIKES.md"""
import json, os, sys, statistics
D, H = sys.argv[1], sys.argv[2:]
data = {h: json.load(open(os.path.join(D, h, 'ig-tags.json'))) for h in H if os.path.exists(os.path.join(D, h, 'ig-tags.json'))}
own = {h.replace('official', '').replace('nyc', '').replace('player', '')[:6] for h in data}
agg = {}
for h, d in data.items():
    for a in d['accounts']:
        k = a['handle']
        if k in data or any(k.startswith(o) for o in own if len(o) >= 4): continue
        if a.get('kind') == 'person' and (a.get('followers') or 0) < 100000: continue
        if a['tagged_elsewhere'] < 3: continue
        x = agg.setdefault(k, dict(name=(a.get('name') or k).strip()[:30], followers=a.get('followers'), brands=[], people=0, lifts=[], outlier_for=[]))
        x['brands'].append(h); x['people'] += a['tagged_elsewhere']
        if a.get('lift') is not None: x['lifts'].append(a['lift'])
        if a.get('outlier'): x['outlier_for'].append(h)
rows = [dict(handle=k, **v, med_lift=round(statistics.median(v['lifts']), 2) if v['lifts'] else None) for k, v in agg.items()]
n = len(data)
broad = sorted([r for r in rows if len(r['brands']) >= 3], key=lambda r: (-len(r['brands']), -r['people']))
strong = sorted([r for r in rows if len(r['brands']) >= 3 and (r['med_lift'] or 0) >= 1.5], key=lambda r: -((r['med_lift'] or 0) * len(r['brands'])))
out = [f'# If someone likes these {n} brands, what else do they like?', '',
       f"Brands: {', '.join('@' + h for h in data)}.",
       'Counted in fans\' posts that **don\'t** tag the brand (their own taste), distinct people, min 3 per brand. Lift 1.0 = as often as the account\'s size predicts.', '',
       f'## Liked strongly across many of the {n} (in 3+ fan bases, median lift ≥ 1.5)', '',
       '| Account | Fan bases (of %d) | People | Median lift | Outlier for |' % n, '|---|---|---|---|---|']
out += [f"| {r['name']} (@{r['handle']}) | {len(r['brands'])} | {r['people']} | {r['med_lift']} | {', '.join('@' + b for b in r['outlier_for']) or '—'} |" for r in strong[:35]]
out += ['', f'## Most widespread (in the most fan bases, any lift)', '', '| Account | Fan bases | People | Median lift |', '|---|---|---|---|']
out += [f"| {r['name']} (@{r['handle']}) | {len(r['brands'])}: {', '.join(r['brands'])} | {r['people']} | {r['med_lift']} |" for r in broad[:30]]
print('\n'.join(out))
