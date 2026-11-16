#!/usr/bin/env python3
"""Score the SIMULATED blind Denim Tears slogan panels (dt-panel-A/B.json): first-choice share, Borda (3/2/1),
would-wear, try-hard and borrowed flags, per order; model rank for comparison. Not demand evidence."""
import json, os
H = os.path.dirname(os.path.abspath(__file__))
R = os.environ.get('ROUND', ''); sl = json.load(open(f'{H}/dt-shortlist{R}.json')); src = sl['source']; S = list(src)
model = {r['slogan']: r['rank'] for r in json.load(open(f'{H}/results-denimtears.json'))['ranked']}
P = {o: json.load(open(f'{H}/dt{R}-panel-{o}.json'.replace('dt-r2-','dt-r2-')))['personas'] for o in 'AB'}
def tally(ps):
    t = {s: dict(first=0, borda=0, wear=0, tryhard=0, borrowed=0) for s in S}
    for p in ps:
        for i, s in enumerate(p.get('top3', [])[:3]):
            if s in t: t[s]['borda'] += 3 - i; t[s]['first'] += i == 0
        for k in ('wear', 'tryhard', 'borrowed'):
            for s in p.get(k, []):
                if s in t: t[s][k] += 1
    return t
A, B, ALL = tally(P['A']), tally(P['B']), tally(P['A'] + P['B']); n = len(P['A']) + len(P['B'])
none = sum(1 for p in P['A'] + P['B'] if not p.get('top3'))
rows = sorted(S, key=lambda s: -ALL[s]['borda'])
out = [dict(slogan=s, source=src[s], model_rank=model.get(s), **ALL[s], borda_A=A[s]['borda'], borda_B=B[s]['borda']) for s in rows]
json.dump(dict(label='SIMULATED - not demand evidence', personas=n, picked_nothing=none, rows=out), open(f'{H}/dt{R}-panel-results.json', 'w'), indent=1)
print(f'{n} personas; {none} picked nothing')
print(f"{'slogan':26} {'src':9} {'model#':>6} {'1st':>4} {'borda':>5} {'A':>4} {'B':>4} {'wear':>5} {'tryhd':>5} {'borrw':>5}")
for r in out: print(f"{r['slogan'][:26]:26} {r['source']:9} {str(r['model_rank']):>6} {r['first']:4} {r['borda']:5} {r['borda_A']:4} {r['borda_B']:4} {r['wear']:5} {r['tryhard']:5} {r['borrowed']:5}")
