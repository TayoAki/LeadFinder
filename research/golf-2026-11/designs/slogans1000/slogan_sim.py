#!/usr/bin/env python3
"""SIMULATED: ~1,000 golf-hat slogans scored by 20,000 simulated golf shoppers (not demand evidence).

Each slogan belongs to a slang family ("It's Giving ...", "No Cap ...", "... Is Mid" ...). Each family has traits:
  slang 0-3 (how much internet slang), borrow 0-2 (reads as borrowing a culture the brand isn't part of),
  dated 0-2 (how fast it ages), crude 0-2, humour 0-2.
Traits are set by judgement and CALIBRATED to our earlier 100-shopper panel of 14 slogans (e.g. "It's Giving" 73%
and "On God" 85% "trying too hard"; "Is Mid" split by age; "Birdie Behavior"/"Outside the Ropes" broadly liked).
Per-slogan features: golf-word familiarity (counts from our golf data), self-deprecating words, group words
(Our/Crew/Foursome...), women-targeted words, positive-outcome brag, length (embroidery + readability).
Shoppers: the same 9 segments and shares as before, each with an age (<35 or 35+) and gender mix.
"""
import json, math, os, re
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__))
SLOGANS = [l.strip() for l in open(os.path.join(HERE, 'slogans.txt')) if l.strip()]
# ICP=denimtears also scores slogans written for that audience (slogans-denimtears.txt), alongside the 1,000.
NEW = []
if os.environ.get('ICP') == 'denimtears':
    NEW = [l.strip() for l in open(os.path.join(HERE, 'slogans-denimtears.txt')) if l.strip() and not l.startswith('#')]
    SLOGANS += [s for s in NEW if s not in SLOGANS]
NEWSET = set(NEW)

