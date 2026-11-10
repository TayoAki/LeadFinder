# Niche Scorecard: "Voice Studio" Spanish dubbing for creators (Gate 0)

Date 2026-11-10 · sources: GitHub page, Upwork/Fiverr via web search, Reddit (treg `crawl4ai.reddit.search.posts`, 4 queries), live pricing pages (ElevenLabs, Rask, HeyGen), agency pages · windows: Reddit r/NewTubers last 12 months (relevance), Upwork as indexed.

Offer: dub every existing video of a 10K-250K-sub coach/creator (business, finance, fitness) into Spanish in their cloned voice, caption it, post to a separate Spanish channel. $1,000 setup + $750/mo for up to 8 videos. Claimed cost $0 (local).

| Check | Result | Evidence |
|---|---|---|
| 1. Buyers asking (20+) | ❌ FAIL | Tight 1, loose ~4. No creator asking to hire a done-for-you Spanish channel found. |
| 2. Competitors with live prices | ❌ FAIL (price capped) | YouTube auto-dub $0; Rask $39-249/mo; ElevenLabs $22-99/mo; HeyGen $29-149/mo; Fiverr AI dub $3/min. |
| 3. Margin ≥50% | ⚠️ BORDERLINE | ~25-55% on the retainer once Spanish QA hours are counted. |
| 4. Watering holes | ✅ PASS | Named creator communities exist (below). |

