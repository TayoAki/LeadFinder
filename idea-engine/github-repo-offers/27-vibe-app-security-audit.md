# Niche Scorecard: Security audit for vibe-coded apps (Gate 0)

Date 2026-11-10 · sources: GitHub page, Upwork/Fiverr/Contra via web search, Reddit (treg, r/lovable + r/vibecoding, last 30 days), vendor pricing pages, Lovable docs/blog · windows: Reddit 2026-10-10 to 2026-11-10; Upwork as indexed.

Offer: structured security audit of a Lovable/Bolt/Replit/Cursor app, plain-English report of confirmed holes and fixes, for non-technical founders with paying users; resell via dev shops. $1,500 per audit + $300/mo re-audit per release. Claimed cost $20-60 tokens. Written permission only.

| Check | Result | Evidence |
|---|---|---|
| 1. Buyers asking (20+) | ❌ FAIL | Tight 4 (Upwork), loose ~10 incl. Reddit asks. Verified budget $500. |
| 2. Competitors with live prices | ⚠️ SATURATED + CAPPED | Free built-in Lovable scans; $9-99 scanners; Fiverr $50-100; humans $1,000-1,500. 15+ Fiverr gigs. |
| 3. Margin ≥50% | ⚠️ BORDERLINE | 33-60% at $1,500 depending on verification hours. |
| 4. Watering holes | ✅ PASS | r/lovable, r/vibecoding, r/Supabase, Lovable Discord, Upwork "Lovable" jobs. |

