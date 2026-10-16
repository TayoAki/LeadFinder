import type { DB } from "./db.ts";

export const WELCOME_CREDITS = 50;

// Credit price list (PRODUCT.md, open question 1 — tunable). Mobiles are opt-in per run.
export const CREDIT_PRICES = {
  person: 1,
  verifiedEmail: 4,
  unconfirmedEmail: 2, // catch-all or risky: delivered with its badge, charged less
  verifyOnly: 1, // an uploaded email we only had to check (invalid ones cost nothing)
  mobile: 10,
} as const;

/** The most cleaning `rows` uploaded rows could cost: no person credit, the email at most a verified find. */
export function maxCreditsForList(rows: number, wantMobile: boolean) {
  return rows * (CREDIT_PRICES.verifiedEmail + (wantMobile ? CREDIT_PRICES.mobile : 0));
}

/** The most a run of `target` leads could cost. This is what gets held. */
export function maxCreditsFor(target: number, wantMobile: boolean) {
  const perLead = CREDIT_PRICES.person + CREDIT_PRICES.verifiedEmail + (wantMobile ? CREDIT_PRICES.mobile : 0);
  return target * perLead;
}

export function balance(db: DB, userId: number): number {
  const row = db.prepare("SELECT COALESCE(SUM(delta), 0) AS b FROM ledger WHERE user_id = ?").get(userId) as { b: number };
  return row.b;
}

export function grant(db: DB, userId: number, amount: number, note: string, kind: "grant" | "topup" | "adjust" = "grant") {
  if (!Number.isInteger(amount) || amount === 0) throw new Error("amount must be a non-zero integer");
  db.prepare("INSERT INTO ledger (user_id, kind, delta, note) VALUES (?, ?, ?, ?)").run(userId, kind, amount, note);
}

export class InsufficientCredits extends Error {
  needed: number;
  available: number;
  constructor(needed: number, available: number) {
    super(`needs ${needed} credits, ${available} available`);
    this.needed = needed;
    this.available = available;
  }
}

/** Set aside the most a run could cost. Debits the balance now; unused credits come back on settle. */
export function placeHold(db: DB, userId: number, amount: number, runId: number | null, note?: string): number {
  return db.transaction(() => {
    const available = balance(db, userId);
    if (amount > available) throw new InsufficientCredits(amount, available);
    const { lastInsertRowid } = db
      .prepare("INSERT INTO holds (user_id, run_id, amount) VALUES (?, ?, ?)")
      .run(userId, runId, amount);
    db.prepare("INSERT INTO ledger (user_id, kind, delta, note, run_id) VALUES (?, 'hold', ?, ?, ?)").run(
      userId, -amount, note ?? `Hold for run #${runId ?? "?"}`, runId,
    );
    return Number(lastInsertRowid);
  })();
}

/** Pay one result out of an open hold. Refuses to go past the hold, so a run can't exceed its quote. */
export function chargeFromHold(db: DB, holdId: number, credits: number): boolean {
  const res = db
    .prepare("UPDATE holds SET charged = charged + ? WHERE id = ? AND status = 'open' AND charged + ? <= amount")
    .run(credits, holdId, credits);
  return res.changes === 1;
}

/** Close a hold and return whatever wasn't charged. Safe to call twice: only the first call refunds. */
export function settleHold(db: DB, holdId: number): { charged: number; refunded: number } {
  return db.transaction(() => {
    const hold = db.prepare("SELECT * FROM holds WHERE id = ?").get(holdId) as
      | { user_id: number; run_id: number | null; amount: number; charged: number; status: string }
      | undefined;
    if (!hold) throw new Error(`hold ${holdId} not found`);
    if (hold.status === "settled") return { charged: hold.charged, refunded: 0 };
    const refunded = hold.amount - hold.charged;
    db.prepare("UPDATE holds SET status = 'settled', settled_at = datetime('now') WHERE id = ?").run(holdId);
    if (refunded > 0) {
      db.prepare("INSERT INTO ledger (user_id, kind, delta, note, run_id) VALUES (?, 'release', ?, ?, ?)").run(
        hold.user_id, refunded, hold.run_id ? `Unused credits from run #${hold.run_id}` : "Unused credits returned", hold.run_id,
      );
    }
    return { charged: hold.charged, refunded };
  })();
}

export function ledgerFor(db: DB, userId: number, limit = 100) {
  return db
    .prepare("SELECT id, kind, delta, note, run_id, created_at FROM ledger WHERE user_id = ? ORDER BY id DESC LIMIT ?")
    .all(userId, limit) as { id: number; kind: string; delta: number; note: string; run_id: number | null; created_at: string }[];
}
