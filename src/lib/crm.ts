import { fromSponsorRow } from "./directory.ts";
import type { DB } from "./db.ts";
import { parseCsv } from "./lists.ts";
import { domainFromUrl } from "./normalize.ts";

// ---------- Pipeline ----------

export { STAGES, isStage, type Stage } from "./stages.ts";
import { isStage, STAGES, type Stage } from "./stages.ts";

// ---------- Outreach cadence: about four weeks per owner ----------

export const CADENCE = [
  { day: 0, channel: "letter", title: "Send a personal, signed letter" },
  { day: 7, channel: "call", title: "Call the business line and ask for the owner by name" },
  { day: 10, channel: "email", title: "Short email referencing the letter" },
  { day: 21, channel: "call", title: "Second call" },
  { day: 30, channel: "email", title: "Warm close: check back in six months" },
] as const;

// ---------- Due-diligence checklist ----------

export const DD_SECTIONS: { id: string; label: string; items: [string, string][] }[] = [
  { id: "financial", label: "Financial", items: [
    ["tax_vs_pl", "Tax returns match the P&Ls; bank deposits match reported revenue"],
    ["revenue_mix", "Revenue by month, by customer and by job type"],
    ["margins", "Gross margin by job type; labour as % of revenue"],
    ["addbacks", "Every add-back backed by receipts"],
    ["receivables", "Receivables aging, bad debt, prepaid maintenance owed back"],
    ["liabilities", "Payables, debts, UCC lien search, equipment loans"],
    ["taxes_current", "Payroll and sales tax current; no tax liens"],
    ["capex", "Trucks and equipment due for replacement"],
    ["working_capital", "Working capital through the slow season"],
  ] },
  { id: "customers", label: "Customers and revenue quality", items: [
    ["maintenance", "Maintenance agreements: count, renewal rate, price"],
    ["repeat", "Repeat customer rate; top 20 customers and tenure"],
    ["contracts", "Builder or GC relationships: written or handshake"],
    ["reputation", "Review rating trend, complaints, warranty callbacks"],
    ["lead_sources", "Lead sources, marketing spend, booking rate, average ticket"],
  ] },
  { id: "people", label: "People", items: [
    ["org_chart", "Org chart and who is essential"],
    ["pay", "Pay versus local market; benefits; overtime"],
    ["classification", "Employees versus 1099 contractors"],
    ["retention", "Key people likely to stay; met before close"],
    ["safety", "Workers' comp history and safety record"],
  ] },
  { id: "licenses", label: "Licenses and compliance", items: [
    ["trade_license", "Trade licenses: who holds them and the transition plan"],
    ["certifications", "Technician certifications (e.g. refrigerant handling)"],
    ["permits", "Open permits, code violations"],
    ["vehicles", "Vehicle registrations and any DOT requirements"],
  ] },
  { id: "legal", label: "Legal", items: [
    ["entity", "Entity documents, ownership, authority to sell"],
    ["contracts_transfer", "Customer, supplier and maintenance contracts transfer"],
    ["lease", "Lease assignable, or real estate handled separately"],
    ["litigation", "Lawsuits, warranty and insurance claims"],
    ["insurance", "Insurance in place and quotes for after close"],
    ["ip", "Name, phone numbers, domain, Google Business Profile owned"],
  ] },
  { id: "operations", label: "Operations", items: [
    ["fleet", "Fleet and equipment condition"],
    ["software", "Dispatch, CRM and accounting software; who owns the data"],
    ["suppliers", "Supplier terms, rebates, inventory"],
    ["owner_calendar", "The owner's weekly calendar and who takes it over"],
  ] },
];
export const DD_ITEM_COUNT = DD_SECTIONS.reduce((n, s) => n + s.items.length, 0);

// ---------- Buy box ----------

export interface BuyBox {
  onboarded: boolean;
  naics: string[]; // industries from the directory the buyer wants
  states: string[];
  metro: string; // free text matched against the metro name, e.g. "Dallas"
  familyOnly: boolean;
  priorities: string[]; // what matters, e.g. "Owner nearing retirement"
  thesis: string;
  industries: string;
  geography: string;
  minAgeYears: number;
  ebitdaMin: number;
  ebitdaMax: number;
  priceMultiple: string;
  structure: string;
  dealBreakers: string;
}

