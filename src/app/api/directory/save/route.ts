import { NextResponse } from "next/server";
import { db } from "@/lib/db.ts";
import { withUser } from "@/lib/api.ts";
import { saveFromDirectory } from "@/lib/directory.ts";

// Free: the directory is included; credits apply to contact lookups.
export async function POST(req: Request) {
  return withUser(async (user) => {
    const b = await req.json();
    const ids = (Array.isArray(b.ids) ? b.ids : []).map(Number).filter((n: number) => Number.isInteger(n) && n > 0);
    if (!ids.length) throw new Error("Pick at least one business");
    return NextResponse.json(saveFromDirectory(db(), user.id, ids));
  });
}
