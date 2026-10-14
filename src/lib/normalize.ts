// Treg's routed endpoints answer {output, raw, _treg}, but `output` differs by the provider that served.
// These helpers pull the fields we need out of whichever shape came back, and return null when absent.
// Shapes seen in the catalog docs are listed first; the rest are defensive fallbacks.

type Obj = Record<string, any>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);

export function firstString(o: unknown, ...keys: string[]): string | null {
  if (!isObj(o)) return null;
  for (const k of keys) {
    const v = o[k];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return null;
}

/** Find the first array of records in a response (data.leads, output.results, items, …). */
export function pickList(body: unknown): Obj[] {
  const queue: unknown[] = [body];
  for (let depth = 0; depth < 4 && queue.length; depth++) {
    const next: unknown[] = [];
    for (const node of queue) {
      if (Array.isArray(node) && node.some(isObj)) return node.filter(isObj);
      if (isObj(node)) {
        for (const k of ["leads", "results", "people", "companies", "items", "data", "output", "records"]) {
          if (k in node) next.push(node[k]);
        }
      }
    }
    queue.splice(0, queue.length, ...next);
  }
  return [];
}

/** The routed `output` object, or the body itself. */
export const outputOf = (body: unknown): Obj => (isObj(body) && isObj(body.output) ? body.output : isObj(body) ? body : {});

export function domainFromUrl(url: string | null): string | null {
  if (!url) return null;
  try {
    return new URL(url.includes("://") ? url : `https://${url}`).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return null;
  }
}

export interface PersonRecord {
  fullName: string;
  firstName: string | null;
  lastName: string | null;
  title: string | null;
  linkedinUrl: string | null;
  companyName: string | null;
  companyDomain: string | null;
  raw: Obj;
}

export function personFrom(r: Obj): PersonRecord | null {
  const first = firstString(r, "first_name", "firstName");
  const last = firstString(r, "last_name", "lastName");
  const full = firstString(r, "full_name", "fullName", "name") ?? ([first, last].filter(Boolean).join(" ") || null);
  if (!full) return null;
  const org = isObj(r.organization) ? r.organization : isObj(r.company) ? r.company : {};
  const domain =
    domainFromUrl(firstString(r, "organization_domain", "company_domain", "domain", "organization_website", "company_website")) ??
    domainFromUrl(firstString(org, "domain", "website", "primary_domain", "website_url"));
  return {
    fullName: full,
    firstName: first,
    lastName: last,
    title: firstString(r, "title", "job_title", "jobTitle", "headline"),
    linkedinUrl: firstString(r, "linkedin_url", "linkedinUrl", "linkedin"),
    companyName: firstString(r, "organization_name", "company_name", "companyName") ?? firstString(org, "name"),
    companyDomain: domain,
    raw: r,
  };
}

/** A found email from treg.people.email.find; masked teaser emails (j***@x.com) don't count. */
export function emailFrom(body: unknown): string | null {
  const o = outputOf(body);
  const e = firstString(o, "email", "work_email", "address") ?? firstString(isObj(o.data) ? o.data : {}, "email");
  return e && /^[^@\s*]+@[^@\s]+\.[^@\s]+$/.test(e) ? e.toLowerCase() : null;
}

export type EmailStatus = "verified" | "catch_all" | "risky" | "invalid" | "not_found";

export function verifyStatusFrom(body: unknown): EmailStatus {
  const o = outputOf(body);
  const raw = (firstString(o, "status", "result", "verdict", "state") ?? "").toLowerCase().replace(/[\s-]/g, "_");
  if (o.catch_all === true || o.accept_all === true || /catch_?all|accept_?all/.test(raw)) return "catch_all";
  if (/^(valid|verified|deliverable|ok|safe)$/.test(raw) || o.valid === true || o.deliverable === true) return "verified";
  if (/invalid|undeliverable|bounce|disposable|not_?valid/.test(raw) || o.valid === false) return "invalid";
  return "risky";
}

export function phoneFrom(body: unknown): string | null {
  const o = outputOf(body);
  const p = firstString(o, "mobile", "mobile_phone", "phone", "phone_number", "number");
  if (p) return p;
  const list = Array.isArray(o.phones) ? o.phones : Array.isArray(o.phone_numbers) ? o.phone_numbers : [];
  for (const x of list) {
    if (typeof x === "string" && x.trim()) return x.trim();
    const n = firstString(x, "number", "phone", "value");
    if (n) return n;
  }
  return null;
}

export function countFrom(body: unknown): number | null {
  if (!isObj(body)) return null;
  for (const v of [body.count, body.total, body.data?.total, body.data?.count, body.output?.count, body.pagination?.total]) {
    if (typeof v === "number") return v;
  }
  return null;
}