export const DEFAULT_BUY_BOX: BuyBox = {
  onboarded: false,
  naics: [],
  states: [],
  metro: "",
  familyOnly: false,
  priorities: [],
  thesis: "",
  industries: "Residential HVAC, plumbing, electrical service",
  geography: "",
  minAgeYears: 20,
  ebitdaMin: 500_000,
  ebitdaMax: 3_000_000,
  priceMultiple: "3–6× EBITDA",
  structure: "SBA 7(a) + seller note + equity",
  dealBreakers: "Customer concentration over 20%; license holder won't stay; declining revenue",
};

export function getBuyBox(db: DB, userId: number): BuyBox {
  const row = db.prepare("SELECT json FROM buy_boxes WHERE user_id = ?").get(userId) as { json: string } | undefined;
  return row ? { ...DEFAULT_BUY_BOX, ...(JSON.parse(row.json) as Partial<BuyBox>) } : DEFAULT_BUY_BOX;
}

export function saveBuyBox(db: DB, userId: number, input: Partial<BuyBox>) {
  const num = (v: unknown, d: number) => (Number.isFinite(Number(v)) && Number(v) >= 0 ? Math.round(Number(v)) : d);
  const str = (v: unknown, d: string) => (typeof v === "string" ? v.slice(0, 500) : d);
  const list = (v: unknown, d: string[]) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string").map((x) => x.slice(0, 80)).slice(0, 20) : d);
  const prev = getBuyBox(db, userId);
  const box: BuyBox = {
    onboarded: input.onboarded === true || prev.onboarded,
    naics: list(input.naics, prev.naics).filter((x) => /^\d{4,6}$/.test(x)),
    states: list(input.states, prev.states).filter((x) => /^[A-Z]{2}$/.test(x)),
    metro: str(input.metro, prev.metro).slice(0, 80),
    familyOnly: typeof input.familyOnly === "boolean" ? input.familyOnly : prev.familyOnly,
    priorities: list(input.priorities, prev.priorities),
    thesis: str(input.thesis, prev.thesis).slice(0, 2000),
    industries: str(input.industries, prev.industries),
    geography: str(input.geography, prev.geography),
    minAgeYears: num(input.minAgeYears, prev.minAgeYears),
    ebitdaMin: num(input.ebitdaMin, prev.ebitdaMin),
    ebitdaMax: num(input.ebitdaMax, prev.ebitdaMax),
    priceMultiple: str(input.priceMultiple, prev.priceMultiple),
    structure: str(input.structure, prev.structure),
    dealBreakers: str(input.dealBreakers, prev.dealBreakers),
  };
  db.prepare(
    "INSERT INTO buy_boxes (user_id, json) VALUES (?, ?) ON CONFLICT(user_id) DO UPDATE SET json = excluded.json, updated_at = datetime('now')",
  ).run(userId, JSON.stringify(box));
  return box;
}

// ---------- Businesses ----------

export interface BusinessInput {
  source: "sba_import" | "maps" | "manual" | "directory";
  externalId: string;
  name: string;
  industry?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  metro?: string | null;
  website?: string | null;
  phone?: string | null;
  rating?: number | null;
  reviews?: number | null;
  mapsUrl?: string | null;
  ownerName?: string | null;
  ownerTitle?: string | null;
  ownerEmail?: string | null;
  emailStatus?: string | null;
  ageYears?: number | null;
  regDate?: string | null;
  estPayroll?: number | null;
  revLo?: number | null;
  revHi?: number | null;
  ebitdaLo?: number | null;
  ebitdaHi?: number | null;
  role?: string | null;
  tier?: string | null;
  score?: number | null;
  fitMet?: string[] | null;
  fitMissed?: string[] | null;
  why?: string | null;
  watch?: string | null;
  familyRun?: boolean | null;
  raw?: unknown;
}

