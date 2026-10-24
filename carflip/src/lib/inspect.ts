import type { DB } from "./db.ts";
import { getCar } from "./cars.ts";
import { rankedByDiscount } from "./value.ts";
import type { Car } from "./find.ts";
import type { Fetch } from "./apify.ts";

export interface Inspection {
  score: number;            // 0-100, higher is a safer flip
  verdict: string;
  red_flags: string[];
  positives: string[];
  recon_estimate: number;   // rough $ to make it sellable
  method: "rules" | "ai" | "agent";
}

// Description red flags, the points they cost and a rough reconditioning cost.
const FLAGS: Array<[RegExp, string, number, number]> = [
  [/\b(salvage|rebuilt|branded|flood|bonded) title\b|\bno title\b|\btitle (issue|problem)/i, "Title problem (salvage/rebuilt/missing)", 45, 0],
  [/\b(blown|bad|slipping|needs?( a)?( new)?) (motor|engine|transmission|trans)\b|\btransmission (issue|problem|slip)|\b(engine|motor) (replacement|swap needed)|\brod (bearing|knock)|\bhead gasket|\bmotor (malo|fundido)|\bnecesita motor/i, "Engine or transmission problem", 40, 2500],
  [/\b(check engine|cel|engine light)\b/i, "Check-engine light", 15, 600],
  [/\b(won'?t|will not|does ?n[o']t) (pass )?(emissions?|start|crank|run)\b|\bcatalytic\b/i, "Fails emissions / won't start", 25, 1200],
  [/\boverheat/i, "Overheating", 25, 900],
  [/\b(frame|rust|rot)\b/i, "Rust or frame damage", 20, 1000],
  [/\b(accident|wreck|hail|body damage|dent|fender|golpe|golpeado|choque|chocado)\b/i, "Body damage or accident history", 10, 700],
  [/\b(as[- ]is|mechanic special|project|needs work)\b/i, "Sold as-is / needs work", 15, 800],
  [/\b(airbag|srs|bolsas?( de aire| laterales)?)\b/i, "Airbag / SRS issue (check for deployed airbags)", 15, 1200],
  [/\b(sensores?|sensor)\b.*\b(cambiar|falta|malo)|\bfalta (cambiar|arreglar)/i, "Needs repairs (seller says sensors/parts to replace)", 10, 500],
  [/\bac (doesn'?t|not) (work|blow)|\bneeds? (a )?(freon|ac)\b/i, "A/C not working", 8, 500],
];
const GOOD: Array<[RegExp, string]> = [
  [/\bclean title\b/i, "Clean title stated"], [/\b(one|1|single) owner\b/i, "One owner"],
  [/\b(service|maintenance) records?\b/i, "Service records"], [/\bnew (tires|brakes|battery)\b/i, "Recent wear items replaced"],
  [/\b(runs|drives) (great|excellent|perfect|good)\b/i, "Seller says it runs well"], [/\bno (accidents|issues|leaks)\b/i, "No known issues stated"],
];

// Drop negated mentions ("no check engine light", "no accidents") before matching red flags.
const stripNegations = (d: string) => d.replace(/\b(no|not|never|without|sin|nunca)\s+(\w+\s+){0,2}?(check engine( light)?|cel|accidents?|issues?|leaks?|rust|damage|golpes?)\b/gi, " ");

export function ruleInspect(car: Pick<Car, "description" | "photos" | "miles">): Inspection {
  const raw = car.description ?? "";
  const d = stripNegations(raw);
  let score = 80, recon = 300;
  const red: string[] = [], pos: string[] = [];
  for (const [re, label, pts, cost] of FLAGS) if (re.test(d)) { red.push(label); score -= pts; recon += cost; }
  for (const [re, label] of GOOD) if (re.test(raw)) { pos.push(label); score += 4; }
  if (car.photos.length < 5) { red.push(`Only ${car.photos.length} photos`); score -= 10; }
  if (raw.trim().length < 60) { red.push("Very short description"); score -= 8; }
  if (car.miles === null) { red.push("Mileage not stated"); score -= 5; }
  score = Math.max(0, Math.min(100, score));
  return { score, verdict: score >= 70 ? "promising" : score >= 45 ? "caution" : "pass", red_flags: red, positives: pos, recon_estimate: recon, method: "rules" };
}

/** Vision review through OpenRouter: up to 8 photos plus the description, returned as an Inspection. */
export async function aiInspect(car: Car, o: { apiKey: string; model?: string; fetchImpl?: Fetch }): Promise<Inspection> {
  const prompt = `You are inspecting a used-car listing for a flipper. Look at every photo and read the description.
Return only JSON: {"score":0-100,"verdict":"promising|caution|pass","red_flags":[...],"positives":[...],"recon_estimate":dollars}.
Flag anything visible: warning lights on the dash, rust, mismatched paint, panel gaps, tire wear, interior damage, smoke, leaks, missing parts.
Listing: ${car.title}, $${car.price}, ${car.miles ?? "unknown"} miles.\nDescription: ${car.description.slice(0, 2500)}`;
  const content = [{ type: "text", text: prompt }, ...car.photos.slice(0, 8).map((url) => ({ type: "image_url", image_url: { url } }))];
  const res = await (o.fetchImpl ?? fetch)("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${o.apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: o.model ?? "anthropic/claude-haiku-5.5", messages: [{ role: "user", content }], response_format: { type: "json_object" } }),
  });
  const body = await res.json();
  const text: string = body?.choices?.[0]?.message?.content ?? "";
  const parsed = JSON.parse(text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1));
  return {
    score: Math.max(0, Math.min(100, Math.round(Number(parsed.score) || 0))), verdict: String(parsed.verdict ?? "caution"),
    red_flags: (parsed.red_flags ?? []).map(String), positives: (parsed.positives ?? []).map(String),
    recon_estimate: Math.round(Number(parsed.recon_estimate) || 0), method: "ai",
  };
}