# family: (regex, slang, borrow, dated, crude, humour)
FAM = [
 ("It's Giving", r"^It's Giving", 3, 2, 2, 0, .5), ('On God', r'On God$', 3, 2, 1, 0, .5), ('Periodt', r'Periodt\.?$', 3, 2, 1, 0, .3),
 ("Bussin'", r"Bussin'$", 3, 2, 2, 0, .5), ('Finna', r'^Finna', 3, 2, 1, 0, .8), ('Deadass', r'^Deadass', 3, 2, 1, 1, .5),
 ('We Ball', r'We Ball$', 3, 2, 1, 0, .8), ('For the Culture', r'for the Culture$', 3, 2, 1, 0, .3), ("Ain't Deep/Mathin'", r"Ain't (Deep|Mathin')$", 2, 2, 1, 0, 1),
 ('Outta Pocket', r'Outta Pocket$', 2, 2, 1, 0, 1), ("Trippin'", r"Trippin'$", 2, 1, 1, 0, 1), ('Slay', r'^Slay', 3, 1, 2, 0, .3),
 ('Tea', r'(Tea$|^Spill the Tee|^Tee Time Tea|^The Tea at|^Sip & Chip)', 2, 1, 2, 0, .8), ('Ate', r'(^Ate|She Ate)', 3, 1, 1, 0, .5),
 ('Sis / Girl,', r'(, Sis\.$|^Girl, )', 2, 1, 1, 0, .5), ('Hot Girl', r'^Hot Girl', 2, 0, 1, 1, .5), ('Is Mid', r'Is Mid$', 2, 0, 1, 0, 1.2),
 ('Side-Eye', r'Side-Eye$', 2, 0, 1, 0, 1), ('Say Less', r'^Say Less', 2, 1, 1, 0, .3), ('Bet.', r'^Bet\.', 2, 1, 1, 0, .5),
 ('No Cap', r'No Cap', 2, 1, 1, 0, .8), ('Hits Different', r'Hits Different$', 1, 0, 1, 0, .3), ('Let ... Cook', r'^Let .* Cook$', 2, 1, 1, 0, .5),
 ('Cooked', r'(^Cooked by|Cooked Me$)', 2, 0, 1, 0, 1.5), ('Locked In', r'^Locked In', 1, 0, 0, 0, 0), ('Crashout', r'Crashout$', 2, 0, 1, 0, 1.5),
 ('Aura', r'Aura( Farming)?$', 3, 0, 2, 0, .5), ('Farming', r'Farming$', 3, 0, 2, 0, .5), ('Standing on', r'^Standing on', 2, 1, 1, 0, .3),
 ('Motion', r'Motion', 2, 1, 1, 0, .3), ('Big ... Energy', r'^Big .* Energy$', 1, 0, 1, 1, 1), ('Main ... Energy', r'^Main .* Energy$', 2, 0, 1, 0, .8),
 ('Behavior', r'Behavior$', 1, 0, 0, 0, .8), ('No Notes', r'No Notes\.$', 1, 0, 1, 0, .3), ('Assignment', r'Assignment', 2, 1, 1, 0, .3),
 ('Fit Check', r'Fit Check$', 1, 0, 1, 0, .3), ('Drip', r'Drip$', 2, 0, 1, 0, .3), ('Iced Out', r'^Iced Out', 2, 1, 1, 0, .5),
 ('Lowkey/Highkey', r'^(Lowkey|Highkey)', 2, 0, 1, 0, .5), ('Fumbled', r'^Fumbled', 1, 0, 0, 0, 1.2), ('Secure the', r'^Secure the', 2, 0, 1, 0, .3),
 ('Weak for', r'^Weak for', 1, 0, 0, 0, .5), ('for Real', r'for Real$', 1, 0, 0, 0, .2), ('Real Ones', r'^Real Ones', 1, 0, 0, 0, .5),
 ('Salty', r'^Salty', 1, 0, 0, 0, 1.2), ('Hold Up', r'^Hold Up', 1, 0, 0, 0, 1), ('Tough ...', r'^Tough ', 0, 0, 0, 0, 1),
 ('Sheesh', r'Sheesh\.$', 2, 0, 1, 0, .5), ('Respectfully', r'^Respectfully', 1, 0, 0, 0, 1.2), ('Mind Your', r'^Mind Your', 0, 0, 0, 0, .8),
 ('Brand New', r'Brand New', 1, 0, 1, 0, .5), ('Who Said', r'^Who Said', 0, 0, 0, 0, 1), ('I Said', r'^I Said', 0, 0, 0, 0, .8),
 ('What About It?', r'What About It\?$', 1, 0, 0, 0, 1.2), ('Clock the', r'^Clock the', 2, 0, 1, 0, .3), ('Under Pressure', r'Under Pressure$', 0, 0, 0, 0, .2),
 ('Rent Free', r'Rent Free', 1, 0, 1, 0, 1), ('Built Different', r'Built Different$', 1, 0, 1, 0, .5), ('Built for', r'^Built for', 0, 0, 0, 0, 0),
 ('Is Fire', r'Is Fire$', 1, 0, 1, 0, .3), ('Is a Vibe', r'Is a Vibe$', 1, 0, 1, 0, .2), ('for the Plot', r'for the Plot$', 2, 0, 1, 0, .8),
 ('Delulu', r'^Delulu', 3, 0, 2, 0, 1), ('Soft/Hard Launch', r'(Soft|Hard) Launch', 2, 0, 1, 0, .5), ('Touch ...', r'^Touch ', 2, 0, 1, 0, 1),
 ('We Outside', r'^We Outside', 2, 1, 1, 0, .5), ('Outside on', r'^Outside on', 1, 1, 1, 0, .2), ('No Crumbs', r'^No Crumbs', 3, 1, 2, 0, .3),
 ('Get Into', r'^Get Into', 1, 0, 0, 0, .1), ('... Mood', r'Mood$', 1, 0, 1, 0, .5), ('Him / Her', r'^(Him |Her |Call Her)', 2, 1, 1, 0, .5),
 ('That ... Girl', r'^That .* Girl$', 2, 0, 1, 0, .3), ('Girl Era / In My Era', r'Era$', 2, 0, 1, 0, .5), ('in My Bag', r'in My Bag$', 2, 0, 1, 0, .5),
 ('Stepper', r'(Stepper$|Steppin\'$)', 2, 1, 1, 0, .5), ('Talk Your', r'^Talk Your', 2, 1, 1, 0, .5), ('to Me Nice', r'to Me Nice$', 2, 1, 1, 0, .8),
 ('Say It With', r'^Say It With', 0, 0, 0, 0, .1), ('Same ... Energy', r'^Same .* Energy$', 1, 0, 1, 0, .3), ('Keep That', r'^Keep That', 0, 0, 0, 0, 0),
 ('You ...?', r'^You .*\?$', 1, 0, 0, 0, .8), ('Be So', r'^Be So', 2, 0, 1, 0, .5), ('Be Like That', r'Be Like That$', 1, 0, 0, 0, 1.2),
 ("Couldn't Be", r"^Couldn't Be", 1, 0, 1, 0, 1), ('in 4K', r'in 4K$', 2, 0, 1, 0, 1.5), ('Receipts', r'Receipts$', 2, 0, 1, 0, .8),
 ('Go Off', r'^Go Off', 2, 1, 1, 0, .5), ('Bestie', r'Bestie$', 2, 0, 1, 0, .5), ('Not Me', r'^Not Me', 1, 0, 1, 0, 1.2),
 ('Plot Twist', r'^Plot Twist', 1, 0, 0, 0, 1.2), ('Here for the', r'^Here for the', 0, 0, 0, 0, .8), ('Pack Up', r'^Pack Up', 1, 0, 1, 0, 1),
 ('Function', r'Function$', 2, 1, 1, 0, .5),
]
def family(s):
    for name, rx, *t in FAM:
        if re.search(rx, s): return name, t
    if s in NEWSET: return 'New: Denim Tears set', [0, 0, 0, 0, .4]  # plain English, no slang family
    return 'Other', [1, 0, 0, 0, .5]
