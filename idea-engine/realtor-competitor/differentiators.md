# Differentiators — ListingProof (working name, placeholder)

Competitor set: https://videotour.ai/real-estate-video-tour (+ /pricing, help center, terms) and https://www.realestatecontent.ai/pricing-table/ (+ homepage, terms). Fetched 2026-11-10 (raw HTML, re-checked today for this run; the full page teardown is in [funnel-teardown.md](funnel-teardown.md)).
Chosen because: these are the two paid-Meta advertisers a US agent actually sees in feed for "AI listing video / AI social content" (130 and 80 ads in [competitor-ads.json](competitor-ads.json); 36 and 69 of them past 90 days). They are who the buyer compares us to. Brokerage tools (KW Command, Compass Video Studio) and AutoReel are the free/cheap fallback, noted under deficits, not the comparison set.

Subject = what our engine (Keepwatch, see `keepwatch/README.md`) can do today, plus what we commit to build before launch. Every subject claim is tagged **EXISTS** (in Keepwatch now) or **BUILD** (must ship before the claim is used in copy).

## Claim inventory

Competitor wording is quoted from live copy on 2026-11-10.

| # | Claim | Subject (us) | VideoTour.ai | RealEstateContent.ai (REC) | Verdict |
|---|---|---|---|---|---|
| 1 | Turns listing photos into video fast | Yes. 9:16 video from photos; motion mode runs in seconds (EXISTS for ads; listing-photo upload is BUILD) | "Turn Listing Photos into Stunning Video Tours in Just Minutes" | "image-to-video" in the plan list | **SHARED** |
| 2 | Free first output, no card | Yes, free sample kit, no card (BUILD: billing) | "Generate Your First Video for Free / No credit card required" | None. "14-day money-back" instead | **SHARED** (with VideoTour) |
| 3 | No filming, no editing skills | Yes | "No filming. No editing. No hassle." | "you don't need fancy cameras… or any social media experience" (ad transcript) | **SHARED** |
| 4 | Branding (logo, agent end card) | Yes, end cards from brand assets (EXISTS) | "Custom branding" | "branding" in tools list | **SHARED** |
| 5 | Doesn't invent things in the house | Motion mode = camera move on the real photo, no generated pixels (EXISTS) | "AI moves the camera. AI never touches the room." "100% MLS Compliant" (while its help center says AI moves "can produce an extra door, furniture, a changed window") | Not claimed | **SHARED as a claim** (VideoTour claims it). Our provable delta is #6 |
| 6 | Shows the original photo next to every clip + auto "virtually enhanced" label when any generative clip is used | Planned (BUILD) | Not offered. Help center pushes the check onto the agent: "Compare it with the original listing photos" | Not offered | **OURS once built** — but cheap to copy (see tiering) |
| 7 | Monthly price shown by default; plain renewal | Yes (BUILD: billing page) | Pricing page loads with `aria-pressed="true"` on **Annual**; "$29" shown; help center: "displays the equivalent of $29 per month, but charges $348 for the year" | "$119 /month… Cancel any time, no contract" shown first | **SHARED** with REC |
| 8 | Money-back guarantee | 30 days on first payment | "not refundable once made, including for a completed video you are not satisfied with" (refunds only billing errors and "proven technical failures") | "14-day money-back guarantee… no questions asked" | **SHARED** with REC (ours is longer, a positional detail) |
| 9 | Pay per listing, no subscription | $49 per listing kit | No. Plans of 10/40/200 videos a month + credit packs | No. "One plan, everything included" | **OURS** |
| 10 | Re-renders free, no credits | Yes. No credits at all | Credits; "Re-generations cost credits again" (teardown §3); failed generations return credits automatically | "no credits to top up and no per-post fees" | **SHARED** with REC |
| 11 | **Creative modeled on the listing ads agents in your own metro have kept running 30+ days** (public Meta Ad Library, ranked by run length) | Yes. Keepwatch tracks rivals' Meta ads, ranks by run days, and rebuilds the winner's structure for your brand (EXISTS); metro-level discovery of agent advertisers is BUILD (small: keyword search already used in research) | No. Templates and effects ("Reels, Avatar, 3D captions, Lifestyle, Transitions") | No. "30 ready-to-use content ideas" from your ideal-client description | **OURS** |
| 12 | Listing **ad** variants (image + primary text + headline) for Meta, not just a video | Yes. "Ad copy: primary text, headline and call to action for Ads Manager" (EXISTS) | Video only | Social posts, not ads | **OURS** |
| 13 | Simulated buyer panel ranks the variants | Yes, labelled simulated (EXISTS) | No | No | **OURS** (minor; simulated, so weak as proof) |
| 14 | Fair-housing copy check + brokerage name on first frame/end card + Housing special ad category reminder | Planned (BUILD) | Not offered (pushed to agent) | Not offered | **OURS once built** |
| 15 | Avatar / "never on camera" video | No (out of MVP) | "Show up in every listing video without filming" | "AI Twin" | **THEIRS** |
| 16 | Unlimited social posting autopilot, calendar, scheduling, market reports, blog posts | No | Partial (reels, captions) | "Unlimited posts… calendar, market reports, blog posts" | **THEIRS** (REC) |
| 17 | Paste a Zillow / portal link instead of uploading | No. Upload or the agent's own listing page only (Zillow ToS restricts derivative use, per a Reddit note in the reviews research) | "Paste a Zillow link"; 9 portals | Listing-to-social | **THEIRS** |
| 18 | Social proof counts | None yet | "Trusted by 10,000+", "+2M views" (unsourced) | "2,500+ agents" | **THEIRS / DEFICIT** |
| 19 | Lifestyle scenes, virtual staging, "drone" shots | No (refused by design) | Sold via credits | Not central | **THEIRS** (and a constraint we refuse, see candidate C) |
| 20 | Measures results (views, leads per video) | No. Not built | No | No ("90% See results in 30 days", undefined) | **NOBODY** — open, not claimable by us yet |

