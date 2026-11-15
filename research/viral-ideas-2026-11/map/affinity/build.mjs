// Brand affinity graph: "fans of A also love B".
// Two evidence sources, kept separate on every edge:
//   1. research.json (agent): audience_data > co_mention > list > collab_or_retail, each with a URL
//   2. cosearch-*.json (Google/YouTube autocomplete): what people type next to a brand.
//      "A and B", "A x B", "A collab", "brands like A" -> together (shared fans);
//      "A vs B", "A or B", "is A better than B" -> versus (people choosing between them).
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
const research = existsSync('research.json') ? JSON.parse(readFileSync('research.json', 'utf8')) : { brands: {}, edges: [] };

const DICT = {
  'Liquid Death': /liquid death/, 'Celsius': /celsius/, 'Olipop': /olipop/, 'Poppi': /poppi/, 'Red Bull': /red ?bull/, 'Monster Energy': /monster( energy)?\b/,
  'Alani Nu': /alani/, 'Ghost Energy': /\bghost (energy|drink)|\bghost\b(?! of)/, 'Bloom': /\bbloom\b/, 'Bang': /\bbang energy|\bbang\b/, 'C4 Energy': /\bc4\b/, 'Prime': /\bprime( hydration| energy)?\b/,
  'Liquid IV': /liquid ?i\.?v/, 'LMNT': /\blmnt\b/, 'DUST': /\bdust\b/, 'Gatorade': /gatorade/, 'BodyArmor': /body ?armou?r/, 'Coca-Cola': /\bcoke\b(?! zero)|coca[- ]cola/, 'Coke Zero': /coke zero/,
  'Diet Coke': /diet coke/, 'Pepsi': /\bpepsi\b/, 'Dr Pepper': /dr\.? pepper/, 'Mountain Dew': /mountain dew/, 'Sprite': /\bsprite\b/, 'LaCroix': /la ?croix/, 'Bubly': /\bbubly\b/,
  'Spindrift': /spindrift/, 'Waterloo': /waterloo/, 'Topo Chico': /topo chico/, 'San Pellegrino': /pellegrino/, 'Perrier': /perrier/, 'Zevia': /zevia/, 'Sparkling Ice': /sparkling ice/,
  "Bubbl'r": /bubbl ?'?r/, 'Aquafina': /aquafina/, 'Evian': /evian/, 'Fiji Water': /\bfiji\b/, 'Smartwater': /smart ?water/, 'Mountain Valley': /mountain valley/, 'Essentia': /essentia/,
  'Voss': /\bvoss\b/, 'Dasani': /dasani/, 'Arizona': /arizona/, 'Death Wish Coffee': /death wish/, 'Black Rifle Coffee': /black rifle/, 'Starbucks': /starbucks/, "Dunkin'": /dunkin/,
  'Yeti': /\byeti\b/, 'Stanley': /\bstanley\b/, 'Owala': /owala/, 'Hydro Flask': /hydro ?flask/, 'e.l.f. Cosmetics': /\be\.?l\.?f\.?\b|\belf (cosmetics|lip|corpse|collab|ad|commercial)/,
  'Glossier': /glossier/, 'Rare Beauty': /rare beauty/, 'Pit Viper': /pit ?viper/, 'Feastables': /feastables/, 'MrBeast': /mr ?beast/, 'Lunchly': /lunchly/, 'Garage Beer': /garage beer/,
  'White Claw': /white claw/, 'High Noon': /high noon/, 'Twisted Tea': /twisted tea/, 'Michelob Ultra': /michelob/, 'Athletic Brewing': /athletic brew/, 'Hey Dude': /hey ?dudes?/,
  'Crocs': /\bcrocs?\b/, 'Vans': /\bvans\b/, 'Nike': /\bnike\b/, 'Hoka': /\bhoka\b/, 'Lululemon': /lululemon/, 'Gymshark': /gymshark/, 'Chipotle': /chipotle/, 'Taco Bell': /taco bell/,
  'Crumbl': /crumbl/, "Trader Joe's": /trader joe/, 'Erewhon': /erewhon/, 'Whole Foods': /whole foods/, 'Costco': /costco/, 'Target': /\btarget\b/, 'Pop-Tarts': /pop[- ]?tarts?/,
  'Fruity Pebbles': /fruity pebbles/, 'Sanrio / Kuromi': /kuromi|sanrio|hello kitty/, 'Gears of War': /gears( of war)?\b/, 'NASCAR': /nascar/, 'Huel': /\bhuel\b/, 'AG1': /\bag1\b/,
  "GT's Kombucha": /gt'?s kombucha/, 'Health-Ade': /health[- ]ade/, 'Recess': /\brecess\b/, 'Goodwipes': /goodwipes/, "MaryRuth's": /mary ?ruth/, 'Zyn': /\bzyn\b/, 'Prime Video': /^$/,
  'Oreo': /\boreo\b/, "Reese's": /reese/, 'Skittles': /skittles/, 'Takis': /\btakis\b/, 'Doritos': /doritos/, 'Cheez-It': /cheez[- ]?it/, 'Kraft': /^$/, 'Rockstar': /rockstar/, 'Reign': /\breign\b/,
  'Ryse': /\bryse\b/, 'Gorgie': /gorgie/, 'Sweet Loren\'s': /^$/, 'Spotify': /spotify/, 'Xbox': /\bxbox\b/, 'Skims': /\bskims\b/, 'Pop Mart / Labubu': /labubu|pop ?mart/,
};
const TOGETHER = /\b(and|x|collab|with|like|similar|brands like|fans|also)\b/;
const VERSUS = /\b(vs\.?|versus|or|better than|compared)\b/;

