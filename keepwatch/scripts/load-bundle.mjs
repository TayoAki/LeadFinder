// Load an admin import bundle (rivals + ads + brand) into a local Keepwatch data dir, for testing analyses offline.
// Usage: node --experimental-sqlite scripts/load-bundle.mjs <bundle.json> <dataDir>
import { readFileSync } from 'node:fs';
process.env.KEEPWATCH_DATA = process.argv[3];
const { getDb, workspaceForUser, saveWorkspace, trackRival } = await import('../lib/db.mjs');
const { addRival } = await import('../collect.mjs');
const b = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const db = getDb();
const ws = workspaceForUser('local', db);
saveWorkspace(ws.id, b.workspace || {}, db);
const AD_COLS = ['id', 'collation_id', 'collation_count', 'is_active', 'start_date', 'end_date', 'format', 'display_format', 'body', 'title',
  'link_desc', 'cta', 'link_url', 'image_url', 'video_url', 'thumb_url', 'transcript', 'hook', 'hook_source', 'angle'];
const ins = db.prepare(`INSERT OR REPLACE INTO ads (rival_id, ${AD_COLS.join(',')}) VALUES (?, ${AD_COLS.map(() => '?').join(',')})`);
let n = 0;
for (const r of b.rivals) {
  const row = addRival(r, db);
  trackRival(ws.id, row.id, db);
  for (const a of r.ads) { ins.run(row.id, ...AD_COLS.map(c => a[c] ?? null)); n++; }
}
console.log(`workspace ${ws.id}: ${b.rivals.length} rivals, ${n} ads`);
