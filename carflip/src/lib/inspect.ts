import { json, logRun, now, type DB } from "./db.ts";
import { getCar } from "./cars.ts";
import { rankedByDiscount } from "./value.ts";
import { config } from "./config.ts";
import type { Car } from "./find.ts";
import type { Fetch } from "./apify.ts";

/**
 * The article's four outcomes for a listing review.
 * promising: no evidence explains the low price. cheap_for_reason: the photos or description explain it.
 * sold: the listing is sold or pending. needs_review: the review is incomplete or the evidence is unclear.
 */
export const VERDICTS = ["promising", "cheap_for_reason", "sold", "needs_review"] as const;
export type Verdict = (typeof VERDICTS)[number];

/** One observation tied to where it was seen: a photo number or the description. */
export interface Observation { source: string; note: string }

export interface Inspection {
  verdict: Verdict;
  score: number;                     // 0-100 ordering aid within a verdict; not a mechanical rating
  red_flags: string[];
  positives: string[];
  evidence: Observation[];
  photo_count_available: number;
  photo_count_reviewed: number;
  description_reviewed: boolean;
  repair_estimate: number | null;    // only when someone supplies a figure; never invented
  corrections: string[];             // e.g. corrected mileage or trim, which invalidates the valuation
  method: "rules" | "ai" | "agent";
}

export const reviewComplete = (i: Pick<Inspection, "photo_count_available" | "photo_count_reviewed" | "description_reviewed">) =>
  i.description_reviewed && i.photo_count_available > 0 && i.photo_count_reviewed >= i.photo_count_available;

