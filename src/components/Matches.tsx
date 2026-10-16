"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { api, money } from "./deals/shared";

type Row = {
  id: number; name: string; industry: string | null; city: string | null; metro: string | null; owner_name: string | null;
  age_years: number | null; ebitda_lo: number | null; ebitda_hi: number | null; jobs: number | null; family_run: boolean;
  score: number | null; reason: string | null; flags: string[]; saved: boolean; businessId: number | null; stage: string | null;
};
type Result = { total: number; rows: Row[]; unscored: number; scored?: number; failed?: number };

const STEP = 10;

export default function Matches({ autoScore }: { autoScore: boolean }) {
  const [res, setRes] = useState<Result | null>(null);
  const [scoring, setScoring] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [onlyGood, setOnlyGood] = useState(false);
  const stop = useRef(false);

  const load = useCallback(async () => { setRes(await api<Result>("/api/directory/matches")); }, []);

  const score = useCallback(async () => {
    setScoring(true); setError(null); stop.current = false;
    try {
      for (let i = 0; i < 12 && !stop.current; i++) {
        const r = await api<Result>("/api/directory/score", { method: "POST", json: { fromBuyBox: true, step: STEP } });
        setRes(r);
        if (r.unscored === 0 || (r.scored ?? 0) === 0) break;
      }
    } catch (e) { setError((e as Error).message); }
    setScoring(false);
  }, []);

  useEffect(() => {
    load().then(() => undefined).catch((e) => setError(e.message));
    return () => { stop.current = true; };
  }, [load]);
  useEffect(() => { if (autoScore && res && res.unscored > 0 && !scoring) score(); }, [autoScore, res === null]); // eslint-disable-line react-hooks/exhaustive-deps

  async function star(r: Row) {
    setRes((x) => x && { ...x, rows: x.rows.map((y) => (y.id === r.id ? { ...y, saved: !r.saved, stage: r.saved ? null : "shortlist" } : y)) });
    try {
      if (r.saved && r.businessId) await api(`/api/deals/${r.businessId}`, { method: "DELETE" });
      else await api("/api/directory/save", { method: "POST", json: { ids: [r.id] } });
      await load();
    } catch (e) { setError((e as Error).message); await load(); }
  }

  if (!res) return <p className="muted">Finding businesses that fit your buy box…</p>;
  const scored = res.rows.length - res.unscored;
  const rows = res.rows.filter((r) => !onlyGood || (r.score ?? 0) >= 60);
  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      <div className="card" style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 260px" }}>
          <div><strong>{res.total.toLocaleString()}</strong> businesses fit your buy box{res.total > res.rows.length ? `; we've ranked the ${res.rows.length} largest` : ""}.</div>
          {res.unscored > 0 && (
            <div style={{ marginTop: ".5rem" }}>
              <div className="progress" aria-hidden="true"><span style={{ width: `${(scored / Math.max(1, res.rows.length)) * 100}%`, background: "var(--accent)" }} /></div>
              <span className="muted" style={{ fontSize: ".85rem" }}>{scoring ? `Our AI is reading each one… ${scored} of ${res.rows.length}` : `${res.unscored} not ranked yet`}</span>
            </div>
          )}
        </div>
        {res.unscored > 0 && !scoring && <button className="btn primary" onClick={score}>Rank {res.unscored} with AI</button>}
        {scoring && <button className="btn" onClick={() => { stop.current = true; }}>Pause</button>}
        <label style={{ display: "flex", gap: ".4rem", alignItems: "center" }}>
          <input type="checkbox" checked={onlyGood} onChange={(e) => setOnlyGood(e.target.checked)} /> Good fits only (60+)
        </label>
        <Link href="/start" className="btn">Edit buy box</Link>
      </div>
      {error && <p className="error">{error}</p>}
      {res.total === 0 && (
        <div className="card empty"><h2>No businesses fit yet</h2><p className="muted">Try a wider size range, fewer years in business, or anywhere instead of one metro.</p><Link className="btn primary" href="/start">Edit buy box</Link></div>
      )}
      <div className="match-list">
        {rows.map((r) => (
          <article key={r.id} className="card match">
            <div className={`score big${r.score === null ? "" : r.score >= 80 ? " hi" : r.score >= 60 ? " mid" : " lo"}`} aria-label={r.score === null ? "Not ranked yet" : `Match ${r.score} of 100`}>
              {r.score ?? "…"}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div className="match-head">
                <h3 style={{ margin: 0 }}>{r.businessId ? <Link href={`/deals/b/${r.businessId}`}>{r.name}</Link> : r.name}</h3>
                <button className={`star${r.saved ? " on" : ""}`} onClick={() => star(r)} disabled={Boolean(r.saved && r.stage !== "shortlist")}
                  aria-pressed={r.saved} title={r.saved ? (r.stage === "shortlist" ? "Remove from shortlist" : "In your pipeline") : "Add to shortlist"}>
                  {r.saved ? (r.stage === "shortlist" ? "★ Shortlisted" : "✓ In pipeline") : "☆ Shortlist"}
                </button>
              </div>
              <div className="muted" style={{ fontSize: ".85rem" }}>
                {[r.industry, r.city, r.metro?.split(",")[0]].filter(Boolean).join(" · ")}
                {r.owner_name ? ` · Owner: ${r.owner_name}` : ""}
              </div>
              <div className="match-facts">
                <span>{r.age_years !== null ? `${Math.round(r.age_years)} years` : "Age unknown"}</span>
                <span>EBITDA {money(r.ebitda_lo)}–{money(r.ebitda_hi)}</span>
                {r.jobs !== null && <span>{r.jobs} staff (2020)</span>}
                {r.family_run && <span>Family run</span>}
              </div>
              {r.reason && <p style={{ margin: ".4rem 0 0" }}>{r.reason}</p>}
              {r.flags.length > 0 && <p className="muted" style={{ margin: ".25rem 0 0", fontSize: ".85rem" }}>⚠ {r.flags.join(" · ")}</p>}
            </div>
          </article>
        ))}
      </div>
      <p className="muted" style={{ fontSize: ".8rem" }}>Ranking is free. Size figures are estimates from public payroll data, for deciding who to call, not valuations.</p>
    </div>
  );
}