const brands = {}; // name -> { category, political, seeds: bool }
const edges = new Map(); // "A|B" -> { from, to, together:[], versus:[], research:[] }
const E = (a, b) => { const k = `${a}|${b}`; if (!edges.has(k)) edges.set(k, { from: a, to: b, together: [], versus: [], research: [] }); return edges.get(k); };
const touch = (n, extra = {}) => { brands[n] = { ...(brands[n] || {}), ...extra }; };

// 1. autocomplete
for (const f of readdirSync('.').filter(f => /^cosearch-.*\.json$/.test(f))) {
  const { brand, suggestions } = JSON.parse(readFileSync(f, 'utf8'));
  const canon = Object.keys(DICT).find(k => DICT[k].test(brand.toLowerCase())) || brand;
  touch(canon, { seed: true });
  const self = DICT[canon] || new RegExp(brand.toLowerCase());
  for (const [pattern, list] of Object.entries(suggestions)) {
    const kind = VERSUS.test(pattern) ? 'versus' : TOGETHER.test(pattern) ? 'together' : null;
    if (!kind) continue;
    for (const s of new Set(list.map(x => x.toLowerCase()))) {
      const rest = s.replace(self, ' ');
      for (const [name, re] of Object.entries(DICT)) {
        if (name === canon || !re.source || re.source === '^$' || !re.test(rest)) continue;
        // a suggestion only counts as "versus" if it actually says vs/or/better than
        const k2 = kind === 'versus' && !VERSUS.test(s) ? 'together' : kind;
        const e = E(canon, name); if (!e[k2].includes(s)) e[k2].push(s); touch(name);
      }
    }
  }
}
// 2. research (brand names normalised to the same spelling as the search data)
const canon = n => Object.keys(DICT).find(k => DICT[k].source !== '^$' && DICT[k].test(String(n).toLowerCase())) || n;
for (const r of research.edges || []) { r.from = canon(r.from); r.to = canon(r.to); }
research.brands = Object.fromEntries(Object.entries(research.brands || {}).map(([n, b]) => [canon(n), b]));
const W = { audience_data: 4, co_mention: 3, list: 2, collab_or_retail: 1 };
for (const [n, b] of Object.entries(research.brands || {})) touch(n, { category: b.category, political: !!b.political, note: b.note });
for (const r of research.edges || []) { const e = E(r.from, r.to); for (const ev of r.evidence || []) e.research.push(ev); touch(r.from); touch(r.to); }

// Score each directed edge 0-10: research weight (strongest piece + a little for more) + autocomplete.
const out = [];
for (const e of edges.values()) {
  const rs = e.research.reduce((m, x) => Math.max(m, W[x.type] || 0), 0) + Math.min(2, Math.max(0, e.research.length - 1) * 0.5);
  const ac = Math.min(3, e.together.length * 0.75) + Math.min(1.5, e.versus.length * 0.3);
  const score = Math.round(Math.min(10, rs * 1.4 + ac) * 10) / 10;
  if (score <= 0) continue;
  out.push({ ...e, score, best: e.research.length ? Object.keys(W).find(t => e.research.some(x => x.type === t)) : (e.together.length ? 'co_search' : 'versus_search') });
}
// keep brands that are in at least one edge
const used = new Set(out.flatMap(e => [e.from, e.to]));
const nodes = [...used].map(n => ({ id: n, ...brands[n], deg: out.filter(e => e.from === n || e.to === n).length, seed: !!brands[n]?.seed }));
writeFileSync('affinity.json', JSON.stringify({ built: '2026-11-15', seed: 'Liquid Death', nodes, edges: out }, null, 1));
const ld = out.filter(e => e.from === 'Liquid Death').sort((a, b) => b.score - a.score);
console.log(nodes.length, 'brands', out.length, 'edges'); console.log(ld.slice(0, 25).map(e => `${e.score}\t${e.to}\t${e.best}\tR${e.research.length} T${e.together.length} V${e.versus.length}`).join('\n'));
