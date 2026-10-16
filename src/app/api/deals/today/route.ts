import { NextResponse } from "next/server";
import { db } from "@/lib/db.ts";
import { withUser } from "@/lib/api.ts";
import { dueTasks } from "@/lib/crm.ts";

export async function GET() {
  return withUser(async (user) => NextResponse.json(dueTasks(db(), user.id)));
}
