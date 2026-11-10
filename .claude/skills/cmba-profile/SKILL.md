---
name: cmba-profile
description: "Rewrite LinkedIn and X/Twitter profiles and a one-page website using the Creator MBA 7-point LinkedIn and 5-point X checklists, plus the daily networking cadence. Turns a UVP into banner, headshot direction, tagline, featured section, about/founder story, and site hero + contact form copy. Use when profiles are generic, when someone just picked a niche, or when auditing a real company's social presence. Triggers on: fix my LinkedIn, rewrite my bio, profile audit, my headline is weak, set up my profiles, one page website copy."
---

# CMBA — Profiles & Simple Site

The rule from the transcript: *24–48 hours, not two weeks. Progress, not perfection.* This skill
produces finished copy, not advice about copy.

## Inputs

`cmba-workspace/<slug>/uvp.md` strongly preferred. Without it, run `cmba-uvp` first — a profile
rewrite without a UVP just reshuffles generic words.

## Process

### 0. Controllable-surface inventory (before any rewrite)

This skill rewrites banners, taglines, About sections and site copy. **Confirm the operator can
actually change them.** Franchisees, multi-unit operators, agency-managed accounts and employees of
a larger brand control far less than the framework assumes, and a beautiful rewrite they are
contractually unable to ship is wasted work.

| Surface | Who controls it | Actionable by this operator? |
|---|---|---|
| Brand name, logo, colours | | |
| Site template and copy | | |
| Guarantee / warranty wording | | |
| Pricing structure | | |
| Google Business Profile | | |
| Reviews and responses | | |
| The individual's personal LinkedIn | | |
| Local partnerships and own photography | | |

Rules:
- **Only surfaces the operator controls receive recommendations.** Everything else is listed as a
  constraint, not quietly rewritten.
- Where permission is uncertain (franchise agreements, brand standards), name it as a **blocking
  prerequisite** — "confirm with the franchisor before publishing" — not a footnote.
- For a franchisee, the personal LinkedIn of the owner is usually the only brand-independent asset
  and the only one that travels if they leave the system. Weight it accordingly.

Observed on a Rolling Suds franchise unit: brand, guarantee wording, service taxonomy, site
template and pricing were all franchisor-controlled. The controllable surface was GBP, reviews, the
owner's personal LinkedIn, local partnerships, and their own job photos — and the owner's name was
not published anywhere, which blocked four of the seven LinkedIn items outright.

### LinkedIn — 7 points
1. **Banner** — Canva-simple. Call out ONE thing: product, service, or newsletter. Supply the
   exact text lines and any social proof number that is *real*.
2. **Headshot** — direction only: name the 3–4 emotional descriptors to brief a photographer or a
   friend with portrait mode (e.g. "confident, assured, powerful, strong").
3. **Tagline** — what are you building + why should people follow. Pull from the UVP. Under 220
   characters. Include the self-selecting audience noun.
4. **Custom profile link + creator tools** — ⚠ *the source material says "turn on Creator Mode and
   add 5 profile hashtags." **Both are gone.** LinkedIn removed profile hashtags in February 2024
   and retired the Creator Mode toggle in March 2024; its features are now always-on for eligible
   profiles.* `[verified: 2026-07-28]`
   What to do instead: claim the custom profile URL, confirm newsletter/live/audio access is
   available on the profile, and put topical keywords in the **tagline and About** — which is where
   discovery actually happens now.
5. **Featured section** — de-platform: website, landing page, or lead magnet. Only fall back to
   "best post" if none of those exist yet.
6. **About** — founder story + results. Structure: origin → turning point → what you do now →
   proof → who this is for. Brag section is separated and factual.
7. **Experience** — company page with logo, basic info, attached to the personal profile.

