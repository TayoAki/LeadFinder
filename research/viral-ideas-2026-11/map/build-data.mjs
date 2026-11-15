import { readFileSync, writeFileSync } from 'node:fs';
const D = '/home/user/LeadFinder/research/viral-ideas-2026-11/data/';
const J = f => JSON.parse(readFileSync(D + f, 'utf8'));
const cult = J('cult-overlap.json'), ideas = J('ideas.json'), kw = J('keywords.json');
const sw = ['food', 'tech', 'lifestyle', 'services'].flatMap(s => J(`switchers-${s}.json`).companies.map(c => ({ ...c, sector: s })));
// Short names for business types (hubs).
const SHORT = [[/flavou?red drinks/i, 'Flavoured drinks'], [/beauty/i, 'Beauty crossovers'], [/collectibles/i, 'Limited-drop collectibles'], [/celebrity/i, 'Celebrity & film tie-ins'],
  [/sneakers|apparel/i, 'Apparel & sneaker capsules'], [/cute accessories/i, 'Accessories for a cult item'], [/candy|snack/i, 'Snack & candy crossovers'], [/themed cafes|pop-ups/i, 'Pop-ups, cafes & fan events'],
  [/run clubs|fitness/i, 'Run clubs & fitness'], [/home scent/i, 'Cozy home scent'], [/treasure-hunt/i, 'Store exclusives & treasure hunts'], [/jewel/i, 'Jewelry & sparkle']];
