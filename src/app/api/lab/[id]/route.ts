import { NextResponse } from "next/server";
import { db } from "@/lib/db.ts";
import { withUser } from "@/lib/api.ts";
import { labResults } from "@/lib/lab.ts";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  return withUser(async (user) => {
    if (user.role !== "admin") return NextResponse.json({ error: "Admins only" }, { status: 403 });
    const { id } = await ctx.params;
    return NextResponse.json(labResults(db(), Number(id)));
  });
}
