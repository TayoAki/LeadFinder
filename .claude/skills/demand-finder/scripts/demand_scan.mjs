#!/usr/bin/env node
// Demand scan: pulls real demand signals through the treg CLI (keys stay server-side) with a hard spend cap.
//   node demand_scan.mjs --config idea.json --out ./demand/my-idea [--cap 0.40] [--max-x 20] [--max-reddit 25]
// Config: { "idea": "...", "keywords": [...], "x_queries": [...], "reddit_queries": [...], "paid_intent_queries": [...],
//           "location_code": 2840, "language_code": "en" }
// Writes <out>/raw/*.json, <out>/evidence.json and <out>/scan-summary.md. Never posts or contacts anyone.
import { execFile } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const arg = (k, d) => { const i = process.argv.indexOf(`--${k}`); return i > 0 ? process.argv[i + 1] : d; };
const cfgPath = arg('config');
if (!cfgPath) { console.error('usage: demand_scan.mjs --config idea.json --out <dir> [--cap 0.40]'); process.exit(2); }
const cfg = JSON.parse(readFileSync(cfgPath, 'utf8'));
const OUT = arg('out', `./demand/${(cfg.idea || 'idea').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40)}`);
const CAP = Number(arg('cap', '0.40'));
const MAX_X = Number(arg('max-x', '20'));
const MAX_R = Number(arg('max-reddit', '25'));
mkdirSync(join(OUT, 'raw'), { recursive: true });

const run = (args, timeout = 150000) => new Promise(res => execFile('treg', args, { maxBuffer: 64 << 20, timeout },
  (err, stdout, stderr) => res({ err, stdout: String(stdout || ''), stderr: String(stderr || '') })));

async function balanceMicro() {
  const { stdout } = await run(['balance'], 30000);
  const m = /\((\d+) micro-USD\)/.exec(stdout);
  return m ? Number(m[1]) : null;
}

const start = await balanceMicro();
let spentMicro = 0;
const log = [];
async function call(endpoint, body, { query = {}, tag } = {}) {
  if (spentMicro / 1e6 >= CAP) { log.push(`skipped ${endpoint} (${tag}): cap $${CAP} reached`); return null; }
  const args = ['--json', 'call', endpoint, '--method', 'POST', '--data', JSON.stringify(body)];
  for (const [k, v] of Object.entries(query)) args.push('--query', `${k}=${v}`);
  const { stdout, stderr } = await run(args);
  let parsed = null;
  try { parsed = JSON.parse(stdout); } catch { log.push(`unreadable reply from ${endpoint} (${tag}): ${(stderr || stdout).slice(0, 160)}`); return null; }
  spentMicro += Number(parsed?._treg?.charged_micro || 0);
  if (tag) writeFileSync(join(OUT, 'raw', `${tag}.json`), JSON.stringify(parsed, null, 1));
  const r = parsed.result ?? parsed;
  if (r?.error || r?.detail) { log.push(`${endpoint} (${tag}) error: ${JSON.stringify(r.error || r.detail).slice(0, 200)}`); return null; }
  return r;
}
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50);

// ---------- 1. search demand: volume, CPC, 24-month trend ----------
const keywords = [];
if (cfg.keywords?.length) {
  const today = new Date();
  const to = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() - 1, 1)).toISOString().slice(0, 10);
  const from = new Date(Date.UTC(today.getUTCFullYear() - 2, today.getUTCMonth() - 1, 1)).toISOString().slice(0, 10);
  const body = [{ keywords: cfg.keywords.slice(0, 1000), location_code: cfg.location_code ?? 2840, language_code: cfg.language_code ?? 'en', date_from: from, date_to: to }];
  let r = null;
  for (let attempt = 1; attempt <= 3; attempt++) { // the provider rate-limits (task status 50301 "Too many requests"); retry with a pause
    r = await call('dataforseo.google.keywords.volume', body, { tag: 'keywords' });
    const task = r?.tasks?.[0];
    if (task && task.status_code === 20000) break;
    log.push(`keywords attempt ${attempt}: ${task ? `${task.status_code} ${task.status_message}` : 'no task in reply'}`);
    if (attempt < 3) await new Promise(res => setTimeout(res, 20000 * attempt));
  }
  for (const k of r?.tasks?.[0]?.result || []) {
    const ms = (k.monthly_searches || []).map(m => ({ ym: m.year * 100 + m.month, v: m.search_volume ?? 0 })).sort((a, b) => b.ym - a.ym);
    const last6 = ms.slice(0, 6), prev6 = ms.slice(12, 18);
    const avg = a => (a.length ? a.reduce((s, x) => s + x.v, 0) / a.length : null);
    const yoy = avg(prev6) ? Math.round(((avg(last6) - avg(prev6)) / avg(prev6)) * 100) : null;
    keywords.push({ keyword: k.keyword, volume: k.search_volume ?? null, cpc: k.cpc ?? null, competition: k.competition ?? null,
      yoy_pct_last6_vs_year_before: yoy, months: ms.slice(0, 24).reverse() });
  }
  keywords.sort((a, b) => (b.volume || 0) - (a.volume || 0));
}

