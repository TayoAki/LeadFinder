#!/usr/bin/env node
// Golf TikTok slideshow (photo-post) outliers via treg/tikhub: which slideshow formulas win in golf.
//   node golf_slideshows.mjs [--out ../data]
// Keeps photo posts only (image_post_info). Outlier = plays / creator followers >= 5 (min 10k plays).
import { execFile } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const OUT = resolve(dirname(fileURLToPath(import.meta.url)), '../data');
const KW = ['golf outfit', 'golf outfit ideas', 'golf fits', 'golf hat', 'golf hats', 'golf gift ideas', 'gifts for golfers', 'golf trip', 'golf tips', 'golf course', 'golf aesthetic', 'golf girl outfit', 'golf dad', 'golf brands', 'golf swing tips', 'golf bachelor party', 'golf humor', 'golf etiquette'];
const TREG = `${process.env.HOME}/.local/bin/treg`;
let spent = 0;
const call = q => new Promise((res, rej) => { const a = ['--json', 'call', 'tikhub.x.tiktok-web-fetch-search-photo']; for (const [k, v] of Object.entries(q)) a.push('--query', `${k}=${v}`);
  execFile(TREG, a, { maxBuffer: 1 << 27, timeout: 120000 }, (e, out) => { if (e && !out) return rej(e); try { const j = JSON.parse(out); spent += (j._treg?.charged_micro || 0) / 1e6; res(j.result?.output || j.result || {}); } catch (x) { rej(x); } }); });
const posts = new Map();
// TikTok's video search leaves photo posts out, so use the photo-post search (tikhub web, $0.001/call), 3 pages per keyword.
for (const keyword of KW) { let search_id = '';
  for (const offset of [0, 20, 40]) {
    const o = await call({ keyword, count: 20, offset, ...(search_id ? { search_id } : {}) }).catch(() => ({}));
    const d = o.data || {}; search_id = d.log_pb?.impr_id || d.extra?.logid || search_id;
    for (const v of d.item_list || []) { if (!v?.imagePost || posts.has(v.id)) continue;
      const s = v.stats || {}; const a = v.authorStats || {};
      posts.set(v.id, { id: v.id, url: `https://www.tiktok.com/@${v.author?.uniqueId}/photo/${v.id}`, creator: v.author?.uniqueId, followers: a.followerCount || 0,
        date: new Date(Number(v.createTime) * 1000).toISOString().slice(0, 10), slides: (v.imagePost.images || []).length, desc: (v.desc || '').slice(0, 300), title: v.imagePost.title || '',
        plays: Number(s.playCount) || 0, likes: Number(s.diggCount) || 0, saves: Number(s.collectCount) || 0, shares: Number(s.shareCount) || 0, comments: Number(s.commentCount) || 0,
        sound: v.music?.title || '', keyword }); }
    process.stdout.write('.');
    if (!d.has_more) break;
  }
}
const all = [...posts.values()].map(p => ({ ...p, ratio: p.followers ? Math.round(10 * p.plays / p.followers) / 10 : null, saves_per_1k: p.plays ? Math.round(10000 * p.saves / p.plays) / 10 : null }));
const outliers = all.filter(p => p.plays >= 10000 && (p.ratio ?? 0) >= 5).sort((a, b) => b.saves_per_1k - a.saves_per_1k);
mkdirSync(OUT, { recursive: true });
writeFileSync(`${OUT}/golf-slideshows.json`, JSON.stringify({ built: new Date().toISOString(), keywords: KW, spend_usd: Math.round(spent * 1000) / 1000, slideshows: all.length, outliers }, null, 1));
console.log(`\n${all.length} golf slideshows, ${outliers.length} outliers (5x+ followers, 10k+ plays) · ~$${spent.toFixed(3)}`);
for (const p of outliers.slice(0, 60)) console.log(`${p.saves_per_1k}/1k saves | ${p.ratio}x | ${p.plays.toLocaleString()} plays | ${p.slides} slides | @${p.creator} | ${(p.title + ' ' + p.desc).replace(/\s+/g, ' ').slice(0, 130)}`);
