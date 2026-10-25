import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { openDb } from "../src/lib/db.ts";
import { parseTitle, parseMiles, normalizeFb, isCandidate, dealerScore, findCars, fbVehiclesUrl } from "../src/lib/find.ts";
import { pickTrim, valueCars, slug, rankedByDiscount } from "../src/lib/value.ts";
import { ruleInspect, inspectTop, reviewComplete } from "../src/lib/inspect.ts";
import { offerPlan, nextMove, draftOffers, logReply } from "../src/lib/offers.ts";
import { scenario, unprovidedCosts, planResale } from "../src/lib/sell.ts";
import { callTool } from "../src/lib/tools.ts";

const fbItems = JSON.parse(fs.readFileSync(new URL("./fixtures/fb_items.json", import.meta.url), "utf8"));
const kbbRows = JSON.parse(fs.readFileSync(new URL("./fixtures/kbb_rows.json", import.meta.url), "utf8"));

/** Fake Apify: the Marketplace actor returns the fixtures, the KBB actor returns rows for whatever was asked. */
const fakeApify: typeof fetch = async (url, init) => {
  const u = String(url);
  const body = JSON.parse(String(init?.body));
  if (u.includes("facebook-marketplace")) return new Response(JSON.stringify(fbItems));
  const asked = new Set(body.vehicles.map((v: any) => `${v.make}/${v.model}/${v.year}`));
  return new Response(JSON.stringify(kbbRows.filter((r: any) => asked.has(`${r.make}/${r.model}/${r.year}`))));
};

test("parses titles, including two-word models and trims", () => {
  assert.deepEqual(parseTitle("2011 Toyota Camry · LE Sedan 4D"), { year: 2011, make: "toyota", model: "Camry", trim: "LE Sedan 4D" });
  assert.equal(parseTitle("2011 Jeep Grand Cherokee · Laredo").model, "Grand Cherokee");
  assert.equal(parseTitle("2016 Chevy Silverado 1500 LT").make, "chevrolet");
  assert.equal(parseTitle("2016 Chevy Silverado 1500 LT").model, "Silverado 1500");
  assert.equal(slug("Grand Cherokee"), "grand-cherokee");
});

test("parses mileage in several formats", () => {
  assert.equal(parseMiles("145K miles"), 145000);
  assert.equal(parseMiles("Only 98,500 miles on it"), 98500);
  assert.equal(parseMiles("runs great"), null);
});

test("flags dealers and non-cars", () => {
  assert.ok(dealerScore("2018 Camry", "We finance! $500 down, bad credit OK") >= 2);
  assert.equal(dealerScore("2018 Camry", "Selling my daily driver, clean title"), 0);
  const cars = fbItems.map(normalizeFb);
  const atv = cars.find((c: any) => /Foreman/.test(c.title));
  assert.equal(isCandidate(atv), false, "ATV is not a car");
  assert.equal(cars[0].miles, 145000);
  assert.equal(cars[0].photos.length, 14);
});

test("builds a 60-mile Atlanta vehicles search", () => {
  const u = fbVehiclesUrl({ city: "atlanta", radiusMiles: 60 });
  assert.match(u, /marketplace\/atlanta\/vehicles\?radius=97&topLevelVehicleType=car_truck/);
});

test("picks the matching KBB trim and never adjusts KBB's number", () => {
  const camry = kbbRows.filter((r: any) => r.model === "camry");
  assert.equal(pickTrim({ trim: "LE Sedan 4D", title: "2011 Toyota Camry" }, camry)!.trim, "LE Sedan 4D");
});

test("rules read Spanish listings and ignore negated flags", () => {
  const accord = ruleInspect({ description: "Golpe enfrente camina. Bolsas laterales coloradas. Clean title a mi nombre", photos: Array(8).fill("x"), miles: 1 });
  assert.ok(accord.red_flags.some((f) => /body damage/i.test(f)) && accord.red_flags.some((f) => /airbag/i.test(f)));
  assert.equal(accord.verdict, "cheap_for_reason");
  const g8 = ruleInspect({ description: "No issues at all runs and drives good no check engine light nothing ac good", photos: Array(12).fill("x"), miles: 1 });
  assert.ok(!g8.red_flags.some((f) => /check-engine/i.test(f)));
  const fusion = ruleInspect({ description: "The car now needs an engine replacement due to a bad rod bearing", photos: Array(6).fill("x"), miles: 1 });
  assert.equal(fusion.verdict, "cheap_for_reason");
});

test("a description-only review can never complete or produce a promising survivor", () => {
  const i = ruleInspect({ description: "Runs great, clean title, one owner, new tires. Everything works.", photos: Array(10).fill("x"), miles: 90000 });
  assert.equal(i.photo_count_reviewed, 0);
  assert.equal(reviewComplete(i), false);
  assert.equal(i.verdict, "needs_review");
  assert.equal(i.repair_estimate, null, "repair costs are never invented");
  assert.equal(ruleInspect({ description: "SOLD, thanks everyone", photos: ["x"], miles: 1 }).verdict, "sold");
});

