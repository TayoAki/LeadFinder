// Keyword validation without paid tools: Google, YouTube and Amazon autocomplete.
// A suggestion only appears when enough people search it, so presence = real search demand
// (not a volume number). For each hotspot we check switching searches ("X alternative", "X dupe",
// "X discontinued"...) and each "what they want" phrase. Cached in kw-cache.json.
//   node kwcheck.mjs            reads switchers-*.json, writes keywords.json
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
const DIR = new URL('.', import.meta.url).pathname;
const CACHE = DIR + 'kw-cache.json';
const cache = existsSync(CACHE) ? JSON.parse(readFileSync(CACHE, 'utf8')) : {};
const sleep = ms => new Promise(r => setTimeout(r, ms));
const ENGINES = {
  google: q => `https://suggestqueries.google.com/complete/search?client=firefox&hl=en&gl=us&q=${encodeURIComponent(q)}`,
  youtube: q => `https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&hl=en&q=${encodeURIComponent(q)}`,
  amazon: q => `https://completion.amazon.com/api/2017/suggestions?mid=ATVPDKIKX0DER&alias=aps&prefix=${encodeURIComponent(q)}`,
};
async function suggest(engine, q) {
  const key = `${engine}:${q.toLowerCase()}`;
  if (cache[key]) return cache[key];
  let out = [];
  try {
    const res = await fetch(ENGINES[engine](q), { headers: { 'user-agent': 'Mozilla/5.0 keyword-research' }, signal: AbortSignal.timeout(10000) });
    const j = await res.json();
    out = engine === 'amazon' ? (j.suggestions || []).map(s => s.value) : (j[1] || []);
  } catch { out = null; }
  if (out) cache[key] = out;
  await sleep(250);
  return out || [];
}
const SWITCH = /alternativ|dupe|instead|replacement|discontinu|changed|vs\b|similar|like\b|copycat|recipe|old|cancel|worse|better than|substitute/i;
const clean = s => String(s).toLowerCase().replace(/[^a-z0-9' ]+/g, ' ').replace(/\s+/g, ' ').trim();

const sectors = readdirSync(DIR).filter(f => /^switchers-.*\.json$/.test(f)).map(f => JSON.parse(readFileSync(DIR + f, 'utf8')));
const result = {};
for (const s of sectors) for (const c of s.companies || []) {
  const name = clean(c.company).split(' ').slice(0, 3).join(' ');
  const seeds = [`${name} alternative`, `${name} dupe`, `${name} discontinued`, `${name} changed`, `${name} vs`, `is ${name} worse`, `${name} replacement`];
  const wants = (c.what_people_want_instead || []).slice(0, 4).map(w => clean(w).split(' ').slice(0, 6).join(' ')).filter(w => w.length > 4);
  const row = { company: c.company, switching: {}, wants: {}, amazon_intent: [], youtube: [] };
  for (const q of seeds) {
    const g = await suggest('google', q);
    const hits = g.filter(x => SWITCH.test(x) && clean(x).includes(name.split(' ')[0]));
    if (hits.length) row.switching[q] = hits.slice(0, 6);
  }
  for (const q of [`${name} alternative`, `${name} dupe`]) {
    const y = await suggest('youtube', q); if (y.length) row.youtube.push(...y.filter(x => SWITCH.test(x)).slice(0, 5));
  }
  // Amazon hides brand "dupe"/"alternative" searches, so check what people shop for instead.
  for (const q of [...wants.slice(0, 3), clean(c.category || '').split(' ').slice(0, 4).join(' ')].filter(x => x.length > 3)) {
    const a = await suggest('amazon', q); if (a.length) row.amazon_intent.push(...a.slice(0, 3));
  }
  for (const w of wants) { const g = await suggest('google', w); if (g.length) row.wants[w] = g.slice(0, 5); }
  const nSwitch = Object.values(row.switching).flat().length;
  // 0-20: Google switching suggestions (people search for a way out), Amazon (they shop for one),
  // YouTube (they watch reviews), and want phrases that are real searches.
  row.score = Math.min(20, nSwitch * 0.8 + Math.min(4, row.amazon_intent.length) + Math.min(3, row.youtube.length * 0.6) + Object.keys(row.wants).length * 1.2);
  row.score = Math.round(row.score * 10) / 10;
  row.verdict = row.score >= 12 ? 'strong search demand' : row.score >= 6 ? 'some search demand' : 'little search demand';
  result[c.company] = row;
  writeFileSync(CACHE, JSON.stringify(cache));
  console.log(`${row.score}\t${row.verdict}\t${c.company}`);
}
writeFileSync(DIR + 'keywords.json', JSON.stringify(result, null, 1));
