export type Fetch = typeof fetch;

export class ApifyError extends Error {}

/** Run an Apify actor synchronously and return its dataset items. */
export async function runActor<T = Record<string, unknown>>(
  actor: string,
  input: unknown,
  opts: { token?: string; timeoutSec?: number; fetchImpl?: Fetch } = {},
): Promise<T[]> {
  const token = opts.token ?? process.env.APIFY_TOKEN;
  if (!token) throw new ApifyError("APIFY_TOKEN is not set");
  const timeout = opts.timeoutSec ?? 280;
  const url = `https://api.apify.com/v2/acts/${actor.replace("/", "~")}/run-sync-get-dataset-items?timeout=${timeout}`;
  const res = await (opts.fetchImpl ?? fetch)(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(input),
    signal: AbortSignal.timeout((timeout + 20) * 1000),
  });
  const body = await res.json().catch(() => null);
  if (!res.ok || !Array.isArray(body)) {
    const msg = (body as { error?: { message?: string } } | null)?.error?.message ?? `HTTP ${res.status}`;
    throw new ApifyError(`${actor}: ${msg}`);
  }
  return body as T[];
}
