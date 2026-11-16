# Open Tee Club: Wave-1 slideshow spec (built from real winners, not memory)

How this was made, following the site-clone rule ("build from the spec, never from memory"):
1. I picked 11 outlier golf photo posts from `research/golf-2026-11/data/golf-slideshows.json`. They were ranked by plays ÷ followers and saves per 1,000 plays.
2. `scripts/fetch_ref_slides.py` downloaded every slide through treg (tikhub video detail), and I looked at all of them.
3. This file records what they **actually** show. The v2 posts are built from this file only.

The reference slide images are not committed, because they are other people's content. Re-fetch them with
`python3 research/golf-2026-11/scripts/fetch_ref_slides.py <ids> <dir>`.

## The references

| # | Post (creator) | Formula | Plays | Plays ÷ followers | Saves / 1k | Slides | Size |
|---|---|---|---|---|---|---|---|
| R1 | 7563461987355741471 (@inspobykj) | "What to get your boyfriend's family for Christmas" | 1.3M | 562× | 45.5 | 7 | 9:13 |
| R2 | 7695565694351576351 (@maddyb2019) | "Christmas ideas for the guys part 2" | 314k | 501× | 49.0 | 4 | 9:16 wide panorama |
| R3 | 7534231730266361093 (@freakbob9713) | "golf gift ideas for boyfriends!" | 965k | 3,034× | 38.0 | 6 | 3:4 |
| R4 | 7510239039795023134 (@_ellaemmert) | "Everything I got my bf for his birthday!" | 1.7M | 14× | 34.8 | 7 | 3:4 |
| R5 | 7526757488104951054 (@bennie.undercover) | "Let's make a just because golf basket for my golfer bf" | 234k | 3,072× | 6.2 | 8 | 3:4 |
| R6 | 7684795121732308237 (@sophiecarterinspo) | "christmas gift ideas (for men)" | 613k | 3,422× | 30.0 | 6 | 9:16 |
| R7 | 7533747054128975118 (@fashionwithnina00) | "golf fit ideas" | 133k | 127× | **49.7** | 6 | 9:16 |
| R8 | 7613466518298414367 (@onpinterest2much) | "Masters outfit inspo" | 431k | 1,334× | 29.0 | 5 | 9:16 |
| R9 | 7554563634433625399 (@golf.dailyy) | "Golf can be easy." (swing basics) | 1.1M | 85× | 39.5 | 6 | 1:1 |
| R10 | 7528505078307622166 (@vintage.birdie) | "Golf tips every rookie needs" | 212k | 124× | 41.1 | 6 | 16:9 (brand account) |
| R11 | 7388585939863407902 (@oldmoneygolf_) | "Golf brands you need to know about" | 170k | 68× | 39.6 | 10 | 2:3 |

## Rules every winner follows (and our v1 drafts broke)

| Element | What the winners do | Count | Our v1 drafts |
|---|---|---|---|
| **Look** | Looks like a person made it: phone photos (R3, R4, R5), or Pinterest/ShopMy-style collages (R1, R2, R6, R7, R8). No designed brand template. | 11/11 | Designed template: big headline, dark shade over the photo, brand bar on every slide |
| **Text per slide** | 1 short label, 2–6 words ("A tee time!", "Shorts!", "golf ball bouquet!"). Tips posts allow a title plus 2 short lines (R10). | 11/11 | Title, plus 2–3 lines, plus a subtitle |
| **Text style** | Small. Either TikTok's own text (white or green box, R3/R5) or a thin serif (R1, R4, R6, R8). Sentence case, often lowercase, "!" and an emoji. | 10/11 | Big uppercase block headlines |
| **Cover** | A scene with the title in 1–3 short lines (snowy street, illustrated skiers, Augusta, a golf cart). The cover never shows the product being sold. | 11/11 | Our product on the cover, with a "save" banner |
| **Products** | Many items: 4–12 per slide on grids (R1: 24 items, R6: 14). On phone-photo posts, 1 item per slide. Labelled with name and price (R1, R2) or a short phrase (R4). | 9/11 | 5 items, one per full slide |
| **The hat** | A hat is **one item among many**: R4 slide 6 "A new golf hat", R5 "He needs more hats", R2 a rope cap at $35, R1 a team cap. Never the hero. | 5/11 | The cap is on every slide |
| **Last slide** | Just the last item or a punchline ("little snack 😉", "All done!!", "Told you."). **None has a CTA or app slide.** | 11/11 | An app-card CTA: "Comment your crew's name / Link in bio" |
| **Save prompt** | None on the slides. Saves come from the content (gift lists, outfits, tips). | 11/11 | "↓ SAVE THIS ↓" banner |
| **Brand** | Personal posts: none. The only brand account (R10) mentions itself in the caption, not the slides. | 11/11 | Brand bar on every slide |
| **Caption** | Hashtags only (R1, R3, R4, R6, R8) or 1 line plus hashtags. 3–8 hashtags, niche plus #fyp. | 11/11 | Not written |
| **Sound** | Seasonal or trending: Christmas songs on the Nov–Dec gift posts (R1, R6), soft indie on the others. | 11/11 | Not chosen |
| **Slides** | 4–10, typically 6. | | 6–7 ✓ |

**Timing.** Today is 16 Nov 2026, the peak of gift-list season (R1, R2 and R6 are all Christmas posts). Gift posts should go first.

## Side-by-side: our 7 drafts against the references

