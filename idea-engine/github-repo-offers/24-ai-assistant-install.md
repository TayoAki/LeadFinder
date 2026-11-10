# Niche Scorecard: "AI team install" (OpenManus-style bots) (Gate 0)

Date 2026-11-10 · Sources: web search (Upwork job pages indexed by search), Upwork "Executive Assistant" category via treg web extract, LinkedIn jobs via treg (1 query, US, past week), Reddit search via treg (2 queries × 50 posts), live pricing pages · Window: ~60 days.

Offer as pitched: three bots for an owner (inbox triage, weekly KPI report, follow-up chasing) on their own machine/chat app, for 5–50 staff firms considering an executive assistant. $2,000 setup + $500/mo; client pays model costs. Lead source: job posts for executive assistants.

| Check | Result | Evidence |
|---|---|---|
| 1. Buyers asking (20+) | ❌ FAIL | Tight ~5 in 60 days, budgets $5–$2,000 (most under $150). |
| 2. Competitors w/ live prices | ❌ cheap SaaS caps price | Fyxer $37–49/user, Lindy $29.99, Gemini in Gmail bundled in Workspace; human VA Time Etc $390/10 h. |
| 3. Margin ≥50% | ⚠️ borderline | ~40–55% monthly; setup ~25–44%. |
| 4. Watering holes | ✅ PASS | LinkedIn/Indeed EA postings, Upwork EA category, Vistage/EO groups. |

