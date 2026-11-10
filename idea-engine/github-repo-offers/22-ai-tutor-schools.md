# Niche Scorecard: DeepTutor "AI tutor for licensing schools" (Gate 0)

Date 2026-11-10 · Sources: web search (Upwork job pages indexed by search, vendor pages, press releases), Upwork category pages via treg web extract, Reddit search via treg (2 queries × 50 posts) · Window: last ~60 days for buyer asks, live pricing pages fetched today.

Offer as pitched: a private tutor built from a school's course material, with quizzes and question banks, for real-estate/insurance CE, CDL, trade and barber schools with 50+ students a month. $2,000 setup + $500/mo, ~$30/mo model cost.

| Check | Result | Evidence |
|---|---|---|
| 1. Buyers asking (20+) | ❌ FAIL | Tight 0, loose ~3 in 60 days. No licensing-school owner found asking. |
| 2. Competitors w/ live prices | ⚠️ PASS on count, bad for price | CustomGPT.ai $99/$499, Chatbase $40–$500, Thinkific $109–$499 (AI TA on Plus). Incumbent schools already bundle tutors free. |
| 3. Margin ≥50% | ❌ FAIL (borderline monthly, fails setup) | ~44% monthly at 3 h/mo; setup ~6% at 25 h. |
| 4. Watering holes | ✅ PASS | Google Maps, state licensing-provider lists, FMCSA Training Provider Registry, AACS, REEA. |

