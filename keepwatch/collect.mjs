// Collector: pulls each tracked rival's Meta ads through treg into SQLite.
//   node --experimental-sqlite collect.mjs                 collect every rival
//   node --experimental-sqlite collect.mjs --seed seed.json   set brand + rivals first, then collect
//   node --experimental-sqlite collect.mjs --rival "Olipop"   add one rival by name, then collect it
// Env: KW_ACTIVE_PAGES (3), KW_RECENT_PAGES (2), KW_KILLED_PAGES (3), KW_TRANSCRIPTS (8 per rival), KW_LANGUAGE (EN), KW_COUNTRY (unset = all)
import { readFileSync } from 'node:fs';
import { getDb, saveWorkspace } from './lib/db.mjs';
import { treg, tregAvailable, costOf } from './lib/treg.mjs';
import { normaliseAd, extractHook, angleFor } from './lib/classify.mjs';

const SC = 'scrapecreators.x.v1-facebook-adlibrary';
const env = (k, d) => (process.env[k] !== undefined ? Number(process.env[k]) : d);
const PAGES = { active: env('KW_ACTIVE_PAGES', 3), recent: env('KW_RECENT_PAGES', 2), killed: env('KW_KILLED_PAGES', 3) };
const TRANSCRIPTS = env('KW_TRANSCRIPTS', 8);
const COUNTRY = process.env.KW_COUNTRY || undefined; // note: the provider's country filter returned nothing in testing
const LANGUAGE = process.env.KW_LANGUAGE ?? 'EN';     // ad language; set KW_LANGUAGE= (empty) for all languages

export async function findPage(name, db = getDb(), run) {
  const { result, meta } = await treg(`${SC}-search-companies`, { query: { query: name } });
  if (run) { run.calls++; run.cost += costOf(meta); }
  const hits = (result?.searchResults || []).filter(h => !h.page_is_deleted);
  if (!hits.length) throw new Error(`No Meta advertiser found for "${name}"`);
  const norm = s => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  // Exact name first, then names that contain the query (or vice versa). Never fall back to an
  // unrelated page just because it has more likes (searching "AG1" returns America's Got Talent).
  const q = norm(name);
  const exact = hits.filter(h => norm(h.name) === q || norm(h.page_alias) === q || norm(h.ig_username) === q);
  const close = hits.filter(h => norm(h.name).includes(q) || q.includes(norm(h.name)));
  const pool = exact.length ? exact : close;
  if (!pool.length) throw new Error(`No advertiser named like "${name}". Closest: ${hits.slice(0, 5).map(h => h.name).join(', ')}`);
  const best = pool.sort((a, b) => (b.likes || 0) - (a.likes || 0))[0];
  return {
    name: best.name, page_id: String(best.page_id), avatar_url: best.image_uri || null,
    ig_username: best.ig_username || null, likes: best.likes || null, page_category: best.category || null,
  };
}

export function addRival(p, db = getDb()) {
  db.prepare(`INSERT INTO rivals (name, page_id, domain, avatar_url, ig_username, likes, page_category)
    VALUES (?,?,?,?,?,?,?) ON CONFLICT(page_id) DO UPDATE SET name=excluded.name, avatar_url=excluded.avatar_url,
    ig_username=excluded.ig_username, likes=excluded.likes, page_category=excluded.page_category`)
    .run(p.name, p.page_id, p.domain ?? null, p.avatar_url ?? null, p.ig_username ?? null, p.likes ?? null, p.page_category ?? null);
  return db.prepare('SELECT * FROM rivals WHERE page_id = ?').get(p.page_id);
}

const upsertSql = `INSERT INTO ads (id, rival_id, collation_id, collation_count, is_active, start_date, end_date, format,
  display_format, body, title, link_desc, cta, link_url, image_url, video_url, thumb_url, hook, hook_source, angle)
  VALUES (:id,:rival_id,:collation_id,:collation_count,:is_active,:start_date,:end_date,:format,:display_format,:body,:title,
  :link_desc,:cta,:link_url,:image_url,:video_url,:thumb_url,:hook,:hook_source,:angle)
  ON CONFLICT(id) DO UPDATE SET is_active=excluded.is_active, end_date=excluded.end_date, collation_count=excluded.collation_count,
  image_url=excluded.image_url, video_url=excluded.video_url, thumb_url=excluded.thumb_url, last_seen_at=datetime('now')`;

