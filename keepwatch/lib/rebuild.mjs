// "Steal this ad": rebuild a rival's lasting ad for our brand.
// Concept: Claude when ANTHROPIC_API_KEY is set, otherwise a rule-based plan from the ad's angle.
// Image:  GPT Image 2 (Fal) or Gemini, with the rival ad as the layout reference and your real product photo.
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { getDb, DATA_DIR, rivalIdsFor } from './db.mjs';
import { getAd } from './analytics.mjs';
import { renderImage } from './providers.mjs';
import { hasLLM, writeConcept } from './llm.mjs';
import { angleLabel } from './classify.mjs';

export const REBUILD_DIR = resolve(DATA_DIR, 'rebuilds');

// Rule-based fallback: the structure each angle uses, filled with the brand's own facts.
// No invented quotes, reviews, prices or numbers: only what the brand gave us (product line, offer, site taglines).
const PLAYS = {
  social_proof: { why: ['Social proof', 'Real-life setting', 'Product in hand'], head: b => `Why people keep reordering ${b.name}` },
  before_after: { why: ['Before and after', 'Clear contrast', 'Outcome first'], head: b => `Your day, with ${b.name}` },
  discount: { why: ['Offer up front', 'Low risk', 'One clear button'], head: b => b.offer || `Try ${b.name} today` },
  expert: { why: ['Authority cue', 'Calm layout', 'Simple claim'], head: b => `${b.Short}, done properly` },
  comparison: { why: ['Us vs them', 'Pattern break', 'Outcome first'], head: b => `Swap it for ${b.name}` },
  problem: { why: ['Problem first', 'Relatable moment', 'Fix in frame'], head: b => b.tagline || `There's an easier way` },
  science: { why: ['Specific numbers', 'Ingredient focus', 'Clean layout'], head: b => b.fact || `What's inside ${b.name}` },
  founder: { why: ['Founder voice', 'Story hook', 'Trust'], head: b => `Why we made ${b.name}` },
  routine: { why: ['Easy routine', 'In-the-moment scene', 'Low effort'], head: b => `Make it part of your day` },
  taste: { why: ['Taste first', 'Craving cue', 'Bright colour'], head: b => `You'll actually look forward to it` },
  urgency: { why: ['Urgency', 'Offer up front', 'One clear button'], head: b => b.offer || `Back in stock` },
  curiosity: { why: ['Curiosity gap', 'Question hook', 'Pattern break'], head: b => `Have you tried ${b.name} yet?` },
  other: { why: ['Clear product', 'Simple layout', 'One message'], head: b => b.tagline || `Meet ${b.name}` },
};

const kitOf = ws => { try { return JSON.parse(ws.brand_kit || 'null') || {}; } catch { return {}; } };
const sentence = s => (s ? s.trim().replace(/[.!\s]+$/, '') + '.' : '');

export function rulePlan(ad, ws, { productName } = {}) {
  const kit = kitOf(ws);
  const short = (productName || ws.brand_product || ws.brand_name).split(/[,.]/)[0].trim();
  const fact = (ws.brand_product || '').match(/\b\d+\s?(?:g|mg|%|oz|ml)\b[^,.]*/i)?.[0];
  const tagline = (kit.taglines || []).find(t => t.length <= 48) || null;
  const b = { name: ws.brand_name, Short: short[0].toUpperCase() + short.slice(1), offer: ws.brand_offer, tagline, fact: fact ? fact[0].toUpperCase() + fact.slice(1) : null };
  const play = PLAYS[ad.angle] || PLAYS.other;
  const headline = play.head(b).slice(0, 60);
  // Standard Meta CTAs only; anything else (e.g. a rival's "Subscribe") becomes "Shop now".
  const cta = { 'learn more': 'Learn more', 'get offer': 'Get offer', 'sign up': 'Sign up', 'order now': 'Order now' }[(ad.cta || '').toLowerCase()] || 'Shop now';
  return {
    why_it_works: play.why,
    keep_scene: `Same scene and camera framing as the reference ${ad.format_label.toLowerCase()} ad`,
    keep_layout: 'Same layout, headline position and button placement as the reference',
    headline, subline: ws.brand_offer || '', cta,
    primary_text: [sentence(ws.brand_product ? `${ws.brand_name}: ${ws.brand_product}` : ''), sentence(ws.brand_offer)].filter(Boolean).join(' '),
    meta_headline: (ws.brand_offer || headline).slice(0, 40),
    source: 'rules',
  };
}

/** The image instruction. With a product photo, image 2 is the real product and must appear unchanged. */
/**
 * The image instruction: a faithful recreation of the reference with only three things changed:
 * the words, the product (only where the reference shows one), and any person (always a different person).
 *   texts       on-image lines, replacing the reference's text elements one for one, in reading order
 *   productMode 'replace' (swap the reference's product for ours) · 'in_hand' (a person holds our phone/product
 *               instead of what they hold) · 'none' (no product added: recreate the scene as is)
 *   button      draw a button only if true; Meta adds its own CTA button under the ad
 */
