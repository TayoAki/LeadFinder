// Co-search harvest: what people type next to a brand name (Google + YouTube autocomplete).
//   node cosearch.mjs "Liquid Death" ["Brand B" ...]   writes cosearch-<slug>.json with raw suggestions
import { writeFileSync, readFileSync, existsSync } from 'node:fs';
const CACHE = 'ac-cache.json'; const cache = existsSync(CACHE) ? JSON.parse(readFileSync(CACHE, 'utf8')) : {};
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function ac(ds, q) {
  const k = `${ds}:${q}`; if (cache[k]) return cache[k];
  try { const r = await fetch(`https://suggestqueries.google.com/complete/search?client=firefox&hl=en&gl=us${ds ? `&ds=${ds}` : ''}&q=${encodeURIComponent(q)}`, { signal: AbortSignal.timeout(10000) });
    cache[k] = (await r.json())[1] || []; } catch { cache[k] = []; }
  await sleep(220); return cache[k];
}
for (const brand of process.argv.slice(2)) {
  const b = brand.toLowerCase(), out = {};
  const pats = [`${b} and `, `${b} vs `, `${b} x `, `${b} like `, `brands like ${b}`, `${b} or `, `${b} versus `, `is ${b} better than `, `${b} collab`, `${b} with `];
  const letters = 'abcdefghijklmnoprstw'.split('');
  for (const p of pats) { out[p] = [...await ac('', p), ...await ac('yt', p)]; }
  for (const L of letters) out[`${b} vs ${L}`] = await ac('', `${b} vs ${L}`);
  for (const L of letters) out[`${b} and ${L}`] = await ac('', `${b} and ${L}`);
  writeFileSync(`cosearch-${b.replace(/[^a-z0-9]+/g, '-')}.json`, JSON.stringify({ brand, suggestions: out }, null, 1));
  writeFileSync(CACHE, JSON.stringify(cache));
  console.log(brand, Object.values(out).flat().length, 'suggestions');
}