const COLS: [keyof BusinessInput, string][] = [
  ["name", "name"], ["industry", "industry"], ["address", "address"], ["city", "city"], ["state", "state"], ["zip", "zip"],
  ["metro", "metro"], ["website", "website"], ["phone", "phone"], ["rating", "rating"], ["reviews", "reviews"], ["mapsUrl", "maps_url"],
  ["ownerName", "owner_name"], ["ownerTitle", "owner_title"], ["ownerEmail", "owner_email"], ["emailStatus", "email_status"],
  ["ageYears", "age_years"], ["regDate", "reg_date"], ["estPayroll", "est_payroll"], ["revLo", "rev_lo"], ["revHi", "rev_hi"],
  ["ebitdaLo", "ebitda_lo"], ["ebitdaHi", "ebitda_hi"], ["role", "role"], ["tier", "tier"], ["score", "score"],
  ["fitMet", "fit_met"], ["fitMissed", "fit_missed"], ["why", "why"], ["watch", "watch"], ["familyRun", "family_run"], ["raw", "raw_json"],
];

const toDb = (k: keyof BusinessInput, v: unknown) => {
  if (v === undefined || v === null || v === "") return null;
  if (k === "fitMet" || k === "fitMissed" || k === "raw") return JSON.stringify(v);
  if (k === "familyRun") return v ? 1 : 0;
  return v as string | number;
};

/**
 * Add or refresh a business. Re-importing the same lead updates its data but never touches the deal,
 * tasks, notes or checklist the team has built up. Returns the id and whether it was new.
 */
export function upsertBusiness(db: DB, userId: number, b: BusinessInput): { id: number; created: boolean } {
  return db.transaction(() => {
    const existing = db.prepare("SELECT id FROM businesses_crm WHERE user_id = ? AND source = ? AND external_id = ?").get(userId, b.source, b.externalId) as
      | { id: number }
      | undefined;
    const present = COLS.filter(([k]) => b[k] !== undefined);
    if (existing) {
      if (present.length) {
        db.prepare(`UPDATE businesses_crm SET ${present.map(([, c]) => `${c} = ?`).join(", ")} WHERE id = ?`).run(
          ...present.map(([k]) => toDb(k, b[k])), existing.id,
        );
      }
      return { id: existing.id, created: false };
    }
    const id = Number(
      db.prepare(
        `INSERT INTO businesses_crm (user_id, source, external_id, ${present.map(([, c]) => c).join(", ")})
         VALUES (?, ?, ?, ${present.map(() => "?").join(", ")})`,
      ).run(userId, b.source, b.externalId, ...present.map(([k]) => toDb(k, b[k]))).lastInsertRowid,
    );
    db.prepare("INSERT INTO deals (business_id) VALUES (?)").run(id);
    return { id, created: true };
  })();
}

export function ownsBusiness(db: DB, userId: number, businessId: number) {
  return Boolean(db.prepare("SELECT 1 FROM businesses_crm WHERE id = ? AND user_id = ?").get(businessId, userId));
}

export function logActivity(db: DB, businessId: number, userId: number | null, kind: string, body: string) {
  db.prepare("INSERT INTO deal_activity (business_id, user_id, kind, body) VALUES (?, ?, ?, ?)").run(businessId, userId, kind, body.slice(0, 4000));
}

// ---------- Importing SBA Search output ----------

const num = (v: unknown) => {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(String(v).replace(/[$,]/g, ""));
  return Number.isFinite(n) ? n : null;
};
const str = (v: unknown) => (v === null || v === undefined || String(v).trim() === "" ? null : String(v).trim());
const list = (v: unknown) => (Array.isArray(v) ? v.map(String) : typeof v === "string" && v ? v.split(/;|\|/).map((s) => s.trim()).filter(Boolean) : null);

/** One lead from SBA Search's leads.json (the documented UI contract). */
export function fromLeadsJson(l: Record<string, unknown>): BusinessInput | null {
  const name = str(l.co);
  if (!name || !str(l.id)) return null;
  return {
    source: "sba_import",
    externalId: String(l.id),
    name,
    industry: str(l.seg),
    address: str(l.addr),
    city: str(l.city),
    state: str(l.state) ?? "TX",
    zip: str(l.zip),
    metro: str(l.metro),
    website: str(l.website),
    phone: str(l.phone),
    rating: num(l.rating),
    reviews: num(l.reviews),
    mapsUrl: str(l.maps_url),
    ownerName: str(l.owner),
    ownerTitle: str(l.title),
    ownerEmail: str(l.email),
    emailStatus: l.email ? (l.email_verified ? "verified" : "unverified") : null,
    ageYears: num(l.age),
    regDate: str(l.reg),
    estPayroll: num(l.pay),
    revLo: num(l.revLo),
    revHi: num(l.revHi),
    ebitdaLo: num(l.ebLo),
    ebitdaHi: num(l.ebHi),
    role: str(l.role),
    tier: str(l.tier),
    score: num(l.score),
    fitMet: list(l.met),
    fitMissed: list(l.missed),
    why: str(l.why) ?? str(l.hl),
    watch: str(l.watch),
    familyRun: Boolean(l.fam || l.famOff || l.gen),
    raw: l,
  };
}

