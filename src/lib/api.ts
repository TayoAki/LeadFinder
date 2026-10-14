import { NextResponse } from "next/server";
import { currentUser } from "./session.ts";
import type { User } from "./auth.ts";

export async function withUser(fn: (user: User) => Promise<Response>): Promise<Response> {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  try {
    return await fn(user);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Something went wrong";
    console.error(e);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
