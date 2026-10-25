import { json, logRun, now, type DB } from "./db.ts";
import { getCar } from "./cars.ts";
import { config } from "./config.ts";
import { offerPlan } from "./offers.ts";
import { getRepairEstimate } from "./repairs.ts";

const cents = (n: number) => Math.round(n * 100) / 100;

export interface Scenario {
  label: string;
  purchase: number;
  resale: number;
  repairs: number | null;     // null = not supplied (listed in unprovided costs, not treated as zero)
  tax: number;
  otherCosts: number;
  profitBeforeUnprovided: number;
}

/**
 * The article's model: resale - purchase - repairs - tax - other supplied costs.
 * Tax is the article's simplified 6.25% of purchase price, an example assumption rather than a tax determination.
 */
export function scenario(label: string, o: { purchase: number; resale: number; repairs: number | null; otherCosts?: number; taxRate?: number }): Scenario {
  const tax = cents(o.purchase * (o.taxRate ?? config.taxRate));
  const other = o.otherCosts ?? 0;
  return { label, purchase: o.purchase, resale: o.resale, repairs: o.repairs, tax, otherCosts: other,
    profitBeforeUnprovided: cents(o.resale - o.purchase - (o.repairs ?? 0) - tax - other) };
}

export function unprovidedCosts(repairs: number | null, otherCosts?: number) {
  return [...(repairs === null ? ["repairs (no estimate supplied)"] : []), ...(otherCosts === undefined ? config.unprovidedCostNames : [])];
}

/** Photo improvements: a re-shoot plan. Edits may improve presentation but never remove damage or imply repairs. */
export function photoPlan(photoCount: number) {
  return {
    shots: ["Front 3/4 (driver side), low angle", "Rear 3/4 (passenger side)", "Full side profile", "Dashboard with engine running",
      "Odometer close-up", "Front seats", "Rear seats", "Trunk / cargo area", "Engine bay", "Each wheel and tire tread", "Every flaw, shown honestly"],
    prep: ["Wash, clean glass, vacuum the interior", "Shoot in open shade; avoid noon sun", "Plain background; landscape orientation",
      "Edit for exposure and crop only; compare each edit to the original and reject any that hides damage"],
    note: `Original listing has ${photoCount} photos; originals are kept unchanged.`,
  };
}

// Inspection notes about the listing (not the car) never go in the ad.
const NOT_A_FACT = /vin (shown|label)|description|photos?|odometer shown|staged|scam/i;
const clean = (s: string) => s.replace(/\s*\((photos|seller|odometer photo)\)/gi, "").trim();

/** Ad draft from supported facts and disclosures only; anything still to confirm is marked [confirm]. Not published. */
export function listingCopy(o: { title: string; miles: number | null; disclosures: string[]; price: number }) {
  const facts = [`${o.title.split("·")[0].trim()}${o.miles ? `, ${o.miles.toLocaleString()} miles [confirm odometer]` : ", mileage [confirm]"}. $${o.price.toLocaleString()}.`];
  const disclose = o.disclosures.filter((d) => !NOT_A_FACT.test(d)).map((d) => `• Known issue: ${clean(d)} [state whether repaired]`);
  return [...facts, ...disclose, "• Title status [confirm before listing]", "Happy to meet at a public place or your mechanic."].join("\n");
}

