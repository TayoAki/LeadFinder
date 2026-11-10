# Niche Scorecard: "Buying-intent alerts" on Agent Reach (Gate 0)

2026-11-10 · Offer: each day, the 5 posts on Reddit, X, YouTube and LinkedIn where someone asks for what the client sells, each with a reply drafted in the client's voice, plus complaints about competitors. Buyers: SaaS (5-50 staff), agencies, niche e-commerce. Price in the video: $500 setup + $400/mo. The video calls it "the best one to start with".
Sources: Google index of Upwork job pages via treg (past year, 3 queries), Reddit search via treg (past year, 4 queries, about 100 posts), live pricing pages (Syften, Octolens, Brand24, Mention), the GummySearch shutdown notice, and case-law reporting.

| Check | Result | Evidence |
|---|---|---|
| 1. Buyers asking (20+) | ❌ FAIL | Tight: about 4 Upwork posts a year. Reddit has about 6 "how do I find people asking for my product" asks against 16+ "I built a tool for that" posts in the same search. |
| 2. Competitors with live prices | ❌ Saturated | F5Bot is free; GenLead $5, Redreach $19, Syften $29.95-119.95, Octolens $159, Brand24 $199-249 per month. That is more than 15 tools. |
| 3. Margin ≥50% at $400/mo | ⚠️ BORDERLINE | 52% at 3 h/mo upkeep, 0-15% at the 7-10 h/mo that daily replies in the client's voice really take (estimate). |
| 4. Named watering holes | ✅ PASS | See section 4. |
| Legal / ToS | 🔴 HIGH RISK | Reddit, X and LinkedIn all forbid this kind of scraping; details in "Legal and ToS risk" below. |