/** One row from sponsor.py's CSV (sponsor_leads_<state>_<segment>.csv), using the columns it really writes. */
export function fromSponsorCsv(r: Record<string, string>): BusinessInput | null {
  const d = fromSponsorRow(r, "TX");
  if (!d) return null;
  return {
    source: "sba_import", externalId: d.externalId, name: d.name, industry: d.industry, address: d.address, city: d.city, state: d.state,
    zip: d.zip, metro: d.metro, ownerName: d.ownerName, ownerTitle: d.ownerTitle, ageYears: d.ageYears, regDate: d.regDate,
    estPayroll: d.estPayroll, revLo: d.revLo, revHi: d.revHi, ebitdaLo: d.ebitdaLo, ebitdaHi: d.ebitdaHi, role: d.role,
    tier: d.sourceTier, score: d.sourceScore, why: r.fit_rationale || d.sourceNotes, watch: d.watchOuts, familyRun: d.familyRun, raw: r,
  };
}

/** contacts.csv from enrich_contacts.py: adds website, phone and owner email to leads already imported. */
export function contactsPatch(r: Record<string, string>): Partial<BusinessInput> & { externalId: string } | null {
  const id = str(r.id);
  if (!id) return null;
  return {
    externalId: id,
    website: str(r.website),
    phone: str(r.phone),
    rating: num(r.rating),
    reviews: num(r.reviews),
    mapsUrl: str(r.maps_url),
    ownerEmail: str(r.email),
    emailStatus: r.email ? (String(r.email_verified).toLowerCase() === "true" ? "verified" : "unverified") : null,
    emailProvider: str(r.email_source),
  } as Partial<BusinessInput> & { externalId: string };
}

export interface ImportResult {
  kind: "leads_json" | "sponsor_csv" | "contacts_csv";
  created: number;
  updated: number;
  skipped: number;
}

export const MAX_IMPORT_BYTES = 25_000_000;

/** Detect which SBA Search file this is and import it. */
export function importSbaFile(db: DB, userId: number, filename: string, text: string): ImportResult {
  if (text.length > MAX_IMPORT_BYTES) throw new Error("That file is over 25 MB");
  let rows: BusinessInput[] = [];
  let skipped = 0;
  const trimmed = text.trimStart();
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    const doc = JSON.parse(text) as { leads?: Record<string, unknown>[] } | Record<string, unknown>[];
    const leads = Array.isArray(doc) ? doc : doc.leads;
    if (!Array.isArray(leads)) throw new Error("No leads array in this JSON file");
    for (const l of leads) {
      const b = fromLeadsJson(l);
      if (b) rows.push(b);
      else skipped++;
    }
    return applyImport(db, userId, filename, "leads_json", rows, skipped);
  }
  const [header, ...body] = parseCsv(text);
  if (!header) throw new Error("The file is empty");
  const records = body.map((cells) => Object.fromEntries(header.map((h, i) => [h.trim(), cells[i] ?? ""])));
  if (header.includes("company") && (header.includes("state_entity_id") || header.includes("likely_owner"))) {
    for (const r of records) {
      const b = fromSponsorCsv(r);
      if (b) rows.push(b);
      else skipped++;
    }
    return applyImport(db, userId, filename, "sponsor_csv", rows, skipped);
  }
  if (header.includes("id") && (header.includes("email") || header.includes("website"))) {
    let updated = 0;
    db.transaction(() => {
      for (const r of records) {
        const p = contactsPatch(r);
        const row = p && (db.prepare("SELECT id FROM businesses_crm WHERE user_id = ? AND source = 'sba_import' AND external_id = ?").get(userId, p.externalId) as
          | { id: number }
          | undefined);
        if (!p || !row) {
          skipped++;
          continue;
        }
        const { externalId: _, ...patch } = p as Record<string, unknown>;
        const sets = Object.entries({
          website: patch.website, phone: patch.phone, rating: patch.rating, reviews: patch.reviews, maps_url: patch.mapsUrl,
          owner_email: patch.ownerEmail, email_status: patch.emailStatus, email_provider: patch.emailProvider,
        }).filter(([, v]) => v !== null && v !== undefined);
        if (!sets.length) continue;
        db.prepare(`UPDATE businesses_crm SET ${sets.map(([c]) => `${c} = ?`).join(", ")} WHERE id = ?`).run(...sets.map(([, v]) => v as string | number), row.id);
        logActivity(db, row.id, userId, "enrich", `Contact details imported from ${filename}`);
        updated++;
      }
    })();
    return { kind: "contacts_csv", created: 0, updated, skipped };
  }
  throw new Error("This doesn't look like an SBA Search file: expected leads.json, a sponsor_leads CSV, or contacts.csv");
}

