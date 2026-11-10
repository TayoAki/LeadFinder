# Email Engine — ListingProof (working name)

Read first: [lead-magnet.md](lead-magnet.md) (form = email + city/ZIP; Typeform survey Q1–Q4), [offer.md](offer.md) (prices, $29 first-kit code), [uvp.md](uvp.md) (enemy statement), [voice.md](voice.md), [journey.md](journey.md) (stage map; this file holds the full copy of emails 1–6 so there is one source).

## 0. Should this business do email — and in what form?
| Question | Answer |
|---|---|
| Audience, or a path to one, not already transacting? | Yes: local-report subscribers and free-kit users who haven't paid |
| Discover by following, or by searching at need? | Mostly at need (a new listing) and via paid ads, so email's main job is to be there when the next listing lands |
| Can we honour a cadence indefinitely? | Yes **at monthly**: the "what lasted in your city" data refreshes automatically from the Ad Library pipeline. Weekly would be padding |
| Something they want every time? | Yes: new kept-running listing ads in their metro, once a month |

**Verdict: FULL ENGINE at a monthly cadence.** Welcome + the 6-email sequence + survey-based shadow tracks, then one monthly local-data email. No weekly newsletter.

## Growth: 2–3 tactics (three, no more)
| Tactic | Why this one | How tracked (UTM) | Target (UNSOURCED) |
|---|---|---|---|
| Local Listing Ad Report (`/local-ads` + home-page exit/20 s popup) | Catches visitors with no listing today; uses our differentiator | `utm_source=meta|site|seo&utm_medium=cpc|popup|article&utm_campaign=local-report` | 25–40% page conversion; 2–5% popup |
| Free-kit sign-ups (product-led) | Every free kit needs an email to deliver; consent checkbox (unticked by default) adds them to the list | `utm_campaign=free-kit` carried from the ad to the kit record | ≥60% of free-kit users opt in |
| Article CTAs (comparison + Facebook ads guide) | Commercial-intent readers, low volume but high fit | `utm_source=seo&utm_campaign=<slug>` | 2–4% of article readers |

