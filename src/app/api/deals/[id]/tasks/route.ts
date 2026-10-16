import { NextResponse } from "next/server";
import { db } from "@/lib/db.ts";
import { withUser } from "@/lib/api.ts";
import { addTask, ownsBusiness } from "@/lib/crm.ts";

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  return withUser(async (user) => {
    const id = Number((await ctx.params).id);
    if (!ownsBusiness(db(), user.id, id)) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const b = await req.json();
    addTask(db(), user.id, id, String(b.title ?? ""), b.dueDate ? String(b.dueDate) : null);
    return NextResponse.json({ ok: true });
  });
}
