#!/usr/bin/env python3
"""Turn app-keywords.json into app-keywords.md: per app, top Google keywords, best targets, rising terms, App Store difficulty."""
import json, os
H = os.path.dirname(os.path.abspath(__file__)); d = json.load(open(f'{H}/app-keywords.json'))
def f(n): return '—' if n is None else f'{n:,}'
def money(c): return '—' if c is None else f'${c:.2f}'
def tr(t): return '—' if t is None else (f'+{t}%' if t > 0 else f'{t}%')
def difficulty(s):
    m = s['median_top5_ratings'] or 0
    return 'Very hard' if m > 100000 else 'Hard' if m > 10000 else 'Medium' if m > 1000 else 'Open'
L = [f"# App keyword research ({d['built']}, US)", '',
     'Sources:',
     '- **Google:** monthly US search volume, CPC, ad competition and 12-month trend (DataForSEO via treg). Keyword ideas came from 4 seeds per app.',
     "- **App Store:** the top 10 apps ranking for each main term and their all-time rating counts (litescrape via treg). Apple's own search popularity score needs an Apple Search Ads account, so **App Store search volume is not measured**; rating counts of the incumbents stand in for how hard a term is to rank for.",
     '',
     'How to read it:',
     '- **Trend** compares the last 3 months with the first 3 of the 12. Small volumes swing a lot.',
     "- **Competition** is Google Ads advertiser competition, not SEO difficulty.",
     '- **App Store difficulty**, from the median rating count of the top 5 apps: Open < 1k, Medium 1k–10k, Hard 10k–100k, Very hard > 100k.',
     '',
     f"Spend: ~${d['spend_usd']:.2f}.", '', '## Summary', '',
     '| App | Biggest keyword (volume) | Best target | Fastest riser (≥100/mo) | Easiest App Store term |', '|---|---|---|---|---|']
body = []
for app, a in d['apps'].items():
    ks = [k for k in a['keywords'] if k['volume'] is not None]
    top = ks[0] if ks else None
    targets = sorted([k for k in ks if (k['volume'] or 0) >= 100 and k['competition'] in ('LOW', 'MEDIUM', None)], key=lambda k: -((k['volume'] or 0) * (1 + max(-.5, min(1, (k['trend_12m_pct'] or 0) / 100)))))
    rising = sorted([k for k in ks if (k['volume'] or 0) >= 100 and k['trend_12m_pct'] is not None], key=lambda k: -k['trend_12m_pct'])
    easiest = min(a['app_store'], key=lambda s: s['median_top5_ratings'] if s['median_top5_ratings'] is not None else 1e12)
    L.append(f"| **{app}** | {top['keyword'] if top else '—'} ({f(top['volume']) if top else '—'}) | {targets[0]['keyword'] + ' (' + f(targets[0]['volume']) + ')' if targets else '—'} | {rising[0]['keyword'] + ' (' + tr(rising[0]['trend_12m_pct']) + ')' if rising else '—'} | {easiest['term']} ({difficulty(easiest)}) |")
    body += ['', f"## {app}: {a['what']}", '', '**Top keywords by volume**', '', '| Keyword | Volume/mo | CPC | Competition | Trend 12m |', '|---|---|---|---|---|']
    body += [f"| {k['keyword']} | {f(k['volume'])} | {money(k['cpc'])} | {k['competition'] or '—'} | {tr(k['trend_12m_pct'])} |" for k in ks[:15]]
    if targets: body += ['', '**Best targets** (≥100/mo, low or medium ad competition): ' + ', '.join(f"{k['keyword']} ({f(k['volume'])}, {tr(k['trend_12m_pct'])})" for k in targets[:8])]
    if rising: body += ['', '**Rising** (≥100/mo): ' + ', '.join(f"{k['keyword']} ({tr(k['trend_12m_pct'])})" for k in rising[:6] if k['trend_12m_pct'] > 0) or 'none rising']
    body += ['', '**App Store** (top 5 for the term)', '', '| Term | Difficulty | Median ratings, top 5 | Top-5 apps under 1k ratings | Leaders |', '|---|---|---|---|---|']
    for s in a['app_store']:
        lead = '; '.join(f"{x['title'][:32]} ({f(x['ratings'])})" for x in s['apps'][:3])
        body.append(f"| {s['term']} | {difficulty(s)} | {f(s['median_top5_ratings'])} | {s['weak_in_top5']} | {lead} |")
open(f'{H}/app-keywords.md', 'w').write('\n'.join(L + body) + '\n'); print('wrote app-keywords.md')
