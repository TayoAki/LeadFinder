import { NextResponse } from "next/server";
import { db } from "@/lib/db.ts";
import { withUser } from "@/lib/api.ts";
import { parseList, startCleanRun } from "@/lib/lists.ts";
import { balance, InsufficientCredits, maxCreditsForList } from "@/lib/credits.ts";

// POST {filename, csv, wantMobile, start}. Without start it only previews (free): usable rows, skipped rows, max credits.
export async function POST(req: Request) {
  return withUser(async (user) => {
    const b = await req.json();
    const list = parseList(String(b.csv ?? ""));
    const wantMobile = b.wantMobile === true;
    const maxCredits = maxCreditsForList(list.rows.length, wantMobile);
    if (b.start !== true) {
      return NextResponse.json({
        usable: list.rows.length,
        withEmail: list.rows.filter((r) => r.email).length,
        skipped: list.skipped.slice(0, 50),
        skippedCount: list.skipped.length,
        columns: Object.keys(list.columns),
        maxCredits,
        balance: balance(db(), user.id),
      });
    }
    try {
      const id = startCleanRun(db(), user.id, String(b.filename ?? "list.csv"), list, wantMobile);
      return NextResponse.json({ id });
    } catch (e) {
      if (e instanceof InsufficientCredits) {
        return NextResponse.json({ error: `Cleaning this list can cost up to ${e.needed} credits; you have ${e.available}.` }, { status: 402 });
      }
      throw e;
    }
  });
}
