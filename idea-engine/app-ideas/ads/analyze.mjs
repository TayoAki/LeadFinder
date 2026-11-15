// Summarise competitor ads per app idea from the Keepwatch bundles built by build.mjs:
// format and angle mix, recurring hooks, CTAs, and the longest-running ads (days live; an ad an
// advertiser keeps paying for is the strongest public signal that it works).
//   node analyze.mjs <bundle.json>... > summary.json
import { readFileSync } from 'node:fs';
const today = new Date();
// Dates are ISO days (YYYY-MM-DD); a live ad counts up to today.
const days = (a) => {
  const s = a.start_date ? new Date(a.start_date) : null;
  const e = a.is_active || !a.end_date ? today : new Date(a.end_date);
  return s && !isNaN(s) ? Math.max(1, Math.round((e - s) / 864e5)) : null;
};
const iso = (t) => t || null;
const count = (xs) => Object.entries(xs.reduce((m, x) => ((m[x] = (m[x] || 0) + 1), m), {})).sort((a, b) => b[1] - a[1]);

const out = [];
for (const f of process.argv.slice(2)) {
  const b = JSON.parse(readFileSync(f, 'utf8'));
  const ads = b.rivals.flatMap((r) => r.ads.map((a) => ({ ...a, page: r.name, days: days(a) })));
  const live = ads.filter((a) => a.is_active);
  const longest = [...ads].filter((a) => a.days).sort((x, y) => y.days - x.days).slice(0, 8).map((a) => ({
    page: a.page, days: a.days, live: !!a.is_active, started: iso(a.start_date), format: a.display_format || a.format,
    copies: a.collation_count || 1, hook: a.hook, title: a.title, body: (a.body || '').slice(0, 280), cta: a.cta,
    media: a.format, video: a.video_url, thumb: a.thumb_url || a.image_url, id: a.id,
  }));
  out.push({
    idea: b.workspace_name, ads: ads.length, live: live.length,
    pages: b.rivals.map((r) => ({ name: r.name, ads: r.ads.length, live: r.ads.filter((a) => a.is_active).length })),
    formats: count(ads.map((a) => a.format || 'unknown')),
    angles: count(ads.map((a) => a.angle || 'unclassified')).slice(0, 8),
    ctas: count(ads.map((a) => a.cta || 'none')).slice(0, 6),
    hooks: count(ads.map((a) => (a.hook || '').trim()).filter(Boolean)).slice(0, 12),
    longest,
  });
}
console.log(JSON.stringify(out, null, 1));
