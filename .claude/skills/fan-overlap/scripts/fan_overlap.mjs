#!/usr/bin/env node
// fan-overlap: "if someone loves brand A, they probably love brand B — and are people leaving B?"
//
//   1. find brand A's locations in a city                        treg google.serp.maps (Apify fallback)
//   2. A's newest reviews per location (reviewer ids in memory)   treg google.maps.reviews (Apify fallback)
//   3. each reviewer's public review history                      treg litescrape when up, else Apify lexis
//   4. count distinct A reviewers per other brand (chains merged, non-businesses dropped)
//   5. lift: B's share of A's fans vs B's overall popularity
//   6. are people leaving B?  newest reviews (rating trend + leaving language)   treg google.maps.reviews
//      are people looking to switch from B?  "B alternative / B vs / places like B"   treg keyword volume + Google autocomplete
//   7. data checks: sample sizes, coverage, split-half stability, confidence per brand
//   8. answer: overlap.md, overlap.json (graph.mjs turns one or more of these into an explorable graph)
//
// Privacy: reviewer ids are used only in memory to de-duplicate; only totals per business are saved.
// A business needs >= --min-shared distinct reviewers to appear. Apify datasets are deleted after reading.
//
// usage: node fan_overlap.mjs --brand "Crumbl Cookies" --city "Chicago, IL" [--locations 10] [--reviews-per-location 100]
//          [--per-reviewer 60] [--min-history 5] [--min-shared 3] [--top 15] [--cap-usd 5] [--out DIR] [--dry-run]
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';

