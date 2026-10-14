import type { DB } from "./db.ts";
import { tregCall } from "./treg.ts";
import { emailFrom } from "./normalize.ts";

// Email providers behind treg.people.email.find, cheapest first, with what each needs to identify a person.
// Prices are Treg's per-hit catalog prices (checked 14 Oct 2026); misses on these are free.
export const LAB_PROVIDERS = [
  { slug: "quickenrich", label: "QuickEnrich", usd: 0.004834, needs: "either" },
  { slug: "trykitt", label: "Kitt", usd: 0.005, needs: "name_domain" },
  { slug: "aiark", label: "AI Ark", usd: 0.005267, needs: "linkedin" },
  { slug: "tomba", label: "Tomba", usd: 0.0089, needs: "either" },
  { slug: "moltsets", label: "Moltsets", usd: 0.01, needs: "name_domain" },
  { slug: "dropleads", label: "Dropleads", usd: 0.018, needs: "name_domain" },
  { slug: "findymail", label: "Findymail", usd: 0.0198, needs: "either" },
  { slug: "datagma", label: "Datagma", usd: 0.02258, needs: "name_domain" },
  { slug: "prospeo", label: "Prospeo", usd: 0.0245, needs: "either" },
  { slug: "hunter", label: "Hunter", usd: 0.0245, needs: "name_domain" },
  { slug: "leadmagic", label: "LeadMagic", usd: 0.025, needs: "name_domain" },
] as const;
export type LabProvider = (typeof LAB_PROVIDERS)[number];

export const MAX_SAMPLE = 50;
const CONCURRENCY = 5;

export class LabError extends Error {}

interface SamplePerson {
  lead_id: number;
  full_name: string;
  first_name: string | null;
  last_name: string | null;
  linkedin_url: string | null;
  domain: string;
  email: string | null;
  waterfall_cost_micro: number;
}

/**
 * The most recent finished leads the provider can take as input, with what the waterfall found for them.
 * A website comes from the company record, never from the email the waterfall found (that would hand the provider the answer).
 */
export function labSample(db: DB, provider: LabProvider, size: number): SamplePerson[] {
  const needs =
    provider.needs === "linkedin" ? "p.linkedin_url IS NOT NULL"
    : provider.needs === "name_domain" ? "c.domain NOT LIKE 'name:%'"
    : "(p.linkedin_url IS NOT NULL OR c.domain NOT LIKE 'name:%')";
  return db
    .prepare(
      `SELECT l.id AS lead_id, p.full_name, p.first_name, p.last_name, p.linkedin_url, c.domain,
              CASE WHEN l.email_provider = 'uploaded' THEN NULL ELSE l.email END AS email,
              (SELECT COALESCE(SUM(cost_micro), 0) FROM lead_attempts WHERE lead_id = l.id AND step = 'email') AS waterfall_cost_micro
       FROM leads l JOIN people p ON p.id = l.person_id JOIN companies c ON c.id = l.company_id
       WHERE l.state = 'done' AND COALESCE(l.email_provider, '') <> 'uploaded' AND ${needs}
       ORDER BY l.id DESC LIMIT ?`,
    )
    .all(size) as SamplePerson[];
}

/** Admin-only: run one provider, with no waterfall fallback, over a sample. Paid by the operator, no credits. */
export function startLabTest(db: DB, adminId: number, slug: string, size: number, fetchImpl?: typeof fetch) {
  const provider = LAB_PROVIDERS.find((p) => p.slug === slug);
  if (!provider) throw new LabError("Pick a provider");
  if (!Number.isInteger(size) || size < 1 || size > MAX_SAMPLE) throw new LabError(`Sample between 1 and ${MAX_SAMPLE}`);
  if (db.prepare("SELECT 1 FROM lab_tests WHERE status = 'running'").get()) throw new LabError("A lab test is already running");
  const sample = labSample(db, provider, size);
  if (!sample.length) throw new LabError(`No finished leads ${provider.label} can look up yet. Run a search first.`);
  const testId = Number(
    db.prepare("INSERT INTO lab_tests (user_id, provider, sample_size) VALUES (?, ?, ?)").run(adminId, provider.slug, sample.length).lastInsertRowid,
  );
  void runLabTest(db, adminId, testId, provider, sample, fetchImpl).catch((e) => {
    console.error(`lab test ${testId} crashed`, e);
    db.prepare("UPDATE lab_tests SET status = 'failed', finished_at = datetime('now') WHERE id = ?").run(testId);
  });
  return testId;
}

