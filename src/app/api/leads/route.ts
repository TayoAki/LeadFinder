import { NextResponse } from "next/server";
import { db } from "@/lib/db.ts";
import { withUser } from "@/lib/api.ts";
import { deleteLeads, queryLeads } from "@/lib/leads.ts";
import { leadQueryFrom } from "./params.ts";

export async function GET(req: Request) {
  return withUser(async (user) => {
    const rows = queryLeads(db(), user.id, leadQueryFrom(new URL(req.url)));
    // Treg cost is operator-only.
    if (user.role !== "admin") for (const r of rows) r.treg_cost_micro = 0;
    return NextResponse.json(rows);
  });
}

export async function DELETE(req: Request) {
  return withUser(async (user) => {
    const body = await req.json().catch(() => ({}));
    const ids = Array.isArray(body.ids) ? body.ids.map(Number) : [];
    return NextResponse.json({ deleted: deleteLeads(db(), user.id, ids) });
  });
}
