# App Builder: niche decision (10 Nov 2026)

**Recommendation: sell App Builder to solo founders who build subscription apps with AI. Bring them in with a free App Store screenshot + keyword kit that works on any app.** E-commerce stays a template, not the niche.

Artifacts: [idea.md](idea.md) · [validation.md](validation.md) · [differentiators.md](differentiators.md) · [angles.md](angles.md) · [uvp.md](uvp.md) · [offer.md](offer.md) · [_run.md](_run.md) (gates + coherence audit)
Research: [demand-keywords.md](demand-keywords.md) ([us.tsv](us.tsv), [global.tsv](global.tsv)) · [competitors-and-rules.md](competitors-and-rules.md) · [small-shopify-stores.md](small-shopify-stores.md)

## Why this niche (score 23/30; runner-up 21)
- **Demand 8.5/10**, the highest of six niches. About **7,200 US searches/mo** for screenshots, ASO, publishing, paywalls and onboarding.
- **Growing:** "revenuecat" 18,100/mo (+147%); "app store screenshot generator" 590 (+69%); "how to publish an app on app store" 590 (+103%).
- **People pay:** ~49 Upwork posts in ~55 days for ASO, publishing, Lovable/Replit-to-store, screenshots and paywalls (a lower bound; budgets unverified). Builders charge $19–200+/mo.
- **Market:** ~14,700 new subscription apps per month (RevenueCat, Jan 2026). App Store submissions +84% YoY.
- **Fit:** paywall, onboarding, keywords and screenshots already exist in the product.
- **Founder fit:** Tayo ships Weight Class, a live calorie and GLP-1 subscription app.
- **Against:** generic "ai mobile app builder" is down 49%. New apps earn little (2025+ apps take 3% of revenue). E-commerce scored 3/10: ~600–800 searches/mo and falling, 5 owner asks in 12 months, and Cabano already sells AI Shopify → iOS at $50–100/mo.

Validation verdict: **AMBER**. The pain and the spending are real. But today buyers mostly hire a **person**, so the plan adds a done-with-you launch service.

## The differentiator (honest tier)
- **Today: NONE.** Live pages show Rork ("Catch App Store rejections early", "App Store screenshots in one click"), Superapp (metadata, screenshots, ASO, RevenueCat) and Newly ("Compliance Solved for you") already claim the "App-Store-ready" story. App Builder also lacks submission and a pre-flight, which rivals have.
- **Build target: POSITIONAL (about 6–9 months).** *App Builder checks every app against Apple's review rules and against your own other apps before you submit, so a look-alike or a missing paywall term doesn't cost you a rejection or your developer account.* No fetched rival mentions guideline 4.3 or your own portfolio. Credit-per-generation rivals are slow to refuse clone volume.
- **Supporting proof:** Tayo's live app. No numbers are claimed.

## Lead angle: "Check before Apple does" (Stage 3 market → mechanism)
1. "Check your app against Apple's rules before Apple does."
2. "Apple can now remove developers who keep submitting look-alike apps. Check yours before you submit."
3. "Your app works. Now get it through review the first time." (an aim, not a guarantee)

**Use these only once pre-flight ships.** Until then, lead with what is true today: "Free App Store screenshots and keywords. For any app, built with any tool."

UVP (one line): *I help solo founders who build subscription apps with AI get them through App Store review and found in search, so they can start earning from the app instead of fixing rejections.*

## Offer and prices (proposal; confirm current paid tiers first)
| Tier | Price | Key contents |
|---|---|---|
| Free kit | $0 | Screenshot + keyword generator for any app; rejection checklist |
| Free builder | $0 | 100 starting credits (exists) |
| Maker | $20/mo | 100 credits/mo, listing kit, paywall + onboarding |
| Pro | $50/mo | 300 credits/mo, pre-flight + 4.3 check on up to 3 apps |
| Studio | $150/mo | 1,000 credits/mo, look-alike check across all your apps (vs Rork Max $200/1,000) |
| Launch with Tayo | $299/app, 4 slots/mo | 45-min session, manual pre-flight, paywall check, listing kit, submit from your own account; free fix and resubmit if rejected for a checklist item |

Unit economics: the service earns ~$85/h. SaaS margin is **UNSOURCED** (AI cost per credit, EAS costs). Rivals' prices: Rork $20/100 credits, Max $200+; Vibecode $20–200; Anything $19–199; Superapp $25–100; Newly from $25.

## 30-day validation plan (Tayo runs it; nothing has been posted or sent)
1. **Week 1:** ship the free screenshot + keyword generator page (email to download, short survey after). Publish the "rejection checklist for AI-built apps" page.
2. **Week 2:** Tayo posts once as himself in r/AppBusiness (35K weekly active) and r/indiehackers (self-promo slot). Answer rejection threads in r/vibecoding (362K weekly active) without links where rules forbid them. Skip r/reactnative (no self-promo).
3. **Weeks 2–3:** 30-for-30 with the 8 public posters listed in validation.md, if Tayo approves. Free manual pre-flight in exchange for 30 minutes.
4. **Week 3:** put up the $299 "Launch with Tayo" page with a booking link.
5. **Week 4:** re-check Upwork demand (read only). Score against the thresholds: GREEN at ≥300 kit uses, ≥25% email capture, ≥6/10 calls naming review/listing/paywall, ≥2 paid bookings. RED at <100 uses, ≤2/10 calls, 0 bookings.

## What to build next (in order)
1. **Submission from the user's own App Store Connect account** (4.2.6), or a clean hand-off to Expo Launch / EAS Submit. This closes the biggest deficit.
2. **Pre-flight v1:** checks mapped to 2.1 (crash, placeholder text, demo login), 3.1.1/3.1.2 (IAP, price, period, restore, terms), 4.8 (Sign in with Apple), 5.1.1 (account deletion, privacy links), iPad layout, secret keys in the bundle.
3. **4.3 distinct-by-design check:** similarity of screens, metadata and icon vs the user's own apps, plus a warning on Apple's named saturated categories. Frame it as quality, never as getting past review.
4. **Standalone free kit page** that accepts screens from any builder.
5. **Proof:** run Weight Class's own listing or paywall through App Builder and show it honestly.

## What NOT to do
- **Don't lead with e-commerce.** Keep a store-app template inside Maker/Pro. Don't adopt the $79/mo Shopify offer.
- **Don't publish "App-Store-ready" or the 4.3 claim** before the features ship. Rivals already own "App-Store-ready."
- Don't promise approval, approval rates or timing. Apple decides.
- Don't build "ship 20 apps fast" features. That is what Apple's June 2026 4.3 change targets.
- Don't submit apps from App Builder's own account (4.2.6). Don't supply fake Android testers.
- Don't fight on the generic "ai app builder" term (CPC $34.62, Base44/Replit/Anything own the top 10).
- Don't invent testimonials, user counts or Weight Class figures. Collect real testimonials from launch-service clients using the spec in offer.md.

**Top risk:** rivals (Rork, Superapp, Newly) add a 4.3 / portfolio check within months, and most new subscription apps earn too little for their makers to keep paying. The service rung and fast shipping of pre-flight are the hedges.
