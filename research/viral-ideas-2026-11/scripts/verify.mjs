// Check each finalist quote appears on its page (case/space/punctuation-insensitive).
import { readFileSync, writeFileSync } from 'node:fs';
const all = ['tech', 'services', 'lifestyle', 'food'].flatMap(s => JSON.parse(readFileSync(`switchers-${s}.json`, 'utf8')).companies);
const pick = ['Etsy', 'Huel', 'Est'];
const norm = t => t.toLowerCase().replace(/&#?\w+;/g, ' ').replace(/[’‘]/g, "'").replace(/[“”]/g, '"').replace(/<[^>]+>/g, ' ').replace(/[^a-z0-9']+/g, ' ').trim();
const pages = {}, out = {};
for (const p of pick) {
  const c = all.find(x => x.company.startsWith(p));
  out[c.company] = [];
  for (const s of c.signals) {
    if (!(s.url in pages)) { try { const r = await fetch(s.url, { headers: { 'user-agent': 'Mozilla/5.0 (research)' }, signal: AbortSignal.timeout(20000) }); pages[s.url] = r.ok ? norm(await r.text()) : `HTTP ${r.status}`; } catch (e) { pages[s.url] = `ERR ${e.message}`; } }
    const page = pages[s.url], q = norm(s.quote);
    const found = page.startsWith('HTTP') || page.startsWith('ERR') ? page : page.includes(q) ? 'exact' : page.includes(q.slice(0, 40)) ? 'start-only' : 'NOT FOUND';
    out[c.company].push({ ...s, verified: found });
    console.log(found.padEnd(12), c.company.slice(0, 12), s.quote.slice(0, 70));
  }
}
writeFileSync('verified.json', JSON.stringify(out, null, 1));
