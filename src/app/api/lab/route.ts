import { NextResponse } from "next/server";
import { db } from "@/lib/db.ts";
import { withUser } from "@/lib/api.ts";
import { labSummaries, startLabTest } from "@/lib/lab.ts";

export async function POST(req: Request) {
  return withUser(async (user) => {
    if (user.role !== "admin") return NextResponse.json({ error: "Admins only" }, { status: 403 });
    const b = await req.json();
    return NextResponse.json({ id: startLabTest(db(), user.id, String(b.provider ?? ""), Number(b.sample)) });
  });
}

export async function GET() {
  return withUser(async (user) => {
    if (user.role !== "admin") return NextResponse.json({ error: "Admins only" }, { status: 403 });
    return NextResponse.json(labSummaries(db()));
  });
}
