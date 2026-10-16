import { STAGES } from "@/lib/crm.ts";

export { STAGES };
export const stageLabel = (s: string) => STAGES.find((x) => x.id === s)?.label ?? s;

export const money = (n: number | null | undefined) => {
  if (n === null || n === undefined) return "—";
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}k`;
  return `$${n}`;
};
export const range = (lo: number | null, hi: number | null) => (lo === null && hi === null ? "—" : `${money(lo)}–${money(hi)}`);

export async function api<T = unknown>(url: string, init?: RequestInit & { json?: unknown }): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: init?.json !== undefined ? { "Content-Type": "application/json", ...init?.headers } : init?.headers,
    body: init?.json !== undefined ? JSON.stringify(init.json) : init?.body,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error ?? `Request failed (${res.status})`);
  return data as T;
}

export type BusinessRow = {
  id: number; source: string; name: string; industry: string | null; city: string | null; state: string | null; metro: string | null;
  owner_name: string | null; owner_email: string | null; email_status: string | null; phone: string | null; website: string | null;
  tier: string | null; score: number | null; age_years: number | null; ebitda_lo: number | null; ebitda_hi: number | null;
  rating: number | null; reviews: number | null; stage: string; assignee: string | null; next_step: string | null; due_date: string | null;
  open_tasks: number; next_task_due: string | null;
};
