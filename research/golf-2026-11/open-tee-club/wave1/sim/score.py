#!/usr/bin/env python3
"""Score the SIMULATED Wave-1 feed panel (panel-1..4.json): per-post rates with persona-bootstrap 90% CIs,
order check (feed A vs B), anchor check (do the 3 real winners rank high?), and per-segment saves.
SIMULATED, not demand evidence."""
import json, glob, os, random
import numpy as np
H = os.path.dirname(os.path.abspath(__file__))
key = json.load(open(f'{H}/key.json'))
dec = {o: {p['post']: p['_code'] for p in json.load(open(f'{H}/feed-{o}.json'))} for o in 'AB'}
order_of = {'1': 'A', '2': 'A', '3': 'B', '4': 'B'}
rows, seg = [], {}
for f in sorted(glob.glob(f'{H}/panel-*.json')):
    n = f.split('-')[-1][0]; d = json.load(open(f))
    for p in d['personas']: seg[p['id']] = p['segment']
    for r in d['reactions']:
        r = dict(r); r['code'] = dec[order_of[n]][r['post']]; r['order'] = order_of[n]; rows.append(r)
M = ['stop', 'finish', 'save', 'share', 'comment', 'profile', 'ad']
codes = sorted(key); people = sorted({r['persona'] for r in rows})
idx = {(r['persona'], r['code']): r for r in rows}
def rate(code, m, ppl): v = [idx[(p, code)][m] for p in ppl if (p, code) in idx]; return float(np.mean(v)) if v else float('nan')
rng = random.Random(1); boots = [[rng.choice(people) for _ in people] for _ in range(1000)]
out = {}
for c in codes:
    o = {'label': key[c]['label']}
    for m in M + ['cap_interest']:
        est = rate(c, m, people); bs = sorted(rate(c, m, b) for b in boots)
        o[m] = [round(est, 3), round(bs[50], 3), round(bs[949], 3)]
    o['save_A'] = round(rate(c, 'save', [p for p in people if order_of[p[1]] == 'A']), 3)
    o['save_B'] = round(rate(c, 'save', [p for p in people if order_of[p[1]] == 'B']), 3)
    out[c] = o
segs = sorted(set(seg.values()))
by_seg = {c: {s: round(rate(c, 'save', [p for p in people if seg[p] == s]), 2) for s in segs} for c in codes}
reasons = {c: [idx[(p, c)]['reason'] for p in people if (p, c) in idx and idx[(p, c)]['save']][:6] for c in codes}
json.dump({'note': 'SIMULATED, not demand evidence', 'n_personas': len(people), 'posts': out, 'save_by_segment': by_seg, 'save_reasons': reasons}, open(f'{H}/results.json', 'w'), indent=1)
print(f'{len(people)} personas, {len(rows)} reactions  (SIMULATED)')
print(f"{'post':38} {'stop':>5} {'finish':>6} {'save [90% CI]':>18} {'share':>6} {'comm':>5} {'prof':>5} {'ad':>5} {'cap':>5} {'sA':>5} {'sB':>5}")
for c in sorted(codes, key=lambda c: -out[c]['save'][0]):
    o = out[c]; s = o['save']
    print(f"{o['label'][:38]:38} {o['stop'][0]:5.2f} {o['finish'][0]:6.2f} {s[0]:5.2f} [{s[1]:.2f}-{s[2]:.2f}] {o['share'][0]:6.2f} {o['comment'][0]:5.2f} {o['profile'][0]:5.2f} {o['ad'][0]:5.2f} {o['cap_interest'][0]:5.2f} {o['save_A']:5.2f} {o['save_B']:5.2f}")
