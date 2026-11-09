// SQLite store (Node's built-in node:sqlite; run node with --experimental-sqlite).
import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
export const DATA_DIR = resolve(process.env.KEEPWATCH_DATA || resolve(here, '..', 'data'));

const SCHEMA = `
CREATE TABLE IF NOT EXISTS workspace (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  brand_name TEXT, brand_domain TEXT, brand_color TEXT, brand_offer TEXT,
  brand_voice TEXT, brand_product TEXT, category TEXT, audience TEXT
);
CREATE TABLE IF NOT EXISTS rivals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL, page_id TEXT UNIQUE, domain TEXT, avatar_url TEXT,
  ig_username TEXT, likes INTEGER, page_category TEXT,
  added_at TEXT DEFAULT (datetime('now')), last_collected_at TEXT
);
CREATE TABLE IF NOT EXISTS ads (
  id TEXT PRIMARY KEY,               -- Meta ad_archive_id
  rival_id INTEGER NOT NULL REFERENCES rivals(id),
  collation_id TEXT, collation_count INTEGER,
  is_active INTEGER NOT NULL,
  start_date TEXT, end_date TEXT,    -- ISO dates from the Ad Library
  format TEXT,                       -- static | video | carousel
  display_format TEXT,               -- raw Meta value (IMAGE, VIDEO, DCO, CAROUSEL...)
  body TEXT, title TEXT, link_desc TEXT, cta TEXT, link_url TEXT,
  image_url TEXT, video_url TEXT, thumb_url TEXT,
  transcript TEXT, hook TEXT, hook_source TEXT, angle TEXT,
  first_seen_at TEXT DEFAULT (datetime('now')), last_seen_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS ads_rival ON ads(rival_id);
CREATE INDEX IF NOT EXISTS ads_active ON ads(is_active);
CREATE TABLE IF NOT EXISTS runs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  started_at TEXT DEFAULT (datetime('now')), finished_at TEXT,
  calls INTEGER DEFAULT 0, ads_upserted INTEGER DEFAULT 0, cost_usd REAL DEFAULT 0, note TEXT
);
CREATE TABLE IF NOT EXISTS rebuilds (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ad_id TEXT REFERENCES ads(id), created_at TEXT DEFAULT (datetime('now')),
  headline TEXT, why TEXT, prompt TEXT, image_path TEXT, status TEXT, cost_usd REAL DEFAULT 0,
  drop_week TEXT                      -- set when part of a Monday drop (YYYY-MM-DD of the Monday)
);
CREATE TABLE IF NOT EXISTS kv (k TEXT PRIMARY KEY, v TEXT);
CREATE TABLE IF NOT EXISTS panels (
  id INTEGER PRIMARY KEY AUTOINCREMENT, created_at TEXT DEFAULT (datetime('now')),
  ours_rebuild_id INTEGER, theirs_ad_id TEXT, result TEXT
);
`;

let db;
export function getDb(file = resolve(DATA_DIR, 'keepwatch.db')) {
  if (db) return db;
  mkdirSync(dirname(file), { recursive: true });
  db = new DatabaseSync(file);
  db.exec('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');
  db.exec(SCHEMA);
  return db;
}

export function openMemoryDb() {
  const m = new DatabaseSync(':memory:');
  m.exec(SCHEMA);
  return m;
}

export function getWorkspace(d = getDb()) {
  return d.prepare('SELECT * FROM workspace WHERE id = 1').get() || null;
}

export function saveWorkspace(w, d = getDb()) {
  const cols = ['brand_name', 'brand_domain', 'brand_color', 'brand_offer', 'brand_voice', 'brand_product', 'category', 'audience'];
  const cur = getWorkspace(d) || {};
  const row = Object.fromEntries(cols.map(c => [c, w[c] ?? cur[c] ?? null]));
  d.prepare(`INSERT INTO workspace (id, ${cols.join(',')}) VALUES (1, ${cols.map(() => '?').join(',')})
    ON CONFLICT(id) DO UPDATE SET ${cols.map(c => `${c}=excluded.${c}`).join(',')}`).run(...cols.map(c => row[c]));
  return getWorkspace(d);
}
