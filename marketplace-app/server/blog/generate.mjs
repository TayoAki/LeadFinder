// Catalogue posts: one listicle (buying guide) and one advertorial (story) per Printify blueprint,
// written only from that blueprint's own catalogue facts (Printify API: description, features,
// care, size guide, print providers, variants, shipping). No claim is added that the data does not
// support; a section with no data is left out rather than padded.
//
// SEO rules applied (seo-skills: seo-title-optimization, unslop-seo, intro, internal-linking):
//   - the direct answer sits in the first 40 words; a journey teaser follows
//   - titles put the searched name first (brand + model) and stay near 40-60 characters
//   - sentence-case headings, at least one heading phrased as the buyer's question, FAQ block
//   - no em/en dashes, no filler vocabulary; every post links to its sibling, related posts,
//     its category hub and the store
const DECORATION = { dtg: 'direct-to-garment (DTG) printing', dtf: 'direct-to-film (DTF) transfer', embroidery: 'embroidery', sublimation: 'sublimation', screen: 'screen printing', uv: 'UV printing', laser: 'laser engraving', vinyl: 'vinyl', all_over_print: 'all-over print', aop: 'all-over print', digital: 'digital printing', dye_sublimation: 'dye sublimation' };
const COUNTRY = { US: 'the US', GB: 'the UK', CA: 'Canada', AU: 'Australia', DE: 'Germany', LV: 'Latvia', CZ: 'Czechia', CN: 'China', LT: 'Lithuania', PL: 'Poland', FR: 'France', ES: 'Spain', NL: 'the Netherlands', MX: 'Mexico', IT: 'Italy', SE: 'Sweden', JP: 'Japan', BE: 'Belgium', DK: 'Denmark', NZ: 'New Zealand' };

// Catalogue categories (blog hubs), matched on the blueprint title; first match wins.
export const CATEGORIES = [
  ['Kids and baby', /\b(kid|kids|youth|toddler|baby|infant|onesie|bodysuit|bib)\b/],
  ['Pet products', /\b(pet|dog|cat|bandana collar|leash)\b/],
  ['Hoodies and sweatshirts', /hoodie|sweatshirt|crewneck|zip[- ]up|pullover/],
  ['Long sleeve tops', /long sleeve|longsleeve|raglan/],
  ['Tank tops', /tank|camisole|muscle/],
  ['T-shirts', /t-shirt|\btee\b|tshirt|jersey/],
  ['Polos and shirts', /polo|button|shirt|blouse/],
  ['Bottoms', /pant|jogger|short|legging|skirt|sweatpant|trouser/],
  ['Dresses', /dress/],
  ['Swimwear', /swim|bikini/],
  ['Outerwear', /jacket|windbreaker|vest|coat|fleece/],
  ['Hats', /\bhat\b|\bcap\b|beanie|bucket|visor|snapback|trucker/],
  ['Footwear', /shoe|sneaker|slipper|slide|flip|sock/],
  ['Bags', /bag|tote|backpack|fanny|pouch|duffel|wallet/],
  ['Phone and tech', /phone|case|airpod|laptop|mouse pad|mousepad|tablet|charger|popsocket|skin/],
  ['Mugs and drinkware', /mug|tumbler|bottle|glass|cup|can cooler|koozie|flask/],
  ['Kitchen and dining', /apron|plate|bowl|coaster|cutting board|placemat|napkin|oven|kitchen|lunch/],
  ['Wall art', /poster|canvas|print|frame|tapestry|wall|metal art|acrylic/],
  ['Home textiles', /pillow|cushion|blanket|throw|towel|rug|mat|curtain|duvet|sheet|shower/],
  ['Home decor', /candle|clock|ornament|vase|sign|magnet|puzzle|decor/],
  ['Stationery and stickers', /sticker|notebook|journal|card|calendar|planner|paper|postcard|bookmark/],
  ['Jewelry and accessories', /necklace|bracelet|earring|ring|keychain|pin|scarf|mask|glasses|watch|tie/],
  ['Sports and outdoors', /yoga|golf|ball|sport|jersey|bike|camping|beach/],
];
export const categoryOf = (title) => { const t = title.toLowerCase(); return (CATEGORIES.find(([, re]) => re.test(t)) || ['Other products'])[0]; };

