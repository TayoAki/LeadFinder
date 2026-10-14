import { NextResponse } from "next/server";
import { db } from "@/lib/db.ts";
import { AuthError, signUp } from "@/lib/auth.ts";
import { startSession } from "@/lib/session.ts";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  try {
    const user = signUp(db(), {
      name: String(body.name ?? ""),
      email: String(body.email ?? ""),
      password: String(body.password ?? ""),
      acceptedTerms: body.acceptedTerms === true,
    });
    await startSession(user.id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: 400 });
    throw e;
  }
}
