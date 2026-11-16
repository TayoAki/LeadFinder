// Load the collected golf ads into a Keepwatch workspace as manual rivals (add_rival_ads), then set brand facts.
//   KEEPWATCH_API_KEY_FILE=<golf workspace key file> KEEPWATCH_URL=... node load_keepwatch.mjs
import { readFileSync } from 'node:fs';
const KEY = readFileSync(process.env.KEEPWATCH_API_KEY_FILE, 'utf8').trim(), URL_ = (process.env.KEEPWATCH_URL || '').replace(/\/$/, '');
let n = 0;
const kw = async (name, args) => { const r = await fetch(`${URL_}/mcp`, { method: 'POST', headers: { 'content-type': 'application/json', authorization: `Bearer ${KEY}` }, body: JSON.stringify({ jsonrpc: '2.0', id: ++n, method: 'tools/call', params: { name, arguments: args } }) });
  const j = await r.json(); const t = j.result?.content?.[0]?.text || JSON.stringify(j.error || j); try { return JSON.parse(t); } catch { return { error: t }; } };

const brand = await kw('update_brand', { brand_name: 'Golf hats', category: 'Golf headwear and apparel (embroidered caps)', product: 'Personalised embroidered golf caps and truckers for buddy trips, member-guests, golf bachelor parties and league teams; made to order.',
  audience: 'Golf-first active dads and friend groups (golf, run, surf), US', voice: 'plain, friendly, a little cheeky' }).catch(e => ({ error: e.message }));
console.log('brand:', JSON.stringify(brand).slice(0, 200));
const data = JSON.parse(readFileSync(new URL('../data/golf-ads.json', import.meta.url)));
for (const b of data.brands.filter(b => b.ads.length)) {
  const name = b.page || b.brand;
  const ads = b.ads.slice(0, 100).map(a => { const start = a.start || undefined; const end = !a.active && start ? new Date(Date.parse(start) + a.days * 864e5).toISOString().slice(0, 10) : undefined;
    return { id: String(a.id || ''), body: a.body || undefined, title: a.title || undefined, format: a.format === 'video' ? 'video' : a.format === 'carousel' ? 'carousel' : 'static', is_active: !!a.active, start_date: start, end_date: end, cta: a.cta || undefined, link_url: /^https:\/\//.test(a.link) ? a.link : undefined }; })
    .filter(a => a.body || a.title);
  const r = await kw('add_rival_ads', { rival: name, ads });
  console.log(name, '→', JSON.stringify(r.data || r).slice(0, 160));
  if (r.error && /plan|room|rivals/i.test(r.error)) break;
}
