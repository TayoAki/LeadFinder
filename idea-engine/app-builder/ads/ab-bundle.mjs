// Build the import bundle for the AI-app-builders workspace (rivals + ads + brand) from the local instance.
// Usage: node --experimental-sqlite rt-bundle.mjs <dataDir> <out.json>
import { DatabaseSync } from 'node:sqlite';
import { writeFileSync } from 'node:fs';
const db = new DatabaseSync(process.argv[2] + '/keepwatch.db');
const ws = db.prepare('SELECT * FROM workspaces ORDER BY id LIMIT 1').get();
const RIVAL_COLS = ['name', 'page_id', 'domain', 'avatar_url', 'ig_username', 'likes', 'page_category', 'last_collected_at'];
const AD_COLS = ['id', 'collation_id', 'collation_count', 'is_active', 'start_date', 'end_date', 'format', 'display_format', 'body', 'title',
  'link_desc', 'cta', 'link_url', 'image_url', 'video_url', 'thumb_url', 'transcript', 'hook', 'hook_source', 'angle'];
const pick = (o, cols) => Object.fromEntries(cols.map(c => [c, o[c] ?? null]));
const rivals = db.prepare('SELECT r.* FROM rivals r JOIN workspace_rivals w ON w.rival_id = r.id WHERE w.workspace_id = ?').all(ws.id).map(r => ({
  ...pick(r, RIVAL_COLS), tracked: true,
  ads: db.prepare('SELECT * FROM ads WHERE rival_id = ?').all(r.id).map(a => pick(a, AD_COLS)),
}));
const BRAND = ['brand_name', 'brand_domain', 'brand_color', 'brand_offer', 'brand_voice', 'brand_product', 'category', 'audience'];
const bundle = { email: 'tayo@ugcmediakits.com', workspace_name: 'AI app builders', rivals, rebuilds: [],
  workspace: { ...pick(ws, BRAND), brand_name: 'AI app builders' } };
writeFileSync(process.argv[3], JSON.stringify(bundle));
console.log(`${rivals.length} rivals, ${rivals.reduce((n, r) => n + r.ads.length, 0)} ads, ${(JSON.stringify(bundle).length / 1e6).toFixed(1)} MB`);
