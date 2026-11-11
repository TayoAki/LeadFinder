# Trends and proven acquisition channels (pulled 2026-11-11)

**Sources:**
- **Search:** DataForSEO US monthly volume, with YoY = last 6 months vs the same months a year earlier (`trends/`).
- **Google ads running right now:** SerpApi, from an Austin, TX location.
- **Advertisers' estimated Google Ads spend:** SpyFu. These are third-party estimates of the cost of the keywords they appear on.
- **Meta ads running now and how long they've run:** the Meta Ad Library via crawl4ai.

Raw data is in `raw/`. Spend was about 0.45 USD.

**What counts as a "proven" channel:** a competitor keeps paying for it month after month. Ads that have run for 4+ months, or sustained spend on the same keywords, only last if they turn into customers.

## Market trend: which category is growing

| Market | Growing | Shrinking |
|---|---|---|
| **Legal AI** | "harvey ai" **40,500/mo, +95%**; "legal ai" 18,100, +8%; "eve legal" 5,400, **+130%**; "ai for law firms" 1,900, **+129%**; "legal ai tools" 1,600, +72% (CPC 65 USD); "clio ai" 880, **+135%**; "ai for lawyers" 3,600, +18% (CPC 54 USD) | "chatgpt for lawyers" 590, −57% |
| **Helpdesk** | "zendesk alternative" 1,600, **+225%** (CPC 119 USD); "chatwoot" 2,400, +66%; "intercom fin" 1,300, +49% | "help desk software" 4,400, **−70%**; "customer service software" −45%; "ai customer support" −38% |
| **Security** | "huntress" 33,100, +19%; "cmmc" 27,100, +11% | "managed detection and response" 480, **−56%**; "managed soc" −52%; "soc as a service" −63%; "cyber insurance" −20% |

**Correction to earlier work:** I said legal AI had "almost no search demand". That came from measuring only switch terms ("cocounsel pricing"). The category itself is the fastest-growing of the three. Helpdesk and security buyers search for *alternatives and brands*, while their category terms are falling.

## Proven acquisition channels

| Market | Channel | Evidence it pays |
|---|---|---|
| Helpdesk | **Google ads on "zendesk alternative" / "help desk software"** | 6 advertisers on "zendesk alternative" today (Freshdesk, Front, Hiver, Plain, BoldDesk, and Zendesk defending itself). SpyFu estimates Hiver ~128k, BoldDesk ~178k and Front ~394k USD/mo on helpdesk and competitor terms. **Proven but crowded and expensive** (CPC ~119 USD). |
| Helpdesk | Meta ads for an AI support agent | HelpCrunch ad running **366 days**, Podium 135 days. Weak signal: few advertisers. |
| Helpdesk | Comparison pages, help-centre lead lists, open-source community | "chatwoot" +66% searches. Zendesk users are identifiable (help-centre subdomains); the plan's lead lists cost ~0.06 USD per company. |
| Security | **MSP partner channel** | Huntress (~250M USD ARR, ~300k organizations) is sold mostly through MSPs; on Google it bids "MDR for MSP" and "MDR without enterprise pricing". SpyFu estimates ~218k USD/mo on adjacent security terms. Blackpoint ("MDR built for MSPs") ~33k USD/mo. |
| Security | Google ads on MDR terms | 4–6 advertisers (Huntress, eSentire, Blackpoint, Cynet, CrowdStrike, Deepwatch), but the category's searches are falling 50–63% with CPCs of 85–337 USD. **Proven, very expensive, shrinking.** |
| Security | Meta | Almost nothing running (SubRosa 33 days, Blackpoint 13 days). **Not a channel.** |
| Legal | **Google ads on "ai for lawyers"** | Harvey, Clio, Eve and LegalOn all bid. SpyFu estimates Clio ~412k USD/mo; Eve (plaintiff-firm AI) ~44k USD/mo, bidding on *personal-injury lawyer* terms (our S2 segment). |
| Legal | **Meta ads to lawyers** | Second Chair.ai ad running **257 days**, Monza AI **242 days**, Eve Legal 3 ads up to 128 days. **Small legal-AI startups sustain Meta ads for 8+ months, the strongest small-player evidence of the three markets.** |
| Legal | Practice-management marketplaces and bar programmes | Clio is pushing AI ("clio ai" +135%); integrating with Clio is both a distribution channel and a must-have. (Bar-association member-benefit programmes not checked in this pull.) |

## What it means for the order

- **By speed to 10k MRR and number of users (simulation):** helpdesk ≈ security, then legal.
- **By market momentum and evidence that small entrants can buy customers profitably:** legal AI leads. Its category is growing fastest, and small competitors (Second Chair, Monza, Eve) keep paying for ads for 8+ months.
- **Helpdesk:** has measured switching demand, but its only big paid channel is crowded at 119 USD a click. Win it with comparison pages plus outbound to known Zendesk users.
- **Security:** its proven channel is MSP partnerships, which take relationships and time. Its category search is falling, so outbound and partner-led sales are the way in.
