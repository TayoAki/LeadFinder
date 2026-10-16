"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "./shared";

type Result = { kind: string; created: number; updated: number; skipped: number };
const KIND: Record<string, string> = { leads_json: "leads.json", sponsor_csv: "sponsor_leads CSV", contacts_csv: "contacts.csv" };

export default function Import() {
  const router = useRouter();
  const [result, setResult] = useState<(Result & { file: string }) | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    if (f.size > 25_000_000) return setError("That file is over 25 MB");
    setBusy(true); setError(null); setResult(null);
    try {
      const r = await api<Result>("/api/deals/import", { method: "POST", json: { filename: f.name, text: await f.text() } });
      setResult({ ...r, file: f.name });
      router.refresh();
    } catch (err) { setError((err as Error).message); }
    setBusy(false);
  }

  return (
    <div style={{ display: "grid", gap: "1rem", maxWidth: 720 }}>
      <div className="card">
        <h3 style={{ marginTop: 0 }}>Import from SBA Search</h3>
        <p className="muted">Upload any of these, as often as you like. Importing is free. Re-importing refreshes the data but never touches your stages, tasks, notes or checklists.</p>
        <ul className="muted" style={{ paddingLeft: "1.2rem" }}>
          <li><strong>leads.json</strong> from <code>build_leads.py</code>: businesses with owner, age, size, fit tier and the reasons for it.</li>
          <li><strong>sponsor_leads_&lt;state&gt;_&lt;segment&gt;.csv</strong> from <code>sponsor.py</code>.</li>
          <li><strong>contacts.csv</strong> from <code>enrich_contacts.py</code>: adds website, phone and owner email to leads you've already imported.</li>
        </ul>
        <input type="file" accept=".json,.csv,application/json,text/csv" onChange={onPick} disabled={busy} />
        {busy && <p className="muted">Importing…</p>}
      </div>
      {error && <p className="error">{error}</p>}
      {result && (
        <div className="card">
          <strong>{result.file}</strong> <span className="muted">({KIND[result.kind] ?? result.kind})</span>
          <p style={{ marginBottom: ".5rem" }}>{result.created.toLocaleString()} added · {result.updated.toLocaleString()} updated · {result.skipped.toLocaleString()} skipped</p>
          <Link className="btn primary" href="/deals">Open pipeline</Link>
        </div>
      )}
    </div>
  );
}
