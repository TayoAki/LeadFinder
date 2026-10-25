import { z } from "zod";
import { logRun, now, type DB } from "./db.ts";
import { findCars } from "./find.ts";
import { valueCars, rankedByDiscount } from "./value.ts";
import { inspectTop, saveInspection, shortlist, VERDICTS } from "./inspect.ts";
import { exportSnapshot, importSnapshot } from "./snapshot.ts";
import { draftOffers, logReply, offerThread } from "./offers.ts";
import { planResale } from "./sell.ts";
import { enhanceCarPhotos } from "./photos.ts";
import path from "node:path";
import { getCar, pipeline } from "./cars.ts";

/**
 * The five steps as tools. The MCP server, the CLI and the web API all call these,
 * so a headless agent and the UI share exactly the same behaviour.
 */
export const tools = {
  find_cars: {
    description: "Step 1 Find: scrape private-seller Facebook Marketplace car listings near a city and save them.",
    input: { city: z.string().default("atlanta"), radiusMiles: z.number().default(60), target: z.number().default(40),
      minPrice: z.number().optional(), maxPrice: z.number().optional(), query: z.string().optional(),
      sortBy: z.enum(["creation_time_descend", "best_match", "price_ascend", "distance_ascend"]).optional() },
    run: (db: DB, a: any) => findCars(db, a),
  },
  value_cars: {
    description: "Step 2 Value: look up KBB values for every saved car and rank by raw dollar gap (KBB value - asking).",
    input: {},
    run: (db: DB) => valueCars(db),
  },
  ranked_cars: {
    description: "List valued cars ranked by raw dollar gap, with each valuation's source, capture time and assumptions.",
    input: { limit: z.number().default(40) },
    run: (db: DB, a: any) => rankedByDiscount(db).slice(0, a.limit),
  },
  inspect_top: {
    description: "Step 3 Inspect: review the top N by dollar gap and shortlist every complete, evidence-backed promising review.",
    input: { top: z.number().default(10) },
    run: (db: DB, a: any) => inspectTop(db, a),
  },
  get_car: {
    description: "Full listing for one car: description, every photo URL, mileage, location. Use it to inspect photos yourself.",
    input: { id: z.string() },
    run: (db: DB, a: any) => getCar(db, a.id),
  },
  record_inspection: {
    description: "Save your own review of a car after viewing its photos (get_car lists them). The review only counts as complete when "
      + "photo_count_reviewed covers every available photo and the description was read. Tie each observation to a photo number or the description.",
    input: { id: z.string(), verdict: z.enum(VERDICTS), score: z.number().min(0).max(100).default(50),
      photo_count_reviewed: z.number().int().min(0), description_reviewed: z.boolean(),
      evidence: z.array(z.object({ source: z.string(), note: z.string() })).min(1),
      red_flags: z.array(z.string()).default([]), positives: z.array(z.string()).default([]),
      repair_estimate: z.number().nullable().default(null), corrections: z.array(z.string()).default([]) },
    run: (db: DB, a: any) => {
      const car = getCar(db, a.id);
      if (!car) throw new Error(`Unknown car ${a.id}`);
      const startedAt = now();
      const verdict = saveInspection(db, a.id, { ...a, photo_count_available: car.photos.length, method: "agent" });
      const complete = a.description_reviewed && a.photo_count_reviewed >= car.photos.length;
      logRun(db, "inspect", startedAt, { source: "agent", params: { id: a.id },
        report: { verdict, photos: `${a.photo_count_reviewed}/${car.photos.length}`, descriptionReviewed: a.description_reviewed, complete } });
      return { verdict, complete, shortlisted: shortlist(db) };
    },
  },
  draft_offers: {
    description: "Step 4 Buy: draft low opening offers for every survivor (default 80% of asking; optional ceiling as a share of value). Drafts only.",
    input: { openingPct: z.number().min(0.3).max(1).optional(), ceilingPctOfValue: z.number().min(0.3).max(1.2).nullable().optional() },
    run: (db: DB, a: any) => draftOffers(db, a),
  },
  log_seller_reply: {
    description: "Record a seller's reply (and counter-offer, if any) and get the next negotiation message.",
    input: { id: z.string(), reply: z.string(), counter: z.number().optional() },
    run: (db: DB, a: any) => logReply(db, a.id, a.reply, a.counter),
  },
  offer_thread: {
    description: "Show the negotiation history for one car.",
    input: { id: z.string() },
    run: (db: DB, a: any) => offerThread(db, a.id),
  },
  plan_resale: {
    description: "Step 5 Sell: hypothetical profit (resale - purchase - repairs - 6.25% tax - other costs) at the opening offer, the "
      + "latest counter and any supplied price, listing unprovided costs; plus a photo plan and a fact-only listing draft.",
    input: { id: z.string(), buyPrice: z.number().optional(), repairs: z.number().optional(), otherCosts: z.number().optional() },
    run: (db: DB, a: any) => planResale(db, a.id, a.buyPrice, { repairs: a.repairs, otherCosts: a.otherCosts }),
  },
  enhance_photos: {
    description: "Step 5 Sell: download the listing photos and save cleaned-up versions (exposure, colour, crop). Honest edits only.",
    input: { id: z.string(), limit: z.number().default(8) },
    run: (db: DB, a: any) => enhanceCarPhotos(db, a.id, path.join(process.env.CARFLIP_PHOTOS ?? path.join(process.cwd(), "data", "photos")), { limit: a.limit }),
  },
  run_log: {
    description: "Evidence log: every step run, its source, parameters, capture time and coverage report.",
    input: { limit: z.number().default(20) },
    run: (db: DB, a: any) => (db.prepare("SELECT * FROM runs ORDER BY id DESC LIMIT ?").all(a.limit) as any[])
      .map((r) => ({ ...r, params: JSON.parse(r.params), report: JSON.parse(r.report) })),
  },
  export_snapshot: {
    description: "Export every table as JSON (for backups or moving to another deployment).",
    input: {},
    run: (db: DB) => exportSnapshot(db),
  },
  import_snapshot: {
    description: "Replace all data with a snapshot from export_snapshot.",
    input: { snapshot: z.record(z.array(z.record(z.any()))) },
    run: (db: DB, a: any) => importSnapshot(db, a.snapshot),
  },
  pipeline: {
    description: "Every saved car with its value, inspection, offers and resale plan.",
    input: {},
    run: (db: DB) => pipeline(db),
  },
} as const;

export type ToolName = keyof typeof tools;

export async function callTool(db: DB, name: string, args: unknown) {
  const t = tools[name as ToolName];
  if (!t) throw new Error(`Unknown tool ${name}`);
  const parsed = z.object(t.input as z.ZodRawShape).parse(args ?? {});
  return t.run(db, parsed);
}