/** Step 5: hypothetical resale for one car, at the opening offer, the latest counter and any supplied price. */
export function planResale(db: DB, carId: string, buyPrice?: number, o: { repairs?: number; otherCosts?: number } = {}) {
  const startedAt = now();
  const car = getCar(db, carId);
  if (!car) throw new Error(`Unknown car ${carId}`);
  const v = db.prepare("SELECT value, value_type, source_url, captured_at FROM valuations WHERE car_id = ?").get(carId) as
    { value: number; value_type: string | null; source_url: string | null; captured_at: string | null } | undefined;
  if (!v) throw new Error("Value the car before planning a resale");
  const i = db.prepare("SELECT red_flags, repair_estimate FROM inspections WHERE car_id = ?").get(carId) as
    { red_flags: string; repair_estimate: number | null } | undefined;
  const repairs = o.repairs ?? i?.repair_estimate ?? null;
  const opening = (db.prepare("SELECT amount FROM offers WHERE car_id = ? AND direction = 'out' AND amount IS NOT NULL ORDER BY id LIMIT 1").get(carId) as
    { amount: number } | undefined)?.amount ?? offerPlan(car.price, v.value).opening;
  const counter = (db.prepare("SELECT amount FROM offers WHERE car_id = ? AND direction = 'in' AND amount IS NOT NULL ORDER BY id DESC LIMIT 1").get(carId) as
    { amount: number } | undefined)?.amount;
  const scenarios = [
    scenario(`Opening offer $${opening.toLocaleString()}`, { purchase: opening, resale: v.value, repairs, otherCosts: o.otherCosts }),
    ...(counter ? [scenario(`Seller counter $${counter.toLocaleString()}`, { purchase: counter, resale: v.value, repairs, otherCosts: o.otherCosts })] : []),
    ...(buyPrice ? [scenario(`Supplied price $${buyPrice.toLocaleString()}`, { purchase: buyPrice, resale: v.value, repairs, otherCosts: o.otherCosts })] : []),
    scenario(`Asking price $${car.price.toLocaleString()}`, { purchase: car.price, resale: v.value, repairs, otherCosts: o.otherCosts }),
  ];
  // A repair estimate (AI or agent) is shown as its own scenario, never folded into the supplied-cost figures.
  const est = repairs === null ? getRepairEstimate(db, carId) : null;
  if (est && est.items.length) scenarios.splice(1, 0,
    scenario(`Opening offer + estimated repairs (high, $${est.high.toLocaleString()})`, { purchase: opening, resale: v.value, repairs: est.high, otherCosts: o.otherCosts }));
  const unprovided = unprovidedCosts(repairs, o.otherCosts);
  if (est) unprovided[0] = est.high === 0
    ? `repairs: none evidenced (${est.method} estimate); not assessed: ${est.not_assessed.join(", ") || "nothing listed"}`
    : `repairs: ${est.method} estimate $${est.low.toLocaleString()}–$${est.high.toLocaleString()} only, not a quote`;
  const assumptions = [
    `Resale = KBB value $${v.value.toLocaleString()} (${v.value_type ?? "value type not recorded"}${v.captured_at ? `, captured ${v.captured_at}` : ""})`,
    `Tax = ${(config.taxRate * 100).toFixed(2)}% of purchase price (the article's simplified assumption, not a tax determination)`,
    "Hypothetical: no purchase or sale has occurred",
  ];
  const listing = listingCopy({ title: car.title, miles: car.miles, disclosures: json<string[]>(i?.red_flags, []), price: Math.round(v.value / 100) * 100 });
  const photos = photoPlan(car.photos.length);
  const primary = scenarios[counter ? 1 : 0];
  db.prepare(`INSERT OR REPLACE INTO resale (car_id,buy_price,list_price,costs,profit,listing,photo_plan,scenarios,unprovided_costs,assumptions)
    VALUES (?,?,?,?,?,?,?,?,?,?)`).run(carId, primary.purchase, v.value, JSON.stringify({ repairs, tax: primary.tax, other: primary.otherCosts }),
      Math.round(primary.profitBeforeUnprovided), listing, JSON.stringify(photos), JSON.stringify(scenarios), JSON.stringify(unprovided), JSON.stringify(assumptions));
  logRun(db, "sell", startedAt, { params: { carId, buyPrice, ...o }, report: { scenarios: scenarios.length, unprovided } });
  return { id: carId, title: car.title, hypothetical: true, resale: v.value, scenarios, unprovidedCosts: unprovided, assumptions, listing, photos };
}
