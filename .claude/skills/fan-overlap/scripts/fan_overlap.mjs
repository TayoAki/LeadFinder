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
const PLACE = args.place, N_REVIEWS = Number(args.reviews || 500), PER = Number(args['per-reviewer'] || 200), TOP = Number(args.top || 15);
const CAP = Number(args['cap-usd'] || 30), MIN_SHARED = Number(args['min-shared'] || 3), DRY = !!args['dry-run'];
if (!PLACE) { console.error('usage: node fan_overlap.mjs --place "<business name and city, or a Google Maps URL>"'); process.exit(2); }
const slug = String(PLACE).toLowerCase().replace(/https?:\/\/\S+/, 'place').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 60);
const OUT = resolve(args.out || `fan-overlap/${slug}`);
const TOKEN = process.env.APIFY_TOKEN || 'proxy-injected';
// Free-tier prices (USD) from each actor's pricing page, used for the spend cap.
const PRICE = { place: 0.004, review: 0.0006, contributorReview: 0.0015, run: 0.001 };
PRICE.tregContributor = 0.00015; // litescrape via treg: one call = up to 200 reviews of one reviewer
const MIN_HISTORY = Number(args['min-history'] || 3);
const LOCATIONS = Number(args.locations || 1);
// Count overlap by brand (every Starbucks = one "Starbucks") or by single place.
const GROUP = String(args.group || 'brand');
const brandOf = n => String(n || '').toLowerCase().replace(/\s*[-–—|@·,(].*$/, '').replace(/[’']/g, "'").replace(/\b(inc|llc|co)\b\.?/g, '').replace(/\s+/g, ' ').trim();
// Places that are not businesses you could partner with.
const NOT_A_BUSINESS = /park|airport|sculpture|monument|landmark|tourist attraction|museum|beach|lake|river|bridge|station|transit|hospital|school|university|college|church|government|city hall|library|stadium|arena|zoo|garden|trail|neighbou?rhood|plaza|square|parking|highway|historical|memorial|observation deck|post office|dmv|embassy/i;
// Where reviewer histories come from: lexis (Apify, reliable, ~$0.0015/review), treg (litescrape,
// ~$0.00015/reviewer, when its provider is up) or johnvc (Apify, $1/month free cap).
const HIST = String(args.histories || 'lexis');
async function tregCallPost(id, body) {
  const { execFile } = await import('node:child_process');
  return new Promise((res, rej) => execFile(TREG, ['--json', 'call', id, '--method', 'POST', '--header', 'X-Treg-Route-Max-Cost: 0.01', '--data', JSON.stringify(body)], { maxBuffer: 1 << 26, timeout: 120000 }, (err, out) => {
    if (err && !out) return rej(err); try { const j = JSON.parse(out); if ((j._treg?.http_status || 200) >= 400) return rej(new Error(`HTTP ${j._treg.http_status}`)); res(j); } catch (e) { rej(e); } }));
}
let spent = 0;
// treg CLI (https://treg.to): keys stay on treg's server; signed in with `treg login`.
const TREG = process.env.TREG_BIN || `${process.env.HOME}/.local/bin/treg`;
let tregState;
async function tregOk() {
  if (tregState !== undefined) return tregState;
  const { execFile } = await import('node:child_process');
  tregState = await new Promise(res => execFile(TREG, ['--version'], err => res(!err)));
  return tregState;
}
async function tregCall(id, query) {
  const { execFile } = await import('node:child_process');
  const a = ['--json', 'call', id]; for (const [k, v] of Object.entries(query)) a.push('--query', `${k}=${v}`);
  return new Promise((res, rej) => execFile(TREG, a, { maxBuffer: 1 << 26, timeout: 120000 }, (err, out) => {
    if (err && !out) return rej(err); try { const j = JSON.parse(out); if ((j._treg?.http_status || 200) >= 400) return rej(new Error(`HTTP ${j._treg.http_status}`)); res(j); } catch (e) { rej(e); } }));
}
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
const report = { brand_a: PLACE, built_at: new Date().toISOString(), settings: { reviews: N_REVIEWS, per_reviewer: PER, min_shared: MIN_SHARED, top: TOP, locations: LOCATIONS, group: GROUP }, privacy: 'Totals per business only. No reviewer ids, names or profile links are stored. Businesses with fewer than min_shared shared reviewers are not shown.' };
try {
  // 1. Brand A's place.
  const isUrl = /^https?:\/\//.test(PLACE);
  const places = await apify('compass/crawler-google-places', isUrl ? { startUrls: [{ url: PLACE }], maxCrawledPlacesPerSearch: 1, maxReviews: 0, maxImages: 0 } : { searchStringsArray: [PLACE], maxCrawledPlacesPerSearch: LOCATIONS, maxReviews: 0, maxImages: 0 }, LOCATIONS * PRICE.place + PRICE.run);
  const A = places[0] || {};
  // Several locations of the same brand pool their reviewers (brand-level "fans of A").
  const aPlaces = places.filter(p => p.placeId && brandOf(p.title) === brandOf(A.title));
  report.place_a = { name: A.title || PLACE, brand: brandOf(A.title), category: A.categoryName || null, address: A.address || null, locations: aPlaces.length, reviews_total: aPlaces.reduce((n, p) => n + (p.reviewsCount || 0), 0), place_id: A.placeId || null, url: A.url || null };
  if (!A.placeId && !DRY) throw new Error(`Could not find "${PLACE}" on Google Maps. Try the full Google Maps URL.`);

  // 2. A's newest reviews (reviewer ids stay in memory), split across the locations.
  const perPlace = Math.ceil(N_REVIEWS / Math.max(1, aPlaces.length));
  const reviews = await apify('compass/google-maps-reviews-scraper', { placeIds: aPlaces.map(p => p.placeId), maxReviews: perPlace, reviewsSort: 'newest', personalData: true, language: 'en' }, N_REVIEWS * PRICE.review + PRICE.run);
  // Only reviewers with a few reviews can show an overlap; one-review accounts are skipped.
  const reviewerIds = [...new Set(reviews.filter(r => (r.reviewerNumberOfReviews ?? 99) >= MIN_HISTORY).map(r => r.reviewerId).filter(Boolean))];
  report.coverage = { a_reviews_fetched: reviews.length, unique_reviewers: new Set(reviews.map(r => r.reviewerId).filter(Boolean)).size, reviewers_with_history: reviewerIds.length };

  // 3. Each reviewer's public history. treg (litescrape, $0.00015 per reviewer, up to 200 reviews)
  // when the treg CLI is signed in; otherwise the Apify contributor actor (pricier, $1/month free cap).
  const history = [];
  if (HIST === 'lexis') {
    // lexis-solutions/google-maps-contributor-reviews-scraper: ~$0.0015 per review row; each row
    // carries the business's name, place id, category and total review count (no extra lookups).
    budget(reviewerIds.length * PER * PRICE.contributorReview, 'reviewer histories (lexis)');
    const batches = []; for (let i = 0; i < reviewerIds.length; i += 25) batches.push(reviewerIds.slice(i, i + 25));
    for (let i = 0; i < batches.length; i += 4) {
      const got = await Promise.all(batches.slice(i, i + 4).map(b => apify('lexis-solutions/google-maps-contributor-reviews-scraper', { startUrls: b.map(id => ({ url: `https://www.google.com/maps/contrib/${id}?hl=en` })), maxItems: PER }, 0, { timeoutSecs: 1800, allowPartial: true })
        .catch(e => { console.log('  batch failed:', e.message); return []; })));
      for (const g of got) for (const r of g) history.push({ contributor_id: r.reviewer?.id, rating: r.rating, date: r.createdAt,
        place_info: { data_id: r.place?.placeId || r.place?.cid, title: r.place?.name, address: r.place?.address, type: r.place?.primaryCategory, reviews_total: r.place?.reviewCount, place_id: r.place?.placeId } });
      if (spent > CAP) { console.log('  stopping histories: spend cap reached'); break; }
    }
  } else if (HIST === 'treg' && await tregOk()) {
    budget(reviewerIds.length * PRICE.tregContributor, 'reviewer histories (treg)');
    let i = 0, fails = 0;
    const worker = async () => { while (i < reviewerIds.length) { const id = reviewerIds[i++];
      try { const r = await tregCall('litescrape.google.maps.contributor_reviews', { contributor_id: id, limit: PER, timeout: 60 });
        for (const rv of r.result?.reviews || []) history.push({ ...rv, contributor_id: id }); spent += (r._treg?.charged_micro || 0) / 1e6; }
      catch { fails++; } } };
    await Promise.all(Array.from({ length: 8 }, worker));
    console.log(`• treg contributor reviews: ${reviewerIds.length} reviewers, ${history.length} reviews, ${fails} failed (total ~$${spent.toFixed(2)})`);
  } else {
    budget(reviewerIds.length * PER * PRICE.contributorReview, 'reviewer histories');
    const batches = []; for (let i = 0; i < reviewerIds.length; i += 20) batches.push(reviewerIds.slice(i, i + 20));
    for (let i = 0; i < batches.length; i += 4) {
      const got = await Promise.all(batches.slice(i, i + 4).map(b => apify('johnvc/google-maps-contributor-reviews-api', { contributorIds: b, maxResultsPerContributor: PER, hl: 'en' }, 0, { timeoutSecs: 1800, allowPartial: true })
        .catch(e => { console.log('  batch failed:', e.message); return []; })));
      for (const g of got) history.push(...g);
      if (spent > CAP) { console.log('  stopping histories: spend cap reached'); break; }
    }
  }
  // 4. Aggregate: distinct reviewers per business (ids used only to de-duplicate, then dropped).
  const byPlace = new Map(); const reachable = new Set(); const aBrand = brandOf(A.title); let skippedNonBiz = 0;
  for (const r of history) {
    const who = pick(r, 'contributor_id', 'contributorId'); const loc = placeKey(r);
    if (!who || !loc) continue; reachable.add(who);
    const name = placeName(r), type = pick(r, 'place_info.type', 'place.type');
    if (loc === A.placeId || brandOf(name) === aBrand) continue;
    if (NOT_A_BUSINESS.test(String(type || ''))) { skippedNonBiz++; continue; }
    // brand mode: every location of a chain counts as one business
    const key = GROUP === 'brand' ? brandOf(name) || loc : loc;
    const p = byPlace.get(key) || { name, address: placeAddr(r), type, locations: new Map(), reviewers: new Set(), ratings: [], dates: [] };
    const L = p.locations.get(loc) || { reviews_total: Number(pick(r, 'place_info.reviews_total')) || null, place_id: pick(r, 'place_info.place_id'), address: placeAddr(r), fans: new Set() };
    L.fans.add(who); p.locations.set(loc, L);
    if (!p.reviewers.has(who)) { p.reviewers.add(who); const rt = Number(pick(r, 'rating')); if (rt) p.ratings.push(rt); const d = dateOf(r); if (d) p.dates.push(d); }
    byPlace.set(key, p);
  }
  report.coverage.histories_reachable = reachable.size; report.coverage.history_reviews = history.length; report.coverage.non_business_reviews_skipped = skippedNonBiz;
  let shared = [...byPlace.entries()].map(([key, p]) => {
    const locs = [...p.locations.values()].sort((x, y) => y.fans.size - x.fans.size);
    const known = locs.every(l => l.reviews_total != null);
    return { key, name: p.name, address: locs.length > 1 ? `${locs.length} locations` : p.address, type: p.type || null, locations: locs.length,
      known_reviews_total: known ? locs.reduce((n, l) => n + l.reviews_total, 0) : null, known_place_id: locs[0]?.place_id || null, check_address: locs[0]?.address || p.address,
      shared: p.reviewers.size, avg_rating_from_a_fans: p.ratings.length ? Math.round(10 * p.ratings.reduce((a, b) => a + b, 0) / p.ratings.length) / 10 : null, last_review: p.dates.sort().slice(-1)[0] || null };
  }).filter(p => p.shared >= MIN_SHARED).sort((a, b) => b.shared - a.shared);
  for (const p of byPlace.values()) { p.reviewers.clear(); for (const l of p.locations.values()) l.fans.clear(); }
  byPlace.clear(); reviewerIds.length = 0; // drop ids

  // 5. Popularity + category for the candidates, then lift and competitor filter.
  const cands = shared.slice(0, Math.max(TOP * 3, 30));
  // Details come with lexis rows already; look them up only for candidates that lack them.
  const lacking = cands.filter(c => c.known_reviews_total == null);
  const details = lacking.length ? await apify('compass/crawler-google-places', { searchStringsArray: lacking.map(c => [c.name, c.check_address].filter(Boolean).join(', ')), maxCrawledPlacesPerSearch: 1, maxReviews: 0, maxImages: 0 }, lacking.length * PRICE.place + PRICE.run) : [];
  const det = new Map(details.map(d => [String(d.searchString || '').split(',')[0].trim().toLowerCase(), d]));
  const aWords = words(A.categoryName);
  for (const c of cands) {
    const d = det.get(String(c.name || '').toLowerCase()) || details.find(x => x.title === c.name) || {};
    Object.assign(c, { category: d.categoryName || c.type || null, reviews_total: c.known_reviews_total ?? d.reviewsCount ?? null, rating: d.totalScore ?? null, url: d.url || null, place_id: c.known_place_id || d.placeId || null });
    delete c.known_reviews_total; delete c.known_place_id; delete c.check_address;
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
  // treg's routed Google reviews (~$0.00015 per place) first; Apify for any place it misses.
  const bReviews = [];
  if (await tregOk()) for (const id of ids) {
    try { const r = await tregCallPost('treg.google.maps.reviews', { place_id: id, limit: 60, sort: 'newest' });
      const rows = r.result?.output?.reviews || r.result?.reviews || r.result?.output || [];
      for (const x of Array.isArray(rows) ? rows : []) bReviews.push({ placeId: id, stars: Number(x.rating ?? x.stars) || null, text: x.snippet ?? x.text ?? x.review_text ?? '', publishedAtDate: x.iso_date ?? x.published_at ?? x.publishedAtDate ?? x.date, reviewUrl: x.link ?? x.review_url ?? null });
      spent += (r._treg?.charged_micro || 0) / 1e6; } catch { /* falls back below */ }
  }
  const missing = ids.filter(id => !bReviews.some(r => r.placeId === id && Number.isFinite(Date.parse(r.publishedAtDate))));
  if (missing.length) bReviews.push(...await apify('compass/google-maps-reviews-scraper', { placeIds: missing, maxReviews: 40, reviewsSort: 'newest', personalData: false, language: 'en' }, missing.length * 40 * PRICE.review + PRICE.run).catch(e => { console.log('  B reviews:', e.message); return []; }));
  const now = Date.now();
  for (const b of brandB) {
    const rs = bReviews.filter(r => r.placeId === b.place_id && Number.isFinite(Date.parse(r.publishedAtDate)));
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
  '| They probably also love | Category | Locations | Shared fans | Lift | Are people leaving it? | Rating last 90d vs before |', '|---|---|---|---|---|---|---|',
  ...(report.brand_b || []).map(b => `| ${b.name} | ${b.category || ''} | ${b.locations ?? 1} | ${b.shared} | ${b.lift ?? '-'} | ${b.switching?.verdict || '-'} (${b.switching?.leaving_mentions ?? 0} reviews) | ${b.switching?.avg_last_90d ?? '-'} vs ${b.switching?.avg_before ?? '-'} |`),
  '', report.error ? `**Stopped early:** ${report.error}` : '', `Spend: ~$${report.spend_usd}`].join('\n');
writeFileSync(`${OUT}/overlap.md`, md);
console.log(`\n${md}\n\nSaved ${OUT}/overlap.json and overlap.md`);
