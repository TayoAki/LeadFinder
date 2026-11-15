// Generate and score business ideas from the research evidence.
//   node ideas.mjs   reads switchers-*.json + cult-overlap.json in this folder, writes ideas.json + ideas-top.md
// Every idea is built from a real switching hotspot (company + decision + what people want instead).
// Scores are RULES applied to the evidence, not predictions of sales.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
const DIR = new URL('.', import.meta.url).pathname;
const load = f => { try { return JSON.parse(readFileSync(DIR + f, 'utf8')); } catch { return null; } };
const sectors = readdirSync(DIR).filter(f => /^switchers-.*\.json$/.test(f)).map(load).filter(Boolean);
const cult = load('cult-overlap.json') || { business_types: [], brands: [] };
const kwRaw = load('keywords.json') || {}; // keyword validation (kwcheck.mjs): Google/YouTube/Amazon autocomplete
// Search demand, 0-20, RELATIVE to the other companies: distinct switching searches on Google (70%),
// shopping searches on Amazon (15%), switching videos searched on YouTube (15%).
const kw = {};
{ const rows = Object.entries(kwRaw).map(([c, r]) => [c, new Set(Object.values(r.switching).flat()).size, r.amazon_intent.length, r.youtube.length]);
  const maxSw = Math.max(1, ...rows.map(r => r[1]));
  for (const [c, sw, am, yt] of rows) { const score = Math.round(20 * (0.7 * sw / maxSw + 0.15 * Math.min(1, am / 4) + 0.15 * Math.min(1, yt / 5)) * 10) / 10;
    kw[c] = { score, switching_searches: sw, verdict: score >= 13 ? 'strong search demand' : score >= 7 ? 'some search demand' : 'little search demand' }; } }

