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
  // Meta's button (drawn by Meta under the ad, never on the image). Apps download; everything else shops.
  const isApp = /apps\.apple|play\.google|\bapp\b/i.test(`${ws.brand_domain || ''} ${ws.brand_product || ''}`);
  const cta = isApp ? 'Download' : ({ 'learn more': 'Learn more', 'get offer': 'Get offer', 'sign up': 'Sign up', 'order now': 'Order now' }[(ad.cta || '').toLowerCase()] || 'Shop now');
  return {
    why_it_works: play.why,
    // Without a model to read the image we can't swap each text line, but we still move the scene and change the person.
    setting: 'a clearly different place of the same kind as the reference (a different kitchen if it is a kitchen, a different outdoor spot if it is outdoors, a different page or surface if it is a graphic), seen from the same angle with the same composition',
    keep_scene: `Same composition and camera framing as the reference ${ad.format_label.toLowerCase()} ad, in a new location`,
    keep_layout: 'Same layout and text placement as the reference',
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
export function imagePrompt({ headline, cta, ws, hasProduct, productName, texts, productMode = 'replace', button = false, setting, badge }) {
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
    `The words: the reference has ${lines.length === 1 ? 'a text element' : 'text elements'}. Replace ${lines.length === 1 ? 'it' : 'them, in reading order, one for one'} with exactly: ${lines.map((t, n) => `(${n + 1}) "${t}"`).join(' ')}. Same styling as the text being replaced.${badge ? '' : ' No other words anywhere.'}`,
    ...(badge ? [`Add one small, unobtrusive label near the bottom edge, styled like a native social sticker: "${badge}". It is the only text you may add beyond the replacements above.`] : []),
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
  let product = concept?.product_mode === 'none' ? null : (productImage || ws.product_image || null);

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
  // Structure comes from a hand-written concept first, then from the generated plan (Claude or rules).
  const spec = { ...plan, ...(concept || {}) };
  plan.texts = Array.isArray(spec.texts) && spec.texts.length ? spec.texts.slice(0, 12).map(t => String(t).slice(0, 200)) : null;
  plan.product_mode = ['replace', 'in_hand', 'none'].includes(spec.product_mode) ? spec.product_mode : (product ? 'replace' : 'none');
  if (plan.product_mode === 'none') product = null;
  plan.setting = typeof spec.setting === 'string' && spec.setting.trim() ? spec.setting.trim().slice(0, 300) : null;
  plan.image_prompt = imagePrompt({ headline: plan.headline, cta: plan.cta, ws, hasProduct: Boolean(product), productName,
    texts: plan.texts, productMode: plan.product_mode, button: spec.button === true, setting: plan.setting || undefined,
    badge: typeof spec.badge === 'string' && spec.badge.trim() ? spec.badge.trim().slice(0, 60) : undefined });
  plan.badge = typeof spec.badge === 'string' ? spec.badge.trim().slice(0, 60) || null : null;
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
  const rows = db.prepare(`SELECT id FROM rebuilds WHERE workspace_id = ? AND COALESCE(status, '') != 'replaced' ${dropWeek ? 'AND drop_week = ?' : ''} ORDER BY id DESC LIMIT 100`).all(wsId, ...(dropWeek ? [dropWeek] : []));
  return rows.map(r => getRebuild(r.id, db));
}

/** Monday of the week containing date d (YYYY-MM-DD). */
export function mondayOf(d = new Date()) {
  const x = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  x.setUTCDate(x.getUTCDate() - ((x.getUTCDay() + 6) % 7));
  return x.toISOString().slice(0, 10);
}

// ---------- picking ads for the Monday drop ----------
const EN_WORDS = new Set('the and you your to a of is it for my i on with this that in are be not have so what how can just get was me we our'.split(' '));
/** Rough language check on the ad's own words. Returns true/false, or null when there's too little text to tell. */
export function looksEnglish(text) {
  const t = String(text || '').toLowerCase();
  const words = t.match(/[a-zà-ÿ']+/g) || [];
  if (words.length < 4) return null;
  const accents = (t.match(/[àáâãäåçèéêëìíîïñòóôõöùúûüß¿¡]/g) || []).length;
  const hits = words.filter(w => EN_WORDS.has(w)).length;
  return hits / words.length >= 0.12 && accents <= 2;
}

/** How much a kept ad has proven: long runs, still live, many variants. For ordering only. */
export const dropScore = a => 0.7 * a.run_days + 3 * (a.collation_count || 1) + (a.is_active ? 15 : 0);

/**
 * Pick `count` ads for a drop: kept ads only, not already rebuilt, with an image, in the brand's language,
 * best proven first, spread across rivals and angles (relaxing angle, then rival, if there aren't enough).
 */
export function pickForDrop(ads, { count = 4, done = new Set(), lang = 'en' } = {}) {
  const textOf = a => [a.hook, a.title, a.body, a.transcript].filter(Boolean).join(' ');
  const pool = ads.filter(a => a.pile === 'kept' && !done.has(a.id) && (a.image_url || a.thumb_url))
    .map(a => ({ a, en: lang === 'en' ? looksEnglish(textOf(a)) : true }))
    .filter(x => x.en !== false)
    .sort((x, y) => (y.en === true) - (x.en === true) || dropScore(y.a) - dropScore(x.a))
    .map(x => x.a);
  const picked = [];
  for (const [byRival, byAngle] of [[true, true], [true, false], [false, false]]) {
    for (const a of pool) {
      if (picked.length >= count) break;
      if (picked.includes(a)) continue;
      if (byRival && picked.some(p => p.rival_id === a.rival_id)) continue;
      if (byAngle && picked.some(p => p.angle === a.angle)) continue;
      picked.push(a);
    }
  }
  return { picked, pool };
}

async function imageLoads(url) {
  try {
    const res = await fetch(url, { headers: { range: 'bytes=0-2047' }, signal: AbortSignal.timeout(15000) });
    return res.ok && /^image\//.test(res.headers.get('content-type') || '');
  } catch { return false; }
}

/** Monday drop: rebuild the best-proven kept ads, in the brand's language, with working images, across rivals and angles. */
export async function mondayDrop(ws, { count = 4, render = true, onEach, lang = 'en', week = mondayOf() } = {}) {
  const db = getDb();
  const done = new Set(db.prepare('SELECT ad_id FROM rebuilds WHERE workspace_id = ?').all(ws.id).map(r => r.ad_id));
  const { listAds } = await import('./analytics.mjs');
  const ads = listAds(db, { rivalIds: rivalIdsFor(ws.id, db), pile: 'kept', limit: 2000 });
  const broken = new Set();
  let picked = [];
  for (let round = 0; round < 4; round++) {
    ({ picked } = pickForDrop(ads, { count, done: new Set([...done, ...broken]), lang }));
    const checks = await Promise.all(picked.map(a => imageLoads(a.image_url || a.thumb_url)));
    picked.forEach((a, i) => { if (!checks[i]) broken.add(a.id); });
    if (checks.every(Boolean)) break;
    picked = picked.filter((a, i) => checks[i]);
  }
  const out = [];
  for (const a of picked) { if (onEach) onEach(a); out.push(await rebuildAd(ws, a.id, { render, dropWeek: week })); }
  return { week, rebuilds: out, angles: [...new Set(picked.map(a => a.angle))].map(angleLabel), skipped_broken_images: broken.size };
}
