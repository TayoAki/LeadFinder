// Collabs: which non-competing businesses your customers also love, and a co-branded idea to pitch.
// The Crumbl playbook: borrow a fan base that already overlaps with yours, instead of buying one.
//
// Sources, best first:
//   survey   your customers name brands they love (first-party, ask at checkout or post-purchase)
//   reviews  the other businesses your reviewers also review (counted per business, by hand or by AI)
//   social   brands your followers also follow or mention
// We store COUNTS per business only. Reviewer names, profiles and histories are never saved.
import { getDb } from './db.mjs';

const clip = (s, n) => String(s ?? '').replace(/\s+/g, ' ').trim().slice(0, n);
const norm = s => clip(s, 80).toLowerCase().replace(/^the /, '').replace(/[^a-z0-9& ]+/g, '').replace(/\s+/g, ' ').trim();
const SOURCES = ['survey', 'reviews', 'social', 'other'];

/**
 * Save overlap counts. Either:
 *   businesses: [{ name, category, url, shared }]          already counted
 *   people:     [{ also: [{ name, category }] }]           one anonymous entry per customer/reviewer;
 *                                                          counted here, then discarded
 */
export function addOverlap(wsId, { source = 'reviews', businesses = [], people = [], where } = {}, db = getDb()) {
  const src = SOURCES.includes(source) ? source : 'other';
  const counts = new Map();
  const bump = (b, n) => { const k = norm(b.name); if (!k || n <= 0) return; const c = counts.get(k) || { name: clip(b.name, 80), category: clip(b.category, 60), url: typeof b.url === 'string' && /^https:\/\//.test(b.url) ? b.url.slice(0, 400) : null, n: 0 }; c.n += n; if (!c.category && b.category) c.category = clip(b.category, 60); counts.set(k, c); };
  for (const b of Array.isArray(businesses) ? businesses.slice(0, 500) : []) bump(b, Math.max(0, Math.round(Number(b.shared) || 0)));
  for (const p of Array.isArray(people) ? people.slice(0, 2000) : []) for (const b of new Set((p.also || []).slice(0, 50).map(x => JSON.stringify({ name: x.name, category: x.category })))) bump(JSON.parse(b), 1);
  if (!counts.size) throw Object.assign(new Error('Give businesses with shared counts, or people with the other businesses they love.'), { status: 400 });
  const up = db.prepare(`INSERT INTO collab_overlap (workspace_id, business_key, name, category, url, source, shared, where_found)
    VALUES (?,?,?,?,?,?,?,?) ON CONFLICT(workspace_id, business_key, source) DO UPDATE SET shared = shared + excluded.shared,
    category = COALESCE(NULLIF(excluded.category, ''), category), url = COALESCE(excluded.url, url), where_found = excluded.where_found`);
  for (const [k, c] of counts) up.run(wsId, k, c.name, c.category, c.url, src, c.n, clip(where, 120));
  return { source: src, businesses: counts.size, people_counted: Array.isArray(people) ? Math.min(people.length, 2000) : 0, stored: 'counts only' };
}

/** Partners ranked by shared fans, competitors filtered out. */
export function partners(wsId, ws = {}, { rivalNames = [], limit = 20 } = {}, db = getDb()) {
  const rows = db.prepare('SELECT * FROM collab_overlap WHERE workspace_id = ?').all(wsId);
  const by = new Map();
  for (const r of rows) { const p = by.get(r.business_key) || { name: r.name, category: r.category, url: r.url, shared: 0, sources: {} }; p.shared += r.shared; p.sources[r.source] = (p.sources[r.source] || 0) + r.shared; if (!p.category && r.category) p.category = r.category; by.set(r.business_key, p); }
  const own = norm(ws.brand_name || ''), cat = norm(ws.category || '').split(' ').filter(w => w.length > 3);
  const rivals = new Set(rivalNames.map(norm));
  const all = [...by.entries()].map(([key, p]) => {
    const pc = norm(p.category || '');
    const competitor = key === own || rivals.has(key) || (cat.length && cat.some(w => pc.includes(w)));
    // First-party survey answers count double: customers named them, nobody inferred it.
    const weight = (p.sources.survey || 0) * 2 + (p.sources.reviews || 0) + (p.sources.social || 0) * 0.5 + (p.sources.other || 0) * 0.5;
    return { key, ...p, competitor, score: Math.round(weight * 10) / 10, kinds: Object.keys(p.sources) };
  }).sort((a, b) => b.score - a.score);
  return { partners: all.filter(p => !p.competitor).slice(0, limit), filtered_competitors: all.filter(p => p.competitor).map(p => p.name),
    note: 'Ranked by shared fans; survey answers count double. Overlap is a reason to talk, not proof a collab will sell.' };
}

const IDEAS = [
  { key: 'mashup', name: 'Limited co-branded product', text: (a, b) => `A limited ${a.product} made with or inspired by ${b.name}, sold by both for 2 weeks.` },
  { key: 'bundle', name: 'Bundle or gift box', text: (a, b) => `A "${a.brand} x ${b.name}" box: one of each, sold on both sites, each keeps its own margin.` },
  { key: 'swap', name: 'Audience swap', text: (a, b) => `Each of you features the other to your own customers (email, post or receipt insert) in the same week.` },
  { key: 'giveaway', name: 'Joint giveaway', text: (a, b) => `One giveaway, both prizes, entry by following both. Short, local and clearly run by both brands.` },
  { key: 'event', name: 'Pop-up or event', text: (a, b) => `A one-day pop-up at ${b.name} with ${a.brand} on site, or the other way round.` },
];

/** A co-branded pitch: ideas, an ad concept and the email to send (the user sends it). */
export function collabPitch(partner, ws = {}) {
  const a = { brand: ws.brand_name || '[your brand]', product: ws.brand_product ? ws.brand_product.split(/[,.]/)[0].trim().toLowerCase() : '[your product]' };
  const ideas = IDEAS.map(i => ({ key: i.key, name: i.name, idea: i.text(a, partner) }));
  const evidence = Object.entries(partner.sources).map(([k, n]) => `${n} ${k === 'survey' ? 'customers named you when we asked' : k === 'reviews' ? 'of our reviewers also reviewed you' : `shared fans (${k})`}`).join(', ');
  return {
    partner: partner.name, evidence, ideas,
    ad_concept: {
      headline: `${a.brand} x ${partner.name}`,
      texts: [`${a.brand} x ${partner.name}`, 'Made for the people who love both', 'Limited run'],
      primary_text: `Our customers kept telling us they love ${partner.name}. So we made something together. Here for 2 weeks only.`,
      image_prompt: `Square co-branded product photo: ${a.product} from ${a.brand} next to a signature item from ${partner.name}, sharing one clean surface, natural light, both packages clearly visible, no other brands, small caption "${a.brand} x ${partner.name}".`,
      note: 'Only run it after both brands approve the final art. Never use their logo before they say yes.',
    },
    email: {
      subject: `${a.brand} x ${partner.name}? Our customers keep mentioning you`,
      body: `Hi ${partner.name} team,\n\nI run ${a.brand} (${a.product}). We looked at which other businesses our customers love, and you came up more than anyone: ${evidence}.\n\nWe'd love to do something together. A few ideas:\n${ideas.slice(0, 3).map(i => `- ${i.idea}`).join('\n')}\n\nI've attached a rough mock of what a co-branded post could look like. Nothing goes live without your sign-off.\n\nWorth a 15-minute call next week? If it's not a fit, no worries, and I won't keep emailing.\n\n[your name]\n[your phone]\n[your address]`,
      notes: ['Send from your own address, to a published business contact, once, with a follow-up at most a week later.', 'Use the real counts above; do not round up.', 'A collab is a spike, not a business model: plan what keeps people after it ends.'],
    },
  };
}
