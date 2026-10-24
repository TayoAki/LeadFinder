import { json, type DB } from "./db.ts";
import { getCar } from "./cars.ts";

const roundDown = (n: number, step = 100) => Math.max(step, Math.floor(n / step) * step);

export interface OfferPlan { opening: number; walkAway: number; asking: number; value: number; recon: number }

/**
 * Opening offer: the lower of 78% of asking and 70% of value less reconditioning.
 * Walk-away: the most we pay and still clear $1,000 or 12% of value after reconditioning and fees
 * (default fees: Georgia 7% TAVT on value, title, tag and a $200 detail, matching sell.ts).
 */
export function offerPlan(asking: number, value: number, recon: number, fees = Math.round(value * 0.07) + 238): OfferPlan {
  const margin = Math.max(1000, value * 0.12);
  const walkAway = roundDown(Math.min(asking, value - recon - fees - margin));
  const opening = roundDown(Math.min(asking * 0.78, value * 0.7 - recon, walkAway));
  return { opening, walkAway, asking, value, recon };
}

/** Next move after the seller counters: accept, meet in the middle (capped at walk-away), or walk. */
export function nextMove(plan: OfferPlan, lastOffer: number, sellerCounter: number) {
  if (sellerCounter <= plan.walkAway) return { action: "accept" as const, amount: sellerCounter };
  const mid = roundDown((lastOffer + sellerCounter) / 2);
  if (mid > plan.walkAway || mid <= lastOffer) return { action: "final" as const, amount: plan.walkAway };
  return { action: "counter" as const, amount: mid };
}

// Only real condition issues belong in a message to the seller; inspection notes about the listing itself do not.
const NOT_FOR_SELLER = /price|confirm|photos? (look|only)|only \d+ photos|description|scam|vin|staged|mileage not stated|title/i;
const sellerFacing = (flags: string[]) => flags.filter((f) => !NOT_FOR_SELLER.test(f))
  .map((f) => f.replace(/\s*\((photos|seller|odometer photo)\)/gi, "").toLowerCase());

export function draftOpening(o: { title: string; city: string | null; asking: number; amount: number; flags: string[] }) {
  const issues = sellerFacing(o.flags);
  const reason = issues.length
    ? `With the ${issues.slice(0, 2).join(" and the ")}, I'd need to budget for some work.`
    : `I've been comparing a few similar cars nearby.`;
  return `Hi! Is your ${o.title.split("·")[0].trim()} still available? ${reason} ` +
    `Would you take $${o.amount.toLocaleString()} cash? I can come look at it this week${o.city ? ` in ${o.city}` : ""} ` +
    `and pay on the spot if it checks out.`;
}

export function draftCounter(move: ReturnType<typeof nextMove>) {
  if (move.action === "accept") return `That works for me: $${move.amount.toLocaleString()}. When's a good time to see it?`;
  if (move.action === "final") return `I appreciate it. The most I can do is $${move.amount.toLocaleString()} cash, today or tomorrow. Let me know if that works.`;
  return `Thanks for getting back to me. Could you meet me at $${move.amount.toLocaleString()}? I can pay cash right away.`;
}

/** Step 4: draft opening offers for every shortlisted car. Messages are drafts; the user sends them. */
export function draftOffers(db: DB) {
  const rows = db.prepare(`SELECT c.id, c.title, c.city, c.price, v.value, i.recon_estimate, i.red_flags FROM cars c
    JOIN valuations v ON v.car_id = c.id JOIN inspections i ON i.car_id = c.id WHERE i.shortlisted = 1`).all() as Array<{
      id: string; title: string; city: string | null; price: number; value: number; recon_estimate: number; red_flags: string }>;
  const insert = db.prepare("INSERT INTO offers (car_id,direction,amount,message) VALUES (?, 'out', ?, ?)");
  return rows.map((r) => {
    const plan = offerPlan(r.price, r.value, r.recon_estimate);
    const message = draftOpening({ title: r.title, city: r.city, asking: r.price, amount: plan.opening, flags: json<string[]>(r.red_flags, []) });
    // Re-drafting replaces an unsent opening draft; once a negotiation has started, leave the thread alone.
    const started = db.prepare("SELECT 1 FROM offers WHERE car_id = ? AND (direction = 'in' OR status != 'draft')").get(r.id);
    if (!started) {
      db.prepare("DELETE FROM offers WHERE car_id = ? AND direction = 'out' AND status = 'draft'").run(r.id);
      insert.run(r.id, plan.opening, message);
    }
    return { id: r.id, title: r.title, ...plan, message };
  });
}

/** Record the seller's reply and draft our next message. */
export function logReply(db: DB, carId: string, reply: string, counter?: number) {
  const car = getCar(db, carId);
  if (!car) throw new Error(`Unknown car ${carId}`);
  const v = db.prepare("SELECT value FROM valuations WHERE car_id = ?").get(carId) as { value: number } | undefined;
  const i = db.prepare("SELECT recon_estimate FROM inspections WHERE car_id = ?").get(carId) as { recon_estimate: number } | undefined;
  if (!v) throw new Error("Value the car before negotiating");
  db.prepare("INSERT INTO offers (car_id,direction,amount,message,status) VALUES (?, 'in', ?, ?, 'received')").run(carId, counter ?? null, reply);
  if (counter === undefined) return { recorded: true, next: null };
  const last = db.prepare("SELECT amount FROM offers WHERE car_id = ? AND direction = 'out' ORDER BY id DESC LIMIT 1").get(carId) as { amount: number } | undefined;
  const plan = offerPlan(car.price, v.value, i?.recon_estimate ?? 0);
  const move = nextMove(plan, last?.amount ?? plan.opening, counter);
  const message = draftCounter(move);
  db.prepare("INSERT INTO offers (car_id,direction,amount,message) VALUES (?, 'out', ?, ?)").run(carId, move.amount, message);
  return { recorded: true, next: { ...move, message } };
}

export function offerThread(db: DB, carId: string) {
  return db.prepare("SELECT direction, amount, message, status, created_at FROM offers WHERE car_id = ? ORDER BY id").all(carId);
}