## Deficits (competitor claims the subject cannot make)

1. **No users, no reviews, no counts.** VideoTour shows "10,000+" and five first-name testimonials; REC shows "2,500+ agents" and a Senja widget. We have nothing. Close it by collecting real, named, consented quotes and opening a third-party review profile on day 1. Never fill the gap with invented numbers.
2. **No avatar / "never on camera" product.** VideoTour's avatar ads run up to 254 days. Agents who won't appear on camera may pick them.
3. **No social autopilot.** REC sells "put social media on autopilot" to agents whose problem is posting cadence, not listings. We do not serve that job.
4. **No portal-link import.** VideoTour removes the upload step. Ours is slower to start.
5. **No feature breadth** (staging, lifestyle, 3D text, transitions). On a feature checklist we lose.
6. **Free substitutes.** KW Command, Compass, Lofty and Canva-at-eXp give listing video away ([real-estate-video-saas.md](../deep-dives/real-estate-video-saas.md) §1). A plain "photo-to-video" pitch loses to free.

## Candidates and copy-cost

| Candidate | Source (1–6) | What would it cost VideoTour to copy? | What would it cost REC to copy? | Tier |
|---|---|---|---|---|
| A. **Local-winners engine**: every kit's ads and hooks are modeled on listing ads that agents in the buyer's metro have kept running 30+ days, ranked by run length from the public Ad Library | 2 (asset: an ad-tracking + run-length + remake pipeline already built), 6 (method) | Real work: an Ad Library collector, classification, survival ranking, a structure-not-wording remake step, and a shift from "video" to "ads". 6–12 months for a small team. Nothing in their model forbids it | Same build, and REC's one-plan "autopilot" product has no per-listing unit to hang it on | **POSITIONAL**, shelf life ~12 months |
| B. **Pay-per-listing kit** ($49, no subscription) | 1 (constraint refused: subscription) | Adds a SKU; conflicts with monthly allowances and credit packs but is doable in weeks | Breaks "One plan, everything included… The only choice is monthly or annual." Their whole page is built on one plan | **POSITIONAL** vs VideoTour (weeks); closer to structural vs REC. Shelf life: until VideoTour adds it |
| C. **Truthful-by-default with proof** (motion only, original photo beside each clip, auto label when anything generative is used) | 4 (customer refused: agents who want lifestyle scenes), 5 (promise: "if it's not in your photos, we redo or refund") | Cheap to add a label. But defaulting to no-generative and promising refunds for "anything not in your photos" cuts into credit sales for lifestyle, staging and drone effects and contradicts their no-refund terms | Not their category | **POSITIONAL** (they *could*; it costs them credit revenue). Shelf life ~6 months |
| D. Honest billing (monthly default, reminders, one-click cancel, money-back) | 5 | Flip a toggle, write a reminder email, change terms. Cheap | Already does most of it | **COSMETIC** vs REC, cheap vs VideoTour. Not a differentiator. Table stakes we must meet |
| E. Simulated buyer panel | 6 | An LLM prompt | Same | **COSMETIC** |
| F. Compliance pass (fair-housing linter, brokerage name, special-ad-category reminder) | 3 (cost borne) | Moderate (rules + linter) | Moderate | **POSITIONAL**, ~6 months, and BUILD first |

