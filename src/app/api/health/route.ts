import { NextResponse } from "next/server";
import { db } from "@/lib/db.ts";

// Railway's health check: the server is up and the database file opens.
export async function GET() {
  db().prepare("SELECT 1").get();
  return NextResponse.json({ ok: true });
}
