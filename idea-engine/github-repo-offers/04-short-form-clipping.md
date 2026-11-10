# Niche Scorecard: Done-for-you short-form clipping for experts, built on OpenShorts, $400/month (Gate 0)

**Date:** 2026-11-10
**Offer tested:** 8-10 captioned clips per episode, curated, hooks written, scheduled to TikTok/Reels/Shorts. $400/month for 4 episodes (~30-40 shorts). Claimed ~3 hours of work per client per month. Buyers: realtors, financial advisers, lawyers, coaches, podcast hosts.

**Data sources and samples**
- **Upwork job posts:** about 55 distinct posts found through web search (`site:upwork.com/freelance-jobs`, 9 queries). Upwork blocks direct page fetches (HTTP 403), so I could not open posts to read dates, proposals or client spend. Dates come from search snippets (4 posts dated Jul 18, Oct 1, Oct 6 and Oct 18, 2026). For the rest I estimated dates from the job-ID sequence, calibrated on those 4. Treat those dates as approximate.
- **LinkedIn jobs:** treg `anyapi.linkedin.search.jobs`, 8 queries, US, posted in the past month. 42 unique postings.
- **Reddit:** treg `anyapi.reddit.search`, 12 queries, past month, sorted by new. 221 unique posts across r/podcasting, r/NewTubers, r/forhire, r/HireAnEditor, r/VideoEditingRequests, r/VideoEditors_forhire and others.
- **Competitor pricing:** live pricing pages for Opus Clip, Klap, Submagic, Descript, Vizard, Upload-Post, PenguinClip, VidChops and videoeditingcompany.com, all fetched 2026-11-10. Fiverr gig pages returned 403, so Fiverr prices are **not verified**.
- **OpenShorts:** the GitHub repo page [mutonby/openshorts](https://github.com/mutonby/openshorts).
- **treg spend:** $0.0116 across my 23 calls (sum of `charged_micro`). The team balance fell from $9.3717 to $9.1823 over the session, but other sessions share that wallet. My own calls account for $0.0116 of the drop. That is well under the $0.75 cap.

---

## Gate 0 checklist

### 1. 20+ purchase-intent signals in 30-60 days, with a consistent buyer, pain and deliverable: ❌ FAIL for the named buyer (the category has heavy demand)

**TIGHT signals** are posts where an expert, personal brand or podcast host with existing long-form video wants ongoing short clips cut from it. I counted those posted roughly Sep 11 to Nov 10, 2026. I found **5**.

| # | Post | Approx. date | Notes |
|---|---|---|---|
| 1 | [Long-Term Podcast Video Editor (YouTube Shorts / FB Reels)](https://www.upwork.com/freelance-jobs/apply/Long-Term-Podcast-Video-Editor-Topaz-Video-YouTube-Shorts-Facebook-Reels_~022111946115252122617/) | Oct 18 (snippet) | ~70 Shorts/Reels a week. It **explicitly rejects** "uploading interviews into Opus Clip and exporting whatever the AI selects." |
| 2 | [Short-Form Video Editor for Law Firm Reels](https://www.upwork.com/freelance-jobs/apply/Short-Form-Video-Editor-for-Law-Firm-Reels-Dynamic-Captions-Cutaways-Strict-Brand-Style_~022114097606910163961/) | ~late Oct (ID estimate) | Colorado personal-injury firm. Dynamic captions, strict brand style. |
| 3 | [Podcast Content & Social Media Manager: Post-Production, Repurposing & Distribution](https://www.upwork.com/freelance-jobs/apply/Podcast-Content-Social-Media-Manager-for-Post-Production-Repurposing-Distribution_~022114678751203311914/) | ~late Oct (ID estimate) | Clips plus distribution. Closest to the offer as described. |
| 4 | [Podcast Producer for a Weekly Interview Show (Editing, Show Notes, Clips, Publishing)](https://www.upwork.com/freelance-jobs/apply/Podcast-Producer-for-Weekly-Interview-Show-Editing-Show-Notes-Clips-Publishing_~022105799650902481209/) | ~Oct 1 (ID estimate) | Wants the full bundle, not clips alone. |
| 5 | [Short-Form Video Editor & Social Media Content Creator for Executive Brand](https://www.upwork.com/freelance-jobs/apply/Short-Form-Video-Editor-and-Social-Media-Content-Creator-for-Executive-Brand_~022099240445151858169/) | ~mid Sep (ID estimate) | Executive personal brand. |

**LOOSE signals in the same window** are short-form editing demand where the buyer or deliverable doesn't match the offer.
- **Upwork:** 6 posts, for example [Full-Time Video Editor and Clipper](https://www.upwork.com/freelance-jobs/apply/Full-Time-Video-Editor-and-Clipper_~022101707405343003614/), [Short-Form Content Strategist + Reels Editor](https://www.upwork.com/freelance-jobs/apply/Short-Form-Content-Strategist-Reels-Editor-Reel-Week-Ongoing_~022107294394940315397/) and [Podcast Editor for Weekly Episodes](https://www.upwork.com/freelance-jobs/apply/Podcast-Editor-for-Weekly-Episodes_~022105680841238702217/) ($15-25/hr, full episodes only).
- **LinkedIn:** 42 unique US "video editor / social video editor / short-form editor" jobs in the past month. They are almost all in-house roles at brands and media companies, such as [Quippy, Short-form Video Editor](https://www.linkedin.com/jobs/view/short-form-video-editor-at-quippy-4484269226), [MrBeast, Editor, Vertical Platforms](https://www.linkedin.com/jobs/view/editor-vertical-platforms-at-mrbeast-4425609793) and Fashion Nova. **None** came from a realtor, adviser, lawyer or podcast host.
- **Reddit:** about 57 hiring-type posts in 30 days. Most are faceless or gaming Shorts channels, or clipping agencies recruiting subcontractors. Examples: [Short-form Editor, $35/Video, ~$1K/Month](https://www.reddit.com/r/HireAnEditor/comments/1xrp3co/hiring_shortform_editor_35video_1kmonth_wholesome/), [30-50 vids/month retainer (GTA content)](https://www.reddit.com/r/VideoEditingRequests/comments/1xj8tmc/hiring_shortform_video_editors_monthly_retainer/) and [Echo Media (agency recruiting editors)](https://www.reddit.com/r/VideoEditor_forhire/comments/1xfp1yi/hiring_freelance_shortform_video_editors_remote/).
- **r/podcasting:** hosts are asking *how to do it themselves*, not hiring. See ["Shorts for Social Media"](https://www.reddit.com/r/podcasting/comments/1xf5xiw/shorts_for_social_media/) (which tool: Riverside, Opus or CapCut) and ["Do podcasters use human or AI editors?"](https://www.reddit.com/r/podcasting/comments/1xib1df/shortform_clips_creation/). One two-host show [posts daily clips itself](https://www.reddit.com/r/podcasting/comments/1xrngyr/video_podcast_clips_whats_actually_moving_the/).

**Wider window, Jun to Nov 2026, Upwork only:** about 25 podcast or expert clip posts were visible through search, roughly 5 a month. The named verticals do appear: real estate ([property reels, $50/video](https://www.upwork.com/freelance-jobs/apply/Real-Estate-Video-Editor-Property-Reels-Walkthroughs-sec-min-Video_~022080721833770959613/), [RE content repurposing](https://www.upwork.com/freelance-jobs/apply/Video-Editor-Content-Repurposing-Specialist_~022062353589610958529/)), mortgage ([mortgage brand short-form](https://www.upwork.com/freelance-jobs/apply/Short-Form-Video-Editor-Social-Media-Content-Assistant-for-Mortgage-Brand_~022083191673443947675/)) and finance ([finance talking-head shorts](https://www.upwork.com/freelance-jobs/apply/Short-Form-Video-Editor-Finance-Career-Content-Talking-Head-Shorts_~022067468832956419751/), [retirement-planning advisor footage](https://www.upwork.com/freelance-jobs/apply/Video-Content-Creation-for-Retirement-Planning_~022057239216824351562/)). Each vertical shows a handful of posts, not 20.

**Budgets and rates seen** (from search snippets, not verified on the post pages):
- $30-60 per short clip ([interview podcast](https://www.upwork.com/freelance-jobs/apply/Video-Editor-for-Interview-Podcast-Social-Clips-Ongoing_~022066105456723709633/)).
- $50 per real estate reel.
- $100 fixed for a 5-clip test.
- $200 fixed for 40-150 clips across 5 episodes.
- $5-10/hr and $5-15/hr on lower-end posts.
- On Reddit: $25-80 per Short, or $600-1,000 a month for about 30 videos.

**Supply side: this is the real story.**
- A US podcast-clip company is [hiring full-time Indian editors at ₹5,000-8,000/month](https://www.reddit.com/r/VideoEditors_forhire/comments/1xfebc5/hiring_fulltime_ai_video_editor_india_5000_to/) (roughly $60-95 a month; exchange rate not verified). The workflow is AI shortlist, human picks the best 5, then OpusClip.
- [Podcast stitching pays $5 per episode](https://www.reddit.com/r/VideoEditors_forhire/comments/1xfc6bm/hiring_beginner_video_editors_india_for_simple/).
- On Reddit, "[For Hire]" posts (54) roughly equal hiring posts (57).
- [Fiverr podcast-clip gigs](https://www.fiverr.com/categories/video-animation/video-repurposing) number in the dozens, with headline prices from $5 (pages blocked; counts and prices not verified).

**Verdict on Gate 1:** demand for short-form editing is large, but it is spread across faceless channels, brands and agencies. The specific buyer, an expert with long-form video who wants clips plus scheduling, showed **5 visible TIGHT signals in 60 days, below the bar of 20**. Caveat: Upwork can't be searched directly here, so the true count is understated. It is not verified that it reaches 20.

### 2. 3-5 competitors with public pricing verified on live pages: ✅ PASS

**Done-for-you services (verified live):**

| Service | Price | Volume | Per clip | Scheduling? |
|---|---|---|---|---|
| [PenguinClip Starter / Pro / Business](https://www.penguinclip.com/Home/Offer) | $449 / $849 / $1,349 a month (10% off the first year: $404 / $764 / $1,214) | 12 / 24 / 40 clips a month | ~$37 / $35 / $34 | No. Files only, editor-proofread captions and titles. |
| [VidChops Weekly / Pro](https://vidchops.com/pricing/) | $495 / $995 a month | 16 / 32 shorts (or 4 / 8 long-form) | ~$31 | Not listed |
| [videoeditingcompany.com](https://videoeditingcompany.com/podcast-clips-pricing/) | Creator retainer $600-1,500 a month; per-episode $150-350 (3-5 clips) up to $700-1,500 (8-12 clips) | 2-4 episodes × 5 clips | ~$30-75 | Not stated |

**SaaS (verified live):**

| Tool | Price | Allowance | Auto-post / schedule |
|---|---|---|---|
| [Opus Clip](https://www.opus.pro/pricing) | Starter $15, Pro $29 a month | Credits not listed | Pro: yes (TikTok, YT Shorts, IG, FB, LinkedIn, X, and more) |
| [Klap](https://klap.app/pricing) | $29 / $79 / $189 a month | 100 / 300 / 1,000 clips | Yes, on all plans |
| [Submagic](https://www.submagic.co/pricing) | $12 / $23 / $41 a month (billed yearly) | 5 / 15 / 37 Magic Clips | Pro and up: social publishing |
| [Descript](https://www.descript.com/pricing) | $16-24 / $24-35 / $50-65 per person a month | 10 / 30 / 40 media hours | Not listed |
| [Vizard](https://www.vizard.ai/pricing) | Paid prices didn't render | 600+ credits | "Schedule social posts" listed |

**Going rate:**
- Done-for-you with human curation: **about $30-37 per clip**, or **$449-495 a month for 12-16 clips**, mostly without posting.
- SaaS: **about $0.29 per clip with auto-posting** (Klap Basic).
- Corey's offer: **$10-13 per clip** ($400 ÷ 30-40). That is about a third of the done-for-you rate per clip, but still far above the SaaS floor and the offshore labor floor.

### 3. ≥50% gross margin at $400/month: ❌ FAIL at realistic hours (passes only at the claimed 3 hours)

**Tool cost per client:**
- [Upload-Post](https://www.upload-post.com/pricing) is required for OpenShorts scheduling. TikTok needs a paid plan: Basic $24/month (5 profiles) or Professional $50/month (25 profiles, about $6 per client at 8 clients).
- Gemini API: not verified, assumed a few dollars.
- Server or hosting: about $10-20 per client, assumed.
- **Tools total: about $25/client/month** (estimate).

**Is 3 hours realistic?** No. 3 hours for 35 clips is about 5 minutes per clip, covering curation, hook writing, caption QA, reframing fixes and scheduling, plus client comms. A per-episode estimate:
- Skim the transcript and the AI shortlist: ~30 min.
- Fix and QA 9 clips at ~8-10 min each: ~75-90 min.
- Hooks, titles and scheduling: ~20 min.
- **Total: about 2-2.5 hours per episode, or 8-10 hours a month for 4 episodes**, plus about 1 hour of client back-and-forth.

These are my estimates, not measured. Machine time is extra: OpenShorts' own figure is 5-8 min of CPU per 8 min of video, so roughly 40-60 min per 1-hour episode.

**Margin at $400 revenue:**

| Hours/month | Labor @ $25/hr | Margin @ $25 | Labor @ $50/hr | Margin @ $50 |
|---|---|---|---|---|
| 3 (claimed) | $75 | (400-75-25)/400 = **75%** | $150 | (400-150-25)/400 = **56%** |
| 6 | $150 | **56%** | $300 | **19%** |
| 9 (realistic) | $225 | **38%** | $450 | **-19%** |

**Break-even for 50% margin:** at most 7 hours at $25/hr, or at most 3.5 hours at $50/hr. The offer passes only if the operator ships near-raw AI output. Buyers say they don't want that: post #1 above rejects Opus-style AI picks.

### 4. Named watering holes and how to reach them: ✅ PASS (adequate for podcasts, thin for professionals)

**Podcast hosts:**
- [Podcasters' Support Group](https://www.thehiveindex.com/communities/podcasters-support-group/) on Facebook: ~33-42k members, according to [Hive Index](https://www.thehiveindex.com/communities/podcasters-support-group/) and [Buzzsprout](https://www.buzzsprout.com/blog/best-podcast-communities).
- The Podcast Movement Facebook group (~32k) and the Buzzsprout community (~44k), per [Buzzsprout's list](https://www.buzzsprout.com/blog/best-podcast-communities).
- r/podcasting.
- Reach: answer "how do I make shorts" threads with before/after examples. Most of those hosts want a tool, though.

**Job boards:** Upwork is the densest source of real budgets. Search "podcast clips", "short-form editor" and "repurpose", and pitch through proposals.

**Financial advisers:** [XYPN](https://www.xyplanningnetwork.com/xypn-radio-podcast/), whose podcast ran an [episode on short-form video for advisors](https://xyplanningnetwork.libsyn.com/ep-403-mastering-short-form-video-marketing-with-nate-hoskin-and-nick-meyer) (Jan 2025), and the Kitces community. Member counts and paths in are not verified.

**Realtors and lawyers:** r/realtors exists. Lab Coat Agents and other realtor groups came up, but I could not verify their size. I found no verified lawyer community.

---

## Attention signal (30-day)

- **Sellers outnumber buyers.**
  - On Reddit, [For Hire] posts (54) about equal [Hiring] posts (57).
  - Many of the "hiring" posts are themselves clipping agencies recruiting cheap labor. Examples: [Clip That Video](https://www.reddit.com/r/VideoEditingRequests/comments/1xq5tjg/hiring_clippers_shortform_video_editors_clip_that/), [Echo Media](https://www.reddit.com/r/VideoEditor_forhire/comments/1xfp1yi/hiring_freelance_shortform_video_editors_remote/), and an Indian [investor pitch for a "Global Clipping Agency"](https://www.reddit.com/r/indianstartups/comments/1xoc7nn/looking_for_an_investorstrategic_partner_for_a/).
  - Builders are shipping more clipper tools, for example ["Drop a 2-hour podcast, get 15 Shorts"](https://www.reddit.com/r/SideProject/comments/1xf8xfk/drop_a_2hour_podcast_get_15_readytopost_shorts_my/).
- **Clipping is a promoted side hustle.**
  - NPR ran ["The clipping economy"](https://www.wusf.org/2026-05-12/the-clipping-economy-how-short-form-video-clippers-are-overrunningthe-internet) in May 2026. It called the work "a race to the bottom" for some.
  - Tool vendors publish "start a clipping agency, $500-2,000/client" guides ([ClipSpeed](https://clipspeed.ai/blog/podcast-clipping-business.html), [AutoClip](https://autoclip.dev/blog/how-to-start-clipping-business)).
- **Pay-per-view clipping sets low price expectations.** [Whop Content Rewards](https://docs.whop.com/manage-your-business/growth-marketing/content-rewards) campaigns pay about **$1 per 1,000 views** (median across 50 live campaigns on Sep 28, 2026, per [Foundry](https://www.builtbyfoundry.io/blog/what-is-clipping-1-dollar-per-1000-views-50-campaigns); range $0.05-3). Big creators can get clips for almost nothing up front. Small experts see a flood of $5-15 Fiverr clippers.
- **Buyers ask about tools, not services.** In r/podcasting, the 30-day posts about shorts are "which tool?" and "AI or human?", not requests to hire.

## What the video gets right / wrong

**Right:**
- **OpenShorts is real.** [mutonby/openshorts](https://github.com/mutonby/openshorts) has 7.6k stars, 1.6k forks and 613 commits. The core is MIT-licensed.
  - It picks 3-15 moments with Gemini or a local LLM.
  - It burns in word-level captions (faster-whisper) and adds hook text overlays.
  - It reframes to 9:16 with face tracking.
  - It schedules posts to TikTok, Reels and Shorts through Upload-Post.
- **Done-for-you clipping is a real paid category** with public retainer pricing: $449-1,349 at PenguinClip, $495-995 at VidChops.
- **Experts with long-form footage do hire for this.** Examples: a law firm, an executive brand, mortgage and finance brands, and podcast producers on Upwork.
- **The lead-source idea partly works.** "Short-form editor" job posts are where budgets show up.

**Wrong or overstated:**
- **"3 hours per client per month"** works out to about 5 minutes per curated, hooked, QA'd and scheduled clip. That isn't realistic for human-quality output. Realistic is 8-10 hours, which breaks the margin (Gate 3).
- **OpenShorts is not a moat.** [Opus Clip Pro ($29)](https://www.opus.pro/pricing) and [Klap ($29, 100 clips, auto-post)](https://klap.app/pricing) do the same job with scheduling. The repo saves at most about $29 a month in tooling. Self-hosting also adds setup and maintenance: Docker, 8GB+ RAM, and Gemini, Upload-Post and ElevenLabs keys.
- **Licensing:** the repo's `cloud/` folder is under a separate commercial license that bars offering it as a paid hosted service. Using the MIT core to deliver a service looks fine. Reselling the cloud layer does not.
- **Buyers are wary of AI-picked clips.** The highest-volume podcast post found says outright that it doesn't want Opus-style AI exports. The value is human judgment, which costs time.
- **$400 for 30-40 clips is priced below done-for-you peers** ($30-37/clip) but well above offshore labor (₹5-8k/month full-time) and SaaS. You compete on price with people who can always go lower.
- **"Podcast charts" as a lead source:** not verified. I didn't check how many charting shows already have clip teams.

## Verdict: ❌ REJECT (as specified)

**Deciding reason:** the margin doesn't hold at realistic hours. 9 hours a month at $25-50/hr gives -19% to 38%. The only way to hit 3 hours is near-raw AI output, which is the thing paying buyers say they don't want. The specific expert buyer also showed only about 5 TIGHT signals in 60 days, while supply is flooding in: offshore editors at $60-95 a month, SaaS at $0.29 per clip with auto-post, and Whop clippers at $1 per 1,000 views.

**Better-angled version (🟡 research slot, not tested here):**
1. **Sell the bundle the TIGHT posts actually ask for.** That is a "podcast producer" retainer: episode edit, 8-12 clips, show notes and publishing. Price it at **$900-1,500 a month**, inside the [videoeditingcompany.com](https://videoeditingcompany.com/podcast-clips-pricing/) Creator band and near [VidChops Pro $995](https://vidchops.com/pricing/). Labor at 12-15 hours a month still clears 50% at $25-35/hr.
2. **Or go narrow and compliance-heavy:** financial advisers (FINRA/SEC marketing review) or law firms (bar advertising rules, strict brand style, like the Matlin post). Fewer clips (12-16) and pre-approved captions are worth $35+ per clip, with less competition from Fiverr clippers. This needs its own Gate 0 run. Adviser and lawyer demand counts here were too small to judge.
3. **If staying at $400:** cut the volume to 12-16 clips, matching PenguinClip's $449 for 12. That keeps labor at about 4-5 hours a month and the margin at about 56-69% at $25/hr.