WORDS = {'swing': 141, 'tee': 33, 'dad': 31, 'range': 20, 'fairway': 18, 'slice': 12, 'weekend': 12, 'birdie': 11, 'par': 10, 'cart': 10, 'fore': 9, 'handicap': 9,
         'sunday': 7, 'bogey': 6, 'chunk': 5, 'beer': 4, 'bunker': 4, 'back nine': 6, 'putt': 8, 'driver': 8, 'green': 8, 'clubhouse': 3, 'eagle': 2, 'mulligan': 2, 'shank': 2, 'scramble': 3}
SELF = re.compile(r'bogey|shank|duff|slice|lip|three-putt|water ball|\bob\b|mulligan|double|lost|crashout|cooked|salty|fumbled|topping|hook|fat shot|thin shot|find my ball|where.s my ball', re.I)
GROUP = re.compile(r'\b(our|crew|group|foursome|side bet|lineup|best ball|we |cart crew|bestie)\b', re.I)
WOMEN = re.compile(r'\b(her|she|girl|sis|bestie|queen|gloss|hoops)\b', re.I)
CRUDE = re.compile(r'hot girl|pin up|cart girl|big (chip|putter|driver|caddie) energy|deadass', re.I)
BRAG = re.compile(r'birdie|eagle|pure|pin high|under par|dialed|stripe|center cut|dead straight|go low|tap-in|one putt|no bogeys', re.I)

rows = []
for s in SLOGANS:
    fam, (slang, borrow, dated, crude, hum) = family(s)
    low = s.lower(); fam_w = max([math.log1p(c) / math.log1p(141) for w, c in WORDS.items() if w in low] or [0])
    rows.append(dict(slogan=s, family=fam, slang=slang, borrow=borrow, dated=dated, crude=crude + (1 if CRUDE.search(s) else 0),
                     humour=hum + (0.8 if SELF.search(s) else 0), group=1 if GROUP.search(s) else 0, women=1 if WOMEN.search(s) else 0,
                     brag=1 if BRAG.search(s) and not SELF.search(s) else 0, familiar=round(fam_w, 2), chars=len(s)))