// ---- 1. Hotspots: companies with switching demand, scored on their evidence ----
const DAY = 864e5, NOW = Date.parse('2026-11-15');
const ALT = /alternativ|instead|switch|replac|dupe|recommend|what (do|should|can) i (buy|use|get)|moved to|leaving|left for|other brand/i;
const ANGER = /hate|done with|sick of|fed up|ruin|worse|ripoff|rip-off|scam|greed|cancel|never (again|buying)|disappoint|awful|terrible|garbage|insult|angry|furious|betray|downgrad|enshit/i;
const hotspots = [];
// The same company can be found by two sector agents (e.g. Garmin): merge its evidence, keep the first sector.
const merged = new Map();
for (const s of sectors) for (const c of s.companies || []) {
  const k = c.company.toLowerCase().replace(/\(.*?\)/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
  const m = merged.get(k);
  if (!m) { merged.set(k, { ...c, sector: s.sector, signals: [...(c.signals || [])], voices: [...(c.voices || [])], what_people_want_instead: [...(c.what_people_want_instead || [])] }); continue; }
  const urls = new Set(m.signals.map(x => x.url));
  m.signals.push(...(c.signals || []).filter(x => !urls.has(x.url)));
  m.voices.push(...(c.voices || []));
  m.what_people_want_instead = [...new Set([...m.what_people_want_instead, ...(c.what_people_want_instead || [])])];
  if (c.strength === 'strong') m.strength = 'strong';
}
for (const c of merged.values()) { const s = { sector: c.sector };
  const sig = c.signals || [];
  const sw = sig.filter(x => ALT.test(x.quote) || ANGER.test(x.quote));
  const sources = new Set(sig.map(x => x.source)).size;
  const recent = sig.filter(x => x.posted_at && NOW - Date.parse(x.posted_at) < 365 * DAY).length;
  const eng = sig.reduce((n, x) => n + (Number(x.engagement) || 0), 0);
  const page = sig.filter(x => x.seen === 'page').length;
  const strength = { strong: 1, medium: 0.7, weak: 0.4 }[c.strength] ?? 0.5;
  // Switch demand, 0-35: volume of switching posts, spread of sources, recency, engagement, verified pages, analyst strength.
  const demand = Math.min(35, sw.length * 2.5 + sources * 2 + recent * 0.8 + Math.min(6, Math.log10(1 + eng) * 1.5) + page * 0.5) * (0.6 + 0.4 * strength);
  hotspots.push({ ...c, sector: s.sector, keywords: kw[c.company]?.score ?? 0, keyword_verdict: kw[c.company]?.verdict || 'not checked', demand: Math.round(demand * 10) / 10, n_signals: sig.length, n_switching: sw.length, sources, recent, engagement: eng });
}

// ---- 2. Business models per sector, with launch ease (0-10) ----
const MODELS = {
  food_cpg: [['DTC white-label product', 9], ['subscription box', 7], ['limited-drop flavours', 8], ['private-label "old recipe" revival', 8]],
  tech_apps: [['no-subscription one-time-purchase app', 6], ['open-source or self-hosted alternative', 5], ['migration service (we move you over)', 9], ['niche community-run alternative', 7]],
  lifestyle: [['DTC private-label product', 8], ['repair, refill or resale service', 7], ['limited-drop collectible line', 8], ['"built like it used to be" premium line', 6]],
  services: [['niche marketplace', 5], ['member-owned co-op or community', 6], ['local done-for-you service', 8], ['seller toolkit for people leaving the platform', 8]],
};
// ---- 3. Viral mechanisms (Keepwatch Borrow moves + switcher plays), virality 0-20 by fit ----
const MECH = [
  { id: 'own_the_joke', name: 'Own the joke (roast the decision, never the people)', base: 16, fits: /price|fee|shrink|subscription|ads|cost/i },
  { id: 'make_it_a_dare', name: 'Taste or try-it challenge (blind test vs the new version)', base: 17, fits: /recipe|formula|taste|flavou?r|quality|food|snack|drink|sauce|candy/i },
  { id: 'the_drop', name: 'Numbered limited drops with real quantities', base: 15, fits: /discontinu|limited|collect|toy|sneaker|shoe|card|flavou?r|line/i },
  { id: 'lore', name: 'Running characters and inside jokes (commit to the bit)', base: 14, fits: /./ },
  { id: 'satisfying', name: 'Oddly satisfying close-ups (pour, crunch, unbox)', base: 13, fits: /food|drink|snack|beauty|skin|clean|home|toy|craft|candle|scent/i },
  { id: 'founder_face', name: 'Founder who left too ("I quit X, so I made this")', base: 12, fits: /./ },
  { id: 'most_asked', name: '"Every question you googled after X changed", answered', base: 11, fits: /app|software|subscription|fee|policy|platform|bank|account/i },
  { id: 'creator_army', name: 'Creators already complaining become partners (disclosed equity/affiliate)', base: 15, fits: /./ },
];
// ---- 4. Cult overlap: business types cult-brand fans love (count of cult brands pointing there) ----
const types = (cult.business_types || []).map(t => ({ ...t, words: String(t.type).toLowerCase().split(/[^a-z]+/).filter(w => w.length > 3) }));
const maxCount = Math.max(1, ...types.map(t => t.count || (t.cult_brands_pointing_here || []).length || 0));
// What each cult business type includes. A business fits a type if it sells something in it.
const TYPE_RX = [
  [/flavou?red drinks/i, /\b(drinks?|soda|coffee|tea|juice|shakes?|protein|smoothies?|beverages?|huel|meal replacement)\b/i],
  [/beauty/i, /\b(beauty|makeup|foundation|cosmetics?|skincare|skin care|lip|soap|body care|wipes|toothpaste|fragrance|deodorant)\b/i],
  [/collectibles/i, /\b(collectibles?|blind box(es)?|plush|toys?|trading cards?|miniatures?|warhammer|figurines?|handmade|crafts?|artisan|makers?)\b/i],
  [/celebrity/i, /\b(music|musicians?|film|movies?|fandoms?|artists?)\b/i],
  [/sneakers|apparel/i, /\b(leggings?|apparel|clothing|activewear|sneakers?|shoes?|hoodies?|t-?shirts?|streetwear|athleisure)\b/i],
  [/cute accessories/i, /\b(accessor(y|ies)|charms?|phone cases?|straps?|toppers?)\b/i],
  [/candy|snack/i, /\b(snacks?|candy|chocolate|cookies?|chips|crackers|mac(aroni)?|cheese|tortillas?|peanut butter|reese'?s)\b/i],
  [/themed cafes|pop-ups|fan events/i, /\b(events?|meetups?|clubs?|community|communities|pop-ups?|cafes?|gatherings?|rsvp|organi[sz]ers?)\b/i],
  [/run clubs|fitness/i, /\b(running|runners?|fitness|gps|sports? watch|training|recovery|strain|workouts?|athletes?|outdoors?|cycling|activewear|leggings?)\b/i],
  [/home scent/i, /\b(candles?|scents?|fragrance|home fragrance)\b/i],
  [/treasure-hunt|store exclusives/i, /\b(private label|store brand|aldi|costco|grocery)\b/i],
  [/jewel/i, /\b(jewel(le)?ry|bracelets?|necklaces?)\b/i],
];
function cultFit(text) {
  const t = String(text);
  let best = null;
  for (const ty of types) {
    const rule = TYPE_RX.find(([tr]) => tr.test(ty.type));
    if (!rule || !rule[1].test(t)) continue;
    const n = ty.count || (ty.cult_brands_pointing_here || []).length || 0;
    const s = 25 * (0.3 + 0.7 * n / maxCount);
    if (!best || s > best.score) best = { type: ty.type, brands: ty.cult_brands_pointing_here || [], score: s };
  }
  return best || { type: null, brands: [], score: 0 };
}
function cultFitOld(text) {
  const t = text.toLowerCase();
  let best = null;
  for (const ty of types) {
    const hits = ty.words.filter(w => t.includes(w)).length;
    if (!hits) continue;
    const n = ty.count || (ty.cult_brands_pointing_here || []).length || 0;
    const s = 25 * (hits / ty.words.length) * (0.4 + 0.6 * n / maxCount);
    if (!best || s > best.score) best = { type: ty.type, brands: ty.cult_brands_pointing_here || [], score: s };
  }
  return best || { type: null, brands: [], score: 0 };
}

// How hard it is to make the thing people want, whatever the business model (0-10).
function categoryEase(t) {
  t = t.toLowerCase();
  // Needs licences a small team cannot get (music catalogues, banking, insurance).
  if (/spotify|music streaming|\bbank|insurance|airline/.test(t)) return 1;
  if (/watch|band|tracker|wearable|camera|doorbell|printer|thermostat|kindle|e-?reader|\bnas\b|hardware|device|ring\b/.test(t)) return 3;
  if (/app\b|software|platform|chat|voice|streaming|server|marketplace|subscription service|music|bank|accounting|course/.test(t)) return 5;
  if (/foundation|makeup|cosmetic|wipes|snack|mac\b|cheese|candy|chocolate|chips|shake|protein|detergent|pods|litter|legging|apparel|yarn|tortilla|cookie|drink|soda|coffee|sauce|skincare/.test(t)) return 9;
  return 6;
}
// ---- 5. Generate ideas ----
const short = d => { const x = String(d || 'a recent change').split(/[(;.]| - | — /)[0].trim(); return (x.length > 70 ? x.slice(0, 70).replace(/\s+\S*$/, '') + '…' : x).replace(/^./, c => c.toLowerCase()); };
const ideas = [];
for (const h of hotspots) {
  const wants = [...new Set([...(h.what_people_want_instead || []), `the ${h.category || 'product'} ${h.company} used to make`])].slice(0, 5);
  const models = MODELS[h.sector] || MODELS.lifestyle;
  const ctx = `${h.category} ${h.decision} ${wants.join(' ')}`;
  const mechs = MECH.map(m => ({ ...m, v: m.base + (m.fits.test(ctx) ? 4 : -4) })).sort((a, b) => b.v - a.v);
  for (const want of wants) for (const [model, mEase] of models) for (const m of mechs.slice(0, 6)) {
    // Collab fit comes from WHAT the business sells (category + want), not from how it sells.
    const cf = cultFit(`${h.category} ${want}`);
    const ease = Math.min(mEase, categoryEase(`${h.category} ${want}`));
    const specific = /used to make/.test(want) ? 4 : 10;
    // Total out of 120: switch demand 35, search demand 20, cult overlap 25, virality 20, ease 10, specificity 10.
    const score = h.demand + h.keywords + cf.score + Math.max(0, Math.min(20, m.v)) + ease + specific;
    ideas.push({
      id: ideas.length + 1, hotspot: h.company, sector: h.sector, category: h.category, decision: h.decision,
      idea: `${want[0].toUpperCase() + want.slice(1)}, for people leaving ${h.company} after ${short(h.decision)}`, model,
      keyword_verdict: h.keyword_verdict, launch: m.name, collab: cf.type ? `${cf.type} (loved by fans of ${cf.brands.slice(0, 3).join(', ') || 'cult brands'})` : 'none found',
      scores: { switch_demand: h.demand, search_demand: h.keywords, cult_overlap: Math.round(cf.score * 10) / 10, virality: Math.max(0, Math.min(20, m.v)), ease, specificity: specific },
      score: Math.round(score * 10) / 10,
    });
  }
}
ideas.sort((a, b) => b.score - a.score);
// Exactly 1,000 (or all, if the evidence supports fewer), deduped on text.
const seen = new Set(), out = [];
for (const i of ideas) { const k = i.idea + i.model + i.launch; if (seen.has(k)) continue; seen.add(k); out.push(i); if (out.length === 1000) break; }
out.forEach((i, n) => { i.rank = n + 1; });
// Shortlist: top 30 with at most 3 per hotspot; finalists: best idea from the top 3 hotspots.
// The user's rule: both signals must be real. Shortlist only ideas with switching demand >= 12/35 and cult overlap >= 10/25.
const both = i => i.scores.switch_demand >= 12 && i.scores.cult_overlap >= 10;
const per = {}, top30 = [];
for (const i of out.filter(both)) { if ((per[i.hotspot] = (per[i.hotspot] || 0) + 1) > 3) continue; top30.push(i); if (top30.length === 30) break; }
const finalists = []; for (const i of top30) if (!finalists.some(f => f.hotspot === i.hotspot)) finalists.push(i); finalists.splice(3);
writeFileSync(DIR + 'ideas.json', JSON.stringify({ built_at: new Date().toISOString(), hotspots: hotspots.sort((a, b) => b.demand - a.demand).map(({ signals, voices, ...h }) => ({ ...h, signals: signals?.length, voices: voices?.length })), total: out.length, ideas: out, top30, finalists }, null, 1));
const md = [`# ${out.length} ideas, scored (rules on research evidence, not sales predictions)`, '', `Hotspots: ${hotspots.length} companies. Cult business types: ${types.length}.`, '',
  '| Rank | Score /120 | Idea | Model | Search demand | Launch move | Collab with |', '|---|---|---|---|---|---|---|', ...top30.map(i => `| ${i.rank} | ${i.score} | ${i.idea} | ${i.model} | ${i.keyword_verdict} (${i.scores.search_demand}/20) | ${i.launch} | ${i.collab} |`), '', '## Finalists', ...finalists.map(f => `- ${f.idea} (score ${f.score})`)].join('\n');
writeFileSync(DIR + 'ideas-top.md', md);
console.log(`hotspots ${hotspots.length}, ideas ${out.length}`); console.log(hotspots.slice(0, 15).map(h => `${h.demand}\t${h.company} (${h.sector}) sw ${h.n_switching}/${h.n_signals}`).join('\n'));
console.log('\nfinalists:\n' + finalists.map(f => `${f.score}  ${f.idea}`).join('\n'));
