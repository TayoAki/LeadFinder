#!/usr/bin/env python3
"""Keyword research for every factory app (treg).
  1. Google keyword ideas for each seed (treg.google.keywords.ideas, cheapest provider ~$0.001).
  2. One bulk Google volume call for all keywords (dataforseo, $0.09 per 1,000): US volume, CPC, competition, 12 months.
  3. App Store search per main term (litescrape, $0.00015): who ranks and how many ratings they have (difficulty proxy).
Apple's own search popularity needs a Search Ads account, so App Store volume is NOT measured here.
    python3 kw_research.py <out dir>
"""
import json, os, statistics, subprocess, sys, time
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.dirname(os.path.abspath(__file__)); os.makedirs(OUT, exist_ok=True)
TREG = os.path.expanduser('~/.local/bin/treg'); spent = [0]

APPS = {
 'Tidemark': ('Peptide routine tracker', ['peptide tracker', 'peptide dosage calculator', 'glp-1 tracker', 'injection tracker'], ['peptide tracker', 'glp-1 tracker', 'injection tracker']),
 'Get Up': ('Alarm that needs a real-world task to stop', ['alarm clock that makes you get up', 'alarm app', 'mission alarm', 'hard alarm clock'], ['alarm clock wake up', 'mission alarm', 'photo alarm']),
 'Grappler Fig': ('Boxing coach, no hardware', ['boxing workout app', 'boxing training', 'shadow boxing', 'boxing timer'], ['boxing workout', 'shadow boxing', 'boxing timer']),
 'Parcel & Co': ('Shopping app with a mode per category', ['shopping app', 'online shopping app', 'beauty shopping app', 'home decor shopping app'], ['shopping', 'beauty shopping', 'home decor']),
 'Ember Fox': ('Drinking-moderation tracker with a game avatar', ['drinking tracker', 'alcohol tracker', 'quit drinking app', 'sober app'], ['drink tracker', 'alcohol tracker', 'sober']),
 'Stella Sessions': ('Narrated goal visualization', ['guided visualization', 'manifestation app', 'visualization meditation', 'affirmation app'], ['visualization', 'manifestation', 'guided meditation']),
 'Spotter Pair': ('Two partners, AI plans, shared score', ['workout buddy app', 'partner workout', 'couples workout app', 'ai workout plan'], ['workout buddy', 'partner workout', 'couples fitness']),
 'Verse by Verse': ('One-verse-at-a-time Bible reader', ['bible app', 'bible reading plan', 'verse of the day', 'read the bible'], ['bible', 'bible reading', 'verse of the day']),
 'Sippo': ('Water-intake tracker', ['water tracker app', 'water reminder', 'drink water app', 'hydration tracker'], ['water tracker', 'water reminder', 'hydration']),
 'HandsUp ASL': ('Learn ASL in daily lessons', ['learn asl', 'sign language app', 'asl app', 'fingerspelling'], ['asl', 'sign language', 'learn sign language']),
 'Five Dinners': ('Plans five dinners a week', ['meal planner app', 'weekly meal plan', 'dinner ideas', 'meal planning'], ['meal planner', 'dinner ideas', 'meal plan']),
 'NightRhythm': ('Sleep tracker', ['sleep tracker app', 'sleep tracker', 'sleep cycle', 'snore tracker'], ['sleep tracker', 'sleep cycle', 'sleep']),
 'KanjiDojo': ('Kanji flashcards, JLPT N5-N1', ['learn kanji', 'kanji app', 'jlpt n5', 'kanji flashcards'], ['kanji', 'jlpt', 'learn japanese']),
 'One Good Find': ('One vetted handmade product a day', ['handmade gifts', 'handmade products', 'unique gifts', 'small business gifts'], ['handmade', 'gift ideas', 'handmade gifts']),
 'Closetcast': ('AI stylist from your own closet', ['ai stylist', 'outfit app', 'what to wear today', 'closet app'], ['outfit planner', 'ai stylist', 'closet organizer']),
}

