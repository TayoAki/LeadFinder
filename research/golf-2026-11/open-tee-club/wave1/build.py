#!/usr/bin/env python3
"""Build Open Tee Club wave-1 slideshows: render the cap mock-ups each post uses, an icon, then render.py per post.
    python3 build.py <blank cap png> <fonts dir> <slideshow-content scripts dir>
Scenes (Topgolf bay, range, course) come from find-photos.py (licensed photos, credited in photos/SOURCES.md).
"""
import json, os, shutil, subprocess, sys
from PIL import Image, ImageDraw, ImageFont
HERE = os.path.dirname(os.path.abspath(__file__)); cap, fonts, S = sys.argv[1], sys.argv[2], sys.argv[3]
G, N = [31, 77, 58], [28, 42, 74]
MOCKS = {  # photo key -> (lines, colour)
  'crew-range-day-girls': ([['Range Day Girls', 'script', 42], ['SCOTTSDALE · 2026', 'block', 15]], G),
  'crew-after-work': ([['After Work Nine Club', 'script', 34], ['EST. 2026', 'block', 15]], G),
  'crew-tee-time-squad': ([['Tee Time Squad', 'script', 44], ['EST. 2026', 'block', 15]], G),
  'crew-fairway-friends': ([['Fairway Friends Club', 'script', 34], ['EST. 2026', 'block', 15]], G),
  'crew-golf-trip-boys': ([['Golf Trip Boys', 'script', 42], ['BANDON · 2026', 'block', 15]], G),
  'otc-logo': ([['Open Tee Club', 'script', 46], ['EST. 2026', 'block', 15]], G),
  'slogan-here-for-the-birdies': ([['HERE FOR', 'varsity', 26], ['THE BIRDIES', 'varsity', 26]], G),
  'slogan-bogey-what-about-it': ([['BOGEY.', 'varsity', 26], ['WHAT ABOUT IT?', 'varsity', 22]], G),
  'slogan-respectfully-ob': ([['RESPECTFULLY,', 'varsity', 22], ["THAT'S OB", 'varsity', 26]], N),
  'slogan-slice-in-4k': ([['SLICE IN 4K', 'varsity', 28]], G),
}
mock_dir = os.path.join(HERE, '_mockups'); os.makedirs(mock_dir, exist_ok=True)
spec = [[f'{k}.png', k, lines, col, 'flag'] for k, (lines, col) in MOCKS.items()]
json.dump(spec, open(os.path.join(mock_dir, 'mocks.json'), 'w'))
subprocess.run([sys.executable, os.path.join(HERE, '..', '..', 'designs', 'render_mockups.py'), cap, fonts, mock_dir], env={**os.environ, 'MOCKS': os.path.join(mock_dir, 'mocks.json')}, check=True)
# icon: forest-green disc with a white flag + "OTC"
icon = Image.new('RGBA', (512, 512), (0, 0, 0, 0)); d = ImageDraw.Draw(icon); d.ellipse((8, 8, 504, 504), fill=(31, 77, 58, 255))
d.line([(230, 120), (230, 300)], fill='white', width=14); d.polygon([(230, 120), (340, 160), (230, 200)], fill='white')
f = ImageFont.truetype(os.path.join(fonts, 'oswald-latin-600-normal.woff'), 110); w = d.textlength('OTC', font=f); d.text(((512 - w) / 2, 320), 'OTC', font=f, fill='white')
for post in sorted(p for p in os.listdir(HERE) if os.path.isfile(os.path.join(HERE, p, 'post.json'))):
    pd = os.path.join(HERE, post); os.makedirs(os.path.join(pd, 'photos'), exist_ok=True); os.makedirs(os.path.join(pd, 'assets'), exist_ok=True)
    icon.save(os.path.join(pd, 'assets', 'icon.png'))
    for k in MOCKS: shutil.copy(os.path.join(mock_dir, f'{k}.png'), os.path.join(pd, 'photos', f'{k}.png'))
    shutil.copy(cap, os.path.join(pd, 'photos', 'blank-cap.png'))
print('mock-ups + icons in place')
