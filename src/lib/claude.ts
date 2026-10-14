// Minimal Anthropic Messages API client. Server-side only; the key never reaches the browser.
export const ICP_MODEL = process.env.LEADFINDER_ICP_MODEL ?? "claude-opus-5-5";
export const LINE_MODEL = process.env.LEADFINDER_LINE_MODEL ?? "claude-haiku-5-5";

type FetchLike = typeof fetch;

export class ClaudeNotConfigured extends Error {
  constructor() {
    super("ANTHROPIC_API_KEY is not set");
  }
}

export async function claudeText(
  opts: { model: string; system: string; prompt: string; maxTokens?: number },
  fetchImpl: FetchLike = fetch,
): Promise<string> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new ClaudeNotConfigured();
  const base = process.env.LEADFINDER_ANTHROPIC_URL ?? "https://api.anthropic.com";
  let lastError = "";
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetchImpl(`${base}/v1/messages`, {
      method: "POST",
      headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({
        model: opts.model,
        max_tokens: opts.maxTokens ?? 2000,
        system: opts.system,
        messages: [{ role: "user", content: opts.prompt }],
      }),
    });
    if (res.ok) {
      const data = (await res.json()) as { content: { type: string; text?: string }[] };
      return data.content.filter((b) => b.type === "text").map((b) => b.text).join("");
    }
    lastError = `Anthropic HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`;
    if (res.status < 500 && res.status !== 429) break;
    await new Promise((r) => setTimeout(r, 1000 * 2 ** attempt));
  }
  throw new Error(lastError);
}

/** Ask for JSON and parse the first {...} block in the reply. */
export async function claudeJson<T>(opts: { model: string; system: string; prompt: string; maxTokens?: number }, fetchImpl: FetchLike = fetch): Promise<T> {
  const text = await claudeText({ ...opts, system: `${opts.system}\nReply with a single JSON object and nothing else.` }, fetchImpl);
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end < start) throw new Error("Claude did not return JSON");
  return JSON.parse(text.slice(start, end + 1)) as T;
}
