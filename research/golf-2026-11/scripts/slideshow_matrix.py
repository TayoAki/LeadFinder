#!/usr/bin/env python3
"""Build the slideshow test matrix for the golf hat brand: every angle x hook x slide format x call to action,
with cover text, slide-by-slide outline, why it should work (evidence), a fit score, and a first test wave.

    python3 slideshow_matrix.py  -> ../golf-slideshow-tests.xlsx and ../golf-slideshow-combos.csv
"""
import csv, itertools, json, os
from openpyxl import Workbook
from openpyxl.styles import Alignment, Font, PatternFill
from openpyxl.utils import get_column_letter

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '..')

# ---------------------------------------------------------------- building blocks
# strength = how much real evidence backs the angle (1-5). Evidence strings cite what we measured.
ANGLES = [
  dict(id='A1', name='Buddy trip crew hats', strength=5,
       who='Friend groups planning a golf trip', promise='Matching caps with the crew name, trip and year',
       evidence='0 of 4 hat leaders (Melin, Goorin, Ampal, Coal) sell personalised hats; "custom embroidered hats" 18,100 US searches/mo at $6.01 CPC; "golf trip" is a top creator keyword; Melin taggers use #golf #travel #hawaii.',
       items=['The crew name on the front', 'Trip + year on the side ("SCOTTSDALE 26")', 'Everyone\'s handicap on the back', 'One colour per foursome', 'The loser\'s hat (yes, really)'],
       before='Blank cap from the airport shop', after='"BANDON 26 — THE BOGEY BOYS" stitched',
       chat=['Who\'s sorting hats for the trip?', 'Me. Sending the mock-up now', '...we\'re ordering 8'], rank='trip hat ideas', problem='Every trip photo looks the same', solution='Hats with the trip stitched on',
       covers={'list': '5 hat ideas for your golf trip crew', 'pov': 'POV: you sorted the hats for the golf trip', 'question': 'Does your golf crew have matching hats yet?', 'bold': 'A golf trip without matching hats is just a work trip', 'relatable': 'Every golf trip group chat the week before'}),
  dict(id='A2', name='Gift for the golfer', strength=4,
       who='Partners, kids and friends buying for a golfer (Nov-Dec)', promise='A gift with their name, course or home-hole on it',
       evidence='9 of 17 golf brands are running gift ads right now (Keepwatch); gift + discount angles are crowded and short-lived (9-11% kept 30+ days) — so lead with personal, not price; "custom embroidered" CPC $5-9 shows buyers pay for personal.',
       items=['Their home course on the front', 'Their best score + date on the side', 'Their nickname from the group', 'Their first hole-in-one (date + hole)', 'A matching one for you'],
       before='Another sleeve of golf balls', after='A cap with their home course stitched on',
       chat=['What do I get my dad for Christmas', 'He has every golf thing', 'Not one with his course on it'], rank='golf gifts under $40', problem='Golfers already own every gadget', solution='Something that\'s only theirs',
       covers={'list': '5 golf gifts they don\'t already own', 'pov': 'POV: you finally found a gift for the golfer who has everything', 'question': 'What do you get the golfer who has everything?', 'bold': 'Stop buying golfers golf balls', 'relatable': 'Me trying to buy a gift for my dad who golfs'}),
  dict(id='A3', name='Golf dad (and kid)', strength=4,
       who='Dads who golf, and their families', promise='Matching dad-and-kid caps',
       evidence='Vice Golf\'s dad/kid ads ran 294 days ("Want your kid to love golf", "If I take my son golfing…"); #dad #family are top hashtags among people who tag Melin; Melin fans skew golf + active family life.',
       items=['Matching dad + kid caps', '"Caddie" on the kid\'s', 'First round together, dated', 'Dad\'s handicap vs kid\'s (generous)', 'Mum gets one too'],
       before='Dad in his old tour cap', after='Dad + kid in matching "CADDIE / BOSS" caps',
       chat=['Can I come golfing?', 'Only if you wear the uniform', '(two matching hats)'], rank='dad + kid golf gear', problem='Getting your kid excited about golf', solution='Make them part of the team',
       covers={'list': '5 ways to get your kid hooked on golf', 'pov': 'POV: your kid wants to be your caddie', 'question': 'Golf dads, does your caddie have a uniform?', 'bold': 'The best golf partner is 4 feet tall', 'relatable': 'Golf dads the first time their kid tags along'}),
  dict(id='A4', name='Fit check: the hat finishes it', strength=4,
       who='Style-led golfers (Malbon/lululemon/Nike crowd)', promise='The cap that completes the outfit',
       evidence='Style is the #1 angle across all 17 golf brands\' ads (338 ads, 44% kept 30+ days); Melin people tag lululemon (17), Malbon (18, lift 5.3), Nike; "fit check" and outfit posts are top golf creator formats.',
       items=['Polo + neutral dad cap', 'Quarter-zip + rope hat', 'All-black + white trucker', 'Hoodie + corduroy cap', 'Your initials, small, left side'],
       before='Great outfit, tired logo hat', after='Same outfit, clean custom cap',
       chat=['Rate my fit for Saturday', '8/10, the hat\'s doing nothing', 'Fixed it'], rank='golf fits by hat', problem='The hat ruins half of golf outfits', solution='Match the cap to the fit',
       covers={'list': '5 golf fits, ranked by the hat', 'pov': 'POV: the hat finally matches the fit', 'question': 'Is your hat ruining your golf fit?', 'bold': 'The hat is 50% of a golf fit', 'relatable': 'When the fit\'s perfect but the hat isn\'t'}),
  dict(id='A5', name='Blank to stitched (before/after)', strength=4,
       who='Anyone curious how custom hats are made', promise='Watch your idea become a real cap',
       evidence='Keepwatch: "Before and after" is OPEN GROUND — 0 of 17 golf brands run it; product demos are barely used (2 brands). The reveal format earns saves without a body or a claim.',
       items=['The blank cap', 'The idea (a text or a napkin sketch)', 'The mock-up', 'The stitching close-up', 'On the head at the 1st tee'],
       before='Blank cap', after='Finished embroidered cap',
       chat=['Can you put our crew name on a hat?', 'Send me the name', '(before/after)'], rank='custom hat reveals', problem='Custom hats usually need 24+ minimum', solution='Made one at a time',
       covers={'list': 'From napkin sketch to golf hat in 5 steps', 'pov': 'POV: you sent us your crew\'s inside joke', 'question': 'Want to see a blank cap become yours?', 'bold': 'This hat was a text message 10 days ago', 'relatable': 'Your group chat idea vs the hat that showed up'}),
  dict(id='A6', name='Member-guest / league team', strength=3,
       who='League captains, member-guest pairs, club events', promise='Team caps without a 48-hat minimum',
       evidence='Community angle is kept 55% of the time in golf ads (Keepwatch); league/team accounts (LA Golf Club, WTGL) show up as outliers among Melin fans; custom-hat sellers usually require bulk minimums.',
       items=['Team name on the front', 'Event + year on the side', 'Each player\'s name on the back', 'Winners get the gold one', 'Next year\'s rematch date'],
       before='Twelve guys in twelve different hats', after='One team, one cap',
       chat=['Member-guest is in 3 weeks', 'We need a team name', 'And hats'], rank='team hat ideas', problem='Team gear needs huge minimum orders', solution='Order exactly the number you need',
       covers={'list': '5 team hat ideas for your member-guest', 'pov': 'POV: your league finally has team hats', 'question': 'What\'s your member-guest team name?', 'bold': 'You don\'t need 48 hats to have team hats', 'relatable': 'Every league captain the week before the season'}),
  dict(id='A7', name='Types of golfers (humour)', strength=4,  # creator trends: "We all know the guy. Tag him." 2.4M; funny/skit median 117k views
       who='Every golfer who knows these people', promise='A hat for every golfer in your group',
       evidence='"Things golfers say/do" is a recurring creator format; humour drives sends to the group chat (shares). Personalised hats turn each "type" into a product.',
       items=['The "I usually hit it 300" guy', 'The one who brings a speaker', 'The rules official', 'The one who only plays scrambles', 'The 19th-hole MVP'],
       before='Your group as it is', after='Your group, labelled',
       chat=['Which one are you', 'Definitely the speaker guy', 'Ordering his hat'], rank='golfer types', problem='Every group has these people', solution='Give them the hat',
       covers={'list': '5 golfers in every group (tag yours)', 'pov': 'POV: you\'re the golfer who brings the speaker', 'question': 'Which golfer are you in your group?', 'bold': 'Every foursome has one of these', 'relatable': 'The 4 golfers in every group chat'}),
  dict(id='A8', name='Which golf hat suits you (guide)', strength=3,
       who='Golfers choosing a cap style', promise='Pick the right cap shape in 10 seconds',
       evidence='Printify\'s deepest hat range is dad caps (161) and truckers (88); "trucker hat" 74,000 and "dad hat" 33,100 US searches/mo; how-to guides are saved more than they are liked.',
       items=['Dad cap: relaxed, low profile', 'Trucker: mesh back, hot days', 'Rope cap: retro clubhouse', 'Corduroy: autumn rounds', 'Beanie: winter range sessions'],
       before='The wrong cap for your round', after='The right one',
       chat=['Trucker or dad hat for the course?', 'Depends on the weather', 'Here\'s the cheat sheet'], rank='golf hat styles', problem='Not sure which cap style to buy', solution='One guide, one cap per situation',
       covers={'list': '5 golf hat styles and when to wear each', 'pov': 'POV: you finally know which golf hat suits you', 'question': 'Trucker or dad hat on the course?', 'bold': 'Most golfers wear the wrong hat for the weather', 'relatable': 'Me standing in the pro shop for 20 minutes'}),
  dict(id='A9', name='Golf bachelor party', strength=3,
       who='Best men planning a golf bachelor weekend', promise='Matching caps for the groom\'s crew',
       evidence='"Bachelorette trucker hats" 260 US searches/mo proves group-hat buying for parties; "golf bachelor party" is a creator search; the groom-and-crew group order is 8-12 hats at once.',
       items=['"GROOM" for him', '"BEST MAN" for you', 'The wedding date on the side', 'The bachelor-trip course', 'One for the father of the bride'],
       before='The group in random hats', after='The groom\'s crew, matching',
       chat=['Bach party is golf in Scottsdale', 'Hats?', 'Hats.'], rank='bachelor golf trip ideas', problem='Bachelor trips need a uniform', solution='Matching caps with the date',
       covers={'list': '5 musts for a golf bachelor party', 'pov': 'POV: you\'re the best man and you sorted the hats', 'question': 'Golf bachelor party, what\'s the uniform?', 'bold': 'Bachelor parties should be golf trips', 'relatable': 'The best man the week of the bachelor trip'}),
  dict(id='A10', name='Comment your crew name (mock-up loop)', strength=3,
       who='Anyone with a group: golf, run club, surf crew', promise='Comment your crew name and see it on a hat',
       evidence='Melin fans also run and surf (Bandit, Deadlast, Surfline, WSL) — crews beyond golf; personalisation is the one thing big hat brands can\'t do; comments feed the algorithm and give a reason to come back.',
       items=['Your comment', 'Our mock-up', 'The thread\'s favourite', 'The one we\'re making', 'Next week: yours?'],
       before='A comment', after='A mock-up on the hat',
       chat=['Comment your crew name', '"THE SHANKSHAW REDEMPTION"', '(mock-up)'], rank='your crew names', problem='Your crew has a name but no merch', solution='Comment it, we\'ll mock it up',
       covers={'list': 'We mocked up your crew names on golf hats', 'pov': 'POV: your crew name is finally on a hat', 'question': 'What\'s your golf crew called? We\'ll mock it up', 'bold': 'Your group chat name deserves a hat', 'relatable': 'Crew names we\'re obsessed with this week'}),
]

