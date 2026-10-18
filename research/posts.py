# Walk an account's posts back to 2016 and keep those from the birthday window (Oct 21-28 each year):
# photo tags, @mentions, collaborators and location -> posts_<handle>.json
# Usage: python3 posts.py champagnepapi [max_pages=400]   (~$0.0019 per page of 12 posts)
import os; os.chdir(os.path.dirname(os.path.abspath(__file__)))
import json, re, subprocess, sys
from datetime import datetime, timezone

handle = sys.argv[1]
max_pages = int(sys.argv[2]) if len(sys.argv) > 2 else 400
STOP = datetime(2016, 10, 1, tzinfo=timezone.utc).timestamp()

def in_window(ts):
    d = datetime.fromtimestamp(ts, timezone.utc)
    return d.month == 10 and 21 <= d.day <= 28

def tags(item):
    out = set()
    for node in [item] + (item.get("carousel_media") or []):
        for t in ((node.get("usertags") or {}).get("in") or []):
            if (t.get("user") or {}).get("username"):
                out.add(t["user"]["username"])
    for c in item.get("coauthor_producers") or []:
        if c.get("username"):
            out.add(c["username"])
    return out

kept, cursor, cost, oldest = [], None, 0, None
for page in range(max_pages):
    cmd = ["treg", "--json", "call", "scrapecreators.instagram.user.posts", "--query", f"handle={handle}"]
    if cursor:
        cmd += ["--query", f"next_max_id={cursor}"]
    try:
        d = json.loads(subprocess.run(cmd, capture_output=True, text=True, timeout=120).stdout)
    except (json.JSONDecodeError, subprocess.TimeoutExpired):
        print(handle, "stopped: bad response on page", page); break
    cost += d["_treg"].get("charged_micro") or 0
    r = d.get("result") or {}
    items = r.get("items") or []
    for it in items:
        ts = it.get("taken_at") or 0
        oldest = ts
        if not in_window(ts):
            continue
        caption = ((it.get("caption") or {}).get("text")) or ""
        kept.append({
            "code": it.get("code"), "date": datetime.fromtimestamp(ts, timezone.utc).strftime("%Y-%m-%d"),
            "tagged": sorted(tags(it)), "mentions": sorted(set(re.findall(r"@([A-Za-z0-9_.]+)", caption))),
            "location": (it.get("location") or {}).get("name"), "caption": caption[:300],
        })
    cursor = r.get("next_max_id")
    if not items or not cursor or not r.get("more_available") or (oldest and oldest < STOP):
        break

json.dump(kept, open(f"posts_{handle}.json", "w"), indent=1)
last = datetime.fromtimestamp(oldest, timezone.utc).date() if oldest else "?"
print(f"{handle}: {page + 1} pages back to {last}, {len(kept)} birthday-window posts, ${cost / 1e6:.3f}")
