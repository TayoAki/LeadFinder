import { test } from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../src/lib/db.ts";
import { signUp } from "../src/lib/auth.ts";
import { balance } from "../src/lib/credits.ts";
import {
  addTask, businessDetail, completeTask, dueTasks, getBuyBox, importSbaFile, listBusinesses, saveBuyBox, setDdItem, setStage,
  stageCounts, startCadence, today, CADENCE,
} from "../src/lib/crm.ts";
import { enrichBusiness, inArea, parseUsAddress, saveListings } from "../src/lib/finder.ts";

const setup = () => {
  const db = openDb(":memory:");
  const a = signUp(db, { name: "A", email: "a@x.com", password: "password1", acceptedTerms: true });
  const b = signUp(db, { name: "B", email: "b@x.com", password: "password1", acceptedTerms: true });
  return { db, a, b };
};

const LEADS_JSON = JSON.stringify({
  asOf: "2026-10-01",
  leads: [
    { id: "32001", co: "Davis Air Conditioning & Heating", owner: "Donald B Davis", title: "President", addr: "1 Main St", city: "Angleton", zip: "77515",
      metro: "Houston", seg: "HVAC & plumbing", tier: "A", score: 88, met: ["First-deal size", "Founder or family run"], missed: ["In DFW"],
      age: 34, reg: "1991-04-02", pay: 1900000, revLo: 6000000, revHi: 8000000, ebLo: 700000, ebHi: 1100000, why: "Family run for 34 years.", fam: true, role: "platform" },
    { id: "32002", co: "Biggs Plumbing", owner: "Sam Biggs", city: "Austin", tier: "B", score: 71 },
    { co: "No id — skipped" },
  ],
});

test("imports leads.json, keeps deals on re-import, and merges contacts.csv", () => {
  const { db, a } = setup();
  assert.deepEqual(importSbaFile(db, a.id, "leads.json", LEADS_JSON), { kind: "leads_json", created: 2, updated: 0, skipped: 1 });
  const davis = listBusinesses(db, a.id).find((x) => x.name.startsWith("Davis"))!;
  assert.equal(davis.tier, "A");
  assert.equal(davis.ebitda_hi, 1100000);
  setStage(db, a.id, davis.id, "conversation");
  assert.deepEqual(importSbaFile(db, a.id, "leads.json", LEADS_JSON), { kind: "leads_json", created: 0, updated: 2, skipped: 1 });
  assert.equal(listBusinesses(db, a.id).find((x) => x.id === davis.id)!.stage, "conversation", "re-import never resets the deal");
  const csv = "id,company,owner,email,email_verified,phone,website\n32001,Davis,Donald B Davis,don@davisac.com,True,+1 979-555-0100,https://davisac.com\n99999,Unknown,,x@y.com,False,,\n";
  assert.deepEqual(importSbaFile(db, a.id, "contacts.csv", csv), { kind: "contacts_csv", created: 0, updated: 1, skipped: 1 });
  const d = businessDetail(db, a.id, davis.id)!;
  assert.equal(d.business.owner_email, "don@davisac.com");
  assert.equal(d.business.email_status, "verified");
  assert.deepEqual(d.business.fit_met, ["First-deal size", "Founder or family run"]);
});

