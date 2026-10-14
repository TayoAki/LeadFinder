import { test } from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../src/lib/db.ts";
import { signUp } from "../src/lib/auth.ts";
import { csvCell, deleteLeads, queryLeads, toCsv } from "../src/lib/leads.ts";

function seed() {
  const db = openDb(":memory:");
  const a = signUp(db, { name: "A", email: "a@x.com", password: "password1", acceptedTerms: true });
  const b = signUp(db, { name: "B", email: "b@x.com", password: "password1", acceptedTerms: true });
  const run = Number(db.prepare("INSERT INTO runs (user_id, kind, status, target, max_credits) VALUES (?, 'find', 'completed', 3, 15)").run(a.id).lastInsertRowid);
  const add = (user: number, name: string, company: string, email: string | null, status: string, mobile: string | null = null, state = "done") => {
    const c = Number(db.prepare("INSERT INTO companies (user_id, domain, name) VALUES (?, ?, ?)").run(user, `${company.toLowerCase()}.com`, company).lastInsertRowid);
    const p = Number(db.prepare("INSERT INTO people (company_id, full_name, title) VALUES (?, ?, 'Owner')").run(c, name).lastInsertRowid);
    return Number(db.prepare("INSERT INTO leads (run_id, user_id, company_id, person_id, state, email, email_status, mobile, credits) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 5)")
      .run(run, user, c, p, state, email, status, mobile).lastInsertRowid);
  };
  const ids = {
    ann: add(a.id, "Ann", "Acme", "ann@acme.com", "verified", "+447700900001"),
    cat: add(a.id, "Cat", "Bolt", "cat@bolt.com", "catch_all"),
    dan: add(a.id, "Dan", "Crux", null, "not_found"),
    live: add(a.id, "Liv", "Dyn", null, "not_found", null, "finding_email"),
    other: add(b.id, "Zed", "Zeta", "z@zeta.com", "verified"),
  };
  return { db, a, b, ids };
}

test("leads are scoped to the account, exclude in-flight rows, and filter/search/sort", () => {
  const { db, a } = seed();
  assert.deepEqual(queryLeads(db, a.id).map((r) => r.full_name).sort(), ["Ann", "Cat", "Dan"]);
  assert.deepEqual(queryLeads(db, a.id, { status: "verified" }).map((r) => r.full_name), ["Ann"]);
  assert.deepEqual(queryLeads(db, a.id, { status: "has_mobile" }).map((r) => r.full_name), ["Ann"]);
  assert.deepEqual(queryLeads(db, a.id, { q: "BOLT" }).map((r) => r.full_name), ["Cat"]);
  assert.deepEqual(queryLeads(db, a.id, { q: "100%" }), [], "LIKE wildcards in the search are literal");
  assert.deepEqual(queryLeads(db, a.id, { sort: "name" }).map((r) => r.full_name), ["Ann", "Cat", "Dan"]);
});

test("delete only touches the caller's finished leads", () => {
  const { db, a, ids } = seed();
  assert.equal(deleteLeads(db, a.id, [ids.ann, ids.other, ids.live, 999]), 1);
  assert.equal(queryLeads(db, a.id).length, 2);
  assert.equal((db.prepare("SELECT COUNT(*) AS n FROM leads").get() as { n: number }).n, 4);
});

test("CSV export escapes formulas, quotes and commas", () => {
  assert.equal(csvCell("=HYPERLINK(\"x\")"), `"'=HYPERLINK(""x"")"`);
  assert.equal(csvCell("+447700900001"), "'+447700900001");
  assert.equal(csvCell("Smith, Jones"), `"Smith, Jones"`);
  assert.equal(csvCell(null), "");
  const { db, a } = seed();
  const csv = toCsv(queryLeads(db, a.id, { sort: "name" }));
  const lines = csv.trim().split("\r\n");
  assert.equal(lines.length, 4);
  assert.match(lines[0], /^Name,Title,Company,Domain,Email/);
  assert.match(lines[1], /^Ann,Owner,Acme,acme\.com,ann@acme\.com,verified/);
});
