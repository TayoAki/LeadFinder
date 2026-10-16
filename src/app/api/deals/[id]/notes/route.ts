import { NextResponse } from "next/server";
import { db } from "@/lib/db.ts";
import { withUser } from "@/lib/api.ts";
import { logActivity, ownsBusiness } from "@/lib/crm.ts";

const KINDS = new Set(["note", "call", "email", "letter", "meeting"]);

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  return withUser(async (user) => {
    const id = Number((await ctx.params).id);
    if (!ownsBusiness(db(), user.id, id)) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const b = await req.json();
    const body = String(b.body ?? "").trim();
    if (!body) throw new Error("Write something first");
    logActivity(db(), id, user.id, KINDS.has(b.kind) ? b.kind : "note", body);
    return NextResponse.json({ ok: true });
  });
}
