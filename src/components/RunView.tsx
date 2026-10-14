"use client";
import { Fragment, useEffect, useState } from "react";

type Lead = {
  id: number; state: string; email: string | null; email_status: string | null; email_provider: string | null; mobile: string | null;
  opening_line: string | null; credits: number; treg_cost_micro?: number; full_name: string; title: string | null;
  linkedin_url: string | null; company: string | null; domain: string;
};
type Attempt = { lead_id: number; step: string; provider: string | null; outcome: string; cost_micro?: number };
type Summary = {
  run: { id: number; status: string; target: number; max_credits: number; charged: number };
  leads: Lead[]; attempts: Attempt[]; hold: { amount: number; charged: number; status: string }; tregCostMicro: number;
};

const LIVE = new Set(["quoted", "held", "running"]);
const pillColor: Record<string, string> = { verified: "var(--ok)", catch_all: "var(--warn)", risky: "var(--warn)", invalid: "var(--bad)" };

export default function RunView({ runId, isAdmin }: { runId: number; isAdmin: boolean }) {
  const [s, setS] = useState<Summary | null>(null);
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    let stop = false;
    const load = async () => {
      const res = await fetch(`/api/runs/${runId}`);
      if (!res.ok || stop) return;
      const data: Summary = await res.json();
      setS(data);
      if (LIVE.has(data.run.status)) setTimeout(load, 1500);
    };
    load();
    return () => { stop = true; };
  }, [runId]);

  if (!s) return <p className="muted">Loading…</p>;
  const verified = s.leads.filter((l) => l.email_status === "verified").length;
  const unconfirmed = s.leads.filter((l) => l.email_status === "catch_all" || l.email_status === "risky").length;
  const done = s.leads.filter((l) => ["done", "error", "stopped"].includes(l.state)).length;
  const byProvider = new Map<string, number>();
  for (const l of s.leads) if (l.email && l.email_provider) byProvider.set(l.email_provider, (byProvider.get(l.email_provider) ?? 0) + 1);
  const live = LIVE.has(s.run.status);

  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      <div className="card" style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
        <Stat label="status" value={s.run.status} />
        <Stat label="people found" value={`${s.leads.length} / ${s.run.target}`} />
        <Stat label="processed" value={String(done)} />
        <Stat label="verified" value={String(verified)} />
        <Stat label="catch-all / risky" value={String(unconfirmed)} />
        <Stat label="credits" value={`${s.hold?.charged ?? 0} of ${s.run.max_credits} held${!live ? ` · ${s.run.max_credits - (s.hold?.charged ?? 0)} refunded` : ""}`} />
        {isAdmin && <Stat label="Treg cost" value={`$${(s.tregCostMicro / 1e6).toFixed(4)}`} />}
      </div>
      {byProvider.size > 0 && (
        <div className="card">
          <div className="muted" style={{ marginBottom: ".4rem" }}>Emails found by provider</div>
          <div style={{ display: "flex", height: 10, borderRadius: 6, overflow: "hidden", background: "var(--line)" }}>
            {[...byProvider].map(([p, n], i) => (
              <div key={p} title={`${p}: ${n}`} style={{ flex: n, background: `hsl(${215 + i * 40} 70% 55%)` }} />
            ))}
          </div>
          <div className="muted" style={{ fontSize: ".85rem", marginTop: ".4rem" }}>{[...byProvider].map(([p, n]) => `${p} ${n}`).join(" · ")}</div>
        </div>
      )}
      <div className="card" style={{ overflowX: "auto" }}>
        <table>
          <thead><tr><th>Person</th><th>Company</th><th>Email</th><th>Status</th>{s.leads.some((l) => l.mobile) && <th>Mobile</th>}<th>Credits</th></tr></thead>
          <tbody>
            {s.leads.map((l) => (
              <Fragment key={l.id}>
                <tr onClick={() => setOpen(open === l.id ? null : l.id)} style={{ cursor: "pointer" }}>
                  <td>{l.full_name}<div className="muted" style={{ fontSize: ".8rem" }}>{l.title}</div></td>
                  <td>{l.company}<div className="muted" style={{ fontSize: ".8rem" }}>{l.domain.startsWith("name:") ? "" : l.domain}</div></td>
                  <td>{l.email ?? <span className="muted">{l.state === "done" ? "—" : "…"}</span>}</td>
                  <td>
                    <span className="pill" style={{ color: pillColor[l.email_status ?? ""] }}>
                      {l.state === "done" || l.state === "error" || l.state === "stopped" ? (l.email_status ?? l.state).replace("_", "-") : l.state.replace("_", " ")}
                    </span>
                  </td>
                  {s.leads.some((x) => x.mobile) && <td>{l.mobile ?? ""}</td>}
                  <td>{l.credits}</td>
                </tr>
                {open === l.id && (
                  <tr>
                    <td colSpan={6} style={{ background: "var(--bg)" }}>
                      {l.opening_line && <p><span className="muted">Opening line:</span> {l.opening_line}</p>}
                      {l.linkedin_url && <p><a href={l.linkedin_url} target="_blank" rel="noreferrer">LinkedIn profile</a></p>}
                      <div className="muted">Attempt history</div>
                      <ol style={{ margin: ".3rem 0", paddingLeft: "1.2rem" }}>
                        {s.attempts.filter((a) => a.lead_id === l.id).map((a, i) => (
                          <li key={i}>{a.step} · {a.provider ?? "—"} · {a.outcome}{isAdmin && a.cost_micro ? ` · $${(a.cost_micro / 1e6).toFixed(4)}` : ""}</li>
                        ))}
                      </ol>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
        {s.leads.length === 0 && <p className="muted">{live ? "Finding people at matching companies…" : "No matching people were found. Try widening your ICP."}</p>}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return <div><div style={{ fontWeight: 600 }}>{value}</div><div className="muted" style={{ fontSize: ".8rem" }}>{label}</div></div>;
}
