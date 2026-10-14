import { test } from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../src/lib/db.ts";
import { signUp } from "../src/lib/auth.ts";
import { grant } from "../src/lib/credits.ts";
import { labSample, labSummaries, LAB_PROVIDERS, startLabTest } from "../src/lib/lab.ts";
import { startRun } from "../src/lib/engine.ts";
import { sanitizeIcp } from "../src/lib/icp.ts";

function seedLeads() {
  const db = openDb(":memory:");
  const admin = signUp(db, { name: "Ad", email: "ad@x.com", password: "password1", acceptedTerms: true });
  const run = Number(db.prepare("INSERT INTO runs (user_id, kind, status, target, max_credits) VALUES (?, 'find', 'completed', 3, 15)").run(admin.id).lastInsertRowid);
  const add = (name: string, domain: string, li: string | null, email: string | null, provider: string | null) => {
    const c = Number(db.prepare("INSERT INTO companies (user_id, domain, name) VALUES (?, ?, ?)").run(admin.id, domain, name + " Co").lastInsertRowid);
    const p = Number(db.prepare("INSERT INTO people (company_id, full_name, linkedin_url) VALUES (?, ?, ?)").run(c, name, li).lastInsertRowid);
    const l = Number(db.prepare("INSERT INTO leads (run_id, user_id, company_id, person_id, state, email, email_provider) VALUES (?, ?, ?, ?, 'done', ?, ?)").run(run, admin.id, c, p, email, provider).lastInsertRowid);
    if (email && provider !== "uploaded") db.prepare("INSERT INTO lead_attempts (lead_id, step, provider, outcome, cost_micro) VALUES (?, 'email', 'quickenrich', 'hit', 4834)").run(l);
  };
  add("Ann", "name:ann-co", "https://linkedin.com/in/ann", "ann@ann.co", "quickenrich.people.email.find");
  add("Bob", "name:bob-co", "https://linkedin.com/in/bob", null, null);
  add("Cat", "cat.com", null, "cat@cat.com", "quickenrich.people.email.find");
  add("Up", "up.com", "https://linkedin.com/in/up", "up@up.com", "uploaded");
  return { db, admin };
}

const prov = (slug: string) => LAB_PROVIDERS.find((p) => p.slug === slug)!;

test("lab sample respects what the provider needs and skips uploaded emails", () => {
  const { db } = seedLeads();
  assert.deepEqual(labSample(db, prov("aiark"), 10).map((s) => s.full_name).sort(), ["Ann", "Bob"]);
  assert.deepEqual(labSample(db, prov("trykitt"), 10).map((s) => s.full_name), ["Cat"], "name_domain needs a real website");
  assert.equal(labSample(db, prov("quickenrich"), 10).length, 3);
});

test("a lab test pins one provider, compares with the waterfall, and never touches credits", async () => {
  const { db, admin } = seedLeads();
  process.env.TREG_TOKEN = "t";
  const seen: Headers[] = [];
  const fake = (async (_url: URL, init: RequestInit) => {
    const h = new Headers(init.headers);
    seen.push(h);
    const body = JSON.parse(String(init.body));
    // Ann: same email as the waterfall. Bob: a new find. Cat: a miss.
    const email = body.full_name === "Ann" ? "ann@ann.co" : body.full_name === "Bob" ? "bob@bob.co" : null;
    return new Response(JSON.stringify({ output: email ? { email } : {} }), {
      headers: { "x-treg-cost-micro": email ? "4834" : "0", "x-treg-served-by": "quickenrich.people.email.find" },
    });
  }) as unknown as typeof fetch;
  const before = (db.prepare("SELECT COALESCE(SUM(delta),0) AS b FROM ledger").get() as { b: number }).b;
  const id = startLabTest(db, admin.id, "quickenrich", 10, fake);
  for (let i = 0; i < 100; i++) {
    if ((db.prepare("SELECT status FROM lab_tests WHERE id = ?").get(id) as { status: string }).status !== "running") break;
    await new Promise((r) => setTimeout(r, 10));
  }
  const [s] = labSummaries(db);
  assert.equal(s.status, "completed");
  assert.equal(s.tried, 3);
  assert.equal(s.hits, 2);
  assert.deepEqual([s.agrees, s.differs, s.newFinds], [1, 0, 1]);
  assert.equal(s.waterfallHits, 2);
  assert.equal(s.costPerHitMicro, 4834);
  assert.equal(s.waterfallCostPerHitMicro, 4834);
  assert.ok(seen.every((h) => h.get("x-treg-route-prefer") === "quickenrich" && h.get("x-treg-route-waterfall") === "0"));
  assert.equal((db.prepare("SELECT COALESCE(SUM(delta),0) AS b FROM ledger").get() as { b: number }).b, before, "lab spends no credits");
  assert.throws(() => startLabTest(db, admin.id, "nope", 5, fake), /Pick a provider/);
  assert.throws(() => startLabTest(db, admin.id, "aiark", 51, fake), /Sample between/);
});

