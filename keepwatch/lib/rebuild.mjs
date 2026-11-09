// "Steal this ad": rebuild a rival's lasting ad for our brand.
// Concept: Claude when ANTHROPIC_API_KEY is set, otherwise a rule-based plan from the ad's angle.
// Image:  Gemini 3 Pro Image (GEMINI_API_KEY, or treg locally) with the rival ad as the layout reference.
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { getDb, DATA_DIR, rivalIdsFor } from './db.mjs';
import { getAd } from './analytics.mjs';
import { renderImage } from './providers.mjs';
import { hasLLM, writeConcept } from './llm.mjs';
import { angleLabel } from './classify.mjs';

export const REBUILD_DIR = resolve(DATA_DIR, 'rebuilds');

// Rule-based fallback: the structure each angle uses, written as a fill-in for our brand.
// No invented quotes, reviews or numbers: only the brand's own facts and offer.
const PLAYS = {
  social_proof: { why: ['Social proof', 'Real-life setting', 'Product in hand'], head: b => `The ${b.short} people keep restocking` },
  before_after: { why: ['Before and after', 'Clear contrast', 'Outcome first'], head: b => `Your 3pm, before and after ${b.name}` },
  discount: { why: ['Offer up front', 'Low risk', 'One clear button'], head: b => b.offer || `Try ${b.name} today` },
  expert: { why: ['Authority cue', 'Calm layout', 'Simple claim'], head: b => `${b.short[0].toUpperCase()}${b.short.slice(1)}, made simple` },
  comparison: { why: ['Us vs them', 'Pattern break', 'Outcome first'], head: b => `Not a powder. Not a pill. ${b.name}.` },
  problem: { why: ['Problem first', 'Relatable moment', 'Fix in frame'], head: b => `Fiber without the gritty glass` },
  science: { why: ['Specific numbers', 'Ingredient focus', 'Clean layout'], head: b => b.fact || `What's inside ${b.name}` },
  founder: { why: ['Founder voice', 'Story hook', 'Trust'], head: b => `Why we made ${b.name}` },
  routine: { why: ['Easy routine', 'In-the-moment scene', 'Low effort'], head: b => `Your 3pm, sorted` },
  taste: { why: ['Taste first', 'Craving cue', 'Bright colour'], head: b => `Tastes like a treat. Works like fiber.` },
  urgency: { why: ['Urgency', 'Offer up front', 'One clear button'], head: b => b.offer || `Back in stock` },
  curiosity: { why: ['Curiosity gap', 'Question hook', 'Pattern break'], head: b => `What if fiber came in a can?` },
  other: { why: ['Clear product', 'Simple layout', 'One message'], head: b => `Meet ${b.name}` },
};

export function rulePlan(ad, ws) {
  const short = (ws.brand_product || ws.brand_name).split(/[,.]/)[0].toLowerCase();
  const fact = (ws.brand_product || '').match(/\d+\s?g [a-z]+(?: per [a-z]+)?/i)?.[0];
  const b = { name: ws.brand_name, short, offer: ws.brand_offer, fact: fact ? `${fact[0].toUpperCase()}${fact.slice(1)}. Zero grit.` : null };
  const play = PLAYS[ad.angle] || PLAYS.other;
  const headline = play.head(b);
  const cta = /shop|buy|order/i.test(ad.cta || '') ? 'Shop now' : (ad.cta || 'Shop now');
  return {
    why_it_works: play.why,
    keep_scene: `Same scene and camera framing as the reference ${ad.format_label.toLowerCase()} ad`,
    keep_layout: 'Same layout, headline position and button placement as the reference',
    headline, subline: ws.brand_offer || '', cta,
    image_prompt: imagePrompt({ headline, cta, ws }),
    source: 'rules',
  };
}

function imagePrompt({ headline, cta, ws }) {
  return [
    'Recreate this advertisement for a different brand. Keep the reference image\'s composition, camera angle, lighting, photographic style and the position of the headline and button.',
    `Replace the product and packaging with: ${ws.brand_product}. The brand name on the product is "${ws.brand_name}".`,
    `Render exactly this headline: "${headline}". Render exactly this button text: "${cta}". No other words.`,
    `Use ${ws.brand_color} as the accent colour for the button and highlights.`,
    'Remove every logo, brand name, watermark and claim from the reference brand. No realistic celebrity faces. Keep it looking like a native social ad, not a stock photo.',
  ].join('\n');
}

