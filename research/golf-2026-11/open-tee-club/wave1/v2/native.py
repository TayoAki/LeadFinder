#!/usr/bin/env python3
"""Render v2 'native' slideshows: the looks the reference winners use (SLIDESHOW_SPEC.md), not a brand template.
    python3 native.py <post dir> <fonts dir>
post.json: {"size":[w,h], "slides":[...]}, slide styles:
  serif_box  full-bleed photo, centred white box with a thin serif title (R6 cover)
  grid       white page, 2x2 tiles, item photo contained, lowercase serif label under each (R6 grid)
  stroke     full-bleed photo, centred white sans text with a black outline (R9)
  tiktok     full-bleed photo, small text in a rounded dark-green box (R3/R5)
  shoot      grey frame 'YOUR PHOTO: <brief>' + tiktok label: a slot for the user's own phone photo
Any tile/photo marked "mockup": true gets a small 'mock-up' tag (honesty rule).
Writes <post>/out/01.jpg ... and <post>/out/sheet.jpg.
"""
import json, os, sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter
P, F = sys.argv[1], sys.argv[2]
post = json.load(open(os.path.join(P, 'post.json'))); W, H = post['size']
font = lambda n, s: ImageFont.truetype(os.path.join(F, n), s)
SERIF, SERIF_I, SANS = 'playfair-display-latin-500-normal.woff', 'playfair-display-latin-500-italic.woff', 'montserrat-latin-600-normal.woff'
out = os.path.join(P, 'out'); os.makedirs(out, exist_ok=True)

def cover(im, w, h):  # crop-to-fill
    im = im.convert('RGB'); r = max(w / im.width, h / im.height); im = im.resize((int(im.width * r + 1), int(im.height * r + 1)))
    l, t = (im.width - w) // 2, (im.height - h) // 2; return im.crop((l, t, l + w, t + h))

def contain(im, w, h, bg='white'):
    im = im.convert('RGBA'); r = min(w / im.width, h / im.height); im = im.resize((int(im.width * r), int(im.height * r)))
    c = Image.new('RGB', (w, h), bg); c.paste(im, ((w - im.width) // 2, (h - im.height) // 2), im); return c

def wrap(d, text, f, maxw):
    lines = []
    for para in text.split('\n'):
        cur = ''
        for word in para.split():
            t = (cur + ' ' + word).strip()
            if d.textlength(t, font=f) <= maxw: cur = t
            else: lines.append(cur); cur = word
        lines.append(cur)
    return lines

def tag(img, x, y):
    d = ImageDraw.Draw(img); f = font(SANS, 22); t = 'mock-up'; w = d.textlength(t, font=f)
    d.rounded_rectangle((x, y, x + w + 24, y + 38), 10, fill=(0, 0, 0)); d.text((x + 12, y + 6), t, font=f, fill='white')

def photo(s):
    return Image.open(os.path.join(P, s['photo']))

def centred(d, lines, f, cy, fill, stroke=0, sfill=None, lh=1.25):
    hgt = f.size * lh; y = cy - hgt * len(lines) / 2
    for ln in lines:
        w = d.textlength(ln, font=f); d.text(((W - w) / 2, y), ln, font=f, fill=fill, stroke_width=stroke, stroke_fill=sfill); y += hgt

def render(s):
    st = s['style']
    if st == 'grid':
        img = Image.new('RGB', (W, H), 'white'); d = ImageDraw.Draw(img); fl = font(SERIF, 34)
        cols, rows = 2, (len(s['items']) + 1) // 2; mx, top = 70, (H - rows * 620) // 2
        tw, th = (W - 2 * mx - 40) // 2, 500
        for i, it in enumerate(s['items']):
            x, y = mx + (i % cols) * (tw + 40), top + (i // cols) * 620
            img.paste(contain(Image.open(os.path.join(P, it['photo'])), tw, th), (x, y))
            if it.get('mockup'): tag(img, x + 10, y + 10)
            lw = d.textlength(it['label'], font=fl); d.text((x + (tw - lw) / 2, y + th + 22), it['label'], font=fl, fill=(20, 20, 20))
        return img
    if st == 'shoot':
        img = Image.new('RGB', (W, H), (226, 224, 219)); d = ImageDraw.Draw(img)
        d.rectangle((40, 40, W - 40, H - 40), outline=(160, 160, 160), width=4)
        fb = font(SANS, 30); centred(d, wrap(d, 'YOUR PHOTO: ' + s['brief'], fb, W - 200), fb, H * 0.3, (110, 110, 110))
    else:
        img = cover(photo(s), W, H); d = ImageDraw.Draw(img)
        if s.get('mockup'): tag(img, 30, 30)
    text = s.get('text', '')
    if st == 'serif_box':
        f = font(SERIF, 64); ls = wrap(d, text, f, W - 320); bh = int(len(ls) * 64 * 1.3 + 90); y0 = int(H * s.get('at', .45)) - bh // 2
        d.rectangle((110, y0, W - 110, y0 + bh), fill='white'); centred(d, ls, f, y0 + bh / 2, (15, 15, 15), lh=1.3)
    elif st == 'stroke':
        f = font(SANS, s.get('fs', 76)); ls = wrap(d, text, f, W - 140); centred(d, ls, f, H * s.get('at', .5), 'white', 5, 'black')
    elif st in ('tiktok', 'shoot'):
        f = font(SANS, 44); ls = wrap(d, text, f, W - 260); lh = 58; cy = H * s.get('at', .62)
        for i, ln in enumerate(ls):
            w = d.textlength(ln, font=f); y = cy - lh * len(ls) / 2 + i * lh
            d.rounded_rectangle(((W - w) / 2 - 22, y - 6, (W + w) / 2 + 22, y + lh - 4), 14, fill=(46, 82, 60))
            d.text(((W - w) / 2, y), ln, font=f, fill='white')
    return img

imgs = []
for i, s in enumerate(post['slides']):
    im = render(s); im.save(os.path.join(out, f'{i + 1:02d}.jpg'), quality=90); imgs.append(im)
tw = 360; th = int(H * tw / W); sheet = Image.new('RGB', (tw * min(4, len(imgs)), th * ((len(imgs) + 3) // 4)), 'white')
for i, im in enumerate(imgs): sheet.paste(im.resize((tw, th)), ((i % 4) * tw, (i // 4) * th))
sheet.save(os.path.join(out, 'sheet.jpg'), quality=85); print(P, len(imgs), 'slides')
