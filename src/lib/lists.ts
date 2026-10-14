import type { DB } from "./db.ts";
import { tregCall } from "./treg.ts";
import { maxCreditsForList, placeHold } from "./credits.ts";
import { domainFromUrl, type PersonRecord } from "./normalize.ts";
import { enrichLead, finishRun, queueLead, RunError, runWorkersFor, type EngineDeps } from "./engine.ts";
import { icpForUser } from "./icp.ts";

export const MAX_LIST_ROWS = 1000;
export const MAX_LIST_BYTES = 2_000_000;

/** RFC 4180 CSV: quoted fields, "" escapes, commas and newlines inside quotes, CRLF or LF. */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  const src = text.replace(/^﻿/, "");
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (quoted) {
      if (ch === '"' && src[i + 1] === '"') { field += '"'; i++; }
      else if (ch === '"') quoted = false;
      else field += ch;
    } else if (ch === '"' && field === "") quoted = true;
    else if (ch === ",") { row.push(field); field = ""; }
    else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && src[i + 1] === "\n") i++;
      row.push(field); field = "";
      if (row.some((c) => c.trim() !== "")) rows.push(row);
      row = [];
    } else field += ch;
  }
  row.push(field);
  if (row.some((c) => c.trim() !== "")) rows.push(row);
  return rows;
}

// Header names people actually use, matched after lower-casing and stripping punctuation.
const ALIASES: Record<string, string[]> = {
  fullName: ["name", "fullname", "contactname", "person", "contact"],
  firstName: ["firstname", "first", "givenname", "forename"],
  lastName: ["lastname", "last", "surname", "familyname"],
  title: ["title", "jobtitle", "position", "role"],
  company: ["company", "companyname", "organization", "organisation", "account", "accountname", "business"],
  domain: ["domain", "website", "companydomain", "companywebsite", "url", "web", "site"],
  linkedin: ["linkedin", "linkedinurl", "linkedinprofile", "profileurl", "li"],
  email: ["email", "emailaddress", "workemail", "mail"],
};
export type Column = keyof typeof ALIASES;

export function mapColumns(header: string[]): Partial<Record<Column, number>> {
  const out: Partial<Record<Column, number>> = {};
  header.forEach((h, i) => {
    const key = h.toLowerCase().replace(/[^a-z]/g, "");
    for (const [col, names] of Object.entries(ALIASES) as [Column, string[]][]) {
      if (out[col] === undefined && names.includes(key)) out[col] = i;
    }
  });
  return out;
}

export interface ListRow {
  person: PersonRecord;
  email: string | null;
}

export interface ParsedList {
  rows: ListRow[];
  skipped: { line: number; reason: string }[];
  columns: Partial<Record<Column, number>>;
}

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/** Turn an uploaded CSV into rows the waterfall can use. A row needs an email, a LinkedIn URL, or a name plus a company website. */
export function parseList(text: string): ParsedList {
  if (text.length > MAX_LIST_BYTES) throw new RunError("That file is over 2 MB. Split it into smaller lists.");
  const [header, ...body] = parseCsv(text);
  if (!header) throw new RunError("The file is empty");
  const columns = mapColumns(header);
  if (columns.email === undefined && columns.linkedin === undefined && columns.domain === undefined) {
    throw new RunError("Couldn't find an email, LinkedIn or website column. Check the first row has column names.");
  }
  if (body.length > MAX_LIST_ROWS) throw new RunError(`Lists can have up to ${MAX_LIST_ROWS.toLocaleString()} rows; this one has ${body.length.toLocaleString()}.`);

  const rows: ListRow[] = [];
  const skipped: ParsedList["skipped"] = [];
  const seen = new Set<string>();
  body.forEach((cells, i) => {
    const line = i + 2; // 1-based, after the header
    const get = (c: Column) => (columns[c] === undefined ? "" : (cells[columns[c]!] ?? "").trim());
    const first = get("firstName") || null;
    const last = get("lastName") || null;
    const fullName = get("fullName") || [first, last].filter(Boolean).join(" ");
    const rawEmail = get("email").toLowerCase();
    const email = EMAIL_RE.test(rawEmail) ? rawEmail : null;
    const li = get("linkedin");
    const linkedinUrl = /linkedin\.com\//i.test(li) ? (li.startsWith("http") ? li : `https://${li}`) : null;
    const domain = domainFromUrl(get("domain") || null) ?? (email ? email.split("@")[1] : null);

    if (rawEmail && !email) return skipped.push({ line, reason: "email isn't valid" });
    if (!email && !linkedinUrl && !(fullName && domain)) return skipped.push({ line, reason: "needs an email, a LinkedIn URL, or a name and website" });
    const key = email ?? linkedinUrl ?? `${fullName.toLowerCase()}@${domain}`;
    if (seen.has(key)) return skipped.push({ line, reason: "duplicate" });
    seen.add(key);

    rows.push({
      email,
      person: {
        fullName: fullName || email || linkedinUrl!,
        firstName: first,
        lastName: last,
        title: get("title") || null,
        linkedinUrl,
        companyName: get("company") || null,
        companyDomain: domain,
        raw: { line },
      },
    });
  });
  return { rows, skipped, columns };
}

