#!/usr/bin/env node
// Instagram fan overlap: "people who follow and engage with @brand also follow …" (all through treg).
//   1. fans = people who commented on the brand's recent posts (engaged)   scrapecreators user.posts + post.comments
//            + a sample of recent followers                                tikhub instagram followers
//   2. each public fan's following list (first --pages pages)              tikhub instagram following
//   3. count fans per followed account (ids/usernames of fans stay in memory, then dropped)
//   4. look up the accounts followed by >= --min-shared fans: followers, category, business or person   treg instagram.user.profile
//   5. lift = share of fans following it vs its total followers (sqrt), 1.0 = median; split into brands vs creators/people
// Output: ig-overlap.json (same shape as overlap.json, so graph.mjs can draw it) and ig-overlap.md.
// Privacy: only public business/creator accounts with >= min-shared fans are saved; fans' usernames are never written.
//
// usage: node ig_overlap.mjs --handle melin [--posts 60] [--followers 300] [--fans 450] [--pages 4] [--min-shared 3]
//          [--exclude food,everyday,chains] [--cap-usd 3] [--out DIR]
import { execFile } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const args = Object.fromEntries(process.argv.slice(2).reduce((a, x, i, all) => (x.startsWith('--') ? [...a, [x.slice(2), all[i + 1] && !all[i + 1].startsWith('--') ? all[i + 1] : true]] : a), []));
const HANDLE = String(args.handle || '').replace(/^@/, '').toLowerCase();
if (!HANDLE) { console.error('usage: node ig_overlap.mjs --handle <instagram handle>'); process.exit(2); }
const POSTS = Number(args.posts || 60), FOLLOWERS = Number(args.followers || 300), FANS = Number(args.fans || 450), PAGES = Number(args.pages || 4);
const MIN_SHARED = Number(args['min-shared'] || 3), CAP = Number(args['cap-usd'] || 3), TOP = Number(args.top || 25), LOOKUPS = Number(args.lookups || 250);
const TAGGED_PAGES = Number(args['tagged-pages'] || 30);
const OUTLIER = Number(args['outlier-lift'] || 3);
const EXCLUDE = new Set(String(args.exclude || '').split(',').map(s => s.trim()).filter(Boolean));
const OUT = resolve(args.out || `fan-overlap/ig-${HANDLE}`);
const TREG = process.env.TREG_BIN || `${process.env.HOME}/.local/bin/treg`;
let spent = 0; const log = (...a) => console.log(...a);

function treg(id, { query, body } = {}) {
  if (spent > CAP) return Promise.reject(new Error('cap'));
  const a = ['--json', 'call', id];
  if (body) a.push('--method', 'POST', '--header', 'X-Treg-Route-Max-Cost: 0.01', '--data', JSON.stringify(body));
  for (const [k, v] of Object.entries(query || {})) a.push('--query', `${k}=${v}`);
  return new Promise((res, rej) => execFile(TREG, a, { maxBuffer: 1 << 27, timeout: 120000 }, (err, out) => {
    if (err && !out) return rej(err);
    try { const j = JSON.parse(out); spent += (j._treg?.charged_micro || 0) / 1e6; if ((j._treg?.http_status || 200) >= 400) return rej(new Error(`${id} HTTP ${j._treg.http_status}`)); res(j.result?.output || j.result || {}); } catch (e) { rej(e); }
  }));
}
const pool = async (items, n, fn) => { let i = 0; await Promise.all(Array.from({ length: n }, async () => { while (i < items.length && spent <= CAP) await fn(items[i++]); })); };

// Category buckets
const PERSON = /public figure|artist|athlete|musician|band|blogger|digital creator|creator|actor|personal|video creator|gamer|comedian|entrepreneur|photographer|model|writer|author|journalist|coach|dj|producer|chef|surfer|golfer|skater|influencer/i;
const FOOD = /restaurant|fast food|coffee|cafe|bakery|pizza|burger|food|beverage|bar\b|brewery|winery|grocery|deli|dessert|ice cream|juice|tea|wine|spirits|liquor/i;
const EVERYDAY = /bank|telecom|phone|pharmacy|supermarket|department store|discount|gas|airline|hotel|news|media|tv|television|magazine|radio|government|sports team|league|university|school/i;