const args = Object.fromEntries(process.argv.slice(2).reduce((a, x, i, all) => (x.startsWith('--') ? [...a, [x.slice(2), all[i + 1] && !all[i + 1].startsWith('--') ? all[i + 1] : true]] : a), []));
const FROM = args.from ? JSON.parse(readFileSync(resolve(args.from), 'utf8')) : null; // re-check B from a saved run (no new histories)
const BRAND = args.brand || args.place || FROM?.brand_a, CITY = args.city ?? FROM?.city ?? '';
if (!BRAND) { console.error('usage: node fan_overlap.mjs --brand "<brand>" --city "<city, state>"'); process.exit(2); }
const LOCATIONS = Number(args.locations || 10), PER_LOC = Math.min(100, Number(args['reviews-per-location'] || 100));
const PER = Number(args['per-reviewer'] || 60), MIN_HISTORY = Number(args['min-history'] || 5);
const MIN_SHARED = Number(args['min-shared'] || 3), TOP = Number(args.top || 15), CAP = Number(args['cap-usd'] || 5), DRY = !!args['dry-run'];
const slug = `${BRAND} ${CITY}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 60);
const OUT = resolve(args.out || (args.from ? resolve(args.from, '..') : `fan-overlap/${slug}`));
const TREG = process.env.TREG_BIN || `${process.env.HOME}/.local/bin/treg`;
const APIFY = process.env.APIFY_TOKEN;
const PRICE = { lexisReview: 0.0015, apifyReview: 0.0006, apifyPlace: 0.004 };

const brandOf = n => String(n || '').toLowerCase().replace(/[’']/g, "'").replace(/\s+[-–—|]\s+.*$|\s*[@·,(:].*$/, '').replace(/\b(inc|llc|co|the)\b\.?/g, '').replace(/[^a-z0-9' &]+/g, ' ').replace(/\s+/g, ' ').trim();
// Places that are not businesses you could partner with.
const NOT_A_BUSINESS = /park|airport|sculpture|monument|landmark|tourist attraction|museum|beach|lake|river|bridge|station|transit|hospital|school|university|college|church|place of worship|government|city hall|library|stadium|arena|zoo|garden|trail|neighbou?rhood|plaza|square|parking|highway|historical|memorial|observation deck|post office|dmv|embassy|apartment|hotel|motel|doctor|dentist|clinic|urgent care|pharmacy|bank|atm|gas station|car wash|auto|insurance|real estate|lawyer|attorney|storage|city|town|village|county|state/i;
// Switching language: someone saying they are leaving or have left, not just a bad visit.
const LEAVING = /\b(used to (love|be|come|go)|not (the same|what it used to be)|(went|gone|going) downhill|won'?t be (back|returning)|will not be (back|returning)|never (coming|going|be coming) back|not (coming|going) back|(go|going|went|stick) (somewhere|elsewhere)|switch(ed|ing)? to|(go|going|went|stick) to \w+( \w+)? instead|no longer (come|go|order|visit|recommend)|lost (a|my|our) (loyal |long[- ]time )?customer|take (my|our) business|done with (this|them)|last time (i|we)('ll| will)? (come|go|order|visit)|(found|find) (a )?(better|new) (place|spot|one))\b/i;
// --exclude food,everyday,chains : drop noise when hunting for brands that share A's taste (e.g. a hat brand's collab partners).
const EXCLUDE = new Set(String(args.exclude || '').split(',').map(s => s.trim()).filter(Boolean));
const FOOD = /restaurant|fast food|coffee|cafe|café|bakery|pizza|burger|hamburger|chicken|wings|taco|mexican|sandwich|sub shop|deli|grill|bar\b|pub|brewery|brewpub|winery|food|diner|steak|sushi|ramen|thai|chinese|italian|indian|japanese|korean|vietnamese|seafood|bbq|barbecue|breakfast|brunch|ice cream|dessert|donut|doughnut|bagel|juice|smoothie|tea|boba|cookie|candy|chocolate|frozen yogurt|buffet|noodle|poke|salad|cafeteria|bistro|eatery|kitchen|cuisine|meal|caterer/i;
const EVERYDAY = /grocery|supermarket|drug store|pharmacy|gas|convenience|cell phone|mobile phone|telecom|bank|atm|department store|discount|dollar|warehouse|wholesale|big box|superstore|home improvement|hardware|auto parts|tire|oil change|car wash|post office|shipping|laundromat|dry clean|movie theater|cinema|gym|fitness|hotel|motel|resort|airline|car rental|rental car/i;
const MAJOR_CHAINS = new Set(['starbucks', 'starbucks coffee company', "mcdonald's", 'taco bell', 'chick fil a', 'chick-fil-a', 'subway', 'wendy\'s', 'burger king', "dunkin'", 'dunkin', 'chipotle', 'chipotle mexican grill', 'panera bread', 'panda express', 'popeyes', 'popeyes louisiana kitchen', 'kfc', 'domino\'s', 'domino\'s pizza', 'pizza hut', 'little caesars', 'little caesars pizza', 'sonic drive in', 'arby\'s', 'jack in the box', 'in n out burger', 'in-n-out burger', 'five guys', "jersey mike's", "jersey mike's subs", 'wingstop', "chili's", "chili's grill & bar", 'olive garden', 'applebee\'s', 'outback steakhouse', 'ihop', "denny's", 'cracker barrel', 'texas roadhouse', 'red lobster', 'walmart', 'walmart supercenter', 'target', 'costco', 'costco wholesale', "sam's club", 'kroger', 'safeway', 'albertsons', 'publix', 'whole foods market', "trader joe's", 'cvs', 'cvs pharmacy', 'walgreens', 'rite aid', 'home depot', 'the home depot', "lowe's", "lowe's home improvement", 'best buy', 'dollar tree', 'dollar general', 'family dollar', 'tj maxx', 't j maxx', 'marshalls', 'ross', 'ross dress for less', 'kohl\'s', 'macy\'s', 'nordstrom', 'nordstrom rack', 'jcpenney', 'old navy', 'gap', 'ulta', 'ulta beauty', 'sephora', 'bath & body works', 'verizon', 't mobile', 't-mobile', 'at&t', 'at&t store', 'apple', 'apple store', 'shell', 'chevron', 'exxon', 'bp', '7 eleven', '7-eleven', 'circle k', 'wawa', 'sheetz', 'ups store', 'the ups store', 'fedex office', 'usps', 'amc', 'regal', 'planet fitness', 'la fitness', '24 hour fitness', 'marriott', 'hilton', 'holiday inn', 'hampton inn', 'nike factory store', 'nike', 'foot locker', 'dick\'s sporting goods', 'academy sports + outdoors', 'jcpenney', 'petsmart', 'petco', 'autozone', "o'reilly auto parts", 'jiffy lube', 'chase', 'chase bank', 'bank of america', 'wells fargo', 'wells fargo bank', 'baskin robbins', 'baskin', 'cold stone creamery', 'dairy queen', 'krispy kreme', 'tim hortons', 'peet\'s coffee', 'the coffee bean & tea leaf', 'raising cane\'s', "raising cane's chicken fingers", 'whataburger', 'culver\'s', 'shake shack', 'cava', 'sweetgreen', 'qdoba', 'qdoba mexican eats', 'del taco', 'el pollo loco', 'carl\'s jr', 'jollibee', 'buffalo wild wings', 'cheesecake factory', 'the cheesecake factory', 'pf chang\'s', 'p.f. chang\'s']);
const isNoise = c => (EXCLUDE.has('food') && FOOD.test(c.category || '')) || (EXCLUDE.has('everyday') && EVERYDAY.test(c.category || '')) || (EXCLUDE.has('chains') && (MAJOR_CHAINS.has(String(c.name).toLowerCase()) || c.locations >= 5));
const COMMON_WORD_NAMES = new Set(['subway', 'target', 'chipotle', 'panera', 'jersey mike\'s', 'wingstop', 'ulta', 'apple', 'whole foods', 'sprouts', 'orange theory', 'equinox', 'planet fitness', 'crunch', 'nothing bundt cakes', 'insomnia cookies', 'tropical smoothie', 'gap', 'express', 'shell', 'chase', 'sonic', 'jewel', 'ross', 'marshalls', 'five below', 'dollar tree', 'family dollar']);
const searchName = n => (String(n).replace(/\s+(coffee company|coffee|mexican grill|louisiana kitchen|pizza|bread|restaurant|bakery|cafe|kitchen|grill)$/i, '') || n).toLowerCase();
const words = s => new Set(String(s || '').toLowerCase().split(/[^a-z]+/).filter(w => w.length > 3 && !['shop', 'store', 'restaurant', 'service', 'center', 'food', 'takeout', 'delivery'].includes(w)));
const contribId = r => (String(r?.author?.url || r?.reviewerUrl || '').match(/contrib\/(\d+)/) || [])[1] || r?.reviewerId || null;

let spent = 0; const spendBy = {};
const charge = (src, usd) => { spent += usd; spendBy[src] = (spendBy[src] || 0) + usd; };
const budget = (usd, what) => { if (spent + usd > CAP) throw new Error(`Stopping before ${what}: it would take spend to $${(spent + usd).toFixed(2)}, over the $${CAP} cap.`); };
const log = (...a) => console.log(...a);

// ---- treg (https://treg.to): keys live on treg's server; `treg login` once.
let tregUp;
async function tregOk() { if (tregUp === undefined) tregUp = await new Promise(r => execFile(TREG, ['balance'], e => r(!e))); return tregUp; }
function treg(id, { body, query, maxCost = 0.02 } = {}) {
  if (DRY) { log(`[dry-run] treg ${id}`, JSON.stringify(body || query).slice(0, 120)); return Promise.resolve({}); }
  const a = ['--json', 'call', id];
  if (body) a.push('--method', 'POST', '--header', `X-Treg-Route-Max-Cost: ${maxCost}`, '--data', JSON.stringify(body));
  for (const [k, v] of Object.entries(query || {})) a.push('--query', `${k}=${v}`);
  return new Promise((res, rej) => execFile(TREG, a, { maxBuffer: 1 << 27, timeout: 180000 }, (err, out) => {
    if (err && !out) return rej(err);
    try { const j = JSON.parse(out); charge('treg', (j._treg?.charged_micro || 0) / 1e6);
      if ((j._treg?.http_status || 200) >= 400) return rej(new Error(`${id}: HTTP ${j._treg.http_status} ${j.result?.error || ''}`)); res(j.result?.output || j.result || {}); } catch (e) { rej(e); } }));
}

// ---- Apify (fallback + reviewer histories while treg's contributor provider is down)
async function apify(actor, input, estimate, { allowPartial = false } = {}) {
  budget(estimate, actor);
  if (!APIFY) throw new Error(`${actor} needs APIFY_TOKEN`);
  if (DRY) { log(`[dry-run] apify ${actor} (~$${estimate.toFixed(2)})`); return []; }
  const H = { 'content-type': 'application/json', authorization: `Bearer ${APIFY}` };
  const api = async (path, opts = {}) => { const r = await fetch(`https://api.apify.com/v2${path}`, { headers: H, signal: AbortSignal.timeout(120000), ...opts });
    if (!r.ok) throw new Error(`${actor}: HTTP ${r.status} ${(await r.text()).slice(0, 200)}`); return r.status === 204 ? null : r.json(); };
  let run = (await api(`/acts/${actor.replace('/', '~')}/runs?waitForFinish=60&timeout=1800`, { method: 'POST', body: JSON.stringify(input) })).data;
  while (!['SUCCEEDED', 'FAILED', 'ABORTED', 'TIMED-OUT'].includes(run.status)) run = (await api(`/actor-runs/${run.id}?waitForFinish=60`)).data;
  const ok = run.status === 'SUCCEEDED';
  const items = ok || allowPartial ? await api(`/datasets/${run.defaultDatasetId}/items?format=json&clean=true`) : [];
  charge('apify', Number(run.usageTotalUsd) || (ok ? estimate : 0));
  await api(`/datasets/${run.defaultDatasetId}`, { method: 'DELETE' }).catch(() => {}); // no personal data left on Apify
  if (!ok && !allowPartial) throw new Error(`${actor} run ${run.status}`);
  log(`• apify ${actor.split('/')[1]}: ${items.length} items${ok ? '' : ` (${run.status}, partial)`} · total ~$${spent.toFixed(2)}`);
  return items;
}

