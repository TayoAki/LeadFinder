import { NextResponse } from "next/server";
import { db } from "@/lib/db.ts";
import { withUser } from "@/lib/api.ts";
import { saveListings, type MapsRow } from "@/lib/finder.ts";
import { InsufficientCredits } from "@/lib/credits.ts";

export async function POST(req: Request) {
  return withUser(async (user) => {
    const b = await req.json();
    const rows = (Array.isArray(b.rows) ? b.rows : []).slice(0, 50).filter((r: MapsRow) => r && typeof r.name === "string" && typeof r.placeId === "string") as MapsRow[];
    if (!rows.length) throw new Error("Pick at least one business");
    try {
      return NextResponse.json(saveListings(db(), user.id, rows, String(b.query ?? "")));
    } catch (e) {
      if (e instanceof InsufficientCredits) return NextResponse.json({ error: `Saving costs ${e.needed} credits; you have ${e.available}.` }, { status: 402 });
      throw e;
    }
  });
}
