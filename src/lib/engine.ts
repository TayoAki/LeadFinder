import type { DB } from "./db.ts";
import { tregCall } from "./treg.ts";
import { CREDIT_PRICES, chargeFromHold, maxCreditsFor, placeHold, settleHold } from "./credits.ts";
import { peopleFilters, type Icp } from "./icp.ts";
import { emailFrom, personFrom, phoneFrom, pickList, verifyStatusFrom, type PersonRecord } from "./normalize.ts";
import { claudeText, LINE_MODEL } from "./claude.ts";

export const CONCURRENCY = 5;
export const EMAIL_MAX_COST_USD = 0.05; // per lead: stops one lead climbing the whole 23-provider ladder
export const PHONE_MAX_COST_USD = 0.05;
const PEOPLE_PAGE = 50;
const MAX_PAGES = 20;

export class RunError extends Error {}

/** Quote, hold credits, create the run and start it in the background. Returns the run id. */
export function startRun(db: DB, userId: number, icpId: number, target: number, wantMobile: boolean, deps: EngineDeps = {}) {
  if (!Number.isInteger(target) || target < 1 || target > 1000) throw new RunError("Choose between 1 and 1,000 leads");
  const icpRow = db
    .prepare("SELECT i.icp_json FROM icps i JOIN businesses b ON b.id = i.business_id WHERE i.id = ? AND b.user_id = ? AND i.status = 'ready'")
    .get(icpId, userId) as { icp_json: string } | undefined;
  if (!icpRow) throw new RunError("ICP not found or not ready");
  if (db.prepare("SELECT 1 FROM runs WHERE user_id = ? AND status IN ('held','running')").get(userId)) {
    throw new RunError("A run is already in progress");
  }
  const maxCredits = maxCreditsFor(target, wantMobile);
  const runId = db.transaction(() => {
    const { lastInsertRowid } = db
      .prepare("INSERT INTO runs (user_id, icp_id, kind, status, target, want_mobile, max_credits) VALUES (?, ?, 'find', 'quoted', ?, ?, ?)")
      .run(userId, icpId, target, wantMobile ? 1 : 0, maxCredits);
    const id = Number(lastInsertRowid);
    placeHold(db, userId, maxCredits, id); // throws InsufficientCredits → whole transaction rolls back
    db.prepare("UPDATE runs SET status = 'held' WHERE id = ?").run(id);
    return id;
  })();
  void processRun(db, runId, JSON.parse(icpRow.icp_json) as Icp, deps).catch((e) => console.error(`run ${runId} crashed`, e));
  return runId;
}

export interface EngineDeps {
  fetchImpl?: typeof fetch;
  openingLine?: (icp: Icp, p: PersonRecord) => Promise<string | null>;
}

const holdFor = (db: DB, runId: number) => (db.prepare("SELECT id FROM holds WHERE run_id = ?").get(runId) as { id: number }).id;

function attempt(db: DB, leadId: number, step: string, provider: string | null, outcome: string, costMicro: number) {
  db.prepare("INSERT INTO lead_attempts (lead_id, step, provider, outcome, cost_micro) VALUES (?, ?, ?, ?, ?)").run(
    leadId, step, provider, outcome, costMicro,
  );
  if (costMicro) db.prepare("UPDATE leads SET treg_cost_micro = treg_cost_micro + ? WHERE id = ?").run(costMicro, leadId);
}

function charge(db: DB, runId: number, holdId: number, leadId: number, credits: number): boolean {
  if (!chargeFromHold(db, holdId, credits)) return false;
  db.prepare("UPDATE leads SET credits = credits + ? WHERE id = ?").run(credits, leadId);
  db.prepare("UPDATE runs SET charged = charged + ? WHERE id = ?").run(credits, runId);
  return true;
}

const setState = (db: DB, leadId: number, state: string) => db.prepare("UPDATE leads SET state = ? WHERE id = ?").run(state, leadId);

export async function processRun(db: DB, runId: number, icp: Icp, deps: EngineDeps = {}) {
  const run = db.prepare("SELECT * FROM runs WHERE id = ?").get(runId) as { user_id: number; target: number; want_mobile: number };
  const holdId = holdFor(db, runId);
  const call = (endpoint: string, opts: Parameters<typeof tregCall>[2]) =>
    tregCall(db, endpoint, { userId: run.user_id, runId, ...opts }, deps.fetchImpl);
  db.prepare("UPDATE runs SET status = 'running' WHERE id = ?").run(runId);
  try {
    // 1. People at matching companies, one decision maker per company, skipping companies this account already has.
    const people = await findPeople(db, run.user_id, runId, icp, run.target, call);
    const leadIds = people.map((p) => queueLead(db, run.user_id, runId, p));

    // 2. Five rows at a time through the email waterfall → verify → optional mobile.
    let next = 0;
    const worker = async () => {
      while (next < leadIds.length) {
        const i = next++;
        await enrichLead(db, runId, holdId, leadIds[i], people[i], icp, run.want_mobile === 1, call, deps);
      }
    };
    await Promise.all(Array.from({ length: CONCURRENCY }, worker));
    finish(db, runId, holdId, "completed");
  } catch (e) {
    console.error(`run ${runId} failed`, e);
    finish(db, runId, holdId, "failed");
  }
}