## The repo
- **cloudflare/security-audit-skill** ([GitHub](https://github.com/cloudflare/security-audit-skill)), published by the Cloudflare GitHub org. MIT. Page shows ~68.3k stars, 4.5k forks, only 14 commits; aggregators show 2,237 or 13,900 ([vibe-eval](https://vibe-eval.com/guides/cloudflare-skills-github/), [tessl](https://tessl.io/registry/skills/github/cloudflare/security-audit-skill)). Inconsistent; attention only.
- Real and does more than he says: 6 phases (recon, hunting, adversarial validation by a different agent, schema-checked `findings.json`, independent re-verification, `REPORT.md`). Built for general codebases (memory safety, cloud, AI), not Supabase/Lovable specifically.
- Caveat: without an OS sandbox it will not run target code, so many leads stay `needs_validation`. Those need a human. README has no authorization statement; his "written permission" rule is on the seller.
- Vibe-specific alternative: [raroque/vibe-security-skill](https://gittrend.io/repo/raroque/vibe-security-skill) (MIT).

## 1. Buyers asking
- **Upwork, tight (4):**
  - [Security Audit — Lovable/Supabase SaaS (Travel Advisor)](https://www.upwork.com/freelance-jobs/apply/Security-Audit-Lovable-Supabase-SaaS-App-Travel-Advisor-Platform_~022078178007613336761/): **$500 fixed**, 20-50 proposals.
  - [Supabase/Lovable RLS hardening, student PII](https://www.upwork.com/freelance-jobs/apply/Supabase-Lovable-Security-Specialist-RLS-Hardening-for-App-Handling-Student-PII_~022071690612884589779/): budget not verified.
  - [Supabase audit & fix, Next.js/Vercel](https://www.upwork.com/jobs/~022068302065525809185): wants fixes applied, fixed-price quote.
  - [Lovable + Supabase audit, healthcare SaaS](https://www.upwork.com/freelance-jobs/apply/Lovable-Supabase-Developer-Needed-Audit-and-Prepare-Healthcare-SaaS-Prototype-for-Production_~022118049727557515558/): audit + production prep.
- **Reddit asks, last 30 days (loose ~6):** r/lovable ["Security for my app"](https://www.reddit.com/r/lovable/comments/1xf8x0e/security_for_my_app/), ["How to test security?"](https://www.reddit.com/r/lovable/comments/1xern3w/how_to_test_security/), ["Anything I should tell Lovable before shipping?"](https://www.reddit.com/r/lovable/comments/1xqbfqm/is_there_any_specific_stuff_i_should_tell_lovable/), ["MVP built, what before launch?"](https://www.reddit.com/r/lovable/comments/1x4wqf4/my_mvp_is_built_and_working_in_lovable_what/), ["Secure AI SaaS architecture"](https://www.reddit.com/r/lovable/comments/1xlmsoi/best_architecture_for_a_secure_aipowered_saas_as/); r/vibecoding ["terrified of sharing it"](https://www.reddit.com/r/vibecoding/comments/1xikpnq/chef_turned_vibe_coder_love_building_but_im/). None states a budget.
- Pattern: buyers want **fixes applied**, not a report. Only verified budget is $500, a third of his price.
- Counts: **tight 4, loose ~10**.

## 2. Competitors (prices)
- **Lovable built-in, free with plan:** basic scan on publish, agentic "deep scan" (2-4 min), opt-in auto-fix, Wiz integration ([docs](https://docs.lovable.dev/features/security), [blog](https://lovable.dev/blog/how-lovable-protects-your-apps-automatically)). Lovable says it does not replace a full review.
- **Scanners:** [UNPWNED](https://www.unpwned.io/platforms/lovable) free; [VibeScan](https://vibescan-qyu1.vercel.app/) $9/scan, $29 full; Apify Supabase audit $29 lite / $99 full ([Apify](https://apify.com/renzomacar/supabase-security-auditor)).
- **Fiverr:** many gigs at ~$50-100 ([example](https://fiverr.com/mrayyan2006/audit-your-vibe-coded-app-for-security-vulnerabilities), [Lovable leaks](https://fiverr.com/basaguigar/audit-your-cursor-or-lovable-app-for-security-leaks), [Supabase RLS](https://fiverr.com/sulosahin/audit-your-supabase-app-for-rls-auth-and-data-leaks)). 15+ near-identical gigs.
- **Human fixed-price:** [RapidDev Lovable audit](https://www.rapidevelopers.com/lovable-security-audit) **$1,000** (5 days, credited to fixes); [Contra 24h audit](https://contra.com/s/6AQ2URvm-vibe-code-security-audit-for-ai-built-apps-24hr) **from $1,500** (10 reviews, seller has 5 paid projects).
- **Platform:** Aikido Basic $350/mo, Pro $700 (via [CodeAnt](https://www.codeant.ai/blogs/aikido-security-pricing)/G2); Aikido pentest $960-4,000 ([PricingSaaS](https://pricingsaas.com/companies/aikido)); Cobalt ≈ $1,800/credit, not published ([Penetrify estimate](https://www.penetrify.cloud/en/pricing/cobalt/)).
- His $1,500 sits at the top of the human tier, above the only verified buyer budget.

## 3. Margin (at $1,500 per audit)
- Tokens $20-60.
- Hours: scoping/permission/access 1 h, run and babysit 1 h, manual verification of findings (RLS two-account tests, auth bypass repro) 3-5 h, plain-English report 1.5-2 h, readout call 1 h = 7.5-10 h.
- Rate: someone who can verify security findings, $75-100/h → $560-1,000.
- Margin: (1,500 − 60 − 1,000)/1,500 = **29%** worst; (1,500 − 20 − 560)/1,500 = **61%** best. Midpoint ~45%.
- Re-audit $300/mo: diff review + run + verify 2-3 h × $75 = $150-225 → **25-50%**.
- Dev-shop resale takes a cut (not verified, typically 20-30%), pushing below 50%.
- Liability: a missed hole after a "clean" report. Needs E&O insurance (cost not verified).

## 4. Watering holes
- r/lovable, r/vibecoding, r/Supabase, r/SaaS, r/indiehackers; Lovable and Bolt Discords; Indie Hackers; Upwork searches "Lovable security", "Supabase RLS"; Contra. Dev shops: Lovable/Bolt agencies listing on Upwork as "Lovable experts".

## Attention (30-day)
- Sellers outnumber askers in r/lovable: ≥8 seller-style posts in 2 weeks ("I checked 5,000 Lovable repos" [link](https://www.reddit.com/r/lovable/comments/1xh4toy/i_checked_5000_public_lovable_repos_29_had_at/), ["5 security things I keep finding"](https://www.reddit.com/r/lovable/comments/1xrvjya/5_security_things_i_keep_finding_in_lovable_apps/), [audit of a starter](https://www.reddit.com/r/lovable/comments/1xhrdiz/i_audited_an_opensource_lovable_saas_starter_6/)) vs ~5 asks.

## The video's claims vs the evidence
- "From Cloudflare": true, Cloudflare org, MIT.
- "$20-60 per audit": true for tokens; human verification is the real cost.
- "$1,500 per audit": real comps exist ($1,000-1,500), but the only verified buyer budget is $500 and free built-in scans now cover the basics.

## Verdict: ❌ REJECT (at his price and shape)
Fails check 1 (tight 4) and check 2 (saturated, free scanners cap the low end).
**Better angle:** "audit + fix" hardening for AI-built apps that hold regulated data (health, student, finance PII), $750-1,500 fixed with fixes included, sold where the posts above come from. The PII/healthcare Upwork posts show that pain. Re-run Gate 0 on that version.
