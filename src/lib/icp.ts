import type { DB } from "./db.ts";
import { tregCall } from "./treg.ts";
import { aiJson } from "./claude.ts";
import { countFrom, pickList } from "./normalize.ts";

export interface OnboardingInput {
  website: string;
  sells: string;
  pricePoint: string;
  buyers: string;
  geography: string;
  companySize: string;
}

export interface Icp {
  summary: string;
  industries: string[];
  keywords: string[];
  jobTitles: string[];
  seniority: string[];
  countries: string[]; // full country names, e.g. "United Kingdom"
  employeeMin: number;
  employeeMax: number;
  exclusions: string[];
  openingAngle: string;
}

export interface Counts {
  companies: number | null;
  people: number | null;
  checkedAt: string;
}

export function normalizeWebsite(raw: string): string {
  const s = raw.trim();
  const url = new URL(/^https?:\/\//i.test(s) ? s : `https://${s}`);
  if (!/^https?:$/.test(url.protocol) || !url.hostname.includes(".")) throw new Error("Enter a valid website");
  return `https://${url.hostname}`;
}

/** Step 1 of onboarding: read the site (paid by the operator, free to the customer). */
export async function readSite(db: DB, userId: number, website: string) {
  const [crawl, brand] = await Promise.all([
    tregCall(db, "anyapi.web.crawl", { body: { url: website, limit: 5 }, userId, maxCostUsd: 0.05 }),
    tregCall(db, "treg.companies.enrich", { body: { domain: new URL(website).hostname.replace(/^www\./, "") }, userId, maxCostUsd: 0.02 }),
  ]);
  const pages = pickList(crawl.data)
    .map((p) => String(p.text ?? p.markdown ?? p.content ?? ""))
    .filter(Boolean);
  return {
    siteText: pages.join("\n\n---\n\n").slice(0, 24_000),
    brand: brand.ok ? (brand.data as any)?.output ?? brand.data : null,
  };
}

const ICP_SYSTEM = `You write ideal customer profiles for B2B outbound. Given a seller's website text and answers,
decide exactly who should buy and express it as search filters for a B2B people/company database.
- jobTitles: the 3-8 decision-maker titles that would sign off (owner-operated firms: Owner, Founder, Managing Director, Director).
- industries: plain industry names (e.g. "Construction", "Plumbing", "Accounting").
- keywords: 3-10 short terms describing target companies' work.
- countries: full English country names.
- exclusions: industries/keywords that look similar but are not buyers (e.g. recruitment, wholesale).
- summary: 2-3 sentences, plain English, starting "We sell".
- openingAngle: one line on the pain to lead with.
Fields: summary, industries, keywords, jobTitles, seniority, countries, employeeMin, employeeMax, exclusions, openingAngle.`;

/** Step 2: turn site text + answers into an ICP with Claude. */
export async function writeIcp(input: OnboardingInput, siteText: string, brand: unknown): Promise<Icp> {
  const icp = await aiJson<Icp>({
    role: "icp",
    system: ICP_SYSTEM,
    maxTokens: 1500,
    prompt: [
      `Website: ${input.website}`,
      `What they sell: ${input.sells}`,
      `Price point: ${input.pricePoint}`,
      `Who they think buys: ${input.buyers}`,
      `Where the buyers are: ${input.geography}`,
      `Typical buyer company size: ${input.companySize}`,
      brand ? `Brand record: ${JSON.stringify(brand).slice(0, 2000)}` : "",
      `Website text:\n${siteText || "(could not read the site)"}`,
    ].join("\n"),
  });
  return sanitizeIcp(icp);
}

const strList = (v: unknown, max = 12) =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === "string" && x.trim() !== "").map((x) => x.trim()).slice(0, max) : [];

export function sanitizeIcp(raw: Partial<Icp>): Icp {
  const min = Math.max(1, Math.floor(Number(raw.employeeMin) || 1));
  const max = Math.max(min, Math.floor(Number(raw.employeeMax) || 50));
  return {
    summary: String(raw.summary ?? "").slice(0, 1000),
    industries: strList(raw.industries),
    keywords: strList(raw.keywords),
    jobTitles: strList(raw.jobTitles),
    seniority: strList(raw.seniority, 6),
    countries: strList(raw.countries, 10),
    employeeMin: min,
    employeeMax: max,
    exclusions: strList(raw.exclusions),
    openingAngle: String(raw.openingAngle ?? "").slice(0, 300),
  };
}

// Dropleads' two count endpoints take countries differently (checked in the Treg catalog):
// companies want {include: [...]}, people want a plain list. Either other shape returns 200 and is ignored.
export function companyFilters(icp: Icp) {
  return {
    industries: icp.industries,
    keywords: icp.keywords,
    keywordsExclude: icp.exclusions,
    countries: { include: icp.countries },
    customEmployeeRange: { min: icp.employeeMin, max: icp.employeeMax },
  };
}

export function peopleFilters(icp: Icp) {
  return {
    jobTitles: icp.jobTitles,
    industries: icp.industries,
    keywords: icp.keywords,
    keywordsExclude: icp.exclusions,
    countries: icp.countries,
    customEmployeeRange: { min: icp.employeeMin, max: icp.employeeMax },
  };
}

/** Free counts: how big the market is before anyone spends a credit. */
export async function freeCounts(db: DB, userId: number, icp: Icp): Promise<Counts> {
  const [c, p] = await Promise.all([
    tregCall(db, "dropleads.companies.search.count", { body: { filters: companyFilters(icp) }, userId }),
    tregCall(db, "dropleads.people.search.count", { body: { filters: peopleFilters(icp) }, userId }),
  ]);
  return { companies: c.ok ? countFrom(c.data) : null, people: p.ok ? countFrom(p.data) : null, checkedAt: new Date().toISOString() };
}

export function icpForUser(db: DB, userId: number) {
  const row = db
    .prepare(
      `SELECT i.id, i.status, i.icp_json, i.counts_json, b.website FROM icps i JOIN businesses b ON b.id = i.business_id
       WHERE b.user_id = ? ORDER BY i.id DESC LIMIT 1`,
    )
    .get(userId) as { id: number; status: string; icp_json: string | null; counts_json: string | null; website: string } | undefined;
  if (!row) return null;
  return {
    id: row.id,
    status: row.status,
    website: row.website,
    icp: row.icp_json ? (JSON.parse(row.icp_json) as Icp) : null,
    counts: row.counts_json ? (JSON.parse(row.counts_json) as Counts) : null,
  };
}