test("a provider that hands off to another one counts as not tried, not as a miss", async () => {
  const { db, admin } = seedLeads();
  process.env.TREG_TOKEN = "t";
  const fake = (async () => new Response(JSON.stringify({ output: { email: "x@y.com" } }), {
    headers: { "x-treg-served-by": "tomba.people.email.find" },
  })) as unknown as typeof fetch;
  startLabTest(db, admin.id, "aiark", 10, fake);
  for (let i = 0; i < 100 && (db.prepare("SELECT status FROM lab_tests").get() as { status: string }).status === "running"; i++) {
    await new Promise((r) => setTimeout(r, 10));
  }
  const [s] = labSummaries(db);
  assert.equal(s.tried, 0);
  assert.equal(s.hitRate, null);
});

test("a failed opening line is retried, then its reason is recorded on the lead", async () => {
  const db = openDb(":memory:");
  const u = signUp(db, { name: "A", email: "a@x.com", password: "password1", acceptedTerms: true });
  grant(db, u.id, 100, "t");
  const biz = Number(db.prepare("INSERT INTO businesses (user_id, website) VALUES (?, 'https://x.com')").run(u.id).lastInsertRowid);
  const icp = sanitizeIcp({ summary: "We sell X", jobTitles: ["Owner"] });
  const icpId = Number(db.prepare("INSERT INTO icps (business_id, status, icp_json) VALUES (?, 'ready', ?)").run(biz, JSON.stringify(icp)).lastInsertRowid);
  process.env.TREG_TOKEN = "t";
  const fake = (async (url: URL, init: RequestInit) => {
    const e = url.pathname.replace("/call/", "");
    if (e === "dropleads.people.search") {
      const page = JSON.parse(String(init.body)).pagination.page;
      return new Response(JSON.stringify({ data: { leads: page > 1 ? [] : [{ fullName: "Ann One", firstName: "Ann", linkedinUrl: "https://linkedin.com/in/ann", companyName: "Ann Co" }] } }));
    }
    if (e === "treg.people.email.find") return new Response(JSON.stringify({ output: {} }));
    throw new Error(e);
  }) as unknown as typeof fetch;
  let calls = 0;
  const runId = startRun(db, u.id, icpId, 1, false, { fetchImpl: fake, openingLine: async () => { calls++; throw new Error("AI HTTP 429: slow down"); } });
  for (let i = 0; i < 400; i++) {
    if ((db.prepare("SELECT status FROM runs WHERE id = ?").get(runId) as { status: string }).status === "completed") break;
    await new Promise((r) => setTimeout(r, 10));
  }
  assert.equal(calls, 2, "retried once");
  const a = db.prepare("SELECT outcome FROM lead_attempts WHERE step = 'opening_line'").get() as { outcome: string };
  assert.equal(a.outcome, "failed: AI HTTP 429: slow down");
  const l = db.prepare("SELECT full_name FROM people").get() as { full_name: string };
  assert.equal(l.full_name, "Ann One", "camelCase people-search fields (as returned live) are read");
});
