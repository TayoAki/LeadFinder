import { NextResponse } from "next/server";
import { db } from "@/lib/db.ts";
import { withUser } from "@/lib/api.ts";
import { aiConfigured } from "@/lib/claude.ts";
import { candidates, rankedCandidates, scoreRows } from "@/lib/directory.ts";
import { filterFrom } from "../filter.ts";

export const maxDuration = 300;

// Scores up to 100 not-yet-scored candidates against the account's buy box, then returns the ranked list.
export async function POST(req: Request) {
  return withUser(async (user) => {
    if (!aiConfigured()) throw new Error("AI scoring isn't set up on this server");
    const f = filterFrom(await req.json());
    const result = await scoreRows(db(), user.id, candidates(db(), f).rows);
    return NextResponse.json({ ...rankedCandidates(db(), user.id, f), ...result });
  });
}
