import type { DB } from "./db.ts";

export const STATUS_FILTERS = ["all", "verified", "catch_all", "risky", "not_found", "has_mobile"] as const;
export type StatusFilter = (typeof STATUS_FILTERS)[number];

const SORTS = {
  newest: "l.id DESC",
  oldest: "l.id ASC",
  name: "p.full_name COLLATE NOCASE ASC",
  company: "c.name COLLATE NOCASE ASC",
  status: "l.email_status ASC, l.id DESC",
  credits: "l.credits DESC, l.id DESC",
} as const;
export type Sort = keyof typeof SORTS;
export const SORT_KEYS = Object.keys(SORTS) as Sort[];

export interface LeadQuery {
  status?: StatusFilter;
  q?: string;
  sort?: Sort;
  runId?: number;
  limit?: number;
}

export interface LeadRow {
  id: number;
  run_id: number;
  state: string;
  email: string | null;
  email_status: string | null;
  email_provider: string | null;
  mobile: string | null;
  opening_line: string | null;
  credits: number;
  treg_cost_micro: number;
  full_name: string;
  title: string | null;
  linkedin_url: string | null;
  company: string | null;
  domain: string;
  created_at: string;
}

export const MAX_ROWS = 10_000;

/** Every lead this account owns, across runs, filtered and sorted in SQL. */
export function queryLeads(db: DB, userId: number, query: LeadQuery = {}): LeadRow[] {
  const where = ["l.user_id = ?", "l.state IN ('done','stopped','error')"];
  const args: (string | number)[] = [userId];
  const status = query.status ?? "all";
  if (status === "has_mobile") where.push("l.mobile IS NOT NULL");
  else if (status !== "all") {
    where.push("l.email_status = ?");
    args.push(status);
  }
  if (query.runId) {
    where.push("l.run_id = ?");
    args.push(query.runId);
  }
  const q = query.q?.trim().toLowerCase();
  if (q) {
    const cols = ["p.full_name", "c.name", "l.email", "p.title", "c.domain"];
    where.push(`(${cols.map((c) => `lower(${c}) LIKE ? ESCAPE '\\'`).join(" OR ")})`);
    const like = `%${q.replace(/[%_]/g, (m) => `\\${m}`)}%`;
    args.push(like, like, like, like, like);
  }
  const order = SORTS[query.sort ?? "newest"] ?? SORTS.newest;
  const limit = Math.min(Math.max(1, query.limit ?? MAX_ROWS), MAX_ROWS);
  return db
    .prepare(
      `SELECT l.id, l.run_id, l.state, l.email, l.email_status, l.email_provider, l.mobile, l.opening_line, l.credits,
              l.treg_cost_micro, l.created_at, p.full_name, p.title, p.linkedin_url, c.name AS company, c.domain
       FROM leads l JOIN people p ON p.id = l.person_id JOIN companies c ON c.id = l.company_id
       WHERE ${where.join(" AND ")}
       ORDER BY ${order} LIMIT ${limit}`,
    )
    .all(...args) as LeadRow[];
}

export function attemptsFor(db: DB, userId: number, leadId: number) {
  return db
    .prepare(
      `SELECT a.step, a.provider, a.outcome, a.cost_micro, a.created_at FROM lead_attempts a JOIN leads l ON l.id = a.lead_id
       WHERE a.lead_id = ? AND l.user_id = ? ORDER BY a.id`,
    )
    .all(leadId, userId) as { step: string; provider: string | null; outcome: string; cost_micro: number; created_at: string }[];
}

/** Delete leads this account owns. Leads still being enriched by a live run are left alone. */
export function deleteLeads(db: DB, userId: number, ids: number[]): number {
  const clean = [...new Set(ids.filter((n) => Number.isInteger(n) && n > 0))].slice(0, MAX_ROWS);
  if (!clean.length) return 0;
  const stmt = db.prepare("DELETE FROM leads WHERE id = ? AND user_id = ? AND state IN ('done','stopped','error')");
  return db.transaction(() => clean.reduce((n, id) => n + stmt.run(id, userId).changes, 0))();
}

export const domainLabel = (domain: string) => (domain.startsWith("name:") ? "" : domain);

// A cell starting with = + - @ (or tab/CR) is run as a formula by Excel and Sheets. Prefix it so it stays text.
export function csvCell(v: unknown): string {
  let s = v === null || v === undefined ? "" : String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function toCsv(rows: LeadRow[]): string {
  const header = ["Name", "Title", "Company", "Domain", "Email", "Email status", "Found by", "Mobile", "LinkedIn", "Opening line", "Credits", "Run", "Added"];
  const lines = rows.map((r) =>
    [
      r.full_name, r.title, r.company, domainLabel(r.domain), r.email, r.email_status, r.email_provider, r.mobile, r.linkedin_url,
      r.opening_line, r.credits, r.run_id, r.created_at,
    ].map(csvCell).join(","),
  );
  return [header.join(","), ...lines].join("\r\n") + "\r\n";
}
