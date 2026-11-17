#!/usr/bin/env python3
"""Cross-brand summary of Instagram tag-overlap runs (fan-overlap skill, ig_tags.mjs).
    python3 summarize.py <ig dir> <handle>... > SUMMARY.md
Per brand: coverage, outliers (lift>=3 or z>=2, >=3 people), most worn-with, top hashtags.
Then: accounts that are outliers for several brands (shared taste clusters). Totals only; no fan usernames exist in the input."""
import json, os, sys
D, handles = sys.argv[1], sys.argv[2:]
data = {}
for h in handles:
    p = os.path.join(D, h, 'ig-tags.json')
    if os.path.exists(p): data[h] = json.load(open(p))
def nm(a): return (a.get('name') or a['handle']).strip()[:28]
out = ['# What fans of each brand tag on Instagram', '',
       'Method: posts that tag each brand → those posters\' **other** posts (not tagging the brand) → which accounts they tag, counted as distinct people (min 3).',
       '**Lift** = how much more they tag an account than its follower count predicts (1.0 = typical). Outlier = lift ≥ 3 or robust z ≥ 2.',
       'Totals only; no fan usernames are stored. Feeds read per brand are capped by budget, so smaller samples are noisier.', '',
       '## Coverage', '', '| Brand | Posts tagging it | Posters | Shops | Fan feeds read |', '|---|---|---|---|---|']
for h, d in data.items():
    c = d['coverage']; out.append(f"| @{h} | {c['posts_tagging_brand']:,} | {c['posters']:,} | {c.get('shop_posters', 0):,} | {c['own_feeds_read']:,} |")
cross = {}
for h, d in data.items():
    acc = [a for a in d['accounts'] if a['handle'] != h and not (a.get('kind') == 'person' and (a.get('followers') or 0) < 100000)]  # brands, not small personal accounts
    outl = sorted([a for a in acc if a.get('outlier') and a['tagged_elsewhere'] >= 3], key=lambda a: -(a['tagged_elsewhere'] * (a.get('lift') or 0)))
    worn = sorted(acc, key=lambda a: -a['tagged_with_brand'])[:8]
    tags = d['hashtags'].get('with_brand') or []
    tags = [t if isinstance(t, str) else f"{t[0]} ({t[1]})" if isinstance(t, list) else f"#{t.get('tag')} ({t.get('n') or t.get('count')})" for t in tags[:10]]
    c = d['coverage']
    out += ['', f"## @{h}", '', f"{c['posts_tagging_brand']:,} posts by {c['posters']:,} accounts; {c['own_feeds_read']:,} fan feeds read.", '',
            '**Outliers** (people, lift): ' + (', '.join(f"{nm(a)} ({a['tagged_elsewhere']}, {a['lift']})" for a in outl[:14]) or 'none at this sample size'), '',
            '**Most tagged in the same post:** ' + ', '.join(f"{nm(a)} ({a['tagged_with_brand']})" for a in worn), '',
            '**Hashtags with the brand:** ' + ', '.join(tags)]
    for a in outl: cross.setdefault(a['handle'], dict(name=nm(a), brands=[]))['brands'].append(h)
shared = sorted([(k, v) for k, v in cross.items() if len(v['brands']) >= 2], key=lambda kv: -len(kv[1]['brands']))
out += ['', '## Accounts that are outliers for 2+ brands (shared taste)', '', '| Account | Outlier for |', '|---|---|']
out += [f"| {v['name']} (@{k}) | {', '.join('@' + b for b in v['brands'])} |" for k, v in shared[:40]]
spend = sum(d.get('spend_usd') or 0 for d in data.values())
out += ['', f'Brands: {len(data)}. Spend: ~${spend:.2f} (treg).']
print('\n'.join(out))