// ---------- 2. X: tweet tests other people already ran ----------
const x = [];
for (const q of cfg.x_queries || []) {
  const r = await call('anyapi.x.search.posts', { query: q, limit: MAX_X }, { query: { max_items: MAX_X }, tag: `x-${slug(q)}` });
  const items = r?.output?.data?.items || [];
  const posts = items.map(p => {
    const eng = (p.likeCount || 0) + (p.retweetCount || 0) * 2 + (p.replyCount || 0) * 2 + (p.quoteCount || 0) * 2 + (p.bookmarkCount || 0);
    return { url: p.authorUsername && p.id ? `https://x.com/${p.authorUsername}/status/${p.id}` : null, created: p.createdUtc ? new Date(p.createdUtc * 1000).toISOString().slice(0, 10) : null,
      text: String(p.text || '').replace(/\s+/g, ' ').slice(0, 280), likes: p.likeCount || 0, replies: p.replyCount || 0, reposts: p.retweetCount || 0,
      quotes: p.quoteCount || 0, bookmarks: p.bookmarkCount || 0, views: p.viewCount ?? null, followers: p.authorFollowers ?? null,
      engagement: eng, engagement_per_1k_followers: p.authorFollowers ? Math.round((eng / Math.max(p.authorFollowers, 1)) * 1000) : null, is_reply: Boolean(p.isReply) };
  }).sort((a, b) => b.engagement - a.engagement);
  x.push({ query: q, n: posts.length, total_likes: posts.reduce((s, p) => s + p.likes, 0), top: posts.slice(0, 10) });
}

// ---------- 3. Reddit: asks and complaints in buyers' words ----------
const reddit = [];
for (const q of cfg.reddit_queries || []) {
  const query = typeof q === 'string' ? q : q.query;
  const sub = typeof q === 'string' ? null : q.subreddit;
  let posts = [];
  const a = await call('crawl4ai.reddit.search.posts', { query, limit: MAX_R, sort: 'relevance', ...(sub ? { subreddit: sub } : {}) }, { tag: `reddit-${slug(query)}` });
  const aItems = Array.isArray(a) ? a : a?.posts || a?.output?.posts || a?.results || [];
  if (aItems.length) posts = aItems;
  else { // fallback source
    const b = await call('anyapi.reddit.search', { query: sub ? `${query} subreddit:${sub}` : query, sort: 'relevance', timeframe: 'year' }, { query: { max_items: MAX_R }, tag: `reddit2-${slug(query)}` });
    posts = b?.output?.data?.posts || [];
  }
  const norm = posts.map(p => ({ title: p.title, url: p.url || (p.permalink ? `https://www.reddit.com${p.permalink}` : null), subreddit: p.subreddit || p.subreddit_name || null,
    score: p.score ?? p.ups ?? null, comments: p.numComments ?? p.num_comments ?? null,
    created: p.createdUtc || p.created_utc ? new Date((p.createdUtc || p.created_utc) * 1000).toISOString().slice(0, 10) : (p.created || null),
    snippet: String(p.selftext || p.text || '').replace(/\s+/g, ' ').slice(0, 240) }));
  reddit.push({ query, subreddit: sub, n: norm.length, last_12_months: norm.filter(p => p.created && Date.now() - Date.parse(p.created) < 365 * 864e5).length, posts: norm });
}