/** Plan + render one rebuild for a workspace. Returns the rebuild row. */
export async function rebuildAd(ws, adId, { render = true, dropWeek = null } = {}) {
  const db = getDb();
  const ad = getAd(db, adId);
  if (!ad || !rivalIdsFor(ws.id, db).includes(ad.rival_id)) throw new Error('Ad not found');
  if (!ws?.brand_name) throw new Error('Set up your brand first (Settings).');

  let plan;
  if (hasLLM()) {
    try { plan = { ...(await writeConcept(ad, ws)), source: 'claude' }; }
    catch (e) { plan = { ...rulePlan(ad, ws), note: `Claude step failed, used rules: ${e.message}` }; }
  } else plan = rulePlan(ad, ws);

  const id = Number(db.prepare('INSERT INTO rebuilds (workspace_id, ad_id, headline, why, prompt, status, drop_week) VALUES (?,?,?,?,?,?,?)')
    .run(ws.id, ad.id, plan.headline, JSON.stringify(plan), plan.image_prompt, render ? 'rendering' : 'planned', dropWeek).lastInsertRowid);

  if (render) {
    const ref = ad.image_url || ad.thumb_url;
    try {
      const { bytes, cost } = await renderImage(plan.image_prompt, ref);
      mkdirSync(REBUILD_DIR, { recursive: true });
      const file = `rebuild-${id}-${Date.now().toString(36)}.png`;
      writeFileSync(resolve(REBUILD_DIR, file), bytes);
      db.prepare("UPDATE rebuilds SET image_path = ?, status = 'done', cost_usd = ? WHERE id = ?").run(file, cost, id);
    } catch (e) {
      db.prepare("UPDATE rebuilds SET status = ? WHERE id = ?").run(`failed: ${e.message}`.slice(0, 300), id);
    }
  }
  return getRebuild(id);
}

export function getRebuild(id, db = getDb(), wsId) {
  const r = db.prepare('SELECT * FROM rebuilds WHERE id = ? AND (? IS NULL OR workspace_id = ?)').get(id, wsId ?? null, wsId ?? null);
  if (!r) return null;
  return { ...r, plan: JSON.parse(r.why || '{}'), image: r.image_path ? `/media/rebuilds/${r.image_path}` : null, ad: getAd(db, r.ad_id) };
}

export function listRebuilds(db = getDb(), { wsId, dropWeek } = {}) {
  const rows = db.prepare(`SELECT id FROM rebuilds WHERE workspace_id = ? ${dropWeek ? 'AND drop_week = ?' : ''} ORDER BY id DESC LIMIT 60`).all(wsId, ...(dropWeek ? [dropWeek] : []));
  return rows.map(r => getRebuild(r.id, db));
}

/** Monday of the week containing date d (YYYY-MM-DD). */
export function mondayOf(d = new Date()) {
  const x = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  x.setUTCDate(x.getUTCDate() - ((x.getUTCDay() + 6) % 7));
  return x.toISOString().slice(0, 10);
}

/** Monday drop: rebuild the top kept ads (one per rival, different angles) we have not rebuilt yet. */
export async function mondayDrop(ws, { count = 4, render = true } = {}) {
  const db = getDb();
  const week = mondayOf();
  const done = new Set(db.prepare('SELECT ad_id FROM rebuilds WHERE workspace_id = ?').all(ws.id).map(r => r.ad_id));
  const { listAds } = await import('./analytics.mjs');
  const candidates = listAds(db, { rivalIds: rivalIdsFor(ws.id, db), pile: 'kept', limit: 500 }).filter(a => !done.has(a.id) && (a.image_url || a.thumb_url));
  const picked = [], rivals = new Set(), angles = new Set();
  for (const a of candidates) {
    if (picked.length >= count) break;
    if (rivals.has(a.rival_id) || angles.has(a.angle)) continue;
    picked.push(a); rivals.add(a.rival_id); angles.add(a.angle);
  }
  for (const a of candidates) { if (picked.length >= count) break; if (!picked.includes(a)) picked.push(a); }
  const out = [];
  for (const a of picked) out.push(await rebuildAd(ws, a.id, { render, dropWeek: week }));
  return { week, rebuilds: out, angles: [...angles].map(angleLabel) };
}