F = {k: np.array([r[k] for r in rows], float) for k in ['slang', 'borrow', 'dated', 'crude', 'humour', 'group', 'women', 'brag', 'familiar', 'chars']}
# Style features used by ICP=denimtears (0 weight elsewhere). Caps this crowd wears (Supreme, Stussy, New Era, ALD,
# Carhartt WIP, Kapital) carry wordmarks, departments, places and years, not jokes.
HERITAGE = re.compile(r'\b(club|society|dept\.?|department|athletic|league|members?|union|est\.|association|division|social|public|municipal|muni)\b', re.I)
PLACE = re.compile(r'\b(nyc|new york|brooklyn|queens|bronx|harlem|five borough|city|concrete|seoul|tokyo|downtown|uptown)\b', re.I)
SIGN = re.compile(r'^(cart path only|ground under repair|walking only|quiet please|play it as it lies|replace your divots|out of bounds|drop zone|provisional|range balls only|no dress code|twilight rate|shotgun start|ready golf)$', re.I)
PUN = re.compile(r"tee-?riffic|par-?ty|fore-?ever|tee time tea|sip & chip|spill the tee|fairway to|putt it|grip it|swing(in)?g? (it|by)|hole-?y|chip happens|par-?fect|tee-?hee|golf-?ing", re.I)
F['minimal'] = np.array([1.0 if len(r['slogan'].split()) <= 3 and r['chars'] <= 18 else 0.0 for r in rows])
F['heritage'] = np.array([1.0 if HERITAGE.search(r['slogan']) else 0.0 for r in rows])
F['place'] = np.array([1.0 if PLACE.search(r['slogan']) else 0.0 for r in rows])
F['sign'] = np.array([1.0 if SIGN.search(r['slogan']) else 0.0 for r in rows])
F['pun'] = np.array([1.0 if PUN.search(r['slogan']) else 0.0 for r in rows])
F['excl'] = np.array([1.0 if '!' in r['slogan'] else 0.0 for r in rows])

# segment: share, P(under 35), P(woman), humour, group, plain-golf taste, brag taste
SEG = {'Trip / crew organiser': (.14, .35, .2, .8, 1.5, .3, .3), 'Gift buyer': (.18, .4, .2, .6, .3, .4, .6), 'Golf dad': (.12, .1, 0, .8, .4, .4, .3),
       'Style-led retro golfer': (.14, .4, .25, -.3, .2, .9, .2), 'Muni / public golfer': (.10, .4, .15, 1.0, .5, .3, .2), 'Casual humour sharer': (.14, .9, .35, 1.8, .4, -.2, 0),
       'Women golfer': (.10, .6, 1.0, .5, .4, .3, .5), 'League captain': (.04, .2, .2, .6, 1.5, .4, .3), 'Beginner': (.04, .5, .4, 1.0, .3, .2, .4)}
