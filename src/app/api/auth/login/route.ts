import { NextResponse } from "next/server";
import { db } from "@/lib/db.ts";
import { AuthError, logIn } from "@/lib/auth.ts";
import { startSession } from "@/lib/session.ts";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  try {
    const user = logIn(db(), String(body.email ?? ""), String(body.password ?? ""));
    await startSession(user.id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: 401 });
    throw e;
  }
}
