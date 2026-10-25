import { logRun, now, type DB } from "./db.ts";
import { config } from "./config.ts";
import { runActor, type Fetch } from "./apify.ts";
import { loadCars } from "./cars.ts";
import type { Car } from "./find.ts";

export const KBB_ACTOR = "devilscrapes/kelley-blue-book-valuation-scraper";
export const KBB_MIN_YEAR = 1990;

export interface KbbRow {
  make: string; model: string; year: number; trim?: string;
  fair_purchase_price?: number; fair_market_price_low?: number; fair_market_price_high?: number;
  offer_price?: number; offer_max_price?: number; source_url?: string; scraped_at?: string;
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

/** What a valuation assumed. A listing's mileage and condition are recorded, never used to alter KBB's number. */
export function valuationAssumptions(car: Pick<Car, "trim" | "miles" | "title">, row: KbbRow): string[] {
  const out = [`Value type: KBB Fair Purchase Price for ${row.year} ${row.make} ${row.model}${row.trim ? ` ${row.trim}` : ""}`];
  out.push(car.trim && row.trim && words(row.trim).size && [...words(row.trim)].every((w) => words(`${car.trim} ${car.title}`).has(w))
    ? "Trim matched the listing" : `Trim not confirmed: listing says "${car.trim ?? "no trim"}", KBB row used is "${row.trim ?? "unspecified"}"`);
  out.push(car.miles === null ? "Mileage unknown" : `Not adjusted for the listing's ${car.miles.toLocaleString()} miles`);
  out.push("Condition and ZIP not supplied to KBB");
  return out;
}

/** Step 2: value every saved car that has year/make/model, then rank by raw dollar gap (KBB value - asking). */
export async function valueCars(db: DB, deps: { fetchImpl?: Fetch; token?: string; ids?: string[] } = {}) {
  const startedAt = now();
  const all = loadCars(db).filter((c) => c.year && c.make && c.model && (!deps.ids?.length || deps.ids.includes(c.id)));
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
  const save = db.prepare(`INSERT OR REPLACE INTO valuations (car_id,kbb_trim,kbb_fair,kbb_offer,kbb_offer_max,mileage_adj,value,discount,discount_pct,
      source_url,value_type,range_low,range_high,assumptions,conditional,captured_at)
    VALUES (?,?,?,?,?,0,?,?,?,?,?,?,?,?,?,?)`);
  let valued = 0;
  const missing: Array<{ title: string; reason: string }> = classics.map((title) => ({ title, reason: `KBB covers ${KBB_MIN_YEAR}+ only` }));
  db.transaction(() => {
    for (const c of cars) {
      const row = pickTrim(c, byKey.get(`${slug(c.make!)}/${slug(c.model!)}/${c.year}`) ?? []);
      if (!row) { missing.push({ title: c.title, reason: "No KBB row for this year/make/model" }); continue; }
      const value = row.fair_purchase_price!;
      const gap = value - c.price;
      const assumptions = valuationAssumptions(c, row);
      save.run(c.id, row.trim ?? null, value, row.offer_price ?? null, row.offer_max_price ?? null, value, gap,
        Math.round((gap / value) * 1000) / 10, row.source_url ?? null, config.valueType,
        row.fair_market_price_low ?? null, row.fair_market_price_high ?? null, JSON.stringify(assumptions),
        assumptions.some((a) => /not confirmed|unknown|not supplied|not adjusted/i.test(a)) ? 1 : 0, row.scraped_at ?? now());
      valued++;
    }
  })();
  const report = { valued, missing, valueType: config.valueType, rankedBy: "dollar gap (KBB value - asking)",
    note: "A local rank doesn't prove the KBB figures are right; each valuation keeps its source URL, capture time and assumptions." };
  logRun(db, "value", startedAt, { source: KBB_ACTOR, report });
  return { ...report, classics, ranked: rankedByDiscount(db) };
}

/** Ranked by raw dollar gap (KBB value - asking), highest first, as in the article. */
export function rankedByDiscount(db: DB) {
  return db.prepare(`SELECT c.id, c.title, c.price, c.miles, c.city, c.url, v.value, v.value_type, v.discount, v.discount_pct,
      v.source_url, v.captured_at, v.assumptions, v.conditional
    FROM cars c JOIN valuations v ON v.car_id = c.id ORDER BY v.discount DESC`).all() as Array<{
      id: string; title: string; price: number; miles: number | null; city: string | null; url: string; value: number; value_type: string;
      discount: number; discount_pct: number; source_url: string | null; captured_at: string | null; assumptions: string; conditional: number }>;
}
