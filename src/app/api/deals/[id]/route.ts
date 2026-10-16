import { NextResponse } from "next/server";
import { db } from "@/lib/db.ts";
import { withUser } from "@/lib/api.ts";
import { businessDetail, isStage, ownsBusiness, setStage, updateDeal } from "@/lib/crm.ts";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  return withUser(async (user) => {
    const d = businessDetail(db(), user.id, Number((await ctx.params).id));
    return d ? NextResponse.json(d) : NextResponse.json({ error: "Not found" }, { status: 404 });
  });
}

export async function PATCH(req: Request, ctx: Ctx) {
  return withUser(async (user) => {
    const id = Number((await ctx.params).id);
    if (!ownsBusiness(db(), user.id, id)) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const b = await req.json();
    if (typeof b.stage === "string") {
      if (!isStage(b.stage)) throw new Error("Unknown stage");
      setStage(db(), user.id, id, b.stage);
    }
    updateDeal(db(), user.id, id, {
      assignee: typeof b.assignee === "string" ? b.assignee : undefined,
      nextStep: typeof b.nextStep === "string" ? b.nextStep : undefined,
      dueDate: b.dueDate === undefined ? undefined : b.dueDate ? String(b.dueDate) : null,
    });
    return NextResponse.json({ ok: true });
  });
}