/** Hold credits for the whole list, record it, queue every row and start cleaning in the background. */
export function startCleanRun(db: DB, userId: number, filename: string, list: ParsedList, wantMobile: boolean, deps: EngineDeps = {}) {
  if (!list.rows.length) throw new RunError("No usable rows in this file");
  if (db.prepare("SELECT 1 FROM runs WHERE user_id = ? AND status IN ('held','running')").get(userId)) {
    throw new RunError("A run is already in progress");
  }
  const maxCredits = maxCreditsForList(list.rows.length, wantMobile);
  const { runId, leadIds } = db.transaction(() => {
    const listId = Number(
      db.prepare("INSERT INTO lists (user_id, filename, row_count) VALUES (?, ?, ?)").run(userId, filename.slice(0, 200), list.rows.length).lastInsertRowid,
    );
    const id = Number(
      db.prepare("INSERT INTO runs (user_id, list_id, kind, status, target, want_mobile, max_credits) VALUES (?, ?, 'clean', 'quoted', ?, ?, ?)")
        .run(userId, listId, list.rows.length, wantMobile ? 1 : 0, maxCredits).lastInsertRowid,
    );
    placeHold(db, userId, maxCredits, id); // throws InsufficientCredits → nothing is saved
    db.prepare("UPDATE runs SET status = 'held' WHERE id = ?").run(id);
    return { runId: id, leadIds: list.rows.map((r) => queueLead(db, userId, id, r.person)) };
  })();
  void processCleanRun(db, runId, userId, list.rows, leadIds, wantMobile, deps).catch((e) => console.error(`clean run ${runId} crashed`, e));
  return runId;
}

async function processCleanRun(db: DB, runId: number, userId: number, rows: ListRow[], leadIds: number[], wantMobile: boolean, deps: EngineDeps) {
  const holdId = (db.prepare("SELECT id FROM holds WHERE run_id = ?").get(runId) as { id: number }).id;
  const call = (endpoint: string, opts: Parameters<typeof tregCall>[2]) => tregCall(db, endpoint, { userId, runId, ...opts }, deps.fetchImpl);
  const icp = icpForUser(db, userId)?.icp ?? null; // used for opening lines when the account has one
  db.prepare("UPDATE runs SET status = 'running' WHERE id = ?").run(runId);
  try {
    await runWorkersFor(leadIds.length, (i) =>
      enrichLead(db, runId, holdId, leadIds[i], rows[i].person, icp, wantMobile, call, deps, { source: "list", email: rows[i].email }),
    );
    finishRun(db, runId, holdId, "completed");
  } catch (e) {
    console.error(`clean run ${runId} failed`, e);
    finishRun(db, runId, holdId, "failed");
  }
}
