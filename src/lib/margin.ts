import type { DB } from "./db.ts";
import { balance, grant } from "./credits.ts";

/**
 * What one credit sells for, in USD — used to turn credits charged into revenue for the margin view.
 * Until Stripe top-ups exist (phase 12) this is an assumption, set with LEADFINDER_CREDIT_USD.
 */
export const creditUsd = () => {
  const v = Number(process.env.LEADFINDER_CREDIT_USD);
  return Number.isFinite(v) && v > 0 ? v : 0.02;
};

const micro = (usd: number) => Math.round(usd * 1_000_000);

export interface MarginTotals {
  runs: number;
  leads: number;
  verified: number;
  creditsCharged: number;
  revenueMicro: number;
  runCostMicro: number; // Treg calls made by runs
  overheadMicro: number; // Treg calls outside runs: site reads, counts (free to the customer)
  costMicro: number;
  marginPct: number | null;
  costPerVerifiedMicro: number | null;
}

const since = (days: number | null) => (days ? `datetime('now', '-${Math.floor(days)} days')` : "'0000-01-01'");

export function marginTotals(db: DB, days: number | null = null): MarginTotals {
  const s = since(days);
  const r = db.prepare(`SELECT COUNT(*) AS runs, COALESCE(SUM(charged), 0) AS charged FROM runs WHERE created_at >= ${s}`).get() as { runs: number; charged: number };
  const l = db
    .prepare(`SELECT COUNT(*) AS leads, COALESCE(SUM(email_status = 'verified'), 0) AS verified FROM leads WHERE created_at >= ${s}`)
    .get() as { leads: number; verified: number };
  const c = db
    .prepare(
      `SELECT COALESCE(SUM(CASE WHEN run_id IS NOT NULL THEN cost_micro END), 0) AS run_cost,
              COALESCE(SUM(CASE WHEN run_id IS NULL THEN cost_micro END), 0) AS overhead
       FROM treg_calls WHERE created_at >= ${s}`,
    )
    .get() as { run_cost: number; overhead: number };
  const revenueMicro = micro(r.charged * creditUsd());
  const costMicro = c.run_cost + c.overhead;
  return {
    runs: r.runs,
    leads: l.leads,
    verified: l.verified,
    creditsCharged: r.charged,
    revenueMicro,
    runCostMicro: c.run_cost,
    overheadMicro: c.overhead,
    costMicro,
    marginPct: revenueMicro > 0 ? ((revenueMicro - costMicro) / revenueMicro) * 100 : null,
    costPerVerifiedMicro: l.verified > 0 ? Math.round(c.run_cost / l.verified) : null,
  };
}

export interface RunMarginRow {
  id: number;
  email: string;
  kind: string;
  status: string;
  created_at: string;
  target: number;
  leads: number;
  verified: number;
  held: number;
  charged: number;
  cost_micro: number;
  revenue_micro: number;
  margin_pct: number | null;
}

export function runMargins(db: DB, limit = 100): RunMarginRow[] {
  const rows = db
    .prepare(
      `SELECT r.id, u.email, r.kind, r.status, r.created_at, r.target, r.max_credits AS held, r.charged,
              (SELECT COUNT(*) FROM leads WHERE run_id = r.id) AS leads,
              (SELECT COUNT(*) FROM leads WHERE run_id = r.id AND email_status = 'verified') AS verified,
              (SELECT COALESCE(SUM(cost_micro), 0) FROM treg_calls WHERE run_id = r.id) AS cost_micro
       FROM runs r JOIN users u ON u.id = r.user_id ORDER BY r.id DESC LIMIT ?`,
    )
    .all(limit) as Omit<RunMarginRow, "revenue_micro" | "margin_pct">[];
  return rows.map((r) => {
    const revenue = micro(r.charged * creditUsd());
    return { ...r, revenue_micro: revenue, margin_pct: revenue > 0 ? ((revenue - r.cost_micro) / revenue) * 100 : null };
  });
}