export function imagePrompt({ headline, cta, ws, hasProduct, productName, texts, productMode = 'replace', button = false, setting }) {
  const lines = (texts && texts.length ? texts : [headline]).map(t => String(t).trim()).filter(Boolean);
  const product = !hasProduct || productMode === 'none'
    ? 'Do not add any product, phone, app screen or packaging that is not in the reference. If the reference shows a rival product or branded item, replace it with a plain unbranded equivalent.'
    : productMode === 'in_hand'
      ? `Image 2 is our real product${productName ? ` (${productName})` : ''}. Where the reference person or character holds an object, have them hold this exact product instead, matching the reference's art style. If it is an app screenshot, show it on a phone screen, unchanged and legible.`
      : `Image 2 is our real product${productName ? ` (${productName})` : ''}. Replace each product in the reference with this exact product, in the same positions and size. Keep its packaging, label, shape and colours unchanged. If it is an app screenshot, show it on a phone screen, unchanged and legible. None of the reference's products may remain.`;
  return [
    setting
      ? `Image 1 is a reference advertisement. Recreate its layout in a new location: ${setting}. Keep exactly: the composition and camera framing, the camera height and angle, the art style (photo, illustration or hand-drawn), where the subject sits in the frame and their pose, the mood of the lighting, and every text element's position, size, box shape, font style and colour. The new location must look clearly different from the reference's location.`
      : 'Image 1 is a reference advertisement. Recreate it as faithfully as possible. Keep exactly: the layout and framing, the art style (photo, illustration or hand-drawn), the setting and background, the lighting and colour palette, any subject\'s pose and position, and every text element\'s position, size, box shape, font style and colour.',
    `Change only ${setting ? 'four things: the location, ' : 'three things: '}the words, the product, and any person.`,
    `The words: the reference has ${lines.length === 1 ? 'a text element' : 'text elements'}. Replace ${lines.length === 1 ? 'it' : 'them, in reading order, one for one'} with exactly: ${lines.map((t, n) => `(${n + 1}) "${t}"`).join(' ')}. Same styling as the text being replaced. No other words anywhere.`,
    product,
    button ? `Include a button with exactly the text "${cta}" where the reference has its button, styled like the reference's button.` : 'Do not add any button, call-to-action, logo, watermark or website. If the reference has none, the recreation has none.',
    'If the reference shows a person or character, show a clearly different one (different face, hair, build and clothing) in the same pose; never reproduce the reference person\'s likeness. No celebrity faces.',
    'Remove every brand name, logo and claim belonging to the reference brand.',
  ].join('\n');
}

/**
 * Plan + render one finished ad for a workspace: image (sized for feed, story or square) plus Meta ad copy.
 * productImage: one of the brand kit's product photos; when set, the real product is used as image 2.
 */
export async function rebuildAd(ws, adId, { render = true, dropWeek = null, size = 'feed', productImage, productName, concept } = {}) {
  const db = getDb();
  const ad = getAd(db, adId);
  if (!ad || !rivalIdsFor(ws.id, db).includes(ad.rival_id)) throw new Error('Ad not found');
  if (!ws?.brand_name) throw new Error('Set up your brand first (Settings).');
  const product = concept?.product_mode === 'none' ? null : (productImage || ws.product_image || null);

  let plan;
  if (hasLLM()) {
    try { plan = { ...(await writeConcept(ad, ws, { productImage: product, productName })), source: 'claude' }; }
    catch (e) { plan = { ...rulePlan(ad, ws, { productName }), note: `Claude step failed, used rules: ${e.message}` }; }
  } else plan = rulePlan(ad, ws, { productName });
  // A hand-written concept (from the user, or an agent) overrides the generated words; structure rules still apply.
  if (concept) {
    for (const k of ['headline', 'cta', 'primary_text', 'meta_headline', 'subline']) if (typeof concept[k] === 'string' && concept[k].trim()) plan[k] = concept[k].trim().slice(0, 300);
    if (Array.isArray(concept.why_it_works)) plan.why_it_works = concept.why_it_works.slice(0, 4).map(x => String(x).slice(0, 40));
    plan.source = 'custom';
  }
  plan.texts = Array.isArray(concept?.texts) ? concept.texts.slice(0, 12).map(t => String(t).slice(0, 200)) : null;
  plan.product_mode = ['replace', 'in_hand', 'none'].includes(concept?.product_mode) ? concept.product_mode : 'replace';
  plan.image_prompt = imagePrompt({ headline: plan.headline, cta: plan.cta, ws, hasProduct: Boolean(product), productName,
    texts: plan.texts, productMode: plan.product_mode, button: concept?.button === true,
    setting: typeof concept?.setting === 'string' && concept.setting.trim() ? concept.setting.trim().slice(0, 300) : undefined });
  plan.setting = concept?.setting || null;
  if (concept?.image_note) plan.image_prompt += `\n${String(concept.image_note).slice(0, 600)}`;
  plan.product_image = product;
  plan.size = size;

  const id = Number(db.prepare('INSERT INTO rebuilds (workspace_id, ad_id, headline, why, prompt, status, drop_week, size) VALUES (?,?,?,?,?,?,?,?)')
    .run(ws.id, ad.id, plan.headline, JSON.stringify(plan), plan.image_prompt, render ? 'rendering' : 'planned', dropWeek, size).lastInsertRowid);

  if (render) {
    const refs = [ad.image_url || ad.thumb_url, product].filter(Boolean);
    try {
      const { bytes, cost, engine } = await renderImage(plan.image_prompt, refs, { size });
      mkdirSync(REBUILD_DIR, { recursive: true });
      const file = `rebuild-${id}-${Date.now().toString(36)}.png`;
      writeFileSync(resolve(REBUILD_DIR, file), bytes);
      plan.engine = engine;
      db.prepare("UPDATE rebuilds SET image_path = ?, status = 'done', cost_usd = ?, why = ? WHERE id = ?").run(file, cost, JSON.stringify(plan), id);
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
export async function mondayDrop(ws, { count = 4, render = true, onEach } = {}) {
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
  for (const a of picked) { if (onEach) onEach(a); out.push(await rebuildAd(ws, a.id, { render, dropWeek: week })); }
  return { week, rebuilds: out, angles: [...angles].map(angleLabel) };
}