mkdirSync(OUT, { recursive: true });
const report = { brand_a: `@${HANDLE}`, method: 'instagram follow overlap', built_at: new Date().toISOString(), settings: { posts: POSTS, followers: FOLLOWERS, fans: FANS, pages: PAGES, min_shared: MIN_SHARED, exclude: [...EXCLUDE] },
  privacy: 'Only public accounts followed by min_shared+ fans are saved, as totals. Fans\' usernames were used in memory and dropped.', sources: { fans: 'tikhub instagram tagged posts (customers wearing it) + scrapecreators post comments (engaged) + tikhub followers (newest ~50)', following: 'tikhub instagram following', profiles: 'treg instagram.user.profile (routed)' } };
try {
  // ---- 1a. Brand profile + recent posts
  const prof = await treg('scrapecreators.instagram.user.profile', { query: { handle: HANDLE } });
  const u = prof.data?.user || {};
  report.place_a = { name: u.full_name || HANDLE, handle: HANDLE, followers: u.edge_followed_by?.count ?? null, following: u.edge_follow?.count ?? null, category: u.category_name || null };
  const posts = []; let next;
  while (posts.length < POSTS) {
    const o = await treg('scrapecreators.instagram.user.posts', { query: { handle: HANDLE, ...(next ? { next_max_id: next } : {}) } }).catch(() => ({}));
    const items = o.items || o.posts || o.data?.items || [];
    for (const p of items) { const code = p.code || p.shortcode; if (code) posts.push(code); }
    next = o.next_max_id || o.paging_info?.max_id; if (!items.length || !next || !(o.more_available ?? true)) break;
  }
  log(`1. @${HANDLE}: ${report.place_a.followers} followers, ${posts.length} recent posts`);
  // ---- 1b. Engaged fans: commenters
  const fans = new Map(); // username -> source (memory only)
  await pool(posts.slice(0, POSTS), 4, async code => {
    let cursor, pages = 0;
    do { const o = await treg('scrapecreators.instagram.post.comments', { query: { url: `https://www.instagram.com/p/${code}/`, ...(cursor ? { cursor } : {}) } }).catch(() => ({}));
      for (const c of o.comments || []) { const n = c.user?.username; if (n && n.toLowerCase() !== HANDLE && !c.user?.is_verified) fans.set(n, 'commenter'); }
      cursor = o.cursor; pages++; } while (cursor && pages < 3);
  });
  const commenters = fans.size;
  // ---- 1c. Customers: people who post themselves tagging the brand (personal/creator accounts; shops tagging it are skipped)
  let tTok = null, tagged = 0;
  for (let p = 0; p < TAGGED_PAGES; p++) {
    const o = await treg('tikhub.x.instagram-v2-fetch-user-tagged-posts', { query: { username: HANDLE, ...(tTok ? { pagination_token: tTok } : {}) } }).catch(() => ({}));
    const d = o.data || {}; const items = d.data?.items || [];
    for (const x of items) { const w = x.user || x.owner || {}; if (w.username && !w.is_private && !w.is_verified && w.account_type !== 2 && w.username.toLowerCase() !== HANDLE && !fans.has(w.username)) { fans.set(w.username, 'tagger'); tagged++; } }
    tTok = d.pagination_token; if (!items.length || !tTok) break;
  }
  // ---- 1d. Follower sample (the API returns only the newest ~50)
  let tok = null, fol = 0;
  for (let p = 0; fol < FOLLOWERS && p < Math.ceil(FOLLOWERS / 50) + 2; p++) {
    const o = await treg('tikhub.x.instagram-v2-fetch-user-followers', { query: { username: HANDLE, ...(tok ? { pagination_token: tok } : {}) } }).catch(() => ({}));
    const d = o.data || {}; const items = d.data?.items || [];
    for (const x of items) if (!x.is_private && !x.is_verified && !fans.has(x.username)) { fans.set(x.username, 'follower'); fol++; }
    tok = d.pagination_token; if (!items.length || !tok) break;
  }
  report.coverage = { posts_read: posts.length, commenters, taggers: tagged, followers_sampled: fol };
  log(`   fans: ${tagged} people tagging @${HANDLE} + ${commenters} commenters + ${fol} public followers`);

  // ---- 2. What each fan follows
  const counts = new Map(); const seenBy = { tagger: new Map(), commenter: new Map(), follower: new Map() }; let done = 0, privateOrEmpty = 0;
  const order = { tagger: 0, commenter: 1, follower: 2 };
  const list = [...fans.entries()].sort((a, b) => order[a[1]] - order[b[1]]).slice(0, FANS);
  await pool(list, 6, async ([fan, src]) => {
    let t = null, got = 0; const mine = new Set();
    for (let p = 0; p < PAGES; p++) {
      const o = await treg('tikhub.x.instagram-v2-fetch-user-following', { query: { username: fan, ...(t ? { pagination_token: t } : {}) } }).catch(() => null);
      const d = o?.data || {}; const items = d.data?.items || [];
      for (const x of items) { const n = String(x.username || '').toLowerCase(); if (n && n !== HANDLE) mine.add(n + '|' + (x.is_verified ? 1 : 0)); }
      got += items.length; t = d.pagination_token; if (!items.length || !t) break;
    }
    if (!got) { privateOrEmpty++; return; }
    done++;
    for (const k of mine) { counts.set(k, (counts.get(k) || 0) + 1); const m = seenBy[src]; m.set(k, (m.get(k) || 0) + 1); }
    if (done % 50 === 0) log(`   ${done} fans read · ~$${spent.toFixed(2)}`);
  });
  fans.clear();
  report.coverage.fans_read = done; report.coverage.fans_private_or_empty = privateOrEmpty;
  log(`2. ${done} fans' following lists read (${privateOrEmpty} private/empty) · ~$${spent.toFixed(2)}`);

  // ---- 3/4. Accounts followed by min_shared+ fans -> profiles
  let cands = [...counts.entries()].filter(([, n]) => n >= MIN_SHARED).sort((a, b) => b[1] - a[1]).slice(0, LOOKUPS)
    .map(([k, n]) => { const [handle, v] = k.split('|'); return { handle, verified: v === '1', shared: n, from_taggers: seenBy.tagger.get(k) || 0, from_commenters: seenBy.commenter.get(k) || 0, from_followers: seenBy.follower.get(k) || 0 }; });
  counts.clear(); Object.values(seenBy).forEach(m => m.clear());
  await pool(cands, 6, async c => {
    const o = await treg('tikhub.instagram.user.profile', { query: { username: c.handle } }).catch(() => ({}));
    const p = o.data?.data?.user || o.data?.user || o.user || {};
    c.name = p.full_name || p.fullName || c.handle;
    c.followers = Number(p.follower_count ?? p.edge_followed_by?.count ?? p.followers) || null;
    c.category = p.category_name || p.business_category_name || null;
    c.is_business = !!p.is_business_account; c.professional = !!p.is_professional_account;
    c.bio = String(p.biography || p.bio || '').replace(/\s+/g, ' ').slice(0, 140);
    c.url = p.external_url || null;
    // Instagram hides categories from these APIs: guess brand vs person from name/bio/link (review the top by hand).
    const text = `${c.name} ${c.bio}`;
    c.brand_signals = /\b(shop|store|official|apparel|clothing|brand|co\.|company|supply|goods|outfitters|wear|collection|made in|worldwide shipping|free shipping|®|™|est\.? ?\d{4}|since \d{4}|black friday|sale|drop|golf club|resort|hotel|magazine|tour)\b/i.test(text) || /shop|store|\.co\b/i.test(c.url || '');
    c.person_signals = /^[A-Z][a-z]+ [A-Z][a-z'-]+( [A-Z][a-z]+)?$/.test(c.name || '') || /\b(dad|mom|husband|wife|father|mother|my |i'm|i am|he\/him|she\/her|creator|athlete|pga tour pro|coach|influencer|host of|comedian|actor|ugc)\b/i.test(c.bio);
  });
  const fansN = Math.max(1, report.coverage.fans_read);
  for (const c of cands) {
    c.share_of_fans = Math.round(1000 * c.shared / fansN) / 10;
    c.kind = c.category && PERSON.test(c.category) ? 'creator/person' : c.category || c.is_business ? 'brand' : c.brand_signals && !c.person_signals ? 'brand' : c.person_signals ? 'creator/person' : c.professional ? 'brand?' : 'person';
    c.noise = (EXCLUDE.has('food') && FOOD.test(c.category || '')) || (EXCLUDE.has('everyday') && EVERYDAY.test(c.category || '')) || (EXCLUDE.has('chains') && (c.followers || 0) > 5e6);
  }
  const rate = c => c.followers ? c.shared / Math.sqrt(c.followers) : null;
  const med = (xs => xs.length ? xs[Math.floor(xs.length / 2)] : null)(cands.filter(c => c.kind !== 'person' && c.kind !== 'creator/person').map(rate).filter(x => x != null).sort((a, b) => a - b));
  for (const c of cands) {
    c.lift = med && rate(c) != null ? Math.round(100 * rate(c) / med) / 100 : null;
    c.confidence = c.shared >= 15 ? 'high' : c.shared >= 7 ? 'medium' : 'low';
    c.affinity = Math.round(100 * (c.lift ?? 1) * Math.log2(1 + c.shared)) / 100;
    c.locations = 1; c.competitor = /hat|headwear|cap\b|apparel|clothing|fashion/i.test((c.category || '') + ' ' + c.bio) && /hat|cap|headwear/i.test(c.bio + ' ' + c.name);
    c.why = `followed by ${c.shared} of ${fansN} fans (${c.share_of_fans}%)${c.lift != null ? `, lift ${c.lift}` : ''}${c.followers ? `, ${c.followers.toLocaleString()} followers` : ''}`;
  }
  const keep = cands.filter(c => !c.noise);
  report.excluded = { filters: [...EXCLUDE], accounts: cands.filter(c => c.noise).map(c => ({ name: c.name, category: c.category, shared: c.shared })) };
  const brands = keep.filter(c => c.kind === 'brand' || c.kind === 'brand?').sort((a, b) => b.affinity - a.affinity);
  report.brand_b = brands.filter(c => !c.competitor).slice(0, TOP).map(c => ({ ...c, name: c.name || c.handle }));
  report.rivals = brands.filter(c => c.competitor).slice(0, 10);
  report.creators = keep.filter(c => c.kind === 'creator/person' || c.kind === 'person').sort((a, b) => b.affinity - a.affinity).slice(0, 15).filter(c => c.kind === 'creator/person' || c.verified);
  report.all_brands = brands;
  report.coverage.histories_returned = fansN; report.coverage.a_reviews = report.coverage.taggers + report.coverage.commenters + report.coverage.followers_sampled; // graph.mjs labels
  report.checks = { warnings: [fansN < 200 ? `Only ${fansN} fans read: directional.` : null, !report.brand_b.length ? 'No brand reached min-shared.' : null].filter(Boolean) };
} catch (e) { report.error = e.message; console.error('Stopped:', e.message); }
report.spend_usd = Math.round(spent * 100) / 100;
writeFileSync(`${OUT}/ig-overlap.json`, JSON.stringify(report, null, 1));
const row = c => `| ${c.name} (@${c.handle}) | ${c.category || ''} | ${c.shared} (${c.share_of_fans}%) | ${c.lift ?? '-'} | ${c.followers?.toLocaleString() ?? '-'} | ${c.confidence} |`;
const head = '| Account | Category | Fans following | Lift | Followers | Confidence |\n|---|---|---|---|---|---|';
const md = [`# People who follow and engage with @${HANDLE} also follow…`, '',
  `Fans: ${report.coverage?.taggers ?? 0} people who tagged @${HANDLE} in their own posts, ${report.coverage?.commenters ?? 0} commenters on ${report.coverage?.posts_read ?? 0} recent posts + ${report.coverage?.followers_sampled ?? 0} recent public followers; ${report.coverage?.fans_read ?? 0} following lists read. Lift 1.0 = a typical brand in this list; higher = followed more than its size explains.`, '',
  `## Outliers: every brand with lift >= ${OUTLIER}`, '', head, ...(report.all_brands || []).filter(c => (c.lift ?? 0) >= OUTLIER).sort((x, y) => y.lift - x.lift).map(row), '',
  '## Top brands by affinity', '', head, ...(report.brand_b || []).map(row), '',
  report.rivals?.length ? `## Other hat / apparel brands\n\n${head}\n${report.rivals.map(row).join('\n')}\n` : '',
  report.creators?.length ? `## Creators and people they follow\n\n${head}\n${report.creators.map(row).join('\n')}\n` : '',
  report.excluded?.accounts?.length ? `Filtered out (${report.excluded.filters.join(', ')}): ${report.excluded.accounts.slice(0, 20).map(a => a.name).join(', ')}.` : '',
  ...(report.checks?.warnings || []).map(w => `- ⚠ ${w}`), report.error ? `\n**Stopped early:** ${report.error}` : '', `\nSpend: ~$${report.spend_usd} (treg)`].join('\n');
writeFileSync(`${OUT}/ig-overlap.md`, md);
log(`\n${md}\n\nSaved ${OUT}/ig-overlap.json and ig-overlap.md`);