/** Treg spend by endpoint, and by the provider that actually served it. */
export function costBreakdown(db: DB, days: number | null = null) {
  const s = since(days);
  const byEndpoint = db
    .prepare(
      `SELECT endpoint, COUNT(*) AS calls, COALESCE(SUM(cost_micro), 0) AS cost_micro,
              SUM(error IS NOT NULL) AS errors, CAST(AVG(latency_ms) AS INTEGER) AS avg_ms
       FROM treg_calls WHERE created_at >= ${s} GROUP BY endpoint ORDER BY cost_micro DESC, calls DESC`,
    )
    .all() as { endpoint: string; calls: number; cost_micro: number; errors: number; avg_ms: number }[];
  const emailProviders = db
    .prepare(
      `SELECT COALESCE(served_by, '(none)') AS provider, COUNT(*) AS calls, COALESCE(SUM(cost_micro), 0) AS cost_micro
       FROM treg_calls WHERE endpoint = 'treg.people.email.find' AND created_at >= ${s}
       GROUP BY served_by ORDER BY calls DESC`,
    )
    .all() as { provider: string; calls: number; cost_micro: number }[];
  return { byEndpoint, emailProviders };
}

export function accounts(db: DB) {
  const users = db
    .prepare(
      `SELECT u.id, u.email, u.name, u.role, u.created_at,
              (SELECT COUNT(*) FROM runs WHERE user_id = u.id) AS runs,
              (SELECT COALESCE(SUM(charged), 0) FROM runs WHERE user_id = u.id) AS spent
       FROM users u ORDER BY u.id`,
    )
    .all() as { id: number; email: string; name: string; role: string; created_at: string; runs: number; spent: number }[];
  return users.map((u) => ({ ...u, balance: balance(db, u.id) }));
}

/** Admin-only manual credit adjustment (positive or negative), written to the ledger like everything else. */
export function adminAdjust(db: DB, adminId: number, userId: number, amount: number, note: string) {
  if (!Number.isInteger(amount) || amount === 0 || Math.abs(amount) > 1_000_000) throw new Error("Enter a whole number of credits");
  const target = db.prepare("SELECT id FROM users WHERE id = ?").get(userId);
  if (!target) throw new Error("User not found");
  if (amount < 0 && balance(db, userId) + amount < 0) throw new Error("That would take the balance below zero");
  // Customers see this note in their ledger, so it names the team, not the admin's email.
  grant(db, userId, amount, `${note.trim().slice(0, 120) || (amount > 0 ? "Credits added" : "Credits removed")} (LeadFinder team)`, amount > 0 ? "grant" : "adjust");
  console.log(`admin ${adminId} adjusted user ${userId} by ${amount}`);
}

/** A customer's own receipts: what each run held, charged and gave back. No Treg cost. */
export function runReceipts(db: DB, userId: number, limit = 50) {
  return db
    .prepare(
      `SELECT r.id, r.kind, r.status, r.created_at, r.target, r.max_credits AS held, r.charged,
              CASE WHEN r.status IN ('completed','failed','cancelled') THEN r.max_credits - r.charged ELSE 0 END AS refunded,
              (SELECT COUNT(*) FROM leads WHERE run_id = r.id) AS leads,
              (SELECT COUNT(*) FROM leads WHERE run_id = r.id AND email_status = 'verified') AS verified,
              l.filename
       FROM runs r LEFT JOIN lists l ON l.id = r.list_id WHERE r.user_id = ? ORDER BY r.id DESC LIMIT ?`,
    )
    .all(userId, limit) as {
    id: number; kind: string; status: string; created_at: string; target: number; held: number; charged: number;
    refunded: number; leads: number; verified: number; filename: string | null;
  }[];
}

export const usd = (m: number, dp = 2) => `$${(m / 1_000_000).toFixed(dp)}`;
