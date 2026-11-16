// Summarise golf-ads.json: per-brand mix, what lasts (30+ days live), angles across brands, hooks that lasted.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
const D = new URL('../data/', import.meta.url);
const main = JSON.parse(readFileSync(new URL('golf-ads.json', D)));
const retry = existsSync(new URL('retry/golf-ads.json', D)) ? JSON.parse(readFileSync(new URL('retry/golf-ads.json', D))) : { brands: [] };
for (const b of retry.brands) if (b.ads.length) { b.brand = b.page || b.brand; main.brands = main.brands.filter(x => x.brand !== 'Good Good Golf'); main.brands.push(b); }
const brands = main.brands.filter(b => b.ads.length);
writeFileSync(new URL('golf-ads.json', D), JSON.stringify(main, null, 1));
const med = a => { a = [...a].sort((x, y) => x - y); return a.length ? a[Math.floor(a.length / 2)] : 0; };
const fmtName = f => ({ dco: 'flexible (DCO)', dpa: 'catalog (DPA)', image: 'image', video: 'video', carousel: 'carousel' })[f] || f || '?';
const all = brands.flatMap(b => b.ads.map(a => ({ ...a, brand: b.page || b.brand })));
const kept = all.filter(a => a.days >= 30);
const rows = brands.map(b => { const f = {}; for (const a of b.ads) f[fmtName(a.format)] = (f[fmtName(a.format)] || 0) + 1;
  return { brand: b.page || b.brand, ads: b.ads.length, live: b.ads.filter(a => a.active).length, kept30: b.ads.filter(a => a.days >= 30).length, median_days: med(b.ads.map(a => a.days)), longest: Math.max(...b.ads.map(a => a.days)), formats: f,
    new14: b.ads.filter(a => a.active && a.days <= 14).length }; }).sort((a, b) => b.live - a.live);
const formatStats = Object.entries(all.reduce((m, a) => { const k = fmtName(a.format); (m[k] = m[k] || []).push(a); return m; }, {})).map(([k, xs]) => ({ format: k, ads: xs.length, brands: new Set(xs.map(a => a.brand)).size, kept30_pct: Math.round(100 * xs.filter(a => a.days >= 30).length / xs.length), median_days: med(xs.map(a => a.days)) })).sort((a, b) => b.ads - a.ads);
const angleStats = Object.entries(all.reduce((m, a) => { for (const g of a.angles) (m[g] = m[g] || []).push(a); return m; }, {})).map(([k, xs]) => ({ angle: k, ads: xs.length, brands: new Set(xs.map(a => a.brand)).size, kept30_pct: Math.round(100 * xs.filter(a => a.days >= 30).length / xs.length), live_now: xs.filter(a => a.active).length })).sort((a, b) => b.brands - a.brands || b.ads - a.ads);
const seen = new Set();
const lasted = kept.filter(a => a.hook && a.hook.length > 8).sort((a, b) => b.days - a.days).filter(a => { const k = a.brand + a.hook.toLowerCase().slice(0, 40); if (seen.has(k)) return false; seen.add(k); return true; }).slice(0, 40);
const offers = all.filter(a => a.active && /\d+% off|free (gift|shipping|hat|ball)|bogo|buy \d|gift with|\$\d+ off|save \$?\d/i.test(a.title + ' ' + a.body)).map(a => ({ brand: a.brand, offer: ((a.title + ' ' + a.body).match(/[^.!\n]*(\d+% off|free (gift|shipping|hat|ball)[^.!\n]*|bogo|buy \d[^.!\n]*|gift with[^.!\n]*|\$\d+ off|save \$?\d+[^.!\n]*)[^.!\n]*/i) || [''])[0].trim().slice(0, 110) }));
const offerByBrand = Object.entries(offers.reduce((m, o) => ((m[o.brand] = m[o.brand] || new Set()).add(o.offer), m), {})).map(([b, s]) => `- **${b}:** ${[...s].slice(0, 3).join(' · ')}`);
const md = [`# What golf brands run on Meta (US, ${new Date(main.built).toISOString().slice(0, 10)})`, '',
  `${brands.length} brands, ${all.length} ads (${all.filter(a => a.active).length} live). Source: Meta Ad Library via treg (crawl4ai). "Kept" = ran 30+ days, a sign it pays. Spend ~$${(main.spend_usd + (retry.spend_usd || 0)).toFixed(3)}.`, '',
  '## Brands', '', '| Brand | Ads | Live | New in 14 days | Kept 30+ days | Median days | Longest | Formats |', '|---|---|---|---|---|---|---|---|',
  ...rows.map(r => `| ${r.brand} | ${r.ads} | ${r.live} | ${r.new14} | ${r.kept30} | ${r.median_days} | ${r.longest} | ${Object.entries(r.formats).map(([k, v]) => `${k} ${v}`).join(', ')} |`), '',
  '## Formats', '', '| Format | Ads | Brands | Kept 30+ days | Median days |', '|---|---|---|---|---|', ...formatStats.map(f => `| ${f.format} | ${f.ads} | ${f.brands} | ${f.kept30_pct}% | ${f.median_days} |`), '',
  '## Angles (from ad text)', '', '| Angle | Ads | Brands | Live now | Kept 30+ days |', '|---|---|---|---|---|', ...angleStats.map(a => `| ${a.angle} | ${a.ads} | ${a.brands} | ${a.live_now} | ${a.kept30_pct}% |`), '',
  '## Live offers', '', ...offerByBrand, '',
  '## Hooks that lasted (30+ days, longest first)', '', ...lasted.map(a => `- **${a.brand}** (${a.days}d, ${fmtName(a.format)}): "${a.hook.slice(0, 140)}"`)].join('\n');
writeFileSync(new URL('golf-ads.md', D), md);
console.log(md);