## The repo
[Panniantong/Agent-Reach](https://github.com/Panniantong/Agent-Reach): real, about 110.7k stars, MIT, read-only. It copies your Chrome login cookies into a background browser for Reddit (login needed), X ("experimental", login needed) and LinkedIn search (login needed); YouTube works without a login. The README itself advises using a secondary account because platforms "may restrict accounts that are accessed automatically". It also warns that experimental platforms "may stop working at any time". Agent Reach drafts nothing; reply drafting is a separate LLM step.

## 1. Buyers asking
**Upwork (past year).** Tight:
- "Social Selling on Reddit" (ID 022115838494): "identify high-intent Reddit posts and conduct proactive" outreach.
- "Reddit Growth & Community Marketing Specialist" (ID 022117806779): "Identify high-intent discussions".
- "Reddit Community Research & Engagement Specialist" (ID 022119891566): "Recommend 5-8 high-priority engagement opportunities".
- "Full Time Outreach Specialist" (ID 022118001934): find posts on LinkedIn, Reddit and X daily, then message the authors.

That is **about 4.** Loose: about 8 Reddit posting and community-management jobs. These buyers mostly want someone to post and engage for them, not a feed of alerts. Budgets: the Upwork sales and marketing median is about $17/h ([SnipeWork tracker](https://snipework.com/market/rates/sales-marketing), all categories). That is cheaper than $400/mo for a VA doing this at 5 h/week.

**Reddit (past year).** Buyer asks: [How do you find people already asking for your product?](https://www.reddit.com/r/saasbuild/comments/1x0xwwl/) (Oct 2026); [How do you track mentions on Reddit or HN?](https://www.reddit.com/r/SaaS/comments/1ti3kih/); [I keep missing Reddit threads about my product](https://www.reddit.com/r/AskMarketing/comments/1td256m/); [Looking for a Reddit-focused social listening tool](https://www.reddit.com/r/DigitalMarketing/comments/1pw4lwt/); [Social listening tool for LinkedIn posts](https://www.reddit.com/r/sociallistening/comments/1upp9kp/); [Basic social listening under $100/mo?](https://www.reddit.com/r/Communications/comments/1u6eh08/). Note the budget ceiling in that last one: under $100/mo.

Sellers in the **same 25-result search**: 16+ "I built a tool that finds Reddit posts asking for what you sell", for example [r/SaaS, Sep 2026](https://www.reddit.com/r/SaaS/comments/1wtaw0z/), [r/micro_saas, Oct 2026](https://www.reddit.com/r/micro_saas/comments/1xh8yqy/), [r/SideProject, Oct 2026](https://www.reddit.com/r/SideProject/comments/1wze560/), and [r/Entrepreneurship, Dec 2025](https://www.reddit.com/r/Entrepreneurship/comments/1pbh10d/). Sellers outnumber buyers by about 3 to 1.

## 2. Competitors (live prices)
- **F5Bot**: [free](https://f5bot.com/) keyword alerts for Reddit, HN and Lobsters.
- **Syften**: [$29.95 / $49.95 / $119.95 per month](https://syften.com/pricing), with AI filtering; X is +$40 and YouTube +$20; no LinkedIn.
- **Octolens**: [$159/mo Pro](https://octolens.com/pricing), covering Reddit, X, LinkedIn, YouTube and more, with "buy-intent" tagging and relevance scoring. **This is the offer, minus the drafted reply.**
- **Brand24**: [$249 / $349 / $499 per month](https://brand24.com/prices/) (monthly billing).
- **Reddit lead tools with AI reply drafts**: Redreach from $19/mo, OpportunAI $29, Subreddit Signals $29+, GenLead $5-10, RedditGrowth $29-199 (vendor and comparison pages, [round-up](https://redreach.netlify.app/alternative/opportunai); not each verified live).
- Mention and Common Room are quote-only or did not render (not verified).
- **GummySearch** closed on [2025-11-30 "to comply with Reddit's API policies, which forbid commercial applications"](https://gummysearch.com/closing-time).

The price ceiling is set by Octolens at $159/mo for the full multi-platform version, and by Redreach at $19/mo for Reddit with drafted replies. $400/mo has to be justified by the human voice-matching alone.

## 3. Margin at $400/mo (hours are estimates)
- Tools: LLM ~$20, proxies or secondary accounts ~$10-30, or a Syften/Octolens seat as the engine at $30-159.
- Labor: daily review of candidates, picking 5, and editing replies in the client's voice. 20-30 min/day × 22 days = 7-11 h/mo.
- At 8 h × $50: (400 − 40 − 400) / 400 = **−10%**.
- Automated with light QA at 3 h: (400 − 50 − 150) / 400 = **50%**. But at that point it is a $19-159 SaaS with a markup.

## Legal and ToS risk
- **Reddit:** the API policy forbids commercial apps without a licence, and that policy killed GummySearch. Reddit is suing scrapers ([Reddit v. SerpApi/Perplexity, SDNY, Oct 2025](https://searchengineland.com/reddit-sues-perplexity-serpapi-scraping-google-463681)).
- **LinkedIn:** hiQ was found to have breached LinkedIn's User Agreement by scraping, and ended with a [$500k consent judgment and an injunction](https://www.natlawreview.com/article/linkedin-s-data-scraping-battle-hiq-labs-ends-proposed-judgment).
- **X:** the terms ban scraping without prior written consent ([TechCrunch, 2023](https://techcrunch.com/2023/09/08/x-updates-its-terms-to-ban-crawling-and-scraping)), and liquidated damages of $15k per 1M posts were reported for the Nov 2024 terms (not verified on X's own page).
- **Agent Reach** runs on logged-in cookies, so the account at risk is yours or the client's. Selling this as a service puts a client's brand accounts in the ban path.

## 4. Watering holes
r/SaaS, r/microsaas, r/micro_saas, r/SaaSMarketing, r/sociallistening, r/SocialMediaManagers, r/AskMarketing; Indie Hackers; MicroConf and SaaStr communities; Product Hunt launch-day makers (they are actively hunting for users); r/ecommerce and r/shopify for the niche e-commerce slice.

## Attention (30-day)
At least 3 new "I built a Reddit lead finder" posts in the last 30 days (r/micro_saas Oct 27 and Nov 8, r/webdev Nov 7), plus course sellers pitching the same offer. This is the most crowded of the four offers.

## The video's claims vs the evidence
- "Best one to start with": **the opposite.** It has the most competitors, the cheapest substitutes ($0-19/mo), real platform legal exposure, and the lowest buyer-to-seller ratio.
- "$400/mo": above Octolens's $159, which does the multi-platform intent tagging. No evidence was found that buyers pay $400 for the reply drafts.

## Verdict: ❌ REJECT (fails checks 1 and 2; legal risk)
Buyers who look for this pick a $0-159 tool. The service layer (drafting replies in the client's voice) is the costly part and has no visible willingness to pay.

**Better angle:** skip the alerts. Sell done-for-you community engagement: a human posts and replies from the client's own aged accounts, inside each platform's rules. That is what the Upwork posts actually ask for. Run Syften or Octolens as the engine, and price on output (for example 20 helpful replies a month). Or go vertical where the tools are weak: local service businesses (see [r/AI_Agents, Jul 2026](https://www.reddit.com/r/AI_Agents/comments/1v6l4w7/)), using public Facebook groups and Nextdoor. Validate before building.