# ---- alternative ICP: Telfar's audience (ICP=telfar). Built from web research (Telfar: "Not for you, for everyone";
# "Black-adjacent, queer-adjacent"; $150-257 bags; community + pre-order drops) and the Instagram tag overlap of
# 99 people who tag @telfarglobal (Fashion Nova 19, Zara 15, Nike 11, H&M 11, Shein 8, Supreme/Coach/Fenty/Sephora 7;
# outliers: streetwear fit pages, CultureCon; hashtags #ootd #fitcheck #streetwear #nyc). Eastside Golf (Black-founded
# golf lifestyle, $10M+ revenue 2024, "cookout" community days) is the culture-golf bridge.
# extra fields: slang bonus, borrowing sensitivity multiplier, fashion taste
FASHION_FAM = {'Fit Check', 'Drip', 'Iced Out', 'Ate', 'Slay', 'That ... Girl', 'Hot Girl', 'Main ... Energy', 'Girl Era / In My Era', 'in My Bag', 'Stepper', 'Big ... Energy', 'Behavior', 'No Notes', 'Aura'}
F['fashion'] = np.array([1.0 if r['family'] in FASHION_FAM else 0.0 for r in rows])
EXTRA = {s: (0, 1.0, 0) for s in SEG}
if os.environ.get('ICP') == 'telfar':
    SEG = {'Telfar core fashion fan': (.25, .8, .6, .6, .6, .2, .3), 'Golfcore fashion buyer': (.20, .75, .55, .8, .5, .4, .3),
           'Culture golfer (Eastside Golf crowd)': (.15, .5, .25, .8, 1.2, .4, .5), 'Fit-check poster': (.15, .9, .6, .6, .3, 0, .3),
           'Fast-fashion deal buyer': (.15, .8, .7, 1.0, .3, .1, .2), 'Gift buyer in the community': (.10, .5, .6, .6, .5, .4, .6)}
    EXTRA = {'Telfar core fashion fan': (.3, .7, 1.0), 'Golfcore fashion buyer': (.1, 1.0, .8), 'Culture golfer (Eastside Golf crowd)': (.1, 1.3, .3),
             'Fit-check poster': (.4, .8, 1.2), 'Fast-fashion deal buyer': (.3, .8, .6), 'Gift buyer in the community': (0, 1.0, .3)}
if os.environ.get('ICP') == 'opentee':
    # Open Tee Club ICP. NGF 2025: women +46% since 2019 and ~60% of net new golfers; women = 35% of beginners, 43% of
    # off-course-only players; >half of women's gains are under 30; women ~2x as likely to lapse; POC = 26% of on-course
    # golfers (30% of female golfers); off-course (Topgolf) players 5x more interested in the course. Plus Melin/Telfar
    # findings: plain golf attitude wins; borrowed slang loses even with fashion-first shoppers.
    SEG = {'New woman golfer (beginner, via friends/Topgolf)': (.22, .65, 1.0, .7, .9, .4, .6), 'Off-course golf-curious (Topgolf/sim)': (.18, .75, .5, 1.0, .7, .3, .4),
           'Culture golfer (Eastside crowd)': (.15, .5, .3, .8, 1.2, .4, .5), 'Friend-group crew organiser': (.15, .55, .5, .9, 1.6, .3, .3),
           'Fashion-first golf-adjacent (Telfar crowd)': (.12, .8, .6, .6, .5, .2, .3), "Women's golf group / league leader": (.06, .4, 1.0, .6, 1.5, .4, .4),
           'Gift buyer for a new golfer': (.12, .5, .5, .6, .5, .4, .7)}
    EXTRA = {'New woman golfer (beginner, via friends/Topgolf)': (.05, 1.0, .5), 'Off-course golf-curious (Topgolf/sim)': (.15, 1.0, .4), 'Culture golfer (Eastside crowd)': (.1, 1.3, .3),
             'Friend-group crew organiser': (.05, 1.0, .2), 'Fashion-first golf-adjacent (Telfar crowd)': (.2, .9, 1.0), "Women's golf group / league leader": (0, 1.1, .3), 'Gift buyer for a new golfer': (0, 1.0, .3)}
