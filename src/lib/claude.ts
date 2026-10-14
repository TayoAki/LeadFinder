// AI client for ICP writing and opening lines. Server-side only; keys never reach the browser.
// Uses OpenRouter when OPENROUTER_API_KEY is set, otherwise Anthropic's API with ANTHROPIC_API_KEY.

const useOpenRouter = () => Boolean(process.env.OPENROUTER_API_KEY);

const MODELS = {
  icp: { openrouter: "anthropic/claude-opus-5.5", anthropic: "claude-opus-5-5", env: "LEADFINDER_ICP_MODEL" },
  line: { openrouter: "anthropic/claude-haiku-5.5", anthropic: "claude-haiku-5-5", env: "LEADFINDER_LINE_MODEL" },
} as const;

export type ModelRole = keyof typeof MODELS;

export function modelFor(role: ModelRole): string {
  const m = MODELS[role];
  return process.env[m.env] || (useOpenRouter() ? m.openrouter : m.anthropic);
}

export const aiConfigured = () => Boolean(process.env.OPENROUTER_API_KEY || process.env.ANTHROPIC_API_KEY);

type FetchLike = typeof fetch;

export class AiNotConfigured extends Error {
  constructor() {
    super("No AI key set: add OPENROUTER_API_KEY or ANTHROPIC_API_KEY");
  }
}

interface Req {
  role: ModelRole;
  system: string;
  prompt: string;
  maxTokens?: number;
}

function buildRequest(r: Req): { url: string; init: RequestInit; read: (data: any) => string } {
  const model = modelFor(r.role);
  const maxTokens = r.maxTokens ?? 2000;
  if (useOpenRouter()) {
    return {
      url: `${process.env.LEADFINDER_OPENROUTER_URL ?? "https://openrouter.ai/api/v1"}/chat/completions`,
      init: {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "X-Title": "LeadFinder",
        },
        body: JSON.stringify({
          model,
          max_tokens: maxTokens,
          messages: [
            { role: "system", content: r.system },
            { role: "user", content: r.prompt },
          ],
        }),
      },
      read: (d) => String(d?.choices?.[0]?.message?.content ?? ""),
    };
  }
  if (!process.env.ANTHROPIC_API_KEY) throw new AiNotConfigured();
  return {
    url: `${process.env.LEADFINDER_ANTHROPIC_URL ?? "https://api.anthropic.com"}/v1/messages`,
    init: {
      method: "POST",
      headers: { "x-api-key": process.env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({ model, max_tokens: maxTokens, system: r.system, messages: [{ role: "user", content: r.prompt }] }),
    },
    read: (d) => (d?.content ?? []).filter((b: any) => b.type === "text").map((b: any) => b.text).join(""),
  };
}

export async function aiText(r: Req, fetchImpl: FetchLike = fetch): Promise<string> {
  const { url, init, read } = buildRequest(r);
  let lastError = "";
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetchImpl(url, init);
    if (res.ok) return read(await res.json());
    lastError = `AI HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`;
    if (res.status < 500 && res.status !== 429) break;
    await new Promise((resolve) => setTimeout(resolve, 1000 * 2 ** attempt));
  }
  throw new Error(lastError);
}

/** Ask for JSON and parse the first {...} block in the reply. */
export async function aiJson<T>(r: Req, fetchImpl: FetchLike = fetch): Promise<T> {
  const text = await aiText({ ...r, system: `${r.system}\nReply with a single JSON object and nothing else.` }, fetchImpl);
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end < start) throw new Error("The AI did not return JSON");
  return JSON.parse(text.slice(start, end + 1)) as T;
}
