import { NextResponse } from "next/server";
import { db } from "@/lib/db.ts";
import { withUser } from "@/lib/api.ts";
import { ownsBusiness, setDdItem } from "@/lib/crm.ts";

export async function PUT(req: Request, ctx: { params: Promise<{ id: string }> }) {
  return withUser(async (user) => {
    const id = Number((await ctx.params).id);
    if (!ownsBusiness(db(), user.id, id)) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const b = await req.json();
    setDdItem(db(), id, String(b.key ?? ""), b.done === true, typeof b.note === "string" ? b.note.slice(0, 1000) : undefined);
    return NextResponse.json({ ok: true });
  });
}
