import { NextResponse } from "next/server";
import { db } from "@/lib/db.ts";
import { withUser } from "@/lib/api.ts";
import { runSummary } from "@/lib/engine.ts";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  return withUser(async (user) => {
    const { id } = await ctx.params;
    const s = runSummary(db(), Number(id), user.id);
    if (!s) return NextResponse.json({ error: "Not found" }, { status: 404 });
    // Treg cost is operator-only.
    if (user.role !== "admin") {
      s.tregCostMicro = 0;
      for (const l of s.leads) delete l.treg_cost_micro;
      for (const a of s.attempts) delete a.cost_micro;
    }
    return NextResponse.json(s);
  });
}
