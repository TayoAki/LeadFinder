#!/usr/bin/env node
// Golf creator trends on TikTok (+ Instagram Reels) via treg: which video patterns repeat across many creators.
//   node golf_trends.mjs [--days 120] [--out ../data]
// Signals, each counted by DISTINCT CREATORS:
//   sounds        the same audio used by several creators (a trend), with total views
//   formats       recurring video types from captions (POV, fit check, rate my, "things golfers…", tips, trick shot…)
//   templates     recurring caption phrases (3-word openers / 3-grams)
//   hashtags      most used, and fastest-rising (share in the last 30 days vs before)
//   breakouts     videos with views far above the creator's follower count (outliers)
import { execFile } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const args = Object.fromEntries(process.argv.slice(2).reduce((a, x, i, all) => (x.startsWith('--') ? [...a, [x.slice(2), all[i + 1]]] : a), []));
const OUT = resolve(args.out || resolve(dirname(fileURLToPath(import.meta.url)), '../data'));
const DAYS = Number(args.days || 120);
const KEYWORDS = ['golf outfit', 'golf fit check', 'golf hat', 'golf fashion', 'golf course vlog', 'golf with friends', 'golf funny', 'golf tips', 'golf trick shot', 'golf girlfriend', 'golf dad', 'golf haul', 'golf trip', 'golf pov', 'golf drip', 'golf gift', 'pickleball outfit', 'golf merch'];
const TREG = `${process.env.HOME}/.local/bin/treg`;
let spent = 0;
const call = (id, query) => new Promise((res, rej) => { const a = ['--json', 'call', id]; for (const [k, v] of Object.entries(query)) a.push('--query', `${k}=${v}`);
  execFile(TREG, a, { maxBuffer: 1 << 27, timeout: 120000 }, (e, out) => { if (e && !out) return rej(e); try { const j = JSON.parse(out); spent += (j._treg?.charged_micro || 0) / 1e6; res(j.result?.output || j.result || {}); } catch (x) { rej(x); } }); });