function store(db, rival, results) {
  const stmt = db.prepare(upsertSql);
  let n = 0;
  for (const r of results || []) {
    if (!r?.ad_archive_id) continue;
    const a = normaliseAd(r);
    const { hook, source } = extractHook(a);
    stmt.run({ ...a, rival_id: rival.id, hook, hook_source: source, angle: angleFor(hook, a.body, a.title) });
    n++;
  }
  return n;
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function pull(db, rival, run, { status, sort_by, pages }) {
  // The provider is sometimes blocked by Facebook mid-pagination; it asks us to restart without a cursor.
  for (let attempt = 1; ; attempt++) {
    let cursor, n = 0;
    try {
      for (let p = 0; p < pages; p++) {
        const { result, meta } = await treg(`${SC}-company-ads`, { query: { pageId: rival.page_id, status, sort_by, country: COUNTRY, language: LANGUAGE || undefined, cursor } });
        run.calls++; run.cost += costOf(meta);
        n += store(db, rival, result?.results);
        cursor = result?.cursor;
        if (!cursor || !(result?.results || []).length) break;
      }
      return n;
    } catch (e) {
      if (attempt >= 3 || !/blocking|HTTP 5\d\d/i.test(e.message)) { if (n) return n; throw e; }
      await sleep(15000 * attempt);
    }
  }
}

async function transcribe(db, rival, run) {
  // Spoken hooks for the longest-running videos we have not transcribed yet.
  const vids = db.prepare(`SELECT id, body, title FROM ads WHERE rival_id = ? AND format = 'video' AND transcript IS NULL
    ORDER BY julianday(COALESCE(CASE WHEN is_active THEN date('now') END, end_date)) - julianday(start_date) DESC LIMIT ?`).all(rival.id, TRANSCRIPTS);
  for (const v of vids) {
    try {
      const { result, meta } = await treg(`${SC}-ad-transcript`, { query: { id: v.id, cache_max_age: '30d' } });
      run.calls++; run.cost += costOf(meta);
      const t = (result?.transcript || '').trim();
      const { hook, source } = extractHook({ transcript: t, body: v.body, title: v.title });
      db.prepare('UPDATE ads SET transcript = ?, hook = COALESCE(?, hook), hook_source = COALESCE(?, hook_source), angle = ? WHERE id = ?')
        .run(t || '', hook, source, angleFor(hook, v.body, v.title), v.id);
    } catch (e) { console.warn(`  transcript ${v.id}: ${e.message}`); }
  }
}

/** Re-run hook + angle tagging on stored ads (after changing the rules in lib/classify.mjs). */
export function retag(db = getDb()) {
  const rows = db.prepare('SELECT id, transcript, body, title FROM ads').all();
  const upd = db.prepare('UPDATE ads SET hook = ?, hook_source = ?, angle = ? WHERE id = ?');
  for (const r of rows) {
    const { hook, source } = extractHook(r);
    upd.run(hook, source, angleFor(hook, r.body, r.title), r.id);
  }
  return rows.length;
}

export async function collectRival(db, rival, run) {
  const a = await pull(db, rival, run, { status: 'ACTIVE', pages: PAGES.active });
  const r = await pull(db, rival, run, { status: 'ACTIVE', sort_by: 'relevancy_monthly_grouped', pages: PAGES.recent });
  const k = await pull(db, rival, run, { status: 'INACTIVE', sort_by: 'relevancy_monthly_grouped', pages: PAGES.killed });
  if (TRANSCRIPTS > 0) await transcribe(db, rival, run);
  db.prepare("UPDATE rivals SET last_collected_at = datetime('now') WHERE id = ?").run(rival.id);
  return a + r + k;
}

export async function collectAll({ only } = {}) {
  if (!(await tregAvailable())) throw new Error('treg is not installed here, so the collector cannot reach the Ad Library.');
  const db = getDb();
  const run = { calls: 0, cost: 0, ads: 0 };
  const runId = Number(db.prepare('INSERT INTO runs (note) VALUES (?)').run(only ? `rival ${only}` : 'all').lastInsertRowid);
  const rivals = db.prepare('SELECT * FROM rivals' + (only ? ' WHERE id = ?' : '')).all(...(only ? [only] : []));
  for (const rv of rivals) {
    process.stdout.write(`• ${rv.name} … `);
    try { const n = await collectRival(db, rv, run); run.ads += n; console.log(`${n} ads`); }
    catch (e) { console.log(`failed: ${e.message}`); }
  }
  db.prepare("UPDATE runs SET finished_at = datetime('now'), calls = ?, ads_upserted = ?, cost_usd = ? WHERE id = ?").run(run.calls, run.ads, run.cost, runId);
  return run;
}

// CLI
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const db = getDb();
  const run = { calls: 0, cost: 0 };
  const seedIdx = args.indexOf('--seed');
  if (seedIdx >= 0) {
    const seed = JSON.parse(readFileSync(args[seedIdx + 1], 'utf8'));
    saveWorkspace(seed.brand, db);
    for (const name of seed.rivals) {
      const p = await findPage(name, db, run);
      addRival(p, db);
      console.log(`+ ${name} → ${p.name} (page ${p.page_id}, ${p.likes ?? '?'} likes)`);
    }
  }
  if (args.includes('--retag')) { console.log(`Retagged ${retag(db)} ads`); process.exit(0); }
  const rIdx = args.indexOf('--rival');
  let only;
  if (rIdx >= 0) { const p = await findPage(args[rIdx + 1], db, run); only = addRival(p, db).id; }
  const pIdx = args.indexOf('--page'); // --page <pageId> <display name>: when name search picks the wrong page
  if (pIdx >= 0) only = addRival({ page_id: args[pIdx + 1], name: args[pIdx + 2] || args[pIdx + 1] }, db).id;
  const res = await collectAll({ only });
  console.log(`Done: ${res.ads} ads, ${res.calls + run.calls} calls, $${(res.cost + run.cost).toFixed(3)}`);
}
