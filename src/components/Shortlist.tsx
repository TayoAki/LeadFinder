"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, money, type BusinessRow } from "./deals/shared";

export default function Shortlist({ maxCredits, balance }: { maxCredits: number; balance: number }) {
  const router = useRouter();
  const [rows, setRows] = useState<BusinessRow[] | null>(null);
  const [picked, setPicked] = useState<Set<number>>(new Set());
  const [working, setWorking] = useState<number | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const d = await api<{ businesses: BusinessRow[] }>("/api/deals?stage=shortlist&sort=score");
    setRows(d.businesses);
  }, []);
  useEffect(() => { load().catch((e) => setError(e.message)); }, [load]);

  async function enrich(ids: number[]) {
    setError(null);
    for (const id of ids) {
      setWorking(id);
      const name = rows?.find((r) => r.id === id)?.name ?? "";
      try {
        const r = await api<{ listing: boolean; owner: string | null; email: string | null; status: string | null; charged: number }>(`/api/deals/${id}/enrich-shortlist`, { method: "POST" });
        const parts = [r.listing ? "website and phone" : "no website found", r.email ? `${r.owner ?? "owner"}'s email (${(r.status ?? "").replace("_", "-")})` : r.owner ? "no email found" : null].filter(Boolean);
        setLog((l) => [`${name}: ${parts.join(", ")} · ${r.charged} credit${r.charged === 1 ? "" : "s"}`, ...l]);
      } catch (e) {
        setError(`${name}: ${(e as Error).message}`);
        break;
      }
    }
    setWorking(null);
    setPicked(new Set());
    await load();
    router.refresh();
  }

  async function remove(id: number) {
    await api(`/api/deals/${id}`, { method: "DELETE" }).catch((e) => setError(e.message));
    await load();
  }

  if (!rows) return <p className="muted">Loading…</p>;
  if (!rows.length && !log.length) {
    return <div className="card empty"><h2>Your shortlist is empty</h2><p className="muted">Star the businesses you like on your Matches page and they'll gather here, ready to enrich with contact details.</p><Link className="btn primary" href="/matches">See my matches</Link></div>;
  }
  const toggle = (id: number) => setPicked((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      <div className="card" style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
        <p style={{ margin: 0, flex: "1 1 300px" }}>
          Enriching finds the business's website and phone, then the owner's work email, and moves it into your pipeline.
          Up to <strong>{maxCredits} credits</strong> each, only for what's found. You have {balance.toLocaleString()}.
        </p>
        <button className="btn primary" disabled={working !== null || picked.size === 0} onClick={() => enrich([...picked])}>
          {working !== null ? "Enriching…" : `Enrich ${picked.size || ""} selected`}
        </button>
      </div>
      {error && <p className="error">{error}</p>}
      {log.length > 0 && (
        <div className="card">
          <strong>Enriched</strong> <span className="muted">(now in your <Link href="/deals">pipeline</Link>)</span>
          <ul style={{ margin: ".4rem 0 0", paddingLeft: "1.2rem" }}>{log.map((l, i) => <li key={i}>{l}</li>)}</ul>
        </div>
      )}
      {rows.length > 0 && (
        <div className="card" style={{ padding: 0, overflowX: "auto" }}>
          <table style={{ minWidth: 760 }}>
            <thead><tr>
              <th><input type="checkbox" aria-label="Select all" checked={picked.size === rows.length} onChange={() => setPicked(picked.size === rows.length ? new Set() : new Set(rows.map((r) => r.id)))} /></th>
              <th>Match</th><th>Business</th><th>Owner</th><th>EBITDA (est.)</th><th /></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td><input type="checkbox" aria-label={`Select ${r.name}`} checked={picked.has(r.id)} onChange={() => toggle(r.id)} /></td>
                  <td><span className={`score${r.score === null ? "" : r.score >= 80 ? " hi" : r.score >= 60 ? " mid" : " lo"}`}>{r.score !== null ? Math.round(r.score) : "—"}</span></td>
                  <td><Link href={`/deals/b/${r.id}`}>{r.name}</Link><div className="muted" style={{ fontSize: ".8rem" }}>{[r.industry, r.city].filter(Boolean).join(" · ")}</div></td>
                  <td>{r.owner_name ?? "—"}</td>
                  <td style={{ whiteSpace: "nowrap" }}>{money(r.ebitda_lo)}–{money(r.ebitda_hi)}</td>
                  <td style={{ whiteSpace: "nowrap", textAlign: "right" }}>
                    <button className="btn" disabled={working !== null} onClick={() => enrich([r.id])}>{working === r.id ? "Working…" : "Enrich"}</button>{" "}
                    <button className="linkbtn" disabled={working !== null} onClick={() => remove(r.id)} title="Remove from shortlist">Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