const FORMATS = {
  'POV': /\bpov\b/i, 'fit check / outfit': /fit ?check|outfit|ootd|what i wore|fits?\b.*golf|golf fits?/i, 'rate my / rank': /rate (my|this|the)|ranking|tier list|ranked/i,
  'things golfers say/do': /things (golfers|every golfer)|types of golfers|every golfer|golfers be like|when your (golf|buddy)/i, 'tips / how to': /\btip(s)?\b|how to|drill|fix your|lesson|instruction|stop (slicing|hooking)/i,
  'trick shot / challenge': /trick shot|challenge|vs\.?|1v1|bet|hole[- ]in[- ]one|ace\b/i, 'couple / girlfriend': /girlfriend|boyfriend|wife|husband|my (gf|bf)|couple/i,
  'dad / family': /\bdad\b|father|my son|my daughter|family|kids?/i, 'haul / unboxing / review': /haul|unbox|review|try on|new gear|what'?s in (my|the) bag|witb/i,
  'shop list / recs': /places to (shop|buy)|brands? (you|to)|where to (buy|shop)|best golf (brands|hats|polos)|gift (guide|ideas)/i, 'vlog / day in the life': /vlog|day in (the|my) life|course vlog|come golf with me|play \d+ holes|round with/i,
  'funny / skit': /funny|skit|comedy|joke|lol|😂|🤣/i, 'trip / destination': /golf trip|bucket list|destination|scotland|pebble|bandon|hawaii|vegas|cabo/i,
};
const now = Date.now() / 1000;
// any timestamp shape -> YYYY-MM-DD, or null
const dayOf = t => { if (t == null || t === '') return null; const n = Number(t); const ms = Number.isFinite(n) ? (n > 1e12 ? n : n * 1000) : Date.parse(t); return Number.isFinite(ms) ? new Date(ms).toISOString().slice(0, 10) : null; };
const vids = new Map();
for (const kw of KEYWORDS) for (const sort of [1, 0]) for (const offset of [0, 20, 40]) {
  const o = await call('tikhub.tiktok.search.videos', { keyword: kw, count: 20, offset, sort_type: sort }).catch(() => ({}));
  for (const it of o.data?.search_item_list || []) { const v = it.aweme_info; if (!v?.aweme_id || vids.has(v.aweme_id)) continue;
    const ageDays = (now - v.create_time) / 86400; if (ageDays > DAYS) continue;
    const s = v.statistics || {};
    vids.set(v.aweme_id, { platform: 'tiktok', id: v.aweme_id, url: `https://www.tiktok.com/@${v.author?.unique_id}/video/${v.aweme_id}`, creator: v.author?.unique_id, followers: v.author?.follower_count || 0,
      desc: v.desc || '', date: new Date(v.create_time * 1000).toISOString().slice(0, 10), age_days: Math.round(ageDays), seconds: Math.round((v.video?.duration || 0) / 1000),
      views: s.play_count || 0, likes: s.digg_count || 0, comments: s.comment_count || 0, saves: s.collect_count || 0, shares: s.share_count || 0,
      sound_id: v.music?.id_str || String(v.music?.id || ''), sound: v.music?.title || '', sound_original: /original sound/i.test(v.music?.title || ''), keyword: kw }); }
}
console.log(`tiktok: ${vids.size} videos from the last ${DAYS} days · ~$${spent.toFixed(3)}`);
mkdirSync(OUT, { recursive: true }); writeFileSync(`${OUT}/golf-videos-tiktok.json`, JSON.stringify([...vids.values()]));
// Instagram Reels (Google-indexed search; fewer fields)
for (const kw of ['golf outfit', 'golf fit check', 'golf hat', 'golf funny', 'golf tips', 'golf dad']) for (const page of [1, 2]) try {
  const o = await call('scrapecreators.x.v2-instagram-reels-search', { query: kw, date_posted: 'last-month', page }).catch(() => ({}));
  for (const r of o.reels || o.items || o.data || []) { const id = r.shortcode || r.code || r.id; if (!id || vids.has('ig' + id)) continue;
    vids.set('ig' + id, { platform: 'instagram', id, url: r.url || `https://www.instagram.com/reel/${id}/`, creator: r.owner?.username || r.user?.username || r.username || null, followers: r.owner?.follower_count || 0,
      desc: r.caption?.text || r.caption || '', date: dayOf(r.taken_at ?? r.taken_at_timestamp ?? r.date), views: r.video_play_count || r.play_count || r.view_count || 0,
      likes: r.like_count || 0, comments: r.comment_count || 0, sound: r.clips_music_attribution_info?.song_name || '', sound_id: r.clips_music_attribution_info?.audio_id || '', keyword: kw }); }
} catch (e) { console.log('  reels:', e.message); }
const all = [...vids.values()];
console.log(`total: ${all.length} videos (${all.filter(v => v.platform === 'instagram').length} reels) · ~$${spent.toFixed(3)}`);

