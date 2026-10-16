"use client";
import { useCallback, useEffect, useState } from "react";
import { STAGES, api, money, range, stageLabel } from "./shared";

type Detail = {
  business: Record<string, any> & { fit_met: string[]; fit_missed: string[] };
  tasks: { id: number; kind: string; channel: string | null; title: string; due_date: string | null; done_at: string | null }[];
  activity: { kind: string; body: string; created_at: string; who: string | null }[];
  dd: Record<string, { done: boolean; note: string | null }>;
};
type Section = { id: string; label: string; items: [string, string][] };
type Box = { industries: string; geography: string; minAgeYears: number; ebitdaMin: number; ebitdaMax: number; dealBreakers: string };

const KIND_LABEL: Record<string, string> = { note: "Note", call: "Call", email: "Email", letter: "Letter", meeting: "Meeting", stage: "Stage", cadence: "Cadence", task: "Task", enrich: "Contact", import: "Added" };

export default function Detail({ id, ddSections, buyBox }: { id: number; ddSections: Section[]; buyBox: Box }) {
  const [d, setD] = useState<Detail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [noteKind, setNoteKind] = useState("note");
  const [task, setTask] = useState({ title: "", due: "" });
  const [deal, setDeal] = useState({ assignee: "", nextStep: "", dueDate: "" });

  const load = useCallback(async () => {
    const x = await api<Detail>(`/api/deals/${id}`);
    setD(x);
    setDeal({ assignee: x.business.assignee ?? "", nextStep: x.business.next_step ?? "", dueDate: x.business.due_date ?? "" });
  }, [id]);
  useEffect(() => { load().catch((e) => setError(e.message)); }, [load]);

  async function act(label: string, fn: () => Promise<unknown>) {
    setBusy(label); setError(null);
    try { await fn(); await load(); } catch (e) { setError((e as Error).message); }
    setBusy(null);
  }

  if (error && !d) return <p className="error">{error}</p>;
  if (!d) return <p className="muted">Loading…</p>;
  const b = d.business;
  const today = new Date().toISOString().slice(0, 10);
  const ddDone = Object.values(d.dd).filter((x) => x.done).length;
  const ddTotal = ddSections.reduce((n, s) => n + s.items.length, 0);
  const boxChecks: [string, boolean | null][] = [
    [`${buyBox.minAgeYears}+ years in business`, b.age_years === null ? null : b.age_years >= buyBox.minAgeYears],
    [`EBITDA ${money(buyBox.ebitdaMin)}–${money(buyBox.ebitdaMax)}`, b.ebitda_lo === null && b.ebitda_hi === null ? null
      : (b.ebitda_hi ?? b.ebitda_lo) >= buyBox.ebitdaMin && (b.ebitda_lo ?? b.ebitda_hi) <= buyBox.ebitdaMax],
  ];

  return (
    <div className="detail">
      <header className="detail-head">
        <div style={{ minWidth: 0 }}>
          <h1 style={{ marginBottom: ".2rem" }}>{b.name}</h1>
          <div className="muted">{[b.industry, [b.city, b.state].filter(Boolean).join(", "), b.metro].filter(Boolean).join(" · ")}</div>
        </div>
        <div style={{ display: "flex", gap: ".5rem", alignItems: "center", flexWrap: "wrap" }}>
          {b.tier && <span className="pill">Tier {b.tier}</span>}
          {b.score !== null && <span className="pill">Score {Math.round(b.score)}</span>}
          <select className="btn" aria-label="Stage" value={b.stage} disabled={busy !== null}
            onChange={(e) => act("stage", () => api(`/api/deals/${id}`, { method: "PATCH", json: { stage: e.target.value } }))}>
            {STAGES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </div>
      </header>
      {error && <p className="error">{error}</p>}

      <div className="detail-grid">
        <div style={{ display: "grid", gap: "1rem", alignContent: "start" }}>
          <section className="card">
            <h3>Owner and contact</h3>
            <dl className="kv">
              <dt>Owner</dt><dd>{b.owner_name ?? <span className="muted">not known yet</span>}{b.owner_title ? <span className="muted">, {b.owner_title}</span> : null}</dd>
              <dt>Email</dt><dd>{b.owner_email ? <><a href={`mailto:${b.owner_email}`}>{b.owner_email}</a> <span className="pill">{String(b.email_status ?? "").replace("_", "-")}</span></> : <span className="muted">{b.email_status === "not_found" ? "not found" : "—"}</span>}</dd>
              <dt>Phone</dt><dd>{b.phone ? <a href={`tel:${b.phone}`}>{b.phone}</a> : "—"}</dd>
              <dt>Website</dt><dd>{b.website ? <a href={b.website} target="_blank" rel="noreferrer">{String(b.website).replace(/^https?:\/\/(www\.)?/, "").replace(/[/?].*$/, "")}</a> : "—"}</dd>
              <dt>Address</dt><dd>{[b.address, b.city, b.state, b.zip].filter(Boolean).join(", ") || "—"}</dd>
              {b.rating !== null && <><dt>Google</dt><dd>{b.rating} ★ ({b.reviews ?? 0} reviews){b.maps_url ? <> · <a href={b.maps_url} target="_blank" rel="noreferrer">listing</a></> : null}</dd></>}
            </dl>
            {(!b.owner_email || !b.owner_name) && (
              <div style={{ marginTop: ".75rem" }}>
                <button className="btn" disabled={busy !== null || !b.website} onClick={() => act("enrich", () => api(`/api/deals/${id}/enrich`, { method: "POST" }))}>
                  {busy === "enrich" ? "Looking up…" : b.owner_name ? "Find owner's email" : "Find owner and email"}
                </button>
                <span className="muted" style={{ fontSize: ".8rem", marginLeft: ".5rem" }}>{b.website ? "Up to 5 credits, only for what's found" : "Needs a website"}</span>
              </div>
            )}
          </section>

          <section className="card">
            <h3>Fit and size</h3>
            {b.why && <p style={{ marginTop: 0 }}>{b.why}</p>}
            <dl className="kv">
              <dt>Years in business</dt><dd>{b.age_years !== null ? Math.round(b.age_years) : "—"}{b.reg_date ? <span className="muted"> (since {b.reg_date})</span> : null}</dd>
              <dt>Est. revenue</dt><dd>{range(b.rev_lo, b.rev_hi)}</dd>
              <dt>Est. EBITDA</dt><dd>{range(b.ebitda_lo, b.ebitda_hi)}</dd>
              <dt>Est. payroll</dt><dd>{money(b.est_payroll)}</dd>
              {b.role && <><dt>Role</dt><dd>{b.role}</dd></>}
              {b.family_run === 1 && <><dt>Ownership</dt><dd>Founder or family run</dd></>}
            </dl>
            {(b.fit_met.length > 0 || b.fit_missed.length > 0) && (
              <div className="signals">
                {b.fit_met.map((s) => <span key={s} className="pill sig-met">✓ {s}</span>)}
                {b.fit_missed.map((s) => <span key={s} className="pill sig-missed">✗ {s}</span>)}
              </div>
            )}
            {b.watch && <p className="muted" style={{ marginBottom: 0 }}><strong>Watch-outs:</strong> {b.watch}</p>}
            <div className="buybox-check">
              <div className="muted" style={{ fontSize: ".8rem" }}>Against your buy box</div>
              {boxChecks.map(([label, ok]) => (
                <div key={label}>{ok === null ? "–" : ok ? "✓" : "✗"} {label}{ok === null ? <span className="muted"> (unknown)</span> : null}</div>
              ))}
            </div>
            <p className="muted" style={{ fontSize: ".8rem", marginBottom: 0 }}>Size figures are estimates for deciding who to call, not valuations.</p>
          </section>

          <section className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <h3>Due diligence</h3><span className="muted">{ddDone}/{ddTotal}</span>
            </div>
            <div className="progress" aria-hidden="true"><span style={{ width: `${(ddDone / ddTotal) * 100}%` }} /></div>
            {ddSections.map((s) => {
              const n = s.items.filter(([k]) => d.dd[k]?.done).length;
              return (
                <details key={s.id} className="dd-section">
                  <summary>{s.label} <span className="muted">{n}/{s.items.length}</span></summary>
                  {s.items.map(([k, label]) => (
                    <label key={k} className="dd-item">
                      <input type="checkbox" checked={d.dd[k]?.done ?? false}
                        onChange={(e) => act(`dd:${k}`, () => api(`/api/deals/${id}/dd`, { method: "PUT", json: { key: k, done: e.target.checked } }))} />
                      <span>{label}</span>
                    </label>
                  ))}
                </details>
              );
            })}
          </section>
        </div>

        <div style={{ display: "grid", gap: "1rem", alignContent: "start" }}>
          <section className="card">
            <h3>Deal</h3>
            <form onSubmit={(e) => { e.preventDefault(); act("deal", () => api(`/api/deals/${id}`, { method: "PATCH", json: deal })); }}>
              <label className="field">Assigned to<input value={deal.assignee} onChange={(e) => setDeal({ ...deal, assignee: e.target.value })} placeholder="Who owns this deal" /></label>
              <label className="field">Next step<input value={deal.nextStep} onChange={(e) => setDeal({ ...deal, nextStep: e.target.value })} placeholder="e.g. Send NDA" /></label>
              <label className="field">Due<input type="date" value={deal.dueDate} onChange={(e) => setDeal({ ...deal, dueDate: e.target.value })} /></label>
              <button className="btn" disabled={busy !== null}>Save</button>
            </form>
          </section>

          <section className="card">
            <h3>Outreach and tasks</h3>
            {!b.cadence_started_at && (
              <div style={{ marginBottom: ".75rem" }}>
                <button className="btn primary" disabled={busy !== null} onClick={() => act("cadence", () => api(`/api/deals/${id}/cadence`, { method: "POST" }))}>Start outreach cadence</button>
                <div className="muted" style={{ fontSize: ".8rem", marginTop: ".3rem" }}>Letter today, call on day 7, email on day 10, call on day 21, warm close on day 30.</div>
              </div>
            )}
            {d.tasks.length === 0 ? <p className="muted">No tasks yet.</p> : (
              <div>
                {d.tasks.map((t) => (
                  <label key={t.id} className={`task-row compact${t.done_at ? " done" : ""}`}>
                    <input type="checkbox" checked={Boolean(t.done_at)} onChange={(e) => act(`task:${t.id}`, () => api(`/api/deals/tasks/${t.id}`, { method: "PATCH", json: { done: e.target.checked } }))} />
                    <span style={{ flex: 1 }}>{t.title}</span>
                    {t.due_date && <span className={`muted${!t.done_at && t.due_date < today ? " overdue" : ""}`} style={{ fontSize: ".8rem" }}>{t.due_date}</span>}
                  </label>
                ))}
              </div>
            )}
            <form style={{ display: "flex", gap: ".4rem", marginTop: ".75rem", flexWrap: "wrap" }}
              onSubmit={(e) => { e.preventDefault(); act("task", async () => { await api(`/api/deals/${id}/tasks`, { method: "POST", json: { title: task.title, dueDate: task.due } }); setTask({ title: "", due: "" }); }); }}>
              <input className="search" style={{ flex: "2 1 160px" }} placeholder="Add a task" value={task.title} onChange={(e) => setTask({ ...task, title: e.target.value })} />
              <input className="search" style={{ flex: "1 1 120px" }} type="date" aria-label="Due date" value={task.due} onChange={(e) => setTask({ ...task, due: e.target.value })} />
              <button className="btn" disabled={busy !== null || !task.title.trim()}>Add</button>
            </form>
          </section>

          <section className="card">
            <h3>Notes and activity</h3>
            <form onSubmit={(e) => { e.preventDefault(); act("note", async () => { await api(`/api/deals/${id}/notes`, { method: "POST", json: { kind: noteKind, body: note } }); setNote(""); }); }}>
              <textarea className="search" rows={3} style={{ width: "100%" }} placeholder="What happened? e.g. Spoke to Don, retiring in 2 years, wants staff kept on." value={note} onChange={(e) => setNote(e.target.value)} />
              <div style={{ display: "flex", gap: ".4rem", marginTop: ".4rem" }}>
                <select className="btn" value={noteKind} onChange={(e) => setNoteKind(e.target.value)} aria-label="Type">
                  <option value="note">Note</option><option value="call">Call</option><option value="email">Email</option><option value="letter">Letter</option><option value="meeting">Meeting</option>
                </select>
                <button className="btn" disabled={busy !== null || !note.trim()}>Add</button>
              </div>
            </form>
            <ol className="timeline">
              {d.activity.map((a, i) => (
                <li key={i}>
                  <span className="pill">{KIND_LABEL[a.kind] ?? a.kind}</span> {a.body}
                  <div className="muted" style={{ fontSize: ".75rem" }}>{a.created_at}{a.who ? ` · ${a.who}` : ""}</div>
                </li>
              ))}
            </ol>
          </section>
          <p className="muted" style={{ fontSize: ".8rem" }}>Stage: {stageLabel(b.stage)} · source: {b.source === "maps" ? "Google Maps search" : b.source === "sba_import" ? "SBA Search import" : b.source}</p>
        </div>
      </div>
    </div>
  );
}
