import type { DB } from "./db.ts";
import { runActor, type Fetch } from "./apify.ts";
import { loadCars } from "./cars.ts";
import type { Car } from "./find.ts";

export const KBB_ACTOR = "devilscrapes/kelley-blue-book-valuation-scraper";
export const KBB_MIN_YEAR = 1990;

export interface KbbRow {
  make: string; model: string; year: number; trim?: string;
  fair_purchase_price?: number; offer_price?: number; offer_max_price?: number; source_url?: string;
}

/** KBB url slug: "Grand Cherokee" -> "grand-cherokee", "F-150" -> "f-150". */
export const slug = (s: string) => s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const words = (s: string | null) => new Set((s ?? "").toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 1));

/** Pick the KBB trim row that shares the most words with the listing; ties go to the median-priced row. */
export function pickTrim(car: Pick<Car, "trim" | "title">, rows: KbbRow[]): KbbRow | null {
  const priced = rows.filter((r) => r.fair_purchase_price).sort((a, b) => a.fair_purchase_price! - b.fair_purchase_price!);
  if (!priced.length) return null;
  const want = words(`${car.trim ?? ""} ${car.title}`);
  const scored = priced.map((r) => ({ r, s: [...words(r.trim ?? "")].filter((w) => want.has(w)).length }));
  const best = Math.max(...scored.map((x) => x.s));
  const top = scored.filter((x) => x.s === best).map((x) => x.r);
  return top[Math.floor((top.length - 1) / 2)];
}

/** KBB's fair price assumes typical miles (~12k/yr). Adjust $0.05 per mile of difference, capped at ±25% of base. */
export function mileageAdjustment(base: number, year: number, miles: number | null, now = new Date().getFullYear()): number {
  if (miles === null) return 0;
  const expected = 12000 * Math.max(1, now - year);
  const raw = (expected - miles) * 0.05;
  const cap = base * 0.25;
  return Math.round(Math.max(-cap, Math.min(cap, raw)) / 50) * 50;
}

/** Step 2: value every saved car that has year/make/model, then rank by discount to value. */
export async function valueCars(db: DB, deps: { fetchImpl?: Fetch; token?: string } = {}) {
  const all = loadCars(db).filter((c) => c.year && c.make && c.model);
  // KBB only covers 1990 onward; classics need a collector guide (e.g. Hagerty) instead.
  const classics = all.filter((c) => c.year! < KBB_MIN_YEAR).map((c) => c.title);
  const cars = all.filter((c) => c.year! >= KBB_MIN_YEAR);
  const keys = new Map<string, { make: string; model: string; year: number }>();
  for (const c of cars) keys.set(`${slug(c.make!)}/${slug(c.model!)}/${c.year}`, { make: slug(c.make!), model: slug(c.model!), year: c.year! });
  const vehicles = [...keys.values()];
  const rows: KbbRow[] = [];
  for (let i = 0; i < vehicles.length; i += 50) {
    rows.push(...await runActor<KbbRow>(KBB_ACTOR, { vehicles: vehicles.slice(i, i + 50), proxyConfiguration: { useApifyProxy: true } }, deps));
  }
  const byKey = new Map<string, KbbRow[]>();
  for (const r of rows) {
    const k = `${slug(r.make)}/${slug(r.model)}/${r.year}`;
    byKey.set(k, [...(byKey.get(k) ?? []), r]);
  }
  const save = db.prepare(`INSERT OR REPLACE INTO valuations (car_id,kbb_trim,kbb_fair,kbb_offer,kbb_offer_max,mileage_adj,value,discount,discount_pct,source_url)
    VALUES (?,?,?,?,?,?,?,?,?,?)`);
  let valued = 0;
  const missing: string[] = [];
  db.transaction(() => {
    for (const c of cars) {
      const row = pickTrim(c, byKey.get(`${slug(c.make!)}/${slug(c.model!)}/${c.year}`) ?? []);
      if (!row) { missing.push(c.title); continue; }
      const base = row.fair_purchase_price!;
      const adj = mileageAdjustment(base, c.year!, c.miles);
      const value = base + adj;
      const discount = value - c.price;
      save.run(c.id, row.trim ?? null, base, row.offer_price ?? null, row.offer_max_price ?? null, adj, value, discount,
        Math.round((discount / value) * 1000) / 10, row.source_url ?? null);
      valued++;
    }
  })();
  return { valued, missing, classics, ranked: rankedByDiscount(db) };
}

export function rankedByDiscount(db: DB) {
  return db.prepare(`SELECT c.id, c.title, c.price, c.miles, c.city, c.url, v.kbb_fair, v.mileage_adj, v.value, v.discount, v.discount_pct
    FROM cars c JOIN valuations v ON v.car_id = c.id ORDER BY v.discount_pct DESC`).all() as Array<{
      id: string; title: string; price: number; miles: number | null; city: string | null; url: string;
      kbb_fair: number; mileage_adj: number; value: number; discount: number; discount_pct: number }>;
}
