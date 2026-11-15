// SIMULATED, not demand evidence. Reads every catalogue post as the category's ideal customer
// (ICP in server/blog/generate.mjs) and scores whether that reader would buy, shop the store,
// or leave after reading. The rules stand in for the reader's questions; they rank and find weak
// posts, they do not predict real conversion.
//
//   node scripts/simulate-blog-icp.mjs [storeCatalogUrl]
// Writes docs/blog-icp-simulation.md.
import { readFileSync, writeFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { JARGON } from '../server/blog/generate.mjs';

const data = JSON.parse(gunzipSync(readFileSync(new URL('../server/content/catalog-posts.json.gz', import.meta.url))).toString());
const url = process.argv[2] || 'https://web-production-444e2901.up.railway.app/api/commerce/catalog';
let sold = new Set(), storeCats = new Set();
try {
  const c = await (await fetch(url)).json();
  for (const p of c.products || []) { const id = Number(p.metadata?.printify_blueprint_id || p.blueprintId); if (id) sold.add(id); for (const c of p.categories || []) storeCats.add(c.name || c); }
} catch (e) { console.warn('store catalogue not reachable; scoring as if nothing is sold', e.message); }
const STORE_CAT = { 'Hoodies and sweatshirts': 'Apparel', 'T-shirts': 'Apparel', 'Tank tops': 'Apparel', 'Long sleeve tops': 'Apparel', 'Polos and shirts': 'Apparel', 'Bottoms': 'Apparel', 'Dresses': 'Apparel', 'Outerwear': 'Apparel', 'Kids and baby': 'Apparel', 'Swimwear': 'Apparel', 'Mugs and drinkware': 'Home', 'Kitchen and dining': 'Home', 'Wall art': 'Home', 'Home textiles': 'Home', 'Home decor': 'Home', 'Hats': 'Accessories', 'Bags': 'Accessories', 'Phone and tech': 'Accessories', 'Jewelry and accessories': 'Accessories' };
const WEAR = new Set(['Kids and baby', 'Hoodies and sweatshirts', 'Long sleeve tops', 'Tank tops', 'T-shirts', 'Polos and shirts', 'Bottoms', 'Dresses', 'Swimwear', 'Outerwear', 'Footwear']);

// The questions each reader arrives with.
const Q = {
  size: [/\bsizes?\b|\bfits?\b|inches|\boz\b|\d+\s?(in|cm|")/i, 'Which size / how big is it?'],
  material: [/cotton|polyester|ceramic|steel|canvas|paper|fabric|made of|nylon|linen|vinyl|leather|glass|wood|aluminum|acrylic/i, 'What is it made of?'],
  care: [/wash|dishwasher|clean|care|iron|dry/i, 'How do I look after it?'],
  shrink: [/shrink|preshrunk/i, 'Will it shrink?'],
  delivery: [/business day|ships|arriv|reach you/i, 'When will it arrive?'],
  colours: [/colou?rs?\b/i, 'What colours?'],
  cost: [/checkout|\$\d/i, 'What will it cost me?'],
  limits: [/skip it|falls short|not for everyone|one catch/i, 'Is there a catch?'],
};
const asks = (cat) => WEAR.has(cat) ? ['size', 'material', 'care', 'shrink', 'delivery', 'colours', 'cost', 'limits'] : ['size', 'material', 'care', 'delivery', 'cost', 'limits'];

const textOf = (p) => [p.title, p.description, ...(p.intro || []), p.dek, ...(p.items || p.sections || []).flatMap(s => [s.h, s.p, ...(s.bullets || []), ...(s.table ? s.table.head : [])]), ...(p.faq || []).flatMap(f => [f.q, f.a])].filter(Boolean).join(' ');
function score(p) {
  const t = textOf(p);
  const qs = asks(p.category), missed = qs.filter(k => !Q[k][0].test(t));
  const answers = Math.round(40 * (qs.length - missed.length) / qs.length);
  const jargonHits = (t.match(new RegExp(JARGON.source, 'gi')) || []).length + (p.maker || []).filter(w => w.length > 1 && new RegExp(`\\b${w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(t)).length;
  const jargon = jargonHits === 0 ? 15 : jargonHits <= 2 ? 8 : 0;
  const nums = (t.match(/\d+(\.\d+)?/g) || []).length, specific = nums >= 8 ? 10 : nums >= 4 ? 6 : 2;
  const honest = Q.limits[0].test(t) ? 10 : 0;
  const sents = t.split(/[.!?]\s/).filter(Boolean), avg = t.split(/\s+/).length / Math.max(1, sents.length), clarity = avg <= 20 ? 5 : 2;
  const buy = sold.has(p.blueprint_id) ? 20 : storeCats.has(STORE_CAT[p.category]) ? 6 : 0;
  const total = answers + jargon + specific + honest + clarity + buy;
  // Nobody can buy what the store does not sell: "buys" needs this exact item in stock.
  const verdict = total >= 75 && buy === 20 ? 'buys' : total >= 55 && buy > 0 ? 'shops the store' : 'leaves';
  const why = buy < 20 ? (buy ? 'liked it, but cannot buy this exact item; sent to the nearest store category' : 'liked it, but nothing like it is in the store') : missed.length ? `still asking: ${Q[missed[0]][1]}` : 'questions answered and it is in the store';
  return { slug: p.slug, type: p.type, category: p.category, total, verdict, missed: missed.map(k => Q[k][1]), jargonHits, why };
}

const rows = data.posts.map(score);
if (process.env.DEBUG) console.log(rows.filter(r => r.slug.startsWith(process.env.DEBUG)));
const pct = (n, d) => `${Math.round(100 * n / Math.max(1, d))}%`;
const by = (k) => { const m = new Map(); for (const r of rows) { const v = r[k]; m.set(v, [...(m.get(v) || []), r]); } return m; };
const verdicts = ['buys', 'shops the store', 'leaves'];
const line = (rs) => verdicts.map(v => pct(rs.filter(r => r.verdict === v).length, rs.length)).join(' | ');
const median = (xs) => { const s = [...xs].sort((a, b) => a - b); return s[Math.floor(s.length / 2)]; };
// Same reading with buyability set aside: is the writing itself doing its job?
const content = rows.map(r => r.total - (sold.has(data.posts.find(p => p.slug === r.slug).blueprint_id) ? 20 : 0));
const missedCount = {}; for (const r of rows) for (const m of r.missed) missedCount[m] = (missedCount[m] || 0) + 1;

let md = `# Catalogue blog: simulated customer read\n\n**SIMULATED, not demand evidence.** Each post was read by a rule-based stand-in for its category's ideal customer. It ranks posts and finds weak ones; it does not predict real sales. Real numbers come from the blog funnel events (blog view, product view, add to cart) once traffic arrives.\n\nBuilt ${new Date().toISOString().slice(0, 10)} from ${data.posts.length} posts. Store items checked: ${sold.size} product(s) in the store.\n\n## How the reader decides\n\n| Part | Points | What the reader checks |\n|---|---|---|\n| Their questions answered | 40 | Clothing: size, fabric, washing, shrinking, delivery, colours, cost, the catch. Everything else: size, material, care, delivery, cost, the catch |\n| No supplier jargon | 15 | No "blank", "print provider", "your design", brand or model codes |\n| Specific | 10 | Real numbers (measurements, weights, days) |\n| Honest | 10 | Says who should skip it |\n| Easy to read | 5 | Short sentences |\n| Can buy it here | 20 | 20 if this exact item is in the store, 6 if the store has the category, 0 if not |\n\nBuys: 75 or more and this exact item is in the store. Shops the store: 55 or more and the store has the category. Leaves: anything else.\n\nThe rules were written alongside the new posts, so a high writing score is partly self-graded. The persona panel at the end (real readers role-played on a sample) is the less biased check.\n\n## Results\n\n| | Buys | Shops the store | Leaves | Median score |\n|---|---|---|---|---|\n| All posts | ${line(rows).replace(/ \| /g, ' | ')} | ${median(rows.map(r => r.total))} |\n`;
for (const t of ['listicle', 'advertorial']) { const rs = rows.filter(r => r.type === t); md += `| ${t === 'listicle' ? 'Buying guides' : 'Stories'} | ${line(rs)} | ${median(rs.map(r => r.total))} |\n`; }
md += `\nWriting quality alone (out of 80, buyability left out): median ${median(content)}, ${pct(content.filter(x => x >= 60).length, content.length)} of posts score 60 or more. Posts with any supplier jargon left: ${rows.filter(r => r.jargonHits).length}.\n\n## By category\n\n| Category | Posts | Buys | Shops the store | Leaves | Median |\n|---|---|---|---|---|---|\n`;
for (const [cat, rs] of [...by('category')].sort((a, b) => b[1].length - a[1].length)) md += `| ${cat} | ${rs.length} | ${line(rs)} | ${median(rs.map(r => r.total))} |\n`;
md += `\n## Questions readers were still asking\n\n${Object.entries(missedCount).sort((a, b) => b[1] - a[1]).map(([q, n]) => `- ${q} (${n} posts)`).join('\n') || '- None'}\n\n## Why readers left\n\n`;
const whys = {}; for (const r of rows) if (r.verdict !== 'buys') whys[r.why] = (whys[r.why] || 0) + 1;
md += Object.entries(whys).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([w, n]) => `- ${w}: ${n} posts`).join('\n');
md += `\n\n## Weakest 10 posts\n\n${[...rows].sort((a, b) => a.total - b.total).slice(0, 10).map(r => `- ${r.total}: /${r.type === 'listicle' ? 'list' : 'story'}/${r.slug} (${r.why})`).join('\n')}\n`;
writeFileSync(new URL('../docs/blog-icp-simulation.md', import.meta.url), md);
console.log(md.split('## By category')[0]);
