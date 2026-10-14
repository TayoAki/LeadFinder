import { test } from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../src/lib/db.ts";
import { signUp } from "../src/lib/auth.ts";
import { balance } from "../src/lib/credits.ts";
import { runSummary } from "../src/lib/engine.ts";
import { parseCsv, parseList, startCleanRun } from "../src/lib/lists.ts";

test("CSV parser handles quotes, commas, newlines, CRLF and a BOM", () => {
  assert.deepEqual(parseCsv('﻿a,b\r\n"x, y","he said ""hi"""\n"multi\nline",z\n\n'), [
    ["a", "b"], ["x, y", 'he said "hi"'], ["multi\nline", "z"],
  ]);
});

test("parseList maps common headers, derives domains, skips bad and duplicate rows", () => {
  const csv = [
    "First Name,Last Name,Company,Website,LinkedIn URL,Email Address,Job Title",
    "Ann,Lee,Acme,https://www.acme.co.uk/,,,Owner",
    "Bob,Ray,,,linkedin.com/in/bob,,",
    "Cat,Ng,,,,cat@bolt.io,",
    "Dan,Oh,NoSite,,,,",
    "Eve,Ko,,,,not-an-email,",
    "Cat,Ng,,,,CAT@bolt.io,",
  ].join("\n");
  const list = parseList(csv);
  assert.equal(list.rows.length, 3);
  const [ann, bob, cat] = list.rows;
  assert.equal(ann.person.fullName, "Ann Lee");
  assert.equal(ann.person.companyDomain, "acme.co.uk");
  assert.equal(ann.person.title, "Owner");
  assert.equal(bob.person.linkedinUrl, "https://linkedin.com/in/bob");
  assert.equal(cat.email, "cat@bolt.io");
  assert.equal(cat.person.companyDomain, "bolt.io", "domain comes from the email when there's no website");
  assert.deepEqual(list.skipped.map((s) => [s.line, s.reason]), [
    [5, "needs an email, a LinkedIn URL, or a name and website"],
    [6, "email isn't valid"],
    [7, "duplicate"],
  ]);
});

test("parseList rejects files with no usable column, or too many rows", () => {
  assert.throws(() => parseList("Name,Phone\nAnn,123"), /email, LinkedIn or website column/);
  assert.throws(() => parseList("email\n" + Array.from({ length: 1001 }, (_, i) => `a${i}@x.com`).join("\n")), /up to 1,000 rows/);
});

test("cleaning a list: uploaded emails are only verified, missing ones go through the waterfall, no person credit", async () => {
  const db = openDb(":memory:");
  const u = signUp(db, { name: "A", email: "a@x.com", password: "password1", acceptedTerms: true });
  const calls: string[] = [];
  const fake = (async (url: URL, init: RequestInit) => {
    const endpoint = url.pathname.replace("/call/", "");
    const body = JSON.parse(String(init.body));
    calls.push(endpoint);
    const json = (d: unknown, cost = 0) => new Response(JSON.stringify(d), { headers: { "x-treg-cost-micro": String(cost) } });
    if (endpoint === "treg.people.email.find") return json({ output: { email: "ann@acme.co.uk" }, _treg: { served_by: "quickenrich", tried: ["quickenrich"] } }, 4834);
    if (endpoint === "treg.people.email.verify") return json({ output: { status: body.email.startsWith("bad") ? "invalid" : "valid" } });
    throw new Error(`unexpected ${endpoint}`);
  }) as unknown as typeof fetch;
  process.env.TREG_TOKEN = "t";
  const list = parseList("Name,Website,Email\nAnn Lee,acme.co.uk,\nCat Ng,,cat@bolt.io\nBad Row,,bad@gone.com");
  const before = balance(db, u.id);
  const runId = startCleanRun(db, u.id, "my list.csv", list, false, { fetchImpl: fake, openingLine: async () => null });
  for (let i = 0; i < 100; i++) {
    if ((db.prepare("SELECT status FROM runs WHERE id = ?").get(runId) as { status: string }).status === "completed") break;
    await new Promise((r) => setTimeout(r, 10));
  }
  const s = runSummary(db, runId, u.id)!;
  assert.equal(s.run.kind, "clean");
  const by = Object.fromEntries(s.leads.map((l: any) => [l.full_name, l]));
  assert.equal(by["Ann Lee"].email, "ann@acme.co.uk");
  assert.equal(by["Ann Lee"].email_provider, "quickenrich");
  assert.equal(by["Ann Lee"].credits, 4, "found + verified, no person credit");
  assert.equal(by["Cat Ng"].email_provider, "uploaded");
  assert.equal(by["Cat Ng"].credits, 1, "verify-only");
  assert.equal(by["Bad Row"].email, null, "invalid emails are never delivered");
  assert.equal(by["Bad Row"].credits, 0);
  assert.equal(calls.filter((c) => c === "treg.people.email.find").length, 1, "only the row without an email is looked up");
  assert.equal(s.hold.amount, 12);
  assert.equal(balance(db, u.id), before - 5, "held 12, charged 5, refunded 7");
  assert.equal((db.prepare("SELECT filename, row_count FROM lists").get() as any).row_count, 3);
});
