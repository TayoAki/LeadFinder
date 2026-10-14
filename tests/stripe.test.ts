import { test } from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import { openDb } from "../src/lib/db.ts";
import { signUp } from "../src/lib/auth.ts";
import { balance } from "../src/lib/credits.ts";
import { createCheckout, handleStripeEvent, packs, verifyStripeSignature } from "../src/lib/stripe.ts";

const sign = (body: string, secret: string, t: number) => `t=${t},v1=${crypto.createHmac("sha256", secret).update(`${t}.${body}`).digest("hex")}`;

test("webhook signatures: valid passes; tampered, wrong secret, old or missing fail", () => {
  const now = 1_800_000_000;
  const body = '{"a":1}';
  assert.ok(verifyStripeSignature(body, sign(body, "whsec_x", now), "whsec_x", now));
  assert.ok(!verifyStripeSignature('{"a":2}', sign(body, "whsec_x", now), "whsec_x", now));
  assert.ok(!verifyStripeSignature(body, sign(body, "whsec_y", now), "whsec_x", now));
  assert.ok(!verifyStripeSignature(body, sign(body, "whsec_x", now - 1000), "whsec_x", now));
  assert.ok(!verifyStripeSignature(body, null, "whsec_x", now));
});

test("checkout creates a pending payment; only a paid, matching session grants credits, exactly once", async () => {
  const db = openDb(":memory:");
  const u = signUp(db, { name: "A", email: "a@x.com", password: "password1", acceptedTerms: true });
  process.env.STRIPE_SECRET_KEY = "sk_test_x";
  let sent: URLSearchParams | undefined;
  const fake = (async (_url: string, init: RequestInit) => {
    sent = init.body as URLSearchParams;
    return new Response(JSON.stringify({ id: "cs_1", url: "https://checkout.stripe.com/c/cs_1" }));
  }) as unknown as typeof fetch;
  const pack = packs()[0];
  assert.equal(await createCheckout(db, u, pack.id, fake), "https://checkout.stripe.com/c/cs_1");
  assert.equal(sent?.get("line_items[0][price_data][unit_amount]"), String(pack.cents));
  await assert.rejects(createCheckout(db, u, "nope", fake), /Unknown pack/);

  const ev = (status: string, amount = pack.cents, id = "cs_1") => ({ type: "checkout.session.completed", data: { object: { id, payment_status: status, amount_total: amount } } });
  const before = balance(db, u.id);
  assert.equal(handleStripeEvent(db, ev("unpaid")), "ignored");
  assert.equal(handleStripeEvent(db, ev("paid", pack.cents, "cs_unknown")), "ignored", "sessions we didn't create are ignored");
  assert.equal(handleStripeEvent(db, ev("paid")), "granted");
  assert.equal(handleStripeEvent(db, ev("paid")), "duplicate", "Stripe retries don't double-grant");
  assert.equal(balance(db, u.id), before + pack.credits);
  assert.equal(handleStripeEvent(db, { type: "invoice.paid", data: { object: {} } }), "ignored");
});

test("an amount that doesn't match the pack is flagged, not granted", async () => {
  const db = openDb(":memory:");
  const u = signUp(db, { name: "A", email: "a@x.com", password: "password1", acceptedTerms: true });
  process.env.STRIPE_SECRET_KEY = "sk_test_x";
  const fake = (async () => new Response(JSON.stringify({ id: "cs_2", url: "https://x" }))) as unknown as typeof fetch;
  await createCheckout(db, u, packs()[1].id, fake);
  const before = balance(db, u.id);
  assert.equal(handleStripeEvent(db, { type: "checkout.session.completed", data: { object: { id: "cs_2", payment_status: "paid", amount_total: 1 } } }), "ignored");
  assert.equal(balance(db, u.id), before);
  assert.equal((db.prepare("SELECT status FROM payments WHERE stripe_session_id = 'cs_2'").get() as { status: string }).status, "mismatch");
});
