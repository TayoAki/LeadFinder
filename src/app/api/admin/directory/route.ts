import { NextResponse } from "next/server";
import { db } from "@/lib/db.ts";
import { withUser } from "@/lib/api.ts";
import { directoryStats, loadDirectoryCsv } from "@/lib/directory.ts";

export const maxDuration = 300;

export async function GET() {
  return withUser(async (user) => {
    if (user.role !== "admin") return NextResponse.json({ error: "Admins only" }, { status: 403 });
    return NextResponse.json(directoryStats(db()));
  });
}

export async function POST(req: Request) {
  return withUser(async (user) => {
    if (user.role !== "admin") return NextResponse.json({ error: "Admins only" }, { status: 403 });
    const b = await req.json();
    return NextResponse.json(loadDirectoryCsv(db(), user.id, String(b.filename ?? "upload.csv"), String(b.text ?? "")));
  });
}
