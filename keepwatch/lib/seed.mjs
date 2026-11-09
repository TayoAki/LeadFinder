// Starter data so a fresh deploy is useful before any provider key is set: public Meta Ad Library
// rows for a demo category (fiber and gut-health drinks), plus the demo brand used by "Try the demo".
//   node --experimental-sqlite lib/seed.mjs --export   writes seed-data/ads.json.gz from the local db
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { gzipSync, gunzipSync } from 'node:zlib';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getDb } from './db.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const FILE = resolve(here, '..', 'seed-data', 'ads.json.gz');
export const DEMO_BRAND = JSON.parse(readFileSync(resolve(here, '..', 'seed.json'), 'utf8')).brand;

const RIVAL_COLS = ['name', 'page_id', 'domain', 'avatar_url', 'ig_username', 'likes', 'page_category', 'last_collected_at'];
const AD_COLS = ['id', 'collation_id', 'collation_count', 'is_active', 'start_date', 'end_date', 'format', 'display_format', 'body', 'title',
  'link_desc', 'cta', 'link_url', 'image_url', 'video_url', 'thumb_url', 'transcript', 'hook', 'hook_source', 'angle'];

export function importSeedIfEmpty(db = getDb()) {
  if (db.prepare('SELECT COUNT(*) n FROM ads').get().n || !existsSync(FILE)) return 0;
  const data = JSON.parse(gunzipSync(readFileSync(FILE)).toString());
  const insR = db.prepare(`INSERT OR IGNORE INTO rivals (${RIVAL_COLS.join(',')}) VALUES (${RIVAL_COLS.map(() => '?').join(',')})`);
  const insA = db.prepare(`INSERT OR IGNORE INTO ads (rival_id, ${AD_COLS.join(',')}) VALUES (?, ${AD_COLS.map(() => '?').join(',')})`);
  db.exec('BEGIN');
  try {
    for (const r of data.rivals) {
      insR.run(...RIVAL_COLS.map(c => r[c] ?? null));
      const id = db.prepare('SELECT id FROM rivals WHERE page_id = ?').get(r.page_id).id;
      for (const a of r.ads) insA.run(id, ...AD_COLS.map(c => a[c] ?? null));
    }
    db.exec('COMMIT');
  } catch (e) { db.exec('ROLLBACK'); throw e; }
  const n = db.prepare('SELECT COUNT(*) n FROM ads').get().n;
  console.log(`seed: imported ${data.rivals.length} rivals, ${n} ads`);
  return n;
}

if (import.meta.url === `file://${process.argv[1]}` && process.argv.includes('--export')) {
  const db = getDb();
  const rivals = db.prepare('SELECT * FROM rivals WHERE EXISTS (SELECT 1 FROM ads WHERE ads.rival_id = rivals.id)').all().map(r => ({
    ...Object.fromEntries(RIVAL_COLS.map(c => [c, r[c]])),
    ads: db.prepare('SELECT * FROM ads WHERE rival_id = ?').all(r.id).map(a => Object.fromEntries(AD_COLS.map(c => [c, a[c]]))),
  }));
  mkdirSync(dirname(FILE), { recursive: true });
  writeFileSync(FILE, gzipSync(JSON.stringify({ exported_at: new Date().toISOString(), rivals })));
  console.log(`exported ${rivals.length} rivals, ${rivals.reduce((n, r) => n + r.ads.length, 0)} ads → ${FILE}`);
}
