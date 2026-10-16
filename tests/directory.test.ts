import { test } from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../src/lib/db.ts";
import { signUp } from "../src/lib/auth.ts";
import { saveBuyBox, listBusinesses, businessDetail } from "../src/lib/crm.ts";
import { candidates, directoryStats, fromSponsorRow, loadDirectoryCsv, rankedCandidates, saveFromDirectory, scoreRows } from "../src/lib/directory.ts";

const HEADER = "fit_tier,lead_score,role,age_ok,company,fit_headline,watch_outs,likely_owner,owner_title,all_officers,founder_name_match,family_officers,generational,address,city,zip5,county,metro,naics,age_years,registered_date,est_annual_payroll,est_revenue_low,est_revenue_high,est_ebitda_low,est_ebitda_high,business_model_guess,ppp_jobs_2020,plan_participants_2024,not_fully_forgiven,second_draw,ppp_loan_numbers,state_entity_id";
const CSV = [
  HEADER,
  "A,100.0,platform,True,DAVIS AIR CONDITIONING & HEATING INC,Platform | 48 yrs,Needs a local GM,Donald B Davis,Director/President,Donald B Davis (President),True,True,False,1421 SOUTH FRONT ST,ANGLETON,77515,BRAZORIA,\"Houston-Pasadena-The Woodlands, TX\",238220,48.4,1978-05-12,3239040.0,9254000.0,12956000.0,740000.0,1943000.0,residential service,64.0,62.0,False,False,6253977009,17419909357",
  "C,40.0,small,False,TINY PLUMBING LLC,,,Joe Small,President,,False,False,False,1 MAIN ST,AUSTIN,78701,TRAVIS,\"Austin-Round Rock-San Marcos, TX\",238220,6.0,2020-01-01,100000.0,300000.0,400000.0,20000.0,50000.0,residential service,3.0,,True,True,111,",
  "B,70.0,add-on,True,OLD ELECTRIC CO,,,Ann Volt,President,,False,False,False,9 ELM,DALLAS,75001,DALLAS,\"Dallas-Fort Worth-Arlington, TX\",238210,30.0,1996-01-01,1000000.0,3000000.0,4000000.0,300000.0,700000.0,commercial,20.0,15.0,False,False,222,999",
  "C,,,,NO ID COMPANY,,,,,,,,,,,,,,238220,,,,,,,,,,,,,,",
].join("\n");

const setup = () => {
  const db = openDb(":memory:");
  const admin = signUp(db, { name: "Ad", email: "ad@x.com", password: "password1", acceptedTerms: true });
  const cust = signUp(db, { name: "Cu", email: "cu@x.com", password: "password1", acceptedTerms: true });
  return { db, admin, cust };
};

