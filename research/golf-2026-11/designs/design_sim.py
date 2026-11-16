#!/usr/bin/env python3
"""1,000 front designs for the Ivory Sunwashed Rope Cap, scored by a SIMULATED panel of golf shoppers.

SIMULATED, NOT DEMAND EVIDENCE. The panel's segments and preferences are built from our golf research (cited
next to every number below); the model turns those into purchase probabilities. Use it to choose what to TEST
first, then let real saves/shares/orders decide.

Model (a standard random-utility / logit choice model):
  utility(person, design) = sum of the person's part-worths for the design's parts (theme, lettering, icon,
                            size, colourway, personalised) + person-level noise on every part-worth
  P(buy) = logistic(utility - price_penalty - base_hurdle)
  first choice = the design with the highest utility for that person
We draw 20,000 shoppers from the segment mix, report each design's mean P(buy) and first-choice share with
bootstrap 95% intervals, then re-run under different segment mixes (sensitivity) to see if the winner holds.

    python3 design_sim.py  ->  designs.csv, results.json, report.md, golf-designs.xlsx
"""
import csv, itertools, json, os, random
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
rng = np.random.default_rng(16112026); random.seed(16112026)

# ------------------------------------------------------------------ design parts
# Themes and the wording each can carry. {CREW} {PLACE} {YEAR} {DATE} are filled by the buyer (personalised).
THEMES = {
  'crew_trip':      dict(p=True,  label='Crew + trip + year', texts=['{CREW} / {PLACE} · {YEAR}', '{CREW} / GOLF TRIP {YEAR}', '{CREW} / EST. {YEAR}', '{CREW} / {PLACE} INVITATIONAL']),
  'milestone':      dict(p=True,  label='Milestone date', texts=['FIRST ROUND / {DATE}', 'FIRST BIRDIE / HOLE 7 · {YEAR}', 'HOLE IN ONE / {DATE}', 'BROKE 100 / {DATE}']),
  'dad_kid':        dict(p=True,  label='Dad & kid', texts=["DAD'S CADDIE", 'CADDIE / {CREW}', 'TEAM DAD / EST. {YEAR}', 'GOLF DAD / {CREW}']),
  'humour_handicap':dict(p=False, label='Handicap humour', texts=['30 HANDICAP CLUB', 'BOGEY FREE SINCE NEVER', 'MULLIGAN SOCIETY', 'SANDBAGGERS ANONYMOUS', 'SHANK YOU VERY MUCH']),
  'humour_lingo':   dict(p=False, label='Golf-lingo humour', texts=['GRIP IT & SIP IT', 'IN THE RECOVERY POSITION', 'PLAYING THROUGH', 'FORE PLAY', 'BIRDIE JUICE CLUB']),
  'muni_public':    dict(p=False, label='Muni / public pride', texts=['PUBLIC COURSE PEOPLE', 'MUNI GOLF / NO DRESS CODE', 'TEE TIMES NOT MEMBERSHIPS', 'PUBLIC LINKS SOCIETY']),
  'muni_crew':      dict(p=True,  label='Muni crew (personalised)', texts=['{CREW} / PUBLIC LINKS', '{CREW} / MUNI GOLF {YEAR}']),
  'clubhouse':      dict(p=False, label='Retro clubhouse classic', texts=['DOGLEG CLUB', 'MEET YOU AT THE TURN', '19TH HOLE', 'FIRST TEE 6:42', 'CLUBHOUSE RULES']),
  'place':          dict(p=True,  label='Your city / town', texts=['{PLACE} / GOLF CLUB', '{PLACE} / LINKS', '{PLACE} GOLF / EST. {YEAR}']),
  'minimal_icon':   dict(p=False, label='Icon only', texts=['(icon only)']),
  'gift_line':      dict(p=False, label='Gift cliché', texts=["WORLD'S OKAYEST GOLFER", 'GOLF IS MY THERAPY', 'BORN TO GOLF / FORCED TO WORK']),
  'women_golf':     dict(p=False, label='Women\'s golf social', texts=['GOLF GIRL SOCIETY', 'FAIRWAY SOCIAL CLUB', 'TEE TIME & MATCHA']),
}
LETTERING = ['retro script', 'varsity arch', 'stacked block caps', 'serif small caps', 'handwritten']
ICONS = ['none', 'flag', 'crossed clubs', 'tee', 'golf cart', 'dogleg arrow']
SIZES = ['small centred', 'medium centred', 'bold full-front']
COLOURS = ['Ivory / forest green', 'Ivory / navy', 'Chambray / cream', 'Black / white', 'Granite / black', 'Peachy / espresso', 'Espresso / cream']

