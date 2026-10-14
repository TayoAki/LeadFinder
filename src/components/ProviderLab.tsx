"use client";
import { Fragment, useCallback, useEffect, useState } from "react";
import type { LabSummary } from "@/lib/lab.ts";

type Provider = { slug: string; label: string; usd: number; needs: string };
type Result = {
  lead_id: number; outcome: string; email: string | null; served_by: string | null; cost_micro: number; latency_ms: number;
  waterfall_email: string | null; note: string | null; full_name: string | null; company: string | null;
};

const usd = (m: number | null, dp = 4) => (m === null ? "—" : `$${(m / 1e6).toFixed(dp)}`);
const pct = (n: number | null) => (n === null ? "—" : `${Math.round(n * 100)}%`);
const NEEDS: Record<string, string> = { linkedin: "LinkedIn URL", name_domain: "name + website", either: "LinkedIn or name + website" };
const num = { textAlign: "right" as const, fontVariantNumeric: "tabular-nums" as const };

export default function ProviderLab({ providers }: { providers: Provider[] }) {
  const [provider, setProvider] = useState(providers[0].slug);
  const [sample, setSample] = useState(10);
  const [tests, setTests] = useState<LabSummary[]>([]);
  const [open, setOpen] = useState<number | null>(null);
  const [results, setResults] = useState<Result[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/lab");
    if (res.ok) setTests(await res.json());
  }, []);

  useEffect(() => { load(); }, [load]);
  // Poll while a test is running.
  useEffect(() => {
    if (!tests.some((t) => t.status === "running")) return;
    const t = setTimeout(load, 2000);
    return () => clearTimeout(t);
  }, [tests, load]);
  useEffect(() => {
    if (open === null) return;
    setResults(null);
    fetch(`/api/lab/${open}`).then((r) => r.json()).then(setResults);
  }, [open, tests]);

  const chosen = providers.find((p) => p.slug === provider)!;

  async function start() {
    setBusy(true);
    setError(null);
    const res = await fetch("/api/lab", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ provider, sample }) });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) return setError(data.error ?? "Couldn't start");
    setOpen(data.id);
    load();
  }

  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      <div className="card">
        <p className="muted" style={{ marginTop: 0 }}>
          Run one email provider, with no fallback, over people the waterfall already processed, and compare. Paid from your Treg
          balance (no customer credits); misses are free.
        </p>
        <div style={{ display: "flex", gap: "1rem", alignItems: "end", flexWrap: "wrap" }}>
          <label className="field" style={{ marginBottom: 0 }}>Provider
            <select value={provider} onChange={(e) => setProvider(e.target.value)} className="btn">
              {providers.map((p) => <option key={p.slug} value={p.slug}>{p.label} · ${p.usd}/hit</option>)}
            </select>
          </label>
          <label className="field" style={{ marginBottom: 0 }}>Sample
            <input type="number" min={1} max={50} value={sample} onChange={(e) => setSample(Math.max(1, Math.min(50, Number(e.target.value))))} style={{ width: 90 }} />
          </label>
          <button className="btn primary" onClick={start} disabled={busy}>{busy ? "Starting…" : "Run test"}</button>
        </div>
        <p className="muted" style={{ fontSize: ".85rem", marginBottom: 0 }}>
          {chosen.label} needs a {NEEDS[chosen.needs]}. At most {usd(Math.round(chosen.usd * 1e6) * sample)} if every lookup hits.
        </p>
        {error && <p className="error">{error}</p>}
      </div>

      <div className="card" style={{ overflowX: "auto" }}>
        <h3>Results</h3>
        {tests.length === 0 ? <p className="muted">No tests yet.</p> : (
          <table>
            <thead>
              <tr>
                <th>Test</th><th>Provider</th><th style={num}>Hit rate</th><th style={num}>Waterfall</th><th style={num}>Cost / hit</th>
                <th style={num}>Waterfall / hit</th><th style={num}>Avg time</th><th style={num}>Same / different / new</th><th style={num}>Spent</th>
              </tr>
            </thead>
            <tbody>
              {tests.map((t) => (
                <Fragment key={t.id}>
                  <tr onClick={() => setOpen(open === t.id ? null : t.id)} style={{ cursor: "pointer" }}>
                    <td>#{t.id}<div className="muted" style={{ fontSize: ".75rem" }}>{t.status === "running" ? "running…" : t.created_at}</div></td>
                    <td>{t.label}</td>
                    <td style={num}>{pct(t.hitRate)}<div className="muted" style={{ fontSize: ".75rem" }}>{t.hits}/{t.tried}</div></td>
                    <td style={num}>{pct(t.waterfallHitRate)}<div className="muted" style={{ fontSize: ".75rem" }}>{t.waterfallHits}/{t.tried}</div></td>
                    <td style={num}>{usd(t.costPerHitMicro)}</td>
                    <td style={num}>{usd(t.waterfallCostPerHitMicro)}</td>
                    <td style={num}>{t.avgMs === null ? "—" : `${(t.avgMs / 1000).toFixed(1)}s`}</td>
                    <td style={num}>{t.agrees} / {t.differs} / {t.newFinds}</td>
                    <td style={num}>{usd(t.costMicro)}</td>
                  </tr>
                  {open === t.id && (
                    <tr>
                      <td colSpan={9} style={{ background: "var(--bg)" }}>
                        {!results ? <p className="muted">Loading…</p> : (
                          <table>
                            <thead><tr><th>Person</th><th>{t.label}</th><th>Waterfall</th><th style={num}>Cost</th><th style={num}>Time</th></tr></thead>
                            <tbody>
                              {results.map((r) => (
                                <tr key={r.lead_id}>
                                  <td>{r.full_name ?? "(deleted lead)"}<div className="muted" style={{ fontSize: ".75rem" }}>{r.company}</div></td>
                                  <td>{r.email ?? <span className="muted">{r.outcome === "miss" ? "no email" : r.note ?? r.outcome}</span>}</td>
                                  <td>{r.waterfall_email ?? <span className="muted">no email</span>}</td>
                                  <td style={num}>{usd(r.cost_micro)}</td>
                                  <td style={num}>{(r.latency_ms / 1000).toFixed(1)}s</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        )}
        <p className="muted" style={{ fontSize: ".8rem", marginBottom: 0 }}>
          Hit rates count only people the provider could look up. &ldquo;Waterfall / hit&rdquo; is what the full ladder spent per email on the
          same people. Same / different / new: matches the waterfall&apos;s email, a different email, or an email the waterfall didn&apos;t find.
        </p>
      </div>
    </div>
  );
}
