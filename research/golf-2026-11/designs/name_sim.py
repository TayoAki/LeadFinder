#!/usr/bin/env python3
"""SIMULATED: which example crew name do golf shoppers pick? A data-weighted choice model (not demand evidence).

Each name is described by features taken from our research:
  familiarity  how many creators/brands in our golf data use its key words (log-scaled): the "fit in" score
  alliteration Bogey-Boys style sound
  tone         trip/belonging, club/lifestyle, humour, dad, women's group
  audience     men ("Boys"), anyone ("Club"), women ("Babes"/"Chicks")
Segments and their tastes match design_sim.py (same shares and sources). 20,000 shoppers; each has their own
spread on every taste. We report first-choice share, P(buy) and P(share), with bootstrap 95% intervals.
"""
import json, math, os
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__))

# creator/brand counts from our golf data (1,000 videos + 474 winning slideshows + 897 ads)
WORD = {'tee': 33, 'golf trip': 31, 'swing': 141, 'weekend': 12, 'range': 20, 'slice': 12, 'lip-out': 1, 'dad': 31, 'golf girl': 72}
GROUP = {'boys': 17, 'club': 57, 'girls': 18}
NAMES = [  # name, key word, group word, alliterative, tones, audience, place line
  ('Tee Time Boys', 'tee', 'boys', 1, dict(trip=.6, club=.4), 'men', 1),
  ('Golf Trip Boys', 'golf trip', 'boys', 0, dict(trip=1), 'men', 1),
  ('Sunday Swing Club', 'swing', 'club', 1, dict(club=1), 'all', 0),
  ('Weekend Swing Club', 'swing', 'club', 0, dict(club=1), 'all', 0),
  ('Range Day Club', 'range', 'club', 0, dict(club=.6, beginner=.6), 'all', 0),
  ('Slice Boys', 'slice', 'boys', 0, dict(humour=1), 'men', 1),
  ('Lip-Out Boys', 'lip-out', 'boys', 0, dict(humour=1), 'men', 1),
  ('Dad Bod Golf Club', 'dad', 'club', 1, dict(dad=.7, humour=.6), 'men', 0),
  ('Back Nine Babes', 'golf girl', 'girls', 1, dict(women=1), 'women', 1),
  ('Chip Chicks', 'golf girl', 'girls', 1, dict(women=1), 'women', 0),
]
fam = lambda w, g: (math.log1p(WORD[w]) / math.log1p(141) + math.log1p(GROUP[g]) / math.log1p(57)) / 2
# segment: share, share of women shoppers (or recipients), tone tastes   (shares/sources as in design_sim.py)
SEG = {
  'Trip / crew organiser':  (.14, .2, dict(trip=3, humour=1, club=.5, dad=.3)),
  'Gift buyer (partner / family)': (.18, .2, dict(trip=1.5, club=1, dad=1.5, humour=1)),   # buying mostly for men
  'Golf dad':               (.12, 0, dict(dad=3, trip=1, club=.5, humour=1)),
  'Style-led retro golfer': (.14, .25, dict(club=2.5, trip=1, humour=-1, dad=-1)),
  'Muni / public golfer':   (.10, .15, dict(humour=1.5, club=1, trip=1, dad=.5)),
  'Casual humour sharer':   (.14, .35, dict(humour=3, dad=2, trip=1, club=0)),
  'Women golfer / golf girl': (.10, 1, dict(women=2, club=1.5, trip=1, humour=.5)),
  'League / member-guest captain': (.04, .2, dict(club=2, trip=2, humour=.5)),
  'Beginner golfer':        (.04, .4, dict(humour=1.5, club=1, beginner=1.5)),
}
N, NOISE, HURDLE = 20000, .8, 7.0  # calibrated: an unknown brand converts a few % on a first visit
rng = np.random.default_rng(161126)
names = [n[0] for n in NAMES]; seg = list(SEG); shares = np.array([SEG[s][0] for s in seg]); shares /= shares.sum()
who = rng.choice(len(seg), N, p=shares)
U = np.zeros((N, len(NAMES))); woman = np.zeros(N, bool)
for si, s in enumerate(seg):
    m = who == si; k = int(m.sum()); _, fem, tone = SEG[s]
    w = rng.random(k) < fem; woman[m] = w
    for j, (name, kw, gw, allit, tones, aud, place) in enumerate(NAMES):
        u = 1.0 * fam(kw, gw) * 3 + .5 * allit                       # fit-in + catchiness (same for everyone)
        u = u + sum(tone.get(t, 0) * v for t, v in tones.items())     # segment taste
        u = u + rng.normal(0, NOISE, k)                               # person-to-person spread
        if place: u = u + .3 * tone.get('trip', 0) / 3                # a real trip place helps trip-minded people
        if aud == 'men': u = np.where(w, u - 2.5, u)
        if aud == 'women': u = np.where(w, u + 1.5 + rng.normal(-.4, 1, k), u - 3)  # some women find Babes/Chicks dated
        U[m, j] = u
first = U.argmax(1); Pbuy = 1 / (1 + np.exp(-(U - HURDLE))); Pshare = 1 / (1 + np.exp(-(U - HURDLE + 1.2)))
def boot(f):
    v = np.array([f(rng.integers(0, N, N)) for _ in range(300)]); return np.percentile(v, [2.5, 97.5], 0)
fc = np.bincount(first, minlength=len(NAMES)) / N; fc_ci = boot(lambda i: np.bincount(first[i], minlength=len(NAMES)) / N)
pb = Pbuy.mean(0); pb_ci = boot(lambda i: Pbuy[i].mean(0))
out = []
for j, n in enumerate(names):
    out.append(dict(name=n, first_choice_pct=round(fc[j] * 100, 1), first_choice_ci=f'{fc_ci[0][j]*100:.1f}–{fc_ci[1][j]*100:.1f}', p_buy_pct=round(pb[j] * 100, 1), p_buy_ci=f'{pb_ci[0][j]*100:.1f}–{pb_ci[1][j]*100:.1f}',
                    p_share_pct=round(Pshare[:, j].mean() * 100, 1), familiarity=round(fam(NAMES[j][1], NAMES[j][2]), 2),
                    women_first_pct=round(float((first[woman] == j).mean()) * 100, 1), men_first_pct=round(float((first[~woman] == j).mean()) * 100, 1),
                    winner_in=[s for si, s in enumerate(seg) if np.bincount(first[who == si], minlength=len(NAMES)).argmax() == j]))
out.sort(key=lambda r: -r['first_choice_pct'])
json.dump(dict(label='SIMULATED - not demand evidence', shoppers=N, women_share=round(float(woman.mean()) * 100, 1), names=out), open(os.path.join(HERE, 'names-model.json'), 'w'), indent=1)
print(f"{N} shoppers ({woman.mean()*100:.0f}% women)")
for r in out: print(f"{r['first_choice_pct']:5}% first ({r['first_choice_ci']}) | buy {r['p_buy_pct']}% | share {r['p_share_pct']}% | men {r['men_first_pct']}% women {r['women_first_pct']}% | fam {r['familiarity']} | {r['name']} | wins: {', '.join(r['winner_in']) or '-'}")
