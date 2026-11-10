# Niche Scorecard: Listing packs (CIM, blind teaser, buyer list) for business brokers (Gate 0)

Date 2026-11-10 · sources: GitHub page, Upwork/Fiverr via web search, Searchfunder, IBBA site, vendor pricing pages, Reddit (treg; r/businessbrokers blocked with 429, r/smallbusiness 12 months), LinkedIn jobs (treg, 2 queries, not useful) · windows: as indexed; Reddit 12 months.

Offer: per listing, a CIM-style marketing package, blind teaser and target buyer list, for brokers and small M&A advisers listing 5+ businesses a year. $1,000 per pack. He says he sold one for $3,000 with a custom GPT.

| Check | Result | Evidence |
|---|---|---|
| 1. Buyers asking (20+) | ❌ FAIL on-platform | Tight 1 (a brokerage hiring a freelance CIM writer). Brokers don't post on Upwork. |
| 2. Competitors with live prices | ✅ PASS | Web Acquisition $1,500; Deal Memo $1,250 + fees; Exit Pilot from $997; Fiverr $50-100; Patterns $15k sprint. |
| 3. Margin ≥50% | ⚠️ BORDERLINE | 28-63% at $1,000; passes once templates and a repeat broker cut review rounds. |
| 4. Watering holes | ✅ PASS | IBBA (3,100+ members), CABB, TABB, BBF, M&A Source, Searchfunder, BizBuySell broker directory. |

