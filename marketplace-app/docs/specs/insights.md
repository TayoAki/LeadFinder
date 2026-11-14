# Spec: Shelby Insights (our own funnels, retention and shopper timelines)

Status: ready-for-agent · Process: `to-spec` → `tdd` → `code-review` (skills vendored from mattpocock/skills)

## Problem Statement

Shelby already records every shopper action in its own `events` table and shows totals in the admin Analytics tab. The team cannot answer the questions that decide what to build next:
- Where in the path from browsing to buying do shoppers drop off, and does that differ by platform or campaign?
- Do shoppers come back after their first visit?
- What did one particular shopper actually do?

PostHog answers these questions, but it needs an external account. Its self-hosted version is too heavy for us. We want the same answers inside Shelby, built on data we already own.

## Solution

Add an **Insights** area to the admin Analytics tab with three tools.

- **Funnels.** An admin picks two to six steps from the events Shelby records (for example: viewed a product → added to cart → started checkout → placed an order). Shelby shows:
  - how many shoppers reached each step, in that order, within a conversion window;
  - the conversion rate from the previous step and from the start;
  - the median time between steps;
  - how many dropped off at each step;
  - optionally, a breakdown by platform or campaign source.
- **Retention.** Shoppers are grouped into cohorts by the day or week they were first seen. Shelby shows what share of each cohort came back and did something (or a chosen event) in each later period, as a heatmap table.
- **People and timelines.** A list of shoppers (anonymous ids), with first seen, last seen, sessions, actions, orders and spend. Opening one shows their whole history, grouped into sessions, newest first.

## User Stories

1. As a platform admin, I want to build a funnel from the events Shelby records, so that I can see where shoppers drop off.
2. As a platform admin, I want funnel steps counted only in order, so that someone who bought first and browsed later does not count as converting.
3. As a platform admin, I want a conversion window (1 hour, 1 day, 7 days, 30 days), so that a purchase weeks after a product view does not inflate the funnel.
4. As a platform admin, I want the conversion rate from the previous step and from the first step, so that I can spot the weakest link.
5. As a platform admin, I want the median time between steps, so that I know whether checkout is slow or just abandoned.
6. As a platform admin, I want to break a funnel down by platform (web, iOS, Android), so that I can find platform-specific problems.
7. As a platform admin, I want to break a funnel down by campaign source (`utm_source` or referral), so that I can see which channels bring buyers rather than browsers.
8. As a platform admin, I want ready-made funnels (shopping, onboarding, Ask Shelby to cart), so that I get answers without configuring anything.
9. As a platform admin, I want to pick a date range (today, 7, 30, 90 days), so that I can compare periods.
10. As a platform admin, I want a retention table by first-seen day or week, so that I can see whether shoppers come back.
11. As a platform admin, I want to choose the return event (any action, or a specific one such as placed an order), so that I can measure repeat purchases as well as repeat visits.
12. As a platform admin, I want retention cells shaded by percentage, so that I can read the table at a glance.
13. As a platform admin, I want a list of shoppers with first seen, last seen, sessions, actions, orders and spend, so that I can find interesting shoppers.
14. As a platform admin, I want to filter the shopper list to those who did a specific event (for example, abandoned checkout), so that I can study a segment.
15. As a platform admin, I want to open one shopper and see their actions grouped into sessions with timestamps, screens and details, so that I can understand their journey.
16. As a platform admin, I want to jump from a funnel's drop-off count to the people who dropped off, so that I can see why they left.
17. As a platform admin, I want seller-dashboard activity kept out of shopper insights, so that the numbers describe shoppers only.
18. As a platform admin, I want insights to stay fast as events grow, so that the page stays usable at hundreds of thousands of events.
19. As a shopper, I want nothing identifying collected about me, so that my privacy is respected (ids stay anonymous; emails never stored).

## Implementation Decisions

- **New deep module `insights`** on the server. Its interface takes a database handle and plain options, and returns plain data. It has no HTTP or UI knowledge:
  - `funnel(db, { steps, from, to, windowMs, breakdown? })`. Each step is an event name. The result is `{ steps: [{ name, people, fromPrev, fromStart, medianMsFromPrev, dropped }], breakdown?: [{ key, steps: [...] }] }`.
  - `retention(db, { from, to, period: 'day' | 'week', periods, returnEvent? })`. The result is `{ cohorts: [{ start, size, values: [count per period index 0..periods-1] }] }`. Period 0 is the first-seen period, so it equals the cohort size.
  - `people(db, { from, to, did?, limit })` returns `[{ anon, firstSeen, lastSeen, sessions, events, orders, spend, platform, lastPath }]`, sorted by `lastSeen` descending.
  - `timeline(db, anon, { limit })` returns `{ summary, sessions: [{ id, start, end, events: [{ ts, name, path, props }] }] }`, newest session first.
  - `dropoffs(db, funnelOptions, stepIndex)` returns the anon ids that reached step `stepIndex - 1` but not `stepIndex`.
- **Funnel semantics, matching PostHog's "sequential" funnel:**
  - Every occurrence of step 1 inside the range can start an attempt. A shopper is credited with their furthest attempt; on a tie, the earliest one wins. So a shopper who browsed last week and bought today, after viewing again, still converts within a 1-day window.
  - Each later step must occur after the previous step's matched time, and within `windowMs` of the step 1 time.
  - Each shopper counts at most once per step.
  - Breakdown value is the platform column, or a property read from the step 1 event.
- **"First seen"** for retention is the earliest event of that shopper in the whole table, not just the range. That keeps cohorts stable as the range moves.
- **Only shopper events count.** Seller-dashboard events and events without an anonymous id are excluded everywhere.
- **Spend** is the sum of `total` on `order_confirmed` events (server truth), falling back to `order_placed` when no confirmation exists.
- **Querying:**
  - SQL narrows the data (by range, source and event names) and orders it by shopper and time.
  - The sequential matching runs in one pass in JS. That's simple and correct, and fast enough at our scale (indexes `events_ts` and `events_name_ts` exist).
  - Add an `(anon, ts)` index for timelines.
- **New admin endpoints** (cookie auth and admin role, like the existing admin routes): `GET /api/admin/insights/funnel`, `/retention`, `/people`, `/people/:anon`.
- **Admin UI:** the seller dashboard's Analytics tab gets sub-tabs: Overview (existing), Funnels, Retention and People. The funnel builder offers event names from what has actually been recorded.

## Testing Decisions

- **One seam:** the `insights` module's interface, exercised against a real in-memory SQLite database built from the production schema.
  - **Catches:** every counting rule (ordering, windows, de-duplication, cohorts, spend, session grouping).
  - **Misses:** HTTP wiring and the UI. These are covered by one end-to-end browser run, not unit tests.
- Fixtures are small hand-written event histories with known answers worked out on paper. Tests never recompute expected values the way the code does.
- Tests go through the public functions only. Nothing reads internal helpers.
- Runner: `node --test` (built in, no new dependency). The command is `npm test`.
- Prior art: none in this app. Keepwatch's `test/*.test.mjs` uses the same `node:test` style.

## Out of Scope

- Session replay, heatmaps, feature flags and A/B testing.
- Linking an anonymous id to a signed-in account across devices (identity merge).
- Paths/Sankey diagrams. The data supports them, but they come later.
- Exporting insights or scheduling email reports.

## Further Notes

- PostHog stays optional. If `POSTHOG_KEY` is set, the same events still go there, and Shelby Insights keeps working regardless.
- If event volume outgrows SQLite, the module's interface stays the same and only its implementation moves, for example to Postgres or ClickHouse.