export const slugify = (s) => s.toLowerCase().replace(/['’]/g, '').normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 80);
const clean = (s) => String(s ?? '').replace(/<br\s*\/?>/gi, '\n').replace(/<\/(p|li)>/gi, '\n').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#39;|&rsquo;/g, "'").replace(/&quot;|&ldquo;|&rdquo;/g, '"')
  .replace(/[–—]/g, ', ').replace(/[ \t]+/g, ' ').replace(/ ?\n ?/g, '\n').replace(/\n{2,}/g, '\n').trim();
const sentences = (s) => clean(s).split(/\n|(?<=[.!?])\s+(?=[A-Z])/).map(x => x.trim()).filter(x => x.length > 2);
// Meta descriptions: up to 158 characters, ending at a sentence (or failing that, a word) boundary.
const metaDesc = (s) => { const t = clean(s); if (t.length <= 158) return t; const cut = t.slice(0, 158); const dot = cut.lastIndexOf('. '); return dot > 80 ? cut.slice(0, dot + 1) : `${cut.slice(0, cut.lastIndexOf(' '))}…`; };
const money = (cents) => `$${(cents / 100).toFixed(2)}`;
const list = (xs) => xs.length <= 1 ? (xs[0] ?? '') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`;
const lc = (s) => s.charAt(0).toLowerCase() + s.slice(1);
const sentenceCase = (s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
const hash = (s) => { let h = 2166136261; for (const c of String(s)) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
const pick = (id, arr, salt = '') => arr[hash(`${id}${salt}`) % arr.length];
const SIZE_ORDER = ['XXS', 'XS', 'S', 'M', 'L', 'XL', '2XL', 'XXL', '3XL', '4XL', '5XL', '6XL'];
const sortSizes = (xs) => [...xs].sort((a, b) => { const ia = SIZE_ORDER.indexOf(a.toUpperCase()), ib = SIZE_ORDER.indexOf(b.toUpperCase()); return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib) || a.localeCompare(b, undefined, { numeric: true }); });

// Normalised facts for one blueprint (everything a post can say).
export function facts(raw) {
  const b = raw.blueprint;
  const title = clean(b.title);
  const brand = clean(b.brand || ''), model = clean(b.model || '');
  const name = brand && model && !/generic/i.test(brand) ? `${brand} ${model}` : title;
  const colours = [...new Set((raw.variants || []).map(v => v.o?.color).filter(Boolean))];
  const sizes = sortSizes([...new Set((raw.variants || []).map(v => v.o?.size).filter(Boolean))]);
  const positions = [...new Set((raw.variants || []).flatMap(v => v.p || []))].map(p => p.replace(/_/g, ' '));
  const methods = [...new Set([...(raw.variants || []).flatMap(v => v.d || []), ...raw.providers.flatMap(p => p.decoration_methods || [])])];
  const provs = raw.providers.filter(p => p.title);
  const times = provs.map(p => p.production_time?.average).filter(x => typeof x === 'number');
  const countries = [...new Set(provs.map(p => p.location?.country).filter(Boolean))];
  const features = (b.features || []).filter(f => f.name && f.description).map(f => ({ name: clean(f.name), text: clean(f.description) }));
  const material = features.filter(f => /fiber|fabric|material|composition|cotton|polyester|weight/i.test(f.name));
  const build = features.filter(f => !material.includes(f));
  const guide = raw.sizes && raw.sizes.sizes?.length && raw.sizes.types?.length ? raw.sizes : null;
  return {
    id: b.id, title, brand, model, name, category: categoryOf(title), image: (b.images || [])[0] || null,
    description: sentences(b.description || '').slice(0, 6), material, build, care: (b.care_instructions || []).map(clean).filter(Boolean),
    colours, sizes, positions, methods: methods.map(m => DECORATION[m] || m.replace(/_/g, ' ')), providers: provs, fastest: times.length ? Math.min(...times) : null,
    countries: countries.map(c => COUNTRY[c] || c), guide, shipUS: raw.shipping?.us || null, shipRow: raw.shipping?.row || null, handling: raw.shipping?.handling || null,
  };
}

function sizeTable(f) {
  if (!f.guide) return null;
  const types = f.guide.types.filter(t => t.ranges?.length);
  if (!types.length) return null;
  // Printify gives "length" measurements in millimetres; shown in inches for US shoppers.
  const conv = (t, v) => { if (!v) return ''; const n = parseFloat(v); return t.units === 'length' && Number.isFinite(n) ? String(Number((n / 25.4).toFixed(1))) : v; };
  const head = ['Size', ...types.map(t => { const n = sentenceCase(t.name); return t.units !== 'length' ? n : /\)$/.test(n) ? n.replace(/\)$/, ', in)') : `${n} (in)`; })];
  const rows = f.guide.sizes.map((s, i) => [s, ...types.map(t => { const r = t.ranges[i] || {}; const a = conv(t, r.from), b = conv(t, r.to); return a && b && a !== b ? `${a}-${b}` : (a || b || '-'); })]);
  return { head, rows };
}
const NOUN = { 'Kids and baby': 'kids\' piece', 'Pet products': 'pet product', 'Hoodies and sweatshirts': 'sweatshirt', 'Long sleeve tops': 'long sleeve top', 'Tank tops': 'tank top', 'T-shirts': 't-shirt', 'Polos and shirts': 'shirt', 'Bottoms': 'pair of bottoms', 'Dresses': 'dress', 'Swimwear': 'swimwear piece', 'Outerwear': 'outerwear piece', 'Hats': 'hat', 'Footwear': 'footwear piece', 'Bags': 'bag', 'Phone and tech': 'tech accessory', 'Mugs and drinkware': 'drinkware piece', 'Kitchen and dining': 'kitchen item', 'Wall art': 'wall art piece', 'Home textiles': 'home textile', 'Home decor': 'decor piece', 'Stationery and stickers': 'stationery item', 'Jewelry and accessories': 'accessory', 'Sports and outdoors': 'sports item', 'Other products': 'product' };
const article = (w) => (/^[aeiou]/i.test(w) ? 'an' : 'a');
const sizeRange = (f) => f.sizes.length > 1 ? `sizes ${f.sizes[0]} to ${f.sizes[f.sizes.length - 1]}` : f.sizes.length ? `size ${f.sizes[0]}` : null;
const days = (n) => `${Number(n.toFixed(1))} business day${n === 1 ? '' : 's'}`;
const shipLine = (f) => f.shipUS?.first_item ? `US shipping costs ${money(f.shipUS.first_item.cost)} for the first item${f.shipUS.additional_items ? ` and ${money(f.shipUS.additional_items.cost)} for each extra one` : ''}` : null;

// ---------- listicle: "N things to know before you buy" ----------
function listicle(f, ctx) {
  const items = [];
  const t = lc(f.title);
  if (f.material.length || f.description.length) items.push({ h: 'What it is made of', p: f.material.length ? f.material.map(m => `${m.name}: ${m.text.replace(/\.$/, '')}.`).join(' ') : f.description[0] });
  const table = sizeTable(f);
  if (table || f.sizes.length) items.push({ h: 'How it fits and which sizes it comes in', p: `${sizeRange(f) ? `The ${f.title} comes in ${sizeRange(f)}.` : ''} ${table ? `Measurements below are in inches, taken flat, from the ${f.brand ? `${f.brand} ` : ''}size guide. Compare them with something you already own that fits well.` : ''}`.trim(), table });
  if (f.colours.length) items.push({ h: `${f.colours.length} colour${f.colours.length === 1 ? '' : 's'} to choose from`, p: `With the fastest print provider, it comes in ${list(f.colours.slice(0, 24))}${f.colours.length > 24 ? `, plus ${f.colours.length - 24} more` : ''}.` });
  if (f.positions.length || f.methods.length) items.push({ h: 'Where your design can go', p: `${f.positions.length ? `Print areas: ${list(f.positions)}.` : ''} ${f.methods.length ? `Decoration ${f.methods.length === 1 ? 'method' : 'methods'}: ${list(f.methods)}.` : ''}`.trim() });
  if (f.build.length) items.push({ h: 'How it is built', bullets: f.build.map(x => `${x.name}: ${x.text.replace(/\.$/, '')}.`) });
  if (f.providers.length) items.push({ h: 'Who prints it, and how fast', p: `${f.providers.length} print provider${f.providers.length === 1 ? '' : 's'} make${f.providers.length === 1 ? 's' : ''} the ${f.title}${f.countries.length ? `, in ${list(f.countries)}` : ''}.${f.fastest ? ` The fastest averages ${days(f.fastest)} to produce an order.` : ''}`, bullets: f.providers.slice(0, 6).map(p => `${p.title}${p.location?.country ? ` (${COUNTRY[p.location.country] || p.location.country})` : ''}${p.production_time?.average ? `: about ${days(p.production_time.average)}` : ''}`) });
  if (f.shipUS || f.shipRow) items.push({ h: 'What shipping costs', p: [shipLine(f) ? `${shipLine(f)}.` : '', f.shipRow?.first_item ? `Outside the listed regions, the first item ships for ${money(f.shipRow.first_item.cost)}.` : '', f.handling?.value ? `Allow about ${f.handling.value} ${f.handling.unit}s for handling before it ships.` : ''].filter(Boolean).join(' ') });
  if (f.care.length) items.push({ h: 'How to care for it', bullets: f.care });
  if (!items.length) return null;

  const n = items.length;
  const noun = NOUN[f.category] || 'product';
  const stats = [sizeRange(f) && `comes in ${sizeRange(f)}`, f.colours.length && `has ${f.colours.length} colour${f.colours.length === 1 ? '' : 's'}`, f.fastest && `is made to order in about ${days(f.fastest)}`].filter(Boolean);
  const opening = [`The ${f.title}${f.name !== f.title ? ` (${f.name})` : ''} is ${article(noun)} ${noun}${f.brand && f.name === f.title ? ` from ${f.brand}` : ''} that ${stats.length ? list(stats) : 'is printed on demand'}.`,
    f.description[0] && f.description[0].length < 220 ? f.description[0] : ''].filter(Boolean);
  const teaser = `Below are the ${n} things to check before you order: ${list(items.map(i => lc(i.h)))}.`;
  const faq = faqFor(f);
  const head = f.name !== f.title ? f.name : f.title;
  return {
    type: 'listicle', slug: `${ctx.base}-buying-guide`, blueprint_id: f.id, category: f.category, image: f.image,
    title: `${n} things to know before you buy the ${f.title}`,
    seo_title: `${head}: ${n} things to know before you buy`.replace(/^(.{0,58}).*$/, '$1'),
    description: metaDesc(opening.join(' ')),
    intro: [opening.join(' ').replace(/^\.\s*/, ''), teaser], items, faq, sibling: `${ctx.base}-story`,
  };
}

function faqFor(f) {
  const faq = [];
  const tbl = sizeTable(f);
  if (f.sizes.length || tbl) faq.push({ q: `How does the ${f.title} fit?`, a: `It comes in ${sizeRange(f) || 'the sizes shown in the size guide'}.${tbl ? ` Check the size guide measurements against a piece you own; if you are between sizes, the larger one is the safer choice.` : ''}` });
  if (f.material.length) faq.push({ q: `What is the ${f.title} made of?`, a: f.material.map(m => m.text.replace(/\.$/, '')).join('. ') + '.' });
  if (f.fastest || f.handling?.value) faq.push({ q: `How long does the ${f.title} take to arrive?`, a: [f.fastest && `Production averages about ${days(f.fastest)} with the fastest provider`, f.handling?.value && `allow around ${f.handling.value} ${f.handling.unit}s of handling before it ships`].filter(Boolean).join(', ') + '. Delivery time then depends on the shipping method and address.' });
  if (f.care.length) faq.push({ q: `How should I wash the ${f.title}?`, a: f.care.slice(0, 4).join('. ') + '.' });
  if (shipLine(f)) faq.push({ q: `How much does shipping cost for the ${f.title}?`, a: `${shipLine(f)}.` });
  return faq;
}

// ---------- advertorial: story about the product ----------
function advertorial(f, ctx) {
  if (!f.description.length && !f.material.length && !f.build.length) return null;
  const angle = pick(f.id, [
    { title: `Why the ${f.title} is a dependable base for your design`, seo: `Why the ${f.name} is a dependable base` },
    { title: `What makes the ${f.title} worth printing on`, seo: `What makes the ${f.name} worth printing on` },
    { title: `The ${f.title}: a closer look before you order`, seo: `The ${f.name}: a closer look` },
  ], 'angle');
  const sections = [];
  if (f.description.length) sections.push({ h: `What the ${f.title} is`, p: f.description.slice(0, 3).join(' ') });
  if (f.material.length) sections.push({ h: 'The fabric and materials', p: f.material.map(m => `${m.text.replace(/\.$/, '')}.`).join(' ') });
  if (f.build.length) sections.push({ h: 'Details that hold up over time', p: f.build.slice(0, 4).map(x => `${x.name}: ${lc(x.text.replace(/\.$/, ''))}.`).join(' ') });
  if (f.providers.length) sections.push({ h: 'Printed after you order it', p: `Nothing is made in advance. ${f.providers.length === 1 ? 'A print provider' : `One of ${f.providers.length} print providers`}${f.countries.length ? ` in ${list(f.countries)}` : ''} prints each order${f.fastest ? `, with the fastest averaging ${days(f.fastest)} in production` : ''}. ${f.methods.length ? `Designs are applied with ${list(f.methods)}.` : ''}`.trim() });
  if (f.colours.length || f.sizes.length) sections.push({ h: `Is the ${f.title} right for you?`, p: `${[f.colours.length && `${f.colours.length} colour${f.colours.length === 1 ? '' : 's'}`, sizeRange(f)].filter(Boolean).join(' and ') ? `It is a good fit if you want ${[f.colours.length && `${f.colours.length} colour${f.colours.length === 1 ? '' : 's'}`, sizeRange(f)].filter(Boolean).join(' across ')}.` : ''} ${f.care.length ? `Care is simple: ${lc(f.care.slice(0, 2).join('; '))}.` : ''}`.trim() });
  if (shipLine(f)) sections.push({ h: 'Shipping', p: `${shipLine(f)}.` });
  const dek = `${f.description[0] || `The ${f.title} from ${f.brand || 'Printify'}.`} ${[f.colours.length && `${f.colours.length} colours`, sizeRange(f), f.fastest && `made to order in about ${days(f.fastest)}`].filter(Boolean).join(', ')}.`.replace(/\.\s*\./g, '.');
  return {
    type: 'advertorial', slug: `${ctx.base}-story`, blueprint_id: f.id, category: f.category, image: f.image,
    kicker: 'From the Shelby team', title: angle.title, seo_title: angle.seo.slice(0, 60), description: metaDesc(dek),
    dek, sections, faq: faqFor(f).slice(0, 3), sibling: `${ctx.base}-buying-guide`,
  };
}

// All posts for all blueprints, with related-post links inside each category.
export function buildPosts(raws) {
  const used = new Set();
  const all = [];
  for (const raw of raws) {
    if (!raw?.blueprint?.title) continue;
    const f = facts(raw);
    let base = slugify(f.name !== f.title ? `${f.name} ${f.title}` : f.title);
    if (used.has(base)) base = `${base}-${f.id}`;
    used.add(base);
    for (const p of [listicle(f, { base }), advertorial(f, { base })]) if (p) all.push({ ...p, product_name: f.name, product_title: f.title });
  }
  // Printify has a few differently made products with the same name: give those titles the
  // catalogue number so every title is unique.
  const seen = new Map(); for (const p of all) seen.set(p.seo_title, (seen.get(p.seo_title) || 0) + 1);
  for (const p of all) if (seen.get(p.seo_title) > 1) { p.seo_title = `${p.seo_title} (no. ${p.blueprint_id})`; p.title = `${p.title} (no. ${p.blueprint_id})`; }
  const byCat = new Map();
  for (const p of all) { if (!byCat.has(p.category)) byCat.set(p.category, []); byCat.get(p.category).push(p); }
  for (const p of all) {
    const pool = byCat.get(p.category).filter(x => x.type === p.type && x.slug !== p.slug);
    const start = hash(p.slug) % Math.max(1, pool.length);
    p.related = [0, 1, 2, 3].map(i => pool[(start + i * 7) % pool.length]?.slug).filter((s, i, a) => s && a.indexOf(s) === i);
    if (!all.some(x => x.slug === p.sibling)) delete p.sibling;
  }
  return all;
}
