# AI-native CRMs: threat to the cleanup idea, and the real-estate CRM picture

Date: 2026-11-10. Builds on [crm-data-agents-landscape.md](crm-data-agents-landscape.md) (Attio ~$116M, Lightfield $47M A, Day AI $20M A, Rox reported $1.2B; Lightfield's migration agent moves a HubSpot portal in ~1 hour and dedupes on import).

**Two questions.**
1. Do AI-native CRMs make our "AI-Ready HubSpot" cleanup sprint (10-200-person companies) moot?
2. For a realtor product (content/video), what do the real-estate CRMs do with AI, where is the gap, and how would we plug in?

**Sources and limits**
- Live pricing pages fetched today: attio.com/pricing, lightfield.com/pricing, lightfield.com/migration, day.ai/pricing, clarify.ai/pricing, folk.app/pricing, twenty.com/pricing, close.com/pricing, capsulecrm.com/pricing, followupboss.com/pricing, followupboss.com/zillow-pro, followupboss.com/integrations, lofty.com/pricing, sierrainteractive.com/pricing, wiseagent.com/pricing, attio.com/experts, Attio help center (migration).
- Blocked or failed: G2 (not opened; figures are from search snippets), geekwire (403), reddit.com direct (read via treg instead), realgeeks.com/pricing (404).
- Reddit: 18 searches and 11 comment pulls via treg (anyapi, crawl4ai). Meta Ad Library: 7 advertiser lookups via treg (scrapecreators).
- Funding totals from aggregators (Caplight, Dealroom, vcbacked, kscope) disagree often. I give the round from press and mark totals **unverified**. Customer counts are company claims unless noted.
- **treg spend: about $0.03-0.04** (18 Reddit searches x $0.0012, 11 comment pulls x $0.0009, 4 billed ad lookups x $0.0019; 3 ad lookups returned nothing and were not billed). Shared team balance went $7.59 → $7.57. Cap was $0.60.

---

## Bottom line

| Question | Answer |
|---|---|
| Who is actually switching? | **Startups and small tech teams, mostly greenfield.** YC-stage companies mostly pick neither HubSpot nor Salesforce ([SaaStr](https://www.saastr.com/which-crm-should-you-use-in-2026-2027-follow-the-agents/), author's poll). Lightfield says "hundreds" of its 2,500+ workspaces came from HubSpot ([ContentGrip, Mar 2026](https://www.contentgrip.com/lightfield-one-hour-crm-migration/)). Attio claims ~5,000 paying customers. Reddit shows HubSpot → Attio moves at 2-25-person teams with simple data (contacts, companies, deals). |
| Is it a migration wave? | **No. Early-adopter only, outside startups.** No source shows mid-market HubSpot Pro/Enterprise portals moving in volume. SMB voices on r/CRM say Attio is "fad-ish for non power users" and "less than 1 in 250 SMBs" can run it. The bigger SMB leakage from HubSpot goes to GHL, Pipedrive, Zoho, Insightly, Close (price, not AI). |
| Threat to the cleanup sprint | **High** for startups under ~30 people on HubSpot Starter/free. **Medium** for 30-80-person tech/SaaS on Sales Hub only. **Low** for 50-200-person HubSpot Pro/Ent with Marketing Hub, workflows, forms, sequences, attribution, and for regulated or services firms. Timeline: real pressure on the mid-market in 2028+, not before. |
| Opportunity flip | **Yes, but small and crowded at the low end.** Attio lists 64 experts. Public prices: Craftt $700 migration, $1,500 tune-up, $2,500-2,997 sprint; agencies quote $3k-15k for migration + rebuild. Fiverr is full of Attio setup gigs. Good as a **second offer** ("clean before you move, or clean and stay"), not as the main business. |
| Real-estate CRM picture | Market is owned by lead-gen + CRM bundles (FUB/Zillow, Lofty, BoldTrail, Sierra, Real Geeks, CINC, Ylopo). Every one now sells AI: texting ISAs (Ylopo, CINC Alex, Sierra Lead Engage, Real Geeks Geek AI), AI messages and summaries (FUB), agentic "OS" (Lofty AOS, Feb 2026), AI super-app (Rechat Lucy), AI relationship engine (Luxury Presence Presence CRM, $37M Jan 2026). **No funded "AI-native" real-estate CRM startup found** for agents in 2025-2026. |
| Opening for us | **An AI content layer, not a new CRM.** Agents complain about bloated CRMs, data lock-in (Zillow owns FUB), and "AI slop". Content/video is thin inside CRMs: Lofty has a "Social Agent" (details not public), Wise Agent sells branded listing videos (+$20/mo). A product that turns CRM data (new listing, just sold, past-client anniversaries, sphere) into on-brand video and posts, and writes activity back to the CRM, fits the gap. |
| Integration path | **Follow Up Boss first** (open REST API, webhooks, 250+ integrations, "Video" category, register system with X-System key, no listed fee). **Lofty second** (OAuth developer platform with review, marketplace). Sierra, Real Geeks, BoldTrail, CINC via Zapier or partner deals. |

---

## PART A: general AI-native CRMs

### A1. Company profiles

Legend: price is list price per seat per month unless stated. "AI-native in practice" lists what is actually shipped, from the vendor's live page or press.

| Company | Funding / investors | What "AI-native" means in practice | Target | Pricing (live today) | Migration tooling | Customers | Reviews / complaints | Does not do yet |
|---|---|---|---|---|---|---|---|---|
| **Attio** ([pricing](https://attio.com/pricing)) | Series B **$52M, Aug 2025, led by GV**, with Redpoint, Balderton, Point Nine, 01 Advisors ([BuiltIn](https://builtin.com/articles/attio-raises-52m-series-b-20250827)). Total ~$116M (most trackers); SaaStr says $141M. **Total unverified.** Acquired Inconvo, Jul 2026 (tracker, unverified). | Email/calendar sync on all plans; "Ask Attio" natural-language chat; AI agents on all plans; web research agent; call recording and analysis (Pro+); record summaries; SQL engine for agents and BI tools (CTO AMA on r/CRM, [Oct 28 2026](https://www.reddit.com/r/CRM/comments/1xhp1fz/)); MCP server. Self-building data model: no, you build it (flexible objects). | Startups and scale-ups, Series A/B; VC firms | Free (3 users); Plus $40/mo annual incl. 1 user, +$35/user; Pro $100/mo incl. 1 user, +$79/user; Ultra $1,000/mo annual incl. 5 users, +$189/user. Credit packs $70-475/mo. | **Import2**, free for paid plans, ~40 source CRMs incl. HubSpot and Salesforce; sample run first. **Dedupe:** matches People by email and Companies by domain; matched records keep their Attio values (only notes/tasks added). CSV import has no notes. Migration services via sales; forward-deployed engineer on Ultra ([help](https://attio.com/help/reference/imports-and-exports/migrate-data-from-another-crm)). | Claims ~5,000 paying (SaaStr; one 2026 profile says 30,000+ active, 5,000+ paying, unverified). Named: Lovable, Granola, Modal, Replicate. | G2 snippet: 4.3/5 from 446 reviews (another snapshot 4.4/30). Complaints: weak reporting, missing automations, integrations (e.g. no Apollo integration), multi-currency, price at scale for credits. Reddit: "UX is terrible… slow… like a raw SQL database" (one user); "Companies < 25 employees, Attio should be a no brainer." | Marketing automation (no real email marketing / forms / lead scoring like HubSpot Marketing Hub); robust reporting; native dialer; Salesforce-class permissions. |
| **Lightfield** ([pricing](https://lightfield.com/pricing), [migration](https://lightfield.com/migration)) | **Series A $47M, Sep 9 2026, led by a16z**; Maverick, Coatue, Greylock, Lightspeed, Audacious reported ([a16z](https://a16z.com/announcement/investing-in-lightfield/), [Pulse2](https://pulse2.com/lightfield-raises-47-million-series-a-to-build-ai-native-crm-for-companies-using-agents/amp/)). SaaStr says "$81M at $300M valuation" (unverified, may include prior Tome money). Founders of Tome. | Auto-captures email, calendar, Slack, meetings (records and transcribes); agent updates records automatically; chat; workflows and sequences; Granola integration; bi-directional sync with HubSpot/Salesforce on Enterprise. | Founder-led sales, startups up to ~50 people (SaaStr); "companies that run on agents" | Starter $89/user/mo (max 3 seats, 50k records); Pro $999/mo annual (5 capture seats, unlimited viewers); Growth $2,999/mo; Enterprise custom. Extra capture seat $200/mo. (SaaStr quoted $36/user earlier in 2026; live page now $89.) | **CSV migration agent** from "any CRM": maps fields, rebuilds pipeline stages, ~15,000 records/hour per the live page (90,000/hour per Mar 2026 press). "Handles deduplication and cleanup during import, so you don't need to clean the data first." Workflows not migrated. Run in parallel at no extra cost. | "Used by +5,000 companies" (site); 2,500+ workspaces by Mar 2026, "hundreds" from HubSpot, 100+ YC startups (company claims). No named customers on site. | No G2 reviews found. Reddit: a user prefers it to Attio ("built around capturing the real work… minimal setup"); another notes card needed to trial. | Marketing automation; reporting depth; large data sets above 750k records; proven at 100+ seats. |
| **Day AI** ([pricing](https://day.ai/pricing)) | **Series A $20M, Feb 2 2026, led by Sequoia**; Greenoaks, Conviction, Sound Ventures; ~$24M total ([Pulse2](https://pulse2.com/day-ai-20-million-series-a/)). Valuation $80-100M (Dealroom vs Caplight, unverified). Founders ex-HubSpot (Christopher O'Donnell, Michael Pici). | "CRMx": context graph built from Gmail/Calendar and meetings, each fact with source; natural-language requests; long-running agents ("skills") on schedules; custom smart properties that backfill from web research. | Startups as CRM replacement; scale-ups as a layer next to an incumbent | Priced **per agent**: Free; Turbo $24; Professional $60; Executive $200; Super $800 (annual). Volume discounts to ~50%. | No migration tool listed. Builds records from inbox history instead. | ~120 customers at GA (Feb 2026, press); ~35 staff. | No G2 data found. | Classic pipeline admin, marketing automation, migration. |
| **Rox** | Seed (Sequoia) + Series A (General Catalyst, GV) ~$50M; reported new round led by General Catalyst at **$1.2B** (TechCrunch sources, Mar 2026, **unconfirmed**); ARR ~$8M end-2025 (reported) ([Yahoo/TC](https://finance.yahoo.com/news/sales-automation-startup-rox-ai-222550353.html)). | Swarm of agents over unified data (CRM + calls + warehouse); writes back into Salesforce. Sits **on top of** Salesforce more than replacing it. | Enterprise sales teams | Usage/outcome-based; third parties cite free starter and ~$50/mo core (unverified). | Not a migration product; connects to existing CRM. | MongoDB, New Relic, Ramp, Couchbase, WSP, Together AI (third-party list, Oct 2026, unverified). | No G2 reviews (third party). | Not an SMB product. |
| **Clarify** ([pricing](https://www.clarify.ai/pricing)) | **Series A $15M, Jun 2025, USVP + Gradient**; Madrona and others; $22.5M total ([GeekWire](https://www.geekwire.com/2025/seattle-startup-clarify-lands-15m-to-take-on-salesforce-with-ai-native-autonomous-crm/)). Acquired Seam AI, Jul 2026. | "Autonomous CRM": AI sales agent, deal and meeting intelligence, auto-enrichment, campaigns (outbound, Mar 2026). | Startups / early-stage B2B | Free (1k credits); Starter $50/mo; Growth from $1,000/mo; Enterprise custom. Unlimited seats. | "CRM migration" only on Growth, "talk to sales." | None named on site. | No data found. | Mid-market features; self-serve migration. |
| **folk** ([pricing](https://www.folk.app/pricing)) | Seed ~$3.3M (2021, Accel); Series A **$33M, 2023, led by Bessemer** (press, not re-checked today). Later rounds unverified. | Research, follow-up, recap and workflow "assistants"; AI "magic fields"; auto-merge contacts; email/calendar/WhatsApp sync; MCP. | Relationship-heavy small teams: agencies, VCs, recruiters, consultants | Standard $24/member/mo annual; Premium $48; Enterprise from $80. | CSV import; "Migrate my CRM" service (plans unclear). | Not found. | Not checked. | Deep pipeline/forecasting; enterprise. |
| **Twenty** ([pricing](https://twenty.com/pricing)) | Seed **$5M, Nov 2024, Runa Capital** ([tech.eu](https://tech.eu/2024/11/19/twenty-secures-5m-to-challenge-crm-giants-with-open-source/)). Later rounds reported by trackers ($30M or $100M Series B, 2026) **conflict, unverified**. | Open source. Agentic workflows on all plans; weekly AI allowance; MCP server; app SDK (2026). | Technical teams, self-hosters, agencies | Free self-host; Cloud Pro $9/user; Organization $39/user; Enterprise from $50k/yr. | CSV, API for 50k+ records; partner network for full migrations (Org+). | 20k+ GitHub stars (one profile, unverified). | Not checked. | Turnkey AI capture; done-for-you migration. |
| **Affinity** (comparison) | Long-funded incumbent for private capital. Launched "Affinity Ascend" agent platform (Jul 22 2026) and MCP (Apr 2026) per its newsroom. | Relationship intelligence from email/calendar, auto data capture; now agents. | VC/PE, investment banks | Not public; ~$2,000-2,700/user/yr (third party, unverified). | n/a | n/a | n/a | Not a general SMB CRM. |
| **Close** (comparison) ([pricing](https://www.close.com/pricing)) | Bootstrapped/profitable (not checked today). | "Chloe" AI sales agent (GA Jun 2026, third party) on all plans incl. batch calling; Growth+ adds Chloe in workflows, auto updates, lead summaries. | SMB inside sales | Solo $9, Essentials $35, Growth $99, Scale $139 per user/mo (lower prices are likely annual). | Not checked. | n/a | n/a | Not "AI-native" by design, but closes the gap fast. |
| **Capsule** (comparison) ([pricing](https://capsulecrm.com/pricing/)) | Not checked. | Bolt-on: AI pipeline generator (Starter), AI enrichment, AI summaries (last 50 activities), MCP connectors (Growth+). | Small businesses | Free; Starter $18; Growth $36; Advanced $54; Ultimate $72 (annual). | Not checked. | n/a | n/a | No agent; AI is light. |

**Newer entrants (2025-2026)**

| Company | Round | Positioning | Source |
|---|---|---|---|
| **Monaco** (Sam Blond, ex-Founders Fund) | $35M seed + A (Founders Fund), Feb 2026; reported **$50M Series B led by Benchmark** later in 2026 (>$85M total, unverified) | AI-native CRM + prospect database + human sellers in the loop, for early-stage startups | [TechCrunch](https://techcrunch.com/2026/02/11/former-founders-fund-vc-sam-blond-launches-ai-sales-startup-to-upend-salesforce/), [Pulse2](https://pulse2.com/monaco-50-million-series-b-raised-for-ai-powered-sales-platform-expansion/) |
| **Zero** (Helsinki, ex-Smartly founders) | $10.3M seed, Sep 15 2026, led by Primary Venture Partners; angels from Lovable, Supercell | "GTM operating system" to replace CRM with agents | [tech.eu](https://tech.eu/2026/09/15/crm-challenger-zero-gets-backing-from-lovable-and-langdock-founders-in-10m-raise/) |
| **Aurasell** | $30M seed, Aug 2025 (per SaaStr/search snippets; **unverified**) | All-in-one GTM stack, ~$15k platform fee (Reddit user), also runs on top of HubSpot/SF | [SaaStr](https://www.saastr.com/which-crm-should-you-use-in-2026-2027-follow-the-agents/) |
| **Superleap** (India) | ~$3.8M seed, Peak XV | Enterprise agentic CRM | [Dealroom](https://dealroom.co/news/142843-superleap-raises-rs-36-crore-seed-to-take-on-legacy-crm-giants/) |
| **Build-your-own** | n/a | Curative reportedly replaced a $600k/yr Salesforce contract with an internal AI-built CRM (r/CRMSoftware thread, Jul 2026, unverified). Several RevOps freelancers now build custom CRMs for SMBs. | Reddit |

**Who advertises (Meta Ad Library, US, active, today):** Attio 20 active ads (generic "new kind of CRM", UGC-style "90% follow-ups", agentic sales report). Lightfield, Clarify, Day AI: none found. So paid acquisition for AI-native CRMs is mostly Attio; the rest grow through founders, YC, X and content.

### A2. Adoption reality

**Who is switching**
- **Startups at creation.** "The vast majority" of current YC startups use neither Salesforce nor HubSpot (SaaStr poll). Lightfield cites 100+ YC startups. Attio's named customers are AI startups.
- **Small teams with simple data.** Reddit HubSpot → Attio threads are about contacts, companies, deals only. "CSV export from HubSpot → import into Attio works fine. Map fields once" ([r/CRM, Dec 2025](https://www.reddit.com/r/CRM/comments/1pst3ky/)). A 5-person post-seed team: "I rarely use the actual interface, I only interact with it via Claude" ([r/CRM, Sep 2026](https://www.reddit.com/r/CRM/comments/1wl1din/)).
- **Pipedrive users** moving to Attio (r/CRM, Mar 2026, anecdotal).

**Who is not switching**
- **SMBs outside tech.** "It ain't the one for SMB's… Early adopters love it but it seems fad-ish for non power users… Two other SMB's moved off HubSpot in my circle. One GHL…" and "less than 1 in 250 SMBs have someone on staff… to set up and run Attio" (same r/CRM thread, 71 comments).
- **Mid-market HubSpot shops.** "We're too far along (100+ HS users)" (same thread). SaaStr itself stayed on Salesforce: migration "too painful to justify", now runs 20+ agents on it. Lemkin's rule: each agent adds lock-in.
- **Marketing-heavy teams.** Repeated r/CRMSoftware threads ask for "HubSpot alternatives that make marketing automation simple". AI-native CRMs do not answer that; they lack Marketing Hub features.

**HubSpot's own response** narrows the gap: free Data Model Health Check, Agent CLI cleanup plans, Context Home AI-readiness score, Breeze agents, acquisition of Warmly (Reddit mention, unverified). HubSpot users on Reddit complain about price, not about AI.

**Verdict:** a real wave **inside the startup segment** (new companies default to Attio/Lightfield/Monaco), a trickle from small HubSpot portals, and **no evidence of a wave from HubSpot Pro mid-market**. Evidence is vendor claims plus anecdotes; no independent switching data exists.

### A3. Threat to the cleanup business, by segment

| Segment | Threat | Why |
|---|---|---|
| Startups <30 people, HubSpot free/Starter, sales-only | **High, now** | They are the AI-native CRMs' core buyer. Lightfield dedupes on import and runs free in parallel. Cheapest path for them is "leave", not "clean". Also low budget for a $6k sprint. |
| 30-80-person tech/SaaS, Sales Hub Pro, little marketing automation | **Medium, 2027-2028** | Attio/Lightfield/Monaco will move up as they add reporting and permissions. Founders at these firms read SaaStr and a16z. A cleanup sprint can be sold as "make HubSpot AI-ready so you don't need to migrate", but expect objections. |
| 50-200-person HubSpot Pro/Enterprise with Marketing Hub (forms, lists, nurture, lead scoring, attribution) | **Low through 2028** | No AI-native CRM replaces Marketing Hub. Switching breaks forms, workflows, reporting history. Migration agents skip workflows. Cleanup is still needed and HubSpot keeps them sticky. |
| Services firms, agencies, professional services, manufacturing/distribution on HubSpot | **Low** | Not the target of AI-native CRMs; no in-house admin to run Attio (Reddit). |
| Regulated (finance, health, insurance) | **Low** | Security reviews, audit logs, data residency; startups' CRMs only have SSO/RBAC at enterprise tiers. |

**Timeline reasoning.** AI-native CRMs are 1-3 years old, sell first to startups, and lack marketing automation and mature reporting. Attio, the most mature, still draws "weak reporting" complaints after five years. Moving up-market usually takes 2-3 product years. HubSpot ships data features every quarter. So: the sub-30-person segment is already at risk; mid-market HubSpot Pro is safe for roughly 2 years, then pressure grows as today's AI-native startups hit 50-200 people (they will never have had HubSpot, which shrinks our future pool rather than stealing current customers).

**Implication for the offer:** keep the ICP at **50-200 people, HubSpot Pro with Marketing Hub**. Drop founders' companies under 30 people.

### A4. Opportunity flip: migrating companies to AI-native CRMs

**Evidence of demand**
- **Attio Experts directory: 64 experts** (2 Elite, 12 Advanced, 15 Core on the first page) ([attio.com/experts](https://attio.com/experts)). For scale: HubSpot has thousands of solutions partners (not checked today).
- **Public prices are low.** Craftt: free audit, $700 migration, $1,500 tune-up, $2,500 7-day sprint (also quoted $2,997 with "6 AI agents"), $900/mo operating layer ([craftt.io](https://www.craftt.io/blog/attio-implementation-cost)). Alpgency: from €250/mo support; builds "low thousands of euros". Detailed: hourly retainer, 20 hrs/mo minimum.
- **Agency ranges** (Craftt, a competitor's own article, so biased): partner-assisted migration $500-3,000; full migration + rebuild $3,000-15,000; 15-person HubSpot → Attio year-one total $8,200-20,000; hourly $125-250.
- **Fiverr** has many "set up Attio CRM… migration" gigs. I found no Upwork data (search did not return Upwork posts).
- **Vendors compete with partners for free:** Import2 is free on Attio paid plans; Lightfield's agent does it in an hour; Lightfield Pro includes a CSM and "custom data model and automation help"; Attio Ultra and Lightfield Enterprise include forward-deployed engineers.
- **Reddit:** a 3-person agency says clients ask how "to prepare the crm to be AI efficient (cleaning data, creating context for the agents)", while another solo HubSpot partner has not onboarded or sold HubSpot "once" in 12 months ([r/hubspot, Sep 2026](https://www.reddit.com/r/hubspot/comments/1wse2mv/)).

**Verdict.** A migration service exists but it is a **commodity at $700-3,000** for small teams, and vendors give the mechanics away. The value left is judgment: data model design, what to drop, rebuilding automations and reports, change management, and HubSpot marketing pieces the new CRM can't do. That is real but only for 20-200-person companies, which are exactly the ones least likely to switch today.

**Recommended use:** add a **"Clean before you move" variant** of the sprint (same audit, cleanup and data model work, output = a clean export + mapping for Attio/Lightfield) at a lower price, and list as an Attio Expert later for lead flow. Keep the main offer HubSpot-centric.

---

## PART B: real-estate CRMs and AI

### B1. Profiles

| CRM | Owner / note | Pricing (live where linked) | AI features | What agents say (Reddit) | Gaps |
|---|---|---|---|---|---|
| **Follow Up Boss** ([pricing](https://www.followupboss.com/pricing)) | Owned by **Zillow** (bought ~$500M, 2023). Required for Zillow Preferred. | Grow $58/user/mo annual ($69 monthly) + calling $33-39; Pro $416/mo annual (10 users); Platform $833/mo annual (30 users). "No extra charge for AI." | Smart Messages, Smart Summaries, suggested tasks, predictive lead prioritization (Pro/Platform). With **Zillow Pro** premium: AI learns from Zillow browsing, recommends next steps ([zillow-pro](https://www.followupboss.com/zillow-pro)); "Likely to List" flags sphere contacts (Inman, Jul 2026). | "FUB is pretty good", "best bang for the buck". But: "Not after Zillow took them over, down hill for sure… searching for a new CRM"; "I low key hate FUB… can't even get date of the last activity in my reporting". Data-ownership worry: "Wouldn't that mean they get all your data? Even your sphere?" Zillow ending Premier Agent lead sales (Q1 2027 per users) lowers morale. | No IDX/website, no content/video creation, weak reporting. Trust gap from Zillow ownership. |
| **Lofty** (formerly Chime) ([pricing](https://lofty.com/pricing)) | Independent | "Request pricing" on all 4 plans; third parties ~$449/mo entry; one agent pays $350/mo, another $50/mo via brokerage deal. 20% ad mgmt fee. | **Lofty AOS** (Feb 2 2026): "Cowork" AI workspace, custom AI agents, AI CLI, AI lead scoring; add-on agents: **Sales Agent** (texting; ~$60/mo for 200 leads, unverified), **Social Agent** (social media marketing; price and specs not public), **Homeowner Agent** (seller leads, Apr 2026) ([RISMedia](https://www.rismedia.com/2026/07/28/lofty-expands-agentic-ai-os-real-estate-cowork/)). | "Not really happy with the UI… website has never generated a real lead". Some like it as a cheaper FUB alternative. | Pricing opacity; UX. Social Agent shows Lofty knows content is a gap, but no evidence of video. |
| **BoldTrail** (formerly kvCORE) | Inside Real Estate | Not public; usually bought by brokerages; $300-500/mo estimates (unverified). | BoldTrail AI Assistant, "Smart CRM + Marketing Autopilot" (third party). | "Beast for lead gen, but the design tools always felt clunky and outdated"; weak email analytics. A brokerage switched to Rechat for 2026. | Design/content tools; agent adoption. |
| **Sierra Interactive** ([pricing](https://www.sierrainteractive.com/pricing/)) | Independent | Starter $299.95/mo (1 user); Essential $399.95 (3); Growth $599.95 (5), annual, 12-month contract; $500 setup if monthly. | **Lead Engage** AI nurture $199/mo unlimited leads (not on Starter); AI Search. Facebook ad packs $75-200/mo. | Not much on Reddit. | Content/video; AI only for lead nurture. |
| **Real Geeks** | Owned by Fathom (not re-checked) | ~$399/mo base, 2 users (third party, Jul 2026); **Geek AI** texting +$49 (unverified). Pricing page 404 today. | AI SMS nurture | Little recent discussion. | Content. |
| **Ylopo** | Summit Partners-backed (job board) | Not public; ~$295-500/mo + setup (third party, unverified). | AI texting and **Raiya** AI voice that calls leads; integrates with FUB and Lofty. | "Ylopo is integrated to streamline for prop searches, value reports" (FUB + Ylopo users). | It is lead-gen + nurture, not a CRM. |
| **CINC** | Owner not checked today | Not public; "$899+/mo solo, $1,500 teams" (third party, unverified). | "Alex" AI assistant texting leads since 2018. | Little recent discussion. | Price; content. |
| **Rechat** | Dallas startup | Quote only. | Pitches itself as "AI-powered super app"; **Lucy** AI assistant (Jul 2025): drafts marketing and listing sites, CMAs, updates contacts, meeting notes ([HousingWire](https://www.housingwire.com/articles/rechat-launches-lucy-an-ai-agent-assistant/)). | "From a marketing perspective, you're going to love ReChat… very Apple-esque… templates for social and email look way better". | Brokerage sale, not for solo agents. |
| **Brivity** | Independent | Custom; ~$299/user/mo listed by one aggregator (unverified). | Not found. | "Brivity has been another that I really enjoyed." | n/a |
| **Wise Agent** ([pricing](https://www.wiseagent.com/pricing/)) | Independent, budget | CRM $42/mo annual; **CRM + WiseSocial $59/mo annual** (automated listing posts, **branded listing videos**, scheduling). | "AI follow-up" (pricing unclear). | Budget pick. | Basic. Shows listing video is now a $20/mo add-on inside a cheap CRM. |
| **Chime** | = Lofty (rebranded) | — | — | — | — |
| **Luxury Presence – Presence CRM** | **$37M (Series C $22M equity + $15M debt), Jan 9 2026, Bessemer**; $89M total ([ContentGrip](https://www.contentgrip.com/luxury-presence-ai-crm-raise/)) | Included in its website/marketing plans | "AI relationship engine": signals from web/social/past comms, readiness scoring, daily prioritized list with suggested message in the agent's voice. 17,000 businesses / 87,000 agents (company). | 150 Meta ads in library (30 shown, active), pushing websites + AI search visibility. | **Closest to our idea**: a marketing/content company that built a CRM. Watch it. |

**AI-native real-estate CRM startups.** I found **no funded 2025-2026 seed** for an agent-facing AI-native CRM in the US. Small ones appear in Reddit/Product Hunt: Cleo (texts you who to call), Doment.ai (buyer preference memory), Realtor Desk (Canada), Realty Vista, Sure Send (mentioned as "newer"), Everre. Agents also build their own CRMs on GHL or with Claude (r/WholesaleRealestate). YC 2026 real-estate bets are transaction paperwork (RealPact) and property-manager front desks (Wayline), not agent CRMs.

### B2. What agents say about AI (r/realtors, Sep-Nov 2026)

- **Distrust of AI output.** "Every time I've asked it something, it just made shit up." "There's a realtor near me that uses AI for every video… multiple mistakes… Complete slop." Top post of the year (2,809 upvotes): "Stop doing this with listing photos" (AI adding square footage, chandeliers).
- **Useful AI is back-office.** Morning inbox/calendar summary, MLS updates while driving, transaction form checking (MaxAI), follow-up and scheduling.
- **Listing video: mixed on selling the house, positive on winning the next listing.** "The biggest return isn't selling that specific house, it's winning the next listing." A media business: one agent went from 4 listings (2025) to 10 (2026) after starting video (anecdote). One agent paid a videographer $400 per listing and now makes quick ones in Creatify. Buyers dislike "moving carousel of still photos" and fake AI rooms.
- **CRM fatigue.** "Does anyone actually LIKE using a CRM?" "Solo agents… only use 20% of its features." "The best one is the one you get for free from your broker."

### B3. Is there an opening?

**Not for a new full AI-native real-estate CRM, now.** Reasons: CRMs come bundled with lead gen (Zillow, Lofty, Sierra, CINC, Ylopo); brokerages hand them out free; every incumbent shipped AI texting and AI messages in 2025-2026; Luxury Presence ($89M) and Lofty AOS cover "agentic". A startup CRM would need leads to win, and Zillow is tightening its leads (Flex/Preferred only from Q1 2027, per agents).

**Yes for an AI layer on top of the CRM, focused on content.** Signals:
- Incumbents' AI is about **lead response** (texting, calling, summaries). Content is thin: Lofty Social Agent (unspecified), Wise Agent listing videos, Rechat templates, Luxury Presence websites.
- Agents want **marketing that wins listings** and **sphere/past-client touches**, but hate generic "AI slop". Accurate, real-photo-based video is the line to stay on.
- The CRM already holds the triggers: new listing, price change, just sold, home anniversary, birthday, "Likely to List" flags (FUB/Zillow), Homebot-style equity updates.

**Product shape:** "Every CRM event becomes a ready-to-post asset." New listing → 15-30s video from real photos + captions + post copy; just sold → social proof video; past client anniversary → personal video or home-value post; sphere segment → monthly market video. Write each asset and send back to the CRM as a note/event, and offer a link the agent can text from the CRM.

### B4. How a realtor content/video product integrates

| CRM | Path | What you get | Effort / gate |
|---|---|---|---|
| **Follow Up Boss** | Open REST API ([docs](https://docs.followupboss.com/reference/getting-started)); user API key + registered system (X-System, X-System-Key headers); webhooks (e.g. peopleCreated, custom field events; only account owner can create); rate limit ~250 req / 10 s global, 20 for events (third party). Marketplace lists **250+ integrations** with a **"Video" category** (BombBomb) and content tools (Homebot, RealScout, Keeping Current Matters, Happy Grasshopper) ([integrations](https://www.followupboss.com/integrations)). "Expert directory (coming soon)". | Read people, tags, stages, deals, custom fields (birthdays, close dates); post events and notes back; trigger on tag or stage. | Low. Self-serve registration, no fee listed. **Start here**: biggest agent/team base among teams, and BombBomb proves video tools get listed. Risk: Zillow owns FUB and may favour its own AI or meter data access. |
| **Lofty** | Developer platform with OAuth 2.0 and a **review process**; open API; marketplace (Zillow, Realtor.com, dotloop, DocuSign, BombBomb, Ylopo); per-user API key and webhooks; legacy API docs reportedly retire Aug 1 2026 in favour of developer.lofty.com (unverified); Zapier/Make connectors. | Leads, listings (Lofty has IDX), transactions. | Medium. Approval needed. Lofty's own Social Agent is a direct competitor; expect channel conflict. |
| **BoldTrail, Sierra, CINC, Real Geeks, Brivity** | Mostly Zapier or partner deals; open APIs not verified today. | Lead events, listing data via their IDX. | Medium-high. Sell through brokerages instead. |
| **Rechat** | Brokerage-level partnerships | Listings + marketing center | High; brokerage sale. |
| **Any CRM** | Zapier (FUB, Lofty, Wise Agent all have apps); MLS/IDX listing feed as the content source; email-in or SMS link as fallback. | Works without partner approval. | Low. Good for MVP. |

**Suggested sequence:** MVP on FUB API + Zapier (FUB, Lofty) with listing data from the agent's listing URL or IDX; write a video link back as an FUB note/event; then apply to the Lofty developer program and FUB's expert directory; then pitch team leaders and brokerages on BoldTrail/Sierra.

---

## Open items (not verified today)

- Attio total funding ($116M vs $141M) and any 2026 round.
- Lightfield total raised and valuation ($81M / $300M per SaaStr).
- Twenty's 2026 Series B (amount and lead conflict across trackers).
- Rox's $1.2B round (anonymous sources only).
- Lofty Social Agent capabilities and price; Lofty base price.
- Real Geeks, CINC, Ylopo, Brivity, BoldTrail current prices (all third party).
- Upwork demand for Attio setup (no data found).
- G2 ratings (pages not opened; from snippets).