mkdirSync(OUT, { recursive: true });
const report = { brand_a: BRAND, city: CITY, built_at: new Date().toISOString(), settings: { locations: LOCATIONS, reviews_per_location: PER_LOC, per_reviewer: PER, min_history: MIN_HISTORY, min_shared: MIN_SHARED, top: TOP, cap_usd: CAP },
  privacy: 'Totals per business only. Reviewer ids were used in memory to de-duplicate and then dropped; no names, ids or profile links are stored. Businesses with fewer than min_shared shared reviewers are not shown.', sources: {} };

try {
  let brandB, rivals;
  if (FROM) {
    // Reuse the saved overlap (steps 1-5); only re-run the B checks. Find B's place again if the old file lacks its id.
    Object.assign(report, { place_a: FROM.place_a, coverage: FROM.coverage, sources: { ...FROM.sources }, rechecked_from: FROM.built_at });
    brandB = (FROM.brand_b || []).filter(c => !isNoise(c)); rivals = (FROM.rivals || []).filter(c => !isNoise(c));
    report.excluded = { filters: [...EXCLUDE], brands: [...(FROM.brand_b || []), ...(FROM.rivals || [])].filter(isNoise).map(c => ({ name: c.name, category: c.category, shared: c.shared })) };
    if (FROM.all_brands) { const keep = FROM.all_brands.filter(c => !isNoise(c)); report.all_brands = FROM.all_brands; brandB = keep.filter(c => !c.competitor).slice(0, TOP).map(c => brandB.find(b => b.name === c.name) || c); rivals = keep.filter(c => c.competitor).slice(0, 8).map(c => rivals.find(b => b.name === c.name) || c); }
    for (const b of [...brandB, ...rivals]) if (!b.check_place_id && b.check_address) {
      const o = await treg('treg.google.serp.maps', { body: { q: `${b.name} ${b.check_address}` } }).catch(() => ({}));
      b.check_place_id = (o.places || []).find(p => brandOf(p.name) === brandOf(b.name))?.place_id || o.places?.[0]?.place_id || null;
    }
    log(`re-checking ${brandB.length + rivals.length} brands from ${args.from}`);
  } else {
  // ---- 1. Brand A's locations
  const aBrand = brandOf(BRAND);
  let locs = [];
  // --place-ids id1,id2 (stores spread over many cities) skips the search; --cities "A|B|C" searches each city.
  if (args['place-ids']) locs = String(args['place-ids']).split(',').map(s => s.trim()).filter(Boolean).map(id => ({ name: BRAND, place_id: id, category: args.category || null }));
  if (!locs.length && await tregOk()) {
    const seen = new Set();
    const cities = args.cities ? String(args.cities).split('|').map(s => s.trim()) : [CITY];
    for (const q of cities.flatMap(c => [`${BRAND} ${c}`, ...(cities.length === 1 ? [`${BRAND} near ${c}`] : [])])) {
      const o = await treg('treg.google.serp.maps', { body: { q } }).catch(e => (log('  maps search:', e.message), {}));
      for (const p of o.places || []) if (p.place_id && !seen.has(p.place_id) && brandOf(p.name) === aBrand) { seen.add(p.place_id); locs.push({ name: p.name, address: p.address, place_id: p.place_id, category: p.category, rating: p.rating, reviews_total: p.review_count ?? null }); }
      if (locs.length >= LOCATIONS) break;
    }
    report.sources.places = 'treg google.serp.maps';
  }
  if (!locs.length && APIFY) {
    const ps = await apify('compass/crawler-google-places', { searchStringsArray: [BRAND], locationQuery: CITY || undefined, maxCrawledPlacesPerSearch: LOCATIONS, maxReviews: 0, maxImages: 0 }, LOCATIONS * PRICE.apifyPlace);
    locs = ps.filter(p => p.placeId && brandOf(p.title) === aBrand).map(p => ({ name: p.title, address: p.address, place_id: p.placeId, category: p.categoryName, rating: p.totalScore, reviews_total: p.reviewsCount }));
    report.sources.places = 'apify crawler-google-places';
  }
  locs = locs.slice(0, LOCATIONS);
  report.place_a = { name: locs[0]?.name || BRAND, brand: aBrand, category: args.category || locs.find(l => l.category)?.category || null, locations: locs.length, addresses: locs.map(l => l.address) };
  if (!locs.length && !DRY) throw new Error(`No "${BRAND}" locations found${CITY ? ` in ${CITY}` : ''}. Check the brand spelling or city.`);
  log(`1. ${locs.length} ${BRAND} locations`);

  // ---- 2. A's newest reviews, per location
  const aReviews = [];
  for (const l of locs) {
    let rows = [];
    if (await tregOk()) rows = (await treg('treg.google.maps.reviews', { body: { place_id: l.place_id, limit: PER_LOC, sort: 'newest' } }).catch(() => ({}))).reviews || [];
    if (rows.length) rows.forEach(r => aReviews.push({ who: contribId(r), n: Number(r.author?.reviews) || null, stars: r.rating, date: r.date }));
    else if (APIFY && !DRY) (await apify('compass/google-maps-reviews-scraper', { placeIds: [l.place_id], maxReviews: PER_LOC, reviewsSort: 'newest', personalData: true, language: 'en' }, PER_LOC * PRICE.apifyReview))
      .forEach(r => aReviews.push({ who: r.reviewerId, n: r.reviewerNumberOfReviews, stars: r.stars, date: r.publishedAtDate }));
  }
  report.sources.a_reviews = 'treg google.maps.reviews (Apify fallback)';
  const counts = new Map(); for (const r of aReviews) if (r.who) counts.set(r.who, Math.max(counts.get(r.who) || 0, r.n ?? 99));
  // reviewers with a few reviews can show an overlap; order by a stable hash so a capped run is a fair sample
  const h = s => createHash('sha1').update(String(s)).digest('hex');
  const pool = [...counts.entries()].filter(([, n]) => n >= MIN_HISTORY).sort((a, b) => h(a[0]).localeCompare(h(b[0])));
  report.coverage = { a_reviews: aReviews.length, unique_reviewers: counts.size, reviewers_with_history: pool.length };
  log(`2. ${aReviews.length} reviews, ${counts.size} reviewers, ${pool.length} with ${MIN_HISTORY}+ reviews`);

  // ---- 3. Reviewer histories
  const history = []; let fetched = 0;
  const half = new Map(); // reviewer -> 0/1, for the split-half stability check (memory only)
  let useTreg = false;
  if (await tregOk() && pool.length && !DRY) { // probe: is treg's contributor provider up?
    const probe = await Promise.all(pool.slice(0, 2).map(([id]) => treg('litescrape.google.maps.contributor_reviews', { query: { contributor_id: id, limit: PER } }).then(o => o, () => null)));
    useTreg = probe.some(o => (o?.reviews || []).length);
  }
  if (useTreg) {
    report.sources.histories = 'treg litescrape.google.maps.contributor_reviews';
    let i = 0; const worker = async () => { while (i < pool.length) { const [id] = pool[i++];
      if (spent > CAP) return;
      const o = await treg('litescrape.google.maps.contributor_reviews', { query: { contributor_id: id, limit: PER } }).catch(() => null);
      for (const r of o?.reviews || []) history.push({ who: id, place: r.place_info?.data_id || r.place_info?.place_id || r.place_info?.title, name: r.place_info?.title, address: r.place_info?.address, type: r.place_info?.type, total: r.place_info?.reviews, place_id: r.place_info?.place_id, stars: r.rating, date: r.iso_date || r.date });
      if (o) fetched++; } };
    await Promise.all(Array.from({ length: 8 }, worker));
  } else {
    report.sources.histories = 'apify lexis-solutions/google-maps-contributor-reviews-scraper (treg contributor provider unavailable)';
    // Spend-aware: estimate each batch from the real average so far and stop at the cap (keeping $0.15 for step 5-6).
    let avgRows = null;
    for (let i = 0; i < pool.length; i += 25) {
      const batch = pool.slice(i, i + 25);
      const est = batch.reduce((n, [, c]) => n + Math.min(PER, avgRows ?? c), 0) * PRICE.lexisReview;
      if (spent + est > CAP - 0.15) { log(`  histories: stopping at ${fetched} reviewers to stay under the $${CAP} cap`); break; }
      if (DRY) { log(`[dry-run] apify lexis batch of ${batch.length} (~$${est.toFixed(2)})`); fetched += batch.length; continue; }
      const rows = await apify('lexis-solutions/google-maps-contributor-reviews-scraper', { startUrls: batch.map(([id]) => ({ url: `https://www.google.com/maps/contrib/${id}?hl=en` })), maxItems: PER }, 0, { allowPartial: true }).catch(e => (log('  batch failed:', e.message), []));
      for (const r of rows) history.push({ who: r.reviewer?.id, place: r.place?.placeId || r.place?.cid, name: r.place?.name, address: r.place?.address, type: r.place?.primaryCategory, total: r.place?.reviewCount, place_id: r.place?.placeId, stars: r.rating, date: r.createdAt });
      fetched += batch.length; const got = new Set(rows.map(r => r.reviewer?.id)).size || 1; avgRows = Math.max(5, Math.round(history.length / Math.max(1, new Set(history.map(x => x.who)).size)));
      log(`  ${fetched}/${pool.length} reviewers · ${history.length} history rows · ~${avgRows}/reviewer (${got} in last batch)`);
    }
  }
  for (const x of history) if (x.who && !half.has(x.who)) half.set(x.who, parseInt(h(x.who + 'split').slice(0, 2), 16) & 1);
  report.coverage.histories_requested = fetched; report.coverage.histories_returned = half.size; report.coverage.history_rows = history.length;
  log(`3. ${half.size} reviewer histories, ${history.length} reviews`);

  // ---- 4. Aggregate per brand (every location of a chain = one brand)
  const byBrand = new Map(); let skippedNonBiz = 0;
  for (const r of history) {
    if (!r.who || !r.place || !r.name) continue;
    const b = brandOf(r.name); if (!b || b === aBrand) continue;
    if (NOT_A_BUSINESS.test(String(r.type || ''))) { skippedNonBiz++; continue; }
    const g = byBrand.get(b) || { name: r.name.replace(/\s+[-–—|]\s+.*$|\s*[@·,(:].*$/, ''), type: r.type, locs: new Map(), fans: new Set(), halves: [new Set(), new Set()], stars: [] };
    const L = g.locs.get(r.place) || { total: Number(r.total) || null, place_id: r.place_id, address: r.address, fans: new Set() };
    L.fans.add(r.who); g.locs.set(r.place, L);
    if (!g.fans.has(r.who)) { g.fans.add(r.who); if (r.stars) g.stars.push(Number(r.stars)); }
    g.halves[half.get(r.who) || 0].add(r.who);
    byBrand.set(b, g);
  }
  report.coverage.non_business_reviews_skipped = skippedNonBiz;
  const fansN = half.size || 1;
  const aWords = words(report.place_a.category);
  let cands = [...byBrand.values()].map(g => {
    const ls = [...g.locs.values()].sort((x, y) => y.fans.size - x.fans.size);
    const totals = ls.map(l => l.total).filter(Boolean);
    return { name: g.name, category: g.type || null, locations: ls.length, shared: g.fans.size, share_of_fans: Math.round(1000 * g.fans.size / fansN) / 10,
      halves: [g.halves[0].size, g.halves[1].size], reviews_total: totals.length ? totals.reduce((a, b) => a + b, 0) : null,
      avg_stars_from_a_fans: g.stars.length ? Math.round(10 * g.stars.reduce((a, b) => a + b, 0) / g.stars.length) / 10 : null,
      check_place_id: ls[0]?.place_id || null, check_address: ls[0]?.address || null,
      competitor: [...words(g.type)].some(w => aWords.has(w)) };
  }).filter(c => c.shared >= MIN_SHARED);
  report.excluded = { filters: [...EXCLUDE], brands: cands.filter(isNoise).map(c => ({ name: c.name, category: c.category, shared: c.shared })) };
  report.all_brands = cands.map(c => ({ ...c })); // totals only, every brand with min_shared+ (lets later --from runs filter without new histories)
  cands = cands.filter(c => !isNoise(c));
  for (const g of byBrand.values()) { g.fans.clear(); g.halves.forEach(s => s.clear()); for (const l of g.locs.values()) l.fans.clear(); } // drop ids
  byBrand.clear(); counts.clear(); pool.length = 0; history.length = 0; half.clear();

  // ---- 5. Lift: share of A's fans who reviewed B vs B's overall popularity (sqrt damps mega-chains), 1.0 = median
  const rate = c => c.reviews_total ? c.shared / Math.sqrt(c.reviews_total) : null;
  const med = (xs => xs.length ? xs[Math.floor(xs.length / 2)] : null)(cands.map(rate).filter(x => x != null).sort((a, b) => a - b));
  for (const c of cands) {
    c.lift = med && rate(c) != null ? Math.round(100 * rate(c) / med) / 100 : null;
    c.confidence = c.shared >= 8 && Math.min(...c.halves) >= 3 ? 'high' : c.shared >= 5 && Math.min(...c.halves) >= 1 ? 'medium' : 'low';
    c.affinity = Math.round(100 * (c.lift ?? 1) * Math.log2(1 + c.shared)) / 100;
  }
  cands.sort((a, b) => b.affinity - a.affinity);
  brandB = cands.filter(c => !c.competitor).slice(0, TOP);
  rivals = cands.filter(c => c.competitor).slice(0, 8);
  }
  const check = [...brandB, ...rivals];

  // ---- 6a. Are people leaving B? newest reviews of B's location most visited by A's fans
  const now = Date.now();
  for (const b of check) {
    let rs = [];
    // B's location most visited by A's fans, plus up to 2 more of B's locations in the same city (one store can be an outlier)
    const ids = [b.check_place_id].filter(Boolean);
    if (await tregOk()) {
      const o = await treg('treg.google.serp.maps', { body: { q: `${b.name} ${CITY}` } }).catch(() => ({}));
      for (const p of o.places || []) if (ids.length < 3 && p.place_id && !ids.includes(p.place_id) && brandOf(p.name) === brandOf(b.name)) ids.push(p.place_id);
      for (const id of ids) rs.push(...((await treg('treg.google.maps.reviews', { body: { place_id: id, limit: 100, sort: 'newest' } }).catch(() => ({}))).reviews || [])
        .map(r => ({ stars: Number(r.rating) || null, text: r.text || '', date: r.date, url: r.url || null })));
    }
    b.check_place_ids_count = ids.length;
    if (!rs.length && b.check_place_id && APIFY && !DRY) rs = (await apify('compass/google-maps-reviews-scraper', { placeIds: [b.check_place_id], maxReviews: 60, reviewsSort: 'newest', personalData: false, language: 'en' }, 60 * PRICE.apifyReview).catch(() => []))
      .map(r => ({ stars: r.stars, text: r.text || '', date: r.publishedAtDate, url: r.reviewUrl || null }));
    rs = rs.filter(r => Number.isFinite(Date.parse(r.date)));
    const year = rs.filter(r => now - Date.parse(r.date) < 365 * 864e5);
    const recent = rs.filter(r => now - Date.parse(r.date) < 90 * 864e5), older = rs.filter(r => now - Date.parse(r.date) >= 90 * 864e5);
    const avg = xs => xs.length ? Math.round(100 * xs.reduce((a, r) => a + (r.stars || 0), 0) / xs.length) / 100 : null;
    const leaving = year.filter(r => (r.stars || 5) <= 3 && LEAVING.test(r.text)), lowStar = year.filter(r => (r.stars || 5) <= 2);
    const change = recent.length >= 10 && older.length >= 10 ? Math.round(100 * (avg(recent) - avg(older))) / 100 : null;
    b.leaving = { locations_checked: ids.length, reviews_checked: rs.length, recent_90d: recent.length, avg_last_90d: avg(recent), avg_before: avg(older), rating_change: change, reviews_last_12m: year.length, low_star_last_12m: lowStar.length, leaving_reviews: leaving.length,
      share_leaving: year.length ? Math.round(1000 * leaving.length / year.length) / 10 : null,
      quotes: leaving.slice(0, 3).map(r => ({ quote: String(r.text).replace(/\s+/g, ' ').slice(0, 240), stars: r.stars, date: String(r.date).slice(0, 10), url: r.url })) };
    // Verdict needs people saying it (switching language) — a rating dip alone is only 'some leaving'.
    const per100 = year.length ? 100 * leaving.length / year.length : 0;
    b.leaving.leaving_per_100 = Math.round(per100 * 10) / 10;
    b.leaving.verdict = !rs.length ? 'not checked' : year.length < 15 ? 'too few recent reviews' : (leaving.length >= 4 && per100 >= 2) || (leaving.length >= 2 && (change ?? 0) <= -0.4) ? 'people are leaving' : leaving.length >= 2 || (change ?? 0) <= -0.4 ? 'some leaving' : 'steady';
  }
  report.sources.leaving = 'treg google.maps.reviews: newest 100 reviews of the location A fans visit most; leaving = 1-3 star reviews in the last 12 months that say they are leaving or have left';

  // ---- 6b. Are people looking to switch from B? search demand for alternatives (brand-level, national)
  const SW = n => [`${n} alternative`, `${n} alternatives`, `places like ${n}`, `better than ${n}`, `cheaper than ${n}`].map(s => s.toLowerCase());
  const EXTRA = n => [`${n} vs`, `${n} closing`];
  const kw = check.flatMap(b => [...SW(searchName(b.name)), ...EXTRA(searchName(b.name))]);
  let vol = {};
  if (await tregOk() && kw.length) {
    const o = await treg('treg.google.keywords.volume', { body: { keywords: kw, country: 'us' }, maxCost: 0.1 }).catch(e => (log('  volume:', e.message), {}));
    for (const r of o.rows || o.keywords || []) vol[String(r.keyword || r.key || '').toLowerCase()] = Number(r.search_volume ?? r.volume ?? r.searchVolume) || 0;
    report.sources.switch_search = 'treg google.keywords.volume + Google autocomplete';
  }
  for (const b of check) {
    const sn = searchName(b.name);
    const sugg = await fetch(`https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(sn + ' vs')}`, { signal: AbortSignal.timeout(10000) }).then(r => r.json()).then(j => j[1] || []).catch(() => []);
    const vs = sugg.map(s => s.replace(new RegExp(`^${sn.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s+vs\\.?\\s*`), '')).filter(Boolean).slice(0, 6);
    const ambiguous = COMMON_WORD_NAMES.has(sn);
    const terms = SW(sn).filter(k => !ambiguous || k.startsWith('places like')).map(k => ({ keyword: k, monthly: vol[k] ?? null })).filter(t => t.monthly);
    const total = terms.reduce((n, t) => n + t.monthly, 0);
    b.switch_search = { searched_as: sn, monthly_searches: Object.keys(vol).length ? total : null, terms, compared_with: vs, versus_monthly: vol[`${sn} vs`] ?? null, closing_monthly: vol[`${sn} closing`] ?? null, ambiguous,
      level: total >= 1000 ? 'high' : total >= 150 ? 'some' : Object.keys(vol).length ? 'low' : 'unknown' };
  }

  // ---- 7. Opportunity: A's fans love B (affinity) AND people are leaving / looking to switch from B
  const leaveScore = l => ({ 'people are leaving': 2, 'some leaving': 1 })[l?.verdict] || 0;
  const searchScore = s => ({ high: 2, some: 1 })[s?.level] || 0;
  for (const b of check) {
    b.opportunity = Math.round(10 * b.affinity * (1 + leaveScore(b.leaving) + 0.5 * searchScore(b.switch_search)) * ({ high: 1, medium: 0.8, low: 0.5 })[b.confidence]) / 10;
    b.why = [`${b.share_of_fans}% of ${BRAND} fans in the sample also reviewed it (${b.shared} people)`, b.lift != null ? `lift ${b.lift}` : null,
      b.leaving?.verdict && b.leaving.verdict !== 'steady' && b.leaving.verdict !== 'not checked' ? `${b.leaving.leaving_reviews} of ${b.leaving.reviews_last_12m} reviews in the last 12 months (${b.leaving.locations_checked} locations) say they're leaving or left${b.leaving.rating_change != null ? `, rating ${b.leaving.rating_change > 0 ? '+' : ''}${b.leaving.rating_change} in 90 days` : ''}` : null,
      searchScore(b.switch_search) ? `${b.switch_search.monthly_searches}/mo US searches for alternatives` : null].filter(Boolean).join('; ');
  }

  // ---- 8. Data checks
  const top10 = brandB.slice(0, 10);
  const stable = top10.filter(c => Math.min(...c.halves) >= 1).length;
  const warnings = [];
  if (report.coverage.histories_returned < 60) warnings.push(`Only ${report.coverage.histories_returned} reviewer histories: treat results as directional. Aim for 150+.`);
  if (report.coverage.unique_reviewers < 200) warnings.push(`Only ${report.coverage.unique_reviewers} ${BRAND} reviewers found. Add locations or a bigger city.`);
  if (!brandB.length) warnings.push(`No business reached ${MIN_SHARED} shared reviewers. Pool more locations, read more of each history (--per-reviewer), or lower --min-shared to 2 (less reliable).`);
  if (stable < Math.min(5, top10.length)) warnings.push(`Only ${stable} of the top ${top10.length} show up in both random halves of the sample: rankings may shift with more data.`);
  const unchecked = check.filter(b => b.leaving?.verdict === 'not checked').length; if (unchecked) warnings.push(`${unchecked} brands could not be checked for leavers (no reviews returned).`);
  report.checks = { split_half_top10_in_both: `${stable}/${top10.length}`, confidence_counts: Object.fromEntries(['high', 'medium', 'low'].map(k => [k, brandB.filter(b => b.confidence === k).length])), warnings };
  report.brand_b = brandB; report.rivals = rivals;
  report.collab_partners = brandB.filter(b => b.confidence !== 'low' && !['people are leaving', 'some leaving'].includes(b.leaving?.verdict)).slice(0, 3).map(b => ({ name: b.name, why: b.why, confidence: b.confidence }));
  report.opportunities = [...check].filter(b => b.confidence !== 'low' && (leaveScore(b.leaving) || searchScore(b.switch_search))).sort((a, b) => b.opportunity - a.opportunity).slice(0, 5).map(b => ({ name: b.name, competitor: b.competitor, opportunity: b.opportunity, confidence: b.confidence, why: b.why }));
} catch (e) { report.error = e.message; console.error('Stopped:', e.message); }

report.spend_usd = Math.round((spent + (FROM?.spend_usd || 0)) * 100) / 100; // includes the saved run spend when re-checking
report.spend_by_source = Object.fromEntries(Object.entries(spendBy).map(([k, v]) => [k, Math.round(v * 1000) / 1000]));
writeFileSync(`${OUT}/overlap.json`, JSON.stringify(report, null, 1));

// ---- Answer
const c = report.coverage || {}, A = report.place_a || {};
const row = b => `| ${b.name}${b.locations > 1 ? ` (${b.locations} loc.)` : ''} | ${b.category || ''} | ${b.shared} (${b.share_of_fans}%) | ${b.lift ?? '-'} | ${b.confidence} | ${b.leaving?.verdict || '-'}${b.leaving?.reviews_last_12m != null ? ` · ${b.leaving.leaving_reviews}/${b.leaving.reviews_last_12m} (${b.leaving.locations_checked} loc.)` : ''} | ${b.leaving?.avg_last_90d ?? '-'} vs ${b.leaving?.avg_before ?? '-'} | ${b.switch_search?.monthly_searches ?? '-'} |`;
const head = '| Brand | Category | Shared fans | Lift | Confidence | Leaving? (leaving reviews / last 12 mo) | Rating 90d vs before | Alt. searches/mo (US) |\n|---|---|---|---|---|---|---|---|';
const md = [
  `# If someone loves ${A.name || BRAND}${CITY ? ` (${CITY})` : ''}…`, '',
  `Sample: ${c.a_reviews ?? 0} recent Google reviews across ${A.locations ?? 0} locations, ${c.unique_reviewers ?? 0} reviewers, ${c.histories_returned ?? 0} public review histories (${c.history_rows ?? 0} reviews). Totals only; no reviewer data kept.`, '',
  '## The answer', '',
  ...(report.brand_b?.length ? [
    `**Fans of ${BRAND} probably also love:** ${report.brand_b.slice(0, 6).map(b => `${b.name} (${b.share_of_fans}%, lift ${b.lift ?? '-'})`).join(', ')}.`, '',
    report.opportunities?.length ? `**Of those, people are leaving or looking to switch from:**\n${report.opportunities.map((o, i) => `${i + 1}. **${o.name}**${o.competitor ? ' (a rival)' : ''}: ${o.why}. Confidence: ${o.confidence}.`).join('\n')}` : '**None of them shows people leaving** in the last 12 months of reviews, or much search for alternatives.', '',
    '**Where the opportunity is:**',
    report.opportunities?.length ? `- **Switchers:** ${report.opportunities.slice(0, 2).map(o => o.name).join(' and ')} ${report.opportunities.length > 1 ? 'are' : 'is'} loved by ${BRAND} fans but losing people. Read the leaver quotes below for what's missing, and build or market that to ${BRAND}${BRAND.endsWith('s') ? "'" : "'s"} crowd.` : '- **Switchers:** none with enough evidence in this sample.',
    report.collab_partners?.length ? `- **Collab:** ${report.collab_partners.map(c => c.name).join(', ')}: fans overlap strongly and the brand is steady. A co-branded drop reaches people who already like both.` : '',
  ] : ['No brand had enough shared fans to answer yet. See the checks below.']), '',
  '## Brands A\'s fans also love', '', head, ...(report.brand_b || []).map(row), '',
  report.rivals?.length ? `## Rivals A's fans also visit\n\n${head}\n${report.rivals.map(row).join('\n')}\n` : '',
  '## What leavers say', '', ...[...(report.brand_b || []), ...(report.rivals || [])].filter(b => b.leaving?.quotes?.length).slice(0, 6).map(b => `**${b.name}**\n${b.leaving.quotes.map(q => `- "${q.quote}" (${q.stars}★, ${q.date}${q.url ? `, [review](${q.url})` : ''})`).join('\n')}`), '',
  report.excluded?.brands?.length ? `Filtered out (${report.excluded.filters.join(', ')}): ${report.excluded.brands.map(b => `${b.name} (${b.shared})`).join(', ')}.\n` : '',
  '## Data checks', '', `- Split-half stability: ${report.checks?.split_half_top10_in_both ?? '-'} of the top 10 appear in both random halves of the reviewers.`,
  `- Confidence: ${JSON.stringify(report.checks?.confidence_counts || {})} (high = 8+ shared fans and 3+ in each half).`, ...(report.checks?.warnings || []).map(w => `- ⚠ ${w}`), '',
  `Lift 1.0 = a typical business in the sample; higher means ${BRAND} fans favour it more than its popularity explains. "Probably love" means an association in public reviews, not proof of purchase.`, '',
  `Sources: ${Object.entries(report.sources).map(([k, v]) => `${k}: ${v}`).join('; ')}.`, report.error ? `\n**Stopped early:** ${report.error}` : '', `Spend: ~$${report.spend_usd} ${JSON.stringify(report.spend_by_source)}`].join('\n');
writeFileSync(`${OUT}/overlap.md`, md);
log(`\n${md}\n\nSaved ${OUT}/overlap.json and overlap.md. Graph: node ${resolve(import.meta.dirname, 'graph.mjs')} ${OUT}/overlap.json`);
