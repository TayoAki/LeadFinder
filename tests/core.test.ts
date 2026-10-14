import { test } from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../src/lib/db.ts";
import { signUp, logIn, createSession, userForSession, AuthError } from "../src/lib/auth.ts";
import { balance, placeHold, chargeFromHold, settleHold, maxCreditsFor, InsufficientCredits } from "../src/lib/credits.ts";
import { tregCall, tregCostTotals } from "../src/lib/treg.ts";

const fresh = () => openDb(":memory:");
const user = (db: ReturnType<typeof fresh>, email = "a@x.com") =>
  signUp(db, { name: "A", email, password: "password1", acceptedTerms: true });

test("first account is admin, later ones customers, each gets 50 credits", () => {
  const db = fresh();
  const a = user(db), b = user(db, "b@x.com");
  assert.equal(a.role, "admin");
  assert.equal(b.role, "customer");
  assert.equal(balance(db, b.id), 50);
});

test("sign-up requires terms; login and sessions work", () => {
  const db = fresh();
  assert.throws(() => signUp(db, { name: "A", email: "a@x.com", password: "password1", acceptedTerms: false }), AuthError);
  const a = user(db);
  assert.throws(() => logIn(db, "a@x.com", "wrong-pass"), AuthError);
  assert.equal(logIn(db, "A@X.com ", "password1").id, a.id);
  const { token } = createSession(db, a.id);
  assert.equal(userForSession(db, token)?.id, a.id);
  assert.equal(userForSession(db, "nope"), null);
});

test("hold, charge within hold, refund the rest exactly once", () => {
  const db = fresh();
  const a = user(db);
  const hold = placeHold(db, a.id, 30, 1);
  assert.equal(balance(db, a.id), 20);
  assert.ok(chargeFromHold(db, hold, 18));
  assert.equal(chargeFromHold(db, hold, 13), false, "cannot exceed the hold");
  assert.deepEqual(settleHold(db, hold), { charged: 18, refunded: 12 });
  assert.deepEqual(settleHold(db, hold), { charged: 18, refunded: 0 });
  assert.equal(balance(db, a.id), 32);
  assert.throws(() => placeHold(db, a.id, 999, 2), InsufficientCredits);
});

test("max credits: mobiles are opt-in", () => {
  assert.equal(maxCreditsFor(10, false), 50);
  assert.equal(maxCreditsFor(10, true), 150);
});

test("tregCall sends token + idempotency + cap and records the real cost", async () => {
  const db = fresh();
  process.env.TREG_TOKEN = "t0k";
  let seen: Headers | undefined;
  const fake = (async (_url: URL, init: RequestInit) => {
    seen = new Headers(init.headers);
    return new Response(JSON.stringify({ output: { email: "j@x.com" }, _treg: { served_by: "quickenrich", tried: ["quickenrich"] } }), {
      status: 200,
      headers: { "x-treg-cost-micro": "4834" },
    });
  }) as unknown as typeof fetch;
  const r = await tregCall(db, "treg.people.email.find", { body: { domain: "x.com" }, idempotencyKey: "k1", maxCostUsd: 0.05, runId: 7 }, fake);
  assert.ok(r.ok);
  assert.equal(r.servedBy, "quickenrich");
  assert.equal(seen?.get("x-treg-token"), "t0k");
  assert.equal(seen?.get("idempotency-key"), "k1");
  assert.equal(seen?.get("x-treg-route-max-cost"), "0.05");
  assert.deepEqual(tregCostTotals(db, 7), { calls: 1, cost_micro: 4834 });
});

test("AI client uses OpenRouter when its key is set, Anthropic otherwise", async () => {
  const { aiText, modelFor } = await import("../src/lib/claude.ts");
  const seen: { url: string; body: any; auth: string | null }[] = [];
  const fake = (async (url: string, init: RequestInit) => {
    const h = new Headers(init.headers);
    seen.push({ url, body: JSON.parse(String(init.body)), auth: h.get("authorization") ?? h.get("x-api-key") });
    const or = url.includes("openrouter");
    return new Response(JSON.stringify(or ? { choices: [{ message: { content: "hi-or" } }] } : { content: [{ type: "text", text: "hi-an" }] }));
  }) as unknown as typeof fetch;
  process.env.OPENROUTER_API_KEY = "or-key";
  assert.equal(modelFor("icp"), "anthropic/claude-opus-5.5");
  assert.equal(await aiText({ role: "line", system: "s", prompt: "p" }, fake), "hi-or");
  assert.equal(seen[0].auth, "Bearer or-key");
  assert.equal(seen[0].body.messages[0].role, "system");
  delete process.env.OPENROUTER_API_KEY;
  process.env.ANTHROPIC_API_KEY = "an-key";
  assert.equal(modelFor("icp"), "claude-opus-5-5");
  assert.equal(await aiText({ role: "icp", system: "s", prompt: "p" }, fake), "hi-an");
  assert.equal(seen[1].auth, "an-key");
  delete process.env.ANTHROPIC_API_KEY;
});
