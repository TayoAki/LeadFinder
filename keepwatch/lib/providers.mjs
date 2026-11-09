// External data and generation providers. Each uses its own API key when set (production on Railway),
// otherwise falls back to the treg CLI (which injects keys server-side) when it is installed.
//   SCRAPECREATORS_API_KEY  Meta Ad Library: company search, company ads, video transcripts
//   GEMINI_API_KEY          image rebuilds (Gemini 3 Pro Image); GEMINI_IMAGE_MODEL to override
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
    images: Boolean(process.env.GEMINI_API_KEY) || t,
    llm: Boolean(process.env.ANTHROPIC_API_KEY),
    via: { adData: process.env.SCRAPECREATORS_API_KEY ? 'scrapecreators' : t ? 'treg' : null, images: process.env.GEMINI_API_KEY ? 'gemini' : t ? 'treg' : null },
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

/** Render one image from a prompt and an optional reference image URL. Returns { bytes: Buffer, cost }. */
export async function renderImage(prompt, refUrl, { aspect = '4:5' } = {}) {
  const key = process.env.GEMINI_API_KEY;
  if (key) {
    const model = process.env.GEMINI_IMAGE_MODEL || 'gemini-3-pro-image';
    const parts = [{ text: prompt }];
    if (refUrl) {
      const ref = await fetch(refUrl, { signal: AbortSignal.timeout(30000) });
      if (!ref.ok) throw new Error(`Could not fetch the reference ad image (HTTP ${ref.status}). Refresh the rival's ads and try again.`);
      parts.push({ inline_data: { mime_type: ref.headers.get('content-type') || 'image/jpeg', data: Buffer.from(await ref.arrayBuffer()).toString('base64') } });
    }
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: 'POST', headers: { 'x-goog-api-key': key, 'content-type': 'application/json' }, signal: AbortSignal.timeout(300000),
      body: JSON.stringify({ contents: [{ parts }], generationConfig: { responseModalities: ['IMAGE'], imageConfig: { aspectRatio: aspect } } }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(`Gemini: HTTP ${res.status} ${body.error?.message || ''}`);
    const img = body.candidates?.[0]?.content?.parts?.find(p => p.inlineData || p.inline_data);
    const data = img?.inlineData?.data || img?.inline_data?.data;
    if (!data) throw new Error(`Gemini returned no image (${body.candidates?.[0]?.finishReason || 'no candidates'}).`);
    return { bytes: Buffer.from(data, 'base64'), cost: 0.134 };
  }
  if (await tregAvailable()) {
    const { result, meta } = await treg('reapi.image-gen.gemini-3-pro-image', {
      body: { model: 'gemini-3-pro-image-preview', prompt, size: aspect, resolution: '1K', ...(refUrl ? { image_urls: [refUrl] } : {}) }, wait: 600,
    });
    const url = result?.output?.image_urls?.[0];
    if (!url) throw new Error('The image provider returned no image.');
    return { bytes: Buffer.from(await (await fetch(url)).arrayBuffer()), cost: costOf(meta) || 0.03 };
  }
  throw new Error('No image provider: set GEMINI_API_KEY.');
}
