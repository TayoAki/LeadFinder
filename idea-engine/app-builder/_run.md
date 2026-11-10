# Run: App Builder (Tayo), 2026-11-10

Mode: **Partial** (stages 1, 2, differentiate, angles, 3, 9). Upstream inputs: the three research files in this folder. Missing upstream inputs: Tayo's audience size, inbound-advice history, paid tier prices, and credit cost. Each is declared in the downstream Assumptions blocks.

| # | Stage | Skill | Self-score /20 | Gate | Notes |
|---|---|---|---:|---|---|
| 0 | Applicability | cmba-uvp Step 0 | — | **APPLIES 4/4** | Founder-led, direct web channel |
| 1 | Idea | cmba-idea | 16 | **PASS** (chain + 23/30 score, spread 6) | Two harvest sources are INFERRED; inbound advice UNKNOWN |
| 2 | Validation | cmba-validate | 16 | **PASS: AMBER with stated pivot** (add a done-with-you launch service) | Not GREEN: buyers hire humans today; no interviews yet |
| — | Differentiate | cmba-differentiate | 17 | Verdict **NONE today → POSITIONAL target** | Fetched 6 rivals. "App-Store-ready" turned out to be SHARED |
| — | Angles | positioning-angles | — | Lead angle chosen, gated on shipping | Stage 3 market |
| 3 | UVP | cmba-uvp | 15 | **PASS** (self-exclusion names 6 groups) | Full version gated on pre-flight shipping; today version provided |
| 9 | Offer | cmba-offer | 15 | **PASS** (small/mid + niche → service rung) | Credit COGS UNSOURCED |

Halted at: completed (stages in scope).
Weakest artifacts: **offer.md** (paid tiers and credit costs unknown, all volumes assumed) and **uvp.md** (objections are hypotheses; the load-bearing clause depends on an unbuilt feature).

treg spend this run: $7.06 → $7.05 (7 subreddit-detail calls, about $0.013). Web fetches: 9 competitor pages, free. Nobody was contacted; nothing was posted or signed up for.

## Coherence audit (cmba-run seam table)

| # | Seam | Finding | Severity | Resolution |
|---|---|---|---|---|
| 1 | validate ↔ idea | idea kill condition said "none of 10" interviews; validation RED threshold said "≤2 of 10" | Medium | Fixed: idea.md now says "2 or fewer of 10" |
| 2 | differentiate ↔ earlier research (temporal) | demand-keywords.md §7 claimed screenshots/keywords and paywall/onboarding as "Proprietary advantage: YES". Live pages show Rork, Newly and Superapp claim them | **High** | Stamped **SUPERSEDED** in place in demand-keywords.md (two pillars) |
| 3 | differentiate ↔ earlier research (temporal) | competitors-and-rules.md said Rork has "no screenshot or ASO tooling" and called the last mile "Open but fragmented" | **High** | Stamped **SUPERSEDED / PARTLY SUPERSEDED** in place |
| 4 | angles ↔ evidence | Headline "Apple now removes developers for look-alike apps" overstated Apple's "may lead to removal" | Medium | Fixed: "Apple can now remove developers who keep submitting look-alike apps" |
| 5 | uvp ↔ differentiators | LinkedIn tagline said "App-Store-ready", a category claim, and implied a pre-flight that isn't built | Medium | Fixed: tagline lists only shipped features |
| 6 | offer ↔ differentiators | Maker tier listed "hand-off to submit", which is deficit #1 (not built) | Medium | Fixed: marked "not built yet" |
| 7 | offer ↔ voice rules | Fascination promised a line that "turns a rejection into an approval" (hype, implies a guarantee) | Low | Fixed: plain wording |
| 8 | uvp ↔ offer (audience) | uvp self-excludes "app-factory operators who want 20 near-identical apps"; offer has a Studio tier for founders with several apps | Low | Consistent: Studio is for several **distinct** apps; the look-alike check is the line. No change |
| 9 | angles/uvp ↔ differentiators | Lead angle and full UVP rest on a POSITIONAL feature not yet built | **High if published early** | Resolved by a gate written into differentiators.md, angles.md and uvp.md: today's messaging uses only the free kit + paywall + founder proof; switch when pre-flight and submission ship |
| 10 | any downstream ↔ idea (audience) | idea: "indie and subscription app makers"; uvp: "solo founders shipping a subscription app with AI"; offer: same | — | Consistent (uvp narrows, does not invent) |
| 11 | all artifacts (sourcing) | Ladder volumes, validation thresholds, credit COGS, "10 minutes" listing time | — | Tagged assumption / judgement / UNSOURCED / "check before publishing" |
| 12 | e-commerce | small-shopify-stores.md proposes a $79/mo Shopify offer; this run does not adopt it | Low | Recorded in offer.md and README as "not adopted; template only". Not stamped SUPERSEDED: the research was not refuted, only deprioritised |

Unresolved high-severity contradictions: **none**.
Added seam for future runs: **"live competitor copy ↔ claims of 'proprietary'"**. Rivals' homepages moved within weeks; re-fetch before reusing any OURS claim.
