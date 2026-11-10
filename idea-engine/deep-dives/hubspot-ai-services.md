# Deep dive: HubSpot + AI services (follow-up to scorecard #25)

Date 2026-11-10. Method: Gate 0 ([METHOD.md](../github-repo-offers/METHOD.md)). First pass: [25-claude-sales-plugin.md](../github-repo-offers/25-claude-sales-plugin.md) (🟡 research slot).

**Sources and samples**
- Upwork: 45 Google queries restricted to `upwork.com/freelance-jobs/apply` (via treg), 178 unique job pages indexed. I hand-classified 89 of them as HubSpot service work. The other 89 were sales reps, VAs, marketing roles, Zoho-only jobs or other noise.
- Upwork window: job pages carry no posting date. I estimated dates from the job-ID sequence, calibrated against dated snippets: IDs 022113–022115 fall around Oct 21–28, and 022102 falls around late September. 174 of the 178 IDs are 022095 or higher, which is roughly Sep 8 to Nov 10 (~60 days). Treat these dates as estimates. Google indexes only part of Upwork, so every count is a floor.
- Reddit (treg): r/hubspot (3 queries, about 150 posts), r/revops (46), r/salesops (12), sorted by newest.
- LinkedIn jobs (treg): 5 US queries, posted in the past month, 10 results each.
- HubSpot Solutions Partner directory: industry counts read from live pages.
- Live pricing pages (linked inline).
- treg spend: **$0.255**. Of that, $0.216 went to 10 "search_100" calls that ignored the `site:` filter and returned junk, so they were wasted. The rest: 45 Google calls ($0.030), 5 LinkedIn calls and 6 Reddit calls ($0.009). The team balance went from $9.11 to $8.38 during the session. Other sessions on the same team balance were spending at the same time, so that $0.73 drop is not all mine. The cap was $0.75.

---

## Bottom line