HOOKS = [
  dict(id='H1', key='list', name='Number list', why='Numbered covers set a clear promise and invite swiping to the end.'),
  dict(id='H2', key='pov', name='POV', why='POV puts the viewer in the moment; a top golf creator format.'),
  dict(id='H3', key='question', name='Question', why='A question cover earns comments (answers), and comments push reach.'),
  dict(id='H4', key='bold', name='Bold / contrarian line', why='A strong opinion gets debate in the comments and stops the scroll.'),
  dict(id='H5', key='relatable', name='Relatable / "every golfer"', why='Relatable humour gets sent to group chats (shares).'),
]

FORMATS = [
  dict(id='F1', name='Listicle (one idea per slide)', slides='6-7', why='The most-saved slideshow shape across niches: one idea per slide, readable in 2 seconds.'),
  dict(id='F2', name='Before → after reveal', slides='4-5', why='Open ground in golf ads (0 brands); the reveal holds attention to the last slide.'),
  dict(id='F3', name='Group-chat story', slides='5-6', why='Text-message screenshots feel native and personal; mirrors how group orders actually start.'),
  dict(id='F4', name='Rank / rate it', slides='6-7', why='Ranking invites disagreement in the comments.'),
  dict(id='F5', name='Problem → fix → reveal (mini story)', slides='5', why='Sets up the product as the honest answer to a problem the viewer has.'),
]