def call(args, timeout=180):
    for attempt in range(3):
        r = subprocess.run([TREG, '--json', 'call', *args], capture_output=True, text=True, timeout=timeout)
        try:
            j = json.loads(r.stdout); res = j.get('result', j)
            spent[0] += ((res.get('_treg') or j.get('_treg') or {}).get('charged_micro') or 0) / 1e6
            return res.get('output', res)
        except Exception:
            time.sleep(2 + attempt * 3)
    return {}

# 1. ideas
per_app = {}
for app, (_, seeds, _) in APPS.items():
    kws = list(seeds)
    for s in seeds:
        o = call(['treg.google.keywords.ideas', '--method', 'POST', '--header', 'X-Treg-Route-Max-Cost: 0.03', '--data', json.dumps({'keyword': s})])
        for k in (o.get('keywords') or []):
            v = (k.get('value') or k.get('keyword') or '').strip().lower()
            if v and v not in kws and 'reddit' not in v and len(v) < 60: kws.append(v)
    per_app[app] = kws[:70]; print(app, len(per_app[app]), 'keywords', flush=True)

# 2. volume (one dataforseo call per 1,000)
allk = sorted({k for v in per_app.values() for k in v}); vol = {}
for i in range(0, len(allk), 1000):
    o = call(['treg.google.keywords.volume', '--method', 'POST', '--header', 'X-Treg-Route-Prefer: dataforseo', '--header', 'X-Treg-Route-Max-Cost: 0.2', '--data', json.dumps({'keywords': allk[i:i + 1000]})], timeout=300)
    for r in o.get('rows') or []:
        ms = sorted(r.get('monthly_searches') or [], key=lambda m: (m['year'], m['month']))
        early, late = [m['search_volume'] or 0 for m in ms[:3]], [m['search_volume'] or 0 for m in ms[-3:]]
        trend = round((sum(late) - sum(early)) / sum(early) * 100) if sum(early) > 0 and len(ms) >= 6 else None
        vol[r['keyword'].lower()] = dict(volume=r.get('search_volume') or 0, cpc=r.get('cpc'), competition=r.get('competition'), comp_index=r.get('competition_index'), trend_12m_pct=trend)
print('volumes for', len(vol), 'of', len(allk), flush=True)

# 3. App Store competition
store = {}
for app, (_, _, terms) in APPS.items():
    for t in terms:
        o = call(['litescrape.app_store.search.apps', '--query', f'term={t}', '--query', 'num=10'])
        apps = []
        for a in (o.get('organic_results') or [])[:10]:
            rc = next((x.get('count') for x in (a.get('rating') or []) if x.get('type') == 'All Times'), 0) or 0
            rt = next((x.get('rating') for x in (a.get('rating') or []) if x.get('type') == 'All Times'), None)
            apps.append(dict(title=a.get('title'), ratings=rc, stars=rt, released=(a.get('release_date') or '')[:10], updated=(a.get('latest_version_release_date') or '')[:10]))
        top5 = [x['ratings'] for x in apps[:5]]
        store[(app, t)] = dict(term=t, apps=apps, median_top5_ratings=int(statistics.median(top5)) if top5 else None,
                               weak_in_top5=sum(1 for x in top5 if x < 1000), exact_title_in_top5=sum(1 for x in apps[:5] if t.lower() in (x['title'] or '').lower()))

report = {}
for app, (desc, seeds, terms) in APPS.items():
    rows = [dict(keyword=k, **vol.get(k, dict(volume=None, cpc=None, competition=None, comp_index=None, trend_12m_pct=None))) for k in per_app[app]]
    rows.sort(key=lambda r: -(r['volume'] or 0))
    report[app] = dict(what=desc, keywords=rows, app_store=[store[(app, t)] for t in terms])
json.dump(dict(built=time.strftime('%Y-%m-%d'), country='US', spend_usd=round(spent[0], 4), apps=report), open(os.path.join(OUT, 'app-keywords.json'), 'w'), indent=1)
print('spend ~$%.3f' % spent[0])
