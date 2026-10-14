import type { DB } from "./db.ts";

// The one pipe all outside data flows through. Every call:
//  - carries an Idempotency-Key, so a retry is never paid twice
//  - can carry a spend ceiling (X-Treg-Route-Max-Cost) — Treg refuses with 402, unbilled, above it
//  - writes one treg_calls row with the real cost from X-Treg-Cost-Micro (the operator's receipt)

export interface TregCallOptions {
  method?: "GET" | "POST";
  body?: unknown;
  query?: Record<string, string>;
  idempotencyKey?: string;
  maxCostUsd?: number;
  headers?: Record<string, string>;
  userId?: number | null;
  runId?: number | null;
}

export interface TregResult<T = unknown> {
  ok: boolean;
  status: number;
  data: T | null;
  costMicro: number;
  servedBy: string | null;
  tried: unknown[];
  replay: boolean;
  error: string | null;
}

export class TregNotConfigured extends Error {
  constructor() {
    super("TREG_TOKEN is not set — add it to the environment to call Treg");
  }
}

type FetchLike = typeof fetch;

export async function tregCall<T = unknown>(
  db: DB,
  endpoint: string,
  opts: TregCallOptions = {},
  fetchImpl: FetchLike = fetch,
): Promise<TregResult<T>> {
  const token = process.env.TREG_TOKEN;
  if (!token) throw new TregNotConfigured();
  const base = process.env.TREG_BASE_URL ?? "https://treg.to";
  const method = opts.method ?? (opts.body === undefined ? "GET" : "POST");
  const url = new URL(`${base}/call/${endpoint}`);
  for (const [k, v] of Object.entries(opts.query ?? {})) url.searchParams.set(k, v);

  const headers: Record<string, string> = { "X-Treg-Token": token, ...opts.headers };
  if (opts.body !== undefined) headers["Content-Type"] = "application/json";
  if (opts.idempotencyKey) headers["Idempotency-Key"] = opts.idempotencyKey;
  if (opts.maxCostUsd !== undefined) headers["X-Treg-Route-Max-Cost"] = String(opts.maxCostUsd);

  const started = Date.now();
  let status = 0;
  let json: any = null;
  let error: string | null = null;
  let costMicro = 0;
  let servedBy: string | null = null;
  let replay = false;
  try {
    const res = await fetchImpl(url, {
      method,
      headers,
      body: opts.body === undefined ? undefined : JSON.stringify(opts.body),
    });
    status = res.status;
    costMicro = Number(res.headers.get("x-treg-cost-micro") ?? 0) || 0;
    servedBy = res.headers.get("x-treg-served-by");
    replay = res.headers.get("x-treg-idempotent-replay") === "true";
    const text = await res.text();
    try {
      json = text ? JSON.parse(text) : null;
    } catch {
      json = text;
    }
    if (!res.ok) error = typeof json === "object" && json?.error ? String(json.error) : `HTTP ${status}`;
  } catch (e) {
    error = e instanceof Error ? e.message : String(e);
  }

  const meta = json && typeof json === "object" ? json._treg : undefined;
  servedBy ??= meta?.served_by ?? null;
  const tried: unknown[] = Array.isArray(meta?.tried) ? meta.tried : [];

  db.prepare(
    `INSERT INTO treg_calls (user_id, run_id, endpoint, served_by, idempotency_key, http_status, cost_micro, replay, latency_ms, error)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    opts.userId ?? null, opts.runId ?? null, endpoint, servedBy, opts.idempotencyKey ?? null,
    status, costMicro, replay ? 1 : 0, Date.now() - started, error,
  );

  return { ok: error === null, status, data: error === null ? (json as T) : null, costMicro, servedBy, tried, replay, error };
}

export function tregCostTotals(db: DB, runId?: number) {
  const where = runId === undefined ? "" : "WHERE run_id = ?";
  const args = runId === undefined ? [] : [runId];
  return db.prepare(`SELECT COUNT(*) AS calls, COALESCE(SUM(cost_micro), 0) AS cost_micro FROM treg_calls ${where}`).get(...args) as {
    calls: number;
    cost_micro: number;
  };
}

export const microToUsd = (micro: number) => micro / 1_000_000;
