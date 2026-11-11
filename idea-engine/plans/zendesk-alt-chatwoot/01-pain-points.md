# 01 — Pain points: Zendesk, Freshdesk, Intercom, Gorgias, Help Scout

**Collected:** 11 Nov 2026. **Sample:** 1,542 raw items (63 Reddit threads with 1,399 comments, plus 80 Trustpilot reviews). Of these, **180 complaint snippets** were hand-labelled (a keyword pre-filter, then a manual read of every candidate; vendor plugs, defences of the incumbent and off-topic rows were dropped).

- **Date range:** 12 May 2022 – 11 Nov 2026 (71% from 2025 or later).
- **Sources:** 99 Reddit comments, 39 Reddit posts, 42 Trustpilot reviews.
- **Vendors mentioned:** Zendesk 109, Freshdesk/Freshworks 36, Intercom/Fin 33, Gorgias 29, Help Scout 14, Chatwoot 2. A snippet can name several vendors.

**Files to check every count**
- Raw data: `data/raw/` (Reddit search and comment JSON, Trustpilot JSON, G2/Capterra/pricing page extracts)
- Corpus: `data/corpus_raw.json`
- Keyword pre-filter: `data/complaints_classified.json` (script `data/scripts/classify.py`)
- Manual labels: `data/labels_part1.txt`, `data/labels_part2.txt`, `data/labels_tp.txt`
- Final labelled set: `data/complaints_labelled.json` (script `data/scripts/build_tally.py`)

**How snippets were sorted**
- **Tight (83):** the writer is clearly a business that buys or administers the helpdesk ("we pay", "our agents", "our renewal", an owner or CX lead). This is our buyer.
- **Loose (97):** the complaint is real, but the writer is a consultant, a competing vendor relaying what they hear, a support agent, or an end customer of a company that uses the tool.
- **Trustpilot caveat:** most 1-star Zendesk reviews are written by **end customers of companies that use Zendesk** (for example a shoe shop or a bike maker). Those are counted as loose, and only when they say something about the product (bad AI answers, for example). Pure "the shop didn't refund me" reviews were excluded.

## Tally

Shares are of 180 (all) and 83 (tight). One snippet can carry several themes.

