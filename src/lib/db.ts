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
-- Stripe Checkout top-ups. A session grants its credits once, when Stripe says it's paid.
CREATE TABLE IF NOT EXISTS payments (
  stripe_session_id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  pack_id TEXT NOT NULL,
  credits INTEGER NOT NULL,
  amount_cents INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending','paid','mismatch')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT
);
-- Provider lab: one email provider on a sample of people the waterfall already processed.
CREATE TABLE IF NOT EXISTS lab_tests (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  sample_size INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('running','completed','failed')) DEFAULT 'running',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  finished_at TEXT
);
CREATE TABLE IF NOT EXISTS lab_results (
  id INTEGER PRIMARY KEY,
  test_id INTEGER NOT NULL REFERENCES lab_tests(id) ON DELETE CASCADE,
  lead_id INTEGER NOT NULL,
  outcome TEXT NOT NULL CHECK (outcome IN ('hit','miss','error','not_tried')),
  email TEXT,
  served_by TEXT,
  cost_micro INTEGER NOT NULL DEFAULT 0,
  latency_ms INTEGER NOT NULL DEFAULT 0,
  waterfall_email TEXT,
  waterfall_cost_micro INTEGER NOT NULL DEFAULT 0,
  note TEXT
);
-- Unused since the provider lab moved to lab_tests; kept so older databases still open.
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
-- ---------- Acquisition CRM: businesses to buy, the deal on each, and the work around it ----------
-- One row per business an account is tracking. source: 'sba_import' | 'maps' | 'manual'.
CREATE TABLE IF NOT EXISTS businesses_crm (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  source TEXT NOT NULL,
  external_id TEXT NOT NULL,
  name TEXT NOT NULL,
  industry TEXT, address TEXT, city TEXT, state TEXT, zip TEXT, metro TEXT,
  website TEXT, phone TEXT, rating REAL, reviews INTEGER, maps_url TEXT,
  owner_name TEXT, owner_title TEXT, owner_email TEXT, email_status TEXT, email_provider TEXT,
  age_years REAL, reg_date TEXT, est_payroll INTEGER, rev_lo INTEGER, rev_hi INTEGER, ebitda_lo INTEGER, ebitda_hi INTEGER,
  role TEXT, tier TEXT, score REAL, fit_met TEXT, fit_missed TEXT, why TEXT, watch TEXT, family_run INTEGER,
  raw_json TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (user_id, source, external_id)
);
-- The deal on a business: where it is in the pipeline and who owns the next step.
CREATE TABLE IF NOT EXISTS deals (
  business_id INTEGER PRIMARY KEY REFERENCES businesses_crm(id) ON DELETE CASCADE,
  stage TEXT NOT NULL DEFAULT 'identified',
  assignee TEXT, next_step TEXT, due_date TEXT,
  cadence_started_at TEXT,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS deal_tasks (
  id INTEGER PRIMARY KEY,
  business_id INTEGER NOT NULL REFERENCES businesses_crm(id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('cadence','manual')),
  channel TEXT, title TEXT NOT NULL, due_date TEXT, done_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
-- Append-only timeline: notes, stage changes, calls, emails, letters, imports, enrichment.
CREATE TABLE IF NOT EXISTS deal_activity (
  id INTEGER PRIMARY KEY,
  business_id INTEGER NOT NULL REFERENCES businesses_crm(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  kind TEXT NOT NULL, body TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS dd_items (
  business_id INTEGER NOT NULL REFERENCES businesses_crm(id) ON DELETE CASCADE,
  item_key TEXT NOT NULL,
  done INTEGER NOT NULL DEFAULT 0,
  note TEXT,
  updated_at TEXT,
  PRIMARY KEY (business_id, item_key)
);
-- Each account's buy box (what they'll buy), stored as JSON.
CREATE TABLE IF NOT EXISTS buy_boxes (
  user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  json TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
-- ---------- Shared business directory: the SBA Search CSVs, uploaded by an admin, searchable by every account ----------
CREATE TABLE IF NOT EXISTS directory (
  id INTEGER PRIMARY KEY,
  external_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL, naics TEXT, industry TEXT,
  address TEXT, city TEXT, state TEXT, zip TEXT, county TEXT, metro TEXT,
  owner_name TEXT, owner_title TEXT, officers TEXT, family_run INTEGER NOT NULL DEFAULT 0,
  age_years REAL, reg_date TEXT, est_payroll INTEGER, rev_lo INTEGER, rev_hi INTEGER, ebitda_lo INTEGER, ebitda_hi INTEGER,
  jobs INTEGER, plan_participants INTEGER, role TEXT, business_model TEXT, ppp_clean INTEGER,
  source_tier TEXT, source_score REAL, source_notes TEXT, watch_outs TEXT,
  dataset TEXT NOT NULL, raw_json TEXT,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS dir_naics ON directory(naics, state);
CREATE INDEX IF NOT EXISTS dir_ebitda ON directory(ebitda_hi);
CREATE TABLE IF NOT EXISTS directory_uploads (
  id INTEGER PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  filename TEXT NOT NULL, rows_added INTEGER NOT NULL, rows_updated INTEGER NOT NULL, rows_skipped INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
-- AI match scores, per account and per version of that account's buy box (profile_hash).
CREATE TABLE IF NOT EXISTS directory_scores (
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  directory_id INTEGER NOT NULL REFERENCES directory(id) ON DELETE CASCADE,
  profile_hash TEXT NOT NULL,
  score INTEGER NOT NULL, reason TEXT NOT NULL, flags TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (user_id, directory_id, profile_hash)
);
CREATE INDEX IF NOT EXISTS biz_user ON businesses_crm(user_id);
CREATE INDEX IF NOT EXISTS tasks_due ON deal_tasks(business_id, done_at, due_date);
CREATE INDEX IF NOT EXISTS activity_biz ON deal_activity(business_id);
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
  ["treg.people.email.verify", "verify", 0.0006, "call"], // catalog says free; live calls (14 Oct 2026) billed $0.0006 each
  ["treg.people.phone.find", "mobile", 0.00483, "success"],
  ["hlrlookup.people.phone.validate", "mobile_check", 0, "call"],
  ["crawl4ai.google.serp.maps", "business_search", 0.00015, "success"],
];

export function openDb(file = process.env.DATABASE_PATH ?? "./data/leadfinder.db") {
  if (file !== ":memory:") fs.mkdirSync(path.dirname(file), { recursive: true });
  const db = new Database(file);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  db.exec(SCHEMA);
  const seed = db.prepare(
    `INSERT INTO price_list (endpoint, step, usd_per_unit, unit, checked_on) VALUES (?, ?, ?, ?, '2026-10-14')
     ON CONFLICT(endpoint) DO UPDATE SET usd_per_unit = excluded.usd_per_unit, step = excluded.step, unit = excluded.unit`,
  );
  for (const row of PRICE_LIST) seed.run(...row);
  return db;
}

export type DB = ReturnType<typeof openDb>;

const g = globalThis as unknown as { __leadfinderDb?: DB };
export function db(): DB {
  return (g.__leadfinderDb ??= openDb());
}
