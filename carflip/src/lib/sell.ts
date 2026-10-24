import { json, type DB } from "./db.ts";
import { getCar } from "./cars.ts";
import { offerPlan } from "./offers.ts";

// Georgia: 7% title ad valorem tax on fair market value, $18 title, $20 registration. Override per state.
export const GA_FEES = { tavtRate: 0.07, title: 18, registration: 20 };

export interface ResaleCosts { buy: number; tax: number; titleAndTag: number; recon: number; detail: number; listingFees: number }

/** Hypothetical flip: list at value, assume ~5% negotiation off list, subtract every cost. */
export function resaleMath(o: { buy: number; value: number; recon: number; fees?: typeof GA_FEES }) {
  const f = o.fees ?? GA_FEES;
  const costs: ResaleCosts = {
    buy: o.buy, tax: Math.round(o.value * f.tavtRate), titleAndTag: f.title + f.registration,
    recon: o.recon, detail: 200, listingFees: 0,
  };
  const listPrice = Math.round(o.value / 100) * 100;
  const expectedSale = Math.round(listPrice * 0.95);
  const total = Object.values(costs).reduce((a, b) => a + b, 0);
  return { listPrice, expectedSale, costs, totalCost: total, profit: expectedSale - total };
}

/** Photo improvements: re-shoot plan plus the order to use the seller's existing photos. */
export function photoPlan(photoCount: number) {
  return {
    shots: ["Front 3/4 (driver side), low angle, golden hour", "Rear 3/4 (passenger side)", "Full side profile", "Dashboard, engine running, no warning lights",
      "Odometer close-up", "Front seats from the rear door", "Rear seats", "Trunk / cargo area", "Engine bay (wiped down)", "Each wheel and tire tread", "Any flaws, shown honestly"],
    prep: ["Full wash, tire shine, clean glass", "Vacuum and wipe interior; remove personal items", "Shoot in open shade or at golden hour; avoid noon sun",
      "Plain background (empty lot, park); landscape orientation", "Edit lightly: straighten and correct exposure only. Don't hide damage"],
    note: `Seller's listing has ${photoCount} photos. Re-shoot is recommended before relisting.`,
  };
}

// Inspection notes about the listing (not the car) never go in the ad.
const NOT_A_SELLING_POINT = /vin (shown|label)|description|photos?|odometer shown|seller says|stated/i;
const clean = (s: string) => s.replace(/\s*\((photos|seller|odometer photo)\)/gi, "").trim();

/** Repairs to finish before relisting: condition flags only (not mileage, title or listing-quality notes). */
export function repairList(flags: string[]) {
  return flags.filter((f) => !/miles|title|photos?|description|price|confirm|scam|vin|staged/i.test(f)).map(clean);
}

/** Ad copy that only claims what is true once the repair list is done. */
export function listingCopy(o: { title: string; miles: number | null; positives: string[]; repairs: string[]; price: number }) {
  const lines = [
    `${o.title.split("·")[0].trim()}${o.miles ? `, ${o.miles.toLocaleString()} miles` : ""}. $${o.price.toLocaleString()}.`,
    ...o.positives.filter((p) => !NOT_A_SELLING_POINT.test(p)).map((p) => `• ${clean(p)}`),
    ...(o.repairs.length ? [`• Recently serviced: ${o.repairs.length} ${o.repairs.length === 1 ? "repair" : "repairs"} done (receipts available)`] : []),
    "• Title in hand",
    "Serious buyers only. Happy to meet at a public place or your mechanic.",
  ];
  return lines.join("\n");
}

/** Step 5: plan the resale for one car at an assumed buy price (defaults to our walk-away). Hypothetical. */
export function planResale(db: DB, carId: string, buyPrice?: number) {
  const car = getCar(db, carId);
  if (!car) throw new Error(`Unknown car ${carId}`);
  const v = db.prepare("SELECT value FROM valuations WHERE car_id = ?").get(carId) as { value: number } | undefined;
  const i = db.prepare("SELECT recon_estimate, red_flags, positives FROM inspections WHERE car_id = ?").get(carId) as
    { recon_estimate: number; red_flags: string; positives: string } | undefined;
  if (!v) throw new Error("Value the car before planning a resale");
  const recon = i?.recon_estimate ?? 500;
  const lastAgreed = db.prepare("SELECT amount FROM offers WHERE car_id = ? AND direction = 'out' AND amount IS NOT NULL ORDER BY id DESC LIMIT 1").get(carId) as { amount: number } | undefined;
  const buy = buyPrice ?? lastAgreed?.amount ?? offerPlan(car.price, v.value, recon).walkAway;
  const math = resaleMath({ buy, value: v.value, recon });
  const repairs = repairList(json<string[]>(i?.red_flags, []));
  const listing = listingCopy({ title: car.title, miles: car.miles, positives: json<string[]>(i?.positives, []), repairs, price: math.listPrice });
  const photos = { ...photoPlan(car.photos.length), repairsBeforeListing: repairs };
  db.prepare(`INSERT OR REPLACE INTO resale (car_id,buy_price,list_price,costs,profit,listing,photo_plan) VALUES (?,?,?,?,?,?,?)`)
    .run(carId, buy, math.listPrice, JSON.stringify(math.costs), math.profit, listing, JSON.stringify(photos));
  return { id: carId, title: car.title, hypothetical: true, ...math, listing, photos };
}