const shortOf = t => (SHORT.find(([re]) => re.test(t)) || [0, t])[1];
// Map free-text categories to a business type (same idea as the idea scorer, word-bounded).
const RX = [
  ['Flavoured drinks', /\b(drinks?|soda|coffee|tea|juice|beverages?|smoothies?|cafe drink|latte|water)\b/i],
  ['Beauty crossovers', /\b(beauty|makeup|cosmetics?|skincare|lip|soap|body care|fragrance|deodorant|nail|hair)\b/i],
  ['Limited-drop collectibles', /\b(collectibles?|blind box(es)?|plush|toys?|trading cards?|figurines?|pins?|limited drops?|rotating drops?|blind-box)\b/i],
  ['Celebrity & film tie-ins', /\b(musicians?|singers?|film|movies?|celebrit(y|ies)|tv|show|artist|influencer|athlete|band|disney|barbie|wicked|anime|game|gaming|video game)\b/i],
  ['Apparel & sneaker capsules', /\b(apparel|clothing|fashion|sneakers?|shoes?|footwear|streetwear|activewear|athleisure|underwear|hoodies?|merch)\b/i],
  ['Accessories for a cult item', /\b(accessor(y|ies)|charms?|phone cases?|straps?|toppers?|bags?|boots?|keychains?|outfits?)\b/i],
  ['Snack & candy crossovers', /\b(snacks?|candy|chocolate|cookies?|chips|cereal|ice cream|dessert|fast food|restaurant|food|bakery|pizza|taco)\b/i],
  ['Pop-ups, cafes & fan events', /\b(events?|pop-ups?|cafes?|diner|festival|concert|tour|experience|community|club)\b/i],
  ['Run clubs & fitness', /\b(running|run clubs?|fitness|gym|sports?|outdoors?|cycling|yoga|workout|wellness|races?)\b/i],
  ['Cozy home scent', /\b(candles?|scents?|home fragrance|home goods?|homeware|bedding|cozy)\b/i],
  ['Store exclusives & treasure hunts', /\b(retail(er)?|store exclusives?|target|costco|aldi|five below|grocery|supermarket|walmart)\b/i],
  ['Jewelry & sparkle', /\b(jewel(le)?ry|bracelets?|necklaces?|rings?|sparkle)\b/i],
];
const typeOf = text => (RX.find(([, re]) => re.test(text || '')) || [null])[0];
const nodes = [], links = [], idx = new Map();
const add = (id, n) => { if (!idx.has(id)) { idx.set(id, nodes.length); nodes.push({ id, ...n }); } return id; };
const link = (s, t, kind, w = 1) => { if (s && t && s !== t) links.push({ source: s, target: t, kind, w }); };
for (const t of cult.business_types) add(`type:${shortOf(t.type)}`, { kind: 'type', name: shortOf(t.type), full: t.type, why: t.why_fans_love_it || '', urls: (t.evidence_urls || []).slice(0, 8), count: t.count || (t.cult_brands_pointing_here || []).length });
for (const b of cult.brands) {
  const id = add(`brand:${b.brand}`, { kind: 'brand', name: b.brand, category: b.category, political: !!b.political, evidence: b.cult_evidence || '' });
  const n = nodes[idx.get(id)];
  n.collabs = (b.collabs || []).map(c => ({ partner: c.partner, category: c.partner_category, year: c.year, url: c.url, seen: c.seen }));
  n.likes = (b.fans_also_love || []).map(l => ({ thing: l.thing, type: l.business_type, url: l.url, seen: l.seen }));
}
for (const t of cult.business_types) for (const b of t.cult_brands_pointing_here || []) if (idx.has(`brand:${b}`)) link(`brand:${b}`, `type:${shortOf(t.type)}`, 'loves');
for (const b of cult.brands) {
  for (const c of b.collabs || []) {
    const pid = add(`collab:${c.partner}`, { kind: 'collab', name: c.partner.replace(/\s*\(.*?\)\s*/g, ' ').trim(), full: c.partner, category: c.partner_category, url: c.url, year: c.year, seen: c.seen, with: [] });
    nodes[idx.get(pid)].with.push(b.brand);
    link(`brand:${b.brand}`, pid, 'collab');
    const ty = typeOf(`${c.partner_category} ${c.partner}`); if (ty && idx.has(`type:${ty}`)) link(pid, `type:${ty}`, 'is');
  }
  for (const l of b.fans_also_love || []) {
    const name = l.thing.split(/ - | \(|;|,/)[0].trim().slice(0, 60);
    const lid = add(`like:${name.toLowerCase()}`, { kind: 'like', name, full: l.thing, url: l.url, seen: l.seen, with: [] });
    nodes[idx.get(lid)].with.push(b.brand);
    link(`brand:${b.brand}`, lid, 'fans like');
    const ty = typeOf(`${l.business_type} ${l.thing}`); if (ty && idx.has(`type:${ty}`)) link(lid, `type:${ty}`, 'is');
  }
}
// Switchers: companies people are leaving, joined to the cult type their best idea matched.
const best = {};
for (const i of ideas.ideas) if (i.scores.cult_overlap > 0 && (!best[i.hotspot] || i.scores.cult_overlap > best[i.hotspot].scores.cult_overlap)) best[i.hotspot] = i;
const seenSw = new Set();
for (const c of sw) {
  const key = c.company.replace(/\s*\(.*?\)\s*/g, ' ').trim(); if (seenSw.has(key.toLowerCase())) continue; seenSw.add(key.toLowerCase());
  const k = kw[c.company];
  const id = add(`switch:${key}`, { kind: 'switch', name: key, full: c.company, sector: c.sector, decision: c.decision, wants: c.what_people_want_instead || [], goingTo: c.alternatives_people_name || [], strength: c.strength,
    quotes: (c.signals || []).slice(0, 4).map(s => ({ quote: s.quote, url: s.url, source: s.source })), searches: k ? new Set(Object.values(k.switching).flat()).size : 0 });
  const b = best[c.company]; if (b?.collab) { const ty = shortOf(b.collab.split(' (loved')[0]); if (idx.has(`type:${ty}`)) link(id, `type:${ty}`, 'could collab'); }
}
const deg = {}; for (const l of links) { deg[l.source] = (deg[l.source] || 0) + 1; deg[l.target] = (deg[l.target] || 0) + 1; }
for (const n of nodes) n.deg = deg[n.id] || 0;
// Brand x type matrix (direct "loves" links plus types reached through their collabs and fan likes).
const typesList = nodes.filter(n => n.kind === 'type').map(n => n.name);
const viaType = (from) => links.filter(l => l.source === from && l.target.startsWith('type:')).map(l => l.target.slice(5));
const matrix = {};
for (const b of nodes.filter(n => n.kind === 'brand')) {
  const row = {}; for (const t of typesList) row[t] = 0;
  for (const l of links.filter(l => l.source === b.id)) {
    if (l.target.startsWith('type:')) row[l.target.slice(5)] += 2;
    else for (const t of viaType(l.target)) row[t] += 1;
  }
  matrix[b.name] = row;
}
writeFileSync('data.json', JSON.stringify({ built: '2026-11-15', nodes, links, types: typesList, matrix }));
const by = {}; for (const n of nodes) by[n.kind] = (by[n.kind] || 0) + 1;
console.log(by, 'links', links.length, 'bytes', JSON.stringify({ nodes, links }).length);