| # | Pain theme | All | Share | Tight | Share of tight | Verbatim (short) |
|---|---|---|---|---|---|---|
| 1 | **Seat price too high / paying for unused features** | 52 | 29% | 24 | 29% | "our Zendesk bill has climbed to around $5,000 per month (not including add-ons)" ([r/Zendesk, Nov 2024](https://www.reddit.com/r/Zendesk/comments/1gjckww/zendesk_is_becoming_too_expensive_for_our_company/)) · "We moved away from zendesk due to pricing. Coz we were paying more for features we didn't use" ([r/SaaS, Mar 2026](https://www.reddit.com/r/SaaS/comments/1rh89xl/zendesk_alternative/obggcs4/)) · "any 'human-sized' alternatives that don't cost $100/month per seat?" ([r/ChoosingVendors, Jul 2026](https://www.reddit.com/r/ChoosingVendors/comments/1v9v98r/zendesk_is_way_too_complex_for_a_3person_support/)) |
| 2 | **Renewal traps, price hikes, can't reduce seats or cancel** | 38 | 21% | 23 | 28% | "Zendesk won't let me reduce seats despite me starting account review conversations 2+ months before my end date" ([r/Zendesk, May 2026](https://www.reddit.com/r/Zendesk/comments/1tqn39z/zendesk_is_a_scam/)) · "Our annual renewal came up this month and the reseller has given us a 35% price increase" (Freshdesk, [r/msp, Sep 2026](https://www.reddit.com/r/msp/comments/1w6x622/freshdesk_35_price_increase/)) · "'upgrading' our plan from 1500 a year to over 7500 a year" (Help Scout, [Trustpilot, Apr 2025](https://www.trustpilot.com/reviews/6807d35d0cb51a0076082e5c)) |
| 3 | **Too complex / clunky for a small team** | 29 | 16% | 10 | 12% | "we tried setting up zendesk and i felt like i was building a space station" ([r/ChoosingVendors, Jul 2026](https://www.reddit.com/r/ChoosingVendors/comments/1v9v98r/zendesk_is_way_too_complex_for_a_3person_support/)) · "The pricing and complexity feels like it was designed for a company with a dedicated support ops team" ([r/helpdesk, Apr 2026](https://www.reddit.com/r/helpdesk/comments/1sgbtvn/is_zendesk_alternative_territory_worth_exploring/)) |
| 4 | **Vendor support and sales behaviour** (no answers, aggressive sales) | 25 | 14% | 12 | 14% | "They will hold you hostage... when we ask to add one more license... they can send the DocuSign in less than 15 minutes" ([r/sysadmin, Sep 2023](https://www.reddit.com/r/sysadmin/comments/16htwtn/zendesk_alternative_having_a_terrible_sales/k0l3krq/)) · "their sales tactics are beyond aggressive" (Gorgias, [Trustpilot, Mar 2025](https://www.trustpilot.com/reviews/67e068610461c1d9f33211c5)) |
| 5 | **Usage-based AI / ticket billing** (per resolution, per ticket) | 24 | 13% | 10 | 12% | "I was already spending over $4k/month, with 40 agents. Now its shot up to $9k" (Intercom Fin, [r/SaaS, Feb 2024](https://www.reddit.com/r/SaaS/comments/1au13kp/my_intercom_billing_shot_up_by_120_it_was_because/)) · "Zendesk AI charges ~$1.50 per automated resolution (committed) or $2.00 pay-as-you-go" ([r/SaaS, May 2026](https://www.reddit.com/r/SaaS/comments/1tadxgf/migrating_from_zendesk_intercom_anyone_using_ai/)) · "gorgias is charging us a fortune because their system counts basic automated order tracking emails as 'tickets'" ([r/ChoosingVendors, Jul 2026](https://www.reddit.com/r/ChoosingVendors/comments/1uzo1zv/gorgias_ticket_volume_pricing_is_killing_our/)) |
| 6 | Reliability, bugs, emails not delivered | 20 | 11% | 13 | 16% | "Our Emails NEVER reach our customers!" ([r/Zendesk, Mar 2024](https://www.reddit.com/r/Zendesk/comments/1bex4jb/leaving_zendesk_our_emails_never_reach_our/)) · "One of the most unstable products I've ever used" (Gorgias, [r/shopify, Feb 2023](https://www.reddit.com/r/shopify/comments/10srq34/a_rant_about_the_consistently_unstable_gorgias_im/)) |
| 7 | Native AI doesn't actually resolve | 17 | 9% | 7 | 8% | "The ticket still needs tagging, the CRM still needs updating... So my team's hours did not really go down" ([r/Zendesk, Jun 2026](https://www.reddit.com/r/Zendesk/comments/1u8iz68/zendesk_ai_keeps_replying_but_never_actually/)) · "Just for Fin not to know how to answer a question such as 'How to log in'" ([r/CustomerSuccess, Feb 2026](https://www.reddit.com/r/CustomerSuccess/comments/1qwjjes/feeling_hopeless_with_fin_ai_of_intercom/)) |
| 8 | Migration and export pain keeps people stuck | 12 | 7% | 4 | 5% | "Got too busy to spend the needed time to move platforms. Not happy about Zendesk but stuck with it for at least another year." ([r/Zendesk, Dec 2024](https://www.reddit.com/r/Zendesk/comments/1d9llxg/i_am_sick_of_zendesk_do_i_even_need_it/m4j0wad/)) · "we couldn't even migrate all the customer data out" ([r/SaaS, Jun 2024](https://www.reddit.com/r/SaaS/comments/1diigqn/zendesk_is_a_scam_that_wont_let_you_cancel/l9l3gfd/)) |
| 9 | Channel sprawl (WhatsApp, Instagram, Facebook) | 5 | 3% | 5 | 6% | "Right now I have Whatsapp Business set up on my phone and one other person using linked devices" ([r/ecommerce, Sep 2026](https://www.reddit.com/r/ecommerce/comments/1w7eiml/omnichannel_customer_service/)) · "felt a bit clunky once most conversations shifted to chat and WhatsApp" ([r/SaaS, Jan 2026](https://www.reddit.com/r/SaaS/comments/un60z6/which_alternatives_do_you_recommend_for_zendesk/o0mbxur/)) |
| 10 | Missing features or paywalls | 3 | 2% | 3 | 4% | "In July Chatwoot moved API and webhook access on Cloud to paid plans ($19 per agent/month and up)" ([r/selfhosted, Sep 2026](https://www.reddit.com/r/selfhosted/comments/1wtywcn/moved_our_support_chat_off_chatwoot_cloud_after/)) |

## What the tally says

1. **The money pain is two pains.**
   - **Static cost:** seat price (#1).
   - **Contract behaviour:** auto-renewals, no seat reductions, 30-day cancellation notice, surprise uplifts (#2).
   - Among tight buyers the two are nearly equal (24 and 23). A cheaper flat price fixes only the first. **The offer must also fix the contract terms:** month-to-month, change seats any time, cancel in one email.
2. **Usage billing is a real and growing pain (#5), but it is a minority complaint today.**
   - There are 24 snippets, mostly 2024–2026, spread across Zendesk, Intercom Fin, Gorgias and Help Scout.
   - The strongest buyer quotes do the arithmetic themselves: "~$1,425–1,900/month just for AI on top of our existing plan".
   - **"No per-resolution fees" is a sharp hook, but not the whole offer.**
3. **Complexity (#3) is mostly a small-team pain:** 2–5 agents on Suite Professional. That fits a done-for-you migration with a slimmer setup.
4. **Migration fear (#8) is the main reason people stay.** "Done-for-you migration in 7 days" answers the objection behind every other pain.
5. **AI quality (#7) is a warning for us too.**
   - Buyers who tried native AI found it drafts replies but doesn't finish the job.
   - Promise resolutions only where we can show them (FAQ, order status), and report the real resolution rate.
6. **WhatsApp / channel pain is thin in this sample** (5 snippets), though every one of them is from a buyer. Treat WhatsApp as a feature of the offer, not as a segment on its own, until outbound proves otherwise.

## Context that is not complaint evidence

**Review-site ratings are high.** Collected 11 Nov 2026 from `data/raw/pages/`:

| Product | G2 | 4–5 star share |
|---|---|---|
| Zendesk for Customer Service | 4.3/5 (7,125 reviews) | 92% |
| Fin / Intercom | 4.5/5 (3,961) | 93% |
| Freshdesk | 4.4/5 (3,985) | 93% |
| Gorgias | 4.6/5 (582) | 95% |
| Help Scout | 4.4/5 (434) | 91% |

- Capterra: Zendesk Suite 4.4 (4,112), Freshdesk 4.5 (3,675).
- **Read: most users are satisfied.** The switchers are a minority with a trigger (renewal, AI bill, growth), not the whole base. Target triggers, not the logo.

**Trustpilot scores are low, but mostly reflect end consumers.** Zendesk's page is mostly consumers complaining about the companies that use Zendesk, so it is not a buyer signal.

**Freshworks outage (Mar 2026), seen in 3 Trustpilot reviews:**
- "After a week and a half of being down and losing all data" ([Trustpilot, 13 Mar 2026](https://www.trustpilot.com/reviews/69b34fbd069021190dffeed3); also [11 Mar 2026](https://www.trustpilot.com/reviews/69b1429e443a299c4bec8cb3))
- The reviews don't name the product, so they are counted as loose.
- The incident is unverified beyond these reviews.

## Gaps and honest limits

- **G2 and Capterra pages yielded ratings and AI summaries, not individual low-star reviews.** The extractor returned the first page only, so they add context, not counts.
- **Trustpilot depth:** only page 1 (20 reviews per vendor) came back.
  - Later pages returned nothing.
  - A deeper DataForSEO pull (200 Zendesk + 360 others) was submitted, but its tasks were still "Task Handed" at write-up time (`data/raw/dfs_tp_*.json`). Re-poll to extend the Trustpilot sample.
- **Reddit's own search was blocked (429).** Posts came from AnyAPI Reddit search (25 per query, 26 queries) and comments from AnyAPI post-comments. Search ranking decides what was sampled, so these counts are **relative weights, not market shares**.
- **Labels are one reviewer's judgement.** Re-label `data/labels_*.txt` if you disagree. The scripts rebuild the tally.
