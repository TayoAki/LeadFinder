import json
d=json.load(open('ranked.json'))
R=d['ranked'][:100]; X=d['excluded']; rest=d['ranked'][100:]
by={r['id']:r for r in d['ranked']}
def m(v):
    if v is None: return '—'
    return f"{v:,.0f}" if v>=10 else f"{v:,.1f}"
L=[]
L+=["# Top 100 open-source repos to build a 100M-dollar recurring-revenue offer on","",
"Built 2026-11-11 from **150 candidates across 40+ industries**:",
"- **Repos:** every one checked live (stars, licence, last commit) through treg.",
"- **Competitor revenue:** looked up with a source for every row.",
"- **US buyer counts:** Census County Business Patterns 2022.",
"- **Search demand:** DataForSEO US monthly volume for \"<competitor> alternative\" + \"<competitor> pricing\" (526 terms; one-word brands like Harvey, Make, Square are excluded because their searches are mostly about something else).","",
"## What \"can reach 100M dollars a year\" means here","",
"An offer **passes the 100M test** only if both are true:",
"1. **Proof:** a named company already earns 100M+ dollars a year in revenue or ARR selling the *same outcome* to the *same buyer*. Whole-company figures (Salesforce, OpenAI, UiPath, Zoom, Adobe) don't count.",
"2. **Room:** US buyers × our monthly price × 12 is at least 100M dollars. `Share needed` is the share of US buyers we'd have to sign to reach 100M dollars a year.","",
"**Score (max 10)** = proof (0–3) + room (0–3) + search demand (0–3) + judgement (−2 to +1):",
"- **−2:** the buyer already gets the outcome free or bundled, the project's maker sells the same hosting, or compliance blocks a small provider.",
"- **−1:** a real headwind.",
"- **+1:** a clear vertical wedge.",
"",
"Each judgement and its reason is in `judgement.json`.","",
"**Honest limits:**",
"- About a third of the competitor revenues are third-party estimates (marked `est`).",
"- Census counts are establishments. Broad \"SMB\" buyers use the 5–49-employee band (3.24M), which is still generous.",
"- The judgement column is mine.",
"- 100M dollars is a statement about market size, not a forecast.","",
"## Read this first: the shortlist","",
"The mechanical score favours **horizontal** offers: managed open-source replacements for HubSpot, Zapier, QuickBooks or 1Password, sold to every small business. They have huge markets and loud search demand, but they all fight a tool the buyer already owns, often with a free tier. They rank high on *size* and low on *wedge*.",
"",
"The offers most likely to actually reach 100M dollars pair a **vertical buyer** with a **pure-play company that already hit 100M+ selling the same thing**:",""]
SL=[(1,"Owner.com passed ~100M dollars ARR (Sacra estimate, Jul 2026; 2.3B dollar valuation) selling exactly this to exactly this buyer. 606k US restaurants; 6.9% of them at 199 dollars/mo = 100M dollars. Public phone numbers make outbound easy, and the latina-kitchen avatar fits."),
 (40,"Huntress reported 250M dollars ARR (Jul 2026) selling SMB security through MSPs. Needs under 1% of mid-size businesses. Catch: a 24/7 analyst team, so services margins."),
 (86,"Harvey is 190M+ dollars (company-reported; Sacra estimates 300M dollars by May 2026). 167k US law offices; 5% at 999 dollars/mo. Small and mid-size firms are priced out of Harvey and want their documents private."),
 (3,"Podium's AI-agent line alone is 150M dollars ARR. 371k home-service contractors; 9% at 249 dollars/mo. Wedge: bilingual (Spanish) answering. Crowded."),
 (82,"Zapier is about 310M dollars. Our wedge is done-for-you automation at a flat price; the risk is Zapier's and Make's cheap self-serve tiers.")]
for i,why in SL:
    r=by[i]; L.append(f"- **#{r['rank']} {r['repo']}: {r['offer']}** ({r['buyer']}, {int(r['price_mo'])} dollars/mo). {why}")
L+=["","**Pick for this campaign:** TastyIgniter (Keep the 30%). It's the only shortlist offer where a single company has already proven 100M dollars ARR on the same product, same buyer, same price band. It also matches the latina-kitchen avatar and a lead list with phone numbers. If you'd rather chase the biggest ceiling regardless of avatar, take private AI for law firms (#86 above), but the kitchen avatar won't fit it.","",
"## Top 100","",
"| # | Repo | ★ | Licence | Offer → buyer | Price/mo | Who proves it (rev. M$) | US buyers | Share needed | Searches/mo | Score | 100M test |",
"|---|---|---|---|---|---|---|---|---|---|---|---|"]
for r in R:
    inc=f"{r['incumbent'] or '—'} ({m(r['revenue_musd'])}{' est' if r['revenue_basis']=='estimate' else ''}{', whole co.' if r['revenue_scope']!='same outcome' else ''})"
    L.append(f"| {r['rank']} | [{r['repo']}](https://github.com/{r['repo']}) | {m((r['stars'] or 0)/1000)}k | {r['licence']} | {r['offer']} → {r['buyer']} | {int(r['price_mo'])} | {inc} | {m(r['us_buyers'])} | {str(r['share_needed_pct'])+'%' if r['share_needed_pct'] else '—'} | {m(r['search_volume'])} | {r['score']:g} | {'✅' if r['passes_100m'] else '—'} |")
L+=["",f"## Ranked 101–{100+len(rest)}",""]
for r in rest: L.append(f"- {r['rank']}. {r['repo']}: {r['offer']} (score {r['score']:g})")
L+=["","## Excluded (15): licence, archived or abandoned",""]
for r in X: L.append(f"- **{r['repo']}**: {', '.join(r['gates'])}. {r['note'].strip()[:220]}")
open('TOP100.md','w').write('\n'.join(L)+'\n')