### X / Twitter — 5 points
Banner · headshot · tagline (building + why follow + link) · website link · pinned post
(the story thread — write it, don't describe it).

### Platform choice
State the recommendation and why, using the transcript's split:
- **LinkedIn** — B2B and most B2C, safer, easier engagement, badges, best default
- **X** — real-time, internet-growth/writing/copy niches, fastest feedback loop (10–20 min)
Recommend one primary. Advise against running both hard at the start.

### One-page site (Carrd-class)
Hero = value statement expanded. Sections: hero → what you do → who it's for → proof (only if
real) → contact form. Same headshot as social for consistency. Nothing else until there's traffic.

### Networking cadence (step 6 — habit, not artifact)
Ship the checklist:
- 7–10 smart comments/day on 7–10 accounts slightly bigger than you (not the top of the ladder)
- 3–5 new relevant connections/day
- reply to every comment on your own posts
- thank 2–3 engagers/day by DM, **no ask**
- after 30–45 days of real back-and-forth: DM for a 15-min call about supporting each other

## Output format

```markdown
# Profile Rewrite — [name/company]

## Recommended primary platform: [LinkedIn | X] — because [reason tied to where their buyer is]

## LinkedIn
1. Banner copy: [exact lines]
2. Headshot brief: [descriptors]
3. Tagline: [final text, char count]
4. Hashtags: #a #b #c #d #e
5. Featured: [asset + why]
6. About: [full final text]
7. Company page: [name, tagline, description]

## X / Twitter
Banner / Headshot / Tagline / Link / Pinned post [full text of the pinned story]

## One-page site
Hero headline:
Subhead:
Body sections:
CTA + form fields:

## Networking cadence
[checklist + 10 named accounts to engage with, if discoverable]

## Assumptions & Unknowns
```

## Source freshness — durable mechanism vs. perishable detail

This skill was built from course material recorded around 2024, which states durable principles and
platform UI details **in the same sentences**. They have very different shelf lives.

| Durable | Perishable |
|---|---|
| A tagline must say who you help and what outcome they get | The character limit |
| De-platform from the feed to something you own | Whether "Featured" is called Featured |
| One headshot, consistent across surfaces | Which image sizes the platform accepts |
| Pick one platform to start | Which platform is easiest this year |

**Rule:** every named tool or platform feature carries a `[verified: date]` stamp. Anything unstamped
or older than ~6 months is checked before it reaches output. Never instruct someone to configure a
control without confirming it still exists.

Precedent: the hashtag instruction above shipped as a required step for two years after LinkedIn
deleted the feature.

## Evaluation

**Rubric (0–4 each, 20 total). Pass ≥15, no dimension <2.**

| # | Dimension | 0 | 2 | 4 |
|---|---|---|---|---|
| 1 | **Faithfulness** | Generic profile tips | Most checklist points | All 7 LinkedIn + 5 X points delivered as *finished copy*, platform recommendation justified |
| 2 | **UVP lineage** | Unrelated to positioning | Loosely related | Every asset traceable to a specific UVP clause; the enemy/movement shows up in the About |
| 3 | **Shippability** | Needs more work before use | Mostly ready | Copy-paste ready, within character limits, real hashtags, form fields specified |
| 4 | **Restraint** | Featured section full of "best posts", 12 hashtags, hero cluttered | Some bloat | De-platforming asset in Featured, exactly 5 hashtags, hero has one CTA |
| 5 | **Falsifiability** | Invents proof | Vague proof | Proof claims flagged as `[VERIFY]` where not confirmed; omitted where absent |

**Kill check:** any social-proof number (followers, customers, revenue, years) stated without
being verified from the real footprint. Zero the run.

**Control comparison:** diff the rewritten tagline/About against the live profile. Score the
delta: does a stranger now know who it's for and what outcome they get? If the rewrite is
merely more polished but equally broad, cap at 12.

## Failure modes seen in testing

- Writing *about* the About section instead of writing it
- Recommending both platforms at once (transcript explicitly says pick one to start)
- Featuring "best posts" when a lead magnet or site exists
- Inventing round-number social proof ("10,000+ customers served")