CTAS = [
  dict(id='C1', name='Comment your crew name, we\'ll mock it up', last='Comment your crew name 👇 We\'ll mock up the best ones on a hat', measures='comments per 1k plays, mock-up requests', why='Turns viewers into a conversation and gives you the next post (the mock-ups).'),
  dict(id='C2', name='Send this to your group chat', last='Send this to the group chat that needs hats', measures='shares per 1k plays', why='Group orders start in group chats; shares are the strongest reach signal.'),
  dict(id='C3', name='Link in bio (order / gift deadline)', last='Made to order — link in bio. Order by Dec 10 for Christmas', measures='profile visits, link clicks, orders', why='Direct conversion; the deadline is real urgency (made to order). Check Printify production + shipping times before stating a date.'),
]

# how well each hook / format / CTA fits each angle (1 weak - 3 strong). Default 2.
HOOK_FIT = {('A1','list'):3,('A1','pov'):3,('A1','relatable'):3,('A2','question'):3,('A2','list'):3,('A2','bold'):3,('A3','pov'):3,('A3','relatable'):3,('A4','question'):3,('A4','list'):3,('A4','bold'):3,
            ('A5','bold'):3,('A5','pov'):3,('A6','question'):3,('A6','bold'):3,('A7','list'):3,('A7','relatable'):3,('A7','question'):3,('A8','list'):3,('A8','question'):3,('A9','pov'):3,('A9','list'):3,('A10','question'):3,('A10','list'):3,
            ('A5','relatable'):1,('A8','relatable'):1,('A8','pov'):1,('A10','pov'):1}
