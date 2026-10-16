"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { api, money } from "./shared";

type Row = {
  id: number; name: string; industry: string | null; city: string | null; state: string; metro: string | null; owner_name: string | null;
  owner_title: string | null; age_years: number | null; ebitda_lo: number | null; ebitda_hi: number | null; jobs: number | null;
  family_run: boolean; role: string | null; score: number | null; reason: string | null; flags: string[]; saved: boolean;
};
type Result = { total: number; rows: Row[]; unscored: number; scored?: number; remaining?: number };
type Filter = { industries: string[]; metro: string; minAge: number; ebitdaMin: number; ebitdaMax: number; familyOnly: boolean; q: string };

export default function Directory({ industries, initial, hasThesis }: { industries: { naics: string; name: string; n: number }[]; initial: Filter; hasThesis: boolean }) {
  const [f, setF] = useState<Filter>(initial);
  const [res, setRes] = useState<Result | null>(null);
  const [picked, setPicked] = useState<Set<number>>(new Set());
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const search = useCallback(async () => {
    setError(null);
    try { setRes(await api<Result>("/api/directory/search", { method: "POST", json: f })); } catch (e) { setError((e as Error).message); }
  }, [f]);
  useEffect(() => { const t = setTimeout(search, 250); return () => clearTimeout(t); }, [search]);

  async function score() {
    setBusy("score"); setError(null); setNotice(null);
    try {
      const r = await api<Result>("/api/directory/score", { method: "POST", json: f });
      setRes(r);
      setNotice(`Scored ${r.scored ?? 0} businesses${r.remaining ? `; ${r.remaining} more to go, press again to continue` : ""}.`);
    } catch (e) { setError((e as Error).message); }
    setBusy(null);
  }

  async function save() {
    setBusy("save"); setError(null);
    try {
      const r = await api<{ added: number }>("/api/directory/save", { method: "POST", json: { ids: [...picked] } });
      setNotice(`Added ${r.added} to your pipeline.`);
      setPicked(new Set());
      await search();
    } catch (e) { setError((e as Error).message); }
    setBusy(null);
  }

  const set = <K extends keyof Filter>(k: K, v: Filter[K]) => setF({ ...f, [k]: v });
  const toggle = (id: number) => setPicked((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      {!hasThesis && (
        <p className="card" style={{ margin: 0 }}>
          Tip: <Link href="/deals/buybox">write your thesis in the buy box</Link> so the AI knows what you're looking for. Scores use your buy box as it is when you score.
        </p>
      )}
      <div className="card" style={{ display: "grid", gap: ".75rem" }}>
        <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap" }}>
          {industries.map((i) => (
            <label key={i.naics} style={{ display: "flex", gap: ".35rem", alignItems: "center" }}>
              <input type="checkbox" checked={f.industries.includes(i.naics)}
                onChange={(e) => set("industries", e.target.checked ? [...f.industries, i.naics] : f.industries.filter((x) => x !== i.naics))} />
              {i.name} <span className="muted">({i.n.toLocaleString()})</span>
            </label>
          ))}
        </div>
        <div className="filters">
          <input className="search" placeholder="Business, owner or city" value={f.q} onChange={(e) => set("q", e.target.value)} />
          <input className="search" style={{ flex: "1 1 160px" }} placeholder="Metro, e.g. Dallas" value={f.metro} onChange={(e) => set("metro", e.target.value)} />
          <label className="muted" style={{ display: "flex", gap: ".3rem", alignItems: "center" }}>Min years
            <input className="search" type="number" min={0} style={{ width: 70 }} value={f.minAge} onChange={(e) => set("minAge", Number(e.target.value))} /></label>
          <label className="muted" style={{ display: "flex", gap: ".3rem", alignItems: "center" }}>EBITDA $
            <input className="search" type="number" min={0} step={100000} style={{ width: 110 }} value={f.ebitdaMin} onChange={(e) => set("ebitdaMin", Number(e.target.value))} />
            to <input className="search" type="number" min={0} step={100000} style={{ width: 110 }} value={f.ebitdaMax} onChange={(e) => set("ebitdaMax", Number(e.target.value))} /></label>
          <label style={{ display: "flex", gap: ".35rem", alignItems: "center" }}>
            <input type="checkbox" checked={f.familyOnly} onChange={(e) => set("familyOnly", e.target.checked)} /> Family run only</label>
        </div>
      </div>

      {error && <p className="error">{error}</p>}
      {notice && <p className="card" style={{ margin: 0 }}>{notice}</p>}

      {res && (
        <div className="card" style={{ padding: 0, overflowX: "auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", padding: ".75rem 1rem", flexWrap: "wrap" }}>
            <span className="muted">
              {res.total.toLocaleString()} match your filters{res.total > res.rows.length ? `; showing the largest ${res.rows.length}` : ""}
              {res.unscored ? ` · ${res.unscored} not scored yet` : ""}
            </span>
            <span style={{ display: "flex", gap: ".5rem" }}>
              <button className="btn" onClick={score} disabled={busy !== null || res.unscored === 0}>
                {busy === "score" ? "Scoring…" : `Score ${Math.min(res.unscored, 100)} with AI`}
              </button>
              <button className="btn primary" onClick={save} disabled={busy !== null || picked.size === 0}>Add {picked.size} to pipeline</button>
            </span>
          </div>
          <table style={{ minWidth: 980 }}>
            <thead><tr><th /><th>Match</th><th>Business</th><th>Owner</th><th>Years</th><th>EBITDA (est.)</th><th>Staff</th><th>Why</th></tr></thead>
            <tbody>
              {res.rows.map((r) => (
                <tr key={r.id}>
                  <td>{r.saved ? <span className="muted" title="Already in your pipeline">✓</span>
                    : <input type="checkbox" aria-label={`Select ${r.name}`} checked={picked.has(r.id)} onChange={() => toggle(r.id)} />}</td>
                  <td><span className={`score${r.score === null ? "" : r.score >= 80 ? " hi" : r.score >= 60 ? " mid" : " lo"}`}>{r.score ?? "—"}</span></td>
                  <td>{r.name}<div className="muted" style={{ fontSize: ".8rem" }}>{r.industry} · {r.city}{r.metro ? ` · ${r.metro.split(",")[0]}` : ""}</div></td>
                  <td style={{ fontSize: ".9rem" }}>{r.owner_name ?? "—"}{r.family_run && <div className="muted" style={{ fontSize: ".75rem" }}>family run</div>}</td>
                  <td>{r.age_years !== null ? Math.round(r.age_years) : "—"}</td>
                  <td style={{ whiteSpace: "nowrap" }}>{money(r.ebitda_lo)}–{money(r.ebitda_hi)}</td>
                  <td>{r.jobs ?? "—"}</td>
                  <td style={{ fontSize: ".85rem", maxWidth: 360 }}>
                    {r.reason ?? <span className="muted">Not scored yet</span>}
                    {r.flags.length > 0 && <div className="muted" style={{ fontSize: ".78rem", marginTop: ".2rem" }}>⚠ {r.flags.join(" · ")}</div>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {res.rows.length === 0 && <p className="muted" style={{ padding: "1rem" }}>Nothing matches. Widen the size or age range.</p>}
        </div>
      )}
      <p className="muted" style={{ fontSize: ".8rem" }}>
        Data: SBA PPP loans, state business registries and Department of Labor filings (public records). Size figures are estimates for deciding who to call, not valuations.
      </p>
    </div>
  );
}