test("offers follow the configured policy; counters are never auto-accepted without a ceiling", () => {
  const p = offerPlan(4500, 9000, { openingPct: 0.8, ceilingPctOfValue: null });
  assert.equal(p.opening, 3600);
  assert.equal(p.ceiling, null);
  assert.equal(nextMove(p, p.opening, 4000).action, "hold");
  const capped = offerPlan(6500, 8755, { openingPct: 0.8, maxOffer: 5800 });
  assert.equal(capped.opening, 5200, "the article's Colorado: $5,200 opening on $6,500");
  assert.equal(nextMove(capped, 5200, 5800).action, "within_ceiling");
  assert.equal(nextMove(capped, 5200, 6400).action, "final");
});

test("reproduces the article's Colorado arithmetic exactly", () => {
  assert.equal(scenario("counter", { purchase: 5800, resale: 8755, repairs: 1000, taxRate: 0.0625 }).profitBeforeUnprovided, 1592.5);
  assert.equal(scenario("opening", { purchase: 5200, resale: 8755, repairs: 1000, taxRate: 0.0625 }).profitBeforeUnprovided, 2230);
  assert.equal(scenario("x", { purchase: 5800, resale: 8755, repairs: 1000 }).tax, 362.5);
});

test("missing costs are listed, not treated as zero", () => {
  assert.ok(unprovidedCosts(null).includes("repairs (no estimate supplied)"));
  assert.ok(unprovidedCosts(1000).length > 0, "other costs stay listed until supplied");
  assert.deepEqual(unprovidedCosts(1000, 250), []);
});

test("end to end with evidence: find, value, inspect, agent review, offer, counter, sell", async () => {
  const db = openDb(":memory:");
  const found: any = await findCars(db, { target: 40 }, { fetchImpl: fakeApify, token: "t" });
  assert.equal(found.scraped, 6);
  assert.ok(found.excluded.every((x: any) => x.reason), "every exclusion has a reason");
  assert.match(found.limit, /partial/);
  const car0: any = db.prepare("SELECT captured_at, source_actor, seller_type FROM cars LIMIT 1").get();
  assert.ok(car0.captured_at && car0.source_actor && car0.seller_type === "private_inferred");

  const valued: any = await valueCars(db, { fetchImpl: fakeApify, token: "t" });
  assert.equal(valued.valued, 2);
  const ranked = rankedByDiscount(db);
  assert.ok(ranked[0].discount >= ranked[1].discount, "ranked by raw dollar gap");
  assert.ok(JSON.parse(ranked[0].assumptions).some((a: string) => /Not adjusted for the listing/.test(a)));
  const v: any = db.prepare("SELECT value, kbb_fair, value_type, captured_at FROM valuations LIMIT 1").get();
  assert.equal(v.value, v.kbb_fair, "value is KBB's number, unadjusted");
  assert.ok(v.value_type && v.captured_at);

  const insp = await inspectTop(db, { top: 10, apiKey: "" });
  assert.equal(insp.shortlisted.length, 0, "no survivors without a photo review");
  const camry = ranked.find((r) => /Camry/.test(r.title))!;
  const photos = (db.prepare("SELECT photos FROM cars WHERE id = ?").get(camry.id) as any).photos;
  const n = JSON.parse(photos).length;
  const partial: any = await callTool(db, "record_inspection", { id: camry.id, verdict: "promising", photo_count_reviewed: n - 1,
    description_reviewed: true, evidence: [{ source: "photo 1", note: "clean body" }] });
  assert.equal(partial.verdict, "needs_review", "a partial photo review is downgraded");
  const full: any = await callTool(db, "record_inspection", { id: camry.id, verdict: "promising", photo_count_reviewed: n,
    description_reviewed: true, evidence: [{ source: "photo 1", note: "clean body" }, { source: "description", note: "clean title stated" }] });
  assert.deepEqual(full.shortlisted, [camry.id]);

  const offers: any = await callTool(db, "draft_offers", {});
  assert.equal(offers.length, 1);
  assert.doesNotMatch(offers[0].message, /comparing|cash|today|pay on the spot/i, "no invented claims or commitments");
  const reply = logReply(db, camry.id, "Lowest is 7000", 7000);
  assert.equal(reply.purchase, false);
  assert.equal(reply.next!.action, "hold");

  const sale = planResale(db, camry.id);
  assert.equal(sale.hypothetical, true);
  assert.ok(sale.scenarios.some((s) => /Seller counter \$7,000/.test(s.label)));
  assert.ok(sale.unprovidedCosts.includes("repairs (no estimate supplied)"));
  const runs: any = await callTool(db, "run_log", {});
  assert.deepEqual(runs.map((r: any) => r.step).reverse(), ["find", "value", "inspect", "inspect", "inspect", "buy", "sell"]);
  assert.deepEqual(runs.filter((r: any) => r.source === "agent").map((r: any) => r.report.complete), [true, false]);

  const snap: any = await callTool(db, "export_snapshot", {});
  const db2 = openDb(":memory:");
  const counts: any = await callTool(db2, "import_snapshot", { snapshot: snap });
  assert.equal(counts.cars, snap.cars.length);
});

