"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { STAGES, api, money, type BusinessRow } from "./shared";

/** Kanban board: one column per stage. Move a deal with the stage menu on its card. */
export default function Pipeline() {
  const [rows, setRows] = useState<BusinessRow[] | null>(null);
  const [q, setQ] = useState("");
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const d = await api<{ businesses: BusinessRow[] }>(`/api/deals?sort=tier${q ? `&q=${encodeURIComponent(q)}` : ""}`);
    setRows(d.businesses);
  }, [q]);

  useEffect(() => {
    const t = setTimeout(() => load().catch((e) => setError(e.message)), 200);
    return () => clearTimeout(t);
  }, [load]);

  async function move(id: number, stage: string) {
    setRows((r) => r?.map((b) => (b.id === id ? { ...b, stage } : b)) ?? null);
    await api(`/api/deals/${id}`, { method: "PATCH", json: { stage } }).catch((e) => { setError(e.message); load(); });
  }

  if (!rows) return <p className="muted">Loading…</p>;
  if (!rows.length && !q) {
    return (
      <div className="card empty">
        <h2>No businesses yet</h2>
        <p className="muted">Import your SBA Search leads, or find businesses by industry and city.</p>
        <div style={{ display: "flex", gap: ".5rem", justifyContent: "center" }}>
          <Link className="btn primary" href="/deals/import">Import leads</Link>
          <Link className="btn" href="/deals/find">Find businesses</Link>
        </div>
      </div>
    );
  }
  const today = new Date().toISOString().slice(0, 10);
  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      <input className="search" placeholder="Filter by business, owner, city or industry" value={q} onChange={(e) => setQ(e.target.value)} />
      {error && <p className="error">{error}</p>}
      <div className="board">
        {STAGES.map((s) => {
          const col = rows.filter((b) => b.stage === s.id);
          return (
            <section key={s.id} className="board-col" aria-label={s.label}>
              <header className="board-head"><span>{s.label}</span><span className="muted">{col.length}</span></header>
              <div className="board-cards">
                {col.slice(0, 100).map((b) => (
                  <article key={b.id} className="deal-card">
                    <Link href={`/deals/b/${b.id}`} className="deal-name">{b.name}</Link>
                    <div className="muted deal-sub">{[b.city, b.state].filter(Boolean).join(", ")}{b.owner_name ? ` · ${b.owner_name}` : ""}</div>
                    <div className="deal-meta">
                      {b.tier && <span className="pill">Tier {b.tier}</span>}
                      {b.ebitda_hi !== null && <span className="muted">EBITDA {money(b.ebitda_lo)}–{money(b.ebitda_hi)}</span>}
                    </div>
                    {b.next_task_due && (
                      <div className={`deal-due${b.next_task_due < today ? " overdue" : ""}`}>
                        {b.next_task_due < today ? "Overdue" : "Next"}: {b.next_task_due}
                      </div>
                    )}
                    <select aria-label={`Stage for ${b.name}`} value={b.stage} onChange={(e) => move(b.id, e.target.value)} className="deal-stage">
                      {STAGES.map((x) => <option key={x.id} value={x.id}>{x.label}</option>)}
                    </select>
                  </article>
                ))}
                {col.length > 100 && <p className="muted" style={{ fontSize: ".8rem" }}>+{col.length - 100} more in Businesses</p>}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