| v1 draft | Closest winner | Does the formula hold up? | Does the build match? | Decision |
|---|---|---|---|---|
| 1 "5 hat ideas for your golf crew" | none (no reference is a list of one brand's products) | ✗ This is our catalogue as a list. No reference does this. | ✗ | **Drop as written.** Its idea (crew names) moves to v2-4 as a native process post. |
| 2 "5 golf gifts for the new golfer" | R1, R3, R6 (gifts: highest saves, 30–49 per 1k) | ✓ the strongest formula, and in season | ✗ 5 full-slide items, 3 of them ours; CTA slide | **Rebuild** as a Pinterest gift grid (v2-1): 12+ items, the cap is 1 of them |
| 3 "POV: your Topgolf crew is ready for the real course" | R9, R10 (beginner tips: 39–41 saves per 1k) | ✓ tips save well | ✗ our cap as tip 4; CTA slide; long text | **Rebuild** as "Topgolf → real course" tips (v2-3): one photo plus a short line each, punchline last, no cap |
| 4 "Every golf group has these 4" | none fetched (relatable posts were the most *shared*, 14.7 per 1k in the formula data, but they were about boyfriends, not slogan caps) | ~ the humour is right, but every "type" is one of our slogan caps, so it reads as an ad | ✗ | **Hold.** Make it later with real people and real caps once stock exists; not in Wave 1. |
| 5 "Blank cap → your crew's cap" | R5 (process: "Let's make a golf basket", 3,072×) | ✓ a process story works | ✗ before/after compare card plus a how-it-works list | **Rebuild** as "Let's make matching caps for our golf group" (v2-4): phone photos of each step |
| 6 "What to wear for your first round" | R7, R8 (outfit collages, 49.7 saves per 1k, the highest in the set) | ✓ the strongest save rate | ✗ photo slides with tips text, cap as tip 4 | **Rebuild** as outfit collages (v2-2): one full outfit per slide, the cap as an accessory in 2 of 5 |
| 7 "We mocked up your crew names" | none | ✗ no evidence | ✗ | **Keep only as a reply-to-comment video later**, once v2-4 brings real comments. Not a Wave-1 slideshow. |
| (new) "Everything I got my golf girls for the trip" | R4 (1.7M plays), R3 | ✓ | | **New: v2-5.** Phone photos, one item per slide, the cap is item 4 of 6 |

**Bottom line.** Our formulas were mostly right: gifts, outfits, tips and process all match winners. The **execution was an ad**: a brand template, our product on every slide, a CTA card. No reference does any of that.

The v2 rule is "native first". The cap shows up the way a hat shows up in R4 and R5: one item, named plainly. The brand lives in the account name, the bio link and one caption line.

## v2 posts (built from this spec)

| v2 | Formula (from) | Size | Slides | Photos |
|---|---|---|---|---|
| v2-1 "golf gift ideas for the new golfer in your group 🎁" | gift grid (R1, R6) | 1080×1920 | 1 scene cover + 2 grids (4 items each, plain lowercase labels like R6; no prices until ours are set) | Grid tiles: licensed photos for generic items, the cap mock-up as 1 tile. **Real affiliate product images need the retailer's permission.** |
| v2-2 "first round outfit ideas ⛳️" | outfit collage (R7) | 1080×1920 | cover + 4 outfits | Flat-lay pieces on white. The cap appears in 2 of 4 outfits. Generic pieces until real photos exist. |
| v2-3 "topgolf to the real course. it's easier than you think." | tips (R9) | 1080×1440 | 6 | Real course and range photos (licensed), short centred text, punchline last ("see you on the first tee.") |
| v2-4 "let's make matching caps for our golf group 🧢" | process (R5) | 1080×1440 | 7 | **Shoot it yourself** (shot list below). The preview uses placeholders. |
| v2-5 "everything I got my golf girls for our trip!" | haul (R4) | 1080×1440 | 6 | **Shoot it yourself.** The preview uses placeholders. |

### Shot lists (phone, natural light, a plain table or bedspread like R4/R5)
- **v2-4 process:** 1) the group chat or the tee sheet on a phone, "the group chat decided we need matching hats" 2) 4 blank rope caps in a row, "first, blank caps" 3) a notes-app list of names, "picking the name took 3 days" 4) the stitched cap close-up, "it's giving" 5) all caps in a row in different colours, "everyone picked a colour" 6) a cap on someone at the range, "first range day in them" 7) the group from behind, "ok we're a team now".
- **v2-5 haul:** 1) the gift bags on a bed, "everything I got my golf girls for our trip!" 2) a sleeve of pretty patterned balls, "cute balls (we will lose them)" 3) a glove, "a glove for her left hand" 4) the crew cap, "matching hats with our trip on them" 5) a towel or tee pouch, "tees in a little pouch" 6) snacks, "and snacks obviously 😌".

### Captions, hashtags and sound
- v2-1: `#golfgifts #giftsforgolfers #christmasgifts #newgolfer #giftideas #fyp`. A Christmas song, as in R1 and R6.
- v2-2: `first round fit ideas ⛳️ #golfoutfits #golftok #golfgirl #pinterest #fyp`. Original or soft indie sound, as in R7 and R8.
- v2-3: `golf is easier than you think #golftips #beginnergolf #topgolf #golftok`. "Stuck in the Middle" type, as in R9.
- v2-4: `the group chat finally agreed on something #golfgirls #golftrip #matchinghats #golftok`. Then one line: "caps from Open Tee Club (link in bio)", only when we are the account posting it.
- v2-5: `#golftrip #giftsforher #golfgirl #golftok #fyp`.

### Honesty rules (unchanged)
- The cap is a **mock-up** until real caps are stitched. A mock-up in a "haul" post would be a false claim, so **v2-4 and v2-5 are only posted with real photos of real caps**.
- Price tags only show real prices (check Printify base cost and set the retail price first).
- No other brands' logos or product photos unless they're licensed or permission is given. Generic items are named generically.
- No fake comments, counts or "sold out".
