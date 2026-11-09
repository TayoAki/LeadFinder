// Turning raw Ad Library rows into things a strategist reads: format, hook, angle.
// Rule-based so it runs anywhere with no model key; every rule is a plain regex you can tune.

const TEMPLATE = /\{\{[^}]+\}\}/;            // DCO/catalog placeholders like {{product.name}}
const clean = s => (s || '').replace(/\s+/g, ' ').trim();

/** Normalise one ScrapeCreators / Meta Ad Library result into our ad row. */
export function normaliseAd(r) {
  const s = r.snapshot || {};
  const cards = Array.isArray(s.cards) ? s.cards : [];
  const videos = Array.isArray(s.videos) ? s.videos : [];
  const images = Array.isArray(s.images) ? s.images : [];
  const firstCard = cards.find(c => c && (c.body || c.title)) || cards[0] || {};
  const bodyText = typeof s.body === 'object' ? s.body?.text : s.body;
  const body = [bodyText, firstCard.body].map(clean).find(t => t && !TEMPLATE.test(t)) || '';
  const title = [s.title, firstCard.title].map(clean).find(t => t && !TEMPLATE.test(t)) || '';
  const link_desc = [s.link_description, firstCard.link_description].map(clean).find(t => t && !TEMPLATE.test(t)) || '';

  const hasVideo = videos.length > 0 || cards.some(c => c?.video_hd_url || c?.video_sd_url);
  const df = (s.display_format || '').toUpperCase();
  let format = 'static';
  if (hasVideo) format = 'video';
  else if (df === 'CAROUSEL' || (cards.length > 1 && df !== 'DCO')) format = 'carousel';

  const vid = videos[0] || cards.find(c => c?.video_hd_url || c?.video_sd_url) || {};
  const img = images[0] || cards.find(c => c?.original_image_url || c?.resized_image_url) || {};
  const iso = v => (v ? new Date(typeof v === 'number' ? v * 1000 : v).toISOString().slice(0, 10) : null);

  return {
    id: String(r.ad_archive_id),
    collation_id: r.collation_id ? String(r.collation_id) : null,
    collation_count: r.collation_count ?? null,
    is_active: r.is_active ? 1 : 0,
    start_date: iso(r.start_date_string || r.start_date),
    end_date: iso(r.end_date_string || r.end_date),
    format,
    display_format: df || null,
    body, title, link_desc,
    cta: clean(s.cta_text || firstCard.cta_text) || null,
    link_url: s.link_url || firstCard.link_url || null,
    image_url: img.original_image_url || img.resized_image_url || null,
    video_url: vid.video_sd_url || vid.video_hd_url || null,
    thumb_url: vid.video_preview_image_url || img.resized_image_url || img.original_image_url || null,
  };
}

/** The opening line: first sentence of the spoken transcript if we have one, else the copy, else the headline. */
export function extractHook({ transcript, body, title }) {
  const pick = (text, source) => {
    const t = clean(text);
    if (!t || TEMPLATE.test(t)) return null;
    // Join sentences until the opening line carries a full thought (spoken openers like "I tell you what." are too thin).
    const parts = t.split(/(?<=[.!?])\s+|\n/).map(x => x.trim()).filter(Boolean);
    let first = '';
    for (const p of parts) { first = first ? `${first} ${p}` : p; if (first.length >= 30) break; }
    first = first.replace(/^[^\p{L}\p{N}"“']+/u, '').trim();
    if (first.length < 8) return null;
    return { hook: first.length > 140 ? first.slice(0, 137).trimEnd() + '…' : first, source };
  };
  return pick(transcript, 'spoken') || pick(body, 'copy') || pick(title, 'headline') || { hook: null, source: null };
}

// Angle taxonomy. Order matters: the first match wins, so specific angles sit above broad ones.
export const ANGLES = [
  { key: 'before_after', label: 'Before and after', rx: /before (and|&) after|transform|results after|day \d+ vs|week \d+|(lost|down|dropped) \d+\s?(lbs?|pounds|kg|kilos)|\d+\s?(lbs?|pounds|kg) (down|lost|gone)/i },
  { key: 'demo', label: 'Product demo', rx: /\bsnap\b|take a (photo|picture|pic)|just (point|scan)|scan (any|the|a|your)|watch (it|this|how)|how (it|this) works|in action|(one|single) (photo|tap|click)/i },
  { key: 'discount', label: 'Discount offer', rx: /\d+% off|save \$?\d|\bsale\b|\bdeal\b|free (gift|shipping|t-?shirt|shaker|bottle)|promo|\bcode\b|bogo|limited[- ]time/i },
  { key: 'expert', label: 'Expert endorsement', rx: /\b(doctor|dr\.|dietitian|nutritionist|scientist|physician|expert|gastroenterologist|pharmacist)s?\b|recommend/i },
  { key: 'comparison', label: 'Us vs them', rx: /\bvs\.?\b|versus|unlike|instead of|not (a|your) |compared|swap|replace your|better than|just (change|switch|swap)|switch(ed)? to/i },
  { key: 'problem', label: 'Problem first', rx: /tired of|struggl|bloat|crash|sluggish|can't|cannot|stop (feeling|wasting)|hate|sick of|problem|why (you|your)/i },
  { key: 'social_proof', label: 'Social proof', rx: /reviews?|★|⭐|\b\d[\d,.]*\s*(k\+?|m\+?)?\s*(customers|people|fans|sold|bottles|cans)|best[- ]?sell|award|loved by|testimonial|"[^"]{10,}"|“[^”]{10,}”/i },
  { key: 'science', label: 'Ingredients and science', rx: /\d+\s?g\b|grams|vitamins?|minerals|clinical|stud(y|ies)|science|formula|prebiotic|probiotic|fiber|fibre|protein|electrolyte|caffeine|nutrients/i },
  { key: 'founder', label: 'Founder story', rx: /\b(i|we) (started|founded|created|built)|founder|our story/i },
  { key: 'routine', label: 'Easy routine', rx: /\bseconds\b|on the go|morning|routine|easy|simple|ready (in|whenever)|convenien|just add/i },
  { key: 'taste', label: 'Taste first', rx: /tastes?|delicious|flavou?r|yum|refreshing|craving|soda|treat/i },
  { key: 'urgency', label: 'Urgency', rx: /last chance|ends (today|tonight|soon)|only \d+ left|selling out|while supplies/i },
  { key: 'curiosity', label: 'Curiosity question', rx: /\?/ },
];

export function classifyAngle(text) {
  const t = clean(text);
  if (!t) return 'other';
  for (const a of ANGLES) if (a.rx.test(t)) return a.key;
  return 'other';
}

/** Tag from the opening line first; the body only breaks a tie when the hook says nothing specific. */
export function angleFor(hook, body, title) {
  const h = classifyAngle(hook);
  return h !== 'other' && h !== 'curiosity' ? h : (classifyAngle([title, body].join(' ')) !== 'other' ? classifyAngle([title, body].join(' ')) : h);
}

export const angleLabel = key => ANGLES.find(a => a.key === key)?.label || 'Other';
export const FORMAT_LABEL = { static: 'Static image', video: 'Video', carousel: 'Carousel' };