FMT_FIT = {('A1','F1'):3,('A1','F3'):3,('A1','F2'):3,('A2','F1'):3,('A2','F5'):3,('A3','F2'):3,('A3','F5'):3,('A4','F4'):3,('A4','F2'):3,('A5','F2'):3,('A5','F1'):3,('A6','F1'):3,('A6','F3'):3,('A7','F1'):3,('A7','F4'):3,
           ('A8','F1'):3,('A8','F5'):3,('A9','F1'):3,('A9','F3'):3,('A10','F2'):3,('A10','F4'):3,('A8','F3'):1,('A2','F4'):1,('A5','F4'):1,('A7','F2'):1}
CTA_FIT = {('A1','C2'):3,('A1','C1'):3,('A2','C3'):3,('A3','C2'):2,('A4','C3'):2,('A5','C1'):3,('A6','C2'):3,('A7','C2'):3,('A8','C3'):3,('A9','C2'):3,('A10','C1'):3,('A7','C3'):1,('A10','C3'):1,('A2','C1'):1}
fit = lambda m, a, k: m.get((a, k), 2)

def outline(a, f, cover, cta):
    it = a['items']
    if f['id'] == 'F1':
        s = [f'COVER: "{cover}"'] + [f'{i+2}. {x} (photo: the cap, mock-up text visible)' for i, x in enumerate(it)] + [f'{len(it)+2}. CTA: {cta["last"]}']
    elif f['id'] == 'F2':
        s = [f'COVER: "{cover}"', f'2. BEFORE: {a["before"]}', f'3. The idea / the mock-up', f'4. AFTER: {a["after"]} (stitching close-up)', f'5. On the head, on the course', f'6. CTA: {cta["last"]}']
    elif f['id'] == 'F3':
        c = a['chat']
        s = [f'COVER: "{cover}"', f'2. Text bubble: "{c[0]}"', f'3. Text bubble: "{c[1]}"', f'4. Text bubble: "{c[2]}" + the mock-up', '5. The hats, the whole group wearing them', f'6. CTA: {cta["last"]}']
    elif f['id'] == 'F4':
        s = [f'COVER: "{cover}"'] + [f'{i+2}. #{len(it)-i} {x}' for i, x in enumerate(it)] + [f'{len(it)+2}. CTA: {cta["last"]}']
    else:
        s = [f'COVER: "{cover}"', f'2. The problem: {a["problem"]}', f'3. Why the usual fix fails', f'4. The fix: {a["solution"]}', f'5. The reveal: {a["after"]}', f'6. CTA: {cta["last"]}']
    return '\n'.join(s)