function applyImport(db: DB, userId: number, filename: string, kind: ImportResult["kind"], rows: BusinessInput[], skipped: number): ImportResult {
  let created = 0;
  let updated = 0;
  db.transaction(() => {
    for (const b of rows) {
      const r = upsertBusiness(db, userId, b);
      if (r.created) {
        created++;
        logActivity(db, r.id, userId, "import", `Imported from ${filename}`);
      } else updated++;
    }
  })();
  return { kind, created, updated, skipped };
}

// ---------- Deal actions ----------

export function setStage(db: DB, userId: number, businessId: number, stage: Stage) {
  const cur = db.prepare("SELECT stage FROM deals WHERE business_id = ?").get(businessId) as { stage: string } | undefined;
  if (!cur || cur.stage === stage) return;
  db.prepare("UPDATE deals SET stage = ?, updated_at = datetime('now') WHERE business_id = ?").run(stage, businessId);
  const label = (s: string) => STAGES.find((x) => x.id === s)?.label ?? s;
  logActivity(db, businessId, userId, "stage", `Moved from ${label(cur.stage)} to ${label(stage)}`);
}

export function updateDeal(db: DB, userId: number, businessId: number, patch: { assignee?: string; nextStep?: string; dueDate?: string | null }) {
  const sets: [string, string | null][] = [];
  if (patch.assignee !== undefined) sets.push(["assignee", patch.assignee.slice(0, 100) || null]);
  if (patch.nextStep !== undefined) sets.push(["next_step", patch.nextStep.slice(0, 300) || null]);
  if (patch.dueDate !== undefined) sets.push(["due_date", patch.dueDate && /^\d{4}-\d{2}-\d{2}$/.test(patch.dueDate) ? patch.dueDate : null]);
  if (!sets.length) return;
  db.prepare(`UPDATE deals SET ${sets.map(([c]) => `${c} = ?`).join(", ")}, updated_at = datetime('now') WHERE business_id = ?`).run(...sets.map(([, v]) => v), businessId);
}

const addDays = (iso: string, days: number) => {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
};
export const today = () => new Date().toISOString().slice(0, 10);

/** Schedule the outreach cadence from a start date. Starting it twice does nothing. */
export function startCadence(db: DB, userId: number, businessId: number, start = today()) {
  return db.transaction(() => {
    const d = db.prepare("SELECT cadence_started_at, stage FROM deals WHERE business_id = ?").get(businessId) as { cadence_started_at: string | null; stage: string };
    if (d.cadence_started_at) return false;
    const ins = db.prepare("INSERT INTO deal_tasks (business_id, kind, channel, title, due_date) VALUES (?, 'cadence', ?, ?, ?)");
    for (const step of CADENCE) ins.run(businessId, step.channel, step.title, addDays(start, step.day));
    db.prepare("UPDATE deals SET cadence_started_at = ?, updated_at = datetime('now') WHERE business_id = ?").run(start, businessId);
    logActivity(db, businessId, userId, "cadence", `Outreach cadence started (${CADENCE.length} steps over ${CADENCE.at(-1)!.day} days)`);
    if (d.stage === "identified") setStage(db, userId, businessId, "contacted");
    return true;
  })();
}

