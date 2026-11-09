// Brand kit from a website: name, colours, font, voice, taglines and real product photos.
// Ported from RENDER Studio's scrape_brand (RoboNuggets, https://robonuggets.com, CC BY 4.0).
// Shopify stores expose /products.json, which gives clean product shots; other sites fall back to
// images found in the page HTML.
const UA = 'Mozilla/5.0 (compatible; KeepwatchBot/0.2; +https://keepwatch.app)';
const decode = s => String(s || '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&#x27;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').trim();

const PRIVATE = [/^10\./, /^127\./, /^169\.254\./, /^172\.(1[6-9]|2\d|3[01])\./, /^192\.168\./, /^0\./, /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./, /^::1$/, /^f[cd]/i, /^fe80/i, /^::ffff:(10|127|169\.254|192\.168)\./i];

/** Resolve the host and refuse private/internal addresses (the server makes this request). */
async function assertPublicHost(hostname) {
  const { lookup } = await import('node:dns/promises');
  const addrs = await lookup(hostname, { all: true });
  if (!addrs.length || addrs.some(a => PRIVATE.some(rx => rx.test(a.address)))) throw new Error('that address is not a public website');
}

/** GET with manual redirects (max 4), re-checking every hop against safeUrl + DNS. */
export async function fetchPublic(url, { ms = 25000, accept = 'text/html,application/json' } = {}) {
  let cur = url;
  for (let hop = 0; hop < 5; hop++) {
    const u = safeUrl(cur);
    if (!u) throw new Error('that address is not a public website');
    await assertPublicHost(u.hostname);
    const res = await fetch(u.href, { headers: { 'user-agent': UA, accept }, redirect: 'manual', signal: AbortSignal.timeout(ms) });
    if (res.status >= 300 && res.status < 400 && res.headers.get('location')) { cur = new URL(res.headers.get('location'), u.href).href; continue; }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res;
  }
  throw new Error('too many redirects');
}

async function fetchText(url, ms = 25000) {
  const res = await fetchPublic(url, { ms });
  const text = await res.text();
  return text.slice(0, 3_000_000);
}

