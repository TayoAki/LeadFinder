// Concepts and patterns: which ideas a brand keeps making fresh versions of, which formats several
// brands converge on, and from both, which ad to make next.
// Rule-based so it runs with no model key. It compares ad TEXT (hook, headline, copy) and Meta's own
// creative grouping (collation_id); it does not compare images or video frames.
import { getDb } from './db.mjs';
import { loadAds } from './analytics.mjs';
import { FORMAT_LABEL } from './classify.mjs';

export const SAME_IDEA = 0.55;       // text similarity at which two ads of one brand count as the same idea
export const SAME_HOOK = 0.5;        // similarity at which two brands' hooks count as the same line
export const PROVEN_DAYS = 14;       // a concept is "proven" once one version has run this long
export const FRESH_DAYS = 14;        // a version launched inside this window is "fresh"
const DAY = 86400000;

const STOP = new Set('a an the and or but to of in on for with your you our we it is are be this that just now can will from at by as my me i so all get got its it\'s'.split(' '));

/** Lower-case, strip links, emoji, numbers and brand names, so two versions of one line compare equal. */
export function normalize(text, brandWords = []) {
  let t = (text || '').toLowerCase().replace(/https?:\/\/\S+/g, ' ').replace(/\d+([.,]\d+)?/g, ' # ');
  for (const w of brandWords) if (w.length > 2) t = t.split(w).join(' brand ');
  return t.replace(/[^\p{L}\s#]/gu, ' ').replace(/\s+/g, ' ').trim();
}
const words = t => t.split(' ').filter(w => w && !STOP.has(w));
const bigrams = ws => new Set(ws.slice(1).map((w, i) => `${ws[i]} ${w}`));
const jaccard = (a, b) => { if (!a.size || !b.size) return 0; let n = 0; for (const x of a) if (b.has(x)) n++; return n / (a.size + b.size - n); };

/** 0..1 similarity of two normalized texts: the better of word overlap and word-pair overlap. */
export function similarity(a, b) {
  const wa = words(a), wb = words(b);
  if (!wa.length || !wb.length) return 0;
  return Math.max(jaccard(new Set(wa), new Set(wb)), jaccard(bigrams(wa), bigrams(wb)));
}

// A price or deal in the opening line or headline. ("No code" is not a promo code.)
const OFFER = /\d+\s?% off|save \$?\d|\$\d+(?:\.\d+)?\s?(?:off|\/mo|a month|per month)\b|free (trial|plan|for|month|credits?|forever)|for free\b|promo code|discount|\bsale\b|limited[- ]time|ends (today|tonight|soon)/i;
// Ad structure, read from the copy. Order matters: the first match wins.
export const STRUCTURES = [
  { key: 'creator_story', label: 'Creator story', test: (a, h) => a.format === 'video' && /^(i|i'm|i've|my|so i|okay|ok|when i|last|every)\b/i.test(h) },
  { key: 'testimonial', label: 'Testimonial', test: (a, h) => /^["“]/.test(h) || /\breview|★|⭐|customers say|loved by/i.test(h) },
  { key: 'listicle', label: 'List', test: (a, h) => /^(\d+|top \d+|three|five|ten)\b/i.test(h) },
  { key: 'question', label: 'Question hook', test: (a, h) => /\?\s*$/.test(h) || /^(have|got|do|does|what|why|how|ever|is|are|want)\b[^.!]*\?/i.test(h) },
  { key: 'offer', label: 'Offer', test: (a, h) => OFFER.test(h) || OFFER.test(a.title || '') || a.angle === 'urgency' },
  { key: 'demo', label: 'Demo', test: (a, h) => a.angle === 'demo' || /\b(watch|see (it|how)|type|in action|step by step|steps?)\b/i.test(h) },
  { key: 'promise', label: 'Promise line', test: (a, h) => /\b(if you can|turn (your|an?)|turns? (your |an? )?ideas? into|without (code|coding|learning|developers?)|in minutes|no code|build (a|an|your)|from idea)\b/i.test(h) },
  { key: 'statement', label: 'Statement', test: () => true },
];
export const MEDIUM_LABEL = { ...FORMAT_LABEL, dynamic: 'Dynamic (Meta mixes assets)' };
const medium = a => ((a.display_format || '').toUpperCase() === 'DCO' ? 'dynamic' : a.format || 'static');
const hookOf = a => (a.hook || a.title || a.body || '').trim();
export function structureOf(a) { const h = hookOf(a); return STRUCTURES.find(s => s.test(a, h)).key; }
export const structureLabel = k => STRUCTURES.find(s => s.key === k)?.label || k;
export function signature(a) { return `${medium(a)}:${structureOf(a)}`; }
export const signatureLabel = sig => { const [m, s] = sig.split(':'); return `${MEDIUM_LABEL[m] || m} · ${structureLabel(s)}`; };

function unionFind(n) {
  const p = [...Array(n).keys()];
  const find = x => (p[x] === x ? x : (p[x] = find(p[x])));
  return { find, join: (a, b) => { p[find(a)] = find(b); } };
}
const daysAgo = (date, t) => (date ? Math.round((Date.parse(t) - Date.parse(date)) / DAY) : null);
const mostCommon = xs => Object.entries(xs.reduce((m, x) => ((m[x] = (m[x] || 0) + 1), m), {})).sort((a, b) => b[1] - a[1])[0]?.[0];

/** Group one brand's ads into concepts (the same idea, in one or more versions). */
export function conceptsFor(ads, t, brandWords = []) {
  const keyText = a => normalize(hookOf(a), brandWords);
  const bodyText = a => normalize([a.title, a.body].join(' ').slice(0, 300), brandWords);
  const uf = unionFind(ads.length);
  const byColl = {};
  ads.forEach((a, i) => { if (a.collation_id) (byColl[a.collation_id] ||= []).push(i); });
  Object.values(byColl).forEach(ix => ix.slice(1).forEach(i => uf.join(i, ix[0])));
  const keys = ads.map(keyText), bodies = ads.map(bodyText);
  for (let i = 0; i < ads.length; i++) for (let j = i + 1; j < ads.length; j++) {
    if (uf.find(i) === uf.find(j)) continue;
    const s = Math.max(similarity(keys[i], keys[j]), 0.9 * similarity(bodies[i], bodies[j]));
    if (s >= SAME_IDEA) uf.join(i, j);
  }
  const groups = {};
  ads.forEach((a, i) => (groups[uf.find(i)] ||= []).push(a));
  return Object.values(groups).map(list => {
    const live = list.filter(a => a.is_active);
    const starts = list.map(a => a.start_date).filter(Boolean).sort();
    const longest = Math.max(...list.map(a => a.run_days || 0));
    const fresh = list.filter(a => (daysAgo(a.start_date, t) ?? 999) <= FRESH_DAYS).length;
    const stopped = list.filter(a => !a.is_active).length;
    const exemplar = [...(live.length ? live : list)].sort((a, b) => b.run_days - a.run_days)[0];
    const versions = list.length;
    let status = 'one_off';
    if (versions >= 2 && live.length && longest >= PROVEN_DAYS && fresh) status = 'scaling';
    else if (versions >= 2 && live.length && stopped && longest >= PROVEN_DAYS) status = 'refreshed';
    else if (versions >= 2 && live.length) status = 'testing';
    else if (versions >= 2) status = 'retired';
    const score = live.length * Math.log2(2 + longest) + fresh * 2;
    return {
      rival_id: list[0].rival_id, rival: list[0].rival_name, hook: hookOf(exemplar), versions, live: live.length, fresh,
      stopped, longest, first_launch: starts[0] || null, last_launch: starts.at(-1) || null,
      mediums: [...new Set(list.map(medium))], signature: mostCommon(list.map(signature)), status, score: Math.round(score * 10) / 10,
      exemplar: pick(exemplar), examples: [...list].sort((a, b) => b.is_active - a.is_active || b.run_days - a.run_days).slice(0, 6).map(pick),
    };
  }).sort((a, b) => b.score - a.score);
}
const pick = a => ({ id: a.id, rival_name: a.rival_name, hook: hookOf(a), format: a.format, display_format: a.display_format, is_active: a.is_active,
  run_days: a.run_days, start_date: a.start_date, thumb_url: a.thumb_url, image_url: a.image_url, link_url: a.link_url,
  format_label: MEDIUM_LABEL[medium(a)] || a.format });

export const STATUS_LABEL = { scaling: 'Scaling: fresh versions of a proven idea', refreshed: 'Refreshed: old versions off, new ones live', testing: 'Testing versions', one_off: 'One-off', retired: 'Retired' };

/** Everything the Patterns view needs, for one workspace's rivals. */
export function patterns(db = getDb(), rivalIds = []) {
  const { t, ads } = loadAds(db, { rivalIds });
  const brandWords = [...new Set(ads.flatMap(a => (a.rival_name || '').toLowerCase().split(/[^a-z0-9.]+/)).filter(w => w.length > 2))]
    .flatMap(w => [w, w.replace(/\.[a-z]+$/, '')]);
  const byRival = {};
  for (const a of ads) (byRival[a.rival_id] ||= []).push(a);
  const concepts = Object.values(byRival).flatMap(list => conceptsFor(list, t, brandWords));
  const live = ads.filter(a => a.is_active);

  // 1. Same format, several brands: format signatures across the live ads.
  const sigs = {};
  for (const a of live) (sigs[signature(a)] ||= []).push(a);
  const shared_formats = Object.entries(sigs).map(([sig, list]) => {
    const brands = [...new Set(list.map(a => a.rival_name))];
    const best = [...list].sort((a, b) => b.run_days - a.run_days)[0];
    const perBrand = brands.map(b => pick([...list.filter(a => a.rival_name === b)].sort((x, y) => y.run_days - x.run_days)[0]));
    return { signature: sig, label: signatureLabel(sig), brands, live: list.length, longest: best.run_days, kept: list.filter(a => a.run_days >= 30).length, examples: perBrand };
  }).filter(f => f.brands.length >= 2).sort((a, b) => b.brands.length - a.brands.length || b.live - a.live);

  // 2. Same line, several brands: cluster the live concepts' hooks across rivals.
  const liveConcepts = concepts.filter(c => c.live);
  const keys = liveConcepts.map(c => normalize(c.hook, brandWords));
  const uf = unionFind(liveConcepts.length);
  for (let i = 0; i < liveConcepts.length; i++) for (let j = i + 1; j < liveConcepts.length; j++)
    if (liveConcepts[i].rival_id !== liveConcepts[j].rival_id && similarity(keys[i], keys[j]) >= SAME_HOOK) uf.join(i, j);
  const hg = {};
  liveConcepts.forEach((c, i) => (hg[uf.find(i)] ||= []).push(c));
  const shared_hooks = Object.values(hg).map(cs => ({
    line: cs.sort((a, b) => b.longest - a.longest)[0].hook, brands: [...new Set(cs.map(c => c.rival))], live: cs.reduce((n, c) => n + c.live, 0),
    longest: Math.max(...cs.map(c => c.longest)), scaling: cs.filter(c => c.status === 'scaling').map(c => c.rival), examples: cs.map(c => c.exemplar),
    signature: mostCommon(cs.map(c => c.signature)),
  })).filter(h => h.brands.length >= 2).sort((a, b) => b.brands.length - a.brands.length || b.live - a.live);

  // 3. What to make: patterns several brands share AND someone keeps refreshing, ranked by evidence.
  const iterating = concepts.filter(c => c.status === 'scaling' || c.status === 'refreshed');
  const recs = [
    ...shared_hooks.map(h => ({ kind: 'line', title: h.line, signature: h.signature, brands: h.brands, live: h.live, longest: h.longest,
      iterating: [...new Set(iterating.filter(c => h.brands.includes(c.rival) && similarity(normalize(c.hook, brandWords), normalize(h.line, brandWords)) >= SAME_HOOK).map(c => c.rival))],
      examples: h.examples })),
    ...shared_formats.map(f => ({ kind: 'format', title: f.label, signature: f.signature, brands: f.brands, live: f.live, longest: f.longest,
      iterating: [...new Set(iterating.filter(c => c.signature === f.signature && f.brands.includes(c.rival)).map(c => c.rival))], examples: f.examples })),
  ].filter(r => !r.signature.endsWith(':statement') || r.kind === 'line')   // "Statement" is the catch-all, not a format to copy
    // A line several brands say almost word for word is stronger evidence than a shared structure, so it gets a bonus.
    .map(r => ({ ...r, score: Math.round(((r.kind === 'line' ? 4 : 0) + r.brands.length * 3 + r.iterating.length * 4 + Math.min(r.live, 40) * 0.25 + Math.min(r.longest, 180) / 30) * 10) / 10 }))
    .sort((a, b) => b.score - a.score);
  // One card per format: a shared line in a format already picked becomes that card's suggested line.
  const bySig = new Map();
  for (const r of recs) {
    const had = bySig.get(r.signature);
    if (!had) { bySig.set(r.signature, { ...r, line: r.kind === 'line' ? r.title : null }); continue; }
    if (r.kind === 'line' && !had.line) had.line = r.title;
    had.brands = [...new Set([...had.brands, ...r.brands])];
    had.iterating = [...new Set([...had.iterating, ...r.iterating])];
  }
  const recommendations = [...bySig.values()].slice(0, 3).map(r => ({ ...r, format_label: signatureLabel(r.signature), why: whyLine(r), make: makeLine(r) }));

  return {
    today: t, counted: ads.length, live: live.length,
    recommendations, shared_formats, shared_hooks,
    iterating: Object.values(groupByRival(iterating)).sort((a, b) => b.concepts.length - a.concepts.length),
    note: 'Compares ad text and Meta\'s creative groups, not the images or video frames. Run length shows an ad lasted, not that it made money.',
  };
}
function groupByRival(cs) { const m = {}; for (const c of cs) (m[c.rival] ||= { rival: c.rival, concepts: [] }).concepts.push(c); return m; }
function whyLine(r) {
  const parts = [`${r.brands.length} brands run it (${r.brands.join(', ')})`, `${r.live} live ads`, `longest has run ${r.longest} days`];
  if (r.iterating.length) parts.push(`${r.iterating.join(', ')} ${r.iterating.length === 1 ? 'keeps' : 'keep'} making fresh versions`);
  return parts.join(' · ');
}
function makeLine(r) {
  const fmt = signatureLabel(r.signature);
  return r.line
    ? `${fmt} ad. Say the idea behind "${r.line}" in your own words, with your own proof point, so it reads as yours.`
    : `${fmt} ad. Copy the structure of the longest-running example, not its wording.`;
}
