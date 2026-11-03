# PromptNerdyToMe — Business Systems

What has to exist to run this as a business, and why. Ordered by when you need it.
**Must** = before taking money; **Next** = in the first 90 days; **Later** = at scale.

## 1. Money in: accounts, credits, billing (Must)
| System | Why |
|---|---|
| User accounts (email + Google/Apple sign-in) | Credits, history, abuse limits and refunds all hang off an account. Today there are none: only a shared passcode |
| Credit ledger (database, append-only) | Each generation costs real GPU money. Debit **before** the job, refund automatically if it fails. An append-only ledger stops "free credits" bugs and settles disputes |
| Stripe subscriptions + credit packs, Customer Portal | Recurring revenue, upgrades and cancellations without support tickets. The webhook adds credits; never trust the browser |
| Pricing engine: credits per app from measured GPU seconds | Margin is set per app (see unit-economics.md). When a model or GPU changes, credits change in one place |
| Tax (Stripe Tax) | Digital services are taxed in many US states, the EU and the UK |

## 2. Cost control: the GPU is the business (Must)
| System | Why |
|---|---|
| Job queue (one queue per model or app family) | Batches users on a warm GPU instead of reloading models per user. This is the biggest margin lever |
| Per-user and global limits (concurrency, daily spend cap, max video length) | One user or bot can't run up a four-figure GPU bill overnight |
| Cost metering per job (GPU type × seconds, logged to the ledger) | Shows real margin per app and per user. Drop apps that lose money |
| Budget alerts on Modal and Railway | You find a runaway bill in an hour, not at month end |
| Free-tier rules (watermark, image-only, sign-up before video, device/IP limits) | Free usage is the biggest silent cost (~$0.50 per free user) |

## 3. Trust and safety: required for face and person tools (Must)
| System | Why |
|---|---|
| Terms of Service, acceptable-use policy, privacy policy | Legal basis to remove content and ban users; required by Stripe and the app stores |
| Consent rule for face swap, character swap, AI influencer, lip sync | These tools can make deepfakes of real people. Require users to confirm rights to the face; block public figures and minors |
| Automatic moderation (prompt filter + output classifier for nudity and violence) | Non-consensual intimate imagery and child safety violations are illegal and kill payment processing |
| Takedown process (report button, inbox, 48-hour removal, logs) | US TAKE IT DOWN Act requires removal of reported intimate deepfakes within 48 hours; DMCA for copyright |
| Provenance: visible watermark on free outputs + C2PA / metadata label | Marks AI content (EU AI Act transparency duties; platform rules on TikTok/Meta) and is your growth loop |
| Model-license register | Some open-weights models restrict commercial use. Know which apps you can charge for |

## 4. Product reliability (Must → Next)
| System | Why |
|---|---|
| Error tracking (Sentry) + uptime checks | You learn about failures before users tweet about them |
| Job status, retries, automatic credit refunds | Generations take 1–6 minutes; failures must be handled without support tickets |
| Output storage (object storage + CDN, e.g. Cloudflare R2) with retention rules | Videos are 10–50 MB each. Keep free-tier outputs 30 days, paid longer |
| Staging environment | Test new models and apps before they reach paying users |
| Backups of the database (accounts, ledger) | The ledger is the money record |

## 5. Growth engine: the Higgsfield playbook (Next)
| System | Why |
|---|---|
| "Made with PromptNerdyToMe" watermark + share links | Each output posted is a free ad; Higgsfield's top "made with" posts reached 230M plays |
| Creator affiliate program (codes, 20–30% rev share, dashboard) | How Higgsfield scaled (#higgsfieldpartner); pay for results, not ads |
| Named presets and templates, released weekly | Viral formats ("earth zoom out") drive search spikes; ship them fast when a trend starts |
| Model-launch promos ("unlimited week on new model X") | Rides each model's hype cycle |
| Analytics (PostHog or similar): signup → first generation → paid funnel, per-app usage | Data to choose the focus use case (AI influencer vs UGC ads), which was the plan |
| Lifecycle email (welcome, credits low, win-back) | Cheap retention; churn is the LTV killer |
| SEO pages per app and use case ("ai influencer generator", "ai ugc ads") | Searches for these are growing; every app is a landing page |

## 6. Operations and support (Next)
| System | Why |
|---|---|
| Help desk + in-app chat (with AI first reply) | Refund and "my video failed" questions will come daily |
| Admin console: user lookup, credit adjust, ban, refund, job replay | Support without touching the database by hand |
| Status page | Model or GPU outages happen; say so publicly |
| Weekly metrics review | Revenue, GPU cost, gross margin per app, CAC, churn, free→paid |

## 7. Company and finance (Must → Next)
| System | Why |
|---|---|
| Company entity + business bank account | Liability for user-generated content; Stripe payouts |
| Bookkeeping that splits COGS (GPU, storage, payment fees) from opex | Gross margin is the number investors and you steer by |
| Insurance (tech E&O / cyber) | User content and data liability |
| Trademark search for "PromptNerdyToMe" | Before spending on the brand |

## 8. Later (at scale)
- **Warm GPU pool and autoscaling** by queue depth.
- **Multiple GPU providers.**
- **A/B pricing.**
- **SOC 2,** if selling to businesses (UGC ads for brands).
- **Team plans** with shared credits.
- **API for developers:** "higgsfield api" / "mcp" searches are rising.

## Build order (shortest path to revenue)
1. Accounts + credit ledger + Stripe (Section 1)
2. Job queue, limits, cost metering (Section 2)
3. Terms, consent, moderation, takedown (Section 3)
4. Watermark + affiliate + analytics (Section 5)
5. Cut the catalog to the 10–20 apps the data says people want