test("imports a sponsor.py CSV", () => {
  const { db, a } = setup();
  const csv = "company,state_entity_id,ppp_loan_numbers,address,city,zip5,likely_owner,fit_tier,lead_score,est_ebitda_low,est_ebitda_high\nACME HEATING LLC,12345,,9 Elm,Dallas,75001,JANE ROE,A,90,\"500,000\",900000\n";
  assert.equal(importSbaFile(db, a.id, "sponsor_leads_tx_238220.csv", csv).created, 1);
  const [r] = listBusinesses(db, a.id);
  assert.equal(r.name, "Acme Heating LLC");
  assert.equal(r.ebitda_lo, 500000);
  assert.throws(() => importSbaFile(db, a.id, "x.csv", "foo,bar\n1,2\n"), /doesn't look like an SBA Search file/);
});

test("accounts never see each other's businesses", () => {
  const { db, a, b } = setup();
  importSbaFile(db, a.id, "leads.json", LEADS_JSON);
  assert.equal(listBusinesses(db, b.id).length, 0);
  const id = listBusinesses(db, a.id)[0].id;
  assert.equal(businessDetail(db, b.id, id), null);
});

test("cadence schedules five steps once, moves the deal to Contacted, and feeds Today", () => {
  const { db, a } = setup();
  importSbaFile(db, a.id, "leads.json", LEADS_JSON);
  const id = listBusinesses(db, a.id)[0].id;
  assert.equal(startCadence(db, a.id, id), true);
  assert.equal(startCadence(db, a.id, id), false, "starting twice does nothing");
  const d = businessDetail(db, a.id, id)!;
  assert.equal(d.tasks.length, CADENCE.length);
  assert.equal(d.business.stage, "contacted");
  const due = dueTasks(db, a.id);
  assert.deepEqual(due.map((t) => t.channel), ["letter", "call"], "today's letter and the day-7 call are within a week");
  completeTask(db, a.id, due[0].id, true);
  assert.equal(dueTasks(db, a.id).length, 1);
  addTask(db, a.id, id, "Send NDA", today());
  assert.equal(stageCounts(db, a.id).contacted, 1);
  assert.ok(businessDetail(db, a.id, id)!.activity.some((x) => x.body === "Done: Send a personal, signed letter"));
});

test("due-diligence items and the buy box save", () => {
  const { db, a } = setup();
  importSbaFile(db, a.id, "leads.json", LEADS_JSON);
  const id = listBusinesses(db, a.id)[0].id;
  setDdItem(db, id, "tax_vs_pl", true);
  setDdItem(db, id, "tax_vs_pl", false, "waiting on 2024 return");
  assert.deepEqual(businessDetail(db, a.id, id)!.dd.tax_vs_pl, { done: false, note: "waiting on 2024 return" });
  assert.throws(() => setDdItem(db, id, "nope", true), /Unknown/);
  assert.equal(getBuyBox(db, a.id).minAgeYears, 20);
  saveBuyBox(db, a.id, { geography: "DFW", minAgeYears: 15, ebitdaMin: -5 as unknown as number });
  const box = getBuyBox(db, a.id);
  assert.equal(box.geography, "DFW");
  assert.equal(box.minAgeYears, 15);
  assert.equal(box.ebitdaMin, 500000, "invalid numbers fall back to the default");
});

test("finder: address parsing, state check, and saving charges once per new business", () => {
  assert.deepEqual(parseUsAddress("2620 Buell Ave, Austin, TX 78757"), { city: "Austin", state: "TX", zip: "78757", street: "2620 Buell Ave" });
  const row = { name: "Davis Heating", address: "5 Oak St, Trenton, NJ 08608", phone: null, website: null, rating: null, reviews: null, category: null, placeId: "p1", url: null };
  assert.equal(inArea(row, "Angleton, TX"), false, "a same-name company in another state is rejected");
  assert.equal(inArea({ ...row, address: "1 Main St, Angleton, TX 77515" }, "Angleton, TX"), true);
  const { db, a } = setup();
  const before = balance(db, a.id);
  const rows = [{ ...row, address: "1 Main St, Angleton, TX 77515" }, { ...row, placeId: "p2", name: "Other", address: "2 Main St, Angleton, TX 77515" }];
  assert.equal(saveListings(db, a.id, rows, "HVAC").charged, 2);
  assert.equal(saveListings(db, a.id, rows, "HVAC").charged, 0, "re-saving is free");
  assert.equal(balance(db, a.id), before - 2);
  assert.equal(listBusinesses(db, a.id)[0].state, "TX");
});

test("owner lookup charges only for what's found and refunds the rest", async () => {
  const { db, a } = setup();
  process.env.TREG_TOKEN = "t";
  const [{ id }] = [saveListings(db, a.id, [{ name: "Cool Air", address: "1 Main St, Austin, TX 78701", phone: null, website: "https://www.coolair.com/?utm=x", rating: 4.8, reviews: 100, category: "HVAC", placeId: "c1", url: null }], "HVAC").ids].map((ids) => ({ id: ids[0] }));
  const before = balance(db, a.id);
  const fake = (async (url: URL, init: RequestInit) => {
    const e = url.pathname.replace("/call/", "");
    const body = JSON.parse(String(init.body));
    const json = (d: unknown, cost = 0) => new Response(JSON.stringify(d), { headers: { "x-treg-cost-micro": String(cost) } });
    if (e === "treg.people.search") {
      assert.equal(body.company_domain, "coolair.com");
      return json({ output: { results: [{ full_name: "Pat Tech", title: "Technician" }, { full_name: "Jo Cool", first_name: "Jo", last_name: "Cool", title: "Owner & President" }] } });
    }
    if (e === "treg.people.email.find") { assert.equal(body.full_name, "Jo Cool"); return json({ output: { email: "jo@coolair.com" } }, 4834); }
    if (e === "treg.people.email.verify") return json({ output: { status: "valid" } });
    throw new Error(e);
  }) as unknown as typeof fetch;
  const r = await enrichBusiness(db, a.id, id, fake);
  assert.deepEqual(r, { owner: "Jo Cool", email: "jo@coolair.com", status: "verified", charged: 5 });
  assert.equal(balance(db, a.id), before - 5);
  await assert.rejects(enrichBusiness(db, a.id, 99999, fake), /not found/);
});
