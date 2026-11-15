#!/usr/bin/env node
// Fan overlap: "if someone loves A, they probably love B, and are people leaving B?"
// From public Google Maps reviews, via Apify actors:
//   1. compass/crawler-google-places           find brand A's place (id, category, review count)
//   2. compass/google-maps-reviews-scraper     A's newest reviews (reviewer ids, held in memory only)
//   3. johnvc/google-maps-contributor-reviews-api   each reviewer's public review history (capped)
//   4. aggregate: businesses A's reviewers also reviewed, weighted for popularity, competitors removed
//   5. compass/crawler-google-places + reviews scraper for the top B's: popularity, rating trend and
//      "leaving" language in their recent reviews
// PRIVACY: reviewer ids, names and profile links are never written to disk; only per-business
// totals are saved, and a business needs >= MIN_SHARED reviewers to appear. Apify datasets are
// deleted after reading.
//
// Usage:
//   APIFY_TOKEN=... node fan_overlap.mjs --place "Crumbl Wicker Park Chicago" [--reviews 200] [--per-reviewer 50]
//                                        [--top 15] [--cap-usd 30] [--out ./fan-overlap/<slug>] [--dry-run]
// APIFY_TOKEN may be a dummy value when the session's network proxy injects the real key.
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const args = Object.fromEntries(process.argv.slice(2).reduce((a, x, i, all) => (x.startsWith('--') ? [...a, [x.slice(2), all[i + 1] && !all[i + 1].startsWith('--') ? all[i + 1] : true]] : a), []));
const PLACE = args.place, N_REVIEWS = Number(args.reviews || 200), PER = Number(args['per-reviewer'] || 50), TOP = Number(args.top || 15);
const CAP = Number(args['cap-usd'] || 30), MIN_SHARED = Number(args['min-shared'] || 3), DRY = !!args['dry-run'];
if (!PLACE) { console.error('usage: node fan_overlap.mjs --place "<business name and city, or a Google Maps URL>"'); process.exit(2); }
const slug = String(PLACE).toLowerCase().replace(/https?:\/\/\S+/, 'place').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 60);
const OUT = resolve(args.out || `fan-overlap/${slug}`);
const TOKEN = process.env.APIFY_TOKEN || 'proxy-injected';
// Free-tier prices (USD) from each actor's pricing page, used for the spend cap.
const PRICE = { place: 0.004, review: 0.0006, contributorReview: 0.0015, run: 0.001 };
let spent = 0;
const budget = (usd, what) => { if (spent + usd > CAP) throw new Error(`Stopping before ${what}: it would take spend to $${(spent + usd).toFixed(2)}, over the $${CAP} cap.`); };

async function apify(actor, input, estimate, { timeoutSecs = 1800, allowPartial = false } = {}) {
  budget(estimate, actor);
  if (DRY) { console.log(`[dry-run] would run ${actor} (~$${estimate.toFixed(2)})`, JSON.stringify(input).slice(0, 200)); return []; }
  const H = { 'content-type': 'application/json', authorization: `Bearer ${TOKEN}` };
  const api = async (path, opts = {}) => { const r = await fetch(`https://api.apify.com/v2${path}`, { headers: H, signal: AbortSignal.timeout(120000), ...opts });
    if (!r.ok) throw new Error(`${actor}: HTTP ${r.status} ${(await r.text()).slice(0, 300)}`); return r.status === 204 ? null : r.json(); };
  let run = (await api(`/acts/${actor.replace('/', '~')}/runs?waitForFinish=60&timeout=${timeoutSecs}`, { method: 'POST', body: JSON.stringify(input) })).data;
  while (!['SUCCEEDED', 'FAILED', 'ABORTED', 'TIMED-OUT'].includes(run.status)) run = (await api(`/actor-runs/${run.id}?waitForFinish=60`)).data;
  // A timed-out run still holds the items it finished: keep them when the caller can use partial data.
  if (run.status !== 'SUCCEEDED') {
    const partial = allowPartial ? await api(`/datasets/${run.defaultDatasetId}/items?format=json&clean=true`) : [];
    spent += Number(run.usageTotalUsd) || 0;
    await api(`/datasets/${run.defaultDatasetId}`, { method: 'DELETE' }).catch(() => {});
    if (!allowPartial) throw new Error(`${actor} run ${run.status}`);
    console.log(`• ${actor}: run ${run.status}, kept ${partial.length} partial items (total ~$${spent.toFixed(2)})`);
    return partial;
  }
  const items = await api(`/datasets/${run.defaultDatasetId}/items?format=json&clean=true`);
  const runCost = Number(run.usageTotalUsd) || estimate; spent += runCost;
  // Delete the run's dataset so scraped personal data does not sit on Apify.
  await api(`/datasets/${run.defaultDatasetId}`, { method: 'DELETE' }).catch(() => {});
  console.log(`• ${actor}: ${items.length} items, ~$${runCost.toFixed(3)} (total ~$${spent.toFixed(2)})`);
  return items;
}