const byCreators = (keyFn) => { const m = new Map(); for (const v of all) for (const k of [].concat(keyFn(v) || [])) { if (!k) continue; const g = m.get(k) || { key: k, creators: new Set(), views: 0, videos: 0, recent: 0, examples: [] }; g.creators.add(v.creator); g.views += v.views; g.videos++; if (v.age_days != null && v.age_days <= 30) g.recent++; g.examples.push(v); m.set(k, g); } return [...m.values()].map(g => ({ ...g, creators: g.creators.size, examples: g.examples.sort((a, b) => b.views - a.views).slice(0, 3).map(e => ({ url: e.url, creator: e.creator, views: e.views, desc: e.desc.slice(0, 120) })) })); };
const median = xs => { xs = xs.filter(x => x != null).sort((a, b) => a - b); return xs.length ? xs[Math.floor(xs.length / 2)] : 0; };
const fmt = byCreators(v => Object.entries(FORMATS).filter(([, re]) => re.test(v.desc)).map(([k]) => k)).map(g => ({ ...g, median_views: median(all.filter(v => FORMATS[g.key].test(v.desc)).map(v => v.views)) })).sort((a, b) => b.creators - a.creators);
const sounds = byCreators(v => v.sound_id && !v.sound_original ? `${v.sound} [${v.sound_id}]` : null).filter(g => g.creators >= 2).sort((a, b) => b.creators - a.creators || b.views - a.views).slice(0, 20);
const clean = d => d.toLowerCase().replace(/#[\w]+/g, ' ').replace(/@[\w.]+/g, ' ').replace(/https?:\S+/g, ' ').replace(/\d+/g, '#').replace(/[^a-z#' ]+/g, ' ').replace(/\s+/g, ' ').trim();
const STOP = new Set(['the', 'a', 'and', 'to', 'of', 'in', 'on', 'for', 'my', 'is', 'it', 'i', 'you', 'this', 'with', 'at', 'your', 'be', 'that', 'me', 'we', 'so', 'just', 'when', 'what']);
const grams = v => { const w = clean(v.desc).split(' ').filter(Boolean); const g = new Set(); for (let i = 0; i + 2 < w.length; i++) { const t = w.slice(i, i + 3); if (t.filter(x => !STOP.has(x)).length >= 2) g.add(t.join(' ')); } return [...g]; };
const templates = byCreators(grams).filter(g => g.creators >= 3).sort((a, b) => b.creators - a.creators).slice(0, 30);
const tagsOf = v => [...new Set((v.desc.match(/#[\w]+/g) || []).map(t => t.toLowerCase()))];
const tags = byCreators(tagsOf).filter(g => g.creators >= 3).map(g => ({ ...g, recent_share: Math.round(100 * g.recent / g.videos) })).sort((a, b) => b.creators - a.creators).slice(0, 40);
const baseRecent = Math.round(100 * all.filter(v => v.age_days <= 30).length / Math.max(1, all.filter(v => v.age_days != null).length));
const rising = tags.filter(t => t.videos >= 5 && t.recent_share >= baseRecent + 20).sort((a, b) => b.recent_share - a.recent_share).slice(0, 12);
const breakouts = all.filter(v => v.followers >= 500 && v.views >= 50000).map(v => ({ ...v, views_per_follower: Math.round(10 * v.views / v.followers) / 10 })).sort((a, b) => b.views_per_follower - a.views_per_follower).slice(0, 25)
  .map(v => ({ url: v.url, creator: v.creator, followers: v.followers, views: v.views, views_per_follower: v.views_per_follower, seconds: v.seconds, sound: v.sound, desc: v.desc.slice(0, 140), formats: Object.entries(FORMATS).filter(([, re]) => re.test(v.desc)).map(([k]) => k) }));
const lengths = [[0, 15], [15, 30], [30, 60], [60, 180], [180, 1e9]].map(([a, b]) => { const g = all.filter(v => v.seconds != null && v.seconds >= a && v.seconds < b); return { range: `${a}-${b === 1e9 ? '+' : b}s`, videos: g.length, median_views: median(g.map(v => v.views)), save_rate: Math.round(10000 * g.reduce((n, v) => n + v.saves, 0) / Math.max(1, g.reduce((n, v) => n + v.views, 0))) / 100 }; });

mkdirSync(OUT, { recursive: true });
const summary = { built: new Date().toISOString(), window_days: DAYS, keywords: KEYWORDS, videos: all.length, creators: new Set(all.map(v => v.creator)).size, spend_usd: Math.round(spent * 1000) / 1000, formats: fmt, sounds, templates, hashtags: tags, rising_hashtags: rising, breakouts, lengths };
writeFileSync(`${OUT}/golf-trends.json`, JSON.stringify(summary, null, 1));
writeFileSync(`${OUT}/golf-videos.json`, JSON.stringify(all.map(({ desc, ...v }) => ({ ...v, desc: desc.slice(0, 200) })), null, 0));
console.log(`saved ${OUT}/golf-trends.json · ${summary.creators} creators · ~$${spent.toFixed(3)}`);
