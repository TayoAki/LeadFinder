import { NextResponse } from "next/server";
import { db } from "@/lib/db.ts";
import { withUser } from "@/lib/api.ts";
import { searchBusinesses } from "@/lib/finder.ts";

// Searching is free to the customer; saving results costs credits.
export async function POST(req: Request) {
  return withUser(async (user) => {
    const b = await req.json();
    const r = await searchBusinesses(db(), user.id, { query: String(b.query ?? ""), location: String(b.location ?? ""), limit: Number(b.limit) || 20 });
    return NextResponse.json({ rows: r.rows });
  });
}
