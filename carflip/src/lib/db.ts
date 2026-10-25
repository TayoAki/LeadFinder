import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

export type DB = Database.Database;

const SCHEMA = `
CREATE TABLE IF NOT EXISTS cars (
  id TEXT PRIMARY KEY,
  source TEXT NOT NULL,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  year INTEGER, make TEXT, model TEXT, trim TEXT,
  price INTEGER NOT NULL,
  miles INTEGER,
  city TEXT, lat REAL, lng REAL,
  description TEXT NOT NULL DEFAULT '',
  photos TEXT NOT NULL DEFAULT '[]',
  dealer_score INTEGER NOT NULL DEFAULT 0,
  posted_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS valuations (
  car_id TEXT PRIMARY KEY REFERENCES cars(id) ON DELETE CASCADE,
  kbb_trim TEXT, kbb_fair INTEGER, kbb_offer INTEGER, kbb_offer_max INTEGER,
  mileage_adj INTEGER NOT NULL DEFAULT 0,
  value INTEGER NOT NULL,
  discount INTEGER NOT NULL,
  discount_pct REAL NOT NULL,
  source_url TEXT,
  valued_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS inspections (
  car_id TEXT PRIMARY KEY REFERENCES cars(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  verdict TEXT NOT NULL,
  red_flags TEXT NOT NULL DEFAULT '[]',
  positives TEXT NOT NULL DEFAULT '[]',
  recon_estimate INTEGER NOT NULL DEFAULT 0,
  method TEXT NOT NULL,
  shortlisted INTEGER NOT NULL DEFAULT 0,
  inspected_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS offers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  car_id TEXT NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
  direction TEXT NOT NULL CHECK (direction IN ('out','in')),
  amount INTEGER,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS resale (
  car_id TEXT PRIMARY KEY REFERENCES cars(id) ON DELETE CASCADE,
  buy_price INTEGER NOT NULL,
  list_price INTEGER NOT NULL,
  costs TEXT NOT NULL,
  profit INTEGER NOT NULL,
  listing TEXT NOT NULL,
  photo_plan TEXT NOT NULL,
  planned_at TEXT NOT NULL DEFAULT (datetime('now'))
);
`;

// Evidence columns added after the first release. Each is [table, column, definition]; added if missing.
const COLUMNS: Array<[string, string, string]> = [
  ["cars", "captured_at", "TEXT"],                 // when the listing was scraped
  ["cars", "source_actor", "TEXT"],                // which collector produced it
  ["cars", "seller_type", "TEXT NOT NULL DEFAULT 'private_inferred'"],
  ["valuations", "value_type", "TEXT"],            // which KBB figure "value" is
  ["valuations", "range_low", "INTEGER"],
  ["valuations", "range_high", "INTEGER"],
  ["valuations", "assumptions", "TEXT NOT NULL DEFAULT '[]'"],
  ["valuations", "conditional", "INTEGER NOT NULL DEFAULT 1"],
  ["valuations", "captured_at", "TEXT"],
  ["inspections", "photo_count_available", "INTEGER NOT NULL DEFAULT 0"],
  ["inspections", "photo_count_reviewed", "INTEGER NOT NULL DEFAULT 0"],
  ["inspections", "description_reviewed", "INTEGER NOT NULL DEFAULT 0"],
  ["inspections", "photo_review_complete", "INTEGER NOT NULL DEFAULT 0"],
  ["inspections", "evidence", "TEXT NOT NULL DEFAULT '[]'"],
  ["inspections", "repair_estimate", "INTEGER"],    // only when supplied; never invented
  ["inspections", "corrections", "TEXT NOT NULL DEFAULT '[]'"],
  ["resale", "scenarios", "TEXT NOT NULL DEFAULT '[]'"],
  ["resale", "unprovided_costs", "TEXT NOT NULL DEFAULT '[]'"],
  ["resale", "assumptions", "TEXT NOT NULL DEFAULT '[]'"],
];

const RUNS = `
CREATE TABLE IF NOT EXISTS runs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  step TEXT NOT NULL,
  source TEXT,
  params TEXT NOT NULL DEFAULT '{}',
  report TEXT NOT NULL DEFAULT '{}',
  started_at TEXT NOT NULL,
  finished_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS repair_estimates (
  car_id TEXT PRIMARY KEY REFERENCES cars(id) ON DELETE CASCADE,
  low INTEGER NOT NULL,
  high INTEGER NOT NULL,
  items TEXT NOT NULL DEFAULT '[]',        -- [{item, low, high, basis}]; every item cites the evidence behind it
  not_assessed TEXT NOT NULL DEFAULT '[]', -- things the evidence can't show, listed rather than priced
  method TEXT NOT NULL,                    -- ai | agent | manual
  model TEXT,
  assumptions TEXT NOT NULL DEFAULT '[]',
  estimated_at TEXT NOT NULL DEFAULT (datetime('now'))
);`;

function migrate(db: DB) {
  db.exec(RUNS);
  for (const [table, col, def] of COLUMNS) {
    const have = (db.prepare(`PRAGMA table_info(${table})`).all() as Array<{ name: string }>).some((c) => c.name === col);
    if (!have) db.exec(`ALTER TABLE ${table} ADD COLUMN ${col} ${def}`);
  }
}

/** Record what a step did, where its data came from and when: the run log behind every result. */
export function logRun(db: DB, step: string, startedAt: string, o: { source?: string; params?: unknown; report?: unknown }) {
  db.prepare("INSERT INTO runs (step, source, params, report, started_at) VALUES (?,?,?,?,?)")
    .run(step, o.source ?? null, JSON.stringify(o.params ?? {}), JSON.stringify(o.report ?? {}), startedAt);
}

export const now = () => new Date().toISOString();

let shared: DB | undefined;

/** Open (and migrate) a database. With no path, uses CARFLIP_DB or ./data/carflip.db, shared per process. */
export function openDb(file?: string): DB {
  if (!file && shared) return shared;
  const target = file ?? process.env.CARFLIP_DB ?? path.join(process.cwd(), "data", "carflip.db");
  if (target !== ":memory:") fs.mkdirSync(path.dirname(target), { recursive: true });
  const db = new Database(target);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  db.exec(SCHEMA);
  migrate(db);
  if (!file) shared = db;
  return db;
}

export const json = <T>(s: string | null | undefined, fallback: T): T => {
  try { return s ? (JSON.parse(s) as T) : fallback; } catch { return fallback; }
};
