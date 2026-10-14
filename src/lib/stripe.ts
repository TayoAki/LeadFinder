import crypto from "node:crypto";
import type { DB } from "./db.ts";
import { grant } from "./credits.ts";

// Credit packs sold through Stripe Checkout. Prices in US cents; bigger packs are cheaper per credit.
// Override with LEADFINDER_PACKS='[{"id":"starter","credits":500,"cents":1000}, ...]'.
export interface Pack {
  id: string;
  credits: number;
  cents: number;
  label?: string;
}

const DEFAULT_PACKS: Pack[] = [
  { id: "starter", credits: 500, cents: 1000, label: "Starter" },
  { id: "growth", credits: 2500, cents: 4500, label: "Growth" },
  { id: "scale", credits: 10000, cents: 16000, label: "Scale" },
];

export function packs(): Pack[] {
  try {
    const raw = process.env.LEADFINDER_PACKS;
    if (raw) {
      const parsed = JSON.parse(raw) as Pack[];
      if (Array.isArray(parsed) && parsed.every((p) => p.id && Number.isInteger(p.credits) && p.credits > 0 && Number.isInteger(p.cents) && p.cents >= 50)) return parsed;
    }
  } catch {
    // fall through to the defaults
  }
  return DEFAULT_PACKS;
}

export const stripeConfigured = () => Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET);
export const appUrl = () => (process.env.APP_URL ?? "http://localhost:3000").replace(/\/$/, "");

type FetchLike = typeof fetch;

/** Create a Stripe Checkout session for a pack. The session id becomes the payment's idempotency key. */
export async function createCheckout(db: DB, user: { id: number; email: string }, packId: string, fetchImpl: FetchLike = fetch) {
  const pack = packs().find((p) => p.id === packId);
  if (!pack) throw new Error("Unknown pack");
  if (!process.env.STRIPE_SECRET_KEY) throw new Error("Card payments aren't set up yet");
  const form = new URLSearchParams({
    mode: "payment",
    customer_email: user.email,
    client_reference_id: String(user.id),
    success_url: `${appUrl()}/billing?paid=1`,
    cancel_url: `${appUrl()}/billing`,
    "line_items[0][quantity]": "1",
    "line_items[0][price_data][currency]": "usd",
    "line_items[0][price_data][unit_amount]": String(pack.cents),
    "line_items[0][price_data][product_data][name]": `LeadFinder credits: ${pack.credits.toLocaleString("en-US")}`,
    "metadata[user_id]": String(user.id),
    "metadata[pack_id]": pack.id,
    "metadata[credits]": String(pack.credits),
  });
  const res = await fetchImpl("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: form,
  });
  const data = (await res.json()) as { id?: string; url?: string; error?: { message?: string } };
  if (!res.ok || !data.url || !data.id) throw new Error(data.error?.message ?? `Stripe HTTP ${res.status}`);
  db.prepare("INSERT INTO payments (stripe_session_id, user_id, pack_id, credits, amount_cents, status) VALUES (?, ?, ?, ?, ?, 'pending')").run(
    data.id, user.id, pack.id, pack.credits, pack.cents,
  );
  return data.url;
}

/** Stripe-Signature: "t=<unix>,v1=<hex hmac of `${t}.${body}`>". Rejects bad signatures and old timestamps. */
export function verifyStripeSignature(rawBody: string, header: string | null, secret: string, nowSec = Math.floor(Date.now() / 1000), toleranceSec = 300) {
  if (!header) return false;
  const parts = Object.fromEntries(header.split(",").map((kv) => kv.split("=", 2) as [string, string]).filter((p) => p.length === 2));
  const t = Number(parts.t);
  const sigs = header.split(",").filter((kv) => kv.startsWith("v1=")).map((kv) => kv.slice(3));
  if (!t || !sigs.length || Math.abs(nowSec - t) > toleranceSec) return false;
  const expected = crypto.createHmac("sha256", secret).update(`${t}.${rawBody}`).digest("hex");
  return sigs.some((s) => s.length === expected.length && crypto.timingSafeEqual(Buffer.from(s), Buffer.from(expected)));
}

/**
 * Apply a verified Stripe event. Only a paid checkout grants credits, and each session grants once,
 * however many times Stripe retries the webhook. The credit amount comes from our own payments row, not the event.
 */
export function handleStripeEvent(db: DB, event: { type: string; data: { object: any } }): "granted" | "duplicate" | "ignored" {
  if (event.type !== "checkout.session.completed" && event.type !== "checkout.session.async_payment_succeeded") return "ignored";
  const s = event.data.object;
  if (s.payment_status !== "paid") return "ignored";
  return db.transaction(() => {
    const pay = db.prepare("SELECT * FROM payments WHERE stripe_session_id = ?").get(s.id) as
      | { user_id: number; credits: number; amount_cents: number; status: string }
      | undefined;
    if (!pay) return "ignored"; // not a session we created
    if (pay.status === "paid") return "duplicate";
    if (Number(s.amount_total) !== pay.amount_cents) {
      db.prepare("UPDATE payments SET status = 'mismatch', updated_at = datetime('now') WHERE stripe_session_id = ?").run(s.id);
      return "ignored";
    }
    db.prepare("UPDATE payments SET status = 'paid', updated_at = datetime('now') WHERE stripe_session_id = ?").run(s.id);
    grant(db, pay.user_id, pay.credits, `Bought ${pay.credits.toLocaleString("en-US")} credits ($${(pay.amount_cents / 100).toFixed(2)})`, "topup");
    return "granted";
  })();
}
