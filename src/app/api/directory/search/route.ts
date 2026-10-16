import { NextResponse } from "next/server";
import { db } from "@/lib/db.ts";
import { withUser } from "@/lib/api.ts";
import { rankedCandidates } from "@/lib/directory.ts";
import { filterFrom } from "../filter.ts";

// Free: the rules filter plus any scores this account already has.
export async function POST(req: Request) {
  return withUser(async (user) => NextResponse.json(rankedCandidates(db(), user.id, filterFrom(await req.json()))));
}
