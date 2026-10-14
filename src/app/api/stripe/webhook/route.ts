import { NextResponse } from "next/server";
import { db } from "@/lib/db.ts";
import { handleStripeEvent, verifyStripeSignature } from "@/lib/stripe.ts";

// Stripe calls this; there's no session. Trust comes only from the signature.
export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  const raw = await req.text();
  if (!verifyStripeSignature(raw, req.headers.get("stripe-signature"), secret)) {
    return NextResponse.json({ error: "Bad signature" }, { status: 400 });
  }
  const result = handleStripeEvent(db(), JSON.parse(raw));
  return NextResponse.json({ received: true, result });
}