rows = []
for a, h, f, c in itertools.product(ANGLES, HOOKS, FORMATS, CTAS):
    hf, ff, cf = fit(HOOK_FIT, a['id'], h['key']), fit(FMT_FIT, a['id'], f['id']), fit(CTA_FIT, a['id'], c['id'])
    score = round(a['strength'] * 2 + hf * 2 + ff * 2 + cf, 1)  # max 10+6+6+3 = 25
    cover = a['covers'][h['key']]
    rows.append(dict(combo=f"{a['id']}-{h['id']}-{f['id']}-{c['id']}", angle=a['name'], hook=h['name'], format=f['name'], cta=c['name'], score=score,
                     cover=cover, slides=f['slides'], outline=outline(a, f, cover, c), who=a['who'], promise=a['promise'],
                     why=f"ANGLE: {a['evidence']}\nHOOK: {h['why']}\nFORMAT: {f['why']}\nCTA: {c['why']}", measure=c['measures'],
                     fits=f'angle {a["strength"]}/5 · hook {hf}/3 · format {ff}/3 · cta {cf}/3'))
rows.sort(key=lambda r: -r['score'])

# Wave 1: best combo per angle, but no format used more than 3 times and every CTA used; then wave 2: one variable changed.
wave, used_fmt = [], {}
for a in sorted(ANGLES, key=lambda a: -a['strength']):
    for r in rows:
        if r['angle'] == a['name'] and used_fmt.get(r['format'], 0) < 3:
            wave.append(r); used_fmt[r['format']] = used_fmt.get(r['format'], 0) + 1; break
# ---------------------------------------------------------------- workbook
wb = Workbook(); hdr = Font(bold=True, color='FFFFFF'); fill = PatternFill('solid', fgColor='1F3A2E'); wrap = Alignment(wrap_text=True, vertical='top')
def sheet(ws, cols, data, widths):
    ws.append(cols)
    for i, _ in enumerate(cols, 1): ws.cell(1, i).font = hdr; ws.cell(1, i).fill = fill
    for d in data: ws.append(d)
    for i, w in enumerate(widths, 1): ws.column_dimensions[get_column_letter(i)].width = w
    for row in ws.iter_rows(min_row=2):
        for cell in row: cell.alignment = wrap
    ws.freeze_panes = 'A2'; ws.auto_filter.ref = ws.dimensions

ws = wb.active; ws.title = 'Start here'
for line in [
    'GOLF HAT SLIDESHOW TESTS',
    'Every combination of 10 angles x 5 hooks x 5 slide formats x 3 calls to action = 750 slideshows, scored, with the cover line and a slide-by-slide outline for each.',
    '',
    'HOW TO USE',
    '1. Post "Wave 1" first: 10 slideshows, one per angle, formats spread out. One variable per post is the angle, so you learn which ANGLE wins.',
    '2. After 7 days, take the top 2 angles. Use "All combinations" filtered to those angles to test hooks (keep format + CTA fixed), then formats, then CTAs.',
    '3. Post each as a TikTok photo post and an Instagram carousel the same day. Same caption, 4-5 hashtags, trending-but-quiet sound.',
    '4. Log results in "Results log". Decide with the rules below, not by gut.',
    '',
    'SCORING (out of 25)',
    'Angle evidence strength x2 (max 10) + hook fit x2 (max 6) + format fit x2 (max 6) + CTA fit (max 3). Evidence comes from our research (sheet "Evidence"), fit is judgement.',
    '',
    'DECISION RULES (per post, at 48 h and 7 days)',
    '- Saves per 1,000 plays: the "worth keeping" signal. Under ~5 = watched, not kept.',
    '- Shares per 1,000 plays: the group-chat signal. This brand lives on group orders, so shares matter most.',
    '- Comments per 1,000 plays: for C1 posts, count mock-up requests.',
    '- Plays / followers: 5x or more is an outlier — make 2 more in the same layout straight away.',
    '- High reach, low saves → the content isn\'t worth keeping: change the slides, keep the hook. Low reach, high saves → keep the slides, change the cover.',
    '',
    'HONESTY RULES (non-negotiable)',
    '- Mock-ups are labelled "mock-up". Show real stitched hats as soon as you have them.',
    '- No invented reviews, counts, "best-selling" or "sold out" claims. No fake scarcity: a deadline must be a real production/shipping cut-off.',
    '- No other brand\'s logo on a hat or slide (Malbon, Melin, Nike etc.). Course names on hats can be trademarks: use the customer\'s own words, and don\'t sell course logos.',
    '- Personalisation depends on Printify accepting per-order embroidery text — confirm before promising "your name on it".',
    '',
    'STILL TO ADD',
    '- Golf slideshow winners from TikTok (run in progress): which of these formats already wins in golf, with saves per 1k. Fills the "Slideshow evidence" column.',
]:
    ws.append([line])
