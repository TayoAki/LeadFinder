import { NextResponse } from "next/server";
import { db } from "@/lib/db.ts";
import { withUser } from "@/lib/api.ts";
import { ownsBusiness, startCadence } from "@/lib/crm.ts";

export async function POST(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  return withUser(async (user) => {
    const id = Number((await ctx.params).id);
    if (!ownsBusiness(db(), user.id, id)) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ started: startCadence(db(), user.id, id) });
  });
}
