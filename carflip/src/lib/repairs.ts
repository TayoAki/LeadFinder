import Anthropic from "@anthropic-ai/sdk";
import { json, logRun, now, type DB } from "./db.ts";
import { getCar } from "./cars.ts";

export const REPAIR_MODEL = "claude-opus-5-5";

export interface RepairItem { item: string; low: number; high: number; basis: string }
export interface RepairEstimate { items: RepairItem[]; not_assessed: string[]; assumptions: string[] }

/**
 * Save an estimate. It's an estimate, not a quote: stored apart from inspections.repair_estimate (supplied
 * repairs only), and every item must name the evidence it rests on.
 */
export function saveRepairEstimate(db: DB, carId: string, e: RepairEstimate, method: "ai" | "agent" | "manual", model: string | null = null) {
  const items = e.items.filter((i) => i.basis.trim() && i.high >= i.low && i.low >= 0);
  const low = items.reduce((a, i) => a + i.low, 0);
  const high = items.reduce((a, i) => a + i.high, 0);
  db.prepare(`INSERT OR REPLACE INTO repair_estimates (car_id,low,high,items,not_assessed,method,model,assumptions,estimated_at)
    VALUES (?,?,?,?,?,?,?,?,datetime('now'))`).run(carId, Math.round(low), Math.round(high), JSON.stringify(items),
      JSON.stringify(e.not_assessed), method, model, JSON.stringify(e.assumptions));
  return { id: carId, low: Math.round(low), high: Math.round(high), items, not_assessed: e.not_assessed, method };
}

export interface SavedEstimate extends RepairEstimate { car_id: string; low: number; high: number; method: string; model: string | null; estimated_at: string }

export function getRepairEstimate(db: DB, carId: string): SavedEstimate | null {
  const r = db.prepare("SELECT * FROM repair_estimates WHERE car_id = ?").get(carId) as Record<string, any> | undefined;
  return r ? { ...(r as SavedEstimate), items: json<RepairItem[]>(r.items, []), not_assessed: json<string[]>(r.not_assessed, []),
    assumptions: json<string[]>(r.assumptions, []) } : null;
}

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["items", "not_assessed", "assumptions"],
  properties: {
    items: { type: "array", items: { type: "object", additionalProperties: false, required: ["item", "low", "high", "basis"],
      properties: { item: { type: "string" }, low: { type: "number" }, high: { type: "number" },
        basis: { type: "string", description: "The evidence this rests on, e.g. 'photo #4: crushed fender' or 'description: needs 2 sensors'" } } } },
    not_assessed: { type: "array", items: { type: "string" } },
    assumptions: { type: "array", items: { type: "string" } },
  },
} as const;

const SYSTEM = `You estimate used-car repair costs for a buyer in the Atlanta area, from inspection evidence only.
Rules:
- Price only issues the evidence shows or the seller states. Each item's basis quotes that evidence (photo number or description).
- Never invent a problem to be safe. Things the evidence can't show (brakes, tires, fluids, codes, frame) go in not_assessed, unpriced.
- Give a low and high USD range for independent-shop parts and labor (used or aftermarket parts allowed for the low end).
- If no issue is evidenced, return no items.
- assumptions: say what the range assumes (e.g. "no hidden frame damage", "used engine, not rebuilt").`;

/** Step 3 add-on: AI repair estimate from the car's evidence. Needs ANTHROPIC_API_KEY; the result is labeled an estimate. */
export async function aiEstimateRepairs(db: DB, ids: string[], o: { client?: Pick<Anthropic, "beta"> } = {}) {
  const startedAt = now();
  const client = o.client ?? new Anthropic();
  const out = [];
  for (const id of ids) {
    const car = getCar(db, id);
    if (!car) throw new Error(`Unknown car ${id}`);
    const i = db.prepare("SELECT verdict, red_flags, positives, evidence, corrections, photo_count_reviewed, photo_count_available FROM inspections WHERE car_id = ?")
      .get(id) as Record<string, any> | undefined;
    if (!i) { out.push({ id, error: "Review the car first: estimates are built from inspection evidence." }); continue; }
    const facts = {
      car: car.title, year: car.year, miles: car.miles, asking: car.price, description: car.description,
      photos_reviewed: `${i.photo_count_reviewed}/${i.photo_count_available}`, verdict: i.verdict,
      evidence: json(i.evidence, []), red_flags: json(i.red_flags, []), positives: json(i.positives, []), corrections: json(i.corrections, []),
    };
    const res = await client.beta.messages.create({
      model: REPAIR_MODEL,
      max_tokens: 16000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: "medium", format: { type: "json_schema", schema: SCHEMA } },
      system: SYSTEM,
      messages: [{ role: "user", content: `Estimate repairs for this car:\n${JSON.stringify(facts, null, 2)}` }],
    });
    if (res.stop_reason === "refusal") { out.push({ id, error: "The model declined this request." }); continue; }
    const text = res.content.find((b): b is Anthropic.Beta.BetaTextBlock => b.type === "text")?.text;
    if (!text) { out.push({ id, error: `No estimate returned (${res.stop_reason}).` }); continue; }
    const est = JSON.parse(text) as RepairEstimate;
    est.assumptions = [...est.assumptions, `AI estimate (${res.model}) from inspection evidence; not a mechanic's quote`];
    out.push(saveRepairEstimate(db, id, est, "ai", res.model));
  }
  logRun(db, "repairs", startedAt, { source: REPAIR_MODEL, params: { ids }, report: { estimated: out.filter((x: any) => !x.error).length } });
  return out;
}
