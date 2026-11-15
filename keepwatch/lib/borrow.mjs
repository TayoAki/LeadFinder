// "Steal from another industry, not another competitor."
//   conventions()  what every tracked rival does (the habits to break) and what nobody does
//   stanceCheck()  the swap test: would your stance still be true with a rival's name in it?
//   matchDonors()  moves from other industries (donors.mjs), ranked for this brand and category
//   writeBrief()   a creative brief for one move, filled with the brand's own facts
// Rule-based, so it all works without a model key; with ANTHROPIC_API_KEY the brief is written
// for the brand by Claude, inside the same rules.
import { getDb } from './db.mjs';
import { loadAds } from './analytics.mjs';
import { STRUCTURES, structureOf, structureLabel, normalize, similarity } from './concepts.mjs';
import { ANGLES, angleLabel } from './classify.mjs';
import { DONORS, JOBS, donorById } from './donors.mjs';
import { hasLLM, askJSON, RULES } from './llm.mjs';

const pct = (a, b) => (b ? Math.round((100 * a) / b) : 0);
const MEDIUM = { static: 'static images', video: 'videos', carousel: 'carousels' };
// Common words that say nothing about the category (kept out of "everyone says").
const STOP = new Set(('a an the and or but to of in on for with your you our we it is are be this that just now can will from at by as my me i so all get got its it\'s not no do does more most than what who how why when new one only every day '
  + 'make made makes like back have has had always never ready right want need feel feels keep keeps take takes give gives know look looks find help helps even still also much many really very here there they them their then into about over after before time first last best good great better start today come comes going thing things would could should been being were your yours ours each other same since while where which these those through without again around down well people little lot lots').split(' '));

/** What the category does: habits shared by most rivals, and formats or angles nobody uses. */
export function conventions(db = getDb(), rivalIds = []) {
  const { ads } = loadAds(db, { rivalIds });
  const live = ads.filter(a => a.is_active);
  const pool = live.length >= 8 ? live : ads;
  const brands = [...new Set(pool.map(a => a.rival_name))];
  if (!pool.length) return { n: 0, brands: [], rules: [], gaps: [], share: {}, note: 'Track rivals to see what your category does.' };
  const share = {};
  const count = (key, test) => { const hit = pool.filter(test); share[key] = hit.length / pool.length; return hit; };
  const brandsOf = list => [...new Set(list.map(a => a.rival_name))];
  const rules = [];
  for (const m of ['static', 'video', 'carousel']) {
    const hit = count(m, a => a.format === m);
    if (share[m] >= 0.4) rules.push({ key: m, text: `${pct(hit.length, pool.length)}% of their ads are ${MEDIUM[m]}`, share: share[m], brands: brandsOf(hit) });
  }
  for (const s of STRUCTURES) {
    const hit = count(s.key, a => structureOf(a) === s.key);
    if (share[s.key] >= 0.3 && s.key !== 'statement') rules.push({ key: s.key, text: `${pct(hit.length, pool.length)}% open with a ${s.label.toLowerCase()}`, share: share[s.key], brands: brandsOf(hit) });
    if (s.key === 'statement' && share.statement >= 0.4) rules.push({ key: 'statement', text: `${pct(hit.length, pool.length)}% are a plain benefit statement`, share: share.statement, brands: brandsOf(hit) });
  }
  for (const g of ANGLES) {
    const hit = count(g.key, a => a.angle === g.key);
    if (share[g.key] >= 0.2) rules.push({ key: g.key, text: `${pct(hit.length, pool.length)}% lead with ${g.label.toLowerCase()}`, share: share[g.key], brands: brandsOf(hit) });
  }
  // Words most brands use in their hooks and headlines (brand names left out).
  const brandWords = new Set(brands.flatMap(b => b.toLowerCase().split(/[^a-z0-9]+/)));
  const byWord = {};
  for (const a of pool) for (const w of new Set(normalize(`${a.hook || ''} ${a.title || ''}`).split(' ')))
    if (w.length > 3 && !STOP.has(w) && !/n$|^(doesn|isn|wasn|aren|didn)/.test(w) && !brandWords.has(w) && w !== 'brand') ((byWord[w] ||= { brands: new Set(), ads: 0 }).brands.add(a.rival_name), byWord[w].ads++);
  // A category word: most brands use it AND it shows up in a real share of their ads.
  const words = Object.entries(byWord).filter(([, x]) => x.brands.size >= Math.max(2, Math.ceil(brands.length * 0.6)) && x.ads >= pool.length * 0.08)
    .sort((a, b) => b[1].ads - a[1].ads).slice(0, 8).map(([w]) => w);
  if (words.length) rules.push({ key: 'words', text: `Everyone says: ${words.map(w => `"${w}"`).join(', ')}`, share: 1, brands });
  rules.sort((a, b) => b.share - a.share);
  // Open ground: formats and angles almost nobody runs.
  const gaps = [];
  for (const s of STRUCTURES) if (s.key !== 'statement' && (share[s.key] || 0) < 0.05) gaps.push({ key: s.key, text: `${s.label}: ${share[s.key] ? 'almost nobody' : 'nobody'} runs it` });
  for (const g of ANGLES) if (['founder', 'comparison', 'social_proof', 'demo', 'before_after'].includes(g.key) && (share[g.key] || 0) < 0.05) gaps.push({ key: g.key, text: `${g.label}: ${share[g.key] ? 'almost nobody' : 'nobody'} leads with it` });
  return { n: pool.length, live: live.length, brands, rules: rules.slice(0, 8), gaps: gaps.slice(0, 6), share, words,
    note: `From ${pool.length} ${live.length >= 8 ? 'live ' : ''}ads by ${brands.length} rivals. If every rival does it, buyers have stopped noticing it.` };
}

