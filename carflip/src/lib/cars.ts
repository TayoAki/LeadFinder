import { json, type DB } from "./db.ts";
import { stageOf } from "./stages.ts";
import type { Car } from "./find.ts";

export function loadCars(db: DB): Car[] {
  return (db.prepare("SELECT * FROM cars ORDER BY created_at, id").all() as Array<Car & { photos: string }>)
    .map((r) => ({ ...r, photos: json<string[]>(r.photos, []) }));
}

export function getCar(db: DB, id: string): Car | null {
  const r = db.prepare("SELECT * FROM cars WHERE id = ?").get(id) as (Car & { photos: string }) | undefined;
  return r ? { ...r, photos: json<string[]>(r.photos, []) } : null;
}

/** Everything known about each car, one row per car, for the UI and the MCP list tool. */
export function pipeline(db: DB) {
  const rows = db.prepare(`SELECT c.id, c.title, c.price, c.miles, c.city, c.url, c.photos, c.captured_at, c.seller_type,
      v.value, v.value_type, v.discount, v.discount_pct, v.source_url AS value_source, v.captured_at AS valued_at, v.assumptions, v.conditional,
      i.score, i.verdict, i.red_flags, i.evidence, i.shortlisted, i.photo_count_available, i.photo_count_reviewed,
      i.description_reviewed, i.photo_review_complete, i.repair_estimate, i.method AS review_method,
      r.list_price, r.profit, r.scenarios, r.unprovided_costs,
      e.low AS repair_low, e.high AS repair_high, e.method AS repair_method,
      (SELECT amount FROM offers o WHERE o.car_id = c.id AND o.direction = 'out' ORDER BY o.id DESC LIMIT 1) AS last_offer,
      (SELECT amount FROM offers o WHERE o.car_id = c.id AND o.direction = 'in' ORDER BY o.id DESC LIMIT 1) AS last_counter
    FROM cars c
    LEFT JOIN valuations v ON v.car_id = c.id
    LEFT JOIN inspections i ON i.car_id = c.id
    LEFT JOIN resale r ON r.car_id = c.id
    LEFT JOIN repair_estimates e ON e.car_id = c.id
    ORDER BY COALESCE(v.discount, -1e9) DESC`).all() as Array<Record<string, any>>;
  return rows.map((r): Record<string, any> => ({ ...r, stage: stageOf(r as any), photos: json<string[]>(r.photos, []).slice(0, 1), red_flags: json<string[]>(r.red_flags, []),
    evidence: json<unknown[]>(r.evidence, []), assumptions: json<string[]>(r.assumptions, []),
    scenarios: json<unknown[]>(r.scenarios, []), unprovided_costs: json<string[]>(r.unprovided_costs, []) }));
}