# 1,000 distinct designs: every theme gets a fair share, parts sampled without repeats.
designs, seen = [], set()
themes = list(THEMES); fails = {t: 0 for t in themes}; turn = 0
while len(designs) < 1000:
    live = [t for t in themes if fails[t] < 400] # a theme with few possible combinations (icon only) drops out once used up
    t = live[turn % len(live)]; turn += 1
    text = random.choice(THEMES[t]['texts'])
    let, icon, size, col = random.choice(LETTERING), random.choice(ICONS), random.choice(SIZES), random.choice(COLOURS)
    if t == 'minimal_icon': let, size = 'none', 'small centred'; icon = icon if icon != 'none' else 'flag'
    key = (t, text, let, icon, size, col)
    if key in seen: fails[t] += 1; continue
    seen.add(key)
    designs.append(dict(id=f'D{len(designs)+1:04d}', theme=t, theme_label=THEMES[t]['label'], personalised=THEMES[t]['p'], text=text, lettering=let, icon=icon, size=size, colour=col))

# ------------------------------------------------------------------ the ICP panel (from our research)
# share = how much of the buying audience each segment is. part-worths are on a -3..+3 scale.
SEGMENTS = {
  'Trip / crew organiser': dict(share=.14, src='Simulation: highest conversion (20%); trip creator videos median 118k views; "golf trip" top keyword',
      theme=dict(crew_trip=3, muni_crew=2, place=1.5, clubhouse=1, humour_handicap=1, humour_lingo=.5, milestone=.5, dad_kid=-.5, gift_line=-1.5, women_golf=-1, minimal_icon=0, muni_public=.5),
      pers=1.0, size={'bold full-front': .3}, colour={}, price_sens=.3),
  'Gift buyer (partner / family)': dict(share=.18, src='Gift ideas = best-saved proven golf slideshow formula (50 winners, 42 creators); 9 of 17 brands run gift ads; mid-November',
      theme=dict(milestone=2.5, crew_trip=1.5, dad_kid=1.5, place=1.5, clubhouse=1, humour_handicap=1, gift_line=1, humour_lingo=0, muni_public=0, muni_crew=.5, minimal_icon=-.5, women_golf=-.5),
      pers=1.2, size={'small centred': .2}, colour={'Ivory / forest green': .2, 'Ivory / navy': .2}, price_sens=.2),
  'Golf dad': dict(share=.12, src='#dad #family top hashtags among Melin taggers; Vice dad/kid ads ran 294 days; "Daddy daughter day" 13M views',
      theme=dict(dad_kid=3, milestone=2, crew_trip=1.5, humour_handicap=1, clubhouse=.5, place=.5, muni_public=.5, muni_crew=.5, humour_lingo=-.5, gift_line=-.5, minimal_icon=0, women_golf=-2),
      pers=.8, size={}, colour={'Ivory / navy': .3, 'Black / white': .2}, price_sens=.4),
  'Style-led retro golfer (Malbon/Melin crowd)': dict(share=.14, src='Malbon = strongest outlier among Melin fans (18 people, lift 5.3); simulation: style-led 0% buy for loud/novelty designs',
      theme=dict(clubhouse=2.5, minimal_icon=2, place=1.5, crew_trip=1, muni_public=1, muni_crew=.5, milestone=0, humour_lingo=-1, humour_handicap=-1, dad_kid=-1, gift_line=-3, women_golf=-1),
      pers=0, size={'small centred': .8, 'bold full-front': -1.2}, colour={'Ivory / forest green': .6, 'Chambray / cream': .5, 'Espresso / cream': .4, 'Peachy / espresso': .2}, lettering={'retro script': .5, 'serif small caps': .5, 'varsity arch': .3, 'handwritten': -.4}, price_sens=.1),
  'Muni / public golfer': dict(share=.10, src='"muni golf"/"muni golfer" 3,600 US searches/mo each, steady; "municipal golf course" 12,100/mo; price-conscious',
      theme=dict(muni_public=3, muni_crew=2.5, humour_handicap=1.5, crew_trip=1, place=1, humour_lingo=1, clubhouse=.5, milestone=0, dad_kid=0, minimal_icon=0, gift_line=-1, women_golf=-1),
      pers=.2, size={}, colour={'Black / white': .3, 'Granite / black': .3}, price_sens=.8),
  'Casual humour sharer': dict(share=.14, src='Relatable golf humour = most shared slideshow formula (14.7 shares/1k, 401x followers); "30 handicap activities" 4M views',
      theme=dict(humour_handicap=3, humour_lingo=2, muni_public=1, crew_trip=1, gift_line=.5, clubhouse=0, milestone=0, dad_kid=0, place=0, minimal_icon=-1, women_golf=-.5, muni_crew=.5),
      pers=-.3, size={'bold full-front': .5, 'small centred': -.2}, colour={}, price_sens=.7),
  'Women golfer / golf girl': dict(share=.10, src='Outfit-inspo slideshows: 85 winners from 72 creators, mostly women; "golf girl" a top creator tag',
      theme=dict(women_golf=2.5, clubhouse=1.5, minimal_icon=1.5, milestone=1, crew_trip=1, place=1, humour_lingo=.5, humour_handicap=0, muni_public=0, dad_kid=-1.5, gift_line=-2, muni_crew=0),
      pers=.3, size={'small centred': .6, 'bold full-front': -.6}, colour={'Peachy / espresso': .8, 'Ivory / forest green': .4, 'Chambray / cream': .4, 'Black / white': -.2}, lettering={'retro script': .6, 'handwritten': .3}, price_sens=.3),
  'League / member-guest captain': dict(share=.04, src='Community angle kept 55% in golf ads; league accounts are Melin-fan outliers',
      theme=dict(crew_trip=2.5, muni_crew=2, place=1.5, clubhouse=1, humour_handicap=.5, milestone=0, dad_kid=-1, gift_line=-1.5, women_golf=-.5, minimal_icon=0, muni_public=.5, humour_lingo=0),
      pers=1.0, size={}, colour={}, price_sens=.3),
  'Beginner golfer': dict(share=.04, src='Tips/basics = biggest proven slideshow formula (121 winners) - big beginner audience',
      theme=dict(milestone=2, humour_handicap=2, humour_lingo=1, muni_public=1, crew_trip=.5, clubhouse=.5, place=.5, gift_line=.5, dad_kid=0, minimal_icon=0, women_golf=.5, muni_crew=.5),
      pers=.3, size={}, colour={}, price_sens=.6),
}
# Shared preferences (all segments): embroidery reads best simple; text-heavy fronts score lower.
ICON_PW = {'none': 0, 'flag': .3, 'crossed clubs': .1, 'tee': .1, 'golf cart': 0, 'dogleg arrow': .2}
LETTER_PW = {'retro script': .2, 'varsity arch': .25, 'stacked block caps': .1, 'serif small caps': .1, 'handwritten': -.1, 'none': 0}
PRICE = {True: 38, False: 34}         # Crew Cap vs Classic (brand plan)
HURDLE = 3.4                           # calibrates average P(buy) to a few % (first-visit, unknown brand, no reviews)
NOISE = 0.7                            # person-to-person spread on every part-worth

