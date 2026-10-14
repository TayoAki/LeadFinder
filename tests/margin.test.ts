import { test } from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../src/lib/db.ts";
import { signUp } from "../src/lib/auth.ts";
import { balance } from "../src/lib/credits.ts";
import { accounts, adminAdjust, costBreakdown, marginTotals, runMargins, runReceipts } from "../src/lib/margin.ts";

function seed() {
  const db = openDb(":memory:");
  const admin = signUp(db, { name: "Ad", email: "ad@x.com", password: "password1", acceptedTerms: true });
  const cust = signUp(db, { name: "Cu", email: "cu@x.com", password: "password1", acceptedTerms: true });
  const run = Number(db.prepare("INSERT INTO runs (user_id, kind, status, target, max_credits, charged) VALUES (?, 'find', 'completed', 10, 50, 20)").run(cust.id).lastInsertRowid);
  const c = Number(db.prepare("INSERT INTO companies (user_id, domain) VALUES (?, 'a.com')").run(cust.id).lastInsertRowid);
  const p = Number(db.prepare("INSERT INTO people (company_id, full_name) VALUES (?, 'A')").run(c).lastInsertRowid);
  for (const st of ["verified", "verified", "catch_all", "not_found"]) {
    db.prepare("INSERT INTO leads (run_id, user_id, company_id, person_id, state, email_status) VALUES (?, ?, ?, ?, 'done', ?)").run(run, cust.id, c, p, st);
  }
  const call = db.prepare("INSERT INTO treg_calls (run_id, endpoint, served_by, http_status, cost_micro, latency_ms, error) VALUES (?, ?, ?, 200, ?, 100, ?)");
  call.run(run, "treg.people.email.find", "quickenrich", 4834, null);
  call.run(run, "treg.people.email.find", "trykitt", 5000, null);
  call.run(run, "treg.people.email.find", null, 0, null);
  call.run(null, "anyapi.web.crawl", null, 4500, null);
  call.run(null, "dropleads.companies.search.count", null, 0, "HTTP 500");
  return { db, admin, cust, run };
}

test("margin: revenue from credits charged, Treg cost split into runs and overhead", () => {
  process.env.LEADFINDER_CREDIT_USD = "0.02";
  const { db } = seed();
  const t = marginTotals(db);
  assert.equal(t.creditsCharged, 20);
  assert.equal(t.revenueMicro, 400_000, "20 credits × $0.02");
  assert.equal(t.runCostMicro, 9834);
  assert.equal(t.overheadMicro, 4500);
  assert.equal(t.costMicro, 14_334);
  assert.equal(t.verified, 2);
  assert.equal(t.costPerVerifiedMicro, 4917);
  assert.ok(Math.abs(t.marginPct! - 96.4165) < 0.001);
  const [r] = runMargins(db);
  assert.equal(r.leads, 4);
  assert.equal(r.cost_micro, 9834);
  assert.equal(r.revenue_micro, 400_000);
});

test("margin with nothing charged has no percentage rather than dividing by zero", () => {
  const db = openDb(":memory:");
  const t = marginTotals(db);
  assert.equal(t.marginPct, null);
  assert.equal(t.costPerVerifiedMicro, null);
});

test("cost breakdown by endpoint and by serving provider", () => {
  const { db } = seed();
  const { byEndpoint, emailProviders } = costBreakdown(db);
  assert.equal(byEndpoint[0].endpoint, "treg.people.email.find");
  assert.equal(byEndpoint[0].calls, 3);
  assert.equal(byEndpoint.find((e) => e.endpoint.startsWith("dropleads"))!.errors, 1);
  assert.deepEqual(emailProviders.map((p) => p.provider).sort(), ["(none)", "quickenrich", "trykitt"]);
});

test("admin credit adjustments go through the ledger and can't go below zero", () => {
  const { db, admin, cust } = seed();
  adminAdjust(db, admin.id, cust.id, 100, "Pilot customer");
  assert.equal(balance(db, cust.id), 150);
  adminAdjust(db, admin.id, cust.id, -30, "");
  assert.equal(balance(db, cust.id), 120);
  assert.throws(() => adminAdjust(db, admin.id, cust.id, -500, ""), /below zero/);
  assert.throws(() => adminAdjust(db, admin.id, cust.id, 1.5, ""), /whole number/);
  assert.throws(() => adminAdjust(db, admin.id, 999, 5, ""), /not found/);
  const note = (db.prepare("SELECT note FROM ledger WHERE user_id = ? ORDER BY id DESC LIMIT 1 OFFSET 1").get(cust.id) as { note: string }).note;
  assert.equal(note, "Pilot customer (LeadFinder team)");
  assert.equal(accounts(db).find((u) => u.id === cust.id)!.balance, 120);
});

test("customer receipts show held, charged and refunded, scoped to the account", () => {
  const { db, admin, cust } = seed();
  const [r] = runReceipts(db, cust.id);
  assert.deepEqual([r.held, r.charged, r.refunded, r.leads, r.verified], [50, 20, 30, 4, 2]);
  assert.equal(runReceipts(db, admin.id).length, 0);
});