export function addTask(db: DB, userId: number, businessId: number, title: string, dueDate: string | null) {
  const t = title.trim().slice(0, 300);
  if (!t) throw new Error("Give the task a title");
  db.prepare("INSERT INTO deal_tasks (business_id, kind, title, due_date) VALUES (?, 'manual', ?, ?)").run(
    businessId, t, dueDate && /^\d{4}-\d{2}-\d{2}$/.test(dueDate) ? dueDate : null,
  );
  logActivity(db, businessId, userId, "task", `Task added: ${t}`);
}

export function completeTask(db: DB, userId: number, taskId: number, done: boolean) {
  const t = db
    .prepare("SELECT t.id, t.business_id, t.title, t.channel FROM deal_tasks t JOIN businesses_crm b ON b.id = t.business_id WHERE t.id = ? AND b.user_id = ?")
    .get(taskId, userId) as { id: number; business_id: number; title: string; channel: string | null } | undefined;
  if (!t) throw new Error("Task not found");
  db.prepare("UPDATE deal_tasks SET done_at = ? WHERE id = ?").run(done ? new Date().toISOString() : null, taskId);
  if (done) logActivity(db, t.business_id, userId, t.channel ?? "task", `Done: ${t.title}`);
}

export function setDdItem(db: DB, businessId: number, key: string, done: boolean, note?: string) {
  if (!DD_SECTIONS.some((s) => s.items.some(([k]) => k === key))) throw new Error("Unknown checklist item");
  db.prepare(
    `INSERT INTO dd_items (business_id, item_key, done, note, updated_at) VALUES (?, ?, ?, ?, datetime('now'))
     ON CONFLICT(business_id, item_key) DO UPDATE SET done = excluded.done, note = COALESCE(excluded.note, dd_items.note), updated_at = excluded.updated_at`,
  ).run(businessId, key, done ? 1 : 0, note ?? null);
}

// ---------- Reads ----------

export interface BusinessRow {
  id: number; source: string; name: string; industry: string | null; city: string | null; state: string | null; metro: string | null;
  owner_name: string | null; owner_email: string | null; email_status: string | null; phone: string | null; website: string | null;
  tier: string | null; score: number | null; age_years: number | null; ebitda_lo: number | null; ebitda_hi: number | null;
  rating: number | null; reviews: number | null; stage: Stage; assignee: string | null; next_step: string | null; due_date: string | null;
  open_tasks: number; next_task_due: string | null;
}

export interface BusinessQuery {
  q?: string;
  stage?: string;
  tier?: string;
  source?: string;
  sort?: "tier" | "score" | "name" | "updated" | "due";
}

const SORTS = {
  tier: "COALESCE(b.tier, 'Z') ASC, b.score DESC, b.name",
  score: "b.score DESC, b.name",
  name: "b.name COLLATE NOCASE",
  updated: "d.updated_at DESC",
  due: "COALESCE(d.due_date, '9999') ASC, b.name",
};

export function listBusinesses(db: DB, userId: number, q: BusinessQuery = {}, limit = 5000): BusinessRow[] {
  const where = ["b.user_id = ?"];
  const args: (string | number)[] = [userId];
  if (q.stage && isStage(q.stage)) { where.push("d.stage = ?"); args.push(q.stage); }
  if (q.tier) { where.push("b.tier = ?"); args.push(q.tier); }
  if (q.source) { where.push("b.source = ?"); args.push(q.source); }
  const term = q.q?.trim().toLowerCase();
  if (term) {
    const like = `%${term.replace(/[%_\\]/g, (m) => `\\${m}`)}%`;
    const cols = ["b.name", "b.owner_name", "b.city", "b.metro", "b.industry"];
    where.push(`(${cols.map((c) => `lower(${c}) LIKE ? ESCAPE '\\'`).join(" OR ")})`);
    args.push(...cols.map(() => like));
  }
  return db
    .prepare(
      `SELECT b.id, b.source, b.name, b.industry, b.city, b.state, b.metro, b.owner_name, b.owner_email, b.email_status, b.phone, b.website,
              b.tier, b.score, b.age_years, b.ebitda_lo, b.ebitda_hi, b.rating, b.reviews,
              d.stage, d.assignee, d.next_step, d.due_date,
              (SELECT COUNT(*) FROM deal_tasks t WHERE t.business_id = b.id AND t.done_at IS NULL) AS open_tasks,
              (SELECT MIN(due_date) FROM deal_tasks t WHERE t.business_id = b.id AND t.done_at IS NULL) AS next_task_due
       FROM businesses_crm b JOIN deals d ON d.business_id = b.id
       WHERE ${where.join(" AND ")} ORDER BY ${SORTS[q.sort ?? "tier"] ?? SORTS.tier} LIMIT ${Math.min(limit, 5000)}`,
    )
    .all(...args) as BusinessRow[];
}

