import { test } from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../src/lib/db.ts";
import { signUp } from "../src/lib/auth.ts";
import { balance } from "../src/lib/credits.ts";
import { businessDetail, getBuyBox, listBusinesses, saveBuyBox } from "../src/lib/crm.ts";
import { candidates, filterFromBuyBox, loadDirectoryCsv, saveFromDirectory } from "../src/lib/directory.ts";
import { enrichShortlisted, nameOverlap, samePlace, MAX_SHORTLIST_ENRICH_CREDITS } from "../src/lib/finder.ts";

const CSV = [
  "company,likely_owner,owner_title,address,city,zip5,metro,naics,age_years,est_ebitda_low,est_ebitda_high,founder_name_match,ppp_loan_numbers,state_entity_id",
  "DAVIS AIR CONDITIONING & HEATING INC,Donald B Davis,President,1421 SOUTH FRONT ST,ANGLETON,77515,\"Houston-Pasadena-The Woodlands, TX\",238220,48,740000,1943000,True,1,100",
  "OLD ELECTRIC CO,Ann Volt,President,9 ELM,DALLAS,75001,\"Dallas-Fort Worth-Arlington, TX\",238210,30,300000,700000,False,2,200",
  "YOUNG HVAC LLC,Sam New,Owner,5 OAK,DALLAS,75002,\"Dallas-Fort Worth-Arlington, TX\",238220,5,600000,900000,False,3,300",
].join("\n");

const setup = () => {
  const db = openDb(":memory:");
  const admin = signUp(db, { name: "Ad", email: "ad@x.com", password: "password1", acceptedTerms: true });
  const u = signUp(db, { name: "Cu", email: "cu@x.com", password: "password1", acceptedTerms: true });
  loadDirectoryCsv(db, admin.id, "sponsor_leads_tx_238220.csv", CSV);
  return { db, admin, u };
};

test("onboarding answers save step by step without wiping earlier ones", () => {
  const { db, u } = setup();
  assert.equal(getBuyBox(db, u.id).onboarded, false);
  saveBuyBox(db, u.id, { naics: ["238220"], thesis: "Family HVAC" });
  saveBuyBox(db, u.id, { metro: "Houston", onboarded: true });
  const box = getBuyBox(db, u.id);
  assert.deepEqual([box.naics, box.thesis, box.metro, box.onboarded], [["238220"], "Family HVAC", "Houston", true]);
  saveBuyBox(db, u.id, { naics: ["not-a-code"], onboarded: false });
  assert.deepEqual(getBuyBox(db, u.id).naics, [], "only real NAICS codes are kept");
  assert.equal(getBuyBox(db, u.id).onboarded, true, "onboarding can't be undone by a later save");
});

test("the buy box drives the directory filter", () => {
  const { db, u } = setup();
  saveBuyBox(db, u.id, { naics: ["238220"], metro: "", minAgeYears: 20, ebitdaMin: 500000, ebitdaMax: 3000000 });
  assert.deepEqual(candidates(db, filterFromBuyBox(getBuyBox(db, u.id))).rows.map((r) => r.name), ["Davis Air Conditioning & Heating INC"]);
  saveBuyBox(db, u.id, { naics: [], minAgeYears: 0, metro: "Dallas" });
  assert.equal(candidates(db, filterFromBuyBox(getBuyBox(db, u.id))).total, 2, "both Dallas firms overlap the EBITDA range once industry and age filters are off");
});

test("Maps listings must match the address", () => {
  const b = { zip: "77515", address: "1421 South Front St", city: "Angleton" };
  assert.equal(samePlace("1421 S Front St, Angleton, TX 77515", b), true);
  assert.equal(samePlace("1421 Main St, Angleton, TX 77599", b), true, "street number and city");
  assert.equal(samePlace("88 Davis Rd, Trenton, NJ 08608", b), false);
  assert.ok(nameOverlap("Davis Heating & Air", "Davis Air Conditioning & Heating INC") > 0.5);
});

test("shortlist → enrich: listing, owner email, then into the pipeline; nothing found costs nothing", async () => {
  const { db, u } = setup();
  process.env.TREG_TOKEN = "t";
  const davis = candidates(db, { metro: "houston" }).rows[0].id;
  const young = candidates(db, { q: "young" }).rows[0].id;
  saveFromDirectory(db, u.id, [davis, young]);
  const [b1, b2] = ["Davis", "Young"].map((n) => listBusinesses(db, u.id).find((b) => b.name.startsWith(n))!.id);
  assert.equal(businessDetail(db, u.id, b1)!.business.stage, "shortlist");
  const fake = (async (url: URL, init: RequestInit) => {
    const e = url.pathname.replace("/call/", "");
    const body = JSON.parse(String(init.body));
    const json = (d: unknown, cost = 0) => new Response(JSON.stringify(d), { headers: { "x-treg-cost-micro": String(cost) } });
    if (e === "crawl4ai.google.serp.maps") {
      if (body.query.startsWith("Young")) return json({ rows: [{ name: "Young HVAC", address: "1 Other St, Austin, TX 78701", website: "https://young.com" }] }, 150);
      return json({ rows: [
        { name: "Davis Heating", address: "88 Davis Rd, Trenton, NJ 08608", website: "https://wrong.com" },
        { name: "Davis Air Conditioning & Heating", address: "1421 S Front St, Angleton, TX 77515", website: "https://www.davisac.com/", phone: "+1 979-555-0100", rating: 4.9, review_count: 120 },
      ] }, 150);
    }
    if (e === "treg.people.email.find") { assert.equal(body.domain, "davisac.com"); assert.equal(body.full_name, "Donald B Davis"); return json({ output: { email: "don@davisac.com" } }, 4834); }
    if (e === "treg.people.email.verify") return json({ output: { status: "valid" } });
    throw new Error(e);
  }) as unknown as typeof fetch;
  const before = balance(db, u.id);
  const r = await enrichShortlisted(db, u.id, b1, fake);
  assert.deepEqual({ listing: r.listing, email: r.email, charged: r.charged }, { listing: true, email: "don@davisac.com", charged: 5 }, "1 for the listing + 4 for a verified email; owner already known");
  const d = businessDetail(db, u.id, b1)!.business;
  assert.deepEqual([d.website, d.phone, d.stage], ["https://www.davisac.com/", "+1 979-555-0100", "identified"]);
  const r2 = await enrichShortlisted(db, u.id, b2, fake);
  assert.deepEqual([r2.listing, r2.charged], [false, 0], "a listing at another address is never used");
  assert.equal(balance(db, u.id), before - 5);
  assert.ok(MAX_SHORTLIST_ENRICH_CREDITS >= 6);
});
