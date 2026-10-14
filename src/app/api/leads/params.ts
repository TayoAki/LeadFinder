import { SORT_KEYS, STATUS_FILTERS, type LeadQuery, type Sort, type StatusFilter } from "@/lib/leads.ts";

export function leadQueryFrom(url: URL): LeadQuery {
  const status = url.searchParams.get("status") as StatusFilter | null;
  const sort = url.searchParams.get("sort") as Sort | null;
  return {
    status: status && STATUS_FILTERS.includes(status) ? status : "all",
    sort: sort && SORT_KEYS.includes(sort) ? sort : "newest",
    q: url.searchParams.get("q")?.slice(0, 200) ?? undefined,
    runId: Number(url.searchParams.get("run")) || undefined,
  };
}
