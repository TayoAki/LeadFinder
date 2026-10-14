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