async function runLabTest(db: DB, adminId: number, testId: number, provider: LabProvider, sample: SamplePerson[], fetchImpl?: typeof fetch) {
  const save = db.prepare(
    `INSERT INTO lab_results (test_id, lead_id, outcome, email, served_by, cost_micro, latency_ms, waterfall_email, waterfall_cost_micro, note)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );
  let next = 0;
  const worker = async () => {
    while (next < sample.length) {
      const s = sample[next++];
      const body: Record<string, string> = { full_name: s.full_name };
      if (s.first_name) body.first_name = s.first_name;
      if (s.last_name) body.last_name = s.last_name;
      if (s.linkedin_url) body.linkedin_url = s.linkedin_url;
      if (!s.domain.startsWith("name:")) body.domain = s.domain;
      const started = Date.now();
      const res = await tregCall(db, "treg.people.email.find", {
        body,
        userId: adminId,
        idempotencyKey: `lab:${testId}:lead:${s.lead_id}`,
        maxCostUsd: 0.05,
        // Pin the router to this one provider and stop there: no fallback to the rest of the ladder.
        headers: { "X-Treg-Route-Prefer": provider.slug, "X-Treg-Route-Waterfall": "0" },
      }, fetchImpl);
      const ms = Date.now() - started;
      const servedBy = res.servedBy ?? null;
      const byThisProvider = !servedBy || servedBy.startsWith(`${provider.slug}.`) || servedBy === provider.slug;
      const email = res.ok && byThisProvider ? emailFrom(res.data) : null;
      const outcome = !res.ok ? "error" : !byThisProvider ? "not_tried" : email ? "hit" : "miss";
      const note = !res.ok ? res.error : !byThisProvider ? `served by ${servedBy}` : null;
      save.run(testId, s.lead_id, outcome, email, servedBy, res.costMicro, ms, s.email, s.waterfall_cost_micro, note);
    }
  };
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  db.prepare("UPDATE lab_tests SET status = 'completed', finished_at = datetime('now') WHERE id = ?").run(testId);
}

export interface LabSummary {
  id: number;
  provider: string;
  label: string;
  status: string;
  created_at: string;
  sample: number;
  tried: number;
  hits: number;
  hitRate: number | null;
  costMicro: number;
  costPerHitMicro: number | null;
  avgMs: number | null;
  agrees: number; // same email as the waterfall
  differs: number; // a different email than the waterfall
  newFinds: number; // found one where the waterfall found none
  waterfallHits: number;
  waterfallHitRate: number | null;
  waterfallCostMicro: number;
  waterfallCostPerHitMicro: number | null;
}

export function labSummaries(db: DB, limit = 20): LabSummary[] {
  const tests = db.prepare("SELECT id, provider, status, created_at, sample_size FROM lab_tests ORDER BY id DESC LIMIT ?").all(limit) as {
    id: number; provider: string; status: string; created_at: string; sample_size: number;
  }[];
  return tests.map((t) => {
    const rows = labResults(db, t.id);
    const tried = rows.filter((r) => r.outcome === "hit" || r.outcome === "miss");
    const hits = tried.filter((r) => r.outcome === "hit");
    const wfHits = tried.filter((r) => r.waterfall_email);
    const cost = rows.reduce((n, r) => n + r.cost_micro, 0);
    const wfCost = tried.reduce((n, r) => n + r.waterfall_cost_micro, 0);
    return {
      id: t.id,
      provider: t.provider,
      label: LAB_PROVIDERS.find((p) => p.slug === t.provider)?.label ?? t.provider,
      status: t.status,
      created_at: t.created_at,
      sample: t.sample_size,
      tried: tried.length,
      hits: hits.length,
      hitRate: tried.length ? hits.length / tried.length : null,
      costMicro: cost,
      costPerHitMicro: hits.length ? Math.round(cost / hits.length) : null,
      avgMs: tried.length ? Math.round(tried.reduce((n, r) => n + r.latency_ms, 0) / tried.length) : null,
      agrees: hits.filter((r) => r.waterfall_email && r.email === r.waterfall_email).length,
      differs: hits.filter((r) => r.waterfall_email && r.email !== r.waterfall_email).length,
      newFinds: hits.filter((r) => !r.waterfall_email).length,
      waterfallHits: wfHits.length,
      waterfallHitRate: tried.length ? wfHits.length / tried.length : null,
      waterfallCostMicro: wfCost,
      waterfallCostPerHitMicro: wfHits.length ? Math.round(wfCost / wfHits.length) : null,
    };
  });
}

export function labResults(db: DB, testId: number) {
  return db
    .prepare(
      `SELECT r.*, p.full_name, c.name AS company FROM lab_results r
       LEFT JOIN leads l ON l.id = r.lead_id LEFT JOIN people p ON p.id = l.person_id LEFT JOIN companies c ON c.id = l.company_id
       WHERE r.test_id = ? ORDER BY r.id`,
    )
    .all(testId) as {
    lead_id: number; outcome: string; email: string | null; served_by: string | null; cost_micro: number; latency_ms: number;
    waterfall_email: string | null; waterfall_cost_micro: number; note: string | null; full_name: string | null; company: string | null;
  }[];
}
