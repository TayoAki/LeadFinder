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

# segment: share, P(under 35), P(woman), humour, group, plain-golf taste, brag taste
SEG = {'Trip / crew organiser': (.14, .35, .2, .8, 1.5, .3, .3), 'Gift buyer': (.18, .4, .2, .6, .3, .4, .6), 'Golf dad': (.12, .1, 0, .8, .4, .4, .3),
       'Style-led retro golfer': (.14, .4, .25, -.3, .2, .9, .2), 'Muni / public golfer': (.10, .4, .15, 1.0, .5, .3, .2), 'Casual humour sharer': (.14, .9, .35, 1.8, .4, -.2, 0),
       'Women golfer': (.10, .6, 1.0, .5, .4, .3, .5), 'League captain': (.04, .2, .2, .6, 1.5, .4, .3), 'Beginner': (.04, .5, .4, 1.0, .3, .2, .4)}
N, NOISE, HURDLE = 20000, .9, 4.6
rng = np.random.default_rng(1611)
seg = list(SEG); sh = np.array([SEG[s][0] for s in seg]); sh /= sh.sum(); who = rng.choice(len(seg), N, p=sh)
young = np.zeros(N, bool); woman = np.zeros(N, bool); U = np.zeros((N, len(rows)), np.float32)
for si, s in enumerate(seg):
    m = who == si; k = int(m.sum()); _, py, pw, h, g, plain, brag = SEG[s]
    y = rng.random(k) < py; w = rng.random(k) < pw; young[m] = y; woman[m] = w
    yy = y[:, None].astype(float); ww = w[:, None].astype(float)
    base = (.25 * F['familiar'] - .05 * np.maximum(0, F['chars'] - 16) + h * .6 * F['humour'] + g * .8 * F['group'] + brag * .8 * F['brag'] + plain * .6 * (F['slang'] == 0) - .6 * F['borrow'])
    slang_eff = yy * (.35 * F['slang'] - .3 * F['dated']) + (1 - yy) * (-.55 * F['slang'] - .4 * F['borrow'] - .1 * F['dated'])
    crude_eff = -(.7 if s in ('Gift buyer', 'Golf dad') else .35) * F['crude'] * (1 - .6 * yy)
    women_eff = ww * (1.0 * F['women']) - (1 - ww) * (2.5 * F['women'])
    U[m] = (base[None, :] + slang_eff + crude_eff + women_eff + rng.normal(0, NOISE, (k, len(rows)))).astype(np.float32)
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
json.dump(dict(label='SIMULATED - not demand evidence', shoppers=N, ranked=rank, families=famtab, segment_winners=seg_win), open(os.path.join(HERE, 'results.json'), 'w'), indent=1)
print(len(rows), 'slogans,', N, 'shoppers,', f'{young.mean()*100:.0f}% under 35, {woman.mean()*100:.0f}% women')
print('\nTOP 40'); [print(r['rank'], r['p_buy'], r['first_choice'], r['p_share'], f"u35 {r['under35_first']} / 35+ {r['over35_first']}", '|', r['family'], '|', r['slogan']) for r in rank[:40]]
print('\nBOTTOM 10'); [print(r['rank'], r['p_buy'], '|', r['family'], '|', r['slogan']) for r in rank[-10:]]
print('\nFAMILIES'); [print(f['mean_p_buy'], f['first_choice'], f['slogans'], '|', f['family'], '| best:', f['best']) for f in famtab]
print('\nSEGMENT WINNERS'); [print(k, '->', v) for k, v in seg_win.items()]
