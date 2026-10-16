import { NextResponse } from "next/server";
import { db } from "@/lib/db.ts";
import { withUser } from "@/lib/api.ts";
import { aiConfigured } from "@/lib/claude.ts";
import { getBuyBox } from "@/lib/crm.ts";
import { candidates, filterFromBuyBox, rankedCandidates, scoreRows } from "@/lib/directory.ts";
import { filterFrom } from "../filter.ts";

export const maxDuration = 300;

// Free. Scores not-yet-scored candidates against the account's buy box, `step` at a time (default 100),
// so the Matches page can show progress. With {fromBuyBox: true} the filter comes from the buy box.
export async function POST(req: Request) {
  return withUser(async (user) => {
    if (!aiConfigured()) throw new Error("AI scoring isn't set up on this server");
    const b = await req.json().catch(() => ({}));
    const f = b.fromBuyBox ? filterFromBuyBox(getBuyBox(db(), user.id)) : filterFrom(b);
    const step = Math.min(100, Math.max(1, Number(b.step) || 100));
    const result = await scoreRows(db(), user.id, candidates(db(), f, 100).rows, undefined, step);
    return NextResponse.json({ ...rankedCandidates(db(), user.id, f, 100), ...result });
  });
}
