"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Counts, Icp } from "@/lib/icp.ts";

const PER_LEAD = { person: 1, email: 4, mobile: 10 };
const list = (s: string) => s.split(",").map((x) => x.trim()).filter(Boolean);

export default function IcpEditor({ id, website, initial, initialCounts, balance }: {
  id: number; website: string; initial: Icp; initialCounts: Counts | null; balance: number;
}) {
  const router = useRouter();
  const [icp, setIcp] = useState(initial);
  const [counts, setCounts] = useState(initialCounts);
  const [typed, setTyped] = useState(0);
  const [saving, setSaving] = useState(false);
  const [target, setTarget] = useState(50);
  const [wantMobile, setWantMobile] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    if (typed >= icp.summary.length) return;
    const t = setTimeout(() => setTyped((n) => n + 3), 12);
    return () => clearTimeout(t);
  }, [typed, icp.summary]);

  const maxCredits = target * (PER_LEAD.person + PER_LEAD.email + (wantMobile ? PER_LEAD.mobile : 0));

  async function save() {
    setSaving(true);
    setError(null);
    const res = await fetch(`/api/icp/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(icp) });
    const data = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) return setError(data.error ?? "Could not save");
    setIcp(data.icp);
    setCounts(data.counts);
  }

  async function find() {
    setStarting(true);
    setError(null);
    const res = await fetch("/api/runs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ icpId: id, target, wantMobile }) });
    const data = await res.json().catch(() => ({}));
    setStarting(false);
    if (!res.ok) return setError(data.error ?? "Could not start the run");
    router.push(`/leads?run=${data.id}`);
  }

  const listField = (key: "industries" | "keywords" | "jobTitles" | "countries" | "exclusions", label: string) => (
    <label className="field">{label}
      <input value={icp[key].join(", ")} onChange={(e) => setIcp({ ...icp, [key]: list(e.target.value) })} />
    </label>
  );

  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      <div className="card">
        <div className="muted">{website}</div>
        <p style={{ fontSize: "1.1rem", minHeight: "3em" }}>{icp.summary.slice(0, typed)}</p>
        <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
          <div><div style={{ fontSize: "1.6rem", fontWeight: 600 }}>{counts?.companies?.toLocaleString() ?? "—"}</div><div className="muted">matching companies</div></div>
          <div><div style={{ fontSize: "1.6rem", fontWeight: 600 }}>{counts?.people?.toLocaleString() ?? "—"}</div><div className="muted">decision makers</div></div>
        </div>
        <p className="muted" style={{ marginBottom: 0, fontSize: ".85rem" }}>Counts are free. You only spend credits when you find leads.</p>
      </div>

      <div className="card">
        <h3>Who we&apos;ll look for</h3>
        {listField("jobTitles", "Job titles")}
        {listField("industries", "Industries")}
        {listField("keywords", "Keywords")}
        {listField("countries", "Countries")}
        {listField("exclusions", "Exclude")}
        <div style={{ display: "flex", gap: "1rem" }}>
          <label className="field">Min employees<input type="number" min={1} value={icp.employeeMin} onChange={(e) => setIcp({ ...icp, employeeMin: Number(e.target.value) })} /></label>
          <label className="field">Max employees<input type="number" min={1} value={icp.employeeMax} onChange={(e) => setIcp({ ...icp, employeeMax: Number(e.target.value) })} /></label>
        </div>
        <button className="btn" onClick={save} disabled={saving}>{saving ? "Counting…" : "Save and recount"}</button>
      </div>

      <div className="card">
        <h3>Find leads</h3>
        <div style={{ display: "flex", gap: "1rem", alignItems: "end", flexWrap: "wrap" }}>
          <label className="field" style={{ marginBottom: 0 }}>How many
            <input type="number" min={1} max={1000} value={target} onChange={(e) => setTarget(Math.max(1, Number(e.target.value)))} style={{ width: 120 }} />
          </label>
          <label style={{ display: "flex", gap: ".4rem", alignItems: "center" }}>
            <input type="checkbox" checked={wantMobile} onChange={(e) => setWantMobile(e.target.checked)} /> Also find mobile numbers
          </label>
        </div>
        <p className="muted">
          Holds up to <strong>{maxCredits.toLocaleString()} credits</strong> (you have {balance.toLocaleString()}). You pay 1 per person found,
          4 per verified email (2 if catch-all or risky){wantMobile ? ", 10 per mobile" : ""}. Unused credits come back when the run ends.
        </p>
        {error && <p className="error">{error}</p>}
        <button className="btn primary" onClick={find} disabled={starting || maxCredits > balance}>
          {starting ? "Starting…" : `Find ${target} leads`}
        </button>
      </div>
    </div>
  );
}
