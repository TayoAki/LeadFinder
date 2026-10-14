"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Lead = {
  id: number; run_id: number; email: string | null; email_status: string | null; email_provider: string | null; mobile: string | null;
  opening_line: string | null; credits: number; treg_cost_micro: number; full_name: string; title: string | null;
  linkedin_url: string | null; company: string | null; domain: string; created_at: string;
};
type Attempt = { step: string; provider: string | null; outcome: string; cost_micro: number };

const STATUSES: [string, string][] = [
  ["all", "All"], ["verified", "Verified"], ["catch_all", "Catch-all"], ["risky", "Risky"], ["not_found", "No email"], ["has_mobile", "Has mobile"],
];
const SORTS: [string, string][] = [["newest", "Newest"], ["oldest", "Oldest"], ["name", "Name"], ["company", "Company"], ["status", "Status"], ["credits", "Credits"]];
const pillColor: Record<string, string> = { verified: "var(--ok)", catch_all: "var(--warn)", risky: "var(--warn)", invalid: "var(--bad)" };

// Windowed rendering: only the rows in view (plus a buffer) are in the DOM, so 10,000 rows scroll smoothly.
const ROW_H = 56;
const VIEW_H = 560;
const BUFFER = 8;
const COLS = "36px minmax(160px,1.3fr) minmax(140px,1fr) minmax(200px,1.4fr) 110px 120px 60px";

