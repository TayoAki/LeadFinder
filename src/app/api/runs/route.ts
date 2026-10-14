import { NextResponse } from "next/server";
import { db } from "@/lib/db.ts";
import { withUser } from "@/lib/api.ts";
import { startRun } from "@/lib/engine.ts";
import { InsufficientCredits } from "@/lib/credits.ts";

export async function POST(req: Request) {
  return withUser(async (user) => {
    const b = await req.json();
    try {
      const id = startRun(db(), user.id, Number(b.icpId), Number(b.target), b.wantMobile === true);
      return NextResponse.json({ id });
    } catch (e) {
      if (e instanceof InsufficientCredits) {
        return NextResponse.json({ error: `This run can cost up to ${e.needed} credits; you have ${e.available}.` }, { status: 402 });
      }
      throw e;
    }
  });
}

export async function GET() {
  return withUser(async (user) =>
    NextResponse.json(
      db().prepare("SELECT id, status, target, want_mobile, max_credits, charged, created_at, finished_at FROM runs WHERE user_id = ? ORDER BY id DESC LIMIT 50").all(user.id),
    ),
  );
}
