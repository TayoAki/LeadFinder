#!/usr/bin/env python3
"""Download the slide images of reference TikTok photo posts (treg -> tikhub video detail) and make one contact sheet
per post, so the slideshow spec is written from the real winners, not from memory.
    python3 fetch_ref_slides.py <ids comma-separated> <out dir>
"""
import io, json, os, subprocess, sys, urllib.request
from PIL import Image, ImageDraw
ids, out = sys.argv[1].split(','), sys.argv[2]; os.makedirs(out, exist_ok=True)
TREG = os.path.expanduser('~/.local/bin/treg'); meta = {}
for vid in ids:
    r = subprocess.run([TREG, '--json', 'call', 'tikhub.tiktok.video.detail', '--query', f'itemId={vid}'], capture_output=True, text=True, timeout=180)
    try: j = json.loads(r.stdout)
    except Exception: print(vid, 'bad json'); continue
    o = j.get('result', {}); o = o.get('output', o)
    def find(x):  # the item can sit at different depths depending on the provider
        if isinstance(x, dict):
            if 'imagePost' in x or 'image_post_info' in x: return x
            for v in x.values():
                f = find(v)
                if f: return f
        if isinstance(x, list):
            for v in x:
                f = find(v)
                if f: return f
    it = find(o) or {}
    ip = it.get('imagePost') or it.get('image_post_info') or {}
    urls = []
    for im in ip.get('images', []):
        u = (im.get('imageURL') or im.get('display_image') or {}); u = u.get('urlList') or u.get('url_list') or []
        if u: urls.append(u[0])
    imgs = []
    for i, u in enumerate(urls):
        try:
            data = urllib.request.urlopen(urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0'}), timeout=60).read()
            im = Image.open(io.BytesIO(data)).convert('RGB'); im.save(os.path.join(out, f'{vid}_{i+1:02d}.jpg'), quality=85); imgs.append(im)
        except Exception as e: print(vid, i, 'download failed', e)
    meta[vid] = dict(slides=len(urls), downloaded=len(imgs), desc=(it.get('desc') or '')[:300], music=(it.get('music') or {}).get('title'), size=list(imgs[0].size) if imgs else None)
    if imgs:  # contact sheet, 4 per row, 270px wide each
        w = 270; h = int(imgs[0].size[1] * w / imgs[0].size[0]); cols = 4; rows = (len(imgs) + cols - 1) // cols
        sheet = Image.new('RGB', (cols * w, rows * h), 'white')
        for i, im in enumerate(imgs): sheet.paste(im.resize((w, h)), ((i % cols) * w, (i // cols) * h))
        sheet.save(os.path.join(out, f'{vid}_sheet.jpg'), quality=80)
    print(vid, len(urls), 'slides', (it.get('desc') or '')[:60])
json.dump(meta, open(os.path.join(out, 'meta.json'), 'w'), indent=1)
