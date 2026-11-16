#!/usr/bin/env node
// Pull the Meta ads of popular golf apparel/accessory brands (treg -> crawl4ai Meta Ad Library, $0.00165/brand)
// and summarise what creatives they run: formats, how long ads survive, hooks, offers, angles, seasonal pushes.
//   node golf_ads.mjs [--out ../data] [--brands "Malbon Golf,..."]
import { execFile } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const args = Object.fromEntries(process.argv.slice(2).reduce((a, x, i, all) => (x.startsWith('--') ? [...a, [x.slice(2), all[i + 1]]] : a), []));
const OUT = resolve(args.out || resolve(dirname(fileURLToPath(import.meta.url)), '../data'));
const BRANDS = (args.brands || 'Malbon Golf,TravisMathew,G/FORE,Bad Birdie,Good Good Golf,Sunday Golf,Ghost Golf,Vice Golf,L.A.B. Golf,PAYNTR Golf,Macade Golf,Eastside Golf,Swannies Golf,Greyson Clothiers,Holderness & Bourne,johnnie-O,Primo Golf,Melin,Linksoul,Metalwood Studio').split(',').map(s => s.trim());
const TREG = `${process.env.HOME}/.local/bin/treg`;
let spent = 0;
const call = body => new Promise((res, rej) => execFile(TREG, ['--json', 'call', 'crawl4ai.meta-ads.library.advertiser', '--method', 'POST', '--data', JSON.stringify(body)], { maxBuffer: 1 << 27, timeout: 300000 }, (e, out) => {
  if (e && !out) return rej(e); try { const j = JSON.parse(out); spent += (j._treg?.charged_micro || 0) / 1e6; res(j.result?.output || j.result || {}); } catch (x) { rej(x); } }));

const ANGLES = {
  gift: /gift|holiday|stocking|christmas|for (him|dad|the golfer)/i, sale: /\d+% off|sale|black friday|cyber|deal|save \$?\d|discount|bogo|free gift/i,
  performance: /moisture|wick|stretch|breathab|uv|upf|sweat|water[- ]resist|lightweight|performance|tech/i, style: /style|look good|fit|drip|fresh|clean|outfit|on and off the course|course to/i,
  community: /club|community|crew|join|members|squad|friends|buddies/i, social_proof: /best[- ]?selling|sold out|restock|back in stock|\d+[,.]?\d*k?\+? (reviews|golfers|customers)|★|rated/i,
  scarcity: /limited|only \d+|once it'?s gone|last chance|ends (tonight|soon)|drop|release/i, product_launch: /new|introducing|meet the|just dropped|launch/i,
  guarantee: /guarantee|risk[- ]free|free returns|free exchange|try it/i, collab: / x |collab|collaboration|partnered/i, tour_pro: /tour|pro|pga|major|champion/i,
};
mkdirSync(OUT, { recursive: true });
const brands = [];
for (const b of BRANDS) {
  const o = await call({ page: b, active_status: 'all', country: 'US', limit: 100 }).catch(e => ({ error: e.message }));
  const rows = o.rows || [];
  const matched = (o.meta?.warnings || o.warnings || []).join(' ');
  const now = Date.now();
  const ads = rows.map(r => {
    const end = r.is_active ? now : Date.parse(r.end_date || r.start_date); const days = Math.max(1, Math.round((end - Date.parse(r.start_date)) / 864e5));
    const text = [r.title, r.body, r.link_caption].filter(Boolean).join(' \n ');
    return { id: r.ad_archive_id, page: r.page_name, format: r.display_format, active: !!r.is_active, start: String(r.start_date || '').slice(0, 10), days, title: r.title || '', body: String(r.body || '').slice(0, 400),
      hook: String(r.body || r.title || '').split(/[\n.!?]/).map(s => s.trim()).find(s => s.length > 3) || '', cta: r.cta || r.cta_type || '', link: r.link_url || '', url: r.ad_url, videos: (r.videos || []).length, images: (r.images || []).length,
      angles: Object.entries(ANGLES).filter(([, re]) => re.test(text)).map(([k]) => k) };
  });
  brands.push({ brand: b, page: rows[0]?.page_name || null, page_likes: rows[0]?.page_likes ?? null, matched, ads });
  console.log(`${b}: ${ads.length} ads (${ads.filter(a => a.active).length} live) · page ${rows[0]?.page_name || '-'} · ~$${spent.toFixed(3)}`);
}
writeFileSync(`${OUT}/golf-ads.json`, JSON.stringify({ built: new Date().toISOString(), source: 'Meta Ad Library via treg crawl4ai (US, active + inactive still listed)', spend_usd: Math.round(spent * 1000) / 1000, brands }, null, 1));
console.log(`saved ${OUT}/golf-ads.json · spend ~$${spent.toFixed(3)}`);
