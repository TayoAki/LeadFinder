// Owner-only admin routes for moving data between Keepwatch instances (e.g. a local workspace onto the live site).
// Off unless ADMIN_TOKEN is set (32+ chars). Send it as the x-admin-token header.
//   POST /admin/import       JSON bundle → attaches rivals, ads, brand and rebuilds to the account with that email
//   POST /admin/upload?name= raw PNG body → stores a rebuild image
import { timingSafeEqual } from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { getDb, workspaceForUser, saveWorkspace, trackRival } from './db.mjs';
import { REBUILD_DIR } from './rebuild.mjs';
import { PLANS } from './plans.mjs';

const RIVAL_COLS = ['name', 'page_id', 'domain', 'avatar_url', 'ig_username', 'likes', 'page_category', 'last_collected_at'];
const AD_COLS = ['id', 'collation_id', 'collation_count', 'is_active', 'start_date', 'end_date', 'format', 'display_format', 'body', 'title',
  'link_desc', 'cta', 'link_url', 'image_url', 'video_url', 'thumb_url', 'transcript', 'hook', 'hook_source', 'angle'];
const BRAND = ['brand_name', 'brand_domain', 'brand_color', 'brand_offer', 'brand_voice', 'brand_product', 'category', 'audience', 'brand_url', 'brand_kit', 'product_image', 'drop_enabled', 'drop_hour', 'drop_tz'];

export function adminAuthorized(req) {
  const want = process.env.ADMIN_TOKEN || '';
  const got = String(req.headers['x-admin-token'] || '');
  if (want.length < 32 || got.length !== want.length) return false;
  return timingSafeEqual(Buffer.from(got), Buffer.from(want));
}

const readRaw = (req, max) => new Promise((ok, bad) => {
  const parts = []; let n = 0;
  req.on('data', c => { n += c.length; if (n > max) { bad(Object.assign(new Error('too large'), { status: 413 })); req.destroy(); } else parts.push(c); });
  req.on('end', () => ok(Buffer.concat(parts)));
  req.on('error', bad);
});

export async function handleAdmin(req, res, url, send) {
  if (!adminAuthorized(req)) return send(res, 404, { error: 'not found' });
  const db = getDb();
  if (req.method === 'POST' && url.pathname === '/admin/upload') {
    const name = url.searchParams.get('name') || '';
    if (!/^rebuild-[\w-]+\.png$/.test(name)) return send(res, 400, { error: 'bad name' });
    const buf = await readRaw(req, 15 * 1024 * 1024);
    if (buf.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a') return send(res, 400, { error: 'not a PNG' });
    mkdirSync(REBUILD_DIR, { recursive: true });
    writeFileSync(resolve(REBUILD_DIR, name), buf);
    return send(res, 200, { ok: true, bytes: buf.length });
  }
  if (req.method === 'POST' && url.pathname === '/admin/import') {
    const b = JSON.parse((await readRaw(req, 40 * 1024 * 1024)).toString());
    const user = db.prepare('SELECT id FROM user WHERE lower(email) = lower(?)').get(String(b.email || ''));
    if (!user) return send(res, 404, { error: 'no account with that email' });
    const ws = workspaceForUser(user.id, db);
    const insR = db.prepare(`INSERT INTO rivals (${RIVAL_COLS.join(',')}) VALUES (${RIVAL_COLS.map(() => '?').join(',')})
      ON CONFLICT(page_id) DO UPDATE SET name=excluded.name, last_collected_at=MAX(COALESCE(rivals.last_collected_at,''), COALESCE(excluded.last_collected_at,''))`);
    const insA = db.prepare(`INSERT INTO ads (rival_id, ${AD_COLS.join(',')}) VALUES (?, ${AD_COLS.map(() => '?').join(',')})
      ON CONFLICT(id) DO UPDATE SET is_active=excluded.is_active, end_date=excluded.end_date, image_url=excluded.image_url, thumb_url=excluded.thumb_url,
        transcript=COALESCE(excluded.transcript, ads.transcript), hook=excluded.hook, hook_source=excluded.hook_source, angle=excluded.angle`);
    const insB = db.prepare('INSERT INTO rebuilds (workspace_id, ad_id, created_at, headline, why, prompt, image_path, status, cost_usd, drop_week, size) VALUES (?,?,?,?,?,?,?,?,?,?,?)');
    let ads = 0, rebuilds = 0;
    db.exec('BEGIN');
    try {
      for (const r of b.rivals || []) {
        insR.run(...RIVAL_COLS.map(c => r[c] ?? null));
        const rid = db.prepare('SELECT id FROM rivals WHERE page_id = ?').get(String(r.page_id)).id;
        for (const a of r.ads || []) { insA.run(rid, ...AD_COLS.map(c => a[c] ?? null)); ads++; }
        if (r.tracked) trackRival(ws.id, rid, db);
      }
      for (const x of b.rebuilds || []) {
        if (db.prepare('SELECT 1 FROM rebuilds WHERE workspace_id = ? AND image_path = ?').get(ws.id, x.image_path)) continue;
        insB.run(ws.id, x.ad_id, x.created_at, x.headline, x.why, x.prompt, x.image_path, x.status, x.cost_usd ?? 0, x.drop_week ?? null, x.size ?? 'feed');
        rebuilds++;
      }
      db.exec('COMMIT');
    } catch (e) { db.exec('ROLLBACK'); throw e; }
    for (const n of b.notifications || []) db.prepare('INSERT OR IGNORE INTO notifications (workspace_id, kind, title, body, link, ref) VALUES (?,?,?,?,?,?)').run(ws.id, n.kind, n.title, n.body ?? null, n.link ?? null, n.ref ? `${n.ref}:${ws.id}` : null);
    if (b.workspace) saveWorkspace(ws.id, Object.fromEntries(BRAND.filter(k => b.workspace[k] != null).map(k => [k, b.workspace[k]])), db);
    if (b.plan && PLANS[b.plan]) db.prepare('UPDATE workspaces SET plan = ? WHERE id = ?').run(b.plan, ws.id);
    return send(res, 200, { ok: true, workspace_id: ws.id, ads, rebuilds, tracked: db.prepare('SELECT COUNT(*) n FROM workspace_rivals WHERE workspace_id = ?').get(ws.id).n });
  }
  return send(res, 404, { error: 'not found' });
}
