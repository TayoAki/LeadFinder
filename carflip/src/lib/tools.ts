import { z } from "zod";
import type { DB } from "./db.ts";
import { findCars } from "./find.ts";
import { valueCars, rankedByDiscount } from "./value.ts";
import { inspectTop, saveInspection, shortlist } from "./inspect.ts";
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
    description: "Step 2 Value: look up KBB values for every saved car, adjust for mileage and rank by discount.",
    input: {},
    run: (db: DB) => valueCars(db),
  },
  ranked_cars: {
    description: "List valued cars ranked by discount to KBB value.",
    input: { limit: z.number().default(40) },
    run: (db: DB, a: any) => rankedByDiscount(db).slice(0, a.limit),
  },
  inspect_top: {
    description: "Step 3 Inspect: review photos and descriptions of the top N cars by discount, then shortlist the best K.",
    input: { top: z.number().default(10), keep: z.number().default(4) },
    run: (db: DB, a: any) => inspectTop(db, a),
  },
  get_car: {
    description: "Full listing for one car: description, every photo URL, mileage, location. Use it to inspect photos yourself.",
    input: { id: z.string() },
    run: (db: DB, a: any) => getCar(db, a.id),
  },
  record_inspection: {
    description: "Save your own inspection of a car (after viewing its photos) and refresh the shortlist.",
    input: { id: z.string(), score: z.number().min(0).max(100), verdict: z.enum(["promising", "caution", "pass"]),
      red_flags: z.array(z.string()).default([]), positives: z.array(z.string()).default([]), recon_estimate: z.number().default(500),
      keep: z.number().default(4) },
    run: (db: DB, a: any) => { saveInspection(db, a.id, { ...a, method: "agent" }); return { shortlisted: shortlist(db, a.keep) }; },
  },
  draft_offers: {
    description: "Step 4 Buy: draft low opening offers for the shortlisted cars. Drafts only; a person sends them.",
    input: {},
    run: (db: DB) => draftOffers(db),
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
    description: "Step 5 Sell: photo plan, listing copy and hypothetical resale profit for one car.",
    input: { id: z.string(), buyPrice: z.number().optional() },
    run: (db: DB, a: any) => planResale(db, a.id, a.buyPrice),
  },
  enhance_photos: {
    description: "Step 5 Sell: download the listing photos and save cleaned-up versions (exposure, colour, crop). Honest edits only.",
    input: { id: z.string(), limit: z.number().default(8) },
    run: (db: DB, a: any) => enhanceCarPhotos(db, a.id, path.join(process.env.CARFLIP_PHOTOS ?? path.join(process.cwd(), "data", "photos")), { limit: a.limit }),
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
