"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "./shared";

type Row = { name: string; address: string; phone: string | null; website: string | null; rating: number | null; reviews: number | null; category: string | null; placeId: string; url: string | null; saved: boolean };

export default function Find() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [rows, setRows] = useState<Row[] | null>(null);
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function search(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setError(null); setNotice(null);
    try {
      const d = await api<{ rows: Row[] }>("/api/deals/search", { method: "POST", json: { query, location } });
      setRows(d.rows);
      setPicked(new Set(d.rows.filter((r) => !r.saved).map((r) => r.placeId)));
    } catch (err) { setError((err as Error).message); }
    setBusy(false);
  }

  async function save() {
    if (!rows) return;
    setBusy(true); setError(null);
    try {
      const d = await api<{ saved: number; charged: number }>("/api/deals/save", { method: "POST", json: { query, rows: rows.filter((r) => picked.has(r.placeId)) } });
      setNotice(`Saved ${d.saved} to your pipeline (${d.charged} credit${d.charged === 1 ? "" : "s"}).`);
      setRows(rows.map((r) => (picked.has(r.placeId) ? { ...r, saved: true } : r)));
      setPicked(new Set());
      router.refresh();
    } catch (err) { setError((err as Error).message); }
    setBusy(false);
  }

  const toggle = (id: string) => setPicked((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const newPicked = rows?.filter((r) => picked.has(r.placeId) && !r.saved).length ?? 0;

  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      <form className="card" onSubmit={search} style={{ display: "flex", gap: ".75rem", flexWrap: "wrap", alignItems: "end" }}>
        <label className="field" style={{ marginBottom: 0, flex: "2 1 220px" }}>What kind of business
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="HVAC contractor" required />
        </label>
        <label className="field" style={{ marginBottom: 0, flex: "1 1 180px" }}>Where (City, ST)
          <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Austin, TX" required />
        </label>
        <button className="btn primary" disabled={busy}>{busy && !rows ? "Searching…" : "Search"}</button>
        <p className="muted" style={{ flexBasis: "100%", margin: 0, fontSize: ".85rem" }}>
          Searching is free. Saving a business to your pipeline costs 1 credit; finding the owner and their email is up to 5 more, only when found.
        </p>
      </form>
      {error && <p className="error">{error}</p>}
      {notice && <p className="card" style={{ margin: 0 }}>{notice}</p>}
      {rows && (
        <div className="card" style={{ padding: 0, overflowX: "auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: ".75rem 1rem", gap: "1rem", flexWrap: "wrap" }}>
            <span className="muted">{rows.length} businesses in that area</span>
            <button className="btn primary" onClick={save} disabled={busy || picked.size === 0}>
              Save {picked.size} to pipeline{newPicked ? ` (${newPicked} credit${newPicked === 1 ? "" : "s"})` : ""}
            </button>
          </div>
          <table style={{ minWidth: 720 }}>
            <thead><tr><th /><th>Business</th><th>Phone</th><th>Website</th><th>Reviews</th></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.placeId}>
                  <td><input type="checkbox" aria-label={`Select ${r.name}`} checked={picked.has(r.placeId)} onChange={() => toggle(r.placeId)} /></td>
                  <td>{r.name}{r.saved && <span className="pill" style={{ marginLeft: ".4rem" }}>in pipeline</span>}<div className="muted" style={{ fontSize: ".8rem" }}>{r.category} · {r.address}</div></td>
                  <td style={{ whiteSpace: "nowrap" }}>{r.phone ?? "—"}</td>
                  <td style={{ fontSize: ".85rem" }}>{r.website ? new URL(r.website).hostname.replace(/^www\./, "") : <span className="muted">none</span>}</td>
                  <td style={{ whiteSpace: "nowrap" }}>{r.rating !== null ? `${r.rating} ★` : "—"} <span className="muted">{r.reviews !== null ? `(${r.reviews.toLocaleString()})` : ""}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 && <p className="muted" style={{ padding: "1rem" }}>No listings in that state. Try a nearby city or a broader term.</p>}
        </div>
      )}
    </div>
  );
}