STYLE = {s: (0, 0, 0, 0, 0) for s in SEG}  # minimal, heritage, place, course-sign deadpan, pun/exclamation penalty
if os.environ.get('ICP') == 'denimtears':
    # Denim Tears ICP, from the Instagram tag overlap (research/denim-tears/ig-tags.md): 1,050 posts tagging @denimtears
    # by 809 accounts, 453 feeds read. Outliers (lift>=3): Supreme (97 people, 3.4), Rick Owens (40, 3.0), Kapital (20,
    # 3.2), Gallery Dept (17, 3.6), Who Decides War (14, 3.5), Martine Rose (22, 3.9); also Corteiz/Hellstar/Chrome
    # Hearts ~2.7, Timberland 2.8, New Era 2.3, Carhartt WIP 2.1, ALD 2.1. Worn together: Stussy 121, Supreme/adidas
    # Originals 70. A Korean cluster (#데님티어스 17, LE SSERAFIM, UGG Korea). Golf: only Golf Wang (not golf).
    # Brand context: Tremaine Emory, Black-history storytelling, NYC; fans watch for brands borrowing culture.
    # Segment SHARES and gender mix are JUDGEMENT informed by that data (streetwear audiences skew male).
    SEG = {'Hype streetwear core (Supreme/Corteiz/Stussy)': (.25, .85, .3, .5, .2, .3, .1), 'Archive / designer head (Rick Owens, Kapital, Margiela)': (.20, .55, .35, .2, .1, .4, 0),
           'Culture + heritage reader (history, Wales Bonner)': (.18, .5, .45, .3, .4, .4, .1), 'Workwear / heritage casual (Carhartt WIP, Timberland, New Era, ALD)': (.15, .5, .3, .5, .3, .7, .1),
           'Korea / Asia fan (Seoul, Tokyo)': (.12, .8, .5, .3, .2, .3, .1), 'Golf-curious streetwear (ALD / Golf Wang adjacent)': (.10, .7, .3, .7, .5, .8, .2)}
    # slang bonus (negative: try-hard reads badly here), borrowing sensitivity, fashion taste
    EXTRA = {'Hype streetwear core (Supreme/Corteiz/Stussy)': (-.1, 1.3, .6), 'Archive / designer head (Rick Owens, Kapital, Margiela)': (-.4, 1.4, .4),
             'Culture + heritage reader (history, Wales Bonner)': (-.3, 2.0, .3), 'Workwear / heritage casual (Carhartt WIP, Timberland, New Era, ALD)': (-.3, 1.4, .2),
             'Korea / Asia fan (Seoul, Tokyo)': (-.5, 1.2, .5), 'Golf-curious streetwear (ALD / Golf Wang adjacent)': (-.2, 1.3, .4)}
    # place weight set to -0.5 after the blind panel (dt-panel-results.json): a brand not from a place borrowing its name
    # read as borrowed (Uptown Range Club 60/100, NYC Muni 44, Five Borough Muni 43).
    STYLE = {'Hype streetwear core (Supreme/Corteiz/Stussy)': (1.0, .6, -.5, .5, 1.0), 'Archive / designer head (Rick Owens, Kapital, Margiela)': (1.2, .4, -.5, .8, 1.4),
             'Culture + heritage reader (history, Wales Bonner)': (.6, .8, -.5, .5, 1.0), 'Workwear / heritage casual (Carhartt WIP, Timberland, New Era, ALD)': (.8, 1.0, -.5, .6, .8),
             'Korea / Asia fan (Seoul, Tokyo)': (1.2, .7, -.5, .3, .8), 'Golf-curious streetwear (ALD / Golf Wang adjacent)': (.7, .8, -.5, 1.0, .6)}
