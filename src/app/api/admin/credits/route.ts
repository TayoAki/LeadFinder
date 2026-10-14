import { NextResponse } from "next/server";
import { db } from "@/lib/db.ts";
import { withUser } from "@/lib/api.ts";
import { adminAdjust } from "@/lib/margin.ts";

export async function POST(req: Request) {
  return withUser(async (user) => {
    if (user.role !== "admin") return NextResponse.json({ error: "Admins only" }, { status: 403 });
    const b = await req.json();
    adminAdjust(db(), user.id, Number(b.userId), Number(b.amount), String(b.note ?? ""));
    return NextResponse.json({ ok: true });
  });
}