test("maps the real sponsor.py columns", () => {
  const cols = HEADER.split(",");
  const cells = CSV.split("\n")[1].match(/("[^"]*"|[^,]*)(,|$)/g)!.map((c) => c.replace(/,$/, "").replace(/^"|"$/g, ""));
  const r = fromSponsorRow(Object.fromEntries(cols.map((c, i) => [c, cells[i]])), "TX")!;
  assert.equal(r.externalId, "TX:17419909357");
  assert.equal(r.name, "Davis Air Conditioning & Heating INC");
  assert.equal(r.industry, "HVAC & plumbing");
  assert.equal(r.ebitdaHi, 1943000);
  assert.equal(r.familyRun, true);
  assert.equal(r.pppClean, true);
  assert.equal(r.metro, "Houston-Pasadena-The Woodlands, TX");
});

test("loading is idempotent, and the buy box filters candidates", () => {
  const { db, admin, cust } = setup();
  assert.deepEqual(loadDirectoryCsv(db, admin.id, "sponsor_leads_tx_238220.csv", CSV), { added: 3, updated: 0, skipped: 1, state: "TX" });
  assert.deepEqual(loadDirectoryCsv(db, admin.id, "sponsor_leads_tx_238220.csv", CSV), { added: 0, updated: 3, skipped: 1, state: "TX" });
  assert.equal(directoryStats(db).total, 3);
  assert.throws(() => loadDirectoryCsv(db, admin.id, "x.csv", "a,b\n1,2"), /sponsor_leads CSV/);
  saveBuyBox(db, cust.id, { minAgeYears: 20, ebitdaMin: 500000, ebitdaMax: 3000000 });
  const { total, rows } = candidates(db, { minAge: 20, ebitdaMin: 500000, ebitdaMax: 3000000 });
  assert.equal(total, 2, "Tiny Plumbing is too young and too small");
  assert.deepEqual(rows.map((r) => r.name), ["Davis Air Conditioning & Heating INC", "Old Electric CO"]);
  assert.equal(candidates(db, { industries: ["238210"] }).total, 1);
  assert.equal(candidates(db, { metro: "houston" }).total, 1);
});

test("AI scores are cached per buy box, ignore invented ids, and rank results", async () => {
  const { db, admin, cust } = setup();
  loadDirectoryCsv(db, admin.id, "sponsor_leads_tx_238220.csv", CSV);
  saveBuyBox(db, cust.id, { thesis: "Residential HVAC, family owned" });
  let calls = 0;
  const ai = async (_s: string, prompt: string) => {
    calls++;
    assert.match(prompt, /Residential HVAC, family owned/);
    const ids = [...prompt.matchAll(/"id":(\d+)/g)].map((m) => Number(m[1]));
    return { results: [...ids.map((id) => ({ id, score: id === 1 ? 91 : 35, reason: `reason ${id}`, flags: ["f"] })), { id: 999, score: 100, reason: "made up" }] };
  };
  const all = candidates(db, {}).rows;
  assert.deepEqual(await scoreRows(db, cust.id, all, ai), { scored: 3, failed: 0, cached: 0, remaining: 0 });
  assert.deepEqual(await scoreRows(db, cust.id, all, ai), { scored: 0, failed: 0, cached: 3, remaining: 0 });
  assert.equal(calls, 1, "the second call is fully cached");
  const ranked = rankedCandidates(db, cust.id, {});
  assert.equal(ranked.rows[0].name, "Davis Air Conditioning & Heating INC");
  assert.equal(ranked.rows[0].score, 91);
  assert.equal(ranked.unscored, 0);
  saveBuyBox(db, cust.id, { thesis: "Commercial electrical" });
  assert.equal(rankedCandidates(db, cust.id, {}).unscored, 3, "changing the buy box asks for fresh scores");
  assert.equal(rankedCandidates(db, admin.id, {}).unscored, 3, "scores are private to each account");
});

test("saving copies a directory business into the account's pipeline once", async () => {
  const { db, admin, cust } = setup();
  loadDirectoryCsv(db, admin.id, "sponsor_leads_tx_238220.csv", CSV);
  const id = candidates(db, { metro: "houston" }).rows[0].id;
  await scoreRows(db, cust.id, [{ id, name: "x" }], async () => ({ results: [{ id, score: 88, reason: "Old family HVAC firm", flags: ["owner holds license"] }] }));
  assert.deepEqual(saveFromDirectory(db, cust.id, [id]), { added: 1 });
  assert.deepEqual(saveFromDirectory(db, cust.id, [id]), { added: 0 });
  const [b] = listBusinesses(db, cust.id);
  assert.equal(b.owner_name, "Donald B Davis");
  assert.equal(b.score, 88);
  assert.equal(businessDetail(db, cust.id, b.id)!.business.why, "Old family HVAC firm");
  assert.equal(listBusinesses(db, admin.id).length, 0);
  assert.equal(rankedCandidates(db, cust.id, { metro: "houston" }).rows[0].saved, true);
});

test("a batch that fails twice is skipped, not fatal", async () => {
  const { db, admin, cust } = setup();
  loadDirectoryCsv(db, admin.id, "sponsor_leads_tx_238220.csv", CSV);
  let calls = 0;
  const flaky = async () => { calls++; throw new SyntaxError("bad JSON"); };
  await assert.rejects(scoreRows(db, cust.id, candidates(db, {}).rows, flaky), /couldn't score/);
  assert.equal(calls, 2, "retried once");
});
