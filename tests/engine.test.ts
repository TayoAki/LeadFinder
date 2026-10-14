import { test } from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../src/lib/db.ts";
import { signUp } from "../src/lib/auth.ts";
import { balance, grant } from "../src/lib/credits.ts";
import { processRun, startRun, runSummary, recoverInterruptedRuns } from "../src/lib/engine.ts";
import { sanitizeIcp } from "../src/lib/icp.ts";
import { verifyStatusFrom, emailFrom, personFrom } from "../src/lib/normalize.ts";

const icp = sanitizeIcp({ summary: "We sell X", jobTitles: ["Owner"], industries: ["Plumbing"], countries: ["United Kingdom"], employeeMin: 1, employeeMax: 20 });

function setup() {
  const db = openDb(":memory:");
  const u = signUp(db, { name: "A", email: "a@x.com", password: "password1", acceptedTerms: true });
  grant(db, u.id, 200, "test");
  const biz = Number(db.prepare("INSERT INTO businesses (user_id, website) VALUES (?, 'https://x.com')").run(u.id).lastInsertRowid);
  const icpId = Number(db.prepare("INSERT INTO icps (business_id, status, icp_json) VALUES (?, 'ready', ?)").run(biz, JSON.stringify(icp)).lastInsertRowid);
  return { db, u, icpId };
}

// Simulated Treg: 4 people (two at the same company), emails for 3, one catch-all, one invalid.
function fakeTreg(calls: string[]) {
  return (async (url: URL, init: RequestInit) => {
    const endpoint = url.pathname.replace("/call/", "");
    calls.push(endpoint);
    const body = init.body ? JSON.parse(String(init.body)) : {};
    const json = (data: unknown, cost = 0, servedBy?: string) =>
      new Response(JSON.stringify(data), { status: 200, headers: { "x-treg-cost-micro": String(cost), ...(servedBy ? { "x-treg-served-by": servedBy } : {}) } });
    if (endpoint === "dropleads.people.search") {
      if (body.pagination.page > 1) return json({ data: { leads: [] } });
      return json({ data: { leads: [
        { first_name: "Ann", last_name: "One", title: "Owner", linkedin_url: "https://linkedin.com/in/ann", organization_name: "Ann Plumbing" },
        { first_name: "Bob", last_name: "Two", title: "Owner", linkedin_url: "https://linkedin.com/in/bob", organization_name: "Ann Plumbing" },
        { first_name: "Cat", last_name: "Three", title: "Director", linkedin_url: "https://linkedin.com/in/cat", organization_name: "Cat Roofing" },
        { first_name: "Dan", last_name: "Four", title: "Owner", linkedin_url: "https://linkedin.com/in/dan", organization_name: "Dan Electric" },
        { first_name: "Eve", last_name: "Five", title: "Owner", organization_name: "No Identity Ltd" },
      ] } });
    }
    if (endpoint === "treg.people.email.find") {
      const who = body.linkedin_url.split("/").pop();
      if (who === "dan") return json({ output: {}, _treg: { tried: ["quickenrich", "trykitt"] } });
      return json({ output: { email: `${who}@co.uk` }, _treg: { served_by: "quickenrich", tried: ["quickenrich"] } }, 4834, "quickenrich");
    }
    if (endpoint === "treg.people.email.verify") {
      const status = body.email.startsWith("cat") ? "catch_all" : "valid";
      return json({ output: { status } });
    }
    throw new Error(`unexpected ${endpoint}`);
  }) as unknown as typeof fetch;
}

test("a run finds one person per company, pays only for results, refunds the rest", async () => {
  const { db, u, icpId } = setup();
  const before = balance(db, u.id);
  const calls: string[] = [];
  process.env.TREG_TOKEN = "t";
  const deps = { fetchImpl: fakeTreg(calls), openingLine: async () => "Who answers when you're up a ladder?" };
  // startRun kicks off processing in the background; wait for it by polling the run status.
  const runId = startRun(db, u.id, icpId, 10, false, deps);
  for (let i = 0; i < 100; i++) {
    const st = (db.prepare("SELECT status FROM runs WHERE id = ?").get(runId) as { status: string }).status;
    if (st === "completed" || st === "failed") break;
    await new Promise((r) => setTimeout(r, 10));
  }
  const s = runSummary(db, runId, u.id)!;
  assert.equal(s.run.status, "completed");
  assert.equal(s.leads.length, 3, "Bob shares Ann's company; Eve has no LinkedIn or domain");
  const byName = Object.fromEntries(s.leads.map((l: any) => [l.full_name, l]));
  assert.equal(byName["Ann One"].email_status, "verified");
  assert.equal(byName["Ann One"].credits, 5);
  assert.equal(byName["Cat Three"].email_status, "catch_all");
  assert.equal(byName["Cat Three"].credits, 3);
  assert.equal(byName["Dan Four"].email_status, "not_found");
  assert.equal(byName["Dan Four"].credits, 1, "a miss costs only the person credit");
  assert.equal(byName["Ann One"].opening_line, "Who answers when you're up a ladder?");
  assert.equal(s.hold.charged, 9);
  assert.equal(balance(db, u.id), before - 9, "held 50, charged 9, refunded 41");
  assert.equal(s.tregCostMicro, 4834 * 2);
  assert.ok(!calls.includes("treg.people.phone.find"), "mobiles are opt-in");
  assert.ok(s.attempts.some((a: any) => a.provider === "trykitt" && a.outcome === "miss"), "waterfall misses are recorded");
});

test("a run cannot exceed the balance, and only one runs at a time", () => {
  const { db, u, icpId } = setup();
  assert.throws(() => startRun(db, u.id, icpId, 1000, true, { fetchImpl: fakeTreg([]) }), /credits/);
  assert.equal((db.prepare("SELECT COUNT(*) AS n FROM runs").get() as { n: number }).n, 0, "failed hold leaves no run behind");
});

test("runs interrupted by a restart are closed and refunded", () => {
  const { db, u, icpId } = setup();
  const before = balance(db, u.id);
  const runId = Number(db.prepare("INSERT INTO runs (user_id, icp_id, kind, status, target, max_credits) VALUES (?, ?, 'find', 'running', 5, 25)").run(u.id, icpId).lastInsertRowid);
  db.prepare("INSERT INTO holds (user_id, run_id, amount, charged) VALUES (?, ?, 25, 5)").run(u.id, runId);
  db.prepare("INSERT INTO ledger (user_id, kind, delta, note, run_id) VALUES (?, 'hold', -25, 'h', ?)").run(u.id, runId);
  assert.equal(recoverInterruptedRuns(db), 1);
  assert.equal(balance(db, u.id), before - 5);
});

test("normalizers", () => {
  assert.equal(verifyStatusFrom({ output: { status: "deliverable" } }), "verified");
  assert.equal(verifyStatusFrom({ output: { status: "accept_all" } }), "catch_all");
  assert.equal(verifyStatusFrom({ output: { result: "undeliverable" } }), "invalid");
  assert.equal(verifyStatusFrom({ output: {} }), "risky");
  assert.equal(emailFrom({ output: { email: "j***@x.com" } }), null, "masked teasers are not emails");
  assert.equal(personFrom({ first_name: "A", last_name: "B", organization_website: "https://www.acme.co.uk/" })?.companyDomain, "acme.co.uk");
});
