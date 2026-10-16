import type { DirectoryFilter } from "@/lib/directory.ts";

const nums = (v: unknown) => (Number.isFinite(Number(v)) && Number(v) > 0 ? Number(v) : undefined);
const strs = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string" && /^[\w-]{1,12}$/.test(x)).slice(0, 20) : undefined);

export function filterFrom(b: Record<string, unknown>): DirectoryFilter {
  return {
    industries: strs(b.industries),
    states: strs(b.states),
    metro: typeof b.metro === "string" ? b.metro.slice(0, 80) : undefined,
    minAge: nums(b.minAge),
    ebitdaMin: nums(b.ebitdaMin),
    ebitdaMax: nums(b.ebitdaMax),
    familyOnly: b.familyOnly === true,
    q: typeof b.q === "string" ? b.q.slice(0, 80) : undefined,
  };
}