function finish(db: DB, runId: number, holdId: number, status: "completed" | "failed" | "cancelled") {
  settleHold(db, holdId);
  db.prepare("UPDATE runs SET status = ?, finished_at = datetime('now') WHERE id = ?").run(status, runId);
}

async function findPeople(
  db: DB, userId: number, runId: number, icp: Icp, target: number,
  call: (e: string, o: Parameters<typeof tregCall>[2]) => ReturnType<typeof tregCall>,
): Promise<PersonRecord[]> {
  const seen = new Set(
    (db.prepare("SELECT domain FROM companies WHERE user_id = ?").all(userId) as { domain: string }[]).map((r) => r.domain),
  );
  const out: PersonRecord[] = [];
  for (let page = 1; page <= MAX_PAGES && out.length < target; page++) {
    const res = await call("dropleads.people.search", {
      body: { filters: peopleFilters(icp), pagination: { page, limit: PEOPLE_PAGE } },
      idempotencyKey: `run:${runId}:people:${page}`,
    });
    if (!res.ok) {
      if (page === 1) throw new Error(`people search failed: ${res.error}`);
      break;
    }
    const rows = pickList(res.data);
    if (!rows.length) break;
    for (const r of rows) {
      const p = personFrom(r);
      if (!p || !(p.linkedinUrl || p.companyDomain)) continue; // the email waterfall needs one of these
      const key = companyKey(p);
      if (!key || seen.has(key)) continue;
      seen.add(key);
      out.push(p);
      if (out.length >= target) break;
    }
  }
  return out;
}

const companyKey = (p: PersonRecord) =>
  p.companyDomain ?? (p.companyName ? `name:${p.companyName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}` : null);

function queueLead(db: DB, userId: number, runId: number, p: PersonRecord): number {
  return db.transaction(() => {
    const key = companyKey(p)!;
    db.prepare("INSERT OR IGNORE INTO companies (user_id, domain, name) VALUES (?, ?, ?)").run(userId, key, p.companyName);
    const companyId = (db.prepare("SELECT id FROM companies WHERE user_id = ? AND domain = ?").get(userId, key) as { id: number }).id;
    const personId = Number(
      db
        .prepare("INSERT INTO people (company_id, full_name, first_name, last_name, title, linkedin_url, raw_json) VALUES (?, ?, ?, ?, ?, ?, ?)")
        .run(companyId, p.fullName, p.firstName, p.lastName, p.title, p.linkedinUrl, JSON.stringify(p.raw)).lastInsertRowid,
    );
    return Number(
      db.prepare("INSERT INTO leads (run_id, user_id, company_id, person_id, state) VALUES (?, ?, ?, ?, 'queued')").run(runId, userId, companyId, personId)
        .lastInsertRowid,
    );
  })();
}

