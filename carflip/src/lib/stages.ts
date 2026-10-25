import { logRun, now, type DB } from "./db.ts";
import { valueCars } from "./value.ts";
import { inspectTop, shortlist } from "./inspect.ts";
import { draftOffers } from "./offers.ts";
import { planResale } from "./sell.ts";
import type { Fetch } from "./apify.ts";

export const STAGES = ["find", "value", "inspect", "buy", "sell"] as const;
export type Stage = (typeof STAGES)[number];

/** The furthest step a car has reached: found, valued, reviewed, shortlisted (negotiating), resale planned. */
export function stageOf(r: { value: number | null; review_method: string | null; shortlisted: number | null; scenarios?: string | unknown[] | null }): Stage {
  const planned = Array.isArray(r.scenarios) ? r.scenarios.length > 0 : !!r.scenarios && r.scenarios !== "[]";
  if (r.shortlisted && planned) return "sell";
  if (r.shortlisted) return "buy";
  if (r.review_method) return "inspect";
  if (r.value !== null && r.value !== undefined) return "value";
  return "find";
}

function current(db: DB, id: string) {
  const r = db.prepare(`SELECT c.id, v.value, i.method AS review_method, i.shortlisted, r.scenarios FROM cars c
    LEFT JOIN valuations v ON v.car_id = c.id LEFT JOIN inspections i ON i.car_id = c.id LEFT JOIN resale r ON r.car_id = c.id
    WHERE c.id = ?`).get(id) as Parameters<typeof stageOf>[0] & { id: string } | undefined;
  if (!r) throw new Error(`Unknown car ${id}`);
  return r;
}

/**
 * Move cars to a stage. Forward runs the missing steps; backward clears later work (drafts, plans) for those cars.
 * Buy still needs a complete, evidence-backed "promising" review: moving forward can't skip the evidence.
 */
export async function moveToStage(db: DB, ids: string[], to: Stage, deps: { fetchImpl?: Fetch; token?: string } = {}) {
  const startedAt = now();
  const results: Array<{ id: string; from: Stage; to: Stage; ok: boolean; note?: string }> = [];
  const clear = (id: string, tables: string[]) => {
    for (const t of tables) {
      if (t === "offers") db.prepare("DELETE FROM offers WHERE car_id = ? AND status = 'draft' AND direction = 'out'").run(id);
      else db.prepare(`DELETE FROM ${t} WHERE car_id = ?`).run(id);
    }
  };
  // Value any that still need it in one KBB call.
  const toValue = to === "find" ? [] : ids.filter((id) => current(db, id).value === null || current(db, id).value === undefined);
  if (toValue.length) await valueCars(db, { ...deps, ids: toValue });
  for (const id of ids) {
    const from = stageOf(current(db, id));
    const at = STAGES.indexOf(from), target = STAGES.indexOf(to);
    let ok = true, note: string | undefined;
    if (target < at) {
      // Backward: undo what comes after the target.
      if (to === "find") clear(id, ["resale", "offers", "repair_estimates", "inspections", "valuations"]);
      else if (to === "value") clear(id, ["resale", "offers", "repair_estimates", "inspections"]);
      else if (to === "inspect") {
        clear(id, ["resale", "offers"]);
        db.prepare("UPDATE inspections SET verdict = 'needs_review', shortlisted = 0 WHERE car_id = ?").run(id);
      } else if (to === "buy") clear(id, ["resale"]);
    } else if (target > at) {
      const r = current(db, id);
      if (r.value === null || r.value === undefined) { ok = false; note = "No KBB value found, so it can't move past Find."; }
      else {
        if (target >= 2 && !r.review_method) await inspectTop(db, { ids: [id] });
        if (target >= 3) {
          if (!shortlist(db).includes(id)) { ok = false; note = "Needs a complete review (every photo + description) with a promising verdict before Buy."; }
          else {
            const drafted = db.prepare("SELECT 1 FROM offers WHERE car_id = ?").get(id);
            if (!drafted) draftOffers(db, { ids: [id] });
            if (target >= 4) planResale(db, id);
          }
        }
      }
    }
    results.push({ id, from, to: stageOf(current(db, id)), ok, note });
  }
  logRun(db, "move", startedAt, { source: "user", params: { ids, to }, report: { moved: results.filter((r) => r.ok).length, blocked: results.filter((r) => !r.ok).length } });
  return results;
}