/** Only public http(s) hosts: no localhost, private ranges or bare IPs (the server fetches this URL). */
export function safeUrl(input) {
  let u;
  try { u = new URL(/^https?:\/\//i.test(input) ? input : `https://${input}`); } catch { return null; }
  if (!/^https?:$/.test(u.protocol)) return null;
  const h = u.hostname.toLowerCase();
  if (!h.includes('.') || h === 'localhost' || h.endsWith('.local') || h.endsWith('.internal') || /^[\d.]+$/.test(h) || h.includes(':')) return null;
  return u;
}

function meta(html, ...keys) {
  for (const k of keys) {
    const e = k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const m = html.match(new RegExp(`(?:property|name)=["']${e}["'][^>]*content=["']([^"']+)`, 'i'))
      || html.match(new RegExp(`content=["']([^"']+)["'][^>]*(?:property|name)=["']${e}["']`, 'i'));
    if (m) return decode(m[1]);
  }
  return '';
}

const JUNK_HEX = new Set(['#007bff', '#0d6efd', '#0a58ca', '#6610f2', '#0dcaf0']);
function colours(html) {
  const count = new Map();
  for (const [, h] of html.matchAll(/#([0-9a-fA-F]{6})\b/g)) {
    const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4), 16);
    const hex = '#' + h.toLowerCase();
    if (Math.max(r, g, b) - Math.min(r, g, b) < 22 || JUNK_HEX.has(hex) || [r, g, b].every(c => c === 0 || c === 255)) continue;
    count.set(hex, (count.get(hex) || 0) + 1);
  }
  const cols = [...count.entries()].sort((a, b) => b[1] - a[1]).map(([c]) => c).slice(0, 6);
  const tc = meta(html, 'theme-color');
  if (/^#[0-9a-f]{6}$/i.test(tc) && !cols.includes(tc.toLowerCase())) cols.unshift(tc.toLowerCase());
  return cols.slice(0, 6);
}

function font(html) {
  const cands = [];
  const a = html.match(/fontFamily"\s*:\s*\{[^}]*?\[\s*"([^"]+)"/); if (a) cands.push(a[1]);
  const b = html.match(/font_family"\s*:\s*"([^"]+)"/); if (b) cands.push(b[1]);
  for (const m of html.matchAll(/@font-face[^}]*?font-family:\s*["']?([^;"'}]+)/gi)) cands.push(m[1]);
  for (const m of html.matchAll(/font-family:\s*([^;"}\n]+)/gi)) cands.push(m[1]);
  const generic = ['sans-serif', 'serif', 'monospace', 'inherit', 'var(', 'arial', 'helvetica', 'system', 'apple'];
  for (const c of cands) {
    const name = c.trim().replace(/^["']|["']$/g, '').split(',')[0].trim();
    if (name.length > 1 && !generic.some(g => name.toLowerCase().includes(g))) return name.replace(/(?<=[a-z])(?=[A-Z])/g, ' ');
  }
  return null;
}

async function shopifyProducts(origin) {
  try {
    const data = JSON.parse(await fetchText(`${origin}/products.json?limit=24`, 20000));
    return (data.products || []).filter(p => p.images?.[0]?.src).slice(0, 12).map(p => ({
      name: decode(p.title).slice(0, 60), url: p.images[0].src.split('?')[0], price: p.variants?.[0]?.price || null, handle: p.handle || null,
    }));
  } catch { return []; }
}

function htmlProducts(html, name) {
  const out = [], seen = new Set();
  for (const [u0] of html.matchAll(/https?:\/\/[^"'\s)]+?\.(?:png|jpg|jpeg|webp)/gi)) {
    const u = u0.split('?')[0];
    if (seen.has(u) || /icon|logo|sprite|favicon|placeholder|badge|flag|payment/i.test(u)) continue;
    seen.add(u);
    out.push({ name, url: u });
    if (out.length >= 8) break;
  }
  return out;
}

const ADJ = ['bold', 'playful', 'fun', 'minimal', 'clean', 'modern', 'luxury', 'premium', 'elegant', 'warm', 'friendly', 'cheeky', 'calm',
  'energetic', 'retro', 'vintage', 'quirky', 'bright', 'soft', 'natural', 'organic', 'wholesome', 'fresh', 'real', 'simple', 'honest'];

export async function scrapeBrand(input) {
  const u = safeUrl(input);
  if (!u) throw Object.assign(new Error('Enter your public website address, e.g. yourbrand.com'), { status: 400 });
  let html;
  try { html = await fetchText(u.href); } catch (e) { throw Object.assign(new Error(`Could not read ${u.hostname} (${e.message}). Some sites block bots; fill the brand in by hand.`), { status: 422 }); }
  const origin = `${u.protocol}//${u.host}`;
  let name = meta(html, 'og:site_name');
  if (!name) name = decode((html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '').split(/[|\-–]/)[0]);
  if (!name) name = u.hostname.replace(/^www\./, '').split('.')[0];
  const desc = meta(html, 'og:description', 'description');
  const taglines = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map(m => decode(m[1].replace(/<[^>]+>/g, ''))).filter(h => h.length > 2 && h.length < 70).slice(0, 4);
  let products = await shopifyProducts(origin);
  if (!products.length) products = htmlProducts(html, name);
  const og = meta(html, 'og:image');
  return {
    name: name.slice(0, 60), domain: u.hostname.replace(/^www\./, ''), url: origin,
    description: desc.slice(0, 300), voice_tags: ADJ.filter(a => new RegExp(`\\b${a}\\b`, 'i').test(`${desc} ${html.slice(0, 5000)}`)).slice(0, 5),
    taglines, colors: colours(html), font: font(html), og_image: og ? new URL(og, origin).href : null, products,
  };
}
