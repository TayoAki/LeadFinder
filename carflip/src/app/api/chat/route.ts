import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { openDb } from "@/lib/db.ts";
import { chatTurn } from "@/lib/chat.ts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "Chat is off: set ANTHROPIC_API_KEY on the server." }, { status: 503 });
  }
  const { history = [], text, context } = await req.json();
  if (!text) return NextResponse.json({ error: "Empty message" }, { status: 400 });
  // What the user is looking at goes with their message, so "this car" resolves.
  const withContext = context ? `${text}\n\n[Context: ${context}]` : text;
  try {
    return NextResponse.json(await chatTurn(openDb(), history, withContext));
  } catch (e) {
    if (e instanceof Anthropic.AuthenticationError) return NextResponse.json({ error: "ANTHROPIC_API_KEY was rejected." }, { status: 502 });
    if (e instanceof Anthropic.RateLimitError) return NextResponse.json({ error: "Rate limited. Try again in a moment." }, { status: 429 });
    if (e instanceof Anthropic.APIError) return NextResponse.json({ error: `Claude API error ${e.status}: ${e.message}` }, { status: 502 });
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