// Words any brand could say. A stance built from them fails the swap test.
const GENERIC = /\b(premium|quality|high[- ]quality|best|better|great|amazing|trusted|innovative|leading|world[- ]class|delicious|healthy|natural|affordable|easy|simple|convenient|perfect|ultimate|love|passion(ate)?|customers? first|excellence|solutions?|unique|authentic|curated|elevate|next[- ]level|game[- ]changer)\b/gi;
const ENEMY = /\b(stop|never|instead of|unlike|no more|against|hate|refuse|won'?t|will not|not another|without|ban|quit|wrong)\b/i;

/** The swap test (Tuan Le): put a rival's name in place of yours. If the line still works, it is not yours. */
export function stanceCheck(stance, ws = {}, db = getDb(), rivalIds = []) {
  const line = String(stance || '').trim();
  if (!line) return { verdict: 'empty', checks: [], tips: ['Write one sentence: what your brand stands for that a rival would not say.'] };
  const { ads } = loadAds(db, { rivalIds });
  const brandWords = [ws.brand_name, ...new Set(ads.map(a => a.rival_name))].filter(Boolean).flatMap(b => b.toLowerCase().split(/[^a-z0-9]+/)).filter(w => w.length > 2);
  const mine = normalize(line, brandWords);
  let closest = null;
  for (const a of ads) for (const text of [a.hook, a.title, (a.body || '').slice(0, 240)]) {
    if (!text) continue;
    const s = similarity(mine, normalize(text, brandWords));
    if (!closest || s > closest.sim) closest = { sim: s, rival: a.rival_name, line: text.slice(0, 160), ad_id: a.id };
  }
  const generic = [...new Set((line.match(GENERIC) || []).map(w => w.toLowerCase()))];
  const hasEnemy = ENEMY.test(line), hasNumber = /\d/.test(line), personal = /\b(i|we|my|our)\b/i.test(line);
  const wordsN = line.split(/\s+/).length;
  const checks = [
    { ok: !generic.length, text: generic.length ? `Any brand could claim: ${generic.join(', ')}` : 'No words any brand could claim' },
    { ok: !closest || closest.sim < 0.3, text: closest && closest.sim >= 0.3 ? `Close to what ${closest.rival} already says` : 'Not something your rivals already say' },
    { ok: hasEnemy, text: hasEnemy ? 'Takes a side (names something you are against)' : 'Takes no side: add what you refuse to do or are against' },
    { ok: hasNumber || personal, text: hasNumber || personal ? 'Specific to you (a number or a first-person story)' : 'Not specific yet: add a number, a fact or why you started' },
    { ok: wordsN >= 5 && wordsN <= 30, text: wordsN < 5 ? 'Too short to mean anything yet' : wordsN > 30 ? 'Too long to remember: one sentence' : 'Short enough to remember' },
  ];
  const passed = checks.filter(c => c.ok).length;
  // Generic words or a rival's own line can never pass, however specific the rest is.
  const verdict = !checks[1].ok ? 'shared' : !checks[0].ok ? (passed >= 4 ? 'nearly' : 'generic') : passed >= 4 ? 'yours' : passed >= 3 ? 'nearly' : 'generic';
  const rival = closest?.rival || ads[0]?.rival_name;
  const swapped = rival && ws.brand_name ? line.replace(new RegExp(ws.brand_name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), rival) : null;
  const tips = [];
  if (!hasEnemy) tips.push('Pick a hill: what does your category do that you refuse to? ("We will never..." / "Stop...")');
  if (generic.length) tips.push(`Swap ${generic.slice(0, 2).map(w => `"${w}"`).join(' and ')} for a fact only you can say.`);
  if (!hasNumber && !personal) tips.push('Add the reason you exist: the thing that annoyed you into starting.');
  return { verdict, label: { yours: 'Yours: a rival could not say this', nearly: 'Nearly yours', shared: 'A rival could say this', generic: 'Generic: any brand could say this' }[verdict],
    checks, closest: closest && closest.sim >= 0.15 ? { ...closest, sim: Math.round(closest.sim * 100) } : null,
    swap: swapped && rival ? { rival, line: swapped.includes(rival) ? swapped : `${rival}: ${line}` } : null, tips };
}

// Which problems this brand has, read from its own description.
export function jobsFor(ws = {}) {
  const t = [ws.brand_product, ws.category, ws.brand_offer, ws.brand_voice, ws.audience].filter(Boolean).join(' ').toLowerCase();
  const jobs = new Set(['commodity', 'trust']);
  if (/\b(app|software|saas|platform|ai|tool|api|dashboard|analytics|automation|crm|fintech|card|insurance|bank|b2b)\b/.test(t)) jobs.add('technical');
  if (/\b(taste|flavou?r|spicy|drink|soda|food|snack|scent|skin|texture|clean(ing)?|coffee|tea|candy|sauce|beauty|fizz|sparkling)\b/.test(t)) jobs.add('sensory');
  if (/\b(cheap|budget|afford\w*|under \$|value|low[- ]cost|bargain|discount)\b/.test(t)) jobs.add('budget');
  if (/\b(insurance|bank|accounting|tax|plumb\w*|lawn|storage|paper|water|fiber|fibre|supplement|vitamin|cleaning|software|b2b|logistics|hvac)\b/.test(t)) jobs.add('boring');
  return [...jobs];
}

/** Donor moves ranked for this brand: fits its problems, breaks what every rival does, and no rival runs it. */
export function matchDonors(ws = {}, conv = { share: {}, rules: [] }) {
  const jobs = jobsFor(ws);
  return DONORS.map(d => {
    const reasons = [];
    let score = 1;
    const jobHits = d.jobs.filter(j => jobs.includes(j));
    if (jobHits.length) { score += 2 * jobHits.length; reasons.push(`Fits your situation: ${jobHits.map(j => JOBS[j].toLowerCase()).join('; ')}`); }
    const broken = d.breaks.filter(k => (conv.share?.[k] || 0) >= 0.3);
    if (broken.length) {
      score += 2 * broken.length;
      const label = k => MEDIUM[k] || { statement: 'plain benefit statements', offer: 'offers', promise: 'promise lines', demo: 'demos', question: 'question hooks' }[k] || (STRUCTURES.find(s => s.key === k) ? structureLabel(k).toLowerCase() : angleLabel(k).toLowerCase());
      reasons.push(`Breaks your category's habit: rivals lean on ${broken.slice(0, 2).map(label).join(' and ')}`);
    }
    // Different medium from the one most rivals run.
    const top = ['static', 'video', 'carousel'].sort((x, y) => (conv.share?.[y] || 0) - (conv.share?.[x] || 0))[0];
    const mine = d.format === 'series' ? 'video' : d.format;
    if ((conv.share?.[top] || 0) >= 0.6 && mine !== top) { score += 1; reasons.push(`Most of your rivals run ${MEDIUM[top]}; this is ${MEDIUM[mine] === 'videos' ? 'video' : MEDIUM[mine]}`); }
    if (d.format === 'series') reasons.push('Built as a series: it pays off after weeks, not days');
    return { ...d, score, reasons };
  }).sort((a, b) => b.score - a.score);
}

const fill = (s, v) => s.replace(/\{(\w+)\}/g, (_, k) => v[k] ?? '');
const first = (s, n = 70) => { const x = String(s || '').split(/[,.;:(]/)[0].trim(); return x.length > n ? `${x.slice(0, n).replace(/\s+\S*$/, '')}` : x; };

/** A brief for one donor move, from templates and the brand's facts. */
export function ruleBrief(donor, ws = {}, detail, conv) {
  const lcFirst = x => (x && !/^[A-Z]{2}/.test(x) ? x[0].toLowerCase() + x.slice(1) : x);
  const v = { brand: ws.brand_name || 'your brand', product: lcFirst(first(ws.brand_product)) || 'your product', audience: lcFirst(first(ws.audience)) || 'your buyers' };
  v.detail = fill(String(detail || '').trim() || donor.detail_default, v);
  const broken = (conv?.rules || []).filter(r => donor.breaks.includes(r.key)).map(r => r.text);
  return {
    donor: donor.id, title: `${donor.name}, for ${v.brand}`, world: donor.world, seen_in: donor.seen_in,
    take: donor.why, mechanism: donor.move, detail: v.detail,
    hooks: donor.hooks.map(h => fill(h, v)), beats: donor.beats.map(b => fill(b, v)), series: donor.series.map(s => fill(s, v)),
    format: donor.format === 'series' ? 'Short video series (3+ posts a week)' : donor.format === 'carousel' ? 'Carousel (5-7 slides)' : 'Vertical video (15-45 s)',
    breaks: broken.length ? broken : ['None of your rivals run this kind of move'],
    fit_check: [`Fits if: ${fill(donor.fits_if, v)}`, `Skip if: ${fill(donor.skip_if, v)}`, 'Ask before you make it: why does this work for them, and does your brand fit that answer?'],
    dont: donor.dont, by: 'rules',
  };
}

const BRIEF_SCHEMA = {
  type: 'object', additionalProperties: false,
  required: ['title', 'mechanism', 'take', 'hooks', 'beats', 'series', 'fit_check', 'dont'],
  properties: {
    title: { type: 'string', description: 'Name of this concept for the brand, under 10 words' },
    mechanism: { type: 'string', description: 'The move, in one sentence, translated to this brand' },
    take: { type: 'string', description: 'Why the move works (the mechanism) and why it fits THIS brand, 2 sentences' },
    hooks: { type: 'array', minItems: 3, maxItems: 3, items: { type: 'string' }, description: 'Opening lines, each under 12 words, in the brand voice' },
    beats: { type: 'array', minItems: 3, maxItems: 6, items: { type: 'string' }, description: 'Shot-by-shot or slide-by-slide beats' },
    series: { type: 'array', minItems: 3, maxItems: 3, items: { type: 'string' }, description: 'Three follow-up posts that reuse the same character, line or format (commit to the bit)' },
    fit_check: { type: 'array', minItems: 2, maxItems: 3, items: { type: 'string' }, description: 'Honest reasons this could fail for this brand, and how to tell' },
    dont: { type: 'string', description: 'What not to copy from the source world' },
  },
};

/** Brief with Claude when a key is set (falls back to the rule brief on any error). */
export async function writeBrief(donorId, ws = {}, { detail, conv } = {}) {
  const donor = donorById(donorId);
  if (!donor) throw new Error('Unknown move');
  const base = ruleBrief(donor, ws, detail, conv);
  if (!hasLLM()) return base;
  try {
    const out = await askJSON({
      system: `You are a creative director who steals from other industries, never from competitors. ${RULES}
Translate the borrowed move to this brand. Only use facts the brand gave. Keep the mechanism, not the source brand's look, words or characters.`,
      content: JSON.stringify({ brand: { name: ws.brand_name, product: ws.brand_product, offer: ws.brand_offer, voice: ws.brand_voice, audience: ws.audience, category: ws.category, stance: ws.stance },
        move: { name: donor.name, world: donor.world, example: donor.seen_in, what: donor.move, why: donor.why, fits_if: donor.fits_if, skip_if: donor.skip_if, dont: donor.dont },
        detail: base.detail, rival_habits_this_breaks: base.breaks }),
      schema: BRIEF_SCHEMA, effort: 'medium', maxTokens: 3000,
    });
    return { ...base, ...out, by: 'claude' };
  } catch (e) { return { ...base, note: `Written from templates (${e.message})` }; }
}
