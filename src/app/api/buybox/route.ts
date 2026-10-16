import { NextResponse } from "next/server";
import { db } from "@/lib/db.ts";
import { withUser } from "@/lib/api.ts";
import { getBuyBox, saveBuyBox } from "@/lib/crm.ts";

export async function GET() {
  return withUser(async (user) => NextResponse.json(getBuyBox(db(), user.id)));
}

export async function PUT(req: Request) {
  return withUser(async (user) => NextResponse.json(saveBuyBox(db(), user.id, await req.json())));
}
