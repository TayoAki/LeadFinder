# Niche Scorecard: Dub "offline marketing scorecard" for home service & real-estate teams (Gate 0)

Offer (as pitched by Corey Ganim): unique Dub short links/QR codes on every mailer, yard sign and truck wrap, plus a monthly report on which channel works. Home service companies spending $3k+/mo offline, and real-estate teams. **$500 setup + $250/mo.**

Date 2026-11-10 · Sources: Google SERP of `upwork.com/freelance-jobs/apply` (2 queries: direct mail tracking/QR; CallRail call tracking setup; ~57 results, via treg), Reddit search (r/smallbusiness, r/HVAC, r/Plumbing, r/Contractor, r/sweatystartup, r/realtors, r/landscaping, r/roofing; 12 months), live pricing pages (Dub, Bitly, CallRail). Window ~60 days.

| Check | Result | Evidence |
|---|---|---|
| 1. Buyers asking (20+) | ❌ FAIL | Tight 2 (end buyer wants trackable codes + results reporting). Loose ~10. |
| 2. Competitors w/ live prices | ❌ caps price | Bitly $29/mo, Dub $81/mo, CallRail $50/mo. Call tracking, not QR, is how trades already attribute offline. |
| 3. Margin >=50% | 🟡 borderline | 42-60% at 2-3h/mo. |
| 4. Watering holes | ✅ PASS | Named below. |

