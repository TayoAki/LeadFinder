import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

// One SQLite file. Money is stored as integers: credits, and Treg cost in micro-USD (1e-6 $),
// exactly as Treg reports it in X-Treg-Cost-Micro, so no float rounding ever touches the ledger.
const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin','customer')),
  accepted_terms_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TEXT NOT NULL
);
-- Append-only. balance = SUM(delta). kind: grant | topup | hold | release | adjust
CREATE TABLE IF NOT EXISTS ledger (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('grant','topup','hold','release','adjust')),
  delta INTEGER NOT NULL,
  note TEXT NOT NULL,
  run_id INTEGER,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS holds (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  run_id INTEGER,
  amount INTEGER NOT NULL,
  charged INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL CHECK (status IN ('open','settled')) DEFAULT 'open',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  settled_at TEXT
);
CREATE TABLE IF NOT EXISTS businesses (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  website TEXT NOT NULL,
  sells TEXT, price_point TEXT, buyers TEXT, geography TEXT, company_size TEXT,
  crawl_json TEXT, brand_json TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS icps (
  id INTEGER PRIMARY KEY,
  business_id INTEGER NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('pending','ready','failed')) DEFAULT 'pending',
  icp_json TEXT, counts_json TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS runs (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  icp_id INTEGER REFERENCES icps(id),
  list_id INTEGER,
  kind TEXT NOT NULL CHECK (kind IN ('find','clean','lab')),
  status TEXT NOT NULL CHECK (status IN ('quoted','held','running','completed','failed','cancelled')),
  target INTEGER NOT NULL,
  want_mobile INTEGER NOT NULL DEFAULT 0,
  max_credits INTEGER NOT NULL,
  charged INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  finished_at TEXT
);
CREATE TABLE IF NOT EXISTS companies (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  domain TEXT NOT NULL, name TEXT, raw_json TEXT,
  UNIQUE (user_id, domain)
);
CREATE TABLE IF NOT EXISTS people (
  id INTEGER PRIMARY KEY,
  company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL, first_name TEXT, last_name TEXT, title TEXT, linkedin_url TEXT, raw_json TEXT
);
CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY,
  run_id INTEGER NOT NULL REFERENCES runs(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company_id INTEGER REFERENCES companies(id),
  person_id INTEGER REFERENCES people(id),
  state TEXT NOT NULL DEFAULT 'queued',
  email TEXT, email_status TEXT, email_provider TEXT,
  mobile TEXT, mobile_status TEXT,
  opening_line TEXT,
  credits INTEGER NOT NULL DEFAULT 0,
  treg_cost_micro INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS lead_attempts (
  id INTEGER PRIMARY KEY,
  lead_id INTEGER NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  step TEXT NOT NULL, provider TEXT, outcome TEXT NOT NULL, cost_micro INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
-- One row per Treg call: the operator's receipt.
CREATE TABLE IF NOT EXISTS treg_calls (
  id INTEGER PRIMARY KEY,
  user_id INTEGER,
  run_id INTEGER,
  endpoint TEXT NOT NULL,
  served_by TEXT,
  idempotency_key TEXT,
  http_status INTEGER NOT NULL,
  cost_micro INTEGER NOT NULL DEFAULT 0,
  replay INTEGER NOT NULL DEFAULT 0,
  latency_ms INTEGER NOT NULL,
  error TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS lists (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  filename TEXT NOT NULL, row_count INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS lab_runs (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL, sample_size INTEGER NOT NULL, hits INTEGER NOT NULL DEFAULT 0,
  cost_micro INTEGER NOT NULL DEFAULT 0, avg_ms INTEGER,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
-- Treg endpoints we use, with the catalog price checked when they were added.
CREATE TABLE IF NOT EXISTS price_list (
  endpoint TEXT PRIMARY KEY,
  step TEXT NOT NULL,
  usd_per_unit REAL NOT NULL,
  unit TEXT NOT NULL,
  checked_on TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS ledger_user ON ledger(user_id);
CREATE INDEX IF NOT EXISTS leads_run ON leads(run_id);
CREATE INDEX IF NOT EXISTS treg_calls_run ON treg_calls(run_id);
`;

const PRICE_LIST: [string, string, number, string][] = [
  ["anyapi.web.crawl", "read_site", 0.0045, "success"],
  ["treg.companies.enrich", "read_site", 0.0018, "success"],
  ["dropleads.companies.search.count", "counts", 0, "call"],
  ["treg.companies.search", "companies", 0, "call"],
  ["treg.people.search", "people", 0, "call"],
  ["treg.people.email.find", "email", 0.00483, "success"],
  ["treg.people.email.verify", "verify", 0, "call"],
  ["treg.people.phone.find", "mobile", 0.00483, "success"],
  ["hlrlookup.people.phone.validate", "mobile_check", 0, "call"],
];

export function openDb(file = process.env.DATABASE_PATH ?? "./data/leadfinder.db") {
  if (file !== ":memory:") fs.mkdirSync(path.dirname(file), { recursive: true });
  const db = new Database(file);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  db.exec(SCHEMA);
  const seed = db.prepare(
    "INSERT OR IGNORE INTO price_list (endpoint, step, usd_per_unit, unit, checked_on) VALUES (?, ?, ?, ?, '2026-10-14')",
  );
  for (const row of PRICE_LIST) seed.run(...row);
  return db;
}

export type DB = ReturnType<typeof openDb>;

const g = globalThis as unknown as { __leadfinderDb?: DB };
export function db(): DB {
  return (g.__leadfinderDb ??= openDb());
}