N, NOISE, HURDLE = 20000, .9, 4.6
rng = np.random.default_rng(1611)
seg = list(SEG); sh = np.array([SEG[s][0] for s in seg]); sh /= sh.sum(); who = rng.choice(len(seg), N, p=sh)
young = np.zeros(N, bool); woman = np.zeros(N, bool); U = np.zeros((N, len(rows)), np.float32)
for si, s in enumerate(seg):
    m = who == si; k = int(m.sum()); _, py, pw, h, g, plain, brag = SEG[s]
    y = rng.random(k) < py; w = rng.random(k) < pw; young[m] = y; woman[m] = w
    yy = y[:, None].astype(float); ww = w[:, None].astype(float)
    sb, bm, fz = EXTRA[s]; smn, sh_, spl, ssg, spn = STYLE[s]
    style = .6 * smn * F['minimal'] + .6 * sh_ * F['heritage'] + .6 * spl * F['place'] + .6 * ssg * F['sign'] - .6 * spn * (F['pun'] + F['excl'])
    base = (fz * .6 * F['fashion'] + .25 * F['familiar'] - .05 * np.maximum(0, F['chars'] - 16) + h * .6 * F['humour'] + g * .8 * F['group'] + brag * .8 * F['brag'] + plain * .6 * (F['slang'] == 0) - .6 * bm * F['borrow'])
    slang_eff = yy * ((.35 + sb) * F['slang'] - .3 * F['dated']) + (1 - yy) * ((-.55 + sb) * F['slang'] - .4 * bm * F['borrow'] - .1 * F['dated'])
    crude_eff = -(.7 if s.startswith('Gift buyer') or s == 'Golf dad' else .35) * F['crude'] * (1 - .6 * yy)
    women_eff = ww * (1.0 * F['women']) - (1 - ww) * (2.5 * F['women'])
    U[m] = (base[None, :] + style[None, :] + slang_eff + crude_eff + women_eff + rng.normal(0, NOISE, (k, len(rows)))).astype(np.float32)
first = U.argmax(1); fc = np.bincount(first, minlength=len(rows)) / N
P = (1 / (1 + np.exp(-(U - HURDLE)))).mean(0); PS = (1 / (1 + np.exp(-(U - HURDLE + 1.0 + .4 * F['humour'][None, :])))).mean(0)
yfc = np.bincount(first[young], minlength=len(rows)) / max(1, young.sum()); ofc = np.bincount(first[~young], minlength=len(rows)) / max(1, (~young).sum())
for i, r in enumerate(rows):
    r.update(first_choice=round(fc[i] * 100, 2), p_buy=round(float(P[i]) * 100, 2), p_share=round(float(PS[i]) * 100, 2), under35_first=round(yfc[i] * 100, 2), over35_first=round(ofc[i] * 100, 2))
rank = sorted(rows, key=lambda r: -(r['p_buy'] + 2 * r['first_choice']))
for i, r in enumerate(rank, 1): r['rank'] = i
seg_win = {s: rows[int(np.bincount(first[who == si], minlength=len(rows)).argmax())]['slogan'] for si, s in enumerate(seg)}
fams = {}
for r in rows: fams.setdefault(r['family'], []).append(r)
famtab = sorted([dict(family=f, slogans=len(v), mean_p_buy=round(np.mean([x['p_buy'] for x in v]), 2), first_choice=round(sum(x['first_choice'] for x in v), 2), best=max(v, key=lambda x: x['p_buy'])['slogan']) for f, v in fams.items()], key=lambda x: -x['mean_p_buy'])
json.dump(dict(label='SIMULATED - not demand evidence', shoppers=N, ranked=rank, families=famtab, segment_winners=seg_win), open(os.path.join(HERE, f"results-{os.environ['ICP']}.json" if os.environ.get('ICP') else 'results.json'), 'w'), indent=1)
print(len(rows), 'slogans,', N, 'shoppers,', f'{young.mean()*100:.0f}% under 35, {woman.mean()*100:.0f}% women')
print('\nTOP 40'); [print(r['rank'], r['p_buy'], r['first_choice'], r['p_share'], f"u35 {r['under35_first']} / 35+ {r['over35_first']}", '|', r['family'], '|', r['slogan']) for r in rank[:40]]
print('\nBOTTOM 10'); [print(r['rank'], r['p_buy'], '|', r['family'], '|', r['slogan']) for r in rank[-10:]]
print('\nFAMILIES'); [print(f['mean_p_buy'], f['first_choice'], f['slogans'], '|', f['family'], '| best:', f['best']) for f in famtab]
print('\nSEGMENT WINNERS'); [print(k, '->', v) for k, v in seg_win.items()]
