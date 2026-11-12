"""Pull Reddit posts per pain point via treg (scrapecreators), 8 in parallel, and print the most-discussed threads."""
import json, subprocess, re, os, datetime
from concurrent.futures import ThreadPoolExecutor

Q = [
 ('p1', "dont trust the numbers AI gives dashboard"), ('p1', 'text to sql wrong answers business users'), ('p1', 'AI analyst hallucinated metric'),
 ('p2', 'semantic layer took months to set up'), ('p2', 'LookML maintenance'), ('p2', 'power bi data model relationships nightmare'),
 ('p3', 'excel and dashboard numbers dont match'), ('p3', 'spreadsheet vs BI tool two versions of truth'),
 ('p4', 'dashboard showing stale data'), ('p4', 'power bi slicer not filtering visual'), ('p4', 'looker studio data not updating'),
 ('p5', 'client reporting dashboard agency clients'), ('p5', 'metabase row level security embedding price'),
 ('p5', 'power bi embedded cost external customers'), ('p5', 'white label dashboard for clients'),
]
os.makedirs('reddit', exist_ok=True)

def pull(item):
    p, q = item
    f = f"reddit/{p}-{re.sub(r'[^a-z0-9]+', '-', q.lower())}.json"
    out = subprocess.run(['treg', 'call', 'scrapecreators.reddit.search.posts', '-p', f'query={q}', '-p', 'sort=relevance'], capture_output=True, text=True, timeout=180)
    open(f, 'w').write(out.stdout or out.stderr)
    return f

with ThreadPoolExecutor(8) as ex:
    files = list(ex.map(pull, Q))

summary = []
for f in files:
    t = open(f).read()
    try:
        d = json.JSONDecoder().raw_decode(t)[0]
    except Exception:
        print(f, 'ERR', t[:150]); continue
    posts = d.get('posts') or d.get('data') or []
    if isinstance(posts, dict): posts = posts.get('posts', [])
    print('==', f, len(posts))
    for x in sorted(posts, key=lambda x: -(x.get('num_comments') or 0))[:5]:
        ts = x.get('created_utc') or 0
        dt = datetime.datetime.fromtimestamp(float(ts), datetime.UTC).date() if ts else '?'
        row = dict(file=f, comments=x.get('num_comments'), score=x.get('score'), date=str(dt), sub=x.get('subreddit'), title=x.get('title'), url=x.get('url') or ('https://www.reddit.com' + (x.get('permalink') or '')))
        summary.append(row)
        print('  ', row['comments'], row['date'], row['sub'], (row['title'] or '')[:100], row['url'])
json.dump(summary, open('reddit_summary.json', 'w'), indent=1)
