import crypto from "node:crypto";
import type { DB } from "./db.ts";
import { parseCsv } from "./lists.ts";
import { aiJson } from "./claude.ts";
import { getBuyBox, logActivity, upsertBusiness, type BuyBox } from "./crm.ts";

// ---------- Loading SBA Search output into the shared directory ----------

const NAICS_NAMES: Record<string, string> = {
  "238220": "HVAC & plumbing",
  "238210": "Electrical",
  "238160": "Roofing",
  "561730": "Landscaping",
  "561710": "Pest control",
  "812320": "Dry cleaning & laundry",
};
export const industryName = (naics: string | null) => (naics ? NAICS_NAMES[naics] ?? `NAICS ${naics}` : null);

const num = (v: string | undefined) => {
  if (v === undefined || v.trim() === "" || v === "nan") return null;
  const n = Number(v.replace(/[$,]/g, ""));
  return Number.isFinite(n) ? n : null;
};
const int = (v: string | undefined) => { const n = num(v); return n === null ? null : Math.round(n); };
const txt = (v: string | undefined) => (v === undefined || v.trim() === "" || v === "nan" ? null : v.trim());
const truthy = (v: string | undefined) => /^(true|1|yes)$/i.test(v ?? "");
// Capitalise word starts, but not the letter after an apostrophe ("Coopwood's", not "Coopwood'S").
const title = (s: string | null) => (s ? s.toLowerCase().replace(/(^|[^a-z'’])([a-z])/g, (_, p: string, c: string) => p + c.toUpperCase()).replace(/\b(Llc|Inc|Lp|Ltd|Co)\b/g, (m) => m.toUpperCase()) : null);

export interface DirectoryRow {
  externalId: string; name: string; naics: string | null; industry: string | null; address: string | null; city: string | null;
  state: string; zip: string | null; county: string | null; metro: string | null; ownerName: string | null; ownerTitle: string | null;
  officers: string | null; familyRun: boolean; ageYears: number | null; regDate: string | null; estPayroll: number | null;
  revLo: number | null; revHi: number | null; ebitdaLo: number | null; ebitdaHi: number | null; jobs: number | null;
  planParticipants: number | null; role: string | null; businessModel: string | null; pppClean: boolean;
  sourceTier: string | null; sourceScore: number | null; sourceNotes: string | null; watchOuts: string | null;
}

/** One row of sponsor_leads_<state>_<naics>.csv, as sponsor.py writes it. */
export function fromSponsorRow(r: Record<string, string>, state: string): DirectoryRow | null {
  const name = txt(r.company);
  const loan = txt(r.ppp_loan_numbers)?.split(";")[0];
  const externalId = txt(r.state_entity_id) ? `${state}:${r.state_entity_id}` : loan ? `L${loan}` : null;
  if (!name || !externalId) return null;
  const naics = txt(r.naics);
  return {
    externalId, name: title(name)!, naics, industry: industryName(naics), address: title(txt(r.address)), city: title(txt(r.city)), state,
    zip: txt(r.zip5), county: title(txt(r.county)), metro: txt(r.metro), ownerName: txt(r.likely_owner), ownerTitle: txt(r.owner_title),
    officers: txt(r.all_officers), familyRun: truthy(r.founder_name_match) || truthy(r.family_officers) || truthy(r.generational),
    ageYears: num(r.age_years), regDate: txt(r.registered_date), estPayroll: int(r.est_annual_payroll),
    revLo: int(r.est_revenue_low), revHi: int(r.est_revenue_high), ebitdaLo: int(r.est_ebitda_low), ebitdaHi: int(r.est_ebitda_high),
    jobs: int(r.ppp_jobs_2020), planParticipants: int(r.plan_participants_2024), role: txt(r.role), businessModel: txt(r.business_model_guess),
    pppClean: !truthy(r.not_fully_forgiven) && !truthy(r.second_draw), sourceTier: txt(r.fit_tier), sourceScore: num(r.lead_score),
    sourceNotes: txt(r.fit_headline), watchOuts: txt(r.watch_outs),
  };
}

export const MAX_DIRECTORY_BYTES = 60_000_000;

/** Admin upload: add or refresh every row. Customers' pipelines are separate copies and aren't touched. */
export function loadDirectoryCsv(db: DB, adminId: number, filename: string, text: string) {
  if (text.length > MAX_DIRECTORY_BYTES) throw new Error("That file is over 60 MB");
  const state = (filename.match(/sponsor_leads_([a-z]{2})_/i)?.[1] ?? "TX").toUpperCase();
  const [header, ...body] = parseCsv(text);
  if (!header?.includes("company") || !header.includes("likely_owner")) {
    throw new Error("Expected a sponsor_leads CSV from sponsor.py (columns company, likely_owner, …)");
  }
  const cols = header.map((h) => h.trim());
  const upsert = db.prepare(`
    INSERT INTO directory (external_id, name, naics, industry, address, city, state, zip, county, metro, owner_name, owner_title, officers,
      family_run, age_years, reg_date, est_payroll, rev_lo, rev_hi, ebitda_lo, ebitda_hi, jobs, plan_participants, role, business_model,
      ppp_clean, source_tier, source_score, source_notes, watch_outs, dataset, raw_json, updated_at)
    VALUES (@externalId, @name, @naics, @industry, @address, @city, @state, @zip, @county, @metro, @ownerName, @ownerTitle, @officers,
      @familyRun, @ageYears, @regDate, @estPayroll, @revLo, @revHi, @ebitdaLo, @ebitdaHi, @jobs, @planParticipants, @role, @businessModel,
      @pppClean, @sourceTier, @sourceScore, @sourceNotes, @watchOuts, @dataset, @raw, datetime('now'))
    ON CONFLICT(external_id) DO UPDATE SET name = excluded.name, naics = excluded.naics, industry = excluded.industry, address = excluded.address,
      city = excluded.city, state = excluded.state, zip = excluded.zip, county = excluded.county, metro = excluded.metro,
      owner_name = excluded.owner_name, owner_title = excluded.owner_title, officers = excluded.officers, family_run = excluded.family_run,
      age_years = excluded.age_years, reg_date = excluded.reg_date, est_payroll = excluded.est_payroll, rev_lo = excluded.rev_lo,
      rev_hi = excluded.rev_hi, ebitda_lo = excluded.ebitda_lo, ebitda_hi = excluded.ebitda_hi, jobs = excluded.jobs,
      plan_participants = excluded.plan_participants, role = excluded.role, business_model = excluded.business_model,
      ppp_clean = excluded.ppp_clean, source_tier = excluded.source_tier, source_score = excluded.source_score,
      source_notes = excluded.source_notes, watch_outs = excluded.watch_outs, dataset = excluded.dataset, raw_json = excluded.raw_json,
      updated_at = excluded.updated_at`);
  let added = 0, updated = 0, skipped = 0;
  db.transaction(() => {
    for (const cells of body) {
      const r = Object.fromEntries(cols.map((c, i) => [c, cells[i] ?? ""]));
      const row = fromSponsorRow(r, state);
      if (!row) { skipped++; continue; }
      const existed = db.prepare("SELECT 1 FROM directory WHERE external_id = ?").get(row.externalId);
      upsert.run({ ...row, familyRun: row.familyRun ? 1 : 0, pppClean: row.pppClean ? 1 : 0, dataset: filename.slice(0, 200), raw: JSON.stringify(r) });
      if (existed) updated++; else added++;
    }
    db.prepare("INSERT INTO directory_uploads (user_id, filename, rows_added, rows_updated, rows_skipped) VALUES (?, ?, ?, ?, ?)").run(adminId, filename.slice(0, 200), added, updated, skipped);
  })();
  return { added, updated, skipped, state };
}

export function directoryStats(db: DB) {
  const total = (db.prepare("SELECT COUNT(*) AS n FROM directory").get() as { n: number }).n;
  const byIndustry = db.prepare("SELECT industry, state, COUNT(*) AS n FROM directory GROUP BY industry, state ORDER BY n DESC").all() as { industry: string; state: string; n: number }[];
  const uploads = db.prepare("SELECT filename, rows_added, rows_updated, rows_skipped, created_at FROM directory_uploads ORDER BY id DESC LIMIT 10").all() as {
    filename: string; rows_added: number; rows_updated: number; rows_skipped: number; created_at: string;
  }[];
  return { total, byIndustry, uploads };
}

// ---------- Step 1: the rules filter (instant, free) ----------

export interface DirectoryFilter {
  industries?: string[]; // NAICS codes
  states?: string[];
  metro?: string; // substring
  minAge?: number;
  ebitdaMin?: number;
  ebitdaMax?: number;
  familyOnly?: boolean;
  q?: string;
}

/** The buy box as a default filter. EBITDA ranges overlap the box, so a $0.7–1.9M estimate fits a $0.5–3M box. */
export function filterFromBuyBox(box: BuyBox): DirectoryFilter {
  return {
    industries: box.naics.length ? box.naics : undefined,
    states: box.states.length ? box.states : undefined,
    metro: box.metro || undefined,
    minAge: box.minAgeYears,
    ebitdaMin: box.ebitdaMin,
    ebitdaMax: box.ebitdaMax,
    familyOnly: box.familyOnly,
  };
}

export function candidates(db: DB, f: DirectoryFilter, limit = 300) {
  const where: string[] = [];
  const args: (string | number)[] = [];
  if (f.industries?.length) { where.push(`naics IN (${f.industries.map(() => "?").join(",")})`); args.push(...f.industries); }
  if (f.states?.length) { where.push(`state IN (${f.states.map(() => "?").join(",")})`); args.push(...f.states); }
  if (f.metro?.trim()) { where.push("lower(metro) LIKE ?"); args.push(`%${f.metro.trim().toLowerCase()}%`); }
  if (f.minAge) { where.push("age_years >= ?"); args.push(f.minAge); }
  if (f.ebitdaMin) { where.push("ebitda_hi >= ?"); args.push(f.ebitdaMin); }
  if (f.ebitdaMax) { where.push("ebitda_lo <= ?"); args.push(f.ebitdaMax); }
  if (f.familyOnly) where.push("family_run = 1");
  if (f.q?.trim()) {
    const like = `%${f.q.trim().toLowerCase()}%`;
    where.push("(lower(name) LIKE ? OR lower(owner_name) LIKE ? OR lower(city) LIKE ?)");
    args.push(like, like, like);
  }
  const sql = `SELECT * FROM directory ${where.length ? `WHERE ${where.join(" AND ")}` : ""}`;
  const total = (db.prepare(`SELECT COUNT(*) AS n FROM (${sql})`).get(...args) as { n: number }).n;
  // Pre-rank before the AI sees anything: bigger and older first, then the pipeline's own score.
  const rows = db.prepare(`${sql} ORDER BY COALESCE(ebitda_hi, 0) DESC, COALESCE(age_years, 0) DESC LIMIT ?`).all(...args, limit) as Record<string, any>[];
  return { total, rows };
}

// ---------- Step 2: AI scoring against the account's buy box ----------

export const profileHash = (box: BuyBox) => crypto.createHash("sha256").update(JSON.stringify(box)).digest("hex").slice(0, 16);

const SCORE_SYSTEM = `You score small businesses as acquisition targets for one specific buyer.
Judge ONLY from the fields given. Never invent facts. Size figures are estimates from public payroll data.
For each business return: id, score (0-100, how well it fits THIS buyer's buy box and thesis), reason (one sentence, specific, citing fields),
flags (up to 3 short risks, e.g. "owner may hold the trade license", "rural market", "small team").
Scoring: 80+ strong fit on most criteria; 60-79 good with gaps; 40-59 partial; under 40 poor fit or a deal-breaker hit.
Reply with compact JSON only, no markdown: {"results":[{"id":..,"score":..,"reason":"..","flags":[".."]}]}. Keep each reason under 25 words.`;

const brief = (r: Record<string, any>) => ({
  id: r.id, name: r.name, industry: r.industry, city: r.city, metro: r.metro, years: r.age_years, owner: r.owner_title ? `${r.owner_name} (${r.owner_title})` : r.owner_name,
  family_run: Boolean(r.family_run), est_revenue: [r.rev_lo, r.rev_hi], est_ebitda: [r.ebitda_lo, r.ebitda_hi], staff_2020: r.jobs,
  retirement_plan_participants_2024: r.plan_participants, size_role: r.role, model: r.business_model, ppp_clean: Boolean(r.ppp_clean),
});

export const SCORE_BATCH = 10;
export const MAX_SCORE_PER_REQUEST = 100;

/** Score the given directory rows for this account; cached rows are reused, only new ones go to the AI. */
export async function scoreRows(
  db: DB, userId: number, rows: Record<string, any>[],
  ai: (system: string, prompt: string) => Promise<{ results: { id: number; score: number; reason: string; flags?: string[] }[] }> = defaultAi,
  max = MAX_SCORE_PER_REQUEST,
) {
  const box = getBuyBox(db, userId);
  const hash = profileHash(box);
  const cached = new Set(
    (db.prepare(`SELECT directory_id FROM directory_scores WHERE user_id = ? AND profile_hash = ?`).all(userId, hash) as { directory_id: number }[]).map((r) => r.directory_id),
  );
  const todo = rows.filter((r) => !cached.has(r.id)).slice(0, Math.min(max, MAX_SCORE_PER_REQUEST));
  const save = db.prepare("INSERT OR REPLACE INTO directory_scores (user_id, directory_id, profile_hash, score, reason, flags) VALUES (?, ?, ?, ?, ?, ?)");
  const prompt = (batch: Record<string, any>[]) =>
    `Buyer's buy box:\n${JSON.stringify(box, null, 1)}\n\nBusinesses:\n${batch.map((r) => JSON.stringify(brief(r))).join("\n")}`;
  let scored = 0;
  let failed = 0;
  for (let i = 0; i < todo.length; i += SCORE_BATCH) {
    const batch = todo.slice(i, i + SCORE_BATCH);
    // One unreadable reply shouldn't sink the whole request: retry once, then skip the batch and count it.
    let out: Awaited<ReturnType<typeof ai>> | null = null;
    for (let attempt = 0; attempt < 2 && !out; attempt++) {
      try { out = await ai(SCORE_SYSTEM, prompt(batch)); } catch (e) { console.error(`scoring batch failed (attempt ${attempt + 1})`, e); }
    }
    if (!out) { failed += batch.length; continue; }
    const ids = new Set(batch.map((r) => r.id));
    db.transaction(() => {
      for (const r of out.results ?? []) {
        if (!ids.has(Number(r.id))) continue; // ignore anything the model made up
        const score = Math.max(0, Math.min(100, Math.round(Number(r.score) || 0)));
        save.run(userId, Number(r.id), hash, score, String(r.reason ?? "").slice(0, 400), JSON.stringify((r.flags ?? []).slice(0, 3).map((f) => String(f).slice(0, 80))));
        scored++;
      }
    })();
  }
  if (failed && !scored) throw new Error("The AI couldn't score these businesses right now. Please try again.");
  return { scored, failed, cached: rows.length - todo.length, remaining: Math.max(0, rows.filter((r) => !cached.has(r.id)).length - todo.length) + failed };
}

async function defaultAi(system: string, prompt: string) {
  return aiJson<{ results: { id: number; score: number; reason: string; flags?: string[] }[] }>({ role: "line", system, prompt, maxTokens: 4000 });
}

/** Candidates with this account's current scores attached, best first; unscored rows after scored ones. */
export function rankedCandidates(db: DB, userId: number, f: DirectoryFilter, limit = 300) {
  const { total, rows } = candidates(db, f, limit);
  const hash = profileHash(getBuyBox(db, userId));
  const scores = new Map(
    (db.prepare("SELECT directory_id, score, reason, flags FROM directory_scores WHERE user_id = ? AND profile_hash = ?").all(userId, hash) as {
      directory_id: number; score: number; reason: string; flags: string | null;
    }[]).map((s) => [s.directory_id, s]),
  );
  const savedRows = db
    .prepare("SELECT b.external_id, b.id, d.stage FROM businesses_crm b JOIN deals d ON d.business_id = b.id WHERE b.user_id = ? AND b.source = 'directory'")
    .all(userId) as { external_id: string; id: number; stage: string }[];
  const saved = new Map(savedRows.map((r) => [r.external_id, r]));
  const out = rows.map((r) => {
    const s = scores.get(r.id);
    return {
      id: r.id, name: r.name, industry: r.industry, city: r.city, state: r.state, metro: r.metro, owner_name: r.owner_name, owner_title: r.owner_title,
      age_years: r.age_years, ebitda_lo: r.ebitda_lo, ebitda_hi: r.ebitda_hi, rev_lo: r.rev_lo, rev_hi: r.rev_hi, jobs: r.jobs, family_run: r.family_run === 1,
      role: r.role, score: s?.score ?? null, reason: s?.reason ?? null, flags: s?.flags ? (JSON.parse(s.flags) as string[]) : [],
      saved: saved.has(r.external_id), businessId: saved.get(r.external_id)?.id ?? null, stage: saved.get(r.external_id)?.stage ?? null,
    };
  });
  out.sort((a, b) => (b.score ?? -1) - (a.score ?? -1));
  return { total, rows: out, unscored: out.filter((r) => r.score === null).length };
}

// ---------- Step 3: save into the account's own pipeline ----------

/** Star a directory business: it goes onto the account's Shortlist (free). Enriching it later moves it into the pipeline. */
export function saveFromDirectory(db: DB, userId: number, ids: number[], stage: "shortlist" | "identified" = "shortlist") {
  const hash = profileHash(getBuyBox(db, userId));
  let added = 0;
  db.transaction(() => {
    for (const id of ids.slice(0, 200)) {
      const r = db.prepare("SELECT * FROM directory WHERE id = ?").get(id) as Record<string, any> | undefined;
      if (!r) continue;
      const s = db.prepare("SELECT score, reason, flags FROM directory_scores WHERE user_id = ? AND directory_id = ? AND profile_hash = ?").get(userId, id, hash) as
        | { score: number; reason: string; flags: string | null } | undefined;
      const { id: bid, created } = upsertBusiness(db, userId, {
        source: "directory" as "manual", externalId: r.external_id, name: r.name, industry: r.industry, address: r.address, city: r.city, state: r.state,
        zip: r.zip, metro: r.metro, ownerName: r.owner_name, ownerTitle: r.owner_title, ageYears: r.age_years, regDate: r.reg_date,
        estPayroll: r.est_payroll, revLo: r.rev_lo, revHi: r.rev_hi, ebitdaLo: r.ebitda_lo, ebitdaHi: r.ebitda_hi, role: r.role,
        score: s?.score ?? null, why: s?.reason ?? null, watch: s?.flags ? (JSON.parse(s.flags) as string[]).join("; ") || null : null,
        familyRun: r.family_run === 1,
      });
      if (created) {
        added++;
        db.prepare("UPDATE deals SET stage = ? WHERE business_id = ?").run(stage, bid);
        logActivity(db, bid, userId, "import", `${stage === "shortlist" ? "Shortlisted" : "Saved"} from the business directory${s ? ` (AI match ${s.score})` : ""}`);
      }
    }
  })();
  return { added };
}