ws.column_dimensions['A'].width = 140
ws['A1'].font = Font(bold=True, size=14)

sheet(wb.create_sheet('Wave 1 (post first)'), ['#', 'Combo', 'Score', 'Angle', 'Hook', 'Format', 'CTA', 'Cover text', 'Slides', 'Slide outline', 'Why it should work', 'Measure'],
      [[i + 1, r['combo'], r['score'], r['angle'], r['hook'], r['format'], r['cta'], r['cover'], r['slides'], r['outline'], r['why'], r['measure']] for i, r in enumerate(wave)],
      [4, 16, 7, 24, 16, 22, 26, 38, 7, 60, 70, 22])
sheet(wb.create_sheet('All combinations'), ['Combo', 'Score', 'Fit detail', 'Angle', 'Hook', 'Format', 'CTA', 'Cover text', 'Slides', 'Slide outline', 'Who it\'s for', 'Promise', 'Why it should work', 'Measure', 'Slideshow evidence (golf TikTok)'],
      [[r['combo'], r['score'], r['fits'], r['angle'], r['hook'], r['format'], r['cta'], r['cover'], r['slides'], r['outline'], r['who'], r['promise'], r['why'], r['measure'], 'pending'] for r in rows],
      [16, 7, 30, 24, 16, 22, 26, 38, 7, 60, 28, 30, 70, 22, 24])
sheet(wb.create_sheet('Angles'), ['ID', 'Angle', 'Evidence strength /5', 'Who', 'Promise', 'Evidence', 'Example slide items'],
      [[a['id'], a['name'], a['strength'], a['who'], a['promise'], a['evidence'], '\n'.join(a['items'])] for a in ANGLES], [6, 28, 10, 30, 34, 80, 40])
sheet(wb.create_sheet('Hooks'), ['ID', 'Hook', 'Why', 'Cover line per angle'],
      [[h['id'], h['name'], h['why'], '\n'.join(f"{a['id']}: {a['covers'][h['key']]}" for a in ANGLES)] for h in HOOKS], [6, 22, 50, 80])