// Description red flags and the points they cost. Points order cars; they price nothing.
const FLAGS: Array<[RegExp, string, number]> = [
  [/\b(salvage|rebuilt|branded|flood|bonded) title\b|\bno title\b|\btitle (issue|problem)/i, "Title problem (salvage/rebuilt/missing)", 45],
  [/\b(blown|bad|slipping|needs?( a)?( new)?) (motor|engine|transmission|trans)\b|\btransmission (issue|problem|slip)|\b(engine|motor) (replacement|swap needed)|\brod (bearing|knock)|\bhead gasket|\bmotor (malo|fundido)|\bnecesita motor/i, "Engine or transmission problem", 40],
  [/\b(check engine|cel|engine light)\b/i, "Check-engine light", 15],
  [/\b(won'?t|will not|does ?n[o']t) (pass )?(emissions?|start|crank|run)\b|\bcatalytic\b/i, "Fails emissions / won't start", 25],
  [/\boverheat/i, "Overheating", 25],
  [/\b(frame|rust|rot)\b/i, "Rust or frame damage", 20],
  [/\b(accident|wreck|hail|body damage|dent|fender|golpe|golpeado|choque|chocado)\b/i, "Body damage or accident history", 10],
  [/\b(as[- ]is|mechanic special|project|needs work)\b/i, "Sold as-is / needs work", 15],
  [/\b(airbag|srs|bolsas?( de aire| laterales)?)\b/i, "Airbag / SRS issue (check for deployed airbags)", 15],
  [/\b(sensores?|sensor)\b.*\b(cambiar|falta|malo)|\bfalta (cambiar|arreglar)/i, "Needs repairs (seller says sensors/parts to replace)", 10],
  [/\bac (doesn'?t|not) (work|blow)|\bneeds? (a )?(freon|ac)\b/i, "A/C not working", 8],
];
const SOLD = /\b(sold|pending sale|sale pending|no longer available|vendido)\b/i;
const GOOD: Array<[RegExp, string]> = [
  [/\bclean title\b/i, "Seller states clean title"], [/\b(one|1|single) owner\b/i, "Seller states one owner"],
  [/\b(service|maintenance) records?\b/i, "Seller mentions service records"], [/\bnew (tires|brakes|battery)\b/i, "Seller says wear items were replaced"],
  [/\b(runs|drives) (great|excellent|perfect|good)\b/i, "Seller says it runs well"],
];
// Drop negated mentions ("no check engine light", "no accidents") before matching red flags.
const stripNegations = (d: string) => d.replace(/\b(no|not|never|without|sin|nunca)\s+(\w+\s+){0,2}?(check engine( light)?|cel|accidents?|issues?|leaks?|rust|damage|golpes?)\b/gi, " ");

/**
 * Description-only review. It reads no photos, so it can never complete a review: a car it finds no problem
 * with is "needs_review" until its photos are reviewed (by AI vision or an agent).
 */
export function ruleInspect(car: Pick<Car, "description" | "photos" | "miles">): Inspection {
  const raw = car.description ?? "";
  const d = stripNegations(raw);
  let score = 80;
  const red: string[] = [], pos: string[] = [], evidence: Observation[] = [];
  for (const [re, label, pts] of FLAGS) {
    const m = d.match(re);
    if (m) { red.push(label); score -= pts; evidence.push({ source: "description", note: `${label}: "${m[0]}"` }); }
  }
  for (const [re, label] of GOOD) if (re.test(raw)) { pos.push(label); score += 4; }
  if (raw.trim().length < 60) { red.push("Very short description"); score -= 8; }
  const sold = SOLD.test(raw);
  const serious = red.some((f) => /title|engine|emissions|overheat|frame|airbag/i.test(f));
  return {
    verdict: sold ? "sold" : serious ? "cheap_for_reason" : "needs_review",
    score: Math.max(0, Math.min(100, score)), red_flags: red, positives: pos, evidence,
    photo_count_available: car.photos.length, photo_count_reviewed: 0, description_reviewed: true,
    repair_estimate: null, corrections: [], method: "rules",
  };
}

/** Vision review through OpenRouter: every photo (up to 20 per request) plus the description. */
export async function aiInspect(car: Car, o: { apiKey: string; model?: string; fetchImpl?: Fetch }): Promise<Inspection> {
  const photos = car.photos.slice(0, 20);
  const prompt = `You are reviewing a used-car listing for a flipper. Look at every photo (numbered 1-${photos.length} in order) and read the description.
Return only JSON: {"verdict":"promising|cheap_for_reason|sold|needs_review","score":0-100,"red_flags":[...],"positives":[...],
"evidence":[{"source":"photo N or description","note":"what you saw"}]}.
Use cheap_for_reason when the photos or description explain the low price (collision damage, deployed airbags, warning lights,
disclosed mechanical problems). Use needs_review if anything is unclear. Photos cannot verify engine, transmission or frame condition.
Listing: ${car.title}, $${car.price}, ${car.miles ?? "unknown"} miles.\nDescription: ${car.description.slice(0, 2500)}`;
  const content = [{ type: "text", text: prompt }, ...photos.map((url) => ({ type: "image_url", image_url: { url } }))];
  const res = await (o.fetchImpl ?? fetch)("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${o.apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: o.model ?? "anthropic/claude-haiku-5.5", messages: [{ role: "user", content }], response_format: { type: "json_object" } }),
  });
  const body = await res.json();
  const text: string = body?.choices?.[0]?.message?.content ?? "";
  const p = JSON.parse(text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1));
  const verdict = (VERDICTS as readonly string[]).includes(p.verdict) ? p.verdict as Verdict : "needs_review";
  return {
    verdict, score: Math.max(0, Math.min(100, Math.round(Number(p.score) || 0))),
    red_flags: (p.red_flags ?? []).map(String), positives: (p.positives ?? []).map(String),
    evidence: (p.evidence ?? []).map((e: any) => ({ source: String(e.source ?? "unknown"), note: String(e.note ?? "") })),
    photo_count_available: car.photos.length, photo_count_reviewed: photos.length, description_reviewed: true,
    repair_estimate: null, corrections: [], method: "ai",
  };
}

