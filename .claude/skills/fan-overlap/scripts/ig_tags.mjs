#!/usr/bin/env node
// Instagram tag overlap: "what do people tag alongside @brand, and what else do they tag?" (all through treg/tikhub).
//   1. posts where people tag @brand: every other account tagged in the photo, @mentioned in the caption,
//      co-authored or paid-partnership tagged → "worn / used together"
//   2. the same people's own recent posts → which brands they tag in general
// Counted by DISTINCT POSTERS (one person tagging the same brand ten times counts once). Accounts tagged by
// >= --min-posters people are looked up (followers, bio) and split into brands vs people. Hashtags are counted too.
// Privacy: posters' usernames stay in memory; only public accounts tagged by min-posters+ people are saved, as totals.
//
// usage: node ig_tags.mjs --handle melin [--tagged-pages 60] [--own-pages 2] [--min-posters 3] [--cap-usd 1.5] [--out DIR]
import { execFile } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const args = Object.fromEntries(process.argv.slice(2).reduce((a, x, i, all) => (x.startsWith('--') ? [...a, [x.slice(2), all[i + 1] && !all[i + 1].startsWith('--') ? all[i + 1] : true]] : a), []));
const HANDLE = String(args.handle || '').replace(/^@/, '').toLowerCase();
if (!HANDLE) { console.error('usage: node ig_tags.mjs --handle <instagram handle>'); process.exit(2); }
const TPAGES = Number(args['tagged-pages'] || 60), OWN = Number(args['own-pages'] || 2), MIN = Number(args['min-posters'] || 3);
const CAP = Number(args['cap-usd'] || 1.5), LOOKUPS = Number(args.lookups || 120);
const OUT = resolve(args.out || `fan-overlap/ig-${HANDLE}`);
const TREG = process.env.TREG_BIN || `${process.env.HOME}/.local/bin/treg`;
let spent = 0; const log = (...a) => console.log(...a);
// feeds stop at 85% of the cap so the profile lookups at the end always have budget
const treg = (id, query) => spent > (/profile/.test(id) ? CAP : CAP * 0.85) ? Promise.reject(new Error('cap')) : new Promise((res, rej) => {
  const a = ['--json', 'call', id]; for (const [k, v] of Object.entries(query)) a.push('--query', `${k}=${v}`);
  execFile(TREG, a, { maxBuffer: 1 << 27, timeout: 120000 }, (err, out) => { if (err && !out) return rej(err);
    try { const j = JSON.parse(out); spent += (j._treg?.charged_micro || 0) / 1e6; if ((j._treg?.http_status || 200) >= 400) return rej(new Error(`HTTP ${j._treg.http_status}`)); res(j.result?.output || j.result || {}); } catch (e) { rej(e); } });
});
const pool = async (items, n, fn) => { let i = 0; await Promise.all(Array.from({ length: n }, async () => { while (i < items.length && spent <= CAP * 0.85 + (fn.lookup ? CAP * 0.15 : 0)) await fn(items[i++]); })); };