const pick = (o, ...ks) => { for (const k of ks) { const v = k.split('.').reduce((x, p) => x?.[p], o); if (v !== undefined && v !== null && v !== '') return v; } return null; };
const placeKey = r => String(pick(r, 'place_info.data_id', 'place.data_id', 'data_id', 'place_info.place_id', 'place.place_id', 'placeId', 'place_id', 'place_info.title', 'place.title', 'title') || '');
const placeName = r => pick(r, 'place_info.title', 'place.title', 'place_title', 'title', 'name');
const placeAddr = r => pick(r, 'place_info.address', 'place.address', 'address');
const dateOf = r => { const d = pick(r, 'iso_date', 'date_iso', 'publishedAtDate', 'date'); const t = Date.parse(d); return Number.isFinite(t) ? new Date(t).toISOString().slice(0, 10) : null; };
const words = s => new Set(String(s || '').toLowerCase().split(/[^a-z]+/).filter(w => w.length > 3 && !['shop', 'store', 'restaurant', 'service', 'center'].includes(w)));
// Leaving language, same idea as Keepwatch Switchers.
const LEAVING = /\b(used to (love|be|come)|not (the same|what it used to)|went downhill|gone downhill|changed (the|their)|new (recipe|owner|management|menu)|won'?t be back|never (coming|going) back|last time|instead (go|went)|switch(ed|ing) to|go(ing)? (to|elsewhere)|disappoint\w*|declin\w*|worse|shrink\w*|smaller|overpriced|price(s)? (went|have gone) up)\b/i;

mkdirSync(OUT, { recursive: true });
const report = { brand_a: PLACE, built_at: new Date().toISOString(), settings: { reviews: N_REVIEWS, per_reviewer: PER, min_shared: MIN_SHARED, top: TOP }, privacy: 'Totals per business only. No reviewer ids, names or profile links are stored. Businesses with fewer than min_shared shared reviewers are not shown.' };
try {
  // 1. Brand A's place.
  const isUrl = /^https?:\/\//.test(PLACE);
  const places = await apify('compass/crawler-google-places', isUrl ? { startUrls: [{ url: PLACE }], maxCrawledPlacesPerSearch: 1, maxReviews: 0, maxImages: 0 } : { searchStringsArray: [PLACE], maxCrawledPlacesPerSearch: 1, maxReviews: 0, maxImages: 0 }, PRICE.place + PRICE.run);
  const A = places[0] || {};
  report.place_a = { name: A.title || PLACE, category: A.categoryName || null, address: A.address || null, reviews_total: A.reviewsCount ?? null, rating: A.totalScore ?? null, place_id: A.placeId || null, url: A.url || null };
  if (!A.placeId && !DRY) throw new Error(`Could not find "${PLACE}" on Google Maps. Try the full Google Maps URL.`);

  // 2. A's newest reviews (reviewer ids stay in memory).
  const reviews = await apify('compass/google-maps-reviews-scraper', { placeIds: [A.placeId].filter(Boolean), maxReviews: N_REVIEWS, reviewsSort: 'newest', personalData: true, language: 'en' }, N_REVIEWS * PRICE.review + PRICE.run);
  const reviewerIds = [...new Set(reviews.map(r => r.reviewerId).filter(Boolean))];
  report.coverage = { a_reviews_fetched: reviews.length, unique_reviewers: reviewerIds.length };

  // 3. Each reviewer's public history (capped). Estimate assumes the cap is reached.
  // Batches of 20 reviewers, 4 at a time, each with its own time limit; partial batches still count.
  budget(reviewerIds.length * PER * PRICE.contributorReview, 'reviewer histories');
  const batches = []; for (let i = 0; i < reviewerIds.length; i += 20) batches.push(reviewerIds.slice(i, i + 20));
  const history = [];
  for (let i = 0; i < batches.length; i += 4) {
    const got = await Promise.all(batches.slice(i, i + 4).map(b => apify('johnvc/google-maps-contributor-reviews-api', { contributorIds: b, maxResultsPerContributor: PER, hl: 'en' }, 0, { timeoutSecs: 1800, allowPartial: true })
      .catch(e => { console.log('  batch failed:', e.message); return []; })));
    for (const g of got) history.push(...g);
    if (spent > CAP) { console.log('  stopping histories: spend cap reached'); break; }
  }
  // 4. Aggregate: distinct reviewers per business (ids used only to de-duplicate, then dropped).
  const byPlace = new Map(); const reachable = new Set();
  for (const r of history) {
    const who = pick(r, 'contributor_id', 'contributorId'); const key = placeKey(r);
    if (!who || !key) continue; reachable.add(who);
    if (A.placeId && (key === A.placeId || placeName(r) === A.title)) continue;
    const p = byPlace.get(key) || { name: placeName(r), address: placeAddr(r), reviewers: new Set(), ratings: [], dates: [] };
    if (!p.reviewers.has(who)) { p.reviewers.add(who); const rt = Number(pick(r, 'rating')); if (rt) p.ratings.push(rt); const d = dateOf(r); if (d) p.dates.push(d); }
    byPlace.set(key, p);
  }
  report.coverage.histories_reachable = reachable.size; report.coverage.history_reviews = history.length;
  let shared = [...byPlace.entries()].map(([key, p]) => ({ key, name: p.name, address: p.address, shared: p.reviewers.size, avg_rating_from_a_fans: p.ratings.length ? Math.round(10 * p.ratings.reduce((a, b) => a + b, 0) / p.ratings.length) / 10 : null, last_review: p.dates.sort().slice(-1)[0] || null }))
    .filter(p => p.shared >= MIN_SHARED).sort((a, b) => b.shared - a.shared);
  byPlace.clear(); reviewerIds.length = 0; // drop ids

  // 5. Popularity + category for the candidates, then lift and competitor filter.
  const cands = shared.slice(0, Math.max(TOP * 3, 30));
  const details = cands.length ? await apify('compass/crawler-google-places', { searchStringsArray: cands.map(c => [c.name, c.address].filter(Boolean).join(', ')), maxCrawledPlacesPerSearch: 1, maxReviews: 0, maxImages: 0 }, cands.length * PRICE.place + PRICE.run) : [];
  const det = new Map(details.map(d => [String(d.searchString || '').split(',')[0].trim().toLowerCase(), d]));
  const aWords = words(A.categoryName);
  for (const c of cands) {
    const d = det.get(String(c.name || '').toLowerCase()) || details.find(x => x.title === c.name) || {};
    Object.assign(c, { category: d.categoryName || null, reviews_total: d.reviewsCount ?? null, rating: d.totalScore ?? null, url: d.url || null, place_id: d.placeId || null });
    c.competitor = !!(c.category && [...words(c.category)].some(w => aWords.has(w)));
  }
  // Lift: share of A's fans who reviewed B, against how popular B is overall (more reviews =
  // more likely to be reviewed by anyone). Reported relative to the median candidate (1.0 = typical).
  const rate = c => c.reviews_total ? c.shared / Math.sqrt(c.reviews_total) : null;
  const med = (xs => xs.length ? xs[Math.floor(xs.length / 2)] : null)(cands.map(rate).filter(x => x != null).sort((a, b) => a - b));
  for (const c of cands) c.lift = med && rate(c) != null ? Math.round(100 * rate(c) / med) / 100 : null;
  const brandB = cands.filter(c => !c.competitor).sort((a, b) => (b.lift ?? 0) * Math.log2(1 + b.shared) - (a.lift ?? 0) * Math.log2(1 + a.shared)).slice(0, TOP);

  // 6. Are people leaving B? Newest reviews: rating trend (last 90 days vs before) + leaving language.
  const ids = brandB.map(b => b.place_id).filter(Boolean);
  const bReviews = ids.length ? await apify('compass/google-maps-reviews-scraper', { placeIds: ids, maxReviews: 60, reviewsSort: 'newest', personalData: false, language: 'en' }, ids.length * 60 * PRICE.review + PRICE.run) : [];
  const now = Date.now();
  for (const b of brandB) {
    const rs = bReviews.filter(r => r.placeId === b.place_id);
    const recent = rs.filter(r => now - Date.parse(r.publishedAtDate) < 90 * 864e5), older = rs.filter(r => now - Date.parse(r.publishedAtDate) >= 90 * 864e5);
    const avg = xs => xs.length ? Math.round(100 * xs.reduce((a, r) => a + (r.stars || 0), 0) / xs.length) / 100 : null;
    const leaving = rs.filter(r => (r.stars || 5) <= 3 && LEAVING.test(r.text || ''));
    b.switching = { reviews_checked: rs.length, avg_last_90d: avg(recent), avg_before: avg(older), rating_change: avg(recent) != null && avg(older) != null ? Math.round(100 * (avg(recent) - avg(older))) / 100 : null,
      leaving_mentions: leaving.length, quotes: leaving.slice(0, 3).map(r => ({ quote: String(r.text).slice(0, 240), stars: r.stars, date: String(r.publishedAtDate).slice(0, 10), url: r.reviewUrl || null })) };
    const drop = b.switching.rating_change ?? 0;
    b.switching.verdict = (leaving.length >= 4 || drop <= -0.4) ? 'people are leaving' : (leaving.length >= 2 || drop <= -0.2) ? 'some leaving' : 'steady';
  }
  report.brand_b = brandB; report.competitors_removed = cands.filter(c => c.competitor).map(c => ({ name: c.name, category: c.category, shared: c.shared }));
  report.all_shared = shared.map(({ key, ...s }) => s);
} catch (e) { report.error = e.message; console.error('Stopped:', e.message); }
report.spend_usd = Math.round(spent * 100) / 100;
writeFileSync(`${OUT}/overlap.json`, JSON.stringify(report, null, 1));
const fans = report.coverage?.histories_reachable ?? 0;
const md = [`# If someone loves ${report.place_a?.name || PLACE}…`, '', `${report.place_a?.category || ''} · ${report.place_a?.address || ''}`, '',
  `From ${report.coverage?.a_reviews_fetched ?? 0} recent Google reviews by ${report.coverage?.unique_reviewers ?? 0} people; ${fans} had public review histories. Lift 1.0 = a typical nearby business; higher = A's fans favour it more than its popularity explains. Totals only, no reviewer data kept.`, '',
  '| They probably also love | Category | Shared fans | Lift | Are people leaving it? | Rating last 90d vs before |', '|---|---|---|---|---|---|',
  ...(report.brand_b || []).map(b => `| ${b.name} | ${b.category || ''} | ${b.shared} | ${b.lift ?? '-'} | ${b.switching?.verdict || '-'} (${b.switching?.leaving_mentions ?? 0} reviews) | ${b.switching?.avg_last_90d ?? '-'} vs ${b.switching?.avg_before ?? '-'} |`),
  '', report.error ? `**Stopped early:** ${report.error}` : '', `Spend: ~$${report.spend_usd}`].join('\n');
writeFileSync(`${OUT}/overlap.md`, md);
console.log(`\n${md}\n\nSaved ${OUT}/overlap.json and overlap.md`);