sheet(wb.create_sheet('Formats'), ['ID', 'Format', 'Slides', 'Why'], [[f['id'], f['name'], f['slides'], f['why']] for f in FORMATS], [6, 30, 8, 80])
sheet(wb.create_sheet('CTAs'), ['ID', 'Call to action', 'Last slide text', 'What to measure', 'Why'], [[c['id'], c['name'], c['last'], c['measures'], c['why']] for c in CTAS], [6, 34, 50, 28, 60])
sheet(wb.create_sheet('Evidence'), ['Finding', 'Number', 'Source'], [
    ['Hat leaders selling personalised hats', '0 of 4 (Melin, Goorin, Ampal, Coal); 1,488 products checked', 'Their public Shopify catalogues, Nov 2026'],
    ['"custom embroidered hats" US searches', '18,100/mo, $6.01 CPC', 'treg keyword volume (DataForSEO)'],
    ['"trucker hat" / "dad hat" US searches', '74,000 / 33,100 per month', 'treg keyword volume'],
    ['"bachelorette trucker hats" US searches', '260/mo', 'treg keyword volume'],
    ['Printify hat range', '320 hats: 161 dad caps, 88 truckers, 67 embroiderable', 'Printify catalogue pull'],
    ['Melin people also tag (other posts)', 'Malbon 18 (lift 5.3), lululemon 17, Nike 14, TaylorMade 11, Garmin 10', 'Instagram tags via treg/tikhub, 565 posters'],
    ['Melin fans also follow', 'Surfline 18, WSL 15, Arc\'teryx 13, Malbon 11; small golf brands lift 3-11', 'Instagram follows via treg/tikhub, 297 fans'],
    ['Top hashtags with Melin', '#golf, #golfswing, #fitness, #running, #hawaii, #dad, #pickleball, #family', 'Instagram tags'],
    ['Golf ad angles (17 brands, 897 ads)', 'Crowded: discount, social proof, easy routine. Open: before/after, expert endorsement. Product demo: 2 brands', 'Keepwatch "Golf hats" workspace'],
    ['Golf ad formats', 'Video 88% still live at 180 days; static 72%; carousels mostly killed within 90 days (16% live)', 'Keepwatch format league'],
    ['Hooks that lasted', '"Newest Collab: Sunday Golf x Mossy Oak" 606d; Vice "You don\'t need to change your swing…" 404d; Vice dad/kid lines 294d', 'Keepwatch hooks that lasted'],
    ['Gift + sale angles', 'Running at 9-10 brands; only 9-11% kept 30+ days', 'Golf ads analysis'],
], [36, 70, 44])
sheet(wb.create_sheet('Results log'), ['Combo', 'Date posted', 'Platform', 'Plays @48h', 'Saves @48h', 'Shares @48h', 'Comments @48h', 'Plays @7d', 'Saves @7d', 'Shares @7d', 'Followers', 'Saves/1k', 'Shares/1k', 'Plays/followers', 'Link clicks', 'Orders', 'Decision'],
      [], [16, 12, 10] + [11] * 13 + [30])
# Creator trends (TikTok + Reels, last 120 days): which formats get reach, so the slideshows borrow what already travels.
tp = os.path.join(OUT, 'data', 'golf-trends.json')
if os.path.exists(tp):
    tr = json.load(open(tp))
    sheet(wb.create_sheet('Creator trends'), ['Format (from captions)', 'Creators', 'Videos', 'Median views', 'What it means for the slideshows'],
          [[f['key'], f['creators'], f['videos'], f['median_views'], {
              'rate my / rank': 'Rare (few creators) but the highest median reach: use the Rank format (F4) more.',
              'trip / destination': 'Few creators, very high reach: backs the Buddy trip angle (A1).',
              'funny / skit': 'Many creators and high reach: humour travels; Types of golfers (A7).',
              'fit check / outfit': 'The most crowded format with low median reach: only post fit checks with a twist (rank them).',
              'dad / family': 'Mid reach, but a 13M "daddy daughter day" breakout: Golf dad (A3) works when it is short and sweet.',
              'things golfers say/do': 'Only 2 creators, huge reach: open format for A7.',
          }.get(f['key'], '')] for f in tr['formats']], [26, 10, 10, 14, 80])
    ws2 = wb['Creator trends']; ws2.append([]); ws2.append([f"{tr['videos']} videos from {tr['creators']} creators, last {tr['window_days']} days, {len(tr['keywords'])} golf keywords. Spend ~${tr['spend_usd']}."])
    ws2.append(['No sound is a cross-creator trend (the most-shared sound is used by 2 creators): the trends are formats, not sounds. Pick a quiet trending song per post.'])
    ws2.append(['Length: 0-15s videos have a median of ' + str(tr['lengths'][0]['median_views']) + ' views; most breakouts are 6-second clips. For slideshows: a strong cover + 5-7 fast slides.'])
    ws2.append([]); ws2.append(['Breakout examples (views far above followers)'])
    for b in tr['breakouts'][:12]: ws2.append([f"{b['views_per_follower']}x", b['views'], f"{b['seconds']}s", ' / '.join(b['formats']), b['desc'][:120]])
path = os.path.join(OUT, 'golf-slideshow-tests.xlsx'); wb.save(path)
with open(os.path.join(OUT, 'golf-slideshow-combos.csv'), 'w', newline='') as fh:
    w = csv.DictWriter(fh, fieldnames=list(rows[0].keys())); w.writeheader(); w.writerows(rows)
print(f'{len(rows)} combinations, wave 1 = {len(wave)} posts -> {path}')
for i, r in enumerate(wave): print(f"{i+1}. [{r['score']}] {r['angle']} | {r['hook']} | {r['format']} | {r['cta']} | \"{r['cover']}\"")
