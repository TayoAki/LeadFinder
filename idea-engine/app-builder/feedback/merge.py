"""Merge the group *.jsonl files, dedupe, and count separate users per theme / competitor / polarity.

Output: merged.json (deduped snippets) and counts.md (tables used to write the report).
Counting rule: a user (author_key, or url when the key is missing) counts once per theme+polarity,
across all competitors for the cross-competitor totals, and once per competitor in the per-competitor columns.
"""
import json, glob, os, re, collections

here = os.path.dirname(os.path.abspath(__file__))
THEMES = {
 'T1': 'What users love', 'T2': 'Complaints / deal breakers', 'T3': 'Feature requests', 'T4': 'Pricing and credits',
 'T5': 'Design quality', 'T6': 'Motion and polish', 'T7': 'Reliability', 'T8': 'Real-device preview / testing',
 'T9': 'Backend, auth, data', 'T10': 'In-app purchases / subscriptions', 'T11': 'Publishing to stores',
 'T12': 'Code ownership / export', 'T13': 'Iterating after first build', 'T14': 'Support and docs'}
SEV_RANK = {'dealbreaker': 3, 'major': 2, 'minor': 1}

rows, seen, bad = [], set(), 0
for f in sorted(glob.glob(os.path.join(here, '*.jsonl'))):
    for line in open(f):
        line = line.strip()
        if not line: continue
        try: r = json.loads(line)
        except Exception: bad += 1; continue
        q = re.sub(r'\s+', ' ', (r.get('quote') or '')).strip()
        if not q or not r.get('url'): bad += 1; continue
        key = (r['url'], q[:80].lower())
        if key in seen: continue
        seen.add(key)
        r['quote'] = q; r['group'] = os.path.basename(f)
        r['user'] = r.get('author_key') or r['url']
        rows.append(r)
json.dump(rows, open(os.path.join(here, 'merged.json'), 'w'), indent=1)

def users(sel):
    return len({r['user'] for r in sel})

out = [f'# Merged counts\n\nSnippets: {len(rows)} (dropped {bad} malformed or missing a quote or URL). '
       f'Unique users: {users(rows)}. Sources: ' + ', '.join(f'{k} {v}' for k, v in collections.Counter(r.get("source") for r in rows).most_common()) + '\n']
comps = sorted({r['competitor'] for r in rows})
out.append('## Sample by competitor\n\n| Competitor | Snippets | Users | Last 12 mo | Sources |\n|---|---|---|---|---|')
for c in comps:
    s = [r for r in rows if r['competitor'] == c]
    out.append(f"| {c} | {len(s)} | {users(s)} | {sum(1 for r in s if not r.get('older'))} | " + ', '.join(f'{k} {v}' for k, v in collections.Counter(r.get('source') for r in s).most_common()) + ' |')

for pol in ('complaint', 'love', 'request'):
    out.append(f'\n## {pol.title()}s: users per theme (cross-competitor)\n\n| Theme | Users | Dealbreaker users | Major | Competitors (users) |\n|---|---|---|---|---|')
    trows = []
    for t, name in THEMES.items():
        s = [r for r in rows if t in (r.get('themes') or []) and r.get('polarity') == pol]
        if not s: continue
        db = users([r for r in s if r.get('severity') == 'dealbreaker']); mj = users([r for r in s if r.get('severity') == 'major'])
        per = collections.Counter()
        for c in comps:
            n = users([r for r in s if r['competitor'] == c])
            if n: per[c] = n
        trows.append((users(s), db, f"| {t} {name} | {users(s)} | {db} | {mj} | " + ', '.join(f'{c} ({n})' for c, n in per.most_common()) + ' |'))
    out += [x[2] for x in sorted(trows, key=lambda x: (-x[0], -x[1]))]

out.append('\n## Theme × competitor (complaint users / love users)\n')
out.append('| Theme | ' + ' | '.join(comps) + ' |\n|' + '---|' * (len(comps) + 1))
for t, name in THEMES.items():
    cells = []
    for c in comps:
        s = [r for r in rows if r['competitor'] == c and t in (r.get('themes') or [])]
        cp = users([r for r in s if r.get('polarity') == 'complaint']); lv = users([r for r in s if r.get('polarity') == 'love'])
        cells.append(f'{cp}/{lv}' if (cp or lv) else '')
    out.append(f'| {t} {name} | ' + ' | '.join(cells) + ' |')
open(os.path.join(here, 'counts.md'), 'w').write('\n'.join(out) + '\n')
print('\n'.join(out[:12]))