## The repo
- **anthropics/financial-services** ([GitHub](https://github.com/anthropics/financial-services)), Anthropic org, Apache-2.0. Page shows ~41.2k stars, 5.7k forks. Some mirrors call it `financial-services-plugins`.
- Real: the investment-banking plugin has `/cim` (cim-builder), `/teaser`, `/buyer-list` (strategic + financial buyer universe), plus `/one-pager` and datapack-builder. README: outputs are "staged for human review"; not advice.
- Built for investment banks (40-60 page Word CIM per a [skill listing](https://skillselion.com/skills/anthropics/financial-services/cim-builder)). Main-street brokers selling $500k-5M businesses usually need 10-25 pages. Buyer lists need data (PitchBook/CapIQ connectors are paid); for small deals the buyer pool is mostly individual searchers, which a "buyer list" can't name.

## 1. Buyers asking
- **Upwork job posts: 0 found.** Searches return only sellers ([CIM/IM service](https://www.upwork.com/services/product/consulting-hr-an-institutional-grade-confidential-information-memorandum-cim-im-1728368485360197632), [CIM for M&A/PE](https://www.upwork.com/services/product/consulting-hr-a-confidential-information-memorandum-cim-for-m-a-pe-sale-1910423302891763612)).
- **Tight (1):** Boss Group International hiring a [freelance writer](https://app.qwoted.com/job_postings/freelance-writer-remote-839dab4b-0cfb-48ad-b527-b9efd8068013) to turn advisor interviews with sellers into a CIM and a one-page business profile. A brokerage outsourcing exactly this deliverable.
- **Loose:** Searchfunder ["Business brokers: how do you make your CIMs?"](https://searchfunder.com/post/business-brokers-how-do-you-make-your-cims-and-materials) (a would-be vendor asking, 0 replies, ~1 yr old); r/smallbusiness ["selling without a broker"](https://www.reddit.com/r/smallbusiness/comments/1rfb1vg/thinking_about_selling_my_business_without_a/). r/businessbrokers could not be read (Reddit 429).
- LinkedIn jobs (2 queries, US, past month): no brokerage CIM roles in results; not useful.
- Money signal elsewhere: IBBA runs a ["CIMs That Sell and Close"](https://www.ibba.org/event/cims-that-sell-and-close/) session and lists a vendor, [BBMS Media](https://ibba.org/?p=35144), selling broker marketing on flat fees. Rejigg claims brokers charge sellers $5k-15k to create a CIM (per search summary, not verified).
- Counts: **tight 1, loose ~3.** Budgets: not verified.

## 2. Competitors (prices)
- **Web Acquisition** ([page](https://webacquisition.com/confidential-information-memorandum-creation-service/)): **$1,500** flat CIM, 7-10 business days, works with brokers or FSBO. No teaser/buyer list.
- **Deal Memo** (broker-focused, white-label, 72 h): "1 CIM pack $1,250 plus fees", no valuation/modelling ([pricing](https://dealmemo.com/pricing), per search snippet; page returned 503, not verified live).
- **Exit Pilot AI** ([pricing](https://exit-pilot-ai.leanengineering.ai/pricing)): from $997 to $24,000 one-time, teaser + CIM in higher tiers (per search summary).
- **Patterns** ([pricing](https://www.patterns.app/pricing)): $15,000 sell-side sprint incl. teaser + CIM draft; software $800/user.
- **Fiverr:** CIM + teaser gigs ~$50-100 ([vartikaa_goel](https://www.fiverr.com/vartikaa_goel/build-confidential-information-memorandum), [SMB listings CIM](https://fiverr.com/tamardaniel/create-a-cim-for-smb-listings)).
- **AI tools** (prices not verified): Flippa BrokerAI CIM builder, BizBen AI CIM generator, SMB.co generator, AIVI "from $79".
- Read: $1,000 sits just under the two broker-focused human services. Not saturated at the white-label tier (2-3 named vendors).

## 3. Margin (at $1,000 per pack)
- Tokens $10-30.
- Hours: seller/broker intake call 1-1.5 h; recast financials and SDE sanity check 2-3 h; draft CIM + teaser with the plugin 1 h; edit, format, brand 2-3 h; buyer list research and check 1-2 h; broker review rounds 1-2 h = 8-12.5 h.
- Rate: writer with small-business finance literacy $55/h → $440-690.
- Margin: (1,000 − 30 − 690)/1,000 = **28%** first packs; (1,000 − 10 − 440)/1,000 = **55%** typical; ~6 h once templated for a repeat broker → (1,000 − 10 − 330)/1,000 = **66%**.
- Risk: misstated financials in a CIM; the broker owns the document, but quality errors end the account.

## 4. Watering holes
- IBBA (3,100+ members per [IBBA](https://www.ibba.org/articles/a-thankful-reflection/)) and its conference/vendor list; state groups: CABB, TABB, Business Brokers of Florida, others on the [IBBA affiliates page](https://www.ibba.org/about/affiliates/nevada-business-brokers-association-nbba/); M&A Source; Business Brokerage Press webinars; Searchfunder; r/businessbrokers; BizBuySell / BizQuest broker directories (public lists of active brokers with listing counts).

## Attention (30-day)
- Low seller noise in broker spaces; the AI noise is in tools (Flippa, BizBen, Anthropic plugin). Few course creators pitch this; good for an early mover, but brokers can now run the plugin themselves.

## The video's claims vs the evidence
- Repo is real and does CIM/teaser/buyer list.
- "$1,000 per pack": consistent with Deal Memo ($1,250) and Web Acquisition ($1,500).
- "Sold for $3,000 with a custom GPT": not verified.
- "Brokers listing 5+ a year": the right target; volume makes templates pay.

## Verdict: 🟡 RESEARCH SLOT
Fails on-platform buyer count (brokers don't post jobs), but there is a money signal elsewhere: two broker-focused CIM services with published $1,250-1,500 prices, an IBBA vendor category, and a brokerage hiring CIM writers. Margin passes after templating.
**Better angle:** white-label "listing pack in 72 h" for main-street brokers (10-20 page CIM + blind teaser + BizBuySell listing copy), $750-1,000, with a 3-pack starter for one firm. Drop the buyer list for sub-$5M deals or sell it as an add-on to M&A advisers. Next test: 10 broker conversations from IBBA/state directories asking what they pay now.
