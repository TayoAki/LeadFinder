import { NextResponse } from "next/server";
import { db } from "@/lib/db.ts";
import { withUser } from "@/lib/api.ts";
import { getBuyBox } from "@/lib/crm.ts";
import { filterFromBuyBox, rankedCandidates } from "@/lib/directory.ts";

// The Matches page: the top 100 directory businesses for this account's buy box, with scores so far.
export async function GET() {
  return withUser(async (user) => NextResponse.json(rankedCandidates(db(), user.id, filterFromBuyBox(getBuyBox(db(), user.id)), 100)));
}