## Repo check
- [FoundationAgents/OpenManus](https://github.com/FoundationAgents/OpenManus) is real: 58.9k stars, 10.3k forks, MIT. No releases listed.
- It does **not** do what the offer says out of the box. It is "an open-source framework for building general AI agents", centred on browser control (Browser Use as an MCP server). The README describes no email/inbox, calendar, KPI or Slack/Telegram/WhatsApp integrations. All three bots would have to be built. The repo name in the video may be a stand-in; the actual repo meant is **not verified**.

## 1. Buyers asking
**Tight (owner wants an AI assistant set up for inbox / reporting / follow-ups): ~5.**
- [Claude AI Skills Developer for Personalised Executive Assistants](https://www.upwork.com/freelance-jobs/apply/Claude-Skills-Developer-for-Personalised-Executive-Assistants_~022111326046033055329/), $50 fixed, 2026-10-17.
- [AI Inbox & Invoice Processing Agent with approval queue (n8n/Make)](https://www.upwork.com/freelance-jobs/apply/Inbox-Invoice-Processing-Agent-with-Approval-Queue-n8n-Make_~022113770161085850731/), $5 fixed, 2026-10-23 (urgent/request/invoice triage + morning summary).
- [Grok Bot Specialist: configure a personal chief of staff](https://www.upwork.com/freelance-jobs/apply/Grok-Bot-Specialist-Needed-Configure-Advanced-Personal-Chief-Staff_~022109621878043180144/) (Gmail, Calendar, Drive), ~Oct 2026, budget not shown.
- [Virtual Person Butler App](https://www.upwork.com/freelance-jobs/apply/Virtual-Person-Butler-App-Development_~022111324099869885615/), $1,500 fixed, 2026-10-17 (morning briefing from email + calendar).
- [AI lead generation standalone product](https://www.upwork.com/freelance-jobs/apply/lead-generation-standalone-product-need-help-asap_~022101093766702942506/), $2,000 fixed, 2026-09-18 (email/calendar workflows, AI summaries, Slack alerts).
- Older: [Setup Claude Cowork for Email and WhatsApp](https://www.upwork.com/freelance-jobs/apply/Setup-Claude-Cowork-for-Email-and-WhatsApp-Integration_~022021955155927172500/), $150, 2026-02-12.

**Loose (want an EA, human or hybrid):** large.
- Upwork [Executive Assistant category](https://www.upwork.com/freelance-jobs/executive-assistant/): 4,522 jobs (all time); 10 newest were human VA roles, one at $15.
- LinkedIn (US, past week, first page): 10 "Executive Assistant to CEO" postings (Jobot, Pindrop, Rune, Beacon Hill $150–175K, etc.). These are hiring humans, not buying bots.
- Reddit r/smallbusiness "AI executive assistant inbox triage": no owner asking to buy a setup in the window.

## 2. Competitors (live prices)
| Competitor | Price | Covers |
|---|---|---|
| [Fyxer](https://www.fyxer.com/pricing) | Pro $37/user/mo yearly ($49 monthly); Team $64 ($99) | Inbox labeling, drafts in your tone, meeting notes, follow-ups, daily briefing |
| [Lindy](https://www.lindy.ai/pricing) | Team $29.99/mo (3,000 credits) and up | Inbox management, drafts, meeting prep and follow-up |
| Gemini in Gmail ([Workspace](https://workspace.google.com/pricing)) | Included in Business Starter/Standard/Plus (seat prices did not render on the page) | Email summaries, drafts; buyer likely already pays for it |
| Microsoft 365 Copilot | Price not verified today | Same for Outlook shops |
| [Time Etc](https://www.timeetc.com/plans-and-pricing) (human VA) | $390/mo for 10 h; $760/20 h; $1,480/40 h | Real assistant who chases follow-ups |
| DFY AI-assistant setup sellers | $250–$750/mo managed; $2,500 "Private AI Setup" (vendor blogs, e.g. [krater.ai](https://krater.ai/blog/ai-executive-assistant)) | Same offer, many sellers |

- The buyer often already owns a tool that does inbox triage (Gemini/Copilot seats). Fyxer at $37/user does triage + drafts + follow-ups without a consultant.
- For $500/mo the owner can get ~13 hours of a human VA from Time Etc, which also handles the judgment work.

## 3. Margin (arithmetic)
Assumptions: loaded rate $75/h; model cost passed through to client; hosting/small VPS ~$10/mo (estimate).
- **Monthly:** $500 − $10 − 3–4 h (OAuth tokens expiring, API changes, prompt fixes, report tweaks, owner check-in) × $75 = $225–$300 → **$190–$265 / $500 = 38–53%**.
- **Setup:** three custom bots on OpenManus (it ships none of them): inbox triage with labels/approval, KPI pull from 2–3 sources, follow-up tracker, plus security review of mailbox access. ~15–20 h × $75 = $1,125–$1,500 → **25–44%**.
- **Year 1 blended:** revenue $8,000; cost ~$1,300 + 12 × $272 = $4,564 → **43%**. Fails 50%.
- Unpriced risk: an agent with mailbox and browser control on the owner's machine; liability if it sends the wrong email.

## 4. Watering holes (named)
- LinkedIn/Indeed postings for "Executive Assistant" at 5–50 staff firms (treg `anyapi.linkedin.search.jobs`, ~$0.0007/page).
- Upwork Executive Assistant category; Belay/Time Etc client segments.
- Owner peer groups: Vistage, EO (Entrepreneurs' Organization), YPO chapters; r/smallbusiness, r/Entrepreneur.

## Attention (30-day)
- Repo gains ~338 stars/30 days ([GitTrend](https://gittrend.io/repo/FoundationAgents/OpenManus)): attention only.
- Sellers: crowded. Many "AI chief of staff" setup services and SaaS (Lindy, Fyxer, Superhuman AI, Motion, getray.ai, krater.ai). Buyers on Upwork budget $5–$150 for the same thing.

## The video's claims vs the evidence
- "OpenManus bots for inbox, KPI and follow-ups": the repo has none of these integrations; it is a browser-agent framework.
- "Firms considering an EA will pay $2k + $500/mo": EA job posts are hires of humans; the few AI-assistant asks have tiny budgets.
- "Client pays model costs": fine, but the cheap SaaS above includes the model and caps the price.

## Verdict: ❌ REJECT
Failed checks: **1 (~5 tight asks, budgets mostly under $150)** and **2 (cheap SaaS / bundled Gemini/Copilot caps the price)**; margin ~43% year 1 also misses. Repo does not match the offer.

**Better angle:** a fixed-fee "Gemini/Copilot + Fyxer rollout" for a 10–50 person firm (configure tools they already pay for, train staff, one KPI digest) at $1–2k one-off, no retainer. Or a hybrid human VA + AI service priced against Time Etc. Both untested.
