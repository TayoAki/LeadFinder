import { NextResponse } from "next/server";
import { db } from "@/lib/db.ts";
import { withUser } from "@/lib/api.ts";
import { listBusinesses, stageCounts, type BusinessQuery } from "@/lib/crm.ts";

export async function GET(req: Request) {
  return withUser(async (user) => {
    const u = new URL(req.url);
    const q: BusinessQuery = {
      q: u.searchParams.get("q") ?? undefined,
      stage: u.searchParams.get("stage") ?? undefined,
      tier: u.searchParams.get("tier") ?? undefined,
      source: u.searchParams.get("source") ?? undefined,
      sort: (u.searchParams.get("sort") as BusinessQuery["sort"]) ?? undefined,
    };
    return NextResponse.json({ businesses: listBusinesses(db(), user.id, q), counts: stageCounts(db(), user.id) });
  });
}