# ------------------------------------------------------------------ simulate
N = 20000
seg_names = list(SEGMENTS); shares = np.array([SEGMENTS[s]['share'] for s in seg_names]); shares /= shares.sum()
def simulate(shares, n=N, seed=1):
    r = np.random.default_rng(seed)
    who = r.choice(len(seg_names), size=n, p=shares)
    D = len(designs); U = np.zeros((n, D))
    th_idx = {t: i for i, t in enumerate(THEMES)}
    for si, s in enumerate(seg_names):
        m = who == si; k = int(m.sum())
        if not k: continue
        S = SEGMENTS[s]
        th_pw = np.array([S['theme'].get(t, 0) for t in THEMES])
        th_draw = th_pw + r.normal(0, NOISE, (k, len(THEMES)))                   # each person's own theme taste
        pers_draw = S['pers'] + r.normal(0, NOISE, k)
        size_pw = {z: S['size'].get(z, 0) for z in SIZES}
        col_pw = {c: S['colour'].get(c, 0) for c in COLOURS}
        let_pw = {l: LETTER_PW.get(l, 0) + S.get('lettering', {}).get(l, 0) for l in LETTERING + ['none']}
        fixed = np.array([size_pw[d['size']] + col_pw[d['colour']] + let_pw[d['lettering']] + ICON_PW[d['icon']] - S['price_sens'] * (PRICE[d['personalised']] - 34) / 4 for d in designs])
        tcol = np.array([th_idx[d['theme']] for d in designs]); pcol = np.array([1.0 if d['personalised'] else 0.0 for d in designs])
        U[m] = th_draw[:, tcol] + pers_draw[:, None] * pcol[None, :] + fixed[None, :] + r.normal(0, 0.35, (k, D))  # + taste for the exact design
    P = 1 / (1 + np.exp(-(U - HURDLE)))
    first = U.argmax(1)
    return who, P, first