// accounts a post points at: photo tags, caption @mentions, co-authors, paid-partnership tags
const pointsAt = p => {
  const s = new Set();
  for (const t of p.usertags?.in || p.tagged_users || []) if (t.user?.username) s.add(t.user.username.toLowerCase());
  for (const m of String(p.caption?.text || '').match(/@([\w.]+[\w])/g) || []) s.add(m.slice(1).toLowerCase());
  for (const m of p.caption?.mentions || []) if (typeof m === 'string') s.add(m.replace(/^@/, '').toLowerCase());
  for (const c of p.coauthor_producers || []) if (c.username) s.add(c.username.toLowerCase());
  for (const t of p.sponsor_tags || []) if (t.sponsor?.username || t.username) s.add((t.sponsor?.username || t.username).toLowerCase());
  return s;
};
const tagsOf = p => new Set((String(p.caption?.text || '').match(/#[\p{L}\p{N}_]+/gu) || []).map(h => h.toLowerCase()));

mkdirSync(OUT, { recursive: true });
const report = { brand_a: `@${HANDLE}`, method: 'instagram tag overlap', built_at: new Date().toISOString(), settings: { tagged_pages: TPAGES, own_pages: OWN, min_posters: MIN },
  privacy: 'Counted by distinct posters; posters are never saved. Only public accounts tagged by min_posters+ people are listed, as totals.', sources: { tagged: 'tikhub instagram tagged posts', own_posts: 'tikhub instagram user posts', profiles: 'tikhub instagram profile' } };
try {
  // ---- 1. Posts tagging the brand
  const withBrand = new Map(), withBrandTags = new Map(); const posters = new Map(); // poster -> is shop
  let tok = null, posts = 0;
  for (let p = 0; p < TPAGES; p++) {
    const o = await treg('tikhub.x.instagram-v2-fetch-user-tagged-posts', { username: HANDLE, ...(tok ? { pagination_token: tok } : {}) }).catch(() => ({}));
    const d = o.data || {}; const items = d.data?.items || [];
    for (const x of items) {
      const w = x.user || x.owner || {}; const who = String(w.username || '').toLowerCase(); if (!who || who === HANDLE) continue;
      posts++; posters.set(who, w.account_type === 2);
      for (const a of pointsAt(x)) if (a !== HANDLE && a !== who) { (withBrand.get(a) || withBrand.set(a, new Set()).get(a)).add(who); }
      for (const t of tagsOf(x)) (withBrandTags.get(t) || withBrandTags.set(t, new Set()).get(t)).add(who);
    }
    tok = d.pagination_token; if (!items.length || !tok) break;
  }
  report.coverage = { posts_tagging_brand: posts, posters: posters.size, shop_posters: [...posters.values()].filter(Boolean).length };
  log(`1. ${posts} posts tagging @${HANDLE} by ${posters.size} accounts · ~$${spent.toFixed(2)}`);

  // ---- 2. The same people's own recent posts (personal/creator accounts only)
  const elsewhere = new Map(), elsewhereTags = new Map(); let read = 0;
  await pool([...posters.entries()].filter(([, shop]) => !shop).map(([u]) => u), 6, async who => {
    let next = null, got = 0;
    for (let p = 0; p < OWN; p++) {
      const o = await treg('tikhub.x.instagram-v2-fetch-user-posts', { username: who, ...(next ? { pagination_token: next } : {}) }).catch(() => null);
      const d = o?.data || {}; const items = d.data?.items || [];
      for (const x of items) { for (const a of pointsAt(x)) if (a !== who && a !== HANDLE) (elsewhere.get(a) || elsewhere.set(a, new Set()).get(a)).add(who);
        for (const t of tagsOf(x)) (elsewhereTags.get(t) || elsewhereTags.set(t, new Set()).get(t)).add(who); }
      got += items.length; next = d.pagination_token; if (!items.length || !next) break;
    }
    if (got) read++;
  });
  report.coverage.own_feeds_read = read;
  log(`2. ${read} posters' own feeds read · ~$${spent.toFixed(2)}`);

  // ---- 3. Totals, then profiles for the accounts that clear the bar
  const total = (m, n) => [...m.entries()].map(([k, s]) => [k, s.size]).filter(([, c]) => c >= MIN).sort((a, b) => b[1] - a[1]);
  const together = total(withBrand), other = total(elsewhere);
  const accounts = new Map();
  for (const [h, c] of together) accounts.set(h, { handle: h, tagged_with_brand: c, tagged_elsewhere: 0 });
  for (const [h, c] of other) (accounts.get(h) || accounts.set(h, { handle: h, tagged_with_brand: 0, tagged_elsewhere: 0 }).get(h)).tagged_elsewhere = c;
  const hashtags = { with_brand: total(withBrandTags).slice(0, 25), elsewhere: total(elsewhereTags).slice(0, 25) };
  for (const m of [withBrand, elsewhere, withBrandTags, elsewhereTags]) { for (const s of m.values()) s.clear(); m.clear(); } posters.clear();
  const list = [...accounts.values()].sort((a, b) => (b.tagged_with_brand + b.tagged_elsewhere) - (a.tagged_with_brand + a.tagged_elsewhere)).slice(0, LOOKUPS);
  const lookup = async c => {
    const o = await treg('tikhub.instagram.user.profile', { username: c.handle }).catch(() => ({}));
    const p = o.data?.data?.user || o.data?.user || {};
    c.name = p.full_name || c.handle; c.followers = Number(p.follower_count ?? p.edge_followed_by?.count) || null; c.verified = !!p.is_verified;
    c.bio = String(p.biography || '').replace(/\s+/g, ' ').slice(0, 140); c.url = p.external_url || null; c.private = !!p.is_private;
    const text = `${c.name} ${c.bio}`;
    const brand = /\b(shop|store|official|apparel|clothing|brand|co\.|company|supply|goods|outfitters|wear|collection|made in|shipping|®|™|est\.? ?\d{4}|since \d{4}|sale|drop|club|resort|hotel|magazine|tour|golf course|country club|brewing|coffee)\b/i.test(text) || /shop|store/i.test(c.url || '');
    const person = /^[A-Z][a-z]+ [A-Z][a-z'-]+( [A-Z][a-z]+)?$/.test(c.name || '') || /\b(dad|mom|husband|wife|father|mother|i'm|he\/him|she\/her|creator|athlete|pro golfer|coach|influencer|host|comedian|actor|ugc)\b/i.test(c.bio);
    c.kind = c.private ? 'private person' : brand && !person ? 'brand' : person ? 'person' : 'unclear';
  }; lookup.lookup = true;
  await pool(list, 6, lookup);
  report.accounts = list.filter(c => c.kind !== 'private person');
  report.hashtags = hashtags;
} catch (e) { report.error = e.message; console.error('Stopped:', e.message); }
report.spend_usd = Math.round(spent * 100) / 100;
writeFileSync(`${OUT}/ig-tags.json`, JSON.stringify(report, null, 1));
const acc = report.accounts || []; const cov = report.coverage || {};
const row = c => `| ${c.name} (@${c.handle}) | ${c.kind} | ${c.tagged_with_brand} | ${c.tagged_elsewhere} | ${c.followers?.toLocaleString() ?? '-'} |`;
const head = `| Account | Looks like | People tagging it WITH @${HANDLE} | People tagging it in their other posts | Followers |\n|---|---|---|---|---|`;
const md = [`# What people tag alongside @${HANDLE}`, '', `${cov.posts_tagging_brand ?? 0} posts tagging @${HANDLE} by ${cov.posters ?? 0} accounts (${cov.shop_posters ?? 0} of them shops); ${cov.own_feeds_read ?? 0} of those people's own feeds read. Counts are distinct people, minimum ${MIN}.`, '',
  '## Brands', '', head, ...acc.filter(c => c.kind === 'brand' || c.kind === 'unclear').map(row), '',
  '## People and creators', '', head, ...acc.filter(c => c.kind === 'person').map(row), '',
  '## Hashtags', '', `With @${HANDLE}: ${(report.hashtags?.with_brand || []).map(([t, n]) => `${t} (${n})`).join(', ') || '-'}`, '', `In their other posts: ${(report.hashtags?.elsewhere || []).map(([t, n]) => `${t} (${n})`).join(', ') || '-'}`,
  report.error ? `\n**Stopped early:** ${report.error}` : '', `\nSpend: ~$${report.spend_usd} (treg)`].join('\n');
writeFileSync(`${OUT}/ig-tags.md`, md);
log(`\n${md}\n\nSaved ${OUT}/ig-tags.json and ig-tags.md`);
