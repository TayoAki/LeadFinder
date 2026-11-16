// Group the golf slideshow outliers into formulas and rank them (median saves per 1k plays, then creators).
// A formula is "proven" with 3+ posts from 2+ creators.
import { readFileSync, writeFileSync } from 'node:fs';
const D = new URL('../data/', import.meta.url);
const { outliers } = JSON.parse(readFileSync(new URL('golf-slideshows.json', D)));
const F = {
  'Gift ideas for the golfer (bf / dad / family)': /gift|christmas|birthday|stocking/i,
  'Golf tips / basics / drills': /tip|basic|drill|lesson|swing|grip|ball position|break 100|beginner|rookie|lingo|mental/i,
  'Outfit inspo / fit ideas': /outfit|fit ideas|inspo|ootd|what to wear|looks|closet|style|masters inspired|golf girl/i,
  'Colour combos': /colou?r combo/i,
  'Brands to know (list of brands)': /brands? (you need|i love|to know|under the radar)|niche golf brands/i,
  'Rank / rate it': /rank|rating|out of 10|tier/i,
  'Relatable / boyfriend humour': /boyfriend|bf\b|relatable|golfer boyfriend/i,
  'Aesthetic / moodboard': /aesthetic|pinterest|themed|moodboard|vibes/i,
};
const med = a => { a = [...a].sort((x, y) => x - y); return a.length ? a[Math.floor(a.length / 2)] : 0; };
const groups = Object.fromEntries(Object.keys(F).map(k => [k, []])); groups.Other = [];
for (const p of outliers) { const t = `${p.title} ${p.desc}`; const k = Object.keys(F).find(k => F[k].test(t)) || 'Other'; groups[k].push(p); }
const rows = Object.entries(groups).filter(([, ps]) => ps.length).map(([k, ps]) => { const creators = new Set(ps.map(p => p.creator)).size;
  return { formula: k, posts: ps.length, creators, proven: ps.length >= 3 && creators >= 2, median_saves_per_1k: med(ps.map(p => p.saves_per_1k)), median_shares_per_1k: med(ps.map(p => p.plays ? 1000 * p.shares / p.plays : 0)).toFixed(1) * 1,
    median_ratio: med(ps.map(p => p.ratio)), median_plays: med(ps.map(p => p.plays)), median_slides: med(ps.map(p => p.slides)),
    top: ps.sort((a, b) => b.saves_per_1k - a.saves_per_1k).slice(0, 3).map(p => ({ url: p.url, creator: p.creator, plays: p.plays, saves_per_1k: p.saves_per_1k, ratio: p.ratio, slides: p.slides, title: (p.title || p.desc).slice(0, 90) })) }; })
  .sort((a, b) => (b.proven - a.proven) || b.median_saves_per_1k - a.median_saves_per_1k || b.creators - a.creators);
writeFileSync(new URL('golf-slideshow-formulas.json', D), JSON.stringify({ outliers: outliers.length, rows }, null, 1));
for (const r of rows) console.log(`${r.proven ? 'PROVEN' : 'lead  '} | ${r.formula} | ${r.posts} posts, ${r.creators} creators | saves ${r.median_saves_per_1k}/1k | shares ${r.median_shares_per_1k}/1k | ${r.median_ratio}x | ${r.median_plays.toLocaleString()} plays | ${r.median_slides} slides`);