Not doing: giveaways, referral loops, cross-promos (the skill's 7-tactic trap). Referral waits for the NPS trigger in [metrics.md](metrics.md).

## Sending schedule (one person receives at most one email per day)
| Day | Email | Source |
|---|---|---|
| 0 | Email 1 — Introduction / welcome (delivers the report) | Sequence + Welcome 1 merged |
| 2 | Email 2 — Highlight the problem | Sequence |
| 4 | Email 3 — Goodwill Hunting | Sequence |
| 6 | Email 4 — Five-inch / five-mile | Sequence |
| 8 | Email 5 — Urgency ($29 first-kit code, expires day 15) | Sequence |
| 14 | Email 6 — Final reminder (code expires tomorrow) | Sequence |
| 17 | Welcome email 2 — The useful stuff | Welcome |
| 21+ | Shadow track (weekly, 5 issues) → then monthly local email, first Tuesday 7:30am ET | Shadow / main |

Deviation from the skill, stated: cmba-email puts Welcome 2 at ~day 7, which would collide with the sales sequence. It moves to day 17, after the sequence ends.

Free-kit users who didn't come through the report get a transactional delivery email instead of Email 1, then join at Email 2 with the "you already have your kit" variants marked below.

---

## Welcome series

### Email 1 (immediate) — also Sequence Email 1 (Introduction)
**Subject:** Your {metro} listing ad report is ready
**Preview:** The 5 that lasted longest, and the one thing to look at first.

Here's your report: **{report_link}**

It shows the five listing ads in {metro} that agents have kept running the longest on Facebook and Instagram. Each one links to its public Ad Library page, so you can watch it yourself.

Look at one thing first: **the first two seconds of each ad.** In most markets we've pulled, the ads that last open on something a buyer recognizes from the street — the front of the house, the view, the kitchen — before any text. If your city's report says otherwise, trust your city.

**Who we are.** ListingProof is a small team that tracks which ads people keep paying to run. We turned that on real estate because listing marketing had become the same templates for everyone, plus AI that sometimes adds a door that isn't there. We build listing videos and Meta ads from your real photos, modeled on what lasts in your market.

**What to expect from us:**
- Five more short emails over the next two weeks about making your next listing's ads, then one round-up of our most useful guides a few days later.
- After that, one email a month: the first Tuesday, 7:30am Eastern, under 4 minutes to read. It's the updated list of what's lasting in {metro}.
- That's it. No daily emails.

**Two small asks so this doesn't land in spam:**
1. Reply "yes" to this email. A reply tells your inbox we're real.
2. If you're on Gmail and this is under Promotions, drag it to Primary.

**One question.** If you didn't fill in the survey after signing up, it's here, four questions, about a minute: **{survey_link}**. It decides what we send you. Or just reply: what's the hardest part of marketing a new listing for you right now?

— Tayo, ListingProof

*You're getting this because you asked for the {metro} report. One-click unsubscribe below.*

### Welcome email 2 (day 17)
*Send rule: include each guide link only if that page is live on the send date (B1 publishes the week of Nov 30, D1 the week of Dec 14 per keywords.md); otherwise drop the bullet.*

**Subject:** The useful stuff, in one place
**Preview:** Three guides, one free kit, and the monthly email.

The sales emails are done. Here's what's worth keeping.

- **VideoTour.ai vs RealEstateContent.ai: 2026 Pricing Compared** — real monthly prices, refunds and cancellation, checked and dated. Useful even if you never buy from us. {link}
- **Real Estate Facebook Ads: What Agents Keep Running** — built from Ad Library data in five metros. {link}
- **AB 723 and AI listing video: how to label it right** — if you're in California or your MLS is strict. {link}
- **Your free listing kit** — still there if you haven't used it. Upload one listing's photos, get a tour reel, a hook reel and three ads. No card. {free_kit_link}

If you run a team, the Team plan is $199 a month for six listing kits and a weekly local-winners feed for your city. Monthly billing, a reminder three days before every charge, cancel in one click. {pricing_link}

Next email: the first Tuesday of next month, 7:30am Eastern. What lasted in {metro} this month.

— Tayo

---

## The 6-email sequence (Emails 2–6; Email 1 is above)

### Email 2 (day 2) — Highlight the problem
**Subject:** The part of the report nobody can do for you
**Preview:** Knowing what works is step one. Rebuilding it every listing is the job.

Your {metro} report shows what lasts. The hard part comes next.

Every new listing, someone has to take that pattern and rebuild it: pick the opening shot from your photos, cut a 15-second hook, a longer tour, a square version for the feed, an unbranded one for the MLS. Then write three to six ad versions. Then check that nothing in the video misrepresents the house.

That's three to five hours per listing if you do it yourself, or $300 to $750 if you hire a videographer (the range one of the big video apps quotes on its own landing page). Most agents do neither and post the photo gallery.

This is the problem we built ListingProof for.

You upload one listing's photos. We find the listing ads in {metro} that agents have kept running 30 days or more, and build your kit on their structure: a tour reel, a hook reel, and Meta ads with headlines and primary text. The camera moves over your real photos; nothing gets generated in. Every clip sits next to the photo it came from, so you can check it in seconds.

Your first kit is free. No card. **{free_kit_link}**

*[Variant for free-kit users: replace the last two paragraphs with:]* You've seen your free kit. The next listing is where it pays off: $49 for the full kit (six ads instead of three, plus square and MLS cuts and 90 days of status re-cuts). **{buy_link}**

— Tayo

### Email 3 (day 4) — Goodwill Hunting
**Subject:** It's not you. It's the template.
**Preview:** Why your listing videos look like everyone else's.

If your listing videos look like every other agent's in town, that's not a skill problem.

Here's what happened. Listing-video apps sell every agent the same templates. Then they added AI that guesses what's in the parts of a room your photo never showed. Then they put an annual price on the pricing page and made the monthly one a click away.

So your listing looks like everyone else's. One invented doorway can get a video pulled from the MLS, or worse — agents on Reddit describe a $2,500 fine with "no warning, no appeal". And you keep paying in January, when you have nothing to list.

None of that is your fault. You used the tools you were sold.

Here's the opportunity. The best evidence of what works in your market is already public: the listing ads agents keep paying to run. Copy the structure of those, use your own photos, show the original next to every clip, and pay only when you have a listing. That's the whole idea.

Try it on your next listing: **{free_kit_link}**

— Tayo

### Email 4 (day 6) — Five-inch / five-mile
**Subject:** What changes on Friday, and what changes by June
**Preview:** The short-term and long-term difference of a kit per listing.

**Five inches (this week):**
- Your listing goes live with a tour reel, a 15-second hook and ads, the same day the photographer's files arrive.
- You post without re-sizing anything: vertical, square and an unbranded MLS cut are all in the kit.
- You can check every clip against the original photo before it goes anywhere.
- You walk into Saturday's open house with a video you can text to anyone who asks.

**Five miles (by spring):**
- Every listing you take looks like the ones that last in your market, not like a template.
- Sellers see a plan, not "I'll post it on Instagram". You can show it at the listing appointment.
- You stop paying in the months you don't list. $49 when you have one, nothing when you don't.
- You build a record of which of your own ads lasted, so next season starts from your data, not a guess.

We don't promise more showings or a faster sale. Nobody can honestly promise that from a video. We promise the kit matches the house, looks like what lasts locally, and costs you nothing in empty months.

Start with the free kit: **{free_kit_link}**

— Tayo

### Email 5 (day 8) — Urgency
**Subject:** $29 for your first listing kit (until {expiry_date})
**Preview:** One code, one kit, expires {expiry_date}.

Short one.

Your first paid Listing Kit is **$29 instead of $49** with this code: **{code}**

It works once, on your account, until **{expiry_date}** (7 days from today). After that the kit is $49, same as for everyone.

What the kit includes: up to 40 photos; a tour reel, a hook reel, a square cut and an unbranded MLS cut; six Meta ads modeled on listing ads agents in {metro} kept running; free re-cuts for open house, price change and sold for 90 days.

And the usual: if anything in the video isn't in your photos, we redo it or refund it. Your first payment is covered by a 30-day money-back guarantee.

No listing this week? Haven't tried the free kit yet? Start the free one now — you can buy the paid kit with the code any time before {expiry_date}. **{free_kit_link}**

— Tayo

*Why a discount at all: we'd rather you try a real listing with us at low risk than wait for a Black Friday deal. We don't run those.*

### Email 6 (day 14) — Final reminder
**Subject:** Your $29 code ends tomorrow
**Preview:** {expiry_date}. Then it's $49.

Your code **{code}** ends tomorrow, {expiry_date}.

**[CUSTOMER QUOTE, to collect — one named, consented agent describing one specific listing kit. Spec in offer.md. If none exists at launch, replace this block with:]** "If anything in your video isn't in your photos, we redo it or refund it. Your first payment has a 30-day money-back guarantee."

**{buy_link}**

— Tayo

---

## Segmentation plan
| Segment | Defined by | What they get differently |
|---|---|---|
| Buyers' agents | Q1 = "I mostly work with buyers" | They self-excluded. Skip emails 2, 4, 5, 6. Monthly email only. No discount code |
| Light listers | Q1 = 2–5 | Email 2/4 bold line: "$49 when you have a listing, nothing when you don't." Pitch: Listing Kit only |
| Regular listers | Q1 = 6–15 | Same sequence; Welcome 2 adds "most months you'll have one — still cheaper per listing than any plan until 4+ a month" |
| Heavy / team | Q1 = 16+ or "team" | Email 5 swaps the $29 code for: "First Team month — if it's not for you in 30 days, full refund" (same guarantee, no discount) + offer of a 15-minute setup call. Right-person template from offer.md |
| Free-kit users | Kit created, no payment | Variant copy in email 2; email 1 replaced by delivery email |
| Paid customers | Any payment | Removed from the sales sequence immediately. Lifecycle only: kit delivered, status re-cut reminders, renewal reminder (Team), monthly email |

Provider data used: acquisition campaign (UTM), metro (form), open frequency (re-engagement after 3 unopened monthly emails: one "still want this?" email, then suppress).

## Shadow newsletter tracks (weekly, start day 21, then merge into the monthly email)
| Track (Q2 challenge) | Issues | Titles | Merge point |
|---|---|---|---|
| "Looks like everyone else's" | 5 | 1. The opening shot that lasts in your city · 2. Plain beats fancy: why long-running ads are simple · 3. Three hooks from {metro}'s kept ads, rewritten for your next listing · 4. Captions that read on mute · 5. How to tell a kept ad from a boosted post | Monthly email after issue 5 |
| "AI will change the house" | 5 | 1. What "virtually enhanced" has to mean on your MLS · 2. AB 723 in plain English (CA) · 3. The 20-second check before you post any AI clip · 4. Motion vs generation: what's safe · 5. Keeping originals: a folder system | Monthly |
| "No time" | 5 | 1. A 10-minute listing launch routine · 2. Which photos to send first · 3. Status re-cuts in one tap · 4. Batch a month of listings in an hour · 5. What to delegate to a coordinator | Monthly |
| "Paying a videographer" | 5 | 1. When a videographer is still worth it · 2. Per-listing math: $49 vs $400 · 3. Mixing real footage with photo motion · 4. What to ask your photographer for · 5. Licensing: who owns your listing photos | Monthly |
| "Clicks, not conversations" | 5 | 1. Housing special ad category: what you can and can't target · 2. Why creative is the lever left · 3. Lead form vs landing page for listing ads · 4. Reading your ad results in 5 minutes · 5. When done-for-you makes sense ($149/listing) | Monthly |

"Other" answers: read manually weekly; route to the closest track.

## Metrics baseline & targets
| Metric | Current | Target (UNSOURCED until 60 days of our own data) | If it moves wrong, check |
|---|---|---|---|
| Open rate | UNKNOWN — not launched | 40–55% sequence; 30–40% monthly | Subject line, sender name "Tayo at ListingProof", the "reply yes" ask, send time |
| CTR | UNKNOWN | 5–10% on emails 2–4 | One link per email, link text that says what happens next, segment match |
| Conversion (email → paid kit) | UNKNOWN | 2–5% of report subscribers by day 15 | Landing page matches email promise; code works; checkout shows $29 |
| Bounce | UNKNOWN | <2% | Typo'd emails from the form (add inline validation); no attachments |
| Unsubscribe | UNKNOWN | <0.5% per email | Expectations in email 1 kept? Buyers' agents getting sales emails (segment bug)? |

## Assumptions & Unknowns
- Email tool not chosen; needs custom fields (metro, Q1–Q3), one-time codes and Typeform hand-off. Kit (formerly ConvertKit) fits; verify current features before buying.
- "In most markets we've pulled, the ads that last open on…" in Email 1 is a **placeholder observation**: confirm from our first 5 metro pulls before sending; rewrite if the data says otherwise.
- "Three to five hours per listing" (Email 2) is UNSOURCED; replace with survey Q4 language or cut. The $300–750 range is sourced (VideoTour landing page, quoted in the teardown).
- The $2,500 MLS fine is a Reddit report (reviews deep-dive), not a verified rule; email 3 attributes it as such.
- Paid customers must be removed from the sequence on purchase (automation dependency).