// ---------- 4. paid intent: people paying humans to do the job ----------
const paid = [];
const findResults = o => { // the SERP payload shape varies by source; collect objects that look like results
  const out = [];
  const walk = v => { if (Array.isArray(v)) v.forEach(walk); else if (v && typeof v === 'object') { if ((v.link || v.url) && v.title) out.push(v); else Object.values(v).forEach(walk); } };
  walk(o); return out;
};
for (const q of cfg.paid_intent_queries || []) {
  const r = await call('anyapi.google.serp.organic', { query: q, gl: 'us', autocorrect: false }, { tag: `serp-${slug(q)}` });
  const results = findResults(r).map(v => ({ title: v.title, url: v.link || v.url, snippet: String(v.snippet || v.description || '').slice(0, 200) }));
  paid.push({ query: q, n: results.length, results });
}

const end = await balanceMicro();
const spend = { cap_usd: CAP, charged_usd: +(spentMicro / 1e6).toFixed(4), balance_before_usd: start != null ? start / 1e6 : null,
  balance_after_usd: end != null ? end / 1e6 : null, note: 'balance is shared with other jobs on the team; charged_usd sums this run\'s per-call charges' };
const evidence = { idea: cfg.idea, scanned_at: new Date().toISOString(), keywords, x, reddit, paid_intent: paid, spend, log };
writeFileSync(join(OUT, 'evidence.json'), JSON.stringify(evidence, null, 1));

// ---------- summary ----------
const L = [];
L.push(`# Demand scan: ${cfg.idea || ''}`, '', `Scanned ${evidence.scanned_at.slice(0, 10)}. Spend $${spend.charged_usd} (cap $${CAP}). Raw data in \`raw/\`, everything in \`evidence.json\`.`, '');
if (keywords.length) {
  L.push('## Search demand (US monthly, Google Ads)', '', '| Keyword | Volume | CPC $ | YoY % | Competition |', '|---|---|---|---|---|');
  for (const k of keywords) L.push(`| ${k.keyword} | ${k.volume ?? '—'} | ${k.cpc ?? '—'} | ${k.yoy_pct_last6_vs_year_before ?? '—'} | ${k.competition ?? '—'} |`);
  L.push('', `Total volume: ${keywords.reduce((s, k) => s + (k.volume || 0), 0)} (terms overlap, so this overstates distinct searchers). Volumes under ~100 are noisy.`, '');
}
if (x.length) {
  L.push('## X posts (tweet tests already run)', '');
  for (const q of x) {
    L.push(`**${q.query}**: ${q.n} posts, ${q.total_likes} likes in total.`, '');
    for (const p of q.top.slice(0, 5)) L.push(`- ${p.likes} likes · ${p.replies} replies · ${p.reposts} reposts · ${p.followers ?? '?'} followers · ${p.engagement_per_1k_followers ?? '?'} eng/1k followers · ${p.created}: "${p.text.slice(0, 140)}" ${p.url || ''}`);
    L.push('');
  }
}
if (reddit.length) {
  L.push('## Reddit (asks and complaints)', '');
  for (const q of reddit) {
    L.push(`**${q.query}${q.subreddit ? ` (r/${q.subreddit})` : ''}**: ${q.n} posts, ${q.last_12_months} in the last 12 months.`, '');
    for (const p of [...q.posts].sort((a, b) => (b.comments || 0) - (a.comments || 0)).slice(0, 5)) L.push(`- ${p.comments ?? '?'} comments · score ${p.score ?? '?'} · ${p.created || '?'} · r/${p.subreddit || '?'}: ${p.title} ${p.url || ''}`);
    L.push('');
  }
}
if (paid.length) {
  L.push('## Paid intent (search results)', '');
  for (const q of paid) { L.push(`**${q.query}**: ${q.n} results`, ''); for (const r of q.results.slice(0, 8)) L.push(`- ${r.title} ${r.url}`); L.push(''); }
}
if (log.length) L.push('## Notes', '', ...log.map(s => `- ${s}`), '');
L.push('Counts are samples, not totals. "No results" means "not found by these queries", not "no demand".');
writeFileSync(join(OUT, 'scan-summary.md'), L.join('\n'));
console.log(`wrote ${OUT}/evidence.json and scan-summary.md · spend $${spend.charged_usd} of $${CAP}${log.length ? ` · ${log.length} notes` : ''}`);
