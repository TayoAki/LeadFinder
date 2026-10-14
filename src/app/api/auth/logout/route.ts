import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db.ts";
import { SESSION_COOKIE, destroySession } from "@/lib/auth.ts";

export async function POST(req: Request) {
  const jar = await cookies();
  destroySession(db(), jar.get(SESSION_COOKIE)?.value);
  jar.delete(SESSION_COOKIE);
  return NextResponse.redirect(new URL("/", req.url), 303);
}
