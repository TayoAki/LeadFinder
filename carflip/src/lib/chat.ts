import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import type { DB } from "./db.ts";
import { callTool, tools } from "./tools.ts";

export const CHAT_MODEL = "claude-opus-5-5";

// Whole-database replacement stays out of the chat.
const HIDDEN = new Set(["import_snapshot", "export_snapshot"]);

const SYSTEM = `You are the assistant inside CarFlip, a tool for flipping private-seller cars in five steps: Find, Value, Inspect, Buy, Sell.
You have the same tools as the app. Use them to answer from the data, not from memory.
Evidence rules: cite where each fact came from (listing, photo number, KBB with capture time); never invent values; say what is unknown.
Method: rank by dollar gap (KBB value minus asking); tax is 6.25% of purchase price; unprovided costs are listed, not treated as zero.
Repair figures are estimates, not quotes; say so.
Spending: find_cars and value_cars cost Apify credit, estimate_repairs costs API credit. Before calling them, say what it will do and ask, unless the user already asked for exactly that.
Offers are drafts. Never claim a message was sent or a car was bought or sold.
Keep replies short. Use car titles, not ids, when talking to the user.`;

export function chatTools(): Anthropic.Tool[] {
  return Object.entries(tools).filter(([name]) => !HIDDEN.has(name)).map(([name, t]) => ({
    name,
    description: t.description,
    input_schema: zodToJsonSchema(z.object(t.input)) as Anthropic.Tool.InputSchema,
  }));
}

/**
 * One user turn: run the tool loop until Claude answers. The client keeps the full message history
 * (thinking and tool blocks included) and sends it back each turn, so the history stays append-only.
 */
export async function chatTurn(db: DB, history: Anthropic.Beta.BetaMessageParam[], userText: string,
  o: { client?: Pick<Anthropic, "beta">; maxSteps?: number } = {}) {
  const client = o.client ?? new Anthropic();
  const messages: Anthropic.Beta.BetaMessageParam[] = [...history, { role: "user", content: userText }];
  const used: Array<{ name: string; ok: boolean }> = [];
  const toolDefs = chatTools();
  for (let step = 0; step < (o.maxSteps ?? 12); step++) {
    const res = await client.beta.messages.create({
      model: CHAT_MODEL,
      max_tokens: 16000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: "medium" },
      system: SYSTEM,
      tools: toolDefs,
      messages,
    });
    messages.push({ role: "assistant", content: res.content });
    if (res.stop_reason === "refusal") return { messages, reply: "I can't help with that one.", used };
    if (res.stop_reason === "pause_turn") continue;
    const calls = res.content.filter((b): b is Anthropic.Beta.BetaToolUseBlock => b.type === "tool_use");
    if (res.stop_reason !== "tool_use" || !calls.length) {
      const reply = res.content.filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === "text").map((b) => b.text).join("\n");
      return { messages, reply: reply || (res.stop_reason === "max_tokens" ? "(Reply cut off. Ask me to continue.)" : ""), used };
    }
    const results: Anthropic.Beta.BetaToolResultBlockParam[] = [];
    for (const c of calls) {
      try {
        const out = await callTool(db, c.name, c.input);
        results.push({ type: "tool_result", tool_use_id: c.id, content: JSON.stringify(out ?? null).slice(0, 60000) });
        used.push({ name: c.name, ok: true });
      } catch (e) {
        results.push({ type: "tool_result", tool_use_id: c.id, content: (e as Error).message, is_error: true });
        used.push({ name: c.name, ok: false });
      }
    }
    messages.push({ role: "user", content: results });
  }
  return { messages, reply: "(Stopped after too many tool steps. Ask me to continue.)", used };
}