Copy-cost honesty: nothing here is STRUCTURAL. No candidate breaks VideoTour's model outright; B comes closest against REC only. Candidate A is the hardest to copy because it is a data pipeline plus a method, and it is the only one built on an asset we already own.

## VERDICT: POSITIONAL

**The differentiator:** ListingProof builds each listing's videos and Meta ads from the agent's real photos, modeled on the listing ads that agents in the same metro have kept paying to run for 30+ days.

Mechanism (why a rival can't follow quickly): it needs an Ad Library collector, run-length ranking, and a remake step that copies structure but never another agent's footage or wording. Keepwatch already has all three for brands. Both competitors sell templates and effects (VideoTour) or idea generation from a persona (REC), and neither has an ads product. Building it is 6–12 months of work that pulls them off their current roadmap. It is not forbidden by their model, so it is not structural.

Shelf life (positional): **~12 months** (to about Nov 2027). Plan the structural follow-on: per-metro run-length history accumulates weekly and cannot be back-filled once ads stop (stopped ads leave the Library's "active" view). If we collect continuously from launch, the history itself becomes an asset only we have (source 2). Review in May 2027.

Substitution test: "VideoTour.ai builds each listing's videos and ads modeled on the listing ads agents in your metro have kept running 30+ days." → **false** of VideoTour today (templates/effects, no ads). "RealEstateContent.ai builds…" → **false** (persona-based ideas, no listing ads). **Passes.**

Supporting proof points (not differentiators; all must be true at launch): truthful-by-default output with originals shown (C), pay-per-listing (B), honest billing (D), compliance pass (F).

## If NONE
Not applicable. Note what we also compete on: **execution** (output quality on real photos) and **trust** (billing, accuracy). Deficits 1 and 6 must be closed with proof, not wording.

## Assumptions & Unknowns
- BUILD items (listing-photo upload, metro discovery of agent advertisers, originals side-by-side, auto label, compliance linter, billing) are not in Keepwatch today. Any claim depending on them stays out of live copy until shipped.
- Whether enough agents in a given metro run long-lived listing ads to model from is **unverified**. If a metro has fewer than 3 kept ads, Keepwatch's own sample rule says describe, don't rank. Fallback: model on the nearest larger metro or the national kept set, and say so in the kit.
- We copy ad **structure**, never other agents' photos, footage or wording (Keepwatch rule; also copyright, see VHT v. Zillow note in the SaaS deep-dive).
- VideoTour's "no auto label / no side-by-side" is from public pages; the logged-in app was not inspected (no sign-up, by policy).
- Shelf life is a judgment, not evidence.
- **Added after keyword research (temporal check):** the 2026-11-10 SERP for "videotour.ai review" surfaced two other vendors' comparison pages, Avenue 510 (ave510.com) and Reeloft (reeloft.com). They were not analyzed. The substitution test holds for the named comparison set only; before claiming "nobody else" in any copy, check whether either models local ads. Current copy only says what we do, not that no one else does.