export function stageCounts(db: DB, userId: number) {
  const rows = db
    .prepare("SELECT d.stage, COUNT(*) AS n FROM deals d JOIN businesses_crm b ON b.id = d.business_id WHERE b.user_id = ? GROUP BY d.stage")
    .all(userId) as { stage: string; n: number }[];
  return Object.fromEntries(STAGES.map((s) => [s.id, rows.find((r) => r.stage === s.id)?.n ?? 0])) as Record<Stage, number>;
}

export function businessDetail(db: DB, userId: number, id: number) {
  const b = db
    .prepare(`SELECT b.*, d.stage, d.assignee, d.next_step, d.due_date, d.cadence_started_at, d.updated_at AS deal_updated
              FROM businesses_crm b JOIN deals d ON d.business_id = b.id WHERE b.id = ? AND b.user_id = ?`)
    .get(id, userId) as (Record<string, any> & { stage: Stage }) | undefined;
  if (!b) return null;
  const tasks = db.prepare("SELECT * FROM deal_tasks WHERE business_id = ? ORDER BY done_at IS NOT NULL, COALESCE(due_date, '9999'), id").all(id) as {
    id: number; kind: string; channel: string | null; title: string; due_date: string | null; done_at: string | null;
  }[];
  const activity = db
    .prepare("SELECT a.kind, a.body, a.created_at, u.name AS who FROM deal_activity a LEFT JOIN users u ON u.id = a.user_id WHERE a.business_id = ? ORDER BY a.id DESC LIMIT 200")
    .all(id) as { kind: string; body: string; created_at: string; who: string | null }[];
  const dd = Object.fromEntries(
    (db.prepare("SELECT item_key, done, note FROM dd_items WHERE business_id = ?").all(id) as { item_key: string; done: number; note: string | null }[])
      .map((r) => [r.item_key, { done: r.done === 1, note: r.note }]),
  ) as Record<string, { done: boolean; note: string | null }>;
  const parse = (s: string | null) => (s ? (JSON.parse(s) as string[]) : []);
  const { raw_json: _raw, ...rest } = b;
  const business = { ...rest, fit_met: parse(b.fit_met), fit_missed: parse(b.fit_missed) } as Record<string, any> & { stage: Stage; fit_met: string[]; fit_missed: string[] };
  return { business, tasks, activity, dd };
}

/** The "today" list: open tasks due today or earlier, plus the next week. */
export function dueTasks(db: DB, userId: number, horizonDays = 7) {
  return db
    .prepare(
      `SELECT t.id, t.title, t.channel, t.kind, t.due_date, b.id AS business_id, b.name, b.owner_name, b.phone, b.owner_email, b.city, b.tier
       FROM deal_tasks t JOIN businesses_crm b ON b.id = t.business_id JOIN deals d ON d.business_id = b.id
       WHERE b.user_id = ? AND t.done_at IS NULL AND t.due_date IS NOT NULL AND t.due_date <= ? AND d.stage NOT IN ('closed','passed')
       ORDER BY t.due_date, b.tier, b.name`,
    )
    .all(userId, addDays(today(), horizonDays)) as {
    id: number; title: string; channel: string | null; kind: string; due_date: string; business_id: number; name: string;
    owner_name: string | null; phone: string | null; owner_email: string | null; city: string | null; tier: string | null;
  }[];
}

export const websiteDomain = (w: string | null) => domainFromUrl(w);
