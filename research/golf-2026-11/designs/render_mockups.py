#!/usr/bin/env python3
"""Draw the winning front designs onto the blank Ivory rope cap photo (rough embroidery-style mock-ups).
    python3 render_mockups.py <blank cap png> <fonts dir> <out dir>
"""
import os, sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter

cap_path, fonts, out = sys.argv[1], sys.argv[2], sys.argv[3]
os.makedirs(out, exist_ok=True)
F = {'script': 'yellowtail-latin-400-normal.woff', 'varsity': 'graduate-latin-400-normal.woff', 'block': 'oswald-latin-600-normal.woff'}
GREEN, NAVY, CREAM = (31, 77, 58), (28, 42, 74), (245, 240, 225)

MOCKS = [  # (file, title under the image, lines [(text, font, size)], thread colour, icon)
  ('1-crew-trip.png', '#1 Crew + trip + year (personalised) · D0638', [('The Bogey Boys', 'script', 44), ('BANDON · 2026', 'block', 17)], GREEN, 'dogleg'),
  ('2-milestone.png', '#2 Milestone date (personalised) · D0865', [('FIRST BIRDIE', 'block', 30), ('HOLE 7 · 2026', 'block', 17)], NAVY, 'flag'),
  ('3-19th-hole.png', 'Most-loved ready-made: 19TH HOLE · D0557', [('19th Hole', 'script', 50)], GREEN, None),
  ('5-town-est.png', 'Broadest appeal: your town + EST. · S09', [('SAN DIEGO GOLF', 'varsity', 26), ('EST. 2026', 'block', 16)], NAVY, 'flag'),
  ('4-crew-varsity.png', 'Bold option: crew varsity · D0777', [('THE SHANKS', 'varsity', 30), ('EST. 2026', 'block', 16)], GREEN, 'flag'),
]

def flag(d, x, y, s, col):  # a small golf flag: pole + pennant
    d.line([(x, y), (x, y + 22 * s)], fill=col, width=max(2, int(2 * s)))
    d.polygon([(x, y), (x + 14 * s, y + 5 * s), (x, y + 10 * s)], fill=col)

def dogleg(d, x, y, s, col):  # a bent fairway arrow
    pts = [(x, y + 18 * s), (x + 10 * s, y + 8 * s), (x + 22 * s, y + 8 * s)]
    d.line(pts, fill=col, width=max(2, int(3 * s)), joint='curve')
    d.polygon([(x + 22 * s, y + 3 * s), (x + 29 * s, y + 8 * s), (x + 22 * s, y + 13 * s)], fill=col)

base = Image.open(cap_path).convert('RGBA'); W, H = base.size
cx, cy = int(W * 0.60), int(H * 0.40)  # centre of the front panel in this photo
tiles = []
for fname, title, lines, col, icon in MOCKS:
    layer = Image.new('RGBA', base.size, (0, 0, 0, 0)); d = ImageDraw.Draw(layer)
    fonts_ = [ImageFont.truetype(os.path.join(fonts, F[f]), int(sz * W / 520)) for _, f, sz in lines]
    boxes = [d.textbbox((0, 0), t, font=fo) for (t, _, _), fo in zip(lines, fonts_)]
    total = sum(b[3] - b[1] for b in boxes) + 6 * (len(lines) - 1) + (28 if icon else 0)
    y = cy - total // 2
    if icon:
        (flag if icon == 'flag' else dogleg)(d, cx - 12, y, W / 520, col); y += 28
    for (t, _, _), fo, b in zip(lines, fonts_, boxes):
        w = b[2] - b[0]; d.text((cx - w // 2 - b[0], y - b[1]), t, font=fo, fill=col + (255,)); y += (b[3] - b[1]) + 6
    # embroidery feel: a slight shadow and soften, then a gentle perspective squeeze toward the cap's turn
    shadow = layer.filter(ImageFilter.GaussianBlur(1.2)); sh = Image.new('RGBA', base.size, (0, 0, 0, 0)); sh.paste((0, 0, 0, 60), mask=shadow.split()[3])
    img = base.copy(); img.alpha_composite(sh, (1, 2)); img.alpha_composite(layer.filter(ImageFilter.SMOOTH))
    dd = ImageDraw.Draw(img); dd.text((12, H - 26), 'MOCK-UP', fill=(120, 120, 110, 255), font=ImageFont.truetype(os.path.join(fonts, F['block']), 16))
    img.convert('RGB').save(os.path.join(out, fname)); tiles.append((img.convert('RGB'), title))
# contact sheet
tw, th = W, H + 44
sheet = Image.new('RGB', (tw * 2, th * ((len(tiles) + 1) // 2)), (250, 248, 242)); sd = ImageDraw.Draw(sheet); tf = ImageFont.truetype(os.path.join(fonts, F['block']), 18)
for i, (im, title) in enumerate(tiles):
    x, y = (i % 2) * tw, (i // 2) * th; sheet.paste(im, (x, y)); sd.text((x + 12, y + H + 10), title, fill=(30, 30, 30), font=tf)
sheet.save(os.path.join(out, 'contact.jpg'), quality=90)
print('saved', out)
