import { NextResponse } from "next/server";
import { db } from "@/lib/db.ts";
import { withUser } from "@/lib/api.ts";
import { ownsBusiness } from "@/lib/crm.ts";
import { enrichShortlisted, MAX_SHORTLIST_ENRICH_CREDITS } from "@/lib/finder.ts";
import { InsufficientCredits } from "@/lib/credits.ts";

export const maxDuration = 120;

export async function POST(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  return withUser(async (user) => {
    const id = Number((await ctx.params).id);
    if (!ownsBusiness(db(), user.id, id)) return NextResponse.json({ error: "Not found" }, { status: 404 });
    try {
      return NextResponse.json(await enrichShortlisted(db(), user.id, id));
    } catch (e) {
      if (e instanceof InsufficientCredits) {
        return NextResponse.json({ error: `Enriching can cost up to ${MAX_SHORTLIST_ENRICH_CREDITS} credits; you have ${e.available}.` }, { status: 402 });
      }
      throw e;
    }
  });
}
