"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { STAGES, api, range, stageLabel, type BusinessRow } from "./shared";

export default function BusinessList() {
  const [rows, setRows] = useState<BusinessRow[] | null>(null);
  const [q, setQ] = useState("");
  const [stage, setStage] = useState("");
  const [tier, setTier] = useState("");
  const [source, setSource] = useState("");
  const [sort, setSort] = useState("tier");

  const params = useMemo(() => {
    const p = new URLSearchParams({ sort });
    if (q) p.set("q", q);
    if (stage) p.set("stage", stage);
    if (tier) p.set("tier", tier);
    if (source) p.set("source", source);
    return p.toString();
  }, [q, stage, tier, source, sort]);

  useEffect(() => {
    const t = setTimeout(() => api<{ businesses: BusinessRow[] }>(`/api/deals?${params}`).then((d) => setRows(d.businesses)), 200);
    return () => clearTimeout(t);
  }, [params]);

  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      <div className="filters">
        <input className="search" placeholder="Search business, owner, city, industry" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="btn" value={stage} onChange={(e) => setStage(e.target.value)} aria-label="Stage">
          <option value="">All stages</option>
          {STAGES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
        <select className="btn" value={tier} onChange={(e) => setTier(e.target.value)} aria-label="Fit tier">
          <option value="">All tiers</option><option value="A">Tier A</option><option value="B">Tier B</option><option value="C">Tier C</option>
        </select>
        <select className="btn" value={source} onChange={(e) => setSource(e.target.value)} aria-label="Source">
          <option value="">All sources</option><option value="sba_import">SBA Search</option><option value="maps">Found by search</option>
        </select>
        <select className="btn" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort">
          <option value="tier">Sort: fit</option><option value="score">Sort: score</option><option value="name">Sort: name</option>
          <option value="due">Sort: due date</option><option value="updated">Sort: recently updated</option>
        </select>
        <a className="btn" href={`/api/deals/export?${params}`}>Export CSV</a>
      </div>
      {!rows ? <p className="muted">Loading…</p> : (
        <div className="card" style={{ padding: 0, overflowX: "auto" }}>
          <table style={{ minWidth: 900 }}>
            <thead>
              <tr><th>Business</th><th>Owner</th><th>Contact</th><th>Fit</th><th>Size (EBITDA)</th><th>Years</th><th>Stage</th><th>Next</th></tr>
            </thead>
            <tbody>
              {rows.map((b) => (
                <tr key={b.id}>
                  <td><Link href={`/deals/b/${b.id}`}>{b.name}</Link><div className="muted" style={{ fontSize: ".8rem" }}>{b.industry} · {[b.city, b.state].filter(Boolean).join(", ")}</div></td>
                  <td>{b.owner_name ?? <span className="muted">—</span>}</td>
                  <td style={{ fontSize: ".85rem" }}>
                    {b.owner_email ? <div>{b.owner_email}</div> : null}
                    {b.phone ? <div className="muted">{b.phone}</div> : null}
                    {!b.owner_email && !b.phone && <span className="muted">—</span>}
                  </td>
                  <td>{b.tier ? <span className="pill">Tier {b.tier}</span> : <span className="muted">—</span>}{b.score !== null && <div className="muted" style={{ fontSize: ".75rem" }}>score {Math.round(b.score)}</div>}</td>
                  <td>{range(b.ebitda_lo, b.ebitda_hi)}</td>
                  <td>{b.age_years !== null ? Math.round(b.age_years) : "—"}</td>
                  <td>{stageLabel(b.stage)}</td>
                  <td style={{ fontSize: ".85rem" }}>{b.next_step ?? (b.next_task_due ? `Task due ${b.next_task_due}` : <span className="muted">—</span>)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 && <p className="muted" style={{ padding: "1rem" }}>Nothing matches these filters.</p>}
          <p className="muted" style={{ padding: ".5rem 1rem", fontSize: ".85rem", margin: 0 }}>{rows.length.toLocaleString()} businesses</p>
        </div>
      )}
    </div>
  );
}
