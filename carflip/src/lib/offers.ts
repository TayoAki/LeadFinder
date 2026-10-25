import { json, logRun, now, type DB } from "./db.ts";
import { getCar } from "./cars.ts";
import { config } from "./config.ts";

const roundDown = (n: number, step = 100) => Math.max(step, Math.floor(n / step) * step);

export interface OfferPlan {
  asking: number;
  value: number;
  opening: number;
  ceiling: number | null;     // most we'll pay; null when no ceiling is configured
  policy: string;
}

/** Opening offer from the configured policy; ceiling only when one is configured (never derived from guessed costs). */
export function offerPlan(asking: number, value: number, o: { openingPct?: number; ceilingPctOfValue?: number | null; maxOffer?: number } = {}): OfferPlan {
  const pct = o.openingPct ?? config.openingOfferPct;
  const ceilPct = o.ceilingPctOfValue === undefined ? config.offerCeilingPctOfValue : o.ceilingPctOfValue;
  const ceiling = o.maxOffer ?? (ceilPct ? roundDown(Math.min(asking, value * ceilPct)) : null);
  const opening = roundDown(Math.min(asking * pct, ceiling ?? Infinity));
  return { asking, value, opening, ceiling,
    policy: `Opening at ${Math.round(pct * 100)}% of asking${ceiling ? `; ceiling ${ceiling}` : "; no ceiling configured"}` };
}

/**
 * Next move after a counter. Accepting needs a configured ceiling; without one the counter is recorded and
 * a non-binding reply is drafted. A counter above the ceiling is kept and flagged, never accepted.
 */
export function nextMove(plan: OfferPlan, lastOffer: number, sellerCounter: number) {
  if (plan.ceiling === null) return { action: "hold" as const, amount: lastOffer, flag: "No ceiling configured; counter recorded, not accepted" };
  if (sellerCounter <= plan.ceiling) return { action: "within_ceiling" as const, amount: sellerCounter, flag: "Within ceiling; agreeing is not a purchase" };
  const mid = roundDown((lastOffer + sellerCounter) / 2);
  if (mid >= plan.ceiling || mid <= lastOffer) return { action: "final" as const, amount: plan.ceiling, flag: "Counter above ceiling" };
  return { action: "counter" as const, amount: mid, flag: "Counter above ceiling" };
}

// Only condition issues actually observed in the listing are mentioned to the seller.
const NOT_FOR_SELLER = /price|confirm|photos? (look|only)|only \d+ photos|description|scam|vin|staged|mileage not stated|title/i;
const sellerFacing = (flags: string[]) => flags.filter((f) => !NOT_FOR_SELLER.test(f))
  .map((f) => f.replace(/\s*\((photos|seller|odometer photo)\)/gi, "").toLowerCase());

/** Short, respectful, specific. No invented defects, competing offers, urgency or payment promises. */
export function draftOpening(o: { title: string; amount: number; flags: string[] }) {
  const issues = sellerFacing(o.flags);
  const reason = issues.length ? ` From the listing, it looks like the ${issues.slice(0, 2).join(" and the ")} would need attention.` : "";
  return `Hi, is your ${o.title.split("·")[0].trim()} still available?${reason} Would you consider $${o.amount.toLocaleString()}?`;
}

export function draftCounter(move: ReturnType<typeof nextMove>) {
  if (move.action === "hold") return "Thanks for getting back to me. Let me think it over and I'll reply shortly.";
  if (move.action === "within_ceiling") return `Thanks. $${move.amount.toLocaleString()} could work. Could I come see it before we agree?`;
  if (move.action === "final") return `Thanks. The most I could do is $${move.amount.toLocaleString()}.`;
  return `Thanks for the reply. Would you meet me at $${move.amount.toLocaleString()}?`;
}

/** Step 4: draft opening offers for every survivor. Drafts only; nothing here sends a message. */
export function draftOffers(db: DB, o: { openingPct?: number; ceilingPctOfValue?: number | null } = {}) {
  const startedAt = now();
  const rows = db.prepare(`SELECT c.id, c.title, c.price, v.value, i.red_flags FROM cars c
    JOIN valuations v ON v.car_id = c.id JOIN inspections i ON i.car_id = c.id WHERE i.shortlisted = 1 ORDER BY v.discount DESC`).all() as Array<{
      id: string; title: string; price: number; value: number; red_flags: string }>;
  const insert = db.prepare("INSERT INTO offers (car_id,direction,amount,message) VALUES (?, 'out', ?, ?)");
  const out = rows.map((r) => {
    const plan = offerPlan(r.price, r.value, o);
    const message = draftOpening({ title: r.title, amount: plan.opening, flags: json<string[]>(r.red_flags, []) });
    // Re-drafting replaces an unsent opening draft; once a negotiation has started, leave the thread alone.
    const started = db.prepare("SELECT 1 FROM offers WHERE car_id = ? AND (direction = 'in' OR status != 'draft')").get(r.id);
    if (!started) {
      db.prepare("DELETE FROM offers WHERE car_id = ? AND direction = 'out' AND status = 'draft'").run(r.id);
      insert.run(r.id, plan.opening, message);
    }
    return { id: r.id, title: r.title, ...plan, message, status: "draft" };
  });
  logRun(db, "buy", startedAt, { source: "drafts", report: { drafted: out.length, sent: 0, note: "Drafts only. No message was sent; no purchase occurred." } });
  return out;
}

/** Record the seller's reply (and counter) as received evidence, then draft the next message. */
export function logReply(db: DB, carId: string, reply: string, counter?: number) {
  const car = getCar(db, carId);
  if (!car) throw new Error(`Unknown car ${carId}`);
  const v = db.prepare("SELECT value FROM valuations WHERE car_id = ?").get(carId) as { value: number } | undefined;
  if (!v) throw new Error("Value the car before negotiating");
  db.prepare("INSERT INTO offers (car_id,direction,amount,message,status) VALUES (?, 'in', ?, ?, 'received')").run(carId, counter ?? null, reply);
  if (counter === undefined) return { recorded: true, next: null };
  const last = db.prepare("SELECT amount FROM offers WHERE car_id = ? AND direction = 'out' ORDER BY id DESC LIMIT 1").get(carId) as { amount: number } | undefined;
  const plan = offerPlan(car.price, v.value);
  const move = nextMove(plan, last?.amount ?? plan.opening, counter);
  const message = draftCounter(move);
  db.prepare("INSERT INTO offers (car_id,direction,amount,message) VALUES (?, 'out', ?, ?)").run(carId, move.action === "hold" ? null : move.amount, message);
  return { recorded: true, purchase: false, next: { ...move, message } };
}

export function offerThread(db: DB, carId: string) {
  return db.prepare("SELECT direction, amount, message, status, created_at FROM offers WHERE car_id = ? ORDER BY id").all(carId);
}
