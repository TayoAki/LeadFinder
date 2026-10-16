import { NextResponse } from "next/server";
import { db } from "@/lib/db.ts";
import { withUser } from "@/lib/api.ts";
import { completeTask } from "@/lib/crm.ts";

export async function PATCH(req: Request, ctx: { params: Promise<{ taskId: string }> }) {
  return withUser(async (user) => {
    const b = await req.json();
    completeTask(db(), user.id, Number((await ctx.params).taskId), b.done === true);
    return NextResponse.json({ ok: true });
  });
}