## The repo
- Name is not garbled much: **VoiceStudio** by debpalash, formerly OmniVoice-Studio ([GitHub](https://github.com/debpalash/VoiceStudio); old URL [OmniVoice-Studio](https://github.com/debpalash/OmniVoice-Studio)).
- Page shows ~106k stars, ~11.8k forks, AGPL-3.0. Aggregators show far lower counts (e.g. ~449 on [awesome.ecosyste.ms](https://awesome.ecosyste.ms/projects/github.com%2Fdebpalash%2FOmniVoice-Studio)); star count inconsistent, treat as attention only. GitHub API not reachable from this session.
- Does what he says, mostly: local voice cloning, transcription, translation and "dub videos with speech timed to the original"; demucs keeps background audio ([besthub write-up](https://www.besthub.dev/articles/voicestudio-local-first-open-source-voice-platform-for-cloning-dubbing-tts-8315f8ed2488)). Lip-sync not mentioned. Beta.
- "$0 cost" ignores a GPU box and that **model weights carry their own licenses** (the app shows them per model). Some voice models may be non-commercial: not verified per model.

## 1. Buyers asking
- **Upwork, tight (1):** [TYE Arcade Español, Spanish Dubbing Specialist](https://www.upwork.com/freelance-jobs/apply/Spanish-Dubbing-Specialist-TYE-Arcade-Espa_~022110576298121380735/): a channel hiring an operator to run ElevenLabs dubs. Budget not visible (403). This buyer already owns the tool and wants hourly labour, not a $750 package.
- **Upwork, loose:** Spanish YouTube editors and presenters ([women's health channel editor](https://www.upwork.com/freelance-jobs/apply/YouTube-Video-Editor-for-Women-Health-Channel-Spanish_~022114808166159946036/), [bilingual editor](https://www.upwork.com/freelance-jobs/apply/Bilingual-YouTube-Video-Editor_~022065548419203965070)). These are Spanish-first channels, not dubbing.
- **Reddit r/NewTubers (12 months, ~43 dubbing posts):** almost all are about YouTube's *free* auto-dub: turn it on/off, it "tanked views" ([1](https://www.reddit.com/r/NewTubers/comments/1w1ulf4/auto_dubbing_tanked_views/)), low-RPM language dubs cut earnings ([2](https://www.reddit.com/r/NewTubers/comments/1v3n5xj/youtube_enabled_ai_dub_of_a_language_from_a_low/)). Closest to intent in the last 60 days: ["Auto Dubbing is working so I want to dub myself. Should I make another channel?"](https://www.reddit.com/r/NewTubers/comments/1xfsjhc/auto_dubbing_is_working_so_i_want_to_dub_myself/) (2026-10-26) and ["Is it useful to dub your videos as a small channel?"](https://www.reddit.com/r/NewTubers/comments/1x3m9wy/is_it_useful_to_dub_your_videos_as_a_small_channel/) (2026-10-11). Small channels, no budget.
- r/youtubers "dubbing spanish": 0 results.
- Counts: **tight 1, loose ~4** in 60 days. Budgets: not verified.

## 2. Competitors (live prices)
- **YouTube auto-dubbing: free**, rolled out to all creators, 27 languages, 8 with "Expressive Speech" ([Storyboard18](https://www.storyboard18.com/digital/youtube-expands-auto-dubbing-to-27-languages-adds-more-natural-and-expressive-voices-88923.htm), [Metricool](https://metricool.com/youtube-multi-language-audio-tracks-now-available-for-more-creators/)). Creator's own cloned voice: not confirmed for YouTube's tool. Creators can also upload their own dub as a **multi-language audio track on the same video** ([YouTube blog](https://blog.youtube/creator-and-artist-stories/youtube-auto-dubbing-explained/)).
- **ElevenLabs** ([pricing](https://elevenlabs.io/pricing)): Creator $22/mo (121k credits, pro voice clone), Pro $99/mo (600k). Auto-dub 3,000 credits/min unwatermarked → Pro ≈ 200 min/mo.
- **Rask.ai** ([pricing](https://rask.ai/pricing)): Creator $39/mo (25 min), Creator Pro $99 (100 min, lip-sync), Business $249 (250 min).
- **HeyGen** ([pricing](https://www.heygen.com/pricing)): Creator $29, Pro from $49, Business $149 + $20/seat; 30-60 min per video cap.
- **Done-for-you:** [UpREX Media Studio](https://www.upwork.com/agencies/uprexstudio/) $2.5-5/min with human voices; Fiverr AI dub [$3/min](https://fiverr.com/elqueresume/dub-your-youtube-video-into-any-language); Voquent human dubbing ≈ $880-3,120/mo for ~20 min/week (per search summary, not verified live).
- Floor: 8 videos × 15 min = 120 min. Fiverr at $3/min = **$360/mo**; Rask Creator Pro **$99/mo**; YouTube **$0**. His $750/mo needs a strong reason over all three.

## 3. Margin (at $750/mo, 8 videos)
- Tools: $0 local (ignoring GPU/power), or $99 ElevenLabs Pro as backup.
- Hours per video (15 min): pull + run 0.25 h, Spanish translation review 0.5-0.75 h, listen-through QA and timing/clone fixes 0.5-0.75 h, captions + title/description in Spanish + upload 0.25-0.5 h = 1.5-2.25 h.
- Monthly: 12-18 h + 1-2 h client comms. Spanish-fluent operator at $35-40/h → $455-800.
- Margin: best (13 h × $35 = $455) **39%**; worst (20 h × $40 = $800) **-7%**. Only ~55% if QA drops to ~1 h/video, which is risky for finance claims.
- Setup $1,000 "every existing video": a 200-video back catalog at 1.5 h each = 300 h. Not coverable at that price.

## 4. Watering holes
- r/NewTubers, r/youtubers, r/PartneredYoutube; Skool/Circle course-creator groups; creator-economy newsletters (Creator Science, Publish Press); YouTube creator agencies (BeMultilingual, AIR Media-Tech) as resellers. Reachable, but the audience talks about the free tool.

## Attention (30-day)
- Many sellers: Fiverr AI-dub gigs ([example](https://fiverr.com/jotam123/do-professional-ai-dubbing-and-sync-using-elevenlabs), [voice-clone lipsync](https://fiverr.com/simi_oremi/pro-dub-hq-real-ai-voice-match-clone-lipsync-multilingual-translation)), VoiceStudio press round ([aitoolly](https://aitoolly.com/ai-news/article/2026-10-01-voicestudio-emerges-as-an-open-source-local-elevenlabs-alternative-supporting-646-languages)). Buyers mostly ask whether *free* auto-dub helps or hurts.

## The video's claims vs the evidence
- "Runs locally, $0": true for software; false for labour (QA dominates).
- "Separate Spanish channel": YouTube's own direction is multi-language audio on the *same* video, which keeps subs and watch history. A new channel starts at zero.
- "Creator's own voice": real edge over YouTube's generic voice, but ElevenLabs/Rask sell exactly that for $22-99/mo.
- Several creators report dubs cut views or earnings (low-RPM countries). Not a proven revenue win for the buyer.

## Verdict: ❌ REJECT
Fails check 1 (tight 1) and check 2 (free YouTube tool plus $22-99/mo SaaS cap the price). Margin borderline.
**Better angle:** sell to course creators, not YouTubers: dub a paid course library into Spanish for a Spanish-language launch (one-off $2-5k per course, priced per finished minute, uploaded to their course platform). That buyer has revenue tied to the dub and no free YouTube equivalent. Needs its own Gate 0.
