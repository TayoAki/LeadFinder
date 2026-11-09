// The brand's own App Store listing: icon, screenshots and price. Used for the app-demo and end-card
// shots of a video, so those shots show the real app instead of something drawn by a model.
// Only for app brands: we find the id in the brand's App Store link (Settings → brand domain or URL).
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { DATA_DIR } from './db.mjs';

export const appStoreId = ws => {
  const m = /apps\.apple\.com\/.*?\bid(\d{6,12})\b/.exec([ws.brand_url, ws.brand_domain].filter(Boolean).join(' '));
  return m ? m[1] : null;
};

/** Download (once) and return { id, name, price, icon, screens: [{ name, path }] }, or null for non-app brands. */
export async function appAssets(ws) {
  const id = appStoreId(ws);
  if (!id) return null;
  const dir = resolve(DATA_DIR, 'appstore', id);
  const index = resolve(dir, 'assets.json');
  if (existsSync(index)) {
    const cached = JSON.parse(readFileSync(index, 'utf8'));
    if (Date.now() - cached.fetched < 7 * 864e5) return cached;
  }
  const res = await fetch(`https://itunes.apple.com/lookup?id=${id}&country=us`, { signal: AbortSignal.timeout(20000) });
  const app = (await res.json().catch(() => ({}))).results?.[0];
  if (!app) return null;
  mkdirSync(dir, { recursive: true });
  const hi = u => u.replace(/\/[^/]+$/, '/1290x2796bb.jpg');
  const get = async (url, file) => { const r = await fetch(url, { signal: AbortSignal.timeout(30000) }); if (!r.ok) return null; writeFileSync(resolve(dir, file), Buffer.from(await r.arrayBuffer())); return resolve(dir, file); };
  const icon = await get(app.artworkUrl512.replace(/\/[^/]+$/, '/1024x1024bb.jpg'), 'icon.jpg');
  const screens = [];
  for (const [i, u] of (app.screenshotUrls || []).slice(0, 10).entries()) {
    const name = (/\/([^/]+?)\.(png|jpe?g)\/[^/]+$/.exec(u)?.[1] || `screen-${i + 1}`).replace(/[^\w-]/g, '');
    const path = await get(hi(u), `${name}.jpg`);
    if (path) screens.push({ name, path });
  }
  const out = { id, name: app.trackName, price: app.formattedPrice || (app.price ? `$${app.price}` : 'Free'), icon, screens, fetched: Date.now() };
  writeFileSync(index, JSON.stringify(out));
  return out;
}