who, P, first = simulate(shares)
mean_p = P.mean(0); fc = np.bincount(first, minlength=len(designs)) / N
# bootstrap 95% intervals (resample shoppers)
B = 100; bs_p = np.zeros((B, len(designs))); bs_fc = np.zeros((B, len(designs)))
for b in range(B):
    idx = rng.integers(0, N, N); bs_p[b] = P[idx].mean(0); bs_fc[b] = np.bincount(first[idx], minlength=len(designs)) / N
lo_p, hi_p = np.percentile(bs_p, [2.5, 97.5], 0); lo_fc, hi_fc = np.percentile(bs_fc, [2.5, 97.5], 0)
for i, d in enumerate(designs):
    d.update(p_buy=round(float(mean_p[i]) * 100, 2), p_buy_ci=f'{lo_p[i]*100:.2f}–{hi_p[i]*100:.2f}', first_choice_pct=round(float(fc[i]) * 100, 2), first_choice_ci=f'{lo_fc[i]*100:.2f}–{hi_fc[i]*100:.2f}')
    d['by_segment'] = {s: round(float(P[who == si, i].mean()) * 100, 1) for si, s in enumerate(seg_names)}
ranked = sorted(designs, key=lambda d: -d['p_buy'])
for r_, d in enumerate(ranked, 1): d['rank'] = r_

# theme-level and part-level summaries
def summarise(key):
    out = {}
    for d in designs: out.setdefault(d[key], []).append(d)
    return sorted([dict(value=k, designs=len(v), mean_p_buy=round(np.mean([x['p_buy'] for x in v]), 2), best_p_buy=max(x['p_buy'] for x in v), first_choice_pct=round(sum(x['first_choice_pct'] for x in v), 1)) for k, v in out.items()], key=lambda x: -x['mean_p_buy'])
parts = {k: summarise(k) for k in ['theme_label', 'lettering', 'icon', 'size', 'colour', 'personalised']}

# sensitivity: does the winning THEME hold if the audience mix changes?
def theme_winner(sh, seed):
    _, P2, f2 = simulate(sh, n=8000, seed=seed)
    m = P2.mean(0); by = {}
    for i, d in enumerate(designs): by.setdefault(d['theme_label'], []).append(m[i])
    best = sorted(by.items(), key=lambda kv: -np.mean(kv[1]))
    return [b[0] for b in best[:3]]
scen = {'base (Nov, gift season)': shares}
def tweak(**kw):
    s = shares.copy()
    for name, mult in kw.items(): s[seg_names.index(name)] *= mult
    return s / s.sum()
scen['after the holidays (gift buyers ÷3)'] = tweak(**{'Gift buyer (partner / family)': 1/3})
scen['style-led doubled'] = tweak(**{'Style-led retro golfer (Malbon/Melin crowd)': 2})
scen['humour sharers doubled (organic TikTok traffic)'] = tweak(**{'Casual humour sharer': 2})
scen['trip organisers halved'] = tweak(**{'Trip / crew organiser': .5})
scen['muni golfers doubled'] = tweak(**{'Muni / public golfer': 2})
sens = {k: theme_winner(v, 7 + i) for i, (k, v) in enumerate(scen.items())}

# ------------------------------------------------------------------ write
with open(os.path.join(HERE, 'designs.csv'), 'w', newline='') as fh:
    cols = ['rank', 'id', 'theme_label', 'text', 'personalised', 'lettering', 'icon', 'size', 'colour', 'p_buy', 'p_buy_ci', 'first_choice_pct', 'first_choice_ci'] + seg_names
    w = csv.writer(fh); w.writerow(cols)
    for d in ranked: w.writerow([d[c] for c in cols[:13]] + [d['by_segment'][s] for s in seg_names])
json.dump(dict(label='SIMULATED - not demand evidence', n_shoppers=N, segments={s: dict(share=SEGMENTS[s]['share'], source=SEGMENTS[s]['src']) for s in seg_names},
               top20=ranked[:20], parts=parts, sensitivity=sens), open(os.path.join(HERE, 'results.json'), 'w'), indent=1)
print('TOP 15'); [print(d['rank'], d['id'], d['p_buy'], d['p_buy_ci'], d['first_choice_pct'], '|', d['theme_label'], '|', d['text'], '|', d['lettering'], d['icon'], d['size'], d['colour']) for d in ranked[:15]]
print('\nTHEMES'); [print(x) for x in parts['theme_label']]
for k in ['lettering', 'icon', 'size', 'colour', 'personalised']: print('\n' + k.upper()); [print(x) for x in parts[k]]
print('\nSENSITIVITY'); [print(k, '->', v) for k, v in sens.items()]
