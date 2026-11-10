# Niche Scorecard: Open Notebook "audio briefings" (Gate 0)

Date 2026-11-10 · Sources: web search (Upwork job pages indexed by search), Upwork "Podcast Production" category page via treg web extract, Reddit search via treg (2 queries × 50 posts), live pricing pages · Window: ~60 days for buyer asks.

Offer as pitched: a 10-minute weekly branded podcast generated from the client's newsletter or industry news, for CPA firms, consultancies and trade associations that already publish a newsletter. $1,000 setup + $600/mo for 4 episodes; ~$30/mo cost.

| Check | Result | Evidence |
|---|---|---|
| 1. Buyers asking (20+) | ❌ FAIL | Tight 0 in window. Loose: 2 stale Upwork posts (2024–25). |
| 2. Competitors w/ live prices | ⚠️ PASS on count; free tool caps price | NotebookLM free / in Workspace; Wondercraft $25–45; ElevenLabs $22–99; human podcast DFY $397–$1,200+/mo. |
| 3. Margin ≥50% | ❌ FAIL | ~20–45% depending on QA hours. |
| 4. Watering holes | ✅ PASS | AICPA/state CPA societies, ASAE, Google Maps CPA lists, newsletter directories. |

## Repo check
- [lfnovo/open-notebook](https://github.com/lfnovo/open-notebook) is real: 41.8k stars, MIT license, no tagged releases on the page (1,043 commits).
- It does what he says: a self-hosted NotebookLM alternative with "multi-speaker podcasts with Episode Profiles", 1–4 speakers, script control, many LLM/TTS providers. Weekly automation from a newsletter is not a built-in feature; you would script it.

## 1. Buyers asking
**Tight (firm/association wants an AI podcast made from its newsletter): 0 found.**
- Indexed Upwork job pages for "NotebookLM podcast", "AI podcast", "AI-generated podcast", "ElevenLabs podcast" and "newsletter weekly episodes": no matching post in the window.
- Reddit "NotebookLM podcast newsletter clients" and "AI podcast from newsletter for my firm" (100 posts, past year): side-hustle listicles and creators, no buyers.
- No CPA firm or trade association found publicly launching an AI-generated newsletter podcast. Closest: an individual's show for firm owners discussing NotebookLM ([Jason On Firms](https://share.transistor.fm/s/5a858147)).

**Loose: 2, both stale.**
- [Transform our NotebookLM podcast audio/video – content automation specialist](https://www.upwork.com/freelance-jobs/apply/Transform-Our-NotebookLM-Podcast-Audio-Video-Content-Automation-Specialist_~021895754073085709799/) (~617 days old).
- [Synergy Baseball Data: "AI Podcast Generation"](https://www.upwork.com/freelance-jobs/apply/Synergy-Baseball-Data-MLB_~021874096705051233684/), fixed price, posted 2024-12-31.
- Context: Upwork's [Podcast Production](https://www.upwork.com/freelance-jobs/podcast-production/) category shows 821 jobs (all time); the 10 newest were human editing jobs at $10–$20 budgets. Weekly-show buyers on Upwork pay ~$100/episode for full production ([example](https://www.upwork.com/freelance-jobs/apply/Long-Term-Podcast-Producer-Needed-for-Editing-Publishing-Episode-Management_~022079937514080901777/), $400 fixed).

## 2. Competitors (live prices)
| Competitor | Price | Notes |
|---|---|---|
| NotebookLM / Gemini Notebook | Free; inside [Google Workspace](https://workspace.google.com/pricing): Starter up to 3 Audio Overviews/day, Standard/Plus up to 20/day | Buyer likely already owns it. Two fixed hosts. |
| [Wondercraft](https://www.wondercraft.ai/pricing) | Free; Creator $25/mo ($21 yearly); Pro $45/mo | AI podcast generator, NotebookLM-style "Convo Mode" |
| [ElevenLabs](https://elevenlabs.io/pricing) | Creator $22 (~121 min TTS); Pro $99 (~600 min) | Studio for multi-voice audio |
| [Jellypod](https://jellypod.com/pricing) | Base prices not shown (not verified); seats $20/mo | RSS hosting, auto-distribution, voice cloning, automations that create episodes when an email arrives |
| Human DFY podcast services | [$397/mo](https://noisemaker.gumroad.com/l/PE397); Cashflow Podcasting $1,199/mo; Fame $1,200–$3,000/mo; full-service agencies $2,100–$6,500/mo ([Resonate](https://resonaterecordings.com/podcast-production-cost-comparison/)) | Prices from vendor/aggregator pages; human-hosted shows |

- Jellypod's email-triggered automation is close to the whole offer as a SaaS feature.
- $600/mo sits above every AI tool and below human-hosted shows; the buyer is paying for an AI voice reading a newsletter they already wrote.

## 3. Margin (arithmetic)
Assumptions: loaded rate $75/h; tools $30/mo (his figure; ElevenLabs Creator alone is $22).
- Per episode: pull issue + edit script for audio (0.5 h), listen through 10 min and fix names/numbers/pronunciation (0.5 h), publish/RSS (0.25 h) = 1.25 h. ×4 = 5 h, plus 1 h client comms = 6 h × $75 = $450.
- **Monthly:** ($600 − $30 − $450) / $600 = **20%**. With a lean 0.75 h/episode: 4 h → $300 → **45%**. Only hits 50% at under ~3.8 h/month total, i.e. little or no QA.
- QA is not optional for CPA firms: a wrong tax figure read aloud under the firm's brand is a compliance risk.
- **Setup:** $1,000 − ~8 h (voices, intro/outro, RSS feed, template, first-episode review) × $75 = $400 → 60%.

## 4. Watering holes (named)
- AICPA & CIMA, state CPA societies (e.g. CalCPA, NYSSCPA), CPA.com events; Accounting Today and CPA Trendlines audiences.
- ASAE (American Society of Association Executives) and its Collaborate forums; rasa.io's association-newsletter customer base.
- Google Maps "CPA firm" + firm sites with a "Newsletter" page; Substack/beehiiv directories filtered by B2B/finance.

## Attention (30-day)
- Buyers: none found. Sellers: "AI podcast side hustle" listicles are common ([example](https://www.duckdblab.com/en/post/ai-podcast-side-hustle-notebooklm/)), and NotebookLM tutorials target the same pitch.

## The video's claims vs the evidence
- "Firms will pay $600/mo for 4 episodes": no buyer ask found; free NotebookLM (often already in their Workspace) makes a similar file.
- "~$30/mo cost": tool cost fine; human QA hours sink the margin.
- Open Notebook is real and capable, but the pitch does not need it; NotebookLM or Wondercraft does the same job without hosting.

## Verdict: ❌ REJECT
Failed checks: **1 (0 tight buyers)** and **3 (20–45% margin with honest QA)**. Free and $25/mo tools already make the deliverable.

**Better angle:** bundle audio as a cheap add-on inside a newsletter-writing retainer for firms that do not yet publish one (the newsletter is the paid work; audio is a free extra). Or target associations with paying members, where a member-only audio briefing can be sold as a sponsored product. Both untested.
