// Ads supplied by a connected AI or a person instead of the Ad Library provider, e.g. researched by
// hand in the public Meta Ad Library. They belong to one workspace: the rival's page_id is
// "manual-<workspace>-<slug>" and every ad id is prefixed, so nothing here can overwrite the shared,
// collected data other customers see. The collector skips manual rivals.
import { createHash } from 'node:crypto';
import { getDb, trackRival } from './db.mjs';
import { extractHook, angleFor } from './classify.mjs';

const slug = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 40) || 'rival';
const day = v => (v && /^\d{4}-\d{2}-\d{2}/.test(String(v)) ? String(v).slice(0, 10) : null);
const https = v => (typeof v === 'string' && /^https:\/\//.test(v) ? v.slice(0, 1000) : null);
const txt = (v, n = 2000) => (typeof v === 'string' && v.trim() ? v.trim().slice(0, n) : null);
export const isManual = pageId => String(pageId || '').startsWith('manual-');

/** Create (or reuse) a workspace's manual rival, track it, and upsert the given ads. Returns counts. */
export function addManualAds(wsId, { rival, ads = [], domain } = {}, db = getDb()) {
  const name = txt(rival, 120);
  if (!name) throw Object.assign(new Error('Give the rival\'s name.'), { status: 400 });
  if (!Array.isArray(ads) || !ads.length) throw Object.assign(new Error('Give at least one ad.'), { status: 400 });
  if (ads.length > 100) throw Object.assign(new Error('At most 100 ads per call.'), { status: 400 });
  const pageId = `manual-${wsId}-${slug(name)}`;
  db.prepare('INSERT INTO rivals (name, page_id, domain) VALUES (?,?,?) ON CONFLICT(page_id) DO UPDATE SET name = excluded.name').run(name, pageId, txt(domain, 200));
  const rv = db.prepare('SELECT * FROM rivals WHERE page_id = ?').get(pageId);
  trackRival(wsId, rv.id, db);
  const today = new Date().toISOString().slice(0, 10);
  const up = db.prepare(`INSERT INTO ads (id, rival_id, is_active, start_date, end_date, format, body, title, cta, link_url, image_url, video_url, thumb_url, transcript, hook, hook_source, angle)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    ON CONFLICT(id) DO UPDATE SET is_active = excluded.is_active, end_date = excluded.end_date, body = excluded.body, title = excluded.title, hook = excluded.hook, angle = excluded.angle, last_seen_at = datetime('now')`);
  let added = 0, skipped = 0;
  for (const a of ads) {
    const body = txt(a.body), title = txt(a.title, 300), transcript = txt(a.transcript, 6000);
    if (!body && !title && !transcript && !txt(a.hook)) { skipped++; continue; }
    const key = txt(a.id, 60) || createHash('sha1').update(`${body}|${title}|${a.start_date}`).digest('hex').slice(0, 16);
    const id = `m${wsId}-${key}`;
    const h = txt(a.hook, 300) ? { hook: txt(a.hook, 300), source: 'given' } : extractHook({ transcript, body, title });
    const active = a.is_active === false || a.is_active === 0 ? 0 : 1;
    up.run(id, rv.id, active, day(a.start_date) || today, active ? null : (day(a.end_date) || today), ['static', 'video', 'carousel'].includes(a.format) ? a.format : 'static',
      body, title, txt(a.cta, 40), https(a.link_url), https(a.image_url), https(a.video_url), https(a.thumb_url) || https(a.image_url), transcript, h.hook, h.source, angleFor(h.hook, body, title));
    added++;
  }
  db.prepare("UPDATE rivals SET last_collected_at = datetime('now') WHERE id = ?").run(rv.id);
  return { rival: { id: rv.id, name: rv.name }, added, skipped };
}
