// SQLite store (Node's built-in node:sqlite; run node with --experimental-sqlite).
// Ad data is shared across all customers (rivals are public advertisers, fetched once);
// everything a customer creates is scoped to their workspace.
import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
export const DATA_DIR = resolve(process.env.KEEPWATCH_DATA || resolve(here, '..', 'data'));

const SCHEMA = `
CREATE TABLE IF NOT EXISTS workspaces (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT UNIQUE NOT NULL,              -- Better Auth user id
  brand_name TEXT, brand_domain TEXT, brand_color TEXT, brand_offer TEXT,
  brand_voice TEXT, brand_product TEXT, category TEXT, audience TEXT,
  plan TEXT NOT NULL DEFAULT 'free',          -- billing hook for Stripe later
  api_key TEXT UNIQUE,                        -- bearer token for the MCP endpoint
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS rivals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL, page_id TEXT UNIQUE, domain TEXT, avatar_url TEXT,
  ig_username TEXT, likes INTEGER, page_category TEXT,
  added_at TEXT DEFAULT (datetime('now')), last_collected_at TEXT
);
CREATE TABLE IF NOT EXISTS workspace_rivals (
  workspace_id INTEGER NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  rival_id INTEGER NOT NULL REFERENCES rivals(id),
  added_at TEXT DEFAULT (datetime('now')),
  PRIMARY KEY (workspace_id, rival_id)
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
  workspace_id INTEGER REFERENCES workspaces(id) ON DELETE CASCADE,
  ad_id TEXT REFERENCES ads(id), created_at TEXT DEFAULT (datetime('now')),
  headline TEXT, why TEXT, prompt TEXT, image_path TEXT, status TEXT, cost_usd REAL DEFAULT 0,
  drop_week TEXT                      -- set when part of a Monday drop (YYYY-MM-DD of the Monday)
);
CREATE TABLE IF NOT EXISTS kv (k TEXT PRIMARY KEY, v TEXT);
CREATE TABLE IF NOT EXISTS panels (
  id INTEGER PRIMARY KEY AUTOINCREMENT, created_at TEXT DEFAULT (datetime('now')),
  workspace_id INTEGER REFERENCES workspaces(id) ON DELETE CASCADE,
  ours_rebuild_id INTEGER, theirs_ad_id TEXT, result TEXT
);
`;

// Columns added after the first version: add them to older databases in place.
const ADDED_COLUMNS = [['rebuilds', 'workspace_id', 'INTEGER'], ['panels', 'workspace_id', 'INTEGER']];

let db;
export function getDb(file = resolve(DATA_DIR, 'keepwatch.db')) {
  if (db) return db;
  mkdirSync(dirname(file), { recursive: true });
  db = new DatabaseSync(file);
  db.exec('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 5000;');
  db.exec(SCHEMA);
  for (const [t, c, type] of ADDED_COLUMNS) {
    const cols = db.prepare(`PRAGMA table_info(${t})`).all().map(r => r.name);
    if (!cols.includes(c)) db.exec(`ALTER TABLE ${t} ADD COLUMN ${c} ${type}`);
  }
  return db;
}

export function openMemoryDb() {
  const m = new DatabaseSync(':memory:');
  m.exec(SCHEMA);
  return m;
}

const BRAND_COLS = ['brand_name', 'brand_domain', 'brand_color', 'brand_offer', 'brand_voice', 'brand_product', 'category', 'audience'];

/** The signed-in user's workspace, created on first use. */
export function workspaceForUser(userId, d = getDb()) {
  let ws = d.prepare('SELECT * FROM workspaces WHERE user_id = ?').get(userId);
  if (!ws) {
    d.prepare('INSERT INTO workspaces (user_id, api_key, brand_color) VALUES (?, ?, ?)').run(userId, `kw_${randomBytes(24).toString('hex')}`, '#c8553d');
    ws = d.prepare('SELECT * FROM workspaces WHERE user_id = ?').get(userId);
  }
  return ws;
}

export const workspaceByKey = (key, d = getDb()) => (key ? d.prepare('SELECT * FROM workspaces WHERE api_key = ?').get(key) : null);
export const getWorkspace = (id, d = getDb()) => d.prepare('SELECT * FROM workspaces WHERE id = ?').get(id) || null;

export function saveWorkspace(id, w, d = getDb()) {
  const cur = getWorkspace(id, d);
  const vals = BRAND_COLS.map(c => (w[c] !== undefined ? String(w[c]).slice(0, 2000) : cur[c]));
  d.prepare(`UPDATE workspaces SET ${BRAND_COLS.map(c => `${c} = ?`).join(', ')} WHERE id = ?`).run(...vals, id);
  return getWorkspace(id, d);
}

export function rotateApiKey(id, d = getDb()) {
  d.prepare('UPDATE workspaces SET api_key = ? WHERE id = ?').run(`kw_${randomBytes(24).toString('hex')}`, id);
  return getWorkspace(id, d);
}

/** Ids of the rivals a workspace tracks. */
export const rivalIdsFor = (wsId, d = getDb()) => d.prepare('SELECT rival_id FROM workspace_rivals WHERE workspace_id = ?').all(wsId).map(r => r.rival_id);
export const trackRival = (wsId, rivalId, d = getDb()) => d.prepare('INSERT OR IGNORE INTO workspace_rivals (workspace_id, rival_id) VALUES (?, ?)').run(wsId, rivalId);
export const untrackRival = (wsId, rivalId, d = getDb()) => d.prepare('DELETE FROM workspace_rivals WHERE workspace_id = ? AND rival_id = ?').run(wsId, rivalId);