async function enrichLead(
  db: DB, runId: number, holdId: number, leadId: number, p: PersonRecord, icp: Icp, wantMobile: boolean,
  call: (e: string, o: Parameters<typeof tregCall>[2]) => ReturnType<typeof tregCall>, deps: EngineDeps,
) {
  try {
    attempt(db, leadId, "people", "dropleads", "found", 0);
    if (!charge(db, runId, holdId, leadId, CREDIT_PRICES.person)) return setState(db, leadId, "stopped");
    setState(db, leadId, "finding_email");

    const identity: Record<string, string> = { full_name: p.fullName };
    if (p.firstName) identity.first_name = p.firstName;
    if (p.lastName) identity.last_name = p.lastName;
    if (p.companyDomain) identity.domain = p.companyDomain;
    if (p.linkedinUrl) identity.linkedin_url = p.linkedinUrl;

    const found = await call("treg.people.email.find", {
      body: identity,
      idempotencyKey: `run:${runId}:lead:${leadId}:email`,
      maxCostUsd: EMAIL_MAX_COST_USD,
    });
    for (const t of found.tried) {
      const name = typeof t === "string" ? t : (t as any)?.provider ?? (t as any)?.id ?? null;
      if (name && name !== found.servedBy) attempt(db, leadId, "email", String(name), "miss", 0);
    }
    const email = found.ok ? emailFrom(found.data) : null;
    attempt(db, leadId, "email", found.servedBy, email ? "hit" : found.ok ? "miss" : `error: ${found.error}`, found.costMicro);

    if (email) {
      setState(db, leadId, "verifying");
      const v = await call("treg.people.email.verify", { body: { email }, idempotencyKey: `run:${runId}:lead:${leadId}:verify` });
      const status = v.ok ? verifyStatusFrom(v.data) : "risky";
      attempt(db, leadId, "verify", v.servedBy, status, v.costMicro);
      // Invalid emails are never delivered as results, and never charged.
      db.prepare("UPDATE leads SET email = ?, email_status = ?, email_provider = ? WHERE id = ?").run(
        status === "invalid" ? null : email, status, found.servedBy, leadId,
      );
      const price = status === "verified" ? CREDIT_PRICES.verifiedEmail : status === "catch_all" || status === "risky" ? CREDIT_PRICES.unconfirmedEmail : 0;
      if (price && !charge(db, runId, holdId, leadId, price)) return setState(db, leadId, "stopped");
    } else {
      db.prepare("UPDATE leads SET email_status = 'not_found' WHERE id = ?").run(leadId);
    }

    if (wantMobile) {
      setState(db, leadId, "finding_mobile");
      const ph = await call("treg.people.phone.find", {
        body: email ? { ...identity, email } : identity,
        idempotencyKey: `run:${runId}:lead:${leadId}:phone`,
        maxCostUsd: PHONE_MAX_COST_USD,
      });
      const mobile = ph.ok ? phoneFrom(ph.data) : null;
      attempt(db, leadId, "mobile", ph.servedBy, mobile ? "hit" : "miss", ph.costMicro);
      if (mobile) {
        // Free check. Answers arrive in results[0].telephone_number_type; anything but a recognised bad type passes.
        const chk = await call("hlrlookup.people.phone.validate", {
          body: { telephone_number: mobile.replace(/[^\d]/g, "") },
          idempotencyKey: `run:${runId}:lead:${leadId}:hlr`,
        });
        const type = String(pickList(chk.data)[0]?.telephone_number_type ?? "").toUpperCase();
        const valid = !chk.ok || !/INVALID|UNKNOWN|PREMIUM/.test(type);
        attempt(db, leadId, "mobile_check", "hlrlookup", type ? type.toLowerCase() : valid ? "unchecked" : "invalid", chk.costMicro);
        if (valid && charge(db, runId, holdId, leadId, CREDIT_PRICES.mobile)) {
          db.prepare("UPDATE leads SET mobile = ?, mobile_status = 'valid' WHERE id = ?").run(mobile, leadId);
        }
      }
    }

    const line = await (deps.openingLine ?? defaultOpeningLine)(icp, p).catch(() => null);
    if (line) db.prepare("UPDATE leads SET opening_line = ? WHERE id = ?").run(line, leadId);
    setState(db, leadId, "done");
  } catch (e) {
    attempt(db, leadId, "error", null, e instanceof Error ? e.message.slice(0, 200) : "error", 0);
    setState(db, leadId, "error");
  }
}

async function defaultOpeningLine(icp: Icp, p: PersonRecord): Promise<string | null> {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  const text = await claudeText({
    model: LINE_MODEL,
    maxTokens: 120,
    system: "Write one short, specific cold-call or cold-email opening line (max 25 words). No greeting, no name, no quotes.",
    prompt: `We sell: ${icp.summary}\nAngle: ${icp.openingAngle}\nProspect: ${p.title ?? "decision maker"} at ${p.companyName ?? "their company"}.`,
  });
  return text.trim().replace(/^"|"$/g, "") || null;
}

/** On boot, any run left 'held'/'running' by a restart is closed and its unused credits refunded. */
export function recoverInterruptedRuns(db: DB) {
  const stuck = db.prepare("SELECT r.id, h.id AS hold_id FROM runs r JOIN holds h ON h.run_id = r.id WHERE r.status IN ('held','running')").all() as {
    id: number;
    hold_id: number;
  }[];
  for (const r of stuck) finish(db, r.id, r.hold_id, "failed");
  return stuck.length;
}

export function runSummary(db: DB, runId: number, userId: number) {
  const run = db.prepare("SELECT * FROM runs WHERE id = ? AND user_id = ?").get(runId, userId) as any;
  if (!run) return null;
  const leads = db
    .prepare(
      `SELECT l.id, l.state, l.email, l.email_status, l.email_provider, l.mobile, l.opening_line, l.credits, l.treg_cost_micro,
              p.full_name, p.title, p.linkedin_url, c.name AS company, c.domain
       FROM leads l JOIN people p ON p.id = l.person_id JOIN companies c ON c.id = l.company_id
       WHERE l.run_id = ? ORDER BY l.id`,
    )
    .all(runId) as any[];
  const attempts = db
    .prepare("SELECT a.lead_id, a.step, a.provider, a.outcome, a.cost_micro FROM lead_attempts a JOIN leads l ON l.id = a.lead_id WHERE l.run_id = ? ORDER BY a.id")
    .all(runId) as any[];
  const hold = db.prepare("SELECT amount, charged, status FROM holds WHERE run_id = ?").get(runId) as any;
  const cost = db.prepare("SELECT COALESCE(SUM(cost_micro),0) AS micro FROM treg_calls WHERE run_id = ?").get(runId) as { micro: number };
  return { run, leads, attempts, hold, tregCostMicro: cost.micro };
}
