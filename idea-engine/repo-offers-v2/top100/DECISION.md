# Objective pick from the top 100, ignoring the avatar

Date: 2026-11-11.

**Inputs:** `TOP100.md` (scores), `kwscan/` (search trend), and web checks on why the fastest-rising "alternative" searches are rising.

## Why the score alone isn't enough

The ranking rewards market size, so the top 10 are "cheaper hosted copies of HubSpot, Zapier and QuickBooks". The search trend shows the problem:
- Across all 526 competitor terms, searches fell a **median 21%** year on year. This is market-wide, most likely because AI answers are replacing searches.
- Most of the top 10 fell *more* than that: HubSpot −44%, Zapier −37%, Gusto −52%.
- So the relative winners are the markets where "<competitor> alternative" is **rising against that tide**. That's the Papermark signal: an incumbent that just got worse.

| Term | Searches/mo | YoY | CPC | Why it's rising (web check) |
|---|---|---|---|---|
| **zendesk alternative** | **1,600** | **+225%** | **119 dollars** | Since May 2026 Zendesk bills AI agents **per automated resolution** (about 1.50–2.00 dollars each; Zendesk doesn't publish the rate). One tracker reports a 66% rise in a Contact Center add-on (Jul 2026, single source). |
| freshdesk alternative | 880 | +42% | 67 dollars | Same category |
| 1password alternative | 480 | +94% | 12 dollars | 1Password raised annual plans 20–33% on 27 Mar 2026 |
| tailscale alternative / pricing | 880 / 1,900 | +71% / +80% | 9 / 6 dollars | Tailscale moved to seat pricing on 8 Apr 2026 (Standard 8 dollars/user) |
| owner.com pricing / chownow alternative | 110 / 20 | +37% / +89% | 10 dollars | Small volumes |

## Finalists, scored on six criteria

Weights: proof 20, incumbent-got-worse 25, buyer value 15, room 10, margin 15, crowding 15. Each criterion is rated 1–5; a total of 100 is perfect. The ratings are my judgement, anchored to the data cited.

| Offer (repo) | Proof of 100M+ (same outcome) | Incumbent got worse + switching growth | Buyer value (CPC) | Room | Margin at scale | Crowding (5 = open) | **Total** |
|---|---|---|---|---|---|---|---|
| **Zendesk alternative: AI helpdesk at a flat price (Chatwoot)** | 5: Zendesk ~2B, Freshworks 839M, Intercom Fin 100M ARR | 5: per-resolution AI billing since May 2026; +225% | 5: 119 dollars | 5 | 4: LLM cost per resolution is cents | 2 | **88** |
| Managed password vault (Vaultwarden) | 4: 1Password ~400M | 5: hike Mar 2026; +94% | 2 | 4 | 4 | 1: Bitwarden is cheap, Apple Passwords is free | 70 |
| Commission-free restaurant ordering (TastyIgniter) | 4: Owner.com ~100M est | 3: commission pain is constant, not new; tiny volumes | 3 | 4 | 4 | 2: Owner raised big at a 2.3B valuation; Toast bundles | 66 |
| Managed SOC for SMBs (Wazuh) | 5: Huntress 250M ARR | 1: −27% | 5: 83 dollars | 5 | 2: 24/7 analysts | 3 | 65 |
| Zero-trust network (NetBird) | 3: Tailscale ~45M est | 4: seat repricing; +71–80% | 2 | 4 | 4 | 2: NetBird sells its own cloud | 64 |
| Managed automations (Activepieces) | 4: Zapier ~310M | 1: −37% | 3 | 5 | 3 | 2 | 55 |
| Private AI for law firms (AnythingLLM) | 5: Harvey 190M+ | 2: no incumbent got worse; small demand | 2 | 4 | 3 | 1: Clio, Westlaw and Lexis bundle AI | 56 |
| Bilingual AI receptionist (Pipecat) | 4: Podium AI 150M | 1: −40% | 3 | 3 | 3 | 1 | 48 |

## Pick: "Zendesk alternative with AI included at a flat price", built on Chatwoot

**Repo:** [chatwoot/chatwoot](https://github.com/chatwoot/chatwoot)
- 39.7k★, MIT core (an `enterprise/` folder is separate; we don't use it), last commit 11 Nov 2026.
- Already covers email, live chat, WhatsApp, Instagram, Facebook and SMS in one inbox, with a help centre, macros, SLAs and reports.

**The offer:** "Switch from Zendesk in 7 days. One flat monthly price, with the AI agent included and no per-resolution fees. We migrate your tickets, macros and help centre for you."

**Draft price (to validate at the ICP step):**
- **Fee:** 1,500 dollars migration + **599 dollars/mo flat** for up to 10 agents, with AI resolutions included (fair use 3,000/mo).
- **What it replaces:** a 10-agent team on Zendesk Suite Professional (list price about 115 dollars/agent/mo, not re-verified) pays about **1,150 dollars/mo in seats**, plus 1,000 AI resolutions at about 1.50 dollars ≈ **2,650 dollars/mo**.

**Unit economics per client:**

| Item | Cost per month |
|---|---|
| Hosting | ~60 dollars |
| LLM, 3,000 resolutions at ~0.03–0.05 dollars | ~150 dollars |
| Support, 2 h | ~50 dollars |
| **Total** | **~260 dollars of 599 dollars → ~57% gross margin** |

Margin rises with a self-serve onboarding flow.

**Path to 100M dollars:** about **14,000 clients at 599 dollars/mo**. The pool is 1.16M US establishments with 20–499 staff, so that's ~1.2%. Precedent: Gorgias reached about 69M dollars ARR (Sacra est.) selling a Zendesk alternative to one vertical (Shopify brands).

**Biggest risks:**
1. **Crowded field:** Freshdesk, Help Scout, Gorgias, Intercom and AI-native startups. The wedge has to stay sharp: *flat price with AI included, plus done-for-you migration*.
2. **Chatwoot sells its own cloud.** That's why the offer is migration + AI + managed service, not hosting.
3. **The Zendesk pricing evidence is mostly from third-party and competitor blogs.** Zendesk publishes no per-resolution rate.

**Runner-up:** commission-free restaurant ordering (66). It's still a sound business with a pure-play 100M dollar precedent, but the "incumbent just got worse" signal is much weaker.

Sources:
- Zendesk per-resolution pricing: [eesel](https://www.eesel.ai/blog/zendesk-ai-dynamic-pricing-plan), [Quidget](https://quidget.ai/blog/ai-automation/zendesk-alternatives/), [UsagePricing tracker](https://usagepricing.com/blueprint/activity/zendesk-ai-2026-07-21-price-change), [Futurum](https://futurumgroup.com/?p=89957)
- 1Password price rise: [Ubergizmo](https://www.ubergizmo.com/2026/02/1password-price-increase/), [VPNOverview](https://vpnoverview.com/news/1password-price-increase-march-27/)
- Tailscale repricing: [Tailscale pricing v4](https://tailscale.com/blog/pricing-v4), [PricingSaaS](https://pricingsaas.com/companies/tailscale/diffs/2026Q2)
