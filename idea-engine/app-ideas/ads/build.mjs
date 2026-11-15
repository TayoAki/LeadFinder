// Build one Keepwatch workspace bundle for an app idea from public Meta Ad Library pages saved by
// ../../scroll-the-bible/ads/fbal.cjs, ready for the admin import route.
//   node --experimental-sqlite build.mjs <config.json> <rawDir> <dataDir> <out.json> <account email>
// config.json: { "workspace_name": "...", "brand": { brand_name, brand_domain, category, brand_product, audience, brand_voice },
//                "pages": [["<page id>", "<label>"], ...] }
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
const [cfgPath, raw, dataDir, out, email] = process.argv.slice(2);
if (!email) throw new Error('usage: build.mjs <config.json> <rawDir> <dataDir> <out.json> <account email>');
process.env.KEEPWATCH_DATA = dataDir;
const root = new URL('../../../keepwatch/', import.meta.url).pathname;
const { getDb, workspaceForUser, saveWorkspace, trackRival } = await import(`${root}lib/db.mjs`);
const { addRival } = await import(`${root}collect.mjs`);
const { normaliseAd, extractHook, angleFor } = await import(`${root}lib/classify.mjs`);

const cfg = JSON.parse(readFileSync(cfgPath, 'utf8'));
const all = readdirSync(raw).filter(f => f.endsWith('.json')).flatMap(f => JSON.parse(readFileSync(`${raw}/${f}`, 'utf8')));
const byId = {}; for (const a of all) byId[a.ad_archive_id] = { ...byId[a.ad_archive_id], ...a };
const db = getDb();
const ws = workspaceForUser('local', db);
saveWorkspace(ws.id, cfg.brand, db);
const ins = db.prepare(`INSERT OR REPLACE INTO ads (id, rival_id, collation_id, collation_count, is_active, start_date, end_date, format, display_format, body, title,
  link_desc, cta, link_url, image_url, video_url, thumb_url, hook, hook_source, angle) VALUES (:id,:rival_id,:collation_id,:collation_count,:is_active,:start_date,:end_date,
  :format,:display_format,:body,:title,:link_desc,:cta,:link_url,:image_url,:video_url,:thumb_url,:hook,:hook_source,:angle)`);
const today = new Date().toISOString().slice(0, 10);
for (const [page_id, name] of cfg.pages) {
  const ads = Object.values(byId).filter(a => String(a.page_id) === String(page_id));
  const s = ads[0]?.snapshot || {};
  const r = addRival({ page_id, name, avatar_url: s.page_profile_picture_url, likes: s.page_like_count, page_category: (s.page_categories || [])[0] }, db);
  db.prepare('UPDATE rivals SET last_collected_at = ? WHERE id = ?').run(today, r.id);
  trackRival(ws.id, r.id, db);
  for (const x of ads) { const a = normaliseAd(x); const { hook, source } = extractHook(a); ins.run({ ...a, rival_id: r.id, hook, hook_source: source, angle: angleFor(hook, a.body, a.title) }); }
  console.log(name.padEnd(44), String(ads.length).padStart(4), 'ads,', ads.filter(a => a.is_active).length, 'live');
}
const RIVAL_COLS = ['name', 'page_id', 'domain', 'avatar_url', 'ig_username', 'likes', 'page_category', 'last_collected_at'];
const AD_COLS = ['id', 'collation_id', 'collation_count', 'is_active', 'start_date', 'end_date', 'format', 'display_format', 'body', 'title',
  'link_desc', 'cta', 'link_url', 'image_url', 'video_url', 'thumb_url', 'transcript', 'hook', 'hook_source', 'angle'];
const pick = (o, cols) => Object.fromEntries(cols.map(c => [c, o[c] ?? null]));
const rivals = db.prepare('SELECT r.* FROM rivals r JOIN workspace_rivals w ON w.rival_id = r.id WHERE w.workspace_id = ?').all(ws.id)
  .map(r => ({ ...pick(r, RIVAL_COLS), tracked: true, ads: db.prepare('SELECT * FROM ads WHERE rival_id = ?').all(r.id).map(a => pick(a, AD_COLS)) }));
writeFileSync(out, JSON.stringify({ email, workspace_name: cfg.workspace_name, rivals, rebuilds: [], workspace: cfg.brand }));
console.log(`bundle: ${rivals.length} pages, ${rivals.reduce((n, r) => n + r.ads.length, 0)} ads -> ${out}`);