export default function LeadsTable({ isAdmin }: { isAdmin: boolean }) {
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("newest");
  const [q, setQ] = useState("");
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState<Lead[] | null>(null);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [open, setOpen] = useState<Lead | null>(null);
  const [attempts, setAttempts] = useState<Attempt[] | null>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [busy, setBusy] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);

  // Debounce typing so search doesn't fire on every keystroke.
  useEffect(() => {
    const t = setTimeout(() => setQuery(q), 250);
    return () => clearTimeout(t);
  }, [q]);

  const params = useMemo(() => new URLSearchParams({ status, sort, ...(query ? { q: query } : {}) }).toString(), [status, sort, query]);

  const load = useCallback(async () => {
    const res = await fetch(`/api/leads?${params}`);
    if (res.ok) setRows(await res.json());
  }, [params]);

  useEffect(() => {
    setSelected(new Set());
    scroller.current?.scrollTo({ top: 0 });
    load();
  }, [load]);

  useEffect(() => {
    if (!open) return;
    setAttempts(null);
    fetch(`/api/leads/${open.id}`).then((r) => r.json()).then(setAttempts).catch(() => setAttempts([]));
  }, [open]);

  if (!rows) return <p className="muted">Loading…</p>;

  const first = Math.max(0, Math.floor(scrollTop / ROW_H) - BUFFER);
  const last = Math.min(rows.length, Math.ceil((scrollTop + VIEW_H) / ROW_H) + BUFFER);
  const allSelected = rows.length > 0 && selected.size === rows.length;
  const toggle = (id: number) => setSelected((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  async function removeSelected() {
    if (!confirm(`Delete ${selected.size} lead${selected.size === 1 ? "" : "s"}? This can't be undone.`)) return;
    setBusy(true);
    await fetch("/api/leads", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ids: [...selected] }) });
    setBusy(false);
    setOpen(null);
    await load();
    setSelected(new Set());
  }

  const exportHref = `/api/leads/export?${params}${selected.size ? `&ids=${[...selected].join(",")}` : ""}`;

  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap", alignItems: "center" }}>
        <input
          placeholder="Search name, company, email, title"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ padding: ".5rem .7rem", borderRadius: 8, border: "1px solid var(--line)", background: "var(--surface)", color: "var(--ink)", font: "inherit", minWidth: 240, flex: "1 1 240px" }}
        />
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="btn" aria-label="Sort by">
          {SORTS.map(([v, l]) => <option key={v} value={v}>Sort: {l}</option>)}
        </select>
        <a className="btn" href={exportHref}>Export {selected.size ? `${selected.size} selected` : "CSV"}</a>
        {selected.size > 0 && <button className="btn" onClick={removeSelected} disabled={busy} style={{ color: "var(--bad)" }}>Delete {selected.size}</button>}
      </div>
      <div style={{ display: "flex", gap: ".4rem", flexWrap: "wrap" }}>
        {STATUSES.map(([v, l]) => (
          <button key={v} className="pill" onClick={() => setStatus(v)}
            style={{ cursor: "pointer", background: status === v ? "var(--ink)" : "transparent", color: status === v ? "var(--bg)" : "inherit", font: "inherit", fontSize: ".85rem" }}>
            {l}
          </button>
        ))}
        <span className="muted" style={{ marginLeft: "auto", fontSize: ".9rem" }}>{rows.length.toLocaleString()} leads</span>
      </div>

      <div className="card" style={{ padding: 0, overflowX: "auto" }}>
        <div style={{ minWidth: 860 }}>
          <div style={{ display: "grid", gridTemplateColumns: COLS, alignItems: "center", padding: "0 .75rem", height: 40, borderBottom: "1px solid var(--line)" }} className="muted">
            <input type="checkbox" aria-label="Select all" checked={allSelected} onChange={() => setSelected(allSelected ? new Set() : new Set(rows.map((r) => r.id)))} />
            <span>Person</span><span>Company</span><span>Email</span><span>Status</span><span>Mobile</span><span>Credits</span>
          </div>
          {rows.length === 0 ? (
            <p className="muted" style={{ padding: "1.5rem" }}>{query || status !== "all" ? "No leads match these filters." : "No leads yet. Run a search from your ICP."}</p>
          ) : (
            <div ref={scroller} onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)} style={{ height: Math.min(VIEW_H, rows.length * ROW_H), overflowY: "auto", position: "relative" }}>
              <div style={{ height: rows.length * ROW_H, position: "relative" }}>
                {rows.slice(first, last).map((l, i) => (
                  <div key={l.id} onClick={() => setOpen(l)}
                    style={{ position: "absolute", top: (first + i) * ROW_H, left: 0, right: 0, height: ROW_H, display: "grid", gridTemplateColumns: COLS,
                      alignItems: "center", padding: "0 .75rem", borderBottom: "1px solid var(--line)", cursor: "pointer",
                      background: open?.id === l.id ? "var(--bg)" : undefined, fontSize: ".9rem" }}>
                    <input type="checkbox" aria-label={`Select ${l.full_name}`} checked={selected.has(l.id)} onClick={(e) => e.stopPropagation()} onChange={() => toggle(l.id)} />
                    <Two top={l.full_name} sub={l.title} />
                    <Two top={l.company} sub={l.domain.startsWith("name:") ? null : l.domain} />
                    <Two top={l.email ?? "—"} sub={l.email_provider ? `via ${l.email_provider}` : null} />
                    <span><span className="pill" style={{ color: pillColor[l.email_status ?? ""] }}>{(l.email_status ?? "—").replace("_", "-")}</span></span>
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.mobile ?? ""}</span>
                    <span>{l.credits}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {open && (
        <aside role="dialog" aria-label="Lead details"
          style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: "min(420px, 100vw)", background: "var(--surface)", borderLeft: "1px solid var(--line)",
            padding: "1.25rem", overflowY: "auto", boxShadow: "-8px 0 24px rgba(0,0,0,.12)", zIndex: 10 }}>
          <button className="btn" onClick={() => setOpen(null)} style={{ float: "right" }}>Close</button>
          <h2 style={{ marginTop: 0 }}>{open.full_name}</h2>
          <p className="muted" style={{ marginTop: 0 }}>{open.title}{open.company ? ` · ${open.company}` : ""}</p>
          <dl style={{ display: "grid", gridTemplateColumns: "110px 1fr", gap: ".35rem .75rem", margin: "1rem 0" }}>
            <dt className="muted">Email</dt><dd style={{ margin: 0 }}>{open.email ?? "—"} {open.email_status && <span className="pill" style={{ color: pillColor[open.email_status] }}>{open.email_status.replace("_", "-")}</span>}</dd>
            <dt className="muted">Found by</dt><dd style={{ margin: 0 }}>{open.email_provider ?? "—"}</dd>
            {open.mobile && <><dt className="muted">Mobile</dt><dd style={{ margin: 0 }}>{open.mobile}</dd></>}
            {!open.domain.startsWith("name:") && <><dt className="muted">Website</dt><dd style={{ margin: 0 }}>{open.domain}</dd></>}
            {open.linkedin_url && <><dt className="muted">LinkedIn</dt><dd style={{ margin: 0 }}><a href={open.linkedin_url} target="_blank" rel="noreferrer">Profile</a></dd></>}
            <dt className="muted">Credits</dt><dd style={{ margin: 0 }}>{open.credits}{isAdmin ? ` · Treg $${(open.treg_cost_micro / 1e6).toFixed(4)}` : ""}</dd>
            <dt className="muted">Run</dt><dd style={{ margin: 0 }}>#{open.run_id}</dd>
          </dl>
          {open.opening_line && (
            <div className="card" style={{ marginBottom: "1rem" }}>
              <div className="muted" style={{ fontSize: ".8rem" }}>Opening line</div>
              {open.opening_line}
            </div>
          )}
          <h3>Attempt history</h3>
          {!attempts ? <p className="muted">Loading…</p> : (
            <ol style={{ paddingLeft: "1.2rem", margin: 0 }}>
              {attempts.map((a, i) => (
                <li key={i} style={{ marginBottom: ".25rem" }}>
                  {a.step.replace("_", " ")} · {a.provider ?? "—"} · <span style={{ color: a.outcome === "hit" || a.outcome === "verified" ? "var(--ok)" : undefined }}>{a.outcome}</span>
                  {isAdmin && a.cost_micro ? <span className="muted"> · ${(a.cost_micro / 1e6).toFixed(4)}</span> : null}
                </li>
              ))}
            </ol>
          )}
        </aside>
      )}
    </div>
  );
}

function Two({ top, sub }: { top: string | null; sub: string | null }) {
  const clip = { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } as const;
  return (
    <span style={{ minWidth: 0, paddingRight: ".5rem" }}>
      <div style={clip}>{top ?? "—"}</div>
      {sub && <div className="muted" style={{ ...clip, fontSize: ".78rem" }}>{sub}</div>}
    </span>
  );
}
