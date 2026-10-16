import { NextResponse } from "next/server";
import { db } from "@/lib/db.ts";
import { withUser } from "@/lib/api.ts";
import { importSbaFile } from "@/lib/crm.ts";

// Free: importing your own SBA Search output costs no credits.
export async function POST(req: Request) {
  return withUser(async (user) => {
    const b = await req.json();
    return NextResponse.json(importSbaFile(db(), user.id, String(b.filename ?? "upload"), String(b.text ?? "")));
  });
}