async function shortlistedCamry() {
  const db = openDb(":memory:");
  await findCars(db, { target: 40 }, { fetchImpl: fakeApify, token: "t" });
  await valueCars(db, { fetchImpl: fakeApify, token: "t" });
  const camry = rankedByDiscount(db).find((r) => /Camry/.test(r.title))!;
  const n = JSON.parse((db.prepare("SELECT photos FROM cars WHERE id = ?").get(camry.id) as any).photos).length;
  return { db, camry, n };
}

test("stages: forward needs evidence, backward clears later work", async () => {
  const { db, camry, n } = await shortlistedCamry();
  const { moveToStage } = await import("../src/lib/stages.ts");
  const { pipeline } = await import("../src/lib/cars.ts");
  const stage = () => pipeline(db).find((r) => r.id === camry.id)!.stage;
  assert.equal(stage(), "value");
  const blocked = await moveToStage(db, [camry.id], "buy");
  assert.equal(blocked[0].ok, false, "can't reach Buy without a complete promising review");
  assert.equal(stage(), "inspect", "but it did get the description check");
  await callTool(db, "record_inspection", { id: camry.id, verdict: "promising", photo_count_reviewed: n, description_reviewed: true,
    evidence: [{ source: "photo #1", note: "clean body" }] });
  const sold = await moveToStage(db, [camry.id], "sell");
  assert.ok(sold[0].ok);
  assert.equal(stage(), "sell");
  assert.ok(db.prepare("SELECT 1 FROM offers WHERE car_id = ?").get(camry.id), "offer drafted on the way");
  await moveToStage(db, [camry.id], "inspect");
  assert.equal(stage(), "inspect");
  assert.equal((db.prepare("SELECT COUNT(*) n FROM offers WHERE car_id = ?").get(camry.id) as any).n, 0, "draft offer cleared");
  await moveToStage(db, [camry.id], "find");
  assert.equal(stage(), "find");
});

test("repair estimates: items need a basis; shown as their own resale scenario", async () => {
  const { db, camry, n } = await shortlistedCamry();
  await callTool(db, "record_inspection", { id: camry.id, verdict: "promising", photo_count_reviewed: n, description_reviewed: true,
    evidence: [{ source: "description", note: "needs 2 sensors" }] });
  await assert.rejects(callTool(db, "record_repair_estimate", { id: camry.id, items: [{ item: "x", low: 1, high: 2, basis: "" }] }));
  const e: any = await callTool(db, "record_repair_estimate", { id: camry.id,
    items: [{ item: "2 sensors", low: 150, high: 450, basis: "description: needs 2 sensors" }], not_assessed: ["brakes"] });
  assert.deepEqual([e.low, e.high], [150, 450]);
  const plan = planResale(db, camry.id);
  assert.ok(plan.scenarios.some((s) => /estimated repairs \(high, \$450\)/.test(s.label) && s.repairs === 450));
  assert.ok(plan.scenarios.some((s) => s.repairs === null), "supplied-cost scenarios still leave repairs unprovided");
  assert.match(plan.unprovidedCosts[0], /estimate \$150–\$450 only, not a quote/);

  const { aiEstimateRepairs } = await import("../src/lib/repairs.ts");
  const fake: any = { beta: { messages: { create: async (req: any) => {
    assert.equal(req.output_config.format.type, "json_schema");
    assert.match(req.messages[0].content, /needs 2 sensors/);
    return { model: "claude-opus-5-5", stop_reason: "end_turn", content: [{ type: "text",
      text: JSON.stringify({ items: [{ item: "O2 sensors", low: 200, high: 500, basis: "description: needs 2 sensors" }], not_assessed: ["tires"], assumptions: [] }) }] };
  } } } };
  const [ai]: any = await aiEstimateRepairs(db, [camry.id], { client: fake });
  assert.equal(ai.method, "ai");
  assert.equal(ai.high, 500);
});

test("chat: runs tools in a loop and keeps the full history", async () => {
  const { db } = await shortlistedCamry();
  const { chatTurn, chatTools } = await import("../src/lib/chat.ts");
  assert.ok(!chatTools().some((t) => t.name === "import_snapshot"), "destructive tools are hidden");
  let calls = 0;
  const fake: any = { beta: { messages: { create: async (req: any) => {
    calls++;
    if (calls === 1) return { stop_reason: "tool_use", content: [{ type: "tool_use", id: "t1", name: "ranked_cars", input: {} }] };
    const last = req.messages.at(-1);
    assert.equal(last.content[0].type, "tool_result");
    assert.match(last.content[0].content, /Camry/);
    return { stop_reason: "end_turn", content: [{ type: "text", text: "The Camry has the biggest gap." }] };
  } } } };
  const out = await chatTurn(db, [], "Which car has the biggest gap?", { client: fake });
  assert.equal(out.reply, "The Camry has the biggest gap.");
  assert.equal(out.messages.length, 4, "user, assistant tool_use, tool_result, assistant answer");
  assert.deepEqual(out.used, [{ name: "ranked_cars", ok: true }]);
});
