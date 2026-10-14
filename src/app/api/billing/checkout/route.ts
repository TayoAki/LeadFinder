import { NextResponse } from "next/server";
import { db } from "@/lib/db.ts";
import { withUser } from "@/lib/api.ts";
import { createCheckout } from "@/lib/stripe.ts";

export async function POST(req: Request) {
  return withUser(async (user) => {
    const b = await req.json().catch(() => ({}));
    return NextResponse.json({ url: await createCheckout(db(), user, String(b.pack ?? "")) });
  });
}