export function saveInspection(db: DB, carId: string, i: Inspection) {
  // A promising verdict without a complete review, or with corrections pending revaluation, is downgraded.
  const verdict: Verdict = i.verdict === "promising" && (!reviewComplete(i) || i.corrections.length) ? "needs_review" : i.verdict;
  db.prepare(`INSERT INTO inspections (car_id,score,verdict,red_flags,positives,recon_estimate,method,photo_count_available,photo_count_reviewed,
      description_reviewed,photo_review_complete,evidence,repair_estimate,corrections)
    VALUES (?,?,?,?,?,0,?,?,?,?,?,?,?,?)
    ON CONFLICT(car_id) DO UPDATE SET score=excluded.score, verdict=excluded.verdict, red_flags=excluded.red_flags, positives=excluded.positives,
      method=excluded.method, photo_count_available=excluded.photo_count_available, photo_count_reviewed=excluded.photo_count_reviewed,
      description_reviewed=excluded.description_reviewed, photo_review_complete=excluded.photo_review_complete, evidence=excluded.evidence,
      repair_estimate=excluded.repair_estimate, corrections=excluded.corrections, inspected_at=datetime('now')`)
    .run(carId, i.score, verdict, JSON.stringify(i.red_flags), JSON.stringify(i.positives), i.method, i.photo_count_available,
      i.photo_count_reviewed, i.description_reviewed ? 1 : 0, reviewComplete(i) ? 1 : 0, JSON.stringify(i.evidence),
      i.repair_estimate, JSON.stringify(i.corrections));
  return verdict;
}

/**
 * Survivors: every car with a complete, evidence-backed "promising" review and no pending revaluation.
 * There's no fixed count; the article happened to get four.
 */
export function shortlist(db: DB) {
  const rows = db.prepare(`SELECT c.id FROM cars c JOIN valuations v ON v.car_id = c.id JOIN inspections i ON i.car_id = c.id
    WHERE i.verdict = 'promising' AND i.photo_review_complete = 1 AND i.description_reviewed = 1 AND i.corrections = '[]'
      AND json_array_length(i.evidence) > 0 ORDER BY v.discount DESC`).all() as Array<{ id: string }>;
  const pick = rows.map((r) => r.id);
  db.transaction(() => {
    db.prepare("UPDATE inspections SET shortlisted = 0").run();
    for (const id of pick) db.prepare("UPDATE inspections SET shortlisted = 1 WHERE car_id = ?").run(id);
  })();
  return pick;
}

/** Step 3: review the top N by dollar gap (AI vision when a key is set, otherwise description-only rules), then shortlist. */
export async function inspectTop(db: DB, o: { top?: number; ids?: string[]; apiKey?: string; model?: string; fetchImpl?: Fetch } = {}) {
  const startedAt = now();
  const apiKey = o.apiKey ?? process.env.OPENROUTER_API_KEY;
  // Selected cars when ids are given, otherwise the top N by dollar gap.
  const ranked = rankedByDiscount(db);
  const top = o.ids?.length ? ranked.filter((r) => o.ids!.includes(r.id)) : ranked.slice(0, o.top ?? config.topForReview);
  const results: Array<{ id: string; title: string; complete: boolean } & Inspection> = [];
  for (const t of top) {
    const car = getCar(db, t.id)!;
    // Keep an existing complete review (e.g. an agent's) rather than overwrite it with a weaker one.
    const prior = db.prepare("SELECT photo_review_complete, method FROM inspections WHERE car_id = ?").get(car.id) as
      { photo_review_complete: number; method: string } | undefined;
    if (prior?.photo_review_complete && prior.method !== "rules") continue;
    let i = ruleInspect(car);
    if (apiKey) {
      try { i = await aiInspect(car, { apiKey, model: o.model, fetchImpl: o.fetchImpl }); } catch { /* keep the description-only result */ }
    }
    const verdict = saveInspection(db, car.id, i);
    results.push({ id: car.id, title: car.title, ...i, verdict, complete: reviewComplete(i) });
  }
  const survivors = shortlist(db);
  const incomplete = top.filter((t) => !(db.prepare("SELECT photo_review_complete c FROM inspections WHERE car_id = ?").get(t.id) as { c: number } | undefined)?.c);
  const report = { reviewed: top.length, incomplete: incomplete.map((t) => t.title), survivors: survivors.length,
    note: apiKey ? "AI vision reviewed photos." : "No vision key: descriptions only. Photos need an AI or agent review before any car can be shortlisted." };
  logRun(db, "inspect", startedAt, { source: apiKey ? "openrouter-vision" : "rules", report });
  return { inspected: results, shortlisted: survivors, ...report };
}

export const inspectionEvidence = (r: { evidence: string; corrections: string }) =>
  ({ evidence: json<Observation[]>(r.evidence, []), corrections: json<string[]>(r.corrections, []) });