## 1. Buyers asking
**Tight = 2:**
- "EDDM Executor": use a trackable QR and short URL, set up campaign tracking before mailing, report results, 1 day ago: [link](https://www.upwork.com/freelance-jobs/apply/EDDM-Executor_~022119562356789546831/)
- Home care agency hiring a virtual marketing manager to own planning, execution and **tracking** of channels incl. direct mail, Nov 1: [link](https://www.upwork.com/freelance-jobs/apply/Virtual-Marketing-Manager-Home-Care-Agency-Based_~022116599958502611236/) (a role, not a tracking project)

**Loose (~8):**
- Direct-mail designer to "add QR codes, tracking phone numbers", Oct 14: [link](https://www.upwork.com/freelance-jobs/apply/Direct-Mail-Designer-Needed_~022110355197042026466/). Tracking is a checkbox inside a design job.
- Junk removal owner wants a revenue-share marketer to "set up a call tracking number (like CallRail)", Oct 31: [link](https://www.upwork.com/freelance-jobs/apply/Revenue-Share-Marketer-for-Junk-Removal-Business-Surrey-Vancouver_~022116452024941177176/)
- HVAC/plumbing Google Ads job: "set up and test tracking for phone calls ... CallRail": [link](https://www.upwork.com/freelance-jobs/apply/Google-Ads-Set-and-Management-HVAC-Company-B2C_~022119662817995591503/). Most "tracking" posts are this: online ads + CallRail.
- Reddit, owners: local service owner testing ValPak/postcards/door hangers: "I get how to track calls, but ... everything else?" ([May 6, 12 comments](https://www.reddit.com/r/smallbusiness/comments/1t5f4y2/anyone_using_direct_mail_valpak_postcards_door/)); flyer printer wants repointable short links with scan counts ([Jul 25, 13 comments](https://www.reddit.com/r/smallbusiness/comments/1v6cuyt/im_printing_flyers_with_qr_codes_next_month_and_i/)); "Direct mail: did you track conversions?" ([Oct 22](https://www.reddit.com/r/smallbusiness/comments/1xcq5v4/direct_mail_what_are_your_thoughts/)); free QR codes that later get locked ([Nov 2, 61 comments](https://www.reddit.com/r/smallbusiness/comments/1xmbo5b/your_free_qr_code_might_stop_working_after_you/); [May 26, 227 comments](https://www.reddit.com/r/smallbusiness/comments/1tog7d6/whats_a_good_free_qr_code_generator_that_doesnt/)).
- Skeptic signal: a Chicago wrap shop says "almost every contractor asks us to make the QR code bigger", but field crews think truck QR codes are pointless because the truck is moving ([Jul 21](https://www.reddit.com/r/smallbusiness/comments/1v2orld/has_anyone_here_gotten_a_real_customer_from_a_qr/)).
- 0 hits in r/HVAC, r/Plumbing, r/Contractor or r/realtors for QR/mailer tracking in 12 months.
Budgets: not shown in snippets.

## 2. Competitors (live pricing pages, read 2026-11-10)
- [Bitly](https://bitly.com/pages/pricing): Core $10/mo (annual), Growth $29/mo (500 links, 10 QR codes/mo, 4-month data), Premium $199/mo (200 QR codes, campaign tracking).
- [Dub](https://dub.co/pricing): Business $81/mo, Advanced $270/mo (Partners plans; lower tiers not read on this fetch). Self-hostable.
- [CallRail](https://www.callrail.com/pricing): Lead Tracking $50/mo with 5 local numbers, recording, transcription; extra numbers $3 each. One number per mailer/truck/sign is the standard trades method, because these buyers convert by phone.
- Direct-mail vendors bundle tracking (QR, PURLs, matchback): e.g. [directmail.io tools roundup](https://directmail.io/blog/best-direct-mail-tracking-attribution-tools), [Scribeless stack guide](https://www.scribeless.co/blog/direct-mail-tracking-stack-2026); prices not verified.
- ServiceTitan Marketing Pro and Housecall Pro lead-source reports: prices not verified.
**Floor: $29/mo (Bitly) or $50/mo (CallRail).** A $250/mo service must sell the analysis, not the codes.

## 3. Margin (at $250/mo)
- Tools: self-hosted Dub (VPS + DB + Redis) or Dub Business $81/mo. Self-host ~$10-30/mo (estimate, not verified).
- Honest hours/mo: new codes/links per drop and getting them onto print files 0.5-1h, matching scans to booked jobs in the FSM 0.5-1h, monthly report 0.5h, client call 0.5h = **2-3h**.
- $50/h: 2h -> (250 - 100 - 20) / 250 = **52%**. 3h -> (250 - 150 - 20) / 250 = **32%**. With Dub Business instead of self-host, 2h -> 28%.
- Setup $500: domain, branded short domain, code inventory per asset, landing pages with UTMs, reporting template: 5-8h -> $250-400 labor -> 20-50%.
- Accuracy risk: QR scans capture only part of offline response; most trade customers call. A QR-only scorecard can mis-rank channels, and the client will notice.

## 4. Watering holes
Home services: ACCA, PHCC, NARI (remodelers), Nexstar, Service Nation; ServiceTitan and Housecall Pro communities; direct-mail buyers via EDDM printers and wrap shops (they are asked for QR codes first). Real estate: NAR, Inman Connect, Follow Up Boss community, r/realtors. Small-business general: r/smallbusiness, r/sweatystartup.

## Attention (30-day)
Low. A few owner questions; direct-mail vendors ([PostGrid](https://www.reddit.com/r/smallbusiness/comments/1xc257e/for_those_running_direct_mail_campaigns_for/)) and EDDM startups post in r/smallbusiness. Few course creators pitch this, which is consistent with low paid demand.

## The video's claims vs the evidence
- Repo is real: [dubinc/dub](https://github.com/dubinc/dub), ~25.1k stars, AGPLv3 core with a commercial-license `/ee` folder, self-hosting documented. Check that the features you use are not in `/ee`.
- "Contractors don't know which channel works": partly true (the May 6 post), but they solve the phone side with CallRail at $50/mo.
- "$3k+/mo offline spenders" exist, but none were found asking for this as a paid service.

## Verdict: ❌ REJECT (check 1; check 2 price cap)
Tight demand is 2. Cheap tools do the tracking, and for trades call tracking matters more than QR codes.
**Better angle:** offline attribution done right for trades: CallRail numbers + QR + FSM matchback by address, sold as a one-time setup to companies spending $5k+/mo on mail. Or white-label to EDDM printers and wrap shops, who are the ones being asked. Re-run Gate 0 on printers as the buyer.