export function saveInspection(db: DB, carId: string, i: Inspection) {
  db.prepare(`INSERT INTO inspections (car_id,score,verdict,red_flags,positives,recon_estimate,method) VALUES (?,?,?,?,?,?,?)
    ON CONFLICT(car_id) DO UPDATE SET score=excluded.score, verdict=excluded.verdict, red_flags=excluded.red_flags,
      positives=excluded.positives, recon_estimate=excluded.recon_estimate, method=excluded.method, inspected_at=datetime('now')`)
    .run(carId, i.score, i.verdict, JSON.stringify(i.red_flags), JSON.stringify(i.positives), i.recon_estimate, i.method);
}

/** Pick the shortlist: among inspected cars, rank by discount after reconditioning, weighted by inspection score. */
export function shortlist(db: DB, keep = 4) {
  const rows = db.prepare(`SELECT c.id, c.price, v.value, i.score, i.recon_estimate, i.verdict FROM cars c
    JOIN valuations v ON v.car_id = c.id JOIN inspections i ON i.car_id = c.id`).all() as Array<{
      id: string; price: number; value: number; score: number; recon_estimate: number; verdict: string }>;
  const ranked = rows.filter((r) => r.verdict !== "pass")
    .map((r) => ({ ...r, net: r.value - r.price - r.recon_estimate }))
    // "promising" beats "caution" outright; within a verdict, rank by net discount weighted by score.
    .sort((a, b) => Number(b.verdict === "promising") - Number(a.verdict === "promising")
      || b.net * (b.score / 100) - a.net * (a.score / 100));
  const pick = new Set(ranked.slice(0, keep).filter((r) => r.net > 0).map((r) => r.id));
  db.transaction(() => {
    db.prepare("UPDATE inspections SET shortlisted = 0").run();
    for (const id of pick) db.prepare("UPDATE inspections SET shortlisted = 1 WHERE car_id = ?").run(id);
  })();
  return [...pick];
}

/** Step 3: inspect the top N by discount (AI when a key is set, otherwise rules), then shortlist `keep`. */
export async function inspectTop(db: DB, o: { top?: number; keep?: number; apiKey?: string; model?: string; fetchImpl?: Fetch } = {}) {
  const apiKey = o.apiKey ?? process.env.OPENROUTER_API_KEY;
  const top = rankedByDiscount(db).slice(0, o.top ?? 10);
  const results: Array<{ id: string; title: string } & Inspection> = [];
  for (const t of top) {
    const car = getCar(db, t.id)!;
    let i = ruleInspect(car);
    if (apiKey) {
      try { i = await aiInspect(car, { apiKey, model: o.model, fetchImpl: o.fetchImpl }); } catch { /* keep rule result */ }
    }
    saveInspection(db, car.id, i);
    results.push({ id: car.id, title: car.title, ...i });
  }
  return { inspected: results, shortlisted: shortlist(db, o.keep ?? 4) };
}
