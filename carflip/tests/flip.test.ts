import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { openDb } from "../src/lib/db.ts";
import { parseTitle, parseMiles, normalizeFb, isCandidate, dealerScore, findCars, fbVehiclesUrl } from "../src/lib/find.ts";
import { pickTrim, mileageAdjustment, valueCars, slug } from "../src/lib/value.ts";
import { ruleInspect, inspectTop } from "../src/lib/inspect.ts";
import { offerPlan, nextMove, draftOffers, logReply } from "../src/lib/offers.ts";
import { resaleMath, planResale } from "../src/lib/sell.ts";
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

test("picks the matching KBB trim and adjusts for mileage", () => {
  const camry = kbbRows.filter((r: any) => r.model === "camry");
  assert.equal(pickTrim({ trim: "LE Sedan 4D", title: "2011 Toyota Camry" }, camry)!.trim, "LE Sedan 4D");
  assert.equal(mileageAdjustment(10000, 2016, 120000, 2026), 0, "typical miles -> no change");
  assert.equal(mileageAdjustment(10000, 2016, 60000, 2026), 2500, "low miles add value, capped at 25%");
  assert.equal(mileageAdjustment(10000, 2016, 200000, 2026), -2500, "high miles cut value, capped at 25%");
});

test("rule inspection catches emissions and title problems", () => {
  const i = ruleInspect({ description: "Runs great but will not pass emissions, salvage title", photos: Array(10).fill("x"), miles: 100000 });
  assert.ok(i.red_flags.some((f) => /emissions/i.test(f)));
  assert.ok(i.red_flags.some((f) => /title/i.test(f)));
  assert.equal(i.verdict, "pass");
});

test("rules read Spanish listings and ignore negated flags", () => {
  const accord = ruleInspect({ description: "Golpe enfrente camina. Bolsas laterales coloradas. Clean title a mi nombre", photos: Array(8).fill("x"), miles: 1 });
  assert.ok(accord.red_flags.some((f) => /body damage/i.test(f)) && accord.red_flags.some((f) => /airbag/i.test(f)));
  const g8 = ruleInspect({ description: "No issues at all runs and drives good no check engine light nothing ac good", photos: Array(12).fill("x"), miles: 1 });
  assert.ok(!g8.red_flags.some((f) => /check-engine/i.test(f)));
  const fusion = ruleInspect({ description: "The car now needs an engine replacement due to a bad rod bearing", photos: Array(6).fill("x"), miles: 1 });
  assert.ok(fusion.red_flags.some((f) => /engine or transmission/i.test(f)));
});

test("offers start low, cap at walk-away and accept good counters", () => {
  const p = offerPlan(9000, 10000, 500);
  assert.ok(p.opening < p.walkAway && p.walkAway < 9000);
  assert.equal(nextMove(p, p.opening, p.walkAway - 100).action, "accept");
  assert.equal(nextMove(p, p.opening, 20000).action, "final");
  assert.equal(nextMove(p, p.opening, 20000).amount, p.walkAway);
});

test("resale math subtracts tax, fees and recon", () => {
  const r = resaleMath({ buy: 5000, value: 8000, recon: 500 });
  assert.equal(r.costs.tax, 560);
  assert.equal(r.profit, r.expectedSale - r.totalCost);
});

test("end to end: find, value, inspect, offer, negotiate, sell", async () => {
  const db = openDb(":memory:");
  const found = await findCars(db, { target: 40 }, { fetchImpl: fakeApify, token: "t" });
  assert.equal(found.scraped, 6);
  assert.ok(found.saved >= 4 && found.saved <= 5);
  const valued = await valueCars(db, { fetchImpl: fakeApify, token: "t" });
  assert.equal(valued.valued, 2, "fixtures only have KBB rows for the Camry and the Edge");
  const insp = await inspectTop(db, { top: 10, keep: 4, apiKey: "" });
  assert.equal(insp.inspected.length, 2);
  const edge = insp.inspected.find((c) => /Edge/.test(c.title))!;
  assert.ok(edge.red_flags.some((f) => /emissions/i.test(f)), "the Edge listing says it fails emissions");
  const offers = draftOffers(db);
  for (const o of offers) assert.ok(o.opening <= o.walkAway);
  if (offers[0]) {
    const reply = logReply(db, offers[0].id, "Lowest I'd go is 7000", 7000);
    assert.ok(reply.next);
    const sale = planResale(db, offers[0].id);
    assert.equal(sale.hypothetical, true);
  }
  const pipe: any = await callTool(db, "pipeline", {});
  assert.ok(pipe.length >= 4);
});
