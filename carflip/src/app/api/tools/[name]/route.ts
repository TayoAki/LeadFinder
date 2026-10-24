import { NextResponse } from "next/server";
import { openDb } from "@/lib/db.ts";
import { callTool, tools } from "@/lib/tools.ts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

// Same tools as the MCP server, over HTTP for the UI.
export async function POST(req: Request, ctx: { params: Promise<{ name: string }> }) {
  const { name } = await ctx.params;
  if (!(name in tools)) return NextResponse.json({ error: `Unknown tool ${name}` }, { status: 404 });
  try {
    return NextResponse.json(await callTool(openDb(), name, await req.json().catch(() => ({}))));
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
