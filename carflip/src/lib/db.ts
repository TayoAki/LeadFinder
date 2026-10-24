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
  if (!file) shared = db;
  return db;
}

export const json = <T>(s: string | null | undefined, fallback: T): T => {
  try { return s ? (JSON.parse(s) as T) : fallback; } catch { return fallback; }
};
