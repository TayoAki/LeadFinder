// "Steal this ad": rebuild a rival's lasting ad for our brand.
// Concept: Claude when ANTHROPIC_API_KEY is set, otherwise a rule-based plan from the ad's angle.
// Image:  Gemini 3 Pro Image through treg, with the rival ad as the layout reference (~$0.03 per image).
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { getDb, getWorkspace, DATA_DIR } from './db.mjs';
import { getAd } from './analytics.mjs';
import { treg, tregAvailable, costOf } from './treg.mjs';
import { hasLLM, writeConcept } from './llm.mjs';
import { angleLabel } from './classify.mjs';

export const REBUILD_DIR = resolve(DATA_DIR, 'rebuilds');
const IMAGE_ENDPOINT = 'reapi.image-gen.gemini-3-pro-image';

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

/** Plan + render one rebuild. Returns the rebuild row. */
export async function rebuildAd(adId, { render = true, dropWeek = null } = {}) {
  const db = getDb();
  const ad = getAd(db, adId);
  if (!ad) throw new Error('Ad not found');
  const ws = getWorkspace(db);
  if (!ws?.brand_name) throw new Error('Set up your brand first (Settings).');

  let plan;
  if (hasLLM()) {
    try { plan = { ...(await writeConcept(ad, ws)), source: 'claude' }; }
    catch (e) { plan = { ...rulePlan(ad, ws), note: `Claude step failed, used rules: ${e.message}` }; }
  } else plan = rulePlan(ad, ws);

  const id = Number(db.prepare('INSERT INTO rebuilds (ad_id, headline, why, prompt, status, drop_week) VALUES (?,?,?,?,?,?)')
    .run(ad.id, plan.headline, JSON.stringify(plan), plan.image_prompt, render ? 'rendering' : 'planned', dropWeek).lastInsertRowid);

  if (render) {
    const ref = ad.image_url || ad.thumb_url;
    try {
      if (!(await tregAvailable())) throw new Error('treg is not installed here, so images cannot be rendered.');
      const { result, meta } = await treg(IMAGE_ENDPOINT, {
        body: { model: 'gemini-3-pro-image-preview', prompt: plan.image_prompt, size: '4:5', resolution: '1K', ...(ref ? { image_urls: [ref] } : {}) },
        wait: 600,
      });
      const url = result?.output?.image_urls?.[0];
      if (!url) throw new Error(`no image returned (${String(JSON.stringify(result)).slice(0, 200)})`);
      const bytes = Buffer.from(await (await fetch(url)).arrayBuffer());
      mkdirSync(REBUILD_DIR, { recursive: true });
      const file = `rebuild-${id}.png`;
      writeFileSync(resolve(REBUILD_DIR, file), bytes);
      db.prepare("UPDATE rebuilds SET image_path = ?, status = 'done', cost_usd = ? WHERE id = ?").run(file, costOf(meta) || 0.03, id);
    } catch (e) {
      db.prepare("UPDATE rebuilds SET status = ? WHERE id = ?").run(`failed: ${e.message}`.slice(0, 300), id);
    }
  }
  return getRebuild(id);
}

export function getRebuild(id, db = getDb()) {
  const r = db.prepare('SELECT * FROM rebuilds WHERE id = ?').get(id);
  if (!r) return null;
  return { ...r, plan: JSON.parse(r.why || '{}'), image: r.image_path ? `/media/rebuilds/${r.image_path}` : null, ad: getAd(db, r.ad_id) };
}

export function listRebuilds(db = getDb(), { dropWeek } = {}) {
  const rows = db.prepare(`SELECT id FROM rebuilds ${dropWeek ? 'WHERE drop_week = ?' : ''} ORDER BY id DESC LIMIT 40`).all(...(dropWeek ? [dropWeek] : []));
  return rows.map(r => getRebuild(r.id, db));
}

/** Monday of the week containing date d (YYYY-MM-DD). */
export function mondayOf(d = new Date()) {
  const x = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  x.setUTCDate(x.getUTCDate() - ((x.getUTCDay() + 6) % 7));
  return x.toISOString().slice(0, 10);
}

/** Monday drop: rebuild the top kept ads (one per rival, different angles) we have not rebuilt yet. */
export async function mondayDrop({ count = 4, render = true } = {}) {
  const db = getDb();
  const week = mondayOf();
  const done = new Set(db.prepare('SELECT ad_id FROM rebuilds').all().map(r => r.ad_id));
  const { listAds } = await import('./analytics.mjs');
  const candidates = listAds(db, { pile: 'kept', limit: 500 }).filter(a => !done.has(a.id) && (a.image_url || a.thumb_url));
  const picked = [], rivals = new Set(), angles = new Set();
  for (const a of candidates) {
    if (picked.length >= count) break;
    if (rivals.has(a.rival_id) || angles.has(a.angle)) continue;
    picked.push(a); rivals.add(a.rival_id); angles.add(a.angle);
  }
  for (const a of candidates) { if (picked.length >= count) break; if (!picked.includes(a)) picked.push(a); }
  const out = [];
  for (const a of picked) out.push(await rebuildAd(a.id, { render, dropWeek: week }));
  return { week, rebuilds: out, angles: [...angles].map(angleLabel) };
}
