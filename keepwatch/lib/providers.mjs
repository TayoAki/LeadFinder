// External data and generation providers. Each uses its own API key when set (production on Railway),
// otherwise falls back to the treg CLI (which injects keys server-side) when it is installed.
//   SCRAPECREATORS_API_KEY  Meta Ad Library: company search, company ads, video transcripts
//   FAL_KEY                 ad images with GPT Image 2 (preferred: best at keeping a real product photo exact)
//   GEMINI_API_KEY          ad images with Gemini 3 Pro Image (GEMINI_IMAGE_MODEL to override)
//   ANTHROPIC_API_KEY       Claude concepts + buyer panel (see llm.mjs)
import { treg, tregAvailable, costOf } from './treg.mjs';

const SC_BASE = 'https://api.scrapecreators.com';
const SC_PATHS = {
  'search-companies': '/v1/facebook/adLibrary/search/companies',
  'company-ads': '/v1/facebook/adLibrary/company/ads',
  'ad-transcript': '/v1/facebook/adLibrary/ad/transcript',
};
const SC_TREG = 'scrapecreators.x.v1-facebook-adlibrary-';

export async function providerStatus() {
  const t = await tregAvailable();
  return {
    adData: Boolean(process.env.SCRAPECREATORS_API_KEY) || t,
    images: Boolean(process.env.FAL_KEY || process.env.GEMINI_API_KEY) || t,
    llm: Boolean(process.env.ANTHROPIC_API_KEY),
    via: { adData: process.env.SCRAPECREATORS_API_KEY ? 'scrapecreators' : t ? 'treg' : null, images: process.env.FAL_KEY ? 'fal' : process.env.GEMINI_API_KEY ? 'gemini' : t ? 'treg' : null },
  };
}

/** Meta Ad Library call. Returns { result, cost }. Throws with the provider's message on failure. */
export async function adLibrary(kind, query) {
  const key = process.env.SCRAPECREATORS_API_KEY;
  if (key) {
    const url = new URL(SC_BASE + SC_PATHS[kind]);
    for (const [k, v] of Object.entries(query)) if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, v);
    const res = await fetch(url, { headers: { 'x-api-key': key }, signal: AbortSignal.timeout(120000) });
    const body = await res.json().catch(() => ({}));
    if (!res.ok || body.success === false) throw new Error(`Ad Library ${kind}: HTTP ${res.status} ${body.message || body.error || ''}`.trim());
    return { result: body, cost: 0.002 * (body.credits_charged ?? 1) };
  }
  if (await tregAvailable()) {
    const { result, meta } = await treg(SC_TREG + kind, { query });
    return { result, cost: costOf(meta) };
  }
  throw new Error('No ad data provider: set SCRAPECREATORS_API_KEY.');
}

// Output sizes. Fal's GPT Image 2 edit endpoint wants multiples of 16.
export const SIZES = {
  feed: { label: 'Feed 4:5', aspect: '4:5', fal: { width: 1088, height: 1360 }, gpt: '3:4' },
  story: { label: 'Story / Reels 9:16', aspect: '9:16', fal: { width: 1088, height: 1936 }, gpt: '9:16' },
  square: { label: 'Square 1:1', aspect: '1:1', fal: { width: 1088, height: 1088 }, gpt: '1:1' },
};

async function inlineImage(url) {
  const ref = await fetch(url, { signal: AbortSignal.timeout(30000) });
  if (!ref.ok) throw new Error(`Could not fetch a reference image (HTTP ${ref.status}). Refresh the rival's ads and try again.`);
  return { mime_type: ref.headers.get('content-type') || 'image/jpeg', data: Buffer.from(await ref.arrayBuffer()).toString('base64') };
}

/**
 * Render one ad image. refs: public image URLs, in order (rival ad for layout first, then your product photo).
 * Engines, first available wins: Fal GPT Image 2 (FAL_KEY) → Gemini (GEMINI_API_KEY) → treg (local dev).
 * Returns { bytes: Buffer, cost, engine }.
 */
export async function renderImage(prompt, refs = [], { size = 'feed', prefer } = {}) {
  const S = SIZES[size] || SIZES.feed;
  refs = refs.filter(u => /^(https:\/\/|data:image\/)/.test(u || '')).slice(0, 4);
  if (process.env.FAL_KEY) {
    const endpoint = refs.length ? 'https://fal.run/openai/gpt-image-2/edit' : 'https://fal.run/openai/gpt-image-2';
    const fire = image_size => fetch(endpoint, {
      method: 'POST', headers: { authorization: `Key ${process.env.FAL_KEY}`, 'content-type': 'application/json' }, signal: AbortSignal.timeout(300000),
      body: JSON.stringify({ prompt, image_size, quality: 'high', num_images: 1, output_format: 'png', ...(refs.length ? { image_urls: refs } : {}) }),
    });
    let res = await fire(S.fal);
    if (res.status === 422) res = await fire(size === 'story' ? 'portrait_16_9' : size === 'square' ? 'square_hd' : 'portrait_4_3');
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(`Image engine: HTTP ${res.status} ${JSON.stringify(body.detail || body.error || '').slice(0, 200)}`);
    const url = body.images?.[0]?.url;
    if (!url) throw new Error('The image engine returned no image.');
    return { bytes: Buffer.from(await (await fetch(url)).arrayBuffer()), cost: 0.21, engine: 'gpt-image-2' };
  }
  if (process.env.GEMINI_API_KEY) {
    const model = process.env.GEMINI_IMAGE_MODEL || 'gemini-3-pro-image';
    const parts = [{ text: prompt }, ...(await Promise.all(refs.map(inlineImage))).map(inline_data => ({ inline_data }))];
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: 'POST', headers: { 'x-goog-api-key': process.env.GEMINI_API_KEY, 'content-type': 'application/json' }, signal: AbortSignal.timeout(300000),
      body: JSON.stringify({ contents: [{ parts }], generationConfig: { responseModalities: ['IMAGE'], imageConfig: { aspectRatio: S.aspect } } }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(`Gemini: HTTP ${res.status} ${body.error?.message || ''}`);
    const img = body.candidates?.[0]?.content?.parts?.find(p => p.inlineData || p.inline_data);
    const data = img?.inlineData?.data || img?.inline_data?.data;
    if (!data) throw new Error(`Gemini returned no image (${body.candidates?.[0]?.finishReason || 'no candidates'}).`);
    return { bytes: Buffer.from(data, 'base64'), cost: 0.134, engine: model };
  }
  if (await tregAvailable()) {
    // GPT Image 2 handles "use this exact product" edits best; Gemini when there is no product photo.
    const useGpt = prefer === 'gpt' || refs.length > 1;
    const endpoint = useGpt ? 'reapi.image-gen.gpt-image-2' : 'reapi.image-gen.gemini-3-pro-image';
    const body = useGpt
      ? { model: 'gpt-image-2', prompt, size: S.gpt, resolution: '1k', ...(refs.length ? { image_urls: refs } : {}) }
      : { model: 'gemini-3-pro-image-preview', prompt, size: S.aspect, resolution: '1K', ...(refs.length ? { image_urls: refs } : {}) };
    const { result, meta } = await treg(endpoint, { body, wait: 600 });
    const url = result?.output?.image_urls?.[0];
    if (!url) throw new Error('The image provider returned no image.');
    return { bytes: Buffer.from(await (await fetch(url)).arrayBuffer()), cost: costOf(meta) || 0.03, engine: useGpt ? 'gpt-image-2' : 'gemini-3-pro-image' };
  }
  throw new Error('No image engine: set FAL_KEY or GEMINI_API_KEY.');
}
