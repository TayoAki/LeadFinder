import { NextResponse } from "next/server";
import { db } from "@/lib/db.ts";
import { withUser } from "@/lib/api.ts";
import { attemptsFor } from "@/lib/leads.ts";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  return withUser(async (user) => {
    const { id } = await ctx.params;
    const attempts = attemptsFor(db(), user.id, Number(id));
    if (user.role !== "admin") for (const a of attempts) a.cost_micro = 0;
    return NextResponse.json(attempts);
  });
}