| Question | Answer |
|---|---|
| Should we sell the original "Claude sales plugin" ($2,500 + $500/mo)? | **No.** Nobody asks for it. HubSpot's Breeze does the prep and follow-up for free. The Claude connector is free and takes 5 minutes to install. |
| Is there a HubSpot + AI service worth picking? | **Yes: ✅ PICKED.** The form is an **"AI-Ready HubSpot Fix"**: audit, cleanup and rebuild of the portal, then Claude/ChatGPT and one Breeze agent wired in properly. **$5,000 fixed**, with a **$1,500 audit** as the entry offer and an optional **$1,500/mo** retainer. |
| Deciding reason | Buyers already pay $2,000–5,000 for HubSpot setup and cleanup. They now ask for AI in the same job post (14 tight HubSpot + AI asks in ~60 days). The AI part is not billable alone: Elite partners sell Breeze agent activation for $250. It is billable when bundled with the data fix that AI needs. |
| Vertical | **Commercial real estate and real-estate services** (CRE brokerages, property managers, developers/homebuilders, proptech). Treat it as a positioning test, not proven demand: only ~5 tight asks were found. |
| Biggest risk | Price compression. Upwork HubSpot budgets cluster at $20–65/h. There are 3,636 Solutions Partners. A 10-year HubSpot developer posted that ["AI has killed all contract work"](https://www.reddit.com/r/hubspot/comments/1xkec7z/ai_has_killed_all_contract_work_i_havent_had_a/). |

---

## 1. What HubSpot work buyers pay for now

### Demand by cluster (Upwork, ~60 days, tight = HubSpot is the core of the job)

| Cluster | Tight | Budgets seen | Buyer types | Examples |
|---|---|---|---|---|
| Onboarding / implementation / setup | **19** | $10–26/h; $650 setup; $20,000 fixed (10-site group rollout) | Startups on HubSpot's startup discount, multi-brand SMBs, agencies subcontracting | [CRM Setup for B2B Sales](https://www.upwork.com/freelance-jobs/apply/HubSpot-CRM-Setup-for-B2B-Sales_~022102324259213112018/) ($10–26/h); [Implementation + website migration](https://www.upwork.com/freelance-jobs/apply/Hubspot-Implementation-and-website-migration_~022117204406380231608/) ($20,000 fixed per [Upwork category page](https://www.upwork.com/freelance-jobs/hubspot/) snippet); [Full CRM setup + ongoing, multi-brand](https://www.upwork.com/freelance-jobs/apply/HubSpot-Expert-Needed-Full-CRM-Setup-Ongoing-Consultant-Multi-Brand-Equipment-Company_~022112625050087581794/); [Implement and onboard our team](https://www.upwork.com/freelance-jobs/apply/HubSpot-Specialist-help-implement-and-onboard-our-team-help-create-systems-etc_~022099775528836449181/); [Setup ($650) for B2B SaaS](https://www.upwork.com/freelance-jobs/apply/HubSpot-Cold-Email-Deliverability-Technical-SEO-Setup-for-B2B-SaaS_~022113584708051942393/) |
| "HubSpot admin / RevOps" ongoing | **15** | $20–30/h, $25–65/h; off-Upwork $90–110/h ([Grow Progress](https://startup.jobs/revops-hubspot-admin-contractor-part-time-grow-progress-7481181)) | B2B SaaS, legal-tech, nonprofits, multi-client RevOps agencies | [Part-time HubSpot admin, 5–10 h/week](https://www.upwork.com/freelance-jobs/apply/Part-Time-HubSpot-Administrator_~022109676617263266902/); [RevOps Manager ($25–65/h)](https://www.upwork.com/freelance-jobs/apply/RevOps-Manager-HubSpot-Specialist-Technical-Hands_~022110380682685912055/); [GTM/RevOps engineer ($20–30/h)](https://www.upwork.com/freelance-jobs/apply/HubSpot-GTM-RevOps-Engineer-Hoc-Ongoing-SDR-Lead-Gen-Automation_~022108985798378175574/); [Nonprofit revenue architecture](https://www.upwork.com/freelance-jobs/apply/RevOps-Expert-for-Nonprofit-Revenue-Architecture_~022117354046990860327/) |
| **AI-specific (HubSpot + AI)** | **14** (21 loose) | Mostly hourly; long-term 30+ h/week roles; first pass found $1,500 discovery and $2,500–4,000/mo | SMBs already on HubSpot, an RE brokerage, a financial advisory practice, a claims business, contractor-software builders | See section 2 |
| Integrations (API, Zapier, Make, n8n, other apps) | **12** | $25–47/h; $75 fixed (tiny) | SMBs connecting payments, ERP (NetSuite), phones (Aircall), forms | [HubSpot API & webhooks](https://www.upwork.com/freelance-jobs/apply/HubSpot-API-Webhook-Integration-Expert_~022112846287995989510/); [Roofing co. Wix/Zapier/Aircall audit](https://www.upwork.com/freelance-jobs/apply/HubSpot-Wix-Zapier-Aircall-Integration-Audit_~022119589870471647016/) |
| Cleanup / audit / dedupe | **10** (14 loose) | **$150–250/h** for an audit/re-architecture; $15 fixed at the bottom | Companies on Sales Hub Pro saying "it is a mess" | [Account audit & re-architecting ($150–250/h)](https://www.upwork.com/freelance-jobs/apply/HubSpot-Account-Audit-and-Architecting_~022106814177513782267/); [CRM cleanup, pipeline rebuild ("Sales Hub Pro… it is a mess")](https://www.upwork.com/freelance-jobs/apply/HubSpot-Expert-CRM-Data-Cleanup-Pipeline-Rebuild-Lead-Routing_~022100364374311613322/); [Quick audit](https://www.upwork.com/freelance-jobs/apply/HubSpot-RevOps-Specialist-needed-quick-audit_~022113358931309339755/); [RE brokerage: clean & manage CRM](https://www.upwork.com/freelance-jobs/apply/HubSpot-Master-Needed-Clean-Manage-CRM_~022113432108358843385/) |
| Workflow automation (routing, sequences, scoring) | **9** | $35–85/h | B2B companies with 5–20 reps | [Lead scoring & lifecycle cleanup (15-person B2B, Sales Hub Pro)](https://www.upwork.com/freelance-jobs/apply/RevOps-HubSpot-Consultant-Lead-Scoring-and-Lifecycle-Stage-Cleanup_~022117928529769329245/); [Automation specialist ($35–85/h)](https://www.upwork.com/freelance-jobs/apply/HubSpot-Automation-Specialist_~022109741921031440336/) |
| Migration (Salesforce, Zoho, Marketo, Pipedrive) | **6** (8 incl. CMS sites) | $25–200/h | Healthcare (Zoho→HubSpot), Marketo→HubSpot, Salesforce→HubSpot | [Zoho→HubSpot, healthcare](https://www.upwork.com/freelance-jobs/apply/HubSpot-CRM-Implementation-Zoho-Migration-Specialist_~022113724671602558214/); [Marketo→HubSpot QA, 30+ h/week](https://www.upwork.com/freelance-jobs/apply/HubSpot-Marketing-Operations-Specialist-Ongoing-Pacific-Hours_~022118115325193787473/); [Salesforce→HubSpot ($25–200/h)](https://www.upwork.com/freelance-jobs/apply/HubSpot-CRM-Expert-Freelance-Contractor_~022094423203550990082/) |
| Reporting / dashboards | **4** | not shown | Sales leaders | [Seven dashboards](https://www.upwork.com/freelance-jobs/apply/HubSpot-CRM-Implementation_~022092842665286459352/); [Pipeline review + RevOps dashboard](https://www.upwork.com/freelance-jobs/apply/HubSpot-RevOps-Consultant-Pipeline-Review-and-Revenue-Operations-Dashboard_~022115327823235527419/) |
| **Total** | **89** | | | |

**A hidden cluster: HubSpot partners hiring subcontractors (7 posts).** Examples: [Certified admin for an Elite partner's onboardings](https://www.upwork.com/freelance-jobs/apply/HubSpot-Certified-Admin-for-Onboarding_~022118766911699132148/) (posted twice), an [agency subcontractor for an industrial client](https://www.upwork.com/freelance-jobs/apply/HubSpot-Marketing-Operations-Implementation-Specialist_~022118080583140415569/), [demandDrive client CRM builds using Claude Code + MCP + HubSpot CLI](https://www.upwork.com/freelance-jobs/apply/Contract-HubSpot-RevOps-Engineer-Client-CRM-Builds-Migrations-Claude-Code-MCP-HubSpot-CLI_~022116270615219278262/), a [RevOps agency paid test](https://www.upwork.com/freelance-jobs/apply/RevOps-freelancer-Salesforce-HubSpot-for-agency-client-work-paid-test-first_~022117139379356316105/), and a [multi-client RevOps specialist on a 20–25 h/month block](https://www.upwork.com/freelance-jobs/apply/HubSpot-Salesforce-RevOps-Specialist_~022109703223742610518/). Reddit shows the same need: ["how do you handle client work you don't have bandwidth for?"](https://www.reddit.com/r/hubspot/comments/1wrrtxp/for_those_running_hubspot_agencies_or_partner/)

### Other signals
- **Reddit buyers (since Sep):** a [fractional RevOps request for HubSpot + data hygiene, done with Claude/Codex MCP](https://www.reddit.com/r/revops/comments/1wcdm3d/fractional_revops_engagement/) (EU B2B SaaS, 2–4 h/week to start); a ["Looking for HubSpot Developer" 3-month contract](https://www.reddit.com/r/hubspot/comments/1xcargs/looking_for_hubspot_developer/); an [insurance broker migrating Gen4 → HubSpot](https://www.reddit.com/r/hubspot/comments/1xr7a3l/insurance_broker_service_product_objects/); a [solar company whose 6 reps share one WhatsApp number](https://www.reddit.com/r/hubspot/comments/1xn8ay6/6_reps_on_one_whatsapp_number_and_hubspot_has_no/).
- **Reddit sellers:** several people give away free CRM teardowns ([1](https://www.reddit.com/r/revops/comments/1w4hro1/offering_a_few_free_crmrevops_tear_downs_this/), [2](https://www.reddit.com/r/revops/comments/1wbn2x1/doing_another_round_of_free_crm_tear_downs_this/)). Others are pilot-testing HubSpot audits ([1](https://www.reddit.com/r/revops/comments/1x5qga7/my_5point_hubspot_audit_what_am_i_missing/)). The seller side is crowded.
- **LinkedIn (US, past month):** HubSpot Administrator roles at [K. Hovnanian Homes](https://www.linkedin.com/jobs/view/hubspot-administrator-at-k-hovnanian%C2%AE-homes-4472232250) (a homebuilder), Campspot and Priority Tax Relief. RevOps roles at Visitt, a PE-backed property-intelligence SaaS, Octopus Deploy, and others. The full-time hire is the alternative a buyer weighs against a retainer.
- **Partner directory:** [3,636 Solutions Partners](https://ecosystem.hubspot.com/marketplace/solutions/all). HubSpot moved the program to a $400/mo entry fee from July 15, 2026 ([HubSpot tiers page](https://www.hubspot.com/solutions-partners-tiers-and-benefits-2026)). Not verified: whether that thins the field.
- **HubSpot community forum:** not mined directly (pages not fetched). The [Claude connector/MCP update thread](https://community.hubspot.com/t/updates-to-hubspot-connector-for-claude-remote-mcp-server/154482) has a user on Oct 23 reporting a tool missing from the admin panel, with no fix posted.

---

## 2. AI demand that HubSpot does not cover out of the box

### What HubSpot ships now (live pages)
| Item | Fact | Source |
|---|---|---|
| Sales Hub tiers | Starter $7/seat; Pro $90/seat + **$1,500 onboarding**; Enterprise $150/seat + **$3,500 onboarding** | [hubspot.com/pricing/sales](https://www.hubspot.com/pricing/sales) |
| HubSpot Credits | Included per tier: 500 (Starter), 3,000 (Pro), 5,000 (Ent.). Extra credits $0.01 each | same |
| Customer Agent | 50 credits ($0.50) per **resolved** conversation; Pro and Enterprise; 28-day trial; outcome pricing since Apr 14, 2026 | [HubSpot news](https://www.hubspot.com/company-news/hubspots-customer-agent-and-prospecting-agent-now-you-pay-when-the-task-is-complete) |
| Prospecting Agent | 100 credits ($1.00) per lead recommended for outreach; Pro and Enterprise | same |
| Data Agent | ~$0.10 per answer | third-party only ([resolve247](https://resolve247.ai/blog/hubspot-breeze-pricing-change)); not verified on a HubSpot page |
| Custom agents | HubSpot cut custom-agent run cost by ~70% (late Oct 2026) and added a cost estimator | [r/hubspot report](https://www.reddit.com/r/hubspot/comments/1xje6dt/lower_cost_of_custom_ai_agents/); not verified on a HubSpot page |
| Claude connector | **Free**, official, read and write; install via OAuth | [hubspot.com/claude](https://www.hubspot.com/claude) |
| Remote MCP server | Reads and writes contacts, companies, deals, tickets, leads, **listings**, projects, services, **custom objects**, activities, segments | [developers.hubspot.com](https://developers.hubspot.com/docs/apps/developer-platform/build-apps/integrate-with-the-remote-hubspot-mcp-server) |

### What is still hard: the gaps a service fills
1. **Permissions and safety of the AI connection.** Claude can write to the CRM live. Users find the scope model confusing (["Permissions's Wild West"](https://www.reddit.com/r/hubspot/comments/1vg4pr9/hubspot_mcp_permissionss_wild_west/), ["Chat Permissions? Really?"](https://www.reddit.com/r/hubspot/comments/1wcsxss/chat_permissions_really/)). New scopes need a reconnect. The **Sensitive Data** setting blocks activities and conversations from MCP, which hurts regulated verticals.
2. **Query limits.** `query_crm_data` has no joins, no association traversal and no subqueries. Search allows 5 filter groups and returns 200 results per page. Workflows and reports are not covered (developer docs above). The AI cannot fix or build workflows for you; a human must.
3. **Bad data makes bad AI.** ["Would you trust Claude to build foundational HubSpot architecture? … confidently wrong"](https://www.reddit.com/r/hubspot/comments/1wbm3ln/what_do_u_do_on_hubspot_that_claude_connector/). Also ["How do you feed Claude Code detailed knowledge about HubSpot so it stops making wrong assumptions"](https://www.reddit.com/r/hubspot/comments/1vxf29k/how_do_you_feed_claude_code_cli_detailed/).
4. **Breeze quality and cost.** ["Breeze is embarrassing, right?"](https://www.reddit.com/r/hubspot/comments/1xixcaz/breeze_is_embarrassing_right/) and ["Are all agents this expensive? … 50 credits per run … cheaper via API in Claude Code"](https://www.reddit.com/r/hubspot/comments/1vep2sw/are_all_agents_this_expensive/). Buyers need someone to pick Breeze vs Claude vs n8n for each job.
5. **Customer Agent QA.** ["built-in agent analytics quickly run out of depth"](https://www.reddit.com/r/hubspot/comments/1xovws6/ai_customer_agent_performance_and_quality_audit/) (Nov 5).

### The 14 tight HubSpot + AI asks, grouped
| Sub-type | Count | Examples |
|---|---|---|
| Connect Claude/ChatGPT to HubSpot and use it | 4 | [RE brokerage AI-driven CRM, already uses Claude connector daily, 30+ h/week, 6+ months](https://www.upwork.com/freelance-jobs/apply/HubSpot-design-and-automate-clean-organized-driven-CRM-for-real-estate-brokerage_~022110462168184751370/); [Walk me through HubSpot for ChatGPT (live session)](https://www.upwork.com/freelance-jobs/apply/HubSpot-ChatGPT-Google-Ads-Setup-Help-Zoom-Screenshare-Based_~022113281115494678766/); [HubSpot + n8n + Claude for contractor companies](https://www.upwork.com/freelance-jobs/apply/HubSpot-n8n-Automation-Expert-Claude-WhatsApp-Sales-Process-Automation_~022109314738497780848/); [Zapier/Make/HubSpot/Claude, long-term](https://www.upwork.com/freelance-jobs/apply/Automation-Integration-Specialist-Zapier-Make-HubSpot-Claude-Long-Term-Hourly_~022108702524105846616/) |
| Custom AI agents / LLM steps via API or n8n | 6 | [n8n AI lead qualification → HubSpot](https://www.upwork.com/freelance-jobs/apply/n8n-Automation-Specialist-Needed-for-HubSpot-CRM-Integration_~022111624797640650069/); [HubSpot Developer – Agentic AI](https://www.upwork.com/freelance-jobs/apply/HubSpot-Developer-Agentic-Automation_~022112932304859291673/); [Founding AI Ops Architect (fractional)](https://www.upwork.com/freelance-jobs/apply/Founding-Operations-Architect-Fractional_~022115064659883011217/); [Claims automation + AI chat](https://www.upwork.com/freelance-jobs/apply/HubSpot-Expert-for-Claims-Automation-Chat-Integration_~022112524936459315298/); [CRM & AI Automation Architect](https://www.upwork.com/freelance-jobs/apply/HubSpot-CRM-Automation-Architect_~022118750577212890868/); [HubSpot Expert + AI Automation](https://www.upwork.com/freelance-jobs/apply/HubSpot-Expert-Automation-Integrations-Specialist-Long-Term_~022107293973767517437/) |
| Breeze rollout / training | 3 | [Breeze AI & workflow consultant, 30+ h/week](https://www.upwork.com/freelance-jobs/apply/HubSpot-Workflow-Automation-Consultant-Breeze-APIs-n8n-Make-Zapier_~022107879552984616757/); [Marketing Hub & AI](https://www.upwork.com/freelance-jobs/apply/HubSpot-Marketing-Hub-Automation-Specialist_~022118052408448485880/); [Financial advisory practice: training + implementing Breeze](https://www.upwork.com/freelance-jobs/apply/HubSpot-expert-needed-help-financial-advisory-practice-train-and-build-automation_~022117349256865005607/) |
| CRM + AI agent administrator (HubSpot + GoHighLevel) | 1 | [Full-time CRM & AI Agent Administrator](https://www.upwork.com/freelance-jobs/apply/Full-Time-CRM-Agent-Administrator_~022104553742253275938/) |

Loose (+7): AI enrichment and scoring with Clay or n8n, AI outbound systems, AI-readiness in RevOps roles.

**Read:** pure "set up a Breeze agent" demand is small, and it is cheap to supply ($250, below). The money is in "fix our HubSpot and make AI actually work on it": cleanup + connector + guardrails + a few agents.

---

## 3. Pricing reality (verified on live pages unless noted)

| # | Seller | Offer | Price | Source |
|---|---|---|---|---|
| 1 | HubSpot | Sales Hub Pro / Ent. onboarding (mandatory unless a partner replaces it) | **$1,500 / $3,500** one-time | [pricing/sales](https://www.hubspot.com/pricing/sales) |
| 2 | INSIDEA (Elite) | Implementation per Hub, Pro | **from $2,000** (8 wk); Fast Track from $3,000; Enterprise from $4,000 | [insidea.com/hubspot/implementation-cost](https://insidea.com/hubspot/implementation-cost) |
| 3 | INSIDEA | **Breeze agent activation**, any agent | **from $250** (10 days) / $300 fast track | [insidea.com/hubspot/agents](https://insidea.com/hubspot/agents) |
| 4 | INSIDEA | Managed operations | from $2,000/mo | implementation-cost page above |
| 5 | Hive Strategy | Fractional HubSpot admin | **from $2,000/mo (10 h)** | [hivestrategy.com/pricing](https://www.hivestrategy.com/pricing) |
| 6 | Hive Strategy | Advanced onboarding / data migration / audit / training | from $5,000 / $3,500 / $3,000 / $200/h | same |
| 7 | Orange Marketing | Fractional HubSpot admin | **$3,500 / $4,750 / $6,750 per mo** (4/6/8 support hours + ops) | [orangemarketing.com](https://www.orangemarketing.com/fractional-hubspot-admin) |
| 8 | Meticulosity | Fractional "HubSpotter" hour blocks | **$50/h** (20–100 h), $45, $40; $250 onboarding fee | [meticulosity.com](https://www.meticulosity.com/fractional-hubspotters) |
| 9 | Grow Progress (job post) | Part-time RevOps/HubSpot admin contractor | $90–110/h, 15–25 h/mo | [startup.jobs](https://startup.jobs/revops-hubspot-admin-contractor-part-time-grow-progress-7481181) |
| 10 | Upwork buyers | Hourly HubSpot work | $20–30, $25–65, $35–85; audit $150–250/h | job links in section 1 |
| — | Market estimates | HubSpot consultants $100–150/h; generalists $50–90/h | third-party, not verified | [thefrontkit](https://thefrontkit.com/blogs/hubspot-consultant-cost-2026), [bootstrapcreative](https://bootstrapcreative.com/how-much-does-a-freelance-hubspot-developer-cost/) |

**What this means:** a fixed-fee project at $3,000–5,000 sits inside the market (Hive audit $3,000, migration $3,500, advanced onboarding $5,000; INSIDEA $2,000–5,000 per Hub). A retainer at ~$150–200/h effective rate matches Hive ($2,000 for 10 h). Breeze setup alone is a $250 commodity.

---

## 4. Vertical

| Vertical | Upwork tight HubSpot-service asks (~60 d) | Partners tagging the industry | HubSpot actually used? | AI fit | Verdict |
|---|---|---|---|---|---|
| B2B SaaS | ~10 (most volume) | **1,835** of 3,636 ([directory](https://ecosystem.hubspot.com/marketplace/solutions/technology-software)) | Yes, core HubSpot base | Good | Most demand, most competition. Fallback for volume. |
| **Real estate services: CRE, property mgmt, developers, proptech** | **~5**: [brokerage AI CRM w/ Claude](https://www.upwork.com/freelance-jobs/apply/HubSpot-design-and-automate-clean-organized-driven-CRM-for-real-estate-brokerage_~022110462168184751370/), [brokerage cleanup](https://www.upwork.com/freelance-jobs/apply/HubSpot-Master-Needed-Clean-Manage-CRM_~022113432108358843385/), [RE consulting CRM + funnel](https://www.upwork.com/freelance-jobs/apply/HubSpot-CRM-and-Funnel-Setup_~022117404169620733030/), [marketing OS for CA RE companies](https://www.upwork.com/freelance-jobs/apply/Performance-Marketing-Systems-Architect_~022114932485678823663), [RE-investor SaaS on HubSpot CMS](https://www.upwork.com/freelance-jobs/apply/HubSpot-CMS-Expert-Migrate-Page-Framer-Site-HubSpot-Content-Hub-Forms-Breeze_~022117668655025162683/) | **478** ([directory](https://ecosystem.hubspot.com/marketplace/solutions/real-estate)); few true CRE specialists ([Dashbuilds](https://ecosystem.hubspot.com/marketplace/solutions/dashbuilds), [CREModels](https://ecosystem.hubspot.com/marketplace/solutions/cremodels), 0 reviews) | Yes for brokerages, CRE, homebuilders ([K. Hovnanian HubSpot Admin](https://www.linkedin.com/jobs/view/hubspot-administrator-at-k-hovnanian%C2%AE-homes-4472232250)), proptech. **Residential agents mostly use FUB/BoldTrail/Lofty** (not verified by survey). | Strong: HubSpot has a native **Listings** object that the MCP server reads and writes; a [CRE capital-markets firm is asking about an AI layer on its CRM](https://www.reddit.com/r/salesforce/comments/1xhm9ze/keep_salesforcehubspot_as_the_crm_and_build_a/) | **Recommended** |
| Mortgage / lending | 1–2 ([ag loan broker texting](https://www.upwork.com/freelance-jobs/apply/SMS-Compliance-Expert-Compliant-One-One-Texting-from-HubSpot-for-Agricultural-Loan-Broker_~022115100347722574993)) | (in 770 financial) | Weak: LinkedIn "HubSpot mortgage" returned Encompass/Salesforce roles (loanDepot, Hometap) | Compliance-heavy | Skip |
| Professional services (advisors, CPA, law, insurance, M&A) | ~4 ([financial advisory Breeze](https://www.upwork.com/freelance-jobs/apply/HubSpot-expert-needed-help-financial-advisory-practice-train-and-build-automation_~022117349256865005607/), [CPA firm ops](https://www.upwork.com/freelance-jobs/apply/Part-Time-Operations-Workflow-Manager-CPA-Firm_~022112552302400341453), [insurance broker migration](https://www.reddit.com/r/hubspot/comments/1xr7a3l/insurance_broker_service_product_objects/), recruitment) | 770 (banking/financial, [directory](https://ecosystem.hubspot.com/marketplace/solutions/banking-financial-services)); other professional services not verified | Mixed (advisors often on Wealthbox/Redtail/Salesforce; not verified) | Sensitive Data blocks MCP activity data | Second choice |
| Home services | 2–3 ([roofing integration audit](https://www.upwork.com/freelance-jobs/apply/HubSpot-Wix-Zapier-Aircall-Integration-Audit_~022119589870471647016/), [contractor HubSpot + Claude](https://www.upwork.com/freelance-jobs/apply/HubSpot-n8n-Automation-Expert-Claude-WhatsApp-Sales-Process-Automation_~022109314738497780848/), solar on Reddit) | not verified | Minority (ServiceTitan/Jobber/GHL dominate; not verified) | OK | Skip |
| Healthcare clinics | 2 ([Zoho→HubSpot, healthcare](https://www.upwork.com/freelance-jobs/apply/HubSpot-CRM-Implementation-Zoho-Migration-Specialist_~022113724671602558214/), [telemedicine SMS](https://www.upwork.com/freelance-jobs/apply/Hubspot-sms-automation-specialist_~022119559538764115077/)) | not verified | Rare in clinics | HIPAA + Sensitive Data blocks AI | Skip |
| Education | 1 ([nonprofit/university RevOps](https://www.upwork.com/freelance-jobs/apply/RevOps-Expert-for-Nonprofit-Revenue-Architecture_~022117354046990860327/)) | 528 ([directory](https://ecosystem.hubspot.com/marketplace/solutions/education)) | Yes (admissions) | OK | Skip for now |

**Why real-estate services:**
- It has the second-most asks after B2B SaaS, with about a quarter of the partner competition (478 vs 1,835).
- HubSpot is really used there (brokerages, CRE, homebuilders, proptech), unlike residential agents.
- It has a concrete AI hook: Listings and Deals are reachable by Claude through HubSpot's own MCP, so "ask Claude which listings have stalled tours" is a real demo.

**Honest caveat:** ~5 asks in 60 days is thin. It fails check 1 on its own. Use the vertical as the positioning and portfolio. Take B2B SaaS and agency subcontract work for volume.

---

## 5. Offer design

### The offer: "AI-Ready HubSpot Fix" for 10–100-person firms on HubSpot Pro (lead vertical: real-estate services)
| Item | Detail |
|---|---|
| Who | Firms already paying for Sales Hub (or Service Hub) Pro, with "it's a mess" data and a leader who uses or wants Claude/ChatGPT on the CRM. |
| Entry: AI-Readiness Audit | **$1,500 fixed**, 5 business days. Portal audit (objects, properties, pipelines, lifecycle, workflows, integrations, duplicates). Permissions and Sensitive Data review for AI. Credit forecast for Breeze. Written fix list. Credited to the Fix if bought within 30 days. |
| Core: AI-Ready HubSpot Fix | **$5,000 fixed**, 3–4 weeks. Scope cap: up to 2 pipelines, 50k contacts, 1 Hub. **Fix:** dedupe, archive dead properties, rebuild lifecycle and pipeline stages, required fields, lead routing. **AI layer:** connect Claude or ChatGPT via HubSpot's official connector with a written permission plan. A prompt/skill pack of 6–8 weekly jobs (pipeline review, stalled deals, call prep, closed-lost patterns, data-gap report). One Breeze agent (Customer or Data Agent) turned on with guardrails and a credit cap. **Handover:** 2 training sessions + recorded docs. |
| Optional retainer: HubSpot + AI Admin | **$1,500/mo**, up to 8 h. Fixes, new workflows, prompt-pack updates, monthly Breeze credit and agent-quality report, connector breakage after HubSpot changes. Month-to-month. |
| Why this beats the original | The original sold a free plugin plus prompts HubSpot already gives away. This sells the data fix that buyers already pay $2,000–5,000 for, with AI as the reason to do it now. |

### Margin math (loaded rate $75/h, same as first pass)
- **Audit, $1,500:** discovery call 1 h, portal review 5 h, permission/credit review 1 h, write-up 2 h, readout call 1 h = 10 h → $750. **Margin 50%.**
- **Fix, $5,000:**
  - audit (if not bought separately) 4 h
  - cleanup/dedupe 8 h
  - pipeline/lifecycle/routing rebuild 4 h
  - connector + permission plan 2 h
  - prompt pack 4 h
  - Breeze agent + credit cap 2 h
  - training 2 h
  - client calls 2 h
  - QA and fixes 3 h
  - Total 31 h → $2,325. Tools ~$0 (native dedupe on Pro; an Insycle license if needed is extra, price not verified). **Margin 53.5%.**
  - At 40 h (a messier portal): $3,000 → **40%**. The scope cap is what protects margin.
- **Retainer, $1,500:** 8 h + 1 h reporting = 9 h → $675. **Margin 55%.** If a client uses all 8 h plus 2 h of overflow: 50%.
- **Year-1 per client (Audit → Fix → 6 months retainer):** revenue $1,500 + $3,500 (credit applied) + $9,000 = $14,000. Cost $750 + $1,575 (21 h after audit) + $4,050 = $6,375. **Margin 54%.**

### First 3 clients: named watering holes
1. **HubSpot partners that need overflow (fastest).** Respond to partner subcontract posts on Upwork ([Elite partner onboarding admin](https://www.upwork.com/freelance-jobs/apply/HubSpot-Certified-Admin-for-Onboarding_~022118766911699132148/), [demandDrive CRM builds with Claude Code/MCP](https://www.upwork.com/freelance-jobs/apply/Contract-HubSpot-RevOps-Engineer-Client-CRM-Builds-Migrations-Claude-Code-MCP-HubSpot-CLI_~022116270615219278262/)) and to the r/hubspot thread on [partner bandwidth](https://www.reddit.com/r/hubspot/comments/1wrrtxp/for_those_running_hubspot_agencies_or_partner/). White-label rates are lower (~$50–110/h), so treat this as case-study fuel, not profit.
2. **Upwork cleanup and AI jobs with real budgets.** Filter for "Sales Hub Pro", "mess", "audit", "Claude", "Breeze". Examples: the [$150–250/h audit](https://www.upwork.com/freelance-jobs/apply/HubSpot-Account-Audit-and-Architecting_~022106814177513782267/) and the [RE brokerage AI CRM](https://www.upwork.com/freelance-jobs/apply/HubSpot-design-and-automate-clean-organized-driven-CRM-for-real-estate-brokerage_~022110462168184751370/). Lead with the $1,500 audit as a fixed-price proposal.
3. **Real-estate-services communities.**
   - CREW Network, NAIOP chapters, CCIM Institute (CRE)
   - NARPM and BOMA (property management)
   - r/CommercialRealEstate
   - HubSpot User Groups (HUGs). HubSpot runs in-person AI build-alongs, e.g. the [Toronto Prospecting Agent workshop on Nov 13](https://i.redd.it/u9c6ccrkrezh1.png).
   - The 478 real-estate-tagged partners in the [directory](https://ecosystem.hubspot.com/marketplace/solutions/real-estate), for both referrals and competitive research.
   - Target list: LinkedIn companies hiring "HubSpot Administrator" in real estate (e.g. K. Hovnanian). These are buyers comparing a $70k+ hire against a retainer (salary not verified).

Do not contact anyone until the offer is approved. These are places to look, not actions taken.

---

## 6. Verdict

### ✅ PICKED: "AI-Ready HubSpot Fix" ($1,500 audit → $5,000 fix → $1,500/mo), led in real-estate services, with B2B SaaS and partner overflow for volume

| Check | Result | Evidence |
|---|---|---|
| 1. Buyers asking (20+) | ✅ for the bundled offer | Cleanup/audit 10 + HubSpot+AI 14 + setup/implementation 19 = 43 tight asks in ~60 days (floor). ❌ for the real-estate vertical alone (~5). |
| 2. Competitors with live prices | ✅ | HubSpot $1,500/$3,500; INSIDEA $2,000+ and $250 agents; Hive $2,000/mo, $3,000 audit, $5,000 onboarding; Orange $3,500–6,750/mo; Meticulosity $50/h. Generic HubSpot services are saturated (3,636 partners), so niche positioning is required. |
| 3. Margin ≥50% | ✅ (borderline) | Fix 53.5% at 31 h; retainer 55%; year-1 54%. Falls to 40% if a portal runs 40 h without a scope cap. |
| 4. Watering holes | ✅ | Partner subcontract posts, Upwork, HUGs, CREW/NAIOP/CCIM/NARPM/BOMA, r/hubspot, r/revops. |

- **Deciding reason:** buyers already budget $2,000–5,000 to fix and set up HubSpot. They now write AI into the same post. The connector is free, but making it safe and useful (clean data, permissions, credit control, the right agent) is not.
- **Biggest risk: price compression and DIY.**
  - Upwork rates sit at $20–65/h.
  - Elite partners sell Breeze activation for $250.
  - HubSpot gives free AI-readiness workshops.
  - A senior HubSpot developer reports no contracts in 6 months.
  - If buyers see the AI part as free, the offer collapses into a $50/h cleanup gig.
  - **Mitigation:** fixed-fee scope caps, a vertical demo on Listings/Deals, and selling to Pro customers who already paid HubSpot's $1,500 onboarding.
- **Next validation (before building assets):** win 1 paid audit from each of the 3 channels within 30 days. If none closes at $1,500, drop to 🟡 and re-test the vertical.

### Not verified
- Data Agent price.
- The 70% custom-agent cost cut (Reddit only).
- Residential real-estate CRM shares (no 2026 survey found).
- Partner counts for healthcare and professional services.
- Exact Upwork posting dates (estimated from IDs).
- HubSpot Community forum volume (not fetched).
- Insycle pricing.