## Repo check
- [HKUDS/DeepTutor](https://github.com/HKUDS/DeepTutor) is real: 57.7k stars, 7.0k forks, Apache-2.0, release v1.7.2 dated 2026-11-06 (read from the GitHub page today).
- It does what he says: builds knowledge bases from uploaded documents for grounded tutoring, plus Quiz, Question Bank and Practice modes. It is a self-hosted web app (Next.js front end), so someone has to host and patch it.

## 1. Buyers asking
**Tight (school owner wants an AI tutor/quiz bot built on their course material): 0 found.**
- Search of indexed Upwork job pages for course-material tutors, exam-prep chatbots and custom GPTs for licensing/CE students found no matching post.
- Reddit: "AI tutor for my students course" and "custom GPT for my school students" (100 posts, past year) returned students, tutor-app promos and spam. No school owner asking.
- The $7,000 barber-school textbook GPT story is **not verified**; no public trace found.

**Loose (any course-content chatbot / RAG for education): ~3 in the window.**
- [AI/RAG engineer to add agents to a school management system](https://www.upwork.com/freelance-jobs/apply/RAG-Engineer-Needed-Add-Agents-School-Management-System_~022103129492379237144/), $2,500 fixed, 2026-09-24 (K-12 style lesson plans, not licensing).
- [Proof-of-concept chatbot for PDF documents](https://www.upwork.com/freelance-jobs/apply/Development-small-proof-concept-chatbot-for-PDF-documents_~022104727963195757032/), $50 fixed, 2026-09-29.
- [Language test preparation platform](https://www.upwork.com/freelance-jobs/apply/Language-Test-Preparation-Platform_~022047458400377371226/), $300 fixed, 2026-04-23 (outside window, no chatbot).
- Older (~2 years): [AI teaching assistant contract-to-hire](https://prompthero.com/jobs/490266-ai-teaching-assistant-with-expertise-in-chatgpt-zapier-automation-openai-fine-tuning-and-llama-contract-to-hire-at-upwork), [AI to answer repeated student questions](https://prompthero.com/jobs/226502-ai-expert-to-help-train-an-ai-model-that-can-generate-answers-to-repeated-questions-from-students-at-upwork).
- Budgets seen: $50 to $2,500. None from a licensing school.

## 2. Competitors (live prices)
| Competitor | Price | What it covers |
|---|---|---|
| [CustomGPT.ai](https://customgpt.ai/pricing/) | $99/mo (10 agents, 1,000 queries); $499/mo (25 agents, 5,000 queries) | Upload-your-docs chatbot, no-code |
| [Chatbase](https://www.chatbase.co/pricing) | $40 / $150 / $500 list per mo (700 / 4k / 15k credits) | Same, self-serve |
| [Thinkific](https://www.thinkific.com/pricing/) | $109 / $219 / $499 per mo; AI teaching assistant only on Plus (contact sales) | LMS with learner-facing AI TA |
| [XCEL Rubi AI](https://www.xcelsolutions.com/rubi-ai-insurance-exam-prep) | Included free with any XCEL insurance prelicensing course ([press release 2026-05-20](https://www.streetinsider.com/PRNewswire/XCEL+Launches+AI+Assistant+to+Personalize+and+Improve+Insurance+Exam+Preparation/26525710.html)) | 24/7 tutor on proprietary curriculum, 800+ practice questions |
| [Coursebox](https://www.coursebox.ai/pricing) | Plan prices not shown on the live page (not verified) | AI course builder + tutor |
| Fiverr gigs ([example](https://fiverr.com/rishabbishtt/develop-a-private-ai-tutor-chatbot-based-on-your-teaching-style), [example](https://fiverr.com/daniel_federick/create-a-custom-ai-training-bot-for-your-online-course-students)) | Gig prices not verified | Same deliverable, freelancer-built |

- Incumbents are bundling the feature: XCEL (Colibri group) ships Rubi free; Real Estate Exam Scholar lists a 24/7 AI tutor ([review](https://agentmarketingessentials.com/real-estate-exam-scholar-review/)); Real Estate School of Nevada announced its own tutor "Mr. Wardley" (launch not verified); EstatePass.AI and CDL apps (e.g. "Mentora" in [CDL Practice Test 2026](https://marlvel.ai/apps/cdl-practice-test-2026-by-abc)) sell direct to students. Milady sells [ExamReady](https://www.cengage.com/c/cima-examready-epin-for-cosmetology-psi-exam-1e-milady/9798214609928/) for barber/cosmetology students.
- The buyer may already own the tool: any school with ChatGPT/Claude/Gemini seats can build a custom GPT / Project from its study guide in an afternoon. A student can do the same for free.
- Price cap: a $99–$150/mo SaaS covers the core job. $500/mo must be justified by content prep and updates.

## 3. Margin (arithmetic)
Assumptions: loaded rate $75/h; hosting a DeepTutor instance ~$25/mo (estimate, not verified); model $30/mo (his figure).
- **Monthly:** $500 − $30 model − $25 hosting − 3 h (content updates, wrong-answer fixes, student-issue triage, report) × $75 = $225 → **$220 / $500 = 44%**. At 2 h/mo: 59%. At 4 h: 29%.
- **Setup:** $2,000 − ~25 h (gather/clean course material, build KB, QA question bank by hand against the state exam outline, branding, staff training) × $75 = $1,875 → **$125 / $2,000 = 6%**.
- **Year 1 blended:** revenue $8,000; cost $1,875 + 12 × $280 = $5,235 → **35%**. Fails the 50% bar.
- Risk not in the math: many schools license their curriculum from publishers; whether they may load it into a third-party AI is **not verified**. A wrong exam answer is a reputational hit for the school.

## 4. Watering holes (named)
- Google Maps categories: "real estate school", "CDL training school", "barber school", "insurance school".
- State real-estate commission approved-provider lists; state insurance department CE provider lists.
- [FMCSA Training Provider Registry](https://tpr.fmcsa.dot.gov/) (every ELDT provider is listed).
- Associations: Real Estate Educators Association (REEA), IDECC, ARELLO; American Association of Cosmetology Schools (AACS); Commercial Vehicle Training Association (CVTA). Event schedules not checked.

## Attention (30-day)
- Repo: on GitHub Trending late Oct 2026 ([aitoolly](https://aitoolly.com/ai-news/article/2026-10-30-deeptutor-emerges-on-github-trending-hkuds-introduces-lifelong-personalized-tutoring-for-modern-ai-l)). Attention, not demand.
- Buyers: no school-owner posts found. Sellers: many "AI tutor for your course" gigs and SaaS (LearnyBox, SiteSpeak, Learnwise, Coursebox).

## The video's claims vs the evidence
- "Schools will pay $2k + $500/mo": no public buyer ask found; the larger providers already ship tutors free inside their courses.
- "$30/mo cost": plausible for model use; ignores hosting and the human hours, which decide the margin.
- "Free 20-question practice tutor as a hook": a sound demo, but it shows the school how easy a custom GPT is.

## Verdict: ❌ REJECT
Failed checks: **1 (buyers asking: 0 tight)** and **3 (margin ~35–44%)**. Incumbent prep companies bundle the feature for free and $99/mo SaaS does the core job.

**Better angle:** sell a one-off "state-exam question bank QA + custom GPT/Claude Project build" at a fixed fee ($1–2k) to mid-size CDL or RE schools that run their own curriculum. No hosting, no retainer. Or go to the content publishers and prep companies, which are the actual buyers of tutor tech. Both untested.
